import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  CheckCircle, ArrowRight, Clock, MapPin, FileText, Calendar, Users
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

const sessionArc = [
  {
    hour: "Hour 1",
    theme: "What You Have",
    description:
      "Plain-language audit of your AI capability. What exists, what it can do, and what customer or commercial problems it actually solves. Honest, not promotional.",
  },
  {
    hour: "Hour 2",
    theme: "Who Buys It and Why",
    description:
      "Customer and buyer segmentation. Who will pay for this, what they value, what they are comparing you against, and how much they will pay. Grounded in your market, not generic frameworks.",
  },
  {
    hour: "Hour 3",
    theme: "The Sales Story",
    description:
      "The commercial narrative your team needs: problem, solution, value, and proof. How to handle the top 5 objections. What the demo should show. What the call-to-action is.",
  },
  {
    hour: "Hour 4",
    theme: "First 3 Revenue Plays",
    description:
      "Specific commercial actions to take in the next 30 days. Not a roadmap. Three specific plays, each with a clear owner, a clear action, and a clear success metric.",
  },
];

const beforeSession = [
  "AI capability questionnaire (20 minutes, completed by your team)",
  "Competitive brief: who else is in this space and how they are positioned commercially",
  "Optional 30-minute pre-call with Krish",
];

const deliverables = [
  "Sales story framework (1-2 pages, ready for your commercial team)",
  "Pricing model with 2-3 packaging options",
  "Competitive positioning summary",
  "First 3 revenue plays with owners and success metrics",
  "Written session summary (8-10 pages, delivered within 48 hours)",
  "Objection handling guide for your top buyer persona",
];

const goodFor = [
  "Commercial teams who have AI capability and cannot explain it to prospects",
  "Founders preparing to sell an AI-enabled product for the first time",
  "Leadership teams preparing for a board presentation on AI revenue",
  "Companies where AI is built but the sales motion does not exist yet",
  "New hires who need to get up to speed on the commercial AI story fast",
];

const STRIPE_LINK = import.meta.env.VITE_STRIPE_STRATEGY_DAY_LINK || null;
const CALENDLY_URL =
  import.meta.env.VITE_CALENDLY_URL || "https://calendly.com/krish-raja/mindmaker-meeting";

const handleCTA = () => {
  if (STRIPE_LINK) {
    window.open(STRIPE_LINK, "_blank");
  } else {
    window.open(CALENDLY_URL, "_blank");
  }
};

export default function StrategyDay() {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="AI Revenue Day - Sales Enablement Intensive | Mindmaker"
        description="You built the AI product. Your sales team cannot sell it. One day fixes that. Positioning, pricing, sales story, and first 3 revenue plays. $7,500."
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
              April dates available - virtual or NYC in-person
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              You built the AI product.
              <br />
              <span className="text-mint">Your team cannot sell it.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
              One day. Positioning, pricing, sales story, and your first 3 revenue plays.
              Written up and in your inbox within 48 hours.
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Four hours with your commercial leadership team. By the end, your team
              can explain what you have, who it is for, and why someone should buy it.
              That is the whole problem, solved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-mint text-ink hover:bg-mint/90 font-semibold text-base px-8"
                onClick={handleCTA}
              >
                Book an AI Revenue Day
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-border text-foreground font-semibold text-base px-8"
                onClick={() => window.open(CALENDLY_URL, "_blank")}
              >
                <Calendar className="mr-2 w-4 h-4" />
                Check availability
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              $7,500. 100% upfront at booking. Virtual or NYC in-person.
            </p>
          </motion.div>

          {/* Credibility */}
          <motion.div
            className="glass-card p-6 mb-16 text-center"
            initial="hidden"
            animate="show"
            custom={2}
            variants={fadeUp}
          >
            <p className="text-muted-foreground text-sm mb-2">
              Krish spent 16 years on the commercial side of AI transformation at
            </p>
            <p className="font-semibold text-base">
              Singtel - Nine Entertainment - Meliora
            </p>
            <p className="text-muted-foreground text-sm mt-2 max-w-xl mx-auto">
              The AI Revenue Day distills that experience into a single focused session
              for your commercial team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* BEFORE SESSION */}
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
              No session starts cold.
            </p>
          </motion.div>
          <div className="space-y-3">
            {beforeSession.map((item, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl bg-ink/5"
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

      {/* SESSION ARC */}
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
              Commercial clarity built in a single focused session.
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
                <div className="shrink-0 w-14 h-14 rounded-xl bg-mint/15 flex flex-col items-center justify-center">
                  <span className="text-xs text-mint font-medium text-center leading-tight px-1">
                    {hour.hour}
                  </span>
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
      <section className="section-padding bg-ink/5">
        <div className="container-width max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">What You Walk Away With</h2>
            <p className="text-muted-foreground text-lg mb-10">
              Same day and within 48 hours.
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
                </div>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0" />
                    <span>100% upfront at booking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0" />
                    <span>Virtual or NYC in-person</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0" />
                    <span>Written deliverables within 48 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0" />
                    <span>Up to 6 people from your team can join</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 md:min-w-[220px]">
                <Button
                  size="lg"
                  className="bg-mint text-ink hover:bg-mint/90 font-semibold w-full"
                  onClick={handleCTA}
                >
                  Book - $7,500
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

      {/* WHO IT IS GOOD FOR */}
      <section className="section-padding bg-ink/5">
        <div className="container-width max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-mint" />
              Good For
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
                custom={i * 0.3}
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
              April dates available.
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              If your commercial team cannot explain what you have built,
              one day fixes that.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-mint text-ink hover:bg-mint/90 font-semibold text-base px-8"
                onClick={handleCTA}
              >
                Book - $7,500
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
