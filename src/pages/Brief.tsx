import { useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { SEO } from "@/components/SEO";
import { PriceTicker } from "@/components/PriceTicker";
import { NervousDecisionInput } from "@/components/nervous-decision/Input";
import { useBlogPosts } from "@/hooks/useBlogPosts";

export type BriefTag = "WATCH" | "SKIP" | "CALL" | "TAKE";

export type BriefCard = {
  tag: BriefTag;
  timestamp: string;
  headline: string;
  body: string;
  takeLink?: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};

const tagStyles: Record<BriefTag, string> = {
  WATCH: "bg-mint/15 text-mint-dark dark:text-mint border-mint/30",
  SKIP: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
  CALL: "bg-background text-foreground border-mint/50",
  TAKE: "bg-mint/10 text-mint-dark dark:text-mint border-mint/30",
};

const tags: (BriefTag | "ALL")[] = ["ALL", "WATCH", "SKIP", "CALL", "TAKE"];

// Interpretation layer — the plain-English read on the ticker. Matches the
// homepage teaser but fleshed out with supporting context.
const INTERPRETATIONS: { headline: string; body: string }[] = [
  {
    headline: "Haiku 4.5 is the new default for everyday work.",
    body: "Haiku 4.5 runs ~15x cheaper than Opus 4.7 and clears 90% of everyday reasoning tasks. If your summarisation, classification, or routing still defaults to Opus, you're burning a line item for no quality gain. The delta shows up first in the bill, then in latency.",
  },
  {
    headline: "Gemini 2.5 Pro owns high-volume extraction.",
    body: "At $1.25/M input, Gemini 2.5 Pro is the only frontier model under $2/M. For high-volume classification, document extraction, and retrieval-heavy pipelines, it's the default choice. Not Claude, not GPT-5. Multi-model stacks are the norm in production, not the exception.",
  },
  {
    headline: "Frontier cost collapsed ~70% in 12 months.",
    body: "The price-to-quality frontier has shifted so fast that any cost model older than 30 days is probably wrong. If your AI budget is a fixed line item set last year, you're under-using it, not over-using it. The smart move is to expand scope, not hold the line.",
  },
];

const sampleArchive: BriefCard[] = [
  {
    tag: "WATCH",
    timestamp: "2d ago",
    headline: "Anthropic ships agent-native browser, not a plugin.",
    body: "The browser as operating surface is now a serious product category. Orchestration buyers should rethink desktop-vs-cloud roadmaps.",
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
  {
    tag: "WATCH",
    timestamp: "1w ago",
    headline: "Haiku 4.5 is cheaper than GPT-5 Mini and stronger on reasoning.",
    body: "Price-to-quality frontier shifted. Any LLM cost model older than 30 days is probably wrong.",
  },
  {
    tag: "TAKE",
    timestamp: "1w ago",
    headline: "Stop hiring a Head of AI. Hire a builder with taste.",
    body: "The best AI leaders right now are operators who ship. Titles follow outcomes, not the other way round.",
    takeLink: "/blog",
  },
  {
    tag: "CALL",
    timestamp: "2w ago",
    headline: "Approve your first agent-writes-production-code policy.",
    body: "Get ahead of shadow usage. A one-page policy on scope, review, and audit is cheaper than the first incident.",
  },
  {
    tag: "SKIP",
    timestamp: "2w ago",
    headline: "'AI will replace 50% of knowledge work by 2027' is back.",
    body: "The specific number changes. The claim is unfalsifiable. Don't staff plans against headline math.",
  },
  {
    tag: "WATCH",
    timestamp: "3w ago",
    headline: "Procurement teams are writing model-ban lists. Fast.",
    body: "If your team's tool choices haven't been approved centrally, assume a 90-day clock before they get blocked.",
  },
];

const EXAMPLES = [
  "Should we build our own AI tools or use ChatGPT Teams?",
  "Is it worth fine-tuning our own model?",
  "Do we need an AI strategy or are we procrastinating?",
];

export default function Brief() {
  const [filter, setFilter] = useState<BriefTag | "ALL">("ALL");
  const [query, setQuery] = useState("");
  const { data: blogPosts } = useBlogPosts();

  const filtered = useMemo(() => {
    return sampleArchive.filter((c) => {
      if (filter !== "ALL" && c.tag !== filter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          c.headline.toLowerCase().includes(q) ||
          c.body.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [filter, query]);

  const featuredPosts = useMemo(() => (blogPosts || []).slice(0, 6), [blogPosts]);

  const lastUpdated = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Live Intel"
        description="Live model prices, weekly classified reads (WATCH / SKIP / CALL / TAKE), and a nervous-decision machine for leaders making AI calls."
        canonical="/signal"
      />
      <Navigation />

      {/* Page header */}
      <section className="pt-32 pb-10 bg-ink text-white">
        <div className="container-width max-w-5xl">
          <motion.div initial="hidden" animate="show" variants={fadeUp} className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-white">
              Live Intel
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto">
              Every model price, every signal, every decision worth making this week.
            </p>
            <p className="mt-3 text-xs text-white/30 uppercase tracking-wider font-mono">
              Updated {lastUpdated}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Extended ticker */}
      <section className="bg-ink">
        <div className="container-width max-w-6xl pb-10">
          <PriceTicker size="lg" tone="dark" />
        </div>
      </section>

      {/* Interpretation grid */}
      <section className="section-padding bg-ink text-white border-t border-white/10">
        <div className="container-width max-w-5xl">
          <div className="mb-8">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-mint/80 mb-3">
              What this actually means
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Read the prices in plain English.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {INTERPRETATIONS.map((insight, i) => (
              <motion.article
                key={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                custom={i}
                variants={fadeUp}
                className="rounded-xl p-6 bg-white/5 border border-white/10"
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-mint mb-3">
                  Insight 0{i + 1}
                </div>
                <h3 className="font-bold text-base text-white leading-snug mb-3">
                  {insight.headline}
                </h3>
                <p className="text-[13px] text-white/60 leading-relaxed">
                  {insight.body}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Classified cards grid */}
      <section className="section-padding bg-background">
        <div className="container-width max-w-5xl">
          <div className="mb-8">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-mint-dark dark:text-mint mb-3">
              What I'm watching this week
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
              Watch. Skip. Call. Take.
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Classified by whether it's worth your time, and the calls you should be making.
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.14em] border transition-all ${
                    filter === t
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-muted-foreground border-border hover:border-mint/50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="relative md:ml-auto md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search live intel"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-mint/40"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">
              No cards match that filter yet.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((card, i) => (
                <motion.article
                  key={i}
                  className="editorial-card glass-card p-6 flex flex-col h-full border border-border/50 hover:border-mint/40 transition-colors"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.14em] border ${tagStyles[card.tag]}`}
                    >
                      {card.tag === "TAKE" && (
                        <span className="w-4 h-4 rounded-full bg-mint text-ink text-[9px] font-black flex items-center justify-center">
                          K
                        </span>
                      )}
                      {card.tag}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-medium">
                      {card.timestamp}
                    </span>
                  </div>
                  <h3 className="font-bold text-base mb-2 leading-snug">{card.headline}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {card.body}
                  </p>
                  {card.takeLink && (
                    <a
                      href={card.takeLink}
                      className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-mint-dark dark:text-mint hover:underline"
                    >
                      Read the take <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Blog column */}
      {featuredPosts.length > 0 && (
        <section className="section-padding bg-muted/30">
          <div className="container-width max-w-5xl">
            <div className="mb-8">
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-mint-dark dark:text-mint mb-3">
                What I'm writing
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Longer reads.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredPosts.map((post) => (
                <a
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group rounded-xl p-6 bg-background border border-border hover:border-mint/40 transition-colors flex flex-col h-full"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-mint-dark dark:text-mint">
                      Essay
                    </span>
                    {post.readingTime && (
                      <span className="text-[10px] text-muted-foreground">
                        {post.readingTime} min read
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-base leading-snug mb-2 group-hover:text-mint-dark dark:group-hover:text-mint transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                </a>
              ))}
            </div>
            <div className="mt-8 text-center">
              <a
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-mint-dark dark:text-mint hover:underline"
              >
                All essays <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Full nervous-decision input */}
      <section className="section-padding bg-ink text-white border-t border-white/10">
        <div className="container-width max-w-3xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 text-white">
              The Nervous Decision Machine
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              The AI call you keep putting off? Paste it. 60 seconds, one 3-card artifact. No email required.
            </p>
          </div>
          <NervousDecisionInput size="full" tone="dark" examples={EXAMPLES} />
        </div>
      </section>

      {/* Footer nav */}
      <section className="py-10 bg-background border-t border-border">
        <div className="container-width max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground transition-colors">
            &larr; Back to home
          </a>
          <a href="/blog" className="hover:text-foreground transition-colors">
            All blog posts &rarr;
          </a>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:text-foreground transition-colors"
          >
            Back to top &uarr;
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
