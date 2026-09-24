# Current backend release evidence

Verified release: 24 September 2026. This is the current evidence summary, not a chronological repair log. Full prior records and incident sequence are retained in `../history/LOG.md`. Behavioral specification: `../05_LEAD_DELIVERY_SPEC.md`. Overall production identity and frontend gates: `RELEASE-2026-09-24.md`.

## Target and deployed identity

- Repository origin: `krishanraja/mindmake`, local `mindmake-award-panel`.
- Supabase project: `bkyuxvschuwngtcdhsyg`, Mindmaker AI, authenticated official CLI target verified. No keys read; no unrelated functions or schema migrated.
- Actual browser-canary frontend: PR170 merge `3ee77cf9956f98dd73f69d0b48745930335e74e1`, deployment `dpl_EZigNAi6Uc6Apcq75XsFnHETt5W8`, public `https://mindmake.co`, observed script `/assets/index-CZk5zedf.js`. This identifies the exercised journey, not the latest frontend deployment; `../06_CURRENT_STATE.md` owns the verified application release.
- Designated canary recipient: `krish@themindmaker.ai` only; synthetic Release Canary. No publication interest selected. No other leads touched.

| Function | Version | Status | Verify JWT |
| --- | ---: | --- | --- |
| enrich-company | 44 | ACTIVE | true |
| submit-mindmake-brief | 21 | ACTIVE | false |
| mindmake-personal-read | 25 | ACTIVE | false |

## Source parity and checks

All three Deno closure checks and scoped ESLint passed. Four backend suites / 115 tests and nine executable Deno core tests passed. Full-site unit/browser/build results are in the overall release record, not replaced by this scoped result.

The submit v21 deployed closure was independently downloaded using the official CLI and all 15 modules match candidate `ff8f8d31402aea38c02b4ffddaefd628079c83b0`. Enrichment v44 and personal-read v25 versions and bundles remain unchanged. The sole v21 change is the results template's follow-up disclosure; source equality proves no other runtime change. Read-only OPTIONS200 and GET405 match the existing API contract. No POST, email, queue, cron, schema or unrelated-function mutation accompanied this correction. The redacted receipt is `../../artifacts/homepage-release/backend-submit-v21-2026-09-24.json`. Current hashes:

| Source | SHA256 |
| --- | --- |
| submit-mindmake-brief/index.ts | `33CE410B8EC26381E6B553D5620B5C125AB3B90FAB9E86A1283BDA143E98C936` |
| submit-mindmake-brief/core.ts | `772860552AC6E3E8E407A7CB099196C2AEAB9DC63B8D27CA3268CA4D04A2CCCD` |
| mindmake-personal-read/index.ts | `1093FE13DB10D9A40E18576F3EF67BC8B6251F29415E12732C8C38425D21FAF3` |
| enrich/provenance.ts | `E862D3F466E387412FE05F692F8A88568119307023780BB047D7CFB5751CA79C` |
| enrich/orchestrate.ts | `6A7A50F1C68D4BD5F31D0E6FE351363463F9E3F4218823B8F161DB557F4EC2C9` |
| lead/choiceSignature.ts | `687BA37F7F9B60EBEF61C958D7CCACE8877BC43A07F1A211014E81C6E18D9260` |

## Verified intelligence behavior

Brandfetch/PDL exact-domain matching, deterministic merge and independent name corroboration are active. First-party titles can corroborate a small company's identity without PDL. Currency uses literal first-party Exa/NewsAPI titles, not generated launch summaries. The factual company field uses the corroborated literal descriptor/tagline, not model paraphrase. Useful tailored pressure choices remain separate.

The explicit owned alias `themindmaker.ai` → `mindmake.co` applies to company/profile research and signed-choice binding, never to email recipients or arbitrary redirects. Alias and non-alias tests passed. Fresh canonical and legacy reads both returned HTTP200 and Mindmake, with this exact factual description:

> Mindmake helps leaders turn their judgement into useful AI systems and make better product, price, positioning and people decisions.

The first-party source was `https://mindmake.co/ai-gtm`, literal title “Build your AI GTM - Mindmake”. Three tailored choices were returned by the endpoint; the final actual browser used the available generic option set. No unrelated founder/company, vCon launch or predictive-software claim appeared in the verified final responses. External data is not guaranteed eternally correct; insufficient evidence must retain honest recovery.

## Actual promoted-frontend browser canary

Fresh Chromium at 1440×900 entered `https://mindmake.co/?start=brain` after verified publication. Observed progressive UI: Work email → Read the business → First name/Last name/Leadership → See the company read → context pressure → Grow this business → folio preview → Keep the private brief → explicit verification-next confirmation → Continue → code → completed Your private brief.

Exactly one code send and one successful confirmation; no guessed code, resend or extra final send. Baseline designated brief requests and queues were zero.

| Evidence | Verified value |
| --- | --- |
| Request | `5dadd5c1-5d27-468a-ad51-97d53391452b` |
| Created | `2026-09-24T15:13:06.428362Z` |
| Verified | `2026-09-24T15:13:39.362906Z` |
| Server state | HTTP200 confirmed; assembly ready; all three provider IDs present; visitor/operator queued |
| Code INBOX receipt | `1a0d3fa47f0ac47c`, 15:13:08Z |
| Visitor INBOX receipt | `1a0d3fac761c5add`, 15:13:40Z; Your Mindmake brief for Mindmake |
| Operator INBOX receipt | `1a0d3fabe3daa4f7`, 15:13:40Z |
| Exactly one brief queue | `40afb55f-5a23-475f-ae9d-b4d4fdc7da7c`, due `2026-10-08T15:13:40.444Z`, attempts0, unsent |

Visitor HTML attachment and correct company description were confirmed. Actual INBOX receipts, not provider acceptance, establish delivery. OTPs and full email bodies were not logged. The brief and queue were deleted by captured IDs plus designated email/source predicates: one of each removed, independent remaining_brief0 / remaining_queue0. Emails remain as receipts; no other customer records were touched. Canary browser exited0 through its owned session.

## Actual completed-journey download

Clicked production's actual **Download my brief**, waited for the real browser download event and opened that saved HTML. This was not a generated test substitute.

- File: `C:/Users/krish/.scratch/mindmake-production-canary-20260924/live-private-brief-1790262854870.html`.
- 3,755 bytes; SHA256 `0A85D52E50000045E1ED602E3DB8FC2B526A0A8EB7A93C79779C6583F6FA4D20`.
- Fifteen fragments from the actual on-screen article matched, including pressure, company read, evidence, AI/human boundary, proof and returned time.
- Opened at 1440px and 390px; screenshots visually inspected, no overlap/clipping/horizontal overflow or placeholder residue. Zero external requests.
- Screenshots: same basename with `-1440.png` and `-390.png` in the same scratch directory. Contains authorized synthetic brief only, no code or secrets.

## Personal-read API and delivery

The real public personal-read action contract was exercised with the allowed production origin and designated inbox, leadership/writing/decisions. Preview returned ok, Mindmake and companyOnly=true rather than an invented profile. Send returned queued. This tests live research/providers, actual inbox and storage; it is not a full browser traversal of the separate personal-read UI.

- Actual INBOX receipt `1a0d37b24e027444`, “Your first week with an AI brain”, `2026-09-24T12:54:17Z`.
- Persisted personal row `bc8661d0-3acc-4c48-8872-a7eac004f56a`, company Mindmake, delivered `2026-09-24T12:54:17.104Z`.
- Exactly one personal-read queue `df6a5a5a-9342-4e1d-8e49-4334ac7616fc`, due `2026-10-08T12:54:17.246Z`, attempts0, unsent.
- Exact new read/queue IDs plus recipient predicates deleted; one each, zero independently read back. Receipt retained. This run preceded the type-only redeploy; runtime equivalence is documented above.

## Evidence limits

- Daily retention, price-snapshot and follow-up schedules are configured in the retained source; no fresh scheduler readback is asserted by this receipt. The live cron sender was not invoked and future day-14 delivery was not tested early. A due row is not a future inbox receipt.
- Queue uniqueness is per email/source, not a lifetime cap across purges and all journeys. Verification is an additional service email.
- The deployed results template truthfully discloses the existing single follow-up fourteen days later, no ongoing sequence and separate useful human contact. HTML/text regression and deployed source parity establish the corrected wording. The actual INBOX receipts above prove the unchanged delivery path, not a newly sent v21 email; no extra email was sent for the wording-only correction.
- Physical iPhone VoiceOver/Android TalkBack were not performed under the owner's release-specific exception; no backend or browser result claims them passed.
- One successful designated company/recipient proves the recorded path, not universal future provider quality or deliverability. Separate frontend/public route/motion gates remain in the release record.

## Repeat procedure

Use the opt-in `scripts/qa/release-backend-canary.mjs` with `MINDMAKE_RUN_DESIGNATED_CANARY=yes` and only the authorized inbox. `MINDMAKE_CANARY_CANONICAL_READ_ONLY=yes` stops before sending. For delivery, explicitly drive each action; read fresh OTP in memory, do not record it. Wait for actual research and download events, verify actual receipts and exact database/queue counts, capture IDs before cleanup, delete only those synthetic records and verify zero. Do not run the live follow-up sender for convenience.
