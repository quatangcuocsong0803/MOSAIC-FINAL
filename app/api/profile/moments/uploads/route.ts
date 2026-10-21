import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  MOMENT_BUCKET,
  MOMENT_MIMES,
  MAX_MOMENT_IMAGE,
  MAX_MOMENT_VIDEO,
} from "@/lib/moments";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Vui lòng đăng nhập." }, { status: 401 });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json(
      { error: "Yêu cầu không hợp lệ." },
      { status: 403 },
    );
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { clerkId: userId },
      select: { id: true },
    });
    const body = await request.json();
    const storage = getSupabaseAdmin();
    const bucket = storage.storage.from(MOMENT_BUCKET);
    if (body.uploadId) {
      const upload = await prisma.momentUpload.findFirst({
        where: { id: body.uploadId, userId: user.id, momentId: null },
      });
      if (!upload) throw Error("Không tìm thấy tệp.");
      const info = await bucket.info(upload.path);
      if (
        info.error ||
        !info.data ||
        Number(info.data.size) !== upload.bytes ||
        info.data.contentType !== upload.mimeType
      )
        throw Error("Tệp tải lên chưa hoàn tất hoặc định dạng không khớp.");
      const signed = await bucket.createSignedUrl(upload.path, 30);
      if (!signed.data) throw Error("Chưa kiểm tra được tệp.");
      const sample = await fetch(signed.data.signedUrl, {
        headers: { Range: "bytes=0-31" },
      });
      if (sample.status !== 206) throw Error("Chưa xác minh được tệp tải lên.");
      const bytes = new Uint8Array(await sample.arrayBuffer());
      const { avatarFormat } = await import("@/lib/avatar/validation");
      const format = avatarFormat(bytes);
      const video =
        upload.mimeType === "video/webm"
          ? bytes[0] === 0x1a &&
            bytes[1] === 0x45 &&
            bytes[2] === 0xdf &&
            bytes[3] === 0xa3
          : new TextDecoder().decode(bytes.slice(4, 8)) === "ftyp";
      if (
        upload.mimeType.startsWith("image/")
          ? format?.contentType !== upload.mimeType
          : !video
      )
        throw Error("Nội dung tệp không khớp định dạng ảnh/video.");
      await prisma.momentUpload.update({
        where: { id: upload.id },
        data: { finalized: true },
      });
      return NextResponse.json({ id: upload.id });
    }
    const { mimeType, bytes } = body;
    const extension = MOMENT_MIMES[mimeType];
    if (
      !extension ||
      !Number.isInteger(bytes) ||
      bytes <= 0 ||
      bytes >
        (mimeType.startsWith("video/") ? MAX_MOMENT_VIDEO : MAX_MOMENT_IMAGE)
    )
      throw Error("Ảnh tối đa 10 MB; video tối đa 50 MB.");
    const recent = await prisma.momentUpload.count({
      where: {
        userId: user.id,
        createdAt: { gt: new Date(Date.now() - 3600000) },
      },
    });
    if (recent >= 40)
      throw Error("Bạn đã tải nhiều tệp. Vui lòng thử lại sau.");
    const existing = await storage.storage.getBucket(MOMENT_BUCKET);
    if (existing.data?.public)
      throw Error("Kho Khoảnh khắc phải đặt riêng tư.");
    if (existing.error) {
      if (
        String(existing.error.statusCode) !== "404" &&
        !existing.error.message.toLowerCase().includes("not found")
      )
        throw Error("Chưa truy cập được kho tệp.");
      const made = await storage.storage.createBucket(MOMENT_BUCKET, {
        public: false,
        fileSizeLimit: MAX_MOMENT_VIDEO,
        allowedMimeTypes: Object.keys(MOMENT_MIMES),
      });
      if (made.error && !made.error.message.includes("already"))
        throw Error("Chưa tạo được kho tệp.");
    }
    const path = `${user.id}/${randomUUID()}.${extension}`;
    const signed = await bucket.createSignedUploadUrl(path, { upsert: false });
    if (signed.error) throw Error("Chưa chuẩn bị được lượt tải.");
    const upload = await prisma.momentUpload.create({
      data: { userId: user.id, path, mimeType, bytes },
    });
    return NextResponse.json(
      { id: upload.id, url: signed.data.signedUrl },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return NextResponse.json(
      {
        error:
          e instanceof Error && !(e as { code?: string }).code
            ? e.message
            : "Chưa tải được tệp.",
      },
      { status: 400 },
    );
  }
}
