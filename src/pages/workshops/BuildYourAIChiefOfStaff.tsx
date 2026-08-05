import { WorkshopPage, type WorkshopConfig } from "./WorkshopPage";
import { WORKSHOP_MAVEN_URLS } from "@/lib/stripe-prices";

const config: WorkshopConfig = {
  slug: "build-your-ai-chief-of-staff",
  title: "Build Your AI Chief of Staff",
  seoDescription:
    "One-day Mindmaker workshop. Build the AI assistant that actually shows up to work, connected to your real inbox, calendar, and chat channels. Deployed live during the session. Hosted on Maven.",
  intro: [
    "Your inbox doesn't need another tool. It needs a chief of staff. Most senior leaders try to bolt AI onto their workflow and end up with a chatbot that knows nothing about their actual day.",
    "In this workshop you build the assistant that actually shows up to work. Connected to your real inbox, your real calendar, your real chat channels. Briefed on your priorities. Deployed live during the session, not in some sandbox.",
    "By end of day you have a working AI chief of staff running on your stack, with a maintenance routine you can keep alive without an engineer.",
  ],
  mavenUrl: WORKSHOP_MAVEN_URLS.chiefOfStaff,
  mavenPublished: false,
  outcomes: [
    {
      heading: "Define the role like you'd hire a human.",
      bullets: [
        "Write a real job description for your AI chief of staff",
        "Decide what stays in your hands vs what gets delegated",
        "Set explicit guardrails for tone, escalation, and silence",
      ],
    },
    {
      heading: "Wire it into the surfaces you already use.",
      bullets: [
        "Connect Gmail or Outlook so it can read and draft",
        "Connect Google Calendar or Outlook so it knows your week",
        "Connect Slack or Teams so it shows up where work happens",
      ],
    },
    {
      heading: "Brief it on your business.",
      bullets: [
        "Load the deals, accounts, and people that matter",
        "Capture how you actually make decisions, in your voice",
        "Give it the priorities for the next quarter",
      ],
    },
    {
      heading: "Build the daily rituals.",
      bullets: [
        "Morning brief generated before you open your laptop",
        "Pre-meeting prep that pulls history, notes, and signal",
        "End-of-day summary plus tomorrow's top three",
      ],
    },
    {
      heading: "Test it on real work, live.",
      bullets: [
        "Have it draft three responses you'd otherwise write",
        "Have it prep a meeting you actually have this week",
        "Have it triage 50 unread emails into Now / Later / Never",
      ],
    },
    {
      heading: "Make it survive Monday.",
      bullets: [
        "A 15-minute weekly maintenance routine that keeps it sharp",
        "A failure protocol for when it gets something wrong",
        "An upgrade path for when you're ready to add a second agent",
      ],
    },
  ],
  personas: [
    {
      name: "The senior operator drowning in admin",
      description:
        "VP, SVP, or CxO who spends two hours a day on email, calendar, and prep that should not need a human brain. You want that time back without hiring more people.",
    },
    {
      name: "The founder running on willpower",
      description:
        "Solo founder or small-team CEO holding the whole business in your head. You need a second brain that knows the company as well as you do, available at 6am.",
    },
    {
      name: "The leader who's tried five AI tools",
      description:
        "You've tried Copilot, ChatGPT, a notetaker, an agent. Each one solves a slice. You want one assistant connected to your real surfaces, not a folder of half-used apps.",
    },
  ],
};

export default function BuildYourAIChiefOfStaff() {
  return <WorkshopPage config={config} />;
}
