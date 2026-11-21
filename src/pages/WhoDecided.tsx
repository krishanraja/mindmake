import { useEffect, useRef, useState } from "react";
import { SEO } from "@/components/SEO";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { STEPS, SUBTITLE, readDecision, type Level } from "@/features/who-decided/audit";
import { DecisionResults } from "@/features/who-decided/DecisionResults";
import { LeadExit } from "@/components/ui/lead-exit";
import "@/styles/mindmake.css";
import "@/styles/who-decided.css";
import "@/styles/who-decided-results.css";

const emptyAnswers = () => STEPS.map(() => null as Level | null);

export default function WhoDecided() {
  const [screen, setScreen] = useState(-1);
  const [answers, setAnswers] = useState(emptyAnswers);
  const [ready, setReady] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const started = useRef(false);
  const step = STEPS[screen];
  const read = screen === STEPS.length ? readDecision(answers) : null;

  const clear = () => {
    setAnswers(emptyAnswers());
    setScreen(-1);
  };

  useEffect(() => {
    setReady(true);
    // A back/forward cache restore must not restore a private decision.
    const forget = () => clear();
    window.addEventListener("pagehide", forget);
    window.addEventListener("pageshow", forget);
    return () => {
      window.removeEventListener("pagehide", forget);
      window.removeEventListener("pageshow", forget);
    };
  }, []);

  useEffect(() => {
    if (!started.current) { started.current = true; return; }
    heading.current?.focus({ preventScroll: true });
    if (window.scrollY) window.scrollTo(0, 0);
  }, [screen]);

  return (
    <MindmakeShell onStart={() => window.location.assign("/?start=1")} showMobileActionBar={false} startLabel="Start your brief" siteClassName="wd-site">
      <SEO title="Measure your AI judgement" description={SUBTITLE} canonical="/measure-your-ai-judgement" noindex />
      <article className="wd-audit mm-container" data-clarity-mask="true" data-screen={screen === -1 ? "intro" : step ? "step" : "read"}>
        {screen === -1 ? (
          <section className="wd-intro wd-min">
            <h1 ref={heading} tabIndex={-1}>Measure your AI judgement</h1>
            <p className="wd-subtitle">{SUBTITLE}</p>
            <button type="button" className="wd-next" disabled={!ready} onClick={() => setScreen(0)}>Begin <span aria-hidden="true">→</span></button>
            <p className="wd-privacy">Private. Nothing you pick leaves this page.</p>
            <noscript><p>Turn on JavaScript to use this private audit. Your answers stay in this page.</p></noscript>
          </section>
        ) : step ? (
          /* Nothing on screen but the question (Krish, 2026-11-19). A tap on an answer moves on. */
          <section className="wd-q" key={step.id} aria-labelledby={`q-${step.id}`}>
            <span className="wd-q-bar" aria-hidden="true"><i style={{ width: `${((screen + 1) / STEPS.length) * 100}%` }} /></span>
            <h1 id={`q-${step.id}`} ref={heading} tabIndex={-1}><span className="sr-only">Question {screen + 1} of {STEPS.length}. </span>{step.question}</h1>
            <div className="wd-q-options" role="group" aria-labelledby={`q-${step.id}`}>
              {step.options.map(option => (
                <button key={option.level} type="button" className="wd-q-option" aria-pressed={answers[screen] === option.level}
                  onClick={() => { setAnswers(previous => previous.map((answer, index) => index === screen ? option.level : answer)); setScreen(screen + 1); }}>
                  {option.text}
                </button>
              ))}
            </div>
            <button type="button" className="wd-q-back" aria-label="Previous question" onClick={() => setScreen(screen - 1)}>←</button>
          </section>
        ) : read ? (
          <DecisionResults read={read} heading={heading} onRevise={() => setScreen(0)} onClear={clear} />
        ) : null}
      </article>
      <LeadExit offers={["modules"]} />
    </MindmakeShell>
  );
}
