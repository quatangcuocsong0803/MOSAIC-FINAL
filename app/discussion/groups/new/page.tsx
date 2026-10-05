import {
  auth,
} from "@clerk/nextjs/server";

import Link from "next/link";

import {
  redirect,
} from "next/navigation";

import CreateGroupForm from "@/src/components/discussion/groups/CreateGroupForm";

export default async function CreateDiscussionGroupPage() {
  const {
    userId,
  } = await auth();

  if (!userId) {
    redirect(
      "/sign-in",
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5F1]">
      <header className="border-b border-[#DDD5C8] bg-[#FBFAF7]">
        <div className="mx-auto max-w-4xl px-4 py-7 md:px-6">
          <Link
            href="/discussion/groups"
            className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#8B7355] hover:underline"
          >
            ← Groups
          </Link>

          <p className="mt-4 text-[9px] font-extrabold uppercase tracking-[0.17em] text-[#987F62]">
            Community workspace
          </p>

          <h1 className="mt-1 font-serif text-3xl font-bold text-[#493A2D]">
            Tạo nhóm thảo luận
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#766958]">
            Group là không gian do cộng đồng quản lý,
            nhưng bài viết trong group vẫn phải tuân theo
            publication standards và moderation của MOSAIC.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-6 md:px-6">
        <CreateGroupForm />
      </div>
    </main>
  );
}
