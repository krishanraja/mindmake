import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NervousDecisionMachine from "@/components/NervousDecisionMachine";
import { SEO } from "@/components/SEO";

const Tool = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="The Nervous Decision Machine"
        description="Type the AI decision you're putting off. Get a one-page artifact in 60 seconds. No email required."
        canonical="/tool"
      />
      <Navigation />
      <div className="pt-20">
        <NervousDecisionMachine variant="page" />
      </div>
      <Footer />
    </main>
  );
};

export default Tool;
