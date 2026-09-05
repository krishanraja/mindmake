import { Instrument } from "@/components/mindmake/Instrument";
import { MobileChapter } from "@/components/mindmake/MobileChapter";
import { StoryFigureView } from "@/components/mindmake/StoryFigure";
import { clientStories, FIGURE_INSTRUMENT } from "@/data/rebuildProof";

/**
 * Two of the eight stories, on a door page.
 *
 * Until 5 September 2026 neither door carried any client proof: the reader
 * was shown the mechanism, then the form, and the evidence that any of it had
 * worked for anyone was two pages away. The card is the archive's own, so the
 * figure and the quote are the record's and nothing is restated for the door.
 * Quotes are exempt from the same-sentence gate, because a client's sentence
 * on two pages is two pieces of evidence and not our copy said twice.
 *
 * Chaptered on a phone, the way the archive is: two full cards ran 1.43
 * screens at 360px, and the second is one tap away rather than a scroll.
 * Each figure is a scrubbed build of its own, which is what keeps the
 * section moving as it is read.
 */
export function DoorStories({ ids }: { ids: readonly string[] }) {
  const stories = ids.map((id) => clientStories.find((story) => story.id === id)).filter((story) => story !== undefined);

  return (
    <MobileChapter
      className="mm-stories-archive mm-door-stories"
      shown={1}
      noun="story"
      items={stories.map((story) => (
        <article className="mm-story-full" key={story.id}>
          <div className="mm-story-copy">
            <h3>
              <Instrument kind={FIGURE_INSTRUMENT[story.figure.shape]} className="mm-head-mark" />
              {story.result}
            </h3>
            <p className="mm-story-outcome">{story.outcome}</p>
            <blockquote>
              {story.quote}
              <cite>{story.attribution}</cite>
            </blockquote>
          </div>
          <StoryFigureView figure={story.figure} />
        </article>
      ))}
    />
  );
}
