import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  CheckCircle, ArrowRight, Clock, Users, Shield, Calendar, Sparkles, TrendingUp
} from "lucide-react";
import { SEO } from "@/components/SEO";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const phases = [
  {
    period: "Before we start",
    theme: "Pattern Analysis",
    description:
      "Your team completes a focused commercial assessment. We run a competitive positioning audit and map your situation against patterns from 15 years of similar AI commercialisation efforts. By the time we sit down together, we already know what has worked and what has failed in businesses like yours.",
  },
  {
    period: "Days 1-3",
    theme: "Commercial Archaeology",
    description:
      "We reverse-engineer the commercial thinking behind what your team has built. Which assumptions still hold? Where has the competitive landscape shifted? What would you build differently if commercial success was the starting point, not an afterthought?",
  },
  {
    period: "Days 4-7",
    theme: "Strategy and Positioning",
    description:
      "This is where the product marketing expertise matters most. We design the commercial strategy, revenue model, and competitive positioning for your AI investment. Not just how to sell what you have. How to position it to win in a market where everyone will have AI capabilities.",
  },
  {
    period: "Days 8-10",
    theme: "Execution Blueprint",
    description:
      "Go-to-market strategy based on predictive market analysis. Sales enablement for both technical and commercial teams. Product roadmap aligned with commercial goals. Board-ready presentation with financial projections and a 90-day execution plan.",
  },
];

const deliverables = [
  "Commercial strategy document (30-40 pages, comprehensive and client-branded)",
  "Product marketing framework: positioning, messaging, competitive differentiation",
  "Revenue model with multiple scenarios tested against your business",
  "Go-to-market playbook: channels, sales process, enablement materials",
  "Product roadmap aligned with commercial goals (not just technical milestones)",
  "Financial projections: 12-month outlook with investment requirements",
  "Board presentation deck (Krish presents if requested)",
  "30-day follow-up strategy session included",
];

const signals = [
  "You have strong AI capabilities and suspect you are not approaching commercialisation strategically",
  "Your engineering team is excellent but the commercial story is not keeping pace",
  "You want to get ahead of the competition wave before AI capabilities become commoditised",
  "Your technical team and commercial team speak different languages about AI",
  "You need a board-ready commercial strategy and product marketing framework",
];

const notFor = [
  "Companies still in early AI experimentation",
  "Organisations with mature, working AI commercial strategies",
  "Companies looking for technical AI implementation support",
];

const questions = [
  {
    q: "How is this different from a consulting engagement?",
    a: "Most consultants research your industry and present findings. I bring 15 years of pattern recognition from similar situations - I have seen what works, what fails, and why. Combined with master-level product marketing, the output is a competitive commercial strategy, not a research report.",
  },
  {
    q: "What if we are not sure this is the right time?",
    a: "The $5,000 deposit secures your slot while you get internal alignment. If you decide not to proceed, we will have a conversation about it. The deposit model exists to reduce friction, not create pressure.",
  },
  {
    q: "Can our engineering team be involved?",
    a: "Absolutely. One of the unique things about this process is that it bridges technical and commercial thinking. The best outcomes happen when both teams are in the room.",
  },
];

const STRIPE_LINK = import.meta.env.VITE_STRIPE_WAR_ROOM_LINK || null;
const CALENDLY_URL =
  import.meta.env.VITE_CALENDLY_URL || "https://calendly.com/krish-raja/mindmaker-meeting";

const handleBook = () => {
  window.open(STRIPE_LINK || CALENDLY_URL, "_blank");
};

const handleExplore = () => {
  window.open(CALENDLY_URL, "_blank");
};

export default function WarRoom() {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="AI Commercial Accelerator | Mindmaker"
        description="Most AI investments are built first and commercialised later. The companies that win do it backwards. 10-day intensive commercial strategy from someone with 15 years of pattern recognition."
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
              2 April slots remaining
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white text-balance">
              Most companies build AI first,
              <br />
              <span className="text-mint">then figure out how to make money.</span>
            </h1>
            <p className="text-xl text-white/70 mb-4 max-w-2xl mx-auto text-balance">
              The ones that win do it the other way around.
            </p>
            <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10 text-balance">
              In 10 days, I reverse-engineer your AI investment and build the commercial strategy it should have had from day one. Revenue architecture, product marketing, competitive positioning, and an execution blueprint your board will actually back.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-mint text-ink hover:bg-mint/90 font-semibold text-base px-8"
                onClick={handleBook}
              >
                Secure Your Slot
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 font-semibold text-base px-8"
                onClick={handleExplore}
              >
                <Calendar className="mr-2 w-4 h-4" />
                Explore fit in 20 minutes
              </Button>
            </div>
            <p className="text-sm text-white/40 mt-4">
              $5,000 deposit to hold your slot. Balance on completion.
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
                  15 years of commercial pattern recognition
                </p>
                <p className="text-white/60 text-sm">
                  Krish has spent 15 years on the commercial side of data, automation, and AI
                  at Singtel, Nine Entertainment, and across media and telco at scale.
                  Not studying AI strategy from the outside. Building commercial success
                  (and learning from commercial failures) on the inside.
                </p>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-base mb-2 text-white">
                  Product marketing is the multiplier
                </p>
                <p className="text-white/60 text-sm">
                  In a world where every company will have AI capabilities,
                  knowing what to build is only half the equation. Knowing how to
                  position it to win in market is the other half. Krish brings both.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* THE PROCESS */}
      <section className="section-padding bg-muted">
        <div className="container-width max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">How it works</h2>
            <p className="text-muted-foreground text-lg mb-10">
              10 days. Commercial strategy, product marketing, and execution blueprint.
            </p>
          </motion.div>
          <div className="space-y-5">
            {phases.map((phase, i) => (
              <motion.div
                key={phase.period}
                className="glass-card p-6 flex gap-5"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <div className="shrink-0 w-16 h-16 rounded-xl bg-ink text-white flex flex-col items-center justify-center">
                  <span className="text-[10px] font-medium text-center leading-tight px-1">
                    {phase.period}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{phase.theme}</h3>
                  <p className="text-muted-foreground text-sm">{phase.description}</p>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-3">What you walk away with</h2>
            <p className="text-muted-foreground text-lg mb-10">
              Everything yours. Editable. Ready to execute.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-4">
            {deliverables.map((item, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl bg-muted"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i * 0.3}
                variants={fadeUp}
              >
                <CheckCircle className="w-5 h-5 text-mint shrink-0 mt-0.5" />
                <span className="text-sm">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INVESTMENT */}
      <section className="section-padding bg-muted">
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
                  <span className="text-muted-foreground">deposit to secure your slot</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Total investment: $25,000. Balance due on completion.
                </p>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0" />
                    <span>$5,000 deposit holds your April slot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0" />
                    <span>$20,000 balance after you have seen the output</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0" />
                    <span>30-day follow-up session included at no extra cost</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 md:min-w-[220px]">
                <Button
                  size="lg"
                  className="bg-mint text-ink hover:bg-mint/90 font-semibold w-full"
                  onClick={handleBook}
                >
                  Secure Your Slot
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full font-semibold"
                  onClick={handleExplore}
                >
                  Explore fit first
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* GOOD FIT */}
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
                <TrendingUp className="w-5 h-5 text-mint" />
                Good fit signals
              </h2>
              <div className="space-y-3">
                {signals.map((item, i) => (
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
                Not the right fit
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

      {/* QUESTIONS */}
      <section className="section-padding bg-muted">
        <div className="container-width max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl font-bold mb-10">Questions</h2>
          </motion.div>
          <div className="space-y-5">
            {questions.map((q, i) => (
              <motion.div
                key={i}
                className="glass-card p-6"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <p className="font-semibold mb-3">{q.q}</p>
                <p className="text-muted-foreground text-sm">{q.a}</p>
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
              2 April slots remaining.
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              $5,000 deposit secures yours while you get internal alignment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-mint text-ink hover:bg-mint/90 font-semibold text-base px-8"
                onClick={handleBook}
              >
                Secure Your Slot
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="font-semibold text-base px-8"
                onClick={handleExplore}
              >
                <Clock className="mr-2 w-4 h-4" />
                Explore fit in 20 minutes
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
