import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const PARAGRAPHS = [
  "Agatha is the COO-agent in Mindmaker's fleet. Her job is to surface strategic tensions, challenge my thinking, and flag when the fleet as a whole is drifting off-course. She's good at it.",
  "What I didn't expect: in January, Agatha flagged a capability gap. Outputs from fifteen other agents were landing in my inbox as fifteen separate reports. Nobody was synthesizing them into a coherent executive view. She proposed the role herself, an Intelligence Synthesist, and specified what it would need to do. A new agent was built to fulfill the spec. Its name is Nova.",
  "The decision I faced, which no business-school playbook had prepared me for: an AI teammate had identified a capability gap in my org and proposed a role to fill it. Who approves that hire? What's the vetting? What's the org-chart governance for agent-proposed roles? I had to write the policy from scratch. Every executive with an agent fleet is about to have the same moment.",
];

export const AgathaStory = () => {
  return (
    <section
      className="section-padding bg-gradient-to-b from-background to-muted/30"
      aria-label="The Intelligence Synthesist story"
    >
      <div className="container-width max-w-3xl">
        <motion.div
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-6"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4 }}
        >
          <span className="h-1 w-1 rounded-full bg-mint" />
          A story from the fleet
        </motion.div>

        <motion.h2
          className="text-3xl md:text-5xl font-bold mb-8 leading-tight"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          Agatha hired herself a teammate.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6"
        >
          <Quote className="w-8 h-8 text-mint" />
        </motion.div>

        <div className="space-y-6">
          {PARAGRAPHS.map((p, i) => (
            <p key={i} className="text-lg md:text-xl text-foreground leading-relaxed">
              {p}
            </p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-10 pt-6 border-t border-border/60"
        >
          <p className="text-sm text-muted-foreground">
            This is one of the role-design questions the Cohort works through.{" "}
            <a
              href="/cohort"
              className="font-semibold text-mint-dark dark:text-mint hover:underline"
            >
              See the Cohort →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

interface PageCompletionBeaconProps {
  enabled?: boolean;
}

export const PageCompletionBeacon = ({ enabled = true }: PageCompletionBeaconProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !firedRef.current) {
          firedRef.current = true;
          try {
            (window as unknown as { plausible?: (e: string) => void }).plausible?.("page_completed");
          } catch {
            /* analytics optional */
          }
        }
      });
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]);

  return <div ref={ref} aria-hidden="true" />;
};
