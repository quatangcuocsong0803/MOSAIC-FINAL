"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  enneagramQuestions,
  ENNEAGRAM_CORE_QUESTION_COUNT,
  type EnneagramQuestion,
} from "@/src/data/enneagramQuestions";

import {
  enneagramInstinctQuestions,
  ENNEAGRAM_INSTINCT_QUESTION_COUNT,
  type InstinctQuestion,
} from "@/src/data/enneagramInstinctQuestions";

import { scoreEnneagramAssessment } from "@/src/utils/enneagramAssessmentScoring";
import { saveTestResult } from "@/app/actions/test";

type AssessmentQuestion =
  | (EnneagramQuestion & {
      kind: "core";
    })
  | (InstinctQuestion & {
      kind: "instinct";
    });

const questions: AssessmentQuestion[] = [
  ...enneagramQuestions.map((question) => ({
    ...question,
    kind: "core" as const,
  })),

  ...enneagramInstinctQuestions.map(
    (question) => ({
      ...question,
      kind: "instinct" as const,
    })
  ),
];

const totalQuestions = questions.length;

const responseOptions = [
  {
    value: 1,
    label: "Rất không đúng",
  },
  {
    value: 2,
    label: "Không đúng",
  },
  {
    value: 3,
    label: "Trung lập",
  },
  {
    value: 4,
    label: "Khá đúng",
  },
  {
    value: 5,
    label: "Rất đúng",
  },
] as const;

export default function EnneagramAssessmentPage() {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [answers, setAnswers] = useState<
    Record<string, number>
  >({});

  const [error, setError] = useState("");

  const [submitting, setSubmitting] =
    useState(false);

  /*
   * Consent mặc định luôn là false.
   * Người dùng phải chủ động tick.
   */
  const [
    statisticsConsent,
    setStatisticsConsent,
  ] = useState(false);

  const currentQuestion =
    questions[currentIndex];

  const answeredCount =
    questions.filter(
      (question) =>
        answers[question.id] !==
        undefined
    ).length;

  const allAnswered =
    answeredCount === totalQuestions;

  const coreQuestions = useMemo(
    () =>
      questions.filter(
        (question) =>
          question.kind === "core"
      ),
    []
  );

  const instinctQuestions = useMemo(
    () =>
      questions.filter(
        (question) =>
          question.kind === "instinct"
      ),
    []
  );

  function goToQuestion(
    index: number
  ) {
    setCurrentIndex(index);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function selectAnswer(
    value: number
  ) {
    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: value,
    }));

    setError("");
  }

  function next() {
    if (
      currentIndex <
      totalQuestions - 1
    ) {
      goToQuestion(
        currentIndex + 1
      );
    }
  }

  function previous() {
    if (currentIndex > 0) {
      goToQuestion(
        currentIndex - 1
      );
    }
  }

  async function submit() {
    if (!allAnswered) {
      setError(
        `Bạn còn ${
          totalQuestions -
          answeredCount
        } câu chưa trả lời.`
      );

      return;
    }

    const result =
      scoreEnneagramAssessment(
        answers
      );

    if ("errors" in result) {
      setError(
        result.errors[0] ??
          "Không thể chấm điểm assessment."
      );

      return;
    }

    setSubmitting(true);
    setError("");

    const typeName =
      `Type ${
        result.coreType || 5
      }`;

    sessionStorage.setItem(
      "mosaic_enneagram_result",
      JSON.stringify(result)
    );

    try {
      const saveResult =
        await saveTestResult({
          testType:
            "ENNEAGRAM",

          testVariant:
            "TRADITIONAL",

          resultName:
            typeName,

          details:
            `Kết quả trắc nghiệm Enneagram truyền thống: ${typeName}`,

          /*
           * false:
           * vẫn lưu kết quả bình thường.
           *
           * true:
           * cho phép sử dụng kết quả
           * cùng profile phù hợp
           * cho Statistics.
           */
          statisticsConsent,
        });

      if (!saveResult.success) {
        console.warn(
          "Không lưu được kết quả Enneagram:",
          saveResult.error
        );
      }
    } catch (e) {
      console.error(
        "Lỗi khi lưu bài test Enneagram:",
        e
      );
    }

    /*
     * Consent không ảnh hưởng
     * quyền xem kết quả.
     */
    router.push("/profile");
  }

  function renderMapButton(
    question: AssessmentQuestion,
    index: number
  ) {
    const answered =
      answers[question.id] !==
      undefined;

    const current =
      index === currentIndex;

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
        key={question.id}
        type="button"
        className={`w-full aspect-square rounded flex items-center justify-center text-xs font-sans transition-all cursor-pointer ${btnClass}`}
        onClick={() =>
          goToQuestion(index)
        }
        aria-label={`Go to question ${
          index + 1
        }`}
      >
        {index + 1}
      </button>
    );
  }

  if (!currentQuestion) {
    return null;
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
                className="hover:text-[#5C4326] transition-colors"
              >
                MOSAIC
              </Link>

              <span className="text-[#E2D4B7]">
                /
              </span>

              <Link
                href="/test"
                className="hover:text-[#5C4326] transition-colors"
              >
                TEST
              </Link>

              <span className="text-[#E2D4B7]">
                /
              </span>

              <span>
                ENNEAGRAM
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-serif text-4xl text-[#5C4326] font-bold">
                Enneagram Assessment
              </h1>

              <span className="text-[11px] uppercase tracking-wider font-bold text-[#8B6B4A] bg-[#FAF8F5] border border-[#E2D4B7] px-3 py-1 rounded-full">
                Traditional
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-600 font-sans leading-relaxed">
              {totalQuestions} câu hỏi
              gồm{" "}
              {
                ENNEAGRAM_CORE_QUESTION_COUNT
              }{" "}
              câu về core motivation
              và{" "}
              {
                ENNEAGRAM_INSTINCT_QUESTION_COUNT
              }{" "}
              câu về instinctual
              pattern.
            </p>

            <p className="mt-1 text-xs text-gray-500 font-sans">
              Hãy trả lời theo xu
              hướng thật của bạn
              trong phần lớn thời
              gian, không phải theo
              cách bạn nghĩ mình nên
              như thế nào.
            </p>
          </header>

          {/* Câu hỏi */}
          <section className="bg-white border border-[#E2D4B7] rounded-xl shadow-sm p-6">
            <div className="mb-4">
              <span className="font-sans text-xs font-bold text-[#8B6B4A] tracking-wider">
                QUESTION{" "}
                {currentIndex + 1} /{" "}
                {totalQuestions}
              </span>
            </div>

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#5C4326] leading-relaxed mb-2">
              {
                currentQuestion.text
              }
            </h2>

            <p className="text-xs text-gray-500 font-sans mb-6">
              Chọn mức độ câu này
              đúng với bạn.
            </p>

            {/* Likert 1–5 */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {responseOptions.map(
                (option) => {
                  const selected =
                    answers[
                      currentQuestion
                        .id
                    ] ===
                    option.value;

                  return (
                    <button
                      key={
                        option.value
                      }
                      type="button"
                      className={`flex flex-col items-center justify-center p-3.5 rounded-xl cursor-pointer text-center select-none transition-all ${
                        selected
                          ? "bg-[#8B6B4A] text-white border-[#8B6B4A] shadow-sm font-semibold"
                          : "bg-[#FCFBF8] border border-[#E2D4B7] text-gray-700 hover:bg-[#8B6B4A] hover:text-white"
                      }`}
                      onClick={() =>
                        selectAnswer(
                          option.value
                        )
                      }
                    >
                      <strong className="text-lg font-bold mb-1">
                        {
                          option.value
                        }
                      </strong>

                      <span className="text-xs font-sans">
                        {
                          option.label
                        }
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </section>

          {/* Previous / Next */}
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              className="border border-[#8B6B4A] text-[#8B6B4A] px-6 py-2 rounded-md hover:bg-[#8B6B4A] hover:text-white font-sans font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              onClick={
                previous
              }
              disabled={
                currentIndex === 0
              }
            >
              ← Previous
            </button>

            <button
              type="button"
              className="border border-[#8B6B4A] text-[#8B6B4A] px-6 py-2 rounded-md hover:bg-[#8B6B4A] hover:text-white font-sans font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              onClick={next}
              disabled={
                currentIndex ===
                totalQuestions - 1
              }
            >
              Next →
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-600 font-medium font-sans p-3 bg-red-50 border border-red-200 rounded-lg">
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
                width: `${
                  (answeredCount /
                    totalQuestions) *
                  100
                }%`,
              }}
            />
          </div>

          {/* Core */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#8B6B4A] mb-2 font-sans">
              CORE MOTIVATION ·{" "}
              {
                coreQuestions.length
              }
            </p>

            <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-6 gap-2 max-h-[220px] overflow-y-auto p-1">
              {coreQuestions.map(
                (question) => {
                  const index =
                    questions.indexOf(
                      question
                    );

                  return renderMapButton(
                    question,
                    index
                  );
                }
              )}
            </div>
          </div>

          {/* Instinct */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#8B6B4A] mb-2 font-sans">
              INSTINCT ·{" "}
              {
                instinctQuestions.length
              }
            </p>

            <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-6 gap-2 max-h-[160px] overflow-y-auto p-1">
              {instinctQuestions.map(
                (question) => {
                  const index =
                    questions.indexOf(
                      question
                    );

                  return renderMapButton(
                    question,
                    index
                  );
                }
              )}
            </div>
          </div>

          {/* Legend */}
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

                Tôi đồng ý cho MOSAIC
                sử dụng kết quả bài
                test này cùng với
                những thông tin phù
                hợp trong Profile để
                tạo thống kê tổng hợp
                và bộ lọc Statistics.

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

          {/* Submit */}
          <button
            type="button"
            className="w-full bg-[#8B6B4A] text-white border border-[#8B6B4A] py-2.5 rounded-md hover:bg-[#5C4326] font-sans font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
            onClick={submit}
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
            Có thể submit từ bất
            kỳ câu nào khi hoàn
            thành đủ{" "}
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