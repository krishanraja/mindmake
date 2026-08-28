import { useState } from "react";
import { track } from "@/lib/analytics";

/**
 * The fork nobody names.
 *
 * Interactive, and deliberately inert: no email, no storage, no analytics
 * payload beyond which card was picked. The visitor is locating themselves,
 * and the page says so under the cards.
 */
const FORKS = [
  {
    id: "keep",
    title: "Keep adopting tools",
    yes: "Cheap to start, useful on day one",
    cost: "Nothing accumulates. The seventh costs what the first cost",
    landing: "nothing accumulates",
    lands: "Every tool starts from zero and the seventh costs what the first cost.",
    sub: "This is the default answer. Most companies choose it without noticing.",
  },
  {
    id: "rent",
    title: "Rent the layer",
    yes: "Fastest route to something working",
    cost: "It compounds inside their product, not yours",
    landing: "someone else keeps the asset",
    lands: "Fastest to working, and leaving gives you an export, not a system.",
    sub: "A reasonable bridge, if you know it is a bridge.",
  },
  {
    id: "own",
    title: "Own the layer",
    yes: "Compounds on your side, and you keep it",
    cost: "You carry the upkeep afterwards",
    landing: "it compounds on your side",
    lands: "Slower to the first result, and it is the only one you still have in two years.",
    sub: "The build we do. Value first, one use case at a time.",
  },
];

export function ForkBand() {
  const [picked, setPicked] = useState<string | null>(null);
  const choice = FORKS.find((fork) => fork.id === picked);

  /* The paper is the section, not a card sitting on it, so the head bar and the
     paper both run to the viewport edge. Keeping the head a sibling of the
     container rather than a child gets that bleed without a 50vw trick, which
     overshoots by half a scrollbar and scrolls the page sideways. */
  return (
    <div className="mm-band">
      <div className="mm-band-head">
        <div className="mm-container">
          <h2>
            Three ways to do this. <span className="mm-claim">They end in different places.</span>
          </h2>
        </div>
      </div>

      <div className="mm-container mm-band-body">
      <p className="mm-band-q">
        <b>Q1</b> Everything you teach AI today. Where does it end up?
      </p>

      <div className="mm-forks">
        {FORKS.map((fork) => (
          <button
            key={fork.id}
            className="mm-fork"
            type="button"
            aria-pressed={picked === fork.id}
            onClick={() => {
              setPicked(fork.id);
              track("fork_pick", { pick: fork.id });
            }}
          >
            <svg className="mm-fork-tick" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M2 8.5 L6 12.5 L14 3.5" />
            </svg>
            <h3>{fork.title}</h3>
            <p className="mm-fork-yes">{fork.yes}</p>
            <p className="mm-fork-cost">{fork.cost}</p>
          </button>
        ))}
      </div>

      <p className="mm-landing" role="status">
        {choice ? (
          <>
            You land on <em>{choice.landing}</em>. {choice.lands}
            <small>{choice.sub}</small>
          </>
        ) : (
          <>
            Pick one and this line tells you where you land.
            <small>No email required. Nothing is stored.</small>
          </>
        )}
      </p>
      </div>
    </div>
  );
}
