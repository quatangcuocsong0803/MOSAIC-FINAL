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
    const recent = await prisma.post.findMany({
      where: { moderationStatus: 'APPROVED', publishedAt: { not: null }, ...publicDiscussionPostAccessWhere },
      orderBy: { createdAt: 'desc' }, take: 24,
      select: { id: true, title: true, content: true, authorName: true, createdAt: true, likesCount: true, group: { select: { slug: true } }, _count: { select: { comments: { where: publicCommentWhere } } } },
    });
    const posts = recent.sort((a,b) => (b.likesCount * 2 + b._count.comments) - (a.likesCount * 2 + a._count.comments)).slice(0,3);
    return <><div className={styles.discussionList}>{posts.length ? posts.map(post => <Link key={post.id} className={styles.discussionItem} href={`${post.group ? `/discussion/groups/${post.group.slug}` : '/discussion'}#post-${post.id}`}><h3>{post.title}</h3><p>{post.content.slice(0,110)}{post.content.length > 110 ? '…' : ''}</p><small>{post.authorName} · {post._count.comments} bình luận · {new Intl.DateTimeFormat('vi-VN', { dateStyle:'short' }).format(post.createdAt)}</small></Link>) : <p className={styles.insightEmpty}>Chưa có bài thảo luận công khai. Khám phá các diễn đàn và bắt đầu một chủ đề.</p>}</div><Link href="/discussion" className={styles.panelLink}>Xem tất cả thảo luận →</Link></>;
  } catch {
    return <p className={styles.insightEmpty}>Chưa thể tải thảo luận. <Link href="/discussion">Mở diễn đàn →</Link></p>;
  }
}
export async function HomeStatistics() {
  const stats = await getStatisticsData();
  if (stats.dataUnavailable) return <p className={styles.insightEmpty}>Chưa thể tải số liệu. <Link href="/statistics">Mở Statistics →</Link></p>;
  const count = stats.mbtiDistribution.reduce((sum,row) => sum+row.count,0);
  const positive = stats.mbtiDistribution.filter(row => row.count > 0);
  const top = positive.slice(0,5).map(row => ({ label:row.type, count:row.count }));
  const other = positive.slice(5).reduce((sum,row) => sum+row.count,0);
  if (other) top.push({ label:'Khác', count:other });
  const percent = stats.totalUsers ? stats.testedUsersCount / stats.totalUsers : 0;
  return <Link href="/statistics" className={styles.homeStatsLink} aria-label="Xem toàn bộ biểu đồ Statistics">
    <div className={styles.homeStatsOverview}>
      <svg viewBox="0 0 120 120" role="img" aria-label={`${stats.testedUsersCount} trên ${stats.totalUsers} thành viên đã làm bài test`}><circle cx="60" cy="60" r="45" fill="none" stroke="#e7dcc7" strokeWidth="11" /><circle cx="60" cy="60" r="45" fill="none" stroke="#8b6b4a" strokeWidth="11" strokeDasharray={`${percent*282.743} 282.743`} transform="rotate(-90 60 60)" /><text x="60" y="63" textAnchor="middle" fontSize="21" fill="#5c4326">{Math.round(percent*100)}%</text><text x="60" y="79" textAnchor="middle" fontSize="9" fill="#847461">đã làm test</text></svg>
      <div><strong>{stats.totalUsers.toLocaleString('vi-VN')} thành viên</strong><p>{stats.testedUsersCount.toLocaleString('vi-VN')} người đã làm test</p><p>{stats.totalTestsCompleted.toLocaleString('vi-VN')} kết quả đã lưu</p></div>
    </div>
    <div className={styles.miniChart}><h3>Phân bố MBTI</h3><p>Mẫu được chia sẻ: {count} người</p>{count ? top.map(row => <div className={styles.miniBarRow} key={row.label}><span>{row.label}</span><div><i style={{ width:`${row.count/count*100}%` }} /></div><strong>{new Intl.NumberFormat('vi-VN',{maximumFractionDigits:1}).format(row.count/count*100)}% <small>({row.count})</small></strong></div>) : <p className={styles.insightEmpty}>Chưa có kết quả MBTI được đồng ý chia sẻ.</p>}</div>
    <span className={styles.statsCta}>Khám phá biểu đồ & đối chiếu →</span>
  </Link>;
}
