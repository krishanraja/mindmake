# Mindmake private brief and personal-read delivery

Current at the 24 September 2026 production release. This file specifies current behavior, durable privacy/product boundaries and known limitations. Historical experiments and incident narratives belong only in `history/LOG.md`. Current deployment identity is in `06_CURRENT_STATE.md`; executed backend evidence is in `website-redesign/BACKEND-RELEASE-EVIDENCE-2026-09-24.md`.

## Product and consent boundaries

The starting read is an outside view, not a finished diagnosis or advice. The visitor sees a useful preview before choosing email delivery; the work email is already collected earlier to identify the company. Do not claim the journey asks for no email before providing value.

- No public diary/Calendly link, hidden narrative input, automatic newsletter subscription or list import.
- Publication interest is separate, unticked and unverified. Neither checkbox state subscribes anybody. Publication signup uses its provider's own verified process.
- No automated nurture beyond the approved single day-14 follow-up per queued conversion source. Verification/service messages are distinct from marketing follow-up; see the implementation limit below.
- Browser-authored recommendation, company narrative, evidence or email HTML is never accepted by the backend. A tailored label is trusted only with its valid server signature.
- `queued` means provider acceptance, not actual inbox arrival and not a read receipt. The UI reports visitor and operator delivery separately.
- A failed network/email step must not remove the local brief or its available download.
- Company/profile evidence must not be fabricated. Insufficient research keeps an honest/manual route; it is not success by substitution.

## Shared private-brief journey

`src/components/mindmake/LeadBrief.tsx` owns the current progressive flow. A route-specific entry carries Brain/GTM; a generic entry asks for the door first.

1. Work email → **Read the business**. Derive the company domain; reject personal addresses for company research. The public read begins while the visitor continues.
2. First name, last name and division/Leadership → **See the company read**. Do not ask the visitor to re-enter the company or work email. A `first.last@` or `first_last@` address fills both names in the browser (`nameFromEmail`, `src/lib/workEmail.ts`); a role mailbox, a single word or a shape it cannot place fills nothing, and a name the visitor typed is never replaced. The guess is an editable default, not evidence, and is not sent anywhere the typed name would not be.
3. Show the declarative company read or an honestly labelled unavailable state. Where available, two or three tailored pressure statements are server-authored, signed and bound to a locked lens. “Something else” and the locked choices remain the recovery path.
4. Choose the pressure, then where returned time would matter.
5. Show the illustrative private starting brief, with AI work, human responsibility and a first proof. Its disclaimer remains explicit; the preview is not professional advice.
6. **Keep the private brief** opens the explicit confirmation that verification is next and nothing has been sent. Continue to the prefilled email and separate optional publication-interest box.
7. Request the six-digit code. It expires after ten minutes and locks after five failed attempts. Six digits, typed or pasted, send themselves once; a code that failed is not resent until it changes.
8. Only after successful confirmation attempt visitor brief and operator digest independently; show the completed “Your private brief” article and individual delivery status.
9. **Download my brief** saves the actual self-contained HTML brief even if final email delivery fails.

Changing email or explicitly requesting another code creates a fresh request. A network retry of the same request preserves request ID and idempotency. A default-route/company recovery is not proof that live research succeeded.

## API and server authority

The exact current contracts live in `supabase/functions/submit-mindmake-brief/core.ts`; avoid a second independently maintained interface in documentation. The brief v2 `request` sends requestId, contact.email, company.domain, allowlisted pressure/returned-time/entry-route choices, optional signed tailored choice, consent wording version and the empty honeypot. `confirm` sends requestId, email, code and optional signed tailored choice. Invalid/extra fields are rejected.

Server-owned work: normalize identifiers; apply hash-based abuse limits; research the company or label insufficiency; assemble from server-owned rules; store private request/delivery state; create and send the code; verify it; independently construct/send visitor and operator templates; return truthful status. Retries use delivery-specific deterministic idempotency keys.

The code is stored only as keyed hash plus nonce. Raw internet addresses/browser descriptions are not retained in private brief tables; abuse limits use one-way hashes. Private-schema data and service-role wrappers are unavailable to anonymous and ordinary authenticated browser roles. Do not read, print or archive provider secrets or OTPs in QA evidence.

## Current research provenance

`supabase/functions/_shared/enrich/orchestrate.ts` assembles the dossier with guards in `provenance.ts`:

- Brandfetch returned domain and PDL returned website must match the requested research domain exactly.
- Merge order is deterministic. A brand name needs an independently matching normalized PDL name, or a literal first-party page title corroborating that name when PDL is missing. A small company does not require a PDL record if first-party corroboration exists.
- Literal Exa/NewsAPI first-party titles can supply currency evidence. The assembler does not invoke the generated Perplexity launch-summary helper.
- The factual company read uses the corroborated provider's literal descriptor/tagline through `literalCompanyRead`. `synthesizeDescriptor` is not invoked by assembly; model paraphrases must not become unsupported company facts.
- Explicit owned alias `themindmaker.ai` (including normalized www form) researches `mindmake.co`. This is business domain configuration, not arbitrary redirect trust; it does not rewrite the visitor's email recipient. Profile lookup and signed-choice domain binding use the same canonical business.
- Useful generated pressure choices remain a separate analysis layer. Missing evidence is insufficient, not license to manufacture diagnosis or silently accept a different entity.

These checks constrain provenance, not the infallibility of external data. Stale but apparently corroborated provider content remains a risk; no test certifies all future company reads as true.

## Visitor brief, operator digest and download

Visitor output contains the chosen pressure, company read/source/evidence, what AI may carry, what the leader retains, a useful first proof, returned-time value and the illustrative/not-advice foot. It has no diary link. Reply-To reaches the operator mailbox. The operator digest contains the verified email, company/domain, choices and underlying lens, source context, generated brief, route fit and exact publication-interest state. It is a prompt for a useful human reply, never an instruction to chase or import the lead.

The proposal uses paper, an emerald cover rule, Mindmake/company identification and readable labelled sections. Browser article and HTML generator share proposal-section logic. `privateBriefHtml.ts` creates a self-contained HTML download/attachment with system fonts, no scripts and no external requests. Download remains a real file, not a link that depends on retained session state.

## Personal-read path

Personal-read request allowlist: `action, division, email, first_name, last_name, q1, q2`.
Handoff has its own separately validated contract; neither path accepts browser-authored research.

`mindmake-personal-read` supports `preview`, `send` and the separate `handoff` action. Personal read accepts the documented name, division, q1/q2 and email choices. Preview performs real research but neither persists a delivered read nor sends an email.

`synthesiseWorkingLife` generates a personal working-life interpretation using the provenance-controlled literal company read and verified profile role if available. This remains generative; it is distinct from the factual company field. Product behavior lines are deliberate templates. PDL's returned employer is cross-checked against the requested company domain; mismatch discards the person and uses company-only context instead of inventing a role.

`sanitiseDescriptor` removes unsuitable sentences before the deterministic `assessRead` gate. The gate checks specificity, identity, unsupported role assertions, generic/placeholder or duplicate prose, doom/flattery, infrastructure recitals, house voice and brevity. Refusal returns `not_worth_sending`; nothing is emailed. These heuristics cannot prove a generated paragraph true. No generic company paragraph is substituted for a failed personal interpretation and called a successful personal read.

Successful send emails the visitor, stores `public.mindmake_personal_reads` and upserts the personal-read follow-up queue. The actual API/provider/inbox/persistence path was verified; this release evidence does not claim a second complete browser walk through every personal-read UI state.

## Failure and human recovery

- Research unavailable: label it, retain useful locked choices/manual continuation; do not misidentify the business.
- Code send fails: do not advance as if sent. Wrong, expired or locked code: no final emails.
- One final delivery fails: report only the accepted one. Both fail: keep local download and human fallback.
- Provider rate limits or personal-read quality refusal: give the honest reason and an appropriate human/retry route.

`src/content/handoff.ts`, the handoff component and `mindmake-personal-read`'s handoff action define recovery for personal-read refusal/request/rate/send failures, personal-address input, brief verification failures, unconfirmed final delivery and unmatched ask-bar questions. A panel is appropriate when closed; a quiet line sits beside an available retry. Copy apologises plainly; any dry humour is about the machine, never the visitor.

Handoff reuses known details when present, allows a personal address, and does not consume the paid-read limiter. It sends no visitor email. Operator notice is rate-limited separately. Personal-read storage constrains a row to a read with both answers or a handoff reason; RLS remains service-role only. Do not equate an operator send acknowledgement with inbox arrival or claim storage succeeded without the response/evidence establishing it.

## Follow-up contract

The approved sequence is a results email followed by one day-14 offer, not a drip campaign. Brief verification is an additional service email. `send-follow-ups` reads due rows at the configured daily 09:20 UTC schedule, uses deterministic row-based idempotency, records provider acceptance in `sent_at`, and abandons a row after three failed attempts. The configured subject is “The better version of our offer”. No publication signup occurs.

`follow_up_queue` is unique on `(email, source)`. This prevents concurrent duplicate queue rows per source. It is **not** a lifetime “exactly two emails ever” guarantee: sources differ, old sent rows are purged and future explicit requests can create new work. Do not claim stronger enforcement than implemented. `brief2-email-cap.test.ts` guards the allowed sending surfaces; it does not establish inbox delivery or a lifetime identity cap.

The deployed submit v21 results template states: “We will send one follow-up fourteen days from now. There is no ongoing email sequence. If you hear from Krish separately, it will be because he has a useful next move, a strong fit or something worth questioning.” A focused regression checks HTML and plain text. Four backend suites (115 tests), nine executable Deno core tests, three Deno closure checks and scoped lint pass. All 15 downloaded deployed modules match the candidate source. No recipients, delivery flow, queue behavior or schedule changed, and no additional email was sent for this wording-only correction. The backend receipt records source parity separately from the earlier actual inbox-delivery proof.

The due queue and its send-after time were verified. The daily 09:20 UTC schedule is configured in source; this current record does not include a fresh 24 September live scheduler readback and must not be treated as proof of current cron activation. The future day-14 email was not sent early and the live cron sender was not invoked in release QA. No claim that that future message has arrived is made.

## Retention

Unverified brief requests delete seven days after creation; abuse-event hashes after 48 hours; verified requests, consent and delivery records twelve months after last update. Follow-up rows are purged seven days after sending. The private daily purge and corresponding public privacy notice are the implementation authorities. Expired code is not immediate record deletion. Earlier deletion follows the published contact address and a manually verified private process.

Synthetic release cleanup deletes only captured request/read/queue IDs constrained by the designated mailbox and source, then independently verifies zero. It must never delete all leads for convenience. Receipt emails are retained separately as evidence.

## Release evidence and repeatable verification

The actual promoted progressive frontend completed company research → preview → code → confirmed brief → visitor and operator INBOX receipts → ready database state → exactly one due queue row → actual success-screen HTML download. The downloaded file matched 15 live article fragments and was visually inspected at 1440px and 390px without overlap/overflow/external requests. Exact synthetic records were removed and zero read back. IDs and hashes are in the backend evidence record.

Use `scripts/qa/release-backend-canary.mjs` only with explicit designated-canary enablement and authorized recipient. It supports old/new entry layouts but final release evidence must identify the one actually exercised. Read fresh code in memory, never log it, wait for actual endpoint/download events, verify actual inbox receipts rather than `queued`, and record cleanup. Scope the actual outer dialog so a nested confirmation is not mistaken for a duplicate product defect.

Changes rerun relevant unit/type/lint and runtime checks, source/deployment parity, and an authorized live canary where behavior changed. A type-only redeploy can reuse prior behavior evidence only with proved runtime equivalence; record the limit. `07_DEPLOY_RUNBOOK.md` owns the complete release procedure. Physical VoiceOver/TalkBack were not performed under the owner's release-specific exception; this backend evidence does not claim otherwise.
