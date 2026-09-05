import { useState } from "react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { CloseBlock } from "@/components/mindmake/CloseBlock";
import { SubscribeBand } from "@/components/mindmake/SubscribeBand";
import { FilmPlate } from "@/components/mindmake/FilmPlate";
import { Instrument } from "@/components/mindmake/Instrument";
import { Build } from "@/components/mindmake/Build";
import { ScrubText } from "@/components/mindmake/ScrubText";
import { ObjectionChips } from "@/components/mindmake/ObjectionChips";
import { LeverPanel } from "@/components/mindmake/LeverPanel";
import { ProcessTrack } from "@/components/mindmake/ProcessTrack";
import { LiveBoard } from "@/components/mindmake/board/LiveBoard";
import { DoorStories } from "@/components/mindmake/DoorStories";
import { GtmJourney } from "@/components/mindmake/journeys/GtmJourney";
import { GTM_STEPS } from "@/content/journeySteps";
import type { Details } from "@/components/mindmake/journeys/DetailsJourney";
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
import filmFourPoster from "@/assets/films/film-04-poster.jpg";
import filmFourPosterWebp from "@/assets/films/film-04-poster.webp";
import filmFourLoop from "@/assets/films/film-04-loop.mp4";
import filmFourLoopWebm from "@/assets/films/film-04-loop.webm";
import "@/styles/mindmake.css";
import "@/styles/mindmake-instruments.css";

export default function AiGtm() {
  const { briefOpen, openBrief, closeBrief } = useLeadBriefHistory();
  const plateRef = useScrollDriver<HTMLDivElement>();
  const [seed, setSeed] = useState<Details>();

  const startFromJourney = (details: Details) => {
    setSeed(details);
    openBrief();
  };

  return (
    <MindmakeShell onStart={openBrief}>
      <SEO
        title="Build your AI GTM"
        description="AI is changing what customers will pay for. We rebuild one part of how you sell and prove it with real buyers before we leave."
        canonical="/ai-gtm"
      />

      <section className="mm-hero" aria-labelledby="gtm-title">
        <div className="mm-container mm-hero-split">
          {/* The film drifts against the copy as the hero leaves, which is what
              the homepage hero has always done and these two never did. The
              copy column is the entrance's first beat: see index.html. */}
          <div className="mm-first">
            <h1 className="mm-setup" id="gtm-title">AI is changing what customers pay for.</h1>
            <ScrubText className="mm-claim" text="We help you sell for that." />
            <p className="mm-lede">
              We take one part of how you sell, rebuild it around the way AI has changed your
              market, and prove it with real buyers before we leave.
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
            <h2 id="money-title">What AI changes about selling.</h2>
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

      {/* The board, straight after the levers: the levers say what AI is
          changing about selling and the board is that change, read this
          morning, for the reader's own part of the business. It is the early
          sight the whole practice rests on, and it used to sit under the form
          where the page had already asked for something. Ink, between the
          levers' raise and the stories' raise. */}
      <LiveBoard />

      {/* Two companies that changed how they sell. The first client proof on
          this page, both GTM-shaped: a product made simple enough to buy, and
          a sales path changed before the market forced it. */}
      <section className="mm-block mm-on-raise" aria-labelledby="sold-title">
        <div className="mm-container">
          <h2 id="sold-title"><Instrument kind="drawer" className="mm-head-mark" />Two companies that changed how they sell.</h2>
          <div style={{ marginTop: 20 }}>
            <DoorStories ids={["simple-product", "market-moves"]} />
          </div>
        </div>
      </section>

      <section className="mm-block mm-on-paper" aria-labelledby="engage-title">
        <div className="mm-container">
          <h2 id="engage-title"><Instrument kind="levels" className="mm-head-mark" />One decision, proved with buyers. Then your team runs it.</h2>
          <ProcessTrack
            first={{
              instrument: "recorder",
              title: "The review",
              line: "Understand what changed, and pick one thing to fix.",
              body: "You get the model, a clear recommendation and all the evidence behind it. Priced on the result, with no retainer.",
            }}
            second={{
              instrument: "levels",
              title: "The build, optional",
              line: "Put it in place, and teach your team to run it.",
              body: "We set the system up as the memory of how you sell, and connect it to your plans.",
            }}
          />
          <ScrubText className="mm-payoff" text="We bring our own tooling, so the work moves quickly from day one." />
        </div>
      </section>

      {/* After the proof from 5 September 2026: the form was the third
          section, before any evidence that the work had worked for anyone,
          and a form a reader has no reason to fill in is a screen they scroll
          past. The board, which used to sit under it, is above it now. */}
      <section className="mm-block" aria-labelledby="read-title">
        <div className="mm-container">
          {/* The film belongs beside this heading for the same reason it does
              beside the one above: this is the only section on the page that
              carries no imagery, and it is the section the page exists to get
              somebody into. Measured on a phone it read a whole-screen change
              of 0.008 with one of sixty-four cells moving, across 1.68 screens
              of form. A plate runs its light sweep whether or not the loop
              plays, so this is the picture and the ambient layer at once. */}
          <div className="mm-head-split">
            <h2 id="read-title"><Instrument kind="recorder" className="mm-head-mark" />Try it with your own company.</h2>
            <FilmPlate
              className="mm-impact-film"
              poster={filmFourPoster}
              posterWebp={filmFourPosterWebp}
              src={filmFourLoop}
              srcWebm={filmFourLoopWebm}
              label="A brass rail carrying cream sheets to a small gate, where a hand lifts the top sheet before the rail resumes."
            />
          </div>
          {/* What happens, before what we need. These three were rendered at
              the foot of the form, which put 386px of "here is what comes next"
              under a form nobody had filled in yet and made this section 2.08
              screens on a 360px phone. */}
          <div className="mm-journey-steps">
            {GTM_STEPS.map((step) => (
              <article className="mm-journey-step" key={step.number}>
                <b>{step.number}</b>
                <strong>{step.title}</strong>
                <span>{step.body}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* The form on its own screen. One job, and the job a reader can see the
          whole of. */}
      <section className="mm-block mm-on-raise mm-try" id="try-it" aria-labelledby="try-title">
        <div className="mm-container">
          {/* The one screen on each door page the aliveness gate has called
              still since 1 September. A form is finished the moment it is
              drawn, so nothing on it moves at rest; what it can do is build
              under the reader as they arrive, which is the gate's other half
              and the thing this site has been asked for repeatedly. */}
          <Build className="mm-try-panel">
            <Instrument kind="recorder" />
            <h2 id="try-title" className="mm-try-title">Four details, and we start reading.</h2>
            <GtmJourney onRead={startFromJourney} />
          </Build>
        </div>
      </section>

      <section className="mm-block">
        <div className="mm-container">
          <ObjectionChips ask={["private", "report", "speed", "team", "keep", "how-we-work", "charging", "size", "fit", "risk"]} />
        </div>
      </section>

      <SubscribeBand ground="paper" />

      <CloseBlock
        instrument="gauge"
        ground="raise"
        panelId="try-it"
        claim="You keep the model."
        body="The read, the plan and the working system. They keep running after we finish."
      />

      <LeadBrief
        open={briefOpen}
        onClose={closeBrief}
        route="gtm"
        initialDomain={seed?.domain}
        initialEmail={seed?.email}
        /* So that if anything in there fails, the offer of a person is one
           button rather than a fourth form at the worst possible moment. */
        visitor={seed}
        onConfirmed={() => track("journey_gtm_complete")}
      />
    </MindmakeShell>
  );
}
