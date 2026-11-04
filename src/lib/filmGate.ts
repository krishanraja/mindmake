/**
 * Films never compete with the pictures (Krish, 2026-11-04: "Some of the
 * images take up to 10 seconds to load on a user's first visit"). On a slow
 * line a three-megabyte loop started at once took the whole connection for
 * twenty seconds, and the pictures waited behind it.
 *
 * A film may start downloading once the page has loaded (every picture and
 * font the first screen asked for) and the browser has a quiet moment. On a
 * connection that asks to save data, or reports itself as 3G or slower, it
 * never does: the poster stays, which is what the page shows anyway until a
 * film plays.
 */
type Connection = { saveData?: boolean; effectiveType?: string };

let gate: Promise<boolean> | null = null;

const slowLine = () => {
  const connection = (navigator as Navigator & { connection?: Connection }).connection;
  return Boolean(connection?.saveData) || /^(slow-2g|2g|3g)$/.test(connection?.effectiveType ?? "");
};

/** Resolves true once films may load, false when they should not load at all. */
export function filmsMayLoad(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  gate ??= new Promise<boolean>((resolve) => {
    if (slowLine()) { resolve(false); return; }
    const idle = () => {
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
      if (ric) ric(() => resolve(true), { timeout: 1500 });
      else window.setTimeout(() => resolve(true), 300);
    };
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
  });
  return gate;
}

/**
 * Plays a film once films may load. A film marked `preload="none"` has
 * fetched nothing until now; `play()` starts its download.
 */
export function playWhenFilmsMayLoad(video: HTMLVideoElement, stillWanted: () => boolean = () => true): void {
  void filmsMayLoad().then((ok) => {
    if (ok && stillWanted()) video.play().catch(() => {});
  });
}
