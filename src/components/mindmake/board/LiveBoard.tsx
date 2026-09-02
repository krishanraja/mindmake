import { useMemo, useState } from "react";
import { BoardFilters } from "@/components/mindmake/board/BoardFilters";
import { FlapRow } from "@/components/mindmake/board/FlapRow";
import { CountingValue } from "@/components/mindmake/CountingValue";
import { Instrument, type InstrumentKind } from "@/components/mindmake/Instrument";
import { useBoardData } from "@/hooks/useBoardData";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  LANE_MAP,
  LANE_ORDER,
  LANE_SUBTITLES,
  industryCounts,
  isShown,
  isStale,
  laneCounts,
  laneSpark,
  matchesIndustry,
  matchesRole,
  recentMatching,
  roleCounts,
  timestampLabel,
  type Industry,
  type Role,
} from "@/lib/board";

/**
 * Enough to read at a glance. The rest is one tap away, and counted.
 *
 * Fewer on a phone, where a row is three lines of headline rather than one.
 */
const ROWS_SHOWN = 8;
const ROWS_SHOWN_PHONE = 4;
/** What "show more" opens to. The window holds hundreds; a wall is not a board. */
const ROWS_EXPANDED = 30;

/* One instrument per lane, chosen for what the lane is about rather than for
   variety: a recorder for what is being made, a gauge for what it costs, a
   split-flap for a position changing, a rail for who does the work. */
const LANE_INSTRUMENT: Record<string, InstrumentKind> = {
  product: "recorder",
  price: "gauge",
  positioning: "flap",
  people: "rail",
};

/**
 * The daily read, published.
 *
 * Four rules from the brief hold this together. The timestamp is always the
 * cache's own, and past 26 hours it says so rather than hiding it. A failed
 * fetch collapses the section to its heading and one honest line, never an
 * empty board frame. The filters are deterministic matches a visitor could
 * check themselves, not personalisation. And -- learned the hard way -- a
 * control that appears to do nothing is worse than no control: the chips once
 * filtered the visible cards while the lane counts, the spark bars and the
 * timestamp were computed from the unfiltered set, so the numbers never moved.
 * Everything on this board derives from one filtered collection.
 *
 * A fifth, from the role filter: **the board reads the window, not the day.**
 * Today alone is fine while nothing is filtered, because today's items are the
 * newest anyway. It fails the moment a visitor picks a role -- measured against
 * the classified feed, People is 39 items in 476 and 0 of today's 13, so the
 * chip added to serve that reader would have been empty on most days. The rows
 * are the newest matching items wherever they fall in the retained window, and
 * every row carries its own age, so nothing is passed off as today's.
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
  const [role, setRole] = useState<Role | null>(null);
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
      cards: day.cards.filter((card) => (
        isShown(card)
        && matchesIndustry(card, industry)
        && (!role || matchesRole(card, role))
      )),
    })),
    [allDays, industry, role],
  );

  /* Each chip's count is what it would return if pressed, with the other lens
     left where it is. That is what makes "disabled at zero" a true promise
     rather than an approximate one. */
  const counts = useMemo(() => {
    const shown = allDays.flatMap((day) => day.cards).filter(isShown);
    return {
      role: roleCounts(shown.filter((card) => matchesIndustry(card, industry))),
      industry: industryCounts(shown.filter((card) => !role || matchesRole(card, role))),
    };
  }, [allDays, industry, role]);

  const lanes = useMemo(() => (days.length ? laneCounts(days) : null), [days]);
  const total = useMemo(() => days.reduce((sum, day) => sum + day.cards.length, 0), [days]);
  const limit = expanded ? ROWS_EXPANDED : (phone ? ROWS_SHOWN_PHONE : ROWS_SHOWN);
  const rows = useMemo(() => recentMatching(days, { limit }), [days, limit]);

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
    <>
    <section className={`mm-block${ground_class}`} id="board" aria-labelledby="board-title">
      <div className="mm-container">
        <div className="mm-board-head">
          <h2 id="board-title">What changed in AI today.</h2>
          <span className={`mm-timestamp${stale ? " is-stale" : ""}`}>
            <i className={`mm-live-dot${stale ? " is-stale" : ""}`} aria-hidden="true" />
            {timestampLabel(board.cacheDate, days.length, total)}
          </span>
        </div>

        <BoardFilters
          role={role}
          onRole={(next) => { setRole(next); setExpanded(false); }}
          roleCounts={counts.role}
          industry={industry}
          onIndustry={(next) => { setIndustry(next); setExpanded(false); }}
          industryCounts={counts.industry}
        />

        {rows.length === 0 ? (
          <p className="mm-board-rebuilding">
            Nothing matches that pair in the last {days.length} days. The other lenses still have items.
          </p>
        ) : (
          <>
            <div className="mm-flap-panel">
              {rows.map((card, index) => (
                <FlapRow card={card} at={index} key={card.id} />
              ))}
            </div>
            {/* Say how much is being held back rather than silently dropping it. */}
            <p className="mm-flap-foot">
              <span>Showing {rows.length} of {total} across {days.length} days.</span>
              {total > rows.length && (
                <button type="button" className="mm-text-button" onClick={() => setExpanded(true)}>
                  Show {Math.min(ROWS_EXPANDED, total)}
                </button>
              )}
              {expanded && (
                <button type="button" className="mm-text-button" onClick={() => setExpanded(false)}>
                  Show fewer
                </button>
              )}
            </p>
          </>
        )}

      </div>
    </section>

    {/* Where it is landing is a different question from what changed, and the
        two under one heading ran to 2.87 screens on a 360px phone. Two sections
        with a seam, which is what `qa:rhythm` sanctions between two blocks
        standing on one ground. */}
    <section className={`mm-block mm-seam-above${ground === "raise" ? " mm-on-raise" : ""}`} aria-label="Where this week's items are landing">
      <div className="mm-container">
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
                    {/* Keyed on the filters so the figure re-settles when they change. */}
                    <CountingValue key={`${lane}-${industry}-${role ?? "all"}`} value={lanes[lane]} />
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
      </div>
    </section>
    </>
  );
}
