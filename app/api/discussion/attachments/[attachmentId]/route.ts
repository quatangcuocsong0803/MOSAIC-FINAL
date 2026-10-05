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

export const runtime =
  "nodejs";

export async function DELETE(
  _request: Request,
  context: {
    params: Promise<{
      attachmentId: string;
    }>;
  },
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

    const {
      attachmentId,
    } =
      await context.params;

    const attachment =
      await prisma.postAttachment.findFirst({
        where: {
          id:
            attachmentId,

          uploaderClerkId:
            userId,
        },
      });

    if (!attachment) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Attachment không tồn tại.",
        },
        {
          status: 404,
        },
      );
    }

    // Khi đã link vào Post thì không cho client
    // xóa vòng qua composer API nữa.
    if (attachment.postId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Attachment đã thuộc về một bài viết.",
        },
        {
          status: 409,
        },
      );
    }

    const supabase =
      getSupabaseAdmin();

    // Nếu file chưa upload thành công thì remove có thể không tìm thấy.
    // Điều đó không cản DB cleanup.
    await supabase.storage
      .from(
        DISCUSSION_ATTACHMENT_BUCKET,
      )
      .remove([
        attachment.storagePath,
      ]);

    await prisma.postAttachment.delete({
      where: {
        id:
          attachment.id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Attachment delete error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Không thể xóa attachment.",
      },
      {
        status: 500,
      },
    );
  }
}
