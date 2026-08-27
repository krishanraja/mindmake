import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeOpeningAct } from "@/components/mindmake/MindmakeOpeningAct";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { CareerReferenceDeck } from "@/components/mindmake/ProofDeck";
import { RouteRail } from "@/components/mindmake/RouteRail";
import { ScrollEvidenceMark } from "@/components/mindmake/ScrollEvidenceMark";
import { attendeeBrands, homepageResultStories } from "@/data/rebuildProof";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import "@/styles/mindmake.css";
import "@/styles/mindmake-opening-act.css";

export default function Index() {
  const { briefOpen, openBrief, closeBrief } = useLeadBriefHistory();

  return (
    <MindmakeShell onStart={openBrief} headerMode="paper" showStartAction={false} helpHash="#judgement-thread">
      <SEO
        title="Put your best judgement to work with AI"
        description="Mindmake helps leaders turn their judgement into useful AI systems and make better product, price, message and team decisions."
        canonical="/"
      />

      <MindmakeOpeningAct />

      <section className="mm-section mm-results" id="results" aria-labelledby="results-title">
        <div className="mm-container">
          <header className="mm-split-heading mm-results-heading">
            <h2 id="results-title">Decisions that moved the business.</h2>
            <p>These are customer outcomes. Each one shows the hard choice and what became real.</p>
          </header>
          <div className="mm-reach">
            <div><strong>Mindmake has helped leaders across media, software and advisory with what's next in AI.</strong><span>Attended by people from organisations including</span></div>
            <div className="mm-logo-rail" aria-label="Organisations attended by people">
              {attendeeBrands.map((brand) => <img key={brand.name} src={brand.logo} alt={brand.name} />)}
            </div>
          </div>
          <RouteRail className="mm-result-grid" label="Customer outcomes">
            {homepageResultStories.map((story) => (
              <article className={`mm-result-card is-${story.visual}`} key={story.title}>
                <div className="mm-result-visual" aria-hidden="true">
                  {story.visual === "time" && <><span className="mm-crossed">12 months</span><ScrollEvidenceMark /></>}
                  {story.visual === "offer" && <><strong>One clear offer.</strong><span>Expertise → buyer → plan</span></>}
                  {story.visual === "pilots" && <><span>Pilot 01 <b>Signed</b></span><span>Pilot 02 <b>Signed</b></span></>}
                </div>
                <h3>{story.title}</h3>
                <p className="mm-result-body">{story.body}</p>
                <p className="mm-result-context">{story.sector}</p>
              </article>
            ))}
          </RouteRail>
          <Link className="mm-text-link" to="/case-studies">See all eight customer stories <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="mm-section mm-about" id="about" aria-labelledby="about-title">
        <div className="mm-container mm-about-grid">
          <div className="mm-portrait-stage"><img className="mm-headshot" src="/Krish-Headshot.png" alt="Krish Raja" /></div>
          <div>
            <h2 id="about-title">The decision and the build belong together.</h2>
            <p>I have spent 17 years helping companies make better products and plans with data and technology. For the last two years, I have built with AI every day. I help leaders decide what to do, then build enough to see whether it works.</p>
            <CareerReferenceDeck />
            <button className="mm-button" type="button" onClick={openBrief}>Start here <ArrowRight aria-hidden="true" /></button>
          </div>
        </div>
      </section>

      <section className="mm-section mm-media-section" aria-labelledby="media-title">
        <div className="mm-container mm-media-grid">
          <div><h2 id="media-title">Useful ideas by email.</h2><p>Two clear lenses on AI: how people build with it and how companies make money from it.</p><a className="mm-button" href="https://mindmakerlive.substack.com" target="_blank" rel="noreferrer">Read and subscribe <ArrowRight aria-hidden="true" /></a></div>
          <RouteRail className="mm-media-covers" label="Mindmake media topics">
            <article><strong>building with AI:</strong><span>How people and teams make better work.</span></article>
            <article><strong>the money of AI:</strong><span>How products and markets are changing.</span></article>
          </RouteRail>
        </div>
      </section>

      <section className="mm-final" aria-labelledby="final-title">
        <div className="mm-container mm-final-grid">
          <div><h2 id="final-title">Make it clearer. Build what helps. Keep it.</h2><p>Mindmake will read the business first, then give you a useful private recommendation.</p><button className="mm-button" type="button" onClick={openBrief}>Start here <ArrowRight aria-hidden="true" /></button></div>
          <img src="/favicon.svg" alt="" aria-hidden="true" />
        </div>
      </section>

      <LeadBrief open={briefOpen} onClose={closeBrief} />
    </MindmakeShell>
  );
}
