import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { HomeDiscussion, HomeStatistics, InsightsSkeleton } from "@/src/components/home/HomeInsights";
import FeaturedCarousel from "@/src/components/home/FeaturedCarousel";
import KnowledgeShowcase from "@/src/components/home/KnowledgeShowcase";
import HomeFooter from "@/src/components/home/HomeFooter";
import HomeSearch from "@/src/components/home/HomeSearch";
import styles from "./home.module.css";

export const dynamic = "force-dynamic";

type CardKey = "about" | "theory" | "developer" | "exhibition";

type CardConfig = {
  title: string;
  image: string;
  href: string;
  copy: ReactNode;
  imageClassName?: string;
};

const cards: Record<CardKey, CardConfig> = {
  about: {
    title: "Giới thiệu MOSAIC",
    image: "/figma-home/about.png",
    href: "/about",
    copy: (
      <>
        Tìm hiểu về <em>mục tiêu</em>, <em>cách tiếp cận</em> và <em>cấu trúc</em> của nền tảng MOSAIC.
      </>
    ),
  },
  theory: {
    title: "Cơ sở lý thuyết",
    image: "/figma-home/theory.png",
    href: "/knowledge/theory",
    copy: (
      <>
        Tìm hiểu những <em>hệ thống, khái niệm</em> và <em>nguyên lý</em> được MOSAIC sử dụng để xây dựng.
      </>
    ),
  },
  developer: {
    title: "Về nhà phát triển",
    image: "/figma-home/developer.png",
    href: "/about/developer",
    imageClassName: styles.developerImage,
    copy: (
      <>
        Tìm hiểu về <em>người xây dựng MOSAIC</em>, quá trình phát triển dự án và những định hướng phía sau nền tảng.
      </>
    ),
  },
  exhibition: {
    title: "Triển lãm",
    image: "/figma-home/exhibition.png",
    href: "/about/exhibition",
    copy: <>Khám phá triển lãm nghệ thuật MOSAIC.</>,
  },
};

function EditorialCard({ card }: { card: CardConfig }) {
  return (
    <Link href={card.href} className={styles.editorialCard}>
      <div className={styles.cardImageWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={card.image} alt="" className={`${styles.cardImage} ${card.imageClassName ?? ""}`} decoding="async" />
      </div>
      <div className={styles.cardBody}>
        <h2>{card.title}</h2>
        <p>{card.copy}</p>
        <span className={styles.cardLink}>
          Xem thêm →
        </span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className={styles.pageShell}>
      <div className={styles.contentSurface}>
        <div className={styles.searchPosition}>
          <HomeSearch />
        </div>

        <section className={styles.portalFrame} aria-label="Khám phá MOSAIC">
          <div className={styles.portalGrid}>
            <div className={styles.sideColumn}>
              <EditorialCard card={cards.about} />
              <EditorialCard card={cards.theory} />
            </div>

            <FeaturedCarousel />

            <div className={styles.sideColumn}>
              <EditorialCard card={cards.developer} />
              <EditorialCard card={cards.exhibition} />
            </div>
          </div>
        </section>

        <Link href="/discover" className={styles.discoverBanner}>
          <div className={styles.discoverCopy}>
            <h2>Khám phá</h2>
            <h3>Tìm những người phù hợp với bạn</h3>
            <p>
              Dựa trên hồ sơ và kết quả của bạn, khám phá những người có điểm tương đồng về tính cách, sở thích và cách nhìn thế giới.
            </p>
            <span>Khám phá →</span>
          </div>
          <div className={styles.discoverImageWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/figma-home/discover.png" alt="" loading="lazy" decoding="async" />
          </div>
        </Link>

        <section className={styles.insightsFrame}>
          <article className={styles.discussionPanel}>
            <Link href="/discussion" className={styles.panelOverlay} aria-label="Mở trang Discussion" />
            <h2>Thảo luận nổi bật</h2>
            <Suspense fallback={<InsightsSkeleton />}><HomeDiscussion /></Suspense>
          </article>

          <article className={styles.statisticsPanel}>
            <Link href="/statistics" className={styles.panelOverlay} aria-label="Mở trang Statistics" />
            <h2>Thống kê mô tả</h2>
            <Suspense fallback={<InsightsSkeleton />}><HomeStatistics /></Suspense>
          </article>
        </section>
        <KnowledgeShowcase />
      </div>

      <HomeFooter />
    </div>
  );
}
