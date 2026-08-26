import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { careerReferences } from "@/data/rebuildProof";

const orderedCareerReferences = [
  ...careerReferences.filter(({ name }) => name === "Ashley Wales-Brown"),
  ...careerReferences.filter(({ name }) => name !== "Ashley Wales-Brown"),
];

const testimonials = orderedCareerReferences.map(
  ({ name, role, quote }) => [quote, `${name}, ${role}`] as const,
);

interface QuoteDeckProps {
  title: string;
  items: readonly (readonly [string, string])[];
  tone?: "forest" | "ink";
}

function QuoteDeck({ title, items, tone = "forest" }: QuoteDeckProps) {
  const [index, setIndex] = useState(0);
  const move = (direction: number) => setIndex((current) => (current + direction + items.length) % items.length);

  return (
    <article className={`mm-quote-deck is-${tone}`}>
      <header><h3>{title}</h3></header>
      <div className="mm-quote-stack" aria-live="polite">
        {items.map(([quote, source], itemIndex) => (
          <blockquote className={itemIndex === index ? "is-active" : ""} aria-hidden={itemIndex !== index} key={source}>
            <p>“{quote}”</p>
            <cite>{source}</cite>
          </blockquote>
        ))}
      </div>
      <footer>
        <span>{String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
        <div>
          <button type="button" onClick={() => move(-1)} aria-label={`Previous ${title.toLowerCase()}`}><ArrowLeft aria-hidden="true" /></button>
          <button type="button" onClick={() => move(1)} aria-label={`Next ${title.toLowerCase()}`}><ArrowRight aria-hidden="true" /></button>
        </div>
      </footer>
    </article>
  );
}

export function CareerReferenceDeck() {
  return (
    <div className="mm-voices">
      <QuoteDeck title="Testimonials" items={testimonials} tone="ink" />
    </div>
  );
}
