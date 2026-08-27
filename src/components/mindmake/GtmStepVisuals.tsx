import { CSSProperties } from "react";
import { StepFilm } from "@/components/mindmake/StepFilm";
import decisionsFilm from "@/assets/CTRL - Demo 4 - Decisions.mp4";
import headlinesFilm from "@/assets/CTRL - Demo 3 - Headlines.mp4";
import decisionsPoster from "@/assets/ctrl-decisions-poster.webp";
import headlinesPoster from "@/assets/ctrl-headlines-poster.webp";

const at = (index: number) => ({ "--mm-i": index } as CSSProperties);

/* Step 1. A market read assembling with its sources still visible. */
export function ReadVisual() {
  return (
    <div className="mm-visual mm-visual-read" aria-hidden="true">
      <div className="mm-step-card is-read">
        <b>What changed</b>
        <span data-row style={at(0)}>What customers now do alone</span>
        <span data-row style={at(1)}>What they will still pay for</span>
        <span data-row style={at(2)}>Where your numbers disagree with your story</span>
      </div>
      <div className="mm-visual-sources">
        <span className="mm-step-chip" style={at(0)}>Your numbers</span>
        <span className="mm-step-chip" style={at(1)}>Buyer behaviour</span>
        <span className="mm-step-chip" style={at(2)}>Market signals</span>
      </div>
    </div>
  );
}

/* Step 2. Four levers on stage; one taken deep while the whole model
   stays mapped. */
export function LeverVisual() {
  return (
    <div className="mm-visual mm-visual-levers" aria-hidden="true">
      <div className="mm-visual-lever-grid">
        <div className="mm-step-card is-lever is-deep" style={at(0)}>
          <b>Price</b>
          <span>Taken deep this month</span>
          <i className="mm-visual-depth" />
        </div>
        <div className="mm-step-card is-lever" style={at(1)}><b>Product</b></div>
        <div className="mm-step-card is-lever" style={at(2)}><b>Positioning</b></div>
        <div className="mm-step-card is-lever" style={at(3)}><b>People</b></div>
      </div>
      <span className="mm-step-chip is-map">The whole model, mapped</span>
    </div>
  );
}

/* Step 3. Real footage: a model being interrogated with sources attached. */
export function ModelVisual() {
  return (
    <StepFilm
      src={decisionsFilm}
      poster={decisionsPoster}
      title="CTRL breaking a live business decision into parts that can be questioned"
      caption="A model you can interrogate, with sources attached."
      labels={["Ask it why", "Sources attached", "It has to run"]}
    />
  );
}

/* Step 4. Real footage: buyer evidence and the outside world arriving. */
export function ProveVisual() {
  return (
    <StepFilm
      src={headlinesFilm}
      poster={headlinesPoster}
      title="CTRL bringing live market signals and buyer evidence into the work"
      caption="Evidence beats opinion."
      labels={["What buyers said", "What changed outside"]}
    />
  );
}

/* Step 5. The team runs the model while Krish steps away. */
export function RunVisual() {
  return (
    <div className="mm-visual mm-visual-run" aria-hidden="true">
      <div className="mm-step-card is-run">
        <b>The model, running</b>
        <span data-row style={at(0)}>The data stays with you</span>
        <span data-row style={at(1)}>The reasons stay attached</span>
        <span data-row style={at(2)}>The next call starts sharper</span>
      </div>
      <div className="mm-visual-team">
        <span className="mm-step-chip" style={at(0)}>Sales</span>
        <span className="mm-step-chip" style={at(1)}>Product</span>
        <span className="mm-step-chip" style={at(2)}>Finance</span>
      </div>
      <span className="mm-step-chip is-departing">Krish</span>
    </div>
  );
}

/* The compounding panel: the model deepening lever by lever as the
   timeline moves. */
export function GtmTimelinePanel() {
  return (
    <div className="mm-visual mm-timeline-visual is-gtm" aria-hidden="true">
      <div className="mm-timeline-levers">
        <div className="mm-timeline-lever is-deep"><b>Price</b><i /></div>
        <div className="mm-timeline-lever is-day60"><b>Positioning</b><i /></div>
        <div className="mm-timeline-lever is-day90"><b>Product</b><i /></div>
        <div className="mm-timeline-lever is-day90b"><b>People</b><i /></div>
      </div>
      <div className="mm-timeline-layer is-day30">
        <span className="mm-step-chip">Tested with real buyers</span>
      </div>
      <div className="mm-timeline-layer is-day60">
        <span className="mm-step-chip">Your team runs the motion</span>
      </div>
      <div className="mm-timeline-layer is-day90">
        <span className="mm-step-chip">The next call starts from evidence</span>
      </div>
    </div>
  );
}
