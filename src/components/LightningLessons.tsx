import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, ExternalLink, Clock } from 'lucide-react';

export const LightningLessons = () => {
  const [open, setOpen] = useState(false);

  const lessons = [
    {
      title: "Skills 101: Learn How To Program Your AI Tools",
      url: "https://maven.com/p/6c1d16/learn-how-to-program-your-ai-tools",
      image: "/lesson-program-ai-tools.png",
      duration: "45 min",
      cta: "Sign Up",
      bullets: [
        "Master prompt engineering basics",
        "Build custom AI workflows",
        "Practical hands-on exercises"
      ]
    },
    {
      title: "Run Your Life With OpenClaw: The Good, The Bad and The Ugly",
      url: "https://live.themindmaker.ai/",
      image: "/lesson-openclaw.png",
      duration: "45 min",
      cta: "Sign Up",
      bullets: [
        "Hands-on OpenClaw walkthrough",
        "Real pros and cons from daily use",
        "When to use it vs alternatives"
      ]
    },
    {
      title: "Improve The Memory Of Your AI Tools",
      url: "https://live.themindmaker.ai/",
      image: "/lesson-ai-memory.png",
      duration: "45 min",
      cta: "Sign Up",
      bullets: [
        "Give your AI persistent memory",
        "Context management techniques",
        "Build smarter, longer conversations"
      ]
    },
    {
      title: "Vibe Coding for Leaders: Build What You Brief",
      url: "https://live.themindmaker.ai/",
      image: "/lesson-vibe-code.png",
      duration: "45 min",
      cta: "Sign Up",
      bullets: [
        "Turn briefs into working prototypes with AI",
        "No coding experience required",
        "Practical, hands-on building session"
      ]
    }
  ];

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        size="lg"
        className="group border-ink text-ink dark:border-mint dark:text-mint hover:bg-ink hover:text-white dark:hover:bg-mint dark:hover:text-ink"
      >
        <GraduationCap className="mr-2 h-5 w-5" />
        Free Lightning Lessons
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Free Lightning Lessons</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {lessons.map((lesson, index) => (
              <div 
                key={index}
                className="border border-border rounded-lg overflow-hidden hover:border-mint bg-card flex flex-col h-full hover-lift"
              >
                {/* Thumbnail */}
                <div className="relative h-24 overflow-hidden flex-shrink-0">
                  <img 
                    src={lesson.image} 
                    alt={lesson.title}
                    className="w-full h-full object-cover object-center"
                  />
                  <Badge 
                    variant="secondary" 
                    className="absolute top-2 right-2 bg-mint/90 text-ink border-0"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {lesson.duration}
                  </Badge>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-base leading-tight min-h-[2.5rem] mb-3">
                    {lesson.title}
                  </h3>
                  
                  <ul className="space-y-1.5 text-sm text-muted-foreground flex-grow mb-3">
                    {lesson.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-mint mt-0.5">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    asChild 
                    size="sm"
                    className="w-full bg-mint text-ink hover:bg-mint/90 font-semibold mt-auto"
                  >
                    <a href={lesson.url} target="_blank" rel="noopener noreferrer">
                      {lesson.cta}
                      <ExternalLink className="ml-2 h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
