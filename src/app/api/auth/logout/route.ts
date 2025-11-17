// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { signOut } from '@/lib/auth';

export async function POST() {
  try {
    await signOut();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Logout failed' },
      { status: 500 }
    );
  }
}