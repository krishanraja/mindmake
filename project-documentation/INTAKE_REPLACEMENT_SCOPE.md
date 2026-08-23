# Future `/intake` Replacement

Status: proposed scope only. Not approved for implementation in the current homepage rebuild.

Current-state note (2026-08-23): the "current /intake" referenced below is public/intake/index.html, still deployed via a Vercel rewrite (see vercel.json) and NOT redirected to /sprint like other retired routes — it is unlinked from the live site's nav/footer but reachable by direct URL. See REBUILD_STATE.md's "Next action" section for the open decision on whether to redirect it.

## Purpose

Help a leader who starts with an unclear problem uncover the decision underneath it. Give Krish a much better place to begin without making the leader complete a long consulting form.

This is not the public homepage tool. It appears after a leader has shown serious interest in working with Mindmaker.

## State of use

- The leader is busy and may be on a phone.
- They know something is wrong or blocked but may not know the cause.
- They may give a vague starting statement such as “startups are killing us”.
- They should not need to prepare data or know consulting language.
- The experience should feel useful before it feels like onboarding.

## Core rule

Predict first. Ask only what remains unknown.

The system must never ask for a fact it has already found with enough confidence. It must show important inferred facts in a form the leader can correct.

## Entry

Use the smallest reliable identity signal already available from the interest or booking journey:

- Work email.
- Company domain.
- LinkedIn profile supplied by the leader, if a permitted enrichment source is available.

LinkedIn scraping is not assumed. The build must use an allowed provider or leave that source out.

Before research begins, explain in one short sentence what will be checked and why. Keep any publication or watch consent separate.

## Experience

### 1. Show what Mindmaker already understands

Present a short company and role reflection. Let the leader correct it with one tap or a short edit.

### 2. Capture the pressure

Ask for the issue in their own words. Voice should be a first-class input. Offer a few plain-language starting points, but do not force the person into them.

### 3. Build the uncertainty map

Choose each next question from what would reduce uncertainty most. Useful question forms include:

- Confirm or correct.
- Pick the closer statement.
- Rank two or three trade-offs.
- Give a short example.
- Speak freely.

Ask related questions from a different angle only when an answer conflicts with an earlier answer or with observed facts. The method from the 36-question experiment is retained as conditional logic, not as a fixed questionnaire.

### 4. Stop at the right time

Do not show a false fixed question count. Show honest progress such as “We have the pressure. Now checking what is behind it.”

Stop when:

- The main decision is clear enough to name.
- The biggest unsupported assumptions are visible.
- Product, Pricing, Positioning, and People have each been considered where relevant.
- Another question would add little value.

Set a hard time and question ceiling so the interview cannot become exhausting. The exact ceiling needs usability testing.

### 5. Return a useful private brief

The leader sees:

- What we heard.
- The decision underneath the first problem.
- What may be driving it.
- Where words and actions do not yet match.
- What is known, inferred, and still unknown.
- The first point worth testing with Krish.

Krish receives the same brief with source detail, confidence, and the answer path that created it.

## Minimal graph

The user does not need to see a technical graph. Internally, keep a small evidence model rather than inventing a large schema.

### Node types

- Observed fact.
- Leader statement.
- Goal.
- Current behaviour.
- Constraint.
- Assumption.
- Outside signal.
- Possible decision.

### Link types

- Supports.
- Conflicts with.
- Blocks.
- Depends on.
- Still unknown.

### Tags

- Product.
- Pricing.
- Positioning.
- People.

These four areas are lenses, not automatic scores. A contribution should be expressed as an evidence-backed cause, constraint, or unknown.

## Evidence rules

Every important item records:

- Source: leader, public source, or system inference.
- Confidence.
- Time checked.
- Whether the leader confirmed it.

The result must say “we do not know yet” when evidence is thin. Predictive must not mean pretending.

## Mobile behaviour

- One ask per screen.
- Large thumb targets.
- Taps and voice before typing.
- Short, calm transitions that make progress feel physical.
- Light haptic feedback for selection, correction, and completion where the device supports it.
- Reduced-motion support.
- Save after every answer.
- Resume by a secure link on the same or another device.
- Never lose a long spoken or typed answer.

## Watch lifecycle

The personalised Decision Watch is separate from Mindmaker Live.

Proposed sequence:

- Week 1: a useful update tied to the decision and current evidence.
- Weeks 2 to 4: new signal, changed assumption, or useful test.
- About four weeks later: one final useful update and a clear choice to continue, book, or stop.

Do not send an update merely to keep the schedule. If nothing material changed, either send a genuinely useful “what has not changed” note or skip it.

Required states:

- Watch consented.
- Mindmaker Live subscribed.
- Call booked.
- Sprint started.
- Watch completed.
- Unsubscribed.
- Email failed or suppressed.

Rules:

- Dedupe by a normalised email address.
- A watch unsubscribe stops the watch immediately.
- A Mindmaker Live unsubscribe does not silently change watch consent, and the reverse is also true.
- Booking a call changes the call to action in later messages.
- Starting a Sprint ends the public nurture sequence and moves the person to client communication.
- Never send sales reminders after unsubscribe.

## Substack boundary

Use Substack's supported signup form when someone separately chooses Mindmaker Live. Do not silently import a person because they requested a personalised watch.

Mindmaker should remain the source of truth for the watch because each person's content, schedule, booking state, and unsubscribe state differ. If a supported Substack integration is added later, it must preserve separate consent and deduplication.

## Data and service needs for a later build

- A consent and lifecycle record.
- An answer and uncertainty record that can resume safely.
- A permitted company and person enrichment source.
- A scheduler for due watch checks.
- An email service with immediate suppression and delivery events.
- Booking and client-state events.
- A private result view for Krish.
- Retention and deletion rules.

Supabase changes, an email provider, automated research, and any LinkedIn enrichment are not authorised by this scope alone.

## Edge cases

- Personal email with no company signal.
- Consultant with several businesses.
- Company information is wrong or out of date.
- Two people from the same company give different accounts.
- The leader is already a Mindmaker Live subscriber.
- The leader books during the watch.
- The leader is already a Sprint client.
- Unsubscribe arrives while a message is queued.
- Email bounces or is suppressed.
- Enrichment providers fail.
- The interview closes midway and resumes later.
- An answer conflicts with public evidence.

## Acceptance checks

- Most known facts are confirmed with a tap, not typed again.
- A useful brief is reached without a fixed long questionnaire.
- The system can explain why it asked each adaptive question.
- The brief separates fact, leader statement, inference, and unknown.
- The four commercial lenses help find causes without producing fake precision.
- Mobile input feels fast, keeps every answer, and supports reduced motion.
- Watch and publication consent are separate and easy to withdraw.
- A booking, Sprint start, unsubscribe, or delivery failure changes the sequence before another message is sent.

## Not in the current build

- The full adaptive interview engine.
- Automated LinkedIn research.
- The uncertainty graph store.
- Scheduled personalised emails.
- Automatic Substack subscriber management.
- Changes to Supabase or CTRL.
