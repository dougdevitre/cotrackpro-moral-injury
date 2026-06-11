/**
 * Stamp the CoTrackPro logo emblem onto the social Open Graph image.
 *
 * The 1200x630 card already carries the brand text/design; this composites the
 * real logo (on a white "chip") over the legacy header tile so the link preview
 * matches the in-app branding. Re-running is idempotent — the chip covers the
 * same spot each time.
 *
 * Run:  node scripts/make-og.mjs   (requires the `sharp` devDependency)
 */
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OG = resolve(root, "public/og.png");
const LOGO = resolve(root, "src/assets/cotrackpro-logo.jpg");

// Header chip geometry — aligned to the existing card's top-left tile.
const S = 88; // chip size
const PAD = 12; // inner padding around the emblem
const R = 20; // corner radius
const LEFT = 93;
const TOP = 92;

const b64 = readFileSync(LOGO).toString("base64");
const inner = S - PAD * 2;
const chipSvg = `<svg width="${S}" height="${S}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <rect width="${S}" height="${S}" rx="${R}" ry="${R}" fill="#ffffff"/>
  <image x="${PAD}" y="${PAD}" width="${inner}" height="${inner}" preserveAspectRatio="xMidYMid meet" xlink:href="data:image/jpeg;base64,${b64}"/>
</svg>`;

const chip = await sharp(Buffer.from(chipSvg)).png().toBuffer();
// Read the base fully before writing back to the same path.
const base = await sharp(OG).png().toBuffer();
await sharp(base)
  .composite([{ input: chip, left: LEFT, top: TOP }])
  .png()
  .toFile(OG);

console.log(`Stamped logo onto ${OG}`);
