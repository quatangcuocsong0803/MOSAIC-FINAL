"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { birthFacts, PRIVATE_FIELDS, type VisibilitySettings } from "@/lib/profile-policy";
import { INTEREST_CODES, interestLabels } from "@/lib/interests";
import { validateExtraTypology, type TypologyInput } from "@/lib/typology";
import { formatMid } from "@/lib/mid";
import { ensureUser } from "@/lib/ensure-user";

export interface UpdateUserProfileInput {
  username?: string | null;
  displayName?: string | null;
  interestCodes?: string[];
  visibility?: Partial<VisibilitySettings>;
  dateOfBirth?: string | Date | null;
  zodiacSign?: string | null;
  hobbies?: string | null;
  location?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
}

export interface TestResultItem {
  id: string;
  testType: string;
  testVariant: string | null;
  resultName: string;
  details: string | null;

  statisticsConsent: boolean;
  statisticsConsentVersion: string | null;
  statisticsConsentedAt: Date | null;
  statisticsConsentRevokedAt: Date | null;

  createdAt: Date;
}

export type PersonalityKind = "MBTI" | "ENNEAGRAM";
export type PersonalityTypeSource = "MANUAL" | "TEST";

export interface UserProfileData {
  id: string;
  clerkId: string;
  username: string | null;
  socionicsType: string | null;
  attitudinalPsyche: string | null;
  instinctStack: string | null;
  moralAlignment: string | null;
  temperament: string | null;
  sloanType: string | null;
  mid: string;
  displayName: string | null;
  interestCodes: string[];
  visibility: VisibilitySettings;
  age: number | null;
  onboardingStep: number;
  onboardingCompletedAt: Date | null;
  dateOfBirth: Date | null;
  zodiacSign: string | null;
  hobbies: string | null;
  location: string | null;
  bio: string | null;
  avatarUrl?: string | null;

  // Type user tự chọn thủ công.
  manualMbtiType: string | null;

  manualEnneagramType: string | null;
  manualEnneagramWing: string | null;
  manualEnneagramTritype: string | null;

  // Identity đã được user xác nhận.
  // Profile public + Discover + Discussion phải dùng nhóm field này.
  confirmedMbtiType: string | null;
  confirmedMbtiSource: string | null;
  confirmedMbtiTestResultId: string | null;

  confirmedEnneagramType: string | null;
  confirmedEnneagramWing: string | null;
  confirmedEnneagramTritype: string | null;
  confirmedEnneagramSource: string | null;
  confirmedEnneagramTestResultId: string | null;

  testResults: TestResultItem[];
}

export interface SaveManualPersonalityTypesInput {
  mbtiType?: string | null;

  enneagramCore?: string | number | null;
  enneagramWing?: string | null;
  enneagramTritype?: string | null;
}

export interface ConfirmTestPersonalityTypeInput {
  kind: PersonalityKind;
  testResultId: string;
}

const ALL_MBTI_TYPES = new Set([
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
]);

const ENNEAGRAM_WINGS: Record<number, [number, number]> = {
  1: [9, 2],
  2: [1, 3],
  3: [2, 4],
  4: [3, 5],
  5: [4, 6],
  6: [5, 7],
  7: [6, 8],
  8: [7, 9],
  9: [8, 1],
};

const HEART_TYPES = new Set([2, 3, 4]);
const HEAD_TYPES = new Set([5, 6, 7]);
const GUT_TYPES = new Set([8, 9, 1]);

function normalizeMbtiType(
  value: string
): string | null {
  const normalized = value
    .trim()
    .toUpperCase();

  return ALL_MBTI_TYPES.has(normalized)
    ? normalized
    : null;
}

function normalizeEnneagramCore(
  value: string | number
): number | null {
  if (typeof value === "number") {
    return Number.isInteger(value) &&
      value >= 1 &&
      value <= 9
      ? value
      : null;
  }

  const normalized = value
    .trim()
    .toUpperCase();

  const match = normalized.match(
    /^(?:TYPE\s*)?([1-9])$/
  );

  return match
    ? Number(match[1])
    : null;
}

function normalizeEnneagramWing(
  core: number,
  value: string
): string | null {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");

  const match = normalized.match(
    /^([1-9])w([1-9])$/
  );

  if (!match) {
    return null;
  }

  const wingCore = Number(match[1]);
  const wing = Number(match[2]);

  if (wingCore !== core) {
    return null;
  }

  if (
    !ENNEAGRAM_WINGS[core]?.includes(wing)
  ) {
    return null;
  }

  return `${core}w${wing}`;
}

/**
 * MOSAIC hiện tạo tritype theo thứ tự cố định:
 * Heart → Head → Gut.
 *
 * Ví dụ:
 * - Heart: 4
 * - Head: 5
 * - Gut: 8
 * => code canonical: "458"
 *
 * Core phải xuất hiện đúng tại center của nó.
 */
function normalizeEnneagramTritype(
  core: number,
  value: string
): string | null {
  const normalized = value
    .trim()
    .replace(/\D/g, "");

  if (normalized.length !== 3) {
    return null;
  }

  const heart = Number(normalized[0]);
  const head = Number(normalized[1]);
  const gut = Number(normalized[2]);

  if (
    !HEART_TYPES.has(heart) ||
    !HEAD_TYPES.has(head) ||
    !GUT_TYPES.has(gut)
  ) {
    return null;
  }

  if (
    HEART_TYPES.has(core) &&
    heart !== core
  ) {
    return null;
  }

  if (
    HEAD_TYPES.has(core) &&
    head !== core
  ) {
    return null;
  }

  if (
    GUT_TYPES.has(core) &&
    gut !== core
  ) {
    return null;
  }

  return `${heart}${head}${gut}`;
}

function extractEnneagramCoreFromResult(
  raw: string
): number | null {
  const match = raw.match(/[1-9]/);

  return match
    ? Number(match[0])
    : null;
}

function extractEnneagramWingFromText(
  core: number,
  raw: string
): string | null {
  const match = raw.match(
    /\b([1-9])\s*[wW]\s*([1-9])\b/
  );

  if (!match) {
    return null;
  }

  return normalizeEnneagramWing(
    core,
    `${match[1]}w${match[2]}`
  );
}

function extractEnneagramTritypeFromText(
  core: number,
  raw: string
): string | null {
  // Ưu tiên code đúng format project: Heart → Head → Gut.
  const matches = raw.match(
    /\b[234][567][891]\b/g
  );

  if (!matches) {
    return null;
  }

  for (const candidate of matches) {
    const valid =
      normalizeEnneagramTritype(
        core,
        candidate
      );

    if (valid) {
      return valid;
    }
  }

  return null;
}

async function getOrCreateCurrentUser(
  clerkId: string
) {
  let user =
    await prisma.user.findUnique({
      where: {
        clerkId,
      },

      include: {
        testResults: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

  if (user) {
    return user;
  }

  const clerkUser = await currentUser();
  await ensureUser(clerkId, clerkUser?.fullName);
  user = await prisma.user.findUniqueOrThrow({where:{clerkId},include:{testResults:{orderBy:{createdAt:"desc"}}}});

  return user;
}

function serializeUserProfile(
  user: any
): UserProfileData {
  return {
    id: user.id,
    clerkId: user.clerkId,
    username: user.username,
    mid: formatMid(user.mid),
    socionicsType: user.socionicsType,
    attitudinalPsyche: user.attitudinalPsyche,
    instinctStack: user.instinctStack,
    moralAlignment: user.moralAlignment,
    temperament: user.temperament,
    sloanType: user.sloanType,
    displayName: user.displayName ?? user.username,
    interestCodes: user.interestCodes ?? [],
    visibility: Object.fromEntries(PRIVATE_FIELDS.map(field => [field, user[`${field}Visibility`]])) as VisibilitySettings,
    age: birthFacts(user.dateOfBirth).age,
    onboardingStep: user.onboardingStep,
    onboardingCompletedAt: user.onboardingCompletedAt,
    dateOfBirth: user.dateOfBirth,
    zodiacSign: birthFacts(user.dateOfBirth).zodiacSign,
    hobbies: user.hobbies,
    location: user.location,
    bio: user.bio,
    avatarUrl:
      user.avatarUrl ?? null,

    manualMbtiType:
      user.manualMbtiType ?? null,

    manualEnneagramType:
      user.manualEnneagramType ?? null,

    manualEnneagramWing:
      user.manualEnneagramWing ?? null,

    manualEnneagramTritype:
      user.manualEnneagramTritype ?? null,

    confirmedMbtiType:
      user.confirmedMbtiType ?? null,

    confirmedMbtiSource:
      user.confirmedMbtiSource ?? null,

    confirmedMbtiTestResultId:
      user.confirmedMbtiTestResultId ??
      null,

    confirmedEnneagramType:
      user.confirmedEnneagramType ??
      null,

    confirmedEnneagramWing:
      user.confirmedEnneagramWing ??
      null,

    confirmedEnneagramTritype:
      user.confirmedEnneagramTritype ??
      null,

    confirmedEnneagramSource:
      user.confirmedEnneagramSource ??
      null,

    confirmedEnneagramTestResultId:
      user.confirmedEnneagramTestResultId ??
      null,

    testResults:
      user.testResults || [],
  };
}

function revalidatePersonalityPaths() {
  revalidatePath("/");
  revalidatePath("/profile");
  revalidatePath("/discover");
  revalidatePath("/discussion");
}

/**
 * Lấy profile của user hiện tại.
 */
export async function getUserProfile(): Promise<{
  success: boolean;
  profile?: UserProfileData | null;
  error?: string;
}> {
  try {
    const { userId } =
      await auth();

    if (!userId) {
      return {
        success: false,
        error:
          "Chưa đăng nhập",
      };
    }

    const user =
      await getOrCreateCurrentUser(
        userId
      );

    return {
      success: true,
      profile:
        serializeUserProfile(
          user
        ),
    };
  } catch (error) {
    console.error(
      "Lỗi khi lấy thông tin profile:",
      error
    );

    return {
      success: false,
      error:
        "Không thể lấy thông tin profile.",
    };
  }
}

/**
 * Chỉ trả identity đã được user xác nhận.
 *
 * Discussion có thể dùng action này thay cho localStorage.
 */
export async function getConfirmedPersonalityIdentity(): Promise<{
  success: boolean;
  identity?: {
    mbtiType: string | null;

    enneagramType: string | null;
    enneagramWing: string | null;
    enneagramTritype: string | null;
  };
  error?: string;
}> {
  try {
    const { userId } =
      await auth();

    if (!userId) {
      return {
        success: false,
        error:
          "Chưa đăng nhập",
      };
    }

    const user =
      await prisma.user.findUnique({
        where: {
          clerkId: userId,
        },

        select: {
          confirmedMbtiType: true,

          confirmedEnneagramType: true,
          confirmedEnneagramWing: true,
          confirmedEnneagramTritype: true,
        },
      });

    return {
      success: true,

      identity: {
        mbtiType:
          user?.confirmedMbtiType ??
          null,

        enneagramType:
          user?.confirmedEnneagramType ??
          null,

        enneagramWing:
          user?.confirmedEnneagramWing ??
          null,

        enneagramTritype:
          user?.confirmedEnneagramTritype ??
          null,
      },
    };
  } catch (error) {
    console.error(
      "Lỗi lấy confirmed personality identity:",
      error
    );

    return {
      success: false,
      error:
        "Không thể lấy personality identity.",
    };
  }
}

/**
 * Cập nhật các field profile cơ bản.
 */
export async function updateUserProfile(
  dataOrFormData:
    | UpdateUserProfileInput
    | FormData
): Promise<{
  success: boolean;
  error?: string;
  profile?: UserProfileData;
}> {
  try {
    const { userId } =
      await auth();

    if (!userId) {
      return {
        success: false,
        error:
          "Bạn chưa đăng nhập.",
      };
    }

    let input: UpdateUserProfileInput =
      {};

    if (
      dataOrFormData &&
      typeof (dataOrFormData as any)
        .get === "function"
    ) {
      const fd =
        dataOrFormData as FormData;

      const pick = (
        key: string
      ) =>
        fd.has(key)
          ? ((fd.get(
              key
            ) as string) ||
              null)
          : undefined;

      input = {
        dateOfBirth:
          pick("dateOfBirth"),

        zodiacSign:
          pick("zodiacSign"),

        hobbies:
          pick("hobbies"),

        location:
          pick("location"),

        bio:
          pick("bio"),

        avatarUrl:
          pick("avatarUrl"),
      };
    } else if (
      dataOrFormData &&
      typeof dataOrFormData ===
        "object"
    ) {
      input =
        dataOrFormData as UpdateUserProfileInput;
    }

    const trimOrNull = (
      value:
        | string
        | null
        | undefined
    ) =>
      value &&
      value.trim().length > 0
        ? value.trim()
        : null;

    const data: Record<
      string,
      unknown
    > = {};

    if (
      input.dateOfBirth !==
      undefined
    ) {
      let parsedDob:
        | Date
        | null = null;

      if (input.dateOfBirth) {
        const date =
          new Date(
            input.dateOfBirth
          );

        if (
          !isNaN(
            date.getTime()
          )
) {
          if (date > new Date() || date.getUTCFullYear() < 1900) return {success:false,error:"Ngày sinh không hợp lệ."};
          parsedDob = date;
        } else return {success:false,error:"Ngày sinh không hợp lệ."};
      }

      data.dateOfBirth =
        parsedDob;
    }

    // Ignore client-supplied zodiac; derive it from DOB only.
    if (input.dateOfBirth !== undefined) data.zodiacSign = birthFacts(data.dateOfBirth as Date | null).zodiacSign;
    if (input.username !== undefined) {
      const username = input.username?.trim().toLowerCase();
      if (!username || !/^[a-z0-9_]{3,30}$/.test(username)) return {success:false,error:"Username cần 3–30 chữ cái, số hoặc dấu gạch dưới."};
      data.username = username;
    }
    if (input.displayName !== undefined) {
      const name = input.displayName?.trim();
      if (!name || name.length > 80) return {success:false,error:"Tên hiển thị cần 1–80 ký tự."};
      data.displayName = name;
    }
    if (input.interestCodes !== undefined) {
      if (!Array.isArray(input.interestCodes) || input.interestCodes.length > 50 || input.interestCodes.some(code => typeof code !== 'string' || !INTEREST_CODES.has(code))) return {success:false,error:"Sở thích không hợp lệ."};
      data.interestCodes = [...new Set(input.interestCodes)];
      data.hobbies = interestLabels(data.interestCodes as string[]) || null;
    }
    if (input.visibility !== undefined) {
      if (!input.visibility || typeof input.visibility !== 'object') return {success:false,error:"Quyền hiển thị không hợp lệ."};
      for (const [field, value] of Object.entries(input.visibility)) {
        if (!(PRIVATE_FIELDS as readonly string[]).includes(field) || !['PUBLIC','FRIENDS','PRIVATE'].includes(value)) return {success:false,error:"Quyền hiển thị không hợp lệ."};
        data[`${field}Visibility`] = value;
      }
    }
    if (
      input.hobbies !==
      undefined && input.interestCodes === undefined
    ) {
      data.hobbies =
        trimOrNull(
          input.hobbies
        );
    }

    if (
      input.location !==
      undefined
    ) {
      data.location =
        trimOrNull(
          input.location
        );
    }

    if (
      input.bio !==
      undefined
    ) {
      data.bio =
        trimOrNull(
          input.bio
        );
    }

    if (
      input.avatarUrl !==
      undefined
    ) {
      data.avatarUrl =
        trimOrNull(
          input.avatarUrl
        );
    }

    await getOrCreateCurrentUser(userId);

    const updatedUser =
      await prisma.user.update({
        where: { clerkId: userId },
        data,

        include: {
          testResults: {
            orderBy: {
              createdAt:
                "desc",
            },
          },
        },
      });

    revalidatePersonalityPaths();

    return {
      success: true,

      profile:
        serializeUserProfile(
          updatedUser
        ),
    };
  } catch (error: any) {
    if (error?.code === "P2002") return {success:false,error:"Username đã được sử dụng."};
    console.error(
      "Lỗi cập nhật profile:",
      error
    );

    return {
      success: false,

      error:
        error?.message
          ? `Lỗi cập nhật profile: ${error.message}`
          : "Có lỗi xảy ra khi cập nhật hồ sơ.",
    };
  }
}

/**
 * Lưu personality do user tự CHỌN.
 *
 * Frontend sẽ dùng select/dropdown.
 * Backend vẫn whitelist lại toàn bộ giá trị để chống request giả.
 *
 * Nếu identity hiện tại đang là MANUAL,
 * chỉnh manual sẽ cập nhật identity luôn.
 *
 * Nếu identity hiện tại đang là TEST,
 * chỉnh manual chỉ lưu lựa chọn manual;
 * không âm thầm thay identity cho tới khi user xác nhận "Dùng thủ công".
 */
export async function saveManualPersonalityTypes(
  input: SaveManualPersonalityTypesInput
): Promise<{
  success: boolean;
  profile?: UserProfileData;
  error?: string;
}> {
  try {
    const { userId } =
      await auth();

    if (!userId) {
      return {
        success: false,
        error:
          "Bạn cần đăng nhập để cập nhật type.",
      };
    }

    const user =
      await getOrCreateCurrentUser(
        userId
      );

    const data: Record<
      string,
      unknown
    > = {};

    // ========================================================
    // MBTI
    // ========================================================

    if (
      input.mbtiType !==
      undefined
    ) {
      const raw =
        input.mbtiType?.trim() ??
        "";

      if (!raw) {
        data.manualMbtiType =
          null;

        if (
          user.confirmedMbtiSource ===
          "MANUAL"
        ) {
          data.confirmedMbtiType =
            null;

          data.confirmedMbtiSource =
            null;

          data.confirmedMbtiTestResultId =
            null;
        }
      } else {
        const mbti =
          normalizeMbtiType(
            raw
          );

        if (!mbti) {
          return {
            success: false,
            error:
              "MBTI không hợp lệ. Chỉ chấp nhận 1 trong 16 type chuẩn.",
          };
        }

        data.manualMbtiType =
          mbti;

        if (
          !user.confirmedMbtiType ||
          user.confirmedMbtiSource ===
            "MANUAL"
        ) {
          data.confirmedMbtiType =
            mbti;

          data.confirmedMbtiSource =
            "MANUAL";

          data.confirmedMbtiTestResultId =
            null;
        }
      }
    }

    // ========================================================
    // ENNEAGRAM
    // ========================================================

    const hasAnyEnneagramInput =
      input.enneagramCore !==
        undefined ||
      input.enneagramWing !==
        undefined ||
      input.enneagramTritype !==
        undefined;

    if (hasAnyEnneagramInput) {
      const rawCore =
        input.enneagramCore;

      if (
        rawCore === null ||
        rawCore === undefined ||
        String(rawCore).trim() ===
          ""
      ) {
        data.manualEnneagramType =
          null;

        data.manualEnneagramWing =
          null;

        data.manualEnneagramTritype =
          null;

        if (
          user.confirmedEnneagramSource ===
          "MANUAL"
        ) {
          data.confirmedEnneagramType =
            null;

          data.confirmedEnneagramWing =
            null;

          data.confirmedEnneagramTritype =
            null;

          data.confirmedEnneagramSource =
            null;

          data.confirmedEnneagramTestResultId =
            null;
        }
      } else {
        const core =
          normalizeEnneagramCore(
            rawCore
          );

        if (!core) {
          return {
            success: false,
            error:
              "Enneagram core không hợp lệ. Chỉ chấp nhận Type 1 đến Type 9.",
          };
        }

        let wing:
          | string
          | null = null;

        if (
          input.enneagramWing &&
          input.enneagramWing.trim()
        ) {
          wing =
            normalizeEnneagramWing(
              core,
              input.enneagramWing
            );

          if (!wing) {
            return {
              success: false,
              error:
                `Wing không hợp lệ cho Type ${core}. Chỉ được chọn ${core}w${ENNEAGRAM_WINGS[core][0]} hoặc ${core}w${ENNEAGRAM_WINGS[core][1]}.`,
            };
          }
        }

        let tritype:
          | string
          | null = null;

        if (
          input.enneagramTritype &&
          input.enneagramTritype.trim()
        ) {
          tritype =
            normalizeEnneagramTritype(
              core,
              input.enneagramTritype
            );

          if (!tritype) {
            return {
              success: false,
              error:
                "Tritype không hợp lệ. MOSAIC yêu cầu đúng 1 Heart fix (2/3/4), 1 Head fix (5/6/7), 1 Gut fix (8/9/1), và phải chứa core ở đúng center.",
            };
          }
        }

        data.manualEnneagramType =
          `Type ${core}`;

        data.manualEnneagramWing =
          wing;

        data.manualEnneagramTritype =
          tritype;

        if (
          !user.confirmedEnneagramType ||
          user.confirmedEnneagramSource ===
            "MANUAL"
        ) {
          data.confirmedEnneagramType =
            `Type ${core}`;

          data.confirmedEnneagramWing =
            wing;

          data.confirmedEnneagramTritype =
            tritype;

          data.confirmedEnneagramSource =
            "MANUAL";

          data.confirmedEnneagramTestResultId =
            null;
        }
      }
    }

    if (
      Object.keys(data).length ===
      0
    ) {
      return {
        success: false,
        error:
          "Không có personality type nào để cập nhật.",
      };
    }

    const updated =
      await prisma.user.update({
        where: {
          id: user.id,
        },

        data,

        include: {
          testResults: {
            orderBy: {
              createdAt:
                "desc",
            },
          },
        },
      });

    revalidatePersonalityPaths();

    return {
      success: true,

      profile:
        serializeUserProfile(
          updated
        ),
    };
  } catch (error) {
    console.error(
      "Lỗi lưu manual personality:",
      error
    );

    return {
      success: false,
      error:
        "Không thể lưu personality thủ công lúc này.",
    };
  }
}

/**
 * Dùng manual personality làm identity hiển thị.
 */
export async function confirmManualPersonalityType(
  kind: PersonalityKind
): Promise<{
  success: boolean;
  profile?: UserProfileData;
  error?: string;
}> {
  try {
    const { userId } =
      await auth();

    if (!userId) {
      return {
        success: false,
        error:
          "Bạn cần đăng nhập để xác nhận type.",
      };
    }

    const user =
      await getOrCreateCurrentUser(
        userId
      );

    let data: Record<
      string,
      unknown
    >;

    if (kind === "MBTI") {
      if (
        !user.manualMbtiType
      ) {
        return {
          success: false,
          error:
            "Bạn chưa chọn MBTI thủ công.",
        };
      }

      data = {
        confirmedMbtiType:
          user.manualMbtiType,

        confirmedMbtiSource:
          "MANUAL",

        confirmedMbtiTestResultId:
          null,
      };
    } else {
      if (
        !user.manualEnneagramType
      ) {
        return {
          success: false,
          error:
            "Bạn chưa chọn Enneagram thủ công.",
        };
      }

      data = {
        confirmedEnneagramType:
          user.manualEnneagramType,

        confirmedEnneagramWing:
          user.manualEnneagramWing,

        confirmedEnneagramTritype:
          user.manualEnneagramTritype,

        confirmedEnneagramSource:
          "MANUAL",

        confirmedEnneagramTestResultId:
          null,
      };
    }

    const updated =
      await prisma.user.update({
        where: {
          id: user.id,
        },

        data,

        include: {
          testResults: {
            orderBy: {
              createdAt:
                "desc",
            },
          },
        },
      });

    revalidatePersonalityPaths();

    return {
      success: true,

      profile:
        serializeUserProfile(
          updated
        ),
    };
  } catch (error) {
    console.error(
      "Lỗi xác nhận manual personality:",
      error
    );

    return {
      success: false,
      error:
        "Không thể xác nhận personality thủ công lúc này.",
    };
  }
}

/**
 * Dùng một TestResult cụ thể làm identity hiển thị.
 *
 * TestResult vẫn được giữ nguyên trong lịch sử.
 * Chỉ confirmed identity thay đổi.
 */
export async function confirmTestPersonalityType({
  kind,
  testResultId,
}: ConfirmTestPersonalityTypeInput): Promise<{
  success: boolean;
  profile?: UserProfileData;
  error?: string;
}> {
  try {
    const { userId } =
      await auth();

    if (!userId) {
      return {
        success: false,
        error:
          "Bạn cần đăng nhập để xác nhận type.",
      };
    }

    const normalizedId =
      testResultId.trim();

    if (!normalizedId) {
      return {
        success: false,
        error:
          "TestResult không hợp lệ.",
      };
    }

    const user =
      await getOrCreateCurrentUser(
        userId
      );

    const testResult =
      await prisma.testResult.findFirst({
        where: {
          id: normalizedId,
          userId: user.id,
          testType: kind,
        },

        select: {
          id: true,
          resultName: true,
          details: true,
        },
      });

    if (!testResult) {
      return {
        success: false,
        error:
          "Không tìm thấy kết quả test phù hợp.",
      };
    }

    let data: Record<
      string,
      unknown
    >;

    if (kind === "MBTI") {
      const mbti =
        normalizeMbtiType(
          testResult.resultName
        );

      if (!mbti) {
        return {
          success: false,
          error:
            "Kết quả MBTI này chưa đủ rõ để dùng làm type hiển thị.",
        };
      }

      data = {
        confirmedMbtiType:
          mbti,

        confirmedMbtiSource:
          "TEST",

        confirmedMbtiTestResultId:
          testResult.id,
      };
    } else {
      const core =
        extractEnneagramCoreFromResult(
          testResult.resultName
        );

      if (!core) {
        return {
          success: false,
          error:
            "Kết quả Enneagram này không hợp lệ để dùng làm identity.",
        };
      }

      const sourceText = [
        testResult.resultName,
        testResult.details ?? "",
      ].join(" ");

      const wing =
        extractEnneagramWingFromText(
          core,
          sourceText
        );

      const tritype =
        extractEnneagramTritypeFromText(
          core,
          sourceText
        );

      data = {
        confirmedEnneagramType:
          `Type ${core}`,

        confirmedEnneagramWing:
          wing,

        confirmedEnneagramTritype:
          tritype,

        confirmedEnneagramSource:
          "TEST",

        confirmedEnneagramTestResultId:
          testResult.id,
      };
    }

    const updated =
      await prisma.user.update({
        where: {
          id: user.id,
        },

        data,

        include: {
          testResults: {
            orderBy: {
              createdAt:
                "desc",
            },
          },
        },
      });

    revalidatePersonalityPaths();

    return {
      success: true,

      profile:
        serializeUserProfile(
          updated
        ),
    };
  } catch (error) {
    console.error(
      "Lỗi xác nhận TestResult personality:",
      error
    );

    return {
      success: false,
      error:
        "Không thể dùng kết quả test này làm personality hiển thị lúc này.",
    };
  }
}

/** Validate all typology systems before writing; extra systems always public. */
export async function saveTypology(input: TypologyInput) {
  try {
    const {userId}=await auth();
    if(!userId)return {success:false as const,error:"Vui lòng đăng nhập lại."};
    const extras=validateExtraTypology(input);
    const result=await saveManualPersonalityTypes(input);
    if(!result.success)return result;
    await prisma.user.update({where:{clerkId:userId},data:extras});
    revalidatePersonalityPaths();
    return getUserProfile();
  }catch{return {success:false as const,error:"Typology không hợp lệ hoặc chưa lưu được."};}
}
