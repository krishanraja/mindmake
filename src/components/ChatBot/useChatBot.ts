import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: "I'm Mindmaker's AI. We help leaders move from AI chaos to calm: Mind Set → Mind Map → Mind Make. What's your nervous decision? Name it, and we'll help you get clarity.",
  timestamp: new Date(),
};

export const useChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Use ref to track latest messages without causing dependency issues
  const messagesRef = useRef<Message[]>([WELCOME_MESSAGE]);
  const isMountedRef = useRef(true);
  const cancelRef = useRef(false);

  // Keep ref in sync with state
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Set up mounted ref
  useEffect(() => {
    isMountedRef.current = true;
    cancelRef.current = false;
    return () => {
      isMountedRef.current = false;
      cancelRef.current = true;
    };
  }, []);

  // Clear chat history on mount (fresh start every reload)
  useEffect(() => {
    localStorage.removeItem('krish-chat-history');
    const welcome = { ...WELCOME_MESSAGE, timestamp: new Date() };
    setMessages([welcome]);
    messagesRef.current = [welcome];
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !isMountedRef.current) return;

    // Reset cancellation flag for new request
    cancelRef.current = false;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Use ref to get current messages without dependency on messages array
      const currentMessages = [...messagesRef.current, userMessage];
      
      const { data, error: functionError } = await supabase.functions.invoke('chat-with-krish', {
        body: {
          messages: currentMessages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        },
      });

      if (functionError) throw functionError;

      if (cancelRef.current || !isMountedRef.current) return; // Component unmounted or cancelled, don't update state

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data?.message ?? 'Unable to get response.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      if (cancelRef.current || !isMountedRef.current) return; // Component unmounted or cancelled, don't update state
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
      
      // Remove the user message on error
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    } finally {
      if (!cancelRef.current && isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []); // No dependencies - using ref for messages and functional updates for state

  const clearHistory = useCallback(() => {
    localStorage.removeItem('krish-chat-history');
    setMessages([{ ...WELCOME_MESSAGE, timestamp: new Date() }]);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearHistory,
  };
};
