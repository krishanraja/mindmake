import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, ExternalLink, Clock } from 'lucide-react';

export const LightningLessons = () => {
  const [open, setOpen] = useState(false);

  const lessons = [
    {
      title: "Build Your AI's Permanent Identity",
      url: "https://maven.com/p/8fba42/build-your-ai-s-permanent-identity",
      image: "/lesson-permanent-identity.png",
      duration: "45 min",
      cta: "Sign Up",
      bullets: [
        "Memory that survives every session",
        "Voice and context that stick",
        "Stop re-briefing the same things",
      ],
    },
    {
      title: "Build an Autonomous Business with AI",
      url: "https://maven.com/p/99a529/build-an-autonomous-business-with-ai",
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
      title: "Vibe Coding for Leaders: The Unfair Advantage",
      url: "https://maven.com/p/b118d0/vibe-coding-how-your-competitors-are-pulling-ahead",
      image: "/lesson-vibe-coding-unfair-advantage.png",
      duration: "45 min",
      cta: "Sign Up",
      bullets: [
        "Ship prototypes without engineers",
        "Brief, build, iterate in one sitting",
        "Build the edge competitors can't copy",
      ],
    },
    {
      title: "Build Your Agentic Org Chart",
      url: "https://maven.com/p/48674a/create-your-business-agentic-org-chart",
      image: "/lesson-agentic-org-chart.png",
      duration: "45 min",
      cta: "Sign Up",
      bullets: [
        "Map roles to AI agents",
        "Decide what stays human",
        "Stand up your first agent team",
      ],
    },
    {
      title: "Build Your AI Chief of Staff",
      url: "https://maven.com/p/dd0ebd/build-your-ai-chief-of-staff",
      image: "/lesson-ai-chief-of-staff.png",
      duration: "45 min",
      cta: "Sign Up",
      bullets: [
        "Delegate the meta-work",
        "One agent, total context",
        "Prep, draft, summarize on demand",
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
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Free Lightning Lessons</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mt-4">
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
