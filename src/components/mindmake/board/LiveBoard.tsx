import { useMemo, useState } from "react";
import { BoardCardView } from "@/components/mindmake/board/BoardCard";
import { CountingValue } from "@/components/mindmake/CountingValue";
import { Instrument, type InstrumentKind } from "@/components/mindmake/Instrument";
import { useBoardData } from "@/hooks/useBoardData";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  INDUSTRIES,
  LANE_MAP,
  LANE_ORDER,
  LANE_SUBTITLES,
  industryCounts,
  isStale,
  laneCounts,
  laneSpark,
  matchesIndustry,
  timestampLabel,
  type Industry,
} from "@/lib/board";

/**
 * Enough to read at a glance. The rest is one tap away, and counted.
 *
 * Fewer on a phone, where the cards are a single column and six of them alone
 * ran to more than a screen and a half.
 */
const CARDS_SHOWN = 6;

/* One instrument per lane, chosen for what the lane is about rather than for
   variety: a recorder for what is being made, a gauge for what it costs, a
   split-flap for a position changing, a rail for who does the work. */
const LANE_INSTRUMENT: Record<string, InstrumentKind> = {
  product: "recorder",
  price: "gauge",
  positioning: "flap",
  people: "rail",
};
const CARDS_SHOWN_PHONE = 3;

/**
 * The daily read, published.
 *
 * Three rules from the brief hold this together. The timestamp is always the
 * cache's own, and past 26 hours it says so rather than hiding it. A failed
 * fetch collapses the section to its heading and one honest line, never an
 * empty board frame. And the industry filter is a deterministic keyword match
 * the visitor could check themselves, not personalisation.
 *
 * A fourth rule, learned the hard way: a control that appears to do nothing is
 * worse than no control. The chips used to filter the six visible cards while
 * the lane counts, the spark bars and the timestamp were all computed from the
 * unfiltered set, so the numbers never moved and the filter read as broken.
 * Everything on this board now derives from one filtered collection.
 */
/** The ground the board sits on, so a page can keep its sections alternating. */
export function LiveBoard({ seam, ground }: { ground?: "raise"; seam?: boolean } = {}) {
  /* A seam when this follows a section of its own ground. Splitting the try-it
     panel in two put the form directly above this on /ai-gtm, and two raise
     grounds meeting with nothing between them is one long band rather than two
     sections. `qa:rhythm` names the seam as the sanctioned separator. */
  const ground_class = `${ground === "raise" ? " mm-on-raise" : ""}${seam ? " mm-seam-above" : ""}`;
  const board = useBoardData({ days: 28 });
  const [industry, setIndustry] = useState<Industry>("All industries");
  const [expanded, setExpanded] = useState(false);
  const phone = useIsMobile();

  /* Memoised rather than inlined: a fresh [] on every render would defeat the
     filter memo below it and re-filter 28 days on each keystroke elsewhere. */
  const allDays = useMemo(
    () => (board.status === "ready" ? board.days : []),
    [board],
  );

  /* One filtered view of the whole window. Every figure below reads from it. */
  const days = useMemo(
    () => allDays.map((day) => ({
      ...day,
      cards: day.cards.filter((card) => matchesIndustry(card, industry)),
    })),
    [allDays, industry],
  );

  const today = days[0]?.cards ?? [];
  const counts = useMemo(() => industryCounts(allDays[0]?.cards ?? []), [allDays]);
  const lanes = useMemo(() => (days.length ? laneCounts(days) : null), [days]);
  const total = useMemo(() => days.reduce((sum, day) => sum + day.cards.length, 0), [days]);
  const limit = phone ? CARDS_SHOWN_PHONE : CARDS_SHOWN;
  const visible = expanded ? today : today.slice(0, limit);

  const pick = (option: Industry) => {
    setIndustry(option);
    setExpanded(false);
  };

  if (board.status === "collapsed") {
    return (
      <section className={`mm-block${ground_class}`} id="board" aria-labelledby="board-title">
        <div className="mm-container">
          <h2 id="board-title">What changed in AI today.</h2>
          <p className="mm-board-rebuilding">The read is rebuilding. Back within the hour.</p>
        </div>
      </section>
    );
  }

  if (board.status === "loading") {
    return (
      <section className={`mm-block${ground_class}`} id="board" aria-labelledby="board-title">
        <div className="mm-container">
          <h2 id="board-title">What changed in AI today.</h2>
          {/* A heading with nothing under it reads as broken rather than busy. */}
          <p className="mm-board-rebuilding" role="status">Reading today's sources.</p>
        </div>
      </section>
    );
  }

  const stale = isStale(board.cacheDate);

  return (
    <section className={`mm-block${ground_class}`} id="board" aria-labelledby="board-title">
      <div className="mm-container">
        <div className="mm-board-head">
          <h2 id="board-title">What changed in AI today.</h2>
          <span className={`mm-timestamp${stale ? " is-stale" : ""}`}>
            <i className={`mm-live-dot${stale ? " is-stale" : ""}`} aria-hidden="true" />
            {timestampLabel(board.cacheDate, days.length, total)}
          </span>
        </div>

        <div className="mm-chips" role="group" aria-label="Filter by industry">
          {INDUSTRIES.map((option) => (
            <button
              key={option}
              className="mm-chip"
              type="button"
              aria-pressed={industry === option}
              disabled={counts[option] === 0}
              onClick={() => pick(option)}
            >
              {option}
              {option !== "All industries" && <i aria-hidden="true">{counts[option]}</i>}
            </button>
          ))}
        </div>

        {lanes && (
          <div className="mm-lanes">
            {LANE_ORDER.map((lane) => {
              const spark = laneSpark(days, lane);
              const peak = Math.max(1, ...spark);
              return (
                <article className="mm-lane" key={lane}>
                  <Instrument kind={LANE_INSTRUMENT[lane]} />
                  <span className="mm-label">{lane}</span>
                  <p className="mm-lane-value">
                    {/* Keyed on the filter so the figure re-settles when it changes. */}
                    <CountingValue key={`${lane}-${industry}`} value={lanes[lane]} />
                    <small>items</small>
                  </p>
                  <div className="mm-spark" aria-hidden="true">
                    {spark.map((count, index) => (
                      <i key={index} style={{ height: `${Math.max(8, (count / peak) * 100)}%` }} />
                    ))}
                  </div>
                  <p className="mm-lane-sub">{LANE_SUBTITLES[lane]}</p>
                </article>
              );
            })}
          </div>
        )}

        <p className="mm-lane-map">
          {LANE_ORDER.map((lane) => (
            <span key={lane}>{lane} = {LANE_MAP[lane].join(", ")}</span>
          ))}
        </p>

        {today.length === 0 ? (
          <p className="mm-board-rebuilding">
            Nothing in {industry.toLowerCase()} today. The other lenses still have items.
          </p>
        ) : (
          <>
            <div className="mm-cards">
              {visible.map((card) => <BoardCardView card={card} key={card.id} />)}
            </div>
            {/* Say how much is being held back rather than silently dropping it. */}
            <p className="mm-cards-more">
              <span>Showing {visible.length} of {today.length} today.</span>
              {today.length > limit && (
                <button type="button" className="mm-text-button" onClick={() => setExpanded(!expanded)}>
                  {expanded ? "Show fewer" : `Show all ${today.length}`}
                </button>
              )}
            </p>
          </>
        )}
      </div>
    </section>
  );
}
