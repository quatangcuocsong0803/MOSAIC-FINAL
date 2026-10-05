import { describe, it, expect } from "vitest";
import { calculateTypeCompatibility } from "@/src/utils/typeCompatibility";

describe("Manual compatibility calculation check", () => {
  it("calculates a fixed profile deterministically", () => {
    const functionScores = {
      Ni: 5.0,
      Ne: 4.2,
      Si: 2.3,
      Se: 1.4,
      Ti: 4.6,
      Te: 3.8,
      Fi: 4.9,
      Fe: 2.0,
    };

    const typeStacks = {
      INTJ: ["Ni", "Te", "Fi", "Se"],
      INTP: ["Ti", "Ne", "Si", "Fe"],
      ENTJ: ["Te", "Ni", "Se", "Fi"],
      ENTP: ["Ne", "Ti", "Fe", "Si"],
      INFJ: ["Ni", "Fe", "Ti", "Se"],
      INFP: ["Fi", "Ne", "Si", "Te"],
      ENFJ: ["Fe", "Ni", "Se", "Ti"],
      ENFP: ["Ne", "Fi", "Te", "Si"],
      ISTJ: ["Si", "Te", "Fi", "Ne"],
      ISFJ: ["Si", "Fe", "Ti", "Ne"],
      ESTJ: ["Te", "Si", "Ne", "Fi"],
      ESFJ: ["Fe", "Si", "Ne", "Ti"],
      ISTP: ["Ti", "Se", "Ni", "Fe"],
      ISFP: ["Fi", "Se", "Ni", "Te"],
      ESTP: ["Se", "Ti", "Fe", "Ni"],
      ESFP: ["Se", "Fi", "Te", "Ni"],
    } as const;

    const result = calculateTypeCompatibility(functionScores, typeStacks);

    expect(result.rankedTypes).toHaveLength(16);
    expect(result.bestFitType).toBe(result.rankedTypes[0].type);

    console.log("\nBEST FIT:", result.bestFitType);
    console.table(
      result.rankedTypes.map((item) => ({
        type: item.type,
        compatibility: item.compatibility,
        rawScore: item.rawScore,
        dominant: item.dominantFunction,
        orderFit: item.orderFit,
        penalty: item.competitionPenalty,
      })),
    );
  });
});
