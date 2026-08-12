# Proposed Mindmaker harness update

Status: proposal only. Do not apply from this repository.

Replace the skill's commercial core with the following rules:

```diff
- Mindmaker sells The Teardown and The Handover with public prices.
- The Diagnosis Room is the main public conversion surface.
- CTRL is a separate product link and a Teardown deliverable.
+ Mindmaker is Krish Raja's commercial decision practice.
+ Mindmaker sells one flexible, scoped 21-day Sprint.
+ The Sprint price is not public. Scope and fee are agreed after a fit call.
+ Every main sales action says "Book a fit call" and reaches the same 15-minute Calendly event.
+ The Diagnosis Room and homepage AI demonstration are paused.
+ CTRL by Mindmaker is the living Sprint deliverable, not a second public offer.
+ Retired offer routes redirect straight to /sprint.
+ Attendee brands, client stories and career references are separate proof classes.
+ Steph content needs the existing consent record and fails closed.
+ Mindmaker Live uses https://live.themindmaker.ai. Paid and Built are article formats.
+ Public copy uses British English, common words and no em dashes.
```

The skill should point to `project-documentation/COMMERCIAL_REFERENCE.md` for the current contract and should never read `src/lib/offers.ts` as current public truth.
