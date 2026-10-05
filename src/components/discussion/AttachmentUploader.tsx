"use client";

import {
  DragEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type UploadStatus =
  | "UPLOADING"
  | "SCANNING"
  | "READY"
  | "REJECTED"
  | "ERROR";

type UploadItem = {
  localId: string;
  attachmentId?: string;

  fileName: string;
  sizeBytes: number;

  kind?: string;

  status: UploadStatus;
  message?: string;
};

type PrepareResponse = {
  success: boolean;
  error?: string;

  attachment?: {
    id: string;
    kind: string;
    originalName: string;
    sizeBytes: number;

    storagePath: string;
    bucket: string;
    token: string;
  };
};

type FinalizeResponse = {
  success: boolean;
  rejected?: boolean;
  error?: string;

  attachment?: {
    id: string;
    kind: string;
    originalName: string;
    sizeBytes: number;
    scanStatus: string;
    moderationStatus: string;
  };
};

const MAX_ATTACHMENTS = 8;
const GENERIC_MAX_FILE_SIZE =
  20 * 1024 * 1024;

const ACCEPT =
  ".jpg,.jpeg,.png,.webp,.pdf,.docx,.txt,.md,.csv,.json,.xlsx";

function formatBytes(
  bytes: number,
) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (
    bytes <
    1024 * 1024
  ) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

function statusLabel(
  status: UploadStatus,
) {
  switch (status) {
    case "UPLOADING":
      return "Uploading";

    case "SCANNING":
      return "Security check";

    case "READY":
      return "Ready for moderation";

    case "REJECTED":
      return "Rejected";

    case "ERROR":
      return "Upload failed";
  }
}

export default function AttachmentUploader({
  uploadSessionId,
  onReadyAttachmentIdsChange,
  onBusyChange,
}: {
  uploadSessionId: string;

  onReadyAttachmentIdsChange: (
    ids: string[],
  ) => void;

  onBusyChange: (
    busy: boolean,
  ) => void;
}) {
  const [
    items,
    setItems,
  ] = useState<
    UploadItem[]
  >([]);

  const [
    dragActive,
    setDragActive,
  ] = useState(false);

  const [
    generalError,
    setGeneralError,
  ] = useState<
    string | null
  >(null);

  const readyIds =
    useMemo(
      () =>
        items
          .filter(
            (item) =>
              item.status ===
                "READY" &&
              item.attachmentId,
          )
          .map(
            (item) =>
              item.attachmentId!,
          ),
      [items],
    );

  const busy =
    useMemo(
      () =>
        items.some(
          (item) =>
            item.status ===
              "UPLOADING" ||
            item.status ===
              "SCANNING",
        ),
      [items],
    );

  useEffect(() => {
    onReadyAttachmentIdsChange(
      readyIds,
    );
  }, [
    readyIds,
    onReadyAttachmentIdsChange,
  ]);

  useEffect(() => {
    onBusyChange(busy);
  }, [
    busy,
    onBusyChange,
  ]);

  function patchItem(
    localId: string,
    patch:
      Partial<UploadItem>,
  ) {
    setItems(
      (current) =>
        current.map(
          (item) =>
            item.localId ===
            localId
              ? {
                  ...item,
                  ...patch,
                }
              : item,
        ),
    );
  }

  async function cleanupAttachment(
    attachmentId: string,
  ) {
    try {
      await fetch(
        `/api/discussion/attachments/${attachmentId}`,
        {
          method: "DELETE",
        },
      );
    } catch {
      // Best-effort cleanup.
    }
  }

  async function uploadFile(
    file: File,
  ) {
    const localId =
      crypto.randomUUID();

    setItems(
      (current) => [
        ...current,
        {
          localId,

          fileName:
            file.name,

          sizeBytes:
            file.size,

          status:
            "UPLOADING",
        },
      ],
    );

    let attachmentId:
      string | undefined;

    try {
      // =========================================
      // 1. PREPARE
      // =========================================

      const prepareResponse =
        await fetch(
          "/api/discussion/attachments/prepare",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                fileName:
                  file.name,

                mimeType:
                  file.type ||
                  "application/octet-stream",

                sizeBytes:
                  file.size,

                uploadSessionId,
              }),
          },
        );

      const prepared =
        (await prepareResponse.json()) as PrepareResponse;

      if (
        !prepareResponse.ok ||
        !prepared.success ||
        !prepared.attachment
      ) {
        throw new Error(
          prepared.error ||
            "Không thể chuẩn bị file.",
        );
      }

      attachmentId =
        prepared.attachment.id;

      patchItem(
        localId,
        {
          attachmentId,

          kind:
            prepared.attachment
              .kind,
        },
      );

      // =========================================
      // 2. DIRECT SIGNED UPLOAD
      // =========================================

      const upload =
        await supabase.storage
          .from(
            prepared.attachment
              .bucket,
          )
          .uploadToSignedUrl(
            prepared.attachment
              .storagePath,

            prepared.attachment
              .token,

            file,

            {
              contentType:
                file.type ||
                "application/octet-stream",

              cacheControl:
                "3600",
            },
          );

      if (upload.error) {
        await cleanupAttachment(
          attachmentId,
        );

        throw new Error(
          upload.error.message,
        );
      }

      patchItem(
        localId,
        {
          status:
            "SCANNING",

          message:
            "Đang kiểm tra cấu trúc và tính an toàn của file...",
        },
      );

      // =========================================
      // 3. SERVER FINALIZE / STATIC SCREEN
      // =========================================

      const finalizeResponse =
        await fetch(
          "/api/discussion/attachments/finalize",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                attachmentId,
              }),
          },
        );

      const finalized =
        (await finalizeResponse.json()) as FinalizeResponse;

      if (
        !finalizeResponse.ok ||
        !finalized.success ||
        !finalized.attachment
      ) {
        patchItem(
          localId,
          {
            status:
              finalized.rejected
                ? "REJECTED"
                : "ERROR",

            message:
              finalized.error ||
              "File không vượt qua kiểm tra.",
          },
        );

        return;
      }

      patchItem(
        localId,
        {
          status:
            "READY",

          kind:
            finalized.attachment
              .kind,

          message:
            "Đã qua static security screening. Nội dung vẫn sẽ được moderation.",
        },
      );
    } catch (error) {
      patchItem(
        localId,
        {
          status:
            "ERROR",

          message:
            error instanceof Error
              ? error.message
              : "Không thể upload file.",
        },
      );
    }
  }

  async function handleFiles(
    fileList:
      FileList | File[],
  ) {
    setGeneralError(
      null,
    );

    const files =
      Array.from(
        fileList,
      );

    if (
      items.length +
        files.length >
      MAX_ATTACHMENTS
    ) {
      setGeneralError(
        `Mỗi bài tối đa ${MAX_ATTACHMENTS} attachment.`,
      );

      return;
    }

    for (const file of files) {
      if (
        file.size >
        GENERIC_MAX_FILE_SIZE
      ) {
        setItems(
          (current) => [
            ...current,
            {
              localId:
                crypto.randomUUID(),

              fileName:
                file.name,

              sizeBytes:
                file.size,

              status:
                "REJECTED",

              message:
                "File vượt quá giới hạn 20 MB.",
            },
          ],
        );

        continue;
      }

      await uploadFile(
        file,
      );
    }
  }

  async function removeItem(
    item: UploadItem,
  ) {
    if (
      item.status ===
        "UPLOADING" ||
      item.status ===
        "SCANNING"
    ) {
      return;
    }

    if (
      item.attachmentId
    ) {
      const response =
        await fetch(
          `/api/discussion/attachments/${item.attachmentId}`,
          {
            method:
              "DELETE",
          },
        );

      if (
        !response.ok
      ) {
        const body =
          await response
            .json()
            .catch(
              () => null,
            );

        setGeneralError(
          body?.error ||
            "Không thể xóa attachment.",
        );

        return;
      }
    }

    setItems(
      (current) =>
        current.filter(
          (candidate) =>
            candidate.localId !==
            item.localId,
        ),
    );
  }

  function handleDrop(
    event:
      DragEvent<HTMLDivElement>,
  ) {
    event.preventDefault();

    setDragActive(
      false,
    );

    if (
      event.dataTransfer
        .files.length
    ) {
      void handleFiles(
        event.dataTransfer
          .files,
      );
    }
  }

  return (
    <div>
      <div
        onDragEnter={(
          event,
        ) => {
          event.preventDefault();
          setDragActive(
            true,
          );
        }}
        onDragOver={(
          event,
        ) => {
          event.preventDefault();
          setDragActive(
            true,
          );
        }}
        onDragLeave={(
          event,
        ) => {
          event.preventDefault();
          setDragActive(
            false,
          );
        }}
        onDrop={
          handleDrop
        }
        className={`rounded-xl border-2 border-dashed px-5 py-8 text-center transition ${
          dragActive
            ? "border-[#8B7355] bg-[#F4EEE4]"
            : "border-[#D8CDBE] bg-[#FBFAF7]"
        }`}
      >
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#F0EADF] text-lg text-[#735D40]">
          ↑
        </div>

        <p className="mt-3 text-xs font-bold text-[#594735]">
          Kéo file vào đây
        </p>

        <p className="mt-1 text-[10px] leading-5 text-[#8B7D6C]">
          hoặc chọn file từ máy tính
        </p>

        <label className="mt-4 inline-flex cursor-pointer rounded-lg border border-[#9A8465] bg-white px-4 py-2 text-[10px] font-bold text-[#6C573D] transition hover:bg-[#F4EEE4]">
          Browse files

          <input
            type="file"
            multiple
            accept={
              ACCEPT
            }
            className="hidden"
            disabled={
              busy ||
              items.length >=
                MAX_ATTACHMENTS
            }
            onChange={(
              event,
            ) => {
              if (
                event.target
                  .files
              ) {
                void handleFiles(
                  event.target
                    .files,
                );
              }

              event.target.value =
                "";
            }}
          />
        </label>

        <div className="mt-4 text-[9px] leading-4 text-[#9D8F7E]">
          <p>
            Images · JPG PNG WEBP
          </p>

          <p>
            Documents · PDF DOCX TXT MD
          </p>

          <p>
            Research data · CSV JSON XLSX
          </p>

          <p className="mt-1 font-semibold">
            Tối đa {MAX_ATTACHMENTS} file / bài
          </p>
        </div>
      </div>

      {generalError && (
        <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[10px] font-semibold text-rose-700">
          {generalError}
        </p>
      )}

      {items.length > 0 && (
        <div className="mt-4 space-y-2">
          {items.map(
            (item) => (
              <div
                key={
                  item.localId
                }
                className="rounded-lg border border-[#E0D7CB] bg-white px-4 py-3"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F3EEE6] text-[10px] font-extrabold text-[#796347]">
                    {item.kind ===
                    "IMAGE"
                      ? "IMG"
                      : item.kind ===
                          "DATASET"
                        ? "DATA"
                        : "DOC"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-[#514335]">
                      {
                        item.fileName
                      }
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[9px] text-[#9B8C7A]">
                      <span>
                        {formatBytes(
                          item.sizeBytes,
                        )}
                      </span>

                      <span>
                        •
                      </span>

                      <span
                        className={
                          item.status ===
                          "READY"
                            ? "font-bold text-emerald-700"
                            : item.status ===
                                  "REJECTED" ||
                                item.status ===
                                  "ERROR"
                              ? "font-bold text-rose-700"
                              : "font-bold text-[#8A6F4E]"
                        }
                      >
                        {statusLabel(
                          item.status,
                        )}
                      </span>
                    </div>

                    {item.message && (
                      <p className="mt-1.5 text-[9px] leading-4 text-[#8E806F]">
                        {
                          item.message
                        }
                      </p>
                    )}
                  </div>

                  {item.status !==
                    "UPLOADING" &&
                    item.status !==
                      "SCANNING" && (
                      <button
                        type="button"
                        onClick={() =>
                          void removeItem(
                            item,
                          )
                        }
                        className="shrink-0 text-[9px] font-bold text-[#9A6E62] hover:underline"
                      >
                        Remove
                      </button>
                    )}
                </div>

                {(item.status ===
                  "UPLOADING" ||
                  item.status ===
                    "SCANNING") && (
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#ECE5DB]">
                    <div className="h-full w-2/3 animate-pulse rounded-full bg-[#947A58]" />
                  </div>
                )}
              </div>
            ),
          )}
        </div>
      )}

      <p className="mt-3 text-[9px] leading-4 text-[#9B8E7D]">
        Attachment không tự động được coi là citation.
        File vượt qua bước này vẫn phải qua content moderation
        trước khi bài có thể được xuất bản.
      </p>
    </div>
  );
}
