import { friendsSummary } from '@/lib/friends-summary';
import { auth } from '@clerk/nextjs/server';
export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Vui lòng đăng nhập.' }, { status: 401 });
  try { return Response.json(await friendsSummary(new URL(request.url).searchParams.get('cursor') || undefined), { headers: { 'Cache-Control': 'private, no-store' } }); }
  catch { return Response.json({ error: 'Chưa tải được bạn bè.' }, { status: 503 }); }
}
