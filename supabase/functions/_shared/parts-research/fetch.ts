// Exact version already present in package-lock.json.
// deno-lint-ignore no-import-prefix
import { getDomain } from "npm:tldts@7.0.27";
import { publicIp, publicUrl, within } from "./transport.ts";
import {
  type Dependencies,
  type FetchOutcome,
  MAX_BYTES,
  MAX_PDF_BYTES,
} from "./types.ts";

export const RESEARCH_AGENT =
  "Mozilla/5.0 (compatible; MindmakeResearch/1.0; +https://mindmake.co/parts)";
export const isSec = (hostname: string) =>
  hostname === "sec.gov" || hostname.endsWith(".sec.gov");
export function receiptUrl(value: string): string {
  const url = new URL(value);
  for (const key of [...url.searchParams.keys()]) {
    if (/key|token|secret|signature|credential|authorization/i.test(key)) {
      url.searchParams.set(key, "REDACTED");
    }
  }
  return url.href;
}
export function requestHeaders(
  hostname: string,
  deps: Dependencies,
  original?: HeadersInit,
): Headers {
  const headers = new Headers(original);
  headers.set(
    "Accept",
    "text/html,application/pdf,application/json;q=0.9,text/plain;q=0.8,*/*;q=0.5",
  );
  if (isSec(hostname)) {
    const contact = deps.env("SEC_CONTACT_EMAIL");
    if (!contact || !/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(contact)) {
      throw new Error("sec-contact-unavailable");
    }
    headers.set("User-Agent", `Mindmake parts research <${contact}>`);
  } else headers.set("User-Agent", RESEARCH_AGENT);
  return headers;
}
type Options = {
  init?: RequestInit;
  timeoutMs?: number;
  signal?: AbortSignal;
  redirectDomain?: string;
  coverageRedirects?: boolean;
  cap?: number;
  prefix?: boolean;
  scan?: (text: string) => boolean;
  mayFetch?: (url: string) => Promise<boolean>;
};
export type Resource = {
  url: string;
  status: number;
  headers: Headers;
  bytes: Uint8Array;
  matched: boolean;
  outcome: FetchOutcome;
};

/** Each actual hop has an outcome. Binding scans retain only a short overlap, never the document. */
export async function fetchResource(
  deps: Dependencies,
  value: string,
  options: Options = {},
): Promise<Resource> {
  if (deps.deadline !== undefined && performance.now() >= deps.deadline) {
    deps.fetchOutcomes?.push({
      url: receiptUrl(value),
      status: null,
      bytes: 0,
      kept: false,
      reason: "build-budget-exhausted",
    });
    throw new Error("Build budget exhausted");
  }
  const controller = new AbortController();
  const signal = options.signal
    ? AbortSignal.any([options.signal, controller.signal])
    : controller.signal;
  let current: FetchOutcome | undefined;
  const job = (async () => {
    let url = publicUrl(value);
    const originDomain = getDomain(url.hostname, { allowPrivateDomains: true });
    const allowed = (host: string) =>
      options.coverageRedirects
        ? !!originDomain &&
          getDomain(host, { allowPrivateDomains: true }) === originDomain
        : !!options.redirectDomain &&
          (host === options.redirectDomain ||
            host.endsWith(`.${options.redirectDomain}`));
    for (let hops = 0;; hops++) {
      const outcome: FetchOutcome = {
        url: receiptUrl(url.href),
        status: null,
        bytes: 0,
        kept: false,
        reason: "pending",
      };
      current = outcome;
      deps.fetchOutcomes?.push(outcome);
      if (options.mayFetch && !await options.mayFetch(url.href)) {
        outcome.reason = "robots-disallowed-or-unavailable";
        throw new Error("robots-disallowed-or-unavailable");
      }
      const ips = await deps.resolveHost(url.hostname);
      if (signal.aborted) throw new Error("timeout");
      if (!ips.length || ips.some((ip) => !publicIp(ip))) {
        throw new Error("non-public-address");
      }
      const headers = requestHeaders(url.hostname, deps, options.init?.headers);
      const response = await deps.fetch(url.href, {
        ...options.init,
        headers,
        redirect: "manual",
        signal,
      });
      outcome.status = response.status;
      if (response.status >= 300 && response.status < 400) {
        await response.body?.cancel();
        const location = response.headers.get("location");
        if (
          hops >= 3 || !location || !allowed(url.hostname) ||
          ["authorization", "cookie", "x-api-key"].some((key) =>
            headers.has(key)
          )
        ) throw new Error("redirect-refused");
        const target = publicUrl(new URL(location, url).href);
        if (!allowed(target.hostname)) throw new Error("redirect-refused");
        outcome.reason = "redirect-followed";
        url = target;
        continue;
      }
      const isPdf =
        /application\/pdf/i.test(response.headers.get("content-type") ?? "") ||
        /\.pdf$/i.test(url.pathname);
      const cap = options.scan
        ? options.cap ?? MAX_BYTES
        : isPdf
        ? MAX_PDF_BYTES
        : options.cap ?? MAX_BYTES;
      if (
        !options.scan && !options.prefix &&
        Number(response.headers.get("content-length")) > cap
      ) {
        await response.body?.cancel();
        throw new Error("byte-cap");
      }
      const reader = response.body?.getReader();
      const chunks: Uint8Array[] = [];
      const decoder = new TextDecoder();
      let overlap = "", matched = false, limited = false;
      try {
        while (reader) {
          const next = await reader.read();
          if (next.done) break;
          if (signal.aborted) throw new Error("timeout");
          const remaining = cap - outcome.bytes;
          outcome.bytes += next.value.length;
          if (options.scan) {
            const text = overlap +
              decoder.decode(next.value.subarray(0, Math.max(0, remaining)), {
                stream: true,
              });
            matched = options.scan(text);
            overlap = text.slice(-1024);
            limited = outcome.bytes >= cap;
            if (matched || limited) {
              await reader.cancel();
              break;
            }
          } else {
            if (options.prefix && outcome.bytes >= cap) {
              chunks.push(next.value.subarray(0, Math.max(0, remaining)));
              outcome.bytes = cap;
              await reader.cancel();
              break;
            }
            if (outcome.bytes > cap) throw new Error("byte-cap");
            chunks.push(next.value);
          }
        }
      } catch (error) {
        await reader?.cancel().catch(() => {});
        throw error;
      } finally {
        reader?.releaseLock();
      }
      const bytes = new Uint8Array(options.scan ? 0 : outcome.bytes);
      let offset = 0;
      for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.length;
      }
      outcome.reason = !response.ok
        ? response.status === 426
          ? "provider-unavailable"
          : `http-${response.status}`
        : options.scan
        ? matched
          ? "binding-domain-found"
          : limited
          ? "binding-scan-cap"
          : "binding-domain-absent"
        : "fetched-for-processing";
      return {
        url: url.href,
        status: response.status,
        headers: response.headers,
        bytes,
        matched: response.ok && matched,
        outcome,
      };
    }
  })().catch((error) => {
    if (current && current.reason === "pending") {
      const reason = error instanceof Error ? error.message : "fetch-failed";
      current.reason = [
          "timeout",
          "non-public-address",
          "sec-contact-unavailable",
          "redirect-refused",
          "byte-cap",
        ].includes(reason)
        ? reason
        : "fetch-failed";
    }
    return null;
  });
  const result = await within(
    job,
    Math.min(
      options.timeoutMs ?? 10000,
      Math.max(0, (deps.deadline ?? Infinity) - performance.now()),
    ),
    null,
    () => controller.abort(),
    signal,
  );
  if (!result) {
    if (current?.reason === "pending") current.reason = "timeout";
    throw new Error("Source unavailable");
  }
  return result;
}
