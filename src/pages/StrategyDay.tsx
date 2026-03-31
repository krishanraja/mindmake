import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Zap, Clock, MapPin, FileText } from "lucide-react";
import { SEO } from "@/components/SEO";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" } }),
};

const sessionArc = [
  {
    hour: "Hour 1",
    theme: "Current State",
    description:
      "Where AI sits in your business today. Honest assessment — not a vendor demo. What you're spending, what's working, what's noise.",
  },
  {
    hour: "Hour 2",
    theme: "Opportunity Mapping",
    description:
      "Your top 3–5 AI use cases identified and ranked by business impact and implementation feasibility. Real opportunities, not a generic AI maturity framework.",
  },
  {
    hour: "Hour 3",
    theme: "Quick Wins",
    description:
      "What you can implement in 30 days with tools you already have. No procurement cycle. No 6-month roadmap required. Actual momentum, this month.",
  },
  {
    hour: "Hour 4",
    theme: "Your 30/60/90 Plan",
    description:
      "A clear roadmap: what happens in 30 days, 60 days, 90 days. Who owns what. How you measure progress. Deliverable built in real-time as we work.",
  },
];

const beforeSession = [
  "AI Readiness Questionnaire (20 minutes, completed by your team)",
  "Full competitive and sector AI research brief (Agatha-built, Krish-reviewed)",
  "Optional 30-minute pre-call with Krish",
];

const deliverables = [
  "8–10 page written strategic summary",
  "Visual AI opportunity map",
  "30-day quick-win action plan",
  "Vendor and tool recommendations for your top use cases",
  "Session recording (optional)",
];

const goodFor = [
  "Leadership teams who keep pushing the AI conversation to next quarter",
  "CEOs or founders who need clarity before committing to anything bigger",
  "New leaders who want to understand the AI landscape before setting direction",
  "Companies where AI strategy is everyone's problem and nobody's priority",
];

const STRIPE_STRATEGY_DAY_LINK = import.meta.env.VITE_STRIPE_STRATEGY_DAY_LINK || null;
const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL || "https://calendly.com/krish-mindmaker";

export default function StrategyDay() {
  const handleCTA = () => {
    if (STRIPE_STRATEGY_DAY_LINK) {
      window.open(STRIPE_STRATEGY_DAY_LINK, "_blank");
    } else {
      window.open(CALENDLY_URL, "_blank");
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="AI Strategy Day — One-Day Intensive | Mindmaker"
        description="One day. Your full AI strategy. A single intensive session that produces your top 3 AI opportunities and a 30-day quick-win plan. $7,500."
      />
      <Navigation />

      {/* HERO */}
      <section className="section-padding pt-32">
        <div className="container-width max-w-4xl">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate="show"
            variants={fadeUp}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/10 border border-mint/20 text-mint text-sm font-medium mb-6">
              <Clock className="w-3.5 h-3.5" />
              April dates available — virtual or NYC in-person
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              One Day.
              <br />
              <span className="text-mint">Your Full AI Strategy.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
              The "we need to figure out AI" conversation — resolved in a single session.
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Four hours. Your top 3 AI opportunities. A 30-day quick-win plan.
              A 30/60/90 roadmap. Written up and in your inbox 48 hours later.
              Not an 80-slide deck. A crisp strategy and an actual action plan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-mint text-ink hover:bg-mint/90 font-semibold text-base px-8"
                onClick={handleCTA}
              >
                Book Your Strategy Day
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-border text-foreground font-semibold text-base px-8"
                onClick={() => window.open(CALENDLY_URL, "_blank")}
              >
                <Clock className="mr-2 w-4 h-4" />
                Check availability first
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              $7,500 flat fee · 100% upfront at booking · Virtual or NYC in-person
            </p>
          </motion.div>

          {/* Simple stats bar */}
          <motion.div
            className="grid grid-cols-3 gap-4 mb-16"
            initial="hidden"
            animate="show"
            custom={2}
            variants={fadeUp}
          >
            {[
              { stat: "4 hours", label: "Live session" },
              { stat: "48 hrs", label: "Written summary delivered" },
              { stat: "$7,500", label: "Flat fee, no surprises" },
            ].map((item, i) => (
              <div key={i} className="glass-card p-5 text-center">
                <div className="text-2xl font-bold text-mint mb-1">{item.stat}</div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* BEFORE THE SESSION */}
      <section className="section-padding bg-ink/5">
        <div className="container-width max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Before the Session</h2>
            <p className="text-muted-foreground text-lg mb-8">
              No session starts cold. You prep, we prep — so Hour 1 runs with context, not catch-up.
            </p>
          </motion.div>
          <div className="space-y-3">
            {beforeSession.map((item, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl bg-background border border-border/50"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <CheckCircle className="w-5 h-5 text-mint shrink-0 mt-0.5" />
                <span className="text-sm">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* THE 4-HOUR ARC */}
      <section className="section-padding">
        <div className="container-width max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">The 4-Hour Arc</h2>
            <p className="text-muted-foreground text-lg mb-10">
              The deliverable deck is being built in real-time as we work through each section.
            </p>
          </motion.div>

          <div className="space-y-5">
            {sessionArc.map((block, i) => (
              <motion.div
                key={block.hour}
                className="glass-card p-6 flex gap-5"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <div className="shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-mint/15 flex flex-col items-center justify-center">
                    <span className="text-xs text-mint font-medium">{block.hour}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{block.theme}</h3>
                  <p className="text-muted-foreground text-sm">{block.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DELIVERABLES */}
      <section className="section-padding bg-ink/5">
        <div className="container-width max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">48 Hours Later</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Everything in writing. Nothing left in the room.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-4">
            {deliverables.map((item, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl bg-background border border-border/50"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i * 0.5}
                variants={fadeUp}
              >
                <FileText className="w-5 h-5 text-mint shrink-0 mt-0.5" />
                <span className="text-sm">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section-padding">
        <div className="container-width max-w-4xl">
          <motion.div
            className="glass-card p-8 md:p-12"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
              <div>
                <h2 className="text-3xl font-bold mb-3">Investment</h2>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-5xl font-bold text-mint">$7,500</span>
                  <span className="text-muted-foreground">flat fee</span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0" />
                    <span>100% upfront at booking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-mint shrink-0" />
                    <span>Virtual (Zoom) or in-person in NYC</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-mint shrink-0" />
                    <span>A Stripe link and a calendar invite — that's the whole process</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-ink/5 text-sm">
                  <p className="font-medium mb-1">Natural next step</p>
                  <p className="text-muted-foreground text-xs">
                    Many companies use the Strategy Day as a starting point before moving into a full{" "}
                    <a href="/war-room" className="text-mint underline underline-offset-2">AI War Room</a>{" "}
                    or{" "}
                    <a href="/fractional-caio" className="text-mint underline underline-offset-2">Fractional CAIO</a>{" "}
                    engagement. No obligation — but the option is there if the session reveals more than a single day can address.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 md:min-w-[220px]">
                <Button
                  size="lg"
                  className="bg-mint text-ink hover:bg-mint/90 font-semibold w-full"
                  onClick={handleCTA}
                >
                  Book Your Strategy Day
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full font-semibold"
                  onClick={() => window.open(CALENDLY_URL, "_blank")}
                >
                  Check availability
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="section-padding bg-ink/5">
        <div className="container-width max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl font-bold mb-8">Who This Is For</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-4">
            {goodFor.map((item, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3 p-5 rounded-xl bg-background border border-border/50"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i * 0.5}
                variants={fadeUp}
              >
                <CheckCircle className="w-5 h-5 text-mint shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section-padding">
        <div className="container-width max-w-3xl text-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              April dates available now.
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              If AI strategy is the conversation that keeps getting pushed to next quarter — this is how you end that.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-mint text-ink hover:bg-mint/90 font-semibold text-base px-8"
                onClick={handleCTA}
              >
                Book Your Strategy Day — $7,500
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="font-semibold text-base px-8"
                onClick={() => window.open(CALENDLY_URL, "_blank")}
              >
                <Clock className="mr-2 w-4 h-4" />
                Check availability
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
