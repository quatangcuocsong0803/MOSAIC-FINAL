"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { isBlockedBetween } from "@/lib/blocks";
import {
  createNotification,
  deleteEntityNotifications,
} from "@/lib/notifications";

export type FriendStatus =
  | "NONE"
  | "PENDING_SENT"
  | "PENDING_RECEIVED"
  | "FRIENDS";

export interface DiscoverUserItem {
  id: string;
  clerkId: string;
  username: string | null;
  createdAt: Date;
  avatarUrl?: string | null;
  bio?: string | null;
  hobbies?: string | null;
  location?: string | null;

  /**
   * Giữ shape cũ để UserCard hiện tại không bị vỡ.
   *
   * QUAN TRỌNG:
   * Đây KHÔNG còn là lịch sử TestResult thật.
   * Chỉ chứa personality identity mà user đã xác nhận công khai.
   */
  testResults: {
    id: string;
    testType: string;
    resultName: string;
    details: string | null;
  }[];

  isMatched: boolean;
  commonTraits: string[];
  friendStatus: FriendStatus;
}

export interface GetDiscoverUsersResponse {
  success: boolean;
  error?: string;
  currentUserId?: string;
  users: DiscoverUserItem[];
}

function normalizeMbti(
  value: string | null | undefined
): string | null {
  if (!value) return null;

  const normalized = value.trim().toUpperCase();

  return /^[IE][NS][TF][JP]$/.test(normalized)
    ? normalized
    : null;
}

function normalizeEnneagramCore(
  value: string | null | undefined
): string | null {
  if (!value) return null;

  const match = value.match(/[1-9]/);

  return match
    ? `TYPE ${match[0]}`
    : null;
}

function displayEnneagramCore(
  value: string | null | undefined
): string | null {
  const normalized =
    normalizeEnneagramCore(value);

  if (!normalized) return null;

  const match = normalized.match(/[1-9]/);

  return match
    ? `Type ${match[0]}`
    : null;
}

/**
 * Discover chỉ dùng personality identity đã được user xác nhận.
 *
 * Không dùng toàn bộ TestResult để:
 * - suy ra identity,
 * - match người dùng,
 * - hoặc expose lịch sử test ra client.
 *
 * Manual và Test được đối xử giống nhau:
 * chỉ confirmed... mới là source of truth.
 */
export async function getDiscoverUsers(): Promise<GetDiscoverUsersResponse> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error:
          "Vui lòng đăng nhập để khám phá thành viên và kết nối.",
        users: [],
      };
    }

    // ========================================================
    // 1. Lấy / tạo user hiện tại
    // ========================================================

    let currentUserRecord =
      await prisma.user.findUnique({
        where: {
          clerkId: userId,
        },
      });

    if (!currentUserRecord) {
      const clerkUser =
        await currentUser();

      let username =
        clerkUser?.username ||
        [
          clerkUser?.firstName,
          clerkUser?.lastName,
        ]
          .filter(Boolean)
          .join(" ");

      if (!username) {
        username =
          `user_${userId.slice(-6)}`;
      }

      const existingUser =
        await prisma.user.findUnique({
          where: {
            username,
          },
        });

      if (
        existingUser &&
        existingUser.clerkId !== userId
      ) {
        username =
          `${username}_${userId.slice(-4)}`;
      }

      currentUserRecord =
        await prisma.user.create({
          data: {
            clerkId: userId,
            username,
          },
        });
    }

    // Users bị block theo bất kỳ chiều nào đều biến mất khỏi Discover.
    const blockRows =
      await prisma.userBlock.findMany({
        where: {
          OR: [
            {
              blockerId:
                currentUserRecord.id,
            },
            {
              blockedId:
                currentUserRecord.id,
            },
          ],
        },

        select: {
          blockerId: true,
          blockedId: true,
        },
      });

    const hiddenUserIds =
      blockRows.map((block) =>
        block.blockerId ===
        currentUserRecord.id
          ? block.blockedId
          : block.blockerId,
      );

    // ========================================================
    // 2. Personality identity hiện tại của chính tôi
    // ========================================================

    const myMbti =
      normalizeMbti(
        currentUserRecord.confirmedMbtiType
      );

    const myEnneagram =
      normalizeEnneagramCore(
        currentUserRecord.confirmedEnneagramType
      );

    // ========================================================
    // 3. Lấy user khác
    //
    // Không include testResults nữa.
    // ========================================================

    const otherUsers =
      await prisma.user.findMany({
        where: {
          id: {
            not: currentUserRecord.id,
            notIn: hiddenUserIds,
          },
        },

        include: {
          sentRequests: {
            where: {
              receiverId:
                currentUserRecord.id,
            },
          },

          receivedRequests: {
            where: {
              senderId:
                currentUserRecord.id,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    // ========================================================
    // 4. Match bằng confirmed identity
    // ========================================================

    const users: DiscoverUserItem[] =
      otherUsers.map((user) => {
        const commonTraits: string[] =
          [];

        const otherMbti =
          normalizeMbti(
            user.confirmedMbtiType
          );

        const otherEnneagram =
          normalizeEnneagramCore(
            user.confirmedEnneagramType
          );

        if (
          myMbti &&
          otherMbti &&
          myMbti === otherMbti
        ) {
          commonTraits.push(
            `MBTI: ${otherMbti}`
          );
        }

        if (
          myEnneagram &&
          otherEnneagram &&
          myEnneagram === otherEnneagram
        ) {
          const display =
            displayEnneagramCore(
              user.confirmedEnneagramType
            );

          if (display) {
            commonTraits.push(
              `Enneagram: ${display}`
            );
          }
        }

        const isMatched =
          commonTraits.length > 0;

        // ====================================================
        // Friend status
        // ====================================================

        let friendStatus: FriendStatus =
          "NONE";

        // Đối phương gửi cho tôi.
        const requestReceived =
          user.sentRequests[0];

        // Tôi gửi cho đối phương.
        const requestSent =
          user.receivedRequests[0];

        if (
          requestReceived?.status ===
            "ACCEPTED" ||
          requestSent?.status ===
            "ACCEPTED"
        ) {
          friendStatus = "FRIENDS";
        } else if (
          requestSent?.status ===
          "PENDING"
        ) {
          friendStatus =
            "PENDING_SENT";
        } else if (
          requestReceived?.status ===
          "PENDING"
        ) {
          friendStatus =
            "PENDING_RECEIVED";
        }

        // ====================================================
        // Public personality data cho UserCard
        //
        // Giữ field testResults để không phải sửa UI ngay,
        // nhưng chỉ tạo dữ liệu từ confirmed identity.
        // Không trả lịch sử TestResult thật.
        // ====================================================

        const publicPersonalityResults: DiscoverUserItem["testResults"] =
          [];

        if (otherMbti) {
          publicPersonalityResults.push({
            id: `confirmed-mbti-${user.id}`,
            testType: "MBTI",
            resultName: otherMbti,
            details: null,
          });
        }

        const otherEnneagramDisplay =
          displayEnneagramCore(
            user.confirmedEnneagramType
          );

        if (otherEnneagramDisplay) {
          publicPersonalityResults.push({
            id: `confirmed-enneagram-${user.id}`,
            testType: "ENNEAGRAM",
            resultName:
              otherEnneagramDisplay,
            details: null,
          });
        }

        return {
          id: user.id,
          clerkId: user.clerkId,
          username: user.username,
          createdAt: user.createdAt,
          avatarUrl: user.avatarUrl,
          bio: user.bio,
          hobbies: user.hobbies,
          location: user.location,

          testResults:
            publicPersonalityResults,

          isMatched,
          commonTraits,
          friendStatus,
        };
      });

    return {
      success: true,
      currentUserId:
        currentUserRecord.id,
      users,
    };
  } catch (error) {
    console.error(
      "Lỗi getDiscoverUsers:",
      error
    );

    return {
      success: false,
      error:
        "Đã có lỗi xảy ra khi tải danh sách thành viên.",
      users: [],
    };
  }
}

/**
 * Gửi lời mời kết bạn.
 */
export async function sendFriendRequest(
  targetUserId: string
) {
  try {
    const { userId } =
      await auth();

    if (!userId) {
      return {
        success: false,
        error:
          "Vui lòng đăng nhập để kết bạn.",
      };
    }

    const currentUserRecord =
      await prisma.user.findUnique({
        where: {
          clerkId: userId,
        },
      });

    if (!currentUserRecord) {
      return {
        success: false,
        error:
          "Không tìm thấy hồ sơ người dùng.",
      };
    }

    if (
      currentUserRecord.id ===
      targetUserId
    ) {
      return {
        success: false,
        error:
          "Không thể tự kết bạn với chính mình.",
      };
    }

    if (
      await isBlockedBetween(
        currentUserRecord.id,
        targetUserId,
      )
    ) {
      return {
        success: false,
        error:
          "Không thể gửi lời mời tới thành viên này.",
      };
    }

    // Kiểm tra request giữa 2 người.
    const existing =
      await prisma.friendship.findFirst({
        where: {
          OR: [
            {
              senderId:
                currentUserRecord.id,
              receiverId:
                targetUserId,
            },
            {
              senderId:
                targetUserId,
              receiverId:
                currentUserRecord.id,
            },
          ],
        },
      });

    if (existing) {
      if (
        existing.status ===
        "ACCEPTED"
      ) {
        return {
          success: false,
          error:
            "Hai bạn đã là bạn bè.",
        };
      }

      return {
        success: false,
        error:
          "Lời mời kết bạn đã tồn tại.",
      };
    }

    const friendship =
      await prisma.friendship.create({
        data: {
          senderId:
            currentUserRecord.id,

          receiverId:
            targetUserId,

          status:
            "PENDING",
        },
      });

    const senderName =
      currentUserRecord.username ||
      "Một thành viên";

    await createNotification({
      recipientId: targetUserId,
      actorId: currentUserRecord.id,
      type: "FRIEND_REQUEST",
      title: `${senderName} đã gửi lời mời kết bạn`,
      body:
        "Bạn có một lời mời kết bạn mới trên MOSAIC.",
      href: "/discover",
      entityType: "FRIENDSHIP",
      entityId: friendship.id,
    });

    revalidatePath("/discover");

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Lỗi sendFriendRequest:",
      error
    );

    return {
      success: false,
      error:
        "Không thể gửi lời mời kết bạn.",
    };
  }
}

/**
 * Phản hồi lời mời kết bạn:
 * accept = true  -> chấp nhận
 * accept = false -> từ chối / hủy
 */
export async function respondFriendRequest(
  targetUserId: string,
  accept: boolean
) {
  try {
    const { userId } =
      await auth();

    if (!userId) {
      return {
        success: false,
        error:
          "Vui lòng đăng nhập.",
      };
    }

    const currentUserRecord =
      await prisma.user.findUnique({
        where: {
          clerkId: userId,
        },
      });

    if (!currentUserRecord) {
      return {
        success: false,
        error:
          "Không tìm thấy hồ sơ người dùng.",
      };
    }

    const friendship =
      await prisma.friendship.findFirst({
        where: {
          OR: [
            {
              senderId:
                targetUserId,
              receiverId:
                currentUserRecord.id,
            },
            {
              senderId:
                currentUserRecord.id,
              receiverId:
                targetUserId,
            },
          ],
        },
      });

    if (!friendship) {
      return {
        success: false,
        error:
          "Không tìm thấy yêu cầu kết bạn.",
      };
    }

    if (accept) {
      // Chỉ người NHẬN lời mời mới có quyền accept.
      if (
        friendship.receiverId !==
        currentUserRecord.id
      ) {
        return {
          success: false,
          error:
            "Bạn không có quyền chấp nhận lời mời này.",
        };
      }

      await prisma.friendship.update({
        where: {
          id: friendship.id,
        },

        data: {
          status:
            "ACCEPTED",
        },
      });

      // Lời mời cũ không còn cần nằm trong notification center.
      await deleteEntityNotifications({
        recipientId:
          currentUserRecord.id,
        type: "FRIEND_REQUEST",
        entityType: "FRIENDSHIP",
        entityId: friendship.id,
      });

      const accepterName =
        currentUserRecord.username ||
        "Một thành viên";

      await createNotification({
        recipientId:
          friendship.senderId,
        actorId:
          currentUserRecord.id,
        type: "FRIEND_ACCEPTED",
        title:
          `${accepterName} đã đồng ý kết bạn`,
        body:
          "Hai bạn giờ đã có thể xem hồ sơ và nhắn tin với nhau.",
        href:
          `/profile/${currentUserRecord.id}`,
        entityType: "FRIENDSHIP",
        entityId: friendship.id,
      });
    } else {
      const wasPending =
        friendship.status ===
        "PENDING";

      await prisma.friendship.delete({
        where: {
          id: friendship.id,
        },
      });

      // Nếu là lời mời đang pending:
      // reject/cancel phải dọn notification lời mời.
      if (wasPending) {
        await deleteEntityNotifications({
          recipientId:
            friendship.receiverId,
          type: "FRIEND_REQUEST",
          entityType: "FRIENDSHIP",
          entityId: friendship.id,
        });
      }
    }

    revalidatePath("/discover");

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Lỗi respondFriendRequest:",
      error
    );

    return {
      success: false,
      error:
        "Đã có lỗi xảy ra khi xử lý yêu cầu.",
    };
  }
}
