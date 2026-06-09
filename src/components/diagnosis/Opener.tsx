import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarClock, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
 */
export const Opener = ({
  mode,
  onStart,
  onExpressBook,
  onSwitchToFull,
  onTranscribe,
  busy = false,
}: OpenerProps) => {
  const reduce = useReducedMotion();
  const [decision, setDecision] = useState("");
  const [email, setEmail] = useState("");

  const express = mode === "express";
  const emailOk = EMAIL_RE.test(email.trim());
  const canSubmit =
    decision.trim().length > 2 && !busy && (!express || emailOk);

  const submit = () => {
    if (!canSubmit) return;
    const d = decision.trim();
    const e = email.trim() || undefined;
    if (express) onExpressBook(d, e);
    else onStart(d, e);
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
          {TOPIC_PILLS.map((pill) => (
            <button
              key={pill}
              type="button"
              onClick={() => setDecision(pill)}
              className="rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-2 text-left text-[13px] font-medium text-white/70 transition-colors hover:border-mint/50 hover:bg-mint/[0.08] hover:text-mint min-h-[40px]"
            >
              {pill}
            </button>
          ))}
        </div>

        <div className="relative">
          <Textarea
            value={decision}
            onChange={(e) => setDecision(e.target.value.slice(0, 600))}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit();
            }}
            placeholder="e.g. Do we build our own AI tools or buy off the shelf?"
            rows={express ? 2 : 3}
            className="resize-none border-white/15 bg-white/5 pr-14 text-[15px] text-white placeholder:text-white/35 focus-visible:ring-mint/60 sm:text-base"
          />
          <div className="absolute bottom-2.5 right-2.5">
            <MicButton onTranscribe={onTranscribe} onResult={(t) => setDecision((d) => (d ? `${d} ${t}` : t).slice(0, 600))} />
          </div>
        </div>

        <div className="space-y-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder={express ? "Work email" : "Work email (optional)"}
            className="border-white/15 bg-white/5 text-[15px] text-white placeholder:text-white/35 focus-visible:ring-mint/60 sm:text-base"
          />
          <p className="text-[13px] leading-relaxed text-white/55 sm:text-sm">
            {express
              ? "Used to set up the call and brief Krish. Nothing else."
              : "Drop a work email if you want me to read up on your company while we talk. Skip it and just think out loud."}
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
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>

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
  );
};

export default Opener;
