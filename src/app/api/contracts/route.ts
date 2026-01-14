import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabse/server';

// GET /api/contracts - Get all contracts for the authenticated user
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('contracts')
      .select(`
        *,
        jobs:job_id (
          id,
          title,
          category
        ),
        client:client_id (
          id,
          full_name,
          avatar_url
        ),
        freelancer:freelancer_id (
          id,
          full_name,
          avatar_url
        ),
        proposal:proposal_id (
          id,
          proposed_budget,
          estimated_duration
        )
      `)
      .or(`client_id.eq.${user.id},freelancer_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: contracts, error } = await query;

    if (error) {
      console.error('Error fetching contracts:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ contracts });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch contracts';
    console.error('Error fetching contracts:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/contracts - Create a new contract
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      proposal_id,
      job_id,
      freelancer_id,
      title,
      description,
      contract_type,
      total_amount,
      hourly_rate,
      start_date,
      end_date,
      estimated_hours,
      terms,
      deliverables,
      payment_terms,
      custom_fields,
      milestones
    } = body;

    console.log('📝 Creating contract with data:', {
      proposal_id,
      job_id,
      freelancer_id,
      title,
      total_amount
    });

    // Validate required fields
    if (!job_id || !freelancer_id || !title) {
      console.error('❌ Missing required fields:', { job_id, freelancer_id, title, total_amount });
      return NextResponse.json(
        { error: 'Missing required fields: job_id, freelancer_id, and title are required' },
        { status: 400 }
      );
    }

    if (!total_amount || parseFloat(total_amount) <= 0) {
      console.error('❌ Invalid total_amount:', total_amount);
      return NextResponse.json(
        { error: 'Total amount must be a positive number' },
        { status: 400 }
      );
    }

    // Get freelancer profile_id (freelancer_id might be from freelancers table)
    const { data: freelancerData, error: freelancerError } = await supabase
      .from('freelancers')
      .select('profile_id, profiles:profile_id(full_name)')
      .eq('id', freelancer_id)
      .single();

    if (freelancerError || !freelancerData) {
      return NextResponse.json(
        { error: 'Freelancer not found' },
        { status: 404 }
      );
    }

    const freelancerProfileId = freelancerData.profile_id;

    // Create the contract
    const { data: contract, error: contractError } = await supabase
      .from('contracts')
      .insert({
        proposal_id,
        job_id,
        client_id: user.id,
        freelancer_id: freelancerProfileId,
        title,
        description,
        total_amount: parseFloat(total_amount),
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (contractError) {
      console.error('Error creating contract:', contractError);
      return NextResponse.json(
        { error: contractError.message },
        { status: 500 }
      );
    }

    // Create milestones if provided
    if (milestones && Array.isArray(milestones) && milestones.length > 0) {
      const milestonesData = milestones.map((m: { title: string; description: string; amount: number; due_date: string }) => ({
        contract_id: contract.id,
        title: m.title,
        description: m.description,
        amount: parseFloat(String(m.amount)),
        due_date: m.due_date,
        status: 'pending',
      }));

      const { error: milestonesError } = await supabase
        .from('contract_milestones')
        .insert(milestonesData);

      if (milestonesError) {
        console.error('Error creating milestones:', milestonesError);
        // Don't fail the request
      }
    }

    // Send contract to freelancer's messages
    const { data: conversation } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(participant_1_id.eq.${user.id},participant_2_id.eq.${freelancerProfileId}),and(participant_1_id.eq.${freelancerProfileId},participant_2_id.eq.${user.id})`)
      .maybeSingle();

    let conversationId = conversation?.id;

    // Create conversation if doesn't exist
    if (!conversationId) {
      const participant1 = user.id < freelancerProfileId ? user.id : freelancerProfileId;
      const participant2 = user.id < freelancerProfileId ? freelancerProfileId : user.id;

      const { data: newConv, error: newConvError } = await supabase
        .from('conversations')
        .insert({
          participant_1_id: participant1,
          participant_2_id: participant2,
          job_id,
        })
        .select()
        .single();

      if (newConvError) {
        console.error('Error creating conversation:', newConvError);
      } else {
        conversationId = newConv.id;
      }
    }

    // Send contract message
    if (conversationId) {
      const contractMessage = `📄 **Contract Received**\n\n` +
        `**${title}**\n\n` +
        `${description || ''}\n\n` +
        `**Type:** ${contract_type.replace('_', ' ').toUpperCase()}\n` +
        `**Amount:** NPR ${total_amount}\n` +
        `${hourly_rate ? `**Hourly Rate:** NPR ${hourly_rate}/hr\n` : ''}` +
        `${estimated_hours ? `**Estimated Hours:** ${estimated_hours} hrs\n` : ''}` +
        `\n**Terms:** ${terms || 'See contract details'}\n` +
        `\nPlease review and sign the contract to proceed.\n` +
        `View Contract: /contracts/${contract.id}`;

      await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: contractMessage,
          read: false,
        });
    }

    // Create notification for freelancer
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: freelancerProfileId,
        type: 'contract_received',
        title: 'New Contract Received! 📝',
        message: `You have received a contract for "${title}". Review and sign to start working!`,
        link: `/contracts/${contract.id}`,
        read: false,
        created_at: new Date().toISOString(),
      });

    if (notificationError) {
      console.error('Error creating notification:', notificationError);
    }

    return NextResponse.json({ 
      success: true, 
      contract,
      message: 'Contract created and sent to freelancer!'
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create contract';
    console.error('Error creating contract:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
