import { identitySnapshot } from "@/lib/identity-consent";
import {
  beforeAll,
  afterAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { PrismaClient } from "@prisma/client";
const state = vi.hoisted(() => ({
  db: null as PrismaClient | null,
  clerkId: null as string | null,
  signed: vi.fn(async () => ({
    data: {
      signedUrl:
        "https://example.supabase.co/storage/v1/object/sign/profile-moments/example?token=qa",
    },
    error: null,
  })),
}));
vi.mock("@/lib/prisma", () => ({
  get prisma() {
    return state.db;
  },
}));
vi.mock("@clerk/nextjs/server", () => ({
  auth: async () => ({ userId: state.clerkId }),
  currentUser: async () => ({ fullName: "QA" }),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn(), revalidateTag: vi.fn(), unstable_cache: (fn: unknown) => fn }));
vi.mock("@/lib/supabase-admin", () => ({
  getSupabaseAdmin: () => ({
    storage: {
      from: () => ({
        createSignedUrl: state.signed,
        remove: async () => ({ error: null }),
      }),
    },
  }),
}));
import { saveOnboardingDraft } from "@/app/actions/onboarding";
import {
  listMoments,
  createMoment,
  updateMomentVisibility,
  deleteMoment,
} from "@/app/actions/moments";
import {
  setIdentityConsent,
  getIdentityConsents,
  getConfirmedIdentityStatistics,
} from "@/app/actions/identity-consent";
import { setTestStatisticsConsent } from "@/app/actions/test";
import { getFriendProfile } from "@/app/actions/friends";
import { GET as mediaGET } from "@/app/api/profile/moments/media/[id]/route";
import { friendsSummary } from '@/lib/friends-summary';
import { getOwnerProfileSummary } from '@/app/actions/profile';
import { GET as testHistoryGET } from '@/app/api/profile/test-results/route';
const url = process.env.MOSAIC_FEATURE_TEST_DATABASE_URL;
describe.skipIf(!url)(
  "local PostgreSQL moments, checkpoint and independent consents",
  () => {
    let db: PrismaClient;
    let owner: string, friend: string, stranger: string;
    const prefix = "feature-qa-";
    beforeAll(async () => {
      const parsed = new URL(url!);
      if (
        !["127.0.0.1", "localhost"].includes(parsed.hostname) ||
        !parsed.pathname.startsWith("/mosaic_")
      )
        throw Error("Only disposable local mosaic_ database.");
      db = new PrismaClient({ datasources: { db: { url } } });
      state.db = db;
    });
    beforeEach(async () => {
      await db.user.deleteMany({ where: { clerkId: { startsWith: prefix } } });
      const a = await db.user.create({
        data: {
          clerkId: prefix + "owner",
          username: "feature_owner",
          confirmedMbtiType: "INFP",
          confirmedMbtiSource: "MANUAL",
        },
      });
      const b = await db.user.create({ data: { clerkId: prefix + "friend" } });
      const c = await db.user.create({
        data: { clerkId: prefix + "stranger" },
      });
      owner = a.id;
      friend = b.id;
      stranger = c.id;
      await db.friendship.create({
        data: { senderId: owner, receiverId: friend, status: "ACCEPTED" },
      });
      state.clerkId = a.clerkId;
      state.signed.mockClear();
    });
    afterAll(async () => {
      await db.user.deleteMany({ where: { clerkId: { startsWith: prefix } } });
      await db.$disconnect();
    });
    it('returns actual mutual counts and respects blocks and identity privacy', async () => {
      await db.friendship.createMany({ data: [
        { senderId: owner, receiverId: stranger, status: 'ACCEPTED' },
        { senderId: friend, receiverId: stranger, status: 'ACCEPTED' },
      ] });
      await db.user.update({ where: { id: friend }, data: { displayName: 'Hidden', username: 'hidden_friend', avatarUrl: 'https://example.com/private.png', displayNameVisibility: 'PRIVATE', usernameVisibility: 'PRIVATE', avatarUrlVisibility: 'PRIVATE' } });
      const first = await friendsSummary();
      expect(first.users.find(u => u.id === friend)).toEqual({ id: friend, username: null, avatarUrl: null, mutualCount: 1 });
      await db.userBlock.create({ data: { blockerId: friend, blockedId: stranger } });
      expect((await friendsSummary()).users.find(u => u.id === friend)?.mutualCount).toBe(0);
      await db.userBlock.create({ data: { blockerId: stranger, blockedId: owner } });
      expect((await friendsSummary()).users.map(u => u.id)).toEqual([friend]);
    });
    it('loads a light owner summary and paginates attempts without answer details or cross-account access', async () => {
      await db.testResult.createMany({ data: Array.from({ length: 25 }, (_, i) => ({ id: `history-owner-${i}`, userId: owner, testType: 'MBTI', resultName: 'INFP', details: 'private answers', createdAt: new Date(Date.UTC(2026, 0, i + 1)) })) });
      await db.testResult.create({ data: { id: 'foreign-history', userId: stranger, testType: 'MBTI', resultName: 'ENTJ' } });
      const summary = await getOwnerProfileSummary();
      expect(summary.success).toBe(true); expect(summary.profile?.testResults).toEqual([]);
      const page = await (await testHistoryGET(new Request('https://mosaic.test/api/profile/test-results'))).json();
      expect(page.items).toHaveLength(20); expect(page.items[0].attemptNumber).toBe(25); expect(page.items[19].attemptNumber).toBe(6); expect(page.items.every((r: { details: unknown }) => r.details === null)).toBe(true);
      const second = await (await testHistoryGET(new Request(`https://mosaic.test/api/profile/test-results?cursor=${page.next}`))).json();
      expect(second.items).toHaveLength(5); expect(second.items[4].attemptNumber).toBe(1); expect(second.next).toBeUndefined();
      expect((await testHistoryGET(new Request('https://mosaic.test/api/profile/test-results?cursor=foreign-history'))).status).toBe(400);
      state.clerkId = null;
      expect((await testHistoryGET(new Request('https://mosaic.test/api/profile/test-results'))).status).toBe(401);
    });
    it("rejects invalid final drafts and duplicate usernames without partial writes", async () => {
      expect(
        (
          await saveOnboardingDraft(
            7,
            true,
            { username: "feature_owner", displayName: "Changed" },
            { mbtiType: "fake" },
          )
        ).success,
      ).toBe(false);
      expect(
        (await db.user.findUniqueOrThrow({ where: { id: owner } })).displayName,
      ).toBeNull();
      expect(
        (
          await saveOnboardingDraft(
            7,
            true,
            {
              username: "feature_owner",
              displayName: "Whole draft",
              dateOfBirth: "2000-01-01",
              interestCodes: ["reading"],
            },
            { mbtiType: "INTJ", socionicsType: "LII" },
          )
        ).success,
      ).toBe(true);
      expect(
        await db.user.findUniqueOrThrow({ where: { id: owner } }),
      ).toMatchObject({
        onboardingStep: 8,
        displayName: "Whole draft",
        confirmedMbtiType: "INTJ",
        socionicsType: "LII",
      });
      state.clerkId = prefix + "stranger";
      expect(
        (
          await saveOnboardingDraft(
            1,
            false,
            { username: "feature_owner", displayName: "Collision" },
            {},
          )
        ).success,
      ).toBe(false);
      expect(
        (await db.user.findUniqueOrThrow({ where: { id: stranger } }))
          .displayName,
      ).toBeNull();
    });
    it("filters personal moments for owner, accepted friend, stranger, guest and blocked viewer", async () => {
      for (const visibility of ["PUBLIC", "FRIENDS", "PRIVATE"] as const)
        await createMoment({ content: visibility, visibility, mediaIds: [] });
      expect((await listMoments(owner)).items).toHaveLength(3);
      state.clerkId = prefix + "friend";
      expect(
        (await listMoments(owner)).items.map((m) => m.content).sort(),
      ).toEqual(["FRIENDS", "PUBLIC"]);
      state.clerkId = prefix + "stranger";
      expect((await listMoments(owner)).items.map((m) => m.content)).toEqual([
        "PUBLIC",
      ]);
      state.clerkId = null;
      expect((await listMoments(owner)).items.map((m) => m.content)).toEqual([
        "PUBLIC",
      ]);
      await db.userBlock.create({
        data: { blockerId: owner, blockedId: friend },
      });
      state.clerkId = prefix + "friend";
      expect((await listMoments(owner)).items).toEqual([]);
    });
    it("rejects foreign/unfinalized uploads and does not create a partial moment", async () => {
      const upload = await db.momentUpload.create({
        data: {
          userId: stranger,
          path: "foreign",
          mimeType: "image/png",
          bytes: 12,
          finalized: true,
        },
      });
      expect(
        (
          await createMoment({
            content: "foreign",
            visibility: "PUBLIC",
            mediaIds: [upload.id],
          })
        ).success,
      ).toBe(false);
      await db.momentUpload.update({
        where: { id: upload.id },
        data: { userId: owner, finalized: false },
      });
      expect(
        (
          await createMoment({
            content: "unfinished",
            visibility: "PUBLIC",
            mediaIds: [upload.id],
          })
        ).success,
      ).toBe(false);
      expect(await db.moment.count({ where: { userId: owner } })).toBe(0);
    });
    it("checks media permissions before issuing signed URLs and reflects visibility changes", async () => {
      const moment = await db.moment.create({
        data: { userId: owner, content: "private file", visibility: "PRIVATE" },
      });
      const upload = await db.momentUpload.create({
        data: {
          userId: owner,
          path: "private",
          mimeType: "image/png",
          bytes: 12,
          finalized: true,
          momentId: moment.id,
        },
      });
      const request = () =>
        mediaGET(
          new Request(
            "https://mosaic.example/api/profile/moments/media/" + upload.id,
          ),
          { params: Promise.resolve({ id: upload.id }) },
        );
      state.clerkId = prefix + "friend";
      expect((await request()).status).toBe(404);
      expect(state.signed).not.toHaveBeenCalled();
      expect((await updateMomentVisibility(moment.id, "PUBLIC")).success).toBe(
        false,
      );
      expect((await deleteMoment(moment.id)).success).toBe(false);
      state.clerkId = prefix + "owner";
      expect((await updateMomentVisibility(moment.id, "FRIENDS")).success).toBe(
        true,
      );
      state.clerkId = prefix + "friend";
      expect((await request()).status).toBe(307);
      expect(state.signed).toHaveBeenCalledOnce();
      await db.userBlock.create({
        data: { blockerId: friend, blockedId: owner },
      });
      expect((await request()).status).toBe(404);
    });
    it("keeps test consent independent from manual/confirmed identity consent", async () => {
      const test = await db.testResult.create({
        data: { userId: owner, testType: "MBTI", resultName: "INFP" },
      });
      expect((await setTestStatisticsConsent(test.id, true)).success).toBe(
        true,
      );
      expect(await getIdentityConsents()).toEqual({
        MBTI: false,
        ENNEAGRAM: false,
      });
      expect((await getConfirmedIdentityStatistics()).mbti).toEqual({});
      expect(
        (
          await setIdentityConsent(
            "MBTI",
            true,
            identitySnapshot(
              await db.user.findUniqueOrThrow({ where: { id: owner } }),
              "MBTI",
            ),
          )
        ).success,
      ).toBe(true);
      expect((await getConfirmedIdentityStatistics()).mbti.INFP).toBe(1);
      await setTestStatisticsConsent(test.id, false);
      expect((await getIdentityConsents()).MBTI).toBe(true);
      expect((await getConfirmedIdentityStatistics()).mbti.INFP).toBe(1);
      await setIdentityConsent("MBTI", false);
      expect((await getConfirmedIdentityStatistics()).mbti).toEqual({});
      state.clerkId = prefix + "stranger";
      expect((await setTestStatisticsConsent(test.id, true)).success).toBe(
        false,
      );
    });
    it("rejects a stale identity consent submitted from another tab", async () => {
      const shown = identitySnapshot(
        await db.user.findUniqueOrThrow({ where: { id: owner } }),
        "MBTI",
      );
      await db.user.update({
        where: { id: owner },
        data: { confirmedMbtiType: "ENFP" },
      });
      expect((await setIdentityConsent("MBTI", true, shown)).success).toBe(
        false,
      );
      expect((await getIdentityConsents()).MBTI).toBe(false);
    });
    it("revokes old consent when identity changes and does not restore it on change back", async () => {
      await setIdentityConsent(
        "MBTI",
        true,
        identitySnapshot(
          await db.user.findUniqueOrThrow({ where: { id: owner } }),
          "MBTI",
        ),
      );
      await db.user.update({
        where: { id: owner },
        data: { confirmedMbtiType: "ENFP" },
      });
      expect((await getIdentityConsents()).MBTI).toBe(false);
      await db.user.update({
        where: { id: owner },
        data: { confirmedMbtiType: "INFP" },
      });
      expect((await getIdentityConsents()).MBTI).toBe(false);
      expect((await getConfirmedIdentityStatistics()).mbti).toEqual({});
    });
    it("returns public profile without exposing test attempts, private bio or private moment content", async () => {
      await db.user.update({
        where: { id: owner },
        data: { bio: "private bio", bioVisibility: "PRIVATE" },
      });
      await db.testResult.create({
        data: { userId: owner, testType: "MBTI", resultName: "INFP" },
      });
      state.clerkId = prefix + "stranger";
      const r = await getFriendProfile(owner);
      expect(r.success).toBe(true);
      if (r.success) {
        expect(r.profile.bio).toBeNull();
        expect("testResults" in r.profile).toBe(false);
        expect("identityConsents" in r.profile).toBe(false);
      }
    });
  },
);
