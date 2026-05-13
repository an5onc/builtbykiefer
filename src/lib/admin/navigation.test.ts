import { describe, expect, it } from "vitest";
import { adminModuleMenus, getLiveAdminNavigationHrefs } from "./navigation";

describe("admin navigation", () => {
  it("keeps every existing admin route family reachable from the horizontal menus", () => {
    expect(getLiveAdminNavigationHrefs()).toEqual(
      expect.arrayContaining([
        "/admin",
        "/admin/leads",
        "/admin/proposals",
        "/admin/projects",
        "/admin/change-orders",
        "/admin/time",
        "/admin/invoices",
        "/",
      ]),
    );
  });

  it("marks planned Buildertrend-style items as disabled instead of linking nowhere", () => {
    const disabledLabels = adminModuleMenus.flatMap((menu) =>
      menu.items.filter((item) => item.disabled).map((item) => item.label),
    );

    expect(disabledLabels).toEqual(
      expect.arrayContaining(["Jobs Map", "Tasks", "Messages", "Purchase Orders"]),
    );
  });
});
