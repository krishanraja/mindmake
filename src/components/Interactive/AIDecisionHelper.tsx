import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MarkdownResponse } from '@/components/ui/markdown-response';
import { useIsMobile } from '@/hooks/use-mobile';
import { MindmakerIcon, MindmakerBadge } from '@/components/ui/MindmakerIcon';
import { ToolDrawerHeader } from '@/components/ui/tool-drawer-header';
import { InitialConsultModal } from '@/components/InitialConsultModal';
import { useSessionData } from '@/contexts/SessionDataContext';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { VoiceInputButton, VoiceFirstPrompt, InlineVoiceButton } from '@/components/ui/VoiceInputButton';

interface TryItWidgetProps {
  compact?: boolean;
  onClose?: () => void;
}

export const TryItWidget = ({ compact = false, onClose }: TryItWidgetProps) => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const { sessionData } = useSessionData();
  const isMobile = useIsMobile();

  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported: voiceSupported,
    error: voiceError,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceInput({
    silenceTimeout: 2500,
    onTranscript: (text, isFinal) => {
      if (isFinal) {
        setInput(prev => prev + text);
      }
    },
  });

  // Update input with interim transcript for real-time feedback
  useEffect(() => {
    if (interimTranscript && isListening) {
      // Show interim in a visual way but don't set as final
    }
  }, [interimTranscript, isListening]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setResponse('');
    resetTranscript();

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-krish', {
        body: {
          messages: [
            {
              role: 'user',
              content: input
            }
          ],
          widgetMode: 'tryit'
        }
      });

      if (error) throw new Error(error.message || 'API error');

      const message = data?.message;
      if (!message || message.trim() === '') {
        throw new Error('Empty response received');
      }

      setResponse(message);
    } catch (error: any) {
      console.error('Error:', error);
      if (error.message?.includes('429')) {
        toast.error('Rate limit exceeded. Please try again in a moment.');
      } else if (error.message?.includes('402')) {
        toast.error('Service temporarily unavailable. Please try again later.');
      } else {
        toast.error('Failed to get response. Please try again.');
      }
      setResponse("I'm having trouble connecting right now. Here's what I'd suggest:\n\n**For your AI decision**, consider first-principles thinking: What's the fundamental problem you're actually trying to solve? Strip away assumptions and start from the core need.\n\n[Start a Sprint](/sprints) to work through this with Mindmaker.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceStart = () => {
    resetTranscript();
    startListening();
  };

  const handleReset = () => {
    setResponse('');
    setInput('');
    setShowTextInput(false);
    resetTranscript();
  };

  if (compact) {
    return (
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Textarea
              value={input + (isListening ? interimTranscript : '')}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., Should we build or buy our AI chatbot?"
              className="min-h-[100px] resize-none text-sm pr-12"
              disabled={isLoading}
            />
            {voiceSupported && (
              <div className="absolute bottom-2 right-2">
                <InlineVoiceButton
                  isListening={isListening}
                  isSupported={voiceSupported}
                  error={voiceError}
                  onStart={handleVoiceStart}
                  onStop={stopListening}
                />
              </div>
            )}
          </div>
          
          <Button
            type="submit"
            size="sm"
            className="w-full bg-mint text-ink hover:bg-mint/90 font-bold"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Thinking...
              </>
            ) : (
              'Get Clarity'
            )}
          </Button>
        </form>

        <AnimatePresence>
          {response && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="pt-4 border-t border-border"
            >
              <MindmakerBadge text="Mindmaker Framework Applied" className="mb-3" />
              <MarkdownResponse 
                content={response} 
                className="text-xs text-muted-foreground leading-relaxed max-h-[300px] overflow-y-auto"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Mobile full-screen wizard layout
  if (isMobile) {
    return (
      <div className="flex flex-col h-full min-h-0 overflow-hidden">
        <ToolDrawerHeader 
          title="AI Decision Helper"
          onClose={onClose}
        />

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center p-8 text-center"
              >
                <MindmakerIcon size={64} animated />
                <h3 className="text-lg font-bold mt-4 mb-2">Thinking...</h3>
                <p className="text-sm text-muted-foreground">
                  Applying cognitive frameworks to your decision
                </p>
              </motion.div>
            ) : response ? (
              <motion.div
                key="response"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col"
              >
                {/* Response content */}
                <div className="flex-1 overflow-y-auto p-4">
                  <MindmakerBadge text="Mindmaker Framework Applied" className="mb-4" />
                  <MarkdownResponse 
                    content={response} 
                    className="text-sm leading-relaxed"
                  />
                </div>

                {/* Actions */}
                <div className="p-4 border-t space-y-3">
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                    onClick={handleReset}
                  >
                    Ask Another Question
                  </Button>
                  <Button
                    className="w-full bg-mint text-ink hover:bg-mint/90"
                    onClick={() => openCalendlyPopup({ source: 'ai-decision-helper' })}
                  >
                    Start a Sprint
                  </Button>
                </div>
              </motion.div>
            ) : !showTextInput && voiceSupported ? (
              <motion.div
                key="voice-first"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col"
              >
                <div className="text-center p-4 pt-6">
                  <h3 className="text-xl font-bold mb-2">Stuck on an AI Decision?</h3>
                  <p className="text-muted-foreground text-sm">
                    Speak your challenge. Get instant clarity.
                  </p>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-4">
                  <VoiceInputButton
                    isListening={isListening}
                    isSupported={voiceSupported}
                    error={voiceError}
                    onStart={handleVoiceStart}
                    onStop={stopListening}
                    size="xl"
                    variant="mobile-primary"
                    showLabel
                    label={isListening ? 'Listening...' : 'Tap to speak'}
                  />

                  {/* Show transcript as it's being recorded */}
                  <AnimatePresence>
                    {(input || interimTranscript) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-6 p-4 rounded-xl bg-muted/50 border max-w-sm text-center"
                      >
                        <p className="text-sm">
                          {input}
                          {isListening && interimTranscript && (
                            <span className="text-muted-foreground">{interimTranscript}</span>
                          )}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={() => setShowTextInput(true)}
                    className="mt-6 text-xs text-mint-dark underline underline-offset-2 hover:text-mint transition-colors"
                  >
                    or type your question
                  </button>
                </div>

                {/* Submit button when there's voice input */}
                {input && !isListening && (
                  <div className="p-4 border-t">
                    <Button
                      onClick={() => handleSubmit()}
                      size="lg"
                      className="w-full bg-mint text-ink hover:bg-mint/90 font-bold"
                    >
                      Get Instant Clarity
                    </Button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col p-4"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">Stuck on an AI Decision?</h3>
                  <p className="text-muted-foreground text-sm">
                    Describe your challenge. Get instant clarity.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                  <div className="relative flex-1">
                    <Textarea
                      value={input + (isListening ? interimTranscript : '')}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Example: Should we build or buy our AI chatbot? We have limited engineering resources but need something in production within 3 months..."
                      className="flex-1 min-h-[150px] h-full resize-none text-base pr-14"
                      disabled={isLoading}
                    />
                    {voiceSupported && (
                      <div className="absolute bottom-3 right-3">
                        <VoiceInputButton
                          isListening={isListening}
                          isSupported={voiceSupported}
                          error={voiceError}
                          onStart={handleVoiceStart}
                          onStop={stopListening}
                          size="md"
                        />
                      </div>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full mt-4 bg-mint text-ink hover:bg-mint/90 font-bold"
                    disabled={isLoading || !input.trim()}
                  >
                    Get Instant Clarity
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex flex-col h-full max-h-[70vh] min-h-0">
      {/* Header - Fixed */}
      <div className="shrink-0 text-center mb-4 pb-4 border-b">
        <h3 className="text-2xl font-bold mb-2">Stuck on an AI Decision?</h3>
        <p className="text-muted-foreground">
          Describe your challenge. Get instant clarity.
        </p>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-2 -mr-2">
        <div className="pr-2">
          {!response ? (
            <div className="space-y-4">
              <div className="relative">
                <Textarea
                  value={input + (isListening ? interimTranscript : '')}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Example: Should we build or buy our AI chatbot? We have limited engineering resources but need something in production within 3 months..."
                  className="min-h-[120px] resize-none text-base pr-14"
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      handleSubmit(e as any);
                    }
                  }}
                />
                {voiceSupported && (
                  <div className="absolute bottom-3 right-3">
                    <VoiceInputButton
                      isListening={isListening}
                      isSupported={voiceSupported}
                      error={voiceError}
                      onStart={handleVoiceStart}
                      onStop={stopListening}
                      size="md"
                    />
                  </div>
                )}
              </div>
              
              {/* Voice status indicator */}
              <AnimatePresence>
                {isListening && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-center gap-2 text-sm text-mint"
                  >
                    <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
                    Listening... speak your question
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <MindmakerBadge text="Mindmaker Framework Applied" />
                <MarkdownResponse 
                  content={response} 
                  className="text-sm text-muted-foreground leading-relaxed"
                />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Fixed Buttons at Bottom */}
      <div className="shrink-0 pt-4 mt-4 border-t bg-background">
        {!response ? (
          <Button
            type="submit"
            size="lg"
            className="w-full bg-mint text-ink hover:bg-mint/90 font-bold"
            disabled={isLoading || !input.trim()}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Organizing your thinking...
              </>
            ) : (
              'Get Instant Clarity'
            )}
          </Button>
        ) : (
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10"
              onClick={handleReset}
            >
              Ask Another Question
            </Button>
            <Button
              size="lg"
              className="w-full bg-mint text-ink hover:bg-mint/90"
              onClick={() => setConsultModalOpen(true)}
            >
              Start a Sprint
            </Button>
          </div>
        )}
      </div>
      
      {/* Consult Modal */}
      <InitialConsultModal
        open={consultModalOpen}
        onOpenChange={setConsultModalOpen}
        preselectedProgram={sessionData.qualificationData?.preselectedProgram || "build"}
        commitmentLevel={sessionData.qualificationData?.commitmentLevel}
        audienceType={sessionData.qualificationData?.audienceType}
        pathType={sessionData.qualificationData?.pathType || "build"}
      />
    </div>
  );
};
