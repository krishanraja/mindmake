import { Link } from "react-router-dom";
import { attendeeBrands, careerReferences, clientStories } from "@/data/rebuildProof";

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
const SHOWN_REFERENCES = 3;

export function ProofStrip() {
  const stories = clientStories.slice(0, SHOWN_STORIES);
  const references = careerReferences.slice(0, SHOWN_REFERENCES);

  return (
    <section className="mm-block" aria-labelledby="proof-strip-title">
      <div className="mm-container">
        <h2 id="proof-strip-title">Real work, and what changed because of it.</h2>

        <div className="mm-stories">
          {stories.map((story) => (
            <article className="mm-story" key={story.id}>
              <h3>{story.title}</h3>
              <p className="mm-story-outcome">{story.outcome}</p>
              <blockquote>{story.quote}</blockquote>
              <cite>{story.attribution}</cite>
            </article>
          ))}
        </div>

        <p style={{ marginTop: 18 }}>
          <Link className="mm-text-link" to="/case-studies">
            Read all eight <span aria-hidden="true">→</span>
          </Link>
        </p>

        <div className="mm-references">
          <h3>People who have worked with our founder</h3>
          <div className="mm-reference-grid">
            {references.map((reference) => (
              <figure className="mm-reference" key={reference.name}>
                <blockquote>{reference.quote}</blockquote>
                <figcaption>
                  <strong>{reference.name}</strong>
                  <span>{reference.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="mm-attendance">
          <h3>People from these organisations have joined our sessions</h3>
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
