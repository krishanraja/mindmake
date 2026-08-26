import { ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MediaFrame } from "@/components/mindmake/MediaFrame";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { RouteRail } from "@/components/mindmake/RouteRail";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import brainFilm from "@/assets/CTRL - Demo 5 - Brain.mp4";
import newsFilm from "@/assets/CTRL - Demo 1 - Newsfeed.mp4";
import brainPoster from "@/assets/ctrl-brain-poster.webp";
import newsPoster from "@/assets/ctrl-newsfeed-poster.webp";
import "@/styles/mindmake.css";

export default function AiBrain() {
  const { briefOpen, openBrief, closeBrief } = useLeadBriefHistory();

  return (
    <MindmakeShell onStart={openBrief} mainClassName="mm-route-page mm-route-brain">
      <SEO
        title="Build Your AI Brain"
        description="Build an AI system that remembers what matters, prepares useful work and helps other people meet your standard."
        canonical="/ai-brain"
      />

      <section className="mm-subhero is-brain" aria-labelledby="brain-title">
        <div className="mm-container mm-subhero-grid">
          <div>
            <h1 id="brain-title">Build an AI that knows how you work.</h1>
            <p className="mm-lead">A prompt can help with one task. A working system remembers what matters, prepares the work and brings the hard calls back to you.</p>
            <button className="mm-button" type="button" onClick={openBrief}>Start here <ArrowRight aria-hidden="true" /></button>
          </div>
          <MediaFrame
            src={brainFilm}
            poster={brainPoster}
            title="CTRL showing a leader's standards, memory and sources around their live work"
            label="Your standards, memory and sources stay visible."
            className="mm-route-hero-media"
          />
        </div>
      </section>

      <section className="mm-section mm-capability" aria-labelledby="capability-title">
        <div className="mm-container">
          <header className="mm-split-heading">
            <div><h2 id="capability-title">Get more from the part of you nobody else can copy.</h2></div>
            <p>Clearing the inbox is only the first step. The bigger gain is getting useful time back, then spending it on work that matters more.</p>
          </header>
          <RouteRail className="mm-capability-steps" label="Ways an AI brain can help">
            <article><h3>Stop carrying every small task.</h3><p>AI prepares routine work and brings you the parts that need your call.</p></article>
            <article><h3>See what matters before you ask.</h3><p>Useful news, past choices and live work arrive together, with the source still visible.</p></article>
            <article className="is-key"><h3>Extend what you can do.</h3><p>Your taste, memory and rules become useful beyond the hours you can personally give.</p></article>
          </RouteRail>
        </div>
      </section>

      <section className="mm-section mm-brain-scenes" aria-labelledby="scenes-title">
        <div className="mm-container">
          <header className="mm-main-event mm-left-event"><h2 id="scenes-title">Find where your best time goes.</h2></header>
          <RouteRail className="mm-person-scenes" label="Examples of an AI brain at work">
            <article><h3>You stop avoiding the work you hate.</h3><p>The system prepares the first version and keeps the routine moving. You only make the calls that need your taste.</p></article>
            <article><h3>You keep the promises that matter.</h3><p>The right check-in arrives with the facts already gathered. You decide and follow through.</p></article>
            <article><h3>Other people can work with the spark in your head.</h3><p>Your examples, rejected ideas and rules show the team what good means without turning you into the bottleneck.</p></article>
            <article><h3>Your network comes back into view.</h3><p>Ask who you already know who could help. AI finds the path. You choose the person and make the human call.</p></article>
          </RouteRail>
        </div>
      </section>

      <section className="mm-section mm-film-pair" aria-labelledby="brain-proof-title">
        <div className="mm-container">
          <header className="mm-split-heading"><div><h2 id="brain-proof-title">The brain can show its work.</h2></div><p>These real CTRL views keep facts, sources and the human call visible.</p></header>
          <RouteRail className="mm-film-grid" label="Real CTRL views">
            <MediaFrame src={brainFilm} poster={brainPoster} title="CTRL showing the facts and links inside a leader's digital brain" label="Facts, links and rules" />
            <MediaFrame src={newsFilm} poster={newsPoster} title="CTRL bringing useful news into a leader's work" label="Intelligence brought to you" />
          </RouteRail>
        </div>
      </section>

      <section className="mm-section mm-relationship-film" aria-labelledby="relationship-title">
        <div className="mm-container mm-relationship-grid">
          <div><h2 id="relationship-title">Someone I already know.</h2><p>A film now in production follows a leader asking one question. Separate parts of their working life come together. Three useful people appear with a reason each. Then the system stops.</p><strong>AI finds the path. The person keeps the relationship.</strong></div>
          <div className="mm-contact-scene" aria-hidden="true">
            <span className="mm-question">Who do I already know who could help with this?</span>
            <div className="mm-contact-sources"><i>Work</i><i>Events</i><i>Writing</i></div>
            <div className="mm-contact-reasons"><b>Good fit</b><b>Shared context</b><b>Worth a call</b></div>
          </div>
        </div>
      </section>

      <section className="mm-section mm-proof-offer" aria-labelledby="brain-proof-offer">
        <div className="mm-container mm-proof-offer-grid">
          <div><h2 id="brain-proof-offer">Prove one part of your AI brain on live work.</h2></div>
          <div><p>Over 30 days, Mindmake starts with one useful job, memory or decision. It builds the smallest system that can help, tests it on work you already trust and leaves it in your hands.</p><ul><li>One clear job</li><li>Your examples and rules</li><li>A first version you can use</li><li>Real use before the month ends</li></ul><button className="mm-button" type="button" onClick={openBrief}>Start here <ArrowRight aria-hidden="true" /></button></div>
        </div>
      </section>

      <LeadBrief open={briefOpen} onClose={closeBrief} route="brain" />
    </MindmakeShell>
  );
}
