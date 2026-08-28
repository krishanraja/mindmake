/**
 * The live board's pure logic: the shapes, the published lane mapping, the
 * honest phrasings and the aggregations. No React and no network, so every rule
 * the brief calls a commitment can be tested directly.
 */

/** CTRL's nine categories, as they arrive in the cache. */
export type BoardCategory =
  | "model" | "product" | "orchestration"
  | "economics" | "tools"
  | "governance" | "proof" | "security"
  | "org";

export type Lane = "product" | "price" | "positioning" | "people";

/** One item as the cache stores it. Everything past headline may be absent. */
export interface BoardCard {
  id: string;
  headline: string;
  say?: string | null;
  pov?: string | null;
  category?: BoardCategory | string | null;
  source?: string | null;
  url?: string | null;
  timeAgo?: string | null;
  score?: number | null;
  sourceCount?: number | null;
}

export interface BoardDay {
  date: string;
  cards: BoardCard[];
}

/** The mapping is published beside the board, so it lives in one place. */
export const LANE_MAP: Record<Lane, BoardCategory[]> = {
  product: ["model", "product", "orchestration"],
  price: ["economics", "tools"],
  positioning: ["governance", "proof", "security"],
  people: ["org"],
};

export const LANE_ORDER: Lane[] = ["product", "price", "positioning", "people"];

export const LANE_SUBTITLES: Record<Lane, string> = {
  product: "what you sell",
  price: "what it costs",
  positioning: "how you stand out",
  people: "who does the selling",
};

export function laneFor(category?: string | null): Lane | null {
  if (!category) return null;
  for (const lane of LANE_ORDER) {
    if ((LANE_MAP[lane] as string[]).includes(category)) return lane;
  }
  return null;
}

/**
 * Corroboration always reads as a lay phrase, never a tier or a score.
 * A primary source standing alone is named as such rather than padded.
 */
const PRIMARY_DOMAINS = [
  "openai.com", "anthropic.com", "blog.google", "deepmind.google", "ai.meta.com",
  "mistral.ai", "microsoft.com", "nvidia.com", "apple.com", "amazon.com",
  "qwenlm.github.io", "arxiv.org",
];

export function corroborationLabel(card: BoardCard): string {
  const count = card.sourceCount ?? 0;
  if (count >= 2) return `${count} independent sources`;
  const source = (card.source ?? "").toLowerCase();
  const primary = PRIMARY_DOMAINS.some((domain) => source.includes(domain));
  return primary ? "1 source, primary" : "1 source";
}

/** Freshness is a promise the visitor can check tomorrow, so it never hides. */
export const STALE_AFTER_HOURS = 26;

export function isStale(cacheDate: string | Date, now: Date = new Date()): boolean {
  const stamped = cacheDate instanceof Date ? cacheDate : new Date(cacheDate);
  if (Number.isNaN(stamped.getTime())) return true;
  return (now.getTime() - stamped.getTime()) / 36e5 > STALE_AFTER_HOURS;
}

export function timestampLabel(
  cacheDate: string | Date,
  days: number,
  total: number,
  now: Date = new Date(),
): string {
  const stamped = cacheDate instanceof Date ? cacheDate : new Date(cacheDate);
  if (Number.isNaN(stamped.getTime())) return "The read is rebuilding";
  const time = stamped.toISOString().slice(11, 16);
  const items = `${total.toLocaleString("en-GB")} corroborated ${total === 1 ? "item" : "items"}`;
  if (isStale(stamped, now)) return `Yesterday's read ${time} UTC · ${days} days · ${items}`;
  return `Read ${time} UTC · ${days} days · ${items}`;
}

/** The homepage carries today's strongest item, using the same component. */
export function topCard(days: BoardDay[]): BoardCard | null {
  const today = days[0]?.cards ?? [];
  if (today.length === 0) return null;
  return [...today].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0];
}

export function laneCounts(days: BoardDay[]): Record<Lane, number> {
  const counts: Record<Lane, number> = { product: 0, price: 0, positioning: 0, people: 0 };
  for (const day of days) {
    for (const card of day.cards) {
      const lane = laneFor(card.category);
      if (lane) counts[lane] += 1;
    }
  }
  return counts;
}

/** The last seven days of per-lane counts, oldest first, for the spark bars. */
export function laneSpark(days: BoardDay[], lane: Lane): number[] {
  const recent = [...days]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7);
  return recent.map((day) => day.cards.filter((card) => laneFor(card.category) === lane).length);
}

/**
 * Industry filtering is deterministic and client-side: a keyword map over the
 * headline, the summary and the source. Honest filtering, not personalisation.
 * "All industries" is the default and is always accurate.
 */
export const INDUSTRIES = [
  "All industries",
  "Media and publishing",
  "Financial services",
  "Professional services",
  "Retail and commerce",
  "Technology",
] as const;

export type Industry = typeof INDUSTRIES[number];

const INDUSTRY_KEYWORDS: Record<Exclude<Industry, "All industries">, string[]> = {
  "Media and publishing": ["media", "publish", "news", "journalis", "broadcast", "content", "advertis", "creator", "video", "music", "film", "studio"],
  "Financial services": ["bank", "financ", "credit", "insur", "trading", "invest", "payment", "fintech", "risk", "regulat", "compliance", "capital"],
  "Professional services": ["consult", "law", "legal", "audit", "accounting", "agency", "advisory", "recruit", "hiring", "profession"],
  "Retail and commerce": ["retail", "commerce", "shopping", "merchant", "consumer", "brand", "checkout", "logistics", "supply", "store"],
  "Technology": ["model", "chip", "gpu", "cloud", "infrastructure", "developer", "software", "platform", "api", "open weights", "compute", "engineer"],
};

export function matchesIndustry(card: BoardCard, industry: Industry): boolean {
  if (industry === "All industries") return true;
  const haystack = [card.headline, card.say ?? "", card.source ?? ""].join(" ").toLowerCase();
  return INDUSTRY_KEYWORDS[industry].some((keyword) => haystack.includes(keyword));
}

export function industryCounts(cards: BoardCard[]): Record<Industry, number> {
  const counts = {} as Record<Industry, number>;
  for (const industry of INDUSTRIES) {
    counts[industry] = industry === "All industries"
      ? cards.length
      : cards.filter((card) => matchesIndustry(card, industry)).length;
  }
  return counts;
}
