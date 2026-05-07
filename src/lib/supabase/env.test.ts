import { describe, expect, it } from "vitest";
import { getSupabaseRuntimeMode } from "./env";

describe("Supabase env runtime mode", () => {
  it("uses demo fallback by default when Supabase public env is missing", () => {
    expect(
      getSupabaseRuntimeMode({
        NEXT_PUBLIC_SUPABASE_URL: "",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
        NEXT_PUBLIC_DEMO_MODE: undefined,
      }),
    ).toEqual({ hasSupabase: false, demoMode: true });
  });

  it("requires Supabase when demo mode is explicitly disabled", () => {
    expect(
      getSupabaseRuntimeMode({
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
        NEXT_PUBLIC_DEMO_MODE: "false",
      }),
    ).toEqual({ hasSupabase: true, demoMode: false });
  });
});
