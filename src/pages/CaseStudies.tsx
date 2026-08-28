import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { clientStories } from "@/data/rebuildProof";
import "@/styles/mindmake.css";

const resultTitles: Record<string, string> = {
  "expensive-decision": "One day stopped a year of the wrong build.",
  "sellable-expertise": "Expertise became an offer people could buy.",
  "simple-product": "Two pilots signed during the work.",
  "hand-back": "The business was rebuilt and left in the founder's hands.",
  "own-system": "Publishing moved from monthly to most days.",
  "team-decides": "Fourteen vendors became three decisions.",
  "business-first": "Eleven tools stopped. One useful system went live.",
  "market-moves": "A new sales path led to a paid publisher test.",
};

export default function CaseStudies() {
  const [briefOpen, setBriefOpen] = useState(false);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Mindmake customer outcomes",
    itemListElement: clientStories.map((story, index) => ({ "@type": "ListItem", position: index + 1, name: resultTitles[story.id] })),
  };

  return (
    <MindmakeShell onStart={() => setBriefOpen(true)}>
      <SEO title="Customer outcomes" description="Eight verified stories about the work Mindmake helped customers change and what happened next." canonical="/case-studies" jsonLd={jsonLd} />
      <section className="mm-results-hero" aria-labelledby="stories-title">
        <div className="mm-container">
          <h1 id="stories-title">The decision and what changed next.</h1>
          <p>Eight verified stories. The customers stay anonymous. The work and results do not.</p>
        </div>
      </section>
      <section className="mm-section mm-story-archive" aria-label="Customer outcome stories">
        <div className="mm-container mm-story-archive-grid">
          {clientStories.map((story) => (
            <article key={story.id}>
              <h2>{resultTitles[story.id]}</h2>
              <p>{story.outcome}</p>
              <blockquote>“{story.quote}”<cite>{story.attribution}</cite></blockquote>
            </article>
          ))}
        </div>
      </section>
      <section className="mm-final" aria-labelledby="stories-final-title">
        <div className="mm-container mm-final-grid">
          <div><h2 id="stories-final-title">Find the result worth proving.</h2><p>Start with the company website. Mindmake will do the reading before it asks you to explain the problem.</p><button className="mm-button" type="button" onClick={() => setBriefOpen(true)}>Start here <ArrowRight aria-hidden="true" /></button></div>
        </div>
      </section>
      <LeadBrief open={briefOpen} onClose={() => setBriefOpen(false)} />
    </MindmakeShell>
  );
}
