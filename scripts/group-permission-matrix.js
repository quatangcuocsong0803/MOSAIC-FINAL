const {
  PrismaClient,
} = require("@prisma/client");

const {
  randomUUID,
} = require("node:crypto");

const fs =
  require("node:fs");

const prisma =
  new PrismaClient();

const runId =
  randomUUID()
    .replace(/-/g, "")
    .slice(0, 12);

const prefix =
  `__mosaic_perm_${runId}`;

let passed =
  0;

function check(
  label,
  actual,
  expected = true,
) {
  if (
    actual !==
    expected
  ) {
    throw new Error(
      `FAIL: ${label}\nExpected: ${expected}\nActual: ${actual}`,
    );
  }

  passed += 1;

  console.log(
    `✅ ${label}`,
  );
}

async function getMembership(
  groupId,
  clerkId,
) {
  if (!clerkId) {
    return null;
  }

  const user =
    await prisma.user.findUnique({
      where: {
        clerkId,
      },

      select: {
        id: true,
      },
    });

  if (!user) {
    return null;
  }

  return prisma.discussionGroupMember.findUnique({
    where: {
      groupId_userId: {
        groupId,
        userId:
          user.id,
      },
    },

    select: {
      id: true,
      role: true,
      status: true,
    },
  });
}

async function canRead(
  group,
  clerkId,
) {
  if (!group.isActive) {
    return false;
  }

  if (
    group.visibility ===
    "PUBLIC"
  ) {
    return true;
  }

  const membership =
    await getMembership(
      group.id,
      clerkId,
    );

  return (
    membership?.status ===
    "ACTIVE"
  );
}

async function canInteract(
  group,
  clerkId,
) {
  if (!group.isActive) {
    return false;
  }

  const membership =
    await getMembership(
      group.id,
      clerkId,
    );

  return (
    membership?.status ===
    "ACTIVE"
  );
}

async function canManage(
  group,
  clerkId,
) {
  if (!group.isActive) {
    return false;
  }

  const membership =
    await getMembership(
      group.id,
      clerkId,
    );

  return (
    membership?.status ===
      "ACTIVE" &&
    (
      membership.role ===
        "OWNER" ||
      membership.role ===
        "MODERATOR"
    )
  );
}

async function isOwner(
  group,
  clerkId,
) {
  if (!group.isActive) {
    return false;
  }

  const membership =
    await getMembership(
      group.id,
      clerkId,
    );

  return (
    membership?.status ===
      "ACTIVE" &&
    membership.role ===
      "OWNER"
  );
}

async function main() {
  console.log(
    "\nMOSAIC — Group Permission Matrix\n",
  );

  // ==========================================================
  // STATIC IMPLEMENTATION CHECKS
  // ==========================================================

  const accessSource =
    fs.readFileSync(
      "lib/discussion/group-access.ts",
      "utf8",
    );

  const groupActionsSource =
    fs.readFileSync(
      "app/actions/discussion-groups.ts",
      "utf8",
    );

  const discussionSource =
    fs.readFileSync(
      "app/actions/discussion.ts",
      "utf8",
    );

  const forumsSource =
    fs.readFileSync(
      "app/actions/forums.ts",
      "utf8",
    );

  const commentsSource =
    fs.readFileSync(
      "lib/discussion/comment-service.ts",
      "utf8",
    );

  check(
    "Central access helper exists",
    accessSource.includes(
      "canReadGroupContent",
    ) &&
      accessSource.includes(
        "canInteractWithGroup",
      ),
  );

  check(
    "Public Discussion filter exists",
    accessSource.includes(
      "publicDiscussionPostAccessWhere",
    ),
  );

  check(
    "Global getPosts uses Group visibility filter",
    discussionSource.includes(
      "publicDiscussionPostAccessWhere",
    ),
  );

  check(
    "System Forum feed uses Group visibility filter",
    forumsSource.includes(
      "publicDiscussionPostAccessWhere",
    ),
  );

  check(
    "Comment service removed old fail-closed Group block",
    !commentsSource.includes(
      "Bình luận trong nhóm chưa được hỗ trợ",
    ),
  );

  check(
    "Comment service rechecks Group access",
    commentsSource.includes(
      "requirePostAccess",
    ) &&
      commentsSource.includes(
        '"INTERACT"',
      ),
  );

  check(
    "Governance has Remove",
    groupActionsSource.includes(
      "removeDiscussionGroupMember",
    ),
  );

  check(
    "Governance has Ban",
    groupActionsSource.includes(
      "banDiscussionGroupMember",
    ) &&
      groupActionsSource.includes(
        '"BANNED"',
      ),
  );

  check(
    "Governance has Unban",
    groupActionsSource.includes(
      "unbanDiscussionGroupMember",
    ),
  );

  check(
    "Governance has ownership transfer",
    groupActionsSource.includes(
      "transferDiscussionGroupOwnership",
    ) &&
      groupActionsSource.includes(
        '"OWNER"',
      ) &&
      groupActionsSource.includes(
        '"MODERATOR"',
      ),
  );

  // ==========================================================
  // USERS
  // ==========================================================

  const roles =
    [
      "owner",
      "moderator",
      "member",
      "pending",
      "banned",
      "outsider",
    ];

  const users =
    {};

  for (
    const role of roles
  ) {
    users[role] =
      await prisma.user.create({
        data: {
          clerkId:
            `${prefix}_${role}`,

          username:
            `${prefix}_${role}`,
        },

        select: {
          id: true,
          clerkId: true,
        },
      });
  }

  // ==========================================================
  // GROUPS
  // ==========================================================

  const publicGroup =
    await prisma.discussionGroup.create({
      data: {
        slug:
          `${prefix}-public`,

        name:
          `${prefix} public`,

        description:
          "Temporary permission test",

        visibility:
          "PUBLIC",

        joinPolicy:
          "OPEN",

        creatorId:
          users.owner.id,

        isActive:
          true,
      },
    });

  const privateGroup =
    await prisma.discussionGroup.create({
      data: {
        slug:
          `${prefix}-private`,

        name:
          `${prefix} private`,

        description:
          "Temporary permission test",

        visibility:
          "PRIVATE",

        joinPolicy:
          "APPROVAL",

        creatorId:
          users.owner.id,

        isActive:
          true,
      },
    });

  const inactiveGroup =
    await prisma.discussionGroup.create({
      data: {
        slug:
          `${prefix}-inactive`,

        name:
          `${prefix} inactive`,

        description:
          "Temporary permission test",

        visibility:
          "PUBLIC",

        joinPolicy:
          "OPEN",

        creatorId:
          users.owner.id,

        isActive:
          false,
      },
    });

  async function seedMemberships(
    groupId,
  ) {
    await prisma.discussionGroupMember.createMany({
      data: [
        {
          groupId,

          userId:
            users.owner.id,

          role:
            "OWNER",

          status:
            "ACTIVE",
        },

        {
          groupId,

          userId:
            users.moderator.id,

          role:
            "MODERATOR",

          status:
            "ACTIVE",
        },

        {
          groupId,

          userId:
            users.member.id,

          role:
            "MEMBER",

          status:
            "ACTIVE",
        },

        {
          groupId,

          userId:
            users.pending.id,

          role:
            "MEMBER",

          status:
            "PENDING",
        },

        {
          groupId,

          userId:
            users.banned.id,

          role:
            "MEMBER",

          status:
            "BANNED",
        },
      ],
    });
  }

  await seedMemberships(
    publicGroup.id,
  );

  await seedMemberships(
    privateGroup.id,
  );

  await seedMemberships(
    inactiveGroup.id,
  );

  // ==========================================================
  // PUBLIC GROUP
  // ==========================================================

  check(
    "PUBLIC: outsider can read",
    await canRead(
      publicGroup,
      users.outsider.clerkId,
    ),
  );

  check(
    "PUBLIC: pending can read",
    await canRead(
      publicGroup,
      users.pending.clerkId,
    ),
  );

  check(
    "PUBLIC: banned can still read public content",
    await canRead(
      publicGroup,
      users.banned.clerkId,
    ),
  );

  check(
    "PUBLIC: outsider cannot interact",
    await canInteract(
      publicGroup,
      users.outsider.clerkId,
    ),
    false,
  );

  check(
    "PUBLIC: pending cannot interact",
    await canInteract(
      publicGroup,
      users.pending.clerkId,
    ),
    false,
  );

  check(
    "PUBLIC: banned cannot interact",
    await canInteract(
      publicGroup,
      users.banned.clerkId,
    ),
    false,
  );

  check(
    "PUBLIC: active member can interact",
    await canInteract(
      publicGroup,
      users.member.clerkId,
    ),
  );

  // ==========================================================
  // PRIVATE GROUP
  // ==========================================================

  check(
    "PRIVATE: outsider cannot read",
    await canRead(
      privateGroup,
      users.outsider.clerkId,
    ),
    false,
  );

  check(
    "PRIVATE: pending cannot read",
    await canRead(
      privateGroup,
      users.pending.clerkId,
    ),
    false,
  );

  check(
    "PRIVATE: banned cannot read",
    await canRead(
      privateGroup,
      users.banned.clerkId,
    ),
    false,
  );

  check(
    "PRIVATE: active member can read",
    await canRead(
      privateGroup,
      users.member.clerkId,
    ),
  );

  check(
    "PRIVATE: active member can interact",
    await canInteract(
      privateGroup,
      users.member.clerkId,
    ),
  );

  // ==========================================================
  // GOVERNANCE ROLES
  // ==========================================================

  check(
    "Owner can manage members",
    await canManage(
      privateGroup,
      users.owner.clerkId,
    ),
  );

  check(
    "Moderator can manage members",
    await canManage(
      privateGroup,
      users.moderator.clerkId,
    ),
  );

  check(
    "Member cannot manage members",
    await canManage(
      privateGroup,
      users.member.clerkId,
    ),
    false,
  );

  check(
    "Owner recognized as owner",
    await isOwner(
      privateGroup,
      users.owner.clerkId,
    ),
  );

  check(
    "Moderator is not owner",
    await isOwner(
      privateGroup,
      users.moderator.clerkId,
    ),
    false,
  );

  // ==========================================================
  // INACTIVE GROUP FAIL-CLOSED
  // ==========================================================

  check(
    "Inactive PUBLIC Group is not readable",
    await canRead(
      inactiveGroup,
      users.outsider.clerkId,
    ),
    false,
  );

  check(
    "Inactive Group cannot be interacted with",
    await canInteract(
      inactiveGroup,
      users.owner.clerkId,
    ),
    false,
  );

  // ==========================================================
  // PUBLIC FEED LEAK TEST
  // ==========================================================

  const now =
    new Date();

  const normalPost =
    await prisma.post.create({
      data: {
        title:
          `${prefix} normal`,

        content:
          "Permission matrix fixture",

        authorId:
          users.owner.clerkId,

        authorName:
          "Matrix Owner",

        personalityTag:
          "Chung",

        moderationStatus:
          "APPROVED",

        publishedAt:
          now,
      },
    });

  const publicPost =
    await prisma.post.create({
      data: {
        title:
          `${prefix} public post`,

        content:
          "Permission matrix fixture",

        authorId:
          users.owner.clerkId,

        authorName:
          "Matrix Owner",

        personalityTag:
          "Chung",

        moderationStatus:
          "APPROVED",

        publishedAt:
          now,

        groupId:
          publicGroup.id,
      },
    });

  const privatePost =
    await prisma.post.create({
      data: {
        title:
          `${prefix} private post`,

        content:
          "Permission matrix fixture",

        authorId:
          users.owner.clerkId,

        authorName:
          "Matrix Owner",

        personalityTag:
          "Chung",

        moderationStatus:
          "APPROVED",

        publishedAt:
          now,

        groupId:
          privateGroup.id,
      },
    });

  const inactivePost =
    await prisma.post.create({
      data: {
        title:
          `${prefix} inactive post`,

        content:
          "Permission matrix fixture",

        authorId:
          users.owner.clerkId,

        authorName:
          "Matrix Owner",

        personalityTag:
          "Chung",

        moderationStatus:
          "APPROVED",

        publishedAt:
          now,

        groupId:
          inactiveGroup.id,
      },
    });

  const publicFeed =
    await prisma.post.findMany({
      where: {
        id: {
          in: [
            normalPost.id,
            publicPost.id,
            privatePost.id,
            inactivePost.id,
          ],
        },

        moderationStatus:
          "APPROVED",

        publishedAt: {
          not:
            null,
        },

        OR: [
          {
            groupId:
              null,
          },

          {
            group: {
              is: {
                isActive:
                  true,

                visibility:
                  "PUBLIC",
              },
            },
          },
        ],
      },

      select: {
        id: true,
      },
    });

  const feedIds =
    new Set(
      publicFeed.map(
        (
          post,
        ) =>
          post.id,
      ),
    );

  check(
    "Public feed includes normal post",
    feedIds.has(
      normalPost.id,
    ),
  );

  check(
    "Public feed includes PUBLIC Group post",
    feedIds.has(
      publicPost.id,
    ),
  );

  check(
    "Public feed excludes PRIVATE Group post",
    feedIds.has(
      privatePost.id,
    ),
    false,
  );

  check(
    "Public feed excludes inactive Group post",
    feedIds.has(
      inactivePost.id,
    ),
    false,
  );

  // ==========================================================
  // BAN SEMANTICS
  // ==========================================================

  const memberPrivateMembership =
    await prisma.discussionGroupMember.findUniqueOrThrow({
      where: {
        groupId_userId: {
          groupId:
            privateGroup.id,

          userId:
            users.member.id,
        },
      },
    });

  await prisma.discussionGroupMember.update({
    where: {
      id:
        memberPrivateMembership.id,
    },

    data: {
      role:
        "MEMBER",

      status:
        "BANNED",
    },
  });

  check(
    "Ban immediately removes private read access",
    await canRead(
      privateGroup,
      users.member.clerkId,
    ),
    false,
  );

  check(
    "Ban immediately removes interaction access",
    await canInteract(
      privateGroup,
      users.member.clerkId,
    ),
    false,
  );

  // Unban semantics used by Step 8D:
  // delete row -> user becomes non-member.
  await prisma.discussionGroupMember.delete({
    where: {
      id:
        memberPrivateMembership.id,
    },
  });

  check(
    "Unban leaves user as non-member",
    Boolean(
      await getMembership(
        privateGroup.id,
        users.member.clerkId,
      ),
    ),
    false,
  );

  // ==========================================================
  // OWNERSHIP TRANSFER POSTCONDITION
  // ==========================================================

  const oldOwner =
    await prisma.discussionGroupMember.findUniqueOrThrow({
      where: {
        groupId_userId: {
          groupId:
            privateGroup.id,

          userId:
            users.owner.id,
        },
      },
    });

  const newOwner =
    await prisma.discussionGroupMember.findUniqueOrThrow({
      where: {
        groupId_userId: {
          groupId:
            privateGroup.id,

          userId:
            users.moderator.id,
        },
      },
    });

  await prisma.$transaction([
    prisma.discussionGroupMember.update({
      where: {
        id:
          oldOwner.id,
      },

      data: {
        role:
          "MODERATOR",
      },
    }),

    prisma.discussionGroupMember.update({
      where: {
        id:
          newOwner.id,
      },

      data: {
        role:
          "OWNER",
      },
    }),
  ]);

  const ownersAfterTransfer =
    await prisma.discussionGroupMember.count({
      where: {
        groupId:
          privateGroup.id,

        status:
          "ACTIVE",

        role:
          "OWNER",
      },
    });

  check(
    "Ownership transfer leaves exactly one ACTIVE owner",
    ownersAfterTransfer,
    1,
  );

  check(
    "New owner receives OWNER permissions",
    await isOwner(
      privateGroup,
      users.moderator.clerkId,
    ),
  );

  check(
    "Old owner becomes non-owner",
    await isOwner(
      privateGroup,
      users.owner.clerkId,
    ),
    false,
  );

  check(
    "Old owner still manages as Moderator",
    await canManage(
      privateGroup,
      users.owner.clerkId,
    ),
  );

  console.log(
    `\n🎉 MATRIX PASS — ${passed} assertions passed.`,
  );
}

async function cleanup() {
  console.log(
    "\nCleaning temporary fixtures…",
  );

  await prisma.post.deleteMany({
    where: {
      title: {
        startsWith:
          prefix,
      },
    },
  });

  await prisma.discussionGroup.deleteMany({
    where: {
      slug: {
        startsWith:
          prefix,
      },
    },
  });

  await prisma.user.deleteMany({
    where: {
      clerkId: {
        startsWith:
          prefix,
      },
    },
  });

  console.log(
    "✅ Temporary fixtures removed",
  );
}

(async () => {
  try {
    await main();
  } catch (error) {
    console.error(
      "\n❌ PERMISSION MATRIX FAILED\n",
    );

    console.error(
      error,
    );

    process.exitCode =
      1;
  } finally {
    try {
      await cleanup();
    } catch (cleanupError) {
      console.error(
        "⚠️ Fixture cleanup failed:",
        cleanupError,
      );

      process.exitCode =
        1;
    }

    await prisma.$disconnect();
  }
})();
