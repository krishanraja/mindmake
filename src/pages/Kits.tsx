import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowDown, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { SEO } from "@/components/SEO";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { kits, visibleKits, type Kit } from "@/content/kits";
import { PartsFaqDrawer } from "@/components/ui/parts-faq-drawer";
import { BouncyAccordion } from "@/components/ui/bouncy-accordion";
import { PartsSampleOutput } from "@/components/ui/parts-sample-output";
import { SquareGrid } from "@/components/ui/square-grid";
import { ClaudeCheck, ClaudeOnlyBadge, ClaudeMark } from "@/components/ui/claude-only";
import { CONTACT_EMAIL } from "@/lib/publicLinks";
import { BuiltBy, DecisionMath, ExitOverlay, PartsEngine, PartsVersus, Stories } from "@/components/ui/parts-proof";
import "@fontsource-variable/newsreader/wght-italic.css";
import "@/styles/mindmake.css";
import "@/styles/kits.css";

const catalogue = visibleKits(kits, __KITS_PREVIEW__ ? "preview" : "production");
const refund = "Full refund within 14 days, no questions asked.";
// The promise made to every buyer (Krish, 18 November 2026). Checkout and the receipt carry the full wording.
const promise = "No marketing emails, ever. We check in with you once, personally, and if the brain module is not working, we run a free session with you.";

function Suite() {
  return <section className="kit-section kit-suite" aria-labelledby="kit-suite-title">
    <h2 id="kit-suite-title">Want the whole brain, not one module?</h2>
    <p>Each brain module does one job. Mindmake builds your whole AI brain with you, around your standards and the decisions you make.</p>
    <div className="kit-suite-actions"><a className="kit-button" href="/?start=1">Start building your AI brain <ArrowRight size={18} aria-hidden="true" /></a><Link className="kit-back" to="/">See everything Mindmake does <ArrowRight size={16} aria-hidden="true" /></Link></div>
    <p className="kit-audit">Not ready to buy? Try <Link to="/measure-your-ai-judgement">Measure your AI judgement</Link>, free.</p>
  </section>;
}

function Strengthens({ kit }: { kit: Kit }) {
  return <aside className="kit-output" aria-labelledby="kit-strengthens-title">
    <h2 id="kit-strengthens-title">What it strengthens</h2><p>{kit.strengthens}</p>
  </aside>;
}

function Buy({ kit }: { kit: Kit }) {
  const [state, setState] = useState<"idle" | "loading" | "error" | "sample">("idle");
  const [claude, setClaude] = useState(false);
  const [missing, setMissing] = useState(false);
  // A makeyourmindup member link carries ?code=, which checkout applies so the member never types it.
  const code = new URLSearchParams(useLocation().search).get("code") ?? undefined;
  const requestId = useRef<string>();
  const buy = async () => {
    if (kit.status === "sample") { setState("sample"); return; }
    if (state === "loading") return;
    if (!claude) { setMissing(true); return; }
    setState("loading");
    try {
      requestId.current ??= crypto.randomUUID();
      const base = import.meta.env.VITE_SUPABASE_URL;
      if (!base) throw new Error("Unavailable");
      const response = await fetch(`${base}/functions/v1/kits-checkout`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: kit.slug, requestId: requestId.current, ...(code ? { code } : {}) }),
      });
      const result = await response.json();
      if (!response.ok || typeof result.url !== "string" || new URL(result.url).origin !== "https://checkout.stripe.com") throw new Error("Unavailable");
      window.location.assign(result.url);
    } catch { setState("error"); }
  };
  return <div className="kit-buy"><ClaudeCheck checked={claude} onChange={value => { setClaude(value); if (value) setMissing(false); }} missing={missing} /><div className="parts-price-actions"><button className="kit-button" onClick={buy} disabled={state === "loading"} aria-disabled={state === "loading" ? true : undefined} data-ready={claude}>
    {state === "loading" ? <>Opening checkout…<SquareGrid /></> : <>{code ? "Claim this brain module, free" : "Add this brain module, $59"}<ArrowRight size={18} aria-hidden="true" /></>}
  </button><PartsFaqDrawer /></div><p className="kit-refund">{refund}</p><p className="kit-promise">{promise}</p><div className="kit-buy-status" role="status">{state === "sample" ? "This brain module is not available." : state === "error" ? (code ? "That code does not work here. Reply to the email it came in and we will sort it out." : "Checkout is unavailable. Please try again.") : ""}</div></div>;
}

function Catalogue() {
  return <>
    <section className="kit-section kit-hero kit-hero-catalogue" id="kit-hero">
      <div><p className="kit-label">PARTS OF YOUR AI BRAIN</p>
        <h1>Start your AI brain <em>one module at a time.</em></h1>
        <p className="kit-lede kit-explanation">Your AI brain is your judgement, written down so AI can use it. Each brain module is working software, not a prompt: it checks what you are about to rely on against your own files, the same way every time, and remembers what changed. You see the result in five minutes.</p>
        <ClaudeOnlyBadge />
        <a className="kit-button" href="#kit-catalogue">See the parts <ArrowDown size={18} aria-hidden="true" /></a>
        <ul className="kit-checks">{["Runs on your computer. Your files are never sent to us.", "Buy once, then add it to Claude Desktop on a Mac or Windows computer in one click.", refund].map(text => <li key={text}><Check size={16} aria-hidden="true" />{text}</li>)}</ul>
        <p className="kit-audit">Not sure where to start? Try <Link to="/measure-your-ai-judgement">Measure your AI judgement</Link>, six free questions about one real decision.</p>
      </div><PartsSampleOutput />
    </section>
    <div className="kit-section kit-built-wrap"><BuiltBy /></div>
    <section className="kit-dark"><div className="kit-section"><p className="kit-label">WHY MODULES, NOT PROMPTS</p><h2>AI makes strong judgement stronger and weak judgement weaker. <em>Each brain module makes yours stronger.</em></h2><PartsEngine /></div></section>
    <PartsVersus />
    <section className="kit-section" id="kit-catalogue"><h2>Pick the job you want done before your next decision.</h2>
      <div className="kit-grid">{catalogue.map(kit => <article className="kit-card" key={kit.slug}>
        <h3><Link to={`/brain-modules/${kit.slug}`}>{kit.name}</Link></h3><p>{kit.problem}</p><div className="parts-card-price"><div className="parts-price-actions"><Link className="kit-card-link" to={`/brain-modules/${kit.slug}`} aria-label={`Add ${kit.name}, $59`}>Add it, $59 <ArrowRight size={18} aria-hidden="true" /></Link><PartsFaqDrawer /></div><p className="kit-refund">{refund}</p></div>
      </article>)}</div>
    </section>
    <DecisionMath />
    <Stories />
    <Suite />
    <section className="kit-section kit-faq" aria-labelledby="kit-faq-title"><h2 id="kit-faq-title"><PartsFaqDrawer heading /></h2></section>
    <ExitOverlay buyHref="#kit-catalogue" buyLabel="Choose a brain module, $59" />
  </>;
}


/** The confirmation a buyer lands on after paying: sincere, and exact about what happens next. */
function Thanks({ kit, member }: { kit: Kit; member: boolean }) {
  useEffect(() => { document.getElementById("kit-thanks")?.focus({ preventScroll: false }); }, []);
  return <section className="kit-thanks" id="kit-thanks" tabIndex={-1} aria-labelledby="kit-thanks-title">
    <div className="kit-thanks-card">
      <span className="kit-thanks-tick" aria-hidden="true"><Check size={26} /></span>
      <p className="kit-label">ORDER CONFIRMED</p>
      <h2 id="kit-thanks-title">Thank you. It is on its way.</h2>
      <p className="kit-thanks-lead"><strong>{kit.name}</strong> is yours. We are sending it to the email address you gave at checkout. It usually arrives within a minute. If you cannot see it, look in spam, or write to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and a person will help.</p>
      <div className="kit-thanks-body">
      <ol className="kit-thanks-steps">
        <li><span>01</span><div><strong>Open the email on your Mac or Windows computer.</strong> It comes from Mindmake and has one button.</div></li>
        <li><span>02</span><div><strong>Press Download your brain module.</strong> The file saves as <code>.mcpb</code>.</div></li>
        <li><span>03</span><div><strong>Open it.</strong> <ClaudeMark size={18} /> Claude Desktop starts and asks you to press Install. Then it is in Claude.</div></li>
      </ol>
      {!member && <aside className="kit-thanks-media"><p className="kit-label">FREE · THREE PIECES A WEEK</p><strong>Read makeyourmindup, our media channel.</strong><span>What is changing in AI, and what to do about it, for leaders who make the call.</span><a className="kit-button" href="https://makeyourmindup.ai" target="_blank" rel="noreferrer">Subscribe free <ArrowRight size={18} aria-hidden="true" /></a></aside>}
      </div>
      <p className="kit-thanks-note">We will check in with you once, personally, and never send you marketing. Full refund within 14 days.</p>
    </div>
  </section>;
}

function Detail({ kit }: { kit: Kit }) {
  const { search } = useLocation();
  const [returned, setReturned] = useState<string | null>(null);
  useEffect(() => setReturned(new URLSearchParams(search).get("checkout")), [search]);
  const member = new URLSearchParams(search).get("member") === "1";
  return <>
    {returned === "success" && <Thanks kit={kit} member={member} />}
    <section className="kit-section kit-hero" id="kit-hero"><div><Link className="kit-back" to="/brain-modules"><ArrowLeft size={16} aria-hidden="true" /> All parts</Link><p className="kit-label">PART OF YOUR AI BRAIN</p><h1>{kit.name}</h1><ClaudeOnlyBadge /><p className="kit-lede">{kit.problem}</p>{kit.slug === "audit-a-decision" && <p className="kit-audit">Try it free first: <Link to="/measure-your-ai-judgement">Measure your AI judgement</Link> is the same six questions for one decision.</p>}<Buy key={kit.slug} kit={kit} />{returned === "cancelled" && <p role="status">Checkout cancelled. You can try again when you are ready.</p>}</div><Strengthens kit={kit} /></section>
    <section className="kit-section kit-detail-content">
      <div><h2>What you get</h2><ul className="kit-checks">{kit.does.map(text => <li key={text}><Check size={18} aria-hidden="true" />{text}</li>)}</ul><Link className="kit-back" to={`/${kit.door}`}>Build your AI brain<ArrowRight size={16} aria-hidden="true" /></Link></div>
      <BouncyAccordion key={kit.slug} defaultValue="judgement" items={[
        { id: "checks", title: "What it checks", content: <p>{kit.checks}</p> },
        { id: "judgement", title: "What only you can judge", content: <p>{kit.whoDecided}</p> },
        { id: "first-five", title: "Your first five minutes", content: <ol className="kit-steps">{kit.firstFiveMinutes.map(text => <li key={text}>{text}</li>)}</ol> },
        { id: "requirements", title: "What you need", content: <ul>{kit.requirements.map(text => <li key={text}>{text}</li>)}</ul> },
      ]} />
    </section>
    <div className="kit-section kit-built-wrap"><BuiltBy /></div>
    <DecisionMath />
    <Stories />
    <Suite />
    <ExitOverlay buyHref="#kit-hero" buyLabel={`Add ${kit.name}, $59`} />
  </>;
}

export default function Kits() {
  const { slug } = useParams();
  const kit = catalogue.find(item => item.slug === slug);
  return <MindmakeShell onStart={() => window.location.assign("/?start=1")} siteClassName="kits-site" mainClassName="kits-main" showMobileActionBar={false}>
    <SEO title={kit ? `${kit.name} | Part of your AI brain` : "Parts of your AI brain"} description={kit?.problem ?? "Start your AI brain one module at a time."} canonical={`/brain-modules${slug ? `/${slug}` : ""}`} noindex />
    {slug ? kit ? <Detail key={kit.slug} kit={kit} /> : <section className="kit-section kit-missing"><h1>This brain module is not available.</h1><Link className="kit-button" to="/brain-modules">See the parts <ArrowRight size={18} aria-hidden="true" /></Link></section> : <Catalogue />}

  </MindmakeShell>;
}
