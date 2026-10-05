"use client";

import React, { useState, useEffect } from "react";
import { toggleLike, getPostLikeStatus } from "@/app/actions/discussion";

interface LikeButtonProps {
  postId: string;
  initialLikes?: number;
  initialLiked?: boolean;
}

export default function LikeButton({
  postId,
  initialLikes = 0,
  initialLiked = false,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isPending, setIsPending] = useState(false);

  // Đồng bộ trạng thái like ban đầu từ DB nếu cần
  useEffect(() => {
    let isMounted = true;
    getPostLikeStatus(postId).then((res) => {
      if (isMounted && res) {
        if (typeof res.liked === "boolean") setLiked(res.liked);
        if (typeof res.likesCount === "number") setLikesCount(res.likesCount);
      }
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [postId]);

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPending) return;

    // 1. Optimistic UI update ngay lập tức
    const prevLiked = liked;
    const prevCount = likesCount;

    const nextLiked = !prevLiked;
    const nextCount = nextLiked ? prevCount + 1 : Math.max(0, prevCount - 1);

    setLiked(nextLiked);
    setLikesCount(nextCount);
    setIsPending(true);

    try {
      // 2. Gọi Server Action lưu trực tiếp vào Database
      const res = await toggleLike(postId);
      if (res && res.success) {
        // 3. Cập nhật lại state dựa trên kết quả trả về từ DB để đồng bộ tuyệt đối
        if (typeof res.liked === "boolean") {
          setLiked(res.liked);
        }
        if (typeof res.likesCount === "number") {
          setLikesCount(res.likesCount);
        }
      } else {
        // Rollback nếu thất bại
        setLiked(prevLiked);
        setLikesCount(prevCount);
        if (res?.error) {
          console.warn("Lỗi khi thích bài:", res.error);
        }
      }
    } catch (err) {
      // Rollback nếu xảy ra ngoại lệ
      console.error("Lỗi toggleLike:", err);
      setLiked(prevLiked);
      setLikesCount(prevCount);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggleLike}
      disabled={isPending}
      className={`flex items-center gap-1.5 transition-colors font-sans text-sm cursor-pointer select-none ${
        liked
          ? "text-[#8B6B4A] font-medium"
          : "text-gray-500 hover:text-gray-700"
      }`}
      aria-label={liked ? "Bỏ thích bài viết" : "Thích bài viết"}
    >
      <svg
        className={`w-4 h-4 transition-transform active:scale-125 ${
          liked ? "fill-current text-[#8B6B4A]" : "text-gray-500 fill-none"
        }`}
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      <span>
        {likesCount > 0 ? `${likesCount} Thích` : "Thích"}
      </span>
    </button>
  );
}
