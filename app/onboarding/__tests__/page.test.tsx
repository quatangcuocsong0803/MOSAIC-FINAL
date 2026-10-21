import { beforeEach, expect, it, vi } from "vitest";
const state = vi.hoisted(() => ({ auth: vi.fn(), get: vi.fn() }));
vi.mock("@clerk/nextjs/server", () => ({ auth: state.auth }));
vi.mock("@/app/actions/profile", () => ({ getUserProfile: state.get }));
vi.mock("next/navigation", () => ({ redirect: (url: string) => { throw new Error(`REDIRECT:${url}`); } }));
vi.mock("@/src/components/ProfileOnboardingWizard", () => ({ default: () => null }));
import Page from "../[[...step]]/page";

beforeEach(() => {
  state.auth.mockResolvedValue({ userId: "member" });
  state.get.mockResolvedValue({ success: true, profile: { onboardingStep: 5, onboardingCompletedAt: null } });
});
function page(step?: string[], returnTo?: string) {
  return Page({ params: Promise.resolve({ step }), searchParams: Promise.resolve({ returnTo }) });
}
it("resumes saved progress from the entry route", async () => {
  await expect(page()).rejects.toThrow("REDIRECT:/onboarding/bio?returnTo=%2Fprofile");
});
it("rejects jumping ahead or loading an outdated step URL", async () => {
  await expect(page(["typology"])).rejects.toThrow("REDIRECT:/onboarding/bio?returnTo=%2Fprofile");
  await expect(page(["username"])).rejects.toThrow("REDIRECT:/onboarding/bio?returnTo=%2Fprofile");
});
it("renders the current step with saved profile data", async () => {
  const result = await page(["bio"], "/discover");
  expect(result.props.initialProfile.onboardingStep).toBe(5);
  expect(result.props.returnTo).toBe("/discover");
});
it("redirects a guest to sign-in with a return to setup", async () => {
  state.auth.mockResolvedValue({ userId: null });
  await expect(page()).rejects.toThrow("REDIRECT:/sign-in?redirect_url=%2Fonboarding%3FreturnTo%3D%252Fprofile");
});
it("does not repeat setup for completed accounts", async () => {
  state.get.mockResolvedValue({ success: true, profile: { onboardingCompletedAt: new Date() } });
  await expect(page(["username"], "/discover")).rejects.toThrow("REDIRECT:/discover");
});
it("prevents external redirects and onboarding redirect loops", async () => {
  state.get.mockResolvedValue({ success: true, profile: { onboardingCompletedAt: new Date() } });
  await expect(page(undefined, "https://example.com")).rejects.toThrow("REDIRECT:/");
  await expect(page(undefined, "/onboarding/username")).rejects.toThrow("REDIRECT:/profile");
});
