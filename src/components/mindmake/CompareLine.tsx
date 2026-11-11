import { useEffect, useId, useRef, useState } from "react";
import { COMPARE, GRADE_WORD, type Grade } from "@/data/compareBoard";
import { track } from "@/lib/analytics";
import "@/styles/mindmake-compare.css";

/**
 * "Instead of…": the comparison at the moment a visitor decides, beside the
 * page's way in (Krish, 2026-11-11).
 *
 * One control. The visitor picks the route they would otherwise take and the
 * box underneath says what that route leaves them with, beside what Mindmake
 * leaves them with. It adds no section and no scroll: it replaces the close's
 * supporting line.
 *
 * ## Nothing moves
 *
 * Every pair is laid in the same grid cell and only the chosen one is visible,
 * so the box is always the height of the longest pair and changing the choice
 * never moves the button below it (qa:line-breaks: a swapping component may not
 * change size).
 *
 * "See all side by side" opens a native modal dialog: full screen on a phone,
 * a drawer on a desktop. It opens at its own top, the page underneath is frozen
 * exactly where the reader was, and closing it (×, Escape, the backdrop) puts
 * them back on the same pixel with focus on the button they tapped. Krish:
 * "Everything should be where I expect it to be at all times."
 *
 * Grades are words in the verdict and labelled dots on the board, never colour
 * alone. Partly is a half dot in mint-dim, never amber: amber means what moved.
 */
const dotClass = (g: string) => (g === "Y" ? "y" : g === "P" ? "p" : "n");

function Dots({ grades, criteria }: { grades: string; criteria: readonly string[] }) {
  return (
    <>
      {grades.split("").map((g, j) => (
        <span key={j} className={`mm-compare-dot is-${dotClass(g)}`} role="img" aria-label={`${criteria[j]}: ${GRADE_WORD[g as Grade]}`} />
      ))}
    </>
  );
}

export function CompareLine({ page }: { page: "brain" | "gtm" }) {
  const data = COMPARE[page];
  const [pick, setPick] = useState(data.initial);
  const [open, setOpen] = useState(false);
  const id = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const savedY = useRef(0);
  const chosen = data.alts[pick];
  const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

  const openBoard = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    // Stop the page scrolling without moving it. Fixing the body would shift
    // every section, and the page's scroll-driven sections react to that.
    savedY.current = window.scrollY;
    document.documentElement.classList.add("mm-compare-locked");
    dialog.showModal();
    dialog.scrollTop = 0;
    dialog.querySelector<HTMLElement>(".mm-compare-sheet-title")?.focus({ preventScroll: true });
    setOpen(true);
    track("compare_board_open", { route: page, alt: chosen[0] });
  };

  // Runs for every way of closing (×, Escape, backdrop): restore the exact pixel.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      document.documentElement.classList.remove("mm-compare-locked");
      if (Math.abs(window.scrollY - savedY.current) > 0.5) window.scrollTo({ top: savedY.current, left: 0, behavior: "instant" as ScrollBehavior });
      triggerRef.current?.focus({ preventScroll: true });
      setOpen(false);
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  const closeBoard = () => dialogRef.current?.close();

  return (
    <div className="mm-compare" data-compare={page}>
      <div className="mm-compare-q">
        <label htmlFor={`${id}-sel`}>Instead of</label>
        <span className="mm-compare-select">
          <select
            id={`${id}-sel`}
            value={pick}
            aria-describedby={`${id}-ask`}
            onChange={(event) => {
              const next = Number(event.target.value);
              setPick(next);
              track("compare_pick", { route: page, alt: data.alts[next][0] });
            }}
          >
            {data.alts.map((alt, k) => <option key={alt[0]} value={k}>{lower(alt[0])}</option>)}
          </select>
        </span>
        <span id={`${id}-ask`} className="mm-visually-hidden">{data.ask}</span>
      </div>

      <div className="mm-compare-pair">
        <div>
          <span className="mm-compare-label">They leave you</span>
          {/* The chosen route's line is the one live region, so a screen reader
              hears each new choice. The others sit in the same cell, unseen and
              unread, so the cell is always the longest line's height. */}
          <div className="mm-compare-stack">
            <p aria-live="polite" aria-atomic="true">{chosen[2]} {chosen[3]}</p>
            {data.alts.map((alt, k) => k === pick ? null : <span key={alt[0]} aria-hidden="true">{alt[2]} {alt[3]}</span>)}
          </div>
        </div>
        <div className="is-ours">
          <span className="mm-compare-label">With Mindmake you keep</span>
          <p>{data.ours}</p>
        </div>
      </div>

      <div className="mm-compare-strip">
        <span className="mm-compare-dots"><span className="mm-compare-label">Them</span><Dots grades={chosen[1]} criteria={data.criteria} /></span>
        <span className="mm-compare-dots is-ours"><span className="mm-compare-label">Mindmake</span><Dots grades="YYYYY" criteria={data.criteria} /></span>
        <button ref={triggerRef} type="button" className="mm-compare-all" aria-haspopup="dialog" aria-expanded={open} onClick={openBoard}>
          See all {data.alts.length} side by side <span aria-hidden="true">↗</span>
        </button>
      </div>

      <dialog
        ref={dialogRef}
        className="mm-compare-sheet"
        aria-labelledby={`${id}-title`}
        onClick={(event) => { if (event.target === event.currentTarget) closeBoard(); }}
      >
        <div className="mm-compare-sheet-inner">
          <div className="mm-compare-sheet-head">
            <h2 id={`${id}-title`} className="mm-compare-sheet-title" tabIndex={-1}>All {data.alts.length} side by side</h2>
            <button type="button" className="mm-compare-x" aria-label="Close and go back" onClick={closeBoard}>×</button>
          </div>
          <div className="mm-compare-board">
            <div className="mm-compare-row is-head">
              <span className="mm-compare-label">Route</span>
              {data.criteria.map((_, j) => <span key={j} className="mm-compare-num" aria-hidden="true">{j + 1}</span>)}
            </div>
            {data.alts.map((alt, k) => (
              <div key={alt[0]} className={`mm-compare-row${k === pick ? " is-pick" : ""}`} aria-current={k === pick ? "true" : undefined}>
                <span>{k === pick && <small>Your choice</small>}{alt[0]}</span>
                <Dots grades={alt[1]} criteria={data.criteria} />
              </div>
            ))}
            <div className="mm-compare-row is-us">
              <span>Mindmake</span>
              <Dots grades="YYYYY" criteria={data.criteria} />
            </div>
            <div className="mm-compare-key">
              {data.criteria.map((c, j) => <span key={c}>{j + 1} · {c}</span>)}
              <span>● Yes · ◐ Partly · ○ No</span>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}
