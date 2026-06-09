import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MindyAvatar } from "./MindyAvatar";

interface OpenerProps {
  onStart: (decision: string, email?: string) => void;
  busy?: boolean;
}

/**
 * The single door. One prompt, one optional gift-framed work-email field, one
 * consent line. No competing CTAs. This replaces the four-CTA hero stack.
 */
export const Opener = ({ onStart, busy = false }: OpenerProps) => {
  const reduce = useReducedMotion();
  const [decision, setDecision] = useState("");
  const [email, setEmail] = useState("");

  const canSubmit = decision.trim().length > 2 && !busy;

  const submit = () => {
    if (!canSubmit) return;
    onStart(decision.trim(), email.trim() || undefined);
  };

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.5 },
        };

  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col justify-center px-5 py-10 sm:px-8">
      <motion.div className="mb-6 flex items-center gap-3" {...fade(0)}>
        <MindyAvatar size={56} />
        <div>
          <p className="text-sm font-semibold text-white">Mindy</p>
          <p className="text-xs text-white/55">Mindmaker</p>
        </div>
      </motion.div>

      <motion.h1
        className="text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl md:text-5xl"
        {...fade(0.08)}
      >
        What is the AI decision on your desk right now?
      </motion.h1>

      <motion.p
        className="mt-4 max-w-xl text-base leading-relaxed text-white/70"
        {...fade(0.16)}
      >
        Bring the one you keep turning over. I will reflect it back, pull it
        apart, and tell you the honest next step. No deck, no pitch.
      </motion.p>

      <motion.div className="mt-7 space-y-4" {...fade(0.24)}>
        <Textarea
          value={decision}
          onChange={(e) => setDecision(e.target.value.slice(0, 600))}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit();
          }}
          placeholder="e.g. Do we build our own AI tools or buy off the shelf?"
          rows={3}
          autoFocus
          className="resize-none border-white/15 bg-white/5 text-base text-white placeholder:text-white/35 focus-visible:ring-mint/60"
        />

        <div className="space-y-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="Work email (optional)"
            className="border-white/15 bg-white/5 text-base text-white placeholder:text-white/35 focus-visible:ring-mint/60"
          />
          <p className="text-sm leading-relaxed text-white/55">
            Drop a work email if you want me to read up on your company while we
            talk. Skip it and just think out loud.
          </p>
        </div>

        <Button
          onClick={submit}
          disabled={!canSubmit}
          className="w-full bg-gradient-to-r from-mint to-emerald-400 py-6 text-base font-bold text-ink shadow-lg shadow-mint/25 transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 disabled:translate-y-0 disabled:opacity-40"
        >
          {busy ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Starting
            </>
          ) : (
            <>
              Think it through with me
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-white/45">
          <Lock className="h-3 w-3" />
          If you share an email I only read your public website to talk straight.
          Nothing stored beyond this session.
        </p>
      </motion.div>
    </div>
  );
};

export default Opener;
