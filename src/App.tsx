import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { SessionDataProvider, useSessionData } from "@/contexts/SessionDataContext";
import { useState, useEffect, lazy, Suspense } from "react";

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { InitialConsultModal } from "@/components/InitialConsultModal";
import { ActionsHub } from "@/components/ActionsHub";
import { Dialog, DialogWizardContent } from "@/components/ui/dialog";
import { BuilderAssessment } from "@/components/Interactive/BuilderAssessment";
import { FrictionMapBuilder } from "@/components/Interactive/FrictionMapBuilder";
import { TryItWidget } from "@/components/Interactive/AIDecisionHelper";
import { PortfolioBuilder } from "@/components/Interactive/PortfolioBuilder";
import { Mic } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Homepage loaded eagerly (critical path)
import Index from "./pages/Index";

// All other pages lazy-loaded for smaller initial bundle
const BuilderEconomy = lazy(() => import("./pages/BuilderEconomy"));
const Sprint4Week = lazy(() => import("./pages/Sprint4Week"));
const Sprint90Day = lazy(() => import("./pages/Sprint90Day"));
const Sprints = lazy(() => import("./pages/Sprints"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Contact = lazy(() => import("./pages/Contact"));
const LeadershipInsights = lazy(() => import("./pages/LeadershipInsights"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const WarRoom = lazy(() => import("./pages/WarRoom"));
const FractionalCAIO = lazy(() => import("./pages/FractionalCAIO"));
const StrategyDay = lazy(() => import("./pages/StrategyDay"));

const queryClient = new QueryClient();

type DialogType = 'quiz' | 'decision' | 'friction' | 'portfolio' | null;

// Inner component that has access to SessionDataContext
const AppRoutes = () => {
  const [globalConsultModalOpen, setGlobalConsultModalOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const { sessionData } = useSessionData();
  const isMobile = useIsMobile();

  // Listen for custom event from Navigation to open consult modal globally
  useEffect(() => {
    const handleOpenConsultModal = () => {
      setGlobalConsultModalOpen(true);
    };

    window.addEventListener('openConsultModal', handleOpenConsultModal);
    return () => window.removeEventListener('openConsultModal', handleOpenConsultModal);
  }, []);

  const getDialogTitle = () => {
    switch (dialogType) {
      case 'quiz': return 'Builder Profile Quiz';
      case 'decision': return 'AI Decision Helper';
      case 'friction': return 'Friction Map Builder';
      case 'portfolio': return 'Model out your starting points';
      default: return '';
    }
  };

  const renderDialogContent = () => {
    switch (dialogType) {
      case 'quiz':
        return <BuilderAssessment compact={false} onClose={() => setDialogType(null)} />;
      case 'decision':
        return <TryItWidget compact={false} onClose={() => setDialogType(null)} />;
      case 'friction':
        return <FrictionMapBuilder compact={false} onClose={() => setDialogType(null)} />;
      case 'portfolio':
        return <PortfolioBuilder compact={false} onClose={() => setDialogType(null)} />;
      default:
        return null;
    }
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <ErrorBoundary>
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/individual" element={<Navigate to="/" replace />} />
        <Route path="/team" element={<Navigate to="/" replace />} />
        <Route path="/sprints" element={<Sprints />} />
        <Route path="/sprint/4-week" element={<Sprint4Week />} />
        <Route path="/sprint/90-day" element={<Sprint90Day />} />
        <Route path="/builder-sprint" element={<Navigate to="/sprints" replace />} />
        <Route path="/builder-economy" element={<BuilderEconomy />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        {/* Enterprise Offers */}
        <Route path="/war-room" element={<WarRoom />} />
        <Route path="/fractional-caio" element={<FractionalCAIO />} />
        <Route path="/strategy-day" element={<StrategyDay />} />
        {/* Leadership Insights Diagnostic - accessible at /leaders */}
        <Route path="/leaders" element={<LeadershipInsights />} />
        <Route path="/leadership-insights" element={<LeadershipInsights />} />
        {/* Redirects for old URLs */}
        <Route path="/builder-session" element={<Navigate to="/" replace />} />
        <Route path="/leadership-lab" element={<Navigate to="/" replace />} />
        <Route path="/builder" element={<Navigate to="/" replace />} />
        <Route path="/portfolio-program" element={<Navigate to="/" replace />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
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

      {/* Global Actions Hub - Decision Tools available on all pages */}
      <ActionsHub onToolClick={setDialogType} />

      {/* Global Dialog for Decision Tools */}
      <Dialog open={dialogType !== null} onOpenChange={() => setDialogType(null)}>
        <DialogWizardContent className="sm:max-w-2xl sm:max-h-[85vh]" hideCloseButton={isMobile}>
          {!isMobile && (
            <div className="shrink-0 p-6 pb-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{getDialogTitle()}</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Powered by Mindmaker Methodology
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-mint/10 border border-mint/20">
                  <Mic className="w-3 h-3 text-mint" />
                  <span className="text-[10px] font-medium text-mint-dark">LIVE</span>
                </div>
              </div>
            </div>
          )}
          <div className="flex-1 overflow-y-auto">
            {renderDialogContent()}
          </div>
        </DialogWizardContent>
      </Dialog>
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
