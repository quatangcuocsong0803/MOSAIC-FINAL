import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { momentViewer, canViewMoment, MOMENT_BUCKET } from "@/lib/moments";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const upload = await prisma.momentUpload.findUnique({
    where: { id },
    include: { moment: { select: { visibility: true } } },
  });
  if (!upload?.moment) return new NextResponse(null, { status: 404 });
  const viewer = await momentViewer(upload.userId);
  if (!canViewMoment(upload.moment.visibility, viewer))
    return new NextResponse(null, {
      status: 404,
      headers: { "Cache-Control": "private, no-store" },
    });
  const signed = await getSupabaseAdmin()
    .storage.from(MOMENT_BUCKET)
    .createSignedUrl(upload.path, 60);
  if (signed.error) return new NextResponse(null, { status: 503 });
  return NextResponse.redirect(signed.data.signedUrl, {
    status: 307,
    headers: {
      "Cache-Control": "private, no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
}
