"use server";

import {
  publicCommentWhere,
} from "@/lib/discussion/comment-service";

import {
  publicDiscussionPostAccessWhere,
} from "@/lib/discussion/group-access";

import {
  prisma,
} from "@/lib/prisma";

export async function getDiscussionForums() {
  try {
    const forums =
      await prisma.forum.findMany({
        where: {
          isActive:
            true,
        },

        orderBy: {
          displayOrder:
            "asc",
        },

        include: {
          _count: {
            select: {
              posts: {
                where: {
                  moderationStatus:
                    "APPROVED",

                  publishedAt: {
                    not:
                      null,
                  },

                  ...publicDiscussionPostAccessWhere,
                },
              },
            },
          },
        },
      });

    return {
      success:
        true as const,

      forums,
    };
  } catch (error) {
    console.error(
      "Lỗi getDiscussionForums:",
      error,
    );

    return {
      success:
        false as const,

      forums: [],
    };
  }
}

export async function getDiscussionFeed(
  forumSlug?: string,
) {
  try {
    const posts =
      await prisma.post.findMany({
        where: {
          moderationStatus:
            "APPROVED",

          publishedAt: {
            not:
              null,
          },

          ...publicDiscussionPostAccessWhere,

          ...(forumSlug
            ? {
                forum: {
                  slug:
                    forumSlug,

                  isActive:
                    true,
                },
              }
            : {}),
        },

        include: {
          forum: {
            select: {
              id: true,
              slug: true,
              name: true,

              shortLabel:
                true,

              moderationPolicy:
                true,
            },
          },

          citations: {
            orderBy: {
              sortOrder:
                "asc",
            },

            select: {
              id: true,
              title: true,
              authors: true,
              year: true,
              publisher: true,
              url: true,
              doi: true,
              sourceType: true,

              verificationStatus:
                true,

              sortOrder:
                true,
            },
          },

          _count: {
            select: {
              comments: {
                where:
                  publicCommentWhere,
              },

              likes: true,
            },
          },
        },

        orderBy: [
          {
            publishedAt:
              "desc",
          },

          {
            createdAt:
              "desc",
          },
        ],

        take: 50,
      });

    return {
      success:
        true as const,

      posts,
    };
  } catch (error) {
    console.error(
      "Lỗi getDiscussionFeed:",
      error,
    );

    return {
      success:
        false as const,

      posts: [],
    };
  }
}
