import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarClock, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { haptics } from "@/lib/haptics";
import { sound } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { MindyAvatar } from "./MindyAvatar";
import { MicButton } from "./MicButton";
import type { SessionMode } from "./types";

interface OpenerProps {
  mode: SessionMode;
  onStart: (decision: string, email?: string) => void;
  /** Express path: collect the one-liner + email, then rush to the booking. */
  onExpressBook: (decision: string, email?: string) => void;
  /** From express, drop the visitor into the full diagnosis instead. */
  onSwitchToFull: () => void;
  /** Record -> transcribe -> returns text for the input. */
  onTranscribe: (blob: Blob) => Promise<string>;
  busy?: boolean;
  /** Pixels the soft keyboard covers, so the CTA floats above it. */
  keyboardHeight?: number;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Predictable decision shapes. Tapping one prefills the box (free text still
// works). Sentence case, no buzzwords, operator phrasing.
const TOPIC_PILLS = [
  "Build our own AI tools or buy off the shelf",
  "Where AI actually fits in how we make money",
  "Whether to hire for AI or train the team we have",
  "One nervous AI decision I keep turning over",
];

/**
 * The single door. In full mode: one prompt, topic pills, an optional
 * work-email field, voice input. In express mode: a compact warm line, the
 * same pills, a work-email field, and a single button that rushes to a call.
 *
 * The column scrolls if it can't fit (short phones) and top-aligns with the
 * keyboard open so the active field and CTA stay visible above it.
 */
export const Opener = ({
  mode,
  onStart,
  onExpressBook,
  onSwitchToFull,
  onTranscribe,
  busy = false,
  keyboardHeight = 0,
}: OpenerProps) => {
  const reduce = useReducedMotion();
  const [decision, setDecision] = useState("");
  const [email, setEmail] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const express = mode === "express";
  const emailOk = EMAIL_RE.test(email.trim());
  const canSubmit =
    decision.trim().length > 2 && !busy && (!express || emailOk);
  const kbOpen = keyboardHeight > 100;

  const submit = () => {
    if (!canSubmit) return;
    haptics.send();
    sound.play("send");
    const d = decision.trim();
    const e = email.trim() || undefined;
    if (express) onExpressBook(d, e);
    else onStart(d, e);
  };

  const pickPill = (pill: string) => {
    haptics.select();
    sound.play("tick");
    setDecision(pill);
  };

  // keep the focused field visible above the keyboard
  const onFieldFocus = (e: React.FocusEvent<HTMLElement>) => {
    if (typeof window === "undefined") return;
    window.setTimeout(() => {
      e.target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: {
            delay,
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1] as const,
          },
        };

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto">
      <div
        className={cn(
          "mx-auto flex min-h-full w-full max-w-2xl flex-col px-5 py-8 sm:px-8",
          kbOpen ? "justify-start" : "justify-center",
        )}
        style={kbOpen ? { paddingBottom: keyboardHeight + 24 } : undefined}
      >
        <motion.div className="mb-6 flex items-center gap-3" {...fade(0)}>
          <MindyAvatar size={56} />
          <div>
            <p className="text-sm font-semibold text-white">Mindy</p>
            <p className="text-xs text-white/55">Mindmaker</p>
          </div>
        </motion.div>

        <motion.h1
          className="text-[1.7rem] font-bold leading-[1.15] tracking-tight text-white sm:text-4xl md:text-5xl"
          {...fade(0.08)}
        >
          {express
            ? "Let's get you a time with Krish."
            : "What is the AI decision on your desk right now?"}
        </motion.h1>

        <motion.p
          className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/70 sm:text-base"
          {...fade(0.16)}
        >
          {express
            ? "Tell me the decision in a line and drop a work email. I'll set up the call and brief Krish before you arrive."
            : "Bring the one you keep turning over. I will reflect it back, pull it apart, and tell you the honest next step. No deck, no pitch."}
        </motion.p>

        <motion.div className="mt-6 space-y-4" {...fade(0.24)}>
          {/* topic pills: tap to prefill, free text still works */}
          <div className="flex flex-wrap gap-2">
            {TOPIC_PILLS.map((pill) => {
              const selected = decision === pill;
              return (
                <motion.button
                  key={pill}
                  type="button"
                  onClick={() => pickPill(pill)}
                  whileTap={reduce ? undefined : { scale: 0.96 }}
                  className={cn(
                    "min-h-[44px] rounded-full border px-3.5 py-2 text-left text-[13px] font-medium transition-colors",
                    selected
                      ? "border-mint/60 bg-mint/15 text-mint shadow-[0_0_24px_-6px_rgba(126,244,194,0.5)]"
                      : "border-white/15 bg-white/[0.04] text-white/70 hover:border-mint/50 hover:bg-mint/[0.08] hover:text-mint",
                  )}
                >
                  {pill}
                </motion.button>
              );
            })}
          </div>

          {/* the input dock: textarea + mic + email in one glass surface */}
          <div className="glass-panel rounded-2xl p-3 transition-shadow focus-within:ring-1 focus-within:ring-mint/40">
            <div className="relative">
              <Textarea
                value={decision}
                onChange={(e) => setDecision(e.target.value.slice(0, 600))}
                onFocus={onFieldFocus}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit();
                }}
                placeholder="e.g. Do we build our own AI tools or buy off the shelf?"
                rows={express ? 2 : 3}
                className="resize-none border-0 bg-transparent px-1 pr-12 text-[15px] text-white placeholder:text-white/35 focus-visible:ring-0 sm:text-base"
              />
              <div className="absolute bottom-1 right-1">
                <MicButton
                  onTranscribe={onTranscribe}
                  onResult={(t) =>
                    setDecision((d) => (d ? `${d} ${t}` : t).slice(0, 600))
                  }
                />
              </div>
            </div>
            <div className="mt-2 border-t border-white/10 pt-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={onFieldFocus}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submit();
                }}
                placeholder={express ? "Work email" : "Work email (optional)"}
                className="border-0 bg-transparent px-1 text-[15px] text-white placeholder:text-white/35 focus-visible:ring-0 sm:text-base"
              />
            </div>
          </div>

          <p className="text-[13px] leading-relaxed text-white/55 sm:text-sm">
            {express
              ? "Used to set up the call and brief Krish. Nothing else."
              : "Drop a work email if you want me to read up on your company while we talk. Skip it and just think out loud."}
          </p>

          <motion.div whileTap={reduce || !canSubmit ? undefined : { scale: 0.99 }}>
            <Button
              onClick={submit}
              disabled={!canSubmit}
              className="group relative w-full overflow-hidden bg-gradient-to-r from-mint to-emerald-400 py-6 text-base font-bold text-ink shadow-lg shadow-mint/25 transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95 disabled:translate-y-0 disabled:opacity-40"
            >
              {/* sheen sweep on hover */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              {busy ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {express ? "Setting up" : "Starting"}
                </>
              ) : express ? (
                <>
                  <CalendarClock className="mr-2 h-5 w-5" />
                  Book the call
                </>
              ) : (
                <>
                  Think it through with me
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </Button>
          </motion.div>

          {express ? (
            <button
              type="button"
              onClick={onSwitchToFull}
              className="mx-auto block text-[13px] text-white/55 underline-offset-4 transition-colors hover:text-mint hover:underline sm:text-sm"
            >
              Actually, help me think it through first
            </button>
          ) : (
            <p className="flex items-center justify-center gap-1.5 text-xs text-white/45">
              <Lock className="h-3 w-3" />
              If you share an email I only read your public website to talk
              straight. Nothing stored beyond this session.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Opener;
