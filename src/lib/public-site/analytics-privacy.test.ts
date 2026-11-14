import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import RootLayout from "@/app/layout";
import PrivacyPage, { metadata } from "@/app/privacy-policy/page";

vi.mock("next/font/google", () => ({ Geist: () => ({ variable: "sans" }), Geist_Mono: () => ({ variable: "mono" }) }));
vi.mock("next/navigation", () => ({ usePathname: () => "/privacy-policy", useRouter: () => ({ push: vi.fn() }) }));

describe("local analytics removal and truthful notice", () => {
  it("renders root content and structured data without an analytics loader", () => {
    const html = renderToStaticMarkup(createElement(RootLayout, null, createElement("main", null, "Local visitor content")));
    expect(html).toContain("Local visitor content");
    expect(html).toContain('type="application/ld+json"');
    expect(html).not.toMatch(/googletagmanager|google-analytics|G-BBCR31BJSM|_next-ga|gtag\(/);
  });

  it("preserves inquiry, provider and temporary-cookie explanations without obsolete analytics claims", () => {
    const html = renderToStaticMarkup(createElement(PrivacyPage));
    expect(html).toContain("email service accepted the request for delivery");
    expect(html).toContain("five minutes");
    expect(html).toContain("Emails, provider records and hosting records are separate");
    expect(html).toContain("info@kbuiltco.com");
    expect(html).toContain("Career applications");
    expect(html).toContain("résumé attached");
    expect(html).toContain("does not create a public download link");
    expect(html).not.toMatch(/Google Analytics|never track|never share|never sell/);
    expect(metadata.description).not.toContain("analytics");
  });
});
