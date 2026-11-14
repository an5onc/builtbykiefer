import { readFile, readdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { join, dirname, relative } from "node:path";

const require = createRequire(new URL("../../package.json", import.meta.url));
const ts = require("typescript"), sharp = require("sharp");
const moduleURL = source => "data:text/javascript;base64," + Buffer.from(ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText).toString("base64");

// Derive expected rendering from the selected immutable source, never the dirty root.
export async function contentFixture(candidateRoot) {
  const businessURL = moduleURL(await readFile(join(candidateRoot, "src/lib/public-site/business.ts"), "utf8"));
  const contentCode = await readFile(join(candidateRoot, "src/lib/public-site/content.ts"), "utf8");
  const { publicPages } = await import(moduleURL(contentCode.replace('"./business"', JSON.stringify(businessURL))));
  const illustrationSource = await readFile(join(candidateRoot, "src/components/wall-comparison/WallIllustration.tsx"), "utf8");
  const renders = Object.fromEntries([...illustrationSource.matchAll(/^  (stick|sip|heat): "([^"]+)"/gm)].map(match => [match[1], match[2]]));
  if (!renders.stick || !renders.sip || !renders.heat) throw new Error("Selected wall illustration assets are missing.");
  // One semantic role=img labels these four decorative layers. Keep their exact
  // order/paths/empty alts in the existing full-image comparison; do not filter them out.
  const wallImages = [renders.stick, renders.heat, renders.heat, renders.sip].map(image => ({ image, alt: "" }));
  const app = join(candidateRoot, "src/app"), routes = [];
  for (const path of (await readdir(app, { recursive: true })).filter(path => path.endsWith("page.tsx"))) {
    const code = await readFile(join(app, path), "utf8");
    const key = code.match(/content=\{publicPages\.(\w+)\}/)?.[1];
    if (!key) continue;
    const content = publicPages[key];
    routes.push({ path: "/" + relative(app, dirname(join(app, path))), images: [
      { image: content.heroImage, alt: content.heroAlt },
      ...(content.cards ?? []).filter(x => x.image).map(x => ({ image: x.image, alt: x.imageAlt })),
      ...(content.sections ?? []).flatMap(x => x.feature === "wall-comparison" ? wallImages : x.image ? [{ image: x.image, alt: x.imageAlt }] : []),
    ], links: (content.cards ?? []).filter(x => x.href).map(x => ({ href: x.href, label: x.meta ? `${x.title} — ${x.meta}` : x.title })) });
  }
  const dimensions = {};
  const elevatorSource = await readFile(join(app, "services/custom-elevators/page.tsx"), "utf8");
  const elevatorPhotos = [...elevatorSource.matchAll(/\bsrc: "([^"]+)"/g)].map(match => match[1]);
  for (const image of [...new Set(routes.flatMap(route => route.images.map(x => x.image)).concat(elevatorPhotos))]) {
    const metadata = await sharp(join(candidateRoot, "public", image)).metadata();
    dimensions[image] = { width: metadata.width, height: metadata.height };
  }
  return { routes, dimensions };
}
