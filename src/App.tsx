import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { SessionDataProvider, useSessionData } from "@/contexts/SessionDataContext";
import { useState, useEffect, lazy, Suspense } from "react";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    // Preserve hash-based scrolling; only reset when no hash present
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CookieConsent } from "@/components/CookieConsent";
import { InitialConsultModal } from "@/components/InitialConsultModal";
import PreCallQualifier from "@/components/PreCallQualifier";

// Homepage loaded eagerly (critical path)
import Index from "./pages/Index";

// All other pages lazy-loaded for smaller initial bundle
const Cohort = lazy(() => import("./pages/Cohort"));
const Enterprise = lazy(() => import("./pages/Enterprise"));
const Capital = lazy(() => import("./pages/Capital"));
const Immersion = lazy(() => import("./pages/Immersion"));
const NewAgeLeadership = lazy(() => import("./pages/NewAgeLeadership"));
const Operator = lazy(() => import("./pages/Operator"));
const Brief = lazy(() => import("./pages/Brief"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Contact = lazy(() => import("./pages/Contact"));
const LeadershipInsights = lazy(() => import("./pages/LeadershipInsights"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Library = lazy(() => import("./pages/Library"));

const queryClient = new QueryClient();

// Hash-aware redirect helper (301-equivalent client-side)
const HashRedirect = ({ to }: { to: string }) => <Navigate to={to} replace />;

// External redirect (for routes that now live on a different domain)
const ExternalRedirect = ({ to }: { to: string }) => {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return null;
};

const AppRoutes = () => {
  const [globalConsultModalOpen, setGlobalConsultModalOpen] = useState(false);
  const { sessionData, setQualificationData } = useSessionData();

  useEffect(() => {
    const handleOpenConsultModal = (e: Event) => {
      const detail = (e as CustomEvent).detail as
        | {
            preselected?: string;
            qualifierAnswers?: { decision: string; tried: string; stakes: string };
          }
        | undefined;
      if (detail?.preselected || detail?.qualifierAnswers) {
        setQualificationData({
          preselectedProgram: detail.preselected,
          qualifierAnswers: detail.qualifierAnswers,
        });
      }
      setGlobalConsultModalOpen(true);
    };

    window.addEventListener("openConsultModal", handleOpenConsultModal);
    return () =>
      window.removeEventListener("openConsultModal", handleOpenConsultModal);
  }, [setQualificationData]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <ErrorBoundary>
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Routes>
            <Route path="/" element={<Index />} />

            {/* Core consolidated pages */}
            <Route path="/cohort" element={<Cohort />} />
            <Route path="/enterprise" element={<Enterprise />} />
            <Route path="/capital" element={<Capital />} />
            <Route path="/operator" element={<Operator />} />
            <Route path="/signal" element={<Brief />} />
            <Route path="/library" element={<Library />} />

            {/* Hidden pages, linked from footer, not nav */}
            <Route path="/immersion" element={<Immersion />} />
            <Route path="/new-age-leadership" element={<NewAgeLeadership />} />

            {/* /tool deleted. Decision machine now lives inside Brief at /signal#decision */}
            <Route path="/tool" element={<Navigate to="/signal#decision" replace />} />

            {/* /builder-economy deleted. Canonical site is thebuildereconomy.com */}
            <Route
              path="/builder-economy"
              element={<ExternalRedirect to="https://www.thebuildereconomy.com" />}
            />

            {/* Preserved pages */}
            <Route path="/leaders" element={<LeadershipInsights />} />
            <Route path="/leadership-insights" element={<LeadershipInsights />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/faq" element={<Navigate to="/library?tab=questions" replace />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* 301 redirects (client-side) for deleted routes */}
            <Route path="/sprints" element={<HashRedirect to="/cohort" />} />
            <Route path="/sprint/4-week" element={<HashRedirect to="/cohort?inquiry=1:1" />} />
            <Route path="/sprint/90-day" element={<HashRedirect to="/cohort?inquiry=1:1" />} />
            <Route path="/builder-sprint" element={<HashRedirect to="/cohort?inquiry=1:1" />} />
            <Route path="/war-room" element={<HashRedirect to="/enterprise#revenue-architecture" />} />
            <Route path="/strategy-day" element={<HashRedirect to="/enterprise#signal-session" />} />
            <Route path="/fractional-caio" element={<HashRedirect to="/enterprise" />} />

            {/* Legacy redirects (preserved) */}
            <Route path="/individual" element={<Navigate to="/" replace />} />
            <Route path="/team" element={<Navigate to="/" replace />} />
            <Route path="/builder" element={<Navigate to="/" replace />} />
            <Route path="/builder-session" element={<Navigate to="/" replace />} />
            <Route path="/leadership-lab" element={<Navigate to="/" replace />} />
            <Route path="/portfolio-program" element={<Navigate to="/" replace />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>

      {/* Global Consult Modal - works on all pages */}
      <InitialConsultModal
        open={globalConsultModalOpen}
        onOpenChange={setGlobalConsultModalOpen}
        preselectedProgram={sessionData.qualificationData?.preselectedProgram}
        commitmentLevel={sessionData.qualificationData?.commitmentLevel}
        audienceType={sessionData.qualificationData?.audienceType}
        pathType={sessionData.qualificationData?.pathType}
      />

      {/* Pre-call qualifier: floating pill + 3-step drawer */}
      <PreCallQualifier />

      <CookieConsent />
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SessionDataProvider>
          <AppRoutes />
        </SessionDataProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
