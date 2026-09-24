# Backend release evidence — 24 September 2026

## Scope and target

Production backend only; this is not a claim that the new homepage has been deployed or visually accepted.

- Repository: `mindmake-award-panel`, origin `krishanraja/mindmake`.
- Exact Supabase target: `bkyuxvschuwngtcdhsyg` (Mindmaker AI), verified with authenticated official CLI. The connected MCP account did not expose this target and was not used.
- Public browser entry: `https://mindmake.co/?start=brain`.
- Email canary: the runbook-designated operator inbox, `krish@themindmaker.ai`. No other recipient was used, no publication opt-in selected.
- No schema migration, key read, or unrelated function deployment.

## Defect reproduced, not assumed

The original live company read for the legacy `themindmaker.ai` domain returned HTTP 200 but identified an unrelated founder and described Doorganiser. Existing tests passed despite this. An exact-domain-only provider check still failed: stale same-domain identity metadata was insufficient. A generated currency summary then invented an unrelated vCon launch under a first-party citation. Finally, even correctly identified Mindmake acquired an unsupported predictive-software claim in the generated `synthesis` field.

These were treated as launch blockers. The structural corrections are:

1. Brandfetch and PDL must return the requested website domain, not merely HTTP success.
2. Identity merge order is deterministic. Brand identity must be corroborated by independently matching PDL name, or by a literal first-party page title when PDL is unavailable. Missing evidence keeps the existing honest/manual recovery path; it does not fabricate a company.
3. Currency accepts literal first-party Exa/NewsAPI titles, not generated launch summaries. The old Perplexity helper is not invoked by assembly.
4. The factual company-read field quotes the corroborated provider descriptor/tagline literally. Generative synthesis is no longer invoked by the orchestrator. Useful tailored pressure choices remain available; they do not replace factual evidence.
5. Internal employee/size routing is not supplied to visitor synthesis. Two pre-existing Deno generic typing errors were corrected without changing submission behavior.

This is stronger than a prompt instruction, but it is not a claim that external provider data can never be stale. Domain and identity evidence remain necessary; uncertainty must remain explicit.

## Final deployed versions and source readback

Official CLI deployment and independent metadata readback:

| Function | Version | Status | Verify JWT |
| --- | ---: | --- | --- |
| enrich-company | 43 | ACTIVE | true |
| submit-mindmake-brief | 18 | ACTIVE | false |
| mindmake-personal-read | 23 | ACTIVE | false |

All three deployed closures were downloaded using the official CLI to `C:/Users/krish/.scratch/mindmake-backend-deployed-20260924-final`. SHA-256 comparison matched local files for the three entry points and all five changed shared runtime modules.

Key final source hashes:

- provenance.ts: `37B615EF14E69C7882545125DD67A04111FA42A496FD8038AD313E7554DC58CE`
- orchestrate.ts: `569FA4496E9F0FFD8E902A579B6C192F179D025F1E2460C51845B6C8F672B430`
- currency.ts: `3B57F167052333606CE7EA6438818BA0CD6370999CE78A6267D3E88CD026D467`

Original downloaded source is retained at `C:/Users/krish/.scratch/mindmake-backend-rollback-20260924`. Rollback must preserve the JWT settings above and deploy only the relevant closures; no rollback was performed.

## Executed checks

`deno check supabase/functions/enrich-company/index.ts supabase/functions/submit-mindmake-brief/index.ts supabase/functions/mindmake-personal-read/index.ts` — all pass.

`npm test -- --maxWorkers=2 src/test/enrichment-provenance.test.ts src/test/mindmake-brief-backend-core.test.ts` — 2 files, 31 tests pass after final structural guard (13:44 BST).

Earlier existing lead/intelligence regression suites: 150 tests passed. Full-site regression evidence is owned by the parent release gate, not replaced by this report.

Final fresh canonical browser read after v43/v18/v23:

- HTTP 200, identity `Mindmake`, domain `mindmake.co`.
- Factual read exactly: “Mindmake helps leaders turn their judgement into useful AI systems and make better product, price, positioning and people decisions.”
- `synthesis` equals the literal corroborated tagline, with no predictive-software extrapolation.
- First-party source: `https://mindmake.co/ai-gtm`, literal title “Build your AI GTM - Mindmake”.
- Three tailored choices returned by the endpoint. Browser may use its existing generic-choice fallback; this report does not claim every generated choice was displayed.
- No Kristof Hermans, Doorganiser, or vCon entity appeared in final response.

Legacy domain before the final factual-field-only change: HTTP 404, honest unavailable state, live retry available, manual journey remained usable. It did not silently substitute a different company or claim successful enrichment. Its redirect to mindmake.co was observed; automatic cross-domain identity aliasing was not added.

## Actual email, persistence and queue canary

Executed through the live public browser, not direct insertion or mocked responses. Synthetic name Release Canary; leadership, context-in-my-head pressure, grow-this-business time choice. Used legacy domain recovery deliberately, without claiming it was a successful research result.

Request: `e168a02c-9867-410a-9679-3b46a948c668`.

1. Send-code returned HTTP 200 `verification_required`.
2. A real fresh verification email reached the designated Gmail INBOX at 12:38:02 UTC. The code was read and supplied once; no code is stored in this report or a local file.
3. Confirm returned HTTP 200 `confirmed`, visitor delivery `queued`, operator delivery `queued`.
4. Both final messages actually arrived in Gmail INBOX at 12:38:52 UTC — provider queued alone was not counted as delivery.
5. Exact database row showed `verified_at=2026-09-24 12:38:51.7112+00`, `assembly_state=ready`, all three delivery statuses queued, and all three provider delivery IDs populated.
6. Exactly one follow-up row, `fd0da00b-1cbe-4adc-bb1c-8ea8fd1b8dc9`, source brief, due `2026-10-08 12:38:52.625+00`, attempts 0, unsent. The scheduled day-14 email was not sent early.
7. Completion UI displayed the brief and download control. This canary did not independently inspect the downloaded file.

Gmail receipt IDs (no email bodies retained):

- Verification: `1a0d36c45864982b`.
- Visitor brief: `1a0d36d0624127ee`.
- Operator digest: `1a0d36d0fcef5216`.

The email canary ran on v42/v17/v22. The final change to v43/v18/v23 only replaced the shared factual-read synthesis with literal evidence; submission and email delivery logic did not change. A fresh canonical read and deployed-source readback were then performed. No unnecessary second set of emails was sent.

## Cleanup and boundary

The exact synthetic brief and unsent follow-up rows were deleted using both captured IDs and the designated email predicates. One of each removed; independent readback returned zero for both. No other customer rows were touched. Test emails remain in the operator inbox as receipts; they were not deleted. Database cleanup is deliberate and not recoverable from this report, which contains no full brief data.

Verified active schedules: daily brief retention, daily price snapshot, daily follow-up processing. Future delivery itself is not proven by a queued row. The live personal-read function was type checked and source/deployment verified, not independently exercised with a second paid/model/email workflow.

## Repeatable procedure

The opt-in driver is `scripts/qa/release-backend-canary.mjs`. Set `MINDMAKE_RUN_DESIGNATED_CANARY=yes` explicitly. For research only, also set `MINDMAKE_CANARY_CANONICAL_READ_ONLY=yes`; this uses the canonical domain and exits before send. For delivery, run with a terminal and provide explicit JSON actions. Do not broaden recipients. Read fresh codes only from the designated inbox, do not log search snippets containing codes, and never retain secrets or full email bodies as evidence. Capture row IDs before exact cleanup and verify zero afterwards.

Production homepage, visual acceptance, accessibility, final frontend routes and any additional personal-read experience remain separately owned release gates.

## Final addendum: owned alias and remaining E2E gaps closed

This addendum supersedes the version numbers and untested personal-read/download boundaries above; the earlier sequence is retained as evidence of what was actually found.

The first personal-read preview for the legacy inbox correctly returned `not_worth_sending` (3 failures). Nothing was stored or sent. Product documentation already establishes `themindmaker.ai` and `www.themindmaker.ai` as owned 308 aliases for `mindmake.co` (`07_DEPLOYMENT.md`, domain table). An explicit owned-domain configuration now canonicalizes this company lookup only. It does not follow arbitrary redirects, rewrite the email recipient, or weaken domain/name corroboration. Other domains, deceptive suffixes and `ctrl.themindmaker.ai` are unchanged. The matching profile company lookup uses the same alias; signed choices also bind to the canonical business so the legacy email journey can carry valid choices.

Final production readback:

| Function | Version | Status | Verify JWT |
| --- | ---: | --- | --- |
| enrich-company | 44 | ACTIVE | true |
| submit-mindmake-brief | 19 | ACTIVE | false |
| mindmake-personal-read | 24 | ACTIVE | false |

Fresh canonical and legacy browser reads both returned HTTP 200, corroborated Mindmake, the exact literal tagline recorded above, and three endpoint choices. Neither returned the unrelated entities or predictive-software claim. The test driver now waits for the actual enrichment response instead of assuming a 12-second sleep means completion.

Three Deno closure checks passed. Targeted provenance, brief-core and personal-read-core suite: **3 files / 67 tests passed** at 13:52 BST. Added tests cover explicit alias/non-alias behavior and signed-choice acceptance for this owned alias while rejecting another company.

All three final closures were independently downloaded to `C:/Users/krish/.scratch/mindmake-backend-deployed-20260924-alias`. Updated runtime modules matched local SHA-256:

- provenance.ts: `E862D3F466E387412FE05F692F8A88568119307023780BB047D7CFB5751CA79C`
- orchestrate.ts: `6A7A50F1C68D4BD5F31D0E6FE351363463F9E3F4218823B8F161DB557F4EC2C9`
- choiceSignature.ts: `687BA37F7F9B60EBEF61C958D7CCACE8877BC43A07F1A211014E81C6E18D9260`
- mindmake-personal-read/index.ts: `5A5DECEA927C675C57C1AA52D6C05553632416840AB1F2FCD67F21105C640DC1`

### Personal-read delivery and cleanup

Executed the documented public action contract with the allowed production origin, the designated inbox, synthetic Release Canary, leadership, writing and decisions. Preview returned `ok`, correctly named Mindmake, and `companyOnly=true` rather than inventing a matched personal profile. Send returned `queued`.

- Actual Gmail INBOX receipt: `1a0d37b24e027444`, subject “Your first week with an AI brain”, received `2026-09-24T12:54:17Z`. Readback contained Mindmake and none of the known wrong entities/unsupported predictive claim.
- Persisted personal row: `bc8661d0-3acc-4c48-8872-a7eac004f56a`, company Mindmake, delivered `2026-09-24T12:54:17.104Z`, correct synthetic details and choices.
- Follow-up: `df6a5a5a-9342-4e1d-8e49-4334ac7616fc`, source personal-read, due `2026-10-08T12:54:17.246Z`, attempts 0, unsent.
- Exact new personal row and exact unsent queue row were removed using IDs plus designated email predicates. One of each removed; independent readback returned zero for each. The receipt email remains. No cron sender invoked, no other leads touched.

This tests the real public personal-read API, live providers, actual email and storage. It does not claim to be a second end-to-end browser walk through the separate personal-read UI.

### Generated private-brief download

`node scripts/qa/release-private-brief-artifact.mjs` imports the actual production `buildPrivateBriefHtml`, creates a representative canonical-company brief with the canary's real choice content, and triggers a real Chromium Blob download using the production content type/filename pattern. No second lead email was sent.

- Saved HTML is byte-identical to the generator output: 3,650 bytes.
- Opened the downloaded file itself at 1440px and 390px; inspected both full-page screenshots. All content sections present and readable, no text/card overlap or horizontal overflow.
- Zero HTTP requests while opening the artifact. No script, iframe, external stylesheet or imported font dependency.
- Print-to-A4 PDF produced. The PDF was generated, not separately visually graded; the HTML is the actual download format.
- Scratch evidence: `C:/Users/krish/.scratch/mindmake-private-brief-20260924/` contains the HTML, desktop/mobile PNGs and print PDF.

The two bounded evidence gaps are closed at the levels stated. No new visual design or approved website copy was changed.
