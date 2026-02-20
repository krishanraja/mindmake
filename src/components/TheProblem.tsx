import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Wrench, Compass, CheckCircle, ArrowRight, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { InitialConsultModal } from "@/components/InitialConsultModal";

type PathType = "build" | "orchestrate" | null;

const spring = { type: "spring" as const, stiffness: 80, damping: 18 };

interface CriteriaBar {
  label: string;
  builderValue: number;
  orchestratorValue: number;
}

const criteriaData: CriteriaBar[] = [
  { label: "Hands-on effort", builderValue: 8, orchestratorValue: 3 },
  { label: "Technical curiosity", builderValue: 7, orchestratorValue: 3 },
  { label: "Weekly time investment", builderValue: 6, orchestratorValue: 4 },
  { label: "System ownership", builderValue: 9, orchestratorValue: 2 },
];

const builderTraits = [
  "I'm curious about vibe coding and building my own AI systems",
  "I want to own and control what I build, even if it takes effort",
  "I'm willing to invest 4\u20138 hours/week to future-proof myself",
];

const orchestratorTraits = [
  "I need reliable outputs from AI without becoming technical",
  "I want to make clean decisions and not need IT in the room",
  "I can invest 2\u20134 hours/week and want results, not learning curves",
];

const builderSprints = [
  {
    name: "4-Week Decision Sprint",
    tagline: "One decision. Four weeks. Board-ready.",
    description: "Pick one nervous decision and resolve it with a working prototype and board-ready memo.",
    emphasis: ["Working prototype or system", "Tool commitment hierarchy", "Build-ready decision memo"],
    route: "/sprint/4-week",
    commitment: "4wk",
  },
  {
    name: "90-Day Concierge Sprint",
    tagline: "Full journey. Mind Set \u2192 Mind Map \u2192 Mind Make.",
    description: "Build 3\u20135 personal AI systems, resolve 2\u20133 strategic decisions, and leave with a 12-month roadmap.",
    emphasis: ["3\u20135 deployed AI systems", "Personal System Architecture", "Strength Amplifier + Builder Dossier"],
    route: "/sprint/90-day",
    commitment: "90d",
  },
];

const orchestratorSprints = [
  {
    name: "4-Week Decision Sprint",
    tagline: "One decision. Four weeks. Board-ready.",
    description: "Pick one nervous decision and resolve it with a defensible trade-off analysis and board memo.",
    emphasis: ["Vendor evaluation scorecard", "Governance decision memo", "Board-ready narrative"],
    route: "/sprint/4-week",
    commitment: "4wk",
  },
  {
    name: "90-Day Concierge Sprint",
    tagline: "Full journey. Mind Set \u2192 Mind Map \u2192 Mind Make.",
    description: "Set your AI operating model, resolve 2\u20133 vendor/governance decisions, and build a board-ready roadmap.",
    emphasis: ["AI Operating Model + RACI", "Strategic vendor decisions resolved", "12-month roadmap with quarterly gates"],
    route: "/sprint/90-day",
    commitment: "90d",
  },
];

const AnimatedBar = ({ value, delay, isVisible }: { value: number; delay: number; isVisible: boolean }) => (
  <div className="flex-1 h-2 bg-ink/10 dark:bg-white/10 rounded-full overflow-hidden">
    <motion.div
      className="h-full bg-ink dark:bg-mint rounded-full"
      initial={{ width: 0 }}
      animate={isVisible ? { width: `${value * 10}%` } : { width: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    />
  </div>
);

const PathCard = ({
  type,
  isSelected,
  isOtherSelected,
  onSelect,
}: {
  type: "build" | "orchestrate";
  isSelected: boolean;
  isOtherSelected: boolean;
  onSelect: () => void;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const isBuilder = type === "build";

  const traits = isBuilder ? builderTraits : orchestratorTraits;
  const Icon = isBuilder ? Wrench : Compass;
  const headline = isBuilder
    ? "You want to build alongside AI."
    : "You want direction without the build.";

  return (
    <motion.div
      ref={ref}
      className={`p-8 rounded-2xl border transition-all ${
        isSelected
          ? "border-ink dark:border-mint bg-ink/[0.03] dark:bg-mint/[0.03] ring-1 ring-ink/10 dark:ring-mint/20"
          : isOtherSelected
          ? "opacity-30 scale-[0.97] pointer-events-none border-border/30"
          : "border-border/50 hover:border-ink/30 dark:hover:border-mint/30"
      }`}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: isOtherSelected ? 0.3 : 1, y: 0 } : {}}
      transition={spring}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-ink/10 dark:bg-mint/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-ink dark:text-mint" />
        </div>
        <h3 className="text-xl font-bold">{isBuilder ? "The Builder" : "The Orchestrator"}</h3>
      </div>

      <p className="text-lg font-medium mb-5">{headline}</p>

      {/* Traits -- always visible */}
      <ul className="space-y-2.5 mb-6">
        {traits.map((trait, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <CheckCircle className="w-4 h-4 text-ink/40 dark:text-mint/60 shrink-0 mt-0.5" />
            <span>{trait}</span>
          </li>
        ))}
      </ul>

      {/* Criteria bars -- always visible, animate on scroll */}
      <div className="space-y-3 mb-6 pt-4 border-t border-border/30">
        {criteriaData.map((c, i) => (
          <div key={c.label} className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-28 shrink-0">{c.label}</span>
            <AnimatedBar
              value={isBuilder ? c.builderValue : c.orchestratorValue}
              delay={i * 0.12}
              isVisible={isInView}
            />
            <span className="text-xs font-bold text-ink dark:text-white w-7 text-right">
              {isBuilder ? c.builderValue : c.orchestratorValue}/10
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      {!isSelected && !isOtherSelected && (
        <Button
          className="w-full bg-ink dark:bg-mint text-white dark:text-ink hover:opacity-90 font-semibold"
          onClick={onSelect}
        >
          This is me
        </Button>
      )}

      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-sm font-semibold text-ink dark:text-mint mb-3">
            {isBuilder ? "You're a Builder." : "You're an Orchestrator."} See your sprints below.
          </p>
          <button
            onClick={() => {
              const el = document.getElementById("sprint-chooser");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowDown className="w-4 h-4" /> See my sprints
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

const SprintCard = ({
  sprint,
  pathType,
  onBook,
}: {
  sprint: typeof builderSprints[0];
  pathType: PathType;
  onBook: () => void;
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="p-8 rounded-2xl border border-border/50 hover:border-ink/30 dark:hover:border-mint/30 transition-all flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
    >
      <h4 className="text-2xl font-bold mb-1">{sprint.name}</h4>
      <p className="text-sm text-ink/60 dark:text-mint mb-4">{sprint.tagline}</p>
      <p className="text-muted-foreground text-sm mb-6">{sprint.description}</p>

      <div className="mb-6">
        <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
          {pathType === "build" ? "Builder focus" : "Orchestrator focus"}
        </h5>
        <ul className="space-y-1.5">
          {sprint.emphasis.map((item, i) => (
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
          onClick={onBook}
        >
          {sprint.name.includes("4-Week") ? "Start 4-Week Sprint" : "Start 90-Day Sprint"}
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
  const [selectedPath, setSelectedPath] = useState<PathType>(null);
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [bookingCommitment, setBookingCommitment] = useState<string | undefined>();

  const activeSprints = selectedPath === "build" ? builderSprints : orchestratorSprints;

  const handleBook = (commitment: string) => {
    setBookingCommitment(commitment);
    setConsultModalOpen(true);
  };

  return (
    <>
      <section className="py-24 md:py-32 bg-background" id="products">
        <div className="container-width">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Who is this for?
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Two paths. Both end with decisions that stick.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <PathCard
              type="build"
              isSelected={selectedPath === "build"}
              isOtherSelected={selectedPath === "orchestrate"}
              onSelect={() => setSelectedPath("build")}
            />
            <PathCard
              type="orchestrate"
              isSelected={selectedPath === "orchestrate"}
              isOtherSelected={selectedPath === "build"}
              onSelect={() => setSelectedPath("orchestrate")}
            />
          </div>

          <AnimatePresence>
            {selectedPath && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center mt-6"
              >
                <button
                  onClick={() => setSelectedPath(null)}
                  className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
                >
                  Change my selection
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sprint Chooser -- user scrolls here manually */}
          <AnimatePresence>
            {selectedPath && (
              <motion.div
                id="sprint-chooser"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ ...spring, delay: 0.15 }}
                className="mt-20"
              >
                <div className="text-center mb-10">
                  <h3 className="text-3xl md:text-4xl font-bold mb-3">Choose your sprint.</h3>
                  <p className="text-muted-foreground max-w-md mx-auto text-sm">
                    {selectedPath === "build"
                      ? "Builder sprints focus on systems, prototypes, and personal AI leverage."
                      : "Orchestrator sprints focus on governance, vendor decisions, and board-ready direction."}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                  {activeSprints.map((sprint) => (
                    <SprintCard
                      key={sprint.name}
                      sprint={sprint}
                      pathType={selectedPath}
                      onBook={() => handleBook(sprint.commitment)}
                    />
                  ))}
                </div>

                <div className="text-center mt-10">
                  <p className="text-xs text-muted-foreground mb-3">
                    Not sure which sprint?
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setBookingCommitment(undefined);
                      setConsultModalOpen(true);
                    }}
                  >
                    Start with a conversation
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <InitialConsultModal
        open={consultModalOpen}
        onOpenChange={setConsultModalOpen}
        pathType={selectedPath === "build" ? "build" : selectedPath === "orchestrate" ? "orchestrate" : undefined}
        commitmentLevel={bookingCommitment}
      />
    </>
  );
};

export default TheProblem;
