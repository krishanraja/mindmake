# Approved website state

Status: approved-r3-live
Working-copy status: matches main and production
Updated: 26 October 2026.

The latest application release is PR #250, the brief in fewer clicks (26
October 2026), on top of S6 (24 October 2026) and its phone review (26 October
2026). The accepted R3 opening and footer are unchanged. Current operational
identity, readback and evidence limits are in 06_CURRENT_STATE.md; do not
relabel old receipts as new verification.

This is the single current accepted-design and change-guard route for the website. [06_CURRENT_STATE.md](../06_CURRENT_STATE.md) owns current production identity and operational truth. The numbered canon owns business, brand and proof authority. [NOW.md](../../NOW.md) is the arrival router, not another authority. Historical decisions and evidence live only in [history/LOG.md](../history/LOG.md#2026-09-24-redesign-documentation-consolidation).

## S6: three sections on every page (24 October 2026)

Krish reviewed the live site in a walkthrough on 24 October 2026 (22 feedback
cards, `H01` to `R07`, in his Drive handoff "mindmake-visual-feedback") and
set the direction: "the visual impact should be higher, and the simplicity
should be higher", every page in three sections that answer what problem it
solves, how it solves it, and what the reader gets and how they know it works.
He chose the spine (today's AI is an intern; promote it to chief of staff),
the tone (bold and visionary), the way in ("Start building your AI brain";
"Start building your AI revenue engine" on `/ai-gtm`) and the home of the
stories (`/ai-brain`), then approved rendered mocks of all three pages in turn,
including two corrections he asked for on the way: outcome lines that start on
one line across a row of cards, and "What stays with you" as a receipt. His
rule from the same review is now a gate: no word alone on a line, and no
component that changes size when a reader makes a choice.

- `/`: the R3 opening (film, rotation, doors) gains the way in, a line under
  it and the publication line; then "Right now, your AI is an intern." with the
  four eras as tiles that turn in place; then "A chief of staff knows how you
  think." with the organisation and the three practice scenes, still; then
  "Built on your real work. Yours to keep." with three results and the way in.
  The history pin, the reach and practice chapters, the stories, the returned
  hour, the route chapter and its receipt leave the homepage
  (`src/components/homepage-release/homepageSections.ts`, injected by the
  generator).
- `/ai-brain` (S6): "An AI that thinks like you." and the way in; one panel in
  three beats (the questions only you can answer, your next call gets sharper,
  your business rises with you); what a Brain holds beside private to you;
  the month, then the story finder, "What stays with you" as a receipt, the
  way in and one line to the revenue engine. The rail and chapter numbers are
  retired (`src/styles/mindmake-brain-s6.css`).
- `/ai-gtm`: "Make your pricing, positioning and team AI-native." as the h1,
  the urgency in its lede, the starting point, the four places as still
  cards; the team with a Today and AI-native switch; one move in 30 days,
  what stays with you, the result in the client's words, the way in and one
  line to the AI brain. "You could add an AI tool" and the standalone
  testimonial are gone; nothing pins.
- Shared: the action bar is one button (no door), shown once the page's own
  first way in has scrolled away; the analytics notice sits apart from it (a
  card on the left of a laptop, under the masthead on a phone) with equal
  Allow and Decline; `PairingBridge` is the page's way in and one line to the
  other page.

The two new stories (the insurance leader and the investor, from his own
account, in `leadershipChapters.ts`) are approved as written (Krish, 24
October 2026: "Both story wordings approved as written."). Krish gave the go to merge on 24 October 2026 ("Go: merge S6 to main and read production back."); `06_CURRENT_STATE.md` owns the release readback. The line under the button names
no time; inside the brief the first step says it "takes only a few minutes"
(Krish's own words, 2026-10-24), a time that is not measured. The publication line names one issue read from the publication's
feed at build time (`scripts/fetch-latest-issue.mjs`) and calls it "From Make
Your Mind Up", never "latest".

### Krish's review on a phone, after the release (24 October 2026)

Feedback ledger rows `S6P-01` to `S6P-07`. Krish approved the rendered pages on 26
October 2026 ("Approved. Merge #248 and read production back.").

- The opening is at least one screen tall and grows when its words need more:
  R3's frame was exactly one screen and hid what did not fit, so on a short
  phone the way in's line and the publication line fell off its foot.
- The four eras are a carousel swiped through time, oldest first, each era on
  its picture from the old history chapter; under the row, arrows and a
  timeline of the four dates that fills as the row moves. A tile still turns
  in place. The three practice scenes are a carousel of their own, its
  timeline Notice, Connect and Prepare. Where every card fits, the controls
  go but keep their room.
- The three results sit on their stories' own pictures. A picture shows in
  the band at the top of its card, and wherever text can fall the card's ink
  is never thinner than 90%; `npm run qa:card-contrast` reads every line on
  those cards pixel by pixel at 412x741, 360x780 and 1440x900 (worst 5.26:1
  against 4.5:1), with a negative control.
- Subscribe sits beside the menu in every masthead, the homepage's and the
  shell's.
- On `/ai-gtm` the way in's words sit on the left, its arrow on the right.
- The brief's first step reads "Let’s get started.", "This takes only a few
  minutes, and helps us scope out where you are and what you need.", and
  "Get building", with "Not ready yet? Subscribe to Make Your Mind Up, free"
  beneath it.

### The brief in fewer clicks (26 October 2026)

From Krish's live test of every call to action on 26 October 2026 (feedback
ledger row `BRIEF-CLICKS-001`). Krish approved it on 26 October 2026
("Approved. Merge #250, deploy the brief function, and read both back.").

- A button that names no door opens the brief at the AI brain's door, because
  every such button reads "Start building your AI brain"; the door question is
  gone.
- A problem card and a time card each move on with one tap.
- **Keep the private brief**, on every leaf, goes straight to the address. The
  "Email verification is next" pop-up is gone; the address step already says a
  code comes first. On a phone the leaves turn with two arrows beside "1 of 4"
  in the brief's header, so the footer holds one full-width action (Krish, on
  the first version with an arrow beside the button: "That green button and the
  button on the left of it look like a terrible UX").
- The code is sent at once and the company research behind the brief finishes
  after the response (`submit-mindmake-brief` v23). A right code entered before
  the brief is ready waits, asking again every two seconds for up to a minute,
  then offers a person.
- From the homepage hero to "Check your email." is 8 clicks on a desktop or a
  phone (11 and 14 before).

## Open: the brief names one thing AI could carry (Change 3)

Krish agreed three changes on 11 October 2026 and asked for them one at a time,
each shown rendered at 1440x900 and 390x844 and approved before the next starts.
The first, the AI Brain stories, is done and now lives on `/ai-brain` (S6). The
second, a hero lede for every leader, was settled by S6. The third is open: the
brief names one thing AI could carry in the reader's own week, shown rendered
before it is built. Two related rows also wait on Krish: a rendered mock of the
corroborated company read and one name for the brief's deliverable
(`LEAD-BRIEF-INTELLIGENCE-001`, `LEAD-BRIEF-DELIVERABLE-001`). Krish's reactions are
recorded word for word in [feedback-ledger.json](feedback-ledger.json); the
request itself lives in private planning documents and is not copied here.

Sources that still serve the stories: `src/components/leadership-chapters/leadershipChapters.ts`
holds the seventeen stories and `storyFinder.ts` the chooser, for `/ai-brain`
and `/new-age-leadership` alike; the chooser's styles are section 10 of
`src/styles/new-age-leadership-r6.layer.css`, compiled into the generated
`new-age-leadership-r5.css`. Proof rules are in `04_PROOF.md`, "The AI Brain
stories". The front door's 15 October approval
(`POSITIONING-DOORS-NARRATIVE-001`) still holds for the headline that leads the
rotation and the name "Build your AI revenue engine"; S6 replaced both door
explanations.

## Approved source and scope

Krish approved R3 on 24 September 2026 and authorised publication after end-to-end verification. The R3 opening and footer are live at `https://mindmake.co` and remain locked in copy, imagery, composition and controls; since S6 (24 October 2026) the three sections between them are `homepageSections.ts`, and nothing on the homepage pins. R3's pinned history and leadership-dividend progression are retired from `/`.

- Immutable homepage reference: `prototypes/website-redesign-recovery/homepage-production-synthesis-r3/`.
- Accepted R3 material provenance: `quality/route-lock/approved-production-r14.json`. The active checker reads `quality/route-lock/approved-production.lock.json`, a generated lock that continues `quality/route-lock/approved-production-r48.json` (BRAIN-NARRATIVE-S4 on `/ai-brain`, the last numbered manifest). Every intended edit since r48, S6 included, regenerates that lock in the commit that makes it; with `06_CURRENT_STATE.md` it identifies what is live. The numbered manifests r1 to r48 are frozen history and never describe today's site: several say on their own face that owner approval was outstanding (r17 to r21, r23), r44 records the Archive Engine r06 opening Krish rejected and r45 its removal, and r35, r39 and r41 record homepage chapters S6 retired. The ones still cited as provenance: r14 (R3), r25 (the earlier GTM-PLAIN-R2 `/ai-gtm`), r47 (the `/ai-gtm` rebuild S6 builds on) and r48 (the `/ai-brain` S4 source S6 edits in place). Never rewrite any of them or any earlier immutable approval or candidate manifest.
- Delivery: `src/pages/Index.tsx` and `src/components/homepage-release/`, compiled by `scripts/qa/build-homepage-release.mjs`, which since S6 cuts everything between the R3 opening and footer by named anchors and inserts `src/components/homepage-release/homepageSections.ts`. `src/components/leadership-chapters/leadershipChapters.ts` remains the one source for the reach, practice and story chapters on `/new-age-leadership`, and for the organisation the homepage shows. Change the canonical generator when generated output needs an authorised correction; do not reconstruct the approved page from prose or screenshots.
- /ai-gtm's GTM-PLAIN-R2 surface is retired by r47, which rebuilt the page on the house system (`AI-GTM-R47-OWNER-REVIEW-001`, accepted); S6 restructured that rebuild into three sections. `/ai-brain` is S6, edited in place in the S4 source; BRAIN-NARRATIVE-S5 (26 September 2026, receipt `quality/ai-brain/approved-narrative-s5.json`) and S4 (r48) are its provenance. The approved records for the other companion surfaces (START-HERE-INTERACTION-S4, CASE-PROOF-FIELD-S2, COMMERCIAL-READINESS-S4-R3 and TIME-LENS-S3-R5) remain their provenance. The active lock binds the actual delivered sources.
- `quality/website-redesign/homepage-handoff.v1.json` preserves the earlier recovery baseline. It is subordinate to this accepted R3 state, not permission to restore an obsolete homepage.
- The historical r1 source-parity findings are not the current production-source verdict. Do not substitute a candidate manifest to bypass an approved-source failure.

## Visitor flow and page changes

Krish set these on 25 September 2026; `quality/route-lock/approved-production-r38.json` records them.

- Three intents, three names, one of each on every CTA. **Start building your AI brain** (`START_LABEL`; **Start building your AI revenue engine**, `START_LABEL_GTM`, on `/ai-gtm`; S6, Krish, 2026-10-24, replacing "Get your free AI brief") is for a reader who is ready and opens the brief. **Build your AI brain** and **Build your AI revenue engine** are for a reader who is exploring and go to `/ai-brain` and `/ai-gtm`. **Subscribe for free** (`SUBSCRIBE_LABEL`) is for a reader who is not ready and opens the publication's subscribe form.
- The homepage hero doors are links to their pages. The generator converts them in `scripts/qa/build-homepage-release.mjs`; the R3 source is unchanged. Since S6 the brain door reads "Your judgement, running as a system you own." and the revenue engine door "The pricing, positioning and team you'll need.", and the closing route chapter is gone: its button is the hero's way in and its headline joins the rotation.
- The opening hero plays the Archive Engine r07 loop (`src/assets/films/sep2026/archive-engine-hero-loop-r07-16s-1080p-review-sealed.mp4`, poster `archive-engine-hero-poster-r07.webp`, its own first frame), substituted by the same generator (Krish, 2026-09-25). The r04 package stays in the repository as the recoverable fallback. On a phone the film is cropped at 55% across (`integration.css`, Krish, 2026-09-26) so the mint circuit shows; the desktop frame is unchanged. The closing chapter that also played it left with S6. The rejected r06 local Blender render and its derivatives are absent from the repository and must not be restored as a production candidate.
- The homepage copy and fit rulings of 26 September 2026 (the history questions, the reach headings, the returned hour and the closing chapter) went with the chapters S6 retired; they are kept verbatim in `history/LOG.md`, 26 October 2026.
- Both offer pages end with `PairingBridge` (S6, Krish, 2026-10-24: the card "needs to be condensed"): this page's way in, then one line to the other page. The button is `data-mm-primary`, so the action bar stands down and one way in holds. "What stays with you" is a receipt above it (`Receipt.tsx`), the same object on both pages.
- Surfaces explain nothing about themselves and hold still under interaction (r43, Krish, 2026-09-25). `/ai-brain` carries no caveats, status lines or source labels; its hero orbit is the decorative ground behind the whole opening; its ideas keep one size, its titles one line, and its panels one height. Since r48 its stepped instruments (questions, decision, levers and, since S5, the month) light by colour and opacity only, forward and back with scroll, and show whole without script or motion. `/ai-brain` corrections live in `src/styles/mindmake-brain-refinements.css` and the S4 and S5 chapters in `src/styles/mindmake-brain-narrative.css`, both loaded after the generated locked stylesheet, which stays reproducible from its prototype sources.
- `/blog`, Ideas you can use, lists every quick tip and every longer read in one list, newest first, in the tips' entry form, under a kind filter (All, Quick tips, Longer reads) and a subject filter (Krish, 2026-09-25; `/answers` redirects there and the tips keep their pages under `/answers/:slug`). It never opens on an idea marked `lead: false` (the adtech answer); the newest idea allowed to lead goes first and the rest keep date order (`orderIdeas` in `src/lib/ideaFormat.ts`). Tip titles are in sentence case, and each tip entry shows the question it answers as a sentence-case question.
- Every Media link, and the old `/signal` and `/builder-economy` redirects, land on the publication's own site, https://makeyourmindup.ai (Krish, 2026-09-26; `PUBLICATION_URL`). Subscribing appears in six places: a hairline badge beside Media in both menus, a Subscribe button beside the menu in every masthead (Krish, 2026-10-24), a footer button, the brief's first step (for a reader not ready to build) and its success step, and since S6 one line at the foot of the homepage hero naming an issue; every "Subscribe for free" link goes to https://makeyourmindup.ai too (Krish, 2026-09-26: "Every single subscribe link should go to makeyourmindup.ai"; `SUBSCRIBE_URL` is `PUBLICATION_URL`). There is no band, pop-up or modal. It never outweighs the brief's filled mint.
- No word or link sits alone on a new line at 1440x900, 1280x800, 390x844 or 360x780 on any page, and no swapping component changes size when a reader makes a choice (`qa:line-breaks`, which clicks every tab, toggle, step, seat and carousel on `/`, `/ai-brain`, `/ai-gtm` and `/new-age-leadership`, and since 24 October 2026 also fails text cut off at the top or bottom of a box that hides overflow; Krish, 2026-10-24: "we don't ever get one word sprawl over to a second line and change the entire component size"; the rule is in `03_DESIGN_CONTRACT.md`).
- Every page carries the homepage's masthead and footer, identical within 1px at 360, 390, 412, 768, 1024 and 1440 (Krish, 2026-09-26: "The logo in the top left nav bar changes size depending on what page you're on, which is unacceptable"; "the bottom nav bar is super inconsistent across pages"). The footer is the brand, "Keep your edge as AI changes the market.", Subscribe, the route rail on wider screens, Privacy and Terms as two separate 44px links, and "© 2026 Mindmake." on the left edge. On phones it fills the width on the masthead's gutter; there is no Contact link (the address is on /about, /privacy and /terms).
- The homepage hero turns its headline once through six lines and rests on the first (Krish, 2026-09-27; reordered 2026-10-15, "the most impactful first"; the closing chapter's headline joined second with S6): "Promote your AI from intern to chief of staff.", "Own your judgement, and amplify it.", "High standards deserve an AI that knows yours.", "AI can copy almost anything except your taste.", "Amplify your judgement, and the business follows." and "Build the human + AI business that augments your vision." A unit test holds the first to the generated h1 (`src/test/hero-rotation.test.ts`). The second and third screen for standards and taste early in the turn ("the headlines need to filter out people that don't self-identify with this"). Each is set in the same three fixed lines at every width ("every headline takes exactly the same amount of lines on mobile and desktop"), underlines its "you" or "your" as it arrives, and the h1 keeps the approved headline as its accessible name; reduced motion, no script and crawlers see only that one (`heroRotation.ts`). On a phone the headline and lede sit just above the doors ("close the gap on mobile"). Since S6 the lede reads "The leaders who shape the next decade will have an AI that thinks like them. We build yours."
- The analytics notice never stacks on the action bar (S6, Krish, 2026-10-24: "the bottom panel is horrible"). On a laptop it is a card on the left of the bottom band while the bar's one button is on the right; on a phone it docks under the masthead. Allow and Decline stay equal.
- No page carries caveat or disclaimer labels: no "Illustrative machinery", "Illustrative team", "Illustrative sequence. Not evidence." or "illustrative example" lines (Krish, 2026-09-26: "Get rid of all the annoying asterisk commentary, like illustrative machinery, from the whole"). Generated films and example teams remain what they are; the page simply does not narrate it. The private brief document and its email keep their one "not advice" line.
- Page changes use the ruled line (`src/components/RouteTransitions.tsx`). Same-origin links stay in the app, the next page's code is fetched before the swap, and the two pages cross over about 720ms (Krish, 2026-09-27: the transitions were "so blunt, needs to be much smoother"): the old page fades out, the new one fades in and rises 10px into place, the masthead holds still under its own view-transition name, and the ruled line remains as a fainter sweep. Only the page's own masthead carries the name, not the menu's, because a duplicate name on screen makes Chromium refuse the transition. Media that has not painted when a page mounts fades up instead of cutting in (`MediaArrival.tsx`), most visibly the `/ai-brain` film, and nothing waits more than 2.5s. Back and Forward restore the reader's scroll position. Reduced motion and browsers without view transitions get the same navigation with no animation. Both components render nothing, so hydration is unchanged.

## Non-regression contract

1. Between the opening and the footer the homepage carries three sections (S6): the problem, with the four eras as a carousel of tiles on their pictures that turn in place; how it works, with the organisation and the three practice scenes as a carousel; and what the reader gets, with three results on their stories' pictures and the way in. The opening is at least one screen tall and grows to hold everything it carries. Nothing on the homepage pins. The AI Brain stories are seventeen cards in five situations on /ai-brain, a chooser that never pins; `/new-age-leadership` keeps its own reach, practice and story chapters from the shared source. R3's history pin, authority, leadership-dividend and route chapters are retired from `/`.
2. No wheel/touch cancellation anywhere. No swapping component changes size when a reader makes a choice: every panel that swaps holds all its states in one place. Without scripts every state reads in flow (the eras show question and answer, the beats one after another, the team as a document). Every state stays reachable from its direct controls on reduced-motion and short screens. `/new-age-leadership` keeps its pinned chapters and their r46 phone sweep.
3. Proof of a swapping state observes visible text after each actual control and the height of the component around it. A screenshot, state attribute or entrance reveal alone is not proof.
4. Preserve the selected masthead/content alignment: every section takes the fixed masthead's gutter, and `/new-age-leadership`'s chapters pin under its masthead. Device-specific compositions remain distinct. No clipping, collisions, hidden actions, blank substitute panels or fixed-nav/cookie overlap.
5. Menu and LeadBrief retain visible focus entry, Escape/Back recovery, a visible restored opener and no stale inert background. Route transitions retain hydration and lifecycle cleanup. Hidden states must not remain keyboard-reachable or falsely current.
6. Keep the existing company-first LeadBrief, route history, validation, data and sending boundaries. A useful preview is not a sent email; actual delivery and persistence require their own evidence.
7. Keep all public route families, editorial/detail routes, answers, FAQ, contact, legal destinations and Media reachable. `/new-age-leadership` remains a companion route; the R3 homepage does not authorise its deletion or redirect.
8. Preserve accepted labels: Home, Success stories, Ideas you can use, Questions we get asked, About us, Media and Start building your AI brain (S6; Krish renamed the four content routes and added Home and About us on 25 September 2026, r47, and merged Quick AI tips into Ideas you can use the same day; the earlier labels are preserved in `history/LOG.md`). On a phone the footers carry no route list; the menu does. Each page's title matches its label. Keep exact R3 wording, selected supporting labels and evidence boundaries rather than applying superseded blanket rules as a redesign instruction.
9. Proof families remain separate. Generated imagery is not client evidence. Brain fixture meaning and GTM evidence freshness/recovery must remain truthful. No invented claims, public price/duration, new product or public diary route.
10. Rejected surfaces remain evidence, never implementation foundations. Preserve the rejection and supersession chain rather than asking Krish to repeat settled choices.

## Feedback, review and authority

[feedback-ledger.json](feedback-ledger.json) is the feedback reconciliation register, governed by [FEEDBACK-WORKFLOW.md](FEEDBACK-WORKFLOW.md). Capture feedback and decision notes verbatim, bind them to the exact surface and retain observable acceptance evidence. Submission is not approval. Unresolved blocking feedback prevents advancement.

`quality/website-redesign/continuity-contract.v1.json` retains MMR/MMF requirements and their original recovery context. Apply the accepted rulings with their recorded supersessions; old candidate status and old next-session commands are historical, not today's execution plan. The current `quality/website-redesign/experience-quality.profile.json` and `quality/award-panel/rubric.v3.json` govern applicable review.

Only Krish may approve a material surface or accept an MMF exception. A change is material when it changes first notice, next understanding, the interaction model or signature visual language. Show the exact rendered desktop/mobile change before material approval; judge consensus cannot grant that approval. Keep judge definitions separate from completed independent submissions and evidence-bound verdicts. A failed or inconclusive hard gate cannot be averaged away.

Local implementation, commit, merge, preview, production promotion and publication remain distinct authorities. The completed publication does not preauthorise future releases or material reinterpretation.

## Checks before changing a public surface

- Read `AGENTS.md`, `NOW.md`, `CLAUDE.md`, `06_CURRENT_STATE.md`, this state and the continuity contract; inspect Git status and preserve unrelated work.
- Run `npm run qa:website-restart` and the applicable source-lock/adapter checks. Use `npm run qa:website-approved-visuals` when verifying the preserved Brain/GTM recovery references; use a fresh self-owned runtime, not an ambient server.
- Material presentation uses `npm run review:material -- quality/website-redesign/material-review-candidate.json`; the current candidate and evidence must match. Older review receipts do not certify a new source.
- Before merging: the current canonical build, unit/lint/type checks, `npm run qa:homepage-release:pre-merge` (Chromium only), feedback-ledger release check and applicable interaction/backend proof. After the merge, CI runs `npm run qa:homepage-release` and `npm run qa:release-routes` on main across Chromium, Firefox and WebKit; agents read only the Chromium result and never run or wait on Firefox or WebKit unless the task needs them (Krish, 2026-09-26). Keep assertions, expected case counts, screenshots, source hashes and failures.
- The release route matrix uses Chromium/Firefox on Linux and WebKit on macOS against one shared built artifact. No browser assertions or timeouts are waived. Linux WPE video compatibility is not certified.
- Report built, committed, merged, deployed, live and verified separately. Do not claim a blind `world_class_winner` result from schema checks, screenshots or another candidate's verdict.

## Outstanding limits

Physical iPhone Safari with VoiceOver and Android Chrome with TalkBack remain not run. Krish's explicit exception applies to the 24 September release only, not future releases. Browser emulation is not a physical-device pass. The exact authority is retained in [the release pointer](RELEASE-2026-09-24.md#release-only-accessibility-exception).

The dependency audit's package entries (25 on 26 October 2026; see `06_CURRENT_STATE.md`) remain upgrade work; the bounded applicability review found no confirmed visitor-reachable blocker, not a vulnerability-free certification. Future follow-up sending and other-client harness installation are not certified by website browser checks.

## Decision provenance

The [full pre-consolidation state](../history/ARCHIVE.md#archive-2026-09-24-website-redesign-state-md) preserves all atomic selections, exact owner wording, corrections, rejected candidates, hashes and failed evidence. In particular, retain SHELL-CONTENT-EDGE-01, SHELL-SHARED-LANGUAGE-01, HOME-MESSAGE-COMBINATION-01, HOME-HISTORICAL-STORY-COMBINATION-01, HOME-AUTHORITY-CHAPTER-COMBINATION-01 and its corrected mobile acceptance, HOME-HISTORY-BRIDGE-HIERARCHY-01, HOME-LEADERSHIP-DIVIDEND-COMBINATION-01 and HOMEPAGE-SCROLL-BUILD-001 with their scope and supersession links.

The [release archive](../history/ARCHIVE.md#archive-2026-09-24-website-redesign-release-2026-09-24-md) retains exact CI, deployment, public readback, platform-diagnosis and rollback receipts. Earlier homepage concept decisions remain discoverable through the unchanged historical document paths. Do not create a competing state or decision-history document.
