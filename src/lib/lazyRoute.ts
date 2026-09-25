import { lazy, type ComponentType } from "react";

/**
 * `React.lazy` for a route, surviving one dropped request.
 *
 * A route's chunk pulls in shared chunks of its own. If any one of those
 * requests fails, the dynamic import rejects and the error boundary replaces
 * a page the prerender had already drawn correctly with "Something went
 * wrong". It happened on /ai-brain when a single shared chunk was dropped on a
 * flaky connection, while every asset was serving 200.
 *
 * So: try again once after a short pause, which recovers in place where the
 * browser refetches a failed module. Chromium does not: it remembers the
 * failed import for the life of the document, so there the retry fails at
 * once and the recovery is the next step. Reload the page once, which fetches
 * the whole graph afresh; a key in sessionStorage keeps that to one reload per
 * path so a real outage still reaches the boundary instead of looping. A
 * successful load clears the key.
 *
 * Measured on the built /ai-brain with the shared chunk aborted: one dropped
 * request now renders the page after a single reload, where it showed the
 * error page before; a chunk that fails every time reloads once and then
 * reaches the boundary.
 */
export const ROUTE_RELOAD_KEY = "mm-route-reload";
const RETRY_DELAY_MS = 400;

export function lazyRoute<T extends ComponentType<any>>( // eslint-disable-line @typescript-eslint/no-explicit-any
  importer: () => Promise<{ default: T }>,
  { retryDelayMs = RETRY_DELAY_MS }: { retryDelayMs?: number } = {},
) {
  return lazy(async () => {
    try {
      return await loaded(importer);
    } catch (first) {
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      try {
        return await loaded(importer);
      } catch {
        if (reloadOnce()) return new Promise<never>(() => {});
        throw first;
      }
    }
  });
}

async function loaded<T>(importer: () => Promise<T>) {
  const module = await importer();
  forget();
  return module;
}

function reloadOnce() {
  if (typeof window === "undefined") return false;
  try {
    const path = window.location.pathname;
    if (window.sessionStorage.getItem(ROUTE_RELOAD_KEY) === path) return false;
    window.sessionStorage.setItem(ROUTE_RELOAD_KEY, path);
  } catch {
    return false;
  }
  window.location.reload();
  return true;
}

function forget() {
  try {
    if (typeof window !== "undefined") window.sessionStorage.removeItem(ROUTE_RELOAD_KEY);
  } catch {
    /* Storage can be unavailable; the reload guard then simply never arms. */
  }
}
