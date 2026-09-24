import { useEffect, useRef } from "react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { useLockedMotion } from "@/components/mindmake/locked/useLockedMotion";
import { extractLockedBlock, extractLockedMain, replaceLockedAsset } from "@/components/mindmake/locked/lockedMarkup";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import fixture from "@/data/vnext/brain-fixture.json";
import evidenceFilm from "@/assets/films/sep2026/evidence-connects-loop-r01-20s-720p-web-sealed.mp4";
import lockedDocument from "../../prototypes/website-redesign-recovery/brain-signature/index-s2-motion-s3.html?raw";
import evidencePoster from "../../prototypes/website-redesign-recovery/brain-signature/media/evidence-connects-poster.png";
import "@/styles/mindmake.css";
import "@/styles/mindmake-locked-brain.css";

const selectedId = "BI-003";
const plainStatements: Record<string, string> = {
  "BI-001": "Build systems that help more people make better decisions.",
  "BI-002": "Spot newly possible work before old habits make it obvious.",
  "BI-003": "People stay accountable for work that reaches the outside world.",
  "BI-004": "Repeated clicks, copying and explanation reveal where the system needs work.",
  "BI-005": "Seeing what is possible early can make old ways of working feel painfully slow.",
  "BI-006": "Work with leaders who want to reshape their category, not defend the old one.",
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
  "BI-020": "Help capable people become more discerning, more agentic and less generic.",
};

const evidenceMessages = {
  ready: "Current record. Ten sources connected.",
  loading: "Checking the record. The last known version remains readable.",
  stale: "The source check is older than expected. The last known version remains readable.",
  error: "The source check is unavailable. The last known version remains readable.",
  recovery: "Connection restored. The record is current.",
} as const;

type BrainItem = (typeof fixture.items)[number];

function prepareMarkup() {
  let markup = `${extractLockedMain(lockedDocument)}${extractLockedBlock(lockedDocument, "truth-bar")}`;
  const protectedPhrase = "One decision wakes the whole Brain.";
  if (markup.split(protectedPhrase).length - 1 !== 1) {
    throw new Error("The locked Brain heading changed before its production wrap guard was applied.");
  }
  markup = markup.replace(protectedPhrase, "One decision wakes the whole&nbsp;Brain.");
  markup = replaceLockedAsset(markup, "../../../src/assets/films/sep2026/evidence-connects-loop-r01-20s-720p-web-sealed.mp4", evidenceFilm);
  markup = replaceLockedAsset(markup, "./media/evidence-connects-poster.png", evidencePoster);
  return markup;
}

const lockedMarkup = prepareMarkup();

const humanise = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const plainStanding = (item: BrainItem) => `${item.standing === "accepted" ? "Accepted thinking" : "Working thinking"}, ${item.confidence === "direct" ? "backed by direct evidence" : "supported by the record"}`;

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
    const focusIds = new Set(["BI-003", "BI-007", "BI-010", "BI-018"]);
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
      const standing = q<HTMLElement>("#inspectorStandingS2");
      if (kind) kind.textContent = "What the Brain remembers";
      if (title) title.textContent = item.title;
      if (statement) statement.textContent = plainStatements[item.id] ?? item.statement;
      if (standing) standing.textContent = plainStanding(item);
    };

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
        if (focusIds.has(from.id) && focusIds.has(to.id)) line.classList.add("is-focus");
        svg.append(line);
      });

      fixture.items.forEach((item) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "meaning-node-s2";
        button.dataset.id = item.id;
        button.style.setProperty("--x", `${item.x}%`);
        button.style.setProperty("--y", `${item.y}%`);
        button.setAttribute("aria-label", `${item.title}. ${plainStatements[item.id] ?? item.statement}`);
        button.setAttribute("aria-pressed", item.id === selectedId ? "true" : "false");
        if (item.id === selectedId) button.classList.add("is-active");
        const label = document.createElement("span");
        label.textContent = item.title;
        button.append(label);
        const click = () => selectMeaning(item);
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

    const sourceButton = q<HTMLButtonElement>("#testSourceS2");
    const testSource = () => {
      const testing = root.dataset.sourceTest !== "true";
      root.dataset.sourceTest = testing ? "true" : "false";
      sourceButton?.setAttribute("aria-pressed", testing ? "true" : "false");
      const label = sourceButton?.querySelector("span");
      const hint = sourceButton?.querySelector("b");
      if (label) label.textContent = testing ? "Put the source back" : "Take one source away";
      if (hint) hint.textContent = testing ? "Restore" : "Try it";
      const sourceState = q<HTMLElement>("#sourceOneStateS2");
      const headline = q<HTMLElement>("#proofHeadlineS2");
      const detail = q<HTMLElement>("#proofDetailS2");
      if (sourceState) sourceState.textContent = testing ? "Temporarily removed" : "Connected";
      if (headline) headline.textContent = testing ? "The decision still holds." : "The decision is supported by both sources.";
      if (detail) detail.textContent = testing ? "One source still supports it. Two connected ideas need another look." : "Its connected thinking is clear.";
    };
    sourceButton?.addEventListener("click", testSource);
    cleanups.push(() => sourceButton?.removeEventListener("click", testSource));

    const correctionButton = q<HTMLButtonElement>("#replayCorrectionS2");
    const replayCorrection = () => {
      const replay = root.dataset.correction !== "replay";
      root.dataset.correction = replay ? "replay" : "current";
      correctionButton?.setAttribute("aria-pressed", replay ? "true" : "false");
      const label = correctionButton?.querySelector("span");
      const hint = correctionButton?.querySelector("b");
      if (label) label.textContent = replay ? "Return to the current view" : "Replay the change";
      if (hint) hint.textContent = replay ? "Show now" : "Before → now";
      const status = q<HTMLElement>("#correctionStatusS2");
      if (status) status.textContent = replay ? "The earlier view is back in focus." : "The current view is in focus.";
    };
    correctionButton?.addEventListener("click", replayCorrection);
    cleanups.push(() => correctionButton?.removeEventListener("click", replayCorrection));

    const chapters = [...root.querySelectorAll<HTMLElement>(".chapter[data-phase]")];
    const links = [...root.querySelectorAll<HTMLElement>("[data-phase-link]")];
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
      links.forEach((link) => {
        if (link.dataset.phaseLink === active?.dataset.phase) link.setAttribute("aria-current", "step");
        else link.removeAttribute("aria-current");
      });
    };
    const requestBuild = () => { if (!buildFrame) buildFrame = window.requestAnimationFrame(updateBuild); };
    window.addEventListener("scroll", requestBuild, { passive: true });
    window.addEventListener("resize", requestBuild);
    cleanups.push(() => window.removeEventListener("scroll", requestBuild));
    cleanups.push(() => window.removeEventListener("resize", requestBuild));

    root.dataset.sourceTest = "false";
    root.dataset.correction = "current";
    root.classList.remove("no-js");
    setEvidenceState(requestedState);
    updateBuild();

    return () => {
      cleanups.forEach((cleanup) => cleanup());
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
      <SEO title="Build your AI brain" description="See how one decision becomes remembered, evidenced, corrected and reusable." canonical="/ai-brain" />
      <div ref={rootRef} className="mm-locked-brain no-js" data-evidence-state="loading" dangerouslySetInnerHTML={{ __html: lockedMarkup }} />
      <LeadBrief open={briefOpen} onClose={closeBrief} route="brain" presentation="drawer" journeyKey={briefJourneyKey} />
    </MindmakeShell>
  );
}
