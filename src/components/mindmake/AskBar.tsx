import { useId, useState } from "react";
import { ASK_UNMATCHED, findAnswer } from "@/lib/askCorpus";
import { track } from "@/lib/analytics";

/**
 * One input at the close of each page: ask anything, get a straight answer at
 * once. The bar is the product demo. The whole site claims plain-English
 * answers from a system that knows its owner, and this is that claim operating.
 * An unmatched question is logged rather than lost.
 */
export function AskBar() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const inputId = useId();
  const outputId = useId();

  const ask = () => {
    const asked = question.trim();
    if (!asked) return;
    const match = findAnswer(asked);
    setAnswer(match ? match.answer : ASK_UNMATCHED);
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
          placeholder="Ask us anything. Straight answer, instantly."
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
    </div>
  );
}
