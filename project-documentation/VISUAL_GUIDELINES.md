# Visual Guidelines

**Last Updated:** 2026-03-03

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
    <h1 className="font-display">Large headline with <span className="text-mint">mint highlight</span></h1>
    <p>Supporting copy</p>
    <CTAs />
  </div>
</section>
```

### Visual Effects
- Particle/dot GIF background (20% opacity)
- Gradient overlays (dark to darker)
- Animated grid pattern
- Glowing orbs (mint, blurred, animated pulse)

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
background: subtle mint tint gradient
border: 2px solid ink/15
shadow: sm
hover: mint border, lift
```

**Use for:** Standard content grid items

### Minimal Card
```css
background: subtle mint tint
border: 2px solid ink/15
shadow: xs
```

**Use for:** Clean, simple content

### Accent Card
```css
background: off-white
border-left: 4px solid ink
border-top: 2px mint line
```

**Use for:** Callouts, important notes

### Premium Card (Featured)
```css
background: mint tint gradient
border: 2px solid mint/40
shadow: md + mint glow
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

### Primary CTA (Mint)
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

### Outline CTA
```tsx
<Button variant="outline" 
        className="border-mint text-mint hover:bg-mint/20">
```
**Use for:** Tertiary actions, "learn more"

---

## Typography Hierarchy

### Page Hierarchy
```
H1 (Hero):     clamp(40-72px) bold, Space Grotesk, mint accent
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
Hero headings:   text-white with mint <span>
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
Accent areas:        bg-mint/10 (10% mint tint)
```

### Border Usage
```
Default:         border-border (light grey)
Subtle:          border-border/50
Emphasized:      border-mint
Dark mode:       border-border (adjusted in dark mode)
```

---

## Interactive States

### Hover Effects (Desktop Only)
```css
Buttons:    scale-105, shadow increase
Cards:      scale-1.01, translateY(-2px), mint border
Links:      underline, mint color
Icons:      translateX(4px) for arrows
```

**Mobile:** Hover transforms disabled to save battery and prevent accidental triggers

### Focus States
```css
All interactive: ring-2 ring-mint ring-offset-2
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
- Mint color for positive actions
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
- Test: Mint on White = 1.9:1 ❌ (accent only, not text)
- Test: dark-card-body on Ink = ~14:1 ✅

### Visual Hierarchy
- Clear heading levels (don't skip)
- Adequate spacing between sections
- Logical reading order

### Focus Indicators
- Visible on all interactive elements
- Mint ring (2px) with 2px offset
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

## Brand Vision 11/10 Visual Patterns

### Homepage Scroll Experience (7 Blocks)

The homepage is a curated vertical scroll with these visual sections:

| Block | Component | Visual Treatment |
|-------|-----------|-----------------|
| 1. Hero | `NewHero.tsx` | Full-viewport, dark ink background, particle animation, rotating nervous decisions, mint CTA |
| 2. Framework Journey | `FrameworkJourney.tsx` | Three glass-card panels (Mind Set → Mind Map → Mind Make) with scroll-triggered animations |
| 3. Who Is This For | `TheProblem.tsx` | Builder vs Orchestrator fork — two-column glass cards with video panels |
| 4. Sprint Chooser | `ProductLadder.tsx` | 2-card grid (4-Week vs 90-Day), glass-card with mint accents |
| 5. Trust Anchor | `TrustSection.tsx` | Krish headshot (circular, mint border), bio, stats, testimonials |
| 6. News Ticker | `AINewsTicker.tsx` | Horizontal scroll, SIGNAL/NOISE/DECISION/TAKE color-coded badges |
| 7. Final CTA | `SimpleCTA.tsx` | Dark CTA card, "You've been pitched enough.", mint button |

### Media Easter Eggs — Visual Philosophy

Media is **discoverable**, not primary content. Users who explore get rewarded with richer content.

**VideoDrawer:** Slide-out from right edge, spring animation, dark overlay (bg-ink/90), close button top-right. Trigger: click (default) or hover.

**AudioPlayer:** Compact pill shape (60px collapsed → expanded with title). Fixed bottom-right or inline. Mint play button, glass-card background.

**ArtifactPreview:** Glass card with file icon, hover reveals image preview below. Click opens full-screen modal with dark overlay (bg-ink/95).

**ExpandableQuote:** Glass card with Quote icon (mint). Short quote on load, full quote on click. "Click to read more" hint in mint.

### Sprint Detail Pages — Visual Structure

Both sprint detail pages follow the same layout:
1. Full-width header with title + tagline (mint accent)
2. Glass-card arc section (weeks or months with numbered circles)
3. Example nervous decisions grid (2-column, bg-ink/5 cards with CheckCircle icons)
4. "What You Get" glass-card with CheckCircle list
5. Bottom CTA glass-card with "What's your nervous decision?" button

---

**End of VISUAL_GUIDELINES**
