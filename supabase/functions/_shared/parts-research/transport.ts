import { fetchResource } from "./fetch.ts";
import type { EnrichRuntime } from "../enrich/runtime.ts";
import { type Dependencies, MAX_BYTES } from "./types.ts";

export const normalise = (s: string) => s.replace(/\s+/g, " ").trim();
export function publicUrl(value: string): URL {
  const url = new URL(value);
  if (
    url.protocol !== "https:" || url.username || url.password || url.port ||
    !url.hostname.includes(".") ||
    /(^|\.)(localhost|local|internal|test|invalid)$/.test(url.hostname) ||
    /^\d|:|\[/.test(url.hostname)
  ) throw new Error("Public HTTPS URL required");
  return url;
}
export function publicIp(ip: string): boolean {
  if (ip.includes(":")) {
    return /^2[0-9a-f]{3}:/i.test(ip) && !/^2001:(?:db8|0):/i.test(ip);
  }
  const octets = ip.split(".").map(Number);
  if (
    octets.length !== 4 ||
    octets.some((n) => !Number.isInteger(n) || n < 0 || n > 255)
  ) return false;
  const [a, b] = octets;
  return !(a === 0 || a === 10 || a === 127 || a >= 224 ||
    a === 169 && b === 254 || a === 172 && b >= 16 && b <= 31 ||
    a === 192 && [0, 168].includes(b) || a === 100 && b >= 64 && b <= 127 ||
    a === 198 && [18, 19].includes(b));
}
export async function within<T>(
  work: Promise<T>,
  ms: number,
  fallback: T,
  abort?: () => void,
  signal?: AbortSignal,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let onAbort: (() => void) | undefined;
  try {
    return await Promise.race([
      work.catch(() => fallback),
      new Promise<T>((resolve) => {
        onAbort = () => resolve(fallback);
        if (signal?.aborted) {
          resolve(fallback);
          return;
        }
        signal?.addEventListener("abort", onAbort, { once: true });
        timer = setTimeout(() => {
          abort?.();
          resolve(fallback);
        }, ms);
      }),
    ]);
  } finally {
    clearTimeout(timer);
    if (onAbort) signal?.removeEventListener("abort", onAbort);
  }
}
export async function readCapped(
  response: Response,
  cap = MAX_BYTES,
): Promise<string> {
  if (Number(response.headers.get("content-length")) > cap) {
    await response.body?.cancel();
    throw new Error("Source too large");
  }
  const reader = response.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > cap) throw new Error("Source too large");
      chunks.push(value);
    }
  } catch (error) {
    await reader.cancel().catch(() => {});
    throw error;
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}
/** Provider adapter retains small response bounds; source fetching has its own caps. */
export function runtime(
  deps: Dependencies,
  signal?: AbortSignal,
  redirectDomain?: string,
): EnrichRuntime {
  return {
    cacheKey: deps.fetch,
    retry: false,
    env: deps.env,
    logger: { info() {}, warn() {}, error() {} },
    async request(value, init = {}, timeoutMs = 6000) {
      const url = publicUrl(value);
      const cap = url.hostname === "www.sec.gov" &&
          url.pathname === "/files/company_tickers.json"
        ? 8_000_000
        : MAX_BYTES;
      const identityPage = !!redirectDomain &&
        (url.hostname === redirectDomain ||
          url.hostname.endsWith(`.${redirectDomain}`));
      const result = await fetchResource(deps, value, {
        init,
        timeoutMs,
        signal,
        redirectDomain,
        cap: identityPage ? 512 * 1024 : cap,
        prefix: identityPage,
      });
      if (result.status >= 200 && result.status < 300) {
        result.outcome.reason = "provider-or-identity-response";
      }
      const response = new Response(
        result.bytes.length ? new Uint8Array(result.bytes) : null,
        {
          status: result.status,
          headers: result.headers,
        },
      );
      Object.defineProperty(response, "url", { value: result.url });
      return response;
    },
  };
}
export function stripHtml(html: string): string {
  return normalise(
    html.replace(/<(script|style|noscript|svg)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ").replace(/<[^>]+>/g, " ")
      .replace(/&#(x[\da-f]+|\d+);/gi, (_, code) => {
        const n = code[0].toLowerCase() === "x"
          ? parseInt(code.slice(1), 16)
          : Number(code);
        return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : " ";
      })
      .replace(
        /&(amp|lt|gt|quot|apos|nbsp);/gi,
        (_, name: string) =>
          ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " })[
            name.toLowerCase()
          ]!,
      ),
  );
}
export function publishedDate(html: string): string | null {
  // Only an explicit publication tag. Search-provider and model dates are not source dates.
  for (const tag of html.match(/<meta\b[^>]+>/gi) ?? []) {
    if (
      !/(?:property|name)\s*=\s*["'](?:article:published_time|datePublished|pubdate)["']/i
        .test(tag)
    ) continue;
    const value = tag.match(/content\s*=\s*["']([^"']+)["']/i)?.[1];
    if (
      value && /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value) &&
      Number.isFinite(Date.parse(value))
    ) return value;
  }
  return null;
}

/** Include site metadata as well as visible text in the identity probe. */
export function websiteIdentityText(html: string): string {
  const names = (html.match(/<meta\b[^>]+>/gi) ?? []).flatMap((tag) => {
    if (!/(?:property|name)\s*=\s*["']og:site_name["']/i.test(tag)) return [];
    return [tag.match(/content\s*=\s*["']([^"']+)["']/i)?.[1] ?? ""];
  });
  return normalise([...names.map(stripHtml), stripHtml(html)].join(" "));
}
