import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  CheckCircle, ArrowRight, Clock, Calendar, TrendingUp, Sparkles
} from "lucide-react";
import { SEO } from "@/components/SEO";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const sessionArc = [
  {
    hour: "Hour 1",
    theme: "Commercial Positioning",
    description:
      "What you have, what it is worth, and where it sits competitively. We cut through the technical noise and build a commercial picture that a buyer would actually respond to.",
  },
  {
    hour: "Hour 2",
    theme: "Market Strategy",
    description:
      "Who is this actually for? What do they value? What are they comparing you against? We design the product marketing framework that differentiates you in a market where everyone claims AI capabilities.",
  },
  {
    hour: "Hour 3",
    theme: "The Sales Story",
    description:
      "The commercial narrative your team needs. Problem, solution, value, proof. How to handle the objections. What the conversation should sound like. This is where product marketing meets revenue.",
  },
  {
    hour: "Hour 4",
    theme: "90-Day Roadmap",
    description:
      "Three specific commercial plays for the next 30 days. Revenue milestones for 60 and 90. Each with a clear owner, timeline, and success metric. Not a strategy deck. An execution plan.",
  },
];

const deliverables = [
  "Commercial positioning framework (2 pages, ready for your team)",
  "Product marketing strategy with competitive differentiation",
  "Pricing model with 2-3 packaging options",
  "Sales narrative and objection handling guide",
  "90-day commercial roadmap with owners and milestones",
  "Comprehensive written strategy (15-20 pages, delivered within 48 hours)",
];

const goodFor = [
  "Leadership teams who want strategic input on AI commercial positioning before committing to a larger engagement",
  "Companies launching AI-powered products and wanting world-class product marketing from day one",
  "Commercial teams who need to articulate AI value to buyers in competitive markets",
  "Founders who have built strong AI products and want to position them to win",
  "Organisations preparing for board-level AI investment conversations",
];

const STRIPE_DEPOSIT = import.meta.env.VITE_STRIPE_SPRINT_DEPOSIT || null;
const CALENDLY_URL =
  import.meta.env.VITE_CALENDLY_URL || "https://calendly.com/krish-raja/mindmaker-meeting";

const handleDeposit = () => {
  if (STRIPE_DEPOSIT) {
    window.open(STRIPE_DEPOSIT, "_blank");
  } else {
    window.open(`${CALENDLY_URL}?source=sprint-deposit`, "_blank");
  }
};

const handleExplore = () => {
  window.open(CALENDLY_URL, "_blank");
};

export default function StrategyDay() {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="AI Positioning Sprint | Mindmaker"
        description="Great AI products still need great positioning. One day to design the commercial strategy and product marketing your AI capabilities deserve. $10,000."
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
              <Clock className="w-3.5 h-3.5" />
              April dates available
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
              In a world full of AI products,
              <br />
              <span className="text-mint">positioning is the only real advantage.</span>
            </h1>
            <p className="text-xl text-white/70 mb-4 max-w-2xl mx-auto">
              Great AI capabilities still need great commercial strategy.
              One day to build both.
            </p>
            <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10">
              Four hours with someone who has spent 15 years learning the patterns
              of what wins commercially with AI - and what doesn't. You leave with
              a positioning framework, product marketing strategy, and a 90-day
              commercial roadmap your team can execute immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-mint text-ink hover:bg-mint/90 font-semibold text-base px-8"
                onClick={handleDeposit}
              >
                Book Your Sprint
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 font-semibold text-base px-8"
                onClick={handleExplore}
              >
                <Calendar className="mr-2 w-4 h-4" />
                Check availability
              </Button>
            </div>
            <p className="text-sm text-white/40 mt-4">
              $2,000 deposit to book. $8,000 balance on completion. Virtual or NYC in-person.
            </p>
          </motion.div>

          {/* Credibility */}
          <motion.div
            className="rounded-lg border border-white/10 bg-white/5 p-6 mb-16 text-center"
            initial="hidden"
            animate="show"
            custom={2}
            variants={fadeUp}
          >
            <p className="font-semibold text-base mb-2 text-white">
              Product marketing is the multiplier most AI companies are missing.
            </p>
            <p className="text-white/60 text-sm max-w-xl mx-auto">
              When every competitor has AI capabilities, the company that positions
              best wins. Krish brings 15 years of commercial pattern recognition
              and master product marketing to help you do exactly that.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SESSION ARC */}
      <section className="section-padding bg-muted">
        <div className="container-width max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">The 4-hour arc</h2>
            <p className="text-muted-foreground text-lg mb-10">
              Positioning, product marketing, sales story, and execution plan.
            </p>
          </motion.div>
          <div className="space-y-5">
            {sessionArc.map((hour, i) => (
              <motion.div
                key={hour.hour}
                className="glass-card p-6 flex gap-5"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <div className="shrink-0 w-14 h-14 rounded-xl bg-ink text-white flex flex-col items-center justify-center">
                  <span className="text-xs font-medium">{hour.hour}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{hour.theme}</h3>
                  <p className="text-muted-foreground text-sm">{hour.description}</p>
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
              Same-day output plus comprehensive write-up within 48 hours.
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

      {/* PRICING */}
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
                  <span className="text-4xl font-bold">$2,000</span>
                  <span className="text-muted-foreground">deposit to book</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Total investment: $10,000. Balance due on completion.
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0" />
                    <span>4-hour intensive session</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0" />
                    <span>Comprehensive written deliverables within 48 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0" />
                    <span>Virtual or NYC in-person</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 md:min-w-[220px]">
                <Button
                  size="lg"
                  className="bg-mint text-ink hover:bg-mint/90 font-semibold w-full"
                  onClick={handleDeposit}
                >
                  Book Your Sprint
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full font-semibold"
                  onClick={handleExplore}
                >
                  Check availability
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* GOOD FOR */}
      <section className="section-padding">
        <div className="container-width max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-mint" />
              Designed for
            </h2>
          </motion.div>
          <div className="space-y-3">
            {goodFor.map((item, i) => (
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
      <section className="section-padding bg-muted">
        <div className="container-width max-w-3xl text-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              April dates available.
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              $2,000 deposit books your date. The rest of the investment comes
              after you have seen the value.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-mint text-ink hover:bg-mint/90 font-semibold text-base px-8"
                onClick={handleDeposit}
              >
                Book Your Sprint
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="font-semibold text-base px-8"
                onClick={handleExplore}
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
