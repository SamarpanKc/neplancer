// app/api/freelancers/route.ts
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (user.role !== 'freelancer') {
      return NextResponse.json(
        { error: 'Unauthorized - not a freelancer' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { 
      username, 
      title, 
      bio, 
      hourly_rate, 
      skills, 
      portfolio_url,
      avatar_url 
    } = body;

    // Check if freelancer record exists
    const { data: existingFreelancer } = await supabase
      .from('freelancers')
      .select('id')
      .eq('profile_id', user.id)
      .single();

    if (existingFreelancer) {
      // Update existing freelancer
      const { data, error } = await supabase
        .from('freelancers')
        .update({
          ...(username !== undefined && { username }),
          ...(title !== undefined && { title }),
          ...(bio !== undefined && { bio }),
          ...(hourly_rate !== undefined && { hourly_rate }),
          ...(skills !== undefined && { skills }),
          ...(portfolio_url !== undefined && { portfolio_url }),
        })
        .eq('profile_id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return NextResponse.json({ 
        success: true,
        freelancer: data 
      });
    } else {
      // Create new freelancer record
      const { data, error } = await supabase
        .from('freelancers')
        .insert({
          profile_id: user.id,
          username,
          title,
          bio,
          hourly_rate,
          skills: skills || [],
          portfolio_url,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return NextResponse.json({ 
        success: true,
        freelancer: data 
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update freelancer profile';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
