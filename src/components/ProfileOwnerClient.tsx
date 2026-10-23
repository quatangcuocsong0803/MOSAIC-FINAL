"use client";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  confirmManualPersonalityType,
  type UserProfileData,
} from "@/app/actions/profile";
import {
  setIdentityConsent,
} from "@/app/actions/identity-consent";
import dynamic from "next/dynamic";
const ProfileFormModal = dynamic(() => import("@/src/components/ProfileFormModal"), { ssr: false });
import FriendsList from "@/src/components/friends/CompactFriends";
import MomentsFeed from "@/src/components/MomentsFeed";
import TestHistory from "@/src/components/TestHistory";
import { EXTRA_TYPOLOGY_FIELDS } from "@/lib/typology";
import { identitySnapshot } from "@/lib/identity-consent";
import { interestLabels } from "@/lib/interests";
const names: Record<string, string> = {
  socionicsType: "Socionics",
  attitudinalPsyche: "Attitudinal Psyche",
  instinctStack: "Instinct",
  moralAlignment: "Moral Alignment",
  temperament: "Temperament",
  sloanType: "Big Five / SLOAN",
};
export default function ProfileOwnerClient({ initialProfile }: { initialProfile?: UserProfileData }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [profile, setProfile] = useState<UserProfileData | undefined>(initialProfile),
    [edit, setEdit] = useState(false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [consents, setConsents] = useState(initialProfile?.identityConsents ?? { MBTI: false, ENNEAGRAM: false });
  const refresh = useCallback(async () => {
    const response = await fetch('/api/profile/summary', { cache: 'no-store' });
    if (!response.ok) throw Error('Chưa tải được hồ sơ.');
    const r = await response.json();
    if (r.success && r.profile) setProfile(r.profile);
    else throw Error(r.error || "Chưa tải được hồ sơ.");
    setConsents(r.profile?.identityConsents ?? { MBTI: false, ENNEAGRAM: false });
  }, []);
  useEffect(() => {
    if (isSignedIn && (!initialProfile || initialProfile.clerkId !== user?.id)) refresh().catch((e) => setError(e.message));
  }, [isSignedIn, user?.id, initialProfile, refresh]);
  async function action(
    fn: () => Promise<{ success: boolean; error?: string }>,
  ) {
    setBusy(true);
    setError("");
    try {
      const r = await fn();
      if (!r.success) throw Error(r.error || "Chưa cập nhật được.");
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chưa cập nhật được.");
    } finally {
      setBusy(false);
    }
  }
  async function cover(file: File | undefined) {
    if (!file) return;
    await action(async () => {
      const body = new FormData();
      body.set("cover", file);
      const res = await fetch("/api/profile/cover", { method: "POST", body });
      return res.json();
    });
  }
  if (!isLoaded && !initialProfile) return <p className="p-10">Đang tải hồ sơ…</p>;
  if (isLoaded && !isSignedIn)
    return (
      <section className="mosaic-profile-card my-10">
        <h1 className="font-serif text-3xl">Hồ sơ của bạn</h1>
        <Link
          href="/sign-in?redirect_url=%2Fprofile"
          className="mosaic-button mt-5 inline-block"
        >
          Đăng nhập
        </Link>
      </section>
    );
  if (profile && user && profile.clerkId !== user.id) return <p className="p-10">Đang tải hồ sơ…</p>;
  if (!profile)
    return (
      <section className="mosaic-profile-card my-10">
        <p role="status">{error || "Đang tải hồ sơ…"}</p>
        {error && (
          <button
            onClick={() => void refresh().catch((e) => setError(e.message))}
          >
            Thử lại
          </button>
        )}
      </section>
    );
  const displayName =
    profile.displayName ||
    profile.username ||
    user?.fullName ||
    "Thành viên MOSAIC";
  return (
    <div className="mosaic-profile-page mx-auto my-8 w-full max-w-6xl space-y-8 px-4">
      <section className="mosaic-profile-card overflow-hidden !p-0">
        <div className="relative h-48 bg-gradient-to-r from-[#E6DED0] to-[#F8F5EE] md:h-72">
          {profile.coverUrl && (
            <img
              src={profile.coverUrl}
              alt="Ảnh bìa hồ sơ"
              className="h-full w-full object-cover"
            />
          )}
          <label className="absolute bottom-4 right-4 cursor-pointer rounded-xl bg-[#F8F5EE]/95 px-4 py-2 text-sm shadow">
            {busy ? "Đang tải…" : "Đổi ảnh bìa"}
            <input
              type="file"
              className="sr-only"
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={busy}
              onChange={(e) => void cover(e.target.files?.[0])}
            />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-5 p-6">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#fffaf0] bg-[#E2D4B7] font-serif text-4xl">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              displayName[0]
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="break-words font-serif text-3xl md:text-4xl">
              {displayName}
            </h1>
            <p>
              @{profile.username} · MID {profile.mid}
            </p>
          </div>
          <button className="mosaic-button" onClick={() => setEdit(true)}>
            Chỉnh sửa hồ sơ
          </button>
        </div>
      </section>
      {error && (
        <p role="alert" className="rounded-xl bg-white p-4 text-red-700">
          {error}
        </p>
      )}
      <div className="grid items-start gap-6 lg:grid-cols-[340px_1fr]">
        <aside className="space-y-6">
          <section className="mosaic-profile-card">
            <h2 className="font-serif text-2xl">Giới thiệu</h2>
            <p className="mt-3 whitespace-pre-wrap break-words">
              {profile.bio || "Chưa thêm lời giới thiệu."}
            </p>
            <dl className="mt-5 space-y-2 text-sm">
              <div>
                <dt className="font-bold">Nơi sống</dt>
                <dd>{profile.location || "Chưa chọn"}</dd>
              </div>
              <div>
                <dt className="font-bold">Ngày sinh</dt>
                <dd>
                  {profile.dateOfBirth
                    ? new Date(profile.dateOfBirth).toLocaleDateString("vi-VN")
                    : "Chưa chọn"}
                </dd>
              </div>
              <div>
                <dt className="font-bold">Sở thích</dt>
                <dd>
                  {interestLabels(profile.interestCodes.slice(0, 7)) ||
                    profile.hobbies ||
                    "Chưa chọn"}
                </dd>
              </div>
            </dl>
          </section>
          <section className="mosaic-profile-card space-y-3">
            <h2 className="font-serif text-2xl">Typology</h2>
            <div className="flex flex-wrap gap-2">
              {[
                profile.confirmedMbtiType,
                profile.confirmedEnneagramType,
                profile.confirmedEnneagramWing,
                profile.confirmedEnneagramTritype &&
                  `Tritype ${profile.confirmedEnneagramTritype}`,
              ]
                .filter(Boolean)
                .map((value) => (
                  <span
                    key={value}
                    className="rounded-full border border-[#C5A772] bg-[#F8F5EE] px-3 py-1.5 text-sm"
                  >
                    {value}
                  </span>
                ))}
            </div>
            <dl className="space-y-3">
              {EXTRA_TYPOLOGY_FIELDS.map(
                (field) =>
                  profile[field] && (
                    <div key={field}>
                      <dt className="text-xs font-bold uppercase opacity-70">
                        {names[field]}
                      </dt>
                      <dd>{profile[field]}</dd>
                    </div>
                  ),
              )}
            </dl>
            <button onClick={() => setEdit(true)} className="text-sm underline">
              Cập nhật typology
            </button>
            <Link href="/test" className="mosaic-button block text-center">
              Kiểm tra ngay →
            </Link>
          </section>
          <section className="mosaic-profile-card space-y-5">
            <h2 className="font-serif text-2xl">Kết quả đã xác nhận</h2>
            <p className="text-sm">
              Chọn từ kết quả test bên dưới hoặc lựa chọn thủ công. Consent tại
              đây chỉ dùng cho thống kê kết quả đã xác nhận.
            </p>
            {(["MBTI", "ENNEAGRAM"] as const).map((kind) => {
              const mbti = kind === "MBTI";
              const value = mbti
                ? profile.confirmedMbtiType
                : profile.confirmedEnneagramType;
              const manual = mbti
                ? profile.manualMbtiType
                : profile.manualEnneagramType;
              return (
                <div
                  key={kind}
                  className="space-y-3 border-t border-[#DCC89E] pt-3"
                >
                  <h3 className="font-bold">
                    {kind}: {value || "Chưa xác nhận"}
                  </h3>
                  <p className="text-xs">
                    Nguồn:{" "}
                    {(mbti
                      ? profile.confirmedMbtiSource
                      : profile.confirmedEnneagramSource) === "TEST"
                      ? "Kết quả test"
                      : "Tự chọn"}
                  </p>
                  {manual && (
                    <button
                      disabled={busy}
                      onClick={() =>
                        void action(() => confirmManualPersonalityType(kind))
                      }
                      className="rounded-lg border px-3 py-2 text-sm"
                    >
                      Dùng lựa chọn thủ công: {manual}
                    </button>
                  )}
                  <label className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={consents[kind]}
                      disabled={busy || !value}
                      onChange={(e) =>
                        void action(() =>
                          setIdentityConsent(
                            kind,
                            e.target.checked,
                            identitySnapshot(profile, kind),
                          ),
                        )
                      }
                    />
                    <span>
                      Đồng ý chia sẻ {kind} đã xác nhận lên thống kê. Bỏ chọn để
                      thu hồi.
                    </span>
                  </label>
                </div>
              );
            })}
          </section>
        </aside>
        <MomentsFeed ownerId={profile.id} owner />
      </div>
      <FriendsList />
      <TestHistory results={profile.testResults} remote onChange={refresh} />
      <ProfileFormModal
        isOpen={edit}
        onClose={() => setEdit(false)}
        onSuccess={(p) => {
          setProfile(p);
          void refresh();
        }}
      />
    </div>
  );
}
