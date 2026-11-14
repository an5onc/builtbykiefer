import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import Home from "@/app/page";
import ContactPage from "@/app/contact/page";
import NewBuildsPage from "@/app/projects/new-builds/page";
import Header from "@/components/Header";
import { publicRoutes } from "./routes";
import { parseQuoteRequestPayload } from "@/lib/contact/quote-request";
import { buildQuoteRequestRecovery, formatQuoteRequestEmail } from "@/lib/contact/quote-email";
import { selectQuoteAttempt } from "@/lib/contact/quote-attempt";

vi.mock("next/navigation", () => ({ usePathname: () => "/", useRouter: () => ({ push: vi.fn() }) }));

const destinations = ["/projects/contemporary-ranch", "/projects/contemporary-ranch", "/projects/renovations-additions",
  "/projects/mountain-modern", "/projects/contemporary-ranch", "/projects/contemporary-ranch", "/projects/mountain-modern",
  "/projects/contemporary-ranch", "/services/custom-elevators"];
const homeHtml = () => renderToStaticMarkup(createElement(Home));

describe("rendered inquiry paths", () => {
  it("renders one direct contact link in each desktop/mobile/no-JS navigation surface", () => {
    const html = renderToStaticMarkup(createElement(Header));
    for (const name of ["Main navigation", "Mobile navigation", "Navigation without JavaScript"]) {
      const nav = html.match(new RegExp(`<nav\\b[^>]*aria-label="${name}"[^>]*>[\\s\\S]*?</nav>`))?.[0] ?? "";
      expect(nav).not.toBe("");
      expect(nav.match(/<a\b[^>]*href="\/contact"[^>]*>Contact Us<\/a>/g)).toHaveLength(1);
      expect(nav).not.toMatch(/<button\b[^>]*>Contact Us/);
    }
  });

  it.each([["homepage", Home], ["contact page", ContactPage]] as const)("renders all existing choices plus one elevator option on %s", (_name, Page) => {
    const html = renderToStaticMarkup(createElement(Page));
    const select = html.match(/<select\b[^>]*name="projectType"[^>]*>[\s\S]*?<\/select>/)?.[0] ?? "";
    expect(select).toMatch(/required=""/);
    const values = [...select.matchAll(/<option\b[^>]*value="([^"]*)"/g)].map((match) => match[1]).filter(Boolean);
    expect(values).toEqual(["Custom home", "Kitchen remodel", "Bathroom remodel", "Addition", "Basement finish", "Exterior work", "Custom elevator", "Commercial project", "Not sure yet"]);
  });

  it("renders original photo links once in the tab order and matching decorative pointer copies", () => {
    const html = homeHtml();
    const cards = [...html.matchAll(/<article\b([^>]*)>([\s\S]*?)<\/article>/g)].filter((match) => match[2].includes("kiefer-project-link"));
    expect(cards).toHaveLength(18);
    for (let index = 0; index < cards.length; index++) {
      const [, attrs, body] = cards[index];
      const links = [...body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)];
      expect(links).toHaveLength(1);
      const href = links[0][1].match(/href="([^"]*)"/)?.[1];
      expect(href).toBe(destinations[index % 9]);
      expect(publicRoutes).toContain(href);
      expect(links[0][1]).toMatch(/aria-label="[^"\n]+ — View [^"\n]+"/);
      expect(links[0][2]).not.toMatch(/<(?:a|button)\b/);
      if (index >= 9) { expect(attrs).toContain('aria-hidden="true"'); expect(links[0][1]).toContain('tabindex="-1"'); }
      else { expect(attrs).not.toContain('aria-hidden="true"'); expect(links[0][1]).not.toContain('tabindex="-1"'); }
    }
    expect(html).toContain("Explore our work");
    expect(html).toContain('href="#projects"');
    expect(html).toContain('href="#contact"');
  });

  it("renders the two New Builds tour examples as anchors while keeping the third informational", () => {
    const html = renderToStaticMarkup(createElement(NewBuildsPage));
    const cards = [...html.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/g)].map((match) => match[1]);
    expect(cards).toHaveLength(3);
    for (const [destination, title] of [["/projects/contemporary-ranch", "Space Efficient Homes"], ["/projects/mountain-modern", "Modern Homes"]]) {
      const anchor = html.match(new RegExp(`<a\\b[^>]*href="${destination}"[^>]*>[\\s\\S]*?</a>`))?.[0] ?? "";
      expect(anchor).toContain(title); expect(anchor).toContain("Home tour example");
      expect(anchor).toMatch(new RegExp(`aria-label="${title} — Home tour example: [^"]+"`));
    }
    const anchors = [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)].map((match) => match[0]);
    expect(cards[2]).toContain("Barns and Garages"); expect(cards[2]).not.toMatch(/<a\b/);
    expect(anchors.some((anchor) => anchor.includes("Barns and Garages"))).toBe(false);
  });

  it("carries elevator selection through validation, email, recovery and edited retry identity", () => {
    const request = { name: "QA Fictional Client", email: "fixture@example.com", phone: "9705550100", projectType: "Custom home",
      location: "Windsor", budget: "Still planning", timeline: "Still planning", message: "A fictional home elevator inquiry.", company: "" };
    const original = selectQuoteAttempt(null, request, 1000, () => "11111111-2222-4333-8444-555555555555");
    if (!original.ok) throw new Error("fixture");
    const changed = { ...request, projectType: "Custom elevator" };
    const edited = selectQuoteAttempt(original.attempt, changed, 2000, () => "11111111-2222-4333-8444-666666666666");
    if (!edited.ok) throw new Error("fixture");
    expect(edited.attempt.id).not.toBe(original.attempt.id);
    const parsed = parseQuoteRequestPayload(JSON.parse(edited.attempt.body));
    expect(parsed.success).toBe(true);
    const email = formatQuoteRequestEmail(changed); const recovery = buildQuoteRequestRecovery(changed);
    expect(email.text).toContain("Project type: Custom elevator"); expect(email.html).toContain("Custom elevator");
    expect(recovery.text).toContain("Project type: Custom elevator");
    const retried = selectQuoteAttempt(edited.attempt, changed, 3000, () => { throw new Error("Must reuse identity"); });
    expect(retried).toEqual({ ok: true, attempt: edited.attempt });
  });
});
