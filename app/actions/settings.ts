'use server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { defaultPreferences, parsePreferences, toSnapshot, type SettingsSnapshot } from '@/lib/settings/preferences';

type Result = { success: true; settings: SettingsSnapshot } | { success: false; error: string; conflict?: boolean };
async function currentUserId() {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { clerkId: userId }, select: { id: true } });
  return user?.id ?? null;
}
export async function getUserSettings(): Promise<Result> {
  try {
    const userId = await currentUserId();
    if (!userId) return { success: false, error: 'Vui lòng đăng nhập và mở hồ sơ trước khi sử dụng cài đặt.' };
    return { success: true, settings: toSnapshot(await prisma.userSettings.findUnique({ where: { userId } })) };
  } catch {
    return { success: false, error: 'Chưa tải được cài đặt. Vui lòng thử lại.' };
  }
}
export async function saveUserSettings(input: unknown, revision: number): Promise<Result> {
  const preferences = parsePreferences(input);
  if (!preferences || !Number.isSafeInteger(revision) || revision < 0) return { success: false, error: 'Cài đặt không hợp lệ.' };
  try {
    const userId = await currentUserId();
    if (!userId) return { success: false, error: 'Vui lòng đăng nhập lại.' };
    const result = await prisma.$transaction(async tx => {
      await tx.userSettings.upsert({ where: { userId }, create: { userId, ...defaultPreferences }, update: {} });
      const changed = await tx.userSettings.updateMany({ where: { userId, revision }, data: { ...preferences, revision: { increment: 1 } } });
      if (!changed.count) return null;
      return tx.userSettings.findUniqueOrThrow({ where: { userId } });
    });
    if (!result) return { success: false, conflict: true, error: 'Cài đặt đã được thay đổi ở tab khác. Tải bản mới trước khi lưu lại.' };
    return { success: true, settings: toSnapshot(result) };
  } catch {
    return { success: false, error: 'Chưa lưu được cài đặt. Các thay đổi của bạn vẫn ở đây để thử lại.' };
  }
}
