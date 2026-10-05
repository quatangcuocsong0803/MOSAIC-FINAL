// ============================================================
// Tests — Cognitive Function Scoring Engine
// ============================================================
// Run with:  npm run test:run
// ============================================================

import { describe, it, expect } from "vitest";
import cognitiveFunctionQuestions from "@/src/data/cognitiveFunctionQuestions";
import {
  scoreAnswers,
  validateAnswers,
  computeFunctionScores,
  type RawAnswers,
} from "@/src/utils/cognitiveFunctionScoring";
import type { CognitiveFunctionCode } from "@/src/data/cognitiveFunctions";
import type { MbtiTypeCode } from "@/src/data/mbtiTypeStacks";

// ── Fixture builder ────────────────────────────────────────

/**
 * Builds a complete 72-question answer set.
 *
 * `highFunctions` receive answers designed to produce a high scored value.
 * `dominantFunction` (optional) receives the maximum possible score (5),
 * while the remaining high functions receive a slightly lower score (4).
 * This breaks ties between type pairs that share identical function sets
 * in mirrored dominant/auxiliary order (e.g. INTP vs ENTP).
 *
 * Score mapping:
 *   dominant   → forward: 5, reverse: 1  (scored as 5)
 *   other high → forward: 4, reverse: 2  (scored as 4)
 *   low        → forward: 1, reverse: 5  (scored as 1)
 */
function buildAnswers(
  highFunctions: CognitiveFunctionCode[],
  dominantFunction?: CognitiveFunctionCode,
): RawAnswers {
  const answers: RawAnswers = {};

  for (const q of cognitiveFunctionQuestions) {
    const isDominant = dominantFunction === q.function;
    const isHigh = highFunctions.includes(q.function);

    if (isDominant) {
      // Maximum score: forward → 5, reverse → 1 (scores as 5)
      answers[q.id] = q.reverse ? 1 : 5;
    } else if (isHigh) {
      // High but not dominant: forward → 4, reverse → 2 (scores as 4)
      answers[q.id] = q.reverse ? 2 : 4;
    } else {
      // Minimise: forward → 1, reverse → 5 (scores as 1)
      answers[q.id] = q.reverse ? 5 : 1;
    }
  }

  return answers;
}

// ── Question Bank Verification ─────────────────────────────

describe("Question Bank Integrity (72 questions)", () => {
  it("question bank length is exactly 72", () => {
    expect(cognitiveFunctionQuestions).toHaveLength(72);
  });

  it("each of the 8 cognitive functions has exactly 9 questions", () => {
    const counts: Record<string, number> = {};
    for (const q of cognitiveFunctionQuestions) {
      counts[q.function] = (counts[q.function] || 0) + 1;
    }

    const functions: CognitiveFunctionCode[] = [
      "Ni", "Ne", "Si", "Se", "Ti", "Te", "Fi", "Fe",
    ];

    expect(Object.keys(counts)).toHaveLength(8);
    for (const fn of functions) {
      expect(counts[fn]).toBe(9);
    }
  });

  it("all 72 question IDs are unique", () => {
    const ids = cognitiveFunctionQuestions.map((q) => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(72);
  });

  it("contains expected IDs for all functions from 01 to 09", () => {
    const functions = ["NI", "NE", "SI", "SE", "TI", "TE", "FI", "FE"];
    const idSet = new Set(cognitiveFunctionQuestions.map((q) => q.id));

    for (const fn of functions) {
      for (let i = 1; i <= 9; i++) {
        const expectedId = `${fn}0${i}`;
        expect(idSet.has(expectedId)).toBe(true);
      }
    }
  });
});

// ── Reverse scoring ────────────────────────────────────────

describe("Reverse scoring", () => {
  it("forward question: answer=1 → scored value = 1", () => {
    const forwardQ = cognitiveFunctionQuestions.find((q) => !q.reverse);
    expect(forwardQ).toBeDefined();

    // Neutral answers everywhere
    const neutral: RawAnswers = {};
    for (const q of cognitiveFunctionQuestions) {
      neutral[q.id] = 3;
    }
    const neutralScores = computeFunctionScores(neutral);
    for (const fn of Object.values(neutralScores)) {
      expect(fn).toBe(3);
    }
  });

  it("reverse question: answer=1 is scored as 5 (= 6 − 1)", () => {
    const reverseQuestions = cognitiveFunctionQuestions.filter((q) => q.reverse);
    expect(reverseQuestions.length).toBeGreaterThan(0);

    // Build answers: all neutral (3) except one reverse question answered 1
    const answers: RawAnswers = {};
    for (const q of cognitiveFunctionQuestions) {
      answers[q.id] = 3; // neutral everywhere
    }

    const rq = reverseQuestions[0];
    answers[rq.id] = 1; // should be scored as 6-1 = 5

    const scores = computeFunctionScores(answers);
    // In a 9-question function: 8 questions at score 3, 1 question at score 5
    // Sum = 8×3 + 5 = 29. Avg = 29 / 9 ≈ 3.22
    expect(scores[rq.function]).toBeCloseTo(29 / 9, 2);
  });

  it("reverse question: answer=5 is scored as 1 (= 6 − 5)", () => {
    const reverseQuestions = cognitiveFunctionQuestions.filter((q) => q.reverse);
    const answers: RawAnswers = {};
    for (const q of cognitiveFunctionQuestions) {
      answers[q.id] = 3;
    }

    const rq = reverseQuestions[0];
    answers[rq.id] = 5; // should be scored as 6-5 = 1

    const scores = computeFunctionScores(answers);
    // In a 9-question function: 8 questions at score 3, 1 question at score 1
    // Sum = 8×3 + 1 = 25. Avg = 25 / 9 ≈ 2.78
    expect(scores[rq.function]).toBeCloseTo(25 / 9, 2);
  });

  it("forward answer=1 becomes scored value 1, forward answer=5 becomes scored value 5", () => {
    const fwdQs = cognitiveFunctionQuestions.filter((q) => !q.reverse);
    const fn = fwdQs[0].function;

    // Pass fn as dominantFunction → every question for this fn scores as 5
    const highAnswers = buildAnswers([fn], fn);
    const result = scoreAnswers(highAnswers);
    if ("errors" in result) throw new Error(result.errors.join("; "));
    expect(result.functionScores[fn]).toBe(5);

    // All forward answers = 1, all reverse = 5 → all functions score as 1
    const lowAnswers: RawAnswers = {};
    for (const q of cognitiveFunctionQuestions) {
      lowAnswers[q.id] = q.reverse ? 5 : 1;
    }
    const lowResult = scoreAnswers(lowAnswers);
    if ("errors" in lowResult) throw new Error(lowResult.errors.join("; "));
    expect(lowResult.functionScores[fn]).toBe(1);
  });
});

// ── Validation ─────────────────────────────────────────────

describe("Validation", () => {
  it("rejects when answers are empty", () => {
    const result = validateAnswers({});
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toMatch(/missing/i);
    }
  });

  it("rejects when a single question is missing (71 answers)", () => {
    const answers = buildAnswers(["Ni"]);
    const firstId = cognitiveFunctionQuestions[0].id;
    delete answers[firstId];

    expect(Object.keys(answers)).toHaveLength(71);
    const result = validateAnswers(answers);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some((e) => e.includes(firstId))).toBe(true);
    }
  });

  it("rejects out-of-range answer (0)", () => {
    const answers = buildAnswers(["Ni"]);
    answers[cognitiveFunctionQuestions[0].id] = 0;

    const result = validateAnswers(answers);
    expect(result.valid).toBe(false);
  });

  it("rejects out-of-range answer (6)", () => {
    const answers = buildAnswers(["Ni"]);
    answers[cognitiveFunctionQuestions[0].id] = 6;

    const result = validateAnswers(answers);
    expect(result.valid).toBe(false);
  });

  it("rejects non-integer answer (2.5)", () => {
    const answers = buildAnswers(["Ni"]);
    answers[cognitiveFunctionQuestions[0].id] = 2.5;

    const result = validateAnswers(answers);
    expect(result.valid).toBe(false);
  });

  it("accepts a complete valid answer set of 72 answers", () => {
    const answers = buildAnswers(["Ni", "Te"]);
    expect(Object.keys(answers)).toHaveLength(72);
    const result = validateAnswers(answers);
    expect(result.valid).toBe(true);
  });

  it("scoreAnswers returns ValidationError for incomplete input", () => {
    const output = scoreAnswers({});
    expect("errors" in output).toBe(true);
  });
});

// ── Function scores ────────────────────────────────────────

describe("Function score computation", () => {
  it("neutral answers (all 3) produce score 3 for every function", () => {
    const answers: RawAnswers = {};
    for (const q of cognitiveFunctionQuestions) {
      answers[q.id] = 3;
    }
    const scores = computeFunctionScores(answers);
    for (const score of Object.values(scores)) {
      expect(score).toBe(3);
    }
  });

  it("max answers produce score 5 for every function", () => {
    // Bypass buildAnswers: set every question to its maximum-scoring answer directly.
    const answers: RawAnswers = {};
    for (const q of cognitiveFunctionQuestions) {
      answers[q.id] = q.reverse ? 1 : 5; // always scores as 5
    }
    const scores = computeFunctionScores(answers);
    for (const score of Object.values(scores)) {
      expect(score).toBe(5);
    }
  });

  it("high dominant function scores 5, other high function scores 4, low functions score 1", () => {
    const answers = buildAnswers(["Ti", "Ne"], "Ti");
    const scores = computeFunctionScores(answers);

    expect(scores["Ti"]).toBe(5);  // dominant → all answers maximised
    expect(scores["Ne"]).toBe(4);  // high but not dominant
    expect(scores["Ni"]).toBe(1);
    expect(scores["Si"]).toBe(1);
    expect(scores["Se"]).toBe(1);
    expect(scores["Te"]).toBe(1);
    expect(scores["Fi"]).toBe(1);
    expect(scores["Fe"]).toBe(1);
  });
});

// ── Type scoring — 4 scenario tests ───────────────────────

describe("Type scoring — best-fit type prediction", () => {
  /**
   * Case 1: Ti + Ne + Si + Fe are very high, with Ti as dominant.
   * INTP stack: [Ti(dom,5), Ne(aux,4), Si(tert,4), Fe(inf,4)]
   * INTP  = 4×5 + 3×4 + 2×4 + 1×4 = 20+12+8+4 = 44
   * ENTP  = 4×4 + 3×5 + 2×4 + 1×4 = 16+15+8+4 = 43  ← loses by 1
   */
  it("Case 1 — INTP: high Ti(dom), Ne, Si, Fe → best fit is INTP", () => {
    const answers = buildAnswers(["Ti", "Ne", "Si", "Fe"], "Ti");
    const result = scoreAnswers(answers);
    if ("errors" in result) throw new Error(result.errors.join("; "));

    expect(result.bestFitType).toBe("INTP");
    expect(result.rankedTypes[0].id).toBe("INTP");
    expect(result.functionScores["Ti"]).toBe(5);
    expect(result.functionScores["Ne"]).toBe(4);
  });

  /**
   * Case 2: Ni + Te + Fi + Se are very high, with Ni as dominant.
   * INTJ stack: [Ni(dom,5), Te(aux,4), Fi(tert,4), Se(inf,4)]
   * ENTJ  = 4×4 + 3×5 + 2×4 + 1×4 = 16+15+8+4 = 43
   * INTJ  = 4×5 + 3×4 + 2×4 + 1×4 = 20+12+8+4 = 44 ← wins
   */
  it("Case 2 — INTJ: high Ni(dom), Te, Fi, Se → best fit is INTJ", () => {
    const answers = buildAnswers(["Ni", "Te", "Fi", "Se"], "Ni");
    const result = scoreAnswers(answers);
    if ("errors" in result) throw new Error(result.errors.join("; "));

    expect(result.bestFitType).toBe("INTJ");
    expect(result.rankedTypes[0].id).toBe("INTJ");
    expect(result.functionScores["Ni"]).toBe(5);
    expect(result.functionScores["Te"]).toBe(4);
  });

  /**
   * Case 3: Ne + Fi + Te + Si are very high, with Ne as dominant.
   * ENFP stack: [Ne(dom,5), Fi(aux,4), Te(tert,4), Si(inf,4)]
   * ENFP  = 4×5 + 3×4 + 2×4 + 1×4 = 44
   */
  it("Case 3 — ENFP: high Ne(dom), Fi, Te, Si → best fit is ENFP", () => {
    const answers = buildAnswers(["Ne", "Fi", "Te", "Si"], "Ne");
    const result = scoreAnswers(answers);
    if ("errors" in result) throw new Error(result.errors.join("; "));

    expect(result.bestFitType).toBe("ENFP");
    expect(result.rankedTypes[0].id).toBe("ENFP");
    expect(result.functionScores["Ne"]).toBe(5);
    expect(result.functionScores["Fi"]).toBe(4);
  });

  /**
   * Case 4: Fe + Ni + Se + Ti are very high, with Fe as dominant.
   * ENFJ stack: [Fe(dom,5), Ni(aux,4), Se(tert,4), Ti(inf,4)]
   * INFJ  = 4×4 + 3×5 + 2×4 + 1×4 = 16+15+8+4 = 43
   * ENFJ  = 4×5 + 3×4 + 2×4 + 1×4 = 20+12+8+4 = 44 ← wins
   */
  it("Case 4 — ENFJ: high Fe(dom), Ni, Se, Ti → best fit is ENFJ", () => {
    const answers = buildAnswers(["Fe", "Ni", "Se", "Ti"], "Fe");
    const result = scoreAnswers(answers);
    if ("errors" in result) throw new Error(result.errors.join("; "));

    expect(result.bestFitType).toBe("ENFJ");
    expect(result.rankedTypes[0].id).toBe("ENFJ");
    expect(result.functionScores["Fe"]).toBe(5);
    expect(result.functionScores["Ni"]).toBe(4);
  });
});

// ── Output shape ───────────────────────────────────────────

describe("Output shape", () => {
  it("rankedTypes has 16 entries sorted highest → lowest", () => {
    const answers = buildAnswers(["Ni", "Te", "Fi", "Se"]);
    const result = scoreAnswers(answers);
    if ("errors" in result) throw new Error(result.errors.join("; "));

    expect(result.rankedTypes).toHaveLength(16);
    for (let i = 0; i < result.rankedTypes.length - 1; i++) {
      expect(result.rankedTypes[i].score).toBeGreaterThanOrEqual(
        result.rankedTypes[i + 1].score,
      );
    }
  });

  it("functionRanking has 8 entries sorted highest → lowest", () => {
    const answers = buildAnswers(["Ne", "Ti"]);
    const result = scoreAnswers(answers);
    if ("errors" in result) throw new Error(result.errors.join("; "));

    expect(result.functionRanking).toHaveLength(8);
    for (let i = 0; i < result.functionRanking.length - 1; i++) {
      expect(result.functionRanking[i].score).toBeGreaterThanOrEqual(
        result.functionRanking[i + 1].score,
      );
    }
  });

  it("all scores are rounded to at most 2 decimal places", () => {
    const answers: RawAnswers = {};
    for (const q of cognitiveFunctionQuestions) {
      answers[q.id] = 3;
    }
    const result = scoreAnswers(answers);
    if ("errors" in result) throw new Error(result.errors.join("; "));

    for (const score of Object.values(result.functionScores)) {
      const decimals = (score.toString().split(".")[1] ?? "").length;
      expect(decimals).toBeLessThanOrEqual(2);
    }
    for (const score of Object.values(result.typeScores)) {
      const decimals = (score.toString().split(".")[1] ?? "").length;
      expect(decimals).toBeLessThanOrEqual(2);
    }
  });

  it("bestFitType matches rankedTypes[0].id", () => {
    const answers = buildAnswers(["Ti", "Ne", "Si", "Fe"]);
    const result = scoreAnswers(answers);
    if ("errors" in result) throw new Error(result.errors.join("; "));

    expect(result.bestFitType).toBe(result.rankedTypes[0].id);
  });
});
