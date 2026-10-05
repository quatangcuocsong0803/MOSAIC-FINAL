import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kết quả MBTI | MOSAIC",
  description:
    "Báo cáo phân tích chuyên sâu về chức năng nhận thức, ngăn xếp nhận thức và mức độ phù hợp với 16 nhóm tính cách.",
};

export default function MbtiResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
