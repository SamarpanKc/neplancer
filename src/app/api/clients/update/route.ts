// app/api/clients/update/route.ts
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

    if (user.role !== 'client') {
      return NextResponse.json(
        { error: 'Unauthorized - not a client' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { 
      company_name, 
      location, 
      website, 
      company_description,
      logo_url 
    } = body;

    // Check if client record exists
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('profile_id', user.id)
      .single();

    if (existingClient) {
      // Update existing client
      const { data, error } = await supabase
        .from('clients')
        .update({
          ...(company_name !== undefined && { company_name }),
          ...(location !== undefined && { location }),
          ...(website !== undefined && { website }),
          ...(company_description !== undefined && { company_description }),
        })
        .eq('profile_id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return NextResponse.json({ 
        success: true,
        client: data 
      });
    } else {
      // Create new client record
      const { data, error } = await supabase
        .from('clients')
        .insert({
          profile_id: user.id,
          company_name,
          location,
          website,
          company_description,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return NextResponse.json({ 
        success: true,
        client: data 
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update client profile';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
