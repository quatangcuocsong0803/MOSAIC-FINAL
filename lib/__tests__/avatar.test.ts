import { expect, it } from "vitest";
import { avatarFormat } from "../avatar/validation";
it("detects supported image signatures and rejects disguised uploads", () => {
  expect(
    avatarFormat(new TextEncoder().encode("<script>alert(1)</script>")),
  ).toBeNull();
  expect(
    avatarFormat(Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]))?.extension,
  ).toBe("png");
  expect(avatarFormat(Uint8Array.from([255, 216, 255]))?.extension).toBe("jpg");
  expect(avatarFormat(new TextEncoder().encode("GIF89a"))?.extension).toBe(
    "gif",
  );
  expect(
    avatarFormat(new TextEncoder().encode("RIFF0000WEBP"))?.extension,
  ).toBe("webp");
});
