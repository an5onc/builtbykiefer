import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import RootLayout from "@/app/layout";
import PrivacyPage, { metadata } from "@/app/privacy-policy/page";
import { GOOGLE_ADS_ID, GOOGLE_ADS_SCRIPT_ID } from "./google-ads";

vi.mock("next/font/google", () => ({ Geist: () => ({ variable: "sans" }), Geist_Mono: () => ({ variable: "mono" }) }));
vi.mock("next/navigation", () => ({ usePathname: () => "/privacy-policy", useRouter: () => ({ push: vi.fn() }) }));
vi.mock("next/script", () => ({ default: ({ id, children, strategy }: { id: string; children: string; strategy: string }) =>
  createElement("script", { id, "data-strategy": strategy, dangerouslySetInnerHTML: { __html: children } }) }));

describe("sitewide Google Ads and truthful notice", () => {
  it("includes one deferred Google Ads bootstrap in the shared root while preserving content and schema", () => {
    const html = renderToStaticMarkup(createElement(RootLayout, null, createElement("main", null, "Local visitor content")));
    expect(html).toContain("Local visitor content");
    expect(html).toContain('type="application/ld+json"');
    expect(html.split(`id="${GOOGLE_ADS_SCRIPT_ID}"`)).toHaveLength(2);
    expect(html).toContain('data-strategy="afterInteractive"');
    expect(html).toContain(`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`);
    expect(html).not.toMatch(/google-analytics|G-BBCR31BJSM|_next-ga/);
  });

  it("discloses Google Ads while preserving inquiry, provider and temporary-cookie explanations", () => {
    const html = renderToStaticMarkup(createElement(PrivacyPage));
    expect(html).toContain("email service accepted the request for delivery");
    expect(html).toContain("five minutes");
    expect(html).toContain("Emails, provider records and hosting records are separate");
    expect(html).toContain("info@kbuiltco.com");
    expect(html).toContain("Career applications");
    expect(html).toContain("résumé attached");
    expect(html).toContain("does not create a public download link");
    expect(html).not.toMatch(/never track|never share|never sell/);
    expect(html).toContain("Google Ads and Google Analytics");
    expect(html).toContain("Customer-data matching is disabled");
    expect(html).toContain("do not send form entries or résumé contents to Google for that purpose");
    expect(html).toContain("https://policies.google.com/technologies/partner-sites");
    expect(metadata.description).toContain("Google Ads and Analytics measurement");
  });
});
