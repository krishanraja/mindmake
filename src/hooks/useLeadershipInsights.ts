import { useState, useCallback, useRef, useEffect } from 'react';

export interface LeadershipQuestion {
  id: string;
  phase: string;
  question: string;
  options: {
    value: number;
    label: string;
  }[];
}

export interface PersonalizationQuestion {
  id: string;
  question: string;
  options: string[];
}

export interface LeadershipResults {
  score: number;
  tier: 'AI-Emerging' | 'AI-Developing' | 'AI-Proficient' | 'AI-Advanced' | 'AI-Leader';
  percentile: number;
  strengths: string[];
  growthAreas: string[];
  strategicInsights: string[];
  promptTemplates: string[];
  actionPlan: string[];
}

// 6 core leadership questions (Likert scale 1-5)
const LEADERSHIP_QUESTIONS: LeadershipQuestion[] = [
  {
    id: 'q1',
    phase: 'Leadership Growth',
    question: "I can clearly explain AI's impact on our industry in growth terms.",
    options: [
      { value: 1, label: '1 - Strongly Disagree' },
      { value: 2, label: '2 - Disagree' },
      { value: 3, label: '3 - Neutral' },
      { value: 4, label: '4 - Agree' },
      { value: 5, label: '5 - Strongly Agree' },
    ],
  },
  {
    id: 'q2',
    phase: 'Leadership Growth',
    question: "I regularly use AI tools to enhance my decision-making process.",
    options: [
      { value: 1, label: '1 - Strongly Disagree' },
      { value: 2, label: '2 - Disagree' },
      { value: 3, label: '3 - Neutral' },
      { value: 4, label: '4 - Agree' },
      { value: 5, label: '5 - Strongly Agree' },
    ],
  },
  {
    id: 'q3',
    phase: 'Strategic Vision',
    question: "I have a clear roadmap for AI adoption in my team or organization.",
    options: [
      { value: 1, label: '1 - Strongly Disagree' },
      { value: 2, label: '2 - Disagree' },
      { value: 3, label: '3 - Neutral' },
      { value: 4, label: '4 - Agree' },
      { value: 5, label: '5 - Strongly Agree' },
    ],
  },
  {
    id: 'q4',
    phase: 'Strategic Vision',
    question: "I can evaluate AI tools and vendors with confidence.",
    options: [
      { value: 1, label: '1 - Strongly Disagree' },
      { value: 2, label: '2 - Disagree' },
      { value: 3, label: '3 - Neutral' },
      { value: 4, label: '4 - Agree' },
      { value: 5, label: '5 - Strongly Agree' },
    ],
  },
  {
    id: 'q5',
    phase: 'Implementation',
    question: "My team has successfully implemented at least one AI-powered workflow.",
    options: [
      { value: 1, label: '1 - Strongly Disagree' },
      { value: 2, label: '2 - Disagree' },
      { value: 3, label: '3 - Neutral' },
      { value: 4, label: '4 - Agree' },
      { value: 5, label: '5 - Strongly Agree' },
    ],
  },
  {
    id: 'q6',
    phase: 'Implementation',
    question: "I feel prepared to lead my organization through AI transformation.",
    options: [
      { value: 1, label: '1 - Strongly Disagree' },
      { value: 2, label: '2 - Disagree' },
      { value: 3, label: '3 - Neutral' },
      { value: 4, label: '4 - Agree' },
      { value: 5, label: '5 - Strongly Agree' },
    ],
  },
];

// Optional personalization questions
const PERSONALIZATION_QUESTIONS: PersonalizationQuestion[] = [
  {
    id: 'p1',
    question: "What's your primary industry?",
    options: ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Media', 'Other'],
  },
  {
    id: 'p2',
    question: "How large is your team?",
    options: ['1-10', '11-50', '51-200', '201-1000', '1000+'],
  },
  {
    id: 'p3',
    question: "What's your biggest AI challenge?",
    options: ['Getting started', 'Scaling pilots', 'Team adoption', 'Measuring ROI', 'Vendor selection'],
  },
  {
    id: 'p4',
    question: "How do you prefer to learn?",
    options: ['Hands-on building', 'Case studies', 'Live workshops', 'Self-paced', 'Coaching'],
  },
  {
    id: 'p5',
    question: "What's your immediate AI goal?",
    options: ['Automate tasks', 'Better decisions', 'Cost reduction', 'Innovation', 'Competitive edge'],
  },
];

export type DiagnosticPhase = 
  | 'intro' 
  | 'questions' 
  | 'personalization-prompt' 
  | 'personalization' 
  | 'generating' 
  | 'results';

export const useLeadershipInsights = () => {
  const [phase, setPhase] = useState<DiagnosticPhase>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [personalizationIndex, setPersonalizationIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [personalizationAnswers, setPersonalizationAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<LeadershipResults | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isPersonalized, setIsPersonalized] = useState(false);
  
  // Ref for smooth progress animation that never regresses
  const progressRef = useRef(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const phaseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = LEADERSHIP_QUESTIONS[currentQuestionIndex];
  const currentPersonalizationQuestion = PERSONALIZATION_QUESTIONS[personalizationIndex];
  const totalQuestions = LEADERSHIP_QUESTIONS.length;
  const totalPersonalizationQuestions = PERSONALIZATION_QUESTIONS.length;

  // Calculate time remaining (approximately 20 seconds per question)
  const getTimeRemaining = useCallback(() => {
    const remainingQuestions = totalQuestions - currentQuestionIndex;
    const minutes = Math.ceil((remainingQuestions * 20) / 60);
    return `${minutes} min remaining`;
  }, [currentQuestionIndex, totalQuestions]);

  const startDiagnostic = useCallback(() => {
    setPhase('questions');
    setCurrentQuestionIndex(0);
    setAnswers({});
  }, []);

  const answerQuestion = useCallback((questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }, []);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Go directly to personalization prompt (no contact form)
      setPhase('personalization-prompt');
    }
  }, [currentQuestionIndex, totalQuestions]);

  const skipPersonalization = useCallback(() => {
    setIsPersonalized(false);
    startGeneration();
  }, []);

  const startPersonalization = useCallback(() => {
    setPhase('personalization');
    setPersonalizationIndex(0);
  }, []);

  const answerPersonalization = useCallback((questionId: string, value: string) => {
    setPersonalizationAnswers(prev => ({ ...prev, [questionId]: value }));
  }, []);

  const nextPersonalizationQuestion = useCallback(() => {
    if (personalizationIndex < totalPersonalizationQuestions - 1) {
      setPersonalizationIndex(prev => prev + 1);
    } else {
      setIsPersonalized(true);
      startGeneration();
    }
  }, [personalizationIndex, totalPersonalizationQuestions]);

  const calculateResults = useCallback((): LeadershipResults => {
    // Calculate raw score (sum of all answers)
    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
    const maxScore = totalQuestions * 5;
    const normalizedScore = Math.round((totalScore / maxScore) * 100);

    // Determine tier based on score
    let tier: LeadershipResults['tier'];
    if (normalizedScore >= 80) tier = 'AI-Leader';
    else if (normalizedScore >= 65) tier = 'AI-Advanced';
    else if (normalizedScore >= 50) tier = 'AI-Proficient';
    else if (normalizedScore >= 35) tier = 'AI-Developing';
    else tier = 'AI-Emerging';

    // Calculate percentile (simplified - in production would compare against database)
    const percentile = Math.min(99, Math.max(1, Math.round(normalizedScore * 0.9 + Math.random() * 10)));

    // Generate strengths based on high-scoring areas
    const strengths: string[] = [];
    const growthAreas: string[] = [];

    Object.entries(answers).forEach(([questionId, score]) => {
      const question = LEADERSHIP_QUESTIONS.find(q => q.id === questionId);
      if (!question) return;

      if (score >= 4) {
        if (question.phase === 'Leadership Growth') {
          strengths.push('Strategic AI understanding');
        } else if (question.phase === 'Strategic Vision') {
          strengths.push('Clear AI vision and evaluation skills');
        } else if (question.phase === 'Implementation') {
          strengths.push('Practical AI implementation experience');
        }
      } else if (score <= 2) {
        if (question.phase === 'Leadership Growth') {
          growthAreas.push('Deepening AI industry knowledge');
        } else if (question.phase === 'Strategic Vision') {
          growthAreas.push('Building AI strategy and vendor evaluation skills');
        } else if (question.phase === 'Implementation') {
          growthAreas.push('Hands-on AI implementation experience');
        }
      }
    });

    // Deduplicate
    const uniqueStrengths = [...new Set(strengths)];
    const uniqueGrowthAreas = [...new Set(growthAreas)];

    // Ensure we have at least something
    if (uniqueStrengths.length === 0) {
      uniqueStrengths.push('Willingness to learn AI');
    }
    if (uniqueGrowthAreas.length === 0) {
      uniqueGrowthAreas.push('Continuous AI skill development');
    }

    // Generate strategic insights based on tier and personalization
    const strategicInsights = generateStrategicInsights(tier, personalizationAnswers);

    // Generate prompt templates
    const promptTemplates = generatePromptTemplates(tier, personalizationAnswers);

    // Generate action plan
    const actionPlan = generateActionPlan(tier, uniqueGrowthAreas);

    return {
      score: normalizedScore,
      tier,
      percentile,
      strengths: uniqueStrengths.slice(0, 3),
      growthAreas: uniqueGrowthAreas.slice(0, 3),
      strategicInsights: strategicInsights.slice(0, 3),
      promptTemplates: promptTemplates.slice(0, 3),
      actionPlan: actionPlan.slice(0, 3),
    };
  }, [answers, personalizationAnswers, totalQuestions]);

  // Smooth progress bar that NEVER regresses
  const startGeneration = useCallback(() => {
    setPhase('generating');
    progressRef.current = 0;
    setGenerationProgress(0);
    
    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    // Smooth progress animation - starts fast, slows down, then completes
    // Uses easing function to feel natural
    const startTime = Date.now();
    const duration = 4000; // 4 seconds to reach 90%
    
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = elapsed / duration;
      
      // Easing: fast start, slow middle, waiting at ~90%
      let easedProgress;
      if (rawProgress < 1) {
        // Ease-out-cubic for first 90%
        easedProgress = 1 - Math.pow(1 - rawProgress, 3);
        easedProgress = easedProgress * 0.9; // Cap at 90%
      } else {
        // Hold at 90% until generation completes
        easedProgress = 0.9 + ((elapsed - duration) / 10000) * 0.05; // Very slow crawl
        easedProgress = Math.min(easedProgress, 0.95); // Never exceed 95% until done
      }
      
      // Never let progress go backward
      if (easedProgress > progressRef.current) {
        progressRef.current = easedProgress;
        setGenerationProgress(Math.round(easedProgress * 100));
      }
    }, 50);
    
    // Simulate AI generation and calculate results
    progressTimeoutRef.current = setTimeout(() => {
      // Calculate results based on answers
      const calculatedResults = calculateResults();
      setResults(calculatedResults);
      
      // Complete progress animation
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      
      // Animate to 100%
      const completeProgress = () => {
        progressRef.current += 0.02;
        if (progressRef.current < 1) {
          setGenerationProgress(Math.round(progressRef.current * 100));
          requestAnimationFrame(completeProgress);
        } else {
          setGenerationProgress(100);
          phaseTimeoutRef.current = setTimeout(() => setPhase('results'), 300);
        }
      };
      completeProgress();
    }, 5000);
  }, [answers, personalizationAnswers, calculateResults]);

  const reset = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (progressTimeoutRef.current) {
      clearTimeout(progressTimeoutRef.current);
      progressTimeoutRef.current = null;
    }
    if (phaseTimeoutRef.current) {
      clearTimeout(phaseTimeoutRef.current);
      phaseTimeoutRef.current = null;
    }
    setPhase('intro');
    setCurrentQuestionIndex(0);
    setPersonalizationIndex(0);
    setAnswers({});
    setPersonalizationAnswers({});
    setResults(null);
    setGenerationProgress(0);
    setIsPersonalized(false);
    progressRef.current = 0;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (progressTimeoutRef.current) {
        clearTimeout(progressTimeoutRef.current);
      }
      if (phaseTimeoutRef.current) {
        clearTimeout(phaseTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    phase,
    currentQuestionIndex,
    currentQuestion,
    totalQuestions,
    answers,
    results,
    generationProgress,
    isPersonalized,
    currentPersonalizationQuestion,
    personalizationIndex,
    totalPersonalizationQuestions,
    
    // Computed
    getTimeRemaining,
    
    // Actions
    startDiagnostic,
    answerQuestion,
    nextQuestion,
    skipPersonalization,
    startPersonalization,
    answerPersonalization,
    nextPersonalizationQuestion,
    reset,
  };
};

// Helper functions for generating insights
function generateStrategicInsights(tier: LeadershipResults['tier'], personalization: Record<string, string>): string[] {
  const baseInsights: Record<LeadershipResults['tier'], string[]> = {
    'AI-Emerging': [
      'Start with quick wins: identify 3 repetitive tasks that AI can handle today',
      'Build AI literacy through hands-on experimentation, not just reading',
      'Focus on one tool deeply before expanding your toolkit',
    ],
    'AI-Developing': [
      'Map your decision-making processes to identify AI augmentation opportunities',
      'Develop a 90-day pilot program with clear success metrics',
      'Build internal champions who can evangelize successful use cases',
    ],
    'AI-Proficient': [
      'Scale proven pilots across teams with standardized playbooks',
      'Invest in prompt engineering skills for your entire leadership team',
      'Create AI governance frameworks before they become blockers',
    ],
    'AI-Advanced': [
      'Architect AI-first workflows rather than retrofitting existing processes',
      'Develop proprietary AI applications that create competitive moats',
      'Build cross-functional AI councils to drive enterprise adoption',
    ],
    'AI-Leader': [
      'Shape industry standards and best practices for responsible AI use',
      'Mentor other leaders on their AI transformation journeys',
      'Explore emerging AI capabilities before they hit mainstream',
    ],
  };
  
  return baseInsights[tier] || baseInsights['AI-Emerging'];
}

function generatePromptTemplates(tier: LeadershipResults['tier'], personalization: Record<string, string>): string[] {
  const industry = personalization['p1'] || 'business';
  
  return [
    `Act as a ${industry} strategy consultant. Analyze this decision: [describe your decision]. Consider risks, opportunities, and a 90-day implementation plan.`,
    `You are my executive coach. I'm struggling with [describe challenge]. Give me 3 specific actions I can take this week.`,
    `Review this document as a critical but constructive peer: [paste document]. Focus on gaps in logic and missed opportunities.`,
  ];
}

function generateActionPlan(tier: LeadershipResults['tier'], growthAreas: string[]): string[] {
  const tierActions: Record<LeadershipResults['tier'], string[]> = {
    'AI-Emerging': [
      'This week: Spend 30 minutes with ChatGPT exploring one work challenge',
      'This month: Complete one AI-assisted project from start to finish',
      'This quarter: Build your first automated workflow',
    ],
    'AI-Developing': [
      'This week: Document your top 5 time-consuming tasks for AI evaluation',
      'This month: Pilot an AI tool with measurable before/after metrics',
      'This quarter: Present AI ROI to stakeholders with concrete data',
    ],
    'AI-Proficient': [
      'This week: Review and optimize your most-used AI prompts',
      'This month: Train a team member on your best AI practices',
      'This quarter: Launch a cross-functional AI initiative',
    ],
    'AI-Advanced': [
      'This week: Evaluate an emerging AI capability for early adoption',
      'This month: Create an AI playbook for your organization',
      'This quarter: Build a custom AI solution for a unique business need',
    ],
    'AI-Leader': [
      'This week: Share your AI insights with industry peers',
      'This month: Publish thought leadership on AI in your domain',
      'This quarter: Establish an AI innovation lab or council',
    ],
  };
  
  return tierActions[tier] || tierActions['AI-Emerging'];
}
