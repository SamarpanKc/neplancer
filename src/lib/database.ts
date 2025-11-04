// lib/database.ts - DEMO MODE (Supabase Disabled)
import { getUserById } from '@/data/mockData';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  role: 'freelancer' | 'client';
  created_at?: string;
  updated_at?: string;
}

// Get user profile (DEMO MODE)
export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const user = getUserById(userId);
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email,
      full_name: user.name,
      avatar_url: user.avatar,
      role: user.role,
      created_at: user.createdAt.toISOString(),
      updated_at: user.createdAt.toISOString(),
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

// Create or update profile (DEMO MODE)
export async function upsertProfile(profile: Partial<Profile> & { id: string }) {
  try {
    // In demo mode, just return the profile as-is
    console.log('Demo mode: Profile upsert', profile);
    return profile as Profile;
  } catch (error) {
    console.error('Error upserting profile:', error);
    throw error;
  }
}

// Update profile (DEMO MODE)
export async function updateProfile(userId: string, updates: Partial<Profile>) {
  try {
    // In demo mode, just return the updated profile
    const existingProfile = await getProfile(userId);
    if (!existingProfile) throw new Error('Profile not found');
    
    const updated = { ...existingProfile, ...updates };
    console.log('Demo mode: Profile updated', updated);
    return updated;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}