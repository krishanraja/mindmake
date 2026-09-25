import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { Instrument } from "@/components/mindmake/Instrument";
import { CloseBlock } from "@/components/mindmake/CloseBlock";
import { Arrive } from "@/components/mindmake/Arrive";
import { testimonials } from "@/data/testimonials";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import { CONTACT_EMAIL } from "@/lib/publicLinks";
import headshot from "@/assets/founder/krish-about.webp";
import "@/styles/mindmake.css";
import "@/styles/mindmake-instruments.css";
import "@/styles/mindmake-about.css";

/**
 * Who runs the practice, and why it exists (Krish, 2026-09-25).
 *
 * The page opens in the practice's own "we", then hands over to Krish in the
 * first person, because this is the one place a reader has come to meet him.
 * Canon permits biography here and career references "on the operator/about
 * surface" (04_PROOF.md). The facts come from his own published record at
 * krishraja.com. They are career history, never client results, and there is
 * no count of leaders helped until that trail is approved.
 *
 * The references are read from the testimonial store by id, so the words stay
 * exactly what their authors wrote.
 */
const REFERENCE_IDS = ["young", "wales-brown", "paine"] as const;
const references = REFERENCE_IDS.map((id) => testimonials.find((item) => item.id === id && item.family === "reference"))
  .filter((item): item is NonNullable<typeof item> => Boolean(item));

export default function About() {
  const { briefOpen, openBrief, closeBrief } = useLeadBriefHistory();

  return (
    <MindmakeShell onStart={openBrief}>
      <SEO
        title="About us"
        description="Who runs Mindmake and why. Sixteen years building commercial teams in media, data and technology, now spent helping leaders use AI to make better decisions."
        canonical="/about"
      />

      <section className="mm-answers-page mm-about-page" aria-labelledby="about-title">
        <div className="mm-container">
          <div className="mm-answers-hero">
            <h1 id="about-title">About us.</h1>
            <p>
              Mindmake is a small practice that helps leaders use AI to make better decisions, then
              builds the systems that carry those decisions out. One person runs it, and he would
              love to meet you.
            </p>
          </div>
        </div>
      </section>

      <section className="mm-founder is-standing mm-about-founder" aria-labelledby="founder-title">
        <div className="mm-container">
          <div className="mm-founder-grid">
            <Arrive stagger>
              <figure className="mm-founder-shot">
                <div className="mm-plate mm-founder-plate">
                  <img
                    src={headshot}
                    width={1022}
                    height={1222}
                    decoding="async"
                    alt="Krish Raja standing in a bright room, hands in pockets, smiling."
                  />
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
                <p>
                  Hello, I'm Krish. I have spent sixteen years building commercial teams and
                  businesses in media, data and technology, at Microsoft, Nine, SingTel and Captify,
                  across the UK, Australia and the US. The part I loved most stayed the same the
                  whole way through: sitting with a smart person who was stuck, and working out
                  together what to do next.
                </p>
                <p>
                  I started at Microsoft, writing automations that turned weeks of data entry into
                  hours. Since then I have launched markets from scratch and built revenue lines that
                  did not exist before. At Nine, digital revenue grew from $9M to $61M. At Captify, I
                  built the Australian business from zero to $12M a year. At SingTel, we took a
                  platform business from $4M to $38M across twelve markets.
                </p>
              </div>
            </Arrive>
          </div>
        </div>
      </section>

      <section className="mm-block mm-about-why" aria-labelledby="about-why-title">
        <div className="mm-container">
          <Arrive>
            <div className="mm-about-prose">
              <h2 id="about-why-title">
                <Instrument kind="recorder" className="mm-head-mark" />
                Why I started Mindmake
              </h2>
              <p>
                Over the last few years I watched people I respect feel quietly left behind by AI.
                They had plenty of intelligence. What they were short of was time, and someone who
                would explain it plainly and show it working in a real business.
              </p>
              <p>
                So I built my own first. Mindmake runs on fourteen AI agents with named roles and a
                shared memory. They do the research, the follow-ups and the admin, and I make the
                calls. Everything we show you is something I use every day and pay for myself, so
                you hear what it really costs and where it still breaks.
              </p>
              <p>
                I would rather you left a first conversation with one good idea to use on Monday
                than with a proposal. If that sounds useful, I would love to hear what you are
                working on. You can write to me at{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              </p>
              <p className="mm-about-study">
                MA Design Strategy (Distinction), University for the Creative Arts. BA English
                Language and Linguistics, University of Manchester. Harvard Business School
                Executive Education.
              </p>
            </div>
          </Arrive>
        </div>
      </section>

      <section className="mm-block mm-on-raise" aria-labelledby="about-words-title">
        <div className="mm-container">
          <h2 id="about-words-title">
            <Instrument kind="rail" className="mm-head-mark" />
            In the words of people he has worked with
          </h2>
          <div className="mm-about-references">
            <Arrive stagger>
            {references.map((reference) => (
              <figure key={reference.id}>
                <blockquote>“{reference.excerpt}”</blockquote>
                <figcaption>
                  <b>{reference.name}</b>
                  <span>{reference.role}</span>
                </figcaption>
              </figure>
            ))}
            </Arrive>
          </div>
        </div>
      </section>

      <CloseBlock
        instrument="levels"
        claim="Tell us what you are working on."
        body="Four details, and we do the reading before we talk."
        onStart={openBrief}
      />

      <LeadBrief open={briefOpen} onClose={closeBrief} />
    </MindmakeShell>
  );
}
