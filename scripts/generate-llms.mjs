import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const here = dirname(fileURLToPath(import.meta.url));

const llms = `# Mindmake

> Put your best judgement to work with AI.

Mindmake helps leaders turn their judgement into useful AI systems and make better product, price, message and team decisions.

## Ways to get started on your AI journey

- [Build Your AI Brain](/ai-brain): turn the way a leader judges, remembers and chooses into a working system.
- [Build Your AI GTM](/ai-gtm): decide what should change across product, price, message and team, then test it with real buyers.
- The two routes can connect. They are not separate payment plans.

## How paid work begins

- Public visitors do not book directly into Krish Raja's diary.
- [Start here](/?start=1) begins with a company website, a likely business problem and what the leader would do with more time.
- The visitor sees a useful preview before email. Adding a work email creates a personal recommendation and sends the same facts to Krish so he can decide whether a reply would help.
- A strong fit can begin with one clear 30-day piece of work on a real problem.
- Longer work is considered only after the first work shows value. Public prices are not shown.

## CTRL by Mindmake

CTRL keeps facts, examples, past choices and working rules beside the decisions they support. It shows what the system knows, what still needs checking and where a person needs to decide.

## Proof

- [Customer outcomes](/case-studies): eight verified anonymous stories.
- Mindmake has helped over 4000 leaders with what is next in AI.
- Organisation logos are attendance proof. They are not customer claims.
- Career testimonials are kept separate from customer outcomes.

## Krish Raja

Krish has spent 17 years in data and technology product strategy, plus two years building deeply with AI.

## Media and contact

- [Mindmake media](https://mindmakerlive.substack.com): useful ideas about building with AI and where AI is changing value.
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
