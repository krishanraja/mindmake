import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownResponse } from "@/components/ui/markdown-response";
import { haptics } from "@/lib/haptics";
import { sound } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { MindyAvatar } from "./MindyAvatar";
import { MicButton } from "./MicButton";
import type { ConversationTurn } from "./types";

interface ConversationProps {
  turns: ConversationTurn[];
  thinking: boolean;
  error?: string | null;
  onSend: (text: string) => void;
  /** Tap a pill or the error CTA to book the call. */
  onBookCall: () => void;
  /** Record -> transcribe -> returns text for the input. */
  onTranscribe: (blob: Blob) => Promise<string>;
  /** Disable the input (e.g. while enrichment is still painting). */
  disabled?: boolean;
  /** Pixels the soft keyboard covers, so we re-pin the latest turn. */
  keyboardHeight?: number;
}

// ---------------------------------------------------------------------------
// Typewriter: types a finished assistant reply out once, respects reduced
// motion (instant), and never re-types the same content.
// ---------------------------------------------------------------------------
const useTypewriter = (full: string, enabled: boolean) => {
  const [shown, setShown] = useState(enabled ? "" : full);
  const doneFor = useRef<string>("");

  useEffect(() => {
    if (!enabled) {
      setShown(full);
      return;
    }
    if (doneFor.current === full) {
      setShown(full);
      return;
    }
    setShown("");
    let i = 0;
    // step by a few chars per tick so long replies don't crawl. Turns are now
    // short, so this resolves in well under a second.
    const step = Math.max(1, Math.round(full.length / 160));
    const id = window.setInterval(() => {
      i += step;
      if (i >= full.length) {
        setShown(full);
        doneFor.current = full;
        window.clearInterval(id);
      } else {
        setShown(full.slice(0, i));
      }
    }, 16);
    return () => window.clearInterval(id);
  }, [full, enabled]);

  return shown;
};

const AssistantTurn = ({
  content,
  animate,
}: {
  content: string;
  animate: boolean;
}) => {
  const text = useTypewriter(content, animate);
  return (
    <MarkdownResponse
      content={text}
      className="text-[15px] leading-relaxed text-white/85 [&_em]:text-white/70 [&_strong]:text-white"
    />
  );
};

// a soft 3-dot wave while Mindy composes a turn
const ThinkingDots = () => (
  <span className="inline-flex items-center gap-1">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="h-1.5 w-1.5 rounded-full bg-mint"
        animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
        transition={{
          duration: 0.9,
          repeat: Infinity,
          delay: i * 0.15,
          ease: "easeInOut",
        }}
      />
    ))}
  </span>
);

// calm glass pills, mint accent, generous touch target
const QuickReplyPills = ({
  options,
  onPick,
}: {
  options: string[];
  onPick: (text: string) => void;
}) => {
  const reduce = useReducedMotion();
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {options.map((opt) => (
        <motion.button
          key={opt}
          type="button"
          onClick={() => onPick(opt)}
          whileTap={reduce ? undefined : { scale: 0.96 }}
          className="min-h-[44px] rounded-full border border-mint/30 bg-mint/[0.08] px-3.5 py-2 text-[13px] font-medium text-mint/90 transition-colors hover:border-mint/60 hover:bg-mint/15 hover:text-mint"
        >
          {opt}
        </motion.button>
      ))}
    </div>
  );
};

export const Conversation = ({
  turns,
  thinking,
  error,
  onSend,
  onBookCall,
  onTranscribe,
  disabled = false,
  keyboardHeight = 0,
}: ConversationProps) => {
  const reduce = useReducedMotion();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastAssistantId = useRef<string | null>(null);

  // newest finished assistant turn gets the typewriter; older ones are static
  const finishedAssistant = [...turns]
    .reverse()
    .find((t) => t.role === "assistant" && !t.pending);
  if (finishedAssistant && lastAssistantId.current === null) {
    lastAssistantId.current = finishedAssistant.id;
  }

  // fire a receive cue when a new finished assistant turn lands (skip the first)
  const seenAssistantId = useRef<string | null>(null);
  useEffect(() => {
    const latest = [...turns]
      .reverse()
      .find((t) => t.role === "assistant" && !t.pending);
    if (!latest) return;
    if (seenAssistantId.current === null) {
      seenAssistantId.current = latest.id;
      return;
    }
    if (seenAssistantId.current !== latest.id) {
      seenAssistantId.current = latest.id;
      if (latest.kind === "error") {
        haptics.warn();
      } else {
        haptics.tap();
        sound.play("receive");
      }
    }
  }, [turns]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el)
      el.scrollTo({
        top: el.scrollHeight,
        behavior: reduce ? "auto" : "smooth",
      });
  }, [turns, thinking, reduce, keyboardHeight]);

  const submit = () => {
    const t = draft.trim();
    if (!t || disabled) return;
    haptics.send();
    sound.play("send");
    setDraft("");
    onSend(t);
  };

  const pickPill = (text: string) => {
    if (disabled || thinking) return;
    haptics.send();
    sound.play("send");
    onSend(text);
  };

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto pr-1">
        {turns.map((turn) => {
          const isNewestAssistant =
            turn.role === "assistant" &&
            !turn.pending &&
            finishedAssistant?.id === turn.id &&
            lastAssistantId.current !== turn.id;

          if (turn.role === "user") {
            return (
              <motion.div
                key={turn.id}
                className="flex justify-end"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-mint/15 px-4 py-2.5 text-[15px] leading-relaxed text-white shadow-[0_2px_12px_-4px_rgba(0,217,182,0.25)]">
                  {turn.content}
                </p>
              </motion.div>
            );
          }

          const isError = turn.kind === "error";

          return (
            <motion.div
              key={turn.id}
              className="flex gap-3"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MindyAvatar
                size={32}
                state={turn.pending ? "thinking" : "idle"}
              />
              <div className="min-w-0 flex-1 pt-0.5">
                {turn.pending ? (
                  <ThinkingDots />
                ) : isError ? (
                  // graceful error: a calm line + a real book-call button,
                  // never a raw "non-2xx" string.
                  <div className="space-y-3">
                    <p className="text-[15px] leading-relaxed text-white/85">
                      {turn.content}
                    </p>
                    <Button
                      onClick={onBookCall}
                      className="min-h-[44px] bg-gradient-to-r from-mint to-emerald-400 font-bold text-ink hover:opacity-90"
                    >
                      <CalendarClock className="mr-2 h-4 w-4" />
                      Book a call with Krish
                    </Button>
                  </div>
                ) : (
                  <>
                    <AssistantTurn
                      content={turn.content}
                      animate={!reduce && isNewestAssistant}
                    />
                    {turn.quickReplies && turn.quickReplies.length > 0 && (
                      <QuickReplyPills
                        options={turn.quickReplies}
                        onPick={pickPill}
                      />
                    )}
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* composer: a glass dock that rides above the keyboard */}
      <div className="mt-4 shrink-0">
        <div className="glass-panel flex items-end gap-2 rounded-2xl p-2">
          <MicButton
            onTranscribe={onTranscribe}
            onResult={(text) =>
              setDraft((d) => (d ? `${d} ${text}` : text).slice(0, 1000))
            }
            disabled={disabled}
            className="mb-1"
          />
          <div className="relative flex-1">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value.slice(0, 1000))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder={
                disabled ? "One moment" : "Say a bit more, or tap the mic"
              }
              rows={1}
              disabled={disabled}
              className="max-h-32 min-h-[44px] resize-none border-0 bg-transparent px-1 pr-12 text-[15px] text-white placeholder:text-white/35 focus-visible:ring-0"
            />
            <motion.div
              className="absolute bottom-1 right-1"
              whileTap={reduce || !draft.trim() ? undefined : { scale: 0.9 }}
            >
              <Button
                size="icon"
                onClick={submit}
                disabled={!draft.trim() || disabled}
                className={cn(
                  "h-9 w-9 rounded-full bg-mint text-ink transition-all hover:bg-mint/90 disabled:opacity-40",
                  draft.trim() &&
                    !disabled &&
                    "shadow-[0_2px_14px_-2px_rgba(0,217,182,0.6)]",
                )}
                aria-label="Send"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
