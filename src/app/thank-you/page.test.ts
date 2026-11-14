import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ThankYouPage, { metadata } from "./page";

const receipt = vi.hoisted(() => ({ value: undefined as string | undefined }));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => receipt.value ? { value: receipt.value } : undefined }) }));
vi.mock("@/components/Header", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));

describe("native quote confirmation", () => {
  beforeEach(() => { receipt.value = undefined; });

  it("does not claim acceptance for a direct visit or unknown receipt", async () => {
    for (const value of [undefined, "unexpected"]) {
      receipt.value = value;
      const html = renderToStaticMarkup(await ThankYouPage());
      expect(html).toContain("Visiting this page does not confirm a request was sent");
      expect(html).not.toContain("Request submitted");
      expect(html).toContain('href="tel:+19705155059"');
      expect(html).toContain('href="mailto:info@kbuiltco.com"');
    }
  });

  it("thanks accepted leads without promising inbox receipt or a response time", async () => {
    receipt.value = "accepted";
    const html = renderToStaticMarkup(await ThankYouPage());
    expect(html).toContain("Thank you for reaching out.");
    expect(html).toContain("accepted for email delivery");
    expect(html).not.toMatch(/Message received|be in touch soon|Buildertrend|397-7587/);
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
