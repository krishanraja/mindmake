import { motion } from "framer-motion";
import { Check, Compass, Database, Search, Swords } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { BookFitCall } from "@/components/BookFitCall";
import { SEO } from "@/components/SEO";

const steps = [
  { icon: Search, title: "Find what is really stuck", body: "I speak to the right people, read what matters and test the story the business is telling itself." },
  { icon: Swords, title: "Challenge the choices", body: "We test the product, price, position and team. Weak claims come out. Useful facts stay." },
  { icon: Compass, title: "Make the call", body: "We choose a path, keep the reason and name what would make us change our minds." },
  { icon: Database, title: "Start the first real action", body: "The work does not end with advice. The first material step starts before the Sprint ends." },
];

export default function Sprint() {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="The Sprint"
        description="A 21-day Sprint with Krish Raja to resolve one hard product, price, go-to-market or company decision shaped by AI."
        canonical="/sprint"
      />
      <Navigation />

      <section className="relative overflow-hidden bg-ink pb-20 pt-32 text-white md:pb-28 md:pt-40">
        <video className="absolute inset-0 h-full w-full object-cover opacity-10" src="/MM-Home-Page.mp4" autoPlay loop muted playsInline aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink/95 to-ink-700/80" />
        <div className="container-width relative z-10 grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-mint">The Sprint</p>
            <h1 className="max-w-4xl text-4xl font-bold leading-[1.04] text-white sm:text-5xl md:text-6xl lg:text-7xl">One hard business decision. Settled in 21 days.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl">
              For a founder, CEO, CRO or strategy leader making a big product, price, go-to-market or company decision as AI changes the market.
            </p>
            <BookFitCall source="sprint-hero" className="mt-8 px-7 py-3.5 text-base" />
          </motion.div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md md:p-8">
            <p className="text-sm font-bold text-mint">What you bring</p>
            <p className="mt-3 text-xl font-bold text-white">A decision that is stuck and costly enough to matter.</p>
            <p className="mt-4 text-sm leading-relaxed text-white/65">You give me decisions and introductions. I do the research, challenge, modelling and coordination. No homework.</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background" aria-labelledby="work-title">
        <div className="container-width max-w-6xl">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint">How the 21 days work</p>
            <h2 id="work-title" className="text-3xl font-bold md:text-5xl">The work bends around the decision.</h2>
            <p className="mt-5 text-lg text-muted-foreground">There is no fixed workshop plan. The decision sets the research, people and tests we need.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {steps.map((step, index) => (
              <article key={step.title} className="rounded-2xl border border-border/60 bg-card p-7">
                <div className="flex items-center justify-between">
                  <step.icon className="h-5 w-5 text-mint-dark dark:text-mint" />
                  <span className="text-xs font-bold text-muted-foreground">0{index + 1}</span>
                </div>
                <h3 className="mt-7 text-2xl font-bold">{step.title}</h3>
                <p className="mt-3 text-muted-foreground">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted" aria-labelledby="end-title">
        <div className="container-width grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint">What you leave with</p>
            <h2 id="end-title" className="text-3xl font-bold md:text-5xl">A decision that can survive the next question.</h2>
          </div>
          <div className="space-y-4">
            {[
              "The decision made and the trade-offs written down",
              "The evidence and reasoning kept in your private CTRL workspace",
              "The first material action already under way",
              "A clearer way to make the next decision without renting an answer",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-border/60 bg-background p-5">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-mint-dark dark:text-mint" />
                <p className="font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-background" aria-labelledby="fit-title">
        <div className="container-width max-w-5xl">
          <div className="grid gap-10 rounded-2xl border border-border/60 bg-card p-7 md:p-10 lg:grid-cols-2">
            <div>
              <h2 id="fit-title" className="text-3xl font-bold">A good fit</h2>
              <ul className="mt-6 space-y-4 text-sm">
                {["The decision affects revenue, product or the shape of the company", "AI has changed the facts or made old assumptions less safe", "A senior leader can make the call and open the right doors", "The business wants a clear end date, not a retainer"].map((item) => <li key={item} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-mint-dark dark:text-mint" />{item}</li>)}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold">Not a good fit</h2>
              <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
                {["General AI training or a certificate", "A fractional executive role or open retainer", "Production IT work or a list of automations", "A deck that makes a decision look finished without starting the work"].map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-ink text-center text-white">
        <div className="container-width max-w-3xl">
          <h2 className="text-3xl font-bold text-white md:text-5xl">Start with the decision.</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">Use the fit call to check whether the decision is clear enough, important enough and a fit for the Sprint.</p>
          <BookFitCall source="sprint-final" className="mt-8" />
        </div>
      </section>

      <Footer />
    </main>
  );
}
