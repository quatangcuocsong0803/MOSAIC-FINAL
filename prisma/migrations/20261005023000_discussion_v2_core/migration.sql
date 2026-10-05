-- ============================================================
-- DISCUSSION V2
-- ============================================================

-- ------------------------------------------------------------
-- Enums
-- ------------------------------------------------------------

CREATE TYPE "PostKind" AS ENUM (
    'EMPIRICAL_EVIDENCE',
    'ESTABLISHED_THEORY',
    'INTERPRETATION',
    'QUESTION'
);

CREATE TYPE "ModerationStatus" AS ENUM (
    'DRAFT',
    'REVIEWING',
    'APPROVED',
    'REVISION_REQUIRED',
    'REJECTED'
);

CREATE TYPE "CitationSourceType" AS ENUM (
    'PEER_REVIEWED',
    'ACADEMIC_BOOK',
    'PRIMARY_THEORY',
    'PROFESSIONAL_ORGANIZATION',
    'SECONDARY_REFERENCE',
    'COMMUNITY_SOURCE',
    'UNKNOWN'
);

CREATE TYPE "CitationVerificationStatus" AS ENUM (
    'PENDING',
    'VERIFIED',
    'UNREACHABLE',
    'INVALID'
);

CREATE TYPE "ModerationDecision" AS ENUM (
    'APPROVE',
    'REVISION_REQUIRED',
    'REJECT'
);

-- ------------------------------------------------------------
-- Upgrade Post
-- ------------------------------------------------------------

ALTER TABLE "Post"
ADD COLUMN "postKind" "PostKind"
NOT NULL DEFAULT 'INTERPRETATION';

ALTER TABLE "Post"
ADD COLUMN "moderationStatus" "ModerationStatus"
NOT NULL DEFAULT 'DRAFT';

ALTER TABLE "Post"
ADD COLUMN "moderationScore" DOUBLE PRECISION;

ALTER TABLE "Post"
ADD COLUMN "moderationVersion" INTEGER
NOT NULL DEFAULT 1;

ALTER TABLE "Post"
ADD COLUMN "publishedAt" TIMESTAMP(3);

-- ------------------------------------------------------------
-- Backfill legacy posts
--
-- version = 0 means:
-- bài tồn tại trước Discussion V2 / automated moderation.
-- ------------------------------------------------------------

UPDATE "Post"
SET
    "moderationStatus" = 'APPROVED',
    "moderationVersion" = 0,
    "publishedAt" = "createdAt";

-- ------------------------------------------------------------
-- Citation
-- ------------------------------------------------------------

CREATE TABLE "Citation" (
    "id" TEXT NOT NULL,

    "postId" TEXT NOT NULL,

    "title" TEXT NOT NULL,
    "authors" TEXT,
    "year" INTEGER,
    "publisher" TEXT,

    "url" TEXT,
    "doi" TEXT,

    "sourceType" "CitationSourceType"
        NOT NULL DEFAULT 'UNKNOWN',

    "verificationStatus" "CitationVerificationStatus"
        NOT NULL DEFAULT 'PENDING',

    "verificationNote" TEXT,

    "sortOrder" INTEGER
        NOT NULL DEFAULT 0,

    "createdAt" TIMESTAMP(3)
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    "updatedAt" TIMESTAMP(3)
        NOT NULL,

    CONSTRAINT "Citation_pkey"
        PRIMARY KEY ("id")
);

-- ------------------------------------------------------------
-- ModerationReview
-- ------------------------------------------------------------

CREATE TABLE "ModerationReview" (
    "id" TEXT NOT NULL,

    "postId" TEXT NOT NULL,

    "decision" "ModerationDecision"
        NOT NULL,

    "relevanceScore" DOUBLE PRECISION,
    "citationScore" DOUBLE PRECISION,
    "evidenceScore" DOUBLE PRECISION,
    "civilityScore" DOUBLE PRECISION,
    "confidence" DOUBLE PRECISION,

    "findings" JSONB NOT NULL,

    "modelName" TEXT,
    "promptVersion" TEXT NOT NULL,
    "policyVersion" TEXT NOT NULL,

    "createdAt" TIMESTAMP(3)
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModerationReview_pkey"
        PRIMARY KEY ("id")
);

-- ------------------------------------------------------------
-- Indexes
-- ------------------------------------------------------------

CREATE INDEX "Post_moderationStatus_createdAt_idx"
ON "Post"("moderationStatus", "createdAt");

CREATE INDEX "Post_postKind_createdAt_idx"
ON "Post"("postKind", "createdAt");

CREATE INDEX "Post_publishedAt_idx"
ON "Post"("publishedAt");

CREATE INDEX "Citation_postId_sortOrder_idx"
ON "Citation"("postId", "sortOrder");

CREATE INDEX "Citation_sourceType_idx"
ON "Citation"("sourceType");

CREATE INDEX "Citation_verificationStatus_idx"
ON "Citation"("verificationStatus");

CREATE INDEX "ModerationReview_postId_createdAt_idx"
ON "ModerationReview"("postId", "createdAt");

CREATE INDEX "ModerationReview_decision_createdAt_idx"
ON "ModerationReview"("decision", "createdAt");

-- ------------------------------------------------------------
-- Foreign keys
-- ------------------------------------------------------------

ALTER TABLE "Citation"
ADD CONSTRAINT "Citation_postId_fkey"
FOREIGN KEY ("postId")
REFERENCES "Post"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "ModerationReview"
ADD CONSTRAINT "ModerationReview_postId_fkey"
FOREIGN KEY ("postId")
REFERENCES "Post"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
