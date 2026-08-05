import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Bot, User } from "lucide-react";
import { MAVEN_INSTRUCTOR_URL } from "@/lib/stripe-prices";

const headlines = [
  "If there were 3 of me, I'd be able to get everything done.",
  "I need to deliver an AI strategy - where do I start?",
  "What if I could give every employee an AI coworker?",
  "14 tools pitched this quarter. I use none of them.",
  "I want to build an AI assistant that actually knows our business.",
  "Should we build our own AI tools or buy off the shelf?",
  "Everyone on my team is using different AI tools. It's chaos.",
  "I want AI doing the boring work so my team does the real work.",
  "How do I know if AI is delivering ROI or just hype?",
  "I keep imagining what my company looks like with AI embedded everywhere.",
  "I'm nervous about getting locked into the wrong vendor.",
  "I should probably understand this better than I do.",
];

const NewHero = () => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % headlines.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen bg-ink text-white overflow-hidden">
      {/* Backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink to-ink-700/50 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-mint/5 pointer-events-none" />
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none"
        src="/rising-cities.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-mint/15 rounded-full blur-3xl pointer-events-none"
        style={{ animation: "pulse 6s ease-in-out infinite" }}
      />

      {/* Content */}
      <div className="relative z-10 container-width pt-32 sm:pt-36 md:pt-40 pb-16 sm:pb-20 md:pb-24 min-h-screen flex flex-col justify-center">
        {/* Small eyebrow label reframing the rotation as social proof */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-mint/80">
            <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
            Decision blockers I hear every week
          </span>
        </motion.div>

        {/* Rotating headline -- natural height, no clipping */}
        <div className="mb-8 min-h-[1.2em] sm:min-h-[1.3em]">
          <AnimatePresence mode="wait">
            <motion.h1
              key={idx}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.15] tracking-tight text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45 }}
            >
              {headlines[idx]}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Philosophical statement */}
        <motion.p
          className="text-xl sm:text-2xl md:text-3xl font-semibold text-mint max-w-3xl mb-5"
          style={{ textShadow: "0 0 40px hsl(171 100% 43% / 0.4)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Everyone's selling AI. Nobody's helping you take control of it.
        </motion.p>

        {/* Subheadline */}
        <motion.p
          className="text-sm sm:text-base md:text-lg text-white/70 max-w-2xl mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Consultants, LLMs and the next hyped tool sell you point solutions built to extract your judgment, not build it. We do the opposite: rebuild how <span className="text-white font-semibold">you</span> decide with AI, so you get sharper as the tools get better.
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
            className="bg-gradient-to-r from-mint to-emerald-400 text-ink hover:opacity-90 font-bold px-8 py-6 text-base sm:text-lg shadow-lg shadow-mint/25 transition-all duration-300 hover:-translate-y-0.5 justify-start sm:justify-center [&_svg]:size-5"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("openDiagnosisRoom", {
                  detail: { source_page: "/", mode: "express" },
                }),
              )
            }
          >
            <User strokeWidth={1.75} />
            Bring me one real decision
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-mint/50 text-mint hover:bg-mint/10 font-bold px-8 py-6 text-base sm:text-lg transition-all duration-300 justify-start sm:justify-center [&_svg]:size-5"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("openDiagnosisRoom", {
                  detail: { source_page: "/", mode: "full" },
                }),
              )
            }
          >
            <Bot strokeWidth={1.75} />
            Run a trained decision simulation
          </Button>
        </motion.div>

        {/* Secondary entry points */}
        <motion.div
          className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <a
            href={MAVEN_INSTRUCTOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-mint transition-colors"
          >
            Or start with a free lesson
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <a
            href="/operator"
            className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-mint transition-colors"
          >
            See how I work
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default NewHero;
