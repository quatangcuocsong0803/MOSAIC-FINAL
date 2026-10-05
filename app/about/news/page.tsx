import type { Metadata } from "next";
import LongformPage from "@/src/components/editorial/LongformPage";
import { updateArticle } from "@/src/content/updateArticle";

export const metadata: Metadata = {
  title: "Cập nhật tính năng | MOSAIC",
  description: "Những thay đổi mới, tính năng đang phát triển và roadmap của MOSAIC.",
};

export default function ProductUpdatesPage() {
  return (
    <LongformPage
      article={updateArticle}
      tone="charcoal"
      related={[
        {
          href: "/about",
          title: "Giới thiệu về MOSAIC",
          description: "Hiểu vì sao các module của MOSAIC được xây dựng và chúng kết nối với nhau như thế nào.",
        },
        {
          href: "/knowledge/theory",
          title: "Cơ sở lý thuyết",
          description: "Đọc nền tảng lý thuyết và các nguyên tắc đứng sau scoring, assessment và cách diễn giải kết quả.",
        },
      ]}
    />
  );
}
