import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import krishHeadshot from '@/assets/krish-headshot.png';

interface ChatButtonProps {
  onClick: () => void;
}

export const ChatButton = ({ onClick }: ChatButtonProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-40 h-16 w-16">
      {/* Sonar ring 1 */}
      <span className="absolute inset-0 rounded-full border-2 border-mint/40 animate-sonar-ping" />
      {/* Sonar ring 2 (staggered) */}
      <span
        className="absolute inset-0 rounded-full border-2 border-mint/30 animate-sonar-ping"
        style={{ animationDelay: "1s" }}
      />

      {/* Main button */}
      <Button
        onClick={onClick}
        size="lg"
        className="relative h-16 w-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 group chat-fab-animated"
      >
        <div className="relative">
          <Avatar className="h-12 w-12 border-2 border-white/20 md:group-hover:scale-110 transition-transform duration-300">
            <AvatarImage src={krishHeadshot} alt="Ask Mindmaker" loading="eager" />
            <AvatarFallback>K</AvatarFallback>
          </Avatar>
          <div className="absolute -top-1 -right-1 h-4 w-4 bg-accent rounded-full animate-pulse" />
        </div>
        <span className="sr-only">Ask Mindmaker</span>
      </Button>
    </div>
  );
};
