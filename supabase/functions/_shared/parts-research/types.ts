import type { CompleteTextInput } from "../enrich/llm.ts";
import type { EnrichRuntime } from "../enrich/runtime.ts";

export const PART = "fact-check-board-update" as const;
export const SCHEMA = "mindmake.research-pack/1" as const;
export const MAX_BYTES = 200_000;
export const MAX_SOURCE_BYTES = 300_000;
export const MAX_FILING_BYTES = 20_000_000;
export const MAX_PDF_BYTES = 5_000_000;
export const CHIPS = {
  "monthly-board-pack": "Monthly board pack",
  "investor-update": "Investor update",
  "results-commentary": "Results commentary",
  "lender-update": "Funding or lender update",
} as const;
export type Chip = keyof typeof CHIPS;
export type Check = {
  check:
    | "website"
    | "work-email-domain"
    | "companies-house"
    | "sec-edgar"
    | "brand-registry";
  detail: string;
  url: string;
};
export type Registry = {
  authority: "Companies House" | "SEC";
  id: string;
  status: string;
  url: string;
};
export type Candidate = {
  name: string;
  domain: string;
  logoUrl?: string;
  checks: Check[];
  registry: Registry | null;
};
export type Company = {
  name: string;
  domain: string;
  verified: boolean;
  verifiedBy: Check[];
  registry: Registry | null;
  sector?: string;
};
export type Buyer = {
  company: string;
  role: string;
  useCase: Chip;
  useCaseLabel: string;
};
export type PeriodFields = {
  periodType: "quarter" | "year-to-date" | "year" | "instant" | null;
  periodStart: string | null;
  periodEnd: string | null;
};
export type Source = {
  documentPeriod?: string;
  documentPeriodStart?: string;
  documentPeriodEnd?: string;
  registryCompanyNumber?: string;
  chunkExtraction?: boolean;
  title: string;
  publisher: string;
  url: string;
  published: string | null;
  retrievedAt: string;
  text: string;
  category: "website" | "coverage" | "registry" | "filing";
  /** Literal, individually retained JSON spans; a quote may not bridge redactions. */
  fragments?: string[];
  excerpted?: boolean;
  xbrl?: {
    quote: string;
    metric: string;
    value: number;
    unit: Fact["unit"];
    period: string;
    statement: string;
    published: string;
    periodType: PeriodFields["periodType"];
    periodStart: string | null;
    periodEnd: string | null;
  }[];
};
export type FactMetadata = Record<
  string,
  { significance?: 1 | 2 | 3; periodSource?: "quote" | "document" }
>;
export type Fact = Partial<PeriodFields> & {
  id: string;
  kind: "reported-figure" | "announcement" | "leadership" | "registry";
  statement: string;
  value: number | null;
  unit: "GBP" | "USD" | "%" | "people" | null;
  period: string | null;
  quote: string;
  source: Pick<Source, "title" | "publisher" | "url" | "published">;
  retrievedAt: string;
  grade: "primary" | "secondary";
  metric?: string;
  aliases?: string[];
};
export type ProposedFact = Partial<PeriodFields> & {
  significance?: 1 | 2 | 3;
  periodSource?: "quote" | "document";
  kind: Fact["kind"];
  statement: string;
  value: number | null;
  unit: Fact["unit"];
  period: string | null;
  quote: string;
  sourceUrl: string;
  personalData?: boolean;
  leadership?: { name: string; title: string };
  metric?: string;
  aliases?: string[];
};
export type Question = { question: string; because: string[] };
export type Pack = {
  schema: typeof SCHEMA;
  part: typeof PART;
  builtAt: string;
  buyer: Buyer;
  company: Company;
  facts: Fact[];
  notFound: string[];
  prepare: Question[];
};
export type Counts = {
  sourcesFetched: number;
  factsProposed: number;
  factsKept: number;
  factsDropped: number;
  dropped: Record<string, number>;
};
/** Kept beside a pack locally, never added to the buyer's bundle. */
export type Evidence = {
  factMetadata?: FactMetadata;
  droppedProposals?: { quote: string; reason: string }[];
  builtAt: string;
  company: Company;
  sources: Source[];
  verifiedFacts: Fact[];
  counts: Counts;
  fetches?: FetchOutcome[];
  extractions?: ExtractionOutcome[];
  identityProbes?: {
    url: string;
    attempt: number;
    ms: number;
    outcome: string;
  }[];
};
export type FetchOutcome = {
  url: string;
  status: number | null;
  bytes: number;
  kept: boolean;
  reason: string;
};
export type ExtractionOutcome = {
  reason?: string;
  sourceUrl: string;
  provider: string;
  model: string;
  ms: number;
  inputCharacters: number;
  outputCharacters: number;
  parseStatus: "ok" | "truncated" | "failed";
  factsKept: number;
};
export type Dependencies = {
  deadline?: number;
  gatheredSources?: Source[];
  extractions?: ExtractionOutcome[];
  identityProbes?: NonNullable<Evidence["identityProbes"]>;
  fetch: typeof fetch;
  env(name: string): string | undefined;
  now(): Date;
  /** Resolve before a public web fetch. Production checks every returned IP. */
  resolveHost(host: string): Promise<string[]>;
  identifyTimeoutMs?: number;
  fetchOutcomes?: FetchOutcome[];
  extractPdf?: (
    bytes: Uint8Array,
    options?: { maxPages?: number },
  ) => Promise<string>;
  complete?: (
    input: CompleteTextInput,
    runtime: EnrichRuntime,
  ) => Promise<string | null>;
};
