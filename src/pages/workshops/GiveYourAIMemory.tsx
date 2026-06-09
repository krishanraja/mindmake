import { WorkshopPage, type WorkshopConfig } from "./WorkshopPage";
import { WORKSHOP_MAVEN_URLS } from "@/lib/stripe-prices";

const config: WorkshopConfig = {
  slug: "give-your-ai-memory",
  title: "Give Your AI Memory",
  seoDescription:
    "One-day Mindmaker workshop. Build the memory web that makes your AI worth using. Stop re-explaining your business every Monday. Private, portable, deployed by end of day. From $500 on Maven.",
  intro: [
    "Every Monday you re-brief your AI on your business. The deals, the people, the priorities, the why-we-don't-do-that. By Friday it's blank again. The memory is the missing layer.",
    "In this workshop you build the memory web that makes your AI worth using. Private. Portable. Yours. The same architecture I use to make a 14-agent fleet remember everything that matters at Mindmaker.",
    "By end of day your AI knows your business the way a chief of staff would after six months on the job, and that memory survives every model change, every tool switch, every Monday.",
  ],
  mavenUrl: WORKSHOP_MAVEN_URLS.memory,
  mavenPublished: false,
  outcomes: [
    {
      heading: "Decide what your AI should remember.",
      bullets: [
        "Separate signal from noise in your business knowledge",
        "Identify the 50 facts your assistant should never forget",
        "Define the boundaries of what stays out of memory",
      ],
    },
    {
      heading: "Choose the memory architecture.",
      bullets: [
        "Compare vector stores, graphs, and document indexes",
        "Pick the right tradeoff between simplicity and recall",
        "Set up the layer so it survives a tool change later",
      ],
    },
    {
      heading: "Seed the memory with what matters.",
      bullets: [
        "Load your accounts, deals, people, and priorities",
        "Capture how you make decisions, in your voice",
        "Add the institutional knowledge that lives only in your head",
      ],
    },
    {
      heading: "Wire it into the surfaces you use.",
      bullets: [
        "Connect ChatGPT, Claude, or your custom agent to the memory",
        "Make it readable from your inbox, calendar, and chat",
        "Confirm context arrives without you pasting it every time",
      ],
    },
    {
      heading: "Build the maintenance loop.",
      bullets: [
        "Set up a weekly review so the memory stays current",
        "Decide what gets archived, what gets deleted, what gets pinned",
        "Log changes so you can roll back if something goes wrong",
      ],
    },
    {
      heading: "Make it private and portable.",
      bullets: [
        "Keep the data on infrastructure you control",
        "Export and re-import without losing fidelity",
        "Avoid lock-in to any single model or vendor",
      ],
    },
  ],
  personas: [
    {
      name: "The leader tired of re-briefing",
      description:
        "You're spending 15 minutes per session reminding your AI who you are, what you sell, and what matters. You want that compounded, not repeated.",
    },
    {
      name: "The founder building durable infrastructure",
      description:
        "You want the AI capability you build today to survive the next model release, the next tool change, the next pricing shift. Memory is the moat.",
    },
    {
      name: "The operator running multiple agents",
      description:
        "You have a chief of staff, a research assistant, a writing agent. They each know one slice. You want them all reading from the same memory web so they stop contradicting each other.",
    },
  ],
};

export default function GiveYourAIMemory() {
  return <WorkshopPage config={config} />;
}
