# Mindmaker mint → emerald: colour-system migration spec (Phase 0 gate)

**Status:** PROPOSED — awaiting sign-off. Nothing in the live app changes until approved.
**Visual proof:** open `prototypes/brand-emerald-proof.html` in a browser.
**Why:** the three sibling products (Make Your Mind Up, Mindmaker, CTRL) are consolidating on ONE portfolio signature accent. The signature is CTRL's **emerald `#00D9B6`**. Mindmaker today uses **mint `#7ef4c2`**. This spec migrates Mindmaker as a *system*, not a find-and-replace, because mint is a subsystem (signature + text variant + shadows + 5 card-variant tints, 556 uses across 76 files).

## The one rule (unchanged)
Bright emerald `#00D9B6` (171 100% 43%) must **never** be text on a light background — it fails WCAG (1.64:1), exactly like mint did. Text/links on light use **emerald-deep**.

## Derived emerald scale (mirrors the mint scale 1:1)
| Token | HSL | Hex | Role | Contrast on off-white #F7F7F5 |
|---|---|---|---|---|
| `--emerald` (DEFAULT) | `171 100% 43%` | `#00D9B6` | signature: fills, CTA bg (ink text), dark-bg accent, ring, borders, shadows | 1.64 — dark-bg/fill only |
| `--emerald-deep` | `176 90% 24%` | `#06746d` | **text/links on light** (replaces `mint-dark`) | **5.21 AA** |
| `--emerald-50` | `171 100% 97%` | `#f0fffd` | subtle tint | — |
| `--emerald-300` | `171 90% 80%` | `#9efaec` | lighter | — |
| `--emerald-900` | `180 85% 16%` | `#064b4b` | strong/dense text on light | 9.17 AAA |

**Accessibility upgrade:** Mindmaker's current `mint-dark` only reaches AA-large (3.73) for body text; `emerald-deep` reaches full AA (5.21). The migration improves contrast.

**CTA fills:** emerald `#00D9B6` + **ink** text = 9.72 AAA (the hero button; matches CTRL's dark-on-emerald convention). If white text is required on a fill, use `emerald-deep` (5.63 AA). Never white on bright emerald.

## Migration recipe (Phase 1)
1. In `src/index.css`, repoint the `--mint*` primitives at the emerald values and add `--emerald*` + `--shadow-emerald-*` (same alpha as the mint shadows, hue 171). Add `--mint-dark` → `--emerald-deep` value.
2. Keep the Tailwind `mint` colour key as an **alias** to the emerald primitives (`tailwind.config.ts`) so all 556 `text-mint`/`bg-mint`/`border-mint`/`shadow-mint-*` call-sites flip at once with zero per-file churn and nothing missed.
3. Token-ise the hardcoded mint glow in the `wordmark-flicker` keyframe (`158 82% 73%` ×3 → `--emerald`).
4. Verify the WCAG-sensitive surfaces (links, CTAs, accent text) use `emerald-deep` on light.
5. Cosmetic follow-up (separate PR): rename `mint`→`emerald` in class names + the `--mint*` token names; update the "Color WCAG rule" in `CLAUDE.md`.

## Files touched
- `src/index.css` (token block + 5 card variants + voice/glow utilities + `a:hover`)
- `tailwind.config.ts` (`colors.mint` → emerald primitives, `boxShadow.mint-*`, `wordmark-flicker` keyframe)
- `CLAUDE.md` "Color WCAG rule" section (follow-up)
