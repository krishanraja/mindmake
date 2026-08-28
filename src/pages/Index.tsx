import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { CloseBlock } from "@/components/mindmake/CloseBlock";
import { FilmPlate } from "@/components/mindmake/FilmPlate";
import { Marquee } from "@/components/mindmake/Marquee";
import { ObjectionChips } from "@/components/mindmake/ObjectionChips";
import { BoardCardView } from "@/components/mindmake/board/BoardCard";
import { useBoardData } from "@/hooks/useBoardData";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import { useScrollDriver } from "@/hooks/useScrollDriver";
import { topCard, isStale } from "@/lib/board";
import { track } from "@/lib/analytics";
import filmOnePoster from "@/assets/films/film-01-poster.jpg";
import filmOnePosterWebp from "@/assets/films/film-01-poster.webp";
import "@/styles/mindmake.css";
import "@/styles/mindmake-instruments.css";

const HOMEPAGE_OBJECTIONS = [
  {
    id: "consultant",
    question: "Why not just hire a consultant?",
    answer: "Consultants leave you a deck and take the thinking with them. We leave you a working system that holds your judgement and keeps learning.",
  },
  {
    id: "chatgpt",
    question: "Can I not just use ChatGPT?",
    answer: "Those tools are brilliant and they forget you every morning. The brain is what makes them yours: it holds your standards and context, so every tool you use starts from you instead of from zero.",
  },
];

/** Today's strongest item, on the same component the board uses. */
function ProofLive() {
  const board = useBoardData({ days: 1 });
  const card = board.status === "ready" ? topCard(board.days) : null;

  return (
    <section className="mm-block" aria-labelledby="proof-title">
      <div className="mm-container">
        <div className="mm-board-head">
          <h2 id="proof-title">The read our clients wake up to.</h2>
          {board.status === "ready" && (
            <span className={`mm-timestamp${isStale(board.cacheDate) ? " is-stale" : ""}`}>
              <i className={`mm-live-dot${isStale(board.cacheDate) ? " is-stale" : ""}`} aria-hidden="true" />
              {isStale(board.cacheDate) ? "Yesterday's read, corroborated" : "Today 10:30 UTC, corroborated"}
            </span>
          )}
        </div>

        {card ? (
          <>
            <div className="mm-cards">
              <BoardCardView card={card} />
            </div>
            <p style={{ marginTop: 16 }}>
              <Link className="mm-text-link" to="/ai-gtm#board">
                See everything that moved <span aria-hidden="true">→</span>
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
        title="Every AI you buy knows the market. None of them know you."
        description="Mindmake builds systems that hold a leader's judgement: an AI brain, or an AI go-to-market model. Thirty days, and you keep everything."
        canonical="/"
      />

      <section className="mm-hero" aria-labelledby="hero-title">
        <div className="mm-container">
          <div className="mm-hero-stage">
            {/* Device 1: the film moves, the type sitting on it does not.
                Device 2: setup and payoff travel at slightly different rates. */}
            <div className="mm-hero-plate mm-parallax" ref={plateRef}>
              <FilmPlate
                poster={filmOnePoster}
                posterWebp={filmOnePosterWebp}
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
                None of them know you.
              </p>
            </div>
          </div>

          <div className="mm-doors">
            <Link className="mm-door" to="/ai-brain" onClick={() => track("door_click", { door: "brain" })}>
              <span className="mm-label">Door 01 · for the leader</span>
              <h2>Encode your judgement</h2>
              <p>Your taste, standards and context, running as a system. It amplifies what you are best at and absorbs what you hate.</p>
              <span className="mm-door-go">Build your AI brain <span aria-hidden="true">→</span></span>
            </Link>
            <Link className="mm-door" to="/ai-gtm" onClick={() => track("door_click", { door: "gtm" })}>
              <span className="mm-label">Door 02 · for the business</span>
              <h2>Rebuild how you sell</h2>
              <p>AI moved your market. Monetization, positioning, people. One lever, thirty days, priced on the outcome.</p>
              <span className="mm-door-go">Build your AI GTM <span aria-hidden="true">→</span></span>
            </Link>
          </div>
        </div>
      </section>

      <section className="mm-block" aria-labelledby="problem-title">
        <div className="mm-container">
          <p className="mm-label">The problem</p>
          <h2 id="problem-title">Two ways to stay stuck.</h2>
          <div className="mm-two" style={{ marginTop: 18 }}>
            <article className="mm-enemy">
              <span className="mm-label">The oracle</span>
              <h3>Advice you could have reached yourself.</h3>
              <p>Consultants hand down the answer, charge for the ceremony, and take the thinking with them when they leave.</p>
            </article>
            <article className="mm-enemy">
              <span className="mm-label">The mirror</span>
              <h3>Your own thinking, handed back.</h3>
              <p>Every AI you buy ingests what you tell it and returns it polished, unchanged, and forgotten by morning. Nothing compounds.</p>
            </article>
          </div>

          <div className="mm-answer">
            <p className="mm-claim">We build instruments.</p>
            <p>An instrument makes the situation legible, and the decision stays yours. We build systems that hold your judgement, show you the whole board in plain English, and belong to you when we leave.</p>
          </div>

          <Marquee lines={["Advice leaves. Systems stay.", "Built once. Compounds daily."]} />

          <ObjectionChips objections={HOMEPAGE_OBJECTIONS} />
        </div>
      </section>

      <ProofLive />

      <CloseBlock claim="Own the way you decide." onStart={openBrief} />

      <LeadBrief open={briefOpen} onClose={closeBrief} />
    </MindmakeShell>
  );
}
