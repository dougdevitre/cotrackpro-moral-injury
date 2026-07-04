import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { logoTile, markSvg } from "./brand";

/** Normalized geometry fingerprint: every `d`, and every circle's cx/cy/r. */
function geometry(svg: string): string[] {
  // `(?<![A-Za-z])` so this matches the path `d="…"` but not the `d` inside `id="…"`.
  const ds = [...svg.matchAll(/(?<![A-Za-z])d="([^"]+)"/g)].map((m) =>
    m[1].replace(/\s+/g, " ").trim()
  );
  const circles = [...svg.matchAll(/<circle\b[^>]*>/g)].map((m) =>
    ["cx", "cy", "r"].map((a) => (m[0].match(new RegExp(`${a}="([^"]+)"`)) ?? [])[1]).join(",")
  );
  return [...ds, ...circles];
}

describe("print brand mark", () => {
  it("uses the same vector as public/logo.svg (single source of truth)", () => {
    const asset = readFileSync(
      fileURLToPath(new URL("../../../public/logo.svg", import.meta.url)),
      "utf8"
    );
    expect(geometry(markSvg())).toEqual(geometry(asset));
  });

  it("logoTile wraps the mark at the requested size", () => {
    expect(logoTile(48)).toContain(markSvg(48));
    expect(logoTile(48)).toContain("width:48px;height:48px");
  });
});
