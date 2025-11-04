import { NextResponse } from 'next/server';
import { signUp } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password, name, role } = await request.json();
    
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

    // Use demo auth
    const result = await signUp(email, password, { name, role });

    return NextResponse.json({
      success: true,
      user: result.user,
      session: result.session,
      message: 'Registration successful! You can now explore the platform.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
