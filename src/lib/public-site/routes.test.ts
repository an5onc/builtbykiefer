import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { publicRoutes } from "./routes";

function collectAppRoutes(directory: string, targetFile: string, routePrefix = ""): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      return collectAppRoutes(entryPath, targetFile, `${routePrefix}/${entry.name}`);
    }

    return entry.isFile() && entry.name === targetFile ? [routePrefix || "/"] : [];
  });
}

describe("public route manifest", () => {
  it("lists every retained page once and points to a page file", () => {
    expect(new Set(publicRoutes).size).toBe(publicRoutes.length);

    for (const route of publicRoutes) {
      const routeDirectory = route === "/" ? "" : route.slice(1);
      const pageFile = join(process.cwd(), "src", "app", routeDirectory, "page.tsx");
      expect(existsSync(pageFile), `${route} should have ${pageFile}`).toBe(true);
    }

    const appDirectory = join(process.cwd(), "src", "app");
    expect(collectAppRoutes(appDirectory, "page.tsx").sort()).toEqual([...publicRoutes].sort());
    expect(collectAppRoutes(appDirectory, "route.ts")).toEqual(["/api/quote-request"]);
  });

  it("does not expose retired application surfaces", () => {
    expect(publicRoutes.join(" ")).not.toMatch(
      /\/(?:admin|auth|demo-slider|estimate|login|portal|project-timelines|vendor)(?:\/|\s|$)/,
    );

    for (const root of [process.cwd(), join(process.cwd(), "src")]) {
      for (const file of ["middleware.ts", "middleware.js", "proxy.ts", "proxy.js"]) {
        expect(existsSync(join(root, file)), `${file} should not exist`).toBe(false);
      }
    }
  });
});
