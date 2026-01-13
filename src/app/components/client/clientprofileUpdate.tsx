'use client';

import {supabase} from '@/lib/supabase'
import type {ClientProfileFormData} from '@/types'

export async function updateClient(formData:ClientProfileFormData){
    
    const{data:{user}} = await supabase.auth.getUser();
    
    if(!user) throw new Error('Not Logged in'); 

    const {error} = await supabase
    .from('clients')
    .update({
        
        company_name:formData.company_name,
        company_description:formData.company_description,
        website:formData.website,
        location:formData.location,
    })
    .eq('profile_id',user.id);

    if(error) throw error;

    const{error:IndicationError} = await supabase
    .from('profiles')
    .update({
        profile_completed:true,
    })
    .eq('id',user.id);
    
    if(IndicationError) throw IndicationError;
}