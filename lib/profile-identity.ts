import type { Prisma } from "@prisma/client";
import { canSee } from "@/lib/profile-policy";
export const identitySelect = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
  usernameVisibility: true,
  displayNameVisibility: true,
  avatarUrlVisibility: true,
} satisfies Prisma.UserSelect;
type Identity = Prisma.UserGetPayload<{ select: typeof identitySelect }>;
export function visibleIdentity(user: Identity, owner = false, friend = false) {
  const displayName = canSee(user.displayNameVisibility, owner, friend)
    ? user.displayName
    : null;
  const username = canSee(user.usernameVisibility, owner, friend)
    ? user.username
    : null;
  return {
    id: user.id,
    username: displayName || username,
    avatarUrl: canSee(user.avatarUrlVisibility, owner, friend)
      ? user.avatarUrl
      : null,
  };
}
export async function identityForViewer(viewerId?: string) {
  const { prisma } = await import("@/lib/prisma");
  const relationships = viewerId
    ? await prisma.friendship.findMany({
        where: {
          status: "ACCEPTED",
          OR: [{ senderId: viewerId }, { receiverId: viewerId }],
        },
        select: { senderId: true, receiverId: true },
      })
    : [];
  const friends = new Set(
    relationships.map((row) =>
      row.senderId === viewerId ? row.receiverId : row.senderId,
    ),
  );
  return (identity: Identity) =>
    visibleIdentity(
      identity,
      identity.id === viewerId,
      friends.has(identity.id),
    );
}
