import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const FrameworkJourney = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-width">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Mind Set &rarr; Mind Map &rarr; Mind Make
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            This isn't a framework slide. It's how you actually move from anxiety to action.
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

const MindSetPanel = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="glass-card p-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Clarity</h3>
        <p className="text-sm text-muted-foreground">Mind Set</p>
      </div>

      <p className="text-lg mb-8">
        Cut the noise. Know what matters.
      </p>

      <div className="relative h-48 overflow-hidden rounded-lg bg-ink/5">
        <motion.div
          initial={{ opacity: 1, scale: 2, rotate: -5 }}
          animate={isInView ? { opacity: 0.1, scale: 0.5, rotate: 0 } : {}}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 flex flex-wrap gap-2 p-4"
        >
          {["GPT-4", "Claude", "Copilot", "Gemini", "Vendor A", "Tool B", "Platform C", "API D"].map((item, i) => (
            <span key={i} className="px-2 py-1 bg-mint/20 text-xs rounded">
              {item}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-mint">3</div>
            <div className="text-sm text-muted-foreground">Decisions That Matter</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const MindMapPanel = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="glass-card p-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Leverage</h3>
        <p className="text-sm text-muted-foreground">Mind Map</p>
      </div>

      <p className="text-lg mb-8">
        Build your edge. Multiply what you're good at.
      </p>

      <div className="relative h-48 overflow-hidden rounded-lg bg-ink/5 flex items-center justify-center">
        <svg width="100%" height="100%" viewBox="0 0 200 150">
          <motion.circle
            cx="100" cy="30" r="8" fill="#7ef4c2"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
          />
          <motion.circle
            cx="50" cy="90" r="8" fill="#7ef4c2"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.4 }}
          />
          <motion.circle
            cx="150" cy="90" r="8" fill="#7ef4c2"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.6 }}
          />
          <motion.circle
            cx="100" cy="120" r="8" fill="#7ef4c2"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.8 }}
          />

          <motion.line
            x1="100" y1="30" x2="50" y2="90" stroke="#7ef4c2" strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 0.6 } : {}}
            transition={{ delay: 0.5, duration: 0.5 }}
          />
          <motion.line
            x1="100" y1="30" x2="150" y2="90" stroke="#7ef4c2" strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 0.6 } : {}}
            transition={{ delay: 0.7, duration: 0.5 }}
          />
          <motion.line
            x1="50" y1="90" x2="100" y2="120" stroke="#7ef4c2" strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 0.6 } : {}}
            transition={{ delay: 0.9, duration: 0.5 }}
          />
          <motion.line
            x1="150" y1="90" x2="100" y2="120" stroke="#7ef4c2" strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 0.6 } : {}}
            transition={{ delay: 0.9, duration: 0.5 }}
          />
        </svg>
      </div>
    </div>
  );
};

const MindMakePanel = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="glass-card p-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Direction</h3>
        <p className="text-sm text-muted-foreground">Mind Make</p>
      </div>

      <p className="text-lg mb-8">
        Decide. Ship. Measure.
      </p>

      <div className="relative h-48 overflow-hidden rounded-lg bg-ink/5 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="space-y-2"
        >
          <div className="h-3 bg-mint/40 rounded w-3/4"></div>
          <div className="h-3 bg-mint/30 rounded w-full"></div>
          <div className="h-3 bg-mint/30 rounded w-5/6"></div>
          <div className="h-1 bg-ink/10 rounded my-4"></div>
          <div className="flex gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 0.8 }}
              className="flex-1"
            >
              <div className="text-xs text-muted-foreground">ROI</div>
              <div className="text-2xl font-bold text-mint">12hrs</div>
              <div className="text-xs text-muted-foreground">saved/week</div>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 1.0 }}
              className="flex-1"
            >
              <div className="text-xs text-muted-foreground">Cost</div>
              <div className="text-2xl font-bold text-mint">$3K</div>
              <div className="text-xs text-muted-foreground">to build</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FrameworkJourney;
