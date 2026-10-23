import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Vui lòng đăng nhập.' }, { status: 401 });
  const cursor = new URL(request.url).searchParams.get('cursor');
  try {
    const user = await prisma.user.findUnique({ where: { clerkId: userId }, select: { id: true } });
    if (!user) return Response.json({ items: [] }, { headers: { 'Cache-Control': 'private, no-store' } });
    const anchor = cursor ? await prisma.testResult.findFirst({ where: { id: cursor, userId: user.id }, select: { id: true, createdAt: true } }) : null;
    if (cursor && !anchor) return Response.json({ error: 'Mốc lịch sử không hợp lệ.' }, { status: 400 });
    const rows = await prisma.$queryRaw<Array<Record<string, unknown> & { id: string; attemptNumber: bigint }>>(Prisma.sql`
      SELECT * FROM (
        SELECT id, "testType", "testVariant", "resultName", NULL::text AS details,
          "statisticsConsent", "statisticsConsentVersion", "statisticsConsentedAt", "statisticsConsentRevokedAt", "createdAt",
          ROW_NUMBER() OVER (PARTITION BY "testType" ORDER BY "createdAt", id) AS "attemptNumber"
        FROM "TestResult" WHERE "userId" = ${user.id}
      ) history ${anchor ? Prisma.sql`WHERE ("createdAt", id) < (${anchor.createdAt}, ${anchor.id})` : Prisma.empty}
      ORDER BY "createdAt" DESC, id DESC LIMIT 21
    `);
    return Response.json({ items: rows.slice(0,20).map(row => ({ ...row, attemptNumber: Number(row.attemptNumber) })), next: rows.length > 20 ? rows[19].id : undefined }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch { return Response.json({ error: 'Chưa tải được kết quả test.' }, { status: 503 }); }
}
