'use client';

import {supabase} from '@/lib/supabase'
import type {FreelancerProfileFormData} from '@/types'

export async function updateFreelancer(formData: FreelancerProfileFormData){
    try {
        console.log('🔄 Starting freelancer profile update...');
        
        // Get current user with retry logic
        const {data:{user}, error: userError} = await supabase.auth.getUser();
        
        if(userError) {
            console.error('❌ Error getting user:', userError);
            throw new Error('Failed to get user: ' + userError.message);
        }
        
        if(!user) {
            console.error('❌ No user found');
            throw new Error('Not logged in. Please log in and try again.');
        }
        
        console.log('✅ User authenticated:', user.id);

        // Update freelancer profile
        console.log('🔄 Updating freelancer data...');
        const {error: freelancerError} = await supabase
        .from('freelancers')
        .update({
            username: formData.username,
            title: formData.title,
            bio: formData.bio,
            hourly_rate: formData.hourlyRate,
            skills: formData.skills,
            portfolio_url: formData.portfolioUrl || null,
        })
        .eq('profile_id', user.id);

        if(freelancerError) {
            console.error('❌ Freelancer update error:', freelancerError);
            throw new Error('Failed to update freelancer profile: ' + freelancerError.message);
        }
        
        console.log('✅ Freelancer profile updated');

        // Update profile_completed flag in profiles table
        console.log('🔄 Marking profile as completed...');
        const {error: profileError} = await supabase
        .from('profiles')
        .update({
            profile_completed: true
        })
        .eq('id', user.id);

        if(profileError) {
            console.error('❌ Profile completion error:', profileError);
            throw new Error('Failed to mark profile as completed: ' + profileError.message);
        }
        
        console.log('✅ Profile marked as completed');
        console.log('✅ Freelancer profile update complete!');
        
    } catch (error) {
        console.error('❌ Error in updateFreelancer:', error);
        throw error;
    }
}

