// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { signOut } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    await signOut();
    
    // Clear all Supabase cookies from the server side
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    
    const response = NextResponse.json({ success: true });
    
    // Clear Supabase auth cookies
    allCookies.forEach(cookie => {
      if (cookie.name.includes('sb-') || cookie.name.includes('supabase')) {
        response.cookies.delete(cookie.name);
      }
    });
    
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Logout failed' },
      { status: 500 }
    );
  }
}