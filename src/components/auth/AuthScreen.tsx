"use client";
import { SignIn, SignUp } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { safeReturnPath } from '@/lib/auth-return';
export default function AuthScreen({ mode }: { mode: 'sign-in' | 'sign-up' }) {
 const [target, setTarget] = useState<string | null>(null);
 useEffect(() => { const params = new URLSearchParams(window.location.search);
   let previous = ''; try { previous = sessionStorage.getItem('mosaic-return-path') || ''; } catch {}
   setTarget(safeReturnPath(params.get('redirect_url') || previous));
 }, []);
 if (target === null) return <p role="status">Đang mở trang đăng nhập…</p>;
 const onboardingTarget = '/onboarding?returnTo=' + encodeURIComponent(target.startsWith('/onboarding') ? '/profile' : target === '/' ? '/profile' : target);
 const common = { routing: 'path' as const, forceRedirectUrl: mode === 'sign-up' ? onboardingTarget : target, fallbackRedirectUrl: '/', signInForceRedirectUrl: target, signUpForceRedirectUrl: onboardingTarget };
 return <div className="flex min-h-[75vh] items-center justify-center px-4 py-12">{mode === 'sign-in' ? <SignIn {...common} path="/sign-in" signUpUrl={'/sign-up?redirect_url=' + encodeURIComponent(target)} /> : <SignUp {...common} path="/sign-up" signInUrl={'/sign-in?redirect_url=' + encodeURIComponent(target)} />}</div>;
}
