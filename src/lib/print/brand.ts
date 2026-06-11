import type { TriageTier } from "../../types";
import { LOGO_DATA_URI } from "../brand/logo";

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

/** The CoTrackPro logo emblem on a white "chip", sized for a document header.
 *  Inlined as a data URI so it survives the blob: print window (where relative
 *  asset paths don't resolve). The hairline keeps the white chip defined on the
 *  white PDF pages too. */
export function logoImg(px = 30): string {
  const pad = Math.round(px * 0.14);
  const r = Math.round(px * 0.22);
  return `<span style="display:inline-flex;align-items:center;justify-content:center;width:${px}px;height:${px}px;padding:${pad}px;border-radius:${r}px;background:#ffffff;border:1px solid ${BRAND.line};-webkit-print-color-adjust:exact;print-color-adjust:exact"><img src="${LOGO_DATA_URI}" alt="CoTrackPro" width="${
    px - pad * 2
  }" height="${px - pad * 2}" style="display:block;object-fit:contain" /></span>`;
}

/** Short, non-credential id stamped on each document. */
export function makeDocId(prefix: string): string {
  return prefix + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}
