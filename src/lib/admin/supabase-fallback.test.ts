import { describe, expect, it, vi } from "vitest";
import { formatSupabaseFallbackMessage, logSupabaseFallback } from "./supabase-fallback";

describe("Supabase fallback (fail-loud, remediation H2)", () => {
  it("formats Supabase error details without relying on enumerable properties", () => {
    expect(
      formatSupabaseFallbackMessage("project-comments", {
        code: "PGRST205",
        message: "Could not find the table",
        details: "Schema cache not refreshed.",
      }),
    ).toBe(
      "[admin:project-comments] Supabase query failed: PGRST205 Could not find the table Schema cache not refreshed.",
    );
  });

  it("throws on a live Supabase error instead of silently returning demo data", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() =>
      logSupabaseFallback("project-comments", { message: "Temporary Supabase error" }),
    ).toThrow("[admin:project-comments] Supabase query failed: Temporary Supabase error");

    expect(error).toHaveBeenCalledWith(
      "[admin:project-comments] Supabase query failed: Temporary Supabase error",
    );

    error.mockRestore();
  });
});
