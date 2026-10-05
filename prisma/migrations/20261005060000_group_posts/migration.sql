ALTER TABLE "Post"
ADD COLUMN IF NOT EXISTS "groupId" TEXT;

CREATE INDEX IF NOT EXISTS
"Post_groupId_moderationStatus_publishedAt_idx"
ON "Post"(
  "groupId",
  "moderationStatus",
  "publishedAt"
);

ALTER TABLE "Post"
ADD CONSTRAINT "Post_groupId_fkey"
FOREIGN KEY ("groupId")
REFERENCES "DiscussionGroup"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
