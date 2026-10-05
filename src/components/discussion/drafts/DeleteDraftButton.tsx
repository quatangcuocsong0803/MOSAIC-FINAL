"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  deleteDiscussionDraft,
} from "@/app/actions/discussion-drafts";

export default function DeleteDraftButton({
  draftId,
}: {
  draftId: string;
}) {
  const router =
    useRouter();

  const [
    deleting,
    setDeleting,
  ] =
    useState(false);

  async function remove() {
    if (
      deleting
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Xóa bản nháp này? Các attachment chưa được đăng cũng sẽ bị xóa.",
      );

    if (!confirmed) {
      return;
    }

    setDeleting(
      true,
    );

    const result =
      await deleteDiscussionDraft(
        draftId,
      );

    if (
      !result.success
    ) {
      window.alert(
        result.error,
      );

      setDeleting(
        false,
      );

      return;
    }

    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={
        deleting
      }
      onClick={() =>
        void remove()
      }
      className="rounded-lg border border-rose-200 bg-white px-3.5 py-2 text-[10px] font-bold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deleting
        ? "Đang xóa..."
        : "Xóa"}
    </button>
  );
}
