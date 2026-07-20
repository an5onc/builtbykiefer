import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  SITE_URL,
  SOCIAL_IMAGE,
  SOCIAL_IMAGE_HEIGHT,
  SOCIAL_IMAGE_URL,
  SOCIAL_IMAGE_WIDTH,
  homeMetadata,
  localBusinessSchema,
} from "./seo";

/**
 * Expected values are written as literals rather than imported from the module
 * under test. Asserting `SOCIAL_IMAGE === SOCIAL_IMAGE` would be tautological:
 * editing the constant would silently move the assertion with it. Pinning the
 * literals here means any change to the shipped image has to be made twice,
 * deliberately, and shows up in review.
 */
const EXPECTED_IMAGE_PATH = "/og-image.jpg";
const EXPECTED_IMAGE_URL = "https://www.builtbykiefer.com/og-image.jpg";
const EXPECTED_WIDTH = 1200;
const EXPECTED_HEIGHT = 630;

/**
 * The image that previously shipped in these tags. It is no longer used
 * anywhere on the redesigned homepage, so its reappearance in any social or
 * structured-data surface is a regression.
 */
const STALE_IMAGE = "exterior-1.jpg";

const socialImagePath = join(process.cwd(), "public", EXPECTED_IMAGE_PATH);

/**
 * Reads intrinsic dimensions from a JPEG by walking its segment markers to the
 * Start Of Frame, which carries the real height and width.
 *
 * Done by hand rather than via a dependency: the repository has no image
 * utility, and this needs to read one field from one known-format file.
 */
function readJpegDimensions(buffer: Buffer): { width: number; height: number } {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    throw new Error("not a JPEG: missing SOI marker (0xFFD8)");
  }

  let offset = 2;

  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      throw new Error(`malformed JPEG: expected marker at byte ${offset}`);
    }

    const marker = buffer[offset + 1];

    // Start Of Frame markers carry the frame dimensions. 0xC4 (DHT), 0xC8
    // (JPG extension), and 0xCC (DAC) sit in the same numeric range but are
    // not frame headers.
    const isStartOfFrame =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;

    if (isStartOfFrame) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }

    // Otherwise skip this segment: 2 marker bytes plus the declared length.
    offset += 2 + buffer.readUInt16BE(offset + 2);
  }

  throw new Error("malformed JPEG: no Start Of Frame segment found");
}

/**
 * Every place a social or structured-data consumer looks for the homepage
 * image. Open Graph and Twitter carry root-relative paths that Next resolves
 * against metadataBase; JSON-LD carries an absolute URL.
 */
function collectImageSurfaces() {
  const openGraphImages = homeMetadata.openGraph?.images;
  const twitterImages = homeMetadata.twitter?.images;

  return {
    openGraph: Array.isArray(openGraphImages) ? openGraphImages[0] : undefined,
    twitter: Array.isArray(twitterImages) ? twitterImages[0] : undefined,
    jsonLd: localBusinessSchema.image,
  };
}

describe("homepage social image metadata", () => {
  it("points Open Graph at the current social image", () => {
    const { openGraph } = collectImageSurfaces();

    expect(
      openGraph,
      "homeMetadata.openGraph.images[0] is missing — Open Graph has no image",
    ).toBeDefined();

    const image = openGraph as { url: string; width?: number; height?: number };

    expect(
      image.url,
      `og:image should be ${EXPECTED_IMAGE_PATH}; a changed path means link previews point somewhere new`,
    ).toBe(EXPECTED_IMAGE_PATH);

    expect(
      SOCIAL_IMAGE,
      "the SOCIAL_IMAGE constant drifted from the expected shipped asset",
    ).toBe(EXPECTED_IMAGE_PATH);
  });

  it("points the Twitter card at the current social image", () => {
    const { twitter } = collectImageSurfaces();

    expect(
      twitter,
      "homeMetadata.twitter.images[0] is missing — the Twitter card has no image",
    ).toBeDefined();

    expect(
      twitter,
      `twitter:image should be ${EXPECTED_IMAGE_PATH}; a changed path means Twitter cards diverge from Open Graph`,
    ).toBe(EXPECTED_IMAGE_PATH);
  });

  it("points LocalBusiness JSON-LD at the current social image", () => {
    expect(
      localBusinessSchema.image,
      `LocalBusiness JSON-LD image should be the absolute ${EXPECTED_IMAGE_URL}; Google requires an absolute URL here`,
    ).toBe(EXPECTED_IMAGE_URL);

    expect(
      SOCIAL_IMAGE_URL,
      "the SOCIAL_IMAGE_URL constant drifted from the expected shipped asset",
    ).toBe(EXPECTED_IMAGE_URL);
  });

  it("keeps Open Graph, Twitter, and JSON-LD on the same asset", () => {
    const { openGraph, twitter, jsonLd } = collectImageSurfaces();
    const openGraphUrl = (openGraph as { url: string }).url;

    expect(
      openGraphUrl,
      "og:image and twitter:image disagree — social previews would differ by platform",
    ).toBe(twitter);

    expect(
      jsonLd,
      "JSON-LD image and og:image disagree — Google and social previews would show different photos",
    ).toBe(`${SITE_URL}${openGraphUrl}`);

    expect(
      jsonLd,
      "JSON-LD image is not the expected absolute URL for the shipped asset",
    ).toBe(EXPECTED_IMAGE_URL);
  });

  it("declares dimensions that match the real file on disk", () => {
    expect(
      existsSync(socialImagePath),
      `${socialImagePath} is missing — every social surface would 404 and previews would fall back or break`,
    ).toBe(true);

    const { width, height } = readJpegDimensions(readFileSync(socialImagePath));

    expect(
      { width, height },
      `public${EXPECTED_IMAGE_PATH} is ${width}x${height} but metadata declares ` +
        `${EXPECTED_WIDTH}x${EXPECTED_HEIGHT}. Clients such as iMessage lay the card ` +
        "out from the declared values, so a mismatch mis-crops the preview. Re-crop the asset " +
        "or correct og:image:width / og:image:height.",
    ).toEqual({ width: EXPECTED_WIDTH, height: EXPECTED_HEIGHT });
  });

  it("declares those same dimensions in the Open Graph tags", () => {
    const { openGraph } = collectImageSurfaces();
    const image = openGraph as { width?: number; height?: number };

    expect(
      { width: image.width, height: image.height },
      "og:image:width / og:image:height must match the real file dimensions asserted above, " +
        "otherwise the declared size can drift from the actual asset untested",
    ).toEqual({ width: EXPECTED_WIDTH, height: EXPECTED_HEIGHT });

    expect(
      { width: SOCIAL_IMAGE_WIDTH, height: SOCIAL_IMAGE_HEIGHT },
      "the exported dimension constants drifted from the expected shipped asset",
    ).toEqual({ width: EXPECTED_WIDTH, height: EXPECTED_HEIGHT });
  });

  it("references no stale image in any metadata or structured-data surface", () => {
    const serialized = JSON.stringify({ homeMetadata, localBusinessSchema });

    expect(
      serialized.includes(STALE_IMAGE),
      `${STALE_IMAGE} reappeared in homepage metadata or JSON-LD. It is not used anywhere on ` +
        "the redesigned homepage, so previews would again show a house that is not on the page.",
    ).toBe(false);
  });
});
