import {
  randomUUID,
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
  ensureDiscussionAttachmentBucket,
  getSupabaseAdmin,
} from "@/lib/supabase-admin";

import {
  validateUploadMetadata,
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

    const fileName =
      typeof body.fileName ===
      "string"
        ? body.fileName
        : "";

    const mimeType =
      typeof body.mimeType ===
      "string"
        ? body.mimeType
        : "";

    const sizeBytes =
      Number(
        body.sizeBytes,
      );

    const uploadSessionId =
      typeof body.uploadSessionId ===
      "string"
        ? body.uploadSessionId.trim()
        : "";

    if (
      !/^[A-Za-z0-9_-]{12,100}$/.test(
        uploadSessionId,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Upload session không hợp lệ.",
        },
        {
          status: 400,
        },
      );
    }

    const validation =
      validateUploadMetadata({
        fileName,
        mimeType,
        sizeBytes,
      });

    if (
      !validation.success
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            validation.error,
        },
        {
          status: 400,
        },
      );
    }

    // Chống abuse đơn giản:
    // tối đa 25 attachment chưa gắn post trong 1 giờ/user.
    const recentCount =
      await prisma.postAttachment.count({
        where: {
          uploaderClerkId:
            userId,

          postId: null,

          createdAt: {
            gte: new Date(
              Date.now() -
                60 *
                  60 *
                  1000,
            ),
          },
        },
      });

    if (
      recentCount >= 25
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Bạn đã tải quá nhiều file trong thời gian ngắn. Hãy thử lại sau.",
        },
        {
          status: 429,
        },
      );
    }

    await ensureDiscussionAttachmentBucket();

    const attachmentId =
      randomUUID();

    const storagePath =
      [
        "quarantine",
        uploadSessionId,
        `${attachmentId}.${validation.extension}`,
      ].join("/");

    await prisma.postAttachment.create({
      data: {
        id:
          attachmentId,

        uploaderClerkId:
          userId,

        uploadSessionId,

        kind:
          validation.rule.kind,

        originalName:
          fileName.slice(
            0,
            255,
          ),

        storagePath,

        mimeType:
          mimeType ||
          "application/octet-stream",

        sizeBytes,

        scanStatus:
          "PENDING",

        moderationStatus:
          "PENDING",
      },
    });

    const supabase =
      getSupabaseAdmin();

    const signed =
      await supabase.storage
        .from(
          DISCUSSION_ATTACHMENT_BUCKET,
        )
        .createSignedUploadUrl(
          storagePath,
          {
            upsert: false,
          },
        );

    if (
      signed.error ||
      !signed.data?.token
    ) {
      await prisma.postAttachment.delete({
        where: {
          id:
            attachmentId,
        },
      });

      return NextResponse.json(
        {
          success: false,
          error:
            "Không thể chuẩn bị vùng upload.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,

      attachment: {
        id:
          attachmentId,

        kind:
          validation.rule.kind,

        originalName:
          fileName,

        sizeBytes,

        storagePath,

        bucket:
          DISCUSSION_ATTACHMENT_BUCKET,

        token:
          signed.data.token,
      },
    });
  } catch (error) {
    console.error(
      "Attachment prepare error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Không thể chuẩn bị file upload.",
      },
      {
        status: 500,
      },
    );
  }
}
