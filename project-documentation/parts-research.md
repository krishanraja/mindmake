# Research inside the first part

The implementation authority is [Research Pack Contract v1.2](research-pack-contract.md),
based on the supplied v1.1 contract with the authorised v1.2 additions appended locally. The pilot is **Fact-check my board
update**. This module builds the purchase-time research artefact; it is not wired
to checkout, the website, the webhook, email or fulfilment. Website release state
remains in [website-redesign/STATE.md](website-redesign/STATE.md).

## Run locally

Use Deno with environment variables supplied by the operator. No `.env` file,
command-line key or embedded credential is read. The existing provider clients
use `BRANDFETCH_API_KEY`, `GOOGLE_AI_API_KEY`, `ANTHROPIC_API_KEY`,
`PERPLEXITY_API_KEY`, `EXA_API_KEY` and `NEWSAPI_API_KEY`.
`COMPANIES_HOUSE_API_KEY` enables UK registry checks. `SEC_CONTACT_EMAIL` is
required for SEC requests and becomes the contact in its User-Agent. No SEC key
is needed. A missing provider configuration skips that provider.

```powershell
deno run -A scripts/parts/research-run.ts --company "Company name" --domain company.example --email person@company.example --role "Finance director" --chip monthly-board-pack --out quality/parts/company-pack.json
deno run -A scripts/parts/personalise-bundle.ts --base path/to/part.mcpb --pack quality/parts/company-pack.json --out quality/parts/company-part.mcpb
```

The first command prints counts and the output path. Ambiguous identity prints
the candidates and exits 2 without writing a pack. Supply the chosen domain on
the next run. One incomplete identity produces an empty general version,
explicitly described in `notFound`. A supplied work email is a domain check, not
proof of control of its mailbox. Its local part is not written into the pack.

The runner writes the exact contract JSON and a companion
`<pack path>.evidence.json`. The companion contains the fetched, filtered source
text and the facts that passed verification. Keep it locally for the offline
bundle validation; it is **not** included in the `.mcpb`. The pack itself has no
additional schema fields. Neither file should be edited to bypass verification.
Existing output files are never overwritten. Create the output directory first.

The bundle step requires both files, checks the base manifest name
`mindmake-fact-check-board-update` and manifest version `0.3`, and adds only
`research/pack.json`. It copies every original local ZIP record and central
directory entry byte for byte. The new entry is stored, without compression.
Existing research packs, duplicate or unsafe paths, symlinks, encrypted entries,
split archives and ZIP64 are rejected. Classic stored/deflated archives up to
64 MB are supported. The companion evidence input is capped at 32 MB to accommodate
retained excerpts, literal fragments and fetch outcomes. No ZIP library was added.

## Stage contract

- `identify(input, deps)` reuses the enrichment identity-depth fan-out,
  Brandfetch and provenance checks. Its explicit `mode` defaults to `pre-payment` (2.7 seconds); `purchase` allows
  10 seconds and is selected by research-run.ts. Future fulfilment callers must
  pass `mode: "purchase"` too. Website and brand probes never await registry
  discovery. Successful SEC ticker responses are cached per worker transport
  for 24 hours; failed responses are not cached. Brand and
  registry search candidates are preserved, within provider result caps of ten
  per provider. It never treats a name-only search ranking as a buyer choice.
  Website probing starts alongside discovery and has up to 1.8 seconds within
  that deadline. Names are matched in the title, `og:site_name` and page text,
  ignoring trailing legal suffixes, including Group. An exact non-free work
  email domain is an independent check even when the website is unavailable.
  SEC `website` or `investorWebsite` can bind a domain; an `investors.` prefix
  on the latter is removed. Companies House binds only when the registered name
  matches and its company number appears on the company's website. Otherwise
  it stays a separate candidate and its facts are excluded.
- `gather(company, chip, deps)` fetches registry records, the company website,
  discovered news/press pages, and coverage URLs discovered by the existing
  Perplexity, Exa and NewsAPI clients. Exa and Perplexity cover the preceding
  twelve months; NewsAPI is restricted to at most the last 29 days and a 426
  response means provider unavailable. No recursive crawling or guessed news
  paths: only the supplied website, registry-listed filings and discovery URLs
  are fetched, plus their robots policies. Disallowed or unavailable robots
  policies prevent source fetching. When a verified website has one matching SEC issuer but both SEC
  website fields are empty, gather fetches the most recent 10-K or 10-Q primary
  document from submissions. It binds the issuer only if that document's text
  contains the exact company domain, and records the filing URL as the
  `sec-edgar` check. An absent domain or ambiguous issuer excludes its registry
  facts. Filing lookup never runs in identify. Gather enriches its company
  argument with this binding; buildPack clones its input first and persists the
  resulting identity in the pack and companion evidence.
  Search snippets and dates never become evidence. The fetched page's
  own publication metadata supplies its date or it stays null. Secondary
  coverage also needs the company name and a domain reference. Coverage without a source publication date, or older than twelve months, is excluded. Undated primary sources remain labelled as undated, not assumed fresh.
- Fifteen source page attempts remain the limit. Ordinary pages retain the
  200 KB raw cap; PDF downloads have a 5 MB cap. SEC filings and companyfacts
  can be read up to 20 MB. The separate SEC identity binding scan consumes at
  most 20 MB, keeps only a short overlap in memory and stores no document text.
  Filing extraction strips HTML and retains only literal spans around revenue,
  cash, subscribers, users, net income, guidance, employees and chip priorities,
  up to 300 KB of UTF-8 text. PDFs use the same bounded excerpt selection.
  Excerpted sources are marked in the local receipt, with separate fragments so
  quotes cannot bridge omitted passages. SEC companyfacts selects recent literal
  rows with their concept and unit context and supplies reported figures before
  model proposals. The SEC ticker discovery index remains capped at 8 MB.
- Every non-SEC request has the MindmakeResearch browser-compatible User-Agent
  and HTML/PDF Accept headers. Every SEC host gets the contact-based User-Agent,
  even before an issuer binds; absent contact configuration fails closed.
  Identity redirects stay within the candidate domain. Coverage redirects may
  move between subdomains of the requested registrable domain, determined by
  `npm:tldts@7.0.27` with private suffixes included. That dependency was already
  in package-lock.json. At most three hops, HTTPS and public DNS checks at every
  hop, one total timeout and no credential forwarding are enforced. 403s are
  recorded and skipped; there is no retry or anti-bot bypass.
- Registry officer names, addresses, birth dates and biographies do not reach
  the model or pack. Only corporate roles and dates are retained as literal
  source fragments. SEC concept names and units remain attached to their
  literal JSON evidence, with links to listed primary filings.
- `extract` calls the existing Gemini/Anthropic helper in opt-in JSON mode.
  This mode preserves supporting quotes instead of applying the prose scrub.
  Source documents are untrusted data, never instructions. Empty or malformed
  model output supplies no model-derived facts; deterministic SEC rows can still
  pass verification.
- `verifyFacts` checks source membership, normalised exact quotes, age, numeric
  values, units, reporting periods and personal-data restrictions. Statements
  are extractive, except for narrowly defined register/SEC templates verified
  against the quoted JSON. It deduplicates and caps at forty facts. Leadership
  output is restricted to a first-party name and title. Named-entity filtering
  is deliberately conservative and can discard useful material; it is not a
  general personal-data classifier. Each reported figure carries metric and
  at most eight lower-case aliases. Values are parsed from the verified quote,
  never trusted from model output: currency symbols, thousand/k, million/m,
  billion/bn and percentages are handled. Ambiguous or absent numbers stay null.
  Periods are FY2026, H1 2026, Q3 2026 or an ISO month, or null when unknown.
  Validation independently repeats the numeric check.
- `prepare` emits distinct questions grouped by evidence kind, tailored to the
  self-reported role and chip. Every question cites existing fact IDs. These
  questions are not facts. The chip labels are those in the contract and still
  await Krish's approval.
- `buildPack` records sources fetched, proposals, facts kept, facts dropped and
  counts by drop reason. Sources fetched counts admitted source texts, not API
  discovery calls or failed page attempts. `validatePack` enforces the contract,
  size caps and the accompanying build verification. The receipt is a local
  pipeline audit record, not an independently signed attestation. Its `fetches`
  array records each HTTP hop and blocked attempt: URL, status (null when no
  response), consumed bytes, kept flag and reason. Redirect bodies are cancelled,
  so zero bytes means no body consumed. Provider and identity responses are
  labelled separately from admitted sources. Credential query values are
  redacted; headers and keys are never written to this receipt.

Every transport, environment lookup, clock, resolver and model test double is
per-call injected. Existing enrichment callers retain their default scope and
prose output; research coverage and literal JSON are explicit opt-ins. No global
fetch replacement or package installation is used in production code.

## Offline checks and live handoff

```powershell
deno check --no-remote scripts/parts/research-run.ts scripts/parts/personalise-bundle.ts supabase/functions/_shared/parts-research/research_test.ts supabase/functions/_shared/parts-research/identity_test.ts supabase/functions/_shared/parts-research/gather_test.ts scripts/parts/pdf-smoke.ts
deno test --no-remote --allow-read --allow-write=quality/parts/research-test-output supabase/functions/_shared/parts-research/ supabase/functions/_shared/enrich/llm_test.ts
deno lint supabase/functions/_shared/parts-research scripts/parts supabase/functions/_shared/enrich/runtime.ts
```

Network permission is deliberately absent from the tests. All HTTP responses are
fixtures. On the Windows sandbox where `deno test` cannot open its reporter pipe,
the identical test bodies can also be executed with:

```powershell
deno run --no-remote --allow-read --allow-write=quality/parts/research-test-output scripts/parts/research-offline-tests.ts
```

That fallback does not replace Deno's resource sanitiser. Exact executed results
are in `quality/parts/research-verification.json`. A human must rerun `deno test`
and then perform the live UK and US company runs, inspect the citations and
dates, and install the personalised pilot bundle before any fulfilment wiring.
No live provider result, wall-clock identity SLA or installed-part acceptance
is inferred from fixtures.

The 17 November human runs reported both failed identity and, subsequently,
working discovery with no useful facts. The regression fixtures reproduce those
response shapes using synthetic documents, including a multi-megabyte filing
and a minimal valid PDF. They are not fresh company research.

## PDF package and human rerun

The exact new specifier is **`npm:unpdf@0.12.1`**. The adapter uses
`extractText(new Uint8Array(buffer), { mergePages: true })` and reads its `text`
result. No package was downloaded in the sandbox. The offline suite injects the
PDF extractor; it tests binary transport, the 5 MB cap, text admission and
failure reporting, but does not establish that the real PDF library ran.

A human with network access caches the package, then runs the real parser fixture:

```powershell
deno cache --node-modules-dir=auto npm:unpdf@0.12.1
deno run --node-modules-dir=auto --cached-only --no-remote --allow-read scripts/parts/pdf-smoke.ts
```

Then run the standard Deno tests above and repeat the Duolingo command with a
new output path. Use `--node-modules-dir=auto` for that run too so the pinned
PDF dependency resolves in this npm-based repository. Inspect the companion
receipt's fetches, the SEC filing identity citation, XBRL source context and
retained quotes. A new User-Agent does not guarantee access to a blocking host,
and image-only PDFs may have no extractable text. No OCR is supplied.

Contract v1.2 is now the repository copy. Its schema identifier remains
`mindmake.research-pack/1`, and the buyer's pack remains capped at 200 KB.

If the lazy PDF import is unavailable, its fetch outcome is `pdf reader unavailable`.
The build continues with other sources; caching the optional PDF reader is not
a prerequisite for a useful pack. The real-parser smoke remains a separate gate.


## Contract v1.2 and board-report comparisons

The repository contract now includes rules 11 and 12. The scratch copy could not
be updated because the sandbox denies writes outside this worktree. A human must
append the same v1.2 additions there; the copies currently differ intentionally.

XBRL duration rows retain start/end dates and distinguish quarter, year-to-date
(H1 or 9M), and full-year labels. Instant measures use `at YYYY-MM-DD`.
Unknown narrative date bounds remain null. Exact measure names are preserved:
cash and cash equivalents is never cash, cash equivalents and short-term
investments. Bare cash, income and users aliases are excluded.

Restatements are deduplicated by measure, unit, period type and date bounds,
keeping the latest filed entry. Each measure retains at most five quarters,
one full year, one year-to-date period and five instant observations. The filed
date is the fact publication date. Chip priorities order primary figures, with
narrative proposals inserted after the first twenty so XBRL cannot occupy every
slot before narrative evidence is considered. The final cap remains forty.

Models can extract quoted KPIs, guidance and announcements from narrative
sources without using XBRL sentence templates. Questions name specific measures
or quoted announcements and cite one to three facts, with a maximum of five.
Revenue absence messages check retained measures and statements.

For the latest registry-listed 8-K and 6-K, gather reads the filing directory
index and follows explicit release/shareholder-letter or EX-99.1 links within
that directory. No unlisted exhibit is guessed. The current registry adapters
are SEC and Companies House; there is no separate RNS feed adapter.

Robots 4xx responses allow fetching. A timeout gets one retry at four seconds;
5xx or an explicit disallow blocks. HTTPS, DNS and byte limits still apply.


## Narrative extraction and live trace receipts

Extraction runs once per non-registry narrative source, at most four sources
concurrently. Each call requests at most twelve facts, 6,000 output tokens and
90 seconds total across its provider attempts. The whole build has a four-minute
monotonic deadline, including identity in the CLI. Fetches and extraction obey
the remaining time; already gathered sources are retained at the deadline.
The temporary 150-second probe has been removed.

Only extraction opts into Anthropic-first routing. `PARTS_EXTRACT_MODEL` defaults
to `claude-haiku-5-5`; `PARTS_EXTRACT_FALLBACK` defaults to `gemini-2.5-flash`.
Missing providers, failed requests and unusable JSON can fall back within the
call budget. Existing shared-helper callers retain Gemini-first routing, their
existing model ids and their seven-second default timeout. Model availability
is a live operator check, not established by offline fixtures.

Both arrays and facts envelopes are accepted, with optional code fences.
Truncated arrays retain complete fact objects only and record `truncated`.
Narrative verification rejects table-like quotes with at least three numbers,
quotes shorter than six whitespace-separated words, and quotes without a
recognised verb. Exact-quote, source and personal-data checks still apply.
Ambiguous values become null announcements. Unsupported periods become null.
XBRL statements keep their separate deterministic verification path.

The receipt's `extractions` entries give source URL, actual provider/model,
elapsed milliseconds, input/output characters, parse status and final facts
kept. Input characters count system and user text, including Gemini's separator.
Injected offline models are explicitly labelled injected. `identityProbes`
records each website attempt and outcome. Purchase mode retries once on any
failed website probe within its ten-second deadline; pre-payment stays single
attempt within 2.7 seconds.

Release discovery now fetches the typed `<accession>-index.html` filing index
and follows every listed EX-99.* HTML document, subject to the fifteen-source
cap. Images and PDFs are skipped on this exhibit path. A fixture reproduces
accession 0001628280-26-069474 and the named shareholder-letter and press-release
paths with synthetic content, including a 266 KB HTML letter.

### Provider shape recovery, 17 November 2026

Narrative proposals accept quote, exact_quote and supporting_quote; unit spellings, null aliases and case are normalised before strict evidence validation. Source sentences replace model-added wording. Extraction receipts retain safe HTTP failure reasons, including authentication rejection. The purchase runner can recover an email-matched company through a uniquely named SEC issuer whose latest 10-K/10-Q, or listed HTML EX-99 release exhibit, literally names the domain. This recovery runs after the identity-card budget and within the purchase build deadline.

### Narrative business evidence, 17 November 2026

First-party sources and filings propose up to 25 narrative facts per source; coverage keeps the 12-fact limit. Extraction prioritises business figures and product, pricing and leadership decisions. Trailing executive attribution on first-party statements is removed before verification; the retained quote must still appear in the fetched source. Private-life information and non-executive personal names remain excluded.

SEC exhibit publication dates come from accession filing dates in submissions, never retrieval. Narrative figures may inherit an explicit document quarter, labelled `periodSource: "document"`; periods in quotes are labelled `quote`. The evidence receipt retains the document period and validation checks it. Preparation selects at most three narrative questions, cites one fact per question and excludes XBRL rows. Live provider acceptance remains separate from fixture results.

### Run 9: deterministic KPI rows and literal attribution quotes

Two-quarter KPI tables with an explicit unit note are parsed independently of the model. The parser recognises daily/monthly active users, paid subscribers, total/subscription bookings and revenue, requires matching quarters in consecutive years, and retains only the newer column plus a separate year-over-year growth fact. Unknown layouts produce no deterministic facts. Values and plain statements are recomputed from the fetched row and header during verification and pack validation. Quotes preserve the literal row through the current value, or through the growth percentage for growth facts.

Multi-sentence proposals are narrowed only when exactly one sentence contains the named measure and a number. Executive-attributed quotes remain verbatim; only the statement drops the trailing attribution on first-party sources. Every rejected proposal is listed in the local evidence receipt with its quote's first 160 characters and reason. The run 9 fixture passes full pack validation with DAUs 64,900,000, subscribers 13,100,000 and cash USD 1,400,000,000. These are offline fixture results, not a live build claim.

### Run 10: deterministic prose and model-generated questions

Primary-source figure sentences are extracted before model proposals. The bounded grammar accepts a one-to-six-word measure, the requested reporting verbs, and a number with optional currency and scale. An explicit margin in that sentence becomes a separate measure. Literal sentences remain the quotes, document periods carry provenance, and equivalent measures are deduplicated against table/XBRL facts using their quoted rounding precision. The HTML title is removed from the extraction view so it cannot become part of the measure name.

Build-time question generation asks the model for up to eight role- and chip-specific questions, preferring announcements and guidance. Validation requires one or two real fact ids, fewer than 200 characters, a specific subject and supported numbers after scaling. Personal-name patterns and em dashes are rejected. A failed or wholly invalid model response falls back to short subject-specific templates; those pass the same validation. Question generation uses the existing provider fallback and the remaining four-minute build budget. Rule 5 in the repo contract now permits eight questions; the consuming part shows at most three. Live question quality still requires a human-run build.

### r17: UK identity, dated announcements and sparse evidence

Current policy supersedes the earlier template fallback and shared question deadline: questions get two independent 45-second attempts and return no questions when neither validates. The live reviewer's Claude 5 temperature omission is preserved; older Anthropic models retain temperature. Verification reserves 28 places for figures and 12 for announcements, ranks decisions ahead of guidance and numerical updates, and records filing boilerplate as dropped evidence.

Identity reads at most the first 512 KiB of each homepage, without rejecting oversized pages. Company matching ignores punctuation, spaces and trailing legal/group/holdings/bank suffixes. Companies House search uses a four-second timeout and one retry. Purchase identity checks same-domain legal, terms, privacy, about, plc and investors pages for the matching registration number, within the existing ten-second identity budget. A number absent from these pages never becomes a binding check.

Undated sources cannot produce announcements, including proposals downgraded from figures. Verified companies with fewer than three facts dated within the last twelve months receive the requested sparse-publication notice and no question-generation call. Synthetic UK fixtures reproduce the reported sizes and names; they are not live-page captures. Live UK and small-company acceptance remains pending.
