import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Users, Calendar, Info, ExternalLink, Tag } from "lucide-react";
import { SEO } from "@/components/SEO";
import { MAVEN_COHORT_URL } from "@/lib/stripe-prices";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

// Dynamic cohort details. The live Maven page is the source of truth.
// In a future pass these come from a Supabase `cohort_dates` table; for
// now they're maintained here.
const nextCohort = {
  id: "summer-2026",
  startLabel: "July 21, 2026",
  endLabel: "August 14, 2026",
  seatsRemaining: 11,
  seatsTotal: 15,
};

const trackMavenClick = () => {
  try {
    (window as unknown as { plausible?: (e: string, o?: { props?: object }) => void })
      .plausible?.("maven_redirect_click", { props: { page: "/cohort" } });
  } catch {
    /* analytics optional */
  }
};

const trackDiagnosticClick = () => {
  try {
    (window as unknown as { plausible?: (e: string, o?: { props?: object }) => void })
      .plausible?.("diagnostic_secondary_click", { props: { page: "/cohort" } });
  } catch {
    /* analytics optional */
  }
};

const openScopingModal = (preselected?: string) => {
  window.dispatchEvent(
    new CustomEvent("openScopingModal", {
      detail: {
        source_page: "/cohort",
        ...(preselected ? { preselected } : {}),
      },
    }),
  );
};

const curriculum = [
  {
    week: 1,
    title: "Diagnose.",
    body: "You arrive with an AI decision you've been putting off. By the end of week one, you've named the real decision sitting under it and scoped it tightly enough to send to someone else.",
    async: "3 videos · 2 frameworks · 1 worksheet",
    live: "90 min peer-guided diagnosis session",
  },
  {
    week: 2,
    title: "Decompose.",
    body: "Break the decision into the real trade-offs underneath it: build vs buy, now vs wait, this vendor vs that vendor, what stays human vs what gets agentic. Your actual fork, on the table.",
    async: "2 videos · 1 framework · 1 scorecard",
    live: "90 min peer pressure-test of the options",
  },
  {
    week: 3,
    title: "Decide.",
    body: "You commit, out loud, to the group. You leave with a one-page decision memo you can actually send to whoever needs to read it next.",
    async: "1 video · decision memo template",
    live: "90 min memo peer review and commitment",
  },
  {
    week: 4,
    title: "Deploy.",
    body: "You ship the first concrete step. A briefed vendor, a signed scope, an internal launch note, a kicked-off pilot. The cohort holds you accountable to the date you set.",
    async: "1 video · deployment checklist",
    live: "90 min show-and-tell, accountability, alumni onboarding",
  },
];

const walkOutWith = [
  "One-page decision memo you can send up the chain",
  "Trade-off analysis document",
  "Lifetime access to CTRL, Mindmaker's flagship memory-web app",
  "Access to the cohort Slack for 90 days post-cohort",
  "Lifetime access to curriculum materials",
  "Invitation to the cohort alumni network",
];

const forYou = [
  "You're a senior operator (VP, SVP, CxO, founder-operator) with budget authority and a real AI decision on your desk.",
  "You're comfortable with 'good enough' thinking and want to stop over-researching.",
  "You want peers, not a consultant lecturing you.",
];

const faqs = [
  {
    q: "What if I can't make a live session?",
    a: "Sessions are recorded. You can submit async (written memo, video, or a short Loom) and get peer feedback in Slack before the next week.",
  },
  {
    q: "What if I don't have a decision to bring?",
    a: "We'll help you name one. But honestly, if you can't name a nervous AI decision on your desk this quarter, this cohort isn't the right fit. Come back next quarter.",
  },
  {
    q: "Can I send a colleague instead?",
    a: "No. The cohort runs on peer continuity: the same 10 to 15 leaders in each session. Substitutions break that.",
  },
  {
    q: "Is this tax-deductible?",
    a: "For most US buyers, yes, as professional development. Ask your finance team. We can provide an invoice to your employer.",
  },
  {
    q: "What's the refund policy?",
    a: "Full refund up to 7 days before the cohort starts. 50% refund up to day one. No refund after day one.",
  },
];

export default function Cohort() {
  const [searchParams] = useSearchParams();
  const inquiryOnly = searchParams.get("inquiry") === "1:1";
  const [showInquiryBanner, setShowInquiryBanner] = useState(inquiryOnly);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="The AI-Fluent Executive"
        description="Make your nervous AI decision with 15 other senior leaders. Four weeks, mostly async, with weekly live sessions. $2,000–$3,000 per seat, quarterly. Hosted on Maven."
        canonical="/cohort"
        ogType="website"
      />
      <Navigation />

      {/* Inquiry banner: shown only if ?inquiry=1:1 */}
      {showInquiryBanner && (
        <div className="pt-20">
          <div className="container-width max-w-5xl">
            <div className="mt-4 p-4 rounded-xl border border-mint/40 bg-mint/10 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm">
                Looking for 1:1 work? I take on a handful of private engagements by inquiry.
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => openScopingModal("1-1-inquiry")}
                  className="bg-ink dark:bg-mint text-white dark:text-ink font-bold"
                >
                  Contact me
                </Button>
                <button
                  onClick={() => setShowInquiryBanner(false)}
                  aria-label="Dismiss"
                  className="text-xs text-muted-foreground hover:text-foreground px-2 py-1"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className={`section-padding ${showInquiryBanner ? "pt-10" : "pt-32"}`}>
        <div className="container-width max-w-4xl text-center">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/10 border border-mint/20 text-mint-dark dark:text-mint text-xs font-bold uppercase tracking-[0.18em] mb-6">
              <Users className="w-3.5 h-3.5" />
              The AI-Fluent Executive
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
              Make your nervous AI decision with <span className="text-mint-dark dark:text-mint">15 other senior leaders.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Four weeks, mostly async, with weekly live sessions. Diagnose, decompose, decide, deploy. You leave with the one decision you've been avoiding, pressure-tested by a room full of people sitting in the same chair you are.
            </p>

            <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm mb-8">
              <Calendar className="w-4 h-4 text-mint-dark dark:text-mint" />
              <span className="font-semibold">Next cohort: {nextCohort.startLabel} to {nextCohort.endLabel}</span>
              <span className="text-muted-foreground">
                · {nextCohort.seatsRemaining} of {nextCohort.seatsTotal} seats remaining
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-mint to-emerald-400 text-ink hover:opacity-90 font-bold px-8"
                onClick={trackMavenClick}
              >
                <a
                  href={MAVEN_COHORT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Enroll on Maven <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="font-bold"
                onClick={trackDiagnosticClick}
              >
                <a href="/leaders">Or take the free diagnostic first</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROBLEM FRAME */}
      <section className="section-padding pt-0">
        <div className="container-width max-w-3xl text-center">
          <motion.p
            className="text-lg md:text-xl text-muted-foreground leading-relaxed"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            You've been pitched 14 AI vendor decks this quarter. You have a nervous AI decision you keep deferring: build vs buy, tool commitment, a clone and its boundaries, vendor lock-in, something. You're tired of thinking alone, you don't have time to hire a consultant, and you want to <span className="text-foreground font-bold">decide</span>.
          </motion.p>
        </div>
      </section>

      {/* WHO THIS IS FOR */}
      <section className="section-padding bg-muted/30">
        <div className="container-width max-w-4xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-mint-dark dark:text-mint" />
              <h2 className="text-3xl md:text-4xl font-bold">Who it's for.</h2>
            </div>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {forYou.map((line, i) => (
              <motion.div
                key={i}
                className="glass-card editorial-card p-6 border border-border/50"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <CheckCircle className="w-5 h-5 text-mint mb-3" />
                <p className="text-sm leading-relaxed">{line}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CURRICULUM */}
      <section className="section-padding">
        <div className="container-width max-w-6xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">The four-week arc: Diagnose, Decompose, Decide, Deploy.</h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-2xl">
              Mostly async. One 90-minute live session each week. Commit ~4 to 5 hours a week.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {curriculum.map((week, i) => (
              <motion.article
                key={week.week}
                className="glass-card editorial-card p-7 flex flex-col h-full border border-border/50"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                custom={i}
                variants={fadeUp}
              >
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-3">
                  Week {week.week}
                </div>
                <h3 className="text-2xl font-bold mb-3">{week.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                  {week.body}
                </p>
                <div className="space-y-3 text-sm pt-4 border-t border-border/50">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground mb-1">
                      Async
                    </div>
                    <div>{week.async}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground mb-1">
                      Live
                    </div>
                    <div>{week.live}</div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU WALK OUT WITH */}
      <section className="section-padding bg-muted/30">
        <div className="container-width max-w-3xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-10">What you keep.</h2>
          </motion.div>
          <ul className="space-y-3">
            {walkOutWith.map((item, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-3"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <CheckCircle className="w-5 h-5 text-mint shrink-0 mt-0.5" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ENROLL */}
      <section id="enroll" className="section-padding scroll-mt-24">
        <div className="container-width max-w-3xl">
          <motion.div
            className="glass-card editorial-card p-8 md:p-12 border border-mint/30"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-3">
              Enrollment
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-5">
              Next cohort runs {nextCohort.startLabel} to {nextCohort.endLabel}.
            </h2>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-4xl font-bold">$2,000–$3,000</span>
              <span className="text-muted-foreground">per seat</span>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              Full payment or split into two payments. Seats: {nextCohort.seatsRemaining} of {nextCohort.seatsTotal} remaining.
            </p>

            {/* Workshop alumni discount callout */}
            <div className="mb-5 p-4 rounded-xl border border-mint/30 bg-mint/5 flex items-start gap-3">
              <Tag className="w-4 h-4 text-mint-dark dark:text-mint mt-0.5 shrink-0" />
              <p className="text-sm leading-relaxed">
                <span className="font-bold">Done a Workshop in the last 90 days?</span>{" "}
                Use code <span className="font-mono font-bold text-foreground">WORKSHOP</span> at Maven checkout for $500 off.
              </p>
            </div>

            <a
              href={MAVEN_COHORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors text-xs font-medium mb-5"
            >
              Hosted on Maven
              <ExternalLink className="w-3 h-3" />
            </a>
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-mint to-emerald-400 text-ink hover:opacity-90 font-bold"
              >
                <a
                  href={MAVEN_COHORT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Reserve my seat on Maven <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-bold"
                onClick={() => openScopingModal("cohort-waitlist")}
              >
                Get notified about future cohorts
              </Button>
            </div>
            <p className="text-xs text-muted-foreground flex items-start gap-2">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              Enrollment and payment happen on Maven. Questions first?{" "}
              <button
                type="button"
                onClick={() => openScopingModal("cohort-enrollment")}
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                Book an intake call
              </button>
              .
            </p>
          </motion.div>
        </div>
      </section>

      {/* CROSS-LINK TO ENTERPRISE */}
      <section className="section-padding pt-0">
        <div className="container-width max-w-3xl text-center">
          <p className="text-sm text-muted-foreground">
            Need enterprise-scale commercial work instead?{" "}
            <a
              href="/enterprise"
              className="font-semibold text-mint-dark dark:text-mint hover:underline"
            >
              See Enterprise →
            </a>
          </p>
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

      {/* 1:1 ESCAPE HATCH */}
      <section className="section-padding">
        <div className="container-width max-w-3xl">
          <motion.div
            className="p-8 rounded-2xl border border-border/50 bg-muted/20"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <h3 className="text-xl font-bold mb-2">Want to work with me 1:1?</h3>
            <p className="text-muted-foreground mb-5">
              I take on a small number of private engagements each year. Scope and pricing by inquiry.
            </p>
            <Button
              variant="outline"
              className="font-bold"
              onClick={() => openScopingModal("1-1-inquiry")}
            >
              Start a conversation <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
