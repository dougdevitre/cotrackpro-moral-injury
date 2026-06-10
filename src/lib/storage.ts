import type { PracticePlan, StreakState } from "../types";

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
