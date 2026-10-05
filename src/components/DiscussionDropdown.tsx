'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
export const discussionLinks = [
  { href:'/discussion', title:'Bảng thảo luận', description:'Các forum và bài viết cộng đồng' },
  { href:'/discussion/new', title:'Viết bài mới', description:'Soạn bài và bổ sung nguồn trích dẫn' },
  { href:'/discussion/drafts', title:'Bản nháp của tôi', description:'Tiếp tục những bài đang viết' },
  { href:'/discussion/reviews', title:'Trạng thái duyệt bài', description:'Kết quả duyệt, chỉnh sửa và gửi lại' },
  { href:'/discussion/groups', title:'Nhóm thảo luận', description:'Khám phá và tham gia các nhóm' },
  { href:'/discussion/groups/new', title:'Tạo nhóm', description:'Mở không gian thảo luận của bạn' },
];
export default function DiscussionDropdown({ active }: { active:boolean }) {
  const [open,setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false),[pathname]);
  return <div className={`${styles.navItemWithDropdown} ${styles.discussionItem}`} data-open={open}
    onMouseEnter={() => setOpen(true)}
    onMouseLeave={event => { if (!event.currentTarget.contains(document.activeElement)) setOpen(false); }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
    onKeyDown={event => { if (event.key === 'Escape') { setOpen(false); event.stopPropagation(); event.currentTarget.querySelector('button')?.focus(); } }}>
    <Link href="/discussion" className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}>Discussion</Link>
    <button type="button" className={styles.discussionToggle} aria-label="Các tính năng Discussion" aria-expanded={open} aria-controls="discussion-dropdown" onClick={() => setOpen(value => !value)}>▾</button>
    <div id="discussion-dropdown" className={styles.navDropdown} inert={!open}>
      <div className={styles.navDropdownPanel}>{discussionLinks.map(item => <Link key={item.href} href={item.href} className={styles.navDropdownLink} onClick={() => setOpen(false)}><span className={styles.navDropdownTitle}>{item.title}</span><span className={styles.navDropdownDescription}>{item.description}</span></Link>)}</div>
    </div>
  </div>;
}
