import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabse/server';

// GET /api/conversations - Get all conversations for the current user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get all conversations where user is a participant
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select(`
        *,
        messages:messages(
          id,
          content,
          created_at,
          read,
          sender_id
        )
      `)
      .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Get the other participant details for each conversation
    const conversationsWithUsers = await Promise.all(
      conversations.map(async (conv) => {
        const otherUserId = conv.participant_1_id === user.id 
          ? conv.participant_2_id 
          : conv.participant_1_id;

        const { data: otherUser } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, role')
          .eq('id', otherUserId)
          .single();

        // Get last message
        const lastMessage = conv.messages && conv.messages.length > 0
          ? conv.messages.sort((a: any, b: any) => 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )[0]
          : null;

        return {
          ...conv,
          otherUser,
          lastMessage,
        };
      })
    );

    return NextResponse.json({ conversations: conversationsWithUsers });
  } catch (error: any) {
    console.error('Error in GET /api/conversations:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/conversations - Create a new conversation
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { otherUserId, jobId } = body;

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!otherUserId) {
      return NextResponse.json(
        { error: 'otherUserId is required' },
        { status: 400 }
      );
    }

    // Ensure participant_1_id < participant_2_id for consistent ordering
    const [participant1, participant2] = [user.id, otherUserId].sort();

    // Check if conversation already exists
    let query = supabase
      .from('conversations')
      .select('*')
      .eq('participant_1_id', participant1)
      .eq('participant_2_id', participant2);

    if (jobId) {
      query = query.eq('job_id', jobId);
    } else {
      query = query.is('job_id', null);
    }

    const { data: existing } = await query.single();

    if (existing) {
      return NextResponse.json({ conversation: existing });
    }

    // Create new conversation
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        participant_1_id: participant1,
        participant_2_id: participant2,
        job_id: jobId || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ conversation: data });
  } catch (error: any) {
    console.error('Error in POST /api/conversations:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
