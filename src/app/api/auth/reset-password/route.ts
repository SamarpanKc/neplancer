import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { resetPasswordSchema } from '@/lib/validations';
import { ZodError } from 'zod';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = resetPasswordSchema.parse(body);

    // Update password
    const { error } = await supabase.auth.updateUser({
      password: validatedData.password,
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.',
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to reset password' },
      { status: 500 }
    );
  }
}
