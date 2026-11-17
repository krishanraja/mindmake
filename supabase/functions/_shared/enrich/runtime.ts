import { fetchWithTimeout } from "../timeout.ts";
import { createLogger, type Logger } from "../logger.ts";

/** Optional per-call dependencies. Existing callers keep their original transport. */
export interface EnrichRuntime {
  cacheKey?: object;
  request(
    url: string,
    init?: RequestInit,
    timeoutMs?: number,
  ): Promise<Response>;
  retry?: boolean;
  env(name: string): string | undefined;
  logger: Pick<Logger, "info" | "warn" | "error">;
}
export const defaultEnrichRuntime = (name: string): EnrichRuntime => ({
  request: fetchWithTimeout,
  env: (key) => Deno.env.get(key),
  logger: createLogger(name),
});
