import { describe, it, expect } from "vitest";
import { LONG_VIEW_PATHWAYS, LONG_VIEW_EVIDENCE } from "./longView";
import { ruleById } from "./rules";

describe("long view pathways", () => {
  it("has unique ids", () => {
    const ids = LONG_VIEW_PATHWAYS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every pathway all four ripple stages plus leverage", () => {
    for (const p of LONG_VIEW_PATHWAYS) {
      expect(p.shortTerm.length).toBeGreaterThan(0);
      expect(p.mechanism.length).toBeGreaterThan(0);
      expect(p.longTerm.length).toBeGreaterThan(0);
      expect(p.leverage.length).toBeGreaterThan(0);
    }
  });

  it("resolves any attached ruleId to a real rule", () => {
    for (const p of LONG_VIEW_PATHWAYS) {
      if (p.ruleId) expect(ruleById(p.ruleId), `pathway ${p.id}`).toBeDefined();
    }
  });

  it("uses probabilistic language, not deterministic 'will cause' claims", () => {
    for (const p of LONG_VIEW_PATHWAYS) {
      const text = `${p.mechanism} ${p.longTerm}`.toLowerCase();
      expect(text).not.toContain("will cause");
      expect(text).not.toContain("guaranteed");
    }
  });
});

describe("long view evidence", () => {
  it("links every source over https", () => {
    expect(LONG_VIEW_EVIDENCE.length).toBeGreaterThan(0);
    for (const e of LONG_VIEW_EVIDENCE) {
      expect(e.url.startsWith("https://")).toBe(true);
      expect(e.cite.length).toBeGreaterThan(0);
    }
  });
});
