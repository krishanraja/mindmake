import { describe, expect, it } from "vitest";
import {
  assessRead,
  buildRead,
  tidyProfile,
  type CompanySeen,
  type PersonalReadRequest,
  type Profile,
  sanitiseDescriptor,
  companyName,
} from "../../supabase/functions/mindmake-personal-read/core";

/**
 * The gate that decides whether a read is worth a stranger's minute.
 *
 * The first version of this email went out as a job title on the front of three
 * template sentences and the verdict was "embarrassingly generic, I'd rather
 * send nothing". So: nothing is what gets sent when a read cannot clear this.
 *
 * These are the situations a real visitor and a real provider actually produce.
 * Each one is here because it is a way the read can be bad, not because it is a
 * way the code can throw.
 */

const REQUEST: PersonalReadRequest = {
  action: "send",
  first_name: "Ada",
  last_name: "Lovelace",
  division: "leadership",
  q1: "deciding",
  q2: "decisions",
  email: "ada@northwind.com",
};

const PERSON: Profile = { role: "Chief Operating Officer", company: "Northwind" };

/** A synthesis that actually looked at the company. */
const GOOD: CompanySeen = {
  name: "Northwind",
  descriptor: "Northwind runs freight forwarding for mid-market importers across the North Sea, quoting per container and settling in sterling, with customs brokerage handled in house rather than subcontracted.",
  industry: "Logistics",
};

const read = (company?: CompanySeen, profile: Profile = PERSON, request = REQUEST) =>
  buildRead(request, profile, company);

const assess = (company?: CompanySeen, profile: Profile = PERSON, request = REQUEST, domain = "northwind.com") =>
  assessRead(read(company, profile, request), profile, domain);

describe("a read worth sending", () => {
  it("passes when the synthesis actually saw the company", () => {
    const result = assess(GOOD);
    expect(result.failures).toEqual([]);
    expect(result.passed).toBe(true);
    expect(result.score).toBe(result.outOf);
  });
});

describe("the ways a read is not worth sending", () => {
  /* 1. The failure that prompted all of this. */
  it("refuses a read with no company paragraph at all", () => {
    const result = assess(undefined);
    expect(result.passed).toBe(false);
    expect(result.failures[0]).toMatch(/only have been written about this company/);
  });

  /* 2. The provider answered, but with nothing in it. */
  it("refuses filler dressed as an answer", () => {
    for (const descriptor of [
      "Northwind is a company that provides innovative solutions for its customers.",
      "A leading global platform delivering best in class services to clients worldwide.",
      "Northwind offers a wide range of solutions dedicated to customer success.",
    ]) {
      const result = assess({ name: "Northwind", descriptor });
      expect(result.passed, descriptor).toBe(false);
    }
  });

  /* 3. Too thin to be worth the reader's attention. */
  it("refuses a paragraph too short to say anything", () => {
    expect(assess({ name: "Northwind", descriptor: "Northwind is a logistics firm." }).passed).toBe(false);
  });

  /* 4. Reading from the outside, never pretending otherwise. */
  it("refuses a claim about them that nothing outside could know", () => {
    const bad = read(GOOD);
    bad.lines = [...bad.lines, "You are struggling to keep up with your competitors."];
    expect(assessRead(bad, PERSON).failures.join(" ")).toMatch(/nothing outside could know/);
  });

  it("refuses telling the reader what they must do", () => {
    const bad = read(GOOD);
    bad.lines = [...bad.lines, "You need to move faster on this."];
    expect(assessRead(bad, PERSON).passed).toBe(false);
  });

  /* 5. The mirror: their own data handed back as if it were insight. */
  it("refuses a paragraph that only repeats the opening", () => {
    const bad = read({ name: "Northwind", descriptor: "You are Chief Operating Officer at Northwind." });
    expect(assessRead(bad, PERSON).passed).toBe(false);
  });

  /* 6. A role we did not actually resolve must not be asserted. */
  it("refuses an opening that states a role enrichment never found", () => {
    const bad = read(GOOD, {});
    bad.opening = "You are Chief Operating Officer at Northwind. Here is what your first week would look like.";
    expect(assessRead(bad, {}).failures.join(" ")).toMatch(/enrichment did not actually establish/);
  });

  /* 7. House voice, the parts a machine can see. */
  it("refuses an em dash, American spellings and shouting", () => {
    for (const line of [
      "Northwind — the freight people — move containers.",
      "We will optimize your judgment on every call.",
      "This is going to be brilliant!",
    ]) {
      const bad = read(GOOD);
      bad.lines = [...bad.lines, line];
      expect(assessRead(bad, PERSON).passed, line).toBe(false);
    }
  });

  /* A real product name is allowed to contain an exclamation mark. Marks and
     Spencer sell "YAY! Mushrooms", and a bare test for the character refused an
     otherwise good live read over it. */
  it("allows an exclamation mark inside a brand, and still catches shouting", () => {
    const brand = read({
      name: "Northwind",
      descriptor: "Northwind moves freight for importers across the North Sea and stocks the YAY! Mushrooms range for its grocery clients.",
    });
    expect(assessRead(brand, PERSON, "northwind.com").failures.join(" ")).not.toMatch(/raise its voice/);

    const shouting = read({
      name: "Northwind",
      descriptor: "Northwind moves freight for importers across the North Sea and it is going to be brilliant!",
    });
    expect(assessRead(shouting, PERSON, "northwind.com").failures.join(" ")).toMatch(/raise its voice/);
  });

  /* 8. Placeholder residue is the loudest possible "nobody read this". */
  it("refuses placeholder residue", () => {
    const bad = read({ name: "Northwind", descriptor: `Northwind operates undefined routes across the North Sea for importers of record and handles customs.` });
    expect(assessRead(bad, PERSON).passed).toBe(false);
  });

  /* 9. A visible seam says the same thing as a placeholder. */
  it("refuses the same sentence twice", () => {
    const bad = read(GOOD);
    bad.lines = [...bad.lines, bad.lines[0]];
    expect(assessRead(bad, PERSON).failures.join(" ")).toMatch(/appear twice/);
  });

  /* 10. Too long is its own kind of disrespect. */
  it("refuses a read too long to be read at speed", () => {
    const bad = read(GOOD);
    bad.lines = [...bad.lines, "word ".repeat(400)];
    expect(assessRead(bad, PERSON).passed).toBe(false);
  });

  it("refuses a sentence nobody can follow in one pass", () => {
    const bad = read({
      name: "Northwind",
      descriptor: "Northwind " + "moves containers and files customs entries and arranges haulage and books vessels and handles duty deferment ".repeat(4) + "daily.",
    });
    expect(assessRead(bad, PERSON).failures.join(" ")).toMatch(/plain enough/);
  });

  /* 11. One ask, and only one. */
  it("refuses a read that asks more than one thing", () => {
    const bad = read(GOOD);
    bad.lines = [...bad.lines, "Shall we look at this? Or would next month suit?"];
    expect(assessRead(bad, PERSON).passed).toBe(false);
  });
});

describe("the edge cases the live data actually produced", () => {
  /* Every one of these came out of a real run, not out of imagination. */

  /* Brandfetch resolved a one-person consultancy's "company" to the founder's
     personal name, so the email would have opened "You are Director at Kristof
     Hermans", which is the sort of mistake a reader never forgets. */
  it("refuses a company name that is not the company behind the address", () => {
    const result = assess({ ...GOOD, name: "Kristof Hermans" }, PERSON, REQUEST, "themindmaker.ai");
    expect(result.failures.join(" ")).toMatch(/actually the one behind their email/);
  });

  it("accepts the ordinary case where the name and the domain agree", () => {
    for (const [name, domain] of [["Monzo", "monzo.com"], ["Ocado", "ocado.com"], ["Stripe", "stripe.com"], ["Marks & Spencer", "marksandspencer.com"]]) {
      const result = assess({ ...GOOD, name }, PERSON, REQUEST, domain);
      expect(result.failures.join(" "), `${name} / ${domain}`).not.toMatch(/behind their email/);
    }
  });

  /* The synthesis told a real business it was "still establishing its market
     position". A verdict on somebody's company is not ours to hand them. */
  it("strips a verdict on how established they are, keeping the rest", () => {
    for (const line of [
      "You're a newly founded consulting practice, still establishing your market position.",
      "Northwind has a small footprint and limited traction in the region so far.",
      "This is a nascent business in a crowded market.",
    ]) {
      const kept = "It moves freight for importers across the North Sea and clears customs in house. It quotes per container, settles in sterling, and handles duty deferment for its regular importers.";
      const built = read({ name: "Northwind", descriptor: `${line} ${kept}` });
      expect(built.seen, line).toBe(kept);
      expect(assessRead(built, PERSON, "northwind.com").passed, line).toBe(true);
    }
  });

  /* Naming somebody's hosting back to them reads as surveillance, and to a
     leader it is not even interesting. */
  it("strips the sentence that recites their infrastructure", () => {
    for (const tool of ["Supabase", "Vercel", "WordPress", "Cloudflare", "HubSpot"]) {
      const kept = "Northwind moves freight for mid-market importers across the North Sea and clears customs in house. It quotes per container, settles in sterling, and handles duty deferment for its regular importers.";
      const built = read({ name: "Northwind", descriptor: `${kept} It runs its booking portal on ${tool}.` });
      expect(built.seen, tool).toBe(kept);
    }
  });

  /* The rule that nearly refused every Product visitor. */
  it("does not mistake the preposition for the verdict", () => {
    expect(assess(GOOD, PERSON, { ...REQUEST, division: "product" }).failures).toEqual([]);
    const fine = assess({ name: "Northwind", descriptor: "Northwind moves freight across the North Sea for mid-market importers, and the reasoning behind each routing call sits with its own customs team rather than with a broker." });
    expect(fine.passed).toBe(true);
    const verdict = assess({ name: "Northwind", descriptor: "Northwind moves freight across the North Sea but is falling behind its rivals on automation and customs clearance speed." });
    expect(verdict.passed).toBe(false);
  });

  /* A vendor list can never be complete. The first live battery produced
     "You're a technology-enabled retailer built on Salesforce, Contentful and
     Ruby on Rails", none of which were on a list written around hosting. */
  it("catches a stack recital whatever the vendors happen to be", () => {
    const kept = "Northwind moves freight for mid-market importers across the North Sea and clears customs in house. It quotes per container, settles in sterling, and handles duty deferment for its regular importers.";
    for (const tail of [
      "built on Salesforce, Contentful and Ruby on Rails",
      "powered by Snowflake and Databricks",
      "running on Kubernetes",
      "hosted with Fastly",
    ]) {
      const built = read({ name: "Northwind", descriptor: `${kept} It is a logistics operator ${tail}.` });
      expect(built.seen, tail).toBe(kept);
    }
  });

  /* The shape must not swallow ordinary prose that happens to use the words. */
  it("does not mistake an ordinary sentence for a stack recital", () => {
    for (const line of [
      "Its reputation is built on decades of freight expertise.",
      "The service runs on a schedule agreed with each importer.",
      "Their case is based on volume rather than margin.",
    ]) {
      const result = assess({
        name: "Northwind",
        descriptor: `Northwind moves freight for mid-market importers across the North Sea and clears customs in house. ${line}`,
      });
      expect(result.failures.join(" "), line).not.toMatch(/infrastructure/);
    }
  });

  /* Every one of these came out of the fourteen-domain live battery. */

  it("keeps a headcount band a range instead of turning it into two numbers", () => {
    /* "now employing 501, 1000 people" is what the dash rule did to a band. */
    expect(tidyProfile({ role: "head of 501\u20131000 person team" }).role).toContain("501-1000");
    const built = read({
      name: "Northwind",
      descriptor: "Northwind employs 501\u20131000 people moving freight for importers across the North Sea and clears its own customs.",
    });
    expect(built.seen).toContain("501-1000");
    expect(built.seen).not.toContain("501, 1000");
  });

  it("spells a company name the way the company spells it", () => {
    /* "University Of Oxford" is a spelling nobody has ever used. */
    expect(tidyProfile({ company: "university of oxford" }).company).toBe("University of Oxford");
    expect(tidyProfile({ company: "marks and spencer" }).company).toBe("Marks and Spencer");
  });

  it("refuses flattery, which is the verdict rule with the sign flipped", () => {
    for (const line of [
      "You remain the world's leading research and teaching institution.",
      "Northwind is the industry-leading freight operator in the region.",
      "Their service is second to none.",
    ]) {
      const built = read({ name: "Northwind", descriptor: `Northwind moves freight for importers across the North Sea and clears customs in house. ${line}` });
      expect(built.seen, line).not.toContain(line);
    }
  });

  it("does not mistake ordinary description for flattery", () => {
    const built = read({
      name: "Northwind",
      descriptor: "Northwind leads its own customs clearance rather than subcontracting, and moves freight for mid-market importers across the North Sea, quoting per container and settling in sterling.",
    });
    expect(assessRead(built, PERSON, "northwind.com").passed).toBe(true);
  });

  it("strips doom about the reader's own organisation", () => {
    /* The live battery told the NHS it faces chronic funding pressures and
       waiting list backlogs. True, widely reported, and not ours to hand
       somebody unasked. */
    const kept = "Northwind moves freight for importers across the North Sea and clears customs in house. It quotes per container, settles in sterling, and handles duty deferment for its regular importers.";
    for (const line of [
      "You face chronic funding pressures and waiting list backlogs that constrain your capacity.",
      "Northwind struggles with staffing shortfalls across its depots.",
      "Your decline in the region has been steady since 2024.",
    ]) {
      const built = read({ name: "Northwind", descriptor: `${kept} ${line}` });
      expect(built.seen, line).toBe(kept);
    }
  });

  /* Three passes of the doom rule each caught the previous phrasing and missed
     the next: "chronic funding pressures", then "waiting list backlogs", then
     "limited resources and mounting demand". The rule matches the qualifier now
     and lets the noun be whatever the model reached for. */
  it("catches scarcity and strain however it is phrased", () => {
    const kept = "Northwind moves freight for mid-market importers across the North Sea and clears customs in house, quoting per container and settling in sterling.";
    for (const line of [
      "You run a sprawling organisation serving 67 million people with limited resources and mounting demand.",
      "It operates with stretched capacity and rising costs across every depot.",
      "The team is overstretched and working with inadequate staffing.",
      "They face dwindling margins and escalating expectations.",
    ]) {
      const built = read({ name: "Northwind", descriptor: `${kept} ${line}` });
      expect(built.seen, line).toBe(kept);
    }
  });

  it("still allows an observation about the market they are in", () => {
    const built = read({
      name: "Northwind",
      descriptor: "Northwind competes in a crowded freight market where automated customs clearance increasingly decides who wins, and it clears its own, quoting per container for mid-market importers.",
    });
    expect(assessRead(built, PERSON, "northwind.com").passed).toBe(true);
  });

  /* From the v15 re-run: the fixes worked and exposed the next layer down. */

  /* The first attempt keyed on case, on the theory that a provider writes a raw
     hostname in lower case and a real name carries a capital. The live pipeline
     then returned "Shopify.com", capital and all, so the rule never fired on
     the one case it was written for. The signal is that the name restates the
     visitor's own address, which is when it carries nothing they do not know. */
  it("does not address a company by the web address it was asked about", () => {
    expect(companyName("Shopify.com", "shopify.com")).toBe("shopify");
    expect(companyName("shopify.com", "shopify.com")).toBe("shopify");
    expect(companyName("marksandspencer.co.uk", "marksandspencer.co.uk")).toBe("marksandspencer");
  });

  it("leaves a name alone when it is not simply the domain again", () => {
    expect(companyName("Marks and Spencer", "marksandspencer.com")).toBe("Marks and Spencer");
    expect(companyName("Ocado", "ocado.com")).toBe("Ocado");
    /* Without a domain to compare against there is no signal, so nothing moves. */
    expect(companyName("Shopify.com")).toBe("Shopify.com");
    expect(companyName("Booking.com")).toBe("Booking.com");
  });

  it("renders the repaired name in the read itself", () => {
    const built = buildRead(REQUEST, PERSON, { name: "Shopify.com", descriptor: GOOD.descriptor }, "shopify.com");
    expect(built.company).toBe("Shopify");
  });

  it("spells a multi-word company the way its own name is spelled", () => {
    const built = read({ name: "marks and spencer", descriptor: GOOD.descriptor });
    expect(built.company).toBe("Marks and Spencer");
    const oxford = read({ name: "university of oxford", descriptor: GOOD.descriptor });
    expect(oxford.company).toBe("University of Oxford");
  });

  it("catches flattery whatever the subject of the sentence is", () => {
    const kept = "Northwind moves freight for importers across the North Sea and clears customs in house rather than subcontracting it out. It quotes per container, settles in sterling, and handles duty deferment for its regular importers.";
    for (const line of [
      "Shopify remains the dominant software infrastructure for independent retail.",
      "You remain the backbone of British healthcare.",
      "These launches demonstrate your commitment to advancing research.",
    ]) {
      const built = read({ name: "Northwind", descriptor: `${kept} ${line}` });
      expect(built.seen, line).toBe(kept);
    }
  });

  /* Stripping the NHS read of its doom and its flattery left two sentences,
     which cleared a word count measured across the whole body while the part
     carrying the specifics had almost nothing left in it. */
  it("refuses a read that repair has left too thin to be worth sending", () => {
    const thin = read({
      name: "NHS",
      descriptor: "You've launched HPV self-testing kits. You remain the backbone of British healthcare.",
    });
    expect(assessRead(thin, PERSON, "nhs.uk").passed).toBe(false);
  });

  it("still passes a read that mentions none of those things", () => {
    expect(assess(GOOD).passed).toBe(true);
  });
});

describe("the read is repaired before it is judged", () => {
  /* The synthesis writes a good paragraph and then reliably appends one more
     sentence reciting the stack or grading how established the company is.
     Refusing four good sentences to avoid a fifth is the wrong trade. */
  const GOOD_SENTENCES = "Northwind moves freight for mid-market importers across the North Sea. It clears customs in house rather than subcontracting, quoting per container and settling in sterling.";

  it("drops a trailing stack recital and keeps the rest", () => {
    const out = sanitiseDescriptor(`${GOOD_SENTENCES} It is a logistics operator built on Salesforce and Contentful.`);
    expect(out).toBe(GOOD_SENTENCES);
  });

  it("drops a verdict on how established they are and keeps the rest", () => {
    const out = sanitiseDescriptor(`${GOOD_SENTENCES} It is a newly founded operator still establishing its position.`);
    expect(out).toBe(GOOD_SENTENCES);
  });

  it("drops a claim about the reader nothing outside could know", () => {
    const out = sanitiseDescriptor(`${GOOD_SENTENCES} You need to move faster than your rivals.`);
    expect(out).toBe(GOOD_SENTENCES);
  });

  it("drops filler sentences", () => {
    const out = sanitiseDescriptor(`${GOOD_SENTENCES} It provides solutions for a wide range of clients.`);
    expect(out).toBe(GOOD_SENTENCES);
  });

  /* The real Ocado paragraph from the first live battery. */
  it("repairs the paragraph the live battery actually returned", () => {
    const live = "You operate Ocado Retail, the Marks & Spencer joint venture that runs an online supermarket. Your 2026 expansion into South Korea with Lotte signals ambition beyond your UK base. You're a technology-enabled retailer built on Salesforce, Contentful and Ruby on Rails.";
    const out = sanitiseDescriptor(live);
    expect(out).not.toMatch(/Salesforce|Contentful|Ruby on Rails/);
    expect(out).toMatch(/Lotte/);
    expect(assessRead({ ...read(GOOD), seen: out, company: "Ocado" }, PERSON, "ocado.com").passed).toBe(true);
  });

  /* A paragraph that is nothing but bad sentences ends up empty, and empty is
     refused on specificity, which is the honest outcome for it. */
  it("leaves nothing behind when every sentence has to go, and that is refused", () => {
    const out = sanitiseDescriptor("It is a company that provides solutions. You need to act now. Built on WordPress.");
    expect(out).toBe("");
    expect(assess({ name: "Northwind", descriptor: "It is a company that provides solutions. Built on WordPress." }).passed).toBe(false);
  });

  it("leaves a clean paragraph completely alone", () => {
    expect(sanitiseDescriptor(GOOD.descriptor!)).toBe(GOOD.descriptor);
  });
});

describe("provider text is brought into the house voice before it is used", () => {
  /* This is the defect the gate caught on its first live run: PDL returned a
     job title carrying an em dash, and nothing had ever scrubbed PDL's fields,
     so it walked into the first sentence of the email. */
  it("takes the em dash out of a job title", () => {
    const tidied = tidyProfile({ role: "chief operating officer \u2014 logistics", company: "Northwind" });
    expect(tidied.role).not.toContain("\u2014");
    expect(assess(GOOD, tidied).passed).toBe(true);
  });

  it("takes the em dash out of a synthesised paragraph too", () => {
    const result = assess({
      name: "Northwind",
      descriptor: "Northwind runs freight forwarding \u2014 mostly for mid-market importers \u2014 across the North Sea, handles its own customs brokerage, and settles per container in sterling.",
    });
    expect(read({ name: "Northwind", descriptor: "a \u2014 b" }).seen ?? "").not.toContain("\u2014");
    expect(result.passed).toBe(true);
  });

  it("corrects the one American spelling the house style names", () => {
    expect(tidyProfile({ role: "head of judgment" }).role).toMatch(/judgement/i);
  });
});

describe("the states real enrichment actually returns", () => {
  /* The person resolved and the company did not, and the reverse. */
  it("refuses when only the person resolved, because the read has nothing to say", () => {
    expect(assess(undefined, { role: "Chief Operating Officer", company: "Northwind" }).passed).toBe(false);
  });

  it("passes when only the company resolved, because that is the part worth reading", () => {
    const result = assess(GOOD, {});
    expect(result.passed).toBe(true);
    expect(read(GOOD, {}).opening).not.toMatch(/You are Chief/);
  });

  it("refuses an industry-only fallback, which is too thin to earn a send", () => {
    expect(assess({ name: "Northwind", industry: "Logistics" }).passed).toBe(false);
  });

  it("survives a company whose name is deliberately lowercase", () => {
    const tidied = tidyProfile({ role: "chief operating officer", company: "northwind" });
    expect(tidied.company).toBe("Northwind");
    expect(assess(GOOD, tidied).passed).toBe(true);
  });

  it("leaves a company that capitalises itself oddly alone", () => {
    expect(tidyProfile({ company: "eBay" }).company).toBe("eBay");
    expect(tidyProfile({ company: "iRobot" }).company).toBe("iRobot");
  });

  it("holds for every division, so none of them is the one that ships broken", () => {
    for (const division of ["leadership", "sales", "marketing", "product", "engineering", "operations", "finance", "people"] as const) {
      const result = assess(GOOD, PERSON, { ...REQUEST, division });
      expect(result.failures, division).toEqual([]);
    }
  });

  it("holds for every pair of answers", () => {
    for (const q1 of ["writing", "chasing", "admin", "deciding"] as const) {
      for (const q2 of ["network", "pipeline", "content", "decisions"] as const) {
        const result = assess(GOOD, PERSON, { ...REQUEST, q1, q2 });
        expect(result.failures, `${q1}/${q2}`).toEqual([]);
      }
    }
  });

  it("handles a descriptor that arrives with the company name repeated", () => {
    const result = assess({
      name: "Northwind",
      descriptor: "Northwind is Northwind, and Northwind serves the Northwind customers Northwind has.",
    });
    expect(result.passed).toBe(false);
  });

  it("handles a descriptor in another language without pretending to read it", () => {
    /* It cannot judge the sense of it, and does not claim to. What it can
       insist on is that something specific is there. */
    const result = assess({
      name: "Nordwind",
      descriptor: "Nordwind betreibt Speditionsdienste fuer mittelstaendische Importeure in der Nordsee, wickelt die Zollabfertigung im eigenen Haus ab und rechnet pro Container in Pfund Sterling ab.",
    }, PERSON, REQUEST, "nordwind.de");
    expect(result.passed).toBe(true);
  });

  it("refuses a descriptor that is only the company name", () => {
    expect(assess({ name: "Northwind", descriptor: "Northwind." }).passed).toBe(false);
  });

  it("refuses when the provider said it could not find anything", () => {
    for (const descriptor of ["No information available.", "Unknown company.", "We could not determine what this company does."]) {
      expect(assess({ name: "Northwind", descriptor }).passed, descriptor).toBe(false);
    }
  });
});
