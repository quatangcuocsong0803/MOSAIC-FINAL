"use client";
import { useEffect, useState } from "react";
import {
  createMoment,
  deleteMoment,
  updateMomentVisibility,
} from "@/app/actions/moments";
import type { ProfileVisibility } from "@prisma/client";
type Page = Awaited<ReturnType<typeof import('@/app/actions/moments').listMoments>>;
async function listMoments(ownerId: string, cursor?: string): Promise<Page> {
  const query = new URLSearchParams({ ownerId, ...(cursor ? { cursor } : {}) });
  const response = await fetch(`/api/profile/moments?${query}`, { cache: 'no-store' });
  if (!response.ok) throw Error('Chưa tải được Khoảnh khắc.');
  return response.json();
}
const labels = { PUBLIC: "Công khai", FRIENDS: "Bạn bè", PRIVATE: "Riêng tư" };
export default function MomentsFeed({
  ownerId,
  owner = false,
}: {
  ownerId: string;
  owner?: boolean;
}) {
  const [items, setItems] = useState<Page["items"]>([]),
    [next, setNext] = useState<string>(),
    [content, setContent] = useState(""),
    [visibility, setVisibility] = useState<ProfileVisibility>("PRIVATE"),
    [files, setFiles] = useState<File[]>([]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [fileKey, setFileKey] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    listMoments(ownerId)
      .then((r) => {
        if (active) {
          setItems(r.items);
          setNext(r.next);
        }
      })
      .catch(() => {
        if (active) setError("Chưa tải được Khoảnh khắc.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [ownerId]);
  async function refresh() {
    const r = await listMoments(ownerId);
    setItems(r.items);
    setNext(r.next);
  }
  async function post() {
    setBusy(true);
    setError("");
    try {
      const mediaIds: string[] = [];
      for (const file of files) {
        const prepared = await fetch("/api/profile/moments/uploads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mimeType: file.type, bytes: file.size }),
        });
        const data = await prepared.json();
        if (!prepared.ok) throw Error(data.error);
        const uploaded = await fetch(data.url, {
          method: "PUT",
          headers: { "Content-Type": file.type, "x-upsert": "false" },
          body: file,
        });
        if (!uploaded.ok)
          throw Error("Tải tệp chưa hoàn tất. Vui lòng thử lại.");
        const finalized = await fetch("/api/profile/moments/uploads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uploadId: data.id }),
        });
        const confirmed = await finalized.json();
        if (!finalized.ok) throw Error(confirmed.error);
        mediaIds.push(confirmed.id);
      }
      const r = await createMoment({ content, visibility, mediaIds });
      if (!r.success) throw Error(r.error);
      setContent("");
      setFiles([]);
      setFileKey((k) => k + 1);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chưa đăng được Khoảnh khắc.");
    } finally {
      setBusy(false);
    }
  }
  async function act(fn: () => Promise<{ success: boolean }>) {
    setBusy(true);
    setError("");
    try {
      const r = await fn();
      if (!r.success) throw Error();
      await refresh();
    } catch {
      setError("Chưa cập nhật được Khoảnh khắc.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section id="moments"
      className="mosaic-profile-card space-y-5"
      aria-labelledby="moments-title"
    >
      <h2 id="moments-title" className="font-serif text-3xl">
        Khoảnh khắc
      </h2>
      {owner && (
        <form
          className="space-y-4 rounded-2xl border border-[#C9AE77] bg-[#F8F5EE]/80 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            void post();
          }}
        >
          <label className="block font-semibold">
            Chia sẻ một khoảnh khắc
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={5000}
              rows={3}
              placeholder="Hôm nay bạn muốn lưu lại điều gì?"
              className="mt-2 w-full rounded-xl border bg-white/80 p-3"
            />
          </label>
          <label className="block">
            Ảnh / video (tối đa 4 tệp)
            <input
              key={fileKey}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
              disabled={busy}
              onChange={(e) => {
                const selected = Array.from(e.target.files || []);
                if (selected.length > 4) {
                  setError("Chọn tối đa 4 tệp.");
                  e.target.value = "";
                  return;
                }
                setFiles(selected);
              }}
              className="mt-2 block w-full text-sm"
            />
          </label>
          <p className="text-xs">
            Ảnh tối đa 10 MB, video tối đa 50 MB mỗi tệp.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <label>
              Người xem{" "}
              <select
                value={visibility}
                onChange={(e) =>
                  setVisibility(e.target.value as ProfileVisibility)
                }
                disabled={busy}
                className="rounded-lg border bg-white p-2"
              >
                {Object.entries(labels).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
            <button
              disabled={busy || (!content.trim() && !files.length)}
              className="mosaic-button"
            >
              {busy ? "Đang đăng…" : "Đăng Khoảnh khắc"}
            </button>
          </div>
        </form>
      )}
      {error && (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      )}
      {loading ? (
        <p>Đang tải Khoảnh khắc…</p>
      ) : (
        !items.length && (
          <p className="text-sm opacity-70">Chưa có Khoảnh khắc để hiển thị.</p>
        )
      )}
      {items.map((item) => (
        <article
          key={item.id}
          className="space-y-4 rounded-2xl border border-[#DCC89E] bg-[#F8F5EE]/85 p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <time dateTime={new Date(item.createdAt).toISOString()}>
              {new Date(item.createdAt).toLocaleString("vi-VN")}
            </time>
            {owner ? (
              <div className="flex gap-3">
                <select
                  aria-label="Quyền xem Khoảnh khắc"
                  disabled={busy}
                  value={item.visibility}
                  onChange={(e) =>
                    void act(() =>
                      updateMomentVisibility(
                        item.id,
                        e.target.value as ProfileVisibility,
                      ),
                    )
                  }
                  className="rounded-lg border bg-white p-2"
                >
                  {Object.entries(labels).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
                <button
                  disabled={busy}
                  onClick={() => {
                    if (window.confirm("Xóa Khoảnh khắc này?"))
                      void act(() => deleteMoment(item.id));
                  }}
                  className="text-red-700"
                >
                  Xóa
                </button>
              </div>
            ) : (
              <span>{labels[item.visibility]}</span>
            )}
          </div>
          <p className="whitespace-pre-wrap break-words">{item.content}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {item.media.map((media) =>
              media.mimeType.startsWith("video/") ? (
                <video
                  key={media.id}
                  controls
                  playsInline
                  preload="metadata"
                  className="max-h-[480px] w-full rounded-xl bg-black"
                  src={`/api/profile/moments/media/${media.id}`}
                />
              ) : (
                <img
                  key={media.id}
                  src={`/api/profile/moments/media/${media.id}`}
                  alt="Ảnh Khoảnh khắc"
                  loading="lazy"
                  className="max-h-[480px] w-full rounded-xl object-contain"
                />
              ),
            )}
          </div>
        </article>
      ))}
      {next && (
        <button
          disabled={busy}
          className="mosaic-button"
          onClick={async () => {
            setBusy(true);
            try {
              const r = await listMoments(ownerId, next);
              setItems((old) => [...old, ...r.items]);
              setNext(r.next);
            } catch {
              setError("Chưa tải được Khoảnh khắc tiếp theo.");
            } finally {
              setBusy(false);
            }
          }}
        >
          Xem thêm Khoảnh khắc
        </button>
      )}
    </section>
  );
}
