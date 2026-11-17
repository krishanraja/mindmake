import { useEffect, useRef, useState } from "react";
import { SEO } from "@/components/SEO";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { FACTS, STEPS, SUBTITLE, THESIS, readDecision, type Level } from "@/features/who-decided/audit";
import "@/styles/mindmake.css";
import "@/styles/who-decided.css";

const emptyAnswers = () => STEPS.map(() => null as Level | null);
const emptyNotes = () => STEPS.map(() => "");

export default function WhoDecided() {
  const [screen, setScreen] = useState(-1);
  const [answers, setAnswers] = useState(emptyAnswers);
  const [notes, setNotes] = useState(emptyNotes);
  const [clearing, setClearing] = useState(false);
  const [ready, setReady] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const started = useRef(false);
  const step = STEPS[screen];
  const read = screen === STEPS.length ? readDecision(answers) : null;

  const clear = () => {
    setAnswers(emptyAnswers());
    setNotes(emptyNotes());
    setScreen(-1);
    setClearing(false);
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
    heading.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [screen]);

  return (
    <MindmakeShell onStart={() => window.location.assign("/?start=1")} showMobileActionBar={false} startLabel="Start your brief" siteClassName="wd-site">
      <SEO title="Who decided?" description={SUBTITLE} canonical="/who-decided" noindex />
      <article className="wd-audit mm-container" data-clarity-mask="true">
        {screen === -1 ? (
          <section className="wd-intro">
            <h1 ref={heading} tabIndex={-1}>Who decided?</h1>
            <p className="wd-subtitle">{SUBTITLE}</p>
            <p>A free 20-minute judgement audit for senior leaders. Bring one decision from the last month where AI played a part.</p>
            <p className="wd-thesis">{THESIS}</p>
            <p className="wd-privacy">Nothing you type or pick leaves your browser. No account, email, storage or analytics on your answers. Refreshing or leaving clears your work.</p>
            <button type="button" className="wd-next" disabled={!ready} onClick={() => setScreen(0)}>Begin the audit <span aria-hidden="true">→</span></button>
            <noscript><p>Turn on JavaScript to use this private audit. Your answers stay in this page.</p></noscript>
          </section>
        ) : step ? (
          <section className="wd-step" key={step.id}>
            <div className="wd-progress"><span>Who decided?</span><span>Step {screen + 1} of 6</span></div>
            <h1 ref={heading} tabIndex={-1}>{step.title}</h1>
            <fieldset aria-describedby="wd-prompt">
              <legend>{step.question}</legend>
              <p id="wd-prompt" className="wd-prompt">{step.prompt}</p>
              <div className="wd-options">
                {step.options.map(option => (
                  <label key={option.level} className="wd-option">
                    <input type="radio" name={step.id} value={option.level} checked={answers[screen] === option.level}
                      onChange={() => setAnswers(previous => previous.map((answer, index) => index === screen ? option.level : answer))} />
                    <span>{option.text}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <details className="wd-note">
              <summary>Private note (optional)</summary>
              <label htmlFor={`note-${step.id}`}>Your note on {step.title.toLowerCase()}</label>
              <textarea id={`note-${step.id}`} autoComplete="off" spellCheck={false} value={notes[screen]}
                onChange={event => setNotes(previous => previous.map((note, index) => index === screen ? event.target.value : note))} />
            </details>
            <div className="wd-controls">
              <button type="button" className="wd-back" onClick={() => setScreen(screen - 1)}>Back</button>
              <button type="button" className="wd-next" disabled={!answers[screen]} onClick={() => setScreen(screen + 1)}>{screen === 5 ? "Read my decision" : "Continue"} <span aria-hidden="true">→</span></button>
            </div>
            <p className="wd-private-line">Your choices and notes stay in this page.</p>
          </section>
        ) : read ? (
          <section className="wd-read">
            <h1 ref={heading} tabIndex={-1}>Your private read</h1>
            <p>This reflects what you picked about this decision. We have not checked the work behind it.</p>
            <dl className="wd-lines">
              {read.lines.map((line, index) => <div key={line.id}>
                <dt>{line.title} <span>{line.level}</span></dt>
                <dd>{line.meaning}</dd>
                {notes[index] && <dd className="wd-read-note"><details><summary>Your private note</summary><p>{notes[index]}</p></details></dd>}
              </div>)}
            </dl>
            <section className="wd-practice" aria-labelledby="wd-strengthen">
              <h2 id="wd-strengthen">The one to strengthen first</h2>
              <p className="wd-first">{read.first.title}</p>
              <p>{read.first.practice}</p>
            </section>
            <section className="wd-facts" aria-labelledby="wd-matters">
              <h2 id="wd-matters">Why this matters</h2>
              {FACTS.map(fact => <figure key={fact.href}><blockquote>{fact.text}</blockquote><figcaption><a href={fact.href} target="_blank" rel="noreferrer">{fact.attribution}</a></figcaption></figure>)}
            </section>
            <a className="wd-next" data-mm-primary data-mm-native href="/?start=1">Start your brief <span aria-hidden="true">→</span></a>
            <div className="wd-edit"><button type="button" className="wd-back" onClick={() => setScreen(0)}>Revisit my answers</button></div>
          </section>
        ) : null}
        {screen >= 0 && <div className="wd-clear">
          {clearing ? <>
            <p role="status">Clear all your choices and notes?</p>
            <button type="button" className="wd-back" onClick={clear}>Yes, clear them</button>
            <button type="button" className="wd-back" onClick={() => setClearing(false)}>Keep working</button>
          </> : <button type="button" className="wd-back" onClick={() => setClearing(true)}>Clear my work</button>}
        </div>}
      </article>
    </MindmakeShell>
  );
}
