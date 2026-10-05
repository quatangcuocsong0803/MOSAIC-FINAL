"use server";

import {
  auth,
} from "@clerk/nextjs/server";

import {
  after,
} from "next/server";

import {
  Prisma,
} from "@prisma/client";

import {
  revalidatePath,
} from "next/cache";

import {
  prisma,
} from "@/lib/prisma";

import {
  DISCUSSION_ATTACHMENT_BUCKET,
  getSupabaseAdmin,
} from "@/lib/supabase-admin";

import {
  runDiscussionModeration,
} from "@/lib/discussion/run-discussion-moderation";

import {
  CITATION_SOURCE_TYPES,
  getMinimumCitationCount,
  getMinimumContentLength,
  POST_KINDS,
  type DiscussionCitationSourceType,
  type DiscussionPostKind,
} from "@/lib/discussion/post-policy";

type RevisionCitationInput = {
  title: string;

  authors?: string;
  year?: string;
  publisher?: string;

  url?: string;
  doi?: string;

  sourceType:
    DiscussionCitationSourceType;
};

type RevisionInput = {
  postId: string;

  forumId: string;
  postKind:
    DiscussionPostKind;

  title: string;
  content: string;

  personalityTag?: string;

  citations:
    RevisionCitationInput[];

  // Attachment cũ user muốn giữ lại.
  retainedAttachmentIds:
    string[];

  // Attachment mới upload trong revision composer.
  uploadSessionId:
    string;

  newAttachmentIds:
    string[];
};

function validHttpUrl(
  raw: string,
) {
  try {
    const url =
      new URL(
        raw,
      );

    return (
      url.protocol ===
        "https:" ||
      url.protocol ===
        "http:"
    );
  } catch {
    return false;
  }
}

function normalizeDoi(
  raw: string,
) {
  return raw
    .trim()
    .replace(
      /^https?:\/\/(dx\.)?doi\.org\//i,
      "",
    )
    .replace(
      /^doi:\s*/i,
      "",
    );
}

function validDoi(
  raw: string,
) {
  return /^10\.\d{4,9}\/\S+$/i.test(
    normalizeDoi(
      raw,
    ),
  );
}

export async function resubmitDiscussionPost(
  input: RevisionInput,
) {
  try {
    const {
      userId,
    } = await auth();

    if (!userId) {
      return {
        success:
          false as const,

        reason:
          "UNAUTHENTICATED" as const,

        error:
          "Bạn cần đăng nhập.",
      };
    }

    // ========================================================
    // ORIGINAL POST
    // ========================================================

    const original =
      await prisma.post.findFirst({
        where: {
          id:
            input.postId,

          authorId:
            userId,
        },

        select: {
          id: true,

          moderationStatus:
            true,

          moderationVersion:
            true,

          groupId:
            true,

          group: {
            select: {
              id: true,
              slug: true,
              isActive: true,
            },
          },

          attachments: {
            select: {
              id: true,

              storagePath:
                true,

              scanStatus:
                true,

              moderationStatus:
                true,
            },
          },
        },
      });

    if (!original) {
      return {
        success:
          false as const,

        reason:
          "NOT_FOUND" as const,

        error:
          "Không tìm thấy bài viết.",
      };
    }

    if (
      original.moderationStatus !==
      "REVISION_REQUIRED"
    ) {
      return {
        success:
          false as const,

        reason:
          "NOT_REVISION_REQUIRED" as const,

        error:
          "Chỉ bài đang ở trạng thái cần chỉnh sửa mới có thể gửi lại.",
      };
    }

    // ========================================================
    // GROUP MEMBERSHIP MUST STILL BE ACTIVE
    // ========================================================

    if (original.groupId) {
      if (
        !original.group ||
        !original.group.isActive
      ) {
        return {
          success:
            false as const,

          reason:
            "INVALID_GROUP" as const,

          error:
            "Group của bài viết không còn hoạt động.",
        };
      }

      const dbUser =
        await prisma.user.findUnique({
          where: {
            clerkId:
              userId,
          },

          select: {
            id: true,
          },
        });

      if (!dbUser) {
        return {
          success:
            false as const,

          reason:
            "GROUP_MEMBERSHIP_REQUIRED" as const,

          error:
            "Bạn không còn quyền gửi revision vào Group này.",
        };
      }

      const membership =
        await prisma.discussionGroupMember.findUnique({
          where: {
            groupId_userId: {
              groupId:
                original.groupId,

              userId:
                dbUser.id,
            },
          },

          select: {
            status: true,
          },
        });

      if (
        membership?.status !==
        "ACTIVE"
      ) {
        return {
          success:
            false as const,

          reason:
            "GROUP_MEMBERSHIP_REQUIRED" as const,

          error:
            "Bạn không còn là thành viên đang hoạt động của Group này.",
        };
      }
    }

    // ========================================================
    // POST KIND
    // ========================================================

    if (
      !POST_KINDS.includes(
        input.postKind,
      )
    ) {
      return {
        success:
          false as const,

        reason:
          "INVALID_POST_KIND" as const,

        error:
          "Loại bài viết không hợp lệ.",
      };
    }

    // ========================================================
    // TITLE / CONTENT
    // ========================================================

    const title =
      input.title
        ?.trim();

    const content =
      input.content
        ?.trim();

    if (
      !title ||
      title.length <
        12
    ) {
      return {
        success:
          false as const,

        reason:
          "TITLE_TOO_SHORT" as const,

        error:
          "Tiêu đề cần ít nhất 12 ký tự.",
      };
    }

    if (
      title.length >
      180
    ) {
      return {
        success:
          false as const,

        reason:
          "TITLE_TOO_LONG" as const,

        error:
          "Tiêu đề tối đa 180 ký tự.",
      };
    }

    const minimumContent =
      getMinimumContentLength(
        input.postKind,
      );

    if (
      !content ||
      content.length <
        minimumContent
    ) {
      return {
        success:
          false as const,

        reason:
          "CONTENT_TOO_SHORT" as const,

        error:
          `Nội dung cần ít nhất ${minimumContent} ký tự.`,
      };
    }

    if (
      content.length >
      15000
    ) {
      return {
        success:
          false as const,

        reason:
          "CONTENT_TOO_LONG" as const,

        error:
          "Nội dung tối đa 15.000 ký tự.",
      };
    }

    const personalityTag =
      input.personalityTag
        ?.trim() ||
      "Chung";

    if (
      personalityTag.length >
      40
    ) {
      return {
        success:
          false as const,

        reason:
          "INVALID_PERSONALITY_TAG" as const,

        error:
          "Typology tag tối đa 40 ký tự.",
      };
    }

    // ========================================================
    // FORUM
    // ========================================================

    const forum =
      await prisma.forum.findFirst({
        where: {
          id:
            input.forumId,

          isActive:
            true,
        },

        select: {
          id: true,

          moderationPolicy:
            true,
        },
      });

    if (!forum) {
      return {
        success:
          false as const,

        reason:
          "INVALID_FORUM" as const,

        error:
          "Forum không tồn tại hoặc hiện không hoạt động.",
      };
    }

    // ========================================================
    // CITATIONS
    // ========================================================

    const citations =
      Array.isArray(
        input.citations,
      )
        ? input.citations
        : [];

    if (
      citations.length >
      12
    ) {
      return {
        success:
          false as const,

        reason:
          "TOO_MANY_CITATIONS" as const,

        error:
          "Một bài viết tối đa 12 nguồn.",
      };
    }

    const minimumCitations =
      getMinimumCitationCount(
        input.postKind,
        forum.moderationPolicy,
      );

    if (
      citations.length <
      minimumCitations
    ) {
      return {
        success:
          false as const,

        reason:
          "CITATIONS_REQUIRED" as const,

        error:
          `Bài viết này cần ít nhất ${minimumCitations} nguồn dẫn.`,
      };
    }

    const normalizedCitations:
      Array<{
        title: string;

        authors:
          string | null;

        year:
          number | null;

        publisher:
          string | null;

        url:
          string | null;

        doi:
          string | null;

        sourceType:
          DiscussionCitationSourceType;

        sortOrder:
          number;

        verificationStatus:
          "PENDING";
      }> = [];

    for (
      let index = 0;
      index <
      citations.length;
      index += 1
    ) {
      const citation =
        citations[index];

      const citationTitle =
        citation.title
          ?.trim();

      const url =
        citation.url
          ?.trim() ||
        "";

      const doi =
        citation.doi
          ?.trim() ||
        "";

      if (
        !citationTitle ||
        citationTitle.length <
          4
      ) {
        return {
          success:
            false as const,

          reason:
            "INVALID_CITATION" as const,

          error:
            `Nguồn [${index + 1}] cần có tên tài liệu.`,
        };
      }

      if (
        !CITATION_SOURCE_TYPES.includes(
          citation.sourceType,
        )
      ) {
        return {
          success:
            false as const,

          reason:
            "INVALID_CITATION" as const,

          error:
            `Nguồn [${index + 1}] chưa có loại nguồn hợp lệ.`,
        };
      }

      if (
        !url &&
        !doi
      ) {
        return {
          success:
            false as const,

          reason:
            "INVALID_CITATION" as const,

          error:
            `Nguồn [${index + 1}] cần URL hoặc DOI.`,
        };
      }

      if (
        url &&
        !validHttpUrl(
          url,
        )
      ) {
        return {
          success:
            false as const,

          reason:
            "INVALID_CITATION" as const,

          error:
            `URL của nguồn [${index + 1}] không hợp lệ.`,
        };
      }

      if (
        doi &&
        !validDoi(
          doi,
        )
      ) {
        return {
          success:
            false as const,

          reason:
            "INVALID_CITATION" as const,

          error:
            `DOI của nguồn [${index + 1}] không hợp lệ.`,
        };
      }

      const rawYear =
        citation.year
          ?.trim();

      let year:
        number | null =
        null;

      if (rawYear) {
        const parsed =
          Number(
            rawYear,
          );

        const currentYear =
          new Date()
            .getFullYear();

        if (
          !Number.isInteger(
            parsed,
          ) ||
          parsed <
            1800 ||
          parsed >
            currentYear + 1
        ) {
          return {
            success:
              false as const,

            reason:
              "INVALID_CITATION" as const,

            error:
              `Năm xuất bản của nguồn [${index + 1}] không hợp lệ.`,
          };
        }

        year =
          parsed;
      }

      normalizedCitations.push({
        title:
          citationTitle,

        authors:
          citation.authors
            ?.trim() ||
          null,

        year,

        publisher:
          citation.publisher
            ?.trim() ||
          null,

        url:
          url ||
          null,

        doi:
          doi
            ? normalizeDoi(
                doi,
              )
            : null,

        sourceType:
          citation.sourceType,

        sortOrder:
          index,

        // Revision luôn bắt citation verifier chạy lại.
        verificationStatus:
          "PENDING",
      });
    }

    // ========================================================
    // EXISTING ATTACHMENTS
    // ========================================================

    const retainedAttachmentIds =
      Array.isArray(
        input.retainedAttachmentIds,
      )
        ? [
            ...new Set(
              input.retainedAttachmentIds,
            ),
          ]
        : [];

    const originalAttachmentIds =
      new Set(
        original.attachments.map(
          (attachment) =>
            attachment.id,
        ),
      );

    const invalidRetainedId =
      retainedAttachmentIds.find(
        (id) =>
          !originalAttachmentIds.has(
            id,
          ),
      );

    if (
      invalidRetainedId
    ) {
      return {
        success:
          false as const,

        reason:
          "INVALID_ATTACHMENTS" as const,

        error:
          "Danh sách attachment cũ không hợp lệ.",
      };
    }

    const retainedSet =
      new Set(
        retainedAttachmentIds,
      );

    const retainedAttachments =
      original.attachments.filter(
        (attachment) =>
          retainedSet.has(
            attachment.id,
          ),
      );

    const unsafeRetained =
      retainedAttachments.find(
        (attachment) =>
          attachment.scanStatus !==
          "CLEAN",
      );

    if (
      unsafeRetained
    ) {
      return {
        success:
          false as const,

        reason:
          "INVALID_ATTACHMENTS" as const,

        error:
          "Một attachment cũ chưa vượt qua security screening. Hãy loại attachment đó trước khi gửi lại.",
      };
    }

    const removedAttachments =
      original.attachments.filter(
        (attachment) =>
          !retainedSet.has(
            attachment.id,
          ),
      );

    // ========================================================
    // NEW ATTACHMENTS
    // ========================================================

    const newAttachmentIds =
      Array.isArray(
        input.newAttachmentIds,
      )
        ? [
            ...new Set(
              input.newAttachmentIds,
            ),
          ]
        : [];

    if (
      retainedAttachmentIds.length +
        newAttachmentIds.length >
      8
    ) {
      return {
        success:
          false as const,

        reason:
          "TOO_MANY_ATTACHMENTS" as const,

        error:
          "Một bài viết tối đa 8 attachment.",
      };
    }

    const uploadSessionId =
      input.uploadSessionId
        ?.trim() ||
      "";

    if (
      newAttachmentIds.length >
        0 &&
      !/^[A-Za-z0-9_-]{12,100}$/.test(
        uploadSessionId,
      )
    ) {
      return {
        success:
          false as const,

        reason:
          "INVALID_UPLOAD_SESSION" as const,

        error:
          "Upload session không hợp lệ.",
      };
    }

    if (
      newAttachmentIds.length >
      0
    ) {
      const newAttachments =
        await prisma.postAttachment.findMany({
          where: {
            id: {
              in:
                newAttachmentIds,
            },

            uploaderClerkId:
              userId,

            uploadSessionId,

            postId:
              null,
          },

          select: {
            id: true,

            scanStatus:
              true,

            moderationStatus:
              true,
          },
        });

      if (
        newAttachments.length !==
        newAttachmentIds.length
      ) {
        return {
          success:
            false as const,

          reason:
            "INVALID_ATTACHMENTS" as const,

          error:
            "Một hoặc nhiều attachment mới không thuộc revision session này.",
        };
      }

      const invalidNewAttachment =
        newAttachments.find(
          (attachment) =>
            attachment.scanStatus !==
              "CLEAN" ||
            attachment.moderationStatus ===
              "REJECTED" ||
            attachment.moderationStatus ===
              "ERROR",
        );

      if (
        invalidNewAttachment
      ) {
        return {
          success:
            false as const,

          reason:
            "INVALID_ATTACHMENTS" as const,

          error:
            "Một hoặc nhiều attachment mới chưa vượt qua security screening.",
        };
      }
    }

    // ========================================================
    // DATABASE REVISION
    // ========================================================

    const operations:
      Prisma.PrismaPromise<unknown>[] =
      [];

    operations.push(
      prisma.post.update({
        where: {
          id:
            original.id,
        },

        data: {
          forumId:
            forum.id,

          postKind:
            input.postKind,

          title,
          content,

          personalityTag,

          moderationStatus:
            "REVIEWING",

          moderationScore:
            null,

          moderationVersion: {
            increment:
              1,
          },

          publishedAt:
            null,
        },
      }),
    );

    // Citation rows được tạo lại.
    // Review history cũ vẫn nằm trong ModerationReview.
    operations.push(
      prisma.citation.deleteMany({
        where: {
          postId:
            original.id,
        },
      }),
    );

    if (
      normalizedCitations.length >
      0
    ) {
      operations.push(
        prisma.citation.createMany({
          data:
            normalizedCitations.map(
              (citation) => ({
                postId:
                  original.id,

                ...citation,
              }),
            ),
        }),
      );
    }

    if (
      retainedAttachmentIds.length >
      0
    ) {
      operations.push(
        prisma.postAttachment.updateMany({
          where: {
            postId:
              original.id,

            id: {
              in:
                retainedAttachmentIds,
            },
          },

          data: {
            moderationStatus:
              "PENDING",

            moderationReason:
              null,

            moderationFindings:
              Prisma.DbNull,

            extractedTextPreview:
              null,
          },
        }),
      );
    }

    if (
      removedAttachments.length >
      0
    ) {
      operations.push(
        prisma.postAttachment.deleteMany({
          where: {
            postId:
              original.id,

            id: {
              in:
                removedAttachments.map(
                  (attachment) =>
                    attachment.id,
                ),
            },
          },
        }),
      );
    }

    if (
      newAttachmentIds.length >
      0
    ) {
      operations.push(
        prisma.postAttachment.updateMany({
          where: {
            id: {
              in:
                newAttachmentIds,
            },

            uploaderClerkId:
              userId,

            uploadSessionId,

            postId:
              null,
          },

          data: {
            postId:
              original.id,

            moderationStatus:
              "PENDING",

            moderationReason:
              null,

            moderationFindings:
              Prisma.DbNull,

            extractedTextPreview:
              null,
          },
        }),
      );
    }

    await prisma.$transaction(
      operations,
    );

    // ========================================================
    // BACKGROUND WORK
    // ========================================================

    const removedStoragePaths =
      removedAttachments.map(
        (attachment) =>
          attachment.storagePath,
      );

    after(async () => {
      // Attachment đã bỏ khỏi revision:
      // DB đã xóa trước; Storage cleanup là best-effort.
      if (
        removedStoragePaths.length >
        0
      ) {
        try {
          const supabase =
            getSupabaseAdmin();

          const removed =
            await supabase.storage
              .from(
                DISCUSSION_ATTACHMENT_BUCKET,
              )
              .remove(
                removedStoragePaths,
              );

          if (
            removed.error
          ) {
            console.error(
              "Revision attachment storage cleanup failed:",
              removed.error,
            );
          }
        } catch (error) {
          console.error(
            "Revision attachment cleanup error:",
            error,
          );
        }
      }

      try {
        await runDiscussionModeration(
          original.id,
        );
      } catch (error) {
        console.error(
          "Revision moderation failed:",
          error,
        );
      }
    });

    revalidatePath(
      "/discussion",
    );

    revalidatePath(
      `/discussion/review/${original.id}`,
    );

    revalidatePath(
      `/discussion/revise/${original.id}`,
    );

    return {
      success:
        true as const,

      postId:
        original.id,

      moderationStatus:
        "REVIEWING" as const,

      moderationVersion:
        original.moderationVersion +
        1,
    };
  } catch (error) {
    console.error(
      "resubmitDiscussionPost error:",
      error,
    );

    return {
      success:
        false as const,

      reason:
        "SERVER_ERROR" as const,

      error:
        "Không thể gửi lại bài viết để kiểm duyệt.",
    };
  }
}
