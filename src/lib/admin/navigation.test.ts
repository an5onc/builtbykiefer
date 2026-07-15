import { describe, expect, it } from "vitest";
import { adminModuleMenus, getLiveAdminNavigationHrefs } from "./navigation";

describe("admin navigation", () => {
  it("keeps every existing admin route family reachable from the horizontal menus", () => {
    const liveHrefs = getLiveAdminNavigationHrefs();

    expect(liveHrefs).toEqual(
      expect.arrayContaining([
        "/admin",
        "/admin/leads",
        "/admin/proposals",
        "/admin/projects",
        "/admin/change-orders",
        "/admin/comments",
        "/admin/daily-logs",
        "/admin/bills",
        "/admin/purchase-orders",
        "/admin/rfis",
        "/admin/schedule",
        "/admin/selections",
        "/admin/tasks",
        "/admin/warranty",
        "/admin/vendors",
        "/admin/photos",
        "/admin/reports",
        "/admin/finance-tools",
        "/admin/time",
        "/admin/invoices",
        "/",
      ]),
    );
    expect(liveHrefs).not.toContain("/estimate");
  });

  it("does not advertise the unshipped Land Lead Finder route", () => {
    const liveHrefs = getLiveAdminNavigationHrefs();
    const labels = adminModuleMenus.flatMap((menu) =>
      menu.items.map((item) => item.label),
    );

    expect(liveHrefs).not.toContain("/admin/land-leads");
    expect(labels).not.toContain("Land Lead Finder");
  });

  it("marks planned Buildertrend-style items as disabled instead of linking nowhere", () => {
    const disabledLabels = adminModuleMenus.flatMap((menu) =>
      menu.items.filter((item) => item.disabled).map((item) => item.label),
    );

    expect(disabledLabels).toEqual(expect.arrayContaining(["Jobs Map", "Messages"]));
    expect(disabledLabels).toContain("Estimate");
    expect(disabledLabels).not.toContain("Tasks");
    expect(disabledLabels).not.toContain("Comments");
    expect(disabledLabels).not.toContain("Selections");
    expect(disabledLabels).not.toContain("RFIs");
    expect(disabledLabels).not.toContain("Purchase Orders");
    expect(disabledLabels).not.toContain("Bills");
    expect(disabledLabels).not.toContain("Daily Logs");
    expect(disabledLabels).not.toContain("Warranties");
    expect(disabledLabels).not.toContain("Trade Partners");
    expect(disabledLabels).not.toContain("Photos");
    expect(disabledLabels).not.toContain("Job Reports");
    expect(disabledLabels).not.toContain("Financial Reports");
    expect(disabledLabels).not.toContain("Finance Tools");
  });
});
