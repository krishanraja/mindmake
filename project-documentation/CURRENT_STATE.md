# Mindmake current state

Last updated: 27 August 2026.

This file is the current delivery truth for `mindmake.co`: what is live, at which identifiers, and what remains open. History lives in `DECISIONS_LOG.md`. Business truth lives in `MINDMAKE_CANON.md`. This file replaces the retired `REBUILD_STATE.md` chronicle.

## Live site

- Status: **LIVE**. `https://mindmake.co` launched 26 August 2026 and has since shipped the phone-native rebuild, the stepped door-page journeys, the intelligence lead journey with the branded proposal, and the repository cleanse.
- Production: merge `8955fbae4a311dbfc62fceef5f65c3edf98a2343` (pull request #149), Vercel deployment `dpl_3taKirknuFu5SwsNL4p47ZjWvFts` on project `mindmake` (`prj_GqamX3psD0cGpGCDXRu0ljET7zap`).
- Rollback target: `dpl_Avfe2NCnTPxK35MyfbBNDH6y4Sy1` (the previous production state, pull request #148).
- Recent production history: #146 stepped door journeys, #147 intelligence journey, proposal, marks and comparison, #148 tailored choices, emailed proposal and the declarative email redesign, #149 repository cleanse and the nine-voice testimonial deck.
- Domains: `mindmake.co` is canonical (Vercel DNS). `www.mindmake.co`, `themindmaker.ai` and `www.themindmaker.ai` 308-redirect to the apex in one hop with path and query preserved. The publication stays at `https://mindmakerlive.substack.com`; `/signal` and `/builder-economy` redirect there. CTRL serves at `ctrl.mindmake.co`.

## Conversion path (Gate E closed)

- The private email hand-off is **live**. Krish approved Gate E on 27 August 2026; production builds carry `VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED=true`.
- The journey: company website → declarative company read with tailored, server-signed pressure choices → one returned-time choice → the recommendation → work email → six-digit verification → the branded proposal on screen, emailed to the visitor with the self-contained document attached, and a private fit digest to Krish.
- Every stage is proven with synthetic leads against the production backend: request, code retrieval, confirmation, all three deliveries `delivered` in Resend, tamper rejection (400 `tailored_choice_invalid`), and the generic fallback when tailored choices are unavailable.
- The contract and boundaries are specified in `MINDMAKE_LEAD_DELIVERY_SPEC.md`.

## Lead backend

Supabase project `bkyuxvschuwngtcdhsyg`:

- Functions: `submit-mindmake-brief` v11 (verify_jwt off) and `enrich-company` v35 (verify_jwt on). These are the only two functions the site uses and the only two sources in the repository.
- Migrations: `20260826123007_mindmake_brief_requests` (private schema, RLS, service-role-only RPCs) and `20260826180000_mindmake_brief_retention` (daily purge via pg_cron).
- Configuration names (values live only in Supabase): `RESEND_API_KEY`, `MINDMAKE_RATE_LIMIT_SALT`, `MINDMAKE_VERIFICATION_SECRET`, `MINDMAKE_BRIEF_FROM` (`Mindmake <briefs@mindmake.co>`), `MINDMAKE_OPERATOR_EMAIL` (`krish@themindmaker.ai`), `MINDMAKE_PUBLIC_URL`, `MINDMAKE_ALLOWED_ORIGINS` (`https://mindmake.co,https://www.mindmake.co`), plus the enrichment provider keys.
- Email identity: `mindmake.co` verified in Resend; SPF, DKIM and DMARC pass. Visitor and verification emails carry Reply-To `krish@themindmaker.ai`; the operator digest goes to that mailbox with the verified visitor as Reply-To.
- Retention: unverified requests purge after 7 days, rate-limit hashes after 48 hours, verified records 12 months after last update. The privacy notice states the same schedule.
- Synthetic verification rows awaiting their scheduled purge (safe to delete earlier by hand): `3c654513…`, `e3f48245…`, `726f4073…`, `3a61bfc8-f83a-4556-a5a4-f7e519384684`, plus one unverified smoke request.

## Verification baselines

- Tests: 109 across 15 files, all passing. `tsc` clean. Production build prerenders 21 indexed routes.
- Lint: 0 errors, 4 warnings (react-refresh advisories in three long-standing files). Do not add new problems.
- Containment audit: 11 visible findings across the 9-route × 6-viewport matrix, all of them the approved gateway door-separation slide. Anything beyond that family is a regression.
- Frozen surfaces (SHA-256): the V5 motion study `DE09D75C46EB660AD6148C1D7F5DD61E4F82031B48FCFE931CC3AE05C8126C81`; the gateway contract files as pinned in `MINDMAKE_CANON.md` and `src/test/mindmake-public-contract.test.ts`.
- CSS surgery evidence (27 August 2026): all fourteen route frames at 390 and 1440 byte-identical before and after the orphan-rule removal.

## Open items

1. **24-hour stability closure**: confirm a stable first day of the launch, then close the dated GitHub issue.
2. **Physical device checks**: iOS Safari, Android Chrome, VoiceOver and TalkBack remain a post-launch checklist; emulation evidence was accepted for launch.
3. **CTRL old host**: repoint `ctrl.themindmaker.ai` to `https://ctrl.mindmake.co` after one confirmed authenticated CTRL login on the new host.
4. **Credential rotation**: rotate the GitHub, Vercel, Supabase and Resend credentials used during the launch and Round D sessions.
5. **Flow videos**: Krish will supply films of Brain and GTM flows in action. They slot into the existing `StepFilm` sources and posters as asset swaps; no code change is expected.
6. The `themindmaker.ai` Resend domain still shows a failed verification; legacy senders on that domain stay unreliable until its DNS is repaired or the domain is retired from Resend.
