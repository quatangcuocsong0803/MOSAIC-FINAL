"use client";

import {
  useMemo,
  useState,
} from "react";

type Snapshot = {
  moderationVersion:
    number | null;

  title:
    string | null;

  content:
    string | null;

  postKind:
    string | null;

  personalityTag:
    string | null;

  forumName:
    string | null;

  citations:
    Array<{
      title: string;

      sourceType:
        string | null;

      verificationStatus:
        string | null;

      doi:
        string | null;

      url:
        string | null;
    }>;

  attachments:
    Array<{
      id: string;

      originalName:
        string;

      kind:
        string | null;
    }>;
};

type Review = {
  id: string;

  moderationVersion:
    number;

  decision:
    string;

  relevanceScore:
    number | null;

  evidenceScore:
    number | null;

  citationScore:
    number | null;

  civilityScore:
    number | null;

  createdAt:
    string;

  snapshot:
    Snapshot | null;
};

function percent(
  value:
    number | null,
) {
  if (
    value === null
  ) {
    return "—";
  }

  return `${Math.round(
    value * 100,
  )}%`;
}

function delta(
  from:
    number | null,
  to:
    number | null,
) {
  if (
    from === null ||
    to === null
  ) {
    return "—";
  }

  const difference =
    Math.round(
      (to - from) *
        100,
    );

  if (
    difference === 0
  ) {
    return "±0";
  }

  return difference >
    0
    ? `+${difference}`
    : String(
        difference,
      );
}

function sourceKey(
  source:
    Snapshot["citations"][number],
) {
  return (
    source.doi ||
    source.url ||
    source.title
      .trim()
      .toLowerCase()
  );
}

export default function RevisionComparison({
  history,
}: {
  history:
    Review[];
}) {
  const versions =
    useMemo(
      () =>
        [...history].sort(
          (
            a,
            b,
          ) =>
            a.moderationVersion -
              b.moderationVersion ||
            new Date(
              a.createdAt,
            ).getTime() -
              new Date(
                b.createdAt,
              ).getTime(),
        ),
      [history],
    );

  const defaultFrom =
    versions[
      Math.max(
        0,
        versions.length -
          2,
      )
    ];

  const defaultTo =
    versions[
      versions.length -
        1
    ];

  const [
    fromId,
    setFromId,
  ] = useState(
    defaultFrom?.id ??
      "",
  );

  const [
    toId,
    setToId,
  ] = useState(
    defaultTo?.id ??
      "",
  );

  const from =
    versions.find(
      (review) =>
        review.id ===
        fromId,
    ) ??
    defaultFrom;

  const to =
    versions.find(
      (review) =>
        review.id ===
        toId,
    ) ??
    defaultTo;

  if (
    versions.length <
      2 ||
    !from ||
    !to
  ) {
    return null;
  }

  const fromSnapshot =
    from.snapshot;

  const toSnapshot =
    to.snapshot;

  const previousSources =
    new Map(
      (
        fromSnapshot
          ?.citations ??
        []
      ).map(
        (source) => [
          sourceKey(
            source,
          ),
          source,
        ],
      ),
    );

  const currentSources =
    new Map(
      (
        toSnapshot
          ?.citations ??
        []
      ).map(
        (source) => [
          sourceKey(
            source,
          ),
          source,
        ],
      ),
    );

  const addedSources = [
    ...currentSources,
  ]
    .filter(
      ([key]) =>
        !previousSources.has(
          key,
        ),
    )
    .map(
      ([, value]) =>
        value,
    );

  const removedSources = [
    ...previousSources,
  ]
    .filter(
      ([key]) =>
        !currentSources.has(
          key,
        ),
    )
    .map(
      ([, value]) =>
        value,
    );

  const metadataRows = [
    {
      label:
        "Forum",

      before:
        fromSnapshot
          ?.forumName ??
        "—",

      after:
        toSnapshot
          ?.forumName ??
        "—",
    },

    {
      label:
        "Evidence category",

      before:
        fromSnapshot
          ?.postKind ??
        "—",

      after:
        toSnapshot
          ?.postKind ??
        "—",
    },

    {
      label:
        "Typology tag",

      before:
        fromSnapshot
          ?.personalityTag ??
        "—",

      after:
        toSnapshot
          ?.personalityTag ??
        "—",
    },

    {
      label:
        "Title",

      before:
        fromSnapshot
          ?.title ??
        "—",

      after:
        toSnapshot
          ?.title ??
        "—",
    },
  ];

  return (
    <div className="mt-5 rounded-lg border border-[#DED4C6] bg-[#FAF8F4] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#8A7357]">
            Version comparison
          </p>

          <h3 className="mt-1 font-serif text-lg font-bold text-[#4C3B2C]">
            Compare revisions
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={
              from.id
            }
            onChange={(
              event,
            ) =>
              setFromId(
                event
                  .target
                  .value,
              )
            }
            className="rounded-md border border-[#D3C6B6] bg-white px-2.5 py-2 text-[10px] font-bold text-[#66523C]"
          >
            {versions.map(
              (
                review,
              ) => (
                <option
                  key={
                    review.id
                  }
                  value={
                    review.id
                  }
                >
                  V
                  {
                    review.moderationVersion
                  }
                </option>
              ),
            )}
          </select>

          <span className="text-[10px] font-bold text-[#A08D76]">
            →
          </span>

          <select
            value={
              to.id
            }
            onChange={(
              event,
            ) =>
              setToId(
                event
                  .target
                  .value,
              )
            }
            className="rounded-md border border-[#D3C6B6] bg-white px-2.5 py-2 text-[10px] font-bold text-[#66523C]"
          >
            {versions.map(
              (
                review,
              ) => (
                <option
                  key={
                    review.id
                  }
                  value={
                    review.id
                  }
                >
                  V
                  {
                    review.moderationVersion
                  }
                </option>
              ),
            )}
          </select>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          {
            label:
              "Relevance",

            before:
              from.relevanceScore,

            after:
              to.relevanceScore,
          },

          {
            label:
              "Evidence",

            before:
              from.evidenceScore,

            after:
              to.evidenceScore,
          },

          {
            label:
              "Citation",

            before:
              from.citationScore,

            after:
              to.citationScore,
          },

          {
            label:
              "Civility",

            before:
              from.civilityScore,

            after:
              to.civilityScore,
          },
        ].map(
          (score) => (
            <div
              key={
                score.label
              }
              className="rounded-md border border-[#E5DED3] bg-white p-3"
            >
              <p className="text-[8px] font-bold uppercase tracking-[0.08em] text-[#9C8B77]">
                {
                  score.label
                }
              </p>

              <div className="mt-1 flex items-baseline justify-between gap-2">
                <strong className="font-serif text-sm text-[#56432F]">
                  {percent(
                    score.before,
                  )}
                  {" → "}
                  {percent(
                    score.after,
                  )}
                </strong>

                <span className="text-[9px] font-extrabold text-[#856D4E]">
                  {delta(
                    score.before,
                    score.after,
                  )}
                </span>
              </div>
            </div>
          ),
        )}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-md border border-[#E4DCD0] bg-white p-3">
          <p className="text-[8px] font-bold uppercase tracking-[0.09em] text-[#9B8973]">
            Decision · V
            {
              from.moderationVersion
            }
          </p>

          <strong className="mt-1 block text-xs text-[#5C4935]">
            {
              from.decision
            }
          </strong>
        </div>

        <div className="rounded-md border border-[#E4DCD0] bg-white p-3">
          <p className="text-[8px] font-bold uppercase tracking-[0.09em] text-[#9B8973]">
            Decision · V
            {
              to.moderationVersion
            }
          </p>

          <strong className="mt-1 block text-xs text-[#5C4935]">
            {
              to.decision
            }
          </strong>
        </div>
      </div>

      {!fromSnapshot ||
      !toSnapshot ? (
        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-3 text-[10px] leading-5 text-amber-900">
          Một trong hai review được tạo trước khi MOSAIC bắt đầu lưu
          immutable submission snapshot. Vì vậy lần compare này vẫn
          so được moderation scores và decision, nhưng chưa thể phục
          hồi toàn bộ nội dung cũ.
        </div>
      ) : (
        <>
          <div className="mt-4 overflow-hidden rounded-md border border-[#E0D7CA] bg-white">
            <div className="grid grid-cols-[120px_minmax(0,1fr)_minmax(0,1fr)] border-b border-[#E9E2D8] bg-[#F5F1EA] text-[8px] font-extrabold uppercase tracking-[0.09em] text-[#907A61]">
              <div className="p-2.5">
                Field
              </div>

              <div className="border-l border-[#E9E2D8] p-2.5">
                Version{" "}
                {
                  from.moderationVersion
                }
              </div>

              <div className="border-l border-[#E9E2D8] p-2.5">
                Version{" "}
                {
                  to.moderationVersion
                }
              </div>
            </div>

            {metadataRows.map(
              (row) => {
                const changed =
                  row.before !==
                  row.after;

                return (
                  <div
                    key={
                      row.label
                    }
                    className="grid grid-cols-[120px_minmax(0,1fr)_minmax(0,1fr)] border-b border-[#EEE7DD] text-[10px] last:border-b-0"
                  >
                    <div className="p-2.5 font-bold text-[#75634E]">
                      {
                        row.label
                      }
                    </div>

                    <div className="border-l border-[#EEE7DD] p-2.5 text-[#766959]">
                      {
                        row.before
                      }
                    </div>

                    <div
                      className={`border-l border-[#EEE7DD] p-2.5 ${
                        changed
                          ? "bg-amber-50/50 font-semibold text-[#654D31]"
                          : "text-[#766959]"
                      }`}
                    >
                      {
                        row.after
                      }
                    </div>
                  </div>
                );
              },
            )}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="min-w-0 rounded-md border border-[#E1D8CC] bg-white p-3">
              <p className="text-[8px] font-extrabold uppercase tracking-[0.09em] text-[#998670]">
                Content · Version{" "}
                {
                  from.moderationVersion
                }
              </p>

              <div className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap text-[10px] leading-5 text-[#756858]">
                {
                  fromSnapshot.content ||
                  "—"
                }
              </div>
            </div>

            <div className="min-w-0 rounded-md border border-[#D6C6AF] bg-[#FFFDF9] p-3">
              <p className="text-[8px] font-extrabold uppercase tracking-[0.09em] text-[#8A7357]">
                Content · Version{" "}
                {
                  to.moderationVersion
                }
              </p>

              <div className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap text-[10px] leading-5 text-[#665541]">
                {
                  toSnapshot.content ||
                  "—"
                }
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-md border border-[#E1D8CC] bg-white p-3">
              <p className="text-[8px] font-extrabold uppercase tracking-[0.09em] text-[#998670]">
                Citation changes
              </p>

              <p className="mt-2 text-[10px] text-[#786A59]">
                {
                  fromSnapshot
                    .citations
                    .length
                }{" "}
                →{" "}
                {
                  toSnapshot
                    .citations
                    .length
                }{" "}
                sources
              </p>

              {addedSources.length >
                0 && (
                <div className="mt-2">
                  <p className="text-[9px] font-bold text-emerald-700">
                    + Added
                  </p>

                  {addedSources.map(
                    (
                      source,
                      index,
                    ) => (
                      <p
                        key={`${sourceKey(
                          source,
                        )}-${index}`}
                        className="mt-1 text-[9px] leading-4 text-[#756858]"
                      >
                        {
                          source.title
                        }
                      </p>
                    ),
                  )}
                </div>
              )}

              {removedSources.length >
                0 && (
                <div className="mt-2">
                  <p className="text-[9px] font-bold text-rose-700">
                    − Removed
                  </p>

                  {removedSources.map(
                    (
                      source,
                      index,
                    ) => (
                      <p
                        key={`${sourceKey(
                          source,
                        )}-${index}`}
                        className="mt-1 text-[9px] leading-4 text-[#756858]"
                      >
                        {
                          source.title
                        }
                      </p>
                    ),
                  )}
                </div>
              )}

              {addedSources.length ===
                0 &&
                removedSources.length ===
                  0 && (
                  <p className="mt-2 text-[9px] text-[#978A79]">
                    Không có citation được thêm hoặc loại bỏ.
                  </p>
                )}
            </div>

            <div className="rounded-md border border-[#E1D8CC] bg-white p-3">
              <p className="text-[8px] font-extrabold uppercase tracking-[0.09em] text-[#998670]">
                Supporting materials
              </p>

              <p className="mt-2 text-[10px] text-[#786A59]">
                {
                  fromSnapshot
                    .attachments
                    .length
                }{" "}
                →{" "}
                {
                  toSnapshot
                    .attachments
                    .length
                }{" "}
                attachments
              </p>

              <p className="mt-2 text-[9px] leading-4 text-[#978A79]">
                Attachment count được lấy từ immutable submission
                snapshot của từng moderation version.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
