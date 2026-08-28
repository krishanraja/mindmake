import { useId, useState } from "react";
import brainGraph from "@/assets/ctrl/ctrl-brain-graph.jpg";
import decisionEvidence from "@/assets/ctrl/ctrl-decision-evidence.jpg";
import standards from "@/assets/ctrl/ctrl-standards.jpg";
import briefing from "@/assets/ctrl/ctrl-briefing.jpg";

/**
 * Four live captures of the engine we run on ourselves.
 *
 * These are the full application frame, deliberately: the operator's own
 * account chrome is what proves the engine is real, and it is the one approved
 * exception to the rule that keeps a personal name off the site. They appear on
 * this page only, and the product is never linked or priced.
 */
const CAPTURES = [
  {
    id: "brain",
    tab: "The brain of a leader",
    src: brainGraph,
    alt: "CTRL, full app frame: Your Digital Brain graph with 42 known facts, one connection open, load-bearing and confirmed",
    caption: "Everything it knows about how a leader works, mapped. 42 things known, 18 confirmed by the owner. You confirm what is true and fix what is not.",
  },
  {
    id: "evidence",
    tab: "The evidence behind a call",
    src: decisionEvidence,
    alt: "CTRL, full app frame: Weigh a decision, Inference headroom holds up, evidence list with sources and strength scores",
    caption: "The support and the counterpoints behind a real call, with sources and strength attached, and what would change it.",
  },
  {
    id: "standards",
    tab: "Standards, written down",
    src: standards,
    alt: "CTRL, full app frame: preferences with strength and decision style verified, other traits labelled inferred",
    caption: "What it believes about you is labelled: verified by you, or inferred and waiting for your check. Taste and standards, written down.",
  },
  {
    id: "briefing",
    tab: "A briefing that knows you",
    src: briefing,
    alt: "CTRL, full app frame: Today's brief playing, talk to this briefing, a fact check before you go, location masked",
    caption: "A few minutes each morning, shaped around what you are trying to move. It checks its own facts with you before it leans on them.",
  },
];

export function ProofViewer() {
  const [active, setActive] = useState(0);
  const panelId = useId();
  const capture = CAPTURES[active];

  return (
    <div className="mm-proof-viewer">
      <div className="mm-proof-tabs" role="tablist" aria-label="CTRL, working">
        {CAPTURES.map((item, index) => (
          <button
            key={item.id}
            className="mm-proof-tab"
            role="tab"
            type="button"
            id={`${panelId}-tab-${item.id}`}
            aria-selected={active === index}
            aria-controls={panelId}
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") setActive((index + 1) % CAPTURES.length);
              if (event.key === "ArrowLeft") setActive((index - 1 + CAPTURES.length) % CAPTURES.length);
            }}
          >
            {item.tab}
          </button>
        ))}
      </div>

      <div
        className="mm-proof-stage"
        role="tabpanel"
        id={panelId}
        aria-labelledby={`${panelId}-tab-${capture.id}`}
      >
        <img src={capture.src} alt={capture.alt} loading="lazy" />
      </div>

      <p className="mm-proof-caption">{capture.caption}</p>
    </div>
  );
}
