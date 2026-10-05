"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { blockUser } from "@/app/actions/blocks";
import { respondFriendRequest } from "@/app/actions/discover";
import StartChatButton from "@/src/components/messages/StartChatButton";

export default function FriendProfileActions({
  targetUserId,
  displayName,
}: {
  targetUserId: string;
  displayName: string;
}) {
  const router = useRouter();

  const [busy, setBusy] =
    useState<"UNFRIEND" | "BLOCK" | null>(
      null,
    );

  const [error, setError] =
    useState<string | null>(null);

  const handleUnfriend = async () => {
    if (
      !window.confirm(
        `Hủy kết bạn với ${displayName}?`,
      )
    ) {
      return;
    }

    setBusy("UNFRIEND");
    setError(null);

    const result =
      await respondFriendRequest(
        targetUserId,
        false,
      );

    if (!result.success) {
      setError(
        result.error ||
          "Không thể hủy kết bạn.",
      );

      setBusy(null);
      return;
    }

    router.push("/discover");
    router.refresh();
  };

  const handleBlock = async () => {
    if (
      !window.confirm(
        `Chặn ${displayName}?\n\nHai bạn sẽ bị hủy kết bạn, không thể xem hồ sơ, tìm nhau trên Discover hoặc nhắn tin cho nhau.`,
      )
    ) {
      return;
    }

    setBusy("BLOCK");
    setError(null);

    const result =
      await blockUser(
        targetUserId,
      );

    if (!result.success) {
      setError(
        "Không thể chặn người dùng lúc này.",
      );

      setBusy(null);
      return;
    }

    router.push("/discover");
    router.refresh();
  };

  return (
    <div className="space-y-3">
      <StartChatButton
        targetUserId={targetUserId}
      />

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() =>
            void handleUnfriend()
          }
          className="rounded-full border border-[#E2D4B7] bg-white px-3 py-2 text-xs font-semibold text-[#806D59] transition hover:border-[#B89B68]/50 hover:bg-[#FCFBF8] disabled:opacity-50"
        >
          {busy === "UNFRIEND"
            ? "Đang xử lý..."
            : "Hủy kết bạn"}
        </button>

        <button
          type="button"
          disabled={busy !== null}
          onClick={() =>
            void handleBlock()
          }
          className="rounded-full border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
        >
          {busy === "BLOCK"
            ? "Đang chặn..."
            : "Chặn"}
        </button>
      </div>

      {error && (
        <p className="text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
