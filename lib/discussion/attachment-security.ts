import JSZip from "jszip";

export type AllowedAttachmentKind =
  | "IMAGE"
  | "DOCUMENT"
  | "DATASET"
  | "SUPPLEMENTARY";

type FileRule = {
  kind: AllowedAttachmentKind;
  maxBytes: number;
  mimeTypes: string[];
};

const MB =
  1024 * 1024;

export const ATTACHMENT_RULES:
  Record<string, FileRule> = {
  jpg: {
    kind: "IMAGE",
    maxBytes: 8 * MB,
    mimeTypes: [
      "image/jpeg",
      "application/octet-stream",
      "",
    ],
  },

  jpeg: {
    kind: "IMAGE",
    maxBytes: 8 * MB,
    mimeTypes: [
      "image/jpeg",
      "application/octet-stream",
      "",
    ],
  },

  png: {
    kind: "IMAGE",
    maxBytes: 8 * MB,
    mimeTypes: [
      "image/png",
      "application/octet-stream",
      "",
    ],
  },

  webp: {
    kind: "IMAGE",
    maxBytes: 8 * MB,
    mimeTypes: [
      "image/webp",
      "application/octet-stream",
      "",
    ],
  },

  pdf: {
    kind: "DOCUMENT",
    maxBytes: 15 * MB,
    mimeTypes: [
      "application/pdf",
      "application/octet-stream",
      "",
    ],
  },

  docx: {
    kind: "DOCUMENT",
    maxBytes: 15 * MB,
    mimeTypes: [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/octet-stream",
      "",
    ],
  },

  txt: {
    kind: "DOCUMENT",
    maxBytes: 8 * MB,
    mimeTypes: [
      "text/plain",
      "application/octet-stream",
      "",
    ],
  },

  md: {
    kind: "DOCUMENT",
    maxBytes: 8 * MB,
    mimeTypes: [
      "text/markdown",
      "text/plain",
      "application/octet-stream",
      "",
    ],
  },

  csv: {
    kind: "DATASET",
    maxBytes: 20 * MB,
    mimeTypes: [
      "text/csv",
      "text/plain",
      "application/vnd.ms-excel",
      "application/octet-stream",
      "",
    ],
  },

  json: {
    kind: "DATASET",
    maxBytes: 20 * MB,
    mimeTypes: [
      "application/json",
      "text/json",
      "text/plain",
      "application/octet-stream",
      "",
    ],
  },

  xlsx: {
    kind: "DATASET",
    maxBytes: 20 * MB,
    mimeTypes: [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/octet-stream",
      "",
    ],
  },
};

export function getSafeExtension(
  fileName: string,
) {
  const cleaned =
    fileName
      .trim()
      .toLowerCase();

  const parts =
    cleaned.split(".");

  if (parts.length < 2) {
    return null;
  }

  const extension =
    parts.at(-1) || "";

  if (
    !/^[a-z0-9]+$/.test(
      extension,
    )
  ) {
    return null;
  }

  return extension;
}

export function validateUploadMetadata({
  fileName,
  mimeType,
  sizeBytes,
}: {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}) {
  const extension =
    getSafeExtension(
      fileName,
    );

  if (
    !extension ||
    !ATTACHMENT_RULES[
      extension
    ]
  ) {
    return {
      success:
        false as const,
      error:
        "Loại file này không được hỗ trợ.",
    };
  }

  const rule =
    ATTACHMENT_RULES[
      extension
    ];

  if (
    !Number.isInteger(
      sizeBytes,
    ) ||
    sizeBytes <= 0
  ) {
    return {
      success:
        false as const,
      error:
        "Kích thước file không hợp lệ.",
    };
  }

  if (
    sizeBytes >
    rule.maxBytes
  ) {
    return {
      success:
        false as const,
      error:
        `File quá lớn. Giới hạn cho .${extension} là ${Math.round(
          rule.maxBytes / MB,
        )} MB.`,
    };
  }

  const normalizedMime =
    mimeType
      .trim()
      .toLowerCase();

  if (
    !rule.mimeTypes.includes(
      normalizedMime,
    )
  ) {
    return {
      success:
        false as const,
      error:
        `MIME type không phù hợp với file .${extension}.`,
    };
  }

  return {
    success:
      true as const,

    extension,
    rule,
  };
}

function startsWithBytes(
  buffer: Buffer,
  bytes: number[],
) {
  if (
    buffer.length <
    bytes.length
  ) {
    return false;
  }

  return bytes.every(
    (value, index) =>
      buffer[index] === value,
  );
}

function validateImage(
  buffer: Buffer,
  extension: string,
) {
  if (
    extension === "jpg" ||
    extension === "jpeg"
  ) {
    return startsWithBytes(
      buffer,
      [0xff, 0xd8, 0xff],
    );
  }

  if (
    extension === "png"
  ) {
    return startsWithBytes(
      buffer,
      [
        0x89,
        0x50,
        0x4e,
        0x47,
        0x0d,
        0x0a,
        0x1a,
        0x0a,
      ],
    );
  }

  if (
    extension === "webp"
  ) {
    return (
      buffer.length >= 12 &&
      buffer
        .subarray(0, 4)
        .toString("ascii") ===
        "RIFF" &&
      buffer
        .subarray(8, 12)
        .toString("ascii") ===
        "WEBP"
    );
  }

  return false;
}

function validateTextBuffer(
  buffer: Buffer,
) {
  const text =
    buffer.toString("utf8");

  // NUL byte thường là dấu hiệu đây không phải plain text.
  if (
    text.includes("\u0000")
  ) {
    return {
      success:
        false as const,
      error:
        "File được khai báo là text nhưng chứa dữ liệu binary.",
    };
  }

  const sample =
    text.slice(
      0,
      100_000,
    );

  let suspiciousControls =
    0;

  for (
    const char of sample
  ) {
    const code =
      char.charCodeAt(0);

    if (
      code < 32 &&
      code !== 9 &&
      code !== 10 &&
      code !== 13
    ) {
      suspiciousControls +=
        1;
    }
  }

  if (
    sample.length > 0 &&
    suspiciousControls /
      sample.length >
      0.01
  ) {
    return {
      success:
        false as const,
      error:
        "File text chứa quá nhiều control characters.",
    };
  }

  return {
    success:
      true as const,
    text,
  };
}

async function validateOfficeZip(
  buffer: Buffer,
  extension: string,
) {
  if (
    !startsWithBytes(
      buffer,
      [0x50, 0x4b],
    )
  ) {
    return {
      success:
        false as const,
      error:
        "Office document không có ZIP signature hợp lệ.",
    };
  }

  let zip: JSZip;

  try {
    zip =
      await JSZip.loadAsync(
        buffer,
      );
  } catch {
    return {
      success:
        false as const,
      error:
        "Không thể đọc cấu trúc Office document.",
    };
  }

  const names =
    Object.keys(
      zip.files,
    );

  if (
    names.length > 5000
  ) {
    return {
      success:
        false as const,
      error:
        "Office document chứa quá nhiều entries.",
    };
  }

  const forbidden =
    [
      "vbaproject.bin",
      "/activex/",
      "/embeddings/",
      ".exe",
      ".dll",
      ".com",
      ".scr",
      ".hta",
      ".cmd",
      ".bat",
      ".ps1",
      ".sh",
      ".js",
      ".vbs",
    ];

  for (
    const rawName of names
  ) {
    const name =
      rawName.replace(
        /\\/g,
        "/",
      );

    const lower =
      name.toLowerCase();

    const segments =
      name.split("/");

    if (
      name.startsWith("/") ||
      segments.includes("..")
    ) {
      return {
        success:
          false as const,
        error:
          "Office archive chứa path không an toàn.",
      };
    }

    if (
      forbidden.some(
        (pattern) =>
          lower.includes(
            pattern,
          ),
      )
    ) {
      return {
        success:
          false as const,
        error:
          "Office document chứa active hoặc embedded content không được hỗ trợ.",
      };
    }
  }

  if (
    extension === "docx" &&
    !zip.file(
      "word/document.xml",
    )
  ) {
    return {
      success:
        false as const,
      error:
        "DOCX structure không hợp lệ.",
    };
  }

  if (
    extension === "xlsx" &&
    !zip.file(
      "xl/workbook.xml",
    )
  ) {
    return {
      success:
        false as const,
      error:
        "XLSX structure không hợp lệ.",
    };
  }

  return {
    success:
      true as const,
  };
}

export async function performStaticFileScreening({
  buffer,
  extension,
}: {
  buffer: Buffer;
  extension: string;
}) {
  if (
    extension === "jpg" ||
    extension === "jpeg" ||
    extension === "png" ||
    extension === "webp"
  ) {
    if (
      !validateImage(
        buffer,
        extension,
      )
    ) {
      return {
        success:
          false as const,
        error:
          "File ảnh không khớp với định dạng được khai báo.",
      };
    }

    return {
      success:
        true as const,
      previewText:
        null,
    };
  }

  if (
    extension === "pdf"
  ) {
    if (
      buffer
        .subarray(0, 5)
        .toString(
          "ascii",
        ) !== "%PDF-"
    ) {
      return {
        success:
          false as const,
        error:
          "PDF signature không hợp lệ.",
      };
    }

    // Đây không phải full PDF malware scanner.
    // Ta chủ động reject một số active-content primitives
    // trong MVP.
    const pdfText =
      buffer.toString(
        "latin1",
      );

    const dangerousPdfPatterns =
      [
        "/JavaScript",
        "/JS",
        "/Launch",
        "/EmbeddedFile",
        "/RichMedia",
      ];

    if (
      dangerousPdfPatterns.some(
        (pattern) =>
          pdfText.includes(
            pattern,
          ),
      )
    ) {
      return {
        success:
          false as const,
        error:
          "PDF chứa active/embedded content không được phép.",
      };
    }

    return {
      success:
        true as const,
      previewText:
        null,
    };
  }

  if (
    extension === "docx" ||
    extension === "xlsx"
  ) {
    const result =
      await validateOfficeZip(
        buffer,
        extension,
      );

    if (!result.success) {
      return result;
    }

    return {
      success:
        true as const,
      previewText:
        null,
    };
  }

  if (
    extension === "txt" ||
    extension === "md" ||
    extension === "csv" ||
    extension === "json"
  ) {
    const result =
      validateTextBuffer(
        buffer,
      );

    if (!result.success) {
      return result;
    }

    if (
      extension === "json"
    ) {
      try {
        JSON.parse(
          result.text,
        );
      } catch {
        return {
          success:
            false as const,
          error:
            "JSON không hợp lệ.",
        };
      }
    }

    return {
      success:
        true as const,

      // Chỉ lưu một preview nhỏ cho moderation/audit.
      // Không copy nguyên document vào DB.
      previewText:
        result.text
          .slice(
            0,
            4000,
          )
          .trim() ||
        null,
    };
  }

  return {
    success:
      false as const,
    error:
      "Định dạng file chưa được scanner hỗ trợ.",
  };
}
