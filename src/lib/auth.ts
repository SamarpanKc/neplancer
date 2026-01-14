// lib/auth.ts
import { supabase } from './supabase';
import type { User } from '@/types';

// --------------------
// SIGN UP WITH PROFILE CREATION
// --------------------
export async function signUp(data: {
  email: string;
  password: string;
  fullName: string;
  role: 'client' | 'freelancer';
  // Freelancer fields
  username?: string;
  skills?: string[];
  hourlyRate?: number;
  bio?: string;
  title?: string;
  // Client fields
  companyName?: string;
  companyDescription?: string;
  website?: string;
  location?: string;
}) {
  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (authError || !authData.user) {
    throw new Error(authError?.message || 'Failed to create account');
  }

  try {
    // 2. Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: data.email,
        full_name: data.fullName,
        role: data.role,
      });

    if (profileError) {
      throw new Error('Failed to create profile: ' + profileError.message);
    }

    // 3. Create role-specific record
    if (data.role === 'freelancer') {
      if (!data.username) {
        throw new Error('Username is required for freelancers');
      }

      const { error: freelancerError } = await supabase
        .from('freelancers')
        .insert({
          profile_id: authData.user.id,
          username: data.username,
          skills: data.skills || [],
          hourly_rate: data.hourlyRate || null,
          bio: data.bio || null,
          title: data.title || null,
        });

      if (freelancerError) {
        throw new Error('Failed to create freelancer profile: ' + freelancerError.message);
      }
    } else {
      // Client
      const { error: clientError } = await supabase
        .from('clients')
        .insert({
          profile_id: authData.user.id,
          company_name: data.companyName || null,
          company_description: data.companyDescription || null,
          website: data.website || null,
          location: data.location || null,
        });

      if (clientError) {
        throw new Error('Failed to create client profile: ' + clientError.message);
      }
    }

    return authData;
  } catch (error) {
    // Rollback: delete auth user if profile creation fails
    await supabase.auth.admin.deleteUser(authData.user.id);
    throw error;
  }
}

// --------------------
// SIGN IN
// --------------------
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ 
    email, 
    password 
  });
  
  if (error) {
    throw error;
  }
  
  return data;
}

// --------------------
// SIGN OUT
// --------------------
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

// --------------------
// GET CURRENT USER WITH PROFILE
// --------------------
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  // Single optimized query with joins to get all data at once
  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      *,
      freelancers(completed_jobs, total_earned, rating),
      clients(jobs_posted, total_spent)
    `)
    .eq('id', user.id)
    .single();

  if (!profile) {
    return null;
  }

  // Build stats from joined data
  let stats = {};
  if (profile.role === 'freelancer' && profile.freelancers?.[0]) {
    const freelancerData = profile.freelancers[0];
    stats = {
      completedJobs: freelancerData.completed_jobs || 0,
      totalEarnings: freelancerData.total_earned || 0,
      rating: freelancerData.rating || 5.0,
    };
  } else if (profile.role === 'client' && profile.clients?.[0]) {
    const clientData = profile.clients[0];
    stats = {
      jobsPosted: clientData.jobs_posted || 0,
      totalSpent: clientData.total_spent || 0,
    };
  }

  return {
    id: user.id,
    email: profile.email,
    role: profile.role,
    fullName: profile.full_name,
    name: profile.full_name,
    avatarUrl: profile.avatar_url,
    profile_completed: profile.profile_completed,
    stats,
  } as User;
}

// --------------------
// GET CURRENT SESSION
// --------------------
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error fetching session:', error);
    return null;
  }
  return session;
}

// --------------------
// AUTH STATE CHANGE
// --------------------
export function onAuthStateChange(callback: (user: User | null) => void) {
  const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const user = await getCurrentUser();
      callback(user);
    } else {
      callback(null);
    }
  });
  return listener;
}

// --------------------
// PASSWORD RESET
// --------------------
export async function sendPasswordResetEmail(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) {
    throw error;
  }
  return data;
}

// --------------------
// REFRESH SESSION
// --------------------
export async function refreshSession() {
  const { data, error } = await supabase.auth.refreshSession();
  if (error) {
    throw error;
  }
  return data;
}