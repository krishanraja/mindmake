import { useMemo, useState } from "react";
import { BoardCardView } from "@/components/mindmake/board/BoardCard";
import { CountingValue } from "@/components/mindmake/CountingValue";
import { useBoardData } from "@/hooks/useBoardData";
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

const CARDS_SHOWN = 6;

/**
 * The daily read, published.
 *
 * Three rules from the brief hold this together. The timestamp is always the
 * cache's own, and past 26 hours it says so rather than hiding it. A failed
 * fetch collapses the section to its heading and one honest line, never an
 * empty board frame. And the industry filter is a deterministic keyword match
 * the visitor could check themselves, not personalisation.
 */
export function LiveBoard() {
  const board = useBoardData({ days: 28 });
  const [industry, setIndustry] = useState<Industry>("All industries");

  const today = useMemo(
    () => (board.status === "ready" ? board.days[0].cards : []),
    [board],
  );
  const counts = useMemo(() => industryCounts(today), [today]);
  const lanes = useMemo(
    () => (board.status === "ready" ? laneCounts(board.days) : null),
    [board],
  );
  const visible = today.filter((card) => matchesIndustry(card, industry)).slice(0, CARDS_SHOWN);

  if (board.status === "collapsed") {
    return (
      <section className="mm-block" id="board" aria-labelledby="board-title">
        <div className="mm-container">
          <h2 id="board-title">What moved, by lever.</h2>
          <p className="mm-board-rebuilding">The read is rebuilding. Back within the hour.</p>
        </div>
      </section>
    );
  }

  if (board.status === "loading") {
    return (
      <section className="mm-block" id="board" aria-labelledby="board-title">
        <div className="mm-container">
          <h2 id="board-title">What moved, by lever.</h2>
        </div>
      </section>
    );
  }

  const stale = isStale(board.cacheDate);

  return (
    <section className="mm-block" id="board" aria-labelledby="board-title">
      <div className="mm-container">
        <div className="mm-board-head">
          <h2 id="board-title">What moved, by lever.</h2>
          <span className={`mm-timestamp${stale ? " is-stale" : ""}`}>
            <i className={`mm-live-dot${stale ? " is-stale" : ""}`} aria-hidden="true" />
            {timestampLabel(board.cacheDate, board.days.length, board.total)}
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
              onClick={() => setIndustry(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {lanes && (
          <div className="mm-lanes">
            {LANE_ORDER.map((lane) => {
              const spark = laneSpark(board.days, lane);
              const peak = Math.max(1, ...spark);
              return (
                <article className="mm-lane" key={lane}>
                  <span className="mm-label">{lane}</span>
                  <p className="mm-lane-value">
                    <CountingValue value={lanes[lane]} />
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
            <span key={lane} style={{ display: "block" }}>
              {lane} = {LANE_MAP[lane].join(", ")}
            </span>
          ))}
        </p>

        <div className="mm-cards">
          {visible.map((card) => <BoardCardView card={card} key={card.id} />)}
        </div>
      </div>
    </section>
  );
}
