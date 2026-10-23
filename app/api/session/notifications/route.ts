import { getNotifications } from '@/app/actions/notifications';
export async function GET() {
  try { return Response.json(await getNotifications(), { headers: { 'Cache-Control': 'private, no-store' } }); }
  catch { return Response.json({ success: false }, { status: 503 }); }
}
