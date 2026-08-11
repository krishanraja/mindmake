# Price and claim truth audit

> **HISTORICAL RECORD, superseded 2026-08-11.**
>
> This audit documents the state of the estate *before* the August 2026 reprice, when six offers were quoted at inconsistent figures across eight surfaces. It is kept because it is the evidence behind the single-source-of-truth work, not because anything in it is current.
>
> **Every price and offer named below is retired.** The live ladder is two engagements, priced in `src/lib/offers.ts`, with a test that fails the build if a price string appears anywhere else. Do not read this file for current pricing, and do not index it for retrieval.


**Compiled:** 2026-08-05
**Purpose:** Stage 0 of the Brief 1 overhaul. Every price and offer claim currently published, where it lives, and what it contradicts. This is the approval artifact. Nothing here changes the site.

**Method:** repo grep at HEAD `9801c85`, plus live fetches of themindmaker.ai, maven.com/mindmaker and ctrl.themindmaker.ai on 2026-08-05.

---

## 1. Eight contradictory price lists, not seven

Brief 1 identified seven. There is an eighth, and it is the most damaging.

| # | Surface | Workshop | Cohort | Signal Session | Revenue Arch | Immersion | Alumni |
|---|---|---|---|---|---|---|---|
| 1 | Rendered pages | $500 to $1,000 | $2,000 to $3,000 | From $10,000 | $50,000 to $100,000+ | $10,000 to $15,000 | around $1,500 |
| 2 | `public/llms.txt` | $599 | $2,500 | $15,000 | $60,000 to $100,000 | $12,000 flat | $1,500/yr |
| 3 | Crawler meta (`prerender.mjs`) | From $599 | $2,500 per seat | ($15k) | ($60-100k) | | |
| 4 | JSON-LD (`index.html`) | Builder Session $348 | Builder Sprint $2,098 | AI Leadership Lab $7,000 | | | |
| 5 | `/contact` dropdown | 4-Week Decision Sprint, 90-Day Concierge Sprint (exist nowhere else) | | | | | |
| 6 | Diagnosis Room | speaks "Bespoke enablement $8,000 to $25,000", no page behind it | | | | | |
| 7 | `YFork.tsx` | from $500 | $2,000 to $3,000 | | | | |
| 8 | **`InitialConsultModal.tsx`** | **$599** | **$2,500** | **$15,000** | **$60,000 to $100,000** | **$12,000 flat** | |

### List 8 is the priority fix

`src/components/InitialConsultModal.tsx` lines 291 to 311 and 744 to 772 render the **exact internal figures**. CLAUDE.md states these are "**Internal (not shown on site), exact figures, NEVER shown publicly, set on the call**".

They are shown publicly. Reachable path, verified:

`/alumni` line 129 → `openConsultModal({ preselected: "alumni" })` → `src/App.tsx:218` mounted modal → renders all five exact prices.

This hands a buyer the number before the call, on the one page sent to people mid-relationship. It is also the only surface where the site's own stated pricing policy is broken rather than merely inconsistent.

### List 4 sells three products that do not exist

`index.html` JSON-LD (script at line 159) publishes `Product` entities with `offers.price`:
- line 265 / 285: "Builder Session", `"price": "348"`
- line 294 / 309: "30-Day Builder Sprint", `"price": "2098"`
- line 317 / 332: "AI Leadership Lab", `"price": "7000"`

None are sold anywhere on the site. Structured data is machine-readable and is what rich results and answer engines trust most.

---

## 2. Nothing in the estate is purchasable

Verified live on Maven, 2026-08-05:

- `maven.com/mindmaker/the-ai-fluent-executive` reads **"Next cohort Nov 19-Dec 13, 2026. Sold out."** Only actions are "Join waitlist" and "Get course updates".
- `maven.com/mindmaker` lists Courses, Lightning Lessons and Resources. **There is no workshops product.** The word "Workshops" on that page is Maven's own global site nav, not Krish's catalogue.
- Confirmed: 6.6K subscribers on the instructor page.

So five workshop detail pages plus `/workshops` sell a product with no checkout anywhere, and `/cohort` sells seats in a sold out cohort.

**The only purchasable thing across the business is $0** (CTRL free tier).

---

## 3. The site is invisible to AI crawlers

Fetched as `ClaudeBot/1.0`, 2026-08-05:

```
GET https://www.themindmaker.ai/enterprise
HTTP 200, 20,037 bytes
<body> length: 175 bytes
visible text length: 0
```

The entire 20KB is `<head>`. The body is an empty `<div id="root">` plus a script tag.

**Why this is a small fix, not a migration.** The delivery mechanism already works:

- `vercel.json` rewrites to `/index.html` only for paths with no matching file, so Vercel serves the prerendered `dist/<route>/index.html` directly. Proof: `/enterprise` returned `<title>Enterprise: Mindmaker</title>`, which only exists in the prerendered file.
- `scripts/prerender.mjs` (191 lines) is a plain string replace over the built `index.html`. Its own header says `"This is NOT full SSR"` and it injects meta only, by design.
- `src/main.tsx` uses `createRoot`, which **clears** `#root` on mount. Static HTML injected there therefore cannot produce a hydration mismatch.

The pipe is built, deployed and proven. It is carrying an empty payload. Adding a `body` field per route and one injection line fills it.

Sibling proof: `ctrl.themindmaker.ai` serves 2,211 characters of visible text to the same crawler. The house already solved this once.

### Crawler meta carries dead prices

The prerendered `<meta name="description">` for `/enterprise` currently reads, live:

> "Your AI capabilities, translated into revenue. The Signal Session ($15k) aligns your team fast. The Revenue Architecture ($60-100k) builds the complete commercial strategy."

So the one thing crawlers *can* read is a price list that contradicts the page it describes.

---

## 4. Other corrections to Brief 1

| Brief 1 claim | Actual, verified 2026-08-05 |
|---|---|
| Repo HEAD `5b95c81`, untouched since 2026-07-10 | HEAD is `9801c85`. Five commits since, all on `public/intake/index.html` plus a new `personalize-intake` edge function. Unrelated to this work, leave alone. |
| `/enterprise` returns a 169-byte body | 175-byte body. Same conclusion: zero visible text. |
| CTRL Edge Pro at $49/month | Correct. CLAUDE.md's "upgrades from $29" is stale and should be corrected. |
| Seven price lists | Eight. See section 1. |

---

## 5. Dead code, safe to ignore or remove

- `src/components/YFork.tsx`: not imported anywhere. Carries stale prices but renders nowhere.
- `src/components/PreCallQualifier.tsx`: not imported anywhere.

Neither is reachable. Neither is urgent. Flagged so they are not mistaken for live surfaces.

---

## 6. Sitemap versus reality

`scripts/generate-sitemap.mjs` publishes at priority 0.8 to 0.9: the five workshop detail pages plus `/workshops`, `/cohort`, `/enterprise`, `/capital`, and `/immersion` at 0.4.

`/start`, the Diagnosis Room, which Brief 1 correctly identifies as the best asset on the property, **is not in the sitemap at all** and has no prerendered meta.

The site is actively asking search engines to index the things it wants to retire, and hiding the thing it wants to sell.

---

## 7. Single line of positioning to resolve

The "anti-consultancy" framing appears throughout `project-documentation/`, but on the **live site it exists in exactly one place**:

`src/components/OperatorsEdge.tsx:14`
```
const LEAD_LINE = "I'm the anti-consultant. I don't deliver slides, I deliver systems.";
```

Brief 1 argues this becomes a contradiction once advisory is sold again, and proposes replacing it with "the engagement ends and you keep the system." Whether or not that is right, it is a one line edit behind a named constant, not a repositioning project.
