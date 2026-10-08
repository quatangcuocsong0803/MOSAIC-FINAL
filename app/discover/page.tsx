import Link from 'next/link';
import {Suspense} from 'react';
import {getDiscoverUsers} from '@/app/actions/discover';
import type {DiscoverTab} from '@/lib/discover/query';
import DiscoverClient from './DiscoverClient';
import DiscoverLoading from './DiscoverLoading';
import styles from './Discover.module.css';
export const metadata={title:'Khám phá & kết nối | MOSAIC',description:'Gặp những thành viên có kiểu nhận thức và mối quan tâm tương đồng trong cộng đồng MOSAIC.'};
export const dynamic='force-dynamic';
async function Members({tab}:{tab:DiscoverTab}){
 const data=await getDiscoverUsers({tab});
 if(data.success)return <DiscoverClient initialData={data} initialTab={tab}/>;
 return <section className={styles.guest}><small>KHÁM PHÁ & KẾT NỐI</small><h2>{data.currentUserId?'Chưa tải được cộng đồng':'Gặp những mảnh ghép đồng điệu'}</h2><p>{data.currentUserId?data.error:'Đăng nhập để khám phá hồ sơ, tìm điểm chung và gửi lời mời kết bạn.'}</p>{!data.currentUserId&&<Link href="/sign-in?redirect_url=%2Fdiscover">Đăng nhập để khám phá →</Link>}<Link href="/discover">{data.currentUserId?'Thử tải lại →':'Mở lại Discover →'}</Link><Link href="/discussion">Ghé thăm diễn đàn →</Link></section>;
}
export default async function Page({searchParams}:{searchParams:Promise<{tab?:string}>}){const params=await searchParams;const tab:DiscoverTab=params.tab==='friends'?'friends':'suggested';return <div className={styles.page}><header className={styles.hero}><span>MOSAIC / DISCOVER</span><h1>Mỗi người, một mảnh ghép</h1><p>Khám phá những điểm chung. Kết nối qua cách nhìn thế giới, sở thích và những cuộc trò chuyện.</p><div className={styles.heroLine}/></header><Suspense fallback={<DiscoverLoading/>}><Members tab={tab}/></Suspense></div>;}
