/** The three dimensions of a team's moral environment. */
export type ClimateDim = "safe" | "load" | "backed";

export interface ClimateItem {
  id: string;
  dim: ClimateDim;
  /** Positively-worded statement; higher agreement = healthier climate. */
  text: string;
}

export type ClimateBandKey = "strong" | "mixed" | "at-risk";

export interface ClimateBand {
  key: ClimateBandKey;
  label: string;
}

export interface ClimateResult {
  /** 0–100 per dimension. */
  perDim: Record<ClimateDim, number>;
  /** 0–100 overall (equal weight across dimensions). */
  overall: number;
  /** The dimension most in need of attention (lowest score). */
  lowest: ClimateDim;
  band: ClimateBand;
}

export const CLIMATE_DIMS: { key: ClimateDim; label: string }[] = [
  { key: "safe", label: "Safe to speak" },
  { key: "load", label: "Sustainable load" },
  { key: "backed", label: "Integrity is backed" },
];

const DIM_LABEL: Record<ClimateDim, string> = {
  safe: "Safe to speak",
  load: "Sustainable load",
  backed: "Integrity is backed",
};

export function dimLabel(dim: ClimateDim): string {
  return DIM_LABEL[dim];
}

function band(overall: number): ClimateBand {
  if (overall >= 70) return { key: "strong", label: "Strong climate" };
  if (overall >= 40) return { key: "mixed", label: "Mixed climate" };
  return { key: "at-risk", label: "At-risk climate" };
}

/**
 * Score a completed climate check. Each answer is 0–4 (strongly disagree →
 * strongly agree); a dimension's score is the mean of its items scaled to 0–100.
 * Pure and deterministic.
 */
export function scoreClimate(
  items: ClimateItem[],
  answers: Record<string, number>
): ClimateResult {
  const dims: ClimateDim[] = ["safe", "load", "backed"];
  const perDim = {} as Record<ClimateDim, number>;

  for (const dim of dims) {
    const inDim = items.filter((it) => it.dim === dim);
    if (inDim.length === 0) {
      perDim[dim] = 0;
      continue;
    }
    const sum = inDim.reduce((acc, it) => acc + (answers[it.id] ?? 0), 0);
    perDim[dim] = Math.round((sum / (inDim.length * 4)) * 100);
  }

  const overall = Math.round((perDim.safe + perDim.load + perDim.backed) / 3);
  const lowest = dims.reduce((lo, d) => (perDim[d] < perDim[lo] ? d : lo), dims[0]);

  return { perDim, overall, lowest, band: band(overall) };
}
