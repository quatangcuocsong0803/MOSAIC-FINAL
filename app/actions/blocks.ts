"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
    select: {
      id: true,
    },
  });
}

export async function blockUser(
  targetUserId: string,
) {
  try {
    const currentUser =
      await getCurrentUser();

    if (!currentUser) {
      return {
        success: false as const,
        reason: "UNAUTHENTICATED" as const,
      };
    }

    if (
      !targetUserId ||
      targetUserId === currentUser.id
    ) {
      return {
        success: false as const,
        reason: "INVALID_TARGET" as const,
      };
    }

    const targetExists =
      await prisma.user.findUnique({
        where: {
          id: targetUserId,
        },
        select: {
          id: true,
        },
      });

    if (!targetExists) {
      return {
        success: false as const,
        reason: "USER_NOT_FOUND" as const,
      };
    }

    const friendships =
      await prisma.friendship.findMany({
        where: {
          OR: [
            {
              senderId: currentUser.id,
              receiverId: targetUserId,
            },
            {
              senderId: targetUserId,
              receiverId: currentUser.id,
            },
          ],
        },

        select: {
          id: true,
        },
      });

    const friendshipIds =
      friendships.map(
        (friendship) => friendship.id,
      );

    await prisma.$transaction(async (tx) => {
      await tx.userBlock.upsert({
        where: {
          blockerId_blockedId: {
            blockerId: currentUser.id,
            blockedId: targetUserId,
          },
        },

        update: {},

        create: {
          blockerId: currentUser.id,
          blockedId: targetUserId,
        },
      });

      // Block đồng nghĩa hủy friendship / pending request.
      await tx.friendship.deleteMany({
        where: {
          OR: [
            {
              senderId: currentUser.id,
              receiverId: targetUserId,
            },
            {
              senderId: targetUserId,
              receiverId: currentUser.id,
            },
          ],
        },
      });

      // Dọn notification của friendship cũ.
      if (friendshipIds.length > 0) {
        await tx.notification.deleteMany({
          where: {
            entityType: "FRIENDSHIP",
            entityId: {
              in: friendshipIds,
            },
          },
        });
      }
    });

    revalidatePath("/discover");
    revalidatePath("/messages");
    revalidatePath("/profile");
    revalidatePath(
      `/profile/${targetUserId}`,
    );

    return {
      success: true as const,
    };
  } catch (error) {
    console.error(
      "Lỗi blockUser:",
      error,
    );

    return {
      success: false as const,
      reason: "SERVER_ERROR" as const,
    };
  }
}

export async function unblockUser(
  targetUserId: string,
) {
  try {
    const currentUser =
      await getCurrentUser();

    if (!currentUser) {
      return {
        success: false as const,
        reason: "UNAUTHENTICATED" as const,
      };
    }

    await prisma.userBlock.deleteMany({
      where: {
        blockerId: currentUser.id,
        blockedId: targetUserId,
      },
    });

    // Không tự khôi phục friendship.
    revalidatePath("/discover");
    revalidatePath("/profile/blocked");

    return {
      success: true as const,
    };
  } catch (error) {
    console.error(
      "Lỗi unblockUser:",
      error,
    );

    return {
      success: false as const,
      reason: "SERVER_ERROR" as const,
    };
  }
}

export async function getBlockedUsers() {
  try {
    const currentUser =
      await getCurrentUser();

    if (!currentUser) {
      return {
        success: false as const,
        reason: "UNAUTHENTICATED" as const,
        users: [],
      };
    }

    const blocks =
      await prisma.userBlock.findMany({
        where: {
          blockerId: currentUser.id,
        },

        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          createdAt: true,

          blocked: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      });

    return {
      success: true as const,

      users: blocks.map((block) => ({
        ...block.blocked,
        blockedAt: block.createdAt,
      })),
    };
  } catch (error) {
    console.error(
      "Lỗi getBlockedUsers:",
      error,
    );

    return {
      success: false as const,
      reason: "SERVER_ERROR" as const,
      users: [],
    };
  }
}
