import {identitySelect,identityForViewer} from "@/lib/profile-identity";
import {
  auth,
} from "@clerk/nextjs/server";

import Link from "next/link";

import {
  prisma,
} from "@/lib/prisma";

function policyLabel(
  value: string,
) {
  if (
    value ===
    "APPROVAL"
  ) {
    return "Approval";
  }

  if (
    value ===
    "INVITE_ONLY"
  ) {
    return "Invite only";
  }

  return "Open";
}

export default async function DiscussionGroupsPage() {
  const {
    userId,
  } = await auth();

  const currentUser =
    userId
      ? await prisma.user.findUnique({
          where: {
            clerkId:
              userId,
          },

          select: {
            id: true,
          },
        })
      : null;

  const groups =
    await prisma.discussionGroup.findMany({
      where:
        currentUser
          ? {
              isActive:
                true,

              OR: [
                {
                  visibility:
                    "PUBLIC",
                },

                {
                  members: {
                    some: {
                      userId:
                        currentUser.id,

                      status: {
                        in: [
                          "ACTIVE",
                          "PENDING",
                        ],
                      },
                    },
                  },
                },
              ],
            }
          : {
              isActive:
                true,

              visibility:
                "PUBLIC",
            },

      orderBy: {
        createdAt:
          "desc",
      },

      select: {
        id: true,

        slug: true,
        name: true,
        description: true,

        visibility:
          true,

        joinPolicy:
          true,

        createdAt:
          true,

        creator: {
          select: {
 ...identitySelect,
            username:
              true,

            avatarUrl:
              true,
          },
        },
      },
    });

  const identity = await identityForViewer(currentUser?.id);
  for(const group of groups) Object.assign(group.creator,identity(group.creator));

  const ids =
    groups.map(
      (group) =>
        group.id,
    );

  const activeCounts =
    ids.length === 0
      ? []
      : await prisma.discussionGroupMember.groupBy({
          by: [
            "groupId",
          ],

          where: {
            groupId: {
              in:
                ids,
            },

            status:
              "ACTIVE",
          },

          _count: {
            _all: true,
          },
        });

  const memberships =
    currentUser &&
    ids.length > 0
      ? await prisma.discussionGroupMember.findMany({
          where: {
            userId:
              currentUser.id,

            groupId: {
              in:
                ids,
            },
          },

          select: {
            groupId:
              true,

            role: true,
            status: true,
          },
        })
      : [];

  const countMap =
    new Map(
      activeCounts.map(
        (item) => [
          item.groupId,
          item._count
            ._all,
        ],
      ),
    );

  const membershipMap =
    new Map(
      memberships.map(
        (item) => [
          item.groupId,
          item,
        ],
      ),
    );

  const myGroups =
    groups.filter(
      (group) =>
        membershipMap.has(
          group.id,
        ),
    );

  const exploreGroups =
    groups.filter(
      (group) =>
        group.visibility ===
        "PUBLIC",
    );

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

          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#987F62]">
                Community groups
              </p>

              <h1 className="mt-1 font-serif text-3xl font-bold text-[#493A2D]">
                Discussion Groups
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#766958]">
                Các không gian chuyên đề do thành viên tổ chức.
                Groups bổ sung cho System Forums, không thay thế
                taxonomy chính thức của MOSAIC.
              </p>
            </div>

            {userId && (
              <Link
                href="/discussion/groups/new"
                className="rounded-lg bg-[#705438] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#563F2A]"
              >
                + Tạo Group
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 md:px-6">
        {userId && (
          <section>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#927B60]">
                  Membership
                </p>

                <h2 className="mt-1 font-serif text-2xl font-bold text-[#4D3D2E]">
                  Nhóm của tôi
                </h2>
              </div>

              <span className="text-[10px] text-[#978875]">
                {
                  myGroups.length
                }{" "}
                groups
              </span>
            </div>

            {myGroups.length ===
            0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-[#D8CDBE] bg-white/60 p-6 text-center">
                <p className="text-xs text-[#857765]">
                  Bạn chưa tham gia group nào.
                </p>
              </div>
            ) : (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {myGroups.map(
                  (group) => {
                    const membership =
                      membershipMap.get(
                        group.id,
                      );

                    return (
                      <Link
                        key={
                          group.id
                        }
                        href={`/discussion/groups/${group.slug}`}
                        className="rounded-xl border border-[#DDD3C6] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#BDA98E]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-serif text-lg font-bold text-[#4F3D2D]">
                              {
                                group.name
                              }
                            </h3>

                            <p className="mt-1 line-clamp-2 text-[10px] leading-5 text-[#857765]">
                              {
                                group.description
                              }
                            </p>
                          </div>

                          <span className="rounded-md bg-[#F2EDE5] px-2 py-1 text-[8px] font-extrabold uppercase text-[#806B51]">
                            {
                              membership?.status
                            }
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-3 text-[9px] text-[#958571]">
                          <span>
                            {
                              countMap.get(
                                group.id,
                              ) ??
                              0
                            }{" "}
                            members
                          </span>

                          <span>
                            {
                              membership?.role
                            }
                          </span>

                          <span>
                            {
                              group.visibility
                            }
                          </span>
                        </div>
                      </Link>
                    );
                  },
                )}
              </div>
            )}
          </section>
        )}

        <section className={userId ? "mt-10" : ""}>
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#927B60]">
                Explore
              </p>

              <h2 className="mt-1 font-serif text-2xl font-bold text-[#4D3D2E]">
                Public Groups
              </h2>
            </div>

            <span className="text-[10px] text-[#978875]">
              {
                exploreGroups.length
              }{" "}
              public
            </span>
          </div>

          {exploreGroups.length ===
          0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-[#D8CDBE] bg-white/60 p-8 text-center">
              <p className="font-serif text-lg font-bold text-[#574534]">
                Chưa có public group
              </p>

              <p className="mt-1 text-xs text-[#897B69]">
                Đây là lúc khá hợp để tạo group đầu tiên.
              </p>
            </div>
          ) : (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {exploreGroups.map(
                (group) => (
                  <Link
                    key={
                      group.id
                    }
                    href={`/discussion/groups/${group.slug}`}
                    className="group rounded-xl border border-[#DDD3C6] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#BDA98E]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-serif text-xl font-bold text-[#4F3D2D] group-hover:text-[#795D3C]">
                          {
                            group.name
                          }
                        </h3>

                        <p className="mt-2 line-clamp-3 text-[10px] leading-5 text-[#827361]">
                          {
                            group.description
                          }
                        </p>
                      </div>

                      <span className="shrink-0 rounded-md bg-[#F5F1EA] px-2 py-1 text-[8px] font-bold uppercase text-[#806E59]">
                        {
                          policyLabel(
                            group.joinPolicy,
                          )
                        }
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[#EEE7DE] pt-3 text-[9px] text-[#978875]">
                      <span>
                        {
                          countMap.get(
                            group.id,
                          ) ??
                          0
                        }{" "}
                        members
                      </span>

                      <span>
                        by{" "}
                        {
                          group.creator
                            .username ||
                          "MOSAIC member"
                        }
                      </span>
                    </div>
                  </Link>
                ),
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
