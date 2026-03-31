import { Button } from "@/components/ui/button";
import { Radio, Video, FileText } from "lucide-react";

const BuilderEconomyConnection = () => {
  const formats = [
    {
      icon: Radio,
      title: "Podcast",
      description: "Deep conversations with founders, leaders and operators who are building with AI in real companies.",
    },
    {
      icon: Video,
      title: "Live Sessions",
      description: "Open Builder Rooms where people bring one problem and watch it get redesigned live.",
    },
    {
      icon: FileText,
      title: "Written Briefings",
      description: "Short, sharp field notes from client work and experiments.",
    },
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container-width">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The Builder Economy
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-4">
            For hands-on operators who want to become builders alongside AI. The path to creating weapons-grade AI-enabled GTM engines, content engines, and end-to-end apps, following what Krish is doing to build a complete AI-enabled business.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            The media and community layer that feeds Mindmaker. A long-running conversation about how commercial leaders build with AI in their own careers and companies.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {formats.map((format, index) => {
            const IconComponent = format.icon;
            const isPodcast = format.title === "Podcast";
            
            const cardContent = (
              <>
                <div className="w-12 h-12 bg-mint/10 rounded-md flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="h-6 w-6 text-mint" />
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {format.title}
                </h3>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {format.description}
                </p>
              </>
            );
            
            if (isPodcast) {
              return (
                <a
                  key={index}
                  href="https://www.thebuildereconomy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="minimal-card text-center fade-in-up hover:border-mint/50 transition-colors cursor-pointer"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {cardContent}
                </a>
              );
            }
            
            return (
              <div 
                key={index}
                className="minimal-card text-center fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {cardContent}
              </div>
            );
          })}
        </div>
        
        <div className="text-center">
          <Button 
            size="lg"
            variant="outline"
            className="border-2 border-ink text-ink hover:bg-ink/5 font-semibold px-8"
            onClick={() => window.location.href = '/builder-economy'}
          >
            Explore The Builder Economy
          </Button>
        </div>
        
        <div className="max-w-3xl mx-auto mt-12">
          <div className="minimal-card bg-muted/50 p-6 text-center">
            <p className="text-sm text-muted-foreground italic mb-2">
              Listen → Join a live session → Book a Builder Session. 
              A simple path from curiosity to capability.
            </p>
            <p className="text-sm font-semibold text-foreground">
              This is the hands-on builder path: become the commercial leader who builds alongside AI, not just delegates to it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuilderEconomyConnection;
