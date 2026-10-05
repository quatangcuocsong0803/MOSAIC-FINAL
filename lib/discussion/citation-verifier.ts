import "server-only";

import dns from "node:dns/promises";
import net from "node:net";

import {
  CitationSourceType,
  CitationVerificationStatus,
  Prisma,
} from "@prisma/client";

import {
  prisma,
} from "@/lib/prisma";

const VERIFIER_VERSION =
  "citation-verifier-v1";

const MAX_REMOTE_BYTES =
  128 * 1024;

const MAX_REDIRECTS =
  5;

type CanonicalMetadata = {
  title: string | null;
  authors: string | null;
  year: number | null;
  publisher: string | null;
  doi: string | null;
  url: string | null;
  crossrefType: string | null;
};

export type CitationVerificationResult = {
  citationId: string;

  status:
    CitationVerificationStatus;

  note:
    string;

  canonical:
    CanonicalMetadata;

  titleSimilarity:
    number | null;
};

function normalizeDoi(
  raw: string,
) {
  return raw
    .trim()
    .replace(
      /^https?:\/\/(?:dx\.)?doi\.org\//i,
      "",
    )
    .replace(
      /^doi:\s*/i,
      "",
    )
    .trim();
}

function isValidDoi(
  raw: string,
) {
  return /^10\.\d{4,9}\/\S+$/i.test(
    normalizeDoi(
      raw,
    ),
  );
}

function normalizeText(
  raw: string,
) {
  return raw
    .normalize(
      "NFKD",
    )
    .replace(
      /\p{Diacritic}/gu,
      "",
    )
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      " ",
    )
    .replace(
      /\s+/g,
      " ",
    )
    .trim();
}

function titleSimilarity(
  left: string,
  right: string,
) {
  const a =
    new Set(
      normalizeText(
        left,
      )
        .split(" ")
        .filter(
          (item) =>
            item.length > 2,
        ),
    );

  const b =
    new Set(
      normalizeText(
        right,
      )
        .split(" ")
        .filter(
          (item) =>
            item.length > 2,
        ),
    );

  if (
    a.size === 0 ||
    b.size === 0
  ) {
    return 0;
  }

  let intersection =
    0;

  for (const token of a) {
    if (
      b.has(
        token,
      )
    ) {
      intersection +=
        1;
    }
  }

  const union =
    new Set([
      ...a,
      ...b,
    ]).size;

  return (
    intersection /
    union
  );
}

function blockedIpv4(
  address: string,
) {
  const parts =
    address
      .split(".")
      .map(Number);

  if (
    parts.length !== 4 ||
    parts.some(
      (value) =>
        !Number.isInteger(
          value,
        ),
    )
  ) {
    return true;
  }

  const [
    a,
    b,
  ] = parts;

  if (a === 0) {
    return true;
  }

  if (a === 10) {
    return true;
  }

  if (a === 127) {
    return true;
  }

  if (
    a === 169 &&
    b === 254
  ) {
    return true;
  }

  if (
    a === 172 &&
    b >= 16 &&
    b <= 31
  ) {
    return true;
  }

  if (
    a === 192 &&
    b === 168
  ) {
    return true;
  }

  if (
    a === 100 &&
    b >= 64 &&
    b <= 127
  ) {
    return true;
  }

  if (
    a === 198 &&
    (
      b === 18 ||
      b === 19
    )
  ) {
    return true;
  }

  if (
    a >= 224
  ) {
    return true;
  }

  return false;
}

function blockedIp(
  address: string,
) {
  const version =
    net.isIP(
      address,
    );

  if (
    version === 4
  ) {
    return blockedIpv4(
      address,
    );
  }

  if (
    version === 6
  ) {
    const normalized =
      address.toLowerCase();

    if (
      normalized === "::" ||
      normalized === "::1"
    ) {
      return true;
    }

    if (
      normalized.startsWith(
        "fc",
      ) ||
      normalized.startsWith(
        "fd",
      )
    ) {
      return true;
    }

    if (
      /^fe[89ab]/i.test(
        normalized,
      )
    ) {
      return true;
    }

    const mapped =
      normalized.match(
        /::ffff:(\d+\.\d+\.\d+\.\d+)$/,
      );

    if (
      mapped
    ) {
      return blockedIpv4(
        mapped[1],
      );
    }

    return false;
  }

  return true;
}

async function assertSafeUrl(
  raw: string,
) {
  let url:
    URL;

  try {
    url =
      new URL(
        raw,
      );
  } catch {
    throw new Error(
      "URL không hợp lệ.",
    );
  }

  if (
    url.protocol !==
      "https:" &&
    url.protocol !==
      "http:"
  ) {
    throw new Error(
      "Chỉ chấp nhận HTTP hoặc HTTPS.",
    );
  }

  const hostname =
    url.hostname
      .toLowerCase()
      .replace(
        /\.$/,
        "",
      );

  if (
    hostname ===
      "localhost" ||
    hostname.endsWith(
      ".localhost",
    ) ||
    hostname.endsWith(
      ".local",
    ) ||
    hostname.endsWith(
      ".internal",
    ) ||
    hostname ===
      "metadata.google.internal"
  ) {
    throw new Error(
      "URL trỏ tới địa chỉ nội bộ.",
    );
  }

  let addresses:
    Awaited<
      ReturnType<
        typeof dns.lookup
      >
    >[];

  try {
    addresses =
      await dns.lookup(
        hostname,
        {
          all: true,
          verbatim: true,
        },
      ) as Awaited<
        ReturnType<
          typeof dns.lookup
        >
      >[];
  } catch {
    throw new Error(
      "Không phân giải được hostname.",
    );
  }

  if (
    addresses.length ===
    0
  ) {
    throw new Error(
      "Hostname không có địa chỉ mạng hợp lệ.",
    );
  }

  for (
    const resolved of
      addresses
  ) {
    if (
      blockedIp(
        resolved.address,
      )
    ) {
      throw new Error(
        "URL phân giải tới mạng private/internal.",
      );
    }
  }

  return url;
}

async function readLimitedText(
  response:
    Response,
) {
  if (
    !response.body
  ) {
    return "";
  }

  const reader =
    response.body.getReader();

  const chunks:
    Buffer[] = [];

  let total =
    0;

  try {
    while (true) {
      const {
        value,
        done,
      } =
        await reader.read();

      if (
        done ||
        !value
      ) {
        break;
      }

      const remaining =
        MAX_REMOTE_BYTES -
        total;

      if (
        remaining <= 0
      ) {
        break;
      }

      const chunk =
        Buffer.from(
          value,
        );

      chunks.push(
        chunk.subarray(
          0,
          remaining,
        ),
      );

      total +=
        Math.min(
          chunk.length,
          remaining,
        );

      if (
        total >=
        MAX_REMOTE_BYTES
      ) {
        break;
      }
    }
  } finally {
    await reader
      .cancel()
      .catch(
        () => undefined,
      );
  }

  return Buffer.concat(
    chunks,
  ).toString(
    "utf8",
  );
}

async function safeFetchUrl(
  initialUrl: string,
) {
  let current =
    initialUrl;

  for (
    let redirect = 0;
    redirect <=
    MAX_REDIRECTS;
    redirect += 1
  ) {
    const safe =
      await assertSafeUrl(
        current,
      );

    const controller =
      new AbortController();

    const timeout =
      setTimeout(
        () =>
          controller.abort(),
        12_000,
      );

    try {
      const response =
        await fetch(
          safe,
          {
            redirect:
              "manual",

            signal:
              controller.signal,

            headers: {
              "User-Agent":
                "MOSAIC-Citation-Verifier/1.0",

              Accept:
                "text/html,application/xhtml+xml,text/plain,application/json;q=0.8,*/*;q=0.5",

              Range:
                `bytes=0-${MAX_REMOTE_BYTES - 1}`,
            },
          },
        );

      if (
        response.status >=
          300 &&
        response.status <
          400
      ) {
        const location =
          response.headers.get(
            "location",
          );

        if (
          !location
        ) {
          throw new Error(
            "Redirect không có Location header.",
          );
        }

        if (
          redirect ===
          MAX_REDIRECTS
        ) {
          throw new Error(
            "URL redirect quá nhiều lần.",
          );
        }

        current =
          new URL(
            location,
            safe,
          ).toString();

        continue;
      }

      const contentType =
        response.headers.get(
          "content-type",
        ) || "";

      const text =
        contentType.includes(
          "text",
        ) ||
        contentType.includes(
          "json",
        ) ||
        contentType.includes(
          "xml",
        )
          ? await readLimitedText(
              response,
            )
          : "";

      return {
        status:
          response.status,

        finalUrl:
          safe.toString(),

        contentType,

        text,

        reachable:
          response.status >=
            200 &&
          response.status <
            500 &&
          response.status !==
            404 &&
          response.status !==
            410,
      };
    } finally {
      clearTimeout(
        timeout,
      );
    }
  }

  throw new Error(
    "Không thể hoàn tất URL verification.",
  );
}

function htmlTitle(
  html: string,
) {
  const og =
    html.match(
      /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
    )?.[1] ||
    html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i,
    )?.[1];

  if (og) {
    return og
      .replace(
        /\s+/g,
        " ",
      )
      .trim();
  }

  const title =
    html.match(
      /<title[^>]*>([\s\S]*?)<\/title>/i,
    )?.[1];

  return (
    title
      ?.replace(
        /<[^>]+>/g,
        "",
      )
      .replace(
        /\s+/g,
        " ",
      )
      .trim() ||
    null
  );
}

function crossrefAuthors(
  value: unknown,
) {
  if (
    !Array.isArray(
      value,
    )
  ) {
    return null;
  }

  const names =
    value
      .map(
        (author) => {
          if (
            !author ||
            typeof author !==
              "object"
          ) {
            return "";
          }

          const record =
            author as Record<
              string,
              unknown
            >;

          return [
            typeof record.given ===
            "string"
              ? record.given
              : "",

            typeof record.family ===
            "string"
              ? record.family
              : "",
          ]
            .filter(
              Boolean,
            )
            .join(" ");
        },
      )
      .filter(
        Boolean,
      );

  return names.length >
    0
    ? names.join(
        ", ",
      )
    : null;
}

function crossrefYear(
  message:
    Record<
      string,
      unknown
    >,
) {
  const candidates = [
    message[
      "published-print"
    ],
    message[
      "published-online"
    ],
    message.published,
    message.issued,
  ];

  for (
    const candidate of
      candidates
  ) {
    if (
      !candidate ||
      typeof candidate !==
        "object"
    ) {
      continue;
    }

    const parts =
      (
        candidate as Record<
          string,
          unknown
        >
      )["date-parts"];

    if (
      !Array.isArray(
        parts,
      ) ||
      !Array.isArray(
        parts[0],
      )
    ) {
      continue;
    }

    const year =
      Number(
        parts[0][0],
      );

    if (
      Number.isInteger(
        year,
      )
    ) {
      return year;
    }
  }

  return null;
}

function crossrefMetadata(
  message:
    Record<
      string,
      unknown
    >,
): CanonicalMetadata {
  const rawTitle =
    Array.isArray(
      message.title,
    )
      ? message.title[0]
      : null;

  return {
    title:
      typeof rawTitle ===
      "string"
        ? rawTitle
        : null,

    authors:
      crossrefAuthors(
        message.author,
      ),

    year:
      crossrefYear(
        message,
      ),

    publisher:
      typeof message.publisher ===
      "string"
        ? message.publisher
        : null,

    doi:
      typeof message.DOI ===
      "string"
        ? normalizeDoi(
            message.DOI,
          )
        : null,

    url:
      typeof message.URL ===
      "string"
        ? message.URL
        : null,

    crossrefType:
      typeof message.type ===
      "string"
        ? message.type
        : null,
  };
}

async function crossrefRequest(
  url: string,
) {
  const controller =
    new AbortController();

  const timeout =
    setTimeout(
      () =>
        controller.abort(),
      12_000,
    );

  try {
    const response =
      await fetch(
        url,
        {
          signal:
            controller.signal,

          headers: {
            Accept:
              "application/json",

            "User-Agent":
              "MOSAIC-Citation-Verifier/1.0",
          },
        },
      );

    if (
      response.status ===
      404
    ) {
      return {
        found: false,
        body: null,
      };
    }

    if (
      !response.ok
    ) {
      throw new Error(
        `Crossref HTTP ${response.status}`,
      );
    }

    return {
      found: true,
      body:
        await response.json(),
    };
  } finally {
    clearTimeout(
      timeout,
    );
  }
}

async function lookupDoi(
  doi: string,
) {
  const encoded =
    encodeURIComponent(
      doi,
    );

  const result =
    await crossrefRequest(
      `https://api.crossref.org/works/${encoded}`,
    );

  if (
    !result.found ||
    !result.body
  ) {
    return null;
  }

  const message =
    (
      result.body as {
        message?: unknown;
      }
    ).message;

  if (
    !message ||
    typeof message !==
      "object"
  ) {
    return null;
  }

  return crossrefMetadata(
    message as Record<
      string,
      unknown
    >,
  );
}

async function searchCrossrefTitle(
  title: string,
) {
  const query =
    encodeURIComponent(
      title,
    );

  const result =
    await crossrefRequest(
      `https://api.crossref.org/works?query.bibliographic=${query}&rows=3`,
    );

  if (
    !result.found ||
    !result.body
  ) {
    return null;
  }

  const message =
    (
      result.body as {
        message?: unknown;
      }
    ).message;

  if (
    !message ||
    typeof message !==
      "object"
  ) {
    return null;
  }

  const items =
    (
      message as Record<
        string,
        unknown
      >
    ).items;

  if (
    !Array.isArray(
      items,
    )
  ) {
    return null;
  }

  let best:
    {
      metadata:
        CanonicalMetadata;

      similarity:
        number;
    } | null =
    null;

  for (
    const raw of items
  ) {
    if (
      !raw ||
      typeof raw !==
        "object"
    ) {
      continue;
    }

    const metadata =
      crossrefMetadata(
        raw as Record<
          string,
          unknown
        >,
      );

    if (
      !metadata.title
    ) {
      continue;
    }

    const similarity =
      titleSimilarity(
        title,
        metadata.title,
      );

    if (
      !best ||
      similarity >
        best.similarity
    ) {
      best = {
        metadata,
        similarity,
      };
    }
  }

  return best;
}

function sourceTypeMismatch(
  sourceType:
    CitationSourceType,
  canonical:
    CanonicalMetadata,
) {
  const type =
    canonical.crossrefType;

  if (!type) {
    return null;
  }

  if (
    sourceType ===
    "PEER_REVIEWED"
  ) {
    const compatible =
      new Set([
        "journal-article",
        "proceedings-article",
      ]);

    if (
      !compatible.has(
        type,
      )
    ) {
      return `Nguồn được khai là PEER_REVIEWED nhưng metadata học thuật cho thấy type "${type}".`;
    }
  }

  if (
    sourceType ===
    "ACADEMIC_BOOK"
  ) {
    const compatible =
      new Set([
        "book",
        "book-chapter",
        "book-section",
        "monograph",
        "reference-book",
        "edited-book",
      ]);

    if (
      !compatible.has(
        type,
      )
    ) {
      return `Nguồn được khai là ACADEMIC_BOOK nhưng metadata học thuật cho thấy type "${type}".`;
    }
  }

  return null;
}

async function verifyOne(
  citation: {
    id: string;
    title: string;
    authors: string | null;
    year: number | null;
    publisher: string | null;
    url: string | null;
    doi: string | null;
    sourceType:
      CitationSourceType;
  },
): Promise<CitationVerificationResult> {
  const emptyCanonical:
    CanonicalMetadata = {
      title: null,
      authors: null,
      year: null,
      publisher: null,
      doi: null,
      url: null,
      crossrefType: null,
    };

  const doi =
    citation.doi
      ? normalizeDoi(
          citation.doi,
        )
      : "";

  if (
    doi &&
    !isValidDoi(
      doi,
    )
  ) {
    return {
      citationId:
        citation.id,

      status:
        "INVALID",

      note:
        "DOI không đúng định dạng.",

      canonical:
        emptyCanonical,

      titleSimilarity:
        null,
    };
  }

  let canonical =
    emptyCanonical;

  let similarity:
    number | null =
    null;

  if (doi) {
    try {
      const doiMetadata =
        await lookupDoi(
          doi,
        );

      if (
        doiMetadata
      ) {
        canonical =
          doiMetadata;

        if (
          canonical.title
        ) {
          similarity =
            titleSimilarity(
              citation.title,
              canonical.title,
            );
        }

        if (
          similarity !==
            null &&
          similarity <
            0.42
        ) {
          return {
            citationId:
              citation.id,

            status:
              "MISMATCH",

            note:
              "DOI tồn tại nhưng title khai báo không khớp đáng kể với metadata của DOI.",

            canonical,

            titleSimilarity:
              similarity,
          };
        }

        if (
          citation.year &&
          canonical.year &&
          Math.abs(
            citation.year -
              canonical.year,
          ) > 1
        ) {
          return {
            citationId:
              citation.id,

            status:
              "MISMATCH",

            note:
              `Năm khai báo (${citation.year}) không khớp metadata nguồn (${canonical.year}).`,

            canonical,

            titleSimilarity:
              similarity,
          };
        }

        const typeMismatch =
          sourceTypeMismatch(
            citation.sourceType,
            canonical,
          );

        if (
          typeMismatch
        ) {
          return {
            citationId:
              citation.id,

            status:
              "MISMATCH",

            note:
              typeMismatch,

            canonical,

            titleSimilarity:
              similarity,
          };
        }

        return {
          citationId:
            citation.id,

          status:
            "VERIFIED",

          note:
            citation.sourceType ===
            "PEER_REVIEWED"
              ? "DOI và metadata học thuật được xác minh. Trạng thái VERIFIED không tự động chứng minh mọi claim trong bài."
              : "DOI và metadata nguồn được xác minh.",

          canonical,

          titleSimilarity:
            similarity,
        };
      }
    } catch {
      // Nếu Crossref tạm lỗi, thử DOI resolver bên dưới.
    }

    try {
      const doiUrl =
        `https://doi.org/${doi}`;

      const remote =
        await safeFetchUrl(
          doiUrl,
        );

      if (
        remote.reachable
      ) {
        return {
          citationId:
            citation.id,

          status:
            "VERIFIED",

          note:
            "DOI resolve được, nhưng chưa lấy được canonical metadata từ Crossref.",

          canonical: {
            ...emptyCanonical,
            doi,
            url:
              remote.finalUrl,
          },

          titleSimilarity:
            null,
        };
      }
    } catch {
      // Fall through to invalid/unreachable.
    }

    return {
      citationId:
        citation.id,

      status:
        "UNREACHABLE",

      note:
        "Không thể xác minh DOI ở thời điểm hiện tại.",

      canonical:
        emptyCanonical,

      titleSimilarity:
        null,
    };
  }

  if (
    !citation.url
  ) {
    return {
      citationId:
        citation.id,

      status:
        "INVALID",

      note:
        "Citation không có URL hoặc DOI.",

      canonical:
        emptyCanonical,

      titleSimilarity:
        null,
    };
  }

  let remote:
    Awaited<
      ReturnType<
        typeof safeFetchUrl
      >
    >;

  try {
    remote =
      await safeFetchUrl(
        citation.url,
      );
  } catch (
    error
  ) {
    const message =
      error instanceof Error
        ? error.message
        : "URL không hợp lệ.";

    const invalid =
      /không hợp lệ|private|internal|http|https/i.test(
        message,
      );

    return {
      citationId:
        citation.id,

      status:
        invalid
          ? "INVALID"
          : "UNREACHABLE",

      note:
        message,

      canonical:
        emptyCanonical,

      titleSimilarity:
        null,
    };
  }

  if (
    !remote.reachable
  ) {
    return {
      citationId:
        citation.id,

      status:
        "UNREACHABLE",

      note:
        `Nguồn trả HTTP ${remote.status}.`,

      canonical: {
        ...emptyCanonical,
        url:
          remote.finalUrl,
      },

      titleSimilarity:
        null,
    };
  }

  const pageTitle =
    htmlTitle(
      remote.text,
    );

  canonical = {
    ...emptyCanonical,

    title:
      pageTitle,

    url:
      remote.finalUrl,
  };

  if (
    pageTitle
  ) {
    similarity =
      titleSimilarity(
        citation.title,
        pageTitle,
      );
  }

  if (
    (
      citation.sourceType ===
        "PEER_REVIEWED" ||
      citation.sourceType ===
        "ACADEMIC_BOOK"
    )
  ) {
    try {
      const scholarly =
        await searchCrossrefTitle(
          citation.title,
        );

      if (
        scholarly &&
        scholarly.similarity >=
          0.7
      ) {
        canonical = {
          ...canonical,
          ...scholarly.metadata,

          url:
            scholarly.metadata
              .url ||
            remote.finalUrl,
        };

        similarity =
          scholarly.similarity;

        const typeMismatch =
          sourceTypeMismatch(
            citation.sourceType,
            canonical,
          );

        if (
          typeMismatch
        ) {
          return {
            citationId:
              citation.id,

            status:
              "MISMATCH",

            note:
              typeMismatch,

            canonical,

            titleSimilarity:
              similarity,
          };
        }

        return {
          citationId:
            citation.id,

          status:
            "VERIFIED",

          note:
            "URL tồn tại và metadata học thuật tương ứng được tìm thấy.",

          canonical,

          titleSimilarity:
            similarity,
        };
      }
    } catch {
      // URL verification vẫn có thể tiếp tục.
    }

    return {
      citationId:
        citation.id,

      status:
        "MISMATCH",

      note:
        citation.sourceType ===
        "PEER_REVIEWED"
          ? "URL tồn tại nhưng chưa tìm thấy metadata học thuật đủ mạnh để xác nhận classification PEER_REVIEWED. Hãy dùng DOI hoặc sửa loại nguồn."
          : "URL tồn tại nhưng chưa tìm thấy metadata phù hợp để xác nhận classification ACADEMIC_BOOK.",

      canonical,

      titleSimilarity:
        similarity,
    };
  }

  if (
    similarity !==
      null &&
    similarity <
      0.2
  ) {
    return {
      citationId:
        citation.id,

      status:
        "MISMATCH",

      note:
        "URL tồn tại nhưng title của trang khác đáng kể so với title citation đã khai.",

      canonical,

      titleSimilarity:
        similarity,
    };
  }

  return {
    citationId:
      citation.id,

    status:
      "VERIFIED",

    note:
      "URL nguồn có thể truy cập và metadata cơ bản không có xung đột rõ ràng.",

    canonical,

    titleSimilarity:
      similarity,
  };
}

export async function verifyPostCitations(
  postId: string,
) {
  const citations =
    await prisma.citation.findMany({
      where: {
        postId,
      },

      orderBy: {
        sortOrder:
          "asc",
      },
    });

  const results:
    CitationVerificationResult[] =
    [];

  for (
    const citation of
      citations
  ) {
    let result:
      CitationVerificationResult;

    try {
      result =
        await verifyOne(
          citation,
        );
    } catch (
      error
    ) {
      result = {
        citationId:
          citation.id,

        status:
          "UNREACHABLE",

        note:
          error instanceof Error
            ? error.message
            : "Citation verifier gặp lỗi không xác định.",

        canonical: {
          title: null,
          authors: null,
          year: null,
          publisher: null,
          doi: null,
          url: null,
          crossrefType:
            null,
        },

        titleSimilarity:
          null,
      };
    }

    const metadata = {
      version:
        VERIFIER_VERSION,

      checkedAt:
        new Date().toISOString(),

      canonical:
        result.canonical,

      titleSimilarity:
        result.titleSimilarity,
    };

    await prisma.citation.update({
      where: {
        id:
          citation.id,
      },

      data: {
        verificationStatus:
          result.status,

        verificationNote:
          result.note.slice(
            0,
            1500,
          ),

        verificationMetadata:
          metadata as Prisma.InputJsonValue,

        verifiedAt:
          new Date(),
      },
    });

    results.push(
      result,
    );
  }

  return results;
}
