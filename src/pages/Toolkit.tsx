import { useState } from "react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { LeadCard } from "@/components/ui/lead-exit";
import "@/styles/mindmake.css";
import "@/styles/toolkit.css";

/* Your 2-minute AI upgrade toolkit (Krish, 2026-11-19): the two ways in, and nothing else.
   The blog keeps its page for search engines and AI crawlers, with no link from the menus. */
const TITLE = "Your 2-minute AI upgrade toolkit";
const DESCRIPTION = "Measure your AI judgement for free, or add a brain module that checks your next decision before you make it.";

const Toolkit = () => {
  const [briefOpen, setBriefOpen] = useState(false);
  return (
    <MindmakeShell onStart={() => setBriefOpen(true)}>
      <SEO title={TITLE} description={DESCRIPTION} canonical="/2-minute-ai-upgrade-toolkit" />
      <section className="mm-toolkit mm-container" aria-labelledby="toolkit-title">
        <h1 id="toolkit-title">Your 2-minute AI upgrade toolkit.</h1>
        <div className="lx-cards mm-toolkit-cards">
          <LeadCard offer="audit" />
          <LeadCard offer="modules" />
        </div>
      </section>
      <LeadBrief open={briefOpen} onClose={() => setBriefOpen(false)} />
    </MindmakeShell>
  );
};

export default Toolkit;
