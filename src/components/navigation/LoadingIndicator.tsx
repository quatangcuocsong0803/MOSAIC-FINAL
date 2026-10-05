"use client";
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
export default function LoadingIndicator() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted ? createPortal(<div role="status" aria-live="polite"><div className="mosaic-progress-bar" /><span className="mosaic-loading-badge"><i />Đang tải nội dung…</span></div>, document.body) : null;
}
