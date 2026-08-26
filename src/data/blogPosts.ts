export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  category: "ai-literacy" | "leadership" | "implementation" | "strategy";
  tags: string[];
  readingTime: number;
  featured: boolean;
  metaDescription: string;
  ogImage?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "the-execution-gap-why-ai-literate-leaders-ship-while-others-plan",
    title: "The Start Cost: Why Good AI Work Gets Deferred",
    excerpt: "Good ideas often stall because starting them takes too much effort. The right AI context can lower that cost.",
    category: "implementation",
    tags: ["Starting work", "Useful context", "Leadership", "AI systems"],
    author: "Krish Raja",
    publishedAt: "2026-03-12",
    updatedAt: "2026-08-23",
    readingTime: 4,
    featured: true,
    metaDescription: "How useful context, clear next steps and simple AI systems can make valuable work easier to start.",
    content: `
## Start with a piece of work that keeps slipping

Think of one useful thing that has been on your list for weeks. It may be a customer note, a new offer, a board paper or a product test.

The problem may not be the size of the job. It may be the effort needed to begin. You need to find the old notes, remember the last choice, shape the first draft and decide what good looks like. A free hour is not enough if the first 45 minutes are spent rebuilding the context.

That is the start cost.

## What AI can carry

AI is useful when it lowers that cost without hiding the important choices. It can keep:

- the facts you use often;
- examples of work you like and dislike;
- past choices and the reasons behind them;
- a simple first step for this kind of job;
- a check that brings the work back to you when it is unsure.

This is more useful than asking a blank chat window to “write a plan”. The system starts closer to the way you already think.

## A small test

Choose one job that happens at least twice a month. Record the time it takes today, including the time spent finding things and getting ready.

Then build the smallest useful aid for it. Give the AI the source material, one strong example and three checks. Use it on the next real version of the job.

Ask four questions afterwards:

1. Did the work start sooner?
2. Did the first version give you something worth editing?
3. Did you keep the calls that need your judgement?
4. Would the saved time be worth more somewhere else?

If the answer is no, change or stop the system. If the answer is yes, keep the context and improve it on the next use.

## The larger gain

Time saved is only the first result. The larger gain is what becomes possible because useful work can begin while the idea is still alive.

*Pick one delayed job. Lower its start cost before you try to automate the whole process.*
    `,
  },
  {
    slug: "four-modes-of-ai-literacy-every-leader-needs",
    title: "Four Ways Leaders Can Work Better With AI",
    excerpt: "A practical way to use AI for first drafts, better checks, repeatable work and harder decisions.",
    category: "ai-literacy",
    tags: ["Using AI", "Leadership", "Decision making", "Practice"],
    author: "Krish Raja",
    publishedAt: "2025-01-02",
    updatedAt: "2026-08-23",
    readingTime: 4,
    featured: true,
    metaDescription: "Four practical ways leaders can use AI for drafts, checks, repeatable work and better decisions.",
    content: `
## One tool can play four different parts

Many leaders judge their AI skill by the quality of a prompt. That is too narrow. A better test is whether AI helps you do four kinds of work.

## 1. Make a first version

Use AI to turn known facts into a draft you can react to. This could be a customer email, a short brief or three ways to explain an idea.

Give it the source facts and a good example. Do not ask it to invent missing evidence.

**Useful test:** Did the first version help you begin, even if you changed most of it?

## 2. Check your thinking

Ask AI to find a weak claim, a missing voice or a risk you may have ignored. Give it a clear role, such as a careful buyer or a finance lead.

Do not treat the answer as truth. Use it as another view to inspect.

**Useful test:** Did it reveal a question you now want to answer with real evidence?

## 3. Carry a repeatable job

Some work has the same shape each time. Meeting preparation is a good example. The sources change, but the questions and output may stay the same.

Write down the steps. Show the AI what good work looks like. Add a point where a person checks the result.

**Useful test:** Can another person run the job and see how the answer was made?

## 4. Help you compare hard choices

AI can hold several options, facts and views in one place. It can show where two choices differ and what evidence would change the call.

The leader still decides. The value is a clearer field of view.

**Useful test:** Can you explain the choice, the trade-off and the fact that mattered most?

## Try all four on one real problem

Take a live decision. Ask AI to make a first view, question it, help with one repeated step and lay out the final options. Keep a note of where it helped and where a person had to step in.

That note is more useful than a score from a training course. It shows how you work with AI when the result matters.
    `,
  },
  {
    slug: "why-ai-training-fails-and-building-works",
    title: "Why Practice Changes More Than a Training Day",
    excerpt: "Training can create interest. Practice with real work is what turns that interest into a useful habit.",
    category: "implementation",
    tags: ["Practice", "Training", "Real work", "Learning"],
    author: "Krish Raja",
    publishedAt: "2025-01-01",
    updatedAt: "2026-08-23",
    readingTime: 4,
    featured: true,
    metaDescription: "Why practice on real work helps leaders turn AI training into useful habits and systems they can improve.",
    content: `
## Interest is not the same as changed work

A good training day can make people curious. It can show what a tool can do and give the team common words.

The change often fades when everyone returns to a full diary. The examples were safe. The data was clean. No real customer, deadline or hard call was involved.

Practice changes more because it meets the work where it is messy.

## Pick a job with a real owner

Choose one job that matters to one named person. It should happen often enough to test again soon. It should also have a result that can be checked.

Good examples include:

- preparing a weekly sales view;
- turning customer calls into product questions;
- checking a proposal against the buyer's needs;
- bringing several reports into one short brief.

Avoid a broad goal such as “help the team use AI”. It has no clear finish.

## Keep the before and after

Save one recent example of the work before AI was added. Note the time, the source files, the mistakes and the person who checked it.

Build a small first version. Use it on live work. Then compare:

- Did it return useful time?
- Did the work become easier to check?
- Did the person keep the final call?
- Could someone else understand how it works?

This is proof the team can discuss without guessing.

## Teach through the change

Ask the owner to explain three things to a colleague:

1. what the AI carries;
2. what the person still decides;
3. what makes the system stop and ask for help.

If they cannot explain those points, the work is not ready to spread.

## What should remain after the month

The useful result is not a folder of prompts. It is a working job, a clear owner, a few good examples and a record of what was learned.

*Train on a real result. Let the lesson come from the work.*
    `,
  },
  {
    slug: "shadow-ai-to-strategic-ai-leaders-guide",
    title: "Find the AI Work Already Happening in Your Team",
    excerpt: "A calm way to learn what people use, protect what matters and keep the experiments that are genuinely useful.",
    category: "strategy",
    tags: ["Team AI use", "Risk", "Shared rules", "Useful experiments"],
    author: "Krish Raja",
    publishedAt: "2024-12-28",
    updatedAt: "2026-08-23",
    readingTime: 4,
    featured: false,
    metaDescription: "How to learn where a team already uses AI, check the risks and turn useful experiments into safer shared work.",
    content: `
## Start with curiosity, not a ban

People often use AI before the company has agreed how it should be used. They may draft emails, study data or prepare customer work with tools they found themselves.

Some of this work will be useful. Some may put private data, quality or trust at risk. You need to see both.

## Ask five calm questions

Speak to the people doing the work. Ask:

1. What job are you trying to make easier?
2. Which tool do you use?
3. What information do you give it?
4. How do you check the answer?
5. What would stop you trusting it?

Do not start by asking who broke a rule. People will hide the most useful evidence.

## Sort the work by risk

Put each example into one of three groups.

**Safe to learn from:** public information, rough ideas and work that a person checks before use.

**Needs a stronger rule:** customer data, important claims, money, hiring or work that may reach the public.

**Stop for now:** private information in an unapproved tool, hidden decisions or work no person can check.

The groups should be easy for a ten-year-old to explain. If the rule needs a long legal note before it makes sense, it will not guide a busy team.

## Keep the useful parts

Choose one example that saves time or improves the work. Move it into an approved place. Add the source material, a clear owner and a short check.

Then show the team what changed. This proves that speaking up can lead to better tools, not only more control.

## Review the rule with real evidence

Meet again after a month. Look at what people used, what went wrong and what they stopped doing. Change the rule when the evidence changes.

*The first useful map of AI in a company often already lives in the habits of its people.*
    `,
  },
  {
    slug: "measuring-ai-work-that-pays-back",
    title: "How to Tell Whether AI Work Is Paying Back",
    excerpt: "A practical way to measure time returned, work improved and what that time makes possible next.",
    category: "implementation",
    tags: ["Value", "Time returned", "Business results", "AI work"],
    author: "Krish Raja",
    publishedAt: "2024-12-25",
    updatedAt: "2026-08-23",
    readingTime: 4,
    featured: true,
    metaDescription: "A practical way to measure whether AI returns useful time, improves important work and stays useful.",
    content: `
## Saving time is not enough

An AI tool may make a task faster and still create little value. The saved hour may disappear into more email. The work may need more checking. The person may stop learning the job.

Measure what happens after the time is saved.

## Record the old version first

Before you change the work, keep one normal example. Note:

- how long it takes from start to finish;
- who touches it;
- where it waits;
- which mistakes happen often;
- who makes the final call.

Without this, every result becomes a feeling.

## Check four kinds of payback

### 1. Useful time returned

Count the time that is truly free for another job. Do not count time that moved to extra checking or fixing.

### 2. Better work

Did the answer become clearer, more complete or easier to use? Keep a simple check that a person can repeat.

### 3. Better use of the person's time

Ask what the person did with the time. A founder may speak to more customers. A portfolio lead may study another company. A sales leader may coach the team.

This is often where the larger value sits.

### 4. Value that remains

Did the work leave behind useful memory, rules, examples or data? Will the next use start from a better place?

## Use a one-page record

For each system, keep:

| Before | After |
| --- | --- |
| Time used | Time returned |
| Common errors | Errors now caught |
| Person doing the routine | Person making the hard call |
| No shared memory | What the system now remembers |

Add one line called **Time reinvested in**. This stops the business from treating every saved hour as the same.

## Set a stop rule

Stop or change the system if checking takes too long, quality falls or no one uses the returned time well.

*The right question is not only “Was it faster?” Ask “What became possible next?”*
    `,
  },
  {
    slug: "builder-vs-consumer-mindset-in-ai",
    title: "From One-Off AI Help to Systems You Can Reuse",
    excerpt: "Simple AI help is useful. The larger gain comes when your context and standards make the next piece of work better too.",
    category: "ai-literacy",
    tags: ["AI systems", "Memory", "Quality", "Repeatable work"],
    author: "Krish Raja",
    publishedAt: "2024-12-20",
    updatedAt: "2026-08-23",
    readingTime: 4,
    featured: false,
    metaDescription: "How to turn useful one-off AI help into repeatable systems that remember your context and standards.",
    content: `
## A good answer can still disappear

You ask AI for help with a board note. After several turns, the result is useful. A month later you begin again from a blank screen.

The answer helped once. The work did not get better over time.

## Keep four things from the useful exchange

### 1. Context

Save the facts that change slowly, such as the company, the buyer, the goal and the limits.

### 2. Examples

Keep one piece of work you liked and one you rejected. Add a short note saying why.

### 3. Checks

Write down the questions you used to judge the answer. For a board note these may be: Is the source clear? Is the risk named? Is the next call obvious?

### 4. A hand-off

Name the point where the AI must stop and bring the work back to a person.

## Build around a job, not a tool

Tools will change. The job may remain. Name the system after the result, such as “prepare the weekly buyer view”, not after the model that runs it.

This makes it easier to replace the tool without losing the thinking.

## Let the owner improve it

Keep the files in a place the business controls. Show the owner how to change the examples and checks. Record each important change and why it was made.

The system should become easier to understand as it improves, not more mysterious.

## A useful test

Run the same job twice. On the second use, ask:

- Did it remember the right facts?
- Did it avoid a mistake from last time?
- Did the owner need less help?
- Is the final call still clear?

If so, you have more than a good chat. You have a small asset that can keep learning from the work.
    `,
  },
  {
    slug: "ai-vendor-theatre-how-to-spot-and-avoid-it",
    title: "How to Test an AI Vendor Before You Commit",
    excerpt: "Five checks that turn a polished demo into a clearer product, data and contract decision.",
    category: "strategy",
    tags: ["AI vendors", "Buying", "Product checks", "Contracts"],
    author: "Krish Raja",
    publishedAt: "2024-12-15",
    updatedAt: "2026-08-23",
    readingTime: 5,
    featured: false,
    metaDescription: "Five practical checks for testing an AI vendor on your data, your problem and clear success measures.",
    content: `
## A smooth demo is not proof

A vendor controls the data, the question and the route through a demo. Your business will not be that tidy.

Before you commit, test the product on work that looks like yours.

## 1. Bring one real job

Choose a job with a clear owner and result. Use safe but realistic data. Avoid a made-up example that everyone knows the product can handle.

Ask the vendor to show the full path from input to checked result.

## 2. Ask it to show doubt

What happens when facts are missing or two sources disagree? A useful product should show that it is unsure and ask for help.

If every answer looks polished, inspect the weak cases more closely.

## 3. Name the human check

Ask who reviews the work, what they see and how they change it. Check whether the source and the reason remain visible.

“A person is in the loop” is not enough. You need to see the loop.

## 4. Test your way out

Ask how you export your data, rules, prompts and results. Find out what still works if you stop paying.

The right vendor should add value beyond access to a common AI model. That value may be trusted data, strong checks, better tools or hard work already built into the product.

## 5. Agree the proof before the trial

Write down:

- the job being tested;
- the old time and error rate;
- what a good result looks like;
- who decides whether it worked;
- the date you will stop, change or continue.

Do this before the trial starts. A test with no finish line will always find a reason to carry on.

## Questions worth sending in writing

1. Which model does the product use today?
2. Where does our data go?
3. Is our data used to train anything?
4. What can we export?
5. What happens when the model or price changes?
6. Can we speak to a customer using it on similar work?

*Buy the result you can test, not the future shown on a slide.*
    `,
  },
  {
    slug: "a-useful-first-30-days-building-with-ai",
    title: "A Useful First 30 Days of Building With AI",
    excerpt: "A practical month for choosing real work, testing a small number of systems and keeping the evidence.",
    category: "implementation",
    tags: ["30-day plan", "Building", "Real work", "Proof"],
    author: "Krish Raja",
    publishedAt: "2024-12-10",
    updatedAt: "2026-08-23",
    readingTime: 5,
    featured: true,
    metaDescription: "A practical 30-day plan for testing AI on real work, building a useful first system and recording what changed.",
    content: `
## The goal is proof, not a grand plan

The first month should answer one question: can a small AI system improve a real piece of work here?

It is not the month to connect every tool or study the whole company. Clear limits make the result easier to trust.

## Week 1: Choose the work

Pick one job that:

- matters to a named person;
- happens often;
- has source material you may use;
- has a result a person can check;
- gives the saved time somewhere useful to go.

Keep a recent example. Note how long it took, where it waited and who made the final call.

## Week 2: Build the smallest useful version

Give the system the facts, one good example and the checks the owner already uses.

Make the first version narrow. It may prepare a brief, sort a set of notes or bring the right facts into view. It does not need to run the whole job.

Show where the AI stops and the person steps in.

## Week 3: Use it on live work

Run it several times. Keep the weak outputs as well as the good ones. Ask the owner to note:

- what saved time;
- what still needed care;
- which fact was missing;
- when they did not trust the answer.

Change the system from this evidence, not from a wish list.

## Week 4: Keep what worked

Compare the before and after examples. Record the time returned, the quality change and what the owner did with the time.

Leave behind:

1. the working system;
2. the source files and examples;
3. the checks and limits;
4. a short record of what changed;
5. the next test, if there should be one.

## The decision at day 30

Continue only if the work is useful, the owner wants it and the next gain is clear. Stop if the system needs more care than it returns.

That is a successful first month either way. You have replaced hope with evidence.
    `,
  },
  {
    slug: "ai-literacy-for-executive-teams-lab-model",
    title: "How an Executive Team Can Learn AI Together",
    excerpt: "A practical way to build shared judgement around AI by working on one real decision together.",
    category: "leadership",
    tags: ["Executive teams", "Shared judgement", "Decisions", "Practice"],
    author: "Krish Raja",
    publishedAt: "2024-12-05",
    updatedAt: "2026-08-23",
    readingTime: 4,
    featured: false,
    metaDescription: "A practical way for an executive team to build shared AI judgement through one real decision.",
    content: `
## Use one real decision as the lesson

An executive team does not need everyone to become a tool expert. It needs people to make sound calls together when AI changes the options.

Choose one live decision. It could be a new product, a price change, a role the team may redesign or an AI vendor the company may buy.

## Bring the different views into the room

Ask each leader for four short answers before the session:

1. What result do you want?
2. What are you worried about?
3. What evidence would change your mind?
4. Which call should remain with a person?

AI can group the answers and show where people agree or differ. It should not decide who is right.

## Work through the choice together

During the session:

- check the facts and their sources;
- compare two or three real options;
- name the gain and risk in each;
- choose the owner of the final call;
- agree what will be tested next.

Use plain words. If the team cannot explain the choice without tool names, it may not understand the business decision yet.

## Leave with three shared rules

Write down:

**What AI may carry:** the research, preparation or routine work it can do.

**What a person must decide:** the calls that need trust, care or a hard trade-off.

**What proof will count:** the result the team will inspect before it spends more.

## Check the change after 30 days

Return to the same decision. Ask what happened, what the team learned and which rule needs to change.

The useful result is not that everyone uses the same AI tool. It is that the team can see the same evidence, challenge it and make a clearer call.
    `,
  },
  {
    slug: "how-to-increase-creative-leadership-with-ai",
    title: "Use AI to See More Without Losing Your Taste",
    excerpt: "AI can widen the field. Your experience, judgement and taste still decide which idea deserves to move.",
    category: "leadership",
    tags: ["Ideas", "Taste", "Leadership", "Creative work"],
    author: "Krish Raja",
    publishedAt: "2025-01-15",
    updatedAt: "2026-08-23",
    readingTime: 4,
    featured: false,
    metaDescription: "How leaders can use AI to explore more options while keeping human experience, judgement and taste in the final choice.",
    content: `
## More ideas do not mean better ideas

AI can produce many options quickly. That can widen your view. It can also fill the page with smooth, forgettable work.

The leader's job is not to praise the amount. It is to set the test.

## Begin with a real point of view

Write three things before you ask AI for ideas:

1. What are you trying to change?
2. What must remain true?
3. What kind of answer would feel wrong for you?

These limits help the AI explore around your taste instead of replacing it with the average of the internet.

## Ask for different routes, not more of the same

Request options that start from different beliefs. For example:

- one route that protects the current customer;
- one that serves a new buyer;
- one that removes a part of the offer;
- one that changes how the business gets paid.

Ask the AI to show the belief behind each route. This makes the options easier to judge.

## Use your dislikes as evidence

When you reject an idea, write one sentence saying why. “Too generic” is not enough. Try “This removes the part customers trust us for” or “This sounds clever but gives the buyer no clear result.”

Those notes teach the system more about your taste than another long prompt.

## Keep the sources visible

If an idea depends on a market fact, customer quote or number, keep the source beside it. A surprising idea can still be built on a false claim.

## End with a human choice

Choose one route. Write down:

- why it fits the problem;
- what you are giving up;
- what must be tested with a real person;
- what would make you stop.

AI helped open the field. Your judgement closes it.

*The aim is not to sound more creative. It is to see an option you can defend and test.*
    `,
  },
  {
    slug: "how-to-control-your-use-of-ai-as-a-leader",
    title: "Put AI Inside Clear Business Rules",
    excerpt: "A practical way to show what AI is for, what it may decide, how the work is checked and who owns the final call.",
    category: "leadership",
    tags: ["Business rules", "AI checks", "Ownership", "Leadership"],
    author: "Krish Raja",
    publishedAt: "2025-01-15",
    updatedAt: "2026-08-23",
    readingTime: 5,
    featured: false,
    metaDescription: "Four sets of clear business rules for AI: purpose, decision rights, working checks and ownership.",
    content: `
## A rule should help someone act

“Use AI safely” is not a useful rule. It does not tell a person what they may do, what needs checking or who owns the result.

Good rules begin with the work.

## Rule 1: Say what AI is for

Name the result, not the tool. For example: “Use AI to prepare the weekly customer view from approved sources.”

Also name what it is not for. This may include private staff choices, final legal advice or claims that cannot be traced to a source.

## Rule 2: Name the calls AI may and may not make

Make three lists:

**AI may do this alone:** low-risk work with a clear rule and an easy way to undo it.

**A person must approve this:** customer messages, money, public claims or changes that affect people.

**AI must never do this:** work the business cannot explain, check or take back.

Use examples from your own company. People follow a clear case better than a long policy.

## Rule 3: Keep the checks beside the work

For each job, show:

- which sources are allowed;
- what a good result looks like;
- who checks it;
- when the system must stop;
- where the reason is recorded.

Do not hide these checks in a separate document no one opens.

## Rule 4: Give the result an owner

An AI system cannot own the business result. Name the person who can change the rule, stop the system and answer for the final work.

The owner also needs time to review weak cases. A person “in the loop” with no time or power is not a real check.

## Review the rules with real cases

Once a month, look at one good result, one weak result and one case where the AI asked for help. Change the rule if the evidence has changed.

## A ten-minute starting point

Take one AI job and finish these lines:

1. The result we want is...
2. AI may carry...
3. A person must decide...
4. The system stops when...
5. The owner is...

If the team can answer those five lines, it has a working rule it can use today.
    `,
  },
];

export const getBlogPostBySlug = (slug: string): BlogPost | undefined =>
  blogPosts.find((post) => post.slug === slug);

export const getFeaturedPosts = (): BlogPost[] => blogPosts.filter((post) => post.featured);

export const getPostsByCategory = (category: BlogPost["category"]): BlogPost[] =>
  blogPosts.filter((post) => post.category === category);

export const getAllCategories = (): string[] => [...new Set(blogPosts.map((post) => post.category))];

export const getAllTags = (): string[] => [...new Set(blogPosts.flatMap((post) => post.tags))];
