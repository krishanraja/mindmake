import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Users, Calendar, FileText, MessageSquare } from "lucide-react";
import { SEO } from "@/components/SEO";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const requestImmersion = () => {
  window.dispatchEvent(
    new CustomEvent("openScopingModal", {
      detail: {
        source_page: "/immersion",
        preselected: "immersion",
      },
    }),
  );
};

const goToDiagnostic = () => {
  try {
    (window as unknown as { plausible?: (e: string, o?: { props?: object }) => void })
      .plausible?.("diagnostic_secondary_click", { props: { page: "/immersion" } });
  } catch {
    /* analytics optional */
  }
  window.location.href = "/leaders";
};

const phases = [
  {
    number: "Phase 1",
    title: "Alignment (pre-session)",
    icon: MessageSquare,
    bullets: [
      "45-minute call with sponsoring executive",
      "Shared document of the three decisions or tensions the team needs to resolve",
      "Pre-session brief circulated to attendees 48 hours before",
    ],
  },
  {
    number: "Phase 2",
    title: "The session (4 hours, on-site or remote)",
    icon: Users,
    bullets: [
      "Facilitated working session with up to 8 of your leaders",
      "Structured around the three decisions identified in Phase 1",
      "Uses the same Diagnose → Decompose → Decide → Deploy protocol as the Cohort",
      "Private, no recording, Chatham House rules",
    ],
  },
  {
    number: "Phase 3",
    title: "The summary (within 5 business days)",
    icon: FileText,
    bullets: [
      "2-page written summary of the session's outcomes",
      "Named decisions, named owners, named deadlines",
      "A format that can be shared up the chain without redaction",
    ],
  },
];

const faqs = [
  {
    q: "Is this available virtually?",
    a: "Yes. Remote sessions run over Zoom or Google Meet with a shared working canvas. On-site is preferred where budget allows, since the group dynamic is meaningfully different in a physical room, but the written summary is identical either way.",
  },
  {
    q: "Can we add more than 8 people?",
    a: "The format breaks past 8. The room stops being a working session and becomes a presentation. For larger groups, The Signal Session or a custom engagement is a better fit.",
  },
  {
    q: "What if we need more than one session?",
    a: "A single Immersion is the product. If your team needs ongoing work, the Signal Session or Revenue Architecture is a better starting point. I do not run multi-session Immersion engagements.",
  },
  {
    q: "Can we record it?",
    a: "No. The format depends on genuine candor from your leaders. Recording kills candor. The written summary captures the durable decisions and owners.",
  },
  {
    q: "Is travel included in the fee?",
    a: "No. Travel is billed at cost. For on-site sessions outside the northeast US corridor, please confirm the travel budget separately in the intake call.",
  },
  {
    q: "How do I book?",
    a: "Use the \"Request a date\" button. I'll respond within one business day with availability and a 15-minute intake call to confirm fit before any commitment.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "The AI Immersion",
  serviceType: "Executive leadership facilitation",
  provider: {
    "@type": "Organization",
    name: "Mindmaker",
    url: "https://www.themindmaker.ai",
  },
  description:
    "A focused half-day session for executive teams who need to get aligned on AI fast. Up to eight senior leaders, one facilitated conversation, a board-ready summary within five business days.",
  areaServed: "Global",
  offers: {
    "@type": "Offer",
    price: 12000,
    priceCurrency: "USD",
    availability: "https://schema.org/LimitedAvailability",
  },
  url: "https://www.themindmaker.ai/immersion",
};

export default function Immersion() {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="The AI Immersion: A half-day with your leadership team"
        description="A focused half-day session for executive teams who need to get aligned on AI fast. Up to eight senior leaders, one facilitated conversation, a board-ready summary within five business days. From $10,000."
        canonical="/immersion"
        ogType="website"
        jsonLd={jsonLd}
      />
      <Navigation />

      {/* HERO */}
      <section className="section-padding pt-32">
        <div className="container-width max-w-4xl text-center">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/10 border border-mint/20 text-mint-dark dark:text-mint text-xs font-bold uppercase tracking-[0.18em] mb-6">
              <Users className="w-3.5 h-3.5" />
              Available by request · Team format
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
              A half-day in the room with <span className="text-mint-dark dark:text-mint">your leadership team.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              For executive teams who need to get aligned on AI fast. One session. Up to eight senior leaders. No prep work from them. A written summary for your board within five business days.
            </p>
            <div className="flex flex-col items-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-mint to-emerald-400 text-ink hover:opacity-90 font-bold px-8"
                onClick={requestImmersion}
              >
                Request a date <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
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

      {/* WHO THIS IS FOR */}
      <section className="section-padding pt-0">
        <div className="container-width max-w-3xl">
          <motion.p
            className="text-lg md:text-xl text-muted-foreground leading-relaxed text-center"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            This is for CEO-level sponsors who have a leadership team that needs to get on the same page about AI, fast, without sending everyone to different courses and hoping the messaging coheres. It's for the executive who wants one room, one conversation, one shared artifact afterward, and is willing to pay for the right person to run it.
          </motion.p>
        </div>
      </section>

      {/* FORMAT */}
      <section className="section-padding bg-muted/30">
        <div className="container-width max-w-5xl">
          <motion.div
            className="mb-10"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">The format.</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Three phases. One artifact at the end.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {phases.map((phase, i) => {
              const Icon = phase.icon;
              return (
                <motion.article
                  key={phase.number}
                  className="glass-card editorial-card p-7 flex flex-col h-full border border-border/50"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-50px" }}
                  custom={i}
                  variants={fadeUp}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-mint/10 border border-mint/20 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-mint-dark dark:text-mint" />
                    </div>
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint">
                      {phase.number}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4 leading-tight">{phase.title}</h3>
                  <ul className="space-y-2.5 text-sm text-muted-foreground leading-relaxed">
                    {phase.bullets.map((b, bi) => (
                      <li key={bi} className="flex gap-2">
                        <span className="text-mint-dark dark:text-mint shrink-0">·</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHAT IT'S WORTH */}
      <section className="section-padding">
        <div className="container-width max-w-3xl">
          <motion.div
            className="glass-card editorial-card p-8 md:p-12 border border-mint/30 text-center"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-4">
              What it's worth
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight max-w-xl mx-auto">
              Keeping eight executives misaligned on AI for two more quarters costs far more than a single afternoon in the right room.
            </h2>
            <p
              data-todo="outcome-line"
              className="text-sm italic text-mint-dark dark:text-mint leading-relaxed mb-6 max-w-md mx-auto"
            >
              Eight partners who had never said their AI views out loud left a half day with signed principles and a ninety-day plan.
            </p>
            <div className="flex items-baseline gap-2 justify-center">
              <span className="text-3xl md:text-4xl font-bold">$10,000–$15,000</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Cheaper than the off-site that ends in a deck and no decisions.
            </p>
            <p className="text-sm text-muted-foreground mt-1 mb-6">
              Up to 8 leaders · On-site or remote · Travel additional if on-site
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-mint to-emerald-400 text-ink hover:opacity-90 font-bold px-8"
              onClick={requestImmersion}
            >
              Request a date <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <p className="text-xs text-muted-foreground mt-5">
              Full payment at booking, or 50/50 at booking and delivery.
            </p>
          </motion.div>
        </div>
      </section>

      {/* WHAT THE SESSION CAN FOCUS ON */}
      <section className="section-padding bg-muted/30 pt-0 md:pt-0">
        <div className="container-width max-w-3xl pt-16 md:pt-20">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What the session can focus on.</h2>
          </motion.div>
          <motion.p
            className="text-lg text-muted-foreground leading-relaxed"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            Every Immersion is built around three decisions your team needs to resolve together. Common examples include aligning on AI vendor commitments, resolving a build-vs-buy standoff between Product and IT, getting the exec team on the same page before a board presentation, making the replace-vs-empower call about a specific function, or settling internal debate about what your AI strategy actually is. If the tension in your room is more specific than any of those, say so in the intake call. The whole point of the format is that it bends to your actual problem.
          </motion.p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding">
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

      {/* FINAL CTA */}
      <section className="section-padding bg-muted/30">
        <div className="container-width max-w-3xl">
          <motion.div
            className="relative overflow-hidden rounded-2xl border border-mint/30 bg-gradient-to-br from-ink via-ink to-[#0a1612] text-white p-10 md:p-14 text-center"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <div
              className="absolute -top-24 -right-24 w-64 h-64 bg-mint/10 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />
            <div className="relative">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-mint/80 mb-5">
                <Calendar className="w-3.5 h-3.5" />
                Ready when you are
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                One room. One conversation. One artifact.
              </h2>
              <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
                Tell me who's in the room and what you need them aligned on. I'll come back with dates.
              </p>
              <Button
                size="lg"
                className="bg-mint text-ink hover:bg-mint/90 font-bold px-8"
                onClick={requestImmersion}
              >
                Request a date <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
