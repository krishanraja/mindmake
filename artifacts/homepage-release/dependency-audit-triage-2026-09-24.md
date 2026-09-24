# Frozen release dependency audit

Date: 2026-09-24. Authority: user explicitly approved sending dependency names and versions to npm for a read-only audit. No dependency installation, update, exploit reproduction, application scan or deployment was performed.

Lockfile SHA256: `9fb55248d147c8c0802389a2c1cdbec4bc1aa4e3c70024b3a0836a3f7bc69b10`, unchanged after audit.

`npm audit --json` returned 23 vulnerable package entries: 16 high, 5 moderate, 2 low, 0 critical. These are package entries, including inherited dependency effects, not 23 independently reachable production flaws. A second read-only invocation compacted the result with locked versions; it confirmed the same inventory.

Complete machine-readable evidence: `artifacts/homepage-release/dependency-audit-2026-09-24.json`. A third read-only invocation retained the entire npm response, including every package-to-advisory mapping, affected range, severity, dependency effect, installed path and fix recommendation. It again returned the same 23-entry totals; exit code 1 indicates findings, not an audit transport failure.

## Release interpretation

No confirmed visitor-reachable publication blocker was established by this bounded advisory and source review. This is not a clean audit, a penetration test, or a claim that the application has no vulnerabilities. Record the unresolved dependency debt and schedule a separately tested update. Do not run an indiscriminate `npm audit fix --force` against the approved release.

The website is static Vite output. `src/entry-server.tsx` is used by build-time prerendering, not a deployed request-serving Node SSR process. No local `api/` or `.vercel/output/functions` directory exists. Supabase Edge Functions are a separate dependency/runtime surface and are not cleared by this npm audit.

## Visitor-runtime candidates

| Package | Locked version | Applicability finding |
| --- | --- | --- |
| `@remix-run/router` | 1.23.1 | High loader/action redirect advisory explicitly excludes declarative `BrowserRouter`. App uses `BrowserRouter`, no Data Router loaders/actions. |
| `react-router` | 6.30.2 | SSR error-deserialization advisory explicitly excludes declarative mode. Other navigation advisories require attacker-supplied destinations. Inspected destinations are fixed routes, checked-in article links, or current-location objects; no open-redirect parameter was found. This is a bounded source finding, not a proof of unreachability. |
| `react-router-dom` | 6.30.2 | Shares router findings and an additional open-redirect/XSS advisory. Same destination analysis applies. Browser delivery means this cannot be dismissed merely as a development dependency. |
| `ws` | 8.18.3 | Node WebSocket dependency through Supabase realtime. No application realtime/channel/transport usage found. Upstream locked Supabase 2.89.0 selects native browser WebSocket; the Node `ws` implementation is not an exposed website WebSocket server. |

Maintainer sources:

- [Loader/action redirect advisory and BrowserRouter exclusion](https://github.com/remix-run/react-router/security/advisories/GHSA-2w69-qvjg-hvjx)
- [Additional router advisory and BrowserRouter exclusion](https://github.com/advisories/GHSA-2j2x-hqr9-3h42)
- [SSR constructor advisory and declarative-mode exclusion](https://github.com/remix-run/react-router/security/advisories/GHSA-337j-9hxr-rhxg)
- [Untrusted navigation destinations](https://github.com/remix-run/react-router/security/advisories/GHSA-wrjc-x8rr-h8h6)
- [Open redirect/XSS advisory](https://github.com/remix-run/react-router/security/advisories/GHSA-jjmj-jmhj-qwj2)
- [Locked Supabase 2.89.0 native WebSocket selection](https://raw.githubusercontent.com/supabase/supabase-js/v2.89.0/packages/core/realtime-js/src/RealtimeClient.ts)

Source inspected: `src/App.tsx`, `src/entry-server.tsx`, `src/hooks/useLeadBriefHistory.ts`, `src/hooks/useBlogPosts.ts`, `src/pages/BlogPost.tsx`, navigation call sites and package-lock parent relationships. Blog content comes from checked-in `src/data/blogPosts`, not a public authoring endpoint.

## Build/test findings: remaining 19 package entries

| Group | Packages and locked versions |
| --- | --- |
| Development/test server and browser harness | Vite 5.4.21 and nested 8.0.3; esbuild 0.21.5 and 0.27.7; Vitest 4.1.2; @vitest/mocker 4.1.2 |
| Compiler, configuration and filesystem tooling | @babel/core 7.28.5; @humanfs/node 0.16.7; baseline-browser-mapping 2.9.11; browserslist 4.28.1; brace-expansion 1.1.12/2.0.2; minimatch 3.1.2/9.0.5; flatted 3.3.3; js-yaml 4.1.1; rollup 4.54.0 |
| CSS and asset tooling | nanoid 3.3.11 via PostCSS; picomatch 2.3.1/4.0.3; postcss 8.5.8; postcss-selector-parser 6.1.2; sharp 0.34.5 |
| Test HTTP implementation | undici 7.24.7 via jsdom |

These findings involve development-server reads, build/test input processing, filesystem traversal, parser resource exhaustion or image-processing libraries. Static hosting does not run these services against visitor requests. They still matter for developer machines, CI and future processing of untrusted source/configuration/images. Keep development/test servers inaccessible to untrusted networks; do not treat static-deployment non-applicability as permission to retain vulnerable tooling indefinitely. Some build packages are labelled production dependencies in the lockfile; labels alone do not establish browser exposure.

## Minimal remediation direction, not executed

1. Router patch 6.30.6 addresses the listed 6.x open-redirect/XSS patch line, but does not clear every advisory: current maintainer entries for the navigation bypass and SSR constructor issue list 7.18.0 as patched. A full router upgrade needs a separate compatibility and navigation regression pass; do not claim that a 6.x patch clears all findings.
2. Refresh compatible transitive build/test packages and verify audit again. Audit proposes Vite 8.3.1 and sharp 0.35.4 as semver-major changes relative to current declarations; those require their own build/test gate.
3. Preserve lockfile identity and use a clean `npm ci` release environment. The local installed tree is not identical to the frozen lock: inspected Supabase is locally 2.116.0 while locked at 2.89.0. Locked source was checked upstream where necessary. Clean CI evidence must be authoritative for this release.

Limits: no exploit attempts, no complete dependency-call-graph proof, no independent native-library analysis, no registry-integrity or supply-chain attestation, and no Supabase/Deno dependency audit. This report supports an explicit release-risk decision, not a blanket security pass.
