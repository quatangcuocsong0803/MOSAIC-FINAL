import { EXTRA_TYPOLOGY_FIELDS } from "@/lib/typology";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getFriendProfile } from "@/app/actions/friends";
import FriendProfileActions from "@/src/components/friends/FriendProfileActions";

interface FriendProfilePageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function FriendProfilePage({
  params,
}: FriendProfilePageProps) {
  const { userId } = await params;

  const result = await getFriendProfile(userId);

  if (!result.success) {
    if (result.reason === "SELF") {
      redirect("/profile");
    }

    if (result.reason === "NOT_FRIENDS" || result.reason === "USER_NOT_FOUND") {
      notFound();
    }

    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        <div className="rounded-2xl border border-[#E2D4B7] bg-white p-8 text-center shadow-sm">
          <h1 className="font-serif text-2xl font-bold text-[#5C4326]">
            Không thể tải hồ sơ
          </h1>

          <p className="mt-3 text-sm text-[#6B5A46]">
            Hồ sơ này hiện không khả dụng.
          </p>

          <Link
            href="/discover"
            className="mt-6 inline-flex rounded-full border border-[#8B6B4A] px-5 py-2.5 text-sm font-semibold text-[#8B6B4A] transition-colors hover:bg-[#8B6B4A] hover:text-white"
          >
            Quay lại Discover
          </Link>
        </div>
      </main>
    );
  }

  const { profile } = result;

  const displayName =
    profile.displayName ||
    profile.username ||
    `Thành viên #${profile.id.slice(-4)}`;

  const avatarLetter = (displayName.trim()[0] || "M").toUpperCase();

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 md:py-14">
      <div className="overflow-hidden rounded-3xl border border-[#E2D4B7] bg-white shadow-sm">
        <div className="border-b border-[#E2D4B7] bg-[#FCFBF8] px-6 py-8 md:px-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#8B6B4A]/40 bg-white font-serif text-3xl font-bold text-[#8B6B4A]">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarUrl}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                avatarLetter
              )}
            </div>

            <div className="min-w-0">
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[#A89F91]">
                MOSAIC Profile
              </p>

              <h1 className="truncate font-serif text-3xl font-bold text-[#5C4326] md:text-4xl">
                {displayName}
              </h1>

              <p className="mt-2 text-sm text-[#8B7355]">
                {profile.username ? `@${profile.username} · ` : ""}MID{" "}
                {String(profile.mid).padStart(7, "0")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 px-6 py-8 md:grid-cols-[1.3fr_0.7fr] md:px-10">
          <section>
            <h2 className="font-serif text-xl font-bold text-[#5C4326]">
              Giới thiệu
            </h2>

            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#6B5A46]">
              {profile.bio?.trim() || "Người dùng chưa thêm phần giới thiệu."}
            </p>

            {profile.age !== null && <p className="mt-3">{profile.age} tuổi</p>}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <ProfileField label="Địa điểm" value={profile.location} />

              <ProfileField label="Cung hoàng đạo" value={profile.zodiacSign} />

              <ProfileField
                label="Sở thích"
                value={profile.hobbies}
                className="sm:col-span-2"
              />
            </div>
          </section>

          <aside>
            <div className="rounded-2xl border border-[#E2D4B7] bg-[#FCFBF8] p-5">
              <h2 className="font-serif text-lg font-bold text-[#5C4326]">
                Personality
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {profile.confirmedMbtiType && (
                  <span className="rounded-full border border-[#8B6B4A]/30 bg-white px-3 py-1.5 text-xs font-semibold text-[#8B6B4A]">
                    {profile.confirmedMbtiType}
                  </span>
                )}

                {profile.confirmedEnneagramType && (
                  <span className="rounded-full border border-[#8B6B4A]/30 bg-white px-3 py-1.5 text-xs font-semibold text-[#8B6B4A]">
                    {profile.confirmedEnneagramType}
                  </span>
                )}

                {profile.confirmedEnneagramWing && (
                  <span className="rounded-full border border-[#8B6B4A]/30 bg-white px-3 py-1.5 text-xs font-semibold text-[#8B6B4A]">
                    {profile.confirmedEnneagramWing}
                  </span>
                )}

                {profile.confirmedEnneagramTritype && (
                  <span className="rounded-full border border-[#8B6B4A]/30 bg-white px-3 py-1.5 text-xs font-semibold text-[#8B6B4A]">
                    Tritype {profile.confirmedEnneagramTritype}
                  </span>
                )}

                {EXTRA_TYPOLOGY_FIELDS.map(
                  (field) =>
                    profile[field] && (
                      <span
                        key={field}
                        className="rounded-full border border-[#8B6B4A]/30 px-3 py-1.5 text-xs"
                      >
                        {profile[field]}
                      </span>
                    ),
                )}
                {!profile.confirmedMbtiType &&
                  !profile.confirmedEnneagramType && (
                    <p className="text-xs text-[#A89F91]">
                      Chưa xác nhận personality identity.
                    </p>
                  )}
              </div>
            </div>

            <div className="mt-5">
              {result.isFriend && (
                <FriendProfileActions
                  targetUserId={profile.id}
                  displayName={displayName}
                />
              )}
            </div>

            <div className="mt-5">
              <Link
                href="/discover"
                className="inline-flex text-sm font-semibold text-[#8B6B4A] transition-colors hover:text-[#5C4326]"
              >
                ← Quay lại Discover
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function ProfileField({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string | null;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs font-bold uppercase tracking-wider text-[#A89F91]">
        {label}
      </p>

      <p className="mt-1 text-sm leading-6 text-[#5C4326]">
        {value?.trim() || "Chưa cập nhật"}
      </p>
    </div>
  );
}
