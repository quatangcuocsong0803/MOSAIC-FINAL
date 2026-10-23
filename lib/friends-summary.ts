import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { identitySelect, visibleIdentity } from '@/lib/profile-identity';
export async function friendsSummary(cursor?: string) {
  const { userId } = await auth();
  if (!userId) throw Error('Vui lòng đăng nhập.');
  const viewer = await prisma.user.findUnique({ where: { clerkId: userId }, select: { id: true } });
  if (!viewer) return { users: [], next: undefined };
  const id = viewer.id;
  const users = await prisma.user.findMany({ where: { AND: [
    { OR: [{ sentRequests: { some: { receiverId: id, status: 'ACCEPTED' } } }, { receivedRequests: { some: { senderId: id, status: 'ACCEPTED' } } }] },
    { blocksCreated: { none: { blockedId: id } }, blocksReceived: { none: { blockerId: id } } },
    ...(cursor ? [{ id: { gt: cursor } }] : []),
  ] }, select: identitySelect, orderBy: { id: 'asc' }, take: 13 });
  const page = users.slice(0,12);
  const mutual = page.length ? await prisma.$queryRaw<{ id: string; count: bigint }[]>(Prisma.sql`
    WITH mine AS (
      SELECT CASE WHEN "senderId" = ${id} THEN "receiverId" ELSE "senderId" END AS id
      FROM "Friendship" WHERE status = 'ACCEPTED' AND ("senderId" = ${id} OR "receiverId" = ${id})
    ), candidates AS (
      SELECT t.id, m.id AS mutual FROM unnest(ARRAY[${Prisma.join(page.map(u => u.id))}]::text[]) AS t(id)
      JOIN "Friendship" f ON f.status = 'ACCEPTED' AND (f."senderId" = t.id OR f."receiverId" = t.id)
      JOIN mine m ON m.id = CASE WHEN f."senderId" = t.id THEN f."receiverId" ELSE f."senderId" END
    ) SELECT c.id, COUNT(DISTINCT c.mutual) AS count FROM candidates c
    WHERE NOT EXISTS (SELECT 1 FROM "UserBlock" b WHERE
      (b."blockerId" IN (${id}, c.id) AND b."blockedId" = c.mutual) OR
      (b."blockedId" IN (${id}, c.id) AND b."blockerId" = c.mutual)) GROUP BY c.id
  `) : [];
  const counts = new Map(mutual.map(row => [row.id, Number(row.count)]));
  return { users: page.map(u => ({ ...visibleIdentity(u, false, true), mutualCount: counts.get(u.id) ?? 0 })), next: users.length > 12 ? page[11].id : undefined };
}
