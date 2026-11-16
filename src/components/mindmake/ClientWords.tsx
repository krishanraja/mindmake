import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { swipeIntent, tieLast } from "@/components/leadership-chapters/storyFinder";
import { featuredQuotes, publicClientQuotes } from "@/data/testimonials";
import { getUseCase, useCaseForQuote } from "@/data/useCases";

/**
 * In their words: the eighteen client quotes, one in front with its
 * neighbours beside it, moved by the arrows, a swipe or the arrow keys and
 * never by a timer. Every quote is whole and in the page. The nine that belong
 * to a use case carry its result where it has one, and open its whole story.
 *
 * All eighteen share one row and the row is the longest quote's height, so
 * moving through them never changes the section's size. `#q-<id>` brings that
 * quote to the front. The five featured quotes lead, in their order, then the
 * rest as the record holds them (Krish, 2026-11-15).
 *
 * On a phone a card shows its first four lines, who said it and "Read more"
 * (Krish, 2026-11-16: "These cards now take up way too much space on a mobile
 * screen. They should be expandable and not leave any blank space"). The row
 * is then the tallest folded card, a few lines rather than the longest quote,
 * and "Read more" opens that one card in place with its result. Moving to
 * another quote folds it again, so a swipe still never changes the size.
 * Without script every quote is whole.
 */
const QUOTES = [...featuredQuotes, ...publicClientQuotes.filter((voice) => !voice.featured)].map((voice) => {
  const useCase = useCaseForQuote(voice.id);
  const record = useCase ? getUseCase(useCase) : undefined;
  return { voice, useCase, result: record?.result };
});

export function ClientWords({ children }: { children?: ReactNode }) {
  const [at, setAt] = useState(0);
  /* The server's page, and a page without script, shows every quote in reach;
     only once the carousel runs are the ones behind the front set aside. */
  const [live, setLive] = useState(false);
  useEffect(() => setLive(true), []);
  const [opened, setOpened] = useState<string | null>(null);
  /* Which quotes say more than their folded card shows, measured where the
     fold applies (a phone); elsewhere none, and the toggle stays out. */
  const [more, setMore] = useState<ReadonlySet<string>>(new Set());
  const trackRef = useRef<HTMLDivElement>(null);
  const count = QUOTES.length;
  const go = useCallback((index: number) => setAt(Math.max(0, Math.min(count - 1, index))), [count]);
  /* Moving on folds the card that was open, so the row keeps its height. */
  useEffect(() => setOpened(null), [at]);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const next = new Set<string>();
    for (const figure of track.querySelectorAll<HTMLElement>(".uc-quote")) {
      if (figure.classList.contains("is-open")) { if (figure.dataset.more === "true") next.add(figure.dataset.quote!); continue; }
      const text = figure.querySelector<HTMLElement>("blockquote p");
      const folded = !!text && getComputedStyle(text).webkitLineClamp !== "none" && text.scrollHeight > text.clientHeight + 1;
      if (folded || (figure.dataset.result === "true" && getComputedStyle(figure).getPropertyValue("--uc-q-fold").trim() === "1")) next.add(figure.dataset.quote!);
    }
    setMore((was) => (was.size === next.size && [...next].every((id) => was.has(id)) ? was : next));
  }, []);
  useEffect(() => {
    if (!live) return;
    measure();
    addEventListener("resize", measure, { passive: true });
    let alive = true;
    void document.fonts?.ready.then(() => { if (alive) measure(); });
    return () => { alive = false; removeEventListener("resize", measure); };
  }, [live, measure]);

  /* An address that names a quote brings it to the front. */
  useEffect(() => {
    const fromHash = () => {
      const match = /^#q-(.+)$/.exec(location.hash);
      const index = match ? QUOTES.findIndex((quote) => quote.voice.id === decodeURIComponent(match[1])) : -1;
      if (index < 0) return;
      setAt(index);
      document.getElementById("words-title")?.closest("section")?.scrollIntoView({ block: "start" });
    };
    fromHash();
    addEventListener("hashchange", fromHash);
    return () => removeEventListener("hashchange", fromHash);
  }, []);

  /* A sideways drag moves one quote; a vertical one is the page's. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let drag: { x: number; y: number; t: number; id: number } | null = null;
    const down = (event: PointerEvent) => { if (event.pointerType !== "mouse" || event.button === 0) drag = { x: event.clientX, y: event.clientY, t: performance.now(), id: event.pointerId }; };
    const up = (event: PointerEvent) => {
      if (!drag || drag.id !== event.pointerId) return;
      const by = event.type === "pointercancel" ? 0 : swipeIntent(event.clientX - drag.x, event.clientY - drag.y, performance.now() - drag.t);
      drag = null;
      if (by) setAt((was) => Math.max(0, Math.min(count - 1, was + by)));
    };
    track.addEventListener("pointerdown", down);
    track.addEventListener("pointerup", up);
    track.addEventListener("pointercancel", up);
    return () => { track.removeEventListener("pointerdown", down); track.removeEventListener("pointerup", up); track.removeEventListener("pointercancel", up); };
  }, [count]);

  const onKey = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") { event.preventDefault(); go(at + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); go(at - 1); }
  };

  return (
    <section className={`mm-block uc-words${live ? " is-live" : ""}`} aria-labelledby="words-title">
      <div className="mm-container">
        <div className="uc-quotes" role="region" aria-roledescription="carousel" aria-labelledby="words-title" onKeyDown={onKey} style={{ ["--at" as string]: at }}>
          <div className="uc-quotes-head">
            <h2 id="words-title">In their words.</h2>
            <div className="uc-quotes-nav">
              <button type="button" aria-label="Previous quote" disabled={at <= 0} onClick={() => go(at - 1)}>←</button>
              <p aria-live="polite" aria-atomic="true">{at + 1} of {count}</p>
              <button type="button" aria-label="Next quote" disabled={at >= count - 1} onClick={() => go(at + 1)}>→</button>
            </div>
          </div>
          <div className="uc-quotes-track" ref={trackRef}>
            {QUOTES.map(({ voice, useCase, result }, index) => {
              const front = !live || index === at;
              const isOpen = opened === voice.id;
              const hasMore = more.has(voice.id);
              const textId = `q-${voice.id}-text`;
              return (
                <figure
                  key={voice.id}
                  id={`q-${voice.id}`}
                  className={`uc-quote${live && index === at ? " is-front" : ""}${isOpen ? " is-open" : ""}`}
                  data-quote={voice.id}
                  data-result={result && live ? "true" : undefined}
                  data-more={hasMore ? "true" : undefined}
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}`}
                  aria-hidden={front ? undefined : true}
                  {...(front ? {} : { inert: "" })}
                >
                  <blockquote><p id={textId}>“{tieLast(voice.full)}”</p></blockquote>
                  <figcaption>{voice.name ? <cite>{voice.name}</cite> : null}<span>{tieLast(voice.role)}</span></figcaption>
                  {useCase || hasMore ? (
                    <div className="uc-quote-foot">
                      {/* The result is on its card for a page without script, so
                          it joins the quote once the carousel runs. */}
                      {result && live ? <p className="uc-quote-result">{tieLast(result.headline)}</p> : null}
                      <div className="uc-quote-acts">
                        {hasMore ? (
                          <button type="button" className="uc-quote-more" aria-expanded={isOpen} aria-controls={textId} onClick={() => setOpened(isOpen ? null : voice.id)}>
                            {isOpen ? "Show less" : "Read more"}
                          </button>
                        ) : null}
                        {useCase ? <a className="uc-quote-link" href={`#${useCase.toLowerCase()}`}>Read their story <span aria-hidden="true">→</span></a> : null}
                      </div>
                    </div>
                  ) : null}
                </figure>
              );
            })}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
