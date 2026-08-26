# One-pass launch, domains and private lead runbook

This file turns the verified rebuild into an executable release plan. It is an operational contract, not permission to cross a production boundary without approval.

Claude Code should complete every reversible preparation step in one working session, collect the required approvals at the named gates, then continue the same runbook without reopening product, copy or design decisions.

## Fixed end state

| Surface | Final owner and destination | Required behaviour |
|---|---|---|
| `mindmake.co` | Vercel project `mindmake` | Canonical public site at the apex. |
| `www.mindmake.co` | Vercel redirect | Permanent redirect to the same path and query on `https://mindmake.co`. |
| `themindmaker.ai` | Cloudflare was observed as authoritative on 26 August 2026; reconfirm NS and SOA before mutation | Permanent 301 or 308 redirect to the same path and query on `https://mindmake.co`. |
| `www.themindmaker.ai` | Cloudflare was observed as authoritative on 26 August 2026; reconfirm NS and SOA before mutation | Permanent 301 or 308 redirect to the same path and query on `https://mindmake.co`. |
| `content.mindmake.co` | Substack custom domain for the existing publication | One publication and one subscriber relationship. Keep `mindmakerlive.substack.com` available as the provider fallback. |
| `ctrl.mindmake.co` | The existing CTRL product deployment, on its own hosting project | CTRL remains a separate product surface. Never attach this hostname to the public-site Vercel project. |
| `ctrl.themindmaker.ai` | Reconfirm authoritative NS and SOA before mutation | Permanent 301 or 308 redirect to the same path and query on `https://ctrl.mindmake.co`. |

Do not create a wildcard DNS record. Do not point `content.mindmake.co` or `ctrl.mindmake.co` at the public-site project. Do not change nameservers merely to add a record.

After the publication domain is verified, `/signal` redirects permanently to `https://content.mindmake.co`. Before changing `/builder-economy`, check whether `thebuildereconomy.com` remains a live Krish-owned property. Preserve that destination if it is live and owned; otherwise redirect `/builder-economy` to `https://content.mindmake.co`. Record the DNS, HTTP and ownership evidence so no new preference question is required.

The audit-time local query for `mindmake.co` failed. Gate C is blocked until NS and SOA resolve consistently through at least two public resolvers, such as `1.1.1.1` and `8.8.8.8`. Treat every recorded DNS observation as a snapshot, not a permanent fact.

## Known non-secret project identity

- Repository: `https://github.com/krishanraja/mindmaker.git`
- Release branch: `codex/mindmake-homepage-mock`
- Public Vercel project: `mindmake`
- Vercel project ID: `prj_GqamX3psD0cGpGCDXRu0ljET7zap`
- Vercel team ID: `team_iXZBozK4Ss7NHuyNk8L9wmO6`
- Currently linked Supabase project: `Mindmaker AI`
- Supabase project ref: `bkyuxvschuwngtcdhsyg`
- Supabase organisation ID: `pqsqsonazzxmkqajbwpk`

The linked Supabase project is not a preview sandbox. Treat it as production until the dashboard proves otherwise. Never apply the new migration to it during preview testing.

## Access bundle

Ask once for access or login help, not for product decisions. The required bundle is:

1. GitHub push and pull-request access to `krishanraja/mindmaker`.
2. Vercel access to team `team_iXZBozK4Ss7NHuyNk8L9wmO6` and project `mindmake`.
3. DNS access for `mindmake.co` and `themindmaker.ai`, wherever their authoritative nameservers resolve.
4. Supabase access to the linked production project and permission to create or use a separate non-production project or database branch.
5. Resend access for `mindmake.co` sender verification and transactional logs.
6. Access to the launch-default operator mailbox `krish@mindmake.co`, or authority to create/route it, plus two synthetic test inboxes. If it cannot receive mail, pause at Gate B for alias creation or confirmation of another recipient.
7. Substack publication-owner access for `mindmakerlive.substack.com` and its custom-domain settings.
8. Access to the hosting project that currently serves CTRL and DNS access for both CTRL hostnames.
9. API keys already required by the selected company-enrichment providers. Missing optional providers must degrade to the tested safe read, not block a submission.

Never paste credentials into Markdown, source, screenshots, shell history or provider support tickets. Store Vercel values in the correct Preview or Production environment and Edge Function values in the correct Supabase project. Keep an out-of-band inventory recording only each secret name, owner, environment and rotation date.

## Environment matrix

| Environment | Front end | Database and function | Email | Domains |
|---|---|---|---|---|
| Local | Flag off by default | Local Supabase or mocks | Never a real customer | `127.0.0.1` only |
| Preview | Immutable Vercel branch deployment with one stable branch alias | Existing isolated non-production Supabase project if one is found; otherwise a new `mindmake-preview` project after cost approval | Synthetic inboxes only | Vercel preview hostname only |
| Production staged | Production Supabase migration and function deployed, public flag still off | Linked production project | Controlled synthetic operator inbox, then one controlled receipt at the approved operator mailbox | Existing public domain unchanged |
| Production live | Immutable promoted Vercel deployment, then a second immutable deployment with V2 enabled | Linked production project | Verified visitor plus approved operator mailbox | Final topology in the table above |

For strict CORS, use the stable branch-preview origin, not an ephemeral deployment URL that changes every build. Configure exact origins only. Production allowed origins are `https://mindmake.co` and `https://www.mindmake.co`; the latter is included because a browser can reach it before redirect completion. Do not allow `*.vercel.app` or `*`.

### Exact environment contract

Front-end Preview values:

- `VITE_SUPABASE_URL`: isolated preview Supabase URL;
- `VITE_SUPABASE_PUBLISHABLE_KEY`: isolated preview anon/publishable key;
- `VITE_SUPABASE_PROJECT_ID`: isolated preview project ref;
- `VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED`: `false` for the first immutable preview, then `true` only for the separately verified V2 preview.

Front-end Production values use the linked production Supabase project. Keep `VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED=false` until Gate E. These are Vite build-time values, so every change requires a new immutable build and verification.

Edge Function values, separately configured in Preview and Production:

- `SUPABASE_URL`;
- `SUPABASE_SERVICE_ROLE_KEY`;
- `RESEND_API_KEY`;
- `MINDMAKE_RATE_LIMIT_SALT`;
- `MINDMAKE_VERIFICATION_SECRET`;
- `MINDMAKE_BRIEF_FROM`;
- `MINDMAKE_OPERATOR_EMAIL`;
- `MINDMAKE_PUBLIC_URL`;
- `MINDMAKE_ALLOWED_ORIGINS`;
- the optional enrichment-provider keys actually selected for `enrich-company`, as listed in `.env.example` and file 04.

Do not reuse Preview values in Production. Do not expose an Edge secret through a `VITE_` variable.

## Execution state machine

### 0. Freeze and inventory the current state

Before changing an external system:

1. Run phases 0 to 2 in `04_CONTINUATION_PLAN.md`.
2. Record the branch commit, frozen hashes, current production deployment ID and current production URL.
3. Export or screenshot the Vercel project domains, redirects and environment-variable names.
4. Resolve and save current NS, A, AAAA, CNAME, MX, TXT and CAA records for all seven hostnames in the topology.
5. Record the current DNS provider, TTLs and which service currently answers each hostname.
6. Export the Supabase migration list, deployed-function list, function version and secret names without values.
7. Record Resend domain status, sender status and the current SPF, DKIM and DMARC records.
8. Record the Substack publication URL and custom-domain state.
9. Record the current CTRL hosting project, production deployment and health URL.

Useful read-only checks on Windows:

```powershell
Resolve-DnsName -Type NS mindmake.co
Resolve-DnsName -Type NS themindmaker.ai
Resolve-DnsName -Type MX mindmake.co
Resolve-DnsName -Type TXT mindmake.co
Resolve-DnsName mindmake.co
Resolve-DnsName content.mindmake.co
Resolve-DnsName ctrl.mindmake.co
```

Use `vercel --help`, `vercel domains --help`, `vercel dns --help` and `supabase --help` before issuing a mutating CLI command. Provider CLIs change; do not guess a flag from memory.

### 1. Create an isolated backend preview

1. Use an existing isolated non-production Supabase project if one is found. Otherwise create `mindmake-preview` in organisation `pqsqsonazzxmkqajbwpk` only after access and any provider cost are approved. Never use the linked production project for preview evidence or rely on a short-lived database branch for release evidence.
2. Apply all repository migrations in order, including `20260826123007_mindmake_brief_requests.sql`.
3. Deploy the browser-invoked `enrich-company` function and `submit-mindmake-brief`; confirm their local `_shared` imports are bundled. Do not deploy unrelated legacy functions.
4. Configure only preview secrets and a preview-only operator inbox. Set `MINDMAKE_PUBLIC_URL=https://<stable-preview-alias>` and `MINDMAKE_ALLOWED_ORIGINS=https://<stable-preview-alias>` using the real stable preview alias.
5. Run database lint and security advisers.
6. Prove anon and authenticated browser roles cannot read the private lead table or call private RPCs.
7. Preserve a machine-readable record of migration version, function version and adviser results.

### 2. Create the immutable front-end preview

1. Push the checkpoint branch after reviewing the staged files and secret scan.
2. Create a Vercel branch preview linked to project `mindmake`.
3. Assign or use one stable branch alias and add only that exact origin to preview `MINDMAKE_ALLOWED_ORIGINS`.
4. Keep `VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED=false` for the first preview.
5. Complete the flag-off front-end checks from files 04 and 05.

### 3. Verify private lead V2 in preview

After the flag-off preview passes:

1. Set the preview browser Supabase values to the isolated backend.
2. Enable `VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED=true` for a second immutable preview deployment.
3. Run the full V2 matrix in file 04 with synthetic companies and inboxes.
4. Inspect the visitor HTML email, operator email and downloadable brief at 320, 390 and 1440 pixels where applicable.
5. Verify the operator email contains the exact selected inputs, server-owned company read, recommendation, consent version, delivery state and a stable request ID. It must not pretend browser-authored copy is researched truth.
6. Verify visitor and operator deliveries are independently idempotent.
7. Confirm the newsletter checkbox remains optional and unticked and records interest only. It must not subscribe anyone automatically.
8. Save redacted provider logs and request IDs as release evidence outside the repository.

Also run the abuse and boundary matrix:

- missing, malformed and unknown Origin;
- CORS preflight from the exact allowed origin;
- wildcard-origin rejection;
- direct unauthenticated requests can do no more than the deliberately public request-and-verify protocol and never gain table or RPC access;
- invalid JSON and unsupported method;
- oversized body;
- populated honeypot;
- malformed email, domain, request ID, route and choice ID;
- same request ID with a changed payload;
- email, internet-address and combined rate limits;
- five wrong codes, expiry and reuse after success;
- response and logs contain no code, service key, raw internet address, raw user agent or provider secret.

Verify in preview whether the platform supplies and sanitises `x-forwarded-for`. Document the result. Do not describe the internet-address rate limit as strong protection if a direct caller can spoof that header.

The function may remain unauthenticated at the Supabase gateway only because its own browser-origin isolation, payload, honeypot, rate-limit, verification and private-RPC controls are all tested. CORS does not authenticate a non-browser client, so rate limits, verification and private database boundaries remain mandatory. Do not weaken those controls to make preview work.

### 4. Implement retention and deletion before enabling production V2

Use this proposed release default, pending explicit privacy and legal approval at Gate B. Do not publish these periods or enable the purge job until approved:

- unverified requests: delete after 7 days;
- rate-limit event hashes: delete after 48 hours;
- verified request, consent and delivery records: delete 12 months after their last update;
- valid deletion request: delete earlier after identity verification, except any record separately retained under a documented legal obligation outside this lead table.

After approval, implement a private, idempotent scheduled database or Edge routine using the currently supported Supabase scheduling mechanism. It must not accept public browser invocation. Test boundary dates, retries and partial failure. At launch, deletion requests use the published email address and a manually verified private admin process. Do not build a public deletion endpoint unless separately scoped. Update the privacy notice to state the approved periods and real deletion process. A required shorter period changes configuration and copy, not the product flow.

### 5. Prepare email identity without disrupting normal mail

The launch default, subject to mailbox access and Resend-domain verification, is:

- sender: `Mindmake <briefs@mindmake.co>`;
- Reply-To for verification and visitor emails: `krish@mindmake.co`;
- operator email To: `krish@mindmake.co`, with the verified visitor email as Reply-To;
- visitor recipient: the verified address supplied in the brief.

First verify that the operator mailbox exists or create/route it without disrupting existing mail. Then verify `mindmake.co` in Resend with the exact current provider-issued records. Preserve existing MX and the current DMARC policy. Do not silently weaken or strengthen DMARC. Add only provider-issued DKIM, return-path and required SPF values. Never create a second SPF record at the same owner. If no DMARC record exists, propose `p=none` for separate email-admin approval. Test SPF, DKIM and DMARC alignment in a synthetic inbox before any customer mail.

Update `.env.example` and deployment documentation so the symbolic operator default is `krish@mindmake.co`, not `operator@mindmake.co`. Do not commit the real API key.

### 6. Prepare source, crawler and redirects for the final publication domain

Before the release candidate:

1. Replace the active public publication destination with `https://content.mindmake.co`.
2. Update `/signal` to a one-hop permanent redirect there. Resolve `/builder-economy` through the recorded live-property check above.
3. Keep the Substack origin only in operational documentation and fallback tests, not as the public brand URL.
4. Keep the homepage's one plain `Read and subscribe` link. Do not add an embedded form, second marketing database or second subscriber relationship.
5. Regenerate sitemap, crawler text, prerender output and social metadata.
6. Verify no active source points to `ctrl.themindmaker.ai` or presents `mindmakerlive.substack.com` as the branded public destination.
7. Preserve historical mentions only inside clearly archived evidence.

### 7. Complete release-candidate QA and hygiene

Run phases 5 to 7 in file 04 and the full checklists in file 05. Perform cleanup only after the verified preview. Do not change frozen output while removing dead files.

The release candidate is ready only when:

- automated, preview, provider, content, accessibility and physical-device evidence passes;
- the exact cleanup diff is reviewable;
- no secret or private inbox data is staged;
- all public canonical URLs use `mindmake.co`;
- V2 preview is proven but the production flag remains off;
- rollback identifiers have been recorded.

### Approval gate A: merge

Present the preview URL, commit, tests, device evidence, V2 evidence and cleanup diff. Obtain explicit approval to merge to `main`. Merge only the reviewed branch.

### Approval gate B: production backend

Obtain explicit approval to apply the production migration, configure production secrets and deploy the production Edge Function. Gate B also approves or amends the proposed retention periods, private purge mechanism, deletion process, launch mailbox and matching privacy wording. Keep the public V2 flag off.

Then:

1. Link deliberately to Supabase ref `bkyuxvschuwngtcdhsyg` and confirm the displayed project name before every mutating command.
2. Back up the affected schema and record current migration/function state.
3. Apply only reviewed, forward-compatible migrations.
4. Deploy the exact preview-tested function commit.
5. Configure production secrets and exact origins.
6. Run direct synthetic production tests from an allowed origin without exposing the flow publicly. Initially use a controlled synthetic operator inbox. After that passes, set `MINDMAKE_OPERATOR_EMAIL` to the approved operator mailbox, redeploy and confirm one final controlled operator receipt before V2 can be enabled.
7. Do not drop the new table during rollback; disable entry and preserve evidence.
8. Configure an operational alert or documented daily check for function failures, rate-limit spikes, Resend bounces and failed operator delivery. A provider-accepted `queued` result is not proof of inbox delivery. A delivery webhook is not required for launch; use Resend logs and the documented daily check initially, then scope webhook-driven delivery state separately if it becomes useful.

### Approval gate C: public-site promotion and core domains

Obtain explicit approval to promote the reviewed production build and change the core domains.

1. Promote the exact immutable release-candidate deployment, not a fresh unreviewed build.
2. Keep V2 off.
3. Verify the Vercel project answers on its provider URL.
4. Attach `mindmake.co` to project `mindmake` using the provider-issued DNS instructions.
5. Configure `www.mindmake.co` as a domain-level permanent redirect to the apex, preserving path and query.
6. Reconfirm authoritative NS and SOA through at least two public resolvers and confirm that Cloudflare still serves `themindmaker.ai`. Configure one tested Cloudflare permanent 301 or 308 redirect rule covering the apex and `www`, preserving path and query and pointing to `https://mindmake.co`. Reject temporary 302 or 307 behaviour. Keep the proxied DNS records needed for Cloudflare to receive both hosts.
7. Do not duplicate host redirects as pathname redirects in `vercel.json`.
8. Wait for DNS and certificates, then run the post-cutover matrix below.
9. Verify any analytics project, consent configuration and allowed-domain list recognises `mindmake.co` and does not create duplicate sessions across redirected hosts.

If the current DNS provider permits and timing allows, lower only the affected record TTL before cutover and restore it after stability. Never replace nameservers without exporting every existing record and proving email will survive.

### Approval gate D: publication and CTRL subdomains

Obtain explicit approval to alter the publication and CTRL hostnames.

Publication:

1. Confirm the current Substack custom-domain fee and obtain spend approval before enabling it. Then request `content.mindmake.co` as the custom domain.
2. Add the exact DNS record Substack currently supplies. Do not hardcode a remembered CNAME target.
3. Verify the certificate, publication pages, subscribe flow and email links.
4. Keep `mindmakerlive.substack.com` working as provider fallback.

CTRL:

1. Discover the existing CTRL production project from the hosting account and confirm it by loading the real product and health route.
2. Attach `ctrl.mindmake.co` to that project only.
3. Verify auth, cookies, API calls, CORS, callback URLs and deep links before redirecting the old hostname.
4. Only after login, callback URLs, cookie scope, storage access, API calls, deep links and one core authenticated workflow pass on `ctrl.mindmake.co`, add `ctrl.themindmaker.ai` to the tested Cloudflare permanent 301 or 308 redirect rule. Preserve path and query and reject temporary 302 or 307 behaviour. Keep its proxied DNS record only as required for Cloudflare to receive the host.
5. Do not migrate CTRL code, database or auth as part of this website release.

### Approval gate E: enable production V2

After the site and domains are stable, obtain explicit approval to enable private lead delivery.

1. Build a second immutable production deployment from the same reviewed commit with `VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED=true`.
2. Verify its provider URL and exact production-origin configuration.
3. Promote that immutable deployment.
4. Submit one synthetic end-to-end lead from `mindmake.co`.
5. Confirm visitor email, operator email, database state, consent record and no duplicate delivery.
6. Delete or label the synthetic lead according to the retention test procedure.

## Post-cutover verification matrix

Run from more than one network and on physical iOS and Android:

```text
https://mindmake.co/
https://mindmake.co/ai-brain
https://mindmake.co/ai-gtm
https://mindmake.co/case-studies
https://mindmake.co/privacy
https://www.mindmake.co/ai-brain?utm_source=cutover
https://themindmaker.ai/ai-gtm?utm_source=cutover
https://www.themindmaker.ai/case-studies?utm_source=cutover
https://content.mindmake.co/
https://ctrl.mindmake.co/
https://ctrl.themindmaker.ai/<known-deep-path>?utm_source=cutover
http://themindmaker.ai/path?q=1
http://www.themindmaker.ai/path?q=1
```

Verify:

- final URL, status chain and path/query preservation;
- one redirect hop after HTTP-to-HTTPS;
- permanent 301 or 308 redirect behaviour for legacy and canonical-host redirects, never 302 or 307;
- valid certificate and no mixed content;
- correct canonical, title, robots and sitemap;
- no cache serving the former brand or former deployment;
- public contact and privacy addresses work;
- transactional email authenticates;
- Substack subscribe flow uses the existing publication;
- CTRL login, session, API and a known deep link work;
- Start here works flag-off or V2-on exactly as approved;
- logs show no new 4xx/5xx spike.

## Rollback contract

Rollback is per surface. Do not reverse a healthy surface merely because another fails.

| Failure | Immediate rollback |
|---|---|
| Public-site regression | Promote the recorded prior Vercel production deployment. Leave DNS attached if the prior deployment is healthy there. |
| Core-domain or certificate failure | Restore the recorded prior DNS/domain configuration and keep the provider preview URL available to Krish. |
| Old-domain redirect error | Remove or correct only the redirect-domain configuration; do not roll back the public site. |
| Publication custom-domain failure | Restore the prior DNS record and use `mindmakerlive.substack.com` until corrected. |
| CTRL custom-domain failure | Restore the prior CTRL alias/DNS and leave `ctrl.themindmaker.ai` serving the product until the new host is healthy. |
| V2 front-end failure | Promote the last flag-off deployment immediately. |
| V2 function or provider failure | Keep or restore the flag-off front end. Revert the function to the recorded previous version if needed. Do not drop lead tables. |
| Transactional-email failure | Keep V2 off. Repair sender authentication or provider configuration, then repeat the full synthetic matrix. |

Record the action, time, operator, provider response and verification result for every rollback.

`VITE_` values are build-time settings. Changing an environment value alone does not disable V2. Promote the known flag-off build, or rebuild and verify it, before claiming that rollback is complete.

## Final cleanup and documentation closure

After at least 24 stable hours covering a complete synthetic lead and normal site use:

1. Run the hygiene plan in file 05.
2. Replace contradictory active domain, brand, booking, offer, publication and CTRL instructions with the current topology.
3. Archive historical files that still explain rejected choices; remove only proven-dead code and assets.
4. Regenerate all crawler and social files.
5. Update `MINDMAKE_CANON.md`, `REBUILD_STATE.md`, `DEPLOYMENT.md`, `ARCHITECTURE.md`, `MINDMAKE_LEAD_DELIVERY_SPEC.md`, QA evidence and project README.
6. Record final deployment IDs, migration version, function version and DNS topology without secrets.
7. Run the contradiction scan, route crawl, tests, typecheck, build and lint comparison again.
8. Leave the repository clean and the final status report explicit about any legacy lint debt.

## Completion report

The handover is complete only when the final report includes:

- merged commit and GitHub review link;
- preview and production deployment IDs;
- automated and physical-device evidence;
- production Supabase migration and function versions;
- redacted visitor/operator email evidence;
- exact domain topology and DNS provider;
- redirect and certificate evidence;
- publication and CTRL verification;
- V2 flag state;
- cleanup diff and archive index;
- rollback identifiers;
- remaining issues, each with owner and severity.
