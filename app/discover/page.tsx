import type { Metadata } from "next";
import Link from "next/link";
import { Compass } from "@/src/components/ui/Icons";
import { getDiscoverUsers } from "@/app/actions/discover";
import DiscoverClient from "./DiscoverClient";

export const metadata: Metadata = {
  title: "Khám phá & Kết nối | MOSAIC",
  description: "Khám phá những người có kiểu tính cách hoặc mối quan quan tâm tương đồng trên nền tảng MOSAIC.",
};

export const dynamic = "force-dynamic";

export default async function DiscoverPage() {
  const data = await getDiscoverUsers();

  if (!data.success && !data.currentUserId) {
    return (
      <main className="w-full max-w-5xl mx-auto flex flex-col items-center px-4 py-8">
        <div className="max-w-2xl mx-auto text-center bg-white rounded-xl p-8 md:p-12 border border-[#E2D4B7] shadow-sm relative z-10 w-full flex flex-col items-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#FCFBF8] border border-[#8B6B4A] flex items-center justify-center text-[#8B6B4A] shadow-sm">
            <Compass className="w-8 h-8 text-[#8B6B4A]" strokeWidth={1.5} />
          </div>
          <span className="text-xs font-sans font-bold tracking-widest uppercase text-[#A89F91] mb-2 block">
            MOSAIC DISCOVERY
          </span>
          <h1 className="font-serif text-2xl md:text-4xl font-bold text-[#5C4326] tracking-wide mb-3">
            Khám Phá & Kết Nối Bạn Bè
          </h1>
          <p className="text-sm md:text-base text-[#6B5A46] mb-8 max-w-lg mx-auto leading-relaxed font-sans tracking-wide">
            Đăng nhập để tìm kiếm những người có cùng nhóm tính cách MBTI, Enneagram và gửi lời mời kết bạn cùng nhau khám phá bản đồ tinh tú.
          </p>
          <div className="flex flex-wrap gap-3 justify-center w-full max-w-md">
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-[#8B6B4A] bg-[#8B6B4A] text-white hover:bg-[#6B5A46] font-sans tracking-wide font-semibold text-sm transition-all shadow-sm whitespace-nowrap"
            >
              Đăng nhập ngay →
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#FCFBF8] border border-[#8B6B4A] text-[#8B6B4A] hover:bg-[#8B6B4A] hover:text-white font-sans tracking-wide font-semibold text-sm transition-all whitespace-nowrap"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const allUsers = data.users || [];

  return (
    <main className="w-full max-w-5xl mx-auto flex flex-col items-center px-4 py-8">
      {/* Header trang Discover */}
      <header className="mb-8 w-full text-center flex flex-col items-center max-w-3xl">
        <h1 className="font-serif text-4xl md:text-5xl text-[#5C4326] font-bold text-center mb-3">
          KHÁM PHÁ & KẾT NỐI
        </h1>
        <p className="text-sm md:text-base text-[#6B5A46] max-w-2xl leading-relaxed mx-auto font-sans tracking-wide">
          Tìm kiếm những tâm hồn đồng điệu qua hệ thống đối chiếu MBTI và Enneagram.
          Mỗi người là một mảnh ghép độc bản trong bức tranh Mosaic.
        </p>
      </header>

      {/* Component tương tác: Thanh tìm kiếm & Gợi ý tương đồng cao */}
      <DiscoverClient initialUsers={allUsers} />
    </main>
  );
}
