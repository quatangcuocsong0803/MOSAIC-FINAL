"use client";

import {
  useState,
} from "react";

import {
  joinDiscussionGroup,
  leaveDiscussionGroup,
} from "@/app/actions/discussion-groups";

export default function GroupMembershipControls({
  groupId,
  joinPolicy,
  membership,
}: {
  groupId: string;

  joinPolicy:
    | "OPEN"
    | "APPROVAL"
    | "INVITE_ONLY";

  membership:
    {
      role:
        | "OWNER"
        | "MODERATOR"
        | "MEMBER";

      status:
        | "PENDING"
        | "ACTIVE"
        | "BANNED";
    } |
    null;
}) {
  const [
    busy,
    setBusy,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  async function join() {
    setBusy(
      true,
    );

    setError(
      null,
    );

    const result =
      await joinDiscussionGroup(
        groupId,
      );

    if (
      !result.success
    ) {
      setError(
        result.error,
      );

      setBusy(
        false,
      );

      return;
    }

    window.location.reload();
  }

  async function leave() {
    const message =
      membership?.status ===
      "PENDING"
        ? "Hủy yêu cầu tham gia nhóm?"
        : "Bạn có chắc muốn rời nhóm?";

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

    setError(
      null,
    );

    const result =
      await leaveDiscussionGroup(
        groupId,
      );

    if (
      !result.success
    ) {
      setError(
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
    membership?.role ===
      "OWNER" &&
    membership.status ===
      "ACTIVE"
  ) {
    return (
      <span className="rounded-lg border border-[#B69A73] bg-[#F2EBE1] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#745A38]">
        Owner
      </span>
    );
  }

  if (
    membership?.status ===
    "BANNED"
  ) {
    return (
      <span className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-[10px] font-bold text-rose-700">
        Không thể tham gia
      </span>
    );
  }

  if (
    membership?.status ===
    "PENDING"
  ) {
    return (
      <div>
        <button
          type="button"
          disabled={busy}
          onClick={() =>
            void leave()
          }
          className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-[10px] font-bold text-amber-900 disabled:opacity-50"
        >
          {busy
            ? "Đang xử lý..."
            : "Đang chờ duyệt · Hủy yêu cầu"}
        </button>

        {error && (
          <p className="mt-2 text-[9px] font-semibold text-rose-700">
            {error}
          </p>
        )}
      </div>
    );
  }

  if (
    membership?.status ===
    "ACTIVE"
  ) {
    return (
      <div>
        <button
          type="button"
          disabled={busy}
          onClick={() =>
            void leave()
          }
          className="rounded-lg border border-[#A98E6C] bg-white px-4 py-2 text-[10px] font-bold text-[#70583D] disabled:opacity-50"
        >
          {busy
            ? "Đang xử lý..."
            : membership.role ===
                "MODERATOR"
              ? "Moderator · Rời nhóm"
              : "Đã tham gia · Rời nhóm"}
        </button>

        {error && (
          <p className="mt-2 text-[9px] font-semibold text-rose-700">
            {error}
          </p>
        )}
      </div>
    );
  }

  if (
    joinPolicy ===
    "INVITE_ONLY"
  ) {
    return (
      <span className="rounded-lg border border-[#D8CCBC] bg-[#F6F2EC] px-4 py-2 text-[10px] font-bold text-[#82725F]">
        Chỉ tham gia bằng lời mời
      </span>
    );
  }

  return (
    <div>
      <button
        type="button"
        disabled={busy}
        onClick={() =>
          void join()
        }
        className="rounded-lg bg-[#6F5437] px-5 py-2.5 text-[10px] font-bold text-white transition hover:bg-[#543F2A] disabled:opacity-50"
      >
        {busy
          ? "Đang xử lý..."
          : joinPolicy ===
              "APPROVAL"
            ? "Gửi yêu cầu tham gia"
            : "Tham gia nhóm"}
      </button>

      {error && (
        <p className="mt-2 text-[9px] font-semibold text-rose-700">
          {error}
        </p>
      )}
    </div>
  );
}
