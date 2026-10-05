export function safeReturnPath(value: string | null | undefined): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || /[\\\x00-\x20]/.test(value)) return '/';
  try { const url = new URL(value, 'https://mosaic.local');
    if (url.origin !== 'https://mosaic.local' || /^\/(sign-in|sign-up|api|_next)(\/|$)/.test(url.pathname) || /%2f|%5c/i.test(url.pathname)) return '/';
    const known = ['about','contact','discover','discussion','feedback','knowledge','messages','privacy','profile','reset','result','search','settings','statistics','support','terms','test'];
    if(url.pathname !== '/' && !known.includes(url.pathname.split('/')[1])) return '/';
    return url.pathname + url.search + url.hash;
  } catch { return '/'; }
}
