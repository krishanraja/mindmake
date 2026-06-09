import Navigation from "@/components/Navigation";
import NewHero from "@/components/NewHero";
import BigProblem from "@/components/BigProblem";
import TrustSection from "@/components/TrustSection";
import FrameworkJourney from "@/components/FrameworkJourney";
import OperatorsEdge from "@/components/OperatorsEdge";
import OperatorsBrief from "@/components/OperatorsBrief";
import { MindMakerLiveSection } from "@/components/MindMakerLiveSection";
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

      {/* 2. The Big Problem: existential urgency */}
      <BigProblem />

      {/* 4. Trust + merged Case Studies (enriched carousel) */}
      <TrustSection />

      {/* 5. Framework Journey */}
      <FrameworkJourney />

      {/* 6. Operator's Edge (v5 credential proof) */}
      <OperatorsEdge />

      {/* 7. The Operator's Brief: live prices, cards, essays, decision machine */}
      <OperatorsBrief />

      {/* 8. MindMaker Live: newsletter subscribe surface */}
      <MindMakerLiveSection />

      {/* 9. Final CTA */}
      <SimpleCTA />

      <Footer />
    </main>
  );
};

export default Index;
