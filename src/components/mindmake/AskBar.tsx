import { useId, useState } from "react";
import { HumanHandoff } from "@/components/mindmake/HumanHandoff";
import { ASK_UNMATCHED, findAnswer } from "@/lib/askCorpus";
import { track } from "@/lib/analytics";

/**
 * One input at the close of each page: ask anything, get a straight answer at
 * once. The bar is the product demo. The whole site claims plain-English
 * answers from a system that knows its owner, and this is that claim operating.
 *
 * An unmatched question used to be logged and then dropped, which is the one
 * case on this site where somebody has told us in their own words exactly what
 * they wanted and we had nothing for them. The corpus has edges, because it is
 * written by people rather than generated on the spot, and an edge is a person
 * standing at it. So the miss keeps its answer and gains a quiet offer under it.
 */
export function AskBar() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [missed, setMissed] = useState(false);
  const inputId = useId();
  const outputId = useId();

  const ask = () => {
    const asked = question.trim();
    if (!asked) return;
    const match = findAnswer(asked);
    setAnswer(match ? match.answer : ASK_UNMATCHED);
    setMissed(!match);
    track(
      "ask_submit",
      match
        ? { matched: true, topic: match.id }
        : { matched: false, question: asked.slice(0, 120) },
    );
  };

  return (
    <div className="mm-ask">
      <label className="mm-visually-hidden" htmlFor={inputId}>Ask us anything</label>
      <div className={`mm-ask-bar${question.trim() ? " has-text" : ""}`}>
        <input
          id={inputId}
          type="text"
          value={question}
          placeholder="Ask us anything, and get a straight answer."
          aria-describedby={answer ? outputId : undefined}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              ask();
            }
          }}
        />
        <button type="button" onClick={ask}>Ask</button>
      </div>
      {answer && (
        <p className="mm-ask-out" id={outputId} role="status">{answer}</p>
      )}
      {/* Quiet, and only on a miss. The ask bar sits at the close of a page
          under everything else, and a full panel opening itself there under
          every unanswered question would be the site raising its voice. */}
      {missed && <HumanHandoff reason="ask-unmatched" asTrigger />}
    </div>
  );
}
