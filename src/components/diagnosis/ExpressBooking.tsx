import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarClock, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CALENDLY_URL } from "./useDiagnosisSession";
import type { Contact } from "./types";

interface ExpressBookingProps {
  contact: Contact;
  decision: string;
  /** Fires the digest + opens Calendly in a new tab (the always-on exit). */
  onBookCall: () => void;
  /** Drop into the full diagnosis instead. */
  onSwitchToFull: () => void;
}

declare global {
  interface Window {
    Calendly?: { initInlineWidget?: (opts: Record<string, unknown>) => void };
  }
}

const CALENDLY_WIDGET_SRC =
  "https://assets.calendly.com/assets/external/widget.js";

/** Prefill the Calendly form from what we already collected. */
const prefilledUrl = (contact: Contact): string => {
  const url = new URL(CALENDLY_URL);
  if (contact.name) url.searchParams.set("name", contact.name);
  if (contact.email) url.searchParams.set("email", contact.email);
  url.searchParams.set("hide_gdpr_banner", "1");
  return url.toString();
};

/**
 * The express destination: a calm confirmation line, the live Calendly inline
 * widget, and a guaranteed fallback button. Enrichment keeps running in the
 * background so Krish still gets the brief; the visitor just books.
 */
export const ExpressBooking = ({
  contact,
  decision,
  onBookCall,
  onSwitchToFull,
}: ExpressBookingProps) => {
  const reduce = useReducedMotion();
  const widgetRef = useRef<HTMLDivElement>(null);
  const [widgetReady, setWidgetReady] = useState(false);

  // Don't let the visitor advance to the call with no decision on record. The
  // opener gates this too, but guard here so an empty line can never book.
  const hasDecision = decision.trim().length > 0;

  useEffect(() => {
    let cancelled = false;
    const url = prefilledUrl(contact);

    const mount = () => {
      if (cancelled || !widgetRef.current || !window.Calendly?.initInlineWidget)
        return;
      widgetRef.current.innerHTML = "";
      window.Calendly.initInlineWidget({
        url,
        parentElement: widgetRef.current,
      });
      setWidgetReady(true);
    };

    if (window.Calendly?.initInlineWidget) {
      mount();
    } else {
      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${CALENDLY_WIDGET_SRC}"]`,
      );
      if (existing) {
        existing.addEventListener("load", mount, { once: true });
      } else {
        const s = document.createElement("script");
        s.src = CALENDLY_WIDGET_SRC;
        s.async = true;
        s.onload = mount;
        document.body.appendChild(s);
      }
    }

    return () => {
      cancelled = true;
    };
  }, [contact]);

  const reveal = (delay: number) =>
    reduce
      ? { initial: false }
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.45 },
        };

  return (
    <div className="flex h-full flex-col">
      <motion.div className="mb-4 shrink-0" {...reveal(0)}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mint/80">
          Almost there
        </p>
        <h3 className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">
          Pick a time that works.
        </h3>
        <p className="mt-1.5 flex items-start gap-1.5 text-sm leading-relaxed text-white/60">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-mint" />
          <span>
            I've briefed Krish on
            {decision ? ` "${decision}"` : " your decision"}. He'll come to the
            call ready.
          </span>
        </p>
      </motion.div>

      {/* live Calendly inline widget — white paper floating on a glass frame */}
      <motion.div
        className="glass-panel relative min-h-0 flex-1 overflow-hidden rounded-2xl p-1.5"
        {...reveal(0.08)}
      >
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-white">
          <div
            ref={widgetRef}
            className="h-full min-h-[420px] w-full"
            style={{ minWidth: "280px" }}
          />
          {!widgetReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white text-center">
              <div className="h-9 w-9 rounded-full border-2 border-mint/40 border-t-mint motion-safe:animate-spin" />
              <p className="text-sm text-ink/60">Loading the calendar</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* guaranteed fallback + escape hatch */}
      <motion.div className="mt-4 shrink-0 space-y-3" {...reveal(0.16)}>
        <Button
          onClick={onBookCall}
          disabled={!hasDecision}
          variant="outline"
          className="w-full border-mint/40 text-mint hover:bg-mint/10 disabled:opacity-40 min-h-[44px]"
        >
          <CalendarClock className="mr-2 h-4 w-4" />
          Open the calendar in a new tab
          <ExternalLink className="ml-2 h-3.5 w-3.5" />
        </Button>
        {!hasDecision && (
          <p className="text-center text-[13px] leading-relaxed text-white/55">
            Add your decision first, then pick a time.
          </p>
        )}
        <button
          type="button"
          onClick={onSwitchToFull}
          className="mx-auto block text-[13px] text-white/55 underline-offset-4 transition-colors hover:text-mint hover:underline sm:text-sm"
        >
          Actually, help me think it through first
        </button>
      </motion.div>
    </div>
  );
};

export default ExpressBooking;
