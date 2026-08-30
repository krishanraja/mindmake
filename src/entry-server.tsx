import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { renderToString } from "react-dom/server";
import { Route, Routes } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CookieConsent } from "@/components/CookieConsent";
import { PageLoading, ScrollToLocation } from "@/App";

/* Eagerly, and this is the whole reason this file exists rather than reusing
   App.tsx directly. `App` loads every page but the homepage through
   `React.lazy`, and `renderToString` cannot render a boundary that suspends: it
   throws rather than waiting. The client keeps `lazy` and `BrowserRouter`
   exactly as they are, so nothing about the shipped bundle changes shape. */
import Index from "./pages/Index";
import AiBrain from "./pages/AiBrain";
import AiGtm from "./pages/AiGtm";
import CaseStudies from "./pages/CaseStudies";
import NewAgeLeadership from "./pages/NewAgeLeadership";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Questions from "./pages/Library";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Alumni from "./pages/Alumni";

/**
 * The pages, rendered to HTML at build time.
 *
 * The site used to ship a hand-written shell: every heading and paragraph as
 * plain markup, styled to look like the first screen it was about to become. It
 * did its job, and it was a likeness. Three separate bugs came from it being a
 * likeness rather than the thing, the last of which was a strip below the hero
 * where the real page starts its next section on a raised ground and the shell
 * had plain ink, measured as the page settling a second after it painted.
 *
 * This renders the components instead, so first paint is the page. What the
 * shell was for is unchanged and better served: a crawler that runs nothing
 * still gets every word, and now in the real layout.
 *
 * The head is not rendered here. `src/components/SEO.tsx` writes title, meta,
 * canonical and JSON-LD in an effect, so it produces nothing server-side, and
 * `scripts/prerender.mjs` already writes all of it into the template. This
 * replaces the body only, which is why no head extraction is needed.
 */

/* Routes rather than a component per path, because `/blog/:slug` reads
   `useParams`, and a page rendered outside a matching Route gets an empty
   params object and renders the wrong post. The set matches the paths
   `scripts/prerender.mjs` emits; `src/test/ssg-routes.test.ts` holds the two
   together, in the same shape as the existing prerender-and-sitemap check. */
function SiteRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/ai-brain" element={<AiBrain />} />
      <Route path="/ai-gtm" element={<AiGtm />} />
      <Route path="/case-studies" element={<CaseStudies />} />
      <Route path="/new-age-leadership" element={<NewAgeLeadership />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/faq" element={<Questions />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/alumni" element={<Alumni />} />
    </Routes>
  );
}

/**
 * One route's markup, or an empty string if this build does not cover it.
 *
 * An empty string is a real answer rather than a failure: the caller leaves
 * `#root` empty and the page loads exactly as a single-page app, which is what
 * every un-prerendered route already does.
 *
 * A fresh QueryClient per render, so no cache leaks from one page into the
 * next during a build that renders twenty-one of them in a row.
 */
export function render(path: string): string {
  return renderToString(
    <QueryClientProvider client={new QueryClient()}>
      <StaticRouter location={path}>
        {/* Every wrapper `App` has, in `App`'s order, and this is the part that
            has to stay in step rather than merely look similar. React writes a
            pair of comment nodes around a Suspense boundary and looks for them
            again at hydration; the first version of this file had no
            `<Suspense>`, so the client's tree opened with a marker the server
            had never written and every prerendered page failed to hydrate on
            its first node, switching the whole root to client rendering. That
            is the glitch this work exists to remove, and it was invisible
            because React's production errors are numbered rather than named.

            `src/test/ssg-hydration.test.ts` renders both sides and compares
            them, so a wrapper added to one and not the other fails a test
            rather than a page. */}
        <ScrollToLocation />
        <ErrorBoundary>
          <Suspense fallback={<PageLoading />}>
            <SiteRoutes />
          </Suspense>
        </ErrorBoundary>
        <CookieConsent />
      </StaticRouter>
    </QueryClientProvider>,
  );
}
