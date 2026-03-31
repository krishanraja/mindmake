import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  CheckCircle, ArrowRight, Sparkles, Calendar, Users, Shield, Clock, TrendingUp
} from "lucide-react";
import { SEO } from "@/components/SEO";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const whatKrishBrings = [
  "Commercial product strategy: what to build for market success, not just technical elegance",
  "Master product marketing: how to position AI capabilities to win in competitive markets",
  "Revenue architecture: multiple models designed, tested, and iterated over time",
  "Sales enablement: bridging the gap between what engineers built and what commercial teams sell",
  "Competitive intelligence: predictive analysis of where AI markets are heading",
  "Board-level commercial storytelling: translating AI investment into business outcomes",
];

const whatThisIsNot = [
  "Not managing your engineering team (that is your CTO's job)",
  "Not owning the technical AI roadmap",
  "Not replacing your commercial leadership - working alongside them",
  "Not a quarterly check-in or advisory retainer",
];

const monthlyScope = [
  "2 x 2-hour strategic working sessions (recorded and summarised)",
  "Unlimited async strategic support via Slack or email (same-day response)",
  "Monthly competitive intelligence brief: what is moving in your market",
  "One major deliverable per month: positioning update, GTM strategy, sales enablement, board prep, or revenue model iteration",
];

const timeline = [
  {
    period: "Month 1-2",
    title: "Foundation",
    items: [
      "Complete commercial audit and competitive positioning analysis",
      "Product marketing framework for all AI-related initiatives",
      "Revenue model designed and tested against your business reality",
      "Alignment workshop with technical and commercial teams",
    ],
  },
  {
    period: "Month 3-4",
    title: "Execution",
    items: [
      "Go-to-market strategy in motion",
      "Sales enablement for AI capabilities deployed",
      "Competitive positioning refined based on market response",
      "Product roadmap aligned with commercial milestones",
    ],
  },
  {
    period: "Month 5-6",
    title: "Scale",
    items: [
      "Performance analysis and strategy refinement",
      "Market expansion opportunities identified and scoped",
      "Long-term competitive strategy designed",
      "Handoff framework for internal team continuity",
    ],
  },
];

const signals = [
  "You have strong AI capabilities and need someone to own the commercial strategy",
  "Your engineering and commercial teams need a bridge who speaks both languages",
  "You want world-class product marketing for your AI investments",
  "Your board needs a clear commercial narrative for AI - not just a technical update",
  "You need predictive thinking about where AI competition is heading in your sector",
];

const STRIPE_LINK = import.meta.env.VITE_STRIPE_FRACTIONAL_DEPOSIT || null;
const CALENDLY_URL =
  import.meta.env.VITE_CALENDLY_URL || "https://calendly.com/krish-raja/mindmaker-meeting";

const handleBook = () => {
  window.open(STRIPE_LINK || CALENDLY_URL, "_blank");
};

const handleExplore = () => {
  window.open(CALENDLY_URL, "_blank");
};

export default function FractionalCAIO() {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Embedded Commercial Strategy for AI | Mindmaker"
        description="Your engineering team builds AI capabilities. Who owns the commercial strategy, product marketing, and competitive positioning? Embedded strategic leadership for companies serious about AI commercial success."
      />
      <Navigation />

      {/* HERO */}
      <section className="section-padding pt-32 bg-ink">
        <div className="container-width max-w-4xl">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate="show"
            variants={fadeUp}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/10 border border-mint/20 text-mint text-sm font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              1 engagement slot available
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white text-balance">
              AI capabilities are table stakes.
              <br />
              <span className="text-mint">Commercial strategy creates advantage.</span>
            </h1>
            <p className="text-xl text-white/70 mb-4 max-w-2xl mx-auto text-balance">
              Embedded strategic leadership for companies serious about transforming AI investment into commercial success.
            </p>
            <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10 text-balance">
              Embedded commercial strategy leadership for your AI investments. Not a quarterly advisor. Someone who owns the commercial thinking: what to build for market success, how to position it to win, and how to stay ahead of competition.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-mint text-ink hover:bg-mint/90 font-semibold text-base px-8"
                onClick={handleBook}
              >
                Explore This Engagement
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 font-semibold text-base px-8"
                onClick={handleExplore}
              >
                <Calendar className="mr-2 w-4 h-4" />
                20-minute chemistry call
              </Button>
            </div>
            <p className="text-sm text-white/40 mt-4">
              $5,000 deposit to begin. $8,000/month. 6-month minimum engagement. $53,000 total.
            </p>
          </motion.div>

          {/* Credibility */}
          <motion.div
            className="rounded-lg border border-white/10 bg-white/5 p-6 mb-16"
            initial="hidden"
            animate="show"
            custom={2}
            variants={fadeUp}
          >
            <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
              <div className="flex-1">
                <p className="font-semibold text-base mb-2 text-white">
                  The rare combination
                </p>
                <p className="text-white/60 text-sm">
                  Commercial product strategy plus master product marketing.
                  "What should we build" combined with "how do we position it to win."
                  Most companies get one or the other. This engagement gives you both.
                </p>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-base mb-2 text-white">
                  15 years of what works (and what doesn't)
                </p>
                <p className="text-white/60 text-sm">
                  Singtel. Nine Entertainment. Media and telco at scale.
                  Pattern recognition from inside the companies your business competes with.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHAT KRISH BRINGS / WHAT THIS IS NOT */}
      <section className="section-padding bg-muted">
        <div className="container-width max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <h3 className="text-xl font-bold mb-5">What Krish brings</h3>
              <div className="space-y-3">
                {whatKrishBrings.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0 mt-1" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={1}
              variants={fadeUp}
            >
              <h3 className="text-xl font-bold mb-5 text-muted-foreground">What this is not</h3>
              <div className="space-y-3">
                {whatThisIsNot.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-4 shrink-0 mt-1 text-muted-foreground font-bold text-xs">x</span>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="section-padding">
        <div className="container-width max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">The 6-month arc</h2>
            <p className="text-muted-foreground text-lg mb-10">
              Foundation, execution, then scale. By month 6, your team owns it.
            </p>
          </motion.div>
          <div className="space-y-6">
            {timeline.map((phase, i) => (
              <motion.div
                key={phase.period}
                className="glass-card p-6"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-20 h-8 rounded-lg bg-ink text-white flex items-center justify-center">
                    <span className="text-xs font-medium">{phase.period}</span>
                  </div>
                  <h3 className="text-xl font-semibold">{phase.title}</h3>
                </div>
                <div className="space-y-2 ml-0 md:ml-[92px]">
                  {phase.items.map((item, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-mint shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MONTHLY SCOPE */}
      <section className="section-padding bg-muted">
        <div className="container-width max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-2xl font-bold mb-6">Every month includes</h2>
          </motion.div>
          <div className="space-y-3">
            {monthlyScope.map((item, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl bg-background"
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
                <h2 className="text-3xl font-bold mb-3">Getting started</h2>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold">$5,000</span>
                  <span className="text-muted-foreground">deposit to begin</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  $8,000/month. 6-month minimum engagement. $53,000 total including deposit.
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0" />
                    <span>10-12 hours per month of Krish's time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0" />
                    <span>Unlimited async strategic support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0" />
                    <span>Maximum 2 active engagements at any time</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 md:min-w-[220px]">
                <Button
                  size="lg"
                  className="bg-mint text-ink hover:bg-mint/90 font-semibold w-full"
                  onClick={handleBook}
                >
                  Explore This Engagement
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full font-semibold"
                  onClick={handleExplore}
                >
                  Chemistry call first
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* GOOD FIT */}
      <section className="section-padding bg-muted">
        <div className="container-width max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-mint" />
              Good fit signals
            </h2>
          </motion.div>
          <div className="space-y-3">
            {signals.map((item, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i * 0.2}
                variants={fadeUp}
              >
                <CheckCircle className="w-4 h-4 text-mint shrink-0 mt-1" />
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
              1 engagement slot available for April.
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              In a market where AI capabilities are becoming table stakes,
              commercial strategy becomes the only sustainable advantage.
            </p>
            <Button
              size="lg"
              className="bg-mint text-ink hover:bg-mint/90 font-semibold text-base px-8"
              onClick={handleExplore}
            >
              Start the Conversation
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
