import Link from "next/link";

import {
  getDiscussionFeed,
  getDiscussionForums,
} from "@/app/actions/forums";

import DiscussionPostCard from "@/src/components/discussion/DiscussionPostCard";

import DiscussionDraftsLink from "@/src/components/discussion/drafts/DiscussionDraftsLink";

type DiscussionPageProps = {
  searchParams: Promise<{
    forum?: string;
  }>;
};

const POLICY_LABEL: Record<
  string,
  string
> = {
  STANDARD: "Standard review",
  STRICT_RESEARCH:
    "Research-grade review",
  META_LIGHT: "Community review",
};

export default async function DiscussionPage({
  searchParams,
}: DiscussionPageProps) {
  const params =
    await searchParams;

  const selectedForum =
    params.forum?.trim() || undefined;

  const [
    forumResult,
    feedResult,
  ] = await Promise.all([
    getDiscussionForums(),
    getDiscussionFeed(
      selectedForum,
    ),
  ]);

  const forums =
    forumResult.success
      ? forumResult.forums
      : [];

  const posts =
    feedResult.success
      ? feedResult.posts
      : [];

  const activeForum =
    selectedForum
      ? forums.find(
          (forum) =>
            forum.slug ===
            selectedForum,
        ) ?? null
      : null;

  return (
    <main className="min-h-screen bg-[#F7F5F1]">
      {/* Page masthead */}
      <section className="border-b border-[#DDD5C8] bg-[#FBFAF7]">
        <div className="mx-auto max-w-[1460px] px-4 py-7 md:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9A8870]">
                <span>MOSAIC</span>
                <span>/</span>
                <span>Discussion</span>
              </div>

              <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#493A2D] md:text-4xl">
                Typology Discussion
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#766958]">
                Một diễn đàn thảo luận có cấu trúc cho
                typology, theory, psychometrics và evidence.
                Claims nên được phân biệt rõ với interpretation,
                và nguồn dẫn phải hỗ trợ điều đang được lập luận.
              </p>
            </div>

            <Link
              href="/discussion/groups"
              className="rounded-lg border border-[#9B8363] bg-white px-4 py-2.5 text-xs font-bold text-[#6E573D] transition hover:bg-[#F3EDE4]"
            >
              Groups
            </Link>

            <DiscussionDraftsLink />

            <Link
              href="/discussion/reviews"
              className="rounded-lg border border-[#9B8363] bg-white px-4 py-2.5 text-xs font-bold text-[#6E573D] transition hover:bg-[#F3EDE4]"
            >
              Bài của tôi
            </Link>

            <Link
              href="/discussion/new"
              className="inline-flex items-center justify-center rounded-lg bg-[#6F593D] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#58452F]"
            >
              + Tạo bài viết
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1460px] grid-cols-1 gap-5 px-4 py-6 md:px-6 lg:grid-cols-[220px_minmax(0,1fr)_275px] lg:px-8">
        {/* ==================================================
            LEFT — SYSTEM FORUMS
        ================================================== */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 overflow-hidden rounded-xl border border-[#DED5C7] bg-white">
            <div className="border-b border-[#E8E1D6] bg-[#FAF8F4] px-4 py-3">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.17em] text-[#96836B]">
                System Forums
              </p>
            </div>

            <nav className="p-2">
              <Link
                href="/discussion"
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold transition ${
                  !activeForum
                    ? "bg-[#EEE7DA] text-[#55432E]"
                    : "text-[#756857] hover:bg-[#F7F3ED]"
                }`}
              >
                <span>All Discussions</span>
              </Link>

              {forums.map(
                (forum) => {
                  const active =
                    activeForum?.id ===
                    forum.id;

                  return (
                    <Link
                      key={forum.id}
                      href={`/discussion?forum=${forum.slug}`}
                      className={`mt-0.5 flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-xs transition ${
                        active
                          ? "bg-[#EEE7DA] font-bold text-[#55432E]"
                          : "font-medium text-[#756857] hover:bg-[#F7F3ED]"
                      }`}
                    >
                      <span className="min-w-0 truncate">
                        {forum.name}
                      </span>

                      <span className="shrink-0 text-[9px] text-[#A79A88]">
                        {forum._count.posts}
                      </span>
                    </Link>
                  );
                },
              )}
            </nav>

            <div className="border-t border-[#E8E1D6] px-4 py-3">
              <p className="text-[9px] leading-4 text-[#9B8E7C]">
                Các forum này được MOSAIC quản lý và áp dụng
                moderation policy theo từng lĩnh vực.
              </p>
            </div>
          </div>
        </aside>

        {/* ==================================================
            CENTER — FEED
        ================================================== */}
        <section className="min-w-0">
          {/* Mobile forum selector */}
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            <Link
              href="/discussion"
              className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-bold ${
                !activeForum
                  ? "border-[#8B7355] bg-[#8B7355] text-white"
                  : "border-[#DDD3C4] bg-white text-[#766958]"
              }`}
            >
              All
            </Link>

            {forums.map(
              (forum) => (
                <Link
                  key={forum.id}
                  href={`/discussion?forum=${forum.slug}`}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-bold ${
                    activeForum?.id ===
                    forum.id
                      ? "border-[#8B7355] bg-[#8B7355] text-white"
                      : "border-[#DDD3C4] bg-white text-[#766958]"
                  }`}
                >
                  {forum.shortLabel ||
                    forum.name}
                </Link>
              ),
            )}
          </div>

          {/* Feed header */}
          <header className="mb-4 rounded-xl border border-[#DED5C7] bg-white px-5 py-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#A08D74]">
                  {activeForum
                    ? "Forum"
                    : "Discussion Feed"}
                </p>

                <h2 className="mt-1 font-serif text-xl font-bold text-[#4D3D2E]">
                  {activeForum
                    ? activeForum.name
                    : "Tất cả thảo luận"}
                </h2>

                {activeForum && (
                  <p className="mt-1.5 max-w-2xl text-xs leading-5 text-[#7B6D5D]">
                    {activeForum.description}
                  </p>
                )}
              </div>

              {activeForum && (
                <span className="rounded-md border border-[#DED5C7] bg-[#FAF8F4] px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#806D55]">
                  {POLICY_LABEL[
                    activeForum
                      .moderationPolicy
                  ] ||
                    activeForum
                      .moderationPolicy}
                </span>
              )}
            </div>
          </header>

          {!feedResult.success ? (
            <div className="rounded-xl border border-rose-200 bg-white p-8 text-center">
              <p className="text-sm font-semibold text-rose-700">
                Không thể tải Discussion feed.
              </p>
            </div>
          ) : posts.length ===
            0 ? (
            <div className="rounded-xl border border-[#DED5C7] bg-white px-6 py-14 text-center">
              <p className="font-serif text-xl font-bold text-[#594735]">
                Chưa có bài viết
              </p>

              <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#8B7C6B]">
                Forum này chưa có bài viết đã được duyệt.
                Khi hệ thống composer mới hoàn thành, bài đăng
                sẽ xuất hiện ở đây sau moderation.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map(
                (post) => (
                  <DiscussionPostCard
                    key={post.id}
                    post={post}
                  />
                ),
              )}
            </div>
          )}
        </section>

        {/* ==================================================
            RIGHT — DISCUSSION STANDARDS
        ================================================== */}
        <aside className="hidden xl:block">
          <div className="sticky top-28 space-y-4">
            <section className="overflow-hidden rounded-xl border border-[#DED5C7] bg-white">
              <header className="border-b border-[#E8E1D6] bg-[#FAF8F4] px-4 py-3">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#917C61]">
                  Discussion Standards
                </p>
              </header>

              <div className="space-y-3 p-4 text-[11px] leading-5 text-[#726454]">
                <p>
                  <strong className="text-[#514130]">
                    01 · Stay on typology.
                  </strong>
                  <br />
                  Bài viết phải liên quan đến theory,
                  personality measurement hoặc typology.
                </p>

                <p>
                  <strong className="text-[#514130]">
                    02 · Separate claims from interpretation.
                  </strong>
                  <br />
                  Không trình bày diễn giải cá nhân như một
                  empirical fact.
                </p>

                <p>
                  <strong className="text-[#514130]">
                    03 · Cite what supports your claim.
                  </strong>
                  <br />
                  Evidence/theory posts phải có source phù hợp
                  với điều đang được lập luận.
                </p>

                <p>
                  <strong className="text-[#514130]">
                    04 · Debate ideas, not people.
                  </strong>
                  <br />
                  Phản biện lập luận thay vì công kích thành viên.
                </p>
              </div>
            </section>

            <section className="rounded-xl border border-[#DED5C7] bg-white p-4">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#917C61]">
                Evidence labels
              </p>

              <div className="mt-3 space-y-3 text-[10px] leading-4 text-[#786A59]">
                <div>
                  <span className="font-bold text-[#5D4931]">
                    EMPIRICAL
                  </span>
                  <p>
                    Claims dựa trên dữ liệu hoặc nghiên cứu thực nghiệm.
                  </p>
                </div>

                <div>
                  <span className="font-bold text-[#5D4931]">
                    THEORY
                  </span>
                  <p>
                    Thảo luận từ primary/established theoretical sources.
                  </p>
                </div>

                <div>
                  <span className="font-bold text-[#5D4931]">
                    ANALYSIS
                  </span>
                  <p>
                    Diễn giải có lập luận; không được ngụy trang thành fact.
                  </p>
                </div>

                <div>
                  <span className="font-bold text-[#5D4931]">
                    QUESTION
                  </span>
                  <p>
                    Câu hỏi mở để phân tích và trao đổi.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-[#D7CCB9] bg-[#F3EEE5] p-4">
              <p className="text-[10px] font-bold text-[#66523B]">
                MOSAIC moderation
              </p>

              <p className="mt-1.5 text-[10px] leading-5 text-[#7B6A55]">
                Sources provide evidence. Automated review kiểm tra
                relevance và cách lập luận. Publication policy quyết
                định bài có đủ điều kiện xuất bản hay không.
              </p>
            </section>
          </div>
        </aside>
      </div>
    </main>
  );
}
