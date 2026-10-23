import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { identitySelect, visibleIdentity } from '@/lib/profile-identity';
export default async function BirthdaysPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in?redirect_url=%2Ffriends%2Fbirthdays');
  const me = await prisma.user.findUnique({ where: { clerkId: userId }, select: { id: true } });
  const friends = me ? await prisma.user.findMany({ where: {
    dateOfBirth: { not: null }, dateOfBirthVisibility: { in: ['PUBLIC', 'FRIENDS'] },
    blocksCreated: { none: { blockedId: me.id } }, blocksReceived: { none: { blockerId: me.id } },
    OR: [{ sentRequests: { some: { receiverId: me.id, status: 'ACCEPTED' } } }, { receivedRequests: { some: { senderId: me.id, status: 'ACCEPTED' } } }],
  }, select: { ...identitySelect, dateOfBirth: true } }) : [];
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const upcoming = friends.map(friend => {
    const date = friend.dateOfBirth!;
    let next = Date.UTC(now.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    if (next < today) next = Date.UTC(now.getUTCFullYear() + 1, date.getUTCMonth(), date.getUTCDate());
    return { ...visibleIdentity(friend, false, true), day: date.getUTCDate(), month: date.getUTCMonth() + 1, remaining: Math.round((next - today) / 86400000) };
  }).sort((a, b) => a.remaining - b.remaining || a.id.localeCompare(b.id));
  return <section className="mosaic-profile-card mx-auto my-8 max-w-3xl"><h1 className="font-serif text-3xl">Sinh nhật bạn bè</h1><p className="my-4">Những ngày sinh được bạn bè chia sẻ với bạn.</p>{!upcoming.length && <p>Chưa có ngày sinh được chia sẻ.</p>}<div className="grid gap-3">{upcoming.map(friend => <Link key={friend.id} href={`/profile/${friend.id}`} prefetch={false} className="flex items-center gap-4 rounded-xl border border-[#ded4c0] bg-white p-4">{friend.avatarUrl && <img src={friend.avatarUrl} alt="" className="h-12 w-12 rounded-full object-cover" />}<div><strong>{friend.username || 'Thành viên MOSAIC'}</strong><p>{friend.day}/{friend.month} · {friend.remaining === 0 ? 'Hôm nay 🎂' : `Còn ${friend.remaining} ngày`}</p></div></Link>)}</div></section>;
}
