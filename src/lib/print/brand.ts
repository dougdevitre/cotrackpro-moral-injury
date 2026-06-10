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

/** The sky-tile check mark, sized for a document header. */
export function logoTile(px = 34): string {
  return `<span style="display:inline-flex;width:${px}px;height:${px}px;border-radius:${Math.round(
    px * 0.27
  )}px;background:linear-gradient(${BRAND.sky2},${BRAND.skyDeep});align-items:center;justify-content:center">
    <svg width="${Math.round(px * 0.66)}" height="${Math.round(
    px * 0.66
  )}" viewBox="0 0 64 64"><path d="M20 33.5 L28.5 42 L45 24" fill="none" stroke="#04121f" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </span>`;
}

/** Short, non-credential id stamped on each document. */
export function makeDocId(prefix: string): string {
  return prefix + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}
