import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Info, Zap, Compass } from "lucide-react";
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
    window.dispatchEvent(
      new CustomEvent("openConsultModal", { detail: { preselected } })
    );
  } else {
    window.dispatchEvent(new CustomEvent("openConsultModal"));
  }
};

type SprintCardProps = {
  title: string;
  price: string;
  duration: string;
  pitch: string;
  includes: string[];
  ctaLabel: string;
  ctaId: string;
};

const SprintCard = ({
  title,
  price,
  duration,
  pitch,
  includes,
  ctaLabel,
  ctaId,
}: SprintCardProps) => (
  <motion.article
    className="glass-card editorial-card p-8 flex flex-col h-full border border-border/50 hover:border-mint/30 transition-colors"
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-50px" }}
    variants={fadeUp}
  >
    <h3 className="text-2xl font-bold mb-1">{title}</h3>
    <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-border/50">
      <span className="text-3xl font-bold">{price}</span>
      <span className="text-sm text-muted-foreground">{duration}</span>
    </div>
    <p className="text-muted-foreground mb-5 leading-relaxed">{pitch}</p>
    <div className="mb-6 flex-1">
      <div className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground mb-3">
        Includes
      </div>
      <ul className="space-y-2">
        {includes.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-mint shrink-0 mt-1" />
            <span className="text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </div>
    <p className="text-xs text-muted-foreground mb-4">
      Payment 50/50 at kickoff and midpoint.
    </p>
    <Button
      size="lg"
      className="bg-ink dark:bg-mint text-white dark:text-ink hover:opacity-90 font-bold w-full"
      onClick={() => openConsultModal(ctaId)}
    >
      {ctaLabel} <ArrowRight className="ml-2 w-4 h-4" />
    </Button>
  </motion.article>
);

const comparisonRows = [
  {
    label: "Duration",
    values: ["4 weeks", "90 days", "4 weeks", "90 days"],
  },
  {
    label: "Price",
    values: ["$18,000", "$60,000", "$18,000", "$60,000"],
  },
  {
    label: "Best for",
    values: [
      "One nervous build decision",
      "Full builder operating system",
      "One nervous leadership call",
      "Executive AI authority",
    ],
  },
  {
    label: "You walk out with",
    values: [
      "Working v1 + decision memo",
      "AI clone, agent stack, 12-month roadmap",
      "Delegation framework + decision memo",
      "Governance, roadmap, board-ready deck",
    ],
  },
  {
    label: "Session format",
    values: [
      "4 × 60 min + async",
      "Weekly sessions + async",
      "4 × 60 min + async",
      "Weekly sessions + async",
    ],
  },
];

const faqs = [
  {
    q: "How do I choose between Builder and Orchestrator?",
    a: "Builder is for founders, operators and leaders who want to build and ship AI systems personally. Orchestrator is for leaders responsible for AI across a team or org who need to direct it, not build it. If you're not sure, book a call — we'll figure it out together.",
  },
  {
    q: "How do I choose between 4-week and 90-day?",
    a: "4-week resolves one specific decision with a working artifact. 90-day rebuilds how you operate. If you can name a single decision keeping you up at night, start with 4-week. If you're asking 'how should I think about AI across my whole role?', 90-day.",
  },
  {
    q: "What if I need more than 90 days?",
    a: "Some leaders extend for ongoing support as they scale. We talk about it at the end of the 90 days, not before. No retainers.",
  },
  {
    q: "Can I upgrade from 4-week to 90-day?",
    a: "Yes. If mid-sprint we realise the decision under your decision is bigger than four weeks, we credit the 4-week fee against the 90-day engagement.",
  },
  {
    q: "Do you do this in-person?",
    a: "Sessions are virtual by default. NYC in-person available for the 90-day engagement on request.",
  },
];

export default function Sprints() {
  useEffect(() => {
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
        title="1:1 Sprints: Builder and Orchestrator tracks"
        description="Your nervous decision, resolved. Builder or Orchestrator. 4-week ($18k) or 90-day ($60k). Fixed scope. Decisions that stick."
        canonical="/sprints"
      />
      <Navigation />

      {/* HERO */}
      <section className="section-padding pt-32">
        <div className="container-width max-w-4xl text-center">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/10 border border-mint/20 text-mint-dark dark:text-mint text-xs font-bold uppercase tracking-[0.18em] mb-6">
              1:1 Sprints
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
              Your nervous decision, resolved.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Pick your track. Builder or Orchestrator. Then pick how deep you want to go. 4 weeks or 90 days.
            </p>
          </motion.div>
        </div>
      </section>

      {/* TRACK SELECTOR */}
      <section className="pb-12">
        <div className="container-width max-w-5xl">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.a
              href="#builder"
              className="glass-card editorial-card p-8 border border-border/50 hover:border-mint/40 transition-all group"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
            >
              <div className="w-12 h-12 rounded-xl bg-mint/15 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 text-mint-dark dark:text-mint" />
              </div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-2">
                Builder Track
              </div>
              <h2 className="text-2xl font-bold mb-3">
                Build working systems that multiply what you're good at.
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                <strong className="text-foreground">For:</strong> Founders, operators, and leaders who want to build and ship AI systems personally.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                <strong className="text-foreground">You leave with:</strong> AI clone, agentic workflows, memory architecture. Operating like a team of three.
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-bold text-mint-dark dark:text-mint group-hover:gap-3 transition-all">
                Explore Builder Sprint <ArrowRight className="w-4 h-4" />
              </span>
            </motion.a>

            <motion.a
              href="#orchestrator"
              className="glass-card editorial-card p-8 border border-border/50 hover:border-mint/40 transition-all group"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              custom={1}
              variants={fadeUp}
            >
              <div className="w-12 h-12 rounded-xl bg-mint/15 flex items-center justify-center mb-4">
                <Compass className="w-5 h-5 text-mint-dark dark:text-mint" />
              </div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-2">
                Orchestrator Track
              </div>
              <h2 className="text-2xl font-bold mb-3">
                Filter noise, set boundaries, develop executive AI judgment.
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                <strong className="text-foreground">For:</strong> Leaders responsible for AI across a team or org. Set the roadmap, brief the board, direct the work.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                <strong className="text-foreground">You leave with:</strong> Delegation framework, governance, board-ready 12-month roadmap, executive AI authority.
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-bold text-mint-dark dark:text-mint group-hover:gap-3 transition-all">
                Explore Orchestrator Sprint <ArrowRight className="w-4 h-4" />
              </span>
            </motion.a>
          </div>
        </div>
      </section>

      {/* BUILDER SECTION */}
      <section id="builder" className="section-padding bg-ink/[0.02] dark:bg-white/[0.02] scroll-mt-24">
        <div className="container-width max-w-5xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Builder Sprint</h2>
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-3xl">
              One-on-one with leaders who want to build with their own hands. We design the architecture for your AI systems, ship working prototypes, and leave you operating like a team of three.
            </p>

            {/* Scope boundary callout */}
            <div className="rounded-2xl border-2 border-mint/40 bg-mint/5 p-6 mb-10 flex gap-4">
              <Info className="w-5 h-5 text-mint-dark dark:text-mint shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-2">Note on scope.</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  I design the architecture and build the v1 prototypes. Your team (or my vetted partners) own the production deployment. I give you the blueprint; I am not your IT department. If you need long-term engineering ownership, we'll identify who runs it — but it won't be me.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <SprintCard
              title="4-Week Builder"
              price="$18,000"
              duration="4 weeks"
              pitch="Pick one nervous decision — tool commitment, AI clone design, your first agentic workflow — and resolve it with a working system and decision memo."
              includes={[
                "4 weekly decision sessions (60 min)",
                "Async support between sessions",
                "Decision memo + trade-off analysis",
                "Working v1 prototype",
                "ROI framework and cost-to-build model",
              ]}
              ctaLabel="Book 4-Week Builder"
              ctaId="4-week-builder"
            />
            <SprintCard
              title="90-Day Builder"
              price="$60,000"
              duration="90 days"
              pitch="Build your AI clone, deploy agentic workflows, design your memory systems — and leave operating like a 3-person team with a Builder Dossier and 12-month roadmap."
              includes={[
                "2-3 strategic decisions resolved",
                "3-5 deployed AI systems",
                "AI clone deployed with prompt library + memory",
                "Builder Dossier (fully documented)",
                "12-month personal AI roadmap",
              ]}
              ctaLabel="Book 90-Day Builder"
              ctaId="90-day-builder"
            />
          </div>
        </div>
      </section>

      {/* ORCHESTRATOR SECTION */}
      <section id="orchestrator" className="section-padding scroll-mt-24">
        <div className="container-width max-w-5xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Orchestrator Sprint</h2>
            <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-3xl">
              One-on-one with leaders who direct AI across a team or org. Name the decisions that matter, set the boundaries, brief the board — and walk out with executive authority over AI.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <SprintCard
              title="4-Week Orchestrator"
              price="$18,000"
              duration="4 weeks"
              pitch="Pick one nervous decision — vendor selection, delegation framework, what your team hands off vs keeps — and resolve it with a defensible trade-off analysis and board memo."
              includes={[
                "4 weekly decision sessions (60 min)",
                "Async support between sessions",
                "Board-ready decision memo",
                "Vendor / tool scorecard",
                "Delegation framework",
              ]}
              ctaLabel="Book 4-Week Orchestrator"
              ctaId="4-week-orchestrator"
            />
            <SprintCard
              title="90-Day Orchestrator"
              price="$60,000"
              duration="90 days"
              pitch="Set your delegation framework, clone your communication standards into AI, build institutional memory — and leave with a board-ready 12-month roadmap and the authority to direct it."
              includes={[
                "AI operating model + governance",
                "Delegation matrix + escalation triggers",
                "Communication voice / brand cloning",
                "Vendor scorecard + decision memo",
                "Board-ready 12-month roadmap",
              ]}
              ctaLabel="Book 90-Day Orchestrator"
              ctaId="90-day-orchestrator"
            />
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="section-padding bg-muted/30">
        <div className="container-width max-w-6xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">All four, side by side.</h2>
            <p className="text-muted-foreground text-lg mb-10">
              Same shape. Different depth. Pick the one that matches the decision.
            </p>
          </motion.div>

          <div className="rounded-2xl border border-border/50 overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border/50">
                  <th className="text-left p-4 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    &nbsp;
                  </th>
                  <th className="text-left p-4 text-xs font-bold">4-Week Builder</th>
                  <th className="text-left p-4 text-xs font-bold">90-Day Builder</th>
                  <th className="text-left p-4 text-xs font-bold">4-Week Orchestrator</th>
                  <th className="text-left p-4 text-xs font-bold">90-Day Orchestrator</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.label}
                    className={i < comparisonRows.length - 1 ? "border-b border-border/40" : ""}
                  >
                    <td className="p-4 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground align-top">
                      {row.label}
                    </td>
                    {row.values.map((v, j) => (
                      <td key={j} className="p-4 align-top">
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* NOT SURE */}
      <section className="section-padding">
        <div className="container-width max-w-3xl text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Not sure which sprint?</h2>
            <p className="text-muted-foreground mb-6">
              Book a 30-minute call. We'll figure out the right fit together. No pitch deck.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-mint to-emerald-400 text-ink hover:opacity-90 font-bold px-10"
              onClick={() => openConsultModal()}
            >
              Book a call <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-muted/30">
        <div className="container-width max-w-3xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
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

      <Footer />
    </main>
  );
}
