import { describe, expect, it } from "vitest";
import { enneagramQuestions } from "../data/enneagramQuestions";
import { enneagramInstinctQuestions } from "../data/enneagramInstinctQuestions";
import { scoreEnneagramAssessment } from "./enneagramAssessmentScoring";

describe("combined Enneagram assessment", () => {
  it("combines 52 core and 18 instinct questions", () => {
    const answers = Object.fromEntries([
      ...enneagramQuestions.map((q) => [q.id, 3]),
      ...enneagramInstinctQuestions.map((q) => [
        q.id,
        3,
      ]),
    ]);

    const result = scoreEnneagramAssessment(answers);

    expect("errors" in result).toBe(false);

    if ("errors" in result) return;

    expect(result.coreType).toBe(1);
    expect(result.typeScores[1]).toBe(50);
    expect(result.certainty.level).toBe("low");
    expect(result.wing).toBeDefined();
    expect(result.wingStrength).toBe(0);
    expect(result.tritype.code).toHaveLength(3);
    expect(result.instinctualStack).toHaveLength(3);
  });

  it("requires both core and instinct sections", () => {
    expect(
      "errors" in
        scoreEnneagramAssessment({}),
    ).toBe(true);
  });

  it("returns a single complete result object", () => {
    const answers = Object.fromEntries([
      ...enneagramQuestions.map((q) => [q.id, 3]),
      ...enneagramInstinctQuestions.map((q) => [
        q.id,
        3,
      ]),
    ]);

    const result = scoreEnneagramAssessment(answers);

    expect("errors" in result).toBe(false);

    if ("errors" in result) return;

    expect(result).toHaveProperty("coreType");
    expect(result).toHaveProperty("wing");
    expect(result).toHaveProperty("wingStrength");
    expect(result).toHaveProperty("certainty");
    expect(result).toHaveProperty("tritype");
    expect(result).toHaveProperty("instinctualStack");
  });
});
