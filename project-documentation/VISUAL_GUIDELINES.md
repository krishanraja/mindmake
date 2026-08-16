# Visual Guidelines

**Last Updated:** 2026-08-16

> **Signature accent (2026-06-29):** the accent is now **portfolio emerald** `#00D9B6` (HSL `171 100% 43%`), CTRL's emerald, shared across the three sibling products (Mindmaker, CTRL, Make Your Mind Up) over one MindmakerOS token contract. The legacy `mint` tokens/classes (`bg-mint`, `text-mint`, `shadow-mint-*`, "mint" used loosely below) are retained as **aliases** to emerald; read every "mint" reference below as emerald, and prefer the `emerald*` keys in new code. For accent text/links on light backgrounds use **`text-emerald-deep`** (`#06746d`, full AA 5.21), never bright emerald. WHY + WCAG derivation: `prototypes/brand-emerald-proof.{html,md}`.

---

## Visual Principles

1. **Bold, Not Busy** - Strong elements, generous white space
2. **Functional, Not Decorative** - Every visual serves purpose
3. **Professional, Not Corporate** - Clean but not sterile
4. **Modern, Not Trendy** - Timeless, not chasing fads
5. **Accessible, Not Compromised** - WCAG AA minimum for all text

---

## Layout System

### Grid Structure
```
Desktop: 12-column grid, 24px gutter
Tablet:  8-column grid, 16px gutter
Mobile:  4-column grid, 12px gutter
```

### Content Width
```
Max width: 1280px (7xl)
Comfortable reading: 65-75 characters per line
Centered content: mx-auto
```

### Spacing Rhythm
```
Micro:    4px, 8px   (component internals)
Small:    12px, 16px (related elements)
Medium:   24px, 32px (section spacing)
Large:    48px, 64px (major sections)
XLarge:   80px+      (hero, major dividers)
```

---

## Hero Sections

### Structure
```tsx
<section className="min-h-screen flex items-center bg-ink text-white">
  {/* Background effects */}
  {/* GIF overlay */}
  {/* Gradient overlay */}
  {/* Grid pattern */}
  
  {/* Content */}
  <div className="container-width relative z-10">
    <Logo />
    <h1 className="font-display">Large headline with <span className="text-mint">emerald highlight</span></h1>  {/* text-mint = emerald alias; the hero sits on dark ink so bright emerald is fine here */}
    <p>Supporting copy</p>
    <CTAs />
  </div>
</section>
```

### Visual Effects
- Particle/dot GIF background (20% opacity)
- Gradient overlays (dark to darker)
- Animated grid pattern
- Glowing orbs (emerald, blurred, animated pulse)

### Hero Text Sizing
```css
/* Mobile: 24px */
.hero-text-size { font-size: 1.5rem; }

/* Tablet: Fluid 24px-36px */
@media (min-width: 640px) { font-size: clamp(1.5rem, ..., 2.25rem); }

/* Desktop: 36px */
@media (min-width: 1024px) { font-size: 2.25rem; }
```

---

## Content Sections

### Standard Section
```tsx
<section className="section-padding bg-background">
  <div className="container-width">
    <h2 className="font-display text-center mb-12">Section Title</h2>
    <Grid>{cards}</Grid>
  </div>
</section>
```

### Alternating Backgrounds
```
Section 1: bg-background (off-white)
Section 2: bg-muted (light grey)
Section 3: bg-background
Section 4: bg-ink (dark, with white text)
```

---

## Card Patterns

### Glass Card (Glassmorphism)
```css
background: white/70
backdrop-filter: blur(12px)
border: 1px solid white/30
shadow: 2xl
```

**Use for:** Hero CTAs, overlays on images

### Editorial Card (Default)
```css
background: subtle emerald tint gradient
border: 2px solid ink/15
shadow: sm
hover: emerald border, lift
```

**Use for:** Standard content grid items

### Minimal Card
```css
background: subtle emerald tint
border: 2px solid ink/15
shadow: xs
```

**Use for:** Clean, simple content

### Accent Card
```css
background: off-white
border-left: 4px solid ink
border-top: 2px emerald line
```

**Use for:** Callouts, important notes

### Premium Card (Featured)
```css
background: emerald tint gradient
border: 2px solid emerald/40
shadow: md + emerald glow
```

**Use for:** Recommended products, highlighted content

### Dark CTA Card (WCAG Compliant)
```css
background: ink gradient
text-heading: pure white
text-body: off-white (93%)
text-muted: softer white (75%)
```

**Use for:** CTAs, callouts on dark backgrounds

---

## Button Styles

### Primary CTA (Emerald)
`bg-mint` is the alias; renders emerald (ink text on emerald = AAA). New code may use `bg-emerald`.
```tsx
<Button className="bg-mint text-ink hover:bg-mint/90 
                   shadow-lg hover:shadow-xl 
                   hover:scale-105 transition-all">
```
**Use for:** Main conversion actions

### Secondary CTA (Ink)
```tsx
<Button className="bg-ink text-white hover:bg-ink/90">
```
**Use for:** Supporting actions

### Outline CTA, emerald border + emerald fill on hover (alias classes shown)
```tsx
<Button variant="outline" 
        className="border-mint text-mint hover:bg-mint/20">
```
**Use for:** Tertiary actions, "learn more"

---

## Typography Hierarchy

### Page Hierarchy
```
H1 (Hero):     clamp(40-72px) bold, Space Grotesk, emerald accent
H2 (Section):  clamp(32-48px) semibold, Space Grotesk, ink
H3 (Card):     clamp(24-30px) semibold, Space Grotesk, ink
Body:          16px regular, Inter, foreground
Caption:       12-14px regular, Inter, muted-foreground
```

### Visual Weight
```
Headlines:  font-bold (700)
Subheads:   font-semibold (600)
Body:       font-normal (400)
Captions:   font-normal (400) with muted color
```

---

## Color Application

### Text Hierarchy
```
Primary text:    text-foreground (ink)
Secondary text:  text-muted-foreground (mid-grey)
Tertiary text:   text-muted-foreground/70
Headings:        text-foreground (ink)
Hero headings:   text-white with emerald <span> (on dark ink)
```

### Dark Background Text (Critical)
```
Headings:        text-dark-card-heading (pure white)
Body text:       text-dark-card-body (off-white 93%)
Metadata:        text-dark-card-muted (softer white 75%)
```

**NEVER use `text-white/80` on dark backgrounds - fails WCAG AA**

### Background Usage
```
Page background:     bg-background (off-white)
Card background:     bg-card (white)
Muted sections:      bg-muted (light grey)
Dark sections:       bg-ink
Accent areas:        bg-emerald/10 (10% emerald tint; bg-mint/10 alias is equivalent)
```

### Border Usage
```
Default:         border-border (light grey)
Subtle:          border-border/50
Emphasized:      border-emerald (border-mint alias is equivalent)
Dark mode:       border-border (adjusted in dark mode)
```

---

## Interactive States

### Hover Effects (Desktop Only)
```css
Buttons:    scale-105, shadow increase
Cards:      scale-1.01, translateY(-2px), emerald border
Links:      underline, emerald color (use emerald-deep for link text on light backgrounds)
Icons:      translateX(4px) for arrows
```

**Mobile:** Hover transforms disabled to save battery and prevent accidental triggers

### Focus States
```css
All interactive: ring-2 ring-emerald ring-offset-2   /* ring-mint alias is equivalent */
Visible only:    focus-visible: modifier
```

### Active States
```css
Buttons:    scale-98 (slight press)
```

---

## Animation Guidelines

### Scroll Animations
```tsx
className="fade-in-up"
style={{animationDelay: `${index * 0.1}s`}}
```

**Stagger timing:** 0.1s per item  
**Max delay:** 0.6s (no more than 6 items)

### Micro-interactions
```css
Hover:      0.3s ease-out
Focus:      0.2s ease
Transitions: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
Card hovers: 600ms ease (slow, premium feel)
```

### Pulse Effects
```css
Glowing orbs:  3-4s duration
Hero accent:   2s duration
CTAs:          group-hover:animate-pulse (on icon)
```

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

---

## Imagery Guidelines

### Hero Images
- High resolution (2560px+ width)
- Dark overlays (40-60% opacity) for text legibility
- Positioned: center or focal point
- Never stretch or distort

### Icons
- Lucide React library
- 20px (h-5 w-5) standard
- 24px (h-6 w-6) for emphasis
- Emerald for positive actions (use emerald-deep if the icon carries meaning as text on a light background)
- Ink/foreground for neutral

### Logos
- Mindmaker icon: standalone mark
- Wordmark: full logo with text
- Krish headshot: circular crop, 192px diameter
- Always on appropriate contrast background

---

## Mobile Considerations

### Touch Targets
```css
Minimum: 44px x 44px (touch-target class)
Buttons: px-6 py-3 minimum
Icons:   Adequate padding around
```

### Responsive Patterns
```
Desktop:   3-4 columns
Tablet:    2 columns
Mobile:    1 column (stack)
```

### Font Scaling
```
Hero:     1.5rem -> clamp -> 2.25rem (mobile->tablet->desktop)
H2:       clamp(2rem, 4vw, 3rem)
Body:     16px (consistent)
```

### Spacing Adjustments
```
Section padding: py-12 -> py-16 -> py-24 -> py-32
Container:       px-4 -> px-6 -> px-8
Gaps:            gap-4 -> gap-6
```

### Mobile-Specific
- Disable heavy hover transforms
- Use `100dvh` for proper viewport height
- Respect safe area insets
- Test on 375px width minimum

---

## Accessibility Visual Requirements

### Color Contrast
- AA standard minimum (4.5:1 for body text)
- AAA preferred (7:1)
- Test: Ink on Off-White = 12.6:1 ✅
- Test: bright Emerald (#00D9B6) on White ≈ 1.7:1 ❌ (accent / fill only, never text on light)
- Test: Emerald-deep (#06746d) on White = 5.21:1 ✅ (use this for accent text/links on light)
- Test: Ink on Emerald fill = AAA ✅ (CTA pattern)
- Test: dark-card-body on Ink = ~14:1 ✅

### Visual Hierarchy
- Clear heading levels (don't skip)
- Adequate spacing between sections
- Logical reading order

### Focus Indicators
- Visible on all interactive elements
- Emerald ring (2px) with 2px offset
- Never remove focus styles

### Dark Background Rules
- Use `.dark-cta-card` class for dark cards
- Use `text-dark-card-*` utilities for manual control
- Never use opacity variants (`text-white/80`)

---

## Navbar-Aware Positioning

### CSS Variables
```css
--navbar-height:    4rem;     /* 64px - mobile */
--navbar-height-sm: 4.5rem;   /* 72px - small screens */
--navbar-height-md: 5rem;     /* 80px - medium+ */
```

### Sheet/Drawer Positioning
```css
.sheet-navbar-aware {
  top: var(--navbar-height) !important;
  height: calc(100dvh - var(--navbar-height)) !important;
}
```

---

---

## Homepage Visual Patterns

### Homepage scroll

The homepage was rebuilt for the 2026-08-12 one-Sprint pivot. It is now a single-file page with no separate per-section components; every block below is inline JSX in `src/pages/Index.tsx`, the authoritative source.

| Block | Visual treatment |
|-------|------------------|
| 1. Navigation (`Navigation.tsx`) | Fixed top, "The Sprint" / "Results" links, Mindmaker Live pill (external), emerald "Book a fit call" (`BookFitCall`), hides on scroll-down |
| 2. Hero | Dark ink section, looping `/rising-cities.mp4` background at 16% opacity, gradient overlay, eyebrow "Krish Raja's commercial decision practice", h1 "Make the right call as AI changes your business.", `BookFitCall` + secondary link "See the 21-day Sprint" → `/sprint`, stage photos with a "17+ years" stat card |
| 3. Attendee reach | "Mindmaker has helped over 4000 leaders..." heading + 3-column attendee logo grid (`attendeeBrands` from `src/data/rebuildProof.ts`) |
| 4. When to call Mindmaker | Two `editorial-card` panels: faster startups taking the market; growth blocked by product/price/position/team |
| 5. The Sprint | Dark ink section (`id="work-with-me"`), "One decision. 21 days.", `BookFitCall`, four-item decision grid (Product / Price / Go to market / Company), three-item outcome checklist, link to `/sprint` |
| 6. CTRL demo | `CtrlDemoVideo`, "You keep the thinking, not just the answer.", consent-gated Steph Darmanin quote |
| 7. Client results | First 4 of `clientStories` (`src/data/rebuildProof.ts`) in a horizontal snap-scroll row, link to `/case-studies` |
| 8. Why Krish | Krish headshot, bio copy, Ashley Wales-Brown testimonial |
| 9. Final CTA | Dark ink, "One hard decision. One clear place to start.", `BookFitCall` |
| 10. Footer | `Footer.tsx` |

### Global overlays (above-scroll)

Mounted in `src/App.tsx`: only `CookieConsent`. `DiagnosisRoom`, `ScopingModal`, and `InitialConsultModal` are paused and not imported anywhere in the active route tree; do not describe any of them as a mounted conversion surface.

### `/sprint`, `/operator`, and `/case-studies` page structure

Each is its own single-file page (`src/pages/Sprint.tsx`, `Operator.tsx`, `CaseStudies.tsx`), not a shared template. In outline:
- `/sprint`: dark hero with `BookFitCall` and a "what you bring" glass panel, a 4-step "how the 21 days work" grid, a "what you leave with" checklist, a good-fit / not-a-good-fit two-column block, dark final CTA.
- `/operator`: dark hero (headshot + "How Mindmaker works behind the scenes"), `CtrlDemoVideo` thesis section, a static 5-group/14-agent architecture grid, four numbered "extractable lessons" cards, a stage-photo carousel, closing `BookFitCall`.
- `/case-studies`: header, 2-column `clientStories` grid, consent-gated Steph Darmanin quote block, career-references grid (`careerReferences`), closing `BookFitCall`.

No page on the current route tree carries a public price or a `CurrencySwitcher`.

### Retired visual patterns (do not build)

- `DiagnosisRoom` / `openDiagnosisRoom`, `ScopingModal` / `openScopingModal`, `InitialConsultModal` / `openConsultModal`, all paused and unmounted
- Framework Journey (`FrameworkJourney.tsx`), Operator's Edge v5 (`OperatorsEdge.tsx`), Big Problem (`BigProblem.tsx`), Trust Anchor (`TrustSection.tsx`), Mindmaker LIVE section (`MindMakerLiveSection.tsx`), Simple CTA (`SimpleCTA.tsx`), all unmounted from the homepage
- Live Intel dashboard (`PriceTicker.tsx`, `OperatorsBrief.tsx`, `Brief.tsx`, WATCH/SKIP/CALL/TAKE taxonomy). `/signal` now redirects externally to Mindmaker Live (`https://live.themindmaker.ai`); there is no in-site Live Intel surface
- `/cohort`, `/enterprise`, `/capital`, `/immersion`, `/teardown`, `/handover` page structure (priced offer pages, `CurrencySwitcher` next to the price). All now redirect to `/sprint`
- Builder/Orchestrator fork (`TheProblem.tsx`), unmounted
- 4-Week / 90-Day sprint chooser (`ProductLadder.tsx`), unmounted
- Homepage Y-Fork (`YFork.tsx`) "Start where your question actually is." three intent cards, in `src/_archive/components/`
- Pre-Call Qualifier floating pill (`PreCallQualifier.tsx`), in `src/_archive/components/`
- AI News Ticker (`AINewsTicker.tsx`) with SIGNAL/NOISE/DECISION/TAKE badges
- ActionsHub side drawer, unmounted
- `"What's your nervous decision?"` and plain `"Book a call"` as the primary CTA label. The primary label is **"Book a fit call"** (`src/components/BookFitCall.tsx`)
- Engine Room / mm-ctrl agent visualization, never built for homepage per CLAUDE.md guardrails

---

**End of VISUAL_GUIDELINES**
