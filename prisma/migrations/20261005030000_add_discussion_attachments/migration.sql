-- ============================================================
-- DISCUSSION ATTACHMENTS
-- ============================================================

CREATE TYPE "AttachmentKind" AS ENUM (
    'IMAGE',
    'DOCUMENT',
    'DATASET',
    'SUPPLEMENTARY'
);

CREATE TYPE "AttachmentScanStatus" AS ENUM (
    'PENDING',
    'SCANNING',
    'CLEAN',
    'UNSAFE',
    'ERROR'
);

CREATE TYPE "AttachmentModerationStatus" AS ENUM (
    'PENDING',
    'REVIEWING',
    'APPROVED',
    'REJECTED',
    'ERROR'
);

CREATE TABLE "PostAttachment" (
    "id" TEXT NOT NULL,

    "postId" TEXT,

    "uploaderClerkId" TEXT NOT NULL,
    "uploadSessionId" TEXT NOT NULL,

    "kind" "AttachmentKind" NOT NULL,

    "originalName" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,

    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,

    "sha256" TEXT,

    "scanStatus" "AttachmentScanStatus"
        NOT NULL DEFAULT 'PENDING',

    "scanNote" TEXT,

    "moderationStatus" "AttachmentModerationStatus"
        NOT NULL DEFAULT 'PENDING',

    "moderationFindings" JSONB,
    "moderationReason" TEXT,
    "extractedTextPreview" TEXT,

    "createdAt" TIMESTAMP(3)
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    "updatedAt" TIMESTAMP(3)
        NOT NULL,

    CONSTRAINT "PostAttachment_pkey"
        PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PostAttachment_storagePath_key"
ON "PostAttachment"("storagePath");

CREATE INDEX "PostAttachment_uploadSessionId_uploaderClerkId_idx"
ON "PostAttachment"("uploadSessionId", "uploaderClerkId");

CREATE INDEX "PostAttachment_uploaderClerkId_createdAt_idx"
ON "PostAttachment"("uploaderClerkId", "createdAt");

CREATE INDEX "PostAttachment_postId_idx"
ON "PostAttachment"("postId");

CREATE INDEX "PostAttachment_scanStatus_moderationStatus_idx"
ON "PostAttachment"("scanStatus", "moderationStatus");

ALTER TABLE "PostAttachment"
ADD CONSTRAINT "PostAttachment_postId_fkey"
FOREIGN KEY ("postId")
REFERENCES "Post"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
