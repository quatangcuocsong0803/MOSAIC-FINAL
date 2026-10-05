import type { Metadata } from "next";
import LongformPage from "@/src/components/editorial/LongformPage";
import { theoryArticle } from "@/src/content/theoryArticle";

export const metadata: Metadata = {
  title: "Cơ sở lý thuyết của MOSAIC | MOSAIC",
  description: "Nền tảng lý thuyết, psychometrics và nguyên tắc diễn giải các framework typology trong MOSAIC.",
};

export default function TheoryPage() {
  return (
    <LongformPage
      article={theoryArticle}
      tone="gold"
      related={[
        {
          href: "/about",
          title: "Giới thiệu về MOSAIC",
          description: "Tổng quan về mục tiêu, cách tiếp cận và hệ sinh thái của nền tảng.",
        },
        {
          href: "/about/news",
          title: "Cập nhật tính năng",
          description: "Xem cách những nguyên tắc này được chuyển thành assessment, knowledge, profile và các module khác.",
        },
      ]}
    />
  );
}
