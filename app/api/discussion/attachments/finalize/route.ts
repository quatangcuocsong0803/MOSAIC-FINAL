import {
  createHash,
} from "crypto";

import {
  auth,
} from "@clerk/nextjs/server";

import {
  NextResponse,
} from "next/server";

import {
  prisma,
} from "@/lib/prisma";

import {
  DISCUSSION_ATTACHMENT_BUCKET,
  getSupabaseAdmin,
} from "@/lib/supabase-admin";

import {
  getSafeExtension,
  performStaticFileScreening,
} from "@/lib/discussion/attachment-security";

export const runtime =
  "nodejs";

export async function POST(
  request: Request,
) {
  try {
    const { userId } =
      await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Bạn cần đăng nhập.",
        },
        {
          status: 401,
        },
      );
    }

    const body =
      await request.json();

    const attachmentId =
      typeof body.attachmentId ===
      "string"
        ? body.attachmentId.trim()
        : "";

    const attachment =
      await prisma.postAttachment.findFirst({
        where: {
          id:
            attachmentId,

          uploaderClerkId:
            userId,

          postId:
            null,
        },
      });

    if (!attachment) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Không tìm thấy attachment.",
        },
        {
          status: 404,
        },
      );
    }

    const extension =
      getSafeExtension(
        attachment.originalName,
      );

    if (!extension) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Không xác định được định dạng file.",
        },
        {
          status: 400,
        },
      );
    }

    await prisma.postAttachment.update({
      where: {
        id:
          attachment.id,
      },

      data: {
        scanStatus:
          "SCANNING",

        scanNote:
          "Static screening v1 in progress.",
      },
    });

    const supabase =
      getSupabaseAdmin();

    const download =
      await supabase.storage
        .from(
          DISCUSSION_ATTACHMENT_BUCKET,
        )
        .download(
          attachment.storagePath,
        );

    if (
      download.error ||
      !download.data
    ) {
      await prisma.postAttachment.update({
        where: {
          id:
            attachment.id,
        },

        data: {
          scanStatus:
            "ERROR",

          scanNote:
            "Uploaded object could not be downloaded for screening.",
        },
      });

      return NextResponse.json(
        {
          success: false,
          error:
            "Không thể đọc file đã upload để kiểm tra.",
        },
        {
          status: 500,
        },
      );
    }

    const buffer =
      Buffer.from(
        await download.data.arrayBuffer(),
      );

    if (
      buffer.length !==
      attachment.sizeBytes
    ) {
      await supabase.storage
        .from(
          DISCUSSION_ATTACHMENT_BUCKET,
        )
        .remove([
          attachment.storagePath,
        ]);

      await prisma.postAttachment.update({
        where: {
          id:
            attachment.id,
        },

        data: {
          scanStatus:
            "UNSAFE",

          moderationStatus:
            "REJECTED",

          scanNote:
            "Uploaded file size does not match prepared metadata.",

          moderationReason:
            "File integrity validation failed.",
        },
      });

      return NextResponse.json(
        {
          success: false,
          rejected: true,
          error:
            "File không vượt qua kiểm tra integrity.",
        },
        {
          status: 400,
        },
      );
    }

    const screening =
      await performStaticFileScreening({
        buffer,
        extension,
      });

    if (
      !screening.success
    ) {
      // Unsafe object không được giữ trong Storage.
      await supabase.storage
        .from(
          DISCUSSION_ATTACHMENT_BUCKET,
        )
        .remove([
          attachment.storagePath,
        ]);

      await prisma.postAttachment.update({
        where: {
          id:
            attachment.id,
        },

        data: {
          scanStatus:
            "UNSAFE",

          moderationStatus:
            "REJECTED",

          scanNote:
            screening.error,

          moderationReason:
            "Attachment failed static security screening.",
        },
      });

      return NextResponse.json(
        {
          success: false,
          rejected: true,
          error:
            screening.error,
        },
        {
          status: 400,
        },
      );
    }

    const sha256 =
      createHash(
        "sha256",
      )
        .update(buffer)
        .digest("hex");

    const updated =
      await prisma.postAttachment.update({
        where: {
          id:
            attachment.id,
        },

        data: {
          sha256,

          scanStatus:
            "CLEAN",

          scanNote:
            "Passed MOSAIC static structural screening v1. Content moderation is still required.",

          moderationStatus:
            "PENDING",

          extractedTextPreview:
            screening.previewText,
        },

        select: {
          id: true,
          kind: true,
          originalName: true,
          sizeBytes: true,
          scanStatus: true,
          moderationStatus: true,
        },
      });

    return NextResponse.json({
      success: true,
      attachment:
        updated,
    });
  } catch (error) {
    console.error(
      "Attachment finalize error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Không thể hoàn tất kiểm tra attachment.",
      },
      {
        status: 500,
      },
    );
  }
}
