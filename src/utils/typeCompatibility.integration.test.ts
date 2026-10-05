import { describe, expect, it } from "vitest";
import cognitiveFunctionQuestions from "@/src/data/cognitiveFunctionQuestions";
import { scoreAnswers } from "@/src/utils/cognitiveFunctionScoring";

describe("Type compatibility integration", () => {
  it("scoreAnswers returns typeCompatibility", () => {
    const answers = Object.fromEntries(
      cognitiveFunctionQuestions.map((question) => [question.id, 3]),
    );

    const result = scoreAnswers(answers);

    expect("errors" in result).toBe(false);

    if ("errors" in result) return;

    expect(result.typeCompatibility).toBeDefined();
  });

  it("returns all 16 MBTI types", () => {
    const answers = Object.fromEntries(
      cognitiveFunctionQuestions.map((question) => [question.id, 3]),
    );

    const result = scoreAnswers(answers);

    expect("errors" in result).toBe(false);

    if ("errors" in result) return;

    expect(result.typeCompatibility.rankedTypes).toHaveLength(16);
    expect(result.typeCompatibility.rankedTypes.map((item) => item.type))
      .toHaveLength(16);
    expect(
      new Set(
        result.typeCompatibility.rankedTypes.map((item) => item.type),
      ).size,
    ).toBe(16);
  });

  it("rankedTypes are sorted descending by compatibility", () => {
    const answers = Object.fromEntries(
      cognitiveFunctionQuestions.map((question) => [question.id, 3]),
    );

    const result = scoreAnswers(answers);

    expect("errors" in result).toBe(false);

    if ("errors" in result) return;

    const ranked = result.typeCompatibility.rankedTypes;

    for (let i = 1; i < ranked.length; i += 1) {
      expect(ranked[i - 1].compatibility).toBeGreaterThanOrEqual(
        ranked[i].compatibility,
      );
    }
  });

  it("compatibility values are between 0 and 100", () => {
    const answers = Object.fromEntries(
      cognitiveFunctionQuestions.map((question) => [question.id, 3]),
    );

    const result = scoreAnswers(answers);

    expect("errors" in result).toBe(false);

    if ("errors" in result) return;

    for (const item of result.typeCompatibility.rankedTypes) {
      expect(item.compatibility).toBeGreaterThanOrEqual(0);
      expect(item.compatibility).toBeLessThanOrEqual(100);
    }
  });
});
