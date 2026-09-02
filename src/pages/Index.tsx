import { useMemo, useState } from "react";
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
import { ProofStrip, ProofVoices } from "@/components/mindmake/ProofStrip";
import { SubscribeBand } from "@/components/mindmake/SubscribeBand";
import { BoardFilters } from "@/components/mindmake/board/BoardFilters";
import { FlapRow } from "@/components/mindmake/board/FlapRow";
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
 * stocked, and 13.7KB on the wire. The heading says "this week" because that is
 * what the rows are, and each one carries its own age besides.
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
          <h2 id="proof-title"><Instrument kind="recorder" className="mm-head-mark" />What changed in AI this week.</h2>
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
            <p className="mm-flap-foot">
              <span>Showing {rows.length} of {total} in the last {days.length} days.</span>
              <Link className="mm-text-link" to="/ai-gtm#board">
                See everything that changed <span aria-hidden="true">&rarr;</span>
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
            <div className="mm-hero-copy">
              <h1 className="mm-setup mm-parallax mm-parallax-slow" id="hero-title" ref={setupRef}>
                Every AI you buy knows the market.
              </h1>
              <p className="mm-claim mm-parallax mm-parallax-fast" ref={claimRef}>
                Yours should also know you.
              </p>
            </div>
          </div>

          {/* The two doors are the only choice on this page, so they are the
              largest thing on it after the hero. Each carries the film from the
              page behind it, which makes the picture a preview rather than
              decoration, and hovering one dims the other so the choice reads as
              physical rather than as two paragraphs that happen to be links. */}
          <div className="mm-doors">
            <Link className="mm-door" to="/ai-brain" onClick={() => track("door_click", { door: "brain" })}>
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
                <p>Your standards, your context and the decisions you have already made, working as one system. It helps with the work only you can do, and takes on the work you would rather not.</p>
                <span className="mm-door-go">Build your AI brain <span aria-hidden="true">→</span></span>
              </span>
            </Link>
            <Link className="mm-door" to="/ai-gtm" onClick={() => track("door_click", { door: "gtm" })}>
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

      {/* Paper, and the page's first change of ground.
          The homepage ran ink and raise alternately for its whole length, and
          those two are 1.32:1 apart: measured on a phone, every screen below
          the hero read as the same colour. This section is the argument and the
          most text-heavy screen on the page, which is the one that most wants
          light. */}
      <section className="mm-block mm-on-paper" aria-labelledby="where-title">
        <div className="mm-container">
          <h2 id="where-title"><Instrument kind="drawer" className="mm-head-mark" />Where does everything you teach AI end up?</h2>
          <p className="mm-lede" style={{ marginTop: 12 }}>
            You explain your business to AI every week. How you price. What good looks like. Which
            customers matter.
          </p>

          {/* The three answers build as the reader passes them, rather than
              arriving once and being finished. `Arrive` fires on a threshold and
              a section that has already arrived is a photograph; `Build` is
              driven by scroll position, so it assembles under the reader and
              comes apart again if they scroll back. Measured before either, the
              two viewports covering this section read a whole-viewport mean of
              0.023 and 0.026: nothing moved while it was read, and nothing
              changed as it was scrolled past. */}
          <Build className="mm-three" style={{ marginTop: 20 }}>
            <article className="mm-enemy">
              <h3>It stays in a plan</h3>
              <p>Consultants and agencies do good work and leave you a plan you can act on. When the project closes, the understanding behind it goes with them.</p>
            </article>
            <article className="mm-enemy">
              <h3>It stays in their product</h3>
              <p>Every tool you subscribe to is useful, and every one keeps what it learns on their side. Cancel the subscription and you start again.</p>
            </article>
            <article className="mm-enemy is-answer">
              <h3>It stays with you</h3>
              <p>We build it inside your own accounts. It learns how you decide, it gets better every week, and it stays yours when we finish.</p>
            </article>
          </Build>

          {/* The claim, and nothing under it. It carried a paragraph opening
              "That is the whole idea", which is a sentence announcing that the
              sentence above it was the point, followed by a restatement of the
              three cards above that. */}
          <div className="mm-answer">
            <ScrubText className="mm-claim" text="You keep what it learns." />
            {/* The one link to the argument page. This section asks where the
                learning ends up; that page answers what the hours are for. It
                was an orphan for months, prerendered and in the sitemap and
                reachable from nowhere on the site. */}
            <p className="mm-answer-more">
              <Link className="mm-text-link" to="/new-age-leadership">
                What the hours are for <span aria-hidden="true">&rarr;</span>
              </Link>
            </p>
          </div>

        </div>
      </section>

      {/* The marquee is a band, not the tail of an argument. Inside the section
          above it was the fifth thing there and the last 59px of 1,104. */}
      <Marquee lines={["Built once. Better every week.", "What it learns stays yours."]} />

      {/* Its own section, because it was 761px of a 1,865px one.
          The argument above is a lede, three answers, a claim and a marquee,
          and the questions were a fifth thing inside it: at 360px that section
          ran 2.35 screens and this was 41% of it. They are a different act, they
          have their own heading, and the reader arriving at them has finished
          the argument rather than being partway through it. */}
      <section className="mm-block mm-on-raise" aria-labelledby="home-questions-title">
        <div className="mm-container">
          <ObjectionChips
            titleId="home-questions-title"
            ask={["consultant", "chatgpt", "tried-it", "why-not-myself", "how-we-work", "included", "charging", "start", "email"]}
          />
        </div>
      </section>

      <ProofStrip />

      <ProofVoices />

      <ProofLive />

      {/* Proof, then who you would be working with, then the ask. */}
      <FounderNote treatment="standing" />

      {/* Paper again, and the page's second light movement. The publication is
          a separate opt-in rather than a step in the offer, and the ground is
          what says so before a word is read. Measured before this, the viewport
          holding it read a whole-screen change of 0.060 against a floor of
          0.15. */}
      <SubscribeBand ground="paper" />

      {/* The two doors by name, because the choice was already being made for
          the visitor: each one carries its own four pressure questions and the
          homepage was sending everybody to a generic set belonging to neither. */}
      <CloseBlock
        instrument="recorder"
        claim="Start with one real decision."
        body="Four details, and we read your market before asking you to explain anything."
        onStart={openBrief}
        fork
      />

      <LeadBrief open={briefOpen} route={briefRoute} onClose={closeBrief} />
    </MindmakeShell>
  );
}
