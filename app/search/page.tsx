import SearchTracker from '@/src/components/knowledge/SearchTracker';
import Link from 'next/link';
import type { Metadata } from 'next';
import HomeSearch from '@/src/components/home/HomeSearch';
import { findPages, searchPages } from '@/lib/search/pages';
import styles from './SearchResults.module.css';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title:'Tìm kiếm trong MOSAIC', description:'Tìm trang, bài test, chức năng Discussion và nội dung kiến thức MOSAIC.' };
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const params = await searchParams;
  const query = (typeof params.q === 'string' ? params.q : '').slice(0,100).trim();
  const matches = query ? findPages(query) : searchPages;
  return <div className={styles.page}><SearchTracker query={query}/>
    <header><span>MOSAIC · Tìm kiếm</span><h1>{query ? 'Kết quả tìm kiếm' : 'Các trang & chức năng'}</h1><p>{query ? `${matches.length} kết quả cho “${query}”` : 'Tìm tên bài test, trang kiến thức hoặc chức năng bạn muốn sử dụng.'}</p></header>
    <div className={styles.search}><HomeSearch key={query} initialQuery={query} wide /></div>
    {matches.length ? <div className={styles.grid}>{matches.map(item => <Link href={item.href} key={`${item.href}-${item.label}`} className={styles.result}><span>{item.category}</span><h2>{item.label}</h2><p>{item.description}</p><small>Mở trang →</small></Link>)}</div> : <div className={styles.empty}><h2>Chưa tìm thấy trang phù hợp</h2><p>Thử từ khóa ngắn hơn hoặc các tên như “MBTI”, “test AI”, “bản nháp”, “nhóm”, “Ni”. Bạn có thể tìm bằng tiếng Việt có dấu hoặc không dấu.</p><Link href="/search">Xem tất cả trang →</Link></div>}
  </div>;
}
