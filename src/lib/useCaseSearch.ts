/**
 * Search the eighteen use cases by what the reader means, not only by the
 * words they type (Krish, 2026-11-16: "All searches should not just keyword
 * match but they should understand anything the user types in and suggest the
 * closest match").
 *
 * It runs in the browser with nothing fetched and nothing sent, so a search
 * costs nothing and says nothing about the reader to anyone. Four signals,
 * strongest first:
 *
 * 1. Intent: a word or phrase the reader means ("scale my business", "cut
 *    costs", "too many tools") is mapped to the ideas a use case is about.
 * 2. Words: a word, or the start of one, in the use case's own record.
 * 3. Typos: a word within one or two letters of a word in the record or of an
 *    intent word ("spredsheet", "newsleters").
 * 4. Closest: when none of those match, the use cases whose words share the
 *    most letter patterns with what was typed, so a search always lands on
 *    the nearest thing there is, marked as the closest match.
 *
 * The concepts are written from the eighteen records in src/data/useCases.ts;
 * a new use case needs its concepts listed below or it is found by its words
 * alone.
 */
import type { UseCaseId } from "@/data/useCases";

/** An idea a reader might mean, and the words and phrases that name it. Words are matched by their stem. */
const CONCEPTS: Record<string, readonly string[]> = {
  content: ["post", "posting", "publish", "write", "writing", "content", "linkedin", "social", "blog", "article", "newsletter", "video", "audience", "visible", "visibility", "seen", "thought leadership", "personal brand", "creator", "followers", "marketing"],
  ideas: ["idea", "ideas", "unlock", "creative", "creativity", "thinking", "get my ideas out", "express", "voice", "stuck", "blocked", "procrastinate", "avoid"],
  growth: ["scale", "grow", "growth", "expand", "bigger", "revenue", "sales", "sell", "customers", "clients", "deals", "pipeline", "win", "market share", "scale my business", "grow my business", "more customers", "more clients"],
  pricing: ["price", "pricing", "priced", "monetise", "monetize", "charge", "fees", "packaging", "positioning", "position", "explain", "pitch", "value proposition", "product market fit"],
  offer: ["offer", "productise", "productize", "package", "consulting", "consultancy", "advisory", "services", "expertise", "launch", "proposition", "sellable"],
  market: ["market", "industry", "news", "trends", "signals", "competitors", "competition", "outside", "external", "research", "intelligence", "keep up", "stay ahead", "informed", "what is changing", "landscape"],
  briefing: ["briefing", "brief", "newsletters", "reading", "read", "morning", "digest", "summary", "summarise", "inbox", "information overload", "too much to read"],
  privacy: ["privacy", "private", "secure", "security", "confidential", "customer data", "data protection", "compliance", "gdpr", "safe"],
  investing: ["investor", "investing", "invest", "acquisition", "acquire", "buy companies", "m&a", "private equity", "pe", "vc", "deal sourcing", "thesis", "portfolio"],
  time: ["time", "faster", "quicker", "save time", "busy", "overwhelmed", "efficient", "efficiency", "productivity", "productive", "hours", "calm", "workload", "free up"],
  handsOn: ["hands-on", "hands on", "build", "builder", "automate", "automation", "agent", "agents", "workflow", "workflows", "systems", "tools myself", "diy", "no code", "learn ai", "upskill"],
  beginner: ["new to ai", "beginner", "start", "starting", "first steps", "learn", "learning", "not technical", "non-technical", "confidence"],
  data: ["data", "dashboard", "dashboards", "report", "reports", "reporting", "analytics", "numbers", "metrics", "kpi", "spreadsheet", "spreadsheets", "excel", "finance"],
  team: ["team", "teams", "staff", "people", "employees", "collaboration", "silos", "handover", "duplicate", "same questions", "alignment", "aligned", "in step", "coordination"],
  knowledge: ["knowledge", "memory", "single source", "source of truth", "outdated", "wrong", "correct", "accuracy", "accurate", "mistake", "error", "consistency", "shared"],
  accounts: ["account", "accounts", "account planning", "key accounts", "crm", "relationships", "contacts", "client management", "enterprise"],
  leadership: ["ceo", "leader", "leadership", "vision", "strategy", "strategic", "direction", "board", "executive", "updates", "communication", "comms"],
  decision: ["decide", "decision", "decisions", "choice", "choose", "argument", "debate", "disagree", "stuck", "call", "big ai call", "build or buy", "build vs buy", "partner", "partnership", "make a call"],
  vendors: ["vendor", "vendors", "supplier", "suppliers", "procurement", "tools", "too many tools", "tool sprawl", "platforms", "software", "evaluate", "evaluation", "shortlist"],
  cost: ["cost", "costs", "cut costs", "budget", "spend", "spending", "savings", "save money", "waste", "roi", "return", "efficiency", "consolidate", "consolidation", "cheaper"],
  hiring: ["hire", "hiring", "headcount", "recruit", "no new hires", "team size", "roles", "who we hire", "org", "organisation", "restructure"],
  transformation: ["transform", "transformation", "legacy", "modernise", "modernize", "change", "adopt", "adoption", "rollout", "roll out", "implement", "implementation", "go live"],
  media: ["media", "publisher", "publishing", "broadcast", "broadcaster", "tv", "radio", "adtech", "martech", "advertising", "ads", "agency"],
};

/** Which ideas each use case is about, strongest first. */
const ABOUT: Record<UseCaseId, readonly string[]> = {
  "C-01": ["content", "ideas", "time", "growth"],
  "C-02": ["content", "ideas", "leadership", "growth", "offer"],
  "C-03": ["leadership", "content", "team", "time"],
  "C-04": ["market", "privacy", "briefing", "leadership"],
  "C-05": ["investing", "market", "decision"],
  "C-06": ["briefing", "time", "market", "leadership"],
  "C-07": ["market", "decision", "leadership", "growth"],
  "C-08": ["pricing", "growth", "decision", "media", "offer"],
  "C-09": ["handsOn", "time", "transformation"],
  "C-10": ["data", "beginner", "handsOn", "accounts"],
  "C-11": ["data", "growth", "handsOn", "hiring", "media"],
  "C-12": ["team", "accounts", "knowledge", "time"],
  "C-13": ["knowledge", "team"],
  "C-14": ["accounts", "leadership", "team", "growth"],
  "C-15": ["decision", "media", "leadership", "vendors"],
  "C-16": ["offer", "pricing", "growth", "ideas"],
  "C-17": ["vendors", "decision", "media", "hiring", "transformation", "cost"],
  "C-18": ["cost", "vendors", "transformation", "media", "decision"],
};

const STOP = new Set("a an and are as at be but by can do for from get have help how i i'd i'm in into is it its me more my of on or our so that the their them they this to us want we what when where which who will with would you your".split(" "));

/** Lower case, plain quotes, letters, digits, &, - and spaces only. */
export function foldText(text: string) {
  return text.toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9&'\- ]+/g, " ").replace(/\s+/g, " ").trim();
}

/** A rough English stem: enough to meet "posting", "posts" and "posted" at "post". */
export function stem(word: string) {
  let w = word.replace(/'s$/, "");
  if (w.length > 5 && w.endsWith("ies")) return `${w.slice(0, -3)}y`;
  for (const suffix of ["ingly", "ation", "ings", "ing", "edly", "ed", "ers", "er", "es", "s", "ly"]) {
    if (w.length - suffix.length >= 3 && w.endsWith(suffix)) { w = w.slice(0, -suffix.length); break; }
  }
  return w;
}

/** Levenshtein distance, stopping early once it passes `cap`. */
export function distance(a: string, b: string, cap = 3) {
  if (Math.abs(a.length - b.length) > cap) return cap + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      const value = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      row.push(value);
      if (value < best) best = value;
    }
    if (best > cap) return cap + 1;
    prev = row;
  }
  return prev[b.length];
}

const tolerance = (word: string) => (word.length >= 8 ? 2 : word.length >= 5 ? 1 : 0);
const grams = (text: string) => {
  const padded = ` ${text} `;
  const set = new Set<string>();
  for (let i = 0; i < padded.length - 2; i++) set.add(padded.slice(i, i + 3));
  return set;
};

interface Indexed {
  id: UseCaseId;
  words: Set<string>;
  stems: Set<string>;
  grams: Set<string>;
  about: readonly string[];
}

export interface Searchable { id: UseCaseId; text: string }
export interface Ranked { id: UseCaseId; score: number }
export interface SearchResult {
  /** The use cases that match, best first. */
  ranked: Ranked[];
  /** True when nothing matched by meaning, word or spelling, and the list is the nearest by letters. */
  closest: boolean;
}

const CONCEPT_ENTRIES = Object.entries(CONCEPTS).map(([id, names]) => ({
  id,
  phrases: names.filter((name) => name.includes(" ")).map(foldText),
  stems: new Set(names.filter((name) => !name.includes(" ")).map((name) => stem(foldText(name)))),
}));

/** Build the index once for a list of use cases. */
export function indexUseCases(items: readonly Searchable[]) {
  return items.map<Indexed>(({ id, text }) => {
    const folded = foldText(text);
    const words = new Set(folded.split(" ").filter((word) => word && !STOP.has(word)));
    return { id, words, stems: new Set([...words].map(stem)), grams: grams(folded), about: ABOUT[id] ?? [] };
  });
}

/** The ideas a query names, with how strongly (a phrase counts more than a word). */
export function conceptsOf(query: string) {
  const folded = foldText(query);
  const tokens = folded.split(" ").filter((word) => word && !STOP.has(word));
  const found = new Map<string, number>();
  const add = (id: string, weight: number) => found.set(id, Math.max(found.get(id) ?? 0, weight));
  for (const concept of CONCEPT_ENTRIES) {
    for (const phrase of concept.phrases) if (` ${folded} `.includes(` ${phrase} `)) add(concept.id, 3);
    for (const token of tokens) {
      const s = stem(token);
      if (concept.stems.has(s)) add(concept.id, 2);
      else if (s.length >= 5 && [...concept.stems].some((name) => name.length >= 4 && distance(s, name, tolerance(s)) <= tolerance(s))) add(concept.id, 1.5);
    }
  }
  return found;
}

/** Rank the indexed use cases for a query. An empty query returns them all, in order, unscored. */
export function searchUseCases(index: readonly Indexed[], query: string): SearchResult {
  const folded = foldText(query);
  if (!folded) return { ranked: index.map(({ id }) => ({ id, score: 0 })), closest: false };
  const tokens = folded.split(" ").filter((word) => word && !STOP.has(word));
  const concepts = conceptsOf(folded);

  /* A word most use cases share ("AI", "business") says little about which
     one the reader means, so it counts for less than a rare one. */
  const share = (s: string) => index.filter((entry) => entry.stems.has(s)).length / Math.max(index.length, 1);
  const weightOf = (s: string) => { const part = share(s); return part > 0.5 ? 0.3 : part > 0.25 ? 0.7 : 1; };

  const scored = index.map((entry) => {
    let score = 0;
    for (const [concept, weight] of concepts) {
      const at = entry.about.indexOf(concept);
      if (at >= 0) score += weight * (at === 0 ? 2 : at === 1 ? 1.6 : 1.2);
    }
    for (const token of tokens) {
      const s = stem(token);
      if (entry.words.has(token) || entry.stems.has(s)) { score += 3 * weightOf(s); continue; }
      if (s.length >= 4 && [...entry.stems].some((word) => word.startsWith(s))) { score += 2; continue; }
      const cap = tolerance(s);
      if (cap && [...entry.stems].some((word) => word.length >= 4 && distance(s, word, cap) <= cap)) score += 1.5;
    }
    return { id: entry.id, score };
  });

  const top = Math.max(...scored.map((item) => item.score));
  if (top > 0) {
    const floor = Math.max(1.5, top * 0.4);
    return { ranked: scored.filter((item) => item.score >= floor).sort((a, b) => b.score - a.score), closest: false };
  }

  /* Nothing by meaning, word or spelling: the nearest by shared letter
     patterns, never an empty page. */
  const q = grams(folded);
  const near = index
    .map((entry) => {
      let shared = 0;
      for (const gram of q) if (entry.grams.has(gram)) shared += 1;
      return { id: entry.id, score: shared / Math.max(q.size, 1) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  return { ranked: near, closest: true };
}

/**
 * What the search box offers before the reader types: the phrases its
 * placeholder turns through, and the suggestions that slide in beside it.
 * Each names a real outcome in the eighteen, so every one lands on a match.
 */
export const SEARCH_PLACEHOLDERS = ["Scale my business", "Unlock my ideas", "Get my team in step"] as const;
export const SEARCH_SUGGESTIONS = ["Post more often", "Cut my AI tools", "Price my product", "Read my market", "Make a big AI call"] as const;
export const SEARCH_PROMPTS = [...SEARCH_PLACEHOLDERS, ...SEARCH_SUGGESTIONS] as const;
