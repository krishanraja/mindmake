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

const Index = () => {
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
    </main>
  );
};

export default Index;
