import { ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { StepJourney } from "@/components/mindmake/StepJourney";
import { StepScene } from "@/components/mindmake/StepScene";
import { CompoundingTimeline } from "@/components/mindmake/CompoundingTimeline";
import {
  GtmTimelinePanel,
  LeverVisual,
  ModelVisual,
  ProveVisual,
  ReadVisual,
  RunVisual,
} from "@/components/mindmake/GtmStepVisuals";
import { ScrollMark } from "@/components/mindmake/ScrollMark";
import { WorkingUnderstandingCompare } from "@/components/mindmake/WorkingUnderstandingCompare";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import "@/styles/mindmake.css";
import "@/styles/mindmake-journey.css";

export default function AiGtm() {
  const { briefOpen, openBrief, closeBrief } = useLeadBriefHistory();

  return (
    <MindmakeShell onStart={openBrief} mainClassName="mm-route-page mm-route-gtm">
      <SEO
        title="Build Your AI GTM"
        description="Create an AI-native GTM model across product, price, positioning or people, then prove it with real buyers inside 30 days."
        canonical="/ai-gtm"
      />

      <StepJourney>
        <section className="mm-journey-hero" data-tone="paper" aria-labelledby="gtm-title">
          <h1 id="gtm-title">Create an AI-native GTM model across product, price, positioning or people.</h1>
          <p className="mm-journey-definition">GTM is short for go to market: <strong>what you sell, what it costs, how you stand out and who does the selling</strong>. AI-native means built for what AI just changed, not patched around it.</p>
          <div className="mm-journey-moments">
            <article>
              <h2>You lead an established business.</h2>
              <p>Customers can now do part of it alone. Your price and your promise no longer line up. The model needs rework.</p>
            </article>
            <article>
              <h2>You are building something new.</h2>
              <p>An AI-native digital business has a model that must be invented, not repaired. Speed without a model is just burn.</p>
            </article>
          </div>
          <p className="mm-journey-moment">Krish has spent fifteen years turning data and AI into customer experience and ways to make money. Both leaders get the same month: read what changed, choose the lever, build the model, prove it with buyers, run it.</p>
          <div className="mm-journey-hero-actions">
            <button className="mm-button" type="button" onClick={openBrief}>Start here <ArrowRight aria-hidden="true" /></button>
            <p className="mm-journey-refusals"><span>Not a fractional hire.</span> <span>Not an automation shop.</span></p>
          </div>
        </section>

        <StepScene
          index={1}
          name="Read"
          title="Read"
          tone="ink"
          body="We find what changed: what customers can now do alone, what they will still pay for, where your numbers disagree with your story. For the builder: what buyers will pay for that did not exist a year ago."
          note="The read folds into week one."
          visual={<ReadVisual />}
        />

        <StepScene
          index={2}
          name="Choose the lever"
          title="Choose the lever"
          tone="paper"
          body="Product, price, positioning or people. One lever carries the month. The model covers all four."
          note="One lever deep, the whole model mapped."
          visual={<LeverVisual />}
        />

        <StepScene
          index={3}
          name="Build the model"
          title="Build the model"
          tone="forest"
          body="An AI-native model of how you sell, built so you can question it and see the sources behind every answer."
          note={<>It has to <ScrollMark shape="circle" driver="step">run</ScrollMark>, not read well.</>}
          visual={<ModelVisual />}
        />

        <StepScene
          index={4}
          name="Prove with buyers"
          title="Prove with buyers"
          tone="ink"
          body="The model meets real buyers before the month ends. What they do and what they say goes back into the model."
          note="Evidence beats opinion."
          visual={<ProveVisual />}
        />

        <StepScene
          index={5}
          name="Run it"
          title="Run it"
          tone="paper"
          body="The model, the data and the reasons stay with your team. They can run the motion without waiting on Krish."
          note="The next call starts sharper."
          visual={<RunVisual />}
        />

        <CompoundingTimeline
          tone="ink"
          title="Day thirty is a beginning."
          intro="Work starts with the 30-day proof. The best work continues for three months or longer, and it has to earn that."
          ariaLabel="How the model compounds after day thirty"
          states={[
            { day: 30, standing: "The proof", body: "One lever deep, the whole model mapped, tested with real buyers." },
            { day: 60, standing: "Earned", body: "The second lever is built in. Your team runs the motion." },
            { day: 90, standing: "Earned", body: "The model runs across product, price, positioning and people. The next call starts from evidence, not debate." },
          ]}
          visual={<GtmTimelinePanel />}
        />

        <WorkingUnderstandingCompare
          tone="forest"
          ariaLabel="How the Mindmake model compares with other kinds of help"
          intro="A fractional hire, an automation shop, a generic AI and ready-made tools all do useful work too. The same question decides between them: where does the understanding live when the work ends?"
          rows={[
            "Does useful work today?",
            "Does it have a memory of your business?",
            "Can it draw out how you decide?",
            "Where does the understanding live when the work ends?",
          ]}
          columns={[
            {
              title: "A generic AI chat",
              explain: "An AI that answers whatever you ask it.",
              cells: [
                "Yes.",
                "No. Each chat starts from nothing.",
                "No. It waits to be asked.",
                "Nowhere.",
              ],
            },
            {
              title: "A consultancy",
              explain: "People who study your business and advise you.",
              cells: [
                "Yes.",
                "Their notes leave with them.",
                "Interviews, then a deck.",
                "In a deck that leaves.",
              ],
            },
            {
              title: "Ready-made tools",
              explain: "Software you subscribe to that stores your notes and context.",
              cells: [
                "Yes.",
                "It stores what you put in.",
                "No. You do the organising.",
                "Inside the tool.",
              ],
            },
            {
              title: "The Mindmake model, with Krish",
              explain: "A working model built with your team, proven with real buyers.",
              cells: [
                "Yes.",
                "It holds your market, your numbers and your reasons.",
                "Krish's questions, comparisons and graded examples.",
                "With your team. The next call starts from evidence.",
              ],
              emphasis: true,
            },
          ]}
        />
      </StepJourney>

      <section className="mm-section mm-proof-offer is-gtm" aria-labelledby="gtm-proof-offer">
        <div className="mm-container mm-proof-offer-grid">
          <div><h2 id="gtm-proof-offer">Test one big business decision in 30 days.</h2></div>
          <div><p>Mindmake starts with one costly question about the product, the price, the positioning or the people. It finds what changed, helps you make the hard choice and builds enough to test it with real buyers.</p><ul><li>One clear business question</li><li>Market and company evidence</li><li>A first version you can use</li><li>A real test before the month ends</li></ul><button className="mm-button" type="button" onClick={openBrief}>Start here <ArrowRight aria-hidden="true" /></button></div>
        </div>
      </section>

      <LeadBrief open={briefOpen} onClose={closeBrief} route="gtm" />
    </MindmakeShell>
  );
}
