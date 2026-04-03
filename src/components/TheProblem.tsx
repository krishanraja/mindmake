import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const spring = { type: "spring" as const, stiffness: 80, damping: 18 };

const sprints = [
  {
    name: "4-Week Sprint",
    tagline: "One decision. Four weeks. Board-ready.",
    description:
      "You have a nervous decision about AI. We help you make it with confidence. Week 1: clarity. Week 2: options. Week 3: decision. Week 4: board-ready memo.",
    outcomes: [
      "One clear, defensible decision",
      "Trade-off analysis you can explain",
      "Board-ready decision memo",
      "ROI framework to measure success",
    ],
    route: "/sprint/4-week",
    cta: "Start 4-Week Sprint",
  },
  {
    name: "90-Day Sprint",
    tagline: "The full journey. MindSet → MindMap → MindMake.",
    description:
      "Three decisions. Three months. Complete transformation from AI chaos to calm, clear direction. Month 1: clarity. Month 2: systems. Month 3: deployment.",
    outcomes: [
      "3–5 deployed AI systems",
      "2–3 strategic decisions resolved",
      "12-month roadmap with clear gates",
      "Board-level confidence on AI",
    ],
    route: "/sprint/90-day",
    cta: "Start 90-Day Sprint",
  },
];

const SprintCard = ({
  sprint,
  index,
}: {
  sprint: (typeof sprints)[0];
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const navigate = useNavigate();

  return (
    <motion.div
      ref={ref}
      className="p-8 rounded-2xl border border-border/50 hover:border-ink/30 dark:hover:border-mint/30 transition-all flex flex-col hover:-translate-y-1 hover:shadow-lg duration-300"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ ...spring, delay: index * 0.1 }}
    >
      <h3 className="text-2xl font-bold mb-1">{sprint.name}</h3>
      <p className="text-sm text-ink/60 dark:text-mint mb-4">{sprint.tagline}</p>
      <p className="text-muted-foreground text-sm mb-6">{sprint.description}</p>

      <div className="mb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          What you get
        </h4>
        <ul className="space-y-2">
          {sprint.outcomes.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-ink/40 dark:text-mint/60 shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <Button
          size="lg"
          className="w-full bg-ink dark:bg-mint text-white dark:text-ink hover:opacity-90 font-semibold"
          onClick={() => {
            window.dispatchEvent(new CustomEvent("openConsultModal"));
          }}
        >
          {sprint.cta}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground hover:text-foreground"
          onClick={() => navigate(sprint.route)}
        >
          Learn more <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
};

const TheProblem = () => {
  return (
    <section className="py-24 md:py-32 bg-background" id="products">
      <div className="container-width">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Choose your sprint.
          </h2>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Whether you're hands-on or hands-off, both paths start with clarity and end with decisions that stick.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {sprints.map((sprint, i) => (
            <SprintCard key={sprint.name} sprint={sprint} index={i} />
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-xs text-muted-foreground mb-3">Not sure which sprint?</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              window.dispatchEvent(new CustomEvent("openConsultModal"));
            }}
          >
            Start with a conversation
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TheProblem;
