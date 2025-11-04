import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
  try {
    const { email, password, name, role, username } = await request.json();
    
    // Validate input
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!['client', 'freelancer'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be "client" or "freelancer"' },
        { status: 400 }
      );
    }

    if (role === 'freelancer' && !username) {
      return NextResponse.json(
        { error: 'Username is required for freelancers' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Check if username is already taken (for freelancers)
    if (role === 'freelancer') {
      const { data: existingFreelancer } = await supabase
        .from('freelancers')
        .select('username')
        .eq('username', username)
        .single();

      if (existingFreelancer) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 400 }
        );
      }
    }

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: role,
        },
      },
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Registration failed' },
        { status: 400 }
      );
    }

    // Wait a moment for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create role-specific record
    if (role === 'client') {
      const { error: clientError } = await supabase
        .from('clients')
        .insert({
          profile_id: authData.user.id,
          jobs_posted: 0,
          total_spent: 0,
        });

      if (clientError) {
        console.error('Client creation error:', clientError);
      }
    } else if (role === 'freelancer') {
      const { error: freelancerError } = await supabase
        .from('freelancers')
        .insert({
          profile_id: authData.user.id,
          username: username,
          skills: [],
          total_earned: 0,
          completed_jobs: 0,
          rating: 0,
          total_reviews: 0,
          status: 'offline',
        });

      if (freelancerError) {
        console.error('Freelancer creation error:', freelancerError);
        return NextResponse.json(
          { error: 'Failed to create freelancer profile' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: name,
        role: role,
      },
      session: authData.session,
      message: 'Registration successful! Please check your email to verify your account.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
