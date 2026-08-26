import { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { SEO } from "@/components/SEO";
import { faqItems } from "@/components/FAQAccordion";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import "@/styles/mindmake.css";

export default function Questions() {
  const [briefOpen, setBriefOpen] = useState(false);

  return (
    <MindmakeShell onStart={() => setBriefOpen(true)} darkHeader={false}>
      <SEO
        title="Useful answers"
        description="Clear answers about Mindmake, who it helps, what the work produces and how to begin."
        canonical="/faq"
      />
      <section className="mm-answers-page" aria-labelledby="answers-title">
        <div className="mm-container">
          <div className="mm-answers-hero">
            <div>
              <h1 id="answers-title">Know what happens before you share.</h1>
            </div>
            <p>
              These are the practical questions: who the work is for, what the first month
              proves and what stays with you afterwards.
            </p>
          </div>

          <div className="mm-answers-list">
            {faqItems.map((item, index) => (
              <details key={item.question} open={index === 0}>
                <summary>
                  <strong>{item.question}</strong>
                  <ChevronDown aria-hidden="true" />
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>

          <aside className="mm-answers-next" aria-labelledby="answers-next-title">
            <div>
              <h2 id="answers-next-title">See what a useful first month could prove.</h2>
            </div>
            <div>
              <p>
                Mindmake reads the company first and gives you a starting point before asking
                for your email.
              </p>
              <button className="mm-button" type="button" onClick={() => setBriefOpen(true)}>
                Start here <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </aside>
        </div>
      </section>
      <LeadBrief open={briefOpen} onClose={() => setBriefOpen(false)} />
    </MindmakeShell>
  );
}
