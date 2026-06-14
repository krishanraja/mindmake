import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, ExternalLink, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dossier } from "./types";

interface DossierRevealProps {
  dossier: Dossier | null;
  /** Called when the visitor taps the quiet "that's not us" affordance. */
  onCorrect?: () => void;
}

const MINDMAKER_WORDMARK = "Mindmaker";

/** Pick a brand tint, falling back to mint, and keep it readable on dark. */
const tintFrom = (colors?: string[]): string => {
  const first = colors?.find((c) => /^#?[0-9a-f]{3,8}$/i.test(c.replace("#", "")));
  return first ? (first.startsWith("#") ? first : `#${first}`) : "#7ef4c2";
};

/**
 * The co-brand paint and the "what I heard" reflection. The client logo paints
 * next to the Mindmaker wordmark, tinted by their first brand colour. Identity,
 * understanding and synthesis reveal in sequence. scale.* is never read here
 * (the hook already strips it), and we render nothing numeric about size.
 */
export const DossierReveal = ({ dossier, onCorrect }: DossierRevealProps) => {
  const reduce = useReducedMotion();

  const tint = useMemo(
    () => tintFrom(dossier?.identity?.colors),
    [dossier?.identity?.colors],
  );

  if (!dossier?.identity) return null;

  const { identity, understanding, currency, synthesis } = dossier;
  const company = identity.name || "your company";
  const logo = identity.logoUrl || identity.iconUrl;
  // Adaptive contrast: a light/white mark goes straight on the dark glass; a
  // dark/coloured mark (or one we haven't measured yet) sits on a white plate.
  const onLightPlate = identity.logoBg !== "light";

  const reveal = (delay: number) =>
    reduce
      ? { initial: false }
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.55, ease: [0.4, 0, 0.2, 1] as const },
        };

  const facts: string[] = [
    understanding?.tagline ? `"${understanding.tagline}"` : "",
    understanding?.products?.length
      ? `Products: ${understanding.products.slice(0, 4).join(", ")}`
      : "",
    understanding?.industry ? `Industry: ${understanding.industry}` : "",
    understanding?.stack?.length
      ? `Stack: ${understanding.stack.slice(0, 4).join(", ")}`
      : "",
    identity.founded ? `Founded ${identity.founded}` : "",
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      {/* co-brand hero */}
      <motion.div
        className="glass-panel relative overflow-hidden rounded-2xl p-6"
        style={{
          background: `linear-gradient(135deg, ${tint}26, transparent 70%)`,
        }}
        {...reveal(0)}
      >
        <span
          className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"
          style={{ background: `${tint}40` }}
          aria-hidden
        />
        <span
          className="absolute -bottom-12 -left-8 h-36 w-36 rounded-full blur-3xl"
          style={{ background: `${tint}24` }}
          aria-hidden
        />
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
          Working brief
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {logo && (
            <motion.span
              className={cn(
                "inline-flex items-center justify-center",
                onLightPlate &&
                  "rounded-lg bg-white px-2.5 py-1.5 shadow-sm ring-1 ring-black/5",
              )}
              {...(reduce
                ? {}
                : {
                    initial: { opacity: 0, scale: 0.9 },
                    animate: { opacity: 1, scale: 1 },
                    transition: { delay: 0.15, duration: 0.5 },
                  })}
            >
              <img
                src={logo}
                alt={company}
                className={cn(
                  "object-contain",
                  onLightPlate ? "h-6 max-w-[150px]" : "h-7 max-w-[160px]",
                )}
                onError={(e) => {
                  const plate = (e.currentTarget as HTMLImageElement)
                    .parentElement;
                  if (plate) plate.style.display = "none";
                }}
              />
            </motion.span>
          )}
          {logo && <span className="text-xl font-light text-white/30">×</span>}
          <span className="font-display text-xl font-bold text-white">
            {MINDMAKER_WORDMARK}
          </span>
        </div>
      </motion.div>

      {/* what I heard */}
      <motion.div className="space-y-4" {...reveal(0.2)}>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mint/80">
            What I heard
          </p>
          {onCorrect && (
            <button
              type="button"
              onClick={onCorrect}
              className="inline-flex items-center gap-1 text-xs text-white/45 transition-colors hover:text-mint"
            >
              <Pencil className="h-3 w-3" />
              That's not us
            </button>
          )}
        </div>

        {synthesis && (
          <p className="text-base leading-relaxed text-white/85">{synthesis}</p>
        )}

        {facts.length > 0 && (
          <ul className="space-y-2">
            {facts.map((fact, i) => (
              <motion.li
                key={fact}
                className="flex items-start gap-2 text-sm text-white/70"
                {...reveal(0.3 + i * 0.07)}
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-mint" />
                <span>{fact}</span>
              </motion.li>
            ))}
          </ul>
        )}

        {/* currency: dated, sourced, never faked */}
        {currency && currency.length > 0 && (
          <motion.div
            className="glass-panel rounded-xl p-4"
            {...reveal(0.45)}
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
              Why now
            </p>
            <ul className="space-y-2">
              {currency.slice(0, 2).map((c, i) => (
                <li key={i} className="text-sm text-white/70">
                  {c.text}
                  {c.sourceUrl && (
                    <a
                      href={c.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1.5 inline-flex items-center gap-0.5 text-xs text-mint hover:underline"
                    >
                      {c.source || "source"}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {c.date && (
                    <span className="ml-1.5 text-xs text-white/40">{c.date}</span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default DossierReveal;
