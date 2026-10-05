"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { getPosts } from "@/app/actions/discussion";
import CreatePostForm from "@/src/components/discussion/CreatePostForm";
import PostItem, { type PostWithComments } from "@/src/components/discussion/PostItem";
import {
  Edit3,
  Sparkle,
  Globe,
  Target,
} from "@/src/components/ui/Icons";

const STORAGE_KEYS = {
  MBTI: "mosaic_mbti_profile",
  ENNEAGRAM: "mosaic_enneagram_profile",
};

export default function DiscussionPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [posts, setPosts] = useState<PostWithComments[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [activeTab, setActiveTab] = useState<"for-you" | "all">("for-you");

  // Kết quả tính cách đọc từ localStorage của người dùng
  const [userMbti, setUserMbti] = useState<string | null>(null);
  const [userEnneagram, setUserEnneagram] = useState<string | null>(null);

  // 1. Đọc kết quả tính cách từ localStorage
  useEffect(() => {
    try {
      const localMbtiRaw = localStorage.getItem(STORAGE_KEYS.MBTI);
      if (localMbtiRaw) {
        const parsed = JSON.parse(localMbtiRaw);
        if (parsed.type) setUserMbti(parsed.type.toUpperCase());
      }

      const localEnneagramRaw = localStorage.getItem(STORAGE_KEYS.ENNEAGRAM);
      if (localEnneagramRaw) {
        const parsed = JSON.parse(localEnneagramRaw);
        if (parsed.type) setUserEnneagram(parsed.type);
      }
    } catch (e) {
      console.error("Lỗi đọc kết quả từ localStorage:", e);
    }
  }, []);

  // 2. Tải danh sách bài viết từ server
  useEffect(() => {
    async function fetchPosts() {
      setIsLoadingPosts(true);
      const res = await getPosts();
      if (res.success && res.posts) {
        setPosts(res.posts as PostWithComments[]);
      }
      setIsLoadingPosts(false);
    }

    fetchPosts();
  }, []);

  // Callback khi tạo bài viết mới thành công
  const handlePostCreated = (newPost: PostWithComments) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // 3. Thuật toán Lọc đề xuất bài viết (Recommendation)
  const userTags = useMemo(() => {
    const tags: string[] = [];
    if (userMbti) tags.push(userMbti);
    if (userEnneagram) tags.push(userEnneagram);
    return tags;
  }, [userMbti, userEnneagram]);

  const recommendedPosts = useMemo(() => {
    if (userTags.length === 0) return [];
    return posts.filter((post) => userTags.includes(post.personalityTag));
  }, [posts, userTags]);

  const displayedPosts = activeTab === "for-you" ? recommendedPosts : posts;

  return (
    <main className="w-full max-w-5xl mx-auto flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-3xl flex flex-col items-center">
        {/* Tiêu đề trang Thảo luận */}
        <div className="mb-8 text-center flex flex-col items-center">
          <h1 className="font-serif text-4xl md:text-5xl text-[#5C4326] font-bold text-center mb-3">
            THẢO LUẬN
          </h1>
          <p className="text-sm md:text-base text-[#6B5A46] max-w-xl font-sans tracking-wide leading-relaxed text-center">
            Nơi kết nối, trao đổi góc nhìn và thấu hiểu chiều sâu tâm lý theo từng nhóm tính cách cổ điển.
          </p>
        </div>

        {/* Khối Đăng bài viết mới */}
        {isLoaded && isSignedIn ? (
          <CreatePostForm
            onPostCreated={handlePostCreated}
            defaultTag={userMbti || userEnneagram || "Chung"}
          />
        ) : isLoaded && !isSignedIn ? (
          <div className="bg-white rounded-xl p-6 border border-[#E2D4B7] shadow-sm mb-8 text-center flex flex-col items-center w-full">
            <div className="w-12 h-12 bg-[#FCFBF8] border border-[#8B6B4A] rounded-full flex items-center justify-center mb-3 text-[#8B6B4A] shadow-sm">
              <Edit3 className="w-5 h-5 text-current" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-lg font-bold text-[#5C4326] mb-1">
              Tham gia thảo luận cùng MOSAIC
            </h2>
            <p className="text-xs md:text-sm text-[#6B5A46] mb-4 max-w-md font-sans tracking-wide">
              Đăng nhập để đăng bài viết, chia sẻ trải nghiệm và bình luận cùng các thành viên có cùng nhóm tính cách.
            </p>
            <Link
              href="/sign-in"
              className="px-6 py-2.5 border border-[#8B6B4A] bg-[#FCFBF8] text-[#8B6B4A] hover:bg-[#8B6B4A] hover:text-white text-sm font-sans tracking-wide font-semibold rounded-full transition-all shadow-sm whitespace-nowrap"
            >
              Đăng nhập ngay
            </Link>
          </div>
        ) : null}

        {/* Thanh chuyển đổi Tab (Recommendation / Tất cả) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2D4B7] pb-3 mb-6 w-full">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("for-you")}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-sans tracking-wide font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "for-you"
                  ? "bg-[#8B6B4A] border border-[#8B6B4A] text-white shadow-sm"
                  : "bg-[#FCFBF8] text-[#8B6B4A] hover:bg-gray-100 border border-[#E2D4B7]"
              }`}
            >
              <Sparkle className="w-3.5 h-3.5 text-current" strokeWidth={1.5} />
              <span>Dành riêng cho bạn</span>
              {userTags.length > 0 && (
                <span className="ml-0.5 text-xs opacity-80 font-normal">
                  ({userTags.join(", ")})
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-sans tracking-wide font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "all"
                  ? "bg-[#8B6B4A] border border-[#8B6B4A] text-white shadow-sm"
                  : "bg-[#FCFBF8] text-[#8B6B4A] hover:bg-gray-100 border border-[#E2D4B7]"
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-current" strokeWidth={1.5} />
              <span>Tất cả ({posts.length})</span>
            </button>
          </div>

          <span className="text-xs text-[#A89F91] hidden sm:inline font-sans font-medium whitespace-nowrap">
            {activeTab === "for-you"
              ? `${recommendedPosts.length} bài phù hợp`
              : `${posts.length} bài viết`}
          </span>
        </div>

        {/* Bảng tin (Feed) */}
        {isLoadingPosts ? (
          <div className="space-y-4 w-full">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-xl p-6 border border-[#E2D4B7] animate-pulse space-y-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="space-y-1.5 flex-1">
                    <div className="w-32 h-4 bg-gray-200 rounded-sm" />
                    <div className="w-20 h-3 bg-gray-200 rounded-sm" />
                  </div>
                </div>
                <div className="w-3/4 h-5 bg-gray-200 rounded-sm" />
                <div className="w-full h-12 bg-gray-200 rounded-sm" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 w-full">
            {/* Trường hợp Tab "Dành riêng cho bạn" nhưng chưa có dữ liệu test */}
            {activeTab === "for-you" && userTags.length === 0 ? (
              <div className="bg-white rounded-xl p-8 border border-[#E2D4B7] text-center shadow-sm w-full">
                <div className="w-14 h-14 bg-[#FCFBF8] border border-[#8B6B4A] rounded-full flex items-center justify-center mx-auto mb-3 text-[#8B6B4A] shadow-sm">
                  <Target className="w-6 h-6 text-current" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-base font-bold text-[#5C4326] mb-1">
                  Chưa có dữ liệu tính cách để đề xuất
                </h3>
                <p className="text-xs md:text-sm text-[#6B5A46] max-w-md mx-auto mb-5 leading-relaxed font-sans tracking-wide">
                  Bạn chưa thực hiện bài trắc nghiệm MBTI hoặc Enneagram. Hãy làm bài test để hệ thống tự động lọc các bài viết phù hợp nhất cho bạn!
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/test"
                    className="px-6 py-2.5 border border-[#8B6B4A] bg-[#FCFBF8] hover:bg-[#8B6B4A] hover:text-white text-[#8B6B4A] text-xs font-sans tracking-wide font-semibold rounded-full transition-all"
                  >
                    Làm bài trắc nghiệm ngay
                  </Link>
                  <button
                    type="button"
                    onClick={() => setActiveTab("all")}
                    className="px-6 py-2.5 bg-[#8B6B4A] hover:bg-[#6B5A46] text-white text-xs font-sans tracking-wide font-semibold rounded-full transition-all border border-[#8B6B4A] cursor-pointer"
                  >
                    Xem tất cả bài viết
                  </button>
                </div>
              </div>
            ) : displayedPosts.length === 0 ? (
              <div className="bg-white rounded-xl p-8 border border-[#E2D4B7] text-center shadow-sm w-full">
                <p className="text-[#6B5A46] font-sans tracking-wide text-sm">
                  {activeTab === "for-you"
                    ? `Chưa có bài viết nào với chủ đề tính cách (${userTags.join(", ")}). Hãy là người đầu tiên tạo bài viết!`
                    : "Chưa có bài viết nào trong cộng đồng. Hãy đăng bài viết đầu tiên!"}
                </p>
              </div>
            ) : (
              displayedPosts.map((post) => (
                <PostItem
                  key={post.id}
                  post={post}
                  isRecommended={
                    userTags.length > 0 && userTags.includes(post.personalityTag)
                  }
                />
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
