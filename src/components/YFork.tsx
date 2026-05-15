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
            Three doors. Pick yours.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Workshops are for the leader who wants to build, in one day, alongside the operator. The Cohort is for the leader sitting on one nervous AI decision. Enterprise is for the company that needs AI to actually move revenue.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {/* Card 1: Workshops */}
          <motion.article
            className="glass-card editorial-card p-8 md:p-10 flex flex-col h-full group hover:-translate-y-1 hover:shadow-xl hover:shadow-mint/10 transition-all duration-300 border border-border/50 hover:border-mint/40"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            custom={0}
            variants={fadeUp}
          >
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-4">
              From $599
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
              Build alongside me in one day.
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">
              Five one-day workshops. You don't watch me build. You build with me. By end of session you walk out with a real artefact deployed on your real surface.
            </p>
            <div className="mt-auto">
              <div className="mb-6 pb-6 border-b border-border/50 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">From $599</span>
                <span className="mx-2">·</span>
                <span>One day each</span>
                <span className="mx-2">·</span>
                <span>Hosted on Maven</span>
              </div>
              <Button
                asChild
                size="lg"
                className="w-full bg-ink dark:bg-mint text-white dark:text-ink hover:opacity-90 font-bold"
              >
                <a href="/workshops">
                  See the workshops <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </div>
          </motion.article>

          {/* Card 2: The AI-Fluent Executive */}
          <motion.article
            className="glass-card editorial-card p-8 md:p-10 flex flex-col h-full group hover:-translate-y-1 hover:shadow-xl hover:shadow-mint/10 transition-all duration-300 border border-border/50 hover:border-mint/40"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            custom={1}
            variants={fadeUp}
          >
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-4">
              $2,500
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
              Make your nervous AI decision with 15 senior leaders.
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">
              The AI-Fluent Executive runs quarterly. Four weeks, mostly async, with weekly live sessions. Diagnose, decompose, decide, deploy. Bring the decision you've been avoiding. Walk out with a position you can defend in front of the board.
            </p>
            <div className="mt-auto">
              <div className="mb-6 pb-6 border-b border-border/50 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">$2,500</span>
                <span className="mx-2">·</span>
                <span>4 weeks</span>
                <span className="mx-2">·</span>
                <span>Hosted on Maven</span>
              </div>
              <Button
                asChild
                size="lg"
                className="w-full bg-ink dark:bg-mint text-white dark:text-ink hover:opacity-90 font-bold"
              >
                <a href="/cohort">
                  See the Cohort <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </div>
          </motion.article>

          {/* Card 3: Enterprise */}
          <motion.article
            className="glass-card editorial-card p-8 md:p-10 flex flex-col h-full group hover:-translate-y-1 hover:shadow-xl hover:shadow-mint/10 transition-all duration-300 border border-border/50 hover:border-mint/40"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            custom={2}
            variants={fadeUp}
          >
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-4">
              From $15,000
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
              Build the engine. Or rebuild it.
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">
              For companies whose AI work isn't showing up in revenue yet. 30 days, fixed scope, me in the room. We rewrite ICP, pricing, GTM, content and outbound so the company actually runs on AI instead of just talking about it.
            </p>
            <div className="mt-auto">
              <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-border/50">
                <span className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">
                  From
                </span>
                <span className="text-3xl font-bold">$15,000</span>
              </div>
              <Button
                asChild
                size="lg"
                className="w-full bg-ink dark:bg-mint text-white dark:text-ink hover:opacity-90 font-bold"
              >
                <a href="/enterprise">
                  Explore enterprise <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
};

export default YFork;
