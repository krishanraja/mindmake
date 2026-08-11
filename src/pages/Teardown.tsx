import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, FileText, Layers, Search } from "lucide-react";
import { SEO } from "@/components/SEO";
import { TEARDOWN, offerJsonLd } from "@/lib/offers";
import { useOfferPrice } from "@/contexts/CurrencyContext";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";

const SITE = "https://www.themindmaker.ai";

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
      detail: { source_page: "/teardown", mode: "full" },
    }),
  );
};

const method = [
  {
    icon: Layers,
    title: "Your decision comes apart.",
    body: "Whatever you bring gets broken into the claims it is actually resting on. Most decisions turn out to rest on four or five, and most people have never written them down.",
  },
  {
    icon: Search,
    title: "Every claim gets checked.",
    body: "Each one is tested against live evidence and comes back with a reliability tier, so you can see which parts of your thinking are load-bearing and which are just repeated.",
  },
  {
    icon: CheckCircle,
    title: "Every consideration gets classed.",
    body: "External, meaning the world decides. Only you, meaning no amount of research will help. Or nobody yet, meaning the answer does not exist and waiting will not produce it.",
  },
  {
    icon: FileText,
    title: "Four models cross-examine it.",
    body: "Where they disagree, you see the disagreement. Averaging four models into one confident answer hides exactly the part you needed to look at.",
  },
];

const walkOutWith = [
  "A one-page memo you can send to whoever needs to read it next",
  "Your decision mapped to its load-bearing claims, each with a reliability tier",
  "Every consideration classed External, Only you, or Nobody yet",
  "The four-model cross-examination with disagreements preserved, not averaged",
  "Three claims placed under a 90-day watch, so you know what would change your mind",
  "A CTRL workspace with your decision map in it",
];

export default function Teardown() {
  const price = useOfferPrice(TEARDOWN);

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="The Teardown"
        description="Ten business days. One real decision, taken apart into the claims it rests on, each checked against live evidence and cross-examined across four models. Under two hours of your time."
        canonical="/teardown"
        ogType="website"
        jsonLd={offerJsonLd(TEARDOWN, SITE)}
      />
      <Navigation />

      {/* HERO */}
      <section className="section-padding pt-32">
        <div className="container-width max-w-4xl">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/10 border border-mint/20 text-mint-dark dark:text-mint text-xs font-bold uppercase tracking-[0.18em] mb-6">
              <Clock className="w-3.5 h-3.5" />
              The Teardown
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
              Bring the decision you keep not making.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
              Ten business days. Under two hours of your time. You get back the decision
              taken apart: what it actually rests on, which of those parts survive contact
              with evidence, and which are yours alone to call.
            </p>

            {/*
              tabular-nums plus a reserved min-width so switching currency
              does not reflow the row: AUD carries the longest strings and
              would otherwise shove the label around on every click.
            */}
            <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-3">
              <span
                data-price
                className="min-w-[7ch] whitespace-nowrap text-3xl sm:text-4xl font-bold tabular-nums"
              >
                {price}
              </span>
              <span className="text-muted-foreground">{TEARDOWN.tiers[0].label}</span>
              <CurrencySwitcher idPrefix="teardown-currency" className="sm:ml-1" />
            </div>
            <p className="text-sm text-muted-foreground mb-8">
              Ten business days from kickoff.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                onClick={openDiagnosisRoom}
                className="bg-ink dark:bg-mint text-white dark:text-ink hover:opacity-90 font-bold"
              >
                Bring me one real decision
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* METHOD */}
      <section className="section-padding border-t border-border/40">
        <div className="container-width max-w-4xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            What actually happens.
          </motion.h2>
          <motion.p
            className="text-muted-foreground mb-10 max-w-2xl leading-relaxed"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            No workshop, no discovery phase, no deck. You hand over one decision and get
            back the anatomy of it.
          </motion.p>

          <div className="grid md:grid-cols-2 gap-5">
            {method.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.title}
                  className="glass-card editorial-card p-6 border border-border/50"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-80px" }}
                  variants={fadeUp}
                  custom={i}
                >
                  <Icon className="w-5 h-5 text-mint-dark dark:text-mint mb-4" />
                  <h3 className="text-lg font-bold mb-2">{m.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{m.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHAT YOU KEEP */}
      <section className="section-padding border-t border-border/40">
        <div className="container-width max-w-4xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            What you keep.
          </motion.h2>
          <motion.ul
            className="space-y-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            {walkOutWith.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-mint shrink-0 mt-1" />
                <span className="text-sm md:text-base">{item}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* HONESTY */}
      <section className="section-padding border-t border-border/40">
        <div className="container-width max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">When not to buy this.</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If the decision is already made and you want cover for it, this will be
              uncomfortable and you should skip it. If nobody has named the decision yet,
              start in the Diagnosis Room instead, free, and come back when you have one.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              A Teardown is also the gate for{" "}
              <a
                href="/handover"
                className="text-emerald-deep dark:text-mint font-semibold underline underline-offset-4"
              >
                The Handover
              </a>
              . Nobody buys six weeks of my time without us both seeing how one decision
              goes first.
            </p>
          </motion.div>
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
              Name the decision. I'll tell you if it's worth{" "}
              <span data-price className="whitespace-nowrap tabular-nums">
                {price}
              </span>
              .
            </h2>
            <p className="text-muted-foreground mb-7 max-w-xl mx-auto leading-relaxed">
              Work it through with Mindy first. It takes a few minutes, costs nothing, and
              it will tell you plainly if a Teardown is the wrong spend.
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
