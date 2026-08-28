import { corroborationLabel, type BoardCard as Card } from "@/lib/board";
import { track } from "@/lib/analytics";

interface BoardCardProps {
  card: Card;
}

/**
 * One item on the board, and the same component the homepage uses for today's
 * strongest read. Every line is optional except the headline: a card built from
 * a thinner payload renders without its point of view rather than inventing one.
 */
export function BoardCardView({ card }: BoardCardProps) {
  const body = (
    <>
      <div className="mm-card-meta">
        {card.category && <span className="mm-tag">{card.category}</span>}
        <span className="mm-corroboration">{corroborationLabel(card)}</span>
        {(card.source || card.timeAgo) && (
          <span className="mm-card-source">
            {[card.source, card.timeAgo].filter(Boolean).join(" · ")}
          </span>
        )}
      </div>
      <h3>{card.headline}</h3>
      {card.say && <p className="mm-card-say">{card.say}</p>}
      {card.pov && (
        <p className="mm-card-pov">
          <span aria-hidden="true">→ </span>{card.pov}
        </p>
      )}
    </>
  );

  if (!card.url) return <article className="mm-card">{body}</article>;

  return (
    <a
      className="mm-card"
      href={card.url}
      target="_blank"
      rel="noreferrer"
      onClick={() => track("board_item_click", { category: String(card.category ?? "unknown") })}
    >
      {body}
    </a>
  );
}
