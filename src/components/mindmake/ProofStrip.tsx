import { Link } from "react-router-dom";
import { Arrive } from "@/components/mindmake/Arrive";
import { Instrument } from "@/components/mindmake/Instrument";
import { ProofDrum } from "@/components/mindmake/ProofDrum";
import { attendeeBrands, clientStories, FIGURE_INSTRUMENT } from "@/data/rebuildProof";

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
        <h2 id="proof-strip-title"><Instrument kind="levels" className="mm-head-mark" />Real work, and what changed because of it.</h2>

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
