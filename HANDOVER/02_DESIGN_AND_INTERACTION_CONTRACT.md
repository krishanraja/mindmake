# Design and interaction contract

This is an anti-regression contract, not a mood board. Earlier work repeatedly lost approved ideas while improving another section. That must not happen again.

## Frozen hierarchy

### V5 is the homepage floor

`prototypes/mindmake-judgement-thread-motion-study-v5.html` defines the minimum quality for:

- the opening act;
- the rotating recognition line;
- the working-understanding sequence;
- the judgement thread;
- the first CTRL proof;
- scroll rhythm and bidirectional motion;
- desktop and mobile composition.

Later code can fix a proven defect, but it may not regress V5 in clarity, causal motion, finish, mobile use or visual rhythm.

### Candidate 7 V2 is an exact gateway contract

The gateway is frozen across:

- `prototypes/mindmake-brain-gtm-gateway-candidate-7-v2.html`
- `src/components/mindmake/BrainGtmGateway.tsx`
- `src/styles/mindmake-gateway.css`

Its wording, composition, colours, timing and door-separation motion are approved. Do not replace it with static cards, reuse a later generic two-card section, or borrow a different prototype's Brain/GTM visuals.

### V8 is breadth evidence only

`prototypes/mindmake-homepage-mock-v8.html` contains useful route, proof and content breadth that was not fully represented in V5. Where V5 and V8 overlap, V5 wins. V8 is not permission to restore rejected layouts or copy.

## Global alignment

- The wordmark, opening act and every later section share one content edge.
- A section may change colour or composition but may not invent a new left margin.
- Nested content may align inside a deliberate grid, but the section's main heading and content shell must return to the shared edge.
- The logo and main content must feel connected at every viewport.
- The header must not obscure the top of a scene or leave the page in an accidental half-state.

## Fit-screen rule

A scene intended to feel like one act must fit in the visible canvas below fixed chrome.

- Do not assume a tall desktop monitor.
- Check short laptop screens and mobile browser chrome.
- If the content cannot fit, recompose it, use a deliberate horizontal snap deck or let it become an honest content section.
- Do not crop useful copy, hide the action or shrink controls simply to claim that it fits.
- Avoid the repeated failure where a heading enters above the viewport and the next section is visible below before the current idea lands.

## No eyebrows anywhere

Krish rejects the entire design pattern, not individual words.

Prohibited across all public pages and breakpoints:

- kickers;
- overlines;
- decorative small-caps labels above headings;
- chapter numbers;
- counters used as decorative hierarchy;
- proof badges;
- status straps;
- category labels that act as pre-headings;
- renamed or sentence-case versions of the same device.

Allowed:

- `Pick your starting point` inside the exact frozen gateway;
- a label that directly names a control, axis, value, object or functional state;
- accessible text required to explain an input or action.

If a line matters, make it the heading, body copy or a functional label. Otherwise remove it.

## Typography and wrapping

- Do not stack one or two words per line because a display heading is too large for its column.
- Avoid orphan words and accidental final lines.
- Editorial headings may use up to four balanced lines when they remain easy to scan.
- The frozen gateway uses no more than four lines on desktop and three on a phone.
- Test real text at 320, 360, 390, 768, 1024, 1440 and 1920 pixels.
- No testimonial, body block or heading may truncate.
- Do not use a fashionable type pairing merely because it signals an AI start-up. The system should feel intentional and established.

## Motion doctrine

Every movement must change what the visitor understands.

Good motion:

- joins fragments into one idea;
- separates one foundation into two routes;
- reveals the relationship between human judgement, memory, context and work;
- shows a decision moving from uncertainty to a useful next step;
- reverses slightly when the user scrolls back;
- completes quickly enough that the visitor sees the meaning before leaving the viewport.

Bad motion:

- enters late;
- loops without teaching anything;
- adds dots, boxes, particles or scribbles only for movement;
- creates blank states before content arrives;
- implies a result is declining or racing to the bottom when the offer is about growth and change;
- behaves like a slide deck disconnected from scrolling;
- moves controls or layout while the visitor is trying to use them.

Reduced-motion mode must show the complete meaning without requiring animation.

## Hand-drawn marks

Hand-drawn marks can add human judgement when they point to one stable piece of evidence.

- Use them sparingly.
- Anchor them to exact geometry, not approximate page positions.
- Recalculate at each breakpoint.
- Prefer an annotation beside a result or decision over a decorative squiggle.
- Do not draw over CTRL screenshots or product footage likely to change.
- If the mark no longer points clearly to its subject, remove it.

## Real-world imagery and product footage

- Use real footage to prove Krish builds and operates, not as a decorative wallpaper.
- Keep product video clean and replaceable.
- Crop CTRL footage to show the meaningful action, not empty top chrome.
- The Brain proof should reach the node map quickly rather than dwell on the top of the interface.
- Use `preload="none"` for visitor-controlled video unless a tested scene requires otherwise.
- The page must remain clear before a video is played or if it fails.
- Finished external films may replace placeholders later. Components must hold their composition with a still fallback until then.

Five current CTRL clips exist:

- `CTRL - Demo 1 - Newsfeed.mp4`
- `CTRL - Demo 2 - Loading.mp4`
- `CTRL - Demo 3 - Headlines.mp4`
- `CTRL - Demo 4 - Decisions.mp4`
- `CTRL - Demo 5 - Brain.mp4`

The existing long demo should not be used as one undifferentiated video when a short, purposeful clip explains the section better.

## Proof architecture

- Customer outcomes show what changed for a client.
- Testimonials show what working with Krish felt like or how he operates.
- Attendee brands show reach only and must say that people from those organisations attended.
- Career references remain separate from customer outcomes.
- Steph appears only when the consent record is present and available. Fail closed.
- Do not create two sections that repeat the same customer proof in different styles.
- Testimonial controls occupy a fixed reserved position. Quote length may change the card height only within an intentional responsive layout and must never move navigation.
- Never truncate a quote.
- Do not attach internal offer names to result stories.

## Gateway role in the journey

The gateway is the main event, not another pair of cards in a long scroll.

- It receives a clear visual pause before it begins.
- The central statement and doors move apart together.
- Both routes remain equally real while using distinct colour and language.
- Each door is a large, obvious interactive target.
- Mobile must feel like opening two routes with the thumb, not reading a compressed desktop split.
- The gateway should lead to `/ai-brain` and `/ai-gtm` without losing scroll, focus or visual context.

## Mobile doctrine

Mobile is a new composition using the same design system.

- At 900 pixels wide or below, the measured consent notice becomes top chrome.
- Reserve its exact rendered height for header, menu, route opening and gateway.
- The open menu fills the remaining viewport below the header and locks page scroll.
- Escape closes the menu and restores focus to the visible Menu control.
- Opening `Start here` from the mobile menu closes the menu, focuses the visible Menu control, then opens the dialog. Closing the dialog restores focus to that visible control.
- Every touch target is at least 44 by 44 pixels.
- Use safe-area insets and `visualViewport` for mobile keyboard and browser chrome.
- Short landscape uses a deliberate two-pane composition or horizontal snap rail.
- Horizontal rails reveal part of the next card, swipe naturally and report the real final card even with browser rounding.
- No hidden navigation element may receive restored focus.
- No content may sit in an uncovered strip behind a supposedly full-screen menu.

## Visual acceptance checklist

Before accepting any route or section:

1. Compare it directly with V5 if V5 covers the same surface.
2. Verify the four frozen hashes.
3. Capture 1440, 390 and 320 pixel renders.
4. Check the shared left edge.
5. Check visible canvas use below header and consent chrome.
6. Scan the rendered DOM for the banned eyebrow family.
7. Check heading line counts and orphan words.
8. Scroll forward and backward through motion.
9. Enable reduced motion.
10. Use keyboard only, including Escape and focus restoration.
11. Confirm no horizontal overflow or broken media.
12. Confirm movement explains the message.
