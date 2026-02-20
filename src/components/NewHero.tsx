import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { InitialConsultModal } from "@/components/InitialConsultModal";
import { motion, AnimatePresence } from "framer-motion";

const NewHero = () => {
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  const heroVariants = [
    "Everyone's talking about AI. I still haven't decided.",
    "I've been pitched 14 tools this quarter. I use none of them.",
    "My board wants an AI strategy. I don't know where to start.",
    "I'm either building the future or being replaced by it.",
    "Should we build our own AI tools or buy off the shelf?",
    "Which vendors do we actually commit to?",
    "How do I multiply my strongest edge with AI?",
    "Everyone on my team is using different tools. It's chaos.",
    "How do I know if AI is delivering ROI or just hype?",
    "I'm nervous about vendor lock-in but scared to build.",
    "My team is resisting AI and I don't know how to lead them.",
    "I feel like I should understand this but I don't.",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Validate headlines to ensure they don't exceed 2 lines
  useEffect(() => {
    const validateHeadlines = () => {
      if (!containerRef.current || !measureRef.current) return;

      // Wait a tick to ensure layout is complete
      setTimeout(() => {
        const container = containerRef.current;
        const measureEl = measureRef.current;
        if (!container || !measureEl) return;

        // Get the h1 element to match its computed styles
        const h1Element = container.querySelector('h1:not([aria-hidden])');
        if (!h1Element) return;

        const containerWidth = container.offsetWidth;
        const computedStyle = getComputedStyle(h1Element);
        const fontSize = parseFloat(computedStyle.fontSize);
        const fontWeight = computedStyle.fontWeight;
        const fontFamily = computedStyle.fontFamily;
        const letterSpacing = computedStyle.letterSpacing;
        const lineHeight = 1.2;
        const maxWidthForTwoLines = containerWidth * 2;

        // Set up measurement element with exact same styles
        measureEl.style.fontSize = `${fontSize}px`;
        measureEl.style.fontWeight = fontWeight;
        measureEl.style.fontFamily = fontFamily;
        measureEl.style.letterSpacing = letterSpacing;

        heroVariants.forEach((headline, index) => {
          measureEl.textContent = headline;
          const textWidth = measureEl.offsetWidth;

          if (textWidth > maxWidthForTwoLines) {
            console.warn(
              `⚠️ Hero headline #${index + 1} may exceed 2 lines: "${headline}"\n` +
              `   Text width: ${Math.round(textWidth)}px, Max for 2 lines: ${Math.round(maxWidthForTwoLines)}px\n` +
              `   Consider shortening this headline.`
            );
          }
        });
      }, 100);
    };

    // Validate on mount and window resize
    validateHeadlines();
    window.addEventListener('resize', validateHeadlines);
    return () => window.removeEventListener('resize', validateHeadlines);
  }, [heroVariants]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroVariants.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [heroVariants.length]);

  return (
    <section id="hero" className="min-h-[100dvh] flex items-center justify-center bg-ink text-white relative overflow-hidden pt-safe-area-top">
      {/* Dynamic Gradient Background - hero-decoration prevents overflow */}
      <div className="hero-decoration absolute inset-0 bg-gradient-to-br from-ink-900 via-ink to-ink-700/50"></div>
      <div className="hero-decoration absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-mint/5"></div>
      
      {/* GIF Background Overlay - hero-decoration prevents overflow */}
      <div 
        className="hero-decoration absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(/mindmaker-background-green.gif)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      
      {/* Animated Grid Background - hero-decoration prevents overflow */}
      <div className="hero-decoration absolute inset-0 opacity-[0.08]">
        <div 
          className="absolute inset-0 animate-pulse" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(126, 244, 194, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(126, 244, 194, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        />
      </div>
      
      {/* Glowing Orbs - hero-decoration prevents blur-3xl from causing overflow */}
      <div className="hero-decoration absolute top-1/4 right-1/4 w-96 h-96 bg-mint/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '3s'}}></div>
      <div className="hero-decoration absolute bottom-1/4 left-1/3 w-80 h-80 bg-mint/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
      
      {/* Content - padding-top styles moved to index.css @layer hero */}
      <div className="container-width relative z-10 pb-12 sm:pb-16 md:pb-20 overflow-x-hidden hero-content-wrapper">
        {/* Hero Content */}
        <div className="max-w-5xl overflow-x-hidden overflow-y-hidden">
          <div className="space-y-6 sm:space-y-8 md:space-y-10 fade-in-up" style={{animationDelay: '0.1s'}}>
            {/* Two-line hero layout: rotating text on line 1, static text on line 2 */}
            <div 
              ref={containerRef}
              className="relative w-full max-w-5xl" 
              style={{ 
                minHeight: 'calc(2.4em + 1.2em)', // 2 lines of rotating text + 1 line of static text
              }}
            >
              {/* Hidden measurement element for headline validation */}
              <div
                ref={measureRef}
                className="absolute invisible pointer-events-none hero-text-size"
                style={{
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                }}
                aria-hidden="true"
              />
              
              {/* Invisible spacer to reserve exact height for both lines - uses longest variant */}
              <h1 
                className="invisible font-bold leading-tight tracking-tight max-w-4xl pointer-events-none hero-text-size" 
                style={{
                  lineHeight: '1.2',
                }}
                aria-hidden="true"
              >
                <div style={{ 
                  height: '2.4em', // 2 lines at 1.2em line-height
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  Everyone's talking about AI. I still haven't decided.
                </div>
                <div style={{ 
                  height: '1.2em', 
                  whiteSpace: 'nowrap',
                  lineHeight: '1.2',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  Boss the boardroom confidently.
                </div>
              </h1>
              
              {/* Visible headline - two-line layout with fixed structure */}
              <h1 
                className="absolute top-0 left-0 font-bold leading-tight tracking-tight text-white max-w-4xl flex flex-col hero-text-size"
                style={{
                  lineHeight: '1.2',
                  width: '100%',
                  overflow: 'hidden',
                }}
              >
                {/* Line 1: Rotating text - exactly 2 lines, bottom-aligned */}
                <div 
                  className="relative"
                  style={{ 
                    minHeight: '2.4em', // 2 lines at 1.2em line-height
                    maxHeight: '2.4em',
                    height: '2.4em',
                    display: 'flex',
                    alignItems: 'flex-end', // Bottom-align the text
                    overflow: 'hidden',
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="w-full"
                      style={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        wordBreak: 'break-word',
                        lineHeight: '1.2',
                        maxHeight: '2.4em',
                      }}
                    >
                      {heroVariants[currentIndex]}
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                {/* Line 2: Static text - exactly 1 line, never moves */}
                <div 
                  className="relative flex items-center"
                  style={{ 
                    height: '1.2em',
                    minHeight: '1.2em',
                    maxHeight: '1.2em',
                    marginTop: 0,
                  }}
                >
                  <span 
                    className="relative inline-block w-full text-mint font-bold tracking-tight hero-text-size"
                    style={{ 
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: '1.2',
                      textShadow: '0 0 40px hsl(var(--mint) / 0.6), 0 0 80px hsl(var(--mint) / 0.4), 0 0 120px hsl(var(--mint) / 0.2)',
                      filter: 'drop-shadow(0 0 20px hsl(var(--mint) / 0.5))',
                    }}
                  >
                    <span className="md:hidden">Boss the boardroom confidently.</span>
                    <span className="hidden md:inline">Boss the boardroom confidently.</span>
                  </span>
                </div>
              </h1>
            </div>
      
            <p className="text-base sm:text-lg md:text-xl lg:text-xl text-white/90 max-w-3xl font-light leading-relaxed">
              Mindmaker is a 1:1 sprint that turns AI chaos into calm, clear, executable direction. No training. No decks. No demos. Just decisions.
            </p>
              
            {/* Trust Bar */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-white/70 font-medium fade-in-up" style={{animationDelay: '0.2s'}}>
              <span className="flex items-center gap-2">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-mint" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No vendor theatre
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-mint" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No decks or demos
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-mint" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Just decisions
              </span>
            </div>
            
            {/* CTAs - overflow-hidden contains shadow expansion on hover */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 sm:gap-4 fade-in-up overflow-hidden" style={{animationDelay: '0.3s'}}>
              <Button 
                size="lg" 
                className="bg-mint text-ink hover:bg-mint-500/95 font-bold px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg shadow-lg shadow-mint-lg hover:shadow-xl hover:shadow-mint-lg transition-all duration-300 ease-out hover:-translate-y-0.5 touch-target group overflow-hidden"
                onClick={() => setConsultModalOpen(true)}
              >
                <span className="group-hover:opacity-90">What's your nervous decision?</span>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-mint/50 text-mint hover:bg-mint/10 hover:border-mint/70 backdrop-blur-md font-bold px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg touch-target transition-all duration-300 ease-out shadow-sm hover:shadow-md overflow-hidden"
                onClick={() => {
                  const productsSection = document.getElementById('products') || document.getElementById('book');
                  if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                View Sprints
              </Button>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="flex flex-col items-start gap-2 mt-12 sm:mt-16 md:mt-20 opacity-60 hover:opacity-100 transition-opacity cursor-pointer fade-in-up" style={{animationDelay: '0.6s'}}>
          <span className="text-white/70 text-xs uppercase tracking-wider font-medium">Scroll to explore</span>
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/70 animate-bounce" style={{animationDuration: '1.5s'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
      
      {/* NOTE: .hero-text-size styles moved to src/index.css to prevent scrollbar flash on load */}

      {/* Initial Consult Modal */}
      <InitialConsultModal 
        open={consultModalOpen} 
        onOpenChange={setConsultModalOpen}
      />
    </section>
  );
};

export default NewHero;
