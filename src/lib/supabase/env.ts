import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_DEMO_MODE: z.string().optional(),
});

export function getPublicEnv() {
  const parsed = publicEnvSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE,
  });

  return {
    supabaseUrl: parsed.NEXT_PUBLIC_SUPABASE_URL || null,
    supabaseAnonKey: parsed.NEXT_PUBLIC_SUPABASE_ANON_KEY || null,
    demoMode: parsed.NEXT_PUBLIC_DEMO_MODE !== "false",
  };
}

export function hasSupabasePublicEnv() {
  const env = getPublicEnv();
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}
