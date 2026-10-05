export const MAX_AVATAR_BYTES = 3 * 1024 * 1024;
export function avatarFormat(bytes: Uint8Array): { extension: string; contentType: string } | null {
  if (bytes.length >= 8 && [137,80,78,71,13,10,26,10].every((n,i)=>bytes[i]===n)) return {extension:'png',contentType:'image/png'};
  if (bytes.length >= 3 && bytes[0]===255 && bytes[1]===216 && bytes[2]===255) return {extension:'jpg',contentType:'image/jpeg'};
  const ascii=(start:number,end:number)=>String.fromCharCode(...bytes.slice(start,end));
  if (bytes.length>=12 && ascii(0,4)==='RIFF' && ascii(8,12)==='WEBP') return {extension:'webp',contentType:'image/webp'};
  if (bytes.length>=6 && ['GIF87a','GIF89a'].includes(ascii(0,6))) return {extension:'gif',contentType:'image/gif'};
  return null;
}
