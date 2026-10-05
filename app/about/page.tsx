import type { Metadata } from "next";
import LongformPage from "@/src/components/editorial/LongformPage";
import { aboutArticle } from "@/src/content/aboutArticle";

export const metadata: Metadata = {
  title: "Giới thiệu về MOSAIC | MOSAIC",
  description: "Mục tiêu, cấu trúc và cách tiếp cận personality typology của MOSAIC.",
};

export default function AboutMosaicPage() {
  return (
    <LongformPage
      article={aboutArticle}
      tone="rose"
      related={[
        {
          href: "/knowledge/theory",
          title: "Cơ sở lý thuyết",
          description: "Đọc sâu hơn về MBTI, Cognitive Functions, Enneagram, Big Five và cách MOSAIC phân tầng bằng chứng.",
        },
        {
          href: "/about/news",
          title: "Cập nhật tính năng",
          description: "Theo dõi những thay đổi mới, module đang hoàn thiện và roadmap sản phẩm.",
        },
      ]}
    />
  );
}
