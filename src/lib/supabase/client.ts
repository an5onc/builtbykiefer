import { createBrowserClient } from "@supabase/ssr";
import { getPublicEnv } from "./env";
import type { Database } from "./database.types";

export function createClient() {
  const env = getPublicEnv();

  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  return createBrowserClient<Database>(env.supabaseUrl, env.supabaseAnonKey);
}
