import { useCallback, useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const trackCta = () => {
  try {
    (window as unknown as { plausible?: (e: string) => void }).plausible?.(
      "operator_page_cta_clicked"
    );
  } catch {
    /* analytics optional */
  }
};

// 14 agents arranged by function. Drives the static diagram below.
const agentGroups = [
  {
    group: "Business development",
    agents: [
      { name: "Zara", role: "Lead qualification + intake" },
      { name: "Kai", role: "Outreach drafting + sequencing" },
      { name: "Nero", role: "Inbound triage + routing" },
    ],
  },
  {
    group: "Content",
    agents: [
      { name: "Maya", role: "Essay scaffolding + research" },
      { name: "Ravi", role: "Brief classification + ranking" },
      { name: "Theo", role: "Editorial QA + voice drift" },
    ],
  },
  {
    group: "Revenue",
    agents: [
      { name: "Sol", role: "Pricing experiments + memos" },
      { name: "June", role: "Commercial narrative drafts" },
    ],
  },
  {
    group: "Operations",
    agents: [
      { name: "Marcus", role: "Telegram notifications + on-call" },
      { name: "Iris", role: "Calendar + cohort scheduling" },
      { name: "Otto", role: "Billing + reconciliation" },
    ],
  },
  {
    group: "Monitoring",
    agents: [
      { name: "Ash", role: "Cost ceiling + model routing" },
      { name: "Lin", role: "Memory integrity + drift checks" },
      { name: "Noor", role: "Human-in-the-loop escalations" },
    ],
  },
];

const lessons = [
  {
    id: 1,
    headline: "Agents are not employees. Stop treating them like it.",
    body: "The 'AI teammate' metaphor leads to over-scoped, under-monitored agents that produce garbage at scale. Every broken fleet I've inspected starts with role-titles instead of verbs.",
    example:
      "Example: I scope agent responsibilities as verbs (score, route, validate, classify) rather than roles (analyst, researcher, assistant). Verbs bound the work. Roles bound nothing.",
  },
  {
    id: 2,
    headline: "Memory is a commercial decision, not a technical one.",
    body: "Most memory architecture conversations die in vector-database debates. The real question is what the business needs the system to remember, for how long, and who owns the decision to forget.",
    example:
      "Example: my private memory webs (per-operator context) and organizational memory layer (institutional knowledge) use different storage and different retrieval patterns on purpose. Different accountabilities.",
  },
  {
    id: 3,
    headline: "Cost optimization is a product feature, not an afterthought.",
    body: "Agent fleets break financially before they break operationally. You have to design for cost ceilings on day one or the first quarterly invoice ends the project.",
    example:
      "Example: cheap models for high-volume parse work, expensive models for judgment calls, hard caps at both ends with an escalation path to a human when the cap trips.",
  },
  {
    id: 4,
    headline: "Agent orchestration is where most AI products fail commercially.",
    body: "The reason your enterprise's AI capabilities aren't selling isn't the capabilities themselves. It's that nobody's designed the system that turns capability into commercial outcome.",
    example:
      "Example: this is the lesson most Revenue Architecture engagements start with. The commercial failure is an orchestration failure, not a model failure.",
  },
];

const stageImages = [
  "/krish-stage-1.jpg",
  "/krish-stage-2.png",
  "/krish-stage-3.png",
];

const StageCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [isPaused, setIsPaused] = useState(false);

  const advance = useCallback(() => {
    if (!api || isPaused) return;
    api.scrollNext();
  }, [api, isPaused]);

  useEffect(() => {
    if (!api) return;
    const interval = window.setInterval(advance, 3500);
    return () => window.clearInterval(interval);
  }, [api, advance]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Carousel
        setApi={setApi}
        opts={{ align: "center", loop: true, slidesToScroll: 1 }}
        orientation="horizontal"
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {stageImages.map((src, i) => (
            <CarouselItem
              key={src}
              className="pl-4 basis-[88%] sm:basis-[60%] md:basis-1/2 lg:basis-1/3"
            >
              <div className="rounded-xl overflow-hidden bg-ink border border-border/50 flex items-center justify-center h-56 md:h-64">
                <img
                  src={src}
                  alt={`Krish speaking on stage ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default function Operator() {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="How I operate: the 14-agent OS behind Mindmaker"
        description="Most AI advisors sell frameworks they've read. I operate the frameworks I sell. A 14-agent operating system managing a 13-venture portfolio. Memory, cost, and orchestration lessons from the system."
        canonical="/operator"
        ogType="article"
      />
      <Navigation />

      {/* HERO */}
      <section className="pt-24 pb-6 sm:pt-28 sm:pb-14 md:pt-32 md:pb-24 lg:pb-32 bg-ink text-white">
        <div className="container-width max-w-5xl">
          <motion.div initial="hidden" animate="show" variants={fadeUp} className="flex flex-col">
            <div className="order-1 text-xs font-bold uppercase tracking-[0.2em] text-mint mb-4 md:mb-6">
              How I operate
            </div>
            <h1 className="order-2 sm:order-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-5 leading-tight tracking-tight text-white">
              The operating system behind Mindmaker.
            </h1>
            <div className="order-3 sm:contents flex items-center gap-4">
              <motion.img
                src="/Krish-Headshot.png"
                alt="Krish Raja"
                loading="eager"
                decoding="async"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="sm:order-2 w-24 h-24 shrink-0 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full object-cover ring-1 ring-white/10 shadow-lg mb-0 sm:mb-5 md:mb-8"
              />
              <p className="sm:order-4 text-base sm:text-lg md:text-xl text-white/70 leading-relaxed max-w-3xl flex-1 sm:flex-none">
                Most advisors sell frameworks they read. I run the frameworks I sell.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* THESIS */}
      <section className="section-padding">
        <div className="container-width max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex justify-center md:justify-start"
            >
              <video
                src="/ctrl-demo-video.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full max-w-[280px] rounded-xl shadow-lg"
              />
            </motion.div>
            <div className="space-y-5 text-base md:text-lg leading-relaxed">
              <motion.p initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
                Every AI advisor claims to understand agentic systems. Very few have actually built one and kept it running.
              </motion.p>
              <motion.p
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                custom={1}
                variants={fadeUp}
                className="text-muted-foreground"
              >
                Mindmaker sits on top of a 14-agent operating system coordinating a 13-venture portfolio. It runs in production. It's cost-optimised. It's self-monitoring. It makes its own handoffs.
              </motion.p>
              <motion.p
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                custom={2}
                variants={fadeUp}
                className="text-muted-foreground"
              >
                The commercial strategy, positioning, and GTM work I do for clients is informed by this system. Every framework has been pressure-tested against real operating constraints: cost ceilings, agent handoffs, memory pollution, context drift.
              </motion.p>
              <motion.p
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                custom={3}
                variants={fadeUp}
                className="text-muted-foreground"
              >
                Layer that on sixteen years running P&amp;Ls, shaping tech product strategy, and — right now — leading GenAI advisory inside a global media enterprise. That's not a credential line. It's a day job.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* ARCHITECTURE (static diagram via typography) */}
      <section className="section-padding bg-muted/30">
        <div className="container-width max-w-5xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">The architecture.</h2>
            <p className="text-muted-foreground mb-10">
              14 agents, five functional clusters, one shared memory web.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-4 mb-6">
            {agentGroups.map((group, i) => (
              <motion.div
                key={group.group}
                className="rounded-2xl p-5 border border-border/50 bg-background"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                custom={i}
                variants={fadeUp}
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-3">
                  {group.group}
                </div>
                <ul className="space-y-3">
                  {group.agents.map((a) => (
                    <li key={a.name}>
                      <div className="font-bold text-sm">{a.name}</div>
                      <div className="text-[11px] text-muted-foreground leading-snug">
                        {a.role}
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="text-center text-sm text-muted-foreground italic">
            14 agents. One memory web. Zero human in the loop for routine work.
          </div>

        </div>
      </section>

      {/* FOUR LESSONS */}
      <section className="section-padding">
        <div className="container-width max-w-4xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Four extractable lessons.</h2>
            <p className="text-muted-foreground mb-10">
              Pattern recognition from a system running under real constraints.
            </p>
          </motion.div>

          <div className="space-y-5">
            {lessons.map((lesson, i) => (
              <motion.article
                key={lesson.id}
                className="glass-card editorial-card p-7 border border-border/50"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                custom={i}
                variants={fadeUp}
              >
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint">
                    Lesson 0{lesson.id}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 leading-snug">
                  {lesson.headline}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-3">{lesson.body}</p>
                <p className="text-sm text-foreground leading-relaxed">{lesson.example}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* STAGE / IN-THE-WILD */}
      <section className="section-padding bg-background border-t border-border/40">
        <div className="container-width max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="mb-10"
          >
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-mint-dark dark:text-mint mb-3">
              On stage
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Where I've been talking about this.
            </h2>
          </motion.div>
          <StageCarousel />
        </div>
      </section>

      {/* COMMERCIAL CROSSOVER */}
      <section className="section-padding bg-muted/30">
        <div className="container-width max-w-3xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <h2 className="text-2xl md:text-3xl font-bold mb-5">
              What this means if you're commercializing AI.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-5">
              If you've built AI capabilities and they're not converting to revenue, the problem is almost never the capabilities. It's the system around them: the positioning, the pricing, the commercial narrative, the agent-to-customer handoff. The Revenue Architecture engagement applies the operating patterns from this page to your commercial architecture. You don't need a consultant explaining agents. You need an operator who's already run the playbook you're about to build.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-ink dark:bg-mint text-white dark:text-ink hover:opacity-90 font-bold"
              onClick={trackCta}
            >
              <a href="/enterprise#revenue-architecture">
                See Revenue Architecture <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
