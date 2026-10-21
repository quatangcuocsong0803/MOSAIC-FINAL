import { prisma } from "@/lib/prisma";
// Prisma may emulate an upsert with an empty update. Recover the winning row
// when concurrent requests provision the same Clerk account.
export async function ensureUser(clerkId: string, displayName?: string | null) {
  try {
    return await prisma.user.upsert({
      where: { clerkId },
      update: {},
      create: { clerkId, displayName: displayName?.slice(0, 80) || null },
    });
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") {
      const existing = await prisma.user.findUnique({ where: { clerkId } });
      if (existing) return existing;
    }
    throw error;
  }
}
