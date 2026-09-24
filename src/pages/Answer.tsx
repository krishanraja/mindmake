import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { answerBySlug } from "@/lib/answers";
import { answerJsonLd, answerPath } from "@/lib/answerFormat";
import "@/styles/mindmake.css";

/**
 * One answer page.
 *
 * The running order is the whole design: the direct answer, then the claim,
 * then the argument, then the questions that follow. An assistant fetching
 * this page reads the first chunk and stops, so the answer is the first prose
 * in the markup rather than the payoff at the end of a build-up. A person
 * reading it gets the same deal, which is the version of this that was always
 * worth doing.
 *
 * `src/pages/BlogPost.tsx` is the archive's page and stays untouched. This one
 * shares the design system with it and none of its data, so neither surface
 * can quietly become the other.
 */
export default function Answer() {
  const { slug } = useParams<{ slug: string }>();
  const [briefOpen, setBriefOpen] = useState(false);
  const answer = answerBySlug(slug);

  if (!answer) {
    return (
      <MindmakeShell onStart={() => setBriefOpen(true)}>
        <SEO title="Answer not found" description="This answer could not be found." canonical="/answers" noindex />
        <section className="mm-article-missing">
          <div className="mm-container">
            <h1>This answer is no longer here.</h1>
            <Link className="mm-button" to="/answers">See every answer <ArrowRight aria-hidden="true" /></Link>
          </div>
        </section>
        <LeadBrief open={briefOpen} onClose={() => setBriefOpen(false)} />
      </MindmakeShell>
    );
  }

  return (
    <MindmakeShell onStart={() => setBriefOpen(true)}>
      <SEO
        title={answer.title}
        description={answer.description}
        canonical={answerPath(answer.slug)}
        ogType="article"
        jsonLd={answerJsonLd(answer)}
      />

      <article className="mm-answer-page">
        <div className="mm-container">
          <header className="mm-answer-hero">
            <Link className="mm-answer-back" to="/answers"><ArrowLeft aria-hidden="true" /> All answers</Link>
            <h1>{answer.title}</h1>
            {/* The liftable answer, before any preamble. */}
            <p className="mm-answer-direct">{answer.answer}</p>
            <p className="mm-answer-claim mm-claim">{answer.claim}</p>
            <div className="mm-answer-meta">
              <span>{new Date(answer.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
              <span>Answers: {answer.targetQuery}</span>
            </div>
          </header>

          <div className="mm-answer-body">
            <ReactMarkdown
              components={{
                a: ({ href, children }) => href?.startsWith("/")
                  ? <Link to={href}>{children}</Link>
                  : <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
              }}
            >
              {answer.body}
            </ReactMarkdown>
          </div>

          <section className="mm-answer-stand" aria-labelledby="answer-stand-title">
            <h2 id="answer-stand-title">Where we stand on this</h2>
            <ul>
              {answer.firstParty.map((line) => <li key={line}>{line}</li>)}
            </ul>
          </section>

          {/* One section per question rather than one section holding them
              all. Four answers in a single box ran 1.38 screens on a 360px
              phone, and `npm run qa:screens` reads a section over budget as
              several sections that have not been separated yet, which is
              exactly what a list of questions is. */}
          <div className="mm-answer-faq">
            <h2>The questions that follow</h2>
            {answer.faq.map((entry) => (
              <section key={entry.q}>
                <h3>{entry.q}</h3>
                <p>{entry.a}</p>
              </section>
            ))}
          </div>
        </div>
      </article>

      <LeadBrief open={briefOpen} onClose={() => setBriefOpen(false)} />
    </MindmakeShell>
  );
}
