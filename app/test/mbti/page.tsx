"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import cognitiveFunctionQuestions from "@/src/data/cognitiveFunctionQuestions";
import {
  scoreAnswers,
  type RawAnswers,
} from "@/src/utils/cognitiveFunctionScoring";
import { saveTestResult } from "@/app/actions/test";

const SCALE = [1, 2, 3, 4, 5] as const;

const SCALE_LABELS: Record<number, string> = {
  1: "Rất không đúng",
  2: "Không đúng",
  3: "Trung lập",
  4: "Khá đúng",
  5: "Rất đúng",
};

export default function MbtiTestPage() {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<RawAnswers>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /*
   * Consent mặc định luôn là false.
   * Người dùng phải chủ động tick nếu muốn đóng góp
   * kết quả + các thông tin profile phù hợp cho Statistics.
   */
  const [statisticsConsent, setStatisticsConsent] =
    useState(false);

  const totalQuestions = cognitiveFunctionQuestions.length;
  const currentQuestion =
    cognitiveFunctionQuestions[currentIndex];

  const answeredCount = Object.keys(answers).length;
  const allAnswered =
    answeredCount === totalQuestions;

  const progress = Math.round(
    (answeredCount / totalQuestions) * 100
  );

  const answerForCurrent = currentQuestion
    ? answers[currentQuestion.id]
    : undefined;

  const questionNumbers = useMemo(
    () =>
      cognitiveFunctionQuestions.map(
        (_, index) => index + 1
      ),
    []
  );

  const handleAnswer = (value: number) => {
    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: value,
    }));

    setError("");
  };

  const goToQuestion = (index: number) => {
    if (
      index < 0 ||
      index >= totalQuestions
    ) {
      return;
    }

    setCurrentIndex(index);
    setError("");
  };

  const goNext = () => {
    if (
      currentIndex <
      totalQuestions - 1
    ) {
      setCurrentIndex(
        (index) => index + 1
      );
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(
        (index) => index - 1
      );
    }
  };

  const handleSubmit = async () => {
    if (!allAnswered) {
      setError(
        `Bạn còn ${
          totalQuestions - answeredCount
        } câu chưa trả lời. Hãy hoàn thành đủ ${totalQuestions} câu trước khi nộp.`
      );
      return;
    }

    const result =
      scoreAnswers(answers);

    if ("errors" in result) {
      setError(
        result.errors.join(" ")
      );
      return;
    }

    setSubmitting(true);
    setError("");

    const mbtiCode = (
      result.typeCompatibility
        ?.bestFitType ||
      result.bestFitType ||
      "INTJ"
    ).toUpperCase();

    sessionStorage.setItem(
      "mosaic_scoring_result",
      JSON.stringify(result)
    );

    try {
      const saveResult =
        await saveTestResult({
          testType: "MBTI",

          /*
           * Đánh dấu rõ đây là bài
           * Cognitive Functions truyền thống 72 câu.
           */
          testVariant:
            "TRADITIONAL_72",

          resultName: mbtiCode,

          details:
            `Kết quả Cognitive Functions truyền thống 72 câu: ${mbtiCode}`,

          /*
           * false vẫn lưu kết quả bình thường.
           * true mới cho phép dùng kết quả +
           * profile phù hợp để filter Statistics.
           */
          statisticsConsent,
        });

      if (!saveResult.success) {
        console.warn(
          "Không lưu được kết quả MBTI:",
          saveResult.error
        );
      }
    } catch (e) {
      console.error(
        "Lỗi khi lưu bài test MBTI:",
        e
      );
    }

    /*
     * Kể cả user không consent Statistics,
     * họ vẫn được xem kết quả của mình.
     */
    router.push("/profile");
  };

  if (!currentQuestion) {
    return (
      <main className="min-h-screen bg-[#FCFBF8] text-gray-800 font-sans p-8 flex items-center justify-center">
        <p>
          Không tìm thấy bộ câu hỏi.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FCFBF8] text-gray-800 font-sans px-4 py-8">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ========================================================
            KHU VỰC CÂU HỎI
            ======================================================== */}
        <section className="lg:col-span-2 flex flex-col gap-6">
          <header>
            <div className="flex items-center gap-2 mb-2 text-xs font-sans font-bold tracking-wider uppercase text-[#8B6B4A]">
              <Link
                href="/"
                aria-label="Mosaic Home"
                className="hover:text-[#5C4326] transition-colors"
              >
                MOSAIC
              </Link>

              <span className="text-[#E2D4B7]">
                /
              </span>

              <span>
                MBTI / COGNITIVE FUNCTIONS
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-serif text-4xl text-[#5C4326] font-bold">
                Cognitive Function Assessment
              </h1>

              <span className="text-[11px] uppercase tracking-wider font-bold text-[#8B6B4A] bg-[#FAF8F5] border border-[#E2D4B7] px-3 py-1 rounded-full">
                Traditional · 72 câu
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-600 font-sans leading-relaxed">
              Phiên bản truyền thống gồm 72 câu hỏi theo
              thang Likert 1–5. Bạn có thể quay lại bất kỳ
              câu nào bằng Question Map bên phải.
            </p>
          </header>

          {/* Thẻ chứa câu hỏi chính */}
          <section className="bg-white border border-[#E2D4B7] rounded-xl shadow-sm p-6">
           <div className="mb-4">
  <span className="font-sans text-xs font-bold text-[#8B6B4A] tracking-wider">
    QUESTION {currentIndex + 1} / {totalQuestions}
  </span>
</div>

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#5C4326] leading-relaxed mb-2">
              {currentQuestion.text}
            </h2>

            <p className="text-xs text-gray-500 font-sans mb-6">
              Chọn một mức độ phù hợp
              với bạn nhất.
            </p>

            {/* Thang Likert 1–5 */}
            <div
              className="grid grid-cols-1 sm:grid-cols-5 gap-3"
              role="radiogroup"
              aria-label="Likert scale"
            >
              {SCALE.map((value) => {
                const isSelected =
                  answerForCurrent ===
                  value;

                return (
                  <label
                    key={value}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-xl cursor-pointer text-center select-none transition-all ${
                      isSelected
                        ? "bg-[#8B6B4A] text-white border-[#8B6B4A] shadow-sm font-semibold"
                        : "bg-[#FCFBF8] border border-[#E2D4B7] text-gray-700 hover:bg-[#8B6B4A] hover:text-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name={
                        currentQuestion.id
                      }
                      value={value}
                      checked={
                        isSelected
                      }
                      onChange={() =>
                        handleAnswer(
                          value
                        )
                      }
                      className="hidden"
                    />

                    <span className="text-lg font-bold mb-1">
                      {value}
                    </span>

                    <span className="text-xs font-sans">
                      {
                        SCALE_LABELS[
                          value
                        ]
                      }
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Previous / Next */}
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              className="border border-[#8B6B4A] text-[#8B6B4A] px-6 py-2 rounded-md hover:bg-[#8B6B4A] hover:text-white font-sans font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              onClick={goPrevious}
              disabled={
                currentIndex === 0
              }
            >
              ← Previous
            </button>

            <button
              type="button"
              className="border border-[#8B6B4A] text-[#8B6B4A] px-6 py-2 rounded-md hover:bg-[#8B6B4A] hover:text-white font-sans font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              onClick={goNext}
              disabled={
                currentIndex ===
                totalQuestions - 1
              }
            >
              Next →
            </button>
          </div>

          {error && (
            <p
              className="text-xs text-red-600 font-medium font-sans p-3 bg-red-50 border border-red-200 rounded-lg"
              role="alert"
            >
              {error}
            </p>
          )}
        </section>

        {/* ========================================================
            QUESTION MAP
            ======================================================== */}
        <aside className="lg:col-span-1 bg-white border border-[#E2D4B7] rounded-xl p-4 shadow-sm flex flex-col gap-4 font-sans">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-[#5C4326] text-xl font-bold">
              Question Map
            </h2>

            <span className="text-xs font-semibold text-[#8B6B4A] font-sans">
              {answeredCount}/
              {totalQuestions}
            </span>
          </div>

          {/* Progress */}
          <div className="w-full h-2 bg-[#FAF8F5] border border-[#E2D4B7] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#8B6B4A] transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          {/* Lưới câu hỏi */}
          <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-6 gap-2 max-h-[360px] overflow-y-auto p-1">
            {questionNumbers.map(
              (number, index) => {
                const question =
                  cognitiveFunctionQuestions[
                    index
                  ];

                const answered =
                  answers[
                    question.id
                  ] !== undefined;

                const current =
                  index ===
                  currentIndex;

                let btnClass =
                  "bg-[#FCFBF8] border border-[#E2D4B7] text-gray-500";

                if (answered) {
                  btnClass =
                    "bg-[#E2D4B7] text-[#5C4326] border-[#8B6B4A]";
                }

                if (current) {
                  btnClass =
                    "border-2 border-[#8B6B4A] bg-[#FCFBF8] text-[#8B6B4A] font-bold";
                }

                return (
                  <button
                    key={
                      question.id
                    }
                    type="button"
                    className={`w-full aspect-square rounded flex items-center justify-center text-xs font-sans transition-all cursor-pointer ${btnClass}`}
                    onClick={() =>
                      goToQuestion(
                        index
                      )
                    }
                    aria-label={`Go to question ${number}${
                      answered
                        ? ", answered"
                        : ", unanswered"
                    }`}
                  >
                    {number}
                  </button>
                );
              }
            )}
          </div>

          {/* Chú thích */}
          <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-[#E2D4B7]/60">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#E2D4B7] border border-[#8B6B4A]" />
              Đã trả lời
            </span>

            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#FCFBF8] border border-[#E2D4B7]" />
              Chưa trả lời
            </span>

            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border-2 border-[#8B6B4A] bg-[#FCFBF8]" />
              Đang chọn
            </span>
          </div>

          {/* ====================================================
              STATISTICS CONSENT
              ==================================================== */}
          <div className="rounded-xl border border-[#E2D4B7] bg-[#FCFBF8] p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={
                  statisticsConsent
                }
                onChange={(event) =>
                  setStatisticsConsent(
                    event.target
                      .checked
                  )
                }
                className="mt-1 h-4 w-4 shrink-0 accent-[#8B6B4A]"
              />

              <span className="text-xs text-gray-600 leading-relaxed">
                <span className="font-semibold text-[#5C4326]">
                  Đồng ý đóng góp
                  dữ liệu cho
                  Statistics
                </span>

                <br />

                Tôi đồng ý cho
                MOSAIC sử dụng kết
                quả bài test này
                cùng với những thông
                tin phù hợp trong
                Profile để tạo thống
                kê tổng hợp và bộ lọc
                Statistics.

                <br />

                <span className="text-gray-500">
                  Lựa chọn này không
                  làm kết quả cá nhân
                  hay Profile của tôi
                  trở thành thông tin
                  công khai. Không
                  đồng ý vẫn có thể
                  xem và lưu kết quả
                  bình thường.
                </span>
              </span>
            </label>
          </div>

          {/* Nút nộp bài */}
          <button
            type="button"
            className="w-full bg-[#8B6B4A] text-white border border-[#8B6B4A] py-2.5 rounded-md hover:bg-[#5C4326] font-sans font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
            onClick={handleSubmit}
            disabled={
              !allAnswered ||
              submitting
            }
          >
            {submitting
              ? "Đang lưu kết quả..."
              : allAnswered
                ? "Hoàn thành & Xem kết quả →"
                : `Còn ${
                    totalQuestions -
                    answeredCount
                  } câu`}
          </button>

          <p className="text-[11px] text-gray-500 text-center font-sans">
            Bạn có thể Submit từ bất
            kỳ câu nào khi đã trả lời
            đủ toàn bộ{" "}
            {totalQuestions} câu.
          </p>

          <div className="text-center pt-1 border-t border-[#E2D4B7]/40">
            <Link
              href="/test"
              className="text-xs font-semibold text-[#8B6B4A] hover:text-[#5C4326] transition-colors"
            >
              ← Back to Tests
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}