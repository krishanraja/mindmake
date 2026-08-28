import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import "@/styles/mindmake.css";
import { CONTACT_EMAIL } from "@/lib/publicLinks";

const continuity = [
  {
    title: "Keep the useful parts working.",
    body: "Return to the systems, records and choices made during the work. Fix what has changed without starting again.",
  },
  {
    title: "Make the next call with context.",
    body: "Use the facts, examples and standards already gathered. Add the new evidence, then make the next decision.",
  },
  {
    title: "Ask for help when it is worth it.",
    body: "We can step back in for a new question or a wider build. The earlier work remains yours either way.",
  },
] as const;

export default function Alumni() {
  const [briefOpen, setBriefOpen] = useState(false);

  return (
    <MindmakeShell onStart={() => setBriefOpen(true)} darkHeader={false}>
      <SEO
        title="Past clients"
        description="Information for people who have finished work with Mindmake."
        canonical="/alumni"
        ogType="website"
        noindex
      />
      <article className="mm-legal-page">
        <header className="mm-container mm-legal-hero">
          <h1>Keep the work useful.</h1>
          <p>This unlisted page is for people who have already completed Mindmake work. It keeps the next step tied to what you built, learned and still use.</p>
        </header>

        <div className="mm-container mm-legal-sections">
          {continuity.map((item) => (
            <section key={item.title}>
              <h2>{item.title}</h2>
              <div><p>{item.body}</p></div>
            </section>
          ))}
          <section>
            <h2>Already worked together?</h2>
            <div>
              <p>Send us the decision or system you want to revisit. A short note is enough because the earlier context should already exist.</p>
              <p><a href={`mailto:${CONTACT_EMAIL}?subject=Mindmake%20alumni%20request`}>Email us about the next step <ArrowRight aria-hidden="true" /></a></p>
            </div>
          </section>
        </div>
      </article>
      <LeadBrief open={briefOpen} onClose={() => setBriefOpen(false)} />
    </MindmakeShell>
  );
}
