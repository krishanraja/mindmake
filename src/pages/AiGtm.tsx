import { useState } from "react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { CloseBlock } from "@/components/mindmake/CloseBlock";
import { FilmPlate } from "@/components/mindmake/FilmPlate";
import { ObjectionChips } from "@/components/mindmake/ObjectionChips";
import { LiveBoard } from "@/components/mindmake/board/LiveBoard";
import { GtmJourney } from "@/components/mindmake/journeys/GtmJourney";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import { track } from "@/lib/analytics";
import filmThreePoster from "@/assets/films/film-03-poster.jpg";
import filmThreePosterWebp from "@/assets/films/film-03-poster.webp";
import filmSixPoster from "@/assets/films/film-06-poster.jpg";
import filmSixPosterWebp from "@/assets/films/film-06-poster.webp";
import "@/styles/mindmake.css";
import "@/styles/mindmake-instruments.css";

const GTM_OBJECTIONS = [
  {
    id: "report",
    question: "Do I get a document or something that works?",
    answer: "Something that works, plus the evidence behind it. You can see every source we used and check the reasoning yourself.",
  },
  {
    id: "speed",
    question: "Is thirty days realistic?",
    answer: "Yes, because we take on one result rather than a whole transformation. You see the first working piece in week one, and it improves each week after that.",
  },
  {
    id: "team",
    question: "How much of my team's time does this take?",
    answer: "Very little. We need your decisions, the context you trust and a few introductions. There is no homework and no all-team rollout to sit through.",
  },
  {
    id: "keep",
    question: "What do we keep at the end?",
    answer: "The model, the plan and the working system. All of it is yours, and it keeps running after we finish.",
  },
];

export default function AiGtm() {
  const { briefOpen, openBrief, closeBrief } = useLeadBriefHistory();
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
          <div>
            <h1 className="mm-setup" id="gtm-title">AI is changing what customers pay for.</h1>
            <p className="mm-claim">We help you sell for that.</p>
            <p className="mm-lede">
              We take one part of how you sell, rebuild it around the way AI has changed your
              market, and prove it with real buyers inside thirty days. You keep the model.
            </p>
          </div>
          <FilmPlate
            poster={filmThreePoster}
            posterWebp={filmThreePosterWebp}
            label="A chart room of brass recording pens drawing ink curves onto paper drums. One pen has broken sharply downward and a hand tears the strip away."
            priority
          />
        </div>
      </section>

      <section className="mm-block" aria-labelledby="money-title">
        <div className="mm-container">
          <h2 id="money-title">Three things AI changes about selling.</h2>
          <div className="mm-impact" style={{ marginTop: 18 }}>
            <article className="mm-impact-card">
              <h3>What you charge</h3>
              <p>
                <strong>The cost of doing the work is falling</strong>, and customers are starting
                to notice. We work out what that means for your margin and what your prices should
                assume next year.
              </p>
              <FilmPlate
                poster={filmSixPoster}
                posterWebp={filmSixPosterWebp}
                label="Extreme macro on a split-flap display in a brass frame, mid-cascade, settling lower on its column."
              />
            </article>
            <article className="mm-impact-card">
              <h3>How you stand out</h3>
              <p>
                <strong>Who else is selling to your customers now</strong>, what they are promising,
                and the clearest way to explain why you are the better choice.
              </p>
            </article>
            <article className="mm-impact-card">
              <h3>Who does the selling</h3>
              <p>
                <strong>The roles worth creating now</strong>, the people who do well in them, and
                the parts of selling your team can hand to AI this month.
              </p>
            </article>
          </div>
        </div>
      </section>

      <LiveBoard />

      <section className="mm-block" aria-labelledby="read-title">
        <div className="mm-container">
          <h2 id="read-title">Try it with your own company.</h2>
          <p className="mm-lede" style={{ marginTop: 10 }}>
            Give us your company address. We will read your market while you watch, and send you a
            plan built for your business. It takes a couple of minutes.
          </p>
          <GtmJourney onRead={startFromJourney} />
        </div>
      </section>

      <section className="mm-block" aria-labelledby="engage-title">
        <div className="mm-container">
          <h2 id="engage-title">Two ways to start.</h2>
          <div className="mm-shapes">
            <article className="mm-shape is-hot">
              <h3>The review, thirty days</h3>
              <p className="mm-shape-line">Understand what changed, and pick one thing to fix.</p>
              <p>You get the model, a clear recommendation and all the evidence behind it. Priced on the result, with no retainer.</p>
            </article>
            <article className="mm-shape">
              <h3>The build</h3>
              <p className="mm-shape-line">Put it in place, and teach your team to run it.</p>
              <p>We set the system up as the memory of how you sell, connect it to your plans, and coach the people who will keep it going after we finish.</p>
            </article>
          </div>
          <p className="mm-payoff">
            We bring our own tooling, so the work moves quickly from day one.{" "}
            <em>You keep the model, the plan and the system, and they keep working after we finish.</em>
          </p>
        </div>
      </section>

      <section className="mm-block">
        <div className="mm-container">
          <ObjectionChips objections={GTM_OBJECTIONS} />
        </div>
      </section>

      <CloseBlock
        claim="See where AI changes your numbers."
        body="Give us your company address and we will show you, using your market rather than a general example."
        onStart={openBrief}
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
