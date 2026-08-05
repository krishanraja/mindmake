import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Lock } from "lucide-react";
import { SEO } from "@/components/SEO";
import {
  HANDOVER_ANNUAL_CAP,
  HANDOVER_PRICE_LARGE,
  HANDOVER_PRICE_SMALL,
  PUBLICITY_DISCOUNT,
} from "@/lib/offers";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const openDiagnosisRoom = () => {
  window.dispatchEvent(
    new CustomEvent("openDiagnosisRoom", {
      detail: { source_page: "/handover", mode: "full" },
    }),
  );
};

const weeks = [
  {
    week: "Week 1",
    title: "Load and correct your context.",
    body: "Everything the system needs to know about how your business actually makes money goes in, and the wrong parts get corrected. Most of week one is discovering what the org believes that is no longer true.",
  },
  {
    week: "Week 2",
    title: "Adversarial pre-mortem.",
    body: "We assume the plan failed and work backwards to why. Done properly this is the least comfortable week and the one that saves the most money.",
  },
  {
    week: "Week 3",
    title: "The fork.",
    body: "If you are not AI-native, we rebuild GTM, pricing and positioning around what AI actually changes about your economics. If you are, we set the build order instead.",
  },
  {
    week: "Week 4",
    title: "You drive.",
    body: "You run it, I watch and correct. The point of the whole engagement is what happens when the person doing the work is you.",
  },
  {
    week: "Week 5",
    title: "I don't attend.",
    body: "You run the week without me. If it only works when I'm in the room, it does not work, and week five is where we both find that out while there is still time to fix it.",
  },
  {
    week: "Week 6",
    title: "Exit.",
    body: "We close it out and I leave. You keep the system, the context, and the way of deciding. A Day 90 recheck is included, so the exit is a date, not a drift.",
  },
];

const forWho = [
  "50 to 5,000 people, sweet spot 100 to 1,000",
  "You are the CEO, CRO, or VP Product: the seat accountable for whether it sells",
  "You have completed a Teardown, so we both know how one decision goes",
  "You want to stop depending on an outside advisor, not formalise the dependency",
];

export default function Handover() {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="The Handover"
        description="Six weeks. We rebuild how your business decides and sells with AI, then I leave and you keep it. Week five I don't attend. Day 90 recheck included. $30,000 under 250 people, $50,000 up to 5,000."
        canonical="/handover"
        ogType="website"
      />
      <Navigation />

      {/* HERO */}
      <section className="section-padding pt-32">
        <div className="container-width max-w-4xl">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/10 border border-mint/20 text-mint-dark dark:text-mint text-xs font-bold uppercase tracking-[0.18em] mb-6">
              <Lock className="w-3.5 h-3.5" />
              The Handover
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
              Six weeks. Then I leave and you keep it.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
              Consultants are built so the engagement never ends. This one is built to
              end, on a date you know at the start. In week five I don't attend at all,
              because a system that only runs when I'm in the room is not a system.
            </p>

            <div className="flex flex-wrap items-baseline gap-3 mb-2">
              <span className="text-4xl font-bold">{HANDOVER_PRICE_SMALL}</span>
              <span className="text-muted-foreground">under 250 people</span>
            </div>
            <div className="flex flex-wrap items-baseline gap-3 mb-2">
              <span className="text-2xl font-bold">{HANDOVER_PRICE_LARGE}</span>
              <span className="text-muted-foreground">250 to 5,000 people</span>
            </div>
            <p className="text-sm text-muted-foreground mb-8">
              {PUBLICITY_DISCOUNT} I take {HANDOVER_ANNUAL_CAP} of these a year, which is
              the honest number for work I do personally.
            </p>

            <Button
              size="lg"
              onClick={openDiagnosisRoom}
              className="bg-ink dark:bg-mint text-white dark:text-ink hover:opacity-90 font-bold"
            >
              Bring me one real decision
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* GATE */}
      <section className="section-padding border-t border-border/40">
        <div className="container-width max-w-3xl">
          <motion.div
            className="glass-card editorial-card p-6 md:p-8 border border-mint/30"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <h2 className="text-xl md:text-2xl font-bold mb-3">
              You can't buy this first.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Every Handover starts with{" "}
              <a
                href="/teardown"
                className="text-emerald-deep dark:text-mint font-semibold underline underline-offset-4"
              >
                a Teardown
              </a>
              . Ten days, one decision, {""}
              <span className="whitespace-nowrap">$3,500</span>. It is how we both find
              out whether six weeks together is a good idea, and it has talked people out
              of this as often as into it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* THE SIX WEEKS */}
      <section className="section-padding border-t border-border/40">
        <div className="container-width max-w-4xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-10"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            The six weeks.
          </motion.h2>

          <div className="space-y-4">
            {weeks.map((w, i) => (
              <motion.div
                key={w.week}
                className="glass-card editorial-card p-6 border border-border/50"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                custom={i}
              >
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-2">
                  {w.week}
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2">{w.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {w.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO */}
      <section className="section-padding border-t border-border/40">
        <div className="container-width max-w-4xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            Who it's for.
          </motion.h2>
          <motion.ul
            className="space-y-3 mb-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            {forWho.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-mint shrink-0 mt-1" />
                <span className="text-sm md:text-base">{item}</span>
              </li>
            ))}
          </motion.ul>
          <motion.p
            className="text-muted-foreground leading-relaxed max-w-2xl"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            Not the CTO. This is commercial work, and the person who has to live with the
            answer is the one accountable for whether it sells. Engineering and commercial
            are different problems.
          </motion.p>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding border-t border-border/40">
        <div className="container-width max-w-3xl text-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start with the decision, not the engagement.
            </h2>
            <p className="text-muted-foreground mb-7 max-w-xl mx-auto leading-relaxed">
              Tell me what you're actually stuck on. If a Handover is the wrong shape for
              it, I would rather say so now than six weeks in.
            </p>
            <Button
              size="lg"
              onClick={openDiagnosisRoom}
              className="bg-ink dark:bg-mint text-white dark:text-ink hover:opacity-90 font-bold"
            >
              Bring me one real decision
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
