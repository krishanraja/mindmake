import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  CheckCircle, ArrowRight, Zap, Calendar, BarChart3, Users, Shield, Clock
} from "lucide-react";
import { SEO } from "@/components/SEO";
import krishHeadshot from "@/assets/krish-headshot.png";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const onStartItems = [
  "Commercial AI audit: what capability exists, what it costs vs what it earns (Week 1)",
  "Revenue architecture: 3 commercial models built and scored for your business (Week 2)",
  "90-day commercial roadmap with milestones and owners (Week 3)",
  "Sales enablement workshop with your commercial team (Week 4)",
];

const monthlyItems = [
  "2x 60-minute commercial strategy sessions (recorded and summarised)",
  "Unlimited async advisory via email or Slack (24-hour response time)",
  "Monthly commercial brief: what is moving in your competitive landscape and what it means for your revenue model",
  "One major commercial deliverable per month: pricing update, GTM refresh, sales enablement kit, board prep, or new revenue model",
];

const quarterlyItems = [
  "Board-level commercial AI update (Krish presents if needed)",
  "Full engagement review and commercial roadmap refresh",
  "Competitive positioning update",
];

const whatKrishDoes = [
  "Owns the commercial model for your AI initiative",
  "Builds and iterates the pricing architecture",
  "Designs and refines the go-to-market strategy",
  "Trains and enables your commercial team to sell AI-enabled products",
  "Sits in the room when commercial AI decisions get made",
  "Prepares the board case for AI investment",
];

const whatKrishDoesNot = [
  "Does not manage or direct your technical or engineering team",
  "Does not own the technical AI roadmap (that is your CTO)",
  "Does not run day-to-day sales execution",
  "Does not replace your commercial leadership - he works alongside them",
];

const whoItIsFor = [
  "CEOs, CMOs, CCOs, and CPOs at media, telco, and entertainment companies",
  "Companies with AI capability and no internal owner of the commercial model",
  "Boards asking why AI investment is not showing in the revenue",
  "Companies with strong technical AI leadership and a gap on the commercial side",
  "PE-backed companies that need to show AI commercial returns within 6 months",
];

const notFor = [
  "Companies without any AI capability yet (build first, then engage)",
  "Companies with a functioning commercial AI team already in place",
  "Companies looking for technical AI leadership or engineering management",
];

const STRIPE_LINK = import.meta.env.VITE_STRIPE_CAIO_LINK || null;
const CALENDLY_URL =
  import.meta.env.VITE_CALENDLY_URL || "https://calendly.com/krish-raja/mindmaker-meeting";

const handleApply = () => window.open(CALENDLY_URL, "_blank");

const handleStripe = () => {
  if (STRIPE_LINK) {
    window.open(STRIPE_LINK, "_blank");
  } else {
    window.open(CALENDLY_URL, "_blank");
  }
};

export default function FractionalCAIO() {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Fractional Commercial Strategist - AI Revenue | Mindmaker"
        description="Your CTO owns the AI build. Who owns the revenue? Embedded commercial strategy leadership for companies with AI capability and no commercial model for it. $15,000/month."
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/10 border border-mint/20 text-foreground text-sm font-medium mb-6">
              <Zap className="w-3.5 h-3.5 text-mint" />
              Maximum 4 active engagements - 1 slot available
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Your CTO owns the build.
              <br />
              <span className="text-mint">Who owns the revenue?</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
              Most companies scaling AI have strong technical leadership and no commercial counterpart.
              The revenue model sits in a slide deck from the original business case
              and has not been touched since.
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              This engagement fills the commercial seat. Krish becomes the embedded owner
              of your AI commercial strategy - revenue model, pricing, go-to-market,
              and sales enablement. Not an outside advisor. An actual commercial owner.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-mint text-ink hover:bg-mint/90 font-semibold text-base px-8"
                onClick={handleApply}
              >
                Apply for an Engagement
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-border text-foreground font-semibold text-base px-8"
                onClick={() => window.open(CALENDLY_URL, "_blank")}
              >
                <Calendar className="mr-2 w-4 h-4" />
                Discovery call first
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              $15,000/month. Minimum 3-month engagement. Not a retainer - an embedded commercial role.
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
              16 years running commercial data, automation and AI strategy at
            </p>
            <p className="font-semibold text-base">
              Singtel - Nine Entertainment - Meliora
            </p>
            <p className="text-muted-foreground text-sm mt-2 max-w-xl mx-auto">
              Krish has been on the commercial and revenue side of AI transformation at operating scale.
              Not advising. Doing.
            </p>
            <div className="mt-6 flex flex-col items-center">
              <img
                src={krishHeadshot}
                alt="Krish Raja"
                className="w-28 h-28 rounded-full border-4 border-mint/20 object-cover mb-4"
              />
              <p className="text-sm text-muted-foreground">
                Learn more about Krish on{" "}
                <a
                  href="https://www.krishraja.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-mint hover:underline font-medium"
                >
                  his website
                </a>
                {" "}and{" "}
                <a
                  href="https://www.linkedin.com/in/krish-raja/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-mint hover:underline font-medium"
                >
                  LinkedIn
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHAT KRISH DOES AND DOES NOT DO */}
      <section className="section-padding bg-ink/5">
        <div className="container-width max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">What This Role Is (and Is Not)</h2>
            <p className="text-muted-foreground text-lg mb-10">
              This is not a fractional CTO. It is not a Chief AI Officer.
              It is the commercial counterpart to your technical AI leadership.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <h3 className="text-xl font-bold mb-5 text-mint">What Krish Owns</h3>
              <div className="space-y-3">
                {whatKrishDoes.map((item, i) => (
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
              <h3 className="text-xl font-bold mb-5 text-muted-foreground">What Krish Does Not Do</h3>
              <div className="space-y-3">
                {whatKrishDoesNot.map((item, i) => (
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

      {/* SCOPE */}
      <section className="section-padding">
        <div className="container-width max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">What Is Included</h2>
            <p className="text-muted-foreground text-lg mb-10">
              Three-month minimum. By month 3, your commercial AI strategy is live and the team owns it.
            </p>
          </motion.div>

          <div className="space-y-8">
            {[
              { title: "First 30 Days: Foundation", items: onStartItems },
              { title: "Every Month: Ongoing Commercial Leadership", items: monthlyItems },
              { title: "Every Quarter: Review and Refresh", items: quarterlyItems },
            ].map((section, i) => (
              <motion.div
                key={section.title}
                className="glass-card p-6"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                <div className="space-y-2">
                  {section.items.map((item, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-mint shrink-0 mt-1" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
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
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-5xl font-bold text-mint">$15,000</span>
                  <span className="text-muted-foreground">per month</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Minimum 3-month engagement ($45,000 total)
                </p>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0" />
                    <span>2 on-site or virtual strategy sessions per month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0" />
                    <span>Unlimited async advisory (Slack or email)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0" />
                    <span>Maximum 4 active clients at once</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  A full-time commercial strategy hire costs $250,000 to $400,000 per year plus equity.
                  This is the same commercial ownership at a fraction of the cost.
                </p>
              </div>
              <div className="flex flex-col gap-3 md:min-w-[280px] shrink-0">
                <Button
                  size="lg"
                  className="bg-mint text-ink hover:bg-mint/90 font-semibold w-full"
                  onClick={handleApply}
                >
                  Apply for an Engagement
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full font-semibold border-border text-foreground"
                  onClick={() => window.open(CALENDLY_URL, "_blank")}
                >
                  Discovery call first
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

      {/* FINAL CTA */}
      <section className="section-padding bg-ink/5">
        <div className="container-width max-w-3xl text-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              1 slot available for April.
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              If the commercial ownership of your AI initiative is the gap,
              this is how you fill it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-mint text-ink hover:bg-mint/90 font-semibold text-base px-8"
                onClick={handleApply}
              >
                Apply for an Engagement
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-border text-foreground font-semibold text-base px-8"
                onClick={() => window.open(CALENDLY_URL, "_blank")}
              >
                <Clock className="mr-2 w-4 h-4" />
                Discovery call first
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
