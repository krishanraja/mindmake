import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { ideas, type IdeaKind, type IdeaSubject } from "@/lib/ideas";
import { IDEA_SUBJECTS, kindLabels, subjectLabels } from "@/lib/ideaFormat";
import "@/styles/mindmake.css";

/**
 * Ideas you can use: every quick tip and every longer read, one list, newest
 * first (owner ruling, 2026-09-25). The tips were `/answers`, one page per buyer
 * question; the reads were this archive. Each keeps its own page and its own
 * form under `/answers/:slug` and `/blog/:slug`. Here they share the list the
 * tips already used, an entry apiece, and two filters: what kind of idea, and
 * what it is about. `/answers` sends the reader here.
 */
const TITLE = "Ideas you can use";
const DESCRIPTION = "Quick AI tips and longer reads for leaders making business decisions as AI changes their market, newest first.";

const KINDS: ReadonlyArray<{ value: IdeaKind | null; label: string }> = [
  { value: null, label: "All" },
  { value: "tip", label: "Quick tips" },
  { value: "read", label: "Longer reads" },
];

const written = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

const Blog = () => {
  const [briefOpen, setBriefOpen] = useState(false);
  const [kind, setKind] = useState<IdeaKind | null>(null);
  const [subject, setSubject] = useState<IdeaSubject | null>(null);
  const visible = ideas.filter((idea) => (!kind || idea.kind === kind) && (!subject || idea.subject === subject));

  return (
    <MindmakeShell onStart={() => setBriefOpen(true)}>
      <SEO
        title={TITLE}
        description={DESCRIPTION}
        canonical="/blog"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: TITLE,
          description: DESCRIPTION,
          url: "https://mindmake.co/blog",
          publisher: { "@type": "Organization", name: "Mindmake", url: "https://mindmake.co" },
          mainEntity: {
            "@type": "ItemList",
            itemListElement: ideas.map((idea, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: idea.title,
              url: `https://mindmake.co${idea.href}`,
            })),
          },
        }}
      />

      <section className="mm-blog-page" aria-labelledby="blog-title">
        <header className="mm-container mm-blog-hero">
          <h1 id="blog-title">Ideas you can use.</h1>
        </header>

        <div className="mm-container mm-ideas-tools">
          <div className="mm-ideas-filters">
            <div className="mm-blog-filters" role="group" aria-label="Kind of idea">
              {KINDS.map((option) => (
                <button key={option.label} type="button" aria-pressed={kind === option.value} onClick={() => setKind(option.value)}>
                  {option.label}
                </button>
              ))}
            </div>
            <div className="mm-blog-filters" role="group" aria-label="Subject">
              <button type="button" aria-pressed={subject === null} onClick={() => setSubject(null)}>All subjects</button>
              {IDEA_SUBJECTS.map((option) => (
                <button key={option} type="button" aria-pressed={subject === option} onClick={() => setSubject(option)}>
                  {subjectLabels[option]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mm-container mm-ideas-list">
          {visible.length > 0 ? visible.map((idea) => (
            <Link key={idea.href} className="mm-idea-entry" to={idea.href}>
              <article>
                <h2>{idea.title}</h2>
                <p>{idea.line}</p>
                <footer>
                  <span>
                    {kindLabels[idea.kind]} · {subjectLabels[idea.subject]} · {written(idea.publishedAt)}
                    {idea.readingTime ? ` · ${idea.readingTime} min read` : ""}
                  </span>
                  <strong>{idea.kind === "tip" ? "Read the answer" : "Read the idea"} <ArrowRight aria-hidden="true" /></strong>
                </footer>
              </article>
            </Link>
          )) : (
            <div className="mm-blog-empty">
              <h2>Nothing here yet.</h2>
              <p>No idea of that kind on that subject so far.</p>
              <button type="button" className="mm-text-button" onClick={() => { setKind(null); setSubject(null); }}>Show every idea</button>
            </div>
          )}
        </div>
      </section>

      <LeadBrief open={briefOpen} onClose={() => setBriefOpen(false)} />
    </MindmakeShell>
  );
};

export default Blog;
