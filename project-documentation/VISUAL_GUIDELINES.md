# Visual Guidelines

**Last Updated:** 2026-08-23

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

The homepage is a curated vertical scroll. Authoritative source: `src/pages/Index.tsx`. Only `Navigation.tsx` and `Footer.tsx` are separate reusable components, mounted at the top and bottom; every section in between is written inline as JSX blocks directly in `Index.tsx`, not composed from separate named section components.

Current section order in `Index.tsx`:

| Block | Visual treatment |
|-------|------------------|
| 1. Navigation (`Navigation.tsx`) | Fixed top nav with the "Book a fit call" CTA |
| 2. Hero | Full-viewport dark ink section, looping `/rising-cities.mp4` background at low opacity, headline "Make the right call as AI changes your business.", `BookFitCall` CTA plus a secondary link to `/sprint`, supporting stage photography and a "17+ years" stat card |
| 3. Attendee-brand strip | "Mindmaker has helped over 4000 leaders with what's next in AI." with a row of attendee logos from `attendeeBrands` (`src/data/rebuildProof.ts`) |
| 4. Problem framing | "The problem is commercial. AI has changed the answer." — two editorial cards on faster competitors and internal blockers |
| 5. Sprint pitch (`id="work-with-me"`) | Dark ink section, "One decision. 21 days.", the four decision types (Product / Price / Go to market / Company), a `BookFitCall` CTA, and a link to `/sprint` |
| 6. CTRL demo | `CtrlDemoVideo` component, "You keep the thinking, not just the answer.", with the Steph Darmanin quote shown only when consented testimonial data confirms it |
| 7. Client results carousel | Horizontal-scroll carousel of the first four `clientStories` from `src/data/rebuildProof.ts`, "Decisions that changed the work.", with a link to `/case-studies` |
| 8. Krish bio | Headshot, "Built in business, not in a slide deck.", bio copy, and an Ashley Wales-Brown testimonial |
| 9. Final CTA | Dark ink section, "One hard decision. One clear place to start.", `BookFitCall` CTA |
| 10. Footer (`Footer.tsx`) | |

### Global overlays (above-scroll)

Mounted in `src/App.tsx`: only `CookieConsent`, as a global overlay alongside `ErrorBoundary`, `Suspense`, and the route table. There is no `DiagnosisRoom`, `ScopingModal`, or `InitialConsultModal` mounted anywhere in the live app — the Diagnosis Room and homepage AI demonstration are paused and unmounted, and a second booking flow or gate before Calendly must not be reintroduced (see CLAUDE.md).

### Operator's Edge (v5): visual spec — historical, component dormant

`OperatorsEdge.tsx` is dormant and not mounted in the live route tree. The spec below is kept only as historical reference and must not be used to justify rebuilding the component:
- `WHO YOU'RE WORKING WITH` eyebrow
- Hairline top border
- Gradient background tonal shift
- Heading "Beyond *pattern* recognition" at exact `FrameworkJourney` scale: `text-[1.35rem] sm:text-3xl md:text-4xl lg:text-5xl font-bold`
- Partial-emerald treatment on "pattern" only, no drop-shadow glow
- Three glass tiles: Architecture / Optimization / Memory
- Primary CTA → `/enterprise#revenue-architecture`
- Secondary muted link → `/operator`

Guardrails (still active for any future dark credential section): no scrolling logs, no terminal aesthetics, no ASCII art, no interactive dashboards. Every claim passes the CMO-15-second test.

### Live Intel

Live Intel now lives entirely at the external `https://live.themindmaker.ai` (`MINDMAKER_LIVE_URL` in `src/lib/publicLinks.ts`). The internal `/signal` route in `src/App.tsx` is an `ExternalRedirect` straight to that URL; it is not an internal page and has no visual spec of its own to maintain here. `/builder-economy` redirects to the same external URL.

### `/cohort`, `/enterprise`, and `/immersion` — not live routes

These paths exist in `src/App.tsx` only as redirects to `/sprint` (part of the `ToSprint` catch-all group for the retired offer ladder). They are not live content pages and have no visual spec of their own; do not build or reference page structure for them.

### Retired visual patterns (do not build)

- Builder/Orchestrator fork (`TheProblem.tsx`), unmounted
- 4-Week / 90-Day sprint chooser (`ProductLadder.tsx`), unmounted
- Homepage Y-Fork (`YFork.tsx`) "Start where your question actually is." three intent cards. The homepage funnels into the single Sprint / fit-call journey; the component is in `src/_archive/components/`
- Pre-Call Qualifier floating pill (`PreCallQualifier.tsx`), in `src/_archive/components/`
- AI News Ticker (`AINewsTicker.tsx`) with SIGNAL/NOISE/DECISION/TAKE badges
- ActionsHub side drawer, unmounted
- Engine Room / mm-ctrl agent visualization, never built for homepage per CLAUDE.md guardrails
- `NewHero.tsx`, `BigProblem.tsx`, `TrustSection.tsx`, `FrameworkJourney.tsx`, `OperatorsEdge.tsx`, `OperatorsBrief.tsx`, dormant; `Index.tsx` now writes its sections inline rather than composing from these
- `ScopingModal.tsx`, `InitialConsultModal.tsx`, `TwoDoors.tsx`, `PriceTicker.tsx`, `CurrencySwitcher.tsx`, dormant
- `src/components/diagnosis/` directory, dormant; the Diagnosis Room is paused and unmounted
- Any second booking flow, sales modal, or AI gate before Calendly. "Book a fit call" (via `BookFitCall.tsx`, direct to Calendly) is the one correct, current primary CTA label everywhere in this file — earlier "Book a call" copy samples above are superseded

---

**End of VISUAL_GUIDELINES**
