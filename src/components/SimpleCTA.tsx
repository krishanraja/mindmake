import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import krishHeadshot from "@/assets/krish-headshot.png";
import { InitialConsultModal } from "@/components/InitialConsultModal";

const SimpleCTA = () => {
  const [consultModalOpen, setConsultModalOpen] = useState(false);

  return (
    <>
      <InitialConsultModal 
        open={consultModalOpen} 
        onOpenChange={setConsultModalOpen}
      />
    <section className="section-padding bg-ink dark:bg-background">
      <div className="container-width">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <img 
              src={krishHeadshot} 
              alt="Krish Raja" 
              className="w-48 h-48 rounded-full border-4 border-mint/20"
              loading="eager"
            />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-dark-card-heading dark:text-foreground">
            You've been pitched enough.
          </h2>
          
          <p className="text-xl text-dark-card-body dark:text-foreground leading-relaxed mb-8">
            You've sat through enough demos. You've downloaded enough whitepapers. The only thing left is to make a decision.
            <span className="block mt-4 text-lg">Start with your first one.</span>
          </p>
          
          <Button 
            size="lg"
            className="bg-mint text-ink hover:bg-mint/90 font-semibold px-6 sm:px-12 py-6 text-lg touch-target group w-full sm:w-auto"
            onClick={() => setConsultModalOpen(true)}
          >
            What's your nervous decision?
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <p className="text-sm text-dark-card-muted dark:text-muted-foreground mt-6">
            The first conversation is free. No prep required.
          </p>
        </div>
      </div>
    </section>
    </>
  );
};

export default SimpleCTA;
