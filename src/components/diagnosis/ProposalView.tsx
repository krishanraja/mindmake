import { motion, useReducedMotion } from "framer-motion";
import { CalendarClock, Download, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Recommendation } from "./types";

interface ProposalViewProps {
  html: string | null;
  loading: boolean;
  pdfLoading: boolean;
  pdfFallback: boolean;
  error?: string | null;
  recommendation: Recommendation | null;
  optInCopy: boolean;
  onOptInChange: (v: boolean) => void;
  onDownloadPdf: () => void;
  onBookCall: () => void;
}

/** The single honest next step beneath the artefact, keyed to the rung's exit. */
const NextStep = ({
  recommendation,
  onBookCall,
}: {
  recommendation: Recommendation | null;
  onBookCall: () => void;
}) => {
  const exit = recommendation?.exit;

  if (exit === "self-serve") {
    return (
      <p className="text-sm leading-relaxed text-white/70">
        This one is self-serve. The proposal has the link to start. No call
        needed unless you want one.
      </p>
    );
  }

  if (exit === "learn") {
    return (
      <p className="text-sm leading-relaxed text-white/70">
        No paid step yet. Keep the brief, sit with it, and come back when the
        decision sharpens.
      </p>
    );
  }

  // book-call / proposal at $12k+ -> the call is the next step
  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-white/70">
        Book the call to walk through it. First conversation is free, and if
        you're not a fit I'll say so on the call, not after you've paid.
      </p>
      <Button
        onClick={onBookCall}
        className="bg-gradient-to-r from-mint to-emerald-400 font-bold text-ink hover:opacity-90"
      >
        <CalendarClock className="mr-2 h-4 w-4" />
        Book a call
      </Button>
    </div>
  );
};

export const ProposalView = ({
  html,
  loading,
  pdfLoading,
  pdfFallback,
  error,
  recommendation,
  optInCopy,
  onOptInChange,
  onDownloadPdf,
  onBookCall,
}: ProposalViewProps) => {
  const reduce = useReducedMotion();

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 shrink-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mint/80">
          Your proposal
        </p>
        <h3 className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">
          {recommendation?.rung
            ? `Scoped to ${recommendation.rung}`
            : "Built from your brief"}
        </h3>
      </div>

      {/* A4-feel scrollable frame */}
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
        {loading || !html ? (
          <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 px-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-mint" />
            <p className="text-sm text-white/55">
              Painting your one-pager. The shell lands first, the prose follows.
            </p>
            {error && <p className="text-sm text-red-300/90">{error}</p>}
          </div>
        ) : (
          <motion.div
            className="h-full overflow-y-auto"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* The proposal HTML is fully styled by the edge function (its own
                @media print CSS). We mount it on a white A4 sheet so the dark
                room frames it like paper. */}
            <div className="mx-auto my-4 w-full max-w-[820px] bg-white text-[#0e1a2b] shadow-2xl">
              <iframe
                title="Mindmaker proposal"
                srcDoc={html}
                className="h-[1100px] w-full border-0"
                sandbox="allow-same-origin"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* controls */}
      <div className="mt-4 shrink-0 space-y-4">
        {error && !loading && html && (
          <p className="text-sm text-red-300/90" role="alert">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={onDownloadPdf}
            disabled={!html || pdfLoading}
            className={cn(
              "bg-mint font-bold text-ink hover:bg-mint/90 disabled:opacity-40",
            )}
          >
            {pdfLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Building PDF
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download proposal
              </>
            )}
          </Button>

          {pdfFallback && (
            <span className="inline-flex items-center gap-1 text-xs text-white/45">
              <ExternalLink className="h-3 w-3" />
              PDF service is down. Download prints from your browser.
            </span>
          )}
        </div>

        <div className="flex items-start gap-2.5">
          <Checkbox
            id="proposal-opt-in"
            checked={optInCopy}
            onCheckedChange={(v) => onOptInChange(v === true)}
            className="mt-0.5 border-white/30 data-[state=checked]:border-mint data-[state=checked]:bg-mint data-[state=checked]:text-ink"
          />
          <Label
            htmlFor="proposal-opt-in"
            className="cursor-pointer text-sm font-normal leading-relaxed text-white/65"
          >
            Email me a copy of this brief and proposal.
          </Label>
        </div>

        <div className="border-t border-white/10 pt-4">
          <NextStep recommendation={recommendation} onBookCall={onBookCall} />
        </div>
      </div>
    </div>
  );
};

export default ProposalView;
