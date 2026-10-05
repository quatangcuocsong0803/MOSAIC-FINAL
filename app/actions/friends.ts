"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { isBlockedBetween } from "@/lib/blocks";

export async function getFriendProfile(targetUserId: string) {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return {
      success: false as const,
      reason: "UNAUTHENTICATED" as const,
    };
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      clerkId: clerkUserId,
    },
    select: {
      id: true,
    },
  });

  if (!currentUser) {
    return {
      success: false as const,
      reason: "CURRENT_USER_NOT_FOUND" as const,
    };
  }

  if (currentUser.id === targetUserId) {
    return {
      success: false as const,
      reason: "SELF" as const,
    };
  }

  if (
    await isBlockedBetween(
      currentUser.id,
      targetUserId,
    )
  ) {
    return {
      success: false as const,
      reason: "NOT_FRIENDS" as const,
    };
  }

  const friendship = await prisma.friendship.findFirst({
    where: {
      status: "ACCEPTED",
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

  if (!friendship) {
    return {
      success: false as const,
      reason: "NOT_FRIENDS" as const,
    };
  }

  const profile = await prisma.user.findUnique({
    where: {
      id: targetUserId,
    },
    select: {
      id: true,
      username: true,
      createdAt: true,
      avatarUrl: true,
      bio: true,
      location: true,
      hobbies: true,
      zodiacSign: true,

      confirmedMbtiType: true,
      confirmedEnneagramType: true,
      confirmedEnneagramWing: true,
      confirmedEnneagramTritype: true,
    },
  });

  if (!profile) {
    return {
      success: false as const,
      reason: "USER_NOT_FOUND" as const,
    };
  }

  return {
    success: true as const,
    profile,
  };
}
