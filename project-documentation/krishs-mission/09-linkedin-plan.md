# The LinkedIn relaunch plan, condensed

Status: Proposed. Built on 18 November 2026 by a 14-agent planning run (six readers, three planners, three critics; 65 issues raised, 39 fixed, the rest put to Krish). It was written before the positioning work in `02-positioning-and-pitch.md`; wherever it used the older sentence, the approved one replaces it. The full plan and its research were kept privately (they quote drafts and outside sources).

## The calls

1. **LinkedIn is the main channel, in his own first-person voice** (Krish, 17 Nov 2026: "Linkedin will be the main channel, from my voice, earnest and honest and sincerely wanting to help people with whats next"): earnest, plain, one idea a post, something real from his own work in every post, one ask in a P.S.
2. **The real story is his OS** (Krish, 17 Nov 2026: "the work my OS and brain can do for me is the real story").
3. **Posts alone will not reach the meetings target.** In November, LinkedIn's job is the first meetings traced to a post, by writing to everyone who comments (his ruling of 13 Nov: "Message everyone who engages with the posts"). He writes every reply.
4. **Tracing comes before the first post:** a path is recorded once and never rewritten.
5. **The first post is the founding story** (`10-founder-story.md`): Tue 24 Nov if "Who decided?" is live, else Wed 25 Nov with no link.
6. **Lean first slice** (the critics' advice, recommended): post link tracking, the path fixes, posting through Buffer on his click, and a manual list of commenters, before anything bigger.

## The voice for LinkedIn

From ai-harness `skills/krish-voice/references/voice-profile.md`: lead with the point, reframe the question, prove it from his own time in the trade, put himself down first, short dry irony after a long sentence, a spaced hyphen and brackets (never an em dash), write as he talks, thank people by name, invite and never push. One thesis a post, stated word for word when stated. No engagement bait, no emoji bullets, no Unicode bold, no hashtags. First line complete in about 110 characters. Every post passes `check_voice` on channel `linkedin`.

## What it found

- His personal LinkedIn is already connected in Buffer, with four unsent drafts left from the publication in its queue (decision D10).
- Control Center has his time zone as New York; Buffer says London; he is on London time until the end of the year (D11).
- Mindmake has no approved voice rules because the taste ledger's weekly cap ranks Mindmake's claims low (inspirationhouse `src/publish/propose.ts`); a fair share across ventures is proposed (D12).
- The engine would treat any known contact as "in his network" and could route a stranger to his own box without the required disclosure; the plan fixes that first.
- Meetings from a direct message or the audit would be recorded as "unknown": no `inbound` path exists in code yet.

## Changes by repository (owners merge as their own rules say)

| Repository | Change | Needs his yes |
|---|---|---|
| growth-mindmake | G1 a `linkedin` tag for post links; G2 path fixes (public-signal, `post-engager`); G3 evidence notes and rows E13 to E15; G4 own-post commenters (split GET-GOING 1.4 into 1.4a commenters first); G5 a "His LinkedIn" section in STRATEGY and his 17 Nov words as a ruling; G6 to G12 later (visibility judge, weekly review, Buffer go-lives, claim check, LinkedIn notes, `inbound` path, now-note counts) | G5 and G9 yes; the rest merge on checks |
| mindmake | M1 review "Who decided?" (PR 309) and confirm nothing leaves the browser; M2 correct "Why Krish started it" with his founder facts; M3 `/parts` live after he tests a part; M4 the long founder essay | Yes for each |
| Control Center | C1 his time zone; C2 analytics settings; C3 brief takers with first-touch source; C4 pending counts beside approved taste; C5 a private store for post drafts and a react-to intake; C6 a LinkedIn note channel; C7 retire its visibility judge; C8 two questions | C1, C2, C5, C6 |
| ai-harness | H1 LinkedIn evidence rule 13 points to the thesis record; H2 voice profile LinkedIn branch; H3 his personal LinkedIn owned by growth-mindmake; H4 "judgement" spelling; H5 react-to and overrule containers; H6 pointers instead of restated canon; H7 a 2025-onwards fingerprint; H8 and H9 later | Merge |
| inspirationhouse | I1 pending versus approved counts per venture; I2 the two-days rule before the limit; I3 Mindmake's claims put to him once, then a fair share; I4 voice folder fixes; I5 docs | Merge; I3 and I4 yes |

## His time

Of 20 minutes a day: 12 for sends and taps, 5 for comment replies and commenter notes, 3 for his list. Thirty minutes on post day, agreed in advance.
