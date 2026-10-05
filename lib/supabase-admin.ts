import { createClient } from "@supabase/supabase-js";

export const DISCUSSION_ATTACHMENT_BUCKET =
  "discussion-attachments";

let adminClient:
  ReturnType<typeof createClient> | null =
  null;

export function getSupabaseAdmin() {
  if (adminClient) {
    return adminClient;
  }

  let rawUrl =
    (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();

  rawUrl = rawUrl
    .replace(/^["']|["']$/g, "")
    .trim()
    .replace(/\/rest\/v1\/?$/, "")
    .replace(/\/+$/, "");

  const url = rawUrl;

  const secret =
    (process.env.SUPABASE_SECRET_KEY || "")
      .trim()
      .replace(/^["']|["']$/g, "");

  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is not configured.",
    );
  }

  if (!secret) {
    throw new Error(
      "SUPABASE_SECRET_KEY is not configured.",
    );
  }

  adminClient =
    createClient(
      url,
      secret,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );

  return adminClient;
}

export async function ensureDiscussionAttachmentBucket() {
  const supabase =
    getSupabaseAdmin();

  const existing =
    await supabase.storage.getBucket(
      DISCUSSION_ATTACHMENT_BUCKET,
    );

  if (existing.data) {
    // Không tự động biến một bucket có sẵn thành public/private.
    // Nếu bucket tồn tại nhưng public thì fail closed.
    if (existing.data.public) {
      throw new Error(
        `${DISCUSSION_ATTACHMENT_BUCKET} must be private.`,
      );
    }

    return;
  }

  const created =
    await supabase.storage.createBucket(
      DISCUSSION_ATTACHMENT_BUCKET,
      {
        public: false,

        // Hard ceiling.
        // Application layer còn có limit riêng theo từng loại file.
        fileSizeLimit: "20MB",

        allowedMimeTypes: [
          "image/jpeg",
          "image/png",
          "image/webp",

          "application/pdf",

          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

          "text/plain",
          "text/markdown",
          "text/csv",
          "application/json",
          "text/json",

          // Một số browser không xác định MIME tốt.
          // Finalize step vẫn kiểm tra file thực tế.
          "application/octet-stream",
        ],
      },
    );

  if (
    created.error &&
    !created.error.message
      .toLowerCase()
      .includes("already")
  ) {
    throw new Error(
      `Cannot create private attachment bucket: ${created.error.message}`,
    );
  }
}
