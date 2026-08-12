import { useCallback, useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { BookFitCall } from "@/components/BookFitCall";
import { motion } from "framer-motion";
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
    headline: "Give each AI worker one clear job.",
    body: "An AI worker fails when its job is too wide and nobody checks it. The strongest systems start with a small, clear action.",
    example:
      "Example: I define the job with words such as score, route, check or sort. That is much clearer than calling it an analyst or assistant.",
  },
  {
    id: 2,
    headline: "Choose what AI should remember.",
    body: "The useful question is not which database to buy. It is what the business needs the system to remember, for how long and who can tell it to forget.",
    example:
      "Example: private notes for one person and shared company knowledge are kept apart on purpose. Different people are responsible for each one.",
  },
  {
    id: 3,
    headline: "Set a cost limit from day one.",
    body: "A useful AI system can still fail because it costs too much to run. The cost limit must be part of the design from the start.",
    example:
      "Example: I use lower-cost AI for simple work and stronger AI for hard judgement calls. A person steps in when the limit is reached.",
  },
  {
    id: 4,
    headline: "Good AI tools still need a path into the business.",
    body: "A strong AI tool will not create a business result on its own. The team still needs a clear path from what the tool can do to what a customer will pay for.",
    example:
      "Example: this is a common Sprint starting point. The AI may work well, but the product, price or sales handoff around it does not.",
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
        title="How Mindmaker Works Behind the Scenes"
        description="See the real AI system Krish uses to run Mindmaker, manage cost and keep useful company knowledge."
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
              How Mindmaker works behind the scenes.
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
                Many AI advisers talk about systems made of AI workers. Very few have built one and kept it running.
              </motion.p>
              <motion.p
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                custom={1}
                variants={fadeUp}
                className="text-muted-foreground"
              >
                Mindmaker uses 14 small AI workers across a group of 13 ventures. The system runs every day, watches its own cost limit and passes work from one job to the next.
              </motion.p>
              <motion.p
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                custom={2}
                variants={fadeUp}
                className="text-muted-foreground"
              >
                The product, position and sales work I do for clients is shaped by this system. Every method has been tested against real limits such as cost, poor handoffs and out-of-date knowledge.
              </motion.p>
              <motion.p
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                custom={3}
                variants={fadeUp}
                className="text-muted-foreground"
              >
                Add more than 17 years running businesses and shaping technology products. This is not a line on a slide. It is work I do every day.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* ARCHITECTURE (static diagram via typography) */}
      <section className="section-padding bg-muted/30">
        <div className="container-width max-w-5xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">How it fits together.</h2>
            <p className="text-muted-foreground mb-10">
              14 AI workers, five job groups and one shared memory.
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
              What this means for a commercial decision.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-5">
              If the work is not turning into revenue, the problem is often around it: the position, price, story or handoff to the customer. The Sprint uses the operating lessons on this page to resolve one decision and start the first real action.
            </p>
            <BookFitCall source="operator-final" />
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
