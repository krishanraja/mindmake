import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { lazy, Suspense, useEffect } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CookieConsent } from "@/components/CookieConsent";
import { BOOKING_URL, MINDMAKER_LIVE_URL } from "@/lib/publicLinks";
import Index from "./pages/Index";

const Sprint = lazy(() => import("./pages/Sprint"));
const Operator = lazy(() => import("./pages/Operator"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const NewAgeLeadership = lazy(() => import("./pages/NewAgeLeadership"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Library = lazy(() => import("./pages/Library"));
const Alumni = lazy(() => import("./pages/Alumni"));

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
function ExternalRedirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return <div className="min-h-screen bg-background" aria-live="polite">Opening the next page…</div>;
}

const ToSprint = () => <Navigate to="/sprint" replace />;

function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ErrorBoundary>
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sprint" element={<Sprint />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/operator" element={<Operator />} />

            <Route path="/start" element={<ExternalRedirect to={BOOKING_URL} />} />
            <Route path="/decision" element={<ExternalRedirect to={BOOKING_URL} />} />
            <Route path="/signal" element={<ExternalRedirect to={MINDMAKER_LIVE_URL} />} />
            <Route path="/builder-economy" element={<ExternalRedirect to={MINDMAKER_LIVE_URL} />} />

            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/library" element={<Library />} />
            <Route path="/new-age-leadership" element={<NewAgeLeadership />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/alumni" element={<Alumni />} />

            <Route path="/teardown" element={<ToSprint />} />
            <Route path="/handover" element={<ToSprint />} />
            <Route path="/capital" element={<ToSprint />} />
            <Route path="/tool" element={<ToSprint />} />
            <Route path="/faq" element={<Navigate to="/library?tab=questions" replace />} />

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
            ].map((path) => <Route key={path} path={path} element={<ToSprint />} />)}
            <Route path="/workshops/:slug" element={<ToSprint />} />

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
