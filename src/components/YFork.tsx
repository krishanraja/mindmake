import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { CtrlWaitlistPopover } from "@/components/CtrlWaitlistPopover";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const SUBSTACK_URL = "https://mindmakerlive.substack.com/";

const trackIntent = (card: "sharpen" | "resolve" | "rebuild") => {
  try {
    (window as unknown as { plausible?: (e: string, o?: { props?: object }) => void })
      .plausible?.("homepage_intent_card_click", { props: { card } });
  } catch {
    /* analytics optional */
  }
};

const trackFreeEntry = (destination: "diagnostic" | "ctrl_waitlist" | "substack") => {
  try {
    (window as unknown as { plausible?: (e: string, o?: { props?: object }) => void })
      .plausible?.("homepage_freeentry_click", { props: { destination } });
  } catch {
    /* analytics optional */
  }
};

const openScopingModal = () => {
  window.dispatchEvent(
    new CustomEvent("openScopingModal", {
      detail: { source_page: "/" },
    }),
  );
};

const intentCards = [
  {
    key: "sharpen" as const,
    eyebrow: "Sharpen how I think",
    title: "I want to get clearer about AI",
    body:
      "Programmes for individual leaders who want to think better with AI rather than be replaced by it. Workshops from $500 if you have a single concentrated day to spend, or the AI-Fluent Executive Cohort at $2,000–$3,000 if you want four weeks alongside fifteen other senior leaders working their own decisions in parallel.",
    ctaLabel: "See programmes",
    href: "/cohort",
  },
  {
    key: "resolve" as const,
    eyebrow: "Resolve one decision",
    title: "I have one nervous AI decision to make",
    body:
      "A focused session to resolve a specific AI call that has been sitting on your desk for weeks. You leave with a written position you can defend in front of the board, plus a 30-day roadmap with named owners.",
    ctaLabel: "Book a Signal Session",
    href: "/enterprise#signal-session",
  },
  {
    key: "rebuild" as const,
    eyebrow: "Rebuild the commercial layer",
    title: "We're changing how we make money with AI",
    body:
      "A custom engagement to rearchitect a revenue line around AI, built for operating teams and portfolios that need AI to actually show up in the P&L rather than sit politely in a deck.",
    ctaLabel: "Scope an engagement",
    href: "/capital",
  },
];

const YFork = () => {
  return (
    <section
      id="y-fork"
      className="relative py-20 sm:py-24 md:py-28 bg-background scroll-mt-20"
    >
      <div className="container-width max-w-6xl">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            Start where your question actually is.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            If you already know whether you're sharpening your own thinking, working through one specific decision, or rebuilding how the business makes money with AI, the door you want is below.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {intentCards.map((card, i) => (
            <motion.article
              key={card.key}
              className="glass-card editorial-card p-8 md:p-10 flex flex-col h-full group hover:-translate-y-1 hover:shadow-xl hover:shadow-mint/10 transition-all duration-300 border border-border/50 hover:border-mint/40"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              custom={i}
              variants={fadeUp}
            >
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-4">
                {card.eyebrow}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                {card.title}
              </h3>
              <p className="text-muted-foreground mb-8 leading-relaxed flex-grow">
                {card.body}
              </p>
              <Button
                asChild
                size="lg"
                className="w-full bg-ink dark:bg-mint text-white dark:text-ink hover:opacity-90 font-bold mt-auto"
                onClick={() => trackIntent(card.key)}
              >
                <a href={card.href}>
                  {card.ctaLabel} <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </motion.article>
          ))}
        </div>

        {/* Free-entry strip: lighter ways in for visitors not ready to book */}
        <motion.div
          className="mt-14 md:mt-20 pt-8 md:pt-10 border-t border-border/40"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-4 text-center md:text-left">
            New here, and not ready to book anything yet?
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
              Three lighter ways in, all of which give you a sense of how I work without anyone needing to send a calendar invite.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 text-sm">
              <a
                href="/leaders"
                onClick={() => trackFreeEntry("diagnostic")}
                className="inline-flex items-center gap-1.5 font-semibold text-foreground hover:text-mint-dark dark:hover:text-mint transition-colors"
              >
                Take the Decision Readiness Diagnostic
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <CtrlWaitlistPopover sourcePage="/">
                <button
                  type="button"
                  onClick={() => trackFreeEntry("ctrl_waitlist")}
                  className="inline-flex items-center gap-1.5 font-semibold text-foreground hover:text-mint-dark dark:hover:text-mint transition-colors text-left"
                >
                  Get notified when CTRL launches
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </CtrlWaitlistPopover>
              <a
                href={SUBSTACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackFreeEntry("substack")}
                className="inline-flex items-center gap-1.5 font-semibold text-foreground hover:text-mint-dark dark:hover:text-mint transition-colors"
              >
                Read the Sunday brief
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default YFork;
