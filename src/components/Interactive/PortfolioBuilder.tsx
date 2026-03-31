import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { usePortfolio } from '@/hooks/usePortfolio';
import { TrendingUp, Download, ArrowRight, Copy, Check, Mic } from 'lucide-react';
import { useSessionData } from '@/contexts/SessionDataContext';
import { generatePortfolioPDF } from '@/utils/pdfGenerator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { MindmakerIcon, MindmakerBadge } from '@/components/ui/MindmakerIcon';
import { ToolDrawerHeader } from '@/components/ui/tool-drawer-header';
import { InitialConsultModal } from '@/components/InitialConsultModal';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { VoiceInputButton } from '@/components/ui/VoiceInputButton';

interface PortfolioBuilderProps {
  compact?: boolean;
  onClose?: () => void;
}

interface MasterPrompt {
  title: string;
  prompt: string;
  framework?: string;
}

export const PortfolioBuilder = ({ compact = false, onClose }: PortfolioBuilderProps) => {
  const { tasks, toggleTask, updateTaskHours, getPortfolioData } = usePortfolio();
  const [showResults, setShowResults] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [masterPrompts, setMasterPrompts] = useState<MasterPrompt[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [resultTab, setResultTab] = useState<'overview' | 'prompts' | 'systems'>('overview');
  const [lastVoiceAction, setLastVoiceAction] = useState<string | null>(null);
  const portfolioData = getPortfolioData();
  const { setPortfolioBuilder } = useSessionData();
  const isMobile = useIsMobile();
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(timeoutId => clearTimeout(timeoutId));
      timeoutRefs.current = [];
    };
  }, []);

  const handleVoiceCommand = useCallback((transcript: string, isFinal: boolean) => {
    if (!isFinal || showResults || isGenerating) return;

    const lowerTranscript = transcript.toLowerCase().trim();
    
    // Check for select/deselect commands
    const selectMatch = lowerTranscript.match(/^(select|add|choose|pick)\s+(.+)/);
    const deselectMatch = lowerTranscript.match(/^(deselect|remove|unselect|drop)\s+(.+)/);
    const toggleMatch = lowerTranscript.match(/^(toggle)\s+(.+)/);

    let targetName: string | null = null;
    let action: 'select' | 'deselect' | 'toggle' = 'toggle';

    if (selectMatch) {
      targetName = selectMatch[2];
      action = 'select';
    } else if (deselectMatch) {
      targetName = deselectMatch[2];
      action = 'deselect';
    } else if (toggleMatch) {
      targetName = toggleMatch[2];
      action = 'toggle';
    } else {
      // Try to find a task name in the transcript
      targetName = lowerTranscript;
      action = 'toggle';
    }

    if (targetName) {
      // Fuzzy match task names
      const matchedTask = tasks.find(task => {
        const taskNameLower = task.name.toLowerCase();
        const targetWords = targetName!.split(/\s+/).filter(w => w.length > 2);
        const taskWords = taskNameLower.split(/\s+/).filter(w => w.length > 2);
        
        // Check for significant word matches
        const matchingWords = targetWords.filter(tw => 
          taskWords.some(tkw => tkw.includes(tw) || tw.includes(tkw))
        );
        
        return matchingWords.length >= 1 || taskNameLower.includes(targetName!);
      });

      if (matchedTask) {
        const shouldSelect = action === 'select' || (action === 'toggle' && !matchedTask.selected);
        const shouldDeselect = action === 'deselect' || (action === 'toggle' && matchedTask.selected);

        if ((shouldSelect && !matchedTask.selected) || (shouldDeselect && matchedTask.selected)) {
          toggleTask(matchedTask.id);
          setLastVoiceAction(`${shouldSelect ? 'Selected' : 'Deselected'}: ${matchedTask.name}`);
          toast.success(`${shouldSelect ? 'Selected' : 'Deselected'}: ${matchedTask.name}`);
          
          // Clear the action message after a delay
          const timeoutId = setTimeout(() => setLastVoiceAction(null), 2000);
          timeoutRefs.current.push(timeoutId);
        }
      }
    }
  }, [tasks, toggleTask, showResults, isGenerating]);

  const {
    isListening,
    transcript,
    isSupported: voiceSupported,
    error: voiceError,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceInput({
    silenceTimeout: 2500,
    onTranscript: handleVoiceCommand,
  });

  useEffect(() => {
    if (showResults) {
      setPortfolioBuilder({
        selectedTasks: portfolioData.tasks.map(t => ({
          name: t.name,
          hours: t.hoursPerWeek,
          savings: t.potentialSavings
        })),
        totalTimeSaved: portfolioData.totalTimeSaved,
        totalCostSavings: portfolioData.totalCostSavings
      });
    }
  }, [showResults, portfolioData.tasks, portfolioData.totalTimeSaved, portfolioData.totalCostSavings, setPortfolioBuilder]);

  const handleGenerate = async () => {
    if (portfolioData.tasks.length === 0) return;
    
    setIsGenerating(true);
    setShowResults(true);
    resetTranscript();
    
    const tasksSummary = portfolioData.tasks.map(t => 
      `- ${t.name}: ${t.hoursPerWeek}h/week currently, could save ${t.potentialSavings}h/week. Suggested tools: ${t.aiTools.join(', ')}`
    ).join('\n');

    try {
      const promptContent = `You are creating a personalized AI portfolio for a senior leader. Analyze their selected tasks and generate 3 interconnected, expert-level master prompts that work together as a system.

LEADER'S TASK PORTFOLIO:
${tasksSummary}

PORTFOLIO METRICS:
- Total time savings potential: ${portfolioData.totalTimeSaved}h/week
- Total value: $${portfolioData.totalCostSavings.toLocaleString()}/month
- Number of tasks: ${portfolioData.tasks.length}

YOUR ANALYSIS PROCESS:

1. **Pattern Recognition**:
   - What role does this portfolio suggest? (CEO strategic focus? COO operational? CPO product?)
   - What are the connections between tasks? (e.g., reporting feeds into planning)
   - What's the workflow sequence? (What happens first, then next?)
   - What's the biggest leverage point? (Which task, if solved, unlocks others?)

2. **Task Synergy Analysis**:
   - How do these tasks interconnect? (Data flows, dependencies, sequences)
   - What's the compound effect? (Solving task A makes task B 2x faster)
   - What's the implementation sequence? (Which to build first for maximum impact?)

3. **Role-Specific Context**:
   - CEO: Strategic thinking, decision-making, board communication
   - COO: Operational efficiency, team coordination, execution
   - CPO: Product strategy, user research, roadmap planning
   - GM: P&L management, cross-functional coordination
   - Tailor prompts to their likely role based on task patterns

4. **Prompt Design Principles**:
   - Each prompt should be copy-paste ready (NO placeholders)
   - Reference their specific tasks and time allocations
   - Include expected output format and quality criteria
   - Make prompts interconnected (output from prompt 1 feeds into prompt 2)
   - Include business impact reasoning ("This saves X hours because...")

5. **Framework Application**:
   - Apply different Mindmaker frameworks to different prompts
   - First-Principles: For strategic/planning tasks
   - Mental Contrasting: For goal-oriented tasks
   - Dialectical Reasoning: For decision-making tasks
   - A/B Framing: For evaluation/analysis tasks
   - Reflective Equilibrium: For alignment/values tasks

OUTPUT REQUIREMENTS:

Return ONLY a valid JSON array (no markdown, no explanation) with exactly 3 prompts:

[
  {
    "title": "A specific, memorable title that references their task combination (e.g., 'Strategic Planning Synthesis Engine' not 'Planning Prompt')",
    "framework": "The specific Mindmaker framework applied and WHY it fits this task",
    "prompt": "A complete, ready-to-use prompt (250-400 words) that: (1) Includes specific context from their task portfolio (reference task names, hours, tools), (2) Specifies input format (what they provide), (3) Defines output format (structure, length, style), (4) Includes quality criteria, (5) Explains business impact ('This saves X hours by...'), (6) Has NO placeholders - write it for their actual situation. Make it copy-paste ready for ChatGPT or Claude TODAY."
  },
  {
    "title": "Second prompt title (should connect to first prompt - show the system)",
    "framework": "...",
    "prompt": "Second prompt that either: (a) Uses output from first prompt as input, OR (b) Complements first prompt for a different task, OR (c) Builds on first prompt for deeper analysis. Show how these prompts work together."
  },
  {
    "title": "Third prompt title (completes the system)",
    "framework": "...",
    "prompt": "Third prompt that completes the interconnected system. Reference how all three prompts work together."
  }
]

QUALITY STANDARDS:

Your prompts should make the leader think:
- "These prompts are designed specifically for MY tasks"
- "I can see how these work together as a system"
- "This person understands my role and workflow"
- "I can use these TODAY and get immediate value"

If your prompts are generic templates, they're not good enough. If they don't reference their specific tasks, rewrite them. If they don't show interconnection, redesign them.

Return ONLY valid JSON array, no markdown or explanation.`;

      const { data, error } = await supabase.functions.invoke('chat-with-krish', {
        body: {
          messages: [
            {
              role: 'user',
              content: promptContent
            }
          ],
          widgetMode: 'tryit'
        }
      });

      if (error) throw new Error(error.message || 'API error');

      const responseText = data?.message || '';
      
      let parsed: any = null;
      
      try {
        const trimmed = responseText.trim();
        if (trimmed.startsWith('[')) {
          parsed = JSON.parse(trimmed);
        }
      } catch {
        const jsonMatch = responseText.match(/\[[\s\S]*?\](?=[^\]]*$)/);
        if (jsonMatch) {
          try {
            parsed = JSON.parse(jsonMatch[0]);
          } catch {
            const start = responseText.indexOf('[');
            const end = responseText.lastIndexOf(']');
            if (start !== -1 && end > start) {
              try {
                parsed = JSON.parse(responseText.slice(start, end + 1));
              } catch {}
            }
          }
        }
      }
      
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title && parsed[0].prompt) {
        const validatedPrompts = parsed.map((p: any) => ({
          title: p.title || 'AI Prompt',
          framework: p.framework || 'Mindmaker Methodology',
          prompt: p.prompt || ''
        })).filter((p: MasterPrompt) => p.prompt.length > 0);
        
        if (validatedPrompts.length > 0) {
          setMasterPrompts(validatedPrompts);
          return;
        }
      }
      
      setMasterPrompts(generateFallbackPrompts(portfolioData.tasks));
    } catch (err) {
      console.error('AI prompt generation failed:', err);
      setMasterPrompts(generateFallbackPrompts(portfolioData.tasks));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPrompt = async (prompt: string, index: number) => {
    await navigator.clipboard.writeText(prompt);
    setCopiedIndex(index);
    toast.success('Prompt copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownload = () => {
    const promptsForPDF = masterPrompts.length > 0 ? masterPrompts : generateFallbackPrompts(portfolioData.tasks);
    generatePortfolioPDF({
      ...portfolioData,
      masterPrompts: promptsForPDF,
    });
  };

  const handleVoiceStart = () => {
    resetTranscript();
    startListening();
  };

  const handleReset = () => {
    setShowResults(false);
    setMasterPrompts([]);
    resetTranscript();
  };

  // Compact mode remains unchanged
  if (compact) {
    if (showResults) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-mint/10 rounded-lg">
              <div className="text-lg font-bold text-mint-dark">{portfolioData.totalTimeSaved}h</div>
              <div className="text-[10px] text-muted-foreground">Saved/week</div>
            </div>
            <div className="text-center p-3 bg-gold/10 rounded-lg">
              <div className="text-lg font-bold text-gold">${(portfolioData.totalCostSavings / 1000).toFixed(0)}K</div>
              <div className="text-[10px] text-muted-foreground">Value/month</div>
            </div>
          </div>
          <Button size="sm" variant="outline" className="w-full" onClick={handleReset}>
            Edit Selection
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {tasks.slice(0, 3).map(task => (
          <div key={task.id} className="flex items-center gap-2">
            <Checkbox
              id={task.id}
              checked={task.selected}
              onCheckedChange={() => toggleTask(task.id)}
            />
            <label htmlFor={task.id} className="text-xs cursor-pointer truncate">
              {task.name}
            </label>
          </div>
        ))}
        <Button
          size="sm"
          className="w-full bg-mint text-ink hover:bg-mint/90"
          disabled={portfolioData.tasks.length === 0}
          onClick={handleGenerate}
        >
          Generate Portfolio
        </Button>
      </div>
    );
  }

  // Mobile full-screen wizard layout
  if (isMobile) {
    return (
      <div className="flex flex-col flex-1 min-h-0 h-full overflow-hidden">
        <ToolDrawerHeader 
          title="AI Portfolio Builder"
          onClose={onClose}
        />

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center p-8 text-center"
              >
                <MindmakerIcon size={48} animated />
                <h3 className="text-lg font-bold mt-4 mb-2">Generating Your Portfolio</h3>
                <p className="text-sm text-muted-foreground">
                  Creating personalized prompts using Mindmaker methodology...
                </p>
              </motion.div>
            ) : showResults ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col min-h-0 overflow-hidden"
              >
                {/* Tab Navigation */}
                <div className="flex border-b shrink-0">
                  {(['overview', 'prompts', 'systems'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setResultTab(tab)}
                      className={`flex-1 py-3 text-sm font-medium transition-colors ${
                        resultTab === tab
                          ? 'text-mint border-b-2 border-mint'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {tab === 'overview' ? 'Overview' : tab === 'prompts' ? 'Prompts' : 'Systems'}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-4 min-h-0">
                  <AnimatePresence mode="wait">
                    {resultTab === 'overview' && (
                      <motion.div
                        key="overview-tab"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-3"
                      >
                        <MindmakerBadge text="Your AI Portfolio" />
                        
                        <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/50">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-mint-dark">{portfolioData.totalTimeSaved}h</div>
                            <div className="text-xs text-muted-foreground">Saved/week</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gold">${(portfolioData.totalCostSavings / 1000).toFixed(0)}K</div>
                            <div className="text-xs text-muted-foreground">Value/month</div>
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-ink/5 border">
                          <TrendingUp className="h-5 w-5 text-mint mb-1.5" />
                          <p className="text-xs leading-relaxed">
                            Based on your selected tasks, you could transform <strong>{portfolioData.totalTimeSaved} hours</strong> of 
                            weekly work into AI-accelerated systems.
                          </p>
                        </div>
                      </motion.div>
                    )}
                    {resultTab === 'prompts' && (
                      <motion.div
                        key="prompts-tab"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-3"
                      >
                        {masterPrompts.map((prompt, i) => (
                          <div key={i} className="p-3 rounded-lg bg-muted/50 border">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="font-semibold text-sm">{prompt.title}</div>
                                {prompt.framework && (
                                  <div className="text-xs text-mint-dark flex items-center gap-1 mt-1">
                                    <MindmakerIcon size={12} />
                                    {prompt.framework}
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopyPrompt(prompt.prompt, i)}
                                className="shrink-0 min-w-[44px] min-h-[44px]"
                              >
                                {copiedIndex === i ? (
                                  <Check className="h-4 w-4 text-success" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground whitespace-pre-wrap bg-background p-3 rounded border max-h-[150px] overflow-y-auto" style={{
                              WebkitOverflowScrolling: 'touch'
                            }}>
                              {prompt.prompt}
                            </p>
                          </div>
                        ))}
                      </motion.div>
                    )}
                    {resultTab === 'systems' && (
                      <motion.div
                        key="systems-tab"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-2"
                      >
                        {portfolioData.tasks.map(task => (
                          <div key={task.id} className="p-3 rounded-lg bg-muted/50 border">
                            <div className="flex items-start justify-between mb-1.5">
                              <div className="font-semibold text-sm">{task.name}</div>
                              <div className="text-right">
                                <div className="text-base font-bold text-mint-dark">{task.potentialSavings}h</div>
                                <div className="text-[10px] text-muted-foreground">saved/wk</div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {task.aiTools.map((tool, i) => (
                                <span key={i} className="px-2 py-0.5 bg-mint/10 text-mint-dark rounded-full text-xs">
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Actions - Fixed CTA */}
                <div className="p-4 pt-3 border-t bg-background space-y-2 shrink-0">
                  <Button onClick={handleDownload} variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button
                    className="w-full bg-mint text-ink hover:bg-mint/90 font-bold"
                    onClick={() => openCalendlyPopup({ source: 'portfolio-builder' })}
                  >
                    Build This Portfolio →
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col min-h-0 overflow-hidden"
              >
                <div className="text-center p-4 shrink-0">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 overflow-hidden">Select Your Tasks</h3>
                  <p className="text-muted-foreground text-sm overflow-hidden">
                    Choose tasks to see your AI transformation potential
                  </p>
                </div>

                {/* Voice selection mode */}
                {voiceSupported && (
                  <div className="px-4 pb-3 shrink-0">
                    <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-muted/50 border">
                      <VoiceInputButton
                        isListening={isListening}
                        isSupported={voiceSupported}
                        error={voiceError}
                        onStart={handleVoiceStart}
                        onStop={stopListening}
                        size="md"
                        variant={isListening ? 'mobile-primary' : 'default'}
                      />
                      <div className="text-left">
                        <p className="text-sm font-medium">
                          {isListening ? 'Listening...' : 'Select by voice'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isListening ? 'Say a task name' : 'Say "select" + task name'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Voice action feedback */}
                    <AnimatePresence>
                      {lastVoiceAction && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-2 p-2 rounded-lg bg-mint/10 border border-mint/20 text-center"
                        >
                          <p className="text-sm text-mint-dark">{lastVoiceAction}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                  {tasks.map(task => (
                    <div key={task.id} className="p-4 rounded-xl border bg-muted/30">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id={task.id}
                          checked={task.selected}
                          onCheckedChange={() => toggleTask(task.id)}
                          className="mt-1"
                        />
                        <label htmlFor={task.id} className="flex-1 cursor-pointer">
                          <div className="font-semibold text-sm">{task.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {task.aiTools.slice(0, 2).join(', ')}
                          </div>
                        </label>
                      </div>

                      {task.selected && (
                        <div className="mt-4 ml-7 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                          <label className="text-xs text-muted-foreground">
                            Hours/week: <span className="font-bold text-foreground">{task.hoursPerWeek}h</span>
                          </label>
                          <Slider
                            value={[task.hoursPerWeek]}
                            onValueChange={([value]) => updateTaskHours(task.id, value)}
                            min={1}
                            max={20}
                            step={1}
                          />
                          <div className="text-xs text-mint-dark font-semibold">
                            → Could save {task.potentialSavings}h/week
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Button - Fixed at bottom */}
                <div className="p-4 border-t shrink-0 bg-background">
                  <Button
                    onClick={handleGenerate}
                    size="lg"
                    className="w-full bg-mint text-ink hover:bg-mint/90 font-bold"
                    disabled={portfolioData.tasks.length === 0}
                  >
                    Generate Portfolio
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Desktop layout
  if (showResults) {
    return (
      <div className="flex flex-col h-full max-h-[70vh] min-h-0">
        {/* Header - Fixed */}
        <div className="shrink-0 flex items-center justify-between mb-4 pb-4 border-b">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-mint" />
            Your AI Portfolio
          </h3>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Edit
          </Button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-2 -mr-2">
          <div className="space-y-6 pr-2">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-background">
              <div className="text-center">
                <div className="text-3xl font-bold text-mint-dark">{portfolioData.totalTimeSaved}h</div>
                <div className="text-xs text-muted-foreground">Saved per week</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold">${(portfolioData.totalCostSavings / 1000).toFixed(0)}K</div>
                <div className="text-xs text-muted-foreground">Value per month</div>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-2">
                <MindmakerIcon size={12} />
                YOUR PERSONALIZED PROMPTS
              </div>
              {isGenerating ? (
                <div className="p-6 rounded-lg bg-background border flex flex-col items-center justify-center">
                  <MindmakerIcon size={32} animated />
                  <p className="text-sm text-muted-foreground text-center mt-3">
                    Generating personalized prompts using Mindmaker methodology...
                  </p>
                </div>
              ) : masterPrompts.length > 0 ? (
                <div className="space-y-4">
                  {masterPrompts.map((prompt, i) => (
                    <div key={i} className="p-4 rounded-lg bg-background border">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold text-sm">{prompt.title}</div>
                          {prompt.framework && (
                            <div className="text-xs text-mint-dark flex items-center gap-1 mt-1">
                              <MindmakerIcon size={12} />
                              {prompt.framework}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyPrompt(prompt.prompt, i)}
                          className="shrink-0"
                        >
                          {copiedIndex === i ? (
                            <Check className="h-4 w-4 text-success" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-pre-wrap bg-muted/50 p-3 rounded mt-2 max-h-32 overflow-y-auto">
                        {prompt.prompt}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <details className="group">
              <summary className="text-xs font-bold text-muted-foreground mb-3 cursor-pointer list-none flex items-center gap-2">
                YOUR AI SYSTEMS
                <span className="text-mint text-[10px]">({portfolioData.tasks.length} selected)</span>
                <ArrowRight className="h-3 w-3 transition-transform group-open:rotate-90" />
              </summary>
              <div className="space-y-3 mt-3">
                {portfolioData.tasks.map(task => (
                  <div key={task.id} className="p-4 rounded-lg bg-background border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-semibold text-sm">{task.name}</div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Saves</div>
                        <div className="text-lg font-bold text-mint-dark">{task.potentialSavings}h/wk</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Current: {task.hoursPerWeek}h/week</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {task.aiTools.map((tool, i) => (
                          <span key={i} className="px-2 py-0.5 bg-mint/10 text-mint-dark rounded-full text-xs">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </div>

        {/* Fixed Buttons at Bottom */}
        <div className="shrink-0 flex flex-col sm:flex-row gap-3 pt-4 mt-4 border-t bg-background">
          <Button onClick={handleDownload} variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button 
            className="flex-1 bg-mint text-ink hover:bg-mint/90"
            onClick={() => openCalendlyPopup({ source: 'portfolio-builder' })}
          >
            Build This Portfolio →
          </Button>
        </div>
      </div>
    );
  }

  // Desktop input form - fixed height with scrollable content
  return (
    <div className="flex flex-col h-full max-h-[70vh] min-h-0">
      {/* Header - Fixed */}
      <div className="shrink-0 mb-4 pb-4 border-b">
        <h3 className="text-xl font-bold mb-2">Model out your starting points</h3>
        <p className="text-sm text-muted-foreground">
          Select your weekly tasks and see your personalized transformation roadmap
        </p>
      </div>

      {/* Voice selection mode for desktop */}
      {voiceSupported && (
        <div className="shrink-0 mb-4 p-3 rounded-lg bg-muted/50 border flex items-center gap-3">
          <VoiceInputButton
            isListening={isListening}
            isSupported={voiceSupported}
            error={voiceError}
            onStart={handleVoiceStart}
            onStop={stopListening}
            size="md"
          />
          <div>
            <p className="text-sm font-medium">
              {isListening ? 'Listening...' : 'Select tasks by voice'}
            </p>
            <p className="text-xs text-muted-foreground">
              Say "select" or "deselect" followed by the task name
            </p>
          </div>
          
          {/* Voice action feedback */}
          <AnimatePresence>
            {lastVoiceAction && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="ml-auto px-3 py-1.5 rounded-full bg-mint/10 border border-mint/20"
              >
                <p className="text-sm text-mint-dark">{lastVoiceAction}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-2 -mr-2">
        <div className="space-y-6 pr-2">
          {tasks.map(task => (
            <div key={task.id} className="space-y-3 pb-6 border-b last:border-0">
              <div className="flex items-start gap-3">
                <Checkbox
                  id={task.id}
                  checked={task.selected}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="mt-1"
                />
                <label htmlFor={task.id} className="flex-1 cursor-pointer">
                  <div className="font-semibold text-sm">{task.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Tools: {task.aiTools.slice(0, 2).join(', ')}
                  </div>
                </label>
              </div>

              {task.selected && (
                <div className="ml-7 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-xs text-muted-foreground">
                    Hours per week: <span className="font-bold text-foreground">{task.hoursPerWeek}h</span>
                  </label>
                  <Slider
                    value={[task.hoursPerWeek]}
                    onValueChange={([value]) => updateTaskHours(task.id, value)}
                    min={1}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                  {task.hoursPerWeek > 0 && (
                    <div className="text-xs text-mint-dark font-semibold">
                      → Could save {task.potentialSavings}h per week
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Button at Bottom */}
      <div className="shrink-0 pt-4 mt-4 border-t bg-background">
        <Button
          onClick={handleGenerate}
          size="lg"
          className="w-full bg-mint text-ink hover:bg-mint/90 font-bold"
          disabled={portfolioData.tasks.length === 0}
        >
          Generate Portfolio
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

// Fallback prompts when AI generation fails
function generateFallbackPrompts(tasks: Array<{ name: string; aiTools: string[] }>): MasterPrompt[] {
  const prompts: MasterPrompt[] = [];
  
  tasks.forEach(task => {
    const taskLower = task.name.toLowerCase();
    
    if (taskLower.includes('email') || taskLower.includes('communication')) {
      prompts.push({
        title: `Executive Communication Drafter`,
        framework: 'A/B Framing',
        prompt: `I need to draft a professional communication to my team about an important update. The key message is our strategic priority shift for this quarter. Write a clear, confident message that:
1. Opens with the key decision/update (don't bury the lead)
2. Explains the reasoning in 2-3 sentences
3. Addresses how this affects the team
4. Ends with clear next steps

Keep it under 200 words, professional but warm tone. Make it something I can send with minimal editing.`
      });
    } else if (taskLower.includes('report') || taskLower.includes('data')) {
      prompts.push({
        title: `Weekly Performance Analysis`,
        framework: 'First-Principles Thinking',
        prompt: `I'm sharing our key metrics for this week. Analyze this data and give me:
1. The 3 most important trends I should know about
2. Any anomalies or red flags that need immediate attention
3. One specific, actionable recommendation for next week
4. A one-paragraph executive summary I can share with leadership

Format this for a busy executive who has 2 minutes to review. Use bullet points, be direct, highlight what matters.`
      });
    } else if (taskLower.includes('meeting') || taskLower.includes('notes')) {
      prompts.push({
        title: `Meeting Summary Generator`,
        framework: 'Reflective Equilibrium',
        prompt: `Here are my raw notes from today's leadership meeting. Transform these into a shareable summary with:
1. Executive summary (3 sentences max - what does the reader NEED to know?)
2. Decisions made (what was decided and by whom)
3. Action items with owners and deadlines (table format)
4. Open questions for next meeting
5. Key quotes worth remembering

Format this so I can paste it directly into Slack or email to the team.`
      });
    } else if (taskLower.includes('strategic') || taskLower.includes('planning') || taskLower.includes('analysis')) {
      prompts.push({
        title: `Strategic Analysis Framework`,
        framework: 'Dialectical Reasoning',
        prompt: `I'm working through a strategic decision and want to apply structured thinking. Help me analyze this using the dialectical method:

1. THESIS: What's the strongest case FOR this direction?
2. ANTITHESIS: What's the strongest case AGAINST?
3. SYNTHESIS: What path captures the benefits while mitigating the risks?
4. FIRST-PRINCIPLES CHECK: What are we assuming that might not be true?
5. RECOMMENDATION: Given all this, what should we actually do?

Be direct, challenge my thinking, and give me a clear recommendation with reasoning.`
      });
    } else if (taskLower.includes('research') || taskLower.includes('market') || taskLower.includes('competitive')) {
      prompts.push({
        title: `Competitive Intelligence Brief`,
        framework: 'Mental Contrasting',
        prompt: `I need a quick competitive intelligence brief on our market. Research and provide:
1. Key moves by our top 3 competitors in the last 90 days
2. Emerging trends that could affect our positioning
3. Gaps in the market we could potentially exploit
4. Questions we should be asking internally based on this analysis

Keep it to one page, cite sources where possible, and end with 2-3 specific recommendations for our team.`
      });
    } else {
      prompts.push({
        title: `${task.name} Accelerator`,
        framework: 'First-Principles Thinking',
        prompt: `I'm a senior leader working on ${task.name.toLowerCase()}. I need to move faster on this without sacrificing quality.

Help me by:
1. Identifying the 20% of this work that drives 80% of the value
2. Suggesting how AI tools (specifically ${task.aiTools.slice(0, 2).join(' or ')}) could accelerate each step
3. Creating a draft framework or template I can use immediately
4. Flagging potential pitfalls so I avoid common mistakes

Be direct and practical. I want to implement this today, not someday.`
      });
    }
  });

  if (prompts.length < 2) {
    prompts.push({
      title: 'First-Principles Decision Framework',
      framework: 'First-Principles Thinking',
      prompt: `I'm facing a strategic decision and want to think through it rigorously. Apply first-principles thinking:

1. What's the fundamental problem I'm actually trying to solve? (Strip away the symptoms)
2. What are we assuming that might not be true?
3. If we started from scratch with no constraints, what would we do?
4. What's the minimum viable test to validate our hypothesis?
5. What would change our mind about this direction?

Then give me a clear recommendation with your reasoning. Be willing to tell me if I'm thinking about this wrong.`
    });
  }

  return prompts;
}
