import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.warn(
    "Supabase env vars are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY " +
      "(locally in a .env file, or in Netlify → Site configuration → Environment variables)."
  );
}

export const supabase = createClient(url || "", anonKey || "");
