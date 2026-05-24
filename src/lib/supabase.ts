import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON;

console.log('Supabase config loaded. URL exists:', !!supabaseUrl);


const getClient = () => {
  try {
    if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
      return createClient(supabaseUrl, supabaseAnonKey);
    }
  } catch (err) {
    console.error('Failed to create Supabase client:', err);
  }
  
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ error: { message: 'Supabase not configured properly' } }),
      signUp: async () => ({ error: { message: 'Supabase not configured properly' } }),
      signOut: async () => {},
    }
  } as any;
};

export const supabase = getClient();
