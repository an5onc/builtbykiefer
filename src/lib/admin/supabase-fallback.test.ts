import { describe, expect, it, vi } from "vitest";
import { formatSupabaseFallbackMessage, logSupabaseFallback } from "./supabase-fallback";

describe("Supabase fallback logging", () => {
  it("formats Supabase error details without relying on enumerable properties", () => {
    expect(
      formatSupabaseFallbackMessage("project-comments", {
        code: "PGRST205",
        message: "Could not find the table",
        details: "Schema cache not refreshed.",
      }),
    ).toBe(
      "[admin:project-comments] Falling back to demo data: PGRST205 Could not find the table Schema cache not refreshed.",
    );
  });

  it("logs fallback as a warning so Next dev does not show an error overlay", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    logSupabaseFallback("project-comments", { message: "Temporary Supabase error" });

    expect(warn).toHaveBeenCalledWith(
      "[admin:project-comments] Falling back to demo data: Temporary Supabase error",
    );
    expect(error).not.toHaveBeenCalled();

    warn.mockRestore();
    error.mockRestore();
  });
});
