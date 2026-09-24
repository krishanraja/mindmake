import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { answers } from "@/lib/answers";
import { answerPath } from "@/lib/answerFormat";
import "@/styles/mindmake.css";

/**
 * The index of the answer surface.
 *
 * Deliberately not the blog. `/blog` is a human editorial archive with
 * categories, reading times and a featured post, chosen and written as a body
 * of work. This is one page per question, each of them machine-first: the
 * direct answer at the top, the argument underneath, and the question it
 * answers printed beside the title so a reader and a retriever agree on what
 * the page is for. Mixing the two would dilute the archive and misrepresent
 * both, so they share the design system and nothing else.
 */
const TITLE = "Questions leaders are asking about AI";
const DESCRIPTION = "One page per question: the direct answer first, then the case for it, including what the pages already answering that question miss.";

const written = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default function Answers() {
  const [briefOpen, setBriefOpen] = useState(false);

  return (
    <MindmakeShell onStart={() => setBriefOpen(true)}>
      <SEO
        title={TITLE}
        description={DESCRIPTION}
        canonical="/answers"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: TITLE,
          description: DESCRIPTION,
          url: "https://mindmake.co/answers",
          publisher: { "@type": "Organization", name: "Mindmake", url: "https://mindmake.co" },
          mainEntity: {
            "@type": "ItemList",
            itemListElement: answers.map((answer, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: answer.targetQuery,
              url: `https://mindmake.co${answerPath(answer.slug)}`,
            })),
          },
        }}
      />

      <section className="mm-answer-index" aria-labelledby="answer-index-title">
        <div className="mm-container">
          <div className="mm-answer-index-hero">
            <h1 id="answer-index-title">Questions leaders are asking about AI.</h1>
            <p>Each page answers one question in full at the top, then argues the case underneath. They are written to be quoted, by people and by the machines people ask.</p>
          </div>

          <div className="mm-answer-index-entries">
            {answers.map((answer) => (
              <Link key={answer.slug} className="mm-answer-entry" to={answerPath(answer.slug)}>
                <article>
                  <h2>{answer.title}</h2>
                  <p>{answer.targetQuery}</p>
                  <footer>
                    <span>{written(answer.publishedAt)}</span>
                    <strong>Read the answer <ArrowRight aria-hidden="true" /></strong>
                  </footer>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <LeadBrief open={briefOpen} onClose={() => setBriefOpen(false)} />
    </MindmakeShell>
  );
}
