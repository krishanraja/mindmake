import { WorkshopPage, type WorkshopConfig } from "./WorkshopPage";
import { WORKSHOP_MAVEN_URLS } from "@/lib/stripe-prices";

const config: WorkshopConfig = {
  slug: "vibe-coding-for-leaders",
  title: "Vibe Coding for Leaders",
  seoDescription:
    "One-day Mindmaker workshop. Ship the internal tool you've waited six months for IT to build. A working tool at a live URL, deployed by end of day, no coding required. Hosted on Maven.",
  intro: [
    "There's a tool you've been wanting for months. A dashboard, an internal portal, a workflow your team would actually use. IT can't get to it. Vendors quote $80,000. So it sits.",
    "In this workshop you build it. With me. In a day. Using the same vibe-coding stack I use to ship internal tools at Mindmaker. No engineering team, no procurement cycle, no permission required.",
    "By end of day you have a working tool with a live URL, deployed on the open internet or behind your auth, that your team can start using on Monday.",
  ],
  mavenUrl: WORKSHOP_MAVEN_URLS.vibeCoding,
  mavenPublished: false,
  outcomes: [
    {
      heading: "Pick the right tool to ship.",
      bullets: [
        "Find the one tool that would actually save your team hours",
        "Scope it tight enough to ship in five hours, not five months",
        "Decide what's in v1 and what waits for v2",
      ],
    },
    {
      heading: "Brief the AI builder like a real engineer.",
      bullets: [
        "Write a product spec the model can actually act on",
        "Choose the right reference, the right starting template",
        "Hand off context the way a good PM would",
      ],
    },
    {
      heading: "Build the front end.",
      bullets: [
        "Generate the UI from the spec, then iterate on real screens",
        "Make it look professional, not like a hackathon",
        "Wire up the inputs, outputs, and basic state",
      ],
    },
    {
      heading: "Wire it to data.",
      bullets: [
        "Connect to a database, a sheet, or an API your team uses",
        "Read and write data without breaking anything",
        "Add the basics: search, filter, save, export",
      ],
    },
    {
      heading: "Deploy it for real.",
      bullets: [
        "Push it to a live URL on Vercel, Netlify, or your stack",
        "Add basic auth so it's not on the open internet",
        "Hand it to one teammate live and watch them use it",
      ],
    },
    {
      heading: "Make it maintainable.",
      bullets: [
        "Document what was built and why",
        "Set up the AI workflow that lets you keep iterating",
        "Decide when this tool graduates to a real engineering ticket",
      ],
    },
  ],
  personas: [
    {
      name: "The leader tired of waiting for IT",
      description:
        "You've been told the tool you need is in a backlog. The backlog is two years old. You're done waiting and ready to ship something usable yourself.",
    },
    {
      name: "The founder who can't justify a hire yet",
      description:
        "You need internal tooling but you're not ready to add an engineer. You want to build the first version yourself and bring an engineer in once it matters.",
    },
    {
      name: "The functional leader running a small team",
      description:
        "Head of Ops, RevOps, Finance, or People. You live in spreadsheets that have outgrown spreadsheets. You want a real internal tool, built by you, for your team.",
    },
  ],
};

export default function VibeCodingForLeaders() {
  return <WorkshopPage config={config} />;
}
