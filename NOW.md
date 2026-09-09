---
repo: krishanraja/mindmake
product: Mindmake
as_of: 2026-09-09
head: d3b1bd8
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

## Where it is right now (as of 2026-09-09)

- **Live** at `mindmake.co`. The rebuild was promoted on 28 August 2026; the latest promotion is the edge rewrite of 5 September 2026 (pull request #154), verified live with one synthetic end-to-end lead. Production identifiers, function versions and the rollback target: `project-documentation/06_CURRENT_STATE.md`, "Where the rebuild stands" and "Lead and data backend".
- **A new public surface, `/answers`**, shipped 8 September 2026 (#160 to #164): one page per buyer question, machine-first, separate from the blog. The sitemap and prerender now cover 26 indexed routes, up from 21; `project-documentation/06_CURRENT_STATE.md`'s route count is dated 5 September and predates this.
- **Four code commits past the recorded promotion**, all 7 September: Krish's revision of the thirty-three testimonials, the excerpts cut again to exact substrings, the story deck reading its quotes from the testimonials file, and one story swapped to fit its quote (#156, #157). A merge to `main` promotes production, and no readback of these is recorded in the state doc.
- **Baselines** (5 September): 450 tests across 29 files, 0 lint errors and 2 warnings, 0 type errors, every browser gate green at 1440 and 390, `qa:alive` included. What each gate measures: `CLAUDE.md`, "Required checks".
- **Owed** (open items 1 to 9 in the state doc): the branded mailboxes (`mindmake.co` has no MX record, so contact links read one constant pointing at the mailbox that receives), credential rotation, retiring `get-model-data`, repointing the old CTRL host, and the `themindmaker.ai` Resend domain's failed verification.
- **Waiting on evidence**: the first day-14 follow-up can send on 11 September 2026; the queue was empty when the notice went live.
- **Docs steward** adopted 7 September 2026: this file, `project-documentation/history/LOG.md`, and `.github/workflows/docs-steward.yml`. The state doc went from 2,363 lines to 125 by moving its dated journal into the LOG.

## What changed recently

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
- 2026-08-11 to 12 **Pre-rebuild** (`cda3c70`, #136, #137): one 21-day Sprint and a fit-call action, ten orphaned routes redirected, dead Builder Economy links retired. Every offer named in those commits is retired by canon and stays retired.

The pattern is worth naming: 111 commits in fourteen days, 87 by Claude, and every deployment is followed by a docs-only "Record the ..." commit (eleven of them since 28 August) that writes what was actually proven live into the state doc. That habit is what makes the state doc trustworthy, and the steward keeps it rather than replacing it.

## What is next and what is waiting on Krish

- Next for the site: a production readback of the 7 September testimonials commits, recorded in the state doc the way every other promotion is.
- Waiting on Krish: the method wording on the brain door and "How it learns you." on `/ai-brain`, proposed 3 September for sign-off. The method is described, never named.
- Waiting on Krish (canon, "Open commercial work"): the evidence trail for a "leaders helped" figure; one Brain-shaped and one GTM-shaped story with consent; current-source research before any new AI GTM market claim; the pricing revisit trigger.
- Waiting on CTRL: `affects` and `stance` in the headline cache, and a `pov` line in a voice this site can publish. Nothing on this side is waiting.
- Next for the site: the first day-14 follow-up on 11 September 2026, and the owed items in the state doc.

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
