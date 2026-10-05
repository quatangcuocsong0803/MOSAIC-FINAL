import {
  randomUUID,
} from "crypto";

import {
  auth,
} from "@clerk/nextjs/server";

import {
  notFound,
  redirect,
} from "next/navigation";

import Link from "next/link";

import {
  prisma,
} from "@/lib/prisma";

import type {
  DiscussionCitationSourceType,
  DiscussionPostKind,
} from "@/lib/discussion/post-policy";

import DiscussionRevisionComposer from "@/src/components/discussion/DiscussionRevisionComposer";

export default async function ReviseDiscussionPostPage({
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
  } = await params;

  const post =
    await prisma.post.findFirst({
      where: {
        id:
          postId,

        authorId:
          userId,
      },

      select: {
        id: true,

        forumId:
          true,

        postKind:
          true,

        title: true,
        content: true,

        personalityTag:
          true,

        moderationStatus:
          true,

        moderationVersion:
          true,

        citations: {
          orderBy: {
            sortOrder:
              "asc",
          },

          select: {
            id: true,

            title: true,
            authors: true,
            year: true,
            publisher: true,

            url: true,
            doi: true,

            sourceType:
              true,
          },
        },

        attachments: {
          orderBy: {
            createdAt:
              "asc",
          },

          select: {
            id: true,

            originalName:
              true,

            kind:
              true,

            sizeBytes:
              true,

            scanStatus:
              true,

            moderationStatus:
              true,

            moderationReason:
              true,
          },
        },
      },
    });

  if (!post) {
    notFound();
  }

  if (
    post.moderationStatus !==
    "REVISION_REQUIRED"
  ) {
    redirect(
      `/discussion/review/${post.id}`,
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
        description:
          true,

        moderationPolicy:
          true,
      },
    });

  if (
    forums.length === 0
  ) {
    redirect(
      `/discussion/review/${post.id}`,
    );
  }

  const uploadSessionId =
    randomUUID();

  const initialData = {
    postId:
      post.id,

    forumId:
      post.forumId ||
      forums[0].id,

    postKind:
      post.postKind as DiscussionPostKind,

    title:
      post.title,

    content:
      post.content,

    personalityTag:
      post.personalityTag,

    citations:
      post.citations.map(
        (citation) => ({
          id:
            citation.id,

          title:
            citation.title,

          authors:
            citation.authors ||
            "",

          year:
            citation.year
              ? String(
                  citation.year,
                )
              : "",

          publisher:
            citation.publisher ||
            "",

          url:
            citation.url ||
            "",

          doi:
            citation.doi ||
            "",

          sourceType:
            citation.sourceType as DiscussionCitationSourceType,
        }),
      ),

    attachments:
      post.attachments.map(
        (attachment) => ({
          id:
            attachment.id,

          originalName:
            attachment.originalName,

          kind:
            attachment.kind,

          sizeBytes:
            attachment.sizeBytes,

          scanStatus:
            attachment.scanStatus,

          moderationStatus:
            attachment.moderationStatus,

          moderationReason:
            attachment.moderationReason,
        }),
      ),
  };

  return (
    <main className="min-h-screen bg-[#F7F5F1]">
      <header className="border-b border-[#DDD5C8] bg-[#FBFAF7]">
        <div className="mx-auto max-w-5xl px-4 py-7 md:px-6">
          <Link
            href={`/discussion/review/${post.id}`}
            className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#8B7355] hover:underline"
          >
            ← Publication Review
          </Link>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.17em] text-[#9A8368]">
                Revision · Version{" "}
                {post.moderationVersion +
                  1}
              </p>

              <h1 className="mt-1 font-serif text-3xl font-bold text-[#493A2D]">
                Edit & Resubmit
              </h1>
            </div>

            <span className="rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.09em] text-amber-800">
              Revision required
            </span>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#766958]">
            Chỉnh sửa bài dựa trên review findings.
            Citation sẽ được xác minh lại và toàn bộ
            revision sẽ đi qua moderation một lần nữa.
            Review trước đó vẫn được giữ trong lịch sử.
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 px-4 py-6 md:px-6 lg:grid-cols-[minmax(0,1fr)_240px]">
        <DiscussionRevisionComposer
          forums={
            forums
          }
          uploadSessionId={
            uploadSessionId
          }
          initialData={
            initialData
          }
        />

        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-4">
            <section className="rounded-xl border border-[#D7CAB7] bg-white p-4">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#8A7357]">
                Revision checklist
              </p>

              <div className="mt-3 space-y-3 text-[10px] leading-5 text-[#776958]">
                <p>
                  <strong className="text-[#514130]">
                    Address the findings.
                  </strong>
                  <br />
                  Sửa đúng các điểm mà moderation đã nêu,
                  không chỉ đổi vài câu cho khác.
                </p>

                <p>
                  <strong className="text-[#514130]">
                    Verify the source.
                  </strong>
                  <br />
                  DOI hoặc URL sẽ được Citation Verifier
                  kiểm tra lại từ đầu.
                </p>

                <p>
                  <strong className="text-[#514130]">
                    Keep useful evidence.
                  </strong>
                  <br />
                  Attachment cũ có thể giữ, loại bỏ hoặc
                  bổ sung tài liệu mới.
                </p>
              </div>
            </section>

            <section className="rounded-xl border border-[#D6CAB7] bg-[#F3EEE5] p-4">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#856E51]">
                Same post · new review
              </p>

              <p className="mt-2 text-[10px] leading-5 text-[#75644F]">
                Revision không tạo bài duplicate.
                Post ID giữ nguyên, moderation version tăng
                và review history cũ vẫn được lưu.
              </p>
            </section>
          </div>
        </aside>
      </div>
    </main>
  );
}
