import Navigation from "@/components/Navigation";
import NewHero from "@/components/NewHero";
import BigProblem from "@/components/BigProblem";
import TwoDoors from "@/components/TwoDoors";
import TrustSection from "@/components/TrustSection";
import OperatorsEdge from "@/components/OperatorsEdge";
import OperatorsBrief from "@/components/OperatorsBrief";
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

      {/* 3. Two doors: do it yourself with CTRL, or do it with me */}
      <TwoDoors />

      {/* 4. Trust + merged Case Studies (enriched carousel) */}
      <TrustSection />

      {/* 5. Operator's Edge (v5 credential proof) */}
      <OperatorsEdge />

      {/* 6. The Operator's Brief: live prices, cards, essays, decision machine */}
      <OperatorsBrief />

      {/* 7. Final CTA */}
      <SimpleCTA />

      <Footer />
    </main>
  );
};

export default Index;
