import { useEffect, useRef, useState } from "react";
import { FilmPlate } from "@/components/mindmake/FilmPlate";
import { ScrubText } from "@/components/lab/ScrubText";
import { useScrollDriver } from "@/hooks/useScrollDriver";
import filmOnePoster from "@/assets/films/film-01-poster.jpg";
import filmOnePosterWebp from "@/assets/films/film-01-poster.webp";
import filmOneLoop from "@/assets/films/film-01-loop.mp4";
import filmOneLoopWebm from "@/assets/films/film-01-loop.webm";
import "@/styles/mindmake.css";
import "@/styles/mindmake-instruments.css";
import "@/styles/motion-lab.css";

export type MotionMode = "scrubbed" | "entrance";

/* Real copy from the live pages, so the comparison is about motion only. */
const READ_LINE =
  "Every AI you buy has read the whole internet and knows nothing about you. "
  + "It is confidently generic. So you get faster at drafting and no better at deciding.";

const LEVERS = [
  { key: "charge", title: "What you charge", body: "The cost of doing the work is falling, and customers are starting to notice." },
  { key: "stand", title: "How you stand out", body: "Who else is selling to your customers now, and the clearest way to explain why you are the better choice." },
  { key: "selling", title: "Who does the selling", body: "The roles worth creating now, and the parts of selling your team can hand to AI this month." },
];

const FIGURES = [
  { value: 149, label: "product" },
  { value: 132, label: "price" },
  { value: 115, label: "positioning" },
  { value: 21, label: "people" },
];

const PASSES = [
  { key: "read", title: "We read the market", body: "Every day, from sources that agree with each other." },
  { key: "pick", title: "You pick one lever", body: "Product, price, positioning or people. One, taken all the way." },
  { key: "build", title: "We build it", body: "A working model, used on real work, that you keep." },
];

/** Counts to its value under scroll control, and counts back down again. */
function ScrubbedFigure({ value, label }: { value: number; label: string }) {
  const [progress, setProgress] = useState(0);
  const ref = useScrollDriver<HTMLDivElement>(setProgress, "read");
  return (
    <div ref={ref} className="mm-lab-figure">
      <span className="mm-lab-figure-value">{Math.round(value * progress)}</span>
      <span className="mm-lab-figure-label">{label}</span>
    </div>
  );
}

/** Counts once when it first arrives, then stays. */
function EnteringFigure({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver !== "function") { setShown(value); return; }
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      const started = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - started) / 900);
        setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="mm-lab-figure">
      <span className="mm-lab-figure-value">{shown}</span>
      <span className="mm-lab-figure-label">{label}</span>
    </div>
  );
}

/** Adds `is-in` once, on arrival. The whole of mode B is this one idea. */
function OnEnter({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver !== "function") { setEntered(true); return; }
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      setEntered(true);
    }, { threshold: 0.25 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`mm-lab-enter${entered ? " is-in" : ""}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/** The three levers, assembled by scroll rather than on arrival. */
function ScrubbedLevers() {
  const [progress, setProgress] = useState(0);
  const ref = useScrollDriver<HTMLDivElement>(setProgress, "read");
  return (
    <div ref={ref} className="mm-lab-levers">
      {LEVERS.map((lever, index) => {
        const start = index * 0.22;
        const t = Math.min(1, Math.max(0, (progress - start) / 0.45));
        return (
          <article
            key={lever.key}
            className="mm-lab-lever"
            style={{
              transform: `translate3d(0, ${(1 - t) * 26}px, 0)`,
              borderColor: `rgba(127, 227, 180, ${0.1 + t * 0.5})`,
            }}
          >
            <span className="mm-lab-rule" style={{ transform: `scaleX(${t})` }} />
            <h3>{lever.title}</h3>
            <p>{lever.body}</p>
          </article>
        );
      })}
    </div>
  );
}

/** A column that pins while the passes go by, dimming the ones you are not on. */
function StickyPasses({ mode }: { mode: MotionMode }) {
  const [active, setActive] = useState(0);
  const ref = useScrollDriver<HTMLDivElement>(
    (p) => setActive(Math.min(PASSES.length - 1, Math.floor(p * PASSES.length))),
    "read",
  );
  return (
    <div ref={ref} className="mm-lab-sticky">
      <div className="mm-lab-sticky-rail">
        <h2>How the thirty days runs.</h2>
        <p className="mm-lede">The column holds while the steps pass it. Nothing appears; the emphasis moves.</p>
        <ol className="mm-lab-ticks">
          {PASSES.map((pass, index) => (
            <li key={pass.key} className={index === active ? "is-on" : ""}>{pass.title}</li>
          ))}
        </ol>
      </div>
      <div className="mm-lab-sticky-items">
        {PASSES.map((pass, index) => {
          const card = (
            <article className={`mm-lab-pass${index === active ? " is-on" : ""}`}>
              <span className="mm-lab-pass-index">0{index + 1}</span>
              <h3>{pass.title}</h3>
              <p>{pass.body}</p>
            </article>
          );
          return mode === "entrance"
            ? <OnEnter key={pass.key} delay={index * 90}>{card}</OnEnter>
            : <div key={pass.key}>{card}</div>;
        })}
      </div>
    </div>
  );
}

export function MotionLab({ mode }: { mode: MotionMode }) {
  const wrap = (node: React.ReactNode, delay = 0) =>
    mode === "entrance" ? <OnEnter delay={delay}>{node}</OnEnter> : <>{node}</>;

  return (
    <div className={`mm-site mm-lab mm-lab-${mode}`}>
      <div className="mm-lab-banner">
        <strong>{mode === "scrubbed" ? "A. Scrubbed" : "B. Entrance"}</strong>
        <span>
          {mode === "scrubbed"
            ? "Everything is in the page. Scroll moves emphasis, and reverses."
            : "Elements arrive as you reach them, and stay."}
        </span>
        <a href={mode === "scrubbed" ? "/lab/motion-b" : "/lab/motion-a"}>
          See {mode === "scrubbed" ? "B" : "A"} →
        </a>
      </div>

      <main>
        <section className="mm-hero">
          <div className="mm-container">
            <div className="mm-hero-stage">
              <div className="mm-hero-plate">
                <FilmPlate
                  poster={filmOnePoster}
                  posterWebp={filmOnePosterWebp}
                  src={filmOneLoop}
                  srcWebm={filmOneLoopWebm}
                  label="An instrument room at first light."
                  style={{ height: "100%" }}
                  scrim
                  priority
                />
              </div>
              <div className="mm-hero-copy">
                <h1 className="mm-setup">Every AI you buy knows the market.</h1>
                <p className="mm-claim">Yours should also know you.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mm-lab-block">
          <div className="mm-container">
            <h2>The sentence that has to land.</h2>
            {mode === "scrubbed"
              ? <ScrubText text={READ_LINE} className="mm-lab-read" />
              : wrap(<p className="mm-scrub mm-lab-read">{READ_LINE}</p>)}
          </div>
        </section>

        <section className="mm-lab-block is-raised">
          <div className="mm-container">
            <h2>Three things AI changes about selling.</h2>
            {mode === "scrubbed" ? <ScrubbedLevers /> : (
              <div className="mm-lab-levers">
                {LEVERS.map((lever, index) => (
                  <OnEnter key={lever.key} delay={index * 110}>
                    <article className="mm-lab-lever is-settled">
                      <span className="mm-lab-rule" />
                      <h3>{lever.title}</h3>
                      <p>{lever.body}</p>
                    </article>
                  </OnEnter>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mm-lab-block">
          <div className="mm-container">
            <h2>What moved today.</h2>
            <div className="mm-lab-figures">
              {FIGURES.map((figure) => (mode === "scrubbed"
                ? <ScrubbedFigure key={figure.label} {...figure} />
                : <EnteringFigure key={figure.label} {...figure} />))}
            </div>
          </div>
        </section>

        <section className="mm-lab-block is-raised">
          <div className="mm-container">
            <StickyPasses mode={mode} />
          </div>
        </section>

        <section className="mm-lab-block is-tail">
          <div className="mm-container">
            <p className="mm-claim">Scroll back up and watch what happens.</p>
            <p className="mm-lede">
              {mode === "scrubbed"
                ? "Everything runs backwards, because the page is reading your position rather than remembering an event."
                : "Nothing happens. Each element fired once and is now finished."}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
