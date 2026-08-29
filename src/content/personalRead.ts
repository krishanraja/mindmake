/**
 * The personal read's template lines.
 *
 * The preview is composed from these synchronously, with no network call, so
 * the promise that it appears at once is structural rather than best effort.
 * The edge function holds the same lines for the emailed version, and a test
 * asserts the two stay identical.
 */

export const WEEK_ONE_QUESTIONS = {
  q1: {
    label: "What eats most of your week?",
    options: [
      { id: "writing", label: "Writing and comms" },
      { id: "chasing", label: "Chasing people" },
      { id: "admin", label: "Admin between decisions" },
      { id: "deciding", label: "Deciding without enough time" },
    ],
  },
  q2: {
    label: "If it remembered everything you value, point it first at",
    options: [
      { id: "network", label: "My network" },
      { id: "pipeline", label: "My pipeline" },
      { id: "content", label: "My content" },
      { id: "decisions", label: "My decisions" },
    ],
  },
} as const;

export type Q1 = typeof WEEK_ONE_QUESTIONS.q1.options[number]["id"];
export type Q2 = typeof WEEK_ONE_QUESTIONS.q2.options[number]["id"];

export const Q1_LINES: Record<Q1, string> = {
  writing: "Every draft you touch next week starts already written, in your voice, to your standards. You edit, you do not start.",
  chasing: "Follow-ups, chasers and reminders go out without you, and nothing slips through again.",
  admin: "The admin between decisions disappears into the system, and your week gets its hours back.",
  deciding: "Every decision arrives pre-read: the trade-offs, the counterpoints, and what would change your mind.",
};

export const Q2_LINES: Record<Q2, string> = {
  network: "It maps the people you already know and surfaces the three who matter for what you are working on right now, with the reason attached.",
  pipeline: "It watches your pipeline and tells you each morning which deal moved, why, and what to do about it.",
  content: "It learns exactly what you sound like and drafts the next piece before you ask for it.",
  decisions: "It holds every call you have made, so the next one starts from your own track record instead of a blank page.",
};

export const CLOSING_LINE =
  "The full version lands in your inbox. One email, ever, plus one follow-up.";
