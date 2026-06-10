/**
 * Moral-injury cost & dividend estimator — a transparent, EDUCATIONAL model.
 *
 * It turns an abstract moral-injury risk into two figures a practitioner or
 * leader can reason about: the estimated annual COST of unaddressed moral
 * injury, and the protective DIVIDEND from reducing it. Every coefficient is a
 * named constant and surfaced in the UI as an editable assumption — there are
 * no hidden multipliers. The defaults deliberately UNDER-claim (a conservative
 * fraction discounts the raw figure) so the number is a floor, not a headline.
 *
 * Pure and deterministic; nothing here touches storage, the DOM, or the network.
 */

/** How the estimate is scaled: one practitioner's caseload, or a population. */
export type CalcMode = "caseload" | "jurisdiction";

export interface CalcInputs {
  mode: CalcMode;
  /** caseload: cases handled per year. jurisdiction: practitioners/staff served. */
  scale: number;
  /** 0–100 baseline moral-injury exposure (auto-fills from a reflection). */
  exposurePct: number;
  /** Annual cost, in dollars, attributable to moral injury per unit of scale. */
  costFactor: number;
  /** 0–100 achievable protective reduction (auto-fills from a climate check). */
  reductionPct: number;
  /** 0–1 conservative multiplier applied to the raw cost (the "floor" lever). */
  conservativeFraction: number;
}

export interface CalcResult {
  /** Expected annual cost of unaddressed moral injury. */
  cost: number;
  /** Savings unlocked by the protective reduction. */
  dividend: number;
  /** What remains after the dividend. */
  residualCost: number;
  /** Low/high uncertainty band around the cost (not false precision). */
  low: number;
  high: number;
  /** Plain-language record of the assumptions that produced these numbers. */
  assumptions: string[];
}

/** Conservative-fraction default: a deliberately low multiplier (a floor). */
export const DEFAULT_CONSERVATIVE_FRACTION = 0.25;
/** Default achievable protective reduction when no climate signal is present. */
export const DEFAULT_REDUCTION_PCT = 30;
/** Default baseline exposure when no reflection is present. */
export const DEFAULT_EXPOSURE_PCT = 45;
/** ±band applied to the expected cost to communicate uncertainty. */
export const BAND_SPREAD = 0.35;

/** Mode-specific defaults for scale and the per-unit annual cost proxy. */
export const MODE_DEFAULTS: Record<CalcMode, { scale: number; costFactor: number }> = {
  // Per case: a small annual cost attributable to moral-injury-driven error,
  // rework, and reduced effectiveness for one practitioner.
  caseload: { scale: 300, costFactor: 120 },
  // Per affected staff member: turnover, absence, and lost productivity costs.
  jurisdiction: { scale: 50, costFactor: 9000 },
};

export function clampPct(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.min(100, Math.max(0, v));
}

export function clampFraction(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.min(1, Math.max(0, v));
}

function nonNegative(v: number): number {
  if (!Number.isFinite(v) || v < 0) return 0;
  return v;
}

/** Suggested inputs for a mode, before any reflection/climate auto-fill. */
export function defaultInputs(mode: CalcMode): CalcInputs {
  const d = MODE_DEFAULTS[mode];
  return {
    mode,
    scale: d.scale,
    exposurePct: DEFAULT_EXPOSURE_PCT,
    costFactor: d.costFactor,
    reductionPct: DEFAULT_REDUCTION_PCT,
    conservativeFraction: DEFAULT_CONSERVATIVE_FRACTION,
  };
}

/**
 * Map a 0–100 ethical-climate score to an achievable protective reduction.
 * A weaker climate implies MORE room to improve, so the available dividend is
 * larger; a strong climate has already captured much of it. Bounded to 5–60%.
 */
export function reductionFromClimate(overall: number): number {
  const room = 100 - clampPct(overall);
  return Math.min(60, Math.max(5, Math.round(room * 0.5)));
}

/** Raw, conservatively-discounted expected annual cost. */
export function estimateAnnualCost(i: CalcInputs): number {
  const scale = nonNegative(i.scale);
  const exposure = clampPct(i.exposurePct) / 100;
  const factor = nonNegative(i.costFactor);
  const fraction = clampFraction(i.conservativeFraction);
  return Math.round(scale * exposure * factor * fraction);
}

/** Savings from applying the protective reduction to the expected cost. */
export function estimateDividend(i: CalcInputs): number {
  return Math.round(estimateAnnualCost(i) * (clampPct(i.reductionPct) / 100));
}

/** Full result: cost, dividend, residual, an uncertainty band, and assumptions. */
export function compute(i: CalcInputs): CalcResult {
  const cost = estimateAnnualCost(i);
  const dividend = estimateDividend(i);
  const residualCost = Math.max(0, cost - dividend);
  const unit = i.mode === "caseload" ? "case" : "affected staff member";
  return {
    cost,
    dividend,
    residualCost,
    low: Math.round(cost * (1 - BAND_SPREAD)),
    high: Math.round(cost * (1 + BAND_SPREAD)),
    assumptions: [
      `${i.mode === "caseload" ? "Caseload" : "Population"}: ${nonNegative(i.scale)} ${
        i.mode === "caseload" ? "cases/year" : "practitioners/staff"
      }`,
      `Baseline moral-injury exposure: ${clampPct(i.exposurePct)}%`,
      `Annual cost per ${unit}: $${nonNegative(i.costFactor).toLocaleString()}`,
      `Conservative fraction (floor): ${Math.round(clampFraction(i.conservativeFraction) * 100)}%`,
      `Achievable protective reduction: ${clampPct(i.reductionPct)}%`,
    ],
  };
}
