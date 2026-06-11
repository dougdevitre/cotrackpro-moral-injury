/** Client-side social-image (poster) renderer. Everything is drawn on the
 *  user's device with the Canvas 2D API — no network, no upload. The logo is an
 *  inlined data URI (see ../brand/logo), so drawing it never taints the canvas
 *  and the PNG download keeps working. */

import { LOGO_DATA_URI } from "../brand/logo";

export type PosterFormat = "square" | "story" | "og";

export interface PosterOptions {
  message: string;
  roleLabel: string;
  format: PosterFormat;
  /** Footer-right line; defaults to the moral-injury pledge tagline. */
  tagline?: string;
}

export const POSTER_SIZES: Record<PosterFormat, { w: number; h: number }> = {
  square: { w: 1080, h: 1080 },
  story: { w: 1080, h: 1920 },
  og: { w: 1200, h: 630 },
};

const SANS = `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;

const C = {
  bg: "#0a0f1e",
  ink: "#f8fafc",
  soft: "#94a3b8",
  sky: "#38bdf8",
  skyDeep: "#0284c7",
  tileInk: "#04121f",
};

/**
 * Greedy word-wrap. `measure` returns the rendered width of a candidate string,
 * so this stays pure and unit-testable without a real canvas context.
 */
export function wrapText(
  measure: (s: string) => number,
  text: string,
  maxWidth: number
): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    let line = "";
    for (const word of words) {
      const next = line ? line + " " + word : word;
      if (line && measure(next) > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    lines.push(line);
  }
  return lines;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Load the inlined logo once and reuse it across re-renders. A data-URI image
 *  decodes synchronously-ish and never taints the canvas. */
let logoPromise: Promise<HTMLImageElement> | null = null;
function loadLogo(): Promise<HTMLImageElement> {
  if (!logoPromise) {
    logoPromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = LOGO_DATA_URI;
    });
  }
  return logoPromise;
}

/** Draw the logo emblem inside a white rounded "chip", fit to `size` and
 *  preserving the emblem's aspect ratio. The chip reads cleanly on the dark
 *  poster background. */
function drawLogoChip(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  size: number
): void {
  roundRect(ctx, x, y, size, size, Math.round(size * 0.22));
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  const pad = size * 0.14;
  const box = size - pad * 2;
  const ar = img.naturalWidth / img.naturalHeight || 1;
  const dw = ar >= 1 ? box : box * ar;
  const dh = ar >= 1 ? box / ar : box;
  ctx.drawImage(img, x + (size - dw) / 2, y + (size - dh) / 2, dw, dh);
}

/** Render the poster into `canvas`. Sizes the canvas to the chosen format.
 *  Async because the logo image must decode before it can be drawn. */
export async function renderPoster(canvas: HTMLCanvasElement, opts: PosterOptions): Promise<void> {
  const { w, h } = POSTER_SIZES[opts.format];
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const logo = await loadLogo();

  // Background + sky glow (top-right).
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, w, h);
  const glow = ctx.createRadialGradient(w * 0.82, h * 0.12, 0, w * 0.82, h * 0.12, w * 0.95);
  glow.addColorStop(0, "rgba(56,189,248,0.20)");
  glow.addColorStop(1, "rgba(56,189,248,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  const pad = Math.round(w * 0.093);

  // Wordmark row: logo chip + "CoTrackPro" (the emblem carries no text).
  const tile = Math.round(w * 0.092);
  drawLogoChip(ctx, logo, pad, pad, tile);
  ctx.fillStyle = C.ink;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = `600 ${Math.round(w * 0.036)}px ${SANS}`;
  ctx.fillText("CoTrackPro", pad + tile + Math.round(w * 0.03), pad + tile / 2);

  // Headline: shrink-to-fit (max 7 lines). The wide OG card scales to its
  // height so the type doesn't overflow the short canvas.
  const maxTextW = w - pad * 2;
  let fontSize =
    opts.format === "story"
      ? Math.round(w * 0.094)
      : opts.format === "og"
        ? Math.round(h * 0.1)
        : Math.round(w * 0.08);
  ctx.font = `700 ${fontSize}px ${SANS}`;
  let lines = wrapText((s) => ctx.measureText(s).width, opts.message, maxTextW);
  while (lines.length > 7 && fontSize > 44) {
    fontSize -= 6;
    ctx.font = `700 ${fontSize}px ${SANS}`;
    lines = wrapText((s) => ctx.measureText(s).width, opts.message, maxTextW);
  }
  const lineH = Math.round(fontSize * 1.16);
  const blockH = lines.length * lineH;
  const startY = Math.round(h * 0.44 - blockH / 2);
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = C.ink;
  lines.forEach((ln, i) => ctx.fillText(ln, pad, startY + i * lineH + fontSize));

  // Accent rule.
  const ruleY = startY + blockH + Math.round(h * 0.028);
  ctx.fillStyle = C.sky;
  ctx.fillRect(pad, ruleY, Math.round(w * 0.13), Math.max(4, Math.round(w * 0.009)));

  // Role line.
  ctx.fillStyle = C.soft;
  ctx.font = `600 ${Math.round(w * 0.03)}px ${SANS}`;
  ctx.fillText(opts.roleLabel.toUpperCase(), pad, ruleY + Math.round(h * 0.052));

  // Footer.
  ctx.fillStyle = C.soft;
  ctx.font = `500 ${Math.round(w * 0.028)}px ${SANS}`;
  ctx.fillText("morality.cotrackpro.com", pad, h - pad);
  ctx.textAlign = "right";
  ctx.fillStyle = C.sky;
  ctx.fillText(opts.tagline ?? "A pledge to prevent moral injury", w - pad, h - pad);
}

/**
 * Download a canvas as a PNG on the user's device. Resolves false if the
 * browser couldn't produce a blob. Stays on-device — no upload.
 */
export function downloadCanvasPng(canvas: HTMLCanvasElement, filename: string): Promise<boolean> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(false);
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      resolve(true);
    }, "image/png");
  });
}
