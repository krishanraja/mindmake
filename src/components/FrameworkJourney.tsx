import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FileCheck, Zap, Target } from "lucide-react";

const FrameworkJourney = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-width">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Mind Set &rarr; Mind Map &rarr; Mind Make
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every leader who works with Mindmaker passes through these three phases. Most of your nervous decisions get resolved in the first one.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <MindSetPanel />
          <MindMapPanel />
          <MindMakePanel />
        </div>
      </div>
    </section>
  );
};

const chaosItems = [
  "GPT-4", "Claude", "Copilot", "Gemini", "Midjourney", "Perplexity",
  "Vendor deck", "Board memo", "LinkedIn post", "McKinsey report",
  "Colleague's tip", "CTO's roadmap",
];

const MindSetPanel = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="glass-card p-8 flex flex-col">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold mb-1">Clarity</h3>
        <p className="text-sm text-mint">Mind Set</p>
      </div>

      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        You're drowning in AI noise. 14 tools pitched this quarter, 3 vendor decks on your desk, and a board asking for "the AI strategy." Mind Set cuts through all of it.
      </p>

      <ul className="space-y-2 mb-6 text-sm">
        <li className="flex items-start gap-2">
          <Target className="w-4 h-4 text-mint shrink-0 mt-0.5" />
          <span><strong>AI Landscape Compression</strong> &mdash; filter noise into what's relevant to your context</span>
        </li>
        <li className="flex items-start gap-2">
          <Target className="w-4 h-4 text-mint shrink-0 mt-0.5" />
          <span><strong>Tool Commitment</strong> &mdash; decide what to commit to vs experiment with vs discard</span>
        </li>
        <li className="flex items-start gap-2">
          <Target className="w-4 h-4 text-mint shrink-0 mt-0.5" />
          <span><strong>Personal AI Manifesto</strong> &mdash; set your boundaries on privacy, delegation, and model reliance</span>
        </li>
      </ul>

      {/* Chaos-to-clarity animation */}
      <div className="relative h-44 overflow-hidden rounded-lg bg-ink/5 mt-auto">
        {/* Chaos phase */}
        {chaosItems.map((item, i) => (
          <motion.span
            key={i}
            className="absolute px-2 py-0.5 bg-mint/15 text-[10px] rounded border border-mint/20 whitespace-nowrap"
            style={{
              left: `${(i % 4) * 25 + Math.random() * 10}%`,
              top: `${Math.floor(i / 4) * 33 + Math.random() * 15}%`,
            }}
            initial={{
              opacity: 0.9,
              scale: 0.7 + Math.random() * 0.6,
              rotate: -15 + Math.random() * 30,
            }}
            animate={
              isInView
                ? {
                    opacity: 0,
                    scale: 0.2,
                    x: "50%",
                    y: "50%",
                    rotate: 0,
                  }
                : {}
            }
            transition={{
              duration: 1.2,
              delay: i * 0.08,
              ease: "easeIn",
            }}
          >
            {item}
          </motion.span>
        ))}

        {/* Clarity result */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <FileCheck className="w-8 h-8 text-mint mb-2" />
          <div className="text-sm font-bold">Your AI Relevance Map</div>
          <div className="text-xs text-muted-foreground">Noise filtered. Signal clear.</div>
        </motion.div>
      </div>
    </div>
  );
};

const workflowNodes = [
  { label: "Weekly briefing", ai: "AI draft" },
  { label: "Vendor analysis", ai: "AI comparison matrix" },
  { label: "Board prep", ai: "AI slide generator" },
];

const MindMapPanel = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="glass-card p-8 flex flex-col">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold mb-1">Leverage</h3>
        <p className="text-sm text-mint">Mind Map</p>
      </div>

      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        This is where it gets fun. You stop reading about AI and start building systems that multiply what you're already good at.
      </p>

      <ul className="space-y-2 mb-6 text-sm">
        <li className="flex items-start gap-2">
          <Zap className="w-4 h-4 text-mint shrink-0 mt-0.5" />
          <span><strong>Personal System Architecture</strong> &mdash; 3&ndash;5 AI systems tied to your actual weekly workflows</span>
        </li>
        <li className="flex items-start gap-2">
          <Zap className="w-4 h-4 text-mint shrink-0 mt-0.5" />
          <span><strong>Strength Amplifier</strong> &mdash; AI-powered engine for your strongest capability</span>
        </li>
        <li className="flex items-start gap-2">
          <Zap className="w-4 h-4 text-mint shrink-0 mt-0.5" />
          <span><strong>Weakness Counterbalance</strong> &mdash; delegate your draining tasks to AI, not to people</span>
        </li>
      </ul>

      {/* Workflow connection animation */}
      <div className="relative h-44 overflow-hidden rounded-lg bg-ink/5 p-4 mt-auto">
        {workflowNodes.map((node, i) => (
          <div key={i} className="flex items-center gap-2 mb-3">
            <motion.div
              className="flex-1 px-2 py-1.5 rounded bg-ink/10 text-[11px] font-medium text-center"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.3 }}
            >
              {node.label}
            </motion.div>
            <motion.div
              className="w-6 text-center text-mint text-xs font-bold"
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: i * 0.3 + 0.2 }}
            >
              &rarr;
            </motion.div>
            <motion.div
              className="flex-1 px-2 py-1.5 rounded bg-mint/15 text-[11px] font-medium text-center border border-mint/20"
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.3 + 0.3 }}
            >
              {node.ai}
            </motion.div>
          </div>
        ))}
        <motion.div
          className="text-center mt-2"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.4 }}
        >
          <span className="text-lg font-bold text-mint">5&ndash;10 hrs</span>
          <span className="text-xs text-muted-foreground ml-1">saved/week</span>
        </motion.div>
      </div>
    </div>
  );
};

const MindMakePanel = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="glass-card p-8 flex flex-col">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold mb-1">Direction</h3>
        <p className="text-sm text-mint">Mind Make</p>
      </div>

      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        The phase that separates Mindmaker from every consultant who ever gave you a deck. You make real decisions. We document why. You ship.
      </p>

      <ul className="space-y-2 mb-6 text-sm">
        <li className="flex items-start gap-2">
          <FileCheck className="w-4 h-4 text-mint shrink-0 mt-0.5" />
          <span><strong>Build vs Buy vs Glue</strong> &mdash; where is AI core vs commodity in your business?</span>
        </li>
        <li className="flex items-start gap-2">
          <FileCheck className="w-4 h-4 text-mint shrink-0 mt-0.5" />
          <span><strong>Vendor Selection Without Regret</strong> &mdash; strategic evaluation, not demo-driven</span>
        </li>
        <li className="flex items-start gap-2">
          <FileCheck className="w-4 h-4 text-mint shrink-0 mt-0.5" />
          <span><strong>12-Month AI Roadmap</strong> &mdash; phased, measurable, board-ready</span>
        </li>
      </ul>

      {/* Decision memo animation */}
      <div className="relative h-44 overflow-hidden rounded-lg bg-ink/5 p-4 mt-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-2"
        >
          <div className="text-[11px] font-bold mb-2">Decision: Build vs Buy</div>
          <div className="flex gap-2">
            <motion.div
              className="flex-1 p-2 rounded bg-ink/10 text-[10px]"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              <div className="font-semibold mb-1">Build</div>
              <div className="text-muted-foreground">Full control, IP ownership, higher upfront cost</div>
            </motion.div>
            <motion.div
              className="flex-1 p-2 rounded bg-ink/10 text-[10px]"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
            >
              <div className="font-semibold mb-1">Buy</div>
              <div className="text-muted-foreground">Fast deploy, vendor risk, recurring cost</div>
            </motion.div>
          </div>

          {/* Checkmark on Build */}
          <motion.div
            className="flex items-center gap-1 text-mint text-[11px] font-semibold"
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 1.0 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            Decision: Build (with exit criteria)
          </motion.div>

          {/* Metrics */}
          <div className="flex gap-4 mt-1">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.2 }}
            >
              <div className="text-[10px] text-muted-foreground">Projected ROI</div>
              <div className="text-sm font-bold text-mint">340%</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.4 }}
            >
              <div className="text-[10px] text-muted-foreground">Time to deploy</div>
              <div className="text-sm font-bold text-mint">6 weeks</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FrameworkJourney;
