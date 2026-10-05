"use client";

import { useState } from "react";
import CommentSection from "./CommentSection";
import LikeButton from "./LikeButton";
import { Sparkle, MessageCircle } from "@/src/components/ui/Icons";
import type { Post, Comment } from "@prisma/client";

export type PostWithComments = Post & {
  comments: Comment[];
};

interface PostItemProps {
  post: PostWithComments;
  isRecommended?: boolean;
}

export default function PostItem({ post, isRecommended }: PostItemProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.comments.length);

  // Style cho personalityTag mang tone Vàng đồng
  const getTagBadgeStyle = (tag: string) => {
    return "bg-[#FAF8F5] text-[#8B6B4A] border-[#E2D4B7]";
  };

  return (
    <article className="w-full bg-white border border-[#E2D4B7] rounded-xl p-4 shadow-sm text-gray-800 font-sans">
      {/* Header bài viết */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E2D4B7] text-[#8B6B4A] flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden shadow-xs">
            {post.authorImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.authorImage}
                alt={post.authorName}
                className="w-full h-full object-cover"
              />
            ) : (
              post.authorName.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans font-semibold text-[#5C4326] text-sm md:text-base">
                {post.authorName}
              </span>
              {isRecommended && (
                <span className="inline-flex items-center gap-1 text-[11px] font-sans font-medium bg-[#FAF8F5] text-[#8B6B4A] border border-[#E2D4B7] px-2 py-0.5 rounded-sm">
                  <Sparkle className="w-3 h-3 text-[#8B6B4A]" strokeWidth={1.5} />
                  <span>Phù hợp với bạn</span>
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5 font-sans">
              {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Badge nhóm tính cách */}
        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-sm border ${getTagBadgeStyle(
            post.personalityTag
          )} shrink-0`}
        >
          {post.personalityTag === "Chung" ? "Chung" : `#${post.personalityTag}`}
        </span>
      </div>

      {/* Tiêu đề & Nội dung bài viết */}
      <div className="mb-4">
        <h3 className="font-sans text-base md:text-lg font-bold text-[#5C4326] mb-2 leading-snug">
          {post.title}
        </h3>
        <p className="text-sm md:text-base text-gray-700 whitespace-pre-line leading-relaxed font-sans">
          {post.content}
        </p>
      </div>

      {/* Thanh tác vụ bài viết (Actions) */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-[#E2D4B7]/60 font-sans">
        <div className="flex items-center gap-4">
          {/* Nút Thích */}
          <LikeButton postId={post.id} initialLikes={post.likesCount || 0} />

          {/* Nút Bình luận */}
          <button
            type="button"
            onClick={() => setShowComments((prev) => !prev)}
            className="flex items-center gap-1.5 hover:text-gray-700 transition-colors font-sans text-sm cursor-pointer text-gray-500"
          >
            <MessageCircle className="w-4 h-4 text-current" strokeWidth={1.5} />
            <span>
              {commentsCount === 0
                ? "Bình luận"
                : `${commentsCount} bình luận`}
            </span>
          </button>
        </div>

        <span className="text-[11px] text-gray-400 font-sans">
          Chủ đề: <strong className="text-[#8B6B4A] font-sans">{post.personalityTag}</strong>
        </span>
      </div>

      {/* Khu vực bình luận thả xuống */}
      {showComments && (
        <CommentSection
          postId={post.id}
          initialComments={post.comments}
          onCommentAdded={(newComment) => {
            setCommentsCount((prev) => prev + 1);
          }}
        />
      )}
    </article>
  );
}
