"use client";
import type { TestResultItem, PersonalityKind } from "@/app/actions/profile";
import { confirmTestPersonalityType } from "@/app/actions/profile";
import { setTestStatisticsConsent } from "@/app/actions/test";
import { useEffect, useState } from "react";
export default function TestHistory({
  results: initialResults,
  remote = false,
  onChange,
}: {
  results: TestResultItem[];
  remote?: boolean;
  onChange: () => Promise<void>;
}) {
  const [busy, setBusy] = useState<string>(),
    [error, setError] = useState("");
  const [results, setResults] = useState(initialResults);
  const [next, setNext] = useState<string>();
  const [loading, setLoading] = useState(remote);
  async function load(cursor?: string) {
    setLoading(true); setError('');
    try {
      const response = await fetch(`/api/profile/test-results${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`, { cache: 'no-store' });
      if (!response.ok) throw Error('Chưa tải được kết quả test.');
      const data = await response.json();
      setResults(previous => cursor ? [...previous, ...data.items] : data.items); setNext(data.next);
    } catch { setError('Chưa tải được kết quả test.'); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    if (!remote) { setResults(initialResults); return; }
    const controller = new AbortController();
    setLoading(true);
    fetch('/api/profile/test-results', { cache: 'no-store', signal: controller.signal }).then(async response => {
      if (!response.ok) throw Error();
      const data = await response.json();
      if (!controller.signal.aborted) { setResults(data.items); setNext(data.next); setLoading(false); }
    }).catch(() => { if (!controller.signal.aborted) { setError('Chưa tải được kết quả test.'); setLoading(false); } });
    return () => controller.abort();
  }, [remote, initialResults]);
  const counts: Record<string, number> = {};
  const numbers: Record<string, number> = {};
  [...results]
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() ||
        a.id.localeCompare(b.id),
    )
    .forEach((r) => {
      counts[r.testType] = (counts[r.testType] || 0) + 1;
      numbers[r.id] = r.attemptNumber ?? counts[r.testType];
    });
  const months: Record<string, TestResultItem[]> = {};
  [...results]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .forEach((r) => {
      const d = new Date(r.createdAt);
      const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      (months[month] ||= []).push(r);
    });
  async function act(
    id: string,
    fn: () => Promise<{ success: boolean; error?: string }>,
  ) {
    setBusy(id);
    setError("");
    try {
      const r = await fn();
      if (!r.success) throw Error(r.error || "Chưa cập nhật được.");
      await onChange();
      if (remote) await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chưa cập nhật được.");
    } finally {
      setBusy(undefined);
    }
  }
  return (
    <section
      className="mosaic-profile-card space-y-6"
      aria-labelledby="test-history"
    >
      <div>
        <p className="text-xs uppercase tracking-widest">Chỉ mình bạn thấy</p>
        <h2 id="test-history" className="font-serif text-3xl">
          Kết quả test
        </h2>
        <p className="mt-2 text-sm">
          Consent ở mỗi thẻ chỉ áp dụng cho lần test đó. Chọn làm kết quả trên
          hồ sơ không tự chia sẻ kết quả đã xác nhận.
        </p>
      </div>
      {error && (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      )}
      {loading && !results.length && <p role="status">Đang tải kết quả test…</p>}
      {!loading && !results.length && (
        <p>
          Bạn chưa có kết quả test.{" "}
          <a className="underline" href="/test">
            Làm bài test →
          </a>
        </p>
      )}
      {Object.entries(months).map(([month, items]) => (
        <div key={month}>
          <h3 className="mb-4 border-b border-[#CDB580] pb-2 font-serif text-xl">
            Tháng {Number(month.slice(5))} / {month.slice(0, 4)}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((r) => {
              const mbti = r.resultName
                .match(/\b[IE][NS][TF][JP]\b/i)?.[0]
                .toLowerCase();
              const image =
                r.testType === "ENNEAGRAM"
                  ? "enneagram.webp"
                  : mbti
                    ? `${mbti}.${mbti === "esfp" ? "webp" : "png"}`
                    : null;
              const consent =
                r.statisticsConsent && !r.statisticsConsentRevokedAt;
              return (
                <article
                  key={r.id}
                  className="rounded-2xl border border-[#DCC89E] bg-[#F8F5EE]/90 p-4"
                >
                  <div className="flex gap-4">
                    {image && (
                      <img
                        src={
                          image === "enneagram.webp" ||
                          image === "enfp.png" ||
                          image === "infj.png"
                            ? `/profile-results/${image}`
                            : `/home/mbti/${image === "infp.png" ? "infp-female.png" : image}`
                        }
                        alt={r.resultName}
                        className="h-24 w-24 shrink-0 object-contain"
                        loading="lazy"
                      />
                    )}
                    <div>
                      <p className="text-xs uppercase">
                        {r.testType === "MBTI"
                          ? "Cognitive Functions / MBTI"
                          : "Enneagram"}{" "}
                        · Lần {numbers[r.id]}
                      </p>
                      <h4 className="font-serif text-2xl">{r.resultName}</h4>
                      <p className="text-xs">
                        {new Date(r.createdAt).toLocaleString("vi-VN")}
                      </p>
                      <p className="mt-1 text-xs">
                        {r.testVariant === "AI_ADAPTIVE"
                          ? "AI Adaptive"
                          : r.testVariant === "TRADITIONAL_72"
                            ? "72 câu hỏi"
                            : "Truyền thống"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    <p className="text-xs">
                      {consent
                        ? "Đang chia sẻ lần test này lên thống kê."
                        : "Lần test này không được chia sẻ lên thống kê."}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        disabled={Boolean(busy)}
                        className="rounded-lg border border-[#8B6B4A] px-3 py-2 text-sm"
                        onClick={() =>
                          void act(r.id, () =>
                            setTestStatisticsConsent(r.id, !consent),
                          )
                        }
                      >
                        {busy === r.id
                          ? "Đang cập nhật…"
                          : consent
                            ? "Thu hồi consent lần test"
                            : "Đồng ý chia sẻ lần test"}
                      </button>
                      <button
                        disabled={Boolean(busy)}
                        className="mosaic-button text-sm"
                        onClick={() =>
                          void act(r.id, () =>
                            confirmTestPersonalityType({
                              kind: r.testType as PersonalityKind,
                              testResultId: r.id,
                            }),
                          )
                        }
                      >
                        Xác nhận dùng kết quả này
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ))}
      {remote && next && <button type="button" className="mosaic-button" disabled={loading} onClick={() => void load(next)}>{loading ? 'Đang tải…' : 'Xem kết quả trước đó'}</button>}
      {remote && error && <button type="button" className="underline" onClick={() => void load()}>Thử tải lại</button>}
    </section>
  );
}
