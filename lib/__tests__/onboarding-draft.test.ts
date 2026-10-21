import { expect, it } from "vitest";
import { validateOnboardingDraft } from "../onboarding-validation";
import { INTEREST_GROUPS } from "../interests";
it("validates the whole draft before any checkpoint write", () => {
  expect(() =>
    validateOnboardingDraft({ username: "user", displayName: "U" }, {}, true),
  ).toThrow();
  expect(() =>
    validateOnboardingDraft({ dateOfBirth: "2000-02-31" }, {}, false),
  ).toThrow();
  expect(() =>
    validateOnboardingDraft({}, { mbtiType: "fake" }, false),
  ).toThrow();
  expect(() =>
    validateOnboardingDraft(
      {},
      { enneagramCore: "4", enneagramWing: "4w1" },
      false,
    ),
  ).toThrow();
  expect(() =>
    validateOnboardingDraft(
      {
        interestCodes: INTEREST_GROUPS.flatMap((g) =>
          g.items.map(([c]) => c),
        ).slice(0, 8),
      },
      {},
      false,
    ),
  ).toThrow("7");
  expect(
    validateOnboardingDraft(
      { username: "USER", displayName: "Member", dateOfBirth: "2000-01-01" },
      { mbtiType: "INFP", enneagramCore: "4", enneagramWing: "4w5" },
      true,
    ),
  ).toMatchObject({
    username: "user",
    confirmedMbtiType: "INFP",
    confirmedEnneagramType: "Type 4",
    confirmedEnneagramWing: "4w5",
  });
});
