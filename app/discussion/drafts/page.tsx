import {
  auth,
} from "@clerk/nextjs/server";

import Link from "next/link";

import {
  redirect,
} from "next/navigation";

import {
  prisma,
} from "@/lib/prisma";

import {
  POST_KIND_LABELS,
  type DiscussionPostKind,
} from "@/lib/discussion/post-policy";

import DeleteDraftButton from "@/src/components/discussion/drafts/DeleteDraftButton";

function jsonArrayCount(
  value: unknown,
) {
  return Array.isArray(
    value,
  )
    ? value.length
    : 0;
}

function excerpt(
  value: string,
) {
  const clean =
    value
      .replace(
        /\s+/g,
        " ",
      )
      .trim();

  if (!clean) {
    return "Bản nháp chưa có nội dung.";
  }

  if (
    clean.length <=
    180
  ) {
    return clean;
  }

  return `${clean.slice(
    0,
    180,
  )}…`;
}

export default async function DiscussionDraftsPage() {
  const {
    userId,
  } =
    await auth();

  if (!userId) {
    redirect(
      "/sign-in",
    );
  }

  const drafts =
    await prisma.discussionDraft.findMany({
      where: {
        ownerClerkId:
          userId,
      },

      orderBy: {
        updatedAt:
          "desc",
      },

      select: {
        id: true,

        forumId:
          true,

        groupId:
          true,

        postKind:
          true,

        title:
          true,

        content:
          true,

        personalityTag:
          true,

        citationDrafts:
          true,

        attachmentIds:
          true,

        createdAt:
          true,

        updatedAt:
          true,
      },
    });

  const forumIds = [
    ...new Set(
      drafts.flatMap(
        (draft) =>
          draft.forumId
            ? [
                draft.forumId,
              ]
            : [],
      ),
    ),
  ];

  const groupIds = [
    ...new Set(
      drafts.flatMap(
        (draft) =>
          draft.groupId
            ? [
                draft.groupId,
              ]
            : [],
      ),
    ),
  ];

  const [
    forums,
    groups,
  ] =
    await Promise.all([
      forumIds.length >
      0
        ? prisma.forum.findMany({
            where: {
              id: {
                in:
                  forumIds,
              },
            },

            select: {
              id: true,
              name: true,
            },
          })
        : Promise.resolve(
            [],
          ),

      groupIds.length >
      0
        ? prisma.discussionGroup.findMany({
            where: {
              id: {
                in:
                  groupIds,
              },
            },

            select: {
              id: true,
              name: true,
              slug: true,
            },
          })
        : Promise.resolve(
            [],
          ),
    ]);

  const forumMap =
    new Map(
      forums.map(
        (forum) => [
          forum.id,
          forum,
        ],
      ),
    );

  const groupMap =
    new Map(
      groups.map(
        (group) => [
          group.id,
          group,
        ],
      ),
    );

  return (
    <main className="min-h-screen bg-[#F7F5F1]">
      <header className="border-b border-[#DDD5C8] bg-[#FBFAF7]">
        <div className="mx-auto max-w-5xl px-4 py-7 md:px-6">
          <Link
            href="/discussion"
            className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#8B7355] hover:underline"
          >
            ← Discussion
          </Link>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#987F62]">
                Writing workspace
              </p>

              <h1 className="mt-1 font-serif text-3xl font-bold text-[#493A2D]">
                Bản nháp
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#766958]">
                Những bài đang viết được tự động lưu ở đây.
                Bản nháp chưa được đưa vào Publication Review và
                không hiển thị công khai.
              </p>
            </div>

            <Link
              href="/discussion/new"
              className="rounded-lg bg-[#705438] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#563F2A]"
            >
              + Bài viết mới
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 md:px-6">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#927B60]">
              Saved drafts
            </p>

            <h2 className="mt-1 font-serif text-xl font-bold text-[#4D3D2E]">
              Tiếp tục nơi bạn dừng lại
            </h2>
          </div>

          <span className="rounded-md bg-[#F0EAE1] px-2.5 py-1 text-[9px] font-bold text-[#7A674F]">
            {
              drafts.length
            }{" "}
            drafts
          </span>
        </div>

        {drafts.length ===
        0 ? (
          <section className="rounded-xl border border-dashed border-[#D7CCBC] bg-white/70 p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#D7C9B6] bg-[#F5F0E8] text-lg text-[#7E684D]">
              ✎
            </div>

            <h2 className="mt-4 font-serif text-xl font-bold text-[#4E3D2D]">
              Chưa có bản nháp
            </h2>

            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#887A69]">
              Khi bạn bắt đầu viết một bài Discussion,
              MOSAIC sẽ tự lưu sau một khoảng ngắn.
            </p>

            <Link
              href="/discussion/new"
              className="mt-5 inline-flex rounded-lg bg-[#705438] px-5 py-2.5 text-xs font-bold text-white"
            >
              Bắt đầu viết
            </Link>
          </section>
        ) : (
          <section className="space-y-3">
            {drafts.map(
              (draft) => {
                const forum =
                  draft.forumId
                    ? forumMap.get(
                        draft.forumId,
                      )
                    : null;

                const group =
                  draft.groupId
                    ? groupMap.get(
                        draft.groupId,
                      )
                    : null;

                const title =
                  draft.title
                    .trim() ||
                  "Bản nháp chưa có tiêu đề";

                const citationCount =
                  jsonArrayCount(
                    draft.citationDrafts,
                  );

                const attachmentCount =
                  jsonArrayCount(
                    draft.attachmentIds,
                  );

                const kind =
                  draft.postKind as DiscussionPostKind;

                return (
                  <article
                    key={
                      draft.id
                    }
                    className="rounded-xl border border-[#DDD3C6] bg-white p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-5">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-md bg-[#F3EEE7] px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#806A50]">
                            Draft
                          </span>

                          <span className="rounded-md bg-[#F5F2ED] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.07em] text-[#827362]">
                            {
                              POST_KIND_LABELS[
                                kind
                              ] ??
                              draft.postKind
                            }
                          </span>

                          {forum && (
                            <span className="rounded-md bg-[#F5F2ED] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.07em] text-[#827362]">
                              {
                                forum.name
                              }
                            </span>
                          )}

                          {group && (
                            <span className="rounded-md border border-[#D8C6AE] bg-[#F4ECE2] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.07em] text-[#765B3E]">
                              Group ·{" "}
                              {
                                group.name
                              }
                            </span>
                          )}
                        </div>

                        <h3 className="mt-3 font-serif text-xl font-bold text-[#493A2D]">
                          {title}
                        </h3>

                        <p className="mt-2 max-w-3xl text-[10px] leading-5 text-[#7C6D5C]">
                          {excerpt(
                            draft.content,
                          )}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-[#EEE7DD] pt-3 text-[9px] text-[#998A77]">
                          <span>
                            {
                              citationCount
                            }{" "}
                            citations
                          </span>

                          <span>
                            {
                              attachmentCount
                            }{" "}
                            attachments
                          </span>

                          {draft.personalityTag &&
                            draft.personalityTag !==
                              "Chung" && (
                              <span>
                                #
                                {
                                  draft.personalityTag
                                }
                              </span>
                            )}

                          <span>
                            Đã lưu{" "}
                            {draft.updatedAt.toLocaleString(
                              "vi-VN",
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2">
                        <Link
                          href={`/discussion/drafts/${draft.id}/edit`}
                          className="rounded-lg bg-[#705438] px-4 py-2 text-[10px] font-bold text-white transition hover:bg-[#563F2A]"
                        >
                          Tiếp tục viết
                        </Link>

                        <DeleteDraftButton
                          draftId={
                            draft.id
                          }
                        />
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </section>
        )}
      </div>
    </main>
  );
}
