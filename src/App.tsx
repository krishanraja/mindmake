import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import { lazy, Suspense, useEffect, useRef } from "react";
import { RouteTransitions } from "@/components/RouteTransitions";
import { LineBreaks } from "@/components/LineBreaks";
import { preloadable } from "@/lib/preloadable";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CookieConsent } from "@/components/CookieConsent";
import { PUBLICATION_URL } from "@/lib/publicLinks";
import Index from "./pages/Index";
import { BrandMarks } from "@/components/mindmake/MindmakeBrand";

const CaseStudies = preloadable(() => import("./pages/CaseStudies"));
const NewAgeLeadership = preloadable(() => import("./pages/NewAgeLeadership"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Privacy = preloadable(() => import("./pages/Privacy"));
const Terms = preloadable(() => import("./pages/Terms"));
const Contact = preloadable(() => import("./pages/Contact"));
const Blog = preloadable(() => import("./pages/Blog"));
const BlogPost = preloadable(() => import("./pages/BlogPost"));
const Questions = preloadable(() => import("./pages/Library"));
const Answers = preloadable(() => import("./pages/Answers"));
const AnswerPage = preloadable(() => import("./pages/Answer"));
const Alumni = preloadable(() => import("./pages/Alumni"));
const AiBrain = preloadable(() => import("./pages/AiBrainLocked"));
const AiGtm = preloadable(() => import("./pages/AiGtm"));

const queryClient = new QueryClient();

/* Which page's code a path needs, so a route change can fetch it before the
   swap (src/components/RouteTransitions.tsx). A path not listed here renders
   something already loaded, or a redirect. */
const PAGE_CODE: ReadonlyArray<[RegExp, { preload: () => Promise<unknown> }]> = [
  [/^\/ai-brain\/?$/, AiBrain],
  [/^\/ai-gtm\/?$/, AiGtm],
  [/^\/case-studies\/?$/, CaseStudies],
  [/^\/blog\/?$/, Blog],
  [/^\/blog\/[^/]+\/?$/, BlogPost],
  [/^\/answers\/?$/, Answers],
  [/^\/answers\/[^/]+\/?$/, AnswerPage],
  [/^\/faq\/?$/, Questions],
  [/^\/new-age-leadership\/?$/, NewAgeLeadership],
  [/^\/contact\/?$/, Contact],
  [/^\/privacy\/?$/, Privacy],
  [/^\/terms\/?$/, Terms],
  [/^\/alumni\/?$/, Alumni],
];
const preloadPage = (pathname: string) => PAGE_CODE.find(([pattern]) => pattern.test(pathname))?.[1].preload();

/* Where each history entry was left, so Back returns to it rather than to the
   top. Keyed by the router's entry key and checked against the path, because a
   fresh document's first entry is always "default". Session storage, so it
   survives the reload a browser may do on Back from another site. */
const SCROLL_KEY = "mm-scroll";
const readScroll = (): Record<string, { path: string; y: number }> => {
  try { return JSON.parse(window.sessionStorage.getItem(SCROLL_KEY) ?? "{}"); } catch { return {}; }
};
const writeScroll = (key: string, path: string, y: number) => {
  try {
    const saved = readScroll();
    saved[key] = { path, y };
    const keys = Object.keys(saved);
    for (const old of keys.slice(0, Math.max(0, keys.length - 50))) delete saved[old];
    window.sessionStorage.setItem(SCROLL_KEY, JSON.stringify(saved));
  } catch {
    // Storage can be full or blocked; Back then returns to the top, as before.
  }
};

export function ScrollToLocation() {
  const { hash, pathname, key } = useLocation();
  const navigationType = useNavigationType();

  /* Remember where this entry is scrolled to, for Back. */
  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    let frame = 0;
    const record = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        /* The history entry has already moved on when the next page resets
           the scroll, and that reset must not be recorded as where this page
           was left. */
        if (window.location.pathname.replace(/\/+$/, "") !== pathname.replace(/\/+$/, "")) return;
        writeScroll(key, pathname, window.scrollY);
      });
    };
    window.addEventListener("scroll", record, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", record);
    };
  }, [key, pathname]);

  /* The title focus announces a route change to a screen reader that has just
     been moved somewhere new inside one document. A cold load is not a route
     change: the visitor arrived at this page and the browser has already
     announced it. Focusing the heading there bought nothing and cost a
     :focus-visible ring drawn around the whole headline on every cold load,
     because a programmatic focus with no prior pointer input counts as
     keyboard focus.

     Keyed to the path rather than to a mount flag, because StrictMode mounts
     every effect twice in development: a flag would have called the second
     mount a navigation and drawn the ring in exactly the place a reviewer
     looks for it. Two runs on the same path are the same page either way. */
  const shownPath = useRef<string | null>(null);
  useEffect(() => {
    const changedRoute = shownPath.current !== null && shownPath.current !== pathname;
    shownPath.current = pathname;
    if (!hash) {
      /* Back and Forward return to where the reader left the page. The page
         may still be growing (a lazy chunk, images), so the position is
         retried for a short while rather than clamped to a short document. */
      const saved = navigationType === "POP" ? readScroll()[key] : undefined;
      let restoreFrame = 0;
      if (saved && saved.path === pathname && saved.y > 0) {
        let tries = 0;
        const restore = () => {
          window.scrollTo(0, saved.y);
          tries += 1;
          if (Math.abs(window.scrollY - saved.y) > 2 && tries < 60) restoreFrame = window.requestAnimationFrame(restore);
        };
        restore();
      } else {
        window.scrollTo(0, 0);
      }
      if (!changedRoute) return () => window.cancelAnimationFrame(restoreFrame);

      let frame = 0;
      let attempts = 0;
      const focusPageTitle = () => {
        // Do not steal focus from a visitor who has already opened the menu or
        // moved to another control while a lazy route is still mounting.
        if (document.activeElement && document.activeElement !== document.body) return;
        const title = document.querySelector<HTMLElement>("#main h1, main h1");
        if (title) {
          title.tabIndex = -1;
          title.focus({ preventScroll: true });
          return;
        }

        attempts += 1;
        if (attempts < 10) frame = window.requestAnimationFrame(focusPageTitle);
      };

      frame = window.requestAnimationFrame(focusPageTitle);
      return () => {
        window.cancelAnimationFrame(frame);
        window.cancelAnimationFrame(restoreFrame);
      };
    }

    let frame = 0;
    let attempts = 0;
    const findTarget = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        const headerBottom = document.querySelector<HTMLElement>(".mm-header")
          ?.getBoundingClientRect().bottom ?? 0;
        const declaredMargin = Number.parseFloat(window.getComputedStyle(target).scrollMarginTop);
        const usableMargin = Number.isFinite(declaredMargin) && declaredMargin > 0
          ? declaredMargin
          : headerBottom + 16;
        const targetTop = window.scrollY + target.getBoundingClientRect().top;
        window.scrollTo({ top: Math.max(0, targetTop - usableMargin), behavior: "auto" });
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
        return;
      }

      attempts += 1;
      // Lazy route chunks can take longer than ten frames to mount on slower
      // engines and devices. Keep the hash contract alive for four seconds so
      // the target is positioned once it actually exists.
      if (attempts < 240) frame = window.requestAnimationFrame(findTarget);
    };

    frame = window.requestAnimationFrame(findTarget);
    return () => window.cancelAnimationFrame(frame);
    // Keyed on the path and hash only: opening the brief adds a history entry
    // on the same page, and that must never move the reader. The entry key and
    // navigation type are read as of this render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash, pathname]);
  return null;
}

export function PageLoading() {
  return (
    <div className="mm-site mm-page-loading" role="status" aria-live="polite">
      {/* Not MindmakeBrand: this is the Suspense fallback and must not be a
          link to the page it is currently loading. */}
      <span className="mm-brand">
        <BrandMarks instance="loading" />
      </span>
      <p><span aria-hidden="true" /> Loading the page.</p>
    </div>
  );
}
function ExternalRedirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return <div className="min-h-screen bg-background" aria-live="polite">Opening the next page...</div>;
}

const ToStart = () => <Navigate to="/?start=1" replace />;

function AppRoutes() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToLocation />
      <RouteTransitions preload={preloadPage} />
      <LineBreaks />
      <ErrorBoundary>
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ai-brain" element={<AiBrain />} />
            <Route path="/ai-gtm" element={<AiGtm />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/operator" element={<Navigate to="/ai-brain" replace />} />

            <Route path="/start" element={<ToStart />} />
            <Route path="/decision" element={<ToStart />} />
            <Route path="/signal" element={<ExternalRedirect to={PUBLICATION_URL} />} />
            <Route path="/builder-economy" element={<ExternalRedirect to={PUBLICATION_URL} />} />

            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/10-20x-roi-what-real-ai-implementation-looks-like" element={<Navigate to="/blog/measuring-ai-work-that-pays-back" replace />} />
            <Route path="/blog/building-ai-systems-in-30-days-sprint-approach" element={<Navigate to="/blog/a-useful-first-30-days-building-with-ai" replace />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/library" element={<Navigate to="/blog" replace />} />

            {/* The answer surface, and it is not the blog. `/blog` is the
                curated editorial archive; these are one page per buyer
                question, written to be fetched and quoted. They share the
                design system and no data, so neither can drift into the
                other. */}
            <Route path="/answers" element={<Answers />} />
            <Route path="/answers/:slug" element={<AnswerPage />} />
            <Route path="/new-age-leadership" element={<NewAgeLeadership />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/alumni" element={<Alumni />} />

            <Route path="/sprint" element={<ToStart />} />
            <Route path="/teardown" element={<ToStart />} />
            <Route path="/handover" element={<ToStart />} />
            <Route path="/capital" element={<ToStart />} />
            <Route path="/tool" element={<Navigate to="/ai-brain" replace />} />
            <Route path="/faq" element={<Questions />} />

            {[
              "/workshops",
              "/enterprise",
              "/immersion",
              "/cohort",
              "/leaders",
              "/leadership-insights",
              "/sprints",
              "/sprint/4-week",
              "/sprint/90-day",
              "/builder-sprint",
              "/war-room",
              "/strategy-day",
              "/fractional-caio",
              "/individual",
              "/team",
              "/builder",
              "/builder-session",
              "/leadership-lab",
              "/portfolio-program",
            ].map((path) => <Route key={path} path={path} element={<ToStart />} />)}
            <Route path="/workshops/:slug" element={<ToStart />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <CookieConsent />
    </BrowserRouter>
  );
}

/**
 * No theme provider, and this is load-bearing rather than a tidy-up.
 *
 * next-themes wrapped this app from the Lovable scaffold onwards, set
 * `class="light"` or `class="dark"` on the document, and was read by nothing:
 * no component calls `useTheme`, and all three of this site's stylesheets use
 * zero shadcn tokens. Measured with it still in place, the lead dialog rendered
 * byte-identical under both schemes and the homepage differed only in the
 * sub-threshold tint Chromium gives one photograph under `color-scheme: dark`.
 *
 * What it cost was the whole server render. The provider inlines a `<script>`
 * through `dangerouslySetInnerHTML`, the client bundle and the SSR bundle
 * minify that script's source differently, and React compares the text: every
 * prerendered page failed hydration on its first node and switched the entire
 * root to client rendering. That is precisely the glitch this work exists to
 * remove, and it was invisible because React's production errors are numbered
 * rather than described.
 *
 * `src/test/ssg-hydration.test.ts` holds the two entries to one provider set,
 * and `scripts/qa/first-second-check.mjs` fails the build on a hydration error
 * in a real browser.
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  );
}
