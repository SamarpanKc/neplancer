'use client';

import {supabase} from '@/lib/supabase'
import type {FreelancerProfileFormData} from '@/types'

export async function updateFreelancer(formData: FreelancerProfileFormData){
    
    const{data:{user}} = await supabase.auth.getUser();

    if(!user) throw new Error('Not Logged in');

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
}
