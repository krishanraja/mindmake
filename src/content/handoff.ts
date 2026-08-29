/**
 * What we say when the machine has nothing.
 *
 * Every path through this site can fail, and until now each failure ended in a
 * grey line of text and a visitor with nowhere to go. One of them was a real
 * person who gave us four true details, waited, and was told we would not be
 * sending anything: a lead we asked to leave.
 *
 * So every dead end becomes an offer instead. The register is fixed and it is
 * the same in all nine cases: we apologise plainly, we make the machine the butt
 * of the joke, and we never make the visitor the butt of anything. Nobody
 * arrived here wanting to laugh, so the joke is small and dry and gets out of
 * the way. The whole point of the panel is the button under it.
 *
 * The reason ids are an allowlist shared with the edge function, and
 * `src/test/human-handoff.test.tsx` holds the two lists identical.
 */

export const HANDOFF_REASONS = [
  "read-refused",
  "read-failed",
  "read-rate-limited",
  "send-failed",
  "personal-email",
  "code-not-sent",
  "code-not-accepted",
  "delivery-failed",
  "ask-unmatched",
] as const;

export type HandoffReason = typeof HANDOFF_REASONS[number];

interface HandoffCopy {
  /** The apology. Always first, always a plain sentence. */
  sorry: string;
  /** One dry line about our own machine. Never about the visitor. */
  aside: string;
}

export const HANDOFF_COPY: Record<HandoffReason, HandoffCopy> = {
  "read-refused": {
    sorry: "Sorry. We read everything public about your company and came back with a shrug.",
    aside: "Our AI is confident about most things and completely stumped by yours. We would rather tell you that than send you something generic.",
  },
  "read-failed": {
    sorry: "Sorry, that did not work.",
    aside: "Something broke at our end, and the machine whose entire job is explaining things has gone quiet about what.",
  },
  "read-rate-limited": {
    sorry: "Sorry, you have run into our limit for the hour.",
    aside: "We put a cap on this to keep the robots out, and it cannot tell a robot from somebody genuinely interested. That one is on us.",
  },
  "send-failed": {
    sorry: "Sorry, that email did not leave.",
    aside: "Your read is written and sitting right here. Of all the parts of this to lose today, we have lost the postman.",
  },
  "personal-email": {
    sorry: "No work address? That is our problem, not yours.",
    aside: "We read your company from the part after the @, which works beautifully until somebody sensible uses their own address.",
  },
  "code-not-sent": {
    sorry: "Sorry, the code did not go out.",
    aside: "We can read your whole market in ten seconds and today we cannot send you six digits. We are as surprised as you are.",
  },
  "code-not-accepted": {
    sorry: "Sorry, six digits should not be this hard.",
    aside: "Codes expire, inboxes hide things, and now and then ours simply sulks. You do not have to keep trying.",
  },
  "delivery-failed": {
    sorry: "Sorry. Your brief is finished and the email did not leave.",
    aside: "You can still download the whole thing, so nothing is lost. What we have mislaid is the ability to put it in an inbox.",
  },
  "ask-unmatched": {
    sorry: "We do not have a good answer to that one.",
    aside: "Our answers are written by people rather than made up on the spot, which keeps them honest and means the list has edges. You just found one.",
  },
};

/** The one action. Deliberately unlike every primary action on the site. */
export const HANDOFF_ACTION = "Have a person pick this up";
export const HANDOFF_ACTION_BUSY = "Sending";

/** Shown once the request is with us. It promises a person, not a sequence. */
export const HANDOFF_DONE_TITLE = "That is with a person now.";
export const HANDOFF_DONE_BODY =
  "One of us will read it and reply to you directly. No sequence, no list, and nothing automatic.";

/** When the offer itself fails. The last thing here that can go wrong. */
export const HANDOFF_LAST_RESORT =
  "That did not send either, which is quite the run of luck. Email us and we will pick it up from there:";

/** The quiet way in, where the panel would otherwise interrupt a live form. */
export const HANDOFF_TRIGGER = "Or ask a person to look at this";
