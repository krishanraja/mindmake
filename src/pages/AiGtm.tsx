import { useState } from "react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { CloseBlock } from "@/components/mindmake/CloseBlock";
import { SubscribeBand } from "@/components/mindmake/SubscribeBand";
import { FilmPlate } from "@/components/mindmake/FilmPlate";
import { Instrument } from "@/components/mindmake/Instrument";
import { ScrubText } from "@/components/mindmake/ScrubText";
import { ObjectionChips } from "@/components/mindmake/ObjectionChips";
import { LeverPanel } from "@/components/mindmake/LeverPanel";
import { ProcessTrack } from "@/components/mindmake/ProcessTrack";
import { LiveBoard } from "@/components/mindmake/board/LiveBoard";
import { GtmJourney } from "@/components/mindmake/journeys/GtmJourney";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import { useScrollDriver } from "@/hooks/useScrollDriver";
import { track } from "@/lib/analytics";
import filmThreePoster from "@/assets/films/film-03-poster.jpg";
import filmThreePosterWebp from "@/assets/films/film-03-poster.webp";
import filmThreeLoop from "@/assets/films/film-03-loop.mp4";
import filmThreeLoopWebm from "@/assets/films/film-03-loop.webm";
import filmSixPoster from "@/assets/films/film-06-poster.jpg";
import filmSixPosterWebp from "@/assets/films/film-06-poster.webp";
import filmSixLoop from "@/assets/films/film-06-loop.mp4";
import filmSixLoopWebm from "@/assets/films/film-06-loop.webm";
import "@/styles/mindmake.css";
import "@/styles/mindmake-instruments.css";

export default function AiGtm() {
  const { briefOpen, openBrief, closeBrief } = useLeadBriefHistory();
  const plateRef = useScrollDriver<HTMLDivElement>();
  const [seedDomain, setSeedDomain] = useState<string>();

  const startFromJourney = (domain: string) => {
    setSeedDomain(domain);
    openBrief();
  };

  return (
    <MindmakeShell onStart={openBrief}>
      <SEO
        title="Build your AI GTM"
        description="AI is changing what customers will pay for. We rebuild one part of how you sell, in thirty days, and prove it with real buyers."
        canonical="/ai-gtm"
      />

      <section className="mm-hero" aria-labelledby="gtm-title">
        <div className="mm-container mm-hero-split">
          {/* The film drifts against the copy as the hero leaves, which is what
              the homepage hero has always done and these two never did. */}
          <div>
            <h1 className="mm-setup" id="gtm-title">AI is changing what customers pay for.</h1>
            <ScrubText className="mm-claim" text="We help you sell for that." />
            <p className="mm-lede">
              We take one part of how you sell, rebuild it around the way AI has changed your
              market, and prove it with real buyers inside thirty days. You keep the model.
            </p>
          </div>
          <div className="mm-hero-film mm-parallax" ref={plateRef}>
            <FilmPlate
              className="mm-parallax-plate"
              poster={filmThreePoster}
              posterWebp={filmThreePosterWebp}
              src={filmThreeLoop}
              srcWebm={filmThreeLoopWebm}
              label="A chart room of brass recording pens drawing ink curves onto paper drums. One pen has broken sharply downward and a hand tears the strip away."
              priority
            />
          </div>
        </div>
      </section>

      <section className="mm-block mm-on-raise" aria-labelledby="money-title">
        <div className="mm-container">
          <div className="mm-head-split">
            <h2 id="money-title">Four things AI changes about selling.</h2>
            {/* The film belongs to the section rather than to one of three
                peers, and beside the heading rather than under everything: a
                1080px square spanning the full container was upscaled. */}
            <FilmPlate
              className="mm-impact-film"
              poster={filmSixPoster}
              posterWebp={filmSixPosterWebp}
              src={filmSixLoop}
              srcWebm={filmSixLoopWebm}
              label="Extreme macro on a split-flap display in a brass frame, mid-cascade, settling lower on its column."
            />
          </div>
          {/* Four dials on one panel, because these are the four levers there
              are and moving one moves the others. As three separate cards the
              page named only three of them and left product out. */}
          <div style={{ marginTop: 18 }}>
            <LeverPanel />
          </div>
        </div>
      </section>

      {/* Above the board, not below it. The board runs to about 800px, so a
          try-it section underneath was one most visitors never reached. */}
      <section className="mm-block mm-try" id="try-it" aria-labelledby="read-title">
        <div className="mm-container">
          <h2 id="read-title"><Instrument kind="recorder" className="mm-head-mark" />Try it with your own company.</h2>
          <div className="mm-try-panel">
            <Instrument kind="recorder" />
            <p className="mm-lede">
              Give us your company address. We will read your market while you watch, and send you
              a plan built for your business. It takes a couple of minutes.
            </p>
            <GtmJourney onRead={startFromJourney} />
          </div>
        </div>
      </section>

      <LiveBoard ground="raise" />

      <section className="mm-block" aria-labelledby="engage-title">
        <div className="mm-container">
          <h2 id="engage-title"><Instrument kind="levels" className="mm-head-mark" />Thirty days proves it. Then your team runs it.</h2>
          <ProcessTrack
            first={{
              instrument: "recorder",
              title: "The review, thirty days",
              line: "Understand what changed, and pick one thing to fix.",
              body: "You get the model, a clear recommendation and all the evidence behind it. Priced on the result, with no retainer.",
            }}
            second={{
              instrument: "levels",
              title: "The build, optional",
              line: "Put it in place, and teach your team to run it.",
              body: "We set the system up as the memory of how you sell, connect it to your plans, and coach the people who will keep it going after we finish.",
            }}
          />
          <ScrubText className="mm-payoff" text="We bring our own tooling, so the work moves quickly from day one. You keep the model, the plan and the system, and they keep working after we finish." />
        </div>
      </section>

      <section className="mm-block mm-on-raise">
        <div className="mm-container">
          <ObjectionChips ask={["report", "speed", "team", "keep", "how-we-work", "included", "charging", "size", "fit", "risk"]} />
        </div>
      </section>

      <SubscribeBand ground="ink" />

      <CloseBlock
        instrument="gauge"
        ground="raise"
        panelId="try-it"
        claim="You keep the model."
        body="The read, the plan and the working system stay with you, and they keep running after we finish."
      />

      <LeadBrief
        open={briefOpen}
        onClose={closeBrief}
        route="gtm"
        initialDomain={seedDomain}
        onConfirmed={() => track("journey_gtm_complete")}
      />
    </MindmakeShell>
  );
}
