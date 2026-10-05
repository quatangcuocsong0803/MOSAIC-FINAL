export const COMMENT_PROMPT_VERSION = "comment-review-v1";
export const COMMENT_POLICY_VERSION = "comment-policy-v1";
export const COMMENT_MAX_LENGTH = 2000;
export const COMMENT_LEASE_MS = 6 * 60 * 1000;

export type CommentAssessment = {
  relevance: number;
  civility: number;
  spamRisk: number;
  privacyRisk: number;
  abuseRisk: number;
  explicitContentRisk: number;
  misleadingClinicalClaimRisk: number;
  unsupportedFactualClaimRisk: number;
  reasons: string[];
  summary: string;
};

export function parseCommentAssessment(value: unknown): CommentAssessment {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Invalid comment assessment");
  }
  const record = value as Record<string, unknown>;
  const scores = ["relevance", "civility", "spamRisk", "privacyRisk", "abuseRisk",
    "explicitContentRisk", "misleadingClinicalClaimRisk", "unsupportedFactualClaimRisk"] as const;
  for (const key of scores) {
    const score = record[key];
    if (typeof score !== "number" || !Number.isFinite(score) || score < 0 || score > 1) {
      throw new Error(`Invalid score: ${key}`);
    }
  }
  if (!Array.isArray(record.reasons) || record.reasons.length > 8 ||
      !record.reasons.every(reason => typeof reason === "string" && reason.length <= 500) ||
      typeof record.summary !== "string" || record.summary.length > 1000) {
    throw new Error("Invalid assessment explanation");
  }
  return record as CommentAssessment;
}

export function decideComment(review: CommentAssessment) {
  // Scores are heuristic signals, not truth or calibrated probabilities.
  const severe = Math.max(review.spamRisk, review.privacyRisk, review.abuseRisk,
    review.explicitContentRisk);
  const reasons: string[] = [];
  if (review.spamRisk >= 0.45) reasons.push("Loại bỏ spam hoặc quảng cáo không liên quan.");
  if (review.privacyRisk >= 0.45) reasons.push("Loại bỏ thông tin riêng tư của người khác.");
  if (review.abuseRisk >= 0.45 || review.civility < 0.5) reasons.push("Diễn đạt lại để tránh công kích, quấy rối hoặc đe dọa.");
  if (review.explicitContentRisk >= 0.45) reasons.push("Loại bỏ nội dung tình dục hoặc bạo lực đồ họa không phù hợp.");
  if (review.relevance < 0.35) reasons.push("Làm rõ liên hệ với bài viết hoặc bình luận đang được phản hồi.");
  if (review.misleadingClinicalClaimRisk >= 0.5) reasons.push("Không dùng typology để chẩn đoán hoặc khẳng định tình trạng lâm sàng.");
  if (review.unsupportedFactualClaimRisk >= 0.6) reasons.push("Bổ sung nguồn cho khẳng định thực chứng hoặc làm rõ đây là diễn giải cá nhân.");
  const status = severe >= 0.85 ? "REJECTED" : reasons.length ? "REVISION_REQUIRED" : "APPROVED";
  return { status, reasons: status === "APPROVED" ? [] : reasons } as {
    status: "APPROVED" | "REVISION_REQUIRED" | "REJECTED"; reasons: string[];
  };
}
