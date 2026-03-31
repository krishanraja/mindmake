import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';

interface MarkdownResponseProps {
  content: string;
  className?: string;
}

export const MarkdownResponse = ({ content, className = '' }: MarkdownResponseProps) => {
  const markdownComponents = {
    p: ({ children }: any) => (
      <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
    ),
    strong: ({ children }: any) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-foreground/90">{children}</em>
    ),
    a: ({ href, children }: any) => {
      const isCalendly = href?.includes('calendly.com');
      const isPathway = href?.includes('#pathways') || href?.startsWith('/');
      
      if (isCalendly) {
        return (
          <Button
            variant="default"
            size="sm"
            onClick={() => window.open(href, '_blank')}
            className="my-1 inline-flex bg-mint text-ink hover:bg-mint/90 font-bold"
          >
            {children}
          </Button>
        );
      }
      
      return (
        <a
          href={href}
          target={isPathway ? undefined : '_blank'}
          rel={isPathway ? undefined : 'noopener noreferrer'}
          className={`font-medium underline hover:no-underline ${
            isPathway ? 'text-mint hover:text-mint/80' : 'text-accent hover:text-accent/80'
          }`}
        >
          {children}
        </a>
      );
    },
    ul: ({ children }: any) => (
      <ul className="space-y-2 my-3 list-none">{children}</ul>
    ),
    ol: ({ children }: any) => (
      <ol className="space-y-2 my-3 list-decimal list-inside">{children}</ol>
    ),
    li: ({ children }: any) => (
      <li className="flex gap-2">
        <span className="text-mint-dark dark:text-mint mt-0.5">•</span>
        <span className="flex-1">{children}</span>
      </li>
    ),
  };

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
};
