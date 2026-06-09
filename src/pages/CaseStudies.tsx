import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CaseStudyCard from "@/components/proof/CaseStudyCard";
import {
  caseStudies,
  endorsements,
  ENGAGEMENT_META,
  RESULTS_BAND,
  type Engagement,
} from "@/data/caseStudies";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: "easeOut" },
  }),
};

type Filter = Engagement | "All";
const FILTERS: Filter[] = ["All", "Cohort", "Signal Session", "Revenue Architecture"];

// Map the ?engagement= deep-link slug to a filter value.
const SLUG_TO_FILTER: Record<string, Filter> = {
  cohort: "Cohort",
  "signal-session": "Signal Session",
  "revenue-architecture": "Revenue Architecture",
  all: "All",
};

const openScoping = () =>
  window.dispatchEvent(
    new CustomEvent("openScopingModal", { detail: { source_page: "/case-studies" } })
  );

const CaseStudies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");

  // Honour ?engagement= on mount / when it changes externally.
  useEffect(() => {
    const slug = searchParams.get("engagement")?.toLowerCase();
    if (slug && SLUG_TO_FILTER[slug]) setFilter(SLUG_TO_FILTER[slug]);
  }, [searchParams]);

  const selectFilter = (f: Filter) => {
    setFilter(f);
    const next = new URLSearchParams(searchParams);
    if (f === "All") next.delete("engagement");
    else next.set("engagement", f.toLowerCase().replace(/\s+/g, "-"));
    setSearchParams(next, { replace: true });
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: caseStudies.length };
    for (const cs of caseStudies) c[cs.engagement] = (c[cs.engagement] ?? 0) + 1;
    return c;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return caseStudies.filter((cs) => {
      if (filter !== "All" && cs.engagement !== filter) return false;
      if (!q) return true;
      return (
        cs.headline.toLowerCase().includes(q) ||
        cs.sector.toLowerCase().includes(q) ||
        cs.clientLabel.toLowerCase().includes(q) ||
        (cs.situation ?? "").toLowerCase().includes(q) ||
        (cs.theWork ?? "").toLowerCase().includes(q) ||
        (cs.quote?.text ?? "").toLowerCase().includes(q)
      );
    });
  }, [filter, query]);

  const activeOffer = filter !== "All" ? ENGAGEMENT_META[filter] : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Mindmaker case studies",
    itemListElement: caseStudies
      .filter((cs) => cs.variant === "case")
      .map((cs, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: cs.headline,
      })),
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Case studies"
        description="Anonymized proof from real engagements — repositionings, rebuilds and nervous AI decisions resolved. Filter by how you'd work with Krish: the Cohort, a Signal Session, or a Revenue Architecture."
        canonical="/case-studies"
        jsonLd={jsonLd}
      />
      <Navigation />

      {/* Hero */}
      <section className="section-padding pt-32 md:pt-40 bg-muted">
        <div className="container-width max-w-5xl">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-mint-dark dark:text-mint mb-4">
              Proof, not promises
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              The work, and what it moved.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Real engagements, anonymized. Stalled commercial assets repositioned, founder-led
              businesses rebuilt, and nervous AI decisions resolved in days. Filter by how you'd
              actually work with me.
            </p>
          </motion.div>

          {/* Results band */}
          <motion.div
            className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-6 border-t border-border/50 pt-8"
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={1}
          >
            {RESULTS_BAND.map((m) => (
              <div key={m.label}>
                <div className="text-2xl md:text-3xl font-bold text-ink dark:text-mint leading-none">
                  {m.value}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1.5 leading-snug">{m.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Filterable grid */}
      <section className="section-padding bg-background">
        <div className="container-width max-w-6xl">
          {/* Filter row */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => selectFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.14em] border transition-all ${
                    filter === f
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-muted-foreground border-border hover:border-mint/50"
                  }`}
                >
                  {f}
                  {counts[f] != null && (
                    <span className="ml-1.5 opacity-60">{counts[f]}</span>
                  )}
                </button>
              ))}
            </div>
            <div className="relative md:ml-auto md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search the work"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-mint/40"
              />
            </div>
          </div>

          {/* Contextual offer strip */}
          {activeOffer && (
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 rounded-2xl border border-mint/30 bg-mint/5 px-5 py-4"
            >
              <div className="flex-1">
                <div className="text-sm font-bold text-foreground">
                  {activeOffer.label} · {activeOffer.price}
                </div>
                <div className="text-sm text-muted-foreground">{activeOffer.blurb}</div>
              </div>
              <a
                href={activeOffer.href}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors whitespace-nowrap"
              >
                {activeOffer.cta} <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          )}

          {/* Grid */}
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">No cases match that search yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
              {filtered.map((cs, i) => (
                <motion.div
                  key={cs.id}
                  className="h-full"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  custom={i}
                  variants={fadeUp}
                >
                  <CaseStudyCard caseStudy={cs} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Endorsements strip */}
      <section className="section-padding bg-muted border-t border-border/50">
        <div className="container-width max-w-6xl">
          <div className="mb-8">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-mint-dark dark:text-mint mb-3">
              From the people who've worked with me
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              What senior leaders say.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {endorsements.map((e, i) => (
              <motion.blockquote
                key={i}
                className="rounded-2xl border border-border/50 bg-background p-5 flex flex-col"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                custom={i}
                variants={fadeUp}
              >
                <p className="text-sm leading-relaxed text-foreground/90">&ldquo;{e.quote}&rdquo;</p>
                <footer className="mt-3 pt-3 border-t border-border/30 text-[11px] font-semibold text-muted-foreground">
                  {e.attribution}
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-background">
        <div className="container-width max-w-3xl text-center">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
            Want the next case study to be yours?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Tell me the decision you're stuck on. I'll tell you which of these it looks like and
            how I'd run it.
          </p>
          <button
            onClick={openScoping}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-semibold hover:bg-foreground/90 transition-colors"
          >
            Book a call <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CaseStudies;
