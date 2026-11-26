import { JourneyEnd } from "@/components/mindmake/JourneyEnd";
import { useRef } from "react";
import { StoryLibrary } from "./StoryLibrary";
import { CompareNudge } from "./CompareNudge";
import { results, type Door } from "@/data/useCases";

export function DepthTile({ title, line, detail, group }: { title: string; line?: string; detail: string; group?: string }) {
  return <details className="product-tile" {...(group ? { name: group } : {})}>
    <summary><strong>{title}</strong>{line && <span>{line}</span>}</summary>
    <p>{detail}</p>
  </details>;
}

export function ProductSprint({ door, onStart }: { door: Door; onStart: (door: Door) => void }) {
  const stories = useRef<HTMLDialogElement>(null);
  const openStories = () => {
    stories.current?.showModal();
    // The story deck first measures while its dialog is hidden.
    window.dispatchEvent(new Event("resize"));
  };
  const startFromStory = (to: Door) => {
    stories.current?.close();
    onStart(to);
  };
  const business = door === "gtm";
  const steps = [
    business ? "Pick one production, distribution or revenue decision." : "Agree your North Star and one real call or piece of work.",
    business ? "Build a working brief around that decision." : "Build your brain around the work.",
    "Test it on something new.",
    "Do it again on your own and keep the result.",
  ];
  return <section className="product-section sprint" id="built">
    <small>30-day Sprint</small>
    <h2>{business ? "One decision, from brief to return." : "We build yours with you in 30 days."}</h2>
    <ol className="sprint-weeks">{steps.map((step, i) => <li key={step}><small>Week {i + 1}</small>{step}</li>)}</ol>
    <div className="product-receipt">
      <h3>What stays with you</h3>
      <p>{business ? "The finished work, the terms you agreed and a brief for the next release." : "Your brain, built out. Your standards, the systems you tested and a record of the call."}</p>
    </div>
    <noscript><a href="/case-studies">Explore the case studies</a></noscript>
    <div className="product-actions">
      <button className="product-story-link" onClick={openStories}>Explore the stories</button>
      <small>{results.length} results on the record</small>
      <CompareNudge page={door} />
    </div>
    <JourneyEnd page={business ? "gtm" : "brain"} onStart={() => onStart(door)} />
    <dialog ref={stories} className="product-stories" aria-label="Stories by wish">
      <button className="product-close" onClick={() => stories.current?.close()}>Close stories</button>
      <StoryLibrary door={door} deck onStart={startFromStory} />
    </dialog>
  </section>;
}
