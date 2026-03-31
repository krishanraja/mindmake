import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ToolRecommendation {
  name: string;
  description: string;
  useCase: string;
}

export interface MasterPrompt {
  title: string;
  prompt: string;
}

export interface FrictionMapData {
  problem: string;
  currentState: string;
  aiEnabledState: string;
  timeSaved: string;
  toolRecommendations: ToolRecommendation[];
  masterPrompts: MasterPrompt[];
  generatedAt: Date;
}

const FRICTION_MAP_PROMPT = `You are Krish from MindMaker, an AI implementation strategist with 16 years of experience helping leaders build working AI systems around their real work. A senior leader has described a workflow challenge. Your job is to create a deeply personalized, actionable friction map that demonstrates expert-level understanding.

## MINDMAKER METHODOLOGY (Apply strategically)

### Core Principle
"AI literacy is about compounding leadership performance, using AI to think better, faster, and more creatively as a leader."

### The Five Cognitive Frameworks:
1. **First-Principles Thinking**: What's the fundamental problem? Strip assumptions.
2. **A/B Framing**: Reframe positively AND negatively to expose bias
3. **Dialectical Reasoning**: Thesis (FOR) → Antithesis (AGAINST) → Synthesis
4. **Mental Contrasting (WOOP)**: Wish → Outcome → Obstacle → Plan
5. **Reflective Equilibrium**: Does this align with their values/org culture?

### Mindmaker Values:
- Build working systems, not concepts
- Real work from their actual problems, not case studies
- Literacy that outlives any tool
- No vendor theatre or generic training

## YOUR ANALYSIS PROCESS

1. **Deep Problem Understanding**:
   - What's the stated problem? What's the REAL problem behind it?
   - What's the workflow actually like? (Step-by-step, not generic)
   - Who's involved? What tools do they use now?
   - What's the emotional cost? (Frustration, context-switching, mental load)
   - What happens if this doesn't get solved? (Business impact)

2. **Time Savings Calculation** (Be realistic, not optimistic):
   - Break down the workflow into discrete steps
   - Identify which steps AI can automate/accelerate
   - Calculate time per step (be conservative)
   - Account for learning curve and setup time
   - Provide reasoning: "X hours saved because Y step takes Z minutes and happens N times per week"

3. **Tool Selection Logic**:
   - Match tools to their specific use case (not generic recommendations)
   - Consider their technical comfort level
   - Prioritize tools that integrate with their existing stack
   - Include one "quick win" tool (easy setup, immediate value)
   - Include one "strategic" tool (bigger impact, more setup)
   - Explain WHY each tool fits their situation

4. **Master Prompt Creation** (These must be copy-paste ready):
   - Include specific context from their problem description
   - No placeholders - write it for their actual situation
   - Specify expected output format
   - Include quality criteria
   - Make it actionable TODAY

## OUTPUT STRUCTURE

Return ONLY valid JSON (no markdown, no explanation) with this exact structure:

{
  "currentState": "3-4 sentences that: (1) Describe their specific workflow pain points with concrete details, (2) Identify the emotional/mental cost (frustration, context-switching), (3) Reference specific steps or processes they mentioned, (4) Show you understand their exact situation. Be specific - if they said 'weekly reports take 5 hours,' reference that.",
  "aiEnabledState": "3-4 sentences that: (1) Describe the transformed workflow with AI, (2) Show how AI handles specific steps they mentioned, (3) Explain the shift in their role (from doer to reviewer/strategist), (4) Include concrete benefits tied to their problem. Not generic 'AI makes things faster' - show HOW it transforms THEIR workflow.",
  "timeSaved": "A specific, defensible estimate with detailed reasoning. Format: 'X-Y hours per week' followed by breakdown. Example: '6-8 hours per week: Your weekly report compilation (currently 3 hours of data gathering + 2 hours of formatting) becomes 15 minutes of AI synthesis + 15 minutes of your review. The daily status updates (30 min/day × 5 days = 2.5 hours) become automated summaries you review in 5 minutes. Total: ~7 hours saved, with higher quality output.'",
  "toolRecommendations": [
    {
      "name": "Tool Name (be specific - 'Claude' not 'AI tool')",
      "description": "2-3 sentences explaining what this tool does and WHY it fits their specific use case. Reference their problem. Include integration details if relevant.",
      "useCase": "A detailed, step-by-step explanation of EXACTLY how they would use this tool for their stated problem. Be specific: 'Upload your weekly data spreadsheet, then use this prompt: [specific prompt]. The tool will generate a formatted report in 2 minutes that you review and customize.'"
    },
    {
      "name": "Second tool",
      "description": "...",
      "useCase": "..."
    },
    {
      "name": "Third tool",
      "description": "...",
      "useCase": "..."
    }
  ],
  "masterPrompts": [
    {
      "title": "A specific, action-oriented title that references their task (e.g., 'Weekly Board Report Synthesizer' not 'Report Generator')",
      "prompt": "A COMPLETE, READY-TO-USE prompt (4-6 sentences) that: (1) Includes specific context from their problem, (2) Specifies the input format (what they paste/upload), (3) Defines the output format (structure, length, style), (4) Includes quality criteria, (5) Has NO placeholders - write it for their actual situation. Example: 'I'm a [their role] at [their company type]. Each week I compile a board report from 5 different data sources: [specific sources they mentioned]. Take this week's data [paste data] and create a 2-page executive summary with: (1) Key metrics vs. last week, (2) Top 3 insights, (3) Risks requiring attention, (4) Recommended actions. Use a professional, confident tone suitable for board presentation. Format as bullet points with 1-2 sentence explanations.'"
    },
    {
      "title": "Second prompt title",
      "prompt": "Second complete prompt..."
    }
  ]
}

## QUALITY STANDARDS

Your friction map should make the leader think:
- "This person really understands my specific situation"
- "These time savings are realistic, not inflated"
- "I can use these prompts TODAY"
- "These tools actually fit my workflow"

If your recommendations could apply to anyone, they're not good enough. If your time savings seem inflated, recalculate. If your prompts have placeholders, rewrite them.

Return ONLY valid JSON, no markdown or explanation.`;

export const useFrictionMap = () => {
  const [frictionMap, setFrictionMap] = useState<FrictionMapData | null>(null);
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

  const generateFrictionMap = useCallback(async (problem: string) => {
    if (!problem.trim() || problem.length < 10) {
      setError('Please describe your challenge in at least 10 characters.');
      return;
    }

    if (!isMountedRef.current) return; // Component unmounted, don't start
    
    // Reset cancellation flag for new request
    cancelRef.current = false;
    setIsGenerating(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('chat-with-krish', {
        body: {
          messages: [
            { role: 'system', content: FRICTION_MAP_PROMPT },
            { role: 'user', content: `Analyze this workflow challenge and provide AI implementation recommendations:\n\n"${problem}"` }
          ],
          widgetMode: 'tryit',
        },
      });

      if (functionError) throw new Error(functionError.message || 'API error');

      const responseText = data?.message || '';
      
      let parsedResponse;
      try {
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
                parsed = JSON.parse(responseText.slice(start, end + 1));
              }
            }
          }
        }
        
        // Validate required fields
        if (parsed && (parsed.currentState || parsed.aiEnabledState || parsed.toolRecommendations)) {
          parsedResponse = parsed;
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError, responseText.substring(0, 500));
        parsedResponse = generateFallbackResponse(problem);
      }

      if (cancelRef.current || !isMountedRef.current) return; // Component unmounted or cancelled, don't update state

      const newFrictionMap: FrictionMapData = {
        problem,
        currentState: parsedResponse.currentState || 'Manual processes consuming significant time and mental energy.',
        aiEnabledState: parsedResponse.aiEnabledState || 'Streamlined workflows with AI handling routine tasks.',
        timeSaved: parsedResponse.timeSaved || '4-6 hours per week',
        toolRecommendations: parsedResponse.toolRecommendations || [],
        masterPrompts: parsedResponse.masterPrompts || [],
        generatedAt: new Date(),
      };

      if (!cancelRef.current && isMountedRef.current) {
        setFrictionMap(newFrictionMap);
        localStorage.setItem('mindmaker-friction-map', JSON.stringify(newFrictionMap));
      }
    } catch (err) {
      if (cancelRef.current || !isMountedRef.current) return; // Component unmounted or cancelled, don't update state
      console.error('Error generating friction map:', err);
      setError('Failed to generate analysis. Please try again.');
      
      const fallback = generateFallbackResponse(problem);
      if (!cancelRef.current && isMountedRef.current) {
        setFrictionMap({
          problem,
          ...fallback,
          generatedAt: new Date(),
        });
      }
    } finally {
      if (!cancelRef.current && isMountedRef.current) {
        setIsGenerating(false);
      }
    }
  }, []);

  const clearFrictionMap = useCallback(() => {
    setFrictionMap(null);
    setError(null);
    localStorage.removeItem('mindmaker-friction-map');
  }, []);

  return {
    frictionMap,
    isGenerating,
    error,
    generateFrictionMap,
    clearFrictionMap,
  };
};

function generateFallbackResponse(problem: string): Omit<FrictionMapData, 'problem' | 'generatedAt'> {
  const problemLower = problem.toLowerCase();
  
  const isWriting = problemLower.includes('writ') || problemLower.includes('content') || problemLower.includes('email');
  const isData = problemLower.includes('data') || problemLower.includes('report') || problemLower.includes('analys');
  const isMeetings = problemLower.includes('meeting') || problemLower.includes('notes') || problemLower.includes('summary');

  if (isWriting) {
    return {
      currentState: `Your writing workflow (drafting, editing, and ensuring consistent tone) is consuming hours that could go toward strategic work. Each piece requires multiple revision cycles and context-switching between different communication types.`,
      aiEnabledState: `AI generates solid first drafts in your voice within seconds, handles tone adjustments automatically, and maintains consistency across all your communications. You shift from writer to editor, reducing writing time by 60-70%.`,
      timeSaved: '5-8 hours per week (based on typical leadership communication volume)',
      toolRecommendations: [
        { name: 'Claude', description: 'Advanced AI with nuanced writing capabilities and strong reasoning.', useCase: `Draft your emails, memos, and strategic communications. Claude excels at matching professional tone and can handle complex, multi-stakeholder messages.` },
        { name: 'Grammarly Business', description: 'AI writing assistant that integrates everywhere you write.', useCase: `Real-time improvements as you write. Catches tone mismatches, clarity issues, and ensures your communications land as intended.` },
        { name: 'Notion AI', description: 'AI embedded in your workspace for contextual writing.', useCase: `Generate content within your existing documents and projects. Great for internal communications and documentation that needs organizational context.` },
      ],
      masterPrompts: [
        { title: 'Executive Communication Drafter', prompt: `I need to communicate a decision to my team about our strategic direction change. The key message is that we're shifting focus to prioritize our core product over expansion. Draft a clear, confident email that acknowledges the change, explains the reasoning (market conditions require focus), and maintains team morale. Keep it under 200 words, professional but warm tone.` },
        { title: 'Stakeholder Update Generator', prompt: `Write a weekly stakeholder update covering: 1) Progress on our main initiative this week, 2) Key blockers we're working through, 3) What's coming next week. Use bullet points, keep it scannable, executive-friendly. Include a one-sentence summary at the top.` },
      ],
    };
  }

  if (isData) {
    return {
      currentState: `Your data analysis workflow involves manually gathering information from multiple sources, processing it in spreadsheets, and interpreting patterns. This process takes hours and is prone to human error and inconsistency.`,
      aiEnabledState: `AI automates data gathering, recognizes patterns you might miss, and generates initial analysis with visualizations in minutes. You move from data processor to insight validator and strategic decision-maker.`,
      timeSaved: '6-10 hours per week (based on typical executive reporting cycles)',
      toolRecommendations: [
        { name: 'ChatGPT with Code Interpreter', description: 'Upload data files and analyze with natural language.', useCase: `Upload your spreadsheets or CSVs, ask questions in plain English, get instant charts and insights. Perfect for ad-hoc analysis and board prep.` },
        { name: 'Perplexity AI', description: 'AI research assistant with real-time web access and citations.', useCase: `Research competitors, market trends, and industry data with cited sources. Saves hours of manual research and gives you defensible insights.` },
        { name: 'Julius AI', description: 'Specialized data analysis platform for business users.', useCase: `Complex data transformations and recurring analysis. Build reusable analysis workflows that run on new data automatically.` },
      ],
      masterPrompts: [
        { title: 'Weekly Metrics Analysis', prompt: `Here's our weekly performance data: [paste your metrics]. Analyze this and give me: 1) The 3 most important trends I should know about, 2) Any anomalies or concerns that need attention, 3) One specific recommendation for next week. Format this for a 2-minute executive review.` },
        { title: 'Competitive Intelligence Brief', prompt: `Research our competitor [competitor name] and their recent moves in [your market]. I need: key strategic initiatives they've announced in the last 90 days, how this might affect our positioning, and what questions we should be asking internally. Keep it to one page, cite your sources.` },
      ],
    };
  }

  if (isMeetings) {
    return {
      currentState: `Your meetings generate scattered notes, action items fall through the cracks, and follow-up takes significant effort. The value from meetings dissipates because capture and follow-through are manual.`,
      aiEnabledState: `AI captures everything automatically, generates structured summaries with clear action items, and tracks follow-up, ensuring every meeting produces lasting value without your manual effort.`,
      timeSaved: '3-5 hours per week (based on typical leadership meeting load)',
      toolRecommendations: [
        { name: 'Otter.ai', description: 'AI meeting transcription with smart summaries.', useCase: `Automatically records and transcribes your meetings, then generates summaries with action items. Join meetings knowing capture is handled.` },
        { name: 'Fireflies.ai', description: 'Meeting intelligence that makes conversations searchable.', useCase: `Search across all your meetings for specific discussions. "What did we decide about the Q2 budget?" becomes instantly answerable.` },
        { name: 'Notion AI', description: 'AI-powered workspace for meeting management.', useCase: `Organize meeting notes, generate follow-up tasks, and keep everything connected to your projects. Meetings become actionable, not just recorded.` },
      ],
      masterPrompts: [
        { title: 'Meeting Summary & Actions', prompt: `Here are my raw notes from today's leadership meeting: [paste notes]. Create: 1) A 3-sentence executive summary, 2) Decisions made (with owners), 3) Action items with deadlines and responsible parties, 4) Open questions for next meeting. Format this so I can share directly with the team.` },
        { title: 'Meeting Prep Brief', prompt: `I have a board meeting tomorrow about our Q4 results. Based on these materials [paste key docs or summary], prepare: 1) My opening talking points (90 seconds), 2) The 5 questions I'm most likely to get and strong answers to each, 3) The one thing I absolutely need to leave the room having communicated.` },
      ],
    };
  }

  // Default fallback - apply first-principles thinking
  return {
    currentState: `Your workflow involves manual steps, context-switching, and repetitive tasks that fragment your attention and consume time that should go toward strategic thinking and leadership.`,
    aiEnabledState: `AI handles the routine elements (drafting, summarizing, analyzing, organizing) while you focus on judgment and decision-making. Context is maintained automatically, and your output velocity increases 2-3x.`,
    timeSaved: '4-7 hours per week (based on typical executive time allocation)',
    toolRecommendations: [
      { name: 'Claude', description: 'Advanced AI with strong reasoning for complex tasks.', useCase: `Your go-to for drafting, analysis, and thinking through complex problems. Particularly strong at nuanced communication and multi-step reasoning.` },
      { name: 'ChatGPT Plus', description: 'Versatile AI assistant with broad capabilities.', useCase: `Quick tasks, brainstorming, and general acceleration. The Swiss Army knife of AI tools, good at almost everything.` },
      { name: 'Notion AI', description: 'AI embedded in your workspace.', useCase: `Generate content within your existing documents and projects. Great for keeping AI assistance connected to your actual work context.` },
    ],
    masterPrompts: [
      { title: 'Strategic Thinking Accelerator', prompt: `I'm working on a strategic challenge: ${problem}. Help me think through this using first-principles: 1) What's the fundamental problem we're actually trying to solve? 2) What are we assuming that might not be true? 3) What would we do if we started from scratch? 4) What's the simplest path to testing our hypothesis?` },
      { title: 'Decision Framework', prompt: `I need to make a decision about ${problem}. Apply dialectical reasoning: What's the strongest case FOR moving forward? What's the strongest case AGAINST? What synthesis or middle path might capture the benefits while mitigating the risks? Give me a clear recommendation with your reasoning.` },
    ],
  };
}
