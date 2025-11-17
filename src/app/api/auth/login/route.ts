// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { signIn } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const data = await signIn(email, password);

    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 401 }
    );
  }
}