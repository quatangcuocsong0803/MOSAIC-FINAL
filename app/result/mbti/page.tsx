"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { type ScoringResult } from "@/src/utils/cognitiveFunctionScoring";
import cognitiveFunctions from "@/src/data/cognitiveFunctions";
import mbtiTypeStacks from "@/src/data/mbtiTypeStacks";
import typeDescriptions from "@/src/data/typeDescriptions";
import { getMbtiGroup, MBTI_GROUPS_LIST } from "@/lib/mbti-colors";


export default function ResultPage() {
  const [result, setResult] = useState<ScoringResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAllTypes, setShowAllTypes] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("mosaic_scoring_result");

      if (stored) {
        const parsed = JSON.parse(stored) as ScoringResult;
        setResult(parsed);
        const mbtiType = (parsed.typeCompatibility?.bestFitType || parsed.bestFitType || "INTJ").toUpperCase();
        localStorage.setItem("userMBTI", mbtiType);
        document.title = `Kết quả MBTI - ${mbtiType} | MOSAIC`;
      }
    } catch (e) {
      console.error("Failed to parse scoring result from sessionStorage", e);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FCFBF8] text-gray-800 font-sans flex items-center justify-center">
        <p className="text-sm text-[#8B6B4A]">
          Đang tải kết quả bài đánh giá của bạn...
        </p>
      </main>
    );
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
            <span>MBTI</span>
          </div>

          <div className="w-full flex flex-col items-center justify-center py-24 px-4 text-center mt-10">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#5C4326] font-bold mb-6 tracking-wide">
              KẾT QUẢ MBTI
            </h1>

            <p className="font-sans text-lg md:text-xl text-gray-500 mb-10 max-w-2xl leading-relaxed">
              Hãy hoàn thành bài đánh giá Chức năng nhận thức để nhận kết quả phân tích.
            </p>

            <Link
              href="/test/mbti"
              className="inline-flex items-center gap-2 text-[#8B6B4A] font-sans text-lg tracking-wide hover:text-[#5C4326] underline underline-offset-8 decoration-1 decoration-transparent hover:decoration-[#5C4326] transition-all duration-300"
            >
              Bắt đầu làm bài test →
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const profileType =
    result.typeCompatibility?.bestFitType ?? result.bestFitType;

  const profileCompatibility =
    result.typeCompatibility?.rankedTypes.find(
      (item) => item.type === profileType,
    )?.compatibility ?? 0;

  const bestTypeStack = mbtiTypeStacks[profileType];

  const stackDetails = bestTypeStack
    ? [
      { role: "Chủ đạo", fn: bestTypeStack.dominant },
      { role: "Hỗ trợ", fn: bestTypeStack.auxiliary },
      { role: "Thứ ba", fn: bestTypeStack.tertiary },
      { role: "Yếu nhất", fn: bestTypeStack.inferior },
    ]
    : [];

  const typeDescription = typeDescriptions[profileType];

  const compatibilityRanking =
    result.typeCompatibility?.rankedTypes ?? [];

  const visibleTypes = showAllTypes
    ? compatibilityRanking
    : compatibilityRanking.slice(0, 3);

  return (
    <main className="mosaic-page-container">
      {/* Result Header */}
      <header
        className="mosaic-header"
        style={{ maxWidth: "760px" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "0.625rem",
          }}
        >
          <span className="mosaic-brand">MOSAIC</span>

          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--text-faint)",
            }}
          >
            /
          </span>

          <span
            style={{
              fontSize: "0.8125rem",
              color: "var(--text-muted)",
              fontWeight: 500,
            }}
          >
            Kết quả tính cách
          </span>
        </div>

        <Link href="/test/mbti" className="mosaic-link-btn">
          Làm lại bài đánh giá
        </Link>
      </header>

      <div className="mosaic-result-container">
        {/* 1. Primary Profile */}
        <section
          className="mosaic-card"
          style={{
            maxWidth: "100%",
            margin: 0,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: 600,
                color: "var(--text-muted)",
              }}
            >
              LOẠI HÌNH MOSAIC CỦA BẠN
            </span>

            <h1
              className="mosaic-title"
              style={{
                fontSize: "3rem",
                marginTop: "0.25rem",
              }}
            >
              {profileType}
            </h1>

            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
                marginTop: "0.5rem",
                maxWidth: "520px",
                lineHeight: "1.55",
              }}
            >
              Câu trả lời của bạn khớp nhất với mô hình chức năng nhận thức của {profileType}.
            </p>

            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
                marginTop: "0.75rem",
              }}
            >
              Mức độ phù hợp:{" "}
              <strong style={{ color: "var(--text-primary)" }}>
                {profileCompatibility}%
              </strong>
            </p>
          </div>

          {bestTypeStack && (
            <div className="mosaic-stack-chips">
              {stackDetails.map((item) => (
                <div className="mosaic-chip" key={item.role}>
                  <span className="mosaic-chip-role">
                    {item.role}
                  </span>

                  <span className="mosaic-chip-fn">
                    {item.fn}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 2. Type Overview */}
        {typeDescription && (
          <section
            className="mosaic-card"
            style={{
              maxWidth: "100%",
              margin: 0,
            }}
          >
            <h2
              className="mosaic-title"
              style={{
                fontSize: "1.25rem",
                marginBottom: "0.625rem",
              }}
            >
              Về {profileType}
            </h2>

            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
                lineHeight: "1.6",
                marginBottom: "1rem",
              }}
            >
              {typeDescription.overview}
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              {typeDescription.keywords.map((keyword: string) => (
                <span className="mosaic-chip" key={keyword}>
                  <span className="mosaic-chip-fn">
                    {keyword}
                  </span>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* 3. Cognitive Function Breakdown */}
        <section
          className="mosaic-card"
          style={{
            maxWidth: "100%",
            margin: 0,
          }}
        >
          <h2
            className="mosaic-title"
            style={{
              fontSize: "1.25rem",
              marginBottom: "0.375rem",
            }}
          >
            Điểm chức năng nhận thức
          </h2>

          <p
            style={{
              fontSize: "0.8125rem",
              color: "var(--text-muted)",
              marginBottom: "1.5rem",
            }}
          >
            Điểm trung bình được tính toán cho 8 chức năng nhận thức (thang điểm 1.00 – 5.00).
          </p>

          <div>
            {result.functionRanking.map((item, idx) => {
              const meta = cognitiveFunctions[item.id];
              const scorePercent = Math.round(
                (item.score / 5) * 100,
              );

              return (
                <div
                  key={item.id}
                  className="mosaic-function-row"
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: "0.375rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-faint)",
                          fontWeight: 600,
                        }}
                      >
                        #{idx + 1}
                      </span>

                      <strong
                        style={{
                          fontSize: "0.9375rem",
                          color: "var(--text-primary)",
                        }}
                      >
                        {item.id}
                      </strong>

                      <span
                        style={{
                          fontSize: "0.8125rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        — {meta?.name}
                      </span>
                    </div>

                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      {item.score.toFixed(2)}
                    </span>
                  </div>

                  <div
                    className="mosaic-progress-track"
                    style={{
                      height: "4px",
                      margin: "0.5rem 0",
                    }}
                  >
                    <div
                      className="mosaic-progress-fill"
                      style={{
                        width: `${scorePercent}%`,
                      }}
                    />
                  </div>

                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      lineHeight: "1.4",
                    }}
                  >
                    {meta?.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. 16 Types Profile Fit */}
        <section
          className="mosaic-card"
          style={{
            maxWidth: "100%",
            margin: 0,
          }}
        >
          <h2
            className="mosaic-title"
            style={{
              fontSize: "1.25rem",
              marginBottom: "0.375rem",
            }}
          >
            Mức độ phù hợp với 16 kiểu
          </h2>

          <p
            style={{
              fontSize: "0.8125rem",
              color: "var(--text-muted)",
              marginBottom: "1rem",
              lineHeight: "1.5",
            }}
          >
            Mức độ tương thích tương đối dựa trên độ mạnh của chức năng nhận thức, thứ tự xếp hạng và vị trí ngăn xếp lý thuyết. Đây không phải là xác suất hay điểm số tuyệt đối.
          </p>

          {/* Chú thích 4 nhóm màu MBTI */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem 1.25rem",
              marginBottom: "1.25rem",
              padding: "0.625rem 0.875rem",
              borderRadius: "0.375rem",
              backgroundColor: "rgba(245, 240, 230, 0.45)",
              border: "1px solid var(--border-light)",
            }}
            aria-label="Chú thích nhóm tính cách MBTI"
          >
            {MBTI_GROUPS_LIST.map((group) => (
              <div
                key={group.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.75rem",
                  color: group.text,
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "9999px",
                    backgroundColor: group.dotColor,
                    display: "inline-block",
                  }}
                  aria-hidden="true"
                />
                <span>{group.name}</span>
              </div>
            ))}
          </div>

          <div className="mosaic-type-grid">
            {visibleTypes.map((typeEntry, rank) => {
              const isTop = rank === 0;
              const group = getMbtiGroup(typeEntry.type);

              return (
                <div
                  key={typeEntry.type}
                  className="mosaic-type-item"
                  style={{
                    backgroundColor: isTop ? group.topBg : group.bg,
                    borderColor: isTop ? group.topBorder : group.border,
                    borderWidth: isTop ? "2px" : "1px",
                    borderStyle: "solid",
                    color: group.text,
                  }}
                >
                  <span
                    className="mosaic-type-label"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      color: group.text,
                    }}
                  >
                    <span
                      style={{
                        opacity: 0.75,
                        marginRight: "0.375rem",
                        color: group.text,
                        fontWeight: 600,
                      }}
                    >
                      {rank + 1}.
                    </span>

                    <strong style={{ color: group.text, fontSize: "0.9375rem" }}>
                      {typeEntry.type}
                    </strong>
                  </span>

                  <span
                    className="mosaic-type-score"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.8125rem",
                      fontWeight: 700,
                      color: group.text,
                    }}
                  >
                    {typeEntry.compatibility}%
                  </span>
                </div>
              );
            })}
          </div>

          {compatibilityRanking.length > 3 && (
            <div
              style={{
                textAlign: "center",
                marginTop: "1.25rem",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setShowAllTypes((current) => !current)
                }
                className="mosaic-link-btn"
                style={{
                  border: 0,
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                {showAllTypes ? "Thu gọn top 3" : "Xem tất cả 16"}
              </button>
            </div>
          )}
        </section>

        {/* 5. Function Stack Details */}
        {bestTypeStack && (
          <section
            className="mosaic-card"
            style={{
              maxWidth: "100%",
              margin: 0,
            }}
          >
            <h2
              className="mosaic-title"
              style={{
                fontSize: "1.25rem",
                marginBottom: "0.375rem",
              }}
            >
              Hiểu hồ sơ của bạn
            </h2>

            <p
              style={{
                fontSize: "0.8125rem",
                color: "var(--text-muted)",
                marginBottom: "1.25rem",
                lineHeight: "1.5",
              }}
            >
              Ngăn xếp chức năng nhận thức 4 vị trí của bạn cùng điểm số tương ứng của từng chức năng.
            </p>

            <div className="mosaic-type-grid">
              {stackDetails.map((item) => {
                const meta = cognitiveFunctions[item.fn];
                const score =
                  result.functionScores[item.fn];

                return (
                  <div
                    key={item.role}
                    className="mosaic-type-item"
                    style={{
                      display: "block",
                      padding: "1rem",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.6875rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--text-muted)",
                        marginBottom: "0.375rem",
                      }}
                    >
                      {item.role}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "0.5rem",
                      }}
                    >
                      <strong
                        style={{
                          fontSize: "1.125rem",
                        }}
                      >
                        {item.fn}
                      </strong>

                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {meta?.name}
                      </span>
                    </div>

                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.875rem",
                        marginTop: "0.5rem",
                      }}
                    >
                      {score?.toFixed(2)}
                    </div>

                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        lineHeight: "1.45",
                        marginTop: "0.5rem",
                      }}
                    >
                      {meta?.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          marginTop: "1.75rem",
        }}
      >
        <Link
          href="/test"
          className="mosaic-link-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.7rem 1rem",
            border: "1px solid var(--border-color, #dedbd3)",
            borderRadius: "0.75rem",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          ← Quay lại Bài test
        </Link>

        <Link
          href="/"
          className="mosaic-link-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.7rem 1rem",
            border: "1px solid var(--border-color, #dedbd3)",
            borderRadius: "0.75rem",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          ← Trang chủ
        </Link>
      </div>

      <footer
        style={{
          textAlign: "center",
          fontSize: "0.75rem",
          color: "var(--text-faint)",
          marginTop: "2rem",
        }}
      >
        MOSAIC — Bài đánh giá chức năng nhận thức
      </footer>
    </main>
  );
}
