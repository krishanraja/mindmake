import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { CloseBlock } from "@/components/mindmake/CloseBlock";
import { FilmPlate } from "@/components/mindmake/FilmPlate";
import { FounderNote } from "@/components/mindmake/FounderNote";
import { Instrument } from "@/components/mindmake/Instrument";
import { Marquee } from "@/components/mindmake/Marquee";
import { ObjectionChips } from "@/components/mindmake/ObjectionChips";
import { ProofStrip } from "@/components/mindmake/ProofStrip";
import { SubscribeBand } from "@/components/mindmake/SubscribeBand";
import { BoardCardView } from "@/components/mindmake/board/BoardCard";
import { useBoardData } from "@/hooks/useBoardData";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import { useScrollDriver } from "@/hooks/useScrollDriver";
import { topCard, isStale } from "@/lib/board";
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

const HOMEPAGE_OBJECTIONS = [
  {
    id: "consultant",
    question: "How is this different from hiring a consultant?",
    answer: "A consultant does good work and then the project closes. We build the system inside your accounts, so what it learns about your work is still there next year.",
  },
  {
    id: "chatgpt",
    question: "Can I not just use ChatGPT?",
    answer: "You can, and you should. Those tools are excellent. They just start from nothing every morning. The brain is the part that remembers your standards, so the tools you already pay for start from you.",
  },
];

/** Today's strongest item, on the same component the board uses. */
function ProofLive() {
  const board = useBoardData({ days: 1 });
  const card = board.status === "ready" ? topCard(board.days) : null;

  return (
    <section className="mm-block mm-on-raise" aria-labelledby="proof-title">
      <div className="mm-container">
        <div className="mm-board-head">
          <h2 id="proof-title"><Instrument kind="recorder" className="mm-head-mark" />What changed in AI this morning.</h2>
          {board.status === "ready" && (
            <span className={`mm-timestamp${isStale(board.cacheDate) ? " is-stale" : ""}`}>
              <i className={`mm-live-dot${isStale(board.cacheDate) ? " is-stale" : ""}`} aria-hidden="true" />
              {isStale(board.cacheDate) ? "Yesterday's read, checked against other sources" : "Today 10:30 UTC, checked against other sources"}
            </span>
          )}
        </div>
        <p className="mm-lede" style={{ marginTop: 10 }}>
          We read the market every morning and keep the parts that matter to the people we work
          with. Here is today's.
        </p>

        {card ? (
          <>
            <div className="mm-cards" style={{ marginTop: 14 }}>
              <BoardCardView card={card} />
            </div>
            <p style={{ marginTop: 16 }}>
              <Link className="mm-text-link" to="/ai-gtm#board">
                See everything that changed <span aria-hidden="true">→</span>
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
  const { briefOpen, openBrief, closeBrief } = useLeadBriefHistory();
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

      <section className="mm-block mm-on-raise" aria-labelledby="where-title">
        <div className="mm-container">
          <h2 id="where-title"><Instrument kind="drawer" className="mm-head-mark" />Where does everything you teach AI end up?</h2>
          <p className="mm-lede" style={{ marginTop: 12 }}>
            You explain your business to AI every week. How you price. What good looks like. Which
            customers matter. That knowledge is worth something, and it has to live somewhere.
          </p>

          <div className="mm-three" style={{ marginTop: 20 }}>
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
          </div>

          <div className="mm-answer">
            <p className="mm-claim">You keep what it learns.</p>
            <p>That is the whole idea. We help you put your own judgement to work, in plain English, on real decisions, and you own the result.</p>
          </div>

          <Marquee lines={["Built once. Better every week.", "What it learns stays yours."]} />

          <ObjectionChips objections={HOMEPAGE_OBJECTIONS} />
        </div>
      </section>

      <ProofStrip />

      <ProofLive />

      {/* Proof, then who you would be working with, then the ask. */}
      <FounderNote treatment="standing" />

      <SubscribeBand />

      <CloseBlock
        instrument="recorder"
        claim="Start with one real decision."
        body="Give us your company address. We will read your market, and send you a plan built for your business."
        onStart={openBrief}
      />

      <LeadBrief open={briefOpen} onClose={closeBrief} />
    </MindmakeShell>
  );
}
