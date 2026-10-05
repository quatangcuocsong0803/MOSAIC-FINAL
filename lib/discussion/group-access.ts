import "server-only";

import {
  Prisma,
} from "@prisma/client";

type GroupAccessDb =
  Pick<
    Prisma.TransactionClient,
    | "user"
    | "discussionGroupMember"
  >;

export type GroupForAccess = {
  id: string;

  isActive: boolean;

  visibility:
    | "PUBLIC"
    | "PRIVATE";
};

export type ActiveGroupMembership = {
  id: string;

  role:
    | "OWNER"
    | "MODERATOR"
    | "MEMBER";

  status:
    "ACTIVE";
};

// ============================================================
// PUBLIC DISCUSSION VISIBILITY
//
// Global Discussion / homepage / System Forum feed:
//
// - ordinary posts: visible
// - PUBLIC Group posts: visible
// - PRIVATE Group posts: never leaked into public feed
//
// Private Group posts are read from their Group context instead.
// ============================================================

export const publicDiscussionPostAccessWhere =
  {
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
  } satisfies Prisma.PostWhereInput;

// ============================================================
// MEMBERSHIP
// ============================================================

export async function getActiveGroupMembership(
  db: GroupAccessDb,
  groupId: string,
  clerkId:
    string |
    null |
    undefined,
): Promise<
  ActiveGroupMembership |
  null
> {
  if (!clerkId) {
    return null;
  }

  const user =
    await db.user.findUnique({
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

  const membership =
    await db.discussionGroupMember.findUnique({
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

  if (
    !membership ||
    membership.status !==
      "ACTIVE"
  ) {
    return null;
  }

  return {
    id:
      membership.id,

    role:
      membership.role,

    status:
      "ACTIVE",
  };
}

// ============================================================
// READ
// ============================================================

export async function canReadGroupContent(
  db: GroupAccessDb,
  group: GroupForAccess,
  clerkId:
    string |
    null |
    undefined,
) {
  if (!group.isActive) {
    return false;
  }

  // Public Group:
  // approved content is readable by everyone.
  if (
    group.visibility ===
    "PUBLIC"
  ) {
    return true;
  }

  // Private Group:
  // only ACTIVE members.
  const membership =
    await getActiveGroupMembership(
      db,
      group.id,
      clerkId,
    );

  return Boolean(
    membership,
  );
}

// ============================================================
// INTERACT
//
// Posting/commenting/replying in a Group requires membership,
// regardless of PUBLIC / PRIVATE visibility.
// ============================================================

export async function canInteractWithGroup(
  db: GroupAccessDb,
  group: GroupForAccess,
  clerkId:
    string |
    null |
    undefined,
) {
  if (!group.isActive) {
    return false;
  }

  const membership =
    await getActiveGroupMembership(
      db,
      group.id,
      clerkId,
    );

  return Boolean(
    membership,
  );
}

// ============================================================
// MANAGE MEMBERS
// ============================================================

export async function canManageGroupMembers(
  db: GroupAccessDb,
  group: GroupForAccess,
  clerkId:
    string |
    null |
    undefined,
) {
  if (!group.isActive) {
    return false;
  }

  const membership =
    await getActiveGroupMembership(
      db,
      group.id,
      clerkId,
    );

  return (
    membership?.role ===
      "OWNER" ||
    membership?.role ===
      "MODERATOR"
  );
}

// ============================================================
// OWNER-ONLY GOVERNANCE
// ============================================================

export async function isGroupOwner(
  db: GroupAccessDb,
  group: GroupForAccess,
  clerkId:
    string |
    null |
    undefined,
) {
  if (!group.isActive) {
    return false;
  }

  const membership =
    await getActiveGroupMembership(
      db,
      group.id,
      clerkId,
    );

  return (
    membership?.role ===
    "OWNER"
  );
}
