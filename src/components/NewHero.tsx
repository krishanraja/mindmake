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
    <section
      id="hero"
      className="min-h-[100dvh] flex items-center justify-center bg-ink text-white relative overflow-hidden pt-safe-area-top"
    >
      {/* Background layers */}
      <div className="hero-decoration absolute inset-0 bg-gradient-to-br from-ink-900 via-ink to-ink-700/50" />
      <div className="hero-decoration absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-mint/5" />
      <div
        className="hero-decoration absolute inset-0 opacity-15"
        style={{
          backgroundImage: "url(/mindmaker-background-green.gif)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div
        className="hero-decoration absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-mint/15 rounded-full blur-3xl"
        style={{ animation: "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}
      />

      {/* Content -- split layout: text left, owl right */}
      <div className="container-width relative z-10 pb-12 sm:pb-16 md:pb-20 overflow-x-hidden hero-content-wrapper">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-12 lg:gap-16">
          {/* Left: text content */}
          <div className="flex-1 max-w-4xl overflow-hidden order-2 md:order-1">
            <div className="space-y-8 md:space-y-10">
              {/* Owl on mobile -- above text */}
              <motion.div
                className="flex justify-center md:hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...spring, delay: 0.1 }}
              >
                <div className="w-36 h-36 rounded-2xl overflow-hidden border-2 border-mint/20 shadow-lg shadow-mint/10">
                  <video
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src="/MM owl.mp4" type="video/mp4" />
                  </video>
                </div>
              </motion.div>

              {/* Billboard-scale rotating headline */}
              <div className="relative w-full" style={{ minHeight: "2.4em" }}>
                <h1
                  className="invisible font-bold leading-[1.15] tracking-tight max-w-4xl pointer-events-none"
                  style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
                  aria-hidden="true"
                >
                  <div
                    style={{
                      height: "2.3em",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    Everyone's talking about AI. I still haven't decided.
                  </div>
                </h1>

                <h1
                  className="absolute top-0 left-0 font-bold leading-[1.15] tracking-tight text-white max-w-4xl"
                  style={{
                    fontSize: "clamp(3rem, 9vw, 7rem)",
                    width: "100%",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="relative"
                    style={{
                      minHeight: "2.3em",
                      maxHeight: "2.3em",
                      height: "2.3em",
                      display: "flex",
                      alignItems: "flex-end",
                      overflow: "hidden",
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="w-full"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          wordBreak: "break-word",
                          lineHeight: "1.15",
                          maxHeight: "2.3em",
                        }}
                      >
                        {heroVariants[currentIndex]}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </h1>
              </div>

              {/* Philosophical statement */}
              <motion.p
                className="text-xl sm:text-2xl md:text-3xl font-semibold text-mint max-w-3xl"
                style={{
                  textShadow:
                    "0 0 40px hsl(158 82% 73% / 0.4), 0 0 80px hsl(158 82% 73% / 0.2)",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: 0.3 }}
              >
                Everyone's selling AI. Nobody's helping you think.
              </motion.p>

              {/* Short subheadline */}
              <motion.p
                className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl font-light"
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
            </div>
          </div>

          {/* Right: owl video -- desktop only */}
          <motion.div
            className="hidden md:block flex-shrink-0 order-1 md:order-2"
            initial={{ opacity: 0, scale: 0.85, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ ...spring, delay: 0.4 }}
          >
            <div className="w-56 h-56 lg:w-72 lg:h-72 xl:w-80 xl:h-80 rounded-2xl overflow-hidden border-2 border-mint/20 shadow-2xl shadow-mint/10 relative">
              <video
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/MM owl.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="flex flex-col items-start gap-2 mt-12 md:mt-16 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.2 }}
        >
          <span className="text-white/70 text-xs uppercase tracking-wider font-medium">
            Scroll to explore
          </span>
          <svg
            className="w-5 h-5 text-white/70 animate-bounce"
            style={{ animationDuration: "1.5s" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </div>

      <InitialConsultModal
        open={consultModalOpen}
        onOpenChange={setConsultModalOpen}
      />
    </section>
  );
};

export default NewHero;
