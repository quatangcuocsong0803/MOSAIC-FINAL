CREATE TABLE "UserBlock" (
    "id" TEXT NOT NULL,
    "blockerId" TEXT NOT NULL,
    "blockedId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBlock_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserBlock_blockerId_blockedId_key"
ON "UserBlock"("blockerId", "blockedId");

CREATE INDEX "UserBlock_blockerId_createdAt_idx"
ON "UserBlock"("blockerId", "createdAt");

CREATE INDEX "UserBlock_blockedId_createdAt_idx"
ON "UserBlock"("blockedId", "createdAt");

ALTER TABLE "UserBlock"
ADD CONSTRAINT "UserBlock_blockerId_fkey"
FOREIGN KEY ("blockerId")
REFERENCES "User"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "UserBlock"
ADD CONSTRAINT "UserBlock_blockedId_fkey"
FOREIGN KEY ("blockedId")
REFERENCES "User"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
