import "server-only";

import {
  prisma,
} from "@/lib/prisma";

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

function stringArray(
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

function parseFindings(
  findings: unknown,
) {
  let reasons:
    string[] = [];

  let summary:
    string | null =
    null;

  if (
    !isRecord(
      findings,
    )
  ) {
    return {
      reasons,
      summary,
    };
  }

  if (
    isRecord(
      findings.policy,
    )
  ) {
    reasons =
      stringArray(
        findings.policy
          .reasons,
      );
  }

  if (
    isRecord(
      findings.textReview,
    ) &&
    typeof findings
      .textReview
      .summary ===
      "string"
  ) {
    summary =
      findings.textReview
        .summary;
  }

  return {
    reasons,
    summary,
  };
}

function parseSubmissionSnapshot(
  value: unknown,
) {
  if (
    !isRecord(
      value,
    )
  ) {
    return null;
  }

  const forum =
    isRecord(
      value.forum,
    )
      ? value.forum
      : null;

  const rawCitations =
    Array.isArray(
      value.citations,
    )
      ? value.citations
      : [];

  const rawAttachments =
    Array.isArray(
      value.attachments,
    )
      ? value.attachments
      : [];

  return {
    moderationVersion:
      typeof value.moderationVersion ===
      "number"
        ? value.moderationVersion
        : null,

    title:
      typeof value.title ===
      "string"
        ? value.title
        : null,

    content:
      typeof value.content ===
      "string"
        ? value.content
        : null,

    postKind:
      typeof value.postKind ===
      "string"
        ? value.postKind
        : null,

    personalityTag:
      typeof value.personalityTag ===
      "string"
        ? value.personalityTag
        : null,

    forumName:
      forum &&
      typeof forum.name ===
        "string"
        ? forum.name
        : null,

    citations:
      rawCitations.flatMap(
        (item) => {
          if (
            !isRecord(
              item,
            )
          ) {
            return [];
          }

          return [
            {
              title:
                typeof item.title ===
                "string"
                  ? item.title
                  : "",

              sourceType:
                typeof item.sourceType ===
                "string"
                  ? item.sourceType
                  : null,

              verificationStatus:
                typeof item.verificationStatus ===
                "string"
                  ? item.verificationStatus
                  : null,

              doi:
                typeof item.doi ===
                "string"
                  ? item.doi
                  : null,

              url:
                typeof item.url ===
                "string"
                  ? item.url
                  : null,
            },
          ];
        },
      ),

    attachments:
      rawAttachments.flatMap(
        (item) => {
          if (
            !isRecord(
              item,
            )
          ) {
            return [];
          }

          return [
            {
              id:
                typeof item.id ===
                "string"
                  ? item.id
                  : "",

              originalName:
                typeof item.originalName ===
                "string"
                  ? item.originalName
                  : "Attachment",

              kind:
                typeof item.kind ===
                "string"
                  ? item.kind
                  : null,
            },
          ];
        },
      ),
  };
}

export async function getDiscussionReviewStatusForUser(
  postId: string,
  clerkUserId: string,
) {
  const post =
    await prisma.post.findFirst({
      where: {
        id:
          postId,

        authorId:
          clerkUserId,
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
            id: true,
            name: true,
            slug: true,
          },
        },

        group: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },

        citations: {
          orderBy: {
            sortOrder:
              "asc",
          },

          select: {
            id: true,

            title: true,

            verificationStatus:
              true,

            verificationNote:
              true,

            verifiedAt:
              true,

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

            scanStatus:
              true,

            moderationStatus:
              true,

            moderationReason:
              true,
          },
        },

        // Không take: 1 nữa.
        // Cần toàn bộ review để dựng Revision History.
        moderationReviews: {
          orderBy: {
            createdAt:
              "desc",
          },

          select: {
            id: true,

            moderationVersion:
              true,

            decision:
              true,

            relevanceScore:
              true,

            citationScore:
              true,

            evidenceScore:
              true,

            civilityScore:
              true,

            confidence:
              true,

            findings:
              true,

            modelName:
              true,

            promptVersion:
              true,

            policyVersion:
              true,

            submissionSnapshot:
              true,

            createdAt:
              true,
          },
        },
      },
    });

  if (!post) {
    return null;
  }

  const latestReview =
    post
      .moderationReviews[0] ??
    null;

  const latestParsed =
    latestReview
      ? parseFindings(
          latestReview.findings,
        )
      : {
          reasons: [],
          summary: null,
        };

  // Cho background moderation đủ thời gian chạy
  // trước khi user được phép retry.
  const retryWaitMs =
    120_000;

  const retryAvailableAt =
    new Date(
      post.updatedAt.getTime() +
        retryWaitMs,
    );

  const canRetry =
    post.moderationStatus ===
      "REVIEWING" &&
    Date.now() >=
      retryAvailableAt.getTime();

  return {
    id:
      post.id,

    title:
      post.title,

    postKind:
      post.postKind,

    moderationStatus:
      post.moderationStatus,

    moderationScore:
      post.moderationScore,

    moderationVersion:
      post.moderationVersion,

    createdAt:
      post.createdAt.toISOString(),

    updatedAt:
      post.updatedAt.toISOString(),

    publishedAt:
      post.publishedAt?.toISOString() ??
      null,

    forum:
      post.forum,

    group:
      post.group,

    reasons:
      latestParsed.reasons,

    summary:
      latestParsed.summary,

    canRetry,

    retryAvailableAt:
      retryAvailableAt.toISOString(),

    citations:
      post.citations,

    attachments:
      post.attachments,

    // ========================================================
    // LATEST REVIEW
    // Giữ nguyên field này để UI hiện tại không bị vỡ.
    // ========================================================

    review:
      latestReview
        ? {
            id:
              latestReview.id,

            moderationVersion:
              latestReview.moderationVersion,

            decision:
              latestReview.decision,

            relevanceScore:
              latestReview.relevanceScore,

            citationScore:
              latestReview.citationScore,

            evidenceScore:
              latestReview.evidenceScore,

            civilityScore:
              latestReview.civilityScore,

            confidence:
              latestReview.confidence,

            modelName:
              latestReview.modelName,

            promptVersion:
              latestReview.promptVersion,

            policyVersion:
              latestReview.policyVersion,

            createdAt:
              latestReview.createdAt.toISOString(),
          }
        : null,

    // ========================================================
    // COMPLETE MODERATION HISTORY
    // Newest first.
    // ========================================================

    history:
      post.moderationReviews.map(
        (review) => {
          const parsed =
            parseFindings(
              review.findings,
            );

          return {
            id:
              review.id,

            moderationVersion:
              review.moderationVersion,

            decision:
              review.decision,

            relevanceScore:
              review.relevanceScore,

            citationScore:
              review.citationScore,

            evidenceScore:
              review.evidenceScore,

            civilityScore:
              review.civilityScore,

            confidence:
              review.confidence,

            reasons:
              parsed.reasons,

            summary:
              parsed.summary,

            modelName:
              review.modelName,

            promptVersion:
              review.promptVersion,

            policyVersion:
              review.policyVersion,

            snapshot:
              parseSubmissionSnapshot(
                review.submissionSnapshot,
              ),

            createdAt:
              review.createdAt.toISOString(),
          };
        },
      ),
  };
}

export type DiscussionReviewStatusData =
  NonNullable<
    Awaited<
      ReturnType<
        typeof getDiscussionReviewStatusForUser
      >
    >
  >;
