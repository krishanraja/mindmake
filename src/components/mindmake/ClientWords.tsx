import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { swipeIntent, tieLast } from "@/components/leadership-chapters/storyFinder";
import { canShowStoryQuote, featuredQuotes, publicClientQuotes } from "@/data/testimonials";
import { getUseCase, useCaseForQuote } from "@/data/useCases";

/** Eligible quotes are shown whole. Featured voices lead and each linked record opens by fragment. */
const QUOTES = [...featuredQuotes, ...publicClientQuotes.filter((voice) => !voice.featured)].filter((voice) => canShowStoryQuote(voice.full)).map((voice) => {
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
  const trackRef = useRef<HTMLDivElement>(null);
  const count = QUOTES.length;
  const go = useCallback((index: number) => setAt(Math.max(0, Math.min(count - 1, index))), [count]);

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
    <section className="mm-block uc-words" aria-labelledby="words-title">
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
              return (
                <figure
                  key={voice.id}
                  id={`q-${voice.id}`}
                  className={`uc-quote${live && index === at ? " is-front" : ""}`}
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}`}
                  aria-hidden={front ? undefined : true}
                  {...(front ? {} : { inert: "" })}
                >
                  <blockquote><p>“{tieLast(voice.full)}”</p></blockquote>
                  <figcaption>{voice.name ? <cite>{voice.name}</cite> : null}<span>{tieLast(voice.role)}</span></figcaption>
                  {useCase ? (
                    <div className="uc-quote-foot">
                      {/* The result is on its card for a page without script, so
                          it joins the quote once the carousel runs. */}
                      {result && live ? <p className="uc-quote-result">{tieLast(result.headline)}</p> : null}
                      <a className="uc-quote-link" href={`#${useCase.toLowerCase()}`}>Read their story <span aria-hidden="true">→</span></a>
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
