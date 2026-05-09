import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client with SERVICE_ROLE key
// This bypasses RLS — use ONLY in secure server-side API routes
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
