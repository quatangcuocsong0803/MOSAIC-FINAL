"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "@/app/home.module.css";

const slides = [
  {
    kind: "update",
    eyebrow: "UPDATE FEATURES",
    title: "MOSAIC có gì mới?",
    description:
      "Khám phá những thay đổi mới nhất trong hệ thống bài test, kết quả và các tính năng đang được phát triển.",
    image: "/figma-home/featured.png",
    href: "/about/news",
  },
  {
    kind: "letter",
    eyebrow: "Hồi âm từ bầu trời",
    title: "",
    description:
      "Mỗi góp ý là một lời hồi âm. Chia sẻ điều bạn muốn MOSAIC làm tốt hơn — từ một chi tiết nhỏ đến một ý tưởng mới.",
    image: "/figma-home/featured-2.jpg",
    href: "/feedback",
  },
  {
    kind: "author",
    eyebrow: "Về góc nhìn của tác giả",
    title: "Liệu con người có thích bị định nghĩa bởi thứ gì không?",
    description:
      "Cô ấy nói bản thân mỗi người đều là một phiên bản duy nhất, họ lại nói mỗi người đều cần cảm giác thuộc về một nhóm người nào đó, điều này khiến tôi đặt ra câu hỏi, rốt cuộc nhu cầu định nghĩa bản thân của con người là thế nào...",
    image: "/figma-home/featured-3.jpg",
    href: "/discussion",
  },
] as const;

export default function FeaturedCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches || document.documentElement.dataset.reducedMotion === 'true');
    update();
    media.addEventListener('change', update);
    window.addEventListener('mosaic-display-changed', update);
    return () => { media.removeEventListener('change', update); window.removeEventListener('mosaic-display-changed', update); };
  }, []);
  useEffect(() => {
    if (paused || reduced) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [paused, reduced]);

  const slide = slides[index];

  return (
    <article
      className={`${styles.featureCard} ${styles[`featureCard_${slide.kind}`]}`}
      aria-label="Nội dung nổi bật"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
    >
      <Link href={slide.href} className={styles.featureCardLink}>
      <p className={styles.featureEyebrow}>{slide.eyebrow}</p>

      <div className={styles.featureImageWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={slide.image} alt="" className={styles.featureImage} />
      </div>

      <div className={styles.featureCopy}>
        {slide.title && <h2>{slide.title}</h2>}
        <p>{slide.description}</p>
        <span className={styles.readLink}>
          Đọc tiếp →
        </span>
      </div>

      </Link>
      <div className={styles.carouselControls} aria-label="Điều khiển nội dung nổi bật">
        <div className={styles.dots}>
          {slides.map((item, dotIndex) => (
            <button
              key={`${item.kind}-${dotIndex}`}
              type="button"
              className={dotIndex === index ? styles.dotActive : styles.dot}
              onClick={() => setIndex(dotIndex)}
              aria-label={`Xem nội dung ${dotIndex + 1}`}
              aria-current={dotIndex === index ? "true" : undefined}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
