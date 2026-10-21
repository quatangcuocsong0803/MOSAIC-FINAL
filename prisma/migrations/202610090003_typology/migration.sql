ALTER TABLE "User" ADD COLUMN "socionicsType" TEXT,
ADD COLUMN "attitudinalPsyche" TEXT,
ADD COLUMN "instinctStack" TEXT,
ADD COLUMN "moralAlignment" TEXT,
ADD COLUMN "temperament" TEXT,
ADD COLUMN "sloanType" TEXT;
CREATE INDEX "User_interestCodes_idx" ON "User" USING GIN ("interestCodes");
