import Navigation from "@/components/Navigation";
import NewHero from "@/components/NewHero";
import YFork from "@/components/YFork";
import BigProblem from "@/components/BigProblem";
import TrustSection from "@/components/TrustSection";
import FrameworkJourney from "@/components/FrameworkJourney";
import ProofStrip from "@/components/ProofStrip";
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

      {/* 7. Signal Desk preview */}
      <SignalDeskPreview />

      {/* 8. Nervous Decision Machine (demo tool) */}
      <NervousDecisionMachine />

      {/* 9. Final CTA */}
      <SimpleCTA />

      <Footer />
    </main>
  );
};

export default Index;
