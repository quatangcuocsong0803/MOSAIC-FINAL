import { randomUUID } from "crypto";
import {
  auth,
} from "@clerk/nextjs/server";
import {
  redirect,
} from "next/navigation";
import Link from "next/link";

import {
  prisma,
} from "@/lib/prisma";

import DiscussionComposer from "@/src/components/discussion/DiscussionComposer";

export default async function NewDiscussionPostPage({ searchParams }: { searchParams: Promise<{ forum?: string }> }) {
  const requestedForum = (await searchParams).forum;
  const { userId } =
    await auth();

  if (!userId) {
    redirect(
      "/sign-in",
    );
  }

  const forums =
    await prisma.forum.findMany({
      where: {
        isActive: true,
      },

      orderBy: {
        displayOrder: "asc",
      },

      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        moderationPolicy:
          true,
      },
    });

  const uploadSessionId =
    randomUUID();

  return (
    <main className="min-h-screen bg-[#F7F5F1]">
      <header className="border-b border-[#DDD5C8] bg-[#FBFAF7]">
        <div className="mx-auto max-w-5xl px-4 py-7 md:px-6">
          <Link
            href="/discussion"
            className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#8B7355] hover:underline"
          >
            ← Discussion
          </Link>

          <h1 className="mt-3 font-serif text-3xl font-bold text-[#493A2D]">
            Create a Discussion Post
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#766958]">
            MOSAIC yêu cầu người viết phân biệt rõ evidence,
            theory, interpretation và question. Các loại bài
            có factual/theoretical claims cần nguồn dẫn phù hợp
            trước khi được gửi vào moderation.
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 px-4 py-6 md:px-6 lg:grid-cols-[minmax(0,1fr)_240px]">
        <DiscussionComposer
          defaultForumId={forums.find(forum => forum.slug === requestedForum)?.id}
          forums={
            forums
          }
          uploadSessionId={
            uploadSessionId
          }
        />

        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-4">
            <section className="rounded-xl border border-[#DED5C7] bg-white p-4">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#917C61]">
                Writing standard
              </p>

              <div className="mt-3 space-y-3 text-[10px] leading-5 text-[#786A59]">
                <p>
                  <strong className="text-[#514130]">
                    Make the claim explicit.
                  </strong>
                  <br />
                  Người đọc phải hiểu bạn đang lập luận điều gì.
                </p>

                <p>
                  <strong className="text-[#514130]">
                    Cite the relevant source.
                  </strong>
                  <br />
                  Một link bất kỳ không tự động trở thành evidence.
                </p>

                <p>
                  <strong className="text-[#514130]">
                    Mark interpretation as interpretation.
                  </strong>
                  <br />
                  Không biến inference cá nhân thành scientific fact.
                </p>

                <p>
                  <strong className="text-[#514130]">
                    Discuss ideas, not people.
                  </strong>
                  <br />
                  Phản biện claim và methodology, không công kích tác giả.
                </p>
              </div>
            </section>

            <section className="rounded-xl border border-[#D6CAB7] bg-[#F3EEE5] p-4">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#856E51]">
                Citation ≠ endorsement
              </p>

              <p className="mt-2 text-[10px] leading-5 text-[#75644F]">
                Việc MOSAIC xác minh một URL hoặc DOI tồn tại
                không đồng nghĩa nguồn đó đúng hoặc claim của
                bài đã được chứng minh.
              </p>
            </section>
          </div>
        </aside>
      </div>
    </main>
  );
}
