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

function statusLabel(
  status: string,
) {
  switch (status) {
    case "APPROVED":
      return "Đã duyệt";

    case "REVISION_REQUIRED":
      return "Cần chỉnh sửa";

    case "REJECTED":
      return "Không được duyệt";

    case "REVIEWING":
      return "Đang kiểm duyệt";

    default:
      return status;
  }
}

function statusClass(
  status: string,
) {
  switch (status) {
    case "APPROVED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "REVISION_REQUIRED":
      return "border-amber-200 bg-amber-50 text-amber-800";

    case "REJECTED":
      return "border-rose-200 bg-rose-50 text-rose-700";

    default:
      return "border-[#D8CCBB] bg-[#F6F2EB] text-[#79664F]";
  }
}

export default async function DiscussionReviewsPage() {
  const {
    userId,
  } = await auth();

  if (!userId) {
    redirect(
      "/sign-in",
    );
  }

  const posts =
    await prisma.post.findMany({
      where: {
        authorId:
          userId,

        moderationVersion: {
          gte: 1,
        },
      },

      orderBy: {
        updatedAt:
          "desc",
      },

      select: {
        id: true,

        title: true,

        postKind:
          true,

        moderationStatus:
          true,

        moderationScore:
          true,

        moderationVersion:
          true,

        createdAt:
          true,

        updatedAt:
          true,

        publishedAt:
          true,

        forum: {
          select: {
            name: true,
          },
        },

        moderationReviews: {
          orderBy: {
            createdAt:
              "desc",
          },

          take: 1,

          select: {
            id: true,

            decision:
              true,

            moderationVersion:
              true,

            createdAt:
              true,
          },
        },
      },
    });

  const reviewingCount =
    posts.filter(
      (post) =>
        post.moderationStatus ===
        "REVIEWING",
    ).length;

  const revisionCount =
    posts.filter(
      (post) =>
        post.moderationStatus ===
        "REVISION_REQUIRED",
    ).length;

  const approvedCount =
    posts.filter(
      (post) =>
        post.moderationStatus ===
        "APPROVED",
    ).length;

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
              <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#988168]">
                My submissions
              </p>

              <h1 className="mt-1 font-serif text-3xl font-bold text-[#493A2D]">
                Bài viết của tôi
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#766958]">
                Theo dõi publication review, chỉnh sửa revision
                và xem trạng thái moderation của các bài bạn đã gửi.
              </p>
            </div>

            <Link
              href="/discussion/new"
              className="rounded-lg bg-[#72583A] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#5A432C]"
            >
              + Tạo bài viết
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 md:px-6">
        <section className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[#DED5C7] bg-white p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#988875]">
              Reviewing
            </p>

            <strong className="mt-1 block font-serif text-2xl text-[#4E3C2B]">
              {reviewingCount}
            </strong>
          </div>

          <div className="rounded-xl border border-[#DED5C7] bg-white p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#988875]">
              Revision required
            </p>

            <strong className="mt-1 block font-serif text-2xl text-[#4E3C2B]">
              {revisionCount}
            </strong>
          </div>

          <div className="rounded-xl border border-[#DED5C7] bg-white p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#988875]">
              Approved
            </p>

            <strong className="mt-1 block font-serif text-2xl text-[#4E3C2B]">
              {approvedCount}
            </strong>
          </div>
        </section>

        {posts.length === 0 ? (
          <section className="mt-5 rounded-xl border border-[#DED5C7] bg-white p-8 text-center">
            <h2 className="font-serif text-xl font-bold text-[#4C3B2C]">
              Chưa có submission nào
            </h2>

            <p className="mt-2 text-xs leading-5 text-[#897B69]">
              Những bài gửi qua Discussion V2 sẽ xuất hiện ở đây.
            </p>

            <Link
              href="/discussion/new"
              className="mt-5 inline-flex rounded-lg bg-[#72583A] px-5 py-2.5 text-xs font-bold text-white"
            >
              Tạo bài viết đầu tiên
            </Link>
          </section>
        ) : (
          <section className="mt-5 space-y-3">
            {posts.map(
              (post) => {
                const latestReview =
                  post.moderationReviews[0] ??
                  null;

                return (
                  <article
                    key={post.id}
                    className="rounded-xl border border-[#DED5C7] bg-white p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`rounded-md border px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.07em] ${statusClass(
                              post.moderationStatus,
                            )}`}
                          >
                            {statusLabel(
                              post.moderationStatus,
                            )}
                          </span>

                          <span className="rounded-md bg-[#F4F0E9] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.07em] text-[#806E58]">
                            Version{" "}
                            {
                              post.moderationVersion
                            }
                          </span>

                          {post.forum && (
                            <span className="rounded-md bg-[#F4F0E9] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.07em] text-[#806E58]">
                              {
                                post.forum
                                  .name
                              }
                            </span>
                          )}
                        </div>

                        <h2 className="mt-3 font-serif text-xl font-bold text-[#493A2D]">
                          {post.title}
                        </h2>

                        <p className="mt-2 text-[10px] text-[#988A78]">
                          {post.postKind}
                          {" · "}
                          cập nhật{" "}
                          {post.updatedAt.toLocaleString(
                            "vi-VN",
                          )}
                        </p>

                        {latestReview && (
                          <p className="mt-2 text-[10px] leading-5 text-[#817361]">
                            Review gần nhất:{" "}
                            <strong>
                              {
                                latestReview.decision
                              }
                            </strong>
                            {" · "}
                            Version{" "}
                            {
                              latestReview.moderationVersion
                            }
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2">
                        {post.moderationStatus ===
                          "REVISION_REQUIRED" && (
                          <Link
                            href={`/discussion/revise/${post.id}`}
                            className="rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-2 text-[10px] font-bold text-amber-900 transition hover:bg-amber-100"
                          >
                            Chỉnh sửa
                          </Link>
                        )}

                        <Link
                          href={`/discussion/review/${post.id}`}
                          className="rounded-lg border border-[#9F8766] bg-white px-3.5 py-2 text-[10px] font-bold text-[#6F573B] transition hover:bg-[#F4EEE5]"
                        >
                          Publication Review →
                        </Link>
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
