import { examples } from "@/data/examples";
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent } from "react";
import { leadershipStories, type LeadershipStory } from "@/components/leadership-chapters/leadershipChapters";
import { exampleCardMarkup, tieLast } from "@/components/leadership-chapters/storyFinder";
import { CompareNudge } from "@/components/mindmake/CompareNudge";
import { DOOR_LABEL, SITUATIONS, situationOf, storiesInDisplayOrder, type Door, type Role, type SituationId, type UseCase, type UseCaseId } from "@/data/useCases";
import { caseAnchor as anchorOf, caseFromHash } from "@/lib/useCaseHash";
import { quoteById } from "@/data/testimonials";
import { START_LABEL, START_LABEL_GTM } from "@/lib/publicLinks";
import { placeholderFor, srcsetFor } from "@/lib/responsiveImages";
import { track } from "@/lib/analytics";

/**
 * What you can do with it: the eighteen use cases on /case-studies (owner
 * review, 15 November 2026; synthesis of concepts C, B and A after blind
 * judging).
 *
 * One reserved box narrows records and examples by wish, industry,
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
  "chief-revenue-officer": "CRO",
  "head-of-operations": "Head of operations",
  investor: "Investor",
  partners: "Partners",
  leader: "Leader",
  team: "Team",
  organisation: "Organisation",
};
const ROLES = Object.keys(ROLE_LABEL) as Role[];

type Where = "all" | SituationId;
const WHERE = [{ id: "all" as const, label: "All wishes" }, ...SITUATIONS];
const INDUSTRIES = [...new Set([...examples, ...storiesInDisplayOrder].map((entry) => entry.industry))].sort();
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

const ENTRIES: readonly Entry[] = storiesInDisplayOrder.map((record) => {
  const story = leadershipStories.find((item) => item.id === record.id)!;
  const voice = story.quote && quoteById(story.quote.testimonialId);
  const words = voice && story.quote ? { text: story.quote.text, who: voice.name ? `${voice.name}, ${voice.role}` : voice.role } : undefined;
  const wish = situationOf(record.id);
  const haystack = fold([record.heading, record.outcome, record.startingPoint, record.whatWeDid, record.result?.headline, record.result?.detail, words?.text, words?.who, ROLE_LABEL[record.role], wish.label, record.industry, DOOR_LABEL[record.door]].filter(Boolean).join(" "));
  return { id: record.id, record, story, door: record.door, words, haystack };
});

interface Narrowing { where: Where; industry: string; role: Role | null; results: boolean; query: string }
const NONE: Narrowing = { where: "all", industry: "", role: null, results: false, query: "" };
const GROUPS = ["Results on the record", "Practice accounts", "Illustrative examples"] as const;
const RECORDS = ENTRIES.map((entry) => ({
  id: entry.id as string, group: entry.record.result ? GROUPS[0] : GROUPS[1],
  wish: situationOf(entry.id).id, industry: entry.record.industry, role: entry.record.role,
  haystack: entry.haystack, entry,
}));
const ILLUSTRATIONS = examples.map((example) => ({
  id: example.id, group: GROUPS[2], wish: example.wish, industry: example.industry,
  role: null, haystack: fold([example.industry, example.title, example.bring, example.help, example.leave, SITUATIONS.find((s) => s.id === example.wish)!.label].join(" ")), example,
}));
const INDEX = [...RECORDS, ...ILLUSTRATIONS];
type IndexItem = (typeof INDEX)[number];

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
  const railRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const startRef = useRef(onStart);
  startRef.current = onStart;

  const eligible = useMemo(() => {
    const words = fold(narrow.query).trim().split(/\s+/);
    return INDEX.filter((item) => (!narrow.industry || item.industry === narrow.industry)
      && (!narrow.role || item.role === narrow.role) && (!narrow.results || item.group === GROUPS[0])
      && words.every((word) => item.haystack.includes(word)));
  }, [narrow.industry, narrow.role, narrow.results, narrow.query]);
  const shown = eligible.filter((item) => narrow.where === "all" || narrow.where === item.wish);
  const counts = new Map(WHERE.map((w) => [w.id, eligible.filter((item) => w.id === "all" || item.wish === w.id).length]));
  // Each page belongs to one evidence group, even when the last row has a spare place.
  const slices: IndexItem[][] = [];
  for (const group of GROUPS) {
    const items = shown.filter((item) => item.group === group);
    for (let i = 0; i < items.length; i += perPage) slices.push(items.slice(i, i + perPage));
  }
  const pages = slices.length;
  const at = Math.max(0, Math.min(page, pages - 1));
  const onPage = new Set(slices[at]?.map((item) => item.id));
  const from = shown.length ? shown.findIndex((item) => onPage.has(item.id)) + 1 : 0;
  const to = from + onPage.size - 1;

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
    const tallest = Math.max(...[...rail.querySelectorAll<HTMLElement>(".uc-card, .uc-example-card")].map((card) => card.getBoundingClientRect().height));
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
  const matchingRecords = shown.flatMap((item) => "entry" in item ? [item.entry] : []);
  const steps = open && matchingRecords.some((entry) => entry.id === open) ? matchingRecords : ENTRIES;
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
          <p>Find the call closest to yours, from commissioning a series to deciding where your work can travel.</p>
        </div>

        <div className="uc-box">
          <div className="uc-index">
            <div className="uc-where" role="group" aria-label="Wish">
              {WHERE.map((w) => (
                <button key={w.id} type="button" className="uc-row" aria-pressed={narrow.where === w.id} onClick={() => change({ where: w.id })}>
                  <span>{tieLast(w.label)}</span>
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
            <label className="uc-select uc-industry"><span>Industry</span>
              <select value={narrow.industry} onChange={(event) => change({ industry: event.target.value })}>
                <option value="">All industries</option>
                {INDUSTRIES.map((industry) => <option key={industry}>{industry}</option>)}
              </select>
            </label>
            <div className="uc-selects">
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
                <p aria-live="polite" aria-atomic="true">{nothing ? "0 matches" : `${from === to ? from : `${from} to ${to}`} of ${shown.length}`}</p>
                <button type="button" aria-label="Next use cases" disabled={at >= pages - 1} onClick={() => setPage(at + 1)}>→</button>
              </div>
            </div>

            <div className="uc-stage" ref={railRef}>
              {GROUPS.map((group) => (
                <div key={group} className="uc-group" hidden={live && slices[at]?.[0]?.group !== group}>
                  <h2>{group}</h2>
                  <ul className="uc-rail">
                    {INDEX.filter((item) => item.group === group).map((item) => {
                      const away = live && !onPage.has(item.id);
                      if ("example" in item) return (
                        <li key={item.id} aria-hidden={away || undefined} className={`uc-example-card${away ? " is-away" : ""}`} dangerouslySetInnerHTML={{ __html: exampleCardMarkup(item.example) }} />
                      );
                      const entry = item.entry;
                      return (
                        <li key={entry.id} aria-hidden={away || undefined} id={live ? undefined : anchorOf(entry.id)} className={`uc-card${away ? " is-away" : ""}`} data-uc={entry.id}>
                          <a href={`#${anchorOf(entry.id)}`} className="uc-card-link" tabIndex={away ? -1 : undefined}>
                            <span className="uc-card-plate" aria-hidden="true"><Plate src={entry.story.scene} sizes="(max-width: 899px) 90vw, 30vw" /></span>
                            <span className="story-sector">{entry.record.industry}</span>
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
                </div>
              ))}
              <div className="uc-empty" hidden={!nothing}>
                <p>Nothing matches that.</p>
                <button type="button" onClick={() => change(NONE)}>Clear filters</button>
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
                  <span className="story-sector">{current.record.industry}</span>
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
                      <cite>{tieLast(current.words.who)}</cite>
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
