import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { isBlockedBetween } from "@/lib/blocks";
import { canSee } from "@/lib/profile-policy";
export async function momentViewer(ownerId: string) {
  const { userId } = await auth();
  const viewer = userId
    ? await prisma.user.findUnique({
        where: { clerkId: userId },
        select: { id: true },
      })
    : null;
  const owner = viewer?.id === ownerId;
  if (owner)
    return { owner: true, friend: false, blocked: false, viewerId: viewer.id };
  if (viewer && (await isBlockedBetween(viewer.id, ownerId)))
    return { owner: false, friend: false, blocked: true, viewerId: viewer.id };
  const friend = viewer
    ? Boolean(
        await prisma.friendship.findFirst({
          where: {
            status: "ACCEPTED",
            OR: [
              { senderId: ownerId, receiverId: viewer.id },
              { senderId: viewer.id, receiverId: ownerId },
            ],
          },
          select: { id: true },
        }),
      )
    : false;
  return { owner: false, friend, blocked: false, viewerId: viewer?.id };
}
export function canViewMoment(
  visibility: string,
  viewer: { owner: boolean; friend: boolean; blocked: boolean },
) {
  return !viewer.blocked && canSee(visibility, viewer.owner, viewer.friend);
}
export const MOMENT_BUCKET = "profile-moments";
export const MOMENT_MIMES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};
export const MAX_MOMENT_IMAGE = 10 * 1024 * 1024,
  MAX_MOMENT_VIDEO = 50 * 1024 * 1024;
