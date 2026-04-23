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
            Two ways I work.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            A cohort for leaders making AI decisions. Or enterprise sprints for companies commercializing AI products.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Card A — For AI leaders (The Cohort) */}
          <motion.article
            className="glass-card editorial-card p-8 md:p-10 flex flex-col h-full group hover:-translate-y-1 hover:shadow-xl hover:shadow-mint/10 transition-all duration-300 border border-border/50 hover:border-mint/40"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            custom={0}
            variants={fadeUp}
          >
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-4">
              The Cohort
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
              Make your AI decisions with 15 other senior leaders.
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              The AI Decision Cohort runs quarterly. Three weeks async, three live sessions, 10-15 senior leaders. You show up with a nervous AI decision and leave with a board-ready position. Small group. Peer pressure. Accountability. Done.
            </p>
            <div className="mt-auto">
              <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-border/50">
                <span className="text-3xl font-bold">$3,500</span>
                <span className="text-sm text-muted-foreground">per seat</span>
              </div>
              <Button
                asChild
                size="lg"
                className="w-full bg-ink dark:bg-mint text-white dark:text-ink hover:opacity-90 font-bold"
              >
                <a href="/cohort">
                  See the cohort <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </div>
          </motion.article>

          {/* Card B — For AI products (Enterprise) */}
          <motion.article
            className="glass-card editorial-card p-8 md:p-10 flex flex-col h-full group hover:-translate-y-1 hover:shadow-xl hover:shadow-mint/10 transition-all duration-300 border border-border/50 hover:border-mint/40"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            custom={1}
            variants={fadeUp}
          >
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-4">
              Enterprise
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
              Your AI capabilities, translated into revenue.
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              You've built AI capabilities. Great products still need great positioning, pricing, and GTM. I build the commercial strategy that makes your AI investment pay back.
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
