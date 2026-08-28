import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

/**
 * The two-email cap, traced through the code rather than trusted.
 *
 * A visitor who converts receives their results email and one follow-up
 * fourteen days later. Nothing else, ever. That is a promise printed on the
 * public pages, so this walks every place the backend can send mail and every
 * place a follow-up can be created, and fails if the set grows.
 */

const ROOT = resolve(__dirname, "../..");
const FUNCTIONS = resolve(ROOT, "supabase/functions");

const read = (relative: string) => readFileSync(resolve(ROOT, relative), "utf8");

/** Every .ts file under supabase/functions, so a new sender cannot hide. */
function allFunctionSources(): Array<[string, string]> {
  const found: Array<[string, string]> = [];
  const walk = (dir: string, prefix: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = resolve(dir, entry.name);
      const label = `${prefix}/${entry.name}`;
      if (entry.isDirectory()) walk(path, label);
      else if (entry.name.endsWith(".ts")) found.push([label, readFileSync(path, "utf8")]);
    }
  };
  walk(FUNCTIONS, "supabase/functions");
  return found;
}

describe("what can send mail", () => {
  it("sends from exactly the sanctioned places", () => {
    const senders = allFunctionSources()
      .filter(([label, source]) => source.includes("sendResendEmail(") && !label.includes("_shared/http/resend"))
      .map(([label]) => label)
      .sort();

    expect(senders).toEqual([
      // The results email, its verification code and the operator's digest.
      "supabase/functions/submit-mindmake-brief/index.ts",
      // The personal read's results email.
      "supabase/functions/mindmake-personal-read/index.ts",
      // The one day-14 follow-up.
      "supabase/functions/send-follow-ups/index.ts",
    ].sort());
  });

  it("keeps the brief's three messages and adds none", () => {
    const source = read("supabase/functions/submit-mindmake-brief/index.ts");
    const kinds = [...source.matchAll(/deliveryIdempotencyKey\(\s*"([a-z-]+)"/g)].map((match) => match[1]);
    const labels = [...source.matchAll(/label:\s*"mindmake-brief:([a-z]+)"/g)].map((match) => match[1]);
    for (const kind of [...kinds, ...labels]) {
      expect(["verification", "visitor", "operator"]).toContain(kind);
    }
  });
});

describe("what can create a follow-up", () => {
  it("queues from exactly the two journeys, once each", () => {
    const writers = allFunctionSources()
      .filter(([, source]) => source.includes('from("follow_up_queue")') && source.includes("upsert("))
      .map(([label]) => label)
      .sort();

    expect(writers).toEqual([
      "supabase/functions/mindmake-personal-read/index.ts",
      "supabase/functions/submit-mindmake-brief/index.ts",
    ]);
  });

  it("upserts on the address and journey, so a return visit cannot stack a second", () => {
    for (const file of [
      "supabase/functions/submit-mindmake-brief/index.ts",
      "supabase/functions/mindmake-personal-read/index.ts",
    ]) {
      expect(read(file)).toContain('onConflict: "email,source"');
    }
    const migration = read("supabase/migrations/20260828120000_mindmake_follow_up_and_personal_read.sql");
    expect(migration).toMatch(/unique \(email, source\)/);
  });

  it("waits fourteen days", () => {
    for (const file of [
      "supabase/functions/submit-mindmake-brief/index.ts",
      "supabase/functions/mindmake-personal-read/index.ts",
    ]) {
      expect(read(file)).toContain("FOLLOW_UP_DAYS = 14");
    }
  });
});

describe("the follow-up sender", () => {
  const source = read("supabase/functions/send-follow-ups/index.ts");

  it("marks a row sent only when the provider accepted it", () => {
    expect(source).toMatch(/if \(result\.ok\)[\s\S]{0,200}sent_at/);
  });

  it("keys each send on its row, so a rerun cannot duplicate", () => {
    expect(source).toContain("idempotencyKey: `mindmake-follow-up/${row.id}`");
  });

  it("gives up rather than retrying forever", () => {
    expect(source).toContain("MAX_ATTEMPTS");
    expect(source).toMatch(/\.lt\("attempts", MAX_ATTEMPTS\)/);
  });

  it("purges what it has used", () => {
    expect(source).toContain("mindmake_purge_follow_ups");
    const migration = read("supabase/migrations/20260828120000_mindmake_follow_up_and_personal_read.sql");
    expect(migration).toMatch(/sent_at is not null and sent_at < now\(\) - interval '7 days'/);
  });

  it("builds no sequence beyond the one message", () => {
    /* Anything resembling a drip would show up as a second scheduled send or a
       list import. Neither exists. */
    expect(source).not.toMatch(/nurture|drip|sequence_step|campaign/i);
    expect(source).not.toContain("audience_contacts");
  });
});

describe("the schedule", () => {
  it("runs each job once a day", () => {
    const migration = read("supabase/migrations/20260828122000_mindmake_scheduled_jobs.sql");
    expect(migration).toContain("'0 11 * * *'");
    expect(migration).toContain("'20 9 * * *'");
  });

  it("never puts a secret in a migration", () => {
    const dir = resolve(ROOT, "supabase/migrations");
    for (const file of readdirSync(dir)) {
      const sql = readFileSync(resolve(dir, file), "utf8");
      expect(`${file}: ${/(eyJ[A-Za-z0-9._-]{20,}|re_[A-Za-z0-9]{20,}|sbp_[a-f0-9]{20,})/.test(sql)}`)
        .toBe(`${file}: false`);
    }
  });

  it("declares every new function's auth posture", () => {
    const config = read("supabase/config.toml");
    for (const slug of ["mindmake-personal-read", "send-follow-ups", "aa-price-snapshot", "get-ai-news"]) {
      expect(config).toContain(`[functions.${slug}]`);
    }
  });
});

describe("the privacy notice matches the schedule", () => {
  it("states the follow-up and its retention", () => {
    const privacy = read("src/pages/Privacy.tsx");
    expect(privacy).toMatch(/follow-up/i);
    expect(existsSync(resolve(ROOT, "scripts/prerender.mjs"))).toBe(true);
    expect(read("scripts/prerender.mjs")).toMatch(/follow-up/i);
  });
});
