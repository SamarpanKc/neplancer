// DEMO MODE: Supabase is disabled
// This file is kept for compatibility but Supabase is not used

// Mock supabase client for any legacy code
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithPassword: async () => ({ data: null, error: new Error('Demo mode - use mock auth') }),
    signUp: async () => ({ data: null, error: new Error('Demo mode - use mock auth') }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: new Error('Demo mode - use mock data') }),
      }),
    }),
    insert: () => ({
      select: () => ({
        single: async () => ({ data: null, error: new Error('Demo mode - use mock data') }),
      }),
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: async () => ({ data: null, error: new Error('Demo mode - use mock data') }),
        }),
      }),
    }),
    upsert: () => ({
      select: () => ({
        single: async () => ({ data: null, error: new Error('Demo mode - use mock data') }),
      }),
    }),
  }),
};

console.warn('⚠️ DEMO MODE: Supabase is disabled. Using mock data instead.');