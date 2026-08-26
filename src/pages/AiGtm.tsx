import { ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MediaFrame } from "@/components/mindmake/MediaFrame";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { RouteRail } from "@/components/mindmake/RouteRail";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import headlinesFilm from "@/assets/CTRL - Demo 3 - Headlines.mp4";
import decisionsFilm from "@/assets/CTRL - Demo 4 - Decisions.mp4";
import headlinesPoster from "@/assets/ctrl-headlines-poster.webp";
import decisionsPoster from "@/assets/ctrl-decisions-poster.webp";
import "@/styles/mindmake.css";

export default function AiGtm() {
  const { briefOpen, openBrief, closeBrief } = useLeadBriefHistory();

  return (
    <MindmakeShell onStart={openBrief} mainClassName="mm-route-page mm-route-gtm">
      <SEO
        title="Build Your AI GTM"
        description="Use AI to make better product, price, message and team decisions, then test the answer with real buyers."
        canonical="/ai-gtm"
      />

      <section className="mm-subhero is-gtm" aria-labelledby="gtm-title">
        <div className="mm-container mm-subhero-grid">
          <div>
            <h1 id="gtm-title">Build the offer your market needs now.</h1>
            <p className="mm-lead">AI changes what customers can do, what they will pay for and how quickly a new company can move. Mindmake helps you make the next product, price, message and team call.</p>
            <button className="mm-button" type="button" onClick={openBrief}>Start here <ArrowRight aria-hidden="true" /></button>
          </div>
          <MediaFrame
            src={decisionsFilm}
            poster={decisionsPoster}
            title="CTRL breaking down a live product, price, message and team decision"
            label="See the evidence, the choice and the next move."
            className="mm-route-hero-media"
          />
        </div>
      </section>

      <section className="mm-section mm-two-markets" aria-labelledby="two-markets-title">
        <div className="mm-container">
          <header className="mm-split-heading"><div><h2 id="two-markets-title">Growth creates hard choices too.</h2></div><p>Mindmake is for businesses trying to lead the change as well as those trying to catch it.</p></header>
          <RouteRail className="mm-market-columns" label="AI GTM situations">
            <article><h3>The old reason to buy may be getting weaker.</h3><p><strong>For an established business.</strong> Customers can start more work alone. A feature can be copied faster. The old price and promise no longer line up.</p><strong>Find what remains worth paying for.</strong></article>
            <article><h3>The market moves before the old rules can catch up.</h3><p><strong>For an AI company growing fast.</strong> The product changes each week. You are still finding the right buyer. Your price, proof and team roles cannot wait for the old rules to catch up.</p><strong>Turn speed into a business that can keep growing.</strong></article>
          </RouteRail>
        </div>
      </section>

      <section className="mm-section mm-gtm-decisions" aria-labelledby="gtm-decisions-title">
        <div className="mm-container">
          <header className="mm-main-event mm-left-event"><h2 id="gtm-decisions-title">A new message cannot save an old offer.</h2></header>
          <RouteRail className="mm-decision-quadrants" label="The four parts of an AI GTM decision">
            <article><span>Product</span><h3>What should AI make possible now?</h3><p>The useful job may change when a customer can do more alone.</p></article>
            <article><span>Price</span><h3>What is the result worth now?</h3><p>The buyer may pay for a different gain than the effort you used to sell.</p></article>
            <article><span>Message</span><h3>What can only you promise?</h3><p>A useful promise says what changed, who it is for and what the buyer can now do.</p></article>
            <article><span>Team</span><h3>Who should own the whole decision?</h3><p>The right owner follows the work that remains, not job lines written for the old model.</p></article>
          </RouteRail>
        </div>
      </section>

      <section className="mm-section mm-film-pair" aria-labelledby="gtm-proof-title">
        <div className="mm-container">
          <header className="mm-split-heading"><div><h2 id="gtm-proof-title">See what changed. Make a decision you can explain.</h2></div><p>CTRL keeps what is changing in the market next to the reasons behind the call.</p></header>
          <RouteRail className="mm-film-grid" label="Real CTRL views">
            <MediaFrame src={headlinesFilm} poster={headlinesPoster} title="CTRL bringing live market headlines into the work" label="What changed outside" />
            <MediaFrame src={decisionsFilm} poster={decisionsPoster} title="CTRL breaking down and checking a business decision" label="What the business should do" />
          </RouteRail>
        </div>
      </section>

      <section className="mm-section mm-proof-offer is-gtm" aria-labelledby="gtm-proof-offer">
        <div className="mm-container mm-proof-offer-grid">
          <div><h2 id="gtm-proof-offer">Test one big business decision in 30 days.</h2></div>
          <div><p>Mindmake starts with one costly question about the product, price or offer. It finds what changed, helps you make the hard choice and builds enough to test it with real buyers.</p><ul><li>One clear business question</li><li>Market and company evidence</li><li>A first version you can use</li><li>A real test before the month ends</li></ul><button className="mm-button" type="button" onClick={openBrief}>Start here <ArrowRight aria-hidden="true" /></button></div>
        </div>
      </section>

      <LeadBrief open={briefOpen} onClose={closeBrief} route="gtm" />
    </MindmakeShell>
  );
}
