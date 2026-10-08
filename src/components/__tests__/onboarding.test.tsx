// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UserProfileData } from "@/app/actions/profile";
const state = vi.hoisted(() => ({
  profile: {} as UserProfileData,
  push: vi.fn(),
  refresh: vi.fn(),
  save: vi.fn(),
  types: vi.fn(),
  get: vi.fn(),
}));
vi.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    isLoaded: true,
    isSignedIn: true,
    user: { id: "ui-member" },
  }),
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: state.push, refresh: state.refresh }),
}));
vi.mock("@/app/actions/profile", () => ({
  getUserProfile: state.get,
  saveTypology: state.types,
}));
vi.mock("@/app/actions/onboarding", () => ({ saveOnboardingStep: state.save }));
import ProfileOnboardingModal from "../ProfileOnboardingModal";
beforeEach(() => {
  vi.clearAllMocks();
  state.profile = {
    id: "ui-id",
    clerkId: "ui-member",
    mid: "0000001",
    username: "member",
    displayName: "Member",
    onboardingStep: 3,
    onboardingCompletedAt: null,
    dateOfBirth: new Date("2000-01-20"),
    interestCodes: [],
    confirmedMbtiType: null,
    confirmedEnneagramType: null,
    confirmedEnneagramWing: null,
    confirmedEnneagramTritype: null,
  } as unknown as UserProfileData;
  state.get.mockImplementation(async () => ({
    success: true,
    profile: { ...state.profile },
  }));
  state.types.mockImplementation(async () => ({
    success: true,
    profile: { ...state.profile },
  }));
  state.save.mockImplementation(
    async (
      step: number,
      direction: string,
      input: Partial<UserProfileData>,
    ) => {
      state.profile = {
        ...state.profile,
        ...input,
        onboardingStep:
          direction === "next"
            ? step + 1
            : direction === "back"
              ? Math.max(0, step - 1)
              : step,
        ...(step === 7 && direction === "next"
          ? { onboardingCompletedAt: new Date() }
          : {}),
      };
      return { success: true, profile: { ...state.profile } };
    },
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it("never requests location before explicit consent and offers manual location after denial", async () => {
  const geo = vi.fn((_ok: unknown, fail: (e: unknown) => void) =>
    fail({ code: 1 }),
  );
  Object.defineProperty(navigator, "geolocation", {
    configurable: true,
    value: { getCurrentPosition: geo },
  });
  const u = userEvent.setup();
  render(<ProfileOnboardingModal />);
  await screen.findByRole("heading", { name: "Vị trí" });
  expect(geo).not.toHaveBeenCalled();
  await u.click(screen.getByRole("button", { name: "Không sử dụng" }));
  expect(geo).not.toHaveBeenCalled();
  await u.type(screen.getByLabelText("Quốc gia"), "Việt Nam");
  await u.type(screen.getByLabelText("Thành phố"), "Hà Nội");
  await u.click(screen.getByRole("button", { name: "Đồng ý sử dụng vị trí" }));
  expect(geo).toHaveBeenCalledTimes(1);
  await screen.findByText(
    "Không sử dụng định vị. Bạn có thể chọn quốc gia/thành phố thủ công.",
  );
  await u.click(
    screen.getByRole("button", { name: "Lưu tiến độ và tiếp tục sau" }),
  );
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  expect(state.profile.onboardingStep).toBe(3);
  expect(state.profile.location).toBe("Hà Nội, Việt Nam");
});
it("resumes saved progress and supports going back", async () => {
  state.profile.onboardingStep = 5;
  const u = userEvent.setup();
  render(<ProfileOnboardingModal />);
  await screen.findByRole("heading", { name: "Giới thiệu" });
  await u.click(screen.getByRole("button", { name: "← Quay lại" }));
  await screen.findByRole("heading", { name: "Ngày sinh" });
  expect(state.profile.onboardingStep).toBe(4);
});
it("marks completion before navigating to Tests and does not open again", async () => {
  state.profile.onboardingStep = 7;
  const u = userEvent.setup();
  const view = render(<ProfileOnboardingModal />);
  await screen.findByRole("heading", { name: "Typology" });
  await u.click(screen.getByRole("button", { name: "Kiểm tra ngay →" }));
  await waitFor(() => expect(state.push).toHaveBeenCalledWith("/test"));
  expect(state.profile.onboardingCompletedAt).toBeTruthy();
  expect(state.types).toHaveBeenCalledOnce();
  view.unmount();
  render(<ProfileOnboardingModal />);
  await waitFor(() => expect(state.get).toHaveBeenCalledTimes(2));
  expect(screen.queryByRole("dialog")).toBeNull();
});
it("does not navigate when typology or progress fails to save", async () => {
  state.profile.onboardingStep = 7;
  state.types.mockResolvedValue({
    success: false,
    error: "Chưa lưu được typology.",
  });
  const u = userEvent.setup();
  render(<ProfileOnboardingModal />);
  await screen.findByRole("heading", { name: "Typology" });
  await u.click(screen.getByRole("button", { name: "Kiểm tra ngay →" }));
  await screen.findByRole("alert");
  expect(state.push).not.toHaveBeenCalled();
  expect(state.save).not.toHaveBeenCalled();
  expect(state.profile.onboardingCompletedAt).toBeNull();
});
