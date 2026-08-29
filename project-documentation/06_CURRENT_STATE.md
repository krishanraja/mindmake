# Mindmake current state

Last updated: 28 August 2026.

This file is the current delivery truth for `mindmake.co`: what is live, at which identifiers, and what remains open. Why the business exists is in `00_NORTH_STAR.md`. Commercial truth is in `01_CANON.md`. Design truth is in `03_DESIGN_CONTRACT.md`.

## Where the rebuild stands

**The rebuild is live.** The homepage, `/ai-brain` and `/ai-gtm` were rebuilt, the six films were installed, and it was promoted to production on 28 August 2026.

- Site status: **LIVE**. `https://mindmake.co` launched 26 August 2026 and now serves the rebuild.
- Production: merge `75572542094ddd4e702a877b258b9014f37415c1` (pull request #152), Vercel deployment `dpl_HAoncV1RF3hcvcanqo7Yvc4tuAng` on project `mindmake` (`prj_GqamX3psD0cGpGCDXRu0ljET7zap`).
- Rollback target: `dpl_5Ajont9gBNH3ocyzEknDzmqGj3bq`, the previous production state (pull request #151).
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
