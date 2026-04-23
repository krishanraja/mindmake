import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, ExternalLink, Clock } from 'lucide-react';

export const LightningLessons = () => {
  const [open, setOpen] = useState(false);

  const lessons = [
    {
      title: "Vibe Coding for Leaders: Build What You Brief",
      url: "https://maven.com/p/ca6d71/vibe-coding-for-leaders-build-what-you-brief",
      image: "/lesson-vibe-coding.png",
      duration: "45 min",
      cta: "Sign Up",
      bullets: [
        "Turn briefs into working prototypes",
        "No coding background required",
        "Hands-on build session",
      ],
    },
    {
      title: "Make AI Your Co-Founder",
      url: "https://maven.com/p/0cc82a/make-ai-your-co-founder",
      image: "/lesson-co-founder.png",
      duration: "45 min",
      cta: "Sign Up",
      bullets: [
        "Build your sparring partner",
        "Delegate what you dread",
        "Ship what you brief",
      ],
    },
    {
      title: "Build an Autonomous Business with AI",
      url: "https://maven.com/p/38d196/build-an-autonomous-business-with-ai",
      image: "/lesson-autonomous-business.png",
      duration: "45 min",
      cta: "Sign Up",
      bullets: [
        "Map the work AI can own",
        "Wire agents into your stack",
        "Keep the human in the loop",
      ],
    },
    {
      title: "Give Your AI Memory",
      url: "https://maven.com/p/8fba42/improve-the-memory-of-your-ai-tools",
      image: "/lesson-ai-memory.png",
      duration: "45 min",
      cta: "Sign Up",
      bullets: [
        "Persistent memory that sticks",
        "Context that travels across tools",
        "Smarter, longer conversations",
      ],
    },
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
                {/* Thumbnail — gradient fallback if image fails to load */}
                <div className="relative h-24 overflow-hidden flex-shrink-0 bg-gradient-to-br from-ink via-ink/90 to-mint/40 flex items-center justify-center">
                  <img
                    src={lesson.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <span className="relative z-10 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white/80 text-center">
                    {lesson.title.split(":")[0]}
                  </span>
                  <Badge
                    variant="secondary"
                    className="absolute top-2 right-2 bg-mint/90 text-ink border-0 z-20"
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
