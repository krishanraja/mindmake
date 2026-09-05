import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const here = dirname(fileURLToPath(import.meta.url));

const llms = `# Mindmake

> See what is coming for your business before it is obvious. Then act on it with an AI that knows how you work, and keep the edge.

Mindmake works with leaders in private. It reads where they stand and what is changing in their market, decides what to do first, and builds it into an AI they own. Two doors, one paid proof, no public price and no public duration.

## The two doors

- [Build your AI brain](/ai-brain): your taste, standards and context, running as a system. It starts every call from what you already know.
- [Build your AI GTM](/ai-gtm): an AI-native go-to-market model across product, price, positioning and people. One lever, proved with real buyers, priced on the result.
- A client can start with either and cross to the other. They are not separate payment plans. Both are read in private: nobody in the client's organisation needs to know where they started.

## Where what you teach AI ends up

- Consultants and agencies do good work and leave a plan. When the project closes, the understanding behind it goes with them.
- The tools a leader subscribes to are useful, and each keeps what it learns on the vendor's side.
- Mindmake builds the system inside the client's own accounts, so what it learns about their work stays theirs.

## How paid work begins

- There is no public diary and no published price.
- [Start here](/?start=1) asks for four details: first name, last name, work email and division. An illustrative read of the company from the outside follows on screen, with two choices tailored to it, then one easy question and a code to the work email.
- The read is on screen before the work email is verified. A proposal built for that company then follows on screen, by email and as an attached document.
- A confirmed request receives two emails, ever: the results email, and one follow-up fourteen days later. There is no drip sequence.
- Work starts with one paid proof on a real result. The fee and the length are agreed privately. Something is working in the first week.

## The live board

/ai-gtm publishes a daily corroborated read of what moved across product, price, positioning and people, with a visible timestamp and the number of independent sources behind each item.

## CTRL

CTRL is our own decision engine, mentioned on /ai-brain only and never sold. It reads a whole situation in plain English: the trade-offs, the counterpoints and what would change your mind. It is the engine we run on ourselves, shown as proof.

## Proof

- [Results](/case-studies): eight verified anonymous customer stories.
- Organisation logos are attendance proof. They are not customer claims.
- Career testimonials are kept separate from customer outcomes.

## Reading and contact

- [The weekly read](https://mindmakerlive.substack.com): Mindmake's publication, a separate opt-in.
  It runs two channels. The Money of AI follows how the digital world gets paid for and asks who
  pays when a shift lands. Built with AI follows people using AI to become builders and reaches the
  human reason under the build.
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
