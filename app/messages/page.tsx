export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";

import { getConversations } from "@/app/actions/chat";
import MessagesSidebar from "@/src/components/messages/MessagesSidebar";

export default async function MessagesPage() {
  const result =
    await getConversations();

  if (!result.success) {
    if (
      result.reason ===
      "UNAUTHENTICATED"
    ) {
      redirect("/sign-in");
    }

    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="rounded-2xl border border-[#E2D4B7] bg-white p-8 text-center">
          <h1 className="font-serif text-2xl font-bold text-[#5C4326]">
            Không thể tải tin nhắn
          </h1>

          <p className="mt-2 text-sm text-[#8B7355]">
            Hãy thử tải lại trang sau.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] px-3 py-5 md:px-5 md:py-7">
      <div className="mosaic-messages-shell h-[calc(100vh-165px)] min-h-[560px] overflow-hidden rounded-3xl border border-[#E2D4B7] bg-white shadow-[0_16px_45px_rgba(75,55,35,0.08)]">
        <div className="grid h-full grid-cols-1 md:grid-cols-[330px_1fr] lg:grid-cols-[360px_1fr]">
          <MessagesSidebar
            conversations={
              result.conversations
            }
          />

          <section className="hidden h-full items-center justify-center bg-[#FBFAF7] md:flex">
            <div className="max-w-sm px-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#E2D4B7] bg-white shadow-sm">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.4}
                  className="h-8 w-8 text-[#8B6B4A]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12c0 4.142-4.03 7.5-9 7.5a10.4 10.4 0 0 1-3.172-.487L3 21l1.987-4.139A6.89 6.89 0 0 1 3 12c0-4.142 4.03-7.5 9-7.5s9 3.358 9 7.5Z"
                  />
                </svg>
              </div>

              <h2 className="mt-5 font-serif text-2xl font-bold text-[#5C4326]">
                Tin nhắn của bạn
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#8B7355]">
                Chọn một cuộc trò chuyện ở bên trái để bắt đầu nhắn tin.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
