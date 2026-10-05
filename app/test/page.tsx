import Link from "next/link";

export default function TestPage() {
  return (
    <main className="w-full max-w-5xl mx-auto flex flex-col items-center px-4 py-8">
      {/* Header */}
      <header className="mb-10 text-center flex flex-col items-center w-full max-w-3xl">
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#5C4326] tracking-wide">
          Choose your test.
        </h1>

        <p className="mt-4 text-base sm:text-lg text-[#6B5A46] max-w-2xl leading-relaxed font-sans tracking-wide">
          Mỗi assessment là một module độc lập và có hệ thống chấm
          điểm riêng. Hãy chọn một bài trắc nghiệm để bắt đầu khám phá
          bản thân qua các lá bài phân tích.
        </p>
      </header>

      {/* Cards */}
      <div className="grid gap-5 w-full max-w-3xl">
        {/* =====================================================
            COGNITIVE FUNCTIONS
            ===================================================== */}
        <section className="w-full bg-white border border-[#E2D4B7] rounded-xl p-6 sm:p-8 shadow-sm text-center">
          <div className="flex flex-col items-center gap-2 mb-3">
            <h2 className="font-serif text-2xl font-bold text-[#5C4326]">
              MBTI / Cognitive Functions
            </h2>

            <p className="text-[#6B5A46] font-sans tracking-wide text-sm leading-relaxed max-w-2xl">
              Chọn cách bạn muốn thực hiện Cognitive Functions
              Assessment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {/* Traditional */}
            <Link
              href="/test/mbti"
              className="group flex flex-col text-left rounded-xl border border-[#E2D4B7] bg-[#FCFBF8] p-5 hover:border-[#8B6B4A] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="font-serif text-xl font-bold text-[#5C4326]">
                  Traditional
                </span>

                <span className="shrink-0 text-[10px] uppercase tracking-wider font-bold text-[#8B6B4A] border border-[#E2D4B7] bg-white rounded-full px-2.5 py-1">
                  72 câu
                </span>
              </div>

              <p className="text-sm text-[#6B5A46] leading-relaxed flex-1">
                Bài đánh giá đầy đủ gồm 72 câu Likert, đo trực tiếp cả
                8 Cognitive Functions bằng hệ thống scoring truyền thống
                của MOSAIC.
              </p>

              <span className="mt-5 text-sm font-semibold text-[#8B6B4A] group-hover:text-[#5C4326] transition-colors">
                Bắt đầu bài truyền thống →
              </span>
            </Link>

            {/* AI Adaptive */}
            <Link
              href="/test/cognitive-functions/ai"
              className="group flex flex-col text-left rounded-xl border border-[#B9A47A] bg-[#FBF8F1] p-5 hover:border-[#8B6B4A] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="font-serif text-xl font-bold text-[#5C4326]">
                  AI Adaptive
                </span>

                <span className="shrink-0 text-[10px] uppercase tracking-wider font-bold text-[#8B6B4A] border border-[#D9C9AA] bg-white rounded-full px-2.5 py-1">
                  Adaptive
                </span>
              </div>

              <p className="text-sm text-[#6B5A46] leading-relaxed flex-1">
                Bắt đầu bằng các câu trả lời mở. AI chỉ phân tích evidence
                để chọn khoảng 30 câu Likert phù hợp hơn; kết quả cuối vẫn
                được tính bằng scoring deterministic của MOSAIC.
              </p>

              <div className="mt-4 text-[11px] text-[#8B7560] leading-relaxed">
                6 câu mở · khoảng 30 câu trắc nghiệm
              </div>

              <span className="mt-3 text-sm font-semibold text-[#8B6B4A] group-hover:text-[#5C4326] transition-colors">
                Bắt đầu AI Adaptive →
              </span>
            </Link>
          </div>

          <p className="mt-5 text-[11px] text-gray-500 leading-relaxed">
            Hai phiên bản sử dụng cùng hệ thống Cognitive Functions.
            Profile sẽ ghi rõ bạn đã thực hiện Traditional hay AI Adaptive.
          </p>
        </section>

        {/* =====================================================
            ENNEAGRAM
            ===================================================== */}
        <Link
          href="/test/enneagram"
          className="block w-full bg-white border border-[#E2D4B7] rounded-xl p-8 shadow-sm hover:shadow-md hover:border-[#8B6B4A] hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center group"
        >
          <div className="flex flex-col items-center gap-2 mb-3 w-full">
            <h2 className="font-serif text-2xl font-bold text-[#5C4326] transition-colors">
              Enneagram
            </h2>
          </div>

          <p className="text-[#6B5A46] font-sans tracking-wide text-sm leading-relaxed max-w-2xl mx-auto">
            Khám phá 9 core types và wing qua bài đánh giá core +
            instinct gồm 66 câu hỏi để hiểu rõ động cơ và nỗi sợ sâu
            kín nhất.
          </p>
        </Link>

        {/* =====================================================
            BIG FIVE
            ===================================================== */}
        <div className="bg-white border border-[#E2D4B7] rounded-xl shadow-sm p-6 sm:p-8 opacity-60 cursor-default flex flex-col items-center text-center">
          <div className="flex flex-col items-center gap-2 mb-3 w-full">
            <h2 className="font-serif text-2xl font-bold text-[#A89F91]">
              Big Five
            </h2>

            <span className="text-xs font-sans font-semibold uppercase tracking-wider text-[#A89F91] bg-gray-50 border border-gray-200 px-3 py-1 rounded-full whitespace-nowrap">
              Coming soon
            </span>
          </div>

          <p className="text-[#A89F91] font-sans tracking-wide text-sm leading-relaxed max-w-2xl">
            Mô hình tính cách dựa trên năm nhóm đặc điểm lớn (OCEAN)
            đo lường xu hướng tính cách cơ bản trong tâm lý học hiện đại.
          </p>
        </div>
      </div>

      {/* View Results */}
      <div className="mt-8 pt-4 w-full flex justify-center">
        <Link
          href="/result"
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#FCFBF8] border border-[#8B6B4A] text-[#8B6B4A] hover:bg-[#8B6B4A] hover:text-white font-sans tracking-wide font-semibold text-sm transition-all whitespace-nowrap shadow-sm"
        >
          <span>View Results</span>
          <span>→</span>
        </Link>
      </div>
    </main>
  );
}