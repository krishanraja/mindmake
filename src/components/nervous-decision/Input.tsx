import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, Target } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  NDM_MAX_CHARS,
  type NDMArtifact,
} from "@/components/nervous-decision/types";
import { Artifact } from "@/components/nervous-decision/Artifact";

interface InputProps {
  size?: "compact" | "full";
  tone?: "dark" | "light";
  placeholder?: string;
  examples?: string[];
}

// Shared input surface for the Nervous Decision Machine.
// - `compact` = homepage teaser (single row, h-11 Generate button)
// - `full`    = /signal dashboard (bigger textarea, example chips)
export const NervousDecisionInput = ({
  size = "compact",
  tone = "dark",
  placeholder = "e.g., Should we build our own AI tools or use ChatGPT Teams?",
  examples,
}: InputProps) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [artifact, setArtifact] = useState<NDMArtifact | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isDark = tone === "dark";

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
        setArtifact(data as NDMArtifact);
        try {
          (window as unknown as { plausible?: (e: string) => void }).plausible?.(
            "nervous_decision_generated"
          );
        } catch {
          /* analytics optional */
        }
      } else {
        setError("Something came back malformed. Try rephrasing the decision.");
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Couldn't reach the machine. Try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setArtifact(null);
    setInput("");
    setError(null);
  };

  const surfaceClass = isDark
    ? "bg-white/5 border-white/10"
    : "bg-card border-border";
  const labelClass = isDark ? "text-white" : "text-foreground";
  const mutedClass = isDark ? "text-white/55" : "text-muted-foreground";
  const inputSurface = isDark
    ? "bg-white/[0.04] border-white/15 text-white placeholder:text-white/30 focus:ring-mint/60"
    : "bg-background border-border text-foreground placeholder:text-muted-foreground/60 focus:ring-mint/40";
  const charCountClass = isDark ? "text-white/30" : "text-muted-foreground";

  const rows = size === "full" ? 3 : 2;

  return (
    <div className={`rounded-xl p-5 border ${surfaceClass}`} id="decision">
      <AnimatePresence mode="wait">
        {artifact ? (
          <Artifact
            key="artifact"
            artifact={artifact}
            onReset={reset}
            tone={tone}
          />
        ) : (
          <div key="input" className="flex items-start gap-4">
            <div className="shrink-0 w-9 h-9 rounded-lg bg-mint/15 flex items-center justify-center">
              <Target className="w-4 h-4 text-mint" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-bold leading-snug mb-1 ${labelClass}`}>
                Got a nervous decision?
              </p>
              <p className={`text-[12px] leading-relaxed mb-3 ${mutedClass}`}>
                Type the AI call you keep putting off. You'll get a 3-card artifact in about 60 seconds, no email required.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
                <textarea
                  value={input}
                  onChange={(e) =>
                    setInput(e.target.value.slice(0, NDM_MAX_CHARS))
                  }
                  placeholder={placeholder}
                  rows={rows}
                  disabled={loading}
                  className={`flex-1 rounded-lg border p-3 text-[13px] resize-none focus:outline-none focus:ring-2 ${inputSurface}`}
                />
                <Button
                  onClick={generate}
                  disabled={!input.trim() || loading}
                  className="h-11 px-5 sm:self-end bg-mint text-ink hover:bg-mint/90 font-bold whitespace-nowrap shrink-0"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                      Thinking
                    </>
                  ) : (
                    <>
                      Generate <ArrowRight className="ml-1.5 w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
              {size === "full" && examples && examples.length > 0 && !loading && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {examples.map((ex, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setInput(ex)}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                        isDark
                          ? "border-white/20 text-white/60 hover:border-mint/60 hover:text-mint"
                          : "border-border text-muted-foreground hover:border-mint/60 hover:text-foreground"
                      }`}
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              )}
              {error && (
                <p className="mt-2 text-[11px] text-red-400">{error}</p>
              )}
              <div className={`flex items-center justify-end mt-1.5 ${charCountClass}`}>
                <span className="text-[10px] font-mono">
                  {input.length}/{NDM_MAX_CHARS}
                </span>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
