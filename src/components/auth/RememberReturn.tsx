"use client";
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
export default function RememberReturn() {
 const path = usePathname();
 useEffect(() => { if (!/^\/(sign-in|sign-up)(\/|$)/.test(path)) {
  try { sessionStorage.setItem('mosaic-return-path', window.location.pathname + window.location.search + window.location.hash); } catch {}
 } }, [path]); return null;
}
