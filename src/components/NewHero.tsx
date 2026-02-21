import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InitialConsultModal } from "@/components/InitialConsultModal";
import { motion, AnimatePresence } from "framer-motion";

const heroVariants = [
  "I still haven't decided.",
  "14 tools pitched. None adopted.",
  "My board wants an AI strategy.",
  "Build or buy?",
  "Which vendors do we commit to?",
  "How do I multiply my edge?",
  "My team is using AI. It's chaos.",
  "I should understand this. I don't.",
];

const spring = { type: "spring" as const, stiffness: 100, damping: 18 };

const NewHero = () => {
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroVariants.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="min-h-[100dvh] bg-ink text-white relative overflow-hidden pt-safe-area-top flex items-center">
      {/* Backgrounds */}
      <div className="hero-decoration absolute inset-0 bg-gradient-to-br from-ink-900 via-ink to-ink-700/50" />
      <div className="hero-decoration absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-mint/5" />
      <div
        className="hero-decoration absolute inset-0 opacity-15"
        style={{ backgroundImage: "url(/mindmaker-background-green.gif)", backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div
        className="hero-decoration absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-mint/15 rounded-full blur-3xl"
        style={{ animation: "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}
      />

      {/* Content - same container-width as nav, no extra flex wrappers */}
      <div className="container-width relative z-10 py-20">
        {/* Owl - floated right on desktop, hidden on mobile for now */}
        <div className="hidden lg:block float-right ml-8 mb-4">
          <div className="w-56 h-56 xl:w-72 xl:h-72 rounded-2xl overflow-hidden border-2 border-mint/20 shadow-2xl shadow-mint/10">
            <video autoPlay muted playsInline className="w-full h-full object-cover">
              <source src="/MM owl.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Rotating headline */}
        <div className="relative w-full mb-8" style={{ minHeight: "2.3em" }}>
          <h1
            className="invisible font-bold leading-[1.15] tracking-tight pointer-events-none"
            aria-hidden="true"
          >
            <div style={{ height: "2.3em", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
              I should understand this. I don't.
            </div>
          </h1>
          <h1 className="absolute top-0 left-0 w-full font-bold leading-[1.15] tracking-tight text-white">
            <div
              className="relative"
              style={{ minHeight: "2.3em", maxHeight: "2.3em", height: "2.3em", display: "flex", alignItems: "flex-end", overflow: "hidden" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
                  style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", wordBreak: "break-word", lineHeight: "1.15", maxHeight: "2.3em" }}
                >
                  {heroVariants[currentIndex]}
                </motion.div>
              </AnimatePresence>
            </div>
          </h1>
        </div>

        {/* Philosophical statement */}
        <motion.p
          className="text-xl sm:text-2xl md:text-3xl font-semibold text-mint max-w-3xl mb-6"
          style={{ textShadow: "0 0 40px hsl(158 82% 73% / 0.4), 0 0 80px hsl(158 82% 73% / 0.2)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.3 }}
        >
          Everyone's selling AI. Nobody's helping you think.
        </motion.p>

        {/* Subheadline */}
        <motion.p
          className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl font-light mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.5 }}
        >
          1:1 sprints that turn AI chaos into direction.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.7 }}
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-mint to-emerald-400 text-ink hover:opacity-90 font-bold px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg shadow-lg shadow-mint/25 hover:shadow-xl hover:shadow-mint/30 transition-all duration-300 hover:-translate-y-0.5 touch-target"
            onClick={() => setConsultModalOpen(true)}
          >
            What's your nervous decision?
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-mint/50 text-mint hover:bg-mint/10 hover:border-mint/70 backdrop-blur-md font-bold px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg touch-target transition-all duration-300 hover:shadow-md"
            onClick={() => {
              const el = document.getElementById("products");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            View Sprints
          </Button>
        </motion.div>

        {/* Clear float */}
        <div className="clear-both" />
      </div>

      <InitialConsultModal open={consultModalOpen} onOpenChange={setConsultModalOpen} />
    </section>
  );
};

export default NewHero;
