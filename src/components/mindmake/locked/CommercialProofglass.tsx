import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { track } from "@/lib/analytics";
import readinessFilm from "@/assets/films/sep2026/ready-for-decision-loop-r01-20s-720p-web-sealed.mp4";
import readinessPoster from "../../../../prototypes/website-redesign-recovery/case-study-browsing/media/ready-for-decision-loop-r01-20s-720p-web-sealed-poster.webp";
import "@/styles/mindmake-commercial-proofglass.css";

export type CommercialProofglassContext = "leadership" | "editorial" | "brain" | "gtm";

interface CommercialProofglassProps {
  context: CommercialProofglassContext;
  onStart: () => void;
}

interface ProofRecord {
  short: string;
  outcome: string;
  result: string;
  stages: [string, string, string, string, string];
  quote: string;
  attribution: string;
  record: string;
  href: string;
}

interface DecisionFrame {
  carry: string;
  human: string;
  proof: string;
}

const STAGE_NAMES = ["Starting point", "The call", "The system carried", "The leader kept", "Recorded change"] as const;
const STAGE_POSITIONS = [10, 30, 50, 70, 90] as const;

const RECORDS: ProofRecord[] = [
  {
    short: "Publishing",
    outcome: "Days → under an hour",
    result: "Roughly monthly → most days",
    stages: [
      "Research took days. Publishing happened roughly monthly.",
      "Build a voice-first system the founder could own.",
      "Research, structure and repeatable production.",
      "Voice, evidence standard and the final call to publish.",
      "Under an hour. Most days. The founder kept the system.",
    ],
    quote: "I used to post once a month; now it's most days because I focus on building an AI engine.",
    attribution: "Founder, research and content brand",
    record: "R-05",
    href: "/case-studies#record-own-system",
  },
  {
    short: "Vendors",
    outcome: "14 vendors → 3 decisions",
    result: "Own team · no new hires",
    stages: [
      "Fourteen vendors. No defensible board position.",
      "Judge every option against the actual P&L.",
      "One editorial-ops workflow, built by the team.",
      "Kill, build or pause, with a written rationale.",
      "Three decisions. The team shipped with no new hires.",
    ],
    quote: "Our team took ownership and accountability.",
    attribution: "Head of Operations, top-10 US digital publisher",
    record: "R-02",
    href: "/case-studies#record-team-decides",
  },
  {
    short: "Decision",
    outcome: "Two quarters → one day",
    result: "Partner now · review build later",
    stages: [
      "Two quarters spent refereeing build versus partner.",
      "Pressure-test the logic together in one room.",
      "Evidence and options prepared for comparison.",
      "Partner now. Review build when the data is stronger.",
      "One day to decide. Agreement signed the next month.",
    ],
    quote: "He doesn't want to loiter.",
    attribution: "CRO, media company",
    record: "R-08",
    href: "/case-studies#record-day-one",
  },
  {
    short: "System",
    outcome: "11 of 14 stopped",
    result: "First system live · inside 90 days",
    stages: [
      "Fourteen tools. No mandate. Budget at risk.",
      "Tie every AI choice to a P&L line.",
      "Three approved tools and one working workflow.",
      "Executive approval, business fit and release.",
      "Eleven stopped. First system live inside 90 days.",
    ],
    quote: "Problems that match our business goals and leadership needs came together in a very thoughtful program.",
    attribution: "President, legacy broadcast business",
    record: "R-03",
    href: "/case-studies#record-business-first",
  },
];

const FRAMES = {
  publishing: {
    pattern: /publish|content|research|editorial|article|post|newsletter|writing/i,
    carry: "Gather the source material, preserve the evidence trail and prepare the repeatable first draft.",
    human: "Choose the claim, the standard and whether the work is ready to leave the building.",
    proof: "Run the last finished piece and the next one through the same record. It works when the second needs fewer hand-offs without lowering the standard.",
  },
  tools: {
    pattern: /tool|vendor|stack|software|platform|licen[cs]e/i,
    carry: "Map the tools against the repeated work and make the overlaps visible.",
    human: "Choose which capability matters, which risk is acceptable and what stops.",
    proof: "Put one useful workflow live, then remove the tools it makes redundant.",
  },
  commercial: {
    pattern: /sales|offer|market|gtm|buyer|customer|pricing|revenue|commercial/i,
    carry: "Bring the current promise, buyer language, objections and evidence into one view.",
    human: "Choose the buyer decision the offer must make easier and the proof that earns it.",
    proof: "Test one offer with real buyers and keep the objections in the record.",
  },
  decision: {
    pattern: /build|partner|decision|govern|invest|buy|make|hire/i,
    carry: "Prepare the evidence, constraints and credible options for comparison.",
    human: "Set the decision boundary, make the call and name what would change it.",
    proof: "Replay the next live choice against the written rationale and the evidence that supported it.",
  },
  fallback: {
    pattern: /.*/,
    carry: "Hold the evidence and the repeatable middle of the work in one reachable record.",
    human: "Set the standard, make the consequential choice and own the exception.",
    proof: "Use it on the next real case. It works when another person can repeat the useful part without losing the judgement.",
  },
} as const;

function decisionFrame(value: string): DecisionFrame {
  const lower = value.toLowerCase();
  const buildSubjectMatch = value.match(/\bbuild\s+(.+?)\s+or\s+(?:buy|purchase|partner|outsource)\b/i);
  const rawSubject = buildSubjectMatch?.[1]?.trim();
  const subject = rawSubject && !/^(ourselves|it|one|in[- ]house)$/i.test(rawSubject) ? rawSubject : "the capability";
  const hireSubjectMatch = value.match(/\bhire\s+(.+?)(?=,|\s+or\s+(?:automate|use)\b)/i);
  const hireSubject = hireSubjectMatch?.[1]?.trim() || "the role";

  if (/\bbuild\b/.test(lower) && /\b(buy|purchase|platform)\b/.test(lower)) {
    return {
      carry: `Compare build, buy and hybrid paths for ${subject} against speed, total cost, team capability, control and reversibility.`,
      human: "Weight those trade-offs, decide what must remain leader-owned and name the evidence that would reopen the call.",
      proof: "Score one credible build route, one live buy route and one thin hybrid pilot against the same criteria. It works when the team can explain why the chosen route wins and what would reverse it.",
    };
  }
  if (/\bbuild\b/.test(lower) && /\b(partner|specialist|outsource)\b/.test(lower)) {
    return {
      carry: `Compare build, partner and hybrid paths for ${subject} against speed, total cost, capability transfer, dependency and reversibility.`,
      human: "Choose what must remain leader-owned, what a partner may carry and the evidence that would reopen the call.",
      proof: "Put one credible build route, one live partner route and one bounded hybrid pilot through the same criteria. It works when the team can defend the boundary and the reversal condition.",
    };
  }
  if (/\bhire\b/.test(lower) && /\b(automate|agent|ai)\b/.test(lower)) {
    return {
      carry: `Compare hiring ${hireSubject}, automating the repeated work and a hybrid path against judgement, repeatability, risk and operating load.`,
      human: "Choose where human judgement must remain, where the system may act and what evidence would change that boundary.",
      proof: "Run the same live case through human-only, system-only and hybrid boundaries. It works when the necessary human intervention is clear and the repeated work becomes easier to carry.",
    };
  }
  return FRAMES.decision;
}

function matchingFrame(value: string): DecisionFrame {
  if (FRAMES.decision.pattern.test(value)) return decisionFrame(value);
  return [FRAMES.publishing, FRAMES.tools, FRAMES.commercial, FRAMES.fallback]
    .find((frame) => frame.pattern.test(value)) || FRAMES.fallback;
}

const clamp = (number: number, minimum: number, maximum: number) => Math.min(Math.max(number, minimum), maximum);

export function CommercialProofglass({ context, onStart }: CommercialProofglassProps) {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const decisionRef = useRef<HTMLTextAreaElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const startRef = useRef<HTMLButtonElement>(null);
  const dragRailRef = useRef<HTMLElement | null>(null);
  const pendingTabFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const recordTitleId = useId();
  const [activeRecord, setActiveRecord] = useState(0);
  const [stages, setStages] = useState([0, 0, 0, 0]);
  const [filmPaused, setFilmPaused] = useState(false);
  const [filmAvailable, setFilmAvailable] = useState(true);
  const [filmAttached, setFilmAttached] = useState(false);
  const [dialogStep, setDialogStep] = useState<"input" | "result">("input");
  const [decision, setDecision] = useState("");
  const [generatedDecision, setGeneratedDecision] = useState("");
  const [result, setResult] = useState<DecisionFrame>(FRAMES.fallback);
  const [decisionError, setDecisionError] = useState(false);
  const [copyLabel, setCopyLabel] = useState("Copy this record");

  const focusReliably = (node: HTMLElement | null) => {
    node?.focus({ preventScroll: true });
    window.requestAnimationFrame(() => node?.focus({ preventScroll: true }));
    window.setTimeout(() => node?.focus({ preventScroll: true }), 50);
  };

  const setStage = (recordIndex: number, stageIndex: number, moveFocus = false) => {
    const next = clamp(stageIndex, 0, STAGE_NAMES.length - 1);
    setStages((current) => current.map((stage, index) => index === recordIndex ? next : stage));
    try { sessionStorage.setItem(`mindmake-proofglass-production-stage-${recordIndex}`, String(next)); } catch { /* private mode */ }
    if (moveFocus) {
      window.requestAnimationFrame(() => {
        rootRef.current?.querySelector<HTMLButtonElement>(`[data-proof-record="${recordIndex}"] [data-proof-stage="${next}"]`)?.focus({ preventScroll: true });
      });
    }
  };

  const chooseRecord = (index: number, moveFocus = false) => {
    const next = clamp(index, 0, RECORDS.length - 1);
    setActiveRecord(next);
    try { sessionStorage.setItem("mindmake-proofglass-production-record", String(next)); } catch { /* private mode */ }
    if (moveFocus) {
      window.requestAnimationFrame(() => {
        const mobile = window.matchMedia("(max-width: 860px)").matches;
        const selector = mobile ? `[data-proof-jump="${next}"]` : `[data-proof-record-trigger="${next}"]`;
        rootRef.current?.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true });
      });
    }
  };

  useEffect(() => {
    try {
      const savedRecord = Number.parseInt(sessionStorage.getItem("mindmake-proofglass-production-record") || "0", 10);
      setActiveRecord(Number.isFinite(savedRecord) ? clamp(savedRecord, 0, 3) : 0);
      setStages(RECORDS.map((_, index) => {
        const saved = Number.parseInt(sessionStorage.getItem(`mindmake-proofglass-production-stage-${index}`) || "0", 10);
        return Number.isFinite(saved) ? clamp(saved, 0, 4) : 0;
      }));
      setDecision(sessionStorage.getItem("mindmake-proofglass-production-decision") || "");
    } catch { /* private mode */ }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    let frame = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 860px)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const constrained = () => reduceMotion.matches || Boolean(connection?.saveData) || document.documentElement.dataset.textScale === "200";
    const update = () => {
      frame = 0;
      if (compact.matches || constrained()) {
        stage.style.setProperty("--proof-sheet-y", "0%");
        stage.style.setProperty("--proof-copy-opacity", "1");
        return;
      }
      const rect = root.getBoundingClientRect();
      const travel = Math.max(root.offsetHeight - window.innerHeight, 1);
      const progress = clamp(-rect.top / travel, 0, 1);
      const sheetProgress = clamp(progress / 0.42, 0, 1);
      const reasoningProgress = clamp((progress - 0.42) / 0.58, 0, 1);
      stage.style.setProperty("--proof-sheet-y", `${(1 - sheetProgress) * 74}%`);
      stage.style.setProperty("--proof-copy-opacity", String(1 - sheetProgress * 0.38));
      setStage(activeRecord, progress >= 0.42 ? Math.round(reasoningProgress * 4) : 0);
    };
    const requestUpdate = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    reduceMotion.addEventListener?.("change", requestUpdate);
    compact.addEventListener?.("change", requestUpdate);
    const textScaleObserver = new MutationObserver(requestUpdate);
    textScaleObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-text-scale"] });
    update();
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reduceMotion.removeEventListener?.("change", requestUpdate);
      compact.removeEventListener?.("change", requestUpdate);
      textScaleObserver.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [activeRecord]);

  useEffect(() => {
    const stage = stageRef.current;
    const video = videoRef.current;
    if (!stage || !video) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let surfaceVisible = false;
    const constrained = () => reduceMotion.matches || Boolean(connection?.saveData) || document.documentElement.dataset.textScale === "200";
    const brainRecordControlVisible = () => {
      if (context !== "brain") return false;
      const control = document.querySelector<HTMLElement>("#pauseRecordS2");
      if (!control || getComputedStyle(control).visibility === "hidden") return false;
      const rect = control.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
    };
    const sync = () => {
      if (constrained() || !filmAvailable) {
        video.pause();
        video.removeAttribute("src");
        video.load();
        setFilmAttached(false);
        return;
      }
      if (!surfaceVisible || document.hidden || brainRecordControlVisible()) {
        video.pause();
        return;
      }
      if (!video.getAttribute("src")) {
        video.src = readinessFilm;
        video.load();
        setFilmAttached(true);
      }
      if (!filmPaused) video.play().catch(() => undefined);
    };
    const observer = new IntersectionObserver(([entry]) => {
      surfaceVisible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.28);
      if (!surfaceVisible || document.hidden || filmPaused) video.pause();
      else sync();
    }, { threshold: [0, 0.28, 0.5] });
    const onVisibility = () => document.hidden ? video.pause() : sync();
    observer.observe(stage);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("scroll", sync, { passive: true });
    reduceMotion.addEventListener?.("change", sync);
    const textScaleObserver = new MutationObserver(sync);
    textScaleObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-text-scale"] });
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", sync);
      reduceMotion.removeEventListener?.("change", sync);
      textScaleObserver.disconnect();
      video.pause();
    };
  }, [context, filmAvailable, filmPaused]);

  const recordKey = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") chooseRecord(0, true);
    else if (event.key === "End") chooseRecord(RECORDS.length - 1, true);
    else chooseRecord((index + (event.key === "ArrowDown" ? 1 : -1) + RECORDS.length) % RECORDS.length, true);
  };

  const jumpKey = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") chooseRecord(0, true);
    else if (event.key === "End") chooseRecord(RECORDS.length - 1, true);
    else chooseRecord((index + (event.key === "ArrowRight" ? 1 : -1) + RECORDS.length) % RECORDS.length, true);
  };

  const stageKey = (event: ReactKeyboardEvent<HTMLButtonElement>, recordIndex: number, stageIndex: number) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") setStage(recordIndex, 0, true);
    else if (event.key === "End") setStage(recordIndex, 4, true);
    else setStage(recordIndex, (stageIndex + (event.key === "ArrowRight" ? 1 : -1) + 5) % 5, true);
  };

  const glassKey = (event: ReactKeyboardEvent<HTMLButtonElement>, recordIndex: number) => {
    const keys = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") setStage(recordIndex, 0);
    else if (event.key === "End") setStage(recordIndex, 4);
    else setStage(recordIndex, stages[recordIndex] + (["ArrowRight", "ArrowUp", "PageUp"].includes(event.key) ? 1 : -1));
  };

  const stageFromPointer = (rail: HTMLElement, clientX: number) => {
    const grid = rail.querySelector<HTMLElement>(".mm-proofglass-stage-grid");
    if (!grid) return 0;
    const bounds = grid.getBoundingClientRect();
    const left = bounds.left + bounds.width * 0.1;
    const right = bounds.left + bounds.width * 0.9;
    return Math.round(clamp((clientX - left) / Math.max(right - left, 1), 0, 1) * 4);
  };

  const startDrag = (event: ReactPointerEvent<HTMLButtonElement>, recordIndex: number) => {
    if (event.button !== 0 && event.pointerType !== "touch") return;
    const rail = event.currentTarget.closest<HTMLElement>(".mm-proofglass-rail");
    if (!rail) return;
    dragRailRef.current = rail;
    event.currentTarget.setPointerCapture(event.pointerId);
    rail.dataset.dragging = "true";
    setStage(recordIndex, stageFromPointer(rail, event.clientX));
  };

  const moveDrag = (event: ReactPointerEvent<HTMLButtonElement>, recordIndex: number) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId) || !dragRailRef.current) return;
    setStage(recordIndex, stageFromPointer(dragRailRef.current, event.clientX));
  };

  const finishDrag = (event: ReactPointerEvent<HTMLButtonElement>, recordIndex: number) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId) || !dragRailRef.current) return;
    setStage(recordIndex, stageFromPointer(dragRailRef.current, event.clientX));
    event.currentTarget.releasePointerCapture(event.pointerId);
    delete dragRailRef.current.dataset.dragging;
    dragRailRef.current = null;
  };

  const openDecision = () => {
    track("scoping_request", { source: "commercial_proofglass", context });
    setDecisionError(false);
    setCopyLabel("Copy this record");
    setDialogStep(generatedDecision && generatedDecision === decision.trim() ? "result" : "input");
    dialogRef.current?.showModal();
    focusReliably(generatedDecision && generatedDecision === decision.trim() ? resultHeadingRef.current : decisionRef.current);
  };

  const closeDecision = () => dialogRef.current?.close();

  const frameDecision = () => {
    const value = decision.trim();
    if (!value) {
      setDecisionError(true);
      focusReliably(decisionRef.current);
      return;
    }
    setResult(matchingFrame(value));
    setGeneratedDecision(value);
    setDialogStep("result");
    focusReliably(resultHeadingRef.current);
  };

  const copyDecision = async () => {
    const record = [
      `Starting point: ${generatedDecision}`,
      `AI can carry: ${result.carry}`,
      `You keep: ${result.human}`,
      `First proof: ${result.proof}`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(record);
      setCopyLabel("Record copied");
    } catch {
      setCopyLabel("Select and copy the record");
    }
  };

  const modalTabKey = (event: ReactKeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = [...dialog.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')]
      .filter((node) => !node.hidden && node.getClientRects().length && getComputedStyle(node).visibility !== "hidden");
    if (!focusable.length) return;
    const current = focusable.indexOf(document.activeElement as HTMLElement);
    const origin = current < 0 ? (event.shiftKey ? 0 : -1) : current;
    const next = (origin + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
    event.preventDefault();
    event.stopPropagation();
    pendingTabFocus.current = focusable[next] || null;
    pendingTabFocus.current?.focus({ preventScroll: true });
  };

  const modalTabUp = (event: ReactKeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab" || !pendingTabFocus.current) return;
    event.preventDefault();
    pendingTabFocus.current.focus({ preventScroll: true });
    pendingTabFocus.current = null;
  };

  return (
    <section ref={rootRef} className="mm-proofglass" data-context={context} aria-labelledby={titleId}>
      <div className="mm-proofglass-stage" ref={stageRef} style={{ "--proof-sheet-y": "74%", "--proof-copy-opacity": 1 } as CSSProperties}>
        <video
          ref={videoRef}
          className="mm-proofglass-film"
          muted
          loop
          playsInline
          preload="none"
          poster={readinessPoster}
          data-commercial-video="true"
          aria-hidden="true"
          onError={() => setFilmAvailable(false)}
        />
        <div className="mm-proofglass-film-shade" aria-hidden="true" />

        <div className="mm-proofglass-arrival">
          <p className="mm-proofglass-audience">For founders, principals, portfolio owners and senior commercial leaders</p>
          <h2 id={titleId}>Leader-owned AI, <span>built on real work.</span></h2>
          <p className="mm-proofglass-offer">Build an AI brain or AI-native go-to-market system around one consequential decision or capability. Use the working first version. Keep what works.</p>
          <nav className="mm-proofglass-doors" aria-label="Mindmake offers">
            <Link to="/ai-brain"><small>Build your</small><strong>AI brain</strong><i aria-hidden="true">↗</i></Link>
            <Link to="/ai-gtm"><small>Build your</small><strong>AI go-to-market</strong><i aria-hidden="true">↗</i></Link>
          </nav>
          <div className="mm-proofglass-actions">
            <button ref={startRef} className="mm-proofglass-start" type="button" data-mm-primary onClick={openDecision}>
              <span><strong>Start here</strong><small>Frame one real decision</small></span><i aria-hidden="true">→</i>
            </button>
            <button
              className="mm-proofglass-film-toggle"
              type="button"
              aria-pressed={filmPaused}
              hidden={!filmAttached || !filmAvailable}
              onClick={() => {
                const video = videoRef.current;
                if (!video) return;
                if (video.paused) { video.play().catch(() => undefined); setFilmPaused(false); }
                else { video.pause(); setFilmPaused(true); }
              }}
            >{filmPaused ? "Play film" : "Pause film"}</button>
          </div>
          <p className="mm-proofglass-path"><span>One client record</span><strong>Pressure → call → system → judgement → change</strong></p>
        </div>

        <section className="mm-proofglass-sheet" id="client-record" tabIndex={-1} aria-labelledby={recordTitleId}>
          <header className="mm-proofglass-heading">
            <div><p>The client record</p><h2 id={recordTitleId}>Inspect what <span>changed.</span></h2></div>
            <Link to="/case-studies">All eight stories <span aria-hidden="true">↗</span></Link>
          </header>

          <nav className="mm-proofglass-record-switch" role="tablist" aria-label="Choose a client record">
            {RECORDS.map((record, index) => (
              <button
                key={record.record}
                type="button"
                role="tab"
                aria-selected={index === activeRecord}
                data-proof-jump={index}
                onClick={() => chooseRecord(index)}
                onKeyDown={(event) => jumpKey(event, index)}
              ><span>{String(index + 1).padStart(2, "0")}</span>{record.short}</button>
            ))}
          </nav>

          <div className="mm-proofglass-records" role="list">
            {RECORDS.map((record, recordIndex) => {
              const active = recordIndex === activeRecord;
              const stage = stages[recordIndex];
              return (
                <article
                  className={`mm-proofglass-record${active ? " is-active" : ""}`}
                  data-proof-record={recordIndex}
                  role="listitem"
                  key={record.record}
                >
                  <button
                    className="mm-proofglass-record-trigger"
                    data-proof-record-trigger={recordIndex}
                    type="button"
                    aria-expanded={active}
                    aria-controls={`proof-record-${recordIndex}`}
                    onClick={() => chooseRecord(recordIndex)}
                    onKeyDown={(event) => recordKey(event, recordIndex)}
                  >
                    <span className="mm-proofglass-number">{String(recordIndex + 1).padStart(2, "0")}</span>
                    <span className="mm-proofglass-outcome">{record.outcome}</span>
                    <span className="mm-proofglass-result">{record.result}</span>
                    <span className="mm-proofglass-state" aria-hidden="true" />
                  </button>
                  <div className="mm-proofglass-record-body" id={`proof-record-${recordIndex}`} hidden={!active}>
                    <div className="mm-proofglass-rail" style={{ "--proof-stage-x": `${STAGE_POSITIONS[stage]}%` } as CSSProperties}>
                      <span className="mm-proofglass-line" aria-hidden="true" />
                      <button
                        className="mm-proofglass-lens"
                        type="button"
                        role="slider"
                        aria-label={`Inspect the ${record.short.toLowerCase()} record`}
                        aria-valuemin={1}
                        aria-valuemax={5}
                        aria-valuenow={stage + 1}
                        aria-valuetext={STAGE_NAMES[stage]}
                        onKeyDown={(event) => glassKey(event, recordIndex)}
                        onPointerDown={(event) => startDrag(event, recordIndex)}
                        onPointerMove={(event) => moveDrag(event, recordIndex)}
                        onPointerUp={(event) => finishDrag(event, recordIndex)}
                        onPointerCancel={(event) => {
                          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
                          if (dragRailRef.current) delete dragRailRef.current.dataset.dragging;
                          dragRailRef.current = null;
                        }}
                      ><span>{String(stage + 1).padStart(2, "0")}</span><i aria-hidden="true" /></button>
                      <div className="mm-proofglass-stage-grid" role="tablist" aria-label={`${record.short} decision record`}>
                        {record.stages.map((meaning, stageIndex) => (
                          <button
                            key={STAGE_NAMES[stageIndex]}
                            type="button"
                            role="tab"
                            aria-selected={stageIndex === stage}
                            aria-label={`${STAGE_NAMES[stageIndex]}. ${meaning}`}
                            tabIndex={stageIndex === stage ? 0 : -1}
                            data-proof-stage={stageIndex}
                            onClick={() => setStage(recordIndex, stageIndex)}
                            onKeyDown={(event) => stageKey(event, recordIndex, stageIndex)}
                          ><small>{STAGE_NAMES[stageIndex]}</small><span>{meaning}</span></button>
                        ))}
                      </div>
                    </div>
                    <footer className="mm-proofglass-basis">
                      <blockquote>“{record.quote}” <cite>{record.attribution}</cite></blockquote>
                      <p><strong>{record.record}</strong><span>Public wording approved · organisation withheld by agreement</span><Link to={record.href}>Full record ↗</Link></p>
                    </footer>
                  </div>
                </article>
              );
            })}
          </div>
          <footer className="mm-proofglass-foot"><span>Generated film · illustrative, never evidence</span><span>Client wording approved · organisations withheld by agreement</span></footer>
        </section>
      </div>

      <dialog
        ref={dialogRef}
        className="mm-proofglass-preflight"
        aria-labelledby="proofglass-preflight-title"
        onKeyDown={modalTabKey}
        onKeyUp={modalTabUp}
        onClose={() => {
          setDecisionError(false);
          setCopyLabel("Copy this record");
          focusReliably(startRef.current);
        }}
        onClick={(event) => { if (event.target === event.currentTarget) closeDecision(); }}
      >
        <div className="mm-proofglass-preflight-shell">
          <header><p>Start here <span aria-hidden="true">/</span> One real decision</p><button type="button" onClick={closeDecision} aria-label="Close Start here">×</button></header>
          <section className="mm-proofglass-preflight-input" hidden={dialogStep !== "input"}>
            <p className="mm-proofglass-step-count">A useful frame before email</p>
            <h2 id="proofglass-preflight-title">Name the decision.</h2>
            <label htmlFor="proofglass-decision">One sentence.</label>
            <textarea
              ref={decisionRef}
              id="proofglass-decision"
              rows={3}
              value={decision}
              aria-invalid={decisionError || undefined}
              aria-describedby={decisionError ? "proofglass-decision-error" : undefined}
              placeholder="For example: decide whether we build or partner"
              onChange={(event) => {
                setDecision(event.target.value);
                setDecisionError(false);
                try { sessionStorage.setItem("mindmake-proofglass-production-decision", event.target.value); } catch { /* private mode */ }
              }}
            />
            <p id="proofglass-decision-error" className="mm-proofglass-input-error" hidden={!decisionError}>Please name the decision or capability first.</p>
            <button className="mm-proofglass-frame" type="button" onClick={frameDecision}>Frame the first move <span aria-hidden="true">→</span></button>
          </section>
          <section className="mm-proofglass-preflight-result" hidden={dialogStep !== "result"} aria-live="polite">
            <p className="mm-proofglass-step-count">Your first decision record</p>
            <h2 ref={resultHeadingRef} tabIndex={-1}><span>This decision</span> has a testable edge.</h2>
            <dl>
              <div><dt>Starting point</dt><dd>{generatedDecision}</dd></div>
              <div><dt>AI can carry</dt><dd>{result.carry}</dd></div>
              <div><dt>You keep</dt><dd>{result.human}</dd></div>
              <div><dt>First proof</dt><dd>{result.proof}</dd></div>
            </dl>
            <div className="mm-proofglass-result-actions">
              <button type="button" onClick={() => { setDialogStep("input"); setGeneratedDecision(""); focusReliably(decisionRef.current); }}>Change decision</button>
              <button type="button" onClick={copyDecision}>{copyLabel}</button>
              <button
                type="button"
                className="mm-proofglass-continue"
                onClick={() => {
                  dialogRef.current?.close();
                  window.setTimeout(onStart, 0);
                }}
              >Continue to private brief <span aria-hidden="true">→</span></button>
            </div>
            <p className="mm-proofglass-result-note">Email verification is next. Nothing has been sent.</p>
          </section>
        </div>
      </dialog>

      <noscript><style>{`.mm-proofglass-record{display:block!important;overflow:visible!important}.mm-proofglass-record-body[hidden]{display:block!important}.mm-proofglass-record-switch,.mm-proofglass-lens,.mm-proofglass-line,.mm-proofglass-preflight{display:none!important}.mm-proofglass{height:auto!important;min-height:0!important}.mm-proofglass-stage{position:relative!important;height:auto!important;min-height:0!important;overflow:visible!important}.mm-proofglass-sheet{position:relative!important;inset:auto!important;transform:none!important}.mm-proofglass-stage-grid{grid-template-columns:1fr!important;padding:0!important}.mm-proofglass-stage-grid>button{min-height:0!important;padding:16px 0!important;text-align:left!important;pointer-events:none!important}.mm-proofglass-stage-grid>button::before{display:none!important}.mm-proofglass-stage-grid small,.mm-proofglass-stage-grid span{position:static!important;display:block!important;padding:0!important;text-align:left!important}`}</style></noscript>
    </section>
  );
}
