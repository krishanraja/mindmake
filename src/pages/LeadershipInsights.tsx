import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLeadershipInsights } from '@/hooks/useLeadershipInsights';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowRight, 
  Clock, 
  Sparkles, 
  User, 
  Mail, 
  Building2, 
  Target,
  ChevronDown,
  ChevronUp,
  Brain,
  TrendingUp,
  Zap,
  CheckCircle2,
  Lightbulb,
  MessageSquare,
  ClipboardList
} from 'lucide-react';
import { SEO } from '@/components/SEO';

// Logo component
const MindmakerLogo = () => (
  <div className="flex items-center gap-2">
    <div className="flex gap-0.5">
      <div className="w-3 h-6 bg-ink rounded-sm" />
      <div className="w-3 h-4 bg-mint rounded-sm mt-2" />
    </div>
    <span className="font-gobold text-xl tracking-tight">MINDMAKER</span>
  </div>
);

// Viewport-safe container for mobile
const ViewportContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-[100dvh] flex flex-col bg-background">
    {/* Account for mobile browser chrome - use 100dvh (dynamic viewport height) */}
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
      {children}
    </div>
  </div>
);

// Card wrapper with consistent styling
const DiagnosticCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
    className={`w-full max-w-lg bg-white rounded-lg shadow-lg border border-border p-6 sm:p-8 ${className}`}
    style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 0px))' }}
  >
    {children}
  </motion.div>
);

const LeadershipInsights = () => {
  const {
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
    getTimeRemaining,
    startDiagnostic,
    answerQuestion,
    nextQuestion,
    skipPersonalization,
    startPersonalization,
    answerPersonalization,
    nextPersonalizationQuestion,
    reset,
  } = useLeadershipInsights();

  // Unlock form state
  const [unlockFormOpen, setUnlockFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    aiFocus: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(timeoutId => clearTimeout(timeoutId));
      timeoutRefs.current = [];
    };
  }, []);

  const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      setErrorMessage('Please fill in your name and email.');
      setSubmitStatus('error');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    
    try {
      // Send email via edge function
      const { error } = await supabase.functions.invoke('send-leadership-insights-email', {
        body: {
          name: formData.name,
          email: formData.email,
          department: formData.department,
          aiFocus: formData.aiFocus,
          results: results,
        },
      });
      
      if (error) throw error;
      
      setSubmitStatus('success');
    } catch (err: any) {
      console.error('Failed to submit:', err);
      setErrorMessage('Something went wrong. Please try again.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, results]);

  // Generation phase labels
  const generationPhases = [
    { label: 'Analyzing', icon: Brain, threshold: 33 },
    { label: 'Generating', icon: TrendingUp, threshold: 66 },
    { label: 'Preparing', icon: Target, threshold: 100 },
  ];

  const getCurrentGenerationPhase = () => {
    if (generationProgress < 33) return 0;
    if (generationProgress < 66) return 1;
    return 2;
  };

  return (
    <>
      <SEO 
        title="Decision Readiness Diagnostic | The Mindmaker"
        description="Identify your nervous decisions about AI, find out if you're a Builder or Orchestrator, and get a recommended sprint in 10 minutes."
        canonical="/leaders"
        keywords="AI decision readiness, nervous decisions AI, executive AI diagnostic, builder orchestrator assessment, AI sprint recommendation"
      />
      
      <AnimatePresence mode="wait">
        {/* INTRO PHASE */}
        {phase === 'intro' && (
          <ViewportContainer key="intro">
            {/* Header */}
            <div className="w-full max-w-lg mb-6 flex items-center justify-between">
              <MindmakerLogo />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                <span>Sample</span>
              </div>
            </div>
            
            <DiagnosticCard>
              <h1 className="font-gobold text-2xl sm:text-3xl text-ink leading-tight mb-4">
                WHAT'S YOUR NERVOUS DECISION?
              </h1>
              
              <p className="text-muted-foreground mb-6">
                Spend 10 minutes mapping how AI fits your role. Get practical next steps 
                and the questions you'll need when vendors or staff bring AI to your door.
              </p>
              
              <Button
                onClick={startDiagnostic}
                className="w-full bg-ink text-white hover:bg-ink/90 h-12 text-base font-semibold"
              >
                Start diagnostic
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border/50 text-center">
                <p className="text-xs text-muted-foreground">
                  Want something quicker?{" "}
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('openActionsHub'))}
                    className="text-mint font-medium hover:underline"
                  >
                    Try our instant AI tools
                  </button>
                </p>
              </div>
            </DiagnosticCard>
          </ViewportContainer>
        )}

        {/* QUESTIONS PHASE */}
        {phase === 'questions' && currentQuestion && (
          <ViewportContainer key="questions">
            <DiagnosticCard>
              {/* Progress Header */}
              <div className="mb-6 pt-safe-top">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-lg overflow-hidden">Benchmark Progress</h2>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    <Clock className="w-3 h-3" />
                    <span>{currentQuestionIndex + 1}/{totalQuestions}</span>
                  </div>
                </div>
                
                {/* Progress bar that only moves forward */}
                <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
                  <motion.div
                    className="h-full bg-ink"
                    initial={{ width: `${(currentQuestionIndex / totalQuestions) * 100}%` }}
                    animate={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </div>
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Phase: {currentQuestion.phase}</span>
                  <span>{getTimeRemaining()}</span>
                </div>
              </div>

              {/* Question */}
              <div className="mb-6">
                <h3 className="font-bold text-lg sm:text-xl mb-2 overflow-hidden">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </h3>
                <p className="text-muted-foreground overflow-hidden">
                  {currentQuestion.question}
                </p>
              </div>

              {/* Answer Options */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground mb-3">Select your answer:</p>
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      answerQuestion(currentQuestion.id, option.value);
                      // Auto-advance after short delay
                      const timeoutId = setTimeout(() => nextQuestion(), 200);
                      timeoutRefs.current.push(timeoutId);
                    }}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all flex items-center gap-3 touch-target ${
                      answers[currentQuestion.id] === option.value
                        ? 'border-mint bg-mint/10 font-semibold'
                        : 'border-border hover:border-mint/50 hover:bg-mint/5'
                    }`}
                  >
                    <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </DiagnosticCard>
          </ViewportContainer>
        )}

        {/* PERSONALIZATION PROMPT PHASE */}
        {phase === 'personalization-prompt' && (
          <ViewportContainer key="personalization-prompt">
            <DiagnosticCard>
              <div className="text-center">
                <div className="w-12 h-12 bg-mint/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-mint-dark" />
                </div>
                
                <p className="text-sm text-mint-dark font-medium mb-2">10x personalization</p>
                
                <h2 className="font-bold text-xl mb-3">Quick personalization?</h2>
                
                <p className="text-muted-foreground mb-6">
                  10 more questions = prompts tailored to your exact workflow.
                </p>
                
                <Button
                  onClick={startPersonalization}
                  className="w-full bg-mint text-ink hover:bg-mint/90 h-12 text-base font-semibold mb-3"
                >
                  Yes, personalize it
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                
                <button
                  onClick={skipPersonalization}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Skip for now
                </button>
              </div>
            </DiagnosticCard>
          </ViewportContainer>
        )}

        {/* PERSONALIZATION QUESTIONS PHASE */}
        {phase === 'personalization' && currentPersonalizationQuestion && (
          <ViewportContainer key="personalization">
            <DiagnosticCard>
              {/* Progress Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-lg">Personalization</h2>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    <span>{personalizationIndex + 1}/{totalPersonalizationQuestions}</span>
                  </div>
                </div>
                
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-mint"
                    initial={{ width: `${(personalizationIndex / totalPersonalizationQuestions) * 100}%` }}
                    animate={{ width: `${((personalizationIndex + 1) / totalPersonalizationQuestions) * 100}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-4">
                  {currentPersonalizationQuestion.question}
                </h3>
              </div>

              {/* Answer Options */}
              <div className="space-y-2">
                {currentPersonalizationQuestion.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      answerPersonalization(currentPersonalizationQuestion.id, option);
                      const timeoutId = setTimeout(() => nextPersonalizationQuestion(), 200);
                      timeoutRefs.current.push(timeoutId);
                    }}
                    className="w-full p-4 rounded-lg border-2 text-left transition-all flex items-center gap-3 touch-target border-border hover:border-mint/50 hover:bg-mint/5"
                  >
                    <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span>{option}</span>
                  </button>
                ))}
              </div>
            </DiagnosticCard>
          </ViewportContainer>
        )}

        {/* GENERATING PHASE */}
        {phase === 'generating' && (
          <ViewportContainer key="generating">
            <DiagnosticCard>
              <div className="text-center">
                <MindmakerLogo />
                
                <h2 className="font-bold text-xl mt-6 mb-2">
                  Creating Your AI Leadership Insights
                </h2>
                
                <p className="text-muted-foreground mb-6">
                  Building your custom AI toolkit and action plan...
                </p>
                
                {/* Progress bar that NEVER regresses */}
                <div className="mb-4">
                  <div className="h-3 bg-muted rounded-full overflow-hidden mb-2">
                    <motion.div
                      className="h-full"
                      style={{
                        background: 'linear-gradient(90deg, hsl(var(--ink)) 0%, hsl(var(--mint)) 100%)',
                      }}
                      initial={{ width: '0%' }}
                      animate={{ width: `${generationProgress}%` }}
                      transition={{ duration: 0.1, ease: 'linear' }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {generationPhases[getCurrentGenerationPhase()].label}
                    </span>
                    <span className="font-medium">{generationProgress}%</span>
                  </div>
                </div>
                
                {/* Phase indicators */}
                <div className="flex justify-center gap-6 mt-6">
                  {generationPhases.map((p, i) => {
                    const Icon = p.icon;
                    const isActive = getCurrentGenerationPhase() === i;
                    const isComplete = generationProgress >= p.threshold;
                    
                    return (
                      <div 
                        key={p.label} 
                        className={`flex flex-col items-center gap-2 transition-opacity ${
                          isActive ? 'opacity-100' : 'opacity-50'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isComplete ? 'bg-mint/30' : isActive ? 'bg-mint/20' : 'bg-muted'
                        }`}>
                          <Icon className={`w-5 h-5 ${isComplete || isActive ? 'text-mint-dark' : 'text-muted-foreground'}`} />
                        </div>
                        <span className="text-xs text-muted-foreground">{p.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </DiagnosticCard>
          </ViewportContainer>
        )}

        {/* RESULTS PHASE */}
        {phase === 'results' && results && (
          <div key="results" className="min-h-screen bg-background pb-8">
            {/* Results Header */}
            <div className="bg-gradient-to-b from-mint/10 to-background pt-6 pb-8 px-4">
              <div className="max-w-lg mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <MindmakerLogo />
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-lg border border-border p-6"
                >
                  <h1 className="font-bold text-xl mb-1">Decision Readiness Diagnostic</h1>
                  <p className="text-sm text-muted-foreground mb-4">Identify your nervous decisions and the right sprint</p>
                  
                  {/* Score Display */}
                  <div className="text-center py-4">
                    <div className="text-5xl font-bold text-ink">
                      {results.score}<span className="text-2xl text-muted-foreground">/100</span>
                    </div>
                    <div className="inline-block px-3 py-1 bg-muted rounded-full text-sm font-medium mt-2">
                      {results.tier}
                    </div>
                  </div>
                  
                  {/* Percentile */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4 mt-4">
                    <span>vs 500+ executives</span>
                    <span>Top {100 - results.percentile}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                    <div 
                      className="h-full bg-mint" 
                      style={{ width: `${results.percentile}%` }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Free Value Sections */}
            <div className="max-w-lg mx-auto px-4 space-y-4">
              {/* Strengths */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow border border-border p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </div>
                  <h2 className="font-bold">Your Strengths</h2>
                </div>
                <ul className="space-y-2">
                  {results.strengths.map((strength, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Growth Areas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow border border-border p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="font-bold">Growth Opportunities</h2>
                </div>
                <ul className="space-y-2">
                  {results.growthAreas.map((area, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Target className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Strategic Insights (Free preview) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow border border-border p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="font-bold">Strategic Insights</h2>
                </div>
                <ul className="space-y-3">
                  {results.strategicInsights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 flex-shrink-0">
                        {i + 1}
                      </span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Prompt Coach CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-lg shadow border border-border p-5 text-center"
              >
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-6 h-6 text-muted-foreground" />
                </div>
                <h2 className="font-bold mb-2">Practice Your Prompts</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Test any AI prompt before you use it. Get instant feedback on what's working.
                </p>
                <Button 
                  variant="outline" 
                  className="bg-ink text-white hover:bg-ink/90"
                  onClick={() => window.location.href = '/#problem'}
                >
                  Try Prompt Coach
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>

              {/* Unlock Full Results - Collapsible */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-lg shadow border border-mint/30 overflow-hidden"
              >
                <Collapsible open={unlockFormOpen} onOpenChange={setUnlockFormOpen}>
                  <CollapsibleTrigger className="w-full p-5 flex items-center justify-between hover:bg-mint/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-mint/20 rounded-full flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-mint-dark" />
                      </div>
                      <div className="text-left">
                        <h2 className="font-bold">Unlock Your Full Results</h2>
                        <p className="text-sm text-muted-foreground">
                          Personalized prompts, peer comparison & strategic insights
                        </p>
                      </div>
                    </div>
                    {unlockFormOpen ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="px-5 pb-5 border-t">
                      {submitStatus === 'success' ? (
                        <div className="py-8 text-center">
                          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8 text-success" />
                          </div>
                          <h3 className="font-bold text-lg mb-2">Results Sent!</h3>
                          <p className="text-muted-foreground">
                            Check your email for your complete AI leadership insights.
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleFormSubmit} className="pt-5 space-y-4">
                          <p className="text-xs text-muted-foreground text-center mb-4">
                            Your data is used solely to personalize your results. 
                            We never share or sell your information.
                          </p>
                          
                          {/* Name */}
                          <div>
                            <Label className="flex items-center gap-2 text-sm font-medium mb-2">
                              <User className="w-4 h-4" />
                              Full Name
                            </Label>
                            <Input
                              type="text"
                              placeholder="Your name"
                              value={formData.name}
                              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                              className="h-12"
                            />
                          </div>
                          
                          {/* Email */}
                          <div>
                            <Label className="flex items-center gap-2 text-sm font-medium mb-2">
                              <Mail className="w-4 h-4" />
                              Work Email
                            </Label>
                            <Input
                              type="email"
                              placeholder="you@company.com"
                              value={formData.email}
                              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                              className="h-12"
                            />
                          </div>
                          
                          {/* Department */}
                          <div>
                            <Label className="flex items-center gap-2 text-sm font-medium mb-2">
                              <Building2 className="w-4 h-4" />
                              Department
                            </Label>
                            <Select 
                              value={formData.department} 
                              onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                            >
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="executive">Executive / C-Suite</SelectItem>
                                <SelectItem value="operations">Operations</SelectItem>
                                <SelectItem value="marketing">Marketing</SelectItem>
                                <SelectItem value="sales">Sales</SelectItem>
                                <SelectItem value="product">Product</SelectItem>
                                <SelectItem value="engineering">Engineering</SelectItem>
                                <SelectItem value="hr">HR / People</SelectItem>
                                <SelectItem value="finance">Finance</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {/* AI Focus */}
                          <div>
                            <Label className="flex items-center gap-2 text-sm font-medium mb-2">
                              <Target className="w-4 h-4" />
                              Primary AI Focus
                            </Label>
                            <Select 
                              value={formData.aiFocus} 
                              onValueChange={(value) => setFormData(prev => ({ ...prev, aiFocus: value }))}
                            >
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="What's your main AI goal?" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="productivity">Boost productivity</SelectItem>
                                <SelectItem value="decisions">Better decisions</SelectItem>
                                <SelectItem value="automation">Automate workflows</SelectItem>
                                <SelectItem value="innovation">Drive innovation</SelectItem>
                                <SelectItem value="strategy">AI strategy</SelectItem>
                                <SelectItem value="team">Train my team</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {/* Error message */}
                          {submitStatus === 'error' && (
                            <p className="text-sm text-destructive text-center">{errorMessage}</p>
                          )}
                          
                          {/* Submit */}
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-mint text-ink hover:bg-mint/90 h-12 text-base font-semibold"
                          >
                            {isSubmitting ? (
                              'Sending...'
                            ) : (
                              <>
                                See My Results
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </>
                            )}
                          </Button>
                        </form>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </motion.div>

              {/* Retake */}
              <div className="text-center pt-4">
                <button
                  onClick={reset}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Retake assessment
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LeadershipInsights;
