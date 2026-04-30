import { createClient } from '@supabase/supabase-js'

// Note: This client uses the SERVICE ROLE KEY.
// It bypasses all Row Level Security.
// NEVER use this client in public-facing routes or client components.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
