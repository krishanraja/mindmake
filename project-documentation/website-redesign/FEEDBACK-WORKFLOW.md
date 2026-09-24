# Website feedback workflow

`feedback-ledger.json` is the authoritative register for feedback reconciliation. `STATE.md` remains the recovery and approved-state source of truth. The ledger cannot approve a section or change production by itself.

## Contract

1. Capture feedback verbatim before interpreting it.
2. Bind it to the exact surface, section, device and element.
3. Classify it as a correction, constraint or preference.
4. State the required observable outcome and acceptance test before editing.
5. Preserve the user's selected options and notes separately. A submitted combination is not approval.
6. Show every non-empty decision note and the overall note verbatim in the final readback.
7. Record the smallest implemented resolution and deterministic evidence.
8. Keep an item `open` or `implemented-awaiting-review` until the required evidence exists and, for taste or intent, Krish has reviewed the result.
9. Do not advance a section as approved while any item for it has a blocking status.
10. Give judges the ledger alongside the rendered artifact. A judge verdict that does not address every applicable item is incomplete.

## Statuses

- `open`: understood but not implemented.
- `implemented-awaiting-review`: built and mechanically checked; Krish's judgement is still required.
- `verified`: acceptance test passed and no further founder judgement is required.
- `accepted`: Krish has explicitly accepted the resolved result.
- `superseded`: replaced by a later, linked item without rewriting the historical record.

## Submission and approval

The review artifact's final action submits selections and commentary for reconciliation. It does not lock a production component, approve defaults, promote a prototype, deploy a route or waive unresolved feedback. Approval is a later state transition recorded in `STATE.md` only after the feedback gate is clear.

## Working response after a submission

The response must include:

- the submitted choices;
- every decision note in full;
- the overall note in full;
- the interpretation and required action for each note;
- any unresolved item and the exact next gate.

No note may be reduced to a count or silently absorbed into implementation.
