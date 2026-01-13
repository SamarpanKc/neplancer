import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  
  // Debug: Log available cookies
  const allCookies = cookieStore.getAll()
  console.log('Available cookies:', allCookies.map(c => c.name).join(', '))

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => 
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            // Ignore errors in server components where cookies can't be set
            console.log('Could not set cookie:', error)
          }
        },
      },
    }
  )
}