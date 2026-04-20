import { createClient } from '@supabase/supabase-js';

// Service role client: bypasses RLS for server-side reads.
// Safe because this file is never bundled into client code.
export async function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// Browser client lives in supabase-browser.ts to avoid next/headers in client bundles.
export { createSupabaseBrowserClient as createBrowserClient } from './supabase-browser';
