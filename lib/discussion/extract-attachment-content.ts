import "server-only";

import JSZip from "jszip";
import * as mammoth from "mammoth";
import {
  extractText,
  getDocumentProxy,
} from "unpdf";

import {
  DISCUSSION_ATTACHMENT_BUCKET,
  getSupabaseAdmin,
} from "@/lib/supabase-admin";

const MAX_TEXT_PER_ATTACHMENT =
  12_000;

export type ExtractableAttachment = {
  id: string;
  originalName: string;
  storagePath: string;
  mimeType: string;
  kind:
    | "IMAGE"
    | "DOCUMENT"
    | "DATASET"
    | "SUPPLEMENTARY";
};

export type ExtractedAttachment =
  | {
      id: string;
      originalName: string;
      kind: "IMAGE";
      mode: "IMAGE";
      signedUrl: string;
      text: null;
      truncated: false;
    }
  | {
      id: string;
      originalName: string;
      kind:
        | "DOCUMENT"
        | "DATASET"
        | "SUPPLEMENTARY";
      mode: "TEXT";
      signedUrl: null;
      text: string;
      truncated: boolean;
    };

function getExtension(
  name: string,
) {
  return (
    name
      .toLowerCase()
      .split(".")
      .pop() || ""
  );
}

function cleanText(
  value: string,
) {
  return value
    .replace(/\u0000/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

function limitText(
  value: string,
) {
  const cleaned =
    cleanText(value);

  if (
    cleaned.length <=
    MAX_TEXT_PER_ATTACHMENT
  ) {
    return {
      text: cleaned,
      truncated: false,
    };
  }

  return {
    text:
      cleaned.slice(
        0,
        MAX_TEXT_PER_ATTACHMENT,
      ) +
      "\n\n[CONTENT TRUNCATED FOR MODERATION]",

    truncated: true,
  };
}

function decodeXml(
  value: string,
) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function extractXmlText(
  xml: string,
) {
  const matches =
    [
      ...xml.matchAll(
        /<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/gi,
      ),
    ];

  return matches
    .map((match) =>
      decodeXml(
        match[1]
          .replace(
            /<[^>]+>/g,
            "",
          ),
      ),
    )
    .join("\n");
}

async function extractXlsxText(
  buffer: Buffer,
) {
  const zip =
    await JSZip.loadAsync(
      buffer,
    );

  const sharedFile =
    zip.file(
      "xl/sharedStrings.xml",
    );

  const sharedStrings:
    string[] = [];

  if (sharedFile) {
    const xml =
      await sharedFile.async(
        "string",
      );

    const entries =
      [
        ...xml.matchAll(
          /<si(?:\s[^>]*)?>([\s\S]*?)<\/si>/gi,
        ),
      ];

    for (
      const entry of entries
    ) {
      sharedStrings.push(
        extractXmlText(
          entry[1],
        ),
      );
    }
  }

  const worksheetNames =
    Object.keys(
      zip.files,
    )
      .filter((name) =>
        /^xl\/worksheets\/sheet\d+\.xml$/i.test(
          name,
        ),
      )
      .sort();

  const output:
    string[] = [];

  for (
    const worksheetName of
      worksheetNames
  ) {
    const file =
      zip.file(
        worksheetName,
      );

    if (!file) {
      continue;
    }

    const xml =
      await file.async(
        "string",
      );

    output.push(
      `--- ${worksheetName} ---`,
    );

    const cells =
      [
        ...xml.matchAll(
          /<c\b([^>]*)>([\s\S]*?)<\/c>/gi,
        ),
      ];

    for (
      const cell of cells
    ) {
      const attrs =
        cell[1];

      const body =
        cell[2];

      const ref =
        attrs.match(
          /\br="([^"]+)"/i,
        )?.[1];

      const type =
        attrs.match(
          /\bt="([^"]+)"/i,
        )?.[1];

      let value = "";

      if (
        type === "inlineStr"
      ) {
        value =
          extractXmlText(
            body,
          );
      } else {
        const raw =
          body.match(
            /<v>([\s\S]*?)<\/v>/i,
          )?.[1];

        if (
          raw !==
          undefined
        ) {
          if (
            type === "s"
          ) {
            const index =
              Number(raw);

            value =
              sharedStrings[
                index
              ] ?? raw;
          } else {
            value =
              decodeXml(raw);
          }
        }
      }

      if (value.trim()) {
        output.push(
          `${ref || "cell"}: ${value}`,
        );
      }

      if (
        output.join("\n")
          .length >
        MAX_TEXT_PER_ATTACHMENT *
          2
      ) {
        break;
      }
    }
  }

  return output.join(
    "\n",
  );
}

async function downloadAttachment(
  storagePath: string,
) {
  const supabase =
    getSupabaseAdmin();

  const result =
    await supabase.storage
      .from(
        DISCUSSION_ATTACHMENT_BUCKET,
      )
      .download(
        storagePath,
      );

  if (
    result.error ||
    !result.data
  ) {
    throw new Error(
      `Cannot download attachment: ${
        result.error?.message ||
        "unknown error"
      }`,
    );
  }

  return Buffer.from(
    await result.data.arrayBuffer(),
  );
}

export async function extractAttachmentContent(
  attachment:
    ExtractableAttachment,
): Promise<ExtractedAttachment> {
  const extension =
    getExtension(
      attachment.originalName,
    );

  const supabase =
    getSupabaseAdmin();

  if (
    attachment.kind ===
    "IMAGE"
  ) {
    const signed =
      await supabase.storage
        .from(
          DISCUSSION_ATTACHMENT_BUCKET,
        )
        .createSignedUrl(
          attachment.storagePath,
          10 * 60,
        );

    if (
      signed.error ||
      !signed.data?.signedUrl
    ) {
      throw new Error(
        `Cannot create signed image URL: ${
          signed.error
            ?.message ||
          "unknown error"
        }`,
      );
    }

    return {
      id:
        attachment.id,

      originalName:
        attachment.originalName,

      kind: "IMAGE",
      mode: "IMAGE",

      signedUrl:
        signed.data
          .signedUrl,

      text: null,

      truncated:
        false,
    };
  }

  const buffer =
    await downloadAttachment(
      attachment.storagePath,
    );

  let rawText = "";

  if (
    extension === "txt" ||
    extension === "md" ||
    extension === "csv" ||
    extension === "json"
  ) {
    rawText =
      buffer.toString(
        "utf8",
      );
  } else if (
    extension === "docx"
  ) {
    const result =
      await mammoth.extractRawText(
        {
          buffer,
        },
      );

    rawText =
      result.value;
  } else if (
    extension === "pdf"
  ) {
    const pdf =
      await getDocumentProxy(
        new Uint8Array(
          buffer,
        ),
      );

    const result =
      await extractText(
        pdf,
        {
          mergePages:
            true,
        },
      );

    rawText =
      Array.isArray(
        result.text,
      )
        ? result.text.join(
            "\n",
          )
        : result.text;
  } else if (
    extension === "xlsx"
  ) {
    rawText =
      await extractXlsxText(
        buffer,
      );
  } else {
    throw new Error(
      `No content extractor for .${extension}`,
    );
  }

  const limited =
    limitText(
      rawText,
    );

  if (
    !limited.text.trim()
  ) {
    throw new Error(
      `Không trích xuất được text từ ${attachment.originalName}.`,
    );
  }

  return {
    id:
      attachment.id,

    originalName:
      attachment.originalName,

    kind:
      attachment.kind,

    mode: "TEXT",

    signedUrl: null,

    text:
      limited.text,

    truncated:
      limited.truncated,
  };
}
