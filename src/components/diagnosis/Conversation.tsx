import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownResponse } from "@/components/ui/markdown-response";
import { MindyAvatar } from "./MindyAvatar";
import type { ConversationTurn } from "./types";

interface ConversationProps {
  turns: ConversationTurn[];
  thinking: boolean;
  error?: string | null;
  onSend: (text: string) => void;
  /** Disable the input (e.g. while enrichment is still painting). */
  disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Typewriter — types a finished assistant reply out once, respects reduced
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
    // step by a few chars per tick so long replies don't crawl
    const step = Math.max(1, Math.round(full.length / 220));
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
      className="text-white/85 [&_em]:text-white/70 [&_strong]:text-white"
    />
  );
};

export const Conversation = ({
  turns,
  thinking,
  error,
  onSend,
  disabled = false,
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

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [turns, thinking, reduce]);

  const submit = () => {
    const t = draft.trim();
    if (!t || disabled) return;
    setDraft("");
    onSend(t);
  };

  return (
    <div className="flex h-full flex-col">
      <div
        ref={scrollRef}
        className="flex-1 space-y-5 overflow-y-auto pr-1"
      >
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
                <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-mint/15 px-4 py-2.5 text-sm leading-relaxed text-white">
                  {turn.content}
                </p>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={turn.id}
              className="flex gap-3"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MindyAvatar size={32} state={turn.pending ? "thinking" : "idle"} />
              <div className="min-w-0 flex-1 pt-0.5 text-sm">
                {turn.pending ? (
                  <span className="inline-flex items-center gap-1 text-white/50">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" />
                    <span
                      className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint"
                      style={{ animationDelay: "0.15s" }}
                    />
                    <span
                      className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </span>
                ) : (
                  <AssistantTurn
                    content={turn.content}
                    animate={!reduce && isNewestAssistant}
                  />
                )}
              </div>
            </motion.div>
          );
        })}

        {error && (
          <p className="text-sm text-red-300/90" role="alert">
            {error}
          </p>
        )}
      </div>

      {/* input */}
      <div className="mt-4 shrink-0">
        <div className="relative">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, 1000))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder={disabled ? "One moment" : "Say a bit more"}
            rows={1}
            disabled={disabled}
            className="max-h-32 min-h-[52px] resize-none border-white/15 bg-white/5 pr-14 text-sm text-white placeholder:text-white/35 focus-visible:ring-mint/60"
          />
          <Button
            size="icon"
            onClick={submit}
            disabled={!draft.trim() || disabled}
            className="absolute bottom-2 right-2 h-9 w-9 rounded-full bg-mint text-ink hover:bg-mint/90 disabled:opacity-40"
            aria-label="Send"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
