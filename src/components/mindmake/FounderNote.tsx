import { Arrive } from "@/components/mindmake/Arrive";
import { MobileChapter } from "@/components/mindmake/MobileChapter";
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
        {/* The picture, then the note. Two blocks rather than one, so the
            person arrives a beat before what he says, which is the order a
            reader meets them in anyway. */}
        <div className="mm-founder-grid">
          <Arrive stagger>
          {/* The portrait sits in a plate, like every other image on the site.
              A plate carries a slow grain drift and a light sweep whether or
              not a film is playing, which is the ambient layer the design
              contract requires on every viewport-height of every page. Measured
              on a phone before this, the founder screen read a whole-screen
              change of 0.012 with two of sixty-four cells moving: a portrait
              and four paragraphs, and nothing happening in either. */}
          <figure className="mm-founder-shot">
            <div className="mm-plate mm-founder-plate">
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
            </div>
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
            {/* Three paragraphs of serif is a screen and a half on a phone, and
                it measured as one: a whole-screen change of 0.019 with nothing
                at all moving in it, because a wall of prose has nothing to move.
                The device for that already exists and is used on /ai-brain and
                /case-studies. The first paragraph says who he is, which is what
                the heading promised; the rest is there for anyone who wants it. */}
            <MobileChapter
              shown={1}
              noun="paragraphs"
              items={[
                <p key="one">
                  I run Mindmake the way I tell clients to run their own businesses. Fourteen
                  agents with named roles and a shared memory do the throughput, and I make the
                  calls. The playbook you would see on a call is the one my own company runs on,
                  and I am still paying the model bills, which is where most of what I know about
                  the cost of running this comes from.
                </p>,
                <p key="two">
                  Before this, twenty years in digital media and data, mostly running commercial
                  teams at companies selling a technology their customers could not explain. The
                  job was always to take something complicated and make it something a person could
                  act on. It still is. I build inside your own accounts and show you how it works
                  as we go, so when the work ends it is yours.
                </p>,
                <p className="mm-founder-close" key="three">
                  The quotes above are from people I have worked with, and the references are from
                  people I worked for and alongside. They are all real, and none of them are edited.
                </p>,
              ]}
            />
          </div>
          </Arrive>
        </div>
      </div>
    </section>
  );
}
