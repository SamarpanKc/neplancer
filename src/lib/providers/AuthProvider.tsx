'use client';

import { useEffect, createContext, useContext, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

interface AuthContextType {
  session: Session | null;
  supabaseUser: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  supabaseUser: null,
  loading: true,
});

export const useAuthContext = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { initialize, setUser } = useAuth();

  useEffect(() => {
    // Get initial session
    const initSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setSupabaseUser(initialSession?.user ?? null);
        
        // Initialize the useAuth store only once
        await initialize();
      } catch (error) {
        console.error('Error initializing session:', error);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setSupabaseUser(newSession?.user ?? null);

        // Only re-initialize on sign in, not on token refresh
        if (event === 'SIGNED_IN') {
          await initialize();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        // TOKEN_REFRESHED doesn't need re-initialization
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [initialize, setUser]);

  return (
    <AuthContext.Provider value={{ session, supabaseUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
