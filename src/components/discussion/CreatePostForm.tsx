"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { createPost } from "@/app/actions/discussion";
import type { PostWithComments } from "./PostItem";

const MBTI_OPTIONS = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
];

const ENNEAGRAM_OPTIONS = [
  "Type 1", "Type 2", "Type 3",
  "Type 4", "Type 5", "Type 6",
  "Type 7", "Type 8", "Type 9",
];

interface CreatePostFormProps {
  onPostCreated?: (post: PostWithComments) => void;
  defaultTag?: string;
}

export default function CreatePostForm({
  onPostCreated,
  defaultTag = "Chung",
}: CreatePostFormProps) {
  const { isSignedIn, user } = useUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [personalityTag, setPersonalityTag] = useState(defaultTag);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isSignedIn) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    const res = await createPost({
      title,
      content,
      personalityTag,
    });

    if (res.success && res.post) {
      setTitle("");
      setContent("");
      setPersonalityTag("Chung");
      setSuccessMsg("Bài viết đã được khắc ghi thành công!");
      setTimeout(() => setSuccessMsg(null), 3000);

      if (onPostCreated) {
        onPostCreated({
          ...res.post,
          comments: [],
        });
      }
    } else {
      setError(res.error || "Không thể đăng bài viết.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="w-full bg-white border border-[#E2D4B7] rounded-xl p-5 md:p-6 shadow-sm mb-8 text-gray-800 font-sans">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E2D4B7] text-[#8B6B4A] flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden shadow-xs">
          {user?.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.imageUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            (user?.username || user?.firstName || "U").charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <h2 className="text-base font-serif font-bold text-[#5C4326]">
            Tạo bài thảo luận mới
          </h2>
          <p className="text-xs text-gray-500 font-sans">
            Chia sẻ góc nhìn, câu hỏi hoặc suy nghĩ với cộng đồng MOSAIC
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Tiêu đề */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tiêu đề bài viết..."
            maxLength={150}
            className="w-full bg-white border border-[#E2D4B7] rounded-md p-3 text-gray-800 font-sans focus:border-[#8B6B4A]"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Textarea Nội dung */}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Bạn đang suy nghĩ điều gì? Hãy chia sẻ chi tiết tại đây..."
            rows={4}
            className="w-full bg-white border border-[#E2D4B7] rounded-md p-3 text-gray-800 font-sans focus:border-[#8B6B4A]"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Lựa chọn Tag tính cách và nút Đăng */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <label
              htmlFor="personality-tag"
              className="text-xs font-sans font-semibold text-gray-600 shrink-0"
            >
              Chủ đề tính cách:
            </label>
            <select
              id="personality-tag"
              value={personalityTag}
              onChange={(e) => setPersonalityTag(e.target.value)}
              disabled={isSubmitting}
              className="text-xs font-sans font-medium px-3 py-2 bg-white border border-[#E2D4B7] text-gray-800 rounded-md focus:outline-none focus:border-[#8B6B4A] cursor-pointer"
            >
              <option value="Chung">Thảo luận chung</option>
              <optgroup label="MBTI (16 nhóm tính cách)">
                {MBTI_OPTIONS.map((mbti) => (
                  <option key={mbti} value={mbti}>
                    MBTI - {mbti}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Enneagram (9 nhóm)">
                {ENNEAGRAM_OPTIONS.map((enn) => (
                  <option key={enn} value={enn}>
                    Enneagram - {enn}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className="px-5 py-2.5 border border-[#C49A6C] bg-[#8B6B4A] hover:bg-[#5C4326] text-white text-xs md:text-sm font-sans font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer ml-auto active:scale-95 shadow-sm"
          >
            {isSubmitting ? "Đang ghi chép..." : "Đăng bài viết"}
          </button>
        </div>

        {error && <p className="text-xs text-rose-600 font-sans">{error}</p>}
        {successMsg && (
          <p className="text-xs text-emerald-600 font-sans font-medium">
            {successMsg}
          </p>
        )}
      </form>
    </div>
  );
}
