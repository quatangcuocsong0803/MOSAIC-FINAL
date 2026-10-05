"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X, Sparkle, Compass } from "@/src/components/ui/Icons";
import type { DiscoverUserItem } from "@/app/actions/discover";
import UserCard from "./UserCard";

interface DiscoverClientProps {
  initialUsers: DiscoverUserItem[];
}

export default function DiscoverClient({ initialUsers }: DiscoverClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Phân loại danh sách người dùng tương đồng cao
  const matchedUsers = useMemo(() => {
    return initialUsers.filter((u) => u.isMatched);
  }, [initialUsers]);

  // Lấy tối đa 3 người có độ tương đồng cao nhất cho trang chính
  const topMatchedUsers = useMemo(() => {
    return matchedUsers.slice(0, 3);
  }, [matchedUsers]);

  // 2. Lọc danh sách theo từ khóa tìm kiếm (theo username)
  const searchResults = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) return [];

    return initialUsers.filter((u) => {
      const name = (u.username || `Thành viên #${u.id.slice(-4)}`).toLowerCase();
      return name.includes(trimmed);
    });
  }, [initialUsers, searchQuery]);

  const hasSearch = searchQuery.trim().length > 0;

  return (
    <div className="w-full flex flex-col items-center">
      {/* 3. THANH TÌM KIẾM BẠN BÈ */}
      <div className="w-full max-w-2xl mx-auto mb-10 relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B6B4A] w-[18px] h-[18px] pointer-events-none"
          strokeWidth={1.5}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm bạn bè theo tên đăng nhập..."
          className="w-full pl-12 pr-10 py-3 bg-white border border-[#E2D4B7] rounded-full text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#8B6B4A] focus:ring-1 focus:ring-[#8B6B4A] font-sans shadow-sm"
        />
        {hasSearch && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B6B4A] hover:text-[#5C4326] transition-colors cursor-pointer"
            aria-label="Xóa tìm kiếm"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* 4. HIỂN THỊ: KHI CÓ TỪ KHÓA TÌM KIẾM */}
      {hasSearch ? (
        <section className="w-full flex flex-col items-center mb-12">
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E2D4B7] w-full">
            <div>
              <h2 className="font-serif text-xl md:text-2xl font-bold tracking-wide text-[#5C4326]">
                Kết quả tìm kiếm
              </h2>
              <p className="text-xs md:text-sm text-[#A89F91] font-sans">
                Tìm thấy {searchResults.length} người dùng với từ khóa &ldquo;{searchQuery.trim()}&rdquo;
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-sans font-semibold bg-[#FCFBF8] text-[#8B6B4A] border border-[#8B6B4A] whitespace-nowrap">
              {searchResults.length} kết quả
            </span>
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
              {searchResults.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 border border-[#E2D4B7] text-center w-full max-w-md mx-auto shadow-sm my-4 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#FCFBF8] border border-[#8B6B4A]/30 flex items-center justify-center text-[#8B6B4A] mb-3">
                <Search className="w-5 h-5 text-[#8B6B4A]" strokeWidth={1.5} />
              </div>
              <h3 className="font-sans text-lg font-bold text-[#5C4326] mb-1">
                Không tìm thấy bạn bè
              </h3>
              <p className="text-xs md:text-sm text-[#6B5A46] font-sans">
                Không có người dùng nào khớp với tên &ldquo;{searchQuery.trim()}&rdquo;. Hãy thử với từ khóa khác nhé!
              </p>
            </div>
          )}
        </section>
      ) : (
        /* 5. HIỂN THỊ: GỢI Ý TƯƠNG ĐỒNG CAO (KHI Ô SEARCH TRỐNG) */
        <section className="mb-14 w-full flex flex-col items-center">
          <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-[#E2D4B7] w-full text-center sm:text-left">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#FCFBF8] border border-[#8B6B4A] flex items-center justify-center text-[#8B6B4A] shrink-0">
                <Sparkle className="w-4 h-4 text-[#8B6B4A]" strokeWidth={1.5} />
              </span>
              <div>
                <h2 className="font-serif text-xl md:text-2xl font-bold tracking-wide text-[#5C4326]">
                  Gợi ý tương đồng cao
                </h2>
                <p className="text-xs md:text-sm text-[#A89F91] font-sans">
                  Những thành viên có cùng kiểu nhận thức hoặc hệ thống phân loại tính cách với bạn
                </p>
              </div>
            </div>
            {matchedUsers.length > 0 && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-sans font-semibold bg-[#FCFBF8] text-[#8B6B4A] border border-[#8B6B4A] whitespace-nowrap">
                {matchedUsers.length} người phù hợp
              </span>
            )}
          </div>

          {topMatchedUsers.length > 0 ? (
            <>
              {/* Tối đa 3 thẻ người dùng trên trang chính */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                {topMatchedUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>

              {/* Nút Xem tất cả gợi ý */}
              {matchedUsers.length > 3 && (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="text-center mt-6 block w-full py-3 bg-[#FCFBF8] border border-[#E2D4B7] text-[#8B6B4A] rounded-xl hover:bg-[#8B6B4A] hover:text-white transition-colors font-sans cursor-pointer font-semibold shadow-xs"
                >
                  Xem tất cả gợi ý ({matchedUsers.length}) →
                </button>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl p-6 md:p-8 border border-[#E2D4B7] text-center w-full max-w-xl mx-auto my-4 shadow-sm flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#FCFBF8] border border-[#8B6B4A]/30 flex items-center justify-center text-[#8B6B4A] mb-3">
                <Compass className="w-6 h-6 text-[#8B6B4A]" strokeWidth={1.5} />
              </div>
              <h3 className="font-sans text-lg font-bold text-[#5C4326] mb-2">
                Chưa có gợi ý trùng tính cách
              </h3>
              <p className="text-xs md:text-sm text-[#6B5A46] leading-relaxed mb-6 font-sans tracking-wide">
                Hệ thống chưa tìm thấy thành viên có cùng kết quả MBTI hoặc Enneagram đã lưu.
                Hãy đảm bảo bạn đã hoàn thành bài test để hệ thống bắt đầu gợi ý chính xác nhé!
              </p>
              <Link
                href="/test"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-[#8B6B4A] bg-[#FCFBF8] text-[#8B6B4A] hover:bg-[#8B6B4A] hover:text-white font-sans tracking-wide font-semibold text-sm transition-all whitespace-nowrap"
              >
                Làm bài trắc nghiệm ngay →
              </Link>
            </div>
          )}
        </section>
      )}

      {/* 6. MODAL HIỂN THỊ ĐẦY ĐỦ TẤT CẢ GỢI Ý */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-[#E2D4B7] rounded-2xl w-full max-w-4xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#E2D4B7]/70 bg-[#FCFBF8]">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white border border-[#8B6B4A] flex items-center justify-center text-[#8B6B4A] shrink-0">
                  <Sparkle className="w-4 h-4 text-[#8B6B4A]" strokeWidth={1.5} />
                </span>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#5C4326]">
                    Tất cả gợi ý tương đồng ({matchedUsers.length})
                  </h3>
                  <p className="text-xs text-gray-500 font-sans">
                    Danh sách đầy đủ các thành viên có độ tương đồng cao với bạn
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full border border-[#E2D4B7] flex items-center justify-center text-[#8B6B4A] hover:text-[#5C4326] hover:bg-[#FCFBF8] transition-colors cursor-pointer"
                aria-label="Đóng cửa sổ"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-130px)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchedUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E2D4B7]/70 bg-[#FCFBF8] flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-white border border-[#8B6B4A] text-[#8B6B4A] hover:bg-[#8B6B4A] hover:text-white font-sans text-sm font-semibold transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
