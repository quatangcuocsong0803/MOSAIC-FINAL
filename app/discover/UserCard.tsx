"use client";

import Link from "next/link";
import { useTransition, useState } from "react";
import { Link2, Compass, UserPlus, Check } from "@/src/components/ui/Icons";
import {
  type DiscoverUserItem,
  type FriendStatus,
  sendFriendRequest,
  respondFriendRequest,
} from "@/app/actions/discover";

interface UserCardProps {
  user: DiscoverUserItem;
}

export default function UserCard({ user }: UserCardProps) {
  const [isPending, startTransition] = useTransition();
  const [currentStatus, setCurrentStatus] = useState<FriendStatus>(user.friendStatus);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Xử lý gửi lời mời kết bạn
  const handleSendRequest = () => {
    startTransition(async () => {
      setFeedback(null);
      const res = await sendFriendRequest(user.id);
      if (res.success) {
        setCurrentStatus("PENDING_SENT");
      } else {
        setFeedback(res.error || "Không thể gửi yêu cầu");
      }
    });
  };

  // Xử lý chấp nhận hoặc từ chối / hủy kết bạn
  const handleRespondRequest = (accept: boolean) => {
    startTransition(async () => {
      setFeedback(null);
      const res = await respondFriendRequest(user.id, accept);
      if (res.success) {
        setCurrentStatus(accept ? "FRIENDS" : "NONE");
      } else {
        setFeedback(res.error || "Không thể xử lý yêu cầu");
      }
    });
  };

  const displayName = user.username || `Thành viên #${user.id.slice(-4)}`;
  const avatarLetter = (displayName.trim()[0] || "M").toUpperCase();

  return (
    <div
      className={`relative bg-white rounded-xl p-5 border flex flex-col justify-between transition-all duration-300 hover:shadow-md ${
        user.isMatched
          ? "border-[#8B6B4A] ring-1 ring-[#8B6B4A]"
          : "border-[#E2D4B7]"
      }`}
    >
      <div>
        {/* Header card: Avatar + Username + Date */}
        <div className="flex items-center gap-3.5 mb-3.5">
          <div
            className={`w-12 h-12 rounded-full bg-[#FCFBF8] border border-[#8B6B4A] font-serif font-bold text-lg flex items-center justify-center shadow-sm select-none text-[#8B6B4A]`}
          >
            {avatarLetter}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-serif font-bold text-[#8B6B4A] truncate tracking-wide">
              {displayName}
            </h3>
            <p className="text-xs text-[#A89F91] font-sans font-medium tracking-wide">
              Gia nhập{" "}
              {new Date(user.createdAt).toLocaleDateString("vi-VN", {
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

        {/* Huy hiệu Match tinh tế */}
        {user.isMatched && (
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-semibold bg-[#FCFBF8] text-[#8B6B4A] border border-[#8B6B4A] whitespace-nowrap"
            title="Có cùng nhóm tính cách với bạn"
          >
            <Link2 className="w-3.5 h-3.5 text-[#8B6B4A]" strokeWidth={1.5} />
            <span>Match</span>
          </span>
        )}
      </div>

      {/* Nhãn nổi bật nếu có chung tính cách */}
      {user.isMatched && user.commonTraits.length > 0 && (
        <div className="mb-3.5 px-3 py-2 rounded-xl bg-[#FCFBF8] border border-[#E2D4B7] text-[#6B5A46] text-xs font-medium font-sans tracking-wide flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#8B6B4A] shrink-0" strokeWidth={1.5} />
          <span className="truncate">
            Cùng nhóm tính cách:{" "}
            <strong className="font-sans font-semibold text-[#5C4326]">
              {user.commonTraits.join(", ")}
            </strong>
          </span>
        </div>
      )}

      {/* Danh sách Badge tính cách (#INTP, #Type5,...) */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {user.testResults.length > 0 ? (
          user.testResults.map((test) => {
            const formattedName = test.resultName.startsWith("#")
              ? test.resultName
              : `#${test.resultName}`;
            const isCommon = user.commonTraits.some((trait) =>
              trait.toUpperCase().includes(test.resultName.toUpperCase())
            );

            return (
              <span
                key={test.id}
                className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-sans font-semibold tracking-wide transition-colors whitespace-nowrap ${
                  isCommon
                    ? "bg-[#8B6B4A] text-white"
                    : "bg-[#FCFBF8] text-[#8B6B4A] border border-[#E2D4B7]"
                }`}
              >
                {formattedName}
              </span>
            );
          })
        ) : (
          <span className="text-xs font-sans tracking-wide text-[#A89F91] italic">
            Chưa làm bài kiểm tra tính cách
          </span>
        )}
      </div>
    </div>

    {/* Thông báo lỗi nếu có */}
    {feedback && (
      <p className="text-xs text-red-500 mb-2 font-medium font-sans">{feedback}</p>
    )}

    {/* Nút bấm động theo trạng thái kết bạn */}
    <div className="pt-3 border-t border-[#E2D4B7] mt-1 flex items-center gap-2">
      {currentStatus === "NONE" && (
        <button
          type="button"
          disabled={isPending}
          onClick={handleSendRequest}
          className="w-full py-2.5 px-4 rounded-full text-sm font-sans tracking-wide font-semibold border border-[#8B6B4A] bg-[#FCFBF8] text-[#8B6B4A] hover:bg-[#8B6B4A] hover:text-white active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
        >
          {isPending ? (
            <span className="inline-block w-4 h-4 border-2 border-transparent border-t-[#8B6B4A] rounded-full animate-spin" />
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <UserPlus className="w-4 h-4" strokeWidth={1.5} />
              <span>Kết bạn</span>
            </span>
          )}
        </button>
      )}

      {currentStatus === "PENDING_SENT" && (
        <div className="w-full flex items-center justify-between gap-2">
          <button
            type="button"
            disabled
            className="flex-1 py-2 px-3 rounded-full text-sm font-sans font-medium text-[#A89F91] bg-gray-100 border border-gray-200 cursor-not-allowed text-center whitespace-nowrap"
          >
            Đã gửi yêu cầu
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleRespondRequest(false)}
            className="py-2 px-3 rounded-full text-sm font-sans font-semibold text-[#6B5A46] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer whitespace-nowrap"
            title="Hủy lời mời"
          >
            Hủy
          </button>
        </div>
      )}

      {currentStatus === "PENDING_RECEIVED" && (
        <div className="w-full grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleRespondRequest(true)}
            className="py-2 px-3 rounded-full text-sm font-sans font-semibold text-white bg-[#8B6B4A] hover:bg-[#6B5A46] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1 shadow-sm whitespace-nowrap"
          >
            {isPending ? (
              <span className="inline-block w-3.5 h-3.5 border-2 border-transparent border-t-white rounded-full animate-spin" />
            ) : (
              "Chấp nhận"
            )}
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleRespondRequest(false)}
            className="py-2 px-3 rounded-full text-sm font-sans font-semibold text-[#6B5A46] bg-[#FCFBF8] hover:bg-gray-100 hover:text-red-500 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 text-center border border-[#E2D4B7] whitespace-nowrap"
          >
            Xóa
          </button>
        </div>
      )}

      {currentStatus === "FRIENDS" && (
        <div className="w-full flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-sans font-semibold text-[#8B6B4A] bg-[#FCFBF8] border border-[#E2D4B7] whitespace-nowrap">
              <Check className="w-4 h-4 text-[#8B6B4A]" strokeWidth={1.5} />
              <span>Bạn bè</span>
            </span>

            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                if (
                  confirm(
                    `Bạn có chắc muốn hủy kết bạn với ${displayName}?`
                  )
                ) {
                  handleRespondRequest(false);
                }
              }}
              className="text-xs font-sans text-[#A89F91] hover:text-red-500 font-medium transition-colors cursor-pointer px-2 py-1 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy kết bạn
            </button>
          </div>

          <Link
            href={`/profile/${user.id}`}
            className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-full text-sm font-sans tracking-wide font-semibold border border-[#8B6B4A] bg-[#8B6B4A] text-white hover:bg-[#6B5A46] hover:border-[#6B5A46] active:scale-[0.99] transition-all"
          >
            Xem trang cá nhân →
          </Link>
        </div>
      )}
    </div>
    </div>
  );
}
