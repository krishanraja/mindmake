import { useState } from "react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { track } from "@/lib/analytics";
import corpus from "@/content/answers.json";
import "@/styles/mindmake.css";

/** The same curated corpus the ask bar answers from, laid out in full. */
const answers = corpus.entries as Array<{ id: string; question: string; answer: string }>;

export default function Questions() {
  const [briefOpen, setBriefOpen] = useState(false);

  return (
    <MindmakeShell onStart={() => setBriefOpen(true)}>
      <SEO
        title="Straight answers"
        description="Straight answers about Mindmake: what the work builds, what it costs, whether anyone needs to know, what happens to your data and what you keep."
        canonical="/faq"
      />
      <section className="mm-answers-page" aria-labelledby="answers-title">
        <div className="mm-container">
          <div className="mm-answers-hero">
            <h1 id="answers-title">Straight answers.</h1>
            <p>The questions leaders ask before they start, answered the way we would answer them on a call.</p>
          </div>

          <div className="mm-answers-list">
            {answers.map((item) => (
              <section key={item.id}>
                <h2>{item.question}</h2>
                <p>{item.answer}</p>
              </section>
            ))}
          </div>

          <aside className="mm-answers-next" aria-labelledby="answers-next-title">
            <h2 id="answers-next-title">Ready to see it on your business?</h2>
            <button
              className="mm-button"
              type="button"
              onClick={() => {
                track("scoping_request", { source: "faq" });
                setBriefOpen(true);
              }}
            >
              Start here <span aria-hidden="true">→</span>
            </button>
          </aside>
        </div>
      </section>
      <LeadBrief open={briefOpen} onClose={() => setBriefOpen(false)} />
    </MindmakeShell>
  );
}
