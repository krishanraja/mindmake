import { Quote } from "lucide-react";
import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import type { CaseStudy, Engagement } from "@/data/caseStudies";

/** Subtle, WCAG-safe engagement pills (never text-mint on light backgrounds). */
const engagementPill: Record<Engagement, string> = {
  Cohort: "border-mint/30 bg-mint/10 text-mint-dark dark:text-mint",
  Handover: "border-mint/40 bg-mint/15 text-mint-dark dark:text-mint",
  Teardown: "border-ink/15 bg-ink/5 text-ink dark:border-mint/20 dark:bg-white/5 dark:text-foreground",
};

const Detail = ({ label, children }: { label: string; children: ReactNode }) => (
  <div>
    <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
    <div className="text-foreground/90">{children}</div>
  </div>
);

export const CaseStudyCard = ({ caseStudy }: { caseStudy: CaseStudy }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isCase = caseStudy.variant === "case";
  const primary = caseStudy.metrics[0];

  return (
    <div
      className="relative w-full h-full p-5 rounded-2xl border border-border/50 hover:border-ink/20 dark:hover:border-mint/20 transition-all cursor-pointer flex flex-col bg-background select-none"
      onClick={() => setIsExpanded((v) => !v)}
    >
      {/* Engagement tag */}
      <span
        className={`absolute top-3 right-3 inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-[0.14em] border ${engagementPill[caseStudy.engagement]}`}
      >
        {caseStudy.engagement}
      </span>

      {/* Sector eyebrow */}
      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground mb-2 pr-24">
        {caseStudy.sector}
      </div>

      {/* Primary metric */}
      {primary && (
        <div className="mb-2">
          <div className="text-3xl font-bold text-ink dark:text-mint leading-none">{primary.value}</div>
          <div className="text-[11px] text-muted-foreground mt-1 line-clamp-1">{primary.label}</div>
        </div>
      )}

      {isCase ? (
        <p className={`text-sm font-medium shrink-0 ${isExpanded ? "" : "line-clamp-2"}`}>
          {caseStudy.headline}
        </p>
      ) : (
        <>
          <Quote className="h-3.5 w-3.5 text-ink/20 dark:text-white/20 mb-1.5 shrink-0" />
          <p className={`text-sm font-medium shrink-0 ${isExpanded ? "" : "line-clamp-3"}`}>
            &ldquo;{caseStudy.quote?.text ?? caseStudy.headline}&rdquo;
          </p>
        </>
      )}

      {/* Expanded detail (rich cases only) */}
      {isCase && (
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="text-[12px] leading-relaxed mt-3 space-y-2.5">
            {caseStudy.situation && <Detail label="Situation">{caseStudy.situation}</Detail>}
            {caseStudy.theCall && <Detail label="The call">{caseStudy.theCall}</Detail>}
            {caseStudy.theWork && <Detail label="The work">{caseStudy.theWork}</Detail>}

            {caseStudy.metrics.length > 1 && (
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-2 border-t border-border/30">
                {caseStudy.metrics.map((m) => (
                  <div key={m.label} className="min-w-0">
                    <span className="text-mint-dark dark:text-mint font-bold">{m.value}</span>{" "}
                    <span className="text-muted-foreground">{m.label}</span>
                  </div>
                ))}
              </div>
            )}

            {caseStudy.quote && (
              <blockquote className="pt-2 border-t border-border/30 italic text-foreground/90">
                &ldquo;{caseStudy.quote.text}&rdquo;
                <footer className="not-italic text-[10px] text-muted-foreground mt-1">
                  {caseStudy.quote.attribution}
                </footer>
              </blockquote>
            )}
          </div>
        </motion.div>
      )}

      {/* Read-more hint */}
      {!isExpanded && (
        <p className="text-[10px] text-mint-dark dark:text-mint mt-1.5 font-medium">
          {isCase ? "See the work" : "Read more"}
        </p>
      )}

      {/* Footer */}
      <div className="mt-auto pt-3 border-t border-border/30">
        <div className="font-semibold text-[11px]">{caseStudy.clientLabel}</div>
      </div>
    </div>
  );
};

export default CaseStudyCard;
