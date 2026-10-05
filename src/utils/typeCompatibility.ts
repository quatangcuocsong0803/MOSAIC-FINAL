export type CognitiveFunction =
  | "Ni"
  | "Ne"
  | "Si"
  | "Se"
  | "Ti"
  | "Te"
  | "Fi"
  | "Fe";

export type MBTIType =
  | "INTJ"
  | "INTP"
  | "ENTJ"
  | "ENTP"
  | "INFJ"
  | "INFP"
  | "ENFJ"
  | "ENFP"
  | "ISTJ"
  | "ISFJ"
  | "ESTJ"
  | "ESFJ"
  | "ISTP"
  | "ISFP"
  | "ESTP"
  | "ESFP";

export type FunctionScores = Record<CognitiveFunction, number>;

export type TypeStack = readonly [
  CognitiveFunction,
  CognitiveFunction,
  CognitiveFunction,
  CognitiveFunction,
];

export type TypeStacks = Record<MBTIType, TypeStack>;

export interface TypeCompatibilityItem {
  type: MBTIType;
  compatibility: number;
  rawScore: number;

  dominantFunction: CognitiveFunction;

  positionScores: {
    dominant: number;
    auxiliary: number;
    tertiary: number;
    inferior: number;
  };

  orderFit: number;
  competitionPenalty: number;
}

export interface TypeCompatibilityResult {
  rankedTypes: TypeCompatibilityItem[];
  bestFitType: MBTIType;
}

const ALL_FUNCTIONS: CognitiveFunction[] = [
  "Ni",
  "Ne",
  "Si",
  "Se",
  "Ti",
  "Te",
  "Fi",
  "Fe",
];

/*
  Weight assigned to each position in the theoretical stack:

  Dominant  = 42%
  Auxiliary = 28%
  Tertiary  = 15%
  Inferior  = 5%

  Additional 10% rewards preserving the relative order
  of the four stack functions.
*/
const POSITION_WEIGHTS = [0.42, 0.28, 0.15, 0.05] as const;

const RANK_CENTERS = [1.0, 2.5, 4.5, 7.0] as const;

const RANK_SIGMAS = [1.0, 1.3, 1.5, 1.5] as const;

const POSITION_MIX = {
  strength: 0.55,
  rank: 0.45,
} as const;

const ORDER_WEIGHT = 0.1;

const COMPETITION_PENALTY_WEIGHT = 0.15;

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeFunctionScore(score: number): number {
  return clamp((score - 1) / 4);
}

function getAverageRanks(
  functionScores: FunctionScores,
): Record<CognitiveFunction, number> {
  const sorted = [...ALL_FUNCTIONS].sort(
    (a, b) => functionScores[b] - functionScores[a],
  );
  const ranks = {} as Record<CognitiveFunction, number>;
  let index = 0;
  while (index < sorted.length) {
    let end = index + 1;
    while (
      end < sorted.length &&
      functionScores[sorted[end]] === functionScores[sorted[index]]
    ) {
      end += 1;
    }
    const averageRank = (index + 1 + end) / 2;
    for (let i = index; i < end; i += 1) {
      ranks[sorted[i]] = averageRank;
    }
    index = end;
  }
  return ranks;
}

function getRankFit(actualRank: number, stackPosition: number): number {
  const center = RANK_CENTERS[stackPosition];
  const sigma = RANK_SIGMAS[stackPosition];
  return Math.exp(-((actualRank - center) ** 2) / (2 * sigma ** 2));
}

function getStrengthFit(
  normalizedStrength: number,
  stackPosition: number,
): number {
  switch (stackPosition) {
    case 0:
      return normalizedStrength;
    case 1:
      return normalizedStrength;
    case 2:
      return clamp(1 - 2 * Math.abs(normalizedStrength - 0.5));
    case 3:
      return 1 - normalizedStrength;
    default:
      return 0;
  }
}

function getPositionFit(
  functionScore: number,
  actualRank: number,
  stackPosition: number,
): number {
  const normalizedStrength = normalizeFunctionScore(functionScore);
  const strengthFit = getStrengthFit(normalizedStrength, stackPosition);
  const rankFit = getRankFit(actualRank, stackPosition);
  return POSITION_MIX.strength * strengthFit + POSITION_MIX.rank * rankFit;
}

function getOrderFit(
  stack: TypeStack,
  ranks: Record<CognitiveFunction, number>,
): number {
  let inversions = 0;
  for (let i = 0; i < stack.length; i += 1) {
    for (let j = i + 1; j < stack.length; j += 1) {
      if (ranks[stack[i]] > ranks[stack[j]]) {
        inversions += 1;
      }
    }
  }
  return 1 - inversions / 6;
}

function getCompetitionPenalty(
  stack: TypeStack,
  functionScores: FunctionScores,
): number {
  const auxiliaryStrength = normalizeFunctionScore(functionScores[stack[1]]);
  const strongestNonStackFunction = ALL_FUNCTIONS.filter(
    (fn) => !(stack as readonly CognitiveFunction[]).includes(fn),
  ).reduce(
    (max, fn) => Math.max(max, normalizeFunctionScore(functionScores[fn])),
    0,
  );
  const excess = Math.max(0, strongestNonStackFunction - auxiliaryStrength);
  return COMPETITION_PENALTY_WEIGHT * excess;
}

export function calculateTypeCompatibility(
  functionScores: FunctionScores,
  typeStacks: TypeStacks,
): TypeCompatibilityResult {
  const ranks = getAverageRanks(functionScores);
  const rankedTypes = (
    Object.entries(typeStacks) as [MBTIType, TypeStack][]
  )
    .map(([type, stack]) => {
      const positionScores = [
        getPositionFit(functionScores[stack[0]], ranks[stack[0]], 0),
        getPositionFit(functionScores[stack[1]], ranks[stack[1]], 1),
        getPositionFit(functionScores[stack[2]], ranks[stack[2]], 2),
        getPositionFit(functionScores[stack[3]], ranks[stack[3]], 3),
      ] as const;
      const orderFit = getOrderFit(stack, ranks);
      const competitionPenalty = getCompetitionPenalty(stack, functionScores);
      const rawScore = clamp(
        POSITION_WEIGHTS[0] * positionScores[0] +
          POSITION_WEIGHTS[1] * positionScores[1] +
          POSITION_WEIGHTS[2] * positionScores[2] +
          POSITION_WEIGHTS[3] * positionScores[3] +
          ORDER_WEIGHT * orderFit -
          competitionPenalty,
      );
      return {
        type,
        compatibility: Math.round(rawScore * 100),
        rawScore: Number(rawScore.toFixed(4)),
        dominantFunction: stack[0],
        positionScores: {
          dominant: Number(positionScores[0].toFixed(4)),
          auxiliary: Number(positionScores[1].toFixed(4)),
          tertiary: Number(positionScores[2].toFixed(4)),
          inferior: Number(positionScores[3].toFixed(4)),
        },
        orderFit: Number(orderFit.toFixed(4)),
        competitionPenalty: Number(competitionPenalty.toFixed(4)),
      };
    })
    .sort((a, b) => b.rawScore - a.rawScore);
  return { rankedTypes, bestFitType: rankedTypes[0].type };
}
