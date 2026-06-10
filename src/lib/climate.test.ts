import { describe, expect, it } from "vitest";
import { scoreClimate, type ClimateItem } from "./climate";

const ITEMS: ClimateItem[] = [
  { id: "s1", dim: "safe", text: "" },
  { id: "s2", dim: "safe", text: "" },
  { id: "l1", dim: "load", text: "" },
  { id: "l2", dim: "load", text: "" },
  { id: "b1", dim: "backed", text: "" },
  { id: "b2", dim: "backed", text: "" },
];

describe("scoreClimate", () => {
  it("scores a perfect climate as 100 / strong", () => {
    const answers = Object.fromEntries(ITEMS.map((i) => [i.id, 4]));
    const r = scoreClimate(ITEMS, answers);
    expect(r.perDim).toEqual({ safe: 100, load: 100, backed: 100 });
    expect(r.overall).toBe(100);
    expect(r.band.key).toBe("strong");
  });

  it("scores all-zero as 0 / at-risk", () => {
    const r = scoreClimate(ITEMS, {});
    expect(r.overall).toBe(0);
    expect(r.band.key).toBe("at-risk");
  });

  it("identifies the lowest dimension and a mixed band", () => {
    const answers = {
      s1: 4, s2: 4, // safe = 100
      l1: 1, l2: 1, // load = 25  (lowest)
      b1: 3, b2: 3, // backed = 75
    };
    const r = scoreClimate(ITEMS, answers);
    expect(r.perDim).toEqual({ safe: 100, load: 25, backed: 75 });
    expect(r.lowest).toBe("load");
    expect(r.overall).toBe(67);
    expect(r.band.key).toBe("mixed");
  });
});
