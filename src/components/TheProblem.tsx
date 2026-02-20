import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Wrench, Compass, CheckCircle, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { InitialConsultModal } from "@/components/InitialConsultModal";

type PathType = "build" | "orchestrate" | null;

interface CriteriaBar {
  label: string;
  builderValue: number;
  orchestratorValue: number;
}

const criteriaData: CriteriaBar[] = [
  { label: "Hands-on effort", builderValue: 8, orchestratorValue: 3 },
  { label: "Technical curiosity", builderValue: 7, orchestratorValue: 3 },
  { label: "Time commitment", builderValue: 6, orchestratorValue: 4 },
  { label: "System ownership", builderValue: 9, orchestratorValue: 2 },
];

const builderTraits = [
  "I'm curious about tools like vibe coding and building my own AI systems",
  "I want to own and control what I build, even if it takes effort to learn",
  "I'm willing to invest 4\u20138 hours per week to future-proof myself",
];

const orchestratorTraits = [
  "I need reliable, quick outputs from AI without becoming technical",
  "I want to make clean decisions and not need IT in the room",
  "I can invest 2\u20134 hours per week and want results, not learning curves",
];

const builderSprints = [
  {
    name: "4-Week Decision Sprint",
    tagline: "One decision. Four weeks. Board-ready.",
    description: "Pick one nervous decision \u2014 build vs buy, tool commitment, first AI project \u2014 and resolve it with a working prototype and board-ready memo.",
    emphasis: ["Working prototype or system", "Tool commitment hierarchy", "Build-ready decision memo"],
    cta: "Start 4-Week Sprint",
    route: "/sprint/4-week",
    commitment: "4wk",
  },
  {
    name: "90-Day Concierge Sprint",
    tagline: "Full journey. Mind Set \u2192 Mind Map \u2192 Mind Make.",
    description: "Build 3\u20135 personal AI systems, resolve 2\u20133 strategic decisions, and leave with a 12-month roadmap and Builder Dossier.",
    emphasis: ["3\u20135 deployed AI systems", "Personal System Architecture", "Strength Amplifier + Builder Dossier"],
    cta: "Start 90-Day Sprint",
    route: "/sprint/90-day",
    commitment: "90d",
  },
];

const orchestratorSprints = [
  {
    name: "4-Week Decision Sprint",
    tagline: "One decision. Four weeks. Board-ready.",
    description: "Pick one nervous decision \u2014 vendor selection, AI governance, operating model \u2014 and resolve it with a defensible trade-off analysis and board memo.",
    emphasis: ["Vendor evaluation scorecard", "Governance decision memo", "Board-ready narrative"],
    cta: "Start 4-Week Sprint",
    route: "/sprint/4-week",
    commitment: "4wk",
  },
  {
    name: "90-Day Concierge Sprint",
    tagline: "Full journey. Mind Set \u2192 Mind Map \u2192 Mind Make.",
    description: "Set your AI operating model, resolve 2\u20133 strategic vendor/governance decisions, and build a 12-month roadmap your board will back.",
    emphasis: ["AI Operating Model + RACI", "Strategic vendor decisions resolved", "12-month roadmap with quarterly gates"],
    cta: "Start 90-Day Sprint",
    route: "/sprint/90-day",
    commitment: "90d",
  },
];

const AnimatedBar = ({ value, delay, isVisible }: { value: number; delay: number; isVisible: boolean }) => (
  <div className="flex-1 h-2.5 bg-ink/10 rounded-full overflow-hidden">
    <motion.div
      className="h-full bg-mint rounded-full"
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
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const isBuilder = type === "build";

  const traits = isBuilder ? builderTraits : orchestratorTraits;
  const Icon = isBuilder ? Wrench : Compass;
  const headline = isBuilder
    ? "You want to build alongside AI"
    : "You want clear direction without the build";
  const confirmLabel = isBuilder ? "You're a Builder." : "You're an Orchestrator.";

  return (
    <motion.div
      ref={ref}
      layout
      className={`glass-card p-8 transition-all cursor-pointer ${
        isSelected ? "border-mint/60 ring-2 ring-mint/20" : "hover:border-mint/40"
      } ${isOtherSelected ? "opacity-40 scale-95 pointer-events-none" : ""}`}
      onClick={!isSelected && !isOtherSelected ? onSelect : undefined}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: isOtherSelected ? 0.4 : 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-full bg-mint/20 flex items-center justify-center">
          <Icon className="w-6 h-6 text-mint" />
        </div>
        <h3 className="text-2xl font-bold">
          {isBuilder ? "The Builder" : "The Orchestrator"}
        </h3>
      </div>

      <p className="text-lg font-medium mb-5">{headline}</p>

      <ul className="space-y-3 mb-6">
        {traits.map((trait, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <CheckCircle className="w-4 h-4 text-mint shrink-0 mt-0.5" />
            <span>{trait}</span>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border pt-6 space-y-4">
              {criteriaData.map((criteria, i) => (
                <div key={criteria.label} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-32 shrink-0">
                    {criteria.label}
                  </span>
                  <AnimatedBar
                    value={isBuilder ? criteria.builderValue : criteria.orchestratorValue}
                    delay={i * 0.15}
                    isVisible={isSelected}
                  />
                  <span className="text-xs font-bold text-mint w-8 text-right">
                    {isBuilder ? criteria.builderValue : criteria.orchestratorValue}/10
                  </span>
                </div>
              ))}
              <p className="text-mint font-semibold pt-2">
                {confirmLabel} Here are your sprints.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isSelected && !isOtherSelected && (
        <Button
          className="w-full bg-mint text-ink hover:bg-mint/90 mt-2"
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
        >
          This is me
        </Button>
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
    <div className="glass-card p-8 flex flex-col hover:border-mint/40 transition-all">
      <h4 className="text-2xl font-bold mb-1">{sprint.name}</h4>
      <p className="text-mint text-sm mb-4">{sprint.tagline}</p>
      <p className="text-muted-foreground mb-6">{sprint.description}</p>

      <div className="mb-6">
        <h5 className="text-sm font-semibold mb-2">
          {pathType === "build" ? "Builder focus:" : "Orchestrator focus:"}
        </h5>
        <ul className="space-y-1.5">
          {sprint.emphasis.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-mint shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <Button
          size="lg"
          className="w-full bg-mint text-ink hover:bg-mint/90"
          onClick={onBook}
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
    </div>
  );
};

const TheProblem = () => {
  const [selectedPath, setSelectedPath] = useState<PathType>(null);
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [bookingCommitment, setBookingCommitment] = useState<string | undefined>();
  const sprintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedPath && sprintRef.current) {
      setTimeout(() => {
        sprintRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 500);
    }
  }, [selectedPath]);

  const activeSprints = selectedPath === "build" ? builderSprints : orchestratorSprints;

  const handleBook = (commitment: string) => {
    setBookingCommitment(commitment);
    setConsultModalOpen(true);
  };

  return (
    <>
      <section className="section-padding bg-background" id="products">
        <div className="container-width">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Who Is This For?
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Two paths. Both start with clarity. Both end with decisions that stick.
            </p>
          </div>

          {/* Path Cards */}
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

          {/* Reset selection */}
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
                  className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
                >
                  Change my selection
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sprint Chooser -- revealed after path selection */}
          <AnimatePresence>
            {selectedPath && (
              <motion.div
                ref={sprintRef}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-16"
              >
                <div className="text-center mb-10">
                  <h3 className="text-3xl font-bold mb-3">Choose Your Sprint</h3>
                  <p className="text-muted-foreground max-w-lg mx-auto">
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

                {/* Fallback CTA */}
                <div className="text-center mt-10">
                  <p className="text-sm text-muted-foreground mb-3">
                    Not sure which sprint? Start with a conversation.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setBookingCommitment(undefined);
                      setConsultModalOpen(true);
                    }}
                  >
                    What's your nervous decision?
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
