// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { signUp } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, fullName, role } = body;
    
    // Validate required fields
    if (!email || !password || !fullName || !role) {
      return NextResponse.json(
        { error: 'Email, password, full name, and role are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (role !== 'client' && role !== 'freelancer') {
      return NextResponse.json(
        { error: 'Role must be either "client" or "freelancer"' },
        { status: 400 }
      );
    }

    // Validate freelancer-specific fields
    if (role === 'freelancer' && !body.username) {
      return NextResponse.json(
        { error: 'Username is required for freelancers' },
        { status: 400 }
      );
    }

    // Prepare data for signup
    const signUpData = {
      email,
      password,
      fullName,
      role,
      // Freelancer fields
      username: body.username,
      skills: body.skills || [],
      hourlyRate: body.hourlyRate || null,
      bio: body.bio || null,
      title: body.title || null,
      // Client fields
      companyName: body.companyName || null,
      companyDescription: body.companyDescription || null,
      website: body.website || null,
      location: body.location || null,
    };

    const data = await signUp(signUpData);

    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 400 }
    );
  }
}