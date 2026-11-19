import { useEffect, useRef, useState } from "react";
import { SEO } from "@/components/SEO";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { FACTS, FACT_FIGURES, FACT_FIGURE_LABELS, LEVELS, OWNERS, STEPS, SUBTITLE, THESIS, ownerOf, readDecision, type Level } from "@/features/who-decided/audit";
import { LeadExit } from "@/components/ui/lead-exit";
import "@/styles/mindmake.css";
import "@/styles/who-decided.css";

const emptyAnswers = () => STEPS.map(() => null as Level | null);
const TABS = ["Profile", "Scorecards", "Next step", "Research"] as const;
type Tab = typeof TABS[number];

/** Four segments, filled to the level. */
function Meter({ level, accent }: { level: Level; accent?: boolean }) {
  const filled = LEVELS.indexOf(level) + 1;
  return (
    <span className={`wd-meter${accent ? " is-first" : ""}`} aria-hidden="true">
      {LEVELS.map((name, index) => <i key={name} className={index < filled ? "is-on" : undefined} style={{ animationDelay: `${index * 80}ms` }} />)}
    </span>
  );
}

/** Six axes, four rings. The shape is the read; the amber point is the one to strengthen first. */
function Profile({ levels, first }: { levels: Level[]; first: number }) {
  const size = 300, centre = size / 2, radius = 98;
  const point = (axis: number, value: number) => {
    const angle = -Math.PI / 2 + (axis * Math.PI * 2) / 6;
    return [centre + Math.cos(angle) * radius * value, centre + Math.sin(angle) * radius * value];
  };
  const ring = (value: number) => STEPS.map((_, axis) => point(axis, value).join(",")).join(" ");
  const shape = levels.map((level, axis) => point(axis, (LEVELS.indexOf(level) + 1) / 4).join(",")).join(" ");
  return (
    <svg className="wd-radar" viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Your judgement profile: ${STEPS.map((step, index) => `${step.title}, ${levels[index]}`).join("; ")}.`}>
      {[1, 2, 3, 4].map(value => <polygon key={value} points={ring(value / 4)} className="wd-radar-ring" />)}
      {STEPS.map((step, axis) => { const [x, y] = point(axis, 1); return <line key={step.id} x1={centre} y1={centre} x2={x} y2={y} className="wd-radar-axis" />; })}
      <polygon points={shape} className="wd-radar-shape" />
      {levels.map((level, axis) => { const [x, y] = point(axis, (LEVELS.indexOf(level) + 1) / 4); return <circle key={axis} cx={x} cy={y} r={axis === first ? 6 : 4} className={axis === first ? "wd-radar-first" : "wd-radar-dot"} />; })}
      {STEPS.map((step, axis) => {
        const [x, y] = point(axis, 1.22);
        return <text key={step.id} x={x} y={y} textAnchor={Math.abs(x - centre) < 4 ? "middle" : x > centre ? "start" : "end"} dominantBaseline="middle" className={axis === first ? "wd-radar-label is-first" : "wd-radar-label"}>{step.title.replace("The ", "")}</text>;
      })}
    </svg>
  );
}

export default function WhoDecided() {
  const [screen, setScreen] = useState(-1);
  const [answers, setAnswers] = useState(emptyAnswers);
  const [clearing, setClearing] = useState(false);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("Profile");
  const [focusCard, setFocusCard] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const started = useRef(false);
  const step = STEPS[screen];
  const read = screen === STEPS.length ? readDecision(answers) : null;
  const firstIndex = read ? STEPS.findIndex(item => item.id === read.first.id) : 0;

  const clear = () => {
    setAnswers(emptyAnswers());
    setScreen(-1);
    setClearing(false);
    setTab("Profile");
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
    if (read) { setTab("Profile"); setFocusCard(firstIndex); }
    if (!started.current) { started.current = true; return; }
    heading.current?.focus({ preventScroll: true });
  }, [screen]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearControl = read && (
    <div className="wd-clear">
      {clearing ? <>
        <p role="status">Clear all your choices?</p>
        <button type="button" className="wd-back" onClick={clear}>Yes, clear them</button>
        <button type="button" className="wd-back" onClick={() => setClearing(false)}>Keep working</button>
      </> : <button type="button" className="wd-back" onClick={() => setClearing(true)}>Clear my work</button>}
    </div>
  );

  const owners = read ? OWNERS.map(owner => ({ owner, count: read.lines.filter(line => ownerOf(line.level) === owner).length })) : [];

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
          <section className="wd-read" data-tab={tab}>
            <header className="wd-read-head">
              <div>
                <h1 ref={heading} tabIndex={-1}>Your private read</h1>
                <p>{THESIS}</p>
              </div>
              <div className="wd-read-actions">
                <button type="button" className="wd-back" onClick={() => setScreen(0)}>Revisit my answers</button>
                {clearControl}
              </div>
            </header>

            <div className="wd-tabs" role="tablist" aria-label="Your read">
              {TABS.map(name => <button key={name} type="button" role="tab" aria-selected={tab === name} className={tab === name ? "is-active" : undefined} onClick={() => setTab(name)}>{name}</button>)}
            </div>

            <div className="wd-board">
              <section className="wd-panel wd-panel-profile" data-panel="Profile" aria-labelledby="wd-profile-h">
                <h2 id="wd-profile-h" className="wd-panel-label">Judgement profile</h2>
                <Profile levels={read.lines.map(line => line.level)} first={firstIndex} />
                <div className="wd-owners">
                  <h3 className="wd-panel-label">Who decided, across six readings</h3>
                  <div className="wd-split" aria-hidden="true">
                    {owners.filter(item => item.count).map(item => <span key={item.owner} className={`wd-split-${OWNERS.indexOf(item.owner)}`} style={{ flexGrow: item.count }} />)}
                  </div>
                  <dl className="wd-split-key">
                    {owners.map(item => <div key={item.owner} className={`wd-split-${OWNERS.indexOf(item.owner)}`}><dt>{item.owner}</dt><dd>{item.count}</dd></div>)}
                  </dl>
                </div>
              </section>

              <section className="wd-panel wd-panel-cards" data-panel="Scorecards" aria-labelledby="wd-cards-h">
                <h2 id="wd-cards-h" className="wd-panel-label">Scorecards · Aware to Adapting</h2>
                <div className="wd-cards">
                  {read.lines.map((line, index) => (
                    <div key={line.id} className={`wd-card${index === firstIndex ? " is-first" : ""}${index === focusCard ? " is-focus" : ""}`}>
                      <button type="button" className="wd-card-head" aria-expanded={index === focusCard} onClick={() => setFocusCard(index)}>
                        <span className="wd-card-title">{line.title}</span>
                        <Meter level={line.level} accent={index === firstIndex} />
                        <span className="wd-card-level">{line.level}</span>
                      </button>
                      <p className="wd-card-meaning">{line.meaning}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="wd-panel wd-practice" data-panel="Next step" aria-labelledby="wd-strengthen">
                <h2 id="wd-strengthen" className="wd-panel-label">The one to strengthen first</h2>
                <p className="wd-first">{read.first.title}</p>
                <p className="wd-first-level"><Meter level={read.first.level} accent /> <span>{read.first.level}</span></p>
                <p className="wd-first-practice">{read.first.practice}</p>
                <a className="wd-next" data-mm-primary data-mm-native href="/?start=1">Start your brief <span aria-hidden="true">→</span></a>
              </section>

              <section className="wd-panel wd-facts" data-panel="Research" aria-labelledby="wd-matters">
                <h2 id="wd-matters" className="wd-panel-label">Why this matters</h2>
                {FACTS.map((fact, index) => (
                  <figure key={fact.href}>
                    <p className="wd-fact-figure"><strong>{FACT_FIGURES[index]}</strong><span>{FACT_FIGURE_LABELS[index]}</span></p>
                    <blockquote>{fact.text}</blockquote>
                    <figcaption><a href={fact.href} target="_blank" rel="noreferrer">{fact.attribution}</a></figcaption>
                  </figure>
                ))}
              </section>
            </div>
          </section>
        ) : null}
      </article>
      <LeadExit offers={["modules"]} />
    </MindmakeShell>
  );
}
