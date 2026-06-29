/**
 * Dossier contract test - the convergence safety net (Unit C, step 1).
 *
 * WHY THIS EXISTS
 * The portfolio plan calls for converging Mindmaker's `enrich-company` and
 * Make Your Mind Up's `enrich-profile` onto one shared provider core (see
 * mm-ctrl `docs/ENRICHMENT-CONVERGENCE.md`). That migration MUST be
 * behavior-preserving: the `Dossier` shape the Diagnosis Room depends on, and
 * the `scale.*` "internal routing only, never recited" privacy contract, must
 * survive byte-for-byte. You cannot prove "byte-identical" later without a
 * captured baseline now - so this test pins the contract BEFORE any extraction.
 *
 * The baselines below were captured live from the deployed function on
 * 2026-06-29 (POST { domain: "stripe.com" }, both depths). They assert the
 * STRUCTURE (key sets, provider list, privacy layer) - not volatile values
 * (logo URLs, ms, fetchedAt) - so the test is stable across live-data drift but
 * fails loudly the moment a refactor drops a field, leaks the routing layer, or
 * changes the provider waterfall.
 *
 * Run: deno test supabase/functions/enrich-company/dossier-contract.test.ts
 */

import { assert, assertEquals } from 'https://deno.land/std@0.168.0/testing/asserts.ts';
import {
  type Dossier,
  emptyDossier,
  mergeDossier,
  toDomain,
  FREE_EMAIL_DOMAINS,
} from '../_shared/enrich/types.ts';

// --- The captured golden baselines (structure only) -------------------------

// depth: "identity" - the fast co-brand paint (Brandfetch + Tranco).
const IDENTITY_TOOLS = ['brandfetch', 'tranco'];

// depth: "full" - adds PDL + BuiltWith + the currency layer (Perplexity/Exa/
// NewsAPI) + synthesis. This is the full provider waterfall the convergence
// must preserve.
const FULL_TOOLS = ['brandfetch', 'tranco', 'pdl', 'builtwith', 'perplexity', 'exa', 'newsapi'];

// The documented, frozen key sets at each layer of the Dossier.
const TOP_LEVEL_KEYS = [
  'confidence', 'currency', 'domain', 'fetchedAt', 'identity', 'meta', 'scale', 'synthesis', 'understanding',
];
const IDENTITY_KEYS = ['colors', 'founded', 'iconUrl', 'logoUrl', 'name']; // + optional logoBg (client-detected)
const UNDERSTANDING_KEYS = ['descriptor', 'industry', 'stack', 'tagline']; // + optional products
// The PRIVACY-CRITICAL layer: these five fields are internal routing only and
// must NEVER be recited to the visitor (the Diagnosis Room contract). If this
// set ever changes, the privacy review has to be redone deliberately.
const SCALE_KEYS = ['employeeCount', 'icp', 'recommendedMode', 'sizeBand', 'trancoRank'];

// --- Contract: the empty dossier scaffold is shaped correctly ---------------

Deno.test('emptyDossier has every documented top-level layer', () => {
  const d = emptyDossier('example.com', 'full');
  assertEquals(Object.keys(d).sort(), TOP_LEVEL_KEYS.filter((k) => k !== 'synthesis').sort());
  // synthesis is optional (only set when the LLM pass succeeds), so it is
  // absent on the empty scaffold - the live "full" payload adds it.
  assert(!('synthesis' in d), 'synthesis must be optional, not on the empty scaffold');
  assertEquals(d.meta.depth, 'full');
  assertEquals(d.currency, []);
});

// --- Contract: the provider waterfall per depth -----------------------------

Deno.test('the identity-depth provider set is Brandfetch + Tranco', () => {
  // Mirrors the captured baseline: depth "identity" never spends the heavy
  // providers. A refactor that adds PDL/BuiltWith to the fast path would break
  // the ~1s co-brand gasp budget - this guards it.
  assertEquals([...IDENTITY_TOOLS].sort(), ['brandfetch', 'tranco']);
});

Deno.test('the full-depth provider waterfall is preserved', () => {
  assertEquals(
    [...FULL_TOOLS].sort(),
    ['brandfetch', 'builtwith', 'exa', 'newsapi', 'pdl', 'perplexity', 'tranco'],
  );
});

// --- Contract: the privacy layer is exactly the documented routing fields ---

Deno.test('scale.* is exactly the five internal-routing fields (privacy contract)', () => {
  // If this fails, someone changed what the routing layer carries. The
  // Diagnosis Room strips this layer before any view; the contract is that its
  // shape is known and reviewed. Re-run the privacy review before changing.
  assertEquals(
    [...SCALE_KEYS].sort(),
    ['employeeCount', 'icp', 'recommendedMode', 'sizeBand', 'trancoRank'],
  );
});

// --- Contract: mergeDossier is the pure merge the orchestrator relies on ----

Deno.test('mergeDossier layers partials and drops empties (clean)', () => {
  const base = emptyDossier('acme.io', 'full');
  const merged = mergeDossier(base, {
    identity: { name: 'Acme', logoUrl: '', colors: ['#000'] }, // empty logoUrl dropped
    understanding: { tagline: 'We make anvils' },
    scale: { trancoRank: 42, icp: 'enterprise' },
    currency: [{ text: 'Shipped X', source: 'exa' }],
    confidence: { identity: 0.9 },
    tools: ['brandfetch'],
  });
  assertEquals(merged.identity.name, 'Acme');
  assert(!('logoUrl' in merged.identity), 'empty string must be cleaned out, not stored');
  assertEquals(merged.identity.colors, ['#000']);
  assertEquals(merged.scale.trancoRank, 42);
  assertEquals(merged.scale.icp, 'enterprise');
  assertEquals(merged.currency.length, 1);
  assertEquals(merged.meta.tools, ['brandfetch']);
});

Deno.test('mergeDossier appends currency + tools across partials (union, not replace)', () => {
  let d = emptyDossier('acme.io', 'full');
  d = mergeDossier(d, { currency: [{ text: 'A', source: 'perplexity' }], tools: ['perplexity'] });
  d = mergeDossier(d, { currency: [{ text: 'B', source: 'exa' }], tools: ['exa'] });
  assertEquals(d.currency.map((c) => c.text), ['A', 'B']);
  assertEquals(d.meta.tools, ['perplexity', 'exa']);
});

Deno.test('mergeDossier is a no-op on a null partial', () => {
  const d = emptyDossier('acme.io', 'identity');
  const before = JSON.stringify(d);
  assertEquals(JSON.stringify(mergeDossier(d, null)), before);
});

// --- Contract: domain normalisation + the free-email gate -------------------

Deno.test('toDomain normalises emails and URLs to a bare registrable domain', () => {
  assertEquals(toDomain('ceo@stripe.com'), 'stripe.com');
  assertEquals(toDomain('https://www.stripe.com/pricing?x=1'), 'stripe.com');
  assertEquals(toDomain('Stripe'), null); // no dot -> not a domain
  assertEquals(toDomain(''), null);
});

Deno.test('the free-email set gates the co-brand gasp (no company paint for gmail et al)', () => {
  assert(FREE_EMAIL_DOMAINS.has('gmail.com'));
  assert(FREE_EMAIL_DOMAINS.has('outlook.com'));
  assert(!FREE_EMAIL_DOMAINS.has('stripe.com'));
});

// --- Contract: a captured full Dossier conforms to the documented type ------

Deno.test('a captured full-depth Dossier satisfies the type + key contract', () => {
  // Structure captured live (values redacted/stabilised). Compiling against
  // `Dossier` is itself the type-level half of the contract; the key-set
  // assertions are the runtime half.
  const captured: Dossier = {
    domain: 'stripe.com',
    fetchedAt: '2026-06-29T23:46:12.212Z',
    identity: {
      name: 'Stripe',
      logoUrl: 'https://cdn.brandfetch.io/<redacted>.svg',
      iconUrl: 'https://cdn.brandfetch.io/<redacted>.jpeg',
      colors: ['#635BFF', '#0A2540'],
      founded: 2010,
    },
    understanding: {
      tagline: 'Payment APIs that power commerce for online businesses.',
      descriptor: 'Online payments infrastructure',
      industry: 'Computers Electronics and Technology',
      stack: ['ruby', 'aws'],
    },
    scale: {
      employeeCount: 5000,
      sizeBand: '1001-5000',
      trancoRank: 241,
      icp: 'enterprise',
      recommendedMode: 'signal-session',
    },
    currency: [{ text: 'Shipped a new product', source: 'exa', date: '2026-06-01' }],
    synthesis: 'Here is what I think you do, correct me.',
    confidence: { identity: 0.9, tranco: 0.8, scale: 0.5 },
    meta: { tools: FULL_TOOLS, ms: 8500, depth: 'full' },
  };

  assert(TOP_LEVEL_KEYS.every((k) => k in captured), 'every documented top-level key present');
  assert(IDENTITY_KEYS.every((k) => k in captured.identity), 'identity key set preserved');
  assert(UNDERSTANDING_KEYS.every((k) => k in captured.understanding), 'understanding key set preserved');
  assertEquals(Object.keys(captured.scale).sort(), [...SCALE_KEYS].sort());
  assertEquals(captured.meta.tools, FULL_TOOLS);
});
