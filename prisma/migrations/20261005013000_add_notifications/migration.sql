-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM (
    'FRIEND_REQUEST',
    'FRIEND_ACCEPTED',
    'POST_COMMENT',
    'COMMENT_REPLY',
    'POST_REACTION',
    'COMMUNITY_ACTIVITY',
    'SYSTEM'
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "actorId" TEXT,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "href" TEXT,
    "entityType" TEXT,
    "entityId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_recipientId_isRead_createdAt_idx"
ON "Notification"("recipientId", "isRead", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_recipientId_createdAt_idx"
ON "Notification"("recipientId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_actorId_idx"
ON "Notification"("actorId");

-- CreateIndex
CREATE INDEX "Notification_entityType_entityId_idx"
ON "Notification"("entityType", "entityId");

-- AddForeignKey
ALTER TABLE "Notification"
ADD CONSTRAINT "Notification_recipientId_fkey"
FOREIGN KEY ("recipientId")
REFERENCES "User"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification"
ADD CONSTRAINT "Notification_actorId_fkey"
FOREIGN KEY ("actorId")
REFERENCES "User"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
