import { WorkshopPage, type WorkshopConfig } from "./WorkshopPage";
import { WORKSHOP_MAVEN_URLS } from "@/lib/stripe-prices";

const config: WorkshopConfig = {
  slug: "build-an-autonomous-business-function",
  title: "Build an Autonomous Business Function",
  seoDescription:
    "One-day Mindmaker workshop. Build the workflow that runs without you. Real n8n or Make workflow, deployed on your real business, running by end of session. $599 on Maven.",
  intro: [
    "Most leaders talk about automation in the abstract. Then they go back to copying numbers between tabs on a Tuesday afternoon. The gap between the conversation and the keyboard is where the value sits.",
    "In this workshop you pick one function in your business, lead-routing, billing reconciliation, content distribution, customer onboarding, and you build the workflow that runs it without you. Real n8n or Make pipeline, real triggers, real outputs.",
    "By end of day the function is running on your real business. The workflow doesn't sleep, doesn't forget, doesn't take Friday off.",
  ],
  mavenUrl: WORKSHOP_MAVEN_URLS.autonomous,
  mavenPublished: false,
  outcomes: [
    {
      heading: "Pick the right function to automate.",
      bullets: [
        "Choose a function that's painful, repetitive, and bounded",
        "Avoid the trap of automating something that should not exist",
        "Frame the success metric in time saved or errors removed",
      ],
    },
    {
      heading: "Map the workflow before you build it.",
      bullets: [
        "Diagram every step a human takes today, end to end",
        "Mark which steps are deterministic vs which need judgement",
        "Decide where the human stays in the loop and where they don't",
      ],
    },
    {
      heading: "Build the trigger and the data flow.",
      bullets: [
        "Wire the trigger: a form, a webhook, a schedule, an inbound email",
        "Pull the data the workflow needs from the right systems",
        "Validate the inputs so a bad payload doesn't poison the run",
      ],
    },
    {
      heading: "Insert the AI step where it belongs.",
      bullets: [
        "Use the model only where structured logic falls short",
        "Constrain outputs to a schema your downstream systems can use",
        "Add a fallback for when the model is uncertain",
      ],
    },
    {
      heading: "Close the loop on the output.",
      bullets: [
        "Write back to the right system: CRM, billing, Slack, inbox",
        "Notify the right human at the right threshold",
        "Log every run so you can debug and audit later",
      ],
    },
    {
      heading: "Deploy and observe.",
      bullets: [
        "Turn the workflow on against real production data",
        "Watch the first 10 runs together, fix the rough edges",
        "Set up the dashboard or weekly digest that proves it's working",
      ],
    },
  ],
  personas: [
    {
      name: "The COO killing manual handoffs",
      description:
        "You can name three handoffs in your business that lose deals or hours every week. You want one of them gone by Friday.",
    },
    {
      name: "The RevOps or marketing leader",
      description:
        "You're running lead routing, lifecycle nurtures, or reporting jobs that should run themselves. You want to retire the spreadsheet macros and step into something real.",
    },
    {
      name: "The founder building the next ten hires worth of leverage",
      description:
        "You don't want a bigger team. You want a tighter team supported by infrastructure that does the boring work. This workshop is the first piece.",
    },
  ],
};

export default function BuildAnAutonomousBusinessFunction() {
  return <WorkshopPage config={config} />;
}
