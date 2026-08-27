import { ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { StepJourney } from "@/components/mindmake/StepJourney";
import { StepScene } from "@/components/mindmake/StepScene";
import { CompoundingTimeline } from "@/components/mindmake/CompoundingTimeline";
import {
  AmplifyVisual,
  BrainTimelinePanel,
  CaptureVisual,
  EncodeVisual,
  KeepVisual,
  UncoverVisual,
} from "@/components/mindmake/BrainStepVisuals";
import { ScrollMark } from "@/components/mindmake/ScrollMark";
import { WorkingUnderstandingCompare } from "@/components/mindmake/WorkingUnderstandingCompare";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import "@/styles/mindmake.css";
import "@/styles/mindmake-journey.css";

export default function AiBrain() {
  const { briefOpen, openBrief, closeBrief } = useLeadBriefHistory();

  return (
    <MindmakeShell onStart={openBrief} mainClassName="mm-route-page mm-route-brain">
      <SEO
        title="Build Your AI Brain"
        description="An AI brain is a working system that holds your taste, judgement, standards, memory and trusted context, and uses them on your real work. Built with you in 30 days."
        canonical="/ai-brain"
      />

      <StepJourney>
        <section className="mm-journey-hero" data-tone="ink" aria-labelledby="brain-title">
          <h1 id="brain-title">Encode your taste and judgement, amplify your strengths, uncover your blind spots.</h1>
          <p className="mm-journey-definition">An AI brain is a working system that holds your <strong>taste, judgement, standards, memory and trusted context</strong>, and uses them on your real work.</p>
          <p className="mm-journey-moment">You handed the AI thing to someone else, and the understanding a leader now needs is slipping away with it. Your taste and standards are still trapped in your head. Over thirty days, you and Krish build the system that holds them.</p>
          <div className="mm-journey-hero-actions">
            <button className="mm-button" type="button" onClick={openBrief}>Start here <ArrowRight aria-hidden="true" /></button>
            <p className="mm-journey-refusals"><span>Not an agency.</span> <span>Not a coach.</span></p>
          </div>
        </section>

        <StepScene
          index={1}
          name="Capture"
          title="Capture"
          tone="paper"
          body="We sit inside your real work. Krish's questions, comparisons and graded examples pull out the taste, judgement, standards and trusted context that make you good."
          note="You start from a working engine, never a blank page."
          visual={<CaptureVisual />}
        />

        <StepScene
          index={2}
          name="Encode"
          title="Encode"
          tone="ink"
          body="That thinking becomes a working system in CTRL, Mindmake's own product: memory, sources, rules and checks around your live work."
          note="Not a folder of notes."
          visual={<EncodeVisual />}
        />

        <StepScene
          index={3}
          name="Amplify"
          title="Amplify"
          tone="forest"
          body="Your strengths arrive early. The system prepares work your way and brings what matters before you ask. It never does the work for you; it makes you faster at yours."
          note="Getting time back is just the start."
          visual={<AmplifyVisual />}
        />

        <StepScene
          index={4}
          name="Uncover"
          title="Uncover"
          tone="ink"
          body="It shows you what you are not seeing: the calls you avoid, the patterns you miss, the blind spots nobody tells you about."
          note="Beside each one, the evidence."
          visual={<UncoverVisual />}
        />

        <StepScene
          index={5}
          name="Keep"
          title="Keep"
          tone="paper"
          body="The system, the evidence and the reasons stay with you. It keeps improving your decisions after the month ends, and it never needed you to become technical to own it."
          note={<>It compounds <ScrollMark shape="circle" driver="step">without Krish</ScrollMark>.</>}
          visual={<KeepVisual />}
        />

        <CompoundingTimeline
          tone="forest"
          title="Day thirty is a beginning."
          intro="Work starts with the 30-day proof. The best work continues for three months or longer, and it has to earn that."
          ariaLabel="How the brain compounds after day thirty"
          states={[
            { day: 30, standing: "The proof", body: "One part of how you think, captured, encoded and working on your real work. Yours to keep either way." },
            { day: 60, standing: "Earned", body: "The brain covers more of your week. A second part of your work runs through it. It starts catching what you would miss." },
            { day: 90, standing: "Earned", body: "Your team works with your standards. The brain briefs you before you ask. It compounds without Krish." },
          ]}
          visual={<BrainTimelinePanel />}
        />

        <WorkingUnderstandingCompare
          tone="paper"
          ariaLabel="How the Mindmake brain compares with other kinds of help"
          intro="A generic AI, a consultancy and ready-made tools can all do useful work. The difference is where the understanding lives when the work ends, and a leader needs to keep it."
          rows={[
            "Does useful work today?",
            "Does it have a memory of you?",
            "Can it draw out how you judge?",
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
              title: "The Mindmake brain, with Krish",
              explain: "A working system built with you, on your real work.",
              cells: [
                "Yes.",
                "It holds your taste, standards, sources and corrections.",
                "Krish's questions, comparisons and graded examples.",
                "With you, and it keeps growing.",
              ],
              emphasis: true,
            },
          ]}
        />
      </StepJourney>

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
