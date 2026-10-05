import { notifyDiscussionReview } from "@/lib/settings/review-notification";
import "server-only";

import {
  Prisma,
} from "@prisma/client";
import {
  revalidatePath,
} from "next/cache";

import {
  prisma,
} from "@/lib/prisma";

import {
  extractAttachmentContent,
  type ExtractedAttachment,
} from "@/lib/discussion/extract-attachment-content";

import {
  verifyPostCitations,
} from "@/lib/discussion/citation-verifier";

import {
  MODERATION_MODEL,
  MODERATION_PROMPT_VERSION,
  moderateDiscussionImage,
  moderateDiscussionText,
  type ImageModerationResult,
} from "@/lib/discussion/groq-moderation";

import {
  calculateModerationScore,
  evaluateModerationPolicy,
  type AttachmentPolicyResult,
} from "@/lib/discussion/moderation-policy";

import {
  getMinimumCitationCount,
  type DiscussionPostKind,
  type DiscussionForumPolicy,
} from "@/lib/discussion/post-policy";

export const MODERATION_POLICY_VERSION =
  "discussion-policy-v1";

function safeReason(
  value: string,
) {
  return value
    .trim()
    .slice(
      0,
      1000,
    );
}

export async function runDiscussionModeration(
  postId: string,
) {
  const post =
    await prisma.post.findUnique({
      where: {
        id:
          postId,
      },

      include: {
        forum: {
          select: {
            id: true,
            name: true,
            moderationPolicy:
              true,
          },
        },

        citations: {
          orderBy: {
            sortOrder:
              "asc",
          },
        },

        attachments: {
          orderBy: {
            createdAt:
              "asc",
          },
        },
      },
    });

  if (!post) {
    throw new Error(
      "Post not found.",
    );
  }

  if (!post.forum) {
    throw new Error(
      "Post has no forum.",
    );
  }

  if (
    post.moderationStatus !==
    "REVIEWING"
  ) {
    return {
      decision:
        post.moderationStatus,

      reasons: [
        "Post is not awaiting moderation.",
      ],
    };
  }

  // ========================================================
  // 0. VERIFY CITATIONS BEFORE AI REVIEW
  // ========================================================

  const citationVerifications =
    await verifyPostCitations(
      post.id,
    );

  const citationVerificationById =
    new Map(
      citationVerifications.map(
        (item) => [
          item.citationId,
          item,
        ],
      ),
    );

  const minimumCitationCount =
    getMinimumCitationCount(
      post.postKind as DiscussionPostKind,
      post.forum
        .moderationPolicy as DiscussionForumPolicy,
    );

  if (
    post.attachments.length >
    0
  ) {
    await prisma.postAttachment.updateMany({
      where: {
        postId:
          post.id,

        scanStatus:
          "CLEAN",
      },

      data: {
        moderationStatus:
          "REVIEWING",
      },
    });
  }

  const extracted:
    ExtractedAttachment[] =
    [];

  const attachmentPolicyResults:
    AttachmentPolicyResult[] =
    [];

  const extractionErrors:
    Array<{
      attachmentId:
        string;
      fileName: string;
      error: string;
    }> = [];

  try {
    // ========================================================
    // 1. EXTRACT ALL ATTACHMENTS
    // ========================================================

    for (
      const attachment of
        post.attachments
    ) {
      if (
        attachment.scanStatus !==
        "CLEAN"
      ) {
        extractionErrors.push({
          attachmentId:
            attachment.id,

          fileName:
            attachment.originalName,

          error:
            "Attachment chưa vượt qua static security screening.",
        });

        attachmentPolicyResults.push({
          attachmentId:
            attachment.id,

          recommendation:
            "REVISION_REQUIRED",

          concerns: [
            `${attachment.originalName}: file chưa sẵn sàng cho content moderation.`,
          ],

          source:
            "EXTRACTION_ERROR",
        });

        continue;
      }

      try {
        const result =
          await extractAttachmentContent(
            {
              id:
                attachment.id,

              originalName:
                attachment.originalName,

              storagePath:
                attachment.storagePath,

              mimeType:
                attachment.mimeType,

              kind:
                attachment.kind,
            },
          );

        extracted.push(
          result,
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unknown extraction error";

        extractionErrors.push({
          attachmentId:
            attachment.id,

          fileName:
            attachment.originalName,

          error:
            message,
        });

        attachmentPolicyResults.push({
          attachmentId:
            attachment.id,

          recommendation:
            "REVISION_REQUIRED",

          concerns: [
            `${attachment.originalName}: hệ thống không thể đọc đủ nội dung để kiểm duyệt.`,
          ],

          source:
            "EXTRACTION_ERROR",
        });

        await prisma.postAttachment.update({
          where: {
            id:
              attachment.id,
          },

          data: {
            moderationStatus:
              "ERROR",

            moderationReason:
              safeReason(
                message,
              ),
          },
        });
      }
    }

    // ========================================================
    // 2. TEXT POST + CITATIONS + DOCUMENTS
    // ========================================================

    const textAttachments =
      extracted.filter(
        (
          attachment,
        ): attachment is Extract<
          ExtractedAttachment,
          {
            mode: "TEXT";
          }
        > =>
          attachment.mode ===
          "TEXT",
      );

    const textReview =
      await moderateDiscussionText({
        forumName:
          post.forum.name,

        forumPolicy:
          post.forum
            .moderationPolicy,

        postKind:
          post.postKind,

        minimumCitationCount,

        title:
          post.title,

        content:
          post.content,

        citations:
          post.citations.map(
            (
              citation,
              index,
            ) => ({
              index:
                index + 1,

              title:
                citation.title,

              authors:
                citation.authors,

              year:
                citation.year,

              publisher:
                citation.publisher,

              url:
                citation.url,

              doi:
                citation.doi,

              sourceType:
                citation.sourceType,

              verificationStatus:
                citationVerificationById.get(
                  citation.id,
                )?.status ??
                citation.verificationStatus,

              verificationNote:
                citationVerificationById.get(
                  citation.id,
                )?.note ??
                citation.verificationNote,

              canonicalTitle:
                citationVerificationById.get(
                  citation.id,
                )?.canonical.title ??
                null,

              canonicalDoi:
                citationVerificationById.get(
                  citation.id,
                )?.canonical.doi ??
                null,

              canonicalUrl:
                citationVerificationById.get(
                  citation.id,
                )?.canonical.url ??
                null,
            }),
          ),

        documents:
          textAttachments.map(
            (
              attachment,
            ) => ({
              attachmentId:
                attachment.id,

              fileName:
                attachment.originalName,

              kind:
                attachment.kind,

              text:
                attachment.text,

              truncated:
                attachment.truncated,
            }),
          ),
      });

    // ========================================================
    // 3. APPLY DOCUMENT REVIEWS
    // ========================================================

    for (
      const attachment of
        textAttachments
    ) {
      const review =
        textReview.attachmentReviews.find(
          (candidate) =>
            candidate.attachmentId ===
            attachment.id,
        );

      if (!review) {
        attachmentPolicyResults.push({
          attachmentId:
            attachment.id,

          recommendation:
            "REVISION_REQUIRED",

          concerns: [
            `${attachment.originalName}: AI reviewer không trả về đánh giá attachment.`,
          ],

          source:
            "TEXT",
        });

        await prisma.postAttachment.update({
          where: {
            id:
              attachment.id,
          },

          data: {
            moderationStatus:
              "ERROR",

            moderationReason:
              "Missing structured attachment review.",
          },
        });

        continue;
      }

      attachmentPolicyResults.push({
        attachmentId:
          attachment.id,

        recommendation:
          review.recommendation,

        concerns:
          review.concerns.length >
          0
            ? review.concerns
            : [
                review.summary,
              ],

        source:
          "TEXT",
      });

      await prisma.postAttachment.update({
        where: {
          id:
            attachment.id,
        },

        data: {
          moderationStatus:
            review.recommendation ===
            "APPROVE"
              ? "APPROVED"
              : "REJECTED",

          moderationReason:
            safeReason(
              review.summary,
            ),

          moderationFindings:
            review as unknown as Prisma.InputJsonValue,

          extractedTextPreview:
            attachment.text.slice(
              0,
              4000,
            ),
        },
      });
    }

    // ========================================================
    // 4. IMAGE MODERATION
    // Sequential intentionally: avoid burst/rate-limit issues.
    // ========================================================

    const imageAttachments =
      extracted.filter(
        (
          attachment,
        ): attachment is Extract<
          ExtractedAttachment,
          {
            mode: "IMAGE";
          }
        > =>
          attachment.mode ===
          "IMAGE",
      );

    const imageReviews:
      Array<{
        attachmentId:
          string;

        review:
          ImageModerationResult;
      }> = [];

    for (
      const attachment of
        imageAttachments
    ) {
      const review =
        await moderateDiscussionImage({
          imageUrl:
            attachment.signedUrl,

          fileName:
            attachment.originalName,

          postTitle:
            post.title,

          postKind:
            post.postKind,

          forumName:
            post.forum.name,
        });

      imageReviews.push({
        attachmentId:
          attachment.id,

        review,
      });

      attachmentPolicyResults.push({
        attachmentId:
          attachment.id,

        recommendation:
          review.recommendation,

        concerns:
          review.concerns.length >
          0
            ? review.concerns
            : [
                review.summary,
              ],

        source:
          "IMAGE",
      });

      await prisma.postAttachment.update({
        where: {
          id:
            attachment.id,
        },

        data: {
          moderationStatus:
            review.recommendation ===
            "APPROVE"
              ? "APPROVED"
              : "REJECTED",

          moderationReason:
            safeReason(
              review.summary,
            ),

          moderationFindings:
            review as unknown as Prisma.InputJsonValue,
        },
      });
    }

    // ========================================================
    // 5. MOSAIC POLICY ENGINE
    // ========================================================

    const verifiedCitationCount =
      citationVerifications.filter(
        (citation) =>
          citation.status ===
          "VERIFIED",
      ).length;

    const problematicCitationCount =
      citationVerifications.filter(
        (citation) =>
          citation.status ===
            "INVALID" ||
          citation.status ===
            "MISMATCH",
      ).length;

    const policy =
      evaluateModerationPolicy({
        review:
          textReview,

        postKind:
          post.postKind,

        forumPolicy:
          post.forum
            .moderationPolicy,

        minimumCitationCount,

        citationCount:
          post.citations.length,

        verifiedCitationCount,

        problematicCitationCount,

        attachmentResults:
          attachmentPolicyResults,
      });

    const moderationScore =
      calculateModerationScore(
        textReview,
      );

    const now =
      new Date();

    const postStatus =
      policy.decision ===
      "APPROVE"
        ? "APPROVED"
        : policy.decision ===
            "REVISION_REQUIRED"
          ? "REVISION_REQUIRED"
          : "REJECTED";

    const findings = {
      textReview,

      citationVerifications,

      imageReviews,

      extractionErrors,

      attachmentPolicyResults,

      policy: {
        decision:
          policy.decision,

        reasons:
          policy.reasons,

        minimumCitationCount,

        citationCount:
          post.citations.length,
      },
    };

    // ========================================================
    // 6. IMMUTABLE MODERATION AUDIT SNAPSHOT
    //
    // Post sẽ tiếp tục được edit ở revision sau.
    // Review phải giữ lại chính xác input mà nó đã đánh giá.
    // ========================================================

    const submissionSnapshot = {
      moderationVersion:
        post.moderationVersion,

      forum: {
        id:
          post.forum.id,

        name:
          post.forum.name,

        moderationPolicy:
          post.forum.moderationPolicy,
      },

      postKind:
        post.postKind,

      title:
        post.title,

      content:
        post.content,

      personalityTag:
        post.personalityTag,

      citations:
        post.citations.map(
          (citation) => {
            const verification =
              citationVerificationById.get(
                citation.id,
              );

            return {
              id:
                citation.id,

              title:
                citation.title,

              authors:
                citation.authors,

              year:
                citation.year,

              publisher:
                citation.publisher,

              url:
                citation.url,

              doi:
                citation.doi,

              sourceType:
                citation.sourceType,

              verificationStatus:
                verification?.status ??
                citation.verificationStatus,

              verificationNote:
                verification?.note ??
                citation.verificationNote,

              canonical:
                verification?.canonical ??
                null,

              sortOrder:
                citation.sortOrder,
            };
          },
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

            mimeType:
              attachment.mimeType,

            sizeBytes:
              attachment.sizeBytes,

            sha256:
              attachment.sha256,
          }),
        ),
    };

    const [savedReview] = await prisma.$transaction([
      prisma.moderationReview.create({
        data: {
          postId:
            post.id,

          moderationVersion:
            post.moderationVersion,

          submissionSnapshot:
            submissionSnapshot as unknown as Prisma.InputJsonValue,

          decision:
            policy.decision,

          relevanceScore:
            textReview.typologyRelevance,

          citationScore:
            textReview.citationAlignment,

          evidenceScore:
            textReview.evidenceAlignment,

          civilityScore:
            textReview.civility,

          confidence:
            null,

          findings:
            findings as unknown as Prisma.InputJsonValue,

          modelName:
            MODERATION_MODEL,

          promptVersion:
            MODERATION_PROMPT_VERSION,

          policyVersion:
            MODERATION_POLICY_VERSION,
        },
      }),

      prisma.post.update({
        where: {
          id:
            post.id,
        },

        data: {
          moderationStatus:
            postStatus,

          moderationScore,

          publishedAt:
            policy.decision ===
            "APPROVE"
              ? now
              : null,
        },
      }),
    ]);

    await notifyDiscussionReview(post.authorId, post.id, post.title, savedReview.id, policy.decision);

    revalidatePath(
      "/discussion",
    );

    revalidatePath(
      "/",
    );

    return {
      decision:
        policy.decision,

      reasons:
        policy.reasons,

      moderationScore,

      summary:
        textReview.summary,
    };
  } catch (error) {
    // FAIL CLOSED:
    // Groq/network/parser failure không được auto-publish.
    console.error(
      "Discussion moderation failed:",
      error,
    );

    await prisma.post.update({
      where: {
        id:
          post.id,
      },

      data: {
        moderationStatus:
          "REVIEWING",

        publishedAt:
          null,
      },
    });

    await prisma.postAttachment.updateMany({
      where: {
        postId:
          post.id,

        moderationStatus:
          "REVIEWING",
      },

      data: {
        moderationStatus:
          "PENDING",

        moderationReason:
          "Automated moderation could not complete. Retry required.",
      },
    });

    return {
      decision:
        "REVIEWING" as const,

      reasons: [
        "Hệ thống kiểm duyệt tạm thời chưa hoàn tất. Bài viết chưa được xuất bản.",
      ],

      moderationScore:
        null,

      summary:
        "Moderation could not complete.",
    };
  }
}
