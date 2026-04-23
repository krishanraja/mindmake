import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, RotateCcw, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useModelData } from "@/hooks/useModelData";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import {
  NDM_CONFIDENCE_STYLES,
  NDM_MAX_CHARS,
  type NDMArtifact,
} from "@/components/nervous-decision/types";

// Taxonomy: SIGNAL / NOISE renamed to WATCH / SKIP to avoid the "Signal &
// Noise" business overlap. CALL replaces DECISION. TAKE is generic, kept.
type BriefTag = "WATCH" | "SKIP" | "CALL" | "TAKE";

type BriefCard = {
  tag: BriefTag;
  timestamp: string;
  headline: string;
  body: string;
  takeLink?: string;
};

const briefCards: BriefCard[] = [
  {
    tag: "WATCH",
    timestamp: "2d ago",
    headline: "Anthropic ships agent-native browser, not a plugin.",
    body: "The browser as operating surface is now a real product category. Orchestration buyers should rethink desktop-vs-cloud roadmaps.",
  },
  {
    tag: "SKIP",
    timestamp: "3d ago",
    headline: "Another vendor rebrands workflow automation as agentic AI.",
    body: "If your team is being pitched agents without a memory architecture or an eval harness, that isn't agentic. It's Zapier with better branding.",
  },
  {
    tag: "CALL",
    timestamp: "4d ago",
    headline: "Build vs buy on your internal copilot is a 30-day call.",
    body: "OpenAI and Google enterprise tiers now ship what most leaders were scoping a build for. Reopen the build memo before Q3.",
  },
  {
    tag: "TAKE",
    timestamp: "5d ago",
    headline: "The consultant-to-operator gap is widening, fast.",
    body: "AI-native operators are building in weeks what decks used to pitch in months. If your advisors still open with slides, the work isn't the work.",
    takeLink: "/blog",
  },
];

const tagStyles: Record<BriefTag, string> = {
  WATCH: "bg-mint/15 text-mint-dark dark:text-mint border-mint/30",
  SKIP: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
  CALL: "bg-background/60 text-foreground border-mint/60 dark:border-mint/50",
  TAKE: "bg-mint/10 text-mint-dark dark:text-mint border-mint/30",
};

const formatPrice = (n: number | null) =>
  n == null ? "--" : n < 1 ? `$${n.toFixed(2)}` : `$${n.toFixed(0)}`;

const OperatorsBrief = () => {
  const { models } = useModelData();
  const { data: blogPosts } = useBlogPosts();

  const tickerModels = useMemo(() => {
    return (models || []).slice(0, 4);
  }, [models]);

  const featuredPosts = useMemo(() => {
    return (blogPosts || []).slice(0, 2);
  }, [blogPosts]);

  // Nervous Decision Machine state (compact inline variant)
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [artifact, setArtifact] = useState<NDMArtifact | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setError(null);
    setArtifact(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "nervous-decision-machine",
        { body: { decision: input.trim() } }
      );
      if (fnError) throw fnError;
      if (data?.error) {
        setError(data.error);
        return;
      }
      if (data?.card1_real_decision) {
        setArtifact(data as NDMArtifact);
        try {
          (window as unknown as { plausible?: (e: string) => void }).plausible?.(
            "nervous_decision_generated"
          );
        } catch {
          /* analytics optional */
        }
      } else {
        setError("Something came back malformed. Try rephrasing the decision.");
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Couldn't reach the machine. Try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setArtifact(null);
    setInput("");
    setError(null);
  };

  return (
    <section className="relative py-16 sm:py-20 md:py-24 bg-ink text-white">
      <div className="container-width max-w-6xl">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-mint mb-2">
              The Operator's Brief
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              What I'm watching. What I'm writing. What I'd do.
            </h2>
          </div>
          <a
            href="/signal"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-mint transition-colors"
          >
            Full archive <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Live model-pricing ticker strip */}
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 mb-6 overflow-hidden">
          <div className="flex items-center gap-5 text-[11px] font-mono text-white/70 whitespace-nowrap overflow-x-auto scrollbar-hide">
            <span className="font-bold text-mint uppercase tracking-[0.2em] text-[10px] shrink-0">
              Live prices
            </span>
            {tickerModels.map((m) => (
              <span key={m.id} className="inline-flex items-center gap-2 shrink-0">
                <span className="text-white font-semibold">{m.name}</span>
                <span className="text-white/50">
                  in {formatPrice(m.inputPricePerMillion)}/M · out{" "}
                  {formatPrice(m.outputPricePerMillion)}/M
                </span>
              </span>
            ))}
            <span className="text-white/30 shrink-0">
              · via Artificial Analysis
            </span>
          </div>
        </div>

        {/* Two-column middle */}
        <div className="grid lg:grid-cols-5 gap-5 mb-6">
          {/* LEFT: What I'm watching (classified cards) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white/60">
                What I'm watching
              </h3>
              <span className="text-[11px] text-white/40">This week</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {briefCards.map((card, i) => (
                <motion.article
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                  className="rounded-xl p-5 bg-white/5 border border-white/10 hover:border-mint/30 transition-colors flex flex-col"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.14em] border ${tagStyles[card.tag]}`}
                    >
                      {card.tag === "TAKE" && (
                        <span className="w-3.5 h-3.5 rounded-full bg-mint text-ink text-[8px] font-black flex items-center justify-center">
                          K
                        </span>
                      )}
                      {card.tag}
                    </span>
                    <span className="text-[10px] text-white/40">{card.timestamp}</span>
                  </div>
                  <p className="font-bold text-sm leading-snug text-white mb-1.5">
                    {card.headline}
                  </p>
                  <p className="text-[12px] text-white/60 leading-relaxed flex-1">
                    {card.body}
                  </p>
                  {card.takeLink && (
                    <a
                      href={card.takeLink}
                      className="inline-flex items-center gap-1 mt-3 text-[11px] font-semibold text-mint hover:underline"
                    >
                      Read the take <ArrowRight className="w-3 h-3" />
                    </a>
                  )}
                </motion.article>
              ))}
            </div>
          </div>

          {/* RIGHT: What I'm writing / Nervous Decision Artifact when produced */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {artifact ? (
                <motion.div
                  key="artifact"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl p-5 bg-white/5 border border-mint/30 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-mint">
                      Your decision card
                    </span>
                    <button
                      onClick={reset}
                      aria-label="Try another"
                      className="text-[11px] text-white/60 hover:text-mint inline-flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Try another
                    </button>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-mint mb-1">
                      01 {artifact.card1_real_decision.heading}
                    </div>
                    <p className="text-[12px] text-white/80 leading-relaxed">
                      {artifact.card1_real_decision.body}
                    </p>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-mint mb-2">
                      02 {artifact.card2_three_paths.heading}
                    </div>
                    <div className="space-y-2">
                      {artifact.card2_three_paths.paths.map((p, i) => (
                        <div key={i} className="rounded p-2 bg-white/[0.04]">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-[12px] text-white">
                              {p.name}
                            </span>
                            <span
                              className={`text-[9px] font-bold uppercase tracking-[0.12em] px-1.5 py-0.5 rounded-full border ${
                                NDM_CONFIDENCE_STYLES[p.confidence] ||
                                "bg-white/5 text-white/70 border-white/20"
                              }`}
                            >
                              {p.confidence}
                            </span>
                          </div>
                          <p className="text-[11px] text-white/60 mt-1">{p.tradeoff}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-mint mb-2">
                      03 {artifact.card3_next_14_days.heading}
                    </div>
                    <ol className="space-y-1.5">
                      {artifact.card3_next_14_days.actions.map((a, i) => (
                        <li key={i} className="flex gap-2 text-[12px] text-white/80">
                          <span className="shrink-0 w-4 h-4 rounded-full bg-mint text-ink text-[10px] font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <a
                    href="/cohort"
                    className="block text-center text-[12px] font-bold text-ink bg-mint rounded py-2 hover:opacity-90 transition-opacity"
                  >
                    Resolve it in the cohort <ArrowRight className="inline w-3 h-3 ml-1" />
                  </a>
                </motion.div>
              ) : (
                <motion.div
                  key="writing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white/60">
                    What I'm writing
                  </h3>
                  {featuredPosts.length === 0 ? (
                    <div className="rounded-xl p-5 bg-white/5 border border-white/10 text-[12px] text-white/50">
                      New essays land most weeks.
                    </div>
                  ) : (
                    featuredPosts.map((post) => (
                      <a
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="block rounded-xl p-5 bg-white/5 border border-white/10 hover:border-mint/30 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-mint">
                            Essay
                          </span>
                          {post.readingTime && (
                            <span className="text-[10px] text-white/40">
                              {post.readingTime} min read
                            </span>
                          )}
                        </div>
                        <p className="font-bold text-sm text-white leading-snug mb-1">
                          {post.title}
                        </p>
                        <p className="text-[11px] text-white/60 leading-relaxed line-clamp-2">
                          {post.excerpt}
                        </p>
                      </a>
                    ))
                  )}
                  <a
                    href="/blog"
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/60 hover:text-mint"
                  >
                    All essays <ArrowRight className="w-3 h-3" />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Compact Nervous Decision input row */}
        <div className="rounded-xl p-5 bg-white/5 border border-white/10">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-9 h-9 rounded-lg bg-mint/15 flex items-center justify-center">
              <Target className="w-4 h-4 text-mint" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white leading-snug mb-1">
                Got a nervous decision?
              </p>
              <p className="text-[12px] text-white/55 leading-relaxed mb-3">
                Type the AI call you keep putting off. Get a 3-card artifact in 60 seconds. No email required.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <textarea
                  value={input}
                  onChange={(e) =>
                    setInput(e.target.value.slice(0, NDM_MAX_CHARS))
                  }
                  placeholder="e.g., Should we build our own AI tools or use ChatGPT Teams?"
                  rows={2}
                  disabled={loading}
                  className="flex-1 rounded-lg border border-white/15 bg-white/[0.04] p-3 text-[13px] text-white placeholder:text-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-mint/60"
                />
                <Button
                  onClick={generate}
                  disabled={!input.trim() || loading}
                  className="sm:self-stretch bg-gradient-to-r from-mint to-emerald-400 text-ink hover:opacity-90 font-bold whitespace-nowrap"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Thinking
                    </>
                  ) : (
                    <>
                      Generate <ArrowRight className="ml-1.5 w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
              {error && (
                <p className="mt-2 text-[11px] text-red-400">{error}</p>
              )}
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] text-white/30 font-mono">
                  {input.length}/{NDM_MAX_CHARS}
                </span>
                <a
                  href="/tool"
                  className="text-[10px] text-white/40 hover:text-mint"
                >
                  Open in full view →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile archive link (hidden on sm+) */}
        <div className="sm:hidden mt-5 text-center">
          <a
            href="/signal"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-mint transition-colors"
          >
            See the full archive <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default OperatorsBrief;
