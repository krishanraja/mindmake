import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import NewHero from "@/components/NewHero";
import AINewsTicker from "@/components/AINewsTicker";
import BigProblem from "@/components/BigProblem";
import FrameworkJourney from "@/components/FrameworkJourney";
import TheProblem from "@/components/TheProblem";
import TrustSection from "@/components/TrustSection";
import SimpleCTA from "@/components/SimpleCTA";
import Footer from "@/components/Footer";
import { ParticleBackground } from "@/components/Animations/ParticleBackground";
import { ActionsHub } from "@/components/ActionsHub";
import { Dialog, DialogWizardContent } from "@/components/ui/dialog";
import { BuilderAssessment } from "@/components/Interactive/BuilderAssessment";
import { FrictionMapBuilder } from "@/components/Interactive/FrictionMapBuilder";
import { TryItWidget } from "@/components/Interactive/AIDecisionHelper";
import { PortfolioBuilder } from "@/components/Interactive/PortfolioBuilder";
import { InitialConsultModal } from "@/components/InitialConsultModal";
import { Mic } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type DialogType = 'quiz' | 'decision' | 'friction' | 'portfolio' | null;

const Index = () => {
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleOpenConsultModal = () => setConsultModalOpen(true);
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
    <main className="min-h-screen bg-background relative">
      <ParticleBackground />
      <Navigation />

      {/* 1. Hero */}
      <NewHero />

      {/* 2. The Big Problem -- existential urgency */}
      <BigProblem />

      {/* 3. Framework Journey */}
      <FrameworkJourney />

      {/* 4. Who Is This For + Sprint Chooser */}
      <TheProblem />

      {/* 5. News Ticker + Trust / Proof */}
      <AINewsTicker />
      <TrustSection />

      {/* 6. Final CTA */}
      <SimpleCTA />

      <Footer />

      <ActionsHub onToolClick={setDialogType} />

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
                  <span className="text-[10px] font-medium text-mint-dark">Voice Enabled</span>
                </div>
              </div>
            </div>
          )}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden sm:p-6 sm:pt-4">
            {renderDialogContent()}
          </div>
        </DialogWizardContent>
      </Dialog>

      <InitialConsultModal
        open={consultModalOpen}
        onOpenChange={setConsultModalOpen}
      />
    </main>
  );
};

export default Index;
