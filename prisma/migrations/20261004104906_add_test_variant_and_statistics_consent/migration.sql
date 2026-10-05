-- AlterTable
ALTER TABLE "TestResult" ADD COLUMN     "statisticsConsent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "statisticsConsentRevokedAt" TIMESTAMP(3),
ADD COLUMN     "statisticsConsentVersion" TEXT,
ADD COLUMN     "statisticsConsentedAt" TIMESTAMP(3),
ADD COLUMN     "testVariant" TEXT;

-- CreateIndex
CREATE INDEX "TestResult_testType_idx" ON "TestResult"("testType");

-- CreateIndex
CREATE INDEX "TestResult_testType_statisticsConsent_idx" ON "TestResult"("testType", "statisticsConsent");

-- CreateIndex
CREATE INDEX "TestResult_userId_createdAt_idx" ON "TestResult"("userId", "createdAt");
