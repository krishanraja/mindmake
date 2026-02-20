import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Wrench, Compass } from "lucide-react";

const TheProblem = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-background"
      aria-label="Who is this for"
    >
      <div className="container-width">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Who Is This For?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Two paths. Both start with clarity. Both end with decisions that stick.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Builder Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card p-8 hover:border-mint/40 transition-all"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-mint/20 flex items-center justify-center">
                <Wrench className="w-6 h-6 text-mint" />
              </div>
              <h3 className="text-2xl font-bold">The Builder</h3>
            </div>

            <p className="text-xl font-medium mb-4">
              You want to build alongside AI.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Prototype. Ship. Create leverage. You're not waiting for
              permission &mdash; you're looking for the fastest path from idea to
              working system.
            </p>
          </motion.div>

          {/* Orchestrator Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card p-8 hover:border-mint/40 transition-all"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-mint/20 flex items-center justify-center">
                <Compass className="w-6 h-6 text-mint" />
              </div>
              <h3 className="text-2xl font-bold">The Orchestrator</h3>
            </div>

            <p className="text-xl font-medium mb-4">
              You want to set standards and make clean decisions.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Design how your organization uses AI without getting buried in
              technical details. You delegate execution but own outcomes.
            </p>
          </motion.div>
        </div>

        {/* Shared Closing */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center text-lg text-muted-foreground mt-12 max-w-xl mx-auto"
        >
          Both paths start with Mind Set. Both end with decisions that stick.
        </motion.p>
      </div>
    </section>
  );
};

export default TheProblem;
