"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { getUserProfile } from "@/app/actions/profile";
import { isOnboardingPath, onboardingPath, onboardingPauseKey } from "@/lib/onboarding";
import { safeReturnPath } from "@/lib/auth-return";

export default function OnboardingGate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const accountId = user?.id;
  const pathname = usePathname();
  const router = useRouter();
  const completedAccount = useRef<string | null>(null);
  const [resume, setResume] = useState<{ userId: string; href: string } | null>(null);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const excluded = isOnboardingPath(pathname) || /^\/(sign-in|sign-up)(\/|$)/.test(pathname);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !accountId || excluded || completedAccount.current === accountId) return;
    let active = true;
    setError(false);
    setResume(null);
    getUserProfile().then((result) => {
      if (!active) return;
      if (!result.success || !result.profile) { setError(true); return; }
      if (result.profile.onboardingCompletedAt) {
        completedAccount.current = accountId;
        return;
      }
      const target = safeReturnPath(window.location.pathname + window.location.search + window.location.hash);
      const href = onboardingPath(result.profile.onboardingStep, target === "/" ? "/profile" : target);
      let paused = false;
      try { paused = sessionStorage.getItem(onboardingPauseKey(accountId)) === "1"; } catch {}
      if (paused) setResume({ userId: accountId, href });
      else router.replace(href);
    }).catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [isLoaded, isSignedIn, accountId, excluded, pathname, router, retry]);

  if (!isLoaded || !isSignedIn || excluded) return null;
  if (error) return <aside className="w-full px-4 py-3 text-center text-sm" role="status">
    Chưa kiểm tra được tiến độ hồ sơ. <button className="underline" onClick={() => setRetry((n) => n + 1)}>Thử lại</button>
  </aside>;
  if (!resume || resume.userId !== accountId) return null;
  return <aside className="w-full border-b border-[#E2D4B7] bg-[#FAF6F0] px-4 py-3 text-center text-sm text-[#5C4326]">
    Hồ sơ của bạn đang được thiết lập. <Link href={resume.href} className="font-semibold underline">Tiếp tục hoàn thiện hồ sơ →</Link>
  </aside>;
}
