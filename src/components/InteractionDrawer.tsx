"use client";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './InteractionDrawer.module.css';
const links = [
  ['/discover?tab=friends', 'Bạn bè'], ['/profile#moments', 'Khoảnh khắc của tôi'],
  ['/discussion/groups', 'Cộng đồng'], ['/friends/birthdays', 'Sinh nhật bạn bè'],
  ['/discover', 'Khám phá kết nối'], ['/settings', 'Cài đặt'],
];
export default function InteractionDrawer() {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const path = usePathname();
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    const modal = dialog.current, button = trigger.current;
    if (open) {
      modal?.showModal();
      const overflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { modal?.close(); document.body.style.overflow = overflow; button?.focus(); };
    }
  }, [open]);
  return <>
    <button ref={trigger} type="button" className={styles.trigger} aria-label="Mở menu tương tác" aria-expanded={open} aria-controls="interaction-menu" onClick={() => setOpen(true)}>
      <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
    </button>
    <dialog ref={dialog} id="interaction-menu" className={styles.drawer} onCancel={() => setOpen(false)} onClick={event => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) setOpen(false);
    }} aria-labelledby="interaction-title">
      <div className={styles.heading}><h2 id="interaction-title">Không gian của bạn</h2><button autoFocus aria-label="Đóng menu" onClick={() => setOpen(false)}>×</button></div>
      <nav aria-label="Điều hướng tương tác">{links.map(([href, label]) => <Link key={href} href={href} prefetch={false} onClick={() => setOpen(false)}>{label}</Link>)}</nav>
    </dialog>
  </>;
}
