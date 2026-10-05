import { createNotification } from "@/lib/notifications";
import "server-only";
import { randomUUID } from "node:crypto";
import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { moderateCommentText, MODERATION_MODEL } from "@/lib/discussion/groq-moderation";
import { COMMENT_MAX_LENGTH, COMMENT_LEASE_MS, COMMENT_PROMPT_VERSION,
  COMMENT_POLICY_VERSION, parseCommentAssessment, decideComment } from "./comment-policy";

export const publicCommentWhere = {
  moderationStatus: "APPROVED", publishedAt: { not: null },
  OR: [{ parentId: null }, { parent: { is: { moderationStatus: "APPROVED", publishedAt: { not: null } } } }],
} satisfies Prisma.CommentWhereInput;

const publicPostWhere = { moderationStatus: "APPROVED", publishedAt: { not: null } } satisfies Prisma.PostWhereInput;
class CommentInputError extends Error {}
const fail = (message: string): never => { throw new CommentInputError(message); };

type CommentPostAccessMode =
  | "READ"
  | "INTERACT";

type CommentAccessDb =
  Pick<
    Prisma.TransactionClient,
    | "post"
    | "user"
    | "discussionGroupMember"
  >;

async function inspectPostAccess(
  tx: CommentAccessDb,
  postId: string,
  clerkUserId:
    string |
    null,
  mode:
    CommentPostAccessMode,
) {
  const post =
    await tx.post.findFirst({
      where: {
        id:
          postId,

        ...publicPostWhere,
      },

      include: {
        forum:
          true,

        group: {
          select: {
            id: true,
            slug: true,

            visibility:
              true,

            isActive:
              true,
          },
        },
      },
    });

  if (
    !post ||
    (
      post.forum &&
      !post.forum.isActive
    )
  ) {
    return {
      allowed:
        false as const,

      post:
        null,
    };
  }

  // Normal System Forum post:
  // public read; signed-in users may interact.
  if (!post.groupId) {
    return {
      allowed:
        mode === "READ" ||
        Boolean(
          clerkUserId,
        ),

      post,
    };
  }

  // Broken/inactive Group relation => fail closed.
  if (
    !post.group ||
    !post.group.isActive
  ) {
    return {
      allowed:
        false as const,

      post,
    };
  }

  // PUBLIC Group content is readable by everyone.
  // Interaction still requires ACTIVE membership.
  if (
    mode === "READ" &&
    post.group.visibility ===
      "PUBLIC"
  ) {
    return {
      allowed:
        true as const,

      post,
    };
  }

  if (!clerkUserId) {
    return {
      allowed:
        false as const,

      post,
    };
  }

  const dbUser =
    await tx.user.findUnique({
      where: {
        clerkId:
          clerkUserId,
      },

      select: {
        id: true,
      },
    });

  if (!dbUser) {
    return {
      allowed:
        false as const,

      post,
    };
  }

  const membership =
    await tx.discussionGroupMember.findUnique({
      where: {
        groupId_userId: {
          groupId:
            post.group.id,

          userId:
            dbUser.id,
        },
      },

      select: {
        status:
          true,
      },
    });

  return {
    allowed:
      membership?.status ===
      "ACTIVE",

    post,
  };
}

async function requirePostAccess(
  tx: CommentAccessDb,
  postId: string,
  clerkUserId:
    string |
    null,
  mode:
    CommentPostAccessMode,
) {
  const access =
    await inspectPostAccess(
      tx,
      postId,
      clerkUserId,
      mode,
    );

  const post =
    access.post;

  if (!post) {
    fail(
      "Bài viết hiện không nhận bình luận.",
    );

    // Giúp TypeScript narrow post thành non-null.
    // Runtime thực tế đã dừng ở fail() phía trên.
    throw new Error(
      "Post access invariant failed.",
    );
  }

  if (
    !access.allowed
  ) {
    fail(
      mode === "INTERACT"
        ? "Bạn cần là thành viên đang hoạt động của Group để bình luận."
        : "Bạn không có quyền xem thảo luận này.",
    );

    throw new Error(
      "Post access denied.",
    );
  }

  return post;
}

async function requireParent(tx: Prisma.TransactionClient, postId: string, parentId: string | null) {
  if (!parentId) return null;
  const parent = await tx.comment.findFirst({ where: {
    id: parentId, postId, parentId: null, ...publicCommentWhere,
  } });
  if (!parent) fail("Chỉ có thể trả lời bình luận gốc đã được duyệt của cùng bài viết.");
  return parent;
}

function queueReview(id: string, version: number, token: string) {
  after(async () => {
    try { await runCommentReview(id, version, token); }
    catch (error) { console.error("Comment review worker failed", error instanceof Error ? error.name : "Error"); }
  });
}

function readContent(content: unknown) {
  if (typeof content !== "string" || !content.trim()) fail("Nội dung không được để trống.");
  const text = (content as string).trim();
  if (text.length > COMMENT_MAX_LENGTH) fail(`Nội dung tối đa ${COMMENT_MAX_LENGTH} ký tự.`);
  return text;
}

function errorResult(error: unknown) {
  return { success: false as const, error: error instanceof CommentInputError
    ? error.message : "Không thể thực hiện lúc này. Bạn vui lòng thử lại." };
}

export async function submitComment(postId: string, content: string, parentId: string | null = null, requestId?: string) {
  try {
    const { userId } = await auth();
    if (!userId) fail("Bạn cần đăng nhập để bình luận.");
    if (typeof postId !== "string" || !postId || (parentId !== null && typeof parentId !== "string")) fail("Bài viết hoặc bình luận không hợp lệ.");
    const text = readContent(content);
    if (requestId !== undefined && (typeof requestId !== "string" || !/^[0-9a-f-]{36}$/i.test(requestId))) fail("Mã gửi không hợp lệ.");
    const submissionKey = `${userId}:${requestId || randomUUID()}`;
    const user = await currentUser();
    if (!user) fail("Phiên đăng nhập đã hết hạn.");
    const token = randomUUID();
    const result = await prisma.$transaction(async tx => {
      // Serialize each author's submissions: parallel tabs cannot bypass the limit.
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${userId!}))`;
      await requirePostAccess(
        tx,
        postId,
        userId!,
        "INTERACT",
      );
      const existing = await tx.comment.findUnique({ where: { submissionKey } });
      if (existing) {
        if (existing.postId !== postId || existing.parentId !== parentId || existing.content !== text) fail("Mã gửi đã dùng cho nội dung khác. Hãy tải lại trang.");
        return { comment: existing, created: false };
      }
      await requireParent(tx, postId, parentId);
      const recent = await tx.comment.count({ where: { authorId: userId!, createdAt: { gte: new Date(Date.now() - 60_000) } } });
      if (recent >= 5) fail("Bạn gửi hơi nhanh. Vui lòng chờ một phút.");
      const pending = await tx.comment.count({ where: { authorId: userId!, moderationStatus: "REVIEWING" } });
      if (pending >= 3) fail("Bạn đang có 3 bình luận chờ duyệt. Hãy đợi hoặc kiểm tra lại các bình luận đó.");
      const comment = await tx.comment.create({ data: {
        postId, parentId, content: text, authorId: userId!,
        authorName: user!.username || [user!.firstName, user!.lastName].filter(Boolean).join(" ") || "Thành viên MOSAIC",
        authorImage: user!.imageUrl || null, submissionKey,
        moderationStatus: "REVIEWING", moderationVersion: 1,
        reviewToken: token, reviewStartedAt: new Date(), reviewQueuedAt: new Date(),
      } });
      return { comment, created: true };
    });
    if (result.created) queueReview(result.comment.id, result.comment.moderationVersion, token);
    return { success: true as const, comment: result.comment };
  } catch (error) { return errorResult(error); }
}

export async function listComments(postId: string) {
  try {
    const { userId } = await auth();
    if (typeof postId !== "string" || !postId) fail("Bài viết không hợp lệ.");
    await requirePostAccess(
      prisma,
      postId,
      userId,
      "READ",
    );
    const comments = await prisma.comment.findMany({
      where: { postId, OR: [publicCommentWhere, ...(userId ? [{ authorId: userId }] : [])] },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    });
    // Never send other authors' moderation metadata to a client.
    return { success: true as const, comments: comments.map(comment => comment.authorId === userId
      ? { ...comment, reviewToken: null, submissionKey: null }
      : { ...comment, moderationReasons: [], reviewError: null, reviewToken: null,
          reviewStartedAt: null, reviewQueuedAt: null, submissionKey: null }) };
  } catch (error) { return errorResult(error); }
}

export async function retryOrReviseComment(id: string, content?: string) {
  try {
    const { userId } = await auth();
    if (!userId) fail("Bạn cần đăng nhập.");
    if (typeof id !== "string" || !id) fail("Bình luận không hợp lệ.");
    const text = content === undefined ? undefined : readContent(content);
    const token = randomUUID();
    const comment = await prisma.$transaction(async tx => {
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${userId!}))`;
      const current = await tx.comment.findFirst({ where: { id, authorId: userId! } });
      if (!current) fail("Không tìm thấy bình luận của bạn.");
      if (current!.moderationStatus === "APPROVED") fail("Bước này chỉ hỗ trợ sửa bình luận chưa được duyệt.");
      await requirePostAccess(
        tx,
        current!.postId,
        userId!,
        "INTERACT",
      );
      await requireParent(tx, current!.postId, current!.parentId);
      if (current!.reviewQueuedAt && Date.now() - current!.reviewQueuedAt.getTime() < 60_000) fail("Vui lòng chờ ít nhất một phút giữa các lần gửi duyệt.");
      if (current!.reviewToken && current!.reviewStartedAt && Date.now() - current!.reviewStartedAt.getTime() < COMMENT_LEASE_MS) fail("Bình luận vẫn đang được kiểm duyệt.");
      if (text === undefined && current!.moderationStatus !== "REVIEWING") fail("Hãy sửa nội dung trước khi gửi lại.");
      const pending = await tx.comment.count({ where: { authorId: userId!, moderationStatus: "REVIEWING", id: { not: id } } });
      if (pending >= 3) fail("Hãy đợi các bình luận đang chờ duyệt trước khi gửi lại.");
      const updated = await tx.comment.updateMany({
        where: { id, authorId: userId!, moderationVersion: current!.moderationVersion,
          reviewToken: current!.reviewToken, moderationStatus: current!.moderationStatus },
        data: { content: text ?? current!.content, moderationVersion: { increment: 1 },
          moderationStatus: "REVIEWING", publishedAt: null, moderationReasons: [], reviewError: null,
          reviewToken: token, reviewStartedAt: new Date(), reviewQueuedAt: new Date() },
      });
      if (!updated.count) fail("Trạng thái vừa thay đổi. Hãy tải lại bình luận.");
      return tx.comment.findUniqueOrThrow({ where: { id } });
    });
    queueReview(comment.id, comment.moderationVersion, token);
    return { success: true as const, comment };
  } catch (error) { return errorResult(error); }
}

async function runCommentReview(id: string, version: number, token: string) {
  const identity = { id, moderationVersion: version, reviewToken: token, moderationStatus: "REVIEWING" as const };
  try {
    const comment = await prisma.comment.findFirst({ where: identity,
      include: { post: { include: { forum: true } }, parent: true } });
    if (!comment) return;
    const reviewInput = { forumName: comment.post.forum?.name || "MOSAIC",
      postTitle: comment.post.title, postContent: comment.post.content,
      parentContent: comment.parent?.content || null, content: comment.content };
    const review = parseCommentAssessment(await moderateCommentText(reviewInput));
    const policy = decideComment(review);
    await prisma.$transaction(async tx => {
      const currentPost =
        await requirePostAccess(
          tx,
          comment.postId,
          comment.authorId,
          "INTERACT",
        );
      const currentParent = await requireParent(tx, comment.postId, comment.parentId);
      if (currentPost.moderationVersion !== comment.post.moderationVersion ||
          currentPost.content !== comment.post.content || currentPost.title !== comment.post.title ||
          currentParent?.moderationVersion !== comment.parent?.moderationVersion) {
        throw new Error("Review context changed; retry with current context");
      }
      const changed = await tx.comment.updateMany({ where: identity, data: {
        moderationStatus: policy.status, moderationReasons: policy.reasons,
        publishedAt: policy.status === "APPROVED" ? new Date() : null,
        reviewToken: null, reviewStartedAt: null, reviewError: null,
      } });
      if (!changed.count) return; // An obsolete worker cannot publish or notify.
      await tx.commentModerationReview.create({ data: {
        commentId: id, moderationVersion: version, decision: policy.status,
        submissionSnapshot: { ...reviewInput, postId: comment.postId, parentId: comment.parentId,
          postModerationVersion: comment.post.moderationVersion,
          parentModerationVersion: comment.parent?.moderationVersion ?? null },
        findings: { review, policy } as unknown as Prisma.InputJsonValue,
        modelName: MODERATION_MODEL, promptVersion: COMMENT_PROMPT_VERSION, policyVersion: COMMENT_POLICY_VERSION,
      } });
      if (policy.status !== "APPROVED") return;
      const actor = await tx.user.findUnique({ where: { clerkId: comment.authorId }, select: { id: true } });
      if (!actor) return;
      const recipientClerkIds = [...new Set([comment.post.authorId, comment.parent?.authorId]
        .filter((value): value is string => Boolean(value) && value !== comment.authorId))];
      const recipients = await tx.user.findMany({ where: { clerkId: { in: recipientClerkIds } }, select: { id: true, clerkId: true } });
      for (const recipient of recipients) {
        // Người nhận notification cũng phải còn quyền
        // đọc Post tại thời điểm notification được tạo.
        // Quan trọng với PRIVATE Group khi member đã rời/bị remove.
        const recipientAccess =
          await inspectPostAccess(
            tx,
            comment.postId,
            recipient.clerkId,
            "READ",
          );

        if (
          !recipientAccess.allowed
        ) {
          continue;
        }

        const blocked = await tx.userBlock.findFirst({ where: { OR: [
          { blockerId: recipient.id, blockedId: actor.id },
          { blockerId: actor.id, blockedId: recipient.id },
        ] }, select: { id: true } });
        if (blocked) continue;
        await createNotification({
          recipientId: recipient.id, actorId: actor.id, type: "POST_COMMENT",
          title: `${comment.authorName} đã ${recipient.clerkId === comment.parent?.authorId ? "trả lời bình luận" : "bình luận bài viết"} của bạn`,
          body: comment.content.slice(0, 140),
            href:
              currentPost.group
                ? `/discussion/groups/${currentPost.group.slug}`
                : "/discussion",
          entityType: "COMMENT", entityId: id,
        }, tx);
      }
    });
  } catch {
    // A transport/parser/DB failure is not a rejection of the author's content.
    await prisma.comment.updateMany({ where: identity, data: {
      reviewToken: null, reviewStartedAt: null,
      reviewError: "Hệ thống chưa hoàn tất kiểm duyệt. Nội dung chưa được công khai; bạn có thể thử lại.",
    } });
  }
  revalidatePath("/discussion");
  revalidatePath("/");
}
