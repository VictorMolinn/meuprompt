import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase credentials. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set correctly.'
  );
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(
    `Invalid Supabase URL format: ${supabaseUrl}. Please check your .env file.`
  );
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined
    },
    global: {
      headers: {
        'X-Client-Info': 'supabase-js-web'
      }
    }
  }
);

// Test the connection
(async () => {
  if (typeof window !== 'undefined') {
    try {
      const { error } = await supabase.from('site_config').select('key').limit(1);
      if (error) {
        console.error('Supabase connection test failed:', error.message);
      }
    } catch (error) {
      console.error('Failed to connect to Supabase:', error);
    }
  }
})();

// Expose client for debugging in development
if (import.meta.env.DEV && typeof window !== 'undefined') {
  // @ts-ignore
  window.supabase = supabase;
}