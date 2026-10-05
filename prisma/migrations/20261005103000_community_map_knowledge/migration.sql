CREATE TABLE "CommunityMapShare" ("clerkId" TEXT NOT NULL, "countryCode" TEXT NOT NULL, "mbti" TEXT, "enneagram" TEXT, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "CommunityMapShare_pkey" PRIMARY KEY ("clerkId"));
CREATE INDEX "CommunityMapShare_countryCode_idx" ON "CommunityMapShare"("countryCode");
CREATE TABLE "KnowledgeSearchDaily" ("clerkId" TEXT NOT NULL, "href" TEXT NOT NULL, "day" TEXT NOT NULL, CONSTRAINT "KnowledgeSearchDaily_pkey" PRIMARY KEY ("clerkId", "href", "day"));
CREATE INDEX "KnowledgeSearchDaily_href_idx" ON "KnowledgeSearchDaily"("href");
