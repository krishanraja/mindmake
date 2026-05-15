# Design System

**Last Updated:** 2026-04-26

---

## Color System

### Primary Palette
```
Ink:  #0e1a2b (HSL: 210 58% 11%)  - Main structure, typography
Mint: #7ef4c2 (HSL: 158 82% 73%) - Highlights, sparingly
```

### Ink Variations
```
ink-900:  HSL 210 58% 8%   - Darkest ink for depth
ink-800:  HSL 210 58% 11%  - Current ink (default)
ink-700:  HSL 210 58% 15%  - Lighter ink
ink-50:   HSL 210 58% 98%  - Lightest ink tint
```

### Mint Variations
```
mint-900: HSL 158 60% 35%  - Darker mint (text on light backgrounds)
mint-500: HSL 158 82% 73%  - Current mint (default)
mint-300: HSL 158 82% 85%  - Lighter mint
mint-50:  HSL 158 82% 97%  - Subtle mint tint
```

### Neutrals
```
Off-White:   #F7F7F5 (HSL: 60 9% 96%)  - Background
Light Grey:  #E5E5E3 (HSL: 60 5% 90%)  - Borders
Mid Grey:    #9AA0A6 (HSL: 210 7% 62%) - Secondary text
Graphite:    #333639 (HSL: 200 5% 21%) - Strong text
```

### Dark Card Text Colors (WCAG AA Compliant)
```
--dark-card-heading: 0 0% 100%   - Pure white for headings
--dark-card-body:    0 0% 93%    - Off-white for body text
--dark-card-muted:   0 0% 75%    - Softer white for metadata
```

### Semantic Mappings
```css
--background: var(--off-white)
--foreground: var(--ink)
--muted: var(--light-grey)
--muted-foreground: var(--mid-grey)
--primary: var(--ink)
--accent: var(--mint)
--ring: var(--mint)
```

---

## Typography

### Font Families (2026 Modern System)
```
Primary (Sans): 'Inter Variable' - Body text, UI elements, all non-display content
Display:        'Space Grotesk Variable' - Headlines (h1-h6), hero text, display elements
```

**Font Stack:**
- **Sans:** `'Inter Variable', 'Inter', system-ui, -apple-system, sans-serif`
- **Display:** `'Space Grotesk Variable', 'Space Grotesk', 'Inter Variable', 'Inter', system-ui, sans-serif`

### Typography Scale (Fluid & Responsive)

```
Display (h1):   clamp(2.5rem, 5vw, 4.5rem)    | 40-72px  | weight 700 | line-height 1.1 | letter-spacing -0.03em
Heading 2:      clamp(2rem, 4vw, 3rem)         | 32-48px  | weight 600 | line-height 1.2 | letter-spacing -0.02em
Heading 3:      clamp(1.5rem, 3vw, 1.875rem)   | 24-30px  | weight 600 | line-height 1.3 | letter-spacing -0.01em
Heading 4-6:    clamp(1.25rem, 2.5vw, 1.5rem)  | 20-24px  | weight 600 | line-height 1.4 | letter-spacing -0.01em
Body Large:     clamp(1.125rem, 2vw, 1.25rem)  | 18-20px  | weight 400 | line-height 1.6
Body:           16px                            | 16px     | weight 400 | line-height 1.6
Body Small:     14px                            | 14px     | weight 400 | line-height 1.5
Caption:        12px                            | 12px     | weight 400 | line-height 1.4
```

### Usage Rules
- **Space Grotesk Variable:** All headings (h1-h6), hero text, display elements
- **Inter Variable:** Body text, UI elements, buttons, forms, all non-heading content
- **Line Heights:** 1.6 for body text, 1.1-1.4 for headings (tighter for larger sizes)
- **Letter Spacing:** Negative spacing for headings (-0.01em to -0.03em), normal for body
- **Font Features:** Inter Variable uses OpenType features (cv02, cv03, cv04, cv11) for improved readability
- **Font Smoothing:** Antialiased rendering enabled for crisp text on all displays

### Tailwind Classes
```tsx
// Font families
className="font-sans"      // Inter Variable (default)
className="font-display"   // Space Grotesk Variable

// Typography utilities
className="text-base"      // 16px body text
className="p.large"        // 18-20px large body
className="caption"        // 12px caption text
```

### Hero Text Size (Special)
```css
/* Mobile: 24px */
.hero-text-size { font-size: 1.5rem; line-height: 1.2; }

/* Tablet (640px+): Fluid 24px-36px */
@media (min-width: 640px) { font-size: clamp(1.5rem, ..., 2.25rem); }

/* Desktop (1024px+): 36px */
@media (min-width: 1024px) { font-size: 2.25rem; }
```

---

## Spacing System

### Scale (Tailwind)
```
0.5  = 2px   (xs gaps)
1    = 4px   (tight spacing)
2    = 8px   (compact)
3    = 12px  (default gap)
4    = 16px  (comfortable)
6    = 24px  (section spacing)
8    = 32px  (large gaps)
12   = 48px  (section padding)
16   = 64px  (major sections)
20   = 80px  (hero padding)
```

### Section Padding CSS Variables
```css
--section-padding-sm: 3rem;   /* 48px */
--section-padding-md: 5rem;   /* 80px */
--section-padding-lg: 8rem;   /* 128px */
```

### Utility Classes
```
section-padding:    py-12 sm:py-16 md:py-24 lg:py-32 (sections)
container-width:    max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
touch-target:       min-h-[44px] (mobile buttons)
```

### Navbar Height Variables
```css
--navbar-height:    4rem;     /* 64px - mobile/default */
--navbar-height-sm: 4.5rem;   /* 72px - small screens */
--navbar-height-md: 5rem;     /* 80px - medium+ screens */
```

---

## Component Patterns

### Buttons

**Primary (Mint)**
```tsx
<Button className="bg-mint text-ink hover:bg-mint/90">
```

**Secondary (Ink)**
```tsx
<Button className="bg-ink text-white hover:bg-ink/90">
```

**Outline**
```tsx
<Button variant="outline" className="border-mint text-mint">
```

### Cards

**Glass Card** (glassmorphism effect)
```tsx
<div className="glass-card">
  // bg-white/70, backdrop-blur, subtle border
</div>
```

**Editorial Card** (default content cards)
```tsx
<div className="editorial-card">
  // Subtle mint tint + ink border
</div>
```

**Minimal Card** (standard content)
```tsx
<div className="minimal-card">
  // Clean and simple
</div>
```

**Accent Card** (with ink left border)
```tsx
<div className="accent-card">
  // Ink left border + mint top line
</div>
```

**Premium Card** (featured content)
```tsx
<div className="premium-card">
  // Strong mint presence, featured
</div>
```

**Dark CTA Card** (WCAG compliant dark background)
```tsx
<div className="dark-cta-card">
  <h2>Heading is white</h2>
  <p>Body text is high-contrast off-white</p>
</div>
```

### Modals/Dialogs
```tsx
<Dialog>
  <DialogContent className="sm:max-w-[520px]">
    // White bg, rounded-lg, shadow
  </DialogContent>
</Dialog>
```

### Navbar-Aware Sheets
```tsx
<SheetContent className="sheet-navbar-aware">
  // Positioned below navbar, doesn't overlap
</SheetContent>
```

---

## Animation System

### Keyframes
```css
fade-in-up:      opacity 0→1, translateY 20px→0 (0.6s)
fade-in-smooth:  opacity 0→1 (0.8s)
slide-up-refined: opacity 0→1, translateY 16px→0 (0.6s)
scale-in:        opacity 0→1, scale 0.96→1 (0.5s)
build-in:        opacity + scale + translateY (0.8s)
pulse-build:     scale 1→1.02→1 (2s infinite)
glow-pulse:      box-shadow pulse (3s infinite)
```

### Usage
```tsx
className="fade-in-up" style={{animationDelay: '0.1s'}}
className="fade-in-smooth"
className="slide-up-refined"
className="scale-in"
```

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

### Hover Effects (Desktop Only)
```css
.hover-lift {
  transition: transform 600ms ease, box-shadow 600ms ease;
}
@media (min-width: 48rem) {
  .hover-lift:hover { transform: scale(1.02) translateY(-2px); }
}
/* Disabled on mobile/touch */
```

---

## Shadow System

### Base Shadows
```css
--shadow-xs:  0 1px 2px hsl(var(--ink) / 0.05)
--shadow-sm:  0 2px 4px hsl(var(--ink) / 0.08)
--shadow-md:  0 4px 12px hsl(var(--ink) / 0.1)
--shadow-lg:  0 8px 24px hsl(var(--ink) / 0.12)
--shadow-xl:  0 16px 48px hsl(var(--ink) / 0.15)
--shadow-2xl: 0 24px 64px hsl(var(--ink) / 0.2)
```

### Colored Shadows (Mint)
```css
--shadow-mint-sm: 0 2px 8px hsl(var(--mint) / 0.15)
--shadow-mint-md: 0 4px 16px hsl(var(--mint) / 0.2)
--shadow-mint-lg: 0 8px 32px hsl(var(--mint) / 0.25)
```

---

## Responsive Breakpoints

```
sm:  640px  (mobile landscape)
md:  768px  (tablet)
lg:  1024px (desktop)
xl:  1280px (large desktop)
2xl: 1536px (extra large)
```

### Mobile-First Approach
Base styles = mobile, use `md:`, `lg:` for larger screens

---

## Layout Patterns

### Hero Section
```tsx
<section className="min-h-screen flex items-center bg-ink text-white">
  <div className="container-width">
    <h1 className="font-display text-5xl md:text-6xl font-bold">
```

### Content Section
```tsx
<section className="section-padding bg-background">
  <div className="container-width">
    <h2 className="font-display text-3xl md:text-4xl font-bold mb-8">
```

### Grid Layouts
```tsx
<div className="grid md:grid-cols-3 gap-6">
  // Mobile: 1 col, Tablet+: 3 cols
</div>
```

---

## Icon System

**Library:** Lucide React  
**Size:** `h-5 w-5` standard, `h-6 w-6` large  
**Color:** Inherit from parent

```tsx
import { ArrowRight, CheckCircle } from "lucide-react"
<CheckCircle className="h-5 w-5 text-mint" />
```

---

## Form Elements

### Input Fields
```tsx
<Input 
  className="border-input bg-background"
  placeholder="Your email"
/>
```

### Labels
```tsx
<Label className="text-sm font-semibold">
```

### Radio Groups
```tsx
<RadioGroup>
  <RadioGroupItem value="option" />
</RadioGroup>
```

---

## Accessibility

### Focus States
```css
focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
```

### ARIA Labels
```tsx
<button aria-label="Close dialog">
```

### Semantic HTML
Use `<main>`, `<section>`, `<nav>`, `<article>` appropriately

### Dark Card Contrast
Always use `.dark-cta-card` or `text-dark-card-*` utilities on dark backgrounds for WCAG AA compliance.

---

## Design Tokens Location

**File:** `src/index.css`  
**Config:** `tailwind.config.ts`

All colors, spacing, typography defined as CSS variables and Tailwind extensions.

**Never hardcode colors** - always use tokens:
- ✅ `bg-mint`, `text-ink`, `border-muted`
- ❌ `bg-[#7ef4c2]`, `text-[#0e1a2b]`

### Critical Contrast Rules

- **NEVER use `text-mint` on white/light backgrounds** - insufficient contrast
- **NEVER use `text-white/80` on dark backgrounds** - fails WCAG AA

**Mint usage:**
- ✅ Background color for CTAs (`bg-mint`)
- ✅ Text color on dark backgrounds (`text-mint` on `bg-ink`)
- ✅ Accent elements on dark surfaces
- ❌ Text on white/light backgrounds

**Dark background text:**
- ✅ Use `.dark-cta-card` class
- ✅ Use `text-dark-card-heading`, `text-dark-card-body`, `text-dark-card-muted`
- ❌ Use `text-white/80` or similar opacity variants

On white/light backgrounds, always use `text-foreground`, `text-ink`, or `text-muted-foreground`

---

## Voice Input Animations

### Voice Listening Pulse
```css
.voice-pulse { animation: voice-pulse 1.5s ease-in-out infinite; }
```

### Voice Button States
```css
.voice-button-active { /* Mint gradient with glow */ }
.voice-button-idle { /* Subtle ink background */ }
```

### Audio Wave Visualizer
```css
.voice-wave-bar { /* Staggered height animation */ }
```

---

---

## Brand-Specific Patterns

### CTA Buttons (Primary)
```tsx
<Button
  size="lg"
  className="bg-mint text-ink hover:bg-mint/90 font-semibold px-8 py-6 text-lg"
  onClick={() => window.dispatchEvent(new CustomEvent('openConsultModal'))}
>
  Book a call
</Button>
```

Primary CTA copy is always **"Book a call"**, no conditional labels. The previous `"What's your nervous decision?"` button copy has been retired. All CTAs open the global `InitialConsultModal` via the `openConsultModal` custom event.

### Y-Fork Cards (homepage 2-card layout)
Replaces the old `ProductLadder` 4-Week / 90-Day sprint chooser.

```tsx
<div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
  <div className="glass-card p-8 hover:border-mint/40 transition-all">
    <p className="text-xs tracking-widest text-muted-foreground">THE COHORT</p>
    <h3 className="text-3xl font-bold mb-2">Make your AI decisions with 15 other senior leaders.</h3>
    <p className="text-xl text-mint">$2,500 per seat</p>
  </div>
  <div className="glass-card p-8 hover:border-mint/40 transition-all">
    <p className="text-xs tracking-widest text-muted-foreground">ENTERPRISE</p>
    <h3 className="text-3xl font-bold mb-2">Your AI capabilities, translated into revenue.</h3>
    <p className="text-xl text-mint">From $15,000</p>
  </div>
</div>
```

### Framework Journey (Mind Set → Mind Map → Mind Make)
Three-panel layout with scroll-triggered animations. Each panel uses `glass-card` with animated content inside. See `FrameworkJourney.tsx`.

### Operator's Edge (v5)
Dark-bg typography-only section matching `FrameworkJourney` header scale exactly (`text-[1.35rem] sm:text-3xl md:text-4xl lg:text-5xl font-bold`). Partial-mint on the word "pattern" only, no drop-shadow glow. Three glass tiles (Architecture / Optimization / Memory). See `OperatorsEdge.tsx`.

**Guardrails:** no scrolling logs, no terminal aesthetics, no ASCII art, no interactive dashboards.

### Price Ticker
`PriceTicker.tsx`. CSS-marquee, no native scrollbar, pauses on hover, respects `prefers-reduced-motion`. Used on the homepage Live Intel teaser (`OperatorsBrief.tsx`) and on `/signal` (Live Intel dashboard, `Brief.tsx`).

### Maven pill (Cohort enrolment)
On `/cohort`, a small "Hosted on Maven" pill (`Cohort.tsx`) sits above the seat-reservation CTA. It uses `bg-muted/50 border border-border text-muted-foreground` styling, `rounded-full`, and an external-link icon. The pill and the primary CTA both link directly to `https://maven.com/mindmaker/the-ai-fluent-executive`.

### Nervous Decision Input
`nervous-decision/Input.tsx` renders compact (homepage teaser) or full (`/signal`) sizes. `nervous-decision/Artifact.tsx` renders the typed response.

### Retired component patterns (do not reference)

- `TheProblem.tsx` Builder/Orchestrator fork, replaced by `YFork` (AI leaders vs AI products)
- `ProductLadder.tsx` 4-Week vs 90-Day sprint chooser, replaced by `YFork`
- `AINewsTicker.tsx` with SIGNAL/NOISE/DECISION/TAKE badges, replaced by `OperatorsBrief` + full dashboard at `/signal` with WATCH/SKIP/CALL/TAKE taxonomy
- `ActionsHub` side drawer and Interactive decision tools, unmounted
- Media Easter Egg components (`VideoDrawer`, `AudioPlayer`, `ArtifactPreview`, `ExpandableQuote`), not in current homepage; kept in `src/components/MediaEasterEggs/` for possible future use

---

**End of DESIGN_SYSTEM**
