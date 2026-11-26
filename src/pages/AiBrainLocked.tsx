import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { track } from "@/lib/analytics";
import { SEO } from "@/components/SEO";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import { ProductSprint, DepthTile } from "@/components/mindmake/ProductSprint";
import "@/styles/mindmake.css";
import "@/styles/product-pages.css";
import { LiquidBrain } from "@/components/mindmake/LiquidBrain";
import { START_LABEL } from "@/lib/publicLinks";
import heroImage from "@/assets/films/aug2026/film-02-poster.jpg";

export default function AiBrainLocked() {
  const { briefOpen, briefJourneyKey, openBrief, closeBrief } = useLeadBriefHistory();
  const start = () => openBrief("brain");
  const startFromHero = () => {
    track("scoping_request", { source: "hero", route: "brain" });
    start();
  };

  return <MindmakeShell showMobileActionBar={false} mainClassName="product-page" onStart={start} startLabel={START_LABEL}>
    <SEO title="Build your AI brain" description="An AI brain keeps your ideas, memories and plans in a private record you own." canonical="/ai-brain" />
    <header className="product-hero">
      <img src={heroImage} alt="" />
      <div>
        <h1>Teach your AI what experience taught you.</h1>
        <p>An AI brain keeps your ideas, memories and plans in a private record you own. You choose which parts your AI checks before it gives you advice.</p>
        <button className="mm-button" data-early-start="brain" data-mm-primary data-mm-hero onClick={startFromHero}>{START_LABEL}</button>
      </div>
    </header>
    <section className="product-section product-problem" id="you">
      <h2>The questions only you can answer.</h2>
      <p>If you switched AI tools tomorrow, what would you have to teach the next one?</p>
      <p>You gave a customer a discount because delivery was late. At renewal, your AI sees last year’s price.</p>
    </section>
    <section className="product-section brain-inside" id="inside">
      <div>
        <h2>Your AI brain knows how you think.</h2>
        <p>It holds your goals, taste and standards, so you can trust its answers.</p>
      </div>
      <LiquidBrain />
      <div className="brain-truths">
        <DepthTile group="brain-truth" title="Correct its reading." detail="A guess stays dotted until you say yes. Change the reading when it misses your point." />
        <DepthTile group="brain-truth" title="Weigh a choice." detail="Your own rules come back as questions before a hard call." />
        <DepthTile group="brain-truth" title="Keep control of what you share." detail="Nothing is shared or reused without your say." />
      </div>
    </section>
    <ProductSprint door="brain" onStart={openBrief} />
    <LeadBrief open={briefOpen} onClose={closeBrief} route="brain" presentation="drawer" journeyKey={briefJourneyKey} />
  </MindmakeShell>;
}
