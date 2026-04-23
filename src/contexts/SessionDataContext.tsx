/**
 * @file SessionDataContext
 * @description Manages user session state including engagement tracking, tool usage,
 *              and behavioral data. Provides context for all interactive components.
 * @dependencies React
 * @returns SessionDataProvider component and useSessionData hook
 * 
 * Data tracked:
 * - Friction Map results
 * - Portfolio Builder selections
 * - Assessment answers and profile
 * - Try It Widget interactions
 * - Pages visited, time on site, scroll depth
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';

/**
 * Generates a unique session ID for tracking
 */
const generateSessionId = (): string => {
  return `sess_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
};

interface FrictionMapData {
  problem: string;
  currentState: string;
  aiEnabledState: string;
  timeSaved: string;
  toolRecommendations: { name: string; description: string; useCase: string }[];
  masterPrompts: { title: string; prompt: string }[];
  generatedAt: Date;
}

interface PortfolioData {
  selectedTasks: { name: string; hours: number; savings: number }[];
  totalTimeSaved: number;
  totalCostSavings: number;
}

interface AssessmentData {
  answers: Record<string, string>;
  profileType: string;
  profileDescription: string;
  recommendedProduct: string;
}

interface TryItData {
  challenges: { input: string; response: string; timestamp: Date }[];
}

export interface QualifierAnswers {
  decision: string;
  tried: string;
  stakes: string;
}

export interface QualificationData {
  preselectedProgram?: string;
  commitmentLevel?: string;
  audienceType?: "individual" | "team";
  pathType?: "build" | "orchestrate";
  qualifierAnswers?: QualifierAnswers;
}

export interface SessionData {
  sessionId: string;
  startedAt: Date;
  frictionMap?: FrictionMapData;
  portfolioBuilder?: PortfolioData;
  assessment?: AssessmentData;
  tryItWidget?: TryItData;
  qualificationData?: QualificationData;
  pagesVisited: string[];
  timeOnSite: number;
  scrollDepth: number;
}

interface SessionDataContextType {
  sessionData: SessionData;
  sessionId: string;
  setFrictionMap: (data: FrictionMapData) => void;
  setPortfolioBuilder: (data: PortfolioData) => void;
  setAssessment: (data: AssessmentData) => void;
  setQualificationData: (data: QualificationData) => void;
  addTryItChallenge: (input: string, response: string) => void;
  trackPageVisit: (path: string) => void;
  updateScrollDepth: (depth: number) => void;
}

const SessionDataContext = createContext<SessionDataContextType | undefined>(undefined);

export const SessionDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Generate stable session ID on mount
  const [sessionId] = useState(() => generateSessionId());
  
  const [sessionData, setSessionData] = useState<SessionData>(() => ({
    sessionId,
    startedAt: new Date(),
    pagesVisited: [],
    timeOnSite: 0,
    scrollDepth: 0,
  }));

  // Track time on site
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setSessionData(prev => ({
        ...prev,
        timeOnSite: Math.floor((Date.now() - startTime) / 1000),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const depth = Math.round((scrolled / scrollHeight) * 100);
      
      setSessionData(prev => ({
        ...prev,
        scrollDepth: Math.max(prev.scrollDepth, depth),
      }));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const setFrictionMap = useCallback((data: FrictionMapData) => {
    setSessionData(prev => ({ ...prev, frictionMap: data }));
  }, []);

  const setPortfolioBuilder = useCallback((data: PortfolioData) => {
    setSessionData(prev => ({ ...prev, portfolioBuilder: data }));
  }, []);

  const setAssessment = useCallback((data: AssessmentData) => {
    setSessionData(prev => ({ ...prev, assessment: data }));
  }, []);

  const setQualificationData = useCallback((data: QualificationData) => {
    setSessionData(prev => ({ ...prev, qualificationData: data }));
  }, []);

  const addTryItChallenge = useCallback((input: string, response: string) => {
    setSessionData(prev => ({
      ...prev,
      tryItWidget: {
        challenges: [
          ...(prev.tryItWidget?.challenges || []),
          { input, response, timestamp: new Date() }
        ]
      }
    }));
  }, []);

  const trackPageVisit = useCallback((path: string) => {
    setSessionData(prev => ({
      ...prev,
      pagesVisited: prev.pagesVisited.includes(path) 
        ? prev.pagesVisited 
        : [...prev.pagesVisited, path]
    }));
  }, []);

  const updateScrollDepth = useCallback((depth: number) => {
    setSessionData(prev => ({
      ...prev,
      scrollDepth: Math.max(prev.scrollDepth, depth),
    }));
  }, []);

  return (
    <SessionDataContext.Provider value={{
      sessionData,
      sessionId,
      setFrictionMap,
      setPortfolioBuilder,
      setAssessment,
      setQualificationData,
      addTryItChallenge,
      trackPageVisit,
      updateScrollDepth,
    }}>
      {children}
    </SessionDataContext.Provider>
  );
};

export const useSessionData = () => {
  const context = useContext(SessionDataContext);
  if (!context) {
    throw new Error('useSessionData must be used within SessionDataProvider');
  }
  return context;
};
