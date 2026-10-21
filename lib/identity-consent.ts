type IdentityUser = {
  confirmedMbtiType: string | null;
  confirmedMbtiSource: string | null;
  confirmedMbtiTestResultId: string | null;
  confirmedEnneagramType: string | null;
  confirmedEnneagramWing: string | null;
  confirmedEnneagramTritype: string | null;
  confirmedEnneagramSource: string | null;
  confirmedEnneagramTestResultId: string | null;
};
export function identitySnapshot(
  user: IdentityUser,
  kind: "MBTI" | "ENNEAGRAM",
) {
  const mbti = kind === "MBTI";
  const type = mbti ? user.confirmedMbtiType : user.confirmedEnneagramType;
  if (!type) return null;
  return {
    value: JSON.stringify(
      mbti
        ? [type]
        : [type, user.confirmedEnneagramWing, user.confirmedEnneagramTritype],
    ),
    source:
      (mbti ? user.confirmedMbtiSource : user.confirmedEnneagramSource) ||
      "MANUAL",
    testResultId: mbti
      ? user.confirmedMbtiTestResultId
      : user.confirmedEnneagramTestResultId,
  };
}
export function activeIdentityConsent(
  user: IdentityUser,
  consent: {
    kind: string;
    value: string;
    source: string;
    testResultId: string | null;
    revokedAt: Date | null;
  },
) {
  if (consent.revokedAt || !["MBTI", "ENNEAGRAM"].includes(consent.kind))
    return false;
  const current = identitySnapshot(user, consent.kind as "MBTI" | "ENNEAGRAM");
  return Boolean(
    current &&
      current.value === consent.value &&
      current.source === consent.source &&
      current.testResultId === consent.testResultId,
  );
}
