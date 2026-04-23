import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" },
  }),
};

export type SignalTag = "SIGNAL" | "NOISE" | "DECISION" | "TAKE";

export type SignalCard = {
  tag: SignalTag;
  timestamp: string;
  headline: string;
  body: string;
  takeLink?: string;
};

const defaultCards: SignalCard[] = [
  {
    tag: "SIGNAL",
    timestamp: "2d ago",
    headline: "Anthropic ships agent-native browser, not a plugin.",
    body: "The browser as operating surface is now a serious product category. Orchestration buyers should rethink desktop-vs-cloud roadmaps.",
  },
  {
    tag: "NOISE",
    timestamp: "3d ago",
    headline: "Another vendor rebrands workflow automation as 'agentic AI'.",
    body: "If your team is being pitched 'agents' without a memory architecture or an eval harness, that isn't agentic. It's Zapier with better branding.",
  },
  {
    tag: "DECISION",
    timestamp: "4d ago",
    headline: "Build vs buy on your internal copilot is a 30-day call.",
    body: "OpenAI and Google's enterprise tiers now ship what most leaders were scoping a build for. Reopen the build memo before Q3.",
  },
  {
    tag: "TAKE",
    timestamp: "5d ago",
    headline: "The consultant-to-operator gap is widening, fast.",
    body: "AI-native operators are building in weeks what decks used to pitch in months. If your advisors still open with slides, the work isn't the work.",
    takeLink: "/blog",
  },
  {
    tag: "SIGNAL",
    timestamp: "1w ago",
    headline: "Haiku 4.5 is cheaper than gpt-4o-mini and better on reasoning.",
    body: "Price-to-quality frontier shifted. Any LLM cost model older than 30 days is probably wrong.",
  },
  {
    tag: "TAKE",
    timestamp: "1w ago",
    headline: "Stop hiring a Head of AI. Hire a builder with taste.",
    body: "The best AI leaders right now are operators who ship. Titles follow outcomes, not the other way round.",
    takeLink: "/blog",
  },
];

const tagStyles: Record<SignalTag, string> = {
  SIGNAL: "bg-mint/15 text-mint-dark dark:text-mint border-mint/30",
  NOISE: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
  DECISION:
    "bg-background/60 text-foreground border-mint/60 dark:border-mint/50 shadow-[0_0_0_1px_hsl(var(--mint)/0.4)]",
  TAKE: "bg-mint/10 text-mint-dark dark:text-mint border-mint/30",
};

const SignalDeskPreview = ({ cards = defaultCards }: { cards?: SignalCard[] }) => {
  return (
    <section className="relative py-20 sm:py-24 md:py-28 bg-background">
      <div className="container-width max-w-6xl">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            The Signal Desk.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            What I'm watching this week. Signal, noise, and the calls you should be making.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {cards.slice(0, 6).map((card, i) => (
            <motion.article
              key={i}
              className="editorial-card glass-card p-6 flex flex-col h-full border border-border/50 hover:border-mint/40 transition-colors"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              custom={i}
              variants={fadeUp}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.14em] border ${tagStyles[card.tag]}`}
                >
                  {card.tag === "TAKE" && (
                    <span className="w-4 h-4 rounded-full bg-mint text-ink text-[9px] font-black flex items-center justify-center">
                      K
                    </span>
                  )}
                  {card.tag}
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  {card.timestamp}
                </span>
              </div>
              <h3 className="font-bold text-base mb-2 leading-snug">{card.headline}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {card.body}
              </p>
              {card.takeLink && (
                <a
                  href={card.takeLink}
                  className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-mint-dark dark:text-mint hover:underline"
                >
                  Read Krish's take <ArrowRight className="w-3.5 h-3.5" />
                </a>
              )}
            </motion.article>
          ))}
        </div>

        <div className="flex justify-end">
          <a
            href="/signal"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-mint-dark dark:hover:text-mint transition-colors"
          >
            See the full desk <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default SignalDeskPreview;
