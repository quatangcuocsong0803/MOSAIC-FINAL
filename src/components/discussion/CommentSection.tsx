"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import type { Comment } from "@prisma/client";
import { getDiscussionComments, submitDiscussionComment, retryDiscussionComment,
  reviseDiscussionComment } from "@/app/actions/discussion-comments";

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
  onCommentAdded?: (comment: Comment) => void;
}

const publicComment = (comment: Comment) => comment.moderationStatus === "APPROVED" && Boolean(comment.publishedAt);
const statusLabel: Record<string, string> = {
  REVIEWING: "Đang chờ duyệt · chỉ bạn thấy", REVISION_REQUIRED: "Cần chỉnh sửa · chỉ bạn thấy",
  REJECTED: "Chưa được chấp nhận · chỉ bạn thấy", DRAFT: "Bản nháp · chỉ bạn thấy",
};

export default function CommentSection({ postId, initialComments, onCommentAdded }: CommentSectionProps) {
  const { isSignedIn, user } = useUser();
  // Initial server props are restricted to public comments. Private states load per session.
  const [comments, setComments] = useState<Comment[]>(initialComments.filter(publicComment));
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [clock, setClock] = useState(Date.now());
  const submitted = useRef(new Set<string>());
  const request = useRef<string | null>(null);
  const callback = useRef(onCommentAdded);
  callback.current = onCommentAdded;
  const session = useRef(user?.id);
  session.current = user?.id;
  const lastGoodLoad = useRef(0);

  useEffect(() => {
    setComments(initialComments.filter(publicComment));
  }, [initialComments, postId]);

  useEffect(() => {
    let disposed = false;
    let timer: ReturnType<typeof setTimeout>;
    const expectedUser = user?.id;
    // Remove private data immediately on account changes, before the next response.
    setComments(previous => previous.filter(publicComment));
    setContent(""); setReplyTo(null); setEditing(null); setNotice(null); setError(null);
    submitted.current.clear(); request.current = null;
    async function load() {
      try {
        const result = await getDiscussionComments(postId);
        if (disposed || session.current !== expectedUser) return;
        setClock(Date.now());
        if (result.success) {
          lastGoodLoad.current = Date.now();
          setComments(result.comments);
          for (const comment of result.comments) {
            if (publicComment(comment) && submitted.current.delete(comment.id)) callback.current?.(comment);
          }
        } else {
          setError(result.error);
          // Do not keep presenting an inaccessible thread after the server rejects access.
          setComments([]);
        }
      } catch {
        if (!disposed) setError("Chưa tải được trạng thái mới. Hệ thống sẽ thử lại.");
      } finally {
        if (!disposed) timer = setTimeout(load, 5000);
      }
    }
    void load();
    return () => { disposed = true; clearTimeout(timer); };
  }, [postId, user?.id]);

  const visible = comments.filter(comment => publicComment(comment) || comment.authorId === user?.id);
  const roots = visible.filter(comment => !comment.parentId);
  const rootIds = new Set(roots.map(comment => comment.id));
  const ownOrphans = visible.filter(comment => comment.parentId && !rootIds.has(comment.parentId) && comment.authorId === user?.id);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (busy || !content.trim()) return;
    setBusy(true); setError(null); setNotice(null);
    const expectedUser = session.current;
    const startedAt = Date.now();
    request.current ||= crypto.randomUUID();
    try {
      const result = editing
        ? await reviseDiscussionComment(editing, content)
        : await submitDiscussionComment(postId, content, replyTo?.id || null, request.current);
      if (session.current !== expectedUser) return;
      if (!result.success) { setError(result.error); return; }
      if (lastGoodLoad.current <= startedAt) {
        setComments(previous => [...previous.filter(item => item.id !== result.comment.id), result.comment]);
      }
      submitted.current.add(result.comment.id);
      if (publicComment(result.comment) && submitted.current.delete(result.comment.id)) callback.current?.(result.comment);
      setContent(""); setReplyTo(null); setEditing(null); request.current = null;
      setNotice("Đã nhận nội dung. Bạn có thể rời trang; nội dung chỉ công khai sau khi được duyệt.");
    } catch {
      setError("Chưa xác nhận được lần gửi. Bấm Gửi lại sẽ dùng cùng mã để tránh tạo trùng.");
    } finally { setBusy(false); }
  }

  async function retry(id: string) {
    if (busy) return;
    setBusy(true); setError(null);
    const expectedUser = session.current;
    try {
      const result = await retryDiscussionComment(id);
      if (session.current !== expectedUser) return;
      if (!result.success) { setError(result.error); return; }
      submitted.current.add(id);
      setComments(previous => previous.map(comment => comment.id === id ? result.comment : comment));
    } catch { setError("Chưa gửi lại được. Bạn vui lòng thử lại."); }
    finally { setBusy(false); }
  }

  function edit(comment: Comment) {
    setEditing(comment.id); setContent(comment.content); setReplyTo(null);
    request.current = null; setError(null); setNotice(null);
  }

  function renderComment(comment: Comment, isReply = false) {
    const own = comment.authorId === user?.id;
    const approved = publicComment(comment);
    const leaseExpired = !comment.reviewStartedAt || clock - new Date(comment.reviewStartedAt).getTime() >= 360000;
    const cooldownOver = !comment.reviewQueuedAt || clock - new Date(comment.reviewQueuedAt).getTime() >= 60000;
    const retryable = comment.moderationStatus === "REVIEWING" && leaseExpired && cooldownOver;
    return <div key={comment.id} id={`comment-${comment.id}`} className={`${isReply ? "ml-5 md:ml-10 " : ""}rounded-md border border-[#E2D4B7] bg-[#FAF8F5] p-3`}>
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E2D4B7] bg-white text-xs font-bold text-[#8B6B4A]">
          {comment.authorImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={comment.authorImage} alt="" className="h-full w-full object-cover" />
          ) : comment.authorName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-[#5C4326]">{comment.authorName}</span>
            <span className="text-gray-400">{new Date(comment.createdAt).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</span>
          </div>
          <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-700">{comment.content}</p>
          {!approved && own && <div className="mt-2 rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
            <p className="font-semibold">{statusLabel[comment.moderationStatus] || "Chưa công khai"}</p>
            {comment.reviewError && <p className="mt-1">{comment.reviewError}</p>}
            {comment.moderationReasons.length > 0 && <ul className="mt-1 list-disc pl-4">{comment.moderationReasons.map((reason, index) => <li key={index}>{reason}</li>)}</ul>}
            {comment.moderationStatus === "REVIEWING" && !comment.reviewError && <p className="mt-1">Hệ thống đang xử lý. Nếu phiên xử lý bị gián đoạn, nút thử lại sẽ xuất hiện sau tối đa 6 phút.</p>}
            <div className="mt-2 flex gap-3">
              {retryable && <button type="button" disabled={busy} onClick={() => void retry(comment.id)} className="underline disabled:opacity-50">Thử duyệt lại</button>}
              {(comment.moderationStatus === "REVISION_REQUIRED" || comment.moderationStatus === "REJECTED" || retryable) && <button type="button" disabled={busy} onClick={() => edit(comment)} className="underline disabled:opacity-50">Sửa và gửi lại</button>}
            </div>
          </div>}
          {approved && !isReply && isSignedIn && <button type="button" disabled={busy} onClick={() => { setReplyTo(comment); setEditing(null); request.current = null; }} className="mt-2 text-xs font-semibold text-[#8B6B4A] underline">Trả lời</button>}
        </div>
      </div>
    </div>;
  }

  return <section className="mt-4 border-t border-[#E2D4B7]/60 pt-4 font-sans" aria-label="Bình luận">
    <div className="mb-4 space-y-3">
      {visible.length === 0 && <p className="text-sm italic text-gray-500">Chưa có bình luận nào.</p>}
      {roots.map(comment => <div key={comment.id} className="space-y-2">
        {renderComment(comment)}
        {visible.filter(reply => reply.parentId === comment.id).map(reply => renderComment(reply, true))}
      </div>)}
      {ownOrphans.map(comment => <div key={comment.id} className="space-y-1">
        <p className="text-xs text-gray-500">Bình luận gốc hiện không khả dụng.</p>{renderComment(comment, true)}
      </div>)}
    </div>
    {isSignedIn ? <form onSubmit={handleSubmit} className="space-y-2">
      {(replyTo || editing) && <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 rounded bg-[#FAF8F5] p-2 text-xs text-[#5C4326]">
        <span>{editing ? "Chỉnh sửa nội dung chưa công khai" : `Đang trả lời ${replyTo?.authorName}`}</span>
        <button type="button" disabled={busy} onClick={() => { setReplyTo(null); setEditing(null); setContent(""); request.current = null; }}>Hủy</button>
      </div>}
      <label htmlFor={`comment-input-${postId}`} className="sr-only">Nội dung bình luận</label>
      <textarea id={`comment-input-${postId}`} value={content} onChange={event => { setContent(event.target.value); request.current = null; }} maxLength={2000} rows={3} disabled={busy}
        placeholder={replyTo ? "Viết lời trả lời..." : "Viết lời bàn luận..."}
        className="w-full rounded-md border border-[#E2D4B7] bg-white p-3 text-sm text-gray-800 focus:border-[#8B6B4A]" />
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
        <span className="text-xs text-gray-500">{content.length}/2000 · Kiểm duyệt trước khi công khai</span>
        <button type="submit" disabled={busy || !content.trim()} className="rounded-md bg-[#8B6B4A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Đang gửi…" : editing ? "Gửi lại" : "Gửi"}</button>
      </div>
    </form> : <p className="text-center text-xs text-gray-500">Vui lòng <Link href="/sign-in" className="font-semibold text-[#8B6B4A] underline">đăng nhập</Link> để tham gia bình luận.</p>}
    {notice && <p role="status" className="mt-2 text-xs text-[#5C4326]">{notice}</p>}
    {error && <p role="alert" className="mt-2 text-xs text-rose-600">{error}</p>}
  </section>;
}
