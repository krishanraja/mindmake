import { CSSProperties } from "react";
import { StepFilm } from "@/components/mindmake/StepFilm";
import brainFilm from "@/assets/CTRL - Demo 5 - Brain.mp4";
import newsFilm from "@/assets/CTRL - Demo 1 - Newsfeed.mp4";
import brainPoster from "@/assets/ctrl-brain-poster.webp";
import newsPoster from "@/assets/ctrl-newsfeed-poster.webp";

const at = (index: number) => ({ "--mm-i": index } as CSSProperties);

/* Step 1. Raw working material moves into one structured card: extraction
   happening on stage, not described. */
export function CaptureVisual() {
  return (
    <div className="mm-visual mm-visual-capture" aria-hidden="true">
      <div className="mm-visual-scraps">
        <span style={at(0)}>Call notes</span>
        <span style={at(1)}>A draft you rejected</span>
        <span style={at(2)}>The example you always send</span>
        <span style={at(3)}>Feedback you gave twice</span>
      </div>
      <div className="mm-step-card is-capture">
        <b>Working judgement</b>
        <span data-row style={at(0)}>What good looks like to you</span>
        <span data-row style={at(1)}>What you always reject</span>
        <span data-row style={at(2)}>Who and what you trust</span>
      </div>
    </div>
  );
}

/* Step 2. Real footage: CTRL holding memory, sources, rules and checks
   around live work. */
export function EncodeVisual() {
  return (
    <StepFilm
      src={brainFilm}
      poster={brainPoster}
      title="CTRL holding a leader's memory, sources, rules and checks around live work"
      caption="CTRL holding memory, sources, rules and checks."
      labels={["Memory", "Sources", "Rules and checks"]}
    />
  );
}

/* Step 3. Real footage: work arriving already prepared, what matters
   surfacing before the leader asks. */
export function AmplifyVisual() {
  return (
    <StepFilm
      src={newsFilm}
      poster={newsPoster}
      title="CTRL bringing prepared work and useful signals to a leader before they ask"
      caption="What matters arrives before you ask."
      labels={["Prepared your way", "What changed overnight"]}
    />
  );
}

/* Step 4. A blind spot becomes visible beside its evidence. */
export function UncoverVisual() {
  return (
    <div className="mm-visual mm-visual-uncover" aria-hidden="true">
      <div className="mm-visual-known">
        <span style={at(0)}>The work you check closely</span>
        <span style={at(1)}>The calls you make quickly</span>
      </div>
      <div className="mm-step-card is-blindspot">
        <b>The call you keep putting off</b>
        <span data-row style={at(0)}>Seen across your own decisions</span>
      </div>
      <span className="mm-step-chip is-evidence">Evidence attached</span>
    </div>
  );
}

/* Step 5. The system keeps working in the leader's hands while Krish
   steps away. */
export function KeepVisual() {
  return (
    <div className="mm-visual mm-visual-keep" aria-hidden="true">
      <div className="mm-step-card is-keep">
        <b>Your brain, still working</b>
        <span data-row style={at(0)}>Overnight reading prepared</span>
        <span data-row style={at(1)}>A check ran on today's draft</span>
        <span data-row style={at(2)}>A pattern noted for your next call</span>
      </div>
      <span className="mm-step-chip is-departing">Krish</span>
      <span className="mm-step-chip is-yours">Yours to keep</span>
    </div>
  );
}

/* The compounding panel: the same system growing outwards from the
   leader's work as the timeline moves. */
export function BrainTimelinePanel() {
  return (
    <div className="mm-visual mm-timeline-visual is-brain" aria-hidden="true">
      <i className="mm-timeline-ring is-r1" />
      <i className="mm-timeline-ring is-r2" />
      <i className="mm-timeline-ring is-r3" />
      <div className="mm-timeline-core"><b>Your real work</b></div>
      <div className="mm-timeline-layer is-day30">
        <span className="mm-step-chip" style={at(0)}>One capability, live</span>
        <span className="mm-step-chip" style={at(1)}>Memory and sources</span>
      </div>
      <div className="mm-timeline-layer is-day60">
        <span className="mm-step-chip" style={at(0)}>A second capability</span>
        <span className="mm-step-chip" style={at(1)}>Catches what you would miss</span>
      </div>
      <div className="mm-timeline-layer is-day90">
        <span className="mm-step-chip" style={at(0)}>Your team, your standard</span>
        <span className="mm-step-chip" style={at(1)}>Briefs you before you ask</span>
      </div>
    </div>
  );
}
