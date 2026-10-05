import type { NotificationType, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

interface CreateNotificationInput {
  recipientId: string;
  actorId?: string | null;
  type: NotificationType;
  title: string;
  body?: string | null;
  href?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  dedupeId?: string; 
}

export async function createNotification({
  recipientId,
  actorId = null,
  type,
  title,
  body = null,
  href = null,
  entityType = null,
  entityId = null,
  dedupeId,
}: CreateNotificationInput, db: Pick<Prisma.TransactionClient, "notification" | "userSettings"> = prisma) {
  // Không tự gửi notification cho chính mình.
  if (actorId && actorId === recipientId) {
    return null;
  }

  const preferences = await db.userSettings.findUnique({ where: { userId: recipientId } });
  const allowed = type === "FRIEND_REQUEST" || type === "FRIEND_ACCEPTED" ? preferences?.notificationFriends
    : type === "POST_COMMENT" || type === "COMMENT_REPLY" ? preferences?.notificationComments
    : type === "POST_REACTION" || type === "COMMUNITY_ACTIVITY" ? preferences?.notificationReactions
    : entityType === "MODERATION_REVIEW" ? preferences?.notificationReviews : true;
  if (allowed === false) return null;
  const data = { recipientId, actorId, type, title, body, href, entityType, entityId };
  if (dedupeId) return db.notification.upsert({ where: { id: dedupeId }, create: { id: dedupeId, ...data }, update: {} });
  return db.notification.create({ data });
}

interface DeleteEntityNotificationInput {
  recipientId?: string;
  actorId?: string;
  type?: NotificationType;
  entityType: string;
  entityId: string;
}

export async function deleteEntityNotifications({
  recipientId,
  actorId,
  type,
  entityType,
  entityId,
}: DeleteEntityNotificationInput) {
  return prisma.notification.deleteMany({
    where: {
      ...(recipientId ? { recipientId } : {}),
      ...(actorId ? { actorId } : {}),
      ...(type ? { type } : {}),
      entityType,
      entityId,
    },
  });
}
