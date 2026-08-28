/**
 * The board view of the shared corroborated pool.
 *
 * Mindmake's /ai-gtm page publishes a daily read of what moved, with its own
 * timestamp and the number of independent sources behind each item. That needs
 * the whole card, over a window of retained days, rather than the flattened
 * headline list the legacy response carries.
 *
 * This module is deliberately Deno-free so the mapping can be unit tested from
 * the site's own suite. The function's index.ts owns the fetching.
 */

export interface SharedPoolRow {
  created_at: string;
  payload: unknown;
}

export interface BoardCard {
  id: string;
  headline: string;
  say: string | null;
  pov: string | null;
  category: string | null;
  source: string | null;
  url: string | null;
  timeAgo: string | null;
  score: number | null;
  sourceCount: number | null;
}

export interface BoardDay {
  date: string;
  cards: BoardCard[];
}

export interface BoardResponse {
  days: BoardDay[];
  timestamp: string;
  provider: "ctrl-shared-pool";
  total: number;
}

/** The retention window the upstream cache keeps. */
export const MAX_BOARD_DAYS = 28;

export function boardDaysRequested(body: unknown): number | null {
  if (!body || typeof body !== "object") return null;
  const view = (body as { view?: unknown }).view;
  if (view !== "board") return null;
  const asked = Number((body as { days?: unknown }).days ?? MAX_BOARD_DAYS);
  if (!Number.isFinite(asked) || asked < 1) return MAX_BOARD_DAYS;
  return Math.min(Math.floor(asked), MAX_BOARD_DAYS);
}

const text = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const number = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

/** Strips a protocol and path down to the bare domain the card displays. */
const prettySource = (value: unknown): string | null => {
  const source = text(value);
  if (!source) return null;
  return source.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0] || source;
};

export function toBoardCard(raw: unknown, dayIndex: number, cardIndex: number): BoardCard | null {
  if (!raw || typeof raw !== "object") return null;
  const card = raw as Record<string, unknown>;
  const headline = text(card.headline) ?? text(card.title);
  if (!headline) return null;

  return {
    id: text(card.id) ?? `board-${dayIndex}-${cardIndex}`,
    headline,
    say: text(card.say),
    // pov is nullable upstream and the page omits the line when it is absent,
    // so an empty string must not become an arrow pointing at nothing.
    pov: text(card.pov),
    category: text(card.category),
    source: prettySource(card.source),
    url: text(card.url),
    timeAgo: text(card.timeAgo),
    score: number(card.score),
    sourceCount: number(card.sourceCount),
  };
}

/**
 * Maps the freshest N cache rows into the board response, newest day first.
 * The timestamp is the cache's own stamp: the page renders staleness honestly
 * rather than implying a read that did not happen.
 */
export function buildBoard(rows: SharedPoolRow[], days: number): BoardResponse | null {
  const usable = rows
    .filter((row) => Array.isArray(row?.payload))
    .slice(0, days)
    .map((row, dayIndex) => ({
      date: row.created_at,
      cards: (row.payload as unknown[])
        .map((card, cardIndex) => toBoardCard(card, dayIndex, cardIndex))
        .filter((card): card is BoardCard => card !== null),
    }))
    .filter((day) => day.cards.length > 0);

  if (usable.length === 0) return null;

  return {
    days: usable,
    timestamp: usable[0].date,
    provider: "ctrl-shared-pool",
    total: usable.reduce((sum, day) => sum + day.cards.length, 0),
  };
}
