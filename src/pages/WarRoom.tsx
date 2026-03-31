import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Clock, Users, FileText, Zap, Shield, Calendar } from "lucide-react";
import { InitialConsultModal } from "@/components/InitialConsultModal";
import { SEO } from "@/components/SEO";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" } }),
};

const warRoomDays = [
  {
    period: "Pre-work",
    theme: "Foundation",
    description:
      "Before Day 1, you complete an AI Readiness Questionnaire. We build a full research brief: your competitive landscape, peer AI benchmarks, current tool inventory. No session starts cold.",
  },
  {
    period: "Days 1–2",
    theme: "Discovery",
    description:
      "Two 2-hour working sessions with your leadership team. We map your current AI maturity across five dimensions — honestly. We identify what's working, what's wasted spend, and where the real opportunities sit.",
  },
  {
    period: "Days 3–4",
    theme: "Strategy Build",
    description:
      "Your top 5 AI opportunities, ranked by ROI and implementation feasibility. A competitive landscape map. A vendor shortlist with TCO estimates. A 90-day implementation roadmap. Built while you sleep.",
  },
  {
    period: "Day 5",
    theme: "Board-Ready",
    description:
      "Krish presents a 90-minute board-ready session: your strategy, your roadmap, your decisions — defended and documented. Every asset is yours, editable, branded. Plus a 30-day follow-up call.",
  },
];

const deliverables = [
  "AI maturity assessment across 5 dimensions",
  "Competitive AI landscape map (your sector, your peers)",
  "Top 5 AI opportunities ranked by ROI + feasibility",
  "Vendor shortlist with TCO estimates for top 3 use cases",
  "90-day implementation roadmap with 30/60/90 milestones",
  "Risk and governance framework (1 page)",
  "Board-ready presentation deck (Krish presents, or you take it)",
  "Written executive summary (2–3 pages)",
  "30-day follow-up call",
];

const whoItIsFor = [
  "CMOs, CCOs, CDOs, and CEOs at media, telco, and entertainment companies",
  "Companies with $50M–$500M revenue that know AI matters but haven't moved",
  "Leadership teams who've started an AI initiative and stalled",
  "New CDOs or CMOs who need a strategy to present within 90 days",
  "PE-backed portfolio companies under pressure to demonstrate AI value",
];

const notFor = [
  "Pure tech companies with an in-house AI team",
  "Companies wanting to build AI products (this is strategy, not engineering)",
  "Companies under $20M revenue",
];

const objections = [
  {
    q: '"$25K is a lot."',
    a: "A senior strategy consultant's day rate is $5,000–$10,000. This is five days of full-team output plus research, analysis, and a board deck. Comparable work from a big-4 firm runs $100,000–$200,000 and takes three months.",
  },
  {
    q: '"We could do this internally."',
    a: "You could. Most companies have been trying for 12+ months. The value is outside-in perspective, speed, and the fact that it actually gets done — in a week.",
  },
  {
    q: '"We need to think about it."',
    a: "Understood. There are 4 April slots. Two are earmarked. Happy to hold one while you decide — no obligation if it doesn't work.",
  },
];

const STRIPE_WAR_ROOM_LINK = import.meta.env.VITE_STRIPE_WAR_ROOM_LINK || null;
const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL || "https://calendly.com/krish-mindmaker";

export default function WarRoom() {
  const [consultModalOpen, setConsultModalOpen] = useState(false);

  const handleCTA = () => {
    if (STRIPE_WAR_ROOM_LINK) {
      window.open(STRIPE_WAR_ROOM_LINK, "_blank");
    } else {
      window.open(CALENDLY_URL, "_blank");
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="AI War Room — 5-Day Strategy Sprint | Mindmaker"
        description="Your AI strategy built in 5 days. A rapid sprint that produces a board-ready AI roadmap, competitive landscape, and 90-day implementation plan. $25,000 flat fee."
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
              <Zap className="w-3.5 h-3.5" />
              4 April slots — 2 remaining
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Your AI Strategy.
              <br />
              <span className="text-mint">Built in 5 Days.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
              Most companies have been "working on their AI strategy" for over a year.
              The War Room ends that.
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              A competitive landscape map. Your top 5 AI opportunities ranked by ROI.
              A 90-day implementation roadmap. A board-ready presentation.
              All in one week.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-mint text-ink hover:bg-mint/90 font-semibold text-base px-8"
                onClick={handleCTA}
              >
                Book a War Room
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-border text-foreground font-semibold text-base px-8"
                onClick={() => window.open(CALENDLY_URL, "_blank")}
              >
                <Calendar className="mr-2 w-4 h-4" />
                Schedule a 20-minute call first
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              $25,000 flat fee — no hourly, no scope creep. 100% upfront, or 50/50 on booking and delivery.
            </p>
          </motion.div>

          {/* Social proof bar */}
          <motion.div
            className="glass-card p-6 mb-16 text-center"
            initial="hidden"
            animate="show"
            custom={2}
            variants={fadeUp}
          >
            <p className="text-muted-foreground text-sm mb-2">
              Krish ran AI transformation mandates at
            </p>
            <p className="font-semibold text-base">
              Singtel · Nine Entertainment · Meliora
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Enterprise media and telco companies across Asia-Pacific, Australia, and the US.
              The War Room is that same thinking, compressed into a week.
            </p>
          </motion.div>
        </div>
      </section>

      {/* THE 5-DAY ARC */}
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
              Not a workshop. Not a framework. A real strategy — built around your business.
            </p>
          </motion.div>

          <div className="space-y-6">
            {warRoomDays.map((day, i) => (
              <motion.div
                key={day.period}
                className="glass-card p-6 flex gap-5"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <div className="shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-mint/15 flex flex-col items-center justify-center">
                    <span className="text-xs text-mint font-medium leading-none">{day.period}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{day.theme}</h3>
                  <p className="text-muted-foreground">{day.description}</p>
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
              Everything editable. Everything branded. Everything yours.
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
                custom={i * 0.5}
                variants={fadeUp}
              >
                <CheckCircle className="w-5 h-5 text-mint shrink-0 mt-0.5" />
                <span className="text-sm">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING CALLOUT */}
      <section className="section-padding bg-ink/5">
        <div className="container-width max-w-4xl">
          <motion.div
            className="glass-card p-8 md:p-12"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <h2 className="text-3xl font-bold mb-3">Investment</h2>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-5xl font-bold text-mint">$25,000</span>
                  <span className="text-muted-foreground">flat fee</span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
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
                <p className="text-xs text-muted-foreground mt-4 italic">
                  Compare: McKinsey charges $300,000+ for equivalent scope. Big-4 firms charge $100,000–$200,000 and take 3 months.
                </p>
              </div>
              <div className="flex flex-col gap-3 md:min-w-[220px]">
                <Button
                  size="lg"
                  className="bg-mint text-ink hover:bg-mint/90 font-semibold w-full"
                  onClick={handleCTA}
                >
                  Book a War Room
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

      {/* WHO IT'S FOR */}
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
                    <span className="w-4 h-4 shrink-0 mt-1 text-muted-foreground font-bold text-xs">✕</span>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* OBJECTION HANDLING */}
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
          <div className="space-y-6">
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
              If AI strategy is the conversation that keeps getting pushed — this ends that.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-mint text-ink hover:bg-mint/90 font-semibold text-base px-8"
                onClick={handleCTA}
              >
                Book a War Room — $25,000
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
      <InitialConsultModal open={consultModalOpen} onOpenChange={setConsultModalOpen} />
    </main>
  );
}
