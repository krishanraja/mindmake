import { useState } from "react";
import { SEO } from "@/components/SEO";
import { AgathaStory, PageCompletionBeacon } from "@/components/new-age/AgathaStory";
/* The chart stays on its own utility classes. It is a diagram in its own frame
   rather than a page laid out in a retired system, and its classes never touch
   the page around it. The prose that used to sit beside it did, and has moved. */
import { OrgChart } from "@/components/new-age/OrgChart";
import { CloseBlock } from "@/components/mindmake/CloseBlock";
import { FilmPlate } from "@/components/mindmake/FilmPlate";
import { Instrument } from "@/components/mindmake/Instrument";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { ProcessTrack } from "@/components/mindmake/ProcessTrack";
import { ReflexDeck } from "@/components/mindmake/ReflexDeck";
import { ScrubText } from "@/components/mindmake/ScrubText";
import { useScrollDriver } from "@/hooks/useScrollDriver";
import { HOURS, TURN } from "@/content/reflex";
import filmFivePoster from "@/assets/films/film-05-poster.jpg";
import filmFivePosterWebp from "@/assets/films/film-05-poster.webp";
import filmFiveLoop from "@/assets/films/film-05-proof.mp4";
import filmFiveLoopWebm from "@/assets/films/film-05-proof.webm";
import "@/styles/mindmake.css";
import "@/styles/mindmake-instruments.css";

/**
 * The argument, published, as something to flick through.
 *
 * This page existed for months as an org chart nobody could reach: prerendered,
 * in the sitemap, linked from no page in `src/`, and the last file on the old
 * Tailwind vocabulary while the rest of the site moved to `mm-*`. It held the
 * evidence for an argument it never made.
 *
 * The argument itself was already written, in `00_NORTH_STAR.md`, and had never
 * reached a public surface: a leader gets hours back and no better at deciding
 * unless the hours go somewhere, and you can hand over the work but not the
 * understanding. The history in front of it answers the other half, which is
 * why a leader stops after one wrong answer.
 *
 * ## Why it is a page and not a homepage section
 *
 * The homepage runs twelve sections and its job is to get a fit visitor into
 * the brief, not to win an argument. An argument needs room. So the homepage
 * gains one link and nothing else, and a reader who wants the reasoning finds
 * a page rather than a paragraph. Fixing the orphan was free either way.
 *
 * ## Why there are so few words on it
 *
 * The first draft of this page was paragraphs, and the direction back was that
 * the design, the interaction and the pictures should carry it. So every beat
 * is an instrument the site already owns, with one line on it: a deck you turn,
 * a line that lights as you pass, the track, the chart, a figure. Nothing here
 * is explained under itself.
 *
 * ## What came out of the retired version
 *
 * The old homepage put this as three flip cards headed "Every leader will fall
 * into one of two categories", whose fronts read "Or report to it", "Or become
 * a commodity" and "Or get passed by". `01_CANON.md` bans exactly that:
 * public copy "never threatens the reader with becoming obsolete". The value
 * halves of those cards survive here almost intact; the threats do not. The
 * flip is gone too, because it hid half the content behind a tap and told the
 * reader to perform it.
 */

const description =
  "AI gives a leader hours back every week. What the hours go into decides whether the leader gets better at the job or only faster at the work.";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "You can hand over the work",
  description,
  author: { "@type": "Organization", name: "Mindmake", url: "https://mindmake.co" },
  publisher: { "@type": "Organization", name: "Mindmake", url: "https://mindmake.co" },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://mindmake.co/new-age-leadership",
  },
};

export default function NewAgeLeadership() {
  const [briefOpen, setBriefOpen] = useState(false);
  const plateRef = useScrollDriver<HTMLDivElement>();

  return (
    <MindmakeShell onStart={() => setBriefOpen(true)}>
      <SEO
        title="What a leader does with the hours AI gives back"
        description={description}
        canonical="/new-age-leadership"
        ogType="article"
        keywords="AI and leadership, resistance to new technology, AI org chart, human judgement"
        jsonLd={jsonLd}
      />

      <section className="mm-hero" aria-labelledby="reflex-title">
        <div className="mm-container mm-hero-split">
          <div>
            <h1 className="mm-setup" id="reflex-title">You can hand over the work.</h1>
            <ScrubText className="mm-claim" text="You cannot hand over the understanding." />
            <p className="mm-lede">
              AI gives a leader hours back every week. What the hours go into is the whole
              question.
            </p>
          </div>
          {/* The specimen drawers: a record being kept, and a handwritten note
              waiting beside it. The one film about memory and a human hand. */}
          <div className="mm-hero-film mm-parallax" ref={plateRef}>
            <FilmPlate
              className="mm-parallax-plate"
              poster={filmFivePoster}
              posterWebp={filmFivePosterWebp}
              src={filmFiveLoop}
              srcWebm={filmFiveLoopWebm}
              label="A wall of walnut specimen drawers. A brass arm files one cream card while a handwritten note waits under a paperweight."
              priority
            />
          </div>
        </div>
      </section>

      {/* Paper, because it is the page's reading ground and four cards on cream
          read as an index rather than a wall. */}
      <section className="mm-block mm-on-paper" aria-labelledby="history-title">
        <div className="mm-container">
          <h2 id="history-title">
            <Instrument kind="drawer" className="mm-head-mark" />
            People have blamed their tools for a long time.
          </h2>
          <ReflexDeck />
        </div>
      </section>

      {/* One line, lit word by word as the reader passes it, and the source in
          the data voice underneath. It carries the four cards above it, which
          is why it gets a screen of its own rather than a paragraph under them. */}
      <section className="mm-block" aria-labelledby="turn-title">
        <div className="mm-container mm-turn">
          <h2 className="mm-visually-hidden" id="turn-title">What the objections have in common</h2>
          <ScrubText className="mm-claim mm-turn-line" text={TURN.line} />
          <p className="mm-turn-source">{TURN.source}</p>
        </div>
      </section>

      <section className="mm-block mm-on-raise" aria-labelledby="hours-title">
        <div className="mm-container">
          <div className="mm-head-split">
            <h2 id="hours-title">
              <Instrument kind="levels" className="mm-head-mark" />
              Two things a leader can do with the same hour.
            </h2>
            <p className="mm-lede">{HOURS.lede}</p>
          </div>
          <div style={{ marginTop: 20 }}>
            <ProcessTrack first={HOURS.first} second={HOURS.second} />
          </div>
          <div className="mm-answer">
            <ScrubText className="mm-claim" text={HOURS.payoff} />
          </div>
        </div>
      </section>

      <section className="mm-block" aria-labelledby="chart-title">
        <div className="mm-container">
          <div className="mm-head-split">
            <h2 id="chart-title">
              <Instrument kind="rail" className="mm-head-mark" />
              What that looks like in a working company.
            </h2>
            <p className="mm-lede">
              Our own chart. Every role carries the decision that created it.
            </p>
          </div>
          <div style={{ marginTop: 20 }}>
            <OrgChart onStart={() => setBriefOpen(true)} />
          </div>
        </div>
      </section>

      <AgathaStory ground="paper" />

      <CloseBlock
        instrument="drawer"
        claim="Find one hand-off worth improving first."
        body="Mindmake reads the company and shows one useful starting point. You see the brief before you choose whether to share it."
        onStart={() => setBriefOpen(true)}
      />

      <PageCompletionBeacon />
      <LeadBrief open={briefOpen} onClose={() => setBriefOpen(false)} />
    </MindmakeShell>
  );
}
