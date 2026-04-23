import { useModelData, type ModelData } from "@/hooks/useModelData";

interface PriceTickerProps {
  size?: "sm" | "lg";
  tone?: "dark" | "light";
}

const formatPrice = (n: number | null) => {
  if (n == null) return "--";
  if (n < 1) return `$${n.toFixed(2)}`;
  return `$${n.toFixed(0)}`;
};

const Chip = ({ model, size }: { model: ModelData; size: "sm" | "lg" }) => {
  const isLg = size === "lg";
  return (
    <span
      className={`inline-flex items-center gap-2 shrink-0 whitespace-nowrap ${
        isLg ? "text-[13px] px-1" : "text-[11px]"
      }`}
    >
      <span className="text-white font-semibold">{model.name}</span>
      <span className="text-white/45">
        in {formatPrice(model.inputPricePerMillion)}/M · out{" "}
        {formatPrice(model.outputPricePerMillion)}/M
        {model.tokensPerSecond != null && (
          <> · ~{Math.round(model.tokensPerSecond)} tok/s</>
        )}
        {isLg && model.timeToFirstToken != null && (
          <> · ttft {model.timeToFirstToken.toFixed(1)}s</>
        )}
      </span>
    </span>
  );
};

// Continuous marquee ticker. No horizontal scrollbar — the track
// translates 0 → -50% in a loop, and we render the list twice so the
// wrap is seamless. Pauses on hover. Disables animation under
// `prefers-reduced-motion`.
export const PriceTicker = ({ size = "sm", tone = "dark" }: PriceTickerProps) => {
  const { models } = useModelData();

  if (!models.length) return null;

  const isLg = size === "lg";
  const surface =
    tone === "light"
      ? "border-border bg-muted/40"
      : "border-white/10 bg-white/5";

  return (
    <div
      className={`group rounded-xl border overflow-hidden ${surface} ${
        isLg ? "py-3" : "py-2"
      }`}
      aria-label="Live model pricing ticker"
    >
      <div className="flex items-center gap-4 px-4">
        <span className="font-bold text-mint uppercase tracking-[0.22em] text-[10px] shrink-0">
          Live prices
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="ticker-track flex gap-6 whitespace-nowrap">
            {/* Duplicated row for seamless wrap */}
            {[...models, ...models].map((m, i) => (
              <span key={`${m.id}-${i}`} className="flex items-center gap-6">
                <Chip model={m} size={size} />
                <span className="text-white/20">•</span>
              </span>
            ))}
          </div>
        </div>
        <span className="hidden md:inline text-white/30 text-[10px] shrink-0 italic">
          via Artificial Analysis
        </span>
      </div>
    </div>
  );
};
