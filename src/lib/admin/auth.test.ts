import { describe, expect, it } from "vitest";
import { canUseAdminSession } from "./auth";

describe("admin auth guard", () => {
  it("allows only admin profiles matching the configured admin email when one is configured", () => {
    expect(
      canUseAdminSession({
        userEmail: "owner@builtbykiefer.com",
        profileRole: "admin",
        allowedAdminEmail: "owner@builtbykiefer.com",
      }),
    ).toBe(true);

    expect(
      canUseAdminSession({
        userEmail: "field@builtbykiefer.com",
        profileRole: "employee",
        allowedAdminEmail: "owner@builtbykiefer.com",
      }),
    ).toBe(false);

    expect(
      canUseAdminSession({
        userEmail: "other@example.com",
        profileRole: "admin",
        allowedAdminEmail: "owner@builtbykiefer.com",
      }),
    ).toBe(false);
  });

  it("allows any admin profile when no specific admin email is configured", () => {
    expect(
      canUseAdminSession({
        userEmail: "admin@example.com",
        profileRole: "admin",
        allowedAdminEmail: null,
      }),
    ).toBe(true);
  });
});
