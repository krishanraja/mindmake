import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Wrench, Network, Code2, Workflow, Brain } from "lucide-react";
import { SEO } from "@/components/SEO";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const openConsultModal = (detail?: Record<string, unknown>) => {
  window.dispatchEvent(
    new CustomEvent("openConsultModal", { detail: detail || {} })
  );
};

const WORKSHOPS = [
  {
    slug: "build-your-ai-chief-of-staff",
    title: "Build Your AI Chief of Staff",
    icon: Wrench,
    blurb:
      "Build the AI assistant that actually shows up to work. Connected to your real inbox, calendar, and chat channels, deployed live during the session.",
  },
  {
    slug: "map-your-agentic-org-chart",
    title: "Map Your Agentic Org Chart",
    icon: Network,
    blurb:
      "Design the agent fleet your business actually needs. By end of day you have a complete agent-native org chart, with named roles and a 90-day build sequence.",
  },
  {
    slug: "vibe-coding-for-leaders",
    title: "Vibe Coding for Leaders",
    icon: Code2,
    blurb:
      "Ship the internal tool you've been waiting six months for IT to build. Working tool, live URL, deployed by end of day. No coding required.",
  },
  {
    slug: "build-an-autonomous-business-function",
    title: "Build an Autonomous Business Function",
    icon: Workflow,
    blurb:
      "Build the workflow that runs without you. Real n8n or Make workflow, deployed on your real business, running by end of session.",
  },
  {
    slug: "give-your-ai-memory",
    title: "Give Your AI Memory",
    icon: Brain,
    blurb:
      "Build the memory web that makes your AI worth using. Stop re-explaining your business every Monday. Private, portable, deployed by end of day.",
  },
];

export default function Workshops() {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Workshops"
        description="Five one-day workshops on Maven. Build alongside Krish Raja, operator running a 14-agent AI business. From $599."
        canonical="/workshops"
        ogType="website"
      />
      <Navigation />

      {/* HERO */}
      <section className="section-padding pt-32">
        <div className="container-width max-w-4xl text-center">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/10 border border-mint/20 text-mint-dark dark:text-mint text-xs font-bold uppercase tracking-[0.18em] mb-6">
              <Wrench className="w-3.5 h-3.5" />
              Mindmaker Workshops
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
              Build alongside <span className="text-mint-dark dark:text-mint">me.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Five one-day workshops. You don't watch me build. You build with me. By the end of the session you walk out with a real artefact deployed on your real surface. Hosted on Maven.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-mint to-emerald-400 text-ink hover:opacity-90 font-bold px-8"
                onClick={() => {
                  document.getElementById("workshops-grid")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Explore the workshops <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-bold"
                onClick={() => openConsultModal({ preselected: "workshop" })}
              >
                Book a call
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* GRID */}
      <section id="workshops-grid" className="section-padding scroll-mt-24">
        <div className="container-width max-w-6xl">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {WORKSHOPS.map((w, i) => {
              const Icon = w.icon;
              return (
                <motion.article
                  key={w.slug}
                  className="glass-card editorial-card p-7 md:p-8 flex flex-col h-full border border-border/50 hover:border-mint/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-mint/10 transition-all duration-300"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-50px" }}
                  custom={i}
                  variants={fadeUp}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-mint/10 border border-mint/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-mint-dark dark:text-mint" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl md:text-2xl font-bold leading-tight">{w.title}</h2>
                      <div className="text-xs text-muted-foreground mt-1">
                        $599 · 1 day · Hosted on Maven
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
                    {w.blurb}
                  </p>
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-ink dark:bg-mint text-white dark:text-ink hover:opacity-90 font-bold"
                  >
                    <a href={`/workshops/${w.slug}`}>
                      See workshop <ArrowRight className="ml-2 w-4 h-4" />
                    </a>
                  </Button>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW WORKSHOPS WORK */}
      <section className="section-padding bg-muted/30">
        <div className="container-width max-w-3xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How workshops work.</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Each workshop runs roughly five hours live. We frame the problem in 30 minutes. I drive the build for 90 minutes so you see the operator workflow live. We break. Then you build in parallel with me in the room. We close with show-and-tell. You leave with a working artefact, not slides. Every workshop includes lifetime access to CTRL, Mindmaker's flagship memory-web app, session recording, alumni channel access, and the templates and prompts used in the workshop.
            </p>
          </motion.div>
        </div>
      </section>

      {/* LINKAGE TO COHORT */}
      <section className="section-padding">
        <div className="container-width max-w-3xl">
          <motion.div
            className="glass-card editorial-card p-8 md:p-10 border border-mint/30"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              Done a workshop and ready for the next step?
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Workshop alumni get $500 off the AI-Fluent Executive cohort. The cohort is where the deeper, peer-validated decision work happens, in a small group of senior operators over four weeks.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-mint to-emerald-400 text-ink hover:opacity-90 font-bold"
            >
              <a href="/cohort">
                See the Cohort <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
