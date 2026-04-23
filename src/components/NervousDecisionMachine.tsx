import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, Target, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Path = { name: string; tradeoff: string; confidence: string };

type Artifact = {
  card1_real_decision: { heading: string; body: string };
  card2_three_paths: { heading: string; paths: Path[] };
  card3_next_14_days: { heading: string; actions: string[] };
};

const MAX_CHARS = 500;
const MAX_RETRIES = 1;

const confidenceStyles: Record<string, string> = {
  Defensible:
    "bg-mint/15 text-mint-dark dark:text-mint border-mint/30",
  Risky:
    "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
  "Usually wrong":
    "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
};

const openConsultModal = () => {
  window.dispatchEvent(new CustomEvent("openConsultModal"));
};

type Props = {
  variant?: "homepage" | "page";
};

const NervousDecisionMachine = ({ variant = "homepage" }: Props) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retries, setRetries] = useState(0);

  const generate = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setError(null);
    setArtifact(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "nervous-decision-machine",
        { body: { decision: input.trim() } }
      );

      if (fnError) throw fnError;
      if (data?.error) {
        setError(data.error);
        return;
      }
      if (data?.card1_real_decision) {
        setArtifact(data as Artifact);
        try {
          (window as unknown as { plausible?: (e: string, o?: object) => void }).plausible?.(
            "nervous_decision_generated"
          );
        } catch {
          /* analytics optional */
        }
      } else {
        setError("Something came back malformed. Try rephrasing the decision.");
      }
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Couldn't reach the machine. Try again in a moment.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setArtifact(null);
    setInput("");
    setError(null);
    setRetries((n) => n + 1);
  };

  const isHomepage = variant === "homepage";

  return (
    <section
      className={`relative py-20 sm:py-24 md:py-28 ${
        isHomepage ? "bg-ink text-white" : "bg-background"
      }`}
    >
      <div className="container-width max-w-4xl">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-mint mb-4">
            <Target className="w-3.5 h-3.5" />
            The Nervous Decision Machine
          </div>
          <h2
            className={`text-4xl md:text-5xl font-bold mb-4 tracking-tight ${
              isHomepage ? "text-white" : "text-foreground"
            }`}
          >
            Got a nervous decision? Try the machine.
          </h2>
          <p
            className={`text-lg md:text-xl max-w-2xl mx-auto ${
              isHomepage ? "text-white/70" : "text-muted-foreground"
            }`}
          >
            Type the AI decision you're putting off. Get a one-page artifact in 60 seconds. No email required.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!artifact ? (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
                  placeholder="e.g., Should we build our own AI tools or use ChatGPT Teams?"
                  rows={4}
                  disabled={loading}
                  className={`w-full rounded-xl border p-5 text-base md:text-lg resize-none focus:outline-none focus:ring-2 focus:ring-mint/60 transition-all ${
                    isHomepage
                      ? "bg-white/5 border-white/20 text-white placeholder:text-white/40"
                      : "bg-background border-border"
                  }`}
                />
                <div
                  className={`absolute bottom-3 right-4 text-xs font-mono ${
                    isHomepage ? "text-white/40" : "text-muted-foreground"
                  }`}
                >
                  {input.length}/{MAX_CHARS}
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-500 dark:text-red-400 px-1">{error}</div>
              )}

              <div className="flex justify-center">
                <Button
                  size="lg"
                  disabled={!input.trim() || loading}
                  onClick={generate}
                  className="bg-gradient-to-r from-mint to-emerald-400 text-ink hover:opacity-90 font-bold px-10 py-6 text-base md:text-lg shadow-lg shadow-mint/25"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Thinking...
                    </>
                  ) : (
                    <>
                      Generate my decision card <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>

              {loading && (
                <div className="mt-10 grid gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-24 rounded-xl animate-pulse ${
                        isHomepage ? "bg-white/5" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="artifact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-5"
            >
              {/* Card 1 */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.0 }}
                className={`rounded-2xl p-7 border ${
                  isHomepage
                    ? "bg-white/5 border-white/20"
                    : "bg-background border-border/60"
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-mint mb-2">
                  01
                </div>
                <h3
                  className={`text-xl md:text-2xl font-bold mb-3 ${
                    isHomepage ? "text-white" : "text-foreground"
                  }`}
                >
                  {artifact.card1_real_decision.heading}
                </h3>
                <p
                  className={`text-base leading-relaxed ${
                    isHomepage ? "text-white/80" : "text-muted-foreground"
                  }`}
                >
                  {artifact.card1_real_decision.body}
                </p>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`rounded-2xl p-7 border ${
                  isHomepage
                    ? "bg-white/5 border-white/20"
                    : "bg-background border-border/60"
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-mint mb-2">
                  02
                </div>
                <h3
                  className={`text-xl md:text-2xl font-bold mb-5 ${
                    isHomepage ? "text-white" : "text-foreground"
                  }`}
                >
                  {artifact.card2_three_paths.heading}
                </h3>
                <div className="space-y-4">
                  {artifact.card2_three_paths.paths.map((p, i) => (
                    <div
                      key={i}
                      className={`rounded-lg p-4 ${
                        isHomepage ? "bg-white/[0.04]" : "bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-1.5">
                        <div
                          className={`font-bold ${
                            isHomepage ? "text-white" : "text-foreground"
                          }`}
                        >
                          {p.name}
                        </div>
                        <span
                          className={`shrink-0 text-[10px] font-bold uppercase tracking-[0.14em] px-2 py-1 rounded-full border ${
                            confidenceStyles[p.confidence] ||
                            "bg-muted text-muted-foreground border-muted-foreground/30"
                          }`}
                        >
                          {p.confidence}
                        </span>
                      </div>
                      <p
                        className={`text-sm ${
                          isHomepage ? "text-white/70" : "text-muted-foreground"
                        }`}
                      >
                        {p.tradeoff}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className={`rounded-2xl p-7 border ${
                  isHomepage
                    ? "bg-white/5 border-white/20"
                    : "bg-background border-border/60"
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-mint mb-2">
                  03
                </div>
                <h3
                  className={`text-xl md:text-2xl font-bold mb-5 ${
                    isHomepage ? "text-white" : "text-foreground"
                  }`}
                >
                  {artifact.card3_next_14_days.heading}
                </h3>
                <ol className="space-y-3">
                  {artifact.card3_next_14_days.actions.map((a, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="shrink-0 w-7 h-7 rounded-full bg-mint text-ink font-bold text-sm flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span
                        className={`pt-0.5 ${
                          isHomepage ? "text-white/85" : "text-foreground"
                        }`}
                      >
                        {a}
                      </span>
                    </li>
                  ))}
                </ol>
              </motion.div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className={`rounded-2xl p-7 text-center border-2 border-dashed ${
                  isHomepage ? "border-mint/40 bg-mint/5" : "border-mint/40 bg-mint/5"
                }`}
              >
                <p
                  className={`text-base md:text-lg mb-4 ${
                    isHomepage ? "text-white" : "text-foreground"
                  }`}
                >
                  This is the 60-second version. The AI Decision Cohort is where you actually <span className="font-bold text-mint-dark dark:text-mint">resolve it</span>. Three weeks, fifteen other senior leaders, and a peer group that holds you accountable.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-mint to-emerald-400 text-ink hover:opacity-90 font-bold"
                  >
                    <a href="/cohort">
                      See the next cohort <ArrowRight className="ml-2 w-4 h-4" />
                    </a>
                  </Button>
                  {retries < MAX_RETRIES && (
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={reset}
                      className={`font-bold ${
                        isHomepage
                          ? "border-white/30 text-white hover:bg-white/10"
                          : ""
                      }`}
                    >
                      <RotateCcw className="mr-2 w-4 h-4" /> Try another decision
                    </Button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default NervousDecisionMachine;
