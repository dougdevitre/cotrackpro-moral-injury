import type { CustomHabit, Habit, LongViewPathway, PracticePlan, ScoreProfile, Subscale } from "../types";
import { HABITS, habitById } from "../data/habits";

/** "When X, then I will Y" — a readable implementation intention. */
export function formatIntention(cue: string, then: string): string {
  const c = cue.trim().replace(/[.,;]$/, "");
  const t = then.trim();
  return `${c}, then ${t}`;
}

/** Returns the dominant exposure subscale (SELF/WITNESS/BETRAYAL) for a profile. */
export function dominantExposure(profile: ScoreProfile): Subscale {
  const { sub } = profile.scores;
  const order: Subscale[] = ["SELF", "WITNESS", "BETRAYAL"];
  return order.reduce((best, k) => (sub[k] > sub[best] ? k : best), order[0]);
}

/**
 * Suggests habits for a reflection profile (or a sensible default set if none).
 * Ordering: habits tagged with the dominant exposure subscale first, then
 * distress-tagged (if distress is elevated), then "all" habits.
 */
export function suggestHabits(profile: ScoreProfile | null, limit = 6): Habit[] {
  if (!profile) {
    return HABITS.filter((h) => h.tags.includes("all")).slice(0, limit);
  }
  const dom = dominantExposure(profile);
  const distressHigh = profile.scores.distress >= 50;

  const score = (h: Habit): number => {
    let s = 0;
    if (h.tags.includes(dom)) s += 3;
    if (distressHigh && h.tags.includes("DISTRESS")) s += 2;
    if (h.tags.includes("all")) s += 1;
    return s;
  };

  return [...HABITS]
    .map((h) => ({ h, s: score(h) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.h)
    .slice(0, limit);
}

/** Resolves all intentions in a plan (library + custom) to readable strings. */
export function planIntentions(plan: PracticePlan): string[] {
  const fromLibrary = plan.habitIds
    .map(habitById)
    .filter((h): h is Habit => Boolean(h))
    .map((h) => formatIntention(h.cue, h.then));
  const fromCustom = plan.customHabits.map((c) => formatIntention(c.cue, c.then));
  return [...fromLibrary, ...fromCustom];
}

export function isPlanEmpty(plan: PracticePlan): boolean {
  return plan.commitments.length === 0 && plan.habitIds.length === 0 && plan.customHabits.length === 0;
}

/** Converts a Long-view pathway into its addable if-then habit. */
export function pathwayToHabit(pathway: LongViewPathway): CustomHabit {
  return { cue: pathway.habit.cue.trim(), then: pathway.habit.then.trim() };
}

/** True if an equivalent custom habit (same cue + then) is already in the plan. */
export function hasCustomHabit(plan: PracticePlan, habit: CustomHabit): boolean {
  return plan.customHabits.some(
    (c) => c.cue.trim() === habit.cue.trim() && c.then.trim() === habit.then.trim()
  );
}

/** Exports the plan as Markdown for copy / download. */
export function buildPlanMarkdown(plan: PracticePlan): string {
  const lines: string[] = ["# My ethics practice plan", ""];

  if (plan.commitments.length) {
    lines.push("## Commitments", "");
    plan.commitments.forEach((c) => lines.push(`- ${c}`));
    lines.push("");
  }

  const intentions = planIntentions(plan);
  if (intentions.length) {
    lines.push("## If-then habits", "");
    intentions.forEach((i) => lines.push(`- ${i}`));
    lines.push("");
  }

  lines.push(
    "---",
    "_A private practice plan. Educational and reflective only — not legal advice. Stored on your device unless you export it._"
  );
  return lines.join("\n");
}

/* ------------------------------- ICS export ------------------------------- */

function escapeIcs(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

/** Folds a content line to <=75 octets per RFC 5545 (continuation with space). */
function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const parts: string[] = [];
  let rest = line;
  parts.push(rest.slice(0, 75));
  rest = rest.slice(75);
  while (rest.length > 74) {
    parts.push(" " + rest.slice(0, 74));
    rest = rest.slice(74);
  }
  if (rest.length) parts.push(" " + rest);
  return parts.join("\r\n");
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Floating local datetime stamp: YYYYMMDDTHHMMSS (no timezone, no Z). */
function floatingStamp(d: Date): string {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
}

/** UTC stamp for DTSTAMP/UID: YYYYMMDDTHHMMSSZ. */
function utcStamp(d: Date): string {
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

/**
 * Builds a valid .ics for a weekly recurring "ethics check-in" whose description
 * carries the full practice plan. Uses a floating (local) start so it lands at
 * the same wall-clock time wherever the user is. `now` is injectable for tests.
 */
export function buildIcs(plan: PracticePlan, now: Date = new Date()): string {
  // Next occurrence: tomorrow at 09:00 local.
  const start = new Date(now);
  start.setDate(start.getDate() + 1);
  start.setHours(9, 0, 0, 0);
  const end = new Date(start);
  end.setMinutes(15);

  const intentions = planIntentions(plan);
  const descParts: string[] = [];
  if (plan.commitments.length) {
    descParts.push("Commitments:");
    plan.commitments.forEach((c) => descParts.push("- " + c));
  }
  if (intentions.length) {
    if (descParts.length) descParts.push("");
    descParts.push("If-then habits:");
    intentions.forEach((i) => descParts.push("- " + i));
  }
  if (!descParts.length) descParts.push("Take a few minutes to check in on your ethical practice.");
  const description = escapeIcs(descParts.join("\n"));

  const uid = `mi-${now.getTime()}@cotrackpro`;

  const raw = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CoTrackPro//Moral Injury Reflection//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${utcStamp(now)}`,
    `DTSTART:${floatingStamp(start)}`,
    `DTEND:${floatingStamp(end)}`,
    "RRULE:FREQ=WEEKLY",
    "SUMMARY:Ethics practice check-in",
    `DESCRIPTION:${description}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT10M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Ethics practice check-in",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return raw.map(foldLine).join("\r\n");
}
