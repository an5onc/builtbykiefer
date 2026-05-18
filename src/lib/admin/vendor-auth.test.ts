import { describe, expect, it } from "vitest";
import { canUseVendorSession, parseVendorLoginFormData } from "./vendor-auth";
import type { Vendor } from "./types";

function formData(values: Record<string, string>) {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}

const vendor: Vendor = {
  id: "vendor-1",
  name: "Front Range Cabinetry",
  companyType: "subcontractor",
  trade: "Cabinetry",
  email: "schedule@frcabinetry.example",
  authEmail: "portal@frcabinetry.example",
  phone: "(970) 555-0199",
  status: "active",
  portalAccess: true,
  notes: "",
  createdAt: "2026-05-14T09:00:00-06:00",
};

describe("vendor auth helpers", () => {
  it("allows active portal vendors by auth email", () => {
    expect(canUseVendorSession({ userEmail: "PORTAL@frcabinetry.example", vendor })).toBe(true);
  });

  it("falls back to vendor contact email when auth email is not set", () => {
    expect(
      canUseVendorSession({
        userEmail: "schedule@frcabinetry.example",
        vendor: { ...vendor, authEmail: "" },
      }),
    ).toBe(true);
  });

  it("rejects inactive or non-portal vendors", () => {
    expect(canUseVendorSession({ userEmail: "portal@frcabinetry.example", vendor: { ...vendor, status: "inactive" } })).toBe(false);
    expect(canUseVendorSession({ userEmail: "portal@frcabinetry.example", vendor: { ...vendor, portalAccess: false } })).toBe(false);
  });

  it("parses vendor login form data", () => {
    expect(
      parseVendorLoginFormData(
        formData({
          email: "  PORTAL@frcabinetry.example  ",
          password: "temporary-password",
          next: "/vendor",
        }),
      ),
    ).toEqual({
      ok: true,
      data: {
        email: "portal@frcabinetry.example",
        password: "temporary-password",
        next: "/vendor",
      },
    });
  });
});
