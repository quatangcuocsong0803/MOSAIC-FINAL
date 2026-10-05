// ============================================================
// MBTI Type Function Stacks
// ============================================================
// Defines the 4-function stack for each of the 16 MBTI types.
// Scoring logic: compare raw cognitive function scores against
// these stacks to determine the closest MBTI type match.
//
// Stack positions:
//   [0] dominant  — most developed, primary lens
//   [1] auxiliary — second, supportive function
//   [2] tertiary  — third, less developed
//   [3] inferior  — least conscious, area of growth
// ============================================================

import type { CognitiveFunctionCode } from "./cognitiveFunctions";

export type MbtiTypeCode =
  | "INTJ"
  | "INTP"
  | "ENTJ"
  | "ENTP"
  | "INFJ"
  | "INFP"
  | "ENFJ"
  | "ENFP"
  | "ISTJ"
  | "ISFJ"
  | "ESTJ"
  | "ESFJ"
  | "ISTP"
  | "ISFP"
  | "ESTP"
  | "ESFP";

export interface MbtiTypeStack {
  /** Four-letter MBTI type code */
  type: MbtiTypeCode;
  /** Ordered function stack: [dominant, auxiliary, tertiary, inferior] */
  stack: [
    CognitiveFunctionCode,
    CognitiveFunctionCode,
    CognitiveFunctionCode,
    CognitiveFunctionCode,
  ];
  dominant: CognitiveFunctionCode;
  auxiliary: CognitiveFunctionCode;
  tertiary: CognitiveFunctionCode;
  inferior: CognitiveFunctionCode;
}

const mbtiTypeStacks: Record<MbtiTypeCode, MbtiTypeStack> = {
  // ── Introverted iNtuition dominant ──────────────────────
  INTJ: {
    type: "INTJ",
    stack: ["Ni", "Te", "Fi", "Se"],
    dominant: "Ni",
    auxiliary: "Te",
    tertiary: "Fi",
    inferior: "Se",
  },
  INFJ: {
    type: "INFJ",
    stack: ["Ni", "Fe", "Ti", "Se"],
    dominant: "Ni",
    auxiliary: "Fe",
    tertiary: "Ti",
    inferior: "Se",
  },
  // ── Extraverted iNtuition dominant ──────────────────────
  ENTP: {
    type: "ENTP",
    stack: ["Ne", "Ti", "Fe", "Si"],
    dominant: "Ne",
    auxiliary: "Ti",
    tertiary: "Fe",
    inferior: "Si",
  },
  ENFP: {
    type: "ENFP",
    stack: ["Ne", "Fi", "Te", "Si"],
    dominant: "Ne",
    auxiliary: "Fi",
    tertiary: "Te",
    inferior: "Si",
  },
  // ── Introverted Sensing dominant ────────────────────────
  ISTJ: {
    type: "ISTJ",
    stack: ["Si", "Te", "Fi", "Ne"],
    dominant: "Si",
    auxiliary: "Te",
    tertiary: "Fi",
    inferior: "Ne",
  },
  ISFJ: {
    type: "ISFJ",
    stack: ["Si", "Fe", "Ti", "Ne"],
    dominant: "Si",
    auxiliary: "Fe",
    tertiary: "Ti",
    inferior: "Ne",
  },
  // ── Extraverted Sensing dominant ────────────────────────
  ESTP: {
    type: "ESTP",
    stack: ["Se", "Ti", "Fe", "Ni"],
    dominant: "Se",
    auxiliary: "Ti",
    tertiary: "Fe",
    inferior: "Ni",
  },
  ESFP: {
    type: "ESFP",
    stack: ["Se", "Fi", "Te", "Ni"],
    dominant: "Se",
    auxiliary: "Fi",
    tertiary: "Te",
    inferior: "Ni",
  },
  // ── Introverted Thinking dominant ───────────────────────
  INTP: {
    type: "INTP",
    stack: ["Ti", "Ne", "Si", "Fe"],
    dominant: "Ti",
    auxiliary: "Ne",
    tertiary: "Si",
    inferior: "Fe",
  },
  ISTP: {
    type: "ISTP",
    stack: ["Ti", "Se", "Ni", "Fe"],
    dominant: "Ti",
    auxiliary: "Se",
    tertiary: "Ni",
    inferior: "Fe",
  },
  // ── Extraverted Thinking dominant ───────────────────────
  ENTJ: {
    type: "ENTJ",
    stack: ["Te", "Ni", "Se", "Fi"],
    dominant: "Te",
    auxiliary: "Ni",
    tertiary: "Se",
    inferior: "Fi",
  },
  ESTJ: {
    type: "ESTJ",
    stack: ["Te", "Si", "Ne", "Fi"],
    dominant: "Te",
    auxiliary: "Si",
    tertiary: "Ne",
    inferior: "Fi",
  },
  // ── Introverted Feeling dominant ────────────────────────
  INFP: {
    type: "INFP",
    stack: ["Fi", "Ne", "Si", "Te"],
    dominant: "Fi",
    auxiliary: "Ne",
    tertiary: "Si",
    inferior: "Te",
  },
  ISFP: {
    type: "ISFP",
    stack: ["Fi", "Se", "Ni", "Te"],
    dominant: "Fi",
    auxiliary: "Se",
    tertiary: "Ni",
    inferior: "Te",
  },
  // ── Extraverted Feeling dominant ────────────────────────
  ENFJ: {
    type: "ENFJ",
    stack: ["Fe", "Ni", "Se", "Ti"],
    dominant: "Fe",
    auxiliary: "Ni",
    tertiary: "Se",
    inferior: "Ti",
  },
  ESFJ: {
    type: "ESFJ",
    stack: ["Fe", "Si", "Ne", "Ti"],
    dominant: "Fe",
    auxiliary: "Si",
    tertiary: "Ne",
    inferior: "Ti",
  },
};

export default mbtiTypeStacks;
