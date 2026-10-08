export const dynamic = "force-dynamic";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getBlockedUsers } from "@/app/actions/blocks";
import UnblockButton from "@/src/components/friends/UnblockButton";

export default async function BlockedUsersPage() {
  const result =
    await getBlockedUsers();

  if (!result.success) {
    if (
      result.reason ===
      "UNAUTHENTICATED"
    ) {
      redirect("/sign-in");
    }

    return null;
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A89F91]">
          PRIVACY
        </p>

        <h1 className="mt-2 font-serif text-3xl font-bold text-[#5C4326]">
          Người dùng đã chặn
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#806D59]">
          Bỏ chặn không tự động khôi phục quan hệ bạn bè.
        </p>
      </header>

      {result.users.length === 0 ? (
        <div className="rounded-2xl border border-[#E2D4B7] bg-white p-8 text-center text-sm text-[#8B7355]">
          Bạn chưa chặn người dùng nào.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#E2D4B7] bg-white">
          {result.users.map((user) => {
            const name =
              user.username ||
              `Thành viên #${user.id.slice(-4)}`;

            return (
              <div
                key={user.id}
                className="flex items-center justify-between gap-4 border-b border-[#E2D4B7] px-5 py-4 last:border-b-0"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E2D4B7] bg-[#FCFBF8] font-serif font-bold text-[#8B6B4A]">
                    {user.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.avatarUrl}
                        alt={name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      name.charAt(0).toUpperCase()
                    )}
                  </div>

                  <strong className="truncate text-sm text-[#5C4326]">
                    {name}
                  </strong>
                </div>

                <UnblockButton
                  userId={user.id}
                />
              </div>
            );
          })}
        </div>
      )}

      <Link
        href="/profile"
        className="mt-6 inline-flex text-sm font-semibold text-[#8B6B4A]"
      >
        ← Quay lại Profile
      </Link>
    </main>
  );
}
