import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
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

const openConsultModal = (preselected?: string) => {
  if (preselected) {
    window.dispatchEvent(
      new CustomEvent("openConsultModal", { detail: { preselected } })
    );
  } else {
    window.dispatchEvent(new CustomEvent("openConsultModal"));
  }
};

const capitalProducts: ProductExpandCardData[] = [
  {
    id: "signal-session",
    category: "The Signal Session",
    headline: "One day. Two outcomes. The fund itself, or a portfolio company.",
    subhead:
      "Either we map the AI strategy for your fund or family office itself, or we run a capital-allocator's read on a specific portfolio company.",
    price: "$15,000",
    trioLine:
      "We map three things at once: how your fund actually builds product, what your team can run, and how fluent you are as an allocator. Most engagements skip the third one and find out it mattered later, after the wall.",
    description:
      "One day with Krish, working through your current state. 48 hours later you receive a 15-20 page Commercial Narrative document. For fund-level engagements, that means an AI operating model sketch and a deal flow signal framework. For portfolio engagements, that means a capital-allocator's read on the company's commercial state and a repositioning hypothesis. Either way, you get a written read on whether Revenue Architecture is the right next step.",
    walkOutWith: [
      "Commercial Narrative document (15-20 pages, delivered within 48 hours)",
      "For fund-level: AI operating model sketch, deal flow signal framework",
      "For portfolio: capital-allocator's read on commercial state, repositioning hypothesis",
      "30-day roadmap with named owners and milestones",
      "Written read on whether Revenue Architecture is warranted",
    ],
    bestFor:
      "Capital allocators deciding where to put AI to work first: inside the fund itself, or against a specific portfolio company.",
    paymentTerms: "Payment in full at kickoff.",
    primaryCTA: {
      label: "Book The Signal Session",
      preselected: "capital-signal-session",
    },
  },
  {
    id: "revenue-architecture",
    category: "The Revenue Architecture",
    headline: "30-day commercial rebuild. Deployed inside a portfolio company.",
    subhead:
      "Same Krish in the room, no associates, no retainer. Fund-level pricing for 3+ engagements per 12 months.",
    price: "From $60,000",
    priceDetail: "per portfolio company",
    trioLine:
      "We map three things at once: how the portfolio company actually builds product, what the team can run, and how fluent the founder is as an operator. Most consulting engagements skip the third one and find out it mattered halfway through the rebuild.",
    description:
      "30 days inside a portfolio company. We rewrite ICP, pricing, GTM, the content engine, and outbound, with AI baked into the engine from day one. The deliverable is the engine itself, not a deck. Krish is in the room with the founder, working live, no associates, no partner-shuffles.",
    walkOutWith: [
      "Commercial strategy document (30-40 pages, client-branded)",
      "Product marketing framework: positioning, messaging, competitive differentiation",
      "Revenue model with multiple pricing scenarios",
      "90-day GTM playbook: channels, sales process, enablement materials",
      "Board-ready deck (for the portfolio company's board, not the fund's IC)",
      "30-day follow-up strategy session included",
    ],
    bestFor:
      "Funds and family offices that have identified a portfolio company needing a complete commercial rebuild, or want to deploy the same playbook across multiple portcos with fund-level pricing.",
    paymentTerms:
      "$60,000 to $100,000 per portfolio company, scope-dependent. 50% at kickoff, 50% at delivery. Fund-level discount available for 3+ engagements per 12 months.",
    primaryCTA: {
      label: "Book The Revenue Architecture",
      preselected: "capital-revenue-architecture",
    },
  },
];

const door1Bullets = [
  "Deal flow evaluation that filters signal from noise on founder AI claims",
  "Portfolio thesis stress-tested against where AI is actually changing the competitive picture",
  "Internal operating model rebuilt with AI inside the work itself: LP comms, deal memos, IC prep",
  "A defensible point of view on AI you can hold in your next IC and your next LP meeting",
];

const door2Bullets = [
  "Reposition portfolio companies whose category is collapsing",
  "Rebuild portfolio companies whose founders are the bottleneck",
  "Build new commercial engines into ventures starting from zero",
  "Same Mindmaker engagement, applied to one portfolio company at a time",
];

const faqs = [
  {
    q: "We have an in-house operating partner. Why would we hire you?",
    a: "Operating partners are full-time generalists. Mindmaker is a fixed-scope specialist who builds and leaves. Both can coexist. Most of my Capital buyers use me to scale across multiple portfolio engagements without growing internal headcount.",
  },
  {
    q: "Our portfolio companies have their own CTOs. What do you actually do?",
    a: "Mindmaker doesn't replace the CTO. It builds the commercial engine the CTO can't (positioning, pricing, GTM, content, outbound). Engineering and commercial are different problems. The CTO ships the product. I make sure the right buyers pay the right price for it.",
  },
  {
    q: "Why no retainer? Wouldn't a multi-portco engagement work better as ongoing work?",
    a: "Every engagement has a finish line because that's the only credible way to prove the work was about outcomes, not hours. Fund-level pricing exists for repeat engagements (3+ per 12 months get a discount), but each individual engagement is still 30 days fixed scope.",
  },
  {
    q: "How does this work if we want it for the fund itself, not a portfolio company?",
    a: "Same Signal Session entry, different focus. Instead of mapping a portfolio company's commercial layer, we map the fund's operating model: deal flow evaluation, IC prep, LP comms, portfolio thesis. Revenue Architecture in that context becomes a fund-internal rebuild rather than a portfolio company rebuild.",
  },
  {
    q: "How fast can we start?",
    a: "Signal Session typically books within 2-3 weeks. Revenue Architecture starts at the next monthly slot. For fund-level engagements with multiple portcos in scope, the intake call defines sequencing.",
  },
];

export default function Capital() {
  useEffect(() => {
    const productIds = capitalProducts.map((p) => p.id);
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
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
        title="Capital: build the fund's AI engine first, then the portfolio's"
        description="For Operating Partners, family offices, and funds. The Signal Session ($15k) maps the AI strategy for your fund or a portfolio company. The Revenue Architecture ($60-100k per portco) builds the engine inside it. Fund-level pricing available."
        canonical="/capital"
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
              Capital
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white text-balance">
              AI-native capital,
              <br />
              <span className="text-mint">deployed.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              For Operating Partners, family offices, and funds. We build the fund's AI engine first, around how you actually run deals. Then we push the same engine into the portfolio companies where it earns the most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-mint text-ink hover:bg-mint/90 font-bold px-8"
                onClick={() => openConsultModal("capital")}
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

      {/* TWO DOORS */}
      <section className="section-padding">
        <div className="container-width max-w-5xl">
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              Two doors. One operating system.
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              It's the same architecture, the same fixed scope, and Krish in the room either way. The only thing that changes is whether the engine ends up running inside your fund or inside one of the companies you own.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <motion.article
              className="glass-card editorial-card p-8 md:p-10 flex flex-col h-full border border-border/50 hover:border-mint/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-mint/10 transition-all duration-300"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              custom={0}
              variants={fadeUp}
            >
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-3">
                Door 1
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4 leading-tight">
                Build the fund's AI engine first.
              </h3>
              <ul className="space-y-3 mb-2 flex-grow">
                {door1Bullets.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0 mt-1" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.article>

            <motion.article
              className="glass-card editorial-card p-8 md:p-10 flex flex-col h-full border border-border/50 hover:border-mint/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-mint/10 transition-all duration-300"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              custom={1}
              variants={fadeUp}
            >
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-3">
                Door 2
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4 leading-tight">
                Deploy across your portfolio.
              </h3>
              <ul className="space-y-3 mb-2 flex-grow">
                {door2Bullets.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-mint shrink-0 mt-1" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          </div>
        </div>
      </section>

      {/* ENGAGEMENTS */}
      <section id="engagements" className="section-padding scroll-mt-24 bg-muted/20">
        <div className="container-width max-w-5xl">
          <motion.div
            className="mb-10"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Engagements.</h2>
            <p className="text-muted-foreground text-lg">
              Two products running on the same engine. Either one works for the fund itself or for a single portfolio company.
            </p>
          </motion.div>
          <ProductExpandSection products={capitalProducts} />
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
              I build the commercial strategy, positioning, and GTM architecture for funds and portfolio companies. I deliver the blueprint, the pricing, and the narrative. I don't run your sales team, I don't embed as a fractional Operating Partner, and I don't do ongoing retainer work. Every engagement has a fixed scope and a finish line. If your fund needs a permanent in-house operating partner, we'll talk about who that should be, but it won't be me on payroll.
            </p>
          </motion.div>
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
              Not sure which door is yours?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Book a 30-minute intake call. We'll scope fit, decide whether it's a fund-level or portfolio engagement, and confirm price and start date in one conversation.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-mint to-emerald-400 text-ink hover:opacity-90 font-bold px-10 py-6 text-base"
              onClick={() => openConsultModal("capital")}
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
