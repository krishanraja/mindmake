import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { track } from "@/lib/analytics";
import readinessFilm from "@/assets/films/sep2026/ready-for-decision-loop-r01-20s-720p-web-sealed.mp4";
import readinessPoster from "../../../../prototypes/website-redesign-recovery/case-study-browsing/media/ready-for-decision-loop-r01-20s-720p-web-sealed-poster.webp";
import "@/styles/mindmake-commercial-decision-balance.css";

export type CommercialDecisionBalanceContext = "leadership" | "editorial" | "brain" | "gtm";

interface CommercialDecisionBalanceProps {
  context: CommercialDecisionBalanceContext;
  onStart: () => void;
}

interface DecisionFrame {
  carry: string;
  human: string;
  version: string;
  proof: string;
}

const READINGS = [
  ["One real decision.", "Name the judgement or capability worth making easier to repeat."],
  ["Evidence prepared.", "Bring the relevant evidence, options and context into one reachable view."],
  ["A working first version.", "Build the smallest useful system around the live decision, not a demonstration."],
  ["Used on real work.", "Test it where the decision already matters and keep the human authority clear."],
  ["The useful system stays.", "You keep the system, its proof and the standards behind it."],
] as const;

const STAGE_NAMES = ["Decision", "Evidence", "First version", "Real work", "Yours"] as const;

const FALLBACK_FRAME: DecisionFrame = {
  carry: "Prepare the relevant evidence, options and repeatable middle of the work.",
  human: "Keep the judgement, approval and standard that make the decision yours.",
  version: "A working first version built around the next real instance.",
  proof: "Use it on the next live case. It works when the useful part becomes easier to repeat without losing the judgement.",
};

const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value));

function normaliseSubject(value: string) {
  return value.trim().replace(/\s+/g, " ").replace(/[.!?]+$/, "");
}

function sentenceSubject(value: string) {
  const subject = normaliseSubject(value);
  if (!subject) return "Your decision";
  return `${subject.charAt(0).toUpperCase()}${subject.slice(1)}`;
}

function frameFor(value: string): DecisionFrame {
  const lower = normaliseSubject(value).toLowerCase();
  if (/build|buy|partner|vendor|make or/.test(lower)) {
    return {
      carry: "Prepare the evidence and compare credible build, buy and hybrid paths against the same criteria.",
      human: "Set the boundary, choose the route and record what would reverse the decision.",
      version: "A working route-comparison instrument built around the real options.",
      proof: "Use it on one live choice. It works when the team can defend the route and its reversal condition.",
    };
  }
  if (/hire|role|team|people|automate|agent/.test(lower)) {
    return {
      carry: "Map the repeated work and compare human, system and hybrid boundaries.",
      human: "Choose where judgement, trust and final authority must remain human.",
      version: "A working responsibility map tested on one real workflow.",
      proof: "Use the same live case across all three boundaries. It works when the necessary human intervention is clear.",
    };
  }
  if (/price|pricing|offer|position|customer|buyer|sales|market|gtm|go.to.market/.test(lower)) {
    return {
      carry: "Bring product changes, buyer language, evidence and live objections into one view.",
      human: "Choose the promise, commercial call and proof you can stand behind.",
      version: "A working commercial instrument built around one live offer.",
      proof: "Put it in front of real buyers. It works when the objections become specific enough to act on.",
    };
  }
  if (/publish|content|brief|research|write|voice/.test(lower)) {
    return {
      carry: "Gather the source material, organise the evidence and prepare a repeatable first pass.",
      human: "Choose the claim, hold the voice and make the final call to publish.",
      version: "A working evidence-to-draft system used on the next real piece.",
      proof: "Run the last finished piece and the next one through the same record. It works when the second needs fewer hand-offs without lowering the standard.",
    };
  }
  return FALLBACK_FRAME;
}

export function CommercialDecisionBalance({ context, onStart }: CommercialDecisionBalanceProps) {
  const rootRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const instrumentRef = useRef<HTMLElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const decisionRef = useRef<HTMLTextAreaElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const startRef = useRef<HTMLButtonElement>(null);
  const pendingTabFocus = useRef<HTMLElement | null>(null);
  const pointerOwned = useRef(false);
  const handoffPending = useRef(false);
  const pagePosition = useRef({ x: 0, y: 0, anchorTop: 0, shellX: 0, shellY: 0 });
  const bodyLock = useRef<null | {
    bodyOverflow: string;
    htmlOverflow: string;
    htmlScrollbarGutter: string;
  }>(null);
  const titleId = useId();
  const readingId = useId();
  const decisionTitleId = useId();
  const decisionErrorId = useId();
  const [activeStage, setActiveStage] = useState(0);
  const [filmAvailable, setFilmAvailable] = useState(true);
  const [dialogStep, setDialogStep] = useState<"input" | "result">("input");
  const [decision, setDecision] = useState("");
  const [generatedDecision, setGeneratedDecision] = useState("");
  const [result, setResult] = useState<DecisionFrame>(FALLBACK_FRAME);
  const [decisionError, setDecisionError] = useState(false);
  const [copyLabel, setCopyLabel] = useState("Copy record");

  const setStage = (next: number, moveFocus = false) => {
    const stage = clamp(next, 0, READINGS.length - 1);
    setActiveStage(stage);
    try { sessionStorage.setItem("mindmake-decision-balance-stage", String(stage)); } catch { /* private mode */ }
    if (moveFocus) {
      window.requestAnimationFrame(() => {
        instrumentRef.current?.querySelector<HTMLButtonElement>(`[data-balance-stage="${stage}"]`)?.focus({ preventScroll: true });
      });
    }
  };

  const focusReliably = (node: HTMLElement | null) => {
    node?.focus({ preventScroll: true });
    window.requestAnimationFrame(() => node?.focus({ preventScroll: true }));
    window.setTimeout(() => node?.focus({ preventScroll: true }), 50);
  };

  const rememberPagePosition = () => {
    const shell = shellRef.current;
    const root = rootRef.current;
    pagePosition.current = {
      x: window.scrollX,
      y: window.scrollY,
      anchorTop: root?.getBoundingClientRect().top || 0,
      shellX: shell?.scrollLeft || 0,
      shellY: shell?.scrollTop || 0,
    };
  };

  const lockPagePosition = () => {
    if (bodyLock.current) return;
    const body = document.body;
    const html = document.documentElement;
    bodyLock.current = {
      bodyOverflow: body.style.overflow,
      htmlOverflow: html.style.overflow,
      htmlScrollbarGutter: html.style.scrollbarGutter,
    };
    html.style.scrollbarGutter = "stable";
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
  };

  const unlockPagePosition = () => {
    const savedStyles = bodyLock.current;
    if (!savedStyles) return;
    const body = document.body;
    const html = document.documentElement;
    body.style.overflow = savedStyles.bodyOverflow;
    html.style.overflow = savedStyles.htmlOverflow;
    html.style.scrollbarGutter = savedStyles.htmlScrollbarGutter;
    bodyLock.current = null;
    window.scrollTo({ left: pagePosition.current.x, top: pagePosition.current.y, behavior: "auto" });
  };

  const restorePagePosition = () => {
    const shell = shellRef.current;
    const saved = pagePosition.current;
    if (shell && (Math.abs(shell.scrollLeft - saved.shellX) >= 1 || Math.abs(shell.scrollTop - saved.shellY) >= 1)) {
      shell.scrollTo({ left: saved.shellX, top: saved.shellY, behavior: "auto" });
    }
    const root = rootRef.current;
    const targetY = root
      ? window.scrollY + root.getBoundingClientRect().top - saved.anchorTop
      : saved.y;
    if (!bodyLock.current && (Math.abs(window.scrollX - saved.x) >= 1 || Math.abs(window.scrollY - targetY) >= 1)) {
      window.scrollTo({ left: saved.x, top: targetY, behavior: "auto" });
    }
  };

  const settlePagePosition = () => {
    restorePagePosition();
    queueMicrotask(restorePagePosition);
    window.requestAnimationFrame(() => {
      restorePagePosition();
      window.requestAnimationFrame(restorePagePosition);
    });
    window.setTimeout(restorePagePosition, 0);
    window.setTimeout(restorePagePosition, 80);
  };

  useEffect(() => {
    try {
      const savedStage = Number.parseInt(sessionStorage.getItem("mindmake-decision-balance-stage") || "0", 10);
      setActiveStage(Number.isFinite(savedStage) ? clamp(savedStage, 0, 4) : 0);
      const savedDecision = sessionStorage.getItem("mindmake-decision-balance-input") || "";
      const complete = sessionStorage.getItem("mindmake-decision-balance-complete") === "true";
      setDecision(savedDecision);
      if (complete && savedDecision) {
        setGeneratedDecision(savedDecision);
        setResult(frameFor(savedDecision));
        setDialogStep("result");
      }
    } catch { /* private mode */ }
  }, []);

  useEffect(() => () => {
    unlockPagePosition();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const compact = window.matchMedia("(max-width: 860px)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (compact.matches || pointerOwned.current) return;
      const rect = root.getBoundingClientRect();
      const travel = Math.max(root.offsetHeight - window.innerHeight, 1);
      setStage(Math.round(clamp(-rect.top / travel, 0, 1) * 4));
    };
    const requestUpdate = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    compact.addEventListener?.("change", requestUpdate);
    update();
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      compact.removeEventListener?.("change", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const desktopVideo = desktopVideoRef.current;
    const mobileVideo = mobileVideoRef.current;
    if (!root || !desktopVideo || !mobileVideo) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 860px)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let visible = false;
    const constrained = () => reducedMotion.matches || Boolean(connection?.saveData) || document.documentElement.dataset.textScale === "200";
    const brainRecordOwnsMotion = () => {
      if (context !== "brain") return false;
      const control = document.querySelector<HTMLElement>("#pauseRecordS2");
      if (!control || getComputedStyle(control).visibility === "hidden") return false;
      const rect = control.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
    };
    const detach = (video: HTMLVideoElement) => {
      video.pause();
      if (video.getAttribute("src")) {
        video.removeAttribute("src");
        video.load();
      }
    };
    const sync = () => {
      const active = compact.matches ? mobileVideo : desktopVideo;
      const inactive = compact.matches ? desktopVideo : mobileVideo;
      detach(inactive);
      if (constrained() || !filmAvailable) {
        detach(active);
        return;
      }
      if (!active.getAttribute("src")) {
        active.src = readinessFilm;
        active.load();
      }
      if (!visible || document.hidden || brainRecordOwnsMotion()) active.pause();
      else active.play().catch(() => undefined);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.12);
      sync();
    }, { threshold: [0, 0.12, 0.35] });
    const onVisibility = () => sync();
    const textScaleObserver = new MutationObserver(sync);
    observer.observe(root);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("scroll", sync, { passive: true });
    compact.addEventListener?.("change", sync);
    reducedMotion.addEventListener?.("change", sync);
    textScaleObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-text-scale"] });
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", sync);
      compact.removeEventListener?.("change", sync);
      reducedMotion.removeEventListener?.("change", sync);
      textScaleObserver.disconnect();
      detach(desktopVideo);
      detach(mobileVideo);
    };
  }, [context, filmAvailable]);

  useEffect(() => {
    const onScroll = () => {
      if (dialogRef.current?.open) window.requestAnimationFrame(restorePagePosition);
    };
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => document.removeEventListener("scroll", onScroll, { capture: true });
  }, []);

  useEffect(() => {
    if (dialogStep !== "input" || !dialogRef.current?.open) return;
    const node = decisionRef.current;
    queueMicrotask(() => node?.focus({ preventScroll: true }));
    const frame = window.requestAnimationFrame(() => node?.focus({ preventScroll: true }));
    const timeout = window.setTimeout(() => node?.focus({ preventScroll: true }), 80);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [dialogStep]);

  const stageKey = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") setStage(0, true);
    else if (event.key === "End") setStage(4, true);
    else setStage(index + (["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1), true);
  };

  const openDecision = () => {
    track("scoping_request", { source: "commercial_decision_balance", context });
    rememberPagePosition();
    setDecisionError(false);
    setCopyLabel("Copy record");
    const complete = Boolean(generatedDecision && generatedDecision === normaliseSubject(decision));
    setDialogStep(complete ? "result" : "input");
    lockPagePosition();
    dialogRef.current?.showModal();
    settlePagePosition();
    focusReliably(complete ? resultHeadingRef.current : decisionRef.current);
  };

  const closeDecision = () => dialogRef.current?.close();

  const frameDecision = () => {
    const value = normaliseSubject(decision);
    if (!value) {
      setDecisionError(true);
      focusReliably(decisionRef.current);
      return;
    }
    const frame = frameFor(value);
    setResult(frame);
    setGeneratedDecision(value);
    setDialogStep("result");
    try {
      sessionStorage.setItem("mindmake-decision-balance-input", value);
      sessionStorage.setItem("mindmake-decision-balance-complete", "true");
    } catch { /* private mode */ }
    focusReliably(resultHeadingRef.current);
  };

  const copyDecision = async () => {
    const record = [
      "Mindmake first decision record",
      `Decision: ${sentenceSubject(generatedDecision)}`,
      `AI can carry: ${result.carry}`,
      `You keep: ${result.human}`,
      `First version: ${result.version}`,
      `First proof: ${result.proof}`,
      "Handback: The working system, this record and the standards behind it.",
      "Scope, duration and fee are agreed privately in writing before work starts.",
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
      .filter((node) => !node.closest("[hidden]") && node.getClientRects().length && getComputedStyle(node).visibility !== "hidden");
    if (!focusable.length) return;
    const current = focusable.indexOf(document.activeElement as HTMLElement);
    const origin = current < 0 ? (event.shiftKey ? 0 : -1) : current;
    const next = (origin + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
    event.preventDefault();
    pendingTabFocus.current = focusable[next] || null;
    pendingTabFocus.current?.focus({ preventScroll: true });
  };

  const modalTabUp = (event: ReactKeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab" || !pendingTabFocus.current) return;
    event.preventDefault();
    pendingTabFocus.current.focus({ preventScroll: true });
    pendingTabFocus.current = null;
  };

  const [readingTitle, readingDetail] = READINGS[activeStage];
  const tilt = -4 + activeStage * 2;

  return (
    <section ref={rootRef} className="mm-decision-balance" data-context={context} aria-labelledby={titleId}>
      <div ref={shellRef} className="mm-decision-balance-shell">
        <section className="mm-decision-balance-offer">
          <div className="mm-decision-balance-mobile-film" aria-hidden="true">
            <video className="mm-decision-balance-film" ref={mobileVideoRef} muted loop playsInline preload="none" poster={readinessPoster} onError={() => setFilmAvailable(false)} />
            <span />
          </div>
          <h2 id={titleId}>Build one useful AI system on real work.</h2>
          <p className="mm-decision-balance-lede">Start with your judgement or your route to market. Both lead to one paid proof.</p>
          <nav className="mm-decision-balance-offer-links" aria-label="Mindmake offers">
            <Link to="/ai-brain"><small>Build your</small><strong>AI brain</strong><i aria-hidden="true">↗</i></Link>
            <Link to="/ai-gtm"><small>Build your</small><strong>AI go-to-market</strong><i aria-hidden="true">↗</i></Link>
          </nav>
          <p className="mm-decision-balance-contract">One real decision or capability becomes a working first version. We use it on real work. You keep the system, its proof and standards.</p>
          <p className="mm-decision-balance-boundary">Scope, duration and fee are agreed privately in writing before work starts.</p>
          <button ref={startRef} className="mm-decision-balance-start" type="button" data-mm-primary onClick={openDecision}>
            <span><strong>Start here</strong><small>Get a first decision record before email</small></span><i aria-hidden="true">→</i>
          </button>
        </section>

        <section
          ref={instrumentRef}
          className="mm-decision-balance-instrument"
          aria-labelledby={readingId}
          style={{ "--balance-stage": activeStage, "--balance-tilt": `${tilt}deg` } as CSSProperties}
        >
          <div className="mm-decision-balance-aperture" aria-hidden="true">
            <video className="mm-decision-balance-film" data-commercial-video ref={desktopVideoRef} muted loop playsInline preload="none" poster={readinessPoster} onError={() => setFilmAvailable(false)} />
            <div />
            <span className="ring-one" /><span className="ring-two" /><span className="ring-three" />
          </div>
          <div className="mm-decision-balance-heading">
            <span aria-hidden="true">{String(activeStage + 1).padStart(2, "0")} / 05</span>
            <h3 id={readingId}>{readingTitle}</h3>
            <p>{readingDetail}</p>
          </div>
          <div className="mm-decision-balance-assembly" aria-hidden="true">
            <span className="suspension" />
            <span className="beam"><i /></span>
            <span className="pivot"><i /></span>
            <span className="pan-line pan-line-left" /><span className="pan-line pan-line-right" />
            <span className="pan pan-left"><b>AI carries</b><small>Evidence · options · repeatable work</small></span>
            <span className="pan pan-right"><b>You keep</b><small>Judgement · authority · standard</small></span>
          </div>
          <div className="mm-decision-balance-range">
            <label htmlFor={`${readingId}-range`}>Move through the proof</label>
            <input
              id={`${readingId}-range`}
              type="range"
              min={0}
              max={4}
              step={1}
              value={activeStage}
              aria-valuetext={`${readingTitle} ${readingDetail}`}
              onPointerDown={() => { pointerOwned.current = true; }}
              onPointerUp={() => { pointerOwned.current = false; }}
              onPointerCancel={() => { pointerOwned.current = false; }}
              onChange={(event) => setStage(Number(event.target.value))}
            />
          </div>
          <div className="mm-decision-balance-stages" role="group" aria-label="Proof readings">
            {STAGE_NAMES.map((name, index) => (
              <button
                key={name}
                type="button"
                className={activeStage === index ? "is-active" : undefined}
                data-balance-stage={index}
                aria-pressed={activeStage === index}
                onClick={() => setStage(index)}
                onKeyDown={(event) => stageKey(event, index)}
              ><span>{String(index + 1).padStart(2, "0")}</span><strong>{name}</strong></button>
            ))}
          </div>
          <p className="mm-decision-balance-film-label">Generated illustration. The decision remains human.</p>
        </section>
      </div>

      <dialog
        ref={dialogRef}
        className="mm-decision-balance-dialog"
        aria-labelledby={decisionTitleId}
        onKeyDown={modalTabKey}
        onKeyUp={modalTabUp}
        onCancel={() => window.requestAnimationFrame(() => focusReliably(startRef.current))}
        onClose={() => {
          const shouldHandoff = handoffPending.current;
          handoffPending.current = false;
          setDecisionError(false);
          setCopyLabel("Copy record");
          if (shouldHandoff) {
            window.requestAnimationFrame(() => {
              unlockPagePosition();
              restorePagePosition();
              window.setTimeout(onStart, 0);
            });
            return;
          }
          focusReliably(startRef.current);
          window.requestAnimationFrame(() => {
            unlockPagePosition();
            restorePagePosition();
            focusReliably(startRef.current);
            window.requestAnimationFrame(restorePagePosition);
          });
          window.setTimeout(() => {
            unlockPagePosition();
            restorePagePosition();
          }, 80);
        }}
        onClick={(event) => { if (event.target === event.currentTarget) closeDecision(); }}
      >
        <div className="mm-decision-balance-dialog-shell">
          <header><p>Start here <span aria-hidden="true">/</span> One real decision</p><button type="button" onClick={closeDecision} aria-label="Close Start here">×</button></header>
          <section className="mm-decision-balance-dialog-input" hidden={dialogStep !== "input"}>
            <div className="mm-decision-balance-dialog-visual" aria-hidden="true"><span /><i /></div>
            <h2 id={decisionTitleId}>What should work better?</h2>
            <label htmlFor={`${decisionTitleId}-input`}>Name one decision or capability.</label>
            <textarea
              ref={decisionRef}
              id={`${decisionTitleId}-input`}
              rows={3}
              value={decision}
              aria-invalid={decisionError || undefined}
              aria-describedby={decisionError ? decisionErrorId : undefined}
              placeholder="For example: decide whether we build or partner"
              onChange={(event) => {
                setDecision(event.target.value);
                setDecisionError(false);
                setGeneratedDecision("");
                try {
                  sessionStorage.setItem("mindmake-decision-balance-input", event.target.value);
                  sessionStorage.removeItem("mindmake-decision-balance-complete");
                } catch { /* private mode */ }
              }}
            />
            <p id={decisionErrorId} className="mm-decision-balance-error" hidden={!decisionError}>Please name the decision or capability first.</p>
            <button className="mm-decision-balance-frame" type="button" onClick={frameDecision}>Make the first record <span aria-hidden="true">→</span></button>
          </section>
          <section className="mm-decision-balance-dialog-result" hidden={dialogStep !== "result"} aria-live="polite">
            <p className="mm-decision-balance-result-mark"><span /> Your first decision record</p>
            <h2 ref={resultHeadingRef} tabIndex={-1}>Your first decision record.</h2>
            <dl>
              <div><dt>Decision</dt><dd>{sentenceSubject(generatedDecision)}</dd></div>
              <div><dt>AI can carry</dt><dd>{result.carry}</dd></div>
              <div><dt>You keep</dt><dd>{result.human}</dd></div>
              <div><dt>First version</dt><dd>{result.version}</dd></div>
              <div><dt>First proof</dt><dd>{result.proof}</dd></div>
              <div><dt>Handback</dt><dd>The working system, this record and the standards behind it.</dd></div>
            </dl>
            <p className="mm-decision-balance-result-boundary">Before work starts, we agree scope, duration and fee privately in writing.</p>
            <div className="mm-decision-balance-result-actions">
              <button type="button" onClick={() => {
                setDialogStep("input");
                setGeneratedDecision("");
                try { sessionStorage.removeItem("mindmake-decision-balance-complete"); } catch { /* private mode */ }
                focusReliably(decisionRef.current);
              }}>Change decision</button>
              <button type="button" onClick={copyDecision}>{copyLabel}</button>
              <button type="button" className="continue" onClick={() => {
                handoffPending.current = true;
                dialogRef.current?.close();
              }}>Keep this and continue <span aria-hidden="true">→</span></button>
            </div>
            <p className="mm-decision-balance-result-note">Email is only needed to keep this record and continue the private brief. Nothing has been sent.</p>
          </section>
        </div>
      </dialog>

      <noscript>
        <style>{`.mm-decision-balance{height:auto!important;min-height:0!important}.mm-decision-balance-shell{position:relative!important;height:auto!important}.mm-decision-balance-range,.mm-decision-balance-stages,.mm-decision-balance-dialog{display:none!important}.mm-decision-balance-instrument{min-height:40rem!important}.mm-decision-balance-aperture video,.mm-decision-balance-mobile-film video{display:none!important}`}</style>
        <ol className="mm-decision-balance-no-js">
          <li>One real decision or capability.</li>
          <li>Evidence and options prepared around it.</li>
          <li>A working first version.</li>
          <li>Used on real work.</li>
          <li>You keep the system, its proof and standards.</li>
        </ol>
      </noscript>
    </section>
  );
}
