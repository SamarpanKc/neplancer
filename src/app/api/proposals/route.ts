import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabse/server';

// GET /api/proposals - Get proposals
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const freelancerId = searchParams.get('freelancerId');
    const jobId = searchParams.get('jobId');

    let query = supabase
      .from('proposals')
      .select(`
        *,
        jobs:job_id (
          id,
          title,
          description,
          budget,
          category,
          skills,
          status,
          created_at
        ),
        freelancers:freelancer_id (
          id,
          title,
          skills,
          hourly_rate,
          rating,
          profiles:profile_id (
            full_name,
            avatar_url
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (freelancerId) {
      query = query.eq('freelancer_id', freelancerId);
    }
    
    if (jobId) {
      query = query.eq('job_id', jobId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching proposals:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ proposals: data });
  } catch (error: any) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch proposals' },
      { status: 500 }
    );
  }
}

// POST /api/proposals - Submit a proposal
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { job_id, freelancer_id, cover_letter, proposed_budget, estimated_duration } = body;

    // Validate required fields
    if (!job_id || !freelancer_id || !cover_letter || !proposed_budget || !estimated_duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if proposal already exists
    const { data: existingProposal } = await supabase
      .from('proposals')
      .select('id')
      .eq('job_id', job_id)
      .eq('freelancer_id', freelancer_id)
      .single();

    if (existingProposal) {
      return NextResponse.json(
        { error: 'You have already submitted a proposal for this job' },
        { status: 400 }
      );
    }

    // Insert the proposal
    const { data, error } = await supabase
      .from('proposals')
      .insert({
        job_id,
        freelancer_id,
        cover_letter,
        proposed_budget: parseFloat(proposed_budget),
        estimated_duration,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating proposal:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, proposal: data });
  } catch (error: any) {
    console.error('Error creating proposal:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit proposal' },
      { status: 500 }
    );
  }
}
