import type { MoralWin, PracticePlan, StreakState } from "../types";
import type { ClimateDim } from "./climate";
import type { CalcInputs, CalcMode } from "./costDividend";

/** Non-personal aggregate left behind by a completed leaders' climate check. */
export interface ClimateSignal {
  /** 0–100 overall climate score (no item-level answers, no names). */
  overall: number;
  lowest: ClimateDim;
  dateISO: string;
}

/**
 * Opt-in, ON-DEVICE-ONLY persistence for the practice plan.
 * Nothing here is ever transmitted. Storage is used only after the user opts in,
 * and `clear()` fully removes it. All access is wrapped so a blocked or
 * unavailable localStorage (private mode, embedded contexts) degrades silently.
 */
const KEY = "cotrackpro.mi.plan";
const CONSENT_KEY = "cotrackpro.mi.persist";
const WELCOME_KEY = "cotrackpro.mi.welcomed";
const STREAK_KEY = "cotrackpro.mi.streak";
const WINS_KEY = "cotrackpro.mi.wins";
const CLIMATE_KEY = "cotrackpro.mi.climate";
const CALC_KEY = "cotrackpro.mi.calculator";

export function storageAvailable(): boolean {
  try {
    const t = "__mi_test__";
    window.localStorage.setItem(t, "1");
    window.localStorage.removeItem(t);
    return true;
  } catch {
    return false;
  }
}

export function hasConsent(): boolean {
  try {
    return window.localStorage.getItem(CONSENT_KEY) === "1";
  } catch {
    return false;
  }
}

export function setConsent(on: boolean, plan?: PracticePlan): void {
  try {
    if (on) {
      window.localStorage.setItem(CONSENT_KEY, "1");
      if (plan) savePlan(plan);
    } else {
      clear();
    }
  } catch {
    /* no-op */
  }
}

export function loadPlan(): PracticePlan | null {
  try {
    if (!hasConsent()) return null;
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PracticePlan;
    if (
      Array.isArray(parsed.commitments) &&
      Array.isArray(parsed.habitIds) &&
      Array.isArray(parsed.customHabits)
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function savePlan(plan: PracticePlan): void {
  try {
    if (!hasConsent()) return;
    window.localStorage.setItem(KEY, JSON.stringify(plan));
  } catch {
    /* no-op */
  }
}

export function clear(): void {
  try {
    window.localStorage.removeItem(KEY);
    window.localStorage.removeItem(CONSENT_KEY);
    window.localStorage.removeItem(WELCOME_KEY);
    window.localStorage.removeItem(STREAK_KEY);
    window.localStorage.removeItem(WINS_KEY);
    window.localStorage.removeItem(CLIMATE_KEY);
    window.localStorage.removeItem(CALC_KEY);
  } catch {
    /* no-op */
  }
}

/**
 * Moral-wins log — user-written content, so (like the practice plan) it is only
 * persisted once the user has opted into on-device storage. Never transmitted.
 */
export function loadWins(): MoralWin[] {
  try {
    if (!hasConsent()) return [];
    const raw = window.localStorage.getItem(WINS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MoralWin[];
    if (
      Array.isArray(parsed) &&
      parsed.every(
        (w) => typeof w?.id === "string" && typeof w?.text === "string" && typeof w?.dateISO === "string"
      )
    ) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

export function saveWins(wins: MoralWin[]): void {
  try {
    if (!hasConsent()) return;
    window.localStorage.setItem(WINS_KEY, JSON.stringify(wins));
  } catch {
    /* no-op */
  }
}

/**
 * On-device daily-reflection streak. Holds only counts and a date (no reflection
 * content), never leaves the device, and is removed by `clear()`.
 */
export function loadStreak(): StreakState | null {
  try {
    const raw = window.localStorage.getItem(STREAK_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as StreakState;
    if (
      (p.lastDoneISO === null || typeof p.lastDoneISO === "string") &&
      typeof p.count === "number" &&
      typeof p.longest === "number"
    ) {
      return p;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveStreak(state: StreakState): void {
  try {
    window.localStorage.setItem(STREAK_KEY, JSON.stringify(state));
  } catch {
    /* no-op */
  }
}

/**
 * Non-personal, on-device flag recording that the first-run welcome has been
 * seen. Kept separate from plan consent: it stores no reflection data, only a
 * "1", and (like everything here) never leaves the device.
 */
export function hasWelcomed(): boolean {
  try {
    return window.localStorage.getItem(WELCOME_KEY) === "1";
  } catch {
    return false;
  }
}

export function markWelcomed(): void {
  try {
    window.localStorage.setItem(WELCOME_KEY, "1");
  } catch {
    /* no-op */
  }
}

/**
 * Last completed climate-check signal. Holds only the aggregate 0–100 score and
 * a date (no item answers, no names) so the calculator can suggest an achievable
 * protective reduction. Like the streak, it is on-device only and cleared by
 * `clear()`.
 */
export function loadClimateSignal(): ClimateSignal | null {
  try {
    const raw = window.localStorage.getItem(CLIMATE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as ClimateSignal;
    if (
      typeof p.overall === "number" &&
      typeof p.lowest === "string" &&
      typeof p.dateISO === "string"
    ) {
      return p;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveClimateSignal(signal: ClimateSignal): void {
  try {
    window.localStorage.setItem(CLIMATE_KEY, JSON.stringify(signal));
  } catch {
    /* no-op */
  }
}

/**
 * Calculator inputs — these are user settings (caseload, cost factors), so they
 * follow the same opt-in rule as the practice plan: only persisted once the user
 * has consented to on-device storage, and removed by `clear()`.
 */
export function loadCalc(): CalcInputs | null {
  try {
    if (!hasConsent()) return null;
    const raw = window.localStorage.getItem(CALC_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as CalcInputs;
    const modes: CalcMode[] = ["caseload", "jurisdiction"];
    if (
      modes.includes(p.mode) &&
      typeof p.scale === "number" &&
      typeof p.exposurePct === "number" &&
      typeof p.costFactor === "number" &&
      typeof p.reductionPct === "number" &&
      typeof p.conservativeFraction === "number"
    ) {
      return p;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveCalc(inputs: CalcInputs): void {
  try {
    if (!hasConsent()) return;
    window.localStorage.setItem(CALC_KEY, JSON.stringify(inputs));
  } catch {
    /* no-op */
  }
}
