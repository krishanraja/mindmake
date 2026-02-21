import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Wrench, Compass, CheckCircle, ArrowRight, ArrowDown, Square, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { InitialConsultModal } from "@/components/InitialConsultModal";

type PathType = "build" | "orchestrate" | null;

const spring = { type: "spring" as const, stiffness: 80, damping: 18 };

interface CriteriaItem {
  label: string;
  value: number;
}

const builderCriteria: CriteriaItem[] = [
  { label: "Creative freedom", value: 96 },
  { label: "System ownership", value: 91 },
  { label: "Future-proofing", value: 88 },
  { label: "Personal velocity", value: 94 },
];

const orchestratorCriteria: CriteriaItem[] = [
  { label: "Decision speed", value: 93 },
  { label: "Board confidence", value: 97 },
  { label: "Strategic clarity", value: 89 },
  { label: "Time efficiency", value: 95 },
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
    route: "/sprints",
    commitment: "4wk",
  },
  {
    name: "90-Day Concierge Sprint",
    tagline: "Full journey. MindSet \u2192 MindMap \u2192 MindMake.",
    description: "Build 3\u20135 personal AI systems, resolve 2\u20133 strategic decisions, and leave with a 12-month roadmap.",
    emphasis: ["3\u20135 deployed AI systems", "Personal System Architecture", "Strength Amplifier + Builder Dossier"],
    route: "/sprints",
    commitment: "90d",
  },
];

const orchestratorSprints = [
  {
    name: "4-Week Decision Sprint",
    tagline: "One decision. Four weeks. Board-ready.",
    description: "Pick one nervous decision and resolve it with a defensible trade-off analysis and board memo.",
    emphasis: ["Vendor evaluation scorecard", "Governance decision memo", "Board-ready narrative"],
    route: "/sprints",
    commitment: "4wk",
  },
  {
    name: "90-Day Concierge Sprint",
    tagline: "Full journey. MindSet \u2192 MindMap \u2192 MindMake.",
    description: "Set your AI operating model, resolve 2\u20133 vendor/governance decisions, and build a board-ready roadmap.",
    emphasis: ["AI Operating Model + RACI", "Strategic vendor decisions resolved", "12-month roadmap with quarterly gates"],
    route: "/sprints",
    commitment: "90d",
  },
];

const AnimatedBar = ({ value, delay, isVisible }: { value: number; delay: number; isVisible: boolean }) => (
  <div className="flex-1 h-2 bg-ink/10 dark:bg-white/10 rounded-full overflow-hidden">
    <motion.div
      className="h-full bg-ink dark:bg-mint rounded-full"
      initial={{ width: 0 }}
      animate={isVisible ? { width: `${value}%` } : { width: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    />
  </div>
);

const CheckboxRow = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) => (
  <button
    onClick={onChange}
    className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all min-h-[48px] ${
      checked
        ? "bg-ink/[0.06] dark:bg-mint/[0.08] border border-ink/20 dark:border-mint/30"
        : "bg-transparent border border-border/30 hover:border-ink/20 dark:hover:border-mint/20"
    }`}
  >
    {checked ? (
      <CheckSquare className="w-5 h-5 text-ink dark:text-mint shrink-0 mt-0.5" />
    ) : (
      <Square className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
    )}
    <span className={`text-sm ${checked ? "font-medium" : "text-muted-foreground"}`}>
      {label}
    </span>
  </button>
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
  const [checkedItems, setCheckedItems] = useState<boolean[]>([false, false, false]);

  const traits = isBuilder ? builderTraits : orchestratorTraits;
  const criteria = isBuilder ? builderCriteria : orchestratorCriteria;
  const Icon = isBuilder ? Wrench : Compass;
  const headline = isBuilder
    ? "You want to build alongside AI."
    : "You want direction without the build.";

  const allChecked = checkedItems.every(Boolean);

  const toggleCheck = (index: number) => {
    setCheckedItems((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

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

      {/* Interactive checkboxes */}
      <div className="space-y-2 mb-6">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          Check all that apply to you:
        </p>
        {traits.map((trait, i) => (
          <CheckboxRow
            key={i}
            label={trait}
            checked={checkedItems[i]}
            onChange={() => toggleCheck(i)}
          />
        ))}
      </div>

      {/* Criteria bars */}
      <div className="space-y-3 mb-6 pt-4 border-t border-border/30">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          {isBuilder ? "What you gain" : "What you gain"}
        </p>
        {criteria.map((c, i) => (
          <div key={c.label} className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-28 shrink-0">{c.label}</span>
            <AnimatedBar value={c.value} delay={i * 0.12} isVisible={isInView} />
          </div>
        ))}
      </div>

      {/* CTA -- enabled only when all checked */}
      {!isSelected && !isOtherSelected && (
        <motion.div
          animate={allChecked ? { scale: [1, 1.03, 1] } : {}}
          transition={{ duration: 0.4 }}
        >
          <Button
            className={`w-full font-semibold transition-all ${
              allChecked
                ? "bg-ink dark:bg-mint text-white dark:text-ink hover:opacity-90 shadow-lg"
                : "bg-ink/20 dark:bg-white/10 text-ink/40 dark:text-white/30 cursor-not-allowed"
            }`}
            disabled={!allChecked}
            onClick={onSelect}
          >
            {allChecked ? "This is me \u2192" : "Check all to continue"}
          </Button>
        </motion.div>
      )}

      {isSelected && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
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
      className="p-8 rounded-2xl border border-border/50 hover:border-ink/30 dark:hover:border-mint/30 transition-all flex flex-col hover:-translate-y-1 hover:shadow-lg duration-300"
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
                  <p className="text-xs text-muted-foreground mb-3">Not sure which sprint?</p>
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
