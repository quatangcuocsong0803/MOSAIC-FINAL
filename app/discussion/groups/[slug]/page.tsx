import { publicCommentWhere } from "@/lib/discussion/comment-service";
import {
  auth,
} from "@clerk/nextjs/server";

import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import {
  prisma,
} from "@/lib/prisma";

import GroupMembershipControls from "@/src/components/discussion/groups/GroupMembershipControls";

import {
  GroupGovernanceActions,
  GroupRequestActions,
  GroupRoleAction,
  GroupUnbanAction,
} from "@/src/components/discussion/groups/GroupMemberAdminActions";

export default async function DiscussionGroupPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const {
    slug,
  } = await params;

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

  const group =
    await prisma.discussionGroup.findFirst({
      where: {
        slug,

        isActive:
          true,
      },

      select: {
        id: true,

        slug: true,
        name: true,

        description:
          true,

        rules: true,

        visibility:
          true,

        joinPolicy:
          true,

        createdAt:
          true,

        creator: {
          select: {
            username:
              true,

            avatarUrl:
              true,
          },
        },
      },
    });

  if (!group) {
    notFound();
  }

  const membership =
    currentUser
      ? await prisma.discussionGroupMember.findUnique({
          where: {
            groupId_userId: {
              groupId:
                group.id,

              userId:
                currentUser.id,
            },
          },

          select: {
            id: true,

            role: true,
            status: true,
          },
        })
      : null;

  // Private Group không để người ngoài đọc feed.
  if (
    group.visibility ===
      "PRIVATE" &&
    membership?.status !==
      "ACTIVE"
  ) {
    notFound();
  }

  const activeMemberCount =
    await prisma.discussionGroupMember.count({
      where: {
        groupId:
          group.id,

        status:
          "ACTIVE",
      },
    });

  const members =
    await prisma.discussionGroupMember.findMany({
      where: {
        groupId:
          group.id,

        status:
          "ACTIVE",
      },

      orderBy: {
        joinedAt:
          "asc",
      },

      take: 30,

      select: {
        id: true,

        role: true,

        joinedAt:
          true,

        user: {
          select: {
            id: true,

            username:
              true,

            avatarUrl:
              true,

            confirmedMbtiType:
              true,

            confirmedEnneagramType:
              true,
          },
        },
      },
    });

  const canManage =
    membership?.status ===
      "ACTIVE" &&
    (
      membership.role ===
        "OWNER" ||
      membership.role ===
        "MODERATOR"
    );

  const isOwner =
    membership?.status ===
      "ACTIVE" &&
    membership.role ===
      "OWNER";

  const pendingRequests =
    canManage
      ? await prisma.discussionGroupMember.findMany({
          where: {
            groupId:
              group.id,

            status:
              "PENDING",
          },

          orderBy: {
            joinedAt:
              "asc",
          },

          select: {
            id: true,

            joinedAt:
              true,

            user: {
              select: {
                username:
                  true,

                avatarUrl:
                  true,
              },
            },
          },
        })
      : [];

  // ========================================================
  // APPROVED GROUP POSTS ONLY
  // ========================================================

  const bannedMembers =
    canManage
      ? await prisma.discussionGroupMember.findMany({
          where: {
            groupId:
              group.id,

            status:
              "BANNED",
          },

          orderBy: {
            joinedAt:
              "desc",
          },

          select: {
            id: true,

            user: {
              select: {
                username:
                  true,

                avatarUrl:
                  true,
              },
            },
          },
        })
      : [];

  const groupPosts =
    await prisma.post.findMany({
      where: {
        groupId:
          group.id,

        moderationStatus:
          "APPROVED",

        publishedAt: {
          not: null,
        },
      },

      orderBy: {
        publishedAt:
          "desc",
      },

      take: 50,

      select: {
        id: true,

        title: true,
        content: true,

        authorName:
          true,

        authorImage:
          true,

        personalityTag:
          true,

        postKind:
          true,

        likesCount:
          true,

        publishedAt:
          true,

        forum: {
          select: {
            name: true,
            slug: true,
          },
        },

        citations: {
          orderBy: {
            sortOrder:
              "asc",
          },

          take: 3,

          select: {
            id: true,

            title: true,

            verificationStatus:
              true,
          },
        },

        _count: {
          select: {
            comments:
              { where: publicCommentWhere },
          },
        },
      },
    });

  return (
    <main className="min-h-screen bg-[#F7F5F1]">
      <header className="border-b border-[#DDD5C8] bg-[#FBFAF7]">
        <div className="mx-auto max-w-5xl px-4 py-7 md:px-6">
          <Link
            href="/discussion/groups"
            className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#8B7355] hover:underline"
          >
            ← Groups
          </Link>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-3xl">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-md bg-[#F1EBE2] px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#7D674C]">
                  {group.visibility}
                </span>

                <span className="rounded-md bg-[#F1EBE2] px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#7D674C]">
                  {group.joinPolicy}
                </span>
              </div>

              <h1 className="mt-3 font-serif text-3xl font-bold text-[#493A2D] md:text-4xl">
                {group.name}
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#746657]">
                {group.description}
              </p>

              <p className="mt-3 text-[10px] text-[#9A8A77]">
                {activeMemberCount} members · created by{" "}
                {group.creator.username ||
                  "MOSAIC member"}
              </p>
            </div>

            {userId ? (
              <GroupMembershipControls
                groupId={
                  group.id
                }
                joinPolicy={
                  group.joinPolicy
                }
                membership={
                  membership
                }
              />
            ) : (
              <Link
                href="/sign-in"
                className="rounded-lg bg-[#6D5337] px-5 py-2.5 text-[10px] font-bold text-white"
              >
                Đăng nhập để tham gia
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-5 px-4 py-6 md:px-6 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="space-y-5">
          <section className="rounded-xl border border-[#DDD4C7] bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#927A5E]">
                  Group discussion
                </p>

                <h2 className="mt-1 font-serif text-xl font-bold text-[#4E3D2E]">
                  Bài viết trong nhóm
                </h2>

                <p className="mt-1 text-[10px] text-[#958675]">
                  Chỉ bài đã vượt qua Publication Review mới xuất hiện.
                </p>
              </div>

              {membership?.status ===
                "ACTIVE" && (
                <Link
                  href={`/discussion/groups/${group.slug}/new`}
                  className="rounded-lg bg-[#6D5236] px-4 py-2.5 text-[9px] font-bold text-white transition hover:bg-[#533E29]"
                >
                  + Tạo bài trong Group
                </Link>
              )}
            </div>

            {groupPosts.length === 0 ? (
              <div className="mt-5 rounded-lg border border-dashed border-[#D9CEBF] bg-[#FAF8F4] p-8 text-center">
                <p className="font-serif text-lg font-bold text-[#584635]">
                  Chưa có bài viết đã được duyệt
                </p>

                <p className="mx-auto mt-2 max-w-lg text-[10px] leading-5 text-[#897A68]">
                  Submission mới sẽ đi qua Citation Verifier,
                  attachment moderation, AI review và MOSAIC policy
                  trước khi xuất hiện ở đây.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {groupPosts.map(
                  (post) => (
                    <article
                      key={
                        post.id
                      }
                      className="rounded-xl border border-[#DED5C8] bg-[#FCFBF8] p-5"
                    >
                      <div className="flex flex-wrap gap-2 text-[8px] font-bold uppercase tracking-[0.08em] text-[#88745B]">
                        <span className="rounded-md bg-[#F1EBE2] px-2 py-1">
                          {post.forum
                            ?.name ||
                            "System Forum"}
                        </span>

                        <span className="rounded-md bg-[#F1EBE2] px-2 py-1">
                          {
                            post.postKind
                          }
                        </span>

                        {post.personalityTag &&
                          post.personalityTag !==
                            "Chung" && (
                            <span className="rounded-md bg-[#F2EDF4] px-2 py-1 text-[#78617D]">
                              #
                              {
                                post.personalityTag
                              }
                            </span>
                          )}
                      </div>

                      <h3 className="mt-3 font-serif text-xl font-bold text-[#493A2D]">
                        {post.title}
                      </h3>

                      <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-[11px] leading-5 text-[#756858]">
                        {post.content}
                      </p>

                      {post.citations.length >
                        0 && (
                        <div className="mt-3 rounded-md border border-[#E5DED3] bg-white px-3 py-2.5">
                          <p className="text-[8px] font-extrabold uppercase tracking-[0.09em] text-[#998671]">
                            References
                          </p>

                          <div className="mt-1.5 space-y-1">
                            {post.citations.map(
                              (
                                citation,
                                index,
                              ) => (
                                <p
                                  key={
                                    citation.id
                                  }
                                  className="text-[9px] leading-4 text-[#81715F]"
                                >
                                  [
                                  {
                                    index +
                                    1
                                  }
                                  ]{" "}
                                  {
                                    citation.title
                                  }
                                  {" · "}
                                  <span className="font-bold">
                                    {
                                      citation.verificationStatus
                                    }
                                  </span>
                                </p>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEE7DD] pt-3">
                        <div className="flex items-center gap-2">
                          {post.authorImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={
                                post.authorImage
                              }
                              alt=""
                              className="h-6 w-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ECE4D9] text-[8px] font-bold text-[#806A4F]">
                              {post.authorName
                                .slice(
                                  0,
                                  1,
                                )
                                .toUpperCase()}
                            </div>
                          )}

                          <span className="text-[9px] font-semibold text-[#766653]">
                            {
                              post.authorName
                            }
                          </span>
                        </div>

                        <div className="flex gap-3 text-[9px] text-[#9A8A77]">
                          <span>
                            ♡{" "}
                            {
                              post.likesCount
                            }
                          </span>

                          <span>
                            ◌{" "}
                            {
                              post._count
                                .comments
                            }
                          </span>

                          {post.publishedAt && (
                            <span>
                              {post.publishedAt.toLocaleDateString(
                                "vi-VN",
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  ),
                )}
              </div>
            )}
          </section>

          {canManage &&
            pendingRequests.length >
              0 && (
              <section className="rounded-xl border border-amber-200 bg-amber-50/30 p-5">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-amber-800">
                  Join requests
                </p>

                <h2 className="mt-1 font-serif text-xl font-bold text-[#4F3D2D]">
                  Yêu cầu đang chờ
                </h2>

                <div className="mt-4 divide-y divide-amber-100">
                  {pendingRequests.map(
                    (request) => (
                      <div
                        key={
                          request.id
                        }
                        className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-[#594736]">
                            {request.user
                              .username ||
                              "MOSAIC member"}
                          </p>

                          <p className="mt-0.5 text-[9px] text-[#9A8872]">
                            Requested{" "}
                            {request.joinedAt.toLocaleDateString(
                              "vi-VN",
                            )}
                          </p>
                        </div>

                        <GroupRequestActions
                          membershipId={
                            request.id
                          }
                        />
                      </div>
                    ),
                  )}
                </div>
              </section>
            )}
        </div>

        <aside className="space-y-4">
          <section className="rounded-xl border border-[#DDD4C7] bg-white p-4">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#927A5E]">
              Group rules
            </p>

            {group.rules ? (
              <div className="mt-3 whitespace-pre-wrap text-[10px] leading-5 text-[#756757]">
                {group.rules}
              </div>
            ) : (
              <p className="mt-3 text-[10px] leading-5 text-[#918372]">
                Nhóm chưa có nội quy riêng. MOSAIC Discussion
                Standards vẫn được áp dụng.
              </p>
            )}
          </section>

          <section className="rounded-xl border border-[#DDD4C7] bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#927A5E]">
                Members
              </p>

              <span className="text-[9px] text-[#9C8D7B]">
                {
                  activeMemberCount
                }
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {members.map(
                (item) => (
                  <div
                    key={
                      item.id
                    }
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {item.user.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={
                              item.user
                                .avatarUrl
                            }
                            alt=""
                            className="h-7 w-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EEE7DC] text-[9px] font-bold text-[#806B50]">
                            {(item.user.username ||
                              "M")
                              .slice(
                                0,
                                1,
                              )
                              .toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate text-[10px] font-bold text-[#574534]">
                            {item.user
                              .username ||
                              "MOSAIC member"}
                          </p>

                          <p className="text-[8px] uppercase tracking-[0.05em] text-[#A0917F]">
                            {
                              item.role
                            }
                            {item.user
                              .confirmedMbtiType
                              ? ` · ${item.user.confirmedMbtiType}`
                              : ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    {isOwner &&
                      item.role !==
                        "OWNER" &&
                      item.user.id !==
                        currentUser?.id && (
                        <>
                          <GroupRoleAction
                          membershipId={
                            item.id
                          }
                          currentRole={
                            item.role ===
                            "MODERATOR"
                              ? "MODERATOR"
                              : "MEMBER"
                          }
                        />

                        <GroupGovernanceActions
                          membershipId={
                            item.id
                          }
                          targetRole={
                            item.role ===
                            "MODERATOR"
                              ? "MODERATOR"
                              : "MEMBER"
                          }
                          viewerRole="OWNER"
                        />
                        </>
                      )}

                    {!isOwner &&
                      canManage &&
                      item.role ===
                        "MEMBER" &&
                      item.user.id !==
                        currentUser?.id && (
                        <GroupGovernanceActions
                          membershipId={
                            item.id
                          }
                          targetRole="MEMBER"
                          viewerRole="MODERATOR"
                        />
                      )}
                  </div>
                ),
              )}
            </div>
          </section>

          {canManage &&
            bannedMembers.length > 0 && (
            <section className="rounded-xl border border-rose-200 bg-rose-50/40 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-rose-800">
                  Banned members
                </p>

                <span className="text-[9px] text-rose-700">
                  {
                    bannedMembers.length
                  }
                </span>
              </div>

              <div className="mt-3 space-y-3">
                {bannedMembers.map(
                  (item) => (
                    <div
                      key={
                        item.id
                      }
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[10px] font-bold text-[#5A4438]">
                          {
                            item.user
                              .username ||
                            "MOSAIC member"
                          }
                        </p>

                        <p className="mt-0.5 text-[8px] uppercase tracking-[0.07em] text-rose-700">
                          Banned
                        </p>
                      </div>

                      <GroupUnbanAction
                        membershipId={
                          item.id
                        }
                      />
                    </div>
                  ),
                )}
              </div>
            </section>
          )}

          <section className="rounded-xl border border-[#D8CCBA] bg-[#F2ECE3] p-4">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#856D50]">
              MOSAIC standard
            </p>

            <p className="mt-2 text-[10px] leading-5 text-[#75644F]">
              Group owner quản lý thành viên và nội quy cộng đồng,
              nhưng không thể bypass Citation Verifier,
              AI moderation hay publication policy của MOSAIC.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}
