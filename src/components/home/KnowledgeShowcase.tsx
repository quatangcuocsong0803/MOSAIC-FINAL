import Link from 'next/link';
import { mbtiCards, spriteTops } from '@/lib/home/type-cards';
import styles from '@/app/home.module.css';
export default function KnowledgeShowcase() {
  return <>
    <section className={styles.knowledgeSection} aria-labelledby="home-mbti-title">
      <div className={styles.sectionIntro}><div><p className={styles.sectionEyebrow}>THE KNOWLEDGE COLLECTION</p><h2 id="home-mbti-title">16 kiểu tính cách MBTI</h2><p>Mười sáu cách tiếp cận thế giới. Tìm hiểu sở thích nhận thức, function stack và những sắc thái phía sau bốn chữ cái.</p></div><Link href="/knowledge/mbti/overview" className={styles.sectionCta}>Tổng quan MBTI →</Link></div>
      <div className={styles.typeGrid}>{mbtiCards.map(type => <Link key={type.code} href={`/knowledge/mbti/${type.code}`} className={styles.typeCard} data-family={type.family}>
        <div className={styles.typePortrait}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/home/mbti-characters.jpg" alt={`Nhân vật minh họa ${type.code}`} loading="lazy" decoding="async" style={{ left:`-${type.column*100}%`, top:`-${spriteTops[type.row]/280*100}%` }} /></div>
        <div className={styles.typeCopy}><span className={styles.typeCode}>{type.code}</span><h3>{type.name}</h3><p>{type.summary}</p><span className={styles.typeCta}>Khám phá {type.code} →</span></div>
      </Link>)}</div>
      <p className={styles.collectionNote}>Những mô tả này là điểm bắt đầu để đọc về mô hình; một kiểu tính cách không bao quát toàn bộ con người bạn.</p>
    </section>
    <section className={styles.knowledgeSection} aria-labelledby="home-enneagram-title"><div className={styles.sectionIntro}><div><p className={styles.sectionEyebrow}>BEYOND THE FOUR LETTERS</p><h2 id="home-enneagram-title">Đi sâu hơn cùng Enneagram</h2><p>Khám phá động cơ, nhu cầu và những khuôn mẫu phản ứng phía sau hành vi.</p></div></div>
      <Link href="/knowledge/enneagram/overview" className={styles.enneagramCard}><div className={styles.enneagramImage}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/home/enneagram-symbol.jpg" alt="Biểu tượng Enneagram với chín điểm" loading="lazy" decoding="async" /></div><div className={styles.enneagramCopy}><span className={styles.sectionEyebrow}>NINE PATHS TO SELF-UNDERSTANDING</span><h3>Chín kiểu, nhiều tầng ý nghĩa</h3><p>Enneagram mô tả chín kiểu động cơ cốt lõi, cùng những góc nhìn về wing, bản năng và sự phát triển. Thư viện MOSAIC giúp bạn tìm hiểu từng khái niệm và đọc các kiểu trong bối cảnh của mô hình.</p><div className={styles.typeTags}>{Array.from({length:9},(_,i)=><span key={i}>Type {i+1}</span>)}</div><span className={styles.sectionCta}>Mở thư viện Enneagram →</span></div></Link>
    </section>
  </>;
}
