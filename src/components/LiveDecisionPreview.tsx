import { useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useModelData } from "@/hooks/useModelData";
import { FileText, ExternalLink, TrendingUp } from "lucide-react";

/**
 * LiveDecisionPreview
 *
 * Shows a sample "decision memo" with live model pricing/benchmark data
 * from Artificial Analysis. Demonstrates the kind of data-driven artifact
 * leaders receive in a sprint.
 */
const LiveDecisionPreview = () => {
  const { models } = useModelData();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // Pick 3 representative models for the decision memo
  const { optionA, optionB, optionC, analysis } = useMemo(() => {
    // Sort by quality for top pick
    const byQuality = [...models]
      .filter((m) => m.benchmarkScore !== null && m.inputPricePerMillion !== null)
      .sort((a, b) => (b.benchmarkScore ?? 0) - (a.benchmarkScore ?? 0));

    // Premium (top quality)
    const a = byQuality[0];
    // Value pick (good quality, lower cost)
    const midRange = byQuality
      .slice(1)
      .sort((x, y) => (x.inputPricePerMillion ?? 100) - (y.inputPricePerMillion ?? 100));
    const b = midRange[0];
    // Budget pick (cheapest)
    const cheapest = [...models]
      .filter((m) => m.inputPricePerMillion !== null && m.inputPricePerMillion > 0)
      .sort((x, y) => (x.inputPricePerMillion ?? 100) - (y.inputPricePerMillion ?? 100));
    const c = cheapest[0];

    if (!a || !b || !c) {
      return { optionA: null, optionB: null, optionC: null, analysis: "" };
    }

    // Build analysis text
    const qualityGap = a.benchmarkScore && b.benchmarkScore
      ? Math.round(((a.benchmarkScore - b.benchmarkScore) / b.benchmarkScore) * 100)
      : 0;
    const costMultiple = a.inputPricePerMillion && b.inputPricePerMillion
      ? Math.round((a.inputPricePerMillion / b.inputPricePerMillion) * 10) / 10
      : 0;

    // Estimate monthly cost at 100K docs (~500 tokens avg each = 50M tokens/month)
    const monthlyTokensM = 50; // 50 million tokens
    const costA = a.inputPricePerMillion ? Math.round(a.inputPricePerMillion * monthlyTokensM) : 0;
    const costB = b.inputPricePerMillion ? Math.round(b.inputPricePerMillion * monthlyTokensM) : 0;

    const analysisText =
      `${a.name} scores ${qualityGap}% higher than ${b.name} but costs ${costMultiple}x more. ` +
      `At 100K documents/month (~50M tokens), the cost difference is $${Math.abs(costA - costB).toLocaleString()}/month. ` +
      `For most mid-market companies, ${b.name} offers the best quality-to-cost ratio.`;

    return { optionA: a, optionB: b, optionC: c, analysis: analysisText };
  }, [models]);

  if (!optionA || !optionB || !optionC) return null;

  return (
    <div ref={ref} className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-mint-dark dark:text-mint" />
        <h2 className="text-3xl font-bold">Live Decision Artifact</h2>
      </div>
      <p className="text-lg text-muted-foreground mb-6">
        This is a real decision memo built with live market data. The kind of
        artifact you walk away with after a sprint.
      </p>

      {/* The Decision Memo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-ink/80 border border-border rounded-xl shadow-lg overflow-hidden"
      >
        {/* Memo Header */}
        <div className="bg-ink dark:bg-ink/60 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">Decision Memo</h3>
            <p className="text-white/70 text-sm">
              Which LLM for Document Processing?
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs bg-mint/20 text-mint px-3 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            Live data
          </div>
        </div>

        {/* Memo Body */}
        <div className="p-6 space-y-6">
          {/* Options Table */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Options Evaluated
            </h4>
            <div className="space-y-2">
              {[
                { label: "Option A (Premium)", model: optionA },
                { label: "Option B (Value)", model: optionB },
                { label: "Option C (Budget)", model: optionC },
              ].map(({ label, model }, i) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg ${
                    i === 1
                      ? "bg-mint/10 border border-mint/30"
                      : "bg-ink/5 dark:bg-white/5"
                  }`}
                >
                  <div className="mb-1 sm:mb-0">
                    <span className="text-xs text-muted-foreground">
                      {label}
                    </span>
                    <div className="font-semibold text-sm text-foreground">
                      {model.name}{" "}
                      <span className="text-muted-foreground font-normal">
                        ({model.creator})
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>
                      Quality:{" "}
                      <strong className="text-foreground">
                        {model.benchmarkScore ?? "—"}
                      </strong>
                    </span>
                    <span>
                      Input:{" "}
                      <strong className="text-foreground">
                        ${model.inputPricePerMillion}/M
                      </strong>
                    </span>
                    <span>
                      Speed:{" "}
                      <strong className="text-foreground">
                        {model.tokensPerSecond ?? "—"} t/s
                      </strong>
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Analysis */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.7 }}
          >
            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Analysis
            </h4>
            <p className="text-sm text-foreground leading-relaxed">
              {analysis}
            </p>
          </motion.div>

          {/* Recommendation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.9 }}
            className="p-4 rounded-lg border-l-4 border-mint bg-mint/5"
          >
            <h4 className="text-sm font-bold uppercase tracking-wider text-mint-dark dark:text-mint mb-1">
              Recommendation
            </h4>
            <p className="text-sm text-foreground">
              Go with <strong>{optionB.name}</strong> for production. Use{" "}
              <strong>{optionC.name}</strong> for high-volume, low-complexity
              tasks. Reserve <strong>{optionA.name}</strong> for edge cases
              requiring maximum accuracy.
            </p>
          </motion.div>
        </div>

        {/* Memo Footer */}
        <div className="px-6 py-3 bg-ink/5 dark:bg-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            This is one artifact from a typical 4-Week Sprint. Imagine what a
            full sprint produces.
          </span>
          <a
            href="https://artificialanalysis.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            Market data by Artificial Analysis
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default LiveDecisionPreview;
