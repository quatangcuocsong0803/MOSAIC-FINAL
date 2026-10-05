CREATE TABLE "DiscussionDraft" (
    "id" TEXT NOT NULL,
    "ownerClerkId" TEXT NOT NULL,
    "uploadSessionId" TEXT NOT NULL,

    "forumId" TEXT,
    "groupId" TEXT,

    "postKind" "PostKind" NOT NULL DEFAULT 'INTERPRETATION',

    "title" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "personalityTag" TEXT NOT NULL DEFAULT 'Chung',

    "citationDrafts" JSONB NOT NULL DEFAULT '[]',
    "attachmentIds" JSONB NOT NULL DEFAULT '[]',

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiscussionDraft_pkey"
        PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX
"DiscussionDraft_ownerClerkId_uploadSessionId_key"
ON "DiscussionDraft"(
    "ownerClerkId",
    "uploadSessionId"
);

CREATE INDEX
"DiscussionDraft_ownerClerkId_updatedAt_idx"
ON "DiscussionDraft"(
    "ownerClerkId",
    "updatedAt"
);

CREATE INDEX
"DiscussionDraft_groupId_updatedAt_idx"
ON "DiscussionDraft"(
    "groupId",
    "updatedAt"
);
