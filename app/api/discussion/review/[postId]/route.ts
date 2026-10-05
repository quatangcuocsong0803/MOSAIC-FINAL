import {
  auth,
} from "@clerk/nextjs/server";

import {
  after,
  NextResponse,
} from "next/server";

import {
  prisma,
} from "@/lib/prisma";

import {
  getDiscussionReviewStatusForUser,
} from "@/lib/discussion/review-status";

import {
  runDiscussionModeration,
} from "@/lib/discussion/run-discussion-moderation";

export const runtime =
  "nodejs";

export async function GET(
  _request: Request,
  context: {
    params: Promise<{
      postId: string;
    }>;
  },
) {
  try {
    const {
      userId,
    } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "UNAUTHENTICATED",
        },
        {
          status: 401,
        },
      );
    }

    const {
      postId,
    } =
      await context.params;

    const data =
      await getDiscussionReviewStatusForUser(
        postId,
        userId,
      );

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error:
            "NOT_FOUND",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "Discussion review GET error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "SERVER_ERROR",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(
  _request: Request,
  context: {
    params: Promise<{
      postId: string;
    }>;
  },
) {
  try {
    const {
      userId,
    } = await auth();

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
      postId,
    } =
      await context.params;

    const data =
      await getDiscussionReviewStatusForUser(
        postId,
        userId,
      );

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Không tìm thấy bài viết.",
        },
        {
          status: 404,
        },
      );
    }

    if (
      data.moderationStatus !==
      "REVIEWING"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Bài viết không còn ở trạng thái REVIEWING.",
        },
        {
          status: 409,
        },
      );
    }

    if (!data.canRetry) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Moderation vẫn có thể đang chạy. Hãy đợi thêm một chút trước khi retry.",

          retryAvailableAt:
            data.retryAvailableAt,
        },
        {
          status: 429,
        },
      );
    }

    // Touch updatedAt để khóa việc bấm retry liên tục.
    await prisma.post.update({
      where: {
        id:
          postId,
      },

      data: {
        updatedAt:
          new Date(),
      },
    });

    after(async () => {
      try {
        await runDiscussionModeration(
          postId,
        );
      } catch (error) {
        console.error(
          "Discussion moderation retry failed:",
          error,
        );
      }
    });

    return NextResponse.json(
      {
        success: true,
        status:
          "REVIEWING",
      },
      {
        status: 202,
      },
    );
  } catch (error) {
    console.error(
      "Discussion review retry error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Không thể retry moderation.",
      },
      {
        status: 500,
      },
    );
  }
}
