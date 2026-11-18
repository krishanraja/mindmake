import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowDown, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { SEO } from "@/components/SEO";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { kits, visibleKits, type Kit } from "@/content/kits";
import { PartsFaqDrawer } from "@/components/ui/parts-faq-drawer";
import { BouncyAccordion } from "@/components/ui/bouncy-accordion";
import { PartsEvidenceChart } from "@/components/ui/parts-evidence-chart";
import { PartsSampleOutput } from "@/components/ui/parts-sample-output";
import { SquareGrid } from "@/components/ui/square-grid";
import { BuiltBy, DecisionMath, ExitOverlay, Stories } from "@/components/ui/parts-proof";
import "@fontsource-variable/newsreader/wght-italic.css";
import "@/styles/mindmake.css";
import "@/styles/kits.css";

const catalogue = visibleKits(kits, __KITS_PREVIEW__ ? "preview" : "production");
const refund = "Full refund within 14 days, no questions asked.";
// The promise made to every buyer (Krish, 18 November 2026). Checkout and the receipt carry the full wording.
const promise = "No marketing emails, ever. We check in with you once, personally, and if the part is not working, we run a free session with you.";

function Suite() {
  return <section className="kit-section kit-suite" aria-labelledby="kit-suite-title">
    <h2 id="kit-suite-title">Want the whole brain, not one part?</h2>
    <p>Each part does one job. Mindmake builds your whole AI brain with you, around your standards and the decisions you make.</p>
    <div className="kit-suite-actions"><a className="kit-button" href="/?start=1">Start building your AI brain <ArrowRight size={18} aria-hidden="true" /></a><Link className="kit-back" to="/">See everything Mindmake does <ArrowRight size={16} aria-hidden="true" /></Link></div>
    <p className="kit-audit">Not ready to buy? Try <Link to="/who-decided">Who decided?</Link>, free.</p>
  </section>;
}

function Strengthens({ kit }: { kit: Kit }) {
  return <aside className="kit-output" aria-labelledby="kit-strengthens-title">
    <h2 id="kit-strengthens-title">What it strengthens</h2><p>{kit.strengthens}</p>
  </aside>;
}

function Buy({ kit }: { kit: Kit }) {
  const [state, setState] = useState<"idle" | "loading" | "error" | "sample">("idle");
  const requestId = useRef<string>();
  const buy = async () => {
    if (kit.status === "sample") { setState("sample"); return; }
    if (state === "loading") return;
    setState("loading");
    try {
      requestId.current ??= crypto.randomUUID();
      const base = import.meta.env.VITE_SUPABASE_URL;
      if (!base) throw new Error("Unavailable");
      const response = await fetch(`${base}/functions/v1/kits-checkout`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: kit.slug, requestId: requestId.current }),
      });
      const result = await response.json();
      if (!response.ok || typeof result.url !== "string" || new URL(result.url).origin !== "https://checkout.stripe.com") throw new Error("Unavailable");
      window.location.assign(result.url);
    } catch { setState("error"); }
  };
  return <div className="kit-buy"><div className="parts-price-actions"><button className="kit-button" onClick={buy} disabled={state === "loading"}>
    {state === "loading" ? <>Opening checkout…<SquareGrid /></> : <>Add this part, $59<ArrowRight size={18} aria-hidden="true" /></>}
  </button><PartsFaqDrawer /></div><p className="kit-refund">{refund}</p><p className="kit-promise">{promise}</p><div className="kit-buy-status" role="status">{state === "sample" ? "This part is not available." : state === "error" ? "Checkout is unavailable. Please try again." : ""}</div></div>;
}

function Catalogue() {
  return <>
    <section className="kit-section kit-hero kit-hero-catalogue" id="kit-hero">
      <div><p className="kit-label">PARTS OF YOUR AI BRAIN</p>
        <h1>Start your AI brain <em>one part at a time.</em></h1>
        <p className="kit-lede kit-explanation">Your AI brain is your judgement, written down so AI can use it. Each part does one job you'd do before a decision, using your own files and your own rules, and then hands the decision back to you.</p>
        <p className="kit-lede">Each part plugs into Claude in one click, runs on your own files and shows you the result in five minutes.</p>
        <a className="kit-button" href="#kit-catalogue">See the parts <ArrowDown size={18} aria-hidden="true" /></a>
        <ul className="kit-checks">{["Runs on your computer. Your files are never sent to us.", "Works inside your own Claude.", refund].map(text => <li key={text}><Check size={16} aria-hidden="true" />{text}</li>)}</ul>
        <p className="kit-audit">Not sure where to start? Try <Link to="/who-decided">Who decided?</Link>, a free 20-minute audit of one real decision.</p>
      </div><PartsSampleOutput />
    </section>
    <div className="kit-section kit-built-wrap"><BuiltBy /></div>
    <section className="kit-dark"><div className="kit-section"><p className="kit-label">WHY PARTS, NOT PROMPTS</p><h2>AI makes strong judgement stronger and weak judgement weaker. <em>Each part makes yours stronger.</em></h2><p>A prompt asks your AI to guess. A part gives it the rules, checks and steps a good operator would use, written down and tested, so you can see why it said what it said. Then it tells you what only you can judge.</p><PartsEvidenceChart /></div></section>
    <section className="kit-section" id="kit-catalogue"><h2>Pick the job you want done before your next decision.</h2>
      <div className="kit-grid">{catalogue.map(kit => <article className="kit-card" key={kit.slug}>
        <h3><Link to={`/parts/${kit.slug}`}>{kit.name}</Link></h3><p>{kit.problem}</p><div className="parts-card-price"><div className="parts-price-actions"><Link className="kit-card-link" to={`/parts/${kit.slug}`}>Add this part, $59 <ArrowRight size={18} aria-hidden="true" /></Link><PartsFaqDrawer /></div><p className="kit-refund">{refund}</p></div>
      </article>)}</div>
    </section>
    <DecisionMath />
    <section className="kit-section kit-how" aria-labelledby="kit-how-title"><h2 id="kit-how-title">How it works</h2><ol>{["Buy once. You get a download link by email, to set up on a Mac or Windows computer.", "Open it. Claude adds it in one click.", "Use it. Point it at your own files, read the result, and make the call."].map((text, i) => <li key={text}><span className="kit-label">0{i + 1}</span><p>{text}</p></li>)}</ol></section>
    <Stories />
    <Suite />
    <section className="kit-section kit-faq" aria-labelledby="kit-faq-title"><h2 id="kit-faq-title"><PartsFaqDrawer heading /></h2></section>
    <section className="kit-section kit-close"><h2>Strengthen one part of your judgement this week.</h2><a className="kit-button" href="#kit-catalogue">See the parts <ArrowUpRight /></a></section>
    <ExitOverlay buyHref="#kit-catalogue" buyLabel="Choose a part, $59" />
  </>;
}

function ArrowUpRight() { return <ArrowRight size={18} aria-hidden="true" />; }

function Detail({ kit }: { kit: Kit }) {
  const { search } = useLocation();
  const [returned, setReturned] = useState<string | null>(null);
  useEffect(() => setReturned(new URLSearchParams(search).get("checkout")), [search]);
  return <>
    <section className="kit-section kit-hero" id="kit-hero"><div><Link className="kit-back" to="/parts"><ArrowLeft size={16} aria-hidden="true" /> All parts</Link><p className="kit-label">PART OF YOUR AI BRAIN</p><h1>{kit.name}</h1><p className="kit-lede">{kit.problem}</p>{kit.slug === "audit-a-decision" && <p className="kit-audit">Try it free first: <Link to="/who-decided">Who decided?</Link> is the same six questions for one decision.</p>}<Buy key={kit.slug} kit={kit} />{returned && <p role="status">{returned === "success" ? "Your download link will arrive by email after payment is confirmed. We will check in once, personally, and never send you marketing." : "Checkout cancelled. You can try again when you are ready."}</p>}</div><Strengthens kit={kit} /></section>
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
    <SEO title={kit ? `${kit.name} | Part of your AI brain` : "Parts of your AI brain"} description={kit?.problem ?? "Start your AI brain one part at a time."} canonical={`/parts${slug ? `/${slug}` : ""}`} noindex />
    {slug ? kit ? <Detail key={kit.slug} kit={kit} /> : <section className="kit-section kit-missing"><h1>This part is not available.</h1><Link className="kit-button" to="/parts">See the parts <ArrowRight size={18} aria-hidden="true" /></Link></section> : <Catalogue />}

  </MindmakeShell>;
}
