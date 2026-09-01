import { Arrive } from "@/components/mindmake/Arrive";
import { Instrument } from "@/components/mindmake/Instrument";
import { AskBar } from "@/components/mindmake/AskBar";
import { OneAtATime } from "@/components/mindmake/OneAtATime";
import { ASK_ENTRIES, type AskEntry } from "@/lib/askCorpus";

/**
 * The questions, one answer at a time.
 *
 * They come from `src/content/answers.json` by id, which is the same corpus the
 * ask bar and /faq read. They used to be hand-copied into each page, and the
 * copies had already drifted: four answers said one thing on a page and another
 * in the corpus. There is one source now, so that cannot happen again.
 *
 * The ask bar sits underneath, because this is the section where answering a
 * question belongs. It used to live in the close block, directly under copy
 * asking for a company address, which made a lookup box look like a lead form.
 *
 * ## Why this is not a drum any more
 *
 * It was, and the drum was the single densest thing on the site. Measured at
 * 390px, the screen holding it carried 487 words on `/`, 524 on `/ai-brain` and
 * 518 on `/ai-gtm`, against a site median of about 100, and it rendered as one
 * card clipped mid-word at the left edge beside a second sliced vertically at
 * the right. Worse, `.mm-drum` is `overflow: hidden` with a JavaScript
 * transform, so with scripting off it showed one card of eight and clipped
 * 2,308px of answers with no scrollbar. That is the contract's own rule broken
 * on the section a reader reaches when they have a question.
 *
 * The stack shows every question and one answer. The drum keeps the job it is
 * right for, which is thirty-three short quotes you graze past in `ProofDrum`,
 * not eight questions you look up.
 *
 * An earlier attempt at this failed and is worth naming, because it looks like
 * the same idea. The questions were once cards that clamped their answer to
 * three lines and expanded on tap, and that fell over for a geometric reason:
 * in a row, an open card stretches its neighbours, so every card nobody opened
 * kept its truncation and gained dead space underneath. A vertical stack at a
 * measured height has neither problem.
 */

interface QuestionsProps {
  /** Ids from the corpus, in the order this page wants them asked. */
  ask: string[];
  label?: string;
}

export function ObjectionChips({ ask, label = "Questions people ask us" }: QuestionsProps) {
  const entries = ask
    .map((id) => ASK_ENTRIES.find((entry) => entry.id === id))
    .filter((entry): entry is AskEntry => Boolean(entry));

  return (
    <div className="mm-questions">
      <Arrive>
        <div className="mm-drum-head">
          <h2 className="mm-objections-title">
            <Instrument kind="flap" className="mm-head-mark" />{label}
          </h2>
          <p className="mm-drum-hint">
            <span>{entries.length} of them. The answer opens under the question.</span>
          </p>
        </div>
      </Arrive>

      {/* The rows do not arrive. A reveal fires on an element's vertical
          position and all ten of these share one, so reaching the section would
          fire the lot at once. The stack has its own motion instead: the line
          beside the questions still to come is dashed and drifts. */}
      <OneAtATime
        name={`questions-${ask.join("-")}`}
        rows={entries.map((entry) => ({
          id: entry.id,
          title: entry.question,
          body: <p>{entry.answer}</p>,
        }))}
      />

      <AskBar />
    </div>
  );
}
