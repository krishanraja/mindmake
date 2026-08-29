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
12. Does it recite their infrastructure back at them?
13. Does it ask the reader more than one thing?

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

`src/test/read-quality-gate.test.ts` holds thirty-odd scenarios against it,
including every division, every pair of answers, a descriptor in another
language, a company that capitalises itself oddly, and the provider states that
return nothing. One of them earns its place twice: the first version of the
"passes judgement" rule matched the bare word "behind", which appears in the
Product division's own line as a preposition, so it would have silently refused
every visitor who picked Product and nobody would have known why.
