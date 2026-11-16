import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowDown, ArrowLeft, ArrowRight, BriefcaseBusiness, ChartNoAxesCombined, Check, Landmark, Megaphone } from "lucide-react";
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

function Sample({ kit }: { kit: Kit }) {
  return <figure className="kit-output">
    <figcaption><span className="kit-label">{kit.status === "sample" ? "Invented sample output" : "Sample output"}</span><strong>{kit.sample.title}</strong></figcaption>
    <dl>{kit.sample.rows.map(row => <div key={row.label}><dt>{row.label}</dt><dd>{row.text}</dd></div>)}</dl>
  </figure>;
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
    {state === "loading" ? "Opening checkout…" : "Get it, $59"}<ArrowRight size={18} aria-hidden="true" />
  </button><div className="kit-buy-status" role="status">{state === "sample" ? "Invented layout sample. This kit is not for sale." : state === "error" ? "Checkout is unavailable. Please try again." : ""}</div></div>;
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
    <section className="kit-section kit-hero" id="kit-hero">
      <div><p className="kit-label">MINDMAKE KITS</p>
        <h1>The work you would hand a chief of staff, <em>installed into your AI.</em></h1>
        <p className="kit-lede">Each kit is a small piece of working software that plugs into Claude in one click. It does one senior job on your own files and shows you the result in five minutes. Not a prompt. Not a template.</p>
        <a className="kit-button" href="#kit-catalogue">See the kits <ArrowDown size={18} aria-hidden="true" /></a>
        <ul className="kit-checks">{["Runs on your computer. Nothing is sent to us.", "Works inside your own Claude.", refund].map(text => <li key={text}><Check size={16} aria-hidden="true" />{text}</li>)}</ul>
      </div>
      <div className="kit-hero-object">{catalogue[0] ? <Sample kit={catalogue[0]} /> : <div className="kit-coming"><span className="kit-label">MINDMAKE KITS</span><p>First kits arrive shortly</p></div>}</div>
    </section>
    <section className="kit-section kit-audience" aria-label="Who it is for">{[
      { Icon: BriefcaseBusiness, title: "You run the company.", body: "Decisions that land on your desk, made faster and checked." },
      { Icon: ChartNoAxesCombined, title: "You own the number.", body: "Pipeline, pricing and forecasts you can defend." },
      { Icon: Megaphone, title: "You run the market.", body: "Spend, positioning and messages that hold up." },
      { Icon: Landmark, title: "You back companies.", body: "Diligence and board work without the busywork." },
    ].map(({ Icon, title, body }) => <div key={title}><Icon strokeWidth={1.3} aria-hidden="true" /><h2>{title}</h2><p>{body}</p></div>)}</section>
    <section className="kit-dark"><div className="kit-section"><p className="kit-label">WHY THIS IS NOT A PROMPT</p><h2>A prompt asks your AI to guess. <em>A kit gives it a method.</em></h2><p>Every kit carries the rules, checks and steps a good operator would use, written down and tested. So the answer on Tuesday matches the answer on Monday, and you can see why it said what it said.</p></div></section>
    <section className="kit-section" id="kit-catalogue"><h2>Pick the job you want off your desk.</h2>
      {catalogue.length ? <div className="kit-grid">{catalogue.map(kit => <article className="kit-card" key={kit.slug}>
        {kit.status === "sample" && <p className="kit-label kit-sample-label">Invented layout sample</p>}<h3><Link to={`/kits/${kit.slug}`}>{kit.name}</Link></h3><p>{kit.problem}</p><Link className="kit-card-link" to={`/kits/${kit.slug}`}>Get it, $59 <ArrowRight size={18} aria-hidden="true" /></Link>
      </article>)}</div> : <p className="kit-empty">First kits arrive shortly</p>}
    </section>
    <section className="kit-section kit-how" aria-labelledby="kit-how-title"><h2 id="kit-how-title">How it works</h2><ol>{["Buy once. You get a download link by email.", "Open it. Claude installs it in one click.", "Use it. Point it at your own files and read the result."].map((text, i) => <li key={text}><span className="kit-label">0{i + 1}</span><p>{text}</p></li>)}</ol></section>
    {catalogue.length > 1 && <section className="kit-section kit-samples" aria-label="Sample outputs"><Sample kit={catalogue[0]} /><Sample kit={catalogue[1]} /></section>}
    <Quotes />
    <section className="kit-section kit-faq" aria-labelledby="kit-faq-title"><h2 id="kit-faq-title">Questions before you start</h2>
      <details><summary>What do I need?</summary><p>Claude Desktop on a Mac or Windows computer. A free Claude account works; a paid plan gives you more room.</p></details>
      <details><summary>Does my data leave my computer?</summary><p>A kit runs on your computer with your own Claude. We never see your files, and the kit never calls us. Content you share with Claude is processed by Anthropic under your Claude account’s data settings.</p></details>
      <details><summary>What if it does not help?</summary><p>Email us within 14 days for a full refund. No questions.</p><a href={`mailto:${CONTACT_EMAIL}`}>Email Mindmake</a></details>
      <details><summary>Is this the same as working with Mindmake?</summary><p>No. A kit does one job well. When you want an AI that knows your standards and judgement across your work, that is what we build with you, one to one. <Link to="/?start=1">Start here.</Link></p></details>
    </section>
    <section className="kit-section kit-close"><h2>One job off your desk this week.</h2><a className="kit-button" href="#kit-catalogue">See the kits <ArrowUpRight /></a></section>
  </>;
}

function ArrowUpRight() { return <ArrowRight size={18} aria-hidden="true" />; }

function Detail({ kit }: { kit: Kit }) {
  const { search } = useLocation();
  const [returned, setReturned] = useState<string | null>(null);
  useEffect(() => setReturned(new URLSearchParams(search).get("checkout")), [search]);
  return <>
    <section className="kit-section kit-hero" id="kit-hero"><div><Link className="kit-back" to="/kits"><ArrowLeft size={16} aria-hidden="true" /> All kits</Link><p className="kit-label">{kit.status === "sample" ? "INVENTED LAYOUT SAMPLE" : "MINDMAKE KITS"}</p><h1>{kit.name}</h1><p className="kit-lede">{kit.problem}</p><p>{kit.who}</p><Buy kit={kit} /><p className="kit-refund">{refund}</p>{returned && <p role="status">{returned === "success" ? "Your download link will arrive by email after payment is confirmed." : "Checkout cancelled. You can try again when you are ready."}</p>}</div><Sample kit={kit} /></section>
    <section className="kit-section kit-detail-content"><div><h2>What you get</h2><ul className="kit-checks">{kit.does.map(text => <li key={text}><Check size={18} aria-hidden="true" />{text}</li>)}</ul></div><div><h2>Your first five minutes</h2><ol className="kit-steps">{kit.firstFiveMinutes.map(text => <li key={text}>{text}</li>)}</ol></div></section>
    <section className="kit-section kit-requirements"><h2>Requirements</h2><ul>{kit.requirements.map(text => <li key={text}>{text}</li>)}</ul><p>{refund} <a href={`mailto:${CONTACT_EMAIL}`}>Email Mindmake</a></p><Buy kit={kit} /><Link className="kit-back" to={`/${kit.door}`}>{kit.door === "ai-brain" ? "Build your AI brain" : "Build your AI business"}<ArrowRight size={16} aria-hidden="true" /></Link></section>
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
    <SEO title={kit ? kit.name : "Mindmake kits"} description={kit?.problem ?? "The work you would hand a chief of staff, installed into your AI."} canonical={`/kits${slug ? `/${slug}` : ""}`} noindex={Boolean((slug && !kit) || kit?.status === "sample")} />
    {slug ? kit ? <Detail kit={kit} /> : <section className="kit-section kit-missing"><h1>This kit is not available.</h1><Link className="kit-button" to="/kits">See the kits <ArrowRight size={18} aria-hidden="true" /></Link></section> : <Catalogue />}
    {sticky && <aside className="kit-sticky" aria-label="Kits purchase"><span>{kit?.name ?? "MINDMAKE KITS"}</span>{kit ? <Buy kit={kit} /> : <a className="kit-button" href="#kit-catalogue">See the kits <ArrowUpRight /></a>}</aside>}
  </MindmakeShell>;
}
