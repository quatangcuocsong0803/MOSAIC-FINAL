import {
  aggregateCognitiveEvidence,
  type CognitiveEvidence,
} from "@/lib/ai-test/aggregate-cognitive-evidence";

import { analyzeCognitiveAnswer } from "@/lib/ai-test/analyze-cognitive-answer";

import { cognitiveOpenQuestions } from "@/lib/ai-test/cognitive-open-questions";

import { buildAdaptiveCognitiveQuestionPlan } from "@/lib/ai-test/select-adaptive-cognitive-questions";

import { createAdaptivePlanToken } from "@/lib/ai-test/adaptive-plan-token";

type OpenAnswerInput = {
  questionId?: unknown;
  answer?: unknown;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    /*
     * Frontend chỉ gửi:
     *
     * {
     *   "answers": [
     *     {
     *       "questionId": "cf-open-01",
     *       "answer": "..."
     *     }
     *   ]
     * }
     *
     * Frontend KHÔNG gửi:
     * - targets
     * - support
     * - confidence
     * - function
     * - reverse
     */
    if (!Array.isArray(body.answers)) {
      return Response.json(
        {
          ok: false,
          error: "Thiếu answers hợp lệ.",
        },
        { status: 400 }
      );
    }

    if (body.answers.length === 0) {
      return Response.json(
        {
          ok: false,
          error: "Chưa có câu trả lời mở.",
        },
        { status: 400 }
      );
    }

    /*
     * Không cho client gửi nhiều câu hơn
     * số câu trong open-question bank.
     */
    if (
      body.answers.length >
      cognitiveOpenQuestions.length
    ) {
      return Response.json(
        {
          ok: false,
          error:
            "Số câu trả lời vượt quá question bank.",
        },
        { status: 400 }
      );
    }

    const normalizedAnswers: {
      questionId: string;
      question: string;
      answer: string;
    }[] = [];

    const seenQuestionIds =
      new Set<string>();

    for (
      const rawItem of body.answers as OpenAnswerInput[]
    ) {
      const questionId =
        typeof rawItem?.questionId === "string"
          ? rawItem.questionId.trim()
          : "";

      const answer =
        typeof rawItem?.answer === "string"
          ? rawItem.answer.trim()
          : "";

      if (!questionId) {
        return Response.json(
          {
            ok: false,
            error:
              "Có câu trả lời thiếu questionId.",
          },
          { status: 400 }
        );
      }

      if (
        seenQuestionIds.has(questionId)
      ) {
        return Response.json(
          {
            ok: false,
            error: `questionId bị trùng: ${questionId}`,
          },
          { status: 400 }
        );
      }

      const questionData =
        cognitiveOpenQuestions.find(
          (question) =>
            question.id === questionId
        );

      if (!questionData) {
        return Response.json(
          {
            ok: false,
            error: `questionId không hợp lệ: ${questionId}`,
          },
          { status: 400 }
        );
      }

      if (!answer) {
        return Response.json(
          {
            ok: false,
            error: `Câu ${questionId} chưa có câu trả lời.`,
          },
          { status: 400 }
        );
      }

      if (answer.length > 5000) {
        return Response.json(
          {
            ok: false,
            error: `Câu trả lời ${questionId} quá dài.`,
          },
          { status: 400 }
        );
      }

      seenQuestionIds.add(questionId);

      normalizedAnswers.push({
        questionId,
        question: questionData.prompt,
        answer,
      });
    }

    /*
     * AI analysis hoàn toàn phía server.
     *
     * Raw answer:
     * browser → MOSAIC server → Groq
     *
     * Evidence:
     * Groq → MOSAIC server
     *
     * Evidence KHÔNG quay về browser.
     */
    const evidenceSets: CognitiveEvidence[][] =
      [];

    for (const item of normalizedAnswers) {
      const evidence =
        await analyzeCognitiveAnswer(
          item.question,
          item.answer
        );

      evidenceSets.push(evidence);
    }

    /*
     * Aggregate evidence từ nhiều câu mở.
     */
    const aggregated =
      aggregateCognitiveEvidence(
        evidenceSets
      );

    /*
     * Deterministic router chọn MCQ.
     *
     * AI không trực tiếp chọn question ID.
     */
    const plan =
      buildAdaptiveCognitiveQuestionPlan(
        aggregated
      );

    /*
     * Frontend chỉ nhận dữ liệu cần
     * để hiển thị câu hỏi.
     *
     * KHÔNG trả:
     * - function
     * - reverse
     * - support
     * - confidence
     * - evidenceMass
     * - priority
     */
    const questions =
      plan.questions.map(
        (question) => ({
          id: question.id,
          text: question.text,
        })
      );

    /*
     * Server ký chính xác danh sách câu hỏi
     * đã được chọn.
     *
     * Frontend có thể nhìn thấy token,
     * nhưng không thể sửa plan mà vẫn
     * tạo được chữ ký hợp lệ.
     */
    const planToken =
      createAdaptivePlanToken(
        plan.questions.map(
          (question) => question.id
        )
      );

    return Response.json({
      ok: true,
      totalQuestions:
        questions.length,
      questions,
      planToken,
    });
  } catch (error) {
    /*
     * Không log raw answers.
     */
    console.error(
      "Adaptive cognitive plan error:",
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
            : "Không thể tạo bài test adaptive.",
      },
      { status: 500 }
    );
  }
}