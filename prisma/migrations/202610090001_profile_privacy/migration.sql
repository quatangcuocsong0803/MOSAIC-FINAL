-- CreateEnum
CREATE TYPE "ProfileVisibility" AS ENUM ('PUBLIC', 'FRIENDS', 'PRIVATE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrlVisibility" "ProfileVisibility" NOT NULL DEFAULT 'PUBLIC',
ADD COLUMN     "bioVisibility" "ProfileVisibility" NOT NULL DEFAULT 'PUBLIC',
ADD COLUMN     "dateOfBirthVisibility" "ProfileVisibility" NOT NULL DEFAULT 'PRIVATE',
ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "displayNameVisibility" "ProfileVisibility" NOT NULL DEFAULT 'PUBLIC',
ADD COLUMN     "hobbiesVisibility" "ProfileVisibility" NOT NULL DEFAULT 'PUBLIC',
ADD COLUMN     "interestCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "locationVisibility" "ProfileVisibility" NOT NULL DEFAULT 'PRIVATE',
ADD COLUMN     "onboardingCompletedAt" TIMESTAMP(3),
ADD COLUMN     "onboardingStep" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usernameVisibility" "ProfileVisibility" NOT NULL DEFAULT 'PUBLIC';

-- Preserve existing accounts and do not force them through the new onboarding.
UPDATE "User" SET "displayName" = "username", "onboardingCompletedAt" = CURRENT_TIMESTAMP, "onboardingStep" = 8;
-- Keep the oldest spelling on case-insensitive username collisions.
WITH duplicates AS (SELECT id, row_number() OVER (PARTITION BY lower(username) ORDER BY "createdAt", id) AS position FROM "User" WHERE username IS NOT NULL)
UPDATE "User" u SET username = 'legacy_' || u.id FROM duplicates d WHERE u.id = d.id AND d.position > 1;
CREATE UNIQUE INDEX "User_username_lower_key" ON "User" (lower(username)) WHERE username IS NOT NULL;
