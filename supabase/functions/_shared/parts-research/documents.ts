import { stripHtml } from "./transport.ts";
import { type Chip, type Dependencies, MAX_SOURCE_BYTES } from "./types.ts";

export const PDF_MODULE = "npm:unpdf@0.12.1";
export async function pdfContent(
  bytes: Uint8Array,
  deps: Dependencies,
  options: { maxPages?: number; pageCount?: number } = {},
): Promise<{ text: string; pages: number; scanned: boolean }> {
  let text: string, pages: number;
  if (deps.extractPdf) {
    text = await deps.extractPdf(bytes, options);
    pages = Math.min(
      options.pageCount ?? options.maxPages ?? 1,
      options.maxPages ?? Infinity,
    );
  } else {
    const mod = await import(PDF_MODULE).catch(() => {
      throw new Error("pdf reader unavailable");
    });
    const document = await mod.getDocumentProxy(new Uint8Array(bytes));
    pages = Math.min(document.numPages, options.maxPages ?? document.numPages);
    text = await firstPdfPages(document, pages);
  }
  return {
    text,
    pages,
    scanned: text.trim().length / Math.max(1, pages) < 200,
  };
}
/** Compatibility wrapper for callers needing only the text. */
export async function pdfText(
  bytes: Uint8Array,
  deps: Dependencies,
  options: { maxPages?: number } = {},
): Promise<string> {
  return (await pdfContent(bytes, deps, options)).text;
}
export function measureExcerpt(
  text: string,
  chip: Chip,
): { text: string; fragments: string[]; excerpted: true } {
  const priorities = chip === "investor-update"
    ? "funding|investment|financing|announcement"
    : chip === "lender-update"
    ? "debt|liquidity|financing|covenant"
    : "results|earnings|announcement";
  const words = new RegExp(
    `revenue|turnover|profit|loss|net assets|forecourts|cash|subscribers|users|net income|guidance|employees|${priorities}`,
    "gi",
  );
  const ranges: [number, number][] = [];
  for (const match of text.matchAll(words)) {
    const start = Math.max(0, match.index! - 900),
      end = Math.min(text.length, match.index! + 2100);
    const last = ranges.at(-1);
    if (last && start <= last[1]) last[1] = Math.max(last[1], end);
    else ranges.push([start, end]);
  }
  const fragments: string[] = [];
  let size = 0;
  for (const [start, end] of ranges) {
    const bytes = new TextEncoder().encode(text.slice(start, end));
    const room = MAX_SOURCE_BYTES - size - (fragments.length ? 1 : 0);
    if (room <= 0) break;
    let length = Math.min(room, bytes.length);
    while (
      length > 0 && length < bytes.length && (bytes[length] & 0xc0) === 0x80
    ) length--;
    const span = new TextDecoder("utf-8", { fatal: true }).decode(
      bytes.subarray(0, length),
    );
    if (span) {
      fragments.push(span);
      size += length + (fragments.length > 1 ? 1 : 0);
    }
  }
  return { text: fragments.join("\n"), fragments, excerpted: true };
}
export function filingText(raw: string, chip: Chip) {
  return measureExcerpt(stripHtml(raw), chip);
}

export async function firstPdfPages(document: {
  numPages: number;
  getPage(
    n: number,
  ): Promise<
    {
      getTextContent(): Promise<{ items: { str?: string }[] }>;
      cleanup(): void;
    }
  >;
  destroy(): Promise<void>;
}, limit = 40): Promise<string> {
  const pages: string[] = [];
  try {
    for (let n = 1; n <= Math.min(limit, document.numPages); n++) {
      const page = await document.getPage(n);
      const content = await page.getTextContent();
      pages.push(content.items.map((item) => item.str ?? "").join(" "));
      page.cleanup();
    }
  } finally {
    await document.destroy();
  }
  return pages.join("\n");
}
