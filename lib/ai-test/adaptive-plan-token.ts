import crypto from "node:crypto";

type AdaptivePlanPayload = {
  version: 1;
  questionIds: string[];
  issuedAt: number;
  expiresAt: number;
};

const TOKEN_LIFETIME_MS = 2 * 60 * 60 * 1000; // 2 giờ

function getSecret() {
  const secret = process.env.ADAPTIVE_TEST_SECRET;

  if (!secret) {
    throw new Error(
      "Không tìm thấy ADAPTIVE_TEST_SECRET."
    );
  }

  return secret;
}

function sign(encodedPayload: string) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(encodedPayload)
    .digest("base64url");
}

export function createAdaptivePlanToken(
  questionIds: string[]
) {
  const now = Date.now();

  const payload: AdaptivePlanPayload = {
    version: 1,
    questionIds,
    issuedAt: now,
    expiresAt: now + TOKEN_LIFETIME_MS,
  };

  const encodedPayload = Buffer.from(
    JSON.stringify(payload)
  ).toString("base64url");

  const signature = sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifyAdaptivePlanToken(
  token: string
): AdaptivePlanPayload {
  const [encodedPayload, receivedSignature] =
    token.split(".");

  if (!encodedPayload || !receivedSignature) {
    throw new Error("planToken không hợp lệ.");
  }

  const expectedSignature = sign(encodedPayload);

  const receivedBuffer = Buffer.from(
    receivedSignature
  );

  const expectedBuffer = Buffer.from(
    expectedSignature
  );

  if (
    receivedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(
      receivedBuffer,
      expectedBuffer
    )
  ) {
    throw new Error(
      "planToken đã bị thay đổi hoặc không hợp lệ."
    );
  }

  let payload: AdaptivePlanPayload;

  try {
    payload = JSON.parse(
      Buffer.from(
        encodedPayload,
        "base64url"
      ).toString("utf8")
    );
  } catch {
    throw new Error(
      "Không thể đọc planToken."
    );
  }

  if (
    payload.version !== 1 ||
    !Array.isArray(payload.questionIds) ||
    typeof payload.issuedAt !== "number" ||
    typeof payload.expiresAt !== "number"
  ) {
    throw new Error(
      "Nội dung planToken không hợp lệ."
    );
  }

  if (
    payload.questionIds.length === 0 ||
    payload.questionIds.some(
      (id) => typeof id !== "string"
    )
  ) {
    throw new Error(
      "Danh sách câu hỏi trong planToken không hợp lệ."
    );
  }

  if (Date.now() > payload.expiresAt) {
    throw new Error(
      "Bài test này đã hết hạn. Hãy bắt đầu lại."
    );
  }

  return payload;
}