import { describe, expect, it } from "vitest";
import { navLinks } from "./nav";

function allHrefs(): string[] {
  return navLinks.flatMap((link) => [link.href, ...(link.children ?? []).map((c) => c.href)]);
}

describe("public navigation", () => {
  it("offers Contact Us as one direct route rather than a disclosure", () => {
    const contact = navLinks.find((link) => link.label === "Contact Us");
    expect(contact).toEqual({ label: "Contact Us", href: "/contact" });
    expect(allHrefs().filter((href) => href === "/contact")).toHaveLength(1);
  });
  it("includes the Why Kiefer Built hub and its child pages", () => {
    const hrefs = allHrefs();
    expect(hrefs).toContain("/why-kiefer-built");
    expect(hrefs).toContain("/why-kiefer-built/sips");
    expect(hrefs).toContain("/why-kiefer-built/energy-efficiency");
    expect(hrefs).toContain("/why-kiefer-built/indoor-air-quality");
    expect(hrefs).toContain("/why-kiefer-built/built-for-colorado");
    expect(hrefs).toContain("/why-kiefer-built/quality");
    expect(hrefs).toContain("/why-kiefer-built/cost-of-ownership");
  });

  it("never links to the dormant backend", () => {
    const hrefs = allHrefs().join(" ");
    expect(hrefs).not.toMatch(/\/portal/);
    expect(hrefs).not.toMatch(/\/vendor(s)?\b/);
    expect(hrefs).not.toMatch(/\/admin/);
    expect(hrefs).not.toMatch(/\/login/);
  });
});
