# Mindmaker Intelligence Audit

Status: working product audit, 2026-08-12.

This file separates the useful intelligence already built from the retired offers and old public journeys wrapped around it.

## The useful system that already exists

### 1. Understand the visitor and the business

The company dossier can begin from a company name, domain, work email, or a company named during the conversation.

It can collect:

- Company name, logo, colours, founding date, products, sector, and a short description.
- Public size and reach signals used quietly for routing.
- Relevant parts of the company's technology stack.
- Recent company news and other current signals.
- A short working description that the visitor can correct.

Current sources include Brandfetch, Tranco, People Data Labs, BuiltWith, Perplexity, Exa, NewsAPI, Gemini, and Anthropic. Missing sources fail quietly rather than blocking the experience.

### 2. Understand what has changed around the business

Mindmaker already has several live outside-data layers:

- A shared, checked news pool created by CTRL and read by Mindmaker.
- Perplexity and Brave Search fallbacks for recent AI news.
- Model price, quality, and speed data from Artificial Analysis.
- Company-specific recent news from the dossier pipeline.
- A Mindmaker filter that separates signal, noise, a decision trigger, and Krish's view.

The most valuable use is not a general news feed. It is showing which outside changes may affect the visitor's product, price, position, route to market, or business shape.

### 3. Turn a vague concern into a decision

The conversational system already follows a thoughtful order:

1. Reflect what it knows and let the visitor correct it.
2. Find the real question under the surface request.
3. Name two or three honest paths and the trade-off in each.
4. Find the weak assumption that could break the plan.
5. Give one useful move for the next 14 days.
6. Recommend the smallest honest next step.

It supports quick replies, free text, and voice. It is designed to reach a useful brief by the third real visitor answer instead of chatting without an end.

### 4. Pressure-test the decision

The strongest documented parts of the old decision method are:

- Break the decision into the claims it rests on.
- Give each claim an evidence strength.
- Separate facts the outside world can answer from calls only the leader can make and questions nobody can answer yet.
- Ask several models to challenge the decision and preserve their disagreements.
- Put the few facts that could change the decision under a timed watch.

These ideas are more distinctive than a normal chat answer. They should be tested as the core of the new Sprint and CTRL workspace, not assumed to belong to a retired offer.

### 5. Produce something useful

The current system can produce:

- A one-screen decision brief.
- A company-branded proposal built from a fixed shell plus carefully generated text.
- Selected verified proof rather than invented proof.
- HTML and PDF output.
- A digest for Krish that carries the dossier, decision, reasoning, recommendation, transcript, and chosen exit.

The fixed shell is important. The model does not make up the whole result. It fills limited parts around a controlled structure.

## What is currently getting in the way

- The public site has two intelligent inputs with different output shapes.
- The main conversation is still named Mindy in public and internally.
- The reasoning and proposal code are tied to the retired Teardown, Handover, CTRL product route, public prices, and old gates.
- Many examples start from automation, agent fleets, cost cutting, or build versus buy. They do not yet begin from startup pressure or blocked commercial growth.
- The one-shot decision tool knows nothing about the visitor's company or current market changes.
- General model prices are shown before they have a clear link to the visitor's commercial decision.
- Some static news fallback cards state old or weakly supported claims. They must not appear as live evidence in a personal result.
- The proposal is shaped as a sales document. The public payoff may need to be a smaller decision signal rather than a full proposal.

## Current product hypothesis, not yet approved

One simple input can begin with the business and the pressure it feels. The system can then combine the company dossier, current outside changes, Krish's decision method, and selected proof.

The public result could show:

1. What appears to be changing around the business.
2. Where growth or value may be getting blocked.
3. The decision that now matters most.
4. The weak assumption worth testing first.
5. The outside evidence behind the read, with its strength and source.
6. One first move, followed by a call with Krish if the decision is worth resolving properly.

The paid Sprint could go further by building the full claim map, running the cross-examination, retaining the evidence and disagreement, committing the decision, starting the first material action, and placing the facts that could reopen it under watch inside CTRL by Mindmaker.

## Direction approved in the positioning interview

- The visitor does not need to know what they need. An ambiguous problem is a valid starting point.
- Mindmaker uses a framework and nested AI interview systems to work out what it needs to ask next.
- The interview should turn the leader's cryptic knowledge into a clearer graph of what the uncertainty rests on.
- The graph must help expose the gap between what the leader says matters and what the business is actually doing.
- When a leader says startups are killing the business, the first four lenses are Product, Pricing, Positioning, and People.
- The 21-day Sprint must identify how each of those four areas contributes to the problem rather than assuming one cause at the start.
- The public experience must stay light. The full nested interview is better used after someone has shown interest, as a future replacement for `/intake`.
- A public result may still become a strong downloadable artefact, but it must not require a long intake or pretend to have completed the paid diagnosis.
- The visitor may separately opt in to a short personalised watch matched to what they entered and what the system found.
- The path to Krish is framed around resolving the decision properly and making the watch sharper, not around a generic sales pitch.

This creates two connected products: a very small public preview and a deeper post-interest intake. The preview earns attention. The intake prepares real work.

## Audit of the current `/intake`

The current page is more capable than a normal form. It:

- Starts company enrichment from a work email.
- Builds a company dossier in the background.
- Prefills a description of the business.
- Changes parts of the question set based on the leader's role.
- Uses two small generated reflections without allowing the model to invent the whole interface.
- Supports speech input.
- Uses one question per screen in a strong mobile-friendly visual shell.

Its problem is the fixed journey. It asks 15 questions about AI confidence, automation, training, and the old Sprint. It does not decide what to ask from what remains uncertain. It also appears to lack a reliable save and resume path.

The useful parts should be retained. The old question set and offer assumptions should not.

## Audit of the attached 36-question experiment

The attached Ikigai experiment is not a suitable interface model. It shows all 36 questions in six groups, requires a full ranking of four answers for every question, and only produces text to copy back into another chat.

Its reasoning method is useful:

- Forced choices make polished self-description harder.
- Related questions asked from different angles can expose contradictions.
- Behaviour, regret, refusal, and trade-offs reveal more than stated ambition alone.

The future interview should use these methods only when they add information. It should not ask everyone the same repeated questions.

## Proposed product split

### Public homepage experience

- Ask for the smallest possible signal about the business and the pressure it feels.
- Predict and prefill what can be learned safely from a work email, company domain, or permitted enrichment source.
- Give one small, specific reflection that demonstrates the method.
- Offer the fit call as the clear next step.
- Keep any deeper interview behind an expression of interest.

### Future `/intake` replacement

- Open after a leader has expressed serious interest or booked a call.
- Research known facts before asking for them.
- Ask one adaptive question at a time, using taps and voice before free typing.
- Use contrast questions only where the current answers conflict or confidence remains low.
- Map the uncertainty across Product, Pricing, Positioning, and People without forcing a fake score.
- Produce a private starting brief for the leader and Krish.
- Save after every answer and allow a safe return on another device.

The detailed proposed scope is recorded in `INTAKE_REPLACEMENT_SCOPE.md`. It is a future scope, not permission to build it now.

## Personalised watch and Substack

The personalised watch and Mindmaker Live should be separate choices.

The watch has distinct content and lifecycle rules: four weekly updates, followed by one final useful update about four weeks later. It should stop immediately after unsubscribe. Booking or beginning a Sprint should stop the public sequence and move the person to the appropriate client journey.

Mindmaker should keep the consent and lifecycle state for this watch. Substack can remain the publication system for Mindmaker Live. Its supported embedded form lets the reader subscribe directly. Manual or file imports require confirmation that people opted in, and risky or unconsented lists may be reviewed. There is no documented public subscriber API in the official material reviewed for this audit.

## Questions that must be answered with Krish

- How much of the decision should the free public result make, and what must stay inside the paid Sprint?
- Which parts of the documented decision method are still true and which belonged only to the retired Teardown?
- What information may be asked for before the first useful public result?
- What is the smallest result that feels impressive without pretending to know more than the evidence supports?
- Which private CTRL screens can be shown safely as evidence?
- What exactly counts as the contribution of Product, Pricing, Positioning, and People: a score, a causal link, evidence strength, or another form?
- What is included in the downloadable artefact?
- Does the new `/intake` open only after a call is booked, or also after another strong expression of interest?
- Is the personalised watch a separate opt-in from Mindmaker Live? The current recommendation is yes.
