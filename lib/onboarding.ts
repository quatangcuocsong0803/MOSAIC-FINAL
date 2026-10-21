export const ONBOARDING_STEPS = [
  "Username",
  "Tên hiển thị",
  "Ảnh đại diện",
  "Vị trí",
  "Ngày sinh",
  "Giới thiệu",
  "Sở thích",
  "Typology",
] as const;
export const ONBOARDING_SLUGS = [
  "username", "display-name", "avatar", "location",
  "birthday", "bio", "interests", "typology",
] as const;

export function onboardingPath(step: number, returnTo = "/profile") {
  const slug = ONBOARDING_SLUGS[step];
  if (!slug) throw new Error("Bước onboarding không hợp lệ.");
  return `/onboarding/${slug}?returnTo=${encodeURIComponent(returnTo)}`;
}

export function isOnboardingPath(path: string) {
  return path === "/onboarding" || path.startsWith("/onboarding/");
}

export function onboardingPauseKey(userId: string) {
  return `mosaic-onboarding-paused:${userId}`;
}

export function onboardingMove(
  current: number,
  direction: "next" | "back" | "save",
) {
  if (!Number.isInteger(current) || current < 0 || current > 7)
    throw new Error("Bước onboarding không hợp lệ.");
  if (!["next", "back", "save"].includes(direction))
    throw new Error("Thao tác không hợp lệ.");
  return direction === "next"
    ? current + 1
    : direction === "back"
      ? Math.max(0, current - 1)
      : current;
}
