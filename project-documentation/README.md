# Mindmake documentation

Everything in this directory describes the live Mindmake business and site **as
it is today**. There is no history file. If a fact here is out of date, it is a
bug, not a record. History lives in git.

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
