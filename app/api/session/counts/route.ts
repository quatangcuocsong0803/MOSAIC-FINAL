import { getUtilityCounts } from '@/app/actions/notifications';
export async function GET() {
  try { return Response.json(await getUtilityCounts(), { headers: { 'Cache-Control': 'private, no-store' } }); }
  catch { return Response.json({ success: false }, { status: 503 }); }
}
