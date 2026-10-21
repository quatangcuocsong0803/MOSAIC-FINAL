import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/app/actions/profile";
import { safeReturnPath } from "@/lib/auth-return";
import { ONBOARDING_SLUGS, onboardingPath, isOnboardingPath } from "@/lib/onboarding";
import ProfileOnboardingWizard from "@/src/components/ProfileOnboardingWizard";

export const metadata = { title: "Thiết lập hồ sơ | MOSAIC" };

export default async function OnboardingPage({ params, searchParams }: {
  params: Promise<{ step?: string[] }>;
  searchParams: Promise<{ returnTo?: string | string[] }>;
}) {
  const [{ step }, query, session] = await Promise.all([params, searchParams, auth()]);
  const requestedReturn = safeReturnPath(typeof query.returnTo === "string" ? query.returnTo : "/profile");
  const returnTo = isOnboardingPath(requestedReturn.split(/[?#]/)[0]) ? "/profile" : requestedReturn;
  if (!session.userId) {
    const target = `/onboarding?returnTo=${encodeURIComponent(returnTo)}`;
    redirect(`/sign-in?redirect_url=${encodeURIComponent(target)}`);
  }
  const result = await getUserProfile();
  if (!result.success || !result.profile) {
    return <section className="mx-auto max-w-lg px-6 py-20 text-center">
      <h1 className="font-serif text-3xl">Chưa tải được hồ sơ</h1>
      <p role="alert" className="my-4">{result.error || "Vui lòng thử lại."}</p>
      <Link href={`/onboarding?returnTo=${encodeURIComponent(returnTo)}`} className="underline">Thử lại</Link>
    </section>;
  }
  const profile = result.profile;
  if (profile.onboardingCompletedAt) redirect(returnTo);
  // The saved account progress is authoritative, including after refresh,
  // browser history navigation, or an attempt to jump ahead by changing the URL.
  if (step?.length !== 1 || step[0] !== ONBOARDING_SLUGS[profile.onboardingStep]) {
    redirect(onboardingPath(profile.onboardingStep, returnTo));
  }
  return <ProfileOnboardingWizard key={`${session.userId}:${profile.onboardingStep}`} initialProfile={profile} returnTo={returnTo} />;
}
