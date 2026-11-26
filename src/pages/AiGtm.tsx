import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { track } from "@/lib/analytics";
import { SEO } from "@/components/SEO";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import { ProductSprint, DepthTile } from "@/components/mindmake/ProductSprint";
import "@/styles/mindmake.css";
import "@/styles/product-pages.css";
import { START_LABEL_GTM } from "@/lib/publicLinks";
import heroImage from "@/assets/films/aug2026/film-03-poster.jpg";

export default function AiGtm() {
  const { briefOpen, briefJourneyKey, openBrief, closeBrief } = useLeadBriefHistory();
  const start = () => openBrief("gtm");
  const startFromHero = () => {
    track("scoping_request", { source: "hero", route: "gtm" });
    start();
  };

  return <MindmakeShell mainClassName="product-page" onStart={start} startLabel={START_LABEL_GTM}>
    <SEO title="Build your AI business" description="Decide what to make, where to share it and how to earn from it." canonical="/ai-gtm" />
    <header className="product-hero">
      <img src={heroImage} alt="" />
      <div>
        <h1>Make more of your best work, get it in front of the right people, and get paid properly for it.</h1>
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
          <DepthTile title="Production" line="Make more of the work that meets your standards." detail="Set a brief against work you rate. Choose the idea worth making and keep the detail that earns its place." />
          <DepthTile title="Distribution" line="Give each piece a home that suits it." detail="Compare the full cut with a clip or a newsletter. Keep the point of the piece wherever it travels." />
          <DepthTile title="Monetisation" line="Set the price and the rights for your work." detail="Package a series or license a format. When an offer includes the sequel, your AI brain asks which rights you meant to sell." />
      </div>
    </section>
    <ProductSprint door="gtm" onStart={openBrief} />
    <LeadBrief open={briefOpen} onClose={closeBrief} route="gtm" presentation="drawer" journeyKey={briefJourneyKey} />
  </MindmakeShell>;
}
