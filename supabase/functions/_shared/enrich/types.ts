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

/**
 * Personal email providers.
 *
 * This began as a hint: a domain in here meant the company read would find
 * nothing, so the pipeline degraded gracefully instead of guessing. It is now
 * also a gate on the way in, which raises the cost of an omission from a weaker
 * read to a visitor being turned away, so the list covers the providers people
 * actually use rather than the dozen that were enough for a hint.
 *
 * `src/lib/workEmail.ts` carries the browser's copy and a test holds the two
 * identical, because a gate the page and the server disagree about is worse
 * than no gate at all.
 */
export const FREE_EMAIL_DOMAINS = new Set([
  // The global ones.
  'gmail.com', 'googlemail.com', 'yahoo.com', 'ymail.com', 'rocketmail.com',
  'hotmail.com', 'outlook.com', 'live.com', 'msn.com', 'passport.com',
  'icloud.com', 'me.com', 'mac.com',
  'aol.com', 'aim.com',
  'proton.me', 'protonmail.com', 'pm.me',
  'gmx.com', 'gmx.net', 'gmx.de', 'mail.com', 'email.com', 'usa.com',
  'zoho.com', 'zohomail.com', 'yandex.com', 'yandex.ru', 'tutanota.com',
  'tuta.com', 'fastmail.com', 'fastmail.fm', 'hushmail.com', 'mailfence.com',
  // Regional providers with large personal bases.
  'hotmail.co.uk', 'hotmail.fr', 'hotmail.it', 'hotmail.es', 'hotmail.de',
  'live.co.uk', 'live.com.au', 'live.ca', 'live.nl', 'live.fr',
  'outlook.com.au', 'outlook.co.uk', 'outlook.fr', 'outlook.de', 'outlook.es',
  'yahoo.co.uk', 'yahoo.com.au', 'yahoo.ca', 'yahoo.co.in', 'yahoo.fr',
  'yahoo.de', 'yahoo.es', 'yahoo.it', 'yahoo.co.jp', 'yahoo.com.br',
  'btinternet.com', 'sky.com', 'virginmedia.com', 'talktalk.net', 'ntlworld.com',
  'bigpond.com', 'bigpond.net.au', 'optusnet.com.au', 'iinet.net.au',
  'orange.fr', 'wanadoo.fr', 'free.fr', 'laposte.net', 'sfr.fr',
  'web.de', 't-online.de', 'freenet.de', 'libero.it', 'virgilio.it',
  'terra.com.br', 'uol.com.br', 'bol.com.br', 'naver.com', 'daum.net',
  'qq.com', '163.com', '126.com', 'sina.com', 'rediffmail.com',
  'shaw.ca', 'rogers.com', 'sympatico.ca', 'telus.net',
  'comcast.net', 'verizon.net', 'att.net', 'sbcglobal.net', 'bellsouth.net',
  'cox.net', 'charter.net', 'earthlink.net', 'juno.com', 'netzero.net',
  // Disposable and throwaway.
  'mailinator.com', 'guerrillamail.com', 'yopmail.com', '10minutemail.com',
  'temp-mail.org', 'trashmail.com', 'sharklasers.com', 'dispostable.com',
  'maildrop.cc', 'getnada.com', 'throwawaymail.com', 'mailnesia.com',
]);
