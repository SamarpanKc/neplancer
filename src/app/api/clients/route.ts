// app/api/clients/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');

    if (!profileId) {
      return NextResponse.json(
        { error: 'profileId is required' },
        { status: 400 }
      );
    }

    console.log('Fetching client for profile ID:', profileId);

    // Try to get existing client
    let { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('profile_id', profileId)
      .single();

    // If client doesn't exist, create it
    if (error && error.code === 'PGRST116') {
      console.log('Client not found, creating new client record...');
      
      const { data: newClient, error: createError } = await supabase
        .from('clients')
        .insert({
          profile_id: profileId,
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating client:', createError);
        return NextResponse.json(
          { error: 'Failed to create client profile' },
          { status: 500 }
        );
      }

      data = newClient;
      console.log('Client created successfully:', data);
    } else if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message || 'Client not found' },
        { status: 404 }
      );
    }

    if (!data) {
      console.error('No client data returned');
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    console.log('Client found:', data);

    return NextResponse.json({ client: data });
  } catch (error: any) {
    console.error('Error in GET /api/clients:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch client' },
      { status: 500 }
    );
  }
}
