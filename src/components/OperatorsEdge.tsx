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
    <section className="relative py-20 sm:py-24 md:py-28 bg-ink text-white">
      <div className="container-width max-w-5xl">
        <motion.div
          className="text-center mb-10 md:mb-14"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-mint leading-[0.95] mb-6"
            variants={fadeUp}
            custom={0}
            style={{ textShadow: "0 0 60px hsl(158 82% 73% / 0.25)" }}
          >
            Beyond Pattern<br />Recognition
          </motion.h2>
          <motion.p
            className="text-lg md:text-2xl font-semibold text-white leading-snug tracking-tight max-w-3xl mx-auto"
            variants={fadeUp}
            custom={1}
          >
            I'm not theorizing about agentic business. I'm running one.
          </motion.p>
          <motion.p
            className="mt-6 text-base md:text-lg text-white/70 leading-relaxed max-w-3xl mx-auto"
            variants={fadeUp}
            custom={2}
          >
            Mindmaker sits on top of a 14-agent operating system managing a 13-venture portfolio. The memory architectures, cost optimization patterns, delegation frameworks, and agent boundaries I teach are pressure-tested daily in production. When you hire me, you're not buying theory. You're buying a playbook built under real operating constraints.
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
              custom={3 + i}
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
          custom={6}
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
              How I operate →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default OperatorsEdge;
