import { stripHtml } from "./transport.ts";
import { type Chip, type Dependencies, MAX_SOURCE_BYTES } from "./types.ts";

export const PDF_MODULE = "npm:unpdf@0.12.1";
/** Dynamic loading keeps offline fixtures independent of the human-cached package. */
export async function pdfText(
  bytes: Uint8Array,
  deps: Dependencies,
): Promise<string> {
  if (deps.extractPdf) return await deps.extractPdf(bytes);
  const { extractText } = await import(PDF_MODULE).catch(() => {
    throw new Error("pdf reader unavailable");
  }) as {
    extractText(
      bytes: Uint8Array,
      options: { mergePages: true },
    ): Promise<{ text: string }>;
  };
  const result = await extractText(new Uint8Array(bytes), { mergePages: true });
  if (typeof result.text !== "string") throw new Error("Invalid PDF text");
  return result.text;
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
    `revenue|cash|subscribers|users|net income|guidance|employees|${priorities}`,
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
