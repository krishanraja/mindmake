import Navigation from "@/components/Navigation";
import NewHero from "@/components/NewHero";
import YFork from "@/components/YFork";
import BigProblem from "@/components/BigProblem";
import TrustSection from "@/components/TrustSection";
import FrameworkJourney from "@/components/FrameworkJourney";
import ProofStrip from "@/components/ProofStrip";
import OperatorsEdge from "@/components/OperatorsEdge";
import SignalDeskPreview from "@/components/SignalDeskPreview";
import NervousDecisionMachine from "@/components/NervousDecisionMachine";
import SimpleCTA from "@/components/SimpleCTA";
import Footer from "@/components/Footer";
import { ParticleBackground } from "@/components/Animations/ParticleBackground";

const Index = () => {
  return (
    <main className="min-h-screen bg-background relative">
      <ParticleBackground />
      <Navigation />

      {/* 1. Hero */}
      <NewHero />

      {/* 2. The Y-fork */}
      <YFork />

      {/* 3. The Big Problem -- existential urgency */}
      <BigProblem />

      {/* 4. Trust / Proof */}
      <TrustSection />

      {/* 5. Framework Journey */}
      <FrameworkJourney />

      {/* 6. Proof Strip -- real decisions */}
      <ProofStrip />

      {/* 7. Operator's Edge (v5) -- credential proof before Signal Desk */}
      <OperatorsEdge />

      {/* 8. Signal Desk preview */}
      <SignalDeskPreview />

      {/* 9. Nervous Decision Machine (demo tool) */}
      <NervousDecisionMachine />

      {/* 10. Final CTA */}
      <SimpleCTA />

      <Footer />
    </main>
  );
};

export default Index;
