import type { UpdateUserProfileInput } from "@/app/actions/profile";
import { validateExtraTypology, type TypologyInput } from "@/lib/typology";
import {
  normalizeMbtiType,
  normalizeEnneagramCore,
  normalizeEnneagramWing,
  normalizeEnneagramTritype,
} from "@/lib/personality-validation";
import { INTEREST_CODES, interestLabels } from "@/lib/interests";
import { birthFacts } from "@/lib/profile-policy";
import type { Prisma } from "@prisma/client";
export function validateOnboardingDraft(
  input: UpdateUserProfileInput,
  types: TypologyInput,
  complete: boolean,
): Prisma.UserUpdateInput {
  const username = input.username?.trim().toLowerCase() || null;
  if (username && !/^[a-z0-9_]{3,30}$/.test(username))
    throw Error("Username không hợp lệ.");
  const displayName = input.displayName?.trim() || null;
  if (displayName && displayName.length > 80)
    throw Error("Tên hiển thị tối đa 80 ký tự.");
  let dateOfBirth: Date | null = null;
  if (input.dateOfBirth) {
    dateOfBirth = new Date(input.dateOfBirth);
    if (
      !Number.isFinite(dateOfBirth.getTime()) ||
      dateOfBirth > new Date() ||
      dateOfBirth.getUTCFullYear() < 1900 ||
      (typeof input.dateOfBirth === "string" &&
        dateOfBirth.toISOString().slice(0, 10) !== input.dateOfBirth)
    )
      throw Error("Ngày sinh không hợp lệ.");
  }
  if (complete && (!username || !displayName || !dateOfBirth))
    throw Error("Vui lòng điền username, tên hiển thị và ngày sinh.");
  const interestCodes = input.interestCodes || [];
  if (
    !Array.isArray(interestCodes) ||
    interestCodes.length > 7 ||
    interestCodes.some((c) => !INTEREST_CODES.has(c))
  )
    throw Error("Chọn tối đa 7 sở thích hợp lệ.");
  for (const [key, max] of [
    ["bio", 2000],
    ["location", 160],
  ] as const)
    if (
      input[key] &&
      (typeof input[key] !== "string" || input[key]!.length > max)
    )
      throw Error("Thông tin quá dài.");
  const mbti = types.mbtiType ? normalizeMbtiType(types.mbtiType) : null;
  const core = types.enneagramCore
    ? normalizeEnneagramCore(types.enneagramCore)
    : null;
  const wing =
    core && types.enneagramWing
      ? normalizeEnneagramWing(core, types.enneagramWing)
      : null;
  const tritype =
    core && types.enneagramTritype
      ? normalizeEnneagramTritype(core, types.enneagramTritype)
      : null;
  if (
    (types.mbtiType && !mbti) ||
    (types.enneagramCore && !core) ||
    (types.enneagramWing && !wing) ||
    (types.enneagramTritype && !tritype)
  )
    throw Error("Typology không hợp lệ.");
  return {
    username,
    displayName,
    dateOfBirth,
    zodiacSign: birthFacts(dateOfBirth).zodiacSign,
    interestCodes: [...new Set(interestCodes)],
    hobbies: interestLabels(interestCodes) || null,
    bio: input.bio?.trim() || null,
    location: input.location?.trim() || null,
    ...validateExtraTypology(types),
    manualMbtiType: mbti,
    confirmedMbtiType: mbti,
    confirmedMbtiSource: mbti ? "MANUAL" : null,
    confirmedMbtiTestResultId: null,
    manualEnneagramType: core ? `Type ${core}` : null,
    confirmedEnneagramType: core ? `Type ${core}` : null,
    manualEnneagramWing: wing,
    confirmedEnneagramWing: wing,
    manualEnneagramTritype: tritype,
    confirmedEnneagramTritype: tritype,
    confirmedEnneagramSource: core ? "MANUAL" : null,
    confirmedEnneagramTestResultId: null,
  };
}
