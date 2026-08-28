import { AskBar } from "@/components/mindmake/AskBar";
import { PUBLICATION_URL } from "@/lib/publicLinks";
import { track } from "@/lib/analytics";

interface CloseBlockProps {
  /** The serif payoff. The only claim voice in this block. */
  claim: string;
  body?: string;
  onStart: () => void;
}

export function CloseBlock({ claim, body, onStart }: CloseBlockProps) {
  return (
    <section className="mm-close">
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
        <span className="mm-close-sub">
          Not ready?{" "}
          <a
            href={PUBLICATION_URL}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("substack_click", { source: "close" })}
          >
            Take the weekly read instead.
          </a>
        </span>
      </div>
    </section>
  );
}
