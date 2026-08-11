/**
 * Canonical public-facing facts for the two advisory offers.
 *
 * SINGLE SOURCE OF TRUTH. Every price, in every currency, is an explicit
 * literal in this file. Nothing derives a price from another price.
 * `src/test/price-single-source.test.ts` fails the build if a price string
 * appears anywhere else in src/, public/, scripts/ or index.html.
 *
 * THESE ARE SET PRICES PER MARKET. GBP is not USD converted. AUD is not USD
 * converted. Each figure is a deliberate round number a buyer in that market
 * would find normal. There is no FX logic in this repo and there must never
 * be: a rate lookup would make the published price a function of the
 * morning's spot rate, which is not what was sold, and would silently change
 * a number a client is holding a proposal for. If you came here to add a
 * converter, the answer is no. Edit the literals.
 *
 * Imported three ways, and all three have to keep working:
 *   1. Vite / React     import { HANDOVER } from "@/lib/offers"
 *   2. Vitest           same
 *   3. Plain Node       import { HANDOVER } from "../src/lib/offers.ts"
 *                       (scripts/prerender.mjs, scripts/generate-llms.mjs)
 *
 * (3) is the constraint that shapes this file: NO imports, NO "@/" alias, NO
 * runtime dependency, and only ERASABLE TypeScript (types, interfaces,
 * `as const`, `satisfies`). No enums, no namespaces, no parameter properties,
 * no decorators. Node's native type stripping blanks type syntax rather than
 * compiling it, so anything that emits code at runtime breaks the build.
 */

/*
 * TODO(krish): confirm all twelve figures before shipping. The USD column is
 * the canonical one and the GBP and AUD columns are proposals. They are close
 * to market rates but they are set prices, not conversions, so sanity check
 * each one as a number a buyer in that market would find normal.
 *
 *                        USD        GBP        AUD
 *   Teardown             $9,500     £7,500     $14,500
 *   Handover  <100       $18,000    £14,000    $27,500
 *   Handover  100-250    $30,000    £23,500    $45,500
 *   Handover  250-5,000  $50,000    £39,000    $76,000
 */

export type Currency = "USD" | "GBP" | "AUD";

export const CURRENCIES = ["USD", "GBP", "AUD"] as const;

/**
 * The currency every non-interactive surface states: prerendered crawler
 * bodies, llms.txt, and structured data. A visitor seeing another currency
 * has clicked a switcher in their own browser.
 */
export const DEFAULT_CURRENCY: Currency = "USD";

export interface CurrencyMeta {
  readonly code: Currency;
  /** Switcher face. */
  readonly label: string;
  /** Accessible name. "AUD" read aloud is ambiguous; "Australian dollars" is not. */
  readonly aria: string;
}

export const CURRENCY_META: Readonly<Record<Currency, CurrencyMeta>> = {
  USD: { code: "USD", label: "USD", aria: "US dollars" },
  GBP: { code: "GBP", label: "GBP", aria: "British pounds" },
  AUD: { code: "AUD", label: "AUD", aria: "Australian dollars" },
};

/**
 * One price in one currency, stated twice on purpose.
 *
 * `display` is the exact string printed to a human and is authoritative for
 * copy. `amount` is the bare number for structured data. Never derive one
 * from the other at runtime: a formatter is one refactor away from being a
 * converter, and `offers.test.ts` asserts the two agree.
 */
export interface Price {
  readonly display: string;
  readonly amount: number;
}

export type PriceSet = Readonly<Record<Currency, Price>>;

export interface PriceTier {
  readonly id: string;
  /** Rendered beside the price. A headcount or a scope, never a price. */
  readonly label: string;
  readonly prices: PriceSet;
}

/**
 * What the engagement systematically captures and retains.
 *
 * INTERNAL ONLY. This never appears in customer-facing copy, and
 * `src/test/offers-collects-internal.test.tsx` renders both offer pages and
 * fails if any of it reaches the DOM.
 *
 * It lives in the offer definition rather than a process document because a
 * process document does not get read. Every engagement page, proposal and
 * internal handoff resolves through this object, so the capture requirement
 * travels with the offer instead of depending on someone remembering it.
 *
 * The reason it exists: advisory that produces only fees is a day rate with
 * extra steps. What makes the practice worth something later is the one
 * structured thing it accumulates that nobody else can assemble.
 */
export interface OfferCollects {
  /** How the client priced and packaged before the engagement touched it. */
  readonly pricingAndPackaging: string;
  /** What actually converted, and the evidence it converted on. */
  readonly whatConverted: string;
  /** What had to change, and what changing it cost them. */
  readonly whatHadToChange: string;
  /** The commercial constraint the answer had to live inside. */
  readonly commercialConstraint: string;
  /** Where it is held, and in what form it is retained. */
  readonly retention: string;
}

export interface Offer {
  readonly id: "teardown" | "handover";
  readonly name: string;
  readonly path: string;
  /** Single-price offers carry exactly one tier. */
  readonly tiers: readonly PriceTier[];
  readonly collects: OfferCollects;
}

export const TEARDOWN: Offer = {
  id: "teardown",
  name: "The Teardown",
  path: "/teardown",
  tiers: [
    {
      id: "flat",
      label: "fixed. One decision.",
      prices: {
        USD: { display: "$9,500", amount: 9500 },
        GBP: { display: "£7,500", amount: 7500 },
        AUD: { display: "$14,500", amount: 14500 },
      },
    },
  ],
  collects: {
    pricingAndPackaging:
      "The price the decision was already carrying: current list, what is actually realised, the discount ladder in practice, and what is bundled rather than billed.",
    whatConverted:
      "Which claim, once tested against evidence, actually moved the decision, and which reliability tier moved it.",
    whatHadToChange:
      "The belief that did not survive contact with evidence, and what else in the business was resting on it.",
    commercialConstraint:
      "The boundary the answer had to fit inside: budget, board date, contract term, or headcount already committed.",
    retention:
      "The client keeps the decision map in their CTRL workspace. Retained internally as an anonymised pattern only, never as an identifiable account.",
  },
};

export const HANDOVER: Offer = {
  id: "handover",
  name: "The Handover",
  path: "/handover",
  tiers: [
    {
      id: "under-100",
      label: "under 100 people",
      prices: {
        USD: { display: "$18,000", amount: 18000 },
        GBP: { display: "£14,000", amount: 14000 },
        AUD: { display: "$27,500", amount: 27500 },
      },
    },
    {
      id: "100-250",
      label: "100 to 250 people",
      prices: {
        USD: { display: "$30,000", amount: 30000 },
        GBP: { display: "£23,500", amount: 23500 },
        AUD: { display: "$45,500", amount: 45500 },
      },
    },
    {
      id: "250-5000",
      label: "250 to 5,000 people",
      prices: {
        USD: { display: "$50,000", amount: 50000 },
        GBP: { display: "£39,000", amount: 39000 },
        AUD: { display: "$76,000", amount: 76000 },
      },
    },
  ],
  collects: {
    pricingAndPackaging:
      "The full commercial architecture as found: list, floor, packaging, and every exception sales was quietly granting to close.",
    whatConverted:
      "Which repositioning produced a signed outcome, at what cycle length, against which competitor.",
    whatHadToChange:
      "The go-to-market assumption that had to be abandoned, and what the organisation had built on top of it.",
    commercialConstraint:
      "The constraint that survived the rebuild: margin floor, channel conflict, contract obligations, or the headcount the plan assumed.",
    retention:
      "The client owns the system at exit. Retained internally as an anonymised pattern only, never as an identifiable account.",
  },
};

/**
 * Anchoring order. The larger number is presented first everywhere, so every
 * comparison surface has said the Handover before it says the Teardown.
 */
export const OFFERS: readonly Offer[] = [HANDOVER, TEARDOWN];

/** Stated publicly on purpose: the cap is part of the offer, not a scarcity device. */
export const HANDOVER_ANNUAL_CAP = 6;

/**
 * How Mindmaker describes itself. Honest to a buyer, and it is also the frame
 * that stops the practice reading as something other than a deliberate choice.
 */
export const PRACTICE_DESCRIPTION =
  "Mindmaker is a capped advisory practice. A small number of engagements a year.";

/*
 * DELIBERATELY ABSENT: any published discount.
 *
 * Two used to live here.
 *
 * A credit escalator (each rung coming off the price of the next) was
 * proposed and rejected. It existed to bridge an 8.6x gap between the old
 * Teardown price and the old Handover entry. After the August 2026 reprice
 * the gap is under 2x, so it has no work left to do.
 *
 * A published "20% off if you let me write about the work" sat on both rungs
 * and was removed at the same time. At the current prices that was a fifth
 * of a Handover, advertised before any conversation had happened.
 *
 * Both are now discretionary closing tools Krish can offer on a call. That is
 * the whole point: a published discount trains every buyer to wait for it,
 * and a card he plays is worth more than a discount everyone expects. Do not
 * reintroduce either to the site, the FAQ, or Mindy's knowledge base.
 */

// Lookup and formatting. All pure, all dependency-free.

export function isCurrency(value: unknown): value is Currency {
  return value === "USD" || value === "GBP" || value === "AUD";
}

/** Case-insensitive parse for URL params and cookies. Returns null rather than guessing. */
export function parseCurrency(value: string | null | undefined): Currency | null {
  if (!value) return null;
  const upper = value.trim().toUpperCase();
  return isCurrency(upper) ? upper : null;
}

export function tierOf(offer: Offer, tierId?: string): PriceTier {
  const tier = tierId ? offer.tiers.find((t) => t.id === tierId) : offer.tiers[0];
  if (!tier) throw new Error(`Unknown tier "${tierId}" on offer "${offer.id}"`);
  return tier;
}

export function priceOf(offer: Offer, currency: Currency, tierId?: string): Price {
  return tierOf(offer, tierId).prices[currency];
}

/** The only function that should ever produce a price string for a human. */
export function displayPrice(offer: Offer, currency: Currency, tierId?: string): string {
  return priceOf(offer, currency, tierId).display;
}

/** Lowest tier, for "from X" copy. */
export function entryPrice(offer: Offer, currency: Currency): Price {
  return offer.tiers
    .map((t) => t.prices[currency])
    .reduce((a, b) => (b.amount < a.amount ? b : a));
}

/**
 * Every published price string, flattened.
 *
 * The single-source test derives its search terms from here rather than
 * hard-coding them, so the test cannot drift from the data: add a price and
 * it starts being guarded on the same commit.
 */
export function allPriceDisplays(): readonly string[] {
  const out: string[] = [];
  for (const offer of OFFERS) {
    for (const tier of offer.tiers) {
      for (const currency of CURRENCIES) out.push(tier.prices[currency].display);
    }
  }
  return out;
}

/**
 * Structured data for one offer. Exactly ONE offer node, priced in
 * DEFAULT_CURRENCY only.
 *
 * Never one node per currency: three Offer nodes for the same service at
 * three prices reads to a parser as three products and to a rich-results
 * validator as a conflict. The other two currencies are a convenience in the
 * visitor's browser, not a catalogue.
 */
export function offerJsonLd(offer: Offer, site: string): Record<string, unknown> {
  const usd = offer.tiers.map((t) => t.prices[DEFAULT_CURRENCY]);
  const url = site + offer.path;

  const offers =
    usd.length === 1
      ? {
          "@type": "Offer",
          url,
          price: String(usd[0].amount),
          priceCurrency: DEFAULT_CURRENCY,
          availability: "https://schema.org/InStock",
        }
      : {
          "@type": "AggregateOffer",
          url,
          priceCurrency: DEFAULT_CURRENCY,
          lowPrice: String(Math.min(...usd.map((p) => p.amount))),
          highPrice: String(Math.max(...usd.map((p) => p.amount))),
          offerCount: usd.length,
        };

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: offer.name,
    url,
    provider: { "@type": "Person", name: "Krish Raja", url: site },
    offers,
  };
}
