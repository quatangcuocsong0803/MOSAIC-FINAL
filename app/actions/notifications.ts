"use server";
import { identitySelect, identityForViewer } from "@/lib/profile-identity";

import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

async function getCurrentDbUser() {
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

async function getAcceptedFriendIds(currentUserId: string) {
  const friendships = await prisma.friendship.findMany({
    where: {
      status: "ACCEPTED",
      OR: [
        {
          senderId: currentUserId,
        },
        {
          receiverId: currentUserId,
        },
      ],
    },

    select: {
      senderId: true,
      receiverId: true,
    },
  });

  return friendships.map((friendship) =>
    friendship.senderId === currentUserId
      ? friendship.receiverId
      : friendship.senderId,
  );
}

// ============================================================
// COUNTS CHO UTILITY BAR
// ============================================================

export async function getUtilityCounts() {
  try {
    const currentUser = await getCurrentDbUser();

    if (!currentUser) {
      return {
        success: false as const,
        unreadNotifications: 0,
        unreadMessages: 0,
      };
    }

    const [friendIds, unreadNotifications] = await Promise.all([
      getAcceptedFriendIds(currentUser.id),
      prisma.notification.count({
        where: { recipientId: currentUser.id, isRead: false },
      }),
    ]);

    const unreadMessages =
      friendIds.length === 0
        ? 0
        : await prisma.message.count({
            where: {
              readAt: null,

              senderId: {
                not: currentUser.id,
              },

              conversation: {
                OR: [
                  {
                    participantAId: currentUser.id,

                    participantBId: {
                      in: friendIds,
                    },
                  },

                  {
                    participantBId: currentUser.id,

                    participantAId: {
                      in: friendIds,
                    },
                  },
                ],
              },
            },
          });

    return {
      success: true as const,
      unreadNotifications,
      unreadMessages,
    };
  } catch (error) {
    console.error("Lỗi getUtilityCounts:", error);

    return {
      success: false as const,
      unreadNotifications: 0,
      unreadMessages: 0,
    };
  }
}

// ============================================================
// NOTIFICATION LIST
// ============================================================

export async function getNotifications() {
  try {
    const currentUser = await getCurrentDbUser();

    if (!currentUser) {
      return {
        success: false as const,
        reason: "UNAUTHENTICATED" as const,
        notifications: [],
        unreadCount: 0,
      };
    }

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: {
          recipientId: currentUser.id,
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 30,

        select: {
          id: true,
          type: true,
          title: true,
          body: true,
          href: true,
          entityType: true,
          entityId: true,
          isRead: true,
          createdAt: true,

          actor: {
            select: {
              ...identitySelect,
            },
          },
        },
      }),

      prisma.notification.count({
        where: {
          recipientId: currentUser.id,
          isRead: false,
        },
      }),
    ]);

    const identity = await identityForViewer(currentUser.id);
    return {
      success: true as const,
      unreadCount,

      notifications: notifications.map((notification) => ({
        ...notification,
        title:
          notification.actor &&
          notification.actor.usernameVisibility !== "PUBLIC"
            ? "Thông báo từ một thành viên MOSAIC"
            : notification.title,
        actor: notification.actor ? identity(notification.actor) : null,
        body:
          notification.actor &&
          notification.actor.usernameVisibility !== "PUBLIC"
            ? null
            : notification.body,
        createdAt: notification.createdAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Lỗi getNotifications:", error);

    return {
      success: false as const,
      reason: "SERVER_ERROR" as const,
      notifications: [],
      unreadCount: 0,
    };
  }
}

// ============================================================
// MARK ONE READ
// ============================================================

export async function markNotificationRead(notificationId: string) {
  try {
    const currentUser = await getCurrentDbUser();

    if (!currentUser) {
      return {
        success: false as const,
      };
    }

    await prisma.notification.updateMany({
      where: {
        id: notificationId,
        recipientId: currentUser.id,
        isRead: false,
      },

      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("Lỗi markNotificationRead:", error);

    return {
      success: false as const,
    };
  }
}

// ============================================================
// MARK ALL READ
// ============================================================

export async function markAllNotificationsRead() {
  try {
    const currentUser = await getCurrentDbUser();

    if (!currentUser) {
      return {
        success: false as const,
      };
    }

    await prisma.notification.updateMany({
      where: {
        recipientId: currentUser.id,
        isRead: false,
      },

      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("Lỗi markAllNotificationsRead:", error);

    return {
      success: false as const,
    };
  }
}

// ============================================================
// DELETE ONE
// ============================================================

export async function deleteNotification(notificationId: string) {
  try {
    const currentUser = await getCurrentDbUser();

    if (!currentUser) {
      return {
        success: false as const,
      };
    }

    await prisma.notification.deleteMany({
      where: {
        id: notificationId,
        recipientId: currentUser.id,
      },
    });

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("Lỗi deleteNotification:", error);

    return {
      success: false as const,
    };
  }
}
