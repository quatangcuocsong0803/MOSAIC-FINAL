CREATE INDEX IF NOT EXISTS "Friendship_senderId_status_createdAt_idx" ON "Friendship"("senderId", "status", "createdAt");
CREATE INDEX IF NOT EXISTS "Friendship_receiverId_status_createdAt_idx" ON "Friendship"("receiverId", "status", "createdAt");
