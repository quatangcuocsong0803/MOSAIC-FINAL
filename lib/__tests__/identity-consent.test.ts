import { expect, it } from "vitest";
import { activeIdentityConsent, identitySnapshot } from "../identity-consent";
const user = {
  confirmedMbtiType: "INFP",
  confirmedMbtiSource: "MANUAL",
  confirmedMbtiTestResultId: null,
  confirmedEnneagramType: "Type 4",
  confirmedEnneagramWing: "4w5",
  confirmedEnneagramTritype: "458",
  confirmedEnneagramSource: "TEST",
  confirmedEnneagramTestResultId: "t1",
};
it("consent binds to value, source and selected attempt, including wing and tritype", () => {
  const consent = {
    kind: "ENNEAGRAM",
    ...identitySnapshot(user, "ENNEAGRAM")!,
    revokedAt: null,
  };
  expect(activeIdentityConsent(user, consent)).toBe(true);
  for (const delta of [
    { confirmedEnneagramType: "Type 5" },
    { confirmedEnneagramWing: "4w3" },
    { confirmedEnneagramTritype: "459" },
    { confirmedEnneagramSource: "MANUAL" },
    { confirmedEnneagramTestResultId: "t2" },
  ])
    expect(activeIdentityConsent({ ...user, ...delta }, consent)).toBe(false);
  expect(
    activeIdentityConsent(user, { ...consent, revokedAt: new Date() }),
  ).toBe(false);
});
