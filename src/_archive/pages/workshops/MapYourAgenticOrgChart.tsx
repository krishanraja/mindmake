import { WorkshopPage, type WorkshopConfig } from "./WorkshopPage";
import { WORKSHOP_MAVEN_URLS } from "@/lib/stripe-prices";

const config: WorkshopConfig = {
  slug: "map-your-agentic-org-chart",
  title: "Map Your Agentic Org Chart",
  seoDescription:
    "One-day Mindmaker workshop. Design the agent fleet your business actually needs. Walk out with a complete agent-native org chart, named roles, and a 90-day build sequence. Hosted on Maven.",
  intro: [
    "Most leaders are buying AI agents the way they used to buy SaaS. One per problem. The result is a graveyard of unused subscriptions and no clarity on which agents actually belong in the business.",
    "In this workshop you stop buying and start designing. We treat your business the way you'd staff a team: which roles need a human, which need an agent, which need a hybrid, and which roles don't need to exist at all.",
    "By end of day you have a complete agent-native org chart, with named roles, owners, and a 90-day sequence for which agents to build first.",
  ],
  mavenUrl: WORKSHOP_MAVEN_URLS.orgChart,
  mavenPublished: false,
  outcomes: [
    {
      heading: "Map the work, not the tools.",
      bullets: [
        "List the 30 to 50 recurring jobs your business actually depends on",
        "Group them by function, by frequency, by judgement required",
        "Surface the work that's already drifting because no one owns it",
      ],
    },
    {
      heading: "Classify every role.",
      bullets: [
        "Human-only: judgement, relationships, accountability",
        "Hybrid: human in the loop, agent in the workflow",
        "Agent-first: deterministic, repetitive, schedulable",
      ],
    },
    {
      heading: "Name the agents.",
      bullets: [
        "Give each agent a real role title, not a tool name",
        "Define what it owns, what it escalates, what it's banned from",
        "Decide who manages it when it breaks",
      ],
    },
    {
      heading: "Sequence the build.",
      bullets: [
        "Pick the three agents to build in the first 30 days",
        "Pick the next three for the following 60",
        "Identify the prerequisites that have to land first",
      ],
    },
    {
      heading: "Cost the fleet.",
      bullets: [
        "Estimate model spend, tooling spend, and human supervision",
        "Compare against the headcount or hours saved",
        "Build the one-page case for the next budget conversation",
      ],
    },
    {
      heading: "Plan for the next twelve months.",
      bullets: [
        "Identify which roles disappear, which expand, which change shape",
        "Design the hiring plan around the agent fleet, not against it",
        "Set the quarterly review cadence so the org chart stays alive",
      ],
    },
  ],
  personas: [
    {
      name: "The COO redesigning the operating model",
      description:
        "You own how the business runs. The exec team is asking what the org looks like with AI in it, and you don't want to guess. You want a defensible map.",
    },
    {
      name: "The founder pre-Series-A",
      description:
        "You're scaling without scaling headcount. You want to know which next hires can be deferred or replaced by agents you build now.",
    },
    {
      name: "The functional leader staffing for 2027",
      description:
        "Head of Marketing, Sales, Ops, or Finance. You're being asked to do more with less and the AI conversation is loud but unstructured. You want to bring an answer to your next planning cycle.",
    },
  ],
};

export default function MapYourAgenticOrgChart() {
  return <WorkshopPage config={config} />;
}
