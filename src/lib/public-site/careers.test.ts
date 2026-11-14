import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe,it,expect,vi } from "vitest";
import CareersPage from "@/app/careers/page";
import PublicPage from "@/components/public-site/PublicPage";
import { publicPages } from "./content";
vi.mock("next/navigation",()=>({usePathname:()=>"/careers"}));
describe("careers application page and isolated shared defaults",()=>{
 it("renders the application in the initial page with proper labels and safe no-script fallback",()=>{
  const html=renderToStaticMarkup(createElement(CareersPage));
  expect(html).toContain('id="apply"');expect(html).toContain('action="/api/career-application"');expect(html).toContain('method="post"');expect(html).toContain('type="file"');expect(html).toContain('name="resume"');expect(html).toContain('accept=".pdf,.docx,');expect(html).toContain('fieldset disabled');expect(html).toContain("online form needs JavaScript");expect(html).toContain("info@kbuiltco.com");expect(html).not.toMatch(/Email Your Resume|Contact The Team|Ready to talk through a project/);expect(publicPages.careers.primaryCta?.href).toBe("/careers#apply");
 });
 it("preserves the default project closing CTA on other public pages",()=>{const html=renderToStaticMarkup(createElement(PublicPage,{content:publicPages.process}));expect(html).toContain("Ready to talk through a project?");expect(html).not.toContain('name="resume"');});
});
