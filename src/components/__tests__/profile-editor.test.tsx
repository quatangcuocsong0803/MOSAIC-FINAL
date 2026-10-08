// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UserProfileData } from "@/app/actions/profile";
const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  update: vi.fn(),
  types: vi.fn(),
  profile: {} as UserProfileData,
}));
vi.mock("@/app/actions/profile", () => ({
  getUserProfile: mocks.get,
  updateUserProfile: mocks.update,
  saveTypology: mocks.types,
}));
import ProfileFormModal from "../ProfileFormModal";
beforeEach(() => {
  vi.clearAllMocks();
  mocks.profile = {
    id: "me",
    mid: "0000001",
    username: "member",
    displayName: "Member",
    bio: null,
    dateOfBirth: new Date("2000-03-21"),
    interestCodes: [],
    age: 26,
    visibility: {
      username: "PUBLIC",
      displayName: "PUBLIC",
      avatarUrl: "PUBLIC",
      dateOfBirth: "PRIVATE",
      bio: "PUBLIC",
      hobbies: "PUBLIC",
      location: "PRIVATE",
    },
    confirmedMbtiType: null,
    confirmedEnneagramType: null,
    confirmedEnneagramWing: null,
    confirmedEnneagramTritype: null,
  } as unknown as UserProfileData;
  mocks.get.mockResolvedValue({ success: true, profile: mocks.profile });
  mocks.update.mockResolvedValue({ success: true, profile: mocks.profile });
  mocks.types.mockResolvedValue({ success: true, profile: mocks.profile });
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it("saves display name, multiple interests and per-field privacy", async () => {
  const u = userEvent.setup();
  const close = vi.fn();
  render(<ProfileFormModal isOpen onClose={close} />);
  await screen.findByLabelText("Tên hiển thị");
  await u.clear(screen.getByLabelText("Tên hiển thị"));
  await u.type(screen.getByLabelText("Tên hiển thị"), "Updated name");
  await u.selectOptions(
    screen.getByLabelText("Quyền xem Giới thiệu"),
    "FRIENDS",
  );
  await u.click(screen.getByLabelText("Đọc sách"));
  await u.click(screen.getByLabelText("Cờ vua"));
  await u.click(screen.getByRole("button", { name: "Lưu thay đổi" }));
  await waitFor(() => expect(close).toHaveBeenCalled());
  expect(mocks.update).toHaveBeenCalledWith(
    expect.objectContaining({
      displayName: "Updated name",
      interestCodes: ["reading", "chess"],
      visibility: expect.objectContaining({ bio: "FRIENDS" }),
    }),
  );
});
it("uploads an avatar through the authenticated endpoint", async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValue({
      ok: true,
      json: async () => ({ avatarUrl: "https://example.com/new-avatar.png" }),
    });
  vi.stubGlobal("fetch", fetchMock);
  const u = userEvent.setup();
  render(<ProfileFormModal isOpen onClose={vi.fn()} />);
  const input = await screen.findByLabelText("Ảnh đại diện");
  await u.upload(
    input,
    new File(
      [Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10])],
      "avatar.png",
      { type: "image/png" },
    ),
  );
  await screen.findByAltText("Ảnh đại diện của bạn");
  expect(fetchMock).toHaveBeenCalledWith(
    "/api/profile/avatar",
    expect.objectContaining({ method: "POST", body: expect.any(FormData) }),
  );
});
