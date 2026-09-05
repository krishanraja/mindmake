# Mindmake current state

Last updated: 5 September 2026.

This file is the current delivery truth for `mindmake.co`: what is live, at which identifiers, and what remains open. Why the business exists is in `00_NORTH_STAR.md`. Commercial truth is in `01_CANON.md`. Design truth is in `03_DESIGN_CONTRACT.md`.

## Where the rebuild stands

**The rebuild is live.** The homepage, `/ai-brain` and `/ai-gtm` were rebuilt, the six films were installed, and it was promoted to production on 28 August 2026.

- Site status: **LIVE**. `https://mindmake.co` launched 26 August 2026 and now serves the rebuild.
- Production: commit `0704583` on `main` (4 September 2026, "What a crawler and a share card are given"), Vercel deployment `dpl_5saD1mJed9NpT9oXA6wgGHSUPGnz` on project `mindmake` (`prj_GqamX3psD0cGpGCDXRu0ljET7zap`). Before it the same day, `fd8c07e` ("The wordmark and the mark are vectors") at `dpl_67GND784KVV4iQVSHPA9CpUXwp1g`; before that, `cf2b2d0` ("The curtain was never there") at `dpl_GQ7wCHKhhRK34Nf5EpxJ3bPRahHc`, then Krish's upload of the two brand exports at `dpl_CAPenq7T8BuRzAia2SrXKkY4fHhw`. Before those, commit `12ace5e` (3 September, the entrance and the story's spine) at `dpl_AFyoEwjLzuG3wr93xuXAYFhVay9a`, and before that the 28 August rebuild, merge `75572542094ddd4e702a877b258b9014f37415c1` (pull request #152) at `dpl_HAoncV1RF3hcvcanqo7Yvc4tuAng`.
- Rollback target: `dpl_HAoncV1RF3hcvcanqo7Yvc4tuAng`, the 28 August rebuild. Not `dpl_AFyoEwjLzuG3wr93xuXAYFhVay9a`: that build carries the 3 September curtain defect (the root as a fixed grid for a second after paint, and no curtain), and rolling back to it would ship that again.
- Verified live after promotion: all three pages 200 with their new headlines, both film formats and the posters served from the CDN, the sixty-second proof film reachable, one-hop 308 redirects from `www`, `themindmaker.ai`, `/signal` and `/library`, `llms.txt` and `sitemap.xml` 200, and the privacy notice carrying the corrected email wording and the working contact address.
- Domains are unchanged: `mindmake.co` is canonical (Vercel DNS); `www.mindmake.co`, `themindmaker.ai` and `www.themindmaker.ai` 308-redirect to the apex in one hop with path and query preserved. The publication stays at `https://mindmakerlive.substack.com`. CTRL serves at `ctrl.mindmake.co`.
- Routes did not change. The rebuild replaced what the three pages say and how they behave, not the route contract, so every redirect and crawler surface keeps its shape.

## What a visitor can do

Two doors, one paid proof, and two ways to be read.

Both doors ask for the same four things, in the same component, with the same rules: first name, last name, work email and the part of the business they work in. The company comes out of the email's domain, so nobody types it twice, and a personal address is refused on both sides with a message that puts the limitation on us rather than on the visitor. What each page does with those four things is different, and deliberately so.

- **The company read** (`/ai-gtm`): the details hand to the existing brief pipeline, unchanged, and the six-digit code still stands between the visitor and anything reaching us. This is the Gate E hand-off approved on 27 August 2026, reached from a new place. The proposal document is no longer rendered inside the dialog: it is built for the email and the attachment, and on screen it sat at the bottom of a scroll where nobody looked for it. The read the visitor came for is the preview step.
- **Every dead end** (site-wide): nine paths can fail, and each one now ends in
  an apology, a dry line about our own machine and one way to reach a person
  rather than in a line of grey text with nothing under it. The offer posts to
  `mindmake-personal-read`, which tells the operator and sends the visitor
  nothing, because two emails ever is a published promise and a handoff is
  neither of them. `05_LEAD_DELIVERY_SPEC.md` lists the nine, the two paths that
  deliberately have none, and the three things about the action that are there
  to stop it failing for the reasons the read did.
- **The personal read** (`/ai-brain`): the server resolves the company from the email domain and the person from their name plus that company, and the read assembles on screen in the same grid the company read uses. It used to want a LinkedIn URL, which most people have to go and find, and composed a preview locally from two template lines, so everyone who tapped the same chips saw the same thing. A read that resolves the company but not the person says so on the page rather than passing itself off as more than it is. The preview now costs a paid provider call, so it sits behind the same rate limiter the send does.
- **The live board** (`/ai-gtm#board`): what moved in AI today, grouped by the four levers, read from the daily cache. It states its own age, marks itself as yesterday's read after 26 hours, and collapses to a heading and one honest line if the read is unavailable. It never renders an empty frame.

Every visitor who converts receives exactly two emails: the results they asked for, and one follow-up fourteen days later. Nothing else, ever. The mechanism is a unique row per address per journey, not a policy anyone has to remember.

## Lead and data backend

Supabase project `bkyuxvschuwngtcdhsyg`.

| Function | Version | verify_jwt | Role |
|---|---|---|---|
| `submit-mindmake-brief` | v13 | off | The company read, plus the day-14 follow-up enqueue. Deployed from merged `main` on 28 August 2026 with its full import closure, and the deployed body verified to carry the enqueue |
| `enrich-company` | v36 | on | Declarative synthesis and tailored choices |
| `get-ai-news` | v68 | off | Restored to the repository and extended with `{view:"board"}`. No body still returns the previous shape byte for byte |
| `mindmake-personal-read` | v20 | off | The personal read: enrichment, the one results email, the follow-up enqueue, and the handoff every dead end on the site ends in |
| `send-follow-ups` | v2 | off | The day-14 follow-up. Cron only |
| `aa-price-snapshot` | v1 | off | Daily model prices. Cron only |

- Migrations added: `mindmake_follow_up_and_personal_read`, `aa_model_snapshots`, `mindmake_scheduled_jobs`, `mindmake_public_rpc_wrappers`. All four are idempotent and all four are registered in the remote migration history, so the repository and the database agree.
- New tables are RLS-on with no policies, reachable only by the service role. No existing policy was loosened and no anon policy was added to anything.
- Scheduled jobs: `mindmake-brief-retention-daily` (`17 2 * * *`), `mindmake-follow-up-daily` (`20 9 * * *`), `mindmake-aa-price-snapshot-daily` (`0 11 * * *`). The two new jobs call their function over HTTP with the Vault secret `mindmake_cron_secret` in the `x-mindmake-cron-secret` header, and each function refuses without it. This is the pattern the project's eight existing jobs already use.
- Price history: 624 rows for 28 August 2026, the first day. This is the one thing here that cannot be back-filled, which is why it runs before anything renders it.
- Configuration names are unchanged from Gate E, plus `MINDMAKE_CRON_SECRET` for the two scheduled functions.
- Retention: unverified brief requests purge after 7 days, rate-limit hashes after 48 hours, verified records at 12 months, sent follow-up rows after 7 days, unsent rows after 60 days, personal reads at 12 months. The privacy notice states the same schedule.

## Verification baselines

Last measured 29 August 2026, against the built output.

- Tests: **334 across 22 files**, all passing. The thirty-five added on 29 August
  hold the nine dead ends: that each one offers a person, that the offer posts
  the right reason, that it asks for nothing the page already holds, that it
  hands over an address rather than a spinner when even it fails, and that the
  copy stays inside the house style. They exist because this is precisely the
  kind of thing that vanishes in a refactor with no gate objecting, which one of
  the canon promises did for a whole commit.
- Typecheck: **0 errors**, against `tsconfig.app.json`, and the build runs it first.
  An earlier version of this file claimed `tsc` was clean when it had never run:
  the root `tsconfig.json` carries `"files": []` with project references, so
  `npx tsc --noEmit` checked nothing and exited 0 over seventeen real errors.
  Never point the typecheck at the root config.
- Lint: **0 errors, 2 warnings** (react-refresh advisories in two long-standing files). Do not add new problems.
- Build: prerenders **21 indexed routes**; the sitemap and prerender parity check runs inside the build.
- Page heights at 1440x900: `/` 6.0 screens, `/ai-brain` 8.5, `/ai-gtm` 4.7, `/case-studies` 5.0.
  At 390x844: 7.9, 9.4, 6.6, 5.0.
  `/ai-brain` grew about a screen at 1440 and not at all at 390, which is the
  pinned climb: it holds the screen for 68vh on a laptop and is switched off
  below 860px, where the three steps simply stack. That is the trade a pinned
  section makes, and it was taken deliberately.
- Browser gates, run against the built output at 1440px and 390px. Two of them
  were added on 29 August because every gate before them measured a page at
  rest, and neither the lead dialog nor a failure state is on a page at rest:
  `scripts/qa/dialog-shape-check.mjs` opens the dialog and reads its box, and
  `scripts/qa/handoff-check.mjs` drives two dead ends for real and reads the
  offer's contrast and focus ring on both grounds. The defect that earned them
  is recorded below.
- Browser gates, run against the built output at 1440px and 390px:
  - **Aliveness** (`npm run qa:alive`): no viewport-height of any page is still.
    It photographs three frames 900ms apart and reads two statistics: the mean
    change across the whole viewport, and the mean across the busiest twentieth
    of a percent of pixels, which is about a 25 by 25 patch. The second exists
    because the mean cannot see a forty-pixel instrument moving hard. Floors are
    0.15 and 8, both calibrated from readings that fall in two groups with
    nothing between them. A window more than half footer is skipped, because a
    footer is chrome. It then makes a **second, scrubbed pass**: it samples each
    page at eight scroll offsets and requires elements whose state changes with
    position in all three thirds of the page. The first pass alone photographs a
    stationary viewport, so it cannot see a scrubbed build at all and passed a
    site whose scroll-led motion had never been deployed. Clean at both widths:
    25 viewports at 1440, 26 at 390.
  - **Image density** (`npm run qa:images`): no image renders above its intrinsic
    width, and none below 1.8 source pixels per CSS pixel, or 1.3 for film,
    which is limited by the footage. SVG is exempt. Clean at 1440 and 1920.
  - **Section rhythm** (`npm run qa:rhythm`): no two consecutive sections share a
    ground unless something else separates them. Exemptions are named in the
    script. Clean across 34 sections on four pages.
  - **Card geometry** (`scripts/qa/card-geometry-check.mjs`): every card in a drum
    reports the same height and its quote, attribution and button rows share a
    y-offset with its neighbours', and opening one changes neither the page
    height nor the position of anything around it. Measured, not eyeballed:
    33 cards at 177.3px with rows at 15/80.3/136.3.
  - **One way in** (`scripts/qa/one-way-in-check.mjs`): a page never shows two
    primary actions at once. It walks each page at both widths and counts only
    genuinely visible ones, because the closed menu has a box and the first
    version of the check counted it. Clean across 8 page/width pairs.
  - **Redirects** (`scripts/qa/redirect-check.mjs`): every retired route lands on
    the homepage in one hop. This table used to expect `/teardown`, `/handover`
    and `/start`, the rungs of the retired offer ladder, which are themselves
    redirects now, so it was asserting a two-hop chain the runbook forbids and
    failing 19 of 19. The code was right and the expectations were stale.
  - **Keyboard**: every tabbable element shows a visible focus ring. Clean at both
    widths, including all twenty controls of the shared details capture.
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

1. **The branded mailboxes are the one thing still owed.** See item 3. Everything else the rebuild needed is live.
2. **The day-14 follow-up is now live, and the first one can send on 11 September 2026.** `submit-mindmake-brief` v13 was deployed straight after the promotion, so the enqueue and the privacy notice describing it went live together. The deployed body was verified to carry it. `follow_up_queue` was empty at that moment, so nothing predates the notice.
3. **The branded mailboxes do not exist yet, and the site does not pretend they do.** `mindmake.co` has no MX record, so `hello@mindmake.co` and `privacy@mindmake.co` would bounce. Every contact link therefore reads one constant, `CONTACT_EMAIL` in `src/lib/publicLinks.ts`, currently set to the mailbox that does receive. To switch: add the MX record, create the two aliases, change that one constant.
4. **The films are the real delivery.** Six films landed on 28 August 2026, each with an mp4, a webm and a poster taken from its own first frame. Loops are silent and under 1.7MB; the sixty-second proof film on `/ai-brain` is click-to-play and fetches nothing until asked. A twenty-second cut of the proof film also exists in the delivery and is not used on the site yet.
5. **Credential rotation**: rotate the GitHub, Vercel, Supabase and Resend credentials shared during this and the launch sessions.
6. **`get-model-data` v24 is still deployed** with no caller in this repository. Retiring it needs CTRL-side confirmation first.
7. **Physical device checks**: iOS Safari, Android Chrome, VoiceOver and TalkBack remain a post-launch checklist; emulation evidence was accepted for launch.
8. **CTRL old host**: repoint `ctrl.themindmaker.ai` to `https://ctrl.mindmake.co` after one confirmed authenticated CTRL login on the new host.
9. The `themindmaker.ai` Resend domain still shows a failed verification; legacy senders on that domain stay unreliable until its DNS is repaired or the domain is retired from Resend.


## Repaired on 29 August 2026: the lead dialog had no shape

The strip commit of 28 August rewrote `mindmake.css` as tokens, base, chrome and
the secondary pages. The lead dialog's entire structural layer went with the old
site: the backdrop, the panel geometry, the sticky header, the step padding, the
choice and result grids, the consent row, the success block and every phone
rule. `mindmake-brief.css` was untouched, and it stages the dialog's colours, so
the dialog kept its palette while losing its shape and rendered full-bleed and
unpadded on the live site for a day, on the one surface every lead passes
through.

Nothing objected, and nothing could have. Component tests render markup and read
it back; a stylesheet is not markup. Every browser gate measures a page at rest;
a dialog is not on a page at rest. The five custom properties the component
writes for the visual viewport and the software keyboard went unread the whole
time, so an open keyboard on a phone pushed the field being typed into under the
fold.

The structure was rewritten in the current token set rather than restored: the
deleted rules named `--mm-line-dark`, `--mm-paper-bright`, `--mm-muted-light`
and `--mm-emerald-deep`, none of which survived the rebuild, so a literal
restore would have shipped a stylesheet of failed `var()` calls. It now lives in
`mindmake-brief.css`, the file `LeadBrief.tsx` imports itself, above the tone arc
it always staged. The one leftover found while measuring: the ink tone's header
was `rgba(13, 25, 41)`, the retired portfolio navy, which put a blue header on a
green-black panel.

Held by `src/test/LeadBrief.test.tsx`, which asserts every part the component
renders has a rule, and by `scripts/qa/dialog-shape-check.mjs`, which opens the
real dialog at 1440 and 390 and reads its box.


## Proven live, 29 August 2026

Deployed in the runbook's order: migration, then the promotion, then the
function. Nothing about the handoff was believed on the strength of a deploy
call returning 200.

- **Migration applied.** `handoff_reason` exists on
  `public.mindmake_personal_reads`, `q1` and `q2` are nullable and governed by
  `mindmake_personal_reads_shape_check`, and the table still carries **zero
  policies**. Read back from `information_schema` and `pg_constraint` rather
  than assumed from the statement succeeding.
- **Build promoted.** The deployed stylesheet carries
  `.mm-brief-backdrop{position:fixed…}`, `.mm-brief-panel{width:min(780px,100%)…}`
  and `.mm-handoff{--mmh-fg:…}`. The bundle it replaced carried the tone rules
  and not one structural one, which is how the dialog's missing shape was
  confirmed rather than inferred.
- **Function at v20**, sixteen-file closure, `verify_jwt` false. The deployed
  body was checked for `parseHandoff`, `renderHandoffNotice`,
  `HANDOFF_NOTICE_WINDOW_MS`, `handoff_reason`, the notice subject and two
  reason ids, and for the read machinery it had to keep: `synthesiseWorkingLife`
  and `sameEmployer`.
- **Seven refusals behave.** No origin and a wrong origin are 403. An unknown
  reason, an unexpected key, a smuggled `q1`, an unknown division and a
  malformed address are each 400 naming the field.
- **One synthetic handoff, end to end.** `personal-email` from a `gmail.com`
  address, which is the case the work-address rule would wrongly have blocked:
  200 `{"status":"received"}`, one row with `handoff_reason` set and `q1`, `q2`
  and `delivered_at` null, **no follow-up queued**, and the log line
  `handoff personal-email gmail.com notified=true`. The log carries the domain
  and never the address.
- **The operator cap holds.** A second handoff from the same address ten
  minutes later logged `notified=false` and still answered `{"status":"received"}`,
  because the row is written either way and the request really is with us. Both
  synthetic rows were then deleted; the table holds no handoff rows.
- **The read still reads.** `alanna.laforet@engen3.com`, the case that started
  all of this, came back with a specific paragraph about athlete partnerships,
  IP verification and image-rights licensing. Restructuring the body parsing to
  route a third action did not damage the two that were there.
- `VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED` is `true` in production, so the three
  dead ends inside the lead dialog exist on the live site rather than only in a
  build with the flag on.

Not proven from this environment: the live site in a real browser. Chromium
cannot reach `mindmake.co` through this session's proxy, though `curl` can, so
the shape and the offer were verified against the deployed stylesheet and then
rendered from an identical local build at 1440 and 390. Worth one look on a real
device.


## Repaired on 29 August 2026: the entrance was three pages in a row

Krish described the load as a text-only page on a white background, then a
glitch, then the site. Measured cold at 390px on a throttled 4Mbps connection,
that was exactly what happened:

| | before | after |
|---|---|---|
| first frame | pure white | ink |
| at 395ms | the prerendered document, black on white | the shell, set as the hero |
| at 719ms | the site replaces it | nothing to replace |
| light ground on screen | ~700ms | 0ms |
| page replaced after painting | once | never |
| something moving | 1486ms | ~10ms after first paint |
| page replaced after painting, phone | once | never, on all three pages |
| page replaced after painting, 1440 | once | never on `/`, once on the two doors |

Two causes, neither visible to anything that existed.

**The ground.** `src/index.css` set `body { background-color: hsl(var(--background)) }`
and `--background` is off-white. Vite injects the built stylesheet into the head
*after* the critical inline style in `index.html` that sets the ink, so the later
rule won and the page was off-white until React painted over it. Every page on
this site, the 404 included, renders inside `.mm-site`, which paints the ink, so
the white was never a design anybody chose: it was only ever visible during the
flash. `--background` is unchanged and still correct for the shadcn components
that read it through `bg-background`; only the page ground moved.

**The shell.** `scripts/prerender.mjs` emits every heading and paragraph on the
page as plain HTML so a crawler running nothing still gets all of it. It had no
styles at all, so a visitor got a document in Inter for as long as it took React
to arrive and discard it. It is now set as the hero it is about to become: the
wordmark, the first line at hero scale, a slow light behind it, and the rest of
the document clipped a screen below. Clipped rather than hidden, because the
text is the reason the shell exists and hidden text is not text.

Its CSS is deliberately in two places. `index.html` inlines what the first
screen needs, so it does not wait on the 126KB render-blocking stylesheet;
`src/styles/mindmake.css` holds the same rules for everything after.
`src/test/first-screen.test.ts` keeps the two identical.

The light behind the shell is also the only thing on this site that moves before
JavaScript exists. It is a CSS gradient on a keyframe, which is why it can: no
observer, no React, no video. "Alive from the get-go" is now literally true on
the first painted frame rather than a second and a half later.

### What is still outstanding

At 1440 the two door pages settle once, about a second after they paint. It is
not the flash and it is not the hero: the headline, the claim, the lede and the
film plate were each measured against the hydrated page and matched to within a
few pixels. What moves is the strip below the hero, where the live page starts
its next section on `--mm-ink-raise` and the shell has plain ink. At 1440x900
the hero ends at 824px, so the last 76px of the window changes colour when React
lands, which the gate reads as about three rows of its grid.

A band at a fixed 824px was tried and made it worse, because that number is only
true at one window height. The real answer is the one the plan already names:
render the components to HTML at build time instead of hand-writing a shell, so
the first paint is the page rather than a good likeness of its first screen.
Until then this is measured, named, and much smaller than what it replaced.

Held by `src/test/first-screen.test.ts` and by `npm run qa:entrance`
(`scripts/qa/first-second-check.mjs`), which loads the built site cold on a
throttled connection and photographs the entrance from the compositor.

### A note on the instrument

The first version of that gate asked for a screenshot every 100ms and reported
frames at 0ms, 411ms, and then nothing until 1449ms. `screenshot()` waits on the
main thread, and the main thread is busy parsing 351KB of JavaScript, which is
precisely the second being measured: an instrument that goes blind during the
event. It uses a CDP screencast now, pushed from the compositor as each frame
paints. It also measured the dominant colour at first, which was 36% of the
frame on a page that is a ground plus a photograph plus type; it measures whole
frame luminance now, because "it flashed white at me" is a statement about the
whole frame.

It also could not tell a page being replaced from a film starting: a 566px plate
coming alive at 1440 moves a quarter of the grid every frame for as long as it
plays, and the first attempt called that a replacement. Told to ignore any large
change followed by more movement, it then failed its control, because a film
plays in the genuinely-wrong-page case too. It now measures which cells keep
changing once the page is running, sets those aside, and looks for replacements
only in what is meant to be holding still. The control it is checked against is
real: `vite preview` serves the SPA fallback, so `/ai-brain` on it renders the
homepage shell and then swaps to the door page, and the gate has to catch that.


## Corrected on 29 August 2026: three gates had never run on a phone

`qa:alive` and `qa:images` took a single `--width` and defaulted to 1440.
`qa:rhythm` had no width flag at all and was hard-coded to `{ width: 1440,
height: 900 }`. Only the four gates written later, card geometry, one-way-in,
dialog shape and handoff, looped both widths. `CLAUDE.md` said all of them ran
"at 1440 and 390", which was false for exactly the three that decide whether the
site feels alive and whether its images are sharp.

Found by being asked whether the request to feel alive from the get-go had
objectively been met, and going to check rather than answering from memory.

Run at 390 for the first time:

- **Aliveness**: clean, 23 viewports, quietest peak 11.2.
- **Rhythm**: clean, 29 sections across 3 pages.
- **Images**: clean, 33 images, lowest 2.03x, against 1.42x at 1440.

All three passed, which does not make the gap harmless. It makes it lucky, and
the aliveness pass is thin in a way the next section records.

Each npm script now runs both widths in turn.

## Measured on 29 August 2026: the aliveness pass is thinner than it reads

The gate's own header says the at-rest pass alone "cannot tell a page that builds
as you read it from a page that merely has something ticking in the corner".
Read across every viewport, that is what it is currently doing:

| whole-viewport mean change | 390px | 1440px |
|---|---|---|
| at or above 1.0, something substantial moving | 9 of 23 | 7 of 20 |
| below 0.15, passing on the peak floor alone | 13 of 23 | 12 of 20 |

Fifty-seven percent of mobile viewports and sixty percent of desktop ones are,
in whole-viewport terms, still. They clear the bar because one forty-pixel
instrument is ticking in a corner.

This is not a desktop-versus-mobile gap: the two columns are the same. The
thinness is site-wide, and it was read on a phone, which is why it looked like a
mobile problem. The floors are not wrong for what they measure. The claim hung
on them was: "no viewport is fully still" is a much weaker promise than "alive
from the get-go", and the first was allowed to stand in for the second.


## Repaired on 29 August 2026: the phone finished its climb before reading it

The pinned climb was documented as an accepted trade: pinned above 860px,
stacked below it, "where the three steps simply stack". Measured rather than
assumed, the stack was not the problem. The climb builds on a phone: the lamp
runs down the left of the column and the steps light in order. What it did was
build too early.

At 390, `--mm-p` read 0.158, 0.473, 0.788, then 1.000 across scroll offsets of
-0.6, -0.3, 0 and +0.3 viewports from the section's top. The whole build ran
while the section was arriving and was finished before it was centred, then
nothing changed for the rest of it. Three steps lighting in the time it takes to
scroll past a heading.

The cause is in the driver rather than the layout. With no hold, `pin` falls
back to `read`, which completes while the element is still on screen. That is
right for a paragraph and wrong for a section whose whole point is that it holds
the screen while three things happen.

The phone holds its own sections now, at a length sized for a phone: 210vh of
section with an 84vh sticky child, against the laptop's 168vh and 100vh. Three
stacked steps are about 480px in an 844px window, so the section takes the
screen, spends its motion and gives it back. Measured after: 0.000, 0.273,
0.546, 0.818, 1.000 across the hold, with the lit step stepping through all
three.

The hold costs scrolling, and the number is worth stating rather than burying:
`/ai-brain` at 390 goes from 9.4 screens to 11.1, on the longest page on the
site. A first attempt at 210vh cost two full screens; 180vh with an 84vh child
leaves 80vh of hold, about 26vh a step. That is the trade, taken deliberately:
the phone had a build that finished before it was read, and now it has one that
reads.

The climb is the only pinned section on the site, so this is the whole of it.
`.mm-head-split` also changes at 860px and was on the list; it is a two-column
layout collapsing to one, which is a layout decision rather than a lost build,
and it is left alone.


## Added on 29 August 2026: arrival, and what it is not for

`src/hooks/useReveal.ts` and `src/components/mindmake/Arrive.tsx`. Wrapping a
group rather than each item, because what is worth staggering is a row of cards
and writing the hook out six times is six chances to forget one.

Wired first into the two quietest places a reader actually stops: the homepage's
three answers to "where does everything you teach AI end up", which measured a
whole-viewport mean of 0.023 and 0.026 across its two viewports, and the fork
band on `/ai-brain`, which measured 0.071 and is the only paper band between two
ink sections.

**It is not a way to pass the aliveness gate.** That gate measures a page at
rest, and an arrival has by then arrived, so the at-rest means above are
untouched by this and will stay untouched. The reason it exists is the other
half of the complaint: sections that were finished before they were looked at
and did nothing as you read them.

Chasing the at-rest mean was considered and rejected. Every `.mm-block` already
carries a drifting ground light, reading about 0.01 over the gate's window, and
the way to make that register would be to brighten it. The design contract calls
movement added only for decoration a regression, and a brighter glow is exactly
that: the contract's own words are that "a 7 percent alpha glow satisfies
getAnimations() and satisfies no human being". The honest position is that the
thin viewports are thin because they hold forms and cards and text, that arrival
is what makes those read as alive, and that the mean is the wrong number for
them.

### What the backstop had to become

The first version guaranteed "readable if the reveal never fires" with a
two-second timer. Measured in a browser, every element on the page was revealed
before a reader had scrolled to one, so no arrival ever happened. It was also
the weaker promise: a moment, rather than the reader's own position.

It is a scroll pass now, one passive listener for the page, doing the observer's
job by hand. A silently broken observer costs nothing, because an element is
revealed by the time it can be seen. Proven in a browser at 390: pending at the
top, shown on arrival, no attribute at all under reduced motion, and 1076
characters of the page's copy reaching a reader with JavaScript disabled.

## Added on 30 August 2026: the pages are rendered, not imitated

`src/entry-server.tsx` renders every indexed route with `renderToString` at build
time, `scripts/prerender.mjs` writes that markup into `#root`, and
`src/main.tsx` hydrates it. First paint is the page.

What it replaced was a hand-written shell: every heading and paragraph as plain
markup, styled by forty inlined lines to look like the first screen it was about
to become. It did its job for a crawler and it was a likeness, and three bugs
came from it being a likeness rather than the thing. The last was a strip below
the hero where the live page starts its next section on a raised ground and the
shell had plain ink, measured as the page settling a second after it painted.
The shell, its CSS, and the second copy of the design that came with it are
deleted; `index.html` keeps the ink ground alone.

Arrival was wired into the sections that were still finished before they were
looked at: the three proof stories and the founder block and the publication
band on the homepage, the three CTRL principles on `/ai-brain`, and the four
lever dials, the process track and the questions head on `/ai-gtm`.

### Four defects found while verifying it, none of them visible

**The reveal was snapping, not travelling.** `[data-reveal]` set `transition`,
and `.mm-enemy`, `.mm-story`, `.mm-fork` and `.mm-lever` each set a short
`transition` of their own in `mindmake-instruments.css`, which loads after
`mindmake.css` at the same specificity. The card's one-property declaration
replaced the reveal's outright, so the three arrivals shipped on 29 August
appeared rather than arrived. It is an animation now, which cannot collide with
a transition, and the card keeps its own hover fade.

**Every prerendered page was failing to hydrate.** Two separate mismatches, both
reported by production React as a numbered error nobody reads, and both with the
same symptom: the server render is thrown away and the page is rebuilt from
nothing on the client, which is the glitch the prerender exists to remove.

- `next-themes` inlined a `<script>` through `dangerouslySetInnerHTML`. The
  client bundle and the SSR bundle minify that script's source differently, so
  the text never matched. Nothing read the theme: no component calls
  `useTheme`, all three of this site's stylesheets use zero shadcn tokens, the
  lead dialog rendered byte-identical under both colour schemes, and the whole
  measured difference on the homepage was a sub-threshold tint on one
  photograph. The provider is gone.
- `App` wrapped its routes in `<Suspense>` and the server entry did not. React
  writes a pair of comment nodes around a Suspense boundary and looks for them
  again at hydration, so the client's tree opened with a marker the server had
  never written. The server entry now carries every wrapper `App` has, in
  `App`'s order.

**`/new-age-leadership` was prerendered without its org chart.** `OrgChart` was a
`React.lazy` boundary inside an already-lazy route, which split one page's code
across two requests and bought nothing. `renderToString` cannot wait for a lazy
component, so the build wrote an unfinished boundary, the chart was missing from
the HTML a crawler reads, and the browser rebuilt that section on arrival. It is
a plain import now.

**Two large images were racing the render-blocking stylesheet.** Measured cold at
4Mbps: the brand mark was a 98KB PNG displayed at 30px, and the click-to-play
film band fetched a 96KB poster before anything had been clicked, because
`preload="none"` covers the film and not the poster. The mark is 128px and 8KB;
the click-to-play video is not in the document until the play button is pressed,
which is what its own docstring had always claimed.

### The entrance, measured against the build it replaces

Both builds served from `dist` by the same static server, same machine, same
gate, back to back. **The ~390-400ms first paint the plan set as the bar was
wrong**: measured properly, the shipped build paints at 896-1000ms.

| | c476e58, the shell | this build |
| --- | --- | --- |
| 390 `/` | 924ms | 1064ms |
| 390 `/ai-brain/` | 956ms | 1080ms |
| 390 `/ai-gtm/` | 896ms | 992ms |
| 1440 `/` | 964ms | 1076ms |
| 1440 `/ai-brain/` | 1000ms | 1124ms |
| 1440 `/ai-gtm/` | 952ms | 1056ms |
| page replaced | **1x on both doors at 1440** | **0x on all six** |
| hydration | failed on every page | clean on every page |

So first paint costs about 100ms, which is the real HTML the SSG exists to send:
11KB of shell became 38KB of page. What it buys is that the page arrives once.

### The gate that would have caught it

`scripts/qa/first-second-check.mjs` now reads the browser's error stream as well
as its frames. Proven against a deliberately broken build, with the Suspense
markers stripped out of one page: at 1440 the frames caught it as a replacement
and at 390 they saw nothing at all, because the rebuild landed on markup that
looked the same. A gate that only photographs a page cannot tell a working
render from a discarded one.

`src/test/ssg-hydration.test.tsx` renders both trees and compares the strings,
which is the check that catches a divergence before it reaches a browser.

## Added on 30 August 2026: the homepage had no tonal range and no imagery

Krish asked whether the previous round was merged and in production, said the
site looked no different, and told me to scroll it on a phone. All three landed.

**It was not deployed.** The previous round sat on `claude/site-rebuild-nd6z4u`
while `origin/main` was two commits behind it, and `mindmake.co/ai-brain` was
still returning 11,115 bytes of the hand-written shell. It is merged and live
now, verified by fetching the route and by running the entrance gate and a
hydration check against production's own bytes.

**And shipping it would not have answered him.** Production and the new build
driven side by side at 390px were both 6,589px tall with identical layout. The
static render changes how the page loads, not how it looks.

### What scrolling it on a phone actually measured

Seven viewports down the homepage, whole-screen change over 900ms, floor 0.15:

| y | section | mean |
| --- | --- | --- |
| 0 | hero film | 5.112 |
| 844 | the argument | **0.026** |
| 1688 | marquee and questions | 3.282 |
| 2532 | the three proof stories | **0.026** |
| 3376 | live board | 1.171 |
| 4220 | founder note | **0.012** |
| 5064 | publication band | **0.060** |

Four of seven screens frozen while being read, and all four passing `qa:alive`,
because its rule was `mean >= FLOOR || peak >= PEAK_FLOOR` and `peak` reads the
busiest 0.05% of pixels — about a 25 by 25 patch. One instrument mark ticking
certified an otherwise static screen of text.

Three causes, all confirmed in the code. The homepage carried **none** of the
four scroll-built section components; `ClimbLadder`, `ProcessTrack`,
`LeverPanel` and `StoryFigure` were all on other pages. There was no tonal
range: ink and raise are 1.32:1 apart and the page alternated between them for
its whole length, while paper — a full inversion, built and tested — was used
once in the entire application. And below the hero there was no imagery at all
for five screens.

### What changed

- **The paper ground works anywhere now.** It redefined five surface tokens
  while the components read the raw palette, so the first attempt to move a
  section onto it produced light cards' worth of nothing: dark cards with dark
  headings and grey body text on cream, photographed and kept. Both non-default
  grounds redefine the raw palette for their subtree now.
- **The accent split in two.** `--mm-mint-bright` is the accent as a surface and
  never follows the ground; `--mm-mint` is the accent as text and line and does.
  Seventeen surface rules moved. `--mm-focus` derives from the bright token
  rather than repeating its hex, so there is one mint literal in the file.
- **The homepage runs an arc**: ink, paper, ink, raise, ink, paper, ink.
- **The proof stories draw their figures.** All three already carried complete
  figure data in `rebuildProof.ts` — a span, an offer and a count, with real
  numbers — and the card rendered only the small mark for the shape and threw
  the diagram away. `StoryFigureView` had been drawing them on /case-studies all
  along.
- **Film below the hero.** The proof section carries film four, the rail
  carrying sheets to a gate; the publication band carries film six, a split-flap,
  which is what a publication is. A plate runs a light sweep whether or not its
  loop plays, so it is imagery and the ambient layer at once.
- **The portrait sits in a plate**, like every other image on the site, and the
  founder's three paragraphs are chaptered on a phone as /ai-brain's already are.

| y | before | after |
| --- | --- | --- |
| 844 | 0.026, 1 cell | 0.026, 1 cell |
| 2532 | 0.026 | **2.961, 16 cells** |
| 4220 | 0.012 | **0.357, 13 cells** |
| 5064 | 0.060 | **2.252, 18 cells** |

### Two defects found by looking rather than by any gate

**The founder photograph was decapitated on a phone.** `max-width: 330px` from
the desktop rule and `height: auto` from the base rule were both still in force
inside the mobile query, so a 670x861 source resolved to a 330x320 box; `cover`
overflowed 104px and `object-position: 60% 28%` — above centre — pulled the
window toward the top of the frame and cut about 29 CSS pixels off a photograph
whose subject's head starts about 90 source pixels down. The `60%` was inert:
there was no horizontal overflow for it to distribute. The crop is declared now
and biased to the top; verified at 360, 390 and 430.

**The cookie notice was 109px, thirteen percent of the screen**, floating over
the content from sixty percent of the first viewport until dismissed, and it is
in five of the ten screenshots taken while reading the site on a phone. It sits
above the mobile action bar now rather than over the reading.

### The gate reads spread now, and is red

The at-rest pass counts how many of an 8x8 grid of cells change, and a viewport
passes on `mean >= 0.15 || (peak >= 8 && cells >= 4)`. Four is calibrated across
twenty-six viewports: everything carrying a film, a drum or a marquee lights 9
to 45 cells; everything whose only motion is an instrument mark lights 0 to 3
and reads a mean of 0.007 to 0.08.

It fails, and the failure list is the worklist: 9 still viewports at 390 and 5
at 1440. The homepage has one at each width; the rest are on `/ai-brain` and
`/ai-gtm`, which have had none of this round's work. `/ai-gtm @2532px` reads a
peak of 1.0, which is a screen where literally nothing moves at all.

`/ @844px` is the one homepage viewport still below the floor, and it is left
there deliberately rather than decorated: its event is the ground inverting from
ink to paper, which is a large visual change to scroll into and one an at-rest
photograph cannot see. That is a real limit of the measurement, recorded rather
than worked around.

## Added on 30 August 2026: one ask everywhere, and a gate that can see a build

### The lead flow had two front doors

`Start here` on `/`, `/case-studies` and `/ai-brain`'s close block opened
`LeadBrief` on a field labelled **Company website**. The panels on the two door
pages asked for four details and told the reader there was nothing to look up.
`05_LEAD_DELIVERY_SPEC.md` says both doors ask for exactly those four details in
one shared component; that was true of the panels and not of the dialog, which
is every primary action on the homepage and the archive. "Give us your company
address" was the seam showing, and it shipped in three places, the third being
the answer the ask bar itself gave to "how do I start".

`LeadBrief` opens on `DetailsJourney` now. Nothing about what reaches the server
changed: `buildMindmakeBriefRequestV2` sends `contact.email` and
`company.domain`, and the domain is derived from the work email by
`src/lib/workEmail.ts` rather than typed. The name and the division stay in the
browser and do the job they already do on `/ai-gtm` — they are what the offer of
a person carries when a step fails, which a cold-opened dialog never had.

Two things came out of it that were not the point:

- **`DetailsJourney` announced its errors and did not link them.** The website
  field it replaced set `aria-describedby`; a `role="alert"` block reaches a
  reader once, when it appears, and the linked description is what they get on
  landing back at the field to fix it. Both door pages use this component, so
  linking it fixed three surfaces.
- **`/?start=1` had been failing hydration since the static render landed.**
  Every indexed path is prerendered without a query string, so the server
  rendered the page with the dialog shut and the client's first render opened
  it. React discarded the page with error #418 on every shared start link and
  every back-button return into the dialog — the one route the site's own
  primary action produces. Confirmed against the deployed build before fixing,
  so it is not a regression from this round. `useLeadBriefHistory` matches the
  server on the first render now, as `use-mobile` does, and `/?start=1` is in
  the entrance gate's default path set because neither that gate nor
  `ssg-hydration.test.tsx` covered a query-parameter state.

### The gate was asking the scroll builds to be something else

Six of the fourteen still viewports sat on `ClimbLadder`, `ProcessTrack` and the
fork band. Those are position-driven: they build as you scroll and are correctly
static when you stop, which is what `03_DESIGN_CONTRACT.md` asks of them. The
at-rest pass photographs a stopped page and can only ever see the ambient layer,
so the only way to satisfy it there would have been to decorate them.

`scrubbedThirds` already read the state of every scroll-driven element; it now
reports where each one sits, and a viewport is alive if something moves in it at
rest **or** something in it builds as you scroll through it.

### And it was flaky, which matters for every number before this

The plate light sweep is a 9.5 second cycle that parks for about 4.3 of them.
The gate took three frames 900ms apart, spanning 1.8 seconds, which fits inside
that park. Measured three times on the same unchanged page, `/ai-brain @6300px`
read 0.125 with 2 cells moving, then 1.611 with 23, then 1.474 with 24. The
window is five frames over 6.4 seconds now, and the same viewport reads 0.98 to
1.12 across three runs.

**So the readings in the section above this one were taken with a window that
could miss a slow sweep**, and are only trustworthy where the motion was
continuous. The homepage's before-and-after figures are safe on that count — a
film and a drum move constantly — but the near-zero readings on quiet sections
may have been quieter than the page was.

### Where it stands

| | before | after |
| --- | --- | --- |
| still viewports at 390 | 9 | **4** |
| still viewports at 1440 | 5 | **1** |

What remains is the two try-it forms and `/ @844px`. The forms are the
conversion surface on each door page, 1.66 and 1.68 screens of inputs; a film
beside each heading fixed their upper half and left the form itself, which is
the one screen on the site a visitor is acting on rather than reading. Whether
the at-rest rule should apply to an interaction surface at all is a question for
Krish rather than a third exception carved by me. `/ @844px` is the paper
argument section, whose event is the ground inverting — a large change to scroll
into and one an at-rest photograph cannot see.

## Added on 1 September 2026: the questions are a stack, and two gates were lying

Krish sent two screenshots from streamwave.ai as the reference for not putting
everything on screen at once, and asked for a view before anything was built.
The investigation changed the answer twice, so the record has to carry both
corrections rather than the conclusion alone.

### What the reference actually is

Driven in a real browser and traced frame by frame. Its accordion is a plain
Elementor `nested-accordion` on native `<details>`: the swap is **220ms with
both panels moving together and no fade at all**, opacity holding 1.00
throughout, and the stack's own height moving 392px to 374px, so nothing below
it jumps. Site-wide its entire motion vocabulary is fourteen stock Animate.css
entrances, seven `fadeIn` and seven `fadeInUp`, every one of them with zero
delay, on a 4,097px page. There is no bespoke motion system there to copy, and
`useReveal`'s 70ms stagger is already the more considered of the two.

What is worth taking is the **dose**, not the animation: every title on screen
so the reader keeps the map, one body open, and a frame that does not resize.

### The first correction: our density readings were wrong

The first pass counted words per phone viewport and reported 487 on `/`, 524 on
`/ai-brain` and 518 on `/ai-gtm` against a median of about 100. That was an
artefact. The counter tested only whether an element's box overlapped the
viewport vertically, so it counted the drum's cards sitting off to the right
inside `overflow: hidden`, and it would have counted the accordion's shut
answers too. Both wrong in the same direction, which made the comparison
between them worthless.

Counting only text where at least 60% of the box survives every clipping
ancestor, measured against `e1d0389` built in a worktree and served beside the
new build:

| page | before, median / worst | after, median / worst |
|---|---|---|
| `/` | 110 / 188 | 95 / 188 |
| `/ai-brain` | 95 / 143 | 100 / 143 |
| `/ai-gtm` | 88 / 143 | 90 / 143 |

So raw density was never the problem and this change did not move it. **The
headline number in the plan was wrong and is corrected here rather than
quietly dropped.**

### What was actually wrong, measured

Two things, and the change is worth making for both.

**Sentences cut off mid-word.** Counted per page at 390px, the number of text
blocks visible but clipped by a box that cannot be scrolled:

| page | before | after |
|---|---|---|
| `/` | 8 | 6 |
| `/ai-brain` | 6 | **0** |
| `/ai-gtm` | 4 | **0** |

The six left on `/` are the testimonial drum mid-drift, which is the sanctioned
ambient device: a drum that turns always shows two partial cards. Its card is
now sized to the frame below 428px, so a **parked** drum shows exactly one whole
quote instead of one quote and a 54px column of half-words.

**And the drum hid most of itself.** `.mm-drum` was `overflow: hidden` while the
drum's position is a transform written by `useDragDrum`, so with scripting off
it showed one card and clipped the rest with no scrollbar and no way to reach
them. Measured on `/`: **one answer of eight, and 2,308px of clipped copy**, on
the section a reader goes to when they have a question. The `overflow-x: auto`
fallback existed but only inside `@media (prefers-reduced-motion)`.

`.mm-drum` now starts as an ordinary scroller and `useDragDrum` reports when it
has taken control, at which point it clips. `npm run qa:nojs` is the gate that
would have caught it, proved with a control: it passes this build with 47
answers present across four pages and nothing clipped, and it fails `e1d0389`
with 107 blocks clipped inside `div.mm-drum` on `/` and 18 on each door page.

### The second correction: the entrance gate was reporting a defect it caused

Mid-verification `qa:entrance` showed 16 hydration failures on `/ai-brain` and
13 on `/ai-gtm`, with `/` clean. The first diagnosis was wrong: making the lazy
routes eager changed nothing, and the counts stayed identical, so that change
was reverted rather than shipped on a disproved argument.

The cause was the gate. `vite preview` serves `/ai-brain/` from the prerendered
file and `/ai-brain` from the SPA fallback, which is the homepage's markup. The
gate asked for the second, handed React the homepage's HTML and the router's own
page, and reported the mismatch as a defect in the site. Every route except `/`
failed, in proportion to how much content it had: 3 on `/privacy`, 6 on
`/contact`, 9 on `/case-studies`, 24 on `/faq`. Vercel resolves the directory
index either way, and production was already verified serving the right file.

`scripts/qa/lib/asked.mjs` holds the fix and the reasoning, and all seven
browser gates use it. With it, the entrance reports **clean on every path at
both widths**: paint at 580 to 640ms, settled in the same frame, no light flash,
no page replaced, no hydration failure. The claim in this file that hydration was
"clean on every page" was true when written and had been checked on `/` alone.

### The stack

`src/components/mindmake/OneAtATime.tsx`, used by `ObjectionChips` on `/`,
`/ai-brain`, `/ai-gtm` and `/faq`. A real `<details>` group with a shared `name`,
so the browser runs the accordion with nothing loaded and every answer is in the
markup. Once JavaScript is running the rows are all opened, the `name` comes off,
and the fold travels a grid row from 0fr to 1fr in 200ms, because a closed
`<details>` renders no body and there is nothing to transition. The line down the
left is solid above the open row and dashed and drifting below it, on the track's
own 2.6s and 12px, which is both what "not opened yet" means and the section's
ambient layer now the drum's drift has gone.

It held a measured `min-height` for an afternoon, so the frame never resized. That
shipped a worse defect than it fixed: the reservation can only land after first
paint and a `ResizeObserver` re-measured it when the fonts arrived, and
`qa:entrance` caught the page replacing itself three times between 1,872ms and
1,920ms on `/ai-brain` at 1440. It is gone. The reference resizes by 18px and
nothing here needs to be steadier than that.

### Baselines after this change

- Tests: **365 across 26 files**, all passing. Nine are new, in
  `src/test/one-at-a-time.test.tsx`, and the load-bearing one asserts the
  server's own markup carries every answer with nothing running.
- Lint: **0 errors, 2 warnings**, unchanged.
- Typecheck: **0 errors** against `tsconfig.app.json`.
- `qa:entrance`, `qa:nojs`, `qa:rhythm`, `qa:images`, `qa:cards`, `qa:oneway`,
  the redirect, dialog-shape and handoff gates: all green at both widths.
- `qa:alive`: the worklist is **unchanged**, 4 still viewports at 390px and 1 at
  1440px, and every one is a try-it panel or `/ @844px`. No questions viewport
  is on it, so the stack carries its own section. `/ai-brain @2700px` at 1440
  reads 3 of 64 cells against a floor of 4 and flipped either side of it across
  runs, which is a borderline reading on a screen that is genuinely still, not a
  reason to move a floor.

### Still open

`/new-age-leadership` (340KB) and `/blog/:slug` (124KB) remain lazy against a
348KB entry bundle. That is deliberate and it is not known to cost anything: the
entrance gate reads clean on the routes it covers, and these two were never
measured. They should be, before anyone assumes either way.

## Added on 1 September 2026: split what does several jobs

Krish's read of the live site on a phone: he could not tell what to do, it still
felt like walls of scrolling, nothing about it was delightful, and `Start here`
offered no choice between the two doors. He named heylemon.ai for how its
components build as you scroll, and asked for tests at every screen size.

Two of the four things measured before the work changed the brief.

### The reference does not do what the rule said

Driven at 390px, heylemon's sections run 1.44, 2.00, 1.67, 1.49, 1.65, 1.20 and
1.94 screens: a median of about 1.5, the same as ours. Section length is not
why it feels better. Three things are, all measurable. Every section **builds as
it enters view** (its fourth goes from 5 faded and 5 shifted elements to 1 and
1). Every section runs **its own always-on animation**: a waveform, `wv`,
appears five times in *every* section, beside `heroZoom`, `bgZoom`, `mq`,
`ring`, `keypress` and `wobble`. And each one carries **a small working
demonstration** of the product rather than a diagram of it. There is no scroll
library at all: plain CSS module keyframes.

So the rule adopted was not a height cap. It was: a section is one idea, and a
section running well past a screen is almost always several that nobody has
separated.

### What our sections actually were

At 360px, 17 of 26 were over one screen, and the worst were not long copy.

| section | before | what was in it |
|---|---|---|
| `/` proof strip | **2.61** | heading, film, 3 story cards, a link, 33 quotes on a drum, a logo rail |
| `/` paper argument | **2.35** | lede, 3 cards, a claim, a marquee, **and the whole questions section** |
| `/ai-brain` try-it | **2.14** | claim, film, copy, a four-field form with three chip questions |
| `/ai-gtm` try-it | **2.08** | the same, plus 386px of "what happens next" *under* the form |
| `/ai-brain` CTRL | 1.61 | 666px of argument, then 440px of tabs and a product capture |
| `/` hero at 1280x800 | 1.47 | a hero sized by width alone, on a window 800px tall |

After: no section past 1.35 screens at any of eight sizes, with three
exemptions named and reasoned in the gate. `/` worst 2.61 to 1.38, `/ai-gtm`
2.08 to 1.44, `/ai-brain` 2.14 to 1.88, that last being a form with three chip
questions, which is the floor unless it asks less.

### The proof became a card index

`StoryIndex`: eight client stories as a deck, one filling the screen with the
next two behind it, turned by a flick. `useDragDrum` gained a `write` option, so
the same drift, drag, throw, snap and end resistance land the offset on a custom
property instead of a rail transform, and CSS places every card in one grid cell
by its distance from the front. The box is then the height of the tallest story
with nothing measured, which is the reservation the questions stack could not
have. It does not drift, because a card changing under a reader mid-quote is not
ambient; the scrubbed `StoryFigureView` on each card is what keeps it moving.

Before the drum takes control, and for anything that never runs a script, it is
the vertical stack it replaced. Section 2.42 to 1.03 screens at 390, 0.86 at
1440.

### The fork at the button

`BriefRoute` has been `home | brain | gtm` since the doors existed, and
`LeadBrief` has held a different set of four pressure questions for each. Every
`Start here` passed no route, so `PRESSURES.default` answered for everybody: a
generic set belonging to neither door. The homepage now offers the two doors by
name in one control group, the address carries which (`?start=brain`), and the
dialog asks when it is opened without one. `scripts/qa/one-way-in-check.mjs`
learned the new rule rather than being slipped past it by the rename: it now
counts ways in rather than words, and a fork is one only when it is exactly two,
adjacent, in a `role="group"`.

### The tap state, which was live

`src/index.css:326` still carried the scaffold's `a:hover { color:
hsl(var(--mint)); text-decoration: underline }`. That `--mint` is `#00DBBA` and
the brand's is `#7fe3b4`, and `a:hover` outranks every single-class card link
that sets `text-decoration: none`. On Android `:hover` sticks after a tap, so
every card a visitor touched stayed underlined in a colour the design does not
contain. Krish photographed it on the homepage's first door and it reproduced
exactly: pressing `.mm-door` computed `underline` in `rgb(0, 219, 186)`. It is
`none / rgb(230, 237, 232)` now, and `first-screen.test.ts` holds three rules
that keep that file away from anything a visitor sees.

`.mm-head-mark` was `display: inline-block` inside its heading, so any heading
that wrapped started its second line under the mark. It is a grid column now.

### The gate Krish asked for

`scripts/qa/screen-matrix-check.mjs`, `npm run qa:screens`. Eight sizes from
360x800 to 1920x1080, three pages, four questions each: no section past budget,
no sideways scroll, no text clipped inside a box that cannot be reached, and no
fixed chrome over the primary action. It knows that a `<details>` fold and a
`[role=group][tabindex]` drum both clip on purpose and hand the reader a way
back in, so it does not report the questions stack or the thirty-three voices as
defects for working.

### Baselines after this change

- Tests: **374 across 26 files**. The door has five new cases; the journey steps
  are checked in the content and in both pages that render them.
- Lint **0 errors, 2 warnings**. Typecheck **0 errors**.
- `qa:screens`, `qa:nojs`, `qa:oneway`, `qa:rhythm`, `qa:images`, `qa:cards`,
  `qa:entrance`, redirects, dialog shape and handoff: all green.
- `qa:alive` keeps its standing worklist, unchanged at 4 still viewports at
  390px, and splitting the try-it panels did not wake them. It moved the
  readings and not past the floor: `/ai-gtm @2532px` went from peak 46.6 and 1
  of 64 cells to peak 60.3 and 2, `/ai-brain @4220px` from 29.2 and 0 to 36.8
  and 1. Enlarging the recorder mark on the form panel from 34px to 76px is what
  moved them, and one instrument cannot fill four of sixty-four cells. The
  honest reading is that a form screen is finished the moment it is drawn, and
  what those two want is the picture the promise screen took with it when the
  section split. That is a design decision rather than a fix, and the floor was
  not lowered to hide it.

### Still open

- The three-question form on `/ai-brain` runs 1.88 screens and is exempt by
  name. Making it two steps would fix the height and change a working
  conversion surface, which is a decision rather than a fix.
- `/new-age-leadership` and `/blog/:slug` are still lazy against a 348KB entry
  bundle, and were never measured for the hydration cost.

## 2 September 2026 — the design says it, so the sentence goes

Krish, on the lead dialog on a phone: *"I don't think we need the text
underneath the progress bar. It's stuff like that which we need to make way more
minimal across the whole site. On every page the design should do the talking as
opposed to the words... copy such as 'That is the whole idea.' is a total waste
of space and needs to be purged from everywhere."*

The sentence he pointed at was `Four details, and Mindmake does the reading
before it asks you to explain the problem.` It sat between a step rail reading
**You · Problem · Time · Brief** and four labelled fields, and it described both.

### What was measured before anything was cut

The whole rendered corpus of `/`, `/ai-brain` and `/ai-gtm` was pulled out of
the built site block by block with word counts, rather than read in the source.
Four families came out of it, and each was a habit rather than a paragraph:

1. **Copy admiring the copy above it.** `That is the whole idea.` under a claim
   on the homepage. `No jargon, and nothing to wade through.` under a sentence
   whose only defence is whether it has jargon in it.
2. **Instructions printed under a control that already looks like itself.**
   `Drag it, or use the arrows.` under a drum with two arrows drawn on it.
   `The answer opens under the question.` under a numbered accordion.
   `Flick through them, or use the arrows.` under a deck. `Pick one and this
   line tells you where you land.` under two buttons.
3. **A lede restating the heading it sits under.** `/ai-gtm`'s form said
   `Your company comes from your email address, so there is nothing to look up.`
   under `Four details, and we start reading.`, with the same fact a third time
   on the email field itself.
4. **The same sentence said two and three times on one page.** `/ai-brain` ran
   *the system, the automations and the record of your standards* as one answer,
   then again as a second answer four rows down, then again as the close block's
   body. Two of its ten questions were the same question, and so were two more.

### What changed

| | before | after |
|---|---|---|
| rendered words, `/` | 2,103 | **1,844** |
| rendered words, `/ai-brain` | 1,202 | **1,025** |
| rendered words, `/ai-gtm` | 910 | **838** |
| total | 4,215 | **3,707** (−12%) |

Every section on all three pages is lighter. The largest single cut is the
homepage's story deck, 502 words to 338: each card stated its outcome in a
sentence, drew the same numbers in a figure beneath it, and then had the client
say it in their own words. The drawing and the quote are the two that are not
ours, so the sentence went. It stays on `/case-studies`, where a card has no
figure beside it.

`/ai-brain` went from ten questions to eight. `duration` and `keep` answered the
same question with the same sentence; `charging` already contained everything
`cost` said, including that the price is private.

The four CTRL captions lost the half that read the picture out loud. The one
number in them, `42 things known, 18 confirmed by the owner`, moved into the
capture's alt text, which is where a fact visible in a frame belongs and where it
still reaches a reader who cannot see it. `brief2-public-contract.test.ts` still
holds that exact string; it now finds it in the description rather than a
caption, and says why.

### What cutting a line broke, and how it was fixed

Removing the outcome sentence left a hole in the story deck. Every card in the
deck is the height of the tallest story, and the quote is pinned to the bottom
edge so the eight of them line up; that combination puts all the spare height in
one place. On the shortest story, which is the card you see first, it measured
**147px of nothing between the figure and the quote** at 390px.

`card-geometry-check.mjs` had nothing to say about it, correctly: the cards were
all equal, all aligned, and all equally too tall. A gate for equal cards cannot
see a card that is uniformly wrong.

Stretching the figure into the gap was tried first and was worse. The bars inside
a figure are a fixed 10px, so a 251px frame held a 10px bar and read as a chart
that had failed to draw. What ships is the frame keeping its own size and
floating in the middle of what is left: heading, drawing, quote, top to bottom,
with the air shared either side of the drawing. The gap on the front card is
74px, and 0-26px on the other seven. The rule is scoped to `.mm-deck-card`,
because on `/case-studies` the same cards sit three across in a row, where it
would let the tallest card decide where everyone's chart is drawn.

### The gate that keeps it out

`src/test/copy-restraint.test.ts`, over the server render of seven routes rather
than the source, so a code comment explaining a rule cannot trip it and a string
that never reaches a page cannot either. Three rules, one per habit above:

- no copy about its own copy (`that is the whole idea`, `that's the point`,
  `no jargon`, and their family);
- no copy narrating a control (`drag it`, `use the arrows`, `tap to`,
  `pick one and`, `the answer opens`);
- **no sentence said twice on one page**, at six content words or more, over
  `p`/`li`/`h*`/`legend`. Quotes are excluded: the same client sentence appears
  in the story deck and the voices drum on the homepage, and that is two pieces
  of evidence rather than our copy said twice.

Run against the previous commit it fails six of its twenty-one cases, which is
the control that says it is measuring something. Against this one it passes.

The count under the questions heading (`8 of them.`) went with the rest. The
rows are numbered 01–08, so the last number is the count, and
`one-at-a-time.test.tsx` now asserts the numbering carries it rather than
asserting the sentence exists.

### Baselines after this change

- Tests: **395 across 27 files**, the 21 new ones being the copy gate.
- Lint **0 errors, 2 warnings**. Typecheck **0 errors**.
- `qa:screens` at eight sizes: no section over budget anywhere, nothing clipped,
  no sideways scroll, the action never buried. The homepage's worst section is
  now 1.28 screens at 360px and 1.04 at 1440.
- `qa:nojs`, `qa:oneway`, `qa:rhythm`, `qa:images`, `qa:cards`, `qa:entrance`,
  redirects, dialog shape and handoff: all green.
- `qa:alive`: **4 still viewports, down from 5, and the kind is unchanged.**
  Three of the four are still `.mm-try`: `/ai-brain @3376px` and
  `/ai-gtm @2532px` at 390, `/ai-brain @3600px` at 1440, plus `/ @844px`. The
  plan for the previous commit predicted that splitting the try-it panels would
  wake them and it did not; that prediction was wrong, and shortening the copy
  around them does not change it either. A form screen is finished the moment it
  is drawn. `Arrive` cannot fix it and its own docstring says so: the gate reads
  a page at rest, and an arrival has by then arrived. What those screens want is
  a set-piece, which is a design decision rather than a copy edit. No floor was
  lowered.

### Still open

- The three still `.mm-try` viewports above, unchanged in kind since
  1 September.
- The three-question form on `/ai-brain` runs 1.88 screens and is exempt by
  name. Making it two steps would fix the height and change a working
  conversion surface, which is a decision rather than a fix.
- `/new-age-leadership` and `/blog/:slug` are still lazy against a 348KB entry
  bundle, and were never measured for the hydration cost.

## 2 September 2026 — the declarations that could never win

Krish, with two screenshots: *"Can we also fix all the instances where text
wraps pointlessly, or where it is far too close to other components."*

The first screenshot showed `/ai-brain`'s payoff line sitting flush against the
two cards above it. The line asks for `margin-top: 30px`. It was computing 0.

### One line, and then sixteen more

`mindmake.css` carried the margin reset as
`.mm-site h1, .mm-site h2, ..., .mm-site p, ... { margin: 0 }`. That is
**(0,1,1)**, and it is above every single-class rule in this repository. Not
"wins on source order" — cannot lose. So a component writing
`.mm-payoff { margin-top: 30px }` was writing a declaration with no effect, and
measuring every element on five pages found **16 more of them**:

| the component | asked for | got |
|---|---|---|
| `.mm-payoff` | `margin-top: 30px` | 0 |
| `.mm-landing` (the fork's "No email required") | `margin-top: 18px` | 0 |
| `.mm-band-q` | `margin: 18px 0 10px` | 0 |
| `.mm-try-title` | `margin-top: 12px` | 0 |
| `.mm-objections-title` | `margin-bottom: 14px` | 0 |
| `.mm-voice-by` | `margin-top: 9px` | 0 |
| `.mm-drum-count` | `margin-top: 12px` | 0 |
| `.mm-voices-more` | `margin-top: 22px` | 0 |
| `.mm-board-rebuilding` | `margin-top: 14px` | 0 |
| `.mm-founder-name` | `margin-top: 10px` | 0 |
| `.mm-film-band-note` | `margin-top: 14px` | 0 |
| `.mm-shape-line` | `margin-top: 7px` | 0 |
| `.mm-story-outcome` | `margin-top: 9px` | 0 |
| `.mm-proof-figures` | `margin-top: 30px` | 0 |
| `.mm-fig-label`, `.mm-fig-pair` | `6px`, `14px` | 0 |

The same shape had cost the lead dialog its step rail's typography two commits
earlier, where `.mm-site button { font: inherit }` beat `.mm-brief-path button`.
That one was patched with `[type="button"]`. This is the general form of it.

**The fix is `:where()`**, which contributes no specificity. The reset is now
`:where(.mm-site) :where(h1, h2, h3, h4, p, figure, blockquote, dl, dd)`, which
is (0,0,0). It still beats the browser's own stylesheet, because an author rule
always does, and it now loses to any component that asks for a margin, which is
the whole job of a reset. A site-wide default that outranks the components it
serves is not a default; it is an override.

`scripts/qa/dead-css-check.mjs` (`npm run qa:deadcss`) walks every element on
five pages at both widths, reads back the author rules that match, and fails on
any declaration from a rule of one class or less that is beaten by a `.mm-site`
reset. Thirteen properties, not just margins.

Two bugs in that gate are worth recording, because both made it pass a tree it
had been written to fail:

 - It compared a reset's `0` against a computed `0px` as strings.
 - It recursed with `if (rule.cssRules) { walk(...); continue; }`. Since nested
   CSS landed, **every** `CSSStyleRule` carries a `cssRules` of its own, empty
   for a plain rule, and an empty `CSSRuleList` is truthy. So the walk skipped
   every rule in the stylesheet and collected nothing at all. `.length` is the
   difference between a gate and a green tick.

Reverted, the gate reports 8 dead declarations; fixed, none at either width.

### Text that wrapped pointlessly

Measured the same way: **72 blocks across four pages at 1440 and 390 ended on a
stub last line under a quarter of the width of the widest** — a full line, then
three words. The homepage lede read 558px then 352px.

`text-wrap: pretty` was already on many of them and cannot fix it: it tidies the
last line or two inside a paragraph, so a two-line quote whose natural break
leaves four words alone is exactly what it leaves alone. `balance` evens every
line, and the block reads as a shape somebody chose.

It is set once, as a (0,0,0) default on prose elements, because Chrome already
draws the line the rule wants: it balances up to six line boxes and falls back
past that. So a caption, a quote and a lede get balanced and a forty-word answer
is untouched, with no CSS having to know which is which. The thirteen component
rules that said `text-wrap: pretty` now defer to it; the one that keeps it is
`.mm-voice-panel blockquote`, the whole quote opened over the rail, which is the
one block long enough for `pretty` to be the right answer.

**72 stub-ending blocks became 3**, and the three are correct: two marquee spans
that scroll rather than wrap, and one seven-line founder paragraph where Chrome
falls back past its balance cap. The homepage lede is 455/455 at 1440 and
285/248/272 at 390.

### Baselines after this change

- Tests **395 across 27 files**, lint **0 errors and 2 warnings**, typecheck
  **0 errors**.
- `qa:deadcss` is new and green at both widths.
- `qa:screens`, `qa:nojs`, `qa:oneway`, `qa:rhythm`, `qa:images`, `qa:cards`,
  `qa:entrance`, redirects, dialog shape and handoff: all green.
- Two gates gained a skip for `.mm-visually-hidden`. It is the standard 1px
  clipped box that names a section for a screen reader, so being clipped away is
  the whole of its job. It only started reporting when the reset stopped being
  (0,1,1) and its own `margin: -1px` finally applied; the box was always there
  and always clipped.
- `qa:alive` reads **5 still viewports, 4 at 390 and 1 at 1440**, against 4 the
  commit before. The extra one is not a new dead section: `/ai-brain` is about
  40px taller now that its margins apply, so the gate's fixed sample points land
  twice on the same form panel. Driving every one of them, **four of the five
  are `.mm-try`** — `/ai-brain @3376` and `@4220` at 390, `/ai-gtm @2532` at
  390, `/ai-brain @3600` at 1440 — and the fifth is `/ @844px`. That is the same
  worklist as 1 September in substance, and no floor was lowered.

## 2 September 2026 — the toggle, the build, and the measure

Four things, all of them named in the same message, and the first two were live
defects nothing was looking for.

### The story deck's arrows did nothing on a laptop

The card index shipped with `useDragDrum`, whose travel is a rail's answer:
`count * pitch - viewport`. A rail stops when its last card reaches the right
edge. **A deck has no track.** Every card sits in the same grid cell, so its
travel is every card but the first and the frame's width has nothing to do with
it. Above about 1200px the frame is wider than eight cards at a 150px pitch, the
expression goes negative, `Math.max(0, …)` clamps it to zero, and every press of
the arrows was a no-op. It worked on a phone by arithmetic accident, which is
why every check that ran at 390 was happy.

`useDragDrum` takes a `span` now, and `StoryIndex` passes `(count - 1) * PITCH`.
Measured: at 1440 the counter goes `01 of 08` to `02 of 08` and the deck offset
0 to 0.997, where before both stood still.

**No gate pressed a button.** They measure geometry, reachability, motion and
copy; none of them asked whether a control did anything. `card-geometry-check`
now presses the next arrow of every deck and rail on the page and fails if what
it drives is in the same place afterwards. Reverted, it reports `pressing the
deck's next arrow moved nothing (0|)`.

### CAREER REFERENCE, cut in half

`.mm-voice` is `grid-template-rows: 1fr 52px 30px` with `overflow: hidden`, and
the attribution was a flex wrap of name, role and a bordered family chip. On any
card whose role ran to two lines that is four lines in a 52px box, so the label
was sliced through the middle on exactly the cards belonging to the people who
wrote the references.

It is two explicit rows now, the family beside the name, which is one line
whatever the role does. The label stays, because the canon is that a session
attendee is never read as a client; the **box around it is gone**, because three
families of proof have to be told apart and that does not need a badge.
Measured at 1440 and 390: nothing clipped, cards still equal at 177px.

### Five excerpts that quoted the problem instead of the result

Read cold on a card, each of these lands as criticism of the practice:

| | was | now |
|---|---|---|
| James Gately | "Previous support came to a halt once the paid engagement ended" | "With mind/make, I was empowered" |
| Dipti Divekar | "he never lets you become reliant on him" | "He puts you in the driver's seat, explains AI fundamentals in plain language" |
| adtech founder | "We had a brilliant product nobody could buy…" | the same, plus "Now they can. Including me." |
| media advisory | "We had expertise everyone respected and nothing they could buy." | "He turned the talking into something sellable." |
| coaching founder | "I'd had an AI mentor before who was way too technical." | "Krish thinks about me and the results I need." |

Every replacement is an exact substring of the same quote, unedited, and
`testimonials.test.ts` still holds that rule and the 108-character cap.

### Components that build as you scroll

Asked for repeatedly and not delivered. `Arrive` fires once on a threshold and
is then finished forever, so a section that has already arrived is a photograph:
scroll back and down and nothing happens.

`src/components/mindmake/Build.tsx` is the answer, and it needed no new
machinery. `useScrollDriver` already writes `--mm-p` across a reading pass,
position-driven and reversing. `Build` puts it on a group, each child carries
its own `--mm-i`, and one rule in CSS does the arithmetic. The fallback is the
whole safety case: `var(--mm-p, 1)` means unset is finished, so no JavaScript,
before hydration, a crawler and a reduced-motion visitor all get the group
complete, with no transform and no transparency. It adds a ref and nothing else
to the markup, so the two trees still match.

Wired into the homepage's three answers and both door pages' try-it panels.
Measured across a scroll pass at 390 and 1440, children go 0.25 to 1.00 with
position, and back.

**`npm run qa:alive` is green for the first time since it was written**: 28
viewports at 390 and 25 at 1440, none still. Its standing worklist was the two
try-it panels and `/ @844px`, and the note in CLAUDE.md said those wanted a
set-piece rather than a fix. That was wrong. What they wanted was to build.

### Text that wraps while its column has room

The earlier pass measured *widows* — stub last lines — and fixed 72 of them.
That was the wrong metric for the complaint. Measured properly, as block width
against the space the block has, the real defect is: `.mm-lede` is capped at
62ch and sits under an `h2` that spans the full 1240px column, so the heading
runs the width, the lede runs 590px of it, and **650px beside it is nothing.**

Widening the measure would be the wrong fix; 62ch is right and 100ch is not
readable. The column is what is wrong. Above 1100px a heading and the lede
directly under it share a row, matched with `:has(> h2 + .mm-lede)`, so the
lede's measure is its column rather than a fraction of one. Everything after the
pair spans both columns. Measured on the homepage at 1440: h2 619px at x=100,
lede 563px at x=777, same row, no gap. The founder note's paragraphs and the
drum's provenance note had the same shape one level in and lost their caps.

### Baselines

- **395 tests**, 0 lint errors and 2 warnings, 0 type errors.
- **Every browser gate green, `qa:alive` included, for the first time.**
  `qa:screens`, `qa:nojs`, `qa:oneway`, `qa:rhythm`, `qa:images`, `qa:cards`,
  `qa:entrance`, `qa:deadcss`, redirects, dialog shape, handoff.

## 2 September 2026 — an audience axis, and what the cache actually holds

The board can be read as one part of a business, and the mapping from nine
subject categories onto eight divisions is a guess. Measured over 400 live
items: **59 are about people and work, and only 17 carry `category: "org"`.**
Forty-two were filed under their subject instead, because a story has a subject
and an audience and one field can only record one of them. The subject always
wins, since the subject is what a headline is about.

Widening the keyword lists to recover them was tried and **rejected on the
measurement**: People went from 32 to 47 across 28 days and most of the 15 added
were wrong — *"NanoClaw enables persistent AI teams in Slack"* matched on
"team". No list of words tells the team you manage from a team of AI agents. A
classifier that has read the article can, so the fix belongs upstream.

### The contract

Two optional fields, additive, requested of CTRL's `live-headlines`:

- **`affects: string[]`** — which of the eight divisions a story lands on,
  judged from the article. When present it is the answer and the projection is
  not consulted.
- **`stance: string`** — `opportunity`, `shift`, `risk`, or `damage`. An item
  that only reports harm has no move in it for the reader, and printing it is
  doom framing about their business, which the house style bans. Those are
  dropped upstream; `isShown` is the second lock here.

A story about work changing is not excluded: the shape of entry-level hiring
changing is a `shift` with a move in it, a redundancy round is not.

### What is deployed, and what is not

`get-ai-news` is at **v69**, deployed 2 September 2026 and verified in both
shapes: the board view returns 28 days and 400 items with `affects` and `stance`
on every card, and the legacy view returns the same four keys and the same
headline key set as before. The mapper guards both fields, so a cache row
written before they existed still maps and rubbish in them never reaches a page.

**CTRL is not writing them yet.** Read straight from `live_headlines_cache`:
every retained day reports 0 with `affects` and 0 with `stance`, and the keys a
card actually carries are `aaMatched, benchmark, category, corroboration,
externalScore, freshness, headline, id, pov, say, score, snippet, source,
sourceCount, timeAgo, url`. Today's row was written at 10:30:24 UTC. So the
classifier change is merged but has not produced data: the daily job has not
re-run since, and the backfill has not been applied. Nothing on our side is
waiting on anything — the moment a row carries the fields, they flow.

### Baselines

- **405 tests**, 0 lint errors and 2 warnings, 0 type errors.
- Nothing renders differently until the fields arrive.

## 2 September 2026 — the board becomes a departures board

The board was one card on the homepage and six cards on `/ai-gtm`, filtered by
industry alone. It is now a list of rows on both, filtered by the part of the
business a reader runs, drawn from the whole retained window rather than from
today.

### The treatment

One item is a row: a gauge that sweeps to how well corroborated it is, and a
headline that turns over leaf by leaf until it lands. They run on one clock, so
a row finishes as one thing. Each row starts when it crosses into view, on its
own settle rate and its own jitter, so rows overlap and disagree the way a real
board does.

**Every leaf carries the true character as its own text.** The riffle writes a
decoy into `data-r` and CSS paints it over the top; landing deletes the
attribute and the real character is revealed again, because it never left. So
wherever a row renders — before hydration, under reduced motion, to anything
reading the DOM — the headline is written out in full and nothing moves. The
animation is never what puts the words on the screen. The board's data is
fetched, so with scripting off the section shows its own honest line rather than
rows; that is the fetch and has always been true of it, not the treatment.

**The board only exists while a leaf is turning.** A real split-flap display is
monospaced uppercase because each leaf is a fixed cell; ours is not, and a
70-character headline set that way is markedly harder to read — which was the
first thing the treatment was pulled up on. The slot, the hinge and the mono
drum appear only on a churning leaf. A settled character is ordinary type in the
site's own face, at reading size, with nothing round it.

### What a phone changed, which was more than the layout

A desktop row is one line of headline beside a gauge; a phone row is three. The
first phone build made three separate mistakes, all found by looking at it:

1. **It broke words in half.** "human researchers i / n safety", "annualized
   revenu / e", on nearly every row. Two adjacent inline-blocks are a break
   opportunity in Chromium whether or not there is a space between them, and
   every character was one. Each word is a `nowrap` span now; only a word long
   enough to strand a line — `Gemini-3.5-Transcribe`, 21 characters, real, in
   the feed — gives that up so it can break between leaves.
2. **The churning run sat above the line.** `overflow: hidden` on the leaf made
   Chromium take its bottom margin edge as the baseline instead of its text's,
   lifting every slot a descender's worth. The clip belongs to the decoy.
3. **The clock was per-character.** A 91-character headline took two and a half
   seconds, which on a phone — two or three rows in view rather than eight — is
   most of the visible screen unreadable for most of that time. `perCell` comes
   from a target total now: about 0.8s on a phone, 1.25s on a laptop, whatever
   the length. Rows also cascade by index rather than firing together.

The gauge moves too. On a laptop it is a 56px column to the left of the
headline; on a phone that would be an eighth of the width the headline needs, so
it drops to the foot of the row next to the corroboration it is a picture of.
The meta track is `minmax(0, 1fr)`, which is what guarantees the lane badge can
never push a row sideways: the mono text wraps instead.

### The filters

`BoardFilters` is one control used by both surfaces. The roles are the site's
own eight divisions — the same list the lead dialog asks for and the server
allowlists — so a visitor who says they run revenue in one place is offered the
word "Sales" in the other. **Each chip's count is what it would return if
pressed, with the other lens left where it is**, which is what makes "disabled
at zero" a true promise rather than an approximate one.

On a phone the two groups wrapped to eight rows and 370px, half a screen spent
on the control before a reader reaches a headline. The chips are tighter, which
takes the roles to three rows and 105px with all eight still on screen — they
are the reason the filter exists, and a rail showing two of nine hides the rest
behind a gesture nobody is told about. The industries are the second lens and
are the rail.

**The board reads the window, not the day.** Today alone is fine while nothing
is filtered, because today's items are the newest anyway. It fails the moment a
role is picked: People is 39 items in 476 and 0 of today's 13, so the chip added
to serve that reader would have been empty on most days. Every row carries its
own age, so nothing is passed off as today's.

### Two things came off the page

**The `pov` line.** Measured over the day's items, **25 of 29 are commands
addressed to the reader** — "Focus on innovative ad models", "Ensure rigorous
oversight", "Prioritize continuous improvement" — and **9 carry American
spellings**, including `judgment`. The house style bans both outright, and a
board printing ten of them is ten violations on the page. The board's reading of
an item is the stance word instead, which is one word and ours. The line comes
back when it is written in a voice this site can publish; that is an upstream
change to CTRL's classifier, and the addendum asking for it is written.

**The homepage's hard-coded timestamp.** `"Today 10:30 UTC, checked against
other sources"` was a literal in `Index.tsx` for months, on the one section
whose whole claim is that the timestamp is real. It renders from the cache date
through `timestampLabel` now, like `/ai-gtm` always did.

### The section split

The board and the four lane tiles under one heading ran to **2.87 screens on a
360px phone**. Where items are landing is a different question from what
changed, so they are two sections with a seam, which is what `qa:rhythm`
sanctions between two blocks standing on one ground. The lanes are two by two on
a phone rather than a four-storey stack. Eight rows on a laptop and four on a
phone: ten put `/ai-gtm` at 1.44 screens on a 1280x800 laptop, which is the
short-height size the budget is set by.

### What a still board turned out to be

`qa:alive` reported `/ @3600px` at 1440 and `/ @4220px` at 390 as still
viewports, both of them mostly board. It was the correct reading: the flap is an
arrival, and by the time a page is at rest an arrival has arrived. A board that
has finished is a photograph of a board.

So an arrived row keeps turning one word of itself over, at long uneven
intervals, only while it is on screen and never with the tab hidden. That is
what a real departures board does for as long as you stand in front of it, and
it is the honest fix rather than a floor lowered to meet the page. Both widths
came back clean.

Driving the needle from the row's position instead was tried first and reverted
within the hour: with `--mm-p` on the gauge, a row low on the screen showed a
low needle, so an item with two independent sources read as weaker than one with
a single source sitting higher up. **A gauge carries a value and may not report
where the reader has scrolled to.** The idle turn leaves it alone for the same
reason: how well corroborated an item is has not changed.

### The headings now say what the rows are

`/ai-gtm` read "What changed in AI today." over rows reaching back four days,
and the homepage read "this morning" over the same. The stamp beside each
already carries the exact figures — "Read 10:30 UTC · 28 days · 389 corroborated
items" — so the claim came off the heading rather than the accuracy off the
rows. `/ai-gtm` is "What changed in AI."; the homepage, which reads seven days,
is "What changed in AI this week."

Measured live through our own filters at the moment of the change: seven days is
73 items with every one of the eight roles stocked (People 2, Sales 3, Product
32) and 13.7KB on the wire; 28 days is 389 items (People 35, Sales 14) and
66KB. That is why the homepage reads a week and the door page reads the window.

### What went with the rewrite

`BoardCardView`, the six-card grid it sat in, its 1,795 characters of CSS, and
`topCard`, which existed to pick the homepage's single item. The homepage draws
from the same collection `/ai-gtm` does now, so there is no second rule beside
it.

### The sizes no gate here measures

`qa:screens` runs eight sizes and its shortest phone is 360x800. Real phones are
shorter: a 360x640 Android and a 320x568 handset are both common, and any phone
held sideways is 390px tall. A section's budget is a ratio, so the same four
rows read 1.26 screens at 360x800 and **1.51 at 360x640** — the markup did not
change, only the denominator.

Driven with a deliberately hostile payload — the longest headline the feed has
produced, a 40-character unbreakable token, the longest source domain in the
cache, and a card with no source, no age, no stance, no category and no link —
across 320x568, 360x640, 390x844, 844x390, 430x932, 768x1024, 1024x600 and
1920x1080, at rest and expanded to thirty rows:

| | before | after |
|---|---|---|
| 320x568 | 1.84 screens | **1.26** |
| 360x640 | 1.51 | **1.09** |
| 844x390, sideways | 1.67 | 1.38 |
| 1024x600 | 1.05 | **0.86** |

Two changes did it. The row count follows the **height** rather than the width —
three rows below 700px, four on a tall phone, eight on a laptop, through
`src/hooks/useShortScreen.ts`. And on a short screen both chip groups become
rails rather than one, because three wrapped rows of roles is a fifth of a 640px
screen; on a tall phone the roles still wrap, so all eight are on screen at once,
which is the point of the filter.

The landscape phone stays at 1.38, twelve pixels over a budget nothing measures
there, in an orientation where a reader has already accepted scrolling. Nothing
overflows, nothing clips and no page errors at any of the eight, open or closed.

A story that ran on two days is now shown once. Reading the window rather than
the day made a repeat possible where it never was before: nothing upstream
promises an id is unique across days, and two rows carrying one headline would
also be two React children with one key. Twenty-eight days of live data has no
duplicate today, which is not the same as a guarantee.

### Baselines

- **416 tests**, 0 lint errors and 2 warnings, 0 type errors.
- Every browser gate green: `qa:screens`, `qa:nojs`, `qa:oneway`, `qa:rhythm`,
  `qa:images`, `qa:cards`, `qa:entrance`, `qa:deadcss`, `qa:alive` at both
  widths, redirects, dialog shape, handoff.

## 2 September 2026 — the why, published as something to flick through

Three pieces of thought leadership had been lost in the rebuild: the "ten
years from now" flip cards, the history of people blaming their tools, and the
founder bio's personality. Both originals were recovered from this repository's
own git history (`f645644:src/components/BigProblem.tsx` and
`755163d^:src/components/OperatorsEdge.tsx`), not scraped from the old deploy.

### What was found first

**The canon already carried the whole argument, and none of it was published.**
`00_NORTH_STAR.md`: *"the leader gets faster at drafting and no better at
deciding"*; *"You can hand over the work. You cannot hand over the
understanding"*; *"Time saved is the setup, not the payoff. The real question is
whose time comes back, what they put it into, and whether the new capability
compounds."* That last line is the reinvestment idea exactly. So this was
publishing approved messaging, with the recovered material as its evidence,
its stakes and its voice.

**`/new-age-leadership` was an orphan.** Prerendered, in the sitemap, linked
from no page in `src/`, and the last file on the old Tailwind vocabulary. It
held the 14-agent org chart, which is the proof for an argument it never made.
It was also in no gate's page list, and two live copy violations had sat on it
unseen: a lede telling the reader to "Switch views, open a role and inspect the
decision it creates", and a caption under the chart reading "Switch to People +
AI, then open a role to see the human call behind it". Both were commands
narrating a control, and the caption repeated the lede.

### The shape

Not woven through the site, and not lumped into one page. The three pieces do
three jobs, so each went where that job already lives, and the site gained
exactly one link:

| Piece | Job | Home |
|---|---|---|
| The tool-blaming history | Answers an objection | `tried-it`, one new entry in `answers.json`, on the homepage and `/ai-brain` |
| Ten years / reinvestment | Makes the argument | `/new-age-leadership`, rebuilt |
| The bio | Establishes credibility | `FounderNote`, three paragraphs rewritten |

The homepage running order is unchanged. It gained one text link under "You
keep what it learns." and the founder note's personality: the fourteen agents
with named roles and a shared memory, the model bills, the playbook a client
sees being the one his own company runs on.

### The page, as an instrument

The first cut was paragraphs. Krish: *"I don't want paragraphs of text. Text
minimalist; design, UX and imagery should do the heavy lifting. Stunningly
visual and haptic on mobile."* So every beat is an instrument the site already
owns, with one line on it:

| Beat | Carrier | Words |
|---|---|---|
| Hero | `mm-hero-split` with film 05, the specimen drawers | h1, serif claim, one line |
| The reflex | **`ReflexDeck`**, four dated cards you flick, on `useDragDrum` like `StoryIndex` | four lines |
| The turn | one `ScrubText` claim lit word by word, Juma cited in mono | thirty words |
| The two hours | `ProcessTrack`, solid then dashed, with a `ScrubText` payoff | two titles, two lines |
| The proof | the existing `OrgChart` | one line |
| Agatha | **`ConvergeFigure`**, fifteen strips bending into one mint line, scrubbed | one line |

On a laptop the deck card is a landscape leaf, date and thing on the left and
the line on the right, so a one-line card does not sit in the left half of an
empty section. The deck advances 01 → 03 under a real touch flick on a phone,
settles to `--mm-deck-at: 1` and full opacity two seconds after a step, and is
four readable cards in a column with scripting off.

### What bound the copy

- **The card fronts could not ship.** "Or report to it", "Or become a
  commodity", "Or get passed by": `01_CANON.md` says public copy *never
  threatens the reader with becoming obsolete*. The value halves survive; the
  threats do not. The two ways the hours come back are stated in the third
  person, as the canon's own "faster at the work, better at the job".
- **"I'm the anti-consultant. I don't deliver slides, I deliver systems"** is
  the antithesis family the canon bans by name. The stance survives on the
  facts instead.
- "agentic" is banned vocabulary; "Mindmaker" is banned by the naming law;
  "TEN YEARS FROM NOW" and "WHO YOU'RE WORKING WITH" are eyebrows; "Tap to
  flip" narrates a control.
- **The history is checkable and corrected.** It is Thamus, a king in the myth
  Socrates retells, who refuses writing, not Socrates in his own voice. The
  calculator finding is Hembree and Dessart, seventy-nine studies gathered in
  1986. Juma's thesis is about who gains and who loses, which is the stronger
  claim as well as the accurate one. The air accidents usually cited alongside
  this history came out: named fatal crashes on a page that sells something is
  doom framing and in poor taste. So did the word "Luddite".

### What came out

The three "choices before you add an agent" cards, Agatha's three paragraphs,
the page's second "Start here" halfway down, and every Tailwind and
`framer-motion` line in the page and `AgathaStory`. `OrgChart` keeps its
utility classes: it is a diagram in its own frame, not a page laid out in a
retired system.

### The gates now see the page

`/new-age-leadership` is in the page list of every browser gate that takes
one, in `copy-restraint`'s routes and in the public contract's eyebrow scan and
route loop. `03_DESIGN_CONTRACT.md`'s line that the founder appears "nowhere
else: no first-person voice, no biography, no portrait" was out of step with
the shipped founder section and the canon's 28 August ruling, and now says
what ships.

### Baselines

- **419 tests**, 0 lint errors and 2 warnings, 0 type errors. The three new
  cases are `/new-age-leadership` running through `copy-restraint`'s three
  rules.
- Every browser gate green with the page in its list, at both widths.
  `qa:screens` carries one new named exemption, the org chart, for the reason
  above.

## 3 September 2026: the page arrives once, and the story gets a spine

Krish, scrolling the live site on a phone: slight glitches as the page loads,
the board's filter chips overlapping the words "your week", words that exist
for their own sake, and a homepage that does not tell one story. He named
tenex.co as the reference for how a page should reveal and asked to be
challenged rather than obeyed.

### What was measured before anything changed

The live site, in a real browser at 390x844 on a throttled 4G profile,
frame by frame from the compositor, against the same reading of the reference:

| moment | mindmake.co | tenex.co |
|---|---|---|
| first paint | 1.06s, type in fallback faces, wordmark half drawn, hero plate an empty dark box | 1.73s, a solid yellow screen |
| then | poster pops in at 1.7s; Archivo and Source Serif land at 1.9s and reflow the door copy 22px; Newsreader lands at 2.0s and rewraps the hero claim, block grows 30px; hydration at 2.5s moves the plate +7px, the h1 -6px and the claim -10px in one frame; the film replaces the poster at 3.0s in a visibly different tone | two seconds of yellow bars over a half-loaded statue, then the pixel face swaps in at 3.3s |
| on WiFi | the same seven changes, faster | one designed arrival |

Seven changes to the first screen in two seconds, and `qa:entrance` passed,
because it measured a settle budget and a light flash and this was neither.
The plate's light sweep animated `left`, a layout property, and registered a
layout shift on every frame it moved: 28 in eight seconds on the hero alone.
The reference is worse than this site on a slow connection and better on a
fast one, which is the whole argument for fixing the causes before adding a
curtain, and the curtain was chosen with that number on the table.

The filter label: `<span class="mm-chip-label">` was `position: sticky;
left: 0; z-index: 1` with no background inside the horizontally scrolling chip
rail, so the chips scrolled under the words on any phone under 700px tall and
on `/ai-gtm` on every phone. The label named nothing the chips do not.

### The read that was given back

The site was built section by section under gates, so every section was
locally right and the page had no spine: the choice came before the reason,
the argument was split across two pages joined by one link, sections restated
their neighbours in words, and chrome (the privacy box and the action bar)
took a quarter of a phone screen for the whole visit. The positioning
sentence Krish quoted (an outcome business around one recurring executive
decision, sold as diagnostic and installation, captured in CTRL) is the
business model, not the promise, and the site should not say it: "agentic" is
banned vocabulary and CTRL is never a third offer. What was missing from the
page was the word that matters, that the decision comes back, and the method
that nobody else can describe.

### What changed

**The entrance, at the root.** The prerender preloads the four latin faces,
both brand images and the priority poster, read from the built output (the
poster preload was never emitted, see 4 September; the faces and the brand
images were); the
four faces stand on metric-matched fallbacks computed with Capsize; the
wordmark and mark are fetched at high priority and decoded before paint;
parallax is relative to the driver's first write (`--mm-p0`), so hydration
moves nothing; a `Build` group's first value travels for 400ms instead of
snapping; a loop mounts only when its plate is near and fades up over its
poster on `playing`; the sweep runs on `transform`. Then the arrival: an
inline head script holds the type and a curtain of fifteen ink strips until
the faces are in or 700ms after the first frame, and `qa:entrance` reads its
marks, judges the arrival by direction, reads layout shifts against a floor
and runs a reduced-motion pass. The design contract carries the rule under
"The entrance: the page arrives once".

**The homepage's story.** Hero; the hours and the hinge on paper, condensed
from the argument page (`HOURS` and `HINGE` in `src/content/reflex.ts`); the
two doors as their own section and the page's one way in, each card marked as
a primary action inside one `role="group"`; the marquee; proof; voices; the
board; the founder; the questions, moved below the founder; the publication;
the close, which now reads "Start with one decision you keep having to make."
with no body line. The section on where everything a leader teaches AI ends
up moved to `/new-age-leadership` after the chart. The brain door carries one
sentence on the method, proposed for sign-off. The prerender's entry for the
argument page had carried the retired org-chart title, description and
JSON-LD into the served head since the page was rebuilt; it carries the
page's own words now, and the hand-written `body` fields nothing had read
since the component render landed are gone.

**The words that were there for the sake of it.** "Your week" and "Your
market" and their sticky rule; the homepage board's foot line and the word
"this week" in its heading, which the stamp contradicted on the day the page
was photographed (the cache held one day and the stamp read "1 days", also
fixed); the lane key on `/ai-gtm`, which printed "orchestration" on a public
page; the lane glosses, which were the lever headings said again; "33 of
them." and the two-sentence note under the voices drum; the publication
band's lede; the ask bar's placeholder; the org chart's control-narrating
lede and the Agatha story's lede on the argument page; "Four things" in two
headings whose four things were visible; two of the four CTRL spec chips and
the small line under the CTRL claim. The privacy notice is one line and one
button, full width above the action bar on a phone.

**The method on `/ai-brain`.** "How it learns you.": three steps as a group
that builds with scroll, unnamed. Wording proposed, awaiting sign-off.

### Measured after

Against the built output on the gate's throttle, the same instrument before
and after, at 390 and 1440. Before, the gate could not see a font swap or a
parallax nudge at all; the layout-shift reading and the arrival marks are new.

| | before | after |
|---|---|---|
| first paint, 390 `/` | 1.12s, in fallback faces | 1.40s, with the faces already in (read on 3 September as the curtain; it was not, see 4 September) |
| first paint, 1440 `/` | 1.43s, in fallback faces | 1.46s |
| the faces in | about 1.0s after paint (production: 1.87s and 2.02s) | before the first frame: `mm-arrived` at 1.21 to 1.30s on every path |
| the type arrives | as each face landed, twice | once, 220ms after the strips start to lift |
| page replaced after paint | 0 (as the gate then read it) | 0, and now judged inside the arrival by direction |
| layout shifts after paint | not measured | 0 on every path, both widths |
| hydration nudge | plate +7px, h1 -6px, claim -10px in one frame | none: the first write is the origin |
| the dialog on `/?start=1` | inside the first painted frame | 2.25s at 390, 2.35s at 1440: about 0.9s after paint, because the script now travels behind the faces and the posters. Reported as its own reading with a 2s budget |
| reduced motion | not measured | no marks, no curtain, no video, both widths |

**Corrected on 4 September 2026.** The two paragraphs that stood here said
the curtain cost 600ms of held screen and that a curtain keyed on a class of
`<html>` made Chromium present no frame until the class came off. Neither
was true. The root marker was named `mm-curtain`, the strips' own class, so
the default `.mm-curtain { display: none }` matched `<html>` and the whole
document was out of render until the marker came off; and the two-line body
script that switched the strips on found `<html>` first and switched on the
root instead, which promoted it to `display: grid` and let it paint with no
strips over it. Every reading in the table above was taken with no curtain
on screen. The 4 September entry below has the bisection and the readings
with the curtain actually rendered.

Bundle: the homepage chunk went from 363,757 to 365,535 bytes (the track and
the driver's first-write logic); the argument page's from 348,314 to 348,190.

### Baselines after this change

- Tests: **433 across 28 files**, all passing. New: `src/test/scroll-driver.test.tsx`
  (the first write and the silent subscriber), the entrance and preload cases
  in `first-screen.test.ts`, and the entrance describe in
  `reveal-contract.test.tsx`. `brief2-public-contract`'s absent-state check
  now reads keyframes blocks only; `brief2-email-cap` reads the served privacy
  page rather than a hand-written copy the prerender no longer carries.
- Lint **0 errors, 2 warnings**. Typecheck **0 errors**.
- Every browser gate green at both widths, built with
  `VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED=true` as production is: `qa:entrance`
  (with the arrival, layout-shift and reduced-motion readings), `qa:alive`
  twice at 390, `qa:images`, `qa:rhythm`, `qa:cards`, `qa:oneway`, `qa:nojs`,
  `qa:screens`, `qa:deadcss`, redirects, dialog shape and handoff. The
  handoff gate now serves the board fixture on its `/ai-gtm` leg, as the other
  gates do; without it the board's fetch to the build's placeholder address
  was logged as a browser error that had nothing to do with the offer. With
  rows to filter, the board offers the same eight divisions the form asks for,
  so the gate's click on "Leadership" is scoped to the form's own question.
- `qa:screens`: the homepage's worst section is 1.22 screens at 390x844; the
  new problem section and the doors section are both under budget at every
  size; no new exemption. The GTM page's lever exemption follows its renamed
  heading.
- Not measured from here: production itself, until this is deployed. The
  frames in the table's "before" column are from production on 3 September;
  the "after" column is the built output on the same throttle.

### Still open

- The method wording on the brain door and on `/ai-brain` needs Krish's
  confirmation; it is described, never named, per the canon.
- The vector wordmark: resolved on 4 September, below.
- The curtain's cost is measured and recorded in the 4 September entry;
  `var CURTAIN=false` in `index.html` keeps the type arrival alone if the
  number is not worth it.
- On the day of measurement `get-ai-news` returned one day for a seven-day
  request; the heading and stamp are honest either way, the window question
  is upstream.
- A face that lands after the 700ms hold can rewrap a line that sits near
  its column's edge (seen once on the hero claim, above); metric fallbacks
  match average width, not every string.
- Pre-existing and out of scope: retired routes hydrate the homepage's
  prerendered markup against a different route; whether a privacy notice is
  needed at all for cookieless analytics.

## 4 September 2026: the curtain was never there

Found while writing the production readings of the 3 September deploy into
this file: the root element's class list read `is-on mm-arrived`, and `is-on`
was meant for the strips. Pulling on that thread found two defects in one
construction, each hiding the other, and a gate that could see neither.

### What was actually shipped

The root marker for the curtain was named `mm-curtain`, the same name as the
strips' own class. Two consequences:

- `.mm-curtain { display: none; }`, the default that keeps the strips off
  without a script, matched `<html>` as well. While the marker was on, the
  whole document was `display: none`: nothing rendered, nothing was
  presented, and Chromium's first paint was whenever the marker came off,
  1100ms after the arrival mark. That is the "any rule under a root class
  held every frame" finding of 3 September, misread. The bisection that day
  was against a stylesheet in which the root default was present in every
  variant, so every variant held.
- The two-line body script that switched the strips on asked for
  `.mm-curtain` and got `<html>` first, so `is-on` went on the root, which
  then matched `.mm-curtain.is-on { display: grid; position: fixed; ... }`.
  That is what let production paint at 1.75s: the root was promoted from
  `display: none` to a fixed, full-viewport, fifteen-row grid with
  `pointer-events: none` and `overflow: hidden` for about a second, and the
  strips stayed `display: none`. Every "curtain" frame recorded on
  3 September, local and production, was a page with nothing over it. On a
  desktop with classic scrollbars the root's `overflow: hidden` would also
  have taken the scrollbar for that second and given it back, a horizontal
  reflow of the whole page that no gate here runs a browser wide enough to
  show.

The bisection redone, on the built stylesheet with a patcher that asserts
each edit landed, at 390 on the gate's throttle, first paint by the
browser's own timing:

| variant | first paint |
|---|---|
| as built (strips on, found by id) | 2.54s |
| strips without `will-change` | 2.55s |
| sweep without its animation, and no sweep at all | 2.53s, 2.54s |
| `position: absolute`, no `z-index` | 2.54s, 2.53s |
| header exposed, strips transparent, text inside the curtain | 2.54s, 2.54s, 2.52s |
| the strips `display: none` throughout | 2.54s |

Ten variants, one number: the strips were never the cause. With the root
marker renamed, first paint is 1.38s and the strips are on the first frame.

### What changed

- The root marker is `mm-covered`; the strips stay `.mm-curtain`. The
  curtain is keyed `.mm-covered .mm-curtain`, which is the root-keyed rule
  the 3 September note said could not work. The body script and `is-on` are
  gone, and the head script's cleanup removes the marker and nothing else.
- The seams. `gap: 1px` between strips showed the page through the curtain:
  fifteen bright lines where the paper section sat under it on the first
  frame, and a hairline at every fractional row edge after that. The line is
  drawn inside each strip now (`box-shadow: inset 0 1px 0 var(--mm-ink)`)
  and each strip runs a pixel into the next, so it lifts with the strip and
  nothing shows through.
- The wait starts on the second animation frame, and the lift starts
  120ms after the mark. The first frame's callback runs before that frame
  is rasterised, which took 78 to 172ms across ten readings, and the faces
  are usually in already, so the lift was beginning on a frame nobody had
  seen and the first frame on screen had the top strips already going. The
  second frame's callback still runs 44 to 111ms before its frame is on
  screen, which is what the base delay on the lift is for: the first frame
  anyone sees is the whole curtain, and the wipe begins on the next.
- `first-screen.test.ts` pins the two names apart: the head script may not
  set `"mm-curtain"` on the root, and nothing may add `is-on`.
- `qa:entrance` reads two more things, and each fires on the reproduced
  defect. An arrival mark more than 400ms before first paint is an arrival
  that played on a page nobody was shown (the defect read 1,180ms; the
  honest lead, before the one-frame wait, read 78 to 172ms, and the floor
  is set clear of it). And a page that set the marker and never displayed
  the strips for a single animation frame is a curtain that was asked for
  and never shown. Both reproduced by patching the built stylesheet:
  "the arrival began 118ms before first paint" and "the curtain was asked
  for (mm-covered) and never displayed".

### Measured after

Against the built output on the gate's throttle, both widths, the same
instrument as 3 September with its two new readings. "Curtain" is the count
of animation frames on which the strips were displayed while the marker was
on; "lead" is how far the arrival mark fell before the first presented frame.

| | 3 September as shipped (reproduced) | 4 September |
|---|---|---|
| first paint, 390 `/` | 2.54s, the finished page, nothing over it | 1.44s, the whole curtain, seams closed |
| first paint, 1440 `/` | not re-measured | 1.44s |
| the curtain on screen | 0 frames on every path | 59 to 67 frames at 390, 27 to 40 at 1440, every path |
| the arrival mark against first paint | 1,180ms before it: the type arrived on a page nobody was shown | 44 to 111ms before it, and the lift starts 120ms after the mark, so the first frame on screen is the intact curtain and the wipe begins on the next |
| the wipe | never seen | top strip going by 230ms after paint, all fifteen clear and the type in by about 700ms |
| layout shifts after paint | 0 | 0 on every path, both widths |
| page replaced after paint | 0 | 0 |
| the dialog on `/?start=1` | not re-measured | 2.14 to 2.20s at 390, 2.11 to 2.13s at 1440 over three runs, read from the DOM: about 0.7s after paint |
| reduced motion | no marks, no curtain, no video | the same |

Photographed at 390 through the capture harness, not the gate: frame one at
1442ms is fifteen strips of the raised ink with an ink line between each and
no page showing through; at 1519ms the same; at 1670ms the top strip is
lifting; at 1875ms the strips are half gone top to bottom and the hero claim
is arriving beneath them; at 2073ms three strips remain over the paper
section; at 2333ms the page is settled. `fonts.ready` at 1662ms,
`DOMContentLoaded` at 2007ms, zero layout shifts across the run.

What the curtain costs on this profile: nothing held. The faces are in
before the first frame, so the wipe is the entrance; the 700ms hold only
happens when a face is still on its way at first paint.

Production, deployment `dpl_GQ7wCHKhhRK34Nf5EpxJ3bPRahHc` for commit
`cf2b2d0`, read through the session's forwarder at 390x844 on the same
throttle, which adds a hop of its own so the absolute times run later than
the gate's: the head script's mark at 610ms, first paint and first
contentful paint together at 2264ms and the frame is the whole curtain
with its seams closed, the arrival mark at 2199ms (65ms before paint, inside
the honest lead), the strips displayed for 60 animation frames, the top
strips lifting at 2558ms, the page settled by 3085ms, `DOMContentLoaded` at
2694ms, the loop playing, zero layout shifts, and the root's class list
`mm-arrived` alone at rest. The 3 September production run through the same
forwarder read first paint at 1752ms with nothing over the page and the
root's class list `is-on mm-arrived`; the difference in first paint between
the two runs is the network on the day and the curtain being there at all,
and the local gate, which holds the network still, reads 1.44s for both
builds.

### The wordmark is a vector

Krish uploaded the designer's two Canva exports to `main` the same morning
(commit `03e40fa`, where the originals remain). What they were: the icon,
900x472 with the mark centred, four shapes under four gradients written as
659 stops each, 65KB; the wordmark, a megabyte, because its nine letter
outlines were clip paths over eight copies of one 124KB gradient picture,
vector letters with raster fills, and the last letter a plain mint path with
a transform of its own. The gradient in the picture ran from a near-black
navy at the M to the mint at the e, the paper version, which is exactly the
gradient that vanished on the ink and had the PNG repainted on 3 September.

What is in the tree now: `src/assets/mindmake-mark.svg`, the same four
shapes under the same four gradients at seven stops, trimmed to the ink,
2.5KB; and `src/assets/mindmake-wordmark.svg`, the nine outlines as paths
under one gradient from `--mm-tx` to `--mm-mint` read from the tokens, the
e's transform baked into its coordinates so the gradient lands on it (with
the transform left in, the gradient was evaluated in the letter's own
space and the e came out white), trimmed to the ink, 2.5KB. Its box is
648 by 109 units, a ratio of 5.94 against the PNG's ink ratio of 5.93, so
the header's widths did not change. `MindmakeBrand` writes both into the
page, and `PageLoading` uses the same component; each instance gets its
own gradient ids, because `url(#id)` resolves to the first match in the
document and a gradient's stops read their custom properties where that
first instance sits, which on the test page put the header's colours on a
paper instance. The three PNGs are gone, the two brand preloads are out of
`scripts/prerender.mjs`, and the two uploaded files are deleted under the
naming law, their contents rebuilt and their history kept.

Found while taking the brand preloads out: the poster preload beside them
had never been emitted. React writes the attribute as `srcSet` in the
server render and the pattern in `scripts/prerender.mjs` was written for
`srcset`, so it matched nothing on any page, production included, from the
day it was added. The unit test passed on the string in the script alone.
The pattern is case-insensitive now, and the test reads the pattern out of
the script and runs it over the real render of the homepage, where it has
to find a webp.

Production for this change is `dpl_67GND784KVV4iQVSHPA9CpUXwp1g`, commit
`fd8c07e`, and it serves the two vectors inline with their own ids per
instance, no brand image, and the webp poster preload on every page. Read
through the forwarder at 390 on the throttle: first paint at 1692ms and the
frame is the whole curtain, the strips on for 75 frames with the sweep
crossing them, the arrival at 2332ms, which is the 700ms cap because a face
was still on its way, zero layout shifts, the loop playing, and the vector
header in the settled frame. One residual from that run, not the site's:
the Newsreader file never arrived through the forwarder in six seconds, so
the hero claim stayed in its metric fallback, which sets "Yours should also
know you." on one line where the face sets two. The fallback matches the
face's average advance width, not every string, so a face that lands after
the hold can rewrap a line that sits near the column's edge; the hold
covers it when the faces arrive inside 700ms of the first frame, which the
preloads make the usual case. Recorded here as a known limit of metric
fallbacks rather than fixed by tuning one string.

### Baselines after this change

- Tests: **435 across 28 files**, all passing. New: `first-screen.test.ts`
  pins the root marker and the strips to different names, and that nothing
  adds `is-on`; its brand case holds the two vectors inline, small,
  image-free, with the name on the wordmark once, and its poster case runs
  the prerender's own pattern over the real homepage render.
- Lint **0 errors, 2 warnings**. Typecheck **0 errors**.
- Every browser gate green at both widths, built with
  `VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED=true` as production is, `qa:alive`
  twice at 390. `qa:entrance` carries the two new readings (the curtain's
  frames and the arrival's lead) and one repair found by running it twice
  in a row: the dialog on `/?start=1` was timed from the frames, the first
  big change in the still cells, and on one run at 1440 the hero film was
  playing over forty of the sixty-four cells by the time the dialog opened,
  so too few still cells moved to register and the gate reported a dialog
  that never opened on a page where it had. The dialog's moment is read from
  the DOM now (the panel's insertion), and the frames inside its opening are
  excused from the replacement count by that mark rather than by being the
  first big change. Three consecutive green runs after the repair.
- Bundle: the built stylesheet and the homepage chunk are within a few bytes
  of 3 September; the body script is gone from `index.html`.

## 4 September 2026: what a crawler and a share card are given

Krish, from the browser: the tab icon looked terrible and should have a
transparent background, and was the site fully discoverable by robots and
crawlers, with the social plates correct and as inspiring as possible.

### What was found

- The tab icon was the old hand-drawn approximation of the mark in a
  different green, and the touch icon and the Windows tile sizes wore a black
  square. Nothing had been redrawn since the brand changed.
- Every page and every post shared one social plate drawn for a brand two
  rebuilds ago: a paper card holding the wordmark, the retired headline "Put
  your best judgement to work with AI", Title Case links, a grid ground the
  site never had. Its alt text was the word "Mindmake".
- The Organization record's logo pointed at the old 512px tab icon.
- Both URL forms of every page answered 200 (`/ai-brain` and `/ai-brain/`),
  with only the canonical to say which was the page.
- The retired `/intake` and `/testimonials` routes redirected temporarily,
  so nothing they still carried moved with them.
- `llms.txt` said the hand-off "begins with a company website" and showed a
  preview "before any email address is asked for", which is the hand-off of
  two rebuilds ago.
- The web app manifest carried the previous brand's colours.

What was already right, measured on production: `robots.txt` with the
sitemap line, a sitemap of 21 URLs, a canonical, a title and a description
on every page, `index, follow` in the head and the `X-Robots-Tag` header,
`og:type` article on the argument page and the posts with Article records
carrying dates, an Organization and WebSite record on every page, a real 404
for unknown routes, one-hop 308 redirects from every retired domain and
route, `en-GB` throughout, and every page rendered to markup at build.

### What changed

- The icon set is drawn from the vector mark by `scripts/generate-favicons.mjs`:
  the SVG, the ICO (16, 32, 48) and the 16, 32, 192 and 512 PNGs transparent;
  the touch icon, the two maskable install icons and a new 512px logo for the
  Organization record on the ink, the mark inside the safe zone; a one-colour
  pinned-tab SVG. Eight files nothing referenced are gone.
- One social plate per indexed page and post, 21 in all, in the site's own
  design: the ink, the mark and the wordmark, the page's headline in the
  grotesque, its claim in the serif and the mint, the first frame of the
  film its hero plays faded into the ink, and the address in the mono. The
  words come from `scripts/lib/pages.mjs`, the list the prerender now writes
  the head from, and from the posts' own titles, so a share card and a
  crawler read the same sentence. `og:image:alt` and `twitter:image:alt`
  carry the words. The URL carries a version from the words, so a network
  that caches by URL fetches a repainted plate.
- Painted by a browser and committed, because the production build has no
  browser. `src/test/discoverability.test.ts` compares each plate's recorded
  words with the page's current words and fails until `npm run social-plates`
  repaints them; it also holds the plate's size and weight, the icon set,
  the manifest's colours, the logo, the URL form and the llms.txt lines.
- `SEO.tsx`, which rewrites the head on client navigation, reads the same
  manifest, so what a crawler that runs scripts sees matches what one that
  does not sees.
- `vercel.json`: `trailingSlash: false`, so `/ai-brain/` is a 308 to
  `/ai-brain`, the canonical form; `/intake` and `/testimonials` are
  permanent. `/start` and `/decision` stay temporary on purpose: short links
  people type.
- `llms.txt` describes the hand-off the site runs: four details, the read on
  screen, one easy question, the code to the work email, the proposal on
  screen, by email and as a document.

### Verified on production

Deployment `dpl_5saD1mJed9NpT9oXA6wgGHSUPGnz` for `0704583`: the homepage,
`/ai-gtm` and a post each serve their own plate with a version in the URL
and the page's words as the alt text; the plates, the SVG and ICO icons,
the touch icon, the logo, the pinned-tab SVG and the manifest all answer
200 with the right type; the old plate and the old tile sizes answer 404;
`/ai-brain/`, `/blog/` and `/case-studies/` are 308s to the canonical
form; `llms.txt` carries the four details; the manifest carries the ink;
the Organization record names the new logo.

### Still open

- Nothing here can say how a share looks on LinkedIn or on X until one is
  posted; both cache by URL, so the first share of each page fetches the new
  plate, and a repainted plate needs the version in its URL to change, which
  the manifest does when the words change.
- The plate for a post uses its category's film. A post that earns its own
  still can set one when there is one.
- The 404 for an unknown route is Vercel's plain text. A branded page would
  be `dist/404.html`, which the prerender does not write yet.

## 4 September 2026: the privacy strip, and the rules that reached it

Krish, from an Android phone: the privacy banner glitches terribly, and make
sure this cannot happen on any device. The photograph showed a dark strip
floating above the bottom of the screen with the page showing underneath it,
its one sentence broken over two lines, and its button reading GOT / IT.

### Three causes, all reproducible at every phone width

- **It was positioned for a bar that is usually not there.** The strip sat at
  `bottom: calc(76px + safe)`, the action bar's height, whether or not the bar
  was up. The bar appears later than the strip (0.8 of a screen against 0.6)
  and stands down whenever the page's own action is on screen, so most of the
  time it was not. Measured: a 76px gap under the strip at 360, 390, 412 and
  430, at every scroll position, with the page visible through it.
- **A row designed at 10.5px rendered at 16px.** The strip is the one public
  surface rendered outside `.mm-site`, and `src/index.css` styles a bare
  `p { font-size: 16px; line-height: 1.6 }`. A bare element rule beats
  inheritance whatever its specificity, so the container's 10.5px never
  reached its own paragraph. The strip measured 65px tall against a 39px
  design, on every phone, since the day the rule was written.
- **A declaration that cancelled the one above it.** `.mm-cookie-notice p`
  read `white-space: nowrap; text-wrap: initial`. In CSS Text 4 `white-space`
  is a shorthand whose components include `text-wrap`, so the second
  declaration reset the first back to `wrap`. The computed value was
  `white-space: normal`: the sentence had never been on one line.

Android's own font boosting sits on top of all three, and nothing in the
stylesheet had ever told it not to.

### What changed

- Everything inside the strip declares its own type: `font: inherit` on the
  paragraph, in one declaration rather than three that can be half-undone,
  and `white-space: nowrap` on the button so the label cannot break. The row
  wraps instead when it runs out of room, which is the tidy end of the same
  problem.
- The strip is flush to the bottom edge on a phone (`inset: auto 0 0 0`), and
  the action bar stacks on it by reading `--mm-cookie-reserve`. The bar
  publishes its own measured height into `--mm-bar-reserve` rather than the
  `76px` that used to be written down in two stylesheets, each with a comment
  asking the other not to drift.
- The footer adds both reserves in one declaration. They used to be two rules
  setting the same property, so the later one won and whichever piece of
  chrome lost sat on the last line of the footer whenever both were up.
- `text-size-adjust: 100%` on `html`: the browser's guess at what needs
  enlarging is refused, and the visitor's own text-size preference still
  scales everything.
- Only the full-width phone strip wraps. Adding `flex-wrap` to the corner card
  as well stacked it into a tower, because its width is `max-content`: 234px
  tall at 768 and 176px at 1024, found by the new gate on its first run.

### The gate

`npm run qa:chrome` (`scripts/qa/fixed-chrome-check.mjs`) drives both pieces
of chrome into view at eight screen sizes, two pages and two text scales, at
three scroll positions each: past the strip's threshold and before the bar's,
past both, and the foot of the page. It asks that the strip is flush and full
width on a phone and at its designed inset on a laptop, that the two never
overlap, that neither is over its height budget for that text scale, that the
sentence and the button still share one row at the design's own size and that
neither the sentence nor the label has broken inside itself, that nothing
overflows sideways, that neither buries an action the reader has scrolled to,
and that the last line of the footer is readable under both.

Each of the four defects was put back into the built stylesheet on its own and
the gate reported it: the float ("floats 76px above the bottom of the
screen"), the inflated type ("has broken into two rows at the design's own
text size"), the breaking label ("button label is on 2 lines") and an
unstacked bar ("the action bar and the privacy strip overlap").

The row check took three attempts, and the two that failed are the useful
part. A height budget let the inflated strip through at 75px. Counting the
sentence's own lines let it through as well, because at 16px the sentence
still fitted on one line and it was the **button** that dropped to a second
row, which is a strip that has visibly broken without either piece wrapping
inside itself. What catches it is the vertical distance between the sentence's
centre and the button's.

Two things about the gate are worth knowing before reading a number out of it.
Its text scaling multiplies every font size once, reading all of them before
writing any; an `em` rule on a subtree compounds at every level, which put the
bar's button at 38px from a 17px design and had the gate reporting a 167px bar
the site never renders. And it asks whether an action is buried the way
`qa:screens` does, by scrolling the action to the middle of the screen and
hit-testing its centre, rather than by rectangle overlap: chrome on the bottom
edge clips the last few pixels of a tall card at some scroll position on any
page, and a card the reader can scroll is not a buried action.

### Baselines after this change

- Tests: **451 across 29 files**, all passing. New: the privacy strip's rules
  in `CookieConsent.test.tsx`, which hold what the gate measures the result
  of: the strip declares its own type, no declaration cancels the one above
  it, the label may not break, the strip is flush and the bar stacks on it,
  the footer adds both reserves, and the browser's text guess is refused.
- Lint **0 errors, 2 warnings**. Typecheck **0 errors**.
- Every browser gate green at both widths, plus `qa:chrome` at its own eight
  sizes and two text scales.

### Still open

- `src/index.css` styles bare `h1` to `h6`, `p` and `small`, and this is the
  third live defect that file has caused. Removing those rules is not a
  no-op: measured across five pages, paragraphs move from 16px to 17px and
  the blog's `small` from 14px to 8.4px, because the design system's own
  defaults have been dead underneath them. That is a change with a visual
  pass attached, and it is not this commit.

## 5 September 2026: the edge rewrite

Krish's ikigai work (Master Ikigai v4 and the positioning sheet derived from
it, both 5 September) sharpened what Mindmake is for, and he asked for the
site to be read as a busy leader would and made coherent, concise and clear.
What that reading found, and what changed, is in `00_NORTH_STAR.md`
("Sharpened, 5 September 2026") and `01_CANON.md`. The record here is what
shipped and what was measured.

### What shipped

- **The homepage** says what the work is on the first screen (a lede under the
  claim, which the door heroes had and this one did not), puts the two doors
  second, and replaces the two hours and the hinge with the three things the
  work answers, on paper, built with scroll from `THREE_THINGS` in
  `src/content/reflex.ts` and closed by the private line. The voices drum
  shows the client families only; the archive keeps all thirty-three
  (`ProofDrum` gained a `families` prop). The board is headed as early sight.
- **`/ai-brain`** lost the fork band and the climb, which were the argument the
  homepage and `/new-age-leadership` already make, and gained client proof:
  two stories from the archive in `DoorStories`, chaptered on a phone. The
  CTRL argument and the captures stay two sections, because merged they ran
  1.8 screens on a laptop. Fifteen sections to twelve.
- **`/ai-gtm`** puts the board straight after the levers, then two GTM-shaped
  stories, then the process, and the form after all of them rather than third.
- **No duration in public copy.** Every "thirty days" that was a promise went:
  heroes, tracks, answers, the shell, the meta, `llms.txt`, the dialog's door
  step and preview label, the on-screen proposal title, and one word of the
  founder's bio. Facts from the record (the archive's counter, the pilots
  figure) stay.
- **Answers**: three questions renamed, five answers made duration-free, and
  `private` added ("Does anyone in my company need to know?"). The canon's
  list and the contract test's topic map moved with them.
- **Server copy**: `send-follow-ups` v5 is live with the follow-up's offer
  line read in private rather than thirty days; the body was read back and
  matches the repository. `submit-mindmake-brief` carries the same edit in
  the repository (the proposal's "A useful first proof" label in the email,
  the attachment and the plain text, and two pressure lines) but **is not
  deployed**: the sixteen-file closure could not go through the session's
  tooling, so it is the first follow-up, per the lead-pipeline rule.
- Deleted: `ForkBand.tsx`, `ClimbLadder.tsx`, their stylesheet blocks, the
  paper band head, and the tests and exemptions that named them.

### Measured

- Tests **450 across 29 files**, lint **0 errors, 2 warnings**, typecheck
  **0 errors** against `tsconfig.app.json`.
- Every browser gate green at 1440 and 390 on the built output: rhythm (45
  sections across 4 pages), screens (8 sizes, 4 pages, nothing past 1.35),
  one way in (10 pairs), no-JS (5 pages, 50 answers present), cards (18 on
  `/`, 33 on the archive), images, dead CSS, chrome, dialog shape, handoff,
  redirects, entrance (clean on every path, page replaced 0x), and aliveness
  (30 viewports at 1440, 33 at 390).
- The screen gate caught two things the first pass got wrong, and both were
  fixed by shape rather than by a floor: the merged CTRL section, and two
  full story cards at 360px (1.43 screens, chaptered to one).
- Rendered DOM of the seven routes scanned: no duration promise, no em dash,
  no `judgment`, the operator's name only in the founder section, the drum
  heading and quotes.
- Social plates repainted for `/`, `/ai-brain` and `/ai-gtm`; `llms.txt`
  regenerated.
