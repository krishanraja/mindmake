import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { InitialConsultModal } from "@/components/InitialConsultModal";
import { motion } from "framer-motion";

const spring = { type: "spring" as const, stiffness: 80, damping: 18 };

const SimpleCTA = () => {
  const [consultModalOpen, setConsultModalOpen] = useState(false);

  return (
    <>
      <InitialConsultModal
        open={consultModalOpen}
        onOpenChange={setConsultModalOpen}
      />
      <section className="py-24 md:py-32 bg-ink dark:bg-background">
        <div className="container-width">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={spring}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white dark:text-foreground">
              You've been pitched enough.
            </h2>

            <p className="text-xl text-white/70 dark:text-muted-foreground leading-relaxed mb-10">
              Start making decisions.
            </p>

            <Button
              size="lg"
              className="bg-gradient-to-r from-mint to-emerald-400 text-ink hover:opacity-90 font-bold px-10 sm:px-14 py-7 text-lg shadow-lg shadow-mint/25 hover:shadow-xl hover:shadow-mint/30 transition-all duration-300 hover:-translate-y-0.5 touch-target group"
              onClick={() => setConsultModalOpen(true)}
            >
              What's your nervous decision?
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="text-sm text-white/40 dark:text-muted-foreground mt-6">
              The first conversation is free. No prep required.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default SimpleCTA;
