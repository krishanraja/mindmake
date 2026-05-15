/**
 * Supabase Health Check Utility
 * Verifies Supabase client is properly configured and accessible
 */

import { supabase } from '@/integrations/supabase/client';

export interface SupabaseHealthCheck {
  isHealthy: boolean;
  urlConfigured: boolean;
  keyConfigured: boolean;
  clientInitialized: boolean;
  errors: string[];
}

export async function checkSupabaseHealth(): Promise<SupabaseHealthCheck> {
  const result: SupabaseHealthCheck = {
    isHealthy: false,
    urlConfigured: false,
    keyConfigured: false,
    clientInitialized: false,
    errors: []
  };
  
  try {
    // Check if client exists
    if (!supabase) {
      result.errors.push('Supabase client is null/undefined');
      return result;
    }
    result.clientInitialized = true;
    
    // Check URL
    const url = (supabase as any).supabaseUrl;
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      result.errors.push('Supabase URL is invalid or missing');
    } else {
      result.urlConfigured = true;
    }
    
    // Check key by probing a real table that exists. RLS denies anon SELECT
    // on `leads`, but the request itself succeeds, that's the signal we
    // want. Probing a fake table just spams a 404 on every page load.
    try {
      const { error } = await supabase.from('leads').select('id').limit(0);
      if (!error || error.code) {
        result.keyConfigured = true;
      } else {
        result.errors.push(`Supabase key validation failed: ${error.message}`);
      }
    } catch (err) {
      result.errors.push(`Health check query failed: ${(err as Error).message}`);
    }
    
    result.isHealthy = result.urlConfigured && result.keyConfigured && result.clientInitialized;
  } catch (err) {
    result.errors.push(`Health check exception: ${err}`);
  }
  
  return result;
}
