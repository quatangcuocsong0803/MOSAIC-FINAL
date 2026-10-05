"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  getUserProfile,
  updateUserProfile,
  saveManualPersonalityTypes,
  confirmManualPersonalityType,
  confirmTestPersonalityType,
  type UserProfileData,
  type TestResultItem,
} from "@/app/actions/profile";
import { revokeStatisticsConsent } from "@/app/actions/test";
import { getUserPosts, createPost } from "@/app/actions/discussion";
import { supabase } from "@/lib/supabase";
import { notifyAvatarUpdated } from "@/lib/avatar-events";
import type { Post, Comment } from "@prisma/client";
import { ZODIAC_ICONS } from "@/lib/zodiac";
import ProfileFormModal from "@/src/components/ProfileFormModal";
import CommentSection from "@/src/components/discussion/CommentSection";
import LikeButton from "@/src/components/discussion/LikeButton";
import {
  Cake,
  Star,
  Heart,
  MapPin,
  Info,
  Edit3,
  MessageCircle,
  Eye,
} from "@/src/components/ui/Icons";

// ==========================================
// 1. Types & Interfaces
// ==========================================
export interface UserProfile {
  name: string;
  avatar: string;
  role: string;
  joinedDate: string;
}

export interface MbtiProfileData {
  type: string;
  title: string;
  description: string;
  variant: string | null;
  testResultId: string;
  statisticsConsent: boolean;
  statisticsConsentRevokedAt: Date | null;
}

export interface EnneagramProfileData {
  type: string;
  name: string;
  description: string;
  variant: string | null;
  testResultId: string;
  statisticsConsent: boolean;
  statisticsConsentRevokedAt: Date | null;
}

export type PostWithComments = Post & {
  comments: Comment[];
};

// ==========================================
// 2. Bảng dịch danh xưng tiếng Việt chuẩn
// ==========================================
const MBTI_TITLES: Record<string, { title: string; desc: string }> = {
  INTJ: { title: "Nhà chiến lược", desc: "Tư duy chiến lược, độc lập và có tầm nhìn xa." },
  INTP: { title: "Nhà tư duy", desc: "Đam mê phân tích logic và tìm hiểu các quy luật." },
  ENTJ: { title: "Nhà chỉ huy", desc: "Tổ chức hiệu quả, quyết đoán và hướng tới kết quả." },
  ENTP: { title: "Người tranh biện", desc: "Sáng tạo, linh hoạt và không ngừng tìm tòi ý tưởng." },
  INFJ: { title: "Người cố vấn", desc: "Sâu sắc, thấu cảm và kiên định với lý tưởng." },
  INFP: { title: "Người hòa giải", desc: "Giàu lòng trắc ẩn, chân thành và tôn trọng giá trị riêng." },
  ENFJ: { title: "Người dẫn đường", desc: "Truyền cảm hứng, kết nối và nâng đỡ người khác." },
  ENFP: { title: "Người truyền cảm hứng", desc: "Nhiệt tình, giàu năng lượng và giàu trí tưởng tượng." },
  ISTJ: { title: "Người trách nhiệm", desc: "Kỷ luật, cẩn trọng, thực tế và đáng tin cậy." },
  ISFJ: { title: "Người bảo vệ", desc: "Tận tụy, chu đáo, ấm áp và tôn trọng truyền thống." },
  ESTJ: { title: "Người điều hành", desc: "Nguyên tắc, trật tự, quyết đoán và thực tế." },
  ESFJ: { title: "Người quan tâm", desc: "Thân thiện, hòa đồng và luôn chăm lo cho mọi người." },
  ISTP: { title: "Nhà kỹ thuật", desc: "Thực tế, thích trải nghiệm và giải quyết vấn đề." },
  ISFP: { title: "Người nghệ sĩ", desc: "Nhạy cảm, khiêm tốn, yêu chuộng cái đẹp và tự do." },
  ESTP: { title: "Người thực thi", desc: "Năng động, nhạy bén và thích ứng nhanh với tình huống." },
  ESFP: { title: "Người trình diễn", desc: "Lạc quan, nhiệt huyết và lan tỏa niềm vui." },
};

const ENNEAGRAM_TITLES: Record<number, { name: string; desc: string }> = {
  1: { name: "Người cầu toàn", desc: "Nguyên tắc, có trách nhiệm và luôn nỗ lực hoàn thiện." },
  2: { name: "Người giúp đỡ", desc: "Ấm áp, chu đáo và luôn quan tâm đến người khác." },
  3: { name: "Người thành đạt", desc: "Thích ứng, hướng tới mục tiêu và khát khao thành công." },
  4: { name: "Người cá tính", desc: "Sâu sắc, độc đáo và đề cao tính chân thật." },
  5: { name: "Người điều tra", desc: "Quan sát, ham học hỏi, độc lập và gìn giữ năng lượng." },
  6: { name: "Người trung thành", desc: "Đáng tin cậy, chu đáo và chuẩn bị trước rủi ro." },
  7: { name: "Người nhiệt huyết", desc: "Yêu tự do, lạc quan và luôn tìm kiếm điều mới mẻ." },
  8: { name: "Người thách thức", desc: "Mạnh mẽ, tự chủ, quyết đoán và bảo vệ người khác." },
  9: { name: "Người hòa giải", desc: "Điềm tĩnh, dễ gần, kiến tạo hòa hợp và ổn định." },
};

const MBTI_OPTIONS = Object.keys(MBTI_TITLES);

const ENNEAGRAM_WINGS: Record<number, [number, number]> = {
  1: [9, 2],
  2: [1, 3],
  3: [2, 4],
  4: [3, 5],
  5: [4, 6],
  6: [5, 7],
  7: [6, 8],
  8: [7, 9],
  9: [8, 1],
};

const HEART_TYPES = [2, 3, 4] as const;
const HEAD_TYPES = [5, 6, 7] as const;
const GUT_TYPES = [8, 9, 1] as const;

function getTritypeOptions(core: number | null): string[] {
  if (!core || core < 1 || core > 9) return [];

  const options: string[] = [];

  for (const heart of HEART_TYPES) {
    for (const head of HEAD_TYPES) {
      for (const gut of GUT_TYPES) {
        if (HEART_TYPES.includes(core as 2 | 3 | 4) && heart !== core) continue;
        if (HEAD_TYPES.includes(core as 5 | 6 | 7) && head !== core) continue;
        if (GUT_TYPES.includes(core as 8 | 9 | 1) && gut !== core) continue;

        options.push(`${heart}${head}${gut}`);
      }
    }
  }

  return options;
}

function extractMbtiType(raw: string): string | null {
  const match = raw.trim().toUpperCase().match(/^([IE][NS][TF][JP])$/);
  return match ? match[1] : null;
}

function extractEnneagramCore(raw: string): number | null {
  const match = raw.match(/[1-9]/);
  return match ? Number(match[0]) : null;
}

function formatDateOfBirth(dob: string | Date | null | undefined): string {
  if (!dob) return "Chưa cập nhật";
  const date = new Date(dob);
  if (isNaN(date.getTime())) return "Chưa cập nhật";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatPostDate(date: string | Date): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function buildMbtiProfileData(test: TestResultItem): MbtiProfileData {
  const normalizedResult = test.resultName.trim().toUpperCase();
  const codeMatch = normalizedResult.match(/\b([IE][NS][TF][JP])\b/);
  const isUnresolved = normalizedResult === "UNRESOLVED";
  const code = codeMatch ? codeMatch[1] : normalizedResult;

  const info = isUnresolved
    ? {
        title: "Kết quả chưa đủ rõ",
        desc: "Các tín hiệu hiện tại chưa đủ để xác định một MBTI type duy nhất.",
      }
    : MBTI_TITLES[code] ?? {
        title: "Nhóm tính cách",
        desc: "",
      };

  return {
    type: isUnresolved ? "Chưa xác định" : code,
    title: info.title,
    description: info.desc,
    variant: test.testVariant ?? null,
    testResultId: test.id,
    statisticsConsent: test.statisticsConsent,
    statisticsConsentRevokedAt: test.statisticsConsentRevokedAt,
  };
}

function buildEnneagramProfileData(
  test: TestResultItem
): EnneagramProfileData {
  const numMatch = test.resultName.match(/[1-9]/);
  const coreNum = numMatch ? parseInt(numMatch[0], 10) : 5;
  const info = ENNEAGRAM_TITLES[coreNum] ?? {
    name: "Kiểu hình tính cách",
    desc: "",
  };

  return {
    type: `Type ${coreNum}`,
    name: info.name,
    description: info.desc,
    variant: test.testVariant ?? null,
    testResultId: test.id,
    statisticsConsent: test.statisticsConsent,
    statisticsConsentRevokedAt: test.statisticsConsentRevokedAt,
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const { isSignedIn, isLoaded, user: clerkUser } = useUser();

  const [user, setUser] = useState<UserProfile>({
    name: "Đang tải...",
    avatar: "M",
    role: "Thành viên MOSAIC",
    joinedDate: "Gần đây",
  });

  const [profileDetails, setProfileDetails] = useState<UserProfileData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [mbti, setMbti] = useState<MbtiProfileData | null>(null);
  const [enneagram, setEnneagram] = useState<EnneagramProfileData | null>(null);
  const [authTimeout, setAuthTimeout] = useState(false);
  const [revokingConsentId, setRevokingConsentId] = useState<string | null>(null);
  const [consentFeedback, setConsentFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [manualMbtiSelection, setManualMbtiSelection] = useState("");
  const [manualEnneagramCore, setManualEnneagramCore] = useState("");
  const [manualEnneagramWing, setManualEnneagramWing] = useState("");
  const [manualEnneagramTritype, setManualEnneagramTritype] = useState("");
  const [savingPersonality, setSavingPersonality] = useState<string | null>(null);
  const [personalityFeedback, setPersonalityFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Danh sách bài viết cá nhân & Form đăng bài
  const [userPosts, setUserPosts] = useState<PostWithComments[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postTag, setPostTag] = useState("Chung");
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [postSuccess, setPostSuccess] = useState<string | null>(null);

  // Quản lý xem bình luận cho từng bài viết
  const [expandedPostComments, setExpandedPostComments] = useState<Record<string, boolean>>({});
  // Quản lý lượt thích cục bộ
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  // Sync auth timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthTimeout(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Lấy danh sách bài viết của user
  const fetchUserPostsList = async () => {
    setIsLoadingPosts(true);
    try {
      const res = await getUserPosts();
      if (res.success && res.posts) {
        setUserPosts(res.posts as PostWithComments[]);
      }
    } catch (err) {
      console.error("Lỗi khi tải bài viết:", err);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const syncProfileTestResults = (profile: UserProfileData) => {
    setProfileDetails(profile);

    const mbtiTest = profile.testResults.find(
      (test) =>
        test.testType.toUpperCase() === "MBTI" &&
        extractMbtiType(test.resultName) !== null
    );
    setMbti(mbtiTest ? buildMbtiProfileData(mbtiTest) : null);

    const enneagramTest = profile.testResults.find(
      (test) => test.testType.toUpperCase() === "ENNEAGRAM"
    );
    setEnneagram(
      enneagramTest ? buildEnneagramProfileData(enneagramTest) : null
    );

    setManualMbtiSelection(profile.manualMbtiType ?? "");

    const manualCore = profile.manualEnneagramType
      ? extractEnneagramCore(profile.manualEnneagramType)
      : null;

    setManualEnneagramCore(manualCore ? String(manualCore) : "");
    setManualEnneagramWing(profile.manualEnneagramWing ?? "");
    setManualEnneagramTritype(profile.manualEnneagramTritype ?? "");
  };

  const handleRevokeStatisticsConsent = async (
    testResultId: string,
    label: string
  ) => {
    if (revokingConsentId) return;

    const confirmed = window.confirm(
      `Thu hồi kết quả ${label} này khỏi Statistics? Kết quả bài test của bạn vẫn được giữ nguyên.`
    );

    if (!confirmed) return;

    setRevokingConsentId(testResultId);
    setConsentFeedback(null);

    try {
      const result = await revokeStatisticsConsent(testResultId);

      if (!result.success) {
        setConsentFeedback({
          type: "error",
          message: result.error || "Không thể thu hồi quyền chia sẻ Statistics.",
        });
        return;
      }

      const refreshed = await getUserProfile();
      if (refreshed.success && refreshed.profile) {
        syncProfileTestResults(refreshed.profile);
      }

      setConsentFeedback({
        type: "success",
        message:
          result.message ||
          "Đã thu hồi kết quả này khỏi Statistics. Kết quả bài test vẫn được giữ nguyên.",
      });

      router.refresh();
    } catch (error) {
      console.error("Lỗi khi thu hồi consent:", error);
      setConsentFeedback({
        type: "error",
        message: "Không thể thu hồi quyền chia sẻ Statistics lúc này.",
      });
    } finally {
      setRevokingConsentId(null);
    }
  };

  const refreshProfileIdentity = async () => {
    const refreshed = await getUserProfile();

    if (refreshed.success && refreshed.profile) {
      syncProfileTestResults(refreshed.profile);
      return refreshed.profile;
    }

    return null;
  };

  const handleUseManualMbti = async () => {
    if (!manualMbtiSelection || savingPersonality) return;

    setSavingPersonality("manual-mbti");
    setPersonalityFeedback(null);

    try {
      const saved = await saveManualPersonalityTypes({
        mbtiType: manualMbtiSelection,
      });

      if (!saved.success) {
        setPersonalityFeedback({
          type: "error",
          message: saved.error || "Không thể lưu MBTI thủ công.",
        });
        return;
      }

      const confirmed = await confirmManualPersonalityType("MBTI");

      if (!confirmed.success) {
        setPersonalityFeedback({
          type: "error",
          message: confirmed.error || "Không thể dùng MBTI thủ công làm type hiển thị.",
        });
        return;
      }

      if (confirmed.profile) {
        syncProfileTestResults(confirmed.profile);
      } else {
        await refreshProfileIdentity();
      }

      setPersonalityFeedback({
        type: "success",
        message: `Đã dùng ${manualMbtiSelection} làm MBTI đã xác nhận. Discover và Discussion sẽ dùng type này.`,
      });

      router.refresh();
    } catch (error) {
      console.error("Lỗi khi xác nhận MBTI thủ công:", error);
      setPersonalityFeedback({
        type: "error",
        message: "Không thể cập nhật MBTI lúc này.",
      });
    } finally {
      setSavingPersonality(null);
    }
  };

  const handleUseManualEnneagram = async () => {
    if (!manualEnneagramCore || savingPersonality) return;

    setSavingPersonality("manual-enneagram");
    setPersonalityFeedback(null);

    try {
      const saved = await saveManualPersonalityTypes({
        enneagramCore: Number(manualEnneagramCore),
        enneagramWing: manualEnneagramWing || null,
        enneagramTritype: manualEnneagramTritype || null,
      });

      if (!saved.success) {
        setPersonalityFeedback({
          type: "error",
          message: saved.error || "Không thể lưu Enneagram thủ công.",
        });
        return;
      }

      const confirmed = await confirmManualPersonalityType("ENNEAGRAM");

      if (!confirmed.success) {
        setPersonalityFeedback({
          type: "error",
          message:
            confirmed.error ||
            "Không thể dùng Enneagram thủ công làm type hiển thị.",
        });
        return;
      }

      if (confirmed.profile) {
        syncProfileTestResults(confirmed.profile);
      } else {
        await refreshProfileIdentity();
      }

      setPersonalityFeedback({
        type: "success",
        message:
          "Đã dùng Enneagram bạn chọn làm identity đã xác nhận. Discover và Discussion sẽ dùng lựa chọn này.",
      });

      router.refresh();
    } catch (error) {
      console.error("Lỗi khi xác nhận Enneagram thủ công:", error);
      setPersonalityFeedback({
        type: "error",
        message: "Không thể cập nhật Enneagram lúc này.",
      });
    } finally {
      setSavingPersonality(null);
    }
  };

  const handleUseTestResult = async (
    kind: "MBTI" | "ENNEAGRAM",
    testResultId: string
  ) => {
    if (savingPersonality) return;

    setSavingPersonality(`test-${kind.toLowerCase()}`);
    setPersonalityFeedback(null);

    try {
      const result = await confirmTestPersonalityType({
        kind,
        testResultId,
      });

      if (!result.success) {
        setPersonalityFeedback({
          type: "error",
          message:
            result.error ||
            "Không thể dùng kết quả test này làm type hiển thị.",
        });
        return;
      }

      if (result.profile) {
        syncProfileTestResults(result.profile);
      } else {
        await refreshProfileIdentity();
      }

      setPersonalityFeedback({
        type: "success",
        message:
          kind === "MBTI"
            ? "Đã dùng kết quả MBTI từ bài test làm type đã xác nhận."
            : "Đã dùng kết quả Enneagram từ bài test làm identity đã xác nhận.",
      });

      router.refresh();
    } catch (error) {
      console.error("Lỗi khi xác nhận result test:", error);
      setPersonalityFeedback({
        type: "error",
        message: "Không thể cập nhật type từ bài test lúc này.",
      });
    } finally {
      setSavingPersonality(null);
    }
  };

  // Sync User, Test Results, DB Profile & Posts
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !clerkUser) {
      return;
    }

    // 1. Đồng bộ thông tin người dùng từ Clerk
    const username = clerkUser.username || clerkUser.firstName || "Thành viên MOSAIC";
    setUser({
      name: username,
      avatar: username.charAt(0).toUpperCase(),
      role: "Thành viên MOSAIC",
      joinedDate: clerkUser.createdAt
        ? new Date(clerkUser.createdAt).toLocaleDateString("vi-VN", {
            month: "long",
            year: "numeric",
          })
        : "Gần đây",
    });

    // 2. Lấy thông tin từ Database
    getUserProfile().then((res) => {
      if (res.success && res.profile) {
        syncProfileTestResults(res.profile);
      }
    });

    // 3. Tải bài viết cá nhân
    fetchUserPostsList();
  }, [isLoaded, isSignedIn, clerkUser]);

  // Xử lý tạo bài viết mới
  const handleCreatePost = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const title = postTitle.trim();
    const content = postContent.trim();
    if (!title || !content || isSubmittingPost) return;

    setIsSubmittingPost(true);
    setPostError(null);
    setPostSuccess(null);

    const res = await createPost({
      title,
      content: postContent.trim(),
      personalityTag: postTag,
    });

    if (res.success && res.post) {
      setPostTitle("");
      setPostContent("");
      setPostTag("Chung");
      setPostSuccess("Bài viết đã được đăng lên dòng thời gian và mục Thảo luận!");
      setTimeout(() => setPostSuccess(null), 4000);
      // Tải lại danh sách bài viết
      fetchUserPostsList();
    } else {
      setPostError(res.error || "Không thể đăng bài viết lúc này.");
    }

    setIsSubmittingPost(false);
  };

  // Toggle xem bình luận
  const toggleComments = (postId: string) => {
    setExpandedPostComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Toggle thích bài viết
  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Loading state
  if (!isLoaded && !authTimeout) {
    return (
      <div className="min-h-[75vh] bg-[#FCFBF8] flex flex-col items-center justify-center gap-4 text-[#8B6B4A] relative overflow-hidden">
        <div className="w-10 h-10 border-2 border-[#E2D4B7] border-t-[#8B6B4A] rounded-full animate-spin shadow-sm" />
        <span className="text-xs font-sans tracking-wide uppercase font-semibold text-[#5C4326]">
          Đang lật mở hồ sơ cá nhân...
        </span>
      </div>
    );
  }

  // Not signed in state
  if (!isSignedIn) {
    return (
      <div className="min-h-[85vh] bg-[#FCFBF8] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden selection:bg-[#E2D4B7] selection:text-[#5C4326]">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#E2D4B7]/30 blur-[130px] rounded-full pointer-events-none" />

        <div className="relative bg-white border border-[#E2D4B7] rounded-xl p-8 sm:p-10 shadow-[0_4px_25px_-4px_rgba(139,107,74,0.12)] max-w-md w-full">
          <div className="w-16 h-16 bg-[#FAF8F5] border border-[#8B6B4A]/30 rounded-xl flex items-center justify-center mx-auto mb-5 text-[#8B6B4A] shadow-xs">
            <Eye className="w-8 h-8 text-[#8B6B4A]" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#5C4326] tracking-wide mb-2">
            Hồ Sơ Cá Nhân
          </h2>
          <p className="font-sans text-gray-600 text-xs sm:text-sm mb-6 leading-relaxed">
            Vui lòng đăng nhập để bước vào không gian chiêm tinh học và khám phá bản đồ tính cách của bạn.
          </p>
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-[#C49A6C] bg-[#8B6B4A] hover:bg-[#5C4326] text-white font-sans text-xs sm:text-sm font-semibold tracking-wide uppercase rounded-xl transition-all shadow-sm active:scale-95"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  // Parse hobbies into tags if available
  const hobbyList = profileDetails?.hobbies
    ? profileDetails.hobbies
        .split(/[,;\n]+/)
        .map((h) => h.trim())
        .filter(Boolean)
    : [];

  const confirmedMbtiCode = profileDetails?.confirmedMbtiType ?? null;
  const confirmedMbtiInfo = confirmedMbtiCode
    ? MBTI_TITLES[confirmedMbtiCode] ?? {
        title: "Nhóm tính cách",
        desc: "",
      }
    : null;

  const confirmedEnneagramCore = profileDetails?.confirmedEnneagramType
    ? extractEnneagramCore(profileDetails.confirmedEnneagramType)
    : null;

  const confirmedEnneagramInfo = confirmedEnneagramCore
    ? ENNEAGRAM_TITLES[confirmedEnneagramCore] ?? {
        name: "Kiểu hình tính cách",
        desc: "",
      }
    : null;

  const selectedMbtiTest = profileDetails?.confirmedMbtiTestResultId
    ? profileDetails.testResults.find(
        (test) => test.id === profileDetails.confirmedMbtiTestResultId
      ) ?? null
    : null;

  const selectedEnneagramTest = profileDetails?.confirmedEnneagramTestResultId
    ? profileDetails.testResults.find(
        (test) => test.id === profileDetails.confirmedEnneagramTestResultId
      ) ?? null
    : null;

  const manualCoreNumber = manualEnneagramCore
    ? Number(manualEnneagramCore)
    : null;

  const availableWings = manualCoreNumber
    ? ENNEAGRAM_WINGS[manualCoreNumber] ?? []
    : [];

  const tritypeOptions = getTritypeOptions(manualCoreNumber);

  const latestMbtiTestCode = mbti ? extractMbtiType(mbti.type) : null;
  const latestEnneagramTestCore = enneagram
    ? extractEnneagramCore(enneagram.type)
    : null;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center px-4 py-8">
      {/* ========================================================
          1. PHẦN HEADER (Căn giữa hoàn hảo)
          - Xóa bỏ "Thành viên MOSAIC" và "Tham gia tháng..."
          - Avatar to, tròn, nằm chính giữa có hiệu ứng hover đổi ảnh
          - Tên người dùng (H1) font-serif text-4xl font-bold text-[#5C4326] mt-4
          ======================================================== */}
      <div className="flex flex-col items-center w-full mb-6 text-center">
        {/* Avatar to, tròn với tính năng đổi ảnh khi hover */}
        <div className="relative">
          <label className="relative group cursor-pointer block w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-[#8B6B4A]/50 shadow-md bg-[#FAF8F5] transition-transform duration-300 hover:scale-105">
            {profileDetails?.avatarUrl || clerkUser?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profileDetails?.avatarUrl || clerkUser?.imageUrl}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl md:text-5xl font-serif font-bold text-[#5C4326] select-none">
                {user.avatar}
              </div>
            )}

            {/* Lớp phủ kính mờ màu đen và icon Camera khi hover */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {isUploadingAvatar ? (
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-1" />
              ) : (
                <svg
                  className="w-8 h-8 text-white mb-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
              <span className="text-[11px] font-sans font-medium text-white/90">
                {isUploadingAvatar ? "Đang lưu..." : "Đổi ảnh"}
              </span>
            </div>

            {/* Input file ẩn, tải ảnh trực tiếp lên Supabase */}
            <input
              type="file"
              accept="image/*"
              disabled={isUploadingAvatar}
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) {
                  console.error("Chưa nhận được file từ input!");
                  return;
                }
                setIsUploadingAvatar(true);

                // Trích xuất đuôi file một cách an toàn (mặc định png nếu lỗi)
                const rawExt = file.name.split('.').pop() || 'png';
                const fileExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';

                // Tạo tên file mới hoàn toàn ngẫu nhiên và sạch sẽ (vd: avatar_1728000000_abc123.png)
                const cleanFilePath = `avatar_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

                console.log("Đường dẫn file chuẩn bị upload:", cleanFilePath);

                try {
                  const { data, error } = await supabase.storage
                    .from('mosaic-media') // Đảm bảo đúng tên bucket
                    .upload(cleanFilePath, file, {
                      cacheControl: '3600',
                      upsert: false,
                    });

                  if (error) {
                    console.error("Lỗi từ máy chủ Supabase:", error);
                    throw new Error(error.message);
                  }

                  // Lấy link hiển thị
                  const { data: publicUrlData } = supabase.storage
                    .from('mosaic-media')
                    .getPublicUrl(cleanFilePath);

                  console.log("Upload thành công, Link ảnh:", publicUrlData.publicUrl);

                  if (publicUrlData?.publicUrl) {
                    const res = await updateUserProfile({ avatarUrl: publicUrlData.publicUrl });
                    if (res.success && res.profile) {
                      setProfileDetails(res.profile);
                      notifyAvatarUpdated(res.profile.avatarUrl ?? null);
                      router.refresh();
                    } else {
                      console.error("Lưu avatarUrl vào DB thất bại:", res.error);
                      alert(res.error || "Không thể lưu ảnh đại diện.");
                    }
                  }
                } catch (err: any) {
                  console.error("Lỗi trong quá trình upload:", err);
                  alert(`Tải ảnh thất bại. Xem chi tiết trong F12 Console.`);
                } finally {
                  setIsUploadingAvatar(false);
                  e.target.value = "";
                }
              }}
            />
          </label>
        </div>

        {/* Tên người dùng */}
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#5C4326] mt-4">
          {user.name}
        </h1>
      </div>

      {/* ========================================================
          2. BỐ CỤC CHÍNH (Chia 2 cột Grid)
          ======================================================== */}
      <div className="w-full max-w-5xl mx-auto mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ========================================================
            3. CỘT TRÁI (md:col-span-1 - Chứa Thông tin & Trắc nghiệm)
            ======================================================== */}
        <div className="md:col-span-1 flex flex-col">
          {/* Khối 1: Nút "Chỉnh sửa hồ sơ" */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="w-full bg-[#FCFBF8] border border-[#8B6B4A] text-[#8B6B4A] py-2 rounded-md font-sans font-semibold hover:bg-[#8B6B4A] hover:text-white mb-4 transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-current" strokeWidth={1.5} />
            <span>Chỉnh sửa hồ sơ</span>
          </button>

          {/* Khối 2: "Thông tin cá nhân" (Intro Card) */}
          <div className="bg-white border border-[#E2D4B7] rounded-xl p-4 shadow-sm text-gray-700 font-sans mb-6">
            <div className="flex items-center justify-between border-b border-[#E2D4B7]/60 pb-2 mb-4">
              <h2 className="text-xs font-bold tracking-wider uppercase text-[#8B6B4A] font-sans flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#8B6B4A]" strokeWidth={1.5} />
                <span>THÔNG TIN CÁ NHÂN</span>
              </h2>
            </div>

            <div className="flex flex-col gap-6 text-sm">
              {/* Ngày sinh */}
              <div className="flex items-start gap-4">
                <Cake className="w-4 h-4 text-[#8B6B4A] stroke-[1.5] shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <span className="text-xs text-[#8B6B4A] font-medium block">Ngày sinh</span>
                  <span className="font-semibold text-gray-800">
                    {formatDateOfBirth(profileDetails?.dateOfBirth)}
                  </span>
                </div>
              </div>

              {/* Cung hoàng đạo */}
              <div className="flex items-start gap-4">
                <Star className="w-4 h-4 text-[#8B6B4A] stroke-[1.5] shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <span className="text-xs text-[#8B6B4A] font-medium block">Cung hoàng đạo</span>
                  <span className="font-semibold text-[#5C4326] flex items-center gap-1.5">
                    {profileDetails?.zodiacSign ? (
                      <>
                        <span className="font-serif text-base text-[#8B6B4A] [font-variant-emoji:text] select-none">
                          {ZODIAC_ICONS[profileDetails.zodiacSign]}
                        </span>
                        <span>{profileDetails.zodiacSign}</span>
                      </>
                    ) : (
                      "Chưa cập nhật"
                    )}
                  </span>
                </div>
              </div>

              {/* Sở thích */}
              <div className="flex items-start gap-4">
                <Heart className="w-4 h-4 text-[#8B6B4A] stroke-[1.5] shrink-0 mt-0.5" strokeWidth={1.5} />
                <div className="flex-1">
                  <span className="text-xs text-[#8B6B4A] font-medium block mb-1">Sở thích</span>
                  {hobbyList.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {hobbyList.map((h, i) => (
                        <span
                          key={i}
                          className="text-xs px-2.5 py-1 rounded bg-[#FAF8F5] border border-[#E2D4B7] text-[#8B6B4A] font-medium"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic text-xs">Chưa cập nhật</span>
                  )}
                </div>
              </div>

              {/* Địa chỉ sống */}
              <div className="flex items-start gap-4">
                <MapPin className="w-4 h-4 text-[#8B6B4A] stroke-[1.5] shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <span className="text-xs text-[#8B6B4A] font-medium block">Địa chỉ sống</span>
                  <span
                    className={`font-medium ${
                      profileDetails?.location ? "text-gray-800" : "text-gray-400 italic text-xs"
                    }`}
                  >
                    {profileDetails?.location || "Chưa cập nhật"}
                  </span>
                </div>
              </div>

              {/* Mô tả bản thân / Bio */}
              <div className="flex items-start gap-4 pt-3 border-t border-[#E2D4B7]/40">
                <Info className="w-4 h-4 text-[#8B6B4A] stroke-[1.5] shrink-0 mt-0.5" strokeWidth={1.5} />
                <div className="flex-1">
                  <span className="text-xs text-[#8B6B4A] font-medium block">Mô tả bản thân</span>
                  <p
                    className={`text-xs leading-relaxed whitespace-pre-line ${
                      profileDetails?.bio ? "text-gray-700 italic" : "text-gray-400 italic"
                    }`}
                  >
                    {profileDetails?.bio ? `"${profileDetails.bio}"` : "Chưa cập nhật"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Khối 3: Personality identity */}
          <div className="bg-white border border-[#E2D4B7] rounded-xl p-4 shadow-sm text-gray-700 font-sans mb-6">
            <div className="flex items-center justify-between border-b border-[#E2D4B7]/60 pb-2 mb-3">
              <div>
                <h2 className="font-serif text-[#5C4326] text-xl font-bold">
                  Type đã xác nhận
                </h2>
                <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                  Profile, Discover và Discussion sẽ dùng type bạn xác nhận ở đây.
                </p>
              </div>
              <Link
                href="/test"
                className="text-xs font-sans font-semibold text-[#8B6B4A] hover:text-[#5C4326] transition-colors shrink-0"
              >
                Làm test →
              </Link>
            </div>

            <div className="flex flex-col gap-4">
              {personalityFeedback && (
                <div
                  className={`rounded-lg border px-3 py-2 text-xs leading-relaxed ${
                    personalityFeedback.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {personalityFeedback.message}
                </div>
              )}

              {consentFeedback && (
                <div
                  className={`rounded-lg border px-3 py-2 text-xs leading-relaxed ${
                    consentFeedback.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {consentFeedback.message}
                </div>
              )}

              {/* ==================================================
                  MBTI
                  ================================================== */}
              <section className="rounded-xl border border-[#E2D4B7] bg-[#FAF8F5] p-3">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#8B6B4A]">
                      MBTI
                    </div>

                    {confirmedMbtiCode && confirmedMbtiInfo ? (
                      <>
                        <div className="font-serif text-2xl font-bold text-[#5C4326] mt-0.5">
                          {confirmedMbtiCode}
                        </div>
                        <div className="text-xs font-semibold text-[#8B6B4A]">
                          {confirmedMbtiInfo.title}
                        </div>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                          {confirmedMbtiInfo.desc}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="font-serif text-lg font-bold text-[#5C4326] mt-1">
                          Chưa xác nhận
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Chọn thủ công hoặc dùng một kết quả test bên dưới.
                        </p>
                      </>
                    )}
                  </div>

                  {confirmedMbtiCode && (
                    <span className="inline-flex shrink-0 items-center rounded-full border border-[#E2D4B7] bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8B6B4A]">
                      {profileDetails?.confirmedMbtiSource === "TEST"
                        ? "Theo bài test"
                        : "Tự chọn"}
                    </span>
                  )}
                </div>

                {profileDetails?.confirmedMbtiSource === "TEST" &&
                  selectedMbtiTest && (
                    <div className="mb-3 rounded-lg border border-[#E2D4B7]/80 bg-white px-3 py-2 text-[10px] text-gray-500">
                      Nguồn đang dùng:{" "}
                      <strong className="text-[#8B6B4A]">
                        {selectedMbtiTest.testVariant === "AI_ADAPTIVE"
                          ? "AI Adaptive"
                          : selectedMbtiTest.testVariant === "TRADITIONAL_72"
                            ? "Traditional · 72 câu"
                            : "Bài test MBTI"}
                      </strong>
                    </div>
                  )}

                {/* Manual MBTI selector */}
                <div className="border-t border-[#E2D4B7]/70 pt-3">
                  <label className="block text-[11px] font-semibold text-[#5C4326] mb-1.5">
                    Tự chọn MBTI
                  </label>

                  <div className="flex flex-col gap-2">
                    <select
                      value={manualMbtiSelection}
                      onChange={(e) => setManualMbtiSelection(e.target.value)}
                      className="w-full rounded-lg border border-[#E2D4B7] bg-white px-3 py-2 text-xs text-gray-700 outline-none focus:border-[#8B6B4A]"
                    >
                      <option value="">Chọn 1 trong 16 type</option>
                      {MBTI_OPTIONS.map((type) => (
                        <option key={type} value={type}>
                          {type} · {MBTI_TITLES[type].title}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={handleUseManualMbti}
                      disabled={!manualMbtiSelection || savingPersonality !== null}
                      className="w-full rounded-lg bg-[#8B6B4A] px-3 py-2 text-[11px] font-semibold text-white hover:bg-[#5C4326] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {savingPersonality === "manual-mbti"
                        ? "Đang lưu..."
                        : profileDetails?.confirmedMbtiSource === "MANUAL" &&
                            profileDetails.confirmedMbtiType === manualMbtiSelection
                          ? "Đang dùng type tự chọn này"
                          : "Dùng type tôi chọn"}
                    </button>
                  </div>

                  <p className="mt-1.5 text-[10px] text-gray-400 leading-relaxed">
                    Không thể nhập text tự do. Server cũng chỉ chấp nhận đúng 16 MBTI type chuẩn.
                  </p>
                </div>

                {/* Latest MBTI test */}
                {mbti && latestMbtiTestCode && (
                  <div className="mt-3 border-t border-[#E2D4B7]/70 pt-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                          Kết quả test gần nhất
                        </div>
                        <div className="mt-0.5 text-sm font-bold text-[#5C4326]">
                          {latestMbtiTestCode}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {mbti.variant === "AI_ADAPTIVE"
                            ? "AI Adaptive"
                            : mbti.variant === "TRADITIONAL_72"
                              ? "Traditional · 72 câu"
                              : "Bài test MBTI"}
                        </div>
                      </div>

                      {profileDetails?.confirmedMbtiSource === "TEST" &&
                      profileDetails.confirmedMbtiTestResultId === mbti.testResultId ? (
                        <span className="text-[10px] font-semibold text-emerald-700">
                          ✓ Đang dùng
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            handleUseTestResult("MBTI", mbti.testResultId)
                          }
                          disabled={savingPersonality !== null}
                          className="shrink-0 rounded-md border border-[#C9B99B] bg-white px-2.5 py-1.5 text-[10px] font-semibold text-[#8B6B4A] hover:border-[#8B6B4A] hover:bg-[#F7F2E9] transition-colors disabled:opacity-50"
                        >
                          {savingPersonality === "test-mbti"
                            ? "Đang chọn..."
                            : "Dùng kết quả test"}
                        </button>
                      )}
                    </div>

                    {confirmedMbtiCode &&
                      profileDetails?.confirmedMbtiTestResultId !== mbti.testResultId &&
                      confirmedMbtiCode !== latestMbtiTestCode && (
                        <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[10px] leading-relaxed text-amber-800">
                          Bài test mới cho kết quả <strong>{latestMbtiTestCode}</strong>, trong khi
                          type đang xác nhận là <strong>{confirmedMbtiCode}</strong>. Bạn có thể
                          giữ type hiện tại hoặc chọn “Dùng kết quả test”.
                        </div>
                      )}

                    <div className="mt-2 pt-2 border-t border-[#E2D4B7]/60">
                      {mbti.statisticsConsent ? (
                        <div className="flex flex-col gap-2">
                          <p className="text-[10px] font-semibold text-emerald-700">
                            ✓ Kết quả test này đang đóng góp cho Statistics
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              handleRevokeStatisticsConsent(
                                mbti.testResultId,
                                "MBTI / Cognitive Functions"
                              )
                            }
                            disabled={revokingConsentId === mbti.testResultId}
                            className="w-full rounded-md border border-[#C9B99B] bg-white px-3 py-2 text-[10px] font-semibold text-[#8B6B4A] hover:border-[#8B6B4A] hover:bg-[#F7F2E9] transition-colors disabled:opacity-50"
                          >
                            {revokingConsentId === mbti.testResultId
                              ? "Đang thu hồi..."
                              : "Thu hồi khỏi Statistics"}
                          </button>
                        </div>
                      ) : (
                        <p className="text-[10px] text-gray-500">
                          {mbti.statisticsConsentRevokedAt
                            ? "Đã thu hồi chia sẻ Statistics cho kết quả test này."
                            : "Kết quả test này không được chia sẻ cho Statistics."}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </section>

              {/* ==================================================
                  ENNEAGRAM
                  ================================================== */}
              <section className="rounded-xl border border-[#E2D4B7] bg-[#FAF8F5] p-3">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#8B6B4A]">
                      Enneagram
                    </div>

                    {confirmedEnneagramCore && confirmedEnneagramInfo ? (
                      <>
                        <div className="font-serif text-2xl font-bold text-[#5C4326] mt-0.5">
                          Type {confirmedEnneagramCore}
                          {profileDetails?.confirmedEnneagramWing
                            ? ` · ${profileDetails.confirmedEnneagramWing}`
                            : ""}
                        </div>

                        <div className="text-xs font-semibold text-[#8B6B4A]">
                          {confirmedEnneagramInfo.name}
                        </div>

                        {profileDetails?.confirmedEnneagramTritype && (
                          <div className="mt-1 text-[11px] text-gray-600">
                            Tritype:{" "}
                            <strong className="text-[#5C4326]">
                              {profileDetails.confirmedEnneagramTritype}
                            </strong>
                          </div>
                        )}

                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                          {confirmedEnneagramInfo.desc}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="font-serif text-lg font-bold text-[#5C4326] mt-1">
                          Chưa xác nhận
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Chọn Core, Wing và Tritype hoặc dùng kết quả test.
                        </p>
                      </>
                    )}
                  </div>

                  {confirmedEnneagramCore && (
                    <span className="inline-flex shrink-0 items-center rounded-full border border-[#E2D4B7] bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8B6B4A]">
                      {profileDetails?.confirmedEnneagramSource === "TEST"
                        ? "Theo bài test"
                        : "Tự chọn"}
                    </span>
                  )}
                </div>

                {profileDetails?.confirmedEnneagramSource === "TEST" &&
                  selectedEnneagramTest && (
                    <div className="mb-3 rounded-lg border border-[#E2D4B7]/80 bg-white px-3 py-2 text-[10px] text-gray-500">
                      Nguồn đang dùng:{" "}
                      <strong className="text-[#8B6B4A]">
                        {selectedEnneagramTest.testVariant === "TRADITIONAL"
                          ? "Enneagram Traditional"
                          : "Bài test Enneagram"}
                      </strong>
                    </div>
                  )}

                {/* Manual Enneagram selectors */}
                <div className="border-t border-[#E2D4B7]/70 pt-3">
                  <div className="text-[11px] font-semibold text-[#5C4326] mb-2">
                    Tự chọn Enneagram
                  </div>

                  <div className="flex flex-col gap-2">
                    <select
                      value={manualEnneagramCore}
                      onChange={(e) => {
                        const nextCore = e.target.value;
                        setManualEnneagramCore(nextCore);
                        setManualEnneagramWing("");
                        setManualEnneagramTritype("");
                      }}
                      className="w-full rounded-lg border border-[#E2D4B7] bg-white px-3 py-2 text-xs text-gray-700 outline-none focus:border-[#8B6B4A]"
                    >
                      <option value="">Chọn Core Type</option>
                      {Object.keys(ENNEAGRAM_TITLES).map((num) => (
                        <option key={num} value={num}>
                          Type {num} · {ENNEAGRAM_TITLES[Number(num)].name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={manualEnneagramWing}
                      onChange={(e) => setManualEnneagramWing(e.target.value)}
                      disabled={!manualEnneagramCore}
                      className="w-full rounded-lg border border-[#E2D4B7] bg-white px-3 py-2 text-xs text-gray-700 outline-none focus:border-[#8B6B4A] disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <option value="">Wing: chưa chọn</option>
                      {manualCoreNumber &&
                        availableWings.map((wing) => (
                          <option
                            key={`${manualCoreNumber}w${wing}`}
                            value={`${manualCoreNumber}w${wing}`}
                          >
                            {manualCoreNumber}w{wing}
                          </option>
                        ))}
                    </select>

                    <select
                      value={manualEnneagramTritype}
                      onChange={(e) => setManualEnneagramTritype(e.target.value)}
                      disabled={!manualEnneagramCore}
                      className="w-full rounded-lg border border-[#E2D4B7] bg-white px-3 py-2 text-xs text-gray-700 outline-none focus:border-[#8B6B4A] disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <option value="">Tritype: chưa chọn</option>
                      {tritypeOptions.map((code) => (
                        <option key={code} value={code}>
                          {code}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={handleUseManualEnneagram}
                      disabled={!manualEnneagramCore || savingPersonality !== null}
                      className="w-full rounded-lg bg-[#8B6B4A] px-3 py-2 text-[11px] font-semibold text-white hover:bg-[#5C4326] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {savingPersonality === "manual-enneagram"
                        ? "Đang lưu..."
                        : profileDetails?.confirmedEnneagramSource === "MANUAL" &&
                            profileDetails.confirmedEnneagramType ===
                              `Type ${manualEnneagramCore}` &&
                            (profileDetails.confirmedEnneagramWing ?? "") ===
                              manualEnneagramWing &&
                            (profileDetails.confirmedEnneagramTritype ?? "") ===
                              manualEnneagramTritype
                          ? "Đang dùng lựa chọn này"
                          : "Dùng Enneagram tôi chọn"}
                    </button>
                  </div>

                  <p className="mt-1.5 text-[10px] text-gray-400 leading-relaxed">
                    Wing chỉ hiện 2 wing hợp lệ của Core. Tritype chỉ hiện các tổ hợp
                    Heart–Head–Gut hợp lệ và luôn chứa Core ở đúng center.
                  </p>
                </div>

                {/* Latest Enneagram test */}
                {enneagram && latestEnneagramTestCore && (
                  <div className="mt-3 border-t border-[#E2D4B7]/70 pt-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                          Kết quả test gần nhất
                        </div>

                        <div className="mt-0.5 text-sm font-bold text-[#5C4326]">
                          Type {latestEnneagramTestCore}
                        </div>

                        <div className="text-[10px] text-gray-500">
                          {enneagram.variant === "TRADITIONAL"
                            ? "Enneagram Traditional"
                            : "Bài test Enneagram"}
                        </div>
                      </div>

                      {profileDetails?.confirmedEnneagramSource === "TEST" &&
                      profileDetails.confirmedEnneagramTestResultId ===
                        enneagram.testResultId ? (
                        <span className="text-[10px] font-semibold text-emerald-700">
                          ✓ Đang dùng
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            handleUseTestResult(
                              "ENNEAGRAM",
                              enneagram.testResultId
                            )
                          }
                          disabled={savingPersonality !== null}
                          className="shrink-0 rounded-md border border-[#C9B99B] bg-white px-2.5 py-1.5 text-[10px] font-semibold text-[#8B6B4A] hover:border-[#8B6B4A] hover:bg-[#F7F2E9] transition-colors disabled:opacity-50"
                        >
                          {savingPersonality === "test-enneagram"
                            ? "Đang chọn..."
                            : "Dùng kết quả test"}
                        </button>
                      )}
                    </div>

                    {confirmedEnneagramCore &&
                      profileDetails?.confirmedEnneagramTestResultId !==
                        enneagram.testResultId &&
                      confirmedEnneagramCore !== latestEnneagramTestCore && (
                        <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[10px] leading-relaxed text-amber-800">
                          Bài test mới cho kết quả{" "}
                          <strong>Type {latestEnneagramTestCore}</strong>, trong khi
                          identity đang xác nhận là{" "}
                          <strong>Type {confirmedEnneagramCore}</strong>. Bạn có thể
                          giữ lựa chọn hiện tại hoặc dùng kết quả test.
                        </div>
                      )}

                    <div className="mt-2 pt-2 border-t border-[#E2D4B7]/60">
                      {enneagram.statisticsConsent ? (
                        <div className="flex flex-col gap-2">
                          <p className="text-[10px] font-semibold text-emerald-700">
                            ✓ Kết quả test này đang đóng góp cho Statistics
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              handleRevokeStatisticsConsent(
                                enneagram.testResultId,
                                "Enneagram"
                              )
                            }
                            disabled={
                              revokingConsentId === enneagram.testResultId
                            }
                            className="w-full rounded-md border border-[#C9B99B] bg-white px-3 py-2 text-[10px] font-semibold text-[#8B6B4A] hover:border-[#8B6B4A] hover:bg-[#F7F2E9] transition-colors disabled:opacity-50"
                          >
                            {revokingConsentId === enneagram.testResultId
                              ? "Đang thu hồi..."
                              : "Thu hồi khỏi Statistics"}
                          </button>
                        </div>
                      ) : (
                        <p className="text-[10px] text-gray-500">
                          {enneagram.statisticsConsentRevokedAt
                            ? "Đã thu hồi chia sẻ Statistics cho kết quả test này."
                            : "Kết quả test này không được chia sẻ cho Statistics."}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </section>

              <p className="text-[10px] text-gray-400 leading-relaxed">
                Kết quả test vẫn được lưu trong lịch sử ngay cả khi bạn chọn identity thủ công.
                Việc chọn identity hiển thị không thay đổi consent Statistics của từng bài test.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================
            4. CỘT PHẢI (md:col-span-2 - Nơi đăng bài & Dòng thời gian)
            ======================================================== */}
        <div className="md:col-span-2 flex flex-col min-w-0">
          {/* Khối Đăng Bài (Solid, chuẩn Facebook) */}
          <div className="w-full bg-white border border-[#E2D4B7] rounded-xl p-5 shadow-sm mb-8 flex flex-col gap-4">
            {/* Avatar + vùng nhập liệu xám */}
            <div className="flex gap-3 items-start w-full">
              {clerkUser?.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={clerkUser.imageUrl}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E2D4B7] text-[#8B6B4A] flex items-center justify-center font-bold text-sm shrink-0">
                  {user.avatar}
                </div>
              )}
              <div className="flex flex-col w-full min-w-0 gap-3">
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Tiêu đề bài viết..."
                  className="w-full bg-[#F0F2F5] rounded-xl px-4 py-3 border-none font-bold text-gray-800 placeholder:text-gray-500 focus:ring-0 outline-none"
                />
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Bạn đang nghĩ gì? Hãy chia sẻ góc nhìn..."
                  className="w-full bg-[#F0F2F5] rounded-xl px-4 py-3 border-none text-gray-700 placeholder:text-gray-500 focus:ring-0 outline-none resize-none min-h-[80px]"
                />
              </div>
            </div>

            {postError && (
              <p className="text-xs text-red-600 font-medium font-sans">{postError}</p>
            )}
            {postSuccess && (
              <p className="text-xs text-emerald-600 font-medium font-sans">{postSuccess}</p>
            )}

            {/* Đường kẻ ngang */}
            <hr className="border-gray-200 w-full my-1" />

            {/* Thanh công cụ: Chủ đề & Nút đăng */}
            <div className="flex justify-between items-center w-full gap-3">
              <select
                value={postTag}
                onChange={(e) => setPostTag(e.target.value)}
                className="bg-[#F0F2F5] border-none text-gray-700 rounded-lg px-3 py-2 text-sm font-sans focus:ring-0 outline-none cursor-pointer min-w-0"
              >
                <option value="Chung">Chung</option>
                <optgroup label="MBTI">
                  {Object.keys(MBTI_TITLES).map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Enneagram">
                  {Object.keys(ENNEAGRAM_TITLES).map((n) => (
                    <option key={n} value={`Type ${n}`}>
                      Type {n}
                    </option>
                  ))}
                </optgroup>
              </select>
              <button
                type="button"
                onClick={() => handleCreatePost()}
                disabled={isSubmittingPost || !postTitle.trim() || !postContent.trim()}
                className="bg-[#8B6B4A] text-white px-6 py-2 rounded-lg font-sans text-sm font-semibold hover:bg-[#5C4326] transition-colors shadow-sm cursor-pointer disabled:opacity-50 shrink-0"
              >
                {isSubmittingPost ? "Đang đăng..." : "Đăng bài"}
              </button>
            </div>
          </div>

          {/* Khối Lịch sử bài viết (Timeline) */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-[#5C4326] text-2xl font-bold">
                Dòng thời gian
              </h2>
              <span className="text-xs font-sans text-[#8B6B4A] font-medium">
                {userPosts.length} bài viết
              </span>
            </div>

            {isLoadingPosts ? (
              <div className="bg-white border border-[#E2D4B7] rounded-xl p-8 text-center shadow-sm">
                <div className="w-8 h-8 border-2 border-[#E2D4B7] border-t-[#8B6B4A] rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs font-sans text-gray-500">Đang tải các bài viết của bạn...</p>
              </div>
            ) : userPosts.length === 0 ? (
              <div className="bg-white border border-[#E2D4B7] rounded-xl p-8 text-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#8B6B4A]/30 flex items-center justify-center mx-auto mb-3 text-[#8B6B4A]">
                  <Edit3 className="w-6 h-6 text-[#8B6B4A]" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#5C4326] mb-1">
                  Chưa có bài viết nào
                </h3>
                <p className="text-xs text-gray-500 font-sans max-w-sm mx-auto leading-relaxed">
                  Những bài viết bạn đăng ở khung phía trên sẽ xuất hiện tại đây và đồng thời được chia sẻ tại mục Thảo luận.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {userPosts.map((post) => {
                  const isExpanded = !!expandedPostComments[post.id];

                  return (
                    <article
                      key={post.id}
                      className="bg-white border border-[#E2D4B7] rounded-xl p-5 shadow-sm text-gray-800 font-sans transition-shadow hover:shadow-md"
                    >
                      {/* Header bài viết */}
                      <div className="flex items-center justify-between gap-3 mb-3">
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
                            <span className="font-sans font-semibold text-[#5C4326] text-sm block">
                              {post.authorName}
                            </span>
                            <span className="text-xs text-gray-400 font-sans">
                              {formatPostDate(post.createdAt)}
                            </span>
                          </div>
                        </div>

                        <span className="text-xs px-2.5 py-1 rounded bg-[#FAF8F5] text-[#8B6B4A] border border-[#E2D4B7] font-medium font-sans">
                          {post.personalityTag}
                        </span>
                      </div>

                      {/* Tiêu đề & Nội dung */}
                      <h3 className="font-serif text-lg font-bold text-[#5C4326] mb-1.5">
                        {post.title}
                      </h3>
                      <p className="font-sans text-sm text-gray-700 whitespace-pre-wrap leading-relaxed mb-4">
                        {post.content}
                      </p>

                      {/* Footer: Thích, Bình luận, Link đến Thảo luận */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#E2D4B7]/60 text-xs text-gray-500 font-sans">
                        <div className="flex items-center gap-4">
                          {/* Nút Thích */}
                          <LikeButton postId={post.id} initialLikes={post.likesCount || 0} />

                          {/* Nút Bình luận */}
                          <button
                            onClick={() => toggleComments(post.id)}
                            className="flex items-center gap-1.5 hover:text-[#8B6B4A] transition-colors cursor-pointer"
                          >
                            <MessageCircle className="w-4 h-4 text-[#8B6B4A]" strokeWidth={1.5} />
                            <span>{post.comments?.length || 0} bình luận</span>
                          </button>
                        </div>

                        <Link
                          href="/discussion"
                          className="text-[#8B6B4A] hover:text-[#5C4326] font-medium transition-colors"
                        >
                          Xem tại Thảo luận →
                        </Link>
                      </div>

                      {/* Phần bình luận có thể đóng mở */}
                      {isExpanded && (
                        <div className="mt-4 pt-3 border-t border-[#E2D4B7]/40">
                          <CommentSection
                            postId={post.id}
                            initialComments={post.comments || []}
                            onCommentAdded={(newComment) => {
                              setUserPosts((prev) =>
                                prev.map((p) =>
                                  p.id === post.id
                                    ? { ...p, comments: [...(p.comments || []), newComment] }
                                    : p
                                )
                              );
                            }}
                          />
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal chỉnh sửa hồ sơ */}
      <ProfileFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={
          profileDetails
            ? {
                dateOfBirth: profileDetails.dateOfBirth,
                zodiacSign: profileDetails.zodiacSign,
                hobbies: profileDetails.hobbies,
                location: profileDetails.location,
                bio: profileDetails.bio,
                avatarUrl: profileDetails.avatarUrl,
              }
            : undefined
        }
        onSuccess={(updated) => {
          setProfileDetails(updated);
          router.refresh();
        }}
      />
    </div>
  );
}
