import { useEffect, useRef, useState, type RefObject } from "react";
import { ArrowLeft, ArrowRight, Check, Copy } from "lucide-react";
import { FACTS, LEVELS, THESIS, type DecisionRead } from "./audit";
import { CompoundingExample } from "./CompoundingExample";

const chapters = ["Your decision", "Your AI brain", "What compounds"] as const;

function RuleCard({ rule }: { rule: string }) {
  const [status, setStatus] = useState<"ready" | "copied" | "manual">("ready");
  const wording = useRef<HTMLParagraphElement>(null);

  async function copyRule() {
    try {
      await navigator.clipboard.writeText(rule);
      setStatus("copied");
    } catch {
      const selection = window.getSelection();
      if (selection && wording.current) {
        const range = document.createRange();
        range.selectNodeContents(wording.current);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      setStatus("manual");
    }
  }

  return <aside className="wd-paper wd-rule" aria-labelledby="wd-rule-title">
    <h2 id="wd-rule-title" className="wd-caption">A rule for my AI brain</h2>
    <p ref={wording} className="wd-rule-text">{rule}</p>
    <button type="button" className="wd-copy" onClick={copyRule}>
      {status === "copied" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
      {status === "copied" ? "Rule copied" : "Copy my rule"}
    </button>
    <span className={status === "manual" ? "wd-copy-help" : "sr-only"} role="status">
      {status === "copied" ? "Copied to your clipboard." : status === "manual" ? "Use your device’s Copy command on the rule above." : ""}
    </span>
  </aside>;
}

type Props = {
  read: DecisionRead;
  heading: RefObject<HTMLHeadingElement>;
  onRevise: () => void;
  onClear: () => void;
};

export function DecisionResults({ read, heading, onRevise, onClear }: Props) {
  const [chapter, setChapter] = useState(0);
  const [rate, setRate] = useState(10);
  const [weeks, setWeeks] = useState(13);
  const [clearing, setClearing] = useState(false);
  const previousChapter = useRef(chapter);
  const { first, lines } = read;
  const established = LEVELS.indexOf(first.level) >= LEVELS.indexOf("Independent");
  const strongest = lines.reduce((best, line) => LEVELS.indexOf(line.level) > LEVELS.indexOf(best.level) ? line : best);
  const titles = [
    established ? "Take a good habit into your next decision." : first.nextTitle,
    "Give your AI a rule you own.",
    "What if each week built on the last?",
  ];

  useEffect(() => {
    if (previousChapter.current !== chapter) {
      heading.current?.focus({ preventScroll: true });
      if (window.scrollY) window.scrollTo(0, 0);
      previousChapter.current = chapter;
    }
  }, [chapter, heading]);

  function go(next: number) {
    setClearing(false);
    setChapter(next);
  }

  return <section className="wd-results" aria-labelledby="wd-result-title">
    <div className="wd-journey">
      <p>Step {chapter + 1} of 3 <span aria-hidden="true">/</span> {chapters[chapter]}</p>
      <div className="wd-journey-marks" aria-hidden="true">
        {chapters.map((name, index) => <i key={name} className={index <= chapter ? "is-done" : undefined} />)}
      </div>
    </div>

    <div className="wd-spread" key={chapter}>
      <header className="wd-result-intro">
        <h1 id="wd-result-title" ref={heading} tabIndex={-1}>{titles[chapter]}</h1>
        {chapter === 0 && <>
          <p className="wd-result-lede">{first.meaning}</p>
          {strongest.level !== first.level && <div className="wd-strength">
            <p className="wd-caption">A strength to keep</p><p>{strongest.meaning}</p>
          </div>}
        </>}
        {chapter === 1 && <>
          <p className="wd-result-lede">An AI brain is a private record of how you make decisions. Save this rule in a file you control. Give your AI the rule when it needs it, and keep the original example with you.</p>
          <div className="wd-strength"><p className="wd-caption">Next time</p><p>{first.example}</p></div>
        </>}
        {chapter === 2 && <>
          <p className="wd-result-lede">You catch a shaky claim in a forecast and add the check to your rule. Every future forecast can now start with that check.</p>
          <p className="wd-model-note">This is a thought experiment. Try a rate you think you could sustain.</p>
        </>}
      </header>
      {chapter === 0 && <aside className="wd-paper wd-practice-note" aria-labelledby="wd-practice-title">
        <h2 id="wd-practice-title" className="wd-caption">Try this on your next decision</h2>
        <p>{established ? "Write down the check you used and one situation where you would change it. Keep the example so you can use that judgement again." : first.practice}</p>
      </aside>}
      {chapter === 1 && <RuleCard rule={first.rule} />}
      {chapter === 2 && <CompoundingExample rate={rate} weeks={weeks} onRate={setRate} onWeeks={setWeeks} />}
    </div>

    <div className="wd-journey-actions">
      {chapter < 2
        ? <button className="wd-next" type="button" onClick={() => go(chapter + 1)}>
            {chapter === 0 ? "Turn this into an AI brain rule" : "See how the gains add up"} <ArrowRight size={19} aria-hidden="true" />
          </button>
        : <div className="wd-brief-offer">
            <p>Build your AI brain around a decision you make often. Your brief starts fresh and your audit answers stay here.</p>
            <a className="wd-next" data-mm-primary data-mm-native href="/?start=1">Start your brief <ArrowRight size={19} aria-hidden="true" /></a>
          </div>}
      {chapter > 0 && <button type="button" className="wd-previous" onClick={() => go(chapter - 1)}>
        <ArrowLeft size={15} aria-hidden="true" /> Back to {chapter === 2 ? "your AI brain" : "your decision"}
      </button>}
    </div>

    <div className="wd-result-foot">
      {chapter === 0 && <details className="wd-disclosure">
        <summary>See my six answers</summary>
        <ol className="wd-reading-list">{lines.map(line => <li key={line.id}>
          <h3>{line.title}</h3><p>“{line.answer}”</p><small>{line.level} · {line.meaning}</small>
        </li>)}</ol>
      </details>}
      {chapter === 2 && <details className="wd-disclosure">
        <summary>Research behind the audit</summary>
        <p>{THESIS}</p>
        {FACTS.map(fact => <figure key={fact.href}>
          <blockquote>{fact.text}</blockquote>
          <figcaption><a href={fact.href} target="_blank" rel="noreferrer">{fact.attribution}</a></figcaption>
        </figure>)}
      </details>}
      <div className="wd-private-tools">
        <button type="button" className="wd-back" onClick={onRevise}>Revisit my answers</button>
        {clearing ? <div className="wd-clear"><p role="status">Clear all your choices?</p>
          <button type="button" className="wd-back" onClick={onClear}>Yes, clear them</button>
          <button type="button" className="wd-back" onClick={() => setClearing(false)}>Keep working</button>
        </div> : <button type="button" className="wd-back" onClick={() => setClearing(true)}>Clear my work</button>}
      </div>
    </div>
  </section>;
}
