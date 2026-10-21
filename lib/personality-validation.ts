const ALL_MBTI_TYPES = new Set([
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
]);

export const ENNEAGRAM_WINGS: Record<number, [number, number]> = {
  1: [9, 2],
  2: [1, 3],
  3: [2, 4],
  4: [3, 5],
  5: [4, 6],
  6: [5, 7],
  7: [6, 8],
  8: [7, 9],
  9: [8, 1],
};

const HEART_TYPES = new Set([2, 3, 4]);
const HEAD_TYPES = new Set([5, 6, 7]);
const GUT_TYPES = new Set([8, 9, 1]);

export function normalizeMbtiType(value: string): string | null {
  const normalized = value.trim().toUpperCase();

  return ALL_MBTI_TYPES.has(normalized) ? normalized : null;
}

export function normalizeEnneagramCore(value: string | number): number | null {
  if (typeof value === "number") {
    return Number.isInteger(value) && value >= 1 && value <= 9 ? value : null;
  }

  const normalized = value.trim().toUpperCase();

  const match = normalized.match(/^(?:TYPE\s*)?([1-9])$/);

  return match ? Number(match[1]) : null;
}

export function normalizeEnneagramWing(
  core: number,
  value: string,
): string | null {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, "");

  const match = normalized.match(/^([1-9])w([1-9])$/);

  if (!match) {
    return null;
  }

  const wingCore = Number(match[1]);
  const wing = Number(match[2]);

  if (wingCore !== core) {
    return null;
  }

  if (!ENNEAGRAM_WINGS[core]?.includes(wing)) {
    return null;
  }

  return `${core}w${wing}`;
}

/**
 * MOSAIC hiện tạo tritype theo thứ tự cố định:
 * Heart → Head → Gut.
 *
 * Ví dụ:
 * - Heart: 4
 * - Head: 5
 * - Gut: 8
 * => code canonical: "458"
 *
 * Core phải xuất hiện đúng tại center của nó.
 */
export function normalizeEnneagramTritype(
  core: number,
  value: string,
): string | null {
  const normalized = value.trim().replace(/\D/g, "");

  if (normalized.length !== 3) {
    return null;
  }

  const heart = Number(normalized[0]);
  const head = Number(normalized[1]);
  const gut = Number(normalized[2]);

  if (!HEART_TYPES.has(heart) || !HEAD_TYPES.has(head) || !GUT_TYPES.has(gut)) {
    return null;
  }

  if (HEART_TYPES.has(core) && heart !== core) {
    return null;
  }

  if (HEAD_TYPES.has(core) && head !== core) {
    return null;
  }

  if (GUT_TYPES.has(core) && gut !== core) {
    return null;
  }

  return `${heart}${head}${gut}`;
}

export function extractEnneagramCoreFromResult(raw: string): number | null {
  const match = raw.match(/[1-9]/);

  return match ? Number(match[0]) : null;
}

export function extractEnneagramWingFromText(
  core: number,
  raw: string,
): string | null {
  const match = raw.match(/\b([1-9])\s*[wW]\s*([1-9])\b/);

  if (!match) {
    return null;
  }

  return normalizeEnneagramWing(core, `${match[1]}w${match[2]}`);
}

export function extractEnneagramTritypeFromText(
  core: number,
  raw: string,
): string | null {
  // Ưu tiên code đúng format project: Heart → Head → Gut.
  const matches = raw.match(/\b[234][567][891]\b/g);

  if (!matches) {
    return null;
  }

  for (const candidate of matches) {
    const valid = normalizeEnneagramTritype(core, candidate);

    if (valid) {
      return valid;
    }
  }

  return null;
}
