import { describe, expect, it } from "vitest";
import { getFloatingActionForPathname } from "./floating-actions";

describe("global floating action policy", () => {
  it("uses quote CTA on public marketing pages", () => {
    expect(getFloatingActionForPathname("/")).toBe("quote");
    expect(getFloatingActionForPathname("/projects/mountain-modern")).toBe("quote");
  });

  it("uses project updates on client portal pages", () => {
    expect(getFloatingActionForPathname("/portal/projects/project-1")).toBe("updates");
  });

  it("hides floating actions on admin and login pages", () => {
    expect(getFloatingActionForPathname("/admin/daily-logs")).toBeNull();
    expect(getFloatingActionForPathname("/login")).toBeNull();
  });
});
