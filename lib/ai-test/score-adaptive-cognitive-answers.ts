import cognitiveFunctionQuestions from "@/src/data/cognitiveFunctionQuestions";
import mbtiTypeStacks, {
  type MbtiTypeCode,
} from "@/src/data/mbtiTypeStacks";

import {
  computeTypeScores,
  type FunctionScores,
  type RankedEntry,
} from "@/src/utils/cognitiveFunctionScoring";

import type { CognitiveFunctionCode } from "@/src/data/cognitiveFunctions";

import {
  calculateTypeCompatibility,
  type TypeCompatibilityResult,
  type TypeStacks,
  type CognitiveFunction as CompatCognitiveFunction,
  type MBTIType as CompatMBTIType,
} from "@/src/utils/typeCompatibility";

const FUNCTIONS: CognitiveFunctionCode[] = [
  "Ni",
  "Ne",
  "Si",
  "Se",
  "Ti",
  "Te",
  "Fi",
  "Fe",
];

const SCALE_MIN = 1;
const SCALE_MAX = 5;
const REVERSE_K = 6;
/*
 * Ngưỡng tạm thời để tránh ép kết luận khi
 * hai hoặc nhiều type có compatibility quá sát nhau.
 *
 * 0.03 = chênh dưới 3 percentage points trên rawScore 0–1.
 *
 * Đây là guard kỹ thuật, KHÔNG phải ngưỡng psychometric
 * đã được validation. Sau này nên hiệu chỉnh bằng dữ liệu thật.
 */
const COMPATIBILITY_AMBIGUITY_MARGIN = 0.03;
export type AdaptiveAnswers = Record<string, number>;

export type AdaptiveScoringResult = {
  functionScores: FunctionScores;

  typeScores: Record<MbtiTypeCode, number>;

  rankedTypes: RankedEntry<MbtiTypeCode>[];

bestFitType: MbtiTypeCode | null;

tiedTopTypes: MbtiTypeCode[];

  functionRanking: RankedEntry<CognitiveFunctionCode>[];

typeCompatibility: Omit<
  TypeCompatibilityResult,
  "bestFitType"
> & {
  bestFitType: MbtiTypeCode | null;
  ambiguous: boolean;
  candidateTypes: MbtiTypeCode[];
  topGap: number;
};
  questionCounts: Record<CognitiveFunctionCode, number>;
};

export type AdaptiveScoringError = {
  valid: false;
  errors: string[];
};

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function sortDescending<T extends string>(
  entries: RankedEntry<T>[]
): RankedEntry<T>[] {
  return [...entries].sort(
    (a, b) => b.score - a.score
  );
}

export function scoreAdaptiveCognitiveAnswers(
  selectedQuestionIds: string[],
  answers: AdaptiveAnswers
): AdaptiveScoringResult | AdaptiveScoringError {
  const errors: string[] = [];

  /*
   * Không cho ID trùng nhau.
   */
  const uniqueIds = [...new Set(selectedQuestionIds)];

  if (uniqueIds.length !== selectedQuestionIds.length) {
    errors.push(
      "Danh sách câu hỏi adaptive có ID bị trùng."
    );
  }

  if (uniqueIds.length === 0) {
    errors.push(
      "Không có câu hỏi adaptive để chấm."
    );
  }

  /*
   * Tìm câu hỏi thật trong question bank.
   *
   * function và reverse luôn lấy từ server-side bank,
   * không bao giờ tin dữ liệu frontend gửi lên.
   */
  const selectedQuestions = uniqueIds
    .map((id) =>
      cognitiveFunctionQuestions.find(
        (question) => question.id === id
      )
    )
    .filter(
      (
        question
      ): question is (typeof cognitiveFunctionQuestions)[number] =>
        Boolean(question)
    );

  if (selectedQuestions.length !== uniqueIds.length) {
    errors.push(
      "Có question ID không tồn tại trong Cognitive Functions question bank."
    );
  }

  /*
   * Bắt buộc mọi câu trong plan đều được trả lời.
   */
  for (const id of uniqueIds) {
    if (!(id in answers)) {
      errors.push(
        `Thiếu câu trả lời cho "${id}".`
      );
    }
  }

  /*
   * Validate Likert 1–5.
   */
  for (const id of uniqueIds) {
    const value = answers[id];

    if (value === undefined) {
      continue;
    }

    if (!Number.isInteger(value)) {
      errors.push(
        `Câu trả lời "${id}" phải là số nguyên.`
      );
      continue;
    }

    if (
      value < SCALE_MIN ||
      value > SCALE_MAX
    ) {
      errors.push(
        `Câu trả lời "${id}" phải nằm trong khoảng ${SCALE_MIN}–${SCALE_MAX}.`
      );
    }
  }

  /*
   * Đếm câu theo từng function.
   *
   * Adaptive plan hiện tại phải có ít nhất
   * 3 câu cho mỗi function.
   */
  const questionCounts = Object.fromEntries(
    FUNCTIONS.map((fn) => [fn, 0])
  ) as Record<CognitiveFunctionCode, number>;

  for (const question of selectedQuestions) {
    questionCounts[question.function] += 1;
  }

  for (const fn of FUNCTIONS) {
    if (questionCounts[fn] === 0) {
      errors.push(
        `Adaptive plan không có câu hỏi cho ${fn}.`
      );
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  /*
   * Tính điểm từng function.
   *
   * QUAN TRỌNG:
   * Vì các function có thể nhận 3 / 4 / 5 câu,
   * ta dùng AVERAGE chứ không dùng tổng điểm.
   *
   * Nhờ vậy function có nhiều câu adaptive hơn
   * không tự động được điểm cao hơn.
   */
  const sums = Object.fromEntries(
    FUNCTIONS.map((fn) => [fn, 0])
  ) as Record<CognitiveFunctionCode, number>;

  for (const question of selectedQuestions) {
    const raw = answers[question.id];

    const scoredValue = question.reverse
      ? REVERSE_K - raw
      : raw;

    sums[question.function] += scoredValue;
  }

  const functionScores = {} as FunctionScores;

  for (const fn of FUNCTIONS) {
    functionScores[fn] = round2(
      sums[fn] / questionCounts[fn]
    );
  }

  /*
   * Từ đây dùng lại đúng type scoring
   * của MOSAIC hiện tại.
   *
   * AI evidence KHÔNG xuất hiện ở đây.
   */
  const typeScores =
    computeTypeScores(functionScores);

  const rankedTypes = sortDescending(
    (
      Object.entries(typeScores) as [
        MbtiTypeCode,
        number,
      ][]
    ).map(([id, score]) => ({
      id,
      score,
    }))
  );
 const topTypeScore =
  rankedTypes[0]?.score ?? 0;

const tiedTopTypes = rankedTypes
  .filter(
    (entry) =>
      entry.score === topTypeScore
  )
  .map((entry) => entry.id);

const bestFitType =
  tiedTopTypes.length === 1
    ? tiedTopTypes[0]
    : null;
  const functionRanking = sortDescending(
    (
      Object.entries(functionScores) as [
        CognitiveFunctionCode,
        number,
      ][]
    ).map(([id, score]) => ({
      id,
      score,
    }))
  );

  /*
   * Dùng lại compatibility engine hiện tại.
   */
  const compatibilityStacks: TypeStacks =
    Object.fromEntries(
      Object.entries(mbtiTypeStacks).map(
        ([type, typeStack]) => [
          type as CompatMBTIType,
          typeStack.stack,
        ]
      )
    ) as unknown as TypeStacks;

const rawTypeCompatibility =
  calculateTypeCompatibility(
    functionScores as Record<
      CompatCognitiveFunction,
      number
    >,
    compatibilityStacks
  );

const topCompatibility =
  rawTypeCompatibility.rankedTypes[0];

const secondCompatibility =
  rawTypeCompatibility.rankedTypes[1];

const topGap =
  topCompatibility && secondCompatibility
    ? Math.max(
        0,
        topCompatibility.rawScore -
          secondCompatibility.rawScore
      )
    : 1;

const candidateTypes =
  topCompatibility
    ? rawTypeCompatibility.rankedTypes
        .filter(
          (item) =>
            topCompatibility.rawScore -
              item.rawScore <
            COMPATIBILITY_AMBIGUITY_MARGIN
        )
        .map((item) => item.type)
    : [];

const compatibilityAmbiguous =
  candidateTypes.length !== 1;

const typeCompatibility = {
  ...rawTypeCompatibility,

  bestFitType:
    compatibilityAmbiguous ||
    !topCompatibility
      ? null
      : topCompatibility.type,

  ambiguous: compatibilityAmbiguous,

  candidateTypes,

  topGap: Number(topGap.toFixed(4)),
};

  return {
    functionScores,
    typeScores,
    rankedTypes,
bestFitType,
tiedTopTypes,
    functionRanking,
    typeCompatibility,
    questionCounts,
  };
}