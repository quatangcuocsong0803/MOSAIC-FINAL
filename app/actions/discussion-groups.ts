"use server";
import { ensureUser } from "@/lib/ensure-user";

import { auth } from "@clerk/nextjs/server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

// ============================================================
// CURRENT DB USER
// ============================================================

async function getCurrentDbUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  // Một Clerk user mới vẫn có thể dùng Groups
  // ngay cả khi User row chưa được tạo ở flow khác.
  return ensureUser(userId);
}

// ============================================================
// SLUG
// ============================================================

function makeSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function uniqueSlug(name: string) {
  const base = makeSlug(name) || "group";

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const slug = attempt === 0 ? base : `${base}-${attempt + 1}`;

    const exists = await prisma.discussionGroup.findUnique({
      where: {
        slug,
      },

      select: {
        id: true,
      },
    });

    if (!exists) {
      return slug;
    }
  }

  return `${base}-${Date.now()}`;
}

// ============================================================
// CREATE
// ============================================================

export async function createDiscussionGroup(input: {
  name: string;
  description: string;

  rules?: string;

  visibility: "PUBLIC" | "PRIVATE";

  joinPolicy: "OPEN" | "APPROVAL" | "INVITE_ONLY";
}) {
  try {
    const user = await getCurrentDbUser();

    if (!user) {
      return {
        success: false as const,

        error: "Bạn cần đăng nhập.",
      };
    }

    const name = input.name?.trim();

    const description = input.description?.trim();

    const rules = input.rules?.trim() || null;

    if (!name || name.length < 3 || name.length > 70) {
      return {
        success: false as const,

        error: "Tên nhóm cần từ 3–70 ký tự.",
      };
    }

    if (!description || description.length < 30 || description.length > 700) {
      return {
        success: false as const,

        error: "Mô tả nhóm cần từ 30–700 ký tự.",
      };
    }

    if (rules && rules.length > 3000) {
      return {
        success: false as const,

        error: "Nội quy nhóm tối đa 3.000 ký tự.",
      };
    }

    const visibility = input.visibility === "PRIVATE" ? "PRIVATE" : "PUBLIC";

    const joinPolicy =
      input.joinPolicy === "APPROVAL" || input.joinPolicy === "INVITE_ONLY"
        ? input.joinPolicy
        : "OPEN";

    const slug = await uniqueSlug(name);

    const group = await prisma.$transaction(async (tx) => {
      const created = await tx.discussionGroup.create({
        data: {
          slug,
          name,
          description,
          rules,

          visibility,
          joinPolicy,

          creatorId: user.id,
        },
      });

      await tx.discussionGroupMember.create({
        data: {
          groupId: created.id,

          userId: user.id,

          role: "OWNER",

          status: "ACTIVE",
        },
      });

      return created;
    });

    revalidatePath("/discussion");

    revalidatePath("/discussion/groups");

    return {
      success: true as const,

      groupId: group.id,

      slug: group.slug,
    };
  } catch (error) {
    console.error("createDiscussionGroup error:", error);

    return {
      success: false as const,

      error: "Không thể tạo nhóm.",
    };
  }
}

// ============================================================
// JOIN / REQUEST JOIN
// ============================================================

export async function joinDiscussionGroup(groupId: string) {
  try {
    const user = await getCurrentDbUser();

    if (!user) {
      return {
        success: false as const,

        error: "Bạn cần đăng nhập.",
      };
    }

    const group = await prisma.discussionGroup.findFirst({
      where: {
        id: groupId,

        isActive: true,
      },

      select: {
        id: true,
        slug: true,

        joinPolicy: true,
      },
    });

    if (!group) {
      return {
        success: false as const,

        error: "Nhóm không tồn tại.",
      };
    }

    const existing = await prisma.discussionGroupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: group.id,

          userId: user.id,
        },
      },

      select: {
        id: true,
        role: true,
        status: true,
      },
    });

    if (existing?.status === "BANNED") {
      return {
        success: false as const,

        error: "Bạn không thể tham gia nhóm này.",
      };
    }

    if (existing?.status === "ACTIVE") {
      return {
        success: true as const,

        status: "ACTIVE" as const,
      };
    }

    if (existing?.status === "PENDING") {
      return {
        success: true as const,

        status: "PENDING" as const,
      };
    }

    if (group.joinPolicy === "INVITE_ONLY") {
      return {
        success: false as const,

        error: "Nhóm này chỉ tham gia bằng lời mời.",
      };
    }

    const status = group.joinPolicy === "APPROVAL" ? "PENDING" : "ACTIVE";

    await prisma.discussionGroupMember.create({
      data: {
        groupId: group.id,

        userId: user.id,

        role: "MEMBER",

        status,
      },
    });

    revalidatePath(`/discussion/groups/${group.slug}`);

    revalidatePath("/discussion/groups");

    return {
      success: true as const,

      status,
    };
  } catch (error) {
    console.error("joinDiscussionGroup error:", error);

    return {
      success: false as const,

      error: "Không thể tham gia nhóm.",
    };
  }
}

// ============================================================
// LEAVE / CANCEL PENDING REQUEST
// ============================================================

export async function leaveDiscussionGroup(groupId: string) {
  try {
    const user = await getCurrentDbUser();

    if (!user) {
      return {
        success: false as const,

        error: "Bạn cần đăng nhập.",
      };
    }

    const membership = await prisma.discussionGroupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,

          userId: user.id,
        },
      },

      include: {
        group: {
          select: {
            slug: true,
          },
        },
      },
    });

    if (!membership) {
      return {
        success: false as const,

        error: "Bạn chưa tham gia nhóm.",
      };
    }

    if (membership.role === "OWNER") {
      return {
        success: false as const,

        error: "Chủ nhóm không thể rời nhóm trước khi chuyển quyền sở hữu.",
      };
    }

    await prisma.discussionGroupMember.delete({
      where: {
        id: membership.id,
      },
    });

    revalidatePath(`/discussion/groups/${membership.group.slug}`);

    revalidatePath("/discussion/groups");

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("leaveDiscussionGroup error:", error);

    return {
      success: false as const,

      error: "Không thể rời nhóm.",
    };
  }
}

// ============================================================
// APPROVE / REJECT JOIN REQUEST
// ============================================================

export async function respondDiscussionGroupRequest(
  membershipId: string,
  approve: boolean,
) {
  try {
    const user = await getCurrentDbUser();

    if (!user) {
      return {
        success: false as const,

        error: "Bạn cần đăng nhập.",
      };
    }

    const request = await prisma.discussionGroupMember.findUnique({
      where: {
        id: membershipId,
      },

      include: {
        group: {
          select: {
            id: true,
            slug: true,
          },
        },
      },
    });

    if (!request || request.status !== "PENDING") {
      return {
        success: false as const,

        error: "Yêu cầu tham gia không còn tồn tại.",
      };
    }

    const manager = await prisma.discussionGroupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: request.groupId,

          userId: user.id,
        },
      },

      select: {
        role: true,
        status: true,
      },
    });

    const allowed =
      manager?.status === "ACTIVE" &&
      (manager.role === "OWNER" || manager.role === "MODERATOR");

    if (!allowed) {
      return {
        success: false as const,

        error: "Bạn không có quyền duyệt thành viên.",
      };
    }

    if (approve) {
      await prisma.discussionGroupMember.update({
        where: {
          id: request.id,
        },

        data: {
          status: "ACTIVE",

          role: "MEMBER",
        },
      });
    } else {
      await prisma.discussionGroupMember.delete({
        where: {
          id: request.id,
        },
      });
    }

    revalidatePath(`/discussion/groups/${request.group.slug}`);

    revalidatePath("/discussion/groups");

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("respondDiscussionGroupRequest error:", error);

    return {
      success: false as const,

      error: "Không thể xử lý yêu cầu tham gia.",
    };
  }
}

// ============================================================
// PROMOTE / DEMOTE MODERATOR
// OWNER ONLY
// ============================================================

export async function setDiscussionGroupMemberRole(
  membershipId: string,
  role: "MEMBER" | "MODERATOR",
) {
  try {
    const user = await getCurrentDbUser();

    if (!user) {
      return {
        success: false as const,

        error: "Bạn cần đăng nhập.",
      };
    }

    const target = await prisma.discussionGroupMember.findUnique({
      where: {
        id: membershipId,
      },

      include: {
        group: {
          select: {
            id: true,
            slug: true,
          },
        },
      },
    });

    if (!target || target.status !== "ACTIVE") {
      return {
        success: false as const,

        error: "Thành viên không hợp lệ.",
      };
    }

    if (target.role === "OWNER") {
      return {
        success: false as const,

        error: "Không thể thay đổi role của chủ nhóm bằng thao tác này.",
      };
    }

    const owner = await prisma.discussionGroupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: target.groupId,

          userId: user.id,
        },
      },

      select: {
        role: true,
        status: true,
      },
    });

    if (owner?.status !== "ACTIVE" || owner.role !== "OWNER") {
      return {
        success: false as const,

        error: "Chỉ chủ nhóm mới có thể thay đổi moderator.",
      };
    }

    await prisma.discussionGroupMember.update({
      where: {
        id: target.id,
      },

      data: {
        role,
      },
    });

    revalidatePath(`/discussion/groups/${target.group.slug}`);

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("setDiscussionGroupMemberRole error:", error);

    return {
      success: false as const,

      error: "Không thể cập nhật role thành viên.",
    };
  }
}

// ============================================================
// GROUP GOVERNANCE
// Remove / Ban / Unban / Transfer Ownership
// ============================================================

async function getGroupGovernanceContext(groupId: string) {
  const user = await getCurrentDbUser();

  if (!user) {
    return null;
  }

  const membership = await prisma.discussionGroupMember.findUnique({
    where: {
      groupId_userId: {
        groupId,
        userId: user.id,
      },
    },

    select: {
      id: true,
      role: true,
      status: true,
    },
  });

  if (!membership || membership.status !== "ACTIVE") {
    return null;
  }

  return {
    user,
    membership,
  };
}

// ============================================================
// REMOVE MEMBER
//
// Owner:
//   - MEMBER
//   - MODERATOR
//
// Moderator:
//   - MEMBER only
//
// Owner cannot remove self.
// ============================================================

export async function removeDiscussionGroupMember(membershipId: string) {
  try {
    const target = await prisma.discussionGroupMember.findUnique({
      where: {
        id: membershipId,
      },

      include: {
        group: {
          select: {
            id: true,
            slug: true,
          },
        },
      },
    });

    if (!target) {
      return {
        success: false as const,

        error: "Thành viên không tồn tại.",
      };
    }

    const context = await getGroupGovernanceContext(target.groupId);

    if (!context) {
      return {
        success: false as const,

        error: "Bạn không có quyền quản lý Group này.",
      };
    }

    if (target.userId === context.user.id) {
      return {
        success: false as const,

        error: "Không thể tự remove chính mình.",
      };
    }

    if (target.role === "OWNER") {
      return {
        success: false as const,

        error: "Không thể remove Owner.",
      };
    }

    const actorRole = context.membership.role;

    if (actorRole !== "OWNER" && actorRole !== "MODERATOR") {
      return {
        success: false as const,

        error: "Bạn không có quyền remove thành viên.",
      };
    }

    if (actorRole === "MODERATOR" && target.role !== "MEMBER") {
      return {
        success: false as const,

        error: "Moderator chỉ có thể remove Member.",
      };
    }

    await prisma.discussionGroupMember.delete({
      where: {
        id: target.id,
      },
    });

    revalidatePath(`/discussion/groups/${target.group.slug}`);

    revalidatePath("/discussion/groups");

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("removeDiscussionGroupMember error:", error);

    return {
      success: false as const,

      error: "Không thể remove thành viên.",
    };
  }
}

// ============================================================
// BAN MEMBER
//
// Giữ membership row với status=BANNED,
// để joinDiscussionGroup() tiếp tục fail closed.
// ============================================================

export async function banDiscussionGroupMember(membershipId: string) {
  try {
    const target = await prisma.discussionGroupMember.findUnique({
      where: {
        id: membershipId,
      },

      include: {
        group: {
          select: {
            id: true,
            slug: true,
          },
        },
      },
    });

    if (!target) {
      return {
        success: false as const,

        error: "Thành viên không tồn tại.",
      };
    }

    const context = await getGroupGovernanceContext(target.groupId);

    if (!context) {
      return {
        success: false as const,

        error: "Bạn không có quyền quản lý Group này.",
      };
    }

    if (target.userId === context.user.id) {
      return {
        success: false as const,

        error: "Không thể tự ban chính mình.",
      };
    }

    if (target.role === "OWNER") {
      return {
        success: false as const,

        error: "Không thể ban Owner.",
      };
    }

    const actorRole = context.membership.role;

    if (actorRole !== "OWNER" && actorRole !== "MODERATOR") {
      return {
        success: false as const,

        error: "Bạn không có quyền ban thành viên.",
      };
    }

    if (actorRole === "MODERATOR" && target.role !== "MEMBER") {
      return {
        success: false as const,

        error: "Moderator chỉ có thể ban Member.",
      };
    }

    await prisma.discussionGroupMember.update({
      where: {
        id: target.id,
      },

      data: {
        role: "MEMBER",

        status: "BANNED",
      },
    });

    revalidatePath(`/discussion/groups/${target.group.slug}`);

    revalidatePath("/discussion/groups");

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("banDiscussionGroupMember error:", error);

    return {
      success: false as const,

      error: "Không thể ban thành viên.",
    };
  }
}

// ============================================================
// UNBAN
//
// Owner/Moderator có thể unban.
// Xóa membership row để user trở lại trạng thái non-member,
// sau đó có thể join/request lại theo joinPolicy.
// ============================================================

export async function unbanDiscussionGroupMember(membershipId: string) {
  try {
    const target = await prisma.discussionGroupMember.findUnique({
      where: {
        id: membershipId,
      },

      include: {
        group: {
          select: {
            id: true,
            slug: true,
          },
        },
      },
    });

    if (!target || target.status !== "BANNED") {
      return {
        success: false as const,

        error: "Ban record không tồn tại.",
      };
    }

    const context = await getGroupGovernanceContext(target.groupId);

    if (!context) {
      return {
        success: false as const,

        error: "Bạn không có quyền quản lý Group này.",
      };
    }

    if (
      context.membership.role !== "OWNER" &&
      context.membership.role !== "MODERATOR"
    ) {
      return {
        success: false as const,

        error: "Bạn không có quyền unban.",
      };
    }

    await prisma.discussionGroupMember.delete({
      where: {
        id: target.id,
      },
    });

    revalidatePath(`/discussion/groups/${target.group.slug}`);

    revalidatePath("/discussion/groups");

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("unbanDiscussionGroupMember error:", error);

    return {
      success: false as const,

      error: "Không thể unban thành viên.",
    };
  }
}

// ============================================================
// TRANSFER OWNERSHIP
//
// OWNER only.
// Target must be ACTIVE Member/Moderator.
// Old owner becomes MODERATOR.
// ============================================================

export async function transferDiscussionGroupOwnership(membershipId: string) {
  try {
    const target = await prisma.discussionGroupMember.findUnique({
      where: {
        id: membershipId,
      },

      include: {
        group: {
          select: {
            id: true,
            slug: true,
          },
        },
      },
    });

    if (!target || target.status !== "ACTIVE") {
      return {
        success: false as const,

        error: "Người nhận quyền sở hữu phải là thành viên đang hoạt động.",
      };
    }

    if (target.role === "OWNER") {
      return {
        success: false as const,

        error: "Người này đã là Owner.",
      };
    }

    const context = await getGroupGovernanceContext(target.groupId);

    if (!context || context.membership.role !== "OWNER") {
      return {
        success: false as const,

        error: "Chỉ Owner mới có thể chuyển quyền sở hữu.",
      };
    }

    if (target.userId === context.user.id) {
      return {
        success: false as const,

        error: "Không thể chuyển quyền cho chính mình.",
      };
    }

    await prisma.$transaction(async (tx) => {
      // Serialize governance changes per group.
      await tx.$queryRaw`
          SELECT pg_advisory_xact_lock(
            hashtext(${`group-owner:${target.groupId}`})
          )
        `;

      const currentOwner = await tx.discussionGroupMember.findUnique({
        where: {
          groupId_userId: {
            groupId: target.groupId,

            userId: context.user.id,
          },
        },

        select: {
          id: true,
          role: true,
          status: true,
        },
      });

      const freshTarget = await tx.discussionGroupMember.findUnique({
        where: {
          id: target.id,
        },

        select: {
          id: true,
          role: true,
          status: true,
        },
      });

      if (
        !currentOwner ||
        currentOwner.role !== "OWNER" ||
        currentOwner.status !== "ACTIVE"
      ) {
        throw new Error("OWNER_CHANGED");
      }

      if (
        !freshTarget ||
        freshTarget.status !== "ACTIVE" ||
        freshTarget.role === "OWNER"
      ) {
        throw new Error("TARGET_CHANGED");
      }

      await tx.discussionGroupMember.update({
        where: {
          id: currentOwner.id,
        },

        data: {
          role: "MODERATOR",
        },
      });

      await tx.discussionGroupMember.update({
        where: {
          id: freshTarget.id,
        },

        data: {
          role: "OWNER",
        },
      });
    });

    revalidatePath(`/discussion/groups/${target.group.slug}`);

    revalidatePath("/discussion/groups");

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("transferDiscussionGroupOwnership error:", error);

    return {
      success: false as const,

      error: "Không thể chuyển quyền sở hữu. Hãy tải lại trang và thử lại.",
    };
  }
}
