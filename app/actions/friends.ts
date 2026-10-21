"use server";

import { visibleProfile } from "@/lib/profile-policy";
import { discoverSelect } from "@/lib/discover/query";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { isBlockedBetween } from "@/lib/blocks";

export async function getFriendProfile(targetUserId: string) {
  const { userId: clerkUserId } = await auth();

  const currentUser = clerkUserId
    ? await prisma.user.findUnique({
        where: { clerkId: clerkUserId },
        select: { id: true },
      })
    : null;

  if (currentUser?.id === targetUserId) {
    return {
      success: false as const,
      reason: "SELF" as const,
    };
  }

  if (currentUser && (await isBlockedBetween(currentUser.id, targetUserId))) {
    return {
      success: false as const,
      reason: "NOT_FRIENDS" as const,
    };
  }

  const friendship = currentUser
    ? await prisma.friendship.findFirst({
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
      })
    : null;

  const profile = await prisma.user.findUnique({
    where: {
      id: targetUserId,
    },
    select: {
      ...discoverSelect,
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
    isFriend: Boolean(friendship),
    profile: visibleProfile(profile, false, Boolean(friendship)),
  };
}
