/**
 * @file orchestrate.ts
 * @description The company-enrichment orchestration, extracted from the enrich-company
 *   edge function so it can be called BOTH over HTTP (the thin enrich-company wrapper,
 *   used by the browser / Diagnosis Room) AND in-process by the unified lead pipeline
 *   (no cross-function HTTP hop, so the `verify_jwt` default on enrich-company is moot).
 *
 *   Fans out to the enrichment clients, merges their partials, derives the internal ICP
 *   routing signal, and (at full depth) writes the one-paragraph synthesis. Degrades
 *   gracefully: a missing key just disables its tool. Never throws.
 *
 *   The `scale` layer is INTERNAL ROUTING ONLY and must never be recited to a visitor.
 *
 * @env BRANDFETCH_API_KEY, PEOPLEDATALABS_API_KEY, BUILTWITH_API_KEY, EXA_API_KEY,
 *      PERPLEXITY_API_KEY, NEWSAPI_API_KEY, GOOGLE_AI_API_KEY, ANTHROPIC_API_KEY
 */

import {
  type Dossier,
  type Icp,
  emptyDossier,
  mergeDossier,
  toDomain,
  FREE_EMAIL_DOMAINS,
} from "./types.ts";
import { fetchBrandfetch, searchBrandDomain } from "./brandfetch.ts";
import { fetchPDL } from "./pdl.ts";
import { fetchTranco } from "./tranco.ts";
import { fetchBuiltWith } from "./builtwith.ts";
import { fetchCurrency } from "./currency.ts";
import { synthesizeDescriptor } from "./synthesize.ts";
import { createLogger } from "../logger.ts";

const logger = createLogger("enrich/orchestrate");

/**
 * Hard wall-clock cap for the whole 'full' fan-out, kept under the ~9s target.
 * If synthesis or a slow tool blows past this, we return what we have so far.
 */
const FULL_DEADLINE_MS = 8500;

/** Result cache: `${domain}:${depth}` -> { dossier, ts }. Shared across HTTP + in-process callers within a worker. */
interface CacheEntry {
  dossier: Dossier;
  ts: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export interface AssembleInput {
  domain?: string;
  email?: string;
  name?: string;
  depth?: "identity" | "full";
  /** ISO alpha-2 country to bias synthesis; caller resolves it (default 'US'). */
  visitorCountry?: string;
}

export interface AssembleResult {
  dossier: Dossier | null;
  /** Free-email domain: degrade gracefully, no gasp. */
  skipped?: "free-email";
  /** depth 'identity' resolved no identity layer (hard miss). */
  notFound?: boolean;
  /** No usable domain/name could be resolved from the input. */
  noDomain?: boolean;
}

/** Returns the registrable domain from an input, or null if none usable. */
function resolveDomain(input: AssembleInput): string | null {
  const email = typeof input.email === "string" ? input.email : "";
  const domainField = typeof input.domain === "string" ? input.domain : "";
  return toDomain(email) ?? toDomain(domainField);
}

/** A bare company name lifted from the domain root, used when no brand name resolved. */
function domainRootName(domain: string): string {
  const root = domain.split(".")[0] ?? domain;
  return root ? root.charAt(0).toUpperCase() + root.slice(1) : domain;
}

/**
 * Lower bound of a PDL-style size band (e.g. "1001-5000" -> 1001, "10001+" -> 10001).
 * Returns undefined when the band can't be parsed.
 */
function sizeBandToCount(band: string | undefined): number | undefined {
  if (!band) return undefined;
  const m = band.match(/\d[\d,]*/);
  if (!m) return undefined;
  const n = Number.parseInt(m[0].replace(/,/g, ""), 10);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Derive the internal ICP + recommended routing mode from the merged scale layer.
 * INTERNAL ONLY. Never recited to the visitor. Heuristic, deliberately coarse.
 */
function deriveRouting(dossier: Dossier): void {
  const s = dossier.scale;

  const headcount =
    typeof s.employeeCount === "number" ? s.employeeCount : sizeBandToCount(s.sizeBand);

  // ICP, from size. Coarse on purpose.
  if (!s.icp) {
    if (typeof headcount === "number") {
      s.icp = headcount < 50 ? "founder" : headcount <= 1000 ? "sme" : "enterprise";
    } else if (typeof s.trancoRank === "number") {
      s.icp = s.trancoRank > 0 && s.trancoRank <= 30000 ? "enterprise" : "sme";
    }
  }

  // The rung is always the Teardown.
  //
  // This used to guess a rung from headcount, which was never a sound inference:
  // company size tells you nothing about whether someone has a decision to make.
  // Every engagement starts with a Teardown regardless, and it is the gate for
  // the Handover, so the honest default from enrichment alone is the entry rung.
  // Mindy decides the actual recommendation from the conversation, which is the
  // only place the decision itself is visible.
  s.recommendedMode ??= "teardown";

  // Which Handover band applies IF the conversation goes there, so Mindy can
  // quote the right one without asking a question she can already answer.
  // Bands mirror src/lib/offers.ts. Internal routing, never recited.
  if (!s.handoverBand && typeof headcount === "number") {
    s.handoverBand =
      headcount < 100 ? "under-100" : headcount <= 250 ? "100-250" : headcount <= 5000 ? "250-5000" : "above-band";
  }

  if (typeof s.trancoRank === "number" && s.trancoRank > 0 && s.trancoRank <= 50000) {
    const cur = dossier.confidence.scale ?? 0;
    dossier.confidence.scale = Math.min(1, Math.max(cur, cur ? cur + 0.05 : 0.5));
  }
}

/** Whether any usable identity was resolved (name or logo). */
function hasIdentity(dossier: Dossier): boolean {
  return Boolean(dossier.identity.name || dossier.identity.logoUrl);
}

/** Race a promise against a deadline; resolves to `fallback` if the deadline wins. */
function withDeadline<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

/**
 * Turn an email / domain / company name into a {@link Dossier}. Never throws.
 * See {@link AssembleResult} for the non-dossier outcomes (free-email, hard miss, no domain).
 */
export async function assembleDossier(input: AssembleInput): Promise<AssembleResult> {
  const depth: "identity" | "full" = input.depth === "identity" ? "identity" : "full";
  const visitorCountry = input.visitorCountry || "US";

  // Resolve domain. Email/domain win; otherwise resolve a bare company NAME to a domain
  // via Brandfetch search so the dossier still lights up when only a name is known.
  let domain = resolveDomain(input);
  let searched: { domain: string; name?: string; iconUrl?: string } | null = null;
  if (!domain && typeof input.name === "string" && input.name.trim()) {
    searched = await searchBrandDomain(input.name.trim());
    if (searched) domain = searched.domain;
  }
  if (!domain) return { dossier: null, noDomain: true };

  if (FREE_EMAIL_DOMAINS.has(domain)) return { dossier: null, skipped: "free-email" };

  const cacheKey = `${domain}:${depth}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    logger.info("cache hit", { domain, depth });
    return { dossier: cached.dossier };
  }

  const started = Date.now();

  try {
    const dossier = emptyDossier(domain, depth);

    // --- Layer 1: name-bearing identity sources first --------------------------
    const identityCalls: Array<Promise<unknown>> = [
      fetchBrandfetch(domain).then((p) => mergeDossier(dossier, p)),
      fetchTranco(domain).then((p) => mergeDossier(dossier, p)),
    ];
    if (depth === "full") {
      identityCalls.push(fetchPDL(domain).then((p) => mergeDossier(dossier, p)));
    }
    await Promise.allSettled(identityCalls);

    // Seed from the name-search hit when Brandfetch-by-domain left gaps.
    if (searched) {
      if (!dossier.identity.name && searched.name) dossier.identity.name = searched.name;
      if (!dossier.identity.logoUrl && !dossier.identity.iconUrl && searched.iconUrl) {
        dossier.identity.iconUrl = searched.iconUrl;
      }
    }

    // Hard miss on the fast path: identity depth with nothing to show.
    if (depth === "identity" && !hasIdentity(dossier)) {
      logger.warn("identity depth resolved no identity", { domain });
      return { dossier: null, notFound: true };
    }

    // --- Layer 2 (full only): name-dependent + remaining sources ---------------
    if (depth === "full") {
      const companyName = dossier.identity.name || domainRootName(domain);
      const elapsed = Date.now() - started;
      const remaining = Math.max(1000, FULL_DEADLINE_MS - elapsed);
      await withDeadline(
        Promise.allSettled([
          fetchCurrency(companyName, domain).then((p) => mergeDossier(dossier, p)),
          fetchBuiltWith(domain).then((p) => mergeDossier(dossier, p)),
        ]),
        remaining,
        [] as PromiseSettledResult<unknown>[],
      );
    }

    // --- Internal routing (never recited to the user) --------------------------
    deriveRouting(dossier);

    // --- Synthesis (full only, best-effort, null ok) ---------------------------
    if (depth === "full" && hasIdentity(dossier)) {
      const elapsed = Date.now() - started;
      const remaining = Math.max(1500, FULL_DEADLINE_MS - elapsed);
      const line = await withDeadline(
        synthesizeDescriptor(dossier, visitorCountry).catch(() => null),
        remaining,
        null,
      );
      if (line) dossier.synthesis = line;
    }

    dossier.meta.tools = [...new Set(dossier.meta.tools)];
    dossier.meta.ms = Date.now() - started;

    cache.set(cacheKey, { dossier, ts: Date.now() });

    logger.info("dossier assembled", {
      domain,
      depth,
      visitorCountry,
      ms: dossier.meta.ms,
      tools: dossier.meta.tools,
      name: dossier.identity.name,
      icp: dossier.scale.icp,
      recommendedMode: dossier.scale.recommendedMode,
      handoverBand: dossier.scale.handoverBand,
      hasSynthesis: Boolean(dossier.synthesis),
    });

    return { dossier };
  } catch (err) {
    logger.error("assembleDossier failed", {
      domain,
      depth,
      error: err instanceof Error ? err.message : String(err),
    });
    // Degrade to "no dossier" rather than throwing, callers treat null as "skip the block".
    return { dossier: null };
  }
}
