/**
 * Sự kiện phía client báo rằng avatar vừa thay đổi,
 * để Navbar (nằm trong layout, không bị re-mount) cập nhật ngay mà không cần F5.
 */
export const AVATAR_UPDATED_EVENT = "mosaic:avatar-updated";

export function notifyAvatarUpdated(url: string | null) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<string | null>(AVATAR_UPDATED_EVENT, { detail: url }));
}
