import { motion } from "framer-motion";
import { Newspaper, Layers, Sparkles } from "lucide-react";
import { SubstackSubscribeForm } from "@/components/SubstackSubscribeForm";

const PILLARS = [
  {
    label: "Headlines",
    body: "The week's signal compressed into 60 seconds. What broke, what shifted, what's worth your attention.",
    icon: Newspaper,
  },
  {
    label: "Resources",
    body: "Field notes, prompts, frameworks, walkthroughs. The stuff I actually use, not what I'd sell you.",
    icon: Layers,
  },
  {
    label: "Perspectives",
    body: "Sharper takes than I'd ever post on LinkedIn. The decisions I'm making, and why.",
    icon: Sparkles,
  },
];

interface MindMakerLiveSectionProps {
  id?: string;
}

export const MindMakerLiveSection = ({ id = "mindmaker-live" }: MindMakerLiveSectionProps) => {
  return (
    <section id={id} className="relative py-24 md:py-28 bg-ink text-white overflow-hidden scroll-mt-20">
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-mint/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="container-width max-w-4xl relative">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="/mindmaker-live-logo-dark.png"
            alt="Mindmaker Live"
            className="mx-auto mb-6 h-10 md:h-12 w-auto"
          />

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            The signal, in your inbox.
          </h2>
          <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto">
            Headlines, resources and walkthroughs you can actually use, every week. Free, and nothing in it is a pitch.
          </p>
        </motion.div>

        {/* Three pillars */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-xl p-5 bg-white/5 border border-white/10 hover:border-mint/30 transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-mint/15 text-mint">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mint">
                    {pillar.label}
                  </span>
                </div>
                <p className="text-[13px] text-white/65 leading-relaxed">{pillar.body}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Subscribe form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="max-w-xl mx-auto"
        >
          <SubstackSubscribeForm tone="dark" size="full" source="homepage-section" />
        </motion.div>
      </div>
    </section>
  );
};

export default MindMakerLiveSection;
