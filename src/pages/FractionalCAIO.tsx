import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Zap, Calendar, MessageSquare, BarChart3, Users, Shield } from "lucide-react";
import { SEO } from "@/components/SEO";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" } }),
};

const onStartItems = [
  "Full AI maturity assessment (Week 1)",
  "90-day roadmap with prioritised use cases (Week 2–3)",
  "Team enablement workshop (Week 4)",
];

const monthlyItems = [
  "2x 60-minute strategy sessions (recorded and summarised)",
  "Unlimited async advisory via email or Slack (24-hour response)",
  "Monthly AI Landscape Brief — what's moving in your sector and what it means for you",
  "One major deliverable per month (vendor eval, policy draft, roadmap update, or board prep)",
];

const quarterlyItems = [
  "Board-level AI update presentation (Krish presents if needed)",
  "Full engagement review and roadmap refresh",
];

const ongoingItems = [
  "Escalation calls (up to 2/month, 30 minutes each)",
  "Vendor demos and negotiation support",
  "Hiring input for AI and data roles",
];

const whoItIsFor = [
  "CEOs and CMOs at media, telco, and entertainment companies",
  "Companies with $100M–$1B revenue that need AI leadership but can't justify a $400K hire",
  "Boards asking the AI question with no clear internal owner",
  "New CDOs or CMOs who need to show AI progress within 90 days",
  "PE-backed companies under pressure to demonstrate AI value creation",
];

const highFitSignals = [
  "Company has made public commitments to AI but has no execution plan",
  "Competitor just announced a significant AI initiative",
  "AI keeps appearing in board meetings without a satisfying answer",
  "You've hired tools but not strategy",
];

const notFor = [
  "Companies with existing AI leadership and a functioning roadmap",
  "Companies wanting technical AI development or product engineering",
];

const STRIPE_CAIO_LINK = import.meta.env.VITE_STRIPE_CAIO_LINK || null;
const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL || "https://calendly.com/krish-mindmaker";

export default function FractionalCAIO() {
  const handleCTA = () => {
    window.open(CALENDLY_URL, "_blank");
  };

  const handleStripe = () => {
    if (STRIPE_CAIO_LINK) {
      window.open(STRIPE_CAIO_LINK, "_blank");
    } else {
      window.open(CALENDLY_URL, "_blank");
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Fractional CAIO — Chief AI Officer | Mindmaker"
        description="The AI leadership your business needs, without the $400K price tag. A fractional Chief AI Officer for media, telco, and entertainment companies. $15,000/month."
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
              Maximum 4 active engagements — 1 slot available
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              The AI Leadership
              <br />
              <span className="text-mint">Your Business Needs.</span>
            </h1>
            <p className="text-2xl font-medium mb-4">
              Without the $400,000 price tag.
            </p>
            <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
              A full-time Chief AI Officer costs $350,000–$500,000 per year plus equity.
              Your Fractional CAIO brings the same strategic leadership at 10% of the cost.
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Not an outside advisor who turns up for quarterly reviews.
              An embedded strategic leader — in your Slack, on your calls,
              thinking about your AI problems between sessions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-mint text-ink hover:bg-mint/90 font-semibold text-base px-8"
                onClick={handleCTA}
              >
                Apply for a CAIO Engagement
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-border text-foreground font-semibold text-base px-8"
                onClick={() => window.open(CALENDLY_URL, "_blank")}
              >
                <Calendar className="mr-2 w-4 h-4" />
                20-minute discovery call
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              $15,000/month · Minimum 3-month engagement ($45,000 total)
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
              AI transformation mandates delivered at
            </p>
            <p className="font-semibold text-base">
              Singtel · Nine Entertainment · Meliora
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Not an outside advisor who studied these companies. Someone who actually ran transformation
              mandates inside them — P&amp;L ownership, board accountability, and all.
            </p>
          </motion.div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="section-padding bg-ink/5">
        <div className="container-width max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">What's Included</h2>
            <p className="text-muted-foreground text-lg mb-10">
              Three months. Real outcomes. Then you decide whether to continue or bring the function in-house.
            </p>
          </motion.div>

          <div className="space-y-6">
            {/* On Start */}
            <motion.div
              className="glass-card p-8"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-mint/15 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-mint" />
                </div>
                <h3 className="text-xl font-semibold">On Engagement Start</h3>
              </div>
              <div className="space-y-3">
                {onStartItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Monthly */}
            <motion.div
              className="glass-card p-8"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={1}
              variants={fadeUp}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-mint/15 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-mint" />
                </div>
                <h3 className="text-xl font-semibold">Monthly</h3>
              </div>
              <div className="space-y-3">
                {monthlyItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quarterly */}
            <motion.div
              className="glass-card p-8"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={2}
              variants={fadeUp}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-mint/15 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-mint" />
                </div>
                <h3 className="text-xl font-semibold">Quarterly</h3>
              </div>
              <div className="space-y-3">
                {quarterlyItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Ongoing */}
            <motion.div
              className="glass-card p-8"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={3}
              variants={fadeUp}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-mint/15 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-mint" />
                </div>
                <h3 className="text-xl font-semibold">Ongoing Availability</h3>
              </div>
              <div className="space-y-3">
                {ongoingItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
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
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-5xl font-bold text-mint">$15,000</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground text-sm mb-5">
                  Minimum 3-month engagement ($45,000 total commitment)
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0" />
                    <span>Simple agreement — no 12-page SOW</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0" />
                    <span>Stripe link, one signature, we start</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0" />
                    <span>Maximum 4 active engagements at once</span>
                  </div>
                </div>
                <div className="mt-5 p-4 rounded-xl bg-ink/5 text-xs text-muted-foreground">
                  <strong className="text-foreground">Market context:</strong> A full-time CAIO in the US costs $350,000–$500,000 base + equity.
                  Fractional CAIO market rates run $15,000–$30,000/month (Umbrex, Hyperion Consulting, 2026).
                  This engagement is priced at the market floor.
                </div>
              </div>
              <div className="flex flex-col gap-3 md:min-w-[220px]">
                <Button
                  size="lg"
                  className="bg-mint text-ink hover:bg-mint/90 font-semibold w-full"
                  onClick={handleCTA}
                >
                  Apply for CAIO Engagement
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full font-semibold"
                  onClick={() => window.open(CALENDLY_URL, "_blank")}
                >
                  Discovery call first
                </Button>
                {STRIPE_CAIO_LINK && (
                  <Button
                    size="lg"
                    variant="ghost"
                    className="w-full text-mint font-semibold"
                    onClick={handleStripe}
                  >
                    Pay and start immediately
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="section-padding bg-ink/5">
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
              <div className="space-y-3 mb-8">
                {whoItIsFor.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0 mt-1" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <h3 className="text-lg font-semibold mb-4">High-Fit Signals</h3>
              <div className="space-y-3">
                {highFitSignals.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-mint/5 border border-mint/15">
                    <Zap className="w-4 h-4 text-mint shrink-0 mt-0.5" />
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
              <div className="space-y-3 mb-10">
                {notFor.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-muted-foreground font-bold text-xs mt-1 w-4 shrink-0">✕</span>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>

              <div className="glass-card p-6">
                <h3 className="font-semibold mb-3">Natural Next Step</h3>
                <p className="text-sm text-muted-foreground">
                  Many companies start with an{" "}
                  <a href="/war-room" className="text-mint underline underline-offset-2">
                    AI War Room
                  </a>{" "}
                  to get a rapid strategy built, then move into the Fractional CAIO
                  for ongoing leadership. The War Room covers the upfront sprint;
                  the CAIO covers everything that comes after.
                </p>
              </div>
            </motion.div>
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
              1 slot available in April.
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              If the AI leadership gap exists at your company, the conversation is worth having.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-mint text-ink hover:bg-mint/90 font-semibold text-base px-8"
                onClick={handleCTA}
              >
                Apply — $15,000/month
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="font-semibold text-base px-8"
                onClick={() => window.open(CALENDLY_URL, "_blank")}
              >
                <Calendar className="mr-2 w-4 h-4" />
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
