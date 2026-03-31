import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  CheckCircle, ArrowRight, Clock, Users, Shield, Calendar, BarChart3
} from "lucide-react";
import { SEO } from "@/components/SEO";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const sprintDays = [
  {
    period: "Pre-work",
    theme: "Commercial Audit",
    description:
      "Before Day 1, your team completes a Commercial AI Audit questionnaire. We build a competitive brief covering what your peers are actually earning from AI, how they are pricing it, and where the commercial gaps are. No session starts cold.",
  },
  {
    period: "Days 1-2",
    theme: "Diagnostic",
    description:
      "Two 2-hour working sessions with your commercial leadership team. We map where the AI investment currently sits versus where the revenue is. We identify who owns the commercial model for AI (usually nobody). We agree on the 3 highest-value commercial opportunities.",
  },
  {
    period: "Days 3-4",
    theme: "Commercial Architecture",
    description:
      "Revenue model built and scored across 3 options. Pricing framework: how to charge for AI-enabled products and services. Go-to-market plan: who buys this, what the sales motion looks like, and what your commercial team needs to execute it. Built while you run the business.",
  },
  {
    period: "Day 5",
    theme: "Board-Ready",
    description:
      "Krish presents the full commercial strategy in a 90-minute session: revenue model, pricing, go-to-market, and 90-day commercial roadmap. Every asset is yours, editable, branded. 30-day follow-up call included.",
  },
];

const deliverables = [
  "Commercial AI audit: what exists, what it costs, what it earns",
  "Revenue model framework with 3 options scored against your business",
  "Pricing and packaging architecture for AI-enabled products",
  "Go-to-market plan: target buyers, sales motion, channel strategy",
  "Sales enablement kit: talk tracks, objection handling, demo flow",
  "90-day commercial roadmap with milestones and owners",
  "Written commercial strategy document (25-30 pages, client-branded)",
  "Board presentation deck (Krish presents or you take it)",
  "30-day follow-up call",
];

const whoItIsFor = [
  "CEOs, CMOs, CCOs, and CPOs at media, telco, and entertainment companies",
  "Companies with AI capability built or in progress and no commercial model for it",
  "Leadership teams where AI investment is not showing in the P&L",
  "New commercial leaders who need a board-ready AI revenue strategy fast",
  "PE-backed companies under pressure to show AI commercial returns",
];

const notFor = [
  "Companies still in the AI build phase (come back when you have something)",
  "Companies looking for AI engineering or technical implementation support",
  "Companies where the commercial team already owns AI revenue strategy",
];

const objections = [
  {
    q: "We have a Head of AI already.",
    a: "Good. They own the build. This Sprint is about who owns the revenue. Those are different jobs. The Sprint works alongside your technical leadership, not instead of them.",
  },
  {
    q: "We could figure this out internally.",
    a: "Probably. Most companies have been trying for 12 months. The value here is outside-in commercial perspective, speed, and the fact that it actually gets finished in a week.",
  },
  {
    q: "Why 5 days?",
    a: "Because the commercial model does not take 3 months to build if the right person is in the room. Speed is the point. Your board is not waiting.",
  },
  {
    q: "$25,000 is a lot.",
    a: "A senior commercial consultant costs $5,000 to $10,000 per day. This is 5 days of focused output plus research, analysis, and a board-ready strategy. Comparable scope from a Big 4 firm runs $100,000 to $200,000 and takes 3 months.",
  },
];

const STRIPE_LINK = import.meta.env.VITE_STRIPE_WAR_ROOM_LINK || null;
const CALENDLY_URL =
  import.meta.env.VITE_CALENDLY_URL || "https://calendly.com/krish-raja/mindmaker-meeting";

const handleBook = () => {
  if (STRIPE_LINK) {
    window.open(STRIPE_LINK, "_blank");
  } else {
    window.open(CALENDLY_URL, "_blank");
  }
};

export default function WarRoom() {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Commercial Strategy Sprint - 5-Day Intensive | Mindmaker"
        description="You have AI capability. You are missing the commercial model. In 5 days: revenue architecture, pricing framework, go-to-market plan, and a board-ready strategy. $25,000 flat fee."
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
              4 April slots - 2 remaining
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              You have AI capability.
              <br />
              <span className="text-mint">You are missing the commercial model.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
              In 5 days: revenue architecture, pricing framework, go-to-market plan,
              and a board-ready commercial strategy for your AI investment.
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              This is not a technology assessment. It is not another AI roadmap.
              It is a commercial strategy sprint run by someone who has spent 16 years
              on the revenue side of AI transformation in media and telco.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-mint text-ink hover:bg-mint/90 font-semibold text-base px-8"
                onClick={handleBook}
              >
                Book a Commercial Strategy Sprint
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-border text-foreground font-semibold text-base px-8"
                onClick={() => window.open(CALENDLY_URL, "_blank")}
              >
                <Calendar className="mr-2 w-4 h-4" />
                20-minute call first
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              $25,000 flat fee. No hourly. No scope creep. 100% upfront or 50/50 on booking and delivery.
            </p>
          </motion.div>

          {/* Credibility bar */}
          <motion.div
            className="glass-card p-6 mb-16 text-center"
            initial="hidden"
            animate="show"
            custom={2}
            variants={fadeUp}
          >
            <p className="text-muted-foreground text-sm mb-2">
              Krish ran commercial strategy and revenue transformation at
            </p>
            <p className="font-semibold text-base">
              Singtel - Nine Entertainment - Meliora
            </p>
            <p className="text-muted-foreground text-sm mt-2 max-w-xl mx-auto">
              He is not advising on a sector he studied. He ran P&Ls and commercial operations
              inside the businesses your company competes with. That is the difference.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 5-DAY ARC */}
      <section className="section-padding bg-ink/5">
        <div className="container-width max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">The 5-Day Arc</h2>
            <p className="text-muted-foreground text-lg mb-10">
              Commercial model, pricing, go-to-market, and board-ready output.
              Built while you run the business.
            </p>
          </motion.div>
          <div className="space-y-5">
            {sprintDays.map((day, i) => (
              <motion.div
                key={day.period}
                className="glass-card p-6 flex gap-5"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <div className="shrink-0 w-14 h-14 rounded-xl bg-mint/15 flex flex-col items-center justify-center">
                  <span className="text-xs text-mint font-medium text-center leading-tight px-1">
                    {day.period}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{day.theme}</h3>
                  <p className="text-muted-foreground text-sm">{day.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DELIVERABLES */}
      <section className="section-padding">
        <div className="container-width max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">What You Walk Away With</h2>
            <p className="text-muted-foreground text-lg mb-10">
              Everything editable, branded, and ready to present.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-4">
            {deliverables.map((item, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl bg-ink/5"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i * 0.4}
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
      <section className="section-padding bg-ink/5">
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
                  <span className="text-5xl font-bold text-mint">$25,000</span>
                  <span className="text-muted-foreground">flat fee</span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0" />
                    <span>No hourly. No scope creep. One price.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0" />
                    <span>100% upfront, or 50% on booking / 50% on delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0" />
                    <span>4 April slots (2 remaining)</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  Comparable scope from McKinsey or a Big 4 firm: $100,000 to $200,000 and 3 months.
                </p>
              </div>
              <div className="flex flex-col gap-3 md:min-w-[220px]">
                <Button
                  size="lg"
                  className="bg-mint text-ink hover:bg-mint/90 font-semibold w-full"
                  onClick={handleBook}
                >
                  Book the Sprint - $25,000
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full font-semibold"
                  onClick={() => window.open(CALENDLY_URL, "_blank")}
                >
                  Talk first
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHO IT IS FOR */}
      <section className="section-padding">
        <div className="container-width max-w-4xl">
          <div className="grid md:grid-cols-2 gap-10">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-mint" />
                Who This Is For
              </h2>
              <div className="space-y-3">
                {whoItIsFor.map((item, i) => (
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
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-muted-foreground" />
                Not For
              </h2>
              <div className="space-y-3">
                {notFor.map((item, i) => (
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

      {/* OBJECTIONS */}
      <section className="section-padding bg-ink/5">
        <div className="container-width max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl font-bold mb-10">Common Questions</h2>
          </motion.div>
          <div className="space-y-5">
            {objections.map((obj, i) => (
              <motion.div
                key={i}
                className="glass-card p-6"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <p className="font-semibold mb-3">{obj.q}</p>
                <p className="text-muted-foreground text-sm">{obj.a}</p>
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
              4 April slots. 2 remaining.
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              If the commercial model for your AI investment is the conversation nobody can answer,
              this is where that changes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-mint text-ink hover:bg-mint/90 font-semibold text-base px-8"
                onClick={handleBook}
              >
                Book the Sprint - $25,000
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="font-semibold text-base px-8"
                onClick={() => window.open(CALENDLY_URL, "_blank")}
              >
                <Clock className="mr-2 w-4 h-4" />
                20-minute call first
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
