import type { TriageTier } from "../../types";

/** CoTrackPro brand tokens for print documents (mirrors src/index.css). */
export const BRAND = {
  navy: "#0a0f1e",
  ink: "#0f172a",
  inkSoft: "#475569",
  line: "#e2e8f0",
  sky: "#0ea5e9",
  sky2: "#38bdf8",
  skyDeep: "#0284c7",
  amber: "#f59e0b",
  red: "#ef4444",
  green: "#10b981",
  indigo: "#6366f1",
  /** Geist-adjacent system stack — keeps prints on-brand with zero embedded fonts. */
  sans: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
} as const;

/** Severity ramp for the reflection meters (rank 0 minimal → 3 significant). */
export const BAND_PRINT_COLORS = [BRAND.sky2, BRAND.amber, "#f97316", BRAND.red] as const;

export const TIER_COLOR: Record<TriageTier, string> = {
  support: BRAND.sky,
  ethics: BRAND.indigo,
  repair: BRAND.green,
  systems: BRAND.amber,
};

/** Escape user-supplied text for safe interpolation into the HTML document. */
export function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * The CoTrackPro heart mark as inline SVG at the given pixel size. Single source
 * for every print/PDF surface (document headers, the CLE certificate) — inlined so
 * it prints without a network fetch. Kept visually in sync with `public/logo.svg`.
 */
export function markSvg(px = 34): string {
  return `<svg width="${px}" height="${px}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="CoTrackPro"><defs><linearGradient id="ctpMark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4aa8cb"/><stop offset="1" stop-color="#2f6690"/></linearGradient></defs><path d="M32 55C17.5 43.2 7 34.6 7 23.6 7 15.5 13 11 19.4 11 24.9 11 29.4 14.4 32 19 34.6 14.4 39.1 11 44.6 11 51 11 57 15.5 57 23.6 57 34.6 46.5 43.2 32 55Z" fill="#ffffff" stroke="#0b1b2b" stroke-width="4.6" stroke-linejoin="round"/><circle cx="24" cy="26.5" r="4.7" fill="url(#ctpMark)"/><circle cx="40" cy="24.8" r="5.5" fill="url(#ctpMark)"/><path d="M15.6 42.2c0-5.4 4.2-9.2 9.3-9.2 3 0 5.7 1.3 7.4 3.5 1.7-2.2 4.4-3.5 7.4-3.5 5.1 0 9.3 3.8 9.3 9.2v1.1H15.6Z" fill="url(#ctpMark)"/><path d="M25.2 40.6l4.3 4.3 8.9-8.9" fill="none" stroke="#ffffff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

/** The heart mark wrapped for a standard document header. */
export function logoTile(px = 34): string {
  return `<span style="display:inline-flex;width:${px}px;height:${px}px">${markSvg(px)}</span>`;
}

/** Short, non-credential id stamped on each document. */
export function makeDocId(prefix: string): string {
  return prefix + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}
