import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ArrowRight, ArrowLeft, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSessionData } from "@/contexts/SessionDataContext";

const STORAGE_KEY = "mindmaker:pre-call-qualifier";

type DecisionTag =
  | "build-vs-buy"
  | "commercial-stuck"
  | "gtm-launch"
  | "alignment"
  | "personal-clarity"
  | "other";

type TimelineTag = "rapid" | "quarter" | "ninety-day" | "roadmap" | "exploring";

type StakesTag = "revenue" | "launch" | "board" | "team" | "budget" | "personal";

type Option<T extends string> = { tag: T; label: string };

const decisionOptions: Option<DecisionTag>[] = [
  { tag: "build-vs-buy", label: "Build vs. buy: should we build AI or buy it?" },
  { tag: "commercial-stuck", label: "We've built AI but it's not converting to revenue" },
  { tag: "gtm-launch", label: "We're launching an AI product or feature" },
  { tag: "alignment", label: "My team isn't aligned on AI direction" },
  { tag: "personal-clarity", label: "I want personal clarity before committing budget" },
  { tag: "other", label: "Something else" },
];

const timelineOptions: Option<TimelineTag>[] = [
  { tag: "rapid", label: "This week or next. I need rapid alignment" },
  { tag: "quarter", label: "This quarter. We're moving soon" },
  { tag: "ninety-day", label: "Next 90 days. We're planning runway" },
  { tag: "roadmap", label: "6+ months. We're building a long-view roadmap" },
  { tag: "exploring", label: "Exploring. No firm timeline" },
];

const stakesOptions: Option<StakesTag>[] = [
  { tag: "revenue", label: "Revenue: growth is stuck or slipping" },
  { tag: "launch", label: "A product launch hanging in the balance" },
  { tag: "board", label: "Board / investor confidence" },
  { tag: "team", label: "Team going sideways: wasted effort, conflict" },
  { tag: "budget", label: "Wrong tools: budget wasted on the wrong bets" },
  { tag: "personal", label: "Personal: I don't want to make the wrong call" },
];

type Selections = {
  decisionTag: DecisionTag | null;
  decisionOther: string;
  timelineTag: TimelineTag | null;
  stakesTag: StakesTag | null;
};

type Answers = {
  decision: string;
  tried: string;
  stakes: string;
};

type Recommendation = {
  title: string;
  blurb: string;
  preselected: string;
};

const classify = (s: Selections): Recommendation => {
  const { decisionTag, timelineTag, stakesTag } = s;

  const commercialDecision =
    decisionTag === "commercial-stuck" || decisionTag === "gtm-launch";
  const shortTimeline = timelineTag === "rapid" || timelineTag === "quarter";
  const planTimeline = timelineTag === "ninety-day" || timelineTag === "roadmap";
  const commercialStakes =
    stakesTag === "revenue" || stakesTag === "launch" || stakesTag === "board";

  if (commercialDecision && shortTimeline && commercialStakes) {
    return {
      title: "The Signal Session is your likely fit.",
      blurb:
        "You need rapid alignment on how to position an AI capability commercially. One intensive day, plus a 15-20 page Commercial Narrative within 48 hours. We'd scope the session on the call.",
      preselected: "signal-session",
    };
  }

  if (commercialDecision && planTimeline) {
    return {
      title: "The Revenue Architecture is your likely fit.",
      blurb:
        "This sounds like a full commercial build covering pricing, packaging, GTM, and a narrative you can take to the board. 30-day intensive, informed by operating an AI business in production. We'd scope fit on the intake call.",
      preselected: "revenue-architecture",
    };
  }

  if (decisionTag === "gtm-launch") {
    return {
      title: "The Signal Session is your likely fit.",
      blurb:
        "Launch moments reward a focused, intensive day. One session, plus a 15-20 page Commercial Narrative within 48 hours. We'd scope fit on the intake call.",
      preselected: "signal-session",
    };
  }

  return {
    title: "The AI Decision Cohort is your likely fit.",
    blurb:
      "You're describing a single nervous AI decision you want resolved. That's what the cohort is for. Three weeks with 15 other senior leaders, peers who hold you accountable, and a one-page memo you can take to the board on the way out.",
    preselected: "cohort-enrollment",
  };
};

const selectionsToAnswers = (s: Selections): Answers => {
  const decisionLabel =
    decisionOptions.find((o) => o.tag === s.decisionTag)?.label || "";
  const decision =
    s.decisionTag === "other" && s.decisionOther.trim()
      ? `${decisionLabel}: ${s.decisionOther.trim()}`
      : decisionLabel;
  const tried = timelineOptions.find((o) => o.tag === s.timelineTag)?.label || "";
  const stakes = stakesOptions.find((o) => o.tag === s.stakesTag)?.label || "";
  return { decision, tried, stakes };
};

type StoredShape = Selections & { version?: number };

const PreCallQualifier = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Selections>({
    decisionTag: null,
    decisionOther: "",
    timelineTag: null,
    stakesTag: null,
  });
  const [saved, setSaved] = useState(false);
  const { setQualificationData } = useSessionData();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<StoredShape>;
      if (parsed && parsed.version === 2) {
        setSelections({
          decisionTag: (parsed.decisionTag as DecisionTag) || null,
          decisionOther: parsed.decisionOther || "",
          timelineTag: (parsed.timelineTag as TimelineTag) || null,
          stakesTag: (parsed.stakesTag as StakesTag) || null,
        });
      }
    } catch {
      /* ignore */
    }
  }, []);

  const rec = step === 3 ? classify(selections) : null;

  const canAdvance = (() => {
    if (step === 0) {
      if (!selections.decisionTag) return false;
      if (
        selections.decisionTag === "other" &&
        selections.decisionOther.trim().length === 0
      )
        return false;
      return true;
    }
    if (step === 1) return !!selections.timelineTag;
    if (step === 2) return !!selections.stakesTag;
    return false;
  })();

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const bookCall = () => {
    if (!rec) return;
    const answers = selectionsToAnswers(selections);
    setQualificationData({
      preselectedProgram: rec.preselected,
      qualifierAnswers: answers,
    });
    setOpen(false);
    window.dispatchEvent(
      new CustomEvent("openConsultModal", {
        detail: {
          preselected: rec.preselected,
          qualifierAnswers: answers,
        },
      })
    );
    try {
      (window as unknown as { plausible?: (e: string) => void }).plausible?.(
        "pre_call_qualifier_completed"
      );
    } catch {
      /* analytics optional */
    }
  };

  const saveLocal = () => {
    try {
      const payload: StoredShape = { ...selections, version: 2 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const chipClass = (selected: boolean) =>
    `w-full text-left px-4 py-3 rounded-xl border text-sm md:text-base leading-snug transition-all min-h-[44px] ${
      selected
        ? "border-mint bg-mint/10 text-foreground font-semibold"
        : "border-border bg-background hover:border-mint/60 hover:bg-mint/5"
    }`;

  const renderStep = () => {
    if (step === 0) {
      return (
        <>
          <label className="block text-lg font-semibold mb-3">
            What's the decision you're wrestling with?
          </label>
          <div className="space-y-2">
            {decisionOptions.map((opt) => (
              <button
                key={opt.tag}
                type="button"
                onClick={() =>
                  setSelections((s) => ({ ...s, decisionTag: opt.tag }))
                }
                className={chipClass(selections.decisionTag === opt.tag)}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {selections.decisionTag === "other" && (
            <textarea
              rows={2}
              value={selections.decisionOther}
              onChange={(e) =>
                setSelections((s) => ({
                  ...s,
                  decisionOther: e.target.value.slice(0, 240),
                }))
              }
              placeholder="A sentence or two is plenty..."
              className="mt-3 w-full rounded-xl border border-border bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-mint/40"
            />
          )}
        </>
      );
    }

    if (step === 1) {
      return (
        <>
          <label className="block text-lg font-semibold mb-3">
            What's your timeline?
          </label>
          <div className="space-y-2">
            {timelineOptions.map((opt) => (
              <button
                key={opt.tag}
                type="button"
                onClick={() =>
                  setSelections((s) => ({ ...s, timelineTag: opt.tag }))
                }
                className={chipClass(selections.timelineTag === opt.tag)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      );
    }

    return (
      <>
        <label className="block text-lg font-semibold mb-3">
          What's the real cost of not solving this?
        </label>
        <div className="space-y-2">
          {stakesOptions.map((opt) => (
            <button
              key={opt.tag}
              type="button"
              onClick={() =>
                setSelections((s) => ({ ...s, stakesTag: opt.tag }))
              }
              className={chipClass(selections.stakesTag === opt.tag)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      {/* Floating pill */}
      <button
        onClick={() => {
          setStep(0);
          setOpen(true);
        }}
        aria-label="Warm up before your call"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-ink text-white dark:bg-mint dark:text-ink shadow-lg shadow-ink/30 dark:shadow-mint/30 hover:shadow-xl transition-all hover:-translate-y-0.5 font-semibold text-sm"
      >
        <Zap className="w-4 h-4" />
        <span>Warm up before your call</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="text-left">
            <div className="flex items-start justify-between gap-4">
              <div>
                <DrawerTitle className="text-2xl md:text-3xl font-bold">
                  Let's make sure we use the call well.
                </DrawerTitle>
                <DrawerDescription className="mt-2 text-base">
                  Three quick taps. Takes 30 seconds. Your answers pre-load into the intake form so we skip the basics on the call.
                </DrawerDescription>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </DrawerHeader>

          <div className="px-6 pb-8 overflow-y-auto">
            <div className="flex items-center gap-1.5 mb-6">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === step
                      ? "w-8 bg-mint"
                      : i < step
                      ? "w-4 bg-mint/60"
                      : "w-4 bg-muted"
                  }`}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step < 3 ? (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderStep()}
                  <div className="flex items-center justify-end mt-5">
                    <div className="flex items-center gap-2">
                      {step > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={back}
                          className="font-semibold"
                        >
                          <ArrowLeft className="w-4 h-4 mr-1" /> Back
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={next}
                        disabled={!canAdvance}
                        className="bg-ink dark:bg-mint text-white dark:text-ink hover:opacity-90 font-bold"
                      >
                        {step === 2 ? "See my fit" : "Next"}
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                rec && (
                  <motion.div
                    key="summary"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="rounded-2xl border-2 border-mint/40 bg-mint/5 p-6 mb-6">
                      <div className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-2">
                        Likely fit
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold mb-3">
                        {rec.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {rec.blurb}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        size="lg"
                        onClick={bookCall}
                        className="bg-gradient-to-r from-mint to-emerald-400 text-ink hover:opacity-90 font-bold"
                      >
                        Book your intro call <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={saveLocal}
                        className="font-bold"
                      >
                        {saved ? "Saved." : "Save my answers"}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      Your answers ride along with the intake form when you book. "Save my answers" keeps a local copy in this browser if you want to come back later.
                    </p>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default PreCallQualifier;
