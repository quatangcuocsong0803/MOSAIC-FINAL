import {
  enneagramInstinctQuestions,
  type InstinctRawAnswers,
  type InstinctualVariant,
} from "../data/enneagramInstinctQuestions";

const instincts: InstinctualVariant[] = ["sp", "sx", "so"];

const responseEvidence: Record<number, number> = {
  1: -1,
  2: -0.5,
  3: 0,
  4: 0.5,
  5: 1,
};

export interface InstinctRanked {
  instinct: InstinctualVariant;
  score: number;
  rawScore: number;
}

export interface InstinctResult {
  instinctScores: Record<InstinctualVariant, number>;
  rawInstinctScores: Record<InstinctualVariant, number>;
  rankedInstincts: InstinctRanked[];
  instinctualStack: InstinctualVariant[];
}

export function scoreInstincts(
  answers: InstinctRawAnswers,
): InstinctResult | { errors: string[] } {
  const errors: string[] = [];

  for (const question of enneagramInstinctQuestions) {
    const value = answers[question.id];

    if (!Number.isInteger(value) || value < 1 || value > 5) {
      errors.push(
        `Invalid or missing answer for question ${question.id}.`,
      );
    }
  }

  if (errors.length > 0) {
    return { errors };
  }

  const rawInstinctScores = Object.fromEntries(
    instincts.map((instinct) => [instinct, 0]),
  ) as Record<InstinctualVariant, number>;

  const exposure = Object.fromEntries(
    instincts.map((instinct) => [instinct, 0]),
  ) as Record<InstinctualVariant, number>;

  for (const question of enneagramInstinctQuestions) {
    const value = responseEvidence[answers[question.id]];

    rawInstinctScores[question.agreeInstinct] += value;
    rawInstinctScores[question.disagreeInstinct] -= value;

    exposure[question.agreeInstinct] += 1;
    exposure[question.disagreeInstinct] += 1;
  }

  const instinctScores = Object.fromEntries(
    instincts.map((instinct) => {
      const maxAbsoluteScore = exposure[instinct];

      const normalized =
        maxAbsoluteScore > 0
          ? 50 +
            (rawInstinctScores[instinct] /
              maxAbsoluteScore) *
              50
          : 50;

      return [
        instinct,
        Math.round(
          Math.max(0, Math.min(100, normalized)) * 100,
        ) / 100,
      ];
    }),
  ) as Record<InstinctualVariant, number>;

  const rankedInstincts = [...instincts]
    .map((instinct) => ({
      instinct,
      score: instinctScores[instinct],
      rawScore: rawInstinctScores[instinct],
    }))
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return instincts.indexOf(a.instinct) - instincts.indexOf(b.instinct);
    });

  return {
    instinctScores,
    rawInstinctScores,
    rankedInstincts,
    instinctualStack: rankedInstincts.map(
      (item) => item.instinct,
    ),
  };
}

export { responseEvidence };
