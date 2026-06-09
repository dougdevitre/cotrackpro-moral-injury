import type { PracticePlan } from "../types";

/**
 * Opt-in, ON-DEVICE-ONLY persistence for the practice plan.
 * Nothing here is ever transmitted. Storage is used only after the user opts in,
 * and `clear()` fully removes it. All access is wrapped so a blocked or
 * unavailable localStorage (private mode, embedded contexts) degrades silently.
 */
const KEY = "cotrackpro.mi.plan";
const CONSENT_KEY = "cotrackpro.mi.persist";

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
  } catch {
    /* no-op */
  }
}
