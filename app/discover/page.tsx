import Link from 'next/link';
import {getDiscoverUsers} from '@/app/actions/discover';
import DiscoverClient from './DiscoverClient';
import styles from './Discover.module.css';
export const metadata={title:'Khám phá & kết nối | MOSAIC',description:'Gặp những thành viên có kiểu nhận thức và mối quan tâm tương đồng trong cộng đồng MOSAIC.'};
export const dynamic='force-dynamic';
export default async function Page(){const data=await getDiscoverUsers();return <div className={styles.page}><header className={styles.hero}><span>MOSAIC / DISCOVER</span><h1>Mỗi người, một mảnh ghép</h1><p>Khám phá những điểm chung. Kết nối qua cách nhìn thế giới, sở thích và những cuộc trò chuyện.</p><div className={styles.heroLine}/></header>{data.success?<DiscoverClient initialUsers={data.users||[]}/>:<section className={styles.guest}><small>KHÁM PHÁ & KẾT NỐI</small><h2>{data.currentUserId?'Chưa tải được cộng đồng':'Gặp những mảnh ghép đồng điệu'}</h2><p>{data.currentUserId?'Vui lòng tải lại trang để thử lại.':'Đăng nhập để khám phá hồ sơ, tìm điểm chung và gửi lời mời kết bạn.'}</p>{!data.currentUserId&&<Link href="/sign-in?redirect_url=%2Fdiscover">Đăng nhập để khám phá →</Link>}<Link href="/discussion">Ghé thăm diễn đàn →</Link></section>}</div>;}
