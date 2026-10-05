BEGIN;
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "moderationReasons" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "moderationStatus" "ModerationStatus" NOT NULL DEFAULT 'REVIEWING',
ADD COLUMN     "moderationVersion" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "reviewError" TEXT,
ADD COLUMN     "reviewQueuedAt" TIMESTAMP(3),
ADD COLUMN     "reviewStartedAt" TIMESTAMP(3),
ADD COLUMN     "reviewToken" TEXT,
ADD COLUMN     "submissionKey" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "CommentModerationReview" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "moderationVersion" INTEGER NOT NULL,
    "decision" "ModerationStatus" NOT NULL,
    "submissionSnapshot" JSONB NOT NULL,
    "findings" JSONB NOT NULL,
    "modelName" TEXT NOT NULL,
    "promptVersion" TEXT NOT NULL,
    "policyVersion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentModerationReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommentModerationReview_commentId_createdAt_idx" ON "CommentModerationReview"("commentId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CommentModerationReview_commentId_moderationVersion_key" ON "CommentModerationReview"("commentId", "moderationVersion");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_submissionKey_key" ON "Comment"("submissionKey");

-- CreateIndex
CREATE INDEX "Comment_postId_moderationStatus_createdAt_idx" ON "Comment"("postId", "moderationStatus", "createdAt");

-- CreateIndex
CREATE INDEX "Comment_parentId_moderationStatus_createdAt_idx" ON "Comment"("parentId", "moderationStatus", "createdAt");

-- CreateIndex
CREATE INDEX "Comment_authorId_moderationStatus_createdAt_idx" ON "Comment"("authorId", "moderationStatus", "createdAt");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentModerationReview" ADD CONSTRAINT "CommentModerationReview_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Preserve comments already public before Step 6. Version 0 marks legacy;
-- no fabricated AI review is inserted.
UPDATE "Comment" SET "moderationStatus" = 'APPROVED', "moderationVersion" = 0,
  "publishedAt" = "createdAt", "updatedAt" = "createdAt";
COMMIT;
