"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { seedTestResults, clearTestResults } from "@/app/actions/statistics";

import { Zap, Trash2 } from "@/src/components/ui/Icons";

export default function SeedDataButton({ hasData }: { hasData: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  function handleSeed() {
    startTransition(async () => {
      try {
        setMessage(null);
        const res = await seedTestResults();
        setMessage(res.message);
        router.refresh();
      } catch (err) {
        console.error(err);
        setMessage("Lỗi kết nối khi sinh dữ liệu test.");
      }
    });
  }

  function handleClear() {
    if (!confirm("Bạn có chắc chắn muốn xóa toàn bộ dữ liệu test trong database?")) {
      return;
    }
    startTransition(async () => {
      try {
        setMessage(null);
        const res = await clearTestResults();
        setMessage(res.message);
        router.refresh();
      } catch (err) {
        console.error(err);
        setMessage("Lỗi kết nối khi xóa dữ liệu test.");
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-3 items-center justify-center sm:justify-end">
      {message && (
        <span className="text-sm font-sans font-medium text-emerald-700 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-md transition-all whitespace-nowrap">
          {message}
        </span>
      )}

      <div className="flex flex-wrap gap-3 items-center justify-center sm:justify-end">
        <button
          type="button"
          onClick={handleSeed}
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[#FAF8F5] hover:bg-[#8B6B4A] hover:text-white border border-[#8B6B4A] text-[#8B6B4A] text-sm font-sans font-semibold shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer whitespace-nowrap"
          title="Tạo ngẫu nhiên kết quả MBTI & Enneagram gán vào các User hiện có trong Database"
        >
          {isPending ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-[#8B6B4A] border-t-transparent rounded-full animate-spin" />
              <span>Đang tạo test...</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 text-current" strokeWidth={1.5} />
              <span>Tạo dữ liệu Test (Dev Only)</span>
            </>
          )}
        </button>

        {hasData && (
          <button
            type="button"
            onClick={handleClear}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md bg-white hover:bg-rose-50 border border-rose-300 hover:border-rose-500 text-rose-600 text-sm font-sans font-medium transition-all active:scale-95 disabled:opacity-50 cursor-pointer whitespace-nowrap"
            title="Xóa dữ liệu bài test để kiểm thử trạng thái rỗng"
          >
            {isPending ? (
              "..."
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5 text-current" strokeWidth={1.5} />
                <span>Xóa test</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
