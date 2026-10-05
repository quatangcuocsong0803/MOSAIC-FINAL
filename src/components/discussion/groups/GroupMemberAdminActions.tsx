"use client";

import {
  useState,
} from "react";

import {
  banDiscussionGroupMember,
  removeDiscussionGroupMember,
  respondDiscussionGroupRequest,
  setDiscussionGroupMemberRole,
  transferDiscussionGroupOwnership,
  unbanDiscussionGroupMember,
} from "@/app/actions/discussion-groups";

// ============================================================
// JOIN REQUEST
// ============================================================

export function GroupRequestActions({
  membershipId,
}: {
  membershipId: string;
}) {
  const [
    busy,
    setBusy,
  ] =
    useState(false);

  async function respond(
    approve: boolean,
  ) {
    setBusy(
      true,
    );

    const result =
      await respondDiscussionGroupRequest(
        membershipId,
        approve,
      );

    if (
      !result.success
    ) {
      window.alert(
        result.error,
      );

      setBusy(
        false,
      );

      return;
    }

    window.location.reload();
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={() =>
          void respond(
            true,
          )
        }
        className="rounded-md bg-[#6A5237] px-3 py-1.5 text-[9px] font-bold text-white disabled:opacity-50"
      >
        Duyệt
      </button>

      <button
        type="button"
        disabled={busy}
        onClick={() =>
          void respond(
            false,
          )
        }
        className="rounded-md border border-rose-200 px-3 py-1.5 text-[9px] font-bold text-rose-700 disabled:opacity-50"
      >
        Từ chối
      </button>
    </div>
  );
}

// ============================================================
// PROMOTE / DEMOTE MODERATOR
// ============================================================

export function GroupRoleAction({
  membershipId,
  currentRole,
}: {
  membershipId: string;

  currentRole:
    | "MEMBER"
    | "MODERATOR";
}) {
  const [
    busy,
    setBusy,
  ] =
    useState(false);

  async function change() {
    setBusy(
      true,
    );

    const result =
      await setDiscussionGroupMemberRole(
        membershipId,

        currentRole ===
          "MODERATOR"
          ? "MEMBER"
          : "MODERATOR",
      );

    if (
      !result.success
    ) {
      window.alert(
        result.error,
      );

      setBusy(
        false,
      );

      return;
    }

    window.location.reload();
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={() =>
        void change()
      }
      className="rounded-md border border-[#B69E7D] bg-white px-2.5 py-1.5 text-[8px] font-bold text-[#735B3E] disabled:opacity-50"
    >
      {busy
        ? "..."
        : currentRole ===
            "MODERATOR"
          ? "Gỡ Moderator"
          : "Đặt Moderator"}
    </button>
  );
}

// ============================================================
// ACTIVE MEMBER GOVERNANCE
// ============================================================

export function GroupGovernanceActions({
  membershipId,
  targetRole,
  viewerRole,
}: {
  membershipId: string;

  targetRole:
    | "MEMBER"
    | "MODERATOR";

  viewerRole:
    | "OWNER"
    | "MODERATOR";
}) {
  const [
    busy,
    setBusy,
  ] =
    useState(false);

  const moderatorCanAct =
    viewerRole ===
      "OWNER" ||
    targetRole ===
      "MEMBER";

  async function run(
    action:
      | "REMOVE"
      | "BAN"
      | "TRANSFER",
  ) {
    if (busy) {
      return;
    }

    let message =
      "";

    if (
      action ===
      "REMOVE"
    ) {
      message =
        "Remove thành viên khỏi Group? Họ có thể tham gia lại theo join policy.";
    }

    if (
      action ===
      "BAN"
    ) {
      message =
        "Ban thành viên này? Họ sẽ không thể tự tham gia lại cho đến khi được unban.";
    }

    if (
      action ===
      "TRANSFER"
    ) {
      message =
        "Chuyển quyền sở hữu Group cho thành viên này? Bạn sẽ trở thành Moderator.";
    }

    if (
      !window.confirm(
        message,
      )
    ) {
      return;
    }

    setBusy(
      true,
    );

    const result =
      action ===
      "REMOVE"
        ? await removeDiscussionGroupMember(
            membershipId,
          )
        : action ===
            "BAN"
          ? await banDiscussionGroupMember(
              membershipId,
            )
          : await transferDiscussionGroupOwnership(
              membershipId,
            );

    if (
      !result.success
    ) {
      window.alert(
        result.error,
      );

      setBusy(
        false,
      );

      return;
    }

    window.location.reload();
  }

  if (
    !moderatorCanAct
  ) {
    return null;
  }

  return (
    <div className="flex flex-wrap justify-end gap-1.5">
      <button
        type="button"
        disabled={busy}
        onClick={() =>
          void run(
            "REMOVE",
          )
        }
        className="rounded-md border border-[#D2C5B5] bg-white px-2.5 py-1.5 text-[8px] font-bold text-[#6D5D4A] disabled:opacity-50"
      >
        Remove
      </button>

      <button
        type="button"
        disabled={busy}
        onClick={() =>
          void run(
            "BAN",
          )
        }
        className="rounded-md border border-rose-200 bg-white px-2.5 py-1.5 text-[8px] font-bold text-rose-700 disabled:opacity-50"
      >
        Ban
      </button>

      {viewerRole ===
        "OWNER" && (
        <button
          type="button"
          disabled={busy}
          onClick={() =>
            void run(
              "TRANSFER",
            )
          }
          className="rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-[8px] font-bold text-amber-900 disabled:opacity-50"
        >
          Transfer owner
        </button>
      )}
    </div>
  );
}

// ============================================================
// BANNED MEMBER
// ============================================================

export function GroupUnbanAction({
  membershipId,
}: {
  membershipId: string;
}) {
  const [
    busy,
    setBusy,
  ] =
    useState(false);

  async function unban() {
    if (
      busy ||
      !window.confirm(
        "Unban thành viên này? Sau đó họ có thể tham gia/request lại theo join policy.",
      )
    ) {
      return;
    }

    setBusy(
      true,
    );

    const result =
      await unbanDiscussionGroupMember(
        membershipId,
      );

    if (
      !result.success
    ) {
      window.alert(
        result.error,
      );

      setBusy(
        false,
      );

      return;
    }

    window.location.reload();
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={() =>
        void unban()
      }
      className="rounded-md border border-[#B7A488] bg-white px-3 py-1.5 text-[8px] font-bold text-[#705A3F] disabled:opacity-50"
    >
      {busy
        ? "..."
        : "Unban"}
    </button>
  );
}
