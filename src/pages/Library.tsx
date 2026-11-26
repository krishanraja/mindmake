import { JourneyEnd } from "@/components/mindmake/JourneyEnd";
import { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import corpus from "@/content/answers.json";
import "@/styles/mindmake.css";

/** The same curated corpus the ask bar answers from, laid out in full. */
const answers = corpus.entries as Array<{ id: string; question: string; answer: string }>;

/* The same questions and answers the page shows, as structured data, so an
   answer engine reads the words a visitor reads and nothing else. */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  url: "https://mindmake.co/faq",
  inLanguage: "en-GB",
  publisher: { "@type": "Organization", "@id": "https://mindmake.co/#organization", name: "Mindmake", url: "https://mindmake.co" },
  mainEntity: answers.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const chapters = [
  { title: "Is this for you?", ids: ["fit", "technical", "size", "team", "chatgpt", "consultant", "why-not-myself"] },
  { title: "Inside the work", ids: ["how-we-work", "start", "included", "where-to-use", "keep-it-right", "speed", "tried-it", "risk"] },
  { title: "What stays yours", ids: ["keep", "report", "data", "private", "duration", "cost", "charging", "email"] },
];

function QuestionGroup({ chapter, compact }: { chapter: typeof chapters[number]; compact: boolean }) {
  const items = chapter.ids.map(id => answers.find(item => item.id === id)!);
  const [selected, setSelected] = useState(chapter.ids[0]);
  if (compact) return <div className="journey-pocket">
    <label className="journey-question-choice">
      <span>{items.find(item => item.id === selected)?.question}</span>
      <select aria-label={chapter.title} value={selected} onChange={event => setSelected(event.target.value)}>
        {items.map(item => <option key={item.id} value={item.id}>{item.question}</option>)}
      </select>
    </label>
    <div className="journey-pocket-answer" aria-live="polite">
      {items.map(item => <div key={item.id} aria-hidden={selected !== item.id}>
        <p>{item.answer}</p>
      </div>)}
    </div>
  </div>;
  return <div className="journey-questions">{items.map((item, position) =>
    <details className="journey-detail" name={chapter.title} key={item.id} open={position === 0}>
      <summary>{item.question}</summary><p>{item.answer}</p>
    </details>
  )}</div>;
}

export default function Questions() {
  const [briefOpen, setBriefOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const phone = window.matchMedia("(max-width: 700px)");
    const resize = () => setCompact(phone.matches);
    resize();
    phone.addEventListener("change", resize);
    return () => phone.removeEventListener("change", resize);
  }, []);

  return (
    <MindmakeShell onStart={() => setBriefOpen(true)}>
      <SEO
        title="Questions we get asked"
        description="Straight answers about Mindmake: what the work builds, what it costs, whether anyone needs to know, what happens to your data and what you keep."
        canonical="/faq"
        jsonLd={faqJsonLd}
      />
      <header className="journey-hero mm-container"><h1>Questions we get asked.</h1>
        <p>The questions leaders ask before they start, answered the way we would answer them on a call.</p>
      </header>
      {chapters.map((chapter, index) => <section className="journey-room mm-container" key={chapter.title}>
        <h2>{chapter.title}</h2>
        <QuestionGroup chapter={chapter} compact={compact} />
        {index === 2 && <JourneyEnd page="faq" onStart={() => setBriefOpen(true)} />}
      </section>)}
      <LeadBrief open={briefOpen} onClose={() => setBriefOpen(false)} />
    </MindmakeShell>
  );
}
