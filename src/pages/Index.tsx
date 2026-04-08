import Navigation from "@/components/Navigation";
import NewHero from "@/components/NewHero";
import AINewsTicker from "@/components/AINewsTicker";
import BigProblem from "@/components/BigProblem";
import FrameworkJourney from "@/components/FrameworkJourney";
import VendorLandscape from "@/components/Interactive/VendorLandscape";
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

      {/* 3. Trust / Proof -- social proof early, before methodology */}
      <TrustSection />

      {/* 4. Framework Journey */}
      <FrameworkJourney />

      {/* 4.5. Vendor Landscape — live model comparisons */}
      <VendorLandscape />

      {/* 5. Who Is This For + Sprint Chooser */}
      <TheProblem />

      {/* 6. News Ticker */}
      <AINewsTicker />

      {/* 7. Final CTA */}
      <SimpleCTA />

      <Footer />
    </main>
  );
};

export default Index;
