import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { toSnapshot } from '@/lib/settings/preferences';
export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ success: false }, { status: 401 });
  try {
    const user = await prisma.user.findUnique({ where: { clerkId: userId }, select: {
      avatarUrl: true, onboardingStep: true, onboardingCompletedAt: true, settings: true,
    } });
    return Response.json({ success: true, accountId: userId, avatarUrl: user?.avatarUrl ?? null,
      profile: { onboardingStep: user?.onboardingStep ?? 0, onboardingCompletedAt: user?.onboardingCompletedAt ?? null },
      settings: toSnapshot(user?.settings),
    }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch { return Response.json({ success: false }, { status: 503 }); }
}
