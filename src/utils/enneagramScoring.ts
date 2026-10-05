import {
  enneagramQuestions,
  type EnneagramRawAnswers,
  type EnneagramType,
} from "../data/enneagramQuestions";

const types: EnneagramType[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const responseEvidence: Record<number, number> = {
  1: -1,
  2: -0.5,
  3: 0,
  4: 0.5,
  5: 1,
};

const adjacentTypes: Record<
  EnneagramType,
  [EnneagramType, EnneagramType]
> = {
  1: [9, 2],
  2: [1, 3],
  3: [2, 4],
  4: [3, 5],
  5: [4, 6],
  6: [5, 7],
  7: [6, 8],
  8: [7, 9],
  9: [8, 1],
};

const heartTypes: EnneagramType[] = [2, 3, 4];
const headTypes: EnneagramType[] = [5, 6, 7];
const gutTypes: EnneagramType[] = [8, 9, 1];

export type CertaintyLevel = "low" | "moderate" | "high";

export interface EnneagramRankedType {
  type: EnneagramType;
  score: number;
  rawScore: number;
  exposure: number;
}

export interface EnneagramCertainty {
  level: CertaintyLevel;
  margin: number;
  index: number;
}

export interface EnneagramTritype {
  code: string;
  core: EnneagramType;
  heartFix: EnneagramType;
  headFix: EnneagramType;
  gutFix: EnneagramType;
}

export interface EnneagramResult {
  typeScores: Record<EnneagramType, number>;
  rawScores: Record<EnneagramType, number>;
  exposures: Record<EnneagramType, number>;
  rankedTypes: EnneagramRankedType[];
  coreType: EnneagramType;
  wing: EnneagramType;
  wingStrength: number;
  certainty: EnneagramCertainty;
  tritype: EnneagramTritype;
  profileSeparation: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function strongestFromCenter(
  scores: Record<EnneagramType, number>,
  center: EnneagramType[],
): EnneagramType {
  return [...center].sort((a, b) => {
    const scoreDifference = scores[b] - scores[a];

    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    return a - b;
  })[0];
}

function buildTritype(
  coreType: EnneagramType,
  scores: Record<EnneagramType, number>,
): EnneagramTritype {
  const heartFix = strongestFromCenter(scores, heartTypes);
  const headFix = strongestFromCenter(scores, headTypes);
  const gutFix = strongestFromCenter(scores, gutTypes);

  const codeParts = [
    heartFix,
    headFix,
    gutFix,
  ].map(String);

  if (heartTypes.includes(coreType)) {
    codeParts[0] = String(coreType);
  } else if (headTypes.includes(coreType)) {
    codeParts[1] = String(coreType);
  } else {
    codeParts[2] = String(coreType);
  }

  return {
    code: codeParts.join(""),
    core: coreType,
    heartFix,
    headFix,
    gutFix,
  };
}

function buildCertainty(
  coreScore: number,
  secondScore: number,
): EnneagramCertainty {
  const margin = round(coreScore - secondScore);

  const marginComponent = clamp(margin / 20, 0, 1);
  const elevationComponent = clamp(
    (coreScore - 50) / 35,
    0,
    1,
  );

  const index = Math.round(
    (marginComponent * 0.7 + elevationComponent * 0.3) * 100,
  );

  let level: CertaintyLevel = "low";

  if (index >= 68) {
    level = "high";
  } else if (index >= 40) {
    level = "moderate";
  }

  return {
    level,
    margin,
    index,
  };
}

export function scoreEnneagram(
  answers: EnneagramRawAnswers,
): EnneagramResult | { errors: string[] } {
  const errors: string[] = [];

  for (const question of enneagramQuestions) {
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

  const rawScores = Object.fromEntries(
    types.map((type) => [type, 0]),
  ) as Record<EnneagramType, number>;

  const exposures = Object.fromEntries(
    types.map((type) => [type, 0]),
  ) as Record<EnneagramType, number>;

  for (const question of enneagramQuestions) {
    exposures[question.agreeType] += 1;
    exposures[question.disagreeType] += 1;

    const evidence =
      responseEvidence[answers[question.id]];

    rawScores[question.agreeType] += evidence;
    rawScores[question.disagreeType] -= evidence;
  }

  const typeScores = Object.fromEntries(
    types.map((type) => {
      const exposure = exposures[type];

      const normalized =
        exposure === 0
          ? 50
          : 50 + (rawScores[type] / exposure) * 50;

      return [type, round(clamp(normalized, 0, 100))];
    }),
  ) as Record<EnneagramType, number>;

  const rankedTypes = [...types]
    .map((type) => ({
      type,
      score: typeScores[type],
      rawScore: round(rawScores[type]),
      exposure: exposures[type],
    }))
    .sort((a, b) => {
      const scoreDifference = b.score - a.score;

      if (scoreDifference !== 0) {
        return scoreDifference;
      }

      return a.type - b.type;
    });

  const coreType = rankedTypes[0].type;
  const coreScore = rankedTypes[0].score;
  const secondScore = rankedTypes[1].score;

  const [leftWing, rightWing] = adjacentTypes[coreType];

  const wing =
    typeScores[leftWing] >= typeScores[rightWing]
      ? leftWing
      : rightWing;

  const wingScore = typeScores[wing];

  const wingStrength =
    coreScore <= 50 || wingScore <= 50
      ? 0
      : round(
          clamp(
            ((wingScore - 50) /
              Math.max(1, coreScore - 50)) *
              100,
            0,
            100,
          ),
        );

  const certainty = buildCertainty(
    coreScore,
    secondScore,
  );

  const tritype = buildTritype(
    coreType,
    typeScores,
  );

  return {
    typeScores,
    rawScores,
    exposures,
    rankedTypes,
    coreType,
    wing,
    wingStrength,
    certainty,
    tritype,
    profileSeparation: round(
      coreScore - secondScore,
    ),
  };
}

export { responseEvidence };
