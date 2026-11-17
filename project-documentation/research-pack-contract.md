RESEARCH PACK CONTRACT v1 (mindmake.research-pack/1). Shared by the mindmake repo (builds the pack at purchase) and krishanraja/mindmake-kits (the part reads it). Krish's ruling, 17 November 2026: each part is built for the buyer from their verified company, their role and a chosen use case, filled with fresh evidence-backed research; research happens once at purchase and is built into their copy; after that the part runs locally and never calls Mindmake. Pilot: "Fact-check my board update" only.

FILE: research/pack.json inside the buyer's .mcpb. UTF-8 JSON, at most 200 KB.

{
  "schema": "mindmake.research-pack/1",
  "part": "fact-check-board-update",
  "builtAt": "<ISO timestamp>",
  "buyer": { "company": "<as typed>", "role": "<as typed, self-reported>", "useCase": "<chip id>", "useCaseLabel": "<chip label>" },
  "company": {
    "name": "<verified name>", "domain": "<domain>",
    "verified": true | false,
    "verifiedBy": [ { "check": "website" | "work-email-domain" | "companies-house" | "sec-edgar" | "brand-registry", "detail": "<plain words>", "url": "<source url>" } ],
    "registry": { "authority": "Companies House" | "SEC" | null, "id": "<company number or CIK>", "status": "<status>", "url": "<url>" } | null,
    "sector": "<plain words, sourced or omitted>"
  },
  "facts": [
    {
      "id": "F1",
      "kind": "reported-figure" | "announcement" | "leadership" | "registry",
      "statement": "<one plain sentence, what the source says>",
      "value": <number or null>, "unit": "<GBP | USD | % | people | null>", "period": "<e.g. FY2025, Q3 2026, or null>",
      "quote": "<exact text copied from the fetched source that supports the statement>",
      "source": { "title": "<title>", "publisher": "<publisher or domain>", "url": "<url>", "published": "<ISO date or null>" },
      "retrievedAt": "<ISO timestamp>",
      "grade": "primary" | "secondary"
    }
  ],
  "notFound": [ "<plain sentence, e.g. No public revenue figure was found for this company.>" ],
  "prepare": [ { "question": "<a question this board may ask someone in this role>", "because": ["F2", "F5"] } ]
}

EVIDENCE RULES (non-negotiable; the pack must fail closed)
1. A fact enters the pack only if its "quote" appears verbatim (after whitespace normalisation) in text we fetched ourselves from "source.url" during this build. Model output can extract and phrase; it never authors a fact. Failing facts are dropped and counted.
2. Every fact has a source URL and a retrievedAt. "published" is the source's own date or null; never guessed.
3. "primary" = the company's own site, its filings, or a registry. Everything else is "secondary".
4. Facts older than 24 months are dropped unless kind is "registry".
5. "prepare" questions are labelled as questions, never facts, and each cites at least one fact id. At most 8; the part shows at most 3.
6. If the company cannot be verified by at least two independent checks (for example website plus work-email domain, or website plus registry), "verified" is false, "facts" holds only facts about the verified-or-not identity question, and the part tells the buyer it is the general version. Never guess between two companies with similar names: return all candidates to the caller for the buyer to choose.
7. No personal data about named individuals beyond what the company itself publishes about its leadership (name and title). Nothing about the buyer except what they typed.
8. Use-case chips for this part (IDs fixed; labels pending Krish's approval): monthly-board-pack "Monthly board pack"; investor-update "Investor update"; results-commentary "Results commentary"; lender-update "Funding or lender update". The chip sets research priorities (results-commentary and lender-update favour reported figures; investor-update favours funding and announcements; monthly-board-pack favours the last 90 days of announcements).

CONTRACT v1.1 ADDITIONS (17 November 2026, after review of the first sample; backwards compatible, schema id unchanged)
9. Each fact of kind "reported-figure" SHOULD carry: "metric": "<canonical measure in plain words, e.g. revenue, cash and short-term investments, paid subscribers, retailer forecourts, customer deposits>", "aliases": ["<other ways a person would write it, e.g. cash, cash and investments>"] (at most 8, lower case), and "value" normalised to a plain number in base units (1.4 billion -> 1400000000; 13.1M -> 13100000; percentages as the number, unit "%"). "period" uses FY2026, H1 2026, Q3 2026 or an ISO month.
10. The builder may use the model to propose metric and aliases, but "value" must be parsed from the verified quote, never from model output alone; if the quote does not contain the number, the fact keeps value null.

CONTRACT v1.2 ADDITIONS (17 November 2026; schema id unchanged)
11. Reported-figure facts carry periodType (quarter, year-to-date, year or instant), periodStart and periodEnd (ISO dates, or null when the source gives none); period keeps the human label.
12. A fact's metric is the exact measure named in the source; never generalise.
