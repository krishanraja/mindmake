import { useEffect, useRef } from "react";
import type { ChangeEvent } from "react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { CommercialDecisionBalance } from "@/components/mindmake/locked/CommercialDecisionBalance";
import { useLockedMotion } from "@/components/mindmake/locked/useLockedMotion";
import { extractLockedMain, removeLockedBlock, replaceLockedAsset } from "@/components/mindmake/locked/lockedMarkup";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import signals from "@/data/vnext/gtm-signals.json";
import quietWorkshopFilm from "@/assets/films/sep2026/quiet-workshop-growth-loop-r01-20s-720p-web-sealed.mp4";
import signalsArriveFilm from "@/assets/films/sep2026/signals-arrive-loop-r01-20s-720p-web-sealed.mp4";
import lockedDocument from "../../prototypes/website-redesign-recovery/gtm-market-change/index-motion.html?raw";
import quietWorkshopPoster from "../../prototypes/website-redesign-recovery/gtm-market-change/media/quiet-workshop-growth-poster.png";
import signalsArrivePoster from "../../prototypes/website-redesign-recovery/gtm-market-change/media/signals-arrive-poster.png";
import "@/styles/mindmake.css";
import "@/styles/mindmake-locked-gtm.css";

const outputKeys = ["product", "price", "positioning", "people"] as const;
const outputNames = ["Product", "Price", "Positioning", "People"] as const;
const shortResponses = ["Subscription", "Completed task", "Verified result"] as const;
const roleModels = [
  {
    product: ["Human sets the roadmap", "AI assists"],
    price: ["Human sets the bundle", "AI stays inside it"],
    positioning: ["Human leads the promise", "AI supports"],
    people: ["Human keeps control", "AI prepares"],
  },
  {
    product: ["Human defines the task", "Agent completes it"],
    price: ["Human sets the limits", "System meters use"],
    positioning: ["Human owns the promise", "Agent shows proof"],
    people: ["Human handles exceptions", "Agent runs the routine"],
  },
  {
    product: ["Human sets the standard", "Agent acts"],
    price: ["Human sets the value", "System verifies"],
    positioning: ["Human owns trust", "Agent proves the result"],
    people: ["Human judges appeals", "Agent improves"],
  },
] as const;

const evidenceStates = {
  ready: { light: "Evidence set", label: "Ready.", copy: "Dated company evidence, with its limit kept visible." },
  stale: { light: "Check overdue", label: "Stale.", copy: "The evidence remains visible, but its review date has passed." },
  quiet: { light: "No new signal", label: "Quiet.", copy: "No newer qualifying source was found. The last dated evidence remains." },
  error: { light: "Refresh failed", label: "Error.", copy: "Current evidence could not be refreshed. This is only a dated worked example." },
  conflicted: { light: "Evidence conflicts", label: "Conflicted.", copy: "Sources point in different directions. Treat the response as a test, not a conclusion." },
} as const;

type SignalKey = keyof typeof signals;
type Response = (typeof signals)[SignalKey]["responses"][number];
type EvidenceState = keyof typeof evidenceStates;

const leafOrigins = [
  { x: 272, y: 182 },
  { x: -330, y: 182 },
  { x: 288, y: -166 },
  { x: -330, y: -166 },
];

function prepareMarkup() {
  let markup = extractLockedMain(lockedDocument);
  markup = removeLockedBlock(markup, "masthead");
  markup = removeLockedBlock(markup, "concept-footer");
  markup = replaceLockedAsset(markup, "../../../src/assets/films/sep2026/quiet-workshop-growth-loop-r01-20s-720p-web-sealed.mp4", quietWorkshopFilm);
  markup = replaceLockedAsset(markup, "../../../src/assets/films/sep2026/signals-arrive-loop-r01-20s-720p-web-sealed.mp4", signalsArriveFilm);
  markup = replaceLockedAsset(markup, "./media/quiet-workshop-growth-poster.png", quietWorkshopPoster);
  markup = replaceLockedAsset(markup, "./media/signals-arrive-poster.png", signalsArrivePoster);
  // The approved surface keeps separate desktop and mobile consequence views.
  // Hide the mobile duplicate in the server render, then expose only the active
  // viewport's copy after hydration so screen readers never receive both.
  markup = markup.replace('id="mobile-copy"', 'id="mobile-copy" aria-hidden="true"');
  return markup;
}

const lockedMarkup = prepareMarkup();

function useLockedGtm(rootRef: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const signalInputs = [...root.querySelectorAll<HTMLInputElement>('input[name="signal"]')];
    const responseInputs = [...root.querySelectorAll<HTMLInputElement>('input[name="response"]')];
    const responseLabels = [...root.querySelectorAll<HTMLElement>(".response-paddle > span:last-child")];
    const leaves = [...root.querySelectorAll<HTMLElement>(".outcome-grid .paper-leaf")];
    const undoButton = root.querySelector<HTMLButtonElement>("#undo");
    const undoLabel = root.querySelector<HTMLElement>("#undo-label");
    const instrument = root.querySelector<HTMLElement>(".instrument");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const forceFinalRender = new URLSearchParams(window.location.search).get("render") === "final";
    const cleanups: Array<() => void> = [];
    let signalKey: SignalKey = "pricing";
    let responseIndex = 1;
    let previousResponseIndex: number | null = null;
    let stageIndex = 0;
    let changeTimer = 0;
    let buildFrame = 0;

    const q = <T extends Element>(selector: string) => root.querySelector<T>(selector);
    const setText = (selector: string, value: string) => {
      const element = q<HTMLElement>(selector);
      if (element) element.textContent = value;
    };
    const selectedSignal = () => signals[signalKey];
    const selectedResponse = () => selectedSignal().responses[responseIndex];

    const syncConsequenceAccessibility = () => {
      const mobile = window.matchMedia("(max-width: 700px)").matches;
      leaves.forEach((leaf) => leaf.setAttribute("aria-hidden", String(mobile)));
      const mobileCopy = q<HTMLElement>("#mobile-copy");
      if (mobileCopy) mobileCopy.setAttribute("aria-hidden", String(!mobile));
    };

    const setBuildProgress = (value: number) => {
      if (!instrument) return;
      const progress = Math.max(0, Math.min(1, value));
      const inverse = 1 - progress;
      instrument.style.setProperty("--build-progress", progress.toFixed(4));
      instrument.style.setProperty("--build-inverse", inverse.toFixed(4));
      instrument.style.setProperty("--build-offset", `${Math.round(inverse * 640)}px`);
      instrument.style.setProperty("--mobile-leaf-y", `${Math.round(inverse * 34)}px`);
      instrument.dataset.build = progress >= 0.985 ? "built" : progress > 0.02 ? "building" : "idle";
      leaves.forEach((leaf, index) => {
        leaf.style.setProperty("--leaf-x", `${Math.round(leafOrigins[index].x * inverse)}px`);
        leaf.style.setProperty("--leaf-y", `${Math.round(leafOrigins[index].y * inverse)}px`);
      });
    };

    const updateScrollBuild = () => {
      buildFrame = 0;
      if (!instrument) return;
      if (reducedMotion.matches || forceFinalRender) {
        setBuildProgress(1);
        return;
      }
      const rect = instrument.getBoundingClientRect();
      const mobile = window.innerWidth <= 700;
      const start = window.innerHeight * (mobile ? 0.94 : 0.88);
      const distance = Math.max(260, window.innerHeight * (mobile ? 0.52 : 0.68));
      setBuildProgress((start - rect.top) / distance);
    };
    const requestScrollBuild = () => {
      if (!buildFrame) buildFrame = window.requestAnimationFrame(updateScrollBuild);
    };

    const renderRoleModel = () => {
      const model = roleModels[responseIndex];
      outputKeys.forEach((key) => {
        setText(`#role-${key}-human`, model[key][0]);
        setText(`#role-${key}-agent`, model[key][1]);
      });
    };

    const renderMobileStage = () => {
      const response = selectedResponse();
      const atTest = stageIndex === outputKeys.length;
      instrument?.classList.toggle("mobile-showing-test", atTest);
      q<HTMLElement>("#test-slip")?.classList.toggle("mobile-visible", atTest);
      if (!atTest) {
        const key = outputKeys[stageIndex];
        setText("#mobile-index", `${String.fromCharCode(65 + stageIndex)} / 04`);
        setText("#mobile-heading", outputNames[stageIndex]);
        setText("#mobile-copy", response[key]);
        setText("#mobile-role-human", roleModels[responseIndex][key][0]);
        setText("#mobile-role-agent", roleModels[responseIndex][key][1]);
      }
      const back = q<HTMLButtonElement>("#stage-back");
      const next = q<HTMLButtonElement>("#stage-next");
      if (back) back.disabled = stageIndex === 0;
      setText("#stage-count", `${stageIndex + 1} of 5`);
      if (!next) return;
      const nextName = stageIndex === outputKeys.length - 1 ? "Customer test" : outputNames[stageIndex + 1];
      next.innerHTML = stageIndex === outputKeys.length
        ? 'Back to Product <span aria-hidden="true">&#8635;</span>'
        : `Next: ${nextName} <span aria-hidden="true">&rarr;</span>`;
      next.setAttribute("aria-label", stageIndex === outputKeys.length ? "Return to the first consequence, Product" : `Show next step, ${nextName}`);
    };

    const markChanges = (previous: Response | null, next: Response, force = false) => {
      window.clearTimeout(changeTimer);
      leaves.forEach((leaf, index) => {
        const key = outputKeys[index];
        leaf.classList.toggle("changed", force || previous?.[key] !== next[key]);
      });
      changeTimer = window.setTimeout(() => leaves.forEach((leaf) => leaf.classList.remove("changed")), 2200);
    };

    const renderResponse = (signalChanged = false) => {
      const signal = selectedSignal();
      const response = selectedResponse();
      const prior = previousResponseIndex === null ? null : signal.responses[previousResponseIndex];
      outputKeys.forEach((key) => setText(`#outcome-${key}`, response[key]));
      setText("#test-title", response.testTitle);
      setText("#test-body", response.testBody);
      setText("#hub-response", shortResponses[responseIndex]);
      renderRoleModel();
      markChanges(prior, response, signalChanged);
      root.classList.add("is-changing");
      window.setTimeout(() => root.classList.remove("is-changing"), 280);
      stageIndex = 0;
      renderMobileStage();
    };

    const renderSignal = () => {
      const signal = selectedSignal();
      setText("#signal-domain", signal.domain);
      setText("#signal-date", signal.date);
      const date = q<HTMLTimeElement>("#signal-date");
      if (date) date.dateTime = signal.isoDate;
      setText("#signal-observation", signal.observation);
      setText("#signal-limit", signal.limit);
      setText("#decision-question", window.matchMedia("(max-width: 700px)").matches ? signal.mobileQuestion : signal.question);
      const source = q<HTMLAnchorElement>("#signal-source");
      if (source) {
        source.href = signal.source;
        if (source.firstChild) source.firstChild.textContent = `Open ${signal.sourceLabel} `;
      }
      responseLabels.forEach((label, index) => { label.textContent = signal.responses[index].name; });
      renderResponse(true);
    };

    const renderUndo = () => {
      if (!undoButton || !undoLabel) return;
      if (previousResponseIndex === null) {
        undoButton.hidden = true;
        return;
      }
      undoLabel.textContent = `Undo: ${selectedSignal().responses[previousResponseIndex].name}`;
      undoButton.hidden = false;
    };

    const requestedState = new URLSearchParams(window.location.search).get("state") as EvidenceState | null;
    const state = requestedState && requestedState in evidenceStates ? requestedState : "ready";
    const evidenceState = evidenceStates[state];
    root.dataset.evidenceState = state;
    const status = q<HTMLElement>(".status-light");
    if (status?.lastChild) status.lastChild.textContent = evidenceState.light;
    const evidence = q<HTMLElement>("#evidence-state");
    if (evidence) evidence.innerHTML = `<strong>${evidenceState.label}</strong> ${evidenceState.copy}`;
    setText("#fixture-status", state === "ready" ? "Worked example" : evidenceState.light);

    signalInputs.forEach((input) => {
      const handler = (event: Event) => {
        signalKey = (event as unknown as ChangeEvent<HTMLInputElement>).target.value as SignalKey;
        previousResponseIndex = null;
        renderSignal();
        renderUndo();
      };
      input.addEventListener("change", handler);
      cleanups.push(() => input.removeEventListener("change", handler));
    });
    responseInputs.forEach((input) => {
      const handler = (event: Event) => {
        previousResponseIndex = responseIndex;
        responseIndex = Number((event.target as HTMLInputElement).value);
        renderResponse();
        renderUndo();
      };
      input.addEventListener("change", handler);
      cleanups.push(() => input.removeEventListener("change", handler));
    });

    const undo = () => {
      if (previousResponseIndex === null) return;
      responseIndex = previousResponseIndex;
      previousResponseIndex = null;
      responseInputs[responseIndex].checked = true;
      renderResponse();
      renderUndo();
      responseInputs[responseIndex].focus();
    };
    undoButton?.addEventListener("click", undo);
    cleanups.push(() => undoButton?.removeEventListener("click", undo));

    const backButton = q<HTMLButtonElement>("#stage-back");
    const nextButton = q<HTMLButtonElement>("#stage-next");
    const back = () => { stageIndex = Math.max(0, stageIndex - 1); renderMobileStage(); };
    const next = () => { stageIndex = stageIndex === outputKeys.length ? 0 : stageIndex + 1; renderMobileStage(); };
    backButton?.addEventListener("click", back);
    nextButton?.addEventListener("click", next);
    cleanups.push(() => backButton?.removeEventListener("click", back));
    cleanups.push(() => nextButton?.removeEventListener("click", next));

    const resize = () => { syncConsequenceAccessibility(); renderSignal(); requestScrollBuild(); };
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", requestScrollBuild, { passive: true });
    reducedMotion.addEventListener?.("change", requestScrollBuild);
    cleanups.push(() => window.removeEventListener("resize", resize));
    cleanups.push(() => window.removeEventListener("scroll", requestScrollBuild));
    cleanups.push(() => reducedMotion.removeEventListener?.("change", requestScrollBuild));

    syncConsequenceAccessibility();
    renderSignal();
    renderUndo();
    root.classList.remove("no-js");
    requestScrollBuild();

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      window.clearTimeout(changeTimer);
      if (buildFrame) window.cancelAnimationFrame(buildFrame);
    };
  }, [rootRef]);
}

export default function AiGtmLocked() {
  const { briefOpen, briefJourneyKey, openBrief, closeBrief } = useLeadBriefHistory();
  const rootRef = useRef<HTMLDivElement>(null);
  useLockedGtm(rootRef);
  useLockedMotion(rootRef);

  return (
    <MindmakeShell onStart={() => openBrief("gtm")} mainClassName="mm-locked-route-main" siteClassName="mm-route-gtm" showMobileActionBar={false} compactFooter>
      <SEO title="Build your AI GTM" description="See how one market change alters product, price, positioning and people before you commit." canonical="/ai-gtm" />
      <div ref={rootRef} className="mm-locked-gtm no-js" data-evidence-state="ready">
        <div className="page-shell" dangerouslySetInnerHTML={{ __html: lockedMarkup }} />
      </div>
      <CommercialDecisionBalance context="gtm" onStart={() => openBrief("gtm")} />
      <LeadBrief open={briefOpen} onClose={closeBrief} route="gtm" presentation="drawer" journeyKey={briefJourneyKey} />
    </MindmakeShell>
  );
}
