import type {
  ImageModerationResult,
  TextModerationResult,
} from "@/lib/discussion/groq-moderation";

export type FinalModerationDecision =
  | "APPROVE"
  | "REVISION_REQUIRED"
  | "REJECT";

export type AttachmentPolicyResult = {
  attachmentId: string;

  recommendation:
    | "APPROVE"
    | "REVISION_REQUIRED"
    | "REJECT";

  concerns: string[];

  source:
    | "TEXT"
    | "IMAGE"
    | "EXTRACTION_ERROR";
};

export function calculateModerationScore(
  review:
    TextModerationResult,
) {
  const value =
    review.typologyRelevance *
      0.35 +
    review.evidenceAlignment *
      0.25 +
    review.citationAlignment *
      0.2 +
    review.civility *
      0.2;

  return Math.round(
    value * 1000,
  ) / 1000;
}

export function evaluateModerationPolicy({
  review,
  postKind,
  forumPolicy,
  minimumCitationCount,
  citationCount,
  verifiedCitationCount,
  problematicCitationCount,
  attachmentResults,
}: {
  review:
    TextModerationResult;

  postKind: string;
  forumPolicy: string;

  minimumCitationCount:
    number;

  citationCount:
    number;

  verifiedCitationCount:
    number;

  problematicCitationCount:
    number;

  attachmentResults:
    AttachmentPolicyResult[];
}) {
  const rejectReasons:
    string[] = [];

  const revisionReasons:
    string[] = [];

  // ==========================================================
  // HARD SAFETY / COMMUNITY BOUNDARIES
  // ==========================================================

  if (
    review.privacyRisk >=
    0.85
  ) {
    rejectReasons.push(
      "Bài viết có nguy cơ cao làm lộ thông tin riêng tư hoặc dữ liệu cá nhân.",
    );
  }

  if (
    review.sexualContentRisk >=
    0.9
  ) {
    rejectReasons.push(
      "Nội dung tình dục không phù hợp với phạm vi Discussion.",
    );
  }

  if (
    review
      .violentOrHatefulAbuseRisk >=
    0.9
  ) {
    rejectReasons.push(
      "Nội dung có dấu hiệu bạo lực đồ họa, thù ghét hoặc công kích nghiêm trọng.",
    );
  }

  if (
    review.spamRisk >=
    0.9
  ) {
    rejectReasons.push(
      "Bài viết có dấu hiệu spam hoặc nội dung không có giá trị thảo luận.",
    );
  }

  // ==========================================================
  // RELEVANCE
  // META_LIGHT được phép bàn trực tiếp về MOSAIC/platform.
  // Reviewer đã được cung cấp forum context.
  // ==========================================================

  if (
    review.typologyRelevance <
    0.35
  ) {
    rejectReasons.push(
      "Nội dung không đủ liên quan đến phạm vi của forum.",
    );
  } else if (
    review.typologyRelevance <
    0.7
  ) {
    revisionReasons.push(
      "Cần làm rõ hơn mối liên hệ của bài viết với chủ đề forum/typology.",
    );
  }

  // ==========================================================
  // CITATIONS
  // ==========================================================

  if (
    citationCount <
    minimumCitationCount
  ) {
    revisionReasons.push(
      `Bài viết cần ít nhất ${minimumCitationCount} nguồn dẫn.`,
    );
  }

  if (
    minimumCitationCount >
      0 &&
    verifiedCitationCount <
      minimumCitationCount
  ) {
    revisionReasons.push(
      `Bài viết cần ít nhất ${minimumCitationCount} citation đã được hệ thống xác minh.`,
    );
  }

  if (
    problematicCitationCount >
    0
  ) {
    revisionReasons.push(
      "Có citation bị INVALID hoặc MISMATCH. Hãy sửa identifier, metadata hoặc classification của nguồn.",
    );
  }

  if (
    minimumCitationCount >
      0 &&
    review.citationAlignment <
      0.55
  ) {
    revisionReasons.push(
      "Citation hiện tại chưa cho thấy đủ sự phù hợp với các claim đang được trình bày.",
    );
  }

  // ==========================================================
  // EVIDENCE / CLAIM FRAMING
  // ==========================================================

  if (
    (postKind ===
      "EMPIRICAL_EVIDENCE" ||
      postKind ===
        "ESTABLISHED_THEORY") &&
    review.evidenceAlignment <
      0.6
  ) {
    revisionReasons.push(
      "Cách trình bày evidence/theory chưa đủ hỗ trợ cho mức độ chắc chắn của các claim.",
    );
  }

  if (
    review.unsupportedClaims
      .length > 0 &&
    review.evidenceAlignment <
      0.75
  ) {
    revisionReasons.push(
      "Có claim quan trọng chưa được hỗ trợ hoặc cần được diễn đạt thận trọng hơn.",
    );
  }

  if (
    review
      .medicalMisrepresentationRisk >=
    0.75
  ) {
    revisionReasons.push(
      "Bài viết có nguy cơ dùng typology như chẩn đoán hoặc suy diễn sức khỏe tâm thần.",
    );
  }

  // ==========================================================
  // CIVILITY
  // ==========================================================

  if (
    review.civility <
    0.45
  ) {
    rejectReasons.push(
      "Cách trình bày mang tính công kích cá nhân hoặc không phù hợp với chuẩn tranh luận.",
    );
  } else if (
    review.civility <
    0.72
  ) {
    revisionReasons.push(
      "Cần điều chỉnh cách diễn đạt để tập trung vào lập luận thay vì con người.",
    );
  }

  // ==========================================================
  // ATTACHMENTS
  // ==========================================================

  for (
    const attachment of
      attachmentResults
  ) {
    if (
      attachment.recommendation ===
      "REJECT"
    ) {
      rejectReasons.push(
        ...attachment.concerns.map(
          (concern) =>
            `Attachment: ${concern}`,
        ),
      );
    } else if (
      attachment.recommendation ===
      "REVISION_REQUIRED"
    ) {
      revisionReasons.push(
        ...attachment.concerns.map(
          (concern) =>
            `Attachment: ${concern}`,
        ),
      );
    }
  }

  if (
    rejectReasons.length >
    0
  ) {
    return {
      decision:
        "REJECT" as const,

      reasons: [
        ...new Set(
          rejectReasons,
        ),
      ],
    };
  }

  if (
    revisionReasons.length >
    0
  ) {
    return {
      decision:
        "REVISION_REQUIRED" as const,

      reasons: [
        ...new Set(
          revisionReasons,
        ),
      ],
    };
  }

  // STRICT_RESEARCH không auto-fail chỉ vì tên policy.
  // Requirements thực tế nằm ở citation/evidence thresholds phía trên.
  void forumPolicy;

  return {
    decision:
      "APPROVE" as const,

    reasons: [
      "Bài viết đáp ứng các tiêu chí publication hiện tại của MOSAIC.",
    ],
  };
}
