// lib/auth.ts - DEMO MODE (Supabase Disabled)
import { User } from '@/types';
import { mockUsers, demoClientUser, demoFreelancerUser } from '@/data/mockData';

// DEMO MODE: Get current user from localStorage
export async function getCurrentUser(): Promise<User | null> {
  try {
    const storedUser = getStoredUser();
    if (storedUser) {
      return storedUser;
    }
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Get current session (DEMO MODE)
export async function getCurrentSession() {
  try {
    const user = getStoredUser();
    if (!user) return null;
    
    return {
      user,
      access_token: 'demo_token',
      expires_at: Date.now() + 3600000, // 1 hour from now
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

// Sign out (DEMO MODE)
export async function signOut() {
  try {
    removeStoredUser();
    removeAuthToken();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

// Sign in with email/password (DEMO MODE)
export async function signIn(email: string, _password: string) {
  try {
    // Demo mode: Accept any email/password and return a mock user
    const user = mockUsers.find(u => u.email === email) || demoClientUser;
    
    storeUser(user);
    storeAuthToken('demo_token_' + user.id);
    
    return {
      user,
      session: {
        access_token: 'demo_token_' + user.id,
        expires_at: Date.now() + 3600000,
      },
    };
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

// Sign up with email/password (DEMO MODE)
export async function signUp(email: string, password: string, metadata?: Record<string, unknown>) {
  try {
    // Demo mode: Create a mock user
    const newUser: User = {
      id: 'user-' + Date.now(),
      email,
      name: metadata?.name as string || 'New User',
      role: (metadata?.role as 'client' | 'freelancer') || 'freelancer',
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      createdAt: new Date(),
    };
    
    storeUser(newUser);
    storeAuthToken('demo_token_' + newUser.id);
    
    return {
      user: newUser,
      session: {
        access_token: 'demo_token_' + newUser.id,
        expires_at: Date.now() + 3600000,
      },
    };
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

// Refresh session (DEMO MODE)
export async function refreshSession() {
  try {
    const user = getStoredUser();
    if (!user) return null;
    
    return {
      user,
      access_token: 'demo_token_' + user.id,
      expires_at: Date.now() + 3600000,
    };
  } catch (error) {
    console.error('Error refreshing session:', error);
    throw error;
  }
}

// Listen to auth state changes (DEMO MODE)
export function onAuthStateChange(callback: (user: User | null) => void) {
  // In demo mode, just check localStorage on mount
  const user = getStoredUser();
  callback(user);
  
  // Return a mock subscription
  return {
    data: {
      subscription: {
        unsubscribe: () => {},
      },
    },
  };
}

// Demo login helpers
export async function loginAsClient() {
  return signIn(demoClientUser.email, 'demo');
}

export async function loginAsFreelancer() {
  return signIn(demoFreelancerUser.email, 'demo');
}

// Storage helpers
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