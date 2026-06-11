import { BRAND, esc, logoImg } from "./brand";
import { download } from "../download";

export type PageSize = "letter portrait" | "letter landscape";

export interface DocOptions {
  /** Document <title> and filename stem. */
  title: string;
  /** Small uppercase eyebrow above the headline. */
  kicker: string;
  /** Large headline. */
  heading: string;
  /** Optional sub-line under the heading. */
  sub?: string;
  /** Pre-rendered HTML for the body. */
  body: string;
  /** Disclaimer line in the footer. */
  footnote: string;
  /** Short non-credential id shown in the footer. */
  docId?: string;
  size?: PageSize;
  accent?: string;
  theme?: "light" | "dark";
}

/** Build a self-contained, print-optimized HTML document in the CoTrackPro brand. */
export function renderDocument(o: DocOptions): string {
  const size = o.size ?? "letter portrait";
  const accent = o.accent ?? BRAND.sky;
  const dark = o.theme === "dark";
  const bg = dark ? BRAND.navy : "#ffffff";
  const ink = dark ? "#eef3fa" : BRAND.ink;
  const inkSoft = dark ? "#a6b6cf" : BRAND.inkSoft;
  const line = dark ? "rgba(148,163,184,0.26)" : BRAND.line;
  const idLine = o.docId
    ? `<p class="docid">${esc(o.title)} · ${esc(o.docId)} · generated on this device</p>`
    : "";
  // Dark documents look dark on screen but print as legible ink-on-white, so the
  // PDF is readable even when the browser's "Background graphics" option is off.
  const pageMargin = "0.6in";
  const printPad = "10px 0";

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<title>${esc(o.title)}</title>
<style>
  @page { size: ${size}; margin: ${pageMargin}; }
  * { box-sizing: border-box; }
  html, body { margin: 0; }
  body {
    font-family: ${BRAND.sans};
    color: ${ink};
    background: ${bg};
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    line-height: 1.55;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    font-feature-settings: "kern" 1, "liga" 1;
  }
  .sheet { max-width: 760px; margin: 0 auto; padding: 40px 48px; }
  .brand { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; break-after: avoid; }
  .brandname { font-weight: 700; letter-spacing: -0.02em; font-size: 16px; color: ${ink}; }
  .kick { letter-spacing: 0.2em; text-transform: uppercase; font-size: 11px; color: ${accent}; font-weight: 700; margin: 0; }
  h1.doc { font-size: 28px; margin: 6px 0 4px; letter-spacing: -0.015em; color: ${ink}; break-after: avoid; }
  .sub { font-size: 14.5px; color: ${inkSoft}; margin: 0 0 6px; max-width: 60ch; }
  .accent-rule { width: 200px; border-top: 3px solid ${accent}; margin: 16px 0 22px; }
  h2.sec { font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; color: ${accent}; font-weight: 700; margin: 24px 0 10px; break-after: avoid; }
  p { margin: 0 0 10px; orphans: 3; widows: 3; }
  .avoid { break-inside: avoid; page-break-inside: avoid; }
  .docid { margin-top: 22px; font-size: 11px; color: ${inkSoft}; }
  .disc { font-size: 10.5px; color: ${inkSoft}; line-height: 1.5; margin-top: 14px; border-top: 1px solid ${line}; padding-top: 12px; break-inside: avoid; }
  .noprint { background: ${accent}; color: #04121f; font-family: ${BRAND.sans}; font-size: 13px; text-align: center; padding: 9px 14px; font-weight: 600; }
  @media print { .noprint { display: none; } .sheet { padding: ${printPad}; } }${
    dark
      ? `
  @media print {
    body { background: #ffffff; color: ${BRAND.ink}; }
    .brandname, h1.doc { color: ${BRAND.ink}; }
    .sub, .docid, .disc { color: ${BRAND.inkSoft}; }
    .sheet p, .sheet blockquote { color: ${BRAND.ink} !important; }
    .disc { border-top-color: ${BRAND.line}; }
  }`
      : ""
  }
</style></head>
<body>
  <div class="noprint">Print or “Save as PDF” from your browser’s dialog. For full color, enable “Background graphics.”</div>
  <div class="sheet">
    <div class="brand">${logoImg(34)}<span class="brandname">CoTrackPro</span></div>
    <p class="kick">${esc(o.kicker)}</p>
    <h1 class="doc">${esc(o.heading)}</h1>
    ${o.sub ? `<p class="sub">${esc(o.sub)}</p>` : ""}
    <div class="accent-rule"></div>
    ${o.body}
    ${idLine}
    <p class="disc">${esc(o.footnote)}</p>
  </div>
</body></html>`;
}

/**
 * Open a generated document in a new tab and trigger the print dialog. Falls back
 * to a file download if the popup is blocked. No inline scripts (CSP-safe) and no
 * network — printing is driven from the opener via the same-origin blob handle.
 */
export function openPrintable(html: string, filename: string): void {
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const w = window.open(url, "_blank");
  if (!w) {
    download(filename, html, "text/html");
    URL.revokeObjectURL(url);
    return;
  }
  w.addEventListener("load", () => {
    setTimeout(() => {
      try {
        w.print();
      } catch {
        /* user can still print manually */
      }
    }, 300);
  });
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
