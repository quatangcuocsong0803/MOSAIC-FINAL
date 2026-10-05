import type { CognitiveFunction } from "./cognitive-open-questions";

export type CognitiveEvidence = {
  construct: CognitiveFunction;
  support: number;
  confidence: number;
};

export type AggregatedCognitiveEvidence = {
  construct: CognitiveFunction;
  support: number;
  evidenceMass: number;
  answerCount: number;
};

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

function clamp01(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

export function aggregateCognitiveEvidence(
  answers: CognitiveEvidence[][]
): AggregatedCognitiveEvidence[] {
  return FUNCTIONS.map((construct) => {
    let weightedSupport = 0;
    let totalConfidence = 0;
    let answerCount = 0;

    for (const answerEvidence of answers) {
      const item = answerEvidence.find(
        (evidence) => evidence.construct === construct
      );

      if (!item) {
        continue;
      }

      const support = clamp01(item.support);
      const confidence = clamp01(item.confidence);

      /*
       * Confidence acts as the weight.
       *
       * Example:
       * support 0.8 / confidence 0.9
       * matters much more than
       * support 0.8 / confidence 0.1.
       */
      weightedSupport += support * confidence;
      totalConfidence += confidence;
      answerCount += 1;
    }

    const support =
      totalConfidence > 0
        ? weightedSupport / totalConfidence
        : 0;

    return {
      construct,
      support: Number(support.toFixed(4)),
      evidenceMass: Number(totalConfidence.toFixed(4)),
      answerCount,
    };
  });
}