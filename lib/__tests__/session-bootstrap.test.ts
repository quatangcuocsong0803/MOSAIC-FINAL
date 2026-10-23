import { beforeEach, afterEach, expect, it, vi } from 'vitest';
import { clearSessionBootstrap, getSessionBootstrap } from '@/lib/session-bootstrap';
const response = (accountId: string) => ({ ok: true, json: async () => ({ success: true, accountId, avatarUrl: null, profile: { onboardingStep: 0, onboardingCompletedAt: null }, settings: {} }) });
beforeEach(() => clearSessionBootstrap());
afterEach(() => vi.unstubAllGlobals());
it('deduplicates simultaneous bootstrap consumers and the next navigation', async () => {
  const fetch = vi.fn(async () => response('a')); vi.stubGlobal('fetch', fetch);
  await Promise.all([getSessionBootstrap('a'), getSessionBootstrap('a'), getSessionBootstrap('a')]);
  await getSessionBootstrap('a'); expect(fetch).toHaveBeenCalledTimes(1);
});
it('does not share data across accounts and verifies the server account', async () => {
  const fetch = vi.fn().mockResolvedValueOnce(response('a')).mockResolvedValueOnce(response('b')).mockResolvedValueOnce(response('b'));
  vi.stubGlobal('fetch', fetch);
  await getSessionBootstrap('a'); await getSessionBootstrap('b');
  await expect(getSessionBootstrap('a')).rejects.toThrow(); expect(fetch).toHaveBeenCalledTimes(3);
});
it('retries failed requests', async () => {
  const fetch = vi.fn().mockRejectedValueOnce(Error('offline')).mockResolvedValueOnce(response('a')); vi.stubGlobal('fetch', fetch);
  await expect(getSessionBootstrap('a')).rejects.toThrow(); await expect(getSessionBootstrap('a')).resolves.toHaveProperty('success', true);
});
it('supports invalidation and fresh reads', async () => {
  const fetch = vi.fn(async () => response('a')); vi.stubGlobal('fetch', fetch);
  await getSessionBootstrap('a'); await getSessionBootstrap('a', true); clearSessionBootstrap(); await getSessionBootstrap('a'); expect(fetch).toHaveBeenCalledTimes(3);
});
