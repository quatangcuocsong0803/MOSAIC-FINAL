import {
  auth,
} from "@clerk/nextjs/server";

import {
  notFound,
  redirect,
} from "next/navigation";

import Link from "next/link";

import {
  getDiscussionReviewStatusForUser,
} from "@/lib/discussion/review-status";

import DiscussionReviewStatus from "@/src/components/discussion/DiscussionReviewStatus";

export default async function DiscussionReviewPage({
  params,
}: {
  params: Promise<{
    postId: string;
  }>;
}) {
  const {
    userId,
  } = await auth();

  if (!userId) {
    redirect(
      "/sign-in",
    );
  }

  const {
    postId,
  } =
    await params;

  const data =
    await getDiscussionReviewStatusForUser(
      postId,
      userId,
    );

  if (!data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F7F5F1]">
      <header className="border-b border-[#DDD5C8] bg-[#FBFAF7]">
        <div className="mx-auto max-w-4xl px-4 py-7 md:px-6">
          <Link
            href="/discussion"
            className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#8B7355] hover:underline"
          >
            ← Discussion
          </Link>

          <h1 className="mt-3 font-serif text-3xl font-bold text-[#493A2D]">
            Publication Review
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#766958]">
            Theo dõi pre-publication moderation của bài viết.
            Bạn có thể rời trang trong khi hệ thống tiếp tục xử lý.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-6 md:px-6">
        <DiscussionReviewStatus
          initialData={
            data
          }
        />
      </div>
    </main>
  );
}
