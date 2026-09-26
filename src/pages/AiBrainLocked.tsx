import { useEffect, useRef } from "react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { useLockedMotion } from "@/components/mindmake/locked/useLockedMotion";
import { extractLockedBlock, extractLockedMain, replaceLockedAsset } from "@/components/mindmake/locked/lockedMarkup";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import fixture from "@/data/vnext/brain-fixture.json";
import evidenceFilm from "@/assets/films/sep2026/evidence-connects-loop-r01-20s-720p-web-sealed.mp4";
import lockedDocument from "../../prototypes/website-redesign-recovery/brain-signature/index-s4-narrative-r1.html?raw";
import evidencePoster from "../../prototypes/website-redesign-recovery/brain-signature/media/evidence-connects-poster.png";
import { PairingBridge } from "@/components/mindmake/PairingBridge";
import { readingProgress, sequenceProgress, stepStates } from "@/components/mindmake/locked/scrollSequence";
import "@/styles/mindmake.css";
import "@/styles/mindmake-locked-brain.css";
import "@/styles/mindmake-brain-refinements.css";
import "@/styles/mindmake-brain-narrative.css";

const selectedId = "BI-003";
const plainStatements: Record<string, string> = {
  "BI-001": "Build systems that help more people make better decisions.",
  "BI-002": "Spot newly possible work before old habits make it obvious.",
  "BI-003": "People stay accountable for work that reaches the outside world.",
  "BI-004": "Repeated clicks, copying and explanation reveal where the system needs work.",
  "BI-005": "Seeing what is possible early can make old ways of working feel painfully slow.",
  "BI-006": "Work with leaders who want to reshape their category.",
  "BI-007": "Let AI carry repeatable information work. Keep standards, relationships, strategy and final craft human.",
  "BI-008": "Missing numbers and lookalike thinking are warning signs.",
  "BI-009": "The system should preserve a person's voice, standards and exceptions.",
  "BI-010": "Turn good judgement into standards that other people can use without becoming copies.",
  "BI-011": "Put the time saved back into customers and the people affected by the work.",
  "BI-012": "Build with leaders who are already ready to move.",
  "BI-013": "Redesign the work before drawing conclusions about the people doing it.",
  "BI-014": "Future teams may need builders with agency, taste and strong systems around them.",
  "BI-015": "Bring genuinely different options into the room so people can spend their time judging.",
  "BI-016": "See where culture is saturated, what is missing and what might emerge next.",
  "BI-017": "Changing a mind is not enough when the surrounding system still rewards the old behaviour.",
  "BI-018": "A second AI can check the work. It cannot make the final call.",
  "BI-019": "The leader owns the Brain. The company gains from the decisions it improves.",
  "BI-020": "Help capable people become more discerning, more decisive and less generic.",
};

const evidenceMessages = {
  ready: "",
  loading: "Checking the record. The last known version remains readable.",
  stale: "The source check is older than expected. The last known version remains readable.",
  error: "The source check is unavailable. The last known version remains readable.",
  recovery: "Connection restored. The record is current.",
} as const;

type BrainItem = (typeof fixture.items)[number];

// The page is six chapters after the opening, in this order. Each heading
// must appear exactly once, so a copy edit can never silently drop or double
// a chapter the scroll build, the rail and the checks all depend on.
const chapterTitles = ["opening-title", "you-title", "memory-title", "sharper-title", "record-title", "business-title", "built-title"];
/** Where the month's steps light: this far down the screen, well clear of the action bar. */
const READING_LINE = 0.72;

function prepareMarkup() {
  let markup = `${extractLockedMain(lockedDocument)}${extractLockedBlock(lockedDocument, "truth-bar")}`;
  chapterTitles.forEach((id) => {
    if (markup.split(`id="${id}"`).length - 1 !== 1) {
      throw new Error(`The Brain page must carry exactly one ${id}.`);
    }
  });
  markup = replaceLockedAsset(markup, "../../../src/assets/films/sep2026/evidence-connects-loop-r01-20s-720p-web-sealed.mp4", evidenceFilm);
  markup = replaceLockedAsset(markup, "./media/evidence-connects-poster.png", evidencePoster);
  return markup;
}

const lockedMarkup = prepareMarkup();

// Settled thinking and thinking still being worked out look different in the
// graph, so the nodes read as doing different jobs before anyone clicks.
const isSettled = (item: BrainItem) => item.standing === "accepted" || item.standing === "owned_call" || item.standing === "accepted_learning";

// The inspector's label names the picked idea's standing, in the colour the
// graph already gives it: the leader's own settled calls, or the Brain's
// reading, which stays a reading until the leader agrees it.
const standingLabel = (item: BrainItem) => (isSettled(item) ? "Agreed by you" : "Your Brain's reading");

// Whether two ideas share a connection, in either direction.
const linked = (a: string, b?: string) => fixture.relationships.some((relationship) => (relationship.from === a && relationship.to === b) || (relationship.to === a && relationship.from === b));

// Text that changes on interaction sits in a frame sized to its longest
// variant, so the panel never grows or shrinks as a visitor clicks around.
function reserveLongest(target: HTMLElement | null, variants: string[]) {
  const frame = target?.parentElement;
  if (!target || !frame || frame.querySelector(`[data-sizer-for="${target.id}"]`)) return;
  const wrapper = document.createElement("div");
  wrapper.className = "mm-stable-frame";
  target.replaceWith(wrapper);
  wrapper.append(target);
  variants.forEach((variant) => {
    const ghost = target.cloneNode(false) as HTMLElement;
    ghost.removeAttribute("id");
    ghost.dataset.sizerFor = target.id;
    ghost.setAttribute("aria-hidden", "true");
    ghost.className = `${target.className} mm-stable-ghost`.trim();
    ghost.textContent = variant;
    wrapper.append(ghost);
  });
}

function useLockedBrain(rootRef: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if ([fixture.items.length, fixture.relationships.length, fixture.sources.length, fixture.corrections.length].join(",") !== "20,18,10,3") {
      throw new Error("The locked Brain fixture counts changed.");
    }

    const q = <T extends Element>(selector: string) => root.querySelector<T>(selector);
    const cleanups: Array<() => void> = [];
    const params = new URLSearchParams(window.location.search);
    const requestedState = params.get("state") ?? "ready";
    const renderFinal = params.get("render") === "final";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const itemById = new Map(fixture.items.map((item) => [item.id, item]));
    const field = q<HTMLElement>("#meaningFieldS2");
    const svg = q<SVGSVGElement>("#relationshipFieldS2");

    const setEvidenceState = (state: string) => {
      const safeState = state in evidenceMessages ? state as keyof typeof evidenceMessages : "ready";
      root.dataset.evidenceState = safeState;
      const output = q<HTMLElement>("#evidenceStateS2");
      if (output) output.textContent = evidenceMessages[safeState];
    };

    const selectMeaning = (item: BrainItem) => {
      field?.querySelectorAll<HTMLElement>(".meaning-node-s2").forEach((node) => {
        const active = node.dataset.id === item.id;
        node.classList.toggle("is-active", active);
        node.setAttribute("aria-pressed", active ? "true" : "false");
      });
      const kind = q<HTMLElement>("#inspectorKindS2");
      const title = q<HTMLElement>("#inspectorTitleS2");
      const statement = q<HTMLElement>("#inspectorStatementS2");
      if (kind) {
        kind.textContent = standingLabel(item);
        kind.dataset.standing = isSettled(item) ? "settled" : "working";
      }
      // The picked idea's own connections light, so the reasons that tie it
      // to the rest of the Brain are the ones on show.
      svg?.querySelectorAll<SVGLineElement>("line").forEach((line) => {
        line.classList.toggle("is-focus", line.dataset.from === item.id || line.dataset.to === item.id);
      });
      field?.querySelectorAll<HTMLElement>(".meaning-node-s2").forEach((node) => {
        node.classList.toggle("is-linked", linked(item.id, node.dataset.id));
      });
      if (title) title.textContent = item.title;
      if (statement) statement.textContent = plainStatements[item.id] ?? item.statement;
    };

    // Every idea title stays on one line at one size. The size is set once
    // from the longest title that fits the panel, never per selection.
    const inspector = q<HTMLElement>("#meaningInspectorS2");
    const inspectorTitle = q<HTMLElement>("#inspectorTitleS2");
    reserveLongest(q<HTMLElement>("#inspectorStatementS2"), fixture.items.map((item) => plainStatements[item.id] ?? item.statement));
    const fitTitles = () => {
      if (!inspector || !inspectorTitle) return;
      inspector.style.removeProperty("--inspector-title-size");
      const probe = inspectorTitle.cloneNode(false) as HTMLElement;
      probe.removeAttribute("id");
      probe.setAttribute("aria-hidden", "true");
      probe.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;width:auto;max-width:none;max-inline-size:none;margin:0";
      inspectorTitle.parentElement?.append(probe);
      const available = inspectorTitle.getBoundingClientRect().width;
      const baseSize = parseFloat(getComputedStyle(inspectorTitle).fontSize);
      const widest = Math.max(...fixture.items.map((item) => { probe.textContent = item.title; return probe.getBoundingClientRect().width; }));
      probe.remove();
      if (available > 0 && widest > available) inspector.style.setProperty("--inspector-title-size", `${Math.floor(baseSize * (available / widest) * 10) / 10}px`);
    };
    fitTitles();
    void document.fonts?.ready.then(fitTitles);
    window.addEventListener("resize", fitTitles);
    cleanups.push(() => window.removeEventListener("resize", fitTitles));

    if (field && svg) {
      fixture.relationships.forEach((relationship) => {
        const from = itemById.get(relationship.from);
        const to = itemById.get(relationship.to);
        if (!from || !to) return;
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", String(from.x));
        line.setAttribute("y1", String(from.y));
        line.setAttribute("x2", String(to.x));
        line.setAttribute("y2", String(to.y));
        line.dataset.from = from.id;
        line.dataset.to = to.id;
        if (from.id === selectedId || to.id === selectedId) line.classList.add("is-focus");
        svg.append(line);
      });

      fixture.items.forEach((item) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "meaning-node-s2";
        button.dataset.id = item.id;
        button.dataset.standing = isSettled(item) ? "settled" : "working";
        button.style.setProperty("--cue-delay", `${(fixture.items.indexOf(item) * 7) % 20 * 0.45}s`);
        button.style.setProperty("--x", `${item.x}%`);
        button.style.setProperty("--y", `${item.y}%`);
        button.setAttribute("aria-label", `${item.title}. ${plainStatements[item.id] ?? item.statement}`);
        button.setAttribute("aria-pressed", item.id === selectedId ? "true" : "false");
        if (item.id === selectedId) button.classList.add("is-active");
        if (linked(selectedId, item.id)) button.classList.add("is-linked");
        const label = document.createElement("span");
        label.textContent = item.title;
        button.append(label);
        const click = () => { root.dataset.meaningTouched = "true"; selectMeaning(item); };
        button.addEventListener("click", click);
        cleanups.push(() => button.removeEventListener("click", click));
        field.append(button);
      });

      // The compact graph deliberately keeps every idea at a 44px keyboard
      // target. On the narrowest phone those target circles can overlap even
      // though their visible dots do not. Resolve pointer clicks to the
      // nearest visible node centre, so a tap on an idea can never be captured
      // by a neighbouring invisible hit area. Keyboard activation continues
      // through each button's own click handler.
      const selectNearestMeaning = (event: MouseEvent) => {
        if (event.detail === 0) return;
        const target = event.target instanceof Element
          ? event.target.closest<HTMLElement>(".meaning-node-s2")
          : null;
        if (!target) return;

        const nearest = [...field.querySelectorAll<HTMLElement>(".meaning-node-s2")]
          .map((node) => {
            const rect = node.getBoundingClientRect();
            return {
              node,
              distance: Math.hypot(
                event.clientX - (rect.left + rect.width / 2),
                event.clientY - (rect.top + rect.height / 2),
              ),
            };
          })
          .sort((a, b) => a.distance - b.distance)[0]?.node;

        const item = nearest ? itemById.get(nearest.dataset.id ?? "") : undefined;
        if (!item) return;
        event.preventDefault();
        event.stopPropagation();
        root.dataset.meaningTouched = "true";
        selectMeaning(item);
      };
      field.addEventListener("click", selectNearestMeaning, true);
      cleanups.push(() => field.removeEventListener("click", selectNearestMeaning, true));
    }

    const records = [
      ...fixture.items.map((item) => ({ kind: "Idea", id: item.id, title: item.title, detail: plainStatements[item.id] ?? item.statement })),
      ...fixture.relationships.map((relationship) => ({ kind: "Connection", id: relationship.id, title: `${itemById.get(relationship.from)?.title ?? relationship.from} → ${itemById.get(relationship.to)?.title ?? relationship.to}`, detail: relationship.meaning })),
      ...fixture.sources.map((source) => ({ kind: "Evidence", id: source.id, title: source.label, detail: source.assertion })),
      ...fixture.corrections.map((correction) => ({ kind: "Change", id: correction.id, title: itemById.get(correction.item_ref)?.title ?? correction.item_ref, detail: correction.summary })),
    ];
    const counts = [fixture.items.length, fixture.relationships.length, fixture.sources.length, fixture.corrections.length];
    root.querySelectorAll<HTMLElement>(".record-counts b").forEach((count, index) => { count.textContent = String(counts[index]); });
    const reel = q<HTMLOListElement>("#recordReelS2");
    const complete = q<HTMLElement>("#completeRecordS2");
    const pauseButton = q<HTMLButtonElement>("#pauseRecordS2");
    const nextButton = q<HTMLButtonElement>("#nextRecordS2");
    let current = renderFinal ? 2 : 0;
    let timer = 0;
    let recordPaused = reducedMotion.matches || renderFinal;

    records.forEach((record) => {
      const card = document.createElement("li");
      card.className = "record-card";
      const kind = document.createElement("span");
      kind.textContent = record.kind;
      const copy = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = record.title;
      const detail = document.createElement("small");
      detail.textContent = record.detail;
      copy.append(title, detail);
      card.append(kind, copy);
      reel?.append(card);
      const accessible = document.createElement("p");
      accessible.textContent = `${record.kind}, ${record.id}: ${record.title}. ${record.detail}`;
      complete?.append(accessible);
    });

    const cards = reel ? [...reel.children] as HTMLElement[] : [];
    const paint = () => {
      cards.forEach((card, index) => {
        const distance = Math.abs(index - current);
        card.classList.toggle("is-current", distance === 0);
        card.classList.toggle("is-near", distance === 1);
        card.setAttribute("aria-hidden", distance > 2 ? "true" : "false");
      });
      const currentCard = cards[current];
      if (reel && currentCard) {
        const currentCentre = currentCard.offsetTop + currentCard.offsetHeight / 2;
        reel.style.setProperty("--reel-shift", `${currentCentre - reel.scrollHeight / 2}px`);
      }
      const index = q<HTMLElement>("#recordIndexS2");
      if (index) index.textContent = `${current + 1} of ${records.length}`;
      // Each record that lands reaches all four tools: the ports light in
      // turn, by colour and opacity only. Alternating the name restarts it.
      if (!reducedMotion.matches && !renderFinal) root.dataset.portPulse = root.dataset.portPulse === "a" ? "b" : "a";
    };
    const nextRecord = () => { current = (current + 1) % records.length; paint(); };
    const stopTimer = () => { if (timer) window.clearInterval(timer); timer = 0; };
    const startTimer = () => { stopTimer(); if (!recordPaused && !renderFinal) timer = window.setInterval(nextRecord, 1800); };
    const updateRecordControls = () => {
      root.dataset.recordPaused = recordPaused ? "true" : "false";
      if (pauseButton) {
        pauseButton.textContent = recordPaused ? "Play" : "Pause";
        pauseButton.setAttribute("aria-pressed", recordPaused ? "true" : "false");
      }
      const state = q<HTMLElement>("#recordStateS2");
      if (state) state.textContent = recordPaused ? "Record paused" : "Live record";
    };
    const toggleRecord = () => { recordPaused = !recordPaused; updateRecordControls(); startTimer(); };
    const manuallyAdvance = () => { nextRecord(); startTimer(); };
    pauseButton?.addEventListener("click", toggleRecord);
    nextButton?.addEventListener("click", manuallyAdvance);
    window.addEventListener("resize", paint);
    cleanups.push(() => pauseButton?.removeEventListener("click", toggleRecord));
    cleanups.push(() => nextButton?.removeEventListener("click", manuallyAdvance));
    cleanups.push(() => window.removeEventListener("resize", paint));
    updateRecordControls();
    paint();
    startTimer();

    const chapters = [...root.querySelectorAll<HTMLElement>(".chapter[data-phase]")];
    const links = [...root.querySelectorAll<HTMLElement>("[data-phase-link]")];
    const sequences = [...root.querySelectorAll<HTMLElement>("[data-steps]")];
    let buildFrame = 0;
    const updateBuild = () => {
      buildFrame = 0;
      const viewportHeight = window.innerHeight;
      let active = chapters[0];
      let nearest = Number.POSITIVE_INFINITY;
      chapters.forEach((chapter) => {
        const rect = chapter.getBoundingClientRect();
        const progress = renderFinal ? 1 : Math.max(0, Math.min(1, (viewportHeight * 0.82 - rect.top) / Math.max(viewportHeight * 0.72, rect.height * 0.62)));
        chapter.style.setProperty("--section-p", progress.toFixed(3));
        chapter.querySelectorAll<HTMLElement>(".instrument").forEach((instrument) => instrument.style.setProperty("--p", progress.toFixed(3)));
        chapter.dataset.build = progress < 0.08 ? "idle" : progress < 0.75 ? "building" : "built";
        const distance = Math.abs(rect.top + rect.height * 0.4 - viewportHeight * 0.5);
        if (distance < nearest) { nearest = distance; active = chapter; }
      });
      // The stepped instruments (the questions, the decision and the levers)
      // light one step at a time as each rises into view, and unlight on the
      // way back. The month (data-steps="reading") lights each step as its
      // own top reaches the reading line instead. Only colour and opacity
      // change, never size or position.
      sequences.forEach((sequence) => {
        const steps = [...sequence.querySelectorAll<HTMLElement>("[data-step]")];
        const rect = sequence.getBoundingClientRect();
        const progress = renderFinal ? 1 : sequence.dataset.steps === "reading"
          ? readingProgress(steps.map((step) => step.getBoundingClientRect().top), viewportHeight * READING_LINE)
          : sequenceProgress(rect.top, rect.height, viewportHeight);
        sequence.style.setProperty("--seq-p", progress.toFixed(3));
        stepStates(progress, steps.length).forEach((state, index) => { steps[index].dataset.stepState = state; });
      });
      links.forEach((link) => {
        if (link.dataset.phaseLink === active?.dataset.phase) link.setAttribute("aria-current", "step");
        else link.removeAttribute("aria-current");
      });
    };
    const requestBuild = () => { if (!buildFrame) buildFrame = window.requestAnimationFrame(updateBuild); };
    // An instrument's rise and a chapter re-centring over the bar's reserve
    // are transitions that finish after the last scroll event, so the build
    // is read again once they settle.
    const settleBuild = (event: TransitionEvent) => {
      if ((event.propertyName === "transform" || event.propertyName === "padding-bottom") && (event.target as HTMLElement).matches(".instrument, .chapter")) requestBuild();
    };
    window.addEventListener("scroll", requestBuild, { passive: true });
    window.addEventListener("resize", requestBuild);
    root.addEventListener("transitionend", settleBuild);
    cleanups.push(() => window.removeEventListener("scroll", requestBuild));
    cleanups.push(() => window.removeEventListener("resize", requestBuild));
    cleanups.push(() => root.removeEventListener("transitionend", settleBuild));

    root.classList.remove("no-js");
    setEvidenceState(requestedState);
    updateBuild();

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      sequences.forEach((sequence) => sequence.querySelectorAll<HTMLElement>("[data-step]").forEach((step) => { delete step.dataset.stepState; }));
      stopTimer();
      if (buildFrame) window.cancelAnimationFrame(buildFrame);
      field?.querySelectorAll(".meaning-node-s2").forEach((node) => node.remove());
      while (svg?.firstChild) svg.removeChild(svg.firstChild);
      while (reel?.firstChild) reel.removeChild(reel.firstChild);
      while (complete?.firstChild) complete.removeChild(complete.firstChild);
    };
  }, [rootRef]);
}

export default function AiBrainLocked() {
  const { briefOpen, briefJourneyKey, openBrief, closeBrief } = useLeadBriefHistory();
  const rootRef = useRef<HTMLDivElement>(null);
  useLockedBrain(rootRef);
  useLockedMotion(rootRef);

  return (
    <MindmakeShell onStart={() => openBrief("brain")} mainClassName="mm-locked-route-main" siteClassName="mm-route-brain" compactFooter>
      <SEO title="Build your AI brain" description="Every AI you can buy already knows the market, and none of them know you. We help you build the one that does, private to you." canonical="/ai-brain" />
      <div ref={rootRef} className="mm-locked-brain no-js" data-evidence-state="loading" dangerouslySetInnerHTML={{ __html: lockedMarkup }} />
      <PairingBridge route="brain" onStart={() => openBrief("brain")} />
      <LeadBrief open={briefOpen} onClose={closeBrief} route="brain" presentation="drawer" journeyKey={briefJourneyKey} />
    </MindmakeShell>
  );
}
