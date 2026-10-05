import { verifyAdaptivePlanToken } from "@/lib/ai-test/adaptive-plan-token";

import {
  scoreAdaptiveCognitiveAnswers,
  type AdaptiveAnswers,
} from "@/lib/ai-test/score-adaptive-cognitive-answers";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const planToken =
      typeof body.planToken === "string"
        ? body.planToken.trim()
        : "";

    if (!planToken) {
      return Response.json(
        {
          ok: false,
          error: "Thiếu planToken.",
        },
        { status: 400 }
      );
    }

    if (
      typeof body.answers !== "object" ||
      body.answers === null ||
      Array.isArray(body.answers)
    ) {
      return Response.json(
        {
          ok: false,
          error: "Thiếu answers hợp lệ.",
        },
        { status: 400 }
      );
    }

    /*
     * Xác minh token:
     * - chữ ký phải đúng
     * - token chưa hết hạn
     *
     * questionIds được lấy từ token đã ký,
     * KHÔNG lấy từ client.
     */
    const plan =
      verifyAdaptivePlanToken(planToken);

    const rawAnswers =
      body.answers as Record<string, unknown>;

    /*
     * Không cho frontend chèn thêm question ID
     * không thuộc adaptive plan.
     */
    const allowedIds = new Set(
      plan.questionIds
    );

    const extraIds = Object.keys(
      rawAnswers
    ).filter(
      (id) => !allowedIds.has(id)
    );

    if (extraIds.length > 0) {
      return Response.json(
        {
          ok: false,
          error:
            "Có câu trả lời không thuộc adaptive plan.",
        },
        { status: 400 }
      );
    }

    /*
     * Chỉ dựng answers từ các ID trong
     * planToken đã được server ký.
     */
    const answers: AdaptiveAnswers = {};

    for (const questionId of plan.questionIds) {
      const value =
        rawAnswers[questionId];

      if (typeof value === "number") {
        answers[questionId] = value;
      }
    }

    /*
     * Deterministic scorer.
     *
     * Không có:
     * - Groq
     * - AI evidence
     * - support
     * - confidence
     */
    const result =
      scoreAdaptiveCognitiveAnswers(
        plan.questionIds,
        answers
      );

    if ("errors" in result) {
      return Response.json(
        {
          ok: false,
          errors: result.errors,
        },
        { status: 400 }
      );
    }

    return Response.json({
      ok: true,
      result,
    });
  } catch (error) {
    console.error(
      "Adaptive cognitive scoring error:",
      error instanceof Error
        ? error.message
        : "Unknown error"
    );

    return Response.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Không thể chấm bài adaptive.",
      },
      { status: 400 }
    );
  }
}