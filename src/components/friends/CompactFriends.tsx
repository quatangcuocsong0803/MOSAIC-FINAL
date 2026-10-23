"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
type Friend = { id: string; username: string | null; avatarUrl: string | null; mutualCount: number };
export default function FriendsList() {
  const [users, setUsers] = useState<Friend[]>([]);
  const [next, setNext] = useState<string>();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  async function load(cursor?: string) {
    setLoading(true); setError('');
    try {
      const response = await fetch(`/api/friends${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`, { cache: 'no-store' });
      if (!response.ok) throw Error();
      const data = await response.json();
      setUsers(previous => cursor ? [...previous, ...data.users] : data.users); setNext(data.next);
    } catch { setError('Chưa tải được bạn bè.'); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/friends', { cache: 'no-store', signal: controller.signal }).then(async response => {
      if (!response.ok) throw Error();
      const data = await response.json();
      if (!controller.signal.aborted) { setUsers(data.users); setNext(data.next); setLoading(false); }
    }).catch(() => { if (!controller.signal.aborted) { setError('Chưa tải được bạn bè.'); setLoading(false); } });
    return () => controller.abort();
  }, []);
  return <section id="friends" className="mosaic-profile-card scroll-mt-24">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-serif text-2xl">Bạn bè</h2><Link href="/discover?tab=friends" className="underline">Xem tất cả →</Link></div>
    {error && <p role="alert">{error} <button className="underline" onClick={() => void load()}>Thử lại</button></p>}
    {loading && !users.length && <p role="status" className="py-4">Đang tải bạn bè…</p>}
    {!loading && !error && !users.length && <p className="py-4">Kết nối thêm những người bạn mới tại Discover.</p>}
    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{users.map(friend => <Link key={friend.id} href={`/profile/${friend.id}`} prefetch={false} className="flex min-w-0 items-center gap-3 rounded-xl border border-[#ded4c0] bg-white/95 p-3 hover:shadow-md">
      {friend.avatarUrl ? <img src={friend.avatarUrl} alt="" loading="lazy" className="h-12 w-12 shrink-0 rounded-full object-cover" /> : <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eee8dc] text-xl" aria-hidden="true">{friend.username?.[0] || 'M'}</span>}
      <span className="min-w-0"><strong className="block truncate">{friend.username || 'Thành viên MOSAIC'}</strong><span className="block text-sm text-[#716650]">✓ Bạn bè · {friend.mutualCount} bạn chung</span></span>
    </Link>)}</div>
    {next && <button disabled={loading} className="mosaic-button mt-4" onClick={() => void load(next)}>{loading ? 'Đang tải…' : 'Xem thêm bạn bè'}</button>}
  </section>;
}
