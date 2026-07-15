import { beforeEach, describe, expect, it, vi } from "vitest";

const logSupabaseFallback = vi.hoisted(() => vi.fn());

const liveFilters = {
  county: null,
  saleWindowDays: null,
  minSalePrice: null,
  minAcreage: null,
  excludeLikelyDevelopers: false,
  requireDifferentMailingAddress: false,
  status: null,
} as const;

describe("land lead live query behavior", () => {
  beforeEach(() => {
    vi.resetModules();
    logSupabaseFallback.mockReset();
    vi.doMock("@/lib/supabase/env", () => ({
      getPublicEnv: () => ({
        demoMode: false,
        supabaseUrl: "https://example.supabase.co",
        supabaseAnonKey: "anon-key",
      }),
    }));
    vi.doMock("@/lib/admin/supabase-fallback", () => ({
      logSupabaseFallback,
    }));
  });

  it("does not return demo leads when a real Supabase query fails", async () => {
    const order = vi.fn(async () => ({
      data: null,
      error: { message: "permission denied for table land_leads" },
    }));

    vi.doMock("@/lib/supabase/server", () => ({
      createClient: async () => ({
        from: () => ({
          select: () => ({ order }),
        }),
      }),
    }));

    const { getLandLeads } = await import("./queries");

    await expect(
      getLandLeads({
        ...liveFilters,
      }),
    ).resolves.toEqual([]);
  });

  it("returns null when existing lead hash lookup fails before import diffing", async () => {
    const range = vi.fn(async () => ({
      data: null,
      error: { message: "permission denied for table land_leads" },
    }));

    vi.doMock("@/lib/supabase/server", () => ({
      createClient: async () => ({
        from: () => ({
          select: () => ({
            eq: () => ({ range }),
          }),
        }),
      }),
    }));

    const { getExistingLeadHashes } = await import("./queries");

    await expect(getExistingLeadHashes("weld")).resolves.toBeNull();
  });

  it("logs mutation errors before returning generic status failure text", async () => {
    const queryError = { message: "new row violates row-level security policy" };

    vi.doMock("@/lib/supabase/server", () => ({
      createClient: async () => ({
        from: () => ({
          update: () => ({
            eq: async () => ({ error: queryError }),
          }),
        }),
      }),
    }));

    const { updateLandLeadStatus } = await import("./queries");

    await expect(updateLandLeadStatus("lead-1", "reviewed")).resolves.toEqual({
      ok: false,
      reason: "Could not update the lead status. Please try again.",
    });
    expect(logSupabaseFallback).toHaveBeenCalledWith("land-lead-status", queryError);
  });
});
