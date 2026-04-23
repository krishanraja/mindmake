import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, Calendar, TrendingUp } from "lucide-react";
import { SEO } from "@/components/SEO";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const openConsultModal = (preselected?: string) => {
  if (preselected) {
    // Pass via a custom detail property that InitialConsultModal can ignore safely if unused
    window.dispatchEvent(
      new CustomEvent("openConsultModal", { detail: { preselected } })
    );
  } else {
    window.dispatchEvent(new CustomEvent("openConsultModal"));
  }
};

const signalSessionOutcomes = [
  "Commercial Narrative document (15-20 pages, delivered within 48 hours)",
  "Commercial positioning framework (2 pages, ready for your team)",
  "Sales narrative and objection handling guide",
  "Pricing model sketch with 2-3 packaging options",
  "30-day commercial roadmap with owners and milestones",
];

const revenueArchitectureOutcomes = [
  "Commercial strategy document (30-40 pages, client-branded)",
  "Product marketing framework: positioning, messaging, competitive differentiation",
  "Revenue model with multiple pricing scenarios, tested against your business reality",
  "Packaging and tiering structure (2-3 options, ready to ship)",
  "90-day GTM playbook: channels, sales process, enablement materials",
  "Product roadmap aligned with commercial milestones (not just technical milestones)",
  "Board-ready presentation deck (Krish presents if requested)",
  "30-day follow-up strategy session included",
];

const comparisonRows = [
  {
    label: "Duration",
    signal: "1 day intensive + 48h delivery",
    revenue: "30 days (4-5 calendar weeks)",
  },
  {
    label: "Price",
    signal: "$15,000",
    revenue: "$60,000 to $100,000",
  },
  {
    label: "Format",
    signal: "1 intensive session, written delivery",
    revenue: "Structured 30-day engagement, multi-session",
  },
  {
    label: "Best for",
    signal: "Rapid executive alignment on commercial positioning",
    revenue: "Complete commercial strategy and board-ready narrative",
  },
  {
    label: "Primary output",
    signal: "The Commercial Narrative (15-20 pages)",
    revenue: "Full commercial strategy + GTM playbook + board deck",
  },
];

const faqs = [
  {
    q: "How is this different from consulting?",
    a: "Consultants present findings from research. I work from 16 years of pattern recognition on what wins commercially with AI and what doesn't. The output is a commercial strategy your team can execute on Monday, not a slide deck.",
  },
  {
    q: "Why no ongoing retainer?",
    a: "Mindmaker sells sprints and blueprints, not calendar hours. Every enterprise engagement has a fixed scope and a finish line. If you need someone to run commercial operations long-term, we'll talk about who that should be, but it won't be me on payroll.",
  },
  {
    q: "Can our engineering team be involved?",
    a: "Yes. The best outcomes happen when commercial and technical leadership are in the same room. The Revenue Architecture engagement specifically bridges both.",
  },
  {
    q: "What happens after the engagement ends?",
    a: "You own the outputs (documents, frameworks, decks), editable and ready to execute. A 30-day follow-up session is included in The Revenue Architecture. Beyond that, a Signal Session can re-engage on a specific follow-up.",
  },
  {
    q: "How fast can we start?",
    a: "Signal Session typically books within 2-3 weeks. Revenue Architecture starts at the next monthly cohort. Book a call to check current availability.",
  },
];

export default function Enterprise() {
  useEffect(() => {
    // Scroll to hash anchor if present
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Enterprise: AI commercialization sprints"
        description="Two sprints. Fixed scope. Board-ready output. The Signal Session ($15k) aligns your team fast. The Revenue Architecture ($60-100k) builds the complete commercial strategy."
        canonical="/enterprise"
        ogType="website"
      />
      <Navigation />

      {/* HERO */}
      <section className="section-padding pt-32 bg-ink">
        <div className="container-width max-w-4xl">
          <motion.div
            className="text-center"
            initial="hidden"
            animate="show"
            variants={fadeUp}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/10 border border-mint/20 text-mint text-xs font-bold uppercase tracking-[0.18em] mb-6">
              Enterprise
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white text-balance">
              Your AI capabilities,
              <br />
              <span className="text-mint">translated into revenue.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              You have the tech. I give you the story, the pricing, and the go-to-market engine that sells it. Two sprints. Fixed scope. Board-ready output.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-mint text-ink hover:bg-mint/90 font-bold px-8"
                onClick={() => openConsultModal("revenue-architecture")}
              >
                Book a call <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 font-bold px-8"
              >
                <a href="#engagements">See both engagements</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ENGAGEMENTS */}
      <section id="engagements" className="section-padding scroll-mt-24">
        <div className="container-width max-w-5xl space-y-10">
          {/* Signal Session */}
          <motion.article
            id="signal-session"
            className="glass-card editorial-card p-8 md:p-12 border border-border/50 scroll-mt-24"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
              <div className="flex-1">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-3">
                  The Signal Session
                </div>
                <div className="flex flex-wrap items-baseline gap-3 mb-4">
                  <span className="text-4xl font-bold">$15,000</span>
                  <span className="text-sm text-muted-foreground">
                    1 day intensive + 48h written delivery
                  </span>
                </div>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
                  You've built the AI capabilities. Now nobody knows how to sell them. In one intensive day, we untangle the tech, align your executive team, and build the exact commercial narrative your buyers will actually understand.
                </p>
                <div className="mb-6">
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground mb-3">
                    You walk out with
                  </div>
                  <ul className="space-y-2.5">
                    {signalSessionOutcomes.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-mint shrink-0 mt-1" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                  <strong className="text-foreground">Best for:</strong> Teams with AI capabilities needing rapid alignment before committing to a larger build. Often used as the entry point before a Revenue Architecture engagement.
                </p>
                <p className="text-xs text-muted-foreground">
                  Payment on kickoff, final on delivery.
                </p>
              </div>

              <div className="lg:w-56 shrink-0 flex lg:flex-col gap-3">
                <Button
                  size="lg"
                  className="flex-1 lg:w-full bg-ink dark:bg-mint text-white dark:text-ink hover:opacity-90 font-bold"
                  onClick={() => openConsultModal("signal-session")}
                >
                  Book The Signal Session
                </Button>
              </div>
            </div>
          </motion.article>

          {/* Revenue Architecture */}
          <motion.article
            id="revenue-architecture"
            className="glass-card editorial-card p-8 md:p-12 border border-border/50 scroll-mt-24"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
              <div className="flex-1">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-3">
                  The Revenue Architecture
                </div>
                <div className="flex flex-wrap items-baseline gap-3 mb-4">
                  <span className="text-4xl font-bold">From $60,000</span>
                  <span className="text-sm text-muted-foreground">
                    30 days intensive (4-5 calendar weeks)
                  </span>
                </div>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
                  Turning your AI capabilities into an actual revenue stream. A 30-day intensive to build your pricing models, packaging, go-to-market playbook, and the product marketing architecture that commercializes your AI investment. Informed by someone operating a 14-agent AI business in production, not theorizing about one. <a href="/operator" className="text-mint-dark dark:text-mint font-semibold hover:underline">See how I operate →</a>
                </p>
                <div className="mb-6">
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground mb-3">
                    You walk out with
                  </div>
                  <ul className="space-y-2.5">
                    {revenueArchitectureOutcomes.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-mint shrink-0 mt-1" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                  <strong className="text-foreground">Best for:</strong> Companies with strong AI capabilities needing a complete commercial strategy and board-ready narrative. Pricing varies with scope, team size, and depth of existing commercial infrastructure.
                </p>
                <p className="text-xs text-muted-foreground mb-1">
                  $60,000 to $100,000, scope-dependent. Final scope and price determined during intake call.
                </p>
                <p className="text-xs text-muted-foreground">
                  Payment on kickoff, final on delivery.
                </p>
              </div>

              <div className="lg:w-56 shrink-0 flex lg:flex-col gap-3">
                <Button
                  size="lg"
                  className="flex-1 lg:w-full bg-ink dark:bg-mint text-white dark:text-ink hover:opacity-90 font-bold"
                  onClick={() => openConsultModal("revenue-architecture")}
                >
                  Book The Revenue Architecture
                </Button>
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      {/* SCOPE BOUNDARY */}
      <section className="section-padding bg-mint/5 border-y border-mint/20">
        <div className="container-width max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What I do, and what I don't.</h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
              I build the commercial strategy, positioning, and GTM architecture. I deliver the blueprint, the pricing, and the narrative. I don't run your sales team, I don't embed as a fractional executive, and I don't do ongoing retainer work. Every engagement has a fixed scope and a finish line. If you need someone to run commercial operations long-term, we'll talk about what that looks like, but it won't be me on payroll.
            </p>
          </motion.div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="section-padding">
        <div className="container-width max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Side by side.</h2>
            <p className="text-muted-foreground text-lg mb-10">
              The Signal Session is the starting point. The Revenue Architecture is the full build.
            </p>
          </motion.div>

          <div className="rounded-2xl border border-border/50 overflow-hidden">
            <div className="grid grid-cols-3 bg-muted/50 p-4 border-b border-border/50">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                &nbsp;
              </div>
              <div className="text-sm font-bold">The Signal Session</div>
              <div className="text-sm font-bold">The Revenue Architecture</div>
            </div>
            {comparisonRows.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-3 p-4 gap-4 ${
                  i < comparisonRows.length - 1 ? "border-b border-border/40" : ""
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  {row.label}
                </div>
                <div className="text-sm">{row.signal}</div>
                <div className="text-sm">{row.revenue}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-muted/30">
        <div className="container-width max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-10">Questions.</h2>
          </motion.div>
          <div className="space-y-5">
            {faqs.map((q, i) => (
              <motion.div
                key={i}
                className="glass-card editorial-card p-6 border border-border/50"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <p className="font-bold mb-3">{q.q}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{q.a}</p>
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
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Not sure which fits?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Book a 30-minute intake call. We'll scope fit, price, and start date in one conversation.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-mint to-emerald-400 text-ink hover:opacity-90 font-bold px-10 py-6 text-base"
              onClick={() => openConsultModal()}
            >
              Book a call <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
