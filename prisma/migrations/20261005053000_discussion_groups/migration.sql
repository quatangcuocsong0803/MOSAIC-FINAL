CREATE TYPE "DiscussionGroupVisibility" AS ENUM (
  'PUBLIC',
  'PRIVATE'
);

CREATE TYPE "DiscussionGroupJoinPolicy" AS ENUM (
  'OPEN',
  'APPROVAL',
  'INVITE_ONLY'
);

CREATE TYPE "DiscussionGroupMemberRole" AS ENUM (
  'OWNER',
  'MODERATOR',
  'MEMBER'
);

CREATE TYPE "DiscussionGroupMemberStatus" AS ENUM (
  'PENDING',
  'ACTIVE',
  'BANNED'
);

CREATE TABLE "DiscussionGroup" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "rules" TEXT,
  "visibility" "DiscussionGroupVisibility" NOT NULL DEFAULT 'PUBLIC',
  "joinPolicy" "DiscussionGroupJoinPolicy" NOT NULL DEFAULT 'OPEN',
  "creatorId" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "DiscussionGroup_pkey"
  PRIMARY KEY ("id")
);

CREATE TABLE "DiscussionGroupMember" (
  "id" TEXT NOT NULL,
  "groupId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "role" "DiscussionGroupMemberRole" NOT NULL DEFAULT 'MEMBER',
  "status" "DiscussionGroupMemberStatus" NOT NULL DEFAULT 'ACTIVE',
  "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "DiscussionGroupMember_pkey"
  PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX
"DiscussionGroup_slug_key"
ON "DiscussionGroup"("slug");

CREATE INDEX
"DiscussionGroup_creatorId_createdAt_idx"
ON "DiscussionGroup"("creatorId", "createdAt");

CREATE INDEX
"DiscussionGroup_isActive_createdAt_idx"
ON "DiscussionGroup"("isActive", "createdAt");

CREATE INDEX
"DiscussionGroup_visibility_isActive_idx"
ON "DiscussionGroup"("visibility", "isActive");

CREATE UNIQUE INDEX
"DiscussionGroupMember_groupId_userId_key"
ON "DiscussionGroupMember"("groupId", "userId");

CREATE INDEX
"DiscussionGroupMember_userId_status_idx"
ON "DiscussionGroupMember"("userId", "status");

CREATE INDEX
"DiscussionGroupMember_groupId_status_role_idx"
ON "DiscussionGroupMember"(
  "groupId",
  "status",
  "role"
);

ALTER TABLE "DiscussionGroup"
ADD CONSTRAINT "DiscussionGroup_creatorId_fkey"
FOREIGN KEY ("creatorId")
REFERENCES "User"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "DiscussionGroupMember"
ADD CONSTRAINT "DiscussionGroupMember_groupId_fkey"
FOREIGN KEY ("groupId")
REFERENCES "DiscussionGroup"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "DiscussionGroupMember"
ADD CONSTRAINT "DiscussionGroupMember_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "User"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
