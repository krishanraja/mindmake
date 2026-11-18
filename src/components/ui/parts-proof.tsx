import { useEffect, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { testimonials, type Testimonial } from "@/data/testimonials";

/* Proof for the parts page (Krish, 18 November 2026): who built it, what a better
   decision is worth, what changed for leaders, and an answer before anyone leaves.
   Every figure is the reader's own input or carries its source. No scarcity. */

export function BuiltBy() {
  return <aside className="kit-built" aria-label="Who built the parts">
    <p>Built by Krish Raja, who took a national media group's digital revenue from $9m to $61m in three years and has run AI sessions with more than 4,000 leaders. Verify: <a href="https://www.krishraja.com" rel="noopener">krishraja.com</a></p>
    <picture><source srcSet="/media/parts/krish-raja.webp" type="image/webp" /><img src="/media/parts/krish-raja.jpg" alt="Krish Raja" width={72} height={72} loading="lazy" decoding="async" /></picture>
  </aside>;
}

const STAKES = [50_000, 250_000, 1_000_000, 5_000_000];
const LIFTS = [
  { points: 1, label: "1 in 100", note: "A checked call is right one time in a hundred more often." },
  { points: 5, label: "1 in 20", note: "A checked call is right one time in twenty more often." },
  { points: 19, label: "19 in 100", note: "The gap measured in one study, below." },
];
const dollars = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const decisionValue = (stake: number, points: number) => stake * points / 100;

export function DecisionMath() {
  const [stake, setStake] = useState(1_000_000);
  const [lift, setLift] = useState(LIFTS[0]);
  const saved = decisionValue(stake, lift.points);
  return <section className="kit-section kit-math" aria-labelledby="kit-math-title">
    <div className="kit-math-head"><h2 id="kit-math-title">The math</h2><p className="kit-label">Your numbers. Change them.</p></div>
    <div className="kit-math-card">
      <fieldset><legend>The decision on your desk is worth</legend><div className="kit-math-choices">{STAKES.map(value => <button key={value} type="button" aria-pressed={stake === value} onClick={() => setStake(value)}>{dollars(value)}</button>)}</div></fieldset>
      <fieldset><legend>Checking it first makes you right more often by</legend><div className="kit-math-choices">{LIFTS.map(option => <button key={option.points} type="button" aria-pressed={lift.points === option.points} onClick={() => setLift(option)}>{option.label}</button>)}</div><p className="kit-math-note">{lift.note}</p></fieldset>
      <dl className="kit-math-rows">
        <div><dt>What is at stake</dt><dd>{dollars(stake)}</dd></div>
        <div><dt>Expected value of the better call</dt><dd aria-live="polite">{dollars(saved)}</dd></div>
        <div className="kit-math-total"><dt>One part, once. Working the same afternoon.</dt><dd>$59</dd></div>
      </dl>
      <p className="kit-math-source">Expected value is what is at stake multiplied by how much more often you are right. In a Harvard and BCG study of 758 consultants, those who leaned on AI for a task it could not do were 19 percentage points less likely to get it right (Dell'Acqua et al., 2023). A part does not make the decision; it checks what you are about to rely on.</p>
    </div>
  </section>;
}

const STORY_IDS = ["b2b-coo", "services-ceo", "fintech-founder", "saas-gtm", "data-infra-cro", "media-cro", "coaching-founder", "thrave"];
function Quote({ t }: { t: Testimonial }) {
  const at = t.full.indexOf(t.excerpt);
  return <p>{at < 0 ? t.full : <>{t.full.slice(0, at)}<strong>{t.excerpt}</strong>{t.full.slice(at + t.excerpt.length)}</>}</p>;
}
export function Stories() {
  const stories = useMemo(() => STORY_IDS.map(id => testimonials.find(t => t.id === id)).filter((t): t is Testimonial => !!t), []);
  const track = useRef<HTMLDivElement>(null);
  const move = (direction: number) => { const el = track.current; if (el) el.scrollBy({ left: direction * Math.min(el.clientWidth * 0.85, 480), behavior: "smooth" }); };
  return <section className="kit-section kit-stories" aria-labelledby="kit-stories-title">
    <div className="kit-stories-head"><div><h2 id="kit-stories-title">What changed when leaders <em>checked the call first.</em></h2><p>These leaders worked through real decisions with Krish. The parts are new, so stories from buyers come next.</p></div>
      <div className="kit-stories-controls"><button type="button" aria-label="Previous story" onClick={() => move(-1)}><ArrowLeft aria-hidden="true" /></button><button type="button" aria-label="Next story" onClick={() => move(1)}><ArrowRight aria-hidden="true" /></button></div></div>
    <div className="kit-stories-track" ref={track} tabIndex={0} aria-label="Stories, scroll sideways">{stories.map((t, i) => <figure key={t.id} className={i === 0 ? "is-dark" : ""}><span aria-hidden="true" className="kit-stories-mark">“</span><blockquote><Quote t={t} /></blockquote><figcaption>{t.name && <strong>{t.name}<br /></strong>}{t.role}</figcaption></figure>)}</div>
  </section>;
}

const ANSWERS = [
  { q: "Will it work with my AI?", a: "It works inside Claude Desktop on a Mac or Windows computer, with a free or paid Claude account. You add it in one click, and it runs on your own files. Nothing is sent to us." },
  { q: "Show me what it does first", a: "Every part has a sample you can run before you point it at your own files. Or try Who decided?, our free 20-minute audit of one real decision.", link: { href: "/who-decided", label: "Try Who decided?, free" } },
  { q: "Is it worth it for a decision like mine?", a: "If the decision is worth $50,000 and checking it makes you right even one time in a hundred more often, that is $500 of expected value, against $59 once. And if it is not working for you, we run a free session with you to put it right." },
];
const SEEN = "mindmake-parts-exit-seen";
const seen = () => { try { return sessionStorage.getItem(SEEN) === "1"; } catch { return false; } };
const remember = () => { try { sessionStorage.setItem(SEEN, "1"); } catch { /* private mode: the page still works */ } };

/** Asks once per visit, when the reader moves to leave on desktop or turns back sharply on a phone. */
export function ExitOverlay({ buyHref, buyLabel }: { buyHref: string; buyLabel: string }) {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState<number | null>(null);
  useEffect(() => {
    if (seen() || new URLSearchParams(window.location.search).has("checkout")) return;
    let armed = false, depth = 0, lastY = window.scrollY, lastT = performance.now();
    const arm = window.setTimeout(() => { armed = true; }, 8000);
    const show = () => { if (!armed || seen()) return; remember(); setOpen(true); };
    const leave = (event: MouseEvent) => { if (!event.relatedTarget && event.clientY <= 0) show(); };
    const scroll = () => {
      const now = performance.now(), y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0) depth = Math.max(depth, y / max);
      if (depth > 0.5 && lastY - y > 600 && now - lastT < 500) show();
      if (now - lastT > 500) { lastY = y; lastT = now; }
    };
    document.addEventListener("mouseout", leave);
    window.addEventListener("scroll", scroll, { passive: true });
    return () => { window.clearTimeout(arm); document.removeEventListener("mouseout", leave); window.removeEventListener("scroll", scroll); };
  }, []);
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Portal><Dialog.Overlay className="kit-exit-overlay" /><Dialog.Content className="kit-exit">
      <p className="kit-label">PARTS OF YOUR AI BRAIN</p>
      <Dialog.Title>What’s stopping you?</Dialog.Title>
      <Dialog.Description>Tap one. We will answer it right here.</Dialog.Description>
      <Dialog.Close className="kit-exit-close" aria-label="Close"><X aria-hidden="true" /></Dialog.Close>
      <div className="kit-exit-options">{ANSWERS.map((item, i) => <div key={item.q}><button type="button" aria-expanded={answer === i} onClick={() => setAnswer(answer === i ? null : i)}>{item.q}</button>{answer === i && <p>{item.a}{item.link && <> <a href={item.link.href}>{item.link.label}</a></>}</p>}</div>)}</div>
      <a className="kit-button kit-exit-buy" href={buyHref} onClick={() => setOpen(false)}>{buyLabel} <ArrowRight size={18} aria-hidden="true" /></a>
      <p className="kit-exit-promise">No marketing emails, ever. If it is not working for you, we run a free session with you.</p>
      <Dialog.Close className="kit-exit-dismiss">Nothing. Close this.</Dialog.Close>
    </Dialog.Content></Dialog.Portal>
  </Dialog.Root>;
}
