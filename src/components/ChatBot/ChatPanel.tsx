import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ChatMessage } from './ChatMessage';
import { useChatBot } from './useChatBot';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import krishHeadshot from '@/assets/krish-headshot.png';

interface ChatPanelProps {
  onClose: () => void;
}

const quickReplies = [
  "What's a 4-week sprint?",
  "I have a nervous decision about AI",
  "Am I a Builder or Orchestrator?",
  "I'm ready to start a conversation",
];

export const ChatPanel = ({ onClose }: ChatPanelProps) => {
  const isMobile = useIsMobile();
  const [inputValue, setInputValue] = useState('');
  const { messages, isLoading, error, sendMessage, clearHistory } = useChatBot();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const message = inputValue;
    setInputValue('');
    await sendMessage(message);
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const chatContent = (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-card">
        <Avatar className="h-10 w-10">
          <AvatarImage src={krishHeadshot} alt="Krish" />
          <AvatarFallback>K</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-sm">Ask Mindmaker</h3>
          <p className="text-xs text-muted-foreground">Mind Set &rarr; Mind Map &rarr; Mind Make</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={clearHistory}
          title="Clear chat history"
          className="h-8 w-8"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex gap-3 fade-in-up">
              <Avatar className="h-8 w-8">
                <AvatarImage src={krishHeadshot} alt="Krish" />
                <AvatarFallback>K</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg px-4 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}

          {error && (
            <div className="text-center text-sm text-destructive bg-destructive/10 rounded-lg p-2">
              {error}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Replies */}
      {messages.length <= 2 && !isLoading && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => handleQuickReply(reply)}
                className="text-xs h-7"
              >
                {reply}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border bg-card pb-safe-bottom">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask us anything..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Sheet open onOpenChange={(open) => !open && onClose()}>
        <SheetContent 
          side="bottom" 
          className="h-[85vh] p-0 flex flex-col border-t-2 [&>button]:hidden"
        >
          {chatContent}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-[380px] h-[600px] minimal-card bg-card flex flex-col shadow-2xl z-50 animate-scale-in border-2">
      {chatContent}
    </div>
  );
};
