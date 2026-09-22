import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import gtmSignals from "@/data/vnext/gtm-signals.json";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import { useScrollDriver } from "@/hooks/useScrollDriver";
import filmThreePoster from "@/assets/films/film-03-poster.webp";
import filmThreeLoop from "@/assets/films/film-03-loop.mp4";
import filmThreeLoopWebm from "@/assets/films/film-03-loop.webm";
import filmFourPoster from "@/assets/films/film-04-poster.webp";
import filmFourLoop from "@/assets/films/film-04-loop.mp4";
import filmFourLoopWebm from "@/assets/films/film-04-loop.webm";
import "@/styles/mindmake.css";
import "@/styles/mindmake-gtm-r6.css";
import "@/styles/mindmake-gtm-r7.css";
import "@/styles/mindmake-gtm-calm.css";

type SignalKey = keyof typeof gtmSignals;
type Signal = (typeof gtmSignals)[SignalKey];
type DecisionAxis = "product" | "price" | "positioning" | "people";

const signalEntries = Object.entries(gtmSignals) as [SignalKey, Signal][];
const tickerLabels: Record<SignalKey, string> = {
  pricing: "HubSpot prices completed tasks",
  commerce: "Shopify puts products in AI chats",
  product: "Uber prototypes before the PRD",
  content: "Cloudflare lets publishers charge AI crawlers",
  service: "Zendesk sells an autonomous service workforce",
};

function moveRadioFocus(event: KeyboardEvent<HTMLElement>, nextIndex: number) {
  const group = event.currentTarget.closest('[role="radiogroup"]');
  const buttons = Array.from(group?.querySelectorAll<HTMLButtonElement>('[role="radio"]') ?? []);
  buttons[nextIndex]?.focus();
}

export default function AiGtm() {
  const { briefOpen, briefJourneyKey, openBrief, closeBrief } = useLeadBriefHistory();
  const [activeSignal, setActiveSignal] = useState<SignalKey>("pricing");
  const [activeResponse, setActiveResponse] = useState(2);
  const [activeAxis, setActiveAxis] = useState<DecisionAxis>("product");
  const [phase, setPhase] = useState(0);
  const [decisionProgress, setDecisionProgress] = useState(0);
  const [tickerHeld, setTickerHeld] = useState(false);
  const tickerResumeRef = useRef<number>();
  const middleBuildRef = useScrollDriver<HTMLSpanElement>(undefined, "read");
  const proofRef = useScrollDriver<HTMLElement>(undefined, "read");
  const proofBottomRef = useScrollDriver<HTMLSpanElement>(undefined, "read");
  const decisionRef = useScrollDriver<HTMLElement>((progress) => {
    if (window.matchMedia("(max-width: 80rem)").matches) return;
    setDecisionProgress(Math.round(progress * 200) / 200);
    setPhase(Math.min(2, Math.floor(Math.min(.9999, progress) * 3)));
  }, "pin");
  const signal = gtmSignals[activeSignal];
  const selected = signal.responses[activeResponse];
  const decisionAxes: { key: DecisionAxis; label: string; value: string }[] = [
    { key: "product", label: "Product", value: selected.product },
    { key: "price", label: "Price", value: selected.price },
    { key: "positioning", label: "Positioning", value: selected.positioning },
    { key: "people", label: "People", value: selected.people },
  ];

  const chooseSignal = (key: SignalKey) => {
    setActiveSignal(key);
    setActiveResponse(2);
  };

  useEffect(() => () => window.clearTimeout(tickerResumeRef.current), []);

  const holdTicker = () => {
    window.clearTimeout(tickerResumeRef.current);
    setTickerHeld(true);
  };

  const releaseTicker = () => {
    window.clearTimeout(tickerResumeRef.current);
    tickerResumeRef.current = window.setTimeout(() => setTickerHeld(false), 4000);
  };

  const choosePhase = (nextPhase: number) => {
    setPhase(nextPhase);
    const section = decisionRef.current;
    if (!section) return;
    if (window.matchMedia("(max-width: 80rem)").matches) {
      const target = section.querySelector<HTMLElement>(nextPhase === 0 ? ".decision-intro" : nextPhase === 1 ? ".comparison-shell" : ".test-ticket");
      if (target) {
        const fixedUiOffset = window.matchMedia("(max-width: 60rem)").matches ? 128 : 142;
        window.scrollTo({ top: window.scrollY + target.getBoundingClientRect().top - fixedUiOffset, behavior: "smooth" });
      }
      return;
    }
    const travel = Math.max(1, section.offsetHeight - window.innerHeight);
    window.scrollTo({ top: section.offsetTop + travel * (nextPhase / 2), behavior: "smooth" });
  };

  const handleResponseKeys = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    const next = event.key === "Home" ? 0 : event.key === "End" ? signal.responses.length - 1 : (index + delta + signal.responses.length) % signal.responses.length;
    setActiveResponse(next);
    moveRadioFocus(event, next);
  };

  const handleSignalKeys = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    const next = event.key === "Home" ? 0 : event.key === "End" ? signalEntries.length - 1 : (index + delta + signalEntries.length) % signalEntries.length;
    chooseSignal(signalEntries[next][0]);
    moveRadioFocus(event, next);
  };

  const openGtmBrief = () => openBrief("gtm");
  const context = `${signal.short} · ${selected.name}`;

  return (
    <MindmakeShell onStart={openGtmBrief} mainClassName="mm-gtm-r6 mm-gtm-r7 mm-gtm-calm" showMobileActionBar={false} compactFooter>
      <SEO title="Build your AI GTM" description="Turn one AI market shift into a tested commercial move across product, price, positioning and people." canonical="/ai-gtm" />

      <section className="hero" aria-labelledby="gtm-title">
        <div className="hero-visual" aria-hidden="true"><video autoPlay muted loop playsInline poster={filmFourPoster} aria-hidden="true"><source src={filmFourLoopWebm} type="video/webm" /><source src={filmFourLoop} type="video/mp4" /></video><div className="hero-visual-shade" /><div className="hero-aperture"><i /><i /><i /></div></div>
        <div className="hero-copy">
          <h1 id="gtm-title"><span className="sr-only">We turn an AI market shift into one tested commercial move.</span><span className="title-wide" aria-hidden="true"><span>We turn an AI</span><span>market shift into one</span><span>tested commercial move.</span></span><span className="title-phone" aria-hidden="true"><span>We turn an AI</span><span>market shift into</span><span>one tested</span><span>commercial move.</span></span></h1>
          <p className="support-wide">Align one offer. Build it. Test it with customers.</p>
          <p className="support-phone">Align one offer. Build it. Test it.</p>
          <div className="hero-actions"><button className="primary-action" type="button" onClick={openGtmBrief} data-mm-primary>Start here <span aria-hidden="true">→</span></button><a className="text-link" href="#decision-table">See live signals <span aria-hidden="true">↓</span></a></div>
        </div>

        <section className="signal-wire" aria-label="Live read of dated AI business signals">
          <div className="wire-label"><span><i aria-hidden="true" /> Live read</span><time dateTime="2026-09-15" aria-label="Sources checked 15 September 2026"><span>Sources checked</span><span>15 Sep 2026</span></time></div>
          <div className="ticker-window"><div className={`wire-signals${tickerHeld ? " is-held" : ""}`} role="radiogroup" aria-label="Choose a market signal" onPointerDown={holdTicker} onPointerUp={releaseTicker} onPointerCancel={releaseTicker} onPointerLeave={releaseTicker}>{[...signalEntries, ...signalEntries].map(([key, entry], index) => { const clone = index >= signalEntries.length; return <button key={`${key}-${clone ? "copy" : "source"}`} type="button" role={clone ? undefined : "radio"} aria-checked={clone ? undefined : key === activeSignal} aria-hidden={clone || undefined} tabIndex={clone || key !== activeSignal ? -1 : 0} data-signal={key} data-clone={clone || undefined} onClick={() => chooseSignal(key)} onKeyDown={clone ? undefined : (event) => handleSignalKeys(event, index)}><b>{entry.domain}</b><span>{tickerLabels[key]}</span></button>; })}</div></div>
        </section>
      </section>

      <section ref={decisionRef} className="decision" id="decision-table" aria-labelledby="decision-title" data-phase={phase} style={{ "--decision-progress": decisionProgress } as CSSProperties}>
        <span ref={middleBuildRef} className="decision-mid-build" aria-hidden="true" />
        <div className="decision-sticky">
          <div className="decision-rail" aria-label="Worked example progress">{["Signal", "Response", "Customer test"].map((label, index) => <button type="button" key={label} className={phase === index ? "is-active" : undefined} aria-current={phase === index ? "step" : undefined} onClick={() => choosePhase(index)}><span>0{index + 1}</span>{label}</button>)}</div>

          <div className="decision-workbench">
            <div className="decision-ledger" aria-live="polite">
              <span><small>Signal</small><strong>{signal.domain}</strong></span>
              <i aria-hidden="true" />
              <span><small>Working response</small><strong>{selected.name}</strong></span>
            </div>

            <article className="decision-chapter signal-chapter" data-chapter="0">
              <div className="question-block"><h2 id="decision-title"><span className="decision-title-wide">One market change. One move.</span><span className="decision-title-phone">One change.<br />One move.</span></h2><p id="signalQuestion">{signal.question}</p><p className="signal-question-phone">{signal.mobileQuestion}</p></div>
              <div className="evidence-slip"><div className="evidence-meta"><span>{signal.domain}</span><time dateTime={signal.isoDate}>{signal.date}</time></div><p>{signal.observation}</p><div className="evidence-foot"><details className="signal-caveat"><summary>Evidence note</summary><span>{signal.limit}</span></details><a href={signal.source} target="_blank" rel="noreferrer">{signal.sourceLabel} <span aria-hidden="true">↗</span></a></div></div>
            </article>

            <article className="decision-chapter response-chapter" data-chapter="1">
              <header className="chapter-heading"><h2>Choose the move.</h2></header>
              <div className="response-tabs" role="radiogroup" aria-label="Choose a commercial response">{signal.responses.map((response, index) => <button key={response.name} type="button" role="radio" aria-checked={activeResponse === index} tabIndex={activeResponse === index ? 0 : -1} onClick={() => setActiveResponse(index)} onKeyDown={(event) => handleResponseKeys(event, index)}><span>0{index + 1}</span><b>{response.name}</b></button>)}</div>
              <div className="commercial-map" aria-label="How the selected response changes the business">
                <div className="map-core"><small>Working response</small><strong>{selected.name}</strong><i aria-hidden="true" /></div>
                <div className="map-axis axis-product"><span>01 · Product</span><strong>{selected.product}</strong></div>
                <div className="map-axis axis-price"><span>02 · Price</span><strong>{selected.price}</strong></div>
                <div className="map-axis axis-positioning"><span>03 · Positioning</span><strong>{selected.positioning}</strong></div>
                <div className="map-axis axis-people"><span>04 · People</span><strong>{selected.people}</strong></div>
              </div>
              <div className="mobile-response" aria-live="polite"><div className="mobile-axis-tabs" role="radiogroup" aria-label="See how the choice changes the business">{decisionAxes.map((axis, index) => <button key={axis.key} type="button" role="radio" aria-checked={activeAxis === axis.key} onClick={() => setActiveAxis(axis.key)}><span>0{index + 1}</span>{axis.label}</button>)}</div><div className="mobile-axis-card"><small>{decisionAxes.findIndex((axis) => axis.key === activeAxis) + 1} of 4</small><strong>{decisionAxes.find((axis) => axis.key === activeAxis)?.label}</strong><p>{decisionAxes.find((axis) => axis.key === activeAxis)?.value}</p></div></div>
            </article>

            <article className="decision-chapter test-chapter" data-chapter="2">
              <header className="chapter-heading"><h2>Test it with customers.</h2></header>
              <div className="test-ticket" aria-live="polite"><div><span>Customer test</span><strong>{selected.testTitle}</strong></div><ol aria-label="Test protocol"><li><b>Show</b><span>The offer</span></li><li><b>Watch</b><span>What buyers do</span></li><li><b>Change</b><span>The decision</span></li></ol><details className="test-detail"><summary>How the test works <span aria-hidden="true">+</span></summary><p>{selected.testBody}</p></details></div>
            </article>
          </div>
        </div>
      </section>

      <section ref={proofRef} className="proof" aria-labelledby="gtm-proof-title"><span ref={proofBottomRef} className="proof-bottom-build" aria-hidden="true" /><video autoPlay muted loop playsInline poster={filmThreePoster} aria-hidden="true"><source src={filmThreeLoopWebm} type="video/webm" /><source src={filmThreeLoop} type="video/mp4" /></video><div className="proof-shade" aria-hidden="true" /><div className="proof-copy is-visible"><h2 id="gtm-proof-title">One paid proof. <span>Real customer evidence.</span></h2><p>You keep the offer, evidence and system.</p><blockquote><p>“We set up an AI-native go-to-market system that made us rethink who we hire and what they do.”</p><cite>Chief Revenue Officer, data-infrastructure company</cite></blockquote><button className="primary-action is-large" type="button" onClick={openGtmBrief} data-mm-primary>Start here <span aria-hidden="true">→</span></button></div></section>

      <LeadBrief open={briefOpen} onClose={closeBrief} route="gtm" presentation="drawer" initialContext={context} journeyKey={briefJourneyKey} />
    </MindmakeShell>
  );
}
