/**
 * The argument under the whole practice, in as few words as it will go.
 *
 * Two things are published here that were written and never printed. The first
 * is the north star's own hinge, "You can hand over the work. You cannot hand
 * over the understanding", and its corollary: time saved is the setup, and the
 * real question is what the hours come back into. The second is why a leader
 * stops after one wrong answer, which turns out to be the oldest reaction there
 * is and not a fact about AI at all.
 *
 * The page carrying this is built to be looked at and flicked through rather
 * than read: a deck you turn, a line that lights as you pass it, a track, a
 * chart, a figure. So every entry below is one line, and the line has to land
 * on its own, because there is no paragraph under it to catch it.
 *
 * ## Every date is checkable, because the argument leans on them
 *
 * A page that says "people have always resisted new tools" and names nothing is
 * a page asserting a feeling. Each beat is a real, dated objection, and two
 * carry the finding that settled the question afterwards. Where the popular
 * version of this history is wrong it is corrected rather than repeated: it is
 * Thamus, a king in the myth Socrates retells, who objects to writing, not
 * Socrates in his own voice; and the calculator finding is Hembree and Dessart,
 * seventy-nine studies gathered in 1986, in which children who used them did no
 * worse at arithmetic and at most ages rather better.
 *
 * Two things that belong to this history are deliberately absent. The air
 * accidents usually cited alongside it are named fatal crashes, and putting
 * those on a page that sells something is doom framing and in poor taste. And
 * the word "Luddite" is left out because it has become an insult, and the
 * weavers it names had a livelihood at stake rather than a superstition.
 */

import type { InstrumentKind } from "@/components/mindmake/Instrument";

export interface ReflexBeat {
  /** The axis value, set large. Inside the card, so it is a date and not an eyebrow. */
  when: string;
  what: string;
  /** The objection, in one line. What was said, then what was true. */
  line: string;
  instrument: InstrumentKind;
}

export const REFLEX: ReflexBeat[] = [
  {
    when: "370 BC",
    what: "Writing",
    line: "A king refused it. People who could write things down would stop practising their memory.",
    instrument: "drawer",
  },
  {
    when: "1675",
    what: "The engine loom",
    line: "Weavers broke them in the street. Each one did the work of several hands, and worked.",
    instrument: "rail",
  },
  {
    when: "1970s",
    what: "The calculator",
    line: "Schools banned it. Seventy-nine studies later, the children who used it did no worse.",
    instrument: "gauge",
  },
  {
    when: "2000s",
    what: "Satnav",
    line: "Drivers followed it into rivers. The fear that stuck was that nobody could read a map.",
    instrument: "flap",
  },
];

/**
 * The finding that ties them together, as one line that lights up as it is read.
 *
 * Calestous Juma, Innovation and Its Enemies, Oxford University Press, 2016:
 * roughly six hundred years of resistance, in which the stated objection is
 * usually safety or quality and the unstated one is how the gains and the losses
 * are going to be shared out.
 */
export const TURN = {
  line: "The objection is rarely about accuracy. It is about who gains, who loses, and what happens to their standing. The same reflex fires when AI gets one answer wrong.",
  source: "Calestous Juma, Innovation and Its Enemies, 2016",
};

/**
 * The two halves of one hour, on the track that already carries a finite half
 * and an open one. Stated in the third person on purpose: the house style bans
 * commands to the reader, and the retired version of this argument put the same
 * idea as a threat, which the canon bans outright.
 */
export const HOURS = {
  lede: "One makes a leader faster at the work. The other makes them better at the job.",
  first: {
    instrument: "recorder" as const,
    title: "The work it takes",
    line: "Finite. It finishes.",
    body: "Drafting, research, checking. Real hours, back every week.",
  },
  second: {
    instrument: "levels" as const,
    title: "The hours that come back",
    line: "Open. It keeps going.",
    body: "Harder questions, asked earlier, against what the business already knows.",
  },
  payoff: "The second one is what the system is for.",
};
