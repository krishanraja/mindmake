# CLAUDE.md  - Mindmaker Brand Vision 11/10 Implementation Guide

**Version:** 1.0  
**Created:** 2026-02-20  
**Purpose:** Complete transformation instructions for repositioning Mindmaker.ai per the 11/10 brand vision  
**Execution Model:** Claude Code (Sonnet or Opus for strategic decisions)  

---

## 🎯 MISSION

Transform Mindmaker from "professional AI advisory site" to "the anti-consultancy for leaders who are done being sold AI and ready to use it." The site should feel like your most cynical, knowledgeable friend who runs AI transformation every day  - premium through substance, not stiffness.

**Brand North Star:** If Stripe's design sensibility met Anthony Bourdain's authenticity.

---

## 🚫 NON-NEGOTIABLES (DO NOT TOUCH)

These are working well and embody the brand energy. Leave them untouched:

### Visual Systems
- ✅ **NewHero particle animation & effects** (`/src/components/NewHero.tsx`)
- ✅ **ParticleBackground** (`/src/components/Animations/ParticleBackground.tsx`)
- ✅ **Glass card system** (`.glass-card`, `.editorial-card`)
- ✅ **Scroll hijack mechanics** (smooth scroll, sections snapping)
- ✅ **AI News Ticker** (`/src/components/AINewsTicker.tsx`)  - EVOLVE prompt (see section below)
- ✅ **InitialConsultModal**  - single conversion path (good pattern)
- ✅ **Testimonials structure** in TrustSection

### Technical Infrastructure
- ✅ **ChatBot** (Vertex AI RAG + Gemini)  - REBRAND only (see section below)
- ✅ **Edge functions** (lead enrichment, email)
- ✅ **Supabase setup**
- ✅ **Design system** (colors, spacing, typography)

### Colors (WCAG Rule)
- **CRITICAL:** Never use `text-mint` on white/light backgrounds
- Always use `text-foreground`/`text-ink` on light backgrounds
- Use `text-dark-card-*` utilities on dark backgrounds
- Mint (#7ef4c2) for highlights/CTAs ONLY

---

## 🔄 TRANSFORMATION ARCHITECTURE

### Phase 1: Core Positioning & Copy (Priority)
1. **Framework Language**  - Mind Set → Mind Map → Mind Make everywhere
2. **Product Simplification**  - Remove complexity, focus on 2 core offerings
3. **Voice Evolution**  - Corporate → Confident + Cynical + Helpful
4. **CTA Language**  - "What's your nervous decision?" everywhere

### Phase 2: Homepage Scroll Redesign
5. **Block 1:** Hero (evolve rotating headlines to nervous decisions)
6. **Block 2:** Framework Performance (Mind Set → Mind Map → Mind Make visual journey)
7. **Block 3:** Builder/Orchestrator Fork (who is this for)
8. **Block 4:** Sprint Chooser (4-week vs 90-day)
9. **Block 5:** Trust Anchor (proof + testimonials)
10. **Block 6:** News Ticker (already exists, evolve LLM prompt)
11. **Block 7:** Final CTA

### Phase 3: Product Pages
12. **4-Week Sprint detail page** (new)
13. **90-Day Sprint detail page** (new)
14. **Diagnostic rebrand** (Leadership Benchmark → Decision Readiness Diagnostic)

### Phase 4: Media Easter Eggs (WHEN KRISH PROVIDES ASSETS)
15. **Video embed components** (Framer Motion slide-out drawers)
16. **Audio player components** (expandable elements)
17. **Artifact preview components** (hover reveals)

### Phase 5: Cleanup & Routing
18. **Kill dead pages** (builder-session, leadership-lab public pages)
19. **Update navigation**
20. **Add redirects**

---

## 📝 SECTION-BY-SECTION INSTRUCTIONS

---

## BLOCK 1: HERO EVOLUTION

**File:** `/src/components/NewHero.tsx`

### Current State
Rotating headlines like "Boss the boardroom with AI" + static line "AI literacy"

### New State
Rotate through **nervous decisions** instead of benefits. Show the anxiety, not the solution.

### Exact Copy Changes

**Replace the `heroVariants` array with:**

```typescript
const heroVariants = [
  "Everyone's talking about AI. I still haven't decided.",
  "I've been pitched 14 tools this quarter. I use none of them.",
  "My board wants an AI strategy. I don't know where to start.",
  "I'm either building the future or being replaced by it.",
  "Should we build our own AI tools or buy off the shelf?",
  "Which vendors do we actually commit to?",
  "How do I multiply my strongest edge with AI?",
  "Everyone on my team is using different tools. It's chaos.",
  "How do I know if AI is delivering ROI or just hype?",
  "I'm nervous about vendor lock-in but scared to build.",
  "My team is resisting AI and I don't know how to lead them.",
  "I feel like I should understand this but I don't.",
];
```

**Below the rotating text, update the static headline:**

```typescript
<h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-mint">
  Boss the boardroom confidently.
</h2>
```

**Update the subheadline paragraph:**

```typescript
<p className="text-xl sm:text-2xl md:text-3xl text-white/90 max-w-3xl">
  Mindmaker is a 1:1 sprint that turns AI chaos into calm, clear, executable direction. 
  No training. No decks. No demos. Just decisions.
</p>
```

**Update the CTA button text:**

```typescript
<Button 
  size="lg"
  onClick={() => setConsultModalOpen(true)}
  className="bg-mint text-ink hover:bg-mint/90 font-semibold px-8 py-6 text-lg"
>
  What's your nervous decision?
</Button>
```

### Technical Notes
- Keep all animation logic unchanged
- Keep particle effects unchanged
- Keep gradient backgrounds unchanged
- Only change the copy content

---

## BLOCK 2: FRAMEWORK PERFORMANCE (NEW SECTION)

**Create new component:** `/src/components/FrameworkJourney.tsx`

This replaces the current "ChaosToClarity" section with a visual performance of Mind Set → Mind Map → Mind Make.

### Component Spec

```typescript
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/**
 * FrameworkJourney
 * 
 * Visual performance of Mind Set → Mind Map → Mind Make
 * Three panels that animate as user scrolls
 * 
 * Design Philosophy: SHOW don't TELL
 * - Mind Set: Chaos compresses into filtered clarity
 * - Mind Map: System diagram assembles itself
 * - Mind Make: Board-ready doc materializes
 */

const FrameworkJourney = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-width">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Mind Set → Mind Map → Mind Make
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            This isn't a framework slide. It's how you actually move from anxiety to action.
          </p>
        </div>

        {/* Three Panels */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Panel 1: Mind Set */}
          <MindSetPanel />
          
          {/* Panel 2: Mind Map */}
          <MindMapPanel />
          
          {/* Panel 3: Mind Make */}
          <MindMakePanel />
          
        </div>
      </div>
    </section>
  );
};

const MindSetPanel = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="glass-card p-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Clarity</h3>
        <p className="text-sm text-muted-foreground">Mind Set</p>
      </div>
      
      <p className="text-lg mb-8">
        Cut the noise. Know what matters.
      </p>

      {/* Animation: Chaos compressing into clarity */}
      <div className="relative h-48 overflow-hidden rounded-lg bg-ink/5">
        <motion.div
          initial={{ opacity: 1, scale: 2, rotate: -5 }}
          animate={isInView ? { opacity: 0.1, scale: 0.5, rotate: 0 } : {}}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 flex flex-wrap gap-2 p-4"
        >
          {/* Simulated chaos: scattered "tools" */}
          {["GPT-4", "Claude", "Copilot", "Gemini", "Vendor A", "Tool B", "Platform C", "API D"].map((item, i) => (
            <span key={i} className="px-2 py-1 bg-mint/20 text-xs rounded">
              {item}
            </span>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-mint">3</div>
            <div className="text-sm text-muted-foreground">Decisions That Matter</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const MindMapPanel = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="glass-card p-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Leverage</h3>
        <p className="text-sm text-muted-foreground">Mind Map</p>
      </div>
      
      <p className="text-lg mb-8">
        Build your edge. Multiply what you're good at.
      </p>

      {/* Animation: System assembling */}
      <div className="relative h-48 overflow-hidden rounded-lg bg-ink/5 flex items-center justify-center">
        <svg width="100%" height="100%" viewBox="0 0 200 150">
          {/* Nodes assembling */}
          <motion.circle
            cx="100" cy="30"
            r="8"
            fill="#7ef4c2"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
          />
          <motion.circle
            cx="50" cy="90"
            r="8"
            fill="#7ef4c2"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.4 }}
          />
          <motion.circle
            cx="150" cy="90"
            r="8"
            fill="#7ef4c2"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.6 }}
          />
          <motion.circle
            cx="100" cy="120"
            r="8"
            fill="#7ef4c2"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.8 }}
          />
          
          {/* Connections appearing */}
          <motion.line
            x1="100" y1="30" x2="50" y2="90"
            stroke="#7ef4c2"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 0.6 } : {}}
            transition={{ delay: 0.5, duration: 0.5 }}
          />
          <motion.line
            x1="100" y1="30" x2="150" y2="90"
            stroke="#7ef4c2"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 0.6 } : {}}
            transition={{ delay: 0.7, duration: 0.5 }}
          />
          <motion.line
            x1="50" y1="90" x2="100" y2="120"
            stroke="#7ef4c2"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 0.6 } : {}}
            transition={{ delay: 0.9, duration: 0.5 }}
          />
          <motion.line
            x1="150" y1="90" x2="100" y2="120"
            stroke="#7ef4c2"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 0.6 } : {}}
            transition={{ delay: 0.9, duration: 0.5 }}
          />
        </svg>
      </div>
    </div>
  );
};

const MindMakePanel = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="glass-card p-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Direction</h3>
        <p className="text-sm text-muted-foreground">Mind Make</p>
      </div>
      
      <p className="text-lg mb-8">
        Decide. Ship. Measure.
      </p>

      {/* Animation: Document materializing */}
      <div className="relative h-48 overflow-hidden rounded-lg bg-ink/5 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="space-y-2"
        >
          <div className="h-3 bg-mint/40 rounded w-3/4"></div>
          <div className="h-3 bg-mint/30 rounded w-full"></div>
          <div className="h-3 bg-mint/30 rounded w-5/6"></div>
          <div className="h-1 bg-ink/10 rounded my-4"></div>
          <div className="flex gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 0.8 }}
              className="flex-1"
            >
              <div className="text-xs text-muted-foreground">ROI</div>
              <div className="text-2xl font-bold text-mint">12hrs</div>
              <div className="text-xs text-muted-foreground">saved/week</div>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 1.0 }}
              className="flex-1"
            >
              <div className="text-xs text-muted-foreground">Cost</div>
              <div className="text-2xl font-bold text-mint">$3K</div>
              <div className="text-xs text-muted-foreground">to build</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FrameworkJourney;
```

### Integration

**In `/src/pages/Index.tsx`, replace:**

```typescript
{/* Chaos to Clarity Animation */}
<div id="problem">
  <ChaosToClarity />
</div>
```

**With:**

```typescript
{/* Framework Journey - Mind Set → Mind Map → Mind Make */}
<div id="framework">
  <FrameworkJourney />
</div>
```

---

## BLOCK 3: WHO IS THIS FOR (BUILDER/ORCHESTRATOR FORK)

**File:** `/src/components/TheProblem.tsx`

### Current State
"Who does Mindmaker help?" with video panels showing problem/opportunity

### New State
Clearer Builder vs Orchestrator split with updated copy

### Copy Changes

**Update the section header:**

```typescript
<h2 className="text-4xl md:text-5xl font-bold mb-6">
  Who Is This For?
</h2>
<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
  Two paths. Both start with clarity. Both end with decisions that stick.
</p>
```

**Update panel copy (if not using videos, use text cards):**

**Builder Panel:**
```typescript
headline: "You want to build alongside AI."
body: "Prototype. Ship. Create leverage. You're not waiting for permission  - you're looking for the fastest path from idea to working system."
```

**Orchestrator Panel:**
```typescript
headline: "You want to set standards and make clean decisions."
body: "Design how your organization uses AI without getting buried in technical details. You delegate execution but own outcomes."
```

**Both panels should end with:**
```typescript
"Both paths start with Mind Set. Both end with decisions that stick."
```

### Design Note
Keep the video panel interaction if it exists. If videos aren't available yet, use glass cards with the copy above.

---

## BLOCK 4: SPRINT CHOOSER (PRODUCT LADDER EVOLUTION)

**File:** `/src/components/ProductLadder.tsx`

This is the most significant change. We're simplifying from 6+ offerings to 2 core products + 1 extension.

### Current State
Complex ladder with Build/Orchestrate paths, 1hr/4wk/90d options, team options

### New State
- **4-Week Sprint** (one decision, four weeks, board-ready)
- **90-Day Sprint** (full journey: Mind Set → Mind Map → Mind Make)
- **Extended Sprint** (6-month continuation, mentioned as option on 90-day page)

### Product Copy

**Remove:** All the complex path selection UI

**Replace with:** Simple 2-card layout

```typescript
const offerings = [
  {
    name: "4-Week Sprint",
    tagline: "One decision. Four weeks. Board-ready.",
    duration: "4 weeks",
    description: "You have a nervous decision about AI. We help you make it with confidence. Week 1: clarity. Week 2: options. Week 3: decision. Week 4: board-ready memo.",
    outcomes: [
      "One clear, defensible decision",
      "Trade-off analysis you can explain",
      "Board-ready decision memo",
      "ROI framework to measure success"
    ],
    examples: [
      "Which vendors do we commit to?",
      "What should I build vs buy?",
      "How do I multiply my strongest edge?",
      "What's my AI boundary?"
    ],
    cta: "Start 4-Week Sprint",
    route: "/sprint/4-week",
    intensity: "Focused",
    price: "TBD" // Will be added when pricing finalized
  },
  {
    name: "90-Day Sprint",
    tagline: "The full journey. Mind Set → Mind Map → Mind Make.",
    duration: "90 days",
    description: "Three decisions. Three months. Complete transformation from AI chaos to calm, clear direction. Month 1: Mind Set (clarity). Month 2: Mind Map (systems). Month 3: Mind Make (deployment).",
    outcomes: [
      "3-5 deployed AI systems",
      "2-3 strategic decisions resolved",
      "12-month roadmap with clear gates",
      "Board-level confidence on AI"
    ],
    examples: [
      "Full AI governance framework",
      "Multiple working systems deployed",
      "Team alignment on AI standards",
      "Vendor landscape clarity"
    ],
    cta: "Start 90-Day Sprint",
    route: "/sprint/90-day",
    intensity: "Deep",
    price: "TBD"
  }
];
```

### Visual Treatment

**Use cards with emotional arc visualization:**

For 4-Week Sprint, show the emotional journey:
```
Week 1: Relief (finally addressing this)
Week 2: Momentum (seeing options clearly)
Week 3: Confidence (decision made, defensible)
Week 4: Calm (board-ready, done)
```

For 90-Day Sprint, show the three-month arc:
```
Month 1: Clarity (Mind Set - what matters)
Month 2: Leverage (Mind Map - systems built)
Month 3: Direction (Mind Make - deployed & measured)
```

### Implementation

Replace the entire complex state machine in ProductLadder with a simple two-card grid:

```typescript
<div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
  {offerings.map((offering) => (
    <SprintCard key={offering.name} {...offering} />
  ))}
</div>
```

**SprintCard component:**

```typescript
const SprintCard = ({ name, tagline, duration, description, outcomes, examples, cta, route }: any) => {
  const navigate = useNavigate();
  
  return (
    <div className="glass-card p-8 hover:border-mint/40 transition-all">
      <div className="mb-6">
        <h3 className="text-3xl font-bold mb-2">{name}</h3>
        <p className="text-xl text-mint">{tagline}</p>
        <p className="text-sm text-muted-foreground mt-2">{duration}</p>
      </div>
      
      <p className="text-lg mb-6">{description}</p>
      
      <div className="mb-6">
        <h4 className="font-semibold mb-3">What You Get:</h4>
        <ul className="space-y-2">
          {outcomes.map((outcome, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-mint shrink-0 mt-0.5" />
              <span>{outcome}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-8">
        <h4 className="font-semibold mb-3">Example Nervous Decisions:</h4>
        <div className="space-y-1 text-sm text-muted-foreground">
          {examples.map((ex, i) => (
            <div key={i}>• {ex}</div>
          ))}
        </div>
      </div>
      
      <Button
        size="lg"
        className="w-full bg-mint text-ink hover:bg-mint/90"
        onClick={() => navigate(route)}
      >
        {cta}
      </Button>
    </div>
  );
};
```

### Remove These Products
- ❌ Builder Session (1hr)
- ❌ Leadership Lab (team offering - demoted, mentioned only post-engagement)
- ❌ Portfolio Partner (by referral only, no public page)
- ❌ All the 1hr/4wk/90d slider complexity

Keep it simple: **4-Week** or **90-Day**. That's it.

---

## BLOCK 5: TRUST ANCHOR (PROOF SECTION)

**File:** `/src/components/TrustSection.tsx`

### Current State
Stats + testimonials

### New State
Enhanced with Krish's photo + short bio + real testimonials

### Copy Updates

**Add a new "About Krish" section at the top:**

```typescript
<div className="max-w-3xl mx-auto mb-16 text-center">
  <div className="flex justify-center mb-6">
    <img 
      src={krishHeadshot} 
      alt="Krish Raja" 
      className="w-32 h-32 rounded-full border-4 border-mint/20"
    />
  </div>
  
  <p className="text-lg leading-relaxed">
    I run AI transformation for businesses 100x your size during the day. I build products with AI every night. 
    I've spent 16 years in data and tech, including Microsoft and Harvard Business School. I'm not going to sell 
    you a tool or a framework slide. I'm going to help you make the decisions you've been avoiding  - and feel good about them.
  </p>
</div>
```

**Update testimonials section header:**

```typescript
<h3 className="text-2xl font-bold mb-8">What Leaders Say</h3>
```

**Replace placeholder testimonials with real ones when available** (from action items doc):

```typescript
const testimonials = [
  {
    quote: "I stopped dreading board AI questions.",
    details: "Before the sprint, I was fielding questions about our AI strategy and honestly just making it up as I went. Krish helped me get clear on the 3 decisions that actually mattered for our product roadmap. Now when the board asks, I have real answers  - not theater.",
    name: "Sarah M.",
    title: "CPO, Series C SaaS Company"
  },
  {
    quote: "We went from 14 tools to 3 systems that actually work.",
    details: "Everyone on the team was experimenting with AI  - ChatGPT for this, Claude for that, some random automation tool someone saw on LinkedIn. It was chaos. The 4-week sprint forced us to decide: what's actually strategic, and what's just noise?",
    name: "Anonymous",
    title: "VP of Operations"
  },
  {
    quote: "I finally knew what to build versus buy.",
    details: "I'd been going in circles for 6 months  - do we build our own AI underwriting model or use a vendor API? Every conversation made it worse. Krish didn't give me a recommendation. He gave me the framework to decide for myself.",
    name: "Founder",
    title: "Early-Stage FinTech"
  }
];
```

---

## BLOCK 6: NEWS TICKER (LLM PROMPT EVOLUTION)

**File:** `/src/components/AINewsTicker.tsx` (frontend is fine)

**File to modify:** Edge function or hook that generates ticker headlines

### Current Prompt (Assumption)
Probably something like "Generate AI news headlines"

### New Prompt

The ticker should embody the **Mind Set** philosophy: filtering noise into signal.

**New LLM Prompt for Ticker Generation:**

```
You are Mindmaker's AI news filter. Your job is to take the day's AI news and categorize it through a cynical, experienced operator's lens.

For each news item, assign ONE category:

SIGNAL  - This actually matters for business leaders. Real impact, real decisions.
Example: "OpenAI releases GPT-5 with 10x context window" → SIGNAL: Long-context workflows just became viable

NOISE  - Ignore this. Hype, funding announcements, vendor marketing.
Example: "AI Startup Raises $50M Series B" → NOISE: Another AI company raising money

DECISION TRIGGER  - Act on this. Something changed that requires a decision.
Example: "Google announces Gemini API price cut by 40%" → DECISION TRIGGER: Time to reevaluate your LLM vendor costs

KRISH'S TAKE  - Opinion/analysis from Mindmaker's perspective.
Example: "Enterprise AI adoption hits 80%" → KRISH'S TAKE: 80% of companies using AI != 80% using it well

Voice: Confident, slightly cynical, deeply knowledgeable. Like a friend who works in AI every day and has seen it all.

Format each headline as: "[CATEGORY]: [Insight]"

Generate 10-15 headlines per day. Mix all 4 categories.
```

### Where to Update
Find the edge function or hook that calls the LLM for ticker generation and replace the system prompt with the above.

---

## BLOCK 7: SIMPLE CTA (FINAL CALL TO ACTION)

**File:** `/src/components/SimpleCTA.tsx`

### Current Copy
"Ready to future proof yourself for the next decade?"

### New Copy

```typescript
<h2 className="text-3xl md:text-4xl font-bold mb-6 text-dark-card-heading dark:text-foreground">
  You've been pitched enough.
</h2>

<p className="text-xl text-dark-card-body dark:text-foreground leading-relaxed mb-8">
  You've sat through enough demos. You've downloaded enough whitepapers. The only thing left is to make a decision.
  <span className="block mt-4 text-lg">Start with your first one.</span>
</p>

<Button 
  size="lg"
  className="bg-mint text-ink hover:bg-mint/90 font-semibold px-12 py-6 text-lg"
  onClick={() => setConsultModalOpen(true)}
>
  What's your nervous decision?
</Button>

<p className="text-sm text-dark-card-muted dark:text-muted-foreground mt-6">
  The first conversation is free. No prep required.
</p>
```

---

## 📄 NEW PAGES TO CREATE

---

## PAGE: 4-Week Sprint Detail

**File:** `/src/pages/Sprint4Week.tsx` (new file)

```typescript
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { InitialConsultModal } from "@/components/InitialConsultModal";
import { useState } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";

const Sprint4Week = () => {
  const [consultModalOpen, setConsultModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <section className="section-padding pt-32">
        <div className="container-width max-w-4xl">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              4-Week Sprint
            </h1>
            <p className="text-2xl text-mint mb-4">
              One decision. Four weeks. Board-ready.
            </p>
            <p className="text-xl text-muted-foreground">
              You have a nervous decision about AI. We help you make it with confidence.
            </p>
          </div>

          {/* The Arc */}
          <div className="glass-card p-8 mb-12">
            <h2 className="text-3xl font-bold mb-8">The Four-Week Arc</h2>
            
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-mint/20 flex items-center justify-center font-bold text-mint">
                    1
                  </div>
                  <h3 className="text-2xl font-semibold">Relief</h3>
                </div>
                <p className="ml-15 text-muted-foreground">
                  Week one: We name what you're actually anxious about. Not what the vendor deck says. 
                  Not what the board wants to hear. The real decision. You'll feel relief because you're 
                  finally addressing it directly.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-mint/20 flex items-center justify-center font-bold text-mint">
                    2
                  </div>
                  <h3 className="text-2xl font-semibold">Momentum</h3>
                </div>
                <p className="ml-15 text-muted-foreground">
                  Week two: We map your options. Build vs buy. Vendor A vs Vendor B. Do it now vs wait. 
                  Every path gets a trade-off analysis. No hand-waving. You'll see the decision clearly 
                  for the first time.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-mint/20 flex items-center justify-center font-bold text-mint">
                    3
                  </div>
                  <h3 className="text-2xl font-semibold">Confidence</h3>
                </div>
                <p className="ml-15 text-muted-foreground">
                  Week three: You make the call. We document why. Not a 40-slide deck  - a decision memo. 
                  One page. What you decided, why, what success looks like, what the risks are. Defensible. Real.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-mint/20 flex items-center justify-center font-bold text-mint">
                    4
                  </div>
                  <h3 className="text-2xl font-semibold">Calm</h3>
                </div>
                <p className="ml-15 text-muted-foreground">
                  Week four: Board-ready. You walk into that meeting with a one-pager that answers every 
                  question before it's asked. No theater. No anxiety. Just calm clarity.
                </p>
              </div>
            </div>
          </div>

          {/* Example Nervous Decisions */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Example Nervous Decisions</h2>
            <p className="text-lg text-muted-foreground mb-6">
              These are the kinds of decisions leaders bring to the 4-week sprint:
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Which vendors do we commit to?",
                "What should I build vs buy?",
                "How do I multiply my strongest edge with AI?",
                "What's my AI boundary for this year?",
                "Should we hire AI talent or train our team?",
                "How do I evaluate vendor promises vs reality?",
                "What's the right first AI project to build credibility?",
                "How do I prioritize 12 competing AI initiatives?"
              ].map((decision, i) => (
                <div key={i} className="flex items-start gap-2 p-4 rounded-lg bg-ink/5">
                  <CheckCircle className="w-5 h-5 text-mint shrink-0 mt-0.5" />
                  <span className="text-sm">{decision}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What You Get */}
          <div className="glass-card p-8 mb-12">
            <h2 className="text-3xl font-bold mb-6">What You Actually Get</h2>
            <ul className="space-y-4">
              {[
                "One clear, defensible decision on your biggest AI anxiety",
                "Trade-off analysis showing all options + why you picked yours",
                "Decision memo (1-2 pages, board-ready)",
                "ROI framework to measure success in 3/6/12 months",
                "Access to Krish for 4 weekly decision sessions (60 min each)",
                "Async support between sessions (email/Slack)"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-mint shrink-0 mt-0.5" />
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center glass-card p-12">
            <h2 className="text-3xl font-bold mb-4">
              What's your nervous decision?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              The first conversation is free. We'll figure out if this is the right sprint for you.
            </p>
            <Button
              size="lg"
              className="bg-mint text-ink hover:bg-mint/90 font-semibold px-12 py-6 text-lg"
              onClick={() => setConsultModalOpen(true)}
            >
              Start the Conversation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

        </div>
      </section>

      <Footer />
      
      <InitialConsultModal
        open={consultModalOpen}
        onOpenChange={setConsultModalOpen}
      />
    </main>
  );
};

export default Sprint4Week;
```

### Routing

**Add to `/src/App.tsx` or wherever routes are defined:**

```typescript
import Sprint4Week from "@/pages/Sprint4Week";

// In routes array:
{ path: "/sprint/4-week", element: <Sprint4Week /> }
```

---

## PAGE: 90-Day Sprint Detail

**File:** `/src/pages/Sprint90Day.tsx` (new file)

Similar structure to 4-Week Sprint but with:
- Three-month arc (Month 1: Mind Set, Month 2: Mind Map, Month 3: Mind Make)
- Different outcomes (3-5 systems deployed, 2-3 decisions, 12-month roadmap)
- Mention of "Extended Sprint" option at bottom (6-month continuation)

```typescript
// Similar to Sprint4Week.tsx but with these key differences:

const monthlyArc = [
  {
    month: 1,
    phase: "Mind Set",
    theme: "Clarity",
    description: "We identify the 2-3 decisions that will define your AI direction for the next year. No noise, no vendor theater  - just what actually matters for your business."
  },
  {
    month: 2,
    phase: "Mind Map",
    theme: "Leverage",
    description: "We build working systems around your actual workflows. Not demos, not proofs-of-concept  - real, deployed AI that multiplies your strongest capabilities."
  },
  {
    month: 3,
    phase: "Mind Make",
    theme: "Direction",
    description: "We measure, document, and prepare your board-ready narrative. You walk away with deployed systems, clear ROI, and a 12-month roadmap."
  }
];

const outcomes = [
  "3-5 deployed AI systems (working, measured, documented)",
  "2-3 strategic decisions resolved (with trade-off memos)",
  "12-month AI roadmap with clear gates and owners",
  "Board-level confidence (you can defend every decision)",
  "Team alignment on AI standards and boundaries",
  "Builder Dossier (all decisions, systems, and learnings in one place)"
];
```

**At the bottom, add:**

```typescript
<div className="glass-card p-8 mt-12">
  <h3 className="text-2xl font-bold mb-4">Need More Time?</h3>
  <p className="text-lg text-muted-foreground mb-4">
    Some leaders extend the 90-day sprint into a 6-month engagement for ongoing support 
    as they scale what they've built. We call this the <strong>Extended Sprint</strong>.
  </p>
  <p className="text-muted-foreground">
    This isn't a separate product  - it's a natural continuation. We'll discuss this option 
    in your initial conversation if it makes sense for your situation.
  </p>
</div>
```

### Routing

```typescript
{ path: "/sprint/90-day", element: <Sprint90Day /> }
```

---

## DIAGNOSTIC REBRAND

**File:** `/src/pages/LeadershipInsights.tsx`

### Current Name
"AI Leadership Benchmark"

### New Name
"Decision Readiness Diagnostic"

### Copy Changes

**Update all references:**
- "AI Leadership Benchmark" → "Decision Readiness Diagnostic"
- Focus: Not "how AI-literate are you" but "what are your nervous decisions"
- Output: Builder vs Orchestrator identification + top 3 nervous decisions + sprint recommendation

**Update intro copy:**

```typescript
<h1 className="text-5xl md:text-6xl font-bold mb-6">
  Decision Readiness Diagnostic
</h1>

<p className="text-xl text-muted-foreground max-w-2xl">
  Not another AI literacy quiz. This diagnostic identifies your nervous decisions, 
  determines if you're a Builder or Orchestrator, and recommends the right sprint.
</p>
```

**Update results screen to include:**
- Builder or Orchestrator identification
- Top 3 nervous decisions (from curated list based on their answers)
- Recommended sprint (4-week or 90-day)
- "Your Decision Readiness Score" with explanation

---

## CHATBOT REBRAND

**Files:** `/src/components/ChatBot/*`

### Current State
"Chat with Krish" or similar

### New State
"Ask Mindmaker"

### Changes

**Update ChatButton.tsx:**
```typescript
<Button>
  Ask Mindmaker
</Button>
```

**Update ChatPanel.tsx header:**
```typescript
<h2>Ask Mindmaker</h2>
<p className="text-sm text-muted-foreground">
  Trained on the Mind Set → Mind Map → Mind Make framework
</p>
```

**Update system prompt** (wherever the chatbot LLM is configured):

```
You are Mindmaker's AI assistant. You embody the brand voice: confident, slightly cynical, deeply helpful.

Your job is to:
1. Help visitors understand the Mind Set → Mind Map → Mind Make framework
2. Surface their nervous decisions about AI
3. Recommend the right sprint (4-week or 90-day)
4. Be honest  - if they don't need Mindmaker, say so

Voice guidelines:
- Not corporate. No "leverage" or "transformation" buzzwords.
- Not casual. You're premium, but through substance not stiffness.
- Confident. You've seen it all. You know what works.
- Helpful. You're here to serve, not to sell.

Example responses:
- "Sounds like you're nervous about vendor lock-in. That's a 4-week sprint decision."
- "You don't need AI training. You need to decide what to build vs buy."
- "Most people in your situation start with Mind Set  - getting clear on what actually matters."

You can also do a lightweight version of the Decision Readiness Diagnostic in conversation.
```

---

## 🗑️ PAGES TO REMOVE/DEMOTE

### Kill These Public Pages

**Delete files:**
- `/src/pages/BuilderSession.tsx` → Product removed
- `/src/pages/LeadershipLab.tsx` → Demoted (mentioned only, not a public product)
- `/src/pages/Portfolio*.tsx` → Demoted (by referral only)

**Update Navigation** to remove links to these pages.

**Add redirects** in your routing config:

```typescript
// Redirect old product pages to homepage
{ path: "/builder-session", element: <Navigate to="/" replace /> }
{ path: "/leadership-lab", element: <Navigate to="/" replace /> }
{ path: "/portfolio-program", element: <Navigate to="/" replace /> }
```

### Mention-Only Products

On the homepage, you can briefly mention these as "What Comes Next":

```typescript
<div className="text-center mt-16 p-8 glass-card">
  <h3 className="text-2xl font-bold mb-4">What Comes Next</h3>
  <p className="text-muted-foreground mb-4">
    After your sprint, some leaders bring their teams through the <strong>Leadership Lab</strong> 
    to build shared AI decision frameworks. Others engage as <strong>Portfolio Partners</strong> 
    for ongoing strategic support.
  </p>
  <p className="text-sm text-muted-foreground">
    These aren't public products. We'll discuss them if relevant after your sprint.
  </p>
</div>
```

---

## 🎨 MEDIA EASTER EGGS (WHEN ASSETS AVAILABLE)

This is the most important design philosophy from the brand vision: **Media should be discoverable easter eggs, not main content sections.**

---

## VIDEO EASTER EGG: "The Cynical AI Take"

**Where it goes:** Trust Anchor section (TrustSection.tsx), embedded near Krish's bio

**Design:** Slide-out drawer on hover/click

**Component:** `/src/components/MediaEasterEggs/VideoDrawer.tsx` (new file)

```typescript
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";

interface VideoDrawerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title: string;
  trigger?: "hover" | "click";
}

export const VideoDrawer = ({ 
  videoUrl, 
  thumbnailUrl, 
  title,
  trigger = "click" 
}: VideoDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const shouldOpen = trigger === "hover" ? isHovered : isOpen;

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => trigger === "hover" && setIsHovered(true)}
      onMouseLeave={() => trigger === "hover" && setIsHovered(false)}
    >
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative group"
      >
        {thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={title}
            className="w-full h-auto rounded-lg border-2 border-mint/20 group-hover:border-mint/60 transition-all"
          />
        ) : (
          <div className="w-full h-48 rounded-lg border-2 border-mint/20 group-hover:border-mint/60 transition-all flex items-center justify-center bg-ink/5">
            <Play className="w-12 h-12 text-mint" />
          </div>
        )}
        
        {/* Hover hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-ink/60 rounded-lg"
        >
          <div className="text-center text-white">
            <Play className="w-12 h-12 mx-auto mb-2" />
            <p className="text-sm font-medium">Watch Video</p>
          </div>
        </motion.div>
      </button>

      {/* Slide-out Drawer */}
      <AnimatePresence>
        {shouldOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative max-w-4xl w-full bg-background rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-ink/80 hover:bg-ink text-white"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Video */}
              <div className="aspect-video">
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full"
                >
                  Your browser does not support video playback.
                </video>
              </div>

              {/* Title */}
              <div className="p-6 bg-ink text-white">
                <h3 className="text-xl font-bold">{title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
```

**Usage in TrustSection.tsx:**

```typescript
import { VideoDrawer } from "@/components/MediaEasterEggs/VideoDrawer";

// In the "About Krish" section:
<div className="mt-8">
  <VideoDrawer
    videoUrl="/videos/cynical-ai-take.mp4"
    thumbnailUrl="/images/video-thumbnail.jpg"
    title="The Cynical AI Take"
  />
  <p className="text-sm text-muted-foreground mt-2 text-center">
    60 seconds on why most AI advice is garbage
  </p>
</div>
```

---

## AUDIO EASTER EGG: "Krish's Voice"

**Where it goes:** Blog posts, sprint detail pages (as optional enhancement)

**Design:** Expandable audio player in corner

**Component:** `/src/components/MediaEasterEggs/AudioPlayer.tsx` (new file)

```typescript
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Pause, Play } from "lucide-react";

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  position?: "bottom-right" | "inline";
}

export const AudioPlayer = ({ 
  audioUrl, 
  title,
  position = "bottom-right" 
}: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const positionClasses = position === "bottom-right" 
    ? "fixed bottom-8 right-8 z-40"
    : "relative";

  return (
    <motion.div
      className={positionClasses}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      onHoverStart={() => setIsExpanded(true)}
      onHoverEnd={() => setIsExpanded(false)}
    >
      <motion.div
        className="glass-card p-3 flex items-center gap-3 cursor-pointer"
        animate={{ width: isExpanded ? "auto" : "60px" }}
      >
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-mint/20 flex items-center justify-center hover:bg-mint/30 transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-mint" />
          ) : (
            <Play className="w-5 h-5 text-mint ml-0.5" />
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="flex items-center gap-2 whitespace-nowrap overflow-hidden"
            >
              <Volume2 className="w-4 h-4 text-mint" />
              <span className="text-sm font-medium">{title}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <audio ref={audioRef} src={audioUrl} />
    </motion.div>
  );
};
```

**Usage:**

```typescript
// In blog posts or sprint pages:
<AudioPlayer
  audioUrl="/audio/krish-why-mindmaker.mp3"
  title="Why I Built Mindmaker"
  position="inline"
/>
```

---

## ARTIFACT PREVIEW EASTER EGG

**Where it goes:** Sprint detail pages, "What You Get" sections

**Design:** Hover to reveal preview, click to expand full view

**Component:** `/src/components/MediaEasterEggs/ArtifactPreview.tsx` (new file)

```typescript
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Maximize2, X } from "lucide-react";

interface ArtifactPreviewProps {
  title: string;
  description: string;
  previewImage: string;
  fullImage?: string;
}

export const ArtifactPreview = ({ 
  title, 
  description, 
  previewImage,
  fullImage 
}: ArtifactPreviewProps) => {
  const [isFullView, setIsFullView] = useState(false);

  return (
    <>
      <motion.div
        className="glass-card p-6 cursor-pointer group"
        whileHover={{ scale: 1.02 }}
        onClick={() => setIsFullView(true)}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-mint/20 flex items-center justify-center shrink-0 group-hover:bg-mint/30 transition-colors">
            <FileText className="w-6 h-6 text-mint" />
          </div>
          
          <div className="flex-1">
            <h4 className="font-semibold mb-1 group-hover:text-mint transition-colors">
              {title}
            </h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          <Maximize2 className="w-5 h-5 text-muted-foreground group-hover:text-mint transition-colors" />
        </div>

        {/* Preview on hover */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          whileHover={{ opacity: 1, height: "auto" }}
          className="mt-4 overflow-hidden"
        >
          <img 
            src={previewImage} 
            alt={title}
            className="w-full rounded-lg border border-mint/20"
          />
          <p className="text-xs text-center text-muted-foreground mt-2">
            Click to view full artifact
          </p>
        </motion.div>
      </motion.div>

      {/* Full view modal */}
      <AnimatePresence>
        {isFullView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center p-8"
            onClick={() => setIsFullView(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsFullView(false)}
                className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-6 h-6" />
              </button>

              <img 
                src={fullImage || previewImage}
                alt={title}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              
              <div className="mt-6 text-center text-white">
                <h3 className="text-2xl font-bold mb-2">{title}</h3>
                <p className="text-white/70">{description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
```

**Usage in Sprint pages:**

```typescript
<div className="space-y-4">
  <h3 className="text-2xl font-bold mb-4">Real Artifacts from Past Sprints</h3>
  
  <ArtifactPreview
    title="Decision Memo"
    description="Example decision memo from a CPO's build-vs-buy decision"
    previewImage="/artifacts/decision-memo-preview.png"
    fullImage="/artifacts/decision-memo-full.png"
  />
  
  <ArtifactPreview
    title="Trade-Off Matrix"
    description="How we evaluated 3 vendor options for a fintech founder"
    previewImage="/artifacts/tradeoff-matrix-preview.png"
    fullImage="/artifacts/tradeoff-matrix-full.png"
  />
</div>
```

---

## 📊 QUOTES EASTER EGG (SUBTLE REVEAL)

**Where it goes:** Scattered throughout homepage scroll

**Design:** Expandable quote cards that reveal full context on hover/click

**Component:** `/src/components/MediaEasterEggs/ExpandableQuote.tsx` (new file)

```typescript
import { useState } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface ExpandableQuoteProps {
  shortQuote: string;
  fullQuote: string;
  author: string;
  title: string;
}

export const ExpandableQuote = ({ 
  shortQuote, 
  fullQuote, 
  author, 
  title 
}: ExpandableQuoteProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="glass-card p-6 cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
      whileHover={{ scale: 1.01 }}
    >
      <Quote className="w-8 h-8 text-mint mb-4" />
      
      <motion.div
        animate={{ height: isExpanded ? "auto" : "auto" }}
      >
        <p className="text-lg font-medium mb-4">
          "{isExpanded ? fullQuote : shortQuote}"
        </p>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{author}</p>
            <p className="text-sm text-muted-foreground">{title}</p>
          </div>
          
          {!isExpanded && (
            <span className="text-xs text-mint">Click to read more</span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
```

---

## 🧭 NAVIGATION & ROUTING UPDATES

**File:** `/src/components/Navigation.tsx`

### Remove Links
- ❌ Builder Session
- ❌ Leadership Lab
- ❌ Portfolio Program
- ❌ Builder Economy (move to blog)

### Add Links
- ✅ 4-Week Sprint → `/sprint/4-week`
- ✅ 90-Day Sprint → `/sprint/90-day`
- ✅ Decision Diagnostic → `/diagnostic`
- ✅ Blog → `/blog`

### New Nav Structure

```typescript
const navLinks = [
  { label: "Sprints", href: "#", hasDropdown: true },
  { label: "Diagnostic", href: "/diagnostic" },
  { label: "Blog", href: "/blog" },
];

const sprintsDropdown = [
  { label: "4-Week Sprint", href: "/sprint/4-week" },
  { label: "90-Day Sprint", href: "/sprint/90-day" },
];
```

---

## 📋 IMPLEMENTATION CHECKLIST

Use this to track progress:

### Phase 1: Core Copy & Positioning
- [ ] Update Hero rotating headlines to "nervous decisions"
- [ ] Update Hero CTA to "What's your nervous decision?"
- [ ] Create FrameworkJourney component (Mind Set → Mind Map → Mind Make)
- [ ] Update TheProblem component (Builder/Orchestrator copy)
- [ ] Simplify ProductLadder to 2-card sprint chooser
- [ ] Update TrustSection with Krish bio
- [ ] Update SimpleCTA final copy
- [ ] Update chatbot branding to "Ask Mindmaker"
- [ ] Evolve news ticker LLM prompt (SIGNAL/NOISE/DECISION/TAKE)

### Phase 2: New Pages
- [ ] Create Sprint4Week.tsx page
- [ ] Create Sprint90Day.tsx page
- [ ] Add routing for /sprint/4-week and /sprint/90-day
- [ ] Rebrand LeadershipInsights.tsx → Decision Readiness Diagnostic
- [ ] Update diagnostic results to include nervous decisions + sprint recommendation

### Phase 3: Navigation & Cleanup
- [ ] Update Navigation component (remove old products, add sprint links)
- [ ] Add redirects for /builder-session, /leadership-lab, /portfolio-program
- [ ] Remove/archive old product page files
- [ ] Update all internal links to new structure

### Phase 4: Media Easter Eggs (when assets available)
- [ ] Create VideoDrawer component
- [ ] Create AudioPlayer component
- [ ] Create ArtifactPreview component
- [ ] Create ExpandableQuote component
- [ ] Integrate video in TrustSection (Krish's Cynical Take)
- [ ] Add artifact previews to sprint pages
- [ ] Scatter expandable quotes throughout homepage

### Phase 5: Testing & Polish
- [ ] Test all navigation flows
- [ ] Verify all CTAs route to InitialConsultModal
- [ ] Check WCAG compliance (no mint text on light backgrounds)
- [ ] Mobile responsiveness check
- [ ] Verify scroll animations work
- [ ] Test media easter eggs on all devices
- [ ] Spell check all new copy
- [ ] Verify brand voice consistency

---

## 🎤 VOICE & TONE GUIDELINES

Every piece of copy must pass this filter:

### ✅ USE
- Build, Systems, Working, Deploy, Literacy, Decision, Sprint, Friction
- Concrete verbs: Ship, Decide, Make, Cut, Filter
- Second person: You, Your
- Specific numbers: "12 hours/week" not "significant time"

### ❌ NEVER USE
- Transformation, Digital, Synergy, Leverage, Ecosystem, Journey
- Innovative, Revolutionary, Cutting-edge, Next-generation
- "We help you..." (use "You will..." or "We..." directly)
- Passive voice
- Vague benefits: "optimize", "enhance", "maximize"

### Voice Archetype
**Your smartest, most cynical friend who runs AI transformation every day and genuinely loves building things.**

- Confident, not arrogant
- Cynical, not negative
- Helpful, not pushy
- Premium through substance, not stiffness

### Example Transformations

| OLD (Corporate) | NEW (Mindmaker Voice) |
|---|---|
| "We help enterprises leverage AI to drive transformation" | "You'll stop talking about AI and start using it" |
| "Our comprehensive AI strategy framework" | "Mind Set → Mind Map → Mind Make" |
| "Designed for non-technical leaders" | "You don't need to code. You need to decide." |
| "Book a discovery call" | "What's your nervous decision?" |
| "Cutting-edge AI solutions" | "Working systems, not demos" |

---

## 🚀 DEPLOYMENT NOTES

### Before Committing
1. Run linter: `npm run lint`
2. Build check: `npm run build`
3. Verify no TypeScript errors
4. Test locally on mobile viewport
5. Check console for warnings

### Git Commit Message
```
Brand overhaul: CLAUDE.md for vision 11/10 implementation

- Updated hero headlines to "nervous decisions"
- Created Mind Set → Mind Map → Mind Make framework journey
- Simplified product ladder to 2 sprints (4-week & 90-day)
- Added sprint detail pages
- Rebranded diagnostic as "Decision Readiness"
- Updated all CTAs to "What's your nervous decision?"
- Removed builder-session, leadership-lab public pages
- Media easter egg components ready for assets
- Updated navigation and routing

Per brand vision doc: premium through substance, anti-consultancy positioning.
```

---

## 📞 QUESTIONS FOR KRISH (AFTER IMPLEMENTATION)

Once the code changes are done, these decisions need Krish's input:

1. **Pricing disclosure:** Should sprint pages show pricing or keep it "Contact for pricing"?
2. **Diagnostic scoring:** What's the formula for "Decision Readiness Score"?
3. **Media assets timeline:** When can we expect video/audio/photos?
4. **Extended Sprint positioning:** 6-month option: separate page or just mentioned on 90-day page?
5. **Team offerings:** Should Leadership Lab be completely hidden or mentioned as "contact us"?
6. **First testimonials:** Which client references can we publish (even anonymized)?

---

## 🎯 SUCCESS CRITERIA

You'll know this is working when:

1. **A leader lands on the homepage** and sees their own anxiety in the rotating headlines within 3 seconds
2. **They scroll** and experience Mind Set → Mind Map → Mind Make visually (not just read about it)
3. **They identify** as Builder or Orchestrator naturally
4. **They see** 4-Week vs 90-Day and immediately know which one fits
5. **They click** "What's your nervous decision?" because it names what they're feeling
6. **They book** the First Conversation without reading a single feature bullet

That's the 11/10.

---

## END OF CLAUDE.MD

**Last Updated:** 2026-02-20  
**Maintainer:** Subagent for Brand Vision Implementation  
**Next Steps:** Execute phase-by-phase, commit changes, deploy to staging, test, ship to production.
