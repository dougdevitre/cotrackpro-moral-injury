import { describe, it, expect } from "vitest";
import type { PracticePlan, ScoreProfile, Scores } from "../types";
import {
  buildIcs,
  buildPlanMarkdown,
  dominantExposure,
  formatIntention,
  hasCustomHabit,
  isPlanEmpty,
  pathwayToHabit,
  planIntentions,
  suggestHabits,
} from "./practice";
import { LONG_VIEW_PATHWAYS } from "../data/longView";

function profile(sub: Partial<Scores["sub"]>, distress = 0): ScoreProfile {
  const base = { SELF: 0, WITNESS: 0, BETRAYAL: 0, DISTRESS: distress };
  const merged = { ...base, ...sub, DISTRESS: distress };
  const exposure = Math.round((merged.SELF + merged.WITNESS + merged.BETRAYAL) / 3);
  const scores: Scores = { sub: merged, exposure, distress };
  return { scores, roleId: "attorney" };
}

describe("formatIntention", () => {
  it("joins cue and response into a readable if-then", () => {
    expect(formatIntention("When I am tired", "I will pause")).toBe("When I am tired, then I will pause");
  });
  it("strips trailing punctuation from the cue", () => {
    expect(formatIntention("When I am tired.", "I will pause")).toBe("When I am tired, then I will pause");
  });
});

describe("dominantExposure", () => {
  it("picks the highest exposure subscale", () => {
    expect(dominantExposure(profile({ SELF: 80, WITNESS: 20, BETRAYAL: 10 }))).toBe("SELF");
    expect(dominantExposure(profile({ SELF: 10, WITNESS: 20, BETRAYAL: 70 }))).toBe("BETRAYAL");
  });
});

describe("suggestHabits", () => {
  it("returns a default set when no profile is given", () => {
    const out = suggestHabits(null, 4);
    expect(out.length).toBe(4);
    expect(out.every((h) => h.tags.includes("all"))).toBe(true);
  });

  it("prioritizes habits tagged with the dominant subscale", () => {
    const out = suggestHabits(profile({ WITNESS: 90 }), 6);
    expect(out[0].tags).toContain("WITNESS");
  });

  it("surfaces a distress habit when distress is high", () => {
    const out = suggestHabits(profile({ SELF: 60 }, 80), 8);
    expect(out.some((h) => h.tags.includes("DISTRESS"))).toBe(true);
  });
});

describe("plan helpers", () => {
  const plan: PracticePlan = {
    commitments: ["Center the child in every filing"],
    habitIds: ["h-reread"],
    customHabits: [{ cue: "When billing tempts me", then: "I will stop" }],
  };

  it("detects an empty plan", () => {
    expect(isPlanEmpty({ commitments: [], habitIds: [], customHabits: [] })).toBe(true);
    expect(isPlanEmpty(plan)).toBe(false);
  });

  it("resolves library + custom intentions", () => {
    const out = planIntentions(plan);
    expect(out.length).toBe(2);
    expect(out[1]).toContain("then I will stop");
  });

  it("renders markdown with both sections", () => {
    const md = buildPlanMarkdown(plan);
    expect(md).toContain("## Commitments");
    expect(md).toContain("## If-then habits");
    expect(md).toContain("Center the child");
  });
});

describe("buildIcs", () => {
  const fixedNow = new Date("2026-06-08T12:00:00Z");
  const plan: PracticePlan = {
    commitments: ["Be candid with the tribunal; semicolons, commas\\ included"],
    habitIds: ["h-weekly-review"],
    customHabits: [],
  };

  it("produces a well-formed VCALENDAR with a weekly rule and an alarm", () => {
    const ics = buildIcs(plan, fixedNow);
    expect(ics.startsWith("BEGIN:VCALENDAR")).toBe(true);
    expect(ics.trimEnd().endsWith("END:VCALENDAR")).toBe(true);
    expect(ics).toContain("RRULE:FREQ=WEEKLY");
    expect(ics).toContain("BEGIN:VALARM");
    expect(ics).toContain("SUMMARY:Ethics practice check-in");
    expect(ics).toContain("\r\n"); // CRLF line endings
  });

  it("escapes special characters in the description", () => {
    const ics = buildIcs(plan, fixedNow);
    expect(ics).toContain("\\;");
    expect(ics).toContain("\\,");
    expect(ics).toContain("\\\\");
  });

  it("schedules the first occurrence for the day after `now`", () => {
    const ics = buildIcs(plan, fixedNow);
    // 2026-06-08 -> next day 2026-06-09 at 09:00 local floating time
    expect(ics).toMatch(/DTSTART:20260609T0900/);
  });
});

describe("pathwayToHabit + hasCustomHabit", () => {
  it("every long-view pathway yields a well-formed if-then habit", () => {
    for (const p of LONG_VIEW_PATHWAYS) {
      const h = pathwayToHabit(p);
      expect(h.cue.length).toBeGreaterThan(0);
      expect(h.then.toLowerCase().startsWith("i will")).toBe(true);
    }
  });

  it("detects a duplicate custom habit regardless of surrounding whitespace", () => {
    const h = pathwayToHabit(LONG_VIEW_PATHWAYS[0]);
    const plan = { commitments: [], habitIds: [], customHabits: [{ cue: ` ${h.cue} `, then: `${h.then} ` }] };
    expect(hasCustomHabit(plan, h)).toBe(true);
    expect(hasCustomHabit({ commitments: [], habitIds: [], customHabits: [] }, h)).toBe(false);
  });
});
