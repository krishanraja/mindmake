import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, ExternalLink, Calendar, Wrench } from "lucide-react";
import { SEO } from "@/components/SEO";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: "easeOut" },
  }),
};

export type WorkshopOutcome = {
  heading: string;
  bullets: [string, string, string];
};

export type WorkshopPersona = {
  name: string;
  description: string;
};

export type WorkshopConfig = {
  slug: string;
  title: string;
  seoDescription: string;
  intro: [string, string, string];
  mavenUrl: string;
  mavenPublished: boolean;
  outcomes: [
    WorkshopOutcome,
    WorkshopOutcome,
    WorkshopOutcome,
    WorkshopOutcome,
    WorkshopOutcome,
    WorkshopOutcome
  ];
  personas: [WorkshopPersona, WorkshopPersona, WorkshopPersona];
};

const included = [
  "Lifetime access to CTRL, Mindmaker's flagship memory-web app",
  "Session recording you can revisit anytime",
  "Mindmaker alumni channel access",
  "Templates, prompts, and worksheets used in the workshop",
  "Certificate of completion",
  "Maven Guarantee: full refund within 14 days, no questions asked",
];

export const WorkshopPage = ({ config }: { config: WorkshopConfig }) => {
  const enrolLabel = config.mavenPublished ? "Enrol on Maven" : "Get notified";

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title={config.title}
        description={config.seoDescription}
        canonical={`/workshops/${config.slug}`}
        ogType="website"
      />
      <Navigation />

      {/* HERO */}
      <section className="section-padding pt-32">
        <div className="container-width max-w-5xl">
          <div className="grid md:grid-cols-[1.4fr_1fr] gap-10 md:gap-14 items-start">
            <motion.div initial="hidden" animate="show" variants={fadeUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/10 border border-mint/20 text-mint-dark dark:text-mint text-xs font-bold uppercase tracking-[0.18em] mb-6">
                <Wrench className="w-3.5 h-3.5" />
                Mindmaker Workshop
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {config.title}
              </h1>
              <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                <p>{config.intro[0]}</p>
                <p>{config.intro[1]}</p>
                <p>{config.intro[2]}</p>
              </div>
            </motion.div>

            {/* PRICE CARD */}
            <motion.aside
              className="glass-card editorial-card p-6 md:p-7 border border-mint/30 md:sticky md:top-28"
              initial="hidden"
              animate="show"
              custom={1}
              variants={fadeUp}
            >
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-3">
                Workshop
              </div>
              <div className="text-sm text-muted-foreground mb-5">
                One day · Hosted on Maven
              </div>
              <div className="flex items-center gap-2 text-sm mb-5 text-muted-foreground">
                <Calendar className="w-4 h-4 text-mint-dark dark:text-mint" />
                <span>Next dates listed on Maven</span>
              </div>
              <Button
                asChild
                size="lg"
                className="w-full bg-gradient-to-r from-mint to-emerald-400 text-ink hover:opacity-90 font-bold"
              >
                <a href={config.mavenUrl} target="_blank" rel="noopener noreferrer">
                  {enrolLabel}
                  <ExternalLink className="ml-2 w-4 h-4" />
                </a>
              </Button>
              {!config.mavenPublished && (
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                  This workshop opens for enrolment soon. Click through to follow the Mindmaker instructor page on Maven and get notified.
                </p>
              )}
            </motion.aside>
          </div>
        </div>
      </section>

      {/* WHAT YOU'LL LEARN */}
      <section className="section-padding bg-muted/30">
        <div className="container-width max-w-6xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">What you'll learn.</h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-2xl">
              Six concrete outcomes. You walk out with each of them.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {config.outcomes.map((o, i) => (
              <motion.article
                key={i}
                className="glass-card editorial-card p-7 border border-border/50"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                custom={i}
                variants={fadeUp}
              >
                <h3 className="text-lg md:text-xl font-bold mb-4">{o.heading}</h3>
                <ul className="space-y-2.5">
                  {o.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                      <CheckCircle className="w-4 h-4 text-mint shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* WHO THIS IS FOR */}
      <section className="section-padding">
        <div className="container-width max-w-5xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-10">Who this workshop is for.</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {config.personas.map((p, i) => (
              <motion.div
                key={i}
                className="glass-card editorial-card p-6 border border-border/50"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-3">
                  {p.name}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="section-padding bg-muted/30">
        <div className="container-width max-w-3xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-10">What's included.</h2>
          </motion.div>
          <ul className="space-y-3">
            {included.map((item, i) => (
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

      {/* CTA */}
      <section className="section-padding">
        <div className="container-width max-w-3xl text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to build with me?</h2>
            <p className="text-muted-foreground mb-6">
              Hosted on Maven. Refund within 14 days, no questions asked.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-mint to-emerald-400 text-ink hover:opacity-90 font-bold"
              >
                <a href={config.mavenUrl} target="_blank" rel="noopener noreferrer">
                  {enrolLabel}
                  <ExternalLink className="ml-2 w-4 h-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="font-bold"
              >
                <a href="/workshops">
                  See all workshops <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};
