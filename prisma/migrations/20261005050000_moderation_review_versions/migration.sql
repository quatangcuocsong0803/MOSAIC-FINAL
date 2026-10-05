ALTER TABLE "ModerationReview"
ADD COLUMN IF NOT EXISTS "moderationVersion" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN IF NOT EXISTS "submissionSnapshot" JSONB;

CREATE INDEX IF NOT EXISTS
"ModerationReview_postId_moderationVersion_createdAt_idx"
ON "ModerationReview"(
  "postId",
  "moderationVersion",
  "createdAt"
);
