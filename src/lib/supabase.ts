import { createClient } from '@supabase/supabase-js'

// Server-side only — SUPABASE_SERVICE_ROLE_KEY is never sent to the browser.
// Only import this file inside API routes or server components.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)
