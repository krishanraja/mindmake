import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ArrowRight, ArrowLeft, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSessionData } from "@/contexts/SessionDataContext";

const STORAGE_KEY = "mindmaker:pre-call-qualifier";

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

const classify = (answers: Answers): Recommendation => {
  const text = `${answers.decision} ${answers.tried} ${answers.stakes}`.toLowerCase();
  const commercialSignals =
    /\b(team|product|commercialize|commercial|revenue|gtm|go-?to-?market|pricing|positioning|packaging|sales|launch)\b/;
  const rapidAlignmentSignals = /\b(quick|align|day|one day|intensive|pitch|fast|asap|next week)\b/;
  const fullBuildSignals = /\b(build|full|month|quarter|roadmap|board|strategy|30[\s-]?day|90[\s-]?day)\b/;

  if (commercialSignals.test(text)) {
    if (rapidAlignmentSignals.test(text) && !fullBuildSignals.test(text)) {
      return {
        title: "The Signal Session is your likely fit.",
        blurb:
          "You need rapid alignment on how to position an AI capability commercially — one intensive day, plus a 15-20 page Commercial Narrative within 48 hours. We'd scope the session on the call.",
        preselected: "signal-session",
      };
    }
    return {
      title: "The Revenue Architecture is your likely fit.",
      blurb:
        "This sounds like a full commercial build — pricing, packaging, GTM, board-ready narrative. 30-day intensive, informed by operating an AI business in production. We'd scope fit on the intake call.",
      preselected: "revenue-architecture",
    };
  }
  return {
    title: "The AI Decision Cohort is your likely fit.",
    blurb:
      "You're describing a single nervous AI decision you want resolved. That's what the cohort is for — three weeks with 15 other senior leaders, a peer group that holds you accountable, and a board-ready memo on the way out.",
    preselected: "cohort-enrollment",
  };
};

const PreCallQualifier = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    decision: "",
    tried: "",
    stakes: "",
  });
  const [saved, setSaved] = useState(false);
  const { setQualificationData } = useSessionData();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Answers>;
        setAnswers({
          decision: parsed.decision || "",
          tried: parsed.tried || "",
          stakes: parsed.stakes || "",
        });
      }
    } catch {
      /* ignore */
    }
  }, []);

  const rec = step === 3 ? classify(answers) : null;

  const prompts = [
    {
      label: "What's the decision you're trying to make?",
      key: "decision" as const,
    },
    {
      label: "What have you tried already?",
      key: "tried" as const,
    },
    {
      label: "What happens if you get this wrong?",
      key: "stakes" as const,
    },
  ];

  const canAdvance =
    step < 3 && (answers[prompts[step].key]?.trim()?.length || 0) > 0;

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const bookCall = () => {
    if (!rec) return;
    setQualificationData({ preselectedProgram: rec.preselected });
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      /* ignore */
    }
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
        <Sparkles className="w-4 h-4" />
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
                  Three quick questions. Takes 90 seconds. Your answers pre-load into the intake form so we skip the basics on the call.
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
                  <label className="block text-lg font-semibold mb-3">
                    {prompts[step].label}
                  </label>
                  <textarea
                    rows={5}
                    value={answers[prompts[step].key]}
                    onChange={(e) =>
                      setAnswers((a) => ({
                        ...a,
                        [prompts[step].key]: e.target.value.slice(0, 500),
                      }))
                    }
                    placeholder="Type here..."
                    className="w-full rounded-xl border border-border bg-background p-4 text-base resize-none focus:outline-none focus:ring-2 focus:ring-mint/40"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {answers[prompts[step].key].length}/500
                    </span>
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
                      Saved locally in your browser. Nothing is emailed.
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
