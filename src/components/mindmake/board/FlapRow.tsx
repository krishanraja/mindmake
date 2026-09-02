import { useEffect, useRef } from "react";
import { corroborationLabel, laneFor, type BoardCard } from "@/lib/board";
import { track } from "@/lib/analytics";

/**
 * One item, as a leaf on a departures board.
 *
 * Two things happen on one clock. A gauge sweeps to how well corroborated the
 * item is, and the headline turns over character by character until it lands.
 * They are the same animation, so a row finishes as one thing.
 *
 * The gauge is timed rather than driven by the row's position on screen, which
 * was tried and reverted the same hour. Position-driven, a row low on the
 * screen showed a low needle, so an item with two independent sources read as
 * weaker than one with a single source sitting higher up. A gauge carries a
 * value; it may not report where the reader has scrolled to.
 *
 * ## The mechanism, and what it may not cost
 *
 * Every character is a leaf in its own element with **the true character as its
 * text**. The riffle writes a decoy into `data-r` and CSS paints that over the
 * top; landing clears the attribute and the real character is simply revealed
 * again, because it never left. So wherever this row renders -- before
 * hydration, under `prefers-reduced-motion`, to anything reading the DOM -- the
 * headline is written out in full and nothing is animated. Nothing is ever
 * gated on the effect.
 *
 * (The board's data is fetched, so with scripting off the section shows its own
 * honest line rather than rows. That is the fetch, not this: the rule here is
 * that the animation may never be what puts the words on the screen.)
 *
 * That is also why the server's tree and the client's are identical: React
 * renders the same spans either way and the animation only ever sets an
 * attribute and a class on nodes it already made.
 *
 * ## Each row is its own animation, and it never finishes
 *
 * Not one wave fired at the section. A row starts when it crosses into view and
 * runs on its own clock, with its own settle rate and its own jitter, so rows
 * overlap and disagree the way a real board does. An `IntersectionObserver` per
 * row is what makes that true rather than approximately true.
 *
 * And it keeps going. A real departures board turns a row over whenever a
 * status changes, which is what makes it read as live rather than printed, so
 * an arrived row turns one word of itself over at long uneven intervals for as
 * long as it is on screen. The gauge does not move with it: how well
 * corroborated the item is has not changed, only the board's own liveness is
 * being shown.
 *
 * ## Why the headline is not set in the board's own type
 *
 * A real board is monospaced uppercase because each leaf is one fixed cell.
 * Ours does not have that constraint and a 70-character headline in mono caps
 * is markedly harder to read, which was the first thing the treatment was
 * pulled up on. So the slot, the hinge and the mono decoy exist **only while a
 * leaf is turning**. A settled character is ordinary type in the site's own
 * face, at reading size, with no box around it. The board is fully present
 * while it is doing something and costs the headline nothing once it has
 * landed.
 *
 * ## What a phone changes, which is more than the layout
 *
 * A desktop row is one line of headline beside a gauge. A phone row is three,
 * because 57 characters is the median and a 360px screen holds about twenty of
 * them. Three things follow from that and none of them is a media query:
 *
 * 1. **The clock is bounded, not per-character.** At a fixed rate a 91-character
 *    headline took 2.5 seconds to settle, which on a phone means most of the
 *    visible screen is unreadable for most of that time, because two or three
 *    rows are in view rather than eight. `perCell` is derived from a target
 *    total instead, so a row settles in about 0.8s on a phone and 1.25s on a
 *    laptop however long it is.
 * 2. **Rows cascade rather than fire together.** Three tall rows entering at
 *    once is the whole screen churning; the row's index delays its start, so
 *    they go over like a board rather than like a flashbulb.
 * 3. **Words break at spaces, not between letters.** Two adjacent inline-blocks
 *    are two atomic boxes and Chromium will break a line between any two of
 *    them, so the first phone build read `human researchers i / n safety` and
 *    `annualized revenu / e`, breaking mid-word on nearly every row. Each word
 *    is its own `nowrap` span, and only a word long enough to strand a line on
 *    its own -- `Gemini-3.5-Transcribe`, 21 characters, real, in the feed --
 *    gives that up so it can break between leaves rather than run off the side.
 *
 * ## What the row does not carry
 *
 * The cache's `pov` line, which is the classifier's advice to a leader. Measured
 * over the day's items, 25 of 29 are commands addressed to the reader ("Focus
 * on...", "Ensure...", "Prioritize...") and 9 carry American spellings. The
 * house style bans both outright, and a board that printed ten of them would be
 * ten violations on the page. The board's own reading of an item is the stance
 * word instead, which is one word and ours. The line comes back when it is
 * written in a voice this site can publish.
 */

/** What a leaf can show on the way round. A real board carries a fixed drum. */
const DRUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,:'?!$%-/";

/** Past this, a word may break between its leaves rather than strand a line. */
const LONG_WORD = 15;

/** How far the needle swings, by how well the item is corroborated. */
function sweepFor(card: BoardCard): number {
  if ((card.sourceCount ?? 0) >= 2) return 1;
  return corroborationLabel(card) === "1 source, primary" ? 0.62 : 0.34;
}

/** What the item asks of a leader, in one word, on the board's own terms. */
const STANCE_LABEL: Record<string, string> = {
  opportunity: "Opening",
  shift: "Shift",
  risk: "Risk",
};

/**
 * The headline as words of leaves.
 *
 * The word is the unit that holds the line together and the leaf is the unit
 * that turns, so they are two nestings rather than one. Spaces stay as bare
 * text between the words: a space inside a leaf would be a leaf that can turn
 * over into a letter and change the shape of the sentence.
 */
function leaves(headline: string) {
  const words = headline.split(" ");
  return words.map((word, index) => (
    <span key={index}>
      {index > 0 ? " " : null}
      <span className={`mm-flap-word${word.length >= LONG_WORD ? " is-long" : ""}`}>
        {Array.from(word).map((character, at) => (
          <span className="mm-flap" key={at}>{character}</span>
        ))}
      </span>
    </span>
  ));
}

export function FlapRow({ card, at }: { card: BoardCard; at: number }) {
  const row = useRef<HTMLElement>(null);
  const lane = laneFor(card.category);
  const stance = card.stance ? STANCE_LABEL[card.stance] : null;
  const strong = (card.sourceCount ?? 0) >= 2;

  useEffect(() => {
    const element = row.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const cells = Array.from(element.querySelectorAll<HTMLElement>(".mm-flap"));
    if (!cells.length) return;
    const words = Array.from(element.querySelectorAll<HTMLElement>(".mm-flap-word"))
      .map((word) => Array.from(word.querySelectorAll<HTMLElement>(".mm-flap")))
      .filter((leaves) => leaves.length > 1);

    let frame = 0;
    let timer = 0;
    let seen = false;
    let visible = false;

    /**
     * Turn a set of leaves over and land them left to right.
     *
     * `sweep` is what separates the two uses. Arriving, the row's gauge reads
     * the same clock and finishes as the last leaf does. Idling, only a word
     * turns and the gauge stays where it is, because how well corroborated the
     * item is has not changed -- and a needle that moved for any other reason
     * would be reporting a value it does not have.
     */
    const turn = (leaves: HTMLElement[], target: number, sweep: boolean) => {
      const perCell = Math.max(8, Math.min(30, target / leaves.length));
      const churn = 44 + Math.random() * 26;
      const total = leaves.length * perCell + 200;
      const landAt = leaves.map((_, index) => index * perCell + Math.random() * perCell * 1.5);
      const last = new Array(leaves.length).fill(0);

      for (const cell of leaves) cell.dataset.r = DRUM[(Math.random() * DRUM.length) | 0];
      const started = performance.now();

      const tick = (now: number) => {
        const elapsed = now - started;
        let live = false;
        for (let index = 0; index < leaves.length; index += 1) {
          const cell = leaves[index];
          if (cell.dataset.r === undefined) continue;
          if (elapsed >= landAt[index]) {
            /* It lands. Clearing the decoy uncovers the character that has been
               sitting underneath it the whole time. */
            delete cell.dataset.r;
            cell.classList.add("is-landing");
            window.setTimeout(() => cell.classList.remove("is-landing"), 160);
            continue;
          }
          live = true;
          if (elapsed - last[index] >= churn) {
            last[index] = elapsed;
            cell.dataset.r = DRUM[(Math.random() * DRUM.length) | 0];
          }
        }
        if (sweep) element.style.setProperty("--mm-at", Math.min(1, elapsed / total).toFixed(3));
        if (live || elapsed < total) frame = requestAnimationFrame(tick);
        else if (sweep) element.style.setProperty("--mm-at", "1");
      };
      frame = requestAnimationFrame(tick);
    };

    /**
     * A board that has finished is a photograph of a board.
     *
     * A real departures board keeps turning over: a status changes and one row
     * goes, then another, for as long as you stand in front of it. That is what
     * makes it read as live rather than printed, and this section is the only
     * genuinely live thing on the site. So once a row has arrived it keeps
     * turning one word of itself over at long, uneven intervals, and only while
     * it is on screen. It is also what the aliveness gate is measuring: at rest
     * the board was a still viewport, which is the correct reading of a board
     * whose only motion was its own arrival.
     */
    const idle = () => {
      timer = window.setTimeout(() => {
        if (visible && !document.hidden && words.length) {
          turn(words[(Math.random() * words.length) | 0], 460, false);
        }
        idle();
      }, 5200 + Math.random() * 7000);
    };

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        visible = entry.isIntersecting;
        if (!visible || seen) continue;
        seen = true;
        /* Rows go over in order rather than all at once, which on a phone is
           the difference between a board and a flashbulb. */
        timer = window.setTimeout(() => {
          /* Bounded, so a long headline settles in the same time as a short one
             and a phone never holds three lines of gibberish for two and a half
             seconds. Its own jitter on top, because rows disagreeing is the
             whole difference between a board turning over and a section fading
             in. */
          turn(cells, (window.innerWidth < 700 ? 760 : 1180) * (0.88 + Math.random() * 0.24), true);
          idle();
        }, Math.min(at, 6) * 85);
      }
    }, { threshold: 0.25, rootMargin: "0px 0px -8% 0px" });

    observer.observe(element);
    return () => {
      observer.disconnect();
      if (timer) window.clearTimeout(timer);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [card.id, at]);

  const body = (
    <>
      <svg className={`mm-gauge${strong ? " is-strong" : ""}`} viewBox="0 0 56 34" aria-hidden="true">
        <path className="mm-gauge-track" d="M8 28 A20 20 0 0 1 48 28" />
        <path className="mm-gauge-fill" d="M8 28 A20 20 0 0 1 48 28" />
        <line className="mm-gauge-needle" x1="28" y1="28" x2="28" y2="12" />
        <circle className="mm-gauge-hub" cx="28" cy="28" r="2.1" />
      </svg>

      {/* The whole headline, in the markup, always. */}
      <span className="mm-flap-line">{leaves(card.headline)}</span>

      <span className="mm-flap-meta">
        {stance && <b>{stance}</b>}
        <em>{corroborationLabel(card)}</em>
        {card.source && <span>{card.source}</span>}
        {card.timeAgo && <span>{card.timeAgo}</span>}
      </span>

      {lane && <span className="mm-flap-lane">{lane}</span>}
    </>
  );

  const common = {
    className: "mm-flap-row",
    "data-stance": card.stance ?? undefined,
    /* Strings, not numbers: a custom property is set verbatim and a stray unit
       would make every calc() in the gauge invalid at computed-value time. */
    style: { "--mm-sweep": String(sweepFor(card)), "--mm-at": "1" } as React.CSSProperties,
  };

  return card.url ? (
    <a
      {...common}
      ref={row as React.RefObject<HTMLAnchorElement>}
      href={card.url}
      target="_blank"
      rel="noreferrer"
      onClick={() => track("board_item_click", { category: card.category ?? "" })}
    >
      {body}
    </a>
  ) : (
    <div {...common} ref={row as React.RefObject<HTMLDivElement>}>{body}</div>
  );
}
