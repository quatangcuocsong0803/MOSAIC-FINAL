// ============================================================
// Cognitive Functions Data
// ============================================================
// The 8 Jungian cognitive functions used in the MOSAIC test.
// Scores for these functions are calculated first,
// then compared against MBTI type stacks in mbtiTypeStacks.ts.
// ============================================================

export type CognitiveFunctionCode =
  | "Ni"
  | "Ne"
  | "Si"
  | "Se"
  | "Ti"
  | "Te"
  | "Fi"
  | "Fe";

export interface CognitiveFunction {
  /** Short code identifier, e.g. "Ni" */
  code: CognitiveFunctionCode;
  /** Full name, e.g. "Introverted Intuition" */
  name: string;
  /** One-sentence description of what this function does */
  description: string;
  /** Attitude: Introverted or Extraverted */
  attitude: "Introverted" | "Extraverted";
  /** Domain: Intuition, Sensing, Thinking, or Feeling */
  domain: "Intuition" | "Sensing" | "Thinking" | "Feeling";
}

const cognitiveFunctions: Record<CognitiveFunctionCode, CognitiveFunction> = {
  Ni: {
    code: "Ni",
    name: "Trực giác hướng nội",
    description:
      "Tập trung vào các quy luật, ý nghĩa sâu xa, mối liên kết và định hướng dài hạn tiềm ẩn sau các dữ kiện.",
    attitude: "Introverted",
    domain: "Intuition",
  },
  Ne: {
    code: "Ne",
    name: "Trực giác hướng ngoại",
    description:
      "Khám phá vô số khả năng, ý tưởng mới, các cách kiến giải và liên kết đa chiều từ thế giới bên ngoài.",
    attitude: "Extraverted",
    domain: "Intuition",
  },
  Si: {
    code: "Si",
    name: "Giác quan hướng nội",
    description:
      "Vận dụng kinh nghiệm quá khứ, dữ liệu tích lũy và những quy chuẩn quen thuộc để thấu hiểu hiện tại.",
    attitude: "Introverted",
    domain: "Sensing",
  },
  Se: {
    code: "Se",
    name: "Giác quan hướng ngoại",
    description:
      "Tập trung vào dữ kiện cụ thể, trải nghiệm thực tế ngay lúc này và những gì đang diễn ra trực tiếp trong môi trường.",
    attitude: "Extraverted",
    domain: "Sensing",
  },
  Ti: {
    code: "Ti",
    name: "Tư duy hướng nội",
    description:
      "Xây dựng hệ thống logic nhất quán từ nội tâm, phân tích cặn kẽ bản chất và cơ chế vận hành của sự vật.",
    attitude: "Introverted",
    domain: "Thinking",
  },
  Te: {
    code: "Te",
    name: "Tư duy hướng ngoại",
    description:
      "Tổ chức dữ liệu, nguồn lực và hành động một cách có hệ thống nhằm đạt hiệu quả và kết quả thực tế cao nhất.",
    attitude: "Extraverted",
    domain: "Thinking",
  },
  Fi: {
    code: "Fi",
    name: "Cảm xúc hướng nội",
    description:
      "Đánh giá tình huống dựa trên hệ giá trị cá nhân, tính chân thực và các nguyên tắc đạo đức nội tâm.",
    attitude: "Introverted",
    domain: "Feeling",
  },
  Fe: {
    code: "Fe",
    name: "Cảm xúc hướng ngoại",
    description:
      "Thấu hiểu nhu cầu của người khác, hướng tới giá trị chung, duy trì bầu không khí cảm xúc và sự hòa hợp xã hội.",
    attitude: "Extraverted",
    domain: "Feeling",
  },
};

export default cognitiveFunctions;
