import { getOwnerProfileSummary } from '@/app/actions/profile';
export async function GET() {
  const result = await getOwnerProfileSummary();
  return Response.json(result, { status: result.success ? 200 : 503, headers: { 'Cache-Control': 'private, no-store' } });
}
