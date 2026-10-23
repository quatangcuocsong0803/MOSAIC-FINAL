// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { onboardingPauseKey } from "@/lib/onboarding";
const state = vi.hoisted(() => ({
  userId: "member", signedIn: true, path: "/discover", replace: vi.fn(), get: vi.fn(),
}));
vi.mock("@clerk/nextjs", () => ({ useUser: () => ({ isLoaded: true, isSignedIn: state.signedIn, user: { id: state.userId } }) }));
vi.mock("next/navigation", () => ({ usePathname: () => state.path, useRouter: () => ({ replace: state.replace }) }));
vi.mock("@/lib/session-bootstrap", () => ({ getSessionBootstrap: state.get }));
import OnboardingGate from "../OnboardingGate";

beforeEach(() => {
  vi.clearAllMocks(); sessionStorage.clear();
  state.path = "/discover"; state.signedIn = true; state.userId = "member";
  window.history.replaceState(null, "", "/discover");
  state.get.mockResolvedValue({ success: true, profile: { onboardingStep: 4, onboardingCompletedAt: null } });
});
afterEach(cleanup);
it("sends an unfinished account to its saved page while preserving the intended destination", async () => {
  render(<OnboardingGate />);
  await waitFor(() => expect(state.replace).toHaveBeenCalledWith("/onboarding/birthday?returnTo=%2Fdiscover"));
});
it("leaves completed accounts on the requested page", async () => {
  state.get.mockResolvedValue({ success: true, profile: { onboardingCompletedAt: new Date() } });
  render(<OnboardingGate />);
  await waitFor(() => expect(state.get).toHaveBeenCalled());
  expect(state.replace).not.toHaveBeenCalled();
});
it("offers a resume link after save-for-later instead of immediately redirecting again", async () => {
  sessionStorage.setItem(onboardingPauseKey("member"), "1");
  render(<OnboardingGate />);
  const link = await screen.findByRole("link", { name: "Tiếp tục hoàn thiện hồ sơ →" });
  expect(link.getAttribute("href")).toBe("/onboarding/birthday?returnTo=%2Fdiscover");
  expect(state.replace).not.toHaveBeenCalled();
});
it("does not use another account's pause flag", async () => {
  sessionStorage.setItem(onboardingPauseKey("another-account"), "1");
  render(<OnboardingGate />);
  await waitFor(() => expect(state.replace).toHaveBeenCalled());
});
it.each(["/onboarding/avatar", "/sign-in", "/sign-up"])("does not intercept %s", async (path) => {
  state.path = path;
  render(<OnboardingGate />);
  expect(state.get).not.toHaveBeenCalled();
  expect(state.replace).not.toHaveBeenCalled();
});
it("does not fetch a guest's profile", () => {
  state.signedIn = false;
  render(<OnboardingGate />);
  expect(state.get).not.toHaveBeenCalled();
});
