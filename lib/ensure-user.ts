import { prisma } from '@/lib/prisma';
// Clerk IDs are unique. Keep provisioning idempotent under concurrent requests.
export async function ensureUser(clerkId: string, displayName?: string | null) {
  return prisma.user.upsert({where:{clerkId},update:{},create:{clerkId,displayName:displayName?.slice(0,80)||null}});
}
