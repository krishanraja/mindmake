import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowDown, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { SEO } from "@/components/SEO";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { kits, visibleKits, type Kit } from "@/content/kits";
import { testimonials } from "@/data/testimonials";
import { CONTACT_EMAIL } from "@/lib/publicLinks";
import "@fontsource-variable/newsreader/wght-italic.css";
import "@/styles/mindmake.css";
import "@/styles/kits.css";

const catalogue = visibleKits(kits, __KITS_PREVIEW__ ? "preview" : "production");
// Checked verbatim against stories-export.md, section 5, 16 November 2026.
const quoteIds = ["thrave", "data-infra-cro", "media-cro", "coaching-founder", "services-ceo"];
const quotes = quoteIds.map(id => testimonials.find(quote => quote.id === id)!);
const refund = "Full refund within 14 days, no questions asked.";

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
  return <div className="kit-buy"><button className="kit-button" onClick={buy} disabled={state === "loading"}>
    {state === "loading" ? "Opening checkout…" : "Add this part, $59"}<ArrowRight size={18} aria-hidden="true" />
  </button><div className="kit-buy-status" role="status">{state === "sample" ? "This part is not available." : state === "error" ? "Checkout is unavailable. Please try again." : ""}</div></div>;
}

function Quotes() {
  const [active, setActive] = useState(0);
  return <section className="kit-section kit-quotes" aria-labelledby="kit-quotes-title">
    <h2 id="kit-quotes-title">What leaders say about working with Mindmake</h2>
    <div className="kit-quote-stack" aria-live="polite">{quotes.map((quote, index) => <figure key={quote.id} aria-hidden={index !== active} className={index === active ? "is-current" : ""}>
      <blockquote>“{quote.full}”</blockquote><figcaption>{quote.name && <strong>{quote.name}<br /></strong>}{quote.role}</figcaption>
    </figure>)}</div>
    <div className="kit-quote-controls"><button aria-label="Previous quote" onClick={() => setActive((active + quotes.length - 1) % quotes.length)}><ArrowLeft aria-hidden="true" /></button><span className="kit-label">{active + 1} / {quotes.length}</span><button aria-label="Next quote" onClick={() => setActive((active + 1) % quotes.length)}><ArrowRight aria-hidden="true" /></button></div>
  </section>;
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
      </div>
    </section>
    <section className="kit-dark"><div className="kit-section"><p className="kit-label">WHY PARTS, NOT PROMPTS</p><h2>AI makes strong judgement stronger and weak judgement weaker. <em>Each part makes yours stronger.</em></h2><p>A prompt asks your AI to guess. A part gives it the rules, checks and steps a good operator would use, written down and tested, so you can see why it said what it said. Then it tells you what only you can judge.</p><p className="kit-source">Across 106 experiments, people working with AI did better when they were already better than the AI at the task, and worse when they were not. Vaccaro, Almaatouq and Malone, Nature Human Behaviour, 2024.</p></div></section>
    <section className="kit-section" id="kit-catalogue"><h2>Pick the job you want done before your next decision.</h2>
      <div className="kit-grid">{catalogue.map(kit => <article className="kit-card" key={kit.slug}>
        <h3><Link to={`/parts/${kit.slug}`}>{kit.name}</Link></h3><p>{kit.problem}</p><Link className="kit-card-link" to={`/parts/${kit.slug}`}>Add this part, $59 <ArrowRight size={18} aria-hidden="true" /></Link>
      </article>)}</div>
    </section>
    <section className="kit-section kit-how" aria-labelledby="kit-how-title"><h2 id="kit-how-title">How it works</h2><ol>{["Buy once. You get a download link by email.", "Open it. Claude adds it in one click.", "Use it. Point it at your own files, read the result, and make the call."].map((text, i) => <li key={text}><span className="kit-label">0{i + 1}</span><p>{text}</p></li>)}</ol></section>
    <Quotes />
    <section className="kit-section kit-faq" aria-labelledby="kit-faq-title"><h2 id="kit-faq-title">Questions before you start</h2>
      <details><summary>What do I need?</summary><p>Claude Desktop on a Mac or Windows computer. A free Claude account works; a paid plan gives you more room.</p></details>
      <details><summary>Does my data leave my computer?</summary><p>A part of your AI brain runs on your computer with your own Claude. We never see your files, and the part never calls us. Content you share with Claude is processed by Anthropic under your Claude account’s data settings.</p></details>
      <details><summary>What if it does not help?</summary><p>Email us within 14 days for a full refund. No questions.</p><a href={`mailto:${CONTACT_EMAIL}`}>Email Mindmake</a></details>
      <details><summary>Is this the same as working with Mindmake?</summary><p>No. Each part strengthens one kind of judgement. When you want the whole brain, built around your standards and the decisions you make, that is what we build with you, one to one. <Link to="/?start=1">Start here.</Link></p></details>
    </section>
    <section className="kit-section kit-close"><h2>Strengthen one part of your judgement this week.</h2><a className="kit-button" href="#kit-catalogue">See the parts <ArrowUpRight /></a></section>
  </>;
}

function ArrowUpRight() { return <ArrowRight size={18} aria-hidden="true" />; }

function Detail({ kit }: { kit: Kit }) {
  const { search } = useLocation();
  const [returned, setReturned] = useState<string | null>(null);
  useEffect(() => setReturned(new URLSearchParams(search).get("checkout")), [search]);
  return <>
    <section className="kit-section kit-hero" id="kit-hero"><div><Link className="kit-back" to="/parts"><ArrowLeft size={16} aria-hidden="true" /> All parts</Link><p className="kit-label">PART OF YOUR AI BRAIN</p><h1>{kit.name}</h1><p className="kit-lede">{kit.problem}</p>{kit.slug === "audit-a-decision" && <p className="kit-audit">Try it free first: <Link to="/who-decided">Who decided?</Link> is the same six questions for one decision.</p>}<Buy key={kit.slug} kit={kit} /><p className="kit-refund">{refund}</p>{returned && <p role="status">{returned === "success" ? "Your download link will arrive by email after payment is confirmed." : "Checkout cancelled. You can try again when you are ready."}</p>}</div><Strengthens kit={kit} /></section>
    <section className="kit-section kit-detail-content"><div><h2>What you get</h2><ul className="kit-checks">{kit.does.map(text => <li key={text}><Check size={18} aria-hidden="true" />{text}</li>)}</ul></div><div><h2>Your first five minutes</h2><ol className="kit-steps">{kit.firstFiveMinutes.map(text => <li key={text}>{text}</li>)}</ol></div></section>
    <section className="kit-section kit-detail-content kit-judgement"><div><h2>What it checks</h2><p>{kit.checks}</p></div><div><h2>What only you can judge</h2><p>{kit.whoDecided}</p></div></section>
    <section className="kit-section kit-requirements"><h2>Requirements</h2><ul>{kit.requirements.map(text => <li key={text}>{text}</li>)}</ul><p>{refund} <a href={`mailto:${CONTACT_EMAIL}`}>Email Mindmake</a></p><Buy key={kit.slug} kit={kit} /><Link className="kit-back" to={`/${kit.door}`}>{kit.door === "ai-brain" ? "Build your AI brain" : "Build your AI business"}<ArrowRight size={16} aria-hidden="true" /></Link></section>
  </>;
}

export default function Kits() {
  const { slug } = useParams();
  const kit = catalogue.find(item => item.slug === slug);
  const [sticky, setSticky] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("kit-hero");
    if (!hero) return;
    const footer = document.querySelector(".kits-site .mm-footer");
    const update = () => setSticky(hero.getBoundingClientRect().bottom < 0 && (!footer || footer.getBoundingClientRect().top > window.innerHeight));
    const observer = new IntersectionObserver(update);
    observer.observe(hero);
    if (footer) observer.observe(footer);
    return () => { observer.disconnect(); setSticky(false); };
  }, [slug]);
  return <MindmakeShell onStart={() => window.location.assign("/?start=1")} siteClassName="kits-site" mainClassName="kits-main" showMobileActionBar={false}>
    <SEO title={kit ? `${kit.name} | Part of your AI brain` : "Parts of your AI brain"} description={kit?.problem ?? "Start your AI brain one part at a time."} canonical={`/parts${slug ? `/${slug}` : ""}`} noindex />
    {slug ? kit ? <Detail key={kit.slug} kit={kit} /> : <section className="kit-section kit-missing"><h1>This part is not available.</h1><Link className="kit-button" to="/parts">See the parts <ArrowRight size={18} aria-hidden="true" /></Link></section> : <Catalogue />}
    {sticky && <aside className="kit-sticky" aria-label="Add a part to your AI brain"><span>{kit?.name ?? "PARTS OF YOUR AI BRAIN"}</span>{kit ? <Buy key={kit.slug} kit={kit} /> : <a className="kit-button" href="#kit-catalogue">See the parts <ArrowUpRight /></a>}</aside>}
  </MindmakeShell>;
}
