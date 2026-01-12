'use client';
    
import {supabase} from '@/lib/supabase'

export async function UploadAvatar(file:File): Promise<string> {
    const {data: {user}} = await supabase.auth.getUser();

    if(!user) throw new Error('Not Logged in');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/avatar.${fileExt}`;

    const {data,error:uploadError} = await supabase.storage
    .from('profilepictures')
    .upload(fileName,file,{
        upsert:true,
    });

    if (uploadError) throw uploadError;
    
    const {data:urlData} = supabase
    .storage
    .from('profilepictures')
    .getPublicUrl(fileName);

    

    // Update user's avatar URL in profile
    const {error:profileError} = await supabase
    .from('profiles')
    .update({avatar_url: urlData.publicUrl})
    .eq('id', user.id);
    
    if(profileError) throw profileError;

    return urlData.publicUrl;
}       