import { createRequire } from "node:module";
import { expect } from "@playwright/test";

// The existing Next runtime includes sharp; this private QA helper adds no dependency.
const sharp = createRequire(new URL("../../package.json", import.meta.url))("sharp");

export function observeImages(page) {
  const responses = new Map();
  page.on("response", response => {
    if (new URL(response.url()).pathname !== "/_next/image") return;
    responses.set(response.url(), response.body().then(async bytes => {
      const metadata = await sharp(bytes).metadata();
      return { decodedWidth: metadata.width, decodedHeight: metadata.height, bytes: bytes.length, status: response.status() };
    }).catch(error => ({ error: error.message })));
  });
  return responses;
}

export async function measureImage(image, responses) {
  await image.scrollIntoViewIfNeeded();
  await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  const box = await image.evaluate(img => {
    const bounds = img.getBoundingClientRect(), style = getComputedStyle(img);
    const url = new URL(img.currentSrc);
    return { currentSrc: img.currentSrc, imagePath: url.searchParams.get("url"), requestedWidth: Number(url.searchParams.get("w")),
      alt: img.alt, width: bounds.width, height: bounds.height, sizes: img.sizes, loading: img.loading,
      objectFit: style.objectFit, objectPosition: style.objectPosition, dpr: devicePixelRatio };
  });
  await expect.poll(() => responses.has(box.currentSrc)).toBe(true);
  const response = await responses.get(box.currentSrc);
  expect(response.error).toBeUndefined(); expect(response.status).toBe(200);
  const density = Math.min(response.decodedWidth / box.width, response.decodedHeight / box.height);
  return { ...box, ...response, density };
}
