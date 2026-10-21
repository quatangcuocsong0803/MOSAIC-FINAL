-- AlterTable
ALTER TABLE "User" ADD COLUMN     "coverUrl" TEXT;

-- CreateTable
CREATE TABLE "IdentityStatisticsConsent" (
    "userId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "testResultId" TEXT,
    "consentedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "version" TEXT NOT NULL DEFAULT 'identity-statistics-v1',

    CONSTRAINT "IdentityStatisticsConsent_pkey" PRIMARY KEY ("userId","kind")
);

-- CreateTable
CREATE TABLE "Moment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "visibility" "ProfileVisibility" NOT NULL DEFAULT 'PRIVATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Moment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MomentUpload" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "bytes" INTEGER NOT NULL,
    "finalized" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "momentId" TEXT,

    CONSTRAINT "MomentUpload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Moment_userId_createdAt_id_idx" ON "Moment"("userId", "createdAt", "id");

-- CreateIndex
CREATE UNIQUE INDEX "MomentUpload_path_key" ON "MomentUpload"("path");

-- CreateIndex
CREATE INDEX "MomentUpload_userId_createdAt_idx" ON "MomentUpload"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "IdentityStatisticsConsent" ADD CONSTRAINT "IdentityStatisticsConsent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Moment" ADD CONSTRAINT "Moment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MomentUpload" ADD CONSTRAINT "MomentUpload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MomentUpload" ADD CONSTRAINT "MomentUpload_momentId_fkey" FOREIGN KEY ("momentId") REFERENCES "Moment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Changing identity revokes its consent, even if changed back later.
CREATE FUNCTION revoke_changed_identity_consent() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF ROW(NEW."confirmedMbtiType",NEW."confirmedMbtiSource",NEW."confirmedMbtiTestResultId") IS DISTINCT FROM ROW(OLD."confirmedMbtiType",OLD."confirmedMbtiSource",OLD."confirmedMbtiTestResultId") THEN
 UPDATE "IdentityStatisticsConsent" SET "revokedAt"=CURRENT_TIMESTAMP WHERE "userId"=NEW.id AND kind='MBTI' AND "revokedAt" IS NULL;
 END IF;
 IF ROW(NEW."confirmedEnneagramType",NEW."confirmedEnneagramWing",NEW."confirmedEnneagramTritype",NEW."confirmedEnneagramSource",NEW."confirmedEnneagramTestResultId") IS DISTINCT FROM ROW(OLD."confirmedEnneagramType",OLD."confirmedEnneagramWing",OLD."confirmedEnneagramTritype",OLD."confirmedEnneagramSource",OLD."confirmedEnneagramTestResultId") THEN
 UPDATE "IdentityStatisticsConsent" SET "revokedAt"=CURRENT_TIMESTAMP WHERE "userId"=NEW.id AND kind='ENNEAGRAM' AND "revokedAt" IS NULL;
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER revoke_identity_consent AFTER UPDATE ON "User" FOR EACH ROW EXECUTE FUNCTION revoke_changed_identity_consent();
