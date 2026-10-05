-- ============================================================
-- SYSTEM FORUMS
-- ============================================================

CREATE TYPE "ForumModerationPolicy" AS ENUM (
    'STANDARD',
    'STRICT_RESEARCH',
    'META_LIGHT'
);

CREATE TABLE "Forum" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortLabel" TEXT,
    "moderationPolicy" "ForumModerationPolicy" NOT NULL DEFAULT 'STANDARD',
    "isSystem" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Forum_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Forum_slug_key"
ON "Forum"("slug");

CREATE INDEX "Forum_isActive_displayOrder_idx"
ON "Forum"("isActive", "displayOrder");

CREATE INDEX "Forum_moderationPolicy_idx"
ON "Forum"("moderationPolicy");

ALTER TABLE "Post"
ADD COLUMN "forumId" TEXT;

CREATE INDEX "Post_forumId_publishedAt_idx"
ON "Post"("forumId", "publishedAt");

ALTER TABLE "Post"
ADD CONSTRAINT "Post_forumId_fkey"
FOREIGN KEY ("forumId")
REFERENCES "Forum"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- ============================================================
-- Seed MOSAIC system forums
-- ============================================================

INSERT INTO "Forum" (
    "id",
    "slug",
    "name",
    "description",
    "shortLabel",
    "moderationPolicy",
    "isSystem",
    "isActive",
    "displayOrder",
    "createdAt",
    "updatedAt"
)
VALUES

(
    'forum_cognitive_functions',
    'cognitive-functions',
    'Cognitive Functions',
    'Phân tích và thảo luận về các cognitive functions, Jungian processes và các cách diễn giải hậu Jung.',
    'Functions',
    'STANDARD',
    true,
    true,
    10,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),

(
    'forum_mbti_theory',
    'mbti-theory',
    'MBTI Theory',
    'Thảo luận về MBTI, type dynamics, dichotomies, function stacks và các mô hình lý thuyết liên quan.',
    'MBTI',
    'STANDARD',
    true,
    true,
    20,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),

(
    'forum_enneagram',
    'enneagram',
    'Enneagram',
    'Thảo luận về Enneagram types, wings, instincts, tritype và các trường phái diễn giải.',
    'Enneagram',
    'STANDARD',
    true,
    true,
    30,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),

(
    'forum_psychometrics',
    'psychometrics-testing',
    'Psychometrics & Testing',
    'Thảo luận về thiết kế bài test, reliability, validity, scoring, measurement và phương pháp đánh giá personality.',
    'Methods',
    'STRICT_RESEARCH',
    true,
    true,
    40,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),

(
    'forum_typology_research',
    'typology-research',
    'Typology Research',
    'Không gian dành cho nghiên cứu, paper, dữ liệu thực nghiệm và đánh giá evidence liên quan đến typology và personality measurement.',
    'Research',
    'STRICT_RESEARCH',
    true,
    true,
    50,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),

(
    'forum_cross_system',
    'cross-system-analysis',
    'Cross-System Analysis',
    'So sánh và phân tích mối quan hệ giữa MBTI, cognitive functions, Enneagram, Big Five và các hệ thống khác.',
    'Cross-system',
    'STANDARD',
    true,
    true,
    60,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),

(
    'forum_case_analysis',
    'case-analysis',
    'Case Analysis',
    'Phân tích case, hành vi, profile hoặc nhân vật dưới góc nhìn typology với lập luận và nguồn dẫn rõ ràng.',
    'Cases',
    'STANDARD',
    true,
    true,
    70,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),

(
    'forum_meta',
    'meta',
    'Meta / Platform Discussion',
    'Thảo luận về MOSAIC, quy chuẩn cộng đồng, moderation, tính năng và cách tổ chức nền tảng.',
    'Meta',
    'META_LIGHT',
    true,
    true,
    80,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
