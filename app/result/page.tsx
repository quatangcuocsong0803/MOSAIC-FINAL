import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kết quả bài test | MOSAIC",
  description:
    "Xem lại chi tiết kết quả phân tích nhận thức và động lực tính cách từ các bài trắc nghiệm bạn đã hoàn thành trên hệ thống MOSAIC.",
};

export default function ResultHubPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 text-gray-800">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-xs font-semibold uppercase tracking-wider text-gray-400 font-sans">
        <Link href="/" className="hover:text-[#5C4326] transition-colors">
          MOSAIC
        </Link>
        <span>/</span>
        <span className="text-[#8B6B4A]">KẾT QUẢ</span>
      </div>

      {/* Header */}
      <header className="mb-10 text-center flex flex-col items-center">
        <p className="text-xs font-sans font-bold uppercase tracking-widest text-[#8B6B4A] mb-2">
          MOSAIC · KẾT QUẢ
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-[#5C4326] font-bold text-center mb-4">
          KẾT QUẢ TRẮC NGHIỆM
        </h1>
        <p className="text-sm md:text-base text-[#6B5A46] max-w-2xl leading-relaxed text-center font-sans tracking-wide">
          Xem lại chi tiết kết quả phân tích nhận thức và động lực tính cách từ các bài trắc nghiệm bạn đã hoàn thành trên hệ thống.
        </p>
      </header>

      {/* Cards */}
      <section className="w-full">
        {/* MBTI Card */}
        <Link
          href="/result/mbti"
          className="bg-white border border-[#E2D4B7] rounded-xl shadow-sm text-gray-800 p-6 mb-6 block hover:shadow-md hover:border-[#8B6B4A] transition-all"
        >
          <h2 className="font-serif text-2xl font-bold text-[#5C4326] mb-2">
            MBTI / Chức năng nhận thức
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed max-w-2xl font-sans">
            Xem kết quả phân tích 8 chức năng nhận thức, ngăn xếp chức năng và mức độ tương thích với 16 nhóm tính cách.
          </p>
          <p className="mt-4 text-sm text-[#8B6B4A] hover:text-[#5C4326] font-semibold transition-all">
            Xem kết quả MBTI →
          </p>
        </Link>

        {/* Enneagram Card */}
        <Link
          href="/result/enneagram"
          className="bg-white border border-[#E2D4B7] rounded-xl shadow-sm text-gray-800 p-6 mb-6 block hover:shadow-md hover:border-[#8B6B4A] transition-all"
        >
          <h2 className="font-serif text-2xl font-bold text-[#5C4326] mb-2">
            Enneagram
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed max-w-2xl font-sans">
            Xem kiểu tính cách cốt lõi, hồ sơ động lực 9 nhóm và ngăn xếp bản năng.
          </p>
          <p className="mt-4 text-sm text-[#8B6B4A] hover:text-[#5C4326] font-semibold transition-all">
            Xem kết quả Enneagram →
          </p>
        </Link>
      </section>
    </div>
  );
}
