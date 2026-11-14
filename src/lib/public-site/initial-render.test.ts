import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import VendorInterestPage from "@/components/public-site/VendorInterestPage";
import ServiceAreasPage from "@/app/service-areas/page";
import ContemporaryRanchProject from "@/app/projects/contemporary-ranch/page";
import MountainModernProject from "@/app/projects/mountain-modern/page";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

// Inspect serialized element ancestry: an invisible ancestor also hides a heading/photo.
// Native browser/computed-style checks complement this server-render regression.
function hiddenContent(html: string) {
  const main = html.match(/<main\b[\s\S]*<\/main>/)?.[0] ?? html;
  const stack: Array<{ tag: string; hidden: boolean }> = [];
  const failures: string[] = [];
  let targets = 0;
  for (const token of main.matchAll(/<(\/?)([a-z][\w-]*)([^>]*)>/gi)) {
    const [, closing, tag, attrs] = token;
    if (closing) {
      const index = stack.map((entry) => entry.tag).lastIndexOf(tag);
      if (index >= 0) stack.length = index;
      continue;
    }
    const style = attrs.match(/\bstyle="([^"]*)"/)?.[1] ?? "";
    const hidden = stack.some((entry) => entry.hidden)
      || /\shidden(?:=|\s|$)/.test(attrs)
      || /(?:^|;)(?:opacity:\s*0(?:\.0+)?|display:\s*none|visibility:\s*hidden)(?:;|$)/.test(style);
    if (/^h[1-6]$/.test(tag) || tag === "img" || (tag === "button" && /aria-label="Open\b/.test(attrs))) {
      targets++;
      if (hidden) failures.push(`<${tag}${attrs}>`);
    }
    if (!/^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/.test(tag)) stack.push({ tag, hidden });
  }
  return { targets, failures };
}

describe("safe initial public rendering", () => {
  it("disables all vendor entry and submission before hydration with an explicit POST fallback", () => {
    const html = renderToStaticMarkup(createElement(VendorInterestPage));
    const form = html.match(/<form\b[^>]*>[\s\S]*?<\/form>/)?.[0] ?? "";
    expect(form).toMatch(/<form\b[^>]*action="\/vendors"[^>]*method="post"/);
    const fieldset = form.match(/<fieldset\b[^>]*disabled=""[^>]*>[\s\S]*?<\/fieldset>/)?.[0] ?? "";
    expect(fieldset.match(/<(?:input|textarea)\b/g)?.length).toBe(12);
    expect(fieldset).toMatch(/<button\b[^>]*type="submit"[^>]*disabled=""/);
    expect(form.replace(fieldset, "")).not.toMatch(/<(?:input|textarea|button)\b/);
    expect(html).toContain('href="mailto:marlys@kbuiltco.com"');
    expect(form).toContain("email Marlys directly");
  });

  it.each([
    ["service areas", ServiceAreasPage],
    ["ranch tour and photo gallery", ContemporaryRanchProject],
    ["mountain tour and photo gallery", MountainModernProject],
  ])("keeps essential %s headings and images visible in initial HTML", (_name, Page) => {
    const result = hiddenContent(renderToStaticMarkup(createElement(Page)));
    expect(result.targets).toBeGreaterThan(5);
    expect(result.failures).toEqual([]);
  });
});
