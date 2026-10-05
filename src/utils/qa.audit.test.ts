import { describe, expect, it } from "vitest";
import { enneagramQuestions } from "../data/enneagramQuestions";
import { enneagramInstinctQuestions } from "../data/enneagramInstinctQuestions";

describe("MOSAIC Enneagram QA audit", () => {
  it("has 52 core questions", () => {
    expect(enneagramQuestions).toHaveLength(52);
  });

  it("has 18 instinct questions", () => {
    expect(enneagramInstinctQuestions).toHaveLength(14);
  });

  it("has globally unique ids", () => {
    const ids = [
      ...enneagramQuestions.map((q) => q.id),
      ...enneagramInstinctQuestions.map((q) => q.id),
    ];

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has no self-contrasts", () => {
    for (const question of enneagramQuestions) {
      expect(question.agreeType).not.toBe(
        question.disagreeType,
      );
    }

    for (const question of enneagramInstinctQuestions) {
      expect(question.agreeInstinct).not.toBe(
        question.disagreeInstinct,
      );
    }
  });

  it("keeps type labels out of visible questions", () => {
    const visibleText = [
      ...enneagramQuestions.map((q) => q.text),
      ...enneagramInstinctQuestions.map((q) => q.text),
    ].join(" ");

    for (const label of [
      "Type 1",
      "Type 2",
      "Type 3",
      "Type 4",
      "Type 5",
      "Type 6",
      "Type 7",
      "Type 8",
      "Type 9",
    ]) {
      expect(visibleText).not.toContain(label);
    }
  });

  it("keeps the nine type labels represented in the scoring graph", () => {
    const represented = new Set<number>();

    for (const question of enneagramQuestions) {
      represented.add(question.agreeType);
      represented.add(question.disagreeType);
    }

    expect(represented).toEqual(
      new Set([1,2,3,4,5,6,7,8,9]),
    );
  });
});
