import { listMoments } from '@/app/actions/moments';
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const owner = params.get('ownerId');
  if (!owner) return Response.json({ error: 'Thiếu hồ sơ.' }, { status: 400 });
  try { return Response.json(await listMoments(owner, params.get('cursor') || undefined), { headers: { 'Cache-Control': 'private, no-store' } }); }
  catch { return Response.json({ error: 'Chưa tải được Khoảnh khắc.' }, { status: 503 }); }
}
