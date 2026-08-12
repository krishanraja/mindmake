/**
 * Calendly Integration Utility
 * Standardized Calendly URL generation and popup widget integration
 */

import { BOOKING_URL } from "@/lib/publicLinks";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

/**
 * Shared public fit-call destination, kept as an alias for older callers.
 */
export const CONCIERGE_CALENDLY_URL = BOOKING_URL;

export type CalendlySource =
  | 'builder-assessment'
  | 'ai-decision-helper'
  | 'friction-map'
  | 'portfolio-builder'
  | 'consultation-booking'
  | 'initial-consult'
  | 'other';

export interface CalendlyParams {
  name?: string;
  email?: string;
  source: CalendlySource;
  preselectedProgram?: string;
  commitmentLevel?: string;
}

/**
 * Waits for Calendly script to load with timeout
 * @param timeout Maximum time to wait in milliseconds (default: 5000ms)
 * @returns Promise that resolves to true if script loaded, false if timeout
 */
async function waitForCalendlyScript(timeout = 5000): Promise<boolean> {
  if (window.Calendly) {
    return true;
  }
  
  return new Promise((resolve) => {
    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (window.Calendly) {
        clearInterval(checkInterval);
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        resolve(false);
      }
    }, 100);
  });
}

/**
 * Opens Calendly popup widget with standardized parameters
 * Waits for Calendly script to load, falls back to direct navigation if needed
 * @param params Calendly parameters including name, email, source, and commitmentLevel
 */
export const openCalendlyPopup = async (params: CalendlyParams): Promise<void> => {
  // Map source to Calendly a1 parameter (used for interest field)
  const sourceMap: Record<CalendlySource, string> = {
    'builder-assessment': 'builder-profile-quiz',
    'ai-decision-helper': 'ai-decision-helper',
    'friction-map': 'friction-map-builder',
    'portfolio-builder': 'portfolio-builder',
    'consultation-booking': params.preselectedProgram || 'consultation',
    'initial-consult': params.preselectedProgram || 'initial-consult',
    'other': 'website',
  };

  const a1Value = sourceMap[params.source];
  
  // Build Calendly URL with all parameters including commitmentLevel
  const urlParams = new URLSearchParams({
    name: params.name || '',
    email: params.email || '',
    prefill_email: params.email || '',
    prefill_name: params.name || '',
    a1: a1Value,
  });
  
  // Add commitmentLevel as a2 parameter if provided
  if (params.commitmentLevel) {
    urlParams.set('a2', params.commitmentLevel);
  }
  
  const calendlyUrl = `${BOOKING_URL}?${urlParams.toString()}`;

  try {
    // Wait for Calendly script to load (max 5 seconds)
    const scriptLoaded = await waitForCalendlyScript(5000);
    
    if (scriptLoaded && window.Calendly) {
      // Use Calendly popup widget
      try {
        window.Calendly.initPopupWidget({ url: calendlyUrl });
        return;
      } catch (widgetError) {
        console.error('Calendly widget error:', widgetError);
        // Fall through to direct navigation
      }
    }
    
    // Fallback: Direct navigation (works even with popup blockers)
    // This is better than window.open() because it maintains user gesture context
    window.location.href = calendlyUrl;
    
  } catch (error) {
    console.error('Error opening Calendly:', error);
    // Last resort: try window.open (may be blocked by popup blocker)
    const newWindow = window.open(calendlyUrl, '_blank', 'noopener,noreferrer');
    if (!newWindow) {
      // Popup blocked, use direct navigation
      window.location.href = calendlyUrl;
    }
  }
};

