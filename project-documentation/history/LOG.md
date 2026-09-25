# History log

Newest first. Entries are written by the docs steward (see the steward link in
`NOW.md`) and by humans doing the same job by hand. Nothing in this file
describes current behaviour; `NOW.md` and `06_CURRENT_STATE.md` do. A figure
in this file is a reading on the date above it, not a baseline.

## 2026-09-25

<<<<<<< HEAD
- One type system, word by word, from Krish: "The AI brain page contains all the right fonts and font sizes. The homepage and other pages do not. Audit every single word and standardise the fonts everywhere." A computed-style audit of every visible text node on 33 routes at 1440x900 and 390x844 against `/ai-brain` found the earlier r33 pass had misread that page: its reading copy is Newsreader 400 (16px on a phone, about 21px for a desktop lede), not Archivo, so every shell page (About, Ideas, Quick AI tips, Questions we get asked, Contact, Privacy, Terms, articles, answers, 404) set its paragraphs in the wrong face. The homepage still spoke R3's own system: an Archivo lede, door lines and proof line tracked open (the screenshot Krish sent), Archivo capitals for the history dates, an Archivo 500 heading in the history bridge and receipt, Archivo 500 footer routes, Archivo capitals for Subscribe and the Media badge, a bold "Menu", and Plex Mono at 650, which the site does not ship, so the browser drew a synthetic bold. Also: `/new-age-leadership` labels at .15em to .16em and its finale kicker rendered as 24px serif capitals (a paragraph rule outranked `.kicker`); `/ai-gtm` headings at 360/370 and an Archivo 600 outcome line; the decision-balance fine print in Plex Mono at 6.7px to 9px; button text links taking 17px from the `button { font: inherit }` reset. Fixed through `--mm-body`, the type section of `src/components/homepage-release/integration.css` (the generated R3 and its source untouched), the R6 layer of `/new-age-leadership` (regenerated), and the owning route sheets. Words, order and composition are unchanged. `scripts/qa/type-system-check.mjs` (`npm run qa:type-system`) now measures it: 0 failures after, 66 on the previous main for `/`, `/about`, `/blog` and `/ai-brain` alone. The unit test that pinned `--mm-body` to Archivo now pins Newsreader. Feedback item TYPE-SYSTEM-002; the generated lock is regenerated for the intended edits.
=======
- Quick AI tips merged into Ideas you can use, and the phone footers lose their route list, from Krish: "Move all the content from the 'Ideas you can use' page into the 'Quick AI Tips' page in its native format, ordered newest first. Add a couple of filters at the top and then rename this page 'Ideas you can use', deleting the old empty one. And then on mobile only, we don't need all the links in the bottom nav bar. It just takes up space when there's a mobile menu that is easily accessible." The merged page lives at `/blog`, the address the archive, `/library` and the old post redirects already point at; `/answers` redirects there permanently and its pages stay at `/answers/:slug`. Retired: `src/pages/Answers.tsx`; the `/answers` entry in `scripts/lib/pages.mjs` (title "Quick AI tips", description "One page per question: the direct answer first, then the case for it, including what the pages already answering that question miss.", plate claim "Answered with a position, not a summary.") and its plate `public/social/answers.jpg`; the archive's search box, featured card and card grid on `/blog`; the `llms.txt` heading "## Quick AI tips"; the menu label Quick AI tips; the handoff's `sharedLanguage.selection.answers`. Superseded `/blog` description: "Useful questions, checks and working methods for leaders making business decisions as AI changes their market." Each answer file gains a `category`, one of the archive's four subjects, so one subject filter covers both kinds; `src/lib/ideaFormat.ts` holds the merge and the order (newest first, `lead: false` never first) for the page and for `llms.txt`. The homepage phone footer's route list is cut by the generator (`scripts/qa/build-homepage-release.mjs`), the R3 source untouched, and its authored 120cqi floor is lifted; the shell footer hides its route links below 521px and keeps Contact, Privacy and Terms on one row. Superseded rule: "Two even columns keep every row paired, for the four-link footer too" now applies to the compact door-page footer only.
>>>>>>> origin/main
- The menu relabel and the About page, carried by the generated lock `quality/route-lock/approved-production.lock.json` (numbered records stopped at r48), from Krish: "In the menu, Rename Results to Success Stories, Thinking to Ideas You Can Use, Questions leaders ask to Quick AI tips, Before you start to Questions we get asked, and add Home at the top. Change the titles inside the pages too. And then add a new page called About us". The shell menu, shell footer and the generated homepage menus and footer now read Home, Build your AI brain, Build your AI GTM, Success stories, Ideas you can use, Quick AI tips, Questions we get asked, About us, Media; the homepage carries them as authorised corrections in `scripts/qa/build-homepage-release.mjs`, the prototype untouched. Retired labels: Results, Thinking, Questions leaders ask, Before you start. Retired page titles: "Proof you can inspect." (`/case-studies` H1, SEO "Results", headline "The decision, and what changed next."), "Ideas for better AI decisions" (`/blog` SEO title), "Questions leaders are asking about AI" (`/answers`), "Straight answers" (`/faq`). `/about` added: `src/pages/About.tsx`, headshot `src/assets/founder/krish-about.webp`, styles `src/styles/mindmake-about.css`; a fourth named surface in the Krish gate. Labels are sentence case, matching the existing door labels.
- The route lock stops renumbering, on Krish's "Replace the numbered lock manifests with one lock file that a script regenerates, so a moving main never forces a renumber." `quality/route-lock/approved-production.lock.json` carries r48's files, contracts and forbidden phrases, and is written only by `npm run qa:approved-routes:update` (with `--add`, `--remove` and `--check`); the self-test fails if the committed lock is not what the generator produces. The checker and self-test no longer name a revision, so a change edits hash lines in one file instead of adding a manifest and repointing two scripts. r1 to r48 stay unchanged as history; superseded rule: "Approved-file edits require a new declared manifest revision, not silent rehashes." On the same instruction CI's feedback step runs `qa:website-feedback` without `--release` (superseded step: "Refuse unresolved owner feedback"), so an open ledger item no longer blocks a merge, and CLAUDE.md now says to run the required gates only, with no AI review rounds unless Krish asks.
- r48 (`quality/route-lock/approved-production-r48.json`): BRAIN-NARRATIVE-S4 replaces BRAIN-MOTION-S3 on `/ai-brain`, on Krish's "I find the AI brain page a little boring and uninspiring ... it feels like it speaks TO the user directly, as opposed to just being a product showcase with facts everywhere" and his approval "yes I like it" of the rendered desktop and phone captures, with "You don't need to ... commentate on whose brain it is" applied to chapter 02. Superseded copy, verbatim: h1 "A Brain that learns how you decide."; lede "It remembers what mattered, why it mattered and what changed, so good judgement can travel through the business."; action "See it think"; rail Remember / Check / Learn / Keep; "One decision wakes the whole Brain." / "Every useful thought around it lights up. Pick any point and the reason appears beside it."; inspector label "What the Brain remembers"; "It can show its work." / "Take one source away. The Brain shows what still holds and what needs another look." with pods "Human taste stays accountable for the final output." and "Keep the full human judgement loop intact.", results "The decision is supported by both sources." / "Its connected thinking is clear." / "The decision still holds." / "One source still supports it. Two connected ideas need another look.", switch "Remove one source" / "Put the source back"; "When you change your mind, it learns the difference." / "The old view stays visible. The better one becomes the new standard." with sheets "All consequential work needed human release." and "People release work that reaches the outside world. Reversible internal drafts can stay delegated."; "Nothing gets lost." / "Ideas, evidence, connections and corrections keep moving into one living record."; description "See how one decision becomes remembered, evidenced, corrected and reusable."; BI-006 "Work with leaders who want to reshape their category, not defend the old one."; BI-020 "Help capable people become more discerning, more agentic and less generic."; BI-012 title "Builder, not persuader"; SRC-001 "AI fluency begins by noticing every click, copy-paste and information movement as a possible system."; REL-005 "The possibility gap creates the need to transfer ways of seeing, not only conclusions."; REL-015 "Prepared options must diverge in reasoning, not only in wording." Ownership: three answers that said the record "belongs to the business" now say the Brain belongs to the leader and the business keeps the standards shared with the team (01_CANON "Who owns it"). The approval was given on captures sent in the session, not through `review:material`, which supports only the homepage candidate.
- Krish rejected the live `/ai-gtm` (GTM-PLAIN-R2 with the r43 refinements, production `6076bfd`): "the most confusing user experience ... no visual hierarchy of sections ... no scroll builds ... doesn't set up a universal problem ... None of this talks to a user one-to-one ... The fonts are all over the place ... not part of a cohesive design system as per the rest of the repository". He kept the content ("more or less there in terms of what we're supposed to be saying and offering"). Recorded verbatim as `AI-GTM-R47-*` in the feedback ledger. What the source showed: the page ran on its own 2,030-line stylesheet plus a 454-line override layer, with a private palette (three different mints on one page), non-variable font names that skipped the metric-matched fallbacks, Archivo capitals where the site uses Plex Mono labels, type down to 7.7px and a 1,360px shell; every section was a bordered box with a numbered eyebrow and its own grammar; and nothing pinned. The rebuild (r47) retires both GTM sheets for one route stylesheet on the house tokens and tells the page as pinned chapters in the `/new-age-leadership` grammar, problem first.
- r46 (`quality/route-lock/approved-production-r46.json`), from Krish's phone screenshots of `/`: "The CRO screenshot shows text flying off the right-hand side of the page" and "a vertically stacked section which should really build with scroll, with that left-to-right green line animation". The benefits stage stacks its six statements in one auto-sized grid column; `keepLastWords` held "forgotten observation." (385px at 412) together, the column grew to fit it, and all six statements laid out about 15px wider than the stage that hides its overflow. `keepLastWords` kept the join because its clip test returned early when the heading did not overflow its own box, and QA passed because the page's clip hid the overflow from its scroll width. The fix sizes the column to the stage and the phone headline to the longest kept pair, makes the guard test a block wider than a clipping ancestor, and adds a clipped-text rule to `qa:line-breaks`, which reports the old build (8px past the stage at 390) and none of the 31 routes after the fix. The practice chapter's phone composition, stacked since R5, becomes the signal sweep; the green line Krish named is the reach chapter's progress rule, whose styling the practice rail takes.
- r45 (`quality/route-lock/approved-production-r45.json`): Krish rejected the r06 local Blender render after seeing the moving result and explicitly ordered it removed from the repository. Its MP4, WebM and both posters are deleted; the homepage generator and generated release return to the last recoverable r04 MP4 and WebP poster. The later route-stage film-02, `/ai-brain` and every unrelated surface are unchanged. The r06 render consumed no Higgsfield generative-video credits and is not an approved visual reference.
- r44 (`quality/route-lock/approved-production-r44.json`): the homepage opening replaces the exploratory Archive Engine r04 cut with the owner-reviewed r06 filing cycle. The drawer opens before the machine starts; a cream document is fed, physically sealed, carried by guided machinery through the drawer's actual opening, filed, and the drawer closes before an identical-frame reset. The silent 16.5-second MP4 and WebM decode at 1280x720 and 24fps, remain below 4MB, and ship with matching JPG and WebP posters. The generator selects the r06 MP4 and poster in the two opening variants only; the later route-stage film-02 and `/ai-brain` remain unchanged. r04 stays in the asset library as provenance, not the current selection.
- r43 (`quality/route-lock/approved-production-r43.json`): Krish's phone review of `/ai-brain`, `/ai-gtm`, `/`, `/case-studies`, `/answers` and `/blog`, plus the same patterns found elsewhere on his instruction to include them. The AI Brain prototype markup loses the hero plaque and note, the evidence readout, the inspector standing line, the source labels, the replay button, status line and caveat, and the ready-state truth bar. The case-study rail's cards were nested scroll boxes with `overscroll-behavior: contain` and `touch-action: pan-x`: a vertical swipe on a card could not scroll the page, reproduced with CDP touch events before the fix and scrolling 385px after it. The partial horizontal-swipe glitch Krish saw on a device did not reproduce in Chromium emulation; the fix removes the gesture trap that is its most likely cause.
- r42, on Krish's "in the footer, move the word 'changes' over to the 2nd line, and reduce the size of the links so they all fit on one line. Then on the AI Brain page, fix the colour contrast issues with the text, and the text that falls off the page". Footer: the statement reads "Keep your edge as AI / changes the market." (generator, counted), and the routes are 11 to 16px with a 12 to 26px gap, one line from 1,024px up (at 1440 they had needed about 1,019px against a 1,007px column). /ai-brain: the shell's `.mm-site h2 { color }` outranked the ink each paper chapter sets for its headings to inherit, so "One decision wakes the whole Brain." rendered near-white on paper at 1.1:1; the Brain's headings inherit again. Paper labels at 40 to 50% on the dark panels (3.1 to 4.3:1) go to 62% (5.5:1 or better), the living record's lede from ink 62% to 85% on amber (5.2:1), the green action labels to 5.1:1. Text off the page had three causes: `keepLastWords` joined "release judgement" into a 311px no-wrap span inside a 226px heading in a panel that hides overflow (it now undoes a join whose overhang would be clipped, and remembers the block until a resize so the undo cannot loop; the inspector headline also fills its column rather than the 10ch display measure, capped at 14% of the inspector's width); the fixed chapter rail sat over every panel's right edge at 1440 and below (chapters reserve 4.5rem); and node labels on the right third of the field ran past its edge (they now sit to the node's left). A post-fix scan at 1024 to 1920 and 390 finds no clipped text and no AA failure on the page, apart from the correction chapter's copy, which the scanner reads against the section ground rather than the red panel it sits on. Taking back clipped joins exposed two strandings the old joins had hidden: on phones "judgement reusable." was 375px in a 350px column, its full stop cut off at the screen edge, so the homepage route headline sets at 11.8cqi rather than 13cqi; and the full footer's ten links fell 2+3+4+1 on /case-studies, so the phone footer is two even columns. `qa:line-breaks` then reports no findings.
- r41 reinstates what r35 and r39 removed from `/`, on Krish's "we lost the 'The feeling is familiar' section that transitions with scroll from the home page, and we totally lost the scroll build version of the 'If knowledge lives outside us' section ... reinstate", with screenshots of both. The R3 history chapter (the bridge, four eras from Writing to Satnav, the closing hinge) returns between the opening and the leadership chapters, with its runtime and the pin controller `pinnedChapters.ts` narrowed to history, and the homepage renders the reach chapter's two states again. Authority and the leadership dividend stay cut. The homepage scroll gate again declares history (4 states, pinned at 0) and reach (2), with reduced-motion and short-screen era controls.
- PR #195 (r40) merged as `08c7434`; main's matrix passed on all three engines. Production serves the Archive Engine hero on `/`. `06_CURRENT_STATE.md` carries the receipt.
- r40 (`quality/route-lock/approved-production-r40.json`): the homepage opening hero plays `src/assets/films/sep2026/archive-engine-hero-loop-r04-16s-1080p-web-sealed.mp4` in place of `film-02-loop.mp4`, on Krish's instruction, with the loop's own WebP poster. The generator makes the substitution in both opening hero-stage videos and counts it; the R3 source, the route stage's film-02 and `/ai-brain` are unchanged. No WebM source was added.
- PR #189 merged as `94d1524`; main's matrix passed on all three engines. Production read back the conversion flow and `qa:line-breaks` (0 faults on 26 routes at both sizes). `06_CURRENT_STATE.md` carries the receipt.
- r39: the homepage's reach chapter opens on "The organisation changes shape." alone, on Krish's "yes" to the recommendation that followed r35. Its first state, "The feeling is familiar. The reach is new.", and the Sources list (Plato, the Luddites, the calculator review, GPS) answer the history chapter `/new-age-leadership` has and `/` no longer does. `/` renders the reach chapter as one still screen: the organisation copy, the grid and the film, with no first state, no Work/Organisation switch and no scroll track. `/new-age-leadership` is unchanged. The homepage scroll gate drops the reach sequence and asserts the static screen, one screen tall, with the retired words absent from the page.
- r37 (`quality/route-lock/approved-production-r37.json`) on `/case-studies`, from Krish's instruction "suppress the label row when a record has none." A figure whose record carries no endpoint labels rendered two empty spans, reserving the strip of space under its numbers where every other record has words; `business-first` is the one that carries none, because its endpoints would repeat its own headline and both obvious phrasings are on the field's prohibited-copy list. The guard is now stated once per renderer: the string emitter in `CaseProofField` had none on any shape, and `StoryFigureView` had one only on `focus`. The same revision reserves the measured header height as scroll margin on the field's cards, panels and dock. At 844x390 the rail's next button sat on screen but any scroll the browser performed on the reader's behalf put it under the fixed masthead; that was present on `main` and reproduced byte-identically against `main`'s component source. `qa:case-proof-field-production` fails at that viewport in two places without the rule and returns no failures with it, across all 23 combinations on Chromium, Firefox and WebKit.
- `qa:case-proof-field-production`'s tap-target case looked for a source link inside the `/ai-gtm` evidence drawer. GTM-PLAIN-R2 (r24) replaced that drawer's contents with the menu of work and moved the cited sources onto the lever leaves, so the selector had matched nothing since; the 844x390 failure above hid it, because the run never reached that far. It now measures the links that exist, on the phone variant that carries them at 45px, not the desktop leaf where the same link is a 17px line of pointer-fine text.
- Two defects found while checking r37 and not fixed in it, both from the archive removal: `/case-studies#record-<id>` no longer opens a record on desktop, where the panel is `display: none` until the story is expanded, and `qa:full-route-continuity` still asserts on `#archive-title`, which that removal deleted. That gate is red on `main` before either: `locator('h1').first()` at 320px resolves to the homepage's hidden desktop hero variant.

- r35 read back live from main `b286be8`: `/` serves the three new-age leadership chapters and none of the retired R3 ones; `/new-age-leadership` is unchanged. Main's post-merge matrix passed the homepage scroll gate on Chromium, Firefox and WebKit, the route smoke and logo alignment, and failed `qa:new-age-r5-production` on Chromium and Firefox on one assertion only, "page scope survives route navigation", which forbade any `.nal-page` on `/` after r35 put one there on purpose. Every scroll state passed. Fixed forward in `quality/route-lock/approved-production-r36.json`: the assertion now refuses any other `.nal-page` scope and any part only `/new-age-leadership` owns (hero, history lens, old-feeling, finale) on `/`.
- The homepage takes the three `/new-age-leadership` chapters in place of its own, on Krish's instruction: "these 3 sections in new-age-leadership should be used on the homepage instead of the 3 sections that are currently there, the existing sections should be scrapped." Recorded in `quality/route-lock/approved-production-r35.json`. Scrapped from `/`: R3's history (four eras: Writing, the engine loom, the calculator, satnav), authority (work and organisation) and leadership dividend (five stages: Notice, Connect, Prepare, What becomes possible, The returned hour), with the R3 pin controller `pinnedChapters.ts`/`.css` and its lifecycle test. Now on `/`: the reach sequence ("The feeling is familiar. The reach is new." then "The organisation changes shape."), the practice scenes and the six AI Brain benefits beside the returned hour, from one source shared with `/new-age-leadership`, whose prerendered HTML is unchanged apart from asset hashes and `aria-hidden` on its four decorative chapter films. The R3 source is untouched; the generator cuts the chapters by named anchors that fail the build when missing. The homepage chapters pin under the 66px masthead (64px on a phone) and take its gutter. Two R5 rules put the reach copy off the wordmark's edge below 900px, 114px in at 768 against 34px, and are corrected on the homepage only; `/new-age-leadership` keeps them. `scripts/qa/homepage-release-adapter-check.mjs`, which no gate runs, had failed since the notice gained Decline; it now presses Allow.
- Client routes survive one dropped chunk request, recorded in `quality/route-lock/approved-production-r34.json`. The r33 production readback caught `/ai-brain` showing "Something went wrong". It happened on the one load where the shared `evidence-connects-loop` chunk failed to arrive, while every asset served 200: a single failed request took the lazy route's import down and the error boundary replaced a correctly prerendered page. `src/App.tsx` now loads every client route through `lazyRoute` (`src/lib/lazyRoute.ts`), which retries once, then reloads the page once, guarded per path in sessionStorage, before the boundary. Chromium keeps a failed dynamic import for the life of the document, so the reload is the recovery there. Built-site proof with the chunk aborted: before, one drop gave the error page; after, it renders the page after one reload, and a chunk that fails every time reloads once and then shows the boundary.
- One type system on every page: the AI Brain page's, on Krish's ruling. Recorded in `quality/route-lock/approved-production-r33.json`. A computed-style audit of every route found the shell pages (`/case-studies`, `/blog`, `/answers`, `/faq`, `/contact`, `/privacy`, articles, 404) setting headlines in Archivo 800/700 and body in Source Serif 4. It also found actions in mono capitals, Plex Mono at weight 500, and Source Serif body on `/new-age-leadership`. AI Brain, AI GTM and the R3 homepage already used Newsreader headlines with Archivo body. The shell now takes light Newsreader headlines, Archivo body, sentence-case Archivo actions and Plex Mono 400, through `--mm-body` and the `.mm-site` heading default. AI Brain's audit is identical before and after. The `/ai-gtm` lever labels, which had inherited Archivo from the old heading default, now name their own sans, so that approved page is unchanged.
- No lone word or link on its own line, site-wide, on Krish's ruling after approving the conversion-flow screens, recorded in `quality/route-lock/approved-production-r38.json`.
  - The new `qa:line-breaks` measures every word line and every link row on all 26 indexed pages at 1440x900 and 390x844. Before the fix it found 45 faults. The homepage footer was one of them: at 1440 the statement ended on "market." alone.
  - A zero-specificity `text-wrap` default in `src/index.css` fixed most of them, including that footer.
  - Chromium 141's `pretty` does not reliably prevent a lone last word; a fixture showed "weaker?" and "sessions" stranded. So `src/lib/keepLastWords.ts` joins the last two words after hydration. Text React owns gets a no-break space in place; generated and prototype markup gets a no-wrap span, so their exact-text checks still hold.
  - After the fix: 0 faults on every route at both sizes, and the check's negative control is caught.
- Conversion flow and page changes, on Krish's brief of 25 September, recorded in `quality/route-lock/approved-production-r38.json`.
  - Removed "The reading, if you want it separately.". `SubscribeBand` rendered it, and only on `/case-studies`. Its film and poster stay because other routes use them.
  - Media now carries a "Subscribe for free" badge in both menus and opens `https://mindmakerlive.substack.com/subscribe`. The same action sits in every footer and in the brief's success step.
  - The homepage hero doors had been buttons that rewrote and scrolled to the closing chapter, though their ↗ promised a page. They are now links to `/ai-brain` and `/ai-gtm`, generated by `build-homepage-release.mjs`, with the R3 source untouched.
  - Both offer pages end with `PairingBridge`, which links to the other page beside a pre-routed brief.
  - Three causes of "glitchy and sudden" page changes, each fixed:
    - Every link in the homepage's generated markup reloaded the whole document.
    - Lazy pages arrived through an unstyled `.mm-page-loading` fallback.
    - `ScrollToLocation` jumped the old page to the top before the new one painted.
  - `RouteTransitions` fixes those three and adds the ruled-line view transition. Back and Forward now restore scroll.
  - `scripts/qa/homepage-release-adapter-check.mjs` and `full-route-continuity-check.mjs` now assert the new door and Media behaviour. `homepage-r3-browser-check.mjs` still tests the unchanged prototype.
- One menu on every page, on Krish's report that the menu differed by page and set a second type system. Recorded in `quality/route-lock/approved-production-r32.json`. The homepage opens the generated R3 menu. Every other route opened the shell menu, which still read Ideas and New-age leadership in bold Archivo and was missing Questions leaders ask and Before you start: the handoff renames had never reached it. The shell menu now takes R3's routes, wording, order, Newsreader rows, ↗ and legal pair, and the footer takes the same labels. Both read `PRIMARY_ROUTES` in `src/lib/publicLinks.ts`, and `src/test/primary-routes-parity.test.ts` fails on drift from the R3 markup or the handoff. R3 and all page type are unchanged; Krish named the AI Brain page's type as right.
- Consent-gated Google Analytics on Krish's agreement, recorded in `quality/route-lock/approved-production-r31.json`. r29 had loaded GA on every page before any choice while the notice read "Private analytics only". Now gtag.js is requested only after Allow, or on load for a stored `analytics` answer. The notice asks "Allow Google Analytics?" with Allow and Decline grouped together, and `/privacy` sections 4 and 5 name Plausible and GA, with a control to change the choice. Browser proof at 1440 and 390: no Google request on load or scroll, one after Allow and on reload, none after Decline or for the old `accepted` answer, and the reset clears the answer. `qa:chrome` crashes with "Execution context was destroyed" at `fixed-chrome-check.mjs:142`, identically on unchanged main `114a5f0`, so it is recorded here rather than fixed in this change.
- Purged Firefox and WebKit from pre-merge testing permanently, on Krish's instruction, recorded in `quality/route-lock/approved-production-r30.json`. CI had already moved them to main in r27, but `CLAUDE.md` still named `qa:homepage-release` as a pre-merge gate, and its contract required all three engines even with `QA_ENGINE` set. That failed in every container without Firefox and WebKit, which is how it surfaced: PR #182 could only pass on Chromium. The pre-merge gate is now `qa:homepage-release:pre-merge`: Chromium only, the same states, fallbacks and negative controls, with evidence written to an ignored folder. The unflagged three-engine run on main is unchanged; on a container without Firefox and WebKit it still fails, naming all 8 missing cases. `CLAUDE.md`, `AGENTS.md`, `07_DEPLOY_RUNBOOK.md` and `website-redesign/STATE.md` now say Firefox and WebKit are never pre-merge requirements.
- Added the Google tag (gtag.js, `G-SMXQH8E4CM`) to every page, verbatim and immediately after `<head>`, on Krish's instruction. Recorded in `quality/route-lock/approved-production-r29.json`, which declares the `index.html` change and the two scripts that select the record. One edit covers all 26 prerendered pages because `scripts/prerender.mjs` writes every route from that template. Plausible is unchanged and runs alongside. Left open in `06_CURRENT_STATE.md`: the cookie notice and `/privacy` still describe privacy-friendly analytics only, and GA fires before consent.
- Fixed main's own verification being cancelled by the next merge, recorded in `quality/route-lock/approved-production-r28.json`. Main's concurrency group now carries the commit, so a push to main has no in-progress run to cancel; branch runs still share a group and still supersede each other. `cancel-in-progress: ${{ github.ref != 'refs/heads/main' }}` should have evaluated false on a push to main and did not prevent two cancellations: run 36073810620 on `8b62c3b`, and run 36076822553 on `9a22323`, which Vercel had already promoted. Keying the group cannot be silently wrong. This mattered more after r27, which moved the browser matrix to main only: a cancelled run on main is a released commit with no browser verification at all, which is the one failure the post-merge design must not have.
- Production readback of the r26 promotion, and one interaction worth recording. `/new-age-leadership` moved inside the site shell in PR #177 and therefore now carries the action bar as well as the Decision Balance. `qa:oneway` reads never more than one way in on screen there at 1440 or 390: the bar stands down wherever the Decision Balance's own action is visible. Neither change would have exercised that combination alone.
- Removed the pre-merge browser matrix as a requirement, permanently and repository-wide, on Krish's instruction, recorded in `quality/route-lock/approved-production-r27.json`. `browser-verification` now runs only on `main`, after the merge, against the commit Vercel promotes; the pull-request leg is gone. `CLAUDE.md` and `07_DEPLOY_RUNBOOK.md` no longer state it as a gate and say plainly that nothing waits on it. His reasoning holds: with merging to main already the standing default, the pull-request leg could not change the decision it appeared to gate, because the merge never waited for its result. It cost a second macOS runner, the scarcest resource in the account, and several minutes per push, to produce a reading nobody read before landing.
- What did not change, so this is not read later as a loosening of verification: the source gates still run on every commit and every pull request, so lint, typecheck, the 553-test unit suite, the route lock and its self-test, the language contract, the feedback ledger and the full build all still gate a branch before it lands. The matrix itself is unchanged: the same 208 route cases across Chromium, Firefox and WebKit on the same frozen artifact, now read after promotion rather than before it. The accepted trade is that a browser-only regression can be live for the few minutes between the merge and that result; rollback is the mitigation.

- Finished the wording change on the approved R3 homepage, the last surface still reading "Start here", recorded in `quality/route-lock/approved-production-r26.json`. Six occurrences, not the four reported earlier: three surfaces, each rendered twice for the desktop and mobile variants. The label is now single-sourced. `decisions.sharedLanguage.selection.start` in `quality/website-redesign/homepage-handoff.v1.json` already drove the footer entry and the navigation action; the prototype generator now resolves the route stage's action from the same value, so the homepage says one thing in three places from one decision, matching what `START_LABEL` does on the React side. The original wording is preserved in that record's `provenanceNote` beside the owner readback it came from.
- Two guards did their job during that change and are worth recording. The route stage's label was a literal inside `prototypes/website-redesign-recovery/component-selection/homepage-route-configurator/index.html`, which is an integrity-locked tree in the handoff; it was left alone and its hash was not rewritten to let the change pass, so the generator was changed instead. And `index.html` under `homepage-production-synthesis-r3` is itself generated: a first attempt hand-edited it, the prototype's own deterministic `--check` reported the mismatch, and the edit was reverted. Verification on the built artifact: prototype `--check` clean, adapter `--check` PASS, `qa:homepage-handoff` clean, `qa:homepage-release` 12 cases and 12 screenshots across Chromium, Firefox and WebKit with no failures, `qa:homepage-r3` 10 observations with no failures, the homepage route smoke clean, 553 unit tests, typecheck and a full build.
- Recorded Krish's standing authorisation, given 2026-09-24 and restated 2026-09-25, that merging to main is the default for every future session and needs no separate approval. `CLAUDE.md` and `07_DEPLOY_RUNBOOK.md` carry it. Independent human review is no longer a gate on the merge; the gates, the production readback, the recorded revision and the rule against merging a red head are unchanged.

## 2026-09-24

- Repaired `/new-age-leadership`, recorded in `quality/route-lock/approved-production-r23.json` and not yet approved or promoted. Krish reported that the page needed its buttons pressed instead of building as it was scrolled, that it showed large empty bands, and that its top bar was not the one every other page wears. The first two shared one cause: the R5 prototype declared `overflow-x: hidden` on `body`, where the scrollport is the viewport, and production scopes every prototype selector to `.nal-page`, which made that div its own scrollport; a `position: sticky` child of a container that never scrolls does not stick. Measured at 1440x900 before the fix, `.work-sticky` sat at `top: -877` with the page scrolled to 7447, and all three pinned tracks ran 1800-1980px past their content as empty paper. `overflow-x: clip` clips the same overflow without creating a scroll container and every pin the prototype designed started working.
- Below 900px the history sequence had been a four-state card reachable only by tapping; it now pins and builds by scroll, with its era buttons and range input moving the page to a state rather than swapping it underneath the reader. The six AI Brain benefits stopped advancing on a 6.2-second timer and became a pinned sequence the reader drives; the progress rule under their arrows reads `--benefit-index`, which nothing had ever set. The route was moved inside `MindmakeShell`, replacing its bespoke masthead and a hand-copied duplicate of the site footer, and `--mm-header-inline` now gives the shared wordmark the story's own gutter at three widths.
- The film pause moved into the hero rather than floating. All four screen corners were measured occupied by this composition at some scroll position at 1440 and 390, so a standing control would have overlapped a heading, an era button, the range input, the benefit arrows or the privacy notice. Below 620px the button had been hiding its own label with `font-size: 0` and drawing a fixed "Motion" from a pseudo-element, so the visible word never matched the state the script wrote into the accessible name.
- Blank-band readings at 1440x900 fell from a full viewport to 29%, and on a 360x640 phone from 39% to under the 42% limit; the widest remaining run is the composition's own editorial pause on `.old-feeling`. `qa:new-age-r5-production` was rewritten to prove states by scrolling and never by clicking, forwards and in reverse, across ten viewports on chromium and three each on webkit and firefox, with a negative control that removes the pins and must fail. Sampling is tied to the viewport rather than a fixed step count: a fixed 40 samples strode past one benefit on a 844x390 screen and reported a state the page does draw as missing.
- Three gates returned no verdict in the Linux container and are not claimed: `qa:release-routes` on WebKit fails on `/case-studies` with an `.mp4` request that never completes, the documented Linux WebKit media limitation CI avoids by running WebKit on macOS; `qa:alive` reads 0.000 mean pixel change at every viewport of every route, the untouched homepage and locked routes included; `qa:full-route-continuity` cannot start because the homepage's first `h1` below 430px is a zero-size duplicate, which reproduces identically on the pre-change commit.

- Promoted r17 through r21 to production as merge `f446786` (PR #175) on Krish's instruction, which is the promotion approval; main auto-promotes. CI on the head `f6650bf` had passed the source gates and the homepage-release gate on all three engines, and the three route legs were past the point where the previous head's hydration failures fired, with none reported; the run was not left to complete before the merge, on his instruction. Production readback after promotion: `/ai-brain`, `/ai-gtm` and `/blog` serve "Get your free AI brief" with the action bar and no Decision Balance; `/new-age-leadership` carries the Decision Balance and no action bar, which is correct for a route that does not use the shell; `/ai-brain/` and `/ai-gtm/` answer 308 to the slashless path and then serve the same document with the door present.
- Corrected a claim made earlier in the same session about r21's first defect. It was reported as a live visitor-facing fault: that anyone arriving at a trailing-slash URL was served a document that tore itself down and re-rendered. `vercel.json` sets `trailingSlash: false`, so production redirects `/ai-brain/` to `/ai-brain` with a 308 and always did; no visitor met the mismatch. The failure was real in the local built preview and in `qa:release-routes`, which asks for the slashed spelling on purpose, and it failed there on Chromium, Firefox and WebKit. The fix stands on its merits, because the door must not depend on which spelling of a route renders it, but the production severity was overstated when it was first written down.
- The release browser matrix caught two real defects in the action bar on the r20 head, on every engine, and both are fixed in `quality/route-lock/approved-production-r21.json`. First: the bar's door was keyed on `location.pathname` exactly, so `/ai-brain` found a door and `/ai-brain/` did not. Vercel resolves both spellings to the same document, and the local preview serves the prerendered file from the second, so the document was rendered with a door and hydrated without one. React error #418, the route dropped to client rendering, and the server heading went with it: four failures per engine across `/ai-brain` and `/ai-gtm` at both widths. Keyed on the route without its trailing slash now, and locked by `src/test/action-bar-door.test.ts` with a negative control, which fails its two trailing-slash cases against the old lookup. Second, found by the same matrix after that fix: on a phone the door sat on its own row and the bar stood 150.7px tall at 320x568, over a quarter of the screen, and its own reserve pushed the last footer link underneath it on both offer routes. The door is hidden below 768px; the phone keeps the one action and the menu carries both routes. Chromium's full local matrix then read 104 cases and 5 supplements with no failures, against 8 and 3 before the two fixes.
- Reworded every way in and replaced the phone bar with a two-slot sticky bar, recorded in `quality/route-lock/approved-production-r20.json` and not yet approved or promoted. Krish set the promise: the click should offer something really good, really quickly, for free, and the chain behind it is the brief's questions, the lead capture, the brief itself, then him getting in touch with a free consultation and audit. So the label names the output rather than the act of clicking: `START_LABEL` is "Get your free AI brief", held in `src/lib/publicLinks.ts` so the menu, the bar, `/faq`, `/contact`, the case-record close and the Decision Balance cannot drift apart. No duration is claimed, because none is measured. "Get a free live session", asked for in the previous instruction and held in r19, is not what shipped: nothing in the flow books a session, so the consultation is named in `START_SUBLABEL` as what follows rather than as what the button books. The bar carries two slots and never three: at most one door, which is the offer route the reader is not already on, and the one action. The door is a link and the action is a button, so `one-way-in` counts one way in. The immutable approved R3 homepage is untouched and is the one surface still reading "Start here".
- Two gates caught real defects in that work before it was committed, both recorded with their fixes. `qa:chrome` failed at 1440x900 and 1.5x text on four routes: the bar overlapped the privacy card by 14px, because the card published its own height while sitting inset from the bottom edge, which was indistinguishable from flush while the bar was phone-only. `src/components/CookieConsent.tsx` now publishes the space the notice actually occupies, measured from the viewport, which is identical on a phone. `qa:oneway` failed on `/faq`: that page's own action carried no `data-mm-primary`, so the bar could not see it and both were on screen at once. Marked; both gates re-run clean, 8 sizes x 7 pages x 2 text scales and 9 routes at two widths.
- Split the release browser matrix one engine per leg, from evidence rather than from feel. `matrix.engines` was a space-separated list walked in a bash loop, so Chromium and Firefox queued behind each other on a single Linux runner. On run 36067326051 that one step took 6m25s while the entire macOS WebKit leg finished in 5m14s, which made Linux the critical path and the run 9m10s; the source-gate job before it takes 53s. Split, the two Linux engines run at the same time and the critical path becomes macOS WebKit. No gate, engine, case count or artifact changed: the same 208 route cases run against the same frozen build, and the browser install still covers all three engines on both platforms because `qa:homepage-release` launches all three whatever the leg is. The wait was the bug, not the verification.
- Returned the phone action bar to `/ai-brain` and `/ai-gtm` on Krish's instruction, recorded in `quality/route-lock/approved-production-r19.json` and not yet approved or promoted. Restoring it exposed why it had never worked: every rule for `.mm-action-bar` lived in `src/styles/mindmake-instruments.css`, which only `/case-studies` imports, so on `/blog`, `/blog/:slug`, `/answers` and `/answers/:slug` the component shipped with no CSS and rendered a bare green button in normal flow below the footer at every width, desktop included. The rules moved verbatim to `src/styles/mindmake.css`, beside the `--mm-bar-reserve` token and the `.mm-footer` padding that reads it. Measured on the built artifact after the move: `position: fixed`, `is-shown`, 72.19px reserve at 390x844 with a coarse pointer on all four shell routes plus the two offer routes; `display: none` at 1440x900 on all of them. `qa:chrome` clean across 8 sizes x 5 pages x 2 text scales; `qa:oneway` never more than one primary action on screen across 7 routes at 1440 and 390.
- Held two parts of the same instruction rather than shipping them, both stated back to Krish. (1) Renaming every "Start here" to "Get a free live session": every one of those buttons opens `LeadBrief`, a private written brief that ends in an emailed document, so the label would promise a session the flow does not book; `src/test/brief2-public-contract.test.ts` and `src/test/price-single-source.test.ts` both record a decision against booking language and a public diary on the shell, and `CLAUDE.md` puts public offer claims behind scoped approval and the material-review gate. (2) A three-button sticky bar on the homepage: `scripts/qa/one-way-in-check.mjs` permits a fork of exactly two in one control group and fails anything else, `src/components/mindmake/CloseBlock.tsx` records the defect that produced the rule (three "Start here" at once at the foot of `/ai-gtm`), and the homepage is generated from the immutable approved R3, so the bar would also be a material change to that release. Neither hold is a refusal of the goal; both need the offer or the approval to move first.
- Restricted the commercial Decision Balance to `/new-age-leadership` on Krish's instruction ("this section should only exist on https://mindmake.co/new-age-leadership, absolutely nowhere else"), recorded in `quality/route-lock/approved-production-r18.json` and not yet approved or promoted. It had been mounted on seven routes; six mount points were removed (`/ai-brain`, `/ai-gtm`, `/blog`, `/blog/:slug`, `/answers`, `/answers/:slug`) and nothing was put in their place, because a replacement close would have been a new commercial surface outside the instruction. `src/components/mindmake/locked/CommercialDecisionBalance.tsx` and `src/styles/mindmake-commercial-decision-balance.css` are byte-identical to r17. The route contract test and the production check now carry a negative control over the six cleared routes, since a re-mount is a one-line import. Run on Linux, Node 22.22.2: typecheck, lint (0 errors, 2 pre-existing warnings), 542 unit tests across 36 files, `qa:approved-routes` and its self-test. The browser matrices, the build and rendered screenshots of the six cleared routes were not run.
- Answered seven reported items on the delivered surfaces, six of them real defects, recorded in `quality/route-lock/approved-production-r17.json` and not yet approved or promoted. Measured on the built artifact: the header wordmark now shares each route's own content edge (`/ai-brain` was 42.4px inboard of its heading at 1440, `/ai-gtm` 60px; every indexed route now reads a 0px delta at 390, 1440 and 2560). The menu's start action centres its label in a bounded box (89px tall with the label against the top edge at 1440, now 58px with the text centred). The homepage footer holds its drawn proportions instead of scaling with the viewport (row gap 72px to 28px at 1440, 128px to 28px at 2560; footer height 259px at 1440). No heading carries a focus ring on a cold load on `/`, `/new-age-leadership` or `/ai-gtm`. `/ai-brain`, `/ai-gtm`, `/case-studies` and `/new-age-leadership` render their own styling with JavaScript off, which they did not before: their stylesheets were in lazy chunks the prerendered head never referenced. `/case-studies` keeps "The source records." and gains a plain-language lede beside it. The seventh item, a missing sitemap, was not reproducible and needed no change: `https://mindmake.co/sitemap.xml` answered 200 with 26 URLs matching `public/sitemap.xml` byte for byte.
- Published the owner-approved R3 and locked companion surfaces through PR #170, merge `3ee77cf9956f98dd73f69d0b48745930335e74e1`, production `dpl_EZigNAi6Uc6Apcq75XsFnHETt5W8`. Preserved approved copy/composition/assets; added the requested four-state history and five-state leadership-dividend native scroll-pinned builds with reversible exits and reduced-motion/short-height fallbacks.
- Final source-bound CI passed 531 tests, 208 route cases and nine navigation supplements. All twelve motion cases and twelve fallback transitions ran on both Linux and macOS; the public-site rerun passed too. Independent visual/focus/cookie review and all 26 indexed-page, referenced-asset and redirect checks passed. Exact receipts and failures corrected before publication are in `website-redesign/RELEASE-2026-09-24.md`.
- Deployed and source-verified company-provenance corrections in enrichment v44, brief v20 and personal-read v25. The new live frontend canary reached actual verification, visitor/operator inbox delivery and the actual downloaded brief; captured synthetic identities and cleanup are in the backend evidence. No live follow-up cron was invoked.
- Durable source/motion gates and positive/negative controls were strengthened. The canonical local harness and installed Codex release `v2026.09.24.2` were upgraded and tested; no remote harness or other-client installation is claimed. Node 22 and npm ci now preserve frozen dependencies; Vercel's formatting-only config compaction is byte-matched, not exempted.
- Owner explicitly excepted physical iPhone VoiceOver/Android TalkBack for this release only. An authorized audit recorded 23 dependency package findings, assessed without a confirmed visitor-reachable blocker in this static release; compatible upgrades remain open. These are recorded limits, not perfect-quality claims.

## 2026-09-17

- reconciled at `c12e5a2`: two non-steward commits since the last run, both the same change, "Organise film libraries by release month" (`6af2005`, pull request #169). It moved the six live films from `src/assets/films/` into `src/assets/films/aug2026/` without changing bytes, updated every import and check, and added a sealed, not-yet-live September loop library. `CLAUDE.md` and `README.md` were updated in the same commit by its author, so no drift was found in either. `project-documentation/` names no film file path, only the concept and the count, and the count (six live films) did not change, so nothing there needed reconciliation.
- rolled from NOW.md: the "2026-08-11 to 12" bullet, more than 30 days old, moved to `## 2026-08-11` below.

## 2026-09-09

- reconciled at `d3b1bd8`: `NOW.md`'s "What changed recently" gained two dated bullets, the answer surface (`/answers` and four questions, pull requests #160 to #164) and the cross-repo krish-canon block landing in `AGENTS.md` (pull requests #158, #159, #166, #167). `project-documentation/` was not touched by either change, so no drift found there; the state doc's "prerenders 21 indexed routes" line now predates the answer surface (sitemap and prerender cover 26), noted in `NOW.md` rather than rewritten here, since the doc's own baseline is scoped to the 5 September edge rewrite it was measured against.

## 2026-09-07

- decision: Krish Raja, 7 September 2026, recorded in the control-center steward runbook under "Repo notes": the rule in `project-documentation/README.md` that read "There is no history file. If a fact here is out of date, it is a bug, not a record. History lives in git." is replaced. This repository keeps `project-documentation/history/LOG.md` like every other fleet repo, and git still holds everything. The reason: `project-documentation/06_CURRENT_STATE.md` had reached 2,363 lines and had become a state document and a release journal in one, so an agent that needed "where is it now" waded through every past deployment.
- reconciled at `20ef51f`: `project-documentation/06_CURRENT_STATE.md` cut from 2,363 lines to 125. Everything dated (the "Repaired", "Proven live", "Corrected", "Measured" and "Added" entries of 29 and 30 August, the dated entries of 1 to 5 September, and the verification baselines as last measured on 29 August) moved into this file under the date each describes, in the order it stood. Two mechanical changes and nothing else: headings were demoted one level so that `##` in this file is always a date, and 46 em dashes were replaced (a colon in a heading, a comma in prose) because the validator refuses an em dash in this file and the repository's own rules forbid them. Facts the journal recorded after the current-state sections were written (the production commit and deployment, the rollback target, the function versions, the baselines, the proposal on screen, the board's shape, the deleted ladder and fork, the still-open items from each entry) were carried up into those sections; the sentences they replaced are next.
- reconciled at `20ef51f`: the sentences below stood in the current-state sections of `06_CURRENT_STATE.md` on 7 September 2026 and were superseded by later entries in the same file or by the code. Verbatim, each followed by what replaced it.
  > - Production: commit `0704583` on `main` (4 September 2026, "What a crawler and a share card are given"), Vercel deployment `dpl_5saD1mJed9NpT9oXA6wgGHSUPGnz` on project `mindmake` (`prj_GqamX3psD0cGpGCDXRu0ljET7zap`). Before it the same day, `fd8c07e` ("The wordmark and the mark are vectors") at `dpl_67GND784KVV4iQVSHPA9CpUXwp1g`; before that, `cf2b2d0` ("The curtain was never there") at `dpl_GQ7wCHKhhRK34Nf5EpxJ3bPRahHc`, then Krish's upload of the two brand exports at `dpl_CAPenq7T8BuRzAia2SrXKkY4fHhw`. Before those, commit `12ace5e` (3 September, the entrance and the story's spine) at `dpl_AFyoEwjLzuG3wr93xuXAYFhVay9a`, and before that the 28 August rebuild, merge `75572542094ddd4e702a877b258b9014f37415c1` (pull request #152) at `dpl_HAoncV1RF3hcvcanqo7Yvc4tuAng`.

  Superseded by the 5 September promotion recorded under 2026-09-05 (commit `6d39665`, `dpl_ZU6oQorQQcgpiD5YHARRFZHLo3Rg`).

  > - Rollback target: `dpl_HAoncV1RF3hcvcanqo7Yvc4tuAng`, the 28 August rebuild. Not `dpl_AFyoEwjLzuG3wr93xuXAYFhVay9a`: that build carries the 3 September curtain defect (the root as a fixed grid for a second after paint, and no curtain), and rolling back to it would ship that again.

  Superseded by the 5 September record, which names the deployment the edge rewrite replaced, `dpl_5saD1mJed9NpT9oXA6wgGHSUPGnz`, as the rollback target. The warning about `dpl_AFyoEwjLzuG3wr93xuXAYFhVay9a` stands.

  > - Verified live after promotion: all three pages 200 with their new headlines, both film formats and the posters served from the CDN, the sixty-second proof film reachable, one-hop 308 redirects from `www`, `themindmaker.ai`, `/signal` and `/library`, `llms.txt` and `sitemap.xml` 200, and the privacy notice carrying the corrected email wording and the working contact address.

  The 28 August post-promotion readback. Superseded by the 5 September readback under 2026-09-05.

  > - Routes did not change. The rebuild replaced what the three pages say and how they behave, not the route contract, so every redirect and crawler surface keeps its shape.

  True of the rebuild. Since 4 September 2026 `vercel.json` sets `trailingSlash: false` and makes `/intake` and `/testimonials` permanent (under 2026-09-04).

  > - **The company read** (`/ai-gtm`): the details hand to the existing brief pipeline, unchanged, and the six-digit code still stands between the visitor and anything reaching us. This is the Gate E hand-off approved on 27 August 2026, reached from a new place. The proposal document is no longer rendered inside the dialog: it is built for the email and the attachment, and on screen it sat at the bottom of a scroll where nobody looked for it. The read the visitor came for is the preview step.

  The two sentences about the proposal were written on 29 August 2026 (`064cbe9`) and superseded the same day by `1767232`, "Put the proposal back on screen, where the canon says it goes"; `src/test/proposal-on-screen.test.tsx` holds it. The rest of the line stands.

  > - **The live board** (`/ai-gtm#board`): what moved in AI today, grouped by the four levers, read from the daily cache. It states its own age, marks itself as yesterday's read after 26 hours, and collapses to a heading and one honest line if the read is unavailable. It never renders an empty frame.

  Superseded on 2 September 2026 by "the board becomes a departures board" (under 2026-09-02): rows on both surfaces, filtered by division, reading the window rather than the day.

  > | `submit-mindmake-brief` | v13 | off | The company read, plus the day-14 follow-up enqueue. Deployed from merged `main` on 28 August 2026 with its full import closure, and the deployed body verified to carry the enqueue |

  v13 was the 28 August deploy. v16 went live on 5 September 2026 (under 2026-09-05).

  > | `get-ai-news` | v68 | off | Restored to the repository and extended with `{view:"board"}`. No body still returns the previous shape byte for byte |

  v68 was superseded by v69 on 2 September 2026 (under 2026-09-02).

  > | `send-follow-ups` | v2 | off | The day-14 follow-up. Cron only |

  v2 was superseded by v5 on 5 September 2026 (under 2026-09-05).

  > Last measured 29 August 2026, against the built output.

  The 29 August baselines follow below under 2026-08-29; the current ones were measured on 5 September 2026.

  > | The enemy pair, the ladder, the fork, the board | Homepage and door-page sections. The enemy pair is the oracle and the mirror cards resolved by one claim; the ladder is the three levels of value; the fork is the paper band where a visitor picks a starting point and nothing is stored; the board is the live daily market read on `/ai-gtm`. |

  The ladder (`ClimbLadder`) and the fork (`ForkBand`) were deleted from `/ai-brain` on 5 September 2026 (under 2026-09-05). The board has been on both surfaces since 2 September 2026.
- reconciled at `20ef51f`: stale sentences in the root `README.md`, each brought to what the canon and the state doc already said. "Work begins with one privately priced thirty-day proof" (the opening) and "one useful thirty-day proof" (step 4 of the public journey) now say the price is private and the length is agreed with it, per the 5 September 2026 no-public-duration rule. Step 1, "The visitor gives a company website", now gives the four details, as the site has since 29 August 2026. The `/ai-brain` route row no longer names the fork and the ladder, deleted on 5 September 2026, and names the two client stories and the method section that replaced them. "No entrance choreography, and no `IntersectionObserver` in a rebuilt surface" now states the 29 August 2026 lift: reveals run through `src/hooks/useReveal.ts` alone and the page is whole if the reveal never fires. The code-surfaces line that repeated the observer claim ("`IntersectionObserver` appears nowhere") was corrected with it, because the observer is in `useReveal.ts`.
- `NOW.md` written for the first time at the repository root, per the steward schema. `.github/workflows/docs-steward.yml` added (the fleet caller, nightly at 20:10 UTC and on every push to `main`) and `.steward/` ignored.

- reconciled at `64d63f1`: the bootstrap was rebased onto three upstream commits of 7 September 2026 (`ad345f4`, `eb06329`, `218dc14`, merged as pull requests #156 and #157), which resolved the testimonials excerpts, made the story deck read its quotes from `src/data/testimonials.ts`, and swapped the media CRO story. They appended one entry to `06_CURRENT_STATE.md`; it is rolled here and its facts carried into the current-state sections.
- rolled from 06_CURRENT_STATE.md: the entry dated 7 September 2026 ("the thirty-three, revised", with its two same-day follow-ups on the story deck), verbatim, headings demoted one level.

### 7 September 2026: the thirty-three, revised

Krish revised `src/data/testimonials.ts` and declared the file canon. Twenty
lines changed: four session quotes corrected to what was written, one client
quote corrected (Louisa Thrave weighed a life coach, a business coach and an AI
coach, not a marketing professional and a sales expert), eight outcome quotes
replaced or extended with what the person actually said, two ids renamed
(`adtech-founder` to `martech-founder`, `breathwork-founder` to
`wellness-founder`) and one role corrected (`fintech-founder` is a founder of
an early-stage creator business). The founder's name stays inside the quotes
that use it, and so do the spellings: `contnues`, `aroudn` and `realize` are
what was written.

#### What the revision broke, and the fix

Ten excerpts stopped being substrings of the quotes they were cut from. Two
fell out by case alone (Ellsworth and Yazdani now begin their sentences with a
capital). Eight were paraphrases: the revision changed the full quote and the
excerpt was rewritten to say what it meant rather than cut from what it said,
and one of them ran to 118 characters against the 108 cap. Both rules in
`04_PROOF.md` are meant to catch exactly this, and `testimonials.test.ts` did.

Every excerpt is an exact substring of the revised quote again, cut to keep the
beat the revision reached for:

| | excerpt now |
|---|---|
| James Gately | "With mind/make, I was empowered on how to own the what I do next" |
| Louisa Thrave | "weighing up between a life coach, business coach, or an AI coach, choose mindmake. You'll get all three." |
| martech founder | "nobody could buy, because nobody could explain it. We're now clear on who we are in the new world." |
| media CRO | "Krish knows how to add value immediately which contnues to compound" |
| media advisory | "He turned the pitch into something sellable, which then evolved our pitch." |
| wellness founder | "I used to post once a month; now it's most days because I focus on building an AI engine" |
| B2B COO | "We killed a vendor proposal in about a day because the assumptions were weak and I didn't realize they were." |
| creator founder | "He gave me the framework and support to decide for myself." |

The B2B COO's excerpt sits exactly on the cap. The revision wanted both the
vendor proposal and the ChatGPT line on the card, and they are not contiguous
in what he wrote, so the card carries the result and the reason and the panel
carries the rest.

#### Measured

The rail was read at nine widths from 320 to 1920 on `/` and `/case-studies/`,
each card's height, whether any excerpt or attribution overflowed its row, and
the opened panel for the longest full quote (Vincent Pelillo's, at 456
characters).

- Every card equal at every width: **177.3px from 360 up**, which is the
  height recorded on 28 August, so the longer excerpts cost the rail nothing on
  any measured phone or laptop. At 320 the cards are 266px wide, the longest
  excerpts take a fourth line and every card is 199px.
- Nothing clipped: no excerpt, no attribution, and no opened panel, at any
  width. The panel grows past the rail (492px over a 199px rail at 320) rather
  than scrolling inside itself, as designed.
- Tests **450 across 29 files**, lint **0 errors, 2 warnings**, typecheck **0
  errors**. Cards (18 on `/`, 33 on the archive), screens (8 sizes, 4 pages)
  and no-JS (5 pages, 50 answers) green on the built output.

#### The story deck follows, 7 September 2026

The deck in `src/data/rebuildProof.ts` and the eight stories in `04_PROOF.md`
quoted the same people in older words: anglicised, name-stripped, and in three
cases a different sentence (the media CRO's "One day. One decision.", the
adtech founder's "Now they can. Including me.", and "He set up" where the
revised testimonial reads "We set up"). Krish's call: the deck follows the
testimonials.

- Each story now names its `voice` and reads `quote` and `attribution` from
  `testimonials.ts` at import, so there is one copy of every quote and a story
  naming a voice that does not exist fails the build rather than rendering an
  empty card. `testimonials.test.ts` holds each story to the whole quote of an
  `outcome` voice.
- The quotes on the deck, the archive and both door pages are verbatim now,
  founder's name and spellings included. Story 2's attribution followed its
  voice from "Partner, Venture Capital Firm" to "Partner, media advisory", and
  the pull-quotes in `04_PROOF_RECORDS.md` were brought to the same text.
- The name gate still reads `rebuildProof.ts` as the practice's own voice and
  passes, because the file no longer carries a quote; the name reaches the
  page only inside a verbatim quote, which is the one place the canon allows
  it.

#### The media CRO's story, swapped, 7 September 2026

The story under the media CRO's quote led on the year of engineering not
spent on the wrong build, and the revised quote is about value landing on day
one, compounding after, and nobody loitering. Krish's call: swap the story for
one that fits the quote. The record is the same engagement, R-08, and nothing
in the new story is new: two quarters of refereeing, one day in the room, the
partner agreement signed the following month, build back for review in twelve
months. The figure draws the two quarters against the day; the year saved is
no longer the headline. Story id `expensive-decision` is now `day-one`; no
door page referenced it.

## 2026-09-05

- rolled from 06_CURRENT_STATE.md: the entry dated 5 September 2026 ("the edge rewrite": what shipped, what was measured, what was promoted), verbatim, headings demoted one level. Its production and baseline facts are carried in the current-state sections.

### 5 September 2026: the edge rewrite

Krish's ikigai work (Master Ikigai v4 and the positioning sheet derived from
it, both 5 September) sharpened what Mindmake is for, and he asked for the
site to be read as a busy leader would and made coherent, concise and clear.
What that reading found, and what changed, is in `00_NORTH_STAR.md`
("Sharpened, 5 September 2026") and `01_CANON.md`. The record here is what
shipped and what was measured.

#### What shipped

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
- **Server copy**: `send-follow-ups` v5 and `submit-mindmake-brief` v16 are
  live with the same edit (the proposal's "A useful first proof" label in the
  email, the attachment and the plain text, two pressure lines, and the
  follow-up's offer line read in private). Both bodies were read back from
  the platform and every file is byte-identical to the repository, sixteen
  for the brief and two for the follow-up. The brief function also carries
  the wider personal-email list from `064cbe9`, which the browser already
  enforced and the live function had not.
- Deleted: `ForkBand.tsx`, `ClimbLadder.tsx`, their stylesheet blocks, the
  paper band head, and the tests and exemptions that named them.

#### Measured

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

#### Promoted, 5 September 2026

- Merged to `main` as `6d39665` (pull request #154). Vercel production
  deployment `dpl_ZU6oQorQQcgpiD5YHARRFZHLo3Rg`, READY. Verified live: the
  new hero on `/`, the private answer on `/`, `/ai-brain/`, `/ai-gtm/` and
  `/faq/`, `llms.txt` carrying the new first line, and no duration promise on
  any of them. The rollback target is the previous production deployment,
  `dpl_5saD1mJed9NpT9oXA6wgGHSUPGnz`.
- `submit-mindmake-brief` v16, deployed after the promotion in the runbook's
  order, `verify_jwt` off, from the working tree with the CLI. Probed live: a
  wrong origin is 403, an unexpected field is 400 naming it.
- **One synthetic end-to-end lead** from `https://mindmake.co` to
  `krish@themindmaker.ai`: verification code delivered, confirmed, visitor
  and operator deliveries both queued, the results email carrying "A USEFUL
  FIRST PROOF" and the new pressure line, exactly one `follow_up_queue` row
  due fourteen days out. Both rows were then deleted and read back as gone.
- Worth a look: the live company read for `themindmaker.ai` resolved the
  brand to a different founder's name and product. That is the enrichment
  provider's answer for that domain and predates this change; it is the
  read a lead from that domain would see today.

## 2026-09-04

- rolled from 06_CURRENT_STATE.md: the three entries dated 4 September 2026 ("the curtain was never there", "what a crawler and a share card are given", "the privacy strip, and the rules that reached it"), verbatim and in the order they stood, headings demoted one level.

### 4 September 2026: the curtain was never there

Found while writing the production readings of the 3 September deploy into
this file: the root element's class list read `is-on mm-arrived`, and `is-on`
was meant for the strips. Pulling on that thread found two defects in one
construction, each hiding the other, and a gate that could see neither.

#### What was actually shipped

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

#### What changed

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

#### Measured after

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

#### The wordmark is a vector

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

#### Baselines after this change

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

### 4 September 2026: what a crawler and a share card are given

Krish, from the browser: the tab icon looked terrible and should have a
transparent background, and was the site fully discoverable by robots and
crawlers, with the social plates correct and as inspiring as possible.

#### What was found

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

#### What changed

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

#### Verified on production

Deployment `dpl_5saD1mJed9NpT9oXA6wgGHSUPGnz` for `0704583`: the homepage,
`/ai-gtm` and a post each serve their own plate with a version in the URL
and the page's words as the alt text; the plates, the SVG and ICO icons,
the touch icon, the logo, the pinned-tab SVG and the manifest all answer
200 with the right type; the old plate and the old tile sizes answer 404;
`/ai-brain/`, `/blog/` and `/case-studies/` are 308s to the canonical
form; `llms.txt` carries the four details; the manifest carries the ink;
the Organization record names the new logo.

#### Still open

- Nothing here can say how a share looks on LinkedIn or on X until one is
  posted; both cache by URL, so the first share of each page fetches the new
  plate, and a repainted plate needs the version in its URL to change, which
  the manifest does when the words change.
- The plate for a post uses its category's film. A post that earns its own
  still can set one when there is one.
- The 404 for an unknown route is Vercel's plain text. A branded page would
  be `dist/404.html`, which the prerender does not write yet.

### 4 September 2026: the privacy strip, and the rules that reached it

Krish, from an Android phone: the privacy banner glitches terribly, and make
sure this cannot happen on any device. The photograph showed a dark strip
floating above the bottom of the screen with the page showing underneath it,
its one sentence broken over two lines, and its button reading GOT / IT.

#### Three causes, all reproducible at every phone width

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

#### What changed

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

#### The gate

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

#### Baselines after this change

- Tests: **451 across 29 files**, all passing. New: the privacy strip's rules
  in `CookieConsent.test.tsx`, which hold what the gate measures the result
  of: the strip declares its own type, no declaration cancels the one above
  it, the label may not break, the strip is flush and the bar stacks on it,
  the footer adds both reserves, and the browser's text guess is refused.
- Lint **0 errors, 2 warnings**. Typecheck **0 errors**.
- Every browser gate green at both widths, plus `qa:chrome` at its own eight
  sizes and two text scales.

#### Still open

- `src/index.css` styles bare `h1` to `h6`, `p` and `small`, and this is the
  third live defect that file has caused. Removing those rules is not a
  no-op: measured across five pages, paragraphs move from 16px to 17px and
  the blog's `small` from 14px to 8.4px, because the design system's own
  defaults have been dead underneath them. That is a change with a visual
  pass attached, and it is not this commit.

## 2026-09-03

- rolled from 06_CURRENT_STATE.md: the entry dated 3 September 2026 ("the page arrives once, and the story gets a spine"), verbatim, headings demoted one level. Its 4 September correction stands inside it as written.

### 3 September 2026: the page arrives once, and the story gets a spine

Krish, scrolling the live site on a phone: slight glitches as the page loads,
the board's filter chips overlapping the words "your week", words that exist
for their own sake, and a homepage that does not tell one story. He named
tenex.co as the reference for how a page should reveal and asked to be
challenged rather than obeyed.

#### What was measured before anything changed

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

#### The read that was given back

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

#### What changed

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

#### Measured after

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

#### Baselines after this change

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

#### Still open

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

## 2026-09-02

- rolled from 06_CURRENT_STATE.md: the six entries dated 2 September 2026 ("the design says it, so the sentence goes", "the declarations that could never win", "the toggle, the build, and the measure", "an audience axis, and what the cache actually holds", "the board becomes a departures board", "the why, published as something to flick through"), verbatim and in the order they stood, headings demoted one level.

### 2 September 2026: the design says it, so the sentence goes

Krish, on the lead dialog on a phone: *"I don't think we need the text
underneath the progress bar. It's stuff like that which we need to make way more
minimal across the whole site. On every page the design should do the talking as
opposed to the words... copy such as 'That is the whole idea.' is a total waste
of space and needs to be purged from everywhere."*

The sentence he pointed at was `Four details, and Mindmake does the reading
before it asks you to explain the problem.` It sat between a step rail reading
**You · Problem · Time · Brief** and four labelled fields, and it described both.

#### What was measured before anything was cut

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

#### What changed

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

#### What cutting a line broke, and how it was fixed

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

#### The gate that keeps it out

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

#### Baselines after this change

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

#### Still open

- The three still `.mm-try` viewports above, unchanged in kind since
  1 September.
- The three-question form on `/ai-brain` runs 1.88 screens and is exempt by
  name. Making it two steps would fix the height and change a working
  conversion surface, which is a decision rather than a fix.
- `/new-age-leadership` and `/blog/:slug` are still lazy against a 348KB entry
  bundle, and were never measured for the hydration cost.

### 2 September 2026: the declarations that could never win

Krish, with two screenshots: *"Can we also fix all the instances where text
wraps pointlessly, or where it is far too close to other components."*

The first screenshot showed `/ai-brain`'s payoff line sitting flush against the
two cards above it. The line asks for `margin-top: 30px`. It was computing 0.

#### One line, and then sixteen more

`mindmake.css` carried the margin reset as
`.mm-site h1, .mm-site h2, ..., .mm-site p, ... { margin: 0 }`. That is
**(0,1,1)**, and it is above every single-class rule in this repository. Not
"wins on source order", cannot lose. So a component writing
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

#### Text that wrapped pointlessly

Measured the same way: **72 blocks across four pages at 1440 and 390 ended on a
stub last line under a quarter of the width of the widest**, a full line, then
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

#### Baselines after this change

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
  are `.mm-try`**, `/ai-brain @3376` and `@4220` at 390, `/ai-gtm @2532` at
  390, `/ai-brain @3600` at 1440, and the fifth is `/ @844px`. That is the same
  worklist as 1 September in substance, and no floor was lowered.

### 2 September 2026: the toggle, the build, and the measure

Four things, all of them named in the same message, and the first two were live
defects nothing was looking for.

#### The story deck's arrows did nothing on a laptop

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

#### CAREER REFERENCE, cut in half

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

#### Five excerpts that quoted the problem instead of the result

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

#### Components that build as you scroll

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

#### Text that wraps while its column has room

The earlier pass measured *widows*, stub last lines, and fixed 72 of them.
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

#### Baselines

- **395 tests**, 0 lint errors and 2 warnings, 0 type errors.
- **Every browser gate green, `qa:alive` included, for the first time.**
  `qa:screens`, `qa:nojs`, `qa:oneway`, `qa:rhythm`, `qa:images`, `qa:cards`,
  `qa:entrance`, `qa:deadcss`, redirects, dialog shape, handoff.

### 2 September 2026: an audience axis, and what the cache actually holds

The board can be read as one part of a business, and the mapping from nine
subject categories onto eight divisions is a guess. Measured over 400 live
items: **59 are about people and work, and only 17 carry `category: "org"`.**
Forty-two were filed under their subject instead, because a story has a subject
and an audience and one field can only record one of them. The subject always
wins, since the subject is what a headline is about.

Widening the keyword lists to recover them was tried and **rejected on the
measurement**: People went from 32 to 47 across 28 days and most of the 15 added
were wrong, *"NanoClaw enables persistent AI teams in Slack"* matched on
"team". No list of words tells the team you manage from a team of AI agents. A
classifier that has read the article can, so the fix belongs upstream.

#### The contract

Two optional fields, additive, requested of CTRL's `live-headlines`:

- **`affects: string[]`**, which of the eight divisions a story lands on,
  judged from the article. When present it is the answer and the projection is
  not consulted.
- **`stance: string`**, `opportunity`, `shift`, `risk`, or `damage`. An item
  that only reports harm has no move in it for the reader, and printing it is
  doom framing about their business, which the house style bans. Those are
  dropped upstream; `isShown` is the second lock here.

A story about work changing is not excluded: the shape of entry-level hiring
changing is a `shift` with a move in it, a redundancy round is not.

#### What is deployed, and what is not

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
waiting on anything, the moment a row carries the fields, they flow.

#### Baselines

- **405 tests**, 0 lint errors and 2 warnings, 0 type errors.
- Nothing renders differently until the fields arrive.

### 2 September 2026: the board becomes a departures board

The board was one card on the homepage and six cards on `/ai-gtm`, filtered by
industry alone. It is now a list of rows on both, filtered by the part of the
business a reader runs, drawn from the whole retained window rather than from
today.

#### The treatment

One item is a row: a gauge that sweeps to how well corroborated it is, and a
headline that turns over leaf by leaf until it lands. They run on one clock, so
a row finishes as one thing. Each row starts when it crosses into view, on its
own settle rate and its own jitter, so rows overlap and disagree the way a real
board does.

**Every leaf carries the true character as its own text.** The riffle writes a
decoy into `data-r` and CSS paints it over the top; landing deletes the
attribute and the real character is revealed again, because it never left. So
wherever a row renders, before hydration, under reduced motion, to anything
reading the DOM, the headline is written out in full and nothing moves. The
animation is never what puts the words on the screen. The board's data is
fetched, so with scripting off the section shows its own honest line rather than
rows; that is the fetch and has always been true of it, not the treatment.

**The board only exists while a leaf is turning.** A real split-flap display is
monospaced uppercase because each leaf is a fixed cell; ours is not, and a
70-character headline set that way is markedly harder to read, which was the
first thing the treatment was pulled up on. The slot, the hinge and the mono
drum appear only on a churning leaf. A settled character is ordinary type in the
site's own face, at reading size, with nothing round it.

#### What a phone changed, which was more than the layout

A desktop row is one line of headline beside a gauge; a phone row is three. The
first phone build made three separate mistakes, all found by looking at it:

1. **It broke words in half.** "human researchers i / n safety", "annualized
   revenu / e", on nearly every row. Two adjacent inline-blocks are a break
   opportunity in Chromium whether or not there is a space between them, and
   every character was one. Each word is a `nowrap` span now; only a word long
   enough to strand a line, `Gemini-3.5-Transcribe`, 21 characters, real, in
   the feed, gives that up so it can break between leaves.
2. **The churning run sat above the line.** `overflow: hidden` on the leaf made
   Chromium take its bottom margin edge as the baseline instead of its text's,
   lifting every slot a descender's worth. The clip belongs to the decoy.
3. **The clock was per-character.** A 91-character headline took two and a half
   seconds, which on a phone, two or three rows in view rather than eight, is
   most of the visible screen unreadable for most of that time. `perCell` comes
   from a target total now: about 0.8s on a phone, 1.25s on a laptop, whatever
   the length. Rows also cascade by index rather than firing together.

The gauge moves too. On a laptop it is a 56px column to the left of the
headline; on a phone that would be an eighth of the width the headline needs, so
it drops to the foot of the row next to the corroboration it is a picture of.
The meta track is `minmax(0, 1fr)`, which is what guarantees the lane badge can
never push a row sideways: the mono text wraps instead.

#### The filters

`BoardFilters` is one control used by both surfaces. The roles are the site's
own eight divisions, the same list the lead dialog asks for and the server
allowlists, so a visitor who says they run revenue in one place is offered the
word "Sales" in the other. **Each chip's count is what it would return if
pressed, with the other lens left where it is**, which is what makes "disabled
at zero" a true promise rather than an approximate one.

On a phone the two groups wrapped to eight rows and 370px, half a screen spent
on the control before a reader reaches a headline. The chips are tighter, which
takes the roles to three rows and 105px with all eight still on screen, they
are the reason the filter exists, and a rail showing two of nine hides the rest
behind a gesture nobody is told about. The industries are the second lens and
are the rail.

**The board reads the window, not the day.** Today alone is fine while nothing
is filtered, because today's items are the newest anyway. It fails the moment a
role is picked: People is 39 items in 476 and 0 of today's 13, so the chip added
to serve that reader would have been empty on most days. Every row carries its
own age, so nothing is passed off as today's.

#### Two things came off the page

**The `pov` line.** Measured over the day's items, **25 of 29 are commands
addressed to the reader**, "Focus on innovative ad models", "Ensure rigorous
oversight", "Prioritize continuous improvement", and **9 carry American
spellings**, including `judgment`. The house style bans both outright, and a
board printing ten of them is ten violations on the page. The board's reading of
an item is the stance word instead, which is one word and ours. The line comes
back when it is written in a voice this site can publish; that is an upstream
change to CTRL's classifier, and the addendum asking for it is written.

**The homepage's hard-coded timestamp.** `"Today 10:30 UTC, checked against
other sources"` was a literal in `Index.tsx` for months, on the one section
whose whole claim is that the timestamp is real. It renders from the cache date
through `timestampLabel` now, like `/ai-gtm` always did.

#### The section split

The board and the four lane tiles under one heading ran to **2.87 screens on a
360px phone**. Where items are landing is a different question from what
changed, so they are two sections with a seam, which is what `qa:rhythm`
sanctions between two blocks standing on one ground. The lanes are two by two on
a phone rather than a four-storey stack. Eight rows on a laptop and four on a
phone: ten put `/ai-gtm` at 1.44 screens on a 1280x800 laptop, which is the
short-height size the budget is set by.

#### What a still board turned out to be

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

#### The headings now say what the rows are

`/ai-gtm` read "What changed in AI today." over rows reaching back four days,
and the homepage read "this morning" over the same. The stamp beside each
already carries the exact figures, "Read 10:30 UTC · 28 days · 389 corroborated
items", so the claim came off the heading rather than the accuracy off the
rows. `/ai-gtm` is "What changed in AI."; the homepage, which reads seven days,
is "What changed in AI this week."

Measured live through our own filters at the moment of the change: seven days is
73 items with every one of the eight roles stocked (People 2, Sales 3, Product
32) and 13.7KB on the wire; 28 days is 389 items (People 35, Sales 14) and
66KB. That is why the homepage reads a week and the door page reads the window.

#### What went with the rewrite

`BoardCardView`, the six-card grid it sat in, its 1,795 characters of CSS, and
`topCard`, which existed to pick the homepage's single item. The homepage draws
from the same collection `/ai-gtm` does now, so there is no second rule beside
it.

#### The sizes no gate here measures

`qa:screens` runs eight sizes and its shortest phone is 360x800. Real phones are
shorter: a 360x640 Android and a 320x568 handset are both common, and any phone
held sideways is 390px tall. A section's budget is a ratio, so the same four
rows read 1.26 screens at 360x800 and **1.51 at 360x640**, the markup did not
change, only the denominator.

Driven with a deliberately hostile payload, the longest headline the feed has
produced, a 40-character unbreakable token, the longest source domain in the
cache, and a card with no source, no age, no stance, no category and no link , 
across 320x568, 360x640, 390x844, 844x390, 430x932, 768x1024, 1024x600 and
1920x1080, at rest and expanded to thirty rows:

| | before | after |
|---|---|---|
| 320x568 | 1.84 screens | **1.26** |
| 360x640 | 1.51 | **1.09** |
| 844x390, sideways | 1.67 | 1.38 |
| 1024x600 | 1.05 | **0.86** |

Two changes did it. The row count follows the **height** rather than the width , 
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

#### Baselines

- **416 tests**, 0 lint errors and 2 warnings, 0 type errors.
- Every browser gate green: `qa:screens`, `qa:nojs`, `qa:oneway`, `qa:rhythm`,
  `qa:images`, `qa:cards`, `qa:entrance`, `qa:deadcss`, `qa:alive` at both
  widths, redirects, dialog shape, handoff.

### 2 September 2026: the why, published as something to flick through

Three pieces of thought leadership had been lost in the rebuild: the "ten
years from now" flip cards, the history of people blaming their tools, and the
founder bio's personality. Both originals were recovered from this repository's
own git history (`f645644:src/components/BigProblem.tsx` and
`755163d^:src/components/OperatorsEdge.tsx`), not scraped from the old deploy.

#### What was found first

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

#### The shape

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

#### The page, as an instrument

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

#### What bound the copy

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

#### What came out

The three "choices before you add an agent" cards, Agatha's three paragraphs,
the page's second "Start here" halfway down, and every Tailwind and
`framer-motion` line in the page and `AgathaStory`. `OrgChart` keeps its
utility classes: it is a diagram in its own frame, not a page laid out in a
retired system.

#### The gates now see the page

`/new-age-leadership` is in the page list of every browser gate that takes
one, in `copy-restraint`'s routes and in the public contract's eyebrow scan and
route loop. `03_DESIGN_CONTRACT.md`'s line that the founder appears "nowhere
else: no first-person voice, no biography, no portrait" was out of step with
the shipped founder section and the canon's 28 August ruling, and now says
what ships.

#### Baselines

- **419 tests**, 0 lint errors and 2 warnings, 0 type errors. The three new
  cases are `/new-age-leadership` running through `copy-restraint`'s three
  rules.
- Every browser gate green with the page in its list, at both widths.
  `qa:screens` carries one new named exemption, the org chart, for the reason
  above.

## 2026-09-01

- rolled from 06_CURRENT_STATE.md: the two entries dated 1 September 2026 ("the questions are a stack, and two gates were lying", "split what does several jobs"), verbatim and in the order they stood, headings demoted one level.

### Added on 1 September 2026: the questions are a stack, and two gates were lying

Krish sent two screenshots from streamwave.ai as the reference for not putting
everything on screen at once, and asked for a view before anything was built.
The investigation changed the answer twice, so the record has to carry both
corrections rather than the conclusion alone.

#### What the reference actually is

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

#### The first correction: our density readings were wrong

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

#### What was actually wrong, measured

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

#### The second correction: the entrance gate was reporting a defect it caused

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

#### The stack

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

#### Baselines after this change

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

#### Still open

`/new-age-leadership` (340KB) and `/blog/:slug` (124KB) remain lazy against a
348KB entry bundle. That is deliberate and it is not known to cost anything: the
entrance gate reads clean on the routes it covers, and these two were never
measured. They should be, before anyone assumes either way.

### Added on 1 September 2026: split what does several jobs

Krish's read of the live site on a phone: he could not tell what to do, it still
felt like walls of scrolling, nothing about it was delightful, and `Start here`
offered no choice between the two doors. He named heylemon.ai for how its
components build as you scroll, and asked for tests at every screen size.

Two of the four things measured before the work changed the brief.

#### The reference does not do what the rule said

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

#### What our sections actually were

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

#### The proof became a card index

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

#### The fork at the button

`BriefRoute` has been `home | brain | gtm` since the doors existed, and
`LeadBrief` has held a different set of four pressure questions for each. Every
`Start here` passed no route, so `PRESSURES.default` answered for everybody: a
generic set belonging to neither door. The homepage now offers the two doors by
name in one control group, the address carries which (`?start=brain`), and the
dialog asks when it is opened without one. `scripts/qa/one-way-in-check.mjs`
learned the new rule rather than being slipped past it by the rename: it now
counts ways in rather than words, and a fork is one only when it is exactly two,
adjacent, in a `role="group"`.

#### The tap state, which was live

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

#### The gate Krish asked for

`scripts/qa/screen-matrix-check.mjs`, `npm run qa:screens`. Eight sizes from
360x800 to 1920x1080, three pages, four questions each: no section past budget,
no sideways scroll, no text clipped inside a box that cannot be reached, and no
fixed chrome over the primary action. It knows that a `<details>` fold and a
`[role=group][tabindex]` drum both clip on purpose and hand the reader a way
back in, so it does not report the questions stack or the thirty-three voices as
defects for working.

#### Baselines after this change

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

#### Still open

- The three-question form on `/ai-brain` runs 1.88 screens and is exempt by
  name. Making it two steps would fix the height and change a working
  conversion surface, which is a decision rather than a fix.
- `/new-age-leadership` and `/blog/:slug` are still lazy against a 348KB entry
  bundle, and were never measured for the hydration cost.

## 2026-08-30

- rolled from 06_CURRENT_STATE.md: the three entries dated 30 August 2026 ("the pages are rendered, not imitated", "the homepage had no tonal range and no imagery", "one ask everywhere, and a gate that can see a build"), verbatim and in the order they stood, headings demoted one level.

### Added on 30 August 2026: the pages are rendered, not imitated

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

#### Four defects found while verifying it, none of them visible

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

#### The entrance, measured against the build it replaces

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

#### The gate that would have caught it

`scripts/qa/first-second-check.mjs` now reads the browser's error stream as well
as its frames. Proven against a deliberately broken build, with the Suspense
markers stripped out of one page: at 1440 the frames caught it as a replacement
and at 390 they saw nothing at all, because the rebuild landed on markup that
looked the same. A gate that only photographs a page cannot tell a working
render from a discarded one.

`src/test/ssg-hydration.test.tsx` renders both trees and compares the strings,
which is the check that catches a divergence before it reaches a browser.

### Added on 30 August 2026: the homepage had no tonal range and no imagery

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

#### What scrolling it on a phone actually measured

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
busiest 0.05% of pixels, about a 25 by 25 patch. One instrument mark ticking
certified an otherwise static screen of text.

Three causes, all confirmed in the code. The homepage carried **none** of the
four scroll-built section components; `ClimbLadder`, `ProcessTrack`,
`LeverPanel` and `StoryFigure` were all on other pages. There was no tonal
range: ink and raise are 1.32:1 apart and the page alternated between them for
its whole length, while paper, a full inversion, built and tested, was used
once in the entire application. And below the hero there was no imagery at all
for five screens.

#### What changed

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
  figure data in `rebuildProof.ts`, a span, an offer and a count, with real
  numbers, and the card rendered only the small mark for the shape and threw
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

#### Two defects found by looking rather than by any gate

**The founder photograph was decapitated on a phone.** `max-width: 330px` from
the desktop rule and `height: auto` from the base rule were both still in force
inside the mobile query, so a 670x861 source resolved to a 330x320 box; `cover`
overflowed 104px and `object-position: 60% 28%`, above centre, pulled the
window toward the top of the frame and cut about 29 CSS pixels off a photograph
whose subject's head starts about 90 source pixels down. The `60%` was inert:
there was no horizontal overflow for it to distribute. The crop is declared now
and biased to the top; verified at 360, 390 and 430.

**The cookie notice was 109px, thirteen percent of the screen**, floating over
the content from sixty percent of the first viewport until dismissed, and it is
in five of the ten screenshots taken while reading the site on a phone. It sits
above the mobile action bar now rather than over the reading.

#### The gate reads spread now, and is red

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

### Added on 30 August 2026: one ask everywhere, and a gate that can see a build

#### The lead flow had two front doors

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
browser and do the job they already do on `/ai-gtm`, they are what the offer of
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
  every back-button return into the dialog, the one route the site's own
  primary action produces. Confirmed against the deployed build before fixing,
  so it is not a regression from this round. `useLeadBriefHistory` matches the
  server on the first render now, as `use-mobile` does, and `/?start=1` is in
  the entrance gate's default path set because neither that gate nor
  `ssg-hydration.test.tsx` covered a query-parameter state.

#### The gate was asking the scroll builds to be something else

Six of the fourteen still viewports sat on `ClimbLadder`, `ProcessTrack` and the
fork band. Those are position-driven: they build as you scroll and are correctly
static when you stop, which is what `03_DESIGN_CONTRACT.md` asks of them. The
at-rest pass photographs a stopped page and can only ever see the ambient layer,
so the only way to satisfy it there would have been to decorate them.

`scrubbedThirds` already read the state of every scroll-driven element; it now
reports where each one sits, and a viewport is alive if something moves in it at
rest **or** something in it builds as you scroll through it.

#### And it was flaky, which matters for every number before this

The plate light sweep is a 9.5 second cycle that parks for about 4.3 of them.
The gate took three frames 900ms apart, spanning 1.8 seconds, which fits inside
that park. Measured three times on the same unchanged page, `/ai-brain @6300px`
read 0.125 with 2 cells moving, then 1.611 with 23, then 1.474 with 24. The
window is five frames over 6.4 seconds now, and the same viewport reads 0.98 to
1.12 across three runs.

**So the readings in the section above this one were taken with a window that
could miss a slow sweep**, and are only trustworthy where the motion was
continuous. The homepage's before-and-after figures are safe on that count, a
film and a drum move constantly, but the near-zero readings on quiet sections
may have been quieter than the page was.

#### Where it stands

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
argument section, whose event is the ground inverting, a large change to scroll
into and one an at-rest photograph cannot see.

## 2026-08-29

- rolled from 06_CURRENT_STATE.md: the verification baselines as last measured on 29 August 2026 (the section that stood between the lead and data backend and the names table until 7 September 2026), then the seven entries dated 29 August 2026 ("the lead dialog had no shape", "Proven live", "the entrance was three pages in a row", "three gates had never run on a phone", "the aliveness pass is thinner than it reads", "the phone finished its climb before reading it", "arrival, and what it is not for"), verbatim and in the order they stood, headings demoted one level.

### Verification baselines

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

### Repaired on 29 August 2026: the lead dialog had no shape

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

### Proven live, 29 August 2026

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

### Repaired on 29 August 2026: the entrance was three pages in a row

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

#### What is still outstanding

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

#### A note on the instrument

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

### Corrected on 29 August 2026: three gates had never run on a phone

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

### Measured on 29 August 2026: the aliveness pass is thinner than it reads

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

### Repaired on 29 August 2026: the phone finished its climb before reading it

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

### Added on 29 August 2026: arrival, and what it is not for

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

#### What the backstop had to become

The first version guaranteed "readable if the reveal never fires" with a
two-second timer. Measured in a browser, every element on the page was revealed
before a reader had scrolled to one, so no arrival ever happened. It was also
the weaker promise: a moment, rather than the reader's own position.

It is a scroll pass now, one passive listener for the page, doing the observer's
job by hand. A silently broken observer costs nothing, because an element is
revealed by the time it can be seen. Proven in a browser at 390: pending at the
top, shown on arrival, no attribute at all under reduced motion, and 1076
characters of the page's copy reaching a reader with JavaScript disabled.

## 2026-08-11

- rolled from NOW.md: 2026-08-11 to 12, pre-rebuild (`cda3c70`, pull requests #136, #137): one 21-day Sprint and a fit-call action retired, ten orphaned routes redirected, dead Builder Economy links retired. Every offer named in those commits is retired by canon and stays retired.


<a id="2026-09-24-redesign-documentation-consolidation"></a>
## 2026-09-24 - redesign documentation consolidation

Append-only archival transfer authorised for the completed redesign. The twelve source documents below are preserved in full, including superseded status, exact owner wording, failed checks, corrections, hashes and evidence locations. They are historical records, not current instructions. Current operational truth remains in `project-documentation/06_CURRENT_STATE.md`; accepted design and change guards remain in `project-documentation/website-redesign/STATE.md`. This local archive does not claim a write to the cross-venture Decision Ledger.

Archived from repository revision `0d458c9b5eef8946efb7c09b9b30ca86dbf3bb71`. SHA-256 values describe raw UTF-8 source bytes immediately before consolidation. Each fenced body preserves those exact bytes; source-relative links inside it are historical and resolve relative to the recorded original path. Existing history above is retained without editorial changes.

<a id="archive-2026-09-24-homepage-redesign-brain-award-panel-r1-md"></a>
### Archived source: project-documentation/homepage-redesign/BRAIN_AWARD_PANEL_R1.md

Source path: `project-documentation/homepage-redesign/BRAIN_AWARD_PANEL_R1.md`  
Raw SHA-256: `bac240bd2afee5583f49a497b8cdd4ac4ddb1ad328f6343af44ba8c5cc2c1322`  
Source bytes: 4440

<!-- BEGIN VERBATIM project-documentation/homepage-redesign/BRAIN_AWARD_PANEL_R1.md -->
``````markdown
# AI Brain route award panel, round one

Date: 15 September 2026  
Rendered candidate: `prototypes/ai-brain-vnext-r1/`  
Rubric: `quality/award-panel/rubric.v1.json`

## Method

The ten assignments were judged separately across desktop and mobile. Judges received only the rendered candidate, neutral rubric, assigned viewports and browser evidence. They did not inspect repository source, owner reactions, iteration history or another judge's result. After the first verdict, only the evidenced failures were corrected and the owning judges rechecked those gates. Visual scores below are the conservative pre-correction values; later pacing, label and landscape-legibility corrections did not lower them.

## Final scorecard

| Surface | Assignment | Score |
|---|---|---:|
| Desktop | Art direction | 8.5 |
| Desktop | Inspiration and originality | 8.6 |
| Desktop | Immersion and interaction | 8.8 |
| Desktop | Buyability and trust | 7.7 |
| Desktop | UX, content and technical | 8.7 |
| Mobile | Art direction | 8.4 |
| Mobile | Inspiration and originality | 8.5 |
| Mobile | Immersion and haptic | 8.7 |
| Mobile | Buyability and trust | 7.7 |
| Mobile | UX, content and technical | 8.7 |

- Desktop surface score: **8.46**.
- Mobile surface score: **8.40**.
- Ten-assignment mean: **8.43**.
- Lowest individual assignment: **7.7**.
- Final band under the repository rubric: **Award shortlist**.

It is not a world-class winner under this rubric: that band requires each surface to reach 8.6 and every judge to reach 8.0.

## Hard gates

| Gate | Final result | Rendered evidence |
|---|---|---|
| Truth | Pass | Prototype status is explicit; company-read copy describes readiness, not a completed operation; the proof claim is no broader than the disclosed founder report. |
| Primary task | Pass | The preview completes and “Continue to the live brief” opens `/ai-brain?start=brain` with the production company step visible. |
| Responsive integrity | Pass | Nine fixtures, including 901/900 boundaries, 834 intermediate, 320 portrait and 844 landscape, have no material clipping, overlap, horizontal overflow or unreachable action. |
| Keyboard and focus | Pass | Menu state is exposed; focus enters, advances, traps and restores logically; invalid fields retain focus; the proof disclosure works by keyboard. |
| Motion safety | Pass | Reduced motion exposes all four decision states as a semantic static sequence, hides paused films and runs no animations. |
| Critical failure | Pass | All rendered controls and the production handoff resolve without runtime or HTTP failure. |

## Failures found and corrected

1. Intermediate drawer type crossed the progress rail. The drawer now uses a three-row layout, container-relative type and a measured 960-pixel composition boundary.
2. The form was initially inert. Empty and malformed input now produces linked recovery; valid input advances through You and the preview.
3. The preview implied a company read without performing one. Status language now describes the live handoff truthfully.
4. The preview ended with only Start again. It now links to the real Brain brief and the browser gate verifies the destination opens.
5. The public proof claim exceeded its disclosed quote. The visible claim is now limited to the founder-reported frequency change and recurring bottlenecks.
6. Reduced-motion mode visually and semantically hid three states. It now renders all four once in a static vertical sequence.
7. The pinned sequence was overlong, mobile state labels were faint and landscape auxiliary type was compressed. The scroll span was reduced and those labels were strengthened.

## Remaining ceiling

There is no P1 or hard-gate blocker. Two commercial limitations keep this below winner territory:

- proof is still a single identity-withheld founder report without independent corroboration;
- the prototype-to-live handoff intentionally saves nothing, so the visitor re-enters their email in the real brief.

Publishing price, duration or a speculative product ladder is not proposed as a score-fixing tactic; the current public product contract deliberately keeps those private.

## Reproduction

- Run `npm run qa:ai-brain-prototype` against the local server on port 4192.
- Expected result: nine viewport records and `"failures": []`.
- Captures: `C:/Users/krish/.scratch/mindmake-ai-brain-vnext-r1/`.
- Paired review: `prototypes/ai-brain-vnext-r1/review.html`.
``````
<!-- END VERBATIM project-documentation/homepage-redesign/BRAIN_AWARD_PANEL_R1.md -->

<a id="archive-2026-09-24-homepage-redesign-brain-concept-trace-md"></a>
### Archived source: project-documentation/homepage-redesign/BRAIN_CONCEPT_TRACE.md

Source path: `project-documentation/homepage-redesign/BRAIN_CONCEPT_TRACE.md`  
Raw SHA-256: `6859445e88a479651e736ccaafbe7528209b39428056d37f9c45e870ecd3ee05`  
Source bytes: 9631

<!-- BEGIN VERBATIM project-documentation/homepage-redesign/BRAIN_CONCEPT_TRACE.md -->
``````markdown
# AI Brain route concept trace

This record makes the first material AI Brain route mock reproducible. Krish accepted the material direction on 15 September 2026; the corrected isolated prototype remains the implementation reference, not a production release.

## Brief and product truth

- Source analysis: `C:/Users/krish/Downloads/Making the AI Brain and AI GTM Irresistibly Tangible.md`.
- Commercial crossing: a leader brings one consequential decision; Mindmake prepares it with the leader's standards, challenges it with evidence, carries the decision into work and keeps the useful judgement attached to what happened.
- Public offer boundary: preserve the two doors and one paid proof. Do not publish a product ladder, duration, price or speculative guarantee.
- AI Brain distinction: it sharpens a real decision and leaves the reusable judgement running. AI GTM will take a decision into customer reality and return the learning.
- Review rule: every material mock is paired at desktop and mobile. Mobile must be a designed composition, not a stacked desktop.

## Structural divergence

Three spines were pressure-tested before rendering:

| Candidate | Sequence | Primary interaction | Information structure | Disposition |
|---|---|---|---|---|
| A, Decision Desk | one decision moves through Prepared, Challenged, Decided and Kept | reversible scroll plus direct state selection | one persistent decision sheet changes state | selected for material mock |
| B, Decision Cabinet | retained standards are browsed before a new decision is opened | inspect and open archival drawers | judgement library first, current decision second | rejected: explains the mechanism before the buyer's outcome and returns to drawer-heavy IA |
| C, Decision Fork | visitor chooses between competing strategic options and sees projected consequences | option manipulation | branching simulation with a generated recommendation | rejected: demands participation before comprehension and risks technology theatre |

Pairwise distance:

- A versus B differs on current-decision-first versus archive-first sequencing, scroll-state transition versus object browsing, and one changing sheet versus a collection.
- A versus C differs on authored decision movement versus visitor simulation, reversible explanation versus input-led branching, and evidence retention versus projected outputs.
- B versus C differs on historical inspection versus future projection, free-order browsing versus forced choice, and library state versus simulation state.

The initial concept selection was made before blind judging. After owner acceptance, independent rendered judges reviewed visual direction, inspiration, immersion, UX and commercial readiness separately on desktop and mobile. Their evidence and the correction loop are recorded in `BRAIN_AWARD_PANEL_R1.md`.

## Selected material mock

- Artifact: `prototypes/ai-brain-vnext-r1/`.
- Opening: film-led cabinet room with “Your AI brain begins with a real decision.”
- Instrument: one illustrative decision moves through four reversible states: Prepared, Challenged, Decided and Kept.
- Proof: approved R-05 evidence only—publishing reduced from days to under an hour, moving from roughly monthly to most days.
- Retained value: the decision, evidence, correction and accepted standard remain attached rather than becoming an abstract “knowledge base”.
- Close: one Start here action opening the already approved company-first drawer.
- Responsive split: desktop uses a fixed state rail and large decision sheet; mobile uses a horizontal state control and a full-width sheet. Neither treatment inherits the other's column structure.

## Feasibility and evidence

- Existing assets: repository-owned film-02 and film-05 loops; no new remote dependency.
- Interaction: local CSS and JavaScript only; the start sequence is explicitly labelled as a prototype and does not imply that a data submission, account connection or company read has already run.
- Reduced motion: the four states become static readable panels.
- QA viewports: 1440 by 900, 1024 by 768, 901 by 700, 900 by 700, 834 by 814, 390 by 844, 375 by 812, 320 by 568 and 844 by 390.
- Passed: zero horizontal overflow, no clipped action, no spidery headline, minimum 44-pixel controls, reversible state selection, one visually and semantically exposed state, early-scroll persistence, linked validation recovery, truthful prototype status, useful focus movement, menu disclosure state, proof disclosure, Escape and focus restoration, drawer bottom reserve, reduced-motion readability and paired desktop/mobile presentation.
- Measured page length: 6.92 desktop and tablet screens, 7.76 at the 900/901 drawer boundary, 7.47 at 834 by 814, 7.11 at 390 by 844, 7.13 at 375 by 812, 7.51 at 320 by 568 and 7.30 in shallow landscape. The length contains a single evolving instrument rather than repeated explanatory sections.
- Screenshot evidence: `C:/Users/krish/.scratch/mindmake-ai-brain-vnext-r1/`.

Artifact hashes:

- HTML: `679d1a523c5c5fcc9732b2d168282c1be386dc4b6cb1f6f7ea4a8e3fc188f99f`
- CSS: `14ba2a06dad1559bc2a829f7928e5b589b39a79ab60a8f8aee244d8b8e019afe`
- JavaScript: `24c80eccbd737745d46f1ba0292c70e814f36f960cb2ff17572ba51f2e108f3b`
- paired review: `472fa69c7ff5c91ab9678e6ea1b9ff6f958a16da40b2d8a521192c2cc18939c7`
- browser gate: `e5ea4503c368b471f8503c3810095374b9a5de0ad26ff9ac49cefedbbfff08a5`

## Approval state

Material direction accepted and the responsive correction passes its nine-viewport gate. Production `AiBrain.tsx` is unchanged. Local production implementation, commit, merge, preview deployment, production deployment and release remain separate gates.

## 2026-09-15, r2 makes the actual Brain visible

STATUS: isolated material extension ready for owner review. Production remains unchanged.

OWNER DIRECTION: show the AI Brain in action using the existing Brain repository rather than leaving the public route at an abstract four-step decision metaphor.

SOURCE CONTRACT:

- `C:/Users/krish/dev/mindmaker/Brain/g13-demo-brain-fixture.json`;
- `C:/Users/krish/dev/mindmaker/Brain/g13-living-brain-contract.json`;
- `C:/Users/krish/dev/mindmaker/Brain/g13-living-brain-physical-contract.md`.

DECISION: retain the accepted living scroll mechanism, but repurpose its four reversible states as actual Brain views: Portrait, Map, Evidence and Change. Remove the separate ownership chapter rather than adding another section. This shortens the route by roughly one viewport and lets interaction carry the explanation.

TRUTH BOUNDARY: the visible Brain is explicitly labelled “Illustrative Brain · synthetic demo”. Counts, meanings, source relationships, version correction and share boundary come from the synthetic fixture. It is not presented as a customer record, production account or live data connection.

RESPONSIVE AUTHORSHIP:

- desktop: a spatial relationship map connects five meanings around one central synthesis;
- mobile: the same meanings become a touch-sized two-column inspection surface rather than a squeezed map;
- shallow landscape: the core meaning and four related meanings become a compact three-column instrument;
- reduced motion: all four Brain views render sequentially as static, readable content while the hero retains its poster image.

VERIFICATION: `scripts/qa/ai-brain-prototype-r2-check.mjs` passes nine viewports with zero failures. It checks opening scroll persistence, horizontal containment, title line discipline, minimum control size, every Brain view, map inspection state, proof disclosure, drawer geometry and validation, live brief handoff, reduced-motion semantic exposure and paired review. Additional compact and shallow-landscape captures cover all four states. Evidence is under `C:/Users/krish/.scratch/mindmake-ai-brain-vnext-r2/`.

ARTIFACT HASHES:

- HTML: `02f255d0b8c2416d4f77ce7ebc638d6a6e243bc5e94a55d4183c7685fadd3f41`
- CSS: `658f3d6eece480a226a3397948638c8f0666971198dcf74702b18cf225c9865a`
- JavaScript: `790f9f7d3d25e7dd2b5ff3e8a08cf083084334c4271d6cf9401e797059b094ea`
- paired review: `52b1df0bbde5aac3df2d81f86e953df820f0c87e95d5ff77f6a215611a417e8b`
- QA gate: `6e29d138fd923a27dffba1527e75155833a28f8f3905abcf2293a55a9ebff133`

BLIND CORRECTION LOOP: the first panel rejected the prototype because its old production jump discarded the entered company and person context, transition geometry could shear display type, non-canonical fixture labels contradicted the approved contract, the repair claim was overbroad, the proof headline outran its evidence and truth-bearing mobile metadata was too small. The corrected flow now keeps company, person, role and decision in one truthful prototype receipt; panels fade without horizontal type movement; map and relationship labels use canonical vocabulary; the repair receipt separates automatic private rebuilds from human review for consequential or shared work; proof copy is limited to the founder-reported publishing outcome; and the close names the paid proof, working first version and buyer ownership.

INDEPENDENT VERDICTS:

- rendered award judge: SHOW, 8.4 desktop and 8.2 mobile;
- commercial and contract judge: SHOW, 89/100 desktop and 85/100 mobile;
- responsive QA rejudge: A, SHOW, no P1 or P2 findings across the full nine-viewport gate.

RESIDUAL CEILING: the public outcome is anonymous and self-reported, so it supports the offer without independently validating the Brain. A transient sticky-exit polish issue was classified P3 and does not reopen the concept.

NEXT ACTION: show the paired artifact. Any production port remains a separate approval gate.
``````
<!-- END VERBATIM project-documentation/homepage-redesign/BRAIN_CONCEPT_TRACE.md -->

<a id="archive-2026-09-24-homepage-redesign-concept-trace-md"></a>
### Archived source: project-documentation/homepage-redesign/CONCEPT_TRACE.md

Source path: `project-documentation/homepage-redesign/CONCEPT_TRACE.md`  
Raw SHA-256: `87b73e2cb4e2653cf226f905780a95dcb73a8134f67e441d6648ed53394f7d29`  
Source bytes: 7590

<!-- BEGIN VERBATIM project-documentation/homepage-redesign/CONCEPT_TRACE.md -->
``````markdown
# Homepage concept trace

This record makes the reset reproducible. It does not turn a judge preference into owner approval.

## Brief

- Sanitised brief: `SANITIZED_BRIEF.md`
- Brief revision: 2026-09-13
- SHA-256: `ba36e37a12bbad4edbb8edc61db42a969f3b0bad9e93af92a3202828b753a8dc`
- Production reference revision: `2d8caff1874b4b568fa89980304f736b81b05d07`

## Divergence round one

- Generator outputs: candidates A, B and C in `candidates/`.
- Result: rejected before rendering.
- Pairwise finding: two independent judges found A and C to be the same diagnostic workbench structure with different metaphors.
- Reset decision: a second generator round received three missing structural territories instead of revision notes on the first concepts.

## Divergence round two

| Generator | Candidate | Territory | SHA-256 |
|---|---|---|---|
| `concept_proof_object` | D, The Proof Bench | proof as navigation object | `038a7e552051ac1ec303534e5fe0d01f5a5095487cac707000cb802094cb4d4a` |
| `concept_spatial_object` | E, The Decision Cabinet | one bounded spatial object | `998f4dc2efd7267b9d9c3a88f394c089adfac93992dfab897cffcb9784ee5b8d` |
| `concept_decisive_transition` | F, The Threshold Room | immediate route destinations and decisive replacement | `99255b9a03680bb1c629dab42f1045b5722449daf82cda8e3a16348790c9aa21` |

Pairwise distance passed in both verdicts:

- D versus E differs on the proof inspection sequence, free-order agency, primary control, page structure and retained state.
- D versus F differs on proof-first versus route-first sequencing, manipulation versus commitment and scrolling continuation versus replacement state.
- E versus F differs on free-order compartment inspection versus one consequential route choice, persistent spatial map versus a dedicated destination and mutually exclusive drawers versus route history.

## Independent judging

| Judge | Candidate order | Winner | Runner-up | Diversity | SHA-256 |
|---|---|---|---|---|---|
| `judge_three` | E, D, F | F | E | pass | `3ca1830a509c86819d5d64bbcd223f56009bc3b2a55a086d5c02761cdcee11e6` |
| `judge_four` | F, E, D | F | D | pass | `cc93191de03861931c4cff56656d9c63c9556f5e87a2cbfe327c94a0c16a1fb9` |

Disguised repetition finding: E risked recreating the rejected diagnostic workbench through a central content switcher. D risked restoring the rejected long chapter continuation and repeated door group. F remained distinct only if the selected route replaced the shared state and its chamber stayed compact.

Constraint regression finding: both judges failed E on 320 by 568, 844 by 390 and enlarged-text feasibility. Both failed D on first-viewport information density and route clarity. F passed subject to rendered proof of adjacent labels, history, focus behaviour and small-screen fit.

Discarded strengths to restore: the private-observatory atmosphere, archival imagery, confident Archivo and Newsreader contrast and one meaningful light-to-dark transition. The long chapter stack, delayed action, repeated choice state, dense proof and hidden controls stay discarded.

No tiebreaker was required because both fresh judges selected F and passed the set's diversity gate.

## Selected synthesis

- Spine: candidate F.
- From D: one compact, route-specific causal receipt showing standards or expertise in, a working object and the observed result. No drag control and no sticky afterlife.
- From E: walnut, brass, paper and fixed spatial discipline. No cabinet dashboard and no drawer-based homepage navigation.
- Opening state: practice, buyer, plain distinction, Brain and GTM and the shared paid-proof line in one viewport.
- Route state: route-specific heading, one distinction, one approved outcome, what remains working and one Start here action.
- Start state: a right-side drawer on larger screens and full-screen sheet on phones, with one question at a time. Prototype data stays local and nothing is sent.

## Feasibility and rendered evidence

- Isolated artifact: `prototypes/homepage-vnext/`, not imported into the application.
- Artifact revision: `homepage-vnext-r2-mobile`, 2026-09-13.
- HTML SHA-256: `2ba6ee81152deda2ec0148c7d72c3f98279f76607d7d0013d5c3bb695886d780`
- CSS SHA-256: `f3fdaf5dfad0c6876276c4dcf645f834d6d6b9903bfc368fc92d6bce7a1be093`
- JavaScript SHA-256: `01be166b2564d54643d7d41eb7b7788a50373c0e9af62ac6b50b0fbb919450b6`
- Browser suite: `scripts/qa/homepage-prototype-check.mjs`.
- Browser suite SHA-256: `a2b0257ed72139ea8c7a57b96a79e30ab822bae8989ae19830de94eca3b4be62`.
- Render targets: 1440 by 900, 1024 by 768, 390 by 844, 320 by 568 and 844 by 390.
- Passed checks: one-screen opening state, no horizontal overflow, both route actions in the first viewport, mobile-specific stacked route controls, mobile claim-to-control separation, minimum 44-pixel targets, Menu in natural Tab order, overlay focus trap, focus restoration, route history, Escape, reduced motion, 200 percent text reflow, route-heading line count, one-word orphan prevention, line-width balance and spidery text-flow prevention.
- Presentation path: direct local file URL, with no temporary server dependency.
- Repository checks: all concept and verdict schemas pass; `git diff --check` passes; the production typecheck, client build, SSR build, sitemap, llms and prerender pipeline completes.
- Screenshot evidence: `C:/Users/krish/.scratch/mindmake-homepage-vnext/`.
- Paired review evidence: `homepage-vnext-r2-desktop-1440x900.png`, `homepage-vnext-r2-mobile-390x844.png` and narrow-state `homepage-vnext-r2-mobile-320x568.png`.
- Production application at the approval point: unchanged by the prototype.

## Local production port

- Ported after Krish's explicit approval, without commit, merge or deployment.
- Production root: `src/pages/Index.tsx`, SHA-256 `b826ad851da6bff07d3a3972d86d5ad904ddea421b47c944e8965735738b8f78`.
- Isolated homepage system: `src/styles/mindmake-home-vnext.css`, SHA-256 `3af07ac577fc093164986ab6b469bdf09a2f046d1bbe6657d2aa62506ed09391`.
- Fidelity contract: `quality/homepage/approved-vnext-r2.json`, SHA-256 `a1e46f9ee2e2ea2c41825b458eafa31fc156d56a02d9e5609b77042154670eb2`.
- Production browser gate: `scripts/qa/homepage-fidelity-check.mjs`, SHA-256 `32e000a255f26386b4e5613d94531b4e9060b2519b9797742bdda24f39602869`.
- The simplified prototype Start state was not copied. The approved interaction now opens the existing lead journey as a right drawer on larger screens and a full-screen sheet on phones, with the chosen Brain or GTM route carried into it.
- The homepage is deliberately immediate and no longer waits behind the long-form route curtain. The entrance gate and homepage fidelity gate enforce that distinction.
- Built-output evidence: `C:/Users/krish/.scratch/mindmake-homepage-production/`.

## Revision count

- Concept reset rounds: two. The first was rejected; the second selected one spine.
- Post-selection material spine revisions: one. The mobile opening became a distinct full-viewport composition; the selected interaction spine and desktop treatment are unchanged.
- Render correction cycles: three, limited to hidden-state CSS, short-landscape fit, enlarged-text reflow, route-title composition and file-based presentation reliability.

## Approval state

Approved by Krish for local implementation on 13 September 2026 with “looks good, lets move ahead with this.” The approved scope is artifact `homepage-vnext-r2-mobile` across desktop, mobile, route replacement and Start here drawer or phone sheet states. Commit, merge, preview deployment, production deployment and release remain separate gates.
``````
<!-- END VERBATIM project-documentation/homepage-redesign/CONCEPT_TRACE.md -->

<a id="archive-2026-09-24-homepage-redesign-decisions-md"></a>
### Archived source: project-documentation/homepage-redesign/DECISIONS.md

Source path: `project-documentation/homepage-redesign/DECISIONS.md`  
Raw SHA-256: `68c2a2531c663ecec6e9d06afb4071a8c578ff5440127cbb36d06838a3bf03ca`  
Source bytes: 28910

<!-- BEGIN VERBATIM project-documentation/homepage-redesign/DECISIONS.md -->
``````markdown
# Homepage redesign decisions

Append-only record for decisions made during the homepage redesign. A candidate, recommendation or panel preference is not a lock. Only Krish can approve the material rendered surface.

## 2026-09-13, exploration opened

Status: active, not locked.

Decision: stop iterative repair of the current homepage composition and run fresh concept divergence before producing a new mock.

Reason: the current production panel separates strong art direction and originality from materially weaker mobile interaction, commercial clarity and information architecture. Further local polishing would preserve the mechanism causing the gap.

Approval scope: Krish authorised concept and prototype work with “Ok go”. This does not authorise production implementation, commit, merge or deployment.

Revisit trigger: independent concept judging fails the diversity gate or no feasible concept meets the commercial, brand and accessibility invariants.

## 2026-09-13, first concept round rejected

Status: rejected, not locked.

Decision: do not prototype candidates A, B or C.

Reason: both independent judges failed the set's diversity gate. Candidates A and C used the same diagnostic workbench structure under different metaphors. Candidate B was materially different but introduced interaction before route commitment and carried small-screen crowding risk. A winner vote cannot rescue an invalid comparison set.

Revisit trigger: none. Any useful quality must return through a structurally different concept, not a repair of this round.

## 2026-09-13, second concept round selected for prototype

Status: selected for prototype, not approved for production.

Decision: use candidate F, The Threshold Room, as the interaction spine. Use candidate D's causal proof sequence inside the selected route. Use candidate E's physical discipline only as art direction, not as its drawer-based information architecture.

Reason: two fresh judges, in different candidate orders, independently passed the diversity gate and selected F. Both found it the clearest and easiest to buy because Brain and GTM are immediate destinations and the selected route replaces the shared state. Both failed E on short-screen and enlarged-text feasibility. Both failed D on first-viewport density and delayed route clarity.

Rendered interpretation: one contained arrival screen, two adjacent route doors, one decisive light-to-paper transition, one route-specific proof receipt and a progressive Start here drawer. The route is a page state with browser history, not a trapped modal. Production code and the live lead flow are untouched.

Approval boundary: Krish must approve the rendered surface cold before any production implementation. Commit, merge and deployment remain unauthorised.

## 2026-09-13, paired responsive treatments required

Status: active review rule for this redesign.

Decision: every material Mindmake website concept and revision must be presented as a matched desktop and mobile treatment. Essential interaction states must appear in both when they are part of the decision.

Reason: Krish's first reaction to the threshold prototype was positive, followed by the direct instruction to show both mobile and desktop treatments in future. A desktop-only review defers a material design decision and makes mobile quality impossible to judge at the approval wall.

Scope: Mindmake website review artifacts. This does not by itself make the rule cross-venture doctrine.

Revisit trigger: Krish explicitly changes the review format for a named surface.

## 2026-09-13, route typography and prototype delivery corrected

Status: corrected frame-level execution, not a production lock.

Exact reaction: “prototype does not load” and “make sure text never spiders over awkwardly like this screen shot, it should be sized thoughtfully”.

Classification: frame-level execution and presentation reliability. The selected Threshold Room interaction spine is unchanged.

Decision: route display headings use authored semantic line groups, bounded viewport-aware scale, balanced wrapping, normal word breaking and fixed mobile content gutters. Supporting display copy is capped against narrow-screen spidery wrapping. The prototype and its browser suite open directly from the local HTML file rather than depending on a temporary HTTP process.

Acceptance: Brain and GTM headings must stay within the viewport, use no more than three lines, never end in a one-word orphan, and maintain at least 42 percent line-width balance. Key route copy must not produce three consecutive one-word lines. These conditions apply at 1440 by 900, 1024 by 768, 390 by 844, 320 by 568, 844 by 390 and the 200 percent text fixture.

Approval boundary: this correction is shown as paired desktop and mobile evidence. Production implementation, commit, merge and deployment remain unauthorised.

## 2026-09-13, mobile homepage becomes a distinct composition

Status: material same-spine revision in progress, not locked.

Exact reaction: “Nice, I generally like it, but am keen to see what the homepage looks like on mobile” and “without just squashing the desktop version”.

Classification: responsive behaviour and visual hierarchy. This is the first material revision within the selected Threshold Room spine.

Decision: render the mobile homepage opening as its own primary composition while preserving the same product truth, two route choices, route replacement interaction and desktop treatment. Present the revised mobile opening beside the unchanged desktop reference before explaining the design response.

Approval boundary: the revision remains an isolated prototype. Production implementation, commit, merge and deployment remain unauthorised.

## 2026-09-13, homepage direction locked

Status: approved for local implementation, not approved for release.

Exact approval: “looks good, lets move ahead with this.”

Decision: lock artifact `homepage-vnext-r2-mobile` as the homepage direction across desktop and mobile. The lock covers the opening composition, the Brain and GTM route choices, route-state replacement with browser history, the compact route-specific proof state and the Start here drawer or phone sheet.

Locked artifact hashes:

- HTML: `2ba6ee81152deda2ec0148c7d72c3f98279f76607d7d0013d5c3bb695886d780`
- CSS: `f3fdaf5dfad0c6876276c4dcf645f834d6d6b9903bfc368fc92d6bce7a1be093`
- JavaScript: `01be166b2564d54643d7d41eb7b7788a50373c0e9af62ac6b50b0fbb919450b6`
- browser suite: `a2b0257ed72139ea8c7a57b96a79e30ab822bae8989ae19830de94eca3b4be62`

Reason: the revision gives mobile its own composition, makes the two routes immediate, keeps the page bounded, preserves the physical instrument world and avoids reducing the mobile experience to stacked desktop columns.

Carry-forward conditions:

- the approved desktop and mobile renders, hashes and interaction checks are the implementation fidelity contract;
- do not restore a long chapter stack, duplicate explanations, generic cards, an always-open form, desktop-to-mobile stacking or spidery typography;
- production may adapt mechanics to the current application architecture and real lead flow, but any material visual, interaction or meaning change needs a new paired rendered approval;
- no new public claim, price, duration, diary route or additional copy enters through implementation;
- a technically passing build fails this lock if it is denser, more generic, more verbose, less distinctive or weaker on mobile than the approved artifact.

Revisit trigger: the current application cannot reproduce the locked behaviour without a material conflict in product truth, accessibility or the real lead flow. Surface that conflict before changing the concept.

Approval boundary: local production implementation and verification are authorised. Commit, merge, preview deployment, production deployment and public release remain unauthorised.

## 2026-09-15, paired review and bottom-chrome safety made enforceable

Status: routine correction within the accepted start-flow spine, awaiting Krish's review.

Exact reaction: “good, but it does underlap the taskbar at the bottom. I also ALWAYS want to see how you design for mobile in EVERY mock, this feature in particular looked horrible previously”.

Classification: frame-level execution and review reliability. The progressive start-flow sequence, content and responsive interaction model are unchanged.

Evidence: the desktop prototype positioned the privacy and recovery line against the browser viewport rather than reserving space for the Codex app's bottom chrome. The 13 September paired-treatment rule existed in this record but had not been made a required review artifact, so a later mock was still presented desktop-first.

Decision: every material mock review opens on a paired desktop-and-mobile review surface and retains direct links to both live treatments. Saved paired evidence is part of the review packet. Responsive validation measures the entire bottom action rail, not only the primary button, against a system-chrome exclusion zone.

Acceptance: the complete action rail remains above the reserved bottom zone with no internal or horizontal overflow at 1440 by 900, 1024 by 768, 390 by 844, 375 by 812, 320 by 568 and 844 by 390. The revised render measures 48 pixels of bottom clearance at desktop, 28 pixels at 390 by 844, 14 pixels at 320 by 568 and 21 to 22 pixels in shallow landscape.

Approval boundary: `start-flow-vnext-r2` is a revised review artifact. It has not been ported into the production application. Commit, merge and deployment remain unauthorised.

## 2026-09-15, progressive start flow approved for local implementation

Status: approved for local production implementation, not approved for release.

Exact approval: “ok this looks good”.

Decision: lock `start-flow-vnext-r2` as the responsive interaction direction for Start here. The lock covers the company-first progressive sequence, desktop drawer, mobile phone sheet, compact native role selector, full action-rail bottom clearance and paired desktop-and-mobile review requirement.

Implementation boundary: port the approved behaviour into the real LeadBrief while preserving its existing validation, history, recovery and data-handling contract. Implementation may adapt mechanics to the application architecture but may not materially change copy, sequence, composition or responsive behaviour without a new paired review.

Approval boundary: local implementation and verification are authorised. Commit, merge, preview deployment, production deployment and public release remain unauthorised.

## 2026-09-15, progressive start flow implemented and locally verified

Status: implemented in the local application, awaiting Krish's paired desktop and mobile review.

Decision: the real LeadBrief now separates Company and You. The work email starts the existing public-company read; first name, last name and the existing eight-part division taxonomy are collected while it runs. The remaining Problem, Time, Brief, verification, retry and recovery contract is unchanged.

Responsive implementation: desktop uses the approved bounded right drawer. Mobile uses a full-width phone sheet. The full eight-option role set remains visible as chips where it fits and becomes a native selector on phones and shorter viewports. This is the smallest production adaptation needed to preserve the approved no-scroll composition without deleting real choices or shrinking controls.

Accessibility implementation: focus enters the first useful field on fine pointers and the step heading on coarse pointers, all page content behind the open drawer becomes inert and hidden from assistive technology, the mobile selector participates in the focus trap, errors remain linked to their fields, Escape closes the drawer and focus returns to the trigger.

Evidence: the focused LeadBrief and route-history suite passes 30 of 30 tests. Typecheck and the production build pass. Lint reports zero errors and the same two pre-existing fast-refresh warnings. The production-flow browser gate passes the company and personal-details states at 1440 by 900, 1024 by 768, 390 by 844, 375 by 812, 320 by 568 and 844 by 390 with no internal or horizontal overflow, no spidery heading, no target below 44 pixels, correct background isolation and the required bottom reserves. Final captures are under `C:\Users\krish\.scratch\mindmake-start-flow-implementation-2026-09-15-r5`.

Repository limitation: the full suite reports 456 passing and 8 failing tests. The failures are in unrelated answer-page content, discoverability metadata and an answer-route duplicate-heading case already present in the wider dirty worktree; none touches the start-flow files or its focused suite.

Approval boundary: local implementation only. Commit, merge, preview deployment, production deployment and public release remain unauthorised.

## 2026-09-15, AI Brain material route mock opened

Status: rendered for paired owner review, not approved for production.

Exact authority: “agreed, go”.

Decision: render the first material AI Brain route as one real decision moving through Prepared, Challenged, Decided and Kept. The interaction demonstrates the crossing from leader judgement to challenged decision to carried work to reusable standard. It does not expose a corpus, product ladder, process diagram or sequence of generic feature cards.

Commercial boundary: use the GTM analysis to make the result tangible, not to publish new offers or unsupported claims. The route retains the approved R-05 proof and the one-paid-proof public model.

Responsive boundary: the paired review is mandatory. Desktop uses a state rail and large decision sheet. Mobile uses a horizontal state control and full-width sheet; it is not the desktop composition stacked vertically.

Evidence: `project-documentation/homepage-redesign/BRAIN_CONCEPT_TRACE.md` records the structural alternatives, feasibility proof, QA targets, hashes and screenshot location.

Approval boundary: the isolated `ai-brain-vnext-r1` prototype is now at the cold owner-reaction wall. `AiBrain.tsx` remains unchanged. No production implementation, commit, merge or deployment is authorised.

## 2026-09-15, AI Brain route accepted and responsive drawer correction required

Status: direction accepted; routine correction and blind re-judging in progress.

Exact approval: “looks good, proceed”.

Exact correction: “there are some visual issues”, with a rendered drawer capture showing the question colliding with the progress rail at an intermediate frame.

Classification: frame-level responsive execution, not a change to the accepted Decision Desk concept.

Root cause: the drawer centred a fixed-height content stack and sized its display type from the page viewport. At intermediate width or compressed height, the overflowing stack rose above its own row and crossed the progress rail. The original QA set sampled either side of the failing geometry without testing the boundary itself.

Decision: make the drawer a three-row grid, keep every screen in normal flow beneath the progress rail, size display type from the drawer container, switch the route composition at its measured 960-pixel space requirement, and add explicit 901, 900 and 834-pixel fixtures. The primary action must also progress or produce linked recovery feedback; an inert button fails the award-panel critical-action gate even inside a prototype.

Acceptance: no rail/title overlap, internal scroll, clipped focus ring, undersized action, bottom-chrome underlap or horizontal overflow across the nine viewport fixtures. Early user scrolling cannot be reset after load. Exactly one decision panel is visually and semantically exposed at a time. Empty and malformed email states focus and announce the error; a valid email reaches the approved You state and a bounded completion state. The proof quote remains hidden until requested.

Approval boundary: this correction may be applied to the accepted isolated prototype and independently re-judged. Production route implementation, commit, merge and deployment remain separate gates.

## 2026-09-15, AI Brain correction clears the independent panel

Status: accepted prototype corrected and award-shortlist eligible; production route unchanged.

Decision: the responsive correction is the new `ai-brain-vnext-r1` reference. In addition to removing the intermediate rail/title collision, it closes the panel's truth, primary-task, focus, motion-safety and critical-action gates. The prototype now hands off to the real Brain brief rather than ending in a preview loop, and reduced-motion users receive all four decision states as static content.

Panel result: 8.46 desktop, 8.40 mobile and 8.43 across ten assignments. Every hard gate passes. The result is Award shortlist under `quality/award-panel/rubric.v1.json`; it is not labelled world-class winner because neither surface reaches 8.6 and the 7.7 commercial assignments remain below the winner's 8.0 individual floor.

Commercial ceiling: the remaining limit is evidence, not interface ornament. The public proof is a truthful but identity-withheld founder report, and the isolated prototype cannot preserve entered details into the live application. Neither limitation authorises invented proof, public pricing, a public duration or a speculative product ladder.

Evidence: `BRAIN_AWARD_PANEL_R1.md`, `BRAIN_CONCEPT_TRACE.md` and `C:/Users/krish/.scratch/mindmake-ai-brain-vnext-r1/`.

Approval boundary: no production `AiBrain.tsx` change, commit, merge, preview deployment or production deployment is included in this decision.

## 2026-09-15, accepted AI Brain direction implemented locally

Status: production route implementation complete and locally verified; awaiting paired owner review.

Exact authority: “I like this! continue”.

Decision: replace the long production `/ai-brain` chapter stack with the accepted `ai-brain-vnext-r1` composition. The route now makes one consequential decision tangible through Prepared, Challenged, Decided and Kept, reveals the founder's exact attributed outcome only on request, states ownership once, and opens the real LeadBrief as the approved responsive drawer.

Responsive implementation: desktop retains the state rail and large decision sheet. At the measured boundary mobile recomposes to a horizontal state control and full-width sheet. Compact portrait and shallow landscape have their own type and geometry constraints; this is not the desktop layout collapsed into one column. A paired production review surface lives at `prototypes/ai-brain-vnext-r1/production-review.html`.

Motion implementation: the held decision sequence remains the central scroll build. A slight proof-panel travel and close-block rise carry the build through the later page without adding copy, cards or spectacle. The film plate and drawers retain ambient life. Reduced motion removes the transforms and renders all four decision states as static content.

Performance boundary: the 60-second Film 05 proof is not mounted or fetched by the Brain route. The ownership section uses its poster and the existing lightweight plate drift, preserving life without charging every visitor for a four-megabyte WebM they did not request.

Evidence: `qa:ai-brain-fidelity` passes nine viewports with no failures. The built no-JavaScript gate reports no clipping. Aliveness passes at 390 and 1440. The focused route suite passes 67 of 67. Typecheck, production build and prerender pass; lint has zero errors and the existing two warnings. The full suite returns the pre-existing eight unrelated failures only. Captures are under `C:\Users\krish\.scratch\mindmake-ai-brain-production`.

## 2026-09-15, AI Brain route grid corrected after owner review

Owner correction: “still misalignments, why can't you fix things properly even though I have said this 3+ times now?”

Classification: design-system defect and acceptance-gate defect inside the approved route. The page sections used a 90rem composition while the shared footer retained the site's 1104px container. At 1440 pixels this put the footer 120 pixels inside the closing section's left edge. The existing route gate checked containment and header centring, but did not compare alignment anchors across section boundaries.

Decision: preserve the accepted composition and make `--brain-edge` the single horizontal grid contract for the route's header, hero, decision sequence, proof, ownership section, close and footer. Compact portrait and shallow landscape may change the value of that token, but may not introduce independent outer gutters. Add a deterministic cross-section anchor check with a maximum 2px spread at every supported viewport, plus rendered close-and-footer captures on desktop, mobile, compact portrait and landscape.

Evidence: the original screenshot reproduces the mismatch. After the repair, both the development route and the freshly built output pass all nine fidelity viewports with zero failures. Typecheck and production build pass. Lint reports zero errors and the same two existing warnings. The four dedicated close-and-footer renders were visually inspected. No copy, sequence, motion, drawer behaviour or offer meaning changed.

Approval boundary: local implementation only. No commit, merge, preview deployment, production deployment or public release is authorised.

## 2026-09-15, AI GTM concept reset selects a comparison spine

Status: selected for prototype, not approved for production.

Exact reactions: “surely you can look for yourself and see this is not ready to show me? everything is cut off and falling outside boxes” and “i dont get the awkward text wrapping for hero and sub hero text”, followed by the direction to use live examples and a business-question-anchored news layer.

Classification: the first revision failed responsive execution. The second retained the same explanatory press spine, awkward character-count-led typography and a disconnected signal layer. Two material challenges trigger a fresh concept reset rather than another local patch.

Decision: select The Countermove Table for one paired prototype. A dated market move becomes a fixed evidence boundary. The visitor compares three credible responses and sees Product, Price, Positioning and People change together before one route becomes a customer test. This replaces the rejected rail, tape, press and four-stop scroll sequence.

Evidence: three independent generators produced a visitor-operated signal instrument, a causal scroll crossing and a comparative decision room. Two fresh blinded judges, in different candidate orders, passed the diversity gate and independently selected the comparative concept. Both classified the other two as disguised repetitions of the rejected spine. Full provenance, scores, discarded strengths and synthesis boundaries are recorded in `GTM_CONCEPT_TRACE.md`.

Live-data boundary: the first prototype uses primary-source observations verified on 15 September 2026 and labels dates, sources and limits. It demonstrates a bounded evidence fixture, not an implemented real-time feed. Quiet, stale, unavailable and conflicted states remain required for production.

Responsive boundary: the headline uses authored semantic line groups and one route-wide alignment token. Desktop may show the comparison simultaneously. Mobile shows one response at natural height and never squeezes a desktop matrix into the phone.

Approval boundary: the isolated `ai-gtm-vnext-r3` prototype must be rendered and shown cold in paired desktop and mobile views. Production route implementation, commit, merge and deployment remain unauthorised.

## 2026-09-15, AI GTM Countermove Table clears the review panel

Status: isolated prototype ready for owner review; production unchanged.

Decision: preserve the selected Countermove Table as the AI GTM reference. Three checked market signals each open three credible commercial responses across Product, Price, Positioning and People, then resolve to one customer test. “Market signals” and “Sources checked” are the truthful public labels; the prototype does not claim a live feed.

Correction result: the handoff now retains domain, signal and response; menu-to-drawer focus restores correctly; reduced motion keeps static poster imagery; footer links resolve; buyer, deliverable and paid proof are explicit; evidence metadata and shallow-landscape controls meet the legibility and target floors; and the 960/961 boundary uses one composition.

Panel: SHOW at 8.3 desktop and 8.3 mobile from the rendered award judge, 86/100 desktop and 82/100 mobile from the commercial judge, and A- with no P1 or P2 findings from responsive QA. The deterministic 12-viewport gate passes every signal, response, evidence state, drawer path and reduced-motion state with zero failures.

Production condition: reverify sources by 15 October 2026, make source expiry explicit, and connect preserved context to the real brief. No production implementation, commit, merge or deployment is authorised.

## 2026-09-15, AI Brain r2 demonstrates the living Brain contract

Status: isolated prototype ready for owner review; production unchanged.

Decision: retain the accepted scroll-built decision sheet but replace the abstract Prepared, Challenged, Decided and Kept sequence with Portrait, Map, Evidence and Change. Use the actual synthetic Brain fixture, persistently disclose that boundary, and remove the separate ownership chapter rather than lengthening the page.

Truth correction: the rendered map uses approved Aim, Pattern, Standard and Qualifies vocabulary. The change view separates automatic private portrait, map and retrieval rebuilds from human review for consequential or shared work. Company, person, role and decision persist into a truthful in-place prototype receipt rather than a lossy production jump. The close names one paid proof, a working first version and ownership in the buyer’s accounts. The public proof claims only the founder-reported publishing outcome.

Panel: SHOW at 8.4 desktop and 8.2 mobile from the rendered award judge, 89/100 desktop and 85/100 mobile from the commercial and contract judge, and A with no P1 or P2 findings from responsive QA. The deterministic nine-viewport gate passes all four Brain views, node inspection, proof disclosure, drawer states, focus recovery, reduced motion and paired review with zero failures.

Approval boundary: this decision covers the isolated paired prototype only. Porting it into `AiBrain.tsx`, committing, merging or deploying requires a separate gate.

## 2026-09-16, AI Brain r5 and AI GTM r6 locked for implementation

Status: both paired route prototypes are approved and locked for local production implementation.

Exact approval: “looks great, lock and continue”.

Decision: lock `ai-brain-vnext-r5` and `ai-gtm-vnext-r6` together as the current route references. Their desktop and mobile treatments travel together. The Brain lock includes the actual twenty-node synthetic Brain fixture, its eighteen relationships, the consolidated section title, the dynamically fitted graph and the Decision, Brain, Evidence and Correction sequence. The GTM lock includes five dated market signals, fifteen plain-English response choices, one customer-test resolution, the continuous signal ticker and the full-width mobile response controls.

Judgement rule: every visible control must name the whole choice in language a first-time visitor can understand. Internal strategy shorthand such as “Keep the seat”, “Meter the work” and “Price the result” is prohibited across active product surfaces. If a clear label does not fit, the component changes rather than the meaning being abbreviated.

Evidence: both browser gates pass eight viewports with zero failures. The plain-language gate passes all active targets. Exact artifact, fixture, paired-review and QA hashes are recorded in `quality/ai-brain/approved-vnext-r5.json` and `quality/ai-gtm/approved-vnext-r6.json`.

Carry-forward conditions:

- implementation must preserve the accepted interaction and responsive compositions rather than reconstructing them from screenshots;
- the production lead flow, route history, recovery and data contracts remain intact;
- the Brain fixture remains byte-identical unless a separately approved data revision replaces it;
- no extra explanatory chapter, generic card stack, public price, duration, guarantee or product ladder may enter during the port;
- every production review remains paired at desktop and mobile and must pass the same compact, shallow-landscape and reduced-motion checks.

Approval boundary: local production implementation and verification are authorised. Commit, merge, preview deployment, production deployment and public release remain unauthorised.
``````
<!-- END VERBATIM project-documentation/homepage-redesign/DECISIONS.md -->

<a id="archive-2026-09-24-homepage-redesign-gtm-concept-trace-md"></a>
### Archived source: project-documentation/homepage-redesign/GTM_CONCEPT_TRACE.md

Source path: `project-documentation/homepage-redesign/GTM_CONCEPT_TRACE.md`  
Raw SHA-256: `5953ff3b6ca3379cf859acf15da0b7c2716da0bf7a2551a689145f6c39a48c58`  
Source bytes: 12676

<!-- BEGIN VERBATIM project-documentation/homepage-redesign/GTM_CONCEPT_TRACE.md -->
``````markdown
# AI GTM concept trace

This append-mostly record owns concept and evidence provenance for the `/ai-gtm` material surface. The redesign gate and repository authority remain in `STATE.md`; approved decisions remain in `DECISIONS.md`.

## 2026-09-15, r1 and r2 same-spine revisions rejected

STATUS: concept reset active. No AI GTM route direction is locked.

OWNER REACTIONS:

- r1: “surely you can look for yourself and see this is not ready to show me? everything is cut off and falling outside boxes”
- r2: “i dont get the awkward text wrapping for hero and sub hero text”
- r2 opportunity: “Are you also touching upon live examples, I feel like we are missing an opportunity to really hit the nail on the head and show how ahead of the curve we are.”

CLASSIFICATION: r1 exposed frame-level responsive failures. r2 removed the clipping but retained the same explanatory offer-press spine, character-count-led text composition and a disconnected customer-signal section. The second material challenge is therefore evidence that local refinement has stalled.

RESET DECISION: preserve r1 and r2 as rejected evidence. Generate three fresh interaction spines from a sanitized brief that contains outcomes, invariants and failure signals but no rejected layout, screenshots, DOM, rationale or component shapes. Do not implement a third revision of the rejected spine.

AUTHORITY: local research, concept generation, prototype work and local verification only. Production implementation, commit, merge and deployment remain unauthorised.

## Research brief

DECISION: determine whether and how current business signals can become the central proof mechanism on the AI GTM route rather than a decorative news feature.

CHANGE CONDITIONS: reject the live-signal direction if current primary evidence cannot support useful decision consequences, if honest freshness states make the experience collapse, or if it reads as a news dashboard rather than a principal-led commercial engagement.

BOUNDARIES: digital businesses relevant to founders, CEOs, CROs and senior commercial leaders. Focus on Product, Price, Positioning and People decisions. Exclude speculative trend claims, private customer evidence, unverified social commentary and claims that a prototype has a production data feed.

FRESHNESS: company moves must be verified from current first-party sources retrieved on 15 September 2026. Each visible signal requires source, event date and observed date. Reverify before any production implementation or later than 30 days from retrieval.

QUALITY FLOOR: current first-party company announcement, product documentation or official filing. Secondary analysis may identify a lead but cannot carry a customer-visible claim alone.

TIME/COST CAP: one focused evidence pass over the strongest signals in the supplied 15 September 2026 live read. No paid sources.

STOP RULE: stop after at least three materially different, primary-source signals can each support a specific linked business decision and one honest stale or unavailable fallback has been defined.

INITIAL EVIDENCE PACKET:

| Signal | Primary source | Event date | Retrieved | Established fact | Limitation | Decision use |
|---|---|---|---|---|---|---|
| Outcome pricing | HubSpot company news, “Now you pay when the task is complete” | 13 April 2026 | 15 September 2026 | HubSpot moved two Breeze agents to credits charged per resolved conversation or recommended lead. | Vendor-authored performance and pricing claims; current availability must be rechecked before release. | Tests whether an AI product should charge for access, work or a verified result. |
| AI-mediated commerce | Shopify company news, “Millions of merchants can sell in AI chats” | 24 March 2026 | 15 September 2026 | Shopify says Agentic Storefronts distribute products across named AI channels and preserve merchant-of-record control. | Vendor-authored reach claims; category adoption remains uneven. | Tests whether product data, positioning, channel ownership and team accountability still fit an AI-mediated buying journey. |
| AI prototyping | Uber product blog, “Two Hours of Prototyping Unblocked Four Weeks of Discussion” | current page retrieved 15 September 2026 | 15 September 2026 | Uber reports working prototypes appearing in hours and before complete PRDs, changing early product discussion. | One company’s operating evidence, not a universal productivity ratio. | Tests whether cheaper execution should change product governance, customer contact and release standards. |
| Paid crawler access | Cloudflare company blog, “Introducing pay per crawl” | 1 July 2025 | 15 September 2026 | Cloudflare’s private beta lets publishers allow, charge or block authenticated AI crawlers using HTTP 402. | Still described as private beta and explicitly early. | Tests whether proprietary content is marketing, product inventory or a separately priced machine input. |

SUPPORTED INFERENCE: the useful product is not a horizontal ticker. It is a dated signal entering a linked decision instrument, where the visitor can see what changed, the four business consequences and the smallest customer-facing test.

STRONGEST COUNTERCASE: fast-moving company announcements can date the page, overstate representative adoption and distract from Mindmake’s own proof. The route must work in a quiet or stale state by showing the decision method with the last verified fixture and plainly stating the evidence boundary.

KRISH-OWNED CHOICE: none at this stage. The current instruction explicitly asks to explore a live signal layer while building. A rendered synthesis remains subject to cold approval.

## Reset round, in progress

SANITIZED BRIEF HASH: pending final capture after generator dispatch.

GENERATOR TERRITORIES:

- G1: visitor-operated evidence instrument;
- G2: continuous causal scroll crossing;
- G3: comparative decision room.

PAIRWISE DISTANCE:

- G1 versus G2: pass on user agency, branching, source state and primary interaction, although both use a physical evidence path.
- G1 versus G3: pass on selected input versus selected response, sequential tape versus simultaneous comparison and source-state versus decision-state.
- G2 versus G3: pass on passive authored sequence versus active comparison, single route versus alternatives and linear rail versus decision table.

JUDGE 1: fresh context, anonymized order G1, G3, G2. Diversity pass. Selected G3. Flagged G1 and G2 as disguised repetitions of the rejected four-stage press. Scores for G3: commercial 9.5, interaction 9.0, visual potential 8.5, originality 8.5, trust 9.0, desktop 8.5, mobile 8.5.

JUDGE 2: fresh context, anonymized order G2, G3, G1. Diversity pass. Selected G3. Again classified G1 and G2 as siblings of the rejected spine. Scores for G3: commercial 9.2, interaction 9.0, visual potential 8.8, originality 9.0, trust 9.2, desktop 9.0, mobile 8.3.

MATERIAL DISAGREEMENT: none. A third tiebreaker is not required.

SELECTED SPINE: G3, The Countermove Table. One dated market move is fixed. The visitor compares credible commercial responses and sees Product, Price, Positioning and People change together before one response becomes a customer test.

DISGUISED REPETITION: rejected for synthesis. No rail, tape, press, four-stop journey or scroll-synchronised lever sequence may return.

CONSTRAINT REGRESSIONS TO PREVENT:

- response controls must read as hypotheses considered, never three offers or CTAs;
- the desktop comparison must not become a dense consultant matrix;
- mobile must show one natural-height response sheet at a time, never a compressed desktop table;
- the evidence state must say observed or dated, not imply an unimplemented real-time feed;
- sticky or fixed geometry must relinquish space on short screens;
- principal leadership, one paid proof, private price and private duration remain intact.

DISCARDED STRENGTHS PRESERVED:

- one visible causal system still connects all four commercial decisions to one customer test;
- the opening retains one compact dated evidence layer and a concrete business question;
- the selected response and evidence identifier can carry into Start here without pretending the page generated bespoke strategy;
- natural mobile flow and explicit quiet, stale, error and conflicted evidence states remain part of the content contract.

SYNTHESIS DECISIONS:

- headline: “We turn an AI market shift into one tested commercial move.” It avoids a command and names the commercial outcome directly;
- first verified worked example: HubSpot’s April 2026 move to outcome-linked pricing for two Breeze agents;
- responses considered: keep the seat, meter the work, price the result;
- one compact live-read strip may show additional dated observations, but it cannot become a second hero control axis or decorative auto-moving news carousel;
- the proof is labelled worked example until an authorised public result is used. Existing public-safe Mindmake proof may be shown separately and exactly;
- desktop and mobile are separate compositions governed by the same content model and one outer alignment token.

FEASIBILITY: bounded HTML/CSS/JavaScript prototype using one authored evidence fixture, native radio controls, semantic table or definitions, a finite selection state and the existing Start here drawer. No scraping, AI inference, WebGL or production data dependency.

SANITIZED BRIEF HASH: the durable brief is the requirements and failure-signals block recorded in this file. SHA-256 after this revision is recorded with the rendered artifact.

RESET REVISION COUNT: zero for the newly selected Countermove Table spine.

NEXT ACTION: render and verify one paired desktop-and-mobile `ai-gtm-vnext-r3` review artifact. Show it cold before production implementation.

## 2026-09-15, Countermove Table rendered and independently cleared

STATUS: isolated prototype ready for owner review. Production remains unchanged.

ARTIFACT: `prototypes/ai-gtm-vnext-r3/`, with mandatory paired review at `review.html`.

RENDERED SYSTEM:

- three current primary-source signals enter one decision instrument;
- each signal exposes three materially different responses and their Product, Price, Positioning and People consequences;
- the selected response resolves to one customer-facing test;
- desktop preserves simultaneous comparison while mobile uses a natural-height single-response sheet and direct response controls;
- `ready`, `stale`, `quiet`, `error` and `conflicted` fixture states remain explicit and truthful;
- the company handoff preserves the submitted domain, selected signal and selected response without claiming that anything was sent or saved.

CORRECTION LOOP: the first blind pass found a lossy handoff, menu-to-drawer focus loss, blank reduced-motion imagery, placeholder footer links, undersized evidence text, overclaimed “live” language and insufficient buyer or deliverable clarity. All were repaired before re-judging. The 960/961 composition boundary now uses one authored tablet/desktop system and shallow landscape keeps 44-pixel controls.

VERIFICATION: `scripts/qa/ai-gtm-prototype-r3-check.mjs` passes 12 viewports, every signal and response combination, drawer recovery and handoff, Menu to Start focus restoration, reduced motion, all five fixture states, footer links and the paired review with zero failures. Measured length is 3.77 to 6.77 screens depending on viewport. Screenshot evidence is under `C:/Users/krish/.scratch/mindmake-ai-gtm-vnext-r3/`.

INDEPENDENT VERDICTS:

- rendered award judge: SHOW, 8.3 desktop and 8.3 mobile;
- commercial judge: SHOW, 86/100 desktop and 82/100 mobile;
- responsive QA judge: A-, SHOW, no P1 or P2 findings.

RESIDUAL LIMITS: public proof remains anonymous and unquantified; mobile intentionally does not show all three responses simultaneously; the checked-source date requires an expiry/update mechanism before production; and the final handoff is a prototype receipt rather than a production integration.

PRODUCTION CONDITIONS: reverify the three primary sources no later than 15 October 2026, make the maintained source date data-driven or fail closed to a stale state, and connect the preserved signal/response context to the real brief before release.

ARTIFACT HASHES:

- HTML: `3558ead10a8a2b2ccb2e21d0b552f497eb4aedd1b4a7897904ab1f39d942e1df`
- CSS: `1cc1dedf760f755f8532d14a9695a9493f25887341cd3fce9f0aa78545f9373a`
- JavaScript: `49603f9004fb44d470ad862cb261e3945cfb0f743271c9b03ea5e21980982d50`
- paired review: `27a508b40913b394f296db930b1b47b58f765b3c8fe859f901dc3020de0af104`
- QA gate: `efc8179a07368c9b0c14767a81b799e5757144061241775720412f79336ed112`
``````
<!-- END VERBATIM project-documentation/homepage-redesign/GTM_CONCEPT_TRACE.md -->

<a id="archive-2026-09-24-homepage-redesign-judge-brief-md"></a>
### Archived source: project-documentation/homepage-redesign/JUDGE_BRIEF.md

Source path: `project-documentation/homepage-redesign/JUDGE_BRIEF.md`  
Raw SHA-256: `a91690c7f79214ab60d0b872d4dce173621979166052dff4584abdb2e15f3bd6`  
Source bytes: 3441

<!-- BEGIN VERBATIM project-documentation/homepage-redesign/JUDGE_BRIEF.md -->
``````markdown
# Homepage concept judging brief

Judge the three anonymous concept specifications against the same constraints. Do not reward effort, writing quality or novelty by assertion. Judge the interaction and information architecture a visitor would experience.

## Current rejected-history signals

The existing production homepage has been iterated extensively and is not the candidate. It remains relevant only as failure history and as a source of strengths that should not be discarded.

Owner-observed failures:

- the hero does not fit convincingly when the page first loads across screen sizes;
- the page uses too many words and reveals too much before it is needed;
- headings become cryptic or self-conscious instead of plain;
- explanatory lines narrate choices the interface should make obvious;
- the scroll feels like repeated stacks of boxes with little distinction between chapters;
- the default journey is too long, especially on mobile;
- the main call to action becomes an overly long mobile experience instead of a contained drawer;
- the desired visual register is simple, bold and modern, with Tenex cited for restraint rather than as a style to imitate;
- route clarity comes first;
- Brain and GTM are familiar, useful door names, but the page must not become generic consulting.

The corrected blind production panel scored:

- desktop 7.7 and mobile 7.2;
- art direction 8.2 desktop and 7.8 mobile;
- inspiration and originality 8.5 desktop and 8.3 mobile;
- buyability 7.3 desktop and 6.8 mobile;
- immersion and interaction 7.1 desktop and 6.2 mobile;
- UX, content and technical quality 7.4 desktop and 6.8 mobile.

The strongest existing qualities are the private-observatory world, cinematic archival imagery, confident type contrast, light and dark chapter rhythm, and clear two-door premise. The weakest are mobile tactile quality, long-swipe cost, delayed action, repeated copy, unclear category, dense proof, utility treatments and keyboard order.

Production evidence also records about 2,100 rendered words, 7 to 8 desktop screens, 14 screens at 320 by 568 and 17 screens at 844 by 390. Natural Tab order skips the visible Menu trigger and can enter hidden or off-screen carousel controls.

## Judging rules

1. Read `SANITIZED_BRIEF.md` and all three candidate JSON files.
2. Use the supplied candidate order. Do not inspect another judge's verdict.
3. Test pairwise conceptual distance across sequencing, user agency, primary interaction, information structure and state model. Every pair needs at least two material differences. Styling and wording do not count.
4. Fail any candidate that breaks a commercial, proof, brand, accessibility or feasibility invariant.
5. Score commercial clarity, information economy, interaction strength, mobile quality, brand specificity, proof integrity and feasibility from 0 to 10.
6. Name one winner and one runner-up. Do not average away a hard failure.
7. Explicitly answer:
   - Is any candidate disguised repetition of the rejected direction or another candidate?
   - Does any candidate regress an invariant constraint?
   - Which useful strength from the rejected work might be discarded and should be restored without copying its failed structure?
8. Give concrete synthesis instructions that can be implemented as one responsive prototype.

Use `concept-judge.schema.json`. A valid verdict is evidence, not a design lock. Krish approves the rendered synthesis.
``````
<!-- END VERBATIM project-documentation/homepage-redesign/JUDGE_BRIEF.md -->

<a id="archive-2026-09-24-homepage-redesign-round2-judge-brief-md"></a>
### Archived source: project-documentation/homepage-redesign/ROUND2_JUDGE_BRIEF.md

Source path: `project-documentation/homepage-redesign/ROUND2_JUDGE_BRIEF.md`  
Raw SHA-256: `9a92a49117ac81fde264c9e50fe26180ebc789a733ed16b36a76a9cff351b95c`  
Source bytes: 3175

<!-- BEGIN VERBATIM project-documentation/homepage-redesign/ROUND2_JUDGE_BRIEF.md -->
``````markdown
# Homepage reset, second-round judging brief

Judge the three anonymous reset concepts against the same commercial, experience and accessibility constraints. Do not reward polish in the specification. Judge the page a first-time visitor would actually experience.

## Why a second round exists

The first generator round was rejected before prototyping. Two independent judges found that candidates A and C were the same diagnostic workbench in different clothing. That failed the required divergence gate.

Both judges found candidate B materially different, but it still made the visitor interact before reaching the Brain or GTM route, and its evidence grid risked crowding the smallest portrait and landscape viewports. Judge one preferred C and judge two preferred A. Those winner votes were irrelevant once the set failed the diversity gate.

Useful qualities from the rejected production page remain available: the private-observatory atmosphere, cinematic archival imagery, confident type contrast and one meaningful transition between light and dark. Do not restore its long chapter stack, 2,100-word journey, dense proof, delayed action, hidden controls or repeated selection state.

## The missing territories assigned to this round

The generators received different structural jobs:

- one concept must make proof the navigation object, with no preliminary selector;
- one concept must make the homepage one bounded spatial object, with no section stack, nested scroll or hidden carousel;
- one concept must make Brain and GTM immediate destinations, followed by a decisive transition or takeover with no persistent downstream route selector.

These assignments are not reasons to score a candidate well. They are constraints to test.

## Judging rules

1. Read `SANITIZED_BRIEF.md`, `ROUND2_MISSING_TERRITORY.md` and the three candidate files in `candidates-round2/`.
2. Use the supplied candidate order. Do not inspect another judge's verdict.
3. Test every pair across sequencing, user agency, primary interaction, information structure and state model. Every pair needs at least two material differences. Styling, naming and copy do not count.
4. Fail any candidate that breaks a commercial, proof, brand, accessibility, mobile or feasibility invariant.
5. Score commercial clarity, information economy, interaction strength, mobile quality, brand specificity, proof integrity and feasibility from 0 to 10.
6. Name one winner and one runner-up. Do not average away a hard failure.
7. Explicitly answer:
   - Is any candidate disguised repetition of the rejected production direction, the rejected first round or another candidate?
   - Does any candidate regress an invariant constraint?
   - Which useful strength from the rejected work might be discarded and should be restored without copying its failed structure?
8. Give concrete synthesis instructions for one responsive prototype.
9. Judge the smallest and shortest viewports as first-class surfaces: 320 by 568 and 844 by 390, as well as 390 by 844, 1024 by 768 and 1440 by 900.

Use `concept-judge.schema.json`. A valid verdict is evidence, not a design lock. Krish approves the rendered synthesis.
``````
<!-- END VERBATIM project-documentation/homepage-redesign/ROUND2_JUDGE_BRIEF.md -->

<a id="archive-2026-09-24-homepage-redesign-round2-missing-territory-md"></a>
### Archived source: project-documentation/homepage-redesign/ROUND2_MISSING_TERRITORY.md

Source path: `project-documentation/homepage-redesign/ROUND2_MISSING_TERRITORY.md`  
Raw SHA-256: `5f643a2967d595ae966981e54004086d4f75f067cc2c544e310de0319e75ecac`  
Source bytes: 1556

<!-- BEGIN VERBATIM project-documentation/homepage-redesign/ROUND2_MISSING_TERRITORY.md -->
``````markdown
# Round two missing territory

Use `SANITIZED_BRIEF.md` unchanged. This file adds only the conceptual territory the first round failed to cover.

The second round must not converge on a persistent Brain and GTM selector that swaps route-specific copy down one shared page. Across the set, each concept must use a different answer to all of these questions:

- What happens before the visitor chooses a door?
- What physical or spatial action carries the idea?
- Does choosing a door navigate, reveal, transform or begin?
- What remains on screen after the choice?
- How does proof clarify the route without becoming another section stack?

Required territories:

1. One concept where a single piece of proof is the primary navigational object and the door choice emerges from operating or inspecting it. Do not add a preliminary selector before the doors.
2. One concept where the homepage behaves as one bounded spatial object rather than a vertical sequence of sections. The visitor should manipulate or traverse that object without nested scrolling or a hidden carousel.
3. One concept where the two doors are immediate destinations and the homepage changes through a decisive transition or contained overlay rather than persistent downstream route state.

Every concept still needs the full two-door decision in the first viewport, route clarity before ornament and a contained responsive start surface. The set must remain feasible with the current React application and existing assets. Do not inspect or refer to first-round candidates or verdicts.
``````
<!-- END VERBATIM project-documentation/homepage-redesign/ROUND2_MISSING_TERRITORY.md -->

<a id="archive-2026-09-24-homepage-redesign-sanitized-brief-md"></a>
### Archived source: project-documentation/homepage-redesign/SANITIZED_BRIEF.md

Source path: `project-documentation/homepage-redesign/SANITIZED_BRIEF.md`  
Raw SHA-256: `ba36e37a12bbad4edbb8edc61db42a969f3b0bad9e93af92a3202828b753a8dc`  
Source bytes: 4598

<!-- BEGIN VERBATIM project-documentation/homepage-redesign/SANITIZED_BRIEF.md -->
``````markdown
# Sanitized homepage divergence brief

## Outcome

Design a homepage concept for Mindmake that helps a first-time qualified visitor understand the practice, distinguish its two public doors and begin the right route with very little reading or effort.

The homepage must feel like a practitioner opening a working instrument, not a consultancy explaining a framework.

## User and state of use

The visitor is a founder, principal, portfolio owner, investor or senior commercial leader who can move a material decision. They are likely busy, interrupted and viewing on either a laptop or phone. They may know that AI matters without knowing which capability or commercial decision needs attention first.

## Invariant commercial rules

- The business is Mindmake.
- The two public doors are `Build your AI brain` and `Build your AI GTM`.
- GTM means how a business gets its product to customers and gets paid for it.
- The doors are two ways into one paid proof, not two unrelated products.
- Price, duration, availability and start date are private.
- There is no public diary link, public price, offer ladder, chatbot or third product.
- CTRL may appear only as proof that Mindmake runs the approach itself. It is not linked or sold here.
- Public proof must keep anonymous client outcomes, named references and attendee brands separate.
- The homepage must not ask the visitor to diagnose the problem before Mindmake has added value.

## Brand and voice invariants

- Dark, warm, physical, patient and alive.
- Instrument rooms, brass, walnut, cream paper, ink, glass and one blade of light.
- Deep ink green, warm cream, mint for an answer and amber for what changed.
- Archivo for structure, Newsreader for a claim, IBM Plex Mono for data and labels, Source Serif 4 for running text.
- British English, short sentences and plain language.
- No em dash, eyebrow heading, doom, command, boast, cryptic heading, unexplained technical term or generic AI visual.
- Every section must teach something, show proof or help a decision.

## Experience constraints

- The first rendered viewport must make the practice, intended buyer, two doors and next action legible at 1440 by 900, 1024 by 768, 390 by 844, 320 by 568 and 844 by 390.
- The two door names remain adjacent as one decision group on the homepage.
- Default-visible homepage copy should stay within 700 words.
- Aim for no more than five desktop screens and six primary-phone screens.
- Secondary proof, explanation, questions and editorial material should be revealed only when it helps the current decision.
- Avoid a page made from repeated card stacks or sections with indistinguishable visual weight.
- Touch response must be immediate and informative. Every control needs hover, press and focus-visible states.
- Keyboard order must include the menu and every visible action in logical sequence. Hidden carousel items must not receive focus.
- A drawer or dialog must trap focus, close with Escape or Back where appropriate and restore focus to its trigger.
- Orientation changes should preserve the visitor's conceptual position.
- Reduced motion must retain all content and state while removing unnecessary movement.
- Motion should preserve orientation, reveal a relationship or confirm an action. It must not create understanding debt.

## Proof and content ingredients

Use only as much as the concept needs:

- the core distinction between a generic AI and one that starts from the leader's standards, context and past decisions;
- one Brain-shaped result and one GTM-shaped result from the approved public proof set;
- the fact that a first proof produces something working on real work that the client keeps;
- a compact founder or practice proof near the end;
- a route to deeper case studies, questions and the publication without placing their full content in the default journey.

## Diversity requirement

Create one complete concept spine with a governing interaction metaphor. It must define:

- sequencing;
- visitor agency;
- primary interaction;
- information structure;
- state model;
- mobile adaptation;
- how proof appears;
- how the route begins;
- why the interaction earns its place.

Do not produce a visual skin or a rearranged list of sections. The concept must remain feasible with the current React application, existing films, existing proof and existing lead-flow contract.

## Output

Write one concise concept specification as JSON using the supplied concept schema. Do not inspect or refer to another candidate, the current homepage layout, rejected renders, prior rankings or proposed solutions.
``````
<!-- END VERBATIM project-documentation/homepage-redesign/SANITIZED_BRIEF.md -->

<a id="archive-2026-09-24-homepage-redesign-state-md"></a>
### Archived source: project-documentation/homepage-redesign/STATE.md

Source path: `project-documentation/homepage-redesign/STATE.md`  
Raw SHA-256: `8af0041152c56910277c62e4e2643ccf2823cb71ba61849c9151db20587a34b8`  
Source bytes: 29279

<!-- BEGIN VERBATIM project-documentation/homepage-redesign/STATE.md -->
``````markdown
# Homepage redesign state

This is the single current-state record for the homepage redesign and its local production implementation. Deployed production truth remains in `project-documentation/06_CURRENT_STATE.md`.

## Preflight

STATE_ROUTE: `project-documentation/homepage-redesign/STATE.md`

SOURCE_LAYERS:

- durable doctrine: `00_NORTH_STAR.md`, `01_CANON.md`, `03_DESIGN_CONTRACT.md`;
- current project state: `NOW.md`, `06_CURRENT_STATE.md`, repository revision `2d8caff1874b4b568fa89980304f736b81b05d07`;
- external evidence: production capture `artifacts/award-panel/2026-09-12-production-v2` and rubric `quality/award-panel/rubric.v1.json`;
- history: `project-documentation/history/LOG.md`, not current guidance;
- obsolete: retired offers, old names, public duration and pricing, public diary routes, and superseded design locks.

PRODUCT_TRUTH: Mindmake is a principal-led AI and commercial strategy practice for leaders who can move a material decision. The homepage presents two adjacent public doors, Build your AI brain and Build your AI GTM, leading to one paid proof with private price and duration.

NON_GOALS:

- no commit, merge, preview deployment or production deployment without a separate gate;
- no new offer, product, price, duration, calendar route or chatbot;
- no redesign of the door pages in this homepage slice;
- no replacement of the established Mindmake visual world.

SURFACE_DEPENDENCIES:

1. Homepage primary state and responsive interaction model.
2. Homepage start drawer and route continuity.
3. Door pages and shared conversion flow.
4. Shared design-system and content-contract changes.
5. Production implementation and release.

VERTICAL_SLICE: A responsive, clickable homepage prototype that lets a first-time visitor understand Mindmake, distinguish the two doors and reach a bounded start state without touching production.

FIRST_SURFACE: Homepage, primary state at 1440 by 900 and 390 by 844, with responsive checks at 1024 by 768, 320 by 568 and 844 by 390.

## Build record

TARGET: isolated worktree `mindmake-award-panel`, branch `codex/award-judging-panel`, revision `2d8caff1874b4b568fa89980304f736b81b05d07`.

CURRENT_RUNTIME: Windows, PowerShell, Node 22.23.0. The production site was captured on 12 September 2026. The exact production deployment revision is not confirmed against this worktree, so runtime findings remain production observations rather than source attribution.

SOURCE_OF_TRUTH: this file for redesign progress; `project-documentation/homepage-redesign/DECISIONS.md` for append-only concept decisions.

AUTHORITY: local research, concept generation, prototype files, local homepage implementation and local verification are authorised. Commit, merge, preview deployment, production deployment and external writes are not authorised.

PASS_SIGNALS:

- three concept spines differ pairwise on at least two of sequencing, user agency, primary interaction, information structure and state model;
- two independent judges agree on a winning feasible spine, or a fresh tiebreaker resolves material disagreement;
- the synthesis renders at all five target viewports without overflow, clipped action or inaccessible controls;
- the initial viewport contains sufficient information to identify the practice, intended buyer, two doors and next action;
- keyboard order, visible focus, reduced motion and drawer recovery pass in the prototype;
- the rendered prototype is shown cold to Krish before production implementation.

ROLLBACK: the implementation remains uncommitted on `codex/award-judging-panel`. The approved prototype remains isolated under `prototypes/homepage-vnext/`, and the local homepage change set can be identified from the implementation hashes below without touching unrelated working-tree changes.

READBACK: file hashes, local browser captures, accessibility checks, interaction checks and the repo-owned award-panel rubric.

STATUS: artifact `homepage-vnext-r2-mobile` is explicitly locked by Krish and implemented in the local production application. Routine correction `homepage-vnext-r2.4-gradient` preserves the approved composition while replacing the blanket mobile film darkness with a directional radial fade behind the copy and a separate lower fade behind the route controls. Krish accepted that treatment on 14 September 2026. Blind pre-release judging of the local candidate is complete: 7.4 overall, 7.7 desktop and 7.4 mobile, with art direction strongest and buyability/trust weakest. The candidate remains uncommitted and undeployed. The baseline interaction prototype `start-flow-vnext` is preserved unchanged. Krish approved its routine safe-bottom revision, `start-flow-vnext-r2`, for local implementation on 15 September 2026. That approved sequence is now implemented and locally verified in the real LeadBrief. Krish accepted the first material AI Brain route direction, `ai-brain-vnext-r1`. Its corrected paired prototype passes all hard gates and reaches the award-shortlist band: 8.46 desktop, 8.40 mobile and 8.43 across ten assignments. The accepted direction is now implemented locally on the real `/ai-brain` route with the production LeadBrief drawer, exact approved proof and a responsive four-state decision sequence. It remains uncommitted and undeployed.

## Current phase

PHASE: 10, local production implementation of the accepted AI Brain route is complete and awaiting paired owner review.

LOCKED:

- Mindmake name and established visual world;
- two adjacent public doors and one paid proof;
- private price and duration;
- no public diary link or chatbot;
- only the homepage is in the current material approval scope;
- artifact `homepage-vnext-r2-mobile`, including the distinct desktop and mobile opening compositions, route replacement states and Start here drawer or phone sheet;
- the approved artifact and QA hashes recorded in `CONCEPT_TRACE.md`.
- `ai-brain-vnext-r1` is the accepted route reference; its desktop and mobile treatments, responsive drawer correction and final award-panel evidence must travel together into implementation.

RISKS:

- simplifying the homepage could remove proof needed for a high-consideration purchase;
- a novel interaction could become technology theatre;
- the live lead flow is more complex than the prototype and must not be misrepresented;
- the prototype Start flow is deliberately local and simplified, while production must retain the real lead-flow data and recovery behaviour;
- a technically correct port can still regress the approved density, distinction, type composition or mobile choreography.

VERIFICATION: the built application passes `qa:homepage-fidelity` with zero failures across 1440 by 900, 1024 by 768, 390 by 844, 375 by 812, 320 by 568 and 844 by 390. The mobile scrim gate verifies both the protected copy opacity and a rendered image-reveal endpoint of 0.08, as well as full film-frame coverage. Fresh 390 by 844 and 320 by 568 pixel renders show the headline and paragraph retaining the dark reading field while the cabinet reappears across the right and lower middle. Desktop remains unchanged. The fidelity run now also opens the full-screen menu at every target viewport, verifies viewport coverage, overflow, background inertness, focus entry and Escape focus restoration, and captures paired 1440 by 900 and 390 by 844 menu renders. That new gate reproduced a timing defect: the old 160 ms visibility transition kept menu links unfocusable when the 20 ms focus handoff ran. `mindmake.css` now makes visibility immediate on open and delays it only on close; the regression passes. `qa:chrome` passes 8 sizes by 2 pages by 2 text scales using installed Chrome. The production build passes. Lint passes with zero errors and the same two pre-existing warnings. The full Vitest run now reports 456 passing and 8 failing tests; all eight failures are existing contract, discoverability and answer-route failures in unrelated answer-page and social-manifest work. The focused LeadBrief and route-history run passes 30 of 30 tests. The production-flow fidelity gate now opens both approved entry states at all six viewports and reports zero failures: desktop stays a bounded 700-pixel right drawer; mobile is a full-width phone sheet; headings do not spider; the five-stage path does not overflow; every visible control is at least 44 pixels; the company read starts before personal details finish; the page behind the dialog is inert; there is no internal or horizontal overflow; and the action remains above the 48-pixel desktop, 28-pixel mobile, 14-pixel compact and 24-pixel shallow-landscape reserves. The live production flow retains all eight real divisions and switches to the native selector where the complete set cannot fit without scrolling. Final rendered evidence is under `C:\Users\krish\.scratch\mindmake-start-flow-implementation-2026-09-15-r5`. Final hashes: `LeadBrief.tsx` `97657381ef50532e27037c8e1e68646168a07b89ac7a88f8f77a3765350b2da8`; `mindmake-brief.css` `83b67bc36f0945a7e4d06b9fe89cde00f8c497d8518559c7fa09cf357b2d8634`; `LeadBrief.test.tsx` `f1f34121a620ed7fa2d5470d609468e9ed3f46011c14787b50124aa6c46fedce`; `homepage-fidelity-check.mjs` `3bfcd3f6cb56c5af37b1cd00c808eea349f2d769edc9c4fa945343a57a9c340a`. The exact `r2.3` homepage baseline remains preserved at `C:\Users\krish\.scratch\mindmake-homepage-production\locked-baselines\homepage-vnext-r2.3-before-gradient-fade`. No commit or deployment has occurred.

AI BRAIN REVIEW EVIDENCE: `qa:ai-brain-prototype` passes at 1440 by 900, 1024 by 768, 901 by 700, 900 by 700, 834 by 814, 390 by 844, 375 by 812, 320 by 568 and 844 by 390 with no horizontal overflow, clipped action, spidery heading, undersized control, drawer safe-bottom failure or rail/title collision. All four decision states are reversible by scroll and direct selection. Reduced motion exposes the full semantic sequence as static content. Validation, focus, proof disclosure and the handoff to `/ai-brain?start=brain` pass. The blind ten-assignment panel scores 8.46 desktop and 8.40 mobile with all hard gates clear. Paired renders and all state captures are under `C:\Users\krish\.scratch\mindmake-ai-brain-vnext-r1`. Exact hashes and evidence are in `BRAIN_CONCEPT_TRACE.md` and `BRAIN_AWARD_PANEL_R1.md`.

AI BRAIN PRODUCTION EVIDENCE: `qa:ai-brain-fidelity` passes with zero failures at 1440 by 900, 1024 by 768, 961 by 700, 960 by 700, 834 by 814, 390 by 844, 375 by 812, 320 by 568 and 844 by 390. It checks the exact opening-screen fit, brand and menu alignment, a single shared horizontal origin across header, hero, decision sequence, proof, ownership, close and footer, non-spidery headings, all four reversible states, sheet containment, proof disclosure, production drawer focus and inertness, bottom containment, deep-link opening and reduced-motion static content. The shared-origin gate was added after owner review exposed that the route's 90rem composition and the shared 1104px footer container created a 120px desktop misalignment that the earlier containment-only checks missed. The repaired built output passes the same nine-view matrix with a maximum allowed anchor spread of 2px and includes dedicated desktop, mobile, compact and landscape close-plus-footer captures. The built route passes no-JavaScript reachability and clipping checks. The aliveness gate passes at 390 and 1440 after the approved decision line was carried quietly through proof and close; those transforms are disabled for reduced motion. The production build and prerender pass. The focused route suite passes 67 of 67. Lint reports zero errors and the existing two warnings. The full suite returns to its existing eight unrelated answer-content, social-manifest and duplicate-heading failures after the route contract was updated. Evidence is under `C:\Users\krish\.scratch\mindmake-ai-brain-production`. Implementation hashes: `AiBrain.tsx` `5c340151f72023b224303d0a92afd347a2883f1d5685e81ed39ebe74885281d0`; `mindmake-brain-vnext.css` `50311a581b17f69ca7d63c5249d17f0e5947af270baf78839abd02b65a90c5a7`; fidelity gate `fc5b880c536a5827e5f2c2796321e6adfa4231cece437dc68c17828ca927e898`.

NEXT_OWNER: Krish retains production implementation, commit and release authority.

NEXT_ACTION: review the implemented production `/ai-brain` route in the paired desktop and mobile surface. If accepted, the next material design slice is `/ai-gtm`; commit, preview deployment and production deployment remain separate approval gates.

## 2026-09-15 autonomous continuation

CURRENT_REVIEW_SET:

- `prototypes/ai-gtm-vnext-r3/review.html`: Countermove Table, cleared by three independent judges and a 12-viewport deterministic gate;
- `prototypes/ai-brain-vnext-r2/review.html`: actual Brain-in-action extension, cleared by visual and commercial-contract judges and a nine-viewport deterministic gate.

PHASE: paired owner review of two isolated prototypes. The current production routes remain the previously verified local implementations and were not changed in this continuation.

AUTONOMOUS FIXES COMPLETED: lossy prototype handoffs, cross-layer focus restoration, reduced-motion imagery, footer destinations, small evidence text, responsive breakpoint discontinuity, non-canonical Brain language, false repair scope, mismatched proof copy, undersized compact controls, hidden map feedback and transient horizontal type shearing.

CURRENT AUTHORITY WALL: no commit, merge, preview deployment, production port or public release. The next action after owner review is a separately authorised production implementation decision for AI GTM, AI Brain r2, both or neither.

## 2026-09-16 accepted route lock and continuation

PHASE: 8, local production implementation of the approved Brain r5 and GTM r6 route pair.

CURRENT TRUTH: Krish approved both current paired prototypes with “looks great, lock and continue”. `quality/ai-brain/approved-vnext-r5.json` and `quality/ai-gtm/approved-vnext-r6.json` are the immutable visual and interaction references. The earlier production Brain implementation and the existing GTM page are superseded only for this local implementation slice. Deployed production remains unchanged.

LOCKED:

- AI Brain r5 across desktop and mobile, including the actual synthetic Brain fixture, twenty nodes, eighteen relationships, graph-fit behaviour and four reversible states;
- AI GTM r6 across desktop and mobile, including five signals, fifteen plain-English response choices, continuous ticker and customer-test resolution;
- the product-wide rule that controls name the complete choice without assumed context;
- the existing production lead-flow, route-history, recovery and data-handling contracts;
- no new public offer, price, duration, guarantee or product ladder.

AUTHORITY: local source changes, deterministic tests, production-route browser verification and paired local review are authorised. Commit, merge, preview deployment, production deployment and publication are not authorised.

RISKS: the production port can regress the accepted density or mobile choreography, duplicate prototype-only logic instead of using application state, or weaken the real lead-flow contract. The implementation must fail closed on any undeclared visual or behavioural departure.

VERIFICATION: pass the lock-hash readback; focused React tests; production build; route fidelity at 1440 by 900, 1440 by 700, 1920 by 800, 1024 by 768, 430 by 932, 390 by 844, 320 by 568 and 844 by 390; keyboard, focus, reduced-motion, overflow and drawer checks; paired desktop and mobile rendered review; and a semantic comparison against both approved manifests.

NEXT_OWNER: `krish-build` for local implementation, followed by `ux-testing-agent` and `verification-loop` for the production-route verdict.

NEXT_ACTION: port the locked pair into the real `/ai-brain` and `/ai-gtm` routes without reopening design, then present the paired production renders. Release remains a separate approval gate.

## 2026-09-16 locked route production implementation complete

PHASE: 9, paired owner review of the locally implemented production routes.

IMPLEMENTED:

- `/ai-brain` now carries the approved r5 opening, actual twenty-node Brain fixture, eighteen relationships, ten sources, responsive graph fit, evidence inspection, reversible correction, exact approved proof and the real LeadBrief drawer;
- `/ai-gtm` now carries the approved r6 opening, continuous five-signal live read, fifteen complete plain-English response choices, linked product, price, positioning and people consequences, customer tests, proof and the real LeadBrief drawer;
- route CSS is namespaced to prevent either visual system leaking into the other route;
- the GTM drawer visibly carries the visitor's selected signal and response without changing the version 2 backend payload;
- the mobile GTM stage navigation now computes a fixed-interface offset rather than leaving the selected response below a dead viewport;
- prototype-only selectors omitted during the React port were restored, so the mobile Brain inspector and SVG sizing receive the locked responsive rules.

VERIFICATION: `scripts/qa/route-lock-production-check.mjs` passes with zero failures at 1440 by 900, 1440 by 700, 1920 by 800, 1024 by 768, 430 by 932, 390 by 844, 320 by 568 and 844 by 390 on both routes. It verifies first-screen fit, logo and menu alignment, horizontal overflow, five doubled ticker signals, fifteen distinct responses, response labels of at most two lines, mobile full-width choices, Brain counts, graph top density, inspector containment, keyboard node selection, all stages, correction, proof disclosure, drawer containment, focus, inertness, Escape recovery, carried GTM context, reduced motion and paired production review frames. Final rendered evidence is under `C:\Users\krish\.scratch\mindmake-route-lock-production-final`. TypeScript, targeted ESLint and the production build including SSR, sitemap, llms and prerender pass. The focused route and brief tests pass; the complete suite is back at its existing baseline of 465 passing and eight unrelated failures in answer content, social manifests and answer-route headings.

IMPLEMENTATION HASHES:

- `AiBrain.tsx`: `613565abcc4d9c678c52eed7d581f233b6220f0b240c44ac5f3727700f9c67c4`;
- `AiGtm.tsx`: `b5a02439b6f9a25be9b30693c206bff75afa6b1dcd517badd1ba7a1920f6f3bf`;
- `mindmake-brain-r5.css`: `3a5d80b8ef9a431256c06b6664b3c342fa60d7e094342a44f57307b8db3c1fb8`;
- `mindmake-gtm-r6.css`: `1012b6e4a067b0ed4b81800d92607fe4553008ef3ff715cca646424b1b0a2cb5`;
- `brain-fixture.json`: `02fa968575d7000874f0f10a09123336ad6ec3f7bf373dcd351fbb7e7ef2b1b9`;
- `gtm-signals.json`: `5ab7fac6ce8ebdab6b69b73f60e184a7e4df8d923d97edd29c38872648c3bf7f`;
- production route gate: `42b92f3edecd12aebcc5b2964091f3e525ef38ec3004644fed66a9eef8176977`.

NEXT_OWNER: Krish for paired production-route review. Commit, preview, deployment and publication remain unapproved.

NEXT_ACTION: review `prototypes/ai-brain-vnext-r5/production-review.html` and `prototypes/ai-gtm-vnext-r6/production-review.html`. If accepted, the next gate is an explicit release decision, not another visual iteration.

## 2026-09-16 locked route visibility repair

PHASE: 9, repaired local production candidate awaiting owner review.

ROOT CAUSE: the first React port preserved two prototype assumptions that were not true on the production routes. Brain paper-state headings inherited the global light-on-dark heading colour and the Correction layout detached its content to the bottom of a tall panel. GTM reveal blocks retained prototype opacity defaults but did not receive the prototype IntersectionObserver state. The earlier gate inspected descendant styles without multiplying ancestor opacity, so hidden content could pass while occupying visible blank space.

REPAIR: production now gives Brain paper states explicit ink colours, keeps Correction content contiguous, switches compact portrait to natural-height active panels, and prevents scroll position from overriding explicit compact and landscape stage selection. GTM production reveal blocks now render visible without depending on prototype-only JavaScript. The locked interaction model, fixture and public copy remain unchanged. The same safe Brain layout repairs were applied to the locked prototype CSS and stage controller.

VERIFICATION: `qa:locked-routes` passes 72 effective-visibility, contrast, clipping, overflow and paired-frame observations across 1440 by 900, 1440 by 700, 390 by 844 and 320 by 568. The independent eight-viewport production gate passes both routes, including 844 by 390 landscape. Both locked prototype gates, the plain-language gate, TypeScript, targeted ESLint, the production build, 59 focused tests and the built no-JavaScript routes pass. The complete suite remains at the pre-existing baseline of 465 passing and eight unrelated answer-content, discoverability and answer-route failures. Final regression evidence is under `C:\Users\krish\.scratch\mindmake-locked-route-regression`.

REPAIR HASHES:

- `AiBrain.tsx`: `b5d97a8e2d14315d82bf6e4c1adfa3547e254f3870d6ec641725daf2d8c9b72f`;
- `AiGtm.tsx`: `f80b9fec6c9da4bd409ed1173d2eb6b5d3bf614400cd2f474ff4627d03a6d59f`;
- `mindmake-brain-r5.css`: `4f2426ac83e2e1985a7d471d9472a4e8384ef622525acbb550c92a81664a75ec`;
- `mindmake-gtm-r6.css`: `97ea949239da1ca6d7f069f7f906b3ff6b77f76af6b9558d912ca6884daa094f`;
- eight-viewport production gate: `385519b093f5d58a94e1992a08583a009f2e8efd68177fc485e2d7768929b6b0`;
- effective-visibility regression gate: `f141561e928df33ee77491ff2a3772c07b3bf9f4e6741540bfc37b7ca9218823`.

NEXT_ACTION: owner review of the repaired paired production pages. Commit, preview, deployment and publication remain unapproved.

## 2026-09-16 Brain composition and grid repair

PHASE: 9, repaired AI Brain production candidate awaiting owner review.

ROOT CAUSE: the visibility repair proved that content existed but did not prove that the content used the available frame. The desktop Brain sequence also used a 1440-pixel local container while the shared header used the 1240-pixel shell, so the logo and section heading could both be internally aligned yet disagree by 52 pixels. Those were acceptance-gate omissions, not intentional whitespace.

REPAIR: the Brain sequence now uses the shared shell width and gutter. Decision is a two-part working portrait with the actual decision and four live Brain measures. Evidence is a full-height, numbered trace of the source, instruction and relationship behind the judgement. Correction is an explicit before-and-after authority map showing what still requires human release and what may remain delegated. Mobile and shallow landscape use dedicated natural-height compositions rather than a compressed desktop canvas. The accepted four-state sequence, Brain fixture and public promise remain intact.

VERIFICATION: the locked-route gate now measures meaningful direct-child occupancy as well as effective visibility. Decision, Evidence and Correction must occupy at least 58 percent of the available desktop or shallow frame, and the brand-to-section horizontal origin may differ by no more than 12 pixels. It passes 72 observations across desktop, shallow, mobile and compact review sizes. The independent production gate passes eight viewports. TypeScript, production build and prerender, 59 focused tests, plain-language checks and built no-JavaScript reachability pass. Rendered evidence is under `C:\Users\krish\.scratch\mindmake-locked-route-regression`.

REPAIR HASHES:

- `AiBrain.tsx`: `f9aba57b7083ede7d99db42e1bb907fdb58d51603112b6ba517843d289696f2d`;
- `mindmake-brain-r5.css`: `4eeed4a55a8eb3aed474ed80e6cbd9556c3eab3d09486a2b718b2aa5921372e2`;
- occupancy and alignment gate: `a55466caeec127c29ee8417743c6d492e68bc06b875b95b6527a6138efd20501`.

NEXT_ACTION: owner review of the repaired AI Brain production page. Commit, preview, deployment and publication remain unapproved.

## 2026-09-16 signature real-estate repair

PHASE: 9, paired Brain and GTM production candidate ready for owner review.

ROOT CAUSE: the preceding composition gate measured the area of large containers and could therefore reward an oversized empty box. It also compared the logo with a section shell instead of the first visible glyph. That produced false confidence while the Decision, Evidence and Correction states still parked small content inside large frames. This supersedes the earlier occupancy claim.

REPAIR:

- Brain Decision is now a connected working portrait built from the actual fixture: current synthesis, three linked meanings, their statements and live record counts;
- Brain Evidence is a traceable source-to-instruction-to-relationship chain, and Correction is a readable before-and-after authority map with the changed rule visibly marked;
- the actual twenty-node living Brain remains the centrepiece, including its selectable nodes, relationships, evidence inspector and motion;
- portrait phones use natural-height active documents instead of shrinking desktop boards into one viewport;
- GTM now shows the full reasoning crossing from market signal to selected response, then propagates it through product, price, positioning and people before resolving in a customer test;
- Brain and GTM hero copy, section copy and brand now use the same visible shell edge. GTM retains its stage rail outside that shared edge;
- phase emphasis no longer makes the surrounding GTM instrument unreadable.

VERIFICATION: `qa:locked-routes` passes 72 prototype and production observations across 1440 by 900, 1440 by 700, 390 by 844 and 320 by 568. Its acceptance logic now measures internal component gaps, visible hero and section origins, effective opacity, contrast, clipping and horizontal overflow. The independent production gate passes both routes at eight viewports including shallow desktop and landscape. The paired visual states were inspected at desktop, mobile and compact sizes. TypeScript, the production build and prerender, 89 focused tests, the plain-language gate and built no-JavaScript reachability for both routes pass. Evidence is under `C:\Users\krish\.scratch\mindmake-locked-route-regression` and `C:\Users\krish\.scratch\mindmake-route-lock-production-final`.

REPAIR HASHES:

- `AiBrain.tsx`: `01d4c5178c956b032f603ab710d69f375980ca2e83feed636033fa540bdaf663`;
- `AiGtm.tsx`: `727321f10b6e5106fb96028b9528badfb69625050e3b73f53cf30fcc00d9cb6f`;
- `mindmake-brain-r5.css`: `32563b03aef30c343e3fc99447703852d99ca0d0c9d85cb81a2c866ba2264850`;
- `mindmake-gtm-r6.css`: `e85bbed6918d71cc8edcab44f0f02b365d12ea23e4b48708139032362addbc81`;
- signature regression gate: `574c49793ad4a105c6b36138fa180d36b2604f6a211e9042053746e1154c8f92`.

NEXT_ACTION: owner review of the refreshed Brain and GTM production pages. Commit, preview, deployment and publication remain unapproved.

## 2026-09-16 production route approval lock

PHASE: 10, approved local production routes protected against silent regression.

APPROVAL: Krish accepted the paired Brain and GTM production renders with “this now looks good, lock and proceed, ensuring the system cannot fall apart moving forward”.

LOCK:

- `quality/route-lock/approved-production-r1.json` freezes fourteen production, data, review, QA and CI files by SHA-256 and records the minimum Brain and GTM structural contracts;
- `scripts/qa/approved-route-lock-check.mjs` fails when any approved file hash changes, a fixture loses required records, an approved instrument disappears or banned commercial shorthand returns;
- `scripts/qa/approved-route-lock-self-test.mjs` deliberately supplies a bad manifest and proves the guard fails closed;
- the normal `npm run build` invokes the approved-route guard before TypeScript or bundling;
- `.github/workflows/approved-route-lock.yml` independently runs the guard, its fail-closed self-test, the language contract, focused route tests and the production build on pushes and pull requests;
- `project-documentation/03_DESIGN_CONTRACT.md` now defines the signature-real-estate rule and the immutable manifest revision policy.

VERIFICATION: the approved-route guard passes fourteen locked files and exact structural counts of twenty Brain meanings, eighteen relationships, ten sources, three corrections, five GTM signals and fifteen response choices. The negative self-test detects deliberate drift in `AiBrain.tsx`. The combined route lock passes 72 rendered observations, eight production viewports per route and the plain-language contract. The production build and prerender pass with the lock in the default build path. Built no-JavaScript checks find no clipped content on either route.

LOCK HASHES:

- production manifest: `dc2c2cc8b6b52b314fbf54eef5539bcf969cc36310142c07b18eca9d382636e4`;
- approved-route checker: `d5d1a40c2a54e1eb8cff6e745c252cdd84ee2d9d296a1c41386091b838a51bae`;
- fail-closed self-test: `9f363a59b9d20a2fbfa6f10b510788011d258591e83ab578b550e3d007d504c5`;
- CI workflow: `163b253b1289d447f629a5066062108aceefa79e6b249b39636423a9d9f412b6`.

NEXT_ACTION: the approved production experience is locally frozen. A future visual change must use a new locked-revision manifest and rerun the complete route gate. Commit, preview deployment and production release remain separate authority gates.
``````
<!-- END VERBATIM project-documentation/homepage-redesign/STATE.md -->

<a id="archive-2026-09-24-website-redesign-state-md"></a>
### Archived source: project-documentation/website-redesign/STATE.md

Source path: `project-documentation/website-redesign/STATE.md`  
Raw SHA-256: `b38aaffb13d1b3eb8bfbb60f27d3731cef1dca96bd9869dd88d0599306f8affe`  
Source bytes: 325904

<!-- BEGIN VERBATIM project-documentation/website-redesign/STATE.md -->
``````markdown
# Mindmake website redesign recovery state

## 24 September 2026: approved R3 live

Krish approved R3 and authorized production publication after two corrections and end-to-end verification: history and leadership dividend must remain pinned while their scroll-driven sequences complete. Everything else stays as approved. The R3 reference is immutable.

Delivery is `src/pages/Index.tsx` plus `src/components/homepage-release/`, compiled from the actual approved markup/styles/assets by `scripts/qa/build-homepage-release.mjs`. The real LeadBrief history and backend remain integrated. This is not a new interpretation of the mock.

`HOMEPAGE-SCROLL-BUILD-001` records the exact feedback and acceptance criteria. History has four reversible scroll states. Leadership dividend progresses through Notice, Connect, Prepare, What becomes possible and The returned hour. Native sticky tracks release after completion; short-height/reduced-motion layouts retain natural-flow controls. No wheel/touch cancellation.

Do not claim release-ready from the earlier R3 receipts. New production evidence belongs in `artifacts/homepage-release/` and must bind actual source hashes, visible text, scroll inputs and pin geometry. The old entry-reveal checks did not prove the missing interaction.

The live backend test exposed and repaired a company-identity provenance defect. Current deployed versions are enrichment v44, brief v20 and personal-read v25. The last two supersede v19/v24 with type-only corrections whose emitted JavaScript was independently verified identical. Deployed-source readback, correct canonical and owned-alias reads, actual email receipts, persistence/follow-up checks and captured synthetic-row cleanup are recorded in `BACKEND-RELEASE-EVIDENCE-2026-09-24.md`. Earlier previous-frontend/API receipts remain separate from the successful post-promotion new-frontend canary: company-first entry through actual verification, visitor/operator INBOX receipts and the actual success-screen download. No live cron was invoked.

The built homepage passed all 12 ordered-state cases across Chromium, Firefox and WebKit on both Linux and macOS, including forward/reverse exits and reduced-motion/short-height fallbacks. Final CI passed 531 tests, 208 route cases and nine navigation supplements. A separate Results-page parsed-server stylesheet hydration defect was corrected without changing CSS or design; a parsed-HTML regression test now protects it.

Krish explicitly authorized publication after all other checks pass with physical iPhone VoiceOver and Android TalkBack checks recorded as outstanding for this release only. Browser emulation is not a physical-device pass. PR #170 merged as `3ee77cf9956f98dd73f69d0b48745930335e74e1`; `mindmake.co` now serves READY production deployment `dpl_EZigNAi6Uc6Apcq75XsFnHETt5W8`. Public HTTP checks and the live scroll/fallback matrix passed. Exact receipts and remaining follow-up are in `RELEASE-2026-09-24.md`.

Durable system update: ai-harness source `852c8f6`, evidence `7444d8d`; release `v2026.09.24.2` installed on this Codex client. Full harness checks and 24 adversarial motion-evidence tests passed; fresh-session canary rejected screenshot/attribute-only proof. Other clients and remote publication are not claimed.

## Archived pre-release record

The entries below preserve the earlier recovery chronology. Their dates, blocked statuses and future-candidate language are historical; the 24 September entry above and the current production record in `06_CURRENT_STATE.md` take precedence.

Status: **GTM, BRAIN, START-HERE S4, CASE-PROOF-FIELD-S2 AND COMMERCIAL-READINESS-S4-R3 MATERIALLY LOCKED; FAITHFUL LOCAL PRODUCTION INTEGRATION IN PROGRESS; RELEASE BLOCKED**  
Recorded: 17 September 2026  
Repository: `C:\Users\krish\dev\mindmaker\mindmake-award-panel`  
Observed branch: `codex/award-judging-panel`  
Observed HEAD: `2d8caff1874b4b568fa89980304f736b81b05d07`

This is the single current state route for the unreleased multi-surface redesign. The machine-readable feedback and acceptance contract is [continuity-contract.v1.json](../../quality/website-redesign/continuity-contract.v1.json). No other redesign document may claim to be current.

This file records unreleased branch and recovery state, not production truth. Production truth remains in `project-documentation/06_CURRENT_STATE.md`; commercial and brand authority remain in the numbered Mindmake canon. An older production document can therefore truthfully describe frozen SHA `e41d600` and deleted V8 files while this branch contains later unapproved candidates and local recovery assets. That is expected production-versus-branch state, not permission to promote the branch.

## Outcome

Build a coherent complete Mindmake experience in which the homepage, AI Brain, AI GTM, Start here journey, proof, case studies and supporting routes feel like one premium, living system.

The experience must be immediately understandable, visually memorable, commercially useful and calm enough to enter without preparation. Mobile is independently composed for attention rather than reduced from desktop. Words support the experience; imagery, state and interaction carry more of the meaning.

The redesign is complete only when all continuity rulings, verified findings, deterministic gates, blind judges, continuity guardians and Krish's material visual approvals pass. A high average score cannot compensate for a failed hard gate.

## Current truth

### Approved authority

- Production route lock: `quality/route-lock/approved-production-r1.json`
- AI Brain visual and interaction approval: `quality/ai-brain/approved-vnext-r5.json`
- AI GTM visual and interaction approval: `quality/ai-gtm/approved-vnext-r6.json`
- Approval wording: "this now looks good, lock and proceed, ensuring the system cannot fall apart moving forward"

The approved Brain r5 and GTM r6 prototype suites pass as of this state update. Their visual baselines and screenshot evidence are retrievable.

The exact approved production source bytes are not currently recovered. The current `AiBrain.tsx`, `AiGtm.tsx`, `mindmake-brain-r5.css` and `mindmake-gtm-r6.css` do not match the r1 lock. The CSS files were not present at HEAD, and the approved source versions were not found in the inspected Git history or named scratch evidence. The hashes identify what was approved, but a hash does not restore the bytes.

Therefore:

1. The approved rendered prototypes are the recoverable visual baseline.
2. The current production implementation is not an approved starting point.
3. No task may claim source recovery until every locked file matches the r1 manifest.
4. Reimplementation must be visually compared with the approved renders before it can become a new candidate.

### Candidate and rejection status

| Material | Status | Permitted use |
|---|---|---|
| Approved production r1 | Approved authority | Baseline and invariant source |
| Brain r5 prototype | Approved authority | Recoverable visual baseline |
| GTM r6 prototype | Approved authority | Recoverable visual baseline |
| Candidate production r2 | Unapproved | Test and implementation evidence only |
| Candidate production r3 | Unapproved | Responsive and sequencing evidence only |
| Candidate production r4 | Unapproved | Shared-geometry and case-study evidence only |
| Candidate production r5 | Rejected visual direction | Failure evidence only |
| Brain/GTM r7 | Unapproved | Historical candidate evidence only |
| Brain/GTM r8 | Explicitly rejected | Never use as a design or implementation foundation |
| Current dirty worktree | Mixed and unapproved | Preserve; inventory before selecting any source |

Passing checks recorded by an unapproved candidate do not promote that candidate. In particular, r8's word-count and overflow passes did not compensate for its visual regression into blank fields and generic text boxes.

## Product and design rulings

The complete ruling set is MMR-001 through MMR-050 in the continuity contract. These are the operative summary:

- The signature real estate must contain the most impressive and delightful content, not accidental blankness.
- Brain and GTM are living instruments, not bordered documents or PowerPoint-like card walls.
- A fix must stay fixed. Repeated defects become shared rules and automated checks.
- Logo, navigation, hero and section content share one governing grid.
- GTM reveals one market change, possible response, linked commercial consequences and customer test as a sequence.
- Brain makes a decision, its evidence, the living relationship model and correction feel inspectable and alive.
- Mobile defaults to one idea, one visual and one obvious action. Depth remains discoverable.
- A section longer than one mobile viewport must earn its height through intentional progression.
- Copy is minimal, approachable and never feels like homework. Visuals and interaction carry more meaning.
- Interface copy never rescues a weak visual cue by narrating an obvious control, explaining a metaphor after the fact or repeating a change the mechanism already makes legible.
- No clipping, collisions, truncation, awkward orphaned display words, hidden overflow or unexplained empty bands.
- Scroll builds meaning causally and reversibly. Reduced motion preserves all comprehension.
- The CTA carries route context, creates an intelligent visible response, explains consequences and recovers from mistakes.
- Multiple case studies are expected, with distinct meaningful visuals and accessible swipe, toggle or equivalent browsing.
- New-age leadership, case studies, blog, Answers, FAQ, Contact, legal routes and Media remain part of the final system.
- New-age leadership is the current manifesto-like route. A separate About route is unresolved and may not be invented without material approval.
- Media opens the canonical Substack publication and remains subordinate to Start here.

Krish must not be asked to repeat any ruling already present in the continuity contract. Ask only when a genuinely new taste, product or priority decision remains after inspecting the recorded evidence.

## Document inventory

| Class | Authority and examples | Rule |
|---|---|---|
| Canon | Numbered `project-documentation` files, especially 00, 01, 03, 04 and 06 | Outranks redesign state on business, claims and live production truth |
| Current redesign state | This file | The only current multi-session redesign state |
| Feedback contract | `quality/website-redesign/continuity-contract.v1.json` | The only complete project-local list of feedback, failures and acceptance gates |
| Approved visual authority | Approved production r1, Brain r5 and GTM r6 manifests plus their prototype files | Preserve and render before changes |
| Candidate evidence | Route-lock candidates r2 through r5 and prototype r7/r8 materials | Never treat as approved; r8 is explicitly rejected |
| Generated QA evidence | `C:\Users\krish\.scratch\mindmake-*` and ignored `artifacts/award-panel/*` | Evidence only; timestamps and target identity must match the claim |
| Homepage-specific design history | `project-documentation/homepage-redesign/*` | Historical and surface-specific; does not compete with this state |
| Unknown or mixed | Current dirty source and unclassified local changes | Preserve until provenance and dependency are established |

No file is to be deleted, moved, archived, committed or deployed merely because it is classified here. Each action remains separately approval-gated.

## Judge architecture

### 1. Deterministic gates

Run before model judgment. They own hashes, source contracts, routes, responsive geometry, text reflow, focus, reduced motion, input consequences, runtime failures and recovery. A deterministic failure cannot be averaged away.

### 2. Blind experience panel

Five independent jurors produce ten desktop/mobile specialist scorecards under `quality/award-panel/rubric.v2.json`. They see only the matching runtime, neutral rubric and assigned viewports. They do not see owner feedback, iteration history or other verdicts.

Their job is to detect whether an unfamiliar qualified visitor independently experiences clarity, desire, originality, delight, trust and technical quality.

Required result: `world_class_winner`, at least 9.2 on each surface, every judge at least 8.8 and every hard gate passed.

### 3. Continuity guardian panel

Five independent guardians receive the full continuity contract and approved/rejected history:

1. visual and signature guardian;
2. mobile attention guardian;
3. interaction and CTA guardian;
4. responsive and accessibility guardian;
5. route and content continuity guardian.

Each applicable MMR ruling and MMF finding must receive route, viewport, action, expected result, observed result and evidence. One failure or inconclusive item blocks release. Only Krish may accept an MMF finding as an exception.

### 4. Human taste gate

Judges can reject work. They cannot grant Krish's taste approval. Every material visual surface must be presented cold and explicitly approved before implementation or progression to the next material surface.

## Start gate for the next session

Before any public-surface edit, the next task must:

1. Read `AGENTS.md`, `NOW.md`, `CLAUDE.md` and `project-documentation/06_CURRENT_STATE.md`.
2. Read this file and the continuity contract completely.
3. Inspect Git status and preserve all existing changes.
4. Run `npm run qa:website-restart`.
5. Run `npm run qa:website-approved-visuals`.
6. Inspect the paired approved Brain r5 and GTM r6 renders.
7. State explicitly that the visual baseline is recoverable but exact r1 production-source parity is not yet established.
8. Remain in this current dirty tree for readback and isolated concept work. The recovery assets themselves are not yet committed, so do not create a clean worktree, reset, clean, move or overwrite this tree until an explicitly authorised commit or exact snapshot preserves them.
9. Do not use r8 as a foundation and do not set `MINDMAKE_ROUTE_LOCK_MANIFEST` to a candidate to make the default lock pass.
10. Treat failed r1 source parity as a required truth label, not a blocker to fresh concept work in `prototypes/website-redesign-recovery/gtm-market-change/`.
11. Continue from the earliest actionable gate, not from discovery.

## Execution sequence

1. Recover and inspect the approved visual baseline.
2. Reconcile one shared shell, geometry and responsive system without patch accumulation.
3. Begin the first material surface with fresh concept divergence for the GTM market-change sequence only inside `prototypes/website-redesign-recovery/gtm-market-change/`. Generators receive a sanitized requirement brief, not r8's layout. Historically informed judges receive the rejected history.
4. Synthesize one feasible GTM desktop/mobile surface, render it and present it cold for Krish's approval.
5. After GTM is locked, repeat for the Brain signature sequence.
6. Implement locked surfaces through shared primitives, rerunning continuity checks after every change.
7. Complete Start here intelligence, case-study browsing and full route continuity.
8. Run deterministic checks, continuity guardians and the blind award panel against a matching preview.
9. Keep commit, preview, deployment and production actions separately approval-gated.

## End goal

The journey ends only when:

- all MMR rulings pass with current rendered evidence;
- all MMF findings are fixed or explicitly accepted by Krish as named exceptions;
- the full route map remains reachable and visually coherent;
- every required viewport, orientation, text scale, pointer type, keyboard path and reduced-motion state passes;
- Chromium, WebKit and Firefox automation passes, followed by current physical iPhone Safari with VoiceOver and Android Chrome with TalkBack before release;
- all visible actions, failures and recoveries have been exercised in a matching runtime;
- continuity guardians report zero failures and zero inconclusive items;
- the blind panel reaches `world_class_winner` under rubric v2;
- every material surface has Krish's explicit rendered approval;
- a new approved manifest identifies the final production source;
- built, committed, merged, previewed, deployed, live and verified states are reported separately.

## Material surface boundary

The following changes require a cold rendered review and Krish's explicit approval before implementation or material progression:

- the GTM signature market-change sequence;
- the Brain signature decision sequence;
- the shared shell or navigation when visual hierarchy or geometry changes;
- the homepage when visual hierarchy or information architecture changes;
- Start here when its journey, interaction model or visual hierarchy changes;
- case-study browsing when its interaction model, visual system or sequence changes.

Alignment, wrapping, overflow, focus, target-size, semantic and deterministic-regression corrections inside an already locked surface are routine. If a change alters what a visitor notices first, understands next, the interaction model or signature visual language, it is material. Only Krish may approve a material surface or accept an MMF exception.

## Concept and reset trace

Current status: **GTM-MOTION-S1, BRAIN-MOTION-S3, START-HERE-INTERACTION-S4, CASE-PROOF-FIELD-S2 AND COMMERCIAL-CONTINUITY-S1 MATERIALLY LOCKED; ALL FIVE ARE FAITHFULLY INTEGRATED AND VERIFIED IN LOCAL PUBLIC-ROUTE COMPONENTS; RELEASE APPROVAL REMAINS BLOCKED**

This is the only authorised location for concept divergence, selection rationale and reset trace. Rendered concept files belong only under `prototypes/website-redesign-recovery/` in the named isolated material-surface directory. No competing strategy, handoff or state document was created.

### Commercial-readiness S4 divergence: CR-S4-2026-09-21.1

After the release-wide blind panel exposed a material ceiling in commercial clarity and phone-native originality, Krish authorised one isolated S4 synthesis inside `prototypes/website-redesign-recovery/commercial-continuity/` by replying `ok`. Production routes, shared files, the approved S3 implementation and promotion state remain frozen.

The current commercial canon changes the literal response to the blind panel's price and timing criticism. `project-documentation/00_NORTH_STAR.md` and `01_CANON.md` forbid both public price and public duration. S4 must therefore make the complete paid-proof boundary cold-visible without publishing either: one real decision or capability becomes a working first version, is used on real work, and leaves the buyer with the system, its proof and operating standards. The exact boundary is `Scope, duration and fee are agreed privately in writing before work starts.` This supersedes the stale thirty-day assumption used in the first sanitised generator brief.

Round one produced three superficially convergent press concepts: **The Decision Press**, **The Proof Strip** and **The Proof Press**. All used two intake rails, paper movement and a printed retained record. The entire round was rejected before historical judging because the three governing interaction metaphors were not independently distinct and repeated the industrial press/station family already rejected elsewhere. No layout, copy or mechanical treatment from that round may enter synthesis.

Reset one removed paper, press, printer, strip, rail, carriage, stamp, proofglass, card and grid language before the final permitted generator round. Round two produced three genuinely distinct spines:

| Concept | Distinct spine | Historically informed disposition |
|---|---|---|
| The Judgement Balance | A reversible torsion balance calibrates one important question and the evidence needed to test it. Desktop uses a large pointer instrument; mobile uses one-thumb linear detents. | Sole salvageable seed. The submitted Brain-versus-GTM anchors were rejected because ordinary offer links cannot become competing weights or controls. |
| The Focal Plane | A brass objective and focus collar resolve the complete paid-proof sequence through optical depth. | Rejected. Both primary judges identified it as a direct recurrence of Proofglass and the Brain optical language rather than a genuinely new signature spine. |
| The Keyed Instrument | Two differently cut offer keys align one open cutaway cylinder and resolve a deterministic record. | Rejected. Key and lock semantics turn ordinary offer links into gates and imply secrecy, restricted access or vendor lock-in. Removing those semantics would remove the concept's core premise. |

Both fresh historically informed judges passed pairwise diversity but found no submitted candidate eligible. They independently rejected the optical and lock directions. One preferred the balance's phone choreography; the other preferred the open mechanism's originality. A third blinded tiebreaker, given the same history and rubric without earlier verdicts, selected the balance as the sole salvageable synthesis seed and prohibited a fourth concept round.

Reset two precedes synthesis. Candidate names, layouts, offer selectors and presentation rationales are discarded. The retained invariant is narrower: one physical instrument calibrates one real decision against the evidence needed to test it, and every reading exposes buyer-meaningful proof rather than ornamental or numerical precision. Brain and GTM remain persistent ordinary links outside the mechanism. Exactly one filled `Start here` action returns a useful deterministic decision record before email. The private commercial boundary remains cold-visible beside that action.

Feasibility lock:

- the instrument is progressively enhanced from semantic links, a native range control, labelled output and ordinary buttons; pointer choreography never owns meaning;
- the range maps to complete reviewed sentences, not percentages, fake scoring or generated advice;
- desktop may use precise pointer, wheel and keyboard control, while phone uses one broad vertical thumb control with explicit tap alternatives and no circular or precision drag requirement;
- `ready-for-decision` remains generated illustrative atmosphere behind a separate aperture and never becomes client, product or transaction evidence;
- the complete offer, private boundary, decision-record fields and recovery path survive reduced motion, Save Data, unavailable media, no JavaScript and 200-percent text;
- no public price, public duration, new offer, diary link, guarantee, production file or shared route may enter the synthesis.

Selected synthesis: **COMMERCIAL-READINESS-S4 / The Decision Balance**.

Reset count before synthesis: **2**.

Material status: **authorised for one isolated render, not yet approved**. Production implementation, commit, merge, preview, deployment, publication and manifest promotion remain unauthorised.

### Commercial-readiness S4 synthesis: COMMERCIAL-READINESS-S4 / The Decision Balance

The single authorised S4 synthesis is rendered only under `prototypes/website-redesign-recovery/commercial-continuity/` as `index-readiness-s4.html`, `styles-readiness-s4.css`, `script-readiness-s4.js`, `review-readiness-s4.html` and `check-readiness-s4.mjs`. No public route, shared production component, production style, approved manifest or continuity contract was changed.

The desktop surface is a film-backed split instrument. The complete offer, two ordinary Brain/GTM links, private written commercial boundary and one filled `Start here` action remain cold-visible beside a brass balance that advances through `Decision`, `Evidence`, `First version`, `Real work` and `Yours`. Native scroll advances and reverses the reading; the range and five semantic stage controls reach the same states directly. Portrait mobile is independently sequenced as a film-led one-idea arrival followed by a broad thumb-controlled balance. Short landscape is a compact composition rather than a scaled desktop canvas. The moving film remains generated illustration and never represents client evidence.

`Start here` returns `Your first decision record` before any email request. It preserves the entered decision through correction, exposes what AI may carry, where human authority remains, what first version to try, what proof to watch and what is handed back, and states that nothing has been sent. Close, Escape, change, copy and reopen states are recoverable. The result is deterministic and does not claim bespoke AI reasoning.

Routine defects closed before freeze were: a primary action falling below the first portrait and landscape views; a text-only black mobile arrival; a fixed header clipping the instrument title; a film aperture causing 19-to-26-pixel horizontal overflow; inconsistent dialog focus timing in WebKit and Firefox; short-landscape concealment of the `Nothing has been sent` consequence; and an over-constructed result heading. These corrections did not change the selected material spine.

The deterministic S4 gate returned `failures: []`. Chromium passed all 11 required viewports; WebKit and Firefox each passed five representative viewports. The gate exercised desktop scroll and reversal, range and stage equivalence, the complete Start here input/result/copy/change/close/reopen journey, reduced motion, Save Data, no JavaScript, unavailable media, 200-percent text including the `225 x 568` proxy and review-wrapper geometry. Current physical iPhone Safari with VoiceOver and Android Chrome with TalkBack remain **not run**.

Frozen candidate: `7869e545759a5b53a710c4b2d512b16de33b1e7b2bb08fdad30d201bea6672cf`. File hashes are HTML `74795539d8517f7a9005061a0400bc2b57cc7ced7ecf7047067af9b71cfdbf45`; CSS `62ea24a3bf36212ee04555b447c27a8557403cab79a32c72ba23af07ba171d4e`; JavaScript `451bad24d3126da11add67a3e885f0348d03ace8d7fb3ad39ff3eee0b365ada9`; review wrapper `23c3e04f884b802c1df631a561fe8857a7fbfff6c4526cfe42e5d716e957eda7`; gate `37b7a96af71fbd5488b61a770a6d53ece54aa57a70be31a075e78ebe7a2218d8`. Paired-review evidence at `C:/Users/krish/.scratch/mindmake-commercial-readiness-s4/paired-review.png` is `7b9481a1997eb5f75b3436fe9f668dbecbf16c1a519e770a421dd551ec41c2e4`.

The independent history-blind S4 panel did **not** return `world_class_winner`. Desktop scores were art direction `8.8`, originality `8.6`, immersion/interaction `8.9`, buyability/trust `8.2` and UX/content/technical `8.0`. Mobile scores were art direction `7.2` provisional, originality `7.8` provisional, immersion/haptics `5.5` evidence-limited, buyability/trust `7.8` and UX/content/technical `7.4`. The desktop jurors found a memorable brand-specific physical metaphor, controlled composition, strong reversible choreography and unusually explicit ownership and commercial boundaries. Remaining material ceilings were implicit audience recognition, limited proof on the landing surface and originality concentrated in the balance rather than the complete field.

The blind mobile result is not release-eligible. Its jurors did not complete the required `320 x 568`, touch, reduced-motion, full keyboard or copy-consequence observations; these items remain inconclusive even though the independent deterministic gate passed them. The art juror also saw an almost blank `844 x 390` frame in the review wrapper. That conflicts with the deterministic direct-candidate and review-geometry passes and may be a wrapper-load observation rather than the responsive candidate, but a conflicting blind hard-gate observation cannot be promoted or silently converted to a pass. A fresh exact-candidate blind run must close it after any owner-approved material response.

Material status: **one isolated rendered S4 synthesis awaiting Krish's explicit approval**. It is not production-integrated, source-approved, committed, merged, previewed, deployed, published or live. Exact approved r1 source parity remains **10 of 14**. MMF-018, a fresh fully green continuity aggregate, exact final-source manifest, `world_class_winner` result and physical-device evidence remain open; no promotion is authorised.

### Commercial-readiness S4 routine fit lock: COMMERCIAL-READINESS-S4-R2

Owner finding: the presented S4 surface did not fit neatly inside Krish's `1538 x 636` desktop window and the logo remained visibly misaligned with the content grid. Krish identified both as basic repeat regressions that had already been corrected many times elsewhere. This is classified as a routine viewport, alignment and regression-check repair inside the S4 spine. The offer, hierarchy, film, balance, five readings, scroll interaction, Start here journey, responsive sequence and material language remain unchanged.

The failure was not missing history. MMR-003 already required logo, navigation, hero and section anchors to agree within two CSS pixels, while MMR-016 already required the complete paid-proof promise and action to compose inside one primary desktop viewport. The S4 CSS nevertheless used `3vw` for the header and `3.8vw` for the offer content, producing a measured `12.3125` CSS-pixel drift at `1538 x 636`. Its deterministic matrix began desktop coverage at `1440 x 700`. Its review test used a fixed `1000`-pixel height and checked only whether scaled canvases escaped their own boxes, not whether the presented desktop composition fitted the actual browser window. The green result therefore proved the wrong conditions.

The locked correction is additive. Baseline S4 HTML `74795539d8517f7a9005061a0400bc2b57cc7ced7ecf7047067af9b71cfdbf45`, CSS `62ea24a3bf36212ee04555b447c27a8557403cab79a32c72ba23af07ba171d4e` and JavaScript `451bad24d3126da11add67a3e885f0348d03ace8d7fb3ad39ff3eee0b365ada9` remain byte-identical. `index-readiness-s4-r2.html` differs from the baseline HTML only by its title and one additive stylesheet link. `styles-readiness-s4-r2.css` creates one shared responsive gutter for header and content, and introduces a height-aware short-desktop composition below `681` CSS pixels without changing words, controls, states or interaction. `review-readiness-s4-r2.html` scales desktop and portrait evidence against the actual available review height and proves that every iframe contains the current candidate rather than a blank or stale document.

The strengthened checker makes the remembered rules executable. It asserts no more than two CSS pixels of logo-to-content drift, complete cold first-screen containment, the exact `1538 x 636` and `1366 x 640` short-desktop cases, real review-window fit, non-blank current-candidate iframes, and the original full interaction and recovery contract. The final result is `failures: []` across 13 Chromium viewports and six representative viewports each in WebKit and Firefox. The exact `1538 x 636` render has zero grid drift; the offer panel ends at pixel `636`, the primary action at `543.703125`, and the final stage control at `622`.

After the contract and gate correction, `qa:website-restart` passed 49 rulings, 19 verified findings, 13 routes, 12 required viewports, five continuity guardians and ten blind judges. `qa:website-approved-visuals` started and stopped its own Vite server at the exact ephemeral origin `http://127.0.0.1:63149`; the approved Brain r5 and GTM r6 suites both returned `failures: []`. Exact approved r1 production-source parity remains `10 of 14`.

Frozen R2 candidate manifest hash: `f7b9b8f3e9da6982d8ba8608332fc1dfb29394d6f1b93aa6286f763ea535b19e`. New file hashes are HTML `971f630c8e3122c18b4fa6d41e4b2e83f8c88addbe94d665762e9c6c6ccf014d`; additive CSS `04fb946dc4376ff8c963b88fe6dfc60cb183f3523cbd345dc9705ab5e28070ed`; review wrapper `2ecf3ca6538c600f7c40d28b10a09075ac7e2c9c119a8f35189d04a04f7b3032`; checker `96c22d88b43e99fae5230a7f3d5bc146f42dbb928e34d09e3cb881a86eef0624`. Exact short-desktop evidence at `C:/Users/krish/.scratch/mindmake-commercial-readiness-s4-r2/chromium-1538x636-cold.png` is `7734ce8c95d06dca84d6b8a51c2fd187fd4e10328c22fafd7c760e31e01ab392`; the actual-window review evidence is `bf42c42699599faffdbe5d5dace110d84e9c29bfbd12eef523c6095945c867d9`.

MMF-019 now records the repeat failure and its durable acceptance contract. `1538 x 636` is a required viewport. The repaired S4 surface remains an isolated candidate awaiting Krish's material reaction; this routine fit lock is not production integration, source approval, commit, merge, preview, deployment, publication or promotion authority.

### Commercial-readiness S4 exercised-state fit lock: COMMERCIAL-READINESS-S4-R3

Owner finding: after R2 was presented as corrected, completing and then reopening the Start here decision record could leave the underlying commercial surface beneath the fixed navigation. This was a routine state-recovery and regression-gate failure inside the already selected S4 spine; no hierarchy, copy, material language, offer, proof sequence or interaction model changed.

The exact cause is verified. Chromium's modal autofocus changed two independent positions on the second open: the document moved to `scrollY: 413` and the overflow-hidden sticky shell acquired `scrollTop: 75`. That placed the offer panel at `-7` CSS pixels even though its cold position was `68`. The R2 checker had already observed this exact `offer-panel y: -7` failure after exercise, but then called its final assessment with first-screen containment disabled. It therefore converted a known failure into a green result. This is why the repeated nav-overlap rule appeared to be forgotten: the rule existed, the checker saw the breach, and its exercised-state waiver defeated it.

R3 preserves the baseline S4 and R2 files byte-for-byte. `index-readiness-s4-r3.html` adds only the state-safety module to the R2 candidate. `script-readiness-s4-r3.js` captures and restores both document and sticky-shell scroll positions across modal open, close, cancel and completed-record reopen, while restoring trigger focus without scroll. The new checker never waives containment after interaction. It exercises open, complete, close, reopen, change and close from a non-zero scroll position; requires both scroll positions to remain within one CSS pixel; requires the offer and headline to remain below the fixed-nav reserve; and adds the observed `1108 x 574` compact-desktop viewport to the permanent matrix.

The R3 gate returned `failures: []` across 14 Chromium viewports and six representative viewports each in WebKit and Firefox. The unchanged-neighbour R2 full interaction gate also returned `failures: []`. Exact R3 source hashes are HTML `104b1872fb6c8051fde5bba708259e0bc0d82d77b9954bbcfab4d08e41bddabe`; state-safety JavaScript `cf5ba4788afc7ad32da07c515cfedd479ca5c68d4d82fe32d5100ec5a09e5469`; checker `413e8bf6bebd1ab66d585a4da5090361f9e94ed4555151ae9c53a4fafbea8ce7`. Post-recovery evidence is `C:/Users/krish/.scratch/mindmake-commercial-readiness-s4-r3/chromium-1108x574-after-recovery.png` SHA-256 `88a0b84a91a317acdc1f11f8123214e45d57e0d2c0c6a5ad5d3a577aeee2ca33` and `C:/Users/krish/.scratch/mindmake-commercial-readiness-s4-r3/chromium-1538x636-after-recovery.png` SHA-256 `9b9dd841aa7dbb4c23580135c7ddc1121aa999e7be64eabc415efe33453cb78a`.

MMF-020 records this exercised-state failure and its durable acceptance contract. `1108 x 574` is now a required viewport. R3 remains an isolated routine correction: it is not production integration, a source approval, a commit, a merge, a preview, a deployment, publication or promotion authority. Physical iPhone Safari with VoiceOver and Android Chrome with TalkBack remain not run.

After recording the finding, `qa:website-restart` passed 49 rulings, 20 verified findings, 13 routes, 13 required viewports, five continuity guardians and ten blind judges. It continues to report exact approved r1 production-source parity as `10 of 14`. `qa:website-approved-visuals` started and stopped its own Vite server at `http://127.0.0.1:60419`, passed that exact origin to both suites and returned `failures: []` for approved Brain r5 and GTM r6. The approved visual prototypes remain retrievable and no candidate manifest was substituted.

Handoff failure and correction: the R3 link was later opened after its temporary Vite runtime had ended. Port `4198` had no listener and the exact page returned connection refused. This was not a source or render failure; it was a delivery failure caused by presenting an ephemeral test origin as though it were a retained review surface. The fixed-port `review:website-recovery` launcher now names the governed local runtime. Before the corrected handoff, port `4198` was verified listening, the exact R3 URL returned HTTP `200` with the expected candidate title, the visible browser completed the current document with the state-safety module active and zero console errors, and the tab was explicitly retained. MMF-021 makes those four observations a hard precondition for every future local review link. This local runtime is not a production preview or deployment.

Scaled-Windows fit correction: the owner then observed the green Start here action beneath the Windows taskbar on a wide desktop. The supplied `1844 x 912` physical-pixel capture reproduced as an effective `1475 x 730` CSS viewport at 125-percent display scaling. At that exact viewport the action ended at `762.8125`, 32.8125 CSS pixels below the usable screen, and the proof-stage controls ended at `771.65625`. The existing compact-desktop composition stopped at `720` CSS pixels, so a one-pixel increase selected the uncompressed layout and created a breakpoint cliff.

The correction is additive and routine. `styles-readiness-s4-r3.css` extends the already accepted compact composition only through the `721` to `850` CSS-pixel desktop-height band. At `1475 x 730` the corrected action ends at `660.0625`, leaving `69.9375` CSS pixels of clear usable screen; the stage controls end at `706`. The same fit passes at `1536 x 768`, `1600 x 768`, `1844 x 912`, `1920 x 850` and the previously locked short-desktop sizes. The strengthened gate now requires a 24 CSS-pixel primary-action reserve and ran the complete modal and scroll recovery sequence with `failures: []` across 17 Chromium viewports and seven representative viewports each in WebKit and Firefox. The isolated Firefox contexts completed with zero harness warnings.

Current R3 hashes superseding the earlier pre-scaled-Windows candidate hashes are HTML `0bcaad80c828eea0033a4cdabbf0e9ad0973b674720ec85a5805f5f862800495`; additive CSS `22dd1c403e652306ae8717557a3ba96b6862650ce6e5988e685e33b57a50f2c5`; state-safety JavaScript `cf5ba4788afc7ad32da07c515cfedd479ca5c68d4d82fe32d5100ec5a09e5469`; checker `541b872572d1f3f02bb510c6678032e9517c2fef05a44185f91f17e888d828ad`. Exact post-recovery evidence at `1475 x 730` is `C:/Users/krish/.scratch/mindmake-commercial-readiness-s4-r3/chromium-1475x730-after-recovery.png` SHA-256 `a576b14164d703bc0906980e3b2c5fd96cd9eccd232b919ea88d6ff217c1743e`. MMF-022 records the breakpoint-cliff failure and `1475 x 730` is now a permanent required viewport. This remains an isolated routine correction, not production integration or deployment authority.

### GTM divergence: GMR-SB-2026-09-17.1

The generator brief contained the required outcome, MMR invariants, real GTM signal fixture and data constraints, and distilled failure requirements. It excluded every r8 layout, rationale and implementation reference.

| Concept | Distinct spine | Feasibility disposition |
|---|---|---|
| CAM-05, The Outcome Cam | A scroll-driven barrel cam mechanically advances one response through four linked commercial stops before issuing a test slip. | Discarded. Despite a credible physical metaphor, its four-stop scroll sequence repeats the staged-route grammar already overused in rejected work and creates an overlong mobile path. |
| B1, The Consequence Linkage | A stationary market signal and full response paddles drive one continuous linkage under glass, changing four connected business consequences and a customer test in place. Mobile becomes an independently sequenced single-consequence rocker. | Selected. It changes the interaction grammar, makes cause and effect directly manipulable, keeps response labels visible, and can reflow without turning into a card wall. |
| C-03, Counterproof | A proofing press compares a selected response with a counterproof, then commits the result across fixed consequence stations with undo. | Discarded. The press plus four stations repeats the rejected industrial-panel/station pattern and makes comparison more prominent than the requested causal sequence. Preserve only its clear changed-state marking and one-level undo behaviour. |

Pairwise distance passed: every pair differs on at least two of composition, interaction model, hierarchy, motion model and material metaphor.

Two fresh-context historically informed judges received the complete approved and rejected history in different anonymised orders. Both independently selected B1. Both rejected CAM-05 as a disguised return to a scroll-synchronised four-stop route, and C-03 as a return to the press/four-station grammar. No tie-break was required.

### Reset trace, GTM

Before synthesis, the candidate layouts, names and presentation rationales were removed from the implementation brief. The synthesis restarted from the selected causal invariant only: one signal, one chosen response, four visibly linked consequences and one customer test. No candidate markup, geometry or styling was reused.

Feasibility lock:

- semantic radio controls and normal-flow text own meaning; the mechanical linkage is decorative;
- every one of the five real signals supports all three responses, four consequence values and a customer test;
- desktop shows the complete causal system in one instrument; mobile shows one consequence at a time with persistent response context and explicit back/next controls;
- response changes expose exactly one reversible undo action and mark changed consequences without colour-only meaning;
- keyboard, touch, 320px reflow, 200% text, reduced motion, no-JavaScript meaning and ready, stale, quiet, error and conflicted evidence states are required;
- the isolated render must not imply live data, write to production, or alter a public route.

Selected synthesis: **GTM-LINKAGE-S1, Consequence Linkage**.

Reset count before synthesis: **1**.

Exact rendered synthesis shown for cold review: `GTM-LINKAGE-S1`, paired desktop/mobile render `prototypes/website-redesign-recovery/gtm-market-change/paired-review.png`, 1500 x 1600, SHA-256 `b434bfd47bad3a0cf696c4eb18f3fbbb649ddc331df81b169edba097f545a4c1`. Supporting full renders: desktop 1440 x 2397, SHA-256 `9b21b0974c563159a232d4cd35869519c0131e64466f2c13a58a81ef60a4c979`; mobile 390 x 2257, SHA-256 `268b0348a07fc927d2ec45d4f2a0c935c8180f17e137333700f698dcee203a71`.

Task-first validation: **PASS** on a script-owned Vite origin. Exercised 1440 x 900, 390 x 844, 320 x 568, 430 x 932 and 844 x 390; all five signals and all three responses; four consequences and customer test; one-level undo; native radio keyboard movement; the complete reversible mobile sequence; ready, stale, quiet, error and conflicted evidence states; reduced motion; 200% base text; no-JavaScript meaning; target size; runtime errors and horizontal overflow.

This remains an unapproved material concept. Do not implement it into `/ai-gtm`, alter shared production surfaces or proceed to Brain until Krish explicitly approves the rendered material surface.

### GTM same-spine revision 1: GTM-LINKAGE-S2

Owner reaction to S1: the content is good. The surface needs either thoughtful, classy iconography or real-world imagery, plus scroll-initiated build and animation. Krish supplied an in-progress growth-machinery contact sheet as the provisional visual direction and noted that matching Higgsfield videos are being created.

Revision response:

- preserved the accepted market-signal, direct response, four-consequence and customer-test content without reopening discovery;
- integrated only the clean central machinery frame from the supplied still, excluding the frames containing approval and sign-off language;
- treated the still as a provisional motion source, not as final production media;
- made page scroll assemble the machinery, linkage traces, hub and consequence leaves from idle through building to the complete state;
- made reduced motion and no-JavaScript states resolve to complete readable meaning;
- retained the independent mobile consequence sequence and its single next/back action.

Exact revised synthesis shown for cold review: `GTM-LINKAGE-S2`, paired desktop/mobile render `prototypes/website-redesign-recovery/gtm-market-change/paired-review.png`, 1500 x 1600, SHA-256 `60445c0f5d6d25ff84bb702a9829aadbcd7e04d3b92559da8876c80d5f78fa8a`. Supporting full renders: desktop 1440 x 2366, SHA-256 `4c8c4f74f1921e2c64ff2776fd91436584bbc963023012dcf858e63a1df6596a`; mobile 390 x 2233, SHA-256 `b9d27e952a48085bfcbb3df129f2e5e0e06d5477cdb3bc3867440f3013e0c595`. Supplied reference asset: 1536 x 1024, SHA-256 `269c769bc9ebe15b2250d5c001405b8de4270f101821426bbbfb28c0d55c01df`.

Revision count in the Consequence Linkage spine: **1**.

Task-first and verification gates: **PASS**. The script-owned runtime proved idle, building and built scroll states; all prior response, consequence, undo, mobile, evidence-state, reduced-motion, 200% base-text, no-JavaScript, target-size, runtime and overflow checks remain green. MMR-033 records the new material-direction ruling and the restart guardian now requires the complete ordered MMR-001 through MMR-033 set.

This revised surface was not approved. Krish retained the material direction but required a second same-spine revision, recorded below. Production implementation and Brain remain paused.

### GTM same-spine revision 2: GTM-LINKAGE-S3

Owner reaction to S2: the material surface looks great, but the Step 01 signal boxes waste space and align poorly; the intended experience in Step 02 is unclear; and the New-age leadership thesis needs to become part of the GTM People consequence, with the same human-and-agent operating-model logic informing the other consequences.

Revision response:

- rebuilt Step 01 as one compact aligned signal rail on desktop and a non-scrolling two-column selector on mobile, removing the tall empty box fields and awkward narrow wraps;
- renamed Step 02 to Choose the move and added one direct instruction: pick the commercial move, then see what it changes;
- added an explicit Step 03 consequence threshold before the machinery and renumbered the customer test to Step 04;
- recovered the existing New-age leadership mechanics, including human decision rights, bounded agent work, standards, limits, exceptions and improvement, without reusing the old page layout;
- embedded a visible Human/Agent responsibility split inside Product, Price, Positioning and People for every response, with People keeping human judgment and exceptions legible;
- preserved the S2 machinery imagery, scroll build, reversible response controls, independent mobile sequence, evidence states and production freeze.

Exact revised synthesis shown for cold review: GTM-LINKAGE-S3, paired desktop/mobile render prototypes/website-redesign-recovery/gtm-market-change/paired-review.png, 1500 x 1600, SHA-256 818691fb6c3fd50b1549d734723acaea1ce216e46f4d8dcc99b8d5b692a0b8b5. Supporting full renders: desktop 1440 x 2552, SHA-256 42df8b29b9c47b5f5cb1e6b895bc44841d7ab3368a614a049d1c694f92fdc4df; mobile 390 x 2548, SHA-256 08153dcea003e3981030e7a3eb7c524eebb6ece9477dcf4a5b610ae2a76298f8.

Revision count in the Consequence Linkage spine: **2**. A further material rejection triggers fresh divergence before any additional synthesis in this spine.

Task-first and verification gates: **PASS**. The script-owned runtime proved the compact desktop rail, non-scrolling mobile selector, explicit Step 02 decision job, all five signals by three responses, all four Human/Agent responsibility splits, reversible mobile sequence, one-level undo, keyboard operation, idle/building/built scroll states, ready/stale/quiet/error/conflicted evidence, reduced motion, 200 percent base text, no-JavaScript meaning, target size, focus-only skip-link reveal, runtime health and overflow. The final evidence capture uses deterministic final-render mode, so off-screen fixed controls do not appear in stitched screenshots.

MMR-034 records this material-direction ruling. This revised surface remains unapproved until Krish responds to the cold S3 render. Production implementation and Brain remain paused.

### GTM owner ruling: conditional material lock

Krish approved GTM-LINKAGE-S3 on the explicit assumption that the finished surface adds the moving growth-machinery background, makes the surrounding sections more visual rather than reading as one uninterrupted black background, and keeps the causal build driven by scroll.

Locked now:

- the market signal, commercial move, four linked consequences and customer-test sequence;
- the compact Step 01 selector and explicit Step 02 decision job;
- the Human/Agent responsibility layer across Product, Price, Positioning and People;
- the desktop linkage instrument and independently sequenced mobile consequence flow.

Open material condition:

- integrate the real supplied growth-machinery motion asset when it exists;
- make movement and section-to-section visual differentiation carry meaning rather than decorate the background;
- preserve scroll-built causality and reversibility, while reduced motion, no JavaScript and unavailable-media states resolve to complete readable meaning;
- render the combined motion treatment for Krish before calling final GTM material approval complete.

Authority effect: the GTM composition and interaction spine is locked, so isolated Brain signature concept work may begin in prototypes/website-redesign-recovery/brain-signature/. The public /ai-gtm route, shared production files and production styles remain frozen. No actual video asset has been supplied yet, so the moving-media condition is open rather than inferred as complete.

MMR-035 records the conditional approval and its exact completion test.

### GTM routine locked revision: GTM-LINKAGE-S3-FIT

Owner finding: the first market-signal composition did not fit cleanly inside a common desktop viewport, leaving the readout mid-thought. The same boundary risk needed direct mobile proof.

Classification: routine viewport, spacing and regression-check correction inside the conditionally locked S3 surface. The visible hierarchy, content, two-column mobile selector, response interaction, consequence machinery, Human/Agent roles and scroll-built causal model remain locked.

Locked-revision proof:

- The S3 baseline remains byte-preserved: index.html SHA-256 8fd9b051275bcba3f80676e298f8d60e351bcb0bde82725ff1b82de7e6742e65; styles.css SHA-256 6b97b5310fbde129fc2b8f0157f428e15faaa450a4fb8330a52cb5fb10c263b1; script.js SHA-256 dafd80d54f24b7f4154a7326522d03d92edca9e999e7e1a09fb4f31856fe9dce; check.mjs SHA-256 1ee80ec87f908872b503393cb63b0074e1df027fe04d041046d7b5da8acc27a1; paired-review.png SHA-256 818691fb6c3fd50b1549d734723acaea1ce216e46f4d8dcc99b8d5b692a0b8b5.
- Candidate index-fit.html differs from the baseline HTML by exactly one additive stylesheet link. The unchanged script.js remains the interaction source.
- The fit delta lives only in styles-fit.css. It adjusts vertical geometry and height-aware spacing; it changes no copy, control, state, fixture or causal transition.

Exact candidate render: paired desktop/mobile first-screen proof prototypes/website-redesign-recovery/gtm-market-change/paired-fit.png, 1500 x 720, SHA-256 6e50035608e05e623e917536fcaa448ae428a1f5db6215f3ac770abd3d19ee30. Supporting full renders: desktop 1440 x 2345, SHA-256 513b7c3537f21eaf58fffe2042cee8fe7603deee6c58084ebe1a84731d0ab472; mobile 390 x 2250, SHA-256 f63b346293eb27c0a8616a769573e9275e975e5a43dc1119285267ecd45f39b4. Candidate source hashes: index-fit.html 5627da62409a76cc58de393457f9ce96fc40c2a08558c6d3cfc9feb8694b36b8; styles-fit.css 22f57b32606dc93d529a42a7ed9ca5055d53851029c81f7554ea6c8716cb6c36.

Task-first and deterministic result: **PASS**. The complete market-signal deck fits inside 1880 x 953, 1440 x 900, 1440 x 700 and 390 x 844, and the next section begins below the fold at each size. The 320 x 568 and 844 x 390 views retain natural page scrolling without horizontal overflow, nested scrolling or clipped controls. All five signals across all three responses, Human/Agent consequence splits, one-level undo, keyboard operation, mobile progression and reversal, scroll build, no-JavaScript meaning, reduced motion, evidence states, target sizes and overflow remain green.

MMF-012 records this verified viewport-boundary finding and its release regression condition. The GTM moving-media material condition remains open and this routine revision does not authorise public implementation or release.

Owner ruling: Krish said the fit treatment "looks good", so `GTM-LINKAGE-S3-FIT` is the locked viewport treatment. The supplied growth-machinery video is reserved for the top-section background when it arrives. The rest of the sequence must receive purposeful visual ground changes so it never becomes uninterrupted black block backgrounds from end to end. This locks the viewport correction but does not close the combined motion-and-section-differentiation material pass. MMR-036 records the ruling and its completion test.

### Brain fresh divergence

The Brain generator brief contained the locked Decision, Brain, Evidence and Correction outcome; the real 20-meaning, 18-relationship, 10-source and 3-correction fixture; the selected BI-003 evidence chain; mobile, state, accessibility and data-honesty constraints; and distilled failure requirements. It excluded r8, every rejected layout and rationale, the approved r5 composition, and the other generators' work.

The first blind set converged: two independent arms produced substantially the same proof-press spine. That set was rejected before judging as insufficiently diverse. One bounded second-round arm targeted the missing non-print spatial territory while keeping the same content and constraints.

| Candidate spine | Distinct premise | Decision |
|---|---|---|
| BRAIN-A, Judgement Loom | Sources, relationships and meanings form one physical weave; tracing and correction lift and rework the actual provenance. | Strong minority. Distinct and feasible, but the textile metaphor risks redressing the approved relationship field without making the evidence challenge as commercially clear. |
| BRAIN-C, Proof Press | A labelled type field exposes evidence below one meaning and rehearses a correction through a two-detent scope gauge. | Discarded. The first round duplicated this print/press territory, the speculative rehearsal is less authoritative than the fixture, and the metaphor repeats rejected press grammar across GTM and Brain. |
| BRAIN-D, Alignment Bench | Two real source beams focus into BI-003; temporarily masking SRC-002 shows which relationships remain supported or become challenged before the recorded correction narrows the rule. | Selected. It creates a truthful, immediately visible source challenge, keeps the full Brain present, separates Brain from GTM materially, and makes correction a causal change rather than a document view. |

Pairwise distance passed after the additional round: every retained pair differs on at least two of composition, agency, primary interaction, information structure, state model, motion model and material metaphor.

Two fresh-context historically informed judges received the approved r5 baseline, r7's unapproved status, r8's complete rejection, the continuity contract and the candidates in different anonymised orders. Both independently selected the Alignment Bench, hard-failed the Proof Press, accepted the diversity set and required no tiebreaker. The Judgement Loom remains the fallback if the optical field cannot stay legible without becoming a graph with decorative rays.

### Reset trace, Brain

Before synthesis, the candidate names, layouts, material rationales and presentation copy were removed from the implementation brief. The synthesis restarted from the selected causal invariant only: a real decision resolves into one supported meaning; the complete Brain remains inspectable; one temporary source mask visibly changes support without mutating canonical confidence; the recorded correction narrows the rule; current state and history remain recoverable.

Feasibility lock:

- semantic HTML owns all 20 meanings, 18 relationships, 10 sources and 3 corrections; SVG and optical motion are presentational only;
- the source action is labelled as a temporary inspection, never deletion, saved correction or confidence mutation;
- masking SRC-002 leaves BI-003 supported by SRC-010, leaves REL-003 supported through SRC-010, and marks REL-009 and REL-010 challenged without removing their wording or topology;
- Correction restores the exact approved r5 visible wording: earlier, "Consequential work always required human release"; corrected, "Externally consequential work requires human release. Reversible internal drafts may stay delegated";
- the fixture lacks a complete authoritative v1 record, so the surface keeps that provenance limit visible rather than claiming the sentence came from the fixture;
- all three correction records remain reachable;
- desktop must prove the focal path dominates without tiny labels, overlap, nested scrolling or a card wall at 1440 x 700 and 200 percent text;
- mobile is a natural-height single-beam inspection with one meaning, one visual and one action at a time, never a miniature desktop field;
- reduced motion, no JavaScript, loading, stale, error and recovery states preserve all four locked views and explicit current or challenged labels;
- the surrounding ground changes materially through the sequence so the experience does not read as black background end to end.

Selected synthesis: **BRAIN-ALIGNMENT-S1, Alignment Bench**.

Reset count before Brain synthesis: **1**.

### Brain synthesis render: BRAIN-ALIGNMENT-S1

The isolated synthesis was built only in prototypes/website-redesign-recovery/brain-signature/. Public routes, shared production components and production styles remain unchanged.

Exact cold-review render: paired desktop/mobile view prototypes/website-redesign-recovery/brain-signature/paired-review.png, 1500 x 1600, SHA-256 6bc9c59fc4f5773171e3190268d1d86c6fde4afa80cdd94456669621f817079b. Supporting full renders: desktop 1440 x 4858, SHA-256 6c7f596a76a3116217b58d960051f7e57bb4602505ed1345f829c2b9b968ab67; mobile 390 x 6576, SHA-256 a203a4da0447ae00d2a0cc3b7be0733721b2ff769d3db1e86adeec95bfe7b9fc.

Task-first and deterministic result: **PASS**.

- The runtime uses the approved synthetic fixture and exposes all 20 meanings, 18 relationships, 10 sources and 3 corrections.
- Desktop scroll moves the decision carriage from idle through building to built and reverses it on upward scroll.
- Every desktop meaning has a keyboard-operable 44 x 44 pixel control and resolves the real fixture record in the inspector.
- Temporarily masking SRC-002 leaves BI-003 supported by SRC-010, leaves REL-003 supported through SRC-010, marks REL-009 and REL-010 challenged, leaves canonical confidence direct and restores cleanly.
- The correction replays the exact approved earlier and corrected wording, returns to current v2 and keeps the missing full-v1 provenance limit explicit.
- Mobile uses one focused beam, one meaning and one primary action at a time. The complete record remains reachable without a nested scroller.
- The checks pass at 1440 x 900, 1440 x 700, 390 x 844, 320 x 568, 430 x 932, 844 x 390 and 390 x 844 with 200 percent base text.
- Reduced motion and no JavaScript retain all four phases and the complete record. Ready, loading, stale, error and recovery states keep the last known record readable.
- The final rendered inspection found no clipping, overlap, horizontal overflow, blank box field, awkward alignment drift or hidden primary consequence.

This validated material concept was rejected. Krish found the section sizing unresolved, the visible language too technical, the expandable complete record too long and passive, and the visual treatment too close to black background plus text. The current Brain network visual and typography remain useful strengths. The rejection changes interaction, hierarchy and signature visual language, so it is material rather than a routine fit repair. S1 remains preserved as evidence and is not a design or implementation foundation for the revision.

### Brain same-spine revision 1: BRAIN-ALIGNMENT-S2

Owner direction for S2: keep the Brain's focal network visual and fonts; make the experience inspiring and immediately understandable; fit each chapter cleanly to the viewport; replace the expanding complete-record destination with one vertical carousel that makes the whole Brain look alive in real time; and ensure no section on Brain or GTM resolves to a black background carrying only text.

Revision response:

- retained the Alignment Bench's causal invariant, fixture truth, focal Brain network and approved type roles while rebuilding the visible hierarchy and interaction;
- replaced codes and specialist inspection language in the main story with one plain sequence: remember, check, learn and keep;
- turned the complete 20-meaning, 18-relationship, 10-source and 3-correction record into one fixed-height 51-entry vertical reel with automatic movement, pause and manual advance, plus a complete non-expanding accessible record;
- gave every chapter a distinct material ground and visual event: living optical Brain, warm paper map, evidence beams, correction gate and brass record reel;
- kept the source test and correction causal, truthful and reversible without exposing record identifiers as the visitor's task;
- treated each desktop and primary mobile chapter as a bounded viewport composition, with natural-height reflow only at compact and landscape edge cases.

Exact revised cold-review render: `BRAIN-ALIGNMENT-S2`, paired desktop/mobile render `prototypes/website-redesign-recovery/brain-signature/paired-s2.png`, 1500 x 1600, SHA-256 `5bf0fed49f34842870661d358cc1525397663da6cc9674a7c9d87a778976f93d`. Supporting full renders: desktop 1440 x 4290, SHA-256 `784deaa5dc692fe0b448f9b8254959414b7fb7529d3efd879619a29aaca66787`; mobile 390 x 4041, SHA-256 `142ce071a623b9c4f3d14582fa1e27aa01adcf3902670a7ca54f58fabb027142`. Candidate source hashes: `index-s2.html` `fe797bc208887c63a65e12bea98c543a088cbb14f566a69275f9a408ebba0123`; `styles-s2.css` `73be37eb68c46dd04e97be877aad5f8a560e870417c25811518699eeae1f5a49`; `script-s2.js` `0a399a7510cd0e3f83cc7bb2e92d63c25b34ee36cb2478630edba6490572118f`; `check-s2.mjs` `07fc63e45aa80ce158cdfe70f6c859f294eb3627cb1e6264b12485a601d883f3`; `review-s2.html` `aac231d7bd267e71cdcb47b5e6c9630944dd7045764c0424e585c135ed1ddfd9`.

Revision count in the Alignment Bench spine: **1**. A second rejected revised mock in this spine triggers fresh post-rejection divergence before another synthesis unless Krish explicitly asks to continue it.

Task-first and deterministic result: **PASS**.

- Every chapter fits cleanly at 1880 x 953, 1440 x 900, 1440 x 700 and 390 x 844 without clipped visible content or nested scrolling.
- The retained Brain visual exposes all 20 ideas through keyboard-sized controls and plain-language inspection at the point of action.
- All 51 records remain present in one fixed-height live reel. Automatic movement, pause and manual next all work without extending the page.
- The source check and correction remain causal and reversible. Scroll builds each instrument and upward scroll returns it to idle.
- The 320 x 568, 430 x 932 and 844 x 390 views use natural page height without horizontal overflow, nested scrolling or clipped controls.
- Reduced motion pauses the reel by default while keeping manual advance; 200 percent text, no JavaScript, ready, loading, stale, error and recovery states retain readable meaning.
- Full desktop and mobile renders were visually inspected after deterministic capture. No chapter is a black field carrying only text.

MMR-037 records the material direction. MMF-013 records the repeated Brain viewport-boundary failure and its regression condition. This is a validated but unapproved material revision. Krish's cold rendered decision is the next gate. Production routes, shared production components and production styles remain unchanged; no commit, merge, preview, deployment or publication is authorised.

### Brain routine locked revision: BRAIN-ALIGNMENT-S2-LOCK

Owner ruling: Krish said BRAIN-ALIGNMENT-S2 "looks great" and identified only text wrapping as the remaining issue. He explicitly asked for the correction to be fixed and the result locked as a durable system. This is the material approval for the S2 hierarchy, visual sequence, interaction model, typography and material grounds. The supplied video backgrounds remain a later media layer as assets arrive; they are not inferred as present or verified.

Classification: routine measure, wrapping, alignment and regression-hardening work inside an owner-approved material surface. The focal Brain, plain-language remember/check/learn/keep sequence, source test, correction interaction, 51-entry live record, chapter order and visible material hierarchy remain unchanged.

Locked-revision proof:

- The approved S2 baseline remains byte-preserved: `index-s2.html` SHA-256 `fe797bc208887c63a65e12bea98c543a088cbb14f566a69275f9a408ebba0123`; `styles-s2.css` SHA-256 `73be37eb68c46dd04e97be877aad5f8a560e870417c25811518699eeae1f5a49`; `script-s2.js` SHA-256 `0a399a7510cd0e3f83cc7bb2e92d63c25b34ee36cb2478630edba6490572118f`; `check-s2.mjs` SHA-256 `07fc63e45aa80ce158cdfe70f6c859f294eb3627cb1e6264b12485a601d883f3`; `review-s2.html` SHA-256 `aac231d7bd267e71cdcb47b5e6c9630944dd7045764c0424e585c135ed1ddfd9`; `paired-s2.png` SHA-256 `5bf0fed49f34842870661d358cc1525397663da6cc9674a7c9d87a778976f93d`.
- `index-s2-lock.html` differs from the approved S2 HTML only by its lock title and one additive `styles-s2-lock.css` link. It reuses the byte-identical `script-s2.js` interaction source.
- The additive lock stylesheet owns explicit display and body measures, balanced wrapping, material-panel containment, portrait-tablet geometry and compact-phone reflow. It changes no fixture, copy, control, action, state transition or record.

Exact locked evidence: paired desktop/mobile render `prototypes/website-redesign-recovery/brain-signature/paired-s2-lock.png`, 1500 x 1600, SHA-256 `9126ba8d4684f89d552f3a79279e14e8469e73955b6c2d3e434a2e544443766e`. Supporting full renders: desktop 1440 x 4290, SHA-256 `113c73b0127a9c25568d542b4319e87854e319fe8aba88362324331f74723ccb`; mobile 390 x 4041, SHA-256 `1c234d62f1d367d88a37c75b455138ab1a91b0f77ea34386fae3d58d43669cb2`. Candidate source hashes: `index-s2-lock.html` `32fe36fb55c66010dfdd2d2593b191012b37aff7165c3904eb18accb1bae8192`; `styles-s2-lock.css` `4dc5945f4bcd362f6588942566fd072a5489c12028abfdb3af3e7150a50fb490`; `check-s2-lock.mjs` `7b041ba56cc5c4c31a2ef1e0b8b5af4ebb6d1d95f3c55dfa8721e7bd9bb08417`; `review-s2-lock.html` `5cd6d6a01d85baffd01ae08123e941d7a3576197f47e95cc322f46cf1f7ef5b1`.

Durability gate: **PASS**. The lock verifier asserts the complete S2 baseline hashes and the exact allowed HTML delta, then exercises 320 x 568, 360 x 800, 390 x 844, 430 x 932, 768 x 1024, 844 x 390, 1024 x 768, 1280 x 800, 1440 x 700, 1440 x 900 and 1920 x 1080. Every size passes copy containment, last-line orphan, target-size, horizontal-overflow and nested-scroll checks; all eight primary portrait and desktop sizes keep every chapter inside one viewport. The source test, correction replay, all 51 records, pause, manual advance, 200 percent text, reduced motion and no-JavaScript recovery remain green.

Lock effect: BRAIN-ALIGNMENT-S2-LOCK is the approved Brain material spine. MMR-038 records the owner lock and future media constraint. MMF-014 records the verified wrap and material-boundary regression. Incoming videos may be mapped to chapter backgrounds, but they must preserve this hierarchy and interaction contract; if the moving treatment changes first notice, sequence or signature language, the combined desktop/mobile render returns to Krish as a material decision. Public routes, shared production components and production styles remain unchanged; no commit, merge, preview, deployment or publication is authorised.

### Accepted semantic film system and GTM material candidate: GTM-MOTION-S1

Asset recovery truth: the requested `src/assets/films/sep2026/` directory was absent from the current dirty branch. `origin/main` was fetched without merging, rebasing or changing the worktree, and only that missing directory was restored from `origin/main` revision `c12e5a2`. All six supplied MP4 files match the SHA-256 values in their README. The directory is untracked relative to the current branch and remains preserved with the rest of the dirty recovery state.

Owner ruling: Krish accepted the semantic integration recommendation and authorised execution. The films are meaning-bearing chapter instruments, not wallpaper:

- Home threshold uses `ready-for-decision`; Home Brain uses `evidence-connects`; Home GTM uses `quiet-workshop-growth`.
- GTM uses `quiet-workshop-growth` for its opening threshold and `signals-arrive` for Step 01, with no further video loops on the page.
- Brain uses `evidence-connects` for its opening while preserving BRAIN-ALIGNMENT-S2-LOCK.
- Start here result uses `opportunities-resolve`; New-age leadership uses `ready-for-decision`; Media, Blog, Answers and Subscribe use `communications-compose`.
- Case-study proof, FAQ, Contact and legal routes do not receive generated loops merely to add motion.
- Only one loop may play at a time. Offscreen motion pauses. Reduced-motion, save-data, no-JavaScript and unavailable-media states use complete poster-backed meaning. Video is never scroll-scrubbed.

MMR-039 records this accepted system mapping and its material approval boundary.

GTM-MOTION-S1 is an additive candidate over the byte-preserved GTM-LINKAGE-S3-FIT baseline. It adds exactly two decorative film scenes, one additive stylesheet and one additive controller reference. It does not change the locked copy, signal selector, Step 02 decision job, response controls, Human/Agent responsibility splits, consequence sequence, customer test, scroll-built linkage, evidence states or mobile consequence flow.

Material treatment:

- the opening film occupies the high-value visual field behind the claim and hands motion to the signal film as Step 01 becomes dominant;
- the signal film sits behind the evidence readout rather than creating another box or extending the first screen;
- the clay test slip and growth-machinery consequence instrument remain the subsequent meaningful ground changes, so the page does not become black background end to end;
- mobile keeps the same one-idea sequence and uses bounded cinematic grounds without increasing the first-screen height.

Exact candidate evidence: paired desktop/mobile render `prototypes/website-redesign-recovery/gtm-market-change/paired-motion.png`, 1500 x 720, SHA-256 `0d61d36e21868b2f4e3b46103ce7b6525760f81a35d184f2003d74d257375b64`. Supporting full renders: desktop SHA-256 `fea9b72c3ebc8f8dc262bfede38e1b2dd3ebe634353c7a852097b8500fe2a1f1`; mobile SHA-256 `96ea9b3638d7547d49c29d0203f2ef0a31c69e007be4b3803228ffecccfdd675`. Candidate source hashes: `index-motion.html` `8754e189e077ead09728e4e8b78ed26ad9b872a0d8b9d4b3503bc76ee7e98aef`; `styles-motion.css` `9f3dee85d798eb2755f28b061b6353057ee912fd2c4a5e55017e95f52a46e12f`; `script-motion.js` `6f8bfcd9e4c6b52796d74ba052e74cfeceb1e31f9b154aba8709ebafe817095b`; `check-motion.mjs` `a480e47032dd4b74b2ca3a5b5268511ad84f76386fd9aa515bfc4c0a707cca7a`; `review-motion.html` `c63401162840698964331840f41a8023679fd84410aba5d72bbb12c22f6be780`.

Task-first and deterministic result: **PASS**.

- The checker proves the S3 and S3-FIT source hashes, both supplied film hashes and exact baseline-plus-declared-delta equality.
- The workshop and signal films hand off with exactly one active loop; offscreen films pause; film playback is not tied to scroll position.
- The complete existing interaction remains green for all five signals by three responses, four consequences, every Human/Agent split, customer test, undo, keyboard operation and reversible mobile sequence.
- Geometry passes at 320 x 568, 360 x 800, 390 x 844, 430 x 932, 768 x 1024, 844 x 390, 1024 x 768, 1280 x 800, 1440 x 700, 1440 x 900, 1880 x 953 and 1920 x 1080. The locked first-screen fit remains green.
- Reduced-motion and save-data modes load no playback source; missing-media and no-JavaScript states retain poster-backed visual grounds and complete meaning; 200 percent text and every evidence state remain green.
- The current paired and full desktop/mobile renders were visually inspected. No clipping, overlap, awkward signal-box spacing, horizontal overflow, nested scroll or black text-only chapter was observed.

Approval state: **GTM-MOTION-S1 is rendered and verified as a candidate, not materially approved**. The next gate is Krish's unanchored first reaction to the paired render. Brain media integration, public routes, shared production components and production styles remain paused and unchanged. No commit, merge, preview, deployment or publication is authorised.

### GTM motion owner lock: GTM-MOTION-S1

Owner ruling: Krish said the candidate "looks great" and that the video completes the surface. This is explicit material approval of the reviewed GTM-MOTION-S1 desktop/mobile composition and its semantic film treatment.

Section 03 remains a protected part of the lock. The approved film layer changes only the opening and Step 01. The checker proves that Section 03 still enters `idle`, advances through `building`, reaches `built`, sets the complete build offset, and assembles the machinery, linkage traces, chosen-response hub and consequence leaves through page scroll. The existing response, consequence, undo and reversible mobile behavior remains green.

Lock effect: GTM-MOTION-S1 is now the approved GTM material prototype. MMR-040 records this lock and the Section 03 scroll-build invariant. The next authorised material surface is the additive Brain moving-media pass over BRAIN-ALIGNMENT-S2-LOCK. Public `/ai-gtm`, shared production components and production styles remain frozen until later implementation approval. No commit, merge, preview, deployment or publication is authorised.

### Brain moving-media material candidate: BRAIN-MOTION-S1

BRAIN-MOTION-S1 is an additive candidate over the byte-preserved BRAIN-ALIGNMENT-S2-LOCK baseline. It introduces the accepted `evidence-connects` film only inside the opening visual field, behind the existing Brain instrument, using an additive stylesheet and playback controller. It does not change the approved copy, chapter order, viewport-fit geometry, node inspection, source challenge, correction replay, complete record reel, pause or manual-advance controls.

Material treatment:

- the moving evidence field gives the opening Brain object a physical, cinematic ground without turning later chapters into video wallpaper;
- desktop keeps the film inside the high-value right-hand instrument field, while mobile bounds it behind the Brain object without adding page length;
- the cream evidence chapter, deep-green source chapter, warm correction chapter and complete-record chapter remain distinct material grounds, so the experience does not become a black background with text from end to end;
- reduced-motion, save-data, unavailable-media and no-JavaScript states retain the same meaning through the approved poster-backed composition.

Exact candidate evidence: paired desktop/mobile render `prototypes/website-redesign-recovery/brain-signature/paired-s2-motion.png`, SHA-256 `95f673f10ead9f8ee867ca9e91eaf64e4fda7e1afaaf65949adafb3daf3149d4`. Supporting full renders: desktop SHA-256 `113b30c83ed1bccd8fb87208d868e43740efb70c35b890d2535e437d0523b604`; mobile SHA-256 `f9d1ce6fb65a125c0562c11fa2cbe266c2596bee2e39083e1f5f89b44a824b02`. Candidate source hashes: `index-s2-motion.html` `99e676122e2577c110055d75354d81808c1ec66c5e08f6d9b1030bbb9fb81400`; `styles-s2-motion.css` `6438fd26ed7feaecf8d52f6db90683f0c310c26b805194741cf4de5129bec282`; `script-s2-motion.js` `8c9a1fedab2ab6e5d21e7cf95ff38a8b80abdcb725b7fca8baf1441b9273178c`; `check-s2-motion.mjs` `032b872a0c37a45e533c09b17701f43b543d904927436980d34837f33cd14320`; `review-s2-motion.html` `4e7c00ec5e59a472d619d89537de3cf047c6a1d8bf7c44112e27e70f112cfb6f`. The locally derived poster is SHA-256 `60390f9d15e561bad9739a0ea5da0ae9cd7c5c443691695bbb01bca374c81bbe`; the supplied `evidence-connects` film is SHA-256 `374e98e244f4d56b64a69775078dae1ef76e918fb2711bd7f73671fe681b39da`.

Task-first and deterministic result: **PASS**. The script-owned ephemeral origin exercised 320 x 568, 360 x 800, 390 x 844, 430 x 932, 768 x 1024, 844 x 390, 1024 x 768, 1280 x 800, 1440 x 700, 1440 x 900 and 1920 x 1080. Copy containment, last-line orphan, target-size, horizontal-overflow and nested-scroll checks pass; all required primary viewports keep every chapter inside one viewport. The film plays only while the opening is visible and pauses offscreen. The existing chapter scroll build remains causal and reversible. All 20 meaning nodes, source challenge, correction replay, all 51 live-record entries, pause and next controls remain green. The 200 percent text, reduced-motion, save-data, unavailable-media and no-JavaScript states pass. The paired and full renders were visually inspected with no clipping, overlap, awkward wrapping or alignment drift observed.

Approval state: **BRAIN-MOTION-S1 is rendered and verified as a candidate, not materially approved**. The next gate is Krish's unanchored first reaction to the paired render. Public `/ai-brain`, shared production components and production styles remain paused and unchanged. No commit, merge, preview, deployment or publication is authorised.

### Accepted Brain hero direction and material candidate: BRAIN-MOTION-S2

Owner direction: after reviewing the recommendation to use `evidence-connects` as a full-bleed Brain hero environment while retaining the current decision instrument, Krish said, "ok I like this". This accepts the direction for rendering, not an unseen material surface. MMR-041 records that distinction.

BRAIN-MOTION-S2 is a locked revision over BRAIN-MOTION-S1. It preserves the complete S1 candidate byte-for-byte and adds only a candidate title plus one additive full-bleed hero stylesheet. The film now fills the hero, a directional scrim protects the headline and action, and the existing decision card, nodes and orbital instrument remain the foreground signature. No later chapter, fixture, copy, control, state or playback rule changes.

Exact candidate evidence: paired desktop/mobile render `prototypes/website-redesign-recovery/brain-signature/paired-s2-motion-s2.png`, SHA-256 `11d680477d46d4ef7e293eb5833375a6bc5de9f70bd6776f4475982ea07a5ead`. Supporting full renders: desktop SHA-256 `9e93ec2fda199348ca60ef26bcf2b27db93a698b9ea37185eb64439f234bad98`; mobile SHA-256 `6dc369c0c351ecada72599e6c13bd0127a667c13521c16c24344fe38ab46bd02`. Candidate source hashes: `index-s2-motion-s2.html` `daf0797a6c29feaa8e06d071ef221930a03e39fd340d489c264a3b641ec8c6e7`; `styles-s2-motion-s2.css` `220565263ac081741b0b828f3838aefa3189805530d2f1ccb6df849a310bbe80`; `check-s2-motion-s2.mjs` `fdcdbbf5bebb1a2e5e5b7ba9888a89c11cb44483c6c8a86599546fb6acf0a54c`; `review-s2-motion-s2.html` `7449cb65f6b316c8f616fc5fcb537f7fab44c8e16c28941c8b68b52d16a28694`.

Task-first and deterministic result: **PASS**. The first locked-diff run rejected one undeclared trailing newline before rendering and no candidate was accepted. That byte-level discrepancy was removed and the same gate passed. The approved S2 baseline, BRAIN-ALIGNMENT-S2-LOCK and BRAIN-MOTION-S1 hashes remain unchanged. Eleven viewport checks pass; eight primary viewports keep every chapter inside one viewport; copy containment, orphan, target-size, overflow and nested-scroll checks are green. The film plays only in the hero and pauses offscreen. The chapter build remains causal and reversible. All 20 meaning nodes, source challenge, correction replay, all 51 record entries, pause and manual advance remain intact. The 200 percent text, reduced-motion, save-data, unavailable-media and no-JavaScript states pass. High-resolution desktop, mobile and paired renders were visually inspected with no clipping, competing focal collapse, awkward wrap or alignment drift observed.

Approval state: **BRAIN-MOTION-S2 is rendered and verified as a candidate, not materially approved**. The next gate is Krish's cold first reaction to this exact paired render. Public `/ai-brain`, shared production components and production styles remain paused and unchanged. No commit, merge, preview deployment, deployment or publication is authorised.

### Brain decision-instrument alignment revision: BRAIN-MOTION-S3

Owner finding: after reviewing BRAIN-MOTION-S2 on desktop and mobile, Krish said the central decision instrument "looks misaligned and wonky and unprofessional on all devices". This is a verified frame-level execution failure, not a rejection of the accepted full-bleed evidence-film direction. MMR-042 records the durable alignment ruling and MMF-015 records the verified defect. This is the first same-spine revision after the S2 render, so no divergence reset is triggered.

BRAIN-MOTION-S3 preserves every BRAIN-MOTION-S2 file byte-for-byte and changes only the candidate title plus one additive decision-instrument stylesheet. The oversized square halo is removed. The plaque now uses a stable landscape proportion, an explicit full-width grid column, equal internal spacing and a top, centre and bottom instrument hierarchy. The label, question and status are centred independently of their line lengths. At increased text size the instrument may expand within the Brain object rather than clip its meaning. The film, headline, action, orb, nodes, all later chapters, copy, fixtures, controls, build sequence and recovery behaviour are unchanged.

Exact candidate evidence: paired desktop/mobile render `prototypes/website-redesign-recovery/brain-signature/paired-s2-motion-s3.png`, SHA-256 `3c48b4c8e0ad40f250146b1e8c6c1d9ab07128f21c3b3fcd838f8ccb3817dfd9`. Supporting full renders: desktop SHA-256 `92dd50f663b007ff9605d5ea345de9426e78c81038710711f2ea86aa49b9d36f`; mobile SHA-256 `ec73d9e6d574175efef23379d62eb94819ceb1a1df8ed8a411fec8c02478d99e`. Candidate source hashes: `index-s2-motion-s3.html` `423659d864e79a72a55d4fd3ca9450b610e616187929293f1e0a8faaafbff2c6`; `styles-s2-motion-s3.css` `5e52041a0535f1035f668126a44ff63ce05aa64ccffcc26ef6648793e14d40ac`; `check-s2-motion-s3.mjs` `3e6ffb566917b815367443e1e1b13fdd5a8a996b901764debc6a6a74e4c5c7a3`; `review-s2-motion-s3.html` `e2663cf2b9d7cfae8ede71f22aa226e533301baeee5609f7d6f51156dc917f12`.

Task-first and deterministic result: **PASS**. The gate first exposed an undeclared trailing newline, then proved that an implicit auto grid column could place the label track twelve pixels away from the plaque centre on a 320 x 568 viewport. The implementation was corrected at the grid primitive rather than visually nudged. All eleven required viewports now keep the plaque centre within one CSS pixel of the Brain-object centre; the normal-view plaque holds its locked landscape and width ratios; all three text roles are independently centred and contained. Two-hundred-percent text receives an intentional font-relative width and height safety floor without clipping or horizontal overflow. Every chapter still fits its required primary viewport, all existing interactions and the 51-entry reel remain green, the evidence film pauses offscreen, the scroll build remains causal and reversible, and reduced-motion, save-data, unavailable-media and no-JavaScript states pass. The paired and full-resolution renders were visually inspected with the frame, hierarchy and optical balance intact.

Approval state: **BRAIN-MOTION-S3 is rendered and verified as a candidate, not materially approved**. The next gate is Krish's reaction to this corrected paired render. Public `/ai-brain`, shared production components and production styles remain paused and unchanged. No commit, merge, preview deployment, deployment or publication is authorised.

Owner lock: after reviewing the exact BRAIN-MOTION-S3 desktop/mobile evidence, Krish said, "looks good, continue". This is explicit material approval of BRAIN-MOTION-S3 and authorises the recorded next phase, shared-system and public-route implementation, within the existing local dirty worktree. MMR-043 records the lock. The approval does not authorise a change to shared shell or navigation hierarchy, Start here, homepage hierarchy, case-study browsing, commit, merge, preview deployment, production deployment or publication. Any implementation change that alters first notice, sequence, interaction model or signature language returns as a rendered material decision.

### Locked public-route adapter integration

The owner-locked GTM-MOTION-S1 and BRAIN-MOTION-S3 sources are now integrated locally at `/ai-gtm` and `/ai-brain` through bounded production adapters. The pre-existing shared `MindmakeShell`, route SEO and `LeadBrief` remain in place. The old `AiGtm.tsx` and `AiBrain.tsx` sources remain preserved and untouched; the route imports now select `AiGtmLocked.tsx` and `AiBrainLocked.tsx` in both client and SSR entry points. No shared-shell or navigation hierarchy was materially changed.

The integration is generated from exact hash-verified locked prototype sources into route-scoped CSS. The generated GTM stylesheet SHA-256 is `bf57ce3514b5ea49d6427077168ffad88479bf281a4c34133c27438a5551f985`; the generated Brain stylesheet SHA-256 is `add99d1ceecb88cb5e3c7367b1506e1d2e7d9965eb0d43212df7bde659027bcf`. Production-only corrections are deterministic, declared in the generator and limited to fixed-shell clearance, one-viewport chapter fit and the already approved text-wrapping safety floor.

Task-first and deterministic result: **PASS**. `qa:locked-material-production` started and stopped its own ephemeral Vite origin and exercised both routes at all eleven required Chromium viewports, plus representative WebKit and Firefox desktop, mobile and tablet viewports. It verified geometry, plaque alignment, causal and reversible scroll builds, all GTM signal-response-consequence combinations, GTM undo and customer test, all Brain meanings, relationships, sources, corrections and the 51-entry live record, reduced-motion, save-data, unavailable-media and evidence recovery states. Fresh desktop/mobile hero and signature screenshots were visually inspected without clipping, overlap, alignment drift, black tearing or mobile shell collision. Lint has zero errors and only four pre-existing warnings; typecheck passes; all 473 tests pass; client and SSR builds pass; the approved Brain r5 and GTM r6 visual suites remain retrievable from a separate script-owned ephemeral origin; the restart gate still reports all 43 rulings and the known approved-r1 source parity truth of 10/14.

This is verified local unreleased implementation, not restored r1 source parity and not a release claim. Physical iPhone Safari with VoiceOver and Android Chrome with TalkBack have not been run. Nothing was committed, merged, preview-deployed, deployed, published or made live. The next material surface is Start here; creation may proceed reversibly, but any changed journey, interaction model or visual hierarchy must return as one rendered desktop/mobile decision for Krish's explicit approval before public-route implementation.

### Start here locked additive candidate: START-HERE-INTELLIGENCE-S1

Continuity correction before creation: Start here was not reset or treated as a blank-slate concept. `start-flow-vnext-r2` already has explicit owner approval for its company-first progressive sequence, desktop drawer, mobile phone sheet, compact role selection, bottom action clearance and paired-review rule; the real `LeadBrief` already implements that direction with validation, history, recovery and data-handling behavior. Fresh divergence would have erased an accepted material decision. Under the locked-revision boundary, the approved journey and current production component remain untouched.

START-HERE-INTELLIGENCE-S1 isolates only the next material layer in `prototypes/website-redesign-recovery/start-here-intelligence/`: the recommendation resolves over the assigned `opportunities-resolve` film, then divides the chosen problem into what AI can carry, what the leader keeps and one useful first proof. Route and pressure context stay visible. Back returns to the Time decision, changing that choice works, and the recommendation restores without a dead end. Desktop remains a bounded drawer over the originating route; mobile remains a purpose-built full-width sheet with one visual, one conclusion and one primary action. The film is a generated illustrative metaphor, not product footage or evidence of a live operation.

Exact candidate evidence: paired desktop/mobile render `C:\Users\krish\.scratch\mindmake-start-here-intelligence\paired-review.png`, SHA-256 `2b3cbb2f7bfe349b051e628e73e36ebd890e401b4294eb2708287e3abd9a7503`. Candidate source hashes: `index.html` `94ce786293ac63708cf2baebb70fa994a19434b897060d9325b5552652325e32`; `styles.css` `14b705bc98041c96a945454add6aa832abb6710b8724f4f04b9893a9d28b63bc`; `script.js` `4abbc510a11bf0976f71734b61eae6d835b19d99bc730a2c8d47856e7cb85410`; `review.html` `edb16ceae8c0bc627e85efc92c97a1633888192a30ede7e61628949a9b73c3e6`; `check.mjs` `ad3c7c02864f7ef4ef456529d0571ed1a20b66718cc02f5a3eb697095a0f0e6c`; derived poster `116705a4945cf88ba46246a0e7f85986439afc93220cb60725f09352eaec38a1`; supplied film `0bd3273470f763fbb04d48b1e126251747ec8c9f7ce17e388df7e3ad98e41cfd`.

Task-first and deterministic result: **PASS**. A script-owned ephemeral Vite origin exercised all eleven required Chromium viewports plus WebKit at 390 x 844, 768 x 1024 and 1440 x 900, and Firefox at 390 x 844 and 1440 x 900. The gate verifies viewport containment, horizontal overflow, result and Time-screen fit, the bottom action, 44-pixel enabled controls, one-film ownership, reversible Time-to-recommendation interaction, an explicit Keep consequence, close-and-reopen focus recovery and reduced-motion source suppression. The gate initially exposed an 844 x 390 overflow, then a 320 x 568 action collision and a missing mobile reopen surface; all were corrected at the responsive or state-contract layer and the complete matrix rerun green. Fresh desktop, mobile and paired renders were visually inspected with no clipping, truncation, collision, alignment drift or review-frame crop.

Approval state: **START-HERE-INTELLIGENCE-S1 is rendered and verified as a candidate, not materially approved**. The production `LeadBrief`, public routes and shared styles were not changed for this candidate. Physical devices were not run. No commit, merge, preview deployment, deployment or publication is authorised. The next gate is Krish's unanchored reaction to this exact paired material surface; case-study browsing does not begin until that decision.

Owner reaction to START-HERE-INTELLIGENCE-S1: after reviewing the exact paired surface, Krish said, "spacing and alignment seems off, usage of the screen is not great". The supplied screenshot shows the recommendation compressed into the top of the paper field while the primary action is separated by a large unearned empty band; AI, human and proof rows use competing column anchors, and mobile inherits the same imbalance instead of using its height around one visual, one conclusion and one action.

Classification: **frame-level execution and responsive composition inside the current Start here spine**. The approved company-first journey, film assignment, copy, route context, human-and-agent split, first proof, reversible Time step, Keep consequence and close/reopen recovery remain invariant. START-HERE-INTELLIGENCE-S2 is the first same-spine revision after S1, so no divergence reset is triggered.

Declared S2 delta: preserve every S1 source byte and add a new candidate entry plus additive stylesheet. Replace the normal desktop top-stack with one full-height film/recommendation split; put Starting point, AI can carry, You keep and A useful first proof on one repeated label-and-value grid; stack the AI and human rows so neither half-column creates accidental wrap or drift; let mobile allocate height to the visual and place the action directly after the conclusion; retain the compact-landscape split and every existing interaction. Any copy, film, sequence, state, action, breakpoint behavior outside this geometry delta is an undeclared regression.

START-HERE-INTELLIGENCE-S2 is rendered as the first same-spine correction. The S1 files and poster remain byte-identical. Exact S2 evidence: paired desktop/mobile render `C:\Users\krish\.scratch\mindmake-start-here-intelligence-s2\paired-review-s2.png`, SHA-256 `c45fc90610e99f8aecf484683e69531d73fe4ca76a776b36f939a2dd42b1f730`. Candidate source hashes: `index-s2.html` `5e391f505283c00085cd5ab9a716023a7e6b58921929e155c308ab7bf634971e`; `styles-s2.css` `01e83ea0bb5f4f48f84789f933b4ec20683fe816987e5fdb0c7cd3a7f853eb45`; `review-s2.html` `e558b01d13347e75cebe45eb85754643e8812555e27836ff179f1a5384e11783`; `check-s2.mjs` `95f86a6e65fe425c9a11448481533ea7d1c8f85228c900297f9b28de2c7bb71f`.

Task-first and deterministic result: **PASS**. The S2 gate started and stopped its own ephemeral Vite origin, preserved all six locked S1 hashes, and exercised all eleven required Chromium viewports plus WebKit at 390 x 844, 768 x 1024 and 1440 x 900, and Firefox at 390 x 844 and 1440 x 900. It verified viewport containment, horizontal overflow, 44-pixel targets, one-film ownership, a single alignment spine within 1.5 CSS pixels, equal AI/human row allocation, conclusion-to-action continuity, split/stack breakpoint behavior, reversible Time choice, changed-choice consequence, Keep consequence, close/reopen recovery and reduced-motion source suppression. Fresh desktop, mobile and paired renders were visually inspected. The recommendation now uses the available desktop height, mobile keeps one visual and one direct action without an unearned blank field, and no clipping, collision, truncation or alignment drift was observed. MMF-016 records the verified S1 failure and the durable regression condition.

Approval state: **START-HERE-INTELLIGENCE-S2 is rendered and verified as a candidate, not materially approved**. Production `LeadBrief`, public routes and shared styles remain unchanged. Physical iPhone Safari with VoiceOver and Android Chrome with TalkBack were not run. Nothing was committed, merged, preview-deployed, deployed, published or made live.

Owner rejection of the S2 evidence presentation: Krish asked, "is it supposed to be cut off? honestly i dont know why you cant inspect this type of issue before presenting it proudly to me. are your blind judges not hard at work so I dont need to keep pointing stupid things like this out?" The exact 1320 x 852 reproduction confirms that `review-s2.html` placed a 1440 x 900 iframe painted at 1080 CSS pixels inside an 844 CSS-pixel desktop review window and hid the remaining 236 pixels with `overflow: hidden`. The inner candidate page did not report document overflow, so the deterministic check returned a false green while the evidence Krish actually saw was visibly cropped. The prior visual-inspection claim is withdrawn. The S2 material decision is invalid because its presentation artifact was not trustworthy; S2 is not approved.

Classification: **P2 evidence-presentation and verification-system failure**. The Start here product spine, S2 source and interactions remain frozen while the presentation layer is corrected. REVIEW-S3 must preserve the exact S2 candidate bytes, scale or stack each evidence viewport without cropping, and fail closed when any iframe paint bounds exceed its review window or when any meaning-bearing text paint bounds exceed its intended content panel. MMF-017 records this verified failure. The blind release panel was not run on S2; deterministic checks and producer visual QA cannot be represented as blind judging.

Judge-system finding: the five-juror, ten-scorecard rubric is broad in intent, but its current capture implementation is not sufficient on its own to certify a world-class forward-looking experience across devices. Three independent fresh-context audits graded concept coverage B-, technical implementation D+ and independence D. The panel currently creates five juror definitions and ten scorecards rather than proving ten independent judging contexts; accepts free-text evidence not bound to capture artifacts; captures only the root route in headless Chromium without exercised interaction, recovery, failure, 200-percent-text, assistive-technology or physical-device tasks; can still award `world_class_winner` with low confidence or a zero critical dimension; does not consume run observations during aggregation; self-attests blindness and identity; can retain stale submissions after an interrupted run; and its protocol refers to rubric.v1 while rubric.v2 is active. The separate continuity and release contracts cover some missing evidence, but the layers were not joined before presentation. The existing QA command validates the declared panel schema and deterministic arithmetic; it does not disprove these audit findings. MMF-018 now blocks treating the current panel as release certification until the system is strengthened and adversarially verified.

REVIEW-S3 closes the exact evidence-frame failure without changing a byte of the S2 candidate. Its scaler measures the available review window and applies a numeric transform at runtime, stacks desktop and mobile evidence before the fixed paired layout would crop, and accounts for the mobile frame border. The S3 gate starts and stops its own ephemeral Vite origin; preserves the exact S2 source, stylesheet, failed review and checker hashes; adds the exact 1320 x 852 reproduction; exercises twelve candidate viewports and ten outer review widths in Chromium plus representative WebKit and Firefox candidate and review frames; checks every meaning-bearing painted text rectangle before and after Keep; and reports zero failures. This repairs evidence integrity only. It does not grant S2 material approval.

Owner interaction ruling: Krish said, "the interaction design needs to be breathtaking and world class specific to device". MMR-044 records this as a site-wide material rule. Responsive resizing is not sufficient. Desktop must earn its environment through pointer precision, keyboard fluency, spatial depth, cinematic scroll causality and reversible state choreography. Mobile must be independently sequenced for thumb reach, direct touch feedback, interruption and resume, orientation and safe areas, without becoming a compressed desktop composition. Both devices must express the same product meaning while using interaction mechanics native to their context. This ruling makes the current static Start here S2 composition an evidence baseline, not the final interaction lock.

START-HERE-INTERACTION-S3 therefore requires fresh device-specific concept divergence under `krish-design`. Generators receive the accepted journey, real copy and data, film assignment, state/recovery invariants, accessibility and performance constraints, and the requirement for breathtaking device-native interaction; they do not receive the S1/S2 layout or its rationale. Historically informed judges receive the complete rejected history and must reject disguised repetition, inaccessible spectacle, motion without meaning, desktop compression on mobile and any concept that cannot preserve the company-first flow or clear action consequences. Only one feasible synthesis may be rendered for Krish.

Fresh divergence used sanitized brief `SHI-SB-2026-09-17.1` and produced three independent device-specific spines. `SH-A Calibration Plate` is a one-screen desktop instrument with a detented Time dial and a thumb-wheel mobile counterpart; it was not selected because it makes Time more prominent than the four-part recommendation, but its original/current marker and native input remain useful. `SH-B Proofing Table` develops one proof through provenance bands on desktop and a leaf stack on mobile; it was not selected because its proof/latch metaphor risks implying an irreversible commitment, but its affected-only causality and explicit change summary remain useful. `SH-C Working Folio` uses four spatial leaves, an intact baseline, a candidate revision, explicit Use/Restore and exact interruption recovery on desktop, then independently sequences one leaf at a time in a safe-area-aware Pocket Folio on mobile. Two historically informed judges selected SH-C independently. Their disagreement about whether SH-B and SH-C were sufficiently distinct triggered a fresh blinded tie-break; that judge found the diversity narrow but valid because their sequencing, agency and state models differ, and also selected SH-C. The tie-break warned that SH-B and SH-C would collapse into disguised repetition if both were rendered as stacked cream cards with page-turn animation.

Selected synthesis: **START-HERE-INTERACTION-S3 / Instrumented Working Folio**. SH-C remains the governing spine rather than a collage. It may translate SH-A's original/current Time marker and deterministic reduced-motion snapshots into folio language, and SH-B's affected-only feedback into a concise changed-count annotation. Desktop must support precise pointer and keyboard control, an always-available Time adjustment, baseline/candidate depth and one-action Use or Restore. Mobile must show one leaf at a time, keep Time persistently reachable, put the action inside the bottom safe area, resume the exact interrupted leaf and use a distinct content/action split in landscape. Both devices retain the exact output order `Starting point`, `AI can carry`, `You keep`, `First proof`; label the film `Illustrative sequence, not evidence.`; and disclose before any collection or sending, `Email verification is next. Nothing has been sent.` Reduced motion must preserve Changed/Previous/Current meaning and the restoration path without depending on animation.

Feasibility correction from the real `LeadBrief` data model: changing Time does not recompute `pressureDetail()` and therefore does not change the four recommendation leaves. It changes only the returned `timeValue` (`What the returned time could buy`). The synthesis must not fabricate leaf changes to make the interaction feel dramatic. The four guidance leaves remain stable; Time is a binding rail whose honest consequence is that the guidance stays fixed while the time the leader protects changes. This is a verified implementation constraint, not a design preference.

REVIEW-S3 evidence integrity is separately locked at SHA-256 `f3cebd4335e15939c1313d3173820e6c7f2f67546025af38dff8401c19495901` for `review-s3.html` and `18809fee75f950681ee4da4df954ab133bab9819f93d97d7c059910c49cf74a9` for `check-s3.mjs`. These files repair the prior review crop and do not alter or approve the S2 candidate.

Authority boundary: one incomplete HTML scaffold, `index-interaction-s3.html`, was created before the filesystem policy rejected the companion stylesheet. It is not a rendered artifact, not a candidate and not approval evidence. The recovery prompt's original pre-approval creation boundary names only `prototypes/website-redesign-recovery/gtm-market-change/`; later owner approvals and the recorded sequence clearly progressed through Brain to Start here, but the execution guard treated the earlier path restriction literally. Work stopped rather than bypassing the gate. Explicit owner authorization for new creation inside `prototypes/website-redesign-recovery/start-here-intelligence/` is now required before the one synthesis can be completed and rendered.

Owner authorization: Krish explicitly authorised new creation inside `prototypes/website-redesign-recovery/start-here-intelligence/` for the single START-HERE-INTERACTION-S3 synthesis and instructed the work to proceed autonomously after a plain-English step plan. This closes the path-authority blocker for that isolated synthesis only. It does not authorise production-route or shared-file changes, a second competing synthesis, commit, merge, preview deployment, production deployment or publication.

START-HERE-INTERACTION-S3 is now rendered as the single selected Instrumented Working Folio synthesis. Desktop presents all four answer leaves in one bounded physical instrument, with pointer lift, keyboard arrow traversal, an always-visible editable Time binding, truthful Time-only revision, one-action Restore, an explicit Keep consequence and fold/reopen recovery. Mobile is not a compressed desktop layout: it presents one leaf at a time with a bottom safe-area action, optional swipe, persistent Time access, one-tap Restore, exact interruption resume and a distinct landscape content/action split. The `opportunities-resolve` film remains a full-field generated illustration behind the working object, pauses when unavailable or hidden and yields to the poster under reduced motion. The visible label says `Illustrative sequence. Not evidence.`

The synthesis gate starts and stops its own ephemeral Vite origin and reports zero failures. Chromium passed 320 x 568, 360 x 800, 390 x 844, 430 x 932, 768 x 1024, 844 x 390, 1024 x 768, 1280 x 800, 1320 x 852, 1440 x 700, 1440 x 900 and 1920 x 1080. WebKit and Firefox passed 320 x 568, 390 x 844, 768 x 1024, 844 x 390, 1320 x 852, 1440 x 700 and 1440 x 900. The gate exercises painted-text containment, document and modal overflow, 44-pixel targets, exact leaf sequencing, keyboard operation, Time preview/change/Restore, the invariant four-leaf copy, reload resume, exact Keep disclosure, fold/reopen recovery and reduced motion. The paired review wrapper passed eight Chromium outer widths plus representative WebKit and Firefox widths without clipping either source viewport.

Locked candidate hashes: `index-interaction-s3.html` `2d8f6147b125e71db46590511a5b478180fc70c8caeac1aeadbaa0191d549c2d`; `styles-interaction-s3.css` `c5211125bf8afdcbd8041144591e2cdd5ac018f7dfe36db52bf877ab7463fa3f`; `script-interaction-s3.js` `8df7dbe1b8b5d95e2ed543dbb72b26956a4a210b5c2780cbfcfa1c1153aebea8`; `review-interaction-s3.html` `99103f3d223c0459c3096f4860d18a5976b6c94ebbbf0ae92601050a3cabc16e`; `check-interaction-s3.mjs` `8fe7d7e12419495cf187ce93698edd9caca2217c36b9dccc6cd7efe4f560ca1b`.

Exact review evidence: `C:\Users\krish\.scratch\mindmake-start-here-interaction-s3\paired-review-interaction-s3.png`, SHA-256 `c99e9fe852d69bfbc70e35e890143be57f5de9fb1d18478ebfa12acfb19f6fd6`; mobile portrait `chromium-candidate-390x844.png` `adb13c1ea61d9871e120fabf345a098bf4be4fc7033e03f5be3e101d70b0d14e`; mobile landscape `chromium-candidate-844x390.png` `499b49cccfbbd34dcc21e07b31e59f3b305173b372a17385793b6001d5ffa0de`; desktop `chromium-candidate-1440x900.png` `8f2aa095499bd48147ed4e6829736eb7fd8c373426ebd6d18412b07298ab5384`.

Approval state: **START-HERE-INTERACTION-S3 is rendered and verified as a material candidate, not approved**. The production `LeadBrief`, public routes and shared styles remain unchanged. The deficient blind release panel was not used to certify this surface; MMF-018 remains open. Physical iPhone Safari with VoiceOver and Android Chrome with TalkBack were not run. Nothing was committed, merged, preview-deployed, deployed, published or made live.

Owner reaction to START-HERE-INTERACTION-S3: Krish said, "I dont like the use of certain components, space wise" and supplied a crop of the desktop answer field. The evidence shows four tall, equally weighted leaf components whose labels and substantive copy occupy only their lower edge, leaving an unearned central field and making the folio read as sparse card columns rather than one intelligent working object. This is a same-spine spatial-composition correction: the Instrumented Working Folio interaction model, truthful Time behavior, mobile Pocket Folio sequence, content, film, consequence and recovery states remain invariant. S3 remains preserved as rejected evidence. START-HERE-INTERACTION-S4 may replace only the desktop leaf composition with an asymmetric working spread that gives the compact Starting point, paired AI/human work and dominant First proof space proportional to their meaning.

START-HERE-INTERACTION-S4 applies that correction without changing the interaction spine. On desktop, `Starting point` becomes a compact orientation rail across the work field; `AI can carry` and `You keep` occupy the paired working area at a readable scale; and `First proof` becomes the dominant clay consequence surface rather than a fourth equal column. The tall empty card fields are removed. The 1440 x 700 state uses a shorter orientation rail and tighter type scale rather than clipping or hiding content. Portrait phone, portrait tablet and compact landscape keep the exact S3 Pocket Folio composition and behavior.

The S4 gate preserves all five locked S3 source/evidence hashes, starts and stops its own ephemeral Vite origin and reports zero failures. It repeats the full S3 browser and viewport matrix, including painted-text containment, overflow, target size, Time change/Restore, invariant recommendation copy, keyboard navigation, interruption resume, Keep consequence, fold/reopen recovery, reduced motion and review-frame containment. Its 44-pixel target assertion allows only a 0.5-pixel engine-rounding tolerance after WebKit reported a CSS `44px` control as `43.99997px`; no candidate geometry changed for that rounding artifact.

Locked S4 hashes: `index-interaction-s4.html` `359700922744ba30ac4b4b01dd46264a05d5dcc622b2de51bbf39b0b0c5bceb0`; `styles-interaction-s4.css` `63b52c29496c4736134c9904c494be62499a721195d7ccb402a90f93d962a262`; `review-interaction-s4.html` `80f915b3464d2237776f83dc63f4b53d855edddd78fdb76e27feaad89d43d905`; `check-interaction-s4.mjs` `e491308def21d3ceeb8b20a94de9698f7e8aca66dd6be8b8745972063670b4b2`. S4 deliberately reuses the locked S3 interaction script rather than forking unchanged behavior.

Exact S4 evidence: `C:\Users\krish\.scratch\mindmake-start-here-interaction-s4\paired-review-interaction-s4.png` SHA-256 `e4d469ad565848a66d784b94fdc58a3b9ccd60885baa8a960d1248abc32e07bf`; 1440 x 700 `chromium-candidate-1440x700.png` `779f2381004c487bc2f60e560bfc6867d3541f5b9ba72f5805964bcfdae882aa`; 1440 x 900 `chromium-candidate-1440x900.png` `1aea99ca80ed52b8c9bce6b3afb81086cfe877ec59ec635b29a75dc7f20444ca`; mobile portrait `chromium-candidate-390x844.png` `e606545cba865902f55fe727bae8a5e42fdbbce6be656e19c85277e85a8f14e2`; mobile landscape `chromium-candidate-844x390.png` `499b49cccfbbd34dcc21e07b31e59f3b305173b372a17385793b6001d5ffa0de`.

Approval state before owner review: **START-HERE-INTERACTION-S4 was rendered and verified as the first same-spine spatial correction**. Production `LeadBrief`, public routes and shared styles remained unchanged. The blind release panel and physical devices were not run. Nothing was committed, merged, preview-deployed, deployed, published or made live.

### Start here material lock: START-HERE-INTERACTION-S4

Krish reviewed the exact paired S4 surface and said, "Looks good, continue". This explicitly locks the Instrumented Working Folio interaction model, the asymmetric desktop composition, the one-leaf-at-a-time mobile Pocket Folio, the truthful Time-only consequence, Restore path, interruption recovery, Keep disclosure and `opportunities-resolve` illustrative film treatment. The approved artifact is the exact S4 hash set and rendered evidence recorded above. Local implementation into `LeadBrief` may now proceed through shared bounded primitives and must preserve the real component's company-first entry, data behavior and sending boundary. This approval does not authorise a material reinterpretation, commit, merge, preview deployment, production deployment, publication or release.

### Start here local implementation verification

The exact approved S4 interaction is now integrated into the real local `LeadBrief` recommendation state. The existing company-first read, profile, pressure, capacity, verification and sending boundaries remain intact. The production component now carries the approved opportunities-resolve film and truth label, desktop asymmetric working spread, mobile one-leaf Pocket Folio, keyboard and touch navigation, Time-only change and one-action Restore, exact interrupted-leaf recovery, and the pre-send Keep consequence: `Email verification is next. Nothing has been sent.`

The production-browser gate found and closed two assembly defects that were not visible in the isolated prototype. First, the shared `.mm-plate` rule was winning the cascade and placing the full-height background film in normal flow, which pushed the folio below the viewport. The locked surface now owns that positioning through a more specific bounded selector. Second, Firefox included the visually hidden live region in the preview scroll extent; the status remains accessible but is fixed out of layout. The same gate also corrected the 320 x 568 First proof wrap and bounded the compact consequence sheet inside the available post-header height. These are routine crop, focus and regression corrections inside the approved surface; they do not alter its first notice, sequence, interaction model or signature language.

`npm run qa:start-here-s4-production` starts and stops its own ephemeral Vite origin and reports zero failures. Chromium passed 320 x 568, 390 x 844, 430 x 932, 768 x 1024, 844 x 390, 1024 x 768, 1440 x 700, 1440 x 900 and 1920 x 1080. WebKit and Firefox each passed 320 x 568, 390 x 844, 844 x 390, 1440 x 700 and 1440 x 900. The gate exercises painted-text containment, full-viewport fit, background lock, nested overflow, 44-pixel controls, one-versus-four leaf sequencing, keyboard operation, Time preview/change/Restore, invariant guidance, exact compact resume after reload, Keep disclosure, focus entry and reduced motion. `src/test/LeadBrief.test.tsx` passes 28 of 28, `npm run typecheck` passes and `npm run build:vite` completes.

Locked local implementation hashes: `src/components/mindmake/LeadBrief.tsx` `8f6d700c1f58c22228c11a3c62598aa2bcdf75d3bbfa00268b17028f9ef3cfb1`; `src/styles/mindmake-brief.css` `e82b466d76d4b38a5cac0dd48aeff6642cef4b7b16776522022963d72a49886e`; `src/test/LeadBrief.test.tsx` `04a31274e0ce6320f627d4941c67a9826a9613292617b8c102564a93660dc7cc`; `scripts/qa/start-here-s4-production-check.mjs` `0db9d92b378730564ef9db50367d4bbb86f2d17c6b9fe588c6562d44ae8391eb`; `src/assets/films/sep2026/opportunities-resolve-poster.webp` `116705a4945cf88ba46246a0e7f85986439afc93220cb60725f09352eaec38a1`.

Verification evidence is under `C:\Users\krish\.scratch\mindmake-start-here-production-s4\`. Physical iPhone Safari with VoiceOver and Android Chrome with TalkBack were not run, so this is verified local implementation evidence rather than final release evidence. The blind release panel was not used to approve the material surface; Krish's exact rendered S4 approval remains the authority. Nothing was committed, merged, preview-deployed, deployed, published or made live.

At that point the next material surface was case-study browsing. The initial film-free constraint was later superseded by the accepted MMR-039 Proof Field exception and the rendered CASE-PROOF-FIELD-S2 approval recorded below. The invariant that remains unchanged is use of the eight real `clientStories` records without invented figures, with MMR-020 and MMR-044 satisfied through distinct meaningful visuals, clear position feedback, pointer and keyboard fluency on desktop, and direct touch, interruption and orientation behavior on mobile.

Final recovery readback after that isolated synthesis: `npm run qa:website-restart` passed the then-current 45 feedback rulings, 18 verified findings and no contract failure. `npm run qa:website-approved-visuals` started and stopped its own ephemeral server and both `ai-brain-vnext-r5` and `ai-gtm-vnext-r6` returned zero failures. The approved visual prototypes therefore remained retrievable. Exact approved r1 production-source parity remained **10 of 14**, so source restoration was not established; this truth label did not invalidate or promote the isolated Start here candidate.

### Case-study browsing divergence: CASE-FIELD-2026-09-18.1

The first fresh generator wave failed its own divergence gate. Three independently generated concepts all converged on the same load-bearing structure: an eight-item register feeding one central proof bench through a universal Before/Result control. Two historically informed judges identified the convergence independently. The work is preserved as rejected exploration evidence, but it is not represented as three distinct spines and none of its layouts, names or rationales became synthesis authority.

A second generator wave restarted from the outcome, eight canonical `clientStories`, evidence constraints and distilled failure requirements. It explicitly excluded the converged register, master-detail bench, universal slider, card deck, generated film and continuous eight-chapter mobile archive.

| Concept | Distinct spine | Feasibility disposition |
|---|---|---|
| Proof Field | One continuous asymmetric evidence surface holds eight unequal proof regions. A selected region expands from its own position while the other seven remain named, reachable and spatially stable. Mobile replaces the overview with one story and a compact position map. | Selected after tie-break. It is the strongest break from rejected master-detail and table structures while keeping all eight outcomes visible cold. |
| Evidence Score | All eight stories operate together as horizontal causal traces on one continuous plane with a portfolio-wide Before/Result state. | Discarded as the reserve direction. It has the clearest comparative evidence model, but its rows and hinged expansion remain one styling decision away from a decorated table and lengthening accordion. Preserve only its truth discipline: form shows kind of change, never magnitude, and no baseline may be invented. |
| The Cutaway | Eight labelled architectural rooms form an indexless archive hub and route into standalone case experiences. | Discarded. The metaphor precedes the evidence, and eight meaningful mobile labels in a 304-pixel plan create a crowding and mystery-navigation risk. Preserve only redundant route position and focus restoration. |
| Evidence ledger salvage | The strongest first-wave register/bench concept, retained as a control candidate in historical judging. | Discarded. Its operational keyboard and recovery model is useful evidence, but the governing list, central bench and detail spine repeats the failed family. Preserve only direct key navigation, exact URL recovery and safe-area previous/next/all controls. |

Two fresh historically informed judges agreed that the ledger and Cutaway should not advance, but split between Proof Field and Evidence Score. A fresh tiebreak judge selected Proof Field because the Score's horizontal rows could not escape the rejected ledger/table family without ceasing to be that concept, while Proof Field could import evidence honesty without losing its spatial spine.

### Reset trace, case-study browsing

Before synthesis, every generator layout, component name, grid measurement, cold-render staging suggestion and presentation rationale was removed from the build brief. The synthesis restarts only from these selected invariants:

- all eight verified outcomes are visible and directly reachable in the cold desktop surface;
- the archive is one continuous physical field, never eight floating cards or a master-detail bench;
- selection expands from its own location and preserves visible, keyboard-reachable context for the other seven stories;
- form and movement show the kind of recorded change, never its size or importance;
- each story uses its own data-honest mechanism, including visibly different vendor-decision and tool-stopping treatments;
- mobile is an independently composed overview-to-single-story sequence with exact story, phase, focus and position recovery;
- every motion has a direct inverse, button and keyboard parity, and a static reduced-motion equivalent;
- no generated client film, invented baseline, invented number, clipped copy, nested scroll or hidden-only action path is permitted.

Feasibility lock before rendering:

- the desktop and mobile geometries are explicit states rather than content-driven animation guesses;
- every cold-state region exposes a real result, ordinal, short story name and semantic mechanism mark;
- opening a story never creates an overlay, drawer, central panel or longer archive page;
- Arrow keys, Home/End and 1–8 move within the field; Enter or Space opens; Escape and Back restore the originating region and focus;
- URL state stores the selected story and stable mechanism phase; reload, browser Back, interruption and orientation restore that exact state;
- mobile uses thumb-safe Back, Previous, Next, All eight and archive actions with safe-area padding;
- reduced motion presents both truthful endpoint states without depending on travel;
- the isolated gate must prove canonical copy, full-field geometry, focus, targets, recovery, reduced motion and zero clipping across Chromium, WebKit and Firefox before owner review.

Selected synthesis: **CASE-PROOF-FIELD-S1**.

Reset count before synthesis: **2**. The first reset followed failed three-way divergence; the second removed second-wave layout particulars before building the selected invariant.

### Case-study browsing synthesis: CASE-PROOF-FIELD-S1

The isolated synthesis is a live semantic HTML/CSS/JavaScript surface under `prototypes/website-redesign-recovery/case-study-browsing/`. Its cold desktop state presents all eight canonical outcomes on one continuous asymmetric field. Each region carries a distinct semantic mechanism mark. Opening a region expands that same object within the field; the other seven remain named and directly selectable. The selected proof can move reversibly between its supplied starting state and recorded result without displaying a fabricated intermediate value.

Mobile is not the desktop tessellation squeezed narrower. It begins as four two-story proof bands, then replaces the overview with one result, one mechanism and one obvious reversible action. A safe-area dock preserves All eight, Previous, position, Next and Archive. Short landscape becomes a two-column result/mechanism composition. URL, browser history and session state preserve the selected story and stable mechanism phase; Escape, All eight and browser Back restore the field and originating focus.

All eight mechanism renderers are present in the isolated candidate: time compression, offer formation, two signed pilots, week-one handback, cadence change, vendor decisions, tool stopping and market-route change. The two `14 → 3` records are deliberately different: vendor inputs resolve into three decision paths, while fourteen tool switches retain three and visibly stop eleven. The span and cadence records never print their internal drawing ratios. No client film, generated client image, invented baseline or invented number is present.

The synthesis gate starts and stops its own ephemeral Vite origin. Chromium passed 320 x 568, 360 x 800, 390 x 844, 430 x 932, 768 x 1024, 844 x 390, 1024 x 768, 1320 x 852, 1440 x 700, 1440 x 900 and 1920 x 1080. WebKit and Firefox each passed 320 x 568, 390 x 844, 844 x 390, 1320 x 852, 1440 x 700 and 1440 x 900. The gate verifies all eight canonical results, direct access, full archive routing, painted-text containment, 44-pixel controls, document and component overflow, Arrow/Home/End/1–8 navigation, focus entry and restoration, fourteen-versus-three tool truth, fourteen-versus-three decision truth, reversible phase state, URL and reload recovery, mobile Previous/Next/All eight, reduced motion and runtime errors. It reports zero failures.

The first gate pass exposed an open-state grid-row defect that let desktop controls exceed the field at larger viewports; the field now owns the flexible grid row. Visual inspection then found and closed a dead lower field on tall mobile, a clipped paired-review desktop frame and an SVG transform collision that stacked the eleven stopped tool positions under one another. The exact revision below was rerun from scratch across all three engines after those corrections.

Locked isolated-candidate hashes: `index.html` `1006255610347f75ffb4a5bd485af0ec4f612c8aca9b2cc074143771a0d6c752`; `styles.css` `4d3d8c18aa95665568cbab1112aec2373e5e42eb71c805f36bfb8934a78c6778`; `script.js` `1214a866613de773a16a9adb91fdb9d71ca09b7247847d38d8d6f0a8e7c8b3d7`; `review.html` `473c64b2446f987fbf83c5a9dd34c02c3b999af34285bffa74d57cb12e5987a8`; `check.mjs` `b07dc65037e596ac61fe72e9da6919ab64b85c317a8e0a6848123cbab55e10b9`.

Exact review evidence: `C:\Users\krish\.scratch\mindmake-case-proof-field-s1\paired-review.png` SHA-256 `ce7c356b63eeb74a21a9ec4b0d1b6b18a51db9b7e11c40a4d531dc1297613fda`; desktop overview `chromium-overview-1440x700.png` `21f0466c31a457f9ae3c8d046659c64687e7a3dff56084c62c0beaafdb608d36`; desktop opened proof `chromium-open-1440x700.png` `25456dbaace1d0a99c909e7f1860839e2aa8a77057ca73536b9759f80d8b2670`; mobile overview `chromium-overview-390x844.png` `16a82ecf40f8b4ae4aa46d0bf8489ca354784b6e5214df323cbc16e7f3ce75c4`; mobile opened proof `chromium-open-390x844.png` `9af21a63fe06427e66391d0943c09a54dd09be23384c47ec0faddf27d1ada289`.

Approval state: **CASE-PROOF-FIELD-S1 is rendered and verified as an isolated material candidate, not approved**. `/case-studies`, shared production components and production styles remain unchanged. The physical-device release pass, continuity guardian panel and blind award panel were not run for this isolated material gate. Nothing was committed, merged, preview-deployed, deployed, published or made live.

### Case-study browsing owner revision: CASE-PROOF-FIELD-S2

Owner reaction retained the Proof Field spine and required two same-surface revisions: the eight cold proof regions must use dimmed machinery films from the supplied `/films` library, and outcome text must never overlap its custom mechanism mark. This is not a new divergence or reset. It is the second material rendering of the selected Proof Field direction.

All eight regions now carry a semantically mapped film layer using the six supplied sealed machinery loops: decision readiness for the one-day answer and tool-stopping records; communication assembly for offer formation; opportunity resolution for the two-pilot record; workshop growth for founder handback; evidence connection for the owned publishing system; and signal intake for vendor decisions and market movement. Reused films have different crops and deterministic start offsets. Six local WebP poster derivatives preserve the same visual meaning before playback and when motion is unavailable.

The films remain illustrative metaphors, never client or product evidence. The cold field says `Illustrative machinery films · never client footage`, while every opened proof retains the existing `kind of recorded change, not its size` truth line. Reduced-motion and data-saver states pause every loop and retain its matched poster. The runtime allows at most four simultaneous film decoders on desktop and two on compact screens, rotates the active batch, prioritises the hovered or focused region and pauses hidden or off-viewport regions.

The owner-identified collision in the narrow `Business first` region was traced to an absolutely positioned mechanism. `Business first`, `Simple product` and `Team decides` now reserve independent grid rows for their mechanism and outcome. The synthesis gate now compares painted text and mechanism bounds at every tested viewport and fails on any intersection. Manual review also found and closed an uncovered strip in compact landscape and a browser-default focus outline on the non-interactive result heading. The gate now verifies full field-edge coverage and the settled heading focus treatment as durable invariants.

The final S2 gate starts and stops its own ephemeral Vite origin. Chromium passed 320 x 568, 360 x 800, 390 x 844, 430 x 932, 768 x 1024, 844 x 390, 1024 x 768, 1320 x 852, 1440 x 700, 1440 x 900 and 1920 x 1080. WebKit and Firefox each passed 320 x 568, 390 x 844, 844 x 390, 1320 x 852, 1440 x 700 and 1440 x 900. The final aggregate reports zero failures across film count and source diversity, fallback posters, muted/loop/inline/decorative media semantics, decoder budget, motion start, reduced-motion still state, truth labelling, canonical results, field coverage, text/mechanism separation, clipping, overflow, target size, focus, history, phase recovery and all existing interaction paths.

The governed regressions were rerun after S2. `npm run qa:website-restart` passed all 45 rulings that existed before MMR-046 was added, plus the award-panel validation/self-test. Exact approved r1 production-source parity remained **10 of 14**, a truth label rather than promotion authority. `npm run qa:website-approved-visuals` started one script-owned Vite server at `http://127.0.0.1:60862`, passed that exact origin into both approved suites, then returned zero Brain r5 and GTM r6 failures.

Locked isolated-candidate hashes: `index.html` `6599ee5cb0fde91351a482a3f212c7cd8d3a3379f615d80b187439037b9b3bbe`; `styles.css` `ef8e3e4a1e5286a814efd374020ef805c529c2dc82d4071409f85032a30e5b60` (routine Firefox touch-target correction: compact story actions now preserve the 44px minimum); `script.js` `8c51caf1b2a2e96f0caaa0cb43fe369c6050f5cd7b7c6cff66790ab006f96316`; `review.html` `9742ded459c3a14efc34866a1793d15042fc2497d3542621b92bac6360c85368`; `check.mjs` `21c80984d7b414835bf31067e1ac326345f41531296cb468104535f5bc5ef053`.

Poster hashes: `communications-compose` `1e401bc7570823638345c3ba34bd182ad7eb2e68caa11bd95082bf818c48ebc6`; `evidence-connects` `452e38498b933593793a8e8589480d9633c6274e6831d8f608f2aa810f08bf4c`; `opportunities-resolve` `ae55a0e63090240bc750a91c1c6ca9e1b3ddd2b2b7c58d8cf68636bafbc7dd2e`; `quiet-workshop-growth` `6325cb3da143b987331a27d09bb672dbcaa490ce78e6933dc4f842ddf4e70b45`; `ready-for-decision` `a2a0902af1352826c9cb2aa5c3ae5817eb48a8b78a48ebcb847f62a92ddecb42`; `signals-arrive` `09f7cdf5a1874954258f95679cdab042ce18d7fe3d8d448d6ebfece39943759b`.

Exact review evidence: `C:\Users\krish\.scratch\mindmake-case-proof-field-s2\paired-review.png` SHA-256 `458434d9feb43ae5efb6616e007e5419825daa612bc4e10a32fc558d4faa0112`; desktop overview `chromium-overview-1440x700.png` `6f3a836d5ae3bd6719a7b4bfbd5bdacf586f12b802e6a362004cd3452022794a`; desktop opened proof `chromium-open-1440x700.png` `e15617c2119fd0c576a006441ca4c0a7eb38ea643798415b442ae603e0e5e14c`; mobile overview `chromium-overview-390x844.png` `b7cc73b840039ab9e187c2215a99eb0c5161f7a4890837dbb8eda095e5718fa0`; mobile opened proof `chromium-open-390x844.png` `9a0ce46204ba37414c75259bc7000f566783e151a3515d6995d6e501100e19ab`; compact landscape `chromium-overview-844x390.png` `81d476ad4f02f30fc9487914244ea14c575cb68c96ba6459f5ce0ae4cae544e7`.

Historical pre-owner-review state: **CASE-PROOF-FIELD-S2 was rendered and verified as an isolated material candidate, but was not yet approved at this point in the sequence**. `/case-studies`, shared production components and production styles were still unchanged. The later owner lock and local integration below supersede only that pre-review status. Nothing was committed, merged, preview-deployed, deployed, published or made live.

Owner lock: after reviewing the exact CASE-PROOF-FIELD-S2 desktop/mobile evidence, Krish said, "looks good". This is explicit material approval of CASE-PROOF-FIELD-S2. MMR-046 records the lock and MMR-039 records the approved Proof Field film-system exception visible in that reviewed artifact. Combined with the standing instruction to continue autonomously after material approval, this authorises local `/case-studies` implementation and route-continuity verification in the existing dirty worktree. It does not authorise a new shared-shell hierarchy, another material reinterpretation, commit, merge, preview deployment, production deployment, publication or a physical-device pass claim.

Local `/case-studies` integration now renders the locked S2 proof field from the canonical eight `clientStories`, retains the source-record archive and shared journey components, and preserves the five isolated source hashes. The first independent guardian and blind review correctly blocked promotion on routine integration defects: compact 200-percent text clipping, open/Back focus recovery, privacy-strip overlap with the mobile dock, inert no-JavaScript story controls, undersized and continuously moving testimonial actions, two visible transcription errors and stale 45-ruling completion text. These findings did not reopen the approved material direction.

Those routine durability corrections are now implemented and deterministically verified. Compact layout grows with 200-percent text; Enter, Space, Escape and browser Back preserve focus and recover the originating proof region; the mobile dock reads the measured privacy reserve; all eight primary proof controls retain real source-record anchors without JavaScript; the testimonial rail stops under hover or focus, exposes an explicit 44-pixel Pause/Play control and one roving quote action; the visible transcription errors are corrected; and the completion contract now counts all 46 rulings. The compact overview keeps its interaction instruction visible. The Contact privacy link and GTM evidence-source link now retain 44-pixel hit areas without changing their approved visual hierarchy.

Final local deterministic evidence after those corrections:

- `qa:case-proof-field-production` passed all 11 Chromium viewports, all 6 representative WebKit viewports and all 6 representative Firefox viewports with zero failures. Chromium also passed the reduced-motion, SSR/no-JavaScript and post-review Contact/GTM target checks. The script waits for a hydration-only state before client interactions, caps animation-settle bookkeeping without skipping paint frames and keeps the global skip-link fragment separate from proof-field history.
- `qa:locked-material-production` passed all 11 Chromium Brain/GTM viewports, Brain and GTM interactions, motion fallbacks, all evidence states and evidence capture; WebKit passed 390 x 844, 768 x 1024 and 1440 x 900 for both routes; Firefox passed 390 x 844 and 1440 x 900 for both routes. The physical-device field remains explicitly `not run`.
- `qa:website-restart` passed 46 rulings, 18 findings, 13 routes, 11 viewports, the ten-judge rubric validation and adversarial panel self-test. It still reports exact approved r1 source parity as 10 of 14.
- `qa:website-approved-visuals` started one script-owned Vite server at `http://127.0.0.1:53232`, passed that exact origin to both suites and returned zero Brain r5 or GTM r6 failures.
- The complete unit/integration suite passed 29 files and 475 tests. One history test timed out only while the suite was contending with a concurrent visual server; it passed 4 of 4 alone and the whole 475-test suite then passed when rerun without that contention.
- TypeScript and targeted ESLint returned zero errors. The CSS files were outside ESLint's configured file set and were therefore reported as ignored, not checked.
- Exact integrated source hashes at this point are: `CaseProofField.tsx` `09e26ed9be3fcb6d681c018b2ebbda637d45402246fbf86b995511c65ce8c21d`; `CaseStudies.tsx` `ec54c450ed687acf40fbe239182c49a779b583f8d53804b5214e1be43dd98362`; `ProofDrum.tsx` `04b4027dbb1f15b8f00da33c88a3a4397f46e60854f116bc88754659baaf7956`; `SubscribeBand.tsx` `5ef6cfa9286f6aa84106bbd667101bb51bb7029e65ea1fa5cbae05d4ba75a2bb`; `mindmake-instruments.css` `3a79b449e684d95a521f956065cfe4faa145c087e45d6b8ef2bd80ad11d9bf8c`; `mindmake.css` `b399ffb310cb26e8c80b25da3ea8ebf78852d37880107f60c6478669fe57d6e0`; `mindmake-locked-gtm.css` `0a576666e4fc604b6a460580fb492eb1270363f113f600878064205bc578287a`; `testimonials.ts` `bac103bda330f30cf264b0c794ad4f0a19aea95893776d9e6ddf63e3acedc78e`; `case-proof-field-production-check.mjs` `43285b31e614224f42df01e864ba2e2c340bef18aa684ef0b573cf363f036181`; `locked-material-production-check.mjs` `d72982963a0c853aa9464c4b3c5ee28ee85d890ecd16be30577faf3b0c6d9fb3`.

The fresh history-blind award review did not find clipping, overlap, failed imagery, broken primary navigation or console failures across its eight assigned geometries. It scored the current case route `8.66` desktop and `8.61` mobile: distinctive `award_shortlist` work numerically, but `not_ready` because `world_class_winner` requires 9.2 on both surfaces, every judge at least 8.8 and every hard gate passed. Its most important material ceiling is not a routine layout defect: anonymised outcome proof and undisclosed FAQ pricing cap inspectable trust and conversion clarity. It also left 200-percent zoom, reduced-motion emulation, physical touch/haptics, testimonial expansion, valid email handoff, external Substack navigation and independent factual verification inconclusive in its own session. Root deterministic gates independently pass the automated 200-percent text, reduced-motion and testimonial contracts, but do not convert the blind panel's incomplete observations into blind passes.

Both fresh continuity guardian runs were interrupted before their own final aggregate and therefore correctly returned inconclusive rather than borrowing root evidence. One also keeps MMF-018 open because the full release judge system still lacks complete provenance-bound aggregation, physical-device packets and adversarial stale/duplicate rejection evidence. These are release blockers, not reasons to reopen the approved case-study material surface. Exact approved r1 source parity remains **10 of 14** and still blocks any source-restoration claim. Nothing is committed, merged, previewed, deployed, published or live.

Owner copy ruling after local case integration: Krish accepted the surface and required the final site to contain no explanatory `backup-singer` copy. He explicitly rejected the visible interaction instruction, the two visual-disclaimer lines, the repeated `Fourteen tools running` and `Three kept, eleven stopped` captions, the opened-proof drawing explanation and the synthetic `Eleven tools stopped. One useful system went live.` construction. MMR-047 records the durable rule: the visual cue and information architecture carry comprehension; controls name their own action; copy does not narrate the interface.

This was implemented as a locked production revision without altering the approved CASE-PROOF-FIELD-S2 prototype bytes or its historical evidence. The production field removes the helper block, redundant eyebrow and repeated `Recorded change` labels; the fourteen-switch mechanism retains fourteen visible positions with exactly three active; its redundant endpoint captions are absent; and the canonical result now reads `The team cut eleven tools and put one useful system live.` The underlying outcome still states that eleven of fourteen tools were stopped and the first working system went live inside 90 days. `src/test/copy-restraint.test.ts` now rejects the owner-named phrases across every indexed route, and the production browser gate rejects them in rendered output while continuing to prove the interaction without those instructions.

Verification on the exact revision: `qa:case-proof-field-production` passed 11 Chromium, 6 WebKit and 6 Firefox viewports with zero failures, plus Chromium 200-percent text, keyboard and history recovery, reduced motion, SSR/no-JavaScript and related Contact/GTM target checks. The complete suite passed 29 files and 484 tests; TypeScript passed. `qa:website-restart` passed all 47 rulings, 18 findings, 13 routes, 11 viewports and the award-panel validation and adversarial self-test while still reporting exact approved r1 parity as 10 of 14. `qa:website-approved-visuals` used its own ephemeral origin at `http://127.0.0.1:49337` and returned zero failures for approved Brain r5 and GTM r6. The production integration hashes are: `CaseProofField.tsx` `940412cf6c777151f4464ae84ba421e048e40d937b969f34f3dd86c63c6e1acc`; `rebuildProof.ts` `9548e682692451df95104eeb15f36284a2b8d0d0d2a68ff3c7acf07a354d0432`; `StoryFigure.tsx` `0ba6271b597a2ef7843979c755679d4292d7c79c62cdc0d40cd29a565a9f4936`; `copy-restraint.test.ts` `c890f18d5dd68f60cebf047e0c3044098c21ef413e2de84d3c63750bef435aa17`; `case-proof-field-production-check.mjs` `2c97e4335c457e236319a6668ee6c7866663a417daf1c9a90306043ce6e640e2`. Physical iPhone Safari with VoiceOver and Android Chrome with TalkBack remain not run. Nothing was committed, merged, previewed, deployed, published or made live.

Fresh full-site blind review then exposed two routine defects without reopening any approved material surface. RC3, bound to candidate `fa4724a280b12143ea1fb414808d5cc3b10e5445d7fa3f073f13fa8b664bc7c9`, scored `8.3` desktop and `8.2` mobile and found ellipsised Brain live-record entries on compact screens plus inert `Read it all` proof actions. The live record now centres by each variable-height card, its meaning-bearing text wraps without ellipsis, nested controls are excluded from drum dragging, and the proof disclosure now has deterministic open, Escape and focus-restoration assertions. RC4, bound to `eec3102ac0d4184359e3183b1429a9fea4cbfea8a9e583197965408726c2d3d2`, scored `8.6` desktop and `8.4` mobile and found one remaining truth mismatch in the FAQ's claimed four details plus an avoidable Contact orphan. The FAQ now names first name, last name, work email and business area; the Contact consequence now states that the email app opens and nothing is sent until Send is pressed. Exact copy guards preserve both corrections.

The resulting exact source candidate is `d70c1f350374e910564866e3e6e56914d375db161bd94f5142f0251f4c439cb6`. On that candidate, the complete suite passed 29 files and 486 tests; TypeScript and `git diff --check` passed. The locked Brain/GTM gate passed all 11 Chromium viewports plus representative WebKit and Firefox, interactions, reversible motion, reduced-motion/save-data fallbacks and evidence states. Start here passed its complete Chromium/WebKit/Firefox S4 matrix. Case studies passed 11 Chromium, 6 WebKit and 6 Firefox viewports including real disclosure and recovery behavior. Full-route continuity passed 188 of 188 checks across 13 route patterns. `qa:website-restart` passed 47 rulings, 18 findings, 13 routes, 11 viewports and the strengthened panel self-tests. `qa:website-approved-visuals` started its own ephemeral Vite server at `http://127.0.0.1:49989`, passed that exact origin to both suites and returned zero approved Brain r5 or GTM r6 failures. `qa:approved-routes` truthfully remains failed: exact approved r1 source parity is 10 of 14, the four Brain/GTM source or style hashes do not match, and the r1 `signal-to-choice` instrument is not present. No candidate manifest was substituted for the approved default lock.

The fresh history-blind full-site RC5 panel is bound to candidate `d70c1f350374e910564866e3e6e56914d375db161bd94f5142f0251f4c439cb6` and evidence manifest `00cfc176fa52adf006e816186c274610d0c3c05357dd4fbc11ffc03f07935723`. Its ten schema-valid scorecards passed every judge-owned rendered hard gate, but the aggregate is **Not award-ready** at `8.3` desktop, `8.1` mobile and `8.1` sitewide. Visual art direction scored `8.7` desktop and mobile; inspiration scored `8.8` desktop and `8.3` mobile; immersive interaction scored `8.7` desktop and `8.3` mobile. Commercial buyability and trust is the principal material ceiling at `7.6` desktop and `7.4` mobile, followed by UX/content/technical at `7.8` desktop and `7.7` mobile. The panel consistently identifies late or private offer specificity, insufficiently inspectable commercial terms and proof, and absent in-page closing paths on the immersive offer routes. Those are material hierarchy and trust decisions, not authorisation for an automatic copy or CTA rewrite. The frozen evidence is also incomplete because current physical iPhone Safari with VoiceOver and Android Chrome with TalkBack remain `not_run`.

Fresh full-history RC2 continuity guardians were run against the same exact candidate. They confirm the FAQ, Contact, Brain record, proof disclosure and prior layout regressions are corrected, but the panel is not green. The accepted MMR-039 semantic film map is not yet implemented on New-age leadership, Blog and Answers; this is a material surface change and therefore is not silently patched. Exact r1 parity remains 10 of 14, so source restoration is not established. Current physical iPhone Safari/VoiceOver and Android Chrome/TalkBack evidence is absent. MMF-018 remains open because the panel still uses five judging contexts for ten scorecards and the completion packet lacks the required physical-device provenance. The visual guardian also records missing current numeric 3:1 evidence for the named Brain closing text, while the mobile guardian records several contract-specific increased-text, safe-area, coarse-pointer and exact-viewport observations as inconclusive even though the broader deterministic matrices are green. Any fail or inconclusive item blocks release; judge consensus does not supersede Krish's material approval.

### Commercial-continuity divergence and isolated synthesis

Owner authority: after the evidence-backed award ceiling identified weak commercial clarity, proof and closing hierarchy, Krish said `Ok go`. This authorises exactly one isolated material synthesis inside `prototypes/website-redesign-recovery/commercial-continuity/`. It does not authorise changing Leadership, Blog, Answers, Home, shared navigation, Brain, GTM, Start here, Case Studies or any other production route or shared file. It does not authorise commit, merge, preview deployment, production deployment, publication or promotion of a source manifest.

The recovery gate was rerun before synthesis. `qa:website-restart` passed all 47 rulings, 18 findings, 13 routes, 11 viewports and the award-panel validation and self-test. `qa:website-approved-visuals` started and stopped its own Vite server at the ephemeral origin `http://127.0.0.1:59794`, passed that exact origin to the approved Brain r5 and GTM r6 suites and returned no failures. Both approved paired-review images remain retrievable. Exact approved r1 production-source parity remains **10 of 14**; source restoration is therefore not established, but that truth label does not block fresh isolated work.

Fresh divergence ran under `krish-design` without giving generators rejected r8 layout or rationale. Round one produced three spines: **Bound decision table**, a compact commercial decision surface; **Proof folio**, a physical offer-and-evidence object; and **Film-editing proof cut**, a cinematic sequence that edited illustration into proof. Two independent historically informed judges rejected the set because the concepts converged on the already overused folio, leaf, bench and station grammar. The set was reset without carrying any presentation detail forward.

Round two produced **Twin Focus, Fixed Proof**, an optical comparison instrument; **Opposed Drive**, a pair of mechanical torque arms; and **Raking Light**, a warm material field that made proof legible as light crossed it. Two fresh judges again rejected the set because all three still resolved to a centred two-way chooser and collided with locked Brain/GTM signature language. Raking Light was retained only as evidence that the strongest unclaimed territory was material proof, not as a layout. The set was reset again.

Round three produced genuinely distinct state and interaction models: **Witness Ground**, a proof-first verification disclosure; **Proof takes the ground**, a scroll-led material transformation with static proof and no chooser; and **The Matchline**, a cross-route transition system. Both historically informed judges passed diversity and independently selected **Proof takes the ground**. The selection rationale was that it makes the commercial hierarchy cold-visible, keeps canonical outcome proof static, preserves `Start here` as the sole primary action, separates film from evidence and lets the illustrative plane yield without changing locked offer-route interaction. Witness Ground was rejected because its disclosure risked creating another mini proof browser and confusing CTRL with client evidence. The Matchline was rejected because it reopened multi-route navigation and transition behavior outside the isolated surface. A third reset preceded synthesis. Reset count: **three**.

The synthesis retained one invariant only: an unchanged, proof-major warm surface beside a separate illustrative film edge that physically yields on native scroll. At `1440 x 900`, the cold state shows both ordinary offer links, the complete paid-proof promise, two canonical anonymous outcomes, `Read all eight stories` and the sole filled `Start here` action. Film never sits behind proof. The Leadership and editorial context fixtures use the accepted `ready-for-decision` and `communications-compose` films; Brain uses `evidence-connects`; GTM keeps the accepted `quiet-workshop-growth` to `signals-arrive` handoff. Exactly one video element exists, offscreen/hidden playback pauses, reduced motion and Save Data attach no moving source, no code writes `video.currentTime`, and no-JavaScript keeps the poster and complete offer meaning. Portrait mobile uses a short film edge followed by one idea, both doors, one proof promise and one obvious action in natural flow. Short landscape, constrained motion and increased-text states release the held chapter into static flow.

The task-first and first continuity passes caught six routine failures before owner review: no-JavaScript exposed a dead film button and false in-prototype offer selection; an unavailable MP4 kept a false playback label; header and content anchors drifted beyond the two-pixel grid rule; the visible film disclaimer and repeated proof heading violated the no-`backup-singer` copy ruling; the first standalone use of GTM was not expanded; and the 320 x 568 cold action sat below the visible area. A classic-scrollbar 320px case also overflowed because of a hard body minimum. The corrections keep the selected material hierarchy and interaction unchanged: fallback links now point to the real routes, the film control is hidden until playable, media failure remains poster-backed, the header shares the content anchor, explanatory and duplicate labels are absent, the offer reads `AI go-to-market`, compact portrait keeps `Start here` visible and the hard minimum width is removed. A 225 CSS-pixel increased-text proxy now returns natural flow without horizontal overflow.

The first blind pass found one final hard-gate defect at maximum desktop scroll: the proof sheet reduced the film-side sentence and pause control to fragments. The locked correction retires both text layers to opacity zero and removes the control before the seam reaches them; reverse scroll restores the complete sentence and playable control. The same correction raises compact navigation from 8px to 10px while preserving 44px targets and zero overflow. The checker now asserts the built and reversed states in Chromium, WebKit and Firefox. A fresh continuity delta review independently passed those states at 320 x 568, 390 x 844, 844 x 390 and 1440 x 900, including static landscape, reduced motion, no JavaScript, unavailable media and offscreen playback.

The frozen candidate is **COMMERCIAL-CONTINUITY-S1 / Proof takes the ground**. Its self-owned ephemeral-server gate passed 11 Chromium viewports (`320 x 568` through `1920 x 1080`) and five representative WebKit and Firefox viewports each, plus cold hierarchy, both route links, real no-JavaScript route fallbacks, context-specific Start targets, GTM film handoff, reversible scroll, complete film-annotation retirement and restoration, pause/play, offscreen and unavailable-media consequences, 44px controls, touch, 200-percent text including a 225 CSS-pixel proxy, reduced motion, Save Data, no JavaScript, runtime-error and paired-review geometry checks with zero failures. Evidence: `C:\Users\krish\.scratch\mindmake-commercial-continuity-s1\paired-review.png`, SHA-256 `81116e5eb29e9418c79a627031ae638cc288512ca014310d6a45b258f23bfa4b`; cold desktop `chromium-1440x900.png`, `bfcad308375a5a1fa2f606e169739dfa7f96c8c3f01cd7b01853dbaecee2f5df`; built desktop `chromium-1440x900-built.png`, `1620a05fd16b1a9eb667698c46a2019ffa6a39e3d2fb1309fafc53797464899d`; mobile `chromium-390x844.png`, `093635c31b30fb81cc4c8affb154d16bf4936afbb8c392ffbef1fe54c7d665d2`; compact mobile `chromium-320x568.png`, `911fcb2441af55fb567b82b4bf8f56c4e2368171fe52d843ebd30e40f35adf48`. Source hashes: `index.html` `954957d47b699a415fa373843496e05bdc7a288525d0fae1d3d827fc9cc5daa2`; `styles.css` `c5d4ec541347c5a9a6cb98bc10f4ee84f377fd270b45306e141b6369a14fb41e`; `script.js` `21361d27b0d966b0f18f5861d5d4d429a8d71bff397e3ef01fa734f014c4b881`; `review.html` `cc567650f0e0e25bdad6bde8c7991565a56c4e36c48c8bfc1f7ea2e3b707aeee`; `check.mjs` `6c6fed97864e28fc9fafd2a177669773504bf58743c40468eb77638b2d95b1b2`.

The fresh history-blind award review passed all ten rendered hard gates and graded the isolated surface **A- / award shortlist** at `8.82` desktop and `8.79` mobile. Art direction scored `9.00` on both surfaces; desktop immersion scored `9.00`, mobile immersion `8.85`; UX/content/technical scored `8.90` on both. It does not reach `world_class_winner`: buyability and trust remain `8.40`, below the required `8.8` judge minimum, because the first-surface outcomes are necessarily anonymous and the strongest substantiation sits behind `Read all eight stories`; both aggregate surface scores remain below `9.2`. The panel also notes that audience/category clarity is inferred through the two routes and compact navigation remains visually small at 320px despite being legible and operable. Those are material commercial-content ceilings or later integration considerations, not routine defects to silently change before owner review.

Owner lock: after reviewing the exact frozen COMMERCIAL-CONTINUITY-S1 paired surface, Krish said `looks great!`. This explicitly approves **COMMERCIAL-CONTINUITY-S1 / Proof takes the ground** as a material surface. The approval locks its proof-major hierarchy, warm physical visual language, film-to-proof separation, cold-visible offer and evidence structure, reversible scroll transformation, context-specific film mappings and independently sequenced mobile composition. MMR-048 records the durable ruling. Later work may integrate this exact direction faithfully or make routine corrections inside it; any reinterpretation of what the visitor notices first, understands next, how the surface behaves or its signature material language requires a new rendered decision.

At owner lock, the approved artifact still existed only as an isolated prototype in this intentionally dirty local worktree. No production route, shared production component or production style had yet changed. That historical status is superseded by the faithful local integration below; the material approval still does not authorise a new interpretation, commit, merge, preview deployment, production deployment or publication.

### Commercial-continuity local implementation verification

The exact approved COMMERCIAL-CONTINUITY-S1 direction is now integrated into the local public routes without changing the shared shell or homepage hierarchy. One scoped `CommercialContinuity` system appears exactly once on New-age leadership, Blog, an indexed Blog article, Answers, an indexed Answer, AI Brain and AI GTM. Leadership uses `ready-for-decision`; editorial routes use `communications-compose`; Brain uses `evidence-connects`; GTM hands `quiet-workshop-growth` to `signals-arrive` as the proof sheet builds. The two offer links use real React routes, `Read all eight stories` reaches `/case-studies`, and the sole filled `Start here` action opens each route's existing real `LeadBrief` rather than a duplicate flow.

The integration preserves complete poster-backed SSR and no-JavaScript meaning. Moving sources attach only after hydration when the surface is visible and motion is allowed; reduced motion, Save Data and 200-percent text remain static; hidden or offscreen films pause; a failed film permanently retires its moving source and keeps the correct poster; the pause control disappears synchronously before the proof sheet covers it; GTM's film handoff is causal and reversible. Routine production-shell corrections increased the portrait film reveal so the fixed header cannot clip its title or control, while compact landscape remains a static one-screen composition. These corrections do not change the approved hierarchy, interaction model or signature visual language.

Task-first UX and verification evidence on the exact integrated surface:

- `qa:commercial-continuity-production` used one script-owned Vite origin and passed 77 Chromium, 42 WebKit and 42 Firefox route/viewport cases: 161 isolated browser contexts, 168 retained observations and zero failures. Every applicable case verified one surface, correct context and poster, no horizontal overflow, painted-text containment, 44-pixel targets, cold-visible `Start here`, real offer/story links, reversible desktop build, and the real `LeadBrief` dialog. The policy tail passed reduced motion, Save Data, unavailable-media fallback, cookie-notice collision checks and the loaded-film handoff: when the visible Brain record sequence owns attention, the simultaneously visible commercial film is paused. Evidence: `C:\Users\krish\.scratch\mindmake-commercial-continuity-production\report.json`.
- The locked Brain/GTM production gate passed all 11 required Chromium viewports, representative WebKit and Firefox viewports, interactions, reversible motion, constrained-media fallbacks, evidence states and evidence capture. The exact rendered pixels now measure `6.90:1` for `#correction-title` and `10.28:1` for `#record-title` in normal and reduced-motion states.
- START-HERE-INTERACTION-S4 passed its complete Chromium, WebKit and Firefox matrix, including validation focus, designated synthetic company read, reversible Time change, folio fit, reduced motion and the pre-send `Nothing has been sent` consequence.
- CASE-PROOF-FIELD-S2 passed 11 Chromium, 6 WebKit and 6 Firefox viewports with zero failures. Full-route continuity then passed all 13 route patterns and all 188 checks across the required Chromium matrix plus representative WebKit and Firefox.
- The complete unit/integration suite passed 30 files and 496 tests. TypeScript, the client build, the SSR build and repository-wide lint all passed; repository-wide lint retains four existing warnings and zero errors. The added regression proves that dismissing either nested Time editor restores focus to its invoking control. `git diff --check` reported only the existing LF-to-CRLF notices.

The exact post-correction candidate is `130dfd0cee9db1923346a8f5207271d7424020edc906a34ee279cbc5e84e43c8`. Its routine-only delta comprises nested-editor focus restoration, deterministic ownership when the Brain record and commercial film are simultaneously visible, and corrected locked-record title contrast. Independent task-first validation closed both owned UX hard-gate regressions and MMF-007 without changing what a visitor notices first, understands next, the interaction model or the locked material language.

A complete history-blind panel was run on the immediately preceding candidate `34498a6d92c07c5402c26e41dabd475ab6a339cc7319c558e5ec1489d7755770`. Desktop/mobile scores were: art direction `9.00 / 9.00`; originality `8.55 / 8.55`; immersion `8.85 / 8.85`; buyability and trust `8.55 / 8.40`; UX/content/technical `8.20 / 7.90`. It did **not** reach `world_class_winner`: originality and buyability remained below the required `8.8` judge minimum and the aggregate surfaces remained below `9.2`. Its material ceiling was delayed audience clarity, anonymous first-surface proof, `Start here` underselling the intelligence, the mobile email request arriving early, and the strongest outcomes not recurring in the rendered source records. The exact current candidate has independent rendered delta evidence for the routine defects above, but the complete blind panel has not been rerun or rebound to its SHA; the panel's material-commercial findings therefore remain open rather than silently redesigned.

The unmodified release build correctly stops at `qa:approved-routes`. Exact approved r1 source parity remains **10 of 14**: the four approved Brain/GTM source or style hashes still differ, and the r1 `signal-to-choice` instrument is still absent. No candidate manifest was substituted for the approved default lock. This is a truth label and promotion blocker, not a reason to undo the verified local integration.

Release status remains literal: locally implemented and verified; not committed, not merged, not previewed, not deployed, not published and not live. MMF-018 remains open; no complete history-blind `world_class_winner` result or fully green provenance-bound continuity-guardian aggregate exists for the exact current candidate; current physical iPhone Safari with VoiceOver and Android Chrome with TalkBack remain `not run`. Those items, exact source approval and Krish's release authority still block promotion.

### Commercial-readiness second divergence

Owner authority: after reviewing the faithful commercial-continuity integration and its remaining award ceilings, Krish said `ok, do it all to go-live readiness`. This authorises reversible work toward release readiness and one new isolated material synthesis inside `prototypes/website-redesign-recovery/commercial-continuity/`. It does not waive the material-approval rule and does not authorise public-route or shared-system reinterpretation before rendered approval. Commit, merge, preview deployment, production deployment, publication and promotion remain unauthorised.

The recovery gate was rerun on candidate `130dfd0cee9db1923346a8f5207271d7424020edc906a34ee279cbc5e84e43c8`. `qa:website-restart` passed 48 rulings, 18 findings, 13 routes, 11 viewports, five continuity guardians and ten blind judges. `qa:website-approved-visuals` started and stopped its own Vite server at the ephemeral origin `http://127.0.0.1:64365`, passed that exact origin to the approved Brain r5 and GTM r6 suites and returned no failures. Both approved paired-review images remain retrievable. Exact approved r1 production-source parity remains **10 of 14**; source restoration is not established, but that truth label does not block fresh isolated work.

Three history-blind generators received the required outcome, invariants, exact proof boundaries and distilled failure requirements without rejected r8 layout or rationale. They produced materially distinct spines:

- **Proofglass**: one continuous engraved evidence field with every outcome readable at rest and a freely positioned inspection lens that deepens one claim in place; desktop uses pointer, click and keyboard, while mobile uses tap-first inline inspection with optional offset drag.
- **The Evidence Plane**: a native-scroll plane progressively replaces cinematic friction with chronological proof, with a separately sequenced vertical mobile boundary.
- **The first clear move**: a physical selector instrument turns three small choices into a deterministic decision brief before any optional email, with simultaneous desktop controls and one-question-at-a-time mobile state.

Pairwise conceptual distance passed. Proofglass versus Evidence Plane differs on simultaneous versus sequential disclosure, free evidence selection versus scroll progression, direct focus versus transformation, spatial field versus chronological ledger and selected state versus scroll state. Proofglass versus First clear move differs on inspection versus diagnosis, proof choice versus answer composition, direct evidence focus versus selectors, persistent traces versus generated brief and selected evidence versus branching state. Evidence Plane versus First clear move differs on authored scroll sequence versus visitor-led rehearsal, progression versus answer agency, native scroll versus controls, accumulated proof versus conditional advice and spatial progress versus recoverable branching.

Two fresh historically informed judges agreed that the set was genuinely diverse and that Evidence Plane was a disguised repetition of the approved `Proof takes the ground` transformation. One selected Proofglass because it preserved proof primacy while materially changing agency; the other selected First clear move because it most directly demonstrated value before email. A third historically informed tiebreak judge selected **Proofglass**, conditionally: the outcome inscriptions must all remain legible without operating the lens; the lens must deepen evidence in place rather than become master-detail; category, audience and both offer routes must be cold-visible; film must remain illustrative and separate; click, tap and keyboard must reach identical evidence; mobile cannot depend on precision dragging; and `Start here` must produce a specific next decision, first step and observable success criterion before any email ask.

The rejected Evidence Plane carried no presentation detail forward. First clear move's selector, three-question branching model and station metaphor were also discarded; only the verified requirement to provide useful pre-email value remains. A full reset preceded synthesis. **Reset count: one.** The selected spine is a prototype candidate, not an approved direction. If its optical treatment compromises legibility, collapses into ordinary master-detail, or its single-decision result becomes generic advice, the synthesis fails rather than silently reverting to S1 or the discarded selector.

### Commercial-readiness synthesis: COMMERCIAL-READINESS-S2-PROOFGLASS

The single selected Proofglass synthesis is implemented only under `prototypes/website-redesign-recovery/commercial-continuity/` as `index-readiness-s2.html`, `styles-readiness-s2.css`, `script-readiness-s2.js`, `review-readiness-s2.html` and `check-readiness-s2.mjs`. The earlier S1 files were preserved. No production route, shared production component, production style, approved manifest or continuity contract was changed.

The cold desktop surface is a bounded 38/62 instrument: a separate illustrative `ready-for-decision` film carries the category, named audience, paid-proof promise, both offer routes and sole filled `Start here` action; the warm evidence plate carries four canonical anonymous outcomes, all readable before interaction. Portrait mobile uses a short film-led arrival followed by the evidence plate in natural flow. Short landscape uses an independently composed 46/54 split so the primary action and first evidence remain simultaneously reachable. Film is never presented as client evidence.

The Proofglass is a direct inspection control rather than decoration. Clicking or tapping any record, dragging the numbered glass, or using its Arrow, Page, Home and End keys resolves to the same in-place evidence. The glass freezes the record centres at pointer-down and resolves the final pointer position on release, so expansion cannot destabilise selection and coalesced browser pointer events cannot lose the final target. Motion is removed while held. Each row has a restrained plus/minus disclosure cue; all four outcome inscriptions remain readable without operating it; mobile does not require precision drag.

`Start here` opens a one-sentence preflight and returns a deterministic useful frame before any email request: `Decide first`, `Try on real work`, and `Know it worked when`. The returned frame now uses the same warm physical record language as the evidence plate, exposes Copy and `Continue to private brief`, restores focus on close and preserves unfinished input through interruption. It does not fabricate bespoke AI reasoning or public commercial terms.

Routine defects found and closed before review include hidden detail content being painted by author display rules; a Proofglass handle crossing the mobile evidence column; landscape playback control loss and compressed copy; supporting attribution disappearing at 1024; result focus landing low in the sheet; unfinished input being lost; copied state persisting onto a new result; classifier precedence misrouting build-or-partner input; active-record collapse not reopening; disclosure being under-signalled; and a cross-browser drag race caused by animated record geometry and coalesced pointer movement. The final checker includes regression assertions for each applicable failure, including glass-to-evidence collision and direct glass-input equivalence.

The final synthesis gate started and stopped its own ephemeral Vite server and returned **zero failures**. Chromium passed `320 x 568`, `360 x 800`, `390 x 844`, `430 x 932`, `768 x 1024`, `844 x 390`, `1024 x 768`, `1280 x 800`, `1440 x 700`, `1440 x 900` and `1920 x 1080`. WebKit and Firefox each passed `320 x 568`, `390 x 844`, `844 x 390`, `1440 x 700` and `1440 x 900`. The gate also passed 200% text including the `225 x 568` proxy, reduced motion, Save Data, no JavaScript, unavailable media, offscreen playback pause, coarse pointer, keyboard/focus restoration, unfinished-state recovery, deterministic before-email value, copy consequence, review-wrapper geometry and direct Proofglass drag/Arrow/Home/End equivalence. Physical iPhone Safari with VoiceOver and Android Chrome with TalkBack remain **not run** and cannot be inferred from emulation.

After freeze, `qa:website-restart` again passed all 48 rulings, 18 findings, 13 routes, 11 viewports, five guardians, ten judges, award-panel validation and self-test. `qa:website-approved-visuals` again started and stopped its own Vite server at the exact ephemeral origin `http://127.0.0.1:65328`; the approved Brain r5 and GTM r6 suites both returned zero failures. The approved prototypes therefore remain retrievable after the isolated work.

Frozen file hashes are: HTML `8cb017592b7593001d2daa0af7baa1d9a47223d144b8533b9963c936c1385664`; CSS `76fd77f402d115aa58b4d83b475679ac222895d1e2e8d70e99cf250bf5488c3d`; JavaScript `77c769d5c29641f760dd9230cbab0333de0d2f0b59a33f2c68ddd1d831b888b9`; review wrapper `aafe2e5b6aa4de20dc52c9dc9de3cbe0ee007b8e8219a6a00a430e03df6c3b2a`; gate `9fa05c90cbca2bd7a7eda47d895d711e2c87991d890bc872f56c7f49ccd2a0ac`. The paired review evidence at `C:/Users/krish/.scratch/mindmake-commercial-readiness-s2/paired-review.png` is `5023efa2d672ded9ec30e1ef5f39fe7d688df09c4526f5f020cd9881bf7fc120`. Clean landscape and useful-frame captures are `175f8f92ff8ff57f9d104f5be03ee2ed983e80cfe1a0aefed0db5d7cb785f3d6` and `7335340403d675589ea74cfdfa18da177d833bd70c10c9f046ba638f00e2632e`.

The frozen history-blind panel did **not** return `world_class_winner`. Art direction scored desktop `8.3`, mobile `8.1`; originality scored desktop `8.1`, mobile `7.9`; task-first UX scored desktop `8.7`, mobile `8.5`. All assigned visual real-estate, micro-layout, responsive, primary-task, keyboard/focus, motion-safety, critical-failure and cognitive-pacing gates passed on the supplied executable and rendered evidence. Truth remains inconclusive because anonymous quantitative claims cannot be authenticated from the interface. The highest remaining ceilings are substantive rather than routine: the glass selects evidence elegantly but does not yet expose uniquely Mindmake reasoning; the initial `Start here` label does not disclose the useful pre-email outcome; and short landscape necessarily gives the proof plate more visual authority than the compressed offer. These are not silently redesigned before owner reaction.

Material status: this is one isolated rendered synthesis awaiting Krish's explicit approval. It is not production-integrated, source-approved, committed, merged, previewed, deployed, published or live. Exact approved r1 source parity remains **10 of 14**, MMF-018 remains open, the exact final-source manifest does not exist and the physical-device release evidence is incomplete. No promotion is authorised.

### Proofglass S3 authority and governing rule

After reviewing the frozen S2 evidence and its blind-panel ceilings, Krish asked how it could reach `world_class_winner`. The recommended route was to preserve the film, typography and warm physical record language, but make the glass expose Mindmake's actual reasoning; make the first action demonstrate useful value; add causal, reversible scroll; and independently compose portrait and short landscape. Krish explicitly replied `Ok go`. This authorises exactly one isolated material **COMMERCIAL-READINESS-S3-PROOFGLASS** render inside `prototypes/website-redesign-recovery/commercial-continuity/`. It does not approve the resulting surface in advance, authorise production-route or shared-system changes, close truth provenance, or authorise commit, merge, preview deployment, production deployment, publication or promotion.

S3 must use only the approved public-use fields in R-02, R-03, R-05 and R-08: situation, call, work, outcome, exact authorised quote and anonymous role/sector. Retired R-02 percentages, private terms, unapproved identities and fabricated verification are forbidden. Every inspected record must keep `Starting point`, `The call`, `AI can carry`, `You keep` and `Recorded change` causally connected without becoming a detached master-detail card. The two public doors remain ordinary links. The sole filled primary action remains `Start here`, but may state the useful consequence inside the same control. The pre-email frame must remain deterministic and honestly bounded. Film remains generated illustration, separate from proof.

Material checkpoint: present one cold desktop/mobile S3 render for Krish's unanchored reaction. Production integration and the next material surface remain paused until explicit approval. The predeclared acceptance evidence is: no S2 regression at every governed viewport; all record stages and action consequences accessible by scroll, click/tap and keyboard without precision drag; reduced-motion equivalence; useful value before email; causal scroll that never seeks video time; exact public-use proof strings; a clean independent portrait and short-landscape composition; and a complete frozen blind panel against `quality/award-panel/rubric.v2.json`. Truth remains inconclusive unless the rendered public evidence genuinely establishes it.

### COMMERCIAL-READINESS-S3-PROOFGLASS synthesis and freeze evidence

The one authorised S3 synthesis is rendered only inside `prototypes/website-redesign-recovery/commercial-continuity/`. It preserves the accepted dark, warm film arrival and physical client-record language, then makes Proofglass a causal decision instrument. Desktop scroll first raises the record and then advances `Starting point`, `The call`, `The system carried`, `The leader kept` and `Recorded change`; reverse scroll restores the same states. Scroll never seeks film time. Portrait and short landscape use independent natural-flow compositions with five numbered positions and one readable selected causal label. Click, tap, direct glass drag, Arrow, Page, Home and End resolve to the same stage. Every stage exposes its complete causal sentence in its accessible name. Reduced motion preserves the complete record, and the no-JavaScript fallback reveals all five stages as stacked readable prose.

`Start here` now states its useful consequence in the filled control: `Frame one real decision`. Before any email request it returns an honestly bounded four-part decision record: starting point, what AI can carry, what the leader keeps and the first proof. Its deterministic branch frames preserve the real alternatives for build/buy/hybrid, build/partner/hybrid and hire/automate/hybrid decisions. The result survives close/reopen, can be copied, can be changed without losing the original sentence, restores focus on close and continues to the existing private brief. The two AI offer doors remain ordinary links.

The synthesis uses only the approved public-use fields and exact quote excerpts in R-02, R-03, R-05 and R-08. Anonymous organisation boundaries remain explicit: `Public wording approved · organisation withheld by agreement`. Generated film remains labelled illustration and is never presented as client evidence. No retired percentage, private term, unapproved identity or fabricated verification was introduced.

Routine defects found and closed before freeze include portrait and short-landscape labels being compressed below a professional reading size; the proof sheet being able to settle under the sticky mobile header; mixed build/buy and comma-separated hire subjects being misclassified; result state and focus recovery gaps; an inaccessible short `aria-label` overriding the complete stage sentence; the no-JavaScript fallback concealing inactive stage meanings; and Firefox intermittently applying native reverse-Tab movement after the modal focus trap. The modal now owns every Tab step at key-down and reasserts the destination at key-up; a separate 100-cycle Firefox stress test returned zero failures before the final matrix.

The final S3 checker started and stopped its own Vite server at `http://127.0.0.1:5173` and returned **zero failures**. Chromium passed `320 x 568`, `360 x 800`, `390 x 844`, `430 x 932`, `768 x 1024`, `844 x 390`, `1024 x 768`, `1280 x 800`, `1440 x 700`, `1440 x 900` and `1920 x 1080`. WebKit and Firefox each passed `320 x 568`, `390 x 844`, `844 x 390`, `1440 x 700` and `1440 x 900`. The same gate passed causal scroll and reversal, click/tap/keyboard/drag equivalence, modal focus and recovery, deterministic decision branches, copy consequence, reduced motion, Save Data, no JavaScript, unavailable media, coarse pointer, review geometry and 200% text reflow including the `225 x 568` proxy. Physical iPhone Safari with VoiceOver and Android Chrome with TalkBack remain **not run** and are not inferred from emulation.

The frozen S3 history-blind material panel used three independent jurors with no owner history. Art direction and interaction scored desktop `9.3`, mobile `9.2`; originality scored desktop `9.3`, mobile `9.2`; task-first UX scored desktop `9.2`, mobile `9.2`, with buyability `9.3`. The resulting surface averages are desktop `9.27` and mobile `9.20`. Every juror returned `world_class_winner: YES` in its assigned S3 scope and no assigned hard-gate failure remained. This is the isolated material-surface verdict; it does not substitute for Krish's approval or the later release-wide ten-judge, provenance-bound aggregate.

After freeze, `qa:website-restart` passed all 48 rulings, 18 findings, 13 routes, 11 viewports, five guardians, ten-judge rubric validation and self-test. It continues to report the baseline literally: 11 Brain S2 lock files match and exact approved r1 production-source parity remains **10 of 14**. `qa:website-approved-visuals` started and stopped its own Vite server at the exact ephemeral origin `http://127.0.0.1:63153`; approved Brain r5 and GTM r6 both returned zero failures. The approved visual prototypes remain retrievable and no candidate manifest was substituted.

Frozen S3 hashes are: HTML `03673392bb4d9b0419f32e9eea13cd06d17925a9a3c63e462ead4239a5abe232`; CSS `9a17d3f1dec6c92933fb5e7ae09ed53c7b06b8e22788a2434e3b525912a90325`; JavaScript `5ee1c8cc99e9d379b2104d6d13c8ba154118f86cf082cda6ff06d52c720d2d0e`; review wrapper `2e6949238fb3b91d9e3d3786d6f672629ca073ee593561c13fa360fd967687e4`; deterministic gate `13721855997e9bfa61fca169849f2a5a98369d138a1385b0352da88b2195734e`. The paired review evidence at `C:/Users/krish/.scratch/mindmake-commercial-readiness-s3/paired-review.png` is `7755f3e364a94143f8a6aa07442887538562b9d7731a03522d2c24ecf10d7c36`.

Material status: **awaiting Krish's explicit approval**. S3 is isolated and rendered; it is not production-integrated, source-approved, committed, merged, previewed, deployed, published or live. Exact approved r1 parity remains 10 of 14, MMF-018 remains open, the release-wide continuity aggregate and final approved manifest do not yet exist, and current physical iPhone Safari/VoiceOver plus Android Chrome/TalkBack evidence is missing. No promotion is authorised.

### COMMERCIAL-READINESS-S3-PROOFGLASS material lock

Krish reviewed the frozen S3 responsive render and replied `love it`. This is explicit material approval of the exact S3 artifact identified by the hashes above. The approval locks its first-notice hierarchy, dark warm film arrival, physical record sheet, four canonical anonymous records, five-stage causal Proofglass, independent portrait and short-landscape sequences, `Frame one real decision` consequence and deterministic before-email decision record. It supersedes S1 as the commercial-readiness direction without deleting or rewriting the preserved S1 history.

The prior `do it all to go-live readiness` authority now permits faithful local production integration through `krish-build`. It does not permit a new interpretation, any material change to the approved render, commit, merge, preview deployment, production deployment, publication, source-manifest promotion or a claim that the site is live. `krish-design` owns drift classification; routine responsive, semantic and implementation corrections inside the lock remain autonomous. The exact next action is to integrate the locked S3 system into the existing commercial-continuity production insertion points and existing private Start here journey, then run the focused production gate, full route continuity, complete deterministic suite, provenance-bound continuity guardians and release-wide blind panel before any promotion decision.

### COMMERCIAL-READINESS-S3-PROOFGLASS local production integration

The owner-approved S3 Proofglass direction is now faithfully integrated at the seven existing commercial-continuity insertion points: AI Brain, AI GTM, New-age leadership, Blog, an indexed Blog article, Answers and an indexed Answer. The previous S1 component and style remain preserved and untouched. One scoped `CommercialProofglass` implementation carries the approved film arrival, four canonical anonymous records, five causal stages, independently sequenced portrait and short-landscape layouts, deterministic before-email decision frame and handoff to each route's existing private `LeadBrief`.

Routine implementation defects were found and closed without changing the material lock: the global production CSS overrode the semantic `hidden` state; two controls measured 42 rather than 44 CSS pixels; WebKit and Firefox required explicit timing and glyph assertions; an already-open page needed dynamic 200-percent-text policy re-evaluation; and a simultaneously visible Brain record and commercial film could compete for motion ownership. The final system now enforces hidden-state durability, 44-pixel targets, cross-engine timing and label checks, live increased-text fallback, and deterministic deferral of the commercial film while the Brain record owns attention.

The focused production gate started its own local origin and passed the full 11-viewport Chromium matrix, five representative WebKit viewports and five representative Firefox viewports. It also swept all seven route insertions at `390 x 844` and `1440 x 900`, plus reduced motion, Save Data, 200-percent text, unavailable media, causal scroll and reversal, record/stage interactions, validation recovery, deterministic decision branching and private `LeadBrief` handoff. Thirty-nine retained observations returned `failures: []`. Evidence: `C:\Users\krish\.scratch\mindmake-commercial-proofglass-production`.

The wider deterministic evidence is also green. Full-route continuity passed all 13 route patterns and 188 checks across the complete Chromium viewport matrix plus representative WebKit and Firefox. The locked-material production gate passed the Brain and GTM sequences, interaction states, contrast, reflow and motion fallbacks. The repository suite passed 30 files and 496 tests; TypeScript, Vite client build and SSR build passed; lint returned zero errors and four pre-existing warnings outside this surface. `qa:website-restart` passed 49 rulings, 18 findings, 13 routes, 11 viewports, five guardians and the ten-judge rubric validation/self-test. `qa:website-approved-visuals` started and stopped its own Vite server at `http://127.0.0.1:49692` and returned `failures: []` for approved Brain r5 and GTM r6.

The production implementation hashes at this verification point are: `CommercialProofglass.tsx` `a29fa3dde06844fbc39730bb19312bda27d479de864d4979633b923e3805a858`; `mindmake-commercial-proofglass.css` `37eb36e0650fa830c9455c78ccc597aafd6315b705232f1abaad7ee2d3216a46`; production checker `26b50d39582f6974aa38b65c96b1bc12317ed18212be371fd08c2b42209f68c2`; regression test `5926abe7c7ca5517253b24e8807c57aad10ddc39756af9297f62fcebd3d50b6c`.

Release status remains literal. The Vite client and SSR artifacts have been built locally, but the canonical `npm run build` remains correctly blocked before compilation by `qa:approved-routes`: the approved AI Brain source and style hashes differ, the approved AI GTM source and style hashes differ, and the r1 `signal-to-choice` instrument is absent. Exact approved r1 production-source parity therefore remains **10 of 14** and no candidate manifest was substituted. Current physical iPhone Safari with VoiceOver and Android Chrome with TalkBack remain **not run**; MMF-018 remains open. The branch is not committed, merged, previewed, deployed, published or live.

### Release-candidate verification after S3 production integration

Krish reviewed the exact integrated commercial-readiness surface and replied `love it`. That confirms the existing S3 material lock; it does not authorise a further material reinterpretation. The post-lock release pass therefore made routine corrections only: lazy hash navigation now waits for its real target and honours the target's declared scroll margin; case-study record links keep the archive heading below fixed chrome; Start here exposes both choices in the initial `844 x 390` view; short-landscape navigation is scrollable below the header; menu focus is deterministic in Chromium, WebKit and Firefox with reduced motion; and the no-JavaScript gate now rejects empty Vite shells and tests the prerendered route structure.

The release-wide blind run `2026-09-20-proofglass-release-candidate-r2` froze candidate `55a7853a579698a5dad1c7dec959b40a3d741536e1f7c0c256f7af65441396f8` with 24 hash-matched screenshots and 15 required observations. Its independent results were: art direction `8.1 / 8.1`; originality `7.545 / 7.080`; immersion `8.7 / 7.1`; buyability and trust `6.70 / 6.32`; UX/content/technical `8.270 / 8.050` for desktop/mobile respectively. Visual, real-estate, responsive, keyboard/focus, motion-safety and desktop action-consequence gates passed. Mobile action consequence failed because overlapping 44-pixel Brain graph targets could cause a tap on one visible idea to activate a neighbour at `320 x 568`. The commercial jury also found that price, scope, timing and action consequences are not consolidated before the five-step work-email journey; the originality jury found that mobile still reads as a stacked or miniaturised desktop idea rather than a phone-native signature interaction. Those commercial, hierarchy and signature-interaction ceilings are material findings and were not silently redesigned.

The Brain graph defect was closed as a routine target-geometry correction. Pointer selection now resolves to the nearest visible idea centre while every 44-pixel button retains its independent keyboard behavior. A new deterministic route assertion taps all 20 visible idea centres at the governed small-phone sizes. Direct three-engine verification passed every centre at `320 x 568`, and the complete full-route gate then passed all 13 route patterns and 188 checks across the 11-size Chromium matrix plus representative WebKit and Firefox with `failures: []`. The exact current post-correction candidate is `1678158f07834a9dedd3837bae1c4758d2b1aeca6b692cccba4de07ad18f6a3c`.

The complete locked-material gate then rebound to that exact candidate and passed the full 11-size Chromium matrix plus representative WebKit and Firefox. It retained all 20 meanings, 18 relationships, 10 sources, 3 corrections and 51 record entries, the complete GTM signal-response system, explicit evidence/recovery states, late-section contrast and reversible or constrained motion with `result: pass`. Physical-device status remained `not run`.

Production-shaped local artifacts were rebuilt from that source: Vite client build, SSR build, sitemap, `llms.txt` and all 26 prerendered indexed pages succeeded. The strengthened no-JavaScript run passed 11 route families, all 21 FAQ answers and zero clipped readable blocks. The complete suite passed 30 files and 496 tests; TypeScript passed; lint retained four pre-existing warnings and zero errors; `git diff --check` retained only the existing line-ending notices. `qa:website-restart` passed 49 rulings, 18 findings, 13 routes, 11 viewports, five guardians and ten rubric judges. `qa:website-approved-visuals` owned ephemeral origin `http://127.0.0.1:49297` and returned zero Brain r5 and GTM r6 failures. The focused S3 production gate again passed its complete Chromium, WebKit and Firefox matrices, 39 observations and seven production insertion points with zero failures.

The r2 aggregate was deliberately not reused after the Brain correction: the award aggregator rejected it because current candidate `1678158f...` no longer matched captured candidate `55a7853a...`. This is the correct provenance behavior. The r2 scorecards remain evidence of the material ceilings and the pre-correction mobile hard-gate failure, not a verdict for the current source. A fresh release-wide panel is required after any authorised material response and must bind to that final exact candidate.

Release status remains blocked and literal. The canonical build gate still exits `1` at approved-r1 parity **10 of 14**: four approved Brain/GTM source or style hashes differ and the approved `signal-to-choice` instrument is absent. MMF-018 remains open. Current physical iPhone Safari with VoiceOver and Android Chrome with TalkBack remain not run. The fresh fully green continuity aggregate, exact final release-wide `world_class_winner` panel and new approved source manifest do not exist. Nothing has been committed, merged, previewed, deployed, published or made live.

### Scaled-Windows fit and mobile Proofglass input correction

The isolated Commercial-readiness R3 review surface now covers the wide Windows 125-percent display-scaling case that exposed an untested `1475 x 730` CSS viewport. The earlier compact-desktop rule ended at 720 pixels and allowed the bottom-left primary action and stage controls to escape beneath the usable screen. One additive R3 stylesheet extends the compact composition through 850 pixels without changing its hierarchy or material language. The exact failing `1475 x 730` case now retains `69.94` CSS pixels below the primary action and keeps the stage controls above `706` pixels; `1536 x 768`, `1600 x 768`, `1844 x 912`, `1920 x 850` and the earlier `1108 x 574` short desktop also fit. The strengthened isolated gate passes 17 Chromium viewports and seven representative viewports in each of WebKit and Firefox with no failures. MMF-022 and the permanent `1475 x 730` required viewport record this verified correction. R3 remains an isolated review artifact and is not production integration or promotion authority.

The fresh production audit then found an independent routine interaction defect in the owner-approved S3 Proofglass: on mobile, the selected stage's absolutely positioned full-width meaning text could cover neighbouring numbered stage controls. Under WebKit this intermittently routed a stage-05 tap back to the already selected stage-01 descendant. The text layer now has `pointer-events: none`, preserving its exact rendered appearance while returning each numbered control's hit area to the control itself. Focused WebKit verification at `320 x 568` and `390 x 844` passes the fourth client record, stage 05, decision framing and private-brief handoff. The complete isolated production gate then passed 11 Chromium, five WebKit and five Firefox viewports, all seven insertion routes and 39 retained observations with `failures: []`. Fresh full-route continuity rebound to exact candidate `370ba240a31109075d580bce220e1267a893c3c57aa26ecdf8c5b7d2aa38709d` and passed all 13 route patterns and 188 checks. MMF-023 records the failure and its cross-engine completion requirement. The corrected production Proofglass stylesheet SHA-256 is `ac8effb9fada8f1c55d6950261af31e7010b564efef3b3b8f45522238bc71656`.

The deterministic release-shaped build also passes after this correction: 30 test files and 496 tests, TypeScript, Vite client build, SSR build, sitemap, `llms.txt`, all 26 indexed prerenders and the no-JavaScript gate across five route families and 21 FAQ answers. Lint has zero errors and retains four pre-existing warnings. `qa:website-restart` passes 49 rulings, 23 findings, 13 routes, 14 viewports, five continuity guardians and ten rubric judges; both approved visual baselines remain retrievable from a script-owned ephemeral Vite origin. The canonical approved-route gate still stops at exact r1 parity **10 of 14** with the same four Brain/GTM source/style mismatches and absent `signal-to-choice` instrument. This remains a promotion truth label; it was not bypassed with a candidate manifest.

### COMMERCIAL-READINESS-S4-R3 material lock and production authority

Krish reviewed the exact scaled-Windows and exercised-state-corrected `COMMERCIAL-READINESS-S4-R3` surface at `prototypes/website-redesign-recovery/commercial-continuity/index-readiness-s4-r3.html` and said, `ok i like this, move forward with conviction towards production`. This is explicit material approval of the S4 Decision Balance and its R2/R3 routine fit and state-safety corrections. It supersedes S3 Proofglass as the commercial-readiness production direction without deleting, rewriting or reclassifying the preserved S1 through S3 history.

The lock covers the first-notice hierarchy, ordinary AI Brain and AI go-to-market links, complete private paid-proof boundary, single filled `Start here` action, five proof stages, warm physical Decision Balance, native range and stage controls, causal reversible desktop scroll, independently composed mobile sequence and deterministic decision-record recovery. The approved artifact includes the additive scaled-Windows correction that keeps the primary action and stage controls clear at an effective `1475 x 730` CSS viewport, plus the R3 state-safety module that preserves both document and sticky-shell scroll positions through open, complete, close, reopen, change and recovery.

The exact owner-reviewed source hashes are HTML `0bcaad80c828eea0033a4cdabbf0e9ad0973b674720ec85a5805f5f862800495`; additive CSS `22dd1c403e652306ae8717557a3ba96b6862650ce6e5988e685e33b57a50f2c5`; state-safety JavaScript `cf5ba4788afc7ad32da07c515cfedd479ca5c68d4d82fe32d5100ec5a09e5469`; and checker `541b872572d1f3f02bb510c6678032e9517c2fef05a44185f91f17e888d828ad`. The last complete isolated gate returned `failures: []` across 17 Chromium viewports and seven representative viewports in each of WebKit and Firefox. Exact post-recovery evidence at `1475 x 730` remains `C:/Users/krish/.scratch/mindmake-commercial-readiness-s4-r3/chromium-1475x730-after-recovery.png`, SHA-256 `a576b14164d703bc0906980e3b2c5fd96cd9eccd232b919ea88d6ff217c1743e`.

Authority effect: faithful local production integration may now replace the existing S3 commercial-readiness adapter through `krish-build`, while preserving the route shell, route semantics, existing private `LeadBrief`, all other locked material surfaces and every dirty-worktree change. Any reinterpretation of first notice, next understanding, interaction model or signature material language requires another rendered decision. Alignment, wrap, overflow, focus, target-size, semantic and deterministic-regression corrections inside this exact lock remain routine. This approval does not authorise commit, merge, preview deployment, production deployment, publication, source-manifest promotion or a claim that the site is live.

Pre-integration recovery readback on this exact dirty tree: `qa:website-restart` passed 49 rulings, 23 findings, 13 routes, 14 viewports, five continuity guardians and ten blind judges. `qa:website-approved-visuals` started and stopped its own Vite server at the exact ephemeral origin `http://127.0.0.1:65250`, passed that origin to both approved suites and returned `failures: []` for Brain r5 and GTM r6. The approved visual baselines remain retrievable. Exact approved r1 production-source parity remains **10 of 14**, so source restoration is still not established and no candidate manifest was substituted.

### COMMERCIAL-READINESS-S4-R3 faithful local production integration

The approved S4 Decision Balance is now faithfully integrated into the unreleased local production candidate as `src/components/mindmake/locked/CommercialDecisionBalance.tsx` with route-scoped styling in `src/styles/mindmake-commercial-decision-balance.css`. It replaces the S3 Proofglass adapter on AI Brain, AI go-to-market, New-age leadership, Blog, Blog post, Answers and Answer without changing those routes' locked hero surfaces, shared navigation, private `LeadBrief` or material route language. The preserved S3 component and stylesheet remain in the dirty recovery tree as history; they were not deleted or rewritten.

The production adapter preserves the approved five-stage Decision Balance, reversible desktop scroll, direct range and stage control, independently sequenced mobile controls, reduced-motion and Save Data policies, film pause offscreen and under the Brain record, no-JavaScript fallback, deterministic route-aware decision records, modal focus trap and recovery, and exact scroll/state restoration through open, complete, close, reopen and change. The filled action still hands into the existing private brief and does not claim that email has been sent. The shared content edge aligns the logo and first-notice hierarchy, while the short-desktop and browser-chrome reserves keep the primary action and stages above the available viewport and consent surface.

Exact production integration hashes are component `d609051efad3b0c369a7a8ecafbca64863a4a83dcb7dc6a3816a56edfbdc5b88` and stylesheet `28ee9e456159953099cfceabbd068d7d43cbf0bfdaa76c990fd76dd541b5cfac`. The dedicated production gate is `scripts/qa/commercial-decision-balance-production-check.mjs`, SHA-256 `3938e701faf4ecec8a3c3a8c8b4a0629b4d4bdeee4d8f77943d8896fbd915fee`; the updated route-continuity gate is `scripts/qa/full-route-continuity-check.mjs`, SHA-256 `f07315279984c92fe9d1c1734e0f73ae31e50e034d02029d91275b616310c37c`.

Verification on the exact dirty tree is green for the new surface and its unchanged neighbours. The Decision Balance production gate passed 45 observations with zero failures across 13 Chromium viewports, six WebKit viewports, six Firefox viewports, seven insertion routes at mobile and desktop sizes, reduced motion, Save Data, 200-percent text, unavailable media and first-visit states. `qa:locked-material-production`, `qa:start-here-s4-production` and `qa:case-proof-field-production` each pass Chromium, WebKit and Firefox with `failures: []`. Full-route continuity passes all 13 route patterns and 243 checks: all fourteen required Chromium viewports, representative WebKit and Firefox viewports, and the exact `1108 x 574` compact-desktop case in all three engines. The final single-worker test run passes 30 files and 496 tests; TypeScript, client build, SSR build, sitemap, `llms.txt`, all 26 prerenders and plain-language checks pass. Lint has zero errors and four pre-existing warnings.

The final recovery-baseline retrieval also passed from the command's own ephemeral server at `http://127.0.0.1:58215`: Brain r5 and GTM r6 each returned `failures: []`, and the script stopped that server after both suites. `qa:website-restart` passes 50 rulings, 25 verified findings, 13 routes, 14 viewports, five continuity guardians and ten blind-judge definitions. The definitions and contamination checks are green; a fresh completed blind-panel verdict is still required separately.

MMF-024 records the release-audit finding behind the strengthened route gate. At `1108 x 574`, the GTM heading began nine pixels under the fixed header and the centred menu's first focused route began six pixels under the same chrome. The shared menu now enters its compact, scroll-safe composition through `600px` landscape height, and the GTM production wrapper restores the masthead reserve already subtracted by the locked fit equations. These are routine header-clearance corrections: no first-notice content, sequence, interaction model or signature material language changed. `mindmake.css` is `d3f2fbc48529aee74b49e0dbc7fe3428e628dde125ac9aef6058ccd921d694e0`; `mindmake-locked-gtm.css` is `8c4ee91ad1a96f97efd397668f0742b148fbc4ec820e73daf2ddb4047be58579`; the exact-hash locked-material gate is `b021940985b52171064d8cfdb9f439c58b440f433de79f3882329559daeeb61d`. Full-route continuity and the locked Brain/GTM production gate both pass with zero failures after the correction.

MMF-025 records a production-only recovery case exposed by the final dedicated interaction rerun. While the decision record was open at `390 x 844`, the New-age leadership organisation chart could complete its timed switch to People + AI and add 108 CSS pixels above the commercial surface. Restoring the old numeric scroll value therefore changed what the visitor saw even though the dialog closed normally. The production adapter now locks background scrolling during the modal and restores the commercial surface's visible viewport anchor, so asynchronous height changes above it cannot move the reader. The Decision Balance yields its lock and focus directly to the private brief during handoff rather than restoring focus behind it. The gate measures the semantic anchor through close, Change decision and close, and verifies that handoff focus lands inside the private brief. The exact WebKit case and the complete 45-observation Chromium, WebKit and Firefox matrix pass with zero failures.

MMF-026 records the independent blind desktop release review's verified 200-percent text-reflow failure. At `1440 x 900`, scaling the document root text to 200 percent also doubled rem-based Home and AI Brain structural minima. The Home proof instrument escaped the viewport; the fixed-height Brain opening clipped its explanation, actions and note; and the three roles inside the Brain decision plaque collided. The routine correction keeps structural chassis minima in CSS pixels while text still scales, lets the Brain opening grow into normal document flow, and gives the decision plaque a content-safe minimum height. The full-route continuity gate now exercises the exact Home and Brain state, checks horizontal bounds and real clipping, and requires the plaque roles to remain ordered and non-overlapping. No first-notice content, sequence, interaction model or signature material language changed.

The no-JavaScript gate no longer relies on an ambient fixed-port server. `scripts/qa/no-js-check.mjs`, SHA-256 `e574a6efc2b07efe95cd51ceaaf95bda1982afdf949a3f4fca17530209ab70d4`, now starts and stops its own production preview at an ephemeral origin unless an explicit base is supplied. Its fresh run passes five route families, all 21 FAQ answers, complete-route structure and clipping checks.

The governed recovery truth is unchanged: the approved Brain r5 and GTM r6 visual prototypes are retrievable from the approved-visual command's own ephemeral server, while exact approved-r1 production-source parity remains **10 of 14**. The canonical gate still reports the four Brain/GTM source and style hash mismatches plus the absent `signal-to-choice` instrument. No candidate manifest was substituted, and failed parity is recorded as a promotion truth label rather than a circular blocker to the approved local integration.

Status is literal: the production candidate is **built locally and automation-verified**. It is **not committed, not merged, not preview-deployed, not deployed, not published and not live**. Current physical iPhone Safari with VoiceOver and Android Chrome with TalkBack remain **not run**. A fresh provenance-bound continuity aggregate, a history-blind desktop and mobile `world_class_winner` result, closure or owner exception of every remaining MMF item, physical-device evidence and a new approved final-source manifest remain release gates.

### New-age leadership material reset: HYBRID-ATLAS-S1

Owner ruling: after reviewing the locally integrated route, Krish ruled that New-age leadership had become substandard beside the upgraded system and required a materially new page that is dramatically more visionary, aspirational and big-picture, with the September 2026 machinery films carrying the experience. This reopens New-age leadership only. It does not reopen the locked GTM, Brain, Start here, case-study or commercial-readiness surfaces.

Fresh divergence was run without using the current page layout as a generator foundation. `The Hybrid Atlas` proposed a brass plotting instrument that charts the change from a human-only organisation to a hybrid species. `The Second Nervous System` proposed one living organisational spine through which sensing, evidence, preparation and decision travel. A full-history commercial judge rejected refinement of the stitched legacy component sequence and required one sovereign manifesto mechanism in which agents own repeatable work while people retain intent, standards, limits, exceptions, judgement, release and correction. Immediate rejection gates include replacement threat, robotic anthropomorphism, an org chart or card grid as the defining idea, timed or automatic controls, helper-copy dependence, desktop compression on mobile and any meaning that fails without motion.

Reset before synthesis: the selected direction combines the Atlas's explicit journey with the Nervous System's single unbroken authority line. The spine is `Sense → Connect → Attend → Prepare → Decide`; imagery and scroll carry the shift while the final lever remains untouched. History is compressed into a threshold rather than a separate attraction. The organisation diagram is subordinate supporting evidence and changes only through a user-operated, reversible control. The returned hour is framed as better leadership rather than efficiency. Mobile is separately authored as five natural full-height chapters rather than the desktop sticky sequence.

`HYBRID-ATLAS-S1` is rendered only inside `prototypes/website-redesign-recovery/new-age-leadership/`. It uses the sealed semantic films, visible illustrative labels, poster fallbacks, offscreen pause, a global motion control, reduced-motion and Save Data still states, keyboard-operable state controls and a no-JavaScript first-state fallback. It has been inspected at `1440 x 900`, `1538 x 636`, `1108 x 574`, `390 x 844`, `320 x 568` and `844 x 390` with no document-width overflow; live desktop Atlas stages, the organisation-state switch and motion control work. The public `/new-age-leadership` route and shared production files remain unchanged pending Krish's rendered material approval.

Exact candidate hashes: HTML `bde6274c490e234e043ff0e425a59ffaf6feb00f5b7d6ba18b8a2f221e2733e5`; CSS `b3fd714901aec5288996f444545e3235d98ca4062015e5d222c62d2c47c34710`; JavaScript `bfb12e2a5dae12d1e5c1198fab52790940d54d4ed7f77d53e64a998f1d01c03e`. Desktop full-page evidence at `C:/Users/krish/.scratch/mindmake-leadership-synthesis-desktop.png` is `51cfca71a50e537c9d03bc7274fc680078a748306c017e007086a2d69c3458b2`; mobile evidence at `C:/Users/krish/.scratch/mindmake-leadership-synthesis-mobile.png` is `af0cb758bf5ea72b00517376f0ff34067328dc42e600505556689740a7c3b80f`.

Approval and physical-device truth: `HYBRID-ATLAS-S1` is a rendered material candidate, not yet approved and not production-integrated. Current physical iPhone Safari with VoiceOver and Android Chrome with TalkBack are still not run. This Windows host currently exposes no connected iPhone, iPad, Android or ADB device, and `adb`, `idevice_id`, `idevicesyslog` and `ios_webkit_debug_proxy` are not installed or callable. No emulated result is represented as the physical pass. Nothing in this reset is committed, merged, preview-deployed, deployed, published or live.

Owner reaction to `HYBRID-ATLAS-S1`: Krish liked the direction but did not approve it. He ruled that the historical section must reveal themed imagery and briefly show what people feared and what actually happened; the narrative must address the reader directly in plain English and unfold as a story. Physical Android Chrome screenshots confirmed that the mobile experience was too long for the meaning delivered, the governing-choice composition wasted space and overlapped, and the organisation chart did not resolve as a mobile surface. This is a material narrative and device-composition revision inside the same Hybrid Atlas spine, revision count one. The exact phone evidence is `G:/My Drive/Debugging/Screenshot_20260921_224935_Chrome.jpg`, `Screenshot_20260921_224953_Chrome.jpg` and `Screenshot_20260921_225021_Chrome.jpg`. These screenshots establish physical Android Chrome visual behavior only; they do not establish a TalkBack pass.

### New-age leadership material candidate: HUMAN-STORY-S2

`HUMAN-STORY-S2` keeps the approved-to-revise hero, cinematic machinery language and human-authority thesis, then rebuilds the entire middle as a three-act reader story. Act one says directly that the reader is not the first person to wonder what a new tool may take from them, then reveals four generated historical scenes through scroll: writing, mechanised textile work, calculators and satnav. Each scene separates the fear from what changed, including the non-triumphal truths that textile workers' wage and status concerns were real and habitual GPS use can affect spatial memory. Act two makes one explicit boundary: `Give AI the repeatable work. Keep the decisions that shape the business.` Act three reduces the five-stage explanation to three meaningful states, then closes on one real early pattern and the leadership use of returned capacity.

The S1 timeline, mobile governing-choice poster, five repetitive mobile Atlas chapters and organisation chart are absent from S2. Mobile uses the same story in an independently composed natural sequence, not sticky desktop choreography. The verified `390 x 844` document is 8,333 CSS pixels high versus 10,991 for S1, approximately 24 percent shorter while adding the historical outcomes and clearer connective narrative. The choice fits as one bounded mobile section; the org-chart collision is structurally removed rather than patched.

Four generated historical assets are project-bound under `prototypes/website-redesign-recovery/new-age-leadership/media/` and visibly function as illustrative atmosphere, not product evidence. The writing wording is grounded in the warning retold in Plato's `Phaedrus`, not the false shorthand that Socrates personally opposed writing. The loom wording follows the UK National Archives evidence that machinery was used to replace skilled workers and drive down wages. The calculator result follows Hembree and Dessart's 1986 meta-analysis of 79 reports. The satnav wording reflects the observed association between habitual GPS use and spatial memory. A collapsed source control preserves provenance without placing explanatory backup copy through the visible story.

The exact candidate is `index-s2.html` `0b64fa594af03e2dae51b10dbfe6ab37b0c6efc7a255876f05ee7fb900910a9f`, `styles-s2.css` `ae9668a39456ed0b45a24823e21363661ff652314811c6919aae5e7366f41a84`, and `script-s2.js` `e08d9eaf4ea1b3a390a254b742f71c829e09576813b918118f324cb2f11b9df1`. Generated web assets are writing `6e0f5afcc6ee914dd4cc9549ddf0ec23a3a1592caf85e0c1704e247cd34af571`, loom `3f64e4b7c882d7749866592f70c51730e33cd5acb756b3dcad718e9d14da559b`, calculator `0bb83f540f8aaca7aff066a1aed0a59b743b22008505642e78e48fb7efbfe65d`, and satnav `39506a5f5a408f7eadb75d94455ac7d78afb177763e42452465e7156323443db`. Render evidence is desktop `C:/Users/krish/.scratch/mindmake-leadership-s2-desktop.png` `94ebe8e9870681a523b39c4d1b76bf6c667d31c84c2bd3dda6e07a26814b3cc2` and mobile `C:/Users/krish/.scratch/mindmake-leadership-s2-mobile.png` `c320355e73595b2c881c25bd7fa47c15e6f18e9b512c0be672de4f78b54e2f37`.

Verification status: Chromium, WebKit and Firefox pass `1538 x 636`, `1108 x 574`, `390 x 844`, `320 x 568` and `844 x 390` with zero document-width overflow, correct shared-edge header alignment, retrievable historical assets and no page errors. All three engines preserve still meaning under reduced motion and expose the full story with no JavaScript while hiding inoperative controls. Desktop historical and working-stage controls resolve to the selected stage; keyboard traversal reaches the primary action; the 200-percent-text opening remains within the viewport with zero horizontal overflow. The current public `/new-age-leadership` route and shared production source remain unchanged.

Approval state: `HUMAN-STORY-S2` is rendered and verified as a material candidate, not approved and not production-integrated. It is open at the local-network review URL for an unanchored owner reaction. Physical iPhone Safari with VoiceOver and Android Chrome with TalkBack remain not run as assistive-technology passes. Nothing in S2 is committed, merged, preview-deployed, deployed, published or live. Exactly one next action: Krish reviews the rendered S2 candidate cold.

Owner reaction to `HUMAN-STORY-S2`: Krish rejected the historical-story interaction, not its evidence or plain-English content. His physical Android Chrome screenshot `C:/Users/krish/OneDrive/Documents/ChatGPT/mindmaker/.codex-remote-attachments/01a0af1d-9963-7832-b092-2c726fdfd795/fcb6b01a-edb9-46c7-99ed-cb61d3866c87/1-Photo-1.jpg` showed that four full-height historical scenes still behaved as a long vertical stack and remained visually passive. The ruling is that these stories must become one immersive, beautiful and space-efficient interaction, especially on mobile. This is a material interaction reset of the historical module; it does not reopen the accepted content, generated imagery, wider page narrative or any production route.

### New-age leadership material candidate: TIME-LENS-S3

`TIME-LENS-S3` replaces the four stacked historical posters with one bounded cinematic time lens. One generated scene, one fear and one outcome occupy the stage at a time. On desktop, reversible page scroll advances the instrument through writing, the loom, the calculator and satnav. On mobile, the entire four-story module occupies one viewport and is controlled by a native range scrubber, four direct era targets, previous and next controls, horizontal swipe and keyboard arrows. Nothing advances on a timer. The reader can reverse any transition and the current count, era, image, question and outcome change as one state.

This reset removes approximately 1,065 CSS pixels from the `390 x 844` document: S3 is 7,268 pixels high versus S2's 8,333, while keeping all four historical outcomes. The `320 x 568` portrait is separately composed rather than inheriting the short-landscape split, and the `844 x 390` sequence uses a dedicated side-by-side arrangement. Inactive stories are hidden from assistive technology, the current era exposes `aria-current`, the state wrapper is keyboard-operable, every pointer target is at least 44 CSS pixels, reduced motion removes state transitions and pauses all films, and the no-JavaScript fallback removes dead controls while preserving the complete story.

Chromium, WebKit and Firefox passed `1440 x 900`, `1538 x 636`, `1108 x 574`, `390 x 844`, `320 x 568` and `844 x 390` with zero document-width overflow and no page errors. Direct tests in all three engines passed next, previous, native range, direct-era selection, keyboard progression and horizontal swipe. All historical images loaded, inactive copy remained `aria-hidden`, the selected era retained `aria-current`, reduced-motion started with motion paused and no playing films, and the no-JavaScript state exposed no inoperative lens controls. The public `/new-age-leadership` route and shared production source remain unchanged.

Exact candidate hashes are HTML `39600b7672ac4226df9b7efef68e4e01f9bd1aaf04fd8bef1899132fb0222706`, CSS `908647c2744b2d092e0275d6efbabff177818ed6ab2850c70d4278cdacf8c906` and JavaScript `afbcf4cc5de29e979ece59ed873660fab5f230f1b863b8fc6e560d0c85f3d75c`. Render evidence is short desktop `C:/Users/krish/.scratch/mindmake-new-age-s3/final-1538x636-s1.png` `3d53bb2fb6a668f67b706662ab4ac3e9be58493be5668429f2d2e661d5478fe5`; portrait mobile `final-390x844-s2.png` `796da8a5297bcd03d74d71b6b447555f1650f17b91b939f3e219c52843f6c8f4`; short phone `final-320x568-s0.png` `b9a090229a7acb599cd8f493f610e2c14ed9fb1228aa204c3fc5bfa262a4f916`; and mobile landscape `final-844x390-s3.png` `4781b2961de668a6aa6ab99c6921a0eccaeb7a47f9fd9803cb9c54b32a57b18c`.

Approval state: `TIME-LENS-S3` is an isolated rendered material candidate awaiting Krish's unanchored reaction. It is not production-integrated, source-approved, committed, merged, preview-deployed, deployed, published or live. The physical screenshot is design evidence only and does not establish an Android Chrome with TalkBack pass; current physical iPhone Safari with VoiceOver and Android Chrome with TalkBack remain not run. Exactly one next action: Krish reviews the rendered S3 time lens cold.

Owner reaction to `TIME-LENS-S3`: Krish liked the time lens and requested a bounded revision rather than a new concept. Four narrative lines must enter as the reader scrolls: the hero's `Part people. Part agent. Led by judgement.`, the historical bridge `We have been asking that question for centuries.`, the AI bridge `AI can carry work that used to look like thinking. So you need a boundary you can see.`, and the practice heading. The visible AI-carries/you-keep boundary instrument must enter with the section. `It brings more to it.` failed contrast on the paper band and must become legible. He also ruled that the single agent anecdote misstates the page's benefit: that panel must demonstrate several concrete benefits of building an AI Brain, including consistent leadership updates, unowned work, actionable market-pricing patterns, helping writing-averse CEOs, helping numbers-averse CROs and founder-led content. He explicitly requested a rotating train-ticker-like treatment in the existing visual language.

### New-age leadership material candidate: TIME-LENS-S3-R2

`TIME-LENS-S3-R2` preserves the complete S3 historical lens and wider narrative. It adds one-shot scroll entrances to the four specified narrative lines and the visible authority-boundary instrument. The reveal uses opacity, vertical movement and focus; an initial clip-path approach was rejected during runtime proof because the clip made the observer treat the target as non-visible. Reduced motion and Save Data expose the words immediately, the global motion control removes reveal transitions, and the no-JavaScript state keeps every line visible.

The former agent anecdote is replaced by a six-state AI Brain benefit ticker: consistent leadership updates; detecting work nobody owns; connecting market-pricing changes to commercial action; helping a CEO who dislikes writing publish useful thinking; helping a CRO who dislikes the numbers use them better; and turning real founder work into founder-led content. It advances only while visible and motion is permitted, pauses under the global motion control, reduced motion, Save Data, page hiding, hover and focus, and remains reversible through 44-pixel previous and next controls. Automatic changes do not announce themselves to assistive technology; manual choices update a polite status. The no-JavaScript fallback shows all benefits without dead controls. `It brings more to it.` now uses dark green `#146e52` on warm paper `#eadfc8`, measured at contrast ratio `4.70:1`.

Chromium, WebKit and Firefox passed `1538 x 636`, `1108 x 574`, `390 x 844`, `320 x 568` and `844 x 390` with zero document-width overflow, no page errors and every one of the six benefit states fully contained in its stage. The same matrix confirmed all five reveal targets reach full opacity. Direct runtime proof confirmed automatic rotation while visible, a stable state after global pause, manual progression while paused, and no automatic progression under reduced motion. The original S3 files remain byte-identical at their recorded hashes. The public `/new-age-leadership` route and shared production source remain unchanged.

Exact R2 hashes are HTML `47720dc07fe5aeb50528296de75e808d1118674c6876f6f283437b4d8d71c33c`, CSS `aa9a2e4143277272b29ac6278d4d23d978af09f809f281b6a815f43796146ca7` and JavaScript `8d68a21e78e63a36177cac01fc71e7d856233dbfb86dd8edaef1b8c2747d65e9`. Render evidence is short desktop benefit ticker `C:/Users/krish/.scratch/mindmake-new-age-s3/r2-review-benefit-1538x636.png` `d361b5c0f7edc5aa30adc16c071650a94ba4fd3c6a93884ac9411a64c3aab33d`; portrait mobile `r2-review-benefit-390x844.png` `2458722c0eb290b16ce1e710d131bc5e48cc13a2de56e542768cdfacdcc9adc9`; short phone `r2-review-benefit-320x568.png` `5a8d0c0007aeae04eea4919c6b4cfb5d61a20088b693effc2b68f5c886ae564a`; short desktop practice band `r2-review-work-1538x636.png` `2c475130c25020377758de16e1a7af1f8c2e652a57a7d4452e27fe9197654c9f`; and mobile practice band `r2-review-work-390x844.png` `6a2108f9b3841c3c249117d97cc8c32133100c015d5d50ead88b51539e087c46`.

Approval state: `TIME-LENS-S3-R2` is an isolated rendered material candidate awaiting Krish's review. It is not production-integrated, source-approved, committed, merged, preview-deployed, deployed, published or live. Current physical iPhone Safari with VoiceOver and Android Chrome with TalkBack remain not run. Exactly one next action: Krish reviews the rendered R2 candidate.

Owner reaction to `TIME-LENS-S3-R2`: Krish accepted the six-benefit AI Brain direction and requested a locked revision. The benefit sequence must demonstrate its rotation immediately when it first enters view, so the control model is evident without waiting. The existing AI-carries/you-keep boundary must retain its meaning but become a more considered visual instrument. This ruling does not reopen the time lens, wider narrative, benefit content or production routes.

### New-age leadership material candidate: TIME-LENS-S3-R3

`TIME-LENS-S3-R3` preserves the complete S3-R2 narrative and benefit set. On the first permitted intersection of the benefit section, it advances from state 01 to state 02 after 900 milliseconds, then settles into the existing 6.2-second rotation. The demonstration remains suppressed by global Pause motion, reduced motion, Save Data and page hiding. Manual previous and next controls remain available, automatic changes remain silent to assistive technology, and the no-JavaScript fallback exposes all six benefits without dead controls.

The boundary is now a physical authority-transfer instrument rather than two loose text columns. Two recessed plates separate repeatable work from retained judgement, numbered rails make the four responsibilities easy to scan, and a restrained brass-and-mint spindle makes the transfer visible without adding explanatory copy. The exact wording and semantic division remain unchanged. The spindle breathes only when motion is permitted and becomes still under both the page motion control and reduced motion.

Chromium, WebKit and Firefox passed `1538 x 636`, `1108 x 574`, `390 x 844`, `320 x 568` and `844 x 390`. In all 15 combinations the benefit count changed from `01` to `02` on first entry, the authority lists did not overlap the spindle, no list text clipped, document-width overflow remained false and no page errors were observed. Separate Chromium checks confirmed Pause motion and reduced motion both retain state `01`; the no-JavaScript state exposes all six benefits and has no horizontal overflow. The R2 files remain byte-identical at their recorded hashes.

Exact R3 hashes are HTML `a9a11c13d9ff6d37c863f3c3d9afb46debd38cc846b136713f96464c07ab98e3`, CSS `38c86232aba9e6f5a2b3bfd487f0c89c41b2fac25682526f859c6d60f69d93a0` and JavaScript `78733b4093dc98b425130be302e223be06675536a4fc65dc1cb8c61c3940afe5`. Render evidence is desktop boundary `C:/Users/krish/.scratch/mindmake-new-age-s3-r3/desktop-boundary.png` `c143d9a6a4b65b7b24700215eb83f709586e16a10f3dbc051a46196638d98108`; mobile boundary `mobile-boundary.png` `fa26bb042c66a28ac442d3bc73d3825bef014cb4c035d027e30e78c18d12a7a0`; desktop benefit state `desktop-benefits.png` `d361b5c0f7edc5aa30adc16c071650a94ba4fd3c6a93884ac9411a64c3aab33d`; and mobile benefit state `mobile-benefits.png` `1aae59d6dbbe7dae322a70812e954b3e00b03c70a7395c053af3bd0dfe69618d`.

Approval state: `TIME-LENS-S3-R3` is an isolated rendered material candidate awaiting Krish's review. It is not production-integrated, source-approved, committed, merged, preview-deployed, deployed, published or live. Current physical iPhone Safari with VoiceOver and Android Chrome with TalkBack remain not run as assistive-technology passes. Exactly one next action: Krish reviews the rendered R3 candidate.

Owner direction after `TIME-LENS-S3-R3`: Krish identified the weak narrative hinge at `The feeling is familiar. The reach is new.` and selected it as the location for a reinvented new-age-leadership organisation. He asked for the accepted AI-carries/you-keep instrument to expand into a continuously moving vertical carousel with many more examples, including creative flair, taste, judgement, method and relationships on the retained-human side. After reviewing the proposed reel-to-organisation transformation and its mobile compression, he replied `ok go`. This authorises one isolated material R4 synthesis; it does not approve production integration.

### New-age leadership material candidate: TIME-LENS-S3-R4

`TIME-LENS-S3-R4` replaces the separate weak bridge and static boundary with one reversible cinematic chapter. Its first state keeps ten AI-carried capabilities and ten human-retained responsibilities in continuously moving counter-directional reels around a stable brass-and-mint authority spindle. Its second state resolves those moving responsibilities into a compact hybrid organisation: leader, Chief of Staff, AI Brain, market signals, marketing, research, sales research and the new executive-brief role. The page-scroll transition is reversible and occupies one bounded sticky sequence rather than adding another stack of mobile boxes.

The mobile composition is independently compressed into a two-column five-row organisation rather than the old tall chart. At `320 x 568`, the chapter removes its secondary kicker and illustrative label, preserves the full title, fits both reel and organisation states above the viewport floor, and retains the same causal sequence. Global Pause motion stops the reels. Reduced motion leaves them still. The no-JavaScript fallback shows both the work boundary and organisation without inoperative progress chrome.

Chromium, WebKit and Firefox passed `1538 x 636`, `1108 x 574`, `390 x 844`, `320 x 568` and `844 x 390`. In all 15 combinations the reels moved while motion was permitted, the authority spindle remained within the reel viewport, forward scroll changed `boundary` to `organisation`, reverse scroll restored `boundary`, the organisation fit the viewport, cards neither overlapped nor clipped, document-width overflow remained false and no page errors occurred. Separate Chromium checks confirmed Pause motion and reduced motion keep the reels still; both no-JavaScript panels remain visible with no horizontal overflow. The R3 files remain byte-identical at their recorded hashes.

Exact R4 hashes are HTML `e4ec21670def75a21594a32ba0b956edc91f0314f53a6ad2c6e4d4fe3258e859`, CSS `1f370252fb14ff2fec5c7ff555129c9fc68973cbbc42381ed9c39a3354e62265` and JavaScript `a34c277d8d6f077fdde6e1e90a8b573b43dc0494bc39967606ebdfa363855745`. Render evidence is desktop reels `C:/Users/krish/.scratch/mindmake-new-age-s3-r4/desktop-reels-review.png` `b1c59e23f449afc7cf86761bff45245ccf4e96fd5813381847bb60204d28bdd9`; desktop organisation `desktop-organisation-review.png` `0e8d2b444cba073746c9f83bcd5115acf2b5d023614591a31176b6c3b1aeb95a`; mobile reels `mobile-reels-review.png` `a30e57bdfd8f6aba68f08c438b9ec127ebfaaccba3162472be54ae8292532bd2`; and mobile organisation `mobile-organisation-review.png` `c2f91a1e5878338fff9fc197411e9771cde656c55b2853e649a1022360261f00`.

Approval state: `TIME-LENS-S3-R4` is an isolated rendered material candidate awaiting Krish's unanchored review. It is not production-integrated, source-approved, committed, merged, preview-deployed, deployed, published or live. Current physical iPhone Safari with VoiceOver and Android Chrome with TalkBack remain not run as assistive-technology passes. Exactly one next action: Krish reviews the rendered R4 candidate.

### New-age leadership adjudicated correction: TIME-LENS-S3-R5

Owner review rejected the R4 section positioning and the metadata treatment of the primary `AI carries` and `You keep` labels, and required the judges to adjudicate rather than return avoidable responsive defects. Two independent cold judges rejected R4. Their measured findings were: 7-9px primary labels, a 79-184px portrait disconnect between the claim and instrument, hidden explanatory meaning on mobile, 6-7px organisation metadata, weak transition discoverability and an off-balance copy/instrument composition. These findings supersede R4 as the active review candidate; R4 remains preserved evidence and was not edited.

`TIME-LENS-S3-R5` corrects the composition structurally. The hidden copy state no longer occupies flex flow; the kicker, active claim and explanation form one governed stack; the instrument begins within 72px of the title in portrait; `AI carries` and `You keep` remain 12px at every required viewport; organisation metadata is 10px with compliant high contrast; constrained landscape retains a concise one-line descriptor for every node; and semantic 44px `Work` / `Organisation` controls provide a direct reversible alternative to scrolling. The 320 x 568 state preserves an 18px minimum control clearance and removes only the nonessential kicker and node descriptions. Reduced motion, no-JavaScript meaning and direct `#reach-title` entry remain intact.

The device judge passed `1538 x 636`, `1108 x 574`, `390 x 844`, `320 x 568` and `844 x 390`: no horizontal overflow, clipping or active-panel overlap; 12px comparison labels; 10px visible organisation metadata; 11px stage labels; 44px stage targets; correct forward/reverse threshold behaviour; and correct pointer and keyboard state changes with `aria-current`. The independent visual judge passed `1440 x 900`, `390 x 844`, `320 x 568` and `844 x 390` with no remaining hard visual failures. Chromium, Firefox and WebKit runtime checks passed the required layout matrix; reduced motion, no JavaScript and direct-hash recovery passed in Chromium. Physical iPhone Safari with VoiceOver and Android Chrome with TalkBack remain not run and cannot be claimed.

Exact R5 hashes are HTML `cdf7603e278730dfae162e82fc4433e4a7452d0d4b1e268b2580a079445ac7b1`, CSS `9164326484d62717ba781edbe7d3fc50dfac35f6739b5bb9aadbf833082bbe34` and JavaScript `68fa0f838808e6a2efb355e1c5aedc3d81ef726e4a59a41b033d91d7ee5e7e6f`. Render evidence is desktop Work `C:/Users/krish/.scratch/mindmake-new-age-s3-r5/final-1440x900-work.png` `3f8c647231ecb77608a8cc42e6577f199337b9c84cb2bda6b97f41aaedfa3409`; desktop Organisation `final-1440x900-organisation.png` `b308051fb1ce50a07c732ad6b1c92b61d15600d3d17ef9e29763e94848e137b5`; portrait Work `final-390x844-work.png` `5fdde530eb43ed6b82c4e6efbc7314867336c5fa1a211a2b502b19919ea82daf`; and portrait Organisation `final-390x844-organisation.png` `a1de33fd343b0873cee6c8821406e6003d4dc3ccbfd0b1f39f80e808b7c5c701`.

Owner ruling, 22 September 2026: after reviewing the adjudicated R5 render, Krish replied `ok, looks good, continue to next gate you need me for before you can autonomously drive to production`. This is explicit material approval of `TIME-LENS-S3-R5` and authorises faithful local production integration plus every reversible deterministic, UX, continuity and judging step needed to reach the next genuine human or external-action gate. It does not authorise commit, merge, preview deployment, production deployment or publication.

Approval state: `TIME-LENS-S3-R5` is materially locked and is now the approved New-age leadership implementation baseline. Exact approved source hashes remain HTML `cdf7603e278730dfae162e82fc4433e4a7452d0d4b1e268b2580a079445ac7b1`, CSS `9164326484d62717ba781edbe7d3fc50dfac35f6739b5bb9aadbf833082bbe34` and JavaScript `68fa0f838808e6a2efb355e1c5aedc3d81ef726e4a59a41b033d91d7ee5e7e6f`. The next action is faithful local production integration without reopening its material hierarchy, interaction model or visual language, followed by the complete release gate. It is not yet production-integrated, source-approved as a production manifest, committed, merged, preview-deployed, deployed, published or live.

### New-age leadership faithful production integration

The owner-approved `TIME-LENS-S3-R5` material surface is now faithfully integrated into the local `/new-age-leadership` production candidate. The locked prototype files remain byte-identical at their approved hashes. The production adapter preserves the approved story order, history lens, Work / Organisation sequence, rotating AI Brain benefits, machinery films, motion control, reduced-motion policy and final human-boundary close. It retains the already locked commercial Decision Balance and restores the shared footer routes for AI Brain, AI GTM, Results, Media, Ideas, Answers, Straight answers, Contact, Privacy and Terms.

The integration is isolated under `.nal-page`; the generated stylesheet is rebuilt from all seven prototype layers only after checking the exact approved R5 HTML, CSS and JavaScript hashes. Production-only corrections bind the existing local font families, neutralise the production heading reset, enforce 44px targets and express active-button state through an explicit branch without changing the approved material hierarchy or signature visual language. Current production-source hashes are page `9293d0262fb7431d1cc4ef5007b1f30f39110a0bc3553836a78cb6792304a1b7`, scoped CSS `970ffb4f1096abf0e1f3882ac5d04518df17fa96c26cb2dbc5c48efd321a010d`, style builder `ec0042aa0547723dbe15c805997f8fc81984a12b33803b2a1d1935d03821915a` and dedicated production gate `64c5d4f230957a1b8ecae19bb69a77b1231d55b474c3d605ab5bd0a033fe137b`.

`npm run qa:new-age-r5-production` passed Chromium at nine required viewports and WebKit and Firefox at desktop, portrait and landscape representatives. It verified opening-screen fit, heading contrast, zero horizontal overflow, 44px controls, history movement, benefit movement, reversible Work / Organisation state, reduced-motion pause, runtime cleanliness and route-scope cleanup. Desktop evidence is `C:/Users/krish/.scratch/mindmake-new-age-r5-production/chromium-1440x900.png` `ca8e4d4f591eafd31815b05ef8cbe6baff01240404adddd2e060e705a8510c98`; portrait evidence is `chromium-390x844.png` `807249704fcb2602018b690c37559c7a8f34dbf98cadcfa398e8a2d0b2f519b8`.

`npm run qa:full-route-continuity` passed 243 checks across 13 routes and the required Chromium, WebKit and Firefox matrix. Its provenance-bound report is `C:/Users/krish/.scratch/mindmake-full-route-continuity/report.json` `4c42803af8bf22f8d144cd8912c09bc7137ee540d10f240ed35c5e6571759e9d`. The complete Vitest suite passed 496 / 496 tests; TypeScript and the Vite production bundle passed. After generating the complete production sitemap, LLM index and 26-page prerender output, `npm run qa:nojs` passed on its own production-preview origin: all five governed pages and all 21 answer/article pages exposed their main heading and content with JavaScript disabled, with nothing clipped away. The earlier no-JavaScript failure against an incomplete Vite-only build was therefore a build-state finding rather than a page defect. The approved-r1 source gate still truthfully reports the pre-existing 10 / 14 parity state: Brain and GTM production source hashes differ from approved r1 and GTM lacks the approved `signal-to-choice` identifier. The New-age integration did not change or bypass that manifest.

Integration state: built locally as a candidate and verified by automated Chromium, WebKit and Firefox checks. It is not committed, merged, preview-deployed, deployed, published or live. Current physical iPhone Safari with VoiceOver and Android Chrome with TalkBack remain not run. A fresh history-blind award verdict and final approved source manifest also remain required. The next genuine owner/external gate is authority to promote the complete verified dirty-worktree candidate through commit and preview deployment, after which physical-device evidence and final blind judging must bind to that exact preview source before production publication.

### Final-source lock and preview authority

Krish answered `yes` to the exact request to create a scoped commit of the verified website candidate and an immutable preview deployment from that commit. This grants commit and preview authority only. Merge, production deployment, publication and go-live remain separate action-time gates.

`quality/route-lock/approved-production-r2.json` is the new immutable approved-source record. It does not edit r1 or promote any rejected candidate manifest. It binds the current production adapters, locked Brain and GTM surfaces, approved New-age R5 integration, homepage, case-study field, Decision Balance, editorial routes, shared shell and brief, route data, deployment exclusion, and current deterministic guardians across 38 exact source hashes. The default lock now reads r2 directly; `qa:approved-routes` passes all 38 hashes and the Brain/GTM semantic contracts, while the adversarial self-test proves that drift in the first locked source fails closed. The older 10 / 14 r1 result remains historical truth about source restoration at that earlier point, not the current final-source verdict.

Exactly one next action: create the scoped atomic commit from this approved source set and its required build/runtime dependencies, deploy that exact commit to the confirmed Vercel `mindmake` preview target without moving the production alias, then bind final continuity and blind judging to the returned immutable preview revision.

### Quality-system v3 ruling and homepage narrative direction

On 23 September 2026, Krish supplied a 12-minute physical Android Chrome walkthrough of the assembled candidate. The walkthrough exposed a system-level integration failure rather than a collection of isolated frame defects: the current homepage is functional but less compelling than New-age leadership; New-age leadership contains late transitions, dead vertical space, repeated ideas and a duplicated commercial instrument; Results repeats two proof systems before testimonials; GTM imposes excessive copy, inconsistent typography and repeated commercial content; Brain contains weak affordances, unstable geometry, low contrast, poor wrapping, backup-singer copy and another repeated commercial ending. Valuable Results, Media, Ideas, Answers and FAQ destinations are too often stacked in the footer instead of appearing where visitor intent is created.

Krish explicitly agreed that the New-age leadership narrative should become the governing homepage spine as a shortened synthesis rather than a wholesale transplant. That homepage change remains material and still requires one cold rendered desktop/mobile approval before implementation.

The walkthrough also proved MMF-027: the recovery command's prior `blindJudges` and `continuityGuardians` counts described definitions, not completed adjudication. The exact `preview-fd85315-20260922` evidence folder contains zero scorecard submissions and no aggregate result. The prior capture model flattened time into screenshots of one target URL and allowed broad positive scoring to outrun route-level story, conversion, repetition and system-coherence defects.

`rubric.v3.json` is therefore the active forward standard. It creates six independent jurors and twelve scorecards: art and design-system direction, narrative and journey direction, device-native interaction, conversion and trust, UX/accessibility/technical reliability, and inspiration/originality. It adds hard gates for narrative progression, experiential redundancy, contextual journey guidance and design-system coherence. V3 submissions require distinct executor provenance, complete assigned-route traces, adversarial scrutiny, action/expectation/observation evidence and matching route-and-viewport bindings. Missing submissions, mismatched evidence, unresolved scrutiny, zero dimensions, low confidence, failed/inconclusive observations or absent physical-device results fail closed. Recovery output now labels definitions literally and cannot imply that judges executed.

Current status: quality-system v3 implementation is local and uncommitted. The rubric validator and adversarial aggregate self-test pass; the self-test rejects contamination, incomplete route groups, stale or duplicate contexts, unbound or route-mismatched claims, altered evidence files, hard-gate passes backed by inconclusive evidence, unresolved scrutiny, zero dimensions and low confidence. Fresh full-route continuity for exact candidate `b268bd067dc8c46a09ad93cb1140ccc5d81d2a2234ff98ab5250cdc70aafc24b` produced 243 passing observations across 13 route patterns in Chromium, WebKit and Firefox with zero failures; report SHA-256 is `c8b2eb2d7c7cc15bb2c25b6ec0a9684be28535c44316a02808262a2945039043`. The self-contained final capture is `artifacts/award-panel/quality-v3-final2-20260923/run.json`, SHA-256 `467b202b550a568318b1c401cd2b0ba98256d782f545ae437095a896e579905e`: all 13 route patterns, including representative Blog and Answers detail routes, produced 112 required observations and 110 automated passes. Its only unresolved observations are the explicitly required physical iPhone Safari with VoiceOver and physical Android Chrome with TalkBack checks. Capture validation reports `failures: []`.

This verifies the quality system and its evidence plumbing; it does not certify the website or close MMF-027. The panel status command correctly fails because the exact run contains zero of twelve required independent submissions and no aggregate verdict. The physical-device release evidence also remains absent. Exactly one next action is to use this stronger system to direct the isolated New-age-led homepage synthesis and the subsequent full-site coherence reset. No homepage source, production deployment or publication is authorised by this quality-system work.

### Durable cross-project quality-system promotion

Krish explicitly instructed that the strengthened quality system must survive this session inside both the canonical `ai-harness` repository and this project before the site rebuild resumes. The correct owning layer is the existing `build-apps-with-krish` orchestration route rather than a competing judge skill: `krish-design`, `krish-build`, `ux-testing-agent`, `verification-loop` and Krish retain their existing authorities.

The canonical harness working tree now contains an unreleased `experience-quality-v1` candidate: `contract/experience-quality-contract.md`, its machine-readable profile schema and validator, a portable `build-apps-with-krish` protocol, UX-selection additions, deterministic adversarial profile tests and held-out behavior/routing regressions. The harness registry records it honestly as `candidate-local-unreleased`; it has not been packaged, installed, activated or published.

This repository is the first project adapter at `quality/website-redesign/experience-quality.profile.json`. `npm run qa:experience-quality` validates the owner boundaries, two device surfaces, fifteen required disciplines, sixteen presentation-readiness checks, six continuity evidence fields, twelve rubric-v3 specialist roles, six independent juror minimum, hard-gate precedence, Chromium/WebKit/Firefox automation and the two required physical assistive-device combinations. The adversarial self-test removes or weakens those protections and proves the adapter fails closed. `qa:website-restart` now invokes this adapter before the award-panel definition and adversarial checks.

The durable presentation firewall is now explicit: the exact rendered candidate must pass identity, fresh self-owned runtime, link/control/asset, overlap/clipping, alignment, wrapping/content-range, contrast, keyboard/focus/semantics, touch-target, safe-area/fixed-chrome, reduced-motion, section-fit, duplication/backup-singer-copy and user-impacting console/network checks before it reaches Krish. Readiness is not material approval; score consensus cannot replace material approval; emulation cannot replace the required physical-device pass.

This promotion does not change the next material action or authorize a public-route edit. The next action remains one isolated New-age-led homepage synthesis, governed by the new presentation firewall and shown cold for explicit approval before homepage implementation.

### Homepage New-age spine divergence: HOME-DECISION-INSTRUMENT-S1

Fresh divergence used a sanitized commercial-and-experience brief and preserved the public invariants without exposing any generator to the current homepage or rejected page layout. Three genuinely different spines were produced: **The Causal Clock**, a single mechanism making `context retained → judgement applied → work changed → human capacity reinvested` visible; **The Judgement Console**, one illustrative exception decision shaped by five retained-context channels and a separate human control; and **The Decision Observatory**, a persistent map from leader through AI Brain to product, price, positioning and people. Their sequencing, agency, information structures, interaction models and state models were materially different, so the divergence gate passed.

Two independent historically informed judges disagreed materially. The commercial and task-first judge selected the Judgement Console because it made the differentiator immediately tangible; the narrative and award-experience judge rejected that simulator as proof-sensitive and selected the Causal Clock, simplified into a non-temporal decision instrument with the Observatory's structural discipline. A fresh tiebreaker prohibited the Console's scenario controls and handwheel because they could imply a policy engine, live recommendation proof or configurability that the homepage cannot substantiate. The tiebreak selected one governing interaction: an authored, visibly illustrative decision trace from retained context through judgement and changed work to the human dividend. The Observatory survives only as the spatial grammar `Leader → AI Brain → Work → Leader`; it is not a passive dashboard.

Reset before synthesis removed the Clock name, time language, simulator controls, sticky map, fake telemetry, confidence measures, policy language, multiple proof paths and four GTM cards as separate offers. Preserved strengths are the full causal line, the explicit `AI carries / You keep` boundary, an adjacent paid-proof plate, product/price/positioning/people nested inside AI GTM, two public doors and one primary `Start here` action. Mobile is independently authored as four beats: promise, Brain, change and entry. Motion clarifies the already-legible relationships and is never required for meaning.

`HOME-DECISION-INSTRUMENT-S1` is rendered only inside `prototypes/website-redesign-recovery/homepage-new-age-spine/`. The public homepage, shared production components and shared production styles remain unchanged pending Krish's cold rendered material approval. Exact candidate hashes are HTML `aa087f3cfc26018552a50665318690e1e83c3827d6aeeaa4612ba2cb43406dca`, CSS `11c2c8a1d5f2e12912e46f4b3bb763c890dcfae618db1f55744446a0b1ea4db3`, JavaScript `2ad3ff3cb88b64a88fc8c0fea1b7958fa1eaf1c0de42a0341671bf8351334629`, and presentation firewall `b395ab2d837264ea29a5f80a4a560773c09c78b94ade31cba0e84ef9b50bd907`.

The prototype's self-owned ephemeral Vite run passed with `failures: []` in Chromium at `1280 x 720`, `1366 x 768`, `1538 x 636`, `390 x 844`, `320 x 568` and `844 x 390`; WebKit at laptop and mobile portrait; and Firefox at laptop and mobile portrait. It verified runtime cleanliness, horizontal bounds, first-frame laptop fit below the masthead, 44px controls, important-label size, deterministic route state, functional route selection, functional motion state, reduced-motion behavior and the absence of hero copy/instrument overlap. QA evidence is `C:/Users/krish/.scratch/mindmake-homepage-new-age-spine/laptop-1280.png` (`95e924af84385c397aeb71f13105f018764a4d173dd8c72502ba3e3a31d61d94`), `mobile-390.png` (`f3d4321c9b69a59d3472c7074c77b9c3facb62704ee86d105968ac36cd3b11fc`) and `mobile-320.png` (`201e951b1052af2234e9b920fd0ee9cb8a30561922bc862eaf5cd86092e3037b`). This is automated and emulated evidence, not the required physical-device release pass.

Material status is literal: this is one isolated rendered candidate, not approved, not production-integrated, not committed, not merged, not preview-deployed, not deployed, not published and not live. The next gate is Krish's unanchored reaction to this single cold render. No public homepage implementation is authorised until that ruling.

### Homepage brief-fidelity reset: HOME-NEW-AGE-STORY-S2

Krish rejected `HOME-DECISION-INSTRUMENT-S1` on first view as unrelated and random. The candidate was polished and mechanically verified, but it failed the accepted material brief: it replaced the owner-approved New-age leadership story with a dry commercial instrument, invented an exception scenario and box-led interaction, and omitted the historical continuity, hybrid-business aspiration, AI Brain benefits and human capacity that were supposed to govern the homepage. Its automated pass is retained as evidence that presentation correctness cannot compensate for brief failure. It is frozen as rejected evidence and must not be patched, promoted or used as a design foundation.

The lowest owning failure was the reusable quality contract. The canonical harness and this project's adapter now use experience-quality contract `1.1.0`, whose brief-fidelity hard gate requires an accepted-direction trace, candidate-to-requirement mapping, explicit omissions and contradictions, rejected-pattern exclusion, and a literal answer to whether a candidate is recognisably the approved direction or merely a new idea wearing its words. Scores, feasibility and judge consensus cannot override this gate. The harness validation, 18-case contract self-test and this repository's 11-case adapter self-test pass.

Fresh reset divergence stayed inside the approved New-age direction. **You have seen this change before** made the four historical stories the causal proof; **Meet the business you are becoming** opened future-first on the hybrid organisation; **The Room to Lead** made returned human attention the governing dividend. Two historically informed judges independently rejected the future-first spine for underweighting history. Both selected a synthesis of the historical clarity of the first direction and the human dividend of the third. Their preference against automatic benefit rotation was not adopted because Krish's recorded ruling explicitly requires `What your AI Brain makes possible` to rotate on entry and visibly demonstrate its toggle.

`HOME-NEW-AGE-STORY-S2` is rendered only inside `prototypes/website-redesign-recovery/homepage-new-age-story/`. It opens with `Build a business that gets smarter without becoming less human`, establishes `Part people. Part agent. Led by judgement.`, compresses Writing, the loom, the calculator and satnav into one desktop scroll stage and one mobile story stage, makes the `AI carries / You keep` boundary continuously visible, rotates six concrete AI Brain outcomes, shows the hybrid-business consequence, returns the dividend as room to lead, and ends with the two governed AI Brain / AI GTM doors and one `Start here` action. MythOS was assessed after synthesis; only its abstract value of connected context and visible provenance is relevant to the later AI Brain route. Its interface, dense memo structure, naming, knowledge-graph convention and `upload your brain` framing are explicitly not homepage foundations.

The self-owned presentation firewall passes with `failures: []` in Chromium at `1280 x 720`, `1366 x 768`, `1538 x 636`, `390 x 844`, `320 x 568` and `844 x 390`; WebKit at `1280 x 720` and `390 x 844`; and Firefox at the same desktop/mobile pair. It verifies brief-fidelity copy and rejected-concept exclusion, complete first-frame fit below the masthead, zero horizontal overflow, loaded images, 44px targets, label size, route-state consequence, motion pause, historical progression, benefit progression and runtime cleanliness. The mobile history-stage zero-width defect, overlapping benefit crossfade and short-landscape opening overflow were found before presentation and corrected. This remains automated/emulated evidence, not the required physical-device release pass.

Exact candidate hashes are HTML `62770d82305049cc8dbec3e59bd1fc354930c709e0475958e9c1e7f6f7e8b269`, CSS `a573e6475f91a726b8908dece1640d9a460436d1507fe6962f7cad7dffd7d3e5`, JavaScript `7fb0c4baf8e3327c814c38b93cf9da7dcc5d92bb012034f4da57d5f821935a60`, and presentation firewall `61c79da9c3770f41489c5c31d5002cc06e17abc2eb7f6f156ddfe87b209380fd`. Evidence hashes are desktop `1ba2dcfc18483d8b3e635aab14c3c793cc1cd46d824f6e0030c5ccd04fc43e4d`, mobile portrait `4e24c5b498195818ee659d53c246c5fd9322f9ce9954ed43fe4b4375b5831041`, short mobile `5f68eda34d2a9c8d4e91945731c0655f3a34927d4f1f9b7b0a545430b1aff3e3` and short desktop `61948afea25b44c95393801af33f0fb55046029df4667596569ea99a36ec51a6` under `C:/Users/krish/.scratch/mindmake-homepage-new-age-story/`.

Material status is literal: `HOME-NEW-AGE-STORY-S2` is one isolated rendered candidate awaiting Krish's first reaction. It is not approved, not production-integrated, not committed, not merged, not preview-deployed, not deployed, not published and not live. The public homepage and shared production source remain unchanged.

Owner ruling after first review: Krish prefers the copy, positioning, design aesthetic and polish of the already approved immutable preview at commit `fd85315473132a08320f76ed0f22c92b7601549b`. `HOME-NEW-AGE-STORY-S2` is therefore rejected as a publication direction and must not be patched, promoted or used as a visual or copy foundation. The governing recovery baseline is `quality/route-lock/approved-production-r2.json`, whose 38 production-source hashes still pass exactly in the current worktree. Any later homepage work is an allowed-diff revision against that baseline: preserve its approved copy, positioning, visual system and route continuity, and change only an explicitly recorded delta. Do not reopen concept divergence or ask Krish to reapprove unchanged locked surfaces. The next action is release recovery from the approved baseline, not another redesign.

Atomic selection protocol: the ten recovery surfaces are indexes, not approval units. Every visible surgical decision inside them is a separate founder choice. Never bundle logo alignment with masthead height, title position with line breaks, section order with section spacing, film choice with crop, copy with typography, desktop with mobile, or any other independently variable property. For each atomic choice, present three or four already-built options in the same content, state, viewport and crop, plus `remove it entirely` when removal is valid. Record the selected source revision, exact visible rule, desktop/mobile scope, rejected options and immutable check before advancing. Do not infer an unselected alignment, spacing, label, eyebrow, motion, wrap, crop, control or action from a broader component approval. Eyebrows and supporting labels default to absent unless Krish explicitly selects one because it adds necessary navigation, state, provenance or meaning. Implementation-only details with no visible or behavioural consequence remain routine engineering choices.

Atomic ruling `SHELL-LOGO-ALIGNMENT-DESKTOP-01`, 23 September 2026: Krish selected option **C** from the isolated same-content desktop comparison at source revision `fd85315473132a08320f76ed0f22c92b7601549b`. The exact visible rule is a desktop logo origin at `4.4vw`, matching the approved New-age leadership edge geometry; logo artwork, logo size, masthead height, navigation, title, hero content and crop were frozen in the comparison. Options A (`max(28px, (100vw - 1440px) / 2)`), B (the centred 1360px GTM frame rail) and D (the centred 1240px shared production shell) are rejected for this decision. Scope is desktop only; mobile logo alignment remains deliberately unselected. The immutable comparison sources are `prototypes/website-redesign-recovery/component-selection/logo-alignment/index.html` SHA-256 `4a75ebbaabc77c6fd5525c66cb84fe27458539e5053eb9d5ad4b023f2e49470d` and `styles.css` SHA-256 `ddaeFB6C4F31A2D0BFA3BF68BB4A00E6A4934693E7B8187F5F2E7256962A0650`.

Correction and durable shell invariant `SHELL-CONTENT-EDGE-01`, 23 September 2026: Krish rejected every option in the mobile logo comparison because a logo misaligned from the primary section content edge is not a valid taste alternative. This supersedes any reading of the preceding desktop ruling as an independent logo offset: the selected desktop C geometry is valid only because both the logo and hero content share the same `4.4%` edge. On portrait mobile both share the same `20px` edge. Future comparisons must not offer deliberately misaligned logo rails as founder choices. The duplicate `Mindmake` hero eyebrow is removed and remains absent unless it later earns a necessary navigation, state, provenance or meaning role. Root-relative prototype logo paths are also prohibited because they break when a review file is opened directly; review artifacts use repository-relative source assets.

The corrected paired proof is a new locked revision at `prototypes/website-redesign-recovery/component-selection/logo-alignment/alignment-lock.html` SHA-256 `478bf1feb9f216b1c9633f4ff0f7ea6f2b3af312743d7c014f0ef17fcb4246a7` with `alignment-lock.css` SHA-256 `d392bb1785b8cbd12853d1d908c7216299e4234c9ca7afa7e862f0f34f121b89`. Its checker SHA-256 is `bbef5f883cc6a0af9f1c3cab8b534b2ca05f25d7bff5f190af95879657abda59`. Chromium, Firefox and WebKit pass exact logo-to-hero edge equality, 44px logo target, complete assets, zero duplicate hero eyebrow, zero horizontal overflow and zero console errors. Direct `file://` Chromium readback also passes with both logo assets complete and desktop/mobile edge pairs exactly equal. The rejected mobile comparison is retained only as failure evidence and is not a design or implementation source. Public routes and production styles remain unchanged.

Atomic review workflow amendment, 23 September 2026: Krish directed that all surgical decisions within one coherent section be reviewed together in one interactive artifact so he can select the working combination and add optional commentary, rather than enduring a separate review round for every variable. This changes presentation efficiency, not decision granularity: every control remains independently named and recorded, desktop/mobile values remain separate where composition differs, and locking the combination records the complete value set plus commentary. Objective invariants are not offered as options. The first implementation is the isolated Masthead combination configurator at `prototypes/website-redesign-recovery/component-selection/masthead-configurator/`: HTML SHA-256 `d70a1eba8428e3e98fe52d915c7732b053279c9a026a081e786ab61394f817f7`, CSS `f561c5049ae461444abb0fa5443ee9791220cea24bc1d5039e20d84f1fa51192`, JavaScript `7799b274868c27ad294fef9d55844bad665832f6c793dd4c708077a2d6464f22`. It auto-saves local review state, preserves optional commentary, produces a visible locked readback and encodes the non-comment configuration in the URL fragment. Chromium, Firefox and WebKit pass desktop and mobile interaction, persistence, 25 controls, 44px targets, exact locked logo-to-content alignment, intact assets, zero overflow and zero console errors; direct-file Chromium also passes. This artifact does not itself approve a combination or change production.

Atomic ruling `SHELL-MASTHEAD-COMBINATION-01`, 23 September 2026: Krish completed the combined masthead review and the resulting selection was persisted from the exact interactive artifact above. Desktop logo width is `146px`; mobile logo width is `128px`; desktop masthead height is `66px`; mobile masthead height is `64px`; centre context is absent; the menu treatment is `word + lines`; the header ground is `glass`; the bottom rule is a `hairline`; scroll behaviour is `fixed`; optional commentary is empty. The pre-existing objective edge invariant remains mandatory and outside the option set: the logo's left edge equals the hero content's left edge at `4.4%` desktop and `20px` mobile, with no duplicate hero eyebrow. The selection survived a fresh browser reload with the same nine values and visible `Combination locked` readback. This ruling locks only the masthead system; it does not approve a homepage hero, section content, route implementation or production promotion.

The next section-level review is the isolated Homepage opening configurator at `prototypes/website-redesign-recovery/component-selection/homepage-opening-configurator/`. It preserves the approved production title, supporting sentence, route-door copy, proof sentence, machinery film and locked masthead rather than inventing a new homepage concept. It exposes fifteen independently named choices in one live desktop/mobile surface: composition, title scale, title measure, vertical position and film crop are separate by device; film contrast, supporting-sentence presence, route-door layout, proof-sentence presence and reveal behaviour are shared. The duplicate eyebrow remains absent as an invariant rather than an offered option. HTML SHA-256 is `f9b308043c07c3176eb56a607ea7adeb09984d999ecb57bdce85238303c67aa1`; CSS `04b2e9b3a4c6b2e6ec28dc0bf4c51c0e062c604250302c2df0ef9be5f9b268c0`; JavaScript `c9b9fefc5a43f17b24087879ab8a28749ec311109d6de995ddd96e1561672bee`; checker `ea91e85ec8b6f507727ec65b6ce569e1515145457301fa485720d3caf899d1c7`. Chromium, Firefox and WebKit pass at `1280 x 900` and `390 x 844` with `failures: []`, including 43 radio controls, 44px targets, paired-preview presence, default and changed-state first-section containment below the masthead, complete logo assets, zero horizontal overflow, interaction, visible locked readback and persistence after reload. This is an unselected review artifact only; it does not change production or approve a homepage opening.

Atomic ruling `HOME-OPENING-COMBINATION-01`, 23 September 2026: Krish completed the combined homepage-opening review and the selected state was persisted and reload-verified. Desktop composition is `editorial split`; mobile composition is `copy over film`; desktop and mobile title scale are both `balanced`; desktop and mobile title measures are both `balanced`; desktop vertical position is `middle`; mobile vertical position is `high`; desktop film crop is `centre`; mobile film crop is `right detail`; film contrast is `cinema`; the supporting sentence remains visible; route doors are paired; the proof sentence remains visible; reveal behaviour is `staged entry`; optional commentary is empty. The ruling keeps the approved production words, machinery film and no-eyebrow invariant unchanged. It locks the homepage opening only and does not authorise production implementation or promotion.

The next shared-shell review is the isolated Open navigation configurator at `prototypes/website-redesign-recovery/component-selection/navigation-overlay-configurator/`. It carries every required route into the same desktop/mobile review: AI Brain, AI GTM, Results, Ideas, New-age leadership and Media remain primary; Answers, Straight answers, Contact, Privacy and Terms remain reachable as secondary routes; Start here remains the only primary action. Twelve independently named controls cover desktop/mobile structure, link scale and density, plus route order, secondary-route treatment, active-route cue, Start-here treatment, overlay ground and entrance behaviour. The locked masthead geometry is fixed. HTML SHA-256 is `79fadc3e7af7cc2959be8e98a3ea452e4ed26a359bec87272fe0867c32457426`; base CSS `15dd76a26995cc95b71cf4718c366d602a9aff1a823a310b473b29b6343d6610`; legibility override CSS `5fe7c5601aae49c07a7d1f9c87f8f7ceed1515adc21d976ee4945b1a6755eb60`; JavaScript `f4dc7616b40ca61ff29a5c219768bfb863c15cbaf1a597081a4eb2bccf6eed65`; checker `b7fe864ed48106e61a123b4d82a405bd03069461df4b5ad340fc20d221cffb01`. Chromium, Firefox and WebKit pass at `1280 x 900` and `390 x 844` with `failures: []`, including 36 controls, 44px targets, complete logo assets, menu containment, changed-state interaction, locked readback, reload persistence and zero horizontal overflow. It is awaiting founder selection and does not alter production.

Atomic ruling `SHELL-OPEN-NAV-COMBINATION-01`, 23 September 2026: Krish completed the combined open-navigation review and the selected state was persisted and reload-verified. Desktop structure is `editorial index`; mobile structure is `single list`; desktop and mobile link scales are `balanced`; desktop and mobile densities are `balanced`; route order is `build first`; secondary routes occupy the `footer row`; the active-route cue is a `rule`; Start here is a `filled bar`; the overlay ground is `solid`; entrance behaviour is `stepped`; optional commentary is empty. All primary and secondary destinations remain in the locked information architecture. This ruling locks the open navigation state only and does not authorise production implementation or promotion.

The next homepage review is the isolated Route outcome configurator at `prototypes/website-redesign-recovery/component-selection/homepage-route-configurator/`. A Brain/GTM preview switch applies the approved route-specific title, lede, machinery film, caption, causal proof and outcome to the same paired desktop/mobile system. Twelve independently named choices cover desktop composition, mobile sequence, title scale and measure by device, Start-here position, back-control treatment, film-caption treatment, proof-receipt treatment, proof-step treatment and reveal behaviour. HTML SHA-256 is `528d0564893cd4c286a6f91317dbc3847b326ef4fb0ec7ef5e340ed57c1d0ad3`; CSS `1d2d616546e9953cbeab9854a578daa83ef16182f20515100053496fc983898f`; JavaScript `55fb7d01b08406cdb947ee7f327f796945124f79393d8cdb714ff5225f9fd28a`; checker `f65ca6b74ad6d7048bc4ae0fbca5294517b3edf7659df62430157ce51cc79305`. Chromium, Firefox and WebKit pass at `1280 x 900` and `390 x 844` with `failures: []`, including 36 controls, 44px targets, complete assets, live route switching, changed-state interaction, locked readback, reload persistence and zero horizontal overflow. It is awaiting founder selection and does not alter production.

Atomic ruling `HOME-ROUTE-OUTCOME-COMBINATION-01`, 23 September 2026: Krish completed the shared Brain/GTM route-outcome review and the selected state was persisted and reload-verified. Desktop composition is `balanced chamber`; mobile sequence is `copy first`; desktop and mobile title scales are `balanced`; desktop and mobile title measures are `balanced`; Start here sits `under copy`; the back control is `arrow + text`; the film caption remains visible; the proof receipt is `full`; proof steps are `numbered`; reveal behaviour is `staged`; optional commentary is empty. Both route-specific content sets remain governed by the same selected system. This ruling locks the homepage route outcome only and does not authorise production implementation or promotion.

The final shared-shell section review is the isolated Footer configurator at `prototypes/website-redesign-recovery/component-selection/footer-configurator/`. It keeps every governed destination reachable while exposing twelve independently named choices: desktop/mobile structure and density, brand treatment, supporting-sentence treatment, route grouping, legal placement, copyright treatment, footer ground, top boundary and entrance behaviour. HTML SHA-256 is `6abde12d692ffe589ec01c391c628f87412934c794467def5191106e5f819e27`; CSS `d2b7a7952a20d7945777865880747808260c6c0581d722d09af6d76949fa0954`; JavaScript `84b433384e8f5ab5eea205e1b1d58e562a5590630d92bb6b465507fa7ca4bbaf`; checker `b75f62ad8f672c0e08488347de93c74a2aaa7db8851acaeb5eceb920d3485922`. Chromium, Firefox and WebKit pass at `1280 x 900` and `390 x 844` with `failures: []`, including 36 controls, 44px targets, all route instances, complete logo assets, changed-state interaction, locked readback, reload persistence and zero horizontal overflow. It is awaiting founder selection and does not alter production.

Atomic ruling `SHELL-FOOTER-COMBINATION-01`, 23 September 2026: Krish completed the combined footer review and supplied the exact saved selection. Desktop structure is `rail`; mobile structure is `compact`; desktop and mobile densities are both `compact`; brand treatment is `full`; the supporting sentence is `short`; route grouping is `single`; legal placement is `bottom`; the copyright line is `short`; footer ground is `dark`; the top boundary is `accent`; entrance behaviour is `scroll`. This locks the footer's visual and structural treatment only. The destination labels and final route set are deliberately not locked by this ruling because Krish simultaneously raised a material information-architecture correction: `Ideas`, `Answers` and `Straight answers` require the previously requested renaming, and a separate `New-age leadership` link appears redundant if that experience is now the homepage.

Information-architecture truth label, 23 September 2026: the durable repository record still defines `/new-age-leadership` as a separate argument route and does not contain the exact replacement labels from Krish's earlier naming comment. Krish's current direction instead implies that the New-age leadership experience is the homepage. These are materially different route models. Do not infer labels, remove the route, create a redirect or advance the shared navigation/footer into production until Krish confirms the homepage/redirect ruling and the three exact replacement labels. This is missing authority/evidence, not permission to preserve duplicative navigation by default.

Atomic review workflow correction, 23 September 2026: Krish rejected the request to restate missing route labels outside the artifact. Copy and positioning are surgical founder decisions and must be selected in the same review system as geometry, not frozen implicitly by a layout choice or turned into a memory test. The existing masthead, homepage-opening, route-outcome, navigation and footer geometry rulings remain locked, but their visible labels, headlines, supporting copy, positioning and route-presence decisions remain unselected until reviewed in the relevant rendered copy layer. Every remaining section configurator must include credible copy alternatives for every material headline and positioning line, plus removal where valid, inside the actual approved layout. Options must be grounded in the product canon, approved or previously built language and the real purpose of the destination; generic filler and duplicative eyebrows are prohibited.

The first correction is the isolated Shared language configurator at `prototypes/website-redesign-recovery/component-selection/shared-language-configurator/`. It fixes the selected editorial-index navigation, compact mobile list and footer rail geometry while exposing eight independent language decisions: proof-route label, editorial-route label, long-form answer-route label, buying-question-route label, publication label, primary action label, New-age leadership route model and footer positioning sentence. The New-age decision includes `Homepage only`, which removes the duplicate link and records the old URL redirect as the intended consequence; it does not execute that redirect. HTML SHA-256 is `fc29349a76875f5c90641bdc2bee434d6192d35e062f99fe3ef88e81015cf079`; CSS `4e221e25bbed2fb082bf8183064302d7962405d401958fe5466d464dce67a19d`; JavaScript `e9905618cc53269289fdf4e89e2c83be0475bb6ae51b78a78c3c99e19539629d`; checker `dfa04b1841453f07650df51cffc34229fa3d28e9b4846b781e1bb0ec8529ebce`. A self-owned ephemeral Vite origin passed Chromium, WebKit and Firefox at `1280 x 900` and `390 x 844` with `failures: []`, including 25 controls, 44px targets, complete brand assets, zero horizontal overflow, live language changes, duplicate-route removal, lock readback and persistence. It is awaiting founder selection and changes no public route or production component.

Exactly one next action: Krish selects and locks the Shared language combination in the rendered artifact. After that, build the Homepage message configurator using the already selected opening and route-outcome geometry, with independently selectable hero headline, lede, route-door labels, proof language and section-positioning copy in both desktop and mobile context.

Atomic ruling `SHELL-SHARED-LANGUAGE-01`, 23 September 2026: Krish supplied the exact saved Shared language readback. The proof route is labelled `Results`; the editorial route is `Thinking`; the long-form answer route is `Questions leaders ask`; the buying-questions route is `Before you start`; the publication remains `Media`; the primary action remains `Start here`; the New-age leadership route mode is `companion`; and the footer positioning sentence is `Keep your edge as AI changes the market.` Optional commentary is empty. `Companion` means the homepage carries the New-age leadership narrative spine while the separate deeper route remains and is visibly labelled `The human choice`. This supersedes the earlier proposal to redirect `/new-age-leadership` to `/`; no redirect is authorised by this ruling. The selected shell geometry remains unchanged.

Exactly one next action: build and verify the isolated Homepage message configurator against the already selected opening and route-outcome geometry, then present its desktop/mobile opening, Brain and GTM states for one combined founder copy selection.

The isolated Homepage message configurator is now available at `prototypes/website-redesign-recovery/component-selection/homepage-message-configurator/`. It fixes `HOME-OPENING-COMBINATION-01` and `HOME-ROUTE-OUTCOME-COMBINATION-01` as the visual geometry, then exposes fifteen independent copy decisions across four groups: Opening, AI Brain outcome, AI GTM outcome and shared route language. The three live preview states use the selected desktop and mobile compositions. Canonical client outcomes and their causal facts remain fixed evidence rather than editable marketing language. Option text is drawn from the current production source, the approved New-age leadership direction and previously built Brain, GTM and commercial-readiness language; no eyebrow was added. HTML SHA-256 is `2425834077a9dbc07a03be4f47297b5322da8952ebe84a1dbe48ef6f1232457b`; CSS `3911244409a1910cc1a7afaf4e54ea69c4326c4bf57daa9a162df2c18fce4738`; JavaScript `5b2379aa57c2ca5b6b19f12a311ec0ab4dbd8cdb91b5d08c9da52304127501a2`; checker `d847ffdf20320f27290a8a44d9c0084f478b77d40921e5a1da58df44b0493840`. A self-owned ephemeral Vite origin passed Chromium, WebKit and Firefox at `1280 x 900` and `390 x 844` with `failures: []`, including 45 controls, 44px targets, complete brand assets, zero horizontal overflow, longest-copy containment in Opening, Brain and GTM states, live copy changes, lock readback and persistence. It is awaiting founder selection and changes no public route or production source.

Exactly one next action: Krish reviews all three preview tabs, locks the Homepage message combination and supplies its saved readback. Then continue to the next section with the same combined visual-and-language decision model.

## Exact next-session prompt (executed; historical, not current authority)

The complete prompt below began the recovery sequence that has now reached faithful local integration. Preserve it as historical context; do not treat its earlier prototype-only boundary or first-artifact instruction as current authority.

```text
Continue the Mindmake multi-surface website redesign from its governed recovery state. Your job is to recover the accepted direction without erasing two weeks of judgment, then create the first genuinely stronger material surface. Do not restart discovery, ask me to repeat recorded feedback, continue patching r8, or assume this branch is approved.

Repository: C:\Users\krish\dev\mindmaker\mindmake-award-panel

First apply the repository's AGENTS.md and canonical Krish operating contract. Use krish-principles, then strategy-brief, then build-apps-with-krish as the state orchestrator. Keep krish-design as the owner of taste and material visual approval, krish-build as implementation owner, ux-testing-agent as task-first validator, and verification-loop as the completion gate.

State model and safety boundary:
- project-documentation/06_CURRENT_STATE.md is live production truth. project-documentation/website-redesign/STATE.md is unreleased branch and recovery truth. Their different SHAs and candidate histories are expected, not a contradiction and not promotion authority.
- This worktree is intentionally dirty and contains uncommitted recovery assets plus prior user work. Stay in this exact worktree. Do not create a clean worktree, reset, clean, delete, move, overwrite, commit, merge, deploy or publish.
- Before my rendered approval, new creation is authorised only inside prototypes/website-redesign-recovery/gtm-market-change/. Public routes, shared production components and production styles are frozen.
- Exact r1 source parity is not currently recovered. That blocks claiming source restoration, but it does not block fresh isolated concept work.

Recovery gate before creating the isolated concept:
1. Read AGENTS.md, NOW.md, CLAUDE.md and project-documentation/06_CURRENT_STATE.md.
2. Read project-documentation/website-redesign/STATE.md and quality/website-redesign/continuity-contract.v1.json completely.
3. Inspect Git status and preserve every existing change. Do not reset, clean, delete, move, commit, deploy or publish.
4. Run npm run qa:website-restart and npm run qa:website-approved-visuals.
5. The approved-visual command must start and stop its own local Vite server on an ephemeral port and pass that exact origin into both suites. Do not rely on any ambient server or another checkout.
6. Inspect C:\Users\krish\.scratch\mindmake-ai-brain-vnext-r5\paired-review.png and C:\Users\krish\.scratch\mindmake-ai-gtm-vnext-r6\paired-review.png.
7. Report the exact baseline truth: the approved visual prototypes are retrievable; exact approved r1 production-source parity is not established until every locked hash matches. Record failed parity as a truth label, not as a circular blocker to the isolated concept.

Treat quality/route-lock/approved-production-r1.json, quality/ai-brain/approved-vnext-r5.json and quality/ai-gtm/approved-vnext-r6.json as the approved authority. Treat route-lock candidates r2 through r5 as evidence only. Treat Brain/GTM r8 as explicitly rejected and never as a design or implementation foundation. Never point MINDMAKE_ROUTE_LOCK_MANIFEST at a candidate to bypass the approved default lock.

Do not create another competing strategy, handoff, feedback or state document. Record concept divergence, selection rationale and the reset trace only in the existing Concept and reset trace section of STATE.md. Update the continuity contract only when a genuine accepted ruling or verified finding changes.

First material artifact:
- Create the GTM market-change sequence across desktop and mobile only in prototypes/website-redesign-recovery/gtm-market-change/.
- Under krish-design, run fresh concept divergence. Generators receive the outcome, invariants, real content and data constraints, and distilled failure requirements, but never r8's layout or rationale. Historically informed judges receive the complete rejected history.
- Generate genuinely distinct spines, record them in the authorised trace, reset before synthesis, feasibility-check the strongest direction, then render exactly one synthesis for my unanchored first reaction.
- Do not implement it into /ai-gtm, change shared production files or proceed to Brain until I explicitly approve the rendered material surface.

After GTM lock, proceed in the recorded order: Brain signature sequence, shared-system implementation, Start here intelligence, case-study browsing, route continuity, deterministic checks, continuity guardians and blind award judging. Work autonomously through every reversible and already-authorised step. Pause only for a genuine material visual decision, missing authority or evidence-backed blocker.

The non-negotiable experience is: premium, dark, warm, physical, cinematic and instrument-like; key real estate carries the most impressive content; mobile is independently sequenced around one idea, one visual and one obvious action; words are minimal and approachable; imagery, state and interaction carry the meaning; scroll builds causally and reversibly; no blank PowerPoint-like box fields; no clipping, overlap, truncation, awkward orphans or alignment drift; every visible control works; every consequence and recovery state is clear; previously fixed issues stay fixed; New-age leadership, case studies, blog, Answers, FAQ, Contact, legal routes and Media remain coherent parts of the whole.

Material approval rule: a change is material if it changes what a visitor notices first, understands next, the interaction model or the signature visual language. GTM, Brain, shared shell/navigation, homepage hierarchy or IA, Start here journey, and case-study browsing are material when changed in those ways. Alignment, wrap, overflow, focus, target-size, semantic and regression-check corrections inside a locked surface are routine. If uncertain, stop and ask me. Only I can approve a material surface or accept an MMF exception.

Use two independent quality layers. The blind panel uses quality/award-panel/rubric.v2.json and sees no owner history. The continuity guardians see the full MMR/MMF contract and must return route, viewport, action, expected result, observed result and evidence for every applicable item. One hard-gate failure, continuity failure or inconclusive item blocks release. Judge consensus never substitutes for my explicit approval of a material rendered surface.

The end state is exactly the completion contract in STATE.md: every MMR ruling passes, every MMF finding is closed or explicitly excepted by me, all routes and required viewports work, the continuity panel is fully green, the blind panel reaches world_class_winner on desktop and mobile, I have approved every material surface, and a new approved manifest identifies the final source. Final release evidence must include Chromium, WebKit and Firefox automation plus current physical iPhone Safari with VoiceOver and Android Chrome with TalkBack. Emulation helps iteration but cannot be reported as the physical-device pass. Keep built, committed, merged, previewed, deployed, live and verified status literal and separate.

Get as far as possible autonomously before returning. If the recovery gates and isolated render succeed, your first return must contain the recovery readback, any contradiction that genuinely changes the route, and the single rendered GTM synthesis ready for my unanchored reaction. Do not show me another plan in place of the artifact. If a hard gate genuinely prevents rendering, return the exact blocker, its evidence and the safest next action. Do not bypass the gate or pretend the artifact exists.
```

## Authority and unresolved boundary

Krish authorised creation of this recovery system and next-session prompt. On 22 September 2026 he separately authorised a scoped commit and immutable preview deployment of the exact verified website candidate. This does not authorise merge, production deployment, publication, deletion or any other external mutation.

An authoritative cross-venture Decision Ledger write was not performed because its configured store and readback were not established in this task. This project-local state is therefore not represented as a verified canonical ledger entry.

The authorised local integration phase is complete and the immutable r2 final-source gate is green. Commit and preview deployment are authorised for that exact source set. Production promotion remains blocked by MMF-018, the absence of a fresh provenance-bound fully green continuity aggregate, the absence of a fresh history-blind `world_class_winner` result for desktop and mobile, and missing current physical iPhone Safari/VoiceOver plus Android Chrome/TalkBack evidence. Do not reopen a locked material surface, substitute a candidate manifest, merge, production-deploy, publish or claim a physical-device pass without the corresponding authority and evidence.

### Atomic ruling: HOME-MESSAGE-COMBINATION-01

On 23 September 2026 Krish supplied the exact saved Homepage message readback. The hero headline is `Build the business that can think with you.` The opening promise is `Part people. Part agent. Led by judgement.` The Brain door is `Build your AI brain` with `Your judgement, running.` The GTM door is `Build your AI GTM`. Krish's accompanying comment supersedes the selected GTM door explanation with the exact line `Build your AI native pricing, positioning and org.` The shared proof line is `Build the first working version on real work. Keep the system.` The Brain outcome uses `Make your judgement reusable.`, `Give your standards, context and past decisions a memory you can use.` and `The next decision begins with what the last one taught you.` The GTM outcome uses `We turn an AI market shift into one tested commercial move.`, `See how one market change alters product, price, positioning and people before you commit.` and `Start with the commercial decision that is holding the rest of the system back.` The back control is labelled `AI Brain or AI GTM`. The proof receipt is headed `What stays with you`.

This ruling locks copy only inside the already locked `HOME-OPENING-COMBINATION-01` and `HOME-ROUTE-OUTCOME-COMBINATION-01` geometry. It does not approve a new visual surface, production implementation or promotion. Krish simultaneously reported significant desktop and mobile visual issues, so visual fit remained a hard gate rather than an assumed consequence of the copy choice.

The exact selected combination located a reproducible mobile GTM collision in Chromium, Firefox and WebKit: the selected commercial headline and promise extended the action into the film-caption region. The correction moved the bounded mobile film caption lower inside the already approved copy-first sequence without changing any selected words, hierarchy, interaction or desktop composition. The default and exact-selected suites now both return `failures: []` in Chromium, Firefox and WebKit. The selected suite checks Opening, Brain and GTM containment, critical-element overlap, horizontal overflow, exact custom GTM language, lock readback and reload persistence. Current rendered evidence is under `C:/Users/krish/.scratch/mindmake-homepage-message-selected/`; the final selected GTM mobile render is `gtm-mobile.png`.

This record supersedes only the earlier Homepage message artifact hashes. Current SHA-256 values are HTML `6e20f90b20833689c55907b36181c2ff02ca9b5fb51b74d3767e92b41d21242c`, CSS `9da1dc2973b238bb2bed3f05ba9c5d9ff5431811f218060c6c70ed00f4e4cab8`, JavaScript `5b2379aa57c2ca5b6b19f12a311ec0ab4dbd8cdb91b5d08c9da52304127501a2`, default checker `756cb214ee2784293cd5ae6b271396226d2bff6243705449d2d3de6a11692660` and selected-combination checker `af2d155f03099e6bfed854567733056585557eeb44c4f2ac0d6022c42184ecf1`.

Exactly one next action: build and verify the isolated Homepage historical-story chapter configurator against the accepted `TIME-LENS-S3-R5` interaction and the selected homepage opening, with all material copy, hierarchy, imagery, compression and device choreography decisions grouped into one rendered desktop/mobile selection surface.

The isolated Homepage historical-story configurator is now available at `prototypes/website-redesign-recovery/component-selection/homepage-history-configurator/`. It retains the accepted four-story time-lens interaction and the four governed generated scenes, then groups the entire chapter into one founder decision surface. Seven structural choices cover desktop composition, mobile compression, desktop copy position, device-specific headline scale, story controls and transition. Twelve language choices cover the bridge, optional supporting line, outcome label, optional closing hinge, every story question and every story outcome. `Remove it` is explicit wherever a supporting line can disappear, so no duplicate eyebrow or backup-singer copy is forced into the final page.

The QA pass found and corrected three shared layout defects before presentation: the right-hand cinematic desktop bridge collided with the era rail; the paper-prelude rail occupied the wrong layer; and the longest calculator question crossed the mobile story controls. The corrected artifact was re-run through Chromium, Firefox and WebKit across three materially different configurations and all four story states. All 36 engine, configuration and story combinations retain content inside the frame, keep bridge, story, control and closing regions separate, load the correct imagery, preserve at least 44 CSS pixel choice targets, avoid document-width overflow, change story state, persist a non-default copy choice and restore it after reload. The current checker returns `failures: []`.

Exact SHA-256 values are HTML `c24a6cd94a8a452cc20ac5b217a88e40ebb9314ba153086263aff0d8f59a7f9c`, CSS `8b4901b943041ecde64b46f809ba9b1737078fb2534515d273a1a1f38dfd2c15`, JavaScript `4433b2afeb922a883efafc15120b0d70bc51fb4c4c8e68a200f938a9f7cacc6a` and checker `34f93f8b629260394390ae1e43b4b1ef23cd216d2d6c019d9c6f38050512ce6b`. Render evidence is under `C:/Users/krish/.scratch/mindmake-homepage-history-configurator/`, including the default desktop and mobile compositions and the longest calculator state in the alternate mobile prelude.

Approval state: the configurator is an isolated, rendered and cross-engine-verified selection artifact. It does not change the public homepage, the separate `/new-age-leadership` companion route, any production component or any deployment. Exactly one next action: Krish chooses the combined Homepage historical-story configuration and supplies its saved readback.

### Superseding correction: HOMEPAGE-HISTORY-CONFIGURATOR-R2

Krish's first live review at his actual wide desktop width exposed a catastrophic overlap in the Writing state: the bridge, story number, question and supporting line occupied the same vertical region. This invalidates the earlier `cross-engine-verified` claim for the first configurator revision. The root cause was a nested preview whose display type still scaled from the full browser viewport, combined with an automated matrix that exercised only one outer desktop width. The fixture passed at that width while failing at the wider width Krish opened. This was a test-boundary defect and a layout-system defect, not an acceptable edge case.

R2 replaces viewport-relative display type with preview-container-relative sizing, gives bridge and story copy separate fixed regions, makes the alternate cinematic and paper compositions obey the same content-range contract, and stacks the review workspace before its preview becomes too narrow to represent a desktop surface honestly. The corrected Writing state has been inspected at the wide desktop composition and no longer overlaps.

The checker now covers outer widths `1280 x 900`, `1440 x 1000`, `1920 x 1080` and `2560 x 1440` in Chromium, plus `1440 x 1000` and `1920 x 1080` in Firefox and WebKit. It combines those widths with three structurally different configurations and all four historical stories, for 96 engine, viewport, configuration and story states. Every state verifies frame containment, separation of bridge, story, controls and closing hinge, document-width overflow, image retrieval, choice-target size, interaction, lock readback and reload persistence. The corrected suite returns `failures: []`. Wide Writing evidence is `C:/Users/krish/.scratch/mindmake-homepage-history-configurator/wide-writing-desktop.png`; the paired mobile evidence is `wide-writing-mobile.png`.

R2 supersedes the earlier CSS and checker hashes only. Current SHA-256 values are HTML `c24a6cd94a8a452cc20ac5b217a88e40ebb9314ba153086263aff0d8f59a7f9c`, CSS `63a23d0e13c56bb5be2f6a51d4394573a695fbc4446723c2b18c26256f85f358`, JavaScript `4433b2afeb922a883efafc15120b0d70bc51fb4c4c8e68a200f938a9f7cacc6a` and checker `00ba07356f7ab6507d2e10099acc8b558a76c93e583ca077ec171819b917abd6`.

Approval state remains unchanged: this is an isolated corrected selection artifact, not an approved material surface or production change. Exactly one next action: Krish refreshes and reviews the corrected historical-story configurator before making any selection.

### Superseding interaction correction: HOMEPAGE-HISTORY-CONSOLE-R3

Krish's next review rejected R2's selection interaction as unusable. Although the nested previews no longer overlapped, nineteen simultaneous decisions forced repeated vertical travel between a distant control and its visual consequence. The interface required Krish to remember what he was voting for while scrolling. R2 therefore remains useful layout evidence but is rejected as a founder decision surface.

R3 is a new additive decision console at `prototypes/website-redesign-recovery/component-selection/homepage-history-configurator/index-r3.html`. It preserves every R2 structural and language option without changing the R2 files. It presents exactly one decision at a time beside one persistent live preview; highlights the affected preview region; switches automatically to the relevant historical story for each story-specific question or outcome; keeps desktop/mobile and story switches in place; exposes four direct section jumps; autosaves each choice; supports previous/next recovery; and replaces the long final output with a four-group readback plus an optional note. The console and decision card fit one browser viewport without document or hidden card scrolling at the tested sizes.

The additive locked-revision check confirms all R2 baseline hashes remain unchanged: HTML `c24a6cd94a8a452cc20ac5b217a88e40ebb9314ba153086263aff0d8f59a7f9c`, CSS `63a23d0e13c56bb5be2f6a51d4394573a695fbc4446723c2b18c26256f85f358`, JavaScript `4433b2afeb922a883efafc15120b0d70bc51fb4c4c8e68a200f938a9f7cacc6a` and checker `00ba07356f7ab6507d2e10099acc8b558a76c93e583ca077ec171819b917abd6`. R3 hashes are HTML `796a60b0610a491bd7ce715d465c2001a3672f7c587a98374c3ed5c7a4aac19e`, CSS `86355f7e0af1dba64ef39af9f9ae39499691104f1a32f1ba8ff5e702fa72471c`, JavaScript `3134fd1caf1aca008d74d60675bf7663dbf8cbbc1f68dc7fa1cc883fcc45692a` and checker `51994cd4ed7ee983a93a3c43b4c42ef140c3244e9e9038af0a63fb4be959d8e4`.

The self-owned Vite browser run passes with `failures: []` in Chromium, Firefox and WebKit at `1440 x 900` and `1920 x 1080`, plus Chromium at `390 x 844` and `320 x 568`. It verifies one-decision presentation, no document overflow, no decision-card clipping, 44 CSS pixel console actions, complete story imagery, visible affected-region focus, all nineteen decisions in sequence, non-default choice application, compact review, lock and reload persistence, automatic Calculator-story selection, device switching and persisted device/story state. Current rendered evidence is under `C:/Users/krish/.scratch/mindmake-homepage-history-console-r3/`. The ambient review origin returned HTTP 200 for the exact R3 URL.

Approval state remains unchanged: R3 is the corrected isolated selection mechanism. It does not alter the homepage, production components, the R2 baseline or any deployment. Exactly one next action: Krish uses the R3 decision console and locks the Homepage historical-story combination.

### Atomic ruling: HOME-HISTORICAL-STORY-COMBINATION-01

On 23 September 2026 Krish completed the R3 one-decision-at-a-time review. The exact browser readback was captured across all nineteen decisions and the combination was locked in the artifact. Desktop composition is `Editorial split`; mobile compression is `Integrated one-screen lens`; desktop copy position is `Left`; desktop and mobile story-headline scales are both `Balanced`; story controls use the `Era rail`; and story transitions use `Dissolve`.

The chapter opens with `You are not the first person to wonder what a new tool might take from you.` followed by `We have been asking that question for centuries.` Each resolution is introduced by `What changed`. The closing hinge is `The feeling is familiar. The reach is new.` Writing asks `If knowledge lives outside us, will memory grow weaker?` and resolves with `Ideas could travel beyond one voice and survive their maker. We changed what memory was for.` The engine loom asks `If the machine can do the work, what happens to the worker?` and resolves with `The fear was not foolish. Jobs, wages and status changed. The real fight was over who controlled the gain.` The calculator asks `If the device does the arithmetic, will children stop learning to think?` and resolves with `A review of 79 studies found no collapse in basic skills. The question moved from doing every sum to understanding the answer.` Satnav asks `If the device knows the route, will we lose our sense of direction?` and resolves with `That risk turned out to be real. A useful tool still asks us what we choose to keep practising.` Optional commentary is empty.

This ruling locks the Homepage historical-story chapter only. It does not change production, approve the following authority/organisation chapter or authorise promotion. Exactly one next action: review the Homepage authority-to-organisation chapter against the approved `TIME-LENS-S3-R5` baseline using the same one-decision-at-a-time console.

The isolated Homepage authority-chapter configurator is now available at `prototypes/website-redesign-recovery/component-selection/homepage-authority-configurator/`. It is an allowed-diff review surface grounded in the approved `TIME-LENS-S3-R5` Work-to-Organisation chapter, not a fresh concept. The fixed preview contains the continuously moving `AI carries / You keep` authority instrument and the eight-node hybrid organisation. Twenty-one independently named decisions cover desktop/mobile composition, device-specific headline and instrument scale, phase-control treatment, starting phase, chapter label, both state headlines and supporting lines, capability-list depth, reel motion, both governing labels, organisation-detail depth, organisation label and illustrative-film disclosure. The console presents one decision at a time beside the live affected state, automatically changes device or Work/Organisation phase when relevant, autosaves every choice, supports direct section recovery and ends in a four-group readback with optional commentary.

The self-owned Vite browser run passes with `failures: []` in Chromium, Firefox and WebKit at `1440 x 900` and `1920 x 1080`, plus Chromium at `390 x 844` and `320 x 568`. It verifies single-decision presentation, zero document overflow, zero decision-card clipping, 44 CSS pixel console actions, complete film imagery, all twenty-one decisions in sequence, device-specific preview switching, automatic Work/Organisation context, changed-state application, compact readback, lock and reload persistence. The first short-mobile render exposed an over-large desktop-preview type floor; that nested-preview defect was corrected with container-relative scaling and the full matrix reran green. Evidence is under `C:/Users/krish/.scratch/mindmake-homepage-authority-console/`.

Exact SHA-256 values are HTML `17dfeca7453a009b4b8426d82770a489c891313ce4152747b2b731f320b4b150`, CSS `7de2d501f2b12b18babd771dc0903355211277bed609984a501c225c542925f9`, JavaScript `452593393efdaba9d4d30ded31337000562f7e0ede128c5beb2f76f2205024f7` and checker `7487bdd3f9d8c0690a5e9391ac81bbe57a341f6f2b9f531334a6663ab695f645`. The ambient review origin returned HTTP 200 for the exact artifact URL. It changes no production route, component, stylesheet or deployment. Exactly one next action: Krish uses the authority-chapter decision console and locks the selected combination.

### Atomic ruling: HOME-AUTHORITY-CHAPTER-COMBINATION-01

On 23 September 2026 Krish completed the one-decision-at-a-time authority-chapter review. The exact browser readback across all twenty-one decisions was captured and the combination was locked. Desktop uses `Copy left, instrument right`; mobile uses `Copy, then instrument`; headline and instrument scales are `Balanced` on both devices; Work and Organisation use `Filled direct buttons`; and `Work first` is the opening state.

The small chapter label remains `And now, AI`. The Work headline is `The feeling is familiar. The reach is new.` with `AI can carry work that used to look like thinking, across the business from one decision to the next.` The Organisation headline is `The organisation changes shape.` with `People hold judgement. The AI Brain connects the work.` The AI reel shows ten capabilities, the human reel shows ten retained responsibilities, and both remain continuously moving while visible. Their labels remain `AI carries` and `You keep`. Organisation nodes use the concise R5 descriptions; the organisation label remains `New-age leadership`; and the film disclosure remains `Illustrative machinery`. Optional commentary is empty.

This ruling locks the Homepage authority-to-organisation chapter only. It does not change production, approve the following practice/leadership-dividend chapter or authorise promotion. Exactly one next action: review the Homepage practice and AI-Brain-benefit chapter using the same fixed decision console.

### Superseding feedback-capture contract: HOMEPAGE-DECISION-NOTES-01

Krish reported that the historical-story mobile layout was unacceptable and then discovered that this material feedback had not been captured in the locked readback. `HOME-HISTORICAL-STORY-COMBINATION-01` is therefore superseded only for its mobile-composition decision: `Integrated one-screen lens` is rejected and unresolved. The other eighteen captured choices remain the last selected values, but the chapter is not approved until the mobile decision is reviewed again. The R3 console migrates the earlier note-less lock into an unlocked state at the mobile-layout decision rather than silently treating the rejected default as approved.

Every one-decision-at-a-time configurator must now preserve two distinct feedback layers. Each individual decision exposes its own optional note for corrections, conditions or contextual commentary. That note is keyed to the exact decision, autosaved with its choice, restored after navigation and reload, counted in the compact final readback and serialized into the locked URL under `feedback`. The final screen retains a separate overall note, serialized under `overallFeedback`. A lock that discards either layer is invalid. When a locked combination is captured into this state, every non-empty individual note and the overall note must be read and treated as part of the decision; `done` must never be interpreted as approval of a default that accompanying feedback rejects.

This contract has been retrofitted into the historical-story and authority configurators and built into the new leadership-dividend configurator. The decision-note control remains visible at every tested size without reintroducing document scrolling or decision-card clipping. Chromium, Firefox and WebKit pass at `1440 x 900` and `1920 x 1080`; Chromium additionally passes at `390 x 844` and `320 x 568`. The suites verify the individual-note control, autosave and reload persistence, note counts in the grouped readback, separate overall commentary, and both feedback payloads in the locked URL. All three current suites return `failures: []`.

The corrected historical R3 hashes are CSS `4a5097d5fbea3d68c16f6f409442f7697e533098a87fad1ba5ba055b1ab6b91b`, JavaScript `7b15fcaa356bc0cd00db323bdeebb57df80171b5aa759e8b0b9738508d954ac5` and checker `24b601e86839640dcc52c30550537565983df5e0236990c69d5aa2ea430eaa7c`. The authority feedback-layer hashes are JavaScript `4e14811846c8edeaa93ce19b7f9d105b29e57e50d19bd0b942e21997686eb3dc` and checker `00c18fcd7857042568c4ae3be303daf33b00415fd33565f0c0791e8d3628d37c`; its already approved choices are otherwise unchanged.

The isolated leadership-dividend console is staged at `prototypes/website-redesign-recovery/component-selection/homepage-leadership-dividend-configurator/index.html`, but it must not be presented as the next approval gate until the historical mobile decision is resolved. It groups Practice, six rotating AI-Brain benefits and the Returned hour into twenty one-at-a-time decisions with the same feedback contract. Its current hashes are HTML `2370aefcc9a158bc13966a0f203be26919640d073305d693b9cb3e776dd5fb24`, CSS `7535a532181f98392a769ddc48a34148738874220a07fce7ef1298b564416515`, JavaScript `d9a64c7ef686756d540ea4be49e0793691f30deaccf64268943a84cda9500ade` and checker `e9aff4e3db1739fea9275dfa851f416dea2e928a1e78bab0803a043461015a32`.

No production component, public route or deployment changed. Exactly one next action: Krish refreshes the R3 historical-story console, revises the reopened mobile-layout decision and uses its decision-level note to preserve any condition the visual option alone does not express.

### Correction to HOMEPAGE-DECISION-NOTES-01: exact rejected surface

Krish clarified that the unacceptable mobile layout was not the historical-story chapter. It was the authority/organisation chapter shown in his screenshot: the copy-first phone composition with a tall two-column organisation grid. The earlier paragraph that marked the historical `Integrated one-screen lens` mobile choice rejected is wrong and is superseded by this correction. That historical mobile choice returns to its previously selected status. The authority chapter's prior `Copy, then instrument` mobile choice is rejected and unresolved; `HOME-AUTHORITY-CHAPTER-COMBINATION-01` remains authoritative for its other twenty choices only.

The rejected tall authority chart has been removed from the mobile choices rather than offered back under a new label. The reopened decision now compares three bounded phone-native compositions: a one-screen three-by-three network, a Brain-centred role chain and a horizontally navigable role rail anchored by the AI Brain. Each keeps the chapter headline, organisation, and Work/Organisation control inside one phone frame. The exact authority decision-level note control and overall feedback contract remain active. The full authority suite again returns `failures: []` across Chromium, Firefox and WebKit at `1440 x 900` and `1920 x 1080`, plus Chromium at `390 x 844` and `320 x 568`. Current authority hashes are JavaScript `675885963c78d696bdb0d915eaaafbb670e26e8fa309fa618e729d8ada0aac3e`, CSS `717f23a16a5c2a7624bf75ff5b0a001014757476833351cb0302f2422badec84` and checker `00c18fcd7857042568c4ae3be303daf33b00415fd33565f0c0791e8d3628d37c`.

Krish also reiterated a separate historical-chapter issue: the bridge statement such as `AI is not the first tool to make people question their place.` should not carry the same typographic authority as the historical question such as `If the machine gives the answer, do we lose the thinking?` The history console now contains a twentieth explicit hierarchy decision comparing a compact modern bridge against the large editorial story question, a smaller editorial marker against the question, and the former same-serif treatment. The former same-serif equality is not silently retained as approved. The history suite returns `failures: []` across the same eight viewport sessions. Current historical hashes are JavaScript `f5e4264b84dcdfce7ac875ac102bb2954680075f486a8fae5d21d9aefc7fbe42`, CSS `bd9a1f2cdad350ffce341cdd77c5e307ba2e4afec5cace583899ddd90f814f27` and checker `52434708a2474e3fe44356054ad77f4ea365f034e7384b7db9a4f27648958ada`.

No production component, public route or deployment changed. Exactly one next action: Krish selects the corrected authority/organisation mobile composition in the reopened decision and records any condition in that decision's note.

### Durable feedback reconciliation: WEBSITE-FEEDBACK-LEDGER-01

The website redesign now has one machine-readable feedback register at `project-documentation/website-redesign/feedback-ledger.json`, governed by `FEEDBACK-WORKFLOW.md`. This register is subordinate to this recovery state: it records exact feedback, interpretation, acceptance criteria, status, resolution and evidence, but it cannot approve a surface or change production by itself.

The component-selection contract has changed from lock semantics to submission semantics. Completing a console submits choices, decision notes and overall commentary for reconciliation. It does not approve defaults, lock production or waive an unresolved correction. Authority, historical-story and leadership-dividend consoles now show the full text of every decision note in their review, preserve the overall note, label the final state `Selections submitted`, and explicitly state that submission is not production approval.

The review matrix now includes Chromium at `729 x 759`, the actual narrow desktop class that previously hid the note control, in addition to the existing desktop and mobile sessions. The authority suite also measures the organisation-node type-label top coordinates row by row and fails when any row differs by more than one CSS pixel. Authority, history and leadership-dividend browser suites each pass across nine viewport sessions in Chromium, Firefox and WebKit with `failures: []`.

The reusable owner for this behavior is the canonical AI harness experience-quality contract version `1.2.0`. Its project profile now requires a feedback ledger, verbatim decision and overall notes, non-approval submission semantics, blocking unresolved statuses, complete feedback fields and judge requirement handoff. Award-panel capture now stops before creating a run when blocking feedback remains. When the ledger is clear it freezes neutral resolved requirements for jurors without exposing complaint wording or desired fixes. The blocked-run test exited `1`, named the two unresolved items and created no artifact. The harness fixture validator and 26-case adversarial self-test pass; this repository's profile validator and 15-case self-test also pass.

Two founder-judgement items remain deliberately blocking rather than being inferred away: `HOMEPAGE-AUTHORITY-MOBILE-001` for the corrected phone-native organisation composition, and `HOMEPAGE-HISTORY-TYPE-001` for the corrected bridge-versus-question hierarchy. `HOMEPAGE-AUTHORITY-ALIGN-001` is mechanically verified by coordinate measurement, but that does not imply visual acceptance of the whole mobile composition.

No production component, public route or deployment changed. Exactly one next action: review the two blocking rendered choices, beginning with the already-open authority mobile correction; after explicit acceptance, update their ledger statuses before advancing to the leadership-dividend chapter.

### Atomic correction acceptance: HOME-AUTHORITY-MOBILE-NETWORK-01

On 24 September 2026 Krish completed the reopened authority mobile-composition decision and accepted `One-screen network`. The decision-level note and overall note were both empty. This acceptance supersedes only the rejected `Copy, then instrument` mobile organisation composition inside `HOME-AUTHORITY-CHAPTER-COMBINATION-01`; its other twenty choices remain unchanged.

The accepted network keeps all eight organisation nodes and the AI Brain relationship inside one bounded phone-native composition. The node-type labels use fixed rows and the checker measures every visual row, failing when label tops differ by more than one CSS pixel. The full authority suite passes in Chromium, Firefox and WebKit across nine viewport sessions, including the actual `729 x 759` review class and the `390 x 844` and `320 x 568` phone classes.

`HOMEPAGE-AUTHORITY-MOBILE-001` is now `accepted`; `HOMEPAGE-AUTHORITY-ALIGN-001` remains mechanically `verified`. This does not approve a production implementation or any other unresolved section. No production component, public route or deployment changed. Exactly one next action: review `HOMEPAGE-HISTORY-TYPE-001`, the bridge-versus-question typographic hierarchy.

### Atomic correction acceptance: HOME-HISTORY-BRIDGE-HIERARCHY-01

On 24 September 2026 Krish completed the reopened history hierarchy decision and accepted `Compact modern bridge, editorial story`. The decision-level note and overall note were both empty. This resolves the previously rejected equal typographic authority between the bridge statement and the historical question. The `Same editorial voice` treatment remains explicitly rejected.

`HOMEPAGE-HISTORY-TYPE-001` is now `accepted`. The feedback ledger contains no `open` or `implemented-awaiting-review` items. The corrected direct decision link, note readback, submission semantics and shared console layout pass in Chromium, Firefox and WebKit across nine viewport sessions. The exact `729 x 759` history decision initially clipped; the shared workspace ratio was corrected before presentation and all authority, history and leadership-dividend suites reran with `failures: []`.

No production component, public route or deployment changed. Exactly one next action: review the staged Homepage leadership-dividend chapter, beginning with its combined Practice, AI Brain benefits and Returned hour composition.

### Atomic ruling: HOME-LEADERSHIP-DIVIDEND-COMBINATION-01

On 24 September 2026 Krish reviewed the complete leadership-dividend console and replied `done` while the rendered default combination was visible. That reply accepts the displayed combination as a whole; it does not require him to re-enter twenty unchanged defaults merely to create a hash. There were no per-decision notes and no overall note.

The accepted combination is: balanced desktop split; integrated mobile overlay; balanced desktop and mobile title scales; `How it works` as the first state; stage tabs for the practice sequence; arrow rail for AI Brain benefits; benefits rotate on entry; the practice label `What this feels like in practice`; the practice headline `The system does not replace your judgement. It brings more to it.`; practice order Notice, Connect, Prepare; practice explanations shown; the benefit label `What your AI Brain makes possible`; leadership-first benefit order; benefit explanations shown; fractional benefit count `01 / 06`; returned-hour label `The returned hour`; returned-hour headline `What will you do with the hours it gives back?`; the complete returned-hour list; and the closing line `A hybrid organisation does not ask you to think less. It helps you act on more of what you know.`

This ruling completes the homepage section-level selection sequence. It authorises one additive, integrated homepage candidate built from the accepted masthead, opening, historical lens, authority chapter, leadership dividend, route outcome and footer decisions. It does not authorise production overwrite, merge, deployment or publication. Exactly one next action: build and verify that integrated candidate across the governed desktop and mobile viewports, then return only at the next material visual gate.

### Integrated candidate: HOMEPAGE-PRODUCTION-SYNTHESIS-R1

The first complete additive homepage synthesis is available at `prototypes/website-redesign-recovery/homepage-production-synthesis-r1/index.html`. It assembles the accepted masthead, opening, historical lens, authority/organisation chapter, leadership dividend, route outcome and footer decisions into one continuous page. It does not introduce a new design direction. New-age leadership is the homepage thesis rather than a duplicate primary-navigation destination; the separate route remains a companion surface only. Supporting labels are limited to governing state, chronology and interaction rather than decorative backup-singer copy.

The synthesis contains the exact selected opening and route language; the four accepted historical questions and outcomes; the compact modern historical bridge hierarchy; the continuously moving AI-carries/You-keep boundary; the accepted phone-native one-screen organisation network with row-aligned role labels; Notice/Connect/Prepare practice states; six rotating AI-Brain benefits; the selected Returned hour; Brain and GTM route outcomes; and the accepted footer labels and positioning sentence. The logo and hero title share the same left rail at every governed width. The fixed masthead, opening copy, route doors and proof line fit the first frame without collision; section labels clear the masthead; the authority reel ends on complete rows; and the Start here action can be fully exposed above the viewport bottom.

The self-owned browser suite passes with `failures: []` in Chromium, Firefox and WebKit across ten sessions: `1920 x 1080`, `1440 x 900`, `1366 x 768`, `729 x 759`, `390 x 844` and `320 x 568` as applicable. It checks horizontal overflow, runtime errors, imagery, fixed-header clearance, exact logo/title alignment, first-frame containment and collision, 44 CSS pixel targets, navigation open/Escape close, all four history states, both authority states, mobile organisation-label alignment within one CSS pixel, all three practice states, the benefits carousel, both route outcomes, route-specific Start here links and bottom-action reachability. Section and full-page evidence is under `C:/Users/krish/.scratch/mindmake-homepage-production-synthesis-r1/`.

`npm run qa:website-restart` also passes: the feedback ledger has no blocking items; the experience-quality profile and its fifteen-case self-test pass; and all award-panel definitions plus deterministic self-tests pass. No blind judges were executed at this material gate, so this is not represented as a scored award-panel verdict. Current SHA-256 values are HTML `5bb5b060c38b6e78e912fe6fe1094aca377a838854311484689365b6b702fd49`, CSS `8b0d317f2ab3dcf3fce63a0da17a486ed0f6fd42ed9dfd95db2ea42f5141df7d`, JavaScript `4646ea6aa06e26d9de6a616425ebcf72dd5c80b2cf1c2400c76bc272b8f220aa` and checker `928b76450924d4c246c3824fd938b45e9f7370128b0dfc3ac3578214c22de0b7`.

This remains an isolated review candidate. It changes no public route, production component, deployment or publication. Exactly one next action: Krish reviews the complete integrated candidate as the next material gate. If accepted, implementation can move into the production homepage and the full continuity, blind judging and physical-device release sequence can begin without reopening the accepted section decisions.

### Rejection: HOMEPAGE-PRODUCTION-SYNTHESIS-R1

On 24 September 2026 Krish rejected `HOMEPAGE-PRODUCTION-SYNTHESIS-R1` because it failed to carry the accepted decisions through each chapter. The rejection is correct. R1 manually reconstructed the page from prose readbacks and imported the older `homepage-new-age-story` stylesheet and script. It therefore treated exact rendered selections as a loose content brief, changing accepted component geometry, hierarchy, interaction and visual treatment while retaining some selected words. Passing containment and interaction tests did not establish decision fidelity.

R1 is evidence only and must not be used as a design or implementation foundation. The acceptance sequence itself remains authoritative. The next synthesis must compile the selected rendered components and their exact payloads directly, with a chapter-by-chapter parity manifest covering DOM contract, governing data attributes, exact copy, device-specific composition, interaction states and approved visual anchors. A mechanically green page is not presentable while any parity row fails. No production component, public route or deployment changed.

Exactly one next action: reconstruct the homepage through component-preserving compilation from the accepted configurator artifacts, then run the parity gate before any integrated candidate is shown.

### Component-preserving candidate: HOMEPAGE-PRODUCTION-SYNTHESIS-R2

`HOMEPAGE-PRODUCTION-SYNTHESIS-R2` is available at `prototypes/website-redesign-recovery/homepage-production-synthesis-r2/index.html`. Unlike R1, it does not recreate the accepted chapters inside the older homepage shell. It hosts the selected opening, historical lens, authority chapter, leadership dividend, route outcome and footer source artifacts directly and supplies their exact accepted configuration payloads and locked copy.

The machine-readable source of truth is `quality/website-redesign/homepage-selection.manifest.json`. It records each source artifact, source stylesheet, live SHA-256 values and accepted values. `scripts/qa/homepage-synthesis-parity-check.mjs` fails when a source digest changes, an integrated chapter root is missing, an accepted value is absent from the assembler or a locked copy line is missing. The current run passes for six source components and ten copy locks.

Browser readback was performed at `1440 x 900` and `390 x 844`. The first rendered pass found that the console-host grid was clipping the history, authority and leadership components to a 52px row. The shared host sizing rule was corrected and all three chapters were re-read at full frame height. A separate mobile readback found that both route doors had inherited the GTM copy because the patch loop counted desktop and mobile buttons together. The route index was corrected and the visible mobile doors now read `AI brain` and `AI GTM`.

The rendered desktop and mobile opening, history, authority, leadership dividend, route outcome and footer are visible without horizontal page overflow. Browser interaction readback passes for the history era change, Work to Organisation switch, leadership benefit switch, AI Brain to AI GTM switch and navigation overlay open and close. `npm run build` exits `0`. R1 remains rejected evidence and is not an implementation source.

This is an isolated review candidate only. `HOMEPAGE-SYNTHESIS-FIDELITY-001` is `implemented-awaiting-review`, so the feedback ledger intentionally remains blocking. No public route, production component, deployment or publication changed. Exactly one next action: Krish reviews R2 for decision fidelity. Acceptance permits production-route implementation; rejection returns to the exact failed chapter without reopening accepted selections.
``````
<!-- END VERBATIM project-documentation/website-redesign/STATE.md -->

<a id="archive-2026-09-24-website-redesign-release-2026-09-24-md"></a>
### Archived source: project-documentation/website-redesign/RELEASE-2026-09-24.md

Source path: `project-documentation/website-redesign/RELEASE-2026-09-24.md`  
Raw SHA-256: `699383ffdf3974aa3f36f19ba0c7738df0fe68f6be7fbd86c84a83116f6c88ca`  
Source bytes: 16742

<!-- BEGIN VERBATIM project-documentation/website-redesign/RELEASE-2026-09-24.md -->
``````markdown
# Approved R3 production release

## Authority and scope

Krish approved the R3 homepage on 24 September 2026 and authorized production publication after end-to-end verification. Keep its accepted copy, imagery, composition and controls. The requested visual behavior change is limited to native scroll-pinned progression through the four history stories and the five leadership-dividend stages. Reduced-motion and insufficient-height layouts retain natural flow and direct controls.

The immutable approved prototype remains `prototypes/website-redesign-recovery/homepage-production-synthesis-r3/`. Production uses its deterministic compiled adapter, not a newly designed homepage. This report does not treat earlier prototype receipts as evidence for the production adapter.

## Explicit accessibility exception

On 24 September 2026 Krish answered the release question: **"Publish after all other checks pass; record this exception"**.

This exception covers only physical iPhone VoiceOver and Android TalkBack checks. Neither check has been performed. Browser emulation, keyboard testing and reduced-motion testing are not substitutes and must not be reported as physical-device passes. The exception does not waive any other release gate. The two physical assistive-technology checks remain follow-up work after publication.

The exception is limited to this release, not a permanent waiver for future work.

## Status

**Live and verified.** The final pre-publish candidate `840801d8995dc464193883b5c64ddca9689461bf` passed both full CI runs, `36016492903` (PR) and `36016484248` (push), and Vercel preview `dpl_6k7Di4K1zV7MuyPWGcPw6TiMTvAE` was READY with the approved public markup. PR #170 merged at 15:07:20 UTC on 24 September, producing `3ee77cf9956f98dd73f69d0b48745930335e74e1`. Actual public readback, the live motion matrix and the post-promotion lead-to-email-to-download canary passed separately; merge alone was not treated as completion.

### Production readback

Production is live at `https://mindmake.co`, deployment `dpl_EZigNAi6Uc6Apcq75XsFnHETt5W8`, URL `https://mindmake-bh0d8hczk-krish-rajas-projects.vercel.app`, from merged commit `3ee77cf9956f98dd73f69d0b48745930335e74e1`. Vercel reported READY/production and the canonical domain served the approved hero, history and dividend at 15:08:56 UTC. Public script: `/assets/index-CZk5zedf.js`.

The live three-engine motion run then passed all twelve ordered-state cases, twelve fallback transitions and real lead-entry checks with zero failures. `browser-report.json` records origin `https://mindmake.co`; it is distinct from the retained CI receipts. Public HTTP readback passed all 26 indexed pages, 21 referenced assets, six canonical/retired-route redirects and both robots/llms surfaces. Every indexed page's canonical matched its public URL. The production error-log query returned no entries; this is a bounded log observation, not proof that no error can occur.

Independent public review inspected eight screenshots at 390 and 1440 widths: cookie clearance, history/dividend controls, footer and settled menu. Escape restored the visible opener, no stale inert state remained, and no page errors or new visual blocker were observed. The independently fetched public HTML SHA was `24038f10e41dac671b985b0540750462f12c3ce6a6752701f8c58579e4087a56`; this is a served-document identity, not the CI build hash. Evidence: `final-live-independent-2026-09-24T15-12-41-739Z.json` and its eight captures.

The actual progressive company-first browser canary completed research, profile/problem/time selection, preview, explicit keep/verify and success. Actual verification, visitor brief and operator digest reached INBOX; persistence was ready with exactly one day-14 follow-up. The visitor receipt was briefly absent from the fresh mailbox query and subsequently verified at 15:13:40 UTC; no resend was used. The actual success-screen download was 3,755 bytes and matched 15 on-screen brief fragments, with no external requests or overflow at 1440 and 390 widths; both captures were visually inspected. A nested-dialog QA selector was corrected before sending, without a product change. Full IDs, source evidence and exact synthetic-row cleanup are in `BACKEND-RELEASE-EVIDENCE-2026-09-24.md`.

### Remaining work and limits

Release identity above names the material application promotion and its dated readback. A subsequent evidence/documentation-only merge may create a new hosting deployment with identical application files; retrieve the currently aliased deployment with `vercel inspect https://mindmake.co --json` rather than treating a dated ID as an evergreen alias. Evidence updates must not modify any of the 66 R14-locked files.

- Physical iPhone VoiceOver and Android TalkBack remain outstanding under the explicit release-only exception.
- The dependency audit's 23 package entries remain tracked upgrade work. No confirmed visitor-reachable blocker was found in the bounded applicability review; no zero-vulnerability or penetration-test claim is made.
- The harness upgrade is durable in the canonical local repository and installed Codex surface; remote harness publication and other client installations were not performed.
- Follow-up enqueue and due time were verified; the future cron sender was not invoked early. Physical devices, branded Safari and Linux WPE video compatibility are not certified by this evidence.

### Final pre-publish evidence

- 531 tests across 34 files passed; lint had zero errors and only the two existing refresh advisories; the canonical build prerendered 26 routes.
- Exact shared built homepage SHA: `afc852b387f2fb960ca7454410418836e5a510f17aab85c08ec8179a2f1df8f3`. The complete route matrix passed 208 cases plus nine navigation/redirect supplements: Chromium 104+5, Firefox 52+2, WebKit on macOS 52+2. Expected and actual counts agree; zero reported failures.
- Both Linux and macOS ran all twelve forward/reverse pinned-state cases and all twelve reduced-motion/short-height restoration cases. Source-bound motion digest: `2ebd4767044f2a609e7db1e91eebf723f587bcafca6d724377715c8316a5c314`. Visual inspection included macOS mobile history and desktop dividend captures; independent earlier safeguards covered first-visit cookies, settled navigation and restored focus.
- Evidence is retained under `artifacts/homepage-release/ci-r14-36016492903-linux/` and `ci-r14-36016492903-macos/`. R13's redundant full suites were cancelled after a formatting-only deployment failure; they are not counted as passes.
- R14's 66-file source lock passes its positive and deliberately corrupted negative control. Approved R3 source remains SHA `46be2e145f8175399e724bbaf80bc2014a8bf6ab5ce7184b6243a5bdae9a7007`. No approved application or prototype bytes changed during the build-platform and install corrections.
- The explicitly authorized dependency audit returned 23 package findings (16 high, five moderate, two low). Bounded source review and independent review found no confirmed visitor-reachable blocker for this static release, while preserving the unresolved upgrade work. This is not a zero-vulnerability or penetration-test claim. Exact inventory, applicability, primary advisories and limits are in `artifacts/homepage-release/dependency-audit-2026-09-24.json` and `dependency-audit-triage-2026-09-24.md`.

## Rollback anchor

Before this release, `https://mindmake.co` resolved to Vercel deployment `dpl_6GzERPxBzg2wAW9xLxkPcz5x9wiF`, URL `https://mindmake-c9t3d9xgk-krish-rajas-projects.vercel.app`. This identity was inspected on 24 September 2026. Project `prj_GqamX3psD0cGpGCDXRu0ljET7zap`, team `team_iXZBozK4Ss7NHuyNk8L9wmO6`.

Backend rollback source closures were downloaded before the targeted enrichment repair to `C:/Users/krish/.scratch/mindmake-backend-rollback-20260924`. Backend and website deployments are separate and must be reported separately.

## Durable verification changes

- Actual scroll observations must identify every visible state, pinned geometry, forward and reverse traversal, and exits before and after each chapter. A screenshot, state attribute or entrance animation alone is insufficient. The validator has 24 adversarial tests.
- The homepage production adapter is generated from immutable R3 and checked for drift before each build. Changes do not overwrite the approved prototype.
- CI runs the real built browser matrix in Chromium, Firefox and WebKit, retains its evidence, and rejects unresolved owner feedback. Source-lock manifests opt into LF-canonical text hashes for Windows/Linux portability; binary assets remain byte-exact.
- The canonical harness changes are committed at `852c8f6c93c5810c6dfc12d388bb20683da993e2`, with evidence at `7444d8d199afec2963ee6ebf5973142032394afd`. Installed Codex `build-apps-with-krish` release: `v2026.09.24.2`. The fresh-session canary rejected screenshot-only proof. The previous installed release is retained for rollback. No claim is made that other AI clients have been upgraded or that the harness commits have been pushed remotely.

These are enforceable checks within the checked-in release workflow, not a claim that no future maintainer could bypass or alter that workflow.

## Verification history before publication

- The canonical build produced 26 prerendered routes. The complete serial local suite passed 519 tests across 32 files before the final five pin-lifecycle regression tests were added. The overlapping build/test run produced 17 timeouts; it was not counted as a pass. The serial rerun retained the assertions and passed.
- The Results-page real-browser hydration failure was traced to entity-escaped CSS in an HTML RAWTEXT element. Trusted repository CSS now uses raw style insertion; its genuine parsed-HTML regression verifies the full stylesheet, no recoverable hydration errors and retention of the original server heading.
- The independent review found a stale pin-index cache after reduced-motion or short-height fallback plus manual selection. The correction resets the cache when mode or selection changes; five focused lifecycle tests pass. Final rendered motion evidence must be regenerated for this change.
- Clean Linux CI passed installation, full tests, build and the twelve motion cases on the preceding candidate. Its route harness failed because readiness depended on a platform-formatted console URL. Readiness now requires an actual HTTP response followed by exact built-HTML identity verification. The rerun remains required.
- The route harness's test-only storage initialization is restricted to the intended local origin, so intentionally blocked external redirects do not run it in opaque error documents. Menu focus checks wait for observed state rather than assuming a fixed 120ms delay. Product browser errors remain unfiltered. Earlier failing receipts are retained, not relabelled as passes.
- R10 clean Linux CI passed 524 tests across 33 files, the canonical build and all twelve motion cases. Its route run failed two contact-focus observations and three WebKit readiness/navigation timeouts. Contact screenshots showed correct rendered errors and eventual focus; the harness now waits for the complete promised state. WebKit's failures were not reproduced locally and remain failed evidence until the final CI rerun. Named readiness phases and pending-request diagnostics were added without increasing timeouts or suppressing errors.
- Independent final safeguards reproduced a real intermittent Firefox menu defect: both timed focus attempts ran while the target was still hidden, and focus then remained on the document body. Publication was held for a state-driven focus correction. The initial short-wait hypothesis was therefore insufficient and is superseded by the recorded three-trial diagnosis.
- Final lint identified two explicit-any backend type annotations and two hook dependency warnings beyond the two longstanding refresh advisories. The backend corrections are type-only: independently compared emitted JavaScript is identical. The two functions were redeployed for exact source parity as submit-mindmake-brief v20 and mindmake-personal-read v25; enrichment remains v44. Lint is now a checked-in CI gate.

## Browser-platform diagnosis and gate correction

- R11 clean Linux CI passed 531 tests across 34 files, build, lint and all twelve ordered-state motion cases. The route matrix still failed four Linux WebKit cases: CaseStudies curtain release at both widths, and the third home navigation after Brain/GTM at both widths. The same cases passed Windows WebKit. Failure evidence is retained in `artifacts/homepage-release/ci-r11-36008802840/`; the platform difference is not a waiver. A four-case Linux native-versus-intercepted transport diagnostic was pushed at `f2082db170e8fe7103dc2e4713d8909f81174c3d`. Its two redundant full-suite runs were cancelled while the focused diagnostic runs; neither cancellation is a release pass. Product videos and twelve-second page limits are unchanged.
- Focused Linux evidence rejected the interception-only hypothesis: all four broad/selective transport cases failed on Playwright 1.60. The same built HTML SHA `afc852b387f2fb960ca7454410418836e5a510f17aab85c08ec8179a2f1df8f3` also failed all four cases with Playwright 1.63 / WebKit 26.6. Server probes returned promptly while main-thread heartbeats stalled near native media operations. An intervening npm installer failure and a diagnostic module-loader failure yielded no browser evidence; neither is counted as a site result. The comparison proceeds with identical Linux-built bytes on Linux and macOS and a minimal no-application media case. These diagnostics do not replace the release gate or excuse a product defect.
- Identical-artifact comparison `36013670864` with Playwright 1.60 passed CaseStudies, the full Brain/GTM/home-return sequence and the plain-media control on macOS. Linux stalled in native media operations: a `pause()` call took 10,932ms, versus 0–1ms on Mac; the plain HTML control, with no React or application styles, had a roughly ten-second event-loop gap. Supplying a verified PulseAudio endpoint in `36014294388` removed audio-connection errors but did not resolve the stall: CaseStudies still failed and native pause took 11,195ms. Audio alone is not the cause. The precise GStreamer subsystem remains unproven.
- Independent review accepted a target-platform correction, not an assertion waiver: run all 208 route cases and nine navigation/redirect supplements with Chromium/Firefox on Linux and WebKit on macOS. One Linux-built artifact is supplied to both jobs. All twelve scroll cases plus fallbacks run on both platforms; no state contract, timeout, video, or product code is weakened. Unknown or empty filter selections must fail closed. The full new matrix remains required before publication. This follows [Playwright's official guidance for Safari-like video testing](https://playwright.dev/docs/browsers#webkit). Neither Linux WPE compatibility, branded Safari nor physical iOS testing is claimed.

## Enforcement boundary

R12 preview deployment `dpl_85DaVuZY7GTjaQy5YAzc9QMCPNaU` failed closed: Vercel's default `npm install` rewrote the approved dependency lockfile before build. The approved LF-canonical SHA was `2c7f58c273698b5782b82b737646c4daf80885bd737eb5763b248ab5886be545`; the installed file was `7919957eceba11e8b6dbec336ffa82ff619d953d1194e8fb125d55f2144f54f7`. R13 pins Node to the same 22.x major used by CI and selects `npm ci` explicitly in `vercel.json`. Only root engine metadata changes in the dependency lock; dependency versions and approved application bytes are unchanged. The deployment configuration is now source-bound. Preview readiness and the complete final-head CI matrix remain mandatory.

R13 preview `dpl_3x5vHLvF57Nhm9MfrdtYccLRjD5u` confirmed Node 22 and `npm ci` preserve the dependency lock. It then failed on Vercel's formatting-only compaction of `vercel.json`: actual SHA `a1be53303da99d3dcb4ff6222c8007bcdc3a088628fe94da387293c5f372a4a1` exactly equals `JSON.stringify(approvedObject) + newline`. R14 stores that identical compact representation. No configuration value changes and the byte-hash assertion is retained, not weakened.

The build rejects drift from the approved source manifest, and the checked-in release workflow rejects failed tests, missing rendered-state proof and unresolved owner feedback. GitHub readback on 24 September found no protection rule on main and no repository ruleset. Administrative direct pushes or separate CLI promotions can therefore bypass CI; this release uses the PR gates explicitly before promotion. No claim of an impossible-to-bypass system is made, and repository-wide access policy was not silently changed.
``````
<!-- END VERBATIM project-documentation/website-redesign/RELEASE-2026-09-24.md -->


## 2026-09-24 - archive transport integrity addendum

The original raw-source hashes above remain unchanged provenance. Git may translate Markdown line endings during checkout. Stored-body verification therefore converts CRLF to LF, then checks the separate LF SHA-256 and byte count below. All twelve original source documents used LF, so these stored-LF values happen to equal their original raw values. This does not equate arbitrary byte changes with line-ending transport, nor alter immutable application/source-lock hashing. Content corruption must still fail.

| Original source | Stored LF SHA-256 | Stored LF bytes |
|---|---|---:|
| `project-documentation/homepage-redesign/BRAIN_AWARD_PANEL_R1.md` | `bac240bd2afee5583f49a497b8cdd4ac4ddb1ad328f6343af44ba8c5cc2c1322` | 4440 |
| `project-documentation/homepage-redesign/BRAIN_CONCEPT_TRACE.md` | `6859445e88a479651e736ccaafbe7528209b39428056d37f9c45e870ecd3ee05` | 9631 |
| `project-documentation/homepage-redesign/CONCEPT_TRACE.md` | `87b73e2cb4e2653cf226f905780a95dcb73a8134f67e441d6648ed53394f7d29` | 7590 |
| `project-documentation/homepage-redesign/DECISIONS.md` | `68c2a2531c663ecec6e9d06afb4071a8c578ff5440127cbb36d06838a3bf03ca` | 28910 |
| `project-documentation/homepage-redesign/GTM_CONCEPT_TRACE.md` | `5953ff3b6ca3379cf859acf15da0b7c2716da0bf7a2551a689145f6c39a48c58` | 12676 |
| `project-documentation/homepage-redesign/JUDGE_BRIEF.md` | `a91690c7f79214ab60d0b872d4dce173621979166052dff4584abdb2e15f3bd6` | 3441 |
| `project-documentation/homepage-redesign/ROUND2_JUDGE_BRIEF.md` | `9a92a49117ac81fde264c9e50fe26180ebc789a733ed16b36a76a9cff351b95c` | 3175 |
| `project-documentation/homepage-redesign/ROUND2_MISSING_TERRITORY.md` | `5f643a2967d595ae966981e54004086d4f75f067cc2c544e310de0319e75ecac` | 1556 |
| `project-documentation/homepage-redesign/SANITIZED_BRIEF.md` | `ba36e37a12bbad4edbb8edc61db42a969f3b0bad9e93af92a3202828b753a8dc` | 4598 |
| `project-documentation/homepage-redesign/STATE.md` | `8af0041152c56910277c62e4e2643ccf2823cb71ba61849c9151db20587a34b8` | 29279 |
| `project-documentation/website-redesign/STATE.md` | `b38aaffb13d1b3eb8bfbb60f27d3731cef1dca96bd9869dd88d0599306f8affe` | 325904 |
| `project-documentation/website-redesign/RELEASE-2026-09-24.md` | `699383ffdf3974aa3f36f19ba0c7738df0fe68f6be7fbd86c84a83116f6c88ca` | 16742 |

## 2026-09-24 - remaining current-document originals

The supplied consolidation fragments below are preserved verbatim after CRLF-to-LF transport normalization. Each retains its own source-path and provenance records. Their original instructions, private context, statuses and measurements are historical, not current guidance. The fragment raw hashes and stored-LF hashes distinguish the source receipt from portable archive storage.

<a id="archive-2026-09-24-parent-owned-originals"></a>
### Fragment: parent-owned-originals

Source fragment: `C:/Users/krish/.scratch/mindmake-docs-parent-archive-20260924.md`  
Raw original SHA-256: `6950497e0de8cd73dd89ec35424a00bdadf72a8d379f5a84af64954988c74ac7`  
Raw original bytes: 210673  
Stored LF SHA-256: `6950497e0de8cd73dd89ec35424a00bdadf72a8d379f5a84af64954988c74ac7`  
Stored LF bytes: 210673

<!-- BEGIN ARCHIVE FRAGMENT parent-owned-originals -->
````````````markdown
## 2026-09-24 — current-document consolidation, parent-owned originals

Preserved before correction at source commit 0d458c9. Historical snapshots, not current guidance.

### Original: NOW.md

Raw SHA-256: `4c0b8a4d0ba46c8ff19c6d99701d7a323a1757497b697f2715d78e2fdcac51b9`

<details>
<summary>Full pre-consolidation document</summary>

---
repo: krishanraja/mindmake
product: Mindmake
as_of: 2026-09-24
head: 3ee77cf
lifecycle: live
production_url: https://mindmake.co
state_doc: project-documentation/06_CURRENT_STATE.md
history_log: project-documentation/history/LOG.md
truth_files: []
authority_order: [project-documentation/00_NORTH_STAR.md, project-documentation/01_CANON.md, project-documentation/02_PUBLICATION.md, project-documentation/03_DESIGN_CONTRACT.md, project-documentation/04_PROOF.md, project-documentation/04_PROOF_RECORDS.md, project-documentation/05_LEAD_DELIVERY_SPEC.md, project-documentation/06_CURRENT_STATE.md, project-documentation/07_DEPLOYMENT.md, project-documentation/07_DEPLOY_RUNBOOK.md]
steward: https://github.com/krishanraja/control-center/blob/main/docs/steward/RUNBOOK.md
never_publish: [the private price and the internal rate card, the cash floor and the volume ceiling, the internal budget anchors, the duration of the proof and the internal month shape and hour envelope, client names outside the consented proof set, anything in 04_PROOF_RECORDS.md, the buyer archetype and its name, the private routing observation, the internal sales wedge, the method's name, availability or a start date, deployment ids, the Supabase project id, credential and secret names, the operator's mailbox address]
---
# Mindmake: where it is right now

## What it is

Every AI a leader buys already knows the market; none of them know the leader, and Mindmake builds the one that does, so the leader keeps their edge as the market moves. Mindmake is a principal-led AI and commercial strategy practice run by Krish Raja. It helps a leader use AI to extend their judgement, taste and expertise, then turn that stronger capability into a better business result. This repository is two things: the site at `mindmake.co` (React and TypeScript on Vite, every indexed route rendered to markup at build time, promoted on Vercel, with six Supabase edge functions behind the lead pipeline and the live board), and `project-documentation/`, the canon for the whole business. Every other repository Krish runs defers to that canon on prices, offers, buyers and claims.

## Who it is for and why it matters for Mindmake

This is Mindmake itself, so the buyer is the canon's buyer. `00_NORTH_STAR.md`: "A founder, principal, portfolio owner, investor or senior commercial leader who can move a decision on their own, and whose decisions are big enough that getting them right matters." Buyer groups in `01_CANON.md`: founder, CEO, CRO or whoever owns revenue, strategy leader. The gate: "The person must own, or be able to move, the decision and the business result behind it."

The pain, in the canon's words: "the leader gets faster at drafting and no better at deciding, and the gap between what they know and what their tools know keeps widening." The hinge a writer may use: "You can hand over the work. You cannot hand over the understanding." The rule for the register: "Write for ambition as much as for pressure." Never doom, never commands, never boasting.

What is sold, exactly as canon locks it:

- Two public doors. **Build your AI brain**: "Encode your taste and judgement, amplify your strengths, uncover your blind spots." **Build your AI GTM**: "Create an AI-native GTM model across product, price, positioning or people." Either can be the way in; either can lead to the other.
- One paid proof behind both: "pick one decision or capability, build a working first version, use it on real work, leave something behind that keeps running." "The price is private, the length is agreed with it and neither appears on the site." The only primary action on the site is **Start here**.
- The payoff word is edge; judgement is the mechanism. The one approved public form of the private pillar is "Nobody in your organisation needs to know where you started."
- CTRL is the product and proof layer, "never a third thing to buy, never linked, never priced."

Copy-grade definition, safe to quote: "an AI brain is a working system that holds your taste, judgement, standards, memory and trusted context, and uses them on your real work." Everything in `never_publish` above stays out of any piece, whatever the source.

## Where it is right now (as of 2026-09-24)

The owner-approved R3 homepage and locked companion surfaces are live from
`3ee77cf`, PR #170, at Vercel deployment `dpl_EZigNAi6Uc6Apcq75XsFnHETt5W8`.
Keep the approved copy, composition and imagery; the requested delta is reversible
native scroll pinning for four historical stories and five leadership-dividend
stages. Reduced-motion and short-height layouts retain direct natural-flow controls.

The live backend repair is deployed and independently source-verified: enrichment
v44, brief v20, personal-read v25. Real company/alias reads, verification and results
emails, operator delivery, persistence and a single follow-up queue were checked.
The new frontend's real company-first journey also passed through verification,
visitor/operator INBOX delivery and the actual success-screen brief download.
Exact canary identities, synthetic cleanup and earlier backend evidence are
separated in the release record; no future follow-up sender was invoked.

The release passed 531 tests, 208 route cases, nine navigation supplements and
the complete motion/fallback matrix. The release workflow locks the approved source, validates actual visible scroll
states and exits in three engines, checks every indexed route, and runs lint,
unit tests and the production build. Failed candidates are retained as evidence,
not relabelled as passes. The Firefox focus defect and source-lock test weakness
found during release were corrected before promotion.

The release-only exception approved by Krish covers physical iPhone VoiceOver and
Android TalkBack. Neither has been performed. Exact release/rollback identity,
current gates and proof: `project-documentation/website-redesign/RELEASE-2026-09-24.md`.
The resumable accepted-design record is `project-documentation/website-redesign/STATE.md`.

The canonical ai-harness upgrade is committed and installed in this Codex client
as `v2026.09.24.2`; its fresh-session canary rejected screenshot-only motion proof.
No claim is made that the harness commits were pushed or other clients upgraded.

## Historical baseline (recorded 2026-09-17)

- **Live** at `mindmake.co`. The rebuild was promoted on 28 August 2026; the latest promotion is the edge rewrite of 5 September 2026 (pull request #154), verified live with one synthetic end-to-end lead. Production identifiers, function versions and the rollback target: `project-documentation/06_CURRENT_STATE.md`, "Where the rebuild stands" and "Lead and data backend".
- **A new public surface, `/answers`**, shipped 8 September 2026 (#160 to #164): one page per buyer question, machine-first, separate from the blog. The sitemap and prerender now cover 26 indexed routes, up from 21; `project-documentation/06_CURRENT_STATE.md`'s route count is dated 5 September and predates this.
- **Four code commits past the recorded promotion**, all 7 September: Krish's revision of the thirty-three testimonials, the excerpts cut again to exact substrings, the story deck reading its quotes from the testimonials file, and one story swapped to fit its quote (#156, #157). A merge to `main` promotes production, and no readback of these is recorded in the state doc.
- **Baselines** (5 September): 450 tests across 29 files, 0 lint errors and 2 warnings, 0 type errors, every browser gate green at 1440 and 390, `qa:alive` included. What each gate measures: `CLAUDE.md`, "Required checks".
- **Owed** (open items 1 to 9 in the state doc): the branded mailboxes (`mindmake.co` has no MX record, so contact links read one constant pointing at the mailbox that receives), credential rotation, retiring `get-model-data`, repointing the old CTRL host, and the `themindmaker.ai` Resend domain's failed verification.
- **Waiting on evidence**: the first day-14 follow-up can send on 11 September 2026; the queue was empty when the notice went live.
- **Docs steward** adopted 7 September 2026: this file, `project-documentation/history/LOG.md`, and `.github/workflows/docs-steward.yml`. The state doc went from 2,363 lines to 125 by moving its dated journal into the LOG.

## What changed recently

- 2026-09-17 **Film libraries organised by release month** (`6af2005`, pull request #169). The six live films moved from `src/assets/films/` into `src/assets/films/aug2026/` without changing bytes, so a later shoot does not have to share a folder with the one on site. A sealed September library of six loops landed alongside it in `src/assets/films/sep2026/`, with its own selection guidance, and is not live: nothing on the site imports it yet. `CLAUDE.md` and `README.md` were updated in the same commit.
- 2026-09-08 **The answer surface, built to be quoted** (#160 to #164). "`/answers` and `/answers/:slug`, server rendered so an assistant fetching a page finds the argument rather than a shell." Deliberately not the blog: those posts are curated and calmer, these "answer one buyer question each and take a position." One format module is shared by the site, the sitemap, `llms.txt`, the social plates and the prerender, so dropping a markdown file into `src/content/answers/` is the whole publishing step. Four questions shipped the same day: a revenue model for AI products in publishing, an AI centre of excellence with no engineering budget, what adtech competes on once AI can build the targeting model, and an AI decision tool for a trustworthy leadership team. A same-day follow-up (#164) repaired all four files after the generator glued the closing front-matter fence to the first line of prose and wrote a timestamp where the loader requires a date, and fixed the generator itself.
- 2026-09-08 **The cross-repo canon reaches this repository** (#158, #159, #166, #167). `AGENTS.md` now carries the krish-canon block rendered from `krishanraja/ai-harness`, marker-delimited with its own sha256 so drift is "arithmetic rather than judgement." Before this, the canon "was well governed and had never reached a product repository: this repo referenced it zero times." The block is the harness steward's territory, never the docs steward's. A same-day fix corrected AGENTS.md's own header, which had claimed NOW.md is reconciled on every push to `main`: "the push half was never true... the steward has failed on every push since it shipped." The push trigger now validates only; the nightly run reconciles.
- 2026-09-07 **The thirty-three, revised** (`20ef51f`, then `ad345f4`, `eb06329`, `218dc14`; #156, #157). Krish "revised the thirty-three to what people actually wrote and declared the file canon. Ten excerpts stopped being substrings of the quotes they came from: two by a capital letter, eight because the excerpt had been rewritten to say what the new quote meant, and one ran past the cap." The test caught all ten and every excerpt was cut again from the revised text. Then the story deck: "Each client story carried its own copy of the quote, and the copies had drifted from what the person wrote," so a story now names its voice and reads the quote from `src/data/testimonials.ts` at import, and one story was swapped because "the revised quote is about value landing on day one, compounding after, and nobody loitering." The control-center audit that flagged the broken rule the same morning is answered by these commits.
- 2026-09-05 **The edge rewrite** (#154, recorded in `c0ec3ca`). Why, from the commit: the site "read as a busy leader would did not say it: a belief for a hero, philosophy before the offer, the same compounding argument four times across the door pages, no client proof on either door, a form before any reason to fill it, and 'thirty days' as the most repeated phrase on the site." Every duration promise left public copy; the north star and canon were sharpened the same day; `send-follow-ups` v5 and `submit-mindmake-brief` v16 deployed with the same edit.
- 2026-09-04 **The privacy strip** (`96bf37e`). Photographed on an Android phone "floating above the bottom of the screen with the page showing underneath, its one sentence over two lines, its button reading GOT / IT. Three causes, all reproducible at every phone width, none of them measured by anything." New gate `qa:chrome`; two earlier versions of it missed the inflated row, and the record says why.
- 2026-09-04 **What a crawler and a share card are given** (`0704583`). "Every page shared one social plate drawn for a brand two rebuilds ago." Now one plate per page and post, 21 in all, "painted by a browser and committed, because the deploy has no browser."
- 2026-09-04 **The wordmark and the mark are vectors** (`fd8c07e`). The designer's export was "a megabyte of raster inside a vector"; both are 2.5KB paths now. Found on the way out: the poster preload "had never been emitted, on production or anywhere, because React writes srcSet and the pattern was written for srcset."
- 2026-09-04 **The curtain was never there** (`cf2b2d0`). The entrance's root marker shared the strips' class name: "Production painted at 1.75s with nothing over it, and every 'curtain' reading recorded on 3 September was of that." The gate now counts the frames on which the curtain was displayed.
- 2026-09-03 **The page arrives once, and the story gets a spine** (`12ace5e`). Measured against production on a throttled phone, "the first screen changed seven times in two seconds." Metric-matched font fallbacks, parallax relative to the driver's first write, a curtain, and a homepage running order with the hours and the hinge on paper.
- 2026-09-02 **The board becomes a departures board** (`d96fc2b`, `bcd18f3`). `get-ai-news` v69 passes two new fields through, then the cache was read directly: "every retained day reports 0 with affects and 0 with stance," and "from the outside a null field and an absent field look the same." The `pov` line came off: 25 of 29 were commands to the reader and 9 carried American spellings.
- 2026-09-02 **The why, published** (`f7f6889`). "The canon already carried the whole argument and none of it was published." `/new-age-leadership` was an orphan: prerendered, in the sitemap, linked from nowhere, in no gate's page list.
- 2026-09-02 **The design says it** (`41d4f27`) and **the declarations that could never win** (`e252a08`). 508 rendered words cut across three pages after the corpus was pulled out block by block. A margin reset at specificity (0,1,1) meant "Not 'wins on order': cannot lose," and 17 component declarations had no effect; the new `qa:deadcss` gate's own two bugs "made it pass a tree written to fail it."
- 2026-09-01 **Dose the questions** (`c320dbb`) and **split what does several jobs** (`2bc91f5`). "The density figures in the plan were wrong." The questions drum clipped 2,308px of answers with scripting off; the reference "does not do what the rule said"; `qa:nojs` and `qa:screens` are new; `Start here` forks at the button.
- 2026-08-30 **Render the pages instead of imitating them** (`e2bdf63`, `534f981`, `e1d0389`). "Every prerendered page was failing to hydrate." Four of the homepage's seven phone screens were frozen while being read and passed `qa:alive`, because "one instrument mark ticking certified a static screen of text." The gate was also flaky: "Three runs of the same unchanged viewport read 0.125, 1.611 and 1.474."
- 2026-08-29 **Lift the ban on entrance choreography** (`b7e28fd`): "Krish ruled to lift it, having asked three times for builds that arrive as you read." **Every dead end ends in a person** (`172ff39`): "She is a lead we asked to leave." **The lead dialog back its shape** (`8197634`): it had been "rendering full-bleed, unpadded and unscrollable on the live site since, on the one surface every lead passes through." **Fourteen real domains** (`573b19e`): fixtures "I had written myself, which is the same as marking your own homework." **Proposal back on screen** (`1767232`): "a written promise could vanish for a whole commit without anything objecting."
- 2026-08-28 **The rebuild, live** (#152, #153): homepage and both doors rebuilt, six films installed, documentation consolidated into one numbered order led by a new north star, one name for the business.
- 2026-08-27 **Cleanse** (#149, #150, #151): around 50MB of unreferenced media and 26 dependencies gone, twenty-five superseded documents deleted, the 24-hour stability gate closed.
- 2026-08-26 **Launch** (#141): `mindmake.co` went live.

The pattern is worth naming: 111 commits in fourteen days, 87 by Claude, and every deployment is followed by a docs-only "Record the ..." commit (eleven of them since 28 August) that writes what was actually proven live into the state doc. That habit is what makes the state doc trustworthy, and the steward keeps it rather than replacing it.

## What is next and what is waiting on Krish

- Preserve the released R3 and locked companion surfaces. PR #170, public deployment and the actual new frontend lead-to-download journey passed. Future changes must keep the source lock, rendered motion gates and explicit decision record; do not ask Krish to approve the accepted design again.
- Resolve the recorded dependency upgrade debt in a separate compatibility-tested change. The 23 advisory entries were assessed for this static release; they were not erased or labelled a clean audit.
- Complete the two physical assistive-technology checks recorded as outstanding under the explicit release-only exception. Do not represent browser emulation as that evidence.
- Older requests for method wording or prototype selection below do not reopen the subsequently approved R3 and locked Brain/GTM surfaces. Any future material change needs its own scoped decision.
- Waiting on Krish (canon, "Open commercial work"): the evidence trail for a "leaders helped" figure; one Brain-shaped and one GTM-shaped story with consent; current-source research before any new AI GTM market claim; the pricing revisit trigger.
- Waiting on CTRL: `affects` and `stance` in the headline cache, and a `pov` line in a voice this site can publish. Nothing on this side is waiting.
- The historical open-item register in the state doc is dated evidence, not a current claim that a follow-up is still waiting for 11 September. This release verifies enqueue and due time without invoking the cron sender early.

## Read next

1. `project-documentation/00_NORTH_STAR.md`: why the business exists, what it believes, who it is for, the aesthetic, the voice, the naming law. It outranks everything.
2. `project-documentation/01_CANON.md`: the commercial truth: the two doors, the buyer, the offer, private pricing, the conversion path, the answers, what is not sold. Outranks everything but the north star.
3. `project-documentation/02_PUBLICATION.md`: the publication's two channels, The Money of AI and Built with AI: mandate, register, formats, gates.
4. `project-documentation/03_DESIGN_CONTRACT.md`: binding design and motion rules, and the acceptance checklist.
5. `project-documentation/04_PROOF.md`: what may be claimed: approved attendee brands, client outcomes, consent-gated quotes, named references.
6. `project-documentation/04_PROOF_RECORDS.md`: internal engagement records behind the public proof. Never public copy.
7. `project-documentation/05_LEAD_DELIVERY_SPEC.md`: exactly what a lead receives, when, and what happens when a step fails.
8. `project-documentation/06_CURRENT_STATE.md`: what is live right now, at which identifiers, with the verification baselines and the open items.
9. `project-documentation/07_DEPLOYMENT.md`: how the site, domains, backend and email identity are deployed and rolled back.
10. `project-documentation/07_DEPLOY_RUNBOOK.md`: what the rebuild deployed, how it was verified, and the ordered launch steps.
11. `CLAUDE.md`: the contributor guard: the naming law, the commercial contract, what not to reintroduce, the active structure and every gate.
12. `README.md`: the repository from the outside: routes, code surfaces, rules enforced by test, the release boundary.

## Do not trust

- `project-documentation/history/LOG.md` for anything about today. It is history, moved out of the state doc on 2026-09-07. `project-documentation/06_CURRENT_STATE.md` is the only current-state truth; a figure in the LOG is a reading on its date.
- The control-center Content Engine audit of 2026-09-07 on this repo's testimonials (ten excerpts not substrings, the test failing): true at `20ef51f`, resolved by `ad345f4` to `218dc14` the same day. `src/data/testimonials.ts` is canon by Krish's declaration.
- `_corpus/mindmake-collaboration-method-observations.md`: internal working notes captured 23 August 2026, before the rebuild; its own header says it is not a public offer or a finished method. Not part of the read order and not a current-state claim.

</details>

### Original: README.md

Raw SHA-256: `506f64acdb1294803090c2cebe38159fe8cac6b891e4f2265e727f05d65c2469`

<details>
<summary>Full pre-consolidation document</summary>

# Mindmake website

**Every AI you buy knows the market. Yours should also know you.**

Mindmake is a principal-led AI and commercial strategy practice. It helps a
leader use AI to extend their judgement, taste and expertise, then turn that
stronger capability into a better business result.

The site runs at [`mindmake.co`](https://mindmake.co) with two doors. What is
deployed there right now is recorded in
[`project-documentation/06_CURRENT_STATE.md`](project-documentation/06_CURRENT_STATE.md),
which is the only place that answers it.

- **Build your AI brain**: encode your taste and judgement, amplify your
  strengths, uncover your blind spots.
- **Build your AI GTM**: create an AI-native GTM model across product, price,
  positioning or people.

Either door can lead to the other. Work begins with one paid proof: the price
is private, the length is agreed with it, and neither appears on the site. There
is no public diary.

## Start here

If you are a person or a model picking this up cold, read
[`project-documentation/00_NORTH_STAR.md`](project-documentation/00_NORTH_STAR.md)
first. It is written to leave you able to make a decision on the business's
behalf. Then follow the reading order in
[`project-documentation/README.md`](project-documentation/README.md).

Where anything in this repository disagrees with the north star or the canon,
those two are right.

## One name

The business is **Mindmake**. The product is **CTRL**. The publication runs
exactly two channels, **The Money of AI** and **Built with AI**. Nothing else is
a name. The full rule is the naming law in the north star.

## Public journey

The only primary action is `Start here`.

1. The visitor starts with their work email, then gives their first name, last
   name and part of the business. The company is read from the email domain.
   The approved Company, You, Problem, Time and Brief stages use the same
   `LeadBrief` component from either door.
2. Mindmake shows a declarative company read and, when the read is strong enough,
   pressure choices tailored to that company. "Something else" reveals the locked
   list.
3. They choose where better use of their time would create value.
4. Mindmake shows the recommendation: what AI can carry, what stays with the
   leader, and what a first proof could test.
5. The visitor can keep the brief by verified work email, and receives the
   branded proposal on screen, by email and as a self-contained attachment. A
   private fit digest reaches the operator.
6. The visitor can always download the brief locally, whether or not either email
   succeeds.

A converting visitor receives exactly two emails after confirming: their results,
and one follow-up fourteen days later. Asking for the brief sends one six-digit
code before that, which the privacy page names. Publication interest is separate
and unticked. The
full contract is in
[`project-documentation/05_LEAD_DELIVERY_SPEC.md`](project-documentation/05_LEAD_DELIVERY_SPEC.md).

## Routes

| Route | Purpose |
|---|---|
| `/` | Approved R3 opening, historical stories, work and organisation, leadership dividend, AI Brain/AI GTM routes, and footer |
| `/ai-brain` | Locked judgement-and-memory instrument and the shared Start here journey |
| `/ai-gtm` | Locked market-change instrument across product, price, positioning and people, with the shared Start here journey |
| `/case-studies` | Eight verified customer stories |
| `/blog`, `/blog/:slug` | Checked public ideas archive |
| `/answers`, `/answers/:slug` | One page per buyer question, written to be quoted: the liftable answer first, then the argument |
| `/faq` | Practical answers about fit, work and what the client keeps |
| `/new-age-leadership` | Worked people-and-agent org chart example |
| `/contact` | General messages |
| `/privacy`, `/terms` | Current website policies |
| `/alumni` | Unlisted, noindex page for past clients |

Retired offer URLs remain as one-hop compatibility redirects. `/library`
redirects to `/blog`. `/signal` and `/builder-economy` redirect to the
publication.

## Code surfaces

- `src/App.tsx`: active routes and retired-route fallbacks.
- `src/pages/`: public page compositions.
- `src/components/homepage-release/`: deterministic delivery adapter for the
  immutable approved R3. `scripts/qa/build-homepage-release.mjs` owns its generated
  files; `pinnedChapters.ts` owns native reversible scroll progression. Do not
  replace this surface with a reconstruction from older components.
- `src/components/mindmake/`: the shell, the film plate, the marquee, the live
  board, the two journeys, the fork, the ask bar, the brief and the proposal.
- `src/hooks/useScrollDriver.ts` and `src/hooks/useReveal.ts`: retained primitives
  for their existing surfaces. The explicitly approved R3 adapter has its own
  isolated lifecycle and native pin controller, verified by rendered-state tests.
- `src/hooks/useAmbientMotion.ts`: decides whether a visitor is served moving
  footage at all.
- `src/styles/`: `mindmake.css` (tokens, base, chrome), `mindmake-instruments.css`
  (every rebuilt component), `mindmake-brief.css` (the brief dialog and proposal).
- `src/assets/films/aug2026/`: the six live films, each with both formats and a
  poster taken from its own first frame. Later review libraries live in sibling
  month folders and are not live until a page imports them.
- `src/data/rebuildProof.ts`: proof data. `src/content/answers.json`: the live
  public answers.
- `src/content/answers/*.md`: the `/answers` surface, one markdown file per
  question, read by `src/lib/answers.ts` for the site and by
  `scripts/lib/answers-loader.mjs` for the crawler surfaces. Separate from the
  blog archive in `src/data/blogPosts.ts` on purpose, and neither reads the
  other.
- `supabase/functions/`: the six functions the site owns.
- `scripts/generate-sitemap.mjs`, `scripts/generate-llms.mjs`,
  `scripts/prerender.mjs`: crawler surfaces.

## Baseline rules and approved release precedence

These general rules predate the accepted R3 composition. Its exact labels,
typography and choreography are protected by the release source manifest and
must not be removed by interpreting a historical blanket rule as a redesign
instruction. See `AGENTS.md` and the current release record before changing it.

- No first person, no biography, no portrait. The founder is named once.
- No eyebrow text above any heading, anywhere.
- No em dashes. British English. No "judgment".
- No banned vocabulary, and no "not X, but Y" antithesis.
- Entrance choreography only through `src/hooks/useReveal.ts` (the ban was lifted
  on 29 August 2026), and the page is whole if the reveal never fires.
- Every viewport-height of every page holds at least one moving element, unless
  the visitor asked for reduced motion, in which case the whole ambient layer
  stops and the stills stand in.
- Attendee brands are never called customers, and proof families never mix.
- The contact address is declared once, in `src/lib/publicLinks.ts`, and it is the
  one that actually receives mail.
- Exactly two emails can ever be sent to one address after it is confirmed, plus
  the one verification code that confirms it.

## Development

Node 22.18 or later.

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```

Copy `.env.example` to a private local environment file when a browser check
needs the public Supabase URL and publishable key. Never commit environment
values. `scripts/qa/README.md` has the pattern.

`npm run build` creates the production bundle, sitemap, crawler text and
prerendered HTML for every indexed route. It fails when the sitemap and prerender
route sets differ.

## Release boundary

A merge to `main` builds and promotes production on Vercel. Follow the acceptance
checklist in
[`project-documentation/03_DESIGN_CONTRACT.md`](project-documentation/03_DESIGN_CONTRACT.md)
before merging, and
[`project-documentation/07_DEPLOY_RUNBOOK.md`](project-documentation/07_DEPLOY_RUNBOOK.md)
for the ordered launch steps. Do not change live Supabase, send real email from
new code paths, alter domains or delete deployed functions without the matching
verification.

The 24 September release additionally requires the immutable source lock,
deterministic adapter check, full unit suite, lint, the twelve actual scroll
cases, the complete built-route browser matrix and live lead-delivery evidence.
See `project-documentation/website-redesign/RELEASE-2026-09-24.md` for exact
receipts, rollback identity and the owner's release-only physical VoiceOver /
TalkBack exception. A screenshot or successful build alone does not pass release.

</details>

### Original: CLAUDE.md

Raw SHA-256: `89edb9db50232f8c3c7a48e5f8e45b734e5e6b775951fa6b5147383e07451ebb`

<details>
<summary>Full pre-consolidation document</summary>

# Mindmake repository guide

Last updated: 24 September 2026.

This file is a contributor guard, not the source of truth. The source of truth
is `project-documentation/`, and it is read in order: `00_NORTH_STAR.md` first,
then `01_CANON.md`. Where this file, a code comment, or anything else disagrees
with those two, those two are right.

Read [`AGENTS.md`](./AGENTS.md) alongside it: it points at `NOW.md` for current state and carries the cross-repository Krish canon on approval, verification, secrets and destructive actions. `project-documentation/` still outranks both on anything about this business.

Before changing a public page, read `00_NORTH_STAR.md`, `01_CANON.md`,
`03_DESIGN_CONTRACT.md`, `04_PROOF.md` and `06_CURRENT_STATE.md`.

## Homepage recovery handoff

Before rebuilding or presenting the homepage, read
`project-documentation/website-redesign/STATE.md` and
`quality/website-redesign/homepage-handoff.v1.json`, then run
`npm run qa:homepage-handoff`. The handoff freezes every recovered component,
selection and copy decision. R1 is rejected. R2 is a fidelity reference, not a
production candidate. R3 was subsequently approved for production delivery with
two bounded scroll-build corrections. The current authority and release evidence
are recorded in STATE.md and `project-documentation/website-redesign/RELEASE-2026-09-24.md`.
Use the deterministic R3 adapter, not another reconstruction. Future material
candidates still require the repository's gated material-review command; the
dated approval is not permission to reinterpret accepted decisions.

## The naming law

Mindmake is the only name for the business. CTRL is the product. The publication
runs exactly two channels, **The Money of AI** and **Built with AI**. Mindmaker
LLC is the registered legal entity and appears only in the privacy notice and the
terms. `themindmaker.ai` and `mindmakerlive.substack.com` are infrastructure
addresses, never names. Anything else that looks like a brand name in this
repository is dead: delete it rather than working around it.

## Current commercial contract

- The outward-facing brand is Mindmake. The site speaks as "we" and "mind/make", never in one person's name.
- Mindmake builds systems that hold a leader's judgement and belong to the client afterwards. The enemy is the oracle (a consultant selling an answer the leader could have reached alone) and the mirror (AI that takes a leader's thinking and hands it back unchanged). "Instruments, not oracles" is internal design language, never site copy.
- The two public doors are `Build your AI brain` and `Build your AI GTM`. The four GTM levers are product, price, positioning and people. A client can start with either and cross to the other.
- Both lead into one paid proof. The price is private and so is the length: from 5 September 2026 no duration appears in public copy, only the week-one promise. The payoff word is edge, the thing the leader keeps; judgement stays as the mechanism. The site says what the work answers, in order: where you stand, what is coming, what to do first. The private pillar's one approved public form is "Nobody in your organisation needs to know where you started"; the buyer archetype behind it stays internal.
- CTRL is Mindmake's product and proof layer, not a third offer. It is named on `/ai-brain` only, never linked, never priced. Its four live captures appear on that page and nowhere else.
- There is no public diary link or `Book a fit call` CTA. One way in per screen: `Start here` on the door pages, and on the homepage the two doors by name, adjacent and in one control group. Each door carries its own four pressure questions, and every `Start here` used to pass none, so a visitor starting on the homepage got a generic set belonging to neither. Opened without a door, the dialog asks which before the four details.
- The private email hand-off is live: four details (first name, last name, work email, division), declarative read with tailored server-signed pressure choices, one easy question, verified work email, then the branded proposal on screen, by email and as an attached document, with a private fit digest to the operator. On screen the proposal wears the step's own surface; paper is for the email and the attachment. `src/test/proposal-on-screen.test.tsx` holds it there, because it was once removed for a whole commit without a gate objecting.
- The browser may send only the visitor's first and last name, their work email, the company domain derived from it, allowlisted choice identifiers (the division and the read's two answers) and the server-signed tailored-choice pair. Company research, tailored choices, recommendation assembly, verification codes, visitor delivery and the operator's fit digest are server-owned.
- Every read carries the honesty framing: an illustrative example of how the Mindmake brain reads a business from the outside, not advice, written as a statement that never asks the visitor anything.
- A converting visitor receives exactly two emails, ever: the results email, and one follow-up fourteen days later. No drip, no newsletter from this site. The publication is a separate opt-in.
- `/ai-gtm` and the homepage both carry the live daily board fed by the public `get-ai-news` function, as rows on a departures board filtered by the reader's own division. Everything on it is public and nothing is gated. Daily freshness with a visible timestamp is a standing commitment, and staleness is labelled rather than hidden. The cache's `pov` line is not printed while it is written as a command to the reader in American English; see the feed's voice in the design contract.
- The publication is a separate opt-in with exactly two channels, described in `project-documentation/02_PUBLICATION.md`.

## Do not reintroduce

- The Teardown, The Handover, the 21-day Sprint or any earlier offer ladder.
- Public prices, discounts or currency switching.
- A public Calendly or direct diary path.
- A chatbot or simulated AI answer that makes the practice look automated. The company read is served research presented honestly, never a conversation.
- Attendee brands described as clients. Offer labels on case studies.
- The removed private amount or the removed 22 percent result.
- An uncapped Steph quote. Missing or failed consent data must hide it.
- A public count of leaders helped, until the lock's evidence trail is compiled and approved.
- Em dashes, American spellings such as `judgment`, or unexplained business and technical terms in public copy.
- Doom, fear or failure framing about the reader's business. Commands to the reader. Boasting about what we are about to do. Cryptic headings that need the paragraph below them to decode. The voice is a helpful expert explaining something clearly, and a twelve-year-old should follow every sentence.
- Eyebrows. No small pre-heading above a hero or a section title, under any class name and in any case. A small label may remain only where it names an object, a control, a value or an axis.
- The operator's personal name in the site's voice. Founder-led, practice voice (28 August 2026): he appears in the founder section at the foot of the homepage, in the framing of the proof, and inside verbatim quotes. Everywhere else there is no first person, no biography, no portrait and no "why him" argument standing in for evidence. Quotes are never edited, for spelling or anything else, and a shortened quote is an exact substring. The four CTRL captures keep their account chrome, and they are images.
- The retired journey engine: stepped scroll journeys, numbered step rails, the Capture / Encode / Amplify / Uncover / Keep ladder, hand-drawn scroll marks, and "Not an agency. Not a coach." The stage photograph came back on 28 August 2026 with the founder section and belongs there, cropped to him; it is not a hero and appears nowhere else.
- Scroll-progress bars, whatever they are filling. Entrance choreography was banned here until 29 August 2026 and is now sanctioned through `src/hooks/useReveal.ts` alone: see the motion law in the design contract for the guarantees that came with the lift, all of which reduce to the content being readable if the reveal never fires.

## Active structure

- `project-documentation/`: the whole source of truth, read in numbered order. `README.md` there is the index.
- `src/hooks/useAmbientMotion.ts`: whether a visitor is served moving footage at all.
- `src/assets/films/aug2026/`: the six live films, both formats each, posters taken from frame one. Later film libraries live in sibling month folders and are not live until a page imports them.
- `src/App.tsx`: public route contract and retired-route fallbacks.
- `src/pages/Index.tsx`: homepage. `src/pages/AiBrain.tsx` and `src/pages/AiGtm.tsx`: the two doors. `src/pages/CaseStudies.tsx`: approved proof archive. `src/pages/NewAgeLeadership.tsx`: the argument page, the one page whose job is the why rather than the brief. It was an orphan on the old Tailwind vocabulary for months, in the sitemap and linked from nowhere; it is on `mm-*` now, linked once from the homepage, and in every gate's page list. Its copy lives in `src/content/reflex.ts`, one line per beat, and its history is dated and corrected (Thamus, not Socrates; Hembree and Dessart, 1986; Juma on who gains and who loses).
- `src/components/mindmake/HumanHandoff.tsx` with `src/content/handoff.ts`: the offer of a person at the end of each of the nine dead ends. `05_LEAD_DELIVERY_SPEC.md` lists them and the two paths that deliberately have none.
- `src/components/CookieConsent.tsx` and `src/components/mindmake/MobileActionBar.tsx`: the two pieces of fixed chrome, and the only public surfaces that float over the reading. Each measures its own height into `--mm-cookie-reserve` and `--mm-bar-reserve`; the footer adds both, and the bar stacks on the strip by reading the strip's. No stylesheet carries a copy of either height. **The strip is the one public surface rendered outside `.mm-site`**, so the scaffold's bare element rules in `src/index.css` (`p { font-size: 16px }`, `h1..h6`, `small`) reach it and a bare element rule beats inheritance at any specificity: everything inside it declares its own type. `npm run qa:chrome` is the gate.
- `src/components/mindmake/`: the public design and conversion system, including the film plate, the marquee, the ask bar, the questions section (`ObjectionChips`, which is a stack and not a drum since 1 September 2026), the live board (`LiveBoard`, `BoardFilters` and `FlapRow`, the split-flap row whose true characters are always in the markup), the shared details capture (`DetailsJourney`, used by both `BrainJourney` and `GtmJourney`), and the lead journey (`LeadBrief`, `MindmakeProposal`, `proposalContent`, `privateBriefHtml`, `leadDelivery`, `companyRead`). Also `OneAtATime`, the stack where one row is open: a real `<details>` group, so the accordion runs with no script and every answer is in the markup, which is what the drum it replaced was not. Also `ReflexDeck`, four dated objections as a deck you flick, and `ConvergeFigure`, fifteen strips becoming one, both on the argument page. Also `StoryIndex`, the card index: eight client stories as a deck you flick, driven by `useDragDrum` through its `write` option, which lands the offset on a custom property so CSS can put every card in one grid cell, and its `span` option, because a deck's travel is every card but the first and not a rail's `count * pitch - viewport`, which goes negative on a laptop and clamps the whole thing to a standstill. Also `Build`, the group that assembles with scroll position rather than arriving once; it is what took `qa:alive` green and `Arrive` cannot replace it. Also `ProcessTrack` and `LeverPanel`, the two scrubbed section builds; `ClimbLadder` and `ForkBand` were deleted on 5 September 2026 because they made the argument the homepage and `/new-age-leadership` already make. Also `Instrument` (the six-mark set), `ProofDrum` with `useDragDrum` (the 33 voices), `StoryFigure` (the five proof diagrams), `FounderNote`, `SubscribeBand`, `MindmakeBrand`, `MobileChapter` and `MobileActionBar`.
- `src/data/testimonials.ts`: all 33 quotes, verbatim, each with a one-line excerpt that is an exact substring. Deliberately outside the copy gates, because the house style governs our voice and not what other people wrote; `src/test/testimonials.test.ts` enforces the rule that does apply.
- `src/hooks/useShortScreen.ts`: whether a screen is too short to spend on a long list. Every gate here measures at 1440x900 and 390x844, and `qa:screens`' shortest phone is 360x800; a 360x640 Android, a 320x568 handset and any phone held sideways are all shorter, and a section's budget is a ratio, so only the denominator has to move for the same markup to go over. The board's row count reads the height, not the width.
- `src/content/answers/*.md` with `src/lib/answerFormat.ts`, `src/lib/answers.ts`, `src/pages/Answers.tsx` and `src/pages/Answer.tsx`: the answer surface at `/answers` and `/answers/:slug`. One page per question a buyer asks, machine-first: the liftable answer renders before any preamble, because an assistant fetching the page reads the first chunk and stops, then the argument, then the FAQ as real headed sections, with `Article` and `FAQPage` in one JSON-LD graph. **It is not the blog.** `src/data/blogPosts.ts` and `/blog` are the curated editorial archive with categories, reading times and a featured post, in a calmer register; these are written to be quoted. The two share the design system and no data, in either direction. Publishing is dropping a markdown file into the directory: `import.meta.glob` reads it for the site and `scripts/lib/answers-loader.mjs` compiles the same parser for the sitemap, `llms.txt`, the social plates and the prerender, so there is no manifest to keep in step. A file whose front matter is short of a field fails the build rather than publishing half a page.
- `src/hooks/useScrollDriver.ts`: the one scroll primitive. `src/lib/analytics.ts`: the site's event wrapper. `src/lib/askCorpus.ts` and `src/content/answers.json`: the curated answer corpus behind the ask bar and `/faq`.
- `src/styles/mindmake.css` (tokens, base, chrome, secondary pages) and `src/styles/mindmake-instruments.css` (the instrument components). `src/styles/mindmake-brief.css` holds the lead dialog's structure and then its tone arc, in that order, in the file the component imports itself. It is one file for a reason: the structure used to live in `mindmake.css`, a rewrite of that file deleted all of it, and the dialog kept its colours while losing its shape.
- `src/data/rebuildProof.ts`: proof data used by the rebuild.
- `supabase/functions/` with `_shared/`: the live edge functions.
- `src/entry-server.tsx` with `src/main.tsx`: the two ends of the static render. Every indexed route is rendered to real markup at build time and the browser hydrates it, so first paint is the page rather than a likeness of it. The two files describe one tree and `src/test/ssg-hydration.test.tsx` holds them to it: a wrapper in one and not the other is a hydration failure, and a hydration failure throws the whole server render away.
- `src/hooks/useReveal.ts` with `src/components/mindmake/Arrive.tsx`: the one entrance primitive and the wrapper that staggers a group with it.
- The entrance, from 3 September 2026: the inline script and the curtain strips in `index.html`, the entrance rules at the foot of `src/styles/mindmake.css`, the `.mm-first` class on every hero's copy column and the homepage's problem section, the four fallback faces at the top of `mindmake.css`, and the font and poster preloads `scripts/prerender.mjs` reads out of the built output. The mark and the wordmark are `src/assets/mindmake-mark.svg` and `src/assets/mindmake-wordmark.svg`, the designer's September 2026 exports rebuilt as paths, written into the page by `MindmakeBrand` with gradient ids of their own per instance; there is no brand image to fetch and nothing to preload. `useScrollDriver` writes `--mm-p0` with its first `--mm-p` and marks `data-mm-settling` for 400ms; `FilmPlate` mounts a loop only when `near` and fades it up on `playing`. The design contract's "The entrance: the page arrives once" carries the guarantees; `var CURTAIN` in the head script is the one switch. The root marker is `mm-covered` and the strips are `.mm-curtain`, two names on purpose.
- The homepage's running order, from 5 September 2026: hero, the two doors as their own fork section, the three things the work answers (paper, `THREE_THINGS` in `src/content/reflex.ts`, closed by the private line), the marquee, proof, voices (client families only), the board, the founder, the questions, the publication, the close. The hours and the hinge live on `/new-age-leadership` alone. The section on where everything a leader teaches AI ends up lives on `/new-age-leadership` now.
- `scripts/generate-sitemap.mjs`, `scripts/generate-llms.mjs`, `scripts/prerender.mjs`: crawler surfaces. The build fails when the prerender and sitemap route sets disagree, and the prerendered copy has to match the pages. `scripts/lib/pages.mjs` is the one list of indexed pages, with each page's title, description, plate words and film still; the prerender writes the head from it and `scripts/social-plates.mjs` paints one social plate per page and post from it (`public/social/`, manifest in `src/content/socialPlates.json`, painted by a browser and committed because the deploy has no browser). `src/test/discoverability.test.ts` fails when a plate's words no longer match its page, so a changed headline means `npm run social-plates`. `scripts/generate-favicons.mjs` draws the whole icon set from `src/assets/mindmake-mark.svg`: transparent on the tab, ink where a platform paints its own ground.

## Required checks

Run the focused route, conversion and disclosure tests (the public contract, backend core, price and disclosure suites), the production build, the lint comparison, and desktop and 390px browser checks. Confirm visible focus, reduced motion, no overflow, no browser errors and one-hop redirects.

`npm run qa:entrance` also reads the entrance's own marks (`mm-pending`, `mm-arrived`), judges the frames inside the arrival by direction, reads every layout shift after first paint against a floor, counts the animation frames on which the curtain was actually displayed while its marker (`mm-covered`) was on, refuses an arrival that began more than 400ms before first paint, and runs a reduced-motion pass on which nothing may be held, covered or mounted. The last two exist because on 3 September the root marker shared the strips' class name, the whole document was `display: none` until it came off, and the gate reported the browser's late first paint as a slow entrance rather than a missing one.

Browser gates run against the built output, at 1440 and 390: `npm run qa:alive` (no still viewport at rest, and a second scrubbed pass requiring position-driven change in all three thirds of a page; the at-rest pass now reads how much of the viewport moves, not only whether anything in it does), `npm run qa:images` (no upscaling, and density floors), `npm run qa:rhythm` (no two sections sharing a ground unbroken), `scripts/qa/card-geometry-check.mjs` (equal heights, aligned rows, no reflow on open, and every deck and rail arrow actually moves what it drives), `scripts/qa/one-way-in-check.mjs` (never two primary actions on screen), `scripts/qa/redirect-check.mjs` (every retired route lands in one hop), `scripts/qa/dialog-shape-check.mjs` (the lead dialog is a dialog and not the page), `scripts/qa/handoff-check.mjs` (two dead ends driven for real, so the offer of a person is legible and focusable on both grounds), `npm run qa:entrance` (the first second, cold and throttled: the ground never goes light, the page is never replaced after it paints, React does not fail to hydrate, and something is moving when it lands), `npm run qa:nojs` (scripting off: every answer the page renders is in the served markup, and nothing the browser laid out is clipped away inside a box that cannot be scrolled), `npm run qa:screens` (eight sizes from 360x800 to 1920x1080: no section past 1.35 screens, nothing clipped, nothing sideways, no fixed chrome over the primary action), `npm run qa:deadcss` (no declaration a component makes is beaten by a `.mm-site` reset, across thirteen properties on eight pages, the answer index and the newest answer page among them), `npm run qa:chrome` (the privacy strip and the mobile action bar, driven into view at eight sizes and two text scales: the strip flush to the bottom edge, the bar stacked on it from the strip's published height, neither broken, neither burying an action the reader has scrolled to, and the footer readable under both), and the typecheck the build already runs.

`qa:screens` exists because every other browser gate runs at 1440 and 390, which is a laptop and one phone, and the range is where the failures are. Measured before it: 17 of 26 sections were over one screen at 360px, the homepage's proof strip ran 2.61, and the homepage's own hero ran 1.47 screens on a 1280x800 laptop, so the first screen of the site did not contain the first screen of the site. Its exemptions are named with a reason, the way `qa:rhythm` names its own.

`qa:nojs` exists because every other check on this site, unit and browser alike, runs JavaScript. `.mm-drum` was `overflow: hidden` while the drum's position was a transform written by a hook, so with scripting off it showed one card and clipped the rest with no scrollbar: on the questions drum that was one answer of eight and 2,308px of unreachable copy, for months, on the section a reader goes to when they have a question. Nothing was looking.

**Every gate asks for `/path/`, not `/path`, and this is load-bearing.** `vite preview` serves the second from the SPA fallback, which is the homepage's markup. With JavaScript on the router paints over it a render late, so most gates measured the right page by luck. The entrance gate did not: it handed React the homepage's HTML and the router's own page and reported the mismatch as a defect in the site, 16 hydration failures on `/ai-brain` and 13 on `/ai-gtm`, stable across runs and indistinguishable from the two real hydration failures that gate was built to catch. `scripts/qa/lib/asked.mjs` holds the one line that fixes it, and the reasoning.

Every one of them runs both widths. Until 29 August this text said so while `qa:alive` and `qa:images` defaulted to `--width 1440` and `qa:rhythm` had no width flag at all, so the three gates that decide whether the site feels alive and whether its images are sharp had only ever been run on a laptop. Each npm script now runs both widths in turn; the first readings at 390 were clean, which does not make the gap harmless, only lucky.

The last three exist because every other gate measures a page at rest, and neither the lead dialog nor a failure state is on a page at rest. On 28 August 2026 the whole dialog layout was deleted from `mindmake.css` and shipped: every test passed, every gate passed, and the main conversion surface rendered full-bleed for a day. On 29 August the entrance was found to be a white document for seven hundred milliseconds before the site arrived, on every page, because the built stylesheet is injected after the critical inline style and set an off-white page ground. Anything that only appears after an interaction, or only during one, needs a gate that performs it.

`qa:entrance` reads the browser's error stream as well as its frames, and the two catch different things. On 30 August every prerendered page was failing to hydrate and React was rebuilding each one from nothing; at 1440 the frames saw it as the page being replaced a second after it painted, and at 390 they saw nothing at all, because the rebuild landed on markup that looked the same. A gate that only photographs the page cannot tell a working render from a discarded one.

The inline block in `index.html` is the ink ground and nothing else. It used to be forty lines styling a hand-written first screen, and three bugs came from that screen being a likeness rather than the thing; the pages are rendered from the components now, so the likeness and its second copy of the design are gone. What is left has to stay in step with `--mm-ink`, because the built stylesheet is render-blocking and the ground has to be right before it lands. `src/test/first-screen.test.ts` holds the value in all three places it appears and fails if a hand-written first screen comes back.

Gate floors are calibrated from readings, not chosen; each script says how. If one fails, the page is usually what is wrong. When the gate is what is wrong, fix the measurement and say so in the commit rather than lowering a floor.

For any change to a public surface, run both a source scan and a rendered DOM scan for the banned families: the operator's name, the banned vocabulary and the antithesis templates. `src/test/copy-restraint.test.ts` reads the server render of seven routes for three habits the eye does not catch: copy about its own copy, copy narrating a control, and the same sentence said twice on one page. The design contract's "The design says it, so the sentence goes" is the rule; that file is the gate. A site-wide reset must carry no specificity: write it `:where(.mm-site) :where(p, h2, ...)`, never `.mm-site p`, because (0,1,1) is above every single-class rule here and a default that outranks its own components is an override. Seventeen declarations were dead that way on 2 September 2026, and `npm run qa:deadcss` is what stops the eighteenth. Where a number is already in a picture, a count already in a numbered row, or an instruction already in the shape of a control, printing it again is not thoroughness. For anything that arrives on scroll, load the page with JavaScript disabled and confirm every word of it is readable. Motion must clarify the message or the interaction. Movement added only for decoration is a regression, and so is a still viewport.

For any change to the lead pipeline, run `src/test/mindmake-brief-backend-core.test.ts`, redeploy with the function's full import closure, verify the deployed body and prove one synthetic end-to-end lead from `https://mindmake.co`.

`npm run qa:alive` is **green** as of 2 September 2026, 28 viewports at 390 and 25 at 1440, and it had been red since it was written. Its worklist was the two try-it panels and `/ @844px`, and this file previously said those wanted a set-piece rather than a fix. That was wrong. What they wanted was to **build**: `src/components/mindmake/Build.tsx` puts `useScrollDriver`'s `--mm-p` on a group so its children assemble with scroll position and come apart again on the way back, which is the gate's second half. `Arrive` cannot do it, because a reveal fires once and a section that has arrived is a photograph. Keep it green; if a viewport goes still, give that section a build rather than lowering a floor. **A clean run is not proof on its own.** The board's idle turn read clean twice and then reported three still viewports on the third run, because the gate photographs five instants and an occasional small motion is caught or missed by luck. What settled it was the panel becoming a `Build`, which changes on every frame the reader scrolls; when a fix is stochastic, run the gate again before believing it.

Three things about that gate are worth knowing before reading a number out of it. Its rule was `mean >= 0.15 || peak >= 8`, and `peak` reads the busiest 0.05% of pixels, so one forty-pixel instrument ticking in a frozen screen of text satisfied it; it counts moving cells now. It photographed a stopped page, which can only ever see the ambient layer, so it was failing `ClimbLadder`, `ProcessTrack` and the fork band for being position-driven, which is what the contract asks them to be; a viewport is alive now if something moves in it at rest **or** something in it builds as you scroll through it. And it sampled 1.8 seconds while the plate light sweep is a 9.5 second cycle that parks for 4.3 of them, so the same viewport read 0.125 on one run and 1.611 on the next; the window is 6.4 seconds now. Any reading recorded before 30 August is only trustworthy where the motion was continuous.

The gate also serves `get-ai-news` from `scripts/qa/fixtures/`. Without it the board on `/ai-gtm` renders "The read is rebuilding" from a session that cannot reach Supabase, and a reading about the network gets recorded as a design defect.

The 5 September historical baseline was 450 tests across 29 files. Current source-bound counts and browser evidence belong to `project-documentation/website-redesign/RELEASE-2026-09-24.md` and `06_CURRENT_STATE.md`; do not use historical passes to certify a new candidate. Lint must retain zero errors and no warnings beyond the two longstanding refresh advisories. Short prose balances by default (`text-wrap: balance` at (0,0,0) on prose elements, which Chrome applies up to six line boxes and drops past); only `.mm-voice-panel blockquote` opts back into `pretty`. Do not add new lint problems. Point the typecheck at `tsconfig.app.json`: the root config carries `"files": []` and checks nothing.

For any change to the films or the film plate, confirm in a browser that every
loop decodes and plays when scrolled into view, and that a reduced-motion
visitor has no video mounted at all.

Deployment and promotion follow `project-documentation/07_DEPLOY_RUNBOOK.md`,
whose launch steps are ordered for a reason. Do not change live Supabase, send
real email from new code paths, alter domains or delete deployed functions
without the matching verification.

</details>

### Original: project-documentation/README.md

Raw SHA-256: `d31a8d07653799debb93a619e83249eebb082de1f395498bef6bf1305d663d27`

<details>
<summary>Full pre-consolidation document</summary>

# Mindmake documentation

Everything in this directory, apart from `history/`, describes the live Mindmake
business and site **as it is today**. If a fact here is out of date, it is a
bug, not a record. As of 7 September 2026, by Krish's decision, history lives in
[`history/LOG.md`](history/LOG.md): the dated record of past deployments,
repairs and readings, newest first, moved out of `06_CURRENT_STATE.md` so that
file holds only what is true now. Nothing in the log describes today. Git still
holds everything.

## Read in this order

| # | File | What it settles |
|---|---|---|
| 00 | [`00_NORTH_STAR.md`](00_NORTH_STAR.md) | Why the business exists, what we believe, who it is for, what good looks like, the aesthetic, the voice, the naming law. **Start here.** |
| 01 | [`01_CANON.md`](01_CANON.md) | The commercial truth: the two doors, the buyer, the offer, private pricing, the conversion path, the answers, what we will not sell. |
| 02 | [`02_PUBLICATION.md`](02_PUBLICATION.md) | The publication's two channels, The Money of AI and Built with AI: mandate, register, formats, gates. |
| 03 | [`03_DESIGN_CONTRACT.md`](03_DESIGN_CONTRACT.md) | Binding design and motion rules, and the acceptance checklist a change must pass. |
| 04 | [`04_PROOF.md`](04_PROOF.md) | What we may claim: approved attendee brands, client outcomes, consent-gated quotes, named career references. |
| 04 | [`04_PROOF_RECORDS.md`](04_PROOF_RECORDS.md) | Internal, anonymised records of the real engagements behind the public proof. Never public copy. |
| 05 | [`05_LEAD_DELIVERY_SPEC.md`](05_LEAD_DELIVERY_SPEC.md) | Exactly what a lead receives, when, and what happens when a step fails. |
| 06 | [`06_CURRENT_STATE.md`](06_CURRENT_STATE.md) | What is live right now, at which identifiers, with the verification baselines. |
| 07 | [`07_DEPLOYMENT.md`](07_DEPLOYMENT.md) | How the site, domains, backend and email identity are deployed and rolled back. |
| 07 | [`07_DEPLOY_RUNBOOK.md`](07_DEPLOY_RUNBOOK.md) | What was deployed for the rebuild, how it was verified, and the ordered launch steps. |
| | [`history/LOG.md`](history/LOG.md) | The dated record: what was deployed, repaired and measured, and when. Never current guidance. |
| | [`../NOW.md`](../NOW.md) | The router at the repository root for an agent arriving cold: what this is, where it is right now, what changed, what is waiting on Krish, and where the detail and the history live. Maintained by the docs steward; where it disagrees with the numbered files, they are right. |

## Precedence

`00_NORTH_STAR.md` outranks everything. `01_CANON.md` outranks everything except
the north star. Where any other file, any code comment, or any older document
disagrees with those two, those two are right and the other thing needs fixing.

## Two files that are not truth about today

- `04_PROOF_RECORDS.md` is internal engagement context. Nothing in it reaches a
  public surface without a fresh evidence check and approval.
- `01_CANON.md`'s buyer-archetype section is internal buyer psychology. It breaks
  the no-doom rule on sight and is never public copy.

## What is not here any more

The pre-rebuild handover set, the decisions log, the separate offer, ICP,
value-proposition, sales-playbook, messaging and proposition-lock files, and the
general LLM-reasoning research folder have all been removed. Their still-true
content is in `00_NORTH_STAR.md`, `01_CANON.md` and `04_PROOF.md`; the rest
contradicted the current contract.

Git has all of it. To read a deleted file as it last stood:

```
git log --diff-filter=D --name-only -- project-documentation/
git show <commit>^:project-documentation/<file>
```

</details>

### Original: project-documentation/00_NORTH_STAR.md

Raw SHA-256: `e759760e48b5d736cde3853d4775eb55ad891bb75f5b43f2a5f8af4ee8225f62`

<details>
<summary>Full pre-consolidation document</summary>

# 00. North star

*Current as of 5 September 2026.*

**If you read one file, read this one.** It is written for a person or a model
arriving with no context, and it should leave you able to make a decision on
Mindmake's behalf without asking anyone. Everything after it is detail.

---

## The one sentence

**Every AI a leader buys already knows the market. None of them know the
leader. Mindmake builds the one that does, so the leader keeps their edge as
the market moves.**

That is the whole business, and every page, email, film and decision either
serves it or does not belong.

---

## Why this exists

A capable leader has spent twenty years building something that does not fit in
a prompt: taste, standards, a sense of which deals are real, a memory of who is
worth calling. It is the most valuable thing they own and the least legible
thing they own.

The AI they can buy off the shelf has read the whole internet and knows nothing
about them. It is confidently generic. So the leader gets faster at drafting and
no better at deciding, and the gap between what they know and what their tools
know keeps widening.

Meanwhile the work moves. It moves to consultants, to tools, to whoever holds
the model. And when all the learning lives somewhere else, the leader slowly
loses the ability to test the work, ask the next question and make the call.

**You can hand over the work. You cannot hand over the understanding.**

Mindmake exists so that a leader's judgement gets stronger as their tools do,
rather than being quietly replaced by them.

---

## What we believe

**Instruments, not oracles.** An oracle answers and asks you to trust it. An
instrument makes a situation legible enough that you can decide. We build
instruments. This is the analogy underneath the whole brand, including the
films: brass, paper, patient machines that record and measure, and always a
human hand making the call.

**The third level is the only one worth paying for.** AI creates value at three
levels. One: help me do the task. Two: bring me what matters. Three: extend what
I can do, so the system keeps making the decisions better. Levels one and two
support the work. Level three is the promise.

**Time saved is the setup, not the payoff.** The real question is whose time
comes back, what they put it into, and whether the new capability compounds.

**Built once, compounds daily.** Advice leaves when the adviser does. A system
stays and gets better. We would rather leave something running than leave a
document.

**Honest beats impressive.** When we do not know, we say so. When a number has
one source, we say one source. A read of someone's business is an illustrative
example of how we work, and it says so. Nothing is dressed up as more certain
than it is.

**Warm with people, sharp with ideas.** We are generous about the alternatives.
Consultants, models, point tools and platforms all do useful work, and pretending
otherwise makes us look small. We name the distinction and let the reader judge.

---

## Who this is for

A founder, principal, portfolio owner, investor or senior commercial leader who
can move a decision on their own, and whose decisions are big enough that
getting them right matters.

The strongest situations:

- a healthy or fast-growing AI company whose product, price, positioning, people
  or company design has to keep up with its own market;
- an established internet, software, media, data, content, coaching or advisory
  business whose old commercial rules have stopped working;
- a well-connected principal whose scarce time is spread thin across ventures,
  relationships and decisions;
- a leader who wants an AI chief of staff, or a durable brain that makes their
  own judgement easier to use;
- a portfolio owner who wants more high-value time, rather than a smaller inbox.

**Write for ambition as much as for pressure.** Do not write only for businesses
in decline. The chance to build something stronger is as real a reason to start
as the fear of falling behind.

---

## What we sell

**Two public doors, one paid proof.**

- **Build your AI brain.** Your taste, standards and judgement, running as a
  system you own.
- **Build your AI GTM.** An AI-native go-to-market (GTM: how a business gets
  its product to customers and gets paid for it) across the four levers:
  product, price, positioning or people.

They are not two products. Either can be the way in, and either can lead to the
other when the work calls for it.

Both lead to **one paid proof**: pick one decision or capability, build a
working first version, use it on real work, leave something behind that keeps
running. Not a stretch of discovery followed by a report. The price is private,
the length is agreed with it and neither appears on the site (5 September 2026),
and there is no public diary link. The only primary action on the site
is **Start here**.

**CTRL** is our own product, running our own practice. It appears as evidence
that we do this ourselves. It is never a third thing to buy, never linked, never
priced.

---

## What good looks like

**For the client**, when the proof ends: something is running that was not running
before, it is used on real work, the leader can direct it without us, and they
would say out loud that it is useful. That last part is the actual bar. A proof
counts as working when the client will stand behind it.

**For Mindmake**, the work also has to leave us stronger: a reusable method, an
anonymised pattern, a relationship, a piece of proof, or intelligence that makes
the next engagement sharper. Hands-on building is good when it compounds. The
long-term asset is an honest record of how AI use, value and pricing change over
time, never a library of commodity agents.

**For the reader of any page**, in three seconds: they know what this is, who it
is for, and what to do next. If a section needs a second read, it has failed.

---

## The aesthetic

Dark, warm, physical, patient, alive.

**The world.** Instrument rooms. Brass, walnut, cream paper, ink, glass. One
blade of window light with dust in it. Machines that record and measure, and a
human hand that decides. Never screens, robots, boardrooms, holograms, or people
smiling at laptops.

**The palette.** Deep ink-green ground. Warm light. Cream. Exactly one accent
system, and it means something: **mint is the answer**, **amber is what moved
since yesterday**. Nothing else is coloured for decoration.

**The type.** A grotesque carries structure. A serif speaks the claim, and only
the claim. A mono speaks data and labels, and only those. If you are unsure
which face to use, you are unsure what the line is doing.

**The motion.** Three layers, all required. **Ambient** never stops and means
nothing: the films, the marquee, the live dot, the light moving across a section
ground. **Scroll** only changes the relationship between things already on the
page. **Touch** answers the hand inside a tenth of a second, on everything.
Entrance choreography is banned outright: nothing fades or slides in as you
reach it, because that makes understanding depend on watching an animation.

**The floor and the ceiling.** No viewport is ever fully still. No element ever
performs its own arrival.

**The words.** British English. Plain enough for a twelve-year-old. Short
sentences. Any business term explained the moment it appears. Never an em dash.
Never an eyebrow above a heading. Never doom, never commands, never boasting,
never a cryptic headline that makes the reader work for the point.

---

## The voice

We speak as **we**. The practice is the subject of every claim, every
explanation and every offer, and it never becomes one person telling you about
himself.

Founder-led, practice voice, decided 28 August 2026. The founder is Krish Raja,
and he appears in exactly three places: the founder section at the foot of the
homepage, where the bio is his own and in his own first person; the framing of
the proof, because a testimonial needs somebody to have worked with; and inside
verbatim quotes, where other people used his name.

Everywhere else the earlier rule holds unchanged. No first person in the
practice's voice, no biography woven through the pages, no portrait used as
decoration, and no "why him" argument standing in for evidence.

This replaces "named exactly once, no portrait", which was written before the
proof archive existed. It changed because thirty-three people gave testimony
about working with a named person, and proof that hides who the work was with
is weaker proof. The positioning did not change with it: Mindmake still builds
systems that hold a leader's judgement and belong to the client afterwards.

The register is a helpful expert explaining something clearly to someone smart
who has not thought about it yet. Confident about what we know, plain about what
we do not, and never performing.

In the publication the register earns a sharper edge, and two rules keep it from
turning sour. Both are hard gates:

- **The Kind Rule.** Irony points at claims, hype, incentives and decisions.
  Never at a named person's competence or character.
- **The Rigour Rule.** The register can be dry. The evidence handling is
  humourless. **The joke can never be the finding.** Every load-bearing number is
  attributed on screen to whoever produced it, and where the record runs out we
  say so plainly and without a punchline.

---

## The naming law

This one is absolute, because a business with two names has none.

- The business is **Mindmake**. Never "Mindmaker", never "The Mindmaker", never
  "Mindmaker Live", never "Mindmake AI".
- The site is **mindmake.co**. `themindmaker.ai` and `www` variants redirect to
  it and are infrastructure, never names.
- The product is **CTRL**, at `ctrl.mindmake.co`.
- The publication is **Mindmake's publication**, and it runs exactly two
  channels: **The Money of AI** and **Built with AI**. No third channel, no
  other channel name, no earlier name.
- **Mindmaker LLC** is the registered legal entity. It appears only in the
  privacy notice and the terms, where the law wants the registrant named. It is
  not a brand and never appears anywhere else.
- `mindmakerlive.substack.com` is where the publication is hosted today. It is a
  hosting address, not a name. Nothing in copy calls the publication by it.

One exception, and only one: **a verbatim quote is never edited.** A reference
who said "Mindmaker" in 2019 still says it, because changing someone's words to
suit our branding would be dishonest and would break the consent they gave. The
quote carries the old name; nothing around it does.

Anything else you find in this repository that looks like a brand name is dead.
Delete it rather than working around it.

---

## What we will not do

- Reintroduce an offer ladder. The Teardown, The Handover and the 21-day Sprint
  are retired and stay retired.
- Publish a price, a discount, or a currency switcher.
- Put a public diary link or a "Book a call" button on the site.
- Ship a chatbot, or anything that makes a served research read look like a
  conversation with a machine.
- Call attendee brands clients.
- Claim a number we cannot attribute, or a count of leaders helped we cannot
  evidence.
- Send an email nobody asked for. A converting visitor gets their results and
  one follow-up fourteen days later, and that is the whole relationship until
  they reply. The company read also sends a six-digit code first, because it has
  to prove the address is theirs; that is the only other message, it is named on
  the privacy page, and there is no third.
- Let a section exist whose only job is to persuade. Every section teaches
  something, shows proof, or helps a decision.

---

## How to decide, when this file does not say

Three questions, in order:

1. **Does it make the leader more able, or less?** More able wins, even when
   less able would convert better this quarter.
2. **Would we still say it if the reader could check?** They can. Say the
   checkable version.
3. **Does it compound?** A thing that is still working in six months beats a
   thing that looks better on launch day.

If those three do not settle it, the decision belongs to Krish Raja, and the
honest move is to say so rather than guess.

---

## Sharpened, 5 September 2026

The ikigai work of August and September (Master Ikigai v4, and the positioning
sheet derived from it) sharpened what this business is for, and the site now
says it. Nothing above was overturned; four things were made exact.

**What the work answers, in order.** Where you stand. What is coming. What to
do first. Then it is built into something the leader owns. This is the spine
of the homepage and the thing every door page has to serve; it replaced the
two hours and the hinge, which were reasoning and now live on the argument
page alone.

**The word.** Edge is what the leader keeps. It is commercial, it is theirs,
and it is less abstract than mind or understanding. Judgement stays as the
mechanism, and the hinge line keeps "understanding" because it is that line's
own word. Edge is used sparingly and never as a boast.

**Private, written to and never shamed.** The buyer the work is built for is a
senior leader who is further behind on AI than anyone around them knows, and
who cannot say so. That description stays internal, because on a page it reads
as doom. Its one approved public form is the situation without the feeling:
*Nobody in your organisation needs to know where you started.* The no-fear rule
stands, and "Write for ambition as much as for pressure" stands with it.

**No public duration.** The proof used to be sold as thirty days on every
page, and it was the most repeated phrase on the site and the least interesting
thing about the work. The length is agreed privately with the fee. Public copy
promises what a leader sees in the first week and what they keep at the end.
Figures from the record of past work (the archive's "days to the first working
system", a story's "inside the thirty days") are facts and stay.

The two doors stay. The 28 August decision was not undone: the duplication on
the door pages came from each one making the whole practice's argument alone,
so each now carries only what is specific to it, and the argument is made once.

---

## Where to go next

| You want | Read |
|---|---|
| The commercial truth: offer, pricing posture, buyers, objections, the conversion path | `01_CANON.md` |
| The publication: two channels, formats, gates | `02_PUBLICATION.md` |
| Binding design and motion rules, and the acceptance checklist | `03_DESIGN_CONTRACT.md` |
| What we are allowed to claim, and which proof is which | `04_PROOF.md` |
| Exactly what a lead receives and when | `05_LEAD_DELIVERY_SPEC.md` |
| What is live right now, at which identifiers | `06_CURRENT_STATE.md` |
| How to deploy, and how to roll back | `07_DEPLOYMENT.md` |
| What the rebuild deployed, and the ordered launch steps | `07_DEPLOY_RUNBOOK.md` |
| The engagement records behind the public proof | `04_PROOF_RECORDS.md` |

</details>

### Original: project-documentation/01_CANON.md

Raw SHA-256: `631bd2978067bee5e8583456d2eb6a9b502b0343e92dd7356c1c58343dd9507f`

<details>
<summary>Full pre-consolidation document</summary>

# 01. Canon

*Current as of 5 September 2026.*

The commercial truth. Where anything else in this repository disagrees with this
file or with `00_NORTH_STAR.md`, those two win and the other thing is wrong.

Read `00_NORTH_STAR.md` first. It carries the naming law, the beliefs and the
aesthetic. This file carries the offer, the buyer, the money and the motion.

---

## The business

Mindmake is a principal-led AI and commercial strategy practice run by Krish
Raja. It helps a leader use AI to extend their judgement, taste and expertise,
then turn that stronger capability into a better business result. The work may
improve the leader, the product, the price, the positioning, the people, the
route to market, or the company structure that supports them.

It is **not** an automation shop, a training course, a chatbot, or an open-ended
consultancy. It does not begin with a list of repetitive tasks. It begins with
the value of a leader's time, the decisions only they can make, and the
capability the business should still have when the work ends.

---

## Sharpened, 5 September 2026

See `00_NORTH_STAR.md`, "Sharpened, 5 September 2026", for the four things and
the reasoning. What they change in this file:

- The offer is a **paid proof with no public price and no public duration**.
  The internal month shape, the hour envelope and the rate card below are
  unchanged and stay internal.
- The two doors are the **two questions a leader can bring**, an AI that
  starts from what they already know, or a way to sell built for what
  customers pay for now, and the same work sits behind both. Each door page
  carries only what is specific to its door. The practice's argument is made
  on the homepage (what the work answers) and on `/new-age-leadership` (why).
- The Accountable Delegator below stays internal. Its one public form is the
  private line in the north star, and the answer "Does anyone in my company
  need to know?" in `src/content/answers.json`.
- The payoff word in public copy is **edge**; judgement stays the mechanism.

---

## The two doors

The site uses two doors because they meet non-technical buyers in language they
already have. These promises are locked:

- **Build your AI brain.** Encode your taste and judgement, amplify your
  strengths, uncover your blind spots.
- **Build your AI GTM.** Create an AI-native GTM model across product, price,
  positioning or people.

The four GTM levers are **product, price, positioning and people**. Earlier
"message and team" framing is retired wherever the levers are named.

These are not two unrelated products. Either can be the hook, and either can lead
to the other when the work calls for it.

**Private routing observation, never public:** principals tend to enter through
Brain and buy GTM next; companies enter through GTM and the leader buys Brain
next. This lives in brief review and follow-ups only.

### What an AI brain is

Copy-grade definition, safe to use directly: **an AI brain is a working system
that holds your taste, judgement, standards, memory and trusted context, and uses
them on your real work.**

The page must feel like access and acceleration, never like software doing the
leader's job.

### The mechanism, and why it is defensible

The engine is the Mindmake brain: CTRL plus a corpus built over years from
behavioural psychology, AI agent design, and real work and corrections with
leaders across keynotes, cohorts and advisory.

The rule above all of it: **the system never does the work for them. It
accelerates them building their own brain.** A generic AI has no memory of you
and no method for extracting you. A consultancy extracts you into a deck that
leaves. A model on its own cannot hold your standards, sources and corrections as
something that compounds.

The method is described, never named, until it works for three clients who are
nothing like its author.

### The GTM proposition

Two leaders arrive here. The established leader, whose customers can now do part
of it alone and whose price and promise no longer line up. And the builder,
creating a new AI-native business, whose model has to be invented rather than
repaired.

Both get the same month: read what changed, choose the lever, build the model,
prove it with buyers, run it. One important call made defensible, and a model the
team can run without us.

### Units of value

- **Brain:** capability kept. Time returned is the setup, never the promise.
- **GTM:** decision quality. One product, price, positioning or people call moves
  the P&L by far more than the fee. Name the decision in the brief and the fee
  prices itself.

---

## The value ladder

AI creates value at three levels:

1. **Help me do the task.** Faster drafting, admin, analysis.
2. **Bring me what matters.** The right information arrives before the leader has
   to go looking.
3. **Extend what I can do.** The leader gains working memory, a new way to see
   and act, and a system that keeps improving their decisions.

Mindmake is built for level three. One and two may support the work; they are not
the premium promise.

## The working-understanding hinge

Consultants, models, single-job tools and all-in-one platforms all do useful
work. We do not need to dismiss them, and pretending they are worthless makes us
look small.

The risk is different: the work moves while the leader's own understanding stays
still. When all the learning lives with other people and tools, the leader
becomes less able to test the work, ask the next question and make the call.

The public hinge is: **You can hand over the work. Not the understanding.**

Public copy expresses agency and the value of staying able to lead. It never
threatens the reader with becoming obsolete.

---

## Who buys

**Buyer groups.** Founder. CEO. CRO, or whoever owns revenue. Strategy leader.

**The gate.** The person must own, or be able to move, the decision and the
business result behind it.

**Best-fit moments.**

- Faster startups may be taking the market.
- Growth is possible, but the product, price, positioning or people is holding it
  back.
- AI has changed an important product, sales or company decision.
- The leader knows something is wrong but cannot yet name the real problem.

**Poor fit.** The person cannot move the decision. The request is only for
training, certification or a list of task automations. The work needs production
IT delivery rather than a commercial decision. The buyer wants an open-ended
retainer or a fractional job. There is no decision, business result, or person who
owns it.

**Sales wedge, internal only, never the public position.** Media, data, creative,
publishing and content businesses, because the proof and relationships are
strongest there. Coaching and consulting businesses can also fit well.

### The archetype: the Accountable Delegator

**Internal buyer psychology. None of this is public copy.** It breaks the
no-doom rule on sight. It is here because it explains what the buyer is actually
feeling when they land.

One line: a senior commercial leader who has been made accountable for AI, talks
about it fluently in the room, and privately knows they are deciding on something
they cannot actually do.

The core contradiction: they can talk the talk but have not built the skill. They
believe AI is a thing you delegate, like IT. **AI is an operating skill, not a
procurement decision.**

**Behavioural traits.** High external confidence with low internal certainty:
confident in the boardroom, vague in the one-to-one. A delegate-by-default
reflex. Approval-loop dependency. Pattern-matching to old transformations.
Performative urgency without structural change.

**Tells.** The AI town hall with no follow-up. Three to six unintegrated pilots
with no success metrics. Inability to independently evaluate a vendor demo.
Inability to say what the AI-enabled product actually is for the customer. The
say-do gap. Routing implementation through the CTO so the technical team builds
in a commercial vacuum.

**The framing rule that matters most:** the fraud feeling is rational, not
neurotic. Name it as accurate. Do not reassure it away.

**Jobs to be done.** *Functional:* design an AI implementation they can credibly
explain to the board; build a team structure that does not make them the
bottleneck; define a commercial outcome clearly enough that execution can happen
below them; develop enough literacy to stop delegating judgement to people they
cannot evaluate. *Emotional:* be the strategic brain in the room again rather
than the most confused person in it; lead the change rather than manage its
optics. *Social:* be seen by peers, boards and teams as a credible AI-era leader;
avoid being cast as the bottleneck; signal to talent that this is a company worth
staying at.

**What they are not.** Not the Resistor (stuck, not opposed). Not the Technocrat
(they are the commercial sponsor, not the builder). Not an Early Adopter (they
talk like one and behave like a fast follower). Not the Overwhelmed Operator
(they have a strategy; they lack the structural literacy to execute it). Not the
Disengaged (engaged at the narrative level, disengaged at execution). The genuine
non-buyer is the trailblazer already across the divide.

**The gap to close.**

| Dimension | From | To |
|---|---|---|
| Relationship to AI | Observer | Power user |
| AI strategy | Tool deployment | Operating-model redesign |
| Org design | Hierarchical | Tiered autonomy, mapped human-AI workflows |
| Product definition | Vague | Specific, testable, anchored to a customer outcome |
| Speed to market | Slowed by approval chains | Accelerated by clear decision rights |
| Leadership model | Strategy by destination | Directed emergence |
| Self-awareness | Hidden impostor feeling | Named gap |

**What does not work on them.** Technology-first framing (they delegate it to
IT). Training-only interventions (they send the team, not themselves). Abstract
frameworks with no P&L anchor. Certifications (the credential is not the
problem). Anything positioned as beginner AI literacy (identity threat is too
high).

**What works.** Frame it as leadership design rather than AI training. Start from
the commercial outcome and work back to the human-AI structure needed to deliver
it. Create safety to not know: the work happens on their decision, in private,
without an audience of their own reports. Give them a language upgrade. Build
personal experimentation in as a leadership act. Name the impostor dynamic as
accurate.

**Supporting research, all directional and all attributable.** 95 percent of
enterprise generative AI pilots deliver no measurable P&L impact and only 5
percent create real value (MIT NANDA, *The GenAI Divide*, 2025). 93 percent of
Fortune 1000 data leaders name culture and change management as the primary
barrier, against 7 percent naming technology (IMD 2026). Organisational factors
account for more than twice the variance in AI impact than individual skill
(Microsoft, via Gloat 2026). 71 percent of US CEOs report impostor symptoms (Korn
Ferry 2024). Only 22 percent of executives feel very prepared to lead AI
transformation (McKinsey), and 58 percent have never taken AI training (General
Assembly 2024). 27 percent report a comprehensive AI strategy and 20 percent
believe their workforce is ready (Gartner, December 2025). Leaders who personally
experiment achieve outcomes up to 12 times better than those who delegate
exploration (BCG, September 2025). Only 6 percent say they are making real
progress designing how humans and AI work together (Deloitte 2026), and only 13
percent have AI agents genuinely integrated against 56 percent experimental or
supervised (BCG 2025).

Any of these may be cited publicly **with its source named**. None may be cited
without one.

---

## The offer

Work starts with a **paid proof**. There is no public price and, from 5 September
2026, no public duration: the length is agreed privately with the fee, and the
site promises only that something is working in the first week. The month shape
below is the internal envelope.

The proof picks one important decision or capability, builds a working first
version, uses it on real work, and leaves behind something the client keeps
using. It is not a month of discovery followed by a report.

**The month shape.** One brick, all the way. One capability or one lever taken to
live use inside 24 to 30 hours, with the read folded into week one. Refusing the
second brick mid-month is part of the offer.

**The first month must be** tightly bounded; useful on its own; built from
repeatable research, capture and synthesis; honest about what still needs human
judgement; and strong enough for the client to decide whether more is worth it.

**It counts as working** when the client says it is useful in practice and will
stand behind that view. A consented testimonial or case study is the clearest
supporting evidence.

**What the client keeps.** A useful result they say is working. The judgement,
evidence and reasons behind it. A working first version in their hands. A private
CTRL-backed system that can keep improving.

**How to describe the work.** We study the leader and the business, check outside
evidence, capture the judgement that matters, and build a working first version.
The proof must make something meaningfully better, rather than collect data
or produce documents. The client keeps the system and its reasoning in CTRL
rather than receiving a deck that goes stale.

### Continuation

Day 30 is the proof and the only thing a visitor can start. Days 60 and 90 show
what continuation typically builds, labelled as earned, with no prices, package
names or durations for sale.

Privately, continuation is proposed only against named deliverables discovered in
month one, never as generic retained time. The duration follows the deliverable;
the deliverable follows the proof. Continuation earns its place by building the
next useful thing, never by making the client dependent.

The standalone first month costs more than one third of a three-month
relationship. If the client continues, the proof becomes month one and the terms
recognise the lower multi-month unit rate.

Terms may flex for a rare opportunity carrying meaningful equity, access,
relationships, content or case-study rights. Any such trade is explicit.
**Exposure on its own is not payment.**

### Capacity

- No more than two new thirty-day proofs run at once.
- Each proof uses no more than 24 to 30 hours.
- A third paying client must already be in a lighter continuation phase.
- Broad unmanaged implementation, daily embedded availability, and anything that
  cannot fit the envelope are custom, partner-supported, or declined.

No public price, discount, availability claim or start date may be inferred from
any of this.

---

## Pricing

**Entirely private. No number appears anywhere public, ever.**

**Internal rate card.**

| | 30-day proof | Three months (proof credited as month one) | Effective rate |
|---|---|---|---|
| Principal | $15,000 | $36,000 | $500 to $625 per hour |
| Company | $25,000 | $60,000 | $833 to $1,040 per hour |

**The altitude rule.** The card follows whose P&L the decision moves. Ability to
pay never argues the craft down; it argues the stakes up.

**Floor and flex.** $12,000 cash floor. Below it only when the gap is paid in a
named asset written into the agreement: equity, participation, real distribution,
or a consented case study.

**The public script.** No number anywhere public. When asked: the proof is a five
figure month, and the exact number follows the brief.

**Collapse target.** After five paid proofs with door-shaped stories, collapse
upward toward a single higher number.

**Volume ceiling.** Roughly $45,000 to $65,000 in a fully booked month. A year
is not twelve of those: allowing for gaps between engagements, the planning
range is $550,000 to $700,000. Volume is capped by design, so price is the only
lever on that ceiling.

**Internal budget anchors.** The Brain door sits on the coaching and chief-of-staff
line. The GTM door sits on the positioning and pricing project line, where
workshop-format engagements are already reported at $50,000 to $100,000 and
above. Both labels are internal and never appear in copy.

**Revisit trigger.** Ten `Start here` briefs, or three sent proposals, whichever
comes first. That is the trigger to re-examine the card. The collapse above it is
a separate, later move that only happens once five proofs have been paid for and
have produced door-shaped stories.

**Assumptions to watch.** Ten `Start here` briefs with no mention of displacing a
coach, consultant or positioning project: revisit the card downward or re-anchor.
The first three builder briefs balking at $25,000: revisit the altitude rule
rather than the craft.

---

## The conversion path

There is no public diary link and no "Book a fit call" CTA. There is one way in
per screen.

On the door pages that is **Start here**, because the reader is already standing
in a door. On the homepage, from 1 September 2026, it is the two doors by name,
**Build your AI brain** and **Build your AI GTM**, adjacent and in one control
group. That is still one decision: the two are never apart on a screen, and
`scripts/qa/one-way-in-check.mjs` holds exactly that shape.

The reason is not presentation. Each door has always carried its own four
pressure questions, and every `Start here` passed no door at all, so a visitor
who started on the homepage was asked a generic set belonging to neither. Where
the dialog is still opened without a door, from the sticky bar, the menu or a
shared link, it asks which before the four details. Either way a client can
still cross to the other door later; the choice decides what is asked first,
not what is bought.

1. The visitor gives four details: their first and last name, their work email
   and the part of the business they work in. The company comes out of the
   email's domain, so nobody types it twice, and a personal address is refused
   because there is no company behind one to read.
2. Mindmake shows a declarative outside read of the business and, when the read
   is strong enough, two or three pressure choices tailored to that company, each
   server-signed and anchored to a locked lens. "Something else" always reveals
   the locked list.
3. The visitor makes one easy choice, then chooses where returned time would
   matter most.
4. Mindmake shows the recommendation: what AI can carry, what stays with the
   leader, and what a first proof could test.
5. The visitor gives their email to keep the brief, confirms a code, and receives
   the branded proposal on screen, by email, and as a self-contained attachment.
6. A private fit digest reaches the operator with the same inputs plus richer
   company and fit context. Replying to it reaches the visitor directly.
7. The operator decides whether to reply and, if useful, invites a private
   conversation.

The browser sends only the visitor's first and last name, their work email, the
company domain derived from it, allowlisted choice IDs (the division and the
read's two answers) and the server-signed tailored-choice pair. The name is the
only free text in that list, and it is there because it replaced a worse ask: the
personal read used to want a LinkedIn URL, which most people have to go and find,
and a name plus the company behind the email resolves the same person. A personal
email address is refused on both sides, because the company read is built from
the domain and there is nothing behind a personal one to read. The server owns the research, tailored
choices, recommendation, proposal, fit digest, verification codes and delivery
attempts. The old contact endpoint is never a fallback. The visitor can always
download the brief locally, whether or not either email succeeds.

**The honesty framing is mandatory on every read:** it is an illustrative example
of how the Mindmake brain reads a business from the outside, it is not advice,
and it is something to test against the real business rather than a finished
answer. It is written as a statement in the Mindmake voice, and it never asks the
visitor anything or invites a correction.

The preferred second question is: **If you got more of your best time back, where
would you put it?** Suggested answers: grow this business; help more companies;
build my AI skill; make room for important decisions.

The publication choice is separate, optional and unticked. It records interest
only; it does not subscribe or import anyone.

### The two emails

A converting visitor receives exactly two emails after they confirm: the results
they asked for, and one follow-up fourteen days later. Nothing else, ever.

The company read sends one six-digit code before that, because it has to prove
the address belongs to them. The personal read has no code and sends only the
two. The privacy page names the code, so the promise on the page is accurate as
written. Anything beyond these breaks a published promise. The mechanism is in
`05_LEAD_DELIVERY_SPEC.md` and `07_DEPLOYMENT.md`.

A handoff sends the visitor nothing. Somebody who asks for a person after the
site failed them has not converted and is not owed a third email: the operator
is told, a person replies as a person, and the promise stays true. The
temptation to acknowledge it by email is exactly the small kindness that would
make it untrue, so `src/test/brief2-email-cap.test.ts` holds it shut.

### Every dead end ends in a person

Nine things on this site can fail, and every one of them ends in an apology, one
dry line where our own machine is the butt of the joke, and one way to reach a
person. Never the visitor as the butt: a joke at the expense of somebody who has
just been let down is a second insult.

Refusing to send something generic is right. Refusing and then closing the door
is a lead we asked to leave, and for a while that is exactly what the read gate
did. The offer is one click where the road is closed and a quiet line where a
working retry sits beside it, and it asks for nothing the page already knows.
The nine, and the two paths that deliberately have none, are listed in
`05_LEAD_DELIVERY_SPEC.md`.

### Qualifying, from the fit digest

1. Is there one important personal or business result to improve?
2. Would the work strengthen the leader's judgement, raise the value of their
   time, or improve a material product, price, positioning or people choice?
3. Can the right people provide trusted context, decisions and introductions
   during a focused first proof?
4. Can the first proof be bounded, useful, repeatable and valuable enough to earn
   longer work?

**Do not ask the buyer to diagnose the problem before Mindmake has added value.**
An unclear problem is often the reason they need Mindmake.

### Follow-up rules

Every follow-up adds value: reflect the buyer's own words, state the result or
decision as it now appears, and share one useful fact or question. Never
manufacture urgency, never run an automatic chase sequence, and never push a
diary link at someone who has not asked for one.

### What we do not sell

AI training or certification. Automation of a task list. A generic fractional
role or open-ended retainer with no compounding asset. Production IT work. CTRL
as separate software.

---

## Answers to the questions people actually ask

**The live objection set is `src/content/answers.json`**, rendered by the
objection chips and the ask bar. That file is the source of truth for public
answers, because it is what ships. It covers cost, whether you need to be
technical, what happens when the work ends, who sees your data, how this differs
from a consultant, why not just use a chatbot, how much of the team's time it
takes, what you keep, whether it is a document or something that works, how soon
you see something working, how to start, whether it fits your business,
whether we will email forever, what actually happens in the work, what is
included, why you need this rather than doing it yourself, how we charge, what
happens if it does not work, why it would be different when AI has already got
things wrong, whether you need to be a certain size, and whether anyone in your
company needs to know.

The last of those was added on 2 September 2026 and is the one place the
argument on `/new-age-leadership` reaches the buying journey: a reader who
tried AI once and stopped is the reader a six-hundred-year history of the same
reflex is for, and the answer says so in four sentences without the history.

These stay true and are safe to reuse anywhere:

- **Do I need a finished brief?** No. An unclear problem is a valid place to
  start. The first job is finding a useful place to begin.
- **Is this AI training?** No. The work uses AI, and the outcome is a more
  capable leader or a better business result.
- **Is this an automation service?** No. It does not start from a list of tasks
  to automate. It starts from the expertise, judgement and taste in the business,
  and the commercial result that needs to change.
- **What do we keep?** The working first version, the judgement and evidence
  behind it, and a private CTRL-backed system that keeps the work useful.
- **How much does it cost?** The scope and fee are agreed privately after the
  brief. The website does not publish a price.
- **Will the site add me to the publication?** No. Publication interest is a
  separate, unticked choice. It records interest only.

---

## Proof and product

**CTRL** is Mindmake's product and evidence layer at `ctrl.mindmake.co`. It shows
that the work keeps memory, sources, checks and the human call visible. It is
named on `/ai-brain` only, shown as the engine we run on ourselves, never linked
and never priced. It is not a third public offer.

Product footage stays clean. Do not draw over changing interfaces.

The personal contact system is a strong example of level-three value: it brings
relationships together from separate sources so a leader can find the right
person by asking naturally. Public proof must never reveal private contacts, raw
records or unverified counts.

**Proof families never mix.** Full rules in `04_PROOF.md`. In short: attendee
brands are attendance, never clients. Client outcomes are anonymous. Named career
references are separate from customer outcomes. Quotes stay verbatim.

---

## The compounding rule

Hands-on building is good when it also strengthens an asset that compounds:
reusable methods and delivery systems; anonymised benchmarks, trends and
comparisons between moments in time; relationships and access; content and proof;
owned intelligence that makes the next engagement sharper.

Commodity agent libraries are not the strategy. The stronger long-term asset is
an anonymised record of how AI use, value and monetisation change over time.

Client files, private data and client-specific outputs stay protected. Reuse
applies to methods and properly anonymised patterns, never to confidential
material.

---

## Do not reintroduce

One list, so it does not have to be repeated:

- The Teardown, The Handover, the 21-day Sprint, or any other offer ladder.
- Public prices, discounts or currency switching.
- A public Calendly or any direct diary path.
- A chatbot, or anything that makes the served company read look like a
  conversation with a machine.
- Attendee brands described as clients.
- Offer labels on case studies.
- The removed private amount, or the removed 22 percent result.
- An uncapped quote from a reference whose consent record is missing.
- A public count of leaders helped, until the evidence trail is compiled and
  approved.
- Em dashes, or unexplained business and technical terms, in public copy.
- Eyebrow text above any heading.
- A conversational or self-correcting voice in the company read.
- American spellings. It is "judgement".
- Stepped, numbered scroll journeys, step rails, or full-bleed step numerals.
- The Capture / Encode / Amplify / Uncover / Keep ladder. Amplify and absorb
  replaced it.
- "Not an agency. Not a coach." and every other "not X, but Y" antithesis.

---

## Voice

British English. Plain enough for a twelve-year-old, throughout. Short sentences.
Any business or technical term explained the moment it appears.

Never: em dashes; the word "thesis" in public copy (use idea, view or plan);
shaming anyone as a beginner; implying we have all the answers; fear as the whole
argument; generic AI claims; consultant filler; technology theatre.

"GTM" is the one abbreviation the doors are allowed to use, and it is expanded
the first time it appears on a page: how a business gets its product to customers
and gets paid for it.

Avoid as public framing: "AI literacy", "AI fluency", "prompt engineering",
"leveraging AI", "AI-powered", "future of work", "chief of staff",
"productivity", "assistant".

The site speaks as **we**. Founder-led, practice voice, decided 28 August 2026:
the founder appears in the founder section at the foot of the homepage (his own
bio, his own first person, his photograph), in the framing of the proof, and
inside verbatim quotes where other people used his name. Everywhere else there
is no first person, no biography and no portrait, and no "why him" argument in
place of evidence. See `00_NORTH_STAR.md` for why the earlier "named exactly
once, no portrait" rule was replaced.

**Quotes are never edited.** Not for spelling, not for house style, not to
remove the founder's name. The rules that govern our own voice stop at the
quotation mark. A shortened quote on a rail is an exact substring of what the
person wrote, never a paraphrase, and `src/test/testimonials.test.ts` checks
every one of them.

Every public section teaches something useful, shows credible proof, or helps the
visitor make a clearer choice. A line whose only job is to persuade has not
earned its place. An experienced visitor should feel helped, never lectured.

**What the visitor should feel:** value before being asked for anything, and on
leaving, "I can see what comes next, make a better call, and keep building my own
judgement as AI changes the market."

---

## Open commercial work

These are real and unfinished. None of them blocks the website.

1. Compile the evidence trail for the "leaders helped" figure and approve public
   phrasing. Candidate trail: 30-plus keynotes, 1,600-plus Lightning Lesson
   signups, cohort and advisory corrections. Until approved, public copy says
   "leaders" with no count.
2. Mint one Brain-shaped story and one GTM-shaped story, each with recorded
   consent before it renders.
3. Complete current-source research before publishing any new AI GTM market
   claim.
4. The floor and the multi-month card above are the current working numbers and
   should be used. They are not yet proven against enough real deals to be
   settled, which is what the revisit trigger is for.

---

## Authority

This canon authorises specification, copy, component and route work inside the
approved system. It does not authorise deployment, a live Supabase change, email
sending, domain changes, account changes, asset deletion, or production
promotion. Those need Krish Raja, per request.

</details>

### Original: project-documentation/06_CURRENT_STATE.md

Raw SHA-256: `16ea1d5560d3c0a1dd3ed08dfd76f5976a810c73771929483dd99ba54a1eeb93`

<details>
<summary>Full pre-consolidation document</summary>

# Mindmake current state

Last updated: 24 September 2026 (approved R3 live and actual lead-to-download canary verified).

This file is the current delivery truth for `mindmake.co`: what is live, at which identifiers, and what remains open. Why the business exists is in `00_NORTH_STAR.md`. Commercial truth is in `01_CANON.md`. Design truth is in `03_DESIGN_CONTRACT.md`. The dated record of past deployments, repairs and readings that used to sit below the open items is in `history/LOG.md`, newest first; nothing there describes today.

## Current release status — 24 September 2026

The approved R3 production adapter is **live** at `https://mindmake.co`. PR #170 merged as `3ee77cf9956f98dd73f69d0b48745930335e74e1`; production deployment is `dpl_EZigNAi6Uc6Apcq75XsFnHETt5W8` (`mindmake-bh0d8hczk-krish-rajas-projects.vercel.app`). Pre-publish CI passed 531 tests, 208 route cases and nine navigation supplements, plus all motion/fallback cases on Linux and macOS. Actual public readback and the live three-engine scroll matrix passed. Current authority, evidence and rollback anchor are in [RELEASE-2026-09-24](website-redesign/RELEASE-2026-09-24.md); older identifiers below are historical.

The bounded backend repair **is deployed** to project `bkyuxvschuwngtcdhsyg`: `enrich-company` v44, `submit-mindmake-brief` v20, `mindmake-personal-read` v25. The final two version increments correct type-only lint errors; emitted runtime JavaScript is unchanged and all deployed source files were read back. Exact-domain provider checks and independently corroborated identity gate the company read. Factual descriptions quote literal corroborated provider evidence, not model paraphrases; news uses literal first-party source titles. The documented owned alias `themindmaker.ai` canonicalizes to `mindmake.co` for research/signatures only, never the recipient address. Arbitrary redirects and lookalike domains are not trusted.

Fresh canonical and legacy reads passed. Earlier backend preparation used the previous frontend and the public personal-read API; those receipts remain separate. After promotion, the actual new company-first frontend journey passed company research, profile/problem/time selection, brief preview, email verification and success. Verification, visitor brief and operator digest all reached the designated INBOX. The persisted brief was ready and exactly one day-14 follow-up existed. The actual success-screen download contained 15 fragments matching the live brief, had no external requests, and passed desktop/mobile overflow and visual checks. Evidence, captured synthetic IDs and cleanup, exact function versions, source readback and limits: [backend release evidence](website-redesign/BACKEND-RELEASE-EVIDENCE-2026-09-24.md), including its final live-frontend addendum. No cron sender was invoked.

The backend targeted suite passed 67 tests across three files; all three Deno closures passed. The full release matrix passed separately. Physical iPhone VoiceOver and Android TalkBack remain unperformed under the owner's release-only exception. The authorized npm audit recorded 23 advisory package entries; bounded and independent applicability reviews found no confirmed visitor-reachable blocker in this static release, while leaving dependency upgrades open. Neither exception nor advisory triage is a blanket quality/security claim.

## Historical frontend baseline — recorded 7 September 2026

**The rebuild is live.** The homepage, `/ai-brain` and `/ai-gtm` were rebuilt, the six films were installed, and it was promoted to production on 28 August 2026. The edge rewrite of 5 September 2026 (what the work answers, said once, with no public duration) is the latest promotion.

- Site status: **LIVE**. `https://mindmake.co` launched 26 August 2026 and now serves the rebuild.
- Production: commit `6d39665` on `main` (5 September 2026, "The edge rewrite: what the work answers, said once, with no public duration", pull request #154), Vercel production deployment `dpl_ZU6oQorQQcgpiD5YHARRFZHLo3Rg` on project `mindmake` (`prj_GqamX3psD0cGpGCDXRu0ljET7zap`). The chain of deployments before it, from the 28 August rebuild (`dpl_HAoncV1RF3hcvcanqo7Yvc4tuAng`, pull request #152) to the 4 September builds, is in `history/LOG.md` under 2026-09-07 and 2026-09-04.
- Rollback target: `dpl_5saD1mJed9NpT9oXA6wgGHSUPGnz`, the 4 September build for commit `0704583` ("What a crawler and a share card are given"), which is the production deployment the edge rewrite replaced. Never `dpl_AFyoEwjLzuG3wr93xuXAYFhVay9a` (3 September): that build carries the curtain defect recorded in the LOG under 2026-09-04, and rolling back to it would ship that again.
- Verified live after the 5 September promotion: the new hero on `/`, the private answer on `/`, `/ai-brain/`, `/ai-gtm/` and `/faq/`, `llms.txt` carrying the new first line, and no duration promise on any of them. `submit-mindmake-brief` v16 was deployed after the promotion in the runbook's order and probed live (a wrong origin is 403, an unexpected field is 400 naming it). One synthetic end-to-end lead from `https://mindmake.co` ran clean: verification code delivered and confirmed, visitor and operator deliveries both queued, the results email carrying "A USEFUL FIRST PROOF" and the new pressure line, exactly one `follow_up_queue` row due fourteen days out. Both rows were then deleted and read back as gone.
- On `main` after the promotion, all 7 September 2026: Krish's revision of the thirty-three testimonials (`20ef51f`, declared canon), the excerpts cut again so every one is an exact substring of the revised quote (`ad345f4`), the story deck reading its quotes and roles from `src/data/testimonials.ts` at import so there is one copy of every quote (`eb06329`, pull request #156), and the media CRO's story swapped for one that fits the revised quote, same record R-08, id `expensive-decision` to `day-one` (`218dc14`, pull request #157). `04_PROOF.md` and `04_PROOF_RECORDS.md` carry the same text. A merge to `main` builds and promotes production; no production readback of these is recorded here. The record is in `history/LOG.md` under 2026-09-07.
- Domains are unchanged: `mindmake.co` is canonical (Vercel DNS); `www.mindmake.co`, `themindmaker.ai` and `www.themindmaker.ai` 308-redirect to the apex in one hop with path and query preserved. The publication stays at `https://mindmakerlive.substack.com`. CTRL serves at `ctrl.mindmake.co`.
- Routes did not change with the rebuild: it replaced what the three pages say and how they behave, not the route contract, so every redirect and crawler surface keeps its shape. Since 4 September 2026 one URL form is canonical: `vercel.json` sets `trailingSlash: false`, so `/ai-brain/` is a 308 to `/ai-brain`; `/intake` and `/testimonials` redirect permanently; `/start` and `/decision` stay temporary on purpose, as short links people type.

## Current approved release journey

The homepage is the accepted R3 composition: opening, historical stories, work and organisation, leadership dividend, the AI Brain / AI GTM route choice, and footer. Its history and dividend chapters use native reversible scroll-pinned sequences, with natural-flow controls for reduced-motion or insufficient-height viewports. The separate new-age leadership route remains the approved companion page.

Both public doors and the homepage open the same production `LeadBrief`. The visitor enters a work email, adds their name and business role, sees the corroborated company read, chooses a problem and where returned time would help, then sees what AI can carry, what stays with them and a useful first proof. Keeping the brief is an explicit action followed by email verification. The delivered proposal remains visible and downloadable independently of email delivery. No step silently subscribes the visitor to the publication.

The older personal-read API remains deployed and was separately verified; it is not evidence of a distinct personal-read form in this new frontend. The historical live-board layout described below is not the approved R3 homepage. Current public labels are Results, Thinking, Questions leaders ask, Before you start, Media and Start here.

## Historical visitor journey (recorded 7 September 2026)

Two doors, one paid proof, and two ways to be read.

Both doors ask for the same four things, in the same component, with the same rules: first name, last name, work email and the part of the business they work in. The company comes out of the email's domain, so nobody types it twice, and a personal address is refused on both sides with a message that puts the limitation on us rather than on the visitor. What each page does with those four things is different, and deliberately so.

- **The company read** (`/ai-gtm`): the details hand to the existing brief pipeline, unchanged, and the six-digit code still stands between the visitor and anything reaching us. This is the Gate E hand-off approved on 27 August 2026, reached from a new place. The read the visitor came for is the preview step. The branded proposal then arrives on screen, by email and as a self-contained attachment, as the canon promises; on screen it wears the step's own surface, and paper is for the email and the attachment. `src/test/proposal-on-screen.test.tsx` holds it there, because on 29 August 2026 it was removed for a whole commit without a gate objecting and put back the same day.
- **Every dead end** (site-wide): nine paths can fail, and each one now ends in
  an apology, a dry line about our own machine and one way to reach a person
  rather than in a line of grey text with nothing under it. The offer posts to
  `mindmake-personal-read`, which tells the operator and sends the visitor
  nothing, because two emails ever is a published promise and a handoff is
  neither of them. `05_LEAD_DELIVERY_SPEC.md` lists the nine, the two paths that
  deliberately have none, and the three things about the action that are there
  to stop it failing for the reasons the read did.
- **The personal read** (`/ai-brain`): the server resolves the company from the email domain and the person from their name plus that company, and the read assembles on screen in the same grid the company read uses. It used to want a LinkedIn URL, which most people have to go and find, and composed a preview locally from two template lines, so everyone who tapped the same chips saw the same thing. A read that resolves the company but not the person says so on the page rather than passing itself off as more than it is. The preview now costs a paid provider call, so it sits behind the same rate limiter the send does.
- **The live board** (`/ai-gtm` and the homepage): since 2 September 2026 a departures board on both surfaces, rows rather than cards, filtered by the part of the business the reader runs (the site's own eight divisions, the same list the lead dialog asks for) and by industry. It reads the retained window rather than the day: seven days on the homepage, 28 on `/ai-gtm`. Every row carries its own age, the stamp beside the heading carries the read time and the item count, the row count follows the screen's height (three rows below 700px, four on a tall phone, eight on a laptop), and every headline is written out in full in the markup before anything turns. If the read is unavailable the section shows a heading and one honest line; it never renders an empty frame. Fed by the public `get-ai-news` function from the daily cache.
- **The why** (`/new-age-leadership`): the argument page, rebuilt on 2 September 2026 as a set of the site's own instruments with one line on each, linked once from the homepage. It is the one page whose job is the reason rather than the brief.

Every visitor who converts receives exactly two emails: the results they asked for, and one follow-up fourteen days later. Nothing else, ever. The mechanism is a unique row per address per journey, not a policy anyone has to remember.

## Lead and data backend

Supabase project `bkyuxvschuwngtcdhsyg`.

| Function | Version | verify_jwt | Role |
|---|---|---|---|
| `submit-mindmake-brief` | v20 | off | Verified code, company brief, visitor/operator delivery and day-14 enqueue; uses the corroborated literal company read and owned-alias choice binding |
| `enrich-company` | v44 | on | Exact-domain and corroborated identity; literal factual read and first-party source titles; tailored choices retained |
| `get-ai-news` | v70 | off | Live board/cache read; version read back on 24 September, not redeployed by this repair |
| `mindmake-personal-read` | v25 | off | Personal read, results email and follow-up enqueue; canonical owned-domain lookup; existing handoff retained |
| `send-follow-ups` | v5 | off | The day-14 follow-up. Cron only. v5 (5 September 2026) carries the duration-free proposal copy; both of its files read back byte-identical to the repository |
| `aa-price-snapshot` | v3 | off | Daily model prices. Cron only; version read back on 24 September, not redeployed by this repair |

- Migrations added: `mindmake_follow_up_and_personal_read`, `aa_model_snapshots`, `mindmake_scheduled_jobs`, `mindmake_public_rpc_wrappers`. All four are idempotent and all four are registered in the remote migration history, so the repository and the database agree. On 29 August 2026 `handoff_reason` was added to `public.mindmake_personal_reads`, `q1` and `q2` became nullable under `mindmake_personal_reads_shape_check`, and the table still carries zero policies.
- New tables are RLS-on with no policies, reachable only by the service role. No existing policy was loosened and no anon policy was added to anything.
- Scheduled jobs: `mindmake-brief-retention-daily` (`17 2 * * *`), `mindmake-follow-up-daily` (`20 9 * * *`), `mindmake-aa-price-snapshot-daily` (`0 11 * * *`). The two new jobs call their function over HTTP with the Vault secret `mindmake_cron_secret` in the `x-mindmake-cron-secret` header, and each function refuses without it. This is the pattern the project's eight existing jobs already use.
- Price history: 624 rows for 28 August 2026, the first day. This is the one thing here that cannot be back-filled, which is why it runs before anything renders it.
- Configuration names are unchanged from Gate E, plus `MINDMAKE_CRON_SECRET` for the two scheduled functions.
- Retention: unverified brief requests purge after 7 days, rate-limit hashes after 48 hours, verified records at 12 months, sent follow-up rows after 7 days, unsent rows after 60 days, personal reads at 12 months. The privacy notice states the same schedule.
- `VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED` is `true` in production, so the three dead ends inside the lead dialog exist on the live site rather than only in a build with the flag on.

## Historical verification baselines — 5–7 September 2026

Last measured 5 September 2026, against the built output, for the edge rewrite. The readings that set each gate's floor, and every earlier baseline, are in `history/LOG.md` under the date they were taken.

- Tests: **450 across 29 files**, all passing.
- Typecheck: **0 errors**, against `tsconfig.app.json`, and the build runs it first.
  An earlier version of this file claimed `tsc` was clean when it had never run:
  the root `tsconfig.json` carries `"files": []` with project references, so
  `npx tsc --noEmit` checked nothing and exited 0 over seventeen real errors.
  Never point the typecheck at the root config.
- Lint: **0 errors, 2 warnings** (react-refresh advisories in two long-standing files). Do not add new problems.
- Build: prerenders **21 indexed routes**; the sitemap and prerender parity check runs inside the build. One social plate per indexed page and post, 21 in all, painted by a browser and committed, and `src/test/discoverability.test.ts` fails until a changed headline is repainted with `npm run social-plates`.
- Browser gates, every one green at 1440 and 390 on the built output: rhythm (45 sections across 4 pages), screens (8 sizes, 4 pages, nothing past 1.35), one way in (10 pairs), no-JS (5 pages, 50 answers present), cards (18 on `/`, 33 on the archive), images, dead CSS, chrome (its own eight sizes and two text scales), dialog shape, handoff, redirects, entrance (clean on every path, page replaced 0x), and aliveness (30 viewports at 1440, 33 at 390). What each gate measures, why it exists and how its floor was calibrated is in `CLAUDE.md` under "Required checks".
- Quotes (7 September 2026): every excerpt in `src/data/testimonials.ts` is an exact substring of its revised full quote and within the 108-character cap, and each of the eight client stories in `src/data/rebuildProof.ts` names its voice and takes the whole quote and the role from that file; `src/test/testimonials.test.ts` holds both. Measured on the rail at nine widths from 320 to 1920 on `/` and `/case-studies/`: every card equal at 177.3px from 360 up, nothing clipped. Tests 450 across 29 files, lint 0 errors and 2 warnings, typecheck 0 errors, unchanged; cards, screens and no-JS gates green on the built output.
- Rendered DOM of the seven routes scanned: no duration promise, no em dash, no `judgment`, the operator's name only in the founder section, the drum heading and quotes.
- The two-email cap was proven rather than asserted on 29 August 2026: three successful sends to one address produced exactly one queue row, and the fourth was rate-limited. Test rows were deleted afterwards.
- Historical 7 September position: the V5 motion study, gateway candidate and V8 mock locks had been removed. **Superseded on 24 September:** the accepted R3 prototype is immutable, its production adapter is deterministically compiled and drift checked, and the current release requires source-bound browser evidence. See the release record above; the old no-lock statement is not current policy.

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
| The enemy pair, the ladder, the fork, the board | Homepage and door-page sections. The enemy pair is the oracle and the mirror cards resolved by one claim (the `mm-enemy` class now carries the three things the work answers on the homepage); the board is the live daily market read on `/ai-gtm` and the homepage. The ladder (the three levels of value, `ClimbLadder`, the site's one pinned climb) and the fork (`ForkBand`, the paper band where a visitor picked a starting point) were deleted from `/ai-brain` on 5 September 2026 because they made the argument the homepage and `/new-age-leadership` already make; the names survive only in the record. |
| `mm-covered`, `.mm-curtain` | The entrance's root marker and the fifteen ink strips it keys, two names on purpose since 4 September 2026. `var CURTAIN` in `index.html` is the one switch. |

## Historical open-item register — retained from 7 September 2026

These entries retain their original dated context; they are not a claim that only one item remains for the 24 September release. Current release gates and the narrowly scoped physical-AT exception are recorded above and in the release record.

1. **The branded mailboxes are the one thing still owed.** See item 3. Everything else the rebuild needed is live.
2. **The day-14 follow-up is live, and the first one can send on 11 September 2026.** `submit-mindmake-brief` v13 was deployed straight after the 28 August promotion, so the enqueue and the privacy notice describing it went live together. The deployed body was verified to carry it. `follow_up_queue` was empty at that moment, so nothing predates the notice.
3. **The branded mailboxes do not exist yet, and the site does not pretend they do.** `mindmake.co` has no MX record, so `hello@mindmake.co` and `privacy@mindmake.co` would bounce. Every contact link therefore reads one constant, `CONTACT_EMAIL` in `src/lib/publicLinks.ts`, currently set to the mailbox that does receive. To switch: add the MX record, create the two aliases, change that one constant.
4. **The films are the real delivery.** Six films landed on 28 August 2026, each with an mp4, a webm and a poster taken from its own first frame. Loops are silent and under 1.7MB; the sixty-second proof film on `/ai-brain` is click-to-play and fetches nothing until asked. A twenty-second cut of the proof film also exists in the delivery and is not used on the site yet.
5. **Credential rotation**: rotate the GitHub, Vercel, Supabase and Resend credentials shared during this and the launch sessions.
6. **`get-model-data` v24 is still deployed** with no caller in this repository. Retiring it needs CTRL-side confirmation first.
7. **Physical device checks**: iOS Safari, Android Chrome, VoiceOver and TalkBack remain a post-launch checklist; emulation evidence was accepted for launch.
8. **CTRL old host**: repoint `ctrl.themindmaker.ai` to `https://ctrl.mindmake.co` after one confirmed authenticated CTRL login on the new host.
9. The `themindmaker.ai` Resend domain still shows a failed verification; legacy senders on that domain stay unreliable until its DNS is repaired or the domain is retired from Resend.

Carried from the dated entries, still open on 7 September 2026. The reasoning behind each is in `history/LOG.md` under the date given.

10. **Method wording awaits Krish** (3 September): the one sentence on the method on the brain door, and the "How it learns you." section on `/ai-brain`, were proposed for sign-off. The method is described, never named, per the canon.
11. **CTRL is not yet writing `affects` and `stance`** into `live_headlines_cache` (read directly on 2 September: every retained day reports 0 with either), so the board's role filter still runs on the projection from subject categories. The board's `pov` line stays off until it is written in a voice this site can publish: on the day it was measured 25 of 29 were commands addressed to the reader and 9 carried American spellings. Both are upstream changes to CTRL's classifier, and the addendum asking for them is written. Nothing on this side is waiting; the moment a row carries the fields, they flow.
12. **`get-ai-news` returned one day for a seven-day request** on 3 September. The heading and the stamp are honest either way; the window question is upstream.
13. **`/new-age-leadership` (340KB) and `/blog/:slug` (124KB) stay lazy** against a 348KB entry bundle, and were never measured for the hydration cost. Deliberate, and not known to cost anything, which is not the same as known to be free.
14. **`src/index.css` styles bare `h1` to `h6`, `p` and `small`**, and the privacy strip (4 September) was the third live defect that file has caused. Removing those rules is not a no-op: measured across five pages, paragraphs move from 16px to 17px and the blog's `small` from 14px to 8.4px, because the design system's own defaults have been dead underneath them. That is a change with a visual pass attached.
15. **Share cards**: nothing here can say how a share looks on LinkedIn or on X until one is posted; both cache by URL, so the first share of each page fetches the new plate. A post's plate uses its category's film until it earns a still of its own. The 404 for an unknown route is Vercel's plain text; a branded page would be `dist/404.html`, which the prerender does not write yet.
16. **A face that lands after the 700ms hold can rewrap a line** that sits near its column's edge (seen once on the hero claim through the forwarder on 4 September). Metric fallbacks match average width, not every string. A known limit, recorded rather than fixed by tuning one string.
17. **Pre-existing and out of scope** (3 September): retired routes hydrate the homepage's prerendered markup against a different route; whether a privacy notice is needed at all for cookieless analytics.
18. **Resolved 24 September: wrong-company read for `themindmaker.ai`.** The historical 5 September failure was reproduced and repaired with domain/name corroboration, literal factual evidence and the documented owned-domain alias. Fresh live canonical and legacy reads returned Mindmake; the actual personal-read send passed. The earlier wrong-founder result must not be treated as acceptable provider behavior or current output.
19. **A story that ran on two days is shown once** on the board. Nothing upstream promises an id is unique across days; 28 days of live data had no duplicate on 2 September, which is not a guarantee.
20. **The three-question form on `/ai-brain`** ran 1.88 screens and is exempt from the screen budget by name (last measured 1 September). Making it two steps would fix the height and change a working conversion surface, which is a decision rather than a fix.

</details>

### Original: project-documentation/07_DEPLOYMENT.md

Raw SHA-256: `11f86b5d5ec997eb314aae00db105b36da0b7c5eae8c27b7df9f57b4615ab4cb`

<details>
<summary>Full pre-consolidation document</summary>

# Mindmake deployment

Last updated: 24 September 2026 (approved R3 production promotion and backend evidence).

This file records how the live Mindmake site is deployed and how to change it
safely. Current identifiers live in `06_CURRENT_STATE.md`, and the ordered
launch steps live in `07_DEPLOY_RUNBOOK.md`.

## Live topology

| Surface | Owner | Behaviour |
|---|---|---|
| `mindmake.co` | Vercel project `mindmake` (`prj_GqamX3psD0cGpGCDXRu0ljET7zap`, team `team_iXZBozK4Ss7NHuyNk8L9wmO6`) | Canonical public site |
| `www.mindmake.co` | Same project | 308 redirect to the apex, path and query preserved |
| `themindmaker.ai`, `www.themindmaker.ai` | Same project (DNS at Cloudflare, records point at Vercel) | 308 redirect to `https://mindmake.co`, path and query preserved |
| `mindmakerlive.substack.com` | Substack | The publication. `/signal` and `/builder-economy` redirect here. `content.mindmake.co` is not in use (owner decision, 26 August 2026) |
| `ctrl.mindmake.co` | Vercel project `mm-ctrl` | Serves the CTRL product |
| `ctrl.themindmaker.ai` | Vercel project `mm-ctrl` | Still 308 redirects to `makeyourmindup.ai`; repoint to `ctrl.mindmake.co` after one confirmed authenticated CTRL login on the new host |

`mindmake.co` DNS is hosted on Vercel DNS (`ns1/ns2.vercel-dns.com`). The zone
also carries the Resend DKIM record (`resend._domainkey`), the return-path
records on `send.mindmake.co` (MX plus SPF TXT) and `_dmarc` with `p=none`.
There is no MX on the apex: no mailbox exists at `@mindmake.co`.

## Build and promote

### Current R3 release procedure

The authority, scope, exact rollback anchor and actual deployment receipt are in [RELEASE-2026-09-24](website-redesign/RELEASE-2026-09-24.md). Approved R3 is live from PR #170, merge `3ee77cf`, deployment `dpl_EZigNAi6Uc6Apcq75XsFnHETt5W8`. Keep the recorded pre-promotion deployment as the recoverable rollback target.

1. Preserve immutable approved `homepage-production-synthesis-r3`. Generate its production adapter with `scripts/qa/build-homepage-release.mjs`; run its `--check` drift gate. Only the approved history/dividend scroll-pin behavior changes are authorized, not a new composition or copy rewrite.
2. Run the full unit suite, application typecheck/lint/build and source/approval locks against the exact candidate. Earlier prototype receipts and backend-only tests do not satisfy the production build gate.
3. Exercise the **built** candidate in Chromium, Firefox and WebKit: every history/dividend state, pin geometry, forward/reverse traversal, entry/exit, reduced-motion and insufficient-height behavior; run route smoke/continuity and lead-flow checks. Capture source-bound evidence, not screenshots alone.
4. Run the feedback ledger/review gates and reject unresolved owner feedback. The only accepted exception is physical iPhone VoiceOver and Android TalkBack for this release; neither is a pass, and no other gate is waived.
5. Match backend target/version/source readback and actual inbox/persistence/queue/download evidence to [the backend receipt](website-redesign/BACKEND-RELEASE-EVIDENCE-2026-09-24.md). Its final deployed versions are enrichment44, brief20 and personal25; the last two increments are runtime-equivalent type corrections. Preserve domain/name corroboration, literal factual evidence and the explicit owned alias without changing recipients.
6. Promote only after those gates pass, then verify the public domain, routes, assets and working flows. Record exact commit/deployment/rollback identifiers and residual physical-AT follow-up in the release record and current state. Backend deployment and frontend promotion are separate claims.

Vercel builds from GitHub (`krishanraja/mindmake`). A merge to `main` builds
and promotes production. The production build uses:

- `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` / `VITE_SUPABASE_PROJECT_ID`
  for Supabase project `bkyuxvschuwngtcdhsyg` (its display name in Supabase is
  still the legacy "Mindmaker AI").
- `VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED=true`: the private email hand-off is
  live. Gate E was approved by Krish and closed on 27 August 2026 with a
  synthetic end-to-end lead from `mindmake.co`.

Identifiers: the launch merged commit was
`e520952a182d29312fa2878dd3f963740c1dccb7` (pull request #141, production
`dpl_7KNTh3AhLsRKCbxUbq6oGeQ7EiH6`). The current production deployment and
rollback target are recorded in `06_CURRENT_STATE.md` and move with each merge.

## Backend

Supabase project `bkyuxvschuwngtcdhsyg`. Six functions belong to the site;
everything else in the project belongs to CTRL and is not ours to touch.

| Function | verify_jwt | Called by |
|---|---|---|
| `submit-mindmake-brief` | off | The browser, for the company read |
| `enrich-company` | on | `submit-mindmake-brief` |
| `get-ai-news` | off | The browser, for the live board and the homepage proof card |
| `mindmake-personal-read` | off | The browser, for the personal read |
| `send-follow-ups` | off | pg_cron only |
| `aa-price-snapshot` | off | pg_cron only |

Deploys go through the Supabase Management API with the function's **full
import closure**; after every deploy, verify the deployed body against the
repository and run one synthetic call. Current versions live in
`06_CURRENT_STATE.md` and move with each deploy.

The two browser-called new functions check a strict origin allowlist before
they do any work, and rate-limit on one-way HMAC identifiers rather than on a
raw address or IP. `get-ai-news` reads only the daily cache when asked for the
board, so the board can never invent a fresher answer than the one it has.

The two cron-called functions are reached over HTTP by pg_cron with the Vault
secret `mindmake_cron_secret` in the `x-mindmake-cron-secret` header, and each
refuses without it. This is the project's established pattern and it is why
they carry `verify_jwt` off: the guard is in the function, and the secret is
never in a migration.

- Migrations: `mindmake_brief_requests`, `mindmake_brief_retention`,
  `mindmake_follow_up_and_personal_read`, `aa_model_snapshots`,
  `mindmake_scheduled_jobs`, `mindmake_public_rpc_wrappers`. All are
  idempotent and all are registered in the remote migration history.
- Every table the site writes is RLS-on with **no policies**, so only the
  service role reaches it. Adding an anon policy to any of them is a
  regression, not a convenience.
- PostgREST reaches only the `public` and `graphql_public` schemas, so a
  routine in `private` needs a thin public wrapper to be callable from an edge
  function. That is what `mindmake_public_rpc_wrappers` is for; a new private
  routine needs the same treatment or it will fail with a 503 at runtime.
- Scheduled jobs: `mindmake-brief-retention-daily` (`17 2 * * *`),
  `mindmake-follow-up-daily` (`20 9 * * *`),
  `mindmake-aa-price-snapshot-daily` (`0 11 * * *`).
- Configuration names (values live only in Supabase): `RESEND_API_KEY`,
  `MINDMAKE_RATE_LIMIT_SALT`, `MINDMAKE_VERIFICATION_SECRET`,
  `MINDMAKE_BRIEF_FROM` (`Mindmake <briefs@mindmake.co>`),
  `MINDMAKE_OPERATOR_EMAIL` (`krish@themindmaker.ai`),
  `MINDMAKE_PUBLIC_URL` (`https://mindmake.co`),
  `MINDMAKE_ALLOWED_ORIGINS` (`https://mindmake.co,https://www.mindmake.co`),
  `MINDMAKE_CRON_SECRET`, `ARTIFICIALANALYSIS_API_KEY`, and the enrichment
  provider keys.

### The two-email cap

The public pages promise a visitor exactly two emails: the results they asked
for, and one follow-up fourteen days later. That promise is held by mechanism,
not by discipline: `follow_up_queue` is unique on `(email, source)`, so a
returning visitor cannot stack a second row; each send is keyed on the row's
id, so a re-run cannot duplicate; and `sent_at` is written only when the
provider accepted. A used row is deleted after seven days.

Anything that would add a third send, whether a sequence, a nurture or a list
import, breaks a published promise. `src/test/mindmake-brief-backend-core.test.ts` and
`src/test/brief2-email-cap.test.ts` walk every function to catch a new sender,
so adding one fails the suite before it can ship.

Email identity: `mindmake.co` is verified in Resend; SPF, DKIM and DMARC all
pass in a real inbox. Reply-To on verification and visitor emails is
`krish@themindmaker.ai`; the operator email goes To that mailbox with the
verified visitor address as Reply-To. The old `themindmaker.ai` Resend domain
shows a failed verification and legacy senders on it are unreliable.

Retention: unverified requests purge after 7 days, rate-limit hashes after
48 hours, verified records 12 months after their last update, sent follow-up
rows after 7 days, unsent follow-up rows after 60 days, and personal reads at
12 months. Deletion requests come through the published contact address and a
manually verified private process.

Operations: check the Resend logs and the Supabase function logs daily for
failures, rate-limit spikes and bounces. A provider `queued` response is not
proof of inbox delivery.

## Rollback

Per surface, never all at once:

| Failure | Action |
|---|---|
| Site regression | Promote the rollback deployment named in `06_CURRENT_STATE.md` from the Vercel dashboard |
| Domain or certificate failure | Detach the affected domain from the project and re-attach after the certificate re-issues |
| V2 function failure | Revert the function to its previous version in Supabase; never drop the lead tables. If the failure leaks bad content to visitors, ship a build with the flag off while the function is repaired |
| Email failure | Repair sender configuration and rerun the synthetic matrix before trusting deliveries again |
| A follow-up must not go out yet | Hold the job rather than deleting queued rows: `select cron.alter_job((select jobid from cron.job where jobname = 'mindmake-follow-up-daily'), active := false);` |
| The board is wrong or stale | Nothing to roll back. It reads only the daily cache, states its own age, and collapses to one honest line if the read is unavailable. Repair the cache, not the page |

`VITE_` values are build-time: changing an environment variable alone changes
nothing until a new build is promoted.

</details>

### Original: project-documentation/07_DEPLOY_RUNBOOK.md

Raw SHA-256: `723d4ec3df8ea41aa7d14e16d78997573d830bc185c5da2c88bb2cc2395e4970`

<details>
<summary>Full pre-consolidation document</summary>

# Deploy runbook: the rebuild's backend

## Current backend release — 24 September 2026

Backend deployment is complete and frontend R3 is live from PR #170, merge `3ee77cf`, deployment `dpl_EZigNAi6Uc6Apcq75XsFnHETt5W8`. The frontend release authority, gates and public readback are in [RELEASE-2026-09-24](website-redesign/RELEASE-2026-09-24.md). Exact backend evidence, source hashes, canary IDs and cleanup are in [BACKEND-RELEASE-EVIDENCE-2026-09-24](website-redesign/BACKEND-RELEASE-EVIDENCE-2026-09-24.md), whose final addendum records the final versions below.

1. Verify authenticated target `bkyuxvschuwngtcdhsyg`; never use a connector exposing only a different project. Do not read or log credentials.
2. Preserve exact-domain provider checks, corroborated company identity, literal factual descriptions and first-party source titles. Only the documented owned alias `themindmaker.ai` maps to `mindmake.co` for research/signatures; email recipients remain unchanged. Missing corroboration stays honest, not a fabricated successful read.
3. Run the provenance/brief/personal regressions and Deno checks for all affected closures. This repair passed 67 targeted tests and all three closure checks.
4. Deploy the full affected import closures with the official CLI to the exact project, preserving JWT flags; independently download/read back the deployed sources. Do not deploy unrelated CTRL functions or alter tables/policies for this source-only repair.
5. Verify real canonical and owned-legacy company reads, then only the authorized operator-inbox canaries. Actual inbox receipt, persisted state and one due follow-up row are required; provider `queued` alone is insufficient. Never invoke the live cron sender to test a future follow-up.
6. Capture exact synthetic IDs, delete only those test rows and confirm zero. Keep ordinary customer rows/queues untouched. Verification codes and full email bodies do not belong in evidence files.

Backend preparation: code verification, visitor brief and operator digest reached INBOX through the previous live frontend; personal-read preview/send also passed through its public API and its email reached INBOX. Both journeys persisted the expected rows and one day-14 queue each; exact synthetic rows were removed and checked absent. The private-brief HTML generator was downloaded with a representative fixture and inspected at desktop/mobile widths, self-contained and without overflow. These checks alone do not prove the new frontend's complete visitor-to-download flow; its post-promotion canary is recorded separately in the release evidence. Print PDF was generated, not independently visually graded. Physical VoiceOver/TalkBack remain the owner's explicitly recorded, release-only exception, not passes.

## Historical background

Originally written 28 August 2026, after the work below was applied and verified against
the live project. It is here so the same steps can be repeated, checked or
rolled back by someone who was not in the room.

Project: `bkyuxvschuwngtcdhsyg`. Everything below is additive. No existing
policy was loosened, no anon policy was added to any table, and the four new
tables are RLS-on with no policies, which means service role only.

## What is deployed — independently read back 24 September 2026

| Function | Version | verify_jwt | Called by |
|---|---|---|---|
| `get-ai-news` | v70 | false | The browser; unchanged by the 24 September repair |
| `enrich-company` | v44 | true | Domain-bound corroborated company read and tailored choices |
| `mindmake-personal-read` | v25 | false | Personal preview/send and existing human handoff; final increment is type-only |
| `send-follow-ups` | v5 | false | pg_cron, daily at 09:20 UTC; not invoked for this canary |
| `aa-price-snapshot` | v3 | false | pg_cron, daily at 11:00 UTC; unchanged by this repair |
| `submit-mindmake-brief` | v20 | false | Verified company brief, both deliveries and active day-14 enqueue; final increment is type-only |

`get-ai-news` gained a board view and kept its previous response byte for byte.
The two scheduled functions are public at the edge and guarded in code on the
`x-mindmake-cron-secret` header, which is the pattern the project's other
scheduled functions already use.

## Migrations applied, in order

1. `20260828120000_mindmake_follow_up_and_personal_read.sql`: `follow_up_queue`,
   `mindmake_personal_reads`, the private rate-event table and its consume
   function, and the purge routine.
2. `20260828121000_aa_model_snapshots.sql`: the daily price table.
3. `20260828122000_mindmake_scheduled_jobs.sql`: `pg_net` and `pg_cron`, then
   the two jobs. `cron.schedule` upserts by name, so replaying is safe.
4. `20260828123000_mindmake_public_rpc_wrappers.sql`: public wrappers for the
   two private routines. PostgREST reaches only the public schema, so an edge
   function cannot call a routine in `private` directly. This mirrors the
   wrapper the brief pipeline already uses.
5. `20260828170000_personal_read_name_and_division.sql`, applied 29 August 2026
   and registered as `20260829065615 personal_read_name_and_division`: three
   nullable columns on `mindmake_personal_reads` for the visitor's name and
   division, with a check constraint on the division mirroring the allowlist the
   edge function parses against, and a length ceiling on the names. Additive, so
   the function still running the old body was unaffected by it. RLS unchanged:
   still on, still no policies.

## The one secret

`mindmake_cron_secret` exists in two places and must hold the same value:

- Supabase Vault, read by the cron jobs when they build the request header.
- The function environment as `MINDMAKE_CRON_SECRET`, read by the two scheduled
  functions when they check it.

It was generated at deploy time and never written to the repository. To rotate
it, create a new Vault secret under the same name and update the function
secret to match; the jobs read the newest row.

## Historical verification — August 2026

- `aa-price-snapshot` rejected a wrong header with 403, then recorded 624 models
  for 2026-08-28.
- `send-follow-ups` rejected a wrong header, then ran clean against an empty
  queue.
- `mindmake-personal-read` rejected a disallowed origin, an unexpected body key
  and an out-of-range answer, then delivered a real email.

### The 29 August deploy, verified against the live function

Ordered so the incompatibility window was as short as it could be. The old site
sent `linkedin_url` and the new function refuses it; the new site sends
`first_name` and the old function refused that, so some window was unavoidable.
The migration went first (additive, so it changed nothing for the running
function), then the merge to `main`, and the function went out the moment Vercel
had promoted. The window was the seconds between those last two, and it touched
only the read button on `/ai-brain`.

- The deployed body was checked, not the deploy call's response: the bundle
  carries `personal-email`, `buildRead`, `DIVISION_LINES` and
  `FREE_EMAIL_DOMAINS`, and the three remaining `linkedin_url` occurrences are
  the comment saying the field is gone plus the two that read the URL out of
  PDL's answer.
- Contract probes against the live function: `linkedin_url` returns
  `unexpected:linkedin_url`, a gmail address returns `personal-email`, a missing
  or unknown division returns `division`, an empty name returns `first_name`,
  and a disallowed origin returns 403.
- **The PDL swap was measured, not assumed.** Name plus the email's domain
  resolved two of three very public test subjects: Benioff at salesforce.com and
  Collison at stripe.com came back with role and company; Nadella at
  microsoft.com returned 404, "No records were found matching your request".
  A fallback that also tried the domain's bare label was built, deployed and
  removed again, because every match came back on the domain and the second call
  therefore only ever ran on a miss, which is the worst place to spend a paid
  call.
- The first version of `enrichProfile` logged nothing on failure, so a swap that
  had stopped resolving anybody would have looked exactly like a run of
  hard-to-find people. It logs the provider's status and message now, and
  nothing about the person.
- PDL returns lowercase, so the read opened with "You are chief executive
  officer at salesforce". A provider's storage convention is not a fact about
  the company: `present()` capitalises all-lowercase words and leaves anything
  already carrying a capital alone, so eBay and iRobot survive it.
- One synthetic end-to-end lead to `krish@themindmaker.ai` from
  `https://mindmake.co`: delivered, the stored row carried the name, the division
  and the resolved role and company, and it produced exactly **one**
  `follow_up_queue` row due fourteen days out. Both test rows were deleted
  afterwards.
- Three successful sends to the same address produced exactly **one**
  `follow_up_queue` row, which is the two-email cap holding in practice rather
  than in prose. The fourth send inside the hour returned 429.
- `get-ai-news` returned 28 days and 417 corroborated items on the board view,
  and its legacy headline response unchanged.
- The synthetic rows were deleted afterwards. The price history was kept,
  because it cannot be back-filled.

## Rolling back

Each function has a version history in the Supabase dashboard; redeploying the
previous version is the fastest reversal. To stop the new scheduled work
without touching the functions:

```sql
select cron.unschedule('mindmake-aa-price-snapshot-daily');
select cron.unschedule('mindmake-follow-up-daily');
```

Dropping the tables is not part of a rollback: `aa_model_snapshots` holds price
history that cannot be recovered once deleted.

## Launch, as it happened

All three steps ran on 28 August 2026, in this order, except the first.

1. **The mailboxes were not created**, because `mindmake.co` still has no MX
   record. Rather than ship contact links that bounce, every one of them now
   reads `CONTACT_EMAIL` in `src/lib/publicLinks.ts`, pointing at the mailbox
   that receives. To finish: add the MX record, create
   `hello@mindmake.co` and `privacy@mindmake.co`, then change that one constant.

2. **The build was promoted.** Merge `7557254`, deployment
   `dpl_HAoncV1RF3hcvcanqo7Yvc4tuAng`.

3. **`submit-mindmake-brief` was deployed last**, from merged `main`, with its
   full eighteen-file import closure. It went to v13, and the deployed body was
   verified to carry `queueFollowUp`, `follow_up_queue`, `FOLLOW_UP_DAYS = 14`
   and the `email,source` conflict target. The queue was empty at that moment,
   so no follow-up predates the privacy notice that describes it.

If the promotion is ever rolled back, roll this function back too. A follow-up
queued by a build that is no longer live is a promise nothing on the site is
making any more:

```sql
select cron.alter_job(
  (select jobid from cron.job where jobname = 'mindmake-follow-up-daily'),
  active := false
);
```

Hold the job; never delete queued rows. A visitor who asked for their read is
owed the follow-up, just not from a site that has reverted.

## Still outstanding

- `get-model-data` remains deployed and unused. The marketing repository has no
  callers. It should be retired once someone confirms the CTRL side does not
  call it either.
- The migrations are registered in the remote migration history under their
  names rather than their file timestamps, which is how this project has always
  applied them. `supabase db push` is not the deploy path here; the Management
  API is.

## Release, 29 August 2026: the handoff

Two changes ship together. The order matters for the same reason it did on
28 August: the browser calls the function directly, so the function has to
understand the new action before a build that sends it is live, and the
database has to accept the new column before the function writes it.

1. **The migration first.** `20260829120000_personal_read_handoff.sql` adds
   `handoff_reason` to `public.mindmake_personal_reads`, relaxes `q1` and `q2`
   from required-always to required-together, and indexes the handoff rows the
   operator-notice cap counts. It adds no policy and collects no new personal
   data. Applied through the Management API, as every migration on this project
   is: `supabase db push` is not the deploy path here.

2. **Then the merge and the promotion.** Wait for Vercel to finish before the
   next step, because a build that offers a person while the function still
   rejects `action: "handoff"` would put a dead end at the end of a dead end.

3. **Then the function**, from merged `main`, with its full **sixteen-file**
   import closure: `mindmake-personal-read/index.ts` and `core.ts`, plus
   `_shared/http/resend.ts`, `_shared/logger.ts`, `_shared/retry.ts`,
   `_shared/timeout.ts`, `_shared/security/hmac.ts` and the eight files under
   `_shared/enrich/`. Verify the deployed body carries `parseHandoff`,
   `renderHandoffNotice` and `HANDOFF_NOTICE_WINDOW_MS`, then prove one
   synthetic handoff from `https://mindmake.co` and delete its row.

Rolling back the promotion means rolling this function back too, for the same
reason as the follow-up queue: an offer of a person that no live build makes any
more. The row is harmless either way, so nothing needs deleting.

### The dialog's shape

The same release repairs the lead dialog, whose entire structural CSS was
deleted by the strip commit of 28 August and shipped. It is a stylesheet-only
change with no backend or configuration to it, so it rides the promotion in step
2 and needs nothing of its own. `06_CURRENT_STATE.md` records what happened.

## Release, 5 September 2026: the edge rewrite

Copy only, on both sides of the lead pipeline, so no migration and no contract
change. The order was the usual one: the merge and the promotion first
(`6d39665`, `dpl_ZU6oQorQQcgpiD5YHARRFZHLo3Rg`), then `send-follow-ups` v5
and `submit-mindmake-brief` v16 from the working tree with their full
closures. Both deployed bodies were read back and every file is
byte-identical to the repository. One synthetic lead from `https://mindmake.co`
proved the code, the results email with its new label, the fit digest and
exactly one follow-up row; both rows were deleted afterwards. The record is
in `06_CURRENT_STATE.md`, "Promoted, 5 September 2026".

</details>


### Original: AGENTS.md

Raw SHA-256: `d5dfd9e150aa861d20a6bcd927e7f6d00093fd9542565b59303a4e19aca67dc8`

<details>
<summary>Full pre-consolidation document</summary>

# AGENTS.md

Entry file for coding agents working in Mindmake. Codex reads this file natively;
Claude Code and Cursor are routed here by their own rules.

**Read `NOW.md` first.** It is the current state of this repository in one file: what
it is, who it is for, what changed recently, what is waiting, and what not to trust.
It is validated on every push to `main` and reconciled against the code nightly, so it
is never more than a day behind the tree. Chronology lives in `project-documentation/history/LOG.md`.

## Approved website release and future revisions

Before touching the homepage, AI Brain, AI GTM, Start here journey, proof, case studies
or their shared visual system, read `project-documentation/website-redesign/STATE.md`
and `quality/website-redesign/continuity-contract.v1.json` completely. They are the
single resumable state and feedback contract for the active multi-session redesign.
Also apply and validate `quality/website-redesign/experience-quality.profile.json`;
it is the project adapter for the canonical harness experience-quality contract.
Run `npm run qa:website-restart` before any public-surface edit. Do not create another
competing state, strategy, handoff or feedback document.

For homepage recovery, also read
`quality/website-redesign/homepage-handoff.v1.json` and run
`npm run qa:homepage-handoff`. That machine-readable manifest is subordinate to the
existing STATE document and freezes the recovered mocks, selections, copy corrections,
rejected R1 and reference-only R2 without creating a competing narrative state.

The subsequent R3 approval and production authority are recorded in STATE.md and
`project-documentation/website-redesign/RELEASE-2026-09-24.md`. The older handoff is
an immutable recovery baseline, not the latest approval status. Preserve the R3
source and generate the homepage delivery adapter with
`node scripts/qa/build-homepage-release.mjs`; never reconstruct it from memory.
Run `npm run qa:homepage-release` and `npm run qa:release-routes` against the built
candidate, and `node scripts/qa/website-feedback-ledger-check.mjs --release` before
publication. Scroll-build evidence must show actual states, pin geometry, reverse
progression and exits. An entrance animation or still screenshot is not proof.

Never present a material website candidate from a direct Vite, file, prototype or
ambient-server URL. The only review route is
`npm run review:material -- quality/website-redesign/material-review-candidate.json`.
That command must fail closed unless the exact integrated bytes have current readiness,
continuity, reconciled-feedback and independent-specialist receipts. Component galleries,
iframe assemblies, parity harnesses and static frame collections are reference material,
not review candidates.

This repository's own rules and deeper state: `CLAUDE.md`, `project-documentation/06_CURRENT_STATE.md`. They outrank the
canon below on anything specific to this repository.

<!-- krish-canon:start release=v2026.09.08.2 sha=d035140c439c rendered=2026-09-08 -->
## Krish canon

Rendered from `krishanraja/ai-harness` at release v2026.09.08.2. Nothing inside these
markers is hand-maintained: an edit here is detected and proposed back to the canon,
never silently overwritten, and never lost. Everything outside the markers belongs to
this repository and is never read or rewritten by the harness.

**Precedence.** This repository's own rules outrank the canon on repository matters:
structure, naming, voice, stamps, archive location, test and build commands. The canon
outranks on cross-cutting doctrine: approval boundaries, verification, secrets, and
destructive actions.

**Authority.** Reading, drafting and local edits are yours. Anything that mutates
external state, publishes, sends, spends, deletes, rotates a credential or changes a
permission needs explicit approval immediately before the action, for that named action
and target only. Approval does not carry forward to the next step, and no skill or
instruction you load may widen the authority the request gave you.

**Verification.** Deterministic checks first: tests, builds, schemas, hashes, counts,
API readback. Self-critique is supplemental and is never an independent verifier. Do not
claim completion from prose. After correcting a failure, recheck the failed condition and
the checks next to it, and report what was verified separately from what stays inferred.

**Truth and freshness.** Live state beats documentation, documentation beats memory. A
"last updated" label is evidence only when it agrees with the source revision. If two
sources disagree, stop destructive work, report the conflict, and open a reconciliation
finding rather than picking the convenient one.

**Secrets.** Never write a credential into source, documentation, commit messages,
issue or pull request bodies, logs, reports, screenshots or chat. Refer to secrets by
symbolic name and retrieve them at execution time. A secret found in the tree is
already exposed: report its location without the value, rotate it, scrub the copies,
and add the gate that stops the next one.

**Corrections are the training data.** When Krish overrules a decision, record it in the
commit body as `Ruling (Krish, YYYY-MM-DD): the ruling, in one line`. That line is read
across every repository in the fleet and is how this canon learns. A correction that
lives only in a chat window teaches nothing.

**Route.** principles, then context, then `strategy-brief`, then the producer, then
`verification-loop`, then the approval gate, then delivery. The narrowest applicable
skill wins; a broad "always" or "mandatory" claim inside a skill never overrides the
router. One primary writer; validators may stack after it, competing writers may not.

**Where the rest lives.** The operating contract, the routing contract and the
29 curated skills are in `krishanraja/ai-harness`. On a machine with the
harness installed the same skills are under the user skills root, and the local copy is
authoritative for reading; the repository is authoritative for what is correct.

**This repository's own rules:** `CLAUDE.md`, `project-documentation/06_CURRENT_STATE.md`
<!-- krish-canon:end -->

</details>


### Original: project-documentation/02_PUBLICATION.md

Raw SHA-256: `43c1b74d9b688e680cbd016112bcdf47f890bfe8491627d6da406e1fe513f1b6`

<details>
<summary>Full pre-consolidation document</summary>

# 02. The publication

*Current as of 28 August 2026.*

Mindmake's publication is the practice's front door for people who are not ready
to buy anything. It runs on Substack today at `mindmakerlive.substack.com`, which
is a hosting address rather than a name.

**It has exactly two channels. There is no third.**

- **The Money of AI**
- **Built with AI**

Do not invent a third channel. Do not blend the two. Do not revive an earlier
name for either. Every asset is traceable to one channel and passes that
channel's gate.

Long-form is the asset. Social is the trailer. LinkedIn, YouTube, TikTok,
Instagram and podcast appearances are all distribution for these two, never
formats of their own.

---

## House register

Tongue in cheek, dark humour, dry rather than zany. The comedy comes from the
gap between what is claimed and what the evidence shows, so the funniest line is
usually the accurate one placed next to the claim.

Two rules keep that from becoming corrosive. Both are hard gates in production.

- **The Kind Rule.** Irony points at claims, hype, incentives and decisions.
  Never at a named person's competence or character. "This pricing page assumes
  nobody owns a calculator" is in register. "This CEO is an idiot" is not. It
  applies to captions and thumbnails exactly as strictly as to the script.
- **The Rigour Rule.** The register can be sarcastic. The evidence handling is
  humourless. **The joke can never be the finding.** Every load-bearing number is
  attributed on screen to the party that produced it. Where the record runs out,
  say so plainly and without a punchline.

## The five standards

Every asset must be:

1. **Unique**, built on a real owned artifact rather than a summary of the news.
2. **Researched**, with every material number, quote and event sourced.
3. **Thoughtful**, naming the mechanism and steelmanning the best counterpoint.
4. **Kind**, warm with people and sharp with ideas.
5. **Helpful**, leaving the viewer a usable decision rule, frame or next move.

Failing any one blocks publication. If a piece has no owned artifact, flag the
gap rather than faking uniqueness.

---

## Channel one: The Money of AI

**Mandate.** Investigate how the digital world gets paid for, as attention,
content, distribution, access and the open web change.

**The question it always asks.** Who pays for this, where does value move, and
what mechanism changes when the shift lands?

**Audience.** Operators, founders, publishers, media commercial leaders,
strategically curious builders. Assume they read the news already. They are not
here for what happened. They are here for what it does to somebody's margin.

**Stance.** Interrogative and investigative, arriving at a committed view earned
through the inquiry. Never neutral. Never "time will tell".

**Antagonist.** Incentives, or a failing business model. Never a named villain.

**In scope.** Pricing and packaging, unit economics, positioning and competitive
strategy, build/buy/partner decisions, human labour and its cost, who captures
value.

**Out of scope by default.** Model releases, benchmarks, capability
announcements, governance and regulation commentary, pilot and partnership
announcements, funding rounds as events. A model release enters only when the
piece is about what it does to somebody's margin. **The event is never the
story.** If the spine is "X was announced this week", it is the wrong piece.

**Strongest artifact.** A commercial pattern, experiment or P&L reality observed
directly in advisory work or in Krish's own operating history. Second best is a
public document read carefully: a pricing page, an earnings deck, a
terms-of-service change, a rate card. Third is research alone, which yields
credible commentary but nothing uniquely ours.

**Opening.** A structural framing, a historical inversion, or an economic
tension. Never generic AI trend context. Never "AI is changing everything".

**Closing.** A forward-looking verdict, or a reusable economic lens the viewer
can apply to their own corner of the digital economy.

**Titles ask or answer a money question.** "Who actually pays for AI search"
works. "The state of AI search in 2026" does not.

### Formats

| Format | Length | Shape | Production notes |
|---|---|---|---|
| Money Trace | 6 to 10 min | One mechanism followed end to end. Money enters at A, exits at B, someone in the middle stops getting paid. | Built around a single diagram that grows on screen across the runtime. Talking head is secondary to the diagram. |
| The Artifact | 3 to 5 min | One live public artifact interrogated on screen: a pricing page, a rate card, a shift in terms. | Screen capture is the primary visual. Cursor and highlight, not slides. Timestamp and archive the artifact before recording. |
| Verdict | 90 sec to 3 min | A committed call on a live commercial question, with the counterargument stated and answered. | Talking head is acceptable here, because the value is the position rather than the mechanism. |
| Cold-open cutdown | 45 to 90 sec | Opens on the money question, lands one number, ends on the lens. | Vertical. Must work muted, so the number is on screen as text. |

The format is called The Artifact rather than Teardown, because The Teardown was
a retired Mindmake offer and reusing the word would revive a name the canon
retires.

**Risk to design around.** This is a mechanism channel, and mechanisms do not
survive a man talking in a room. Without a visual scaffold (a diagram, an
artifact on screen, a number that builds), keep the piece written and produce
only the Verdict and cutdown forms.

---

## Channel two: Built with AI

**Mandate.** Explore the people using AI to move from creator or operator to
builder, and reach the human reason underneath the stated reason for the build.
The durable idea: just as the creator economy meant anyone could broadcast, the
builder economy means anyone can build with AI.

**The characteristic move.** Surface the why, then the strategic why, then the
human why. The third turn is the piece. Ask warmly. The guest should feel seen
rather than interrogated.

**Audience.** Builders, would-be builders, creators crossing into building, and
people who need permission plus a usable first step.

**Stance.** Energetic, warm, scrappy, generous, dry humour available. The house
sarcasm dials down here. Aim irony at the industry around the builder, never at
the builder. The guest must finish looking more human, never more foolish.

**Antagonist.** The gate that says building requires permission, credentials,
funding or a large team.

**Strongest artifact.** The guest's lived story, met by Krish's own builder
experience. He builds, so he can go a layer deeper than a journalist can.

**Opening.** Enter through the build itself, an origin scene, or a strange
decision. Never the guest's CV. Never "tell us about your background".

**Closing.** Momentum plus an accessible handhold. The viewer should feel able to
begin.

**Hard rule.** Do not let the conversation become a stack tour. The third turn of
the why is worth more than a list of tools. A cut that is 80 percent tool names
is rejected.

**The helpful test.** Inspiration is paired with how the first imperfect version
actually happened. The ugly first one, not the polished current one.

**Titles enter through the build or the decision.** "He rebuilt his agency's
entire delivery model in a weekend" works. "Interview with [name], founder of
[company]" does not.

### Formats

| Format | Length | Shape | Production notes |
|---|---|---|---|
| Builder conversation | 25 to 45 min | Recorded call, both cameras on, entered mid-story. | The primary asset. Everything else is cut from this. Capture the guest's screen if the build can be shown. |
| The Build Itself | 3 to 6 min | Screen recording of the actual thing, narrated by whoever made it. | Show the working artifact including its rough edges. Do not re-record a clean version. |
| The Third Why | 60 to 120 sec | The single most retellable human moment from the conversation. | The highest-performing cutdown. Select for emotional truth, not for the smartest sentence. |
| First Version | 45 to 90 sec | How the first imperfect build actually happened. | Vertical. Ends on the handhold, not the outcome. |

**Supply constraint to design around.** This channel needs guests, and booking is
the bottleneck production cannot solve on its own. Keep a solo variant running
(Krish's own builds, held to the same three-why standard on himself) so the
pipeline does not stall when the calendar is empty.

---

## Routing

One source event can feed both channels, but only if each gets a genuinely
different question, structure, evidence emphasis and payoff. Copy-pasting the
same argument across both fails even when the openings differ.

- **The Money of AI** traces the economic mechanism and asks who pays.
- **Built with AI** finds the human motive and the usable beginning.

**The test:** if the interesting thing is a flow of money, it is The Money of AI.
If the interesting thing is a person's decision to make something, it is Built
with AI. If it is genuinely both, produce two assets with two different spines,
never one hybrid.

---

## Production pipeline

1. **Ingest.** A source artifact enters: a published essay, a recorded
   conversation, a screen capture, an observed commercial pattern, a public
   document.
2. **Verify authority.** Confirm the right to use it. Guest consent for Built
   with AI. Public or owned status for The Money of AI artifacts.
3. **Route.** Assign to exactly one channel using the money-versus-motive test,
   and record the reasoning.
4. **Extract one arguable angle.** Not a topic. An angle containing a claim a
   reasonable person could dispute.
5. **Source every material claim.** Every number, quote, date and contestable
   statement gets an attributable source captured at ingest, never reconstructed
   later.
6. **Select a format** from that channel's table. Do not invent formats.
7. **Script to the channel's opening and closing rules.**
8. **Produce long form first, then cut down.** Cutdowns ride the source format's
   register and never become a third format.
9. **Gate.** Run the five standards, the Kind Rule, the Rigour Rule, the
   channel's scope list, and a claim-to-source check.
10. **Stop at the authority boundary.** Deliver drafts and rendered files.
    Publish, schedule or post nothing without explicit per-asset approval from
    Krish Raja.

## Automatic rejection

Reject and return for rework if any of these are true:

- The spine is an announcement, funding round, model release or benchmark, and
  no margin consequence is traced. (The Money of AI)
- The cut is predominantly a list of tools. (Built with AI)
- A load-bearing number appears without an attributed source.
- Irony lands on a named person rather than on a claim, incentive or decision.
- The piece has no owned artifact and restates publicly available commentary.
- The close is a summary rather than a verdict, lens or handhold.
- A cutdown reuses paragraphs from another surface without a distinct angle.
- The asset asserts cadence, subscriber numbers, pricing, host lineup or channel
  status that has not been verified against the live publication.
- Anything was published, scheduled or sent without per-asset approval.

## Banned language

In scripts, titles and captions: "AI transformation", "AI literacy",
"innovation", "capability building", "leverage AI", "in today's fast-moving
landscape", "time will tell", "the future of work", "game-changer", "unlock".
Each is an abstraction standing in for a commercial claim. Replace it with the
specific mechanism, number or decision it was hiding.

No em dashes anywhere, including on-screen text and code.

## Status claims

This file records purpose and format. It does not record cadence, subscriber
counts, hosts, or which pieces are live. Verify anything status-bearing against
the live publication before asserting it in a script, title or description.

</details>


### Original: project-documentation/04_PROOF.md

Raw SHA-256: `178c460c8882fffdb50520658952b454085f0a1829541fbe6e526d577a89c987`

<details>
<summary>Full pre-consolidation document</summary>

# Mindmake brand and testimonial proof

Last updated: 7 September 2026. Proof permissions approved 2026-08-11; career-reference set extended by Krish 2026-08-27; the thirty-three revised by Krish 2026-09-07.

This file is the single project source for attendee brands, client outcomes, Steph Darmanin's consent-gated excerpts, and named career references. Other project documents must point here rather than copy these lists. The rendered data lives in `src/data/rebuildProof.ts` and must match this file.

## The thirty-three, and the two rules that hold them

Added 28 August 2026. Every testimonial the practice holds now lives in
`src/data/testimonials.ts`, in four families that never mix: five session
attendees, four named clients with consent on record, fourteen anonymised client
outcomes, ten named career references. A session attendee is not a client and a
career reference is not an AI-era outcome; the cards carry the label that says
which, and `src/test/testimonials.test.ts` checks the counts.

**Quotes are never edited.** Not for spelling, not for house style, not to
remove the founder's name. The rules that govern our own voice stop at the
quotation mark, which is why that file sits outside the copy gates and says so
at the exclusion. An earlier version of this data had been anglicised and
name-stripped to pass those gates, and a quote edited to fit a style guide is
not a quote.

**A shortened quote is an exact substring.** Thirty-three quotes of wildly
different lengths cannot share a rail, and the alternative to an excerpt is a
paraphrase attributed to a named person. Every excerpt is checked against its
full text by a test, so a rewrite cannot pass as an extract.

Both rules earned their keep on 7 September 2026. Krish revised the thirty-three
to what people actually wrote, and ten excerpts stopped being substrings of the
quotes they came from: two by a capital letter, eight because the excerpt had
been rewritten to say what the new quote meant. The test caught all ten and
every excerpt was cut again from the revised text. The story deck's eight
pull-quotes are a separate, older approval and were not revised; see the open
item in `06_CURRENT_STATE.md`.

**Named clients, consent-gated.** Steph Darmanin and Dipti Divekar are named
clients with recorded consent, which crosses the "client outcomes stay
anonymous" rule above. The exception is narrow and mechanical: a client in the
`client` family renders only where `consent` reads `recorded`, and
`publishableTestimonials` drops any that does not. A named client without
consent is dropped rather than anonymised, because an anonymised version of a
quote somebody gave under their own name is a different quote.

## Public framing

Use this headline:

> Mindmake has helped leaders across media, software and advisory with what's next in AI.

The earlier "over 4000 leaders" count is retired from public copy under the claim control in `01_CANON.md`: a count returns only when the section 6 evidence trail is compiled and Krish approves it.

Use this line immediately above the brand grid:

> Attended by people from organisations including

The organisations below are attendance proof. They are not Mindmake advisory clients and must never be described as clients.

## Approved attendee brands, exactly 16

1. Walmart
2. PepsiCo
3. P&G
4. BMW
5. Boeing
6. Pfizer
7. Visa
8. American Express
9. Goldman Sachs
10. Deloitte
11. PwC
12. L'Oréal
13. Adidas
14. BBC
15. Hearst
16. Condé Nast

All 16 organisations remain approved attendance proof. They are not all required on the homepage.

## Current homepage logo selection

Use the media organisations from the approved list for the current homepage direction:

1. BBC
2. Hearst
3. Condé Nast

Use official logo artwork in a compact one-line strip. The strip may move gently when that helps the page, but must pause for reduced-motion users and must not make the organisations look like advisory clients. Do not link the logos.

## Verified client outcome stories, exactly 8

The words in quotation marks are verbatim. Keep each client anonymous at role and sector unless a later consent record explicitly changes that. The internal engagement records behind these stories are in `04_PROOF_RECORDS.md`.

From 7 September 2026 each story names its voice in `src/data/testimonials.ts`
and reads the quote and the role from there, so the deck cannot carry a second
copy of what somebody wrote. The quotes below are the same text; the id in
brackets after each attribution is the voice. Story 2's attribution followed
the voice to "Partner, media advisory".

### 1. Land the answer in a day, then leave

Two quarters of argument over build or partner ended in one day in the room. The partner agreement was signed the following month, and build comes back for review in twelve months, once the data is stronger. (Swapped 7 September 2026 to fit the quote, from the same record, R-08; the story used to lead on the year of engineering not spent.)

> “Krish knows how to add value immediately which contnues to compound, and is honest about the benefits of continuing to work with him. He doesn't want to loiter.”
>
> CRO, media company (`media-cro`)

### 2. Turn expertise into something clients can buy

A respected advisory firm moved from ideas to a clear offer clients could buy and launched a defined investment plan.

> “We had expertise everyone respected but needed to add products aroudn that. He turned the pitch into something sellable, which then evolved our pitch.”
>
> Partner, media advisory (`media-advisory-partner`)

### 3. Make the product simple enough to sell

Positioning and pricing were rebuilt in 30 days. The first two pilots were signed during the work.

> “We had a brilliant product nobody could buy, because nobody could explain it. We're now clear on who we are in the new world.”
>
> Founder, adtech firm (`martech-founder`)

### 4. Rebuild the business, then hand it back

An eight-week rebuild covered brand, offers, lead capture, content and outreach. Five videos shipped in week one.

> “The reason I'm loving Krish's sprints is the unique approach. He uses his incredible knowledge of AI and tech to help me with really human problems. I'd had an AI mentor before who was way too technical. Krish thinks about me and the results I need.”
>
> Founder and CEO, executive coaching practice (`coaching-founder`)

### 5. Own the system instead of renting the operator

A founder-owned content system cut research-backed publishing from days to under an hour. Publishing moved from roughly monthly to most days.

> “Since working with Krish I've learnt to push through basic barriers I didn't realise I could, and he set up systems that make me more effective and more motivated. I used to post once a month; now it's most days because I focus on building an AI engine around what I do and what I get bottlenecked by. It's helping me be seen by my customers.”
>
> Founder, research and content brand (`wellness-founder`)

### 6. Change how the team decides

A publisher moved from 14 competing AI vendors to three decisions, then shipped the chosen workflow with its own team and no new hires.

> “We started with immersive AI sessions, which led to a broader project where our team took ownership and accountability. Cheers to Krish for leading and landing.”
>
> Head of Operations, top-10 US digital publisher (`publisher-ops`)

### 7. Tie every AI choice back to the business

Eleven of fourteen tools were stopped, the budget was defended and the first working system went live inside 90 days.

> “It's been a good journey to bring Krish problems that match our business goals and leadership needs, and watch them come together in a very thoughtful program.”
>
> President, legacy broadcast business (`broadcast-president`)

### 8. Change direction before the market moves

A data company changed how it sold as AI changed the web. The work led to a paid test with a major US publisher.

> “We set up an AI-native go-to-market system that made us rethink who we hire and what they do. He works experimentally yet transparently. We trusted he would deliver.”
>
> CRO, data-infrastructure company (`data-infra-cro`)

## Steph Darmanin, consent-gated named proof

Steph Darmanin is a separate client from the anonymous executive coaching practice above. Her use is approved, but the site must still fail closed against the existing Legacy Ascend consent record. If that record is absent, private, unavailable or errors, show none of these excerpts and do not show her name.

Place the excerpts where they support the surrounding message. Never group all of them together.

### Ownership after Mindmake leaves

> “What's unique about Krish is that he never lets you become reliant on him. He puts you in the driver's seat, explains AI fundamentals in plain language, and empowers you to own the skills that actually move your business forward.”
>
> Steph Darmanin, Performance Coach

### Contrast with old outsourced support

> “I have invested thousands before that resulted in terribly disappointing outcomes. The website support came to a halt once the paid engagement ended and ultimately I had to pull the plug and start over. With Mindmaker, I was empowered to own the skills.”
>
> Steph Darmanin, Performance Coach

(The word "Mindmaker" inside this quote is her verbatim wording from the time and stays unchanged.)

### On value for money

> “In 10 years of group and private mentorships, this has been the most valuable investment I have made in myself and my business.”
>
> Steph Darmanin, Performance Coach

### Beside the rebuild story

> “By week 4, I realised I was overdelivering for clients with less effort, and that clarity led me to create new offers with tiered pricing that accurately reflects the value of the service I provide.”
>
> Steph Darmanin, Performance Coach

## Approved named career references, exactly 9

These are career references. They are not Mindmake client outcomes. Use them only after client proof or on the operator/about surface. The source is the professional recommendation set Krish supplied; the three references added on 27 August 2026 (Rob Hudson, Michael Ricciardone, Marie-Anne Leung Kam) were selected by Krish for their communication and human-approach themes and condensed faithfully from that set.

### Lizzie Young

Chief Executive, Commercial Radio & Audio

> “A respected senior leader with deep expertise in digital media and data, a great communicator of complexity, with a warm nature that brings people together.”

### Rob Hudson

National Sales Director, Media, REA Group

> “A unique ability to make data products accessible to everyone in the room, not just the digital people. A genuine passion for helping clients solve business problems, and above all very personable and approachable.”

### Michael Ricciardone

Country Manager, ANZ, MoEngage

> “Articulate, engaging and entertaining. He breaks down the barriers marketers face with data and technology using relevant examples and stories, then presents clear solutions. Full of support, always keen to educate.”

### Melinda Heffernan

Ad Channel Partnerships Director APAC, Taboola

> “He explains complex technical set-ups simply and is a true problem solver. I learnt a huge amount about finding solutions for clients from him.”

### Chris Spencer

Lead Account Executive, Enterprise, Culture Amp

> “An industry expert who turns knowledge into actionable plans and crafted solutions for clients.”

### Ashley Wales-Brown

Digital Commerce Director, Mars United Commerce

> “Intelligent and hardworking, with a deep understanding of data and tech, always good for a straight answer and willing to get his hands dirty.”

### Matt Paine

Managing Partner, Lamington Digital

> “Adept at translating complex scenarios into simple, easy-to-grasp language that moves the conversation forward.”

### Marie-Anne Leung Kam

Director, 2 Square Talent

> “An outstanding leader with a clear vision, a collaborative approach and a knack for driving innovation. I could not recommend him more highly.”

### Vincent Pelillo

Regional Managing Director, Channel Factory

> “Outstanding leadership, consistently driving results in a challenging market. Where 'get it done' is valued, I'd rehire him 100%.”

## Homepage proof stack

1. The approved reach headline (no count).
2. The attendance qualifier and the current three-logo media strip: BBC, Hearst and Condé Nast. The full 16-brand set remains approved for other attendance-proof uses.
3. Three result previews from the outcome stories, with the full archive on the case-studies route.
4. The nine-voice career testimonial deck, one section, swipe-first on touch widths.
5. Steph's excerpts appear only where consent is confirmed and never grouped together.

## Guardrails

- Do not use attendee brands to redefine the advisory customer.
- Do not call an attendee organisation a client.
- Do not turn a career reference into a client result.
- Do not invent names, numbers, brands or outcomes.
- Keep approved quotation text verbatim.
- Public framing around quotes must use short, common words.
- No public count of leaders helped until the evidence trail is compiled and approved.

</details>


### Original: project-documentation/04_PROOF_RECORDS.md

Raw SHA-256: `ae23f85afab4f4de4cefda74f258e2ed57838fc5f7f84786c0f2b428148b4628`

<details>
<summary>Full pre-consolidation document</summary>

# Proof bank

Last updated: 7 September 2026. Pull quotes brought to the verbatim testimonials Krish revised that day.

Internal, anonymised records of real Mindmake engagements. **Every entry is a real engagement that happened**, reduced to sector and role only. The numbers are kept; the names are gone. Only verified engagements belong in this file: if you cannot point at the invoice, it does not go in, and a shorter bank is the correct outcome rather than a problem to solve by topping it back up. (In August 2026 the 26 illustrative entries that once padded this bank were deleted for exactly that reason.)

This file is internal proof context for briefs, proposals and case-study work. It is not public copy. The public renderings of this material are the eight client outcome stories in `04_PROOF.md` and `src/data/rebuildProof.ts`; those files control wording, attribution and consent. Public use of anything here that is not already in those files needs a fresh evidence check and Krish's approval.

## Public-use rules

- Pull quotes are verbatim and map to the approved quotes in `04_PROOF.md`; do not restate them loosely.
- Attributions stay at role and sector. No entry is ever presented as a named client.
- R-01's outcome carries a retired private money disclosure and is **not approved for public use**.
- R-02's percentage outcomes (including the 22 percent revenue figure) are **retired from public use**; the story may be told publicly only in the approved wording of the case-study archive.
- No prices from these records appear in public copy. The private rate card lives in `01_CANON.md`.

## Field schema

Each entry carries: `id`, `mode` (the shape of the work, never a SKU: `decide` settles one commercial question, `reposition` sharpens the commercial story, `rebuild` replaces cost and rebuilds the operating model, `os` stands up an autonomous multi-agent operating system), `icp` (who the buyer is: `leader`, `enterprise`, `capital`, `sme`, `founder`), `industry` (nearest sector), `situation`, `the-call`, `the-work`, `outcome` (numbers kept), a one-line `pull-quote`, and an `attribution` of role and sector only.

---

## Real engagements (anonymised, verified numbers)

### R-01

- **id:** R-01
- **mode:** reposition
- **icp:** enterprise
- **industry:** data infrastructure / first-party identity
- **situation:** A first-party identity and data-infrastructure company with patented identity tech and a strong APAC pipeline, but in a collapsing category. Buyers in the US and EMEA had stopped paying for cookie-replacement tools and started asking what comes next for the open web.
- **the-call:** Reposition the entire commercial surface. Move the lens from third-party-cookie defence to first-party publisher infrastructure for an AI-mediated internet. Rewrite the pitch, the personas, the partner story, and the price point.
- **the-work:** New ICP, messaging, and sales-enablement workflows. Taught the team to vibe-code and built a central AI brain that feeds every seller so they build their own enablement tools instead of needing an enablement team to exist. 43 outbound campaigns across US, EMEA, and APAC with four distinct personas. Partnership architecture with a major creative-and-media services group. A POC scope built for a major US publisher around Safari addressability and conversion-API measurement. A new thought-leadership cadence on agentic browsing and open-web monetisation. The work of at least 10 people, done by one operator plus one supporting resource.
- **outcome:** Retired private money disclosure removed. This record is not approved for public use.
- **pull-quote:** "We set up an AI-native go-to-market system that made us rethink who we hire and what they do. He works experimentally yet transparently. We trusted he would deliver."
- **attribution:** CRO, data-infrastructure company

### R-02

- **id:** R-02
- **mode:** reposition
- **icp:** enterprise
- **industry:** media / digital publishing
- **situation:** A top-10 US digital publisher. An SVP-level operator with a board mandate to deliver an AI roadmap by end of quarter. 14 AI vendors on the calendar, every internal team running a different tool, and no defensible position to take to the board.
- **the-call:** Stop the vendor cycle. Build the roadmap inside-out from the actual editorial and ad-operations P&L, not from the vendor decks. Kill, build, or pause every option on the table with a written rationale.
- **the-work:** A three-decision board memo. One vendor killed, one workflow built internally, one vendor paused with a re-evaluation date. An AI editorial-ops pipeline shipped by their own team in 45 days, zero new headcount. Two of the paused vendors agreed to build bespoke automations so the planned headcount reduction landed with minimal disruption to customers.
- **outcome:** 40% production-time reduction on syndicated content. 75% reduction in campaign setup time downstream. 22% revenue lift across the affected ad inventory. Built by the in-house team, not a vendor. These percentages are retired from public use; see the public-use rules above.
- **pull-quote:** "We started with immersive AI sessions, which led to a broader project where our team took ownership and accountability. Cheers to Krish for leading and landing."
- **attribution:** Head of Operations, digital publisher

### R-03

- **id:** R-03
- **mode:** reposition
- **icp:** enterprise
- **industry:** media / legacy broadcast
- **situation:** A legacy broadcast business. The Head of Strategy was asked to figure out AI on top of an existing role. Team of four, a $250K budget, no mandate, no operating model. Every team using a different AI tool. The CFO threatening to pull the budget. Product teams building what they thought should be built, not what the leaders asked for or what would sell.
- **the-call:** Skip the strategy deck. Write a one-page operating agreement instead. Tie every approved tool to a P&L line. Put AI decisions on the executive agenda so they stop landing on her desk. Build a product-strategy incubator inside the business that arms staff equally with AI, to observe who resists, who embraces, and whose dormant skills come alive ahead of a future restructure.
- **the-work:** A one-page AI operating agreement. Three approved tools, eleven killed. A monthly executive AI cadence installed. The first cross-functional AI project shipped on time and defensible to finance.
- **outcome:** Budget defended at the next review. First production AI workflow live in 90 days. The role pivoted from fractional fire-fighter to ongoing advisory.
- **pull-quote:** "It's been a good journey to bring Krish problems that match our business goals and leadership needs, and watch them come together in a very thoughtful program."
- **attribution:** President, broadcast business

### R-04

- **id:** R-04
- **mode:** rebuild
- **icp:** sme
- **industry:** coaching / corporate training
- **situation:** A senior operator running a coaching and corporate-training practice on the side. Outdated website, no CRM, no content cadence. Inbox-zero in her corporate role and 6,500 unread emails in her own business. The forcing function was missing.
- **the-call:** AI is the forcing function. Rebuild the entire commercial stack in eight weeks: brand, site, productized offers, lead capture, content engine, outbound. Use Claude Projects as the writing OS so context never has to be re-explained.
- **the-work:** A new brand. Three production-ready site concepts shipped in one prompt each. A productized coaching ladder ($2K to $8K) and a corporate workshop ($3K). ManyChat lead capture. An L&D outbound system. Reusable Claude Projects for voice, video scripts, and corporate outreach. The 80-percent rule installed as the publishing standard.
- **outcome:** Five videos shipped in week one. The corporate workshop offer live and priced. New site in final review. First L&D outbound batch sent. The founder back to enjoying the craft instead of running it by hand.
- **pull-quote:** "The reason I'm loving Krish's sprints is the unique approach. He uses his incredible knowledge of AI and tech to help me with really human problems. I'd had an AI mentor before who was way too technical. Krish thinks about me and the results I need."
- **attribution:** CEO, coaching practice

### R-05

- **id:** R-05
- **mode:** rebuild
- **icp:** founder
- **industry:** content / wellbeing
- **situation:** A breathwork content founder, pivoting to a research-led content brand on breathwork and performance. Privacy-conscious, energy-managed, with no appetite for autonomy until a human-in-the-loop system was proven. Needed a content engine that compounds without burning out the founder.
- **the-call:** Build a low-cost, voice-first content engine the founder owns. Claude Projects for voice, Gemini for formatting, Google Scholar and ResearchGate for the studies. Manual first, automated only once the system worked end-to-end. Phase the build so the founder kept enjoying it.
- **the-work:** A three-phase roadmap. Phase one: a voice-to-research content engine producing research-backed posts in under 45 minutes. Phase two: Reddit seeding, corporate L&D outreach, journalist sourcing. Phase three: a publishing pipeline, an evidence library, and an SEO flywheel.
- **outcome:** Total AI stack cost ~$20 per month, replacing what would otherwise be a five-figure agency retainer. Time per research-backed post compressed from days to under an hour. The founder owns the system end-to-end and can evolve it without the operator. Posting cadence went from roughly once a month to most days.
- **pull-quote:** "Since working with Krish I've learnt to push through basic barriers I didn't realise I could, and he set up systems that make me more effective and more motivated. I used to post once a month; now it's most days because I focus on building an AI engine around what I do and what I get bottlenecked by. It's helping me be seen by my customers."
- **attribution:** Founder, research and content brand

### R-06

- **id:** R-06
- **mode:** reposition
- **icp:** sme
- **industry:** advisory / TMT
- **situation:** A global TMT advisory operating across APAC, EMEA, and the Americas. Deep boardroom relationships and a sharp newsletter brand, but a commercial surface that was speaking, not selling. No productized AI offer for clients. No formal investment thesis to deploy alongside its portfolio.
- **the-call:** Turn the firm's expertise into AI products clients can buy. Codify strategic product development as the core advisory wedge. In parallel, write the ventures thesis: who the firm backs, why, and at what stage. Two stacked offers, one operating model.
- **the-work:** AI-powered customer-experience work packaged as a sellable engagement, not a keynote. A productized advisory ladder under the firm's advisory brand. A ventures thesis written and stood up under a new ventures arm, focused on CTO-led founders. The newsletter and creative arm rewired as distribution for both.
- **outcome:** Advisory repositioned from thought leadership to productized strategic product development, with AI podcasts as the first product launched. Fund One launched with a defined CTO-led thesis, now focused on application-layer AI ventures built around compounding data assets.
- **pull-quote:** "We had expertise everyone respected but needed to add products aroudn that. He turned the pitch into something sellable, which then evolved our pitch."
- **attribution:** Partner, media advisory

### R-07

- **id:** R-07
- **mode:** os
- **icp:** founder
- **industry:** AI / business operations
- **situation:** An operator running multiple ventures who needed the company to run without sitting at the centre of every task. The bottleneck was judgement applied to repeatable work, not the work itself.
- **the-call:** Don't build a copilot. Build a self-healing, multi-agent operating system that runs the company while the operator makes Go / No-Go calls. Internal actions run autonomously; anything that leaves the building waits for a human.
- **the-work:** A layered cognitive stack with strict boundaries between data, logic, and reasoning. Supabase as the source of truth for agent identities, task queues, and execution state. 37+ deterministic workflows as the rails, with a non-deterministic swarm for outbound, editorial, competitive sweeps, and guest scouting. Persistent Markdown and JSON memory across all agents so context never has to be re-explained. A failure-to-system engine that writes a permanent rule and drafts the fix the second time anything breaks.
- **outcome:** A 14-agent autonomous operating system, built up from two agents. Morning briefs land before the operator does. The OS presents the data, recommends the play, and executes on approval. A senior strategic partner, a technical ops team, and an outbound sales force in one stack, run by one person across multiple ventures.
- **pull-quote:** "I built fourteen agents and it started with two. Half the ops pod exists to watch the other half. The management layer is the actual product."
- **attribution:** Operator-advisor, AI business

### R-08

- **id:** R-08
- **mode:** decide
- **icp:** enterprise
- **industry:** media / advertising
- **situation:** A major media publisher with a commercial team that wanted to build an in-house AI ad product and an engineering team that wanted to partner. The CRO had been refereeing for two quarters, and the cost of indecision was a missed selling season.
- **the-call:** Settle build versus buy in a day. Run structured pressure-testing in one room until the logic resolves, rather than handing down a verdict.
- **the-work:** One day of structured pressure-testing with the room working the logic together. The answer landed clearly: partner now, revisit build in twelve months once the data position was stronger.
- **outcome:** A clear go decision in a single day. Roughly a year of engineering time not spent on the wrong thing. Partner agreement signed the following month.
- **pull-quote:** "Krish knows how to add value immediately which contnues to compound, and is honest about the benefits of continuing to work with him. He doesn't want to loiter."
- **attribution:** CRO, media company

### R-09

- **id:** R-09
- **mode:** reposition
- **icp:** enterprise
- **industry:** adtech / data
- **situation:** An adtech firm with a strong first-party data asset and an AI layer on top, and no clear way to sell either. Positioning was technical, pricing was a guess, and the pipeline was empty.
- **the-call:** Commercialise the data-plus-AI product, not talk about it. Produce positioning a buyer can repeat, a defensible price, and a sales playbook inside the sprint window.
- **the-work:** A 30-day sprint that rebuilt positioning around a single repeatable line, set a defensible price against the value at stake, and produced a sales playbook the team could run without the founder in the room. First pilots sourced before the engagement closed.
- **outcome:** Clear positioning and pricing. First two pilots signed inside the window. A playbook the sales team runs without the founder present.
- **pull-quote:** "We had a brilliant product nobody could buy, because nobody could explain it. We're now clear on who we are in the new world."
- **attribution:** Founder, adtech firm


## TODO, 28 August 2026: substantiate "2,000+ verified sources"

The `/ai-brain` page carries the line "Live data from 2,000+ checked sources" as
part of the CTRL description. Krish approved the claim for launch. The
substantiation record is still outstanding: the source list, how a source is
counted, and how "checked" is defined, recorded here so the number on the page
is always defensible. Until that lands this is the one public claim on the site
without a written basis in this file.

</details>

<!-- PARENT ARCHIVE APPEND -->
````````````
<!-- END ARCHIVE FRAGMENT parent-owned-originals -->

<a id="archive-2026-09-24-design-lead-backend-originals"></a>
### Fragment: design-lead-backend-originals

Source fragment: `C:/Users/krish/.scratch/mindmake-production-canary-20260924/documentation-originals-03-05-backend.md`  
Raw original SHA-256: `2b1d35e6a0e7f8a31c0288496f77bd6df2a03cb8c9bd027e2f8c4f34ca06830b`  
Raw original bytes: 90708  
Stored LF SHA-256: `2b1d35e6a0e7f8a31c0288496f77bd6df2a03cb8c9bd027e2f8c4f34ca06830b`  
Stored LF bytes: 90708

<!-- BEGIN ARCHIVE FRAGMENT design-lead-backend-originals -->
````````````markdown
# Pre-consolidation originals: design, lead delivery and backend evidence

Original raw-byte hashes accompany each source. Archival text preserves content with normalized newlines.

## Archived source: project-documentation/03_DESIGN_CONTRACT.md

Original raw SHA256: 9E9A1617ABF4706E5C157EB214D5EB5F09B16FC4A2C1804C411A5979EFAAB142

```markdown
# Mindmake design contract

Last updated: 1 September 2026. This file replaces the pre-rebuild contract in full. It binds the public site: the homepage, `/ai-brain`, `/ai-gtm`, and every secondary page that shares the system.

The intent behind these rules is the north star: everything on the page is proof, an instrument the visitor operates, or art direction that makes the proof feel premium. Anything that is none of the three does not ship.

## The five non-negotiables

1. **No operator name in public copy.** The site speaks as "we" and "mind/make". Testimonials attribute by role and company. The only approved exception is the four CTRL product captures, where the operator's own account chrome is the proof; the rule governs copy, never those images.
2. **The voice: a helpful expert, in plain English.** Every section lands its point in the headline alone, for a non-technical reader. A twelve-year-old should follow every sentence on the site.

   What the voice does. It starts from the reader's situation and describes it the way they would. It is generous about the alternatives, because consultants and the tools people already pay for are genuinely useful and saying otherwise reads as a sales pitch. It names what the reader gains. It explains the mechanism in one plain sentence. It uses concrete nouns: standards, past decisions, hours, drafts, sources.

   What the voice never does. No doom, no fear, no telling a reader their business is failing ("your price has not moved yet"). No commands ("you decide", "own the way you decide"). No boasting or spectacle ("watch us read your business"). No cryptic headings that need the paragraph underneath to decode them ("three places the money moves"). No metaphor doing the work a plain noun could do.

   Banned vocabulary in public copy: ingest, orchestrate, agentic, harness, semantic, RAG, LLM, and "inference" except where the GTM board prices it. Banned constructions: the AI-cliche antithesis templates ("not X, but Y", "X. Not Y.", "never just X"), em dashes, and American spellings.
3. **The motion law.** Motion changes how something is presented, never whether it is there. See the motion system below. Entrance choreography is sanctioned; content that is only readable once it has fired is not.
4. **One accent system.** Mint means "this is the answer". Amber means "this moved since yesterday". Nothing else on the site is coloured. The serif speaks only the claim. The mono speaks only numbers, sources, timestamps and labels.
5. **The two-email cap.** A visitor who converts receives exactly one results email and exactly one follow-up fourteen days later. Nothing else, ever.

## Tokens

Ground and surfaces: `--mm-ink #0a100d`, `--mm-ink2 #111a16`, `--mm-ink3 #18241f`, `--mm-line #22322b`, `--mm-hair #1a2620`. Paper, for method bands only: `--mm-paper #f2f1ea`, `--mm-paper2 #fbfaf5`, `--mm-paper-line #dedcd0`.

Text on ink: `--mm-tx #e6ede8`, `--mm-tx2 #b0c0b7`, `--mm-mut #788c82`. On paper: `--mm-tx-d #131c17`, `--mm-tx2-d #4a554e`, `--mm-mut-d #7c857a`.

Accents: `--mm-mint #7fe3b4` with `--mm-mint-dim #3e8e68` and `--mm-mint-wash #12291f`; `--mm-amber #e0a44a` with `--mm-amber-wash #2b2113`. Both accents have a paper form, `--mm-mint-d #2f6f51` and `--mm-amber-d #9a5a1c`, because the ink versions fall to 3.8:1 and below on the proposal's paper, under what its 11px labels need. Same two meanings, darkened.

Grounds: three, alternating down every page. `--mm-ink` is the default, `--mm-ink-raise #1e2c26` is the second, a 1.32:1 step that is nothing as a hairline and unmistakable across a band, and `--mm-paper` is the break. `.mm-on-raise` redefines `--mm-line` and `--mm-mut` for its own subtree, because the instrument components read the palette directly and on the lighter ground a rule sits at 1.08:1 and muted text drops to 4.07:1. The section seam is `--mm-seam #30463d`, separate from `--mm-hair` because that one also draws inside articles where a louder rule would shout. `--mm-section` is the one spacing scale and `.mm-block` reads it.

**No two consecutive sections share a ground** unless something else separates them: a full-bleed band carrying its own image, or a visible seam. `npm run qa:rhythm` enforces it and names its exemptions.

Components read the ground-aware aliases (`--mm-bg`, `--mm-fg`, `--mm-rule` and their siblings) rather than the raw palette, so `.mm-on-paper` inverts a whole subtree by redefining five values.

## Type roles

Four faces, one job each. Three carry meaning and the fourth is simply the body text. All self-hosted through `@fontsource`, never a remote stylesheet.

- **Grotesque (Archivo), structure.** All headings, nav, cards, buttons. Weights 600 to 800, tracking tight on display sizes.
- **Serif (Newsreader), the claim only.** Three or four times per page, always the emotional payoff line, usually in mint. Never a section heading, never nav, never body. Class: `.mm-claim`.
- **Mono (IBM Plex Mono), data.** Numbers, sources, timestamps, category tags, small labels. Uppercase with wide letter-spacing. Class: `.mm-label`. Mono is what makes the live surfaces read as instruments.
- **Body serif (Source Serif 4), running text.** Paragraphs and long copy. It carries no meaning of its own, which is exactly what keeps the claim serif above it meaningful.

The hero pattern everywhere is a grotesque setup line and a serif mint payoff line, on or beside the film plate.

## Motion: the site is never still

Three layers. All three are required on every page.

**Ambient**, always moving, meaning nothing: film loops, the drift and light sweep inside any plate, the marquee, the live dot's pulse. This layer has a floor as well as a cap. Every viewport-height of every page contains motion a person can actually see; a fully still viewport is a bug of the same severity as a scroll reveal.

The floor is measured, not asserted. `scripts/qa/aliveness-check.mjs` photographs each viewport twice, 900ms apart, and compares the pixels; below a mean per-channel change of 0.15 out of 255, the viewport is still. An earlier version of this gate asked the browser whether an animation existed, and the site passed it while showing a visitor nothing, because a 7 percent alpha glow satisfies `getAnimations()` and satisfies nobody. Presence of an animation is not the rule. Perceptibility is.

**Scroll**, relationships between things already present. One primitive implements it: `src/hooks/useScrollDriver.ts` writes `--mm-p` (0 to 1) onto registered elements, and CSS reads that value. It offers three ranges: `centre`, a gentle two-viewport ramp for parallax where only the differential matters; `read`, which completes while the element is still on screen, because a build has to be finished by the time someone is looking at it; and `pin`, which maps 0 to 1 across exactly the distance a sticky child holds still for, so a held section spends all of its motion while it is the only thing on screen. `pin` falls back to `read` when the section is not tall enough to hold anything, which is the narrow phone, where the pin is off; without that fallback it divides by what is left of a short section and snaps between 0 and 1 with nothing in between.

The sanctioned devices are film inside the still, parallax across one sentence, sticky focus (a column pins while cards pass and non-active cards dim), the pinned section (the same sticky positioning given a longer range: everything present from first paint, nothing waiting on an event, and it reverses on the way back up), one marquee per page at most, **the instrument set**, **the drum**, and these **scrubbed builds**:

- **Read-lit text** (`ScrubText`). A sentence lights word by word as it rises. Every word is in the DOM at full size throughout; only presence changes.
- **Assembling rows.** Cards rise into place and draw their rule in sequence, each owning a slice of the range.
- **Settling values** (`CountingValue`). A figure settles into its true number as you arrive. It starts from a fraction of the real value rather than from nothing, because these are real figures and a number reading 0 when it is 149 is briefly a lie.
- **The climb** (`ClimbLadder`, deleted 5 September 2026 with the fork band: both restated an argument the homepage and the argument page already make). Three levels drawn as a staircase, held on screen while a lamp climbs it. The section is taller than the screen and its contents are sticky inside it, so three steps cost one screen of looking rather than three of scrolling. The cards *are* the staircase: they are laid out at equal height and shifted visually, and the lamp climbs the line between the first card's top corner and the last one's, so the graphic and the boxes cannot fall out of register. An SVG staircase drawn above them was tried first and could not be aligned, because an SVG scales in its own coordinate system and DOM boxes do not, so the two agreed at exactly one window width.
- **The track** (`ProcessTrack`). Two parts of one process on one line: solid and capped where the work is finite, dashed and uncapped where it is open-ended, with a marker travelling the whole line as you read. The dashes drift on their own, which is the ambient layer and is what open-ended looks like when nobody is watching.
- **The lever panel** (`LeverPanel`). The four GTM levers as four dials in one frame, needles swinging together across the read, each from its own rest angle so they never read as one object or as a measurement of anything.

What none of them do is fill. A bar that tracks scroll position is banned whatever it is filling, so in every one of these the thing that changes position is an object and the thing that changes state is an accent. Nothing is dimmed to the point of being hard to read, so a visitor who never scrolls, or who asked for reduced motion and gets the completed pass, has lost the movement and none of the content.

The rule that separates a build from a reveal, and the reason the ban below is untouched: **state is driven by position, never triggered by an event.** Scroll up and every one of these runs backwards. Nothing is ever absent, so nothing has to arrive.

**The instrument set** (`Instrument.tsx`) is six marks from the world the films live in: a chart-room gauge, a pen recorder, a split-flap, a card drawer, a sheet rail, a level stack. One 48-unit grid, one stroke weight, one mint part each. Each is placed for what it means, not for variety: the drawer is what is kept, the recorder what is being read, the gauge what it costs, the flap what changes, the rail who does the work, the levels what compounds. Every major section heading carries the mark for the kind of thing it is.

None of them draws itself on. A stroke that animates its dash offset from nothing is entrance choreography and its first state is absent. Each is complete at first paint and then does the slow, meaningless thing the real object would do while nobody is looking. **And it does it continuously:** a mark that rests for most of its cycle is a static mark wearing an animation, which is how the flap and the levels shipped wrong the first time.

**The deck** (`StoryIndex.tsx`), adopted 1 September 2026, is the card index: one story fills the screen, the next two show behind it, and a flick turns the card. It is the drum's own physics reaching the page differently. `useDragDrum` gained a `write` option, so instead of translating a rail it lands the offset on a custom property, and CSS puts every card in one grid cell and places each by its distance from the front. That is also what makes the box the height of the tallest story with nothing measured.

It does not drift. Every other drum here turns slowly when left alone, which is right for quotes nobody is reading closely and wrong for a story a reader is in the middle of. The section is still never still, because each card carries a `StoryFigureView`, which is scrubbed: it draws as you arrive and redraws on every card change. And it is the deck only once the drum has taken control; before that, and for anything that never runs a script, it is the vertical stack it replaced.

**The stack** (`OneAtATime.tsx`), adopted 1 September 2026, is where one row is open and every title stays on screen. It is the touch layer rather than a build or an arrival: nothing here is driven by scroll, nothing is gated behind reaching it, and the whole thing is a real `<details>` group, so a browser runs the accordion with no script loaded and every answer is in the markup either way. Opening a row swaps two panels at once over 200ms with no fade, which is the reference measured frame by frame rather than guessed at. The line down the left is the track's sentence turned on its side: solid above the open row, dashed and drifting below it, which is both what "not opened yet" looks like and the section's ambient layer.

Two rules it deliberately does not break. The numbers sit **inside** the control they label, which is the carve-out the eyebrow ban keeps open for a question number; a number above a heading would be an eyebrow and this is not one. And it is not the retired numbered step rail: that was a scroll journey with an ordering claim, and this is a list the reader's hand drives, in any order, with nothing hidden from anyone who never touches it.

Where it replaced the drum, and why, is in `ObjectionChips.tsx`. The short version: a drum is right for thirty-three short quotes you graze past and wrong for eight questions you look up, and `.mm-drum` was hiding seven answers of eight from anyone without JavaScript.

**The drum** (`useDragDrum.ts`) is the proof carousel, and it is four states in one loop. It drifts when left alone, stops dead and tracks the hand on a pointer down, keeps the speed you gave it and loses it to friction on release, and springs to the nearest card below walking pace. Past either end it resists at a third of the pull rather than stopping, which is what tells a hand where the end is. Haptics tick once per card crossing the centre, on touch, and only while the hand's own action is still playing out.

**Touch**, everything answers the hand within about 100ms. Cards warm their border toward mint and lift one pixel. Chips fill on hover and press down on click. Tabs slide a mint indicator between states. Fork cards draw their tick when picked. Text links draw their underline. Focus-visible always shows the mint outline. A component shipped without hover, press and focus responses is unfinished, exactly as unfinished as a component with no mobile layout.

**Arrival**, sanctioned 29 August 2026. Staggered builds, fades and slides on arrival, reveals that fire once as you reach them. One primitive implements all of it: `src/hooks/useReveal.ts`.

This was banned outright until that date, and the ban had a real argument: a scrubbed build needs no observer, starts from no absent state, and reverses, and a reveal needs all three. It was lifted on Krish's instruction, having been asked for three times. What the ban was also protecting is not lifted, because it was never really about choreography:

**Every revealed element stays readable if the reveal never fires.** Copy here has to work for a crawler that runs nothing, a screen reader, a visitor who asked for reduced motion, and somebody landing halfway down a page from a search result. A reveal whose first state is genuinely absent breaks all four, and breaks them silently, because whoever built it always arrives at the top with a working observer. So the primitive guarantees, and `src/test/reveal-contract.test.tsx` holds, that:

- the DOM is always complete, and only opacity and transform ever change;
- CSS defaults to revealed, so no JavaScript means nothing hidden;
- nothing already on screen is ever hidden, so a mid-page landing is whole;
- a passive scroll pass reveals anything the reader reaches, so a silently broken observer costs nothing at all. This was a two-second timer first, which was wrong twice over: on any real page every element was revealed before the reader had scrolled to one, so no arrival ever happened, and it guaranteed a moment rather than the reader's own position;
- reduced motion hides nothing at all.

`IntersectionObserver` appears in exactly one file, and the contract test holds it there. That is what replaced the old check: the ban was checkable because the observer appeared nowhere, and this is checkable because it appears in one place with the guarantees attached to it.

**The entrance: the page arrives once**, from 3 September 2026. Photographed cold on a throttled phone, the first screen used to change seven times in two seconds: type in fallback faces, a half-drawn wordmark, the poster popping into an empty plate, two font reflows, a hydration nudge and the film replacing its poster in a different tone. Every one of those is fixed at the root, and the rule that keeps them fixed is this: **what is painted in the first frame is painted right, and what is not ready is not painted at all.**

- The ground, the wordmark and the mark (vectors written into the page since 4 September 2026, so there is nothing of theirs to fetch), the film plate with its poster, its drift and its sweep are in the first frame. The prerender preloads the four latin faces, both brand images and the priority poster, read from the built output rather than named.
- The four faces keep `font-display: swap` and stand on metric-matched fallbacks (`Archivo Fallback` and its siblings in `mindmake.css`, numbers computed with Capsize), so a swap that still happens moves nothing.
- Long-form route type waits. An inline script in `index.html`, outside React, puts `mm-pending` on `<html>` before first paint and swaps it for `mm-arrived` when the four faces are in or 700ms after the first frame, whichever is sooner, marking both moments on the performance timeline. `.mm-first` elements on those routes are held and then arrive on the reveal primitive's own animation, `backwards` fill, 110ms apart. The compact homepage is immediate: its first viewport is already the entrance, so `/` and `/?start=1` do not run the additional curtain or type arrival.
- The curtain: fifteen strips of the raised ink over the ink, the converge figure's own count, with the plate's light across them, shown while `<html>` carries `mm-covered` and lifting top to bottom in about 700ms when the type is released, from 120ms after the mark so the first frame on screen is the whole curtain. The root marker and the strips have different names on purpose: on 3 September the root carried the strips' own class, so `.mm-curtain { display: none }` matched the document and nothing was rendered until the marker came off, 2.5 seconds in on a throttled phone, and the gate read the browser's first paint and reported it as late rather than as missing. `var CURTAIN` in the head script is the one switch; false keeps the type arrival alone. It costs up to 700ms of held screen on a slow connection and it was chosen with that number on the table.
- The guarantees are the reveal primitive's, kept the same way. No script means no class, and no class means nothing hidden and no curtain. The compact homepage, reduced motion and a deep link (`location.hash`) take the same immediate path.
- Hydration moves nothing. `useScrollDriver` writes `--mm-p0` alongside its first `--mm-p` and every parallax translate is computed from the difference, so the server render, the first client render and the first write all compute zero; a `Build` group's first value travels for 400ms under `data-mm-settling` rather than snapping.
- A loop mounts once its plate is within a viewport of the fold, and fades up over its own poster on `playing`, because a decoded frame and a webp of the same frame are not the same colour. The plate's sweep runs on `transform`; on `left` it was a layout shift every frame.
- `npm run qa:entrance` reads the two marks and judges the frames inside the arrival by direction, fails an arrival that begins more than a second after first paint or never releases, reads every layout shift after first paint against a floor of 0.02, and runs a reduced-motion pass on which nothing may be held, covered or mounted.

**An arrival travels on an animation, never on a transition.** `transition` is a single property and every card family worth revealing already owns it for its own hover fade, in `mindmake-instruments.css`, which loads after `mindmake.css` at the same specificity. The card's declaration replaced the reveal's outright and the first three arrivals shipped snapping into place; nothing failed and nothing looked broken, the cards simply appeared. An animation cannot be overwritten by a transition, so the two layers stop competing for one property. The fill mode is `backwards`, which holds the first frame through the stagger delay and then lets go: `forwards` would pin `transform: none` on the element for the rest of the page's life and quietly outrank anything that wanted to move it later.

**A section is one idea, and one idea is about one screen.** Not a height cap: the rule is that a section running past about a third again of a phone screen is almost always several sections nobody has separated. The homepage's proof strip was a heading, a film, three story cards, a link, thirty-three quotes on a drum and a rail of logos, and at 360px it ran 2.61 screens. The argument beside it carried the questions section inside it. Both try-it panels carried a promise and a form. `scripts/qa/screen-matrix-check.mjs` measures every section at eight sizes from 360x800 to 1920x1080 and names its exemptions with a reason: the lever panel and the three-question form on `/ai-brain` are each one object rather than several (the pinned climb was one until it was deleted on 5 September 2026).

**A page runs a ground arc, not an alternation.** Three grounds exist: ink, raise and paper. Ink and raise are one step apart at 1.32:1, which is a surface change at a seam and nothing at all across a screen, so a page that alternates only those two for its whole length has no arc and reads as one colour from the hero down. Paper is a full inversion and is the only ground a reader feels arriving. Every page carries at least one, spaced so the light passages break the page into movements rather than sitting next to each other.

Until 30 August 2026 paper was used **once in the entire application**, on one band of `/ai-brain`, and the reason was mechanical rather than editorial: the ground redefined five surface tokens while 64 rules read `--mm-tx2`, 56 read `--mm-line` and 31 read `--mm-ink2` directly, so a section moved onto paper kept its dark cards and turned their headings dark on top of them. Both non-default grounds now redefine the raw palette for their own subtree, which is what `.mm-on-raise` had always done and `.mm-on-paper` had not.

**The accent has two roles and only one of them follows the ground.** `--mm-mint-bright` is the accent as a surface — a filled button, a pressed chip, the marquee band, a resolved bar in a figure — and it always carries `--mm-mint-ink` and stays bright on every ground, because a mint button on paper is still a mint button. `--mm-mint` is the accent as text and line, and a ground may redefine it: #7fe3b4 on cream is 1.2:1. One element runs against the grain of its section, the dark head of a fork band, and it puts the ink palette back for its own subtree.

**Still banned:** progress bars tied to scroll position, whatever they are filling. A bar that fills is a measurement of the reader rather than of anything on the page.

The scrubbed builds above were adopted on 28 August 2026 after the two models were built side by side on the same content and compared, and they remain the default. A build that can be scrubbed should be: it reverses, it needs no observer, and a visitor who never scrolls has lost nothing. Arrival is for the things a scrub cannot express.

Under `prefers-reduced-motion`, the ambient layer falls back to posters and stopped bands, every scrubbed build reports a completed pass, and every arrival is simply already there: the sentence is fully lit, the row is assembled, the figure reads its true number, and parallax flattens. The touch layer stays, with transitions swapped for instant state changes.

## The eyebrow ban

No small pre-heading above a hero or a section title, anywhere on the site. Kickers, overlines, chapter numbers, decorative counters, status straps and proof badges are all the same thing under different names, and renaming one or changing its case does not make it acceptable. If a label is worth reading it belongs in the heading; if it is not, it should not be on the page.

A small label may remain only where it names an object, a control, a value or an axis: a lane name on the board, a question number in a journey, a category tag on a card. The contract test enforces the shape of the ban by rejecting any label element immediately followed by a heading.

## A control names the whole choice

Added 16 September 2026 after the AI GTM comparison reduced three different pricing models to "Keep the seat", "Meter the work" and "Price the result". Those were internal strategy notes presented as customer language. A reader had to infer what was being kept, measured or priced before they could compare the choices.

Every button, tab, option and step label must make sense without access to the team's working language. Name the thing and the consequence: "Charge for each completed task", not "Meter the work". Context can remove repetition, but it cannot supply the missing object. If a clear label does not fit the control, change the control. Never shorten the meaning to preserve a desktop grid on a phone.

The banned regression set starts with the fifteen shorthand labels removed in that pass. `src/test/copy-restraint.test.ts` protects the rendered product and `scripts/qa/plain-language-check.mjs` protects the current prototypes.

## The design says it, so the sentence goes

Added 2 September 2026, after a phone reading found the site legible, passing every layout and motion gate, and still reading as walls of words.

A sentence earns its place by saying something nothing else on the screen says. Three things fail that test, and all three are checked mechanically in `src/test/copy-restraint.test.ts` over the server render, because each is cheap to write and invisible in review.

- **Copy about its own copy.** "That is the whole idea." "No jargon, and nothing to wade through." A sentence claiming the sentence above it was good is a sentence the reader has to get past to reach the next real one.
- **Copy narrating a control.** "Drag it, or use the arrows." under a drum with arrows drawn on it. "Pick one and this line tells you where you land." under two buttons. If a reader cannot tell what a control does, the control is what is wrong; a caption hides the defect and costs a line of the screen.
- **The same sentence twice on one page.** Six content words or more, across paragraphs, list items, headings and legends. Quotes are exempt: the same client sentence in the story deck and the voices drum is two pieces of evidence, not our copy said twice.

The corollary, which is the harder half: where a fact is already carried by a number in a picture, a label on an axis, a numbered row or the shape of a control, it is carried, and printing it again is not thoroughness. A count belongs in the numbering. A number visible in a capture belongs in that capture's alt text, where it still reaches a reader who cannot see the frame.

None of this licenses cutting an answer. The questions sections are long because a reader with a question wants the answer, and every one of those is content. What came out was the same answer given twice under two headings.

## A default carries no specificity

Added 2 September 2026, after seventeen declarations were found that could never take effect.

A site-wide reset is written `:where(.mm-site) :where(p, h2, blockquote, ...)`, never `.mm-site p`. The second form is (0,1,1), which is above every single-class rule in this repository, so a component saying `.mm-payoff { margin-top: 30px }` is writing a declaration that cannot win. Sixteen margins and the lead dialog's entire step-rail typography were dead exactly that way, and none of it is visible in a review: both rules read correctly on their own, and the file that loses is not the file being read.

`:where()` contributes no specificity. The reset still beats the browser's own stylesheet, because an author rule always does, and it loses to any component that asks for something, which is the whole job of a reset. A default that outranks the components it serves is not a default; it is an override. `npm run qa:deadcss` reads it back from the browser.

The same rule governs typographic defaults. Short prose balances (`text-wrap: balance`), because a two-line quote breaking to leave four words alone is what "wraps pointlessly" looks like and `pretty` cannot fix it: `pretty` tidies the last lines inside a paragraph, `balance` evens all of them. It is set once at (0,0,0) rather than per component, because Chrome balances up to six line boxes and falls back past that, so the browser draws the line between a caption and a long answer without CSS having to. A component opts back into `pretty` only where its block is reliably long.

## Proof

Three families, never mixed, because merging them would be the easiest lie on the page.

- **Client outcomes** are anonymous, by role and sector, because that is what those clients agreed to. One person sits in two families at once: a named reference who was also a client, and whose named quotes run only under a consent record that fails closed. `04_PROOF.md` governs her wording, and she is the only such case.
- **Named references** are people who have worked with the founder, named with their consent, and always described as exactly that rather than passed off as client results.
- **Attendee brands** are attendance and say so on the page. They are never described as clients and never linked.

The site speaks as "we" throughout. The founder appears in exactly three places, per the canon's ruling of 28 August 2026: the founder section at the foot of the homepage, in his own first person and with his photograph; the framing of the proof, because a testimonial needs somebody to have worked with; and inside verbatim quotes. Everywhere else there is no first person, no biography and no portrait. The four CTRL captures keep their visible account chrome, because that is what proves the engine is real.

## Components

Every component ships with its hover, press and focus-visible states. None are optional.

Film plate, doors (the homepage's one way in from 3 September 2026: two cards in one `role="group"`, each marked as a primary action, which is the shape the one-way-in gate reads as one fork and what tells the action bar to stand down), enemy pair and answer block, marquee, objection chips, ask bar, live board (departures rows, lane tiles, role and industry chips, timestamp with live dot), the three things (a paper `Build` of three beats), shape cards, journey modules, proof viewer, the reflex deck (four dated leaves you flick), the converge figure (fifteen strips into one), close block. They live in `src/components/mindmake/` and are styled in `src/styles/mindmake-instruments.css`. Tokens, base and chrome live in `src/styles/mindmake.css`.

## The feed's voice

The board publishes text this site did not write, and the two kinds are not
governed the same way.

**A headline is the source's own words and is never edited**, for spelling or
anything else, exactly as a testimonial is. It appears in quotation only by
being on a board that names its source beside it.

**A line we author about an item is our voice** and is held to the house style
like any other sentence here. The cache's `pov` field is that kind of line, and
as CTRL writes it today it does not pass: measured over one day's items, 25 of
29 are commands addressed to the reader and 9 carry American spellings. So the
board does not print it. Its reading of an item is the `stance` word, which is
one word and ours. The line returns when it is written in a voice this site can
publish, and that is a change to the classifier rather than a scrub here: a
scrub can fix `judgment`, and nothing mechanical can turn "Ensure rigorous
oversight" into a sentence that is not an instruction to the reader.

## A page that argues, without paragraphs

`/new-age-leadership` is the one page whose job is to make the case rather
than to get a fit visitor into the brief, and it is the pattern for any future
one. Every beat is an instrument the site already owns with one line on it: a
deck you flick, a line that lights as you read it, the track, the chart, a
figure. Nothing is explained under itself, and nothing on it is a threat: the
retired version put the same argument as "Or report to it", which the canon
bans, and the value halves of those cards were the better half anyway.

Its history is dated and checkable, because a page that says people have
always resisted new tools and names nothing is asserting a feeling. Where the
popular version is wrong it is corrected rather than repeated.

The line that holds the history and the imagery together, and the test for
any new film or beat: every generation blamed the tool, and the ones who came
out ahead learned to read the instrument. The films are instrument rooms
with a human hand deciding; the history is what happened each time a new
instrument arrived. The dated objections stay on this page as the deeper
why. From 3 September 2026 the section on where everything a leader teaches AI
ends up moved here from the homepage, because it is reasoning and this is the
page for reasoning. The two hours and the hinge followed on 5 September 2026:
the homepage now says what the work answers (where you stand, what is coming,
what to do first) and links here once for the why.

## Motion that is decoration on top of text

The board's split-flap headline is the pattern to copy when something on this
site animates text. **The true character is the element's own text at all
times**; the animation writes an attribute and CSS paints a decoy over the top,
and landing deletes the attribute. Nothing is ever revealed, uncovered or
inserted, so the finished state is what a crawler, a reader with scripting off,
a reader before hydration and a reader who asked for less motion all get, with
no fallback branch to keep in step. An effect that has to build the content it
animates is the wrong shape and belongs somewhere else.

## Accessibility

Mint focus-visible outlines on every interactive element. Body text meets AA on both grounds; mint on ink is for large text and chrome, never body text. Every film plate carries a descriptive `aria-label`. Objection chips are buttons, the ask bar is a labelled input, and the fork is keyboard-operable.

## Approved route signatures

The largest and most visible area in a product route carries the strongest demonstration of the product. It is never reserved by an oversized empty container, decorative whitespace or an illustration that cannot explain the offer. Tests measure the distribution of meaningful child content, not the area of its parent box.

The approved AI Brain signature has four complete and reversible views: Decision, the actual living twenty-node Brain, Evidence and Correction. Decision assembles a working portrait from the real fixture. Evidence keeps source, instruction, relationship and standing attached. Correction shows the exact rule before and after the founder changes it. Desktop may pin the sequence; portrait phones use a readable natural-height document. Neither presentation substitutes an abstract diagram for the actual Brain.

The approved AI GTM signature carries one live market signal through a named response, product, price, positioning, people and a customer test. The signal-to-choice crossing and commercial map remain visible on desktop. Phones stack the linked decisions and never squeeze a desktop matrix into the viewport. The live read moves as a ticker without exposing a native horizontal scrollbar.

Both signatures, their fixture data, their review surfaces and the gates that protect them are frozen in `quality/route-lock/approved-production-r1.json`. `npm run qa:approved-routes` checks exact hashes and structural counts. `npm run qa:approved-routes:self-test` proves the guard fails closed. `npm run build` runs the guard before compilation, and `.github/workflows/approved-route-lock.yml` runs it independently on every push and pull request. A later approved change creates a new manifest revision. It never edits this approval record in place.

## The acceptance checklist

Every public change runs all of it.

1. Focused tests, then the full suite, then `npm run build` and `npx eslint .` no worse than the recorded baseline.
2. Desktop and 375px checks in both scroll directions, with no horizontal overflow and no browser console errors.
3. The Krish gate: a case-insensitive search across public surfaces returns nothing except the three declared exceptions, which the contract test encodes. Those are: the reference section's heading, where he is named once as the person those people worked with; a verbatim quote that used an older name, because quotes are never edited; and the contact mailbox in `src/lib/publicLinks.ts`, which is on the older domain because that is the one that receives mail.
4. The motion gate: `IntersectionObserver` in one file only, and every revealed element readable with it never firing. Disable JavaScript, then load each page and read it end to end.
5. The aliveness gate: scroll each page at reading pace and confirm every viewport holds something in motion, then crawl every interactive element with a mouse and a keyboard and confirm each answers.
6. The three-second gate: read every headline with its serif payoff, standalone. Then the banned-word and antithesis scans.
7. The board honesty gate: the timestamp renders from the cache date, staleness is labelled past 26 hours, and a failed fetch collapses the section cleanly. Every figure on the board comes from one filtered collection, so a chip moves the rows, the lane counts, the spark bars and the timestamp's total together; and each chip's count is what it would return if pressed, with the other lens left where it is, which is what makes "disabled at zero" true rather than approximate.
8. Reduced motion: posters, stopped bands, final counter values, and every control still operable.
9. The interaction gate: open the lead dialog and drive one dead end to the offer
   of a person, at 1440 and 390. Every gate above this one measures a page at
   rest, and neither the dialog nor a failure state is on a page at rest: on
   28 August 2026 the whole dialog layout was deleted and shipped with every
   test and every gate passing. `scripts/qa/dialog-shape-check.mjs` and
   `scripts/qa/handoff-check.mjs` are that gate, and anything else that only
   appears after an interaction needs one of its own.

## What a dead end looks like

Nine things on this site can fail, and each one ends in an apology, one dry line
where our own machine is the butt of the joke, and one way to reach a person.
Never the visitor as the butt: a joke at the expense of somebody who has just
been let down is a second insult, and levity is not the point of the panel, the
button under it is.

The shape follows the situation. A **panel** where the road is definitively
closed, so the offer is one click. A **quiet line** where a working retry is
sitting right there, so a second door does not shout over the first. The panel
carries no ground of its own: every colour resolves through the dialog's tone
tokens first and the page's second, so it wears the surface it lands on. The
proposal learned that the hard way, as dark text on a dark ground.

An apology is body copy, not a caption. The dialog had a caption colour and no
secondary-text colour, so the offer's second line sat at 3.4:1 on paper before it
was measured. Both now exist, `--mmb-muted` and `--mmb-fg2`, and the second is
what a sentence uses.
```


## Archived source: project-documentation/05_LEAD_DELIVERY_SPEC.md

Original raw SHA256: 87702695B3BD086FE42D839BA38071ADBA2347BDA835BD5D407B368A91ECAE88

```markdown
# Mindmake private brief delivery

*Current as of 28 August 2026.*

Status: **live**. The backend launched 26 August 2026 and Krish approved Gate E on 27 August 2026, so the public flag is on and the full journey runs in production: the migration and retention purge are applied, the functions are deployed at the versions recorded in `06_CURRENT_STATE.md`, which is the only place versions are written down, the sender `Mindmake <briefs@mindmake.co>` is verified with SPF, DKIM and DMARC passing, and the complete verification, delivery and tailored-choice matrix passed against the live backend with synthetic inboxes.

## Product boundary

The private brief must feel useful before Mindmake asks for an email. It must also create a clear lead for Krish without pretending that a generated starting point is a finished diagnosis.

The release rules are:

- no public diary or Calendly link;
- no automated sales or nurture sequence beyond the single day-14 follow-up (see the amendment at the end of this file);
- no automatic publication subscription or list import;
- no visitor-written narrative, email HTML or hidden qualification data accepted by the server;
- no claim that an email was delivered unless that delivery was accepted by the email provider;
- no loss of the visitor's local download when a network or email step fails.

## Visitor journey

1. The visitor gives four details: first name, last name, work email and the part
   of the business they work in. The company domain is derived from the email. A
   personal address is refused on the page and again at the server, because the
   read is built from the company behind the domain. Both doors ask for exactly
   this, in one shared component, with one set of rules.
2. Mindmake shows a declarative public-company read and labels a safe fallback honestly when live research does not answer. The read never asks the visitor anything or invites a correction; any sentence that does is dropped server-side and client-side before display.
3. The visitor chooses one pressure. When the read was strong enough, the choices are two or three statements tailored to that company, generated and HMAC-signed by the server, each anchored to one locked lens; `Something else` reveals the locked list, which is also the guaranteed path whenever generation fails or runs out of time.
4. The visitor chooses where better use of their time would matter.
5. Mindmake shows a private starting recommendation, framed as an illustrative example of how the Mindmake brain reads a business from the outside, with the explicit line that none of it is advice.
6. Only then does the visitor choose whether to keep it by email.
7. The work email is already there, carried from step 1, and the visitor may
   separately tick an unticked publication-interest box. Changing it here still
   creates a fresh request.
8. Mindmake sends a six-digit code. The code works for ten minutes and locks after five failed tries.
9. Only after the code is confirmed does Mindmake try the two final deliveries independently, and the branded proposal renders on screen.
10. The visitor can download the private HTML brief whether or not either email succeeds.

Changing the email or asking for a new code creates a fresh request. A network retry of the same request keeps the same request ID so it cannot create duplicate delivery work.

## Browser contract

The browser sends identifiers and choices only. It never sends the recommendation, company narrative, research evidence, email HTML or operator copy. The one piece of prose it may carry is a tailored-choice label the server itself authored and signed; the server verifies that signature against the domain and lens before trusting the label.

Request action:

```ts
interface MindmakeBriefRequestActionV2 {
  version: 2;
  action: "request";
  requestId: string;
  contact: { email: string };
  company: { domain: string };
  choices: {
    pressureId: MindmakePressureId;
    returnedTimeId: MindmakeReturnedTimeId;
    entryRoute: "home" | "brain" | "gtm";
    tailored?: { id: string; label: string };
  };
  consent: {
    publicationRequested: boolean;
    wordingVersion: "mindmake-publication-consent-v1";
  };
  website: "";
}
```

Confirmation action:

```ts
interface MindmakeBriefConfirmActionV2 {
  version: 2;
  action: "confirm";
  requestId: string;
  contact: { email: string };
  code: string;
  tailored?: { id: string; label: string };
}
```

The `website` field is a bot trap and must remain empty.

Tailored-choice rules: `id` is an HMAC-SHA256 signature over the domain, lens and label using the server's verification secret, created by `enrich-company` and carried back unchanged. On the request action an invalid pair is rejected with 400 `tailored_choice_invalid`. On the confirm action the pair is verified against the stored row's domain and lens; a mismatch falls back gracefully to the lens label rather than failing the confirmed lead. Nothing tailored is persisted; the lens keeps owning the recommendation content and the tailored label only changes what the pressure is called in the proposal, the emails and the digest.

The browser accepts only these response states:

```ts
interface VerificationRequiredResponseV2 {
  version: 2;
  success: true;
  status: "verification_required";
  requestId: string;
}

interface ConfirmedBriefResponseV2 {
  version: 2;
  success: true;
  status: "confirmed";
  leadId: string;
  visitorDelivery: "queued" | "failed";
  operatorDelivery: "queued" | "failed";
  publicationInterestRecorded: boolean;
}
```

`queued` means the email provider accepted the send request. It does not prove inbox delivery or that anyone read the message. The page reports each delivery separately and never turns a missing or unknown response into a success claim.

## Server-owned work

The server validates an exact field allowlist and rejects extra narrative fields. It then:

1. normalises the email and domain;
2. applies rate limits to one-way hashes of the email and internet address;
3. researches the public company or creates an honest fallback;
4. builds the recommendation from allowlisted choice IDs and server-owned rules;
5. stores the request and delivery state in the private schema;
6. creates and emails the verification code;
7. verifies the submitted code;
8. creates the visitor brief and Krish's fit summary from its own templates;
9. attempts the two final emails independently;
10. returns only the final delivery states and publication-interest state.

The six-digit code is never stored as plain text. The database stores a keyed hash and a nonce. Raw internet addresses and browser descriptions are not stored in the private brief tables. Only one-way hashes used for abuse limits are stored.

The private schema is not readable by public or signed-in browser roles. The public wrapper rejects those roles and accepts only the service role used by the Edge Function.

## What the visitor receives

The visitor email is set in the proposal design language (paper ground, emerald cover rule, Mindmake × company cover, serif pressure headline, labelled cards) and contains:

- the chosen pressure (the tailored label when one was verified);
- the public company read and its source label;
- the evidence used;
- what AI may carry;
- what should stay with the leader;
- one useful 30-day proof;
- where the returned time could create more value;
- the branded proposal document as a self-contained HTML attachment (system fonts, no scripts, no external requests, printable);
- the honesty foot: the read is an illustrative example and is not advice.

It contains no diary link and no automatic sales promise. It does not claim that Krish received his separate email. After the server returns `operatorDelivery: "queued"`, the UI may say only that Krish's copy was queued. The line "No sales emails will follow automatically" stays, and Reply-To is the operator mailbox so "reply to this email" is honest.

## What Krish receives

Krish's server-made fit digest shares the proposal design language and is ordered for a fast scan:

- the tailored or lens pressure as the headline;
- the leader: verified email (Reply-To reaches them directly), company and domain;
- the public company read, its source and evidence;
- what they chose: the pressure (naming the lens behind a tailored choice) and the returned time;
- the brief they received: the server-owned AI, human and 30-day proof recommendation;
- a route-specific note about where a useful first proof may sit;
- the exact publication-interest state and wording version;
- a reply rule: reply only with a useful thought, a strong fit or a clear question worth testing.

The operator email must never tell Krish to chase the visitor or import the address into the publication.

## Publication interest

- The box is separate and unticked.
- `true` means unverified interest only.
- `false` means no interest was requested.
- Neither value subscribes anyone.
- No record is imported automatically or manually from this flow.
- A later publication sign-up must use the publication provider's own verified process.
- There is no recurring personalised watch in this release.

## Failure behaviour

- Company research fails: use the honest fallback and let the visitor continue.
- Verification email fails: do not move to confirmation; keep the local brief available.
- Code is invalid, expired or locked: show a plain error and do not send either final email.
- Visitor delivery fails: do not say the brief was emailed; keep the download available.
- Operator delivery fails: do not say Krish has the context.
- Both final deliveries fail after confirmation: show the local download and a direct email fallback.
- One final delivery succeeds: report only that delivery.
- A delivery retry uses an independent idempotency key so one email cannot duplicate the other.

## Retention truth

The code works for ten minutes and five failed tries lock it. Expiry stops the code but does not delete the request record. The approved retention schedule runs as a private daily purge (Gate B1, 26 August 2026): unverified requests delete 7 days after creation, rate-limit event hashes after 48 hours, and verified request, consent and delivery records 12 months after their last update. Earlier deletion happens through the published contact address and a manually verified private process. The public privacy notice states the same schedule.

## Release gate (closed 27 August 2026)

Every item of the release contract passed before the flag went on, and Krish gave the explicit Gate E approval on 27 August 2026: migration and security advisers, private-schema isolation from anonymous and signed-in roles, service-role wrapper boundaries, exact origins and secret configuration, the full request, resend, change-email and code matrix, both independent deliveries with synthetic inboxes, idempotent retries, inspected email output, publication-interest boundaries and the retention schedule with its manual deletion process.

Any future change to the pipeline re-runs the relevant part of that contract before deploying, and a synthetic end-to-end lead from `https://mindmake.co` (code read from the provider's synthetic inbox, all three sends `delivered`) is the minimum proof after every function deploy. A provider `queued` response is never claimed as inbox delivery.


## Amendment, 28 August 2026: the two-email cap

The release rule that forbade any automated sequence is replaced by a bounded
one. A lead receives exactly two emails, ever:

1. **The results email**, unchanged. Sent on confirmation by
   `submit-mindmake-brief`, or by `mindmake-personal-read` for a visitor who
   completed the personal journey instead.
2. **One follow-up, fourteen days later**, sent by `send-follow-ups` from a
   daily 09:20 UTC job. Subject: "The better version of our offer". One short
   paragraph, one sharper offer, one link back to the start. No images and no
   tracking beyond the mailer's defaults.

Nothing else sends. There is still no drip, no newsletter from this site and no
list import; the publication remains a separate choice the visitor makes
themselves.

What keeps the cap true rather than merely stated:

- `follow_up_queue` is unique on `(email, source)`, so a returning visitor
  cannot stack a second follow-up.
- Each send carries a deterministic idempotency key derived from the queue row,
  so a rerun cannot duplicate a message.
- `sent_at` is written only when the provider accepted the message, and a row
  that fails three times is abandoned rather than retried forever.
- The row is purged seven days after it sends. The public privacy notice states
  this schedule.
- `src/test/brief2-email-cap.test.ts` walks every function under
  `supabase/functions` and fails if the set of things that can send mail, or the
  set of places a follow-up can be created, ever grows.


## Amendment, 29 August 2026: the read has to earn the send

The personal read on `/ai-brain` went out once as a job title pasted on the
front of three template sentences, chosen by two taps, so everybody who tapped
the same pair received the same email with their name on it. The verdict on it
was "embarrassingly generic, I'd rather send nothing". That is now the
implemented behaviour rather than a preference.

**What the read is made of.** The paragraph that leads it is the synthesised
outside read of the visitor's actual company, produced by the same
`assembleDossier` orchestrator `/ai-gtm` runs on, reused in process. Everything
after it describes what the brain would do, and those lines are templates on
purpose, because they describe our product and our product does not vary by
visitor. What has to vary is the company, and now it does.

**The gate.** `assessRead` in `mindmake-personal-read/core.ts` reads the
assembled read the way its recipient would and refuses to let it be sent if the
answer to any of these is anything short of yes. A refusal returns
`not_worth_sending`, the page says so plainly, and no email is sent.

1. Is there anything here that could only have been written about this company?
2. Would this same paragraph fit their closest competitor without changing a word?
3. Does it claim to know something about them that nothing outside could know?
4. Does it state a role or company that enrichment did not actually establish?
5. Is the only specific thing in it their own job title, handed back to them?
6. Is it short enough to be read in under a minute?
7. Does it use an em dash, American spellings, or raise its voice?
8. Does it carry placeholder residue, or the same sentence twice?
9. Is every sentence plain enough to follow at speed?
10. Is the company we are naming actually the one behind their email address?
11. Does it pass judgement on how established or successful they are?
12. Does it tell them their organisation is failing or under strain?
13. Does it flatter them instead of observing them?
14. Does it recite their infrastructure back at them?
15. Does it ask the reader more than one thing?

**Repair comes before refusal.** The synthesis reliably writes four good
sentences and then one more that recites the stack, grades how established the
company is, or flatters it. Refusing the whole read over the last sentence
throws away four good ones to avoid a bad one, and the reader loses a real read
because a model would not stop writing. So `sanitiseDescriptor` drops the
sentences that cannot be sent and keeps the ones that can, and the gate then
runs on what is left. A paragraph that is nothing but bad sentences ends up
empty and is refused on the specificity question, which is the honest outcome
for it.

**Why these are deterministic.** A judge that scores the same input differently
on two runs cannot be a hard gate on a live send path, and a gate that sometimes
lets a bad email through is not a gate. What a machine cannot check is written
here rather than pretended away: it cannot tell whether the paragraph is *true*,
only whether it is specific, in voice, and within its rights.

**Where the questions came from.** Every one of them is a thing that actually
happened, not a thing imagined. Questions 10, 11 and 12 were written after three
live runs: Brandfetch resolved a one-person consultancy's company to the
founder's personal name, so the email would have opened "You are Director at
Kristof Hermans"; the synthesis told a real business it was "still establishing
your market position", which is a verdict on somebody's company delivered
unasked; and it recited the reader's own hosting stack back at them, which reads
as surveillance rather than insight.

**What the live battery taught, on 29 August 2026.** Fourteen real domains were
run through the deployed function and the results read rather than counted. It
found seven defects, six of which no hand-written fixture would ever have
produced, and `src/test/read-live-corpus.test.ts` now holds the paragraphs it
actually returned so a future model or provider change shows up as a failing
test rather than as a worse email.

| What came back | What it exposed |
|---|---|
| "built on Salesforce, Contentful and Ruby on Rails" | A vendor list can never be complete. The construction is the tell, so the rule now matches "built on / powered by / runs on" followed by named products. |
| "now employing 501, 1000 people" | Our own dash rule turned a headcount band into two wrong numbers. A dash between digits is a range, not a clause. |
| "University Of Oxford" | Company names need the same minor-word rule as job titles. |
| "You remain the world's leading research and teaching institution" | Flattery is the verdict rule with its sign flipped, and it is what the visitor came here to get away from. |
| "you face chronic funding pressures and waiting list backlogs" | True, widely reported, and still not ours to hand somebody unasked. The house rule against doom is not only about the word "failing". |
| "YAY! Mushrooms" | A real Marks and Spencer product. A bare test for an exclamation mark refused a good read over a brand name; our own shouting ends a word, a brand carries the mark inside a capitalised token. |
| Four whole reads refused over one trailing sentence | The remedy was wrong, not just the rule. Repair now comes before refusal. |

The re-run that verified those fixes exposed the next layer down, which is what
iterating against real data looks like rather than a sign something is wrong:

| What came back | What it exposed |
|---|---|
| "Marks And Spencer", "University Of Oxford" | The dossier's own name skipped the minor-word rule that job titles already had. |
| "Shopify.com" | A provider handed back the hostname as the name. The first fix keyed on case, on the theory that a raw hostname arrives in lower case and a real name carries a capital; the pipeline then returned "Shopify.com" with the capital and the rule never fired on the case it was written for. The suffix now comes off only when the name restates the visitor's own domain, which is when it carries nothing they do not already know. The cost is that a visitor at Booking.com, which really is called that, would be addressed as "Booking": one company against every company whose provider hands back a hostname. |
| "Shopify remains the dominant...", "You remain the backbone of British healthcare" | The flattery rule only matched a second-person subject. |
| The NHS read cut to two thin sentences | The specificity floor was measured across the whole body, so stripping the doom sentence left the part that carries the specifics nearly empty while the total still cleared. The floor now applies to the repaired paragraph itself. |

Six of the gate's own fixtures failed against that raised floor because they were
shorter than anything the pipeline actually returns. The fixtures were lengthened
rather than the floor lowered: it is calibrated from real reads, which run to
three hundred characters and up.

### Why the gate keeps finding the next phrasing, and what would stop it

Three passes of the doom rule each caught the phrasing in front of it and missed
the next one: "chronic funding pressures", then "waiting list backlogs", then
"limited resources and mounting demand". The rule now matches the qualifier and
lets the noun be anything, which generalises further, but the pattern is worth
naming rather than fixing again quietly.

**The filtering is compensating for a prompt aimed somewhere else.**
`synthesizeDescriptor` was written for `/ai-gtm`, where the paragraph is
addressed to a company about its market and "you face rising costs" is on brief.
The personal read reuses it unchanged, so doom, flattery and stack recitals are
not stray defects: they are the GTM prompt working as intended, in a place that
wants something different.

**The durable fix was a personal-read variant of the prompt**, and it is now in
place as `synthesiseWorkingLife` inside the personal-read function. The shared
`synthesizeDescriptor` is untouched, because `/ai-gtm` has been reviewed and
approved as it is; this is a second prompt on the same provider plumbing.

**The two reads are different artefacts, and that is the point.** The GTM prompt
says so itself: a sharp outside read of a company, ending on a plain statement
about the business. A leader asking what AI changes about their own capability
and output is asking a different question, and for a while this page answered
the first one with a job title pasted on the front. The company read is now the
*input* to the personal one rather than the thing that gets sent: what comes
back is about the seat, what somebody in it spends their judgement on, and where
the ceiling on their own week sits. If the personal read cannot be written,
nothing is sent, because falling back to the company read is how the page ended
up generic in the first place.

### What testing real people found

Five of Krish's own LinkedIn connections were run through the live person
lookup on 29 August 2026, using their real names and their real employers'
domains. Preview only: nothing was stored and no email was sent to any of them.

| Person | What PDL returned | What they actually do |
|---|---|---|
| Lisa Burton | Vice President at HearstLab | correct |
| Lewis Maleh | Founder and Chief Executive at Bentley Lewis | correct |
| Abimbola Ikusika | Customer Success Specialist at Accomplishr | correct |
| Alanna Laforet | no match, read refused | enGEN3 has thin public data, and the refusal is the system working |
| Jay Gilden | Co-founder and Executive Director at Openly | **wrong person**. He is I&A Associate Director at Wavemaker |

**One in four resolved matches was the wrong human being.** That number matters
more than any of the presentation defects, because the others make a read read
badly and this one makes it say something false about a named individual in an
email addressed to them personally.

It also corrects an earlier claim. Two of three public figures were reported as
resolving, as though that were a hit rate; nobody had checked whether the two
were the *right* people. Benioff and Collison happen to be unmistakable. Ordinary
names are where this breaks, and Jay Gilden is an ordinary name.

### The employer cross-check

PDL treats the company as a signal rather than a filter, so a common name comes
back attached to the wrong employer. Testing with real people rather than
invented ones returned an I&A associate director at Wavemaker as a co-founder at
Openly: same name, different person. `min_likelihood` cannot catch that, because
the match is confident and wrong. The employer PDL returns is now checked
against the domain that was asked about, and a mismatch discards the person and
falls back to a company-only read. A wrong job title is worse than no job title,
and an email that opens by telling somebody they work somewhere they do not is
the worst version of it.

Verified against the case that exposed it: Jay Gilden at wavemaker.com now
returns a company-only read, and Lisa Burton at hearstlab.com still resolves.
The control matters as much as the case. A guard that discarded everybody would
look identical to a guard that worked, if the only thing checked was that the
bad match stopped appearing.

`src/test/read-quality-gate.test.ts` holds forty-odd scenarios against it,
including every division, every pair of answers, a descriptor in another
language, a company that capitalises itself oddly, and the provider states that
return nothing. One of them earns its place twice: the first version of the
"passes judgement" rule matched the bare word "behind", which appears in the
Product division's own line as a preposition, so it would have silently refused
every visitor who picked Product and nobody would have known why.

## Amendment, 29 August 2026: every dead end ends in a person

The gate above is the right behaviour and it was only half a change. A read that
cannot be written well enough to send is not sent, and until this amendment the
visitor was then told so and left there. Alanna Laforet at enGEN3 is the shape of
it: a real person gave four true details, waited, and received one sentence
explaining that nothing was coming. She is a lead we asked to leave.

Nine failure paths across the site did the same thing. Not one offered a human,
and by the time most of them fire **the page already holds the visitor's first
name, last name, work email and division**, so the offer does not need a form.
It needs a button.

### The nine

| Where | Offer | Details already held |
|---|---|---|
| `/ai-brain` read refused by the gate | panel | yes |
| `/ai-brain` read request failed | panel, with a retry | yes |
| `/ai-brain` rate limited | panel | yes |
| `/ai-brain` results email would not send | panel, with a retry | yes |
| Shared capture, personal address | quiet line inside the error | partly, carried across |
| `/ai-gtm` verification code would not send | quiet line | yes, from the journey |
| `/ai-gtm` code wrong, expired or locked | quiet line | yes, from the journey |
| `/ai-gtm` neither delivery confirmed | panel | yes, from the journey |
| Ask bar, unmatched question | quiet line | no, so it asks |

Two paths deliberately have no offer. The `/ai-gtm` live company read failing is
not a dead end: the journey carries on to a real recommendation and a real
hand-off, and a second door beside a working one only asks somebody to guess
which is the real one. It gained the honesty about whose fault it is instead.
The live market board is content rather than conversion, and stays as it is.

The rule for which shape: a **panel** where the road is definitively closed, so
the offer is one click; a **quiet line** where a working retry is sitting right
there, so the panel does not shout over it.

### The register

Dry and self-deprecating, and the machine is the butt of the joke every time.
Never the visitor: a joke at the expense of somebody who has just been let down
is not levity, it is a second insult. The apology comes first and plainly, then
one line about our own machine, then the button. Nobody arrived wanting to
laugh, so the joke is small and gets out of the way.

`src/content/handoff.ts` holds all nine, `src/test/human-handoff.test.tsx`
holds them to the house style, and both files are inside the site-wide copy
gates in `src/test/brief2-public-contract.test.ts`.

### The action

`mindmake-personal-read` takes a third action rather than growing a second
function: it already owns the origin allowlist, the HMAC identifiers, the
operator address and Resend. `submit-mindmake-brief` is untouched, so
`/ai-gtm`'s dead ends post here too; the action is a generic person-plus-reason
capture and does not care which page it came from.

Three things about it are deliberate and each undoes a way this could have gone
wrong:

- **It does not spend the read limiter.** That meter caps paid provider calls
  and results emails, and one of the reasons somebody arrives here is that they
  already tripped it. Charging them for asking for help would leave the dead end
  most in need of a way out with none.
- **It does not apply the work-address rule.** The rule exists to serve the
  reading, and by the time this action runs the reading has already failed.
  `personal-email` is one of the reasons a visitor can arrive with, so enforcing
  it here would answer "we cannot read your company" with "and we will not talk
  to you either".
- **The visitor gets no email.** Two emails ever is a published promise in
  `01_CANON.md` and a handoff is neither of them. The operator is told; a person
  replies as a person. What is capped instead is that notice, at one per address
  per hour, counted off the rows this function writes. Over the cap the row is
  still stored and the visitor is still told the truth, because it is with us
  either way.

### Where the row lives

`public.mindmake_personal_reads` gains `handoff_reason`, with a check constraint
mirroring the parser's allowlist exactly as `division`, `q1` and `q2` already do.
`q1` and `q2` stop being required and start being required together: a row is
either a read, with both answers, or a handoff, with a reason, and
`mindmake_personal_reads_shape_check` refuses anything that is half of each. RLS
is unchanged, still on with no policies, still service role only. No new
personal data is collected, and the retention schedule that covers this table
already covers all of it.
```


## Archived source: project-documentation/website-redesign/BACKEND-RELEASE-EVIDENCE-2026-09-24.md

Original raw SHA256: AB2F88C1EBB53328C2594E1DCDC13F3F876C0CD5EE022A469F015909655C9BFC

```markdown
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

## Final type-only source-parity addendum — 14:46 BST

The release lint found two explicit-any annotations introduced by the earlier Deno compatibility repair. Both now use the Supabase package's exported `SupabaseClient` type, imported type-only, with no suppression. No runtime statement or behavior changed. TypeScript-transpiled ES2022/ESNext JavaScript (comments removed) was compared with the independently downloaded v19/v24 files: **byte-identical emitted runtime JavaScript for both entry points**.

Before redeploy: all three Deno closure checks passed, ESLint on both changed entry points passed, and the provenance/brief-core/personal-core suite passed **67 tests across three files** at 14:45 BST. Coordinated redeployment changed only `submit-mindmake-brief` and `mindmake-personal-read`.

Current exact metadata readback:

| Function | Version | Status | Verify JWT |
| --- | ---: | --- | --- |
| enrich-company | 44 (untouched) | ACTIVE | true |
| submit-mindmake-brief | 20 | ACTIVE | false |
| mindmake-personal-read | 25 | ACTIVE | false |

The two final closures were independently downloaded to `C:/Users/krish/.scratch/mindmake-backend-deployed-20260924-types`. All **19 unique source modules** matched repository SHA-256 exactly. Updated entry-point hashes:

- submit-mindmake-brief/index.ts: `33CE410B8EC26381E6B553D5620B5C125AB3B90FAB9E86A1283BDA143E98C936`
- mindmake-personal-read/index.ts: `1093FE13DB10D9A40E18576F3EF67BC8B6251F29415E12732C8C38425D21FAF3`

Earlier real inbox/persistence/queue receipts remain evidence for the runtime-equivalent backend. No browser or email was run for this type-only increment. A fresh browser canary on the newly published frontend, including its actual success-screen download, is still pending the frontend promotion; the earlier browser receipts exercised the prior live frontend. The prepared QA driver supports both entry layouts and an explicit actual-download action without substituting generated fixtures for that final check.

## Post-publication new-frontend canary — completed 24 September 2026

This addendum closes the pending new-frontend/browser-download boundary above. The release owner verified production promotion before authorizing this run: PR170 merge `3ee77cf9956f98dd73f69d0b48745930335e74e1`, Vercel production `dpl_EZigNAi6Uc6Apcq75XsFnHETt5W8`, deployment URL `https://mindmake-bh0d8hczk-krish-rajas-projects.vercel.app`, public `https://mindmake.co`, script `/assets/index-CZk5zedf.js`. Publication identity and the separate route/motion/browser matrix are recorded in `RELEASE-2026-09-24.md` by the release owner.

The live canary itself used `https://mindmake.co/?start=brain` in a fresh Chromium session at 1440×900 and the designated inbox only. It observed the new **company-then-profile** entry, not the prior combined form:

1. Work email → Read the business → First name/Last name/Leadership → See the company read.
2. HTTP200 company read correctly resolved the legacy inbox to Mindmake at `mindmake.co`, with the literal corroborated description and first-party AI GTM source. Three choices returned by the endpoint; the existing generic option set appeared in this browser journey.
3. Context pressure → Grow this business → approved folio preview → Keep the private brief → explicit “Email verification is next” confirmation → Continue → email/code step. Publication interest stayed unticked.
4. Exactly one code-send action, one fresh inbox code and one successful confirmation. No resend, guessed code or extra results send.
5. Success UI displayed the completed “Your private brief” article and actual Download my brief control.

The first read-only traversal stopped before any send because the QA driver's generic dialog selector matched the expected nested folio confirmation and parent. The driver was scoped to the observed outer `.mm-brief-panel[role="dialog"]`, and the browser restarted. This was a harness selector correction only, not a product repair; the only completed delivery is the request below.

### Actual delivery, persisted state and exactly one queue

Baseline for the designated inbox: zero brief requests and zero brief follow-up rows.

- Request ID: `5dadd5c1-5d27-468a-ad51-97d53391452b`.
- Created `2026-09-24T15:13:06.428362Z`; verified `2026-09-24T15:13:39.362906Z`.
- Confirmation HTTP200 `confirmed`; assembly `ready`; all three provider IDs present; visitor/operator delivery states `queued`.
- Verification INBOX receipt: `1a0d3fa47f0ac47c`, `15:13:08Z`.
- Visitor brief INBOX receipt: `1a0d3fac761c5add`, `15:13:40Z`, “Your Mindmake brief for Mindmake”. Its HTML attachment and correct literal Mindmake description were confirmed; no known wrong entity/predictive-software claim.
- Operator digest INBOX receipt: `1a0d3fabe3daa4f7`, `15:13:40Z`, “Mindmake brief: Mindmake | Too much important context lives in my head”.
- Visitor receipt initially did not appear in a fresh-time search, then was found in INBOX using its exact subject. No resend was used to mask the observation gap. Provider acceptance alone was not counted as delivery.
- Exactly one follow-up row: `40afb55f-5a23-475f-ae9d-b4d4fdc7da7c`, source `brief`, due `2026-10-08T15:13:40.444Z`, attempts0, unsent. No cron sender invoked.

### Actual completed-journey download

Clicked the real production success-screen **Download my brief** button and captured its browser download event. This was not a test fixture or locally regenerated substitute.

- Saved file: `C:/Users/krish/.scratch/mindmake-production-canary-20260924/live-private-brief-1790262854870.html`.
- Size: **3,755 bytes**; SHA256 `0A85D52E50000045E1ED602E3DB8FC2B526A0A8EB7A93C79779C6583F6FA4D20`.
- **15 content fragments** extracted from the actual on-screen article matched the saved HTML, including the selected pressure, company read, evidence, AI/human boundary, first proof and returned time.
- Opened the downloaded file at 1440px and 390px; no horizontal overflow, placeholder residue or external requests. Both screenshots were visually inspected: text/cards readable with no overlap or clipping.
- Screenshot paths use the same basename with `-1440.png` and `-390.png` in the designated scratch directory. The saved artifact contains only the authorized synthetic visitor's brief, not verification codes or secrets.

### Precise cleanup and final boundary

Deleted exactly the captured request ID and captured unsent follow-up ID, additionally constrained by the designated email and queue source. One of each removed. Independent readback returned **remaining_brief0 / remaining_queue0**. No other leads were touched. The three receipt emails remain as evidence. The canary browser was stopped through its owned session and exited0.

The promoted progressive frontend, real code verification, actual visitor/operator inbox delivery, stored ready brief, single due follow-up, and actual completed-journey download have now all been verified together. No further sends were made. Physical VoiceOver/TalkBack remain the separately documented owner-approved exception; nothing in this browser/backend canary claims those checks passed.
```
````````````
<!-- END ARCHIVE FRAGMENT design-lead-backend-originals -->

## 2026-09-24 technical discovery and current-documentation closeout, pre-promotion

Authority: Krish requested current-only project documentation with one historical
ledger, and SEO/GEO, favicon and social metadata improvements within the accepted
R3 production closeout. No page-body redesign or additional commercial claim.

The numbered canon and root guidance now describe current contracts. All replaced
originals are retained above with provenance; legacy paths are short locators.
An independent review caught and corrected stale public pricing/duration guidance,
lifetime email-cap overstatement, nine-versus-ten career references, a nonexistent
live consent lookup and stale failure-path counts. Verbatim published quotations
were not rewritten. Schedule configuration is not called fresh live verification.

Technical changes expose each page's existing SEO metadata and structured data in
initial HTML and retain it after client navigation. The sitemap no longer claims
every static page changed on every build. The optional llms directory comes from
the same approved indexed routes; it is not a promise of AI citations. Three share
cards retain their artwork and use accepted wording. Existing icons are unchanged.

Source proof: all 26 unnormalised rendered bodies have identical before/after
hashes in artifacts/homepage-release/seo-body-parity-2026-09-24.json. Immutable
R3 source SHA256 remains 46be2e145f8175399e724bbaf80bc2014a8bf6ab5ce7184b6243a5bdae9a7007.
Local full suite: 541 tests across 36 files pass; lint zero errors and two existing
refresh warnings; typecheck and 26-route build pass. First runs caught four stale
documentation/metadata test assumptions; reconciled against current source without
removing semantic or fail-closed assertions. The final reveal fallback test remains.

Independent review rejected R15's new raw SVG/webmanifest text hashes before commit:
they would fail cross-platform checkout. R15 remains unchanged as rejected evidence.
R16 explicitly opts SVG/XML/webmanifest into LF-normalized text hashing, preserves
older manifest semantics and exact binary hashes, and tests both boundaries.
Archive corruption/transport checks are now in every build through qa:docs.

The metadata detector initially waited for a server-rendered tag, which could not
prove hydration. It now observes an actual JavaScript title write and must detect
a deliberate delayed robots regression. Its route set is checked against source,
not merely the sitemap under test. An initial local Vite run failed because clean
paths received the SPA root, not their built directory HTML. Local checks now use
an explicit directory-index mode; public verification still requires clean URLs.
Built local check at 2026-09-24T16:05:21.690Z passed all 26 routes and 32 assets.
This local receipt is unbound to a final commit; clean CI and live readback remain
required and are not inferred from it.

Only backend delta: the visitor email's contradictory no-automatic-sales wording
is corrected to disclose its existing single day-14 follow-up. Pure source equality
proves only that sentence changed. 115 focused tests and 9 Deno runtime tests pass;
the live version remains unchanged until a separately verified submit-only deploy.

Search Console/Bing property access, actual indexing/rankings/AI citations and
external social-cache rendering have not been verified. No new emails, search
submissions, DNS, crawler-training policy or dependency upgrades were performed.

## 2026-09-24 R16 technical discovery release: verified production closeout

PR171 merged at 16:18:47Z as 9e79e351db45ecb2f2f8b2e383639d402ab1c7a2.
Candidate ff8f8d31402aea38c02b4ffddaefd628079c83b0, CI merge
ee0b58d44f542fb9daaa050399aae1cf869ce78b and production merge share exact Git
tree 0859da5aa90510e0eb97955a86f4b12d908a276c. Both clean CI runs
36025203645 and 36025199539 passed: 541 tests/36 files, lint/type/build,
26 prerendered routes, 208 route cases plus nine navigation supplements across
Chromium, Firefox and macOS WebKit. Both platforms passed all 12 ordered motion
cases and 12 fallbacks. Linux passed all 26 initial/hydrated heads and 32 assets.
The same built homepage SHA was
ce3af36504deb4c9911bd22b66f8cf42344a74546d97cea95be99b00332b87cb.
Built artifact10819157619 and the report hashes/counts are bound in
artifacts/homepage-release/r16-ci-receipt-2026-09-24.json.

Vercel production dpl_GcehNF5XMtFagREZ9Y5pKhHLQyJZ is READY at
mindmake-aijrjhst8-krish-rajas-projects.vercel.app with public aliases verified.
The immediate preceding recoverable deployment is dpl_EZigNAi6Uc6Apcq75XsFnHETt5W8.
Public clean-URL verification at 16:20:40.819Z passed 26 routes/32 assets with
actual client metadata writes and deliberate regression controls, not an SSR
tag falsely counted as hydration. Report:
artifacts/homepage-release/discoverability-mindmake.co-2026-09-24T16-20-40.819Z.json.
Public homepage SHA256 is
16e77acd33e0485dea521da605de0b6988b40146b707bac77b413140796a7342;
/assets/index-DWnOh45o.js is
d7c36a786647bb85ffa0eae07ee7d1368fd60c77ec0df7f258ba9eeed9be3192.
Public rendered checks at 1440x900 and 390x844 found no JS errors or horizontal
overflow; history/dividend forward and reverse stages, cookie clearance, menu
focus containment and Escape restoration passed. Actual screenshots were
inspected, including settled navigation after its entrance transition.
One nonblocking existing behavior is recorded, not hidden: desktop initial
navigation focuses H1 and displays its keyboard outline; mobile focus remains
BODY because the first H1 is the hidden desktop variant. No unapproved design
or focus behavior change was made in this metadata release. Evidence prefix:
artifacts/homepage-release/r16-live-16e77acd33e0.

Submit-only backend v21 became ACTIVE at 16:12:39.707Z, JWT unchanged false.
All 15 officially downloaded modules match ff8f8d3. Enrichment44 and personal25
are unchanged. Bundle SHA256:
c1511b1dc78e5b4c4f81ad5c1e9c45d83169a997d66ef850fe995607542f0ff3.
OPTIONS200/success and GET405/method_not_allowed match source. The initial QA
expectation of OPTIONS204 was corrected after inspecting the actual existing
contract; no implementation was changed to fit the test. The one-sentence
follow-up disclosure is now deployed. No POST, email, queue, cron, schema or
other-function mutation was used in this wording-only readback. Earlier actual
INBOX evidence proves the unchanged sending path, not a newly sent v21 message.
Redacted all-module receipt:
artifacts/homepage-release/backend-submit-v21-2026-09-24.json.

The current numbered docs and root arrival router now state these verified
facts; prior states remain in this append-only ledger. R1-R16 manifests and
the exact R3 reference remain unchanged. All 100 R16 bindings and 57 preserved
R14 bindings were independently verified. No indexing, ranking, AI citation,
social-platform cache refresh, new physical assistive-technology pass, future
day-14 inbox delivery, clean dependency audit or other-client harness rollout
is claimed. These remain the explicit limits in 06_CURRENT_STATE.md.

## 2026-09-24 GTM-PLAIN-R2 replaces GTM-MOTION-S1 on /ai-gtm

Owner direction: /ai-gtm read as one long page, sections overflowed a screen,
the signal-then-response picker was neither obvious nor worth a visitor's
effort, and the copy was cryptic. Mock r1 (a new visual system) was rejected
for design; r2 rebuilt the new copy inside the approved GTM system and Krish
approved it on 24 September 2026 on condition that phones feel native, and
authorised the build through to main.

Decisions taken with the owner in session: speak to both the established B2B
leader and the AI-native founder through one switch; state the service plainly;
publish the deliverable menu and the 30-day shape with the fee kept private;
map all four levers in week 1 and build and test the one worth most in weeks 2
to 4; prove it with the two verified GTM results; keep interaction to the
team-board flip.

Superseded public copy, retained here as required:

- GTM headline: "We turn an AI market shift into one tested commercial move."
- GTM promise: "See how one market change alters product, price, positioning
  and people before you commit."
- GTM film line: "Start with the commercial decision that is holding the rest
  of the system back."
- Live H1: "See what your response changes." Kicker: "One market change. One
  choice. Four consequences."
- Canon rules "no public price or duration" and "no public day-30/60/90
  packages or duration promises" now carry one owner-approved exception: the
  30-day shape on /ai-gtm.

Retired sources: src/pages/AiGtmLocked.tsx (r17 sha256
7e50da2c4e04fd6aab24694a433d0794747eaa60ebb161cb3782b7c4b1c2467c) and the
unrouted src/pages/AiGtm.tsx. The prototype
prototypes/website-redesign-recovery/gtm-market-change/index-motion.html (git
blob ab4347aa8c376867d29895e5ed6d21573b9c4c57) remains in the repository unchanged as the historical reference.
Route lock: quality/route-lock/approved-production-r25.json (built on r24). As r18
requires, the shared commercial Decision Balance is not mounted on /ai-gtm; the
site action bar carries Start here and the door to /ai-brain.
