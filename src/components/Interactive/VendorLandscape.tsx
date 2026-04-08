import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useModelData, type ModelData } from "@/hooks/useModelData";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, DollarSign, Brain, ExternalLink, Loader2 } from "lucide-react";

// ============================================================
// USE CASE DEFINITIONS
// ============================================================

interface UseCaseConfig {
  label: string;
  weights: { quality: number; cost: number; speed: number };
  take: string; // Krish's opinionated take
}

const useCases: Record<string, UseCaseConfig> = {
  "Customer Support": {
    label: "Customer Support",
    weights: { quality: 0.2, cost: 0.5, speed: 0.3 },
    take: "For customer support, speed and cost matter more than benchmark scores. You're handling volume — most leaders overspend on quality they don't need. Pick the fastest model that's 'good enough' and save the premium for strategic work.",
  },
  "Document Analysis": {
    label: "Document Analysis",
    weights: { quality: 0.5, cost: 0.3, speed: 0.2 },
    take: "Document analysis lives or dies on accuracy. A cheaper model that hallucinates once costs you more than the premium model that gets it right. But test with YOUR documents — benchmarks don't capture domain-specific performance.",
  },
  "Code Generation": {
    label: "Code Generation",
    weights: { quality: 0.6, cost: 0.2, speed: 0.2 },
    take: "Code quality dominates everything here. A wrong answer costs developer hours. The quality gap between top-tier and mid-tier models is real for code — this is one of the few use cases where the premium is justified.",
  },
  "Content Creation": {
    label: "Content Creation",
    weights: { quality: 0.5, cost: 0.3, speed: 0.2 },
    take: "For content, quality matters — but 'quality' means voice and nuance, not benchmark scores. A mid-range model with great prompting often beats a premium model with lazy prompts. Invest in prompt engineering first.",
  },
  "Data Analysis": {
    label: "Data Analysis",
    weights: { quality: 0.4, cost: 0.3, speed: 0.3 },
    take: "Data analysis needs a balance of all three. You need accuracy for the numbers, speed for iteration, and cost control because you'll run a lot of queries. The mid-tier sweet spot is real here.",
  },
  "General Purpose": {
    label: "General Purpose",
    weights: { quality: 0.4, cost: 0.3, speed: 0.3 },
    take: "If you're not sure what you need, start here. The models in the middle of this list are where most businesses should live — good enough quality, reasonable cost, fast enough. Save the premium models for specific high-stakes tasks.",
  },
};

const useCaseKeys = Object.keys(useCases);

// ============================================================
// SCORING
// ============================================================

function scoreModel(
  model: ModelData,
  weights: { quality: number; cost: number; speed: number },
  allModels: ModelData[]
): number {
  // Normalize each dimension 0-1 across all models
  const qualityScores = allModels.map((m) => m.benchmarkScore ?? 0);
  const maxQuality = Math.max(...qualityScores);
  const minQuality = Math.min(...qualityScores);
  const qualityRange = maxQuality - minQuality || 1;
  const qualityNorm = ((model.benchmarkScore ?? 0) - minQuality) / qualityRange;

  // Cost: lower is better, so invert
  const costs = allModels.map((m) => m.inputPricePerMillion ?? 100);
  const maxCost = Math.max(...costs);
  const minCost = Math.min(...costs);
  const costRange = maxCost - minCost || 1;
  const costNorm = 1 - ((model.inputPricePerMillion ?? maxCost) - minCost) / costRange;

  const speeds = allModels.map((m) => m.tokensPerSecond ?? 0);
  const maxSpeed = Math.max(...speeds);
  const minSpeed = Math.min(...speeds);
  const speedRange = maxSpeed - minSpeed || 1;
  const speedNorm = ((model.tokensPerSecond ?? 0) - minSpeed) / speedRange;

  return (
    weights.quality * qualityNorm +
    weights.cost * costNorm +
    weights.speed * speedNorm
  );
}

// ============================================================
// COMPONENT
// ============================================================

const VendorLandscape = () => {
  const { models, isLoading } = useModelData();
  const [selectedUseCase, setSelectedUseCase] = useState("General Purpose");

  const config = useCases[selectedUseCase];

  const rankedModels = useMemo(() => {
    const scored = models.map((model) => ({
      ...model,
      score: scoreModel(model, config.weights, models),
    }));
    return scored.sort((a, b) => b.score - a.score).slice(0, 7);
  }, [models, config.weights]);

  const maxScore = rankedModels[0]?.score ?? 1;

  const openConsultModal = () => {
    window.dispatchEvent(new CustomEvent("openConsultModal"));
  };

  return (
    <section className="section-padding bg-background">
      <div className="container-width">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Cut Through the Noise
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Live model comparisons ranked for your use case. This is the Mind Set
            in action — filtering signal from noise.
          </p>
        </div>

        {/* Use Case Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {useCaseKeys.map((key) => (
            <button
              key={key}
              onClick={() => setSelectedUseCase(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedUseCase === key
                  ? "bg-mint text-ink"
                  : "bg-ink/5 dark:bg-white/10 text-muted-foreground hover:bg-ink/10 dark:hover:bg-white/20"
              }`}
            >
              {useCases[key].label}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="glass-card p-6 md:p-8 max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Loading market data...
            </div>
          ) : (
            <>
              {/* Table Header - Desktop */}
              <div className="hidden md:grid grid-cols-[1fr_100px_100px_100px_120px] gap-4 mb-4 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <div>Model</div>
                <div className="text-center">
                  <Brain className="w-3.5 h-3.5 inline mr-1" />
                  Quality
                </div>
                <div className="text-center">
                  <DollarSign className="w-3.5 h-3.5 inline mr-1" />
                  Input $/M
                </div>
                <div className="text-center">
                  <Zap className="w-3.5 h-3.5 inline mr-1" />
                  Speed
                </div>
                <div className="text-center">Fit Score</div>
              </div>

              {/* Model Rows */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedUseCase}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  {rankedModels.map((model, i) => (
                    <motion.div
                      key={model.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`rounded-lg p-4 transition-colors ${
                        i === 0
                          ? "bg-mint/10 border border-mint/30"
                          : "bg-ink/5 dark:bg-white/5"
                      }`}
                    >
                      {/* Desktop layout */}
                      <div className="hidden md:grid grid-cols-[1fr_100px_100px_100px_120px] gap-4 items-center">
                        <div>
                          <span className="font-semibold">{model.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {model.creator}
                          </span>
                        </div>
                        <div className="text-center text-sm">
                          {model.benchmarkScore ?? "—"}
                        </div>
                        <div className="text-center text-sm">
                          {model.inputPricePerMillion !== null
                            ? `$${model.inputPricePerMillion}`
                            : "—"}
                        </div>
                        <div className="text-center text-sm">
                          {model.tokensPerSecond !== null
                            ? `${model.tokensPerSecond} t/s`
                            : "—"}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-ink/10 dark:bg-white/10 overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-mint"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(model.score / maxScore) * 100}%`,
                              }}
                              transition={{ delay: i * 0.05 + 0.2, duration: 0.4 }}
                            />
                          </div>
                          <span className="text-xs font-mono w-8 text-right">
                            {Math.round(model.score * 100)}
                          </span>
                        </div>
                      </div>

                      {/* Mobile layout */}
                      <div className="md:hidden space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-sm">
                              {model.name}
                            </span>
                            <span className="text-xs text-muted-foreground ml-1">
                              {model.creator}
                            </span>
                          </div>
                          <span className="text-xs font-mono bg-mint/20 text-mint-dark dark:text-mint px-2 py-0.5 rounded">
                            {Math.round(model.score * 100)}
                          </span>
                        </div>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>
                            <Brain className="w-3 h-3 inline mr-0.5" />
                            {model.benchmarkScore ?? "—"}
                          </span>
                          <span>
                            <DollarSign className="w-3 h-3 inline mr-0.5" />
                            {model.inputPricePerMillion !== null
                              ? `$${model.inputPricePerMillion}/M`
                              : "—"}
                          </span>
                          <span>
                            <Zap className="w-3 h-3 inline mr-0.5" />
                            {model.tokensPerSecond !== null
                              ? `${model.tokensPerSecond} t/s`
                              : "—"}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-ink/10 dark:bg-white/10 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-mint"
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(model.score / maxScore) * 100}%`,
                            }}
                            transition={{ delay: i * 0.05 + 0.2, duration: 0.4 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Krish's Take */}
              <motion.div
                key={`take-${selectedUseCase}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 p-4 rounded-lg border border-mint/20 bg-mint/5"
              >
                <p className="text-sm font-semibold text-mint-dark dark:text-mint mb-1">
                  Krish's Take
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {config.take}
                </p>
              </motion.div>
            </>
          )}

          {/* Attribution + CTA */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <a
              href="https://artificialanalysis.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              Market data by Artificial Analysis
              <ExternalLink className="w-3 h-3" />
            </a>
            <Button
              variant="outline"
              size="sm"
              className="border-mint/40 hover:bg-mint/10 text-sm"
              onClick={openConsultModal}
            >
              Want help making this decision? That's a 4-Week Sprint
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorLandscape;
