import { Instrument } from "@/components/mindmake/Instrument";
import stageHero from "@/assets/founder/krish-stage-2-hero.webp";
import stageHeroMobile from "@/assets/founder/krish-stage-2-hero-mobile.webp";
import stagePortrait from "@/assets/founder/krish-stage-portrait.webp";
import portrait from "@/assets/founder/krish-portrait.webp";

/**
 * The one place on the site written in the first person.
 *
 * The practice speaks as "we" everywhere else, and that does not change. This
 * section exists because thirty-three people gave testimony about working with
 * a named person, and proof that hides who the work was with is weaker proof.
 * So he says who he is, once, in his own voice, and then gets out of the way.
 *
 * Three treatments to choose between. `stage` puts the wide room shot beside
 * the note, `standing` crops that same frame to him, and `portrait` uses the
 * headshot, masked to a circle because the supplied file carries a decorative
 * cyan ring that belongs to no palette on this site.
 */
export type FounderTreatment = "stage" | "standing" | "portrait";

interface FounderNoteProps {
  treatment?: FounderTreatment;
}

export function FounderNote({ treatment = "standing" }: FounderNoteProps) {
  return (
    <section className={`mm-founder is-${treatment}`} aria-labelledby="founder-title">
      <div className="mm-container">
        <div className="mm-founder-grid">
          <figure className="mm-founder-shot">
            {treatment === "stage" && (
              <picture>
                <source media="(max-width: 700px)" srcSet={stageHeroMobile} />
                <img
                  src={stageHero}
                  width={1600}
                  height={891}
                  loading="lazy"
                  decoding="async"
                  alt="Krish Raja in conversation on stage, mid-sentence, gesturing towards the interviewer."
                />
              </picture>
            )}
            {treatment === "standing" && (
              <img
                src={stagePortrait}
                width={670}
                height={861}
                loading="lazy"
                decoding="async"
                alt="Krish Raja on stage, seated and mid-sentence with a hand raised."
              />
            )}
            {treatment === "portrait" && (
              <img
                src={portrait}
                width={536}
                height={536}
                loading="lazy"
                decoding="async"
                alt="Krish Raja, head and shoulders, smiling."
              />
            )}
          </figure>

          <div className="mm-founder-note">
            <h2 id="founder-title">
              <Instrument kind="drawer" className="mm-head-mark" />
              Who you would be working with
            </h2>
            <p className="mm-founder-name">
              <b>Krish Raja</b>
              <span>Founder, Mindmake</span>
            </p>
            <p>
              I spent twenty years in digital media and data, most of it running commercial teams
              at companies whose product was a technology most of their customers could not
              explain. My job was usually the same one: take something complicated and make it
              something a person could act on.
            </p>
            <p>
              Mindmake does that with AI. I build the system with you, inside your own accounts,
              and I show you how it works while we build it, because a system you cannot see
              inside is one you have to keep paying someone to operate. When the thirty days end,
              it is yours and it keeps running.
            </p>
            <p className="mm-founder-close">
              The quotes above are from people I have worked with, and the references are from
              people I worked for and alongside. They are all real, and none of them are edited.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
