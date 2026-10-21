"use server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { momentViewer } from "@/lib/moments";
import { revalidatePath } from "next/cache";
import type { ProfileVisibility } from "@prisma/client";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { MOMENT_BUCKET } from "@/lib/moments";
export async function listMoments(ownerId: string, cursor?: string) {
  const viewer = await momentViewer(ownerId);
  if (viewer.blocked) return { items: [], next: undefined };
  const items = await prisma.moment.findMany({
    where: {
      userId: ownerId,
      ...(!viewer.owner
        ? {
            visibility: {
              in: viewer.friend
                ? ["PUBLIC", "FRIENDS"]
                : (["PUBLIC"] as ProfileVisibility[]),
            },
          }
        : {}),
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: 21,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    select: {
      id: true,
      content: true,
      visibility: true,
      createdAt: true,
      media: { select: { id: true, mimeType: true } },
    },
  });
  return {
    items: items.slice(0, 20),
    next: items.length > 20 ? items[19].id : undefined,
  };
}
export async function createMoment(input: {
  content: string;
  visibility: ProfileVisibility;
  mediaIds: string[];
}) {
  try {
    const { userId } = await auth();
    if (!userId) throw Error("Vui lòng đăng nhập.");
    if (
      typeof input.content !== "string" ||
      input.content.length > 5000 ||
      !["PUBLIC", "FRIENDS", "PRIVATE"].includes(input.visibility) ||
      !Array.isArray(input.mediaIds) ||
      input.mediaIds.length > 4 ||
      input.mediaIds.some((id) => typeof id !== "string")
    )
      throw Error("Khoảnh khắc không hợp lệ.");
    const content = input.content.trim();
    const ids = [...new Set(input.mediaIds)];
    if (!content && !ids.length)
      throw Error("Hãy viết nội dung hoặc chọn ảnh/video.");
    const user = await prisma.user.findUniqueOrThrow({
      where: { clerkId: userId },
      select: { id: true },
    });
    await prisma.$transaction(async (tx) => {
      const uploads = await tx.momentUpload.findMany({
        where: {
          id: { in: ids },
          userId: user.id,
          momentId: null,
          finalized: true,
        },
      });
      if (uploads.length !== ids.length)
        throw Error(
          "Tệp đính kèm không thuộc tài khoản này hoặc đã được sử dụng.",
        );
      const moment = await tx.moment.create({
        data: { userId: user.id, content, visibility: input.visibility },
      });
      const assigned = await tx.momentUpload.updateMany({
        where: {
          id: { in: ids },
          userId: user.id,
          momentId: null,
          finalized: true,
        },
        data: { momentId: moment.id },
      });
      if (assigned.count !== ids.length)
        throw Error("Tệp đang được sử dụng. Hãy thử lại.");
    });
    revalidatePath("/profile");
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error:
        e instanceof Error && !(e as { code?: string }).code
          ? e.message
          : "Chưa đăng được Khoảnh khắc.",
    };
  }
}
export async function updateMomentVisibility(
  id: string,
  visibility: ProfileVisibility,
) {
  const { userId } = await auth();
  if (!userId || !["PUBLIC", "FRIENDS", "PRIVATE"].includes(visibility))
    return { success: false };
  const result = await prisma.moment.updateMany({
    where: { id, user: { clerkId: userId } },
    data: { visibility },
  });
  revalidatePath("/profile");
  return { success: result.count === 1 };
}
export async function deleteMoment(id: string) {
  const { userId } = await auth();
  if (!userId) return { success: false };
  const moment = await prisma.moment.findFirst({
    where: { id, user: { clerkId: userId } },
    include: { media: true },
  });
  if (!moment) return { success: false };
  await prisma.moment.delete({ where: { id: moment.id } });
  if (moment.media.length)
    await getSupabaseAdmin()
      .storage.from(MOMENT_BUCKET)
      .remove(moment.media.map((m) => m.path));
  revalidatePath("/profile");
  return { success: true };
}
