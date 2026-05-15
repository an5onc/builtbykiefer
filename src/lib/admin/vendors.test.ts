import { describe, expect, it } from "vitest";
import {
  parseProjectVendorAssignmentCreateFormData,
  parseVendorCreateFormData,
  projectVendorAssignmentStatusOptions,
  vendorCompanyTypeOptions,
} from "./vendors";

function formData(values: Record<string, string>) {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}

describe("vendor helpers", () => {
  it("parses a vendor profile", () => {
    expect(
      parseVendorCreateFormData(
        formData({
          name: "Front Range Cabinetry",
          companyType: "subcontractor",
          trade: "Cabinetry",
          email: "schedule@frcabinetry.example",
          phone: "(970) 555-0199",
          status: "active",
          portalAccess: "on",
          notes: "Preferred cabinet partner.",
        }),
      ),
    ).toEqual({
      ok: true,
      data: {
        name: "Front Range Cabinetry",
        companyType: "subcontractor",
        trade: "Cabinetry",
        email: "schedule@frcabinetry.example",
        phone: "(970) 555-0199",
        status: "active",
        portalAccess: true,
        notes: "Preferred cabinet partner.",
      },
    });
  });

  it("parses a project vendor assignment", () => {
    expect(
      parseProjectVendorAssignmentCreateFormData(
        formData({
          vendorId: "vendor-1",
          scope: "Cabinet layout, shop drawings, and install coordination.",
          startDate: "2026-05-20",
          endDate: "2026-06-12",
          status: "active",
          visibility: "customer",
        }),
      ),
    ).toEqual({
      ok: true,
      data: {
        vendorId: "vendor-1",
        scope: "Cabinet layout, shop drawings, and install coordination.",
        startDate: "2026-05-20",
        endDate: "2026-06-12",
        status: "active",
        visibility: "customer",
      },
    });
  });

  it("rejects assignment without a vendor", () => {
    expect(
      parseProjectVendorAssignmentCreateFormData(
        formData({
          vendorId: "",
          scope: "Cabinet layout.",
          startDate: "2026-05-20",
          endDate: "",
          status: "scheduled",
          visibility: "internal",
        }),
      ),
    ).toEqual({ ok: false, reason: "Choose a vendor or subcontractor." });
  });

  it("exposes expected vendor option sets", () => {
    expect(vendorCompanyTypeOptions.map((option) => option.value)).toEqual(["subcontractor", "vendor"]);
    expect(projectVendorAssignmentStatusOptions.map((option) => option.value)).toEqual([
      "invited",
      "scheduled",
      "active",
      "complete",
    ]);
  });
});
