import Link from "next/link";

import LikeButton from "@/src/components/discussion/LikeButton";

type DiscussionPost = {
  id: string;
  title: string;
  content: string;

  authorName: string;
  authorImage: string | null;

  personalityTag: string;
  likesCount: number;

  postKind: string;
  moderationVersion: number;

  createdAt: Date;
  publishedAt: Date | null;

  forum: {
    slug: string;
    name: string;
    shortLabel: string | null;
    moderationPolicy: string;
  } | null;

  citations: Array<{
    id: string;
    title: string;
    authors: string | null;
    year: number | null;
    publisher: string | null;
    url: string | null;
    doi: string | null;
    sourceType: string;
    verificationStatus: string;
    sortOrder: number;
  }>;

  _count: {
    comments: number;
    likes: number;
  };
};

const KIND_META: Record<
  string,
  {
    label: string;
    description: string;
  }
> = {
  EMPIRICAL_EVIDENCE: {
    label: "EMPIRICAL",
    description: "Bằng chứng thực nghiệm",
  },

  ESTABLISHED_THEORY: {
    label: "THEORY",
    description: "Nguồn lý thuyết",
  },

  INTERPRETATION: {
    label: "ANALYSIS",
    description: "Phân tích / diễn giải",
  },

  QUESTION: {
    label: "QUESTION",
    description: "Câu hỏi thảo luận",
  },
};

const SOURCE_LABELS: Record<
  string,
  string
> = {
  PEER_REVIEWED: "Peer-reviewed",
  ACADEMIC_BOOK: "Academic book",
  PRIMARY_THEORY: "Primary theory",
  PROFESSIONAL_ORGANIZATION:
    "Professional organization",
  SECONDARY_REFERENCE:
    "Secondary reference",
  COMMUNITY_SOURCE:
    "Community source",
  UNKNOWN: "Unclassified",
};

function formatDate(
  value: Date | string,
) {
  return new Date(
    value,
  ).toLocaleDateString(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );
}

export default function DiscussionPostCard({
  post,
}: {
  post: DiscussionPost;
}) {
  const kind =
    KIND_META[post.postKind] ??
    KIND_META.INTERPRETATION;

  const verifiedCount =
    post.citations.filter(
      (citation) =>
        citation.verificationStatus ===
        "VERIFIED",
    ).length;

  const preview =
    post.content.length > 420
      ? `${post.content.slice(0, 420).trim()}…`
      : post.content;

  return (
    <article id={`post-${post.id}`} style={{ scrollMarginTop: 110 }} className="overflow-hidden rounded-xl border border-[#DED5C7] bg-white shadow-[0_2px_10px_rgba(74,63,53,0.035)] transition hover:border-[#CDBD9F] hover:shadow-[0_5px_18px_rgba(74,63,53,0.065)]">
      <div className="flex">
        {/* Reddit-like left rail */}
        <aside className="hidden w-[52px] shrink-0 flex-col items-center border-r border-[#EEE7DB] bg-[#FAF8F4] py-4 sm:flex">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#B09B7E]">
            score
          </span>

          <strong className="mt-1 font-serif text-lg text-[#6B563D]">
            {post.likesCount}
          </strong>
        </aside>

        <div className="min-w-0 flex-1">
          {/* Meta header */}
          <div className="border-b border-[#EEE7DB] px-5 py-3">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[10px] font-medium text-[#8F8170]">
              {post.forum ? (
                <Link
                  href={`/discussion?forum=${post.forum.slug}`}
                  className="font-bold text-[#71593D] hover:underline"
                >
                  f/{post.forum.shortLabel ||
                    post.forum.name}
                </Link>
              ) : (
                <span className="font-bold text-[#9A8A78]">
                  legacy
                </span>
              )}

              <span>•</span>

              <span>
                {post.authorName}
              </span>

              <span>•</span>

              <time>
                {formatDate(
                  post.publishedAt ||
                    post.createdAt,
                )}
              </time>

              {post.moderationVersion ===
                0 && (
                <>
                  <span>•</span>

                  <span className="rounded-full bg-[#F3EFE8] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#94826C]">
                    Legacy
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="px-5 py-4">
            {/* Evidence labels */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-[#CBB994] bg-[#F8F3E8] px-2 py-1 text-[9px] font-extrabold tracking-[0.11em] text-[#725C3D]">
                {kind.label}
              </span>

              {post.citations.length >
                0 && (
                <span className="rounded-md border border-[#D8D1C5] bg-[#FAF9F6] px-2 py-1 text-[9px] font-bold tracking-[0.06em] text-[#776B5D]">
                  {post.citations.length}{" "}
                  {post.citations.length ===
                  1
                    ? "SOURCE"
                    : "SOURCES"}
                </span>
              )}

              {verifiedCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50/60 px-2 py-1 text-[9px] font-bold tracking-[0.05em] text-emerald-800">
                  <span>✓</span>
                  {verifiedCount} VERIFIED
                </span>
              )}

              {post.personalityTag &&
                post.personalityTag !==
                  "Chung" && (
                  <span className="rounded-md bg-[#F2EEF4] px-2 py-1 text-[9px] font-bold text-[#76627E]">
                    #{post.personalityTag}
                  </span>
                )}
            </div>

            <h2 className="font-serif text-[21px] font-bold leading-snug text-[#45382B]">
              {post.title}
            </h2>

            <p className="mt-3 whitespace-pre-wrap text-[13px] leading-6 text-[#65594D]">
              {preview}
            </p>

            {/* Sources */}
            {post.citations.length >
              0 && (
              <section className="mt-5 rounded-lg border border-[#E6DED1] bg-[#FBFAF7]">
                <header className="flex items-center justify-between border-b border-[#E9E2D7] px-3.5 py-2.5">
                  <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#8D7B64]">
                    Sources
                  </span>

                  <span className="text-[9px] text-[#A69785]">
                    Citation record
                  </span>
                </header>

                <div className="divide-y divide-[#ECE5DB]">
                  {post.citations
                    .slice(0, 3)
                    .map(
                      (
                        citation,
                        index,
                      ) => (
                        <div
                          key={
                            citation.id
                          }
                          className="flex gap-3 px-3.5 py-2.5"
                        >
                          <span className="font-serif text-xs font-bold text-[#927A58]">
                            [
                            {index +
                              1}
                            ]
                          </span>

                          <div className="min-w-0">
                            <p className="line-clamp-1 text-[11px] font-semibold text-[#55483A]">
                              {
                                citation.title
                              }
                            </p>

                            <p className="mt-0.5 text-[9px] text-[#998B7C]">
                              {SOURCE_LABELS[
                                citation
                                  .sourceType
                              ] ||
                                citation.sourceType}

                              {citation.year
                                ? ` · ${citation.year}`
                                : ""}

                              {citation.verificationStatus ===
                              "VERIFIED"
                                ? " · Verified"
                                : ""}
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                </div>
              </section>
            )}

            {/* Footer */}
            <footer className="mt-4 flex flex-wrap items-center gap-4 border-t border-[#EEE7DB] pt-3">
              <LikeButton
                postId={post.id}
                initialLikes={
                  post.likesCount
                }
              />

              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#817464]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.625 12h.008m3.742 0h.008m3.742 0h.008M21 12c0 4.142-4.03 7.5-9 7.5a10.4 10.4 0 0 1-3.172-.487L3 21l1.987-4.139A6.89 6.89 0 0 1 3 12c0-4.142 4.03-7.5 9-7.5s9 3.358 9 7.5Z"
                  />
                </svg>

                {post._count.comments} bình luận
              </span>

              <span className="ml-auto hidden text-[9px] font-medium uppercase tracking-[0.08em] text-[#B1A493] sm:inline">
                {kind.description}
              </span>
            </footer>
          </div>
        </div>
      </div>
    </article>
  );
}
