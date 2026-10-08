import { expect, it } from "vitest";
import {
  INTERESTS,
  INTEREST_CODES,
  interestLabels,
  interestSearch,
} from "../interests";
import { validateExtraTypology } from "../typology";
it("keeps interest codes unique and searches Vietnamese without accents", () => {
  expect(INTEREST_CODES.size).toBe(INTERESTS.length);
  expect(INTERESTS.length).toBeGreaterThan(90);
  expect(interestLabels(["reading", "chess"])).toBe("Đọc sách, Cờ vua");
  expect(interestSearch("Đọc sách")).toBe("doc sach");
});
it("validates manual typology values on the server", () => {
  expect(
    validateExtraTypology({
      socionicsType: "LII",
      moralAlignment: "True Neutral",
      temperament: null,
    }),
  ).toEqual({
    socionicsType: "LII",
    moralAlignment: "True Neutral",
    temperament: null,
  });
  expect(() => validateExtraTypology({ temperament: "not valid" })).toThrow();
});
