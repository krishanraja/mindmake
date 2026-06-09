import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
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
import { ScopingModal } from "@/components/ScopingModal";
import PreCallQualifier from "@/components/PreCallQualifier";

// Homepage loaded eagerly (critical path)
import Index from "./pages/Index";

// All other pages lazy-loaded for smaller initial bundle
// Immersive overlay: lazy + client-only so SSG prerender never touches it.
const DiagnosisRoom = lazy(() =>
  import("@/components/diagnosis").then((m) => ({ default: m.DiagnosisRoom })),
);

const Cohort = lazy(() => import("./pages/Cohort"));
const Enterprise = lazy(() => import("./pages/Enterprise"));
const Capital = lazy(() => import("./pages/Capital"));
const Immersion = lazy(() => import("./pages/Immersion"));
const NewAgeLeadership = lazy(() => import("./pages/NewAgeLeadership"));
const Operator = lazy(() => import("./pages/Operator"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const Brief = lazy(() => import("./pages/Brief"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Contact = lazy(() => import("./pages/Contact"));
const LeadershipInsights = lazy(() => import("./pages/LeadershipInsights"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Library = lazy(() => import("./pages/Library"));
const Workshops = lazy(() => import("./pages/Workshops"));
const Alumni = lazy(() => import("./pages/Alumni"));
const WorkshopChiefOfStaff = lazy(() => import("./pages/workshops/BuildYourAIChiefOfStaff"));
const WorkshopOrgChart = lazy(() => import("./pages/workshops/MapYourAgenticOrgChart"));
const WorkshopVibeCoding = lazy(() => import("./pages/workshops/VibeCodingForLeaders"));
const WorkshopAutonomous = lazy(() => import("./pages/workshops/BuildAnAutonomousBusinessFunction"));
const WorkshopMemory = lazy(() => import("./pages/workshops/GiveYourAIMemory"));

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

// The Diagnosis Room as a full page at /start. Same immersive overlay, but
// "closing" it returns the visitor to the homepage instead of unmounting it.
const DiagnosisRoomPage = () => {
  const navigate = useNavigate();
  return (
    <Suspense fallback={<div className="min-h-screen bg-ink" />}>
      <DiagnosisRoom
        open
        onOpenChange={(o) => {
          if (!o) navigate("/");
        }}
        sourcePage="/start"
      />
    </Suspense>
  );
};

const AppRoutes = () => {
  const [globalConsultModalOpen, setGlobalConsultModalOpen] = useState(false);
  const [scopingModalOpen, setScopingModalOpen] = useState(false);
  const [scopingSourcePage, setScopingSourcePage] = useState<string>("/");
  const [diagnosisRoomOpen, setDiagnosisRoomOpen] = useState(false);
  const [diagnosisSourcePage, setDiagnosisSourcePage] = useState<string>("/");
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

    const handleOpenScopingModal = (e: Event) => {
      const detail = (e as CustomEvent).detail as
        | { source_page?: string }
        | undefined;
      setScopingSourcePage(detail?.source_page || window.location.pathname || "/");
      setScopingModalOpen(true);
    };

    const handleOpenDiagnosisRoom = (e: Event) => {
      const detail = (e as CustomEvent).detail as
        | {
            source_page?: string;
            seedDecision?: string;
            preselectedMode?: string;
          }
        | undefined;
      setDiagnosisSourcePage(
        detail?.source_page || window.location.pathname || "/",
      );
      setDiagnosisRoomOpen(true);
    };

    window.addEventListener("openConsultModal", handleOpenConsultModal);
    window.addEventListener("openScopingModal", handleOpenScopingModal);
    window.addEventListener("openDiagnosisRoom", handleOpenDiagnosisRoom);
    return () => {
      window.removeEventListener("openConsultModal", handleOpenConsultModal);
      window.removeEventListener("openScopingModal", handleOpenScopingModal);
      window.removeEventListener("openDiagnosisRoom", handleOpenDiagnosisRoom);
    };
  }, [setQualificationData]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <ErrorBoundary>
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Routes>
            <Route path="/" element={<Index />} />

            {/* The Diagnosis Room as a full page */}
            <Route path="/start" element={<DiagnosisRoomPage />} />

            {/* Core consolidated pages */}
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/workshops/build-your-ai-chief-of-staff" element={<WorkshopChiefOfStaff />} />
            <Route path="/workshops/map-your-agentic-org-chart" element={<WorkshopOrgChart />} />
            <Route path="/workshops/vibe-coding-for-leaders" element={<WorkshopVibeCoding />} />
            <Route path="/workshops/build-an-autonomous-business-function" element={<WorkshopAutonomous />} />
            <Route path="/workshops/give-your-ai-memory" element={<WorkshopMemory />} />
            <Route path="/cohort" element={<Cohort />} />
            <Route path="/enterprise" element={<Enterprise />} />
            <Route path="/capital" element={<Capital />} />
            <Route path="/operator" element={<Operator />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/signal" element={<Brief />} />
            <Route path="/library" element={<Library />} />

            {/* Alumni Pass: hidden from nav and footer, reachable by direct URL only */}
            <Route path="/alumni" element={<Alumni />} />

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

      {/* Global Consult Modal - legacy, kept mounted while remaining surfaces migrate */}
      <InitialConsultModal
        open={globalConsultModalOpen}
        onOpenChange={setGlobalConsultModalOpen}
        preselectedProgram={sessionData.qualificationData?.preselectedProgram}
        commitmentLevel={sessionData.qualificationData?.commitmentLevel}
        audienceType={sessionData.qualificationData?.audienceType}
        pathType={sessionData.qualificationData?.pathType}
      />

      {/* Scoping modal: tier-appropriate path for Signal Session / Revenue Architecture / Immersion */}
      <ScopingModal
        open={scopingModalOpen}
        onOpenChange={setScopingModalOpen}
        sourcePage={scopingSourcePage}
      />

      {/* The Diagnosis Room: full-screen immersive Mindy experience. Opened via
          the openDiagnosisRoom custom event. Lazy + only mounted when open so
          SSG prerender never instantiates it. */}
      {diagnosisRoomOpen && (
        <Suspense fallback={null}>
          <DiagnosisRoom
            open={diagnosisRoomOpen}
            onOpenChange={setDiagnosisRoomOpen}
            sourcePage={diagnosisSourcePage}
          />
        </Suspense>
      )}

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
