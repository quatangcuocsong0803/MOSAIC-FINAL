'use client';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {getDiscoverUsers,type GetDiscoverUsersResponse,type FriendStatus} from '@/app/actions/discover';
import type {DiscoverTab} from '@/lib/discover/query';
import UserCard from './UserCard';
import DiscoverLoading from './DiscoverLoading';
import styles from './Discover.module.css';
const TYPES=['INFJ','ENFJ','ENFP','INFP','INTJ','ENTJ','ENTP','INTP','ISTJ','ESTJ','ESFJ','ISFJ','ISTP','ESTP','ESFP','ISFP',...Array.from({length:9},(_,i)=>`Type ${i+1}`)];
export default function DiscoverClient({initialData}:{initialData:GetDiscoverUsersResponse}){
 const [data,setData]=useState(initialData);const [query,setQuery]=useState('');const [tab,setTab]=useState<DiscoverTab>('suggested');const [type,setType]=useState('');const [cursor,setCursor]=useState(0);
 const [loading,setLoading]=useState(false);const [loadingMore,setLoadingMore]=useState(false);const [error,setError]=useState('');const [retry,setRetry]=useState(0);
 const generation=useRef(0);const moreBusy=useRef(false);const lastKey=useRef('suggested|||0');
 const trimmedQuery=query.trim();
 const key=`${tab}|${trimmedQuery}|${type}|${retry}`;
 useEffect(()=>{
   if(lastKey.current===key)return;
   lastKey.current=key;const run=++generation.current;setLoading(true);setLoadingMore(false);moreBusy.current=false;setError('');setCursor(0);
   const timer=setTimeout(()=>{
     getDiscoverUsers({tab,query:trimmedQuery,type}).then(result=>{if(run!==generation.current)return;if(result.success)setData(result);else{setData({success:false,users:[]});setError(result.error||'Chưa tải được danh sách.');}}).catch(()=>{if(run===generation.current){setData({success:false,users:[]});setError('Chưa tải được danh sách. Vui lòng thử lại.');}}).finally(()=>{if(run===generation.current)setLoading(false);});
   },trimmedQuery?250:0);
   return ()=>{clearTimeout(timer);generation.current++;};
 },[key,tab,trimmedQuery,type]);
 const users=data.users;const visible=tab==='requests'?users.filter(u=>u.friendStatus==='PENDING_RECEIVED'):users;
 const index=Math.min(cursor,Math.max(0,visible.length-1));const active=visible[index];const rest=visible.filter(u=>u.id!==active?.id);
 function updateStatus(id:string,status:FriendStatus){setData(old=>({...old,users:old.users.map(u=>u.id===id?{...u,friendStatus:status}:u)}));}
 function choose(next:DiscoverTab){setTab(next);setCursor(0);}
 async function more(){
   if(moreBusy.current||loading||!data.hasMore||!data.nextCursor)return;
   moreBusy.current=true;setLoadingMore(true);setError('');const run=generation.current;
   try{const result=await getDiscoverUsers({tab,query:query.trim(),type,after:data.nextCursor});if(run!==generation.current)return;
     if(!result.success){setError(result.error||'Chưa tải thêm được hồ sơ.');return;}
     setData(old=>({...result,users:[...new Map([...old.users,...result.users].map(u=>[u.id,u])).values()]}));
   }catch{if(run===generation.current)setError('Chưa tải thêm được hồ sơ. Vui lòng thử lại.');}
   finally{if(run===generation.current){moreBusy.current=false;setLoadingMore(false);}}
 }
 return <div className={styles.discoverGrid}><aside className={styles.sidebar}><small>KHÔNG GIAN KẾT NỐI</small><nav aria-label="Danh mục Discover"><button aria-pressed={tab==='suggested'} onClick={()=>choose('suggested')}>Gợi ý cho bạn</button><button aria-pressed={tab==='community'} onClick={()=>choose('community')}>Cộng đồng</button><button aria-pressed={tab==='requests'} onClick={()=>choose('requests')}>Lời mời nhận được</button></nav><div className={styles.sidebarNote}><span>PERSONALITY IN PIECES.</span><h2>Bắt đầu từ một điểm chung</h2><p>Ghé thăm hồ sơ, tìm sở thích đồng điệu và gửi một lời mời kết bạn.</p><Link prefetch={false} href="/profile">Chỉnh sửa mảnh ghép của bạn →</Link></div><Link href="/discussion" className={styles.discussionLink}>Gặp nhau qua thảo luận ↗</Link></aside>
 <div className={styles.main}><div className={styles.filters}><label className={styles.searchLabel}><span>Tìm thành viên</span><input value={query} onChange={e=>{setQuery(e.target.value);setCursor(0)}} placeholder="MID 7 chữ số, tên hoặc username…" maxLength={100}/></label><label><span>Kiểu đã chia sẻ</span><select value={type} onChange={e=>{setType(e.target.value);setCursor(0)}}><option value="">Tất cả kiểu</option>{TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></label>{(query||type)&&<button className={styles.clear} onClick={()=>{setQuery('');setType('');setCursor(0)}}>Xóa bộ lọc</button>}</div>
 <div className={styles.sectionHeading}><div><small>DISCOVER</small><h2>{tab==='suggested'?'Những mảnh ghép có điểm chung':tab==='requests'?'Lời mời đang chờ bạn':'Khám phá cộng đồng'}</h2></div>{!loading&&<span aria-live="polite">{visible.length}{data.hasMore?'+':''} hồ sơ</span>}</div>
 {loading?<DiscoverLoading/>:active?<><div className={styles.featureStage}><UserCard key={active.id} user={active} featured onStatusChange={updateStatus}/><div className={styles.pager}><button disabled={index===0} onClick={()=>setCursor(index-1)} aria-label="Hồ sơ trước">←</button><span aria-live="polite">{index+1} / {visible.length}{data.hasMore?'+':''}</span><button disabled={index>=visible.length-1} onClick={()=>setCursor(index+1)} aria-label="Hồ sơ tiếp theo">→</button></div></div>{rest.length>0&&<section className={styles.more}><h2>Tiếp tục khám phá</h2><div className={styles.cards}>{rest.map(u=><UserCard key={u.id} user={u} onStatusChange={updateStatus}/>)}</div></section>}</>:!error&&<div className={styles.empty}><span>✧</span><h3>{query||type?'Chưa tìm thấy thành viên phù hợp':tab==='requests'?'Bạn chưa có lời mời mới':tab==='suggested'?'Chưa có gợi ý cùng kiểu':'Cộng đồng đang chờ những mảnh ghép mới'}</h3><p>{query||type?'Thử một từ khóa khác hoặc bỏ bớt bộ lọc.':tab==='suggested'?'Cập nhật kiểu trên hồ sơ hoặc khám phá những thành viên khác trong cộng đồng.':'Bạn có thể ghé diễn đàn để bắt đầu một cuộc trò chuyện.'}</p>{tab!=='community'&&<button onClick={()=>choose('community')}>Khám phá cộng đồng →</button>}<Link prefetch={false} href="/profile">Mở hồ sơ của bạn</Link></div>}
 {error&&<div className={styles.feedback} role="alert">{error} <button onClick={()=>data.hasMore?void more():setRetry(r=>r+1)}>Thử lại</button></div>}
 {!loading&&data.hasMore&&<div className={styles.pager}><button className={styles.loadMore} disabled={loadingMore} onClick={()=>void more()}>{loadingMore?'Đang tải…':'Xem thêm hồ sơ'}</button></div>}
 </div></div>;
}
