"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";

import AttachmentUploader from "@/src/components/discussion/AttachmentUploader";

import {
  submitDiscussionPost,
} from "@/app/actions/discussion-submission";

import {
  deleteDiscussionDraft,
  saveDiscussionDraft,
} from "@/app/actions/discussion-drafts";

import {
  CITATION_SOURCE_TYPES,
  getMinimumCitationCount,
  getMinimumContentLength,
  POST_KIND_DESCRIPTIONS,
  POST_KIND_LABELS,
  SOURCE_TYPE_LABELS,
  type DiscussionCitationSourceType,
  type DiscussionForumPolicy,
  type DiscussionPostKind,
} from "@/lib/discussion/post-policy";

type DiscussionGroupContext = {
  id: string;
  slug: string;
  name: string;
};

type ExistingDraftAttachment = {
  id: string;
  originalName: string;
  kind: string;
  sizeBytes: number;
};

type DiscussionComposerInitialDraft = {
  id: string;

  uploadSessionId: string;

  forumId: string | null;
  groupId: string | null;

  postKind:
    DiscussionPostKind;

  title: string;
  content: string;

  personalityTag: string;

  citations:
    CitationDraft[];

  attachments:
    ExistingDraftAttachment[];
};

type ForumOption = {
  id: string;
  name: string;
  description: string;
  moderationPolicy:
    DiscussionForumPolicy;
};

type CitationDraft = {
  id: string;

  title: string;
  authors: string;
  year: string;
  publisher: string;

  url: string;
  doi: string;

  sourceType:
    DiscussionCitationSourceType;
};

function makeCitation():
  CitationDraft {
  return {
    id:
      crypto.randomUUID(),

    title: "",
    authors: "",
    year: "",
    publisher: "",

    url: "",
    doi: "",

    sourceType:
      "PEER_REVIEWED",
  };
}

export default function DiscussionComposer({
  forums,
  uploadSessionId,
  group = null,
  initialDraft = null,
  defaultForumId,
}: {
  defaultForumId?: string;
  forums: ForumOption[];
  uploadSessionId: string;

  group?:
    DiscussionGroupContext |
    null;

  initialDraft?:
    DiscussionComposerInitialDraft |
    null;
}) {
  const [forumId, setForumId] =
    useState(
      initialDraft?.forumId &&
      forums.some(
        (forum) =>
          forum.id ===
          initialDraft.forumId,
      )
        ? initialDraft.forumId
        : forums.some(forum => forum.id === defaultForumId) ? defaultForumId! : forums[0]?.id || "",
    );

  const [
    postKind,
    setPostKind,
  ] =
    useState<DiscussionPostKind>(
      initialDraft?.postKind ??
      "INTERPRETATION",
    );

  const [title, setTitle] =
    useState(
      initialDraft?.title ??
      "",
    );

  const [content, setContent] =
    useState(
      initialDraft?.content ??
      "",
    );

  const [
    personalityTag,
    setPersonalityTag,
  ] = useState(
    initialDraft?.personalityTag ??
    "Chung",
  );

  const [
    citations,
    setCitations,
  ] = useState<
    CitationDraft[]
  >(
    initialDraft?.citations ??
    [],
  );

  const [
    restoredAttachments,
    setRestoredAttachments,
  ] = useState<
    ExistingDraftAttachment[]
  >(
    initialDraft?.attachments ??
    [],
  );

  const [
    newAttachmentIds,
    setNewAttachmentIds,
  ] = useState<string[]>([]);

  const attachmentIds =
    useMemo(
      () => [
        ...restoredAttachments.map(
          (attachment) =>
            attachment.id,
        ),

        ...newAttachmentIds,
      ],
      [
        restoredAttachments,
        newAttachmentIds,
      ],
    );

  const [
    draftId,
    setDraftId,
  ] = useState<
    string | null
  >(
    initialDraft?.id ??
    null,
  );

  const [
    draftSaveStatus,
    setDraftSaveStatus,
  ] = useState<
    "IDLE" |
    "SAVING" |
    "SAVED" |
    "ERROR"
  >(
    initialDraft
      ? "SAVED"
      : "IDLE",
  );

  const [
    lastSavedAt,
    setLastSavedAt,
  ] = useState<
    string | null
  >(
    null,
  );

  const saveSequence =
    useRef(0);

  const [
    attachmentsBusy,
    setAttachmentsBusy,
  ] = useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(
      null,
    );

  const [
    submittedPostId,
    setSubmittedPostId,
  ] = useState<
    string | null
  >(null);

  // ========================================================
  // DRAFT AUTOSAVE
  // ========================================================

  useEffect(() => {
    if (submitting) {
      return;
    }

    const meaningful =
      title.trim().length >
        0 ||
      content.trim().length >
        0 ||
      citations.length >
        0 ||
      attachmentIds.length >
        0;

    // Không tạo một DB draft chỉ vì user mở composer.
    if (
      !meaningful &&
      !draftId
    ) {
      setDraftSaveStatus(
        "IDLE",
      );

      return;
    }

    const sequence =
      saveSequence.current +
      1;

    saveSequence.current =
      sequence;

    const timer =
      window.setTimeout(
        async () => {
          setDraftSaveStatus(
            "SAVING",
          );

          const result =
            await saveDiscussionDraft({
              uploadSessionId,

              forumId:
                forumId ||
                null,

              groupId:
                group?.id ??
                initialDraft?.groupId ??
                null,

              postKind,

              title,
              content,
              personalityTag,

              citations,

              attachmentIds,
            });

          // Có save mới hơn đã bắt đầu:
          // không cho response cũ ghi đè trạng thái UI.
          if (
            saveSequence.current !==
            sequence
          ) {
            return;
          }

          if (
            !result.success
          ) {
            setDraftSaveStatus(
              "ERROR",
            );

            return;
          }

          setDraftId(
            result.draftId,
          );

          setLastSavedAt(
            result.savedAt,
          );

          setDraftSaveStatus(
            "SAVED",
          );

          // Autosave đầu tiên biến URL thành một URL có thể reload.
          // Không navigation, không reset composer state.
          const target =
            `/discussion/drafts/${result.draftId}/edit`;

          if (
            window.location.pathname !==
            target
          ) {
            window.history.replaceState(
              null,
              "",
              target,
            );
          }
        },
        1500,
      );

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, [
    forumId,
    postKind,
    title,
    content,
    personalityTag,
    citations,
    attachmentIds,
    uploadSessionId,
    group?.id,
    initialDraft?.groupId,
    draftId,
    submitting,
  ]);

  const selectedForum =
    forums.find(
      (forum) =>
        forum.id === forumId,
    ) ?? null;

  const minimumCitations =
    selectedForum
      ? getMinimumCitationCount(
          postKind,
          selectedForum.moderationPolicy,
        )
      : 0;

  const minimumContent =
    getMinimumContentLength(
      postKind,
    );

  const citationValidity =
    useMemo(() => {
      return citations.every(
        (citation) =>
          citation.title
            .trim()
            .length >= 4 &&
          Boolean(
            citation.url.trim() ||
              citation.doi.trim(),
          ),
      );
    }, [citations]);

  const canSubmit =
    Boolean(forumId) &&
    title.trim().length >= 12 &&
    content.trim().length >=
      minimumContent &&
    citations.length >=
      minimumCitations &&
    citationValidity &&
    !attachmentsBusy &&
    !submitting;

  function updateCitation(
    id: string,
    patch:
      Partial<CitationDraft>,
  ) {
    setCitations(
      (current) =>
        current.map(
          (citation) =>
            citation.id === id
              ? {
                  ...citation,
                  ...patch,
                }
              : citation,
        ),
    );
  }

  function removeCitation(
    id: string,
  ) {
    setCitations(
      (current) =>
        current.filter(
          (citation) =>
            citation.id !== id,
        ),
    );
  }

  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !canSubmit ||
      !selectedForum
    ) {
      return;
    }

    setSubmitting(true);
    setError(null);

    const result =
      await submitDiscussionPost({
        forumId,

        groupId:
          group?.id,

        postKind,
        title,
        content,
        personalityTag,

        uploadSessionId,
        attachmentIds,

        citations:
          citations.map(
            ({
              id: _id,
              ...citation
            }) => citation,
          ),
      });

    if (!result.success) {
      setError(
        result.error,
      );

      setSubmitting(false);
      return;
    }

    setSubmittedPostId(
      result.postId,
    );

    // Post transaction đã claim các attachment IDs.
    // deleteDiscussionDraft chỉ xóa attachment postId=null,
    // vì vậy cleanup ở đây an toàn.
    if (draftId) {
      await deleteDiscussionDraft(
        draftId,
      );
    }

    setSubmitting(false);

    // Full navigation có chủ ý để tránh stale client bundle.
    window.location.assign(
      `/discussion/review/${result.postId}`,
    );

    return;
  }

  if (submittedPostId) {
    return (
      <div className="rounded-xl border border-[#D8CDBB] bg-white p-8 md:p-10">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#C7B899] bg-[#F6F1E8] text-lg text-[#6A553B]">
            ✓
          </div>

          <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#987F61]">
            Submitted for review
          </p>

          <h2 className="mt-2 font-serif text-2xl font-bold text-[#493A2D]">
            Bài viết đang được kiểm duyệt
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#746757]">
            Bài chưa được xuất bản công khai.
            Hệ thống moderation sẽ kiểm tra mức độ liên quan,
            citations, evidence và cách trình bày claim trước
            khi quyết định publication status.
          </p>

          <p className="mt-4 font-mono text-[10px] text-[#A29483]">
            {submittedPostId}
          </p>

          <Link
            href="/discussion"
            className="mt-6 inline-flex rounded-lg bg-[#6F593D] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#58452F]"
          >
            Quay lại Discussion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="space-y-5"
    >
      <div className="flex min-h-5 items-center justify-end px-1">
        {draftSaveStatus ===
          "SAVING" && (
          <span className="text-[9px] font-semibold text-[#927F68]">
            Đang lưu bản nháp…
          </span>
        )}

        {draftSaveStatus ===
          "SAVED" && (
          <span className="text-[9px] font-semibold text-[#7D725F]">
            ✓ Đã lưu
            {lastSavedAt
              ? ` · ${new Date(
                  lastSavedAt,
                ).toLocaleTimeString(
                  "vi-VN",
                  {
                    hour:
                      "2-digit",

                    minute:
                      "2-digit",
                  },
                )}`
              : ""}
          </span>
        )}

        {draftSaveStatus ===
          "ERROR" && (
          <span className="text-[9px] font-bold text-rose-700">
            Không thể tự lưu · hệ thống sẽ thử lại khi bạn chỉnh sửa tiếp
          </span>
        )}
      </div>

      {group && (
        <section className="rounded-xl border border-[#CBB99F] bg-[#F3EDE3] px-5 py-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#8D7455]">
                Posting to Group
              </p>

              <h2 className="mt-1 font-serif text-lg font-bold text-[#4D3B2B]">
                {group.name}
              </h2>

              <p className="mt-1 max-w-2xl text-[10px] leading-5 text-[#786854]">
                Group là community context. Bài viết vẫn phải được
                phân loại bằng một System Forum để MOSAIC áp dụng
                taxonomy, citation requirements và moderation policy
                chính thức.
              </p>
            </div>

            <Link
              href={`/discussion/groups/${group.slug}`}
              className="shrink-0 text-[9px] font-bold text-[#785C3B] hover:underline"
            >
              ← Quay lại Group
            </Link>
          </div>
        </section>
      )}

      {/* ====================================================
          CLASSIFICATION
      ==================================================== */}
      <section className="rounded-xl border border-[#DED5C7] bg-white">
        <header className="border-b border-[#E8E1D6] bg-[#FAF8F4] px-5 py-4">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.17em] text-[#917C61]">
            01 · Classification
          </p>

          <h2 className="mt-1 font-serif text-lg font-bold text-[#493A2D]">
            Bài viết này thuộc loại nào?
          </h2>
        </header>

        <div className="space-y-5 p-5">
          <div>
            <label className="mb-2 block text-xs font-bold text-[#5D4C39]">
              System forum
            </label>

            <select
              value={forumId}
              onChange={(event) =>
                setForumId(
                  event.target.value,
                )
              }
              className="w-full rounded-lg border border-[#D9CDBD] bg-white px-3.5 py-3 text-sm text-[#514335] outline-none focus:border-[#8B7355]"
            >
              {forums.map(
                (forum) => (
                  <option
                    key={forum.id}
                    value={forum.id}
                  >
                    {forum.name}
                  </option>
                ),
              )}
            </select>

            {selectedForum && (
              <div className="mt-2 rounded-lg bg-[#F8F5EF] px-3.5 py-3">
                <p className="text-xs leading-5 text-[#756857]">
                  {
                    selectedForum.description
                  }
                </p>

                <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#9A856B]">
                  {
                    selectedForum.moderationPolicy
                  }
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold text-[#5D4C39]">
              Evidence category
            </label>

            <div className="grid gap-2 sm:grid-cols-2">
              {(
                Object.keys(
                  POST_KIND_LABELS,
                ) as DiscussionPostKind[]
              ).map(
                (kind) => {
                  const selected =
                    postKind ===
                    kind;

                  return (
                    <button
                      key={kind}
                      type="button"
                      onClick={() =>
                        setPostKind(
                          kind,
                        )
                      }
                      className={`rounded-lg border p-3.5 text-left transition ${
                        selected
                          ? "border-[#8B7355] bg-[#F4EEE4]"
                          : "border-[#E2D8CA] bg-white hover:bg-[#FAF8F4]"
                      }`}
                    >
                      <strong className="text-[11px] text-[#544330]">
                        {
                          POST_KIND_LABELS[
                            kind
                          ]
                        }
                      </strong>

                      <p className="mt-1.5 text-[10px] leading-4 text-[#817362]">
                        {
                          POST_KIND_DESCRIPTIONS[
                            kind
                          ]
                        }
                      </p>
                    </button>
                  );
                },
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          ARTICLE
      ==================================================== */}
      <section className="rounded-xl border border-[#DED5C7] bg-white">
        <header className="border-b border-[#E8E1D6] bg-[#FAF8F4] px-5 py-4">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.17em] text-[#917C61]">
            02 · Article
          </p>

          <h2 className="mt-1 font-serif text-lg font-bold text-[#493A2D]">
            Trình bày lập luận
          </h2>
        </header>

        <div className="space-y-4 p-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-bold text-[#5D4C39]">
                Tiêu đề
              </label>

              <span className="text-[9px] text-[#A09280]">
                {title.length}/180
              </span>
            </div>

            <input
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value,
                )
              }
              maxLength={180}
              placeholder="Một tiêu đề mô tả rõ câu hỏi hoặc luận điểm..."
              className="w-full rounded-lg border border-[#D9CDBD] px-4 py-3 text-sm font-medium text-[#493A2D] outline-none focus:border-[#8B7355]"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-bold text-[#5D4C39]">
                Nội dung
              </label>

              <span
                className={`text-[9px] ${
                  content.trim()
                    .length <
                  minimumContent
                    ? "text-[#A88662]"
                    : "text-[#7C8B6B]"
                }`}
              >
                {content.trim()
                  .length}
                /
                {minimumContent}+
              </span>
            </div>

            <textarea
              value={content}
              onChange={(event) =>
                setContent(
                  event.target
                    .value,
                )
              }
              maxLength={15000}
              rows={13}
              placeholder="Trình bày claim, lập luận, giới hạn và cơ sở của cách diễn giải. Nếu đang đưa ra empirical claim, hãy tránh trình bày association như causation..."
              className="w-full resize-y rounded-lg border border-[#D9CDBD] px-4 py-3 text-[13px] leading-6 text-[#554A3E] outline-none focus:border-[#8B7355]"
            />

            <p className="mt-2 text-[10px] leading-4 text-[#988B7A]">
              Citation ở bước dưới không thay thế cho lập luận.
              Hãy giải thích rõ nguồn hỗ trợ claim nào và phần nào
              là interpretation của chính bạn.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold text-[#5D4C39]">
              Typology tag
            </label>

            <input
              value={
                personalityTag
              }
              onChange={(event) =>
                setPersonalityTag(
                  event.target
                    .value,
                )
              }
              maxLength={40}
              placeholder="Ví dụ: Jung, MBTI, Ni, Enneagram 5..."
              className="w-full rounded-lg border border-[#D9CDBD] px-4 py-3 text-sm text-[#554A3E] outline-none focus:border-[#8B7355]"
            />
          </div>
        </div>
      </section>

      {/* ====================================================
          CITATIONS
      ==================================================== */}
      <section className="rounded-xl border border-[#DED5C7] bg-white">
        <header className="flex items-start justify-between gap-4 border-b border-[#E8E1D6] bg-[#FAF8F4] px-5 py-4">
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.17em] text-[#917C61]">
              03 · References
            </p>

            <h2 className="mt-1 font-serif text-lg font-bold text-[#493A2D]">
              Citations
            </h2>

            <p className="mt-1 text-[10px] text-[#897A68]">
              Yêu cầu tối thiểu:{" "}
              <strong>
                {minimumCitations}
              </strong>{" "}
              nguồn.
            </p>
          </div>

          <button
            type="button"
            disabled={
              citations.length >=
              12
            }
            onClick={() =>
              setCitations(
                (current) => [
                  ...current,
                  makeCitation(),
                ],
              )
            }
            className="shrink-0 rounded-lg border border-[#9B8464] px-3 py-2 text-[10px] font-bold text-[#705A3E] transition hover:bg-[#F2ECE2] disabled:opacity-40"
          >
            + Add source
          </button>
        </header>

        <div className="p-5">
          {citations.length ===
          0 ? (
            <div
              className={`rounded-lg border border-dashed p-6 text-center ${
                minimumCitations >
                0
                  ? "border-[#CFAFA1] bg-[#FCF8F5]"
                  : "border-[#DDD3C5] bg-[#FAF9F6]"
              }`}
            >
              <p className="text-xs font-semibold text-[#725F49]">
                {minimumCitations >
                0
                  ? "Bài này chưa đủ citation để gửi."
                  : "Citation không bắt buộc cho loại bài này."}
              </p>

              <p className="mt-1 text-[10px] text-[#9B8B79]">
                Thêm nguồn vẫn được khuyến khích khi bạn dẫn
                theory hoặc factual claim.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {citations.map(
                (
                  citation,
                  index,
                ) => (
                  <article
                    key={
                      citation.id
                    }
                    className="rounded-lg border border-[#DDD3C5] bg-[#FCFBF8]"
                  >
                    <header className="flex items-center justify-between border-b border-[#E8E1D6] px-4 py-3">
                      <strong className="font-serif text-sm text-[#5D4933]">
                        Source [
                        {index + 1}]
                      </strong>

                      <button
                        type="button"
                        onClick={() =>
                          removeCitation(
                            citation.id,
                          )
                        }
                        className="text-[10px] font-bold text-rose-600 hover:underline"
                      >
                        Remove
                      </button>
                    </header>

                    <div className="grid gap-3 p-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-[10px] font-bold text-[#74614C]">
                          Tên tài liệu *
                        </label>

                        <input
                          value={
                            citation.title
                          }
                          onChange={(
                            event,
                          ) =>
                            updateCitation(
                              citation.id,
                              {
                                title:
                                  event
                                    .target
                                    .value,
                              },
                            )
                          }
                          placeholder="Tên paper, sách, chapter hoặc trang tài liệu..."
                          className="w-full rounded-md border border-[#DDD3C5] bg-white px-3 py-2.5 text-xs outline-none focus:border-[#8B7355]"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-[10px] font-bold text-[#74614C]">
                          Loại nguồn *
                        </label>

                        <select
                          value={
                            citation.sourceType
                          }
                          onChange={(
                            event,
                          ) =>
                            updateCitation(
                              citation.id,
                              {
                                sourceType:
                                  event
                                    .target
                                    .value as DiscussionCitationSourceType,
                              },
                            )
                          }
                          className="w-full rounded-md border border-[#DDD3C5] bg-white px-3 py-2.5 text-xs outline-none"
                        >
                          {CITATION_SOURCE_TYPES.map(
                            (
                              type,
                            ) => (
                              <option
                                key={
                                  type
                                }
                                value={
                                  type
                                }
                              >
                                {
                                  SOURCE_TYPE_LABELS[
                                    type
                                  ]
                                }
                              </option>
                            ),
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-[10px] font-bold text-[#74614C]">
                          Năm
                        </label>

                        <input
                          inputMode="numeric"
                          value={
                            citation.year
                          }
                          onChange={(
                            event,
                          ) =>
                            updateCitation(
                              citation.id,
                              {
                                year:
                                  event
                                    .target
                                    .value,
                              },
                            )
                          }
                          placeholder="2024"
                          className="w-full rounded-md border border-[#DDD3C5] bg-white px-3 py-2.5 text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-[10px] font-bold text-[#74614C]">
                          Tác giả
                        </label>

                        <input
                          value={
                            citation.authors
                          }
                          onChange={(
                            event,
                          ) =>
                            updateCitation(
                              citation.id,
                              {
                                authors:
                                  event
                                    .target
                                    .value,
                              },
                            )
                          }
                          placeholder="C. G. Jung; ..."
                          className="w-full rounded-md border border-[#DDD3C5] bg-white px-3 py-2.5 text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-[10px] font-bold text-[#74614C]">
                          Publisher / Journal
                        </label>

                        <input
                          value={
                            citation.publisher
                          }
                          onChange={(
                            event,
                          ) =>
                            updateCitation(
                              citation.id,
                              {
                                publisher:
                                  event
                                    .target
                                    .value,
                              },
                            )
                          }
                          placeholder="Journal / Publisher"
                          className="w-full rounded-md border border-[#DDD3C5] bg-white px-3 py-2.5 text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-[10px] font-bold text-[#74614C]">
                          URL
                        </label>

                        <input
                          type="url"
                          value={
                            citation.url
                          }
                          onChange={(
                            event,
                          ) =>
                            updateCitation(
                              citation.id,
                              {
                                url:
                                  event
                                    .target
                                    .value,
                              },
                            )
                          }
                          placeholder="https://..."
                          className="w-full rounded-md border border-[#DDD3C5] bg-white px-3 py-2.5 text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-[10px] font-bold text-[#74614C]">
                          DOI
                        </label>

                        <input
                          value={
                            citation.doi
                          }
                          onChange={(
                            event,
                          ) =>
                            updateCitation(
                              citation.id,
                              {
                                doi:
                                  event
                                    .target
                                    .value,
                              },
                            )
                          }
                          placeholder="10.xxxx/..."
                          className="w-full rounded-md border border-[#DDD3C5] bg-white px-3 py-2.5 text-xs outline-none"
                        />
                      </div>

                      {!citation.url.trim() &&
                        !citation.doi.trim() && (
                          <p className="sm:col-span-2 text-[9px] font-semibold text-amber-700">
                            Cần ít nhất URL hoặc DOI.
                          </p>
                        )}
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
        </div>
      </section>

      {/* ====================================================
          SUPPORTING MATERIALS
      ==================================================== */}
      <section className="rounded-xl border border-[#DED5C7] bg-white">
        <header className="border-b border-[#E8E1D6] bg-[#FAF8F4] px-5 py-4">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.17em] text-[#917C61]">
            04 · Supporting Materials
          </p>

          <h2 className="mt-1 font-serif text-lg font-bold text-[#493A2D]">
            Attachments
          </h2>

          <p className="mt-1 text-[10px] leading-4 text-[#897A68]">
            Ảnh, tài liệu và research data có thể bổ sung cho bài viết,
            nhưng không thay thế citation.
          </p>
        </header>

        <div className="p-5">
          {restoredAttachments.length > 0 && (
          <div className="mb-4 rounded-lg border border-[#DDD3C5] bg-[#FAF8F4] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.13em] text-[#8B7358]">
                  Saved attachments
                </p>

                <p className="mt-1 text-[9px] leading-4 text-[#948574]">
                  Các file này được khôi phục từ bản nháp trước.
                </p>
              </div>

              <span className="text-[9px] font-bold text-[#8E7B65]">
                {
                  restoredAttachments.length
                }
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {restoredAttachments.map(
                (attachment) => (
                  <div
                    key={
                      attachment.id
                    }
                    className="flex items-center justify-between gap-3 rounded-md border border-[#E2D9CC] bg-white px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[10px] font-semibold text-[#594736]">
                        {
                          attachment.originalName
                        }
                      </p>

                      <p className="mt-0.5 text-[8px] uppercase tracking-[0.07em] text-[#9D8E7C]">
                        {
                          attachment.kind
                        }
                        {" · "}
                        {(
                          attachment.sizeBytes /
                          1024 /
                          1024
                        ).toFixed(
                          2,
                        )}{" "}
                        MB
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        const confirmed =
                          window.confirm(
                            "Xóa file này khỏi bản nháp?",
                          );

                        if (!confirmed) {
                          return;
                        }

                        const response =
                          await fetch(
                            `/api/discussion/attachments/${attachment.id}`,
                            {
                              method:
                                "DELETE",
                            },
                          );

                        if (
                          response.ok
                        ) {
                          setRestoredAttachments(
                            (
                              current,
                            ) =>
                              current.filter(
                                (
                                  item,
                                ) =>
                                  item.id !==
                                  attachment.id,
                              ),
                          );
                        }
                      }}
                      className="shrink-0 text-[9px] font-bold text-rose-700 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        <AttachmentUploader
            uploadSessionId={uploadSessionId}
            onReadyAttachmentIdsChange={setNewAttachmentIds}
            onBusyChange={setAttachmentsBusy}
          />
        </div>
      </section>

      {/* ====================================================
          PRE-SUBMISSION CHECK
      ==================================================== */}
      <section className="rounded-xl border border-[#D6CAB7] bg-[#F3EEE5] p-5">
        <p className="text-[9px] font-extrabold uppercase tracking-[0.17em] text-[#8B7355]">
          Pre-publication check
        </p>

        <div className="mt-3 grid gap-2 text-[10px] text-[#6F604D] sm:grid-cols-2">
          <p>
            {title.trim().length >=
            12
              ? "✓"
              : "○"}{" "}
            Tiêu đề đủ rõ
          </p>

          <p>
            {content.trim()
              .length >=
            minimumContent
              ? "✓"
              : "○"}{" "}
            Nội dung đủ chiều sâu
          </p>

          <p>
            {citations.length >=
            minimumCitations
              ? "✓"
              : "○"}{" "}
            Đủ số citation bắt buộc
          </p>

          <p>
            {citationValidity
              ? "✓"
              : "○"}{" "}
            Citation có title + URL/DOI
          </p>

          <p>
            {!attachmentsBusy
              ? "✓"
              : "○"}{" "}
            Attachment upload đã hoàn tất
          </p>

          <p>
            {attachmentIds.length > 0
              ? `✓ ${attachmentIds.length} attachment sẵn sàng`
              : "✓ Không có attachment bắt buộc"}
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-rose-200 bg-white px-4 py-3 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        <div className="mt-5 flex flex-col-reverse justify-between gap-3 sm:flex-row sm:items-center">
          <p className="max-w-xl text-[10px] leading-5 text-[#84745F]">
            Submit không đồng nghĩa publish. Bài sẽ được lưu
            ở trạng thái REVIEWING cho tới khi moderation engine
            đưa ra quyết định.
          </p>

          <button
            type="submit"
            disabled={
              !canSubmit
            }
            className="shrink-0 rounded-lg bg-[#665038] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#513E2B] disabled:cursor-not-allowed disabled:opacity-35"
          >
            {submitting
              ? "Đang gửi..."
              : "Submit for review"}
          </button>
        </div>
      </section>
    </form>
  );
}
