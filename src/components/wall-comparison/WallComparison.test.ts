import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { educationSources } from "@/lib/public-site/sources";
import WallComparison from "./WallComparison";
import WallPreview from "./WallPreview";
import { closeupTitles, illustrationTitles, previewContent, viewCaptions, wallContent, zoomLabels } from "./content";

const sipsPageNumbers = new Map([
  [9, 1],
  [3, 2],
]);

function render(props: Parameters<typeof WallComparison>[0]) {
  return renderToStaticMarkup(createElement(WallComparison, props));
}

// Server markup escapes text the way React does.
function escaped(text: string) {
  return text.replaceAll("&", "&amp;").replaceAll("'", "&#x27;").replaceAll('"', "&quot;");
}

function radio(html: string, value: string) {
  return html.match(new RegExp(`<input[^>]*value="${value}"[^>]*>`))?.[0] ?? "";
}

describe("WallComparison initial render", () => {
  it("starts on the stick-frame wall with a labeled, not-yet-active switch", () => {
    const html = render({ variant: "full", localSourceNumbers: sipsPageNumbers });

    expect(radio(html, "stick")).toMatch(/checked/);
    expect(radio(html, "sip")).not.toMatch(/checked/);
    // Disabled until hydration so a visitor without JavaScript never sees the switch and wall disagree.
    expect(radio(html, "stick")).toMatch(/disabled/);
    expect(html).toContain("Stick frame");
    expect(html).toContain("SIP panel");
    expect(html).toMatch(/<legend[^>]*>Wall type<\/legend>/);
  });

  it("describes the drawing for screen readers and announces caption changes", () => {
    const html = render({ variant: "full", localSourceNumbers: sipsPageNumbers });

    const labelledBy = html.match(/<div role="img" aria-labelledby="([^"]+)"/)?.[1];
    expect(labelledBy).toBeTruthy();
    expect(html).toContain(`<span id="${labelledBy}" class="sr-only">${escaped(illustrationTitles.stick)}</span>`);
    expect(html).toMatch(/<ol aria-live="polite"/);
  });

  it("renders the full version's captions, page-numbered citations and fine print", () => {
    const html = render({ variant: "full", localSourceNumbers: sipsPageNumbers });

    expect(html).toContain(wallContent.full.heading);
    expect(html).toContain(wallContent.full.mechanisms[0].states.stick.text);
    // Stick-frame heat caption cites SIPA, which is source 2 on the SIPs 101 page.
    expect(html).toContain('href="#source-2"');
    expect(html).toContain('aria-label="Source 2"');
    expect(html).toContain(escaped(wallContent.full.finePrint));
    expect(html).toMatch(/data-marker="air"/);
    expect(html).toMatch(/data-marker="heat"/);
  });

  it("shows the SIP captions and ORNL citation when opened on the SIP state", () => {
    const html = render({ variant: "full", defaultMode: "sip", localSourceNumbers: sipsPageNumbers });

    expect(radio(html, "sip")).toMatch(/checked/);
    expect(html).toContain(`>${escaped(illustrationTitles.sip)}</span>`);
    expect(html).toContain("about 15× less air");
    expect(html).toContain('href="#source-1"');
  });

  it("gives the compact version a direct ORNL link, a SIPs 101 link and only marker 1", () => {
    const stickHtml = render({ variant: "compact", tone: "dark" });
    const sipHtml = render({ variant: "compact", tone: "dark", defaultMode: "sip" });
    const ornlUrl = educationSources.find((source) => source.id === 9)!.links[0].url;

    expect(stickHtml).toContain(wallContent.compact.heading);
    expect(stickHtml).toContain('href="/why-kiefer-built/sips"');
    expect(stickHtml).toContain(wallContent.compact.finePrint);
    expect(stickHtml).toMatch(/data-marker="air"/);
    expect(stickHtml).not.toMatch(/data-marker="heat"/);
    expect(sipHtml).toContain(`href="${escaped(ornlUrl)}"`);
    expect(sipHtml).toContain("Source: ORNL, 2002");
    expect(sipHtml).toMatch(/rel="noopener noreferrer"/);
  });

  it("never hides its heading or captions in the server-rendered markup", () => {
    for (const html of [render({ variant: "full", localSourceNumbers: sipsPageNumbers }), render({ variant: "compact" })]) {
      const heading = html.match(/<h[23][^>]*>[^<]+<\/h[23]>/)?.[0] ?? "";
      expect(heading).not.toBe("");
      expect(heading).not.toMatch(/opacity:\s*0|display:\s*none|visibility:\s*hidden/);
      const captionList = html.match(/<ol aria-live="polite"[^>]*>/)?.[0] ?? "";
      expect(captionList).not.toMatch(/style=/);
    }
  });

  it("offers a floor button that zooms into the wall, inactive until hydration", () => {
    const html = render({ variant: "full", localSourceNumbers: sipsPageNumbers });

    const button = html.match(/<button[^>]*>[\s\S]*?<\/button>/)?.[0] ?? "";
    expect(button).toContain(zoomLabels.house);
    expect(button).toMatch(/disabled/);
    expect(html).toContain(viewCaptions.house);
    expect(html).not.toContain(escaped(closeupTitles.stick));
  });

  it("renders the inside-the-wall close-up with a way back", () => {
    const html = render({ variant: "full", defaultView: "wall", localSourceNumbers: sipsPageNumbers });

    expect(html).toContain(`<title id="wall-title-`);
    expect(html).toContain(escaped(closeupTitles.stick));
    expect(html).toContain(zoomLabels.wall);
    expect(html).toContain(viewCaptions.wall);
    // The house stays mounted for the zoom back out, hidden from screen readers.
    expect(html).toMatch(/aria-hidden="true"[^>]*><div role="img"/);
  });

  it("renders the homepage preview as the house alone with one link to the full comparison", () => {
    const html = renderToStaticMarkup(createElement(WallPreview));

    expect(html).toMatch(/<div role="img"/);
    expect(html).not.toMatch(/data-marker|<input|<button|<h[1-6]/);
    expect(html.match(/<a /g)).toHaveLength(1);
    expect(html).toContain(`href="${previewContent.href}"`);
    expect(html).toContain(previewContent.label);
    expect(html).not.toContain("sip.webp");
  });
});
