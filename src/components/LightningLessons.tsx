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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
          <DialogHeader className="text-left">
            <DialogTitle className="text-2xl sm:text-3xl">Free Lightning Lessons</DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Five 45-minute sessions. Practical, no fluff. Pick one to start.
            </p>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-6">
            {lessons.map((lesson, index) => (
              <div
                key={index}
                className="group border border-border rounded-lg overflow-hidden hover:border-mint bg-card transition-colors"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Thumbnail */}
                  <div className="relative sm:w-48 sm:flex-shrink-0 aspect-[16/9] sm:aspect-auto sm:min-h-[140px] overflow-hidden bg-gradient-to-br from-ink via-ink/90 to-mint/40">
                    <img
                      src={lesson.image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover object-center"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <Badge
                      variant="secondary"
                      className="absolute top-2 left-2 bg-mint/95 text-ink border-0 z-10 text-[10px]"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {lesson.duration}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg leading-tight mb-2">
                        {lesson.title}
                      </h3>
                      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        {lesson.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-mint mt-0.5 flex-shrink-0">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      asChild
                      size="sm"
                      className="bg-mint text-ink hover:bg-mint/90 font-semibold sm:flex-shrink-0 w-full sm:w-auto"
                    >
                      <a href={lesson.url} target="_blank" rel="noopener noreferrer">
                        {lesson.cta}
                        <ExternalLink className="ml-2 h-3.5 w-3.5" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
