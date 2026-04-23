import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

type ProofCard = {
  role: string;
  context: string;
  walkedInWith: string;
  walkedOutWith: string;
  shippedLabel: string;
  shippedBody: string;
  shippedMetric: string;
};

const cards: ProofCard[] = [
  {
    role: "SVP, Top-10 US Digital Publisher",
    context: "14 AI vendors pitched in Q3. Board asking for an AI roadmap.",
    walkedInWith: "I need an AI strategy and I don't know where to start.",
    walkedOutWith:
      "Three decisions, ranked. One vendor killed. One built internally. One paused with a re-evaluation date.",
    shippedLabel: "Shipped in 45 days",
    shippedBody: "Internal editorial-ops AI workflow.",
    shippedMetric: "40% faster content ops. No new headcount.",
  },
  {
    role: "Head of Strategy, Legacy Broadcast Business",
    context: "Team of 4. $250k budget. No mandate.",
    walkedInWith: "Everyone on my team is using different AI tools. It's chaos.",
    walkedOutWith:
      "A one-page AI operating agreement. Three approved tools. Monthly AI review on the exec agenda.",
    shippedLabel: "Shipped in 90 days",
    shippedBody: "First cross-functional AI project delivered on time.",
    shippedMetric: "Fractional role converted to permanent CAIO seat.",
  },
  {
    role: "Founder, Series B Adtech",
    context: "6 months into a custom AI build. Investors asking hard questions.",
    walkedInWith: "I want to build an AI assistant that knows our business.",
    walkedOutWith:
      "Proof the build was the wrong decision. A scope change. A repositioning around a smaller use case customers were already paying for.",
    shippedLabel: "Shipped in 60 days",
    shippedBody: "v1 with 3 paying design partners.",
    shippedMetric: "5 months of engineering saved.",
  },
];

const ProofStrip = () => {
  return (
    <section className="relative py-20 sm:py-24 md:py-28 bg-ink/[0.02] dark:bg-white/[0.02]">
      <div className="container-width max-w-6xl">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            The last three decisions I helped make.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Names redacted. Numbers real.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {cards.map((card, i) => (
            <motion.article
              key={i}
              className="editorial-card glass-card p-7 flex flex-col h-full border border-border/50 hover:border-mint/30 transition-colors"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              custom={i}
              variants={fadeUp}
            >
              <div className="space-y-5 flex-1">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
                    Role
                  </div>
                  <div className="font-semibold text-sm leading-snug">{card.role}</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
                    Context
                  </div>
                  <div className="text-sm text-muted-foreground leading-snug">
                    {card.context}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
                    Walked in with
                  </div>
                  <div className="text-sm italic text-foreground leading-snug">
                    "{card.walkedInWith}"
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
                    Walked out with
                  </div>
                  <div className="text-sm text-foreground leading-snug">
                    {card.walkedOutWith}
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-border/50">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
                  {card.shippedLabel}
                </div>
                <div className="text-sm text-foreground leading-snug mb-1">
                  {card.shippedBody}
                </div>
                <div className="text-sm font-bold text-mint-dark dark:text-mint leading-snug">
                  {card.shippedMetric}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mb-8 italic">
          Cases are composites to preserve client confidentiality. Real numbers, real decisions.
        </p>

        <div className="flex flex-col items-center gap-4">
          <p className="text-lg font-semibold">Could this be your decision?</p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-mint to-emerald-400 text-ink hover:opacity-90 font-bold px-8"
            onClick={() => window.dispatchEvent(new CustomEvent("openConsultModal"))}
          >
            Book a call <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProofStrip;
