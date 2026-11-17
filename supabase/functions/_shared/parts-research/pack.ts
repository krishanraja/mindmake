import { generateQuestions, validQuestion } from "./questions.ts";
import { tableMatch } from "./tables.ts";
import { businessStatement } from "./narrative.ts";
import { canonicalPeriod, quoteValue, xbrlStatement } from "./figures.ts";
import { registryStatement } from "./registry-text.ts";
import {
  type Buyer,
  CHIPS,
  type Company,
  type Dependencies,
  type Evidence,
  type Fact,
  MAX_BYTES,
  MAX_SOURCE_BYTES,
  type Pack,
  PART,
  SCHEMA,
} from "./types.ts";
import { independentChecks } from "./identify.ts";
import { gather, ownDomain, registrySource } from "./gather.ts";
import { extract, olderThan24Months, prepare, verifyFacts } from "./facts.ts";
import { normalise, publicUrl, within } from "./transport.ts";

function require(condition: unknown, reason: string): asserts condition {
  if (!condition) throw new Error(`Invalid research pack: ${reason}`);
}
function fields(
  value: unknown,
  required: string[],
  optional: string[] = [],
): asserts value is Record<string, unknown> {
  require(
    value && typeof value === "object" && !Array.isArray(value),
    "object required",
  );
  const keys = Object.keys(value);
  require(
    required.every((k) => keys.includes(k)) &&
      keys.every((k) => required.includes(k) || optional.includes(k)),
    "fields do not match the contract",
  );
}
const text = (v: unknown, max = 2000): v is string =>
  typeof v === "string" && v.trim().length > 0 && v.length <= max;
const date = (v: unknown): v is string =>
  typeof v === "string" &&
  /^\d{4}-\d{2}-\d{2}(?:T[\d:.]+(?:Z|[+-]\d{2}:\d{2}))?$/.test(v) &&
  Number.isFinite(Date.parse(v));
const same = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b);

/** Evidence is mandatory for facts. A pack alone cannot prove that its URLs were fetched. */
export function validatePack(
  input: unknown,
  evidence?: Evidence,
): asserts input is Pack {
  require(
    new TextEncoder().encode(JSON.stringify(input)).length <= MAX_BYTES,
    "exceeds 200 KB",
  );
  fields(input, [
    "schema",
    "part",
    "builtAt",
    "buyer",
    "company",
    "facts",
    "notFound",
    "prepare",
  ]);
  require(
    input.schema === SCHEMA && input.part === PART && date(input.builtAt) &&
      input.builtAt.includes("T"),
    "schema, part or build date",
  );
  fields(input.buyer, ["company", "role", "useCase", "useCaseLabel"]);
  require(
    text(input.buyer.company, 200) && text(input.buyer.role, 160) &&
      typeof input.buyer.useCase === "string" &&
      Object.hasOwn(CHIPS, input.buyer.useCase),
    "buyer or use case",
  );
  require(
    input.buyer.useCaseLabel ===
      CHIPS[input.buyer.useCase as keyof typeof CHIPS],
    "use case label",
  );
  fields(input.company, [
    "name",
    "domain",
    "verified",
    "verifiedBy",
    "registry",
  ], ["sector"]);
  const company = input.company as Company;
  require(
    text(company.name, 200) && typeof company.domain === "string" &&
      typeof company.verified === "boolean" &&
      Array.isArray(company.verifiedBy) && company.verifiedBy.length <= 5,
    "company",
  );
  if (Object.hasOwn(company, "sector")) {
    require(
      text(company.sector, 160) &&
        evidence?.sources.some((source) =>
          (ownDomain(company, source.url) ||
            registrySource(company, source.url)) &&
          normalise(source.text).includes(normalise(company.sector!))
        ),
      "sector has no source",
    );
  }
  if (company.domain) {
    require(
      publicUrl(`https://${company.domain}/`).hostname === company.domain,
      "bare company domain",
    );
  }
  const checks = new Set<string>();
  for (const c of company.verifiedBy) {
    fields(c, ["check", "detail", "url"]);
    require(
      [
        "website",
        "work-email-domain",
        "companies-house",
        "sec-edgar",
        "brand-registry",
      ].includes(c.check) && !checks.has(c.check) && text(c.detail) &&
        text(c.url),
      "identity check",
    );
    const u = publicUrl(c.url);
    checks.add(c.check);
    if (["website", "work-email-domain"].includes(c.check)) {
      require(ownDomain(company, c.url), "identity domain mismatch");
    }
    if (c.check === "brand-registry") {
      require(
        u.hostname === "api.brandfetch.io" &&
          u.pathname === `/v2/brands/${company.domain}`,
        "brand identity mismatch",
      );
    }
    if (c.check === "companies-house") {
      require(
        u.hostname === "find-and-update.company-information.service.gov.uk",
        "register URL",
      );
    }
    if (c.check === "sec-edgar") {
      require(u.hostname === "www.sec.gov", "register URL");
    }
  }
  if (company.registry !== null) {
    fields(company.registry, ["authority", "id", "status", "url"]);
    require(
      ["Companies House", "SEC"].includes(company.registry.authority) &&
        text(company.registry.id) && text(company.registry.status) &&
        text(company.registry.url),
      "registry",
    );
    publicUrl(company.registry.url);
    require(
      company.registry.authority === "SEC"
        ? /^\d{10}$/.test(company.registry.id)
        : /^[A-Z0-9]{8}$/i.test(company.registry.id),
      "registry id",
    );
  }
  require(
    !company.verified ||
      company.domain && independentChecks({ checks: company.verifiedBy }),
    "company needs two independent checks",
  );
  require(
    Array.isArray(input.facts) && input.facts.length <= 40 &&
      Array.isArray(input.prepare) && input.prepare.length <= 8 &&
      Array.isArray(input.notFound) && input.notFound.every((v) => text(v)),
    "array caps",
  );
  // Empty evidence is the conservative general version for unresolved identity.
  require(
    company.verified ||
      input.facts.length === 0 && input.prepare.length === 0 &&
        input.notFound.some((s) => /general version/i.test(s)),
    "unverified company must remain the general version",
  );
  if (input.facts.length) {
    require(
      evidence && evidence.builtAt === input.builtAt &&
        same(evidence.company, company) && Array.isArray(evidence.sources) &&
        evidence.sources.length <= 15 && Array.isArray(evidence.verifiedFacts),
      "missing build verification",
    );
  }
  const ids = new Set<string>();
  for (const raw of input.facts) {
    fields(raw, [
      "id",
      "kind",
      "statement",
      "value",
      "unit",
      "period",
      "quote",
      "source",
      "retrievedAt",
      "grade",
    ], [
      "metric",
      "aliases",
      "periodType",
      "periodStart",
      "periodEnd",
      "periodSource",
    ]);
    const fact = raw as Fact;
    require(/^F[1-9]\d*$/.test(fact.id) && !ids.has(fact.id), "fact id");
    ids.add(fact.id);
    require(
      ["reported-figure", "announcement", "leadership", "registry"].includes(
        fact.kind,
      ) && text(fact.statement) && text(fact.quote, 1600),
      "fact or quote missing",
    );
    require(
      !(fact.statement.trimStart().startsWith("{") ||
        fact.statement.trimStart().startsWith("[") ||
        /^"\w+"\s*:/.test(fact.statement.trimStart())),
      "statement is not plain text",
    );
    require(
      fact.value === null ||
        typeof fact.value === "number" && Number.isFinite(fact.value),
      "fact value",
    );
    require(
      [null, "GBP", "USD", "%", "people"].includes(fact.unit) &&
        (fact.period === null || text(fact.period)),
      "unit or period",
    );
    if (fact.kind === "reported-figure") {
      require(
        text(fact.metric, 160) && fact.metric === fact.metric.toLowerCase() &&
          Array.isArray(fact.aliases) && fact.aliases.length <= 8 &&
          fact.aliases.every((a) => text(a, 100) && a === a.toLowerCase()),
        "figure metric or aliases",
      );
      require(
        [null, "quarter", "year-to-date", "year", "instant"].includes(
          fact.periodType === undefined ? "missing" : fact.periodType,
        ) &&
          (fact.periodStart === null ||
            typeof fact.periodStart === "string" &&
              /^\d{4}-\d{2}-\d{2}$/.test(fact.periodStart)) &&
          (fact.periodEnd === null ||
            typeof fact.periodEnd === "string" &&
              /^\d{4}-\d{2}-\d{2}$/.test(fact.periodEnd)),
        "figure period fields",
      );
      require(
        !fact.aliases?.some((a) => ["cash", "income", "users"].includes(a)),
        "ambiguous alias",
      );
      require(
        fact.period === null || canonicalPeriod(fact.period) === fact.period,
        "figure period",
      );
      require(
        fact.value === quoteValue(fact.quote, fact.metric!, fact.unit) ||
          !!tableMatch(
            evidence!.sources.find((s) => s.url === fact.source.url),
            fact,
          ),
        "figure value must come from quote",
      );
    }
    if (fact.periodSource) {
      require(
        ["quote", "document"].includes(fact.periodSource),
        "period source",
      );
    }
    fields(fact.source, ["title", "publisher", "url", "published"]);
    require(
      text(fact.source.title) && text(fact.source.publisher) &&
        text(fact.source.url) &&
        (fact.source.published === null || date(fact.source.published)),
      "source metadata missing",
    );
    publicUrl(fact.source.url);
    const source = evidence!.sources.find((s) => s.url === fact.source.url);
    require(
      source &&
        new TextEncoder().encode(source.text).length <=
          (source.excerpted ? MAX_SOURCE_BYTES : MAX_BYTES) &&
        date(source.retrievedAt) && source.retrievedAt.includes("T"),
      "source not fetched",
    );
    if (source.xbrl?.length) {
      const row = source.xbrl.find((x) =>
        x.quote === fact.quote && x.metric === fact.metric
      );
      require(
        row && row.period === fact.period &&
          row.periodType === fact.periodType &&
          row.periodStart === fact.periodStart &&
          row.periodEnd === fact.periodEnd,
        "XBRL measure or period changed",
      );
    }
    require(
      date(fact.retrievedAt) && fact.retrievedAt === source.retrievedAt &&
        Date.parse(fact.retrievedAt) <= Date.parse(input.builtAt) &&
        Date.parse(input.builtAt) - Date.parse(fact.retrievedAt) < 300_000,
      "source not from this build",
    );
    if (fact.periodSource === "document") {
      require(
        fact.period === source.documentPeriod && !!source.documentPeriod,
        "document period changed",
      );
    }
    require(
      same(fact.source, {
        title: source.title,
        publisher: source.publisher,
        url: source.url,
        published: source.xbrl?.find((x) =>
          x.quote === fact.quote && x.metric === fact.metric
        )?.published ?? source.published,
      }),
      "source metadata was changed",
    );
    require(
      normalise(source.text).includes(normalise(fact.quote)) &&
        (normalise(fact.statement) === normalise(fact.quote) ||
          !!tableMatch(source, fact) ||
          (ownDomain(company, source.url) ||
              registrySource(company, source.url)) &&
            fact.statement === businessStatement(fact.quote) ||
          registrySource(company, source.url) &&
            fact.statement ===
              (xbrlStatement(source, fact) ?? registryStatement(fact))),
      "quote does not support this fact",
    );
    require(
      same(fact, evidence!.verifiedFacts.find((f) => f.id === fact.id)),
      "fact has no verification receipt",
    );
    require(
      !source.fragments ||
        source.fragments.some((span) =>
          normalise(span).includes(normalise(fact.quote))
        ),
      "quote bridges source redactions",
    );
    require(
      fact.kind !== "registry" || registrySource(company, source.url),
      "registry exemption misused",
    );
    require(
      fact.kind === "registry" ||
        !olderThan24Months(
          source.published,
          fact.period,
          new Date(input.builtAt),
        ),
      "over-age fact",
    );
    require(
      fact.grade ===
        (ownDomain(company, source.url) || registrySource(company, source.url)
          ? "primary"
          : "secondary"),
      "source grade",
    );
  }
  for (const q of input.prepare) {
    fields(q, ["question", "because"]);
    require(
      validQuestion(q, input.facts),
      "question subject, figures or citations invalid",
    );
    require(
      text(q.question) && q.question.endsWith("?") &&
        Array.isArray(q.because) && q.because.length > 0 &&
        q.because.every((id) => ids.has(id)),
      "question must cite real fact ids",
    );
  }
}

export async function buildPack(
  company: Company,
  buyer: Buyer,
  deps: Dependencies,
) {
  if (!Object.hasOwn(CHIPS, buyer.useCase)) throw new Error("Unknown use case");
  // Gather enriches the local company with a filing-backed registry binding.
  company = structuredClone(company);
  deps = {
    ...deps,
    deadline: deps.deadline ?? performance.now() + 240000,
    fetchOutcomes: deps.fetchOutcomes ?? [],
    extractions: deps.extractions ?? [],
    gatheredSources: [],
  };
  const sources = await within(
    gather(company, buyer.useCase, deps),
    Math.max(0, deps.deadline! - performance.now()),
    deps.gatheredSources!,
  );
  const proposals = company.verified ? await extract(sources, buyer, deps) : [];
  const result = verifyFacts(proposals, sources, company, deps.now());
  for (const call of deps.extractions ?? []) {
    const last = deps.extractions?.filter((c) =>
      c.sourceUrl === call.sourceUrl && c.parseStatus !== "failed"
    ).at(-1);
    call.factsKept = call === last
      ? result.facts.filter((f) => f.source.url === call.sourceUrl).length
      : 0;
  }
  const { factsProposed, factsKept, factsDropped, dropped } = result;
  const counts = {
    sourcesFetched: sources.length,
    factsProposed,
    factsKept,
    factsDropped,
    dropped,
  };
  const recentCutoff = new Date(deps.now());
  recentCutoff.setUTCFullYear(recentCutoff.getUTCFullYear() - 1);
  const sparse = company.verified &&
    result.facts.filter((f) =>
        f.source.published &&
        Date.parse(f.source.published) >= recentCutoff.getTime() &&
        Date.parse(f.source.published) <= deps.now().getTime()
      ).length < 3;
  const pack: Pack = {
    schema: SCHEMA,
    part: PART,
    builtAt: deps.now().toISOString(),
    buyer: { ...buyer, useCaseLabel: CHIPS[buyer.useCase] },
    company,
    facts: result.facts,
    notFound: [],
    prepare: sparse ? [] : await generateQuestions(
      result.facts,
      buyer.role,
      buyer.useCase,
      deps,
      prepare(result.facts, buyer.role, buyer.useCase),
    ),
  };
  if (sparse) {
    pack.notFound.push(
      `Little has been published about ${company.name} in the last 12 months, so this check leans on your own evidence.`,
    );
  }
  if (!company.verified) {
    pack.notFound.push(
      "The company identity could not be verified. This is the general version.",
    );
  }
  if (
    !result.facts.some((f) =>
      f.metric === "revenue" || /revenue/i.test(f.statement)
    )
  ) {
    pack.notFound.push(
      "No verified public revenue figure was found for this company.",
    );
  }
  if (!result.facts.length && company.verified) {
    pack.notFound.push(
      "No company facts passed the source and quote checks during this build.",
    );
  }
  if (result.facts.some((f) => f.source.published === null)) {
    pack.notFound.push(
      "Some sources give no publication date. Their age could not be established.",
    );
  }
  if (performance.now() >= deps.deadline!) {
    for (const outcome of deps.fetchOutcomes ?? []) {
      if (outcome.reason === "pending") {
        outcome.reason = "build-budget-exhausted";
      }
    }
  }
  const evidence: Evidence = {
    builtAt: pack.builtAt,
    company: structuredClone(company),
    sources,
    verifiedFacts: structuredClone(result.facts),
    fetches: structuredClone(deps.fetchOutcomes),
    extractions: structuredClone(deps.extractions),
    identityProbes: structuredClone(deps.identityProbes ?? []),
    counts,
    droppedProposals: result.droppedProposals,
  };
  validatePack(pack, evidence);
  return { pack, counts, evidence };
}
