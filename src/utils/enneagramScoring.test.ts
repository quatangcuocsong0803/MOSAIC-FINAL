import { describe, expect, it } from "vitest";
import {
  enneagramQuestions,
  type EnneagramType,
} from "../data/enneagramQuestions";
import { scoreEnneagram } from "./enneagramScoring";

const types: EnneagramType[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

describe("Enneagram core scoring", () => {
  it("contains exactly 52 core questions", () => {
    expect(enneagramQuestions).toHaveLength(52);
  });

  it("contains all nine types in the scoring blueprint", () => {
    const participatingTypes = new Set<EnneagramType>();

    for (const question of enneagramQuestions) {
      participatingTypes.add(question.agreeType);
      participatingTypes.add(question.disagreeType);
    }

    expect(participatingTypes.size).toBe(9);
  });

  it("keeps neutral responses neutral", () => {
    const answers = Object.fromEntries(
      enneagramQuestions.map((question) => [
        question.id,
        3,
      ]),
    );

    const result = scoreEnneagram(answers);

    expect("errors" in result).toBe(false);

    if ("errors" in result) return;

    for (const type of types) {
      expect(result.rawScores[type]).toBe(0);
      expect(result.typeScores[type]).toBe(50);
    }
  });

  it.each(types)(
    "recovers a synthetic type-%s profile",
    (targetType) => {
      const answers = Object.fromEntries(
        enneagramQuestions.map((question) => {
          if (question.agreeType === targetType) {
            return [question.id, 5];
          }

          if (question.disagreeType === targetType) {
            return [question.id, 1];
          }

          return [question.id, 3];
        }),
      );

      const result = scoreEnneagram(answers);

      expect("errors" in result).toBe(false);

      if ("errors" in result) return;

      expect(result.coreType).toBe(targetType);
      expect(result.typeScores[targetType]).toBe(100);
      expect(result.wing).toBeDefined();
      expect(result.certainty.level).toBe("high");
      expect(result.tritype.code).toHaveLength(3);
    },
  );

  it("normalizes for unequal type exposure", () => {
    const answers = Object.fromEntries(
      enneagramQuestions.map((question) => [
        question.id,
        3,
      ]),
    );

    const result = scoreEnneagram(answers);

    expect("errors" in result).toBe(false);

    if ("errors" in result) return;

    const exposureValues = types.map(
      (type) => result.exposures[type],
    );

    expect(
      Math.max(...exposureValues) -
        Math.min(...exposureValues),
    ).toBeLessThanOrEqual(2);
  });

  it("rejects incomplete answers", () => {
    expect("errors" in scoreEnneagram({})).toBe(true);
  });
});
