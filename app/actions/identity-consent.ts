"use server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  activeIdentityConsent,
  identitySnapshot,
} from "@/lib/identity-consent";
export async function getIdentityConsents() {
  const { userId } = await auth();
  if (!userId) return { MBTI: false, ENNEAGRAM: false };
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { identityConsents: true },
  });
  return {
    MBTI: Boolean(
      user?.identityConsents.some(
        (c) => c.kind === "MBTI" && activeIdentityConsent(user, c),
      ),
    ),
    ENNEAGRAM: Boolean(
      user?.identityConsents.some(
        (c) => c.kind === "ENNEAGRAM" && activeIdentityConsent(user, c),
      ),
    ),
  };
}
export async function setIdentityConsent(
  kind: "MBTI" | "ENNEAGRAM",
  consent: boolean,
  expected?: ReturnType<typeof identitySnapshot>,
) {
  try {
    const { userId } = await auth();
    if (
      !userId ||
      !["MBTI", "ENNEAGRAM"].includes(kind) ||
      typeof consent !== "boolean"
    )
      throw Error("Yêu cầu không hợp lệ.");
    await prisma.$transaction(async (tx) => {
      // Serialize with all identity-changing UPDATEs, including other browser tabs.
      const user = await tx.user.update({
        where: { clerkId: userId },
        data: {},
        include: { identityConsents: true },
      });
      await tx.$queryRaw`SELECT id FROM "User" WHERE id = ${user.id} FOR UPDATE`;
      const current = await tx.user.findUniqueOrThrow({
        where: { id: user.id },
      });
      const snapshot = identitySnapshot(current, kind);
      if (
        consent &&
        (!snapshot ||
          !expected ||
          snapshot.value !== expected.value ||
          snapshot.source !== expected.source ||
          snapshot.testResultId !== expected.testResultId)
      )
        throw Error(
          "Kết quả đã thay đổi. Hãy tải lại hồ sơ trước khi đồng ý chia sẻ.",
        );
      if (!snapshot && consent)
        throw Error("Hãy xác nhận kết quả trước khi chia sẻ.");
      if (consent)
        await tx.identityStatisticsConsent.upsert({
          where: { userId_kind: { userId: user.id, kind } },
          create: { userId: user.id, kind, ...snapshot! },
          update: {
            ...snapshot,
            consentedAt: new Date(),
            revokedAt: null,
            version: "identity-statistics-v1",
          },
        });
      else
        await tx.identityStatisticsConsent.updateMany({
          where: { userId: user.id, kind },
          data: { revokedAt: new Date() },
        });
    });
    revalidatePath("/statistics");
    revalidatePath("/profile");
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Chưa cập nhật được consent kết quả đã xác nhận.",
    };
  }
}
export async function getConfirmedIdentityStatistics() {
  const rows = await prisma.identityStatisticsConsent.findMany({
    where: { revokedAt: null },
    include: {
      user: {
        select: {
          confirmedMbtiType: true,
          confirmedMbtiSource: true,
          confirmedMbtiTestResultId: true,
          confirmedEnneagramType: true,
          confirmedEnneagramWing: true,
          confirmedEnneagramTritype: true,
          confirmedEnneagramSource: true,
          confirmedEnneagramTestResultId: true,
        },
      },
    },
  });
  const mbti: Record<string, number> = {},
    enneagram: Record<string, number> = {};
  let manual = 0,
    test = 0;
  for (const row of rows) {
    if (!activeIdentityConsent(row.user, row)) continue;
    const value =
      row.kind === "MBTI"
        ? row.user.confirmedMbtiType
        : row.user.confirmedEnneagramType;
    if (!value) continue;
    const group = row.kind === "MBTI" ? mbti : enneagram;
    group[value] = (group[value] || 0) + 1;
    row.source === "MANUAL" ? manual++ : test++;
  }
  return { mbti, enneagram, manual, test };
}
