# Mindmake private brief delivery

Last updated: 26 August 2026.

Status: the V2 browser, server-core, Edge Function and database migration source are implemented locally. The public feature flag remains off. The migration has not been run, the function has not been deployed and no real email has been sent. This document does not authorise production promotion.

## Product boundary

The private brief must feel useful before Mindmake asks for an email. It must also create a clear lead for Krish without pretending that a generated starting point is a finished diagnosis.

The release rules are:

- no public diary or Calendly link;
- no automated sales or nurture sequence;
- no automatic publication subscription or list import;
- no visitor-written narrative, email HTML or hidden qualification data accepted by the server;
- no claim that an email was delivered unless that delivery was accepted by the email provider;
- no loss of the visitor's local download when a network or email step fails.

## Visitor journey

1. The visitor gives a company website.
2. Mindmake shows a public-company read and labels a safe fallback honestly when live research does not answer.
3. The visitor chooses one pressure.
4. The visitor chooses where better use of their time would matter.
5. Mindmake shows a private starting recommendation.
6. Only then does the visitor choose whether to keep it by email.
7. The visitor enters a work email and may separately tick an unticked publication-interest box.
8. Mindmake sends a six-digit code. The code works for ten minutes and locks after five failed tries.
9. Only after the code is confirmed does Mindmake try the two final deliveries independently.
10. The visitor can download the private HTML brief whether or not either email succeeds.

Changing the email or asking for a new code creates a fresh request. A network retry of the same request keeps the same request ID so it cannot create duplicate delivery work.

## Browser contract

The browser sends identifiers and choices only. It never sends the recommendation, company narrative, research evidence, email HTML or operator copy.

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
}
```

The `website` field is a bot trap and must remain empty.

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

The visitor email contains:

- the chosen pressure;
- the public company read and its source label;
- the evidence used;
- what AI may carry;
- what should stay with the leader;
- one useful 30-day proof;
- where the returned time could create more value;
- the same brief as a self-contained HTML attachment.

It contains no diary link and no automatic sales promise. It does not claim that Krish received his separate email. After the server returns `operatorDelivery: "queued"`, the UI may say only that Krish's copy was queued.

## What Krish receives

Krish's server-made fit summary contains:

- the verified email and company;
- the route the visitor used;
- the chosen pressure and use of returned time;
- the public company read and evidence;
- the server-owned AI, human and 30-day proof recommendation;
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

The code works for ten minutes and five failed tries lock it. Expiry stops the code but does not delete the request record. No automatic deletion job is implemented in this release. The public privacy notice must not promise automatic deletion. A written deletion schedule and any required cleanup job need separate approval before the hand-off flag is enabled.

## Release gate

`VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED` stays `false` until all of these pass in a preview environment:

1. run the migration against preview PostgreSQL;
2. run database lint and security advisers;
3. prove anonymous and signed-in clients cannot read the private schema or call the private RPC;
4. prove the Edge Function service role can use only the intended public wrapper;
5. set and validate exact allowed origins, the fixed public URL, Resend sender, operator email, verification secret and rate-limit salt;
6. deploy the Edge Function to preview;
7. test request, resend, change-email, valid, invalid, expired and locked code paths;
8. test both independent email successes and failures with synthetic inboxes;
9. prove retries do not create duplicate leads or messages;
10. inspect mobile and desktop email output and the downloaded HTML;
11. prove publication interest remains interest only;
12. agree the retention schedule and implement any promised deletion process;
13. receive explicit approval before enabling the flag or promoting production.
