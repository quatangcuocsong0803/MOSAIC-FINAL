import {
  auth,
} from "@clerk/nextjs/server";

import Link from "next/link";

import {
  prisma,
} from "@/lib/prisma";

export default async function DiscussionDraftsLink() {
  const {
    userId,
  } =
    await auth();

  if (!userId) {
    return null;
  }

  const count =
    await prisma.discussionDraft.count({
      where: {
        ownerClerkId:
          userId,
      },
    });

  return (
    <Link
      href="/discussion/drafts"
      className="inline-flex items-center gap-2 rounded-lg border border-[#9B8363] bg-white px-4 py-2.5 text-xs font-bold text-[#6E573D] transition hover:bg-[#F3EDE4]"
    >
      <span>
        Drafts
      </span>

      {count > 0 && (
        <span className="flex min-w-5 items-center justify-center rounded-full bg-[#8A6844] px-1.5 py-0.5 text-[9px] font-extrabold text-white">
          {count > 99
            ? "99+"
            : count}
        </span>
      )}
    </Link>
  );
}
