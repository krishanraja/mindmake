import { cleanOutput, scrubVoice } from "./llm.ts";

Deno.test("scrubVoice keeps ordinary word spacing intact", () => {
  const input = "You're the BBC, the world's largest public broadcaster.";
  const output = scrubVoice(input);

  if (output !== input) {
    throw new Error(`Expected ordinary prose to remain intact, received: ${output}`);
  }
});

Deno.test("scrubVoice replaces em and en dashes without comma-separating words", () => {
  const output = cleanOutput("Leaders decide\u2014AI carries the routine \u2013 people keep control.");

  if (output !== "Leaders decide, AI carries the routine, people keep control.") {
    throw new Error(`Unexpected cleaned prose: ${output}`);
  }
});
