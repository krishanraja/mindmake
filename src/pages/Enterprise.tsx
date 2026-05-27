import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import ProductExpandSection from "@/components/ProductExpandSection";
import type { ProductExpandCardData } from "@/components/ProductExpandCard";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const openScopingModal = (preselected?: string) => {
  window.dispatchEvent(
    new CustomEvent("openScopingModal", {
      detail: {
        source_page: "/enterprise",
        ...(preselected ? { preselected } : {}),
      },
    }),
  );
};

const goToDiagnostic = () => {
  try {
    (window as unknown as { plausible?: (e: string, o?: { props?: object }) => void })
      .plausible?.("diagnostic_secondary_click", { props: { page: "/enterprise" } });
  } catch {
    /* analytics optional */
  }
  window.location.href = "/leaders";
};

const ENTERPRISE_TRIO_LINE =
  "What gets mapped together: your product strategy, your team's capability, your own fluency as a leader. Most engagements skip this part because it's invisible until you hit a wall.";

const enterpriseProducts: ProductExpandCardData[] = [
  {
    id: "signal-session",
    category: "The Signal Session",
    headline: "Your commercial diagnosis. Shipped in 48 hours.",
    subhead:
      "A one-day intensive that produces a 15-20 page Commercial Narrative. The best place to start if you're not sure whether Revenue Architecture is the right call.",
    price: "From $15,000",
    outcomeTodo:
      "[Krish to write: one-line outcome from a past Signal Session, anonymised]",
    trioLine: ENTERPRISE_TRIO_LINE,
    description:
      "One day with Krish, on-site or remote, working through your current commercial state. 48 hours later you receive a 15-20 page Commercial Narrative document, a 2-page positioning framework ready for Monday, a sales narrative and objection-handling guide, a pricing model sketch with 2-3 packaging options, and a written read on whether the full Revenue Architecture engagement is warranted.",
    walkOutWith: [
      "Commercial Narrative document (15-20 pages, delivered within 48 hours)",
      "2-page positioning framework ready for the team to use Monday",
      "Sales narrative and objection handling guide",
      "Pricing model sketch with 2-3 packaging options",
      "30-day commercial roadmap with named owners and milestones",
      "Written read on whether Revenue Architecture is warranted",
    ],
    bestFor:
      "Companies sitting on real AI capability without a defensible commercial story, or who suspect their pricing and positioning are leaving money on the table.",
    paymentTerms: "Payment in full at kickoff.",
    primaryCTA: {
      label: "Book The Signal Session",
      preselected: "enterprise-signal-session",
    },
  },
  {
    id: "revenue-architecture",
    category: "The Revenue Architecture",
    headline: "30-day commercial rebuild. One person in the room.",
    subhead:
      "ICP, pricing, GTM, content engine, and outbound, all rebuilt to run on AI from day one. No associates, no retainer.",
    price: "From $60,000",
    priceDetail: "to $100,000, scope-dependent",
    outcomeTodo:
      "[Krish to write: one-line outcome from a past Revenue Architecture engagement, anonymised]",
    trioLine: ENTERPRISE_TRIO_LINE,
    description:
      "30 days with Krish in the room, fixed scope, no retainer, no partner-shuffles. The work is structurally different from a consulting engagement: when something works there's exactly one person to credit, when something doesn't there's exactly one person to fire. Most consulting engagements are designed the other way, multiple associates, an open-ended timeline, and a partner-shuffle every quarter. Mindmaker is sized small enough that it can't hide behind any of that.",
    walkOutWith: [
      "Commercial strategy document (30-40 pages, client-branded)",
      "Product marketing framework (positioning, messaging, competitive differentiation)",
      "Revenue model with multiple pricing scenarios tested against business reality",
      "Packaging and tiering structure (2-3 ship-ready options)",
      "90-day GTM playbook with channels, sales process, enablement materials",
      "Board-ready presentation deck",
      "30-day follow-up strategy session included",
    ],
    bestFor:
      "Companies past the Signal Session stage, or who arrive knowing they need a full commercial rebuild, typically because the category is shifting, the founder is the bottleneck, or the company is pivoting into a new line and needs the engine built around AI from day one.",
    paymentTerms: "50% deposit at kickoff, 50% at delivery.",
    primaryCTA: {
      label: "Book The Revenue Architecture",
      preselected: "enterprise-revenue-architecture",
    },
  },
  {
    id: "immersion",
    category: "The AI Immersion",
    headline:
      "Half a day, your full leadership team, one shared AI tension named.",
    subhead:
      "Inquiry-only. For executive teams who need fast alignment before a budget cycle, board meeting, or pivot decision.",
    price: "From $12,000",
    priceDetail: "flat fee, plus travel for on-site",
    outcomeTodo:
      "[Krish to write: one-line outcome from a past Immersion]",
    trioLine:
      "What gets mapped together: your product strategy, your team's capability, the leadership team's collective fluency. Most off-sites optimise the first two and ignore the third.",
    description:
      "4-hour facilitated session for executive teams. Pre-session diagnostic, the live session itself (on-site or remote), 2-page summary delivered within 5 business days. Designed for the moment when an executive team needs to leave a room with one AI tension named and three decisions made, not another open-ended discussion.",
    walkOutWith: [
      "Pre-session diagnostic on the team's current AI surface",
      "Half-day facilitated session (4 hours, on-site or remote)",
      "One named AI tension with three concrete next-step decisions",
      "2-page summary document delivered within 5 business days",
      "Optional 30-day follow-up coaching call",
    ],
    bestFor:
      "Executive teams that have stalled on AI alignment, are entering a budget cycle with no shared point of view, or are about to make a major restructure decision and need everyone in the same room first.",
    paymentTerms: "Payment in full at booking, or 50/50 at booking and delivery.",
    primaryCTA: {
      label: "Inquire about The Immersion",
      preselected: "enterprise-immersion",
    },
  },
];

const comparisonRows = [
  {
    label: "Duration",
    signal: "1 day intensive + 48h delivery",
    revenue: "30 days (4-5 calendar weeks)",
  },
  {
    label: "Price",
    signal: "From $15,000",
    revenue: "From $60,000 to $100,000",
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
    const productIds = enterpriseProducts.map((p) => p.id);
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      // Product ID anchors are handled by ProductExpandSection
      if (!productIds.includes(id)) {
        const el = document.getElementById(id);
        if (el) {
          setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
        }
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Enterprise: AI commercialization sprints"
        description="Two sprints with a fixed scope and a finish line. The Signal Session from $15k aligns your team fast. The Revenue Architecture from $60k builds the complete commercial strategy."
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
              You have the tech. I give you the story, the pricing, and the go-to-market engine that sells it. Two sprints, each with a fixed scope and a finish line.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-mint text-ink hover:bg-mint/90 font-bold px-8"
                onClick={() => openScopingModal("enterprise-revenue-architecture")}
              >
                Scope an engagement <ArrowRight className="ml-2 w-4 h-4" />
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
            <div className="mt-6">
              <button
                type="button"
                onClick={goToDiagnostic}
                className="text-sm text-white/55 hover:text-mint transition-colors"
              >
                Or take the free diagnostic first →
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ENGAGEMENTS */}
      <section id="engagements" className="section-padding scroll-mt-24">
        <div className="container-width max-w-5xl">
          <ProductExpandSection products={enterpriseProducts} />
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
              Start with The Signal Session if you need a fast read. Go straight to The Revenue Architecture if you already know you need the full build.
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

      {/* CAPITAL CROSS-LINK */}
      <section className="section-padding">
        <div className="container-width max-w-4xl">
          <motion.div
            className="glass-card editorial-card p-8 md:p-10 border border-border/50"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-3">
              Allocating capital, not running a company?
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
              The same engine, run across a portfolio.
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              For Operating Partners, family offices, and funds. Rebuild the fund itself around AI first, then run the same engagement across portfolio companies with fund-level pricing for repeat work.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-ink dark:bg-mint text-white dark:text-ink hover:opacity-90 font-bold"
            >
              <a href="/capital">
                Explore Capital <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
          </motion.div>
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
              onClick={() => openScopingModal()}
            >
              Scope it with me <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <div className="mt-5">
              <button
                type="button"
                onClick={goToDiagnostic}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Or take the free diagnostic first →
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
