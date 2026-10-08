import { expect, it } from "vitest";
import { visibleIdentity } from "../profile-identity";
it("applies identity privacy to secondary social surfaces", () => {
  const user = {
    id: "u",
    username: "private_handle",
    displayName: "Public name",
    avatarUrl: "avatar",
    usernameVisibility: "PRIVATE" as const,
    displayNameVisibility: "PUBLIC" as const,
    avatarUrlVisibility: "FRIENDS" as const,
  };
  expect(visibleIdentity(user)).toEqual({
    id: "u",
    username: "Public name",
    avatarUrl: null,
  });
  expect(visibleIdentity(user, false, true).avatarUrl).toBe("avatar");
  expect(
    visibleIdentity({ ...user, displayNameVisibility: "PRIVATE" }, false, true)
      .username,
  ).toBeNull();
  expect(
    visibleIdentity({ ...user, displayNameVisibility: "PRIVATE" }, true, false)
      .username,
  ).toBe("Public name");
});
