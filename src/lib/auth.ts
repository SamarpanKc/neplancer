// lib/auth.ts
import { supabase } from './supabase';
import { User } from '@/types';
import { getProfile } from './database';

// Get current user from Supabase session
export async function getCurrentUser(): Promise<User | null> {
  try {
    // First check if there's an active session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return null;
    }
    
    // If no session, return null (not an error - user just isn't logged in)
    if (!session?.user) {
      return null;
    }
    
    const user = session.user;
    
    // Fetch full profile from database
    const profile = await getProfile(user.id);
    
    // Map Supabase user to your User type
    return {
      id: user.id,
      email: user.email!,
      name: profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || '',
      role: profile?.role || 'freelancer',
      ...user.user_metadata,
    } as User;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Get current session
export async function getCurrentSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

// Sign out
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

// Sign in with email/password
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

// Sign up with email/password
export async function signUp(email: string, password: string, metadata?: Record<string, unknown>) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata, // Additional user data
      },
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

// Refresh session (usually handled automatically by Supabase)
export async function refreshSession() {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error refreshing session:', error);
    throw error;
  }
}

// Listen to auth state changes
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      try {
        const profile = await getProfile(session.user.id);
        const user: User = {
          id: session.user.id,
          email: session.user.email!,
          name: profile?.full_name || session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
          role: profile?.role || 'freelancer',
          ...session.user.user_metadata,
        } as User;
        callback(user);
      } catch (error) {
        console.error('Error fetching profile:', error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
}

// Storage helpers (kept for backward compatibility but using Supabase session)
export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function storeUser(user: User) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
}

export function removeStoredUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

export function storeAuthToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('authToken', token);
}

export function removeAuthToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('authToken');
}