import { prisma } from "@/lib/prisma";

export async function isBlockedBetween(
  userAId: string,
  userBId: string,
) {
  const block = await prisma.userBlock.findFirst({
    where: {
      OR: [
        {
          blockerId: userAId,
          blockedId: userBId,
        },
        {
          blockerId: userBId,
          blockedId: userAId,
        },
      ],
    },

    select: {
      id: true,
    },
  });

  return Boolean(block);
}
