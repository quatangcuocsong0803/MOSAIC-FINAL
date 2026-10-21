"use server";

import { formatMid } from "@/lib/mid";
import { visibleProfile } from "@/lib/profile-policy";
import { ensureUser } from "@/lib/ensure-user";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import {
  discoverWhere,
  discoverSelect,
  DISCOVER_PAGE_SIZE,
  type DiscoverOptions,
} from "@/lib/discover/query";
import { revalidatePath } from "next/cache";
import { isBlockedBetween } from "@/lib/blocks";
import {
  createNotification,
  deleteEntityNotifications,
} from "@/lib/notifications";

export type FriendStatus =
  "NONE" | "PENDING_SENT" | "PENDING_RECEIVED" | "FRIENDS";

export interface DiscoverUserItem {
  id: string;
  clerkId: string;
  username: string | null;
  mid?: string;
  displayName?: string | null;
  interestCodes?: string[];
  age?: number | null;
  zodiacSign?: string | null;
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
  hasMore?: boolean;
  nextCursor?: string;
}

function normalizeMbti(value: string | null | undefined): string | null {
  if (!value) return null;

  const normalized = value.trim().toUpperCase();

  return /^[IE][NS][TF][JP]$/.test(normalized) ? normalized : null;
}

function normalizeEnneagramCore(
  value: string | null | undefined,
): string | null {
  if (!value) return null;

  const match = value.match(/[1-9]/);

  return match ? `TYPE ${match[0]}` : null;
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
export async function getDiscoverUsers(
  options: DiscoverOptions = {},
): Promise<GetDiscoverUsersResponse> {
  let currentId: string | undefined;
  try {
    const { userId } = await auth();
    if (!userId)
      return {
        success: false,
        error: "Vui lòng đăng nhập để khám phá thành viên và kết nối.",
        users: [],
      };
    let me = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        confirmedMbtiType: true,
        confirmedEnneagramType: true,
      },
    });
    if (!me) {
      const clerkUser = await currentUser();
      me = await ensureUser(userId, clerkUser?.fullName);
    }
    currentId = me.id;
    const myMbti = normalizeMbti(me.confirmedMbtiType);
    const myCore =
      normalizeEnneagramCore(me.confirmedEnneagramType)?.slice(-1) || null;
    const tab = ["suggested", "requests", "community", "friends"].includes(
      options.tab || "",
    )
      ? options.tab
      : "community";
    const after =
      typeof options.after === "string" &&
      /^[a-zA-Z0-9_-]{1,100}$/.test(options.after)
        ? options.after
        : undefined;
    const [rows, friendships] = await Promise.all([
      prisma.user.findMany({
        where: discoverWhere(me.id, myMbti, myCore, { ...options, tab }),
        select: discoverSelect,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: DISCOVER_PAGE_SIZE + 1,
        ...(after ? { cursor: { id: after }, skip: 1 } : {}),
      }),
      prisma.friendship.findMany({
        where: { OR: [{ senderId: me.id }, { receiverId: me.id }] },
        select: { senderId: true, receiverId: true, status: true },
      }),
    ]);
    const statuses = new Map<string, FriendStatus>();
    for (const friend of friendships) {
      const other =
        friend.senderId === me.id ? friend.receiverId : friend.senderId;
      const old = statuses.get(other);
      if (friend.status === "ACCEPTED") statuses.set(other, "FRIENDS");
      else if (
        friend.status === "PENDING" &&
        old !== "FRIENDS" &&
        old !== "PENDING_SENT"
      )
        statuses.set(
          other,
          friend.senderId === me.id ? "PENDING_SENT" : "PENDING_RECEIVED",
        );
    }
    const page = rows.slice(0, DISCOVER_PAGE_SIZE);
    const users: DiscoverUserItem[] = page.map((row) => {
      const user = visibleProfile(
        row,
        false,
        statuses.get(row.id) === "FRIENDS",
      );
      const mbti = normalizeMbti(user.confirmedMbtiType);
      const core =
        normalizeEnneagramCore(user.confirmedEnneagramType)?.slice(-1) || null;
      const commonTraits: string[] = [];
      if (mbti && mbti === myMbti) commonTraits.push(`MBTI: ${mbti}`);
      if (core && core === myCore) commonTraits.push(`Enneagram: Type ${core}`);
      const testResults: DiscoverUserItem["testResults"] = [];
      if (mbti)
        testResults.push({
          id: `confirmed-mbti-${user.id}`,
          testType: "MBTI",
          resultName: mbti,
          details: null,
        });
      if (core)
        testResults.push({
          id: `confirmed-enneagram-${user.id}`,
          testType: "ENNEAGRAM",
          resultName: `Type ${core}`,
          details: null,
        });
      return {
        id: user.id,
        clerkId: user.clerkId,
        username: user.username,
        mid: formatMid(user.mid),
        displayName: user.displayName,
        interestCodes: user.interestCodes,
        age: user.age,
        zodiacSign: user.zodiacSign,
        createdAt: user.createdAt,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        hobbies: user.hobbies,
        location: user.location,
        testResults,
        commonTraits,
        isMatched: commonTraits.length > 0,
        friendStatus: statuses.get(user.id) || "NONE",
      };
    });
    return {
      success: true,
      currentUserId: me.id,
      users,
      hasMore: rows.length > DISCOVER_PAGE_SIZE,
      nextCursor:
        rows.length > DISCOVER_PAGE_SIZE ? page.at(-1)?.id : undefined,
    };
  } catch (error) {
    console.error("Lỗi getDiscoverUsers:", error);
    return {
      success: false,
      currentUserId: currentId,
      error: "Chưa tải được danh sách thành viên. Vui lòng thử lại.",
      users: [],
    };
  }
}

/**
 * Gửi lời mời kết bạn.
 */
export async function sendFriendRequest(targetUserId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Vui lòng đăng nhập để kết bạn.",
      };
    }

    const currentUserRecord = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!currentUserRecord) {
      return {
        success: false,
        error: "Không tìm thấy hồ sơ người dùng.",
      };
    }

    if (currentUserRecord.id === targetUserId) {
      return {
        success: false,
        error: "Không thể tự kết bạn với chính mình.",
      };
    }

    if (await isBlockedBetween(currentUserRecord.id, targetUserId)) {
      return {
        success: false,
        error: "Không thể gửi lời mời tới thành viên này.",
      };
    }

    // Kiểm tra request giữa 2 người.
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          {
            senderId: currentUserRecord.id,
            receiverId: targetUserId,
          },
          {
            senderId: targetUserId,
            receiverId: currentUserRecord.id,
          },
        ],
      },
    });

    if (existing) {
      if (existing.status === "ACCEPTED") {
        return {
          success: false,
          error: "Hai bạn đã là bạn bè.",
        };
      }

      return {
        success: false,
        error: "Lời mời kết bạn đã tồn tại.",
      };
    }

    const friendship = await prisma.friendship.create({
      data: {
        senderId: currentUserRecord.id,

        receiverId: targetUserId,

        status: "PENDING",
      },
    });

    const senderName = currentUserRecord.username || "Một thành viên";

    await createNotification({
      recipientId: targetUserId,
      actorId: currentUserRecord.id,
      type: "FRIEND_REQUEST",
      title: `${senderName} đã gửi lời mời kết bạn`,
      body: "Bạn có một lời mời kết bạn mới trên MOSAIC.",
      href: "/discover",
      entityType: "FRIENDSHIP",
      entityId: friendship.id,
    });

    revalidatePath("/discover");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Lỗi sendFriendRequest:", error);

    return {
      success: false,
      error: "Không thể gửi lời mời kết bạn.",
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
  accept: boolean,
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Vui lòng đăng nhập.",
      };
    }

    const currentUserRecord = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!currentUserRecord) {
      return {
        success: false,
        error: "Không tìm thấy hồ sơ người dùng.",
      };
    }

    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          {
            senderId: targetUserId,
            receiverId: currentUserRecord.id,
          },
          {
            senderId: currentUserRecord.id,
            receiverId: targetUserId,
          },
        ],
      },
    });

    if (!friendship) {
      return {
        success: false,
        error: "Không tìm thấy yêu cầu kết bạn.",
      };
    }

    if (accept) {
      // Chỉ người NHẬN lời mời mới có quyền accept.
      if (friendship.receiverId !== currentUserRecord.id) {
        return {
          success: false,
          error: "Bạn không có quyền chấp nhận lời mời này.",
        };
      }

      await prisma.friendship.update({
        where: {
          id: friendship.id,
        },

        data: {
          status: "ACCEPTED",
        },
      });

      // Lời mời cũ không còn cần nằm trong notification center.
      await deleteEntityNotifications({
        recipientId: currentUserRecord.id,
        type: "FRIEND_REQUEST",
        entityType: "FRIENDSHIP",
        entityId: friendship.id,
      });

      const accepterName = currentUserRecord.username || "Một thành viên";

      await createNotification({
        recipientId: friendship.senderId,
        actorId: currentUserRecord.id,
        type: "FRIEND_ACCEPTED",
        title: `${accepterName} đã đồng ý kết bạn`,
        body: "Hai bạn giờ đã có thể xem hồ sơ và nhắn tin với nhau.",
        href: `/profile/${currentUserRecord.id}`,
        entityType: "FRIENDSHIP",
        entityId: friendship.id,
      });
    } else {
      const wasPending = friendship.status === "PENDING";

      await prisma.friendship.delete({
        where: {
          id: friendship.id,
        },
      });

      // Nếu là lời mời đang pending:
      // reject/cancel phải dọn notification lời mời.
      if (wasPending) {
        await deleteEntityNotifications({
          recipientId: friendship.receiverId,
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
    console.error("Lỗi respondFriendRequest:", error);

    return {
      success: false,
      error: "Đã có lỗi xảy ra khi xử lý yêu cầu.",
    };
  }
}
