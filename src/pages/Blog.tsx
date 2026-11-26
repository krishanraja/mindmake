import { JourneyEnd } from "@/components/mindmake/JourneyEnd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { ideas, type IdeaKind, type IdeaSubject } from "@/lib/ideas";
import { IDEA_SUBJECTS, kindLabels, subjectLabels, writtenOn } from "@/lib/ideaFormat";
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

const Blog = () => {
  const [briefOpen, setBriefOpen] = useState(false);
  const [kind, setKind] = useState<IdeaKind | null>(null);
  const [subject, setSubject] = useState<IdeaSubject | null>(null);
  const [first, setFirst] = useState(0);
  const [pageSize, setPageSize] = useState<number | null>(null);
  useEffect(() => {
    const phone = window.matchMedia("(max-width: 700px)");
    const resize = () => setPageSize(phone.matches ? 1 : 3);
    resize();
    phone.addEventListener("change", resize);
    return () => phone.removeEventListener("change", resize);
  }, []);
  const page = Math.floor(first / (pageSize ?? 3));
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

      <div className="mm-blog-page">
        <header className="mm-container mm-blog-hero">
          <h1 id="blog-title">Ideas you can use.</h1>
        </header>

        <section className="mm-container mm-ideas-tools journey-room"><h2>Find an idea for your next call.</h2>
          <div className="mm-ideas-filters">
            <div className="mm-blog-filters" role="group" aria-label="Kind of idea">
              {KINDS.map((option) => (
                <button key={option.label} type="button" aria-pressed={kind === option.value} onClick={() => { setKind(option.value); setFirst(0); }}>
                  {option.label}
                </button>
              ))}
            </div>
            <div className="mm-blog-filters" role="group" aria-label="Subject">
              <button type="button" aria-pressed={subject === null} onClick={() => { setSubject(null); setFirst(0); }}>All subjects</button>
              {IDEA_SUBJECTS.map((option) => (
                <button key={option} type="button" aria-pressed={subject === option} onClick={() => { setSubject(option); setFirst(0); }}>
                  {subjectLabels[option]}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mm-container journey-room" aria-label="Ideas"><div className={"mm-ideas-list" + (pageSize ? " is-paged" : "")}>
          {visible.length > 0 ? visible.map((idea, index) => (
            <Link key={idea.href} hidden={pageSize !== null && Math.floor(index / pageSize) !== page} className="mm-idea-entry" to={idea.href}>
              <article>
                <h2>{idea.title}</h2>
                {/* A tip titled as a question shows its own description: its
                    search question only said the title again (audit OTHER-04). */}
                <p>{idea.kind === "tip" && idea.title.trim().endsWith("?") ? idea.description : idea.line}</p>
                <footer>
                  <span>
                    {/* Each item stays on one line, so a line breaks only after a
                        "·", never inside a date (audit OTHER-05). */}
                    {[kindLabels[idea.kind], subjectLabels[idea.subject], writtenOn(idea.publishedAt), idea.readingTime ? `${idea.readingTime} min read` : ""]
                      .filter(Boolean).map((part) => part.replace(/ /g, "\u00a0")).join(" · ")}
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
        {pageSize !== null && visible.length > pageSize && <nav className="idea-pages" aria-label="Idea pages">
          <button disabled={page === 0} onClick={() => setFirst((page - 1) * pageSize)} aria-label="Previous ideas">←</button>
          <span aria-live="polite">{page + 1} of {Math.ceil(visible.length / pageSize)}</span>
          <button disabled={(page + 1) * pageSize >= visible.length} onClick={() => setFirst((page + 1) * pageSize)} aria-label="Next ideas">→</button>
        </nav>}
        </section>
        <section className="mm-container journey-room"><h2>Put an idea to work.</h2>
          <details className="journey-detail"><summary>A second reading of a brief</summary>
            <p>Give your AI the brief and a piece you would commission again. Ask which detail the brief misses.</p>
          </details>
          <JourneyEnd page="blog" onStart={() => setBriefOpen(true)} />
        </section>
      </div>

      <LeadBrief open={briefOpen} onClose={() => setBriefOpen(false)} />
    </MindmakeShell>
  );
};

export default Blog;
