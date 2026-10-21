import type { UpdateUserProfileInput } from "@/app/actions/profile";
import type { TypologyInput } from "@/lib/typology";
export const onboardingDraftKey = (id: string) =>
  `mosaic:onboarding:draft:v2:${id}`;
export type OnboardingDraft = {
  step: number;
  fields: UpdateUserProfileInput;
  typology: TypologyInput;
};
export function stepError(step: number, fields: UpdateUserProfileInput) {
  if (step === 0 && !/^[a-z0-9_]{3,30}$/i.test(fields.username?.trim() || ""))
    return "Username cần 3–30 chữ cái, số hoặc dấu gạch dưới.";
  if (step === 1 && !fields.displayName?.trim())
    return "Vui lòng nhập tên hiển thị.";
  if (
    step === 4 &&
    (!fields.dateOfBirth ||
      !Number.isFinite(new Date(fields.dateOfBirth).getTime()) ||
      new Date(fields.dateOfBirth) > new Date() ||
      new Date(fields.dateOfBirth).getUTCFullYear() < 1900)
  )
    return "Vui lòng chọn ngày sinh hợp lệ.";
  if ((fields.interestCodes?.length || 0) > 7) return "Chọn tối đa 7 sở thích.";
  return "";
}
