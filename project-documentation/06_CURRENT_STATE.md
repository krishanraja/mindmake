# Mindmake current state

Last updated: 28 August 2026.

This file is the current delivery truth for `mindmake.co`: what is live, at which identifiers, and what remains open. Why the business exists is in `00_NORTH_STAR.md`. Commercial truth is in `01_CANON.md`. Design truth is in `03_DESIGN_CONTRACT.md`.

## Where the rebuild stands

The three public pages have been rebuilt: the homepage, `/ai-brain` and `/ai-gtm`. The work is on branch `claude/site-rebuild-nd6z4u` and is **not promoted**. Production still serves the previous site.

The backend the rebuild needs **is** live, because it was deployed and verified against production while the pages were being built. That split is deliberate and safe: the extended `get-ai-news` returns its previous response byte for byte when called the old way, and the new functions have no caller until the new pages ship.

- Site status: **LIVE (previous build), REBUILD AWAITING REVIEW**. `https://mindmake.co` launched 26 August 2026.
- Production: merge `8955fbae4a311dbfc62fceef5f65c3edf98a2343` (pull request #149), Vercel deployment `dpl_3taKirknuFu5SwsNL4p47ZjWvFts` on project `mindmake` (`prj_GqamX3psD0cGpGCDXRu0ljET7zap`).
- Rollback target: `dpl_Avfe2NCnTPxK35MyfbBNDH6y4Sy1`.
- Domains are unchanged: `mindmake.co` is canonical (Vercel DNS); `www.mindmake.co`, `themindmaker.ai` and `www.themindmaker.ai` 308-redirect to the apex in one hop with path and query preserved. The publication stays at `https://mindmakerlive.substack.com`. CTRL serves at `ctrl.mindmake.co`.
- Routes did not change. The rebuild replaced what the three pages say and how they behave, not the route contract, so every redirect and crawler surface keeps its shape.

## What a visitor can do

Two doors, one paid proof, and two ways to be read.

- **The company read** (`/ai-gtm`): a visitor types their company website and the existing brief pipeline reads it, unchanged. This is the Gate E hand-off approved on 27 August 2026, reached from a new place.
- **The personal read** (`/ai-brain`): a visitor gives a public profile and two answers, sees their first week composed on the page immediately, and can have it emailed. The preview is composed in the browser from the same template the function uses, so it needs no network round trip and cannot stall.
- **The live board** (`/ai-gtm#board`): what moved in AI today, grouped by the four levers, read from the daily cache. It states its own age, marks itself as yesterday's read after 26 hours, and collapses to a heading and one honest line if the read is unavailable. It never renders an empty frame.

Every visitor who converts receives exactly two emails: the results they asked for, and one follow-up fourteen days later. Nothing else, ever. The mechanism is a unique row per address per journey, not a policy anyone has to remember.

## Lead and data backend

Supabase project `bkyuxvschuwngtcdhsyg`.

| Function | Version | verify_jwt | Role |
|---|---|---|---|
| `submit-mindmake-brief` | v12 | off | The company read. **The deployed body is still `main`'s.** The repository adds a day-14 enqueue that is deliberately not live yet: see open item 2 |
| `enrich-company` | v36 | on | Declarative synthesis and tailored choices |
| `get-ai-news` | v67 | off | Restored to the repository and extended with `{view:"board"}`. No body still returns the previous shape byte for byte |
| `mindmake-personal-read` | v2 | off | The personal read: enrichment, the one results email, the follow-up enqueue |
| `send-follow-ups` | v2 | off | The day-14 follow-up. Cron only |
| `aa-price-snapshot` | v1 | off | Daily model prices. Cron only |

- Migrations added: `mindmake_follow_up_and_personal_read`, `aa_model_snapshots`, `mindmake_scheduled_jobs`, `mindmake_public_rpc_wrappers`. All four are idempotent and all four are registered in the remote migration history, so the repository and the database agree.
- New tables are RLS-on with no policies, reachable only by the service role. No existing policy was loosened and no anon policy was added to anything.
- Scheduled jobs: `mindmake-brief-retention-daily` (`17 2 * * *`), `mindmake-follow-up-daily` (`20 9 * * *`), `mindmake-aa-price-snapshot-daily` (`0 11 * * *`). The two new jobs call their function over HTTP with the Vault secret `mindmake_cron_secret` in the `x-mindmake-cron-secret` header, and each function refuses without it. This is the pattern the project's eight existing jobs already use.
- Price history: 624 rows for 28 August 2026, the first day. This is the one thing here that cannot be back-filled, which is why it runs before anything renders it.
- Configuration names are unchanged from Gate E, plus `MINDMAKE_CRON_SECRET` for the two scheduled functions.
- Retention: unverified brief requests purge after 7 days, rate-limit hashes after 48 hours, verified records at 12 months, sent follow-up rows after 7 days, unsent rows after 60 days, personal reads at 12 months. The privacy notice states the same schedule.

## Verification baselines

- Tests: **170 across 16 files**, all passing. `tsc` clean.
- Lint: **0 errors, 2 warnings** (react-refresh advisories in two long-standing files). Down from four. Do not add new problems.
- Build: prerenders **21 indexed routes**; the sitemap and prerender parity check runs inside the build.
- Browser gates, run against the built output at 1440px and 390px:
  - **Aliveness**: every viewport-height of all three pages holds at least one ambient element in motion. Clean at both widths.
  - **Keyboard**: every tabbable element shows a visible focus ring. Clean at both widths.
  - **Layout**: no horizontal overflow, no console errors, exactly one `h1` per page, touch targets at or above the comfortable minimum.
  - **Reduced motion**: nothing animating, counters at their final figures.
  - **Board honesty**: verified in all three states (live, older than 26 hours, and unavailable) against a real captured cache payload.
  - **Film playback**: all five ambient loops decode and play when scrolled into view, and a reduced-motion visitor has no video element mounted at all. Chromium pauses an offscreen muted loop and resumes it on view, which is the browser doing the right thing rather than a fault.
- The two-email cap was proven rather than asserted: three successful sends to one address produced exactly one queue row, and the fourth was rate-limited. Test rows were deleted afterwards.
- There are no frozen SHA-locked surfaces any more. The V5 motion study, the gateway candidate and the V8 mock were deleted with their locks; the brief supersedes their contracts and git history preserves the files.

## Names you will meet, and what they are

None of these is a brand. They are identifiers that exist in live infrastructure
or in the project's own history, and they are listed so nobody has to guess.

| You will see | What it is |
|---|---|
| `themindmaker.ai` | An older domain that 308-redirects to `mindmake.co`. It runs Google Workspace, so `krish@themindmaker.ai` is the only mailbox that actually receives, which is why the site's contact links point there. |
| `mindmakerlive.substack.com` | Where the publication is hosted. An address, not a name. |
| `Mindmaker LLC` | The registered legal entity. It appears in the privacy notice and the terms and nowhere else. |
| `Mindmaker AI` | The Supabase project's display name in that dashboard. Cosmetic, and renaming it is not worth a migration. |
| `makeyourmindup.ai` | An older CTRL host. `ctrl.themindmaker.ai` still redirects there; open item 8 is to repoint it at `ctrl.mindmake.co`. |
| `mm-ctrl` | The Vercel project that serves CTRL. Not this repository. |
| `/signal`, `/builder-economy` | Retired routes that now redirect to the publication. They were earlier names for editorial strands; the publication's only channels are The Money of AI and Built with AI. |
| `get-model-data` | A deployed edge function with no caller in this repository. Open item 6. |
| `aa-price-snapshot`, `ARTIFICIALANALYSIS_API_KEY` | The daily price recorder and its data source, Artificial Analysis, a published model price and benchmark index. |
| `Gate E` | The owner's approval, on 27 August 2026, that the private email hand-off could go live. The gate letters are a historical sequence and only E still matters. |
| `Legacy Ascend` | The programme a named reference took part in, and the consent record her quotes are gated on. If that record is missing, the quotes do not render. |
| `Lightning Lesson` | A third-party teaching format the founder has run, counted in the evidence trail for the retired reach claim. |
| `mind/make` | The wordmark as it is set in the header, with a slash. It is a typographic treatment of Mindmake, not a second name. |
| The enemy pair, the ladder, the fork, the board | Homepage and door-page sections. The enemy pair is the oracle and the mirror cards resolved by one claim; the ladder is the three levels of value; the fork is the paper band where a visitor picks a starting point and nothing is stored; the board is the live daily market read on `/ai-gtm`. |

## Open items

1. **Promotion is Krish's call.** The branch is pushed and reviewed by pull request; nothing is promoted automatically.
2. **`submit-mindmake-brief` needs one redeploy, at launch and not before.** The repository version enqueues the day-14 follow-up; the deployed v12 does not, so nothing is being queued today and `follow_up_queue` is empty. That ordering is deliberate rather than an oversight: the enqueue creates an obligation to send an email the currently published privacy notice does not describe, and the notice that does describe it ships with this rebuild. Deploy the function in the same step as promoting the build, so the promise and the mechanism go live together. Until then the two paths hold: `mindmake-personal-read` enqueues its own rows but has no caller until `/ai-brain` ships, and `send-follow-ups` drains a queue that is empty.
3. **The branded mailboxes do not exist yet, and the site does not pretend they do.** `mindmake.co` has no MX record, so `hello@mindmake.co` and `privacy@mindmake.co` would bounce. Every contact link therefore reads one constant, `CONTACT_EMAIL` in `src/lib/publicLinks.ts`, currently set to the mailbox that does receive. To switch: add the MX record, create the two aliases, change that one constant.
4. **The films are the real delivery.** Six films landed on 28 August 2026, each with an mp4, a webm and a poster taken from its own first frame. Loops are silent and under 1.7MB; the sixty-second proof film on `/ai-brain` is click-to-play and fetches nothing until asked. A twenty-second cut of the proof film also exists in the delivery and is not used on the site yet.
5. **Credential rotation**: rotate the GitHub, Vercel, Supabase and Resend credentials shared during this and the launch sessions.
6. **`get-model-data` v24 is still deployed** with no caller in this repository. Retiring it needs CTRL-side confirmation first.
7. **Physical device checks**: iOS Safari, Android Chrome, VoiceOver and TalkBack remain a post-launch checklist; emulation evidence was accepted for launch.
8. **CTRL old host**: repoint `ctrl.themindmaker.ai` to `https://ctrl.mindmake.co` after one confirmed authenticated CTRL login on the new host.
9. The `themindmaker.ai` Resend domain still shows a failed verification; legacy senders on that domain stay unreliable until its DNS is repaired or the domain is retired from Resend.
