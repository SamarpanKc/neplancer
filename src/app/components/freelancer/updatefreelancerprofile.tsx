'use client';

import {supabase} from '@/lib/supabase'
import type {FreelancerProfileFormData} from '@/types'

export async function updateFreelancer(formData: FreelancerProfileFormData){
    
    const{data:{user}} = await supabase.auth.getUser();

    if(!user) throw new Error('Not Logged in');

    // Update freelancer profile
    const {error} = await supabase
    .from('freelancers')
    .update({
        username:formData.username,
        title:formData.title,
        bio:formData.bio,
        hourly_rate:formData.hourlyRate,
        skills:formData.skills,
        portfolio_url:formData.portfolioUrl,
    })
    .eq('profile_id',user.id);

    if(error) throw error;

    // Update profile_completed flag in profiles table
    const {error: profileError} = await supabase
    .from('profiles')
    .update({
        profile_completed: true
    })
    .eq('id', user.id);

    if(profileError) throw profileError;
}
