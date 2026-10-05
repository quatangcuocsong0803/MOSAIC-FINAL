import {
  randomUUID,
} from "crypto";

import {
  auth,
} from "@clerk/nextjs/server";

import Link from "next/link";

import {
  notFound,
  redirect,
} from "next/navigation";

import {
  prisma,
} from "@/lib/prisma";

import DiscussionComposer from "@/src/components/discussion/DiscussionComposer";

export default async function NewGroupDiscussionPostPage({
  params,
}: {
  params: Promise<{
    slug: string;
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
    slug,
  } = await params;

  const dbUser =
    await prisma.user.findUnique({
      where: {
        clerkId:
          userId,
      },

      select: {
        id: true,
      },
    });

  if (!dbUser) {
    redirect(
      `/discussion/groups/${slug}`,
    );
  }

  const group =
    await prisma.discussionGroup.findFirst({
      where: {
        slug,

        isActive:
          true,
      },

      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
      },
    });

  if (!group) {
    notFound();
  }

  const membership =
    await prisma.discussionGroupMember.findUnique({
      where: {
        groupId_userId: {
          groupId:
            group.id,

          userId:
            dbUser.id,
        },
      },

      select: {
        status: true,
      },
    });

  if (
    membership?.status !==
    "ACTIVE"
  ) {
    redirect(
      `/discussion/groups/${group.slug}`,
    );
  }

  const forums =
    await prisma.forum.findMany({
      where: {
        isActive:
          true,
      },

      orderBy: {
        displayOrder:
          "asc",
      },

      select: {
        id: true,
        name: true,
        description: true,
        moderationPolicy:
          true,
      },
    });

  if (
    forums.length === 0
  ) {
    redirect(
      `/discussion/groups/${group.slug}`,
    );
  }

  const uploadSessionId =
    randomUUID();

  return (
    <main className="min-h-screen bg-[#F7F5F1]">
      <header className="border-b border-[#DDD5C8] bg-[#FBFAF7]">
        <div className="mx-auto max-w-5xl px-4 py-7 md:px-6">
          <Link
            href={`/discussion/groups/${group.slug}`}
            className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#8B7355] hover:underline"
          >
            ← {group.name}
          </Link>

          <p className="mt-4 text-[9px] font-extrabold uppercase tracking-[0.17em] text-[#977D5F]">
            Group submission
          </p>

          <h1 className="mt-1 font-serif text-3xl font-bold text-[#493A2D]">
            Tạo bài viết trong Group
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#766958]">
            Bài viết thuộc Group nhưng vẫn được phân loại bằng
            System Forum và đi qua toàn bộ pre-publication moderation
            của MOSAIC.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 md:px-6">
        <DiscussionComposer
          forums={
            forums
          }
          uploadSessionId={
            uploadSessionId
          }
          group={{
            id:
              group.id,

            slug:
              group.slug,

            name:
              group.name,
          }}
        />
      </div>
    </main>
  );
}
