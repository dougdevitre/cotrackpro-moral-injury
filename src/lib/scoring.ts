import type { Answers, Band, Item, Scores, Subscale } from "../types";
import { MAX_VALUE } from "../content/config";

export function bandOf(v: number): Band {
  if (v < 25) return { key: "minimal", label: "Minimal", rank: 0 };
  if (v < 50) return { key: "emerging", label: "Emerging", rank: 1 };
  if (v < 75) return { key: "significant", label: "Significant", rank: 2 };
  return { key: "severe", label: "Severe", rank: 3 };
}

function normalize(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round((sum / (values.length * MAX_VALUE)) * 100);
}

/**
 * Computes the two indices and four subscale scores from the answered items.
 * Exposure deliberately EXCLUDES the DISTRESS subscale — exposure and outcome
 * are kept separate (Nash et al., 2013; Plouffe et al., 2023).
 */
export function computeScores(items: Item[], answers: Answers): Scores {
  const bySub: Record<Subscale, number[]> = { SELF: [], WITNESS: [], BETRAYAL: [], DISTRESS: [] };

  for (const it of items) {
    const v = answers[it.id];
    if (typeof v === "number") bySub[it.sub].push(v);
  }

  const sub: Record<Subscale, number> = {
    SELF: normalize(bySub.SELF),
    WITNESS: normalize(bySub.WITNESS),
    BETRAYAL: normalize(bySub.BETRAYAL),
    DISTRESS: normalize(bySub.DISTRESS),
  };

  const exposure = normalize([...bySub.SELF, ...bySub.WITNESS, ...bySub.BETRAYAL]);
  const distress = sub.DISTRESS;

  return { sub, exposure, distress };
}

export const BAND_COLORS = ["#6c958b", "#7f9a52", "#9e7a35", "#a85a45"] as const;
