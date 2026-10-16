# 02. The publication

*Reviewed 16 October 2026 against makeyourmindup.ai. This file says what the
publication is to Mindmake and how the site connects to it. It is not evidence
of cadence, subscriber counts or which pieces are live; read those from the
publication itself. Operational state: `06_CURRENT_STATE.md`.*

Mindmake's publication is **Make Your Mind Up**, at
[makeyourmindup.ai](https://makeyourmindup.ai). It is the way in for people who
are not ready to start anything: free to read, sent by email, with a
**Subscribe free** button on its home page.

---

## What it is

In its own words, on its home page: "What's coming in AI, before it's obvious.
Three times a week I take one AI story apart: who gets paid, what's real, and
where it leads. You make your mind up."

Its channels, formats, cadence and production rules belong to its own project
and are read from the live site, never from this repository. Read on 16 October
2026, it runs three: **follow.the.money** on Mondays, **under.the.hood** on
Wednesdays and **mind.the.gap** on Fridays.

---

## How mindmake.co connects to it

- Every **Media** link and every **Subscribe for free** link goes to its home
  page (`PUBLICATION_URL` and `SUBSCRIBE_URL` in `src/lib/publicLinks.ts`;
  Krish, 26 September 2026). `/signal` and `/builder-economy` redirect there
  too.
- Subscribing appears in three places: a badge beside Media in both menus, one
  button in every footer, and one line with a button in the brief's success
  step. There is no band, pop-up or modal.
- Subscribing never competes with **Get your free AI brief**. The brief is for a
  reader who is ready; the publication is for one who is not ready yet.
- The brief's optional, unticked publication choice records interest only. It
  subscribes nobody and imports nobody.

---

## How it feeds growth

Long-form is the asset and social is the trailer. A LinkedIn or other social
post points to a piece, or to the Subscribe free button; it never stands in for
the piece. What a post may say, and who approves it, is "What the growth engine
may say" in [01_CANON.md](01_CANON.md).

---

## Rules that still hold

Anything about AI that carries Mindmake's or Krish's name keeps the two hard
rules under "The voice" in [00_NORTH_STAR.md](00_NORTH_STAR.md):

- **The Kind Rule.** Irony points at claims, hype, incentives and decisions,
  never at a named person's competence or character.
- **The Rigour Rule.** The joke can never be the finding. Every load-bearing
  number is attributed to whoever produced it.

Also: no em dashes, British English, and nothing published, scheduled or sent
without Krish's approval of that exact item.

---

## History

The earlier two-channel contract, The Money of AI and Built with AI on a
Substack address, is kept verbatim in
[history/ARCHIVE.md](history/ARCHIVE.md#archive-2026-10-16-02-publication-md).
It is history, not guidance.
