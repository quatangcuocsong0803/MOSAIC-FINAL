"use client";
import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
export default function NavigationFeedback() {
  const pathname = usePathname();
  const query = useSearchParams().toString();
  const [pending, setPending] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const route = useRef({ pathname, query });
  useEffect(() => {
    route.current = { pathname, query };
    setPending(false);
    if (timer.current) clearTimeout(timer.current);
  }, [pathname, query]);
  useEffect(() => {
    const start = () => {
      setPending(true);
      if (timer.current) clearTimeout(timer.current);
      // Cancelled navigations must not leave a permanent progress indicator.
      // Actual server loading is represented independently by loading.tsx.
      timer.current = setTimeout(() => setPending(false), 12000);
    };
    const click = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.defaultPrevented) return;
      const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!(anchor instanceof HTMLAnchorElement) || anchor.hasAttribute('download') || anchor.target && anchor.target !== '_self') return;
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname && url.search === location.search) return;
      start();
    };
    const popstate = () => { if (location.pathname !== route.current.pathname || new URLSearchParams(location.search).toString() !== route.current.query) start(); };
    document.addEventListener('click', click, true);
    window.addEventListener('popstate', popstate);
    window.addEventListener('mosaic:navigation-start', start);
    return () => { document.removeEventListener('click', click, true); window.removeEventListener('popstate', popstate); window.removeEventListener('mosaic:navigation-start', start); if (timer.current) clearTimeout(timer.current); };
  }, []);
  return pending ? <div className="mosaic-navigation-feedback" role="status" aria-live="polite"><div className="mosaic-progress-bar" /><span className="mosaic-loading-badge"><i />Đang mở trang…</span></div> : null;
}
