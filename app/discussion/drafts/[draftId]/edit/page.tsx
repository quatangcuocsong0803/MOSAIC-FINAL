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

import {
  CITATION_SOURCE_TYPES,
  type DiscussionCitationSourceType,
  type DiscussionPostKind,
} from "@/lib/discussion/post-policy";

import DiscussionComposer from "@/src/components/discussion/DiscussionComposer";

function isRecord(
  value: unknown,
): value is Record<
  string,
  unknown
> {
  return (
    typeof value ===
      "object" &&
    value !== null &&
    !Array.isArray(
      value,
    )
  );
}

function parseCitations(
  value: unknown,
) {
  if (
    !Array.isArray(
      value,
    )
  ) {
    return [];
  }

  return value.flatMap(
    (item) => {
      if (
        !isRecord(
          item,
        )
      ) {
        return [];
      }

      const rawSourceType =
        typeof item.sourceType ===
        "string"
          ? item.sourceType
          : "";

      const sourceType:
        DiscussionCitationSourceType =
        CITATION_SOURCE_TYPES.includes(
          rawSourceType as DiscussionCitationSourceType,
        )
          ? rawSourceType as DiscussionCitationSourceType
          : "SECONDARY_REFERENCE";

      return [
        {
          id:
            typeof item.id ===
            "string"
              ? item.id
              : crypto.randomUUID(),

          title:
            typeof item.title ===
            "string"
              ? item.title
              : "",

          authors:
            typeof item.authors ===
            "string"
              ? item.authors
              : "",

          year:
            typeof item.year ===
            "string"
              ? item.year
              : "",

          publisher:
            typeof item.publisher ===
            "string"
              ? item.publisher
              : "",

          url:
            typeof item.url ===
            "string"
              ? item.url
              : "",

          doi:
            typeof item.doi ===
            "string"
              ? item.doi
              : "",

          sourceType,
        },
      ];
    },
  );
}

function parseIds(
  value: unknown,
) {
  if (
    !Array.isArray(
      value,
    )
  ) {
    return [];
  }

  return value.filter(
    (
      item,
    ): item is string =>
      typeof item ===
      "string",
  );
}

export default async function EditDiscussionDraftPage({
  params,
}: {
  params: Promise<{
    draftId: string;
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
    draftId,
  } = await params;

  const draft =
    await prisma.discussionDraft.findFirst({
      where: {
        id:
          draftId,

        ownerClerkId:
          userId,
      },
    });

  if (!draft) {
    notFound();
  }

  // ========================================================
  // GROUP
  // ========================================================

  let group:
    {
      id: string;
      slug: string;
      name: string;
    } |
    null =
    null;

  if (draft.groupId) {
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

    if (dbUser) {
      const foundGroup =
        await prisma.discussionGroup.findFirst({
          where: {
            id:
              draft.groupId,

            isActive:
              true,

            members: {
              some: {
                userId:
                  dbUser.id,

                status:
                  "ACTIVE",
              },
            },
          },

          select: {
            id: true,
            slug: true,
            name: true,
          },
        });

      group =
        foundGroup;
    }
  }

  // Nếu draft từng nằm trong Group nhưng user mất quyền,
  // không silently convert thành global post.
  if (
    draft.groupId &&
    !group
  ) {
    redirect(
      "/discussion/drafts",
    );
  }

  // ========================================================
  // SYSTEM FORUMS
  // ========================================================

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
      "/discussion",
    );
  }

  // ========================================================
  // ATTACHMENTS
  // ========================================================

  const storedIds =
    parseIds(
      draft.attachmentIds,
    );

  const attachments =
    storedIds.length === 0
      ? []
      : await prisma.postAttachment.findMany({
          where: {
            id: {
              in:
                storedIds,
            },

            uploaderClerkId:
              userId,

            uploadSessionId:
              draft.uploadSessionId,

            postId:
              null,
          },

          select: {
            id: true,

            originalName:
              true,

            kind:
              true,

            sizeBytes:
              true,
          },
        });

  const attachmentMap =
    new Map(
      attachments.map(
        (attachment) => [
          attachment.id,
          attachment,
        ],
      ),
    );

  const orderedAttachments =
    storedIds.flatMap(
      (id) => {
        const attachment =
          attachmentMap.get(
            id,
          );

        return attachment
          ? [
              attachment,
            ]
          : [];
      },
    );

  return (
    <main className="min-h-screen bg-[#F7F5F1]">
      <header className="border-b border-[#DDD5C8] bg-[#FBFAF7]">
        <div className="mx-auto max-w-5xl px-4 py-7 md:px-6">
          <Link
            href="/discussion/drafts"
            className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#8B7355] hover:underline"
          >
            ← Drafts
          </Link>

          <p className="mt-4 text-[9px] font-extrabold uppercase tracking-[0.17em] text-[#977D5F]">
            Saved draft
          </p>

          <h1 className="mt-1 font-serif text-3xl font-bold text-[#493A2D]">
            Tiếp tục viết
          </h1>

          <p className="mt-2 text-sm text-[#796A58]">
            Bản nháp được tự động lưu khi bạn chỉnh sửa.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 md:px-6">
        <DiscussionComposer
          forums={
            forums
          }
          uploadSessionId={
            draft.uploadSessionId
          }
          group={
            group
          }
          initialDraft={{
            id:
              draft.id,

            uploadSessionId:
              draft.uploadSessionId,

            forumId:
              draft.forumId,

            groupId:
              draft.groupId,

            postKind:
              draft.postKind as DiscussionPostKind,

            title:
              draft.title,

            content:
              draft.content,

            personalityTag:
              draft.personalityTag,

            citations:
              parseCitations(
                draft.citationDrafts,
              ),

            attachments:
              orderedAttachments,
          }}
        />
      </div>
    </main>
  );
}
