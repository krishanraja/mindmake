import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.45, ease: "easeOut" },
  }),
};

// Copy lives up here so it's easy to tweak without hunting through markup.
const LEAD_LINE = "I'm the anti-consultant. I don't deliver slides, I deliver systems.";
const SUPPORTING_COPY =
  "Mindmaker is me running a portfolio of agentic businesses, not writing about them. The playbook you'll see on a call is the same one my own systems run on.";

const tiles = [
  {
    label: "Architecture",
    claim: "A 14-agent fleet with named roles and memory webs.",
    elaboration:
      "Cross-system dependency mapping. Agent boundaries designed for delegation, not chaos.",
  },
  {
    label: "Optimization",
    claim: "Cost patterns running in production across Anthropic, Gemini, and OpenAI.",
    elaboration:
      "Model routing, fallback logic, and usage governance, built because the bills forced me to.",
  },
  {
    label: "Memory",
    claim: "Memory architecture for individual operators and organizational knowledge.",
    elaboration:
      "The same patterns I apply for clients. Private memory webs, structured retrieval, institutional context that persists.",
  },
];

const trackCta = (cta: string) => {
  try {
    (window as unknown as { plausible?: (e: string, o?: object) => void }).plausible?.(
      "operators_edge_cta_clicked",
      { props: { cta } }
    );
  } catch {
    /* analytics optional */
  }
};

const OperatorsEdge = () => {
  return (
    <section
      className="relative border-t border-white/10 bg-gradient-to-b from-ink via-ink to-[#0a1612] text-white py-28 md:py-32"
    >
      <div className="container-width max-w-5xl">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          {/* Section eyebrow — matches other homepage sections */}
          <motion.div
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-mint/80 mb-5"
            variants={fadeUp}
            custom={0}
          >
            <span className="h-1 w-1 rounded-full bg-mint" />
            Who you're working with
          </motion.div>

          {/* Heading — matches FrameworkJourney scale + partial-mint treatment */}
          <motion.h2
            className="text-[1.35rem] sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5"
            variants={fadeUp}
            custom={1}
          >
            Beyond <span className="text-mint">pattern</span> recognition
          </motion.h2>

          {/* Lead line — human voice, not AI-written */}
          <motion.p
            className="text-base md:text-lg text-white/70 leading-relaxed max-w-2xl mx-auto"
            variants={fadeUp}
            custom={2}
          >
            {LEAD_LINE}
          </motion.p>

          {/* Supporting paragraph — trimmed */}
          <motion.p
            className="mt-4 text-sm md:text-base text-white/50 leading-relaxed max-w-2xl mx-auto"
            variants={fadeUp}
            custom={3}
          >
            {SUPPORTING_COPY}
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {tiles.map((tile, i) => (
            <motion.div
              key={tile.label}
              className="rounded-2xl p-7 bg-white/5 border border-white/10 backdrop-blur-sm"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              custom={4 + i}
              variants={fadeUp}
            >
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-mint mb-4">
                {tile.label}
              </div>
              <p className="font-bold text-white text-lg leading-snug mb-3">
                {tile.claim}
              </p>
              <p className="text-sm text-white/60 leading-relaxed">
                {tile.elaboration}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center space-y-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          custom={7}
          variants={fadeUp}
        >
          <p className="text-sm md:text-base text-white/75">
            Want the architectural playbook? It's the core of the Revenue Architecture engagement.{" "}
            <a
              href="/enterprise#revenue-architecture"
              onClick={() => trackCta("revenue-architecture")}
              className="font-bold text-mint hover:underline underline-offset-4 inline-flex items-center gap-1.5"
            >
              See Revenue Architecture <ArrowRight className="w-4 h-4" />
            </a>
          </p>
          <p className="text-xs text-white/50">
            Or go deeper:{" "}
            <a
              href="/operator"
              onClick={() => trackCta("operator")}
              className="text-white/70 hover:text-mint underline underline-offset-4"
            >
              How I operate &rarr;
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default OperatorsEdge;
