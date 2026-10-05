"use server";

import { monthlyResults, personalityPairs, type MonthlyPoint, type PersonalityPair } from "@/lib/statistics/aggregate";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  ZODIAC_SIGNS,
  ZODIAC_ICONS,
} from "@/lib/zodiac";

export interface MbtiStatItem {
  type: string;
  name: string;
  count: number;
  percentage: number;
}

export interface EnneagramStatItem {
  type: string;
  name: string;
  count: number;
  percentage: number;
}

export interface AgeGroupStatItem {
  key: string;
  label: string;
  sublabel: string;
  count: number;
  percentage: number;
}

export interface ZodiacCrossStatItem {
  sign: string;
  icon: string;
  count: number;
  topMbti: string;
  topEnneagram: string;
  mbtiCount?: number;
  enneagramCount?: number;
}

export interface FunFactItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  highlight: string;
}

export interface StatisticsData {
  monthlyActivity?: MonthlyPoint[];
  personalityPairs?: PersonalityPair[];
  dataUnavailable?: boolean;
  totalUsers: number;
  testedUsersCount: number;
  totalTestsCompleted: number;
  mbtiDistribution: MbtiStatItem[];
  enneagramDistribution: EnneagramStatItem[];
  ageDistribution: AgeGroupStatItem[];
  zodiacCrossDistribution: ZodiacCrossStatItem[];
  funFacts: FunFactItem[];
  topMbti: MbtiStatItem | null;
  topEnneagram: EnneagramStatItem | null;
}

const MBTI_TITLES: Record<string, string> = {
  INTJ: "Nhà chiến lược",
  INTP: "Nhà tư duy",
  ENTJ: "Nhà chỉ huy",
  ENTP: "Người tranh biện",
  INFJ: "Người cố vấn",
  INFP: "Người hòa giải",
  ENFJ: "Người dẫn đường",
  ENFP: "Người truyền cảm hứng",
  ISTJ: "Người trách nhiệm",
  ISFJ: "Người bảo vệ",
  ESTJ: "Người điều hành",
  ESFJ: "Người quan tâm",
  ISTP: "Nhà kỹ thuật",
  ISFP: "Người nghệ sĩ",
  ESTP: "Người thực thi",
  ESFP: "Người trình diễn",
};

const ALL_MBTI_TYPES = [
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
];

const ENNEAGRAM_TITLES: Record<number, string> = {
  1: "Người cầu toàn",
  2: "Người giúp đỡ",
  3: "Người thành đạt",
  4: "Người cá tính",
  5: "Người điều tra",
  6: "Người trung thành",
  7: "Người nhiệt huyết",
  8: "Người thách thức",
  9: "Người hòa giải",
};

type StatisticsTestResult = {
  testType: string;
  resultName: string;
  statisticsConsent: boolean;
  statisticsConsentRevokedAt: Date | null;
  createdAt: Date;
};

/**
 * Result được phép tham gia Statistics khi:
 * - user đã chủ động consent
 * - consent chưa bị thu hồi
 */
function hasActiveStatisticsConsent(
  result: StatisticsTestResult
): boolean {
  return (
    result.statisticsConsent === true &&
    result.statisticsConsentRevokedAt === null
  );
}

/**
 * Lấy result gần nhất của một loại test mà
 * user vẫn đang cho phép dùng cho Statistics.
 *
 * testResults phải được order createdAt desc.
 */
function getLatestConsentedTest(
  testResults: StatisticsTestResult[],
  testType: string
): StatisticsTestResult | null {
  return (
    testResults.find(
      (result) =>
        result.testType.toUpperCase() ===
          testType.toUpperCase() &&
        hasActiveStatisticsConsent(result)
    ) ?? null
  );
}

/**
 * Trích xuất mã MBTI chuẩn 4 chữ cái.
 *
 * UNRESOLVED hoặc dữ liệu không hợp lệ
 * sẽ trả về null.
 */
function extractMbtiCode(
  raw: string
): string | null {
  if (!raw) {
    return null;
  }

  const normalized = raw
    .trim()
    .toUpperCase();

  if (
    normalized === "UNRESOLVED"
  ) {
    return null;
  }

  const match =
    normalized.match(
      /\b([IE][NS][TF][JP])\b/
    );

  return match
    ? match[1]
    : null;
}

/**
 * Trích xuất Enneagram Type 1–9.
 */
function extractEnneagramNumber(
  raw: string
): number | null {
  if (!raw) {
    return null;
  }

  const match =
    raw.match(/[1-9]/);

  return match
    ? parseInt(match[0], 10)
    : null;
}

/**
 * Tính tỷ lệ % an toàn.
 */
function safePercentage(
  count: number,
  total: number
): number {
  if (
    !total ||
    total <= 0 ||
    isNaN(total) ||
    isNaN(count) ||
    count <= 0
  ) {
    return 0;
  }

  return (
    Math.round(
      (count / total) * 1000
    ) / 10
  );
}

/**
 * Tính tuổi hiện tại từ ngày sinh.
 */
function calculateAge(
  dob: Date | null
): number | null {
  if (!dob) {
    return null;
  }

  const birth =
    new Date(dob);

  if (
    isNaN(birth.getTime())
  ) {
    return null;
  }

  const today = new Date();

  let age =
    today.getFullYear() -
    birth.getFullYear();

  const monthDiff =
    today.getMonth() -
    birth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 &&
      today.getDate() <
        birth.getDate())
  ) {
    age--;
  }

  return age >= 0
    ? age
    : null;
}

/**
 * Tìm phần tử xuất hiện nhiều nhất.
 */
function getMostFrequent(
  arr: string[]
): string {
  if (
    !arr ||
    arr.length === 0
  ) {
    return "Chưa có";
  }

  const counts: Record<
    string,
    number
  > = {};

  let maxItem = arr[0];
  let maxCount = 0;

  for (const item of arr) {
    counts[item] =
      (counts[item] || 0) + 1;

    if (
      counts[item] >
      maxCount
    ) {
      maxCount =
        counts[item];

      maxItem = item;
    }
  }

  return maxCount > 0
    ? maxItem
    : "Chưa có";
}

/**
 * Lấy Statistics từ Database.
 *
 * Quy tắc privacy:
 *
 * 1. Tổng số user / lượt test:
 *    có thể đếm tất cả.
 *
 * 2. Kết quả MBTI/Enneagram và dữ liệu
 *    Profile dùng cho phân tích/filter:
 *    chỉ dùng khi result có consent.
 */
export async function getStatisticsData(): Promise<StatisticsData> {
  try {
    // Read only fields used by aggregation, and only currently shared results.
    const [totalUsers, testedUsersCount, totalTestsCompleted, allUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { testResults: { some: {} } } }),
      prisma.testResult.count(),
      prisma.user.findMany({
        where: { testResults: { some: { statisticsConsent: true, statisticsConsentRevokedAt: null } } },
        select: {
          dateOfBirth: true, zodiacSign: true,
          testResults: {
            where: { statisticsConsent: true, statisticsConsentRevokedAt: null },
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            select: { testType: true, resultName: true, statisticsConsent: true, statisticsConsentRevokedAt: true, createdAt: true },
          },
        },
      }),
    ]);

    // ========================================================
    // USERS ĐƯỢC PHÉP DÙNG PROFILE CHO STATISTICS
    // ========================================================

    const statisticsProfileUsers =
      allUsers.filter((user) =>
        user.testResults.some(
          (result) =>
            hasActiveStatisticsConsent(
              result
            )
        )
      );

    const statisticsProfileUserCount =
      statisticsProfileUsers.length;

    // ========================================================
    // A. MBTI DISTRIBUTION
    //
    // Traditional 72 + AI Adaptive
    // được gộp chung thành MBTI.
    // ========================================================

    const mbtiCounts: Record<
      string,
      number
    > = {};

    ALL_MBTI_TYPES.forEach(
      (type) => {
        mbtiCounts[type] = 0;
      }
    );

    let totalMbtiCount = 0;

    for (const user of allUsers) {
      const mbtiTest =
        getLatestConsentedTest(
          user.testResults,
          "MBTI"
        );

      if (!mbtiTest) {
        continue;
      }

      const code =
        extractMbtiCode(
          mbtiTest.resultName
        );

      if (
        code &&
        mbtiCounts[code] !==
          undefined
      ) {
        mbtiCounts[code]++;
        totalMbtiCount++;
      }
    }

    const mbtiDistribution: MbtiStatItem[] =
      ALL_MBTI_TYPES.map(
        (type) => {
          const count =
            mbtiCounts[type] || 0;

          return {
            type,
            name:
              MBTI_TITLES[
                type
              ] ||
              "Tính cách",

            count,

            percentage:
              safePercentage(
                count,
                totalMbtiCount
              ),
          };
        }
      ).sort((a, b) => {
        if (
          b.count !== a.count
        ) {
          return (
            b.count - a.count
          );
        }

        return a.type.localeCompare(
          b.type
        );
      });

    const topMbti =
      mbtiDistribution.length >
        0 &&
      mbtiDistribution[0].count >
        0
        ? mbtiDistribution[0]
        : null;

    // ========================================================
    // B. ENNEAGRAM DISTRIBUTION
    // ========================================================

    const enneagramCounts: Record<
      number,
      number
    > = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
    };

    let totalEnneagramCount = 0;

    for (const user of allUsers) {
      const enneagramTest =
        getLatestConsentedTest(
          user.testResults,
          "ENNEAGRAM"
        );

      if (!enneagramTest) {
        continue;
      }

      const num =
        extractEnneagramNumber(
          enneagramTest.resultName
        );

      if (
        num &&
        enneagramCounts[num] !==
          undefined
      ) {
        enneagramCounts[num]++;
        totalEnneagramCount++;
      }
    }

    const enneagramDistribution: EnneagramStatItem[] =
      [
        1, 2, 3, 4, 5, 6, 7, 8,
        9,
      ]
        .map((num) => {
          const count =
            enneagramCounts[num] ||
            0;

          return {
            type: `Type ${num}`,

            name:
              ENNEAGRAM_TITLES[
                num
              ] ||
              "Tính cách",

            count,

            percentage:
              safePercentage(
                count,
                totalEnneagramCount
              ),
          };
        })
        .sort((a, b) => {
          if (
            b.count !== a.count
          ) {
            return (
              b.count - a.count
            );
          }

          return a.type.localeCompare(
            b.type
          );
        });

    const topEnneagram =
      enneagramDistribution.length >
        0 &&
      enneagramDistribution[0]
        .count > 0
        ? enneagramDistribution[0]
        : null;

    // ========================================================
    // C. AGE DISTRIBUTION
    //
    // Đây là dữ liệu Profile nên chỉ dùng user
    // có ít nhất một Statistics consent đang active.
    // ========================================================

    const ageBuckets = {
      under18: 0,
      age18_24: 0,
      age25_34: 0,
      above35: 0,
      unknown: 0,
    };

    for (const user of statisticsProfileUsers) {
      const age =
        calculateAge(
          user.dateOfBirth
        );

      if (age === null) {
        ageBuckets.unknown++;
      } else if (age < 18) {
        ageBuckets.under18++;
      } else if (
        age >= 18 &&
        age <= 24
      ) {
        ageBuckets.age18_24++;
      } else if (
        age >= 25 &&
        age <= 34
      ) {
        ageBuckets.age25_34++;
      } else {
        ageBuckets.above35++;
      }
    }

    const ageDistribution: AgeGroupStatItem[] =
      [
        {
          key: "18_24",

          label:
            "18 - 24 tuổi",

          sublabel:
            "Gen Z (Sinh viên & Người đi làm)",

          count:
            ageBuckets.age18_24,

          percentage:
            safePercentage(
              ageBuckets.age18_24,
              statisticsProfileUserCount
            ),
        },

        {
          key: "25_34",

          label:
            "25 - 34 tuổi",

          sublabel:
            "Millennials trẻ & Trưởng thành",

          count:
            ageBuckets.age25_34,

          percentage:
            safePercentage(
              ageBuckets.age25_34,
              statisticsProfileUserCount
            ),
        },

        {
          key: "above35",

          label:
            "Từ 35 tuổi",

          sublabel:
            "Millennials lớn & Gen X",

          count:
            ageBuckets.above35,

          percentage:
            safePercentage(
              ageBuckets.above35,
              statisticsProfileUserCount
            ),
        },

        {
          key: "under18",

          label:
            "Dưới 18 tuổi",

          sublabel:
            "Học sinh & Thiếu niên",

          count:
            ageBuckets.under18,

          percentage:
            safePercentage(
              ageBuckets.under18,
              statisticsProfileUserCount
            ),
        },

        {
          key: "unknown",

          label:
            "Chưa cập nhật",

          sublabel:
            "Chưa cung cấp ngày sinh trong hồ sơ",

          count:
            ageBuckets.unknown,

          percentage:
            safePercentage(
              ageBuckets.unknown,
              statisticsProfileUserCount
            ),
        },
      ];

    // ========================================================
    // D. ZODIAC × PERSONALITY
    //
    // Zodiac là Profile data nên chỉ dùng users
    // đã consent.
    //
    // MBTI/Enneagram bên trong cũng phải là
    // consented result tương ứng.
    // ========================================================

    const zodiacMap: Record<
      string,
      {
        count: number;
        mbtiList: string[];
        enneagramList: string[];
      }
    > = {};

    ZODIAC_SIGNS.forEach(
      (sign) => {
        zodiacMap[sign] = {
          count: 0,
          mbtiList: [],
          enneagramList: [],
        };
      }
    );

    for (const user of statisticsProfileUsers) {
      if (
        !user.zodiacSign ||
        !zodiacMap[
          user.zodiacSign
        ]
      ) {
        continue;
      }

      const zodiacItem =
        zodiacMap[
          user.zodiacSign
        ];

      zodiacItem.count++;

      const mbti =
        getLatestConsentedTest(
          user.testResults,
          "MBTI"
        );

      if (mbti) {
        const code =
          extractMbtiCode(
            mbti.resultName
          );

        if (code) {
          zodiacItem.mbtiList.push(
            code
          );
        }
      }

      const enneagram =
        getLatestConsentedTest(
          user.testResults,
          "ENNEAGRAM"
        );

      if (enneagram) {
        const num =
          extractEnneagramNumber(
            enneagram.resultName
          );

        if (num) {
          zodiacItem.enneagramList.push(
            `Type ${num}`
          );
        }
      }
    }

    const zodiacCrossDistribution: ZodiacCrossStatItem[] =
      ZODIAC_SIGNS.map(
        (sign) => {
          const item =
            zodiacMap[sign];

          return {
            sign,
            mbtiCount: item.mbtiList.length,
            enneagramCount: item.enneagramList.length,

            icon:
              ZODIAC_ICONS[
                sign
              ] || "",

            count:
              item.count,

            topMbti:
              getMostFrequent(
                item.mbtiList
              ),

            topEnneagram:
              getMostFrequent(
                item.enneagramList
              ),
          };
        }
      );

    // ========================================================
    // FUN FACTS
    // ========================================================

    const sortedZodiacs = [
      ...zodiacCrossDistribution,
    ].sort(
      (a, b) =>
        b.count - a.count
    );

    const mostActiveZodiac: ZodiacCrossStatItem | null =
      sortedZodiacs.length >
        0 &&
      sortedZodiacs[0].count >
        0
        ? sortedZodiacs[0]
        : null;

    const validAgeGroups =
      ageDistribution.filter(
        (group) =>
          group.key !==
            "unknown" &&
          group.count > 0
      );

    const dominantAgeGroup =
      validAgeGroups.length >
      0
        ? [
            ...validAgeGroups,
          ].sort(
            (a, b) =>
              b.count -
              a.count
          )[0]
        : ageDistribution[0];

    const funFacts: FunFactItem[] =
      [];

    // Fact 1: MBTI
    if (topMbti) {
      funFacts.push({
        id: "fact_top_mbti",

        icon: "brain",

        title:
          `Nhóm tính cách dẫn đầu: ${topMbti.type}`,

        highlight:
          `${topMbti.count} thành viên (${topMbti.percentage}%)`,

        description:
          `Nhóm ${topMbti.type} (${topMbti.name}) đang chiếm tỷ lệ cao nhất trong các kết quả MBTI được người dùng đồng ý đóng góp cho Statistics.`,
      });
    } else {
      funFacts.push({
        id: "fact_top_mbti",

        icon: "brain",

        title:
          "Dữ liệu MBTI đang chờ cập nhật",

        highlight:
          "0 kết quả được chia sẻ",

        description:
          "Hiện chưa có kết quả MBTI hợp lệ được người dùng đồng ý đóng góp cho Statistics.",
      });
    }

    // Fact 2: Zodiac
    if (mostActiveZodiac) {
      funFacts.push({
        id: "fact_zodiac_lead",

        icon:
          mostActiveZodiac.icon,

        title:
          `Cung hoàng đạo đông nhất: ${mostActiveZodiac.sign}`,

        highlight:
          `${mostActiveZodiac.count} người (${safePercentage(
            mostActiveZodiac.count,
            statisticsProfileUserCount
          )}%)`,

        description:
          `Trong nhóm người dùng đồng ý đóng góp dữ liệu thống kê, cung ${mostActiveZodiac.sign} hiện xuất hiện nhiều nhất.`,
      });
    } else {
      funFacts.push({
        id: "fact_zodiac_lead",

        icon: "",

        title:
          "Cung hoàng đạo",

        highlight:
          "Chưa có dữ liệu được chia sẻ",

        description:
          "Chưa có đủ dữ liệu Profile được người dùng đồng ý đóng góp để thống kê cung hoàng đạo.",
      });
    }

    // Fact 3: Enneagram
    if (topEnneagram) {
      funFacts.push({
        id: "fact_enneagram_trend",

        icon: "target",

        title:
          `Enneagram phổ biến: ${topEnneagram.type}`,

        highlight:
          `${topEnneagram.name} (${topEnneagram.percentage}%)`,

        description:
          `${topEnneagram.type} đang chiếm tỷ lệ cao nhất trong các kết quả Enneagram được người dùng đồng ý đóng góp cho Statistics.`,
      });
    } else {
      funFacts.push({
        id: "fact_enneagram_trend",

        icon: "target",

        title:
          "Dữ liệu Enneagram",

        highlight:
          "0 kết quả được chia sẻ",

        description:
          "Chưa có kết quả Enneagram hợp lệ được người dùng đồng ý đóng góp cho Statistics.",
      });
    }

    // Fact 4: Age
    if (
      dominantAgeGroup &&
      dominantAgeGroup.count >
        0
    ) {
      funFacts.push({
        id: "fact_age_group",

        icon: "sprout",

        title:
          `Độ tuổi chủ đạo: ${dominantAgeGroup.label}`,

        highlight:
          `${dominantAgeGroup.count}/${statisticsProfileUserCount} người (${dominantAgeGroup.percentage}%)`,

        description:
          `Nhóm ${dominantAgeGroup.sublabel} đang chiếm tỷ lệ lớn nhất trong dữ liệu Profile được người dùng đồng ý đóng góp cho Statistics.`,
      });
    } else {
      funFacts.push({
        id: "fact_age_group",

        icon: "sprout",

        title:
          "Thống kê nhân khẩu học",

        highlight:
          `${statisticsProfileUserCount} người đã đồng ý chia sẻ`,

        description:
          "Chưa có đủ dữ liệu ngày sinh từ những người dùng đã đồng ý đóng góp dữ liệu cho Statistics.",
      });
    }

    return {
      monthlyActivity: monthlyResults(allUsers.flatMap(user => user.testResults)),
      personalityPairs: personalityPairs(allUsers),
      dataUnavailable: false,
      totalUsers,
      testedUsersCount,
      totalTestsCompleted,
      mbtiDistribution,
      enneagramDistribution,
      ageDistribution,
      zodiacCrossDistribution,
      funFacts,
      topMbti,
      topEnneagram,
    };
  } catch (error) {
    console.error(
      "Lỗi khi tính toán thống kê thực tế:",
      error
    );

    return {
      monthlyActivity: [],
      personalityPairs: [],
      dataUnavailable: true,
      totalUsers: 0,
      testedUsersCount: 0,
      totalTestsCompleted: 0,
      mbtiDistribution: [],
      enneagramDistribution: [],
      ageDistribution: [],
      zodiacCrossDistribution: [],
      funFacts: [],
      topMbti: null,
      topEnneagram: null,
    };
  }
}

/**
 * Server Action:
 * Tạo dữ liệu Test ngẫu nhiên
 * (Dev Only).
 *
 * LƯU Ý:
 * seed này KHÔNG tự tạo consent.
 * Vì vậy seeded results vẫn được tính vào
 * totalTestsCompleted nhưng không đi vào
 * các distribution/profile-linked stats.
 */
export async function seedTestResults(): Promise<{
  success: boolean;
  message: string;
  count: number;
}> {
  "use server";

  try {
    const users =
      await prisma.user.findMany({
        include: {
          testResults: true,
        },
      });

    if (
      users.length === 0
    ) {
      return {
        success: false,
        message:
          "Không tìm thấy user nào trong database để gán kết quả test.",
        count: 0,
      };
    }

    const mbtiPool = [
      "ENFJ",
      "INTP",
      "INTJ",
      "ENTP",
      "INFJ",
      "INFP",
      "ENTJ",
      "ENFP",
      "ISTJ",
      "ISFJ",
      "ESTJ",
      "ESFJ",
      "ISTP",
      "ISFP",
      "ESTP",
      "ESFP",
    ];

    const enneagramPool = [
      "Type 1",
      "Type 2",
      "Type 3",
      "Type 4",
      "Type 5",
      "Type 6",
      "Type 7",
      "Type 8",
      "Type 9",
    ];

    let createdCount = 0;

    for (const user of users) {
      if (
        user.testResults.length ===
        0
      ) {
        const randomMbti =
          mbtiPool[
            Math.floor(
              Math.random() *
                mbtiPool.length
            )
          ];

        const randomEnneagram =
          enneagramPool[
            Math.floor(
              Math.random() *
                enneagramPool.length
            )
          ];

        await prisma.testResult.create({
          data: {
            userId: user.id,
            testType: "MBTI",
            testVariant:
              "TRADITIONAL_72",
            resultName:
              randomMbti,
            details:
              `Kết quả sinh ngẫu nhiên: ${randomMbti}`,

            statisticsConsent:
              false,
          },
        });

        await prisma.testResult.create({
          data: {
            userId: user.id,
            testType:
              "ENNEAGRAM",
            testVariant:
              "TRADITIONAL",
            resultName:
              randomEnneagram,
            details:
              `Kết quả sinh ngẫu nhiên: ${randomEnneagram}`,

            statisticsConsent:
              false,
          },
        });

        createdCount += 2;
      }
    }

    /*
     * Nếu tất cả user đều đã có test,
     * vẫn tạo thêm test mới để kiểm thử
     * totalTestsCompleted.
     *
     * Không tự consent thay user.
     */
    if (
      createdCount === 0
    ) {
      for (const user of users) {
        const randomMbti =
          mbtiPool[
            Math.floor(
              Math.random() *
                mbtiPool.length
            )
          ];

        const randomEnneagram =
          enneagramPool[
            Math.floor(
              Math.random() *
                enneagramPool.length
            )
          ];

        await prisma.testResult.create({
          data: {
            userId: user.id,
            testType: "MBTI",
            testVariant:
              "TRADITIONAL_72",
            resultName:
              randomMbti,
            details:
              `Kết quả sinh ngẫu nhiên: ${randomMbti}`,

            statisticsConsent:
              false,
          },
        });

        await prisma.testResult.create({
          data: {
            userId: user.id,
            testType:
              "ENNEAGRAM",
            testVariant:
              "TRADITIONAL",
            resultName:
              randomEnneagram,
            details:
              `Kết quả sinh ngẫu nhiên: ${randomEnneagram}`,

            statisticsConsent:
              false,
          },
        });

        createdCount += 2;
      }
    }

    revalidatePath(
      "/statistics"
    );

    revalidatePath(
      "/profile"
    );

    revalidatePath(
      "/discover"
    );

    revalidatePath("/");

    return {
      success: true,

      message:
        `Đã tạo ${createdCount} kết quả test dev. Các result này không tự động consent Statistics.`,

      count: createdCount,
    };
  } catch (error) {
    console.error(
      "Lỗi khi sinh dữ liệu test:",
      error
    );

    return {
      success: false,

      message:
        "Có lỗi xảy ra khi tạo kết quả test ngẫu nhiên.",

      count: 0,
    };
  }
}

/**
 * Server Action:
 * Xóa toàn bộ TestResult
 * (Dev Only).
 */
export async function clearTestResults(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const deleted =
      await prisma.testResult.deleteMany();

    revalidatePath(
      "/statistics"
    );

    revalidatePath(
      "/profile"
    );

    revalidatePath(
      "/discover"
    );

    return {
      success: true,

      message:
        `Đã xóa sạch ${deleted.count} kết quả test khỏi database!`,
    };
  } catch (error) {
    console.error(
      "Lỗi khi xóa kết quả test:",
      error
    );

    return {
      success: false,

      message:
        "Có lỗi khi xóa kết quả test.",
    };
  }
}