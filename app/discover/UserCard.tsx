"use client";
import Link from 'next/link';
import {useEffect,useState,useTransition} from 'react';
import {sendFriendRequest,respondFriendRequest,type DiscoverUserItem,type FriendStatus} from '@/app/actions/discover';
import styles from './Discover.module.css';
export default function UserCard({user,featured=false,onStatusChange}:{user:DiscoverUserItem;featured?:boolean;onStatusChange?:(id:string,status:FriendStatus)=>void}){
 const [status,setStatus]=useState<FriendStatus>(user.friendStatus);const [pending,start]=useTransition();const [feedback,setFeedback]=useState('');const [imageFailed,setImageFailed]=useState(false);
 useEffect(()=>{setStatus(user.friendStatus)},[user.friendStatus]);useEffect(()=>{setImageFailed(false)},[user.avatarUrl]);
 const name=user.username||`Thành viên #${user.id.slice(-4)}`;const initial=(name.trim()[0]||'M').toUpperCase();const hobbies=(user.hobbies||'').split(/[,;\n]/).map(h=>h.trim()).filter(Boolean).slice(0,5);
 function run(action:'send'|'accept'|'remove'){start(async()=>{setFeedback('');try{const result=action==='send'?await sendFriendRequest(user.id):await respondFriendRequest(user.id,action==='accept');if(result.success){const next:FriendStatus=action==='send'?'PENDING_SENT':action==='accept'?'FRIENDS':'NONE';setStatus(next);onStatusChange?.(user.id,next);}else setFeedback(result.error||'Chưa xử lý được. Vui lòng thử lại.');}catch{setFeedback('Chưa kết nối được. Vui lòng thử lại.');}});}
 return <article className={`${styles.card} ${featured?styles.featured:''}`}>
 <Link prefetch={false} href={`/profile/${user.id}`} className={styles.portrait} aria-label={`Xem hồ sơ ${name}`}><div className={styles.initial}>{initial}</div>{user.avatarUrl&&!imageFailed&&<img loading={featured?"eager":"lazy"} decoding="async" fetchPriority={featured?"high":"low"} src={user.avatarUrl} alt={name} onError={()=>setImageFailed(true)} className={styles.avatar}/>}<span className={styles.portraitLabel}>{user.isMatched?'Có điểm chung':'Mảnh ghép cộng đồng'}</span></Link>
 <div className={styles.cardBody}><div className={styles.nameRow}><div><h3><Link prefetch={false} href={`/profile/${user.id}`}>{name}</Link></h3><p>{user.location||'Thành viên MOSAIC'}</p></div>{status==='FRIENDS'&&<span className={styles.friendBadge}>Bạn bè</span>}</div>
 <div className={styles.types}>{user.testResults.length?user.testResults.map(t=><span key={t.id}>{t.resultName.replace(/^#/, '')}</span>):<span className={styles.unset}>Chưa chia sẻ kiểu</span>}</div>
 {user.bio&&<p className={styles.bio}>{user.bio}</p>}
 {hobbies.length>0&&<div className={styles.hobbies}>{hobbies.map((h,i)=><span key={i}>{h}</span>)}</div>}
 {user.commonTraits.length>0&&<div className={styles.common}><small>ĐIỂM CHUNG</small><p>{user.commonTraits.join(' · ')}</p></div>}
 {!user.bio&&!hobbies.length&&<p className={styles.bio}>Khám phá thêm những mảnh ghép qua trang cá nhân và các cuộc thảo luận.</p>}
 <div className={styles.actions}>{status==='NONE'&&<button disabled={pending} onClick={()=>run('send')}>＋ Kết bạn</button>}{status==='PENDING_SENT'&&<><span className={styles.sent}>Đã gửi lời mời</span><button className={styles.secondary} disabled={pending} onClick={()=>run('remove')}>Hủy lời mời</button></>}{status==='PENDING_RECEIVED'&&<><button disabled={pending} onClick={()=>run('accept')}>Chấp nhận</button><button className={styles.secondary} disabled={pending} onClick={()=>run('remove')}>Từ chối</button></>}{status==='FRIENDS'&&<button className={styles.secondary} disabled={pending} onClick={()=>{if(window.confirm(`Hủy kết bạn với ${name}?`))run('remove')}}>Hủy kết bạn</button>}<Link prefetch={false} href={`/profile/${user.id}`}>Xem hồ sơ →</Link></div><p className={styles.feedback} role="status">{pending?'Đang xử lý…':feedback}</p>
 </div></article>;
}
