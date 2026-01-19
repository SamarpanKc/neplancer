// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { signUp } from '@/lib/auth';
import { signUpSchema } from '@/lib/validations';
import { ZodError } from 'zod';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = signUpSchema.parse(body);

    // Role-specific validation
    if (validatedData.role === 'freelancer' && !validatedData.username) {
      return NextResponse.json(
        { error: 'Username is required for freelancers' },
        { status: 400 }
      );
    }

    const data = await signUp(validatedData);

    // Check if email confirmation is required
    const emailConfirmationRequired = !data.session;

    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
      message: emailConfirmationRequired 
        ? 'Registration successful! Please check your email to verify your account.'
        : 'Registration successful! Welcome to Neplancer.',
      emailConfirmationRequired,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 400 }
    );
  }
}