"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { cognitiveOpenQuestions } from "@/lib/ai-test/cognitive-open-questions";
import { saveTestResult } from "@/app/actions/test";

const SCALE = [1, 2, 3, 4, 5] as const;

const SCALE_LABELS: Record<number, string> = {
  1: "Rất không đúng",
  2: "Không đúng",
  3: "Trung lập",
  4: "Khá đúng",
  5: "Rất đúng",
};

type Stage = "open" | "mcq";

type AdaptiveQuestion = {
  id: string;
  text: string;
};

type PlanResponse = {
  ok: boolean;
  totalQuestions?: number;
  questions?: AdaptiveQuestion[];
  planToken?: string;
  error?: string;
};

type AdaptiveTypeCompatibility = {
  bestFitType?: string | null;
  ambiguous?: boolean;
  candidateTypes?: string[];
  topGap?: number;
};

type AdaptiveScoreResult = {
  bestFitType?: string | null;
  tiedTopTypes?: string[];
  functionScores?: Record<string, number>;
  typeCompatibility?: AdaptiveTypeCompatibility;
};

type ScoreResponse = {
  ok: boolean;
  result?: AdaptiveScoreResult;
  error?: string;
  errors?: string[];
};

export default function CognitiveFunctionsAITestPage() {
  const router = useRouter();

  // ============================================================
  // STAGE
  // ============================================================

  const [stage, setStage] = useState<Stage>("open");

  // ============================================================
  // OPEN-ENDED STAGE
  // ============================================================

  const [openIndex, setOpenIndex] = useState(0);

  const [openAnswers, setOpenAnswers] = useState<
    Record<string, string>
  >({});

  // ============================================================
  // MCQ STAGE
  // ============================================================

  const [adaptiveQuestions, setAdaptiveQuestions] = useState<
    AdaptiveQuestion[]
  >([]);

  const [planToken, setPlanToken] = useState("");

  const [mcqIndex, setMcqIndex] = useState(0);

  const [mcqAnswers, setMcqAnswers] = useState<
    Record<string, number>
  >({});

  // ============================================================
  // CONSENT + UI STATE
  // ============================================================

  const [statisticsConsent, setStatisticsConsent] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ============================================================
  // CURRENT QUESTIONS
  // ============================================================

  const currentOpenQuestion =
    cognitiveOpenQuestions[openIndex];

  const currentMcqQuestion =
    adaptiveQuestions[mcqIndex];

  const totalOpenQuestions =
    cognitiveOpenQuestions.length;

  const totalMcqQuestions =
    adaptiveQuestions.length;

  const answeredMcqCount =
    adaptiveQuestions.filter(
      (question) =>
        mcqAnswers[question.id] !== undefined
    ).length;

  const allMcqAnswered =
    totalMcqQuestions > 0 &&
    answeredMcqCount === totalMcqQuestions;

  // ============================================================
  // OPEN-ENDED HELPERS
  // ============================================================

  function updateOpenAnswer(value: string) {
    if (!currentOpenQuestion) {
      return;
    }

    setOpenAnswers((current) => ({
      ...current,
      [currentOpenQuestion.id]: value,
    }));

    setError("");
  }

  function goPreviousOpen() {
    if (openIndex > 0) {
      setOpenIndex((index) => index - 1);
      setError("");
    }
  }

  function goNextOpen() {
    if (!currentOpenQuestion) {
      return;
    }

    const answer =
      openAnswers[currentOpenQuestion.id]?.trim() ?? "";

    if (!answer) {
      setError(
        "Bạn hãy viết câu trả lời trước khi tiếp tục."
      );
      return;
    }

    if (openIndex < totalOpenQuestions - 1) {
      setOpenIndex((index) => index + 1);
      setError("");
    }
  }

  async function createAdaptivePlan() {
    if (!currentOpenQuestion) {
      return;
    }

    const currentAnswer =
      openAnswers[currentOpenQuestion.id]?.trim() ?? "";

    if (!currentAnswer) {
      setError(
        "Bạn hãy viết câu trả lời trước khi tiếp tục."
      );
      return;
    }

    const missingQuestion =
      cognitiveOpenQuestions.find(
        (question) =>
          !openAnswers[question.id]?.trim()
      );

    if (missingQuestion) {
      const missingIndex =
        cognitiveOpenQuestions.findIndex(
          (question) =>
            question.id === missingQuestion.id
        );

      setOpenIndex(
        missingIndex >= 0 ? missingIndex : 0
      );

      setError(
        "Bạn cần hoàn thành đủ các câu hỏi mở trước khi tạo bài test thích ứng."
      );

      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/ai-test/plan",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            answers:
              cognitiveOpenQuestions.map(
                (question) => ({
                  questionId: question.id,
                  answer:
                    openAnswers[
                      question.id
                    ].trim(),
                })
              ),
          }),
        }
      );

      const data: PlanResponse =
        await response.json();

      if (
        !response.ok ||
        !data.ok ||
        !data.questions ||
        !data.planToken
      ) {
        throw new Error(
          data.error ||
            "Không thể tạo bài test thích ứng."
        );
      }

      setAdaptiveQuestions(
        data.questions
      );

      setPlanToken(
        data.planToken
      );

      setMcqIndex(0);

      setMcqAnswers({});

      /*
       * Không cần giữ raw open answers trong state
       * sau khi server đã tạo adaptive plan.
       */
      setOpenAnswers({});

      setStage("mcq");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Đã xảy ra lỗi khi tạo bài test thích ứng."
      );
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // MCQ HELPERS
  // ============================================================

  function selectMcqAnswer(
    value: number
  ) {
    if (!currentMcqQuestion) {
      return;
    }

    setMcqAnswers((current) => ({
      ...current,
      [currentMcqQuestion.id]: value,
    }));

    setError("");
  }

  function goPreviousMcq() {
    if (mcqIndex > 0) {
      setMcqIndex((index) => index - 1);
      setError("");
    }
  }

  function goNextMcq() {
    if (!currentMcqQuestion) {
      return;
    }

    if (
      mcqAnswers[
        currentMcqQuestion.id
      ] === undefined
    ) {
      setError(
        "Bạn hãy chọn một đáp án trước khi tiếp tục."
      );
      return;
    }

    if (
      mcqIndex <
      totalMcqQuestions - 1
    ) {
      setMcqIndex(
        (index) => index + 1
      );

      setError("");
    }
  }

  function goToMcqQuestion(
    index: number
  ) {
    if (
      index < 0 ||
      index >= totalMcqQuestions
    ) {
      return;
    }

    setMcqIndex(index);
    setError("");
  }

  // ============================================================
  // FINAL SUBMIT
  // ============================================================

  async function submitAdaptiveTest() {
    if (!planToken) {
      setError(
        "Không tìm thấy adaptive plan. Hãy bắt đầu lại bài test."
      );
      return;
    }

    if (!allMcqAnswered) {
      setError(
        `Bạn còn ${
          totalMcqQuestions -
          answeredMcqCount
        } câu chưa trả lời.`
      );

      return;
    }

    setLoading(true);
    setError("");

    try {
      /*
       * Scoring hoàn toàn deterministic.
       * Không gọi AI ở bước này.
       */
      const response = await fetch(
        "/api/ai-test/score",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            planToken,
            answers: mcqAnswers,
          }),
        }
      );

      const data: ScoreResponse =
        await response.json();

      if (
        !response.ok ||
        !data.ok ||
        !data.result
      ) {
        throw new Error(
          data.errors?.join(" ") ||
            data.error ||
            "Không thể chấm bài test."
        );
      }

      const result = data.result;

      /*
       * Nếu compatibility engine báo ambiguous,
       * MOSAIC không ép ra một MBTI type.
       */
      const isAmbiguous =
        result.typeCompatibility
          ?.ambiguous === true;

      const finalType =
        isAmbiguous
          ? null
          : (
              result.typeCompatibility
                ?.bestFitType ||
              result.bestFitType ||
              null
            );

      const candidateTypes =
        result.typeCompatibility
          ?.candidateTypes ?? [];

      /*
       * Lưu full scoring result tạm trong session
       * để các trang khác có thể đọc nếu cần.
       *
       * Không chứa raw open-ended answers.
       */
      sessionStorage.setItem(
        "mosaic_scoring_result",
        JSON.stringify({
          ...result,
          testVariant:
            "AI_ADAPTIVE",
        })
      );

      /*
       * Nếu chưa đủ rõ để chọn một type,
       * vẫn lưu completion để:
       *
       * - Profile biết user đã làm bài
       * - Statistics vẫn có thể đếm lượt làm test
       *
       * nhưng không giả vờ rằng đã xác định được MBTI.
       */
      const resultName =
        finalType ??
        "UNRESOLVED";

      const details =
        finalType
          ? `Kết quả Cognitive Functions AI Adaptive: ${finalType}`
          : `Kết quả Cognitive Functions AI Adaptive chưa đủ phân biệt rõ.${
              candidateTypes.length > 0
                ? ` Candidate types: ${candidateTypes.join(
                    ", "
                  )}.`
                : ""
            }`;

      const saveResult =
        await saveTestResult({
          testType: "MBTI",
          testVariant:
            "AI_ADAPTIVE",
          resultName,
          details,
          statisticsConsent,
        });

      if (!saveResult.success) {
        console.warn(
          "Không lưu được kết quả AI Adaptive:",
          saveResult.error
        );
      }

      router.push("/result/mbti");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Đã xảy ra lỗi khi chấm bài test."
      );
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // OPEN-ENDED SCREEN
  // ============================================================

  if (stage === "open") {
    if (!currentOpenQuestion) {
      return (
        <main className="min-h-screen bg-[#FCFBF8] flex items-center justify-center p-8">
          <p>
            Không tìm thấy câu hỏi mở.
          </p>
        </main>
      );
    }

    const currentAnswer =
      openAnswers[
        currentOpenQuestion.id
      ] ?? "";

    const openProgress =
      ((openIndex + 1) /
        totalOpenQuestions) *
      100;

    return (
      <main className="min-h-screen bg-[#FCFBF8] text-gray-800 px-4 py-8">
        <div className="w-full max-w-3xl mx-auto">
          <header className="text-center mb-8">
            <div className="text-xs font-bold tracking-[0.18em] uppercase text-[#8B6B4A] mb-3">
              MOSAIC · AI Adaptive
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#5C4326]">
              Cognitive Functions
            </h1>

            <p className="mt-4 text-sm sm:text-base text-[#6B5A46] leading-relaxed max-w-2xl mx-auto">
              Giai đoạn đầu gồm{" "}
              {totalOpenQuestions} câu hỏi mở.
              Hãy mô tả cách bạn thật sự suy nghĩ
              hoặc đưa ra quyết định. Không có đáp án
              đúng hay sai.
            </p>
          </header>

          <section className="bg-white border border-[#E2D4B7] rounded-xl shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 mb-4">
              <span className="text-xs font-bold tracking-wider text-[#8B6B4A]">
                CÂU MỞ{" "}
                {openIndex + 1} /{" "}
                {totalOpenQuestions}
              </span>

              <span className="text-[11px] font-semibold text-[#8B6B4A] bg-[#FAF8F5] border border-[#E2D4B7] px-3 py-1 rounded-full">
                Giai đoạn khám phá
              </span>
            </div>

            <div className="w-full h-2 bg-[#FAF8F5] border border-[#E2D4B7] rounded-full overflow-hidden mb-7">
              <div
                className="h-full bg-[#8B6B4A] transition-all duration-300"
                style={{
                  width: `${openProgress}%`,
                }}
              />
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#5C4326] leading-relaxed">
              {
                currentOpenQuestion.prompt
              }
            </h2>

            <p className="mt-3 text-xs text-gray-500 leading-relaxed">
              Bạn không cần cố gắng viết theo bất kỳ
              “kiểu tính cách” nào. Hãy trả lời tự nhiên
              nhất có thể.
            </p>

            <textarea
              value={currentAnswer}
              onChange={(event) =>
                updateOpenAnswer(
                  event.target.value
                )
              }
              disabled={loading}
              placeholder="Viết câu trả lời của bạn ở đây..."
              className="mt-6 w-full min-h-[220px] resize-y rounded-xl border border-[#E2D4B7] bg-[#FCFBF8] px-4 py-4 text-sm leading-relaxed text-gray-800 outline-none focus:border-[#8B6B4A] transition-colors disabled:opacity-60"
            />

            <div className="mt-3 text-xs text-gray-400">
              {currentAnswer.length} ký tự
            </div>

            {error && (
              <p className="mt-5 text-xs text-red-600 font-medium p-3 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </p>
            )}

            <div className="mt-7 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={
                  goPreviousOpen
                }
                disabled={
                  openIndex === 0 ||
                  loading
                }
                className="border border-[#8B6B4A] text-[#8B6B4A] px-5 py-2.5 rounded-md hover:bg-[#8B6B4A] hover:text-white font-semibold text-sm transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                ← Previous
              </button>

              {openIndex <
              totalOpenQuestions - 1 ? (
                <button
                  type="button"
                  onClick={
                    goNextOpen
                  }
                  disabled={loading}
                  className="bg-[#8B6B4A] text-white border border-[#8B6B4A] px-5 py-2.5 rounded-md hover:bg-[#5C4326] font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  Tiếp tục →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={
                    createAdaptivePlan
                  }
                  disabled={loading}
                  className="bg-[#8B6B4A] text-white border border-[#8B6B4A] px-5 py-2.5 rounded-md hover:bg-[#5C4326] font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  {loading
                    ? "Đang tạo bài test..."
                    : "Tạo phần trắc nghiệm →"}
                </button>
              )}
            </div>
          </section>

          <div className="mt-6 rounded-xl border border-[#E2D4B7] bg-white/60 p-4 text-xs text-[#6B5A46] leading-relaxed">
            <strong className="text-[#5C4326]">
              Về AI và quyền riêng tư:
            </strong>{" "}
            câu trả lời mở được gửi qua server
            MOSAIC để AI phân tích tạm thời nhằm
            chọn câu hỏi tiếp theo. AI không quyết
            định kết quả cuối. MOSAIC không lưu nội
            dung câu trả lời mở vào TestResult.
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/test"
              className="text-xs font-semibold text-[#8B6B4A] hover:text-[#5C4326]"
            >
              ← Quay lại lựa chọn bài test
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // MCQ SCREEN
  // ============================================================

  if (!currentMcqQuestion) {
    return (
      <main className="min-h-screen bg-[#FCFBF8] flex items-center justify-center p-8">
        <p>
          Không tìm thấy câu hỏi adaptive.
        </p>
      </main>
    );
  }

  const answerForCurrent =
    mcqAnswers[
      currentMcqQuestion.id
    ];

  const mcqProgress =
    totalMcqQuestions > 0
      ? Math.round(
          (answeredMcqCount /
            totalMcqQuestions) *
            100
        )
      : 0;

  return (
    <main className="min-h-screen bg-[#FCFBF8] text-gray-800 px-4 py-8">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ====================================================
            MAIN QUESTION AREA
            ==================================================== */}
        <section className="lg:col-span-2 flex flex-col gap-6">
          <header>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold tracking-wider uppercase text-[#8B6B4A]">
              <Link
                href="/"
                className="hover:text-[#5C4326]"
              >
                MOSAIC
              </Link>

              <span className="text-[#E2D4B7]">
                /
              </span>

              <Link
                href="/test"
                className="hover:text-[#5C4326]"
              >
                TEST
              </Link>

              <span className="text-[#E2D4B7]">
                /
              </span>

              <span>
                AI ADAPTIVE
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-serif text-4xl text-[#5C4326] font-bold">
                Cognitive Function Assessment
              </h1>

              <span className="text-[11px] uppercase tracking-wider font-bold text-[#8B6B4A] bg-[#FAF8F5] border border-[#E2D4B7] px-3 py-1 rounded-full">
                AI Adaptive ·{" "}
                {totalMcqQuestions} câu
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              AI đã hoàn thành việc định tuyến.
              Phần này được chấm bằng hệ thống
              scoring deterministic của MOSAIC.
            </p>
          </header>

          <section className="bg-white border border-[#E2D4B7] rounded-xl shadow-sm p-6">
            <div className="mb-4">
              <span className="text-xs font-bold text-[#8B6B4A] tracking-wider">
                QUESTION{" "}
                {mcqIndex + 1} /{" "}
                {totalMcqQuestions}
              </span>
            </div>

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#5C4326] leading-relaxed mb-2">
              {
                currentMcqQuestion.text
              }
            </h2>

            <p className="text-xs text-gray-500 mb-6">
              Chọn mức độ phù hợp với bạn nhất.
            </p>

            <div
              className="grid grid-cols-1 sm:grid-cols-5 gap-3"
              role="radiogroup"
              aria-label="Likert scale"
            >
              {SCALE.map((value) => {
                const selected =
                  answerForCurrent ===
                  value;

                return (
                  <label
                    key={value}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-xl cursor-pointer text-center select-none transition-all ${
                      selected
                        ? "bg-[#8B6B4A] text-white border-[#8B6B4A] shadow-sm font-semibold"
                        : "bg-[#FCFBF8] border border-[#E2D4B7] text-gray-700 hover:bg-[#8B6B4A] hover:text-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name={
                        currentMcqQuestion.id
                      }
                      value={value}
                      checked={selected}
                      onChange={() =>
                        selectMcqAnswer(
                          value
                        )
                      }
                      className="hidden"
                    />

                    <span className="text-lg font-bold mb-1">
                      {value}
                    </span>

                    <span className="text-xs">
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

          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={
                goPreviousMcq
              }
              disabled={
                mcqIndex === 0 ||
                loading
              }
              className="border border-[#8B6B4A] text-[#8B6B4A] px-6 py-2 rounded-md hover:bg-[#8B6B4A] hover:text-white font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              ← Previous
            </button>

            <button
              type="button"
              onClick={
                goNextMcq
              }
              disabled={
                mcqIndex ===
                  totalMcqQuestions -
                    1 ||
                loading
              }
              className="border border-[#8B6B4A] text-[#8B6B4A] px-6 py-2 rounded-md hover:bg-[#8B6B4A] hover:text-white font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              Next →
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-600 font-medium p-3 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </p>
          )}
        </section>

        {/* ====================================================
            QUESTION MAP / SUBMIT
            ==================================================== */}
        <aside className="lg:col-span-1 bg-white border border-[#E2D4B7] rounded-xl p-4 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-[#5C4326] text-xl font-bold">
              Question Map
            </h2>

            <span className="text-xs font-semibold text-[#8B6B4A]">
              {answeredMcqCount}/
              {totalMcqQuestions}
            </span>
          </div>

          <div className="w-full h-2 bg-[#FAF8F5] border border-[#E2D4B7] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#8B6B4A] transition-all duration-300"
              style={{
                width: `${mcqProgress}%`,
              }}
            />
          </div>

          <div className="grid grid-cols-6 gap-2 max-h-[340px] overflow-y-auto p-1">
            {adaptiveQuestions.map(
              (question, index) => {
                const answered =
                  mcqAnswers[
                    question.id
                  ] !== undefined;

                const current =
                  index === mcqIndex;

                let buttonClass =
                  "bg-[#FCFBF8] border border-[#E2D4B7] text-gray-500";

                if (answered) {
                  buttonClass =
                    "bg-[#E2D4B7] text-[#5C4326] border-[#8B6B4A]";
                }

                if (current) {
                  buttonClass =
                    "border-2 border-[#8B6B4A] bg-[#FCFBF8] text-[#8B6B4A] font-bold";
                }

                return (
                  <button
                    key={
                      question.id
                    }
                    type="button"
                    onClick={() =>
                      goToMcqQuestion(
                        index
                      )
                    }
                    className={`w-full aspect-square rounded flex items-center justify-center text-xs transition-all ${buttonClass}`}
                  >
                    {index + 1}
                  </button>
                );
              }
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-[#E2D4B7]/60">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-[#E2D4B7] border border-[#8B6B4A]" />
              Đã trả lời
            </span>

            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-[#FCFBF8] border border-[#E2D4B7]" />
              Chưa trả lời
            </span>
          </div>

          {/* Statistics consent */}
          <div className="rounded-xl border border-[#E2D4B7] bg-[#FCFBF8] p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={
                  statisticsConsent
                }
                onChange={(event) =>
                  setStatisticsConsent(
                    event.target.checked
                  )
                }
                className="mt-1 h-4 w-4 shrink-0 accent-[#8B6B4A]"
              />

              <span className="text-xs text-gray-600 leading-relaxed">
                <span className="font-semibold text-[#5C4326]">
                  Đồng ý đóng góp dữ liệu
                  cho Statistics
                </span>

                <br />

                Tôi đồng ý cho MOSAIC sử dụng
                kết quả bài test này cùng với
                những thông tin phù hợp trong
                Profile để tạo thống kê tổng
                hợp và bộ lọc Statistics.

                <br />

                <span className="text-gray-500">
                  Không đồng ý vẫn có thể xem
                  và lưu kết quả bình thường.
                  Lựa chọn này không làm Profile
                  hoặc kết quả cá nhân trở thành
                  thông tin công khai.
                </span>
              </span>
            </label>
          </div>

          <button
            type="button"
            onClick={
              submitAdaptiveTest
            }
            disabled={
              !allMcqAnswered ||
              loading
            }
            className="w-full bg-[#8B6B4A] text-white border border-[#8B6B4A] py-2.5 rounded-md hover:bg-[#5C4326] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Đang chấm kết quả..."
              : allMcqAnswered
                ? "Hoàn thành & Xem kết quả →"
                : `Còn ${
                    totalMcqQuestions -
                    answeredMcqCount
                  } câu`}
          </button>

          <p className="text-[11px] text-gray-500 text-center leading-relaxed">
            AI không tham gia bước chấm điểm cuối.
            Kết quả được tính từ các câu Likert
            bằng scoring engine của MOSAIC.
          </p>

          <div className="text-center pt-1 border-t border-[#E2D4B7]/40">
            <Link
              href="/test"
              className="text-xs font-semibold text-[#8B6B4A] hover:text-[#5C4326]"
            >
              ← Back to Tests
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}