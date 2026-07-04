/** Client-side social-image (poster) renderer. Everything is drawn on the
 *  user's device with the Canvas 2D API — no network, no upload. */

export type PosterFormat = "square" | "story";

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

/**
 * The brand mark, loaded once from the same-origin `/logo.svg`. Same-origin
 * (and the SVG is self-contained) so drawing it never taints the canvas — the
 * PNG export keeps working. Cached across renders.
 */
let logoImg: HTMLImageElement | null = null;
function ensureLogoImage(onLoad: () => void): HTMLImageElement | null {
  if (typeof Image === "undefined") return null;
  if (!logoImg) {
    logoImg = new Image();
    logoImg.src = "/logo.svg";
  }
  if (!(logoImg.complete && logoImg.naturalWidth > 0)) {
    // Single handler; a later render overwrites it rather than stacking.
    logoImg.onload = onLoad;
  }
  return logoImg;
}

/** Simple gradient-tile + checkmark shown until the logo SVG has decoded. */
function drawFallbackTile(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  const grad = ctx.createLinearGradient(x, y, x, y + size);
  grad.addColorStop(0, C.sky);
  grad.addColorStop(1, C.skyDeep);
  roundRect(ctx, x, y, size, size, Math.round(size * 0.27));
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = C.tileInk;
  ctx.lineWidth = Math.round(size * 0.1);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(x + size * 0.28, y + size * 0.52);
  ctx.lineTo(x + size * 0.44, y + size * 0.67);
  ctx.lineTo(x + size * 0.72, y + size * 0.36);
  ctx.stroke();
}

function drawLogoTile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  redraw: () => void
): void {
  const img = ensureLogoImage(redraw);
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, x, y, size, size);
  } else {
    drawFallbackTile(ctx, x, y, size);
  }
}

/** Render the poster into `canvas`. Sizes the canvas to the chosen format. */
export function renderPoster(canvas: HTMLCanvasElement, opts: PosterOptions): void {
  const { w, h } = POSTER_SIZES[opts.format];
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Background + sky glow (top-right).
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, w, h);
  const glow = ctx.createRadialGradient(w * 0.82, h * 0.12, 0, w * 0.82, h * 0.12, w * 0.95);
  glow.addColorStop(0, "rgba(56,189,248,0.20)");
  glow.addColorStop(1, "rgba(56,189,248,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  const pad = Math.round(w * 0.093);

  // Wordmark row.
  const tile = Math.round(w * 0.092);
  drawLogoTile(ctx, pad, pad, tile, () => renderPoster(canvas, opts));
  ctx.fillStyle = C.ink;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = `600 ${Math.round(w * 0.036)}px ${SANS}`;
  ctx.fillText("CoTrackPro", pad + tile + Math.round(w * 0.03), pad + tile / 2);

  // Headline: shrink-to-fit (max 7 lines).
  const maxTextW = w - pad * 2;
  let fontSize = opts.format === "story" ? Math.round(w * 0.094) : Math.round(w * 0.08);
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
