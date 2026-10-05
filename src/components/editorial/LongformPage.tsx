import Link from "next/link";
import type { ArticleBlock, ArticleDocument } from "@/src/content/articleTypes";
import styles from "./LongformPage.module.css";

type RelatedPage = {
  href: string;
  title: string;
  description: string;
};

type LongformPageProps = {
  article: ArticleDocument;
  tone?: "rose" | "gold" | "charcoal";
  related: RelatedPage[];
};

function countWords(article: ArticleDocument) {
  const parts = [
    article.title,
    article.subtitle,
    ...article.intro,
    ...article.blocks.flatMap((block) => {
      if (block.type === "heading" || block.type === "paragraph" || block.type === "quote" || block.type === "reference") {
        return [block.text];
      }
      if (block.type === "definition") return [block.title, block.text];
      return block.items;
    }),
  ];

  return parts.join(" ").trim().split(/\s+/).filter(Boolean).length;
}

function renderBlock(block: ArticleBlock, index: number) {
  switch (block.type) {
    case "heading":
      return block.level === 3 ? (
        <h3 id={block.id} className={styles.subheading} key={`${block.id}-${index}`}>
          {block.text}
        </h3>
      ) : (
        <h2 id={block.id} className={styles.sectionHeading} key={`${block.id}-${index}`}>
          {block.text}
        </h2>
      );

    case "list":
      return (
        <ul className={styles.list} key={`list-${index}`}>
          {block.items.map((item, itemIndex) => (
            <li key={`${itemIndex}-${item}`}>{item}</li>
          ))}
        </ul>
      );

    case "quote":
      return (
        <blockquote className={styles.quote} key={`quote-${index}`}>
          {block.text}
        </blockquote>
      );

    case "stack":
      return (
        <div className={styles.stack} key={`stack-${index}`}>
          {block.items.map((item, itemIndex) => (
            <span key={`${itemIndex}-${item}`}>{item}</span>
          ))}
        </div>
      );

    case "definition":
      return (
        <div className={styles.definition} key={`definition-${index}`}>
          <strong>{block.title}</strong>
          <p>{block.text}</p>
        </div>
      );

    case "reference":
      return (
        <p className={styles.reference} key={`reference-${index}`}>
          {block.text}
          {block.url ? (
            <>
              {" "}
              <a href={block.url} target="_blank" rel="noreferrer">
                Mở nguồn ↗
              </a>
            </>
          ) : null}
        </p>
      );

    case "paragraph":
      return (
        <p className={styles.paragraph} key={`paragraph-${index}`}>
          {block.text}
        </p>
      );
  }
}

export default function LongformPage({ article, tone = "gold", related }: LongformPageProps) {
  const toc = article.blocks.filter((block): block is Extract<ArticleBlock, { type: "heading" }> => block.type === "heading");
  const readingMinutes = Math.max(1, Math.round(countWords(article) / 220));

  return (
    <div className={`${styles.page} ${styles[tone]}`}>
      <div className={styles.paper}>
        <div className={styles.breadcrumbs}>
          <Link href="/">Trang chủ</Link>
          <span>·</span>
          <span>{article.title}</span>
        </div>

        <header className={styles.hero}>
          <p className={styles.eyebrow}>{article.eyebrow}</p>
          <h1>{article.title}</h1>
          <p className={styles.subtitle}>{article.subtitle}</p>
          <div className={styles.heroMeta}>
            <span>{readingMinutes} phút đọc</span>
            <span>{toc.length} mục</span>
          </div>
        </header>

        <section className={styles.highlights} aria-label="Tóm tắt nội dung">
          {article.highlights.map((item) => (
            <article key={item.label} className={styles.highlightCard}>
              <h2>{item.label}</h2>
              <p>{item.text}</p>
            </article>
          ))}
        </section>

        <div className={styles.layout}>
          <aside className={styles.toc} aria-label="Mục lục">
            <p className={styles.tocLabel}>Mục lục</p>
            <nav>
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={item.level === 3 ? styles.tocSubLink : styles.tocLink}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </aside>

          <article className={styles.article}>
            <div className={styles.intro}>
              {article.intro.map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
              ))}
            </div>

            <div className={styles.rule} aria-hidden="true" />
            {article.blocks.map(renderBlock)}
          </article>
        </div>

        <section className={styles.related}>
          <div>
            <p className={styles.relatedEyebrow}>Đọc tiếp trong MOSAIC</p>
            <h2>Các trang liên quan</h2>
          </div>
          <div className={styles.relatedGrid}>
            {related.map((item) => (
              <Link href={item.href} key={item.href} className={styles.relatedCard}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span>Xem trang →</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
