import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { SessionDataProvider, useSessionData } from "@/contexts/SessionDataContext";
import { useState, useEffect } from "react";
import { InitialConsultModal } from "@/components/InitialConsultModal";
import Index from "./pages/Index";
import Individual from "./pages/Individual";
import Team from "./pages/Team";
import BuilderSprint from "./pages/BuilderSprint";
import BuilderEconomy from "./pages/BuilderEconomy";
import Sprint4Week from "./pages/Sprint4Week";
import Sprint90Day from "./pages/Sprint90Day";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import LeadershipInsights from "./pages/LeadershipInsights";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

const queryClient = new QueryClient();

// Inner component that has access to SessionDataContext
const AppRoutes = () => {
  const [globalConsultModalOpen, setGlobalConsultModalOpen] = useState(false);
  const { sessionData } = useSessionData();

  // Listen for custom event from Navigation to open consult modal globally
  useEffect(() => {
    const handleOpenConsultModal = () => {
      setGlobalConsultModalOpen(true);
    };

    window.addEventListener('openConsultModal', handleOpenConsultModal);
    return () => window.removeEventListener('openConsultModal', handleOpenConsultModal);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/individual" element={<Individual />} />
        <Route path="/team" element={<Team />} />
        <Route path="/sprint/4-week" element={<Sprint4Week />} />
        <Route path="/sprint/90-day" element={<Sprint90Day />} />
        <Route path="/builder-sprint" element={<Navigate to="/sprint/4-week" replace />} />
        <Route path="/builder-economy" element={<BuilderEconomy />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
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
      
      {/* Global Consult Modal - works on all pages */}
      <InitialConsultModal
        open={globalConsultModalOpen}
        onOpenChange={setGlobalConsultModalOpen}
        preselectedProgram={sessionData.qualificationData?.preselectedProgram}
        commitmentLevel={sessionData.qualificationData?.commitmentLevel}
        audienceType={sessionData.qualificationData?.audienceType}
        pathType={sessionData.qualificationData?.pathType}
      />
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
