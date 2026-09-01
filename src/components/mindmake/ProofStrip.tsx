import { Link } from "react-router-dom";
import { Instrument } from "@/components/mindmake/Instrument";
import { ProofDrum } from "@/components/mindmake/ProofDrum";
import { StoryIndex } from "@/components/mindmake/StoryIndex";
import { FilmPlate } from "@/components/mindmake/FilmPlate";
import { attendeeBrands } from "@/data/rebuildProof";
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
 *
 * ## Two sections, from 1 September 2026
 *
 * It was one, and it was six things: a heading, a film, three story cards, a
 * link to the rest, thirty-three quotes on a drum and a rail of logos. Measured
 * at 360px that section ran 2.61 screens, the tallest on the site, and the
 * reason was not long copy. It was three jobs stacked: the client outcomes, the
 * references, and who has been in the room. Each is a different claim and each
 * now gets its own screen.
 */
export function ProofStrip() {
  return (
    <section className="mm-block" aria-labelledby="proof-strip-title">
      <div className="mm-container">
        {/* The film belongs here for the same reason it does on both door
            pages: below the hero the homepage carried no imagery at all, for
            five screens. Film four is the brass rail carrying sheets to a gate,
            where a hand lifts one before the rail resumes: work moving through,
            and a person deciding. That is what this section is about. */}
        <div className="mm-head-split">
          <h2 id="proof-strip-title"><Instrument kind="levels" className="mm-head-mark" /><span>Real work, and what changed because of it.</span></h2>
          <FilmPlate
            className="mm-impact-film"
            poster={filmFourPoster}
            posterWebp={filmFourPosterWebp}
            src={filmFourLoop}
            srcWebm={filmFourLoopWebm}
            label="A brass rail carrying cream sheets to a small gate, where a hand lifts the top sheet before the rail resumes."
          />
        </div>

        {/* All eight, one in front. This was three cards and a link to the
            other five, which is a section that shows you a third of itself. */}
        <StoryIndex />
      </div>
    </section>
  );
}

/**
 * Who has said so, and who has been in the room.
 *
 * Two families of proof that are not client outcomes, on their own ground so
 * that nobody can read a session attendee as a client. The link to the written
 * archive belongs here rather than under the outcomes, because this is the end
 * of the proof rather than the middle of it.
 */
export function ProofVoices() {
  return (
    <section className="mm-block mm-on-raise" aria-labelledby="proof-voices-title">
      <div className="mm-container">
        {/* The drum carries the band's heading rather than sitting under a
            second one saying the same thing. It names the founder, which is
            the framing of the proof and one of the three places the canon
            allows it. */}
        <ProofDrum headingId="proof-voices-title" />

        <div className="mm-attendance">
          <h3>
            <Instrument kind="drawer" className="mm-head-mark" />
            <span>People from these organisations have joined our sessions</span>
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

        <p className="mm-voices-more">
          <Link className="mm-text-link" to="/case-studies">
            Read the written archive <span aria-hidden="true">→</span>
          </Link>
        </p>
      </div>
    </section>
  );
}
