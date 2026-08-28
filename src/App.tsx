import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { lazy, Suspense, useEffect } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CookieConsent } from "@/components/CookieConsent";
import { PUBLICATION_URL } from "@/lib/publicLinks";
import Index from "./pages/Index";

const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const NewAgeLeadership = lazy(() => import("./pages/NewAgeLeadership"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Questions = lazy(() => import("./pages/Library"));
const Alumni = lazy(() => import("./pages/Alumni"));
const AiBrain = lazy(() => import("./pages/AiBrain"));
const AiGtm = lazy(() => import("./pages/AiGtm"));

const queryClient = new QueryClient();

export function ScrollToLocation() {
  const { hash, pathname } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);

      let frame = 0;
      let attempts = 0;
      const focusPageTitle = () => {
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
      return () => window.cancelAnimationFrame(frame);
    }

    let frame = 0;
    let attempts = 0;
    const findTarget = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        const headerBottom = document.querySelector<HTMLElement>(".mm-header")
          ?.getBoundingClientRect().bottom ?? 0;
        const targetTop = window.scrollY + target.getBoundingClientRect().top;
        window.scrollTo({ top: Math.max(0, targetTop - headerBottom - 16), behavior: "auto" });
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
        return;
      }

      attempts += 1;
      if (attempts < 10) frame = window.requestAnimationFrame(findTarget);
    };

    frame = window.requestAnimationFrame(findTarget);
    return () => window.cancelAnimationFrame(frame);
  }, [hash, pathname]);
  return null;
}

export function PageLoading() {
  return (
    <div className="mm-site mm-page-loading" role="status" aria-live="polite">
      <span className="mm-brand">MIND<span>/</span>MAKE</span>
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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AppRoutes />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
