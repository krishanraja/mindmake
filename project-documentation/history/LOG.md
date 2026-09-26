# History log

Newest first. Entries are written by the docs steward (see the steward link in
`NOW.md`) and by humans doing the same job by hand. Nothing in this file
describes current behaviour; `NOW.md` and `06_CURRENT_STATE.md` do. A figure
in this file is a reading on the date above it, not a baseline.

## 2026-09-26

- BRAIN-NARRATIVE-S5 on `/ai-brain`, the long read `/blog/how-an-ai-brain-works` and two `/faq` answers, from Krish's brief that the Brain "is depicted on this site as being conceptual but in actual reality it's an impressive piece of technology", with "radical minimalism" and no "weird eyebrow headlines and random stray comments". Mocked in four rounds on the branch and approved ("I like your recommendation:A"; "Yes but dont suggest the brain is just a text file"); receipt `quality/ai-brain/approved-narrative-s5.json`, ledger `AI-BRAIN-TECHNOLOGY-001` and `AI-BRAIN-FIT-001`. Rulings: the 30-day build is public on `/ai-brain` as well as `/ai-gtm`; the Brain is sold on jobs and outcomes, never on named AI companies or integrations; the build chooses the leader's tools with them, builds the Brain into them, proves outcomes and leaves them able to run it; it is a working system, never a file; CTRL stays unnamed on the page. Superseded copy, verbatim: hero lede "Every AI you can buy already knows the market, and none of them know you. We help you build the one that does, private to you and sharper with every call you make."; Inside lede "Ideas, standards and the reasons that connect them. Yours would be built from your real work and what you tell us, and look like no one else's."; inspector label "What this Brain holds"; noscript "The live carousel needs JavaScript. The full record remains available in the approved source fixture."; rail You / Inside / Sharper / Private / Business. Rejected in review: the living record's ports named ChatGPT, Claude, Copilot and Gemini (replaced by Board paper, Client reply, Next post, Team brief) and a separate Everywhere chapter (variant B). Superseded rule: "Its only public duration is the 30-day shape on `/ai-gtm`". The chapters now centre between the fixed header and the action bar (measured 201px above and 43px below at 1440x900 before, 95/96px after), and on a laptop the action bar's ground reaches the bottom edge while the privacy card is up, on every route.
- Caveat labels removed from every page, from Krish: "Get rid of all the annoying asterisk commentary, like illustrative machinery, from the whole." Removed verbatim: "Illustrative machinery" (the reach chapter on `/` and `/new-age-leadership`, and the `/new-age-leadership` hero), "Illustrative team" (`/ai-gtm`), "Read from the outside as an illustrative example of how the Mindmake brain works. None of this is advice." and "Illustrative sequence. Not evidence." (the brief drawer). `qa:start-here-s4-production` now fails if the folio's caveat returns. Ledger `CAVEAT-LABELS-001`.
- Two follow-ups, on Krish's "Go" to the recommendations: every history era now names its event, "370 BC · Writing is invented", "1675 · The engine loom arrives", "1970s · Calculators reach classrooms" and "2000s · Satnav goes mainstream" (set by the generator in markup and runtime; they display in capitals, so his "IS INVENTED" reads the same), and under reduced motion the reach reels show all ten words per column as a still list with the band and dial on the fifth row (`integration.css`). This supersedes the single "Writing IS INVENTED" label and closes the reel item left for Krish below.
- Homepage screen-size audit (Krish: "run 1"), Chromium only. Seventeen states of every changed section were captured from production at twenty viewports (320x568 to 2560x1440, plus reduced motion at 390 and 1440); seven reviewers found 38 candidates, which clustered into 21 distinct defects; three independent checks per defect confirmed 11 and refuted 10. Fixed in `integration.css`, homepage only: the generated 980px chapter cap no longer leaves a flat band under the history film or clips the route receipt on screens taller than about 1046px; the reach heading's first line no longer sits under the masthead on 320x568 and 360x640, and the reach panels no longer run under the Work / Organisation rail at 375x667; the closing chapter fills 414 and 430 phones instead of a centred 390px frame; the route's back control and brief button keep legible floors on tablets; the benefit heading yields to height on wide, short desktops so the quote clears the slider at 1536x730; the phone era rail marks the current era. Left for Krish: the reduced-motion reach reels show six of ten words per column and their highlight band straddles two rows (a static re-layout was proposed, not applied).
- Four loose ends from the homepage change, on Krish's instruction ("do both"). The returned hour's answers read "Invest the time into" and "Invest into" (the shared chapter source, so /new-age-leadership reads the same; the R5 prototype baseline is untouched). The homepage's search title, social titles, share plate (`public/social/home.jpg`, repainted), `pages.mjs` entry and `llms.txt` summary carry the live hero headline, "Build the human + AI business that augments your vision.", as do NOW.md, README.md and the canon; /new-age-leadership keeps "Build the business that can think with you" as its own title. The first era label reads "370 BC · Writing IS INVENTED" as the R3 markup already said: `build-homepage-release.mjs` now reads it from the markup instead of letting the runtime restore "370 BC · Writing". The docs steward had failed on every push to main since at least 25 September: NOW.md lacked its seven schema sections, and this log carried em dashes, out-of-order dates and about 180 non-date headings, all inside the twelve verbatim documents and two verbatim fragments archived here on 24 September. Those fourteen originals moved byte for byte to [ARCHIVE.md](ARCHIVE.md) (every stored body re-verified against its recorded SHA-256; `website-restart-contract-check.mjs` now reads them there), this log keeps a pointer at every original anchor, the dated sections are newest first, and NOW.md follows the steward schema. Ruling (Krish, 2026-09-26): Chromium alone; do not run, wait on or read Firefox or WebKit results unless a task needs one of those engines (CLAUDE.md, STATE.md).
- The approved R5 prototype baseline `prototypes/website-redesign-recovery/new-age-leadership/index-s3-r5.html` restored to its recorded bytes (SHA-256 `cdf7603e…5ac7b1`, as at `bdf45ec`). Earlier on 26 September its copy had been edited in place with the new reach, practice, benefit and returned-hour words; those words are production source in `src/components/leadership-chapters/leadershipChapters.ts`, which keeps them, and the baseline stays byte-identical by rule. The edit failed `qa:new-age-r5-production` in main's Chromium and Firefox release matrix after the homepage merge (run 36251066310); nothing in production reads the file.
- Homepage copy and fit, from Krish's five screenshots of the history, reach, practice and returned-hour chapters: "put the 'if the device' text and its counterparts in quotation marks, stop it wrapping so aggressively so that the text beneath doesnt fall off the bottom of the section. Same with the 'what people do' text and 'when built right' text", "make the 3 points beneath 'what will you do' smaller so they all fit on one line and dont fall off the page, and then animate the first one being crossed out with a redline as you scroll", the closing chapter's new title, lede and steps with comfortable spacing, and the hero's film behind that chapter, "only to the homepage". Root cause of two of these: earlier the same day the R3 source's markup had been given the quoted questions and the new closing words, but the runtime, generated from the R3 script, rewrote both with the older copy on every load, so neither showed. `scripts/qa/build-homepage-release.mjs` now reads the AI brain state's words from the markup and sets the questions in curly quotation marks in both markup and runtime, each counted so a drift fails the build, and points the AI brain state's film and poster at the hero's r07 loop (the AI GTM state keeps film-04). Type fits in `src/components/homepage-release/integration.css`: history questions to three balanced lines at up to 60px, bounded by the frame's height, with a hanging opening mark on a desktop; reach headings at 4.6vw (three lines, where there were five); "When built right, AI is our biggest level-up." at 3.3vw on two lines, where there were four (9.2vw on a phone, two lines where "level-up." sat alone); the returned hour's answers at 3.66% of the list's width, one line each (21.7px at 1440, 13px at 390); the returned hour's question capped by 10.5vh on short laptops; the closing title bound by its column so it reads "Own your / judgement, / and amplify it." with no lone "and"; the steps across the band on a desktop and stacked on a phone. The red strike is `src/components/homepage-release/returnedHour.ts`, which wraps the first answer in `<s>` after mount and sets its length from scroll position, both ways. The pre-merge browser contract (`scripts/qa/homepage-scroll-contract.mjs`, `homepage-release-browser-check.mjs`) was still expecting the opening, reach and returned-hour words from before the earlier edits and failed on main; it now expects the live approved words and the quoted questions.
- 2026-09-26: the phone hero crop moved from the film's right edge to 55% across (`src/components/homepage-release/integration.css`) so r07's mint circuit is visible, on Krish's instruction.
- 2026-09-26: the /ai-brain opening film loses 10% of its darkness on Krish's instruction: its scrim runs at 0.9 opacity and the film's brightness filter moves from 0.72 to 0.75 (0.64 to 0.68 on a phone) in `src/styles/mindmake-locked-brain.css`.

## 2026-09-25

- The history chapter's era changes made smooth, from Krish's Android Chrome screenshot of the writing era: "These section transitions are quite jittery. Is there any way to make them smooth as butter?" Two causes. Each era change was a hard cut: the words and picture swapped in one frame and the new picture could paint blank until it decoded. And the pinned frame was sized in `dvh`, so the phone's address bar showing or hiding resized the frame mid-scroll, moved every `cqh`-placed line and, through `innerHeight`, re-laid the track and its step under the reader's finger. Fixed in the hand-written pin controller only (`src/components/homepage-release/pinnedChapters.ts` and `.css`; the generated R3 untouched): the frame takes `svh`, the step and pin test read the stable initial containing block, and a scroll-driven change holds the outgoing picture over the incoming one until it has decoded, dissolves it over 520ms with a slight settle of the new picture, and raises the story lines in from the direction of travel. The visible words change at once, so the scroll proof reads the current state as before. Reduced motion, short screens and the era buttons are unchanged. Copy, imagery and composition are unchanged; the generated lock is regenerated for the two intended edits.
- The lead dialog on a phone, from Krish's two Android Chrome screenshots (Samsung keyboard) of the dialog opened from a case-study page: "The keyboard interaction on this lead capture form on mobile is absolutely horrendous. It just is not usable at all. Also there's a fake MindMake logo in the top left, which we need to legitimise and replace with the real one. In general when I go through this process, it brings up the company. It doesn't actually properly parse the email. Say, for example, if it's first name.last name@company.com, it should already prepopulate first name and last name in the next step." The cause of the hidden fields: on phones the panel was already sized to the visible viewport and its bottom scroll-padding added the keyboard's height again, so once the visible height fell under about 457px there was no position a field could be scrolled to, and both the dialog's `scrollIntoView({block:"center"})` and Chrome's own reveal parked the field under 103 to 108px of sticky header and rail. The header was also 63px (65 in the desktop modal) under a rail pinned at 58, the step change scrolled back to the top and took focus to the heading, the page behind was not locked, and no field switched off autocorrect ("Divekar" was offered as "Dietary"). Fixed in the frontend only: one header height the rail pins under, an opaque header and rail, the keyboard counted once, a focused field brought back into view by the panel alone and only when it has left view, the page locked on phones, correction off and return keys set on every text field, a code field that takes a paste and sends six digits once, the real mark and wordmark (`BrandMarks`) in place of the text "MINDMAKE" beside the S4 label "Start here", and first.last@ or first_last@ read into the name fields (`nameFromEmail`), never replacing a typed name. `npm run qa:lead-keyboard` shrinks the visual viewport the way a keyboard does and holds every field on screen at 390x844 and 320x568; against main 95dfcc9 it failed 60 times, 18 of them fields under the header. Landscape phones with the keyboard up remain a known limit. The rest of the message ("a 100 times more intelligent proposal ... all the way through to what they receive") is recorded as LEAD-BRIEF-INTELLIGENCE-001 and LEAD-BRIEF-DELIVERABLE-001 for a second release that starts from a rendered mock.
- One type system, word by word, from Krish: "The AI brain page contains all the right fonts and font sizes. The homepage and other pages do not. Audit every single word and standardise the fonts everywhere." A computed-style audit of every visible text node on 33 routes (32 after /answers joined /blog) at 1440x900 and 390x844 against `/ai-brain` found the earlier r33 pass had misread that page: its reading copy is Newsreader 400 (16px on a phone, about 21px for a desktop lede), not Archivo, so every shell page (About, Ideas, Quick AI tips, Questions we get asked, Contact, Privacy, Terms, articles, answers, 404) set its paragraphs in the wrong face. The homepage still spoke R3's own system: an Archivo lede, door lines and proof line tracked open (the screenshot Krish sent), Archivo capitals for the history dates, an Archivo 500 heading in the history bridge and receipt, Archivo 500 footer routes, Archivo capitals for Subscribe and the Media badge, a bold "Menu", and Plex Mono at 650, which the site does not ship, so the browser drew a synthetic bold. Also: `/new-age-leadership` labels at .15em to .16em and its finale kicker rendered as 24px serif capitals (a paragraph rule outranked `.kicker`); `/ai-gtm` headings at 360/370 and an Archivo 600 outcome line; the decision-balance fine print in Plex Mono at 6.7px to 9px; button text links taking 17px from the `button { font: inherit }` reset. Fixed through `--mm-body`, the type section of `src/components/homepage-release/integration.css` (the generated R3 and its source untouched), the R6 layer of `/new-age-leadership` (regenerated), and the owning route sheets. Words, order and composition are unchanged. `scripts/qa/type-system-check.mjs` (`npm run qa:type-system`) now measures it: 0 failures after, 66 on the previous main for `/`, `/about`, `/blog` and `/ai-brain` alone. The unit test that pinned `--mm-body` to Archivo now pins Newsreader. Feedback item TYPE-SYSTEM-002; the generated lock is regenerated for the intended edits.
- The #208 merge (`40e5545`) failed its Vercel production build, so production stayed on the previous release. Vercel writes `vercel.json` back as compact JSON with a trailing newline before `npm run build`; #208 had rewritten the file without its newline, so the route-lock gate inside the build hashed `5be24ec9…` against the lock's `68c941db…` and stopped. Local gates and CI passed because they hash the committed bytes. Fixed forward by restoring the newline, regenerating the lock and adding a unit test that holds `vercel.json` to the form Vercel builds from.
- Quick AI tips merged into Ideas you can use, and the phone footers lose their route list, from Krish: "Move all the content from the 'Ideas you can use' page into the 'Quick AI Tips' page in its native format, ordered newest first. Add a couple of filters at the top and then rename this page 'Ideas you can use', deleting the old empty one. And then on mobile only, we don't need all the links in the bottom nav bar. It just takes up space when there's a mobile menu that is easily accessible." The merged page lives at `/blog`, the address the archive, `/library` and the old post redirects already point at; `/answers` redirects there permanently and its pages stay at `/answers/:slug`. Retired: `src/pages/Answers.tsx`; the `/answers` entry in `scripts/lib/pages.mjs` (title "Quick AI tips", description "One page per question: the direct answer first, then the case for it, including what the pages already answering that question miss.", plate claim "Answered with a position, not a summary.") and its plate `public/social/answers.jpg`; the archive's search box, featured card and card grid on `/blog`; the `llms.txt` heading "## Quick AI tips"; the menu label Quick AI tips; the handoff's `sharedLanguage.selection.answers`. Superseded `/blog` description: "Useful questions, checks and working methods for leaders making business decisions as AI changes their market." Each answer file gains a `category`, one of the archive's four subjects, so one subject filter covers both kinds; `src/lib/ideaFormat.ts` holds the merge and the order (newest first, `lead: false` never first) for the page and for `llms.txt`. The homepage phone footer's route list is cut by the generator (`scripts/qa/build-homepage-release.mjs`), the R3 source untouched, and its authored 120cqi floor is lifted; the shell footer hides its route links below 521px and keeps Contact, Privacy and Terms on one row. Superseded rule: "Two even columns keep every row paired, for the four-link footer too" now applies to the compact door-page footer only.
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
- 2026-09-25: the homepage opening hero moved from Archive Engine r04 to r07 (`archive-engine-hero-loop-r07-16s-1080p-review-sealed.mp4`, SHA-256 `bbc314f3…a11354`) on Krish's instruction, with new r07 JPG/WebP posters from the loop's first frame. r04 was the hero from r45 until this change and its files remain.

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

<a id="2026-09-24-redesign-documentation-consolidation"></a>
## 2026-09-24 - redesign documentation consolidation

Append-only archival transfer authorised for the completed redesign. The twelve source documents below are preserved in full, including superseded status, exact owner wording, failed checks, corrections, hashes and evidence locations. They are historical records, not current instructions. Current operational truth remains in `project-documentation/06_CURRENT_STATE.md`; accepted design and change guards remain in `project-documentation/website-redesign/STATE.md`. This local archive does not claim a write to the cross-venture Decision Ledger.

Archived from repository revision `0d458c9b5eef8946efb7c09b9b30ca86dbf3bb71`. SHA-256 values describe raw UTF-8 source bytes immediately before consolidation. Each fenced body preserves those exact bytes; source-relative links inside it are historical and resolve relative to the recorded original path. Existing history above is retained without editorial changes.

<a id="archive-2026-09-24-homepage-redesign-brain-award-panel-r1-md"></a>
- Document `project-documentation/homepage-redesign/BRAIN_AWARD_PANEL_R1.md`, raw SHA-256 `bac240bd2afee5583f49a497b8cdd4ac4ddb1ad328f6343af44ba8c5cc2c1322`: verbatim in [ARCHIVE.md](ARCHIVE.md#archive-2026-09-24-homepage-redesign-brain-award-panel-r1-md).
<a id="archive-2026-09-24-homepage-redesign-brain-concept-trace-md"></a>
- Document `project-documentation/homepage-redesign/BRAIN_CONCEPT_TRACE.md`, raw SHA-256 `6859445e88a479651e736ccaafbe7528209b39428056d37f9c45e870ecd3ee05`: verbatim in [ARCHIVE.md](ARCHIVE.md#archive-2026-09-24-homepage-redesign-brain-concept-trace-md).
<a id="archive-2026-09-24-homepage-redesign-concept-trace-md"></a>
- Document `project-documentation/homepage-redesign/CONCEPT_TRACE.md`, raw SHA-256 `87b73e2cb4e2653cf226f905780a95dcb73a8134f67e441d6648ed53394f7d29`: verbatim in [ARCHIVE.md](ARCHIVE.md#archive-2026-09-24-homepage-redesign-concept-trace-md).
<a id="archive-2026-09-24-homepage-redesign-decisions-md"></a>
- Document `project-documentation/homepage-redesign/DECISIONS.md`, raw SHA-256 `68c2a2531c663ecec6e9d06afb4071a8c578ff5440127cbb36d06838a3bf03ca`: verbatim in [ARCHIVE.md](ARCHIVE.md#archive-2026-09-24-homepage-redesign-decisions-md).
<a id="archive-2026-09-24-homepage-redesign-gtm-concept-trace-md"></a>
- Document `project-documentation/homepage-redesign/GTM_CONCEPT_TRACE.md`, raw SHA-256 `5953ff3b6ca3379cf859acf15da0b7c2716da0bf7a2551a689145f6c39a48c58`: verbatim in [ARCHIVE.md](ARCHIVE.md#archive-2026-09-24-homepage-redesign-gtm-concept-trace-md).
<a id="archive-2026-09-24-homepage-redesign-judge-brief-md"></a>
- Document `project-documentation/homepage-redesign/JUDGE_BRIEF.md`, raw SHA-256 `a91690c7f79214ab60d0b872d4dce173621979166052dff4584abdb2e15f3bd6`: verbatim in [ARCHIVE.md](ARCHIVE.md#archive-2026-09-24-homepage-redesign-judge-brief-md).
<a id="archive-2026-09-24-homepage-redesign-round2-judge-brief-md"></a>
- Document `project-documentation/homepage-redesign/ROUND2_JUDGE_BRIEF.md`, raw SHA-256 `9a92a49117ac81fde264c9e50fe26180ebc789a733ed16b36a76a9cff351b95c`: verbatim in [ARCHIVE.md](ARCHIVE.md#archive-2026-09-24-homepage-redesign-round2-judge-brief-md).
<a id="archive-2026-09-24-homepage-redesign-round2-missing-territory-md"></a>
- Document `project-documentation/homepage-redesign/ROUND2_MISSING_TERRITORY.md`, raw SHA-256 `5f643a2967d595ae966981e54004086d4f75f067cc2c544e310de0319e75ecac`: verbatim in [ARCHIVE.md](ARCHIVE.md#archive-2026-09-24-homepage-redesign-round2-missing-territory-md).
<a id="archive-2026-09-24-homepage-redesign-sanitized-brief-md"></a>
- Document `project-documentation/homepage-redesign/SANITIZED_BRIEF.md`, raw SHA-256 `ba36e37a12bbad4edbb8edc61db42a969f3b0bad9e93af92a3202828b753a8dc`: verbatim in [ARCHIVE.md](ARCHIVE.md#archive-2026-09-24-homepage-redesign-sanitized-brief-md).
<a id="archive-2026-09-24-homepage-redesign-state-md"></a>
- Document `project-documentation/homepage-redesign/STATE.md`, raw SHA-256 `8af0041152c56910277c62e4e2643ccf2823cb71ba61849c9151db20587a34b8`: verbatim in [ARCHIVE.md](ARCHIVE.md#archive-2026-09-24-homepage-redesign-state-md).
<a id="archive-2026-09-24-website-redesign-state-md"></a>
- Document `project-documentation/website-redesign/STATE.md`, raw SHA-256 `b38aaffb13d1b3eb8bfbb60f27d3731cef1dca96bd9869dd88d0599306f8affe`: verbatim in [ARCHIVE.md](ARCHIVE.md#archive-2026-09-24-website-redesign-state-md).
<a id="archive-2026-09-24-website-redesign-release-2026-09-24-md"></a>
- Document `project-documentation/website-redesign/RELEASE-2026-09-24.md`, raw SHA-256 `699383ffdf3974aa3f36f19ba0c7738df0fe68f6be7fbd86c84a83116f6c88ca`: verbatim in [ARCHIVE.md](ARCHIVE.md#archive-2026-09-24-website-redesign-release-2026-09-24-md).



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
- Fragment `C:/Users/krish/.scratch/mindmake-docs-parent-archive-20260924.md`, raw SHA-256 `6950497e0de8cd73dd89ec35424a00bdadf72a8d379f5a84af64954988c74ac7`: verbatim in [ARCHIVE.md](ARCHIVE.md#archive-2026-09-24-parent-owned-originals).
<a id="archive-2026-09-24-design-lead-backend-originals"></a>
- Fragment `C:/Users/krish/.scratch/mindmake-production-canary-20260924/documentation-originals-03-05-backend.md`, raw SHA-256 `2b1d35e6a0e7f8a31c0288496f77bd6df2a03cb8c9bd027e2f8c4f34ca06830b`: verbatim in [ARCHIVE.md](ARCHIVE.md#archive-2026-09-24-design-lead-backend-originals).


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
