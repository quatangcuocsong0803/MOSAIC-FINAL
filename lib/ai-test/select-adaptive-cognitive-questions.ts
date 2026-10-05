import cognitiveFunctionQuestions, {
  type CognitiveFunctionQuestion,
} from "@/src/data/cognitiveFunctionQuestions";

import type { CognitiveFunction } from "./cognitive-open-questions";
import type { AggregatedCognitiveEvidence } from "./aggregate-cognitive-evidence";

const FUNCTIONS: CognitiveFunction[] = [
  "Ni",
  "Ne",
  "Ti",
  "Te",
  "Fi",
  "Fe",
  "Si",
  "Se",
];

/*
 * 3 câu nền × 8 functions = 24 câu.
 *
 * Sau đó:
 * - top 4 functions theo priority được thêm 1 câu
 * - top 2 functions được thêm tiếp 1 câu
 *
 * Tổng hiện tại = 30 câu.
 */
const BASE_QUESTIONS_PER_FUNCTION = 3;
const EXTRA_TOP_FUNCTIONS = 4;
const EXTRA_TOPMOST_FUNCTIONS = 2;

export type CognitiveRoutingPriority = {
  construct: CognitiveFunction;

  /*
   * support từ AI evidence đã aggregate.
   * Đây KHÔNG phải điểm MBTI.
   */
  support: number;

  /*
   * Confidence trung bình qua các câu open-ended.
   */
  averageConfidence: number;

  /*
   * Chỉ dùng để quyết định cần hỏi MCQ sâu tới đâu.
   * Không bao giờ được đưa vào final scoring.
   */
  priority: number;
};

export type AdaptiveCognitiveQuestionPlan = {
  questions: CognitiveFunctionQuestion[];

  questionCounts: Record<CognitiveFunction, number>;

  priorities: CognitiveRoutingPriority[];
};

function clamp01(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

/*
 * Sắp câu forward/reverse xen kẽ.
 *
 * Ví dụ:
 * forward 1
 * reverse 1
 * forward 2
 * reverse 2
 * ...
 *
 * Như vậy adaptive selection không vô tình lấy toàn câu
 * cùng một kiểu keying.
 */
function orderQuestionsForFunction(
  questions: CognitiveFunctionQuestion[]
): CognitiveFunctionQuestion[] {
  const forward = questions.filter((question) => !question.reverse);
  const reverse = questions.filter((question) => question.reverse);

  const ordered: CognitiveFunctionQuestion[] = [];

  let forwardIndex = 0;
  let reverseIndex = 0;

  while (
    forwardIndex < forward.length ||
    reverseIndex < reverse.length
  ) {
    if (forwardIndex < forward.length) {
      ordered.push(forward[forwardIndex]);
      forwardIndex += 1;
    }

    if (reverseIndex < reverse.length) {
      ordered.push(reverse[reverseIndex]);
      reverseIndex += 1;
    }
  }

  return ordered;
}

function calculatePriorities(
  aggregated: AggregatedCognitiveEvidence[]
): CognitiveRoutingPriority[] {
  const priorities = FUNCTIONS.map((construct) => {
    const evidence = aggregated.find(
      (item) => item.construct === construct
    );

    const support = clamp01(evidence?.support ?? 0);

    const averageConfidence =
      evidence && evidence.answerCount > 0
        ? clamp01(
            evidence.evidenceMass / evidence.answerCount
          )
        : 0;

    /*
     * Priority chỉ điều khiển SỐ LƯỢNG MCQ.
     *
     * 75%:
     * function có nhiều evidence hơn → đáng kiểm tra sâu hơn.
     *
     * 25%:
     * evidence còn không chắc → cần MCQ để xác minh thêm.
     *
     * Ví dụ:
     * support cao + confidence thấp
     * => priority rất cao.
     *
     * support cao + confidence cao
     * => vẫn đáng hỏi thêm nhưng ít cấp thiết hơn.
     *
     * support thấp + confidence thấp
     * => vẫn được 3 câu nền, nhưng không tự động chiếm
     * quá nhiều câu adaptive.
     */
    const uncertainty = 1 - averageConfidence;

    const priority =
      support * 0.75 +
      uncertainty * 0.25;

    return {
      construct,
      support: Number(support.toFixed(4)),
      averageConfidence: Number(
        averageConfidence.toFixed(4)
      ),
      priority: Number(priority.toFixed(4)),
    };
  });

  /*
   * Tie-break bằng FUNCTIONS order để kết quả luôn deterministic.
   */
  return [...priorities].sort((a, b) => {
    const priorityDifference = b.priority - a.priority;

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    return (
      FUNCTIONS.indexOf(a.construct) -
      FUNCTIONS.indexOf(b.construct)
    );
  });
}

export function buildAdaptiveCognitiveQuestionPlan(
  aggregated: AggregatedCognitiveEvidence[]
): AdaptiveCognitiveQuestionPlan {
  const priorities = calculatePriorities(aggregated);

  const questionCounts = Object.fromEntries(
    FUNCTIONS.map((construct) => [
      construct,
      BASE_QUESTIONS_PER_FUNCTION,
    ])
  ) as Record<CognitiveFunction, number>;

  /*
   * Top 4: +1 câu.
   */
  for (const item of priorities.slice(0, EXTRA_TOP_FUNCTIONS)) {
    questionCounts[item.construct] += 1;
  }

  /*
   * Top 2: thêm +1 nữa.
   *
   * => top 2 có 5 câu/function
   * => hạng 3–4 có 4 câu/function
   * => còn lại có 3 câu/function
   */
  for (const item of priorities.slice(
    0,
    EXTRA_TOPMOST_FUNCTIONS
  )) {
    questionCounts[item.construct] += 1;
  }

  const selectedQuestions: CognitiveFunctionQuestion[] = [];

  for (const construct of FUNCTIONS) {
    const pool = cognitiveFunctionQuestions.filter(
      (question) => question.function === construct
    );

    const orderedPool = orderQuestionsForFunction(pool);

    selectedQuestions.push(
      ...orderedPool.slice(
        0,
        questionCounts[construct]
      )
    );
  }

  return {
    questions: selectedQuestions,
    questionCounts,
    priorities,
  };
}