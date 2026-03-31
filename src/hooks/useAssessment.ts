import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
    score: number;
  }[];
}

export interface BuilderProfile {
  type: string;
  description: string;
  strengths: string[];
  nextSteps: string[];
  recommendedProduct: string;
  productLink: string;
  frameworkUsed?: string;
}

const QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'approach',
    question: 'How do you currently approach AI in your work?',
    options: [
      { value: 'exploring', label: "I'm exploring but haven't built systems yet", score: 1 },
      { value: 'experimenting', label: "I'm experimenting with a few tools", score: 2 },
      { value: 'building', label: "I'm actively building AI workflows", score: 3 },
    ],
  },
  {
    id: 'frustration',
    question: "What's your biggest AI frustration?",
    options: [
      { value: 'overwhelm', label: 'Too many tools, unclear where to start', score: 1 },
      { value: 'implementation', label: "I know what's possible but can't implement", score: 2 },
      { value: 'scale', label: 'Built pilots but struggling to scale', score: 3 },
    ],
  },
  {
    id: 'goal',
    question: 'What would success look like for you in 90 days?',
    options: [
      { value: 'clarity', label: 'Clear understanding of AI for my role', score: 1 },
      { value: 'systems', label: '3-5 working AI systems I use daily', score: 2 },
      { value: 'transformation', label: 'Team-wide AI transformation underway', score: 3 },
    ],
  },
];

export const useAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [profile, setProfile] = useState<BuilderProfile | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const cancelRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    cancelRef.current = false;
    return () => {
      isMountedRef.current = false;
      cancelRef.current = true;
    };
  }, []);

  const answerQuestion = useCallback((questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }, []);

  const generateProfile = useCallback(async () => {
    if (!isMountedRef.current) return; // Component unmounted, don't start
    
    // Reset cancellation flag for new request
    cancelRef.current = false;
    setIsGenerating(true);
    setError(null);

    // Calculate total score for fallback
    let totalScore = 0;
    QUESTIONS.forEach(q => {
      const answer = answers[q.id];
      const option = q.options.find(o => o.value === answer);
      if (option) totalScore += option.score;
    });

    // Build context from answers for AI
    const answerSummary = QUESTIONS.map(q => {
      const answer = answers[q.id];
      const option = q.options.find(o => o.value === answer);
      return `${q.question}: ${option?.label || 'Not answered'}`;
    }).join('\n');

    try {
      const { data, error: apiError } = await supabase.functions.invoke('chat-with-krish', {
        body: {
          messages: [
            {
              role: 'user',
              content: `You are Krish, founder of Mindmaker, analyzing a CEO/COO/CPO's AI readiness assessment. You have 16 years of product strategy experience, 90+ product strategies delivered, and 50+ educational seminars. You're speaking to a peer, a senior leader who makes strategic decisions under uncertainty.

Your job: Create a CEO-grade professional consultant analysis that demonstrates you understand their specific situation at a strategic level, not just surface patterns. This should read like expert counsel from someone who's seen this pattern 50+ times and knows exactly what it means.

ASSESSMENT RESPONSES:
${answerSummary}

## YOUR EXPERTISE & METHODOLOGY

You have deep knowledge of:
- **Five Cognitive Frameworks** (A/B Framing, Dialectical Reasoning, Mental Contrasting/WOOP, Reflective Equilibrium, First-Principles Thinking) - You use these daily with executives
- **Chain-of-Thought Reasoning** - You understand how to break complex problems into logical steps
- **Critical Thinking in AI Era** - You know LLM limitations, verification practices, and how to maintain cognitive independence
- **Multi-Dimensional Reasoning** - You think in dialectical systems, perspective matrices, temporal analysis
- **Executive Decision-Making** - You understand behavioral economics, decision theory, organizational psychology from working with 90+ leaders
- **AI Literacy & Implementation** - You've helped leaders build working AI systems, not just talk about them

This isn't a template. This is strategic analysis for a peer.

## YOUR ANALYSIS PROCESS (Think like a consultant who's seen this 50+ times)

### Step 1: Executive-Level Pattern Recognition
Read between the lines. What's the REAL story here?
- Extract exact language from their answers, not just what they selected, but what that selection reveals about their thinking
- Identify their leadership style: Are they cautious? Enthusiastic but stuck? Overwhelmed by options? Confident but lacking structure?
- Spot contradictions: Do their choices reveal tension? (e.g., "experimenting" + "implementation challenge" = "You've tried tools but hit the execution wall")
- What are they NOT saying? No mention of team? They're thinking solo. No mention of ROI? They're in exploration mode, not execution mode.

### Step 2: Strategic Context Analysis
You've seen this pattern before. What does it mean strategically?
- What journey stage are they at? (Curious → Experimenting → Building → Scaling → Transforming)
- What's the strategic implication? (e.g., "Experimentation + Implementation challenge" = "You're past the demo phase but need systems to scale")
- What's the business risk if they don't act? What's the opportunity if they do?
- How does this pattern compare to the 90+ leaders you've worked with? What's unique about THIS person?

### Step 3: Framework Selection & Application
Choose the ONE framework that best fits their situation. Don't just name it. Explain WHY it's the right lens.

**First-Principles Thinking**: If they're questioning fundamentals, stuck on assumptions, or need to rebuild from basics. Use Five Whys: "Why do you assume X? Let's strip that back to what you actually know."

**Mental Contrasting (WOOP)**: If they have clear goals but obstacles are blocking them. Structure: Wish (their goal) → Outcome (ideal success scenario) → Obstacle (real barriers) → Plan (mitigation strategy). This is perfect when they're optimistic but stuck.

**Dialectical Reasoning**: If they're torn between options or need opposing perspectives. Present thesis (strongest case FOR) and antithesis (strongest case AGAINST), then synthesis. Use when they're making a binary choice that needs deeper analysis.

**A/B Framing**: If they're stuck in binary thinking or need perspective shift. Reframe their situation positively AND negatively to expose bias. Use when they're viewing something through only one lens.

**Reflective Equilibrium**: If values/org culture alignment is the core challenge. Map their decisions against stated principles, identify tensions, find coherence. Use when there's a values/action mismatch.

**CRITICAL**: Your framework explanation should show you understand their specific situation. "Mental Contrasting fits because your goal (team transformation) is clear, but your obstacle (scaling challenges) suggests you need to balance optimism with realistic barriers, which is exactly what WOOP does."

### Step 4: Create CEO-Grade Strengths (NOT Generic Consultant Fluff)
BAD: "Open mindset" (anyone could have this, and this is consultant fluff)
GOOD: "Your selection of 'experimenting' combined with 'implementation challenge' reveals something important: you've moved past the 'AI is magic' phase. You're testing real workflows and hitting real barriers. This is actually a strength because it means you're thinking critically about fit, not just following trends. Research shows leaders who recognize AI limitations (rather than accepting outputs uncritically) make better strategic decisions. You're in the evidence-gathering phase, which is exactly where you should be before committing resources."

Each strength must:
- Reference their EXACT answer combination with specific language
- Explain WHY it's strategically valuable (not just "it's good")
- Connect to research/patterns you've seen (show expertise)
- Demonstrate you understand their unique position in the AI adoption journey
- Sound like you're speaking to a peer, not a template

### Step 5: Craft Strategic Next Steps (CEO-Grade Actionable)
These aren't generic tips. These are strategic recommendations with clear business impact.

Each step must:
- Reference their specific answers with exact language ("You mentioned weekly reports take 5 hours, so let's start there")
- Include timeline and expected outcome ("Within 30 days, you'll have a working system that saves 4 hours/week")
- Explain the strategic rationale ("This is a perfect quick win because it demonstrates immediate ROI, builds team confidence, and creates a template for scaling AI to other workflows")
- Show framework application ("Using Mental Contrasting, your obstacle is time, and this step addresses that directly")
- Build logically on previous steps (show progression)
- Connect to business outcomes ("This positions you to scale AI across your organization within 90 days")

Example CEO-grade step: "Within 30 days, use our Friction Map Builder to map your weekly reporting workflow. You mentioned this takes 5 hours, and this is a perfect quick win because: (1) It demonstrates immediate ROI (5 hours → 30 minutes), (2) It builds team confidence in AI's practical value, (3) It creates a template you can replicate across other workflows, and (4) It positions you to scale AI systematically rather than ad-hoc. This uses Mental Contrasting: your goal is efficiency, your obstacle is time, and this directly addresses both."

## OUTPUT FORMAT (Return ONLY valid JSON, no markdown):

{
  "type": "A strategic 2-3 word title that captures their UNIQUE position. Must be specific and CEO-grade. Examples: 'Experimentation Catalyst' (if experimenting + need structure), 'Systematization Builder' (if building + need systems), 'Transformation Architect' (if scaling + need strategy). NOT generic like 'Curious Explorer'.",
  "description": "2-3 sentences in consultant voice that: (1) Acknowledge their EXACT journey stage with specific language from their answers, (2) Identify the KEY strategic insight/pattern you noticed (reference their actual responses), (3) Frame their potential in concrete business terms. MUST sound like expert counsel, not a template. Example: 'Based on your responses, you're in the experimentation phase. You've tried tools but hit the implementation wall. This pattern suggests you're past the demo phase but need systems to scale. Here's what that means strategically...'",
  "frameworkUsed": "The specific framework name AND a 2-3 sentence explanation that shows strategic understanding: (1) Why this framework fits their specific answer combination, (2) How it reveals insights about their situation, (3) What cognitive pattern it addresses and why that matters. Example: 'Mental Contrasting (WOOP) - Your answers show clear goals (team transformation) but obstacles (scaling challenges). WOOP helps you balance your optimistic vision with realistic barriers, which is exactly what you need to move from pilot to production. This framework is perfect for your situation because it addresses the gap between aspiration and execution.'",
  "strengths": [
    "Strength 1: CEO-grade insight that references their EXACT answer combination. Explain WHY it's strategically valuable using framework insights. Example: 'Your selection of 'experimenting' combined with 'implementation challenge' reveals you've moved past the 'AI is magic' phase. You're testing real workflows and hitting real barriers. This is actually a strength because it means you're thinking critically about fit, not just following trends. Research shows leaders who recognize AI limitations make better strategic decisions. You're in the evidence-gathering phase, which is exactly where you should be before committing resources.'",
    "Strength 2: Another CEO-grade insight that shows deep understanding of their unique position and strategic value",
    "Strength 3: A third insight that demonstrates you've analyzed their full answer set at a strategic level, not just surface patterns"
  ],
  "nextSteps": [
    "Step 1: CEO-grade actionable step with timeline, expected outcome, and strategic rationale. Reference their answers directly. Example: 'Within 30 days, use our Friction Map Builder to map your weekly reporting workflow. You mentioned this takes 5 hours. This is a perfect quick win because: (1) It demonstrates immediate ROI (5 hours → 30 minutes), (2) It builds team confidence in AI's practical value, (3) It creates a template you can replicate across other workflows, and (4) It positions you to scale AI systematically rather than ad-hoc. This uses Mental Contrasting: your goal is efficiency, your obstacle is time, and this directly addresses both.'",
    "Step 2: Another strategic step that builds on step 1, tied to their situation, with clear business impact",
    "Step 3: A third step that shows progression and addresses their specific journey stage with strategic rationale"
  ],
  "recommendedProduct": "Builder Session OR AI Literacy-to-Influence OR AI Leadership Lab",
  "productLink": "/builder-session OR /builder-sprint OR /leadership-lab"
}

## QUALITY CHECKLIST (CEO-Grade Standards):
Before finalizing, ask:
- [ ] Does this sound like expert counsel from someone who's seen this pattern 50+ times?
- [ ] Would a CEO read this and think "This person really understands my situation at a strategic level"?
- [ ] Are strengths specific enough that only THIS person (with their answer combination) would get them?
- [ ] Do strengths explain WHY something is strategically valuable, not just that it's "good"?
- [ ] Do next steps have clear business impact and strategic rationale?
- [ ] Is the framework explanation sophisticated enough that a CEO would think "This person understands both my situation AND how to think about it"?
- [ ] Does it reference their actual responses with specific language?
- [ ] Is it clear this was written for THEM, not a template?
- [ ] Does it demonstrate expert-level knowledge of AI literacy, decision-making frameworks, and critical thinking?
- [ ] Would this WOW a CEO? (If not, rewrite it.)

CRITICAL: This profile should feel like it was written by a professional consultant who spent 30 minutes understanding their specific situation at a strategic level. A CEO reading this should think "This person gets it. This is exactly where I am and exactly what I need. I want to work with them."`
            }
          ]
          // Removed widgetMode: 'tryit' - Builder Profile should not use Try It Widget system prompt
          // Edge function will detect Builder Profile from message content
        }
      });

      if (apiError) throw new Error(apiError.message || 'API error');

      // Parse the AI response with robust extraction
      const responseText = data?.message || '';
      
      // Try multiple JSON extraction strategies
      let parsed: any = null;
      
      // Strategy 1: Direct JSON parse (if response is pure JSON)
      try {
        parsed = JSON.parse(responseText.trim());
      } catch {
        // Strategy 2: Extract JSON object from markdown or mixed content
        const jsonMatch = responseText.match(/\{[\s\S]*?\}(?=[^}]*$)/);
        if (jsonMatch) {
          try {
            parsed = JSON.parse(jsonMatch[0]);
          } catch {
            // Strategy 3: More aggressive extraction - find outermost braces
            const start = responseText.indexOf('{');
            const end = responseText.lastIndexOf('}');
            if (start !== -1 && end > start) {
              try {
                parsed = JSON.parse(responseText.slice(start, end + 1));
              } catch {
                // Give up on parsing
              }
            }
          }
        }
      }
      
      if (cancelRef.current || !isMountedRef.current) return; // Component unmounted or cancelled, don't update state

      // Validate the parsed object has required fields
      if (parsed && parsed.type && (parsed.strengths || parsed.nextSteps)) {
        if (!cancelRef.current && isMountedRef.current) {
          setProfile({
            type: parsed.type || 'AI Builder',
            description: parsed.description || "You're on a unique AI journey with significant potential.",
            strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Strategic thinking', 'Leadership drive', 'Growth mindset'],
            nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps : ['Book a Builder Session to map your first AI system'],
            recommendedProduct: parsed.recommendedProduct || 'Builder Session',
            productLink: parsed.productLink || '/builder-session',
            frameworkUsed: parsed.frameworkUsed,
          });
        }
        return;
      }
      
      throw new Error('Invalid AI response structure');
    } catch (err) {
      if (cancelRef.current || !isMountedRef.current) return; // Component unmounted or cancelled, don't update state
      console.error('AI profile generation failed:', err);
      
      // Try LLM-generated fallback with simplified prompt (maintains CEO-grade standards)
      try {
        const fallbackPrompt = `You are Krish, founder of Mindmaker. Generate a CEO-grade Builder Profile based on these assessment answers:

${answerSummary}

Total Score: ${totalScore}/9

Create a specific, actionable profile that:
1. References their exact answers (not generic)
2. Shows strategic insight (not "Open mindset")
3. Provides CEO-grade next steps with timelines
4. Uses one of Mindmaker's cognitive frameworks

Return ONLY valid JSON:
{
  "type": "Specific 2-3 word title",
  "description": "2-3 sentences referencing their answers",
  "frameworkUsed": "Framework name with brief explanation",
  "strengths": ["Specific strength 1", "Specific strength 2", "Specific strength 3"],
  "nextSteps": ["Actionable step 1", "Actionable step 2", "Actionable step 3"],
  "recommendedProduct": "Builder Session OR AI Literacy-to-Influence OR AI Leadership Lab",
  "productLink": "/builder-session OR /builder-sprint OR /leadership-lab"
}`;

        const { data: fallbackData, error: fallbackError } = await supabase.functions.invoke('chat-with-krish', {
          body: {
            messages: [{ role: 'user', content: fallbackPrompt }],
            mode: 'builder-profile'
          }
        });

        if (!fallbackError && fallbackData?.message) {
          const fallbackText = fallbackData.message;
          let fallbackParsed: any = null;
          
          // Try to parse fallback response
          try {
            fallbackParsed = JSON.parse(fallbackText.trim());
          } catch {
            const jsonMatch = fallbackText.match(/\{[\s\S]*?\}(?=[^}]*$)/);
            if (jsonMatch) {
              try {
                fallbackParsed = JSON.parse(jsonMatch[0]);
              } catch {
                const start = fallbackText.indexOf('{');
                const end = fallbackText.lastIndexOf('}');
                if (start !== -1 && end > start) {
                  try {
                    fallbackParsed = JSON.parse(fallbackText.slice(start, end + 1));
                  } catch {}
                }
              }
            }
          }

          if (fallbackParsed && fallbackParsed.type && (fallbackParsed.strengths || fallbackParsed.nextSteps)) {
            if (!cancelRef.current && isMountedRef.current) {
              setProfile({
                type: fallbackParsed.type || 'AI Builder',
                description: fallbackParsed.description || "You're on a unique AI journey with significant potential.",
                strengths: Array.isArray(fallbackParsed.strengths) ? fallbackParsed.strengths : ['Strategic thinking', 'Leadership drive', 'Growth mindset'],
                nextSteps: Array.isArray(fallbackParsed.nextSteps) ? fallbackParsed.nextSteps : ['Book a Builder Session to map your first AI system'],
                recommendedProduct: fallbackParsed.recommendedProduct || 'Builder Session',
                productLink: fallbackParsed.productLink || '/builder-session',
                frameworkUsed: fallbackParsed.frameworkUsed,
              });
            }
            return;
          }
        }
      } catch (fallbackErr) {
        console.error('Fallback LLM call also failed:', fallbackErr);
      }

      // Ultimate fallback: Score-based but with better messaging
      // Helper to get label from answer value
      const getAnswerLabel = (questionId: string, defaultValue: string): string => {
        const answerValue = answers[questionId];
        if (!answerValue) return defaultValue;
        const question = QUESTIONS.find(q => q.id === questionId);
        const option = question?.options.find(o => o.value === answerValue);
        return option?.label || defaultValue;
      };
      
      let fallbackProfile: BuilderProfile;
      
      if (totalScore <= 4) {
        fallbackProfile = {
          type: 'Experimentation Catalyst',
          description: `Based on your answers, you're exploring AI's potential but need a structured entry point. Your score of ${totalScore}/9 suggests you're at the beginning of your AI journey.`,
          strengths: [
            `Your approach (${getAnswerLabel('approach', 'exploring')}) shows you're thinking critically about AI adoption`,
            `Your recognition of challenges (${getAnswerLabel('frustration', 'implementation')}) indicates you're past the hype phase`,
            "You understand AI's importance for leadership effectiveness"
          ],
          nextSteps: [
            'Within 2 weeks: Book a Builder Session to map your first AI system around a real workflow',
            'Within 30 days: Build one working system to prove value and build confidence',
            'Within 90 days: Scale to 3-5 systems using the pattern from your first success'
          ],
          recommendedProduct: 'Builder Session',
          productLink: '/builder-session',
        };
      } else if (totalScore <= 7) {
        fallbackProfile = {
          type: 'Systematization Builder',
          description: `Your score of ${totalScore}/9 indicates you're actively experimenting and ready to systematize. Your answers show you've moved past basics and need structure.`,
          strengths: [
            `Your approach (${getAnswerLabel('approach', 'experimenting')}) demonstrates hands-on experience`,
            `Your goal (${getAnswerLabel('goal', 'scaling')}) shows strategic thinking`,
            'You understand the gap between pilots and production systems'
          ],
          nextSteps: [
            'Within 30 days: Join AI Literacy-to-Influence to build 3-5 working systems',
            'Within 60 days: Develop a personal AI operating system with reusable frameworks',
            'Within 90 days: Create a team-wide AI enablement strategy'
          ],
          recommendedProduct: 'AI Literacy-to-Influence',
          productLink: '/builder-sprint',
        };
      } else {
        fallbackProfile = {
          type: 'Transformation Architect',
          description: `Your score of ${totalScore}/9 shows you're thinking at scale. Your answers indicate you're ready to transform how your organization works with AI.`,
          strengths: [
            `Your goal (${getAnswerLabel('goal', 'transformation')}) demonstrates strategic vision`,
            `Your approach (${getAnswerLabel('approach', 'building')}) shows implementation experience`,
            'You have the leadership mandate to drive organization-wide change'
          ],
          nextSteps: [
            'Within 30 days: Run an AI Leadership Lab for your executive team',
            'Within 60 days: Build organization-wide AI capabilities with clear metrics',
            'Within 90 days: Create a 90-day transformation roadmap with pilot programs'
          ],
          recommendedProduct: 'AI Leadership Lab',
          productLink: '/leadership-lab',
        };
      }
      if (!cancelRef.current && isMountedRef.current) {
        setProfile(fallbackProfile);
      }
    } finally {
      if (!cancelRef.current && isMountedRef.current) {
        setIsGenerating(false);
      }
    }
  }, [answers]);

  const nextQuestion = useCallback(() => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      generateProfile();
    }
  }, [currentStep, generateProfile]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setAnswers({});
    setProfile(null);
    setError(null);
  }, []);

  return {
    currentStep,
    questions: QUESTIONS,
    answers,
    profile,
    isGenerating,
    error,
    answerQuestion,
    nextQuestion,
    reset,
  };
};
