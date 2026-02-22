import { motion } from 'framer-motion';
import { useAINewsTicker } from '@/hooks/useAINewsTicker';
import { useState, useRef, useEffect, useCallback } from 'react';
import { MindmakerIcon } from '@/components/ui/MindmakerIcon';

/**
 * AINewsTicker v2
 * 
 * Fixed issues:
 * - v1 used fixed 100px per headline assumption, causing overlaps
 * - v2 measures actual content width for accurate animation
 * - Reduced duplication from 3x to 2x for better performance
 * - Uses CSS animation with measured width for seamless loop
 */

const AINewsTicker = () => {
  const { headlines } = useAINewsTicker();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // v2: Measure actual content width for accurate animation
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  
  // v2: Measure content width on mount and when headlines change
  // v3: Use getBoundingClientRect() for accurate measurement including gaps
  const measureWidth = useCallback(() => {
    if (contentRef.current && headlines.length > 0) {
      const container = contentRef.current;
      // Measure actual rendered width including gaps
      const firstChild = container.children[0] as HTMLElement;
      const lastChild = container.children[headlines.length - 1] as HTMLElement;
      
      if (firstChild && lastChild) {
        const firstRect = firstChild.getBoundingClientRect();
        const lastRect = lastChild.getBoundingClientRect();
        // Actual width = last child right edge - first child left edge + gap
        // gap-12 = 3rem = 48px
        const actualWidth = lastRect.right - firstRect.left + 48;
        setContentWidth(actualWidth);
      }
    }
  }, [headlines.length]);
  
  useEffect(() => {
    // Measure after render
    const timer = setTimeout(measureWidth, 100);
    
    // Re-measure on resize
    window.addEventListener('resize', measureWidth);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measureWidth);
    };
  }, [measureWidth, headlines]);

  // Cleanup timeout on unmount - must be before any early returns
  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  // Don't render if no headlines
  if (!headlines || headlines.length === 0) {
    return null;
  }

  // v2: Only duplicate once (2x total) instead of 3x - reduces DOM size
  const duplicatedHeadlines = [...headlines, ...headlines];

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setIsPaused(true);
    setStartX(e.touches[0].clientX - scrollOffset);
    
    // Clear any pending resume
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevent page scroll
    const x = e.touches[0].clientX - startX;
    setScrollOffset(x);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // Resume auto-scroll after 2 seconds
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
      setScrollOffset(0);
    }, 2000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsPaused(true);
    setStartX(e.clientX - scrollOffset);
    
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.clientX - startX;
    setScrollOffset(x);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
      setScrollOffset(0);
    }, 2000);
  };

  return (
    <div className="relative w-full py-4 bg-ink overflow-hidden">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-ink to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-ink to-transparent pointer-events-none z-10" />
      
      {/* Ticker content */}
      <div className="relative overflow-hidden cursor-grab active:cursor-grabbing">
        <motion.div
          ref={contentRef}
          className="flex gap-12 items-center whitespace-nowrap"
          style={isPaused ? { x: scrollOffset } : undefined}
          animate={isPaused || contentWidth === 0 ? {} : {
            // v2: Use measured content width instead of fixed assumption
            x: [0, -contentWidth],
          }}
          transition={isPaused || contentWidth === 0 ? {} : {
            x: {
              repeat: Infinity,
              repeatType: "loop",
              // v2: Duration based on actual width for consistent speed
              // ~50px per second for readable scrolling
              duration: contentWidth / 50,
              ease: "linear",
            },
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {duplicatedHeadlines.map((headline, index) => (
            <div
              key={`${headline.title}-${index}`}
              className="flex items-center gap-4 text-sm md:text-base group select-none flex-shrink-0"
            >
              <MindmakerIcon size={16} className="text-mint flex-shrink-0 opacity-70" />
              <span className="font-semibold text-white/90 whitespace-nowrap">
                {headline.title}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-mint/10 text-mint border border-mint/20 flex-shrink-0 whitespace-nowrap">
                {headline.source}
              </span>
              <span className="text-white/30 mx-4 flex-shrink-0">&bull;</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AINewsTicker;
