import type { SituationId } from "./useCases";

export interface StoryExample {
  id: string;
  industry: string;
  wish: SituationId;
  title: string;
  bring: string;
  help: string;
  leave: string;
}

export const examples: readonly StoryExample[] = [
  {
    id: "creator-series",
    industry: "Creator-led media",
    wish: "terms",
    title: "A series that can pay its way",
    bring: "a series your audience returns to and a sponsor who wants a regular place in it.",
    help: "weigh a member edition against a sponsor slot and decide who controls the main edit.",
    leave: "a release plan, a pitch and a clear limit on what a sponsor can buy.",
  },
  {
    id: "agency-placement",
    industry: "Agencies",
    wish: "yours",
    title: "A placement that fits the idea",
    bring: "a campaign film and a cheap placement that crops out the reveal.",
    help: "compare a shorter cut with a different placement against the audience and the rights you hold.",
    leave: "a distribution brief that pairs each cut with a channel and a price for extra use.",
  },
  {
    id: "commission",
    industry: "Creative",
    wish: "back",
    title: "A campaign worth testing",
    bring: "campaign treatments that feel alike and a client who wants reassurance.",
    help: "find the risk in each route and the question an animatic could answer.",
    leave: "a rough film to commission and a reason to take it into the client meeting.",
  },
  {
    id: "still-life",
    industry: "Creative",
    wish: "try",
    title: "Room at the edge of the frame",
    bring: "a still-life brief, a taste for empty space and a request for synthetic variations.",
    help: "explore an off-centre composition and separate the image commission from future use.",
    leave: "a composition to try and terms for a separate conversation about variations.",
  },
  {
    id: "programme",
    industry: "Arts",
    wish: "back",
    title: "The last slot in the programme",
    bring: "a choice between a familiar draw and a local artist your audience has yet to encounter.",
    help: "compare a full commission with a community preview against your budget and curatorial aim.",
    leave: "a preview brief and a reason for the panel to offer a full slot.",
  },
  {
    id: "rehearsal",
    industry: "Arts",
    wish: "try",
    title: "A gesture the camera might miss",
    bring: "a rehearsal that holds its tension in the room and loses it on film.",
    help: "vary the camera distance, timing and sound so you can choose when the audience sees the gesture.",
    leave: "a wide shot to try in the studio and a reason to hold it.",
  },
  {
    id: "sequence",
    industry: "Entertainment",
    wish: "brief",
    title: "A cut that keeps the character in view",
    bring: "a production choice between moving the plot along and showing why a character takes a risk.",
    help: "compare the cuts against what your audience needs to understand and what the crew can shoot.",
    leave: "a brief that tells the editor which beat to keep and where there is room to cut.",
  },
  {
    id: "performance",
    industry: "Entertainment",
    wish: "yours",
    title: "Where a performance can travel",
    bring: "a game scene, a trailer request and an invitation to allow synthetic pickups.",
    help: "explore alternate readings and set out which uses need your say.",
    leave: "a reading to try with the director and separate terms for future performances.",
  },
  {
    id: "series",
    industry: "Media",
    wish: "terms",
    title: "A sponsor for the series",
    bring: "an offer to fund your series from a sponsor who wants a say over the ending.",
    help: "compare a companion piece with a place in the main series against your editorial standard.",
    leave: "a package the seller can offer while the final edit stays with you.",
  },
  {
    id: "interview",
    industry: "Media",
    wish: "yours",
    title: "An interview with a pause worth keeping",
    bring: "an interview where the silence before the answer carries its meaning.",
    help: "compare an audio opening, a film cut and a newsletter that gives the answer context.",
    leave: "a release order and a note on which edits keep the pause intact.",
  },
  {
    id: "highlights",
    industry: "Sport",
    wish: "calls",
    title: "Who gets to watch the highlights",
    bring: "a rights bid that could lift income and move the highlights beyond local fans.",
    help: "weigh a shorter term against free highlights and identify the assumptions you need to check.",
    leave: "a question for each bidder and a record of the audience commitment behind your next call.",
  },
  {
    id: "training",
    industry: "Sport",
    wish: "brief",
    title: "A training film that shows the mistake",
    bring: "a drill for young athletes and a sponsor who wants a polished reel and a synthetic voice.",
    help: "compare a drill film with a replay and set out which uses need your consent.",
    leave: "a brief that keeps the first attempt in the film and reserves the voice decision for you.",
  },
];
