"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { getOrCreateConversation } from "@/app/actions/chat";

export default function StartChatButton({
  targetUserId,
}: {
  targetUserId: string;
}) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const handleStartChat =
    async () => {
      if (loading) {
        return;
      }

      setLoading(true);
      setError(null);

      const result =
        await getOrCreateConversation(
          targetUserId,
        );

      if (result.success) {
        router.push(
          `/messages/${result.conversationId}`,
        );

        return;
      }

      if (
        result.reason ===
        "NOT_FRIENDS"
      ) {
        setError(
          "Bạn chỉ có thể nhắn tin với bạn bè.",
        );
      } else {
        setError(
          "Không thể mở cuộc trò chuyện.",
        );
      }

      setLoading(false);
    };

  return (
    <div>
      <button
        type="button"
        disabled={loading}
        onClick={
          handleStartChat
        }
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#8B6B4A] bg-[#8B6B4A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6B5A46] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12c0 4.142-4.03 7.5-9 7.5a10.4 10.4 0 0 1-3.172-.487L3 21l1.987-4.139A6.89 6.89 0 0 1 3 12c0-4.142 4.03-7.5 9-7.5s9 3.358 9 7.5Z"
            />
          </svg>
        )}

        <span>
          {loading
            ? "Đang mở..."
            : "Nhắn tin"}
        </span>
      </button>

      {error && (
        <p className="mt-2 text-xs text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
