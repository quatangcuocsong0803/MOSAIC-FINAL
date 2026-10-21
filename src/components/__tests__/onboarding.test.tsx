// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UserProfileData } from "@/app/actions/profile";
const state = vi.hoisted(() => ({
  save: vi.fn(),
  push: vi.fn(),
  refresh: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: state.push, refresh: state.refresh }),
}));
vi.mock("@/app/actions/onboarding", () => ({
  saveOnboardingDraft: state.save,
}));
import Wizard from "../ProfileOnboardingWizard";
import { onboardingDraftKey } from "@/lib/onboarding-draft";
const profile = (step = 0) =>
  ({
    id: "qa",
    clerkId: "qa",
    username: "member",
    displayName: "Member",
    dateOfBirth: new Date("2000-01-01"),
    interestCodes: [],
    onboardingStep: step,
    onboardingCompletedAt: null,
    confirmedMbtiType: null,
    confirmedEnneagramType: null,
    confirmedEnneagramWing: null,
    confirmedEnneagramTritype: null,
  }) as unknown as UserProfileData;
beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
  state.save.mockResolvedValue({
    success: true,
    profile: { ...profile(7), onboardingCompletedAt: new Date() },
  });
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => ({
      ok: true,
      json: async () =>
        url.includes("countries")
          ? [{ name: "Vietnam", code: "VN" }]
          : url.includes("VN.json")
            ? ["Hanoi", "Da Nang"]
            : { countryCode: "VN", countryName: "Vietnam", city: "Hanoi" },
    })),
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it("moves next/back immediately without calling server or navigating, and retains typed values", async () => {
  const u = userEvent.setup();
  render(<Wizard initialProfile={profile()} />);
  await u.clear(screen.getByLabelText("Username duy nhất"));
  await u.type(screen.getByLabelText("Username duy nhất"), "new_member");
  await u.click(screen.getByRole("button", { name: "Tiếp tục →" }));
  await screen.findByRole("heading", { name: "Tên hiển thị" });
  expect(state.save).not.toHaveBeenCalled();
  expect(state.push).not.toHaveBeenCalled();
  await u.click(screen.getByRole("button", { name: "← Quay lại" }));
  expect(
    ((await screen.findByLabelText("Username duy nhất")) as HTMLInputElement)
      .value,
  ).toBe("new_member");
  expect(state.save).not.toHaveBeenCalled();
});
it("restores account-scoped drafts after remount", async () => {
  const u = userEvent.setup();
  const view = render(<Wizard initialProfile={profile()} />);
  await u.click(screen.getByRole("button", { name: "Tiếp tục →" }));
  await screen.findByRole("heading", { name: "Tên hiển thị" });
  view.unmount();
  render(<Wizard initialProfile={profile()} />);
  await screen.findByRole("heading", { name: "Tên hiển thị" });
  expect(state.save).not.toHaveBeenCalled();
  expect(localStorage.getItem(onboardingDraftKey("other-account"))).toBeNull();
});
it("persists whole draft only on explicit save and retains it on failure", async () => {
  state.save.mockResolvedValue({ success: false, error: "Offline" });
  const u = userEvent.setup();
  render(<Wizard initialProfile={profile(5)} />);
  await u.type(
    screen.getByRole("textbox", { name: "Giới thiệu (có thể bỏ qua)" }),
    "A little story",
  );
  await u.click(
    screen.getByRole("button", { name: "Lưu tiến độ và tiếp tục sau" }),
  );
  await screen.findByText("Offline");
  expect(state.push).not.toHaveBeenCalled();
  expect(state.save).toHaveBeenCalledWith(
    5,
    false,
    expect.objectContaining({ bio: "A little story" }),
    expect.anything(),
  );
  expect(localStorage.getItem(onboardingDraftKey("qa"))).toContain(
    "A little story",
  );
});
it("completes before going to Tests and clears local draft", async () => {
  const u = userEvent.setup();
  render(<Wizard initialProfile={profile(7)} />);
  await u.click(screen.getByRole("button", { name: "Kiểm tra ngay →" }));
  await waitFor(() => expect(state.push).toHaveBeenCalledWith("/test"));
  expect(state.save).toHaveBeenCalledWith(
    7,
    true,
    expect.anything(),
    expect.anything(),
  );
  expect(localStorage.getItem(onboardingDraftKey("qa"))).toBeNull();
});
it("offers dropdowns after location denial without making geocoding calls", async () => {
  const geo = vi.fn((_ok, fail) => fail({ code: 1 }));
  Object.defineProperty(navigator, "geolocation", {
    configurable: true,
    value: { getCurrentPosition: geo },
  });
  const u = userEvent.setup();
  render(<Wizard initialProfile={profile(3)} />);
  await screen.findByRole("option", { name: "Vietnam" });
  expect(geo).not.toHaveBeenCalled();
  await u.click(screen.getByRole("button", { name: "Đồng ý sử dụng vị trí" }));
  expect(geo).toHaveBeenCalledOnce();
  await u.selectOptions(screen.getByLabelText("Quốc gia"), "Vietnam");
  await screen.findByRole("option", { name: "Hanoi" });
  await u.selectOptions(screen.getByLabelText("Thành phố"), "Hanoi");
  await u.click(
    screen.getByRole("button", { name: "Lưu tiến độ và tiếp tục sau" }),
  );
  expect(state.save).toHaveBeenCalledWith(
    3,
    false,
    expect.objectContaining({ location: "Hanoi, Vietnam" }),
    expect.anything(),
  );
  expect(
    vi
      .mocked(fetch)
      .mock.calls.some(([url]) => String(url).includes("bigdatacloud")),
  ).toBe(false);
});
it("autofills city and country only after explicit location approval", async () => {
  const geo = vi.fn((ok) => ok({ coords: { latitude: 21, longitude: 105 } }));
  Object.defineProperty(navigator, "geolocation", {
    configurable: true,
    value: { getCurrentPosition: geo },
  });
  const u = userEvent.setup();
  render(<Wizard initialProfile={profile(3)} />);
  await screen.findByRole("option", { name: "Vietnam" });
  expect(geo).not.toHaveBeenCalled();
  await u.click(screen.getByRole("button", { name: "Đồng ý sử dụng vị trí" }));
  await waitFor(() =>
    expect(
      (screen.getByLabelText("Thành phố") as HTMLSelectElement).value,
    ).toBe("Hanoi"),
  );
  expect((screen.getByLabelText("Quốc gia") as HTMLSelectElement).value).toBe(
    "Vietnam",
  );
  expect(state.save).not.toHaveBeenCalled();
});
it("caps selected interests at seven while allowing deselection", async () => {
  const u = userEvent.setup();
  render(<Wizard initialProfile={profile(6)} />);
  const boxes = await screen.findAllByRole("checkbox");
  for (const box of boxes.slice(0, 7)) await u.click(box);
  expect((boxes[7] as HTMLInputElement).disabled).toBe(true);
  await u.click(boxes[0]);
  expect((boxes[7] as HTMLInputElement).disabled).toBe(false);
});
