import { beforeAll, afterAll, describe, expect, it, vi } from "vitest";
import { PrismaClient } from "@prisma/client";
import { discoverWhere, discoverSelect } from "../discover/query";
import { visibleProfile } from "../profile-policy";
import { formatMid } from "../mid";
const context = vi.hoisted(() => ({
  client: null as PrismaClient | null,
  clerkId: "profile-test-me",
}));
vi.mock("@/lib/prisma", () => ({
  get prisma() {
    return context.client;
  },
}));
vi.mock("@clerk/nextjs/server", () => ({
  auth: async () => ({ userId: context.clerkId }),
  currentUser: async () => ({ fullName: "Test Member" }),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
const url = process.env.MOSAIC_TEST_DATABASE_URL;
const { getUserProfile, updateUserProfile, saveTypology } =
  await import("@/app/actions/profile");
const { saveOnboardingStep } = await import("@/app/actions/onboarding");
const { getDiscoverUsers } = await import("@/app/actions/discover");
const { getFriendProfile } = await import("@/app/actions/friends");
describe.skipIf(!url)("disposable PostgreSQL profile integration", () => {
  let db: PrismaClient;
  beforeAll(async () => {
    const parsed = new URL(url!);
    if (
      !["localhost", "127.0.0.1"].includes(parsed.hostname) ||
      !parsed.pathname.startsWith("/mosaic_")
    )
      throw Error("Only a disposable local mosaic_ database is permitted.");
    db = new PrismaClient({ datasources: { db: { url } } });
    context.client = db;
    await db.user.deleteMany({
      where: {
        OR: [
          { clerkId: { startsWith: "concurrent-" } },
          {
            clerkId: {
              in: [
                "after-deletion",
                "explicit-mid",
                "profile-test-me",
                "privacy-target",
              ],
            },
          },
        ],
      },
    });
  });
  afterAll(async () => {
    await db?.$disconnect();
  });
  it("backfills legacy IDs by creation time and preserves old profiles", async () => {
    const rows = await db.user.findMany({
      where: { id: { in: ["old-a", "old-b", "old-c"] } },
      orderBy: { mid: "asc" },
    });
    expect(rows.map((u) => [u.id, u.mid])).toEqual([
      ["old-a", 1],
      ["old-b", 2],
      ["old-c", 3],
    ]);
    expect(rows.every((u) => u.onboardingCompletedAt)).toBe(true);
    expect(rows[0].hobbies).toBe("Reading");
    expect(rows[1].username).not.toBe("Same");
  });
  it("allocates unique IDs concurrently and never reuses deleted IDs", async () => {
    const rows = await Promise.all(
      Array.from({ length: 40 }, (_, i) =>
        db.user.create({ data: { clerkId: `concurrent-${i}` } }),
      ),
    );
    expect(new Set(rows.map((u) => u.mid)).size).toBe(40);
    const highest = rows.reduce((a, b) => (a.mid > b.mid ? a : b));
    await db.user.delete({ where: { id: highest.id } });
    const next = await db.user.create({ data: { clerkId: "after-deletion" } });
    expect(next.mid).toBeGreaterThan(highest.mid);
    await expect(
      db.user.update({ where: { id: next.id }, data: { mid: 999 } }),
    ).rejects.toThrow();
    await expect(
      db.user.create({ data: { clerkId: "explicit-mid", mid: 999 } }),
    ).rejects.toThrow();
  });
  it("provisions the same account concurrently without duplicate usernames or IDs", async () => {
    const rows = await Promise.all(
      Array.from({ length: 10 }, () => getUserProfile()),
    );
    expect(rows.every((r) => r.success)).toBe(true);
    expect(new Set(rows.map((r) => r.profile?.id)).size).toBe(1);
    expect(rows[0].profile?.onboardingStep).toBe(0);
    expect(rows[0].profile?.onboardingCompletedAt).toBeNull();
  });
  it("saves and resumes onboarding, allows manual location, then completes before Tests", async () => {
    expect(
      (await saveOnboardingStep(0, "next", { username: "" })).success,
    ).toBe(false);
    expect(
      (await saveOnboardingStep(0, "next", { username: "test_member" }))
        .success,
    ).toBe(true);
    expect(
      (await saveOnboardingStep(1, "next", { displayName: "Test member" }))
        .success,
    ).toBe(true);
    expect((await saveOnboardingStep(2, "next", {})).success).toBe(true);
    expect(
      (await saveOnboardingStep(3, "save", { location: "Hà Nội, Việt Nam" }))
        .success,
    ).toBe(true);
    const resumed = await getUserProfile();
    expect(resumed.profile?.onboardingStep).toBe(3);
    expect(resumed.profile?.location).toBe("Hà Nội, Việt Nam");
    expect(
      (await saveOnboardingStep(3, "back", {})).profile?.onboardingStep,
    ).toBe(2);
    await saveOnboardingStep(2, "next", {});
    await saveOnboardingStep(3, "next", {});
    expect(
      (await saveOnboardingStep(4, "next", { dateOfBirth: "2020-02-31" }))
        .success,
    ).toBe(false);
    expect(
      (await saveOnboardingStep(4, "next", { dateOfBirth: "2000-03-21" }))
        .success,
    ).toBe(true);
    await saveOnboardingStep(5, "next", {});
    await saveOnboardingStep(6, "next", {
      interestCodes: ["reading", "chess"],
    });
    const done = await saveOnboardingStep(7, "next", {});
    expect(done.profile?.onboardingCompletedAt).toBeTruthy();
    expect(
      (await getUserProfile()).profile?.onboardingCompletedAt,
    ).toBeTruthy();
  });
  it("edits names, rejects duplicate usernames and calculates zodiac server-side", async () => {
    const changed = await updateUserProfile({
      displayName: "Changed",
      dateOfBirth: "2000-01-20",
      zodiacSign: "Fake",
      visibility: { bio: "PRIVATE", avatarUrl: "PRIVATE" },
    });
    expect(changed.profile?.displayName).toBe("Changed");
    expect(changed.profile?.zodiacSign).toBe("Bảo Bình");
    expect((await updateUserProfile({ username: "SAME" })).success).toBe(false);
    expect(
      (await updateUserProfile({ interestCodes: ["invented"] })).success,
    ).toBe(false);
  });
  it("preserves legacy hobbies and unchanged usernames when editing unrelated fields", async () => {
    const previous = context.clerkId;
    context.clerkId = "legacy-b";
    const p = await getUserProfile();
    const edited = await updateUserProfile({
      username: p.profile!.username,
      displayName: "Legacy member",
      interestCodes: [],
      bio: "Updated biography",
    });
    expect(edited.success).toBe(true);
    expect(edited.profile?.hobbies).toBe("Books, Chess");
    context.clerkId = previous;
  });
  it("updates public typology after editing a test-selected identity", async () => {
    await db.user.update({
      where: { clerkId: context.clerkId },
      data: { confirmedMbtiType: "INTJ", confirmedMbtiSource: "TEST" },
    });
    const saved = await saveTypology({
      mbtiType: "ENFP",
      enneagramCore: "5",
      enneagramWing: "5w4",
      socionicsType: "LII",
      moralAlignment: "True Neutral",
    });
    expect(saved.success).toBe(true);
    expect(saved.profile?.confirmedMbtiType).toBe("ENFP");
    expect(saved.profile?.confirmedMbtiSource).toBe("MANUAL");
    expect(saved.profile?.socionicsType).toBe("LII");
    const invalid = await saveTypology({ temperament: "Invalid" });
    expect(invalid.success).toBe(false);
  });
  it("enforces stranger, friend and private fields in profile, search and interest filters", async () => {
    const me = await db.user.findUniqueOrThrow({
      where: { clerkId: context.clerkId },
    });
    const other = await db.user.create({
      data: {
        clerkId: "privacy-target",
        username: "privacy_target",
        displayName: "Target",
        bio: "hidden_marker",
        bioVisibility: "PRIVATE",
        location: "hidden_city",
        locationVisibility: "PRIVATE",
        hobbies: "Reading",
        interestCodes: ["reading"],
        hobbiesVisibility: "FRIENDS",
        dateOfBirth: new Date("1990-06-05"),
        avatarUrl: "https://example.com/avatar.png",
        avatarUrlVisibility: "FRIENDS",
      },
    });
    expect(
      await db.user.count({
        where: discoverWhere(me.id, null, null, { query: "hidden_city" }),
      }),
    ).toBe(0);
    expect(
      await db.user.count({
        where: {
          AND: [
            { id: other.id },
            discoverWhere(me.id, null, null, { interest: "reading" }),
          ],
        },
      }),
    ).toBe(0);
    const strangers = await getDiscoverUsers({
      tab: "community",
      query: formatMid(other.mid),
    });
    expect(strangers.users).toHaveLength(1);
    expect(
      (
        await getDiscoverUsers({
          tab: "suggested",
          query: formatMid(other.mid),
        })
      ).users,
    ).toHaveLength(1);
    expect(strangers.users[0].avatarUrl).toBeNull();
    expect(strangers.users[0].mid).toBe(formatMid(other.mid));
    const loggedIn = context.clerkId;
    context.clerkId = "";
    const guestProfile = await getFriendProfile(other.id);
    expect(guestProfile.success && guestProfile.profile.bio).toBeNull();
    expect(guestProfile.success && guestProfile.profile.avatarUrl).toBeNull();
    context.clerkId = loggedIn;
    const strangerProfile = await getFriendProfile(other.id);
    expect(strangerProfile.success && strangerProfile.profile.bio).toBeNull();
    await db.friendship.create({
      data: { senderId: me.id, receiverId: other.id, status: "ACCEPTED" },
    });
    const friends = await getDiscoverUsers({
      tab: "friends",
      interest: "reading",
    });
    expect(friends.users).toHaveLength(1);
    expect(friends.users[0].avatarUrl).toBe(other.avatarUrl);
    expect(friends.users[0].bio).toBeNull();
    expect(friends.users[0].age).toBeNull();
    const selected = await db.user.findUniqueOrThrow({
      where: { id: other.id },
      select: discoverSelect,
    });
    expect(visibleProfile(selected, true, false).bio).toBe("hidden_marker");
    const friendProfile = await getFriendProfile(other.id);
    expect(friendProfile.success && friendProfile.profile.bio).toBeNull();
    await db.userBlock.create({
      data: { blockerId: me.id, blockedId: other.id },
    });
    expect(
      (
        await getDiscoverUsers({
          tab: "community",
          query: formatMid(other.mid),
        })
      ).users,
    ).toHaveLength(0);
  });
});
