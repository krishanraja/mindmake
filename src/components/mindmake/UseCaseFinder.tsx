import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent } from "react";
import { leadershipStories, type LeadershipStory } from "@/components/leadership-chapters/leadershipChapters";
import { tieLast } from "@/components/leadership-chapters/storyFinder";
import { CompareNudge } from "@/components/mindmake/CompareNudge";
import { DOOR_LABEL, SITUATIONS, useCases, type Door, type Role, type SituationId, type UseCase, type UseCaseId } from "@/data/useCases";
import { caseAnchor as anchorOf, caseFromHash } from "@/lib/useCaseHash";
import { quoteById, quotePartFor } from "@/data/testimonials";
import { START_LABEL, START_LABEL_GTM } from "@/lib/publicLinks";
import { placeholderFor, srcsetFor } from "@/lib/responsiveImages";
import { track } from "@/lib/analytics";

/**
 * What you can do with it: the eighteen use cases on /case-studies (owner
 * review, 15 November 2026; synthesis of concepts C, B and A after blind
 * judging).
 *
 * One reserved box narrows the eighteen: type and situation with live counts,
 * the reader's role (the line under each heading becomes that use case's own
 * starting point, so a reader recognises where they began), results on the
 * record, and a search. Nothing in it changes size as the reader chooses: the
 * cards all take the tallest card's height, measured, and the empty state
 * sits in their place.
 *
 * A card opens the whole story in a native modal sheet: heading, starting
 * point, what we did, outcome, the result on the record where there is one,
 * and the client's words, with the door and the comparison fixed in its bar.
 * Its arrows step through the narrowed set. Without scripts every card holds
 * its whole story and `#c-11` is that card; with them a story is drawn only in
 * the sheet, so the page never says a sentence twice.
 *
 * Words come from the one record of each use case and quote, character for
 * character; the only change here is typesetting (two words held on a line).
 */

const ROLE_LABEL: Record<Role, string> = {
  founder: "Founder",
  "chief-executive": "Chief executive",
  "chief-revenue-officer": "Chief revenue officer",
  "head-of-operations": "Head of operations",
  investor: "Investor",
  partners: "Partners",
  leader: "Leader",
  team: "Team",
  organisation: "Organisation",
};
const ROLES = Object.keys(ROLE_LABEL) as Role[];

type Where = "all" | Door | SituationId;
const WHERE: readonly { id: Where; label: string; level: 0 | 1 }[] = [
  { id: "all", label: "All", level: 0 },
  ...(["brain", "gtm"] as const).flatMap((door) => [
    { id: door as Where, label: DOOR_LABEL[door], level: 0 as const },
    ...SITUATIONS.filter((s) => s.door === door).map((s) => ({ id: s.id as Where, label: s.label, level: 1 as const })),
  ]),
];

const doorOf = (entry: UseCase): Door => SITUATIONS.find((s) => s.useCases.includes(entry.id))!.door;
const fold = (text: string) => text.toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, " ");

interface Entry {
  id: UseCaseId;
  record: UseCase;
  story: LeadershipStory;
  door: Door;
  /** The client's words shown with the story, and who said them. */
  words?: { text: string; who: string };
  haystack: string;
}

const ENTRIES: readonly Entry[] = useCases.map((record) => {
  const story = leadershipStories.find((s) => s.id === record.id)!;
  /* The part of the quote that belongs to the use case; a result without one
     (C-18) shows the short part of its result's quote, which is also exact. */
  const quoteId = record.quoteId ?? record.result?.quoteId;
  const voice = quoteId ? quoteById(quoteId) : undefined;
  const text = record.quoteId ? quotePartFor(record.quoteId, record.id) : voice?.excerpt;
  const words = voice && text ? { text, who: voice.name ? `${voice.name}, ${voice.role}` : voice.role } : undefined;
  const situation = SITUATIONS.find((s) => s.useCases.includes(record.id))!;
  const haystack = fold([record.heading, record.outcome, record.startingPoint, record.whatWeDid, record.result?.headline, record.result?.detail, words?.text, words?.who, ROLE_LABEL[record.role], situation.label, DOOR_LABEL[situation.door]].filter(Boolean).join(" "));
  return { id: record.id, record, story, door: doorOf(record), words, haystack };
});

interface Narrowing { where: Where; role: Role | null; results: boolean; query: string }
const NONE: Narrowing = { where: "all", role: null, results: false, query: "" };

const fitsWhere = (entry: Entry, where: Where) =>
  where === "all" ? true : where === "brain" || where === "gtm" ? entry.door === where : SITUATIONS.find((s) => s.id === where)!.useCases.includes(entry.id);
const fitsRest = (entry: Entry, { role, results, query }: Narrowing) => {
  if (role && entry.record.role !== role) return false;
  if (results && !entry.record.result) return false;
  const words = fold(query).trim().split(" ").filter(Boolean);
  return words.every((word) => entry.haystack.includes(word));
};

const startHref = (door: Door) => `/?start=${door}`;
const startLabel = (door: Door) => (door === "gtm" ? START_LABEL_GTM : START_LABEL);

function Plate({ src, sizes }: { src: string; sizes: string }) {
  const srcset = srcsetFor(src, 800);
  const placeholder = placeholderFor(src);
  return (
    <img
      src={src}
      srcSet={srcset}
      sizes={srcset ? sizes : undefined}
      alt=""
      width={800}
      height={800}
      loading="lazy"
      decoding="async"
      style={placeholder ? { background: `#0a1712 url(${placeholder}) center / cover` } : undefined}
    />
  );
}

export function UseCaseFinder({ onStart }: { onStart: (door: Door) => void }) {
  const [narrow, setNarrow] = useState<Narrowing>(NONE);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(2);
  const [open, setOpen] = useState<UseCaseId | null>(null);
  /* Until the finder runs, every card is in reach (the server's page and a
     page without script list all eighteen). */
  const [live, setLive] = useState(false);
  useEffect(() => setLive(true), []);
  const railRef = useRef<HTMLUListElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const startRef = useRef(onStart);
  startRef.current = onStart;

  const shown = useMemo(() => ENTRIES.filter((entry) => fitsWhere(entry, narrow.where) && fitsRest(entry, narrow)), [narrow]);
  const counts = useMemo(() => new Map(WHERE.map((w) => [w.id, ENTRIES.filter((entry) => fitsWhere(entry, w.id) && fitsRest(entry, narrow)).length])), [narrow]);
  const pages = Math.max(1, Math.ceil(shown.length / perPage));
  const at = Math.min(page, pages - 1);
  const onPage = new Set(shown.slice(at * perPage, at * perPage + perPage).map((entry) => entry.id));
  const from = shown.length ? at * perPage + 1 : 0;
  const to = Math.min(shown.length, at * perPage + perPage);

  const change = (next: Partial<Narrowing>) => { setNarrow((was) => ({ ...was, ...next })); setPage(0); };

  /* How many cards a page holds follows the room the cards have; every card
     takes the tallest card's height at that width, so the box never changes
     size as the reader narrows (Ruling, Krish, 2026-10-24). */
  const measure = useCallback(() => {
    const rail = railRef.current;
    if (!rail || !rail.clientWidth) return;
    const width = rail.clientWidth;
    const fit = width >= 1000 ? 3 : width >= 560 ? 2 : 1;
    rail.style.setProperty("--uc-cols", String(fit));
    rail.classList.add("is-measuring");
    const tallest = Math.max(...[...rail.querySelectorAll<HTMLElement>(".uc-card")].map((card) => card.getBoundingClientRect().height));
    rail.classList.remove("is-measuring");
    if (Number.isFinite(tallest) && tallest > 0) rail.style.setProperty("--uc-card-h", `${Math.ceil(tallest)}px`);
    setPerPage(fit);
  }, []);
  useEffect(() => {
    measure();
    addEventListener("resize", measure, { passive: true });
    let alive = true;
    void document.fonts?.ready.then(() => { if (alive) measure(); });
    return () => { alive = false; removeEventListener("resize", measure); };
  }, [measure]);

  /* The list a story's arrows step through: the narrowed set, or every use
     case when the story was opened from outside it. */
  const steps = open && shown.some((entry) => entry.id === open) ? shown : ENTRIES;
  const stepAt = open ? steps.findIndex((entry) => entry.id === open) : -1;
  const current = open ? ENTRIES.find((entry) => entry.id === open)! : undefined;

  const show = useCallback((id: UseCaseId, opener: HTMLElement | null) => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    openerRef.current = opener;
    setOpen(id);
    if (location.hash.toLowerCase() !== `#${anchorOf(id)}`) history.replaceState(history.state, "", `${location.pathname}${location.search}#${anchorOf(id)}`);
    if (!sheet.open && typeof sheet.showModal === "function") sheet.showModal();
    track("board_item_click", { surface: "use_case", story: id });
  }, []);

  /* Focus goes to the story's heading each time a story shows. */
  useEffect(() => {
    if (!open) return;
    const sheet = sheetRef.current;
    const heading = sheet?.querySelector<HTMLElement>(`[id="${anchorOf(open)}-h"]`);
    heading?.focus({ preventScroll: true });
    sheet?.querySelector(".uc-sheet-body")?.scrollTo?.({ top: 0 });
  }, [open]);

  /* Closing in any way (×, Escape, the backdrop) leaves the reader where they
     were, with focus back on what opened the story. */
  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    const onClose = () => {
      setOpen(null);
      if (/^#c-\d{2}$/i.test(location.hash)) history.replaceState(history.state, "", `${location.pathname}${location.search}`);
      const opener = openerRef.current;
      openerRef.current = null;
      if (opener?.isConnected && opener.getClientRects().length) opener.focus({ preventScroll: true });
    };
    sheet.addEventListener("close", onClose);
    return () => sheet.removeEventListener("close", onClose);
  }, []);

  /* Every link to a use case on the page opens it here, and so does an
     address that names one, the older result fragments included. */
  useEffect(() => {
    const fromHash = () => {
      const id = caseFromHash(location.hash);
      /* An address that names something else (a quote) closes the story. */
      if (!id) { if (sheetRef.current?.open) sheetRef.current.close(); return; }
      if (location.hash.toLowerCase() !== `#${anchorOf(id)}`) history.replaceState(history.state, "", `${location.pathname}${location.search}#${anchorOf(id)}`);
      show(id, null);
    };
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="#c-"]');
      const id = link ? caseFromHash(link.getAttribute("href")!) : undefined;
      if (!link || !id) return;
      event.preventDefault();
      show(id, link);
    };
    /* The address is read once the finder runs: by then the stories have
       given up their ids (below), so the browser's own jump to the fragment
       never moves the page under the sheet or takes focus from its heading. */
    if (live) fromHash();
    addEventListener("hashchange", fromHash);
    document.addEventListener("click", onClick);
    return () => { removeEventListener("hashchange", fromHash); document.removeEventListener("click", onClick); };
  }, [show, live]);

  const step = (by: number) => {
    if (stepAt < 0) return;
    const next = steps[stepAt + by];
    if (next) show(next.id, openerRef.current);
  };
  const onSheetKey = (event: ReactKeyboardEvent<HTMLDialogElement>) => {
    if ((event.target as HTMLElement).closest("input, select, textarea, .mm-compare-sheet")) return;
    if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
  };
  const onSheetClick = (event: ReactMouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) event.currentTarget.close();
    const start = (event.target as Element).closest<HTMLAnchorElement>("[data-uc-start]");
    if (start) {
      event.preventDefault();
      const door = start.dataset.ucStart === "gtm" ? "gtm" : "brain";
      sheetRef.current?.close();
      track("scoping_request", { source: "use_case_story", route: door });
      startRef.current(door);
    }
  };

  const role = narrow.role;
  const nothing = shown.length === 0;

  return (
    <section className={`uc-finder${live ? " is-live" : ""}`} aria-labelledby="library-title" data-uc-finder data-role={role ?? undefined}>
      <div className="mm-container">
        <div className="uc-head">
          <h1 id="library-title">What you can do with it.</h1>
          <p>Real things leaders now do with their AI brain or AI revenue engine.</p>
        </div>

        <div className="uc-box" ref={boxRef}>
          <div className="uc-index">
            <div className="uc-where" role="group" aria-label="Type and situation">
              {WHERE.map((w) => (
                <button key={w.id} type="button" className={`uc-row is-level-${w.level}`} aria-pressed={narrow.where === w.id} onClick={() => change({ where: w.id })}>
                  <span>{w.label}</span>
                  <span className="uc-num">{counts.get(w.id)}</span>
                </button>
              ))}
            </div>
            <div className="uc-roles" role="group" aria-label="Role">
              {ROLES.map((r) => (
                <button key={r} type="button" className="uc-row" aria-pressed={role === r} onClick={() => change({ role: role === r ? null : r })}>
                  <span>{ROLE_LABEL[r]}</span>
                </button>
              ))}
            </div>
            <div className="uc-selects">
              <span className="uc-select">
                <select aria-label="Type and situation" value={narrow.where} onChange={(event) => change({ where: event.target.value as Where })}>
                  {WHERE.map((w) => <option key={w.id} value={w.id}>{`${w.level ? " " : ""}${w.label} (${counts.get(w.id)})`}</option>)}
                </select>
              </span>
              <span className="uc-select">
                <select aria-label="Role" value={role ?? ""} onChange={(event) => change({ role: (event.target.value || null) as Role | null })}>
                  <option value="">Any role</option>
                  {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                </select>
              </span>
            </div>
          </div>

          <div className="uc-results">
            <div className="uc-tools">
              <label className="uc-search">
                <svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="m13 13 4.5 4.5" stroke="currentColor" strokeWidth="1.5" /></svg>
                <input type="search" aria-label="Search the use cases" value={narrow.query} onChange={(event) => change({ query: event.target.value })} />
              </label>
              <button type="button" className="uc-toggle" aria-pressed={narrow.results} onClick={() => change({ results: !narrow.results })}>
                <span className="uc-tick" aria-hidden="true" />Result on the record
              </button>
              <div className="uc-pager">
                <button type="button" aria-label="Previous use cases" disabled={at <= 0} onClick={() => setPage(at - 1)}>←</button>
                <p aria-live="polite" aria-atomic="true">{nothing ? "0 of 18" : `${from === to ? from : `${from} to ${to}`} of ${shown.length}`}</p>
                <button type="button" aria-label="Next use cases" disabled={at >= pages - 1} onClick={() => setPage(at + 1)}>→</button>
              </div>
            </div>

            <div className="uc-stage">
              <ul className="uc-rail" ref={railRef}>
                {ENTRIES.map((entry) => {
                  const away = live && (!shown.includes(entry) || !onPage.has(entry.id));
                  return (
                    <li key={entry.id} id={live ? undefined : anchorOf(entry.id)} className={`uc-card${away ? " is-away" : ""}`} data-uc={entry.id}>
                      <a href={`#${anchorOf(entry.id)}`} className="uc-card-link" tabIndex={away ? -1 : undefined}>
                        <span className="uc-card-plate" aria-hidden="true"><Plate src={entry.story.scene} sizes="(max-width: 899px) 90vw, 30vw" /></span>
                        <span className="uc-card-heading">{tieLast(entry.story.heading)}</span>
                        <span className="uc-card-lines">
                          <span className="uc-card-outcome">{tieLast(entry.story.outcome)}</span>
                          <span className="uc-card-start">{tieLast(entry.story.situation)}</span>
                        </span>
                        {entry.record.result ? <span className="uc-status">Result on the record</span> : null}
                      </a>
                      {/* The rest of the story, for a page without script: with
                          script it opens in the sheet instead, so the server's
                          page says each sentence once. */}
                      {live ? null : (
                        <div className="uc-card-more">
                          <p>{tieLast(entry.story.happened)}</p>
                          {entry.record.result ? (
                            <div className="uc-card-result">
                              <p className="uc-card-result-head">{tieLast(entry.record.result.headline)}</p>
                              <p>{tieLast(entry.record.result.detail)}</p>
                            </div>
                          ) : null}
                          <p className="uc-card-door"><a href={startHref(entry.door)}>{startLabel(entry.door)} <span aria-hidden="true">→</span></a></p>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div className="uc-empty" hidden={!nothing}>
                <p>Nothing matches that.</p>
                <button type="button" onClick={() => change(NONE)}>Show all 18</button>
              </div>
            </div>
          </div>
        </div>

        <dialog ref={sheetRef} className="uc-sheet" aria-labelledby={current ? `${anchorOf(current.id)}-h` : undefined} onKeyDown={onSheetKey} onClick={onSheetClick}>
          <div className="uc-sheet-top">
            <div className="uc-sheet-steps">
              <button type="button" aria-label="Previous use case" disabled={stepAt <= 0} onClick={() => step(-1)}>←</button>
              <p>{stepAt >= 0 ? `${stepAt + 1} of ${steps.length}` : ""}</p>
              <button type="button" aria-label="Next use case" disabled={stepAt < 0 || stepAt >= steps.length - 1} onClick={() => step(1)}>→</button>
            </div>
            <button type="button" className="uc-sheet-close" aria-label="Close" onClick={() => sheetRef.current?.close()}>×</button>
          </div>
          <div className="uc-sheet-body">
            {current ? (
              <article key={current.id} className="uc-story" aria-labelledby={`${anchorOf(current.id)}-h`}>
                <figure className="uc-story-plate" aria-hidden="true"><Plate src={current.story.scene} sizes="(max-width: 899px) 100vw, 40vw" /></figure>
                <div className="uc-story-text">
                  <h2 id={`${anchorOf(current.id)}-h`} tabIndex={-1}>{tieLast(current.story.heading)}</h2>
                  <p>{tieLast(current.story.situation)}</p>
                  <p>{tieLast(current.story.happened)}</p>
                  <p className="uc-story-outcome">{tieLast(current.story.outcome)}</p>
                  {current.record.result ? (
                    <div className="uc-story-result">
                      <p className="uc-story-result-head">{tieLast(current.record.result.headline)}</p>
                      <p>{tieLast(current.record.result.detail)}</p>
                    </div>
                  ) : null}
                  {current.words ? (
                    <blockquote className="uc-story-words">
                      <p>“{tieLast(current.words.text)}”</p>
                      <cite>{current.words.who}</cite>
                    </blockquote>
                  ) : null}
                </div>
              </article>
            ) : null}
          </div>
          <div className="uc-sheet-bar">
            <div className="uc-sheet-starts">
              {(["brain", "gtm"] as const).map((door) => {
                const on = (current?.door ?? "brain") === door;
                return (
                  <a key={door} className="uc-start" href={startHref(door)} data-uc-start={door} data-mm-native aria-hidden={on ? undefined : true} tabIndex={on ? undefined : -1}>
                    {startLabel(door)} <span aria-hidden="true">→</span>
                  </a>
                );
              })}
            </div>
            <div className="uc-sheet-compare">
              <CompareNudge page="brain" variant="bar" hidden={(current?.door ?? "brain") !== "brain"} />
              <CompareNudge page="gtm" variant="bar" hidden={(current?.door ?? "brain") !== "gtm"} />
            </div>
          </div>
        </dialog>
      </div>
    </section>
  );
}
