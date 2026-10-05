export const POST_KINDS = [
  "EMPIRICAL_EVIDENCE",
  "ESTABLISHED_THEORY",
  "INTERPRETATION",
  "QUESTION",
] as const;

export type DiscussionPostKind =
  (typeof POST_KINDS)[number];

export const CITATION_SOURCE_TYPES = [
  "PEER_REVIEWED",
  "ACADEMIC_BOOK",
  "PRIMARY_THEORY",
  "PROFESSIONAL_ORGANIZATION",
  "SECONDARY_REFERENCE",
  "COMMUNITY_SOURCE",
] as const;

export type DiscussionCitationSourceType =
  (typeof CITATION_SOURCE_TYPES)[number];

export type DiscussionForumPolicy =
  | "STANDARD"
  | "STRICT_RESEARCH"
  | "META_LIGHT";

export const POST_KIND_LABELS: Record<
  DiscussionPostKind,
  string
> = {
  EMPIRICAL_EVIDENCE:
    "Empirical Evidence",
  ESTABLISHED_THEORY:
    "Established Theory",
  INTERPRETATION:
    "Interpretation / Analysis",
  QUESTION:
    "Question / Discussion",
};

export const POST_KIND_DESCRIPTIONS: Record<
  DiscussionPostKind,
  string
> = {
  EMPIRICAL_EVIDENCE:
    "Lập luận dựa trên nghiên cứu, dữ liệu hoặc bằng chứng thực nghiệm.",

  ESTABLISHED_THEORY:
    "Thảo luận các khái niệm từ nguồn lý thuyết gốc hoặc tài liệu có thẩm quyền.",

  INTERPRETATION:
    "Phân tích hoặc cách diễn giải của tác giả dựa trên nền tảng typology.",

  QUESTION:
    "Đặt câu hỏi có phạm vi rõ ràng để cộng đồng phân tích và thảo luận.",
};

export const SOURCE_TYPE_LABELS: Record<
  DiscussionCitationSourceType,
  string
> = {
  PEER_REVIEWED:
    "Peer-reviewed paper",

  ACADEMIC_BOOK:
    "Academic book",

  PRIMARY_THEORY:
    "Primary theoretical source",

  PROFESSIONAL_ORGANIZATION:
    "Professional organization",

  SECONDARY_REFERENCE:
    "Secondary reference",

  COMMUNITY_SOURCE:
    "Community source",
};

export function getMinimumCitationCount(
  kind: DiscussionPostKind,
  policy: DiscussionForumPolicy,
) {
  if (policy === "STRICT_RESEARCH") {
    if (kind === "QUESTION") {
      return 1;
    }

    return 2;
  }

  if (policy === "META_LIGHT") {
    if (
      kind === "EMPIRICAL_EVIDENCE" ||
      kind === "ESTABLISHED_THEORY"
    ) {
      return 1;
    }

    return 0;
  }

  if (kind === "QUESTION") {
    return 0;
  }

  return 1;
}

export function getMinimumContentLength(
  kind: DiscussionPostKind,
) {
  if (kind === "QUESTION") {
    return 60;
  }

  return 120;
}
