import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InitialConsultModal } from "@/components/InitialConsultModal";
import { motion, AnimatePresence } from "framer-motion";

const headlines = [
  "I still haven't decided.",
  "14 tools pitched. None adopted.",
  "My board wants an AI strategy.",
  "Build or buy?",
  "Which vendors do we commit to?",
  "How do I multiply my edge?",
  "My team is using AI. It's chaos.",
  "I should understand this. I don't.",
];

const NewHero = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % headlines.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen bg-ink text-white overflow-hidden">
      {/* Decorative backgrounds -- all absolute, pointer-events-none */}
      <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink to-ink-700/50 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-mint/5 pointer-events-none" />
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{ backgroundImage: "url(/mindmaker-background-green.gif)", backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-mint/15 rounded-full blur-3xl pointer-events-none"
        style={{ animation: "pulse 6s ease-in-out infinite" }}
      />

      {/* Owl -- absolute top-right, outside text flow */}
      <div className="absolute top-32 right-8 lg:right-16 xl:right-24 hidden lg:block pointer-events-none z-10">
        <div className="w-48 h-48 xl:w-64 xl:h-64 rounded-2xl overflow-hidden shadow-2xl shadow-mint/10">
          <video autoPlay muted playsInline className="w-full h-full object-cover">
            <source src="/MM owl.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      {/* Content -- uses container-width, same as nav */}
      <div className="relative z-10 container-width pt-32 sm:pt-36 md:pt-40 pb-16 sm:pb-20 md:pb-24 min-h-screen flex flex-col justify-center">
        {/* Rotating headline */}
        <div className="mb-8">
          <div className="relative h-[2.3em] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.h1
                key={idx}
                className="absolute inset-0 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
              >
                {headlines[idx]}
              </motion.h1>
            </AnimatePresence>
          </div>
          {/* Invisible spacer for height */}
          <h1 className="invisible text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight h-0 overflow-hidden" aria-hidden="true">
            I should understand this. I don't.
          </h1>
        </div>

        {/* Philosophical statement */}
        <motion.p
          className="text-xl sm:text-2xl md:text-3xl font-semibold text-mint max-w-3xl mb-5"
          style={{ textShadow: "0 0 40px hsl(158 82% 73% / 0.4)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Everyone's selling AI. Nobody's helping you think.
        </motion.p>

        {/* Subheadline */}
        <motion.p
          className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          1:1 sprints that turn AI chaos into direction.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-mint to-emerald-400 text-ink hover:opacity-90 font-bold px-8 py-6 text-base sm:text-lg shadow-lg shadow-mint/25 transition-all duration-300 hover:-translate-y-0.5"
            onClick={() => setModalOpen(true)}
          >
            What's your nervous decision?
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-mint/50 text-mint hover:bg-mint/10 font-bold px-8 py-6 text-base sm:text-lg transition-all duration-300"
            onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
          >
            View Sprints
          </Button>
        </motion.div>
      </div>

      <InitialConsultModal open={modalOpen} onOpenChange={setModalOpen} />
    </section>
  );
};

export default NewHero;
