import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle, ChevronDown } from "lucide-react";

export interface ProductExpandCardData {
  id: string;
  category: string;
  headline: string;
  subhead: string;
  price: string;
  priceDetail?: string;
  trioLine: string;
  primaryCTA: {
    label: string;
    preselected: string;
  };
  description: string;
  walkOutWith: string[];
  bestFor: string;
  paymentTerms?: string;
  faqs?: Array<{ q: string; a: string }>;
}

export interface ProductExpandCardProps extends ProductExpandCardData {
  expanded: boolean;
  onToggle: () => void;
}

const fireConsultModal = (preselected: string) => {
  window.dispatchEvent(
    new CustomEvent("openConsultModal", { detail: { preselected } })
  );
};

export const ProductExpandCard = ({
  id,
  category,
  headline,
  subhead,
  price,
  priceDetail,
  trioLine,
  expanded,
  onToggle,
  primaryCTA,
  description,
  walkOutWith,
  bestFor,
  paymentTerms,
  faqs,
}: ProductExpandCardProps) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const wasExpandedRef = useRef(expanded);

  useEffect(() => {
    if (expanded && !wasExpandedRef.current) {
      headingRef.current?.focus();
    }
    wasExpandedRef.current = expanded;
  }, [expanded]);

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("[data-stop-toggle]")) return;
    onToggle();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };

  const contentId = `${id}-content`;

  return (
    <article
      id={id}
      className={`glass-card editorial-card p-8 md:p-10 border transition-all duration-300 scroll-mt-24 ${
        expanded
          ? "border-mint/40 shadow-xl shadow-mint/10"
          : "border-border/50 hover:border-mint/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-mint/10 cursor-pointer"
      }`}
      onClick={expanded ? undefined : handleCardClick}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-3">
              {category}
            </div>
            <h3
              ref={headingRef}
              tabIndex={-1}
              className="text-2xl md:text-3xl font-bold mb-3 leading-tight focus:outline-none"
            >
              {headline}
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {subhead}
            </p>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-bold">{price}</span>
              {priceDetail && (
                <span className="text-sm text-muted-foreground">
                  {priceDetail}
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm italic text-muted-foreground leading-relaxed border-l-2 border-mint/40 pl-4">
          {trioLine}
        </p>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="expanded"
              id={contentId}
              role="region"
              aria-label={`${category} details`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-2 space-y-6 border-t border-border/40">
                <p className="text-base leading-relaxed text-foreground/90 pt-6">
                  {description}
                </p>

                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground mb-3">
                    What you walk out with
                  </div>
                  <ul className="space-y-2.5">
                    {walkOutWith.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-mint shrink-0 mt-1" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-sm leading-relaxed">
                  <strong className="text-foreground">Best for: </strong>
                  <span className="text-muted-foreground">{bestFor}</span>
                </p>

                {paymentTerms && (
                  <p className="text-xs text-muted-foreground">
                    {paymentTerms}
                  </p>
                )}

                {faqs && faqs.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      Common questions
                    </div>
                    {faqs.map((faq, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-border/40 p-4"
                      >
                        <p className="font-semibold text-sm mb-1.5">{faq.q}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center pt-2">
          <Button
            size="lg"
            className="bg-ink dark:bg-mint text-white dark:text-ink hover:opacity-90 font-bold flex-1 sm:flex-none"
            data-stop-toggle
            onClick={(e) => {
              e.stopPropagation();
              fireConsultModal(primaryCTA.preselected);
            }}
          >
            {primaryCTA.label}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <button
            type="button"
            onClick={onToggle}
            onKeyDown={handleKeyDown}
            aria-expanded={expanded}
            aria-controls={contentId}
            className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-mint-dark dark:text-mint hover:opacity-80 transition-opacity px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-mint/40"
          >
            {expanded ? "Collapse" : "Learn more"}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductExpandCard;
