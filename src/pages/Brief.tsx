import { useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { SEO } from "@/components/SEO";

// Taxonomy renamed from the previous SIGNAL / NOISE / DECISION / TAKE to
// WATCH / SKIP / CALL / TAKE to avoid overlap with Krish's other business
// (Signal & Noise).
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
    headline: "Haiku 4.5 is cheaper than gpt-4o-mini and better on reasoning.",
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

export default function Brief() {
  const [filter, setFilter] = useState<BriefTag | "ALL">("ALL");
  const [query, setQuery] = useState("");

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

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="The Operator's Brief"
        description="What's worth watching, what to skip, what to call, and what I make of it. Classified reads for leaders making AI decisions."
        canonical="/signal"
      />
      <Navigation />

      <section className="section-padding pt-32">
        <div className="container-width max-w-5xl">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-mint-dark dark:text-mint mb-4">
              The Operator's Brief
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              Watch. Skip. Call. Take.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              What I'm tracking this week. Classified by whether it's worth your time, and the calls you should be making.
            </p>
          </motion.div>

          {/* Filters */}
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
                placeholder="Search the brief"
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

      <Footer />
    </main>
  );
}
