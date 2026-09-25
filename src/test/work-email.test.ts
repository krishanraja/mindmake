import { describe, expect, it } from "vitest";
import {
  DIVISIONS,
  DIVISION_IDS,
  domainFromEmail,
  isDivision,
  nameFromEmail,
  workEmailProblem,
} from "@/lib/workEmail";
import { FREE_EMAIL_DOMAINS as PAGE_FREE } from "@/lib/freeEmailDomains";
import { FREE_EMAIL_DOMAINS as FUNCTION_FREE } from "../../supabase/functions/_shared/enrich/types";
import { DIVISION_IDS as FUNCTION_DIVISIONS } from "../../supabase/functions/mindmake-personal-read/core";

/**
 * Both pages ask for the same four things and the read is built from the email's
 * domain, so the two things worth holding are that the page and the server agree
 * about what an acceptable address is, and that turning somebody away is done in
 * language that puts the limitation on us.
 */

describe("the page and the server agree about addresses", () => {
  /* The browser cannot import from an edge function, so the list is copied.
     A gate the two sides disagree about is worse than no gate: the page waves
     somebody through and the server refuses them after they have typed
     everything, which reads as a broken form rather than as a rule. */
  it("holds one list in two files", () => {
    expect([...PAGE_FREE].sort()).toEqual([...FUNCTION_FREE].sort());
  });

  it("holds one division allowlist in two files", () => {
    expect([...DIVISION_IDS]).toEqual([...FUNCTION_DIVISIONS]);
  });

  it("gives every division a label, so none renders as a blank chip", () => {
    expect(DIVISIONS.every((entry) => entry.label.trim().length > 0)).toBe(true);
    expect(new Set(DIVISION_IDS).size).toBe(DIVISION_IDS.length);
  });

  it("recognises only the divisions it published", () => {
    expect(isDivision("sales")).toBe(true);
    expect(isDivision("legal")).toBe(false);
    expect(isDivision(undefined)).toBe(false);
  });
});

describe("the work email carries the company", () => {
  it("takes the domain off the address", () => {
    expect(domainFromEmail("Ada@Northwind.com")).toBe("northwind.com");
    expect(domainFromEmail("ada@www.northwind.com")).toBe("northwind.com");
    expect(domainFromEmail("not-an-address")).toBe("");
  });

  it("accepts an ordinary company address", () => {
    expect(workEmailProblem("ada@northwind.com")).toBeNull();
    expect(workEmailProblem("ada@sub.northwind.co.uk")).toBeNull();
  });

  it("refuses a personal address, and says the limitation is ours", () => {
    for (const address of ["a@gmail.com", "a@outlook.com", "a@yahoo.co.uk", "a@proton.me"]) {
      const problem = workEmailProblem(address);
      expect(problem).toBeTruthy();
      /* The address is perfectly valid and we are the ones who cannot use it,
         so the message must not read as a correction of the visitor. */
      expect(problem!.toLowerCase()).toContain("we read your company");
      expect(problem!.toLowerCase()).not.toMatch(/invalid|not allowed|error/);
    }
  });

  it("refuses a throwaway address", () => {
    expect(workEmailProblem("a@mailinator.com")).toBeTruthy();
    expect(workEmailProblem("a@yopmail.com")).toBeTruthy();
  });

  it("refuses something that is not an address at all", () => {
    expect(workEmailProblem("")).toBeTruthy();
    expect(workEmailProblem("northwind.com")).toBeTruthy();
    expect(workEmailProblem(`${"x".repeat(250)}@northwind.com`)).toBeTruthy();
  });

  it("says nothing in an em dash, like the rest of the site", () => {
    const messages = ["", "nope", "a@gmail.com", "a@localhost"].map(workEmailProblem);
    for (const message of messages) expect(message ?? "").not.toContain("—");
  });
});

/**
 * first.last@company.com already says who somebody is. The guess fills two
 * fields the visitor can see and change, so the parser's job is to be right
 * when it speaks and quiet when it is not sure.
 */
describe("the work email carries the name", () => {
  const fills: Array<[string, string, string]> = [
    ["anya.divekar@peldonrose.com", "Anya", "Divekar"],
    ["Anya.Divekar@PeldonRose.com", "Anya", "Divekar"],
    ["ada_lovelace@example.com", "Ada", "Lovelace"],
    ["anne-marie.smith@example.co.uk", "Anne-Marie", "Smith"],
    ["john.smith-jones@example.com", "John", "Smith-Jones"],
    ["conor.o'brien@example.ie", "Conor", "O'Brien"],
    ["sean.mcdonald@example.com", "Sean", "McDonald"],
    ["mckenzie.smith@example.com", "Mckenzie", "Smith"],
    ["jan.van.dijk@example.nl", "Jan", "van Dijk"],
    ["jean.st.clair@example.com", "Jean", "St Clair"],
    ["john.f.kennedy@example.com", "John", "Kennedy"],
    ["john.smith+news@example.com", "John", "Smith"],
    ["john.smith2@example.com", "John", "Smith"],
    ["john.smith.2@example.com", "John", "Smith"],
    ["josé.garcía@example.es", "José", "García"],
    ["dev.patel@example.com", "Dev", "Patel"],
    ["j.smith@example.com", "", "Smith"],
    ["anya.d@example.com", "Anya", ""],
  ];
  it.each(fills)("reads %s as %s / %s", (address, first, last) => {
    expect(nameFromEmail(address)).toEqual({ firstName: first, lastName: last });
  });

  const silent = [
    "anyadivekar@peldonrose.com",
    "jsmith@example.com",
    "anne-marie@example.com",
    "info@example.com",
    "hello.team@example.com",
    "sales.uk@example.com",
    "no.reply@example.com",
    "acme.london@acme.co.uk",
    "mary.ann.smith@example.com",
    "john2.smith@example.com",
    "a.b@example.com",
    "john.@example.com",
    "not-an-address",
    "\"john smith\"@example.com",
    "иван.петров@example.ru",
  ];
  it.each(silent)("says nothing for %s", (address) => {
    expect(nameFromEmail(address)).toBeNull();
  });
});
