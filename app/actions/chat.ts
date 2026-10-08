"use server";
import { identitySelect, visibleIdentity } from "@/lib/profile-identity";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { isBlockedBetween } from "@/lib/blocks";

// ============================================================
// Helpers
// ============================================================

async function getCurrentDbUser() {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      clerkId: clerkUserId,
    },
    select: {
      id: true,
      username: true,
      avatarUrl: true,
    },
  });
}

async function areFriends(userAId: string, userBId: string) {
  const friendship = await prisma.friendship.findFirst({
    where: {
      status: "ACCEPTED",
      OR: [
        {
          senderId: userAId,
          receiverId: userBId,
        },
        {
          senderId: userBId,
          receiverId: userAId,
        },
      ],
    },
    select: {
      id: true,
    },
  });

  return Boolean(friendship);
}

function canonicalParticipants(userAId: string, userBId: string) {
  return [userAId, userBId].sort() as [string, string];
}

// ============================================================
// OPEN / CREATE CONVERSATION
// ============================================================

export async function getOrCreateConversation(targetUserId: string) {
  try {
    const currentUser = await getCurrentDbUser();

    if (!currentUser) {
      return {
        success: false as const,
        reason: "UNAUTHENTICATED" as const,
      };
    }

    if (!targetUserId || currentUser.id === targetUserId) {
      return {
        success: false as const,
        reason: "INVALID_TARGET" as const,
      };
    }

    const targetUser = await prisma.user.findUnique({
      where: {
        id: targetUserId,
      },
      select: {
        id: true,
      },
    });

    if (!targetUser) {
      return {
        success: false as const,
        reason: "USER_NOT_FOUND" as const,
      };
    }

    if (await isBlockedBetween(currentUser.id, targetUserId)) {
      return {
        success: false as const,
        reason: "NOT_FRIENDS" as const,
      };
    }

    const friendshipAccepted = await areFriends(currentUser.id, targetUserId);

    if (!friendshipAccepted) {
      return {
        success: false as const,
        reason: "NOT_FRIENDS" as const,
      };
    }

    const [participantAId, participantBId] = canonicalParticipants(
      currentUser.id,
      targetUserId,
    );

    const conversation = await prisma.conversation.upsert({
      where: {
        participantAId_participantBId: {
          participantAId,
          participantBId,
        },
      },

      update: {},

      create: {
        participantAId,
        participantBId,
      },

      select: {
        id: true,
      },
    });

    return {
      success: true as const,
      conversationId: conversation.id,
    };
  } catch (error) {
    console.error("Lỗi getOrCreateConversation:", error);

    return {
      success: false as const,
      reason: "SERVER_ERROR" as const,
    };
  }
}

// ============================================================
// GET CONVERSATION + MESSAGES
// ============================================================

export async function getConversation(conversationId: string) {
  try {
    const currentUser = await getCurrentDbUser();

    if (!currentUser) {
      return {
        success: false as const,
        reason: "UNAUTHENTICATED" as const,
      };
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },

      select: {
        id: true,
        participantAId: true,
        participantBId: true,

        participantA: {
          select: {
            ...identitySelect,
          },
        },

        participantB: {
          select: {
            ...identitySelect,
          },
        },

        messages: {
          orderBy: {
            createdAt: "desc",
          },

          take: 100,

          select: {
            id: true,
            senderId: true,
            content: true,
            createdAt: true,
            readAt: true,
          },
        },
      },
    });

    if (!conversation) {
      return {
        success: false as const,
        reason: "CONVERSATION_NOT_FOUND" as const,
      };
    }

    const isParticipant =
      conversation.participantAId === currentUser.id ||
      conversation.participantBId === currentUser.id;

    if (!isParticipant) {
      return {
        success: false as const,
        reason: "FORBIDDEN" as const,
      };
    }

    const otherUser =
      conversation.participantAId === currentUser.id
        ? conversation.participantB
        : conversation.participantA;

    // Quan trọng:
    // Conversation từng tồn tại không có nghĩa là
    // sau khi unfriend vẫn được đọc lịch sử chat.
    if (await isBlockedBetween(currentUser.id, otherUser.id)) {
      return {
        success: false as const,
        reason: "NOT_FRIENDS" as const,
      };
    }

    const friendshipAccepted = await areFriends(currentUser.id, otherUser.id);

    if (!friendshipAccepted) {
      return {
        success: false as const,
        reason: "NOT_FRIENDS" as const,
      };
    }

    // Đánh dấu message của đối phương là đã đọc.
    await prisma.message.updateMany({
      where: {
        conversationId: conversation.id,

        senderId: {
          not: currentUser.id,
        },

        readAt: null,
      },

      data: {
        readAt: new Date(),
      },
    });

    return {
      success: true as const,

      conversation: {
        id: conversation.id,

        otherUser: visibleIdentity(otherUser, false, true),

        messages: conversation.messages.reverse(),
      },
    };
  } catch (error) {
    console.error("Lỗi getConversation:", error);

    return {
      success: false as const,
      reason: "SERVER_ERROR" as const,
    };
  }
}

// ============================================================
// SEND MESSAGE
// ============================================================

export async function sendMessage(conversationId: string, rawContent: string) {
  try {
    const currentUser = await getCurrentDbUser();

    if (!currentUser) {
      return {
        success: false as const,
        reason: "UNAUTHENTICATED" as const,
      };
    }

    const content = rawContent.trim();

    if (!content) {
      return {
        success: false as const,
        reason: "EMPTY_MESSAGE" as const,
      };
    }

    if (content.length > 2000) {
      return {
        success: false as const,
        reason: "MESSAGE_TOO_LONG" as const,
      };
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },

      select: {
        id: true,
        participantAId: true,
        participantBId: true,
      },
    });

    if (!conversation) {
      return {
        success: false as const,
        reason: "CONVERSATION_NOT_FOUND" as const,
      };
    }

    const isParticipant =
      conversation.participantAId === currentUser.id ||
      conversation.participantBId === currentUser.id;

    if (!isParticipant) {
      return {
        success: false as const,
        reason: "FORBIDDEN" as const,
      };
    }

    const otherUserId =
      conversation.participantAId === currentUser.id
        ? conversation.participantBId
        : conversation.participantAId;

    if (await isBlockedBetween(currentUser.id, otherUserId)) {
      return {
        success: false as const,
        reason: "NOT_FRIENDS" as const,
      };
    }

    const friendshipAccepted = await areFriends(currentUser.id, otherUserId);

    if (!friendshipAccepted) {
      return {
        success: false as const,
        reason: "NOT_FRIENDS" as const,
      };
    }

    const [message] = await prisma.$transaction([
      prisma.message.create({
        data: {
          conversationId: conversation.id,

          senderId: currentUser.id,

          content,
        },

        select: {
          id: true,
          senderId: true,
          content: true,
          createdAt: true,
          readAt: true,
        },
      }),

      prisma.conversation.update({
        where: {
          id: conversation.id,
        },

        data: {
          updatedAt: new Date(),
        },

        select: {
          id: true,
        },
      }),
    ]);

    revalidatePath(`/messages/${conversation.id}`);

    revalidatePath("/messages");

    return {
      success: true as const,
      message,
    };
  } catch (error) {
    console.error("Lỗi sendMessage:", error);

    return {
      success: false as const,
      reason: "SERVER_ERROR" as const,
    };
  }
}

// ============================================================
// INBOX
// ============================================================

export async function getConversations() {
  try {
    const currentUser = await getCurrentDbUser();

    if (!currentUser) {
      return {
        success: false as const,
        reason: "UNAUTHENTICATED" as const,
        conversations: [],
      };
    }

    const friendships = await prisma.friendship.findMany({
      where: {
        status: "ACCEPTED",

        OR: [
          {
            senderId: currentUser.id,
          },
          {
            receiverId: currentUser.id,
          },
        ],
      },

      select: {
        senderId: true,
        receiverId: true,
      },
    });

    const friendIds = friendships.map((friendship) =>
      friendship.senderId === currentUser.id
        ? friendship.receiverId
        : friendship.senderId,
    );

    if (friendIds.length === 0) {
      return {
        success: true as const,
        conversations: [],
      };
    }

    const conversations = await prisma.conversation.findMany({
      where: {
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

      orderBy: {
        updatedAt: "desc",
      },

      select: {
        id: true,
        participantAId: true,
        participantBId: true,
        updatedAt: true,

        participantA: {
          select: {
            ...identitySelect,
          },
        },

        participantB: {
          select: {
            ...identitySelect,
          },
        },

        messages: {
          orderBy: {
            createdAt: "desc",
          },

          take: 1,

          select: {
            id: true,
            senderId: true,
            content: true,
            createdAt: true,
            readAt: true,
          },
        },
      },
    });

    const conversationIds = conversations.map(
      (conversation) => conversation.id,
    );

    const unreadGroups =
      conversationIds.length === 0
        ? []
        : await prisma.message.groupBy({
            by: ["conversationId"],

            where: {
              conversationId: {
                in: conversationIds,
              },

              senderId: {
                not: currentUser.id,
              },

              readAt: null,
            },

            _count: {
              _all: true,
            },
          });

    const unreadCountByConversation = new Map(
      unreadGroups.map((group) => [group.conversationId, group._count._all]),
    );

    return {
      success: true as const,

      conversations: conversations.map((conversation) => {
        const otherUser =
          conversation.participantAId === currentUser.id
            ? conversation.participantB
            : conversation.participantA;

        return {
          id: conversation.id,
          otherUser: visibleIdentity(otherUser, false, true),
          updatedAt: conversation.updatedAt,

          unreadCount: unreadCountByConversation.get(conversation.id) ?? 0,

          lastMessage: conversation.messages[0] ?? null,
        };
      }),
    };
  } catch (error) {
    console.error("Lỗi getConversations:", error);

    return {
      success: false as const,
      reason: "SERVER_ERROR" as const,
      conversations: [],
    };
  }
}
