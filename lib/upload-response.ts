export async function uploadResponse<T extends { error?: string }>(response: Response): Promise<T> {
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw Error(response.status === 413 ? 'Ảnh quá lớn. Hãy chọn ảnh nhỏ hơn 3 MB.' : 'Máy chủ chưa nhận được ảnh. Vui lòng thử lại.');
  }
  const data = await response.json() as T;
  if (!response.ok) throw Error(data.error || 'Chưa tải được ảnh. Vui lòng thử lại.');
  return data;
}
