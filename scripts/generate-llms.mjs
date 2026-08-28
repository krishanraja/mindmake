import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const here = dirname(fileURLToPath(import.meta.url));

const llms = `# Mindmake

> Every AI you buy knows the market. Yours should also know you.

Mindmake builds systems that hold a leader's judgement and belong to them afterwards. Two doors, one thirty-day proof.

## The two doors

- [Build your AI brain](/ai-brain): your taste, standards and context, running as a system. It amplifies what you are best at and absorbs what you hate.
- [Build your AI GTM](/ai-gtm): an AI-native go-to-market model across product, price, positioning and people. One lever, thirty days, priced on the outcome.
- A client can start with either and cross to the other. They are not separate payment plans.

## Where what you teach AI ends up

- Consultants and agencies do good work and leave a plan. When the project closes, the understanding behind it goes with them.
- The tools a leader subscribes to are useful, and each keeps what it learns on the vendor's side.
- Mindmake builds the system inside the client's own accounts, so what it learns about their work stays theirs.

## How paid work begins

- There is no public diary and no published price.
- [Start here](/?start=1) begins with a company website. The engine reads the market live and a proposal built for that company follows by email.
- The visitor sees a useful preview before any email address is asked for.
- A confirmed request receives two emails, ever: the results email, and one follow-up fourteen days later. There is no drip sequence.
- Work starts with one thirty-day proof on a real result. Terms are agreed privately.

## The live board

/ai-gtm publishes a daily corroborated read of what moved across product, price, positioning and people, with a visible timestamp and the number of independent sources behind each item.

## CTRL

CTRL is our own decision engine, mentioned on /ai-brain only and never sold. It reads a whole situation in plain English: the trade-offs, the counterpoints and what would change your mind. It is the engine we run on ourselves, shown as proof.

## Proof

- [Results](/case-studies): eight verified anonymous customer stories.
- Organisation logos are attendance proof. They are not customer claims.
- Career testimonials are kept separate from customer outcomes.

## Reading and contact

- [The weekly read](https://mindmakerlive.substack.com): a separate opt-in publication.
- [Straight answers](/faq)
- [General messages](/contact)
`;

for (const target of [resolve(here, "../public/llms.txt"), resolve(here, "../dist/llms.txt")]) {
  try {
    writeFileSync(target, llms);
  } catch {
    if (target.includes("public")) throw new Error(`Could not write ${target}`);
  }
}

console.log("Generated llms.txt");
