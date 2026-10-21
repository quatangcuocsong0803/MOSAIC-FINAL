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
import ProfileOnboardingWizard from "../ProfileOnboardingWizard";
import { onboardingPauseKey } from "@/lib/onboarding";
beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
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
  render(<ProfileOnboardingWizard initialProfile={state.profile} />);
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
  await waitFor(() => expect(state.push).toHaveBeenCalledWith("/profile"));
  expect(sessionStorage.getItem(onboardingPauseKey("ui-member"))).toBe("1");
  expect(state.profile.onboardingStep).toBe(3);
  expect(state.profile.location).toBe("Hà Nội, Việt Nam");
});
it("resumes saved progress and supports going back", async () => {
  state.profile.onboardingStep = 5;
  const u = userEvent.setup();
  render(<ProfileOnboardingWizard initialProfile={state.profile} />);
  await screen.findByRole("heading", { name: "Giới thiệu" });
  await u.click(screen.getByRole("button", { name: "← Quay lại" }));
  await waitFor(() => expect(state.push).toHaveBeenCalledWith("/onboarding/birthday?returnTo=%2Fprofile"));
  expect(state.profile.onboardingStep).toBe(4);
});
it("marks completion before navigating to Tests", async () => {
  state.profile.onboardingStep = 7;
  const u = userEvent.setup();
  render(<ProfileOnboardingWizard initialProfile={state.profile} />);
  await screen.findByRole("heading", { name: "Typology" });
  await u.click(screen.getByRole("button", { name: "Kiểm tra ngay →" }));
  await waitFor(() => expect(state.push).toHaveBeenCalledWith("/test"));
  expect(state.profile.onboardingCompletedAt).toBeTruthy();
  expect(state.types).toHaveBeenCalledOnce();

});
it("does not navigate when typology or progress fails to save", async () => {
  state.profile.onboardingStep = 7;
  state.types.mockResolvedValue({
    success: false,
    error: "Chưa lưu được typology.",
  });
  const u = userEvent.setup();
  render(<ProfileOnboardingWizard initialProfile={state.profile} />);
  await screen.findByRole("heading", { name: "Typology" });
  await u.click(screen.getByRole("button", { name: "Kiểm tra ngay →" }));
  await screen.findByRole("alert");
  expect(state.push).not.toHaveBeenCalled();
  expect(state.save).not.toHaveBeenCalled();
  expect(state.profile.onboardingCompletedAt).toBeNull();
});

it("shows one full page, saves before advancing, and keeps input when saving fails", async () => {
  state.profile.onboardingStep = 0;
  state.save.mockResolvedValueOnce({ success: false, error: "Username đã tồn tại." });
  const u = userEvent.setup();
  render(<ProfileOnboardingWizard initialProfile={state.profile} />);
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Username");
  expect(screen.queryByLabelText("Ngày sinh")).toBeNull();
  const input = screen.getByLabelText("Username duy nhất");
  await u.clear(input);
  await u.type(input, "mosaic_member");
  await u.click(screen.getByRole("button", { name: "Tiếp tục →" }));
  await screen.findByText("Username đã tồn tại.");
  expect(state.push).not.toHaveBeenCalled();
  expect((input as HTMLInputElement).value).toBe("mosaic_member");
  await u.click(screen.getByRole("button", { name: "Tiếp tục →" }));
  await waitFor(() => expect(state.push).toHaveBeenCalledWith("/onboarding/display-name?returnTo=%2Fprofile"));
});
it("does not leave the page or pause the flow when save for later fails", async () => {
  state.save.mockRejectedValue(new Error("offline"));
  const u = userEvent.setup();
  render(<ProfileOnboardingWizard initialProfile={state.profile} />);
  await u.click(screen.getByRole("button", { name: "Lưu tiến độ và tiếp tục sau" }));
  await screen.findByRole("alert");
  expect(state.push).not.toHaveBeenCalled();
  expect(sessionStorage.getItem(onboardingPauseKey("ui-member"))).toBeNull();
});
