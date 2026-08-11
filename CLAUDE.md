# CLAUDE.md: Mindmaker Repository Guide

**Last Updated:** 2026-08-11
**Purpose:** Describe the current state of the Mindmaker codebase so agents and contributors can navigate it without reverse-engineering the tree.

This file is **descriptive, not prescriptive**, and it is written against the actual code rather than against intent. Where it disagrees with the code, the code is right and this file is stale.

**August 2026 in one paragraph.** Advisory was retired in July in anticipation of a full-time role. The Teardown and Handover storefront shipped anyway in early August. The role then fell through on an immigration technicality rather than on the work, so advisory is the primary cash engine again as of 11 August 2026. This pass made the estate agree with the storefront: two engagements, published prices in three currencies, ten orphaned routes redirected, and three false claims removed. Full reasoning in `project-documentation/DECISIONS_LOG.md`.

---

## Deliberately absent

Read this before adding anything. Each of these was removed on purpose, and each has a test or a documented decision behind it.

| Do not re-add | Why | Enforced by |
|---|---|---|
| An aggregate rating in the structured data | It claimed 4.9 from 50 reviews. There are not 50 reviews anywhere in this estate | A repo-wide grep for the schema property returns nothing |
| Illustrative proof entries (`B-*`) | 26 of 35 entries were invented, and Mindy used them to write client proposals | `src/test/mindy-knowledge.test.ts` |
| Any retired offer name | The six-rung ladder is gone. Names are in `DECISIONS_LOG.md`, deliberately nowhere else, because most docs are indexed for retrieval | `src/test/mindy-knowledge.test.ts` |
| A price outside `src/lib/offers.ts` | Prices used to be typed by hand into nine files and the crawler copy kept the old ones | `src/test/price-single-source.test.ts` |
| Currency conversion or an FX lookup | Prices are SET PER MARKET. A converter makes a published price a function of the morning's spot rate | `src/test/price-single-source.test.ts` |
| A published discount, credit or urgency offer | It trains every buyer to wait for it. Krish keeps a discretionary credit for a live call only | `DECISIONS_LOG.md` 2026-08-11 |
| A geographic market claim, in copy, meta or structured data | The practice sells internationally, which is why it carries three currencies | Removed from `index.html` and `llms.txt` |
| An office, a location or a "Global Offices" block | `/contact` claimed Brooklyn, London and Sydney. This is one person | Removed from `Contact.tsx` |
| A CTRL price on this site | CTRL is a separate product on its own site. This site carried three contradictory CTRL prices at once | `DECISIONS_LOG.md` 2026-08-11 |
| Em dashes, anywhere, including code | House rule. Commas, periods or parentheses | `src/test/mindy-knowledge.test.ts` for the Mindy layer |
| The client name behind the $254K POC | "A major US publisher" is the approved wording and the only wording | Comments at each publication site |

---

## Brand north star

Mindmaker is the **anti-consultancy for leaders who are done being sold AI and ready to use it**. Confident, lightly cynical, deeply helpful, premium through substance rather than stiffness.

**Mindmaker is a capped advisory practice. A small number of engagements a year.**

The enemy statement, which is the sharpest line on the site and does not change:

> Consultants, LLMs and the next hyped tool sell you point solutions built to extract your judgment, not build it.

The spine sentence, which nothing on the site may contradict:

> Sixteen years commercialising content, media and IP businesses. Now I build the AI systems that run them.

The cluster `content, media and IP businesses` appears word for word.

---

## The offers

Two paid engagements, presented largest first everywhere.

| | The Handover | The Teardown |
|---|---|---|
| What | Six weeks rebuilding how the business decides and sells | Ten business days on one real decision |
| Client time | Real. A stream lead carries work between sessions | Under two hours, total |
| USD | $18,000 / $30,000 / $50,000 by headcount | $9,500 |
| GBP | £14,000 / £23,500 / £39,000 | £7,500 |
| AUD | $27,500 / $45,500 / $76,000 | $14,500 |
| Bought | Always through a call | Self-serve. The price is published |
| Cap | Six a year | None |

**`src/lib/offers.ts` is canonical.** Everything on the site, in the prerendered crawler bodies and in `llms.txt` is interpolated from it. GBP and AUD are set prices per market, not conversions.

`TODO(krish): confirm all twelve figures. USD is canonical; GBP and AUD are proposals.`

Funds and operating partners buying for a portfolio company are a **third door** into the same two engagements at `/capital`. CTRL is a separate product on its own site and is not sold here.

---

## Non-negotiables

### Visual systems
- `src/components/NewHero.tsx`. Rotating headline, gradient, looping background video (`/rising-cities.mp4`), pulsing blur.
- `src/components/Animations/ParticleBackground.tsx`. Global particle field mounted in `Index.tsx`.
- `.glass-card` / `.editorial-card` Tailwind utilities.
- `src/components/diagnosis/`. **The Diagnosis Room (Mindy)**, the primary conversion surface. Opened via `window.dispatchEvent(new CustomEvent('openDiagnosisRoom', { detail: { source_page, seedDecision?, mode? } }))`, and at `/start`.
- `src/components/CurrencySwitcher.tsx`. A native radio fieldset, one per page carrying prices.
- `src/components/ScopingModal.tsx`. Secondary booking surface, dispatched by the `BigProblem` cards and `/case-studies`.
- `src/components/InitialConsultModal.tsx`. Legacy. Mounted and listening for `openConsultModal`, but only `/alumni` dispatches it.

### Technical infrastructure
- **Pricing:** `src/lib/offers.ts`, imported by the app, by vitest, and by plain Node in the build scripts (via `scripts/lib/offers-loader.mjs`, which uses native type stripping with an esbuild fallback). That third consumer is why the file has no imports, no `@/` alias and only erasable TypeScript.
- **Currency:** `src/contexts/CurrencyContext.tsx`, mounted above `SessionDataProvider` and above `BrowserRouter` in `App.tsx`. Precedence `?currency=` then the `mm_currency` cookie then USD. Nothing auto-detects.
- **Build:** `vite build` then `generate-sitemap.mjs` then `generate-llms.mjs` then `prerender.mjs`. The last two both read `offers.ts`.
- **Supabase edge functions** in `supabase/functions/`:
  - Diagnosis Room: `mindy-chat`, `enrich-company`, `generate-proposal`, `session-digest`, `transcribe`. Shared logic in `_shared/{mindy,enrich,proposal,lead,http}/`.
  - `nervous-decision-machine`, `get-ai-news`, `get-market-sentiment`, `get-model-data`.
  - Unified lead pipeline: every lead-capture function is a thin adapter onto `_shared/lead/` (`adapters.ts` then `pipeline.ts`).
- `SessionDataContext` threads qualification data into the conversion modals.
- Design system in `tailwind.config.ts` and `src/index.css`.

### Colour WCAG rule (CRITICAL)
- Signature accent is portfolio **emerald `#00D9B6`** (`171 100% 43%`). The legacy `--mint*` tokens and the Tailwind `mint` key are kept as aliases to emerald, so existing `text-mint` / `bg-mint` still work and now render emerald. Prefer the `emerald*` keys in new code.
- **Never** use bright emerald on white or light backgrounds.
- On light backgrounds use **`text-emerald-deep`** (`#06746d`), full AA at 5.21. Or `text-foreground` / `text-ink`.
- Use `text-dark-card-*` on dark backgrounds. Bright emerald is for fills, CTA backgrounds, dark-bg accents, shadows and the focus ring.

---

## Homepage scroll order

Authoritative source: `src/pages/Index.tsx`.

1. `Navigation`. Fixed top, hides on scroll-down.
2. `NewHero`. Rotating headlines, primary CTA "Bring me one real decision".
3. `BigProblem`. Three large interactive flip cards.
4. `TwoDoors`. Do it yourself with CTRL, or do it with Krish. No CTRL price.
5. `TrustSection`. Krish bio, headshot, testimonials carousel.
6. `OperatorsEdge`. Dark-bg typography-only credential section. CTA to `/handover`.
7. `OperatorsBrief`. The Live Intel teaser: marquee `PriceTicker`, rotating interpretation line, compact Nervous Decision input, link to `/signal`.
8. `SimpleCTA`. Final CTA, opens the Diagnosis Room.
9. `Footer`.

`ParticleBackground` is mounted behind all of it.

**Not on the homepage:** `FrameworkJourney` (now on `/new-age-leadership`), `MindMakerLiveSection`, `VendorLandscape`, `AINewsTicker`, `ActionsHub`, the ChatBot, and the retired `YFork` / `PreCallQualifier` (both now in `src/_archive/components/`).

Global overlays mounted in `src/App.tsx`: `DiagnosisRoom` (lazy, only mounted when open so the prerender never instantiates it), `ScopingModal`, `InitialConsultModal`, `CookieConsent`.

---

## Pages and routing

Authoritative source: `src/App.tsx`. Non-homepage pages are lazy-loaded.

| Route | Page | Notes |
|---|---|---|
| `/` | `Index` | Eager-loaded. |
| `/start` | `DiagnosisRoom` | The Diagnosis Room as a standalone page. |
| `/teardown` | `Teardown` | One price, currency switcher, the four-step method. |
| `/handover` | `Handover` | Three bands, the six weeks, the Teardown gate, the $254K POC. |
| `/capital` | `Capital` | The same two engagements, per portfolio company. |
| `/operator` | `Operator` | How Krish operates. The 14-agent OS credential page. |
| `/case-studies` | `CaseStudies` | Filterable by Teardown / Handover. Consent-gated testimonials. |
| `/signal` | `Brief` | Live Intel. Ticker, interpretation grid, classified archive, Nervous Decision Machine. |
| `/library` | `Library` | Resources, includes the FAQ tab. |
| `/new-age-leadership` | `NewAgeLeadership` | Essay on agentic org design. |
| `/alumni` | `Alumni` | Invitation-only. **Hidden from nav and footer**, `noindex`, direct URL only. |
| `/blog`, `/blog/:slug` | `Blog`, `BlogPost` | |
| `/contact`, `/privacy`, `/terms` | | |
| `*` | `NotFound` | |

**Redirects.** Real 301s live in `vercel.json`; `App.tsx` carries a client-side `<Navigate>` fallback for in-app navigation, which never touches the edge. Both layers are asserted by `src/test/redirects.test.ts`.

| From | To |
|---|---|
| `/workshops` and its five children | `/teardown` |
| `/enterprise`, `/immersion` | `/handover` |
| `/cohort`, `/leaders`, `/leadership-insights` | `/start` |
| `/sprints`, `/sprint/4-week`, `/builder-sprint`, `/strategy-day` | `/teardown` |
| `/sprint/90-day`, `/war-room`, `/fractional-caio` | `/handover` |
| `/tool` | `/signal` |
| `/faq` | `/library?tab=questions` |
| `/builder-economy` | `https://www.thebuildereconomy.com` |
| `/individual`, `/team`, `/builder`, `/builder-session`, `/leadership-lab`, `/portfolio-program` | `/` |

The archived page components are in `src/_archive/`, excluded from `tsconfig.app.json` and eslint. See its README.

No `/pricing` page. Pricing lives in context on `/teardown`, `/handover` and `/capital`.

---

## Navigation

File: `src/components/Navigation.tsx`. Primary CTA: **"Bring me one real decision"**, which opens the Diagnosis Room.

- **Work with me** (dropdown, largest first): The Handover, The Teardown, For funds and portfolio companies.
- **Mindmaker LIVE** (rendered as a wordmark): `/signal`.
- **Resources** (dropdown): How I operate, Case studies, New Age Leadership, Library, The Builder Economy (external).
- **About** (dropdown): Contact, Privacy, Terms.

Footer carries the same three "Work with me" links.

---

## The Diagnosis Room (Mindy)

The primary conversion surface. A full-screen experience where **Mindy**, reasoning in Krish's voice, diagnoses a visitor's nervous AI decision and forks to three honest exits.

**Entry points:** the `openDiagnosisRoom` event, plus `/start`. Lazy and only mounted when open.

**Two modes:** `express` rushes to the booking; `full` runs the complete diagnosis.

**Front end**, `src/components/diagnosis/`: `DiagnosisRoom.tsx` is the orchestrator; `useDiagnosisSession.ts` is the state machine; `types.ts` holds the edge-function contracts. Phases: `opener` → `reading` → `reflect` → `chat` → `brief` → `fork` → `proposal`, with `express-book` as the shortcut.

**Back end:** `mindy-chat` (the reasoning turn), `enrich-company` (the dossier), `generate-proposal` (the co-branded one-pager and PDF), `session-digest` (Krish's digest), `transcribe` (voice).

**Pricing behaviour, rewritten August 2026.** Prices are published, so Mindy quotes them **exactly**, in the currency the visitor asks in. She never converts between currencies, never invents a figure and never discounts. The Handover always routes to the call. The recommendation contract's field is `price`, not `range`.

Three rules exist because the live agent broke them while the suite stayed green. **A direct price question is answered in the turn it is asked**, ahead of the reflect-then-reason order and whatever phase she is in. **The Handover band is a function of headcount alone**, and the largest-first ordering governs which figure is said first, never which band applies. **The visitor's currency is sent, not guessed:** `useDiagnosisSession` passes it from `CurrencyContext` and `mindy-chat` falls back to USD exactly as the site does, so the number she says matches the number on screen. A currency the visitor names still wins.

The same rule holds in the generated proposal: `book-call` does not hide a published fee. Only the genuine absence of a figure renders "set on the call".

**Privacy contract (critical):** the dossier's `scale.*` fields (`employeeCount`, `sizeBand`, `trancoRank`, `icp`, `recommendedMode`, `handoverBand`) are **internal routing only**. The hook strips them before handing anything to a view, Mindy must never recite them, and the visitor-facing proposal and digest never contain the routing layer or the raw transcript.

**Knowledge and guardrails:** the Brain Pack in `project-documentation/mindy/`. `knowledge.ts` is the deployable distillation, and `src/test/mindy-knowledge.test.ts` fails the build if it names a retired offer, states a price not in `offers.ts`, or is missing any current price in any currency.

---

## Live Intel

Live model pricing and weekly calls.

- Homepage teaser: `src/components/OperatorsBrief.tsx`.
- Full dashboard: `src/pages/Brief.tsx` at `/signal`.
- Shared: `src/components/PriceTicker.tsx`, `src/components/nervous-decision/`.
- Model allowlist: `ALLOWED_MODEL_IDS` in `src/hooks/useModelData.ts`.
- Taxonomy: **WATCH** (worth acting on), **SKIP** (hype), **CALL** (a decision is overdue), **TAKE** (Krish's opinion).
- `src/components/PortfolioPulse.tsx` renders the anonymised cross-product aggregate. No PII reaches the client, volume-guarded, prerender-safe.

**Mindmaker LIVE** is the publication at `live.themindmaker.ai`. Two formats: **Built** and **Paid**. It has paid tiers, so never describe it as free. Always link the branded domain, never the underlying Substack URL.

---

## Voice and tone

### Use
Build, systems, working, deploy, decision, claim, evidence, finish line, capped. Concrete verbs: ship, decide, make, cut, filter. Second person, specific numbers.

### Avoid
Transformation, synergy, leverage, ecosystem, journey (as a noun), revolutionary, cutting-edge, seamless, empower, unlock, game-changer, best-in-class, solutions, robust, elevate, harness, delve, deep dive. Passive voice. Vague benefit words.

**No em dashes, anywhere, including code and commit messages.** Commas, periods or parentheses.

### Archetype
Your smartest, most cynical friend who runs AI transformation every day and genuinely loves building things. Confident, not arrogant. Cynical, not negative. Helpful, not pushy.

---

## Development notes

- **Package manager / build:** `npm` + Vite. `npm run build` runs Vite, then the sitemap, llms.txt and prerender scripts.
- **Node:** `>=22.18.0` (pinned in `engines`, and in `.nvmrc`). The build scripts import `offers.ts` directly via native type stripping.
- **Lint:** `npm run lint`. **Test:** `npm test` (vitest).
  - **Known pre-existing:** 43 eslint errors, 39 of them `no-explicit-any` across 17 files, mostly in live edge functions. Present before this work and not introduced by it. `tsc --noEmit` is not a project gate and has never passed.
- **QA:** `scripts/qa/` holds browser checks for the currency switcher and the redirects, served through a Vercel-accurate static server. See its README for the env vars a local build needs.
- **Routing:** React Router v6.
- **State:** `@tanstack/react-query`, `SessionDataContext`, `CurrencyContext`.
- **Styling:** Tailwind + shadcn/ui in `src/components/ui/`.
- **LLM discoverability:** `public/llms.txt` (generated) plus the allow-list in `public/robots.txt`.

---

## Related documentation

- `project-documentation/DECISIONS_LOG.md`. **Start here.** Every decision in the August 2026 pass, with its reasoning and review trigger. The only file that names the retired offers.
- `project-documentation/OFFERS.md`. The full offer guide, including what each engagement collects.
- `project-documentation/ICP.md` and `ICP_ACCOUNTABLE_DELEGATOR.md`. Who this is for, and what they are actually feeling.
- `project-documentation/SALES_PLAYBOOK.md`. Routing, objections, channel templates, the agent quick-reference card.
- `project-documentation/mindy/`. Mindy's Brain Pack, including `CANON.md` (the de-poison file).
- `project-documentation/PROOF_INVENTORY.md`. Every case study and testimonial, with its consent state.
- `project-documentation/COMMERCIAL_REFERENCE.md`. The durable commercial reference.
- `project-documentation/ARCHITECTURE.md`, `FEATURES.md`, `DEPLOYMENT.md`. Technical architecture, feature catalogue, deploy checklist.
- `project-documentation/research/`. Research artefacts, not Mindmaker business content. Do not index for retrieval.

---

**End of CLAUDE.md**
