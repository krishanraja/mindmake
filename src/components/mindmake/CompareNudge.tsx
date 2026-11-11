import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { COMPARE, GRADE_WORD, type Grade } from "@/data/compareBoard";
import { track } from "@/lib/analytics";
import { mountLiquidOrb, type LiquidOrb } from "@/components/mindmake/locked/liquidOrb";
import "@/styles/mindmake-compare.css";

/**
 * "Prefer to …?" at "Where would you start?", and the comparison it opens
 * (Krish, 2026-11-11: the inline version "adds too much page complexity").
 *
 * The nudge is one button under the finder's question: a mint bubble that
 * breathes in its own spot and a caption whose ending turns through the routes
 * a visitor is probably weighing, so they see we know what they are thinking.
 * Tapping it opens the comparison already set to the route on screen.
 *
 * ## Nothing moves
 *
 * - Every phrase sits in one grid cell, so the caption is always the longest
 *   phrase's width and the turning never moves anything (qa:line-breaks).
 * - The bubble moves by transform and border-radius only, at most a few pixels,
 *   stops after the first open, and holds still with reduced motion.
 * - The overlay is a native modal dialog that fits one screen down to 360x640.
 *   Both views ("this one" and "all side by side") share one cell, so switching
 *   never resizes it. The page underneath stops scrolling without moving, and
 *   closing (×, Escape, the backdrop) leaves the reader on the same pixel with
 *   focus back on the nudge.
 *
 * Grades are words in the rows and labelled dots on the board, never colour
 * alone. Partly is mint-dim, never amber: amber means what moved.
 */
const ROTATE_MS = 2800;
const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
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

/** React 18 has no `inert` prop; the attribute still passes through as a string. */
const inertUnless = (shown: boolean) => (shown ? {} : { inert: "" });

/** The order the caption turns through: the most likely route first. */
function turnOrder(initial: number, count: number) {
  return Array.from({ length: count }, (_, k) => (initial + k) % count);
}

export function CompareNudge({ page, host }: { page: "brain" | "gtm"; host: RefObject<HTMLElement | null> }) {
  const data = COMPARE[page];
  const order = turnOrder(data.initial, data.alts.length);
  const id = useId();
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const [turn, setTurn] = useState(0);
  const [pick, setPick] = useState(data.initial);
  const [view, setView] = useState<"one" | "all">("one");
  const [seen, setSeen] = useState(false);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const savedY = useRef(0);
  const paused = useRef(false);
  const [orbHost, setOrbHost] = useState<HTMLSpanElement | null>(null);
  const orb = useRef<LiquidOrb | null>(null);
  const chosen = data.alts[pick];

  // A small piece of the living Brain, floating where the nudge sits.
  useEffect(() => {
    if (!orbHost) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    orb.current = mountLiquidOrb(orbHost, { reduced, size: () => orbHost.getBoundingClientRect().width || 76 });
    return () => { orb.current?.destroy(); orb.current = null; };
  }, [orbHost]);
  useEffect(() => { if (turn) orb.current?.pulse(); }, [turn]);
  useEffect(() => { orb.current?.setPaused(open); }, [open]);
  useEffect(() => { if (seen) orb.current?.calm(); }, [seen]);

  // The finder is server-rendered markup; the nudge mounts into its empty slot.
  useEffect(() => {
    setSlot(host.current?.querySelector<HTMLElement>("[data-compare-slot]") ?? null);
  }, [host]);

  // Turn the caption while it is on screen, not hovered or focused, and the overlay is shut.
  useEffect(() => {
    if (!slot || open) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false;
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    io.observe(slot);
    const timer = window.setInterval(() => {
      if (visible && !paused.current && document.visibilityState === "visible") setTurn((t) => (t + 1) % order.length);
    }, ROTATE_MS);
    return () => { window.clearInterval(timer); io.disconnect(); };
  }, [slot, open, order.length]);

  const openOverlay = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    const alt = order[turn];
    setPick(alt);
    setView("one");
    // Stop the page scrolling without moving it; fixing the body would shift
    // every section, and the page's scroll-driven sections react to that.
    savedY.current = window.scrollY;
    document.documentElement.classList.add("mm-compare-locked");
    dialog.showModal();
    dialog.scrollTop = 0;
    dialog.querySelector<HTMLElement>(".mm-compare-title")?.focus({ preventScroll: true });
    setOpen(true);
    setSeen(true);
    track("compare_nudge_open", { route: page, alt: data.alts[alt][0] });
  };

  // Every way of closing (×, Escape, backdrop) restores the exact pixel and focus.
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

  const closeOverlay = () => dialogRef.current?.close();

  const nudge = (
    <button
      ref={triggerRef}
      type="button"
      className={`mm-nudge${seen ? " is-seen" : ""}`}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-label="Prefer another route? Compare it with Mindmake"
      onClick={openOverlay}
      onPointerEnter={() => { paused.current = true; }}
      onPointerMove={(event) => {
        const box = orbHost?.getBoundingClientRect();
        if (box) orb.current?.setHover([event.clientX - box.left, event.clientY - box.top]);
      }}
      onPointerLeave={() => { paused.current = false; orb.current?.setHover(null); }}
      onFocus={() => { paused.current = true; }}
      onBlur={() => { paused.current = false; }}
    >
      <span className="mm-orb" aria-hidden="true">
        <span ref={setOrbHost} className="mm-orb-body" />
        <span className="mm-orb-shadow" />
      </span>
      <span className="mm-nudge-text" aria-hidden="true">
        <span className="mm-nudge-lead">Prefer to</span>{" "}
        <span className="mm-nudge-slot">
          {order.map((alt, k) => (
            <span key={alt} data-on={k === turn || undefined}>{data.alts[alt][4]}?</span>
          ))}
        </span>
      </span>
    </button>
  );

  return (
    <>
      {slot && createPortal(nudge, slot)}
      <dialog
        ref={dialogRef}
        className="mm-compare-sheet"
        data-compare={page}
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-ask`}
        onClick={(event) => { if (event.target === event.currentTarget) closeOverlay(); }}
      >
        <div className="mm-compare-inner">
          <div className="mm-compare-head">
            <h2 id={`${id}-title`} className="mm-compare-title" tabIndex={-1}>
              <label htmlFor={`${id}-sel`}>Instead of</label>
            </h2>
            <span className="mm-compare-select">
              <select
                id={`${id}-sel`}
                value={pick}
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
            <button type="button" className="mm-compare-x" aria-label="Close and go back" onClick={closeOverlay}>×</button>
          </div>

          <div className="mm-compare-views">
            <div className="mm-compare-one" aria-hidden={view === "one" ? undefined : true} {...inertUnless(view === "one")}>
              <div className="mm-compare-rows" role="table" aria-label={`${chosen[0]} compared with Mindmake`}>
                <div className="mm-compare-row is-head" role="row">
                  <span role="columnheader" className="mm-compare-label">Compared</span>
                  <span role="columnheader" className="mm-compare-label is-c">Them</span>
                  <span role="columnheader" className="mm-compare-label is-c is-ours">Mindmake</span>
                </div>
                {data.criteria.map((criterion, j) => {
                  const g = chosen[1][j] as Grade;
                  return (
                    <div key={criterion} className="mm-compare-row" role="row">
                      <span role="rowheader">{criterion}</span>
                      <span role="cell" className={`mm-compare-mark is-${dotClass(g)}`}>{GRADE_WORD[g]}</span>
                      <span role="cell" className="mm-compare-mark is-y">Yes</span>
                    </div>
                  );
                })}
              </div>
              <div className="mm-compare-pair">
                <div>
                  <span className="mm-compare-label">They leave you</span>
                  {/* The chosen line is the live region; the others share its
                      cell unseen and unread, so the box is the longest line's height. */}
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
              <button type="button" className="mm-compare-switch" onClick={() => { setView("all"); track("compare_board_open", { route: page, alt: chosen[0] }); }}>
                See all {data.alts.length} side by side <span aria-hidden="true">→</span>
              </button>
            </div>

            <div className="mm-compare-all-view" aria-hidden={view === "all" ? undefined : true} {...inertUnless(view === "all")}>
              <div className="mm-compare-board">
                <div className="mm-compare-brow is-head">
                  <span className="mm-compare-label">Route</span>
                  {data.criteria.map((_, j) => <span key={j} className="mm-compare-num" aria-hidden="true">{j + 1}</span>)}
                </div>
                {data.alts.map((alt, k) => (
                  <div key={alt[0]} className={`mm-compare-brow${k === pick ? " is-pick" : ""}`} aria-current={k === pick ? "true" : undefined}>
                    <span>{alt[0]}</span>
                    <Dots grades={alt[1]} criteria={data.criteria} />
                  </div>
                ))}
                <div className="mm-compare-brow is-us">
                  <span>Mindmake</span>
                  <Dots grades="YYYYY" criteria={data.criteria} />
                </div>
                <div className="mm-compare-key">
                  {data.criteria.map((c, j) => <span key={c}>{j + 1} · {c}</span>)}
                  <span>● Yes · ◐ Partly · ○ No</span>
                </div>
              </div>
              <button type="button" className="mm-compare-switch" onClick={() => setView("one")}>
                <span aria-hidden="true">←</span> Back to the comparison
              </button>
            </div>
          </div>

        </div>
      </dialog>
    </>
  );
}
