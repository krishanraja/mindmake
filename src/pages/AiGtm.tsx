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
    question: "Is this a report or real work?",
    answer: "Real work. You leave with a working system and the evidence behind it, not a document describing one.",
  },
  {
    id: "speed",
    question: "How fast is thirty days really?",
    answer: "Fast, because the scope is one result rather than a transformation programme. You see the first working piece inside the first week, and it improves every week after that.",
  },
  {
    id: "team",
    question: "Does my team have to be involved?",
    answer: "Your decisions, your trusted context and a few introductions. That is the whole ask. There is no performative homework and no all-team rollout to sit through.",
  },
  {
    id: "keep",
    question: "What do we keep when it ends?",
    answer: "Everything. The model, the plan and the system, and they keep working after we leave.",
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
        description="An AI-native go-to-market model across product, price, positioning and people. One lever, thirty days, priced on the outcome."
        canonical="/ai-gtm"
      />

      <section className="mm-hero" aria-labelledby="gtm-title">
        <div className="mm-container mm-hero-split">
          <div>
            <p className="mm-label">Build your AI GTM</p>
            <h1 className="mm-setup" id="gtm-title">AI moved your market.</h1>
            <p className="mm-claim">Your price has not moved yet.</p>
            <p className="mm-lede">
              An AI-native go-to-market model across product, price, positioning and people.
              One lever, thirty days, priced on the outcome.
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
          <p className="mm-label">Where AI hits the model</p>
          <h2 id="money-title">Three places the money moves.</h2>
          <div className="mm-impact" style={{ marginTop: 18 }}>
            <article className="mm-impact-card">
              <span className="mm-label">Monetization</span>
              <p>
                The P&amp;L is being repriced underneath you. <strong>What intelligence costs now</strong>,
                what that does to your margin, and the pricing your next decision should assume.
              </p>
              <FilmPlate
                poster={filmSixPoster}
                posterWebp={filmSixPosterWebp}
                label="Extreme macro on a split-flap display in a brass frame, mid-cascade, settling lower on its column."
              />
            </article>
            <article className="mm-impact-card">
              <span className="mm-label">Positioning</span>
              <p>
                <strong>Who is coming for your business</strong>, with what tactics, and the story
                that keeps you distinct while they arrive.
              </p>
            </article>
            <article className="mm-impact-card">
              <span className="mm-label">People</span>
              <p>
                <strong>The roles that should exist now</strong>, the people who thrive in them,
                and the immediate 10X wins inside your GTM.
              </p>
            </article>
          </div>
        </div>
      </section>

      <LiveBoard />

      <section className="mm-block" aria-labelledby="read-title">
        <div className="mm-container">
          <p className="mm-label">Try it on your business</p>
          <h2 id="read-title">Watch us read your business.</h2>
          <p className="mm-lede" style={{ marginTop: 10 }}>
            Drop your company address. The engine reads your market live and a proposal built for
            you lands in your inbox within minutes.
          </p>
          <GtmJourney onRead={startFromJourney} />
        </div>
      </section>

      <section className="mm-block" aria-labelledby="engage-title">
        <div className="mm-container">
          <p className="mm-label">How we engage</p>
          <h2 id="engage-title">Read it, or rebuild it.</h2>
          <div className="mm-shapes">
            <article className="mm-shape is-hot">
              <span className="mm-label">The audit · 30 days</span>
              <h3>Read what changed. Choose the lever.</h3>
              <p>You leave with the model, the recommendation and the proof it was built on. Priced on the outcome.</p>
            </article>
            <article className="mm-shape">
              <span className="mm-label">The deployment</span>
              <h3>Install the vision. Build the champions.</h3>
              <p>We deploy the brain as the memory of your GTM, wire it to the tactical plans, and develop the people inside your team who carry it forward.</p>
            </article>
          </div>
          <p className="mm-payoff">
            Delivered alongside our operating system, so velocity is guaranteed.{" "}
            <em>You keep the model, the plan and the system, and they keep working after we leave.</em>
          </p>
        </div>
      </section>

      <section className="mm-block" aria-labelledby="gtm-objections">
        <div className="mm-container">
          <h2 className="mm-visually-hidden" id="gtm-objections">Common questions</h2>
          <ObjectionChips objections={GTM_OBJECTIONS} />
        </div>
      </section>

      <CloseBlock claim="Reprice before you are repriced." onStart={openBrief} />

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
