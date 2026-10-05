"use server";

import {
  auth,
} from "@clerk/nextjs/server";

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
  CITATION_SOURCE_TYPES,
  POST_KINDS,
  type DiscussionCitationSourceType,
  type DiscussionPostKind,
} from "@/lib/discussion/post-policy";

type CitationDraftInput = {
  id: string;

  title: string;
  authors: string;
  year: string;
  publisher: string;

  url: string;
  doi: string;

  sourceType:
    DiscussionCitationSourceType;
};

export type SaveDiscussionDraftInput = {
  uploadSessionId: string;

  forumId?: string | null;
  groupId?: string | null;

  postKind:
    DiscussionPostKind;

  title: string;
  content: string;
  personalityTag: string;

  citations:
    CitationDraftInput[];

  attachmentIds:
    string[];
};

function cleanString(
  value: unknown,
  maxLength: number,
) {
  if (
    typeof value !==
    "string"
  ) {
    return "";
  }

  return value.slice(
    0,
    maxLength,
  );
}

function normalizeCitationDrafts(
  value:
    CitationDraftInput[],
) {
  if (
    !Array.isArray(
      value,
    )
  ) {
    return [];
  }

  return value
    .slice(
      0,
      12,
    )
    .map(
      (
        citation,
      ) => {
        const sourceType =
          CITATION_SOURCE_TYPES.includes(
            citation.sourceType,
          )
            ? citation.sourceType
            : "UNKNOWN";

        return {
          id:
            cleanString(
              citation.id,
              100,
            ),

          title:
            cleanString(
              citation.title,
              600,
            ),

          authors:
            cleanString(
              citation.authors,
              600,
            ),

          year:
            cleanString(
              citation.year,
              20,
            ),

          publisher:
            cleanString(
              citation.publisher,
              600,
            ),

          url:
            cleanString(
              citation.url,
              2200,
            ),

          doi:
            cleanString(
              citation.doi,
              500,
            ),

          sourceType,
        };
      },
    );
}

function parseStringArray(
  value: unknown,
) {
  if (
    !Array.isArray(
      value,
    )
  ) {
    return [];
  }

  return value.filter(
    (
      item,
    ): item is string =>
      typeof item ===
        "string",
  );
}

export async function saveDiscussionDraft(
  input:
    SaveDiscussionDraftInput,
) {
  try {
    const {
      userId,
    } =
      await auth();

    if (!userId) {
      return {
        success:
          false as const,

        error:
          "Bạn cần đăng nhập để lưu bản nháp.",
      };
    }

    const uploadSessionId =
      input.uploadSessionId
        ?.trim();

    if (
      !uploadSessionId ||
      !/^[A-Za-z0-9_-]{12,100}$/.test(
        uploadSessionId,
      )
    ) {
      return {
        success:
          false as const,

        error:
          "Draft upload session không hợp lệ.",
      };
    }

    if (
      !POST_KINDS.includes(
        input.postKind,
      )
    ) {
      return {
        success:
          false as const,

        error:
          "Loại bài viết không hợp lệ.",
      };
    }

    const forumId =
      input.forumId
        ?.trim() ||
      null;

    const groupId =
      input.groupId
        ?.trim() ||
      null;

    // ========================================================
    // FORUM
    // ========================================================

    if (forumId) {
      const forum =
        await prisma.forum.findFirst({
          where: {
            id:
              forumId,

            isActive:
              true,
          },

          select: {
            id: true,
          },
        });

      if (!forum) {
        return {
          success:
            false as const,

          error:
            "System Forum của bản nháp không còn hoạt động.",
        };
      }
    }

    // ========================================================
    // GROUP ACCESS
    //
    // Draft trong Group cũng phải tôn trọng membership.
    // ========================================================

    if (groupId) {
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

          error:
            "Không tìm thấy MOSAIC user tương ứng.",
        };
      }

      const group =
        await prisma.discussionGroup.findFirst({
          where: {
            id:
              groupId,

            isActive:
              true,
          },

          select: {
            id: true,
          },
        });

      if (!group) {
        return {
          success:
            false as const,

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

          error:
            "Bạn không còn quyền lưu draft trong Group này.",
        };
      }
    }

    // ========================================================
    // ATTACHMENTS
    //
    // Draft chỉ giữ attachment IDs.
    // Không claim postId tại đây.
    // ========================================================

    const requestedAttachmentIds =
      Array.isArray(
        input.attachmentIds,
      )
        ? [
            ...new Set(
              input.attachmentIds
                .filter(
                  (
                    value,
                  ): value is string =>
                    typeof value ===
                    "string",
                )
                .map(
                  (value) =>
                    value.trim(),
                )
                .filter(Boolean),
            ),
          ].slice(
            0,
            8,
          )
        : [];

    let safeAttachmentIds:
      string[] = [];

    if (
      requestedAttachmentIds.length >
      0
    ) {
      const attachments =
        await prisma.postAttachment.findMany({
          where: {
            id: {
              in:
                requestedAttachmentIds,
            },

            uploaderClerkId:
              userId,

            uploadSessionId,

            // Draft attachment chưa thuộc published/review Post.
            postId:
              null,
          },

          select: {
            id: true,
          },
        });

      const allowed =
        new Set(
          attachments.map(
            (
              attachment,
            ) =>
              attachment.id,
          ),
        );

      safeAttachmentIds =
        requestedAttachmentIds.filter(
          (
            id,
          ) =>
            allowed.has(id),
        );
    }

    const citationDrafts =
      normalizeCitationDrafts(
        input.citations,
      );

    // ========================================================
    // IDEMPOTENT AUTOSAVE
    //
    // ownerClerkId + uploadSessionId là unique.
    // Một composer session không tạo hàng loạt draft records.
    // ========================================================

    const draft =
      await prisma.discussionDraft.upsert({
        where: {
          ownerClerkId_uploadSessionId: {
            ownerClerkId:
              userId,

            uploadSessionId,
          },
        },

        update: {
          forumId,
          groupId,

          postKind:
            input.postKind,

          title:
            cleanString(
              input.title,
              180,
            ),

          content:
            cleanString(
              input.content,
              15000,
            ),

          personalityTag:
            cleanString(
              input.personalityTag,
              100,
            ) ||
            "Chung",

          citationDrafts,

          attachmentIds:
            safeAttachmentIds,
        },

        create: {
          ownerClerkId:
            userId,

          uploadSessionId,

          forumId,
          groupId,

          postKind:
            input.postKind,

          title:
            cleanString(
              input.title,
              180,
            ),

          content:
            cleanString(
              input.content,
              15000,
            ),

          personalityTag:
            cleanString(
              input.personalityTag,
              100,
            ) ||
            "Chung",

          citationDrafts,

          attachmentIds:
            safeAttachmentIds,
        },

        select: {
          id: true,
          updatedAt: true,
        },
      });

    revalidatePath(
      "/discussion/drafts",
    );

    return {
      success:
        true as const,

      draftId:
        draft.id,

      savedAt:
        draft.updatedAt.toISOString(),

      attachmentIds:
        safeAttachmentIds,
    };
  } catch (error) {
    console.error(
      "saveDiscussionDraft error:",
      error,
    );

    return {
      success:
        false as const,

      error:
        "Không thể lưu bản nháp.",
    };
  }
}

export async function getOwnDiscussionDraft(
  draftId: string,
) {
  try {
    const {
      userId,
    } =
      await auth();

    if (!userId) {
      return {
        success:
          false as const,

        error:
          "UNAUTHENTICATED",
      };
    }

    const draft =
      await prisma.discussionDraft.findFirst({
        where: {
          id:
            draftId,

          ownerClerkId:
            userId,
        },
      });

    if (!draft) {
      return {
        success:
          false as const,

        error:
          "NOT_FOUND",
      };
    }

    // Re-filter attachment IDs để draft cũ không giữ
    // reference tới file đã bị xóa/rejected ở nơi khác.
    const storedAttachmentIds =
      parseStringArray(
        draft.attachmentIds,
      );

    let attachmentIds:
      string[] = [];

    if (
      storedAttachmentIds.length >
      0
    ) {
      const attachments =
        await prisma.postAttachment.findMany({
          where: {
            id: {
              in:
                storedAttachmentIds,
            },

            uploaderClerkId:
              userId,

            uploadSessionId:
              draft.uploadSessionId,

            postId:
              null,
          },

          select: {
            id: true,
          },
        });

      const existingIds =
        new Set(
          attachments.map(
            (
              attachment,
            ) =>
              attachment.id,
          ),
        );

      attachmentIds =
        storedAttachmentIds.filter(
          (
            id,
          ) =>
            existingIds.has(id),
        );
    }

    return {
      success:
        true as const,

      draft: {
        id:
          draft.id,

        uploadSessionId:
          draft.uploadSessionId,

        forumId:
          draft.forumId,

        groupId:
          draft.groupId,

        postKind:
          draft.postKind,

        title:
          draft.title,

        content:
          draft.content,

        personalityTag:
          draft.personalityTag,

        citations:
          draft.citationDrafts,

        attachmentIds,

        createdAt:
          draft.createdAt.toISOString(),

        updatedAt:
          draft.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error(
      "getOwnDiscussionDraft error:",
      error,
    );

    return {
      success:
        false as const,

      error:
        "LOAD_FAILED",
    };
  }
}

export async function getOwnDiscussionDrafts() {
  try {
    const {
      userId,
    } =
      await auth();

    if (!userId) {
      return {
        success:
          false as const,

        drafts:
          [],

        error:
          "UNAUTHENTICATED",
      };
    }

    const drafts =
      await prisma.discussionDraft.findMany({
        where: {
          ownerClerkId:
            userId,
        },

        orderBy: {
          updatedAt:
            "desc",
        },

        select: {
          id: true,

          uploadSessionId:
            true,

          forumId:
            true,

          groupId:
            true,

          postKind:
            true,

          title:
            true,

          content:
            true,

          personalityTag:
            true,

          citationDrafts:
            true,

          attachmentIds:
            true,

          createdAt:
            true,

          updatedAt:
            true,
        },
      });

    return {
      success:
        true as const,

      drafts:
        drafts.map(
          (
            draft,
          ) => ({
            ...draft,

            citationCount:
              Array.isArray(
                draft.citationDrafts,
              )
                ? draft.citationDrafts.length
                : 0,

            attachmentCount:
              Array.isArray(
                draft.attachmentIds,
              )
                ? draft.attachmentIds.length
                : 0,

            createdAt:
              draft.createdAt.toISOString(),

            updatedAt:
              draft.updatedAt.toISOString(),
          }),
        ),
    };
  } catch (error) {
    console.error(
      "getOwnDiscussionDrafts error:",
      error,
    );

    return {
      success:
        false as const,

      drafts:
        [],

      error:
        "Không thể tải danh sách bản nháp.",
    };
  }
}

export async function deleteDiscussionDraft(
  draftId: string,
) {
  try {
    const {
      userId,
    } =
      await auth();

    if (!userId) {
      return {
        success:
          false as const,

        error:
          "Bạn cần đăng nhập.",
      };
    }

    const draft =
      await prisma.discussionDraft.findFirst({
        where: {
          id:
            draftId,

          ownerClerkId:
            userId,
        },

        select: {
          id: true,

          uploadSessionId:
            true,
        },
      });

    if (!draft) {
      return {
        success:
          false as const,

        error:
          "Không tìm thấy bản nháp.",
      };
    }

    // Xóa mọi attachment chưa được claim thuộc session này.
    // Làm theo session thay vì chỉ JSON IDs để tránh orphan file
    // nếu autosave cuối chưa kịp chạy.
    const attachments =
      await prisma.postAttachment.findMany({
        where: {
          uploaderClerkId:
            userId,

          uploadSessionId:
            draft.uploadSessionId,

          postId:
            null,
        },

        select: {
          id: true,

          storagePath:
            true,
        },
      });

    if (
      attachments.length >
      0
    ) {
      const supabase =
        getSupabaseAdmin();

      const removed =
        await supabase.storage
          .from(
            DISCUSSION_ATTACHMENT_BUCKET,
          )
          .remove(
            attachments.map(
              (
                attachment,
              ) =>
                attachment.storagePath,
            ),
          );

      if (removed.error) {
        console.error(
          "Draft attachment storage cleanup failed:",
          removed.error,
        );

        return {
          success:
            false as const,

          error:
            "Không thể xóa attachment của bản nháp. Hãy thử lại.",
        };
      }
    }

    await prisma.$transaction([
      prisma.postAttachment.deleteMany({
        where: {
          uploaderClerkId:
            userId,

          uploadSessionId:
            draft.uploadSessionId,

          postId:
            null,
        },
      }),

      prisma.discussionDraft.delete({
        where: {
          id:
            draft.id,
        },
      }),
    ]);

    revalidatePath(
      "/discussion/drafts",
    );

    return {
      success:
        true as const,
    };
  } catch (error) {
    console.error(
      "deleteDiscussionDraft error:",
      error,
    );

    return {
      success:
        false as const,

      error:
        "Không thể xóa bản nháp.",
    };
  }
}
