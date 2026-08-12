import { motion } from "framer-motion";
import { ArrowRight, Check, Eye, ShieldCheck } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { BookFitCall } from "@/components/BookFitCall";
import { SEO } from "@/components/SEO";
import { ParticleBackground } from "@/components/Animations/ParticleBackground";
import { useTestimonials } from "@/hooks/useTestimonials";
import { attendeeBrands, clientStories } from "@/data/rebuildProof";

const reveal = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const decisions = [
  { name: "Product", detail: "What to build, stop or change" },
  { name: "Price", detail: "What to charge and how to package it" },
  { name: "Go to market", detail: "Who to sell to and what to say" },
  { name: "Company", detail: "How the team and plan need to change" },
];

const homeStories = clientStories.slice(0, 4);

export default function Index() {
  const { data: consented = [] } = useTestimonials();
  const canShowSteph = consented.some((item) =>
    `${item.company ?? ""} ${item.role ?? ""}`.toLowerCase().includes("legacy ascend"),
  );

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Commercial decisions shaped by AI"
        description="Mindmaker helps founders and business leaders make hard product, price, go-to-market and company decisions as AI changes the market."
        canonical="/"
      />
      <ParticleBackground />
      <Navigation />

      <section className="relative min-h-[92vh] overflow-hidden bg-ink text-white">
        <video className="absolute inset-0 h-full w-full object-cover opacity-[0.16]" src="/rising-cities.mp4" autoPlay loop muted playsInline aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink/95 to-ink-700/70" />
        <div className="absolute right-[12%] top-[20%] h-80 w-80 rounded-full bg-mint/15 blur-3xl" />

        <div className="container-width relative z-10 grid min-h-[92vh] items-center gap-12 pb-16 pt-32 lg:grid-cols-[1.15fr_.85fr] lg:pt-36">
          <motion.div initial="hidden" animate="show" variants={reveal}>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-mint">
              Krish Raja's commercial decision practice
            </p>
            <h1 className="max-w-4xl text-4xl font-bold leading-[1.04] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Make the right call as AI changes your business.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl">
              Mindmaker helps founders and business leaders decide what to build, how to price it, how to sell it and how the team should work. Then we help put the decision into action.
            </p>
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <BookFitCall source="homepage-hero" className="px-7 py-3.5 text-base" />
              <a href="/sprint" className="inline-flex min-h-12 items-center gap-2 px-2 text-sm font-semibold text-white/75 hover:text-mint">
                See the 21-day Sprint <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-8 max-w-2xl border-l-2 border-mint/60 pl-4 text-sm leading-relaxed text-white/60">
              Consultants, LLMs and the next hyped tool sell you point solutions built to extract your judgment, not build it.
            </p>
          </motion.div>

          <motion.div className="relative hidden min-h-[520px] lg:block" initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.18, duration: 0.7 }} aria-label="Krish speaking and working with business leaders">
            <img src="/krish-stage-1.jpg" alt="Krish Raja speaking on stage" className="absolute right-0 top-0 h-[360px] w-[72%] rounded-2xl object-cover shadow-2xl" />
            <img src="/krish-stage-3.png" alt="Krish Raja speaking with an audience" className="absolute bottom-0 left-0 h-[260px] w-[58%] rounded-2xl border-8 border-ink object-cover shadow-2xl" />
            <div className="absolute bottom-8 right-0 w-[45%] rounded-xl border border-white/15 bg-ink/90 p-5 backdrop-blur-md">
              <p className="text-3xl font-bold text-mint">17+ years</p>
              <p className="mt-1 text-sm text-white/65">in data, technology and product strategy</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative border-b border-border/50 bg-background py-14" aria-labelledby="reach-title">
        <div className="container-width grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <div>
            <h2 id="reach-title" className="text-2xl font-bold md:text-3xl">Mindmaker has helped over 4000 leaders with what's next in AI.</h2>
            <p className="mt-3 text-sm text-muted-foreground">Attended by people from organisations including</p>
          </div>
          <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-border/60 bg-card">
            {attendeeBrands.map((brand) => (
              <div key={brand.name} className="grid min-h-24 place-items-center border-r border-border/60 px-5 last:border-r-0">
                <img src={brand.logo} alt={brand.name} className="max-h-8 w-full max-w-32 object-contain opacity-70 grayscale dark:invert" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted" aria-labelledby="call-title">
        <div className="container-width max-w-6xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={reveal} className="max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint">When to call Mindmaker</p>
            <h2 id="call-title" className="text-3xl font-bold md:text-5xl">The problem is commercial. AI has changed the answer.</h2>
          </motion.div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <article className="editorial-card rounded-2xl border border-border/60 bg-background p-7 md:p-9">
              <p className="text-sm font-bold text-mint-dark dark:text-mint">01</p>
              <h3 className="mt-4 text-2xl font-bold">Faster startups are taking your market.</h3>
              <p className="mt-3 text-muted-foreground">You need to know what they can do that you cannot, what matters, and what to change first.</p>
            </article>
            <article className="editorial-card rounded-2xl border border-border/60 bg-background p-7 md:p-9">
              <p className="text-sm font-bold text-mint-dark dark:text-mint">02</p>
              <h3 className="mt-4 text-2xl font-bold">You can grow, but something is holding you back.</h3>
              <p className="mt-3 text-muted-foreground">The block may sit in the product, price, position or team. We find its part in the problem and make the call.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="work-with-me" className="section-padding relative overflow-hidden bg-ink text-white" aria-labelledby="sprint-title">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(/mindmaker-background-green.gif)", backgroundSize: "cover" }} />
        <div className="container-width relative z-10 grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={reveal}>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-mint">One paid offer</p>
            <h2 id="sprint-title" className="text-4xl font-bold text-white md:text-6xl">One decision. 21 days.</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              I research it, challenge it, model the choices and make the call with you. You give me decisions and introductions. No homework.
            </p>
            <BookFitCall source="homepage-sprint" className="mt-8" />
          </motion.div>
          <div>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
              {decisions.map((item) => (
                <div key={item.name} className="bg-ink/95 p-6">
                  <p className="text-sm font-bold text-mint">{item.name}</p>
                  <p className="mt-2 text-sm text-white/65">{item.detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-3 text-sm text-white/75 sm:grid-cols-3">
              {["The decision made", "The reason kept", "The first real action started"].map((item) => (
                <div key={item} className="flex items-start gap-2 rounded-xl border border-white/10 p-4"><Check className="mt-0.5 h-4 w-4 shrink-0 text-mint" />{item}</div>
              ))}
            </div>
            <a href="/sprint" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-mint">See how the Sprint works <ArrowRight className="h-4 w-4" /></a>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background" aria-labelledby="ctrl-title">
        <div className="container-width grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div className="relative overflow-hidden rounded-2xl border border-border/60 bg-ink p-2 shadow-2xl" initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.25 }}>
            <video src="/ctrl-demo-video.mp4" autoPlay loop muted playsInline className="aspect-video w-full rounded-xl object-cover" aria-label="A redacted view of CTRL by Mindmaker" />
            <div className="absolute bottom-5 left-5 rounded-md bg-ink/90 px-3 py-2 text-xs font-bold text-mint backdrop-blur">CTRL by Mindmaker</div>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={reveal}>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint">Not a deck that goes stale</p>
            <h2 id="ctrl-title" className="text-3xl font-bold md:text-5xl">You keep the thinking, not just the answer.</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Your private workspace holds the business context, the decision, the evidence and the reason behind it. It helps you test what you may have missed and keeps the useful parts current after the Sprint ends.
            </p>
            <ul className="mt-7 space-y-4">
              <li className="flex gap-3"><Eye className="mt-1 h-5 w-5 shrink-0 text-mint-dark dark:text-mint" /><span><strong>See the whole decision.</strong> The facts, guesses and open questions sit in one place.</span></li>
              <li className="flex gap-3"><ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-mint-dark dark:text-mint" /><span><strong>Keep your judgement.</strong> The system supports your thinking. It does not replace it.</span></li>
            </ul>
            {canShowSteph && (
              <blockquote className="mt-8 border-l-2 border-mint pl-5">
                <p className="text-sm leading-relaxed">“What's unique about Krish is that he never lets you become reliant on him. He puts you in the driver's seat, explains AI fundamentals in plain language, and empowers you to own the skills that actually move your business forward.”</p>
                <footer className="mt-3 text-xs font-bold text-muted-foreground">Steph Darmanin, Performance Coach, Legacy Ascend</footer>
              </blockquote>
            )}
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-muted" aria-labelledby="results-title">
        <div className="container-width">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint">Client results</p>
              <h2 id="results-title" className="text-3xl font-bold md:text-5xl">Decisions that changed the work.</h2>
            </div>
            <a href="/case-studies" className="inline-flex items-center gap-2 text-sm font-bold">See all eight stories <ArrowRight className="h-4 w-4" /></a>
          </div>
          <div className="mt-10 flex snap-x gap-5 overflow-x-auto pb-5 [scrollbar-width:thin]">
            {homeStories.map((story) => (
              <article key={story.id} className="min-w-[86%] snap-start rounded-2xl border border-border/60 bg-background p-7 sm:min-w-[58%] lg:min-w-[38%]">
                <h3 className="text-2xl font-bold">{story.title}</h3>
                <p className="mt-4 text-muted-foreground">{story.outcome}</p>
                <blockquote className="mt-7 border-t border-border/60 pt-5">
                  <p className="text-sm leading-relaxed">“{story.quote}”</p>
                  <footer className="mt-3 text-xs font-bold text-muted-foreground">{story.attribution}</footer>
                </blockquote>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-background" aria-labelledby="krish-title">
        <div className="container-width grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:items-center">
          <img src="/Krish-Headshot.png" alt="Krish Raja" className="mx-auto aspect-[4/5] w-full max-w-md rounded-2xl object-cover shadow-xl" />
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint">Why Krish</p>
            <h2 id="krish-title" className="text-3xl font-bold md:text-5xl">Built in business, not in a slide deck.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              I have spent more than 17 years working across data, technology and product strategy. For the last two years I have worked deep inside AI, building the systems and testing the business choices myself.
            </p>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              That mix matters. A decision about AI is often a decision about what you sell, how you make money and how the company works.
            </p>
            <blockquote className="mt-8 rounded-2xl border border-border/60 bg-muted p-6">
              <p className="leading-relaxed">“Intelligent and hardworking, with a deep understanding of data and tech, always good for a straight answer and willing to get his hands dirty.”</p>
              <footer className="mt-4 text-sm font-bold">Ashley Wales-Brown<span className="block font-normal text-muted-foreground">Digital Commerce Director, Mars United Commerce</span></footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="section-padding bg-ink text-white">
        <div className="container-width max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white md:text-5xl">One hard decision. One clear place to start.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">If AI has changed an important product, price, sales or company decision, use the fit call to see whether the Sprint is the right shape.</p>
          <BookFitCall source="homepage-final" className="mt-8" />
        </div>
      </section>

      <Footer />
    </main>
  );
}
