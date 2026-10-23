import { expect, it } from 'vitest';
import { uploadResponse } from '@/lib/upload-response';
it('reports plain-text platform body limits without a JSON parse error', async () => {
  await expect(uploadResponse(new Response('Request Entity Too Large', { status: 413 }))).rejects.toThrow('Ảnh quá lớn');
});
it('returns uploaded data and preserves useful server errors', async () => {
  await expect(uploadResponse(Response.json({ error: 'Không có quyền.' }, { status: 403 }))).rejects.toThrow('Không có quyền.');
  await expect(uploadResponse(Response.json({ avatarUrl: '/portrait.png' }))).resolves.toEqual({ avatarUrl: '/portrait.png' });
});
