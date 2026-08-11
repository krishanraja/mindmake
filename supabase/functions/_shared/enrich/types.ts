/**
 * Shared dossier contract for the company enrichment pipeline (Mindy / Diagnosis Room).
 *
 * A Dossier is assembled in two depths:
 *   - 'identity' (fast, ~1s): Brandfetch + Tranco. Powers the co-brand gasp.
 *   - 'full': adds PDL + BuiltWith + Currency (Perplexity/Exa/NewsAPI) + Gemini synthesis.
 *
 * Each client returns a DossierPartial; the orchestrator merges them with mergeDossier().
 * The `scale` layer is internal routing only and is NEVER flexed back at the user
 * (employee counts / rank route ICP silently; Mindy never recites them).
 */

export interface CurrencyItem {
  text: string;
  sourceUrl?: string;
  date?: string; // ISO date if known
  source: 'perplexity' | 'exa' | 'newsapi' | 'gemini';
}

export type Icp = 'leader' | 'enterprise' | 'sme' | 'capital' | 'founder';

export interface Dossier {
  domain: string;
  fetchedAt: string;
  identity: {
    name?: string;
    logoUrl?: string; // best primary logo
    iconUrl?: string;
    colors?: string[]; // hex, brand-ordered
    founded?: number;
    /**
     * Brightness of the logo artwork, detected client-side (canvas luminance):
     * 'dark' = dark/coloured mark (needs a light plate), 'light' = light/white
     * mark (render directly on a dark surface). Absent until detected.
     */
    logoBg?: 'light' | 'dark';
  };
  understanding: {
    tagline?: string;
    descriptor?: string; // short "what they do"
    products?: string[];
    industry?: string;
    stack?: string[]; // filtered, meaningful tech only
  };
  scale: {
    employeeCount?: number;
    sizeBand?: string; // e.g. "1001-5000"
    trancoRank?: number;
    icp?: Icp;
    recommendedMode?: string; // scaffold key: "teardown" (the default and the gate) or "handover"
    handoverBand?: string;    // which Handover price band applies if it goes there: "under-100" | "100-250" | "250-5000" | "above-band"
  };
  currency: CurrencyItem[];
  synthesis?: string; // one-paragraph "here's what I think you do, correct me"
  confidence: Record<string, number>; // 0..1 per layer
  meta: { tools: string[]; ms: number; depth: 'identity' | 'full' };
}

export interface DossierPartial {
  identity?: Partial<Dossier['identity']>;
  understanding?: Partial<Dossier['understanding']>;
  scale?: Partial<Dossier['scale']>;
  currency?: CurrencyItem[];
  confidence?: Record<string, number>;
  tools?: string[];
}

export const emptyDossier = (domain: string, depth: 'identity' | 'full'): Dossier => ({
  domain,
  fetchedAt: new Date().toISOString(),
  identity: {},
  understanding: {},
  scale: {},
  currency: [],
  confidence: {},
  meta: { tools: [], ms: 0, depth },
});

function clean<T extends Record<string, unknown>>(o: T): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(o)) {
    const emptyStr = typeof v === 'string' && v.trim() === '';
    const emptyArr = Array.isArray(v) && v.length === 0;
    if (v !== undefined && v !== null && !emptyStr && !emptyArr) out[k] = v;
  }
  return out as Partial<T>;
}

export function mergeDossier(base: Dossier, p: DossierPartial | null): Dossier {
  if (!p) return base;
  if (p.identity) base.identity = { ...base.identity, ...clean(p.identity) };
  if (p.understanding) base.understanding = { ...base.understanding, ...clean(p.understanding) };
  if (p.scale) base.scale = { ...base.scale, ...clean(p.scale) };
  if (p.currency?.length) base.currency.push(...p.currency);
  if (p.confidence) base.confidence = { ...base.confidence, ...p.confidence };
  if (p.tools?.length) base.meta.tools.push(...p.tools);
  return base;
}

/** Normalise any work email or URL to a bare registrable domain (best-effort). */
export function toDomain(input: string): string | null {
  if (!input) return null;
  let s = input.trim().toLowerCase();
  if (s.includes('@')) s = s.split('@')[1] || '';
  s = s.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].split('?')[0].trim();
  if (!s || !s.includes('.')) return null;
  // reject obvious free-mail domains for the company gasp (caller decides what to do)
  return s;
}

export const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
  'aol.com', 'proton.me', 'protonmail.com', 'gmx.com', 'live.com', 'me.com', 'msn.com',
]);
