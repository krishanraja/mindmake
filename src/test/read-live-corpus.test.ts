import { describe, expect, it } from "vitest";
import {
  assessRead,
  buildRead,
  sanitiseDescriptor,
  type CompanySeen,
  type PersonalReadRequest,
  type Profile,
} from "../../supabase/functions/mindmake-personal-read/core";

/**
 * The paragraphs the live pipeline actually returned.
 *
 * Every string here was produced by the real orchestrator against a real
 * domain on 29 August 2026, copied verbatim rather than written. Hand-written
 * fixtures test the gate against what I imagined a model would say; these test
 * it against what one did, which is the only version that matters.
 *
 * When a model or a provider changes and the reads get worse, this is where it
 * shows up.
 */

const REQUEST: PersonalReadRequest = {
  action: "send",
  first_name: "Ada",
  last_name: "Lovelace",
  division: "leadership",
  q1: "deciding",
  q2: "decisions",
  email: "ada@example.com",
};

const PERSON: Profile = { role: "Chief Operating Officer" };

interface Case {
  label: string;
  domain: string;
  name: string;
  live: string;
  /** What has to be gone from the read once it is repaired. */
  stripped: string[];
  /** What has to survive, because it is the reason the read is worth sending. */
  kept: string[];
  sendable: boolean;
}

const CASES: Case[] = [
  {
    label: "ocado.com",
    domain: "ocado.com",
    name: "Ocado",
    live: "You operate Ocado Retail, the Marks & Spencer joint venture that runs an online supermarket on ocado.com, competing in a sector where automated fulfilment centres increasingly define competitive advantage. Your 2026 expansion into South Korea with Lotte and new automated CFCs signal ambition beyond your UK base. You're responding to GLP-1 adoption by launching portion-controlled products, a niche play that acknowledges shifting consumer behaviour. You're a technology-enabled retailer built on Salesforce, Contentful and Ruby on Rails.",
    stripped: ["Salesforce", "Contentful", "Ruby on Rails"],
    kept: ["Lotte", "GLP-1"],
    sendable: true,
  },
  {
    label: "marksandspencer.com",
    domain: "marksandspencer.com",
    name: "Marks and Spencer",
    live: "Marks and Spencer operates a 140-year-old British retail empire selling clothing, beauty and food across physical stores and online, with over 10,000 employees. You've recently expanded your food business with new health-focused ranges including Brain Food and YAY! Mushrooms, leveraging a modern tech stack built on Next.js, Contentful and Vercel to personalise the shopping experience. You remain a trusted high-street institution competing against faster digital retailers and discounters.",
    stripped: ["Next.js", "Contentful", "Vercel", "leveraging"],
    kept: ["140-year-old", "10,000 employees"],
    sendable: true,
  },
  {
    label: "nhs.uk",
    domain: "nhs.uk",
    name: "NHS",
    live: "You operate the UK's publicly funded healthcare system, serving 56 million people through hospitals, GPs and community services funded by taxation rather than ability to pay. Your recent HPV self-testing rollout for cervical screening reaches women who missed traditional invitations, expanding cancer prevention beyond clinic walls. You remain the world's largest single-payer health service, though you face chronic funding pressures and waiting list backlogs that constrain your capacity to deliver timely care.",
    stripped: ["backlogs", "world's largest", "chronic funding"],
    kept: ["56 million", "HPV self-testing"],
    sendable: true,
  },
  {
    label: "intercom.com",
    domain: "intercom.com",
    name: "Intercom",
    live: "Intercom operates a customer service platform combining Fin, its AI agent, with a modern helpdesk to automate and streamline support workflows. You compete in a crowded market where AI agents are becoming table stakes, and your differentiation rests on integrating automation with human support rather than replacing it entirely.",
    stripped: [],
    kept: ["Fin", "crowded market"],
    sendable: true,
  },
  {
    label: "stripe.com",
    domain: "stripe.com",
    name: "Stripe",
    live: "You operate the payments infrastructure that millions of companies depend on globally, from enterprises to startups accepting transactions through your platform. Your April 2026 launch of Stripe Treasury, enabling businesses to hold funds in 15 currencies and move money round the clock, positions you as the backbone of digital commerce.",
    stripped: [],
    kept: ["Stripe Treasury", "15 currencies"],
    sendable: true,
  },
  {
    label: "zalando.de",
    domain: "zalando.de",
    name: "Zalando",
    live: "Zalando operates Europe's largest online fashion platform, serving millions across the continent with apparel, footwear, and beauty products. You've expanded into pre-owned luxury through Vestiaire Collective partnerships and rolled out an AI-powered shopping assistant across your marketplace. Your 2026 acquisition of ABOUT YOU consolidated your position in the region.",
    stripped: [],
    kept: ["Vestiaire Collective", "ABOUT YOU"],
    sendable: true,
  },
  {
    label: "ox.ac.uk",
    domain: "ox.ac.uk",
    name: "University of Oxford",
    live: "You operate across medical sciences, mathematical and physical sciences, humanities and beyond, drawing on nearly a millennium of academic tradition since 1096. Your recent launches include the Stephen A. Schwarzman Centre for the Arts and Humanities and spinout ventures like AI-based ultrasound technology for pregnancy complications. You remain the world's leading research and teaching institution.",
    stripped: ["world's leading"],
    kept: ["1096", "Schwarzman"],
    sendable: true,
  },
];

describe("the reads the live pipeline actually produced", () => {
  for (const c of CASES) {
    it(`repairs and judges ${c.label} the way it should`, () => {
      const company: CompanySeen = { name: c.name, descriptor: c.live };
      const built = buildRead(REQUEST, PERSON, company);
      const seen = built.seen ?? "";

      for (const gone of c.stripped) {
        expect(seen, `${c.label} should not still say "${gone}"`).not.toContain(gone);
      }
      for (const stays of c.kept) {
        expect(seen, `${c.label} should still say "${stays}"`).toContain(stays);
      }

      const verdict = assessRead(built, PERSON, c.domain);
      expect(verdict.failures, `${c.label}`).toEqual(c.sendable ? [] : expect.anything());
      expect(verdict.passed, c.label).toBe(c.sendable);
    });
  }

  /* The personal read, as the live pipeline now writes it. Its subject is the
     seat rather than the employer, which is the whole point of the change: a
     leader asking what AI does for their own capability is asking a different
     question from what a business needs. */
  it("writes about the person's work, not about their employer", () => {
    const live = "Your judgement runs on portfolio construction and founder relationships, where you weigh conviction against the fund's capacity and the reality that backing women-led teams in fintech and data analytics means moving against established patterns in venture. You spend your time on due diligence depth and post-investment support. Your output sits at the number of companies you can meaningfully back each year and the returns those bets generate.";
    const built = buildRead(REQUEST, { role: "Vice President", company: "HearstLab" }, { name: "HearstLab", descriptor: live }, "hearstlab.com");
    const seen = built.seen ?? "";

    /* The tells that it is about the seat: possessive second person about their
       own work, and a statement of where their own output is capped. */
    expect(seen).toMatch(/your judgement|your time|your output/i);
    expect(assessRead(built, { role: "Vice President" }, "hearstlab.com").passed).toBe(true);
  });

  it("leaves nothing sendable when the whole paragraph was the problem", () => {
    expect(sanitiseDescriptor("It is a company that provides innovative solutions. Built on WordPress.")).toBe("");
  });
});
