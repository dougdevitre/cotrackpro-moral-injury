import { describe, it, expect } from "vitest";
import {
  clampFraction,
  clampPct,
  compute,
  defaultInputs,
  estimateAnnualCost,
  estimateDividend,
  reductionFromClimate,
  type CalcInputs,
} from "./costDividend";

const base: CalcInputs = {
  mode: "jurisdiction",
  scale: 100,
  exposurePct: 50,
  costFactor: 1000,
  reductionPct: 40,
  conservativeFraction: 0.5,
};

describe("clampPct / clampFraction", () => {
  it("bounds percentages to 0–100", () => {
    expect(clampPct(-10)).toBe(0);
    expect(clampPct(150)).toBe(100);
    expect(clampPct(42)).toBe(42);
    expect(clampPct(Number.NaN)).toBe(0);
  });
  it("bounds fractions to 0–1", () => {
    expect(clampFraction(-1)).toBe(0);
    expect(clampFraction(2)).toBe(1);
    expect(clampFraction(0.3)).toBe(0.3);
  });
});

describe("estimateAnnualCost", () => {
  it("multiplies scale × exposure × factor × fraction", () => {
    // 100 × 0.5 × 1000 × 0.5 = 25,000
    expect(estimateAnnualCost(base)).toBe(25000);
  });
  it("is zero when scale is zero", () => {
    expect(estimateAnnualCost({ ...base, scale: 0 })).toBe(0);
  });
  it("is zero at zero exposure and grows with exposure", () => {
    expect(estimateAnnualCost({ ...base, exposurePct: 0 })).toBe(0);
    expect(estimateAnnualCost({ ...base, exposurePct: 100 })).toBe(50000);
  });
  it("treats negative/NaN inputs as zero rather than negative cost", () => {
    expect(estimateAnnualCost({ ...base, scale: -5 })).toBe(0);
    expect(estimateAnnualCost({ ...base, costFactor: Number.NaN })).toBe(0);
  });
});

describe("estimateDividend", () => {
  it("is the reduction fraction of the cost", () => {
    // 25,000 × 0.40 = 10,000
    expect(estimateDividend(base)).toBe(10000);
  });
  it("is zero with no reduction and equals cost at full reduction", () => {
    expect(estimateDividend({ ...base, reductionPct: 0 })).toBe(0);
    expect(estimateDividend({ ...base, reductionPct: 100 })).toBe(estimateAnnualCost(base));
  });
});

describe("compute", () => {
  it("returns coherent cost / dividend / residual and a symmetric band", () => {
    const r = compute(base);
    expect(r.cost).toBe(25000);
    expect(r.dividend).toBe(10000);
    expect(r.residualCost).toBe(15000);
    expect(r.low).toBeLessThan(r.cost);
    expect(r.high).toBeGreaterThan(r.cost);
    expect(r.assumptions.length).toBeGreaterThan(0);
  });
  it("never reports a negative residual", () => {
    const r = compute({ ...base, reductionPct: 100 });
    expect(r.residualCost).toBe(0);
  });
});

describe("reductionFromClimate", () => {
  it("gives a weaker climate a larger achievable reduction", () => {
    expect(reductionFromClimate(30)).toBeGreaterThan(reductionFromClimate(80));
  });
  it("stays within the 5–60% bounds", () => {
    expect(reductionFromClimate(100)).toBe(5);
    expect(reductionFromClimate(0)).toBe(50);
    expect(reductionFromClimate(-20)).toBeLessThanOrEqual(60);
  });
});

describe("defaultInputs", () => {
  it("differs by mode and is internally consistent", () => {
    const c = defaultInputs("caseload");
    const j = defaultInputs("jurisdiction");
    expect(c.mode).toBe("caseload");
    expect(j.mode).toBe("jurisdiction");
    expect(c.costFactor).not.toBe(j.costFactor);
    expect(compute(c).cost).toBeGreaterThan(0);
  });
});
