import { BuilderAssessment } from "@/components/Interactive/BuilderAssessment";

const WhoThisIsFor = () => {
  return (
    <section className="section-padding bg-muted" id="assessment">
      <div className="container-width">
        <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12 px-4 sm:px-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Discover Your Builder Profile
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Take a 60-second assessment to understand where you are on your AI journey 
            and get personalized recommendations for your next steps.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <BuilderAssessment />
        </div>

        {/* Who This Is For - Below Assessment */}
        <div className="max-w-4xl mx-auto text-center mt-16 sm:mt-20 pt-12 sm:pt-16 border-t border-border px-4 sm:px-0">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
            Built For Commercial Leaders Who Lead From The Front
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
            For commercial leaders (not technical ones) who accept what's coming: we won't delegate the future to others, but to systems. The best leaders will use AI to build systems and lead from the front.
          </p>
          <p className="text-sm sm:text-base font-semibold text-foreground mb-8 sm:mb-12">
            All paths lead to one outcome: confidently own the boardroom conversation on AI.
          </p>

          {/* Three ICPs */}
          <div className="grid md:grid-cols-3 gap-4 mb-8 sm:mb-12 text-left">
            <div className="minimal-card p-4 sm:p-5">
              <h4 className="font-bold text-sm text-mint-dark mb-2">HANDS-OFF LEADERS</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You need AI systems, authority, and ideas from your new AI capabilities. Deploy working systems that give you command without hands-on building. Become the leader who confidently directs AI-enabled operations.
              </p>
            </div>
            <div className="minimal-card p-4 sm:p-5">
              <h4 className="font-bold text-sm text-mint-dark mb-2">HANDS-ON BUILDERS</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You want to become a builder alongside AI, following the path of creating weapons-grade AI-enabled GTM engines, content engines, and end-to-end apps. This is the Builder Economy path.
              </p>
            </div>
            <div className="minimal-card p-4 sm:p-5">
              <h4 className="font-bold text-sm text-mint-dark mb-2">TEAMS NEEDING TRANSFORMATION</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your team isn't aligned or confident enough to undergo transformation. You're being pitched by OpenAI or consultants but need to sharpen communal AI literacy first, so you invest your transformation budget with confidence.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { title: "CEO", description: "Chief Executive Officer" },
              { title: "GM", description: "General Manager" },
              { title: "CCO", description: "Chief Commercial Officer" },
              { title: "CPO", description: "Chief Product Officer" },
              { title: "CMO", description: "Chief Marketing Officer" },
              { title: "CRO", description: "Chief Revenue Officer" },
              { title: "COO", description: "Chief Operating Officer" },
              { title: "Strategy", description: "Strategy Leads" },
            ].map((role, index) => (
              <div 
                key={index}
                className="minimal-card text-center fade-in-up p-3 sm:p-4"
                style={{animationDelay: `${index * 0.05}s`}}
              >
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-1">{role.title}</div>
                <div className="text-xs text-muted-foreground">{role.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoThisIsFor;
