import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

//quick Testn
console.log("url",supabaseUrl)
console.log("key",supabaseAnonKey)

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);   