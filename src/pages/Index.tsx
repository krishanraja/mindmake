import { useMemo, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { CloseBlock } from "@/components/mindmake/CloseBlock";
import { FilmPlate } from "@/components/mindmake/FilmPlate";
import { FounderNote } from "@/components/mindmake/FounderNote";
import { Instrument } from "@/components/mindmake/Instrument";
import { Build } from "@/components/mindmake/Build";
import { ScrubText } from "@/components/mindmake/ScrubText";
import { Marquee } from "@/components/mindmake/Marquee";
import { ObjectionChips } from "@/components/mindmake/ObjectionChips";
import { ProcessTrack } from "@/components/mindmake/ProcessTrack";
import { ProofStrip, ProofVoices } from "@/components/mindmake/ProofStrip";
import { SubscribeBand } from "@/components/mindmake/SubscribeBand";
import { BoardFilters } from "@/components/mindmake/board/BoardFilters";
import { FlapRow } from "@/components/mindmake/board/FlapRow";
import { HINGE, HOURS } from "@/content/reflex";
import { useBoardData } from "@/hooks/useBoardData";
import { useIsMobile } from "@/hooks/use-mobile";
import { useShortScreen } from "@/hooks/useShortScreen";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import { useScrollDriver } from "@/hooks/useScrollDriver";
import { countMatching, isShown, isStale, recentMatching, roleCounts, timestampLabel, type Role } from "@/lib/board";
import { track } from "@/lib/analytics";
import filmOnePoster from "@/assets/films/film-01-poster.jpg";
import filmOnePosterWebp from "@/assets/films/film-01-poster.webp";
import filmOneLoop from "@/assets/films/film-01-loop.mp4";
import filmOneLoopWebm from "@/assets/films/film-01-loop.webm";
import filmTwoPoster from "@/assets/films/film-02-poster.jpg";
import filmTwoPosterWebp from "@/assets/films/film-02-poster.webp";
import filmTwoLoop from "@/assets/films/film-02-loop.mp4";
import filmTwoLoopWebm from "@/assets/films/film-02-loop.webm";
import filmThreePoster from "@/assets/films/film-03-poster.jpg";
import filmThreePosterWebp from "@/assets/films/film-03-poster.webp";
import filmThreeLoop from "@/assets/films/film-03-loop.mp4";
import filmThreeLoopWebm from "@/assets/films/film-03-loop.webm";
import "@/styles/mindmake.css";
import "@/styles/mindmake-instruments.css";

/**
 * The morning's read, on the board's own rows.
 *
 * The homepage used to carry one card: today's highest-scoring item with its
 * summary and its point of view. One item next to two thirds of an empty screen
 * is not evidence that anything is running. This is the same board the /ai-gtm
 * page publishes, cut to what a homepage owes -- headlines and their sources,
 * no summary and no point of view, because the promise here is that we read the
 * market every morning and the argument about it lives on the door page.
 *
 * It reads a week rather than a day for the reason the board does: a role chip
 * filtered to today alone would be empty for whole divisions on most days.
 * Measured live, seven days is 73 items with every one of the eight roles
 * stocked, and 13.7KB on the wire. The heading used to say "this week", and on
 * the day this was photographed the cache held one day, so the heading was a
 * claim the stamp beside it contradicted. The stamp carries the window now and
 * the heading carries none; each row carries its own age besides.
 */
function ProofLive() {
  const board = useBoardData({ days: 7 });
  const [role, setRole] = useState<Role | null>(null);
  const phone = useIsMobile();
  const short = useShortScreen();

  const days = useMemo(
    () => (board.status === "ready" ? board.days : []),
    [board],
  );
  const counts = useMemo(
    () => roleCounts(days.flatMap((day) => day.cards).filter(isShown)),
    [days],
  );
  const total = useMemo(() => countMatching(days, { role }), [days, role]);
  const rows = useMemo(
    () => recentMatching(days, { role, limit: short ? 3 : phone ? 4 : 6 }),
    [days, role, phone, short],
  );

  return (
    <section className="mm-block mm-on-raise mm-seam-above" aria-labelledby="proof-title">
      <div className="mm-container">
        <div className="mm-board-head">
          <h2 id="proof-title"><Instrument kind="recorder" className="mm-head-mark" />What changed in AI.</h2>
          {board.status === "ready" && (
            <span className={`mm-timestamp${isStale(board.cacheDate) ? " is-stale" : ""}`}>
              <i className={`mm-live-dot${isStale(board.cacheDate) ? " is-stale" : ""}`} aria-hidden="true" />
              {/* The cache's own stamp. This line was a hard-coded "Today 10:30
                  UTC" for months, on the one section whose whole claim is that
                  the timestamp is real. */}
              {timestampLabel(board.cacheDate, days.length, total)}
            </span>
          )}
        </div>
        {rows.length > 0 ? (
          <>
            <BoardFilters role={role} onRole={setRole} roleCounts={counts} />
            <Build className="mm-flap-panel">
              {rows.map((card, index) => (
                <FlapRow card={card} at={index} key={card.id} />
              ))}
            </Build>
            {/* The link alone. The count that sat beside it ("Showing 4 of 15
                in the last 1 days.") repeated the stamp above the rows, and
                the rows are countable. */}
            <p className="mm-flap-foot">
              <Link className="mm-text-link" to="/ai-gtm#board">
                See the whole board <span aria-hidden="true">&rarr;</span>
              </Link>
            </p>
          </>
        ) : board.status === "collapsed" ? (
          <p className="mm-board-rebuilding">The read is rebuilding. Back within the hour.</p>
        ) : null}
      </div>
    </section>
  );
}

export default function Index() {
  const { briefOpen, briefRoute, openBrief, closeBrief } = useLeadBriefHistory();
  const setupRef = useScrollDriver<HTMLHeadingElement>();
  const claimRef = useScrollDriver<HTMLParagraphElement>();
  const plateRef = useScrollDriver<HTMLDivElement>();

  return (
    <MindmakeShell onStart={openBrief}>
      <SEO
        title="Every AI you buy knows the market. Yours should also know you."
        description="Mindmake builds AI that knows how you work: your standards, your context and your past decisions. Thirty days, and you keep what it learns."
        canonical="/"
      />

      {/* The story down this page, decided 3 September 2026 after reading it
          on a phone: what this is, why it matters to a person, the choice,
          the proof, the live read, who you would work with, the questions,
          the publication, the ask. It used to put the choice second and the
          argument third, so a visitor was offered two products before being
          told why either one mattered. */}
      <section className="mm-hero" aria-labelledby="hero-title">
        <div className="mm-container">
          <div className="mm-hero-stage">
            {/* The film moves and the type sitting on it does not, and the two
                lines travel at slightly different rates as the page scrolls. */}
            <div className="mm-hero-plate mm-parallax" ref={plateRef}>
              <FilmPlate
                poster={filmOnePoster}
                posterWebp={filmOnePosterWebp}
                src={filmOneLoop}
                srcWebm={filmOneLoopWebm}
                label="An instrument room at first light. A brass mechanism of interlocking wheels turns at different speeds under a single blade of window light."
                className="mm-parallax-plate"
                style={{ height: "100%" }}
                scrim
                priority
              />
            </div>
            {/* `mm-first`: the type arrives once the faces are in, as the first
                beat of the entrance. The stage, the film and the wordmark are
                painted from the first frame; only the words wait. */}
            <div className="mm-hero-copy mm-first">
              <h1 className="mm-setup mm-parallax mm-parallax-slow" id="hero-title" ref={setupRef}>
                Every AI you buy knows the market.
              </h1>
              <p className="mm-claim mm-parallax mm-parallax-fast" ref={claimRef}>
                Yours should also know you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The problem, and the page's first change of ground.
          The hours AI gives a leader back, the two things those hours can go
          into, and the hinge the whole practice hangs on. It is the argument
          page's opening, condensed: the history of people blaming their tools
          stays over there as the deeper why, because on a phone a reader
          meeting the site for the first time should meet their own week, not
          somebody else's objection. Paper, because it is the most text-bearing
          screen on the page and the one that most wants light. */}
      <section className="mm-block mm-on-paper" aria-labelledby="hours-title">
        <div className="mm-container mm-first" style={{ "--mm-first-i": 1 } as CSSProperties}>
          <h2 id="hours-title"><Instrument kind="levels" className="mm-head-mark" />{HOURS.title}</h2>
          <div style={{ marginTop: 20 }}>
            <ProcessTrack first={HOURS.first} second={HOURS.second} />
          </div>
          <div className="mm-answer">
            <ScrubText className="mm-claim" text={HINGE} />
            {/* The one link to the argument page, which keeps the reasoning
                and the six-hundred-year history behind this sentence. */}
            <p className="mm-answer-more">
              <Link className="mm-text-link" to="/new-age-leadership">
                What the hours are for <span aria-hidden="true">&rarr;</span>
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* The two doors, as the page's one way in.
          They sat inside the hero until 3 September 2026, which offered the
          choice before the reason. They are their own section now, after the
          problem and before the proof, and they are marked as the primary
          action: exactly two, adjacent, in one control group, which is the
          shape `scripts/qa/one-way-in-check.mjs` reads as one fork rather than
          two offers, and what tells the mobile action bar to stand down while
          they are on screen. Each door carries the film from the page behind
          it, so the picture is a preview rather than decoration, and hovering
          one dims the other so the choice reads as physical. */}
      <section className="mm-block">
        <div className="mm-container">
          <div className="mm-doors" role="group" aria-label="Pick the door to start with">
            <Link className="mm-door" data-mm-primary to="/ai-brain" onClick={() => track("door_click", { door: "brain" })}>
              <FilmPlate
                className="mm-door-film"
                poster={filmTwoPoster}
                posterWebp={filmTwoPosterWebp}
                src={filmTwoLoop}
                srcWebm={filmTwoLoopWebm}
                label=""
                decorative
                scrim
              />
              <span className="mm-door-copy">
                <h2>An AI that knows how you work</h2>
                {/* The method, described and never named, per the canon: the
                    one thing on this site nobody else can say. Wording to be
                    confirmed by the owner before it ships. */}
                <p>Your standards, your context and the decisions you have already made, working as one system. It learns them by asking you to grade real examples of your own work, then writing down the rule you used.</p>
                <span className="mm-door-go">Build your AI brain <span aria-hidden="true">→</span></span>
              </span>
            </Link>
            <Link className="mm-door" data-mm-primary to="/ai-gtm" onClick={() => track("door_click", { door: "gtm" })}>
              <FilmPlate
                className="mm-door-film"
                poster={filmThreePoster}
                posterWebp={filmThreePosterWebp}
                src={filmThreeLoop}
                srcWebm={filmThreeLoopWebm}
                label=""
                decorative
                scrim
              />
              <span className="mm-door-copy">
                <h2>A way to sell that fits how AI works now</h2>
                <p>AI is changing what customers will pay for. We rebuild one part of how you sell, across what you offer, what you charge, how you stand out and who does the selling.</p>
                <span className="mm-door-go">Build your AI GTM <span aria-hidden="true">→</span></span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* The marquee is a band between the choice and the proof. */}
      <Marquee lines={["Built once. Better every week.", "What it learns stays yours."]} />

      <ProofStrip />

      <ProofVoices />

      <ProofLive />

      {/* Proof, then who you would be working with. */}
      <FounderNote treatment="standing" />

      {/* The questions, after the person. A reader who has seen the work and
          met who did it is the reader with a question left, and it sat second
          on the page, before either. */}
      <section className="mm-block mm-on-raise" aria-labelledby="home-questions-title">
        <div className="mm-container">
          <ObjectionChips
            titleId="home-questions-title"
            ask={["consultant", "chatgpt", "tried-it", "why-not-myself", "how-we-work", "included", "charging", "start", "email"]}
          />
        </div>
      </section>

      {/* Paper again, and the page's second light movement. The publication is
          a separate opt-in rather than a step in the offer, and the ground is
          what says so before a word is read. */}
      <SubscribeBand ground="paper" />

      {/* The two doors by name, because the choice was already being made for
          the visitor: each one carries its own four pressure questions and the
          homepage was sending everybody to a generic set belonging to neither.
          "Keep having to make" is the word that was missing from the whole
          page: the proof is built around a decision that comes back, not a
          one-off. No body line under it, because the line narrated the form. */}
      <CloseBlock
        instrument="recorder"
        claim="Start with one decision you keep having to make."
        onStart={openBrief}
        fork
      />

      <LeadBrief open={briefOpen} route={briefRoute} onClose={closeBrief} />
    </MindmakeShell>
  );
}
