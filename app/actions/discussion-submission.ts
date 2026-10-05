"use server";

import {
  auth,
  currentUser,
} from "@clerk/nextjs/server";

import { after } from "next/server";

import { prisma } from "@/lib/prisma";

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

type CitationInput = {
  title: string;
  authors?: string;
  year?: string;
  publisher?: string;

  url?: string;
  doi?: string;

  sourceType:
    DiscussionCitationSourceType;
};

type SubmissionInput = {
  forumId: string;

  // Optional community context.
  // System Forum vẫn là classification chính thức của MOSAIC.
  groupId?: string;
  postKind: DiscussionPostKind;

  title: string;
  content: string;

  personalityTag?: string;

  citations: CitationInput[];

  uploadSessionId: string;
  attachmentIds: string[];
};

function validHttpUrl(
  raw: string,
) {
  try {
    const url =
      new URL(raw);

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
    normalizeDoi(raw),
  );
}

export async function submitDiscussionPost(
  input: SubmissionInput,
) {
  try {
    const { userId } =
      await auth();

    if (!userId) {
      return {
        success:
          false as const,

        reason:
          "UNAUTHENTICATED" as const,

        error:
          "Bạn cần đăng nhập để đăng bài.",
      };
    }

    const title =
      input.title?.trim();

    const content =
      input.content?.trim();

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
    // TITLE
    // ========================================================

    if (
      !title ||
      title.length < 12
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
      title.length > 180
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

    // ========================================================
    // CONTENT
    // ========================================================

    const minContent =
      getMinimumContentLength(
        input.postKind,
      );

    if (
      !content ||
      content.length <
        minContent
    ) {
      return {
        success:
          false as const,

        reason:
          "CONTENT_TOO_SHORT" as const,

        error:
          `Nội dung cần ít nhất ${minContent} ký tự.`,
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
    // OPTIONAL DISCUSSION GROUP
    // ========================================================

    let discussionGroup:
      {
        id: string;
        slug: string;
        name: string;
      } |
      null =
      null;

    const requestedGroupId =
      input.groupId
        ?.trim() ||
      "";

    if (requestedGroupId) {
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
            "Không tìm thấy membership của bạn trong Group.",
        };
      }

      const group =
        await prisma.discussionGroup.findFirst({
          where: {
            id:
              requestedGroupId,

            isActive:
              true,
          },

          select: {
            id: true,
            slug: true,
            name: true,
          },
        });

      if (!group) {
        return {
          success:
            false as const,

          reason:
            "INVALID_GROUP" as const,

          error:
            "Group không tồn tại hoặc đã ngừng hoạt động.",
        };
      }

      const membership =
        await prisma.discussionGroupMember.findUnique({
          where: {
            groupId_userId: {
              groupId:
                group.id,

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
            "Bạn cần là thành viên đang hoạt động của Group để đăng bài.",
        };
      }

      discussionGroup =
        group;
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
        authors: string | null;
        year: number | null;
        publisher:
          string | null;
        url: string | null;
        doi: string | null;
        sourceType:
          DiscussionCitationSourceType;
        sortOrder: number;
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
        citation.title?.trim();

      const url =
        citation.url?.trim() ||
        "";

      const doi =
        citation.doi?.trim() ||
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
        !validHttpUrl(url)
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
        !validDoi(doi)
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
        citation.year?.trim();

      let year:
        number | null =
        null;

      if (rawYear) {
        const parsed =
          Number(rawYear);

        const currentYear =
          new Date()
            .getFullYear();

        if (
          !Number.isInteger(
            parsed,
          ) ||
          parsed < 1800 ||
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

      normalizedCitations.push(
        {
          title:
            citationTitle,

          authors:
            citation.authors?.trim() ||
            null,

          year,

          publisher:
            citation.publisher?.trim() ||
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
        },
      );
    }

    // ========================================================
    // ATTACHMENTS
    // ========================================================

    const attachmentIds =
      Array.isArray(
        input.attachmentIds,
      )
        ? input.attachmentIds
        : [];

    if (
      attachmentIds.length >
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

    const uniqueAttachmentIds =
      [
        ...new Set(
          attachmentIds,
        ),
      ];

    if (
      uniqueAttachmentIds.length !==
      attachmentIds.length
    ) {
      return {
        success:
          false as const,

        reason:
          "INVALID_ATTACHMENTS" as const,

        error:
          "Danh sách attachment không hợp lệ.",
      };
    }

    const uploadSessionId =
      input.uploadSessionId?.trim() ||
      "";

    if (
      uniqueAttachmentIds.length >
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
      uniqueAttachmentIds.length >
      0
    ) {
      const attachments =
        await prisma.postAttachment.findMany({
          where: {
            id: {
              in:
                uniqueAttachmentIds,
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
        attachments.length !==
        uniqueAttachmentIds.length
      ) {
        return {
          success:
            false as const,

          reason:
            "INVALID_ATTACHMENTS" as const,

          error:
            "Một hoặc nhiều attachment không thuộc upload session này.",
        };
      }

      const invalidAttachment =
        attachments.find(
          (attachment) =>
            attachment.scanStatus !==
              "CLEAN" ||
            attachment.moderationStatus ===
              "REJECTED" ||
            attachment.moderationStatus ===
              "ERROR",
        );

      if (
        invalidAttachment
      ) {
        return {
          success:
            false as const,

          reason:
            "ATTACHMENT_NOT_READY" as const,

          error:
            "Một hoặc nhiều attachment chưa vượt qua kiểm tra an toàn.",
        };
      }
    }

    // ========================================================
    // AUTHOR
    // ========================================================

    const clerkUser =
      await currentUser();

    const authorName =
      clerkUser?.username ||
      [
        clerkUser?.firstName,
        clerkUser?.lastName,
      ]
        .filter(Boolean)
        .join(" ") ||
      "Thành viên MOSAIC";

    const authorImage =
      clerkUser?.imageUrl ||
      null;

    // ========================================================
    // CREATE POST + CLAIM ATTACHMENTS ATOMICALLY
    // ========================================================

    const post =
      await prisma.$transaction(
        async (tx) => {
          const created =
            await tx.post.create({
              data: {
                title,
                content,

                authorId:
                  userId,

                authorName,
                authorImage,

                personalityTag:
                  input.personalityTag?.trim() ||
                  "Chung",

                forumId:
                  forum.id,

                groupId:
                  discussionGroup?.id ??
                  null,

                postKind:
                  input.postKind,

                // Chưa public.
                moderationStatus:
                  "REVIEWING",

                moderationVersion:
                  1,

                publishedAt:
                  null,

                citations: {
                  create:
                    normalizedCitations,
                },
              },

              select: {
                id: true,

                moderationStatus:
                  true,
              },
            });

          if (
            uniqueAttachmentIds.length >
            0
          ) {
            const claimed =
              await tx.postAttachment.updateMany({
                where: {
                  id: {
                    in:
                      uniqueAttachmentIds,
                  },

                  uploaderClerkId:
                    userId,

                  uploadSessionId,

                  postId:
                    null,

                  scanStatus:
                    "CLEAN",

                  moderationStatus: {
                    in: [
                      "PENDING",
                      "APPROVED",
                    ],
                  },
                },

                data: {
                  postId:
                    created.id,
                },
              });

            if (
              claimed.count !==
              uniqueAttachmentIds.length
            ) {
              throw new Error(
                "ATTACHMENT_LINK_CONFLICT",
              );
            }
          }

          return created;
        },
      );

    // ========================================================
    // AUTOMATED PRE-PUBLICATION MODERATION
    //
    // Không bắt browser phải chờ Groq.
    // Response trả về trước, moderation chạy tiếp phía server.
    // ========================================================

    after(async () => {
      try {
        await runDiscussionModeration(
          post.id,
        );
      } catch (error) {
        console.error(
          "Background discussion moderation failed:",
          error,
        );
      }
    });

    return {
      success:
        true as const,

      postId:
        post.id,

      moderationStatus:
        "REVIEWING" as const,
    };
  } catch (error) {
    console.error(
      "Lỗi submitDiscussionPost:",
      error,
    );

    return {
      success:
        false as const,

      reason:
        "SERVER_ERROR" as const,

      error:
        "Không thể gửi bài viết để kiểm duyệt.",
    };
  }
}
