import { Link } from "react-router-dom";
import { Arrive } from "@/components/mindmake/Arrive";
import { Instrument } from "@/components/mindmake/Instrument";
import { ProofDrum } from "@/components/mindmake/ProofDrum";
import { StoryFigureView } from "@/components/mindmake/StoryFigure";
import { FilmPlate } from "@/components/mindmake/FilmPlate";
import { attendeeBrands, clientStories, FIGURE_INSTRUMENT } from "@/data/rebuildProof";
import filmFourPoster from "@/assets/films/film-04-poster.jpg";
import filmFourPosterWebp from "@/assets/films/film-04-poster.webp";
import filmFourLoop from "@/assets/films/film-04-loop.mp4";
import filmFourLoopWebm from "@/assets/films/film-04-loop.webm";

/**
 * The proof, kept in its three separate families.
 *
 * Client outcomes stay anonymous by role and sector, because that is what those
 * clients agreed to. The named references are people who have worked with the
 * founder and are named with their consent, and they are described as exactly
 * that rather than passed off as client results. The logos are attendance and
 * say so. Mixing the three would be the easiest lie on the page, so the markup
 * keeps them apart.
 */

const SHOWN_STORIES = 3;

export function ProofStrip() {
  const stories = clientStories.slice(0, SHOWN_STORIES);

  return (
    <section className="mm-block" aria-labelledby="proof-strip-title">
      <div className="mm-container">
        {/* The film belongs here for the same reason it does on both door
            pages: below the hero the homepage carried no imagery at all, for
            five screens. It is also the only thing in this half of the page
            that moves on its own — a plate runs a slow light sweep whether or
            not its loop is playing, and a reader who has stopped scrolling to
            read three case cards is looking at a still photograph of a website
            without it.

            Film four is the brass rail carrying sheets to a gate, where a hand
            lifts one before the rail resumes: work moving through, and a person
            deciding. That is what this section is about. */}
        <div className="mm-head-split">
          <h2 id="proof-strip-title"><Instrument kind="levels" className="mm-head-mark" />Real work, and what changed because of it.</h2>
          <FilmPlate
            className="mm-impact-film"
            poster={filmFourPoster}
            posterWebp={filmFourPosterWebp}
            src={filmFourLoop}
            srcWebm={filmFourLoopWebm}
            label="A brass rail carrying cream sheets to a small gate, where a hand lifts the top sheet before the rail resumes."
          />
        </div>

        {/* They arrive one after another as you reach them. Three finished
            cards in a row was one of the viewports that read near zero on the
            aliveness sweep: nothing moving while they were read, and nothing
            changing as they were scrolled past. */}
        <div className="mm-stories">
          <Arrive stagger>
          {stories.map((story) => (
            <article className="mm-story" key={story.id}>
              {/* The mark the archive card already carries for this shape of
                  outcome. Every other card family on the site has one; these
                  three did not, which is also why three of them stacked on a
                  phone were a screen with nothing moving in it. */}
              <h3>
                <Instrument kind={FIGURE_INSTRUMENT[story.figure.shape]} className="mm-head-mark" />
                {story.title}
              </h3>
              <p className="mm-story-outcome">{story.outcome}</p>
              {/* The figure the story's own record holds, drawn rather than
                  described. Every one of these three already carried a full
                  `figure` in `rebuildProof.ts` — a span, an offer and a count,
                  with real numbers and the labels they were recorded under —
                  and this card rendered only the little mark for its shape and
                  threw the diagram away. The archive on /case-studies has been
                  drawing them all along.

                  It is also the one thing on this screen that moves. Measured
                  on a phone before this, the viewport holding these three read
                  a whole-screen change of 0.026 against a floor of 0.15: three
                  finished cards, and nothing happening while they were read.
                  A `StoryFigureView` is scrubbed rather than revealed, so it
                  assembles as you read down it and unwinds if you read back
                  up. */}
              <StoryFigureView figure={story.figure} />
              <blockquote>{story.quote}</blockquote>
              <cite>{story.attribution}</cite>
            </article>
          ))}
          </Arrive>
        </div>

        <p style={{ marginTop: 18 }}>
          <Link className="mm-text-link" to="/case-studies">
            Read all eight <span aria-hidden="true">→</span>
          </Link>
        </p>

        {/* Three of nine references in a static grid became all thirty-three
            voices on a drum you can spin. The families stay labelled on the
            cards, so a session attendee still cannot be read as a client. */}
        <ProofDrum />

        <div className="mm-attendance">
          <h3>
            <Instrument kind="rail" className="mm-head-mark" />
            People from these organisations have joined our sessions
          </h3>
          <div className="mm-logo-rail">
            {attendeeBrands.map((brand) => (
              /* The cell carries the background; only the image is filtered,
                 because a filter applies to an element's own background too. */
              <div className="mm-logo-cell" key={brand.name}>
                <img src={brand.logo} alt={brand.name} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
