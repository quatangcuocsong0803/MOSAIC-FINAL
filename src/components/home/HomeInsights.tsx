import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getStatisticsData } from '@/app/actions/statistics';
import { publicDiscussionPostAccessWhere } from '@/lib/discussion/group-access';
import { publicCommentWhere } from '@/lib/discussion/comment-service';
import styles from '@/app/home.module.css';
export function InsightsSkeleton() {
  return <div className={styles.insightSkeleton} aria-label="Đang tải dữ liệu"><div /><div /><div /></div>;
}
export async function HomeDiscussion() {
  try {
    const publicPosts = { moderationStatus:'APPROVED' as const, publishedAt:{not:null}, ...publicDiscussionPostAccessWhere };
    const since = new Date(Date.now()-30*24*60*60*1000);
    const forums = await prisma.forum.findMany({
      where:{isActive:true,isSystem:true}, orderBy:{displayOrder:'asc'}, take:12,
      select:{ id:true,slug:true,name:true,description:true,shortLabel:true,displayOrder:true,
        _count:{select:{posts:{where:publicPosts}}},
        posts:{where:{...publicPosts,publishedAt:{gte:since}},orderBy:{publishedAt:'desc'},take:12,
          select:{id:true,title:true,likesCount:true,groupId:true,_count:{select:{comments:{where:publicCommentWhere}}}}},
      },
    });
    const ranked = forums.map(forum=>({...forum,activity:forum.posts.reduce((sum,post)=>sum+1+post.likesCount*2+post._count.comments,0)}))
      .sort((a,b)=>b.activity-a.activity || b._count.posts-a._count.posts || a.displayOrder-b.displayOrder).slice(0,4);
    return <><p className={styles.panelDescription}>Các diễn đàn do MOSAIC tạo, tổng hợp bài thảo luận và bài nhóm công khai đã được duyệt.</p><div className={styles.forumGrid}>{ranked.length ? ranked.map(forum=><article key={forum.id} className={styles.forumCard}>
      <div className={styles.forumMeta}><span>{forum.shortLabel || 'SYSTEM FORUM'}</span><small>{forum.activity>0?'Đang có hoạt động':'Khám phá diễn đàn'}</small></div>
      <Link href={`/discussion?forum=${encodeURIComponent(forum.slug)}`} className={styles.forumTitle}><h3>{forum.name}</h3></Link><p>{forum.description}</p>
      {forum.posts.length>0 && <div className={styles.forumTopics}>{forum.posts.slice(0,2).map(post=><Link key={post.id} href={`/discussion?forum=${encodeURIComponent(forum.slug)}#post-${post.id}`}><span>{post.title}</span><small>{post.groupId?'Bài nhóm công khai':'Thảo luận'} · {post._count.comments} bình luận</small></Link>)}</div>}
      <Link className={styles.forumVisit} href={`/discussion?forum=${encodeURIComponent(forum.slug)}`}>{forum._count.posts} bài công khai <span>Vào diễn đàn →</span></Link>
    </article>) : <p className={styles.insightEmpty}>Chưa có diễn đàn đang hoạt động.</p>}</div><p className={styles.dataNote}>Ưu tiên hoạt động từ tối đa 12 bài mới nhất mỗi diễn đàn trong 30 ngày. Đây là tín hiệu tương tác, không phải đánh giá độ tin cậy.</p><Link href="/discussion" className={styles.inlinePanelLink}>Khám phá tất cả diễn đàn →</Link></>;
  } catch { return <p className={styles.insightEmpty}>Chưa thể tải diễn đàn. <Link href="/discussion">Mở Discussion →</Link></p>; }
}
type MiniRow = { label:string;count:number };
function MiniBars({title,rows,href}:{title:string;rows:MiniRow[];href:string}) {
  const total=rows.reduce((sum,row)=>sum+row.count,0);
  const selected=[...rows].sort((a,b)=>b.count-a.count).filter(row=>row.count>0).slice(0,5);
  const other=total-selected.reduce((sum,row)=>sum+row.count,0);
  if(other>0)selected.push({label:'Khác',count:other});
  return <Link href={href} className={styles.miniStatCard}><h3>{title}</h3><p>{total.toLocaleString('vi-VN')} người trong mẫu chia sẻ</p>{total?selected.map(row=><div className={styles.compactBar} key={row.label}><span>{row.label}</span><div><i style={{width:`${row.count/total*100}%`}} /></div><strong>{Math.round(row.count/total*100)}%</strong></div>):<p className={styles.miniEmpty}>Chưa có dữ liệu được đồng ý chia sẻ.</p>}<span className={styles.miniStatCta}>Xem chi tiết →</span></Link>;
}
export async function HomeStatistics() {
  const stats=await getStatisticsData();
  if(stats.dataUnavailable)return <p className={styles.insightEmpty}>Chưa thể tải số liệu. <Link href="/statistics">Mở Statistics →</Link></p>;
  const percent=stats.totalUsers?stats.testedUsersCount/stats.totalUsers:0;
  const months=stats.monthlyActivity??[];
  const max=Math.max(1,...months.map(row=>row.mbti+row.enneagram+row.other));
  const totalEvents=months.reduce((n,row)=>n+row.mbti+row.enneagram+row.other,0);
  const points=months.map((row,index)=>`${30+index*300/Math.max(1,months.length-1)},${110-(row.mbti+row.enneagram+row.other)/max*80}`).join(' ');
  return <div className={styles.homeStatistics}>
    <p className={styles.panelDescription}>Một vài lát cắt từ cộng đồng. Các phân bố bên dưới chỉ sử dụng dữ liệu được đồng ý đóng góp.</p>
    <Link href="/statistics" className={styles.statsOverviewCard}><div className={styles.homeStatsOverview}><svg viewBox="0 0 120 120" role="img" aria-label={`${stats.testedUsersCount} trên ${stats.totalUsers} thành viên đã làm bài test`}><circle cx="60" cy="60" r="45" fill="none" stroke="#e7dcc7" strokeWidth="11"/><circle cx="60" cy="60" r="45" fill="none" stroke="#8b6b4a" strokeWidth="11" strokeDasharray={`${percent*282.743} 282.743`} transform="rotate(-90 60 60)"/><text x="60" y="65" textAnchor="middle" fontSize="23" fill="#5c4326">{Math.round(percent*100)}%</text></svg><div><strong>{stats.totalUsers.toLocaleString('vi-VN')} thành viên</strong><p>{stats.testedUsersCount.toLocaleString('vi-VN')} người đã làm test</p><p>{stats.totalTestsCompleted.toLocaleString('vi-VN')} kết quả đã lưu</p></div></div></Link>
    <div className={styles.homeStatsGrid}>
      <MiniBars title="Phân bố MBTI" rows={stats.mbtiDistribution.map(row=>({label:row.type,count:row.count}))} href="/statistics#mbti"/>
      <MiniBars title="Phân bố Enneagram" rows={stats.enneagramDistribution.map(row=>({label:row.type,count:row.count}))} href="/statistics#enneagram"/>
      <MiniBars title="Các nhóm tuổi" rows={stats.ageDistribution.map(row=>({label:row.label.replace(' tuổi',''),count:row.count}))} href="/statistics#age"/>
      <Link href="/statistics#activity" className={styles.miniStatCard}><h3>Nhịp hoạt động</h3><p>{totalEvents.toLocaleString('vi-VN')} kết quả chia sẻ trong 12 tháng</p>{totalEvents>0?<svg className={styles.activityPreview} viewBox="0 0 360 150" role="img" aria-label={months.map(row=>`${row.label}: ${row.mbti+row.enneagram+row.other} kết quả`).join('; ')}><line x1="30" x2="330" y1="110" y2="110" stroke="#ddcfb6"/><polyline points={points} stroke="#657d69" strokeWidth="3" fill="none"/>{months.map((row,index)=><circle key={row.month} cx={30+index*300/Math.max(1,months.length-1)} cy={110-(row.mbti+row.enneagram+row.other)/max*80} r="3" fill="#657d69"><title>{`${row.label}: ${row.mbti+row.enneagram+row.other} kết quả`}</title></circle>)}<text x="30" y="140" fontSize="13" fill="#79674f">{months[0]?.label}</text><text x="330" y="140" fontSize="13" textAnchor="end" fill="#79674f">{months[months.length-1]?.label}</text></svg>:<p className={styles.miniEmpty}>Chưa có kết quả chia sẻ trong khoảng thời gian này.</p>}<span className={styles.miniStatCta}>So sánh theo thời gian →</span></Link>
    </div><p className={styles.dataNote}>Mỗi biểu đồ có mẫu riêng. Dữ liệu mô tả cộng đồng MOSAIC, không đại diện cho dân số; biểu đồ hoạt động đếm lượt kết quả, không phải số người.</p><Link href="/statistics" className={styles.inlinePanelLink}>Mở bảng điều khiển Statistics →</Link>
  </div>;
}
