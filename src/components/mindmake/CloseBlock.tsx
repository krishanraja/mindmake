import { AskBar } from "@/components/mindmake/AskBar";
import { track } from "@/lib/analytics";

interface CloseBlockProps {
  /** The ground it sits on, so the alternation survives to the foot of a page. */
  ground?: "raise";
  /** The serif payoff. The only claim voice in this block. */
  claim: string;
  body?: string;
  onStart: () => void;
}

export function CloseBlock({ claim, body, onStart, ground }: CloseBlockProps) {
  return (
    <section className={`mm-close${ground === "raise" ? " mm-on-raise" : ""}`}>
      <div className="mm-container">
        <p className="mm-claim">{claim}</p>
        {body && <p>{body}</p>}
        <button
          className="mm-button"
          type="button"
          onClick={() => {
            track("scoping_request", { source: "close" });
            onStart();
          }}
        >
          Start here <span aria-hidden="true">→</span>
        </button>
        <AskBar />
      </div>
    </section>
  );
}
