// Supabase client — connects to your Anvil database in the cloud.
// URL and anon key come from environment variables.
//
// LOCAL DEV: copy .env.example to .env.local and fill in your values
// PRODUCTION: set these in Vercel → Settings → Environment Variables

import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error(
    "Missing Supabase environment variables. Make sure VITE_SUPABASE_URL and " +
    "VITE_SUPABASE_ANON_KEY are set in your .env.local file (local) or Vercel " +
    "environment variables (production)."
  );
}

export const supabase = createClient(url || "https://placeholder.supabase.co", anonKey || "placeholder", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Helper: returns true if credentials are configured. UI can use this to show
// a setup-required screen when running locally without env vars.
export const isSupabaseConfigured = !!(url && anonKey);
