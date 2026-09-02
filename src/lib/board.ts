/**
 * The live board's pure logic: the shapes, the published lane mapping, the
 * honest phrasings and the aggregations. No React and no network, so every rule
 * the brief calls a commitment can be tested directly.
 */
import { DIVISIONS, DIVISION_IDS, type Division } from "@/lib/workEmail";

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
  /** Which parts of a business the item lands on, from the classifier. */
  affects?: string[] | null;
  /** What it asks of a leader: an opening, a change to absorb, or a risk. */
  stance?: string | null;
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
  /* Narrower than it looks it should be, deliberately. On a board where every
     item is about AI, words like "model", "platform", "api" and "software"
     match nearly everything, so the chip that a technology buyer is most
     likely to press was returning the same list as "All industries" and
     reading as broken. These are the words that mark a story as being about
     the technology industry rather than about technology. */
  "Technology": ["chip", "semiconductor", "gpu", "data centre", "data center", "hyperscaler", "foundry", "hardware", "cloud provider", "open weights", "wafer", "fab"],
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

/* ---------- Reading the board as the part of the business you work in ---------- */

/**
 * The eight divisions, straight from `src/lib/workEmail.ts`.
 *
 * Not a second list. The lead dialog already asks a visitor which part of the
 * business they work in, the server allowlists the same eight identifiers and a
 * test keeps the two copies identical, so the board filters on the vocabulary
 * the site already speaks rather than inventing "revenue" beside an existing
 * "sales".
 */
export type Role = Division;
export const ROLE_LABELS: Record<Role, string> = Object.fromEntries(
  DIVISIONS.map((entry) => [entry.id, entry.label]),
) as Record<Role, string>;

/**
 * Which of the nine categories touch each division's work.
 *
 * This is the base of the match and it is a projection a visitor could check:
 * every category is claimed by at least one role, several are claimed by more
 * than one, and nothing is claimed by all eight. `org` is deliberately the only
 * category People claims, because a filter that quietly returns the whole board
 * is the industry filter's old Technology bug wearing a different label.
 */
export const ROLE_CATEGORIES: Record<Role, BoardCategory[]> = {
  leadership:  ["governance", "economics", "org"],
  sales:       ["economics", "proof", "product"],
  marketing:   ["proof", "product", "economics"],
  product:     ["model", "product", "orchestration"],
  engineering: ["model", "tools", "orchestration", "security"],
  operations:  ["tools", "orchestration", "security", "governance"],
  /* Economics only. `tools` was in here and it pulled a story about a security
     breach into Finance's reading on the strength of the category alone, which
     is the projection being generous rather than true. Money is its own
     category; what Finance wants from the rest arrives on the keywords. */
  finance:     ["economics"],
  /* `org` alone, and it is the one role that cannot be fed by a single day.
     Measured against the live feed on 2 September 2026: `org` is 20 items in
     400, so People matched 0 of today's 13 and 3 of the last three days. Any
     surface offering this chip has to read a window wide enough to stock it, or
     the chip is permanently disabled on the surface that offers it. That is a
     fact about the classifier upstream, not something a keyword list can fix. */
  people:      ["org"],
};

/**
 * The refinement, over the headline and the point of view.
 *
 * Narrow on purpose, for the reason recorded above `INDUSTRY_KEYWORDS`: on a
 * board where every item is about AI, a word like "model" or "platform" matches
 * nearly everything, and a chip that returns the same list as "Everything"
 * reads as broken. These are words that mark an item as belonging to one
 * division's week rather than to the industry at large.
 */
const ROLE_KEYWORDS: Record<Role, string[]> = {
  leadership:  ["board", "regulat", "oversight", "judgement", "strategy", "policy", "governance"],
  sales:       ["revenue", "pricing", "customer", "buyer", "deal", "quota", "pipeline"],
  marketing:   ["advertis", " ads", "brand", "audience", "campaign", "creator", "content"],
  product:     ["launch", "roadmap", "benchmark", "capabilit", "release", "feature"],
  engineering: ["code", "api", "latency", "infrastructure", "open weights", "vulnerab", "deploy"],
  operations:  ["workflow", "process", "supply", "outage", "incident", "throughput"],
  finance:     ["cost", "cheaper", "margin", "spend", "billion", "funding", "efficiency"],
  people:      ["hiring", "headcount", "layoff", "talent", "workforce", "culture", "role"],
};

/**
 * Whether an item belongs in a division's reading.
 *
 * Two ways, and the first is much better than the second.
 *
 * `affects` is the classifier's own answer, written upstream from the article
 * rather than the headline. When it is there, it is the answer: a projection of
 * nine subject categories onto eight divisions is a guess, and this is not.
 *
 * Without it, the guess: a category this division works in, or one of a short
 * list of words. Deterministic and checkable, like the industry filter beside
 * it -- honest filtering, not personalisation -- but it cannot read. Measured
 * against 400 live items, 59 were about people and work and 42 of them were
 * filed under their subject instead, because a story has a subject and an
 * audience and a single category can only record one. Widening the word lists
 * to catch them was tried and rejected: it took People from 32 to 47 and most
 * of the 15 were wrong, because no list of words can tell the team you manage
 * from a team of AI agents in Slack. That is why the field exists.
 */
export function matchesRole(card: BoardCard, role: Role): boolean {
  if (card.affects?.length) return card.affects.includes(role);
  if (ROLE_CATEGORIES[role].includes(card.category as BoardCategory)) return true;
  const haystack = [card.headline, card.pov ?? ""].join(" ").toLowerCase();
  return ROLE_KEYWORDS[role].some((keyword) => haystack.includes(keyword));
}

/** Counts for the chips, so none is ever pressable and empty. */
export function roleCounts(cards: BoardCard[]): Record<Role, number> {
  const counts = {} as Record<Role, number>;
  for (const role of DIVISION_IDS) {
    counts[role] = cards.filter((card) => matchesRole(card, role)).length;
  }
  return counts;
}

/**
 * The stances an item can take toward a leader, and the one the board declines.
 *
 * The board's job is what changed and what to do about it. An item that only
 * reports damage -- a layoff round, a collapse, a firing -- has no move in it
 * for the reader, and printing it is doom framing about their business, which
 * the house style bans outright. So the upstream classifier drops those, and
 * this is the second lock: anything that arrives marked as one is not shown.
 *
 * A story about work changing is not the same thing and is not excluded. "The
 * shape of entry-level hiring is changing" is a shift with a move in it; "40,000
 * people were let go" is not.
 */
export const SHOWN_STANCES = ["opportunity", "shift", "risk"] as const;

export function isShown(card: BoardCard): boolean {
  /* Unmarked items predate the field and are shown, because the board has been
     answering with them all along and hiding them would empty it. */
  if (!card.stance) return true;
  return (SHOWN_STANCES as readonly string[]).includes(card.stance);
}

/**
 * The newest items matching the current filters, across the whole window.
 *
 * The board used to show today's cards and nothing else, with the retained days
 * used only for the lane counts. That works while no filter is on, because
 * today's items are the newest ones anyway. It stops working the moment a
 * visitor picks a role: measured against the classified feed, People is 39
 * items in 476 but only 0 of today's 13, so a chip that filtered today alone
 * would be empty on most days for the role it was added to serve.
 *
 * So the board reaches back instead. One rule for both states: the newest N
 * items that match, newest first. With no filter that is today, since today's
 * items are the newest. With one it goes as far back as it needs. Nothing is
 * hidden by this, because every row carries its own age.
 */
export function recentMatching(
  days: BoardDay[],
  options: { industry?: Industry; role?: Role | null; limit?: number } = {},
): BoardCard[] {
  const { industry = "All industries", role = null, limit } = options;
  const out: BoardCard[] = [];
  for (const day of days) {
    for (const card of day.cards) {
      if (!isShown(card)) continue;
      if (!matchesIndustry(card, industry)) continue;
      if (role && !matchesRole(card, role)) continue;
      out.push(card);
      if (limit && out.length >= limit) return out;
    }
  }
  return out;
}

/** How many match, for the count beside a chip and the honesty line under it. */
export function countMatching(
  days: BoardDay[],
  options: { industry?: Industry; role?: Role | null } = {},
): number {
  return recentMatching(days, options).length;
}
