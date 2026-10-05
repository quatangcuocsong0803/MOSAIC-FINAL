"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { EnneagramType } from "@/src/data/enneagramQuestions";
import {
  enneagramTypeOrder,
  enneagramTypes,
} from "@/src/data/enneagramTypes";

type CertaintyLevel =
  | "low"
  | "moderate"
  | "high";

interface StoredResult {
  typeScores: Record<string, number>;
  rawScores: Record<string, number>;
  exposures: Record<string, number>;
  rankedTypes: Array<{
    type: EnneagramType;
    score: number;
    rawScore: number;
    exposure: number;
  }>;
  coreType: EnneagramType;
  wing: EnneagramType;
  wingStrength: number;
  certainty: {
    level: CertaintyLevel;
    margin: number;
    index: number;
  };
  tritype: {
    code: string;
    core: EnneagramType;
    heartFix: EnneagramType;
    headFix: EnneagramType;
    gutFix: EnneagramType;
  };
  instinctScores: Record<string, number>;
  instinctualStack: string[];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function scoreToRadius(score: number) {
  return 25 + clamp(score / 100, 0, 1) * 101;
}

function polarPoint(
  index: number,
  radius: number,
  cx = 140,
  cy = 140,
) {
  const angle =
    (Math.PI * 2 * index) / 9 - Math.PI / 2;

  return {
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius,
  };
}

function certaintyLabel(
  level: CertaintyLevel,
) {
  switch (level) {
    case "high":
      return "High";
    case "moderate":
      return "Moderate";
    default:
      return "Low";
  }
}

import { saveTestResult } from "@/app/actions/test";

export default function EnneagramResultPage() {
  const [result, setResult] =
    useState<StoredResult | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(
        "mosaic_enneagram_result",
      );

      if (stored) {
        const parsed = JSON.parse(stored) as StoredResult;
        setResult(parsed);

        if (parsed.coreType) {
          saveTestResult({
            testType: "ENNEAGRAM",
            resultName: `Type ${parsed.coreType}`,
            details: `Kết quả Enneagram: Type ${parsed.coreType}`,
          }).catch((err) => console.error("Lỗi đồng bộ DB Enneagram:", err));
        }
      }
    } catch {
      setResult(null);
    } finally {
      setMounted(true);
    }
  }, []);

  const radarPoints = useMemo(() => {
    if (!result) return "";

    return enneagramTypeOrder
      .map((type, index) => {
        const score = Number(
          result.typeScores[String(type)] ?? 50,
        );

        const point = polarPoint(
          index,
          scoreToRadius(score),
        );

        return `${point.x},${point.y}`;
      })
      .join(" ");
  }, [result]);

  if (!mounted) {
    return <main className="min-h-screen bg-[#FCFBF8]" />;
  }

  if (!result) {
    return (
      <main className="min-h-screen bg-[#FCFBF8] text-gray-800 font-sans px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6 text-xs font-semibold uppercase tracking-wider text-[#8B6B4A] font-sans">
            <Link
              href="/"
              className="hover:text-[#5C4326] transition-colors"
            >
              MOSAIC
            </Link>
            <span className="text-[#E2D4B7]">/</span>
            <Link
              href="/result"
              className="hover:text-[#5C4326] transition-colors"
            >
              KẾT QUẢ
            </Link>
            <span className="text-[#E2D4B7]">/</span>
            <span>ENNEAGRAM</span>
          </div>

          <div className="w-full flex flex-col items-center justify-center py-24 px-4 text-center mt-10">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#5C4326] font-bold mb-6 tracking-wide">
              KẾT QUẢ ENNEAGRAM
            </h1>

            <p className="font-sans text-lg md:text-xl text-gray-500 mb-10 max-w-2xl leading-relaxed">
              Hãy hoàn thành bài đánh giá Enneagram để nhận kết quả phân tích.
            </p>

            <Link
              href="/test/enneagram"
              className="inline-flex items-center gap-2 text-[#8B6B4A] font-sans text-lg tracking-wide hover:text-[#5C4326] underline underline-offset-8 decoration-1 decoration-transparent hover:decoration-[#5C4326] transition-all duration-300"
            >
              Bắt đầu làm bài test →
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const coreInfo =
    enneagramTypes[result.coreType];

  const wingInfo =
    enneagramTypes[result.wing];

  const ranking = enneagramTypeOrder
    .map((type) => ({
      type,
      score: Number(
        result.typeScores[String(type)] ?? 50,
      ),
    }))
    .sort((a, b) => b.score - a.score);

  const instinctStack =
    result.instinctualStack ?? [];

  return (
    <main className="min-h-screen bg-[#FCFBF8] text-gray-800 font-sans px-4 py-10">
      <div className="w-full max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-xs font-semibold uppercase tracking-wider text-[#8B6B4A] font-sans">
          <Link
            href="/"
            className="hover:text-[#5C4326] transition-colors"
          >
            MOSAIC
          </Link>
          <span className="text-[#E2D4B7]">/</span>
          <Link
            href="/result"
            className="hover:text-[#5C4326] transition-colors"
          >
            RESULT
          </Link>
          <span className="text-[#E2D4B7]">/</span>
          <span>ENNEAGRAM</span>
        </div>

        {/* Header */}
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#8B6B4A] mb-2 font-sans">
            ENNEAGRAM RESULT
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#5C4326] tracking-wide">
            ENNEAGRAM RESULT
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#6B5A46] max-w-2xl leading-relaxed font-sans">
            Core motivation, wing, certainty, instinctual pattern and tritype-style profile.
          </p>
        </header>

        {/* 1. Core Type Card */}
        <section className="bg-white border border-[#E2D4B7] rounded-xl shadow-sm p-6 text-gray-800 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Hộp vuông chứa số */}
            <div className="w-20 h-20 md:w-24 md:h-24 bg-[#FCFBF8] border border-[#E2D4B7] flex items-center justify-center rounded-lg shrink-0 shadow-xs">
              <span className="text-5xl font-serif text-[#5C4326] font-bold">
                {result.coreType}
              </span>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#8B6B4A] mb-1 font-sans">
                CORE TYPE
              </p>
              <h2 className="text-4xl font-serif text-[#5C4326] font-bold leading-tight">
                Type {result.coreType}
              </h2>
              <p className="text-base font-semibold text-[#8B6B4A] font-sans mt-0.5">
                {coreInfo.name}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {coreInfo.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="bg-[#FCFBF8] border border-[#E2D4B7] text-gray-600 px-3 py-1 rounded-full text-sm font-sans"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-[#E2D4B7]/60 pt-4 md:pt-0 md:pl-6 text-center md:text-left">
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 font-sans">
                Core score
              </span>
              <strong className="text-lg font-serif text-[#5C4326] font-bold mt-1 block">
                {Math.round(result.typeScores[String(result.coreType)] ?? 50)}/100
              </strong>
            </div>

            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 font-sans">
                Wing
              </span>
              <strong className="text-lg font-serif text-[#5C4326] font-bold mt-1 block">
                {result.coreType}w{result.wing}
              </strong>
            </div>

            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 font-sans">
                Certainty
              </span>
              <strong className="text-lg font-serif text-[#5C4326] font-bold mt-1 block">
                {certaintyLabel(result.certainty.level)}
              </strong>
            </div>
          </div>
        </section>

        {/* 2. Motivation Distribution (9-type profile) */}
        <section className="mb-6">
          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#8B6B4A] mb-1 font-sans">
                MOTIVATION DISTRIBUTION
              </p>
              <h2 className="font-serif text-2xl font-bold text-[#5C4326]">
                9-type profile
              </h2>
            </div>
            <span className="text-xs font-sans text-gray-500">
              relative index / 100
            </span>
          </div>

          <div className="bg-white border border-[#E2D4B7] rounded-xl shadow-sm p-6 text-gray-800 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Biểu đồ Radar */}
            <div className="flex items-center justify-center p-2">
              <svg
                viewBox="0 0 280 280"
                className="w-full max-w-[340px] h-auto overflow-visible"
                role="img"
                aria-label="Enneagram nine type motivation profile"
              >
                <circle
                  cx="140"
                  cy="140"
                  r="126"
                  className="fill-none stroke-[#E2D4B7]"
                  strokeWidth="1"
                />

                {[0.25, 0.5, 0.75, 1].map((level) => (
                  <polygon
                    key={level}
                    points={enneagramTypeOrder
                      .map((_, index) => {
                        const point = polarPoint(index, 25 + 101 * level);
                        return `${point.x},${point.y}`;
                      })
                      .join(" ")}
                    className="fill-none stroke-[#E2D4B7]/60"
                    strokeWidth="1"
                  />
                ))}

                {enneagramTypeOrder.map((_, index) => {
                  const inner = polarPoint(index, 25);
                  const outer = polarPoint(index, 126);
                  return (
                    <line
                      key={`spoke-${index}`}
                      x1={inner.x}
                      y1={inner.y}
                      x2={outer.x}
                      y2={outer.y}
                      className="stroke-[#E2D4B7]/60"
                      strokeWidth="1"
                    />
                  );
                })}

                <polygon
                  points={radarPoints}
                  className="fill-[#8B6B4A]/25 stroke-[#8B6B4A]"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                {enneagramTypeOrder.map((type, index) => {
                  const score = Number(result.typeScores[String(type)] ?? 50);
                  const point = polarPoint(index, scoreToRadius(score));
                  const labelPoint = polarPoint(index, 143);

                  return (
                    <g key={type}>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="4.5"
                        className="fill-[#8B6B4A]"
                      />
                      <text
                        x={labelPoint.x}
                        y={labelPoint.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xs font-bold fill-gray-700"
                        style={{ fontSize: "11px", fontWeight: "700" }}
                      >
                        {type}
                      </text>
                    </g>
                  );
                })}

                <circle
                  cx="140"
                  cy="140"
                  r="28"
                  className="fill-white stroke-[#E2D4B7]"
                  strokeWidth="1"
                />

                <text
                  x="140"
                  y="136"
                  textAnchor="middle"
                  className="font-serif font-bold text-sm fill-[#5C4326]"
                  style={{ fontSize: "13px", fontWeight: "700" }}
                >
                  {result.coreType}
                </text>

                <text
                  x="140"
                  y="152"
                  textAnchor="middle"
                  className="font-sans font-bold text-[8px] fill-[#8B6B4A] tracking-wider"
                  style={{ fontSize: "8px", fontWeight: "700", letterSpacing: "0.1em" }}
                >
                  CORE
                </text>
              </svg>
            </div>

            {/* Danh sách điểm số */}
            <div className="flex flex-col gap-3 font-sans">
              {ranking.map((item, index) => {
                const info = enneagramTypes[item.type];
                return (
                  <div key={item.type} className="relative">
                    <div className="flex justify-between items-center text-xs mb-1.5 text-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-sm bg-[#8B6B4A] shrink-0" />
                        <strong className="text-gray-800 font-semibold">
                          Type {item.type}
                        </strong>
                        <span className="text-gray-500">
                          {info.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {index === 0 && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B6B4A] bg-[#FAF8F5] border border-[#E2D4B7] px-1.5 py-0.5 rounded">
                            CORE
                          </span>
                        )}
                        <span className="font-semibold text-gray-700">
                          {item.score.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* Thanh Track & Bar */}
                    <div className="h-2 w-full rounded-full bg-[#E2D4B7]/30 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#C49A6C] to-[#8B6B4A] transition-all duration-300"
                        style={{
                          width: `${clamp(item.score, 0, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. Info Grid: Wing, Certainty, Instinctual Stack, Tritype */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 font-sans">
          {/* Card: Wing */}
          <article className="bg-white border border-[#E2D4B7] rounded-xl shadow-sm p-6 text-gray-800 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#8B6B4A] mb-1">
                WING
              </p>
              <h2 className="font-serif text-2xl font-bold text-[#5C4326] mb-1">
                {result.coreType}w{result.wing}
              </h2>
              <p className="text-[#8B6B4A] font-semibold text-sm mb-2">
                {wingInfo.name}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                The wing is selected only from the two types adjacent to the core type.
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-4 pt-3 border-t border-[#E2D4B7]/50">
              Relative wing strength:{" "}
              <strong className="text-gray-700 font-semibold">
                {Math.round(result.wingStrength)}%
              </strong>
            </p>
          </article>

          {/* Card: Certainty */}
          <article className="bg-white border border-[#E2D4B7] rounded-xl shadow-sm p-6 text-gray-800 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#8B6B4A] mb-1">
                CERTAINTY
              </p>
              <h2 className="font-serif text-2xl font-bold text-[#5C4326] mb-1">
                {certaintyLabel(result.certainty.level)}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-2">
                Top-two score margin:{" "}
                <strong className="text-gray-800 font-semibold">
                  {Number(result.certainty.margin ?? 0).toFixed(1)}
                </strong>
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-4 pt-3 border-t border-[#E2D4B7]/50">
              This is a MOSAIC scoring heuristic, not a probability or validated confidence estimate.
            </p>
          </article>

          {/* Card: Instinctual Stack */}
          <article className="bg-white border border-[#E2D4B7] rounded-xl shadow-sm p-6 text-gray-800">
            <p className="text-xs font-bold uppercase tracking-widest text-[#8B6B4A] mb-1">
              INSTINCTUAL STACK
            </p>
            <h2 className="font-serif text-2xl font-bold text-[#5C4326] mb-4">
              {instinctStack.map((value) => value.toUpperCase()).join(" / ")}
            </h2>

            <div className="flex flex-col gap-3">
              {["sp", "sx", "so"].map((instinct) => {
                const score = Number(result.instinctScores?.[instinct] ?? 50);
                return (
                  <div key={instinct} className="grid grid-cols-[36px_1fr_40px] items-center gap-3 text-xs">
                    <span className="font-bold text-gray-700 uppercase">
                      {instinct}
                    </span>
                    <div className="h-2 rounded-full bg-[#E2D4B7]/30 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#C49A6C] to-[#8B6B4A]"
                        style={{
                          width: `${clamp(score, 0, 100)}%`,
                        }}
                      />
                    </div>
                    <strong className="text-right text-gray-700 font-semibold">
                      {score.toFixed(1)}
                    </strong>
                  </div>
                );
              })}
            </div>
          </article>

          {/* Card: Tritype */}
          <article className="bg-white border border-[#E2D4B7] rounded-xl shadow-sm p-6 text-gray-800 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#8B6B4A] mb-1">
                TRITYPE
              </p>
              <h2 className="font-serif text-2xl font-bold text-[#5C4326] mb-3">
                {result.tritype.code}
              </h2>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="bg-[#FCFBF8] border border-[#E2D4B7] rounded-lg p-3 text-gray-800 text-center">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8B6B4A] mb-1 font-sans">
                    Heart
                  </span>
                  <strong className="text-base font-serif font-bold text-[#5C4326]">
                    Type {result.tritype.heartFix}
                  </strong>
                </div>

                <div className="bg-[#FCFBF8] border border-[#E2D4B7] rounded-lg p-3 text-gray-800 text-center">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8B6B4A] mb-1 font-sans">
                    Head
                  </span>
                  <strong className="text-base font-serif font-bold text-[#5C4326]">
                    Type {result.tritype.headFix}
                  </strong>
                </div>

                <div className="bg-[#FCFBF8] border border-[#E2D4B7] rounded-lg p-3 text-gray-800 text-center">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8B6B4A] mb-1 font-sans">
                    Gut
                  </span>
                  <strong className="text-base font-serif font-bold text-[#5C4326]">
                    Type {result.tritype.gutFix}
                  </strong>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-2 pt-3 border-t border-[#E2D4B7]/50">
              One strongest type is selected from each center; the core type fixes its own center.
            </p>
          </article>
        </section>

        {/* 5. Cụm nút bấm phía dưới */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <Link
            href="/test/enneagram"
            className="px-6 py-2 bg-white border border-[#8B6B4A] text-[#8B6B4A] rounded-md font-sans font-semibold hover:bg-[#8B6B4A] hover:text-white transition-all text-sm shadow-xs"
          >
            ← Làm lại bài Enneagram
          </Link>

          <Link
            href="/test"
            className="px-6 py-2 bg-white border border-[#8B6B4A] text-[#8B6B4A] rounded-md font-sans font-semibold hover:bg-[#8B6B4A] hover:text-white transition-all text-sm shadow-xs"
          >
            Quay lại Bài test
          </Link>

          <Link
            href="/"
            className="px-6 py-2 bg-[#8B6B4A] border border-[#8B6B4A] text-white rounded-md font-sans font-semibold hover:bg-[#5C4326] transition-all text-sm shadow-xs"
          >
            Trang chủ →
          </Link>
        </div>
      </div>
    </main>
  );
}
