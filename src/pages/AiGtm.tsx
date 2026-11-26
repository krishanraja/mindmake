import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { track } from "@/lib/analytics";
import { SEO } from "@/components/SEO";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import { ProductSprint } from "@/components/mindmake/ProductSprint";
import "@/styles/mindmake.css";
import "@/styles/product-pages.css";
import { START_LABEL_GTM } from "@/lib/publicLinks";
import heroImage from "@/assets/films/aug2026/film-03-poster.jpg";

import productionStill from "@/assets/stories/stencil-correction-r01-800-w600.webp";
import distributionStill from "@/assets/stories/voice-pipe-r01-800-w600.webp";
import rightsStill from "@/assets/stories/updates-seal-r01-800-w600.webp";

const levers = [
  { title: "Production", still: productionStill, line: "Make more of the work that meets your standards.", input: "A trailer gives away the ending.", question: "Where could you cut before the reveal?" },
  { title: "Distribution", still: distributionStill, line: "Give each piece a home that suits it.", input: "An interview has a quiet opening.", question: "Which exchange would bring a new reader to the full piece?" },
  { title: "Monetisation", still: rightsStill, line: "Set the price and the rights for your work.", input: "A licence includes the sequel.", question: "Did you mean to sell the next story too?" },
];

export default function AiGtm() {
  const { briefOpen, briefJourneyKey, openBrief, closeBrief } = useLeadBriefHistory();
  const start = () => openBrief("gtm");
  const startFromHero = () => {
    track("scoping_request", { source: "hero", route: "gtm" });
    start();
  };

  return <MindmakeShell showMobileActionBar={false} mainClassName="product-page" onStart={start} startLabel={START_LABEL_GTM}>
    <SEO title="Build your AI business" description="Decide what to make, where to share it and how to earn from it." canonical="/ai-gtm" />
    <header className="product-hero">
      <img src={heroImage} alt="" />
      <div>
        <h1>Make it, share it, and get paid for it.</h1>
        <p>An AI business built around the work you commission, make and publish.</p>
        <button className="mm-button" data-early-start="gtm" data-mm-primary data-mm-hero onClick={startFromHero}>{START_LABEL_GTM}</button>
      </div>
    </header>
    <section className="product-section product-problem" id="you">
      <h2>More work is easier to make.</h2>
      <p>AI makes content cheap and fast for everyone. Volume alone buys you little.</p>
      <p>What is worth making, where should it go and what is it worth?</p>
    </section>
    <section className="product-section business-inside" id="inside">
      <h2>Make it. Share it. Earn from it.</h2>
      <div className="product-levers">
        {levers.map(lever => <details className="lever-study" key={lever.title} name="business-lever" data-lever={lever.title.toLowerCase()}>
          <summary>
            <span className="lever-frame"><img src={lever.still} loading="lazy" alt="" /></span>
            <strong>{lever.title}</strong><span className="lever-line">{lever.line}</span>
          </summary>
          <div className="lever-reading"><div className="lever-sample" aria-hidden="true">
            {lever.title === "Monetisation" ? <><span>This series</span><span>Sequel rights</span></> : <i />}
          </div><small>Example</small><p>{lever.input}</p><blockquote>{lever.question}</blockquote></div>
        </details>)}
      </div>
    </section>
    <ProductSprint door="gtm" onStart={openBrief} />
    <LeadBrief open={briefOpen} onClose={closeBrief} route="gtm" presentation="drawer" journeyKey={briefJourneyKey} />
  </MindmakeShell>;
}
