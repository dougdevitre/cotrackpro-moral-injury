import type { StreakState } from "../types";

export const EMPTY_STREAK: StreakState = { lastDoneISO: null, count: 0, longest: 0 };

/** Local-time YYYY-MM-DD for a given date (defaults to now). */
export function todayISO(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Whole-day difference b - a for two YYYY-MM-DD strings (calendar days, TZ-safe). */
export function dayDiff(aISO: string, bISO: string): number {
  const [ay, am, ad] = aISO.split("-").map(Number);
  const [by, bm, bd] = bISO.split("-").map(Number);
  const a = Date.UTC(ay, am - 1, ad);
  const b = Date.UTC(by, bm - 1, bd);
  return Math.round((b - a) / 86_400_000);
}

/** Has the user already logged a reflection for `todayISO`? */
export function isDoneToday(state: StreakState, today: string): boolean {
  return state.lastDoneISO === today;
}

/**
 * The streak as it stands *today*: the stored count if the last log was today
 * or yesterday, otherwise 0 (the streak has lapsed but isn't yet re-counted).
 */
export function currentStreak(state: StreakState, today: string): number {
  if (!state.lastDoneISO) return 0;
  const d = dayDiff(state.lastDoneISO, today);
  return d === 0 || d === 1 ? state.count : 0;
}

/** Record a reflection for `today`, advancing, resetting, or no-op'ing the streak. */
export function markDone(state: StreakState, today: string): StreakState {
  if (state.lastDoneISO === today) return state; // already logged today
  const consecutive = state.lastDoneISO != null && dayDiff(state.lastDoneISO, today) === 1;
  const count = consecutive ? state.count + 1 : 1;
  return {
    lastDoneISO: today,
    count,
    longest: Math.max(state.longest, count),
  };
}
