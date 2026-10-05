"use server";

import { publicCommentWhere } from "@/lib/discussion/comment-service";

import {
  canInteractWithGroup,
  canReadGroupContent,
  publicDiscussionPostAccessWhere,
} from "@/lib/discussion/group-access";


import { submitComment } from "@/lib/discussion/comment-service";


import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  createNotification,
  deleteEntityNotifications,
} from "@/lib/notifications";

export interface CreatePostInput {
  title?: string;
  content: string;
  personalityTag?: string;
}

// 1. Tạo bài viết mới
export async function createPost(data: CreatePostInput) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Vui lòng đăng nhập để tạo bài viết." };
    }

    if (!data.content?.trim()) {
      return { success: false, error: "Nội dung bài viết không được để trống." };
    }

    const title =
      data.title?.trim() ||
      data.content.trim().slice(0, 45) + (data.content.trim().length > 45 ? "..." : "");

    const user = await currentUser();
    const authorName =
      user?.username ||
      [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
      "Thành viên MOSAIC";
    const authorImage = user?.imageUrl || null;

    const post = await prisma.post.create({
      data: {
        title,
        content: data.content.trim(),
        personalityTag: data.personalityTag || "Chung",
        authorId: userId,
        authorName,
        authorImage,
      },
    });

    revalidatePath("/discussion");
    revalidatePath("/");
    return { success: true, post };
  } catch (error) {
    console.error("Lỗi tạo bài viết:", error);
    return { success: false, error: "Đã có lỗi xảy ra khi đăng bài viết." };
  }
}

// 2. Lấy danh sách bài viết của chính người dùng hiện tại
export async function getUserPosts() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Chưa đăng nhập.", posts: [] };
    }

    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
      include: {
        comments: {
where: publicCommentWhere,

          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, posts };
  } catch (error) {
    console.error("Lỗi lấy bài viết người dùng:", error);
    return { success: false, error: "Không thể tải bài viết của bạn.", posts: [] };
  }
}

// 2. Lấy danh sách tất cả bài viết kèm bình luận
export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      // Public feed chỉ được phép hiển thị bài đã qua moderation.
      where: {
        moderationStatus: "APPROVED",

        publishedAt: {
          not: null,
        },

        ...publicDiscussionPostAccessWhere,
      },

      include: {
        comments: {
where: publicCommentWhere,

          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, posts };
  } catch (error) {
    console.error("Lỗi lấy danh sách bài viết:", error);
    return { success: false, error: "Không thể tải danh sách bài viết.", posts: [] };
  }
}

// 3. Thêm bình luận vào bài viết
export async function addComment(postId: string, content: string) {
  return submitComment(postId, content);
}

export async function toggleLike(
  postId: string,
) {
  try {
    const {
      userId,
    } = await auth();

    if (!userId) {
      return {
        success:
          false as const,

        error:
          "Vui lòng đăng nhập để thích bài viết.",
      };
    }

    if (
      typeof postId !==
        "string" ||
      !postId.trim()
    ) {
      return {
        success:
          false as const,

        error:
          "Bài viết không hợp lệ.",
      };
    }

    // ========================================================
    // POST ACCESS
    // ========================================================

    const post =
      await prisma.post.findFirst({
        where: {
          id:
            postId,

          moderationStatus:
            "APPROVED",

          publishedAt: {
            not:
              null,
          },
        },

        select: {
          id: true,

          authorId:
            true,

          title:
            true,

          likesCount:
            true,

          forumId:
            true,

          forum: {
            select: {
              isActive:
                true,
            },
          },

          groupId:
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
        post.forumId &&
        !post.forum?.isActive
      )
    ) {
      return {
        success:
          false as const,

        error:
          "Bài viết hiện không khả dụng.",
      };
    }

    if (post.group) {
      const allowed =
        await canInteractWithGroup(
          prisma,
          post.group,
          userId,
        );

      if (!allowed) {
        return {
          success:
            false as const,

          error:
            "Bạn cần là thành viên đang hoạt động của Group để tương tác với bài viết.",
        };
      }
    }

    // ========================================================
    // ATOMIC LIKE TOGGLE
    //
    // Advisory lock theo post + user tránh double-click /
    // multiple-tab race làm lệch likesCount.
    // ========================================================

    const result =
      await prisma.$transaction(
        async (
          tx,
        ) => {
          await tx.$queryRaw`
            SELECT pg_advisory_xact_lock(
              hashtext(${`${postId}:${userId}`})
            )
          `;

          const existing =
            await tx.like.findUnique({
              where: {
                postId_userId: {
                  postId,
                  userId,
                },
              },

              select: {
                id: true,
              },
            });

          let liked:
            boolean;

          if (existing) {
            await tx.like.delete({
              where: {
                id:
                  existing.id,
              },
            });

            await tx.post.updateMany({
              where: {
                id:
                  postId,

                likesCount: {
                  gt:
                    0,
                },
              },

              data: {
                likesCount: {
                  decrement:
                    1,
                },
              },
            });

            liked =
              false;
          } else {
            await tx.like.create({
              data: {
                postId,
                userId,
              },
            });

            await tx.post.update({
              where: {
                id:
                  postId,
              },

              data: {
                likesCount: {
                  increment:
                    1,
                },
              },
            });

            liked =
              true;
          }

          const updatedPost =
            await tx.post.findUniqueOrThrow({
              where: {
                id:
                  postId,
              },

              select: {
                likesCount:
                  true,
              },
            });

          return {
            liked,

            likesCount:
              updatedPost.likesCount,
          };
        },
      );

    // ========================================================
    // NOTIFICATION
    // ========================================================

    const actor =
      await prisma.user.findUnique({
        where: {
          clerkId:
            userId,
        },

        select: {
          id: true,
          username: true,
        },
      });

    if (actor) {
      if (
        result.liked &&
        post.authorId !==
          userId
      ) {
        let recipientCanRead =
          true;

        if (post.group) {
          recipientCanRead =
            await canReadGroupContent(
              prisma,
              post.group,
              post.authorId,
            );
        }

        if (recipientCanRead) {
          const recipient =
            await prisma.user.findUnique({
              where: {
                clerkId:
                  post.authorId,
              },

              select: {
                id: true,
              },
            });

          if (recipient) {
            await createNotification({
              recipientId:
                recipient.id,

              actorId:
                actor.id,

              type:
                "POST_REACTION",

              title:
                `${actor.username || "Một thành viên"} đã thích bài viết của bạn`,

              body:
                post.title
                  ? `“${post.title}”`
                  : null,

              href:
                post.group
                  ? `/discussion/groups/${post.group.slug}`
                  : "/discussion",

              entityType:
                "POST_LIKE",

              entityId:
                postId,
            });
          }
        }
      } else if (
        !result.liked
      ) {
        await deleteEntityNotifications({
          actorId:
            actor.id,

          type:
            "POST_REACTION",

          entityType:
            "POST_LIKE",

          entityId:
            postId,
        });
      }
    }

    revalidatePath(
      "/discussion",
    );

    revalidatePath(
      "/",
    );

    if (post.group) {
      revalidatePath(
        `/discussion/groups/${post.group.slug}`,
      );
    }

    return {
      success:
        true as const,

      liked:
        result.liked,

      likesCount:
        result.likesCount,
    };
  } catch (error) {
    console.error(
      "Lỗi toggleLike:",
      error,
    );

    return {
      success:
        false as const,

      error:
        "Đã có lỗi xảy ra khi xử lý lượt thích.",
    };
  }
}


// 5. Kiểm tra trạng thái like của user hiện tại với bài viết
export async function getPostLikeStatus(
  postId: string,
) {
  try {
    const {
      userId,
    } = await auth();

    if (
      typeof postId !==
        "string" ||
      !postId.trim()
    ) {
      return {
        liked:
          false,

        likesCount:
          0,
      };
    }

    const post =
      await prisma.post.findFirst({
        where: {
          id:
            postId,

          moderationStatus:
            "APPROVED",

          publishedAt: {
            not:
              null,
          },
        },

        select: {
          id: true,

          likesCount:
            true,

          forumId:
            true,

          forum: {
            select: {
              isActive:
                true,
            },
          },

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
        post.forumId &&
        !post.forum?.isActive
      )
    ) {
      return {
        liked:
          false,

        likesCount:
          0,
      };
    }

    if (post.group) {
      const allowed =
        await canReadGroupContent(
          prisma,
          post.group,
          userId,
        );

      if (!allowed) {
        return {
          liked:
            false,

          likesCount:
            0,
        };
      }
    }

    if (!userId) {
      // Logged-out user vẫn được thấy số like
      // của normal/public Group post.
      return {
        liked:
          false,

        likesCount:
          post.likesCount,
      };
    }

    const like =
      await prisma.like.findUnique({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },

        select: {
          id: true,
        },
      });

    return {
      liked:
        Boolean(
          like,
        ),

      likesCount:
        post.likesCount,
    };
  } catch (error) {
    console.error(
      "Lỗi getPostLikeStatus:",
      error,
    );

    return {
      liked:
        false,

      likesCount:
        0,
    };
  }
}
