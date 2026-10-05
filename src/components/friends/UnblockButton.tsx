"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { unblockUser } from "@/app/actions/blocks";

export default function UnblockButton({
  userId,
}: {
  userId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] =
    useState(false);

  const handleUnblock =
    async () => {
      setLoading(true);

      const result =
        await unblockUser(userId);

      if (result.success) {
        router.refresh();
        return;
      }

      setLoading(false);
    };

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() =>
        void handleUnblock()
      }
      className="rounded-full border border-[#8B6B4A] px-4 py-2 text-xs font-semibold text-[#8B6B4A] transition hover:bg-[#8B6B4A] hover:text-white disabled:opacity-50"
    >
      {loading
        ? "Đang bỏ chặn..."
        : "Bỏ chặn"}
    </button>
  );
}
