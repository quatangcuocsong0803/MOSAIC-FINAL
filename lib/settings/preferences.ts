export const SETTINGS_EVENT = 'mosaic-settings-updated';
export const defaultPreferences = {
  notificationFriends: true,
  notificationComments: true,
  notificationReactions: true,
  notificationReviews: true,
  reducedMotion: false,
  showDecorations: true,
  textSize: 'NORMAL' as 'NORMAL' | 'LARGE',
};
export type Preferences = typeof defaultPreferences;
export type SettingsSnapshot = Preferences & { revision: number };
const booleanKeys = Object.keys(defaultPreferences).filter(key => key !== 'textSize') as Exclude<keyof Preferences, 'textSize'>[];
export function parsePreferences(value: unknown): Preferences | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  if (Object.keys(input).length !== Object.keys(defaultPreferences).length || Object.keys(input).some(key => !(key in defaultPreferences))) return null;
  if (booleanKeys.some(key => typeof input[key] !== 'boolean') || (input.textSize !== 'NORMAL' && input.textSize !== 'LARGE')) return null;
  return Object.fromEntries(Object.keys(defaultPreferences).map(key => [key, input[key]])) as Preferences;
}
export function toSnapshot(value?: (Omit<SettingsSnapshot, 'textSize'> & { textSize: string }) | null): SettingsSnapshot {
  if (!value) return { ...defaultPreferences, revision: 0 };
  return { ...defaultPreferences, ...Object.fromEntries(Object.keys(defaultPreferences).map(key => [key, value[key as keyof typeof value]])), textSize: value.textSize === 'LARGE' ? 'LARGE' : 'NORMAL', revision: value.revision } as SettingsSnapshot;
}
