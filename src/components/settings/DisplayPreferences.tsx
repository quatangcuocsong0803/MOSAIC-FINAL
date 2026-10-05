'use client';
import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { getUserSettings } from '@/app/actions/settings';
import { defaultPreferences, SETTINGS_EVENT, type SettingsSnapshot } from '@/lib/settings/preferences';
export function announceSettings(userId: string, settings: SettingsSnapshot) {
  window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: { userId, settings } }));
  try { localStorage.setItem(`mosaic-settings-signal:${userId}`, `${settings.revision}:${Date.now()}`); } catch { /* Preferences still work without storage. */ }
}
export default function DisplayPreferences() {
  const { user, isLoaded } = useUser();
  const userId = user?.id;
  const previousUserId = useRef<string | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    let request = 0;
    const apply = (settings = defaultPreferences) => {
      const root = document.documentElement;
      root.dataset.textSize = settings.textSize;
      root.dataset.reducedMotion = String(settings.reducedMotion);
      root.dataset.showDecorations = String(settings.showDecorations);
      window.dispatchEvent(new Event('mosaic-display-changed'));
    };
    const reload = async () => {
      const current = ++request;
      const result = await getUserSettings();
      if (alive && current === request && result.success) apply(result.settings);
    };
    if (previousUserId.current !== userId || !userId) apply();
    previousUserId.current = userId;
    if (!userId) apply();
    else if (isLoaded) void reload();
    const onSaved = (event: Event) => {
      const detail = (event as CustomEvent<{ userId: string; settings: SettingsSnapshot }>).detail;
      if (detail?.userId === userId) { ++request; apply(detail.settings); }
    };
    const onStorage = (event: StorageEvent) => {
      if (userId && event.key === `mosaic-settings-signal:${userId}`) void reload();
    };
    window.addEventListener(SETTINGS_EVENT, onSaved);
    window.addEventListener('storage', onStorage);
    return () => { alive = false; window.removeEventListener(SETTINGS_EVENT, onSaved); window.removeEventListener('storage', onStorage); };
  }, [userId, isLoaded]);
  return null;
}
