import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, TouchEvent } from "react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { StoryFigureView } from "@/components/mindmake/StoryFigure";
import brainFixture from "@/data/vnext/brain-fixture.json";
import { clientStories } from "@/data/rebuildProof";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import { useScrollDriver } from "@/hooks/useScrollDriver";
import filmTwoPoster from "@/assets/films/film-02-poster.webp";
import filmTwoLoop from "@/assets/films/film-02-loop.mp4";
import filmTwoLoopWebm from "@/assets/films/film-02-loop.webm";
import "@/styles/mindmake.css";
import "@/styles/mindmake-instruments.css";
import "@/styles/mindmake-brain-r5.css";
import "@/styles/mindmake-brain-system.css";
import "@/styles/mindmake-brain-calm.css";

const STAGE_NAMES = ["Decision", "Brain", "Evidence", "Correction"] as const;
const BRAIN_STORY_PRESENTATIONS = [
  {
    id: "own-system",
    tab: "Publishing most days",
    mobileTab: "Publishing",
    headline: "Publishing moved from monthly to most days.",
    summary: "Publishing now takes under an hour.",
  },
  {
    id: "team-decides",
    tab: "Fourteen vendors to three decisions",
    mobileTab: "Decisions",
    headline: "Fourteen vendors became three decisions.",
    summary: "The team shipped the work with no new hires.",
  },
  {
    id: "hand-back",
    tab: "The system stayed with the founder",
    mobileTab: "Founder",
    headline: "The founder kept the rebuilt system.",
    summary: "Brand, offers and outreach changed in eight weeks.",
  },
].map((presentation) => {
  const story = clientStories.find((candidate) => candidate.id === presentation.id);
  if (!story) throw new Error(`AI Brain proof story ${presentation.id} is missing from the approved record.`);
  return { ...presentation, story };
});

type BrainItem = (typeof brainFixture.items)[number];
type BrainRelationship = (typeof brainFixture.relationships)[number];

const humanize = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());
const wrapNodeLabel = (title: string) => title.split(" ").reduce<string[]>((lines, word) => {
  const current = lines.at(-1) ?? "";
  if (!current || `${current} ${word}`.length > 21) lines.push(word);
  else lines[lines.length - 1] = `${current} ${word}`;
  return lines;
}, []);
const relatedTo = (itemId: string) => brainFixture.relationships.filter((relationship) => relationship.from === itemId || relationship.to === itemId);
const otherEnd = (relationship: BrainRelationship, itemId: string) => relationship.from === itemId ? relationship.to : relationship.from;
const compactBrainViewport = () => typeof window !== "undefined"
  && window.matchMedia("(max-width: 60rem) and (orientation: portrait)").matches;
const mobileBrainViewport = () => typeof window !== "undefined"
  && window.matchMedia("(max-width: 60rem)").matches;

export default function AiBrain() {
  const { briefOpen, briefJourneyKey, openBrief, closeBrief } = useLeadBriefHistory();
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [proofWordsOpen, setProofWordsOpen] = useState(false);
  const [correctionApplied, setCorrectionApplied] = useState(false);
  const [selectedId, setSelectedId] = useState("BI-001");
  const [mobileGraph, setMobileGraph] = useState(false);
  const [graphSize, setGraphSize] = useState({ width: 880, height: 620 });
  const graphRef = useRef<HTMLDivElement>(null);
  const proofTouchStart = useRef<{ x: number; y: number } | null>(null);
  const proofRef = useScrollDriver<HTMLElement>(undefined, "read");
  const closeRef = useScrollDriver<HTMLElement>(undefined, "read");
  const sequenceRef = useScrollDriver<HTMLElement>((nextProgress) => {
    if (compactBrainViewport()) {
      setProgress(0);
      return;
    }
    setProgress(nextProgress);
    setStage(Math.min(3, Math.floor(Math.min(.9999, nextProgress) * 4)));
  }, "pin");

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    setEnhanced(true);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 60rem)");
    const update = () => setMobileGraph(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    const restoreStoryFromHash = () => {
      const storyId = window.location.hash.replace(/^#case-/, "");
      const storyIndex = BRAIN_STORY_PRESENTATIONS.findIndex((presentation) => presentation.id === storyId);
      if (storyIndex >= 0) {
        setActiveStoryIndex(storyIndex);
        setProofWordsOpen(false);
      }
    };
    restoreStoryFromHash();
    window.addEventListener("hashchange", restoreStoryFromHash);
    window.addEventListener("popstate", restoreStoryFromHash);
    return () => {
      window.removeEventListener("hashchange", restoreStoryFromHash);
      window.removeEventListener("popstate", restoreStoryFromHash);
    };
  }, []);

  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;
    const update = () => setGraphSize({ width: graph.clientWidth || 880, height: graph.clientHeight || 620 });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(graph);
    return () => observer.disconnect();
  }, []);

  const layout = useMemo(() => {
    const width = 880;
    const ratio = graphSize.width / Math.max(1, graphSize.height);
    const height = mobileGraph ? 620 : Math.max(520, Math.min(1800, width / Math.max(.45, ratio)));
    const xs = brainFixture.items.map((item) => item.x);
    const ys = brainFixture.items.map((item) => item.y);
    return { left: 60, top: 40, width, height, minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys), padX: 38, padY: 34 };
  }, [graphSize, mobileGraph]);

  const pointFor = (item: BrainItem) => ({
    x: layout.left + layout.padX + ((item.x - layout.minX) / (layout.maxX - layout.minX)) * (layout.width - layout.padX * 2),
    y: layout.top + layout.padY + ((item.y - layout.minY) / (layout.maxY - layout.minY)) * (layout.height - layout.padY * 2),
  });

  const itemById = useMemo(() => new Map(brainFixture.items.map((item) => [item.id, item])), []);
  const selectedItem = itemById.get(selectedId) ?? brainFixture.items[0];
  const selectedRelationships = relatedTo(selectedId);
  const relatedIds = new Set(selectedRelationships.map((relationship) => otherEnd(relationship, selectedId)));

  useEffect(() => {
    const graph = graphRef.current;
    if (!graph || stage !== 1 || !mobileBrainViewport()) return;
    const item = itemById.get(selectedId);
    if (!item) return;
    const point = pointFor(item);
    const scaleX = graph.scrollWidth / layout.width;
    const scaleY = graph.scrollHeight / layout.height;
    const frame = requestAnimationFrame(() => graph.scrollTo({
      left: Math.max(0, (point.x - layout.left) * scaleX - graph.clientWidth / 2),
      top: Math.max(0, (point.y - layout.top) * scaleY - graph.clientHeight / 2),
      behavior: reducedMotion ? "auto" : "smooth",
    }));
    return () => cancelAnimationFrame(frame);
  }, [itemById, layout, reducedMotion, selectedId, stage]);

  const chooseStage = (nextStage: number) => {
    setStage(nextStage);
    if (reducedMotion) return;
    const sequence = sequenceRef.current;
    if (!sequence) return;
    if (compactBrainViewport()) return;
    const heldDistance = Math.max(0, sequence.offsetHeight - window.innerHeight);
    const narrowViewport = window.matchMedia("(max-width: 60rem)").matches;
    window.scrollTo({ top: sequence.offsetTop + heldDistance * ((nextStage + .2) / STAGE_NAMES.length), behavior: narrowViewport ? "auto" : "smooth" });
  };

  const handleNodeKey = (event: KeyboardEvent<SVGGElement>, id: string) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    setSelectedId(id);
  };

  const selectStory = (nextIndex: number) => {
    const index = (nextIndex + BRAIN_STORY_PRESENTATIONS.length) % BRAIN_STORY_PRESENTATIONS.length;
    setActiveStoryIndex(index);
    setProofWordsOpen(false);
    const story = BRAIN_STORY_PRESENTATIONS[index];
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#case-${story.id}`);
  };

  const handleStoryTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight" && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? BRAIN_STORY_PRESENTATIONS.length - 1
        : index + (event.key === "ArrowRight" ? 1 : -1);
    const wrappedIndex = (nextIndex + BRAIN_STORY_PRESENTATIONS.length) % BRAIN_STORY_PRESENTATIONS.length;
    selectStory(wrappedIndex);
    document.getElementById(`proof-tab-${BRAIN_STORY_PRESENTATIONS[wrappedIndex].id}`)?.focus();
  };

  const handleStoryTouchStart = (event: TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    proofTouchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
  };

  const handleStoryTouchEnd = (event: TouchEvent<HTMLElement>) => {
    const start = proofTouchStart.current;
    const touch = event.changedTouches[0];
    proofTouchStart.current = null;
    if (!start || !touch) return;
    const xDistance = touch.clientX - start.x;
    const yDistance = touch.clientY - start.y;
    if (Math.abs(xDistance) < 44 || Math.abs(xDistance) <= Math.abs(yDistance) * 1.15) return;
    selectStory(activeStoryIndex + (xDistance < 0 ? 1 : -1));
  };

  const openBrainBrief = () => openBrief("brain");
  const sequenceStyle = { "--stage": stage, "--progress": progress.toFixed(4) } as CSSProperties;
  const activeStory = BRAIN_STORY_PRESENTATIONS[activeStoryIndex];

  return (
    <MindmakeShell onStart={openBrainBrief} mainClassName="mm-brain-r5 mm-brain-stable mm-brain-calm" showMobileActionBar={false} compactFooter>
      <SEO title="Build your AI brain" description="Sharpen one consequential decision, use it on real work and leave the useful parts running in your own accounts." canonical="/ai-brain" />

      <section className="hero" aria-labelledby="brain-title" data-brain-view="hero">
        <video className="hero-film" autoPlay muted loop playsInline poster={filmTwoPoster} aria-label="A walnut card cabinet with one drawer open beside a desk lamp"><source src={filmTwoLoopWebm} type="video/webm" /><source src={filmTwoLoop} type="video/mp4" /></video>
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-copy"><h1 id="brain-title"><span>Your AI brain</span><span>begins with a real decision.</span></h1><p className="claim">The next decision starts further ahead.</p><p className="lede">Sharpen one important decision. Test it on real work. Keep the system.</p><button className="primary-action" type="button" onClick={openBrainBrief} data-mm-primary>Start here <span aria-hidden="true">→</span></button></div>
        <a className="scroll-cue" href="#decision-sequence">See the Brain in action <span aria-hidden="true">↓</span></a>
      </section>

      <section ref={sequenceRef} className={`decision-sequence${enhanced ? " is-enhanced" : ""}`} id="decision-sequence" aria-labelledby="decision-sequence-title" style={sequenceStyle} data-brain-view="decision">
        <div className="decision-sticky">
          <div className="sequence-heading"><h2 id="decision-sequence-title"><span className="sequence-title-wide">Inspect how a decision becomes reusable judgement.</span><span className="sequence-title-phone">See one decision become reusable.</span></h2></div>
          <nav className="stage-nav" aria-label="Living Brain views">{STAGE_NAMES.map((name, index) => <button type="button" key={name} aria-current={stage === index ? "step" : undefined} onClick={() => chooseStage(index)}><span>0{index + 1}</span>{name}</button>)}</nav>
          <div className="decision-machine">
            <div className="machine-rail" aria-hidden="true"><i /><b /></div>
            <article className="decision-sheet" aria-live="polite">
              <div className="sheet-chrome"><span>Interactive Brain · actual Brain data</span><span className="demo-status"><i aria-hidden="true" /><b>{STAGE_NAMES[stage]}</b></span></div>

              <section className={`state-panel brain-portrait-panel${stage === 0 ? " is-active" : ""}`} data-panel="0" aria-labelledby="portrait-title" aria-hidden={enhanced && !reducedMotion ? stage !== 0 : undefined}>
                <div className="state-copy"><h3 id="portrait-title">Start with one decision.</h3><p>The choice, evidence and meaning stay together.</p></div>
                <div className="demo-query" aria-label="Decision entering the illustrative Brain"><span>Decision in</span><strong>Where must human judgement remain when AI carries the repeatable middle?</strong><div><i /><b>Prior captured</b><i /><b>Evidence attached</b><i /><b>Meaning proposed</b></div></div>
                <div className="portrait-board" aria-label="Working portrait assembled from the decision">
                  <div className="portrait-synthesis"><small>Current synthesis · BI-001</small><strong>Builder of judgement</strong><p>One meaning, linked to its proof.</p></div>
                  <div className="portrait-signals" aria-label="Meanings connected to the current synthesis"><span><small>Pattern · BI-002</small><strong>Possibility detection</strong></span><span><small>Standard · BI-003</small><strong>Human release judgement</strong></span><span><small>Frontier · BI-010</small><strong>Make judgement teachable</strong></span></div>
                  <div className="portrait-measures" aria-label="Brain record counts"><span><b>{brainFixture.items.length}</b><em>meanings</em></span><span><b>{brainFixture.relationships.length}</b><em>relationships</em></span><span><b>{brainFixture.sources.length}</b><em>sources</em></span><span><b>{brainFixture.corrections.length}</b><em>corrections</em></span></div>
                </div>
              </section>

              <section className={`state-panel brain-map-panel${stage === 1 ? " is-active" : ""}`} data-panel="1" aria-label="Interactive Brain" aria-hidden={enhanced && !reducedMotion ? stage !== 1 : undefined}>
                <div className="living-brain" id="livingBrain" data-status="ready">
                  <div ref={graphRef} className="living-graph" aria-label="Interactive Living Brain with twenty current meanings and eighteen supported relationships">
                    <svg id="livingBrainGraph" viewBox={`${layout.left} ${layout.top} ${layout.width} ${layout.height}`} preserveAspectRatio="xMidYMid meet" role="group" aria-labelledby="living-brain-title living-brain-desc">
                      <title id="living-brain-title">The actual Living Brain fixture</title><desc id="living-brain-desc">Twenty meanings are connected by eighteen evidenced relationships. Choose any node to inspect it.</desc>
                      <defs><filter id="livingGlow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="7" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
                      <g className="living-grid" aria-hidden="true">{Array.from({ length: 16 }, (_, index) => <line key={`v${index}`} x1={layout.left + index * 60} y1={layout.top} x2={layout.left + index * 60} y2={layout.top + layout.height} />)}{Array.from({ length: 24 }, (_, index) => <line key={`h${index}`} x1={layout.left} y1={layout.top + index * 60} x2={layout.left + layout.width} y2={layout.top + index * 60} />)}</g>
                      <g className="living-clusters" aria-hidden="true"><text x="34" y={layout.top + layout.height * .12}>fluency</text><text x="565" y={layout.top + layout.height * .1}>judgement</text><text x="315" y={layout.top + layout.height * .46}>self</text><text x="30" y={layout.top + layout.height * .88}>growth</text><text x="720" y={layout.top + layout.height * .88}>future</text><text x="405" y={layout.top + layout.height * .95}>taste</text></g>
                      <g className="living-viewport"><g aria-hidden="true">{brainFixture.relationships.map((relationship) => { const from = pointFor(itemById.get(relationship.from)!); const to = pointFor(itemById.get(relationship.to)!); return <line key={relationship.id} className={`living-edge${relationship.from === selectedId || relationship.to === selectedId ? " is-active" : ""}`} data-from={relationship.from} data-to={relationship.to} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />; })}</g><g>{brainFixture.items.map((item, index) => { const point = pointFor(item); const anchor = item.x > 76 ? "end" : "start"; const labelX = item.x > 76 ? -18 : 18; const labelY = item.y > 86 ? -15 : 4; const labelLines = wrapNodeLabel(item.title); return <g key={item.id} className={`living-node${item.id === selectedId ? " is-active" : ""}${relatedIds.has(item.id) ? " is-related" : ""}`} data-id={item.id} data-type={item.type} role="button" tabIndex={0} aria-pressed={item.id === selectedId} aria-label={`${humanize(item.type)}: ${item.title}`} transform={`translate(${point.x} ${point.y})`} style={{ "--node-delay": `${index * -.19}s` } as CSSProperties} onClick={() => setSelectedId(item.id)} onKeyDown={(event) => handleNodeKey(event, item.id)}><circle className="living-hit" r={mobileGraph ? 22 : 28} /><circle className="living-halo" r="15" /><circle className="living-dot" r="9" /><text x={labelX} y={labelY} textAnchor={anchor}>{labelLines.map((line, lineIndex) => <tspan key={`${item.id}-${lineIndex}`} x={labelX} dy={lineIndex === 0 ? 0 : 12}>{line}</tspan>)}</text></g>; })}</g></g>
                    </svg>
                    <span className="living-count">{brainFixture.items.length} meanings · {brainFixture.relationships.length} relationships · {brainFixture.sources.length} sources</span>
                  </div>
                  <aside className="living-inspector" id="brainMapReadout" aria-live="polite"><small>{humanize(selectedItem.standing)} · {selectedItem.id}</small><strong>{selectedItem.title}</strong><p>{selectedItem.statement}</p><details className="living-detail"><summary>Why it connects <span aria-hidden="true">+</span></summary><div className="living-truth"><span><small>Evidence</small><b>{humanize(selectedItem.confidence)}</b></span><span><small>Version</small><b>v{selectedItem.version}</b></span><span><small>Audience</small><b>{humanize(selectedItem.audience)}</b></span></div><ul className="living-relations">{selectedRelationships.slice(0, 3).map((relationship) => <li key={relationship.id}><b>{humanize(relationship.type)} · {otherEnd(relationship, selectedId)}</b><span>{relationship.meaning}</span></li>)}</ul></details><button type="button" onClick={() => chooseStage(2)}>See its evidence <b aria-hidden="true">→</b></button></aside>
                </div>
              </section>

              <section className={`state-panel brain-evidence-panel${stage === 2 ? " is-active" : ""}`} data-panel="2" aria-labelledby="evidence-title" aria-hidden={enhanced && !reducedMotion ? stage !== 2 : undefined}><div className="state-copy"><h3 id="evidence-title">Check the source.</h3><p>Two founder records support this rule.</p></div><div className="brain-evidence" aria-label="Evidence chain behind human release judgement"><aside className="evidence-standing"><small>Standing</small><strong>Direct founder evidence</strong><span>AI can add evidence. A person releases the work.</span></aside><details className="evidence-records"><summary>See the three records <span aria-hidden="true">+</span></summary><div className="evidence-record-grid"><div><small>01 · Founder statement</small><strong>AI cannot substitute for taste and judgement.</strong><span>SRC-002 · founder interview · 07 Sep 2026</span></div><div><small>02 · Product instruction</small><strong>Complete human judgement and accountability loop.</strong><span>SRC-010 · founder instruction · 07 Sep 2026</span></div><div><small>03 · Relationship</small><strong>Human release constrains “Make judgement teachable”.</strong><span>REL-003 · both source records attached</span></div></div></details></div><button className="inline-demo-action" type="button" onClick={() => chooseStage(1)}>Back to the meaning <span aria-hidden="true">←</span></button></section>

              <section className={`state-panel brain-change-panel${stage === 3 ? " is-active" : ""}`} data-panel="3" aria-labelledby="change-title" aria-hidden={enhanced && !reducedMotion ? stage !== 3 : undefined}><div className="state-copy"><h3 id="change-title">Correct it once.</h3><p>The private Brain updates everywhere.</p></div><div className={`brain-change${correctionApplied ? " is-applied" : ""}`}><div className="earlier-version"><small>Earlier · v1</small><p>Every draft needed human release.</p></div><div className="proposed-version"><small>Correction · proposed v2</small><p>External work needs review. Reversible drafts can stay delegated.</p></div><details className="change-detail"><summary>See what changes <span aria-hidden="true">+</span></summary><div className="change-detail-grid"><dl className="change-rules"><div><dt>External work</dt><dd>Human release</dd></div><div><dt>Internal drafts</dt><dd>Human release</dd></div></dl><dl className="change-rules"><div><dt>External work</dt><dd>Human release</dd></div><div><dt>Internal drafts</dt><dd>May stay delegated</dd></div></dl></div></details><button className="apply-correction" type="button" onClick={() => setCorrectionApplied((applied) => !applied)}><span>{correctionApplied ? "Undo correction" : "Apply correction"}</span><b aria-hidden="true">{correctionApplied ? "↺" : "→"}</b></button><aside className={correctionApplied ? "is-complete" : ""} aria-live="polite"><b>{correctionApplied ? "Updated" : "Ready"}</b><span>{correctionApplied ? "Private meaning rebuilt. Shared work still waits for review." : "Nothing has changed yet."}</span></aside></div></section>
            </article>
            <div className="drawer-bank" aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <span key={index} />)}</div>
          </div>
        </div>
      </section>

      <section ref={proofRef} className="proof" aria-labelledby="brain-proof-title" data-brain-view="proof">
        <div className="mm-container proof-shell">
          <div className="proof-story-controls" role="tablist" aria-label="Client stories">
            {BRAIN_STORY_PRESENTATIONS.map((presentation, index) => (
              <button
                id={`proof-tab-${presentation.id}`}
                key={presentation.id}
                type="button"
                role="tab"
                aria-selected={activeStoryIndex === index}
                aria-controls="brain-proof-story"
                tabIndex={activeStoryIndex === index ? 0 : -1}
                onClick={() => selectStory(index)}
                onKeyDown={(event) => handleStoryTabKey(event, index)}
              >
                <span className="proof-tab-index">0{index + 1}</span>
                <span className="proof-tab-label proof-tab-label-desktop">{presentation.tab}</span>
                <span className="proof-tab-label proof-tab-label-mobile">{presentation.mobileTab}</span>
              </button>
            ))}
          </div>

          <article
            id="brain-proof-story"
            className="proof-story-card"
            role="tabpanel"
            aria-labelledby={`proof-tab-${activeStory.id}`}
            data-story-id={activeStory.id}
            onTouchStart={handleStoryTouchStart}
            onTouchEnd={handleStoryTouchEnd}
          >
            <div className="proof-copy">
              <h2 id="brain-proof-title">{activeStory.headline}</h2>
              <p>{activeStory.summary}</p>
              <span className="source">{activeStory.story.attribution} · identity withheld</span>
              <button className="proof-disclosure" type="button" aria-expanded={proofWordsOpen} aria-controls="client-proof" onClick={() => setProofWordsOpen((open) => !open)}>{proofWordsOpen ? "Close the client's words" : "Read the client's words"}<span aria-hidden="true">{proofWordsOpen ? "−" : "+"}</span></button>
              {proofWordsOpen ? <blockquote id="client-proof">“{activeStory.story.quote}”<cite>{activeStory.story.attribution}</cite></blockquote> : null}
              <Link className="proof-archive-link" to="/case-studies">See all eight results <span aria-hidden="true">→</span></Link>
            </div>

            <div className="proof-story-stage">
              <div className="proof-story-visual" data-figure={activeStory.story.figure.shape} aria-label={`Visual comparison: ${activeStory.story.result}`}>
                <StoryFigureView key={activeStory.id} figure={activeStory.story.figure} />
              </div>
              <div className="proof-story-nav" aria-label="Move between client stories">
                <button type="button" onClick={() => selectStory(activeStoryIndex - 1)} aria-label="Previous client story">←</button>
                <span>{String(activeStoryIndex + 1).padStart(2, "0")} / {String(BRAIN_STORY_PRESENTATIONS.length).padStart(2, "0")}</span>
                <button type="button" onClick={() => selectStory(activeStoryIndex + 1)} aria-label="Next client story">→</button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section ref={closeRef} className="close" aria-labelledby="brain-close-title" data-brain-view="close"><div><h2 id="brain-close-title">One decision is enough to begin.</h2><p className="claim">You keep what works.</p><p className="close-detail">Leave with a working Brain, its proof and its standards.</p></div><button className="primary-action is-large" type="button" onClick={openBrainBrief} data-mm-primary>Start here <span aria-hidden="true">→</span></button></section>

      <LeadBrief open={briefOpen} onClose={closeBrief} route="brain" presentation="drawer" journeyKey={briefJourneyKey} />
    </MindmakeShell>
  );
}
