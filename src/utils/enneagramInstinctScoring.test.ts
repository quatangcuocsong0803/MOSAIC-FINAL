import { describe, expect, it } from "vitest";
import {
  enneagramInstinctQuestions,
  type InstinctualVariant,
} from "../data/enneagramInstinctQuestions";
import { scoreInstincts } from "./enneagramInstinctScoring";

const instincts: InstinctualVariant[] = ["sp", "sx", "so"];

function neutralAnswers(): Record<string, number> {
  return Object.fromEntries(
    enneagramInstinctQuestions.map((question) => [
      question.id,
      3,
    ]),
  );
}

function answersForTarget(
  target: InstinctualVariant,
): Record<string, number> {
  return Object.fromEntries(
    enneagramInstinctQuestions.map((question) => [
      question.id,
      question.agreeInstinct === target ? 5 : 1,
    ]),
  );
}

describe("Enneagram instinct contrast scoring", () => {
  it("contains 14 instinct questions", () => {
    expect(enneagramInstinctQuestions).toHaveLength(14);
  });

  it("covers all three instinct pair comparisons with the intended distribution", () => {
    const groups = new Map<string, number>();

    for (const question of enneagramInstinctQuestions) {
      const pair = [
        question.agreeInstinct,
        question.disagreeInstinct,
      ].sort().join("↔");

      groups.set(pair, (groups.get(pair) ?? 0) + 1);
    }

    expect(groups.size).toBe(3);
    expect(groups.get(["so", "sp"].sort().join("↔"))).toBe(5);
    expect(groups.get(["so", "sx"].sort().join("↔"))).toBe(5);
    expect(groups.get(["sp", "sx"].sort().join("↔"))).toBe(4);
  });

  it("uses every instinct in the item bank", () => {
    const seen = new Set<InstinctualVariant>();

    for (const question of enneagramInstinctQuestions) {
      seen.add(question.agreeInstinct);
      seen.add(question.disagreeInstinct);
    }

    expect([...seen].sort()).toEqual(
      [...instincts].sort(),
    );
  });

  it("gives a neutral instinct profile for neutral responses", () => {
    const result = scoreInstincts(neutralAnswers());

    expect("errors" in result).toBe(false);

    if ("errors" in result) return;

    expect(result.instinctScores.sp).toBe(50);
    expect(result.instinctScores.sx).toBe(50);
    expect(result.instinctScores.so).toBe(50);

    expect(result.rankedInstincts.map((item) => item.instinct))
      .toEqual(["sp", "sx", "so"]);
  });

  it("can recover a deliberate sp-first synthetic pattern", () => {
    const result = scoreInstincts(answersForTarget("sp"));

    expect("errors" in result).toBe(false);

    if ("errors" in result) return;

    expect(result.instinctualStack[0]).toBe("sp");
    expect(result.instinctScores.sp).toBeGreaterThan(
      result.instinctScores.sx,
    );
    expect(result.instinctScores.sp).toBeGreaterThan(
      result.instinctScores.so,
    );
  });

  it("can recover a deliberate sx-first synthetic pattern", () => {
    const result = scoreInstincts(answersForTarget("sx"));

    expect("errors" in result).toBe(false);

    if ("errors" in result) return;

    expect(result.instinctualStack[0]).toBe("sx");
    expect(result.instinctScores.sx).toBeGreaterThan(
      result.instinctScores.sp,
    );
    expect(result.instinctScores.sx).toBeGreaterThan(
      result.instinctScores.so,
    );
  });

  it("can recover a deliberate so-first synthetic pattern", () => {
    const result = scoreInstincts(answersForTarget("so"));

    expect("errors" in result).toBe(false);

    if ("errors" in result) return;

    expect(result.instinctualStack[0]).toBe("so");
    expect(result.instinctScores.so).toBeGreaterThan(
      result.instinctScores.sp,
    );
    expect(result.instinctScores.so).toBeGreaterThan(
      result.instinctScores.sx,
    );
  });

  it("rejects incomplete responses", () => {
    const answers = neutralAnswers();
    delete answers[enneagramInstinctQuestions[0].id];

    const result = scoreInstincts(answers);

    expect("errors" in result).toBe(true);

    if (!("errors" in result)) return;

    expect(result.errors.length).toBeGreaterThan(0);
  });
});
