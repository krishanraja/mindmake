import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "@/styles/route-transition.css";

/* The server render has no layout phase; this effect only matters in a browser. */
const useCommitEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type ViewTransition = { finished: Promise<void>; skipTransition(): void };
type TransitionDocument = Document & { startViewTransition?: (update: () => Promise<void> | void) => ViewTransition };

/**
 * Page changes: the ruled line.
 *
 * Krish, 2026-09-25: the transitions between pages "feel incredibly glitchy
 * and sudden", and should be "never seen before but very subtle and classy".
 *
 * What was glitchy was three separate things, and this is the fix for each:
 *
 *  - Every link in the homepage's generated markup was a plain anchor, so
 *    leaving the homepage reloaded the whole document. Those clicks now stay in
 *    the app like every other internal link.
 *  - The next page's code was requested at the moment of the click, so an
 *    unvisited page arrived through the loading fallback. It is fetched first
 *    now (and on hover or focus, before the click), and the swap waits for it.
 *  - The old page jumped to the top before the new one painted. The scroll
 *    reset now happens inside the transition, after the old page is captured.
 *
 * What is new is the ruled line. One hairline in the site's mint travels down
 * the screen and the new page is set in behind it, as a composing machine sets
 * a line of type, while the old page settles back into the ground. About half a
 * second and one easing; nothing slides, bounces or scales. The header is the
 * same pixels on both sides, and the line reaches past it in its first frames,
 * so the chrome reads as still.
 *
 * Browsers without view transitions, and readers who prefer reduced motion,
 * get the same prefetched, jump-free navigation with no animation. Back and
 * forward are left to the browser, which on phones has its own gesture, and
 * are handled by ScrollToLocation's scroll restoration.
 *
 * It renders nothing, so the prerendered and hydrated trees are unchanged.
 */
export function RouteTransitions({ preload }: { preload?: (pathname: string) => Promise<unknown> | undefined }) {
  const navigate = useNavigate();
  const location = useLocation();
  const committed = useRef<(() => void) | null>(null);
  const running = useRef<ViewTransition | null>(null);

  /* The new page is in the DOM. Put it at the top before the browser takes
     its picture of the new state, then let the transition run. */
  useCommitEffect(() => {
    const done = committed.current;
    if (!done) return;
    committed.current = null;
    if (!location.hash) window.scrollTo(0, 0);
    done();
  }, [location.key, location.hash]);

  useEffect(() => {
    const internal = (event: Event) => {
      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.hasAttribute("download") || anchor.hasAttribute("data-mm-native")) return null;
      if (anchor.target && anchor.target !== "_self") return null;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return null;
      /* A file, the API, or the homepage's /start, which its adapter turns
         into the brief in place. */
      if (/\.[a-z0-9]+$/i.test(url.pathname) || url.pathname.startsWith("/api/") || url.pathname === "/start") return null;
      return url;
    };
    const samePage = (url: URL) => url.pathname.replace(/\/+$/, "") === window.location.pathname.replace(/\/+$/, "");

    const warm = (event: Event) => {
      const url = internal(event);
      if (url && !samePage(url)) void preload?.(url.pathname)?.catch(() => {});
    };

    const go = async (to: string, pathname: string) => {
      /* Wait for the page's code, but never make a click feel ignored. */
      await Promise.race([
        Promise.resolve(preload?.(pathname)).catch(() => {}),
        new Promise((resolve) => window.setTimeout(resolve, 900)),
      ]);
      const doc = document as TransitionDocument;
      const still = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      if (!doc.startViewTransition || still || doc.visibilityState !== "visible") {
        navigate(to);
        return;
      }
      running.current?.skipTransition();
      const rule = document.createElement("div");
      rule.className = "mm-route-rule";
      rule.setAttribute("aria-hidden", "true");
      const transition = doc.startViewTransition(() => new Promise<void>((resolve) => {
        document.body.append(rule);
        document.documentElement.classList.add("mm-route-changing");
        committed.current = resolve;
        /* A page that still suspends must not hold the screen frozen. */
        window.setTimeout(() => {
          if (committed.current === resolve) committed.current = null;
          resolve();
        }, 1200);
        navigate(to);
      }));
      running.current = transition;
      transition.finished.finally(() => {
        rule.remove();
        document.documentElement.classList.remove("mm-route-changing");
        if (running.current === transition) running.current = null;
      });
    };

    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const url = internal(event);
      if (!url || samePage(url)) return;
      /* Capture phase, so this runs before a router Link's own handler, which
         then sees the event handled and stands down. Nothing is stopped: every
         other listener on the link, analytics and menus included, still runs. */
      event.preventDefault();
      void go(url.pathname + url.search + url.hash, url.pathname);
    };

    document.addEventListener("click", click, true);
    document.addEventListener("pointerover", warm, { passive: true });
    document.addEventListener("focusin", warm);
    return () => {
      document.removeEventListener("click", click, true);
      document.removeEventListener("pointerover", warm);
      document.removeEventListener("focusin", warm);
    };
  }, [navigate, preload]);

  return null;
}
