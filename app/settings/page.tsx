import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserProfile } from '@/app/actions/profile';
import { getUserSettings } from '@/app/actions/settings';
import SettingsPanel from '@/src/components/settings/SettingsPanel';
import styles from '@/src/components/settings/Settings.module.css';
export const metadata = { title: 'Cài đặt · MOSAIC' };
export const dynamic = 'force-dynamic';
export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in?redirect_url=%2Fsettings');
  const profile = await getUserProfile();
  const settings = await getUserSettings();
  if (!profile.success || !profile.profile || !settings.success) return <div className={styles.page}><h1>Cài đặt</h1><p role="alert">{!settings.success ? settings.error : profile.error || 'Chưa tải được hồ sơ.'}</p><a href="/settings">Thử tải lại</a></div>;
  return <SettingsPanel initialProfile={profile.profile} initialSettings={settings.settings} clerkId={userId} />;
}
