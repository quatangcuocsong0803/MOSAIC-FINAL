"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { ensureUser } from "@/lib/ensure-user";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type TestVariant = "TRADITIONAL_72" | "AI_ADAPTIVE" | "TRADITIONAL";

export interface SaveTestResultInput {
  // Ví dụ: "MBTI", "ENNEAGRAM"
  testType: string;

  // Cognitive Functions:
  // - "TRADITIONAL_72"
  // - "AI_ADAPTIVE"
  //
  // Enneagram:
  // - "TRADITIONAL"
  //
  // Optional tạm thời để code cũ chưa bị vỡ.
  testVariant?: TestVariant | null;

  // Ví dụ:
  // "INTJ"
  // "ENFP"
  // "Type 5"
  resultName: string;

  details?: string | null;

  /*
   * Consent dùng kết quả test này kết hợp với
   * các field profile được phép để phục vụ
   * Statistics tổng hợp / filter.
   *
   * Mặc định false.
   */
  statisticsConsent?: boolean;
}

const STATISTICS_CONSENT_VERSION = "stats-consent-v1";

/**
 * Kiểm tra variant có phù hợp với loại test hay không.
 *
 * Việc này diễn ra server-side để client không thể
 * tự gửi một variant tùy ý.
 */
function isValidVariant(testType: string, variant: TestVariant | null) {
  if (variant === null) {
    return true;
  }

  if (testType === "MBTI") {
    return variant === "TRADITIONAL_72" || variant === "AI_ADAPTIVE";
  }

  if (testType === "ENNEAGRAM") {
    return variant === "TRADITIONAL";
  }

  return true;
}

/**
 * Server Action:
 * Lưu kết quả bài test thật của người dùng.
 *
 * statisticsConsent KHÔNG quyết định user
 * có được xem/lưu kết quả hay không.
 *
 * Dù false, TestResult vẫn được lưu.
 */
export async function saveTestResult({
  testType,
  testVariant = null,
  resultName,
  details,
  statisticsConsent = false,
}: SaveTestResultInput): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  testResultId?: string;
}> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Chưa đăng nhập. Kết quả chỉ lưu tạm thời.",
      };
    }

    const formattedType = testType.trim().toUpperCase();

    const formattedName = resultName.trim();

    if (!formattedType) {
      return {
        success: false,
        error: "Loại bài test không hợp lệ.",
      };
    }

    if (!formattedName) {
      return {
        success: false,
        error: "Kết quả bài test không hợp lệ.",
      };
    }

    if (!isValidVariant(formattedType, testVariant)) {
      return {
        success: false,
        error: "Biến thể bài test không hợp lệ.",
      };
    }

    // ========================================================
    // 1. Tìm hoặc tạo User từ Clerk
    // ========================================================

    let user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      const clerkUser = await currentUser();

      user = await ensureUser(userId, clerkUser?.fullName);
    }

    // ========================================================
    // 2. Chuẩn bị consent
    // ========================================================

    /*
     * Consent chỉ được ghi nhận nếu user
     * chủ động chọn đồng ý.
     */
    const consented = statisticsConsent === true;

    const consentedAt = consented ? new Date() : null;

    const consentVersion = consented ? STATISTICS_CONSENT_VERSION : null;

    // ========================================================
    // 3. Lưu TestResult
    // ========================================================

    const testResult = await prisma.testResult.create({
      data: {
        userId: user.id,

        testType: formattedType,

        testVariant: testVariant ?? null,

        resultName: formattedName,

        details:
          details ?? `Kết quả bài test ${formattedType}: ${formattedName}`,

        /*
         * false vẫn lưu TestResult.
         *
         * Statistics chỉ được phép sử dụng
         * profile-linked data khi consent = true.
         */
        statisticsConsent: consented,

        statisticsConsentVersion: consentVersion,

        statisticsConsentedAt: consentedAt,

        statisticsConsentRevokedAt: null,
      },
    });

    // ========================================================
    // 4. Refresh các trang liên quan
    // ========================================================

    revalidatePath("/statistics");
    revalidatePath("/profile");
    revalidatePath("/discover");
    revalidatePath("/");

    return {
      success: true,

      message: `Đã lưu thành công kết quả bài test ${formattedName}.`,

      testResultId: testResult.id,
    };
  } catch (error) {
    console.error(
      "Lỗi khi lưu kết quả bài test:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return {
      success: false,

      error: "Không thể lưu kết quả bài test vào cơ sở dữ liệu.",
    };
  }
}

/**
 * Server Action:
 * Thu hồi quyền sử dụng một TestResult cho Statistics.
 *
 * Hành động này:
 * - KHÔNG xóa kết quả test
 * - KHÔNG ảnh hưởng quyền xem kết quả
 * - KHÔNG xóa lịch sử consent trước đó
 * - Chỉ loại result khỏi Statistics từ thời điểm revoke
 */
export async function revokeStatisticsConsent(testResultId: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Bạn cần đăng nhập để thay đổi quyền chia sẻ dữ liệu.",
      };
    }

    const normalizedId = testResultId.trim();

    if (!normalizedId) {
      return {
        success: false,
        error: "Kết quả bài test không hợp lệ.",
      };
    }

    // ========================================================
    // 1. Xác định user hiện tại
    // ========================================================

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Không tìm thấy hồ sơ người dùng.",
      };
    }

    // ========================================================
    // 2. Kiểm tra TestResult thuộc đúng user
    // ========================================================

    const testResult = await prisma.testResult.findFirst({
      where: {
        id: normalizedId,
        userId: user.id,
      },
      select: {
        id: true,
        statisticsConsent: true,
        statisticsConsentRevokedAt: true,
      },
    });

    if (!testResult) {
      return {
        success: false,
        error: "Không tìm thấy kết quả bài test này.",
      };
    }

    /*
     * Cho phép action có tính idempotent:
     * nếu đã revoke rồi thì gọi lại cũng không gây lỗi.
     */
    if (
      testResult.statisticsConsent === false &&
      testResult.statisticsConsentRevokedAt
    ) {
      return {
        success: true,
        message:
          "Quyền chia sẻ Statistics của kết quả này đã được thu hồi trước đó.",
      };
    }

    if (testResult.statisticsConsent === false) {
      return {
        success: true,
        message: "Kết quả này hiện không được chia sẻ cho Statistics.",
      };
    }

    // ========================================================
    // 3. Thu hồi consent
    // ========================================================

    await prisma.testResult.update({
      where: {
        id: testResult.id,
      },

      data: {
        /*
         * Không xóa statisticsConsentedAt
         * hoặc statisticsConsentVersion.
         *
         * Hai field đó giữ lại lịch sử:
         * user từng đồng ý lúc nào / version nào.
         */
        statisticsConsent: false,

        statisticsConsentRevokedAt: new Date(),
      },
    });

    // ========================================================
    // 4. Refresh các trang sử dụng consent
    // ========================================================

    revalidatePath("/statistics");
    revalidatePath("/profile");
    revalidatePath("/discover");
    revalidatePath("/");

    return {
      success: true,

      message:
        "Đã thu hồi quyền sử dụng kết quả này cho Statistics. Kết quả bài test của bạn vẫn được giữ nguyên.",
    };
  } catch (error) {
    console.error(
      "Lỗi khi thu hồi Statistics consent:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return {
      success: false,

      error: "Không thể thu hồi quyền chia sẻ Statistics lúc này.",
    };
  }
}
