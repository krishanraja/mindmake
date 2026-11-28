import { useEffect, useRef, useState, type ReactNode } from "react";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { track } from "@/lib/analytics";
import { SEO } from "@/components/SEO";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import { ProductSprint, DepthTile } from "@/components/mindmake/ProductSprint";
import { FilmPlate } from "@/components/mindmake/FilmPlate";
import { BrainStage } from "@/components/mindmake/BrainStage";
import { BRAIN_PARTS } from "@/components/mindmake/LiquidBrain";
import { buildOnScroll } from "@/lib/scrollBuild";
import "@/styles/mindmake.css";
import "@/styles/product-pages.css";
import { START_LABEL } from "@/lib/publicLinks";
import heroImage from "@/assets/films/aug2026/film-02-poster.jpg";
import heroImageWebp from "@/assets/films/aug2026/film-02-poster.webp";
import heroLoop from "@/assets/films/aug2026/film-02-loop.mp4";
import heroLoopWebm from "@/assets/films/aug2026/film-02-loop.webm";

/**
 * /ai-brain (Krish, 2026-11-28): the homepage's look and feel, the story told
 * in headlines rather than paragraphs, the hero film playing again (it had
 * been a still since 25 November), and the AI brain in 3D beside the words,
 * lighting the part of itself each passage is about as the reader scrolls:
 * the problem lights the North Star, how it knows you walks through Vision,
 * Taste, Judgement and Preferences, the 30 days light Standards. A tap on a
 * part, or an address such as /ai-brain#taste, lights it too.
 *
 * Headlines rise out of their lines as they arrive (the scroll-type spec,
 * reskinned): each line is a .ln mask. Nothing is hidden without script, an
 * observer or motion (src/hooks/useReveal.ts), and scroll is never held.
 */
const lines = (...rows: string[]) => rows.map((row, i) => <span className="ln" key={row} style={{ ["--i" as string]: i }}><span>{row}{i < rows.length - 1 ? " " : ""}</span></span>);

const PARTS = BRAIN_PARTS.map(([name]) => name) as string[];
const fromHash = () => {
  const slug = typeof location === "undefined" ? "" : decodeURIComponent(location.hash.slice(1));
  return PARTS.find((name) => name.toLowerCase().replace(/\s+/g, "-") === slug);
};

function Passage({ part, children }: { part: string; children: ReactNode }) {
  return <div className="brain-passage" data-brain-part={part}>{children}</div>;
}

export default function AiBrainLocked() {
  const { briefOpen, briefJourneyKey, openBrief, closeBrief } = useLeadBriefHistory();
  const start = () => openBrief("brain");
  const startFromHero = () => {
    track("scoping_request", { source: "hero", route: "brain" });
    start();
  };
  const [active, setActive] = useState<string>("North Star");
  const pinnedByTap = useRef(0);
  const story = useRef<HTMLDivElement>(null);

  /* The part the reader is reading about: the last passage whose top has
     passed 55% of the screen. A tap holds its choice until the reader moves
     on to another passage. */
  useEffect(() => {
    const root = story.current;
    if (!root) return;
    const passages = [...root.querySelectorAll<HTMLElement>("[data-brain-part]")];
    let frame = 0, last = "";
    const read = () => {
      frame = 0;
      let at = passages[0];
      for (const passage of passages) if (passage.getBoundingClientRect().top < innerHeight * .55) at = passage;
      const part = at?.dataset.brainPart ?? "North Star";
      if (part === last) return;
      last = part;
      if (Date.now() - pinnedByTap.current < 400) return;
      setActive(part);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(read); };
    const hashPart = fromHash();
    if (hashPart) {
      setActive(hashPart);
      pinnedByTap.current = Date.now();
      document.getElementById("inside")?.scrollIntoView({ block: "start" });
    } else read();
    addEventListener("scroll", onScroll, { passive: true });
    return () => { removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);

  /* Each section builds as the reader reaches it, as the homepage does. */
  useEffect(() => {
    const root = story.current;
    if (!root) return;
    return buildOnScroll(root, { sections: ".product-section", title: "h2", lede: ".brain-lede", items: ".product-tile, .sprint-weeks li, .product-receipt" });
  }, []);

  const choose = (part: string) => { pinnedByTap.current = Date.now(); setActive(part); };

  return <MindmakeShell showMobileActionBar={false} mainClassName="product-page brain-page" onStart={start} startLabel={START_LABEL}>
    <SEO title="Build your AI brain" description="An AI brain keeps your ideas, memories and plans in a private record you own." canonical="/ai-brain" />
    <header className="product-hero">
      <FilmPlate className="product-hero-film" poster={heroImage} posterWebp={heroImageWebp} src={heroLoop} srcWebm={heroLoopWebm} priority decorative label="" />
      <div>
        <h1>{lines("Teach your AI what", "experience taught you.")}</h1>
        <p>An AI brain keeps your ideas, memories and plans in a private record you own.</p>
        <button className="mm-button" data-early-start="brain" data-mm-primary data-mm-hero onClick={startFromHero}>{START_LABEL}</button>
      </div>
    </header>
    <div className="brain-story" ref={story}>
      <aside className="brain-aside" aria-label="Your AI brain">
        <BrainStage active={active} onSelect={choose} />
      </aside>
      <section className="product-section product-problem" id="you">
        <Passage part="North Star">
          <h2>{lines("The questions only", "you can answer.")}</h2>
          <p className="brain-lede">If you worked with someone new tomorrow, what would you have to teach them first?</p>
        </Passage>
      </section>
      <section className="product-section brain-inside" id="inside">
        <Passage part="Vision">
          <div>
            <h2>{lines("Your AI brain knows", "how you think.")}</h2>
            <p className="brain-lede">It holds your goals, taste and standards, so you can trust its answers.</p>
          </div>
        </Passage>
        <div className="brain-truths">
          <Passage part="Taste"><DepthTile group="brain-truth" title="Correct its reading." detail="A guess stays dotted until you say yes. Change the reading when it misses your point." /></Passage>
          <Passage part="Judgement"><DepthTile group="brain-truth" title="Weigh a choice." detail="Your own rules come back as questions before a hard call." /></Passage>
          <Passage part="Preferences"><DepthTile group="brain-truth" title="Keep control of what you share." detail="Nothing is shared or reused without your say." /></Passage>
        </div>
      </section>
      <div className="brain-passage" data-brain-part="Standards">
        <ProductSprint door="brain" onStart={openBrief} />
      </div>
    </div>
    <LeadBrief open={briefOpen} onClose={closeBrief} route="brain" presentation="drawer" journeyKey={briefJourneyKey} />
  </MindmakeShell>;
}
