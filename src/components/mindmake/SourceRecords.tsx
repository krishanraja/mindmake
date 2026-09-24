import { Instrument } from "@/components/mindmake/Instrument";
import { StoryFigureView } from "@/components/mindmake/StoryFigure";
import { clientStories, FIGURE_INSTRUMENT } from "@/data/rebuildProof";

/**
 * The source records. UNUSED.
 *
 * This was the second half of /case-studies: one plain block per client, their
 * quote and the only diagram bound to the record, sitting a page below the
 * proof field that carried the claim. It was 44% of the page on desktop and
 * 56% of it on a phone, and it meant every record was rendered twice with each
 * copy holding half of it.
 *
 * Retired on 24 September 2026 by owner decision, with the field merged into
 * one surface: "remove it from the page but dont destroy the component, just
 * mark it as unused, and ensure nothing good is lost in terms of quotes/clear
 * business outcomes." Nothing was. Every field this rendered now appears in
 * CaseProofField — result and attribution on the cold tile, quote and
 * StoryFigureView in the open record — and the proof-field gate asserts each
 * one against src/data/rebuildProof.ts per story.
 *
 * Kept whole rather than deleted so the previous composition stays legible.
 * It is mounted nowhere; do not mount it beside the field without reading
 * project-documentation/website-redesign/STATE.md first, because two renderings
 * of the same eight records is the defect this removed.
 */
export function SourceRecords() {
  return (
    <section id="case-archive" className="mm-block mm-on-raise" aria-labelledby="archive-title">
      <div className="mm-container">
        <h2 id="archive-title">
          <Instrument kind="recorder" className="mm-head-mark" />
          The source records.
        </h2>
        <p className="mm-lede">One record per client: their words, and what the work changed.</p>
        <div className="mm-stories-archive">
          {clientStories.map((story) => (
            <article id={`record-${story.id}`} className="mm-story-full" key={story.id} tabIndex={-1}>
              <div className="mm-story-copy">
                <h2>
                  <Instrument kind={FIGURE_INSTRUMENT[story.figure.shape]} className="mm-head-mark" />
                  {story.result}
                </h2>
                <blockquote>
                  {story.quote}
                  <cite>{story.attribution}</cite>
                </blockquote>
              </div>
              <StoryFigureView figure={story.figure} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
