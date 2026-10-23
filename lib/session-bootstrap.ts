import type { SettingsSnapshot } from '@/lib/settings/preferences';
type Bootstrap = { success: true; accountId: string; avatarUrl: string | null; profile: { onboardingStep: number; onboardingCompletedAt: string | null }; settings: SettingsSnapshot };
let cached: { account: string; expires: number; value: Promise<Bootstrap> } | undefined;
export function clearSessionBootstrap() { cached = undefined; }
export function getSessionBootstrap(account: string, fresh = false): Promise<Bootstrap> {
  if (!fresh && cached?.account === account && cached.expires > Date.now()) return cached.value;
  const value = fetch('/api/session/bootstrap', { cache: 'no-store' }).then(async response => {
    if (!response.ok) throw Error('Chưa tải được thông tin tài khoản.');
    const data = await response.json();
    if (!data.success || data.accountId !== account) throw Error('Tài khoản đã thay đổi.');
    return data as Bootstrap;
  });
  const entry = { account, expires: Date.now() + 30_000, value };
  cached = entry;
  void value.catch(() => { if (cached === entry) cached = undefined; });
  return value;
}
