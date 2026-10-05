// ============================================================
// MBTI 4-Group Color Palette and Classification System
// ============================================================
// 4 nhóm tính cách MBTI với tông màu vintage nhẹ nhàng,
// hài hòa với nền be và phong cách Art Nouveau của MOSAIC.
// Đảm bảo tương phản màu chữ / nền đạt chuẩn WCAG AA (>= 4.5:1).
// ============================================================

export type MbtiGroupId = "analyst" | "diplomat" | "sentinel" | "explorer";

export interface MbtiGroupConfig {
  id: MbtiGroupId;
  name: string; // Tên tiếng Việt
  englishName: string;
  types: readonly string[];
  dotColor: string; // Màu chấm tròn chú thích
  bg: string; // Nền khối thường
  border: string; // Viền khối thường
  text: string; // Màu chữ và số thứ tự / tỉ lệ %
  topBg: string; // Nền khi đứng top #1
  topBorder: string; // Viền khi đứng top #1
  hoverBg: string; // Nền khi hover
}

export const MBTI_GROUPS: Record<MbtiGroupId, MbtiGroupConfig> = {
  analyst: {
    id: "analyst",
    name: "Nhà phân tích",
    englishName: "Analyst",
    types: ["INTJ", "INTP", "ENTJ", "ENTP"],
    dotColor: "#9D7EA4",
    bg: "#E4DAE4",
    border: "#BFA9C0",
    text: "#5E4563",
    topBg: "#C9B3CB",
    topBorder: "#A386A6",
    hoverBg: "#D8CBD8",
  },
  diplomat: {
    id: "diplomat",
    name: "Nhà ngoại giao",
    englishName: "Diplomat",
    types: ["INFJ", "INFP", "ENFJ", "ENFP"],
    dotColor: "#7A966F",
    bg: "#DCE5D6",
    border: "#AEBFA3",
    text: "#4A5E3F",
    topBg: "#BFD0B3",
    topBorder: "#92A784",
    hoverBg: "#D0DDC9",
  },
  sentinel: {
    id: "sentinel",
    name: "Người gác đền",
    englishName: "Sentinel",
    types: ["ISTJ", "ISFJ", "ESTJ", "ESFJ"],
    dotColor: "#588E93",
    bg: "#D6E6E6",
    border: "#A3C2C4",
    text: "#2F5A5E",
    topBg: "#B3D3D5",
    topBorder: "#7FA8AB",
    hoverBg: "#C8DFDF",
  },
  explorer: {
    id: "explorer",
    name: "Nhà thám hiểm",
    englishName: "Explorer",
    types: ["ISTP", "ISFP", "ESTP", "ESFP"],
    dotColor: "#B59E47",
    bg: "#F2E6BF",
    border: "#D9C57E",
    text: "#6B5A1E",
    topBg: "#E8D48F",
    topBorder: "#BAA24E",
    hoverBg: "#EBDC9F",
  },
};

export const MBTI_GROUPS_LIST: MbtiGroupConfig[] = [
  MBTI_GROUPS.analyst,
  MBTI_GROUPS.diplomat,
  MBTI_GROUPS.sentinel,
  MBTI_GROUPS.explorer,
];

const TYPE_TO_GROUP: Record<string, MbtiGroupId> = {
  INTJ: "analyst",
  INTP: "analyst",
  ENTJ: "analyst",
  ENTP: "analyst",

  INFJ: "diplomat",
  INFP: "diplomat",
  ENFJ: "diplomat",
  ENFP: "diplomat",

  ISTJ: "sentinel",
  ISFJ: "sentinel",
  ESTJ: "sentinel",
  ESFJ: "sentinel",

  ISTP: "explorer",
  ISFP: "explorer",
  ESTP: "explorer",
  ESFP: "explorer",
};

/**
 * Lấy cấu hình nhóm màu theo mã MBTI (ví dụ: 'ISFP' -> explorer)
 */
export function getMbtiGroup(type: string): MbtiGroupConfig {
  const normalized = (type || "").toUpperCase().trim();
  const groupId = TYPE_TO_GROUP[normalized] || "analyst";
  return MBTI_GROUPS[groupId];
}

/**
 * Lấy style áp dụng trực tiếp cho khối kiểu MBTI
 * @param type Mã MBTI (VD: 'ISFP')
 * @param isTop Có phải là kết quả phù hợp nhất (#1) không
 */
export function getMbtiCardStyle(type: string, isTop = false): React.CSSProperties {
  const group = getMbtiGroup(type);
  return {
    backgroundColor: isTop ? group.topBg : group.bg,
    borderColor: isTop ? group.topBorder : group.border,
    color: group.text,
  };
}
